const User = require('../models/UserModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');

// Register User
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;

  const user = await User.create({
    first_name,
    last_name,
    email,
    password,
    avatar: {
      public_id: 'https://text.com',
      url: 'https://text.com',
    },
  });

  sendToken(user, 200, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Please enter the email & password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(
      new ErrorHandler('User is not find with this email & password', 401)
    );
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler('User is not find with this email & password', 401)
    );
  }

  sendToken(user, 201, res);
});

// logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    sucess: true,
    message: 'Logged out successfully',
  });
});

// forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorHandler(
        'User not found.  Please check your email and try again.'
      )
    );
  }

  // Get resetPassword Token
  const resetToken = user.getResetToken();

  await user.save({
    validateBeforeSave: false,
  });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    'host'
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is : - \n\n ${resetPasswordUrl} \n\n`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Ecommerce Site - Reset Password',
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    return next(new ErrorHandler('error.message'));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // create token hash
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTime: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler('Reset password token is invalid or has expired.', 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler(
        'Password and confirm password do not match. Please try again',
        400
      )
    );
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordTime = undefined;

  await user.save();

  sendToken(user, 200, res);
});
