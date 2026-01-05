const GuideRequest = require('../models/GuideRequest');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

// @desc    Send connection request to guide
// @route   POST /api/guide-requests
// @access  Private (Tourist only)
exports.createGuideRequest = async (req, res) => {
  try {
    const { 
      guideId, 
      destination, 
      tourDate, 
      duration, 
      numberOfPeople, 
      message,
      paymentMethod,
      paymentDetails,
      transactionId,
      paymentStatus,
      paidAt,
      couponCode
    } = req.body;

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
    let totalCost = guide.hourlyRate * duration;
    let originalAmount = totalCost;
    let discountAmount = 0;
    let appliedCoupon = null;
    let appliedCouponCode = null;

    // Handle coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      
      if (coupon) {
        // Check if user has already used this coupon
        const alreadyUsed = coupon.usedBy.some(
          usage => usage.user.toString() === req.user._id.toString()
        );
        
        if (alreadyUsed) {
          return res.status(400).json({
            success: false,
            message: 'You have already used this coupon. Each coupon can only be used once per user.'
          });
        }
        
        // Validate coupon
        const validityCheck = coupon.isValid();
        if (validityCheck.valid) {
          // Check service type - guide coupons
          if (coupon.serviceTypes.includes('all') || coupon.serviceTypes.includes('guide')) {
            // Calculate discount
            const discountResult = coupon.calculateDiscount(totalCost);
            
            if (discountResult.discount > 0) {
              discountAmount = discountResult.discount;
              totalCost = discountResult.finalAmount;
              appliedCoupon = coupon._id;
              appliedCouponCode = coupon.code;
              
              console.log('✅ Coupon applied to guide request:', {
                code: coupon.code,
                original: originalAmount,
                discount: discountAmount,
                final: totalCost
              });
            }
          } else {
            return res.status(400).json({
              success: false,
              message: 'This coupon is not applicable for guide bookings'
            });
          }
        } else {
          return res.status(400).json({
            success: false,
            message: validityCheck.message
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: 'Invalid coupon code'
        });
      }
    }

    const guideRequest = await GuideRequest.create({
      tourist: req.user._id,
      guide: guideId,
      destination,
      tourDate,
      duration,
      numberOfPeople,
      message,
      totalCost,
      originalAmount: discountAmount > 0 ? originalAmount : undefined,
      discountAmount,
      coupon: appliedCoupon,
      couponCode: appliedCouponCode,
      paymentMethod,
      paymentDetails,
      transactionId,
      paymentStatus: paymentStatus || 'paid',
      paidAt: paidAt || new Date()
    });

    // Increment coupon usage if coupon was applied
    if (appliedCoupon) {
      const coupon = await Coupon.findById(appliedCoupon);
      await coupon.incrementUsage(req.user._id, guideRequest._id);
    }

    const populatedRequest = await GuideRequest.findById(guideRequest._id)
      .populate('tourist', 'name email phone photo')
      .populate('guide', 'name email phone photo hourlyRate');

    res.status(201).json({
      success: true,
      message: appliedCouponCode 
        ? `Connection request sent successfully with ${appliedCouponCode} coupon applied!` 
        : 'Connection request sent successfully',
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
