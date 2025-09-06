const db = require('../config/database');
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

    // Build base query for counting
    let countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.is_available = true
    `;
    let queryParams = [];
    let paramCount = 0;

    if (category && !isNaN(category)) {
      paramCount++;
      countQuery += ` AND p.category_id = $${paramCount}`;
      queryParams.push(category);
    }

    if (search) {
      paramCount++;
      // Sanitize search input - remove special characters that could cause issues
      const sanitizedSearch = search.replace(/[%_\\]/g, '\\$&');
      countQuery += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      queryParams.push(`%${sanitizedSearch}%`);
    }

    // Get total count
    const countResult = await db.query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].total);

    // Build main query for data
    let dataQuery = `
      SELECT p.*, c.name as category_name, u.username as seller_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      WHERE p.is_available = true
    `;
    
    // Add same filters to data query
    if (category && !isNaN(category)) {
      dataQuery += ` AND p.category_id = $${paramCount}`;
    }
    if (search) {
      dataQuery += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
    }

    dataQuery += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    queryParams.push(limitNum, offset);

    const result = await db.query(dataQuery, queryParams);

    res.status(200).json(
      formatResponse(true, 'Products retrieved successfully', {
        products: result.rows,
        pagination: {
          page: pageNum,
          limit: limitNum,
          count: result.rows.length,
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

    const result = await db.query(
      `SELECT p.*, c.name as category_name, u.username as seller_name, u.phone as seller_phone
       FROM products p
       JOIN categories c ON p.category_id = c.id
       JOIN users u ON p.seller_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.PRODUCT_NOT_FOUND)
      );
    }

    res.status(200).json(
      formatResponse(true, 'Product retrieved successfully', {
        product: result.rows[0]
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

    const result = await db.query(
      `INSERT INTO products (title, description, price, category_id, seller_id, image_url, condition)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, price, category_id, seller_id, image_url, condition]
    );

    res.status(201).json(
      formatResponse(true, SUCCESS_MESSAGES.PRODUCT_CREATED, {
        product: result.rows[0]
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
    const existingProduct = await db.query(
      'SELECT id FROM products WHERE id = $1 AND seller_id = $2',
      [id, seller_id]
    );

    if (existingProduct.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.PRODUCT_NOT_FOUND)
      );
    }

    const result = await db.query(
      `UPDATE products 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           category_id = COALESCE($4, category_id),
           condition = COALESCE($5, condition),
           is_available = COALESCE($6, is_available),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND seller_id = $8
       RETURNING *`,
      [title, description, price, category_id, condition, is_available, id, seller_id]
    );

    res.status(200).json(
      formatResponse(true, SUCCESS_MESSAGES.PRODUCT_UPDATED, {
        product: result.rows[0]
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
    const existingProduct = await db.query(
      'SELECT id FROM products WHERE id = $1 AND seller_id = $2',
      [id, seller_id]
    );

    if (existingProduct.rows.length === 0) {
      return res.status(404).json(
        formatResponse(false, ERROR_MESSAGES.PRODUCT_NOT_FOUND)
      );
    }

    await db.query('DELETE FROM products WHERE id = $1 AND seller_id = $2', [id, seller_id]);

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
    const result = await db.query('SELECT * FROM categories ORDER BY name');

    res.status(200).json(
      formatResponse(true, 'Categories retrieved successfully', {
        categories: result.rows
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
