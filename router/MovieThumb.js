/**  定义剧照模块相关的接口 */
const express = require('express')
const router = express.Router()  
const Joi = require('joi')
const Response = require('../utils/Response.js')

// 引入mysql连接池   
const pool = require('../utils/db.js')

/**
 * 添加剧照接口
 * @param: 
 *   详见接口文档
 * @return:
 *   {code:200, msg:'ok'}
 */
 router.post('/movie-thumb/add', (req, resp)=>{
    let {url, movie_id} = req.body   // post请求参数在req.body中

    // 表单验证
    let schema = Joi.object({
        url: Joi.string().required(),    // 必填
        movie_id: Joi.string().required()   // 必填
    })
    let {error, value} = schema.validate(req.body)
    if(error){
        resp.send(Response.error(400, error))
        return; // 结束
    }

    // 表单验证通过，执行添加操作
    let sql = 'insert into movie_thumb (url, movie_id) values (?,?)'
    pool.query(sql, [url, movie_id], (error, result)=>{
        if(error){
            resp.send(Response.error(500, error))
            throw error;
        }
        resp.send(Response.ok())
    })

})

/**
 * 删除剧照接口
 * @param:
 *   id:   剧照id
 * @return:
 *   {code:200, msg:'ok'}
 */
 router.post('/movie-thumb/del', (req, resp)=>{
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
    let sql = "delete from movie_thumb where id = ?"
    pool.query(sql, [id], (error, result)=>{
        if(error){
            resp.send(Response.error(500, error))
            throw error;
        }
        resp.send(Response.ok())
    })
})

/**
 * 通过movie_id查询所有剧照接口
 * @param:
 *   movie_id:   电影id
 * @return:
 *   {code:200, msg:'ok', data:{}}
 */
 router.get('/movie-thumbs/movieid', (req, resp)=>{
    let {movie_id} = req.query
    // 表单验证
    let schema = Joi.object({
        movie_id: Joi.string().required(),    // 必填
    })
    let {error, value} = schema.validate(req.query)
    if(error){
        resp.send(Response.error(400, error))
        return; // 结束
    }
  
    // 执行查询业务
    let sql = 'select * from movie_thumb where movie_id=?'
    pool.query(sql, [movie_id], (error, result)=>{
      if(error){
        resp.send(Response.error(500, error))
        throw error;
      }
      resp.send(Response.ok(result))
    })
  
  })

// 将router对象导出
module.exports = router;