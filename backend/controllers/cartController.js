const db = require('../config/database');
const { formatResponse } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get or create cart for user (with race condition protection)
    let cartResult = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    
    if (cartResult.rows.length === 0) {
      try {
        cartResult = await db.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
      } catch (error) {
        // If cart already exists due to race condition, fetch it
        if (error.code === '23505') { // Unique constraint violation
          cartResult = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
        } else {
          throw error;
        }
      }
    }

    const cartId = cartResult.rows[0].id;

    // Get cart items with product details
    const result = await db.query(
      `SELECT ci.*, p.title, p.price, p.image_url, p.condition, p.is_available,
              c.name as category_name, u.username as seller_name
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       JOIN categories c ON p.category_id = c.id
       JOIN users u ON p.seller_id = u.id
       WHERE ci.cart_id = $1
       ORDER BY ci.added_at DESC`,
      [cartId]
    );

    // Calculate total
    const total = result.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json(
      formatResponse(true, 'Cart retrieved successfully', {
        cart: {
          id: cartId,
          items: result.rows,
          total: total.toFixed(2)
        }
      })
    );
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.user.id;

    // Check if product exists and is available
    const productResult = await db.query(
      'SELECT id, price, is_available FROM products WHERE id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.PRODUCT_NOT_FOUND)
      );
    }

    if (!productResult.rows[0].is_available) {
      return res.status(400).json(
        formatResponse(false, 'Product is not available')
      );
    }

    // Get or create cart for user (with race condition protection)
    let cartResult = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    
    if (cartResult.rows.length === 0) {
      try {
        cartResult = await db.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
      } catch (error) {
        // If cart already exists due to race condition, fetch it
        if (error.code === '23505') { // Unique constraint violation
          cartResult = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
        } else {
          throw error;
        }
      }
    }

    const cartId = cartResult.rows[0].id;

    // Check if item already exists in cart
    const existingItem = await db.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      const newQuantity = existingItem.rows[0].quantity + quantity;
      await db.query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2',
        [newQuantity, existingItem.rows[0].id]
      );
    } else {
      // Add new item
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
        [cartId, product_id, quantity]
      );
    }

    res.status(200).json(
      formatResponse(true, SUCCESS_MESSAGES.CART_ITEM_ADDED)
    );
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:id
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Get cart for user
    const cartResult = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    
    if (cartResult.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.CART_NOT_FOUND)
      );
    }

    const cartId = cartResult.rows[0].id;

    // Update cart item
    const result = await db.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND cart_id = $3 RETURNING *',
      [quantity, id, cartId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Cart item not found')
      );
    }

    res.status(200).json(
      formatResponse(true, 'Cart item updated successfully', {
        item: result.rows[0]
      })
    );
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get cart for user
    const cartResult = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    
    if (cartResult.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.CART_NOT_FOUND)
      );
    }

    const cartId = cartResult.rows[0].id;

    // Remove cart item
    const result = await db.query(
      'DELETE FROM cart_items WHERE id = $1 AND cart_id = $2 RETURNING *',
      [id, cartId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, 'Cart item not found')
      );
    }

    res.status(200).json(
      formatResponse(true, SUCCESS_MESSAGES.CART_ITEM_REMOVED)
    );
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get cart for user
    const cartResult = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    
    if (cartResult.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.CART_NOT_FOUND)
      );
    }

    const cartId = cartResult.rows[0].id;

    // Clear all cart items
    await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    res.status(200).json(
      formatResponse(true, SUCCESS_MESSAGES.CART_CLEARED)
    );
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
