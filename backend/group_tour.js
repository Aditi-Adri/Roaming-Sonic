const mongoose = require('mongoose');

const groupTourSchema = new mongoose.Schema({
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
    required: [true, 'Destination is required']
  },
  tourDate: {
    type: Date,
    required: [true, 'Tour date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  meetingPoint: {
    type: String,
    required: [true, 'Meeting point is required']
  },
  meetingTime: {
    type: String,
    required: [true, 'Meeting time is required']
  },
  costPerPerson: {
    type: Number,
    required: [true, 'Cost per person is required'],
    min: 0
  },
  maxMembers: {
    type: Number,
    required: [true, 'Maximum members is required'],
    min: 2,
    default: 10
  },
  currentMembers: {
    type: Number,
    default: 1 // Host is automatically a member
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    requestDate: {
      type: Date,
      default: Date.now
    },
    approvedDate: Date
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminApprovalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: String,
  includes: String,
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  },
  isFull: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Middleware to update isFull status
groupTourSchema.pre('save', function() {
  const approvedMembers = this.members.filter(m => m.status === 'approved').length;
  this.currentMembers = approvedMembers + 1; // +1 for host
  this.isFull = this.currentMembers >= this.maxMembers;
});

const GroupTour = mongoose.model('GroupTour', groupTourSchema);

module.exports = GroupTour;
