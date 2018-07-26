const mongoose = require('mongoose')
const SaleSchema = require('../schemas/salesRecord')

module.exports = mongoose.model('salesRecord', SaleSchema, 'salesRecord');
