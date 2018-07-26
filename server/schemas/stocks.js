// 销售记录
const mongoose = require('mongoose');
const moment = require('../util/moment-with-locales');
moment.locale('zh-cn');

const StockSchema = new mongoose.Schema({
  name: String, //姓名
  phone: String, //手机号
  total: Number, //总价
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'createTime', updatedAt: 'updateTime'}
});

StockSchema.set('toJSON', { virtuals: true });

StockSchema.virtual('time').get(function () {
  let time = this.updateTime || this.createTime;
  return moment(time).format('lll');
});

StockSchema.statics = {
  get: function (query, page, cb) {
    return this.find(query).limit(page.size).skip(page.start).sort({createTime: -1}).exec(cb)
  }
}

module.exports = StockSchema
