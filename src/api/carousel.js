/*
 * @Description:轮播图配置
 * @Author: Ronda
 * @Date: 2021-05-12 14:25:06
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-12 14:28:49
 */
import { get, post } from '@/utils/request'
/**
 * @description: 通过id删除轮播图
 * @param {*} data  {id:1}
 * @return {*}
 */
export function deleteById(data) {
  return get('/carousel/deleteById', data)
}
/**
 * @description: 查找轮播图信息
 * @param {*}
 * @return {*}
 */
export function findAll() {
  return get('/carousel/findAll')
}
/**
 * @description: 保存轮播图信息
 * @param {*} data
 * @return {*}
 */
export function saveOrUpdate(data) {
  return post('/carousel/saveOrUpdate', data)
}
