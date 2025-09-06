const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { generateToken, formatResponse } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, username, full_name, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json(
        formatResponse(false, ERROR_MESSAGES.EMAIL_EXISTS)
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, username, full_name, phone, address) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, username, full_name, created_at`,
      [email, passwordHash, username, full_name, phone, address]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json(
      formatResponse(true, SUCCESS_MESSAGES.USER_CREATED, {
        user,
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
    const result = await db.query(
      'SELECT id, email, password_hash, username, full_name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json(
        formatResponse(false, ERROR_MESSAGES.INVALID_CREDENTIALS)
      );
    }

    const user = result.rows[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json(
        formatResponse(false, ERROR_MESSAGES.INVALID_CREDENTIALS)
      );
    }

    const token = generateToken(user.id);

    res.status(200).json(
      formatResponse(true, SUCCESS_MESSAGES.LOGIN_SUCCESS, {
        user: {
          id: user.id,
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



