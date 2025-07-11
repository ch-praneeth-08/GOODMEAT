const router = require('express').Router();
const logger = require('../config/logger');
const SubCategory = require('../models/subcategory.model');
const Category = require('../models/category.model');
const mongoose = require('mongoose');

// --- ADD A NEW SUB-CATEGORY AND LINK TO PARENT ---
router.route('/add').post(async (req, res) => {
  const { name, image, parentCategoryId } = req.body;

  if (!name || !image || !parentCategoryId) {
    return res.status(400).json({ message: 'Missing required fields: name, image, or parentCategoryId.' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parentCategory = await Category.findById(parentCategoryId).session(session);
    if (!parentCategory) {
      throw new Error('Parent category not found.');
    }

    const newSubCategory = new SubCategory({
      name,
      image,
      parentCategory: parentCategoryId,
    });
    
    const savedSubCategory = await newSubCategory.save({ session });

    parentCategory.subCategories.push(savedSubCategory._id);
    await parentCategory.save({ session });

    await session.commitTransaction();
    res.json('Sub-category added and linked successfully!');

  } catch (err) {
    await session.abortTransaction();
    logger.error('Error adding sub-category: %o', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'This sub-category already exists within the selected parent category.' });
    }
    res.status(400).json({ message: 'Error: ' + (err.message || 'Could not add sub-category.') });
  } finally {
    session.endSession();
  }
});


// --- UPDATE A SUB-CATEGORY BY ID ---
router.route('/update/:id').post((req, res) => {
  SubCategory.findById(req.params.id)
    .then(subcategory => {
      if (!subcategory) return res.status(404).json('Error: Sub-category not found.');
      
      subcategory.name = req.body.name || subcategory.name;
      subcategory.image = req.body.image || subcategory.image;

      subcategory.save()
        .then(() => res.json('Sub-category updated!'))
        .catch(err => {
            logger.error('Error updating sub-category: %o', err);
            res.status(400).json('Error: ' + err)
        });
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


// --- DELETE A SUB-CATEGORY AND UNLINK FROM PARENT ---
router.route('/:id').delete(async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const subCategoryToDelete = await SubCategory.findById(id).session(session);
    if (!subCategoryToDelete) {
      throw new Error('Sub-category not found.');
    }

    // Unlink from parent category
    await Category.updateOne(
      { _id: subCategoryToDelete.parentCategory },
      { $pull: { subCategories: id } },
      { session }
    );

    // TODO: Add logic here to check if any products use this sub-category before deleting.
    // For now, we proceed with deletion.

    await SubCategory.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    res.json('Sub-category deleted and unlinked successfully.');

  } catch (err) {
    await session.abortTransaction();
    logger.error('Error deleting sub-category: %o', err);
    res.status(400).json({ message: 'Error: ' + (err.message || 'Could not delete sub-category.') });
  } finally {
    session.endSession();
  }
});


// --- GET ALL SUB-CATEGORIES FOR A SPECIFIC PARENT CATEGORY ---
router.route('/by-category/:categoryId').get((req, res) => {
    SubCategory.find({ parentCategory: req.params.categoryId })
      .sort({ name: 1 })
      .then(subcategories => res.json(subcategories))
      .catch(err => {
        logger.error('Error fetching sub-categories by parent: %o', err);
        res.status(400).json('Error: ' + err);
      });
});


module.exports = router;