// 导入数据库操作模块
const db = require('../db')
// 导入处理密码的模块
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 定义查询用户信息的sql语句
  const sqlStr = 'select id, username, nickname, email, user_pic from ev_users where id=?'
  // 执行sql语句
  db.query(sqlStr, req.user.id, (err, results) => {
    if (err) return res.cc(err)

    // 执行sql成功
    if (results.length !== 1) return res.cc('获取用户信息失败')

    // 获取用户信息成功
    res.send({
      status: 0,
      message: '获取用户信息成功',
      data: results[0],
    })
  })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  // 定义更新用户信息的sql语句
  const sqlStr = `update ev_users set ? where id=?`
  // 执行sql语句
  db.query(sqlStr, [req.body, req.body.id], (err, results) =>{

    if (err) return res.cc(err)

    if (results.affectedRows !== 1) return res.cc('更新用户信息失败')

    res.cc('更新用户信息成功', 0)

  })
}

exports.updatePwd = (req, res) => {
  // 定义根据id查询用户的信息的sql语句
  const sqlSelectStr = `select * from ev_users where id=?`
  // 执行sql语句
  db.query(sqlSelectStr, req.user.id, (err, results) => {

    if (err) return res.cc(err)

    // 判断结果是否存在
    if (results.length !== 1) return res.cc('用户不存在')

    // 判断用户输入的旧密码是否正确,数据库中密码为密文
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    if (!compareResult) return res.cc('旧密码错误')

    // 定义更新用户密码的sql语句
    const sqlUpdateStr = `update ev_users set password=? where id=?`

    // 对新密码加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

    // 执行sql语句
    db.query(sqlUpdateStr, [newPwd, req.user.id], (err, results) => {
      if (err) return res.cc(err)

      if (results.affectedRows !== 1) return res.cc('更新密码失败')

      // 更新密码成功
      res.cc('更新密码成功', 0)
    })
  })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  // 定义更新用户头像的sql语句
  const sqlStr = `update ev_users set user_pic=? where id =?`

  // 执行sql语句
  db.query(sqlStr, [req.body.avatar, req.user.id], (err, results) => {

    if (err) return res.cc(err)

    if (results.affectedRows !== 1) return res.cc('更新头像失败')

    res.cc('更新头像成功', 0)
  })
}