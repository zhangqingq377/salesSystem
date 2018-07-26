/**
 * 总路由
 */
const express = require('express');
const router = express.Router();
const product = require('./product')
const sales = require('./sales')
const stocks = require('./stocks')

router.use(product);
router.use(sales);
router.use(stocks);

module.exports = router
