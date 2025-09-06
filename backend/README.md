# EcoFinds Backend API

A complete backend implementation for EcoFinds, a second-hand marketplace platform built with Node.js, Express.js, and PostgreSQL.

## 🚀 Features

- **User Authentication**: JWT-based authentication with registration and login
- **Product Management**: Create, read, update, delete products with image uploads
- **Shopping Cart**: Add, remove, and manage cart items
- **Order Management**: Create orders from cart with transaction support
- **Category System**: Predefined product categories
- **Image Upload**: Local file storage with Multer
- **Input Validation**: Comprehensive validation using express-validator
- **Security**: Password hashing with bcryptjs, CORS protection

## 📁 Project Structure

```
ecofinds-backend/
├── config/                 # Configuration files
│   └── database.js         # PostgreSQL connection pool setup
├── database/               # Database initialization scripts
│   └── init.sql           # SQL to create tables & seed categories
├── controllers/            # Route handlers (business logic)
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
├── middleware/             # Custom middleware
│   ├── auth.js            # JWT verification
│   ├── upload.js          # Multer configuration for images
│   └── validation.js      # express-validator rules
├── routes/                 # API route definitions
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── cart.js
│   └── orders.js
├── utils/                  # Helper functions
│   ├── helpers.js         # JWT generation, response formatter
│   └── constants.js       # App constants (user roles, error messages)
├── uploads/                # Directory for uploaded product images
├── env.example            # Template for required environment variables
├── package.json
├── server.js              # Main application entry point
└── README.md              # This file
```

## 🛠️ Prerequisites

Before running this application, make sure you have the following installed:

1. **Node.js** (v14 or higher)
2. **PostgreSQL** (v12 or higher)
3. **npm** or **yarn**

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecofinds-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   
   a. Install PostgreSQL on your local machine
   
   b. Create a new database:
   ```sql
   CREATE DATABASE ecofinds_db;
   ```
   
   c. Run the initialization script:
   ```bash
   psql -U your_username -d ecofinds_db -f database/init.sql
   ```

4. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_here
   DB_USER=your_postgres_username
   DB_HOST=localhost
   DB_NAME=ecofinds_db
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `PUT /api/users/change-password` - Change password (Protected)
- `GET /api/users/my-products` - Get user's products (Protected)

### Products
- `GET /api/products` - Get all products (with filtering and search)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (Protected)
- `PUT /api/products/:id` - Update product (Protected)
- `DELETE /api/products/:id` - Delete product (Protected)

### Cart
- `GET /api/cart` - Get user's cart (Protected)
- `POST /api/cart/items` - Add item to cart (Protected)
- `PUT /api/cart/items/:id` - Update cart item quantity (Protected)
- `DELETE /api/cart/items/:id` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Orders
- `POST /api/orders` - Create order from cart (Protected)
- `GET /api/orders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `PUT /api/orders/:id/status` - Update order status (Protected)

## 🔐 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Example Usage

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "username": "johndoe",
    "full_name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a product (with image upload)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <your_jwt_token>" \
  -F "title=iPhone 12" \
  -F "description=Great condition iPhone" \
  -F "price=500" \
  -F "category_id=1" \
  -F "condition=Good" \
  -F "image=@/path/to/image.jpg"
```

## 🗄️ Database Schema

The database includes the following main tables:
- `users` - User accounts and profiles
- `categories` - Product categories
- `products` - Product listings
- `carts` - User shopping carts
- `cart_items` - Items in carts
- `orders` - Order records
- `order_items` - Items in orders

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- CORS protection
- File upload validation

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

## 📊 Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

## 🔧 Development

- Use `npm run dev` for development with auto-restart
- Check logs for debugging information
- All database queries use parameterized statements for security
- Images are stored in the `uploads/` directory

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the repository.



