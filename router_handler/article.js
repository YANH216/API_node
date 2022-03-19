const db = require('../db')

const path = require('path')

exports.addArticle = (req, res) => {
  /* console.log(req.body) // 文本类型数据
  console.log('-------------------')
  console.log(req.file) // 文件类型数据 */

  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img')
    return res.cc('文章封面是必选参数')

  // 整理要插入数据库的文章信息对象模块
  const articleInfo = {
    // 标题、内容、状态、所属的分类id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章发布事件
    pub_date: new Date(),
    // 文章作者id
    author_id: req.user.id,
  }

  const sqlStr = `insert into ev_articles set ?`

  db.query(sqlStr, articleInfo, (err, results) => {
    if (err) return res.cc(err)

    if (results.affectedRows !== 1) 
      return res.cc('发布文章失败')
    
    res.cc('发布文章成功', 0)
  })

}