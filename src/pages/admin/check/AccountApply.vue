<!--
 * @Description: 账户变动审核
 * @Author: Ronda
 * @Date: 2021-05-26 11:21:53
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-27 10:59:19
-->
<template>
  <div>
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
        <el-select v-model="searchForm.applyType" clearable placeholder="请选择类型">
          <el-option v-for="item in applyType" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item>
        <el-select v-model="searchForm.status" clearable placeholder="请选择状态">
          <el-option v-for="item in applyStatus" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <!-- 申请人编号 -->
      <el-form-item>
        <el-input v-model="searchForm.userId" placeholder="申请人编号" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 搜索表单 -->
    <!-- 表格 -->
    <el-table v-loading="loading" :data="currentData" size="mini">
      <el-table-column type="index" :index="1" label="序号" width="55" />
      <el-table-column prop="userId" label="申请人编号" />
      <el-table-column prop="applyTime" label="申请时间" width="160">
        <template slot-scope="scope">
          <span>{{ moment(scope.row.applyTime).format('YYYY-MM-DD HH:mm:SS') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyType" label="变更类型" />
      <!-- <el-table-column prop="money" label="变更资金" /> -->
      <el-table-column align="center" prop="money" label="变更资金">
        <template v-slot="scope">
          ￥
          <span class="red_info_money">{{scope.row.money}}</span>
          元
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="变更原因" width="200" />
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status=='通过'" size="mini" type="success">{{ scope.row.status }}</el-tag>
          <el-tag
            v-else-if="scope.row.status=='不通过'"
            size="mini"
            type="danger"
          >{{ scope.row.status }}</el-tag>
          <el-tag v-else size="mini" type="info">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <a
            v-if="scope.row.status=='未审核'"
            class="blue_info"
            type="text"
            size="small"
            @click.prevent="toChangeStatus(scope.row,'通过')"
          >通过</a>
          <a
            v-if="scope.row.status=='未审核'"
            class="red_info"
            type="text"
            size="small"
            @click.prevent="toChangeStatus(scope.row,'不通过')"
          >不通过</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <div class="pagination-div">
      <el-pagination
        :current-page="params.page"
        :page-sizes="[2,5,10, 15, 20]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
const moment = require("moment");
import {
  checkPass,
  checkNoPass,
  pageQueryAccountApply,
} from "@/api/accountApply";

export default {
  // 组件名称
  name: "AccountApply",
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data() {
    return {
      applyStatus: ["通过", "不通过", "未审核"],
      // 账户变更类型
      applyType: ["充值", "提现"],
      searchForm: {},
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
      // 总条数
      total: 0,
      currentData: [],
      loading: false,
      // 给后台的分页的参数
      params: {
        page: 1,
        pageSize: 10,
      },
    };
  },
  computed: {},
  // 侦听器
  watch: {
    params: {
      handler() {
        this.queryData();
      },
      deep: true,
    },
  },
  created() {
    // 分页查询实名认证
    this.queryData();
  },
  methods: {
    moment,
    /**
     * @description: 修改状态
     * @param {*} id
     * @param {*} status
     * @return {*}
     */
    async toChangeStatus(row, status) {
      const temp = {
        id: row.id,
      };
      let res = {};
      if (status == "通过") {
        res = await checkPass(temp);
      } else {
        res = await checkNoPass(temp);
      }
      this.$message({ type: "success", message: res.message });
      // 重载数据
      this.queryData();
    },
    /**
     * @description: 分页查询所有实名认证
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
      const res = await pageQueryAccountApply({
        ...this.params,
        ...tempObj,
      });
      this.currentData = res.data.list || [];
      this.total = res.data.total || 0;
      this.loading = false;
    },
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
    toSearch() {
      this.params.page = 1;
      this.queryData();
    },
  },
};
</script>

