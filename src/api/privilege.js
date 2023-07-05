/*
 * @Description:权限api
 * @Author: Ronda
 * @Date: 2021-05-13 14:51:40
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-13 14:55:02
 */
import { get, post, del } from '@/utils/request'

/**
 * @description: 通过id删除权限
 * @param {*} data  {id:1}
 * @return {*}
 */
export function deleteById(data) {
  return del('/privilege/deleteById', data)
}
/**
 * @description: 查询所有
 * @param {*}
 * @return {*}
 */
export function findAll() {
  return get('/privilege/findAll')
}
/**
 * @description: 通过parentId查询
 * @param {*}
 * @return {*}
 */
export function findByParentId() {
  return get('/privilege/findByParentId')
}

/**
 * @description: 查询树
 * @param {*} data
 * @return {*}
 */
export function findPrivilegeTree(data) {
  return get('/privilege/findPrivilegeTree', data)
}
/**
 * @description: 保存或更新
 * @param {*} data
 * @return {*}
 */
export function saveOrUpdate(data) {
  return post('/privilege/saveOrUpdate', data)
}

