// 导入自定义验证规则的包
const Joi = require('joi')

// 定义用户信息数据的验证规则
const username = Joi.string().alphanum().min(1).max(10).required()
const password = Joi.string().pattern(/^[\S]{6,12}$/).required()

// 更新用户基本信息数据的验证规格
const id = Joi.number().integer().min(1).required()
const nickname = Joi.string().required()
const email = Joi.string().email().required()

// 用户头像的验证规则
const avatar = Joi.string().dataUri().required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
  body: {
    username,
    password
  }
}

// 定义更新用户基本信息数据的规则对象
exports.update_userInfo_schema = {
  body: {
    id,
    nickname,
    email,
  }
}

// 重置密码的验证规则对象
exports.update_password_schema = {
  body: {
    oldPwd: password,
    newPwd: Joi.not(Joi.ref('oldPwd')).concat(password),
  }
}

exports.update_avatar_schema = {
  body: {
    avatar,
  }
}