// 导入express模块
const express = require('express');

// 创建express服务器实例
const app = express()

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 导入并配置cors中间件
const cors = require('cors');
app.use(cors())

// 配置解析表单数据的中间件
// 只能解析x-www-form-urlencoded格式的数据
app.use(express.urlencoded({ extended: false }))

// 在路由之前封装res.cc函数
// 在处理函数中，需要多次调用res.send() 向客户端响应处理失败的结果，为了简化代码，可以手动封装一个res.cc函数
app.use((req, res, next) => {
  res.cc = (err, status =1) => {
    // status默认值为1，表示失败的情况
    // err的值，可能是一个错误对象，也可能是一个错误的描述字符串
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 配置解析token的中间件
const expressJwt = require('express-jwt')
const config = require('./config')

app.use(expressJwt({ 
  secret: config.jwtSecretKey,
  algorithms: ['HS256']
}).unless({ path: [/^\/api/]}))

// 导入并使用user路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter)

// 导入并使用userInfo路由模块
const userInfoRouter = require('./router/userInfo')
app.use('/my', userInfoRouter)

// 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)

// 导入并使用文章的路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter) 

// 错误级别中间件
const Joi = require('joi')
app.use((err, req, res, next) => {
  // 数据验证失败
  if (err instanceof Joi.ValidationError) return res.cc(err)
  // 身份认证
  if (err.name === 'UnauthorizedError') {
    return res.cc('身份认证失败！')
  }
  // 未知错误
  res.cc(err)
})



// 调用app.listen,指定端口号并启动web服务器
app.listen(3001, () => {
  console.log('API server running at http://127.0.0.1:3001')
})