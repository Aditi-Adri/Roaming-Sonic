const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  createHotelBooking,
  getMyHotelBookings,
  getOwnerHotelBookings,
  getHotelBookingById,
  requestCancellation,
  approveCancellation,
  confirmBooking,
  rejectBooking,
  completeBooking,
  checkAvailability
} = require('../controllers/hotelBookingController');

// Public routes
router.post('/check-availability', checkAvailability);

// Protected routes - Tourist
router.use(protect);
router.post('/', restrictTo('tourist', 'admin'), createHotelBooking);
router.get('/my-bookings', restrictTo('tourist', 'admin'), getMyHotelBookings);
router.post('/:id/cancel-request', restrictTo('tourist', 'admin'), requestCancellation);

// Protected routes - Hotel Owner
router.get('/owner-bookings', restrictTo('hotel_owner', 'admin'), getOwnerHotelBookings);
router.put('/:id/cancel-approve', restrictTo('hotel_owner', 'admin'), approveCancellation);
router.put('/:id/confirm', restrictTo('hotel_owner', 'admin'), confirmBooking);
router.put('/:id/reject', restrictTo('hotel_owner', 'admin'), rejectBooking);
router.put('/:id/complete', restrictTo('hotel_owner', 'admin'), completeBooking);

// Both tourist and owner can view booking details
router.get('/:id', getHotelBookingById);

module.exports = router;
