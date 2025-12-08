# Roaming Sonic - Travel Management System

A full-stack MERN application with MVC architecture for managing tours, hotels, guides, and travel bookings.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
ROAMING_SONIC/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   └── authController.js  # Authentication logic
│   ├── middleware/
│   │   └── auth.js            # JWT verification
│   ├── models/
│   │   └── User.js            # User schema
│   ├── routes/
│   │   └── authRoutes.js      # Authentication routes
│   ├── .env                   # Environment variables
│   ├── server.js              # Express server
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── TouristDashboard.js
    │   │   ├── HotelOwnerDashboard.js
    │   │   ├── AdminDashboard.js
    │   │   └── GuideDashboard.js
    │   ├── services/
    │   │   └── api.js
    │   └── App.js
    └── package.json
```

## Features Implemented

### Authentication System
- ✅ User registration with role selection
- ✅ User login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (Tourist, Hotel Owner, Admin, Guide)
- ✅ Protected routes with JWT verification
- ✅ Role-based dashboard redirection

### User Roles
1. **Tourist/User** - Can book tours, hotels, buses
2. **Hotel/Resort Owner** - Manage hotel listings
3. **Website Admin** - Manage all resources
4. **Guide** - Manage profile and tours

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas account
- npm or yarn package manager

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Configure environment variables:
   - Open `.env` file
   - Update `MONGODB_URI` if needed (default: mongodb://localhost:27017/roaming_sonic)
   - Change `JWT_SECRET` for production

4. Start MongoDB:
   - Open MongoDB Compass
   - Or start MongoDB service

5. Run the backend server:
```bash
npm run dev
```
   - Server runs on http://localhost:5000

### Frontend Setup

1. Open a new terminal and navigate to frontend:
```bash
cd frontend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```
   - Frontend runs on http://localhost:3000

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Request Examples

**Register:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "tourist",
  "phoneNumber": "1234567890"
}
```

**Login:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Testing the Application

1. **Start MongoDB** (via Compass or service)

2. **Start Backend:**
```bash
cd backend
npm run dev
```

3. **Start Frontend (in new terminal):**
```bash
cd frontend
npm start
```

4. **Test Registration:**
   - Go to http://localhost:3000
   - Click "Register"
   - Fill in the form and select a role
   - Submit

5. **Test Login:**
   - Go to login page
   - Enter credentials
   - You'll be redirected to role-specific dashboard

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (tourist/hotel_owner/admin/guide),
  photo: String,
  phoneNumber: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Role-based authorization
- HTTP-only cookies support
- CORS enabled for frontend

## Next Steps
- Implement dashboard features for each role
- Add hotel management
- Add bus ticket booking
- Add tour packages
- Add guide profiles
- Add review system
- Add payment integration
- Add PDF ticket generation

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/roaming_sonic
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **CORS Error:**
   - Backend and frontend must run on specified ports
   - Check CORS configuration in server.js

3. **JWT Error:**
   - Ensure JWT_SECRET is set in .env
   - Check token in browser localStorage

## Contributing
This is a course project for learning MERN stack development.

## License
MIT
