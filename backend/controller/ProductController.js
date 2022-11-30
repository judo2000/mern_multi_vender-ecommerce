const Product = require('../models/ProductModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Features = require('../utils/Features');

// create Product
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// GET all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const feature = new Features(Product.find(), req.query).search().filter();
  const products = await feature.query;
  res.status(200).json({
    success: true,
    products,
  });
});

// Get product by Id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product was not found.', 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product --- Admin
exports.updateProduct = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product was not found.',
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useUnified: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// Delete product
exports.deleteProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product was not found.',
    });
  }

  await product.remove();

  res.status(200).json({
    success: true,
    pmessage: 'Product deleted sucessfully',
  });
});
