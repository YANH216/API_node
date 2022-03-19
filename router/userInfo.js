const express = require('express');
const expressJoi = require('@escook/express-joi')
const router = express.Router()

// 导入路由处理函数模块
const { getUserInfo, updateUserInfo, updatePwd, updateAvatar } = require('../router_handler/userInfo')

// 导入验证数据合法性的模块
const { 
  update_userInfo_schema, 
  update_password_schema,
  update_avatar_schema } = require('../schema/user');

// 获取用户基本信息的路由
router.get('/userinfo', getUserInfo)

// 更新用户信息的路由

router.post('/userinfo', expressJoi(update_userInfo_schema), updateUserInfo)

// 更新密码的路由
router.post('/updatepwd', expressJoi(update_password_schema), updatePwd)

// 更新用户头像的路由
router.post('/update/avatar', expressJoi(update_avatar_schema), updateAvatar)

module.exports = router