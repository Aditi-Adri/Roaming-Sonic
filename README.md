# Roaming Sonic - Travel and Tour Management System

A complete travel and tour management system for Bangladesh built with MERN stack.

## 🎉 Status: READY TO USE!

✅ Backend Server Running on http://localhost:5000  
✅ Frontend App Running on http://localhost:3000  
✅ MongoDB Connected Successfully  
✅ All Authentication Features Working

## 🚀 Quick Start

**Your application is already running!**

1. **Visit Frontend:** http://localhost:3000
2. **Try Registration:** Click "Get Started" and create an account
3. **Test Login:** Use your credentials to log in
4. **API Docs:** See SETUP_GUIDE.md for all endpoints

## Features

### User Roles
- **Tourist/User**: Book tickets, hotels, join tours, hire guides
- **Hotel/Resort Owner**: Manage properties and bookings
- **Admin**: Manage all aspects including buses, hotels, tours, and guides
- **Guide**: Create profile and manage tour services

### Key Features
- Online ticket booking with PDF generation
- Hotel/Resort booking system
- Group tour management
- Guide hiring system
- Rating and review system
- Advance search and filters
- Coupon and discount system
- Referral program (10% discount for 5 referrals)
- Dynamic pricing and seasonal discounts
- Wishlist functionality
- Currency converter for foreign tours
- Smart Budget Estimator
- Lost & Found Assistance
- Community Q&A Forum
- Multiple payment options (Cash, bKash, Nagad)
- Multi-stop journey selection

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Architecture**: MVC (Model-View-Controller)
- **Authentication**: JWT (JSON Web Tokens)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file in root directory:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

3. Start backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start React development server:
   ```bash
   npm start
   ```

### Run Full Stack
```bash
npm run dev:full
```

## Project Structure
```
roaming-sonic/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│   └── public/
└── package.json
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Users
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile

(More endpoints to be added as features are developed)

## Contributing
This is a student project for educational purposes.

## License
ISC
