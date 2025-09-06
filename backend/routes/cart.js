const express = require('express');
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');
const { validateCartItem } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', getCart);

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Private
router.post('/items', validateCartItem, addToCart);

// @route   PUT /api/cart/items/:id
// @desc    Update cart item quantity
// @access  Private
router.put('/items/:id', updateCartItem);

// @route   DELETE /api/cart/items/:id
// @desc    Remove item from cart
// @access  Private
router.delete('/items/:id', removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', clearCart);

module.exports = router;



