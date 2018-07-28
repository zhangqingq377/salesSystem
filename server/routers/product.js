const express = require('express');

const Product = require('../models/product');
const ProductBrand = require('../models/productBrand');
const ProductDetail = require('../models/productDetail');
const router = express.Router();

router.get('/products', function (req, res) {
  Product.get({}, function (err, products) {
    if(err) {
      console.log(err);
    } else{
      res.send(products);
    }
  });
});

router.get('/brandDetails', function (req, res) {
  ProductBrand.get({}, function (err, brands) {
    if(err) {
      console.log(err);
    } else {
      res.send(brands);
    }
  })
});

router.post('/productMessage', function (req, res) {
  let props = req.body.data;
  ProductDetail.get({_id: props.id}, function (err, result) {
    if(result) {
      res.send({
        code: 0,
        data: result
      });
    } else {
      res.send({
        code: 1,
        message: '未找到当前记录'
      });
    }
  })

});

router.post('/productDetails', function (req, res) {
  let product = req.body.product;
  let query = {};
  if(product) {
    query.value = product;
  }
  //判空
  Product.get(query, function (err, products) {
    if(err) {
      console.log(err);
    } else{
      let query = [];
      for(let p of products) {
        query.push(p.id);
      }
      let brandQuery = {
        product: {$in: query}
      };
      let brandId = req.body.brandId;
      if(brandId) {
        brandQuery._id = brandId;
      }
      ProductBrand.get(brandQuery, function (err, brands) {
        query = [];
        for(let b of brands) {
          query.push({brand: b.id});
        }
        let productQuery = {
          $or: query
        };
        let name = req.body.name;
        if(name) {
          productQuery.name = {$regex : new RegExp(name, 'i')};
        }
        ProductDetail.get(productQuery, function (err, details) {
          res.send(details);
        });
      });
    }
  });
});

router.post('/saveProduct', function (req, res) {
  let props = req.body.data;
  if(props._id) {
    ProductDetail.findByIdAndUpdate(props._id, props).then(product => {
      if(product) res.send({
        code: 0,
        message: '保存成功'
      });
      else res.send({
        code: 1,
        message: '保存失败'
      });
    });
  } else {
    let product = new ProductDetail(props);
    product.save(function (err, msg) {
      if (err) return console.log(err);
      res.send({
        code: 0,
        message: '保存成功'
      });
    });
  }
});


module.exports = router
