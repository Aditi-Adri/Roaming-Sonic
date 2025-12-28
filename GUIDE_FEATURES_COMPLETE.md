# Guide Functionality - Implementation Complete ✅

## Overview
Comprehensive guide role functionality has been implemented, allowing guides to manage their profiles, accept connection requests, and display reviews from tourists.

## Backend Changes

### 1. Models Created/Updated

#### GuideRequest Model (`backend/models/GuideRequest.js`)
- New model for managing tourist-guide connection requests
- Fields: tourist, guide, destination, tourDate, duration, numberOfPeople, message, status, totalCost, responseMessage
- Statuses: pending, approved, rejected, completed
- Indexed for efficient queries

#### User Model Updates (`backend/models/User.js`)
- Added `reviews` array to guide profiles
- Each review contains: user, rating (1-5), comment, date
- Reviews integrated with existing rating and totalReviews fields

### 2. Controllers Created

#### Guide Request Controller (`backend/controllers/guideRequestController.js`)
- `createGuideRequest()` - Tourist sends connection request to guide
- `getGuideRequests()` - Guide views all their requests
- `getTouristRequests()` - Tourist views their sent requests
- `updateRequestStatus()` - Guide approves/rejects requests
- `addGuideReview()` - Tourist reviews guide after completed tour

#### User Controller Updates (`backend/controllers/userController.js`)
- `uploadPhoto()` - Upload profile picture with multer

### 3. Middleware

#### Upload Middleware (`backend/middleware/upload.js`)
- Multer configuration for image uploads
- Accepts: jpeg, jpg, png, gif
- Max file size: 5MB
- Saves to: `uploads/profiles/`

### 4. Routes

#### Guide Request Routes (`backend/routes/guideRequestRoutes.js`)
- `POST /api/guide-requests` - Send connection request (tourist)
- `GET /api/guide-requests/tourist` - Get tourist's requests
- `GET /api/guide-requests/guide` - Get guide's requests
- `PATCH /api/guide-requests/:id` - Update request status (guide)
- `POST /api/guide-requests/:id/review` - Add review (tourist)

#### User Routes Updates (`backend/routes/userRoutes.js`)
- `POST /api/users/upload-photo` - Upload profile photo

#### Server Updates (`backend/server.js`)
- Added guide request routes
- Serving static uploads folder
- Installed multer package

## Frontend Changes

### 1. Guide Dashboard (`frontend/src/pages/dashboards/GuideDashboard.js`)

#### Features Added:
- **Profile Photo Upload**
  - Displays current photo or avatar placeholder
  - Click to upload new photo (supports image files)
  - Shows upload progress
  - Preview updates automatically

- **Enhanced Profile Editor**
  - Name, phone, bio fields
  - Experience, hourly rate
  - Languages (comma-separated)
  - Specializations (comma-separated)
  - NID and Passport numbers
  - Availability toggle

- **Tab Navigation**
  - Overview - Stats and profile
  - Connection Requests - Manage tourist requests
  - Reviews & Ratings - View all reviews

- **Connection Requests Section**
  - View all pending, approved, rejected requests
  - Display tourist details, destination, date, duration, cost
  - Approve/Reject buttons for pending requests
  - Add response message
  - Color-coded status badges

- **Reviews Section**
  - Display all reviews with ratings
  - Show star ratings visually
  - Display review comments and dates
  - Summary stats in overview

### 2. Guides Page (`frontend/src/pages/Guides.js`)

#### Features Added:
- **Updated Guide Cards**
  - Display profile photos from backend
  - Show bio if available
  - Experience, languages, specializations
  - Hourly rate prominently displayed

- **Send Request Button**
  - Only visible to logged-in tourists
  - Opens connection request modal
  - Disabled for non-tourists with message

- **Connection Request Modal**
  - Destination input
  - Tour date picker (future dates only)
  - Duration selector (1-24 hours)
  - Number of people
  - Custom message textarea
  - Calculates and displays total estimated cost
  - Form validation

### 3. Styling

#### Guide Dashboard CSS (`frontend/src/pages/dashboards/AdminDashboard.css`)
- Request card styles with hover effects
- Status badge colors
- Action button layouts
- Review item formatting
- Responsive design

