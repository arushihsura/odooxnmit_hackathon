const bcrypt = require('bcryptjs');
const { User, Product, Category } = require('../models');
const { formatResponse } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');

    if (!user) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.USER_NOT_FOUND)
      );
    }

    res.status(200).json(
      formatResponse(true, 'Profile retrieved successfully', {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
          phone: user.phone,
          address: user.address,
          profile_image: user.profile_image,
          created_at: user.createdAt
        }
      })
    );
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { username, full_name, phone, address } = req.body;
    const userId = req.user.id;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(400).json(
          formatResponse(false, ERROR_MESSAGES.USERNAME_EXISTS)
        );
      }
    }

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password_hash');

    res.status(200).json(
      formatResponse(true, 'Profile updated successfully', {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
          phone: user.phone,
          address: user.address,
          profile_image: user.profile_image,
          updated_at: user.updatedAt
        }
      })
    );
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get current password hash
    const user = await User.findById(userId).select('password_hash');

    if (!user) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.USER_NOT_FOUND)
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json(
        formatResponse(false, 'Current password is incorrect')
      );
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(userId, { password_hash: newPasswordHash });

    res.status(200).json(
      formatResponse(true, 'Password changed successfully')
    );
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Get user's products
// @route   GET /api/users/my-products
// @access  Private
const getMyProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const products = await Product.find({ seller_id: req.user.id })
      .populate('category_id', 'name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    res.status(200).json(
      formatResponse(true, 'Products retrieved successfully', {
        products: products.map(product => ({
          ...product.toObject(),
          category_name: product.category_id?.name
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          count: products.length
        }
      })
    );
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getMyProducts
};



