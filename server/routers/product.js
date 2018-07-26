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

router.post('/productDetails', function (req, res) {
  let value = req.body.name;
  let query = {};
  if(value) {
    query.value = value;
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
      ProductBrand.get({product:{$in: query}}, function (err, brands) {
        query = [];
        for(let b of brands) {
          query.push({brand: b.id});
        }
        ProductDetail.get({$or:query}, function (err, details) {
          res.send(details);
        });
      });
    }
  });
});


module.exports = router
