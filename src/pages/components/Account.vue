<!--
 * @Description: 账户表格和分页
 * @Author: Ronda
 * @Date: 2021-05-13 16:54:55
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 14:17:20
-->
<template>
  <div class="user-list">
    <!-- 搜索表单 -->
    <el-form size="mini" :inline="true">
      <el-form-item>
        <el-date-picker
          v-model="searchForm.time"
          value-format="timestamp"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          align="right"
        ></el-date-picker>
      </el-form-item>
      <!-- 类型 -->
      <el-form-item>
        <el-select v-if="type=='员工'" v-model="searchForm.type" clearable placeholder="请选择类型">
          <el-option v-for="item in waiType" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-else-if="type=='顾客'" v-model="searchForm.type" clearable placeholder="请选择类型">
          <el-option v-for="item in cusType" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-else v-model="searchForm.type" clearable placeholder="请选择类型">
          <el-option v-for="item in sysType" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item>
        <el-select v-model="searchForm.status" clearable placeholder="请选择状态">
          <el-option label="正常" value="正常" />
          <el-option label="未审核" value="未审核" />
        </el-select>
      </el-form-item>
      <!-- 用户编号和员工编号 -->
      <el-form-item v-if="type!='系统'">
        <el-select filterable v-model="searchForm.userId" clearable :placeholder="type+'编号'">
          <el-option
            v-for="item in usersData"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索表单 -->
    <!-- 表格 -->
    <el-table v-loading="loading" size="mini" :data="tableData" stripe style="width: 100%">
      <el-table-column align="center" prop="id" label="编号" width="80px" />
      <el-table-column align="center" prop="transferMoney" label="交易金额" />
      <el-table-column prop="logTime" label="交易时间" align="center">
        <template slot-scope="scope">
          <span>{{ moment(scope.row.transferTime).format('YYYY-MM-DD HH:mm:SS') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="type" label="交易类型" />
      <!-- <el-table-column align="center" prop="userId" label="用户编号" /> -->
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.status=='正常'?'success':'danger'"
          >{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="description" label="描述" />
    </el-table>
    <!-- 表格 -->
    <!-- 分页 -->
    <div class="pagination-div">
      <el-pagination
        size="mini"
        :current-page="params.page"
        :page-sizes="[2,5,10, 15, 20]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 分页 -->
  </div>
</template>
<script>
import { pageQuery as pageQueryUsers } from "@/api/user";
import { roles } from "@/utils/config";
const moment = require("moment");
import {
  pageQueryCustomerAccount,
  pageQueryEmployeeAccount,
  pageQuerySystemAccount,
} from "@/api/account";
export default {
  props: ["type"],
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      // 所有的员工或顾客数据
      usersData: [],
      /* * 员工账单状态：正常，未审核  类型：收益，提现
       * 顾客账单状态：正常，未审核  类型：充值，消费
       * 系统账单状态：正常，未审核  类型：充值，收益，提现 */
      // 员工账单类型
      waiType: ["收益", "提现"],
      // 顾客账单类型
      cusType: ["充值", "消费"],
      // 系统账单类型
      sysType: ["充值", "收益", "提现"],
      loading: false,
      searchForm: {},
      params: {
        page: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
    };
  },
  computed: {},
  watch: {
    params: {
      handler() {
        this.queryData();
      },
      deep: true,
    },
  },
  created() {
    this.queryData();
    // 获取所有的员工或顾客数据
    this.queryUserData();
  },
  methods: {
    moment,
    /**
     * @description: 分页每页条数发生变化的回调
     * @param {*} val  当前条数值
     * @return {*}
     */
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.params.page = 1;
    },
    /**
     * @description: 页码发生变化的回调
     * @param {*} val  当前条数值
     * @return {*}
     */
    handleCurrentChange(val) {
      this.params.page = val;
    },
    /**
     * @description: 查询数据
     * @param {*}
     * @return {*}
     */
    async queryData() {
      this.loading = true;
      for (const key in this.searchForm) {
        if (!this.searchForm[key]) {
          delete this.searchForm[key];
        }
      }
      let tempObj = { ...this.searchForm };
      // 对时间进行处理为后台需要的数据
      if (tempObj.time) {
        tempObj.beginTime = tempObj.time[0];
        tempObj.endTime = tempObj.time[1];
        delete tempObj.time;
      }
      if (this.type == "顾客") {
        const res = await pageQueryCustomerAccount({
          ...this.params,
          ...tempObj,
        });
        this.tableData = res.data.list;
        this.total = res.data.total;
      } else if (this.type == "员工") {
        const res = await pageQueryEmployeeAccount({
          ...this.params,
          ...tempObj,
        });
        this.tableData = res.data.list;
        this.total = res.data.total;
      } else if (this.type == "系统") {
        const res = await pageQuerySystemAccount({
          ...this.params,
          ...tempObj,
        });
        this.tableData = res.data.list;
        this.total = res.data.total;
      }
      this.loading = false;
    },
    /**
     * @description: 获取所有的员工或顾客数据
     * @param {*}
     * @return {*}
     */
    async queryUserData() {
      let roleId = "";
      if (this.type == "员工") {
        roleId = roles.waiter;
      } else if (this.type == "顾客") {
        roleId = roles.customer;
      }
      if (roleId) {
        let res = await pageQueryUsers({
          page: 1,
          pageSize: 1000,
          roleId,
        });
        this.usersData = res.data.list;
      }
    },
    /**
     * @description: 查询数据
     * @param {*}
     * @return {*}
     */
    toSearch() {
      this.params.page = 1;
      this.queryData();
    },
  },
};
</script>
