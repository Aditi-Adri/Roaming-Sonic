# Roaming Sonic API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

Body (Tourist):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "phone": "01712345678",
  "userType": "tourist",
  "dateOfBirth": "1995-01-15",  // Optional
  "referredBy": "ABC12345"      // Optional referral code
}

Body (Hotel Owner):
{
  "name": "Hotel Manager",
  "email": "hotel@example.com",
  "password": "123456",
  "phone": "01712345678",
  "userType": "hotel_owner",
  "businessName": "Luxury Hotel Ltd",
  "businessLicense": "HL-12345"  // Optional
}

Body (Guide):
{
  "name": "Tour Guide",
  "email": "guide@example.com",
  "password": "123456",
  "phone": "01712345678",
  "userType": "guide",
  "experience": 5,               // Years
  "hourlyRate": 500,             // BDT
  "languages": ["Bengali", "English"],
  "specializations": ["Historical Tours", "Adventure"]
}

Response (Success - 201):
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "123456",
  "userType": "tourist"  // Optional - helps with validation
}

Response (Success - 200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "userType": "tourist",
      "phone": "01712345678",
      "referralCode": "ABC12345",
      "isActive": true,
      "isVerified": false,
      "createdAt": "2025-12-22T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

Response (Error - 401):
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}

Response (Success - 200):
{
  "success": true,
  "data": {
    "user": { /* current user object */ }
  }
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {token}

Response (Success - 200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

## User Endpoints

### Get User Profile
```http
GET /users/profile
Authorization: Bearer {token}

Response (Success - 200):
{
  "success": true,
  "data": {
    "user": {
      /* Full user profile with populated references */
      "bookings": [...],
      "wishlist": [...],
      "hotels": [...]  // For hotel owners
    }
  }
}
```

### Update User Profile
```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

Body (Tourist example):
{
  "name": "John Updated",
  "phone": "01712345679",
  "dateOfBirth": "1995-01-15",
  "address": {
    "street": "123 Main St",
    "city": "Dhaka",
    "district": "Dhaka",
    "division": "Dhaka",
    "zipCode": "1200"
  },
  "preferredPaymentMethod": "bkash",
  "bkashNumber": "01712345678"
}

Body (Guide example):
{
  "name": "Guide Updated",
  "languages": ["Bengali", "English", "Hindi"],
  "specializations": ["Historical Tours", "Adventure", "Food Tours"],
  "hourlyRate": 600,
  "availability": true
}

Response (Success - 200):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

### Get All Guides (Public)
```http
GET /users/guides
Optional Query Parameters:
  - language: Filter by language (e.g., ?language=English)
  - specialization: Filter by specialization
  - minRating: Minimum rating (e.g., ?minRating=4)
  - maxRate: Maximum hourly rate (e.g., ?maxRate=1000)

Example: GET /users/guides?language=English&minRating=4

Response (Success - 200):
{
  "success": true,
  "count": 5,
  "data": {
    "guides": [
      {
        "_id": "...",
        "name": "Expert Guide",
        "userType": "guide",
        "experience": 5,
        "languages": ["Bengali", "English"],
        "specializations": ["Historical Tours"],
        "hourlyRate": 500,
        "rating": 4.5,
        "totalReviews": 23,
        "availability": true
      },
      // ... more guides
    ]
  }
}
```

### Get Guide by ID (Public)
```http
GET /users/guides/:id

Example: GET /users/guides/6587f1b2c3d4e5f6a7b8c9d0

Response (Success - 200):
{
  "success": true,
  "data": {
    "guide": {
      "_id": "6587f1b2c3d4e5f6a7b8c9d0",
      "name": "Expert Guide",
      "email": "guide@example.com",
      "phone": "01712345678",
      "userType": "guide",
      "experience": 5,
      "languages": ["Bengali", "English"],
      "specializations": ["Historical Tours", "Adventure"],
      "certifications": [
        {
          "name": "Professional Tour Guide",
          "issuer": "Bangladesh Tourism Board",
          "date": "2020-01-15"
        }
      ],
      "hourlyRate": 500,
      "rating": 4.5,
      "totalReviews": 23,
      "availability": true,
      "createdAt": "2023-12-15T..."
    }
  }
}

Response (Error - 404):
{
  "success": false,
  "message": "Guide not found"
}
```

### Add to Wishlist (Tourist Only)
```http
POST /users/wishlist/:hotelId
Authorization: Bearer {token}

Example: POST /users/wishlist/6587f1b2c3d4e5f6a7b8c9d1

Response (Success - 200):
{
  "success": true,
  "message": "Added to wishlist",
  "data": {
    "wishlist": ["6587f1b2c3d4e5f6a7b8c9d1", ...]
  }
}

Response (Error - 400):
{
  "success": false,
  "message": "Hotel already in wishlist"
}

Response (Error - 403):
{
  "success": false,
  "message": "Access denied. This resource is only available to tourist"
}
```

### Remove from Wishlist (Tourist Only)
```http
DELETE /users/wishlist/:hotelId
Authorization: Bearer {token}

Example: DELETE /users/wishlist/6587f1b2c3d4e5f6a7b8c9d1

Response (Success - 200):
{
  "success": true,
  "message": "Removed from wishlist",
  "data": {
    "wishlist": [...]
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Not authorized. Please login to access this resource."
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied. This resource is only available to tourist"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Something went wrong!",
  "error": "Detailed error message (development only)"
}
```

## Authentication Flow

1. **Register** → Receive JWT token
2. **Store token** in localStorage/sessionStorage
3. **Include token** in all protected requests:
   ```
   Authorization: Bearer {your-jwt-token}
   ```
4. **Token expires** after 30 days
5. **Logout** → Remove token from storage

## Example Usage (JavaScript/Axios)

```javascript
// Registration
const response = await axios.post('http://localhost:5000/api/auth/register', {
  name: 'John Doe',
  email: 'john@example.com',
  password: '123456',
  phone: '01712345678',
  userType: 'tourist'
});

// Store token
localStorage.setItem('token', response.data.data.token);

// Authenticated request
const profileResponse = await axios.get('http://localhost:5000/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

## User Model Fields

### Common Fields (All Users)
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, min 6 chars)
- `phone` (String, required, BD format)
- `userType` (String, required: tourist/hotel_owner/admin/guide)
- `photo` (String, default: default-avatar.png)
- `isActive` (Boolean, default: true)
- `isVerified` (Boolean, default: false)
- `preferredPaymentMethod` (String: cash/bkash/nagad/card)
- `bkashNumber` (String)
- `nagadNumber` (String)

### Tourist Specific
- `dateOfBirth` (Date)
- `address` (Object: street, city, district, division, zipCode)
- `nidNumber` (String)
- `passportNumber` (String)
- `bookings` (Array of Booking IDs)
- `wishlist` (Array of Hotel IDs)
- `referralCode` (String, auto-generated)
- `referredBy` (String)
- `referralCount` (Number, default: 0)

### Hotel Owner Specific
- `businessName` (String, required)
- `businessLicense` (String)
- `hotels` (Array of Hotel IDs)

### Guide Specific
- `experience` (Number, years)
- `languages` (Array of Strings)
- `specializations` (Array of Strings)
- `certifications` (Array of Objects)
- `hourlyRate` (Number, BDT)
- `availability` (Boolean, default: true)
- `rating` (Number, 0-5)
- `totalReviews` (Number, default: 0)

### Admin Specific
- `adminLevel` (String: super/moderator)

## Phone Number Validation

Bangladesh phone numbers must match:
- Format: `01XXXXXXXXX` (11 digits)
- Can start with: `+880`, `880`, or `0`
- Second digit must be: `1`
- Third digit must be: `3-9`
- Followed by 8 more digits

Examples:
- ✅ `01712345678`
- ✅ `8801712345678`
- ✅ `+8801712345678`
- ❌ `1712345678`
- ❌ `01212345678`

## Rate Limiting (Future Implementation)

Recommended limits:
- Registration: 5 per hour per IP
- Login: 10 per hour per IP
- API calls: 100 per minute per user

---

**Last Updated:** December 22, 2025  
**API Version:** 1.0.0  
**Base URL:** http://localhost:5000/api
