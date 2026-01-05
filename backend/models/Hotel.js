const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['hotel', 'resort', 'guest-house', 'hostel', 'apartment'],
    default: 'hotel'
  },
  address: {
    street: String,
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    division: {
      type: String,
      required: true,
      enum: ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh']
    },
    zipCode: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  website: String,
  photos: [{
    url: String,
    caption: String,
    type: {
      type: String,
      enum: ['hotel', 'room', 'facility', 'restaurant', 'other'],
      default: 'hotel'
    }
  }],
  rooms: [{
    type: {
      type: String,
      enum: ['single', 'double', 'deluxe', 'suite', 'family'],
      required: true
    },
    name: String,
    description: String,
    pricePerNight: {
      type: Number,
      required: true,
      min: 0
    },
    maxGuests: {
      type: Number,
      default: 2
    },
    totalRooms: {
      type: Number,
      required: true,
      min: 1
    },
    amenities: [String],
    photos: [String]
  }],
  amenities: [{
    type: String
  }],
  facilities: {
    parking: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    restaurant: { type: Boolean, default: false },
    swimmingPool: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    spa: { type: Boolean, default: false },
    conferenceRoom: { type: Boolean, default: false },
    airportShuttle: { type: Boolean, default: false },
    petFriendly: { type: Boolean, default: false },
    ac: { type: Boolean, default: false }
  },
  checkInTime: {
    type: String,
    default: '14:00'
  },
  checkOutTime: {
    type: String,
    default: '12:00'
  },
  cancellationPolicy: {
    type: String,
    default: 'flexible'
  },
  refundPolicy: {
    fullRefundHours: {
      type: Number,
      default: 24 // Hours before check-in for full refund
    },
    partialRefundPercentage: {
      type: Number,
      default: 70, // Percentage refund after full refund period
      min: 0,
      max: 100
    },
    noRefundHours: {
      type: Number,
      default: 0 // Hours before check-in for no refund
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Add geospatial index
hotelSchema.index({ location: '2dsphere' });

// Method to calculate average rating
hotelSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.totalReviews = 0;
    return;
  }
  
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.rating = (sum / this.reviews.length).toFixed(1);
  this.totalReviews = this.reviews.length;
};

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
