// 导入express模块
const express = require('express');

// 创建express服务器实例
const app = express()





// 调用app.listen,指定端口号并启动web服务器
app.listen(3001, () => {
  console.log('API server running at http://127.0.0.1:3001')
})