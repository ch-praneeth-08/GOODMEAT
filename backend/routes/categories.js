const router = require('express').Router();
const logger = require('../config/logger');
const mongoose = require('mongoose');
const Category = require('../models/category.model');
const SubCategory = require('../models/subcategory.model');

// --- GET ALL CATEGORIES (POPULATED WITH SUB-CATEGORIES) ---
router.route('/').get((req, res) => {
  Category.find()
    .sort({ name: 1 })
    .populate('subCategories')
    .then(categories => res.json(categories))
    .catch(err => {
      logger.error('Error fetching categories: %o', err);
      res.status(400).json('Error: ' + err);
    });
});

// --- ADD A NEW CATEGORY ---
router.route('/add').post((req, res) => {
  // --- UPDATED: Simplified to use only 'image' ---
  const { name, description, image } = req.body;
  const newCategory = new Category({ name, description, image });
  
  newCategory.save()
    .then(() => res.json('Category added!'))
    .catch(err => {
      logger.error('Error adding category: %o', err);
      if (err.code === 11000) {
        return res.status(400).json({ message: 'Error: This category already exists.' });
      }
      res.status(400).json('Error: ' + err);
    });
});

// --- UPDATE A CATEGORY BY ID ---
router.route('/update/:id').post((req, res) => {
  Category.findById(req.params.id)
    .then(category => {
      if (!category) return res.status(404).json('Error: Category not found.');
      
      // --- UPDATED: Simplified to use only 'image' ---
      category.name = req.body.name;
      category.description = req.body.description;
      category.image = req.body.image;

      category.save()
        .then(() => res.json('Category updated!'))
        .catch(err => {
            logger.error('Error updating category: %o', err);
            res.status(400).json('Error: ' + err)
        });
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// --- GET A SINGLE CATEGORY BY NAME (POPULATED) ---
router.route('/by-name/:name').get((req, res) => {
    Category.findOne({ name: new RegExp(`^${req.params.name}$`, 'i') })
      .populate('subCategories')
      .then(category => {
        if (!category) {
          return res.status(404).json('Error: Category not found');
        }
        res.json(category);
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });

// --- DELETE A CATEGORY AND ITS SUB-CATEGORIES ---
router.route('/:id').delete(async (req, res) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await SubCategory.deleteMany({ parentCategory: id }, { session });
        const result = await Category.findByIdAndDelete(id, { session });
        if (!result) {
            throw new Error('Category not found.');
        }
        await session.commitTransaction();
        res.json('Category and all its sub-categories have been deleted.');
    } catch (err) {
        await session.abortTransaction();
        logger.error('Error deleting category and its children: %o', err);
        res.status(400).json({ message: 'Error: ' + (err.message || 'Could not delete category.') });
    } finally {
        session.endSession();
    }
});

module.exports = router;