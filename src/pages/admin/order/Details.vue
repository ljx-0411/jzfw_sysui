<!--
 * @Description: 订单详情
 * @Author: Ronda
 * @Date: 2021-05-14 16:57:33
 * @LastEditors: ZachGmy
 * @LastEditTime: 2021-06-30 13:39:31
-->
<template>
  <div class="details">
    <el-link type="primary" @click="toBack">返回</el-link>
    <br />
    <br />
    <el-table :data="orderbyid.orderLines||[]" stripe style="width: 100%">
      <el-table-column align="center" prop="id" label="订单项编号" />
      <el-table-column align="center" prop="productId" label="产品编号" />
      <el-table-column align="center" prop="product.name" label="产品" />
      <el-table-column align="center" prop="product.photo" label="产品图片">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <el-image
              style="height:200px;width:200px"
              :src="scope.row.product.photo"
              fit="contain"
            />
            <el-image
              slot="reference"
              style="height:50px;width:50px"
              :src="scope.row.product.photo"
              fit="contain"
            />
          </el-popover>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="product.photo" label="产品图片" /> -->
      <el-table-column align="center" prop="price" label="单价">
        <template v-slot="scope">
          ￥
          <span class="red_info_money">{{scope.row.price}}</span>元
        </template>
      </el-table-column>
      <el-table-column align="center" prop="number" label="数量" />
    </el-table>
    <br />
    <br />
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单基本信息</span>
          </div>
          <div class="text item">
            <p>订单编号：{{ orderbyid.id }}</p>
            <p>
              订单金额：￥
              <span class="red_info_money">{{ orderbyid.total }}</span>元
            </p>
            <p>下单时间：{{ orderbyid.orderTime }}</p>
            <p>订单状态：{{ orderbyid.status }}</p>
          </div>
        </el-card>
      </el-col>

      <el-col v-if="orderbyid.employee" :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>接单者信息</span>
          </div>
          <div class="text item">
            <p>接单者：{{ orderbyid.employee.username }}</p>
            <p>接单者手机号：{{ orderbyid.employee.telephone }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="orderbyid.customer" :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>下单者信息</span>
          </div>
          <div class="text item">
            <p>下单者：{{ orderbyid.customer.realname }}</p>
            <p>下单者手机号：{{ orderbyid.customer.telephone }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="orderbyid.address" :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>雇主信息</span>
          </div>
          <div class="text item">
            <p>雇主：{{ orderbyid.address.username }}</p>
            <p>雇主手机号：{{ orderbyid.address.telephone }}</p>
            <p>服务地址：{{ orderbyid.address.address.province }}{{ orderbyid.address.city }}{{ orderbyid.address.area }}{{ orderbyid.address.address }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { findById } from "@/api/order";
export default {
  data() {
    return {
      orderbyid: {},
    };
  },
  async created() {
    let res = await findById({ id: this.$route.query.detail });
    this.orderbyid = res.data;
  },
  methods: {
    // 返回上一级
    toBack() {
      this.$router.back();
    },
  },
};
</script>
