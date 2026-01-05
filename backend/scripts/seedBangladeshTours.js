const mongoose = require('mongoose');
const TourPackage = require('../models/TourPackage');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const tours = [
  {
    title: "Sundarbans Mangrove Adventure",
    description: "Explore the world's largest mangrove forest and UNESCO World Heritage Site. Experience the thrill of spotting Royal Bengal Tigers, spotted deer, crocodiles, and diverse bird species. Navigate through the intricate network of waterways and discover the unique ecosystem of the Sundarbans.",
    destination: "Sundarbans, Khulna",
    duration: { days: 3, nights: 2 },
    price: 8500,
    maxGroupSize: 15,
    category: "Wildlife",
    difficulty: "Moderate",
    includes: [
      "Boat transportation",
      "Accommodation on boat/resort",
      "All meals (breakfast, lunch, dinner)",
      "Professional guide",
      "Forest entry permits",
      "Wildlife watching tours",
      "Binoculars"
    ],
    excludes: [
      "Personal expenses",
      "Travel insurance",
      "Tips for guides",
      "Extra snacks and beverages"
    ],
    itinerary: [
      {
        day: 1,
        title: "Departure to Sundarbans",
        description: "Journey from Dhaka to Mongla port and board the boat",
        activities: ["Travel to Mongla", "Board boat", "Lunch on boat", "Evening river cruise", "Sunset viewing"]
      },
      {
        day: 2,
        title: "Deep Forest Exploration",
        description: "Full day exploration of the Sundarbans",
        activities: ["Early morning tiger tracking", "Visit Kachikhali watchtower", "Explore narrow canals", "Bird watching", "Visit Hiron Point"]
      },
      {
        day: 3,
        title: "Return Journey",
        description: "Morning forest walk and return to Dhaka",
        activities: ["Morning nature walk", "Breakfast", "Return to Mongla", "Journey back to Dhaka"]
      }
    ],
    featured: true,
    availableDates: [
      { startDate: new Date('2026-02-15'), endDate: new Date('2026-02-17'), availableSlots: 15 },
      { startDate: new Date('2026-03-10'), endDate: new Date('2026-03-12'), availableSlots: 15 },
      { startDate: new Date('2026-04-05'), endDate: new Date('2026-04-07'), availableSlots: 15 }
    ]
  },
  {
    title: "Cox's Bazar Beach Paradise",
    description: "Visit the world's longest natural sea beach stretching 120 km. Enjoy pristine sandy beaches, stunning sunsets, fresh seafood, and vibrant beach activities. Experience the beauty of Inani Beach, Himchari, and the coral island of Saint Martin.",
    destination: "Cox's Bazar, Chittagong",
    duration: { days: 4, nights: 3 },
    price: 12000,
    maxGroupSize: 20,
    category: "Beach",
    difficulty: "Easy",
    includes: [
      "AC bus transportation",
      "3-star hotel accommodation",
      "Daily breakfast",
      "Beach resort entry",
      "Speed boat to Saint Martin",
      "Professional tour guide",
      "Sightseeing tours"
    ],
    excludes: [
      "Lunch and dinner",
      "Water sports activities",
      "Personal shopping",
      "Travel insurance"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at Cox's Bazar",
        description: "Travel to Cox's Bazar and hotel check-in",
        activities: ["Departure from Dhaka", "Hotel check-in", "Evening beach walk", "Sunset viewing", "Beach BBQ dinner"]
      },
      {
        day: 2,
        title: "Inani Beach & Himchari",
        description: "Explore nearby attractions",
        activities: ["Visit Himchari waterfall", "Inani Beach visit", "Marine Drive journey", "Photo opportunities", "Local seafood lunch"]
      },
      {
        day: 3,
        title: "Saint Martin Island",
        description: "Day trip to coral island",
        activities: ["Early morning boat to Saint Martin", "Island exploration", "Coral viewing", "Fresh coconut", "Return evening"]
      },
      {
        day: 4,
        title: "Departure",
        description: "Morning beach time and return",
        activities: ["Morning beach walk", "Shopping for souvenirs", "Check-out", "Return to Dhaka"]
      }
    ],
    featured: true,
    availableDates: [
      { startDate: new Date('2026-02-20'), endDate: new Date('2026-02-23'), availableSlots: 20 },
      { startDate: new Date('2026-03-15'), endDate: new Date('2026-03-18'), availableSlots: 20 }
    ]
  },
  {
    title: "Sajek Valley Cloud Paradise",
    description: "Experience the 'Queen of Hills' with breathtaking views of clouds, mountains, and indigenous villages. Sajek Valley offers spectacular sunrise and sunset views, local Chakma culture, and serene natural beauty away from city chaos.",
    destination: "Sajek Valley, Rangamati",
    duration: { days: 2, nights: 1 },
    price: 6500,
    maxGroupSize: 18,
    category: "Adventure",
    difficulty: "Moderate",
    includes: [
      "Jeep transportation from Khagrachhari",
      "Resort accommodation",
      "All meals",
      "Bonfire night",
      "Local guide",
      "Village tour"
    ],
    excludes: [
      "Transportation to Khagrachhari",
      "Personal expenses",
      "Photography charges at tribal villages"
    ],
    itinerary: [
      {
        day: 1,
        title: "Journey to Sajek",
        description: "Adventure drive through hills",
        activities: ["Meet at Khagrachhari", "Jeep ride to Sajek", "Check-in at resort", "Evening helipad visit", "Sunset viewing", "Bonfire night"]
      },
      {
        day: 2,
        title: "Sunrise & Return",
        description: "Early morning and departure",
        activities: ["Sunrise at Konglak Hill", "Breakfast", "Visit Ruilui Para", "Tribal village tour", "Return journey"]
      }
    ],
    featured: true,
    availableDates: [
      { startDate: new Date('2026-02-08'), endDate: new Date('2026-02-09'), availableSlots: 18 },
      { startDate: new Date('2026-03-22'), endDate: new Date('2026-03-23'), availableSlots: 18 }
    ]
  },
  {
    title: "Srimangal Tea Garden Retreat",
    description: "Explore the tea capital of Bangladesh with lush green tea gardens, Lawachara rainforest, and the famous seven-layer tea. Experience the tranquility of nature, spot rare wildlife, and enjoy authentic tea garden hospitality.",
    destination: "Srimangal, Sylhet",
    duration: { days: 2, nights: 1 },
    price: 5500,
    maxGroupSize: 20,
    category: "Cultural",
    difficulty: "Easy",
    includes: [
      "Train/bus transportation",
      "Tea resort accommodation",
      "All meals",
      "Lawachara National Park entry",
      "Tea garden tour",
      "Seven-layer tea tasting",
      "Guide service"
    ],
    excludes: [
      "Personal shopping",
      "Extra beverages",
      "Travel insurance"
    ],
    itinerary: [
      {
        day: 1,
        title: "Tea Garden Experience",
        description: "Arrival and tea garden exploration",
        activities: ["Arrival at Srimangal", "Check-in", "Tea garden walking tour", "Visit tea factory", "Seven-layer tea at Nilkantha", "Madhabpur Lake sunset"]
      },
      {
        day: 2,
        title: "Rainforest Adventure",
        description: "Wildlife and return",
        activities: ["Early morning Lawachara forest walk", "Spot Hoolock Gibbons", "Tribal village visit", "Breakfast", "Return journey"]
      }
    ],
    availableDates: [
      { startDate: new Date('2026-02-14'), endDate: new Date('2026-02-15'), availableSlots: 20 },
      { startDate: new Date('2026-03-07'), endDate: new Date('2026-03-08'), availableSlots: 20 }
    ]
  },
  {
    title: "Ratargul Swamp Forest Expedition",
    description: "Discover Bangladesh's only freshwater swamp forest. Navigate through submerged trees by boat, experience unique biodiversity, and enjoy the serene water world. Best visited during monsoon when the forest is beautifully flooded.",
    destination: "Ratargul, Sylhet",
    duration: { days: 2, nights: 1 },
    price: 4800,
    maxGroupSize: 16,
    category: "Wildlife",
    difficulty: "Easy",
    includes: [
      "AC bus transportation",
      "Hotel accommodation in Sylhet",
      "Breakfast and dinner",
      "Boat ride in Ratargul",
      "Jaflong visit",
      "Guide service"
    ],
    excludes: [
      "Lunch",
      "Personal expenses",
      "Camera fees"
    ],
    itinerary: [
      {
        day: 1,
        title: "Sylhet Arrival",
        description: "Journey and local sightseeing",
        activities: ["Departure from Dhaka", "Arrive Sylhet", "Ratargul boat tour", "Floating through submerged forest", "Evening at Jaflong", "Stone collection"]
      },
      {
        day: 2,
        title: "Return Journey",
        description: "Morning sightseeing and departure",
        activities: ["Visit Hazrat Shah Jalal Mazar", "Breakfast", "Shopping at local markets", "Return to Dhaka"]
      }
    ],
    availableDates: [
      { startDate: new Date('2026-07-10'), endDate: new Date('2026-07-11'), availableSlots: 16 },
      { startDate: new Date('2026-08-15'), endDate: new Date('2026-08-16'), availableSlots: 16 }
    ]
  },
  {
    title: "Rangamati Lake District Discovery",
    description: "Experience the 'Lake City' with its hanging bridge, Kaptai Lake, Buddhist temples, and indigenous culture. Enjoy boat rides, visit tribal villages, and explore the peaceful hill district with stunning water views.",
    destination: "Rangamati, Chittagong Hill Tracts",
    duration: { days: 2, nights: 1 },
    price: 5800,
    maxGroupSize: 20,
    category: "Cultural",
    difficulty: "Easy",
    includes: [
      "Bus transportation",
      "Lake view resort",
      "All meals",
      "Speed boat tours",
      "Hanging bridge visit",
      "Tribal museum entry",
      "Local guide"
    ],
    excludes: [
      "Personal shopping",
      "Additional boat rides",
      "Photography charges"
    ],
    itinerary: [
      {
        day: 1,
        title: "Lake Exploration",
        description: "Arrival and lake activities",
        activities: ["Arrival at Rangamati", "Hanging bridge visit", "Speed boat to Shuvolong", "Visit Buddhist temple", "Tribal handicraft market", "Sunset at lake"]
      },
      {
        day: 2,
        title: "Cultural Experience",
        description: "Tribal culture and departure",
        activities: ["Visit Tribal Cultural Institute", "Chakma village tour", "Kaptai Dam viewing", "Lunch", "Return journey"]
      }
    ],
    availableDates: [
      { startDate: new Date('2026-02-28'), endDate: new Date('2026-03-01'), availableSlots: 20 },
      { startDate: new Date('2026-03-21'), endDate: new Date('2026-03-22'), availableSlots: 20 }
    ]
  },
  {
    title: "Paharpur Buddhist Vihara Heritage Tour",
    description: "Visit the UNESCO World Heritage Site and one of the largest Buddhist monasteries south of the Himalayas. Explore ancient archaeological ruins, learn about Buddhist heritage, and discover the magnificent terracotta sculptures.",
    destination: "Paharpur, Naogaon",
    duration: { days: 2, nights: 1 },
    price: 4500,
    maxGroupSize: 25,
    category: "Historical",
    difficulty: "Easy",
    includes: [
      "AC bus transportation",
      "Hotel accommodation",
      "Breakfast and dinner",
      "Site entry fees",
      "Professional guide",
      "Museum visit"
    ],
    excludes: [
      "Lunch",
      "Personal expenses",
      "Souvenirs"
    ],
    itinerary: [
      {
        day: 1,
        title: "Historical Exploration",
        description: "Journey and site visit",
        activities: ["Departure from Dhaka", "Arrival at Paharpur", "Explore Somapura Mahavihara", "Museum visit", "Terracotta art viewing", "Evening free time"]
      },
      {
        day: 2,
        title: "Nearby Sites",
        description: "Additional heritage sites",
        activities: ["Visit nearby archaeological sites", "Local village tour", "Traditional lunch", "Shopping for handicrafts", "Return to Dhaka"]
      }
    ],
    availableDates: [
      { startDate: new Date('2026-02-06'), endDate: new Date('2026-02-07'), availableSlots: 25 },
      { startDate: new Date('2026-03-13'), endDate: new Date('2026-03-14'), availableSlots: 25 }
    ]
  },
  {
    title: "Kuakata Panoramic Sea Beach",
    description: "Experience the rare beauty of both sunrise and sunset from the same beach. Known as 'Daughter of the Sea', Kuakata offers pristine beaches, Buddhist temples, Rakhine villages, and fresh seafood in a peaceful setting.",
    destination: "Kuakata, Patuakhali",
    duration: { days: 3, nights: 2 },
    price: 7500,
    maxGroupSize: 20,
    category: "Beach",
    difficulty: "Easy",
    includes: [
      "AC bus transportation",
      "Beach resort accommodation",
      "Daily breakfast",
      "Beach activities",
      "Keranipara Buddhist temple visit",
      "Rakhine village tour",
      "Guide service"
    ],
    excludes: [
      "Lunch and dinner",
      "Water sports",
      "Personal shopping",
      "Travel insurance"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Sunset",
        description: "Journey to Kuakata",
        activities: ["Departure from Dhaka", "Arrive Kuakata", "Check-in", "Beach walk", "Sunset viewing", "Fresh seafood dinner"]
      },
      {
        day: 2,
        title: "Full Day Exploration",
        description: "Cultural and natural sights",
        activities: ["Sunrise viewing", "Visit Keranipara temple", "Rakhine village tour", "Gangamati reserved forest", "Beach activities", "Evening bonfire"]
      },
      {
        day: 3,
        title: "Departure",
        description: "Morning beach time and return",
        activities: ["Morning beach walk", "Breakfast", "Shopping at local market", "Return to Dhaka"]
      }
    ],
    availableDates: [
      { startDate: new Date('2026-02-12'), endDate: new Date('2026-02-14'), availableSlots: 20 },
      { startDate: new Date('2026-03-19'), endDate: new Date('2026-03-21'), availableSlots: 20 }
    ]
  },
  {
    title: "Dhaka Heritage Walk",
    description: "Discover the rich history of Old Dhaka with Mughal-era monuments, traditional markets, and cultural landmarks. Visit Lalbagh Fort, Ahsan Manzil, Sadarghat, and experience the vibrant chaos of centuries-old bazaars.",
    destination: "Old Dhaka, Dhaka",
    duration: { days: 1, nights: 0 },
    price: 1500,
    maxGroupSize: 30,
    category: "Historical",
    difficulty: "Easy",
    includes: [
      "Walking tour guide",
      "All entry fees",
      "Traditional lunch",
      "Rickshaw rides",
      "Drinking water",
      "Photography guide"
    ],
    excludes: [
      "Personal shopping",
      "Extra food and drinks",
      "Gratuities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Old Dhaka Discovery",
        description: "Full day heritage walk",
        activities: [
          "Visit Lalbagh Fort",
          "Ahsan Manzil Pink Palace",
          "Armenian Church",
          "Sadarghat river port",
          "Shakhari Bazar (Hindu street)",
          "Tara Masjid",
          "Traditional Biryani lunch",
          "Star Mosque visit",
          "Chawk Bazaar shopping"
        ]
      }
    ],
    availableDates: [
      { startDate: new Date('2026-02-01'), endDate: new Date('2026-02-01'), availableSlots: 30 },
      { startDate: new Date('2026-02-15'), endDate: new Date('2026-02-15'), availableSlots: 30 },
      { startDate: new Date('2026-03-01'), endDate: new Date('2026-03-01'), availableSlots: 30 },
      { startDate: new Date('2026-03-15'), endDate: new Date('2026-03-15'), availableSlots: 30 }
    ]
  },
  {
    title: "Bandarban Hill Hiking Expedition",
    description: "Challenge yourself with Bangladesh's highest peaks and most scenic hill tracts. Trek through tribal villages, visit golden temples, experience Marma and Mro culture, and enjoy panoramic mountain views from Nilgiri and Nilachal.",
    destination: "Bandarban, Chittagong Hill Tracts",
    duration: { days: 3, nights: 2 },
    price: 9500,
    maxGroupSize: 15,
    category: "Adventure",
    difficulty: "Challenging",
    includes: [
      "Jeep/Chander Gari transportation",
      "Hilltop resort accommodation",
      "All meals",
      "Trekking guide",
      "Entry permits",
      "Tribal village visits",
      "Safety equipment"
    ],
    excludes: [
      "Personal hiking gear",
      "Medical expenses",
      "Travel insurance",
      "Tips for local guides"
    ],
    itinerary: [
      {
        day: 1,
        title: "Nilgiri Hills",
        description: "Arrival and hill exploration",
        activities: ["Departure from Dhaka", "Arrive Bandarban", "Visit Golden Temple", "Jeep ride to Nilgiri", "Cloud touching experience", "Sunset viewing"]
      },
      {
        day: 2,
        title: "Tribal Trek",
        description: "Deep hill trekking",
        activities: ["Trek to Chimbuk Hill", "Visit Bom village", "Mro tribal interaction", "Traditional lunch", "Nilachal viewpoint", "Bonfire night"]
      },
      {
        day: 3,
        title: "Return Journey",
        description: "Final sights and departure",
        activities: ["Shoilo Propat waterfall", "Meghla tourism complex", "Shopping for tribal handicrafts", "Return to Dhaka"]
      }
    ],
    featured: true,
    availableDates: [
      { startDate: new Date('2026-02-05'), endDate: new Date('2026-02-07'), availableSlots: 15 },
      { startDate: new Date('2026-03-12'), endDate: new Date('2026-03-14'), availableSlots: 15 }
    ]
  }
];

async function seedTours() {
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

    // Clear existing tours
    await TourPackage.deleteMany({});
    console.log('Cleared existing tours');

    // Add createdBy field to all tours
    const toursWithCreator = tours.map(tour => ({
      ...tour,
      createdBy: admin._id
    }));

    // Insert tours
    const createdTours = await TourPackage.insertMany(toursWithCreator);
    console.log(`✅ Successfully created ${createdTours.length} Bangladesh tours!`);
    
    // Display tour summary
    createdTours.forEach((tour, index) => {
      console.log(`${index + 1}. ${tour.title} - ${tour.destination} (${tour.duration.days}D/${tour.duration.nights}N) - BDT ${tour.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding tours:', error);
    process.exit(1);
  }
}

seedTours();
