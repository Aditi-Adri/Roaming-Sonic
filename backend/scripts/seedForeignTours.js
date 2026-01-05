const mongoose = require('mongoose');
const TourPackage = require('../models/TourPackage');
const User = require('../models/User');
require('dotenv').config();

const foreignTours = [
  {
    title: 'Magical Dubai & Abu Dhabi Experience',
    description: 'Experience the luxury and grandeur of UAE with visits to iconic landmarks including Burj Khalifa, Dubai Mall, Sheikh Zayed Grand Mosque, and thrilling desert safari. Enjoy world-class shopping, stunning architecture, and Arabian hospitality.',
    destination: 'Dubai & Abu Dhabi, UAE',
    duration: { days: 6, nights: 5 },
    price: 85000,
    category: 'Adventure',
    difficulty: 'Easy',
    maxGroupSize: 15,
    isForeign: true,
    featured: true,
    includes: [
      'Round-trip flight tickets',
      '5-star hotel accommodation',
      'Daily breakfast and dinner',
      'Burj Khalifa admission ticket (124th floor)',
      'Desert safari with BBQ dinner',
      'Dubai city tour with guide',
      'Abu Dhabi full day tour',
      'All transfers in AC coach',
      'Travel insurance'
    ],
    excludes: [
      'Lunch',
      'Personal expenses',
      'Optional activities',
      'Tips and gratuities',
      'Visa fees (if applicable)'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Dubai',
        description: 'Arrive at Dubai International Airport, transfer to hotel, check-in and relax',
        activities: ['Airport pickup', 'Hotel check-in', 'Evening free for leisure']
      },
      {
        day: 2,
        title: 'Dubai City Tour & Burj Khalifa',
        description: 'Full day Dubai sightseeing including modern and traditional landmarks',
        activities: ['Dubai Museum visit', 'Gold & Spice Souk', 'Jumeirah Mosque', 'Burj Al Arab photo stop', 'Burj Khalifa visit (124th floor)', 'Dubai Mall shopping']
      },
      {
        day: 3,
        title: 'Desert Safari Adventure',
        description: 'Thrilling desert experience with dune bashing, camel ride, and cultural entertainment',
        activities: ['Dune bashing in 4x4', 'Camel riding', 'Sandboarding', 'Henna painting', 'Traditional BBQ dinner', 'Belly dance & Tanoura show']
      },
      {
        day: 4,
        title: 'Abu Dhabi Day Trip',
        description: 'Explore the capital city of UAE with its magnificent architecture',
        activities: ['Sheikh Zayed Grand Mosque', 'Emirates Palace photo stop', 'Corniche drive', 'Dates market visit', 'Ferrari World (optional)']
      },
      {
        day: 5,
        title: 'Dubai Marina & Free Day',
        description: 'Leisure day for shopping and optional activities',
        activities: ['Dubai Marina walk', 'Mall of Emirates visit', 'Ski Dubai (optional)', 'Evening Dhow cruise (optional)']
      },
      {
        day: 6,
        title: 'Departure',
        description: 'Check-out and transfer to airport for return flight',
        activities: ['Hotel check-out', 'Airport drop-off', 'Departure']
      }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', caption: 'Dubai Marina Skyline' },
      { url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800', caption: 'Burj Khalifa' },
      { url: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800', caption: 'Desert Safari' }
    ]
  },
  {
    title: 'Thailand Paradise - Bangkok, Pattaya & Phuket',
    description: 'Discover the Land of Smiles with this comprehensive Thailand tour covering vibrant Bangkok, beach paradise Pattaya, and tropical island Phuket. Experience temples, beaches, islands, and authentic Thai culture.',
    destination: 'Bangkok, Pattaya & Phuket, Thailand',
    duration: { days: 8, nights: 7 },
    price: 68000,
    category: 'Beach',
    difficulty: 'Easy',
    maxGroupSize: 20,
    isForeign: true,
    featured: false,
    includes: [
      'Round-trip flight tickets',
      '4-star hotel accommodation',
      'Daily breakfast',
      'Bangkok city tour',
      'Coral Island tour with lunch',
      'Phi Phi Island tour by speedboat',
      'Safari World & Marine Park tickets',
      'All transfers and tours',
      'English speaking guide',
      'Travel insurance'
    ],
    excludes: [
      'Lunch and dinner (except mentioned)',
      'Optional tours',
      'Personal expenses',
      'Tips',
      'Visa on arrival fee'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bangkok',
        description: 'Arrive in Bangkok and transfer to hotel',
        activities: ['Airport pickup', 'Hotel check-in', 'Evening at leisure']
      },
      {
        day: 2,
        title: 'Bangkok City Temple Tour',
        description: 'Explore Bangkok\'s famous temples and landmarks',
        activities: ['Grand Palace visit', 'Wat Pho (Reclining Buddha)', 'Wat Arun (Temple of Dawn)', 'Chao Phraya river cruise', 'Evening free for street food']
      },
      {
        day: 3,
        title: 'Safari World & Transfer to Pattaya',
        description: 'Visit Safari World before heading to beach paradise',
        activities: ['Safari World Marine Park', 'Orangutan boxing show', 'Dolphin show', 'Transfer to Pattaya (3 hours)', 'Pattaya hotel check-in']
      },
      {
        day: 4,
        title: 'Coral Island Day Trip',
        description: 'Enjoy water sports and beach activities at Coral Island',
        activities: ['Speed boat to Coral Island', 'Beach relaxation', 'Parasailing (optional)', 'Banana boat ride', 'Underwater sea walking (optional)', 'Thai lunch included']
      },
      {
        day: 5,
        title: 'Transfer to Phuket',
        description: 'Fly to Phuket and enjoy evening at Patong Beach',
        activities: ['Flight to Phuket', 'Hotel check-in', 'Patong Beach visit', 'Bangla Road nightlife (optional)']
      },
      {
        day: 6,
        title: 'Phi Phi Island Tour',
        description: 'Speedboat tour to the famous Phi Phi Islands',
        activities: ['Maya Bay visit', 'Snorkeling at Phi Phi Leh', 'Monkey Beach', 'Viking Cave', 'Lunch on the island', 'Swimming and relaxation']
      },
      {
        day: 7,
        title: 'Phuket City & Free Day',
        description: 'Optional activities or beach relaxation',
        activities: ['Phuket Old Town tour', 'Big Buddha visit', 'Kata & Karon beach', 'Evening Phuket Fantasea show (optional)']
      },
      {
        day: 8,
        title: 'Departure from Phuket',
        description: 'Transfer to airport for return flight',
        activities: ['Hotel check-out', 'Last minute shopping', 'Airport transfer', 'Departure']
      }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800', caption: 'Phi Phi Islands' },
      { url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', caption: 'Grand Palace Bangkok' },
      { url: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800', caption: 'Phuket Beach' }
    ]
  },
  {
    title: 'Malaysia Truly Asia - KL & Langkawi',
    description: 'Experience the best of Malaysia with this perfect blend of city excitement and island paradise. Explore modern Kuala Lumpur with its iconic Petronas Towers and unwind in the tropical beauty of Langkawi island.',
    destination: 'Kuala Lumpur & Langkawi, Malaysia',
    duration: { days: 7, nights: 6 },
    price: 55000,
    category: 'Family',
    difficulty: 'Easy',
    maxGroupSize: 18,
    isForeign: true,
    featured: false,
    includes: [
      'Round-trip flight tickets',
      'Hotel accommodation (3-4 star)',
      'Daily breakfast',
      'KL city tour with Batu Caves',
      'Genting Highlands day trip',
      'Langkawi island hopping tour',
      'Langkawi cable car & sky bridge tickets',
      'All transfers in AC vehicle',
      'English speaking guide',
      'Travel insurance'
    ],
    excludes: [
      'Lunch and dinner',
      'Optional activities and entrance fees',
      'Personal expenses',
      'Tips and gratuities',
      'Visa fees (free for Bangladeshi passport)'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Kuala Lumpur',
        description: 'Welcome to Malaysia! Transfer to hotel and evening at leisure',
        activities: ['Airport pickup', 'Hotel check-in', 'Evening visit to KLCC', 'Petronas Twin Towers photo session']
      },
      {
        day: 2,
        title: 'KL City Tour & Batu Caves',
        description: 'Explore the highlights of Kuala Lumpur',
        activities: ['Batu Caves temple', 'King\'s Palace', 'National Mosque', 'Independence Square', 'KL Tower (optional)', 'Central Market shopping', 'Evening at Bukit Bintang']
      },
      {
        day: 3,
        title: 'Genting Highlands Excursion',
        description: 'Day trip to the cool highlands resort',
        activities: ['Genting Skyway cable car', 'Chin Swee Temple', 'Genting Premium Outlets', 'Indoor & outdoor theme park (optional)', 'Casino visit (optional)', 'Return to KL evening']
      },
      {
        day: 4,
        title: 'Flight to Langkawi',
        description: 'Transfer to tropical paradise Langkawi',
        activities: ['Morning flight to Langkawi', 'Beach hotel check-in', 'Pantai Cenang beach relaxation', 'Sunset watching', 'Evening at duty-free shops']
      },
      {
        day: 5,
        title: 'Island Hopping Adventure',
        description: 'Explore the beautiful islands around Langkawi',
        activities: ['Pregnant Maiden Lake (Dayang Bunting)', 'Lake of Pregnant Maiden swim', 'Beras Basah Island', 'Eagle feeding at Singa Besar', 'Beach BBQ lunch', 'Snorkeling']
      },
      {
        day: 6,
        title: 'Langkawi Cable Car & Nature',
        description: 'Experience breathtaking views from the sky',
        activities: ['Langkawi Cable Car ride', 'Sky Bridge walk', 'Oriental Village', 'Eagle Square visit', 'Underwater World (optional)', 'Mangrove kayaking (optional)', 'Sunset cruise (optional)']
      },
      {
        day: 7,
        title: 'Departure',
        description: 'Last minute shopping and departure',
        activities: ['Duty-free shopping', 'Hotel check-out', 'Airport transfer', 'Flight back home']
      }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800', caption: 'Petronas Towers KL' },
      { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', caption: 'Langkawi Beach' },
      { url: 'https://images.unsplash.com/photo-1590757376778-b8d5109d4db1?w=800', caption: 'Batu Caves' }
    ]
  }
];

const seedForeignTours = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/roaming-sonic');
    console.log('MongoDB connected');

    // Find admin user
    const admin = await User.findOne({ userType: 'admin' });
    
    if (!admin) {
      console.error('Admin user not found. Please run createAdmin.js first');
      process.exit(1);
    }

    console.log('Admin user found:', admin.email);

    // Delete existing foreign tours (optional)
    await TourPackage.deleteMany({ isForeign: true });
    console.log('Existing foreign tours deleted');

    // Add createdBy field to each tour
    const toursWithCreator = foreignTours.map(tour => ({
      ...tour,
      createdBy: admin._id
    }));

    // Insert tours
    const result = await TourPackage.insertMany(toursWithCreator);
    console.log(`✅ Successfully created ${result.length} foreign tour packages!`);
    
    result.forEach(tour => {
      console.log(`   📍 ${tour.title} - ${tour.destination} - ৳${tour.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding foreign tours:', error);
    process.exit(1);
  }
};

seedForeignTours();
