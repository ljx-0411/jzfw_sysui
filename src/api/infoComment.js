/*
 * @Description:资讯评论管理
 * @Author: Ronda
 * @Date: 2021-05-13 16:03:50
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-27 10:57:34
 */

import { get, post } from '@/utils/request'

/**
 * @description: 批量删除
 * @param {*} data  {id:1}
 * @return {*}
 */
export function batchDelete(data) {
  return post('/comment/batchDelete', data)
}

/**
 * @description: 通过id删除评论
 * @param {*} data  {id:1}
 * @return {*}
 */
export function deleteById(data) {
  return get('/comment/deleteById', data)
}

/**
 * @description: 审核评论信息
 * @param {*}
 * @return {*}
 */
export function check(data) {
  return get('/comment/check', data)
}
/**
 * @description: 查找资讯评论信息
 * @param {*}
 * @return {*}
 */
export function pageQuery(data) {
  return get('/comment/pageQuery', data)
}
/**
 * @description: 保存评论信息
 * @param {*} data
 * @return {*}
 */
export function saveOrUpdate(data) {
  return post('/comment/saveOrUpdate', data)
}
