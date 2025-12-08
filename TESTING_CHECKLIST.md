# Testing Checklist - Roaming Sonic Application

## ✅ Pre-Testing Setup
- [x] MongoDB is running (check MongoDB Compass)
- [x] Backend server running on http://localhost:5000
- [x] Frontend app running on http://localhost:3000
- [x] Browser is open at http://localhost:3000

## 🧪 Test Cases to Execute

### 1. Registration Tests

#### Test 1.1: Register Tourist
- [ ] Go to http://localhost:3000
- [ ] Click "Register" button
- [ ] Fill in form:
  - Name: "Alex Tourist"
  - Email: "alex@tourist.com"
  - Phone: "1234567890"
  - Role: "Tourist/User"
  - Password: "tourist123"
  - Confirm Password: "tourist123"
- [ ] Click "Register"
- [ ] **Expected**: Redirect to Tourist Dashboard
- [ ] **Expected**: See "Welcome, Alex Tourist!"
- [ ] **Expected**: See role as "Tourist/User"

#### Test 1.2: Register Hotel Owner
- [ ] Logout from current account
- [ ] Click "Register"
- [ ] Fill in form:
  - Name: "Sarah Hotel Owner"
  - Email: "sarah@hotel.com"
  - Phone: "9876543210"
  - Role: "Hotel/Resort Owner"
  - Password: "hotel123"
  - Confirm Password: "hotel123"
- [ ] Click "Register"
- [ ] **Expected**: Redirect to Hotel Owner Dashboard
- [ ] **Expected**: See "Welcome, Sarah Hotel Owner!"

#### Test 1.3: Register Guide
- [ ] Logout and register new account
- [ ] Name: "Mike Guide"
- [ ] Email: "mike@guide.com"
- [ ] Role: "Tour Guide"
- [ ] Password: "guide123"
- [ ] **Expected**: Redirect to Guide Dashboard

#### Test 1.4: Register Admin
- [ ] Logout and register new account
- [ ] Name: "Admin User"
- [ ] Email: "admin@roaming.com"
- [ ] Role: "Website Admin"
- [ ] Password: "admin123"
- [ ] **Expected**: Redirect to Admin Dashboard

#### Test 1.5: Duplicate Email
- [ ] Try to register with existing email
- [ ] **Expected**: Error message "User already exists with this email"

#### Test 1.6: Password Mismatch
- [ ] Fill registration form
- [ ] Password: "test123"
- [ ] Confirm Password: "different123"
- [ ] **Expected**: Error "Passwords do not match"

#### Test 1.7: Invalid Email
- [ ] Fill form with invalid email: "notanemail"
- [ ] **Expected**: Browser validation error

#### Test 1.8: Short Password
- [ ] Use password less than 6 characters: "123"
- [ ] **Expected**: Validation error

### 2. Login Tests

#### Test 2.1: Valid Login - Tourist
- [ ] Click "Login"
- [ ] Email: "alex@tourist.com"
- [ ] Password: "tourist123"
- [ ] Click "Login"
- [ ] **Expected**: Redirect to Tourist Dashboard
- [ ] **Expected**: See correct user information

#### Test 2.2: Valid Login - Hotel Owner
- [ ] Logout and login with:
- [ ] Email: "sarah@hotel.com"
- [ ] Password: "hotel123"
- [ ] **Expected**: Redirect to Hotel Owner Dashboard

#### Test 2.3: Valid Login - Guide
- [ ] Logout and login with:
- [ ] Email: "mike@guide.com"
- [ ] Password: "guide123"
- [ ] **Expected**: Redirect to Guide Dashboard

#### Test 2.4: Valid Login - Admin
- [ ] Logout and login with:
- [ ] Email: "admin@roaming.com"
- [ ] Password: "admin123"
- [ ] **Expected**: Redirect to Admin Dashboard

#### Test 2.5: Invalid Password
- [ ] Email: "alex@tourist.com"
- [ ] Password: "wrongpassword"
- [ ] **Expected**: Error "Invalid email or password"

#### Test 2.6: Non-existent User
- [ ] Email: "nonexistent@email.com"
- [ ] Password: "password123"
- [ ] **Expected**: Error "Invalid email or password"

#### Test 2.7: Empty Fields
- [ ] Try to submit with empty email
- [ ] **Expected**: Browser validation error
- [ ] Try to submit with empty password
- [ ] **Expected**: Browser validation error

### 3. Protected Routes Tests

#### Test 3.1: Access Dashboard Without Login
- [ ] Logout completely
- [ ] Try to access: http://localhost:3000/tourist-dashboard
- [ ] **Expected**: Redirect to /login
- [ ] Try: http://localhost:3000/admin-dashboard
- [ ] **Expected**: Redirect to /login

#### Test 3.2: Wrong Role Access
- [ ] Login as Tourist (alex@tourist.com)
- [ ] Try to access: http://localhost:3000/admin-dashboard
- [ ] **Expected**: Redirect to /unauthorized
- [ ] Try: http://localhost:3000/hotel-owner-dashboard
- [ ] **Expected**: Redirect to /unauthorized

#### Test 3.3: Correct Role Access
- [ ] Login as Tourist
- [ ] Access: http://localhost:3000/tourist-dashboard
- [ ] **Expected**: Dashboard loads successfully

### 4. Logout Tests

#### Test 4.1: Logout Functionality
- [ ] Login to any account
- [ ] Click "Logout" button
- [ ] **Expected**: Redirect to login page
- [ ] Try to access dashboard again
- [ ] **Expected**: Redirect to login (not authenticated)

### 5. UI/UX Tests

