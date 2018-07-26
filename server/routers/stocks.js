const express = require('express');

const Stocks = require('../models/stocks');
const Record = require('../models/salesRecord');
const StocksDAO = require('../dao/stocks')

const router = express.Router();

/**
 * 列表查询
 */
router.post('/stocks', function (req, res) {
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
  let stocksList = [];
  let total = 0;
  Promise.all([
    Stocks.get(query, page),
    Stocks.estimatedDocumentCount(query)
  ]).then(function(result){
    if(!result) {
      console.log('报错了');
    } else{
      //数据库查询返回的参数是只读格式,无法修改.
      stocksList = JSON.parse(JSON.stringify(result[0]));
      total = result[1];
      let promises = stocksList.map((stock) => {
        return Record.get({stockId: stock.id});
      });
      return Promise.all(promises);
    }
  }).then(records => {
    for(let index in stocksList) {
      stocksList[index].records = records[index];
    }
    res.send(
      {
        code: 0,
        stocksList: stocksList,
        page: {
          page: page.page,
          size: page.size,
          total: total,
        }
      });
  });
});
/**
 * 保存
 */
router.post('/saveStocks', function (req, res) {
  let props = req.body.data;
  let list = props.list;
  delete props.list;
  if(props._id) {
    //编辑保存
    let objid = props._id;
    delete props._id;

    let insertList = [];
    let updateList = [];

    for(let record of list) {
      if (record._id) updateList.push(record);
      else {
        record.saleId = objid;
        insertList.push(record);
      }
    }
    Stocks.findByIdAndUpdate(objid, props).then(sale => {
      if (!sale)
        return res.send({
          code: 1,
          message: '销售记录更新失败!'
        });
      if(updateList.length > 0) {
        let promises = updateList.map((record) => {
          let recordId = record._id;
          delete record._id;
          return Record.findByIdAndUpdate(recordId, record);
        });
        return Promise.all(promises);
      }
      return Promise.all([]);
    }).then(result => {
      if(result.length + insertList.length === list.length) {
        if(insertList.length > 0) {
          Record.insertMany(insertList, function (err, newlist) {
            if(err)
              return res.send({
                code: 1,
                message: '销售明细新增失败!'
              });
            StocksDAO.updateTotal(objid);
            res.send({
              code: 0,
              message: '保存成功'
            });
          });
        } else {
          if(!props.total) {
            StocksDAO.updateTotal(objid);
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
    let stock = new Stocks(props);
    stock.save(function (err, msg) {
      if (err) return console.log(err);
      let curStockId = msg._id;
      let total = 0;
      list.every((record) => {
        total += record.count * record.price;
        return record.stockId = curStockId;
      });
      Record.insertMany(list, function(err) {
        if(err) {
          console.log(err);
        } else if(!msg.total){
          //如果total值不存在,则添加
          Stocks.update({_id: curStockId}, {total: total}, function (err) {
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
/**
 * 删除
 */
router.post('/deleteStock', function (req, res) {
  let props = req.body.data;
  let stockId = props.id;
  Stocks.findOne({_id: stockId}, function (err, result) {
    if(result) {
      Record.deleteMany({stockId: result._id}, function (err) {
        if(err) {
          return res.send({
            code: 1,
            message: '进货记录中明细删除失败'
          });
        }

        Stocks.deleteOne({_id: stockId}, function (err) {
          if(err) {
            return res.send({
              code: 1,
              message: '进货记录删除失败'
            });
          }
          return res.send({
            code: 0,
            message: 'success'
          });
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
/**
 * 详情查询
 */
router.post('/stockMessage', function (req, res) {
  let props = req.body.data;
  let stockId = props.id;
  Stocks.findOne({_id: stockId}, function (err, result) {
    if(result) {
      Record.get({stockId: result._id}, function (err, records) {
        if(err) {
          return res.send({
            code: 1,
            message: '明细查询失败'
          });
        }
        let stockMessage = JSON.parse(JSON.stringify(result));
        stockMessage.list = records
        res.send({
          code: 0,
          data: stockMessage
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

module.exports = router;
