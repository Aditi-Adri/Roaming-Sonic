const mongoose = require('mongoose');
const User = require('../models/User');

// Admin credentials
const ADMIN_EMAIL = 'admin@roamingsonic.com';
const ADMIN_PASSWORD = 'Admin@2025';

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/roaming-sonic');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', ADMIN_EMAIL);
      console.log('Use existing password or delete the user and run this script again.');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'System Administrator',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      phone: '+8801700000000',
      userType: 'admin',
      adminLevel: 'super'
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Please change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
