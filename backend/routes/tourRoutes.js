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
  endTour
} = require('../controllers/tourController');

// Public routes
router.get('/', getAllTours);
router.get('/:id', getTourById);

// Protected routes
router.post('/:id/review', protect, addTourReview);

// Admin routes
router.post('/', protect, restrictTo('admin'), upload.array('tourImages', 5), createTour);
router.put('/:id', protect, restrictTo('admin'), upload.array('tourImages', 5), updateTour);
router.delete('/:id', protect, restrictTo('admin'), deleteTour);
router.patch('/:id/end', protect, restrictTo('admin'), endTour);

module.exports = router;
