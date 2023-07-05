/*
 * @Description:账户管理api
 * @Author: Ronda
 * @Date: 2021-05-13 16:45:54
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-13 16:49:39
 */

import { get } from '@/utils/request'

/**
 * @description: 分页查询顾客账单
 * @param {*} data
 * @return {*}
 */
export function pageQueryCustomerAccount(data) {
  return get('/account/pageQueryCustomerAccount', data)
}

/**
 * @description: 分页查询员工账单
 * @param {*} data
 * @return {*}
 */
export function pageQueryEmployeeAccount(data) {
  return get('/account/pageQueryEmployeeAccount', data)
}

/**
 * @description: 分页查询系统账单
 * @param {*} data
 * @return {*}
 */
export function pageQuerySystemAccount(data) {
  return get('/account/pageQuerySystemAccount', data)
}