#### Test 5.1: Responsive Design
- [ ] Resize browser window to mobile size
- [ ] **Expected**: Layout adapts properly
- [ ] Test on different screen sizes
- [ ] **Expected**: All elements remain accessible

#### Test 5.2: Form Validation Visual Feedback
- [ ] Focus on input fields
- [ ] **Expected**: Border color changes (blue highlight)
- [ ] Submit with errors
- [ ] **Expected**: Error messages displayed in red

#### Test 5.3: Button States
- [ ] Click "Login" or "Register"
- [ ] **Expected**: Button shows loading state
- [ ] **Expected**: Button text changes to "Logging in..." or "Creating Account..."
- [ ] **Expected**: Button is disabled during submission

#### Test 5.4: Animations
- [ ] Navigate to login page
- [ ] **Expected**: Card slides up smoothly
- [ ] Navigate to dashboard
- [ ] **Expected**: Content fades in

### 6. Database Tests

#### Test 6.1: Data Persistence
- [ ] Open MongoDB Compass
- [ ] Connect to: mongodb://localhost:27017
- [ ] Navigate to database: "roaming_sonic"
- [ ] Open collection: "users"
- [ ] **Expected**: See all registered users
- [ ] **Expected**: Passwords are hashed (not plain text)
- [ ] **Expected**: All user fields are present

#### Test 6.2: Password Hashing
- [ ] In MongoDB, check password field
- [ ] **Expected**: Format like "$2a$12$..."
- [ ] **Expected**: Different users have different hashes even with same password

### 7. API Tests

#### Test 7.1: Health Check
Open PowerShell and run:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
```
- [ ] **Expected**: `{ success: true, message: "Server is running" }`

#### Test 7.2: Register API
```powershell
$body = @{
    name = "API Test User"
    email = "apitest@test.com"
    password = "test123"
    role = "tourist"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```
- [ ] **Expected**: Success response with token and user data

#### Test 7.3: Login API
```powershell
$body = @{
    email = "apitest@test.com"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.data.token
```
- [ ] **Expected**: Success response with token

#### Test 7.4: Protected Route (Get Me)
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers $headers
```
- [ ] **Expected**: User data returned

#### Test 7.5: Protected Route Without Token
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET
```
- [ ] **Expected**: Error "Not authorized to access this route"

### 8. Browser DevTools Tests

#### Test 8.1: Local Storage
- [ ] Open browser DevTools (F12)
- [ ] Go to Application → Local Storage → http://localhost:3000
- [ ] Login to account
- [ ] **Expected**: See "token" key with JWT value
- [ ] **Expected**: See "user" key with user JSON data
- [ ] Logout
- [ ] **Expected**: Both items are removed

#### Test 8.2: Network Requests
- [ ] Open DevTools → Network tab
- [ ] Submit login form
- [ ] **Expected**: POST request to http://localhost:5000/api/auth/login
- [ ] **Expected**: Status 200 on success
- [ ] **Expected**: Response contains token and user data

#### Test 8.3: Console Errors
- [ ] Open DevTools → Console
- [ ] Navigate through app
- [ ] **Expected**: No red errors (warnings are okay)

### 9. Security Tests

#### Test 9.1: SQL Injection (Should Fail)
- [ ] Try login with email: `' OR '1'='1`
- [ ] **Expected**: Login fails (no SQL injection possible with MongoDB)

#### Test 9.2: XSS Attempt (Should be Safe)
- [ ] Register with name: `<script>alert('XSS')</script>`
- [ ] **Expected**: React escapes the script, no alert shows

#### Test 9.3: JWT Token Tampering
- [ ] Login and get token from localStorage
- [ ] Modify a few characters in the token
- [ ] Try to access protected route
- [ ] **Expected**: "Not authorized" error

### 10. Error Handling Tests

#### Test 10.1: Server Offline
- [ ] Stop backend server (Ctrl+C in backend terminal)
- [ ] Try to login from frontend
- [ ] **Expected**: Error message shown
- [ ] Restart backend server

#### Test 10.2: Network Error Handling
- [ ] Open DevTools → Network
- [ ] Set throttling to "Offline"
- [ ] Try to login
- [ ] **Expected**: Error message displayed
- [ ] Set back to "No throttling"

## 📊 Test Results Summary

### Total Tests: 45+
- Registration: 8 tests
- Login: 7 tests
- Protected Routes: 3 tests
- Logout: 1 test
- UI/UX: 4 tests
- Database: 2 tests
- API: 5 tests
- Browser: 3 tests
- Security: 3 tests
- Error Handling: 2 tests

### Pass Rate Target: 100%

## 🐛 Common Issues and Solutions

### Issue: Can't connect to MongoDB
**Solution:** 
- Open MongoDB Compass and ensure connection works
- Check backend/.env for correct MONGODB_URI

### Issue: CORS error
**Solution:**
- Ensure backend is running on port 5000
- Ensure frontend is running on port 3000

### Issue: Login not working
**Solution:**
- Clear browser localStorage
- Check browser console for errors
- Verify backend is running

### Issue: Token expired
**Solution:**
- Logout and login again
- Token expires after 7 days

## ✅ Final Verification

After all tests:
- [ ] All 4 user roles can register
- [ ] All 4 user roles can login
- [ ] Each role sees correct dashboard
- [ ] Logout works properly
- [ ] Protected routes are secure
- [ ] Data is saved in MongoDB
- [ ] UI is responsive and smooth
- [ ] No console errors
- [ ] API endpoints work correctly
- [ ] Security measures are in place

---

## 🎯 Testing Complete!

**If all tests pass:** Your application is ready for demonstration! ✅

**If some tests fail:** Check the error messages and refer to troubleshooting guides in README.md

**Good luck with your course project!** 🚀
