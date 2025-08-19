const { body, param } = require('express-validator');

// REGISTER
const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Min 8 characters'),
];

// LOGIN
const validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
// GET PROFILE (by param `id`)
const validateGetProfile = [
  param('id')
    .notEmpty().withMessage('User ID is required')
    .isHexadecimal().withMessage('User ID must be a valid hex string')
    .isLength({ min: 24, max: 24 }).withMessage('Invalid user ID format'),
];

// REFRESH TOKEN
const validateRefreshToken = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required'),
];

// GENERATE TOKENS (optional fields)
const validateGenerateTokens = [
  body('accessToken')
    .optional()
    .notEmpty().withMessage('Access token is optional'), // redundant, but mirrors Joi logic

  body('refreshToken')
    .optional()
    .notEmpty().withMessage('Refresh token is optional'),
];

//FORGOT PASSWORD
const validateForgotPassword = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
];

// VERIFY OTP
const validateVerifyOTP = [
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isNumeric().withMessage('OTP must be a numeric value')
    .isLength({ min: 4, max: 4 }).withMessage('OTP must be exactly 4 digits'),
];

// RESET PASSWORD
const validateResetPasswordWithOtp = [
  body('otp')
    .notEmpty().withMessage('OTP is required')
    .isNumeric().withMessage('OTP must be a numeric value')
    .isLength({ min: 4, max: 4 }).withMessage('OTP must be exactly 4 digits'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),

  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Confirm password does not match');
      }
      return true;
    }),
];
const validateUserIdParam = [
  param('id')
    .notEmpty().withMessage('User ID is required')
    .isHexadecimal().withMessage('User ID must be a valid hex string')
    .isLength({ min: 24, max: 24 }).withMessage('Invalid user ID format'),
];

module.exports = {
  validateLogin,
  validateRegister,
  validateGetProfile,
  validateRefreshToken,
  validateGenerateTokens,
  validateUserIdParam,
  validateVerifyOTP,
  validateForgotPassword,
  validateResetPasswordWithOtp,
};

