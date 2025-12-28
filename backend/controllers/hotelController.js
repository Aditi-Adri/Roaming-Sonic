const Hotel = require('../models/Hotel');
const User = require('../models/User');

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private (Hotel Owner, Admin)
exports.createHotel = async (req, res) => {
  try {
    const hotelData = {
      ...req.body,
      owner: req.user._id
    };

    const hotel = await Hotel.create(hotelData);

    // Add hotel to owner's hotels array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { hotels: hotel._id }
    });

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create hotel',
      error: error.message
    });
  }
};

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
exports.getAllHotels = async (req, res) => {
  try {
    const { city, district, division, category, minPrice, maxPrice, amenities } = req.query;
    
    let query = { 
      isActive: true,
      isVerified: true,
      verificationStatus: 'approved'
    };

    // Filters
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (district) query['address.district'] = new RegExp(district, 'i');
    if (division) query['address.division'] = division;
    if (category) query.category = category;

    const hotels = await Hotel.find(query)
      .populate('owner', 'name email phone')
      .select('-reviews')
      .sort('-rating -createdAt');

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hotels',
      error: error.message
    });
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('owner', 'name email phone businessName')
      .populate('reviews.user', 'name photo');

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hotel',
      error: error.message
    });
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private (Hotel Owner - own hotel, Admin)
exports.updateHotel = async (req, res) => {
  try {
    let hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check ownership
    if (hotel.owner.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this hotel'
      });
    }

    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Hotel updated successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hotel',
      error: error.message
    });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private (Hotel Owner - own hotel, Admin)
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check ownership
    if (hotel.owner.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this hotel'
      });
    }

    await Hotel.findByIdAndDelete(req.params.id);

    // Remove from owner's hotels array
    await User.findByIdAndUpdate(hotel.owner, {
      $pull: { hotels: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hotel',
      error: error.message
    });
  }
};

// @desc    Get hotels by owner
// @route   GET /api/hotels/my-hotels
// @access  Private (Hotel Owner)
exports.getMyHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ owner: req.user._id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    console.error('Get my hotels error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your hotels',
      error: error.message
    });
  }
};

// @desc    Add review to hotel
// @route   POST /api/hotels/:id/reviews
// @access  Private (Tourist)
exports.addHotelReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check if already reviewed
    const alreadyReviewed = hotel.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this hotel'
      });
    }

    const review = {
      user: req.user._id,
      rating,
      comment
    };

    hotel.reviews.push(review);
    hotel.calculateAverageRating();

    await hotel.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: hotel
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

// @desc    Toggle hotel verification status
// @route   PUT /api/hotels/:id/verify
// @access  Private (Admin)
exports.toggleVerification = async (req, res) => {
  try {
    const { verificationStatus } = req.body;

    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { 
        verificationStatus,
        isVerified: verificationStatus === 'approved'
      },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Hotel ${verificationStatus}`,
      data: hotel
    });
  } catch (error) {
    console.error('Verify hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update verification status',
      error: error.message
    });
  }
};
