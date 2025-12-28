const mongoose = require('mongoose');

const guideRequestSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  tourDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in hours
    required: true
  },
  numberOfPeople: {
    type: Number,
    default: 1
  },
  message: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalCost: {
    type: Number
  },
  responseMessage: {
    type: String
  },
  respondedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
guideRequestSchema.index({ guide: 1, status: 1 });
guideRequestSchema.index({ tourist: 1, status: 1 });

const GuideRequest = mongoose.model('GuideRequest', guideRequestSchema);

module.exports = GuideRequest;
