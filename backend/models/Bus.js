const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Bus company name is required'],
    trim: true
  },
  busNumber: {
    type: String,
    required: [true, 'Bus number is required'],
    unique: true
  },
  busType: {
    type: String,
    enum: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper', 'Luxury'],
    required: true
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: 20,
    max: 60
  },
  from: {
    type: String,
    required: [true, 'Starting location is required']
  },
  to: {
    type: String,
    required: [true, 'Destination is required']
  },
  departureTime: {
    type: String,
    required: [true, 'Departure time is required']
  },
  arrivalTime: {
    type: String,
    required: [true, 'Arrival time is required']
  },
  duration: {
    type: String,
    required: true
  },
  fare: {
    type: Number,
    required: [true, 'Fare is required'],
    min: 0
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'Charging Port', 'TV', 'Snacks', 'Water', 'Blanket', 'Reading Light']
  }],
  schedule: {
    type: [String],
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    default: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  availableSeats: {
    type: Number,
    required: true
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
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  operator: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  images: [{
    type: String
  }]
}, {
  timestamps: true
});

// Calculate average rating
busSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.totalReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = sum / this.reviews.length;
    this.totalReviews = this.reviews.length;
  }
};

// Update available seats before saving
busSchema.pre('save', function() {
  if (!this.availableSeats && this.totalSeats) {
    this.availableSeats = this.totalSeats;
  }
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
