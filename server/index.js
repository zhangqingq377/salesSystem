const { port, dbUrl } = require('./config')
// // 引入Express
const express = require('express');
const app = express();
const db = require('./db')
// 连接数据库
db.connect(dbUrl, { useNewUrlParser: true });
// 引入编写好的api路由
const router = require('./routers/index')
// 引入处理post数据的模块
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api', router);

// 监听端口
app.listen(port);
console.log('success listen…………');
