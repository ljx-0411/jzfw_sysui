<!--
 * @Description: 系统账单
 * @Author: Ronda
 * @Date: 2021-05-13 16:53:16
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-13 17:14:27
-->
<template>
  <div>
    <Account type="系统" />
    <div id="app">
      <vue-tinymce
          v-model="content"
          :setup="setup"
          :setting="setting" />
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import VueTinymce from "@packy-tang/vue-tinymce"

//安装组件
Vue.use(VueTinymce)
import Account from '@/pages/components/Account'
export default {
  components: {
    Account
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    setup(editor) {
      console.log(editor)
   }
  }
}
</script>
<style scoped>
</style>
