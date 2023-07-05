/*
 * @Description: 订单api
 * @Author: Ronda
 * @Date: 2021-05-14 16:59:09
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-14 17:05:09
 */
import { get } from '@/utils/request'

/**
 * @description: 通过id获取订单信息
 * @param {*} data
 * @return {*}
 */
export function findById(data) {
  return get('/order/findById', data)
}

/**
 * @description: 分页查询订单，也可根据状态来获取信息
 * @param {*} data
 * @return {*}
 */
export function pageQuery(data) {
  return get('/order/pageQuery', data)
}

/**
 * @description: 派单
 * @param {*} data
 * @return {*}
 */
export function sendOrder(data) {
  return get('/order/sendOrder', data)
}
/**
 * @description: 取消派单
 * @param {*} data
 * @return {*}
 */
export function cancelSendOrder(data) {
  return get('/order/cancelSendOrder', data)
}




