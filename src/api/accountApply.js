/*
 * @Description:账户变动审核-提现审核
 * @Author: Ronda
 * @Date: 2021-05-26 13:17:27
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 13:18:53
 */
import { get } from '@/utils/request'
/**
 * @description: 分页查询账户变动申请
 * @param {*} data
 * @return {*}
 */
export function pageQueryAccountApply(data) {
  return get('/accountApply/pageQueryAccountApply', data)
}
/**
 * @description: 审核通过
 * @param {*} data
 * @return {*}
 */
export function checkPass(data) {
  return get('/accountApply/checkPass', data)
}
/**
 * @description: 审核不通过
 * @param {*} data
 * @return {*}
 */
export function checkNoPass(data) {
  return get('/accountApply/checkNoPass', data)
}