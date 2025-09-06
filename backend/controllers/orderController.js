const { Order, Cart, Product, User } = require('../models');
const { formatResponse } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES, ORDER_STATUS } = require('../utils/constants');

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's cart
    const cart = await Cart.findOne({ user_id: userId }).populate('items.product_id');
    
    if (!cart) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.CART_NOT_FOUND)
      );
    }

    if (cart.items.length === 0) {
      return res.status(400).json(
        formatResponse(false, 'Cart is empty')
      );
    }

    // Check if all products are still available
    const unavailableItems = cart.items.filter(item => !item.product_id.is_available);
    if (unavailableItems.length > 0) {
      return res.status(400).json(
        formatResponse(false, 'Some items in your cart are no longer available')
      );
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => sum + (item.product_id.price * item.quantity), 0);

    // Start transaction
    const session = await Order.startSession();
    session.startTransaction();

    try {
      // Create order items
      const orderItems = cart.items.map(item => ({
        product_id: item.product_id._id,
        quantity: item.quantity,
        price_at_purchase: item.product_id.price
      }));

      // Create order
      const order = await Order.create([{
        user_id: userId,
        total_amount: totalAmount,
        status: ORDER_STATUS.PENDING,
        items: orderItems
      }], { session });

      // Clear cart
      cart.items = [];
      await cart.save({ session });

      // Commit transaction
      await session.commitTransaction();

      res.status(201).json(
        formatResponse(true, SUCCESS_MESSAGES.ORDER_CREATED, {
          order: order[0]
        })
      );
    } catch (error) {
      // Rollback transaction
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
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

    const orders = await Order.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .select('_id total_amount status createdAt updatedAt')
      .lean();

    // Add item count to each order
    const ordersWithItemCount = await Promise.all(
      orders.map(async (order) => {
        const itemCount = await Order.aggregate([
          { $match: { _id: order._id } },
          { $unwind: '$items' },
          { $count: 'item_count' }
        ]);
        return {
          ...order,
          item_count: itemCount.length > 0 ? itemCount[0].item_count : 0
        };
      })
    );

    res.status(200).json(
      formatResponse(true, 'Orders retrieved successfully', {
        orders: ordersWithItemCount,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          count: ordersWithItemCount.length
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

    // Get order with populated items
    const order = await Order.findOne({ _id: id, user_id: userId })
      .populate({
        path: 'items.product_id',
        populate: {
          path: 'seller_id',
          select: 'username'
        }
      });

    if (!order) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.ORDER_NOT_FOUND)
      );
    }

    // Transform items to match expected format
    const items = order.items.map(item => ({
      ...item.toObject(),
      title: item.product_id.title,
      image_url: item.product_id.image_url,
      seller_name: item.product_id.seller_id?.username
    }));

    res.status(200).json(
      formatResponse(true, 'Order retrieved successfully', {
        order: {
          ...order.toObject(),
          items
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
    const order = await Order.findOne({
      _id: id,
      'items.product_id': { $exists: true }
    }).populate('items.product_id');

    if (!order) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.ORDER_NOT_FOUND)
      );
    }

    // Check if user is seller of any item in the order
    const isSeller = order.items.some(item => 
      item.product_id.seller_id.toString() === userId
    );

    if (!isSeller) {
      return res.status(403).json(
        formatResponse(false, 'You are not authorized to update this order')
      );
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    res.status(200).json(
      formatResponse(true, SUCCESS_MESSAGES.ORDER_UPDATED, {
        order: updatedOrder
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



