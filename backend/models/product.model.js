const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true, default: 'per 500g' },
  image: { type: String, required: true },
  
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  
  // --- FIX: Changed from a single ObjectId to an array of ObjectIds ---
  subCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
  }],

  inStock: { type: Boolean, default: true },
  discountPrice: { type: Number, default: null }
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;