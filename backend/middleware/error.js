const errorHandler = require('../utils/ErrorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal server error';
  // Wrong mongodb id error
  if (err.name === 'CastError') {
    const message = `Resource not found with this id..Invalid ${err.path}`;
    err = new errorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
