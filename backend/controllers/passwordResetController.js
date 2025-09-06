const otpService = require('../services/otpService');
const { formatResponse } = require('../utils/helpers');
const { ERROR_MESSAGES } = require('../utils/constants');

// @desc    Send password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(
        formatResponse(false, 'Email is required')
      );
    }

    const result = await otpService.sendPasswordResetOTP(email);

    if (result.success) {
      res.status(200).json(
        formatResponse(true, result.message)
      );
    } else {
      res.status(400).json(
        formatResponse(false, result.message)
      );
    }
  } catch (error) {
    console.error('Send password reset OTP error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Verify password reset OTP
// @route   POST /api/auth/verify-reset-otp
// @access  Public
const verifyPasswordResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json(
        formatResponse(false, 'Email and OTP are required')
      );
    }

    const result = await otpService.verifyPasswordResetOTP(email, otp);

    if (result.success) {
      res.status(200).json(
        formatResponse(true, result.message)
      );
    } else {
      res.status(400).json(
        formatResponse(false, result.message)
      );
    }
  } catch (error) {
    console.error('Verify password reset OTP error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json(
        formatResponse(false, 'Email, OTP, and new password are required')
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json(
        formatResponse(false, 'Password must be at least 6 characters long')
      );
    }

    const result = await otpService.resetPassword(email, otp, newPassword);

    if (result.success) {
      res.status(200).json(
        formatResponse(true, result.message)
      );
    } else {
      res.status(400).json(
        formatResponse(false, result.message)
      );
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json(
      formatResponse(false, ERROR_MESSAGES.SERVER_ERROR)
    );
  }
};

module.exports = {
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
  resetPassword
};

