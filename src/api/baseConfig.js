/*
 * @Description:系统基础配置api
 * @Author: Ronda
 * @Date: 2021-05-26 13:17:27
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-27 12:30:42
 */
import { get, post } from '@/utils/request'
/**
 * @description: 通过id删除系统基础配置
 * @param {*} data  {id:1}
 * @return {*}
 */
export function deleteById(data) {
  return get('/baseConfig/deleteById', data)
}
/**
 * @description: 根据name查询配置信息
 * @param {*} data
 * @return {*}
 */
export function findByKey(data) {
  return get('/baseConfig/findByKey', data)
}
/**
 * @description: 查找系统基础配置信息
 * @param {*} 
 * @return {*}
 */
export function findAll() {
  return get('/baseConfig/findAll')
}
/**
 * @description: 保存或更新系统基础配置信息
 * @param {*} data
 * @return {*}
 */
export function saveOrUpdate(data) {
  return post('/baseConfig/saveOrUpdate', data)
}