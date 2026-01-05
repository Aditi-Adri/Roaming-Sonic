const mongoose = require('mongoose');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const sampleCoupons = [
  {
    code: 'WELCOME2026',
    description: 'Welcome discount for new users - 15% off on all services',
    discountType: 'percentage',
    discountValue: 15,
    serviceTypes: ['all'],
    minPurchaseAmount: 2000,
    maxDiscountAmount: 1000,
    validFrom: new Date('2026-01-01'),
    validTo: new Date('2026-12-31'),
    usageLimit: 100,
    isActive: true
  },
  {
    code: 'SUMMER50',
    description: 'Summer special - ৳500 off on tours',
    discountType: 'fixed',
    discountValue: 500,
    serviceTypes: ['tour'],
    minPurchaseAmount: 3000,
    maxDiscountAmount: null,
    validFrom: new Date('2026-04-01'),
    validTo: new Date('2026-06-30'),
    usageLimit: 50,
    isActive: true
  },
  {
    code: 'HOTEL20',
    description: '20% discount on hotel bookings',
    discountType: 'percentage',
    discountValue: 20,
    serviceTypes: ['hotel'],
    minPurchaseAmount: 5000,
    maxDiscountAmount: 2000,
    validFrom: new Date('2026-01-01'),
    validTo: new Date('2026-12-31'),
    usageLimit: null,
    isActive: true
  },
  {
    code: 'BUS100',
    description: 'Bus travel discount - ৳100 off',
    discountType: 'fixed',
    discountValue: 100,
    serviceTypes: ['bus'],
    minPurchaseAmount: 500,
    maxDiscountAmount: null,
    validFrom: new Date('2026-01-01'),
    validTo: new Date('2026-12-31'),
    usageLimit: 200,
    isActive: true
  },
  {
    code: 'MEGA25',
    description: 'Mega sale - 25% off on tours and hotels',
    discountType: 'percentage',
    discountValue: 25,
    serviceTypes: ['tour', 'hotel'],
    minPurchaseAmount: 10000,
    maxDiscountAmount: 3000,
    validFrom: new Date('2026-02-01'),
    validTo: new Date('2026-02-28'),
    usageLimit: 30,
    isActive: true
  },
  {
    code: 'GUIDE50',
    description: 'Guide booking special - ৳50 off',
    discountType: 'fixed',
    discountValue: 50,
    serviceTypes: ['guide'],
    minPurchaseAmount: 300,
    maxDiscountAmount: null,
    validFrom: new Date('2026-01-01'),
    validTo: new Date('2026-12-31'),
    usageLimit: null,
    isActive: true
  }
];

async function seedCoupons() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roaming-sonic');
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@roamingsonic.com' });
    if (!admin) {
      console.error('Admin user not found. Please create admin first.');
      process.exit(1);
    }

    // Clear existing coupons
    await Coupon.deleteMany({});
    console.log('Cleared existing coupons');

    // Add createdBy field to all coupons
    const couponsWithCreator = sampleCoupons.map(coupon => ({
      ...coupon,
      createdBy: admin._id
    }));

    // Insert coupons
    const createdCoupons = await Coupon.insertMany(couponsWithCreator);
    console.log(`✅ Successfully created ${createdCoupons.length} coupon codes!`);
    
    // Display coupon summary
    console.log('\n📋 Coupon Summary:\n');
    createdCoupons.forEach((coupon, index) => {
      const discount = coupon.discountType === 'percentage' 
        ? `${coupon.discountValue}%` 
        : `৳${coupon.discountValue}`;
      console.log(`${index + 1}. ${coupon.code} - ${discount} (${coupon.serviceTypes.join(', ')})`);
    });

    console.log('\n🎉 All coupons are ready to use!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding coupons:', error);
    process.exit(1);
  }
}

seedCoupons();
