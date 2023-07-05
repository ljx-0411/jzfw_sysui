/*
 * @Description:实名认证申请相关接口
 * @Author: Ronda
 * @Date: 2021-05-26 11:38:39
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 13:17:57
 */
import { get } from '@/utils/request'
/**
 * @description: 分页查询实名认证申请
 * @param {*} data
 * @return {*}
 */
export function pageQueryCertificationApply(data) {
  return get('/certification/pageQueryCertificationApply', data)
}
/**
 * @description: 审核通过
 * @param {*} data
 * @return {*}
 */
export function checkPass(data) {
  return get('/certification/checkPass', data)
}
/**
 * @description: 审核不通过
 * @param {*} data
 * @return {*}
 */
export function checkNoPass(data) {
  return get('/certification/checkNoPass', data)
}