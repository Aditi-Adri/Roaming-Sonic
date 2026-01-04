const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['hotel', 'bus', 'tour'],
    required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus'
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourPackage'
  },
  checkInDate: Date,
  checkOutDate: Date,
  travelDate: Date,
  guests: {
    type: Number,
    default: 1
  },
  numberOfMembers: {
    type: Number,
    default: 1
  },
  roomType: String,
  numberOfRooms: {
    type: Number,
    default: 1
  },
  roomDetails: {
    roomType: String,
    roomName: String,
    pricePerNight: Number
  },
  // Bus-specific fields
  seatNumbers: [{
    type: String
  }],
  numberOfSeats: {
    type: Number,
    default: 1
  },
  passengerName: String,
  passengerPhone: String,
  passengerEmail: String,
  boardingPoint: String,
  droppingPoint: String,
  totalAmount: {
    type: Number,
    required: true
  },
  originalAmount: {
    type: Number
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  couponCode: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'bkash', 'nagad', 'rocket', 'bank-transfer'],
    required: true
  },
  paymentDetails: {
    cardNumber: String,
    cardHolderName: String,
    expiryDate: String,
    cvv: String,
    mobileNumber: String,
    bankName: String,
    accountNumber: String
  },
  transactionId: {
    type: String,
    required: true
  },
  paidAt: {
    type: Date,
    default: Date.now
  },
  specialRequests: String,
  adminNotes: String,
  cancellationRequest: {
    requested: {
      type: Boolean,
      default: false
    },
    requestDate: Date,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: Date,
    refundPercentage: Number,
    refundAmount: Number
  },
  userReview: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: Date
  },
  hotelReview: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: Date
  },
  hotelReviewed: {
    type: Boolean,
    default: false
  },
  ownerMessage: String,
  numberOfGuests: Number
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
