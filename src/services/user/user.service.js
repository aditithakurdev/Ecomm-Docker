const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user/userModel')
const sendEmail = require('../../email/sendEmail');

//create new user
const createUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
  
    throw new Error('Email already registered');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
    // Capitalize first letter
    const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  const userName = capitalize(name); // 'Test'

  const newUser = await User.create({
    name: userName,
    email,
    password: hashedPassword,
  });
    console.log('User created:', newUser);
 // ✅ Send Welcome Email
 await sendEmail(email, 'Welcome!', 'registrationEmail.ejs', { name: userName });

  return newUser;

};

//Login user
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
    attributes: ['id', 'name', 'email', 'password'],
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TOKEN }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' || process.env.JWT_REFRESH_TOKEN }
  );
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
    refreshToken,
  };
};

//Get User profile
const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

//Generate Token
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Refresh access token
const refreshAccessToken = async (refreshToken) => {
  console.log('Incoming refreshToken:', refreshToken);

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    const tokens = generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    throw new Error('Invalid or expired refresh token');
  }
};

//Generate OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

//Forget Password
const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const otp = generateOTP();

  // Save OTP to user
  user.otp = otp;
  await user.save();

  // Send OTP to email using nodemailer
  await sendEmail(email, 'Forget Password', 'forgetPassword.ejs', { name: user.name, otp });
  return { message: 'OTP sent to your email' };
};

//Verify  OTP
const verifyOTP = async (otp) => {
  const user = await User.findOne({ where: { otp: otp } });

  if (!user) {
    throw new Error('Invalid OTP');
  }

  // OTP verified — now clear it
  user.otp = null;
  await user.save();

  return {
    message: 'OTP verified successfully',
    email: user.email,
    userId: user.id
  };
};

//Refresh Password with OTP
const resetPasswordWithOtp = async ({ otp, newPassword, confirmPassword }) => {
  // Ensure OTP is a string (to match DB)
  const otpString = otp.toString().trim();

  const user = await User.findOne({ where: { otp: otpString } });

  if (!user) {
    throw new Error('Invalid or expired OTP');
  }

  if (newPassword !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  // Hash and update password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  // Clear the OTP
  user.otp = null;

  await user.save();

  return { message: 'Password updated successfully' };
};

//Verify Reset Token
const verifyResetToken = async (token) => {
  const user = await User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        [Op.gt]: new Date(), // Token not expired
      },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  return { message: 'Valid token', email: user.email };
};

module.exports = {
  createUser,
  loginUser,
  getUserProfile,
  generateTokens,
  refreshAccessToken,
  forgotPassword,
  verifyOTP,
  resetPasswordWithOtp,
  verifyResetToken,
};
