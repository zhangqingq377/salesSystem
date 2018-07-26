// 销售记录
const mongoose = require('mongoose');

const salesRecordSchema = new mongoose.Schema({
  saleId: {type: mongoose.Schema.Types.ObjectId, ref: 'sales'},
  stockId: {type: mongoose.Schema.Types.ObjectId, ref: 'stocks'},
  count: Number,
  price: Number,
  productId: {type: mongoose.Schema.Types.ObjectId, ref: 'productDetail'},
});

salesRecordSchema.statics = {
  get: function (query, cb) {
    return this.find(query, '_id count price productId').populate({
      path: 'productId',
      select: 'name',
      model: 'productDetail',
      populate: {
        path: 'brandId',
        select: 'name',
        model: 'productBrand',
        populate: {
          path: 'productId',
          select: 'name',
          model: 'product'
        }
      }
    }).exec(cb)
  },
}

module.exports = salesRecordSchema
