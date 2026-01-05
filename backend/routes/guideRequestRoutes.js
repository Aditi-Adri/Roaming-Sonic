const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  createGuideRequest,
  getGuideRequests,
  getTouristRequests,
  updateRequestStatus,
  cancelGuideRequest,
  addGuideReview
} = require('../controllers/guideRequestController');

// Tourist routes
router.post('/', protect, restrictTo('tourist'), createGuideRequest);
router.get('/tourist', protect, restrictTo('tourist'), getTouristRequests);
router.delete('/:id', protect, restrictTo('tourist'), cancelGuideRequest);
router.post('/:id/review', protect, restrictTo('tourist'), addGuideReview);

// Guide routes
router.get('/guide', protect, restrictTo('guide'), getGuideRequests);
router.patch('/:id', protect, restrictTo('guide'), updateRequestStatus);

module.exports = router;
