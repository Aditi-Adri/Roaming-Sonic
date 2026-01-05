const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roaming-sonic')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const seedHotels = async () => {
  try {
    // Find the hotel owner
    const hotelOwner = await User.findOne({ email: 'sps@gmail.com', userType: 'hotel_owner' });
    
    if (!hotelOwner) {
      console.error('Hotel owner not found with email: sps@gmail.com');
      console.log('Please make sure the hotel owner account exists');
      process.exit(1);
    }

    console.log(`Found hotel owner: ${hotelOwner.name} (${hotelOwner.email})`);

    // Bangladesh hotels data
    const hotelsData = [
      {
        name: "Pan Pacific Sonargaon Dhaka",
        description: "Experience luxury at its finest at Pan Pacific Sonargaon Dhaka, a five-star hotel located in the heart of Dhaka's diplomatic zone. With world-class amenities and exceptional service, this hotel offers a perfect blend of comfort and elegance.",
        owner: hotelOwner._id,
        category: 'hotel',
        address: {
          street: "107 Kazi Nazrul Islam Avenue",
          city: "Dhaka",
          district: "Dhaka",
          division: "Dhaka",
          zipCode: "1215"
        },
        location: {
          type: 'Point',
          coordinates: [90.4036, 23.7516]
        },
        phone: "+8802-8158001",
        email: "info@panpacific.com",
        website: "www.panpacific.com/dhaka",
        rooms: [
          {
            type: 'single',
            name: 'Superior Room',
            description: 'Comfortable single room with city view',
            pricePerNight: 8500,
            maxGuests: 1,
            totalRooms: 30,
            amenities: ['AC', 'WiFi', 'TV', 'Mini Bar', 'Room Service']
          },
          {
            type: 'double',
            name: 'Deluxe Room',
            description: 'Spacious double room with modern amenities',
            pricePerNight: 12000,
            maxGuests: 2,
            totalRooms: 40,
            amenities: ['AC', 'WiFi', 'TV', 'Mini Bar', 'Room Service', 'Work Desk']
          },
          {
            type: 'suite',
            name: 'Executive Suite',
            description: 'Luxurious suite with separate living area',
            pricePerNight: 25000,
            maxGuests: 4,
            totalRooms: 15,
            amenities: ['AC', 'WiFi', 'TV', 'Mini Bar', 'Room Service', 'Living Room', 'Kitchenette']
          }
        ],
        amenities: ['Free WiFi', '24/7 Reception', 'Concierge', 'Currency Exchange', 'Business Center'],
        facilities: {
          parking: true,
          wifi: true,
          restaurant: true,
          swimmingPool: true,
          gym: true,
          spa: true,
          conferenceRoom: true,
          airportShuttle: true,
          petFriendly: false,
          ac: true
        },
        checkInTime: '14:00',
        checkOutTime: '12:00',
        rating: 4.8,
        isActive: true,
        isVerified: true,
        verificationStatus: 'approved'
      },
      {
        name: "Hotel Sea Crown",
        description: "Located at the world's longest natural sea beach in Cox's Bazar, Hotel Sea Crown offers breathtaking ocean views and direct beach access. Perfect for beach lovers and families seeking a memorable coastal experience.",
        owner: hotelOwner._id,
        category: 'resort',
        address: {
          street: "Hotel Motel Zone, Beach Road",
          city: "Cox's Bazar",
          district: "Cox's Bazar",
          division: "Chittagong",
          zipCode: "4700"
        },
        location: {
          type: 'Point',
          coordinates: [91.9770, 21.4272]
        },
        phone: "+880341-63321",
        email: "info@seacrown.com.bd",
        website: "www.seacrown.com.bd",
        rooms: [
          {
            type: 'double',
            name: 'Sea View Room',
            description: 'Room with stunning sea view and balcony',
            pricePerNight: 6500,
            maxGuests: 2,
            totalRooms: 25,
            amenities: ['AC', 'WiFi', 'TV', 'Balcony', 'Sea View']
          },
          {
            type: 'family',
            name: 'Family Suite',
            description: 'Spacious suite perfect for families',
            pricePerNight: 10000,
            maxGuests: 4,
            totalRooms: 15,
            amenities: ['AC', 'WiFi', 'TV', 'Balcony', 'Sea View', 'Mini Fridge']
          },
          {
            type: 'deluxe',
            name: 'Ocean Front Deluxe',
            description: 'Premium room with direct beach access',
            pricePerNight: 8500,
            maxGuests: 3,
            totalRooms: 20,
            amenities: ['AC', 'WiFi', 'TV', 'Balcony', 'Beach Access', 'Mini Bar']
          }
        ],
        amenities: ['Beach Access', 'Free WiFi', 'Beach Chairs', 'Outdoor Dining', 'Tour Desk'],
        facilities: {
          parking: true,
          wifi: true,
          restaurant: true,
          swimmingPool: true,
          gym: false,
          spa: true,
          conferenceRoom: false,
          airportShuttle: true,
          petFriendly: false,
          ac: true
        },
        checkInTime: '13:00',
        checkOutTime: '11:00',
        rating: 4.5,
        isActive: true,
        isVerified: true,
        verificationStatus: 'approved'
      },
      {
        name: "Grand Sylhet Hotel & Resort",
        description: "Nestled in the tea capital of Bangladesh, Grand Sylhet Hotel & Resort offers a serene retreat surrounded by lush tea gardens and natural beauty. Experience the tranquility of Sylhet with modern comfort.",
        owner: hotelOwner._id,
        category: 'resort',
        address: {
          street: "Airport Road, Shibganj",
          city: "Sylhet",
          district: "Sylhet",
          division: "Sylhet",
          zipCode: "3100"
        },
        location: {
          type: 'Point',
          coordinates: [91.8711, 24.8949]
        },
        phone: "+880821-725000",
        email: "reservation@grandsylhet.com",
        website: "www.grandsylhet.com",
        rooms: [
          {
            type: 'single',
            name: 'Standard Room',
            description: 'Cozy room with garden view',
            pricePerNight: 4500,
            maxGuests: 1,
            totalRooms: 20,
            amenities: ['AC', 'WiFi', 'TV', 'Tea/Coffee Maker']
          },
          {
            type: 'double',
            name: 'Superior Room',
            description: 'Comfortable room with hill view',
            pricePerNight: 6000,
            maxGuests: 2,
            totalRooms: 30,
            amenities: ['AC', 'WiFi', 'TV', 'Mini Bar', 'Hill View']
          },
          {
            type: 'suite',
            name: 'Tea Garden Suite',
            description: 'Luxury suite overlooking tea gardens',
            pricePerNight: 12000,
            maxGuests: 4,
            totalRooms: 10,
            amenities: ['AC', 'WiFi', 'TV', 'Mini Bar', 'Garden View', 'Jacuzzi']
          }
        ],
        amenities: ['Tea Garden Tours', 'Free WiFi', 'Traditional Bengali Restaurant', 'Nature Walks'],
        facilities: {
          parking: true,
          wifi: true,
          restaurant: true,
          swimmingPool: true,
          gym: true,
          spa: false,
          conferenceRoom: true,
          airportShuttle: true,
          petFriendly: false,
          ac: true
        },
        checkInTime: '14:00',
        checkOutTime: '12:00',
        rating: 4.6,
        isActive: true,
        isVerified: true,
        verificationStatus: 'approved'
      },
      {
        name: "Hotel Agrabad",
        description: "Located in the commercial heart of Chittagong, Hotel Agrabad is the perfect choice for business and leisure travelers. Modern facilities and central location make it ideal for exploring the port city.",
        owner: hotelOwner._id,
        category: 'hotel',
        address: {
          street: "980/995 CDA Avenue, Agrabad Commercial Area",
          city: "Chittagong",
          district: "Chittagong",
          division: "Chittagong",
          zipCode: "4100"
        },
        location: {
          type: 'Point',
          coordinates: [91.8110, 22.3321]
        },
        phone: "+880312-521001",
        email: "contact@hotelagrabad.com",
        website: "www.hotelagrabad.com",
        rooms: [
          {
            type: 'single',
            name: 'Business Room',
            description: 'Comfortable room for business travelers',
            pricePerNight: 5000,
            maxGuests: 1,
            totalRooms: 25,
            amenities: ['AC', 'WiFi', 'TV', 'Work Desk', 'Printer Access']
          },
          {
            type: 'double',
            name: 'Executive Room',
            description: 'Spacious room with city view',
            pricePerNight: 7500,
            maxGuests: 2,
            totalRooms: 35,
            amenities: ['AC', 'WiFi', 'TV', 'Mini Bar', 'Work Desk']
          },
          {
            type: 'suite',
            name: 'Business Suite',
            description: 'Premium suite with meeting area',
            pricePerNight: 15000,
            maxGuests: 3,
            totalRooms: 12,
            amenities: ['AC', 'WiFi', 'TV', 'Mini Bar', 'Meeting Area', 'Kitchenette']
          }
        ],
        amenities: ['Business Center', 'Free WiFi', 'Meeting Rooms', 'Airport Transfer', 'Laundry'],
        facilities: {
          parking: true,
          wifi: true,
          restaurant: true,
          swimmingPool: false,
          gym: true,
          spa: false,
          conferenceRoom: true,
          airportShuttle: true,
          petFriendly: false,
          ac: true
        },
        checkInTime: '14:00',
        checkOutTime: '12:00',
        rating: 4.3,
        isActive: true,
        isVerified: true,
        verificationStatus: 'approved'
      },
      {
        name: "Radisson Blu Chattogram Bay View",
        description: "Experience breathtaking views of the Bay of Bengal from this premium hotel in Chittagong. The Radisson Blu offers international standards of hospitality with a touch of local warmth.",
        owner: hotelOwner._id,
        category: 'hotel',
        address: {
          street: "Bay View Circle, Patenga Beach Road",
          city: "Chittagong",
          district: "Chittagong",
          division: "Chittagong",
          zipCode: "4204"
        },
        location: {
          type: 'Point',
          coordinates: [91.7951, 22.2354]
        },
        phone: "+880312-505000",
        email: "info.chattogram@radissonblu.com",
        website: "www.radissonhotels.com/chattogram",
        rooms: [
          {
            type: 'double',
            name: 'Superior Bay View',
            description: 'Elegant room with bay view',
            pricePerNight: 9500,
            maxGuests: 2,
            totalRooms: 30,
            amenities: ['AC', 'WiFi', 'TV', 'Mini Bar', 'Bay View', 'Work Desk']
          },
          {
            type: 'deluxe',
            name: 'Deluxe Ocean Room',
            description: 'Luxurious room with ocean panorama',
            pricePerNight: 13000,
            maxGuests: 3,
            totalRooms: 25,
            amenities: ['AC', 'WiFi', 'TV', 'Mini Bar', 'Ocean View', 'Balcony']
          },
          {
            type: 'suite',
            name: 'Presidential Suite',
            description: 'Ultimate luxury with panoramic bay views',
            pricePerNight: 28000,
            maxGuests: 4,
            totalRooms: 8,
            amenities: ['AC', 'WiFi', 'TV', 'Full Bar', 'Ocean View', 'Living Room', 'Dining Area']
          }
        ],
        amenities: ['Infinity Pool', 'Free WiFi', 'International Cuisine', 'Spa Services', 'Valet Parking'],
        facilities: {
          parking: true,
          wifi: true,
          restaurant: true,
          swimmingPool: true,
          gym: true,
          spa: true,
          conferenceRoom: true,
          airportShuttle: true,
          petFriendly: true,
          ac: true
        },
        checkInTime: '15:00',
        checkOutTime: '12:00',
        rating: 4.9,
        isActive: true,
        isVerified: true,
        verificationStatus: 'approved'
      },
      {
        name: "Hotel Castle Savar",
        description: "A peaceful retreat just outside Dhaka, Hotel Castle Savar offers a perfect escape from city life while remaining conveniently close to the capital. Ideal for weekend getaways and family occasions.",
        owner: hotelOwner._id,
        category: 'resort',
        address: {
          street: "Nabinagar, Savar Road",
          city: "Savar",
          district: "Dhaka",
          division: "Dhaka",
          zipCode: "1340"
        },
        location: {
          type: 'Point',
          coordinates: [90.2584, 23.8465]
        },
        phone: "+8802-7740081",
        email: "info@castlesavar.com",
        website: "www.castlesavar.com",
        rooms: [
          {
            type: 'double',
            name: 'Garden View Room',
            description: 'Peaceful room overlooking gardens',
            pricePerNight: 5500,
            maxGuests: 2,
            totalRooms: 35,
            amenities: ['AC', 'WiFi', 'TV', 'Garden View']
          },
          {
            type: 'family',
            name: 'Family Room',
            description: 'Spacious room for families',
            pricePerNight: 8500,
            maxGuests: 4,
            totalRooms: 20,
            amenities: ['AC', 'WiFi', 'TV', 'Mini Fridge', 'Extra Bed']
          },
          {
            type: 'deluxe',
            name: 'Pool View Deluxe',
            description: 'Premium room with pool access',
            pricePerNight: 7000,
            maxGuests: 2,
            totalRooms: 15,
            amenities: ['AC', 'WiFi', 'TV', 'Pool View', 'Balcony']
          }
        ],
        amenities: ['Swimming Pool', 'Free Parking', 'Garden', 'Playground', 'BBQ Area'],
        facilities: {
          parking: true,
          wifi: true,
          restaurant: true,
          swimmingPool: true,
          gym: false,
          spa: false,
          conferenceRoom: true,
          airportShuttle: false,
          petFriendly: true,
          ac: true
        },
        checkInTime: '13:00',
        checkOutTime: '11:00',
        rating: 4.2,
        isActive: true,
        isVerified: true,
        verificationStatus: 'approved'
      },
      {
        name: "Mermaid Beach Resort",
        description: "An exclusive beachfront resort in Cox's Bazar offering luxury cottages and unparalleled hospitality. Experience the pristine beauty of Bangladesh's coastline with premium amenities and personalized service.",
        owner: hotelOwner._id,
        category: 'resort',
        address: {
          street: "Marine Drive Road, Kalatali",
          city: "Cox's Bazar",
          district: "Cox's Bazar",
          division: "Chittagong",
          zipCode: "4700"
        },
        location: {
          type: 'Point',
          coordinates: [91.9812, 21.4382]
        },
        phone: "+880341-64300",
        email: "reservation@mermaidresort.com.bd",
        website: "www.mermaidresort.com.bd",
        rooms: [
          {
            type: 'double',
            name: 'Beach Cottage',
            description: 'Private cottage with direct beach access',
            pricePerNight: 11000,
            maxGuests: 2,
            totalRooms: 20,
            amenities: ['AC', 'WiFi', 'TV', 'Beach Access', 'Private Patio']
          },
          {
            type: 'suite',
            name: 'Honeymoon Suite',
            description: 'Romantic suite with ocean view',
            pricePerNight: 18000,
            maxGuests: 2,
            totalRooms: 10,
            amenities: ['AC', 'WiFi', 'TV', 'Jacuzzi', 'Ocean View', 'Champagne on Arrival']
          },
          {
            type: 'family',
            name: 'Family Villa',
            description: 'Spacious villa perfect for families',
            pricePerNight: 15000,
            maxGuests: 5,
            totalRooms: 12,
            amenities: ['AC', 'WiFi', 'TV', 'Kitchen', 'Beach Access', 'Living Area']
          }
        ],
        amenities: ['Private Beach', 'Water Sports', 'Beachside Dining', 'Sunset Cruises', 'Spa'],
        facilities: {
          parking: true,
          wifi: true,
          restaurant: true,
          swimmingPool: true,
          gym: true,
          spa: true,
          conferenceRoom: false,
          airportShuttle: true,
          petFriendly: false,
          ac: true
        },
        checkInTime: '14:00',
        checkOutTime: '11:00',
        rating: 4.7,
        isActive: true,
        isVerified: true,
        verificationStatus: 'approved'
      },
      {
        name: "Hotel Al-Razzaque International",
        description: "A heritage hotel in the heart of Old Dhaka, offering a unique blend of traditional charm and modern comfort. Perfect for travelers wanting to experience the cultural richness of historic Dhaka.",
        owner: hotelOwner._id,
        category: 'hotel',
        address: {
          street: "67/A Nawabpur Road",
          city: "Dhaka",
          district: "Dhaka",
          division: "Dhaka",
          zipCode: "1100"
        },
        location: {
          type: 'Point',
          coordinates: [90.4086, 23.7143]
        },
        phone: "+8802-7316891",
        email: "info@alrazzaquehotel.com",
        website: "www.alrazzaquehotel.com",
        rooms: [
          {
            type: 'single',
            name: 'Economy Room',
            description: 'Budget-friendly room with essential amenities',
            pricePerNight: 2500,
            maxGuests: 1,
            totalRooms: 40,
            amenities: ['AC', 'WiFi', 'TV']
          },
          {
            type: 'double',
            name: 'Standard Room',
            description: 'Comfortable room for couples',
            pricePerNight: 3500,
            maxGuests: 2,
            totalRooms: 30,
            amenities: ['AC', 'WiFi', 'TV', 'Mini Fridge']
          },
          {
            type: 'deluxe',
            name: 'Deluxe Room',
            description: 'Spacious room with modern amenities',
            pricePerNight: 5000,
            maxGuests: 3,
            totalRooms: 15,
            amenities: ['AC', 'WiFi', 'TV', 'Mini Bar', 'Work Desk']
          }
        ],
        amenities: ['Traditional Restaurant', 'Prayer Room', 'Tour Arrangements', 'Cultural Programs'],
        facilities: {
          parking: true,
          wifi: true,
          restaurant: true,
          swimmingPool: false,
          gym: false,
          spa: false,
          conferenceRoom: true,
          airportShuttle: true,
          petFriendly: false,
          ac: true
        },
        checkInTime: '13:00',
        checkOutTime: '11:00',
        rating: 4.0,
        isActive: true,
        isVerified: true,
        verificationStatus: 'approved'
      },
      {
        name: "Kuakata Grand Hotel & Sea Resort",
        description: "Experience the magic of sunrise and sunset from the same beach at Kuakata Grand Hotel. Located at the 'Daughter of the Sea', this resort offers a unique coastal experience with panoramic ocean views.",
        owner: hotelOwner._id,
        category: 'resort',
        address: {
          street: "Zero Point, Beach Road",
          city: "Kuakata",
          district: "Patuakhali",
          division: "Barisal",
          zipCode: "8651"
        },
        location: {
          type: 'Point',
          coordinates: [90.1186, 21.8137]
        },
        phone: "+880441-62050",
        email: "info@kuakatagrand.com",
        website: "www.kuakatagrand.com",
        rooms: [
          {
            type: 'double',
            name: 'Sea View Room',
            description: 'Room with stunning sea views',
            pricePerNight: 4500,
            maxGuests: 2,
            totalRooms: 25,
            amenities: ['AC', 'WiFi', 'TV', 'Sea View', 'Balcony']
          },
          {
            type: 'family',
            name: 'Family Suite',
            description: 'Large suite for families',
            pricePerNight: 7500,
            maxGuests: 4,
            totalRooms: 15,
            amenities: ['AC', 'WiFi', 'TV', 'Sea View', 'Kitchen', 'Living Room']
          },
          {
            type: 'deluxe',
            name: 'Beachfront Deluxe',
            description: 'Premium room with direct beach access',
            pricePerNight: 6000,
            maxGuests: 3,
            totalRooms: 18,
            amenities: ['AC', 'WiFi', 'TV', 'Beach Access', 'Mini Bar']
          }
        ],
        amenities: ['Beach Access', 'Sunrise & Sunset Views', 'Fresh Seafood', 'Beach Activities', 'Boat Tours'],
        facilities: {
          parking: true,
          wifi: true,
          restaurant: true,
          swimmingPool: false,
          gym: false,
          spa: false,
          conferenceRoom: false,
          airportShuttle: false,
          petFriendly: false,
          ac: true
        },
        checkInTime: '13:00',
        checkOutTime: '11:00',
        rating: 4.4,
        isActive: true,
        isVerified: true,
        verificationStatus: 'approved'
      },
      {
        name: "Hotel Star Pacific Dhaka",
        description: "A contemporary boutique hotel in Dhaka's bustling Banani area, offering modern comfort and style. Perfect for both business travelers and tourists exploring the capital city.",
        owner: hotelOwner._id,
        category: 'hotel',
        address: {
          street: "52 Kemal Ataturk Avenue, Banani C/A",
          city: "Dhaka",
          district: "Dhaka",
          division: "Dhaka",
          zipCode: "1213"
        },
        location: {
          type: 'Point',
          coordinates: [90.4019, 23.7937]
        },
        phone: "+8802-55013888",
        email: "reservation@starpacificdhaka.com",
        website: "www.starpacificdhaka.com",
        rooms: [
          {
            type: 'single',
            name: 'Smart Room',
            description: 'Compact room with smart amenities',
            pricePerNight: 6000,
            maxGuests: 1,
            totalRooms: 25,
            amenities: ['AC', 'WiFi', 'Smart TV', 'Work Desk', 'Coffee Maker']
          },
          {
            type: 'double',
            name: 'Premium Room',
            description: 'Stylish room with contemporary design',
            pricePerNight: 9000,
            maxGuests: 2,
            totalRooms: 35,
            amenities: ['AC', 'WiFi', 'Smart TV', 'Mini Bar', 'Work Station']
          },
          {
            type: 'suite',
            name: 'Executive Suite',
            description: 'Luxury suite with separate lounge',
            pricePerNight: 16000,
            maxGuests: 3,
            totalRooms: 12,
            amenities: ['AC', 'WiFi', 'Smart TV', 'Full Bar', 'Living Room', 'Kitchenette']
          }
        ],
        amenities: ['Rooftop Restaurant', 'Free WiFi', 'Business Center', '24/7 Concierge', 'Laundry Service'],
        facilities: {
          parking: true,
          wifi: true,
          restaurant: true,
          swimmingPool: false,
          gym: true,
          spa: false,
          conferenceRoom: true,
          airportShuttle: true,
          petFriendly: false,
          ac: true
        },
        checkInTime: '14:00',
        checkOutTime: '12:00',
        rating: 4.5,
        isActive: true,
        isVerified: true,
        verificationStatus: 'approved'
      }
    ];

    // Clear existing hotels (optional - comment out if you want to keep existing data)
    // await Hotel.deleteMany({ owner: hotelOwner._id });
    // console.log('Cleared existing hotels');

    // Insert hotels
    const insertedHotels = await Hotel.insertMany(hotelsData);
    console.log(`✅ Successfully added ${insertedHotels.length} hotels to the database`);
    
    // Display summary
    console.log('\n📋 Hotel Summary:');
    insertedHotels.forEach((hotel, index) => {
      console.log(`${index + 1}. ${hotel.name} - ${hotel.address.city}, ${hotel.address.division}`);
    });

    console.log('\n✨ All hotels have been successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding hotels:', error);
    process.exit(1);
  }
};

seedHotels();
