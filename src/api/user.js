/*
 * @Description: 用户相关接口
 * @Author: Ronda
 * @Date: 2021-05-10 15:11:10
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-27 09:37:33
 */
import request, { post, get } from '@/utils/request'
// 用户登录相关接口
/**
 * @description: 用户登录接口
 * @param {*} data  登录信息数据
 * @return {*}
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * @description: 获取用户信息
 * @param {*} token 身份令牌
 * @return {*}
 */
export function getInfo(token) {
  return get('/user/info', { token })
}
/**
 * @description: 用户登出
 * @param {*}
 * @return {*}
 */
export function logout() {
  return post('/user/logout')
}

// 用户管理相关接口
/**
 * @description: 根据用户名角色id分页查询用户信息
 * @param {*} data
 * @return {*}
 */
export function pageQuery(data) {
  return get('/baseUser/pageQuery', data)
}

/**
 * @description: 新增或修改用户
 * @param {*} data
 * @return {*}
 */
export function saveOrUpdate(data) {
  return post('/baseUser/saveOrUpdate', data)
}
/**
 * @description: 通过id获取用户信息
 * @param {*} data
 * @return {*}
 */
export function findUserDetailsById(data) {
  return get('/baseUser/findUserDetailsById', data)
}

/**
 * @description: 通过id删除
 * @param {*} data
 * @return {*}
 */
export function deleteById(data) {
  return get('/baseUser/deleteById', data)
}

/**
 * @description: 保存用户信息，并保存角色信息
 * @param {*} data
 * @return {*}
 */
export function addUserWidthRole(data) {
  return post('/baseUser/addUserWidthRole', data)
}

/**
 * @description: 给用户设置角色
 * @param {*} data
 * @return {*}
 */
export function setRoles(data) {
  return post('/baseUser/setRoles', data)
}

/**
 * @description: 修改用户头像
 * @param {*} data
 * @return {*}
 */
export function alterUserface(data) {
  return post('/baseUser/alterUserface', data)
}
