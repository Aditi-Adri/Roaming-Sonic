const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/guides', userController.getGuides);
router.get('/guides/:id', userController.getGuideById);

// Protected routes (all users)
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.put('/change-password', protect, userController.changePassword);

// Upload profile photo
router.post('/upload-photo', protect, upload.single('photo'), userController.uploadPhoto);

// Tourist only routes
router.post('/wishlist/:hotelId', protect, restrictTo('tourist'), userController.addToWishlist);
router.delete('/wishlist/:hotelId', protect, restrictTo('tourist'), userController.removeFromWishlist);

// Admin only routes
router.get('/admin/all', protect, restrictTo('admin'), userController.getAllUsers);
router.get('/admin/stats', protect, restrictTo('admin'), userController.getUserStats);
router.delete('/admin/:id', protect, restrictTo('admin'), userController.deleteUser);
router.patch('/admin/:id/role', protect, restrictTo('admin'), userController.updateUserRole);

module.exports = router;
