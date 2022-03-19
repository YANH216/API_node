// 导入数据库模块
const db = require('../db/index');
// 导入密码加密模块
const bcrypt = require('bcryptjs');
// 导入生成token的包
const jwt = require('jsonwebtoken');
// 导入token的加密解密的密钥和token有效期
const config = require('../config')

// 用户注册的处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  let { username, password } = req.body
  // console.log(userInfo)
  if (!username || !password) {
    // return res.send({ status: 1, message: '用户名或密码不合法！' })
    return res.cc('用户名或密码不合法！')
  }
  // 定义sql语句，来查询用户名是否可用
  const sqlSelectStr = 'select * from ev_users where username=?'
  db.query(sqlSelectStr, username, (err, results) => {
    // 执行sql语句失败
    if (err) 
      // return res.send({ status: 1, message: err.message })
      return res.cc(err)
    // 判断用户名是否被占用
    if (results.length > 0) {
      // return res.send({ status: 1, message: '用户名被占用，请重新输入' })
      return res.cc('用户名被占用，请重新输入')
    }
    // 调用bcryptjs.hashSync()对密码进行加密
    password = bcrypt.hashSync(password, 10)

    const sqlInsertStr = 'insert into ev_users set ?'

    db.query(sqlInsertStr, { username, password }, (err, results) => {
      // 判断sql语句是否执行成功
      if (err) 
        // return res.send({ status: 1, message: err.message })
        return res.cc(err)
      // 判断响应行数是为 1
      if (results.affectedRows !== 1) {
        // return res.send({ status: 1, message: '注册用户失败，请稍后再试' })
        return res.cc('注册用户失败，请稍后再试')
      }
      // 注册用户成功
      res.send({ status: 0, message: '注册用户成功！' })
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单数据
  const { username, password } = req.body

  // 定义sql语句
  const sqlStr = 'select * from ev_users where username=?'
  // 执行sql语句，根据用户名查询用户信息
  db.query(sqlStr, username, (err, results) => {
    // 执行sql语句失败
    if (err) return res.cc('err')
    // 执行sql语句成功
    if (results.length !== 1) {
      return res.cc('登录失败！')
    }
    // 使用bcrypt.compareSync判断输入密码是否正确
    const compareResult = bcrypt.compareSync(password, results[0].password)
    if (!compareResult) return res.cc('密码错误！')

    // 清空用户信息中的敏感信息，密码和用户头像
    const user = { ...results[0], password: '', user_pic: '' }
    // 对用户信息进行加密，生成token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expireIn})
    // 调用res.send()将token响应给客户端
    res.send({
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + tokenStr
    })
  })
}