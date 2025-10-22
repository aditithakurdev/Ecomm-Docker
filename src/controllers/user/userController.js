const { createUser, loginUser, getUserProfile,refreshAccessToken, forgotPassword, resetPasswordWithOtp,verifyResetToken,verifyOTP,validateResetPasswordWithOtp } = require('../../services/user/user.service');
const { validationResult } = require('express-validator');

//create user
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { name, email, password } = req.body;
    const user = await createUser({ name, email, password });

    return res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (err) {
    console.error('Controller error:', err.message);
    const statusCode = err.message === 'Email already registered' ? 409 : 500;
    return res.status(statusCode).json({ message: err.message });
  }
};

//login user
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await loginUser({ email, password });

    return res.status(200).json({
      message: 'Login successful',
      user,
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Error in login:', error);
    const statusCode = error.message === 'Invalid email or password' ? 401 : 500;
    return res.status(statusCode).json({ message: error.message });
  }
};

//Get specific user 
exports.getProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const userId = req.params.id;
    const user = await getUserProfile(userId);

    return res.status(200).json({
      message: 'Profile fetched successfully',
      user,
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    const statusCode = err.message === 'User not found' ? 404 : 500;
    return res.status(statusCode).json({ message: err.message });
  }
};

//Refresh Token
exports.refreshToken = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const { refreshToken } = req.body;
    const result = await refreshAccessToken(refreshToken);

    return res.status(200).json({
      message: 'Access token refreshed',
      ...result,
    });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    return res.status(401).json({ message: error.message });
  }
};

// Forget Password
exports.forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    const { email } = req.body;
    const result = await forgotPassword(email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Verify OTP
exports.verifyOTP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { otp } = req.body;

  try {
    const result = await verifyOTP(otp);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in verify OTP:', error.message);
    return res.status(400).json({ message: error.message });
  }
};

//ResetPassword With OTP
exports.resetPasswordWithOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const {  otp, newPassword,confirmPassword } = req.body;

  try {
    const result = await resetPasswordWithOtp({
      otp,
      newPassword,
      confirmPassword
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in reset password:', error.message);
    return res.status(400).json({ message: error.message });
  }
};

//Verfy Reser Token
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;
    const result = await verifyResetToken(token);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};