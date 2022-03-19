const Joi = require('joi');

// 定义分类名称和别名的验证规则
const name = Joi.string().required()
const alias = Joi.string().alphanum().required()

// 定义分类ID的验证规则
const id = Joi.number().integer().min(1).required()

// 验证规则对象 分类名称和别名
exports.add_cates_schema = {
  body: {
    name,
    alias,
  }
}

// 验证规则对象 删除分类
exports.delete_cate_schema = {
  params: {
    id,
  }
}

// 验证规则对象  根据id获取分类
exports.get_cate_schema = {
  params: {
    id,
  }
}

// 验证规则对象 更新分类
exports.update_cate_schema = {
  body: {
    id,
    name,
    alias,
  }
}

