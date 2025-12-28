# Tour Booking System API Documentation

## Overview
Complete tour package booking system with member limits, admin approval, reviews, and tour completion tracking.

## Features Implemented

### 1. User Can Book Tour Packages
- **Endpoint**: `POST /api/bookings`
- **Access**: Private (Authenticated users)
- **Body**:
```json
{
  "bookingType": "tour",
  "tour": "tourId",
  "numberOfMembers": 2,
  "travelDate": "2025-01-15",
  "totalAmount": 5000,
  "specialRequests": "Vegetarian meals"
}
```
- **Features**:
  - Checks if tour has ended
  - Validates available slots (maxGroupSize)
  - Automatically increments currentMembers
  - Status starts as "pending" awaiting admin approval

### 2. Admin Approves/Rejects Bookings
- **Endpoint**: `PATCH /api/bookings/:id/status`
- **Access**: Private (Admin only)
- **Body**:
```json
{
  "status": "confirmed",
  "adminNotes": "Approved with premium guide"
}
```
- **Status Options**: `pending`, `confirmed`, `cancelled`, `completed`
- **Features**:
  - Admin can approve or reject bookings
  - Rejecting frees up tour slots
  - Admin can add notes

### 3. User Can Cancel Bookings
- **Endpoint**: `PATCH /api/bookings/:id/cancel`
- **Access**: Private (Owner only)
- **Features**:
  - User can cancel their own bookings
  - Cannot cancel completed tours
  - Automatically frees up tour slots
  - Updates currentMembers count

### 4. Member Limit Enforcement
- **Model Update**: Added `currentMembers` field to TourPackage
- **Logic**: 
  - Checks `currentMembers + numberOfMembers <= maxGroupSize`
  - Rejects booking if full
  - Returns available slots in error message
  - Updates on booking/cancellation

### 5. User Reviews After Completion
- **Endpoint**: `POST /api/tours/:id/review`
- **Access**: Private (Must have completed the tour)
- **Body**:
```json
{
  "rating": 5,
  "comment": "Amazing experience!"
}
```
- **Features**:
  - Only users with completed bookings can review
  - One review per user per tour
  - Updates tour average rating
  - Stores review in both Tour and Booking models

### 6. Admin Marks Tour as Ended
- **Endpoint**: `PATCH /api/tours/:id/end`
- **Access**: Private (Admin only)
- **Features**:
  - Sets `isEnded` to true
  - Sets `isActive` to false (no new bookings)
  - Auto-completes all confirmed bookings
  - Users can now leave reviews

## Updated Models

### TourPackage Model
```javascript
{
  maxGroupSize: Number,      // Max capacity
  currentMembers: Number,    // Current bookings
  isEnded: Boolean,          // Tour completed flag
  // ... existing fields
}
```

### Booking Model
```javascript
{
  numberOfMembers: Number,   // Members in this booking
  userReview: {              // User's review after completion
    rating: Number,
    comment: String,
    date: Date
  },
  // ... existing fields
}
```

## User Workflow

1. **Booking**:
   - User browses tours
   - Clicks "Book Tour"
   - Selects number of members
   - System checks availability
   - Creates booking with "pending" status

2. **Admin Review**:
   - Admin views pending bookings
   - Approves or rejects
   - Can add admin notes

3. **Cancellation**:
   - User can cancel before completion
   - Slots are freed automatically

4. **Tour Completion**:
   - Admin marks tour as ended
   - All confirmed bookings become "completed"
   - Users can now submit reviews

5. **Review**:
   - User submits rating and comment
   - Review appears on tour page
   - Average rating is updated

## API Endpoints Summary

### Tours
- `GET /api/tours` - Get all tours
- `GET /api/tours/:id` - Get tour details
- `POST /api/tours` - Create tour (Admin)
- `PUT /api/tours/:id` - Update tour (Admin)
- `DELETE /api/tours/:id` - Delete tour (Admin)
- `POST /api/tours/:id/review` - Add review (User, completed only)
- `PATCH /api/tours/:id/end` - Mark tour ended (Admin)

### Bookings
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/my-bookings` - Get user's bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/status` - Update status (Admin)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (User)
- `GET /api/bookings/stats` - Booking statistics (Admin)

## Error Handling

### Common Errors:
- **Tour Full**: "Not enough space. Only X slots available"
- **Tour Ended**: "This tour has already ended"
- **No Permission**: "You can only review tours you have completed"
- **Already Reviewed**: "You have already reviewed this tour"
- **Cannot Cancel**: "Cannot cancel completed bookings"

## Testing the System

1. **Create a tour as Admin**
2. **Book tour as User** - Should show "pending"
3. **Admin approves** - Status becomes "confirmed"
4. **Try to book when full** - Should reject
5. **User cancels** - Slots freed
6. **Admin ends tour** - Status becomes "completed"
7. **User adds review** - Rating updates

## Notes
- Reviews require completed bookings
- Member limits are enforced in real-time
- Cancelled bookings free up slots immediately
- Admin approval required for all bookings
