# Quick Test Guide - Roaming Sonic Admin Features

## 🧪 Testing Checklist

### 1. Test Admin Login
```
✅ URL: http://localhost:3000/login
✅ Email: admin@roamingsonic.com
✅ Password: Admin@2025
✅ Expected: Redirects to dashboard with admin view
```

### 2. Test Dashboard Tabs
```
✅ Overview Tab
   - Shows 6 stat cards
   - Displays counts for users, hotels, guides, bookings
   - Revenue displayed in Taka (৳)

✅ Hotels Tab
   - Table shows all hotels
   - Pending hotels show Approve/Reject buttons
   - All hotels show Delete button
   - Actions work and refresh data

✅ Guides Tab (Count badge shows pending number)
   - Table shows pending guides only
   - Displays: name, email, experience, languages, specializations
   - Approve button sets guide as approved
   - Reject button denies application
   - Actions refresh the list

✅ Bookings Tab
   - Shows all bookings (currently empty)
   - Will display: user, type, details, amount, status
   - Pending bookings have Confirm/Cancel buttons
   - Confirmed bookings have Complete button

✅ Tour Packages Tab
   - Form to create new tour (top section)
   - List of existing tours (bottom section)
   - Create form has:
     * Title, Destination (required)
     * Description textarea (required)
     * Days, Nights, Price, Max Group (numbers)
     * Category dropdown (8 options)
     * Difficulty dropdown (4 levels)
     * Includes/Excludes (comma-separated)
   - Edit button fills form with tour data
   - Delete button removes tour with confirmation
   - Cancel button clears form

✅ Users Tab
   - Table shows all users
   - Role dropdown per user (changeable)
   - Delete button (can't delete self)
   - Shows join date, email, phone
```

### 3. Test Guide Approval Workflow
```
Step 1: Register as guide
   - Go to http://localhost:3000/register
   - Select "Tour Guide" role
   - Fill in: name, email, password
   - Fill guide fields: experience, languages, specializations
   - Submit

Step 2: Check guide status
   - Guide won't appear on http://localhost:3000/guides (not approved)
   - Guide approvalStatus is "pending"

Step 3: Admin approves
   - Login as admin
   - Go to Guides tab
   - See new guide in pending list
   - Click "Approve"
   - Guide isApproved becomes true

Step 4: Verify approval
   - Visit http://localhost:3000/guides
   - Now guide appears in public list
   - Guide can be hired by tourists
```

### 4. Test Tour Package Creation
```
Step 1: Login as admin
   - Email: admin@roamingsonic.com
   - Password: Admin@2025

Step 2: Create tour package
   - Dashboard → Tour Packages tab
   - Fill form:
     Title: "Cox's Bazar Beach Paradise"
     Destination: "Cox's Bazar"
     Description: "Experience the longest natural sea beach..."
     Days: 3
     Nights: 2
     Price: 8500
     Max Group: 15
     Category: Beach
     Difficulty: Easy
     Includes: "Hotel, Meals, Transport, Guide"
     Excludes: "Personal expenses, Tips"
   - Click "Create Tour"

Step 3: Verify creation
   - Tour appears in list below
   - Shows: title, destination, duration, price, category, rating
   - Edit button works
   - Delete button works

Step 4: Check public page
   - Visit http://localhost:3000/tours
   - New tour appears in grid
   - All details visible
   - Filters work
```

### 5. Test User Role Management
```
Step 1: View users
   - Admin dashboard → Users tab
   - See all registered users

Step 2: Change role
   - Find a tourist user
   - Click role dropdown
   - Change from "tourist" to "hotel_owner"
   - Role updates automatically
   - User can now add hotels

Step 3: Add another admin
   - Find a trusted user
   - Change role to "admin"
   - That user now has full admin access
   - Original admin can't change their own role

Step 4: Delete user
   - Select a test user
   - Click "Delete" button
   - Confirm deletion
   - User removed from system
   - Admin can't delete themselves
```

### 6. Test Public Tours Page
```
✅ URL: http://localhost:3000/tours
✅ Features to test:
   - All tours display in grid
   - Category filter works
   - Difficulty filter works
   - Price range filter works
   - Featured only checkbox works
   - Reset filters button works
   - Tour cards show:
     * Featured badge (if featured)
     * Tour image or placeholder
     * Category badge
     * Title and destination
     * Duration (3D/2N format)
     * Max group size
     * Rating and review count
     * Difficulty badge (color-coded)
     * Includes list (first 3)
     * Price in Taka
     * Book Now button
   - Click "Book Now" → Login required
```

