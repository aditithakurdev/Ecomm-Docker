const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticate");
const userController = require("../controllers/user/userController");
const { validateRegister,validateLogin,validateForgotPassword, validateVerifyOTP,validateGetProfile,validateResetPasswordWithOtp } = require("../validation/user.validation");
router.post('/register', validateRegister, userController.createUser);

router.post('/login', validateLogin, userController.loginUser);
router.get('/profile/:id', validateGetProfile, authenticateToken, userController.getProfile);

router.post('/refresh-token',  userController.refreshToken);
router.post('/forgot-password', validateForgotPassword, userController.forgotPassword);
router.post('/verify-otp',validateVerifyOTP, userController.verifyOTP);
router.post('/reset-password', validateResetPasswordWithOtp, userController.resetPasswordWithOtp);

module.exports = router;