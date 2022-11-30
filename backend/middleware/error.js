const errorHandler = require('../utils/ErrorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal server error';
  // Wrong mongodb id error
  if (err.name === 'CastError') {
    const message = `Resource not found with this id..Invalid ${err.path}`;
    err = new errorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new errorHandler(message, 400);
  }

  // Wrong Jwt error
  if (err.name === 'JsonWebTokenError') {
    const message = `Your url is invalid. Please try again.`;
    err = new errorHandler(message, 400);
  }

  //Jwt expired error
  if (err.name === 'TokenExpiredError') {
    const message = `Your reset token is expired. Please try again.`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.stack,
  });
};
