const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
const Bus = require('../models/Bus');
const User = require('../models/User');

// Sample Hotels Data (Bangladesh)
const hotelsData = [
  {
    name: 'Pan Pacific Sonargaon Dhaka',
    category: 'hotel',
    description: 'A luxurious 5-star hotel in the heart of Dhaka with world-class amenities and services.',
    address: {
      street: '107 Kazi Nazrul Islam Avenue',
      city: 'Dhaka',
      district: 'Dhaka',
      division: 'Dhaka',
      zipCode: '1000'
    },
    phone: '+880-2-8159001',
    email: 'info@sonargaonpanpacific.com',
    website: 'www.panpacific.com',
    location: {
      type: 'Point',
      coordinates: [90.4063, 23.7515]
    },
    rooms: [
      { type: 'deluxe', name: 'Deluxe Room', pricePerNight: 15000, maxGuests: 2, totalRooms: 20 },
      { type: 'suite', name: 'Executive Suite', pricePerNight: 25000, maxGuests: 3, totalRooms: 10 },
      { type: 'suite', name: 'Presidential Suite', pricePerNight: 50000, maxGuests: 4, totalRooms: 2 }
    ],
    facilities: {
      wifi: true,
      parking: true,
      restaurant: true,
      gym: true,
      spa: true,
      swimmingPool: true,
      conferenceRoom: true,
      airportShuttle: true,
      ac: true
    },
    amenities: ['24/7 Room Service', 'Concierge', 'Business Center', 'Laundry', 'Rooftop Restaurant'],
    rating: 4.8,
    verificationStatus: 'approved'
  },
  {
    name: 'Hotel Sea Crown',
    category: 'resort',
    description: 'Beautiful beachfront hotel in Cox\'s Bazar with stunning ocean views.',
    address: {
      street: 'Hotel Motel Zone',
      city: 'Cox\'s Bazar',
      district: 'Cox\'s Bazar',
      division: 'Chittagong',
      zipCode: '4700'
    },
    phone: '+880-341-51234',
    email: 'info@seacrown.com',
    website: 'www.hotelseacrown.com',
    location: {
      type: 'Point',
      coordinates: [91.9813, 21.4272]
    },
    rooms: [
      { type: 'double', name: 'Sea View Room', pricePerNight: 5000, maxGuests: 2, totalRooms: 30 },
      { type: 'family', name: 'Family Suite', pricePerNight: 8000, maxGuests: 4, totalRooms: 15 },
      { type: 'deluxe', name: 'Deluxe Sea View', pricePerNight: 7000, maxGuests: 3, totalRooms: 20 }
    ],
    facilities: {
      wifi: true,
      parking: true,
      restaurant: true,
      gym: false,
      spa: true,
      swimmingPool: false,
      conferenceRoom: false,
      airportShuttle: true,
      ac: true
    },
    amenities: ['Beach Access', 'Sea View', 'Restaurant', 'Room Service'],
    rating: 4.3,
    verificationStatus: 'approved'
  },
  {
    name: 'Hotel Noorjahan Grand',
    category: 'hotel',
    description: 'Comfortable hotel in Sylhet with modern facilities and excellent service.',
    address: {
      street: 'Zindabazar',
      city: 'Sylhet',
      district: 'Sylhet',
      division: 'Sylhet',
      zipCode: '3100'
    },
    phone: '+880-821-725544',
    email: 'info@noorjahangrand.com',
    website: 'www.noorjahangrand.com',
    location: {
      type: 'Point',
      coordinates: [91.8719, 24.8949]
    },
    rooms: [
      { type: 'single', name: 'Standard Room', pricePerNight: 4000, maxGuests: 2, totalRooms: 25 },
      { type: 'deluxe', name: 'Deluxe Room', pricePerNight: 6000, maxGuests: 3, totalRooms: 15 },
      { type: 'suite', name: 'Executive Suite', pricePerNight: 10000, maxGuests: 4, totalRooms: 5 }
    ],
    facilities: {
      wifi: true,
      parking: true,
      restaurant: true,
      gym: true,
      spa: false,
      swimmingPool: false,
      conferenceRoom: true,
      airportShuttle: false,
      ac: true
    },
    amenities: ['Restaurant', 'Coffee Shop', 'Room Service', 'Laundry'],
    rating: 4.1,
    verificationStatus: 'approved'
  },
  {
    name: 'Hotel Castle Sanmar',
    category: 'hotel',
    description: 'Premium hotel in Chittagong with exceptional hospitality and modern amenities.',
    address: {
      street: 'CDA Avenue',
      city: 'Chittagong',
      district: 'Chattogram',
      division: 'Chittagong',
      zipCode: '4000'
    },
    phone: '+880-31-2523401',
    email: 'info@castlesanmar.com',
    website: 'www.castlesanmar.com',
    location: {
      type: 'Point',
      coordinates: [91.8320, 22.3569]
    },
    rooms: [
      { type: 'double', name: 'Superior Room', pricePerNight: 8000, maxGuests: 2, totalRooms: 20 },
      { type: 'deluxe', name: 'Deluxe Room', pricePerNight: 12000, maxGuests: 3, totalRooms: 15 },
      { type: 'suite', name: 'Suite', pricePerNight: 20000, maxGuests: 4, totalRooms: 8 }
    ],
    facilities: {
      wifi: true,
      parking: true,
      restaurant: true,
      gym: true,
      spa: true,
      swimmingPool: true,
      conferenceRoom: true,
      airportShuttle: true,
      ac: true
    },
    amenities: ['Spa', 'Gym', 'Multiple Restaurants', 'Bar', 'Business Center'],
    rating: 4.6,
    verificationStatus: 'approved'
  },
  {
    name: 'Hotel Garden Inn',
    category: 'guest-house',
    description: 'Affordable and clean budget hotel in Rajshahi city center.',
    address: {
      street: 'Shaheb Bazar',
      city: 'Rajshahi',
      district: 'Rajshahi',
      division: 'Rajshahi',
      zipCode: '6000'
    },
    phone: '+880-721-772233',
    email: 'info@gardeninn.com',
    website: 'www.gardeninnrajshahi.com',
    location: {
      type: 'Point',
      coordinates: [88.5944, 24.3745]
    },
    rooms: [
      { type: 'single', name: 'Standard Room', pricePerNight: 2000, maxGuests: 2, totalRooms: 30 },
      { type: 'deluxe', name: 'Deluxe Room', pricePerNight: 3000, maxGuests: 3, totalRooms: 10 }
    ],
    facilities: {
      wifi: true,
      parking: true,
      restaurant: true,
      gym: false,
      spa: false,
      swimmingPool: false,
      conferenceRoom: false,
      airportShuttle: false,
      ac: true
    },
    amenities: ['Restaurant', 'Room Service', 'Free WiFi'],
    rating: 3.8,
    verificationStatus: 'approved'
  }
];

