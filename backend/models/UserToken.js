const mongoose = require('mongoose');

const userTokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Indexes for performance
userTokenSchema.index({ user_id: 1 });
userTokenSchema.index({ expires_at: 1 });

module.exports = mongoose.model('UserToken', userTokenSchema);
