const express = require('express');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  createProductReview,
  getSingleProductReviews,
} = require('../controller/ProductController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

router.route('/products').get(getAllProducts);
router
  .route('/product/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);
router
  .route('/product/:id')
  .get(getSingleProduct)
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router.route('/product/review').post(isAuthenticatedUser, createProductReview);
router.route('/reviews').get(getSingleProductReviews);

module.exports = router;
