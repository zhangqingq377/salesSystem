const mongoose = require('mongoose')
const StockSchema = require('../schemas/stocks')

module.exports = mongoose.model('stocks', StockSchema, 'stocks');
