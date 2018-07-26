const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  value: String
});

productSchema.statics = {
  get: function (query, cb) {
    return this.find(query).exec(cb)
  },
  findDetail: function (query, cb) {
    return this.find(query).populate().exec(cb);
  }
}

module.exports = productSchema
