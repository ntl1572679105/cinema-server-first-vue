/**  定义电影演员相关的接口 */
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Response = require("../utils/Response.js");

// 引入mysql连接池
const pool = require("../utils/db.js");

/**
 * 添加电影接口
 * @param:
 *   详见接口文档
 * @return:
 *   {code:200, msg:'ok'}
 */
router.post("/movie-info/add", (req, resp) => {
  let {
    categoryId,
    cover,
    title,
    type,
    starActor,
    showingon,
    score,
    description,
    duration,
  } = req.body; // post请求参数在req.body中

  // 表单验证
  let schema = Joi.object({
    categoryId: Joi.number().required(),
    cover: Joi.string().required(),
    title: Joi.string().required(),
    type: Joi.string().required(),
    starActor: Joi.string().required(),
    showingon: Joi.string().required(),
    score: Joi.string().required(),
    description: Joi.string().required(),
    duration: Joi.number().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }

  // 表单验证通过，执行添加操作
  let sql = `insert into movie_info 
        (category_id, cover, title, type, star_actor, showingon, score, description, duration) 
            values 
        (?,?,?,?,?,?,?,?,?)`;
  pool.query(
    sql,
    [
      categoryId,
      cover,
      title,
      type,
      starActor,
      showingon,
      score,
      description,
      duration,
    ],
    (error, result) => {
      if (error) {
        resp.send(Response.error(500, error));
        throw error;
      }
      resp.send(Response.ok());
    }
  );
});

/**
 * 查询所有的电影类型
 * @param:
 *   详见接口文档
 * @return:
 *   {code:200, msg:'ok', data:[]}
 */
router.get("/movie-types", (req, resp) => {
  let sql = "select * from movie_type";
  pool.query(sql, (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
      throw error;
    }
    resp.send(Response.ok(result));
  });
});

/**
 * 查询所有电影
 * @param:
 *   详见接口文档
 * @return:
 *   {code:200, msg:'ok', data:[]}
 */
router.get("/movie-infos", async (req, resp) => {
  // 获取请求参数   get请求的参数封装在req.query中
  let { page, pagesize } = req.query;

  //TODO 服务端表单验证  如果验证通过那么继续后续业务  如果验证不通过，则直接返回参数异常
  let schema = Joi.object({
    page: Joi.number().required(), // page必须是数字，必填
    pagesize: Joi.number().integer().max(100).required(), // pagesize必须是不大于100的数字，必填
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }

  // 执行查询数组业务
  try {
    let startIndex = (page - 1) * pagesize;
    let size = parseInt(pagesize);
    let sql = "select * from movie_info limit ?,?";
    let result = await pool.querySync(sql, [startIndex, size]);
    // 执行查询总条目数
    let sql2 = "select count(*) as count from movie_info";
    let result2 = await pool.querySync(sql2, [startIndex, size]);
    let total = result2[0].count;
    resp.send(
      Response.ok({ page: parseInt(page), pagesize: size, total, result })
    );
  } catch (error) {
    resp.send(Response.error(error));
  }
});

/**
 * 删除电影接口
 * @param:
 *   id:   电影id
 * @return:
 *   {code:200, msg:'ok'}
 */
router.post('/movie-info/del', (req, resp)=>{
    let {id} = req.body

    // 表单验证
    let schema = Joi.object({
        id: Joi.string().required(),    // 必填
    })
    let {error, value} = schema.validate(req.body)
    if(error){
        resp.send(Response.error(400, error))
        return; // 结束
    }

    // 执行删除业务
    let sql = "delete from movie_info where id = ?"
    pool.query(sql, [id], (error, result)=>{
        if(error){
            resp.send(Response.error(500, error))
            throw error;
        }
        resp.send(Response.ok())
    })
})

// 将router对象导出
module.exports = router;
