<!--
 * @Description: 订单管理
 * @Author: Ronda
 * @Date: 2021-05-14 16:57:33
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 14:46:00
-->
<template>
  <div class="custermer">
    <el-tabs v-model="activeName" @tab-click="toChangeTab">
      <el-tab-pane label="所有订单" name="first">
        <OrderList ref="first" status></OrderList>
      </el-tab-pane>
      <el-tab-pane label="待支付" name="second">
        <OrderList ref="second" status="待支付"></OrderList>
      </el-tab-pane>
      <el-tab-pane label="待派单" name="third">
        <OrderList ref="third" status="待派单"></OrderList>
      </el-tab-pane>
      <el-tab-pane label="待接单" name="fourth">
        <OrderList ref="fourth" status="待接单"></OrderList>
      </el-tab-pane>
      <el-tab-pane label="待服务" name="five">
        <OrderList ref="five" status="待服务"></OrderList>
      </el-tab-pane>
      <el-tab-pane label="待确认" name="six">
        <OrderList ref="six" status="待确认"></OrderList>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="seven">
        <OrderList ref="seven" status="待确认"></OrderList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import OrderList from "@/pages/components/OrderList";
export default {
  components: { OrderList },
  data() {
    return {
      tableData: [],
      activeName: "first",
    };
  },
  created() {},
  computed: {},
  methods: {
    /**
     * @description: 选项卡切换
     * @param {*}
     * @return {*}
     */
    toChangeTab() {
      this.$refs[this.activeName].queryData();
    },
  },
};
</script>
