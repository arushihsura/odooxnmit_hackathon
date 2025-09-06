// User roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Order statuses
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Product conditions
const PRODUCT_CONDITION = {
  NEW: 'New',
  LIKE_NEW: 'Like New',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor'
};

// Error messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Access denied. No token provided.',
  INVALID_TOKEN: 'Invalid token.',
  USER_NOT_FOUND: 'User not found.',
  PRODUCT_NOT_FOUND: 'Product not found.',
  CART_NOT_FOUND: 'Cart not found.',
  ORDER_NOT_FOUND: 'Order not found.',
  INSUFFICIENT_STOCK: 'Insufficient stock available.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_EXISTS: 'Email already exists.',
  USERNAME_EXISTS: 'Username already exists.',
  SERVER_ERROR: 'Internal server error.'
};

// Success messages
const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully.',
  LOGIN_SUCCESS: 'Login successful.',
  PRODUCT_CREATED: 'Product created successfully.',
  PRODUCT_UPDATED: 'Product updated successfully.',
  PRODUCT_DELETED: 'Product deleted successfully.',
  CART_ITEM_ADDED: 'Item added to cart successfully.',
  CART_ITEM_REMOVED: 'Item removed from cart successfully.',
  CART_CLEARED: 'Cart cleared successfully.',
  ORDER_CREATED: 'Order created successfully.',
  ORDER_UPDATED: 'Order updated successfully.'
};

module.exports = {
  USER_ROLES,
  ORDER_STATUS,
  PRODUCT_CONDITION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};

