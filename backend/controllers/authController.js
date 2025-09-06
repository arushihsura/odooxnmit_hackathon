const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken, formatResponse } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, username, full_name, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json(
        formatResponse(false, ERROR_MESSAGES.EMAIL_EXISTS)
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      email,
      password_hash: passwordHash,
      username,
      full_name,
      phone,
      address
    });

    const token = generateToken(user._id);

    res.status(201).json(
      formatResponse(true, SUCCESS_MESSAGES.USER_CREATED, {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
          created_at: user.createdAt
        },
        token
      })
    );
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('_id email password_hash username full_name');

    if (!user) {
      return res.status(401).json(
        formatResponse(false, ERROR_MESSAGES.INVALID_CREDENTIALS)
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json(
        formatResponse(false, ERROR_MESSAGES.INVALID_CREDENTIALS)
      );
    }

    const token = generateToken(user._id);

    res.status(200).json(
      formatResponse(true, SUCCESS_MESSAGES.LOGIN_SUCCESS, {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          full_name: user.full_name
        },
        token
      })
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json(
      formatResponse(true, 'User retrieved successfully', {
        user: req.user
      })
    );
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

module.exports = {
  register,
  login,
  getMe
};



