const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const busRoutes = require('./routes/busRoutes');
const guideRoutes = require('./routes/guideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const tourRoutes = require('./routes/tourRoutes');
const guideRequestRoutes = require('./routes/guideRequestRoutes');
const groupTourRoutes = require('./routes/groupTourRoutes');
const hotelBookingRoutes = require('./routes/hotelBookingRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const couponRoutes = require('./routes/couponRoutes');

const app = express();

// Middleware - Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roaming-sonic')
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/guide-requests', guideRequestRoutes);
app.use('/api/group-tours', groupTourRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/hotel-bookings', hotelBookingRoutes);
app.use('/api/coupons', couponRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Roaming Sonic API',
    version: '1.0.0',
    country: 'Bangladesh'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
