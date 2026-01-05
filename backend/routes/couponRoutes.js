const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  toggleCouponStatus
} = require('../controllers/couponController');

// Public route for validation
router.post('/validate', validateCoupon);

// Admin only routes
router.use(protect);
router.use(restrictTo('admin'));

router.route('/')
  .get(getAllCoupons)
  .post(createCoupon);

router.route('/:id')
  .get(getCouponById)
  .put(updateCoupon)
  .delete(deleteCoupon);

router.patch('/:id/toggle', toggleCouponStatus);

module.exports = router;
