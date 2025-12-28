const TourPackage = require('../models/TourPackage');
const Booking = require('../models/Booking');

// @desc    Get all tour packages
// @route   GET /api/tours
// @access  Public
exports.getAllTours = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, difficulty, featured } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (featured === 'true') query.featured = true;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const tours = await TourPackage.find(query)
      .populate('guide', 'name experience rating')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tours',
      error: error.message
    });
  }
};

// @desc    Get single tour
// @route   GET /api/tours/:id
// @access  Public
exports.getTourById = async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id)
      .populate('guide', 'name experience rating languages specializations')
      .populate('createdBy', 'name')
      .populate('reviews.user', 'name');

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tour',
      error: error.message
    });
  }
};

// @desc    Create tour package (Admin)
// @route   POST /api/tours
// @access  Private (Admin)
exports.createTour = async (req, res) => {
  try {
    const tourData = {
      ...req.body,
      createdBy: req.user._id
    };

    // Parse JSON fields if they come as strings
    if (typeof tourData.duration === 'string') {
      tourData.duration = JSON.parse(tourData.duration);
    }
    if (typeof tourData.includes === 'string') {
      tourData.includes = JSON.parse(tourData.includes);
    }
    if (typeof tourData.excludes === 'string') {
      tourData.excludes = JSON.parse(tourData.excludes);
    }

    // Handle uploaded images
    const images = [];
    
    // Add uploaded files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({
          url: `/uploads/tours/${file.filename}`,
          caption: tourData.title || 'Tour Image'
        });
      });
    }

    // Add URL-based images if provided
    if (tourData.imageUrls) {
      const imageUrls = typeof tourData.imageUrls === 'string' 
        ? JSON.parse(tourData.imageUrls) 
        : tourData.imageUrls;
      
      imageUrls.forEach(url => {
        if (url) {
          images.push({
            url: url,
            caption: tourData.title || 'Tour Image'
          });
        }
      });
    }

    tourData.images = images;
    delete tourData.imageUrls; // Remove temporary field

    const tour = await TourPackage.create(tourData);

    res.status(201).json({
      success: true,
      message: 'Tour package created successfully',
      data: tour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating tour',
      error: error.message
    });
  }
};

// @desc    Update tour package (Admin)
// @route   PUT /api/tours/:id
// @access  Private (Admin)
exports.updateTour = async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    // Parse JSON fields if they come as strings
    const updateData = { ...req.body };
    if (typeof updateData.duration === 'string') {
      updateData.duration = JSON.parse(updateData.duration);
    }
    if (typeof updateData.includes === 'string') {
      updateData.includes = JSON.parse(updateData.includes);
    }
    if (typeof updateData.excludes === 'string') {
      updateData.excludes = JSON.parse(updateData.excludes);
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = [];
      req.files.forEach(file => {
        newImages.push({
          url: `/uploads/tours/${file.filename}`,
          caption: updateData.title || tour.title || 'Tour Image'
        });
      });
      
      // Add new images to existing ones
      updateData.images = [...(tour.images || []), ...newImages];
    }

    // Handle URL-based images if provided
    if (updateData.imageUrls) {
      const imageUrls = typeof updateData.imageUrls === 'string' 
        ? JSON.parse(updateData.imageUrls) 
        : updateData.imageUrls;
      
      const urlImages = imageUrls.map(url => ({
        url: url,
        caption: updateData.title || tour.title || 'Tour Image'
      }));
      
      updateData.images = [...(updateData.images || tour.images || []), ...urlImages];
      delete updateData.imageUrls;
    }

    Object.keys(updateData).forEach(key => {
      tour[key] = updateData[key];
    });

    await tour.save();

    res.status(200).json({
      success: true,
      message: 'Tour updated successfully',
      data: tour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating tour',
      error: error.message
    });
  }
};

// @desc    Delete tour package (Admin)
// @route   DELETE /api/tours/:id
// @access  Private (Admin)
exports.deleteTour = async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    await tour.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting tour',
      error: error.message
    });
  }
};

// @desc    Add tour review
// @route   POST /api/tours/:id/review
// @access  Private
exports.addTourReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const tour = await TourPackage.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    // Check if user has completed the tour
    const completedBooking = await Booking.findOne({
      user: req.user._id,
      tour: req.params.id,
      bookingType: 'tour',
      status: 'completed'
    });

    if (!completedBooking) {
      return res.status(400).json({
        success: false,
        message: 'You can only review tours you have completed'
      });
    }

    // Check if already reviewed
    const alreadyReviewed = tour.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this tour'
      });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment
    };

    tour.reviews.push(review);
    tour.calculateAverageRating();

    // Update booking with review
    completedBooking.userReview = {
      rating: Number(rating),
      comment,
      date: new Date()
    };
    await completedBooking.save();

    await tour.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: tour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

// @desc    Mark tour as ended (Admin)
// @route   PATCH /api/tours/:id/end
// @access  Private (Admin)
exports.endTour = async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    tour.isEnded = true;
    tour.isActive = false;
    tour.currentMembers = 0; // Reset member count after tour completion
    await tour.save();

    // Update all confirmed bookings to completed
    await Booking.updateMany(
      { tour: req.params.id, status: 'confirmed', bookingType: 'tour' },
      { status: 'completed' }
    );

    res.status(200).json({
      success: true,
      message: 'Tour marked as ended successfully. Member count reset.',
      data: tour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error ending tour',
      error: error.message
    });
  }
};
