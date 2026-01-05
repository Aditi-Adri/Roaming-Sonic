const Booking = require('../models/Booking');
const User = require('../models/User');
const TourPackage = require('../models/TourPackage');
const Coupon = require('../models/Coupon');

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, bookingType, startDate, endDate } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (bookingType) query.bookingType = bookingType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('hotel', 'name address phone')
      .populate('bus', 'name from to departureTime')
      .populate('tour', 'title destination duration')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Update booking status (Admin)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const booking = await Booking.findById(req.params.id).populate('tour');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const oldStatus = booking.status;
    booking.status = status;
    if (adminNotes) booking.adminNotes = adminNotes;
    
    // If cancelling, set full refund amount and update payment status
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      booking.refundAmount = booking.totalAmount; // Full refund for admin cancellation
      booking.paymentStatus = 'refunded';
    }
    
    // If rejecting/canceling a tour booking, free up slots
    if (booking.bookingType === 'tour' && booking.tour && 
        oldStatus !== 'cancelled' && (status === 'cancelled' || status === 'rejected')) {
      const tour = await TourPackage.findById(booking.tour);
      if (tour) {
        const numberOfMembers = booking.numberOfMembers || 1;
        tour.currentMembers = Math.max(0, tour.currentMembers - numberOfMembers);
        await tour.save();
      }
    }
    
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully${status === 'cancelled' ? `. Full refund of ৳${booking.totalAmount} will be processed.` : ''}`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    console.log('📝 Booking request received:', {
      user: req.user?.email,
      userType: req.user?.userType,
      body: req.body
    });

    // Check if user is admin or guide
    if (req.user.userType === 'admin' || req.user.userType === 'guide') {
      return res.status(403).json({
        success: false,
        message: 'Admins and Guides cannot make bookings. Only tourists and hotel owners can book.'
      });
    }

    const bookingData = {
      ...req.body,
      user: req.user._id
    };

    // Handle coupon if provided
    if (req.body.couponCode) {
      const coupon = await Coupon.findOne({ code: req.body.couponCode.toUpperCase() });
      
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
          // Check service type
          const serviceType = bookingData.bookingType;
          if (coupon.serviceTypes.includes('all') || coupon.serviceTypes.includes(serviceType)) {
            // Calculate discount
            const originalAmount = bookingData.totalAmount;
            const discountResult = coupon.calculateDiscount(originalAmount);
            
            if (discountResult.discount > 0) {
              bookingData.originalAmount = originalAmount;
              bookingData.discountAmount = discountResult.discount;
              bookingData.totalAmount = discountResult.finalAmount;
              bookingData.coupon = coupon._id;
              bookingData.couponCode = coupon.code;
              
              console.log('✅ Coupon applied:', {
                code: coupon.code,
                original: originalAmount,
                discount: discountResult.discount,
                final: discountResult.finalAmount
              });
            }
          }
        }
      }
    }

    // Validate required fields
    if (!bookingData.bookingType) {
      return res.status(400).json({
        success: false,
        message: 'Booking type is required'
      });
    }

    if (!bookingData.totalAmount || bookingData.totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total amount is required and must be greater than 0'
      });
    }

    // If it's a bus booking, check seat availability
    if (bookingData.bookingType === 'bus' && bookingData.bus) {
      const Bus = require('../models/Bus');
      const bus = await Bus.findById(bookingData.bus);
      
      if (!bus) {
        return res.status(404).json({
          success: false,
          message: 'Bus not found'
        });
      }

      const numberOfSeats = bookingData.numberOfSeats || 1;
      
      // Check if bus has available seats
      if (bus.availableSeats < numberOfSeats) {
        return res.status(400).json({
          success: false,
          message: `Not enough seats. Only ${bus.availableSeats} seats available`
        });
      }

      // Decrease available seats
      bus.availableSeats -= numberOfSeats;
      await bus.save();

      // Set payment status to paid for bus bookings
      bookingData.paymentStatus = 'paid';
      bookingData.status = 'confirmed';
    }

    // If it's a tour booking, check availability
    if (bookingData.bookingType === 'tour' && bookingData.tour) {
      const tour = await TourPackage.findById(bookingData.tour);
      
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }

      if (tour.isEnded) {
        return res.status(400).json({
          success: false,
          message: 'This tour has already ended'
        });
      }

      const numberOfMembers = bookingData.numberOfMembers || 1;
      
      // Check if tour has space
      if (tour.currentMembers + numberOfMembers > tour.maxGroupSize) {
        return res.status(400).json({
          success: false,
          message: `Not enough space. Only ${tour.maxGroupSize - tour.currentMembers} slots available`
        });
      }

      // Increment current members
      tour.currentMembers += numberOfMembers;
      await tour.save();
    }

    const booking = await Booking.create(bookingData);
    console.log('✅ Booking created successfully:', booking._id);

    // Increment coupon usage if coupon was applied
    if (bookingData.coupon) {
      const coupon = await Coupon.findById(bookingData.coupon);
      if (coupon) {
        await coupon.incrementUsage(req.user._id, booking._id);
      }
    }

    // Fetch the booking with populated fields
    const populatedBooking = await Booking.findById(booking._id)
      .populate('bus', 'name from to departureTime arrivalTime busNumber')
      .populate('hotel', 'name address phone')
      .populate('tour', 'title destination duration');

    res.status(201).json({
      success: true,
      message: bookingData.bookingType === 'bus' 
        ? 'Bus ticket booked successfully!' 
        : 'Booking created successfully. Awaiting admin approval.',
      data: populatedBooking || booking
    });
  } catch (error) {
    console.error('❌ Booking creation error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + errors.join(', '),
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating booking: ' + error.message,
      error: error.message
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('hotel', 'name address phone')
      .populate('bus', 'name from to departureTime')
      .populate('tour', 'title destination duration')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
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
        message: 'Not authorized to cancel this booking'
      });
    }

    // Cannot cancel already cancelled bookings
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Calculate refund (70% cashback)
    const refundAmount = booking.totalAmount * 0.7;
    booking.refundAmount = refundAmount;

    // If tour booking, free up the slots
    if (booking.bookingType === 'tour' && booking.tour) {
      const tour = await TourPackage.findById(booking.tour);
      if (tour) {
        const numberOfMembers = booking.numberOfMembers || 1;
        tour.currentMembers = Math.max(0, tour.currentMembers - numberOfMembers);
        await tour.save();
      }
    }

    // If bus booking, free up the seats
    if (booking.bookingType === 'bus' && booking.bus) {
      const Bus = require('../models/Bus');
      const bus = await Bus.findById(booking.bus);
      if (bus) {
        bus.availableSeats += booking.numberOfSeats || 1;
        await bus.save();
      }
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking cancelled successfully. Refund amount: ৳${refundAmount.toFixed(2)} (70% of ৳${booking.totalAmount})`,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

