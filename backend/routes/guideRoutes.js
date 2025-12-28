const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllGuides,
  getGuideById,
  getPendingGuides,
  updateGuideApproval
} = require('../controllers/guideController');

// Public routes
router.get('/', getAllGuides);
router.get('/:id', getGuideById);

// Admin routes
router.get('/admin/pending', protect, restrictTo('admin'), getPendingGuides);
router.patch('/:id/approval', protect, restrictTo('admin'), updateGuideApproval);

module.exports = router;
