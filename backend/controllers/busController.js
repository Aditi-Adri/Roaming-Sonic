const Bus = require('../models/Bus');

// @desc    Get all buses with filters
// @route   GET /api/buses
// @access  Public
exports.getAllBuses = async (req, res) => {
  try {
    const {
      from,
      to,
      busType,
      date,
      minFare,
      maxFare,
      minRating,
      amenities,
      sort
    } = req.query;

    // Build query
    let query = { status: 'active' };

    if (from) {
      query.from = { $regex: from, $options: 'i' };
    }

    if (to) {
      query.to = { $regex: to, $options: 'i' };
    }

    if (busType) {
      query.busType = busType;
    }

    if (minFare || maxFare) {
      query.fare = {};
      if (minFare) query.fare.$gte = Number(minFare);
      if (maxFare) query.fare.$lte = Number(maxFare);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    // Check day of week for schedule
    if (date) {
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      query.schedule = dayOfWeek;
    }

    // Sort
    let sortOption = {};
    if (sort === 'price_low') {
      sortOption.fare = 1;
    } else if (sort === 'price_high') {
      sortOption.fare = -1;
    } else if (sort === 'rating') {
      sortOption.rating = -1;
    } else {
      sortOption.departureTime = 1;
    }

    const buses = await Bus.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching buses',
      error: error.message
    });
  }
};

// @desc    Get single bus
// @route   GET /api/buses/:id
// @access  Public
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate('reviews.user', 'name');

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      data: bus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bus',
      error: error.message
    });
  }
};

// @desc    Add bus review
// @route   POST /api/buses/:id/review
// @access  Private (Tourist)
exports.addBusReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rating and comment'
      });
    }

    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    // Check if user has booked this bus
    const Booking = require('../models/Booking');
    const hasBooked = await Booking.findOne({
      user: req.user._id,
      bus: req.params.id,
      bookingType: 'bus',
      status: { $in: ['confirmed', 'completed'] }
    });

    if (!hasBooked) {
      return res.status(403).json({
        success: false,
        message: 'You can only review buses you have booked'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = bus.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this bus'
      });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment
    };

    bus.reviews.push(review);
    bus.calculateAverageRating();

    await bus.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: bus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

// @desc    Get popular routes
// @route   GET /api/buses/routes/popular
// @access  Public
exports.getPopularRoutes = async (req, res) => {
  try {
    const routes = await Bus.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: { from: '$from', to: '$to' },
          count: { $sum: 1 },
          minFare: { $min: '$fare' },
          avgRating: { $avg: '$rating' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular routes',
      error: error.message
    });
  }
};

// @desc    Create new bus
// @route   POST /api/buses
// @access  Private (Admin)
exports.createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      data: bus
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating bus',
      error: error.message
    });
  }
};

// @desc    Update bus
// @route   PUT /api/buses/:id
// @access  Private (Admin)
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus updated successfully',
      data: bus
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating bus',
      error: error.message
    });
  }
};

// @desc    Delete bus
// @route   DELETE /api/buses/:id
// @access  Private (Admin)
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting bus',
      error: error.message
    });
  }
};