// Sample Buses Data (Bangladesh Routes)
const busesData = [
  {
    name: 'Shohag Paribahan',
    busNumber: 'SH-101',
    busType: 'AC',
    totalSeats: 40,
    from: 'Dhaka',
    to: 'Chittagong',
    departureTime: '07:00 AM',
    arrivalTime: '01:00 PM',
    duration: '6 hours',
    fare: 800,
    amenities: ['WiFi', 'Charging Port', 'TV', 'Water'],
    availableSeats: 40,
    rating: 4.5,
    operator: {
      name: 'Shohag Paribahan Ltd',
      phone: '+880-2-9001234',
      email: 'info@shohagparibahan.com'
    },
    status: 'active'
  },
  {
    name: 'Green Line Paribahan',
    busNumber: 'GL-202',
    busType: 'Luxury',
    totalSeats: 36,
    from: 'Dhaka',
    to: 'Cox\'s Bazar',
    departureTime: '09:00 PM',
    arrivalTime: '07:00 AM',
    duration: '10 hours',
    fare: 1500,
    amenities: ['WiFi', 'Charging Port', 'TV', 'Snacks', 'Water', 'Blanket', 'Reading Light'],
    availableSeats: 36,
    rating: 4.7,
    operator: {
      name: 'Green Line Paribahan',
      phone: '+880-2-9002345',
      email: 'info@greenlinebd.com'
    },
    status: 'active'
  },
  {
    name: 'Hanif Enterprise',
    busNumber: 'HE-303',
    busType: 'AC',
    totalSeats: 42,
    from: 'Dhaka',
    to: 'Sylhet',
    departureTime: '11:00 PM',
    arrivalTime: '06:00 AM',
    duration: '7 hours',
    fare: 900,
    amenities: ['WiFi', 'Charging Port', 'Water'],
    availableSeats: 42,
    rating: 4.3,
    operator: {
      name: 'Hanif Enterprise',
      phone: '+880-2-9003456',
      email: 'info@hanifenterprise.com'
    },
    status: 'active'
  },
  {
    name: 'Ena Transport',
    busNumber: 'ET-404',
    busType: 'Semi-Sleeper',
    totalSeats: 38,
    from: 'Dhaka',
    to: 'Rajshahi',
    departureTime: '10:00 PM',
    arrivalTime: '06:00 AM',
    duration: '8 hours',
    fare: 850,
    amenities: ['Charging Port', 'Water', 'Blanket'],
    availableSeats: 38,
    rating: 4.2,
    operator: {
      name: 'Ena Transport Services',
      phone: '+880-2-9004567',
      email: 'info@enatransport.com'
    },
    status: 'active'
  },
  {
    name: 'Shyamoli Paribahan',
    busNumber: 'SY-505',
    busType: 'AC',
    totalSeats: 40,
    from: 'Dhaka',
    to: 'Khulna',
    departureTime: '08:00 AM',
    arrivalTime: '04:00 PM',
    duration: '8 hours',
    fare: 750,
    amenities: ['WiFi', 'TV', 'Water'],
    availableSeats: 40,
    rating: 4.0,
    operator: {
      name: 'Shyamoli Paribahan',
      phone: '+880-2-9005678',
      email: 'info@shyamoliparibahan.com'
    },
    status: 'active'
  },
  {
    name: 'Saudia Paribahan',
    busNumber: 'SA-606',
    busType: 'Non-AC',
    totalSeats: 45,
    from: 'Dhaka',
    to: 'Barisal',
    departureTime: '06:00 AM',
    arrivalTime: '01:00 PM',
    duration: '7 hours',
    fare: 500,
    amenities: ['Water'],
    availableSeats: 45,
    rating: 3.8,
    operator: {
      name: 'Saudia Paribahan',
      phone: '+880-2-9006789',
      email: 'info@saudiaparibahan.com'
    },
    status: 'active'
  },
  {
    name: 'TR Travels',
    busNumber: 'TR-707',
    busType: 'Luxury',
    totalSeats: 32,
    from: 'Chittagong',
    to: 'Cox\'s Bazar',
    departureTime: '08:00 AM',
    arrivalTime: '12:00 PM',
    duration: '4 hours',
    fare: 600,
    amenities: ['WiFi', 'Charging Port', 'TV', 'Water', 'Blanket'],
    availableSeats: 32,
    rating: 4.6,
    operator: {
      name: 'TR Travels',
      phone: '+880-31-2507890',
      email: 'info@trtravels.com'
    },
    status: 'active'
  },
  {
    name: 'Silk Line',
    busNumber: 'SL-808',
    busType: 'AC',
    totalSeats: 40,
    from: 'Sylhet',
    to: 'Dhaka',
    departureTime: '10:00 PM',
    arrivalTime: '05:00 AM',
    duration: '7 hours',
    fare: 900,
    amenities: ['WiFi', 'Charging Port', 'Water'],
    availableSeats: 40,
    rating: 4.4,
    operator: {
      name: 'Silk Line Paribahan',
      phone: '+880-821-708901',
      email: 'info@silkline.com'
    },
    status: 'active'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/roaming-sonic');
    console.log('✅ Connected to MongoDB');

    // Find admin user to set as hotel owner
    const admin = await User.findOne({ email: 'admin@roamingsonic.com' });
    
    if (!admin) {
      console.log('⚠️  Admin user not found. Creating hotels without owner...');
    }

    // Clear existing data
    console.log('\n🗑️  Clearing existing hotels and buses...');
    await Hotel.deleteMany({});
    await Bus.deleteMany({});
    console.log('✅ Cleared old data');

    // Add owner to hotels if admin exists
    const hotelsWithOwner = admin ? hotelsData.map(hotel => ({
      ...hotel,
      owner: admin._id
    })) : hotelsData;

    // Seed Hotels
    console.log('\n🏨 Seeding hotels...');
    const hotels = await Hotel.insertMany(hotelsWithOwner);
    console.log(`✅ Added ${hotels.length} hotels`);

    // Seed Buses
    console.log('\n🚌 Seeding buses...');
    const buses = await Bus.insertMany(busesData);
    console.log(`✅ Added ${buses.length} buses`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📊 Summary:`);
    console.log(`   Hotels: ${hotels.length}`);
    console.log(`   Buses: ${buses.length}`);
    console.log('\n🌍 Popular Destinations:');
    console.log('   • Dhaka (Capital)');
    console.log('   • Cox\'s Bazar (Beach)');
    console.log('   • Chittagong (Port City)');
    console.log('   • Sylhet (Tea Capital)');
    console.log('   • Rajshahi (Silk City)');
    console.log('   • Khulna (Sundarbans Gateway)');
    console.log('   • Barisal (River Port)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
