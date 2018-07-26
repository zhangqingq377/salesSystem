const mongoose = require('mongoose');

const productBrandSchema = new mongoose.Schema({
  id: String,
  name: String,
  product: String,
  productId: {type: mongoose.Schema.Types.ObjectId, ref: 'product'}
});

productBrandSchema.statics = {
  get: function (query, cb) {
    return this.find(query)
      .populate('productId')
      .exec(cb)
  }
}

module.exports = productBrandSchema
