const { Product, Category, User } = require('../models');
const { formatResponse } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');

// @desc    Get all products with optional filtering and search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    // Validate and sanitize numeric parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20)); // Max 100 items per page
    const offset = (pageNum - 1) * limitNum;

    // Build query filter
    const filter = { is_available: true };
    
    if (category && !isNaN(category)) {
      filter.category_id = category;
    }

    if (search) {
      // Use regex search instead of text search for better compatibility
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const totalCount = await Product.countDocuments(filter);

    // Build aggregation pipeline
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'seller_id',
          foreignField: '_id',
          as: 'seller'
        }
      },
      {
        $addFields: {
          category_name: { $arrayElemAt: ['$category.name', 0] },
          seller_name: { $arrayElemAt: ['$seller.username', 0] }
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: offset },
      { $limit: limitNum },
      {
        $project: {
          category: 0,
          seller: 0
        }
      }
    ];

    const products = await Product.aggregate(pipeline);

    res.status(200).json(
      formatResponse(true, 'Products retrieved successfully', {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          count: products.length,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      })
    );
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('category_id', 'name')
      .populate('seller_id', 'username phone');

    if (!product) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.PRODUCT_NOT_FOUND)
      );
    }

    const productData = {
      ...product.toObject(),
      category_name: product.category_id?.name,
      seller_name: product.seller_id?.username,
      seller_phone: product.seller_id?.phone
    };

    res.status(200).json(
      formatResponse(true, 'Product retrieved successfully', {
        product: productData
      })
    );
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category_id, condition } = req.body;
    const seller_id = req.user.id;
    const image_url = req.file ? req.file.filename : 'placeholder.jpg';

    const product = await Product.create({
      title,
      description,
      price,
      category_id,
      seller_id,
      image_url,
      condition
    });

    res.status(201).json(
      formatResponse(true, SUCCESS_MESSAGES.PRODUCT_CREATED, {
        product
      })
    );
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category_id, condition, is_available } = req.body;
    const seller_id = req.user.id;

    // Check if product exists and belongs to user
    const existingProduct = await Product.findOne({
      _id: id,
      seller_id: seller_id
    });

    if (!existingProduct) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.PRODUCT_NOT_FOUND)
      );
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (condition !== undefined) updateData.condition = condition;
    if (is_available !== undefined) updateData.is_available = is_available;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(
      formatResponse(true, SUCCESS_MESSAGES.PRODUCT_UPDATED, {
        product
      })
    );
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const seller_id = req.user.id;

    // Check if product exists and belongs to user
    const existingProduct = await Product.findOne({
      _id: id,
      seller_id: seller_id
    });

    if (!existingProduct) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.PRODUCT_NOT_FOUND)
      );
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json(
      formatResponse(true, SUCCESS_MESSAGES.PRODUCT_DELETED)
    );
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json(
      formatResponse(true, 'Categories retrieved successfully', {
        categories
      })
    );
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};
