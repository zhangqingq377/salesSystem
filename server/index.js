const { port, dbUrl } = require('./config')
// // 引入Express
const express = require('express');
const app = express();
const path = require('path');
const db = require('./db')
// 连接数据库
db.connect(dbUrl, { useNewUrlParser: true });
// 引入编写好的api路由
const router = require('./routers/index')
// 引入处理post数据的模块
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended:false }));
app.use(express.static(path.join(__dirname,'../dist')));


app.use(bodyParser.json());
app.use('/api', router);

// 监听端口
app.listen(port);
console.log('数据库连接成功，端口'+port+'正在监听......');
