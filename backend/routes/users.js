const express = require('express');
const { getProfile, updateProfile, changePassword, getMyProducts } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', updateProfile);

// @route   PUT /api/users/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', changePassword);

// @route   GET /api/users/my-products
// @desc    Get user's products
// @access  Private
router.get('/my-products', getMyProducts);

module.exports = router;