### 7. Test Hotel Approval Workflow
```
Step 1: Register as hotel owner
   - http://localhost:3000/register
   - Select "Hotel Owner" role
   - Fill details

Step 2: Add hotel
   - Login → Dashboard
   - Click "Add Hotel" button
   - Fill hotel details
   - Submit
   - Hotel verificationStatus = "pending"

Step 3: Admin reviews
   - Login as admin
   - Hotels tab
   - See pending hotel
   - Click "Approve" or "Reject"
   - Status updates

Step 4: Check public page
   - http://localhost:3000/hotels
   - Approved hotels visible
   - Pending/rejected hotels hidden
```

### 8. Test Navigation
```
✅ Homepage (http://localhost:3000)
   - Services section has 4 cards:
     1. Find Hotels → /hotels
     2. Hire a Guide → /guides
     3. Book Bus Tickets → /buses
     4. Tour Packages → /tours (NEW)
   
✅ All service cards clickable
✅ "Go to Dashboard" button in top-right (after login)
✅ Dashboard tabs navigation smooth
```

### 9. Test Responsive Design
```
✅ Desktop (1400px+)
   - All features visible
   - 3-4 columns in tour grid
   - Sidebar stays left

✅ Tablet (768px-1024px)
   - Sidebar moves above content
   - 2 columns in tour grid
   - Tables scroll horizontally

✅ Mobile (< 768px)
   - 1 column layout
   - Stat cards stack
   - Tables scroll
   - Buttons stack vertically
```

## 🎯 Expected Results

### Admin Dashboard Stats (Fresh Install)
```
Total Users: 1 (admin)
Total Hotels: 5 (seeded)
Total Guides: 0 (need to register and approve)
Total Bookings: 0 (none created yet)
Pending Guides: 0 (none registered yet)
Total Revenue: ৳0 (no paid bookings)
```

### API Endpoints Working
```
✅ GET /api/users/admin/stats
✅ GET /api/bookings/stats
✅ GET /api/hotels
✅ GET /api/guides/admin/pending
✅ GET /api/bookings
✅ GET /api/tours
✅ GET /api/users/admin/all
✅ POST /api/tours (admin only)
✅ PUT /api/tours/:id (admin only)
✅ DELETE /api/tours/:id (admin only)
✅ PATCH /api/guides/:id/approval (admin only)
✅ PATCH /api/hotels/:id/verify (admin only)
✅ PATCH /api/users/admin/:id/role (admin only)
✅ DELETE /api/users/admin/:id (admin only)
```

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch data"
```
Solution:
- Check backend is running on port 5000
- Check MongoDB is connected
- Check console for CORS errors
```

### Issue: Tour creation fails
```
Solution:
- Ensure all required fields filled
- Days/Nights must be numbers
- Price must be number
- Includes/Excludes are optional
```

### Issue: Can't approve guide
```
Solution:
- Guide must have role="guide"
- Guide must have approvalStatus="pending"
- Admin must be logged in
- Check JWT token is valid
```

### Issue: User role change doesn't work
```
Solution:
- Can't change your own role
- Must be admin to change roles
- Check dropdown actually changed value
- Check network tab for API call
```

## ✨ Success Indicators

### Everything Working If:
```
✅ Admin can login successfully
✅ All 6 tabs visible and load data
✅ Stats show correct numbers
✅ Tour creation works and appears in list
✅ Tour appears on /tours page
✅ Guide approval changes status
✅ Hotel approval/rejection works
✅ User role can be changed
✅ Delete user works (not self)
✅ No console errors
✅ Backend shows no errors
✅ MongoDB connected message visible
```

## 🚀 Quick Demo Flow

### Complete Feature Demonstration:
```
1. Open http://localhost:3000
2. See new "Tour Packages" card in services
3. Click "Tour Packages" → Browse tours page
4. Go back, click "Go to Dashboard" → Login
5. Login as admin (admin@roamingsonic.com / Admin@2025)
6. See Overview tab with stats
7. Click "Tour Packages" tab
8. Create a new tour package
9. See it appear in list
10. Click "Users" tab
11. See all users
12. Click "Guides" tab (if any pending)
13. Approve a guide
14. Visit /guides to see approved guide
15. All features working! 🎉
```

## 📸 Visual Checks

### Admin Dashboard Should Look Like:
```
- Purple gradient header "Admin Dashboard"
- 6 colorful gradient stat cards
- Horizontal tab bar (Overview, Hotels, Guides, etc.)
- Professional data tables
- Color-coded status badges
- Action buttons (green=approve, red=reject/delete, yellow=edit)
- Form with proper spacing and labels
- Responsive on mobile
```

### Tours Page Should Look Like:
```
- Purple gradient header "Explore Tour Packages"
- Left sidebar with filters (sticky)
- Right content area with tour grid
- Tour cards with images/placeholders
- Featured badge on some tours
- Difficulty badges (color-coded)
- Book Now buttons
- Clean, modern design
```

All features are fully implemented and ready to test! 🚀
