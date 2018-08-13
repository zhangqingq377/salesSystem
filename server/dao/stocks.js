const Stocks = require('../models/stocks');
const Record = require('../models/salesRecord');
const ProductDetail = require('../models/productDetail');

exports.updateTotal = (id) => {
  Record.find({stockId: id}).then((results) => {
    let total = 0;
    for(let record of results) {
      total += record.count * record.price;
    }
    Stocks.findByIdAndUpdate(id, {total: total}).then((result) => {
      if(result);
      else console.log('更新总计报错');
    })
  });
};

/**
 * 库存操作
 * @param type 来源类型 sales: 1, stocks: 2
 * @param records 变更数据
 * type: 2
 * [{
 *  id,
 *  defaultCount,
    curCount,
    defaultPrice,
    curPrice
 * }]
 */
exports.updateStocks = (type, records) => {
  if(type === 1) {
    for(let record of records) {
      findIdAndUpdate(record, type);
    }
  } else {
    for(let record of records) {
      findIdAndUpdate(record, type);
    }
  }
};

async function findIdAndUpdate(record, type) {
  ProductDetail.findById(record.id, function (err, detail) {
    if(err) return console.log(err);
    let stock = detail.stock || 0;
    if(type === 1) {
      stock = stock + Number(record.count || 0) - Number(record.curCount || 0);
      //只更新库存
      ProductDetail.findByIdAndUpdate(record.id, {stock: stock}).then(result => {
        // console.log('result: ' + result);
      })
    } else {
      //单价 = 库存总价 + 这次入库的差额 / 库存
      let price = (detail.cost || 0) * stock; //总价
      price = price + (Number(record.curCount || 0) * Number(record.curPrice || 0) - Number(record.defaultCount || 0) * Number(record.defaultPrice || 0));
      //库存 = 原库存 - 上次的入库数 + 这次的入库数 (修改)
      stock = stock - Number(record.defaultCount || 0) + Number(record.curCount || 0);
      if(stock == 0) {
        price = 0;
      }else {
        price = price/stock;
      }
      //更新库存和单价
      ProductDetail.findByIdAndUpdate(record.id, {stock: stock, cost: price}).then(result => {
        // console.log('result: ' + result);
      })
    }
  })
}
