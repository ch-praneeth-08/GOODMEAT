const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true,
  },
  // --- SIMPLIFIED: Only one image field for the category ---
  image: {
    type: String,
  },
  // An array to hold references to all child sub-categories
  subCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'SubCategory'
  }]
}, {
  timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;