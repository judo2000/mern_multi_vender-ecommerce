const User = require('../models/UserModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');

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
