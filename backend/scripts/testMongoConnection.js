const mongoose = require('mongoose');
const { User, Category, Product } = require('../models');
require('dotenv').config();

const testMongoConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Test basic operations
    console.log('\nTesting basic operations...');

    // Test User model
    const userCount = await User.countDocuments();
    console.log(`✅ User model working - Found ${userCount} users`);

    // Test Category model
    const categoryCount = await Category.countDocuments();
    console.log(`✅ Category model working - Found ${categoryCount} categories`);

    // Test Product model
    const productCount = await Product.countDocuments();
    console.log(`✅ Product model working - Found ${productCount} products`);

    // Test aggregation
    const productsWithCategories = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $limit: 1 }
    ]);
    console.log('✅ Aggregation working - Products can be joined with categories');

    console.log('\n🎉 All MongoDB operations working correctly!');
    console.log('\nNext steps:');
    console.log('1. Run "npm run seed:categories" to seed initial categories');
    console.log('2. Start the server with "npm run dev"');
    console.log('3. Test the API endpoints');

  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure MongoDB is running');
    console.error('2. Check your MONGODB_URI in .env file');
    console.error('3. Ensure the database name is correct');
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
    process.exit(0);
  }
};

testMongoConnection();
