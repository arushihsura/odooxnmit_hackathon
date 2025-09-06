const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('uploads')); // Serve uploaded images

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'EcoFinds API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders'
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server with error handling
app.listen(PORT, () => {
  console.log(` EcoFinds Backend running on http://localhost:${PORT}`);
  console.log(` API Documentation available at http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(` Port ${PORT} is already in use. Try a different port.`);
  } else {
    console.error(` Server error: ${err.message}`);
  }
});