const router = require('express').Router();
const logger = require('../config/logger');
let Product = require('../models/product.model');

// --- GET ALL PRODUCTS (Updated to filter by array) ---
router.route('/').get((req, res) => {
  const { category, subCategory, search } = req.query;
  let filter = {};

  if (category && category.toLowerCase() !== 'all') {
    filter.category = category;
  }
  
  // --- FIX: Use the `$in` operator to find products where the subCategory ID is in the `subCategories` array ---
  if (subCategory && subCategory.toLowerCase() !== 'all') {
    filter.subCategories = { $in: [subCategory] };
  }

  if (search) {
    filter.name = new RegExp(search, 'i');
  }

  Product.find(filter)
    .populate('category', 'name')
    .populate('subCategories', 'name') // Now populates the array
    .then(products => res.json(products))
    .catch(err => {
      logger.error('Error fetching products: %o', err);
      res.status(400).json('Error: ' + err);
    });
});

// --- ADD A NEW PRODUCT (Updated to accept an array) ---
router.route('/add').post((req, res) => {
  // Now destructures `subCategories` as an array
  const { name, description, price, unit, image, category, subCategories, inStock, discountPrice } = req.body;
  const newProduct = new Product({
    name, description, price: Number(price), unit, image, 
    category, 
    subCategories, // This is now an array of ObjectIds
    inStock: Boolean(inStock),
    discountPrice: discountPrice && Number(discountPrice) > 0 ? Number(discountPrice) : null,
  });
  newProduct.save()
    .then(() => res.json('Product added!'))
    .catch(err => {
      logger.error('Error adding product: %o', err);
      res.status(400).json('Error: ' + err);
    });
});

// --- GET A SINGLE PRODUCT BY ID (Updated to populate array) ---
router.route('/:id').get((req, res) => {
    Product.findById(req.params.id)
      .populate('category')
      .populate('subCategories') // Now populates the array
      .then(product => res.json(product))
      .catch(err => res.status(400).json('Error: ' + err));
});

// --- UPDATE A PRODUCT BY ID (Updated to handle array) ---
router.route('/update/:id').post((req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      product.name = req.body.name;
      product.description = req.body.description;
      product.price = Number(req.body.price);
      product.unit = req.body.unit;
      product.image = req.body.image;
      product.category = req.body.category;
      product.subCategories = req.body.subCategories; // This is now an array
      product.inStock = Boolean(req.body.inStock);
      product.discountPrice = req.body.discountPrice && Number(req.body.discountPrice) > 0 ? Number(req.body.discountPrice) : null;

      product.save()
        .then(() => res.json('Product updated!'))
        .catch(err => {
          logger.error('Error saving updated product: %o', err);
          res.status(400).json('Error: ' + err);
        });
    })
    .catch(err => {
      logger.error('Error finding product to update: %o', err);
      res.status(400).json('Error: ' + err);
    });
});

// --- DELETE A PRODUCT BY ID (No change needed) ---
router.route('/:id').delete((req, res) => {
  Product.findByIdAndDelete(req.params.id).then(() => res.json('Product deleted.')).catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;