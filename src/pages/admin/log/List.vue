<!--
 * @Description: 日志管理
 * @Author: Ronda
 * @Date: 2021-05-13 15:32:43
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 14:45:28
-->
<template>
  <div>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" size="mini">
      <el-table-column type="index" :index="1" label="序号" width="55" align="center" />
      <el-table-column prop="realname" label="访问人真实姓名" align="center" />
      <el-table-column prop="method" label="访问方式" align="center" />
      <el-table-column prop="content" label="访问路径" />
      <el-table-column prop="logTime" label="访问时间" align="center">
        <template slot-scope="scope">
          <span>{{ moment(scope.row.logTime).format('YYYY-MM-DD HH:mm:SS') }}</span>
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
const moment = require("moment");
import { pageQuery } from "@/api/log";
export default {
  // 组件名称
  name: "BaseConfig",
  // 组件状态值
  data() {
    return {
      // 表格展示的分页的系统配置信息的数据
      tableData: [],
      // 总条数
      total: 0,
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
     * @description: 查询所有系统配置信息
     * @param {*}
     * @return {*}
     */
    async queryData() {
      this.loading = true;
      const res = await pageQuery(this.params);
      this.tableData = res.data.list || [];
      this.total = res.data.total || 0;
      this.loading = false;
    },
  },
};
</script>

