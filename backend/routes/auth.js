const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { sendPasswordResetOTP, verifyPasswordResetOTP, resetPassword } = require('../controllers/passwordResetController');
const { validateRegister, validateLogin, validateForgotPassword, validateVerifyOTP, validateResetPassword } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validateRegister, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, getMe);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset OTP
// @access  Public
router.post('/forgot-password', validateForgotPassword, sendPasswordResetOTP);

// @route   POST /api/auth/verify-reset-otp
// @desc    Verify password reset OTP
// @access  Public
router.post('/verify-reset-otp', validateVerifyOTP, verifyPasswordResetOTP);

// @route   POST /api/auth/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post('/reset-password', validateResetPassword, resetPassword);

module.exports = router;


