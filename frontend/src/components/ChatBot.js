import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Hello! 👋 I\'m Soni, your Roaming Sonic AI assistant. I can help you with hotels, tours, guides, buses, group tours, and more! How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    { text: '🏨 Hotels', query: 'show me hotels' },
    { text: '🧭 Tour Guides', query: 'find guides' },
    { text: '🗺️ Tour Packages', query: 'tour packages' },
    { text: '👥 Group Tours', query: 'group tours' },
    { text: '🚌 Bus Tickets', query: 'bus booking' },
    { text: '📍 Destinations', query: 'popular destinations' }
  ];

  const siteKnowledge = {
    destinations: {
      coxsBazar: {
        name: "Cox's Bazar",
        description: "World's longest natural sea beach (120km)",
        highlights: ["Marine Drive", "Himchari National Park", "Inani Beach", "Buddhist temples"],
        bestTime: "November to March"
      },
      sundarbans: {
        name: "Sundarbans",
        description: "Largest mangrove forest & Royal Bengal Tiger habitat",
        highlights: ["Royal Bengal Tigers", "Mangrove forests", "Wildlife sanctuary", "River cruises", "Bird watching"],
        bestTime: "October to March"
      },
      sajek: {
        name: "Sajek Valley",
        description: "Queen of hills with breathtaking views",
        highlights: ["Cloud watching", "Sunrise views", "Indigenous culture", "Hanging bridge", "Mountain hiking"],
        bestTime: "September to March"
      },
      sylhet: {
        name: "Sylhet",
        description: "Land of tea gardens and natural beauty",
        highlights: ["Tea gardens", "Ratargul Swamp Forest", "Jaflong", "Lalakhal", "Spiritual sites"],
        bestTime: "October to March"
      }
    },
    features: {
      hotels: "Browse 1,000+ hotels and resorts, filter by location, price, rating, and amenities. Add to wishlist and book instantly.",
      guides: "Hire 500+ professional tour guides specialized in Historical, Adventure, Cultural, Beach, and Religious tours. Filter by language, specialization, and rating.",
      tours: "Explore 200+ tour packages to Cox's Bazar, Sundarbans, Sajek Valley, Sylhet, and more. All-inclusive packages with accommodation and activities.",
      buses: "Book intercity bus tickets online with AC/Non-AC options, seat selection, and instant PDF tickets. Routes across Bangladesh.",
      groupTours: "Create or join group tours! Host your own tour, manage members, or join existing groups. Approval system for organized group travel.",
      dashboard: "Manage all bookings, track guide requests, organize group tours, view your wishlist, and update your profile in one place."
    },
    userTypes: {
      tourist: "Book hotels, hire guides, join group tours, book buses, and create tour packages",
      guide: "Offer tour services, manage tour requests, accept/decline bookings, set your rates and availability",
      hotelOwner: "List your properties, manage bookings, set prices and availability, upload photos",
      admin: "Manage entire platform, approve tours, handle disputes, monitor all activities"
    },
    pricing: "All prices in BDT (৳). Hotels from ৳1,500/night, Guides from ৳500/day, Tours from ৳5,000/package, Buses from ৳300/ticket"
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Greetings
    if (message.match(/^(hi|hello|hey|good morning|good evening|good afternoon|greetings)/i)) {
      return {
        text: '👋 Hello! Welcome to Roaming Sonic - Your Ultimate Travel Companion in Bangladesh!\n\nI can help you with:\n✅ Finding hotels & accommodations\n✅ Hiring professional tour guides\n✅ Booking tour packages\n✅ Joining or creating group tours\n✅ Bus ticket bookings\n✅ Exploring destinations\n✅ Account & booking management\n\nWhat are you interested in today?',
        links: []
      };
    }

    // About Roaming Sonic
    if (message.includes('about') || message.includes('what is roaming sonic') || message.includes('who are you')) {
      return {
        text: '🌟 Roaming Sonic - Bangladesh\'s Premier Travel Management Platform!\n\n📊 Our Platform:\n• 50,000+ Happy Travelers\n• 1,000+ Hotels & Resorts\n• 500+ Expert Guides\n• 200+ Tour Packages\n\n🎯 We offer:\n✓ Hotel bookings across Bangladesh\n✓ Professional tour guide services\n✓ Pre-planned tour packages\n✓ Group tour organization\n✓ Bus ticket booking\n✓ 24/7 customer support\n\n🇧🇩 Explore the beauty of Bangladesh with us!',
        links: [
          { text: 'Browse Hotels', path: '/hotels' },
          { text: 'Find Guides', path: '/guides' }
        ]
      };
    }

    // Hotels - Enhanced
    if (message.includes('hotel') || message.includes('accommodation') || message.includes('stay') || message.includes('resort') || message.includes('room')) {
      return {
        text: '🏨 Hotels & Accommodations\n\n📍 We have 1,000+ properties including:\n• Luxury Hotels & Resorts\n• Budget-friendly Guest Houses\n• Beachfront Properties\n• Hill Resort Hotels\n• City Center Hotels\n\n⚡ Features:\n✓ Real-time availability\n✓ Instant booking confirmation\n✓ Detailed room descriptions\n✓ Guest reviews & ratings\n✓ Photo galleries\n✓ Wishlist functionality\n✓ Filter by price, location, rating\n\n💰 Starting from ৳1,500/night\n\nReady to find your perfect stay?',
        links: [
          { text: 'Browse All Hotels', path: '/hotels' },
          { text: 'Cox\'s Bazar Hotels', path: '/hotels?destination=coxsbazar' }
        ]
      };
    }

    // Tour Guides - Enhanced
    if (message.includes('guide') || message.includes('tour guide') || message.includes('local guide')) {
      return {
        text: '🧭 Professional Tour Guides\n\n👥 500+ Experienced Guides Available!\n\n🎯 Specializations:\n• Historical & Cultural Tours\n• Adventure & Trekking\n• Beach & Coastal Tours\n• Religious Site Tours\n• Photography Tours\n• Food & Culinary Tours\n\n🌍 Languages: Bengali, English, Hindi, Urdu, and more\n\n⭐ All guides are:\n✓ Verified & Certified\n✓ Rated by travelers\n✓ Locally experienced\n✓ Background checked\n\n💰 From ৳500/day\n\n📝 You can:\n• View guide profiles\n• Check availability\n• Request bookings\n• Review after tours',
        links: [
          { text: 'Find Guides', path: '/guides' },
          { text: 'How to Hire', path: '/guides' }
        ]
      };
    }

    // Tour Packages - Enhanced
    if (message.includes('tour package') || message.includes('package tour') || message.includes('trip package')) {
      return {
        text: '🗺️ Tour Packages - Explore Bangladesh!\n\n🎉 200+ Curated Packages Available\n\n🌟 Popular Packages:\n\n🏖️ Cox\'s Bazar Beach Paradise\n• 3 Days / 2 Nights\n• Beach resort stay\n• Water sports\n• From ৳8,500\n\n🌳 Sundarbans Adventure\n• 2 Days / 1 Night\n• Boat safari\n• Wildlife spotting\n• From ৳6,200\n\n⛰️ Sajek Valley Explorer\n• 2 Days / 1 Night\n• Mountain resort\n• Cloud viewing\n• From ৳5,500\n\n🍃 Sylhet Tea Garden Tour\n• 3 Days / 2 Nights\n• Tea estate visits\n• Waterfall tours\n• From ৳7,800\n\n✅ All packages include:\n• Accommodation\n• Transportation\n• Meals (as specified)\n• Guide services\n• Entry tickets',
        links: [
          { text: 'View All Packages', path: '/tours' },
          { text: 'Create Custom Package', path: '/dashboard' }
        ]
      };
    }

    // Group Tours - NEW
    if (message.includes('group tour') || message.includes('group trip') || message.includes('join tour') || message.includes('create tour')) {
      return {
        text: '👥 Group Tours - Travel Together!\n\n🎉 Join or Create Group Tours!\n\n📋 How it works:\n\n🔷 For Organizers:\n1. Create a group tour\n2. Set destination, dates, and cost\n3. Wait for admin approval\n4. Accept/reject join requests\n5. Manage your group members\n\n🔶 For Joiners:\n1. Browse available group tours\n2. Request to join\n3. Wait for host approval\n4. Get confirmed\n5. Travel together!\n\n✨ Benefits:\n• Share costs\n• Meet new travelers\n• Organized group travel\n• Safety in numbers\n• Make friends\n\n💡 Perfect for:\n• Solo travelers\n• Students\n• Adventure seekers\n• Budget travelers\n\n📍 All major destinations covered!',
        links: [
          { text: 'Browse Group Tours', path: '/group-tours' },
          { text: 'Create Your Tour', path: '/dashboard' }
        ]
      };
    }

    // Buses - Enhanced
    if (message.includes('bus') || message.includes('transport') || message.includes('ticket')) {
      return {
        text: '🚌 Bus Ticket Booking\n\n🎫 Easy Online Bus Booking!\n\n🚍 Service Types:\n• AC Buses\n• Non-AC Buses\n• Sleeper Coaches\n• Luxury Buses\n\n🗺️ Popular Routes:\n• Dhaka ↔ Cox\'s Bazar\n• Dhaka ↔ Sylhet\n• Dhaka ↔ Chittagong\n• Chittagong ↔ Cox\'s Bazar\n• And many more!\n\n✅ Features:\n• Online seat selection\n• Real-time availability\n• Instant PDF tickets\n• Email confirmation\n• Various payment options\n\n💰 Starting from ৳300/ticket\n\n📱 Book from anywhere, anytime!',
        links: [
          { text: 'Book Bus Tickets', path: '/buses' },
          { text: 'View Routes', path: '/buses' }
        ]
      };
    }

    // Destinations - Enhanced with all 4
    if (message.includes('destination') || message.includes('place to visit') || message.includes('where to go') || message.includes('explore')) {
      return {
        text: '📍 Top Destinations in Bangladesh\n\n🏖️ Cox\'s Bazar\n• World\'s longest sea beach (120km)\n• Best: November-March\n• Highlights: Marine Drive, Himchari, Inani Beach\n\n🌳 Sundarbans\n• UNESCO World Heritage Site\n• Home to Royal Bengal Tigers\n• Best: October-March\n• Activities: Boat safari, wildlife watching\n\n⛰️ Sajek Valley\n• "Queen of Hills"\n• Above the clouds experience\n• Best: September-March\n• Perfect for: Sunrise, photography\n\n🍃 Sylhet\n• Tea garden paradise\n• Best: October-March\n• Must-visit: Ratargul, Jaflong, Lalakhal\n\n🏛️ Also Explore:\n• Dhaka - Historic sites\n• Chittagong Hill Tracts\n• Rangamati - Lake district\n• Kuakata - Sunset & sunrise beach',
        links: [
          { text: 'Explore Destinations', path: '/tours' },
          { text: 'Find Hotels', path: '/hotels' }
        ]
      };
    }

    // Hotels
    if (message.includes('hotel') || message.includes('accommodation') || message.includes('stay')) {
      return {
        text: '🏨 We have a wide range of hotels across Bangladesh! You can:\n\n• Browse hotels on our Hotels page\n• Filter by location, price, and rating\n• Check availability and book instantly\n• Add favorites to your wishlist\n\nWould you like me to guide you to the Hotels page?',
        links: [{ text: 'View Hotels', path: '/hotels' }]
      };
    }

    // Guides
    if (message.includes('guide') || message.includes('tour guide')) {
      return {
        text: '🧭 Looking for a tour guide? We have experienced local guides who specialize in:\n\n• Historical Tours\n• Adventure Tours\n• Cultural Tours\n• Beach Tours\n• Religious Sites\n• And more!\n\nYou can filter guides by language, specialization, and rating.',
        links: [{ text: 'Find Guides', path: '/guides' }]
      };
    }

    // Tours/Packages
    if (message.includes('tour') || message.includes('package') || message.includes('trip')) {
      return {
        text: '🗺️ We offer amazing tour packages! Popular destinations include:\n\n• Cox\'s Bazar - World\'s longest sea beach\n• Sundarbans - Mangrove forest\n• Sylhet - Tea gardens & hills\n• Chittagong Hill Tracts\n• Historical sites in Dhaka\n\nExplore our tour packages to find your perfect adventure!',
        links: [{ text: 'View Tours', path: '/tours' }]
      };
    }

    // Buses
    if (message.includes('bus') || message.includes('transport')) {
      return {
        text: '🚌 Need bus services? We provide:\n\n• Intercity bus bookings\n• AC and Non-AC buses\n• Various routes across Bangladesh\n• Comfortable seating options\n• Real-time availability\n\nCheck out our bus services!',
        links: [{ text: 'View Buses', path: '/buses' }]
      };
    }

    // Booking
    if (message.includes('book') || message.includes('reservation')) {
      return {
        text: '📅 To make a booking:\n\n1. Browse Hotels, Guides, Tours, or Buses\n2. Select your preferred option\n3. Check availability\n4. Fill in your details\n5. Confirm your booking\n\nYou can track all bookings in your dashboard!',
        links: [{ text: 'Go to Dashboard', path: '/dashboard' }]
      };
    }

    // Registration/Login
    if (message.includes('register') || message.includes('sign up') || message.includes('login') || message.includes('account')) {
      return {
        text: '👤 To create an account:\n\n• Click on Login/Register\n• Choose your account type:\n  - Tourist (for bookings)\n  - Guide (offer tours)\n  - Hotel Owner (list properties)\n• Fill in your details\n• Start exploring!\n\nAlready have an account? Just login!',
        links: [
          { text: 'Login', path: '/login' },
          { text: 'Register', path: '/register' }
        ]
      };
    }

    // Payment
    if (message.includes('payment') || message.includes('pay') || message.includes('price')) {
      return {
        text: '💳 Payment Information:\n\n• We accept various payment methods\n• Secure payment processing\n• Instant booking confirmation\n• Prices are shown in BDT (৳)\n• No hidden charges\n\nFor specific pricing, check individual listings!',
        links: []
      };
    }

    // Help/Contact
    if (message.includes('help') || message.includes('contact') || message.includes('support')) {
      return {
        text: '❓ Need help? We\'re here for you!\n\n📧 Email: support@roamingsonic.com\n📞 Phone: +880-1234-567890\n⏰ Support: 24/7\n\nYou can also:\n• Check your dashboard for bookings\n• Update your profile\n• Manage your preferences\n\nWhat specific help do you need?',
        links: []
      };
    }

    // Cox's Bazar specific
    if (message.includes("cox") || message.includes("sea beach") || message.includes("longest beach")) {
      return {
        text: '🏖️ Cox\'s Bazar - The Pride of Bangladesh!\n\n🌊 World\'s Longest Natural Sea Beach\n• Length: 120 kilometers!\n• Located in southeastern Bangladesh\n\n🎯 Must-Visit Spots:\n✓ Marine Drive (scenic coastal road)\n✓ Himchari National Park & Waterfall\n✓ Inani Beach (crystal clear water)\n✓ Sonadia Island\n✓ Teknaf Wildlife Sanctuary\n✓ Ramu Buddhist Village\n\n🎭 Activities:\n• Swimming & surfing\n• Beach volleyball\n• Sunset watching\n• Fresh seafood\n• Water sports\n• Photography\n\n🏨 Accommodation: Luxury resorts to budget hotels\n\n📅 Best Time: November to March\n🌡️ Pleasant weather, less rainfall\n\nReady to plan your Cox\'s Bazar trip?',
        links: [
          { text: 'Cox\'s Bazar Hotels', path: '/hotels' },
          { text: 'Book Tour Package', path: '/tours' },
          { text: 'Find Local Guide', path: '/guides' }
        ]
      };
    }

    // Sundarbans specific
    if (message.includes("sundarban") || message.includes("mangrove") || message.includes("tiger") || message.includes("royal bengal")) {
      return {
        text: '🌳 Sundarbans - UNESCO World Heritage Site\n\n🐅 Home of the Royal Bengal Tiger!\n\n🌟 Unique Features:\n• Largest mangrove forest in the world\n• UNESCO World Heritage Site since 1997\n• Part of Bangladesh-India border\n• Rich biodiversity\n\n🦁 Wildlife:\n✓ Royal Bengal Tigers (300+)\n✓ Saltwater Crocodiles\n✓ Spotted Deer\n✓ Wild Boars\n✓ 260+ bird species\n✓ Fishing Cats\n✓ Monitor Lizards\n\n🚤 Activities:\n• Boat safaris (2-3 days)\n• Wildlife spotting\n• Bird watching\n• Photography\n• Mangrove exploration\n\n📅 Best Time: October to March\n🌡️ Cool & dry weather\n\n⚠️ Guided tours mandatory for safety!',
        links: [
          { text: 'Sundarbans Tours', path: '/tours' },
          { text: 'Expert Guides', path: '/guides' }
        ]
      };
    }

    // Sajek Valley specific
    if (message.includes("sajek") || message.includes("hill") || message.includes("cloud") || message.includes("mountain")) {
      return {
        text: '⛰️ Sajek Valley - Queen of Hills\n\n☁️ Experience Above the Clouds!\n\n🌄 Highlights:\n• Altitude: 1,800 feet above sea level\n• Located in Chittagong Hill Tracts\n• Indigenous Lushai community\n\n✨ What to Experience:\n✓ Sunrise above clouds\n✓ Sunset from hilltops\n✓ Star-gazing at night\n✓ Hanging bridge adventure\n✓ Indigenous culture\n✓ Mountain hiking\n✓ Photography paradise\n\n🏡 Accommodation:\n• Mountain resorts\n• Cottages with panoramic views\n• Basic to luxury options\n\n📍 Nearby Attractions:\n• Konglak Hill\n• Ruilui Para\n• Hazachara Waterfall\n\n📅 Best Time: September to March\n🌤️ Clear skies, best cloud views\n\n🚗 Journey: 8-9 hours from Chittagong',
        links: [
          { text: 'Sajek Packages', path: '/tours' },
          { text: 'Mountain Guides', path: '/guides' }
        ]
      };
    }

    // Sylhet specific
    if (message.includes("sylhet") || message.includes("tea garden") || message.includes("jaflong") || message.includes("ratargul")) {
      return {
        text: '🍃 Sylhet - Land of Tea & Natural Beauty\n\n🫖 Tea Capital of Bangladesh!\n\n🌟 Famous For:\n• 150+ Tea Gardens\n• Spiritual significance (Shrine of Hazrat Shahjalal)\n• Crystal clear rivers\n• Waterfalls & hills\n\n📍 Must-Visit Places:\n\n🌿 Ratargul Swamp Forest\n• Only swamp forest in Bangladesh\n• Boat rides through forest\n• Freshwater swamp\n\n💎 Jaflong\n• Stone collection area\n• Border with India\n• Dawki River\n• Mountain views\n\n🏞️ Lalakhal\n• Crystal blue river\n• Boat trips\n• Tea garden views\n\n☕ Tea Gardens:\n• Srimangal - 300+ estates\n• Tea tasting\n• Nature walks\n\n📅 Best Time: October to March\n💧 Monsoon (June-August) for waterfalls\n\nExperience the serenity of Sylhet!',
        links: [
          { text: 'Sylhet Tours', path: '/tours' },
          { text: 'Tea Garden Hotels', path: '/hotels' }
        ]
      };
    }

    // Account & Registration
    if (message.includes('register') || message.includes('sign up') || message.includes('create account') || message.includes('account')) {
      return {
        text: '👤 Account Creation & Types\n\n🎭 Choose Your Account Type:\n\n🧳 Tourist Account (Most Popular)\n✓ Book hotels & resorts\n✓ Hire tour guides\n✓ Book tour packages\n✓ Join/create group tours\n✓ Book bus tickets\n✓ Manage wishlist\n✓ Track all bookings\n\n🧭 Guide Account\n✓ Offer tour services\n✓ Set your rates\n✓ Manage tour requests\n✓ Accept/decline bookings\n✓ Build your profile\n✓ Get reviews & ratings\n\n🏨 Hotel Owner Account\n✓ List your properties\n✓ Manage bookings\n✓ Set availability\n✓ Upload photos\n✓ Pricing control\n\n🔐 Registration is:\n• Quick & easy (2 minutes)\n• Free of charge\n• Secure & verified\n• Required for bookings',
        links: [
          { text: 'Register Now', path: '/register' },
          { text: 'Login', path: '/login' }
        ]
      };
    }

    // Booking Process
    if (message.includes('how to book') || message.includes('booking process') || message.includes('make booking') || message.includes('reservation')) {
      return {
        text: '📅 How to Make a Booking\n\n🏨 Hotel Booking:\n1. Browse hotels page\n2. Filter by location/price/rating\n3. View hotel details\n4. Check availability\n5. Fill booking form\n6. Confirm & pay\n7. Get instant confirmation\n\n🧭 Guide Booking:\n1. Find guides page\n2. Filter by specialization\n3. Check guide profile\n4. View availability\n5. Request booking\n6. Wait for guide acceptance\n7. Get confirmed\n\n🗺️ Tour Package:\n1. Browse tour packages\n2. Select your destination\n3. Choose dates\n4. Review package details\n5. Book & pay\n6. Receive confirmation\n\n👥 Group Tour:\n1. Browse existing tours\n2. Request to join\n3. Wait for host approval\n4. Or create your own tour!\n\n💡 Tip: Login required for all bookings!',
        links: [
          { text: 'Start Booking', path: '/hotels' },
          { text: 'My Dashboard', path: '/dashboard' }
        ]
      };
    }

    // Payment & Pricing
    if (message.includes('payment') || message.includes('pay') || message.includes('price') || message.includes('cost') || message.includes('how much')) {
      return {
        text: '💳 Payment & Pricing Information\n\n💰 Price Ranges (in BDT ৳):\n\n🏨 Hotels:\n• Budget: ৳1,500 - ৳3,000/night\n• Mid-range: ৳3,000 - ৳8,000/night\n• Luxury: ৳8,000+/night\n\n🧭 Tour Guides:\n• Day tours: ৳500 - ৳2,000/day\n• Multi-day: ৳1,500 - ৳5,000/day\n• Specialized: ৳3,000+/day\n\n🗺️ Tour Packages:\n• Weekend: ৳5,000 - ৳10,000\n• 3-4 days: ৳8,000 - ৳15,000\n• Week-long: ৳20,000+\n\n🚌 Bus Tickets:\n• Short routes: ৳300 - ৳800\n• Long routes: ৳800 - ৳2,000\n• AC premium: ৳1,500 - ৳3,000\n\n✅ Payment Features:\n• Multiple payment methods\n• Secure processing\n• Instant confirmation\n• No hidden charges\n• Email receipts',
        links: []
      };
    }

    // Dashboard & Profile
    if (message.includes('dashboard') || message.includes('profile') || message.includes('my account') || message.includes('my bookings')) {
      return {
        text: '📊 Your Dashboard - Central Hub\n\n🎯 What You Can Do:\n\n📱 For Tourists:\n✓ View all your bookings\n✓ Track guide requests\n✓ Manage group tours\n✓ View & edit wishlist\n✓ Update profile\n✓ Change password\n✓ View booking history\n✓ Leave reviews\n\n🧭 For Guides:\n✓ Manage tour requests\n✓ Accept/decline bookings\n✓ View your schedule\n✓ Update availability\n✓ Edit profile & rates\n✓ View earnings\n\n🏨 For Hotel Owners:\n✓ Manage property listings\n✓ Handle bookings\n✓ Update availability\n✓ Manage pricing\n✓ Upload photos\n✓ View reservations\n\n🔐 Access: Login required',
        links: [
          { text: 'Go to Dashboard', path: '/dashboard' },
          { text: 'Login', path: '/login' }
        ]
      };
    }

    // Help & Support
    if (message.includes('help') || message.includes('contact') || message.includes('support') || message.includes('customer service') || message.includes('problem')) {
      return {
        text: '❓ Help & Customer Support\n\n📞 Contact Us:\n\n📧 Email: support@roamingsonic.com\n📱 Phone: +880-1234-567890\n💬 WhatsApp: +880-1234-567890\n\n⏰ Support Hours:\n• 24/7 Customer Support\n• Live chat available\n• Quick response time\n\n🆘 Common Issues:\n\n🔹 Booking Issues:\n• Check your email for confirmation\n• View "My Bookings" in dashboard\n• Contact host/guide directly\n\n🔹 Payment Issues:\n• Check payment confirmation\n• Allow 24 hours for processing\n• Keep transaction receipts\n\n🔹 Account Issues:\n• Reset password option\n• Profile update in dashboard\n• Verification via email\n\n🔹 Cancellation:\n• Check cancellation policy\n• Request through dashboard\n• Refund as per policy\n\n💡 Tip: Always check your dashboard first!',
        links: [
          { text: 'My Dashboard', path: '/dashboard' },
          { text: 'Contact Support', path: '/contact' }
        ]
      };
    }

    // Reviews & Ratings
    if (message.includes('review') || message.includes('rating') || message.includes('feedback')) {
      return {
        text: '⭐ Reviews & Ratings System\n\n📝 Why Reviews Matter:\n• Help other travelers\n• Improve service quality\n• Build trust\n• Reward good service\n\n✍️ What You Can Review:\n\n🏨 Hotels:\n• Cleanliness\n• Service quality\n• Location\n• Value for money\n• Amenities\n\n🧭 Guides:\n• Knowledge & expertise\n• Professionalism\n• Communication\n• Punctuality\n• Overall experience\n\n🗺️ Tour Packages:\n• Organization\n• Value for money\n• Itinerary accuracy\n• Overall satisfaction\n\n✅ How to Leave Review:\n1. Complete your booking\n2. Go to dashboard\n3. Find completed booking\n4. Click "Leave Review"\n5. Rate (1-5 stars)\n6. Write your experience\n7. Submit!\n\n💫 Your feedback makes a difference!',
        links: [
          { text: 'My Bookings', path: '/dashboard' }
        ]
      };
    }

    // Safety & Security
    if (message.includes('safe') || message.includes('security') || message.includes('secure') || message.includes('trust')) {
      return {
        text: '🛡️ Safety & Security\n\n✅ Your Safety is Our Priority!\n\n🔐 Platform Security:\n• SSL encrypted transactions\n• Secure payment gateway\n• Data protection compliance\n• Privacy policy enforced\n\n✔️ Verified Services:\n• All guides are background-checked\n• Hotels are verified\n• Regular quality audits\n• Review system for transparency\n\n💳 Payment Safety:\n• Secure payment processing\n• No card details stored\n• PCI compliant\n• Transaction receipts\n\n🧭 Travel Safety:\n• Experienced local guides\n• Emergency contact numbers\n• Travel insurance recommended\n• Group travel options\n\n📱 Account Security:\n• Strong password required\n• Email verification\n• Two-factor authentication\n• Logout from all devices\n\n💡 Tips:\n• Share itinerary with family\n• Keep emergency contacts\n• Follow guide instructions\n• Check weather forecasts',
        links: [
          { text: 'Privacy Policy', path: '/privacy' },
          { text: 'Terms of Service', path: '/terms' }
        ]
      };
    }

    // Best time to visit
    if (message.includes('best time') || message.includes('when to visit') || message.includes('weather') || message.includes('season')) {
      return {
        text: '🌤️ Best Time to Visit Bangladesh\n\n📅 Seasonal Guide:\n\n❄️ Winter (November - February)\n• Best travel season!\n• Pleasant weather (15-25°C)\n• Low humidity\n• Perfect for: Beach, hills, forests\n• Peak tourist season\n• Book in advance\n\n🌸 Spring (March - May)\n• Warm weather (25-35°C)\n• Good for hill stations\n• Pre-monsoon period\n• Moderate crowd\n\n☔ Monsoon (June - September)\n• Heavy rainfall\n• Not ideal for most places\n• Good for: Waterfalls, greenery\n• Low season (better prices)\n\n🍂 Autumn (October)\n• Post-monsoon freshness\n• Clear skies\n• Festival season\n• Good for photography\n\n📍 Destination-wise:\n• Cox\'s Bazar: Nov-Mar\n• Sundarbans: Oct-Mar\n• Sajek: Sep-Mar\n• Sylhet: Oct-Mar (Jun-Aug for waterfalls)',
        links: [
          { text: 'Plan Your Trip', path: '/tours' }
        ]
      };
    }

    // Cancellation & Refund
    if (message.includes('cancel') || message.includes('refund') || message.includes('cancellation policy')) {
      return {
        text: '🔄 Cancellation & Refund Policy\n\n📋 General Policy:\n\n🏨 Hotels:\n• Free cancellation: 48 hours before\n• 50% refund: 24-48 hours before\n• No refund: Less than 24 hours\n• Check specific hotel policy\n\n🧭 Guides:\n• Free cancellation: 24 hours before\n• 50% refund: 12-24 hours before\n• No refund: Less than 12 hours\n\n🗺️ Tour Packages:\n• 90% refund: 7+ days before\n• 50% refund: 3-7 days before\n• No refund: Less than 3 days\n\n🚌 Bus Tickets:\n• Check operator policy\n• Usually 2-4 hours before\n• Cancellation fees may apply\n\n👥 Group Tours:\n• Host sets policy\n• Usually 3-5 days before\n• Check tour details\n\n⚡ How to Cancel:\n1. Login to dashboard\n2. Find your booking\n3. Click cancel button\n4. Provide reason\n5. Submit request\n6. Refund in 5-7 business days',
        links: [
          { text: 'My Bookings', path: '/dashboard' },
          { text: 'Terms & Conditions', path: '/terms' }
        ]
      };
    }

    // Language support
    if (message.includes('language') || message.includes('bangla') || message.includes('bengali') || message.includes('english')) {
      return {
        text: '🌐 Language Support\n\n💬 Available Languages:\n\n✅ Platform Languages:\n• English (Primary)\n• বাংলা (Bengali) - Coming Soon!\n\n🧭 Guide Languages:\nOur guides speak:\n• Bengali (Native)\n• English\n• Hindi\n• Urdu\n• Arabic\n• And more!\n\n📱 Communication:\n• All communications in English/Bengali\n• Guides can translate\n• Local language support\n• Cultural interpretation\n\n💡 Tips:\n• Specify language preference when booking\n• Check guide language skills\n• Use translation apps if needed\n\n🌍 We cater to both local and international travelers!',
        links: [
          { text: 'Find Multilingual Guides', path: '/guides' }
        ]
      };
    }

    // Thank you responses
    if (message.match(/^(thank|thanks|thank you|appreciate)/i)) {
      return {
        text: '😊 You\'re very welcome!\n\nI\'m always here to help you plan the perfect Bangladesh adventure!\n\n🌟 Need anything else?\n• Hotel recommendations?\n• Tour suggestions?\n• Destination advice?\n• Booking assistance?\n\nJust ask away! Happy travels! 🇧🇩✨',
        links: []
      };
    }

    // Default response with smart suggestions
    return {
      text: '🤔 I\'m here to help you explore Bangladesh!\n\n💡 I can assist with:\n\n📍 Destinations:\n• Cox\'s Bazar, Sundarbans, Sajek, Sylhet\n• Best time to visit\n• Things to do\n\n🏨 Services:\n• Hotels & accommodations\n• Professional tour guides\n• Tour packages\n• Group tours\n• Bus tickets\n\n📱 Platform:\n• How to book\n• Account creation\n• Dashboard features\n• Payments & pricing\n• Reviews & ratings\n• Cancellation policy\n\n❓ Support:\n• Help & contact\n• Safety information\n• FAQs\n\nWhat would you like to know? Try asking about hotels, destinations, tours, or anything travel-related!',
      links: [
        { text: 'Browse Hotels', path: '/hotels' },
        { text: 'Explore Tours', path: '/tours' },
        { text: 'Find Guides', path: '/guides' }
      ]
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationContext(prev => [...prev, inputMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking with realistic delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMessage = {
        type: 'bot',
        text: botResponse.text,
        links: botResponse.links,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500); // 1-1.5 seconds for more natural feel
  };

  const handleQuickReply = (query) => {
    const userMessage = {
      type: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(query);
      const botMessage = {
        type: 'bot',
        text: botResponse.text,
        links: botResponse.links,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <span className="chat-icon">💬</span>
          <span className="chat-badge">AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <h4>Soni - Travel Assistant</h4>
                <span className="chatbot-status">● Online - AI Powered</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                {message.type === 'bot' && <div className="message-avatar">🤖</div>}
                <div className="message-content">
                  <div className="message-bubble">
                    {message.text}
                  </div>
                  {message.links && message.links.length > 0 && (
                    <div className="message-links">
                      {message.links.map((link, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="message-link-btn"
                          onClick={() => {
                            const path = link?.path;
                            if (!path) return;
                            if (/^https?:\/\//i.test(path) || /^mailto:/i.test(path)) {
                              window.location.href = path;
                              return;
                            }
                            navigate(path);
                          }}
                        >
                          {link.text} →
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {message.type === 'user' && <div className="message-avatar user">👤</div>}
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="message-bubble typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-quick-replies">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => handleQuickReply(reply.text)}
              >
                {reply.text}
              </button>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
              <span>➤</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
