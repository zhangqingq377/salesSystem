const mongoose = require('mongoose');
const ProductBrand = require('../models/productBrand');

const productDetailSchema = new mongoose.Schema({
  id: String,
  name: String, //产品名称
  cost: Number, //成本
  stock: Number, //库存
  brand: String,
  brandId: {type: mongoose.Schema.Types.ObjectId, ref: 'productBrand'},
  order: Number //显示顺序
});

productDetailSchema.statics = {
  get: function (query, cb) {
    return this.find(query, null, {limit: 50, sort: {order: 1}})
      .populate({
        path: 'brandId',
        select: '_id name',
        model: 'productBrand',
        populate: {
          path: 'productId',
          select: '_id name',
          model: 'product'
        }
      }).exec(cb)
  },
}

module.exports = productDetailSchema
