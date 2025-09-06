const mongoose = require('mongoose');
const { Category } = require('../models');
require('dotenv').config();

const categories = [
  { name: 'Electronics', description: 'Phones, laptops, gadgets, and electronics' },
  { name: 'Clothing', description: 'Clothes, shoes, and accessories' },
  { name: 'Home & Garden', description: 'Furniture, decor, and garden items' },
  { name: 'Books & Media', description: 'Books, movies, music, and games' },
  { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },
  { name: 'Toys & Games', description: 'Toys, board games, and collectibles' },
  { name: 'Other', description: 'Miscellaneous items' }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    await Category.insertMany(categories);
    console.log('Categories seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