// @desc    Get booking statistics (Admin)
// @route   GET /api/bookings/stats
// @access  Private (Admin)
exports.getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Generate PDF ticket for bus booking
// @route   GET /api/bookings/:id/ticket
// @access  Private
exports.generateTicketPDF = async (req, res) => {
  try {
    console.log('Generating ticket for booking:', req.params.id);
    
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('bus', 'name busNumber from to departureTime arrivalTime fare busType');
    
    if (!booking) {
      console.log('Booking not found');
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    console.log('Booking found:', {
      id: booking._id,
      type: booking.bookingType,
      status: booking.status,
      userId: booking.user._id,
      requestUserId: req.user._id
    });

    // Check if user owns this booking
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      console.log('Authorization failed');
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this ticket'
      });
    }

    // Only generate ticket for confirmed bus bookings
    if (booking.bookingType !== 'bus' || booking.status !== 'confirmed') {
      console.log('Invalid booking type or status');
      return res.status(400).json({
        success: false,
        message: 'Ticket can only be generated for confirmed bus bookings'
      });
    }

    console.log('Generating HTML ticket...');

    // Generate simple HTML ticket
    const ticketHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Bus Ticket - ${booking._id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px; 
      max-width: 100%; 
      margin: 0 auto;
      background: white;
    }
    .ticket { 
      border: 2px solid #333; 
      padding: 20px; 
      border-radius: 10px; 
      max-width: 100%;
      background: white;
    }
    .header { 
      text-align: center; 
      border-bottom: 2px dashed #333; 
      padding-bottom: 15px; 
      margin-bottom: 15px; 
    }
    .header h1 { 
      color: #2c5aa0; 
      margin: 0 0 5px 0; 
      font-size: 24px;
    }
    .header p { 
      color: #666; 
      margin: 3px 0; 
      font-size: 12px;
    }
    .info-row { 
      display: flex; 
      justify-content: space-between; 
      margin: 10px 0; 
      padding: 8px; 
      background: #f5f5f5; 
      flex-wrap: wrap;
    }
    .info-row > div {
      min-width: 45%;
      margin: 2px 0;
    }
    .info-label { 
      font-weight: bold; 
      color: #333; 
      font-size: 12px;
    }
    .info-value { 
      color: #666; 
      font-size: 12px;
    }
    .route { 
      background: #2c5aa0; 
      color: white; 
      padding: 12px; 
      text-align: center; 
      font-size: 18px; 
      margin: 15px 0; 
      border-radius: 5px; 
    }
    .footer { 
      text-align: center; 
      margin-top: 20px; 
      padding-top: 15px; 
      border-top: 2px dashed #333; 
      color: #666; 
      font-size: 11px;
    }
    .footer p { margin: 5px 0; }
    .barcode { 
      text-align: center; 
      margin: 15px 0; 
      font-family: monospace; 
      font-size: 20px; 
      letter-spacing: 2px; 
    }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <h1>🚌 ROAMING SONIC</h1>
      <p>Bus Ticket Confirmation</p>
      <p>Ticket ID: <strong>${booking._id}</strong></p>
    </div>

    <div class="route">
      ${booking.bus.from} ➜ ${booking.bus.to}
    </div>

    <div class="info-row">
      <div><span class="info-label">Bus Name:</span> <span class="info-value">${booking.bus.name}</span></div>
      <div><span class="info-label">Bus Number:</span> <span class="info-value">${booking.bus.busNumber}</span></div>
    </div>

    <div class="info-row">
      <div><span class="info-label">Bus Type:</span> <span class="info-value">${booking.bus.busType}</span></div>
      <div><span class="info-label">Seats:</span> <span class="info-value">${booking.numberOfSeats || 1}</span></div>
    </div>

    <div class="info-row">
      <div><span class="info-label">Passenger Name:</span> <span class="info-value">${booking.passengerName || booking.user.name}</span></div>
      <div><span class="info-label">Phone:</span> <span class="info-value">${booking.passengerPhone || booking.user.phone}</span></div>
    </div>

    <div class="info-row">
      <div><span class="info-label">Travel Date:</span> <span class="info-value">${new Date(booking.travelDate).toLocaleDateString('en-GB')}</span></div>
      <div><span class="info-label">Departure:</span> <span class="info-value">${booking.bus.departureTime}</span></div>
    </div>

    ${booking.seatNumbers && booking.seatNumbers.length > 0 ? `
    <div class="info-row">
      <div><span class="info-label">Seat Numbers:</span> <span class="info-value">${booking.seatNumbers.join(', ')}</span></div>
    </div>
    ` : ''}

    ${booking.boardingPoint ? `
    <div class="info-row">
      <div><span class="info-label">Boarding Point:</span> <span class="info-value">${booking.boardingPoint}</span></div>
    </div>
    ` : ''}

    <div class="info-row">
      <div><span class="info-label">Total Fare:</span> <span class="info-value">৳${booking.totalAmount.toFixed(2)}</span></div>
      <div><span class="info-label">Payment Status:</span> <span class="info-value" style="color: green; font-weight: bold;">PAID</span></div>
    </div>

    <div class="barcode">
      ||||  ||  ||||  ||||||  ||  ||||
    </div>

    <div class="footer">
      <p><strong>Terms & Conditions:</strong></p>
      <p>✓ Please arrive 15 minutes before departure</p>
      <p>✓ Cancellation with 70% refund available</p>
      <p>✓ Carry a valid ID proof during travel</p>
      <p>✓ For support: support@roamingsonic.com</p>
      <p style="margin-top: 15px; color: #2c5aa0;"><strong>Have a safe journey!</strong></p>
    </div>
  </div>
