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
 * @param data 变更数据
 */
exports.updateStocks = (type, records) => {
  if(type === 1) {
    for(let record of records) {
      findIdAndUpdata(record);
    }
  }else {

  }
};

async function findIdAndUpdata(record) {
  ProductDetail.findById(record.id, function (err, detail) {
    if(err) return console.log(err);
    let stock = detail.stock || 0;
    stock = stock + record.count - record.curCount;
    ProductDetail.findByIdAndUpdate(record.id, {stock: stock}).then(result => {
      console.log('result: ' + result);
    })
  })
}
