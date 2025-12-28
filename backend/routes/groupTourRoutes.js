const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllGroupTours,
  getGroupTourById,
  createGroupTour,
  updateGroupTour,
  requestToJoin,
  updateMemberStatus,
  cancelGroupTour,
  completeGroupTour,
  leaveGroupTour,
  getMyGroupTours,
  getJoinedGroupTours,
  getPendingGroupTours,
  adminApproval
} = require('../controllers/groupTourController');

// Public routes
router.get('/', getAllGroupTours);

// User routes (tourist only) - Must come before /:id route
router.post('/', protect, restrictTo('tourist'), createGroupTour);
router.get('/my/tours', protect, restrictTo('tourist'), getMyGroupTours);
router.get('/my/joined', protect, restrictTo('tourist'), getJoinedGroupTours);

// Admin routes - Must come before /:id route
router.get('/admin/pending', protect, restrictTo('admin'), getPendingGroupTours);

// Public route with ID parameter - Must come after specific routes
router.get('/:id', getGroupTourById);

// User interaction routes (tourist only)
router.post('/:id/join', protect, restrictTo('tourist'), requestToJoin);

// Host routes (tourist only)
router.put('/:id', protect, restrictTo('tourist'), updateGroupTour);
router.patch('/:id/members/:memberId', protect, restrictTo('tourist'), updateMemberStatus);
router.patch('/:id/cancel', protect, restrictTo('tourist'), cancelGroupTour);
router.patch('/:id/complete', protect, restrictTo('tourist'), completeGroupTour);
router.patch('/:id/leave', protect, restrictTo('tourist'), leaveGroupTour);

// Admin approval routes
router.patch('/:id/admin-approval', protect, restrictTo('admin'), adminApproval);

module.exports = router;
