const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { protect, restrictTo } = require('../middleware/auth');

// Public routes
router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);

// Protected routes - Hotel Owner & Admin
router.post('/', 
  protect, 
  restrictTo('hotel_owner', 'admin'), 
  hotelController.createHotel
);

router.get('/my/hotels', 
  protect, 
  restrictTo('hotel_owner'), 
  hotelController.getMyHotels
);

router.put('/:id', 
  protect, 
  restrictTo('hotel_owner', 'admin'), 
  hotelController.updateHotel
);

router.delete('/:id', 
  protect, 
  restrictTo('hotel_owner', 'admin'), 
  hotelController.deleteHotel
);

// Tourist routes
router.post('/:id/reviews', 
  protect, 
  restrictTo('tourist'), 
  hotelController.addHotelReview
);

// Admin routes
router.put('/:id/verify', 
  protect, 
  restrictTo('admin'), 
  hotelController.toggleVerification
);

module.exports = router;
