const Sales = require('../models/sales');
const SalesRecord = require('../models/salesRecord');

exports.updateTotal = (id) => {
  SalesRecord.find({saleId: id}).then((results) => {
    let total = 0;
    for(let record of results) {
      total += record.count * record.price;
    }
    Sales.findByIdAndUpdate(id, {total: total}).then((result) => {
      if(result);
      else console.log('更新总计报错');
    })
  });
}
