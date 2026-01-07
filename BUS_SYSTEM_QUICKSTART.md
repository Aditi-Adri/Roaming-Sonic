# 🚌 Bus Ticketing System - Quick Start Guide

## What's New? ✨

Your Roaming Sonic platform now has a **fully functional bus ticket booking system**!

## Key Features

### 1. 🎫 Book Bus Tickets
- Browse available buses
- Filter by route, date, type, price
- Instant booking confirmation
- Multiple seat booking

### 2. 📥 Download Tickets
- Professional PDF tickets
- Download from dashboard
- Print-ready format
- Includes barcode

### 3. 💰 70% Refund on Cancellation
- Cancel anytime
- Automatic refund calculation
- Example: Book for ৳1000 → Cancel → Get ৳700 back

### 4. ⭐ Review & Rating
- Rate bus services
- Write detailed reviews
- Only booked passengers can review
- Reviews visible on bus page

## How to Use

### For Users (Tourists)

1. **Book a Bus**
   ```
   Go to /buses page → Select bus → Click "Book Now"
   Fill details → Confirm → Done!
   ```

2. **View Bookings**
   ```
   Dashboard → Bookings tab → See all bus bookings
   ```

3. **Download Ticket**
   ```
   Dashboard → Find bus booking → Click "Download Ticket"
   Ticket opens in new window → Print or Save
   ```

4. **Cancel Booking**
   ```
   Dashboard → Find booking → Click "Cancel Booking"
   Confirm → Get 70% refund
   ```

5. **Write Review**
   ```
   /buses page → Find bus → Click "Write Review"
   Rate and comment → Submit
   ```

## API Endpoints

```
GET    /api/buses                    - List all buses
POST   /api/bookings                 - Create bus booking
GET    /api/bookings/my-bookings     - Get my bookings
GET    /api/bookings/:id/ticket      - Download ticket
PATCH  /api/bookings/:id/cancel      - Cancel booking (70% refund)
POST   /api/buses/:id/review         - Add review
```

## Files Modified

### Backend
- ✅ `models/Booking.js` - Added bus-specific fields
- ✅ `controllers/bookingController.js` - Added ticket PDF & refund logic
- ✅ `controllers/busController.js` - Enhanced review system
- ✅ `routes/bookingRoutes.js` - Added ticket route

### Frontend
- ✅ `pages/Buses.js` - Added booking & review modals
- ✅ `pages/Buses.css` - Added modal styles
- ✅ `pages/dashboards/TouristDashboard.js` - Added ticket download & cancel
- ✅ `components/Dashboard.css` - Added bus booking styles

## Testing the System

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   cd frontend
   npm start
   ```

3. **Test Flow**
   - Register/Login as Tourist
   - Go to Buses page
   - Book a bus ticket
   - Check Dashboard → Bookings
   - Download ticket
   - Try cancellation (get 70% refund)
   - Write a review

## Database Collections

### Bus Bookings Store:
- User reference
- Bus reference
- Travel date
- Seat numbers
- Passenger details
- Payment info
- Refund amount (if cancelled)

### Reviews Include:
- User who reviewed
- Rating (1-5 stars)
- Comment
- Date

## Refund Policy

| Action | Amount | Example |
|--------|--------|---------|
| Book | 100% | Pay ৳1000 |
| Cancel | Get 70% back | Receive ৳700 |
| Lost | 30% | Platform keeps ৳300 |

## Status Flow

```
Booking Created → CONFIRMED → [Can Cancel]
                             ↓
                         CANCELLED (70% refund)
```

## Important Notes

⚠️ **Only tourists can book buses**
⚠️ **Reviews require completed bookings**
⚠️ **Tickets only available for confirmed bookings**
⚠️ **70% refund on all cancellations**
⚠️ **One review per user per bus**

## Support

For issues or questions, check:
- Full documentation: `BUS_TICKETING_SYSTEM.md`
- API docs: `API_DOCUMENTATION.md`
- Testing guide: `TESTING_GUIDE.md`

---

**Ready to book your first bus ticket! 🚌**
