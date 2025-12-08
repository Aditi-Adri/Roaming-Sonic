# Quick Start Guide - Roaming Sonic

## ✅ Current Status
Both servers are running successfully!
- Backend: http://localhost:5000 ✓
- Frontend: http://localhost:3000 ✓
- Database: MongoDB Connected ✓

## 🚀 How to Use the Application

### 1. Open the Application
Go to: **http://localhost:3000**

### 2. Register a New Account
- Click on "Register" button
- Fill in your details:
  - Full Name
  - Email
  - Phone Number (optional)
  - **Select Role** (Important!):
    - Tourist/User
    - Hotel/Resort Owner
    - Tour Guide
    - Website Admin
  - Password (minimum 6 characters)
  - Confirm Password
- Click "Register"
- You'll be automatically redirected to your role-specific dashboard

### 3. Login to Existing Account
- Click on "Login" button
- Enter your email and password
- Click "Login"
- You'll be redirected based on your role:
  - Tourist → Tourist Dashboard
  - Hotel Owner → Hotel Owner Dashboard
  - Admin → Admin Dashboard
  - Guide → Guide Dashboard

### 4. Test Different Roles
Create multiple accounts with different roles to see role-based routing:

**Test Account 1 - Tourist:**
- Email: tourist@test.com
- Password: test123
- Role: Tourist/User

**Test Account 2 - Hotel Owner:**
- Email: hotel@test.com
- Password: test123
- Role: Hotel/Resort Owner

**Test Account 3 - Guide:**
- Email: guide@test.com
- Password: test123
- Role: Tour Guide

**Test Account 4 - Admin:**
- Email: admin@test.com
- Password: test123
- Role: Website Admin

## 🔒 Security Features Working
✅ Password encryption (bcrypt)
✅ JWT authentication
✅ Protected routes
✅ Role-based access control
✅ Automatic token management

## 📊 What's Implemented

### Backend (MVC Architecture)
- ✅ **Models**: User schema with validation
- ✅ **Views**: JSON API responses
- ✅ **Controllers**: Authentication logic (register, login, logout, getMe)
- ✅ **Routes**: RESTful API endpoints
- ✅ **Middleware**: JWT verification, role authorization
- ✅ **Database**: MongoDB connection

### Frontend (React)
- ✅ Beautiful login and registration UI
- ✅ Role-based dashboards
- ✅ Protected routes
- ✅ Authentication context (global state)
- ✅ API service layer
- ✅ Responsive design

## 🎨 UI Features
- Modern gradient design
- Smooth animations
- Responsive layout
- Form validation
- Error handling
- Loading states

## 📝 Database Structure
Check MongoDB Compass to see:
- Database: `roaming_sonic`
- Collection: `users`
- Documents contain: name, email, hashed password, role, etc.

## 🔧 Development Commands

### Backend
```bash
cd backend
npm run dev     # Start with nodemon (auto-restart)
npm start       # Start production mode
```

### Frontend
```bash
cd frontend
npm start       # Start development server
npm run build   # Create production build
```

## 🧪 Testing Checklist

- [x] Register with different roles
- [x] Login with credentials
- [x] Role-based dashboard routing
- [x] Logout functionality
- [x] Protected routes (try accessing dashboards without login)
- [x] Form validation
- [x] Error messages
- [x] MongoDB data persistence

## 📌 Next Development Steps

1. **Tourist Dashboard Features:**
   - View and book tickets
   - Search hotels
   - Join tour groups
   - View booking history
   - Generate PDF tickets

2. **Hotel Owner Dashboard:**
   - Add/edit hotel details
   - Upload photos
   - Set pricing
   - View bookings

3. **Admin Dashboard:**
   - Manage all users
   - Add buses
   - Approve guides
   - Handle complaints
   - Manage tours

4. **Guide Dashboard:**
   - Create profile
   - Add experience
   - View reviews
   - Manage tours

## 🐛 Troubleshooting

**If backend stops:**
```bash
cd backend
npm run dev
```

**If frontend stops:**
```bash
cd frontend
npm start
```

**If MongoDB connection fails:**
- Open MongoDB Compass
- Ensure MongoDB service is running
- Check connection string in backend/.env

**Clear localStorage (if login issues):**
- Open browser DevTools (F12)
- Application → Local Storage → http://localhost:3000
- Clear all items

## 📖 API Testing with Postman/Thunder Client

**Register:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "role": "tourist",
  "phoneNumber": "1234567890"
}
```

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}
```

**Get Current User:**
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your-token-here>
```

## 🎓 Learning Resources
- MVC Architecture: Controllers handle business logic, Models define data, Routes map URLs
- JWT Authentication: Stateless token-based authentication
- React Context API: Global state management
- Protected Routes: HOC pattern for authorization
- REST API Design: CRUD operations with proper HTTP methods

---

**Your application is ready! Start testing at http://localhost:3000** 🎉
