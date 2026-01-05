const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', hotelController.getAllHotels);

// Protected routes - Hotel Owner & Admin
router.get('/my/hotels', 
  protect, 
  restrictTo('hotel_owner'), 
  hotelController.getMyHotels
);

router.post('/', 
  protect, 
  restrictTo('hotel_owner', 'admin'),
  upload.array('hotelPhotos', 5),
  hotelController.createHotel
);

// Public route - must come after /my/hotels
router.get('/:id', hotelController.getHotelById);

router.put('/:id', 
  protect, 
  restrictTo('hotel_owner', 'admin'),
  upload.array('hotelPhotos', 5),
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
  hotelController.addReview
);

// Admin routes
router.get('/admin/all', 
  protect, 
  restrictTo('admin'), 
  hotelController.getAllHotelsAdmin
);

router.put('/:id/verify', 
  protect, 
  restrictTo('admin'), 
  hotelController.toggleVerification
);

module.exports = router;
