const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // Cloudinary URL for the sub-category image
    required: true,
  },
  // Link back to the parent category
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  }
}, {
  timestamps: true,
});

// This ensures that within one parent category, each sub-category name is unique.
// For example, you can have 'Curry Cuts' in 'Chicken' and 'Curry Cuts' in 'Mutton',
// but you cannot have two 'Curry Cuts' sub-categories in 'Chicken'.
subCategorySchema.index({ name: 1, parentCategory: 1 }, { unique: true });

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;