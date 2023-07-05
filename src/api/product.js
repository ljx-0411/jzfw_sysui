/*
 * @Description:产品api
 * @Author: Ronda
 * @Date: 2021-05-11 20:19:11
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-12 11:24:14
 */
import { get, post } from '@/utils/request'

/**
 * @description: 通过id删除产品
 * @param {*} data  {id:1}
 * @return {*}
 */
export function deleteById(data) {
  return get('/product/deleteById', data)
}
/**
 * @description: 分页查找产品信息
 * @param {*}
 * @return {*}
 */
export function pageQuery(data) {
  return get('/product/pageQuery', data)
}
/**
 * @description: 保存产品信息
 * @param {*} data
 * @return {*}
 */
export function saveOrUpdate(data) {
  return post('/product/saveOrUpdate', data)
}
/**
 * @description: 上架产品
 * @param {*} data
 * @return {*}
 */
export function online(data) {
  return get('/product/online', data)
}

/**
 * @description: 下架产品
 * @param {*} data
 * @return {*}
 */
export function offline(data) {
  return get('/product/offline', data)
}

