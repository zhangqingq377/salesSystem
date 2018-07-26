// Schema、Model、Entity或者Documents的关系请牢记，Schema生成Model，Model创造Entity，Model和Entity都可对数据库操作造成影响，但Model比Entity更具操作性。
const { dbUrl } = require('./config');
const mongoose = require('mongoose');

mongoose.connect(dbUrl);
/**
 * 连接成功
 */
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connection open to ${dbUrl}`)
})

/**
 * 连接出错
 */
mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error: ${err}`)
})

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})

module.exports = mongoose
