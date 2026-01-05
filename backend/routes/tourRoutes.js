const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  addTourReview,
  endTour,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/tourController');

// Public routes
router.get('/', getAllTours);

// Protected routes - wishlist must come before /:id
router.get('/wishlist/my-wishlist', protect, getWishlist);
router.post('/:id/wishlist', protect, addToWishlist);
router.delete('/:id/wishlist', protect, removeFromWishlist);
router.post('/:id/review', protect, addTourReview);

// This must come after specific routes
router.get('/:id', getTourById);

// Admin routes
router.post('/', protect, restrictTo('admin'), upload.array('tourImages', 5), createTour);
router.put('/:id', protect, restrictTo('admin'), upload.array('tourImages', 5), updateTour);
router.delete('/:id', protect, restrictTo('admin'), deleteTour);
router.patch('/:id/end', protect, restrictTo('admin'), endTour);

module.exports = router;
