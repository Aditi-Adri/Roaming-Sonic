const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllBookings,
  updateBookingStatus,
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookingStats,
  generateTicketPDF
} = require('../controllers/bookingController');

// Admin routes
router.get('/stats', protect, restrictTo('admin'), getBookingStats);
router.get('/', protect, restrictTo('admin'), getAllBookings);
router.patch('/:id/status', protect, restrictTo('admin'), updateBookingStatus);

// User routes (tourist only)
router.get('/my-bookings', protect, getMyBookings);
router.post('/', protect, restrictTo('tourist'), createBooking);
router.patch('/:id/cancel', protect, restrictTo('tourist'), cancelBooking);
router.get('/:id/ticket', protect, generateTicketPDF);

module.exports = router;
