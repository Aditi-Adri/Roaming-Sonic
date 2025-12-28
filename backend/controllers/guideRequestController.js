const GuideRequest = require('../models/GuideRequest');
const User = require('../models/User');

// @desc    Send connection request to guide
// @route   POST /api/guide-requests
// @access  Private (Tourist only)
exports.createGuideRequest = async (req, res) => {
  try {
    const { guideId, destination, tourDate, duration, numberOfPeople, message } = req.body;

    // Verify guide exists and is approved
    const guide = await User.findOne({
      _id: guideId,
      userType: 'guide',
      isApproved: true,
      approvalStatus: 'approved'
    });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found or not approved'
      });
    }

    // Calculate total cost
    const totalCost = guide.hourlyRate * duration;

    const guideRequest = await GuideRequest.create({
      tourist: req.user._id,
      guide: guideId,
      destination,
      tourDate,
      duration,
      numberOfPeople,
      message,
      totalCost
    });

    const populatedRequest = await GuideRequest.findById(guideRequest._id)
      .populate('tourist', 'name email phone photo')
      .populate('guide', 'name email phone photo hourlyRate');

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: populatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating guide request',
      error: error.message
    });
  }
};

// @desc    Get all requests for a guide
// @route   GET /api/guide-requests/guide
// @access  Private (Guide only)
exports.getGuideRequests = async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = { guide: req.user._id };
    if (status) {
      query.status = status;
    }

    const requests = await GuideRequest.find(query)
      .populate('tourist', 'name email phone photo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching guide requests',
      error: error.message
    });
  }
};

// @desc    Get all requests made by a tourist
// @route   GET /api/guide-requests/tourist
// @access  Private (Tourist only)
exports.getTouristRequests = async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = { tourist: req.user._id };
    if (status) {
      query.status = status;
    }

    const requests = await GuideRequest.find(query)
      .populate('guide', 'name email phone photo hourlyRate rating totalReviews')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tourist requests',
      error: error.message
    });
  }
};

// @desc    Update request status (approve/reject)
// @route   PATCH /api/guide-requests/:id
// @access  Private (Guide only)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status, responseMessage } = req.body;

    if (!['approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const request = await GuideRequest.findOne({
      _id: req.params.id,
      guide: req.user._id
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found or unauthorized'
      });
    }

    request.status = status;
    request.responseMessage = responseMessage;
    request.respondedAt = Date.now();
    
    await request.save();

    const updatedRequest = await GuideRequest.findById(request._id)
      .populate('tourist', 'name email phone photo')
      .populate('guide', 'name email phone photo');

    res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      data: updatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating request status',
      error: error.message
    });
  }
};

// @desc    Cancel guide request by tourist
// @route   DELETE /api/guide-requests/:id
// @access  Private (Tourist only)
exports.cancelGuideRequest = async (req, res) => {
  try {
    const request = await GuideRequest.findOne({
      _id: req.params.id,
      tourist: req.user._id
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found or unauthorized'
      });
    }

    // Only allow cancellation of pending or approved requests
    if (!['pending', 'approved'].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${request.status} request`
      });
    }

    request.status = 'cancelled';
    request.responseMessage = 'Cancelled by tourist';
    request.respondedAt = Date.now();
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request cancelled successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling request',
      error: error.message
    });
  }
};

// @desc    Add review to guide after completed tour
// @route   POST /api/guide-requests/:id/review
// @access  Private (Tourist only)
exports.addGuideReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const request = await GuideRequest.findOne({
      _id: req.params.id,
      tourist: req.user._id,
      status: 'completed'
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Completed tour not found'
      });
    }

    // Check if already reviewed
    const guide = await User.findById(request.guide);
    const existingReview = guide.reviews.find(
      r => r.user && r.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this guide'
      });
    }

    // Add review to guide
    guide.reviews.push({
      user: req.user._id,
      rating,
      comment,
      date: Date.now()
    });

    // Update rating and total reviews
    const totalRating = guide.reviews.reduce((sum, review) => sum + review.rating, 0);
    guide.rating = totalRating / guide.reviews.length;
    guide.totalReviews = guide.reviews.length;

    await guide.save();

    res.status(200).json({
      success: true,
      message: 'Review added successfully',
      data: {
        rating: guide.rating,
        totalReviews: guide.totalReviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};
