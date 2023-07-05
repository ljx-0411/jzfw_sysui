/*
 * @Description:配置文件
 * @Author: Ronda
 * @Date: 2021-05-10 17:01:17
 * @LastEditors: Ronda
 * @LastEditTime: 2021-05-14 17:00:47
 */
/**
 * 项目内部说明：
 * 轮播图状态：停用，启用
 * 产品状态：下架，正常
 * 用户状态：正常，禁用
 * 评论状态：审核通过，审核未通过
 * 员工账单状态：正常，未审核  类型：收益，提现
 * 顾客账单状态：正常，未审核  类型：充值，消费
 * 系统账单状态：正常，未审核  类型：充值，收益，提现
 * 订单状态：待支付，待派单，待接单，待服务，待确认，已完成
 * 栏目都只有一级栏目
 * 用户只有一个角色
 */
// 员工 1   管理员 2  顾客 6
const roles = {
  waiter: 1,
  admin: 2,
  customer: 6
}
// 预计实现按钮内部文本控制，暂未在项目中铺开使用
const btnTitles = {
  add: '添加',
  edit: '编辑',
  delete: '删除'
}

// 访问文件路径 + 文件id
const showFileURL = ''
// 项目基础路径和文件上传路径
const uploadFileURL = 'http://localhost:8002/file/upload'
/* 附件服务器接口
http://121.199.29.84:5588/file/upload
http://121.199.29.84:8888/group1/ 图片ID */

export {
  roles,
  showFileURL,
  uploadFileURL,
  btnTitles
}
