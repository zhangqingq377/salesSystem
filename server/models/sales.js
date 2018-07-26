const mongoose = require('mongoose')
const SaleSchema = require('../schemas/sales')

module.exports = mongoose.model('sales', SaleSchema, 'sales');
