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
  paymentMethod: String,
  transactionId: String,
  specialRequests: String,
  adminNotes: String,
  userReview: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: Date
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
