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
  seatLayout: {
    type: String,
    enum: ['2-2', '2-3', '1-2'],
    default: '2-2'
  },
  seatMap: [{
    seatNumber: {
      type: String,
      required: true
    },
    row: {
      type: Number,
      required: true
    },
    column: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['regular', 'premium', 'sleeper'],
      default: 'regular'
    },
    price: {
      type: Number
    }
  }],
  dailySeats: [{
    date: {
      type: String,
      required: true
    },
    bookedSeats: [{
      seatNumber: String,
      bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
      },
      passengerName: String
    }],
    availableSeats: {
      type: Number
    }
  }],
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

// Initialize seat map
busSchema.methods.initializeSeatMap = function() {
  if (this.seatMap && this.seatMap.length > 0) return;
  
  const seats = [];
  const layout = this.seatLayout || '2-2';
  const [leftSeats, rightSeats] = layout.split('-').map(Number);
  const seatsPerRow = leftSeats + rightSeats;
  const totalRows = Math.ceil(this.totalSeats / seatsPerRow);
  
  let seatNumber = 1;
  for (let row = 1; row <= totalRows && seatNumber <= this.totalSeats; row++) {
    // Left side seats
    for (let col = 1; col <= leftSeats && seatNumber <= this.totalSeats; col++) {
      seats.push({
        seatNumber: `${seatNumber}`,
        row: row,
        column: col,
        type: 'regular',
        price: this.fare
      });
      seatNumber++;
    }
    // Right side seats
    for (let col = leftSeats + 2; col <= leftSeats + rightSeats + 1 && seatNumber <= this.totalSeats; col++) {
      seats.push({
        seatNumber: `${seatNumber}`,
        row: row,
        column: col,
        type: 'regular',
        price: this.fare
      });
      seatNumber++;
    }
  }
  
  this.seatMap = seats;
};

// Get seat availability for a specific date
busSchema.methods.getSeatAvailability = function(date) {
  const dateStr = new Date(date).toISOString().split('T')[0];
  const dailyData = this.dailySeats.find(ds => ds.date === dateStr);
  
  if (!dailyData) {
    return {
      availableSeats: this.seatMap.map(seat => seat.seatNumber),
      bookedSeats: []
    };
  }
  
  const bookedSeatNumbers = dailyData.bookedSeats.map(bs => bs.seatNumber);
  const availableSeats = this.seatMap
    .map(seat => seat.seatNumber)
    .filter(sn => !bookedSeatNumbers.includes(sn));
  
  return {
    availableSeats,
    bookedSeats: bookedSeatNumbers
  };
};

// Book seats for a date
busSchema.methods.bookSeats = async function(date, seatNumbers, bookingId, passengerName) {
  const dateStr = new Date(date).toISOString().split('T')[0];
  let dailyData = this.dailySeats.find(ds => ds.date === dateStr);
  
  if (!dailyData) {
    dailyData = {
      date: dateStr,
      bookedSeats: [],
      availableSeats: this.totalSeats
    };
    this.dailySeats.push(dailyData);
  }
  
  // Check if seats are available
  const bookedSeatNumbers = dailyData.bookedSeats.map(bs => bs.seatNumber);
  const unavailableSeats = seatNumbers.filter(sn => bookedSeatNumbers.includes(sn));
  
  if (unavailableSeats.length > 0) {
    throw new Error(`Seats ${unavailableSeats.join(', ')} are already booked`);
  }
  
  // Book the seats
  seatNumbers.forEach(seatNumber => {
    dailyData.bookedSeats.push({
      seatNumber,
      bookingId,
      passengerName
    });
  });
  
  dailyData.availableSeats = this.totalSeats - dailyData.bookedSeats.length;
  
  await this.save();
  return true;
};

// Update available seats before saving
busSchema.pre('save', function() {
  if (!this.availableSeats && this.totalSeats) {
    this.availableSeats = this.totalSeats;
  }
  
  // Initialize seat map if not exists
  if (this.isNew && (!this.seatMap || this.seatMap.length === 0)) {
    this.initializeSeatMap();
  }
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus;
