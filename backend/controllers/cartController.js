const { Cart, Product, Category, User } = require('../models');
const { formatResponse } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get or create cart for user
    let cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      cart = await Cart.create({ user_id: userId, items: [] });
    }

    // Populate cart items with product details
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product_id',
        populate: [
          { path: 'category_id', select: 'name' },
          { path: 'seller_id', select: 'username' }
        ]
      });

    // Transform the data to match the expected format
    const items = populatedCart.items.map(item => {
      const product = item.product_id;
      return {
        id: item._id,
        product_id: product._id,
        quantity: item.quantity,
        added_at: item.added_at,
        title: product.title,
        price: product.price,
        image_url: product.image_url,
        condition: product.condition,
        is_available: product.is_available,
        category_name: product.category_id?.name,
        seller_name: product.seller_id?.username
      };
    });

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.status(200).json(
      formatResponse(true, 'Cart retrieved successfully', {
        cart: {
          id: cart._id,
          items,
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
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.PRODUCT_NOT_FOUND)
      );
    }

    if (!product.is_available) {
      return res.status(400).json(
        formatResponse(false, 'Product is not available')
      );
    }

    // Get or create cart for user
    let cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      cart = await Cart.create({ user_id: userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product_id.toString() === product_id
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product_id,
        quantity
      });
    }

    await cart.save();

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
    const cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.CART_NOT_FOUND)
      );
    }

    // Find and update cart item
    const itemIndex = cart.items.findIndex(item => item._id.toString() === id);
    
    if (itemIndex === -1) {
      return res.status(404).json(
        formatResponse(false, 'Cart item not found')
      );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json(
      formatResponse(true, 'Cart item updated successfully', {
        item: cart.items[itemIndex]
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
    const cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.CART_NOT_FOUND)
      );
    }

    // Find and remove cart item
    const itemIndex = cart.items.findIndex(item => item._id.toString() === id);
    
    if (itemIndex === -1) {
      return res.status(404).json(
        formatResponse(false, 'Cart item not found')
      );
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

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
    const cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.CART_NOT_FOUND)
      );
    }

    // Clear all cart items
    cart.items = [];
    await cart.save();

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
