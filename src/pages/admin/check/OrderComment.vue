<!--
 * @Description:
 * @Author: Ronda
 * @Date: 2021-05-13 16:09:16
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-27 17:16:16
-->
<template>
  <div>
    <div class="btns">
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-input v-model="searchForm.content" placeholder="请输入关键字" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.orderId" placeholder="请输入订单编号" clearable />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" clearable placeholder="请选择状态">
            <el-option label="未审核" value="未审核" />
            <el-option label="通过" value="通过" />
            <el-option label="不通过" value="不通过" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="toSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="currentData" size="mini">
      <el-table-column type="index" :index="1" label="序号" width="55" align="center" />
      <el-table-column prop="content" label="评论内容" align="center" />
      <el-table-column prop="customerId" label="顾客编号" align="center" />
      <el-table-column prop="orderId" label="订单编号" align="center" />
      <el-table-column align="center" prop="commentTime" label="评论时间">
        <template v-slot="scope">{{moment(scope.row.commentTime).format("YYYY-MM-DD HH:mm:ss")}}</template>
      </el-table-column>
      <el-table-column prop="status" label="评论状态" align="center">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status==='未审核'" size="small">未审核</el-tag>
          <el-tag type="success" v-if="scope.row.status==='通过'" size="small">通过</el-tag>
          <el-tag type="danger" v-if="scope.row.status==='不通过'" size="small">不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <a class="warning_info" type="text" size="small" @click="toDelete(scope.row.id)">删除</a>
          <a
            v-if="scope.row.status==='未审核'"
            class="green_info"
            type="text"
            size="small"
            @click="toChangeStatus(scope.row.id,'通过')"
          >通过</a>
          <a
            v-if="scope.row.status==='未审核'"
            class="red_info"
            type="text"
            size="small"
            @click="toChangeStatus(scope.row.id,'不通过')"
          >不通过</a>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- /表格 -->
  </div>
</template>

<script>
import {
  pageQuery,
  deleteById,
  checkPass,
  checkNoPass,
} from "@/api/orderComment";
const moment = require("moment");
export default {
  // 组件名称
  name: "",
  // 组件状态值
  data() {
    return {
      // 表格展示的分页的系统配置信息的数据
      currentData: [],
      // 总条数
      total: 0,
      searchForm: {},
      // 给后台的分页的参数
      params: {
        page: 1,
        pageSize: 10,
      },
      // 加载中
      loading: false,
    };
  },
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
    this.queryData();
  },
  methods: {
    moment,
    /**
     * @description: 表格切换选中与否
     * @param {*} val
     * @return {*}
     */
    handleSelectionChange(val) {
      this.ids = val.map((item) => item.id);
    },
    /**
     * @description: 分页每页条数发生变化的回调
     * @param {*} val  当前条数值
     * @return {*}
     */
    handleSizeChange(val) {
      this.params.pageSize = val;
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
     * @description: 查询所有系统配置信息
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
      const res = await pageQuery({ ...this.params, ...this.searchForm });
      this.currentData = res.data.list || [];
      this.total = res.data.total || 0;
      this.loading = false;
    },
    /**
     * @description: 删除按钮的事件
     * @param {*} id
     * @return {*}
     */
    toDelete(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await deleteById({ id });
        this.$message({ type: "success", message: res.message });
        this.queryData();
      });
    },
    /**
     * @description: 修改状态
     * @param {*} id
     * @param {*} status
     * @return {*}
     */
    async toChangeStatus(id, status) {
      let res = {};
      if (status == "通过") {
        res = await checkPass({ id });
      } else {
        res = await checkNoPass({ id });
      }
      this.$message({ type: "success", message: res.message });
      this.queryData(); // 重载数据
    },
    /**
     * @description: 查询按钮
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

