const express = require('express');
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} = require('../controller/ProductController');
const router = express.Router();

router.route('/products').get(getAllProducts);
router.route('/product/new').post(createProduct);
router
  .route('/product/:id')
  .get(getSingleProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
