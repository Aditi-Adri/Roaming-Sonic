const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roaming-sonic')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const seedGuides = async () => {
  try {
    // Bangladesh guide data
    const guidesData = [
      {
        name: "Rakibul Hasan",
        email: "guide1@gmail.com",
        password: "123456",
        phone: "01712345671",
        userType: "guide",
        bio: "Experienced tour guide specializing in historical sites and cultural tours across Bangladesh. Passionate about sharing the rich heritage of our country with travelers.",
        experience: 8,
        languages: ["Bengali", "English", "Hindi"],
        specializations: ["Historical Tours", "Cultural Heritage", "Architecture", "Old Dhaka Tours"],
        divisions: ["Dhaka", "Chittagong", "Sylhet"],
        address: {
          city: "Dhaka",
          district: "Dhaka",
          division: "Dhaka"
        },
        certifications: [
          {
            name: "Professional Tour Guide License",
            issuer: "Bangladesh Tourism Board",
            date: new Date("2018-03-15")
          },
          {
            name: "Cultural Heritage Guide",
            issuer: "Ministry of Tourism",
            date: new Date("2019-06-20")
          }
        ],
        hourlyRate: 800,
        availability: true,
        rating: 4.8,
        totalReviews: 156,
        isActive: true,
        isVerified: true
      },
      {
        name: "Fatima Rahman",
        email: "guide2@gmail.com",
        password: "123456",
        phone: "01812345672",
        userType: "guide",
        bio: "Nature enthusiast and adventure guide with expertise in coastal and beach destinations. Specialized in Cox's Bazar, Saint Martin, and Kuakata tours.",
        experience: 6,
        languages: ["Bengali", "English", "Arabic"],
        specializations: ["Beach Tours", "Adventure Tours", "Nature & Wildlife", "Photography Tours"],
        divisions: ["Chittagong", "Barisal"],
        address: {
          city: "Cox's Bazar",
          district: "Cox's Bazar",
          division: "Chittagong"
        },
        certifications: [
          {
            name: "Certified Tour Guide",
            issuer: "Bangladesh Tourism Board",
            date: new Date("2019-08-10")
          },
          {
            name: "First Aid & Safety",
            issuer: "Red Crescent Bangladesh",
            date: new Date("2020-02-15")
          }
        ],
        hourlyRate: 700,
        availability: true,
        rating: 4.7,
        totalReviews: 98,
        isActive: true,
        isVerified: true
      },
      {
        name: "Anisur Rahman",
        email: "guide3@gmail.com",
        password: "123456",
        phone: "01912345673",
        userType: "guide",
        bio: "Tea garden expert and hill tract specialist. Offering unforgettable experiences in Sylhet's tea estates and indigenous communities of Rangamati.",
        experience: 10,
        languages: ["Bengali", "English", "Sylheti", "Chakma"],
        specializations: ["Tea Garden Tours", "Hill Tracts", "Tribal Culture", "Eco-Tourism"],
        divisions: ["Sylhet", "Chittagong"],
        address: {
          city: "Sylhet",
          district: "Sylhet",
          division: "Sylhet"
        },
        certifications: [
          {
            name: "Master Tour Guide License",
            issuer: "Bangladesh Tourism Board",
            date: new Date("2016-05-20")
          },
          {
            name: "Eco-Tourism Specialist",
            issuer: "International Ecotourism Society",
            date: new Date("2017-11-10")
          }
        ],
        hourlyRate: 900,
        availability: true,
        rating: 4.9,
        totalReviews: 203,
        isActive: true,
        isVerified: true
      },
      {
        name: "Nasrin Akter",
        email: "guide4@gmail.com",
        password: "123456",
        phone: "01612345674",
        userType: "guide",
        bio: "Religious tourism specialist with deep knowledge of mosques, temples, and spiritual sites. Expert in organizing pilgrimage tours across Bangladesh.",
        experience: 7,
        languages: ["Bengali", "English", "Urdu", "Arabic"],
        specializations: ["Religious Tours", "Spiritual Sites", "Mosque Tours", "Temple Tours"],
        divisions: ["Dhaka", "Rajshahi", "Khulna"],
        address: {
          city: "Dhaka",
          district: "Dhaka",
          division: "Dhaka"
        },
        certifications: [
          {
            name: "Professional Tour Guide",
            issuer: "Bangladesh Tourism Board",
            date: new Date("2018-09-12")
          },
          {
            name: "Religious Heritage Guide",
            issuer: "Ministry of Religious Affairs",
            date: new Date("2019-04-08")
          }
        ],
        hourlyRate: 750,
        availability: true,
        rating: 4.6,
        totalReviews: 127,
        isActive: true,
        isVerified: true
      },
      {
        name: "Mahmud Hossain",
        email: "guide5@gmail.com",
        password: "123456",
        phone: "01712345675",
        userType: "guide",
        bio: "Sundarbans expert and wildlife enthusiast. Leading expeditions into the world's largest mangrove forest for over 9 years. Royal Bengal Tiger tracking specialist.",
        experience: 9,
        languages: ["Bengali", "English", "Hindi"],
        specializations: ["Sundarbans Tours", "Wildlife Tours", "Mangrove Ecology", "Bird Watching"],
        divisions: ["Khulna", "Barisal"],
        address: {
          city: "Khulna",
          district: "Khulna",
          division: "Khulna"
        },
        certifications: [
          {
            name: "Wildlife Guide License",
            issuer: "Bangladesh Forest Department",
            date: new Date("2017-01-15")
          },
          {
            name: "Sundarbans Specialist",
            issuer: "Bangladesh Tourism Board",
            date: new Date("2017-06-20")
          }
        ],
        hourlyRate: 850,
        availability: true,
        rating: 4.8,
        totalReviews: 174,
        isActive: true,
        isVerified: true
      },
      {
        name: "Sharmin Islam",
        email: "guide6@gmail.com",
        password: "123456",
        phone: "01812345676",
        userType: "guide",
        bio: "Food and culture tour specialist. Exploring Bangladesh through its diverse culinary traditions and local food culture. Perfect for food lovers!",
        experience: 5,
        languages: ["Bengali", "English"],
        specializations: ["Food Tours", "Cultural Tours", "Local Cuisine", "Street Food"],
        divisions: ["Dhaka", "Chittagong"],
        address: {
          city: "Dhaka",
          district: "Dhaka",
          division: "Dhaka"
        },
        certifications: [
          {
            name: "Certified Tour Guide",
            issuer: "Bangladesh Tourism Board",
            date: new Date("2020-02-10")
          },
          {
            name: "Culinary Tourism Specialist",
            issuer: "World Food Travel Association",
            date: new Date("2021-07-15")
          }
        ],
        hourlyRate: 650,
        availability: true,
        rating: 4.7,
        totalReviews: 89,
        isActive: true,
        isVerified: true
      },
      {
        name: "Kamal Uddin",
        email: "guide7@gmail.com",
        password: "123456",
        phone: "01912345677",
        userType: "guide",
        bio: "Archaeological sites and ancient history expert. Specialized in guiding tours to Mahasthangarh, Paharpur, and other historical excavation sites.",
        experience: 12,
        languages: ["Bengali", "English", "French"],
        specializations: ["Archaeological Sites", "Ancient History", "Museum Tours", "UNESCO Sites"],
        divisions: ["Rajshahi", "Rangpur", "Dhaka"],
        address: {
          city: "Bogra",
          district: "Bogra",
          division: "Rajshahi"
        },
        certifications: [
          {
            name: "Master Guide License",
            issuer: "Bangladesh Tourism Board",
            date: new Date("2015-04-22")
          },
          {
            name: "Archaeological Heritage Guide",
            issuer: "Department of Archaeology",
            date: new Date("2016-09-18")
          }
        ],
        hourlyRate: 950,
        availability: true,
        rating: 4.9,
        totalReviews: 245,
        isActive: true,
        isVerified: true
      },
      {
        name: "Sultana Begum",
        email: "guide8@gmail.com",
        password: "123456",
        phone: "01612345678",
        userType: "guide",
        bio: "Family-friendly tour specialist with expertise in creating memorable experiences for families with children. Patient, caring, and fun!",
        experience: 4,
        languages: ["Bengali", "English"],
        specializations: ["Family Tours", "Kid-Friendly Tours", "Educational Tours", "Theme Parks"],
        divisions: ["Dhaka", "Chittagong", "Sylhet"],
        address: {
          city: "Dhaka",
          district: "Dhaka",
          division: "Dhaka"
        },
        certifications: [
          {
            name: "Professional Tour Guide",
            issuer: "Bangladesh Tourism Board",
            date: new Date("2021-05-15")
          },
          {
            name: "Child Safety & Care",
            issuer: "Save the Children Bangladesh",
            date: new Date("2021-08-20")
          }
        ],
        hourlyRate: 600,
        availability: true,
        rating: 4.8,
        totalReviews: 72,
        isActive: true,
        isVerified: true
      },
      {
        name: "Rezaul Karim",
        email: "guide9@gmail.com",
        password: "123456",
        phone: "01712345679",
        userType: "guide",
        bio: "Adventure sports and trekking guide. Specializing in hiking expeditions, water sports, and adventure activities in hill districts and coastal areas.",
        experience: 6,
        languages: ["Bengali", "English", "Hindi"],
        specializations: ["Adventure Tours", "Trekking", "Water Sports", "Rock Climbing"],
        divisions: ["Chittagong", "Sylhet", "Rangpur"],
        address: {
          city: "Bandarban",
          district: "Bandarban",
          division: "Chittagong"
        },
        certifications: [
          {
            name: "Adventure Guide License",
            issuer: "Bangladesh Tourism Board",
            date: new Date("2019-03-10")
          },
          {
            name: "Mountain Safety Expert",
            issuer: "Bangladesh Mountaineering Federation",
            date: new Date("2019-11-25")
          }
        ],
        hourlyRate: 800,
        availability: true,
        rating: 4.7,
        totalReviews: 115,
        isActive: true,
        isVerified: true
      },
      {
        name: "Ayesha Siddiqua",
        email: "guide10@gmail.com",
        password: "123456",
        phone: "01812345680",
        userType: "guide",
        bio: "Photography tour specialist and visual storytelling expert. Helping travelers capture the beauty of Bangladesh through their lens.",
        experience: 5,
        languages: ["Bengali", "English", "Japanese"],
        specializations: ["Photography Tours", "Landscape Tours", "Sunrise/Sunset Tours", "Street Photography"],
        divisions: ["Dhaka", "Barisal", "Chittagong"],
        address: {
          city: "Dhaka",
          district: "Dhaka",
          division: "Dhaka"
        },
        certifications: [
          {
            name: "Certified Tour Guide",
            issuer: "Bangladesh Tourism Board",
            date: new Date("2020-06-18")
          },
          {
            name: "Professional Photography Guide",
            issuer: "Photography Society of Bangladesh",
            date: new Date("2021-03-12")
          }
        ],
        hourlyRate: 750,
        availability: true,
        rating: 4.9,
        totalReviews: 142,
        isActive: true,
        isVerified: true
      }
    ];

    // Check if guides already exist and clear them (optional)
    const existingGuides = await User.find({ 
      email: { $in: guidesData.map(g => g.email) } 
    });
    
    if (existingGuides.length > 0) {
      console.log(`Found ${existingGuides.length} existing guide(s) with these emails`);
      await User.deleteMany({ 
        email: { $in: guidesData.map(g => g.email) } 
      });
      console.log('Cleared existing guides');
    }

    // Create guides
    const createdGuides = [];
    for (const guideData of guidesData) {
      const guide = new User(guideData);
      await guide.save();
      createdGuides.push(guide);
    }

    console.log(`✅ Successfully added ${createdGuides.length} guides to the database`);
    
    // Display summary
    console.log('\n📋 Guide Summary:');
    createdGuides.forEach((guide, index) => {
      console.log(`${index + 1}. ${guide.name} (${guide.email})`);
      console.log(`   Specializations: ${guide.specializations.join(', ')}`);
      console.log(`   Experience: ${guide.experience} years | Rate: ৳${guide.hourlyRate}/hour | Rating: ${guide.rating}⭐`);
      console.log(`   Divisions: ${guide.divisions.join(', ')}`);
      console.log('');
    });

    console.log('✨ All guides have been successfully seeded!');
    console.log('\n🔑 Login credentials:');
    console.log('Email: guide1@gmail.com to guide10@gmail.com');
    console.log('Password: 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding guides:', error);
    process.exit(1);
  }
};

seedGuides();
