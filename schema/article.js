const Joi = require('Joi');

// 定义 标题、分类id、内容、发布状态的验证规则
const title = Joi.string().required()
const cate_id = Joi.number().integer().min(1).required()
const content = Joi.string().required().allow('')
const state = Joi.string().valid('已发布', '草稿').required()

// 验证规则对象  发布文章
exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state,
  }
}