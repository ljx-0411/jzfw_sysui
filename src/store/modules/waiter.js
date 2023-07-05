/*
 * @Description:顾客管理仓库
 * @Author: Ronda
 * @Date: 2021-05-10 16:17:17
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-11 15:51:41
 */
import { pageQuery } from '@/api/user'
export default {
  namespaced: true,
  state: {
    waiters: [],
    waiterTotal: 0
  },
  mutations: {
    SET_WAITERS(state, payload) {
      state.waiters = payload
    },
    SET_WAITER_TOTAL(state, payload) {
      state.waiterTotal = payload
    }

  },
  actions: {
    /**
     * @description: 分页查询员工信息
     * @param {*} commit
     * @param {*} payload
     * @return {*}
     */
    async pageQueryWaiter({ commit }, payload) {
      const res = await pageQuery(payload)
      commit('SET_WAITERS', res.data.list)
      commit('SET_WAITER_TOTAL', res.data.total)
    }
  }
}
