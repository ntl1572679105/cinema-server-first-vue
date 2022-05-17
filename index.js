const express = require('express')
const app = express()
const port = 3000     // 服务端口

// 配置跨域
const cors = require('cors')
app.use(cors({
    origin: "*"
}))

// 解析post请求参数
app.use(express.urlencoded())

// 引入外部路由 
app.use(require('./router/MovieActor.js'))
app.use(require('./router/MovieDirector.js'))
app.use(require('./router/MovieInfo.js'))
app.use(require('./router/MovieThumb.js'))

/**
 * 接口， 处理/请求
 */
app.get('/', (req, resp)=>{
    resp.send('Hello World!')
})

app.listen(port, ()=>{
    console.log('百慕大影城后端服务已启动...')
})

