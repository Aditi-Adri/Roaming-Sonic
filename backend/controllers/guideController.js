const User = require('../models/User');

// @desc    Get all approved guides with filters
// @route   GET /api/guides
// @access  Public
exports.getAllGuides = async (req, res) => {
  try {
    const {
      language,
      specialization,
      division,
      minRate,
      maxRate,
      minRating,
      availability,
      sort
    } = req.query;

    // Build query - only approved guides
    let query = { 
      userType: 'guide',
      isApproved: true,
      approvalStatus: 'approved'
    };

    if (language) {
      query.languages = { $in: [language] };
    }

    if (specialization) {
      query.specializations = { $in: [specialization] };
    }

    if (division) {
      query.divisions = { $in: [division] };
    }

    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (availability === 'true') {
      query.availability = true;
    }

    // Sort
    let sortOption = {};
    if (sort === 'rate_low') {
      sortOption.hourlyRate = 1;
    } else if (sort === 'rate_high') {
      sortOption.hourlyRate = -1;
    } else if (sort === 'rating') {
      sortOption.rating = -1;
    } else if (sort === 'experience') {
      sortOption.experience = -1;
    } else {
      sortOption.createdAt = -1;
    }

    const guides = await User.find(query)
      .select('-password')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: guides.length,
      data: guides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching guides',
      error: error.message
    });
  }
};

// @desc    Get single guide
// @route   GET /api/guides/:id
// @access  Public
exports.getGuideById = async (req, res) => {
  try {
    const guide = await User.findOne({
      _id: req.params.id,
      userType: 'guide',
      isApproved: true
    }).select('-password');

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found or not approved'
      });
    }

    res.status(200).json({
      success: true,
      data: guide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching guide',
      error: error.message
    });
  }
};

// @desc    Get pending guides for admin approval
// @route   GET /api/guides/pending
// @access  Private (Admin)
exports.getPendingGuides = async (req, res) => {
  try {
    const guides = await User.find({
      userType: 'guide',
      approvalStatus: 'pending'
    }).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: guides.length,
      data: guides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending guides',
      error: error.message
    });
  }
};

// @desc    Approve/Reject guide
// @route   PATCH /api/guides/:id/approval
// @access  Private (Admin)
exports.updateGuideApproval = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid approval status'
      });
    }

    const guide = await User.findOne({
      _id: req.params.id,
      userType: 'guide'
    });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    guide.approvalStatus = status;
    guide.isApproved = status === 'approved';
    await guide.save();

    res.status(200).json({
      success: true,
      message: `Guide ${status} successfully`,
      data: guide.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating guide approval',
      error: error.message
    });
  }
};

// @desc    Reapply for guide approval (for rejected guides)
// @route   POST /api/guides/reapply
// @access  Private (Guide only)
exports.reapplyForApproval = async (req, res) => {
  try {
    const guide = await User.findOne({
      _id: req.user._id,
      userType: 'guide'
    });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide profile not found'
      });
    }

    if (guide.approvalStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Your guide profile is already approved'
      });
    }

    if (guide.approvalStatus === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Your application is already pending review'
      });
    }

    // Reset to pending status for reapplication
    guide.approvalStatus = 'pending';
    guide.isApproved = false;
    await guide.save();

    res.status(200).json({
      success: true,
      message: 'Your application has been resubmitted for review',
      data: guide.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reapplying for approval',
      error: error.message
    });
  }
};
