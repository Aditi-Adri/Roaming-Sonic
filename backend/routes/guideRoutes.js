const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllGuides,
  getGuideById,
  getPendingGuides,
  updateGuideApproval,
  reapplyForApproval
} = require('../controllers/guideController');

// Public routes
router.get('/', getAllGuides);
router.get('/:id', getGuideById);

// Admin routes
router.get('/admin/pending', protect, restrictTo('admin'), getPendingGuides);
router.patch('/:id/approval', protect, restrictTo('admin'), updateGuideApproval);

// Guide routes
router.post('/reapply', protect, restrictTo('guide'), reapplyForApproval);

module.exports = router;
