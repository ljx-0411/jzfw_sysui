/*
 * @Description: 资讯API
 * @Author: Ronda
 * @Date: 2021-05-26 16:58:12
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-26 17:02:54
 */

import { get, post } from '@/utils/request'
/**
 * @description: 通过id删除资讯
 * @param {*} data  {id:1}
 * @return {*}
 */
export function deleteById(data) {
  return get('/article/deleteById', data)
}
/**
 * @description: 查找资讯信息
 * @param {*} data
 * @return {*}
 */
export function pageQuery(data) {
  return get('/article/pageQuery', data)
}
/**
 * @description: 保存或更新资讯信息
 * @param {*} data
 * @return {*}
 */
export function saveOrUpdate(data) {
  return post('/article/saveOrUpdate', data)
}
/**
 * @description: 修改资讯状态
 * @param {*} data
 * @return {*}
 */
export function changeStatus(data) {
  return post('/article/changeStatus', data)
}
