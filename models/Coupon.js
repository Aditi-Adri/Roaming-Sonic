const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  serviceTypes: [{
    type: String,
    enum: ['hotel', 'tour', 'bus', 'guide', 'all'],
    required: true
  }],
  minPurchaseAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscountAmount: {
    type: Number,
    default: null,
    min: 0
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null,
    min: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    }
  }]
}, {
  timestamps: true
});

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  
  // Check if active
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  
  // Check date validity
  if (now < this.validFrom) return { valid: false, message: 'Coupon is not yet valid' };
  if (now > this.validTo) return { valid: false, message: 'Coupon has expired' };
  
  // Check usage limit
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  
  return { valid: true, message: 'Coupon is valid' };
};

// Calculate discount amount
couponSchema.methods.calculateDiscount = function(amount) {
  if (amount < this.minPurchaseAmount) {
    return { 
      discount: 0, 
      message: `Minimum purchase amount of ৳${this.minPurchaseAmount} required` 
    };
  }
  
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (amount * this.discountValue) / 100;
    
    // Apply max discount cap if set
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
  } else {
    discount = this.discountValue;
  }
  
  // Ensure discount doesn't exceed the amount
  discount = Math.min(discount, amount);
  
  return { 
    discount: Math.round(discount), 
    finalAmount: Math.round(amount - discount),
    message: 'Discount applied successfully' 
  };
};

// Increment usage count
couponSchema.methods.incrementUsage = async function(userId, bookingId) {
  this.usedCount += 1;
  this.usedBy.push({
    user: userId,
    bookingId: bookingId,
    usedAt: new Date()
  });
  await this.save();
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
