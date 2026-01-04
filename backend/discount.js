const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Discount title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: 0,
    max: 100
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  applicableHotels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  bannerImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200'
  }
}, {
  timestamps: true
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;