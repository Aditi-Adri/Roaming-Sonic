const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaint,
  deleteComplaint,
  getComplaintStats
} = require('../controllers/complaintController');

// Tourist routes
router.post('/', protect, restrictTo('tourist'), createComplaint);
router.get('/my-complaints', protect, restrictTo('tourist'), getMyComplaints);

// Admin routes
router.get('/stats', protect, restrictTo('admin'), getComplaintStats);
router.get('/', protect, restrictTo('admin'), getAllComplaints);
router.patch('/:id', protect, restrictTo('admin'), updateComplaint);
router.delete('/:id', protect, restrictTo('admin'), deleteComplaint);

module.exports = router;
