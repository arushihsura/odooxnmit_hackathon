const { User, UserOTP } = require('../models');
const { formatResponse } = require('../utils/helpers');
const { ERROR_MESSAGES } = require('../utils/constants');

const otpService = {
  // Generate 6-digit OTP for password reset
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Send password reset OTP
  async sendPasswordResetOTP(email) {
    try {
      // Check if user exists
      const user = await User.findOne({ email }).select('_id email');

      if (!user) {
        return { success: false, message: 'User not found with this email' };
      }

      // Check rate limiting
      const canRequest = await this.canRequestOTP(email);
      if (!canRequest) {
        return { success: false, message: 'Too many OTP requests. Please wait before requesting again.' };
      }

      // Generate OTP
      const otp = this.generateOTP();

      // Create OTP record
      await this.createOrUpdate(email, otp);

      // In a real application, you would send email here
      // For now, we'll just log it (you can implement email service later)
      console.log(`Password reset OTP for ${email}: ${otp}`);
      
      return { 
        success: true, 
        message: 'Password reset OTP sent to your email',
        otp: otp // Remove this in production - only for testing
      };
    } catch (error) {
      console.error('Error sending password reset OTP:', error);
      throw error;
    }
  },

  // Verify password reset OTP
  async verifyPasswordResetOTP(email, otp) {
    try {
      const otpRecord = await UserOTP.findOne({
        email,
        otp,
        expires_at: { $gt: new Date() },
        is_used: false
      });

      if (!otpRecord) {
        return { success: false, message: 'Invalid or expired OTP' };
      }

      // Mark OTP as used
      await UserOTP.findByIdAndUpdate(otpRecord._id, { is_used: true });

      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  },

  // Reset password with OTP
  async resetPassword(email, otp, newPassword) {
    try {
      // First verify OTP
      const otpVerification = await this.verifyPasswordResetOTP(email, otp);
      if (!otpVerification.success) {
        return otpVerification;
      }

      // Hash new password
      const bcrypt = require('bcryptjs');
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      const user = await User.findOneAndUpdate(
        { email },
        { password_hash: hashedPassword },
        { new: true }
      );

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  // Create or update OTP
  async createOrUpdate(email, otp) {
    try {
      // First, mark any existing OTPs as used
      await UserOTP.updateMany({ email }, { is_used: true });

      // Insert new OTP
      const otpRecord = await UserOTP.create({
        email,
        otp,
        expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
      });

      return otpRecord;
    } catch (error) {
      console.error('Error creating OTP:', error);
      throw error;
    }
  },

  // Clean expired OTPs (cleanup function)
  async cleanExpiredOTPs() {
    try {
      const result = await UserOTP.deleteMany({
        expires_at: { $lt: new Date() }
      });
      
      console.log(`Cleaned up ${result.deletedCount} expired OTPs`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning expired OTPs:', error);
      throw error;
    }
  },

  // Check if user can request new OTP (rate limiting)
  async canRequestOTP(email) {
    try {
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      const count = await UserOTP.countDocuments({
        email,
        createdAt: { $gt: oneMinuteAgo }
      });

      return count < 3; // Allow max 3 OTP requests per minute
    } catch (error) {
      console.error('Error checking OTP rate limit:', error);
      return false;
    }
  }
};

module.exports = otpService;
