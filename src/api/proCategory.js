/*
 * @Description:产品栏目api
 * @Author: Ronda
 * @Date: 2021-05-11 20:19:11
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-12 16:32:51
 */
import { get, post } from '@/utils/request'

/**
 * @description: 通过id删除栏目
 * @param {*} data  {id:1}
 * @return {*}
 */
export function deleteById(data) {
  return get('/productCategory/deleteById', data)
}
/**
 * @description: 分页查找栏目信息
 * @param {*}
 * @return {*}
 */
export function pageQuery(data) {
  return get('/productCategory/pageQuery', data)
}
/**
 * @description: 保存栏目信息
 * @param {*} data
 * @return {*}
 */
export function saveOrUpdate(data) {
  return post('/productCategory/saveOrUpdate', data)
}
