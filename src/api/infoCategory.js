/*
 * @Description:
 * @Author: Ronda
 * @Date: 2021-05-12 16:32:47
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-12 16:34:38
 */
import { get, post } from '@/utils/request'

/**
 * @description: 通过id删除栏目
 * @param {*} data  {id:1}
 * @return {*}
 */
export function deleteById(data) {
  return get('/category/deleteById', data)
}
/**
 * @description: 批量删除
 * @param {*} data
 * @return {*}
 */
export function batchDelete(data) {
  return post('/category/batchDelete', data)
}
/**
 * @description: 查找资讯栏目信息
 * @param {*}
 * @return {*}
 */
export function findAll() {
  return get('/category/findAll')
}
/**
 * @description: 保存栏目信息
 * @param {*} data
 * @return {*}
 */
export function saveOrUpdate(data) {
  return post('/category/saveOrUpdate', data)
}
