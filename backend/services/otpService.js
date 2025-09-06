const db = require('../config/database');
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
      const userResult = await db.query(
        'SELECT id, email FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
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
      const result = await db.query(
        `SELECT * FROM user_otps 
         WHERE email = $1 
         AND otp = $2 
         AND expires_at > NOW() 
         AND is_used = FALSE`,
        [email, otp]
      );

      if (result.rows.length === 0) {
        return { success: false, message: 'Invalid or expired OTP' };
      }

      // Mark OTP as used
      await db.query(
        'UPDATE user_otps SET is_used = TRUE WHERE email = $1 AND otp = $2',
        [email, otp]
      );

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
      const result = await db.query(
        'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING id',
        [hashedPassword, email]
      );

      if (result.rows.length === 0) {
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
      await db.query(
        'UPDATE user_otps SET is_used = TRUE WHERE email = $1',
        [email]
      );

      // Insert new OTP
      const result = await db.query(
        `INSERT INTO user_otps (email, otp, expires_at) 
         VALUES ($1, $2, NOW() + INTERVAL '10 minutes') 
         RETURNING *`,
        [email, otp]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating OTP:', error);
      throw error;
    }
  },

  // Clean expired OTPs (cleanup function)
  async cleanExpiredOTPs() {
    try {
      const result = await db.query(
        'DELETE FROM user_otps WHERE expires_at < NOW()'
      );
      
      console.log(`Cleaned up ${result.rowCount} expired OTPs`);
      return result.rowCount;
    } catch (error) {
      console.error('Error cleaning expired OTPs:', error);
      throw error;
    }
  },

  // Check if user can request new OTP (rate limiting)
  async canRequestOTP(email) {
    try {
      const result = await db.query(
        `SELECT COUNT(*) as count FROM user_otps 
         WHERE email = $1 
         AND created_at > NOW() - INTERVAL '1 minute'`,
        [email]
      );

      const count = parseInt(result.rows[0].count);
      return count < 3; // Allow max 3 OTP requests per minute
    } catch (error) {
      console.error('Error checking OTP rate limit:', error);
      return false;
    }
  }
};

module.exports = otpService;
