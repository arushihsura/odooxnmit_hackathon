const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { ERROR_MESSAGES } = require('../utils/constants');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const result = await db.query('SELECT id, email, username, full_name FROM users WHERE id = $1', [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_TOKEN
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: ERROR_MESSAGES.INVALID_TOKEN
    });
  }
};

module.exports = {
  authenticateToken
};


