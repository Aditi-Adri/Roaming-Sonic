# 🚀 Roaming Sonic - Quick Start Guide

## ✅ Setup Complete!

Your full-stack travel management system is ready!

### 🌐 Access Your Application

**Frontend:** http://localhost:3000  
**Backend API:** http://localhost:5000  
**Database:** MongoDB (roaming-sonic)

### 🎯 What's Working Now

1. ✅ **User Registration**
   - Tourist registration with referral codes
   - Hotel owner registration with business details
   - Guide registration with experience
   - Admin accounts

2. ✅ **User Login**
   - Role-based authentication
   - JWT token management
   - Automatic redirection

3. ✅ **Homepage**
   - Beautiful landing page
   - Popular Bangladesh destinations
   - Feature showcase
   - Responsive design

### 🧪 Test the Application

#### Test Registration
1. Open http://localhost:3000
2. Click "Get Started" or "Register here"
3. Choose user type (Tourist/Hotel Owner/Guide)
4. Fill in the form
5. Submit and you'll be logged in automatically

#### Test Login
1. Go to http://localhost:3000/login
2. Select user type
3. Enter credentials
4. Login and see welcome message

### 📡 API Test Examples

**Test Backend API:**
```powershell
# Test API is running
curl http://localhost:5000

# Register a tourist
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"John Doe","email":"john@example.com","password":"123456","phone":"01712345678","userType":"tourist"}'

# Login
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"john@example.com","password":"123456"}'
```

### 📂 Important Files

**Backend:**
- `backend/server.js` - Main server file
- `backend/models/User.js` - User schema
- `backend/controllers/authController.js` - Authentication logic
- `.env` - Environment variables

**Frontend:**
- `frontend/src/App.js` - Main app component
- `frontend/src/pages/Home.js` - Homepage
- `frontend/src/pages/Login.js` - Login page
- `frontend/src/pages/Register.js` - Registration page
- `frontend/src/context/AuthContext.js` - Authentication state

### 🔧 Common Commands

**Backend:**
```powershell
npm run dev          # Start backend with nodemon
npm start            # Start backend (production)
```

**Frontend:**
```powershell
cd frontend
npm start            # Start React development server
npm run build        # Build for production
```

**Both:**
```powershell
npm run dev:full     # Start both servers (future use)
```

### 🎨 User Types & Features

| User Type | Registration Fields | Special Features |
|-----------|-------------------|------------------|
| **Tourist** | Name, Email, Phone, DOB | Referral codes, Wishlist, Bookings |
| **Hotel Owner** | Name, Email, Phone, Business Name | Manage hotels, View bookings |
| **Guide** | Name, Email, Phone, Experience | Set rates, Availability, Reviews |
| **Admin** | Name, Email, Phone | Full system access, Moderation |

### 📱 Bangladesh Phone Format
- Format: `01XXXXXXXXX`
- Example: `01712345678`
- Supported: Grameenphone, Robi, Banglalink, Airtel, Teletalk

### 🔐 Default Test Accounts

Create these accounts for testing:

**Admin:**
```json
{
  "email": "admin@roamingsonic.com",
  "password": "admin123",
  "name": "Admin User",
  "phone": "01700000000",
  "userType": "admin"
}
```

**Tourist:**
```json
{
  "email": "tourist@test.com",
  "password": "tourist123",
  "name": "Tourist User",
  "phone": "01711111111",
  "userType": "tourist"
}
```

### 🐛 Troubleshooting

**Backend not starting?**
- Check if MongoDB is running
- Verify .env file exists
- Check port 5000 is free

**Frontend not starting?**
- Check if backend is running first
- Verify node_modules installed (`npm install`)
- Check port 3000 is free

**Can't login?**
- Ensure you registered first
- Check email/password are correct
- Verify backend server is running

### 📚 Next Features to Build

1. **Hotels Module** - Add hotel listings and booking
2. **Bus Tickets** - Implement bus booking system
3. **Tours** - Create group tour management
4. **Payment** - Integrate bKash/Nagad
5. **Dashboard** - User-specific dashboards
6. **Reviews** - Rating system for all services
7. **Admin Panel** - Complete admin controls

### 🎉 You're All Set!

Your Roaming Sonic platform is ready for development!

**Visit http://localhost:3000 now and start exploring!**

---

**Need Help?** Check `SETUP_GUIDE.md` for detailed documentation.
