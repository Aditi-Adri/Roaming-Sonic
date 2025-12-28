const mongoose = require('mongoose');

const tourPackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tour title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  destination: {
    type: String,
    required: true
  },
  duration: {
    days: {
      type: Number,
      required: true
    },
    nights: {
      type: Number,
      required: true
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  maxGroupSize: {
    type: Number,
    default: 20
  },
  currentMembers: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    caption: String
  }],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String]
  }],
  includes: [String],
  excludes: [String],
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging', 'Difficult'],
    default: 'Easy'
  },
  category: {
    type: String,
    enum: ['Adventure', 'Cultural', 'Religious', 'Beach', 'Wildlife', 'Historical', 'Family', 'Honeymoon'],
    required: true
  },
  availableDates: [{
    startDate: Date,
    endDate: Date,
    availableSlots: Number
  }],
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  featured: {
    type: Boolean,
    default: false
  },
  isEnded: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate average rating
tourPackageSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.totalReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = sum / this.reviews.length;
    this.totalReviews = this.reviews.length;
  }
};

const TourPackage = mongoose.model('TourPackage', tourPackageSchema);

module.exports = TourPackage;
