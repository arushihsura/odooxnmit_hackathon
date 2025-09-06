const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image_url: {
    type: String,
    default: 'placeholder.jpg'
  },
  condition: {
    type: String,
    default: 'Good',
    enum: ['Excellent', 'Good', 'Fair', 'Poor']
  },
  is_available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
productSchema.index({ seller_id: 1 });
productSchema.index({ category_id: 1 });
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ is_available: 1 });

module.exports = mongoose.model('Product', productSchema);
