const express = require('express');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getCategories 
} = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', getCategories);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', getProduct);

// Protected routes
router.use(authenticateToken);

// @route   POST /api/products
// @desc    Create new product
// @access  Private
router.post('/', upload.single('image'), handleUploadError, validateProduct, createProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private
router.put('/:id', validateProduct, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private
router.delete('/:id', deleteProduct);

module.exports = router;

