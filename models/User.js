const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Common fields for all user types
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^(\+880|880|0)?1[3-9]\d{8}$/, 'Please provide a valid Bangladesh phone number']
  },
  userType: {
    type: String,
    enum: ['tourist', 'hotel_owner', 'admin', 'guide'],
    required: [true, 'User type is required']
  },
  photo: {
    type: String,
    default: 'default-avatar.png'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Tourist specific fields
  dateOfBirth: {
    type: Date
  },
  address: {
    street: String,
    city: String,
    district: String,
    division: String,
    zipCode: String
  },
  nidNumber: {
    type: String,
    sparse: true
  },
  passportNumber: {
    type: String,
    sparse: true
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  }],
  tourWishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourPackage'
  }],
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: String
  },
  referralCount: {
    type: Number,
    default: 0
  },
  
  // Hotel Owner specific fields
  businessName: {
    type: String
  },
  businessLicense: {
    type: String
  },
  hotels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  }],
  
  // Guide specific fields
  bio: {
    type: String,
    maxlength: 500
  },
  experience: {
    type: Number, // years
    min: 0
  },
  languages: [{
    type: String
  }],
  specializations: [{
    type: String // e.g., 'Historical Tours', 'Adventure Tours', 'Religious Sites'
  }],
  divisions: [{
    type: String // e.g., 'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date
  }],
  hourlyRate: {
    type: Number,
    min: 0
  },
  availability: {
    type: Boolean,
    default: true
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
    comment: {
      type: String,
      maxlength: 500
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Admin specific fields
  adminLevel: {
    type: String,
    enum: ['super', 'moderator'],
    default: 'moderator'
  },
  
  // Payment information
  preferredPaymentMethod: {
    type: String,
    enum: ['cash', 'bkash', 'nagad', 'card'],
    default: 'cash'
  },
  bkashNumber: String,
  nagadNumber: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password before saving and generate referral code
userSchema.pre('save', async function() {
  // Hash password if modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  // Generate referral code for new tourists
  if (this.isNew && this.userType === 'tourist' && !this.referralCode) {
    this.referralCode = this._id.toString().substring(0, 8).toUpperCase();
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
