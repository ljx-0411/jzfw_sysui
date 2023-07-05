/*
 * @Description: 角色api
 * @Author: Ronda
 * @Date: 2021-05-12 17:23:55
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-13 14:28:28
 */
import request, { get, post } from '@/utils/request'

/**
 * @description: 通过id删除角色
 * @param {*} data  {id:1}
 * @return {*}
 */
export function deleteById(data) {
  return get('/role/deleteById', data)
}
/**
 * @description: 查询所有
 * @param {*}
 * @return {*}
 */
export function findAll() {
  return get('/role/findAll')
}
/**
 * @description: 查询所有角色并级联权限信息
 * @param {*}
 * @return {*}
 */
export function cascadePrivilegeFindAll() {
  return get('/role/cascadePrivilegeFindAll')
}
/**
 * @description: 为角色授权
 * @param {*} data
 * @return {*}
 */
export function authorization(data) {
  return post('/role/authorization', data)
}
/**
 * @description: 保存或更新
 * @param {*} data
 * @return {*}
 */
export function saveOrUpdate(data) {
  return post('/role/saveOrUpdate', data)
}

// 其他权限操作
export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}
