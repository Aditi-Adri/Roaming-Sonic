# Admin Dashboard - Quick Start Guide

## ✅ Features Implemented

### 1. **Consistent Dashboard Design**
- Uses the same `DashboardLayout` component as Tourist, Guide, and Hotel Owner dashboards
- Sidebar navigation with user info
- **Logout button included** in the sidebar footer
- Responsive design

### 2. **Admin Functions**

#### Overview Tab
- 6 stat cards showing:
  - Total Users
  - Tourists
  - Guides
  - Hotel Owners
  - Pending Guides (needs approval)
  - Total Bookings

#### Hotels Tab
- View all hotels
- Approve pending hotels
- Reject hotels
- Delete hotels
- See verification status

#### Guides Tab
- View pending guide applications
- See guide details (experience, languages, specializations)
- Approve guides (makes them public)
- Reject guide applications
- Badge shows count of pending approvals

#### Bookings Tab
- View all bookings
- Confirm pending bookings
- Cancel bookings
- Mark confirmed bookings as completed
- See booking details (user, type, amount, date)

#### Tours Tab
- View all tour packages
- **Add new tour** button (shows/hides form)
- Create tour form with:
  - Title, Destination, Description
  - Duration (days/nights)
  - Price, Max Group Size
  - Category (8 options)
  - Difficulty (4 levels)
  - Includes/Excludes lists
- Edit existing tours
- Delete tours
- See tour ratings

#### Users Tab
- View all users
- Change user roles via dropdown
- Delete users (cannot delete self)
- See user details (email, phone, join date)
- Prevent self-role changes

## 🚀 How to Access

### Admin Login
```
URL: http://localhost:3000/login
Email: admin@roamingsonic.com
Password: Admin@2025
```

### Navigation
1. Login with admin credentials
2. Click on sidebar menu items
3. Click "Dashboard" (📊) to see overview
4. Use tabs at the top to switch between sections
5. **Logout**: Click the logout button (🚪) at the bottom of the sidebar

## 🎯 Quick Actions

### Approve a Guide
1. Go to "Guides" tab (🎯)
2. See list of pending guides
3. Review their experience and languages
4. Click "✓ Approve" button
5. Guide becomes visible on `/guides` page

### Create Tour Package
1. Go to "Tours" tab (🗺️)
2. Click "+ Add New Tour" button
3. Fill in the form:
   - Required: Title, Destination, Description, Days, Nights, Price, Category, Difficulty
   - Optional: Includes, Excludes, Max Group Size
4. Click "Create Tour"
5. Tour appears in the table below
6. Tour becomes visible on `/tours` page

### Manage Users
1. Go to "Users" tab (👥)
2. Find the user in the table
3. Change role: Select from dropdown (Tourist, Guide, Hotel Owner, Admin)
4. Delete user: Click "🗑️ Delete" button
5. Cannot delete yourself or change your own role

### Approve Hotels
1. Go to "Hotels" tab (🏨)
2. See hotels with "pending" status
3. Click "✓ Approve" to approve
4. Click "✗ Reject" to reject
5. Click "🗑️ Delete" to remove hotel

## ✅ Working Features

✅ **Logout Button** - Located in sidebar footer  
✅ **Overview Stats** - Real-time counts from database  
✅ **Hotel Approval** - Approve/reject/delete hotels  
✅ **Guide Approval** - Approve/reject pending guides  
✅ **Tour Management** - Full CRUD operations  
✅ **User Management** - Change roles, delete users  
✅ **Booking Management** - Confirm/cancel/complete bookings  
✅ **Responsive Design** - Works on mobile/tablet  
✅ **Tab Navigation** - Easy switching between sections  
✅ **Form Validation** - Required fields marked  
✅ **Error Handling** - User-friendly error messages  

## 🔐 Security Features

- JWT authentication required for all admin actions
- Admin-only access (other roles redirected)
- Cannot delete own account
- Cannot change own role
- Confirmation dialogs for destructive actions
- Token stored in localStorage
- Protected API endpoints

## 📱 Responsive Features

- Sidebar collapses on mobile
- Tables scroll horizontally on small screens
- Action buttons stack vertically on mobile
- Tab navigation scrollable on mobile
- Forms adapt to screen size

## 🎨 UI Consistency

- Same sidebar design as other dashboards
- Consistent stat cards
- Uniform button styles
- Color-coded status badges:
  - 🟢 Green = Success/Approved
  - 🟡 Yellow = Warning/Pending
  - 🔴 Red = Danger/Rejected
- Professional data tables
- Clean form layouts

## 🐛 Troubleshooting

### "Failed to fetch data"
- Ensure backend is running on port 5000
- Check MongoDB is connected
- Verify JWT token is valid

### Tour creation fails
- Fill all required fields (marked with *)
- Days and Nights must be numbers
- Price must be a number
- Includes/Excludes are optional

### Can't change user role
- You cannot change your own role
- Must be logged in as admin
- Check if dropdown actually changed

### Logout not working
- Look for logout button at bottom of sidebar
- It has a 🚪 icon and "Logout" text
- Click it to logout and return to login page

## 🎉 Success Indicators

Everything is working if:
- ✅ You can login as admin
- ✅ Sidebar shows your name and "admin" role
- ✅ Overview tab shows statistics
- ✅ All 6 tabs are visible and clickable
- ✅ Tables load data correctly
- ✅ Approve/reject buttons work
- ✅ Tour creation form appears
- ✅ User role dropdown is functional
- ✅ Logout button logs you out
- ✅ No console errors

## 📊 Expected Data

On fresh install:
- Total Users: 1 (admin)
- Tourists: 0
- Guides: 0
- Hotel Owners: 0
- Pending Guides: 0
- Total Bookings: 0
- Hotels: 5 (seeded)
- Tours: 0 (create your first!)

## 🔗 Related Pages

- Homepage: http://localhost:3000
- Login: http://localhost:3000/login
- Hotels: http://localhost:3000/hotels
- Guides: http://localhost:3000/guides
- Buses: http://localhost:3000/buses
- Tours: http://localhost:3000/tours

## 🎓 Tips

1. **Pending Guides Badge**: The Guides tab shows a red badge with count of pending approvals
2. **Quick Add Tour**: Click "+ Add New Tour" to toggle the form
3. **Edit Tours**: Click "✏️ Edit" to modify a tour, then "Update Tour"
4. **Cancel Edit**: Click "Cancel" button or "✗ Cancel" to reset form
5. **Status Colors**: Green=good, Yellow=pending, Red=problem
6. **Sidebar Toggle**: Click ◀/▶ button to collapse/expand sidebar
7. **Home Button**: Click 🏠 in sidebar to go to homepage
8. **Refresh Data**: Switch tabs to refresh data

All features are now working with the standard dashboard layout! 🎉
