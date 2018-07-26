const mongoose = require('mongoose')
const productBrandSchema = require('../schemas/productDetail')

module.exports = mongoose.model('productDetail', productBrandSchema, 'productDetail');
