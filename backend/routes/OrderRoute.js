const express = require('express');
const {
  createOrder,
  getSingleOrder,
  getAllOrders,
  adminGetAllOrders,
  updateAdminOrder,
  deleteOrder,
} = require('../controller/OrderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

router.route('/order/new').post(isAuthenticatedUser, createOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, getAllOrders);
router
  .route('/admin/orders')
  .get(isAuthenticatedUser, authorizeRoles('admin'), adminGetAllOrders);

router
  .route('/admin/order/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateAdminOrder)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

module.exports = router;
