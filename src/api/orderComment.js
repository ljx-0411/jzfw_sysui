/*
 * @Description:订单评论管理
 * @Author: Ronda
 * @Date: 2021-05-13 16:03:50
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-27 17:08:54
 */

import { get, post } from '@/utils/request'
/**
 * @description: 通过id删除评论
 * @param {*} data  {id:1}
 * @return {*}
 */
export function deleteById(data) {
  return get('/orderComment/deleteById', data)
}

/**
 * @description: 审核评论信息-不通过
 * @param {*}
 * @return {*}
 */
export function checkNoPass(data) {
  return post('/orderComment/checkNoPass', data)
}
/**
 * @description: 审核评论信息-通过
 * @param {*}
 * @return {*}
 */
export function checkPass(data) {
  return post('/orderComment/checkPass', data)
}
/**
 * @description: 查找订单评论信息
 * @param {*}
 * @return {*}
 */
export function pageQuery(data) {
  return get('/orderComment/pageQuery', data)
}

