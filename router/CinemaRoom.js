/**  定义电影院放映厅相关的接口 */
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Response = require("../utils/Response.js");

// 引入mysql连接池
const pool = require("../utils/db.js");

/**
 * 删除放映厅接口
 * @param:
 *   id:   放映厅id
 * @return:
 *   {code:200, msg:'ok'}
 */
router.post("/cinema-room/del", (req, resp) => {
  let { id } = req.body;

  // 表单验证
  let schema = Joi.object({
    id: Joi.string().required(), // 必填
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }

  // 执行删除业务
  let sql = "delete from movie_cinema_room where id = ?";
  pool.query(sql, [id], (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
      throw error;
    }
    resp.send(Response.ok());
  });
});


/**
 * 查询当前电影院中所有的放映厅
 * @param:
 *   cinema_id:  影院ID
 * @return:
 *   {code:200, msg:'ok', data:[{}]}
 */
router.get("/cinema-rooms/cinemaid", (req, resp) => {
  let { cinema_id } = req.query;
  // 表单验证
  let schema = Joi.object({
    cinema_id: Joi.string().required(), // 必填
  });
  let { error, value } = schema.validate(req.query);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }

  // 执行查询操作
  let sql = "select * from movie_cinema_room where movie_cinema_id=?";
  pool.query(sql, [cinema_id], (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
      throw error;
    }
    resp.send(Response.ok(result));
  });
});

/**
 * 查询所有放映厅的类型
 * @param:
 *   无
 * @return:
 *   {code:200, msg:'ok', data:[{}]}
 */
router.get("/cinema-room/types", (req, resp) => {
  let sql = "select * from movie_cinema_room_type";
  pool.query(sql, (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
      throw error;
    }
    resp.send(Response.ok(result));
  });
});

/**
 * 添加放映厅接口
 * @param:
 *   详见接口文档
 * @return:
 *   {code:200, msg:'ok'}
 */
router.post("/cinema-room/add", (req, resp) => {
  let { movie_cinema_id, room_name, room_type } = req.body; // post请求参数在req.body中

  // 表单验证
  let schema = Joi.object({
    movie_cinema_id: Joi.string().required(),
    room_name: Joi.string().required(),
    room_type: Joi.string().required(),
  });
  let { error, value } = schema.validate(req.body);
  if (error) {
    resp.send(Response.error(400, error));
    return; // 结束
  }

  // 表单验证通过，执行添加操作
  let sql = `insert into movie_cinema_room (
      movie_cinema_id,
      room_name,
      room_type
    ) values (?,?,?)`;
  pool.query(sql, [movie_cinema_id, room_name, room_type], (error, result) => {
    if (error) {
      resp.send(Response.error(500, error));
      throw error;
    }
    resp.send(Response.ok());
  });
});

// 将router对象导出
module.exports = router;
