const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const User = require('../models/User');

// @desc    Create hotel booking
// @route   POST /api/hotel-bookings
// @access  Private (Tourist)
exports.createHotelBooking = async (req, res) => {
  try {
    const {
      hotelId,
      roomType,
      numberOfRooms,
      checkInDate,
      checkOutDate,
      guests,
      specialRequests,
      roomDetails
    } = req.body;

    // Validate hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Find room type in hotel
    const room = hotel.rooms.find(r => r.type === roomType);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room type not available'
      });
    }

    // Check room availability
    if (room.totalRooms < numberOfRooms) {
      return res.status(400).json({
        success: false,
        message: `Only ${room.totalRooms} rooms available for this type`
      });
    }

    // Calculate nights and total amount
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    const totalAmount = room.pricePerNight * numberOfRooms * nights;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      bookingType: 'hotel',
      hotel: hotelId,
      roomType,
      numberOfRooms,
      roomDetails: {
        roomType: room.type,
        roomName: room.name || room.type,
        pricePerNight: room.pricePerNight
      },
      checkInDate,
      checkOutDate,
      guests,
      totalAmount,
      specialRequests,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await booking.populate([
      { path: 'hotel', select: 'name address photos checkInTime checkOutTime' },
      { path: 'user', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// @desc    Get user's hotel bookings
// @route   GET /api/hotel-bookings/my-bookings
// @access  Private (Tourist)
exports.getMyHotelBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      bookingType: 'hotel'
    })
      .populate('hotel', 'name address photos phone email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// @desc    Get hotel owner's bookings
// @route   GET /api/hotel-bookings/owner-bookings
// @access  Private (Hotel Owner)
exports.getOwnerHotelBookings = async (req, res) => {
  try {
    // Get all hotels owned by this user
    const hotels = await Hotel.find({ owner: req.user._id }).select('_id');
    const hotelIds = hotels.map(h => h._id);

    const bookings = await Booking.find({
      hotel: { $in: hotelIds },
      bookingType: 'hotel'
    })
      .populate('hotel', 'name address')
      .populate('user', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Get owner bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/hotel-bookings/:id
// @access  Private
exports.getHotelBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const hotel = await Hotel.findById(booking.hotel._id);
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      hotel.owner.toString() !== req.user._id.toString() &&
      req.user.userType !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message
    });
  }
};

// @desc    Request booking cancellation
// @route   POST /api/hotel-bookings/:id/cancel-request
// @access  Private (Tourist)
exports.requestCancellation = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('hotel');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if already cancelled or completed
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel ${booking.status} booking`
      });
    }

    // Check if already requested
    if (booking.cancellationRequest?.requested) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation already requested'
      });
    }

    // Calculate refund based on hotel's policy
    const hotel = booking.hotel;
    const checkInDate = new Date(booking.checkInDate);
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

    let refundPercentage = 0;
    if (hoursUntilCheckIn >= hotel.refundPolicy.fullRefundHours) {
      refundPercentage = 100;
    } else if (hoursUntilCheckIn > hotel.refundPolicy.noRefundHours) {
      refundPercentage = hotel.refundPolicy.partialRefundPercentage;
    }

    const refundAmount = (booking.totalAmount * refundPercentage) / 100;

    booking.cancellationRequest = {
      requested: true,
      requestDate: new Date(),
      reason,
      status: 'pending',
      refundPercentage,
      refundAmount
    };

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Cancellation request submitted',
      data: {
        refundPercentage,
        refundAmount,
        booking
      }
    });
  } catch (error) {
    console.error('Request cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to request cancellation',
      error: error.message
    });
  }
};

// @desc    Approve/Reject cancellation request
// @route   PUT /api/hotel-bookings/:id/cancel-approve
// @access  Private (Hotel Owner)
exports.approveCancellation = async (req, res) => {
  try {
    const { approved } = req.body; // true or false
    const booking = await Booking.findById(req.params.id).populate('hotel');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if hotel owner
    const hotel = await Hotel.findById(booking.hotel._id);
    if (hotel.owner.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!booking.cancellationRequest?.requested) {
      return res.status(400).json({
        success: false,
        message: 'No cancellation request found'
      });
    }

    if (approved) {
      booking.cancellationRequest.status = 'approved';
      booking.cancellationRequest.approvedBy = req.user._id;
      booking.cancellationRequest.approvalDate = new Date();
      booking.status = 'cancelled';
      booking.refundAmount = booking.cancellationRequest.refundAmount;
      booking.paymentStatus = 'refunded';
    } else {
      booking.cancellationRequest.status = 'rejected';
      booking.cancellationRequest.approvedBy = req.user._id;
      booking.cancellationRequest.approvalDate = new Date();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: approved ? 'Cancellation approved' : 'Cancellation rejected',
      data: booking
    });
  } catch (error) {
    console.error('Approve cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process cancellation',
      error: error.message
    });
  }
};

// @desc    Confirm booking (Hotel Owner)
// @route   PUT /api/hotel-bookings/:id/confirm
// @access  Private (Hotel Owner)
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const hotel = await Hotel.findById(booking.hotel);
    if (hotel.owner.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    booking.status = 'confirmed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking confirmed',
      data: booking
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm booking',
      error: error.message
    });
  }
};

// @desc    Reject booking (Hotel Owner)
// @route   PUT /api/hotel-bookings/:id/reject
// @access  Private (Hotel Owner)
exports.rejectBooking = async (req, res) => {
  try {
    const { message } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const hotel = await Hotel.findById(booking.hotel);
    if (hotel.owner.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    booking.status = 'cancelled';
    booking.ownerMessage = message || 'Booking rejected by hotel';
    booking.refundAmount = booking.totalAmount * 0.7; // 70% refund
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking rejected',
      data: booking
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject booking',
      error: error.message
    });
  }
};

// @desc    Complete booking
// @route   PUT /api/hotel-bookings/:id/complete
// @access  Private (Hotel Owner)
exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const hotel = await Hotel.findById(booking.hotel);
    if (hotel.owner.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    booking.status = 'completed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking completed',
      data: booking
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete booking',
      error: error.message
    });
  }
};

// @desc    Check room availability
// @route   POST /api/hotel-bookings/check-availability
// @access  Public
exports.checkAvailability = async (req, res) => {
  try {
    const { hotelId, roomType, checkInDate, checkOutDate, numberOfRooms } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    const room = hotel.rooms.find(r => r.type === roomType);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room type not found'
      });
    }

    // Find overlapping bookings
    const overlappingBookings = await Booking.find({
      hotel: hotelId,
      roomType,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkInDate: { $lte: new Date(checkOutDate) },
          checkOutDate: { $gte: new Date(checkInDate) }
        }
      ]
    });

    const bookedRooms = overlappingBookings.reduce((sum, booking) => sum + booking.numberOfRooms, 0);
    const availableRooms = room.totalRooms - bookedRooms;

    res.status(200).json({
      success: true,
      data: {
        totalRooms: room.totalRooms,
        bookedRooms,
        availableRooms,
        isAvailable: availableRooms >= numberOfRooms,
        room: {
          type: room.type,
          name: room.name,
          pricePerNight: room.pricePerNight,
          maxGuests: room.maxGuests,
          amenities: room.amenities
        }
      }
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      error: error.message
    });
  }
};

module.exports = exports;