#### Guides Page CSS (`frontend/src/pages/Guides.css`)
- Modal overlay and content
- Animated modal entrance
- Request form styling
- Total cost display
- Responsive modal layout

## User Flow

### Tourist Flow:
1. Browse guides on `/guides` page with filters
2. Click "Send Request" on desired guide
3. Fill connection request form (destination, date, duration, etc.)
4. Submit request
5. View request status in their dashboard
6. After completed tour, add review and rating

### Guide Flow:
1. Upload profile photo from dashboard
2. Edit complete profile (bio, experience, languages, etc.)
3. View incoming connection requests in "Connection Requests" tab
4. Review request details (tourist info, destination, date, cost)
5. Approve or reject with response message
6. View all reviews in "Reviews & Ratings" tab
7. See updated rating and stats in overview

## API Endpoints Summary

```
# Guide Requests
POST   /api/guide-requests              - Create request (tourist)
GET    /api/guide-requests/tourist      - Get tourist's requests
GET    /api/guide-requests/guide        - Get guide's requests
PATCH  /api/guide-requests/:id          - Update status (guide)
POST   /api/guide-requests/:id/review   - Add review (tourist)

# User (Photo Upload)
POST   /api/users/upload-photo          - Upload profile photo

# Guides (Existing)
GET    /api/guides                       - Get all approved guides
GET    /api/guides/:id                   - Get single guide
```

## Database Schema

### GuideRequest
```javascript
{
  tourist: ObjectId (ref: User),
  guide: ObjectId (ref: User),
  destination: String,
  tourDate: Date,
  duration: Number (hours),
  numberOfPeople: Number,
  message: String (max 500),
  status: 'pending' | 'approved' | 'rejected' | 'completed',
  totalCost: Number,
  responseMessage: String,
  respondedAt: Date,
  createdAt: Date
}
```

### User (Guide Reviews)
```javascript
{
  reviews: [{
    user: ObjectId (ref: User),
    rating: Number (1-5),
    comment: String (max 500),
    date: Date
  }],
  rating: Number,
  totalReviews: Number
}
```

## File Structure

```
backend/
├── models/
│   ├── GuideRequest.js (NEW)
│   └── User.js (UPDATED - added reviews array)
├── controllers/
│   ├── guideRequestController.js (NEW)
│   └── userController.js (UPDATED - added uploadPhoto)
├── middleware/
│   └── upload.js (NEW)
├── routes/
│   ├── guideRequestRoutes.js (NEW)
│   └── userRoutes.js (UPDATED)
├── uploads/
│   └── profiles/ (AUTO-CREATED)
└── server.js (UPDATED)

frontend/
├── pages/
│   ├── Guides.js (UPDATED - added modal)
│   ├── Guides.css (UPDATED - modal styles)
│   └── dashboards/
│       ├── GuideDashboard.js (COMPLETELY REBUILT)
│       └── AdminDashboard.css (UPDATED - request/review styles)
```

## Testing Checklist

### Backend:
- ✅ Multer installed and configured
- ✅ Upload directory auto-creates
- ✅ GuideRequest model with indexes
- ✅ All controller functions created
- ✅ Routes protected by auth middleware
- ✅ Role-based access (tourist/guide)
- ✅ Static uploads folder served

### Frontend:
- ✅ Photo upload UI with preview
- ✅ Three-tab navigation in guide dashboard
- ✅ Connection request cards with actions
- ✅ Reviews display with star ratings
- ✅ Modal with form validation
- ✅ Estimated cost calculation
- ✅ Tourist-only request button
- ✅ Responsive design

## Next Steps

To fully test:
1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm start`
3. Register as guide and tourist accounts
4. Guide: Upload photo, complete profile
5. Tourist: Browse guides, send connection request
6. Guide: View and approve request from dashboard
7. Mark tour as completed (via request)
8. Tourist: Add review and rating

## Notes

- Image uploads stored in `backend/uploads/profiles/`
- Photos accessible at `http://localhost:5000/uploads/profiles/filename.jpg`
- Reviews calculate average rating automatically
- Connection requests include estimated cost based on hourly rate
- Guide can add response message when approving/rejecting
- Only completed tours can be reviewed
- Reviews are one per guide per user

---

**Status**: ✅ All features implemented and ready for testing
