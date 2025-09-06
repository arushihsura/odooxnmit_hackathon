const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { formatResponse } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, username, full_name, phone, address, profile_image, created_at 
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.USER_NOT_FOUND)
      );
    }

    res.status(200).json(
      formatResponse(true, 'Profile retrieved successfully', {
        user: result.rows[0]
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
      const existingUser = await db.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [username, userId]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json(
          formatResponse(false, ERROR_MESSAGES.USERNAME_EXISTS)
        );
      }
    }

    const result = await db.query(
      `UPDATE users 
       SET username = COALESCE($1, username),
           full_name = COALESCE($2, full_name),
           phone = COALESCE($3, phone),
           address = COALESCE($4, address),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, email, username, full_name, phone, address, profile_image, updated_at`,
      [username, full_name, phone, address, userId]
    );

    res.status(200).json(
      formatResponse(true, 'Profile updated successfully', {
        user: result.rows[0]
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
    const result = await db.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.USER_NOT_FOUND)
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json(
        formatResponse(false, 'Current password is incorrect')
      );
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userId]
    );

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

    const result = await db.query(
      `SELECT p.*, c.name as category_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.seller_id = $1
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, limit, offset]
    );

    res.status(200).json(
      formatResponse(true, 'Products retrieved successfully', {
        products: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          count: result.rows.length
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



