<!--
 * @Description: 订单表格和分页和派单
 * @Author: Ronda
 * @Date: 2021-05-14 17:09:02
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 11:07:20
-->
<template>
  <div>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
      <el-table-column align="center" prop="id" label="订单编号" width="80" />
      <el-table-column align="center" prop="orderTime" label="下单时间">
        <template v-slot="scope">{{moment(scope.row.orderTime).format("YYYY-MM-DD HH:mm:ss")}}</template>
      </el-table-column>
      <el-table-column align="center" prop="total" label="总价">
        <template v-slot="scope">
          ￥
          <span class="red_info_money">{{scope.row.total}}</span>
          元
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status=='待派单'" type="success">{{scope.row.status}}</el-tag>
          <el-tag v-else-if="scope.row.status=='待接单'" type="warning">{{scope.row.status}}</el-tag>
          <el-tag v-else type="info">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="customerId" label="顾客ID" />
      <el-table-column
        v-if="status!=='待派单'&&status!=='待支付'"
        align="center"
        prop="employeeId"
        label="员工ID"
      >
        <template v-slot="scope">{{scope.row.employeeId ||'--' }}</template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" class="black_info" size="small" @click="toDetails(scope.row.id)">详情</el-button>
          <el-button
            class="green_info"
            v-show="scope.row.status==='待派单'"
            type="text"
            size="small"
            @click="toSend(scope.row.id)"
          >派单</el-button>
          <el-button
            class="warning_info"
            v-show="scope.row.status==='待接单'"
            type="text"
            size="small"
            @click="toCancelSend(scope.row.id)"
          >取消派单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->
    <!-- 分页 -->
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
    <!-- 模态框 -->
    <el-dialog title="派单" :visible.sync="visible">
      <div class="radio-div" v-for="r in waiterData" :key="r.id">
        <el-radio border v-model="form.waiterId" :label="r.id">{{ r.username}} {{r.realname }}</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="toSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 模态框 -->
  </div>
</template>

<script>
import { pageQuery, sendOrder, cancelSendOrder } from "@/api/order";
import { pageQuery as pageQueryAllWaiter } from "@/api/user";
import { roles } from "@/utils/config";
const moment = require("moment");
export default {
  props: ["status"],
  data() {
    return {
      tableData: [],
      total: 0,
      // 给后台的分页的参数
      params: {
        page: 1,
        pageSize: 10,
      },
      title: "派单",
      waiterData: [],
      visible: false,
      // 派单的数据
      form: {},
      loading: false,
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
  methods: {
    moment,
    // 关闭模态框
    close() {
      this.visible = false;
    },
    /**
     * @description: 获取数据
     * @param {*}
     * @return {*}
     */
    async queryData() {
      this.loading = true;
      let temp = { ...this.params };
      if (this.status) {
        temp.status = this.status;
      }
      let res = await pageQuery(temp);
      this.tableData = res.data.list;
      this.total = res.data.total;
      this.loading = false;
    },
    /**
     * @description: 订单详情
     * @param {*} id
     * @return {*}
     */
    toDetails(id) {
      this.$router.push({
        path: "/admin/order/details",
        query: { detail: id },
      });
    },
    /**
     * @description: 派单按钮
     * @param {*}
     * @return {*}
     */
    async toSend(id) {
      let res = await pageQueryAllWaiter({
        page: 1,
        pageSize: 1000,
        roleId: roles.waiter,
      });
      this.waiterData = res.data.list;
      this.form.orderId = id;
      this.visible = true;
    },
    /**
     * @description: 取消派单
     * @param {*} id
     * @return {*}
     */
    async toCancelSend(id) {
      let res = await cancelSendOrder({ orderId: id });
      this.$message({
        showClose: true,
        message: res.message,
        type: "success",
      });
      this.queryData();
    },
    /**
     * @description: 保存派单
     * @param {*}
     * @return {*}
     */
    async toSubmit() {
      let res = await sendOrder(this.form);
      this.visible = false;
      this.$message({
        showClose: true,
        message: res.message,
        type: "success",
      });
      this.queryData();
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
  },
  created() {
    this.queryData();
  },
  mounted() {},
};
</script>
<style scoped>
</style>
