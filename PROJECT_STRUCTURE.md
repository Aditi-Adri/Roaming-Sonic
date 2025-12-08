# Roaming Sonic - Project Structure

```
ROAMING_SONIC/
│
├── backend/                          # Backend Node.js/Express Server
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   │
│   ├── controllers/                 # MVC Controllers - Business Logic
│   │   └── authController.js        # Authentication logic (register, login, logout, getMe)
│   │
│   ├── middleware/                  # Express Middleware
│   │   └── auth.js                  # JWT verification & role authorization
│   │
│   ├── models/                      # MVC Models - Data Schemas
│   │   └── User.js                  # User schema with Mongoose
│   │
│   ├── routes/                      # MVC Routes - API Endpoints
│   │   └── authRoutes.js            # Authentication routes
│   │
│   ├── node_modules/                # Backend dependencies
│   │
│   ├── .env                         # Environment variables (MongoDB URI, JWT secret, etc.)
│   ├── .gitignore                   # Files to ignore in git
│   ├── package.json                 # Backend dependencies and scripts
│   ├── package-lock.json            # Locked dependency versions
│   └── server.js                    # Main Express server file
│
├── frontend/                         # Frontend React Application
│   ├── public/                      # Static public files
│   │   ├── index.html               # Main HTML template
│   │   ├── favicon.ico              # Website icon
│   │   └── manifest.json            # PWA manifest
│   │
│   ├── src/                         # React source code
│   │   ├── components/              # Reusable React components
│   │   │   └── ProtectedRoute.js    # Route protection HOC
│   │   │
│   │   ├── context/                 # React Context for global state
│   │   │   └── AuthContext.js       # Authentication state management
│   │   │
│   │   ├── pages/                   # Page components (Views)
│   │   │   ├── Login.js             # Login page
│   │   │   ├── Register.js          # Registration page
│   │   │   ├── Home.js              # Landing page
│   │   │   ├── TouristDashboard.js  # Tourist/User dashboard
│   │   │   ├── HotelOwnerDashboard.js   # Hotel owner dashboard
│   │   │   ├── AdminDashboard.js    # Admin dashboard
│   │   │   ├── GuideDashboard.js    # Guide dashboard
│   │   │   ├── Unauthorized.js      # Unauthorized access page
│   │   │   ├── Auth.css             # Styles for auth pages
│   │   │   ├── Dashboard.css        # Styles for dashboards
│   │   │   └── Home.css             # Styles for home page
│   │   │
│   │   ├── services/                # API service layer
│   │   │   └── api.js               # Axios configuration & API calls
│   │   │
│   │   ├── utils/                   # Utility functions
│   │   │
│   │   ├── App.js                   # Main App component with routing
│   │   ├── App.css                  # App styles
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles
│   │
│   ├── node_modules/                # Frontend dependencies
│   │
│   ├── package.json                 # Frontend dependencies and scripts
│   ├── package-lock.json            # Locked dependency versions
│   └── .gitignore                   # Files to ignore in git
│
├── README.md                         # Comprehensive project documentation
└── QUICK_START.md                   # Quick start guide (this file)
```

## 📋 File Purposes

### Backend Files

**server.js**
- Entry point for Express server
- Sets up middleware (CORS, JSON parsing)
- Connects to MongoDB
- Defines API routes
- Error handling

**config/db.js**
- MongoDB connection logic
- Database configuration

**models/User.js**
- User data schema (name, email, password, role, etc.)
- Password hashing with bcrypt
- Password comparison method

**controllers/authController.js**
- `register()` - Create new user account
- `login()` - Authenticate user and return JWT
- `getMe()` - Get current logged-in user
- `logout()` - Logout user

**routes/authRoutes.js**
- Maps HTTP methods to controller functions
- Applies middleware (protect, authorize)

**middleware/auth.js**
- `protect()` - Verify JWT token
- `authorize()` - Check user role permissions

**.env**
- Environment variables
- MongoDB connection string
- JWT secret key
- Port configuration

### Frontend Files

**App.js**
- Main routing configuration
- Route protection setup
- AuthProvider wrapper

**context/AuthContext.js**
- Global authentication state
- Login/logout functions
- User information storage

**services/api.js**
- Axios instance with base URL
- JWT token interceptor
- API call methods (register, login, logout)

**pages/Login.js**
- Login form UI
- Form validation
- Error handling
- Role-based redirection

**pages/Register.js**
- Registration form UI
- Role selection dropdown
- Password confirmation
- Form validation

**components/ProtectedRoute.js**
- Higher-order component
- Checks authentication
- Checks role authorization
- Redirects if unauthorized

**pages/*Dashboard.js**
- Role-specific dashboard pages
- Display user information
- Logout functionality

## 🔄 Data Flow

### Registration Flow
1. User fills registration form → `Register.js`
2. Form submits to → `AuthContext.register()`
3. API call to → `POST /api/auth/register`
4. Server validates → `authController.register()`
5. User created in → MongoDB (`User` model)
6. JWT token generated and sent back
7. Token stored in localStorage
8. User redirected to role-specific dashboard

### Login Flow
1. User fills login form → `Login.js`
2. Form submits to → `AuthContext.login()`
3. API call to → `POST /api/auth/login`
4. Server validates → `authController.login()`
5. User verified from MongoDB
6. JWT token generated and sent back
7. Token stored in localStorage
8. User redirected to role-specific dashboard

### Protected Route Access
1. User tries to access dashboard
2. `ProtectedRoute` component checks → localStorage for token
3. If no token → redirect to `/login`
4. If token exists → verify role
5. If role doesn't match → redirect to `/unauthorized`
6. If authorized → render dashboard

## 🎯 MVC Architecture Implementation

### Model (Data Layer)
- **Location**: `backend/models/`
- **Responsibility**: Define data structure and database operations
- **Example**: `User.js` defines user schema and methods

### View (Presentation Layer)
- **Location**: `frontend/src/pages/` and `frontend/src/components/`
- **Responsibility**: UI and user interaction
- **Example**: `Login.js`, `Register.js`, dashboards

### Controller (Business Logic Layer)
- **Location**: `backend/controllers/`
- **Responsibility**: Handle requests, process data, send responses
- **Example**: `authController.js` handles authentication logic

### Routes (URL Mapping)
- **Location**: `backend/routes/`
- **Responsibility**: Map URLs to controller functions
- **Example**: `authRoutes.js` maps `/api/auth/*` to auth functions

## 🔐 Security Implementation

1. **Password Security**
   - Hashed with bcrypt (12 salt rounds)
   - Never stored in plain text
   - Never sent in API responses

2. **JWT Authentication**
   - Token generated on login/register
   - Stored in localStorage (frontend)
   - Sent in Authorization header
   - Verified on protected routes

3. **Role-Based Access**
   - User role stored in database
   - Checked on frontend (ProtectedRoute)
   - Verified on backend (authorize middleware)

4. **CORS Protection**
   - Only allows requests from http://localhost:3000
   - Credentials enabled

## 📦 Dependencies

### Backend Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT creation/verification
- `dotenv` - Environment variables
- `cors` - Cross-origin resource sharing
- `cookie-parser` - Cookie parsing
- `validator` - Data validation
- `nodemon` - Auto-restart (dev)

### Frontend Dependencies
- `react` - UI library
- `react-dom` - React rendering
- `react-router-dom` - Routing
- `axios` - HTTP client
- `react-scripts` - Build tools

---

This structure follows industry best practices for MERN stack applications with clear separation of concerns.
