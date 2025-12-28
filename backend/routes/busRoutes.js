const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllBuses,
  getBusById,
  addBusReview,
  getPopularRoutes,
  createBus,
  updateBus,
  deleteBus
} = require('../controllers/busController');

// Public routes
router.get('/', getAllBuses);
router.get('/routes/popular', getPopularRoutes);
router.get('/:id', getBusById);

// Protected routes - Tourist
router.post('/:id/review', protect, restrictTo('tourist'), addBusReview);

// Protected routes - Admin
router.post('/', protect, restrictTo('admin'), createBus);
router.put('/:id', protect, restrictTo('admin'), updateBus);
router.delete('/:id', protect, restrictTo('admin'), deleteBus);

module.exports = router;
