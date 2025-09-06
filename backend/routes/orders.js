const express = require('express');
const { 
  createOrder, 
  getOrders, 
  getOrder, 
  updateOrderStatus 
} = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// @route   POST /api/orders
// @desc    Create order from cart
// @access  Private
router.post('/', createOrder);

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', getOrders);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', getOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', updateOrderStatus);

module.exports = router;
