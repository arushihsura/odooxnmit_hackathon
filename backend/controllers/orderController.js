const db = require('../config/database');
const { formatResponse } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES, ORDER_STATUS } = require('../utils/constants');

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's cart
    const cartResult = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    
    if (cartResult.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.CART_NOT_FOUND)
      );
    }

    const cartId = cartResult.rows[0].id;

    // Get cart items with product details
    const cartItemsResult = await db.query(
      `SELECT ci.*, p.title, p.price, p.is_available
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    if (cartItemsResult.rows.length === 0) {
      return res.status(400).json(
        formatResponse(false, 'Cart is empty')
      );
    }

    // Check if all products are still available
    const unavailableItems = cartItemsResult.rows.filter(item => !item.is_available);
    if (unavailableItems.length > 0) {
      return res.status(400).json(
        formatResponse(false, 'Some items in your cart are no longer available')
      );
    }

    // Calculate total amount
    const totalAmount = cartItemsResult.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Start transaction
    await db.query('BEGIN');

    try {
      // Create order
      const orderResult = await db.query(
        'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
        [userId, totalAmount, ORDER_STATUS.PENDING]
      );

      const order = orderResult.rows[0];

      // Create order items
      for (const item of cartItemsResult.rows) {
        await db.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
          [order.id, item.product_id, item.quantity, item.price]
        );
      }

      // Clear cart
      await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

      // Commit transaction
      await db.query('COMMIT');

      res.status(201).json(
        formatResponse(true, SUCCESS_MESSAGES.ORDER_CREATED, {
          order
        })
      );
    } catch (error) {
      // Rollback transaction
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    const result = await db.query(
      `SELECT o.*, 
              COUNT(oi.id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.status(200).json(
      formatResponse(true, 'Orders retrieved successfully', {
        orders: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          count: result.rows.length
        }
      })
    );
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get order
    const orderResult = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.ORDER_NOT_FOUND)
      );
    }

    // Get order items
    const itemsResult = await db.query(
      `SELECT oi.*, p.title, p.image_url, u.username as seller_name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       JOIN users u ON p.seller_id = u.id
       WHERE oi.order_id = $1`,
      [id]
    );

    res.status(200).json(
      formatResponse(true, 'Order retrieved successfully', {
        order: {
          ...orderResult.rows[0],
          items: itemsResult.rows
        }
      })
    );
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Update order status (for sellers)
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Check if order exists and user is the seller of any item
    const orderResult = await db.query(
      `SELECT o.* FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1 AND p.seller_id = $2`,
      [id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.ORDER_NOT_FOUND)
      );
    }

    // Update order status
    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.status(200).json(
      formatResponse(true, SUCCESS_MESSAGES.ORDER_UPDATED, {
        order: result.rows[0]
      })
    );
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus
};



