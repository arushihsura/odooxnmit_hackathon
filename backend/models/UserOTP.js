const mongoose = require('mongoose');

const userOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  expires_at: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
  },
  is_used: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for performance
userOTPSchema.index({ email: 1 });
userOTPSchema.index({ expires_at: 1 });

module.exports = mongoose.model('UserOTP', userOTPSchema);
