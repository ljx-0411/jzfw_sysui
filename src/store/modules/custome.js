/*
 * @Description:顾客管理仓库
 * @Author: Ronda
 * @Date: 2021-05-10 16:17:17
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-11 15:51:16
 */
import { pageQuery } from '@/api/user'
export default {
  namespaced: true,
  state: {
    customes: [],
    customeTotal: 0
  },
  mutations: {
    SET_CUSTOMES(state, payload) {
      state.customes = payload
    },
    SET_CUSTOME_TOTAL(state, payload) {
      state.customeTotal = payload
    }

  },
  actions: {
    /**
     * @description: 分页查询顾客信息
     * @param {*} commit
     * @param {*} payload
     * @return {*}
     */
    async pageQueryCustome({ commit }, payload) {
      const res = await pageQuery(payload)
      commit('SET_CUSTOMES', res.data.list)
      commit('SET_CUSTOME_TOTAL', res.data.total)
    }
  }
}

