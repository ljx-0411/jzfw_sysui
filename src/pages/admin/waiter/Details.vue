<!--
 * @Description: 员工详情
 * @Author: Ronda
 * @Date: 2020-10-25 09:39:50
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 14:47:47
-->
<template>
  <div>
    <Personal :userid="$route.query.id" />
  </div>
</template>

<script>
import Personal from "@/pages/components/Personal";
export default {
  components: { Personal },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style scoped>
</style>
