const GroupTour = require('../models/GroupTour');

// @desc    Get all approved group tours
// @route   GET /api/group-tours
// @access  Public
exports.getAllGroupTours = async (req, res) => {
  try {
    const groupTours = await GroupTour.find({ 
      adminApprovalStatus: 'approved',
      status: { $in: ['active', 'approved'] }
    })
      .populate('host', 'name email phone')
      .populate('members.user', 'name email phone')
      .sort({ tourDate: 1 });

    res.status(200).json({
      success: true,
      count: groupTours.length,
      data: groupTours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching group tours',
      error: error.message
    });
  }
};

// @desc    Get single group tour
// @route   GET /api/group-tours/:id
// @access  Public
exports.getGroupTourById = async (req, res) => {
  try {
    const groupTour = await GroupTour.findById(req.params.id)
      .populate('host', 'name email phone')
      .populate('members.user', 'name email phone');

    if (!groupTour) {
      return res.status(404).json({
        success: false,
        message: 'Group tour not found'
      });
    }

    res.status(200).json({
      success: true,
      data: groupTour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching group tour',
      error: error.message
    });
  }
};

// @desc    Create group tour
// @route   POST /api/group-tours
// @access  Private (Tourist/Hotel Owner)
exports.createGroupTour = async (req, res) => {
  try {
    console.log('Creating group tour - User:', req.user.userType);
    console.log('Request body:', req.body);
    
    // Prevent admin and guide from creating group tours
    if (req.user.userType === 'admin' || req.user.userType === 'guide') {
      return res.status(403).json({
        success: false,
        message: 'Admins and Guides cannot create group tours'
      });
    }

    const groupTourData = {
      ...req.body,
      host: req.user._id,
      currentMembers: 1, // Host is first member
      status: 'pending',
      adminApprovalStatus: 'pending'
    };

    console.log('Creating group tour with data:', groupTourData);
    const groupTour = await GroupTour.create(groupTourData);
    console.log('Group tour created successfully:', groupTour._id);

    res.status(201).json({
      success: true,
      message: 'Group tour created successfully. Awaiting admin approval.',
      data: groupTour
    });
  } catch (error) {
    console.error('Error creating group tour:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating group tour',
      error: error.message
    });
  }
};

// @desc    Update group tour (Host only)
// @route   PUT /api/group-tours/:id
// @access  Private (Host)
exports.updateGroupTour = async (req, res) => {
  try {
    const groupTour = await GroupTour.findById(req.params.id);

    if (!groupTour) {
      return res.status(404).json({
        success: false,
        message: 'Group tour not found'
      });
    }

    // Check if user is the host
    if (groupTour.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can update this group tour'
      });
    }

    Object.keys(req.body).forEach(key => {
      if (key !== 'host' && key !== 'members' && key !== 'adminApprovalStatus') {
        groupTour[key] = req.body[key];
      }
    });

    await groupTour.save();

    res.status(200).json({
      success: true,
      message: 'Group tour updated successfully',
      data: groupTour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating group tour',
      error: error.message
    });
  }
};

// @desc    Request to join group tour
// @route   POST /api/group-tours/:id/join
// @access  Private
exports.requestToJoin = async (req, res) => {
  try {
    // Prevent admin and guide from joining
    if (req.user.userType === 'admin' || req.user.userType === 'guide') {
      return res.status(403).json({
        success: false,
        message: 'Admins and Guides cannot join group tours'
      });
    }

    const groupTour = await GroupTour.findById(req.params.id);

    if (!groupTour) {
      return res.status(404).json({
        success: false,
        message: 'Group tour not found'
      });
    }

    if (groupTour.adminApprovalStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This group tour is not yet approved by admin'
      });
    }

    // Check if user is the host
    if (groupTour.host.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You are the host of this tour'
      });
    }

    // Check if already requested
    const existingRequest = groupTour.members.find(
      m => m.user.toString() === req.user._id.toString()
    );

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: `You have already requested to join. Status: ${existingRequest.status}`
      });
    }

    // Check if tour is full
    if (groupTour.isFull) {
      return res.status(400).json({
        success: false,
        message: 'This group tour is already full'
      });
    }

    groupTour.members.push({
      user: req.user._id,
      status: 'pending',
      requestDate: new Date()
    });

    await groupTour.save();

    res.status(200).json({
      success: true,
      message: 'Join request sent successfully. Awaiting host approval.',
      data: groupTour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending join request',
      error: error.message
    });
  }
};

// @desc    Approve/Reject member request (Host only)
// @route   PATCH /api/group-tours/:id/members/:memberId
// @access  Private (Host)
exports.updateMemberStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    const groupTour = await GroupTour.findById(req.params.id);

    if (!groupTour) {
      return res.status(404).json({
        success: false,
        message: 'Group tour not found'
      });
    }

    // Check if user is the host
    if (groupTour.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can approve/reject members'
      });
    }

    // Find member by user ID
    const memberIndex = groupTour.members.findIndex(
      m => m.user.toString() === req.params.memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Member request not found'
      });
    }

    groupTour.members[memberIndex].status = status;
    if (status === 'approved') {
      groupTour.members[memberIndex].approvedDate = new Date();
    }

    await groupTour.save();

    res.status(200).json({
      success: true,
      message: `Member ${status} successfully`,
      data: groupTour
    });
  } catch (error) {
    console.error('Error updating member status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating member status',
      error: error.message
    });
  }
};

