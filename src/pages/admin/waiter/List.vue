<!--
 * @Description: 顾客管理
 * @Author: Ronda
 * @Date: 2021-05-10 15:40:08
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-13 11:12:32
-->
<template>
  <div>
    <userList type="员工" role-id="1" />
  </div>
</template>

<script>
import userList from "@/pages/components/userList";
export default {
  components: {
    userList,
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
