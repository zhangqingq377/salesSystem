// 销售记录
const mongoose = require('mongoose');
const moment = require('../util/moment-with-locales');
moment.locale('zh-cn');

const SaleSchema = new mongoose.Schema({
  wechat: String, //微信
  name: String, //姓名
  phone: String, //手机号
  address: String, //地址
  total: Number, //总价
  platform: String, //交易平台
  createTime: { type: Date, default: Date.now },
  updateTime: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'createTime', updatedAt: 'updateTime'}
});

SaleSchema.set('toJSON', { virtuals: true });

SaleSchema.virtual('time').get(function () {
  let time = this.updateTime || this.createTime;
  return moment(time).format('lll');
});

SaleSchema.statics = {
  get: function (query, page, cb) {
    return this.find(query).limit(page.size).skip(page.start).sort({createTime: -1}).exec(cb)
  }
}

module.exports = SaleSchema
