# MongoDB Migration Guide

This document outlines the conversion from PostgreSQL to MongoDB for the EcoFinds backend.

## Changes Made

### 1. Database Models
- Created MongoDB schemas using Mongoose in `/models/` directory:
  - `User.js` - User management
  - `Category.js` - Product categories
  - `Product.js` - Product listings
  - `Cart.js` - Shopping cart with embedded items
  - `Order.js` - Orders with embedded items
  - `UserOTP.js` - OTP management for password reset
  - `UserToken.js` - JWT token management

### 2. Controllers Updated
All controllers have been converted from PostgreSQL queries to MongoDB operations:
- `authController.js` - Authentication operations
- `userController.js` - User profile management
- `productController.js` - Product CRUD operations
- `cartController.js` - Shopping cart operations
- `orderController.js` - Order management
- `passwordResetController.js` - Password reset functionality

### 3. Services Updated
- `otpService.js` - OTP generation and verification using MongoDB

### 4. Middleware Updated
- `auth.js` - JWT authentication middleware

### 5. Database Configuration
- `config/database.js` - Already configured for MongoDB with Mongoose
- Connection string: `MONGODB_URI` in environment variables

## Key Differences from PostgreSQL

### 1. Data Structure
- **PostgreSQL**: Relational tables with foreign keys
- **MongoDB**: Document-based with embedded subdocuments and references

### 2. Cart Structure
- **PostgreSQL**: Separate `carts` and `cart_items` tables
- **MongoDB**: Single `Cart` document with embedded `items` array

### 3. Order Structure
- **PostgreSQL**: Separate `orders` and `order_items` tables
- **MongoDB**: Single `Order` document with embedded `items` array

### 4. Queries
- **PostgreSQL**: SQL queries with JOINs
- **MongoDB**: Mongoose queries with population for references

## Setup Instructions

### 1. Environment Variables
Update your `.env` file with MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017/ecofinds_db
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecofinds_db?retryWrites=true&w=majority
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Categories
Run the category seeding script:
```bash
npm run seed:categories
```

### 4. Start the Server
```bash
npm run dev
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password_hash: String,
  username: String (unique),
  profile_image: String,
  full_name: String,
  phone: String,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  category_id: ObjectId (ref: Category),
  seller_id: ObjectId (ref: User),
  image_url: String,
  condition: String,
  is_available: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Carts Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User, unique),
  items: [{
    product_id: ObjectId (ref: Product),
    quantity: Number,
    added_at: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId (ref: User),
  total_amount: Number,
  status: String,
  items: [{
    product_id: ObjectId (ref: Product),
    quantity: Number,
    price_at_purchase: Number,
    created_at: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Migration Notes

1. **Indexes**: All necessary indexes have been created for performance
2. **Validation**: Mongoose schemas include validation rules
3. **References**: Proper population is used for related data
4. **Transactions**: MongoDB transactions are used for order creation
5. **Text Search**: MongoDB text indexes are used for product search

## Testing

After migration, test the following functionality:
1. User registration and login
2. Product CRUD operations
3. Cart operations (add, update, remove, clear)
4. Order creation and management
5. Password reset with OTP
6. Category management

## Troubleshooting

### Common Issues
1. **Connection Issues**: Ensure MongoDB is running and connection string is correct
2. **Index Errors**: Run the seeding script to create initial data
3. **Validation Errors**: Check that all required fields are provided
4. **Population Errors**: Ensure referenced documents exist

### Performance Considerations
1. Use indexes for frequently queried fields
2. Limit population depth to avoid performance issues
3. Use aggregation pipelines for complex queries
4. Consider caching for frequently accessed data
