const mongoose = require('mongoose')
const productDetailSchema = require('../schemas/productBrand')

module.exports = mongoose.model('productBrand', productDetailSchema, 'productBrand');
