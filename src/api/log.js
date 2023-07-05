/*
 * @Description:日志管理模块
 * @Author: Ronda
 * @Date: 2021-05-13 15:30:54
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-13 15:32:19
 */

import { get } from '@/utils/request'

/**
 * @description: 查找日志信息
 * @param {*}
 * @return {*}
 */
export function pageQuery(data) {
  return get('/baseLog/pageQuery', data)
}
