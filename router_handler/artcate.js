// 导入数据库模块
const db = require('../db/index');

exports.getArticleCates = (req, res) => {
  const sqlStr = `select * from ev_article_cate where is_delete = 0 order by id`

  db.query(sqlStr, (err, results) => {
    if (err) return res.cc(err)

    res.send({
      status: 0,
      message: '获取文章分类列表成功',
      data: results,
    })
  })
}

// 新增文章分类的路由处理函数
exports.addArticleCates = (req, res) => {
  // 定义查询 分类名称与分类别名是否被占用的sql语句
  const sqlSelectStr = `select * from ev_article_cate where name = ? or alias = ?`

  db.query(sqlSelectStr, [req.body.name, req.body.alias], (err, results) => {
    if (err) return res.cc(err)

    // 判断分类名称和分类别名是否被占用
    if (results.length === 2) return res.cc('分类名称与别名被占用')
    if (results.length === 1 && results[0].name === req.body.name) {
      return res.cc('分类名称被占用')
    }
    if (results.length === 1 && results[0].alias === req.body.alias) {
      return res.cc('分类别名被占用')
    }

    // 新增文章分类
    const sqlUpdateStr = `insert into ev_article_cate set ?`

    db.query(sqlUpdateStr, [req.body], (err, results) => {
      if (err) return res.cc(err)

      if (results.affectedRows !== 1) return res.cc('新增文章分类失败')

      // 新增文章分类成功
      res.cc('新增文章分类成功', 0)
    })
  })
}

// 删除文章分类的路由处理函数
exports.deleteCateById = (req, res) => {
  const sqlStr = `update ev_article_cate set is_delete = 1 where id = ?`

  db.query(sqlStr, req.params.id, (err, results) => {
    if (err) return res.cc(err)

    if (results.affectedRows !== 1) return res.cc('删除文章分类失败')

    res.cc('删除文章分类成功', 0)
  })
}


// 根据id获取文章分类
exports.getArticleById = (req, res) => {
  const sqlStr = `select * from ev_article_cate where id = ?`

  db.query(sqlStr, req.params.id, (err, results) => {
    if (err) return res.cc(err)

    if (results.length !== 1) return res.cc('获取文章分类数据失败')

    res.send({
      status: 0,
      message: '获取文章分类数据成功',
      data: results[0],
    })
  })
}

// 更新文章分类的路由处理函数
exports.updateCateById = (req, res) => {
  const { id, name, alias } = req.body
  // 定义查询 分类名称 与 分类别名是否被占用的sql语句
  const sqlSelectStr = `select * from ev_article_cate where id <> ? and (name = ? or alias = ?)`

  db.query(sqlSelectStr, [id, name, alias], (err, results) => {
    if (err) return res.cc(err)

    if (results.length === 2) 
      return res.cc('分类名称与别名被占用')

    if (results.length === 1 && results[0].name === name)
      return res.cc('分类名称被占用')
    
    if (results.length === 1 && results[0].alias === alias)
      return res.cc('分类别名被占用')

    const sqlUpdate = `update ev_article_cate set ? where id =?`

    db.query(sqlUpdate, [req.body, id], (err, results) => {
      if (err) return res.cc(err)

      if (results.affectedRows !== 1)
        return res.cc('更新文章分类失败')
      
      res.cc('更新文章分类成功', 0)
    })
  })
}
