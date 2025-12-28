const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('bookings')
      .populate('wishlist')
      .populate('hotels');

    res.status(200).json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 'phone', 'photo', 'dateOfBirth', 'address',
      'languages', 'specializations', 'divisions', 'hourlyRate', 'availability',
      'experience', 'certifications', 'nidNumber', 'passportNumber',
      'businessName', 'businessLicense', 'preferredPaymentMethod', 
      'bkashNumber', 'nagadNumber'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// @desc    Upload profile photo
// @route   POST /api/users/upload-photo
// @access  Private
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const photoUrl = `/uploads/profiles/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { photo: photoUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        photo: user.photo,
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload photo',
      error: error.message
    });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

// @desc    Get all guides
// @route   GET /api/users/guides
// @access  Public
exports.getGuides = async (req, res) => {
  try {
    const { language, specialization, division, minRating, minRate, maxRate, availability } = req.query;

    console.log('=== Guide Search Request ===');
    console.log('Params:', { language, specialization, division, minRating, minRate, maxRate, availability });

    // Build query object
    const query = { 
      userType: 'guide', 
      isActive: true 
    };

    // Language filter - works independently
    if (language && language.trim() !== '') {
      query.languages = language;
      console.log('Filtering by language:', language);
    }

    // Specialization filter - works independently
    if (specialization && specialization.trim() !== '') {
      query.specializations = specialization;
      console.log('Filtering by specialization:', specialization);
    }

    // Division filter - works independently
    if (division && division.trim() !== '') {
      query.divisions = division;
      console.log('Filtering by division:', division);
    }

    // Rating filter - works independently
    if (minRating && minRating !== '') {
      query.rating = { $gte: parseFloat(minRating) };
      console.log('Filtering by minRating:', minRating);
    }

    // Hourly rate filters - work independently
    if (minRate && minRate !== '') {
      query.hourlyRate = { $gte: parseFloat(minRate) };
      console.log('Filtering by minRate:', minRate);
    }
    if (maxRate && maxRate !== '') {
      if (query.hourlyRate) {
        query.hourlyRate.$lte = parseFloat(maxRate);
      } else {
        query.hourlyRate = { $lte: parseFloat(maxRate) };
      }
      console.log('Filtering by maxRate:', maxRate);
    }

    // Availability filter - works independently
    if (availability === 'true') {
      query.availability = true;
      console.log('Filtering by availability: true');
    }

    console.log('Final MongoDB Query:', JSON.stringify(query, null, 2));

    // Execute query - all filters work together using AND logic
    const guides = await User.find(query)
      .select('-password')
      .populate('reviews.user', 'name')
      .sort('-rating -totalReviews');

    console.log(`Found ${guides.length} guides matching filters`);
    guides.forEach(guide => {
      console.log(`  - ${guide.name}: divisions = [${guide.divisions ? guide.divisions.join(', ') : 'none'}]`);
    });

    console.log(`Found ${guides.length} matching guides`);
    console.log('===========================\n');

    res.status(200).json({
      success: true,
      count: guides.length,
      data: {
        guides
      }
    });
  } catch (error) {
    console.error('Error in getGuides:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guides',
      error: error.message
    });
  }
};

// @desc    Get guide by ID
// @route   GET /api/users/guides/:id
// @access  Public
exports.getGuideById = async (req, res) => {
  try {
    const guide = await User.findOne({ 
      _id: req.params.id, 
      userType: 'guide',
      isActive: true 
    }).select('-password');

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        guide
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guide',
      error: error.message
    });
  }
};

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:hotelId
// @access  Private (Tourist only)
exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.wishlist.includes(req.params.hotelId)) {
      return res.status(400).json({
        success: false,
        message: 'Hotel already in wishlist'
      });
    }

    user.wishlist.push(req.params.hotelId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Added to wishlist',
      data: {
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist',
      error: error.message
    });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:hotelId
// @access  Private (Tourist only)
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== req.params.hotelId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Removed from wishlist',
      data: {
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: error.message
    });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/users/admin/all
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/admin/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// @desc    Update user role (Admin)
// @route   PATCH /api/users/admin/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['tourist', 'guide', 'hotel_owner', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent changing own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
};

// @desc    Get user statistics (Admin)
// @route   GET /api/users/admin/stats
// @access  Private (Admin)
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const tourists = await User.countDocuments({ role: 'tourist' });
    const guides = await User.countDocuments({ role: 'guide' });
    const hotelOwners = await User.countDocuments({ role: 'hotel_owner' });
    const admins = await User.countDocuments({ role: 'admin' });
    const pendingGuides = await User.countDocuments({ 
      role: 'guide', 
      approvalStatus: 'pending' 
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        tourists,
        guides,
        hotelOwners,
        admins,
        pendingGuides
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};