</body>
</html>
    `;

    console.log('HTML ticket generated, length:', ticketHTML.length);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename=ticket-${booking._id}.html`);
    res.send(ticketHTML);
    
    console.log('Ticket sent successfully');

  } catch (error) {
    console.error('Error generating ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating ticket',
      error: error.message
    });
  }
};

// @desc    Hotel owner cancel booking
// @route   PATCH /api/bookings/:id/hotel-cancel
// @access  Private (Hotel Owner)
exports.hotelOwnerCancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    
    const booking = await Booking.findById(req.params.id)
      .populate('hotel', 'owner name')
      .populate('user', 'name email phone');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if it's a hotel booking
    if (booking.bookingType !== 'hotel') {
      return res.status(400).json({
        success: false,
        message: 'This endpoint is only for hotel bookings'
      });
    }

    // Check if hotel exists
    if (!booking.hotel) {
      return res.status(400).json({
        success: false,
        message: 'Hotel information not found for this booking'
      });
    }

    // Check if user is the hotel owner
    const hotelOwnerId = booking.hotel.owner?._id || booking.hotel.owner;
    if (!hotelOwnerId || hotelOwnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the hotel owner can cancel this booking'
      });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.refundAmount = booking.totalAmount; // Full refund for owner cancellation
    booking.adminNotes = `Cancelled by hotel owner. Reason: ${cancellationReason || 'Not provided'}`;
    
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Customer will receive full refund.',
      data: booking
    });
  } catch (error) {
    console.error('Hotel owner cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};
