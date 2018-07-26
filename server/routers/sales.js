const express = require('express');

const Sales = require('../models/sales');
const SalesRecord = require('../models/salesRecord');
const SalesDAO = require('../dao/sales')
const StocksDAO = require('../dao/stocks')
const router = express.Router();

router.post('/sales', function (req, res) {
  let param = req.body.data;
  //处理分页信息
  let page = param.page || {page: 1, size: 50};
  page.start = (page.page - 1) * page.size;
  //清空查询条件为空的参数
  param.query = param.query || {};
  let query = {};
  for(let key in param.query) {
    if(param.query[key]) query[key] = {$regex : new RegExp(param.query[key], 'i')};
  }
  let salesList = [];
  let total = 0;
  Promise.all([
    Sales.get(query, page),
    Sales.estimatedDocumentCount(query)
  ]).then(function(result){
    if(!result) {
      console.log('报错了');
    } else{
      //数据库查询返回的参数是只读格式,无法修改.
      salesList = JSON.parse(JSON.stringify(result[0]));
      total = result[1];
      let promises = salesList.map((bill) => {
        return SalesRecord.get({saleId: bill._id});
      });
      return Promise.all(promises);
    }
  }).then(records => {
    for(let index in salesList) {
      salesList[index].records = records[index];
    }
    res.send(
      {
        code: 0,
        salesList: salesList,
        page: {
          page: page.page,
          size: page.size,
          total: total,
        }
      });
  });
});

router.post('/saveSale', function (req, res) {
  let props = req.body.data;
  let list = props.list;
  delete props.list;
  let sale = new Sales(props);
  if(props._id) {
    //编辑保存
    let objid = props._id;
    delete props._id;

    let insertList = [];
    let updateList = [];


    for(let record of list) {
      if (record._id) {
        updateList.push(record);
      }
      else {
        record.saleId = objid;
        insertList.push(record);
      }
    }
    Sales.findByIdAndUpdate(objid, props).then(sale => {
      if (!sale)
        return res.send({
          code: 1,
          message: '销售记录更新失败!'
        });
      if(updateList.length > 0) {
        let promises = updateList.map((record) => {
          let recordId = record._id;
          //如果修改了影响库存的数据
          if(undefined !== record.productId || undefined !== record.count) {
            SalesRecord.findById(recordId, function (err, result) {
              if (undefined !== record.productId) {
                //如果更新了产品
                if (undefined !== record.count) {
                  //同时更新了数量
                  StocksDAO.updateStocks(1, [{
                    id: record.productId,
                    count: 0,
                    curCount: record.count
                  }, {
                    id: result.productId,
                    count: result.count,
                    curCount: 0
                  }]);
                } else {
                  StocksDAO.updateStocks(1, [{
                    id: record.productId,
                    count: 0,
                    curCount: result.count
                  }, {
                    id: result.productId,
                    count: result.count,
                    curCount: 0
                  }]);
                }
              } else if (undefined !== record.count) {
                StocksDAO.updateStocks(1, [{
                  id: result.productId,
                  count: result.count,
                  curCount: record.count
                }]);
              }

              delete record._id;
              return SalesRecord.findByIdAndUpdate(recordId, record);
            });
          }else {
            delete record._id;
            return SalesRecord.findByIdAndUpdate(recordId, record);
          }
        });
        return Promise.all(promises);
      }
      return Promise.all([]);
    }).then(result => {
      if(result.length + insertList.length === list.length) {
        if(insertList.length > 0) {
          SalesRecord.insertMany(insertList, function (err, newlist) {
            if(err)
              return res.send({
                code: 1,
                message: '销售明细新增失败!'
              });
            //更新总金额
            SalesDAO.updateTotal(objid);
            //更新库存
            let oldRecord = [];
            for(let record of newlist) {
              oldRecord.push({id: record.productId, count: 0, curCount: record.count});
            }
            StocksDAO.updateStocks(1, oldRecord);
            res.send({
              code: 0,
              message: '保存成功'
            });
          });
        } else {
          if(!props.total) {
            SalesDAO.updateTotal(objid);
          }
          res.send({
            code: 0,
            message: '保存成功!'
          });
        }
      } else {
        res.send({
          code: 1,
          message: '销售明细修改失败!'
        })
      }
    });
  } else {
    //新增保存
    sale.save(function (err, msg) {
      if (err) return console.log(err);
      let curSaleId = msg._id;
      let total = 0;
      list.every((record) => {
        total += record.count * record.price;
        return record.saleId = curSaleId;
      });
      SalesRecord.insertMany(list, function(err, records) {
        if(err) {
          console.log(err);
        } else if(!msg.total){
          let oldRecord = [];
          for(let record of records) {
            oldRecord.push({id: record.productId, count: 0, curCount: record.count});
          }
          StocksDAO.updateStocks(1, oldRecord);
          //如果total值不存在,则添加
          Sales.update({_id: curSaleId}, {total: total}, function (err) {
            if(err)
              return res.send({
                code: 1,
                message: '更新总金额失败'
              });
            res.send({
              code: 0,
              message: '保存成功'
            });
          });
        }
      });
    });
  }
});

router.post('/deleteSale', function (req, res) {
  let props = req.body.data;
  let saleId = props.id;
  Sales.findOne({_id: saleId}, function (err, result) {
    if(result) {
      SalesRecord.find({saleId: result._id}, function (err, records) {
        let oldRecord = [];
        for(let record of records) {
          oldRecord.push({id: record.productId, count: record.count, curCount: 0});
        }
        StocksDAO.updateStocks(1, oldRecord);
        SalesRecord.deleteMany({saleId: result._id}, function (err, results) {
          if(err) {
            return res.send({
              code: 1,
              message: '销售记录中明细删除失败'
            });
          }

          Sales.deleteOne({_id: saleId}, function (err) {
            if(err) {
              return res.send({
                code: 1,
                message: '销售记录删除失败'
              });
            }
            return res.send({
              code: 0,
              message: 'success'
            });
          })
        })
      })

    } else {
      res.send({
        code: 1,
        message: '未找到当前记录'
      });
    }
  })
});

router.post('/saleMessage', function (req, res) {
  let props = req.body.data;
  let saleId = props.id;
  Sales.findOne({_id: saleId}, function (err, result) {
    if(result) {
      SalesRecord.get({saleId: result._id}, function (err, records) {
        if(err) {
          return res.send({
            code: 1,
            message: '明细查询失败'
          });
        }
        let saleMessage = JSON.parse(JSON.stringify(result));
        saleMessage.list = records
        res.send({
          code: 0,
          data: saleMessage
        })
      })
    } else {
      res.send({
        code: 1,
        message: '未找到当前记录'
      });
    }
  })

});

module.exports = router