// @desc    Cancel group tour (Host only)
// @route   PATCH /api/group-tours/:id/cancel
// @access  Private (Host)
exports.cancelGroupTour = async (req, res) => {
  try {
    console.log('Cancel request - Tour ID:', req.params.id);
    console.log('Cancel request - User ID:', req.user._id);
    
    const groupTour = await GroupTour.findById(req.params.id);

    if (!groupTour) {
      return res.status(404).json({
        success: false,
        message: 'Group tour not found'
      });
    }

    console.log('Group tour host:', groupTour.host);
    console.log('Is host match:', groupTour.host.toString() === req.user._id.toString());

    // Check if user is the host
    if (groupTour.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can cancel this group tour'
      });
    }

    groupTour.status = 'cancelled';
    groupTour.isActive = false;
    await groupTour.save();

    console.log('Group tour cancelled successfully');

    res.status(200).json({
      success: true,
      message: 'Group tour cancelled successfully',
      data: groupTour
    });
  } catch (error) {
    console.error('Error cancelling group tour:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling group tour',
      error: error.message
    });
  }
};

// @desc    Complete group tour (Host only)
// @route   PATCH /api/group-tours/:id/complete
// @access  Private (Host)
exports.completeGroupTour = async (req, res) => {
  try {
    const groupTour = await GroupTour.findById(req.params.id);

    if (!groupTour) {
      return res.status(404).json({
        success: false,
        message: 'Group tour not found'
      });
    }

    // Check if user is the host
    if (groupTour.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can mark this tour as completed'
      });
    }

    groupTour.status = 'completed';
    groupTour.isActive = false;
    await groupTour.save();

    res.status(200).json({
      success: true,
      message: 'Group tour marked as completed',
      data: groupTour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing group tour',
      error: error.message
    });
  }
};

// @desc    Leave/Cancel join request (Member)
// @route   PATCH /api/group-tours/:id/leave
// @access  Private
exports.leaveGroupTour = async (req, res) => {
  try {
    const groupTour = await GroupTour.findById(req.params.id);

    if (!groupTour) {
      return res.status(404).json({
        success: false,
        message: 'Group tour not found'
      });
    }

    // Find the member in the members array
    const memberIndex = groupTour.members.findIndex(
      m => m.user.toString() === req.user._id.toString()
    );

    if (memberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'You are not a member of this group tour'
      });
    }

    // Remove the member
    groupTour.members.splice(memberIndex, 1);
    await groupTour.save();

    res.status(200).json({
      success: true,
      message: 'Successfully left the group tour',
      data: groupTour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error leaving group tour',
      error: error.message
    });
  }
};

// @desc    Get my group tours (as host)
// @route   GET /api/group-tours/my-tours
// @access  Private
exports.getMyGroupTours = async (req, res) => {
  try {
    const groupTours = await GroupTour.find({ host: req.user._id })
      .populate('members.user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: groupTours.length,
      data: groupTours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your group tours',
      error: error.message
    });
  }
};

// @desc    Get group tours I've joined
// @route   GET /api/group-tours/joined
// @access  Private
exports.getJoinedGroupTours = async (req, res) => {
  try {
    const groupTours = await GroupTour.find({
      'members.user': req.user._id
    })
      .populate('host', 'name email phone')
      .populate('members.user', 'name email phone')
      .sort({ tourDate: 1 });

    // Add myMembershipStatus to each tour
    const toursWithStatus = groupTours.map(tour => {
      const tourObj = tour.toObject();
      const myMembership = tour.members.find(m => m.user._id.toString() === req.user._id.toString());
      tourObj.myMembershipStatus = myMembership ? myMembership.status : 'unknown';
      return tourObj;
    });

    res.status(200).json({
      success: true,
      count: toursWithStatus.length,
      data: toursWithStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching joined group tours',
      error: error.message
    });
  }
};

// @desc    Get pending group tours (Admin only)
// @route   GET /api/group-tours/admin/pending
// @access  Private (Admin)
exports.getPendingGroupTours = async (req, res) => {
  try {
    const groupTours = await GroupTour.find({ adminApprovalStatus: 'pending' })
      .populate('host', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: groupTours.length,
      data: groupTours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending group tours',
      error: error.message
    });
  }
};

// @desc    Approve/Reject group tour (Admin only)
// @route   PATCH /api/group-tours/:id/admin-approval
// @access  Private (Admin)
exports.adminApproval = async (req, res) => {
  try {
    const { status, adminNotes } = req.body; // 'approved' or 'rejected'

    const groupTour = await GroupTour.findById(req.params.id);

    if (!groupTour) {
      return res.status(404).json({
        success: false,
        message: 'Group tour not found'
      });
    }

    groupTour.adminApprovalStatus = status;
    if (status === 'approved') {
      groupTour.status = 'active';
    } else {
      groupTour.status = 'rejected';
    }
    
    if (adminNotes) {
      groupTour.adminNotes = adminNotes;
    }

    await groupTour.save();

    res.status(200).json({
      success: true,
      message: `Group tour ${status} successfully`,
      data: groupTour
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating group tour status',
      error: error.message
    });
  }
};
