const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Format API response
const formatResponse = (success, message, data = null, error = null) => {
  return {
    success,
    message,
    data,
    error
  };
};

// Generate unique filename for uploads
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  return `${timestamp}.${extension}`;
};

module.exports = {
  generateToken,
  formatResponse,
  generateUniqueFilename
};

