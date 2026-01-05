const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key-change-this', {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      userType,
      referredBy,
      // Tourist specific
      dateOfBirth,
      nidNumber,
      passportNumber,
      // Hotel owner specific
      businessName,
      businessLicense,
      // Guide specific
      experience,
      languages,
      specializations,
      hourlyRate,
      bio
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate user type
    const validUserTypes = ['tourist', 'hotel_owner', 'guide'];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type. Must be tourist, hotel_owner, or guide'
      });
    }

    // Create user object
    const userData = {
      name,
      email,
      password,
      phone,
      userType
    };

    // Add type-specific fields
    if (userType === 'tourist') {
      if (dateOfBirth) userData.dateOfBirth = dateOfBirth;
      if (nidNumber) userData.nidNumber = nidNumber;
      if (referredBy) userData.referredBy = referredBy;
    } else if (userType === 'hotel_owner') {
      if (!businessName) {
        return res.status(400).json({
          success: false,
          message: 'Business name is required for hotel owners'
        });
      }
      if (!nidNumber) {
        return res.status(400).json({
          success: false,
          message: 'NID number is required for hotel owners'
        });
      }
      userData.businessName = businessName;
      userData.nidNumber = nidNumber;
      if (passportNumber) userData.passportNumber = passportNumber;
      if (businessLicense) userData.businessLicense = businessLicense;
    } else if (userType === 'guide') {
      if (!nidNumber) {
        return res.status(400).json({
          success: false,
          message: 'NID number is required for guides'
        });
      }
      userData.nidNumber = nidNumber;
      if (passportNumber) userData.passportNumber = passportNumber;
      userData.experience = experience || 0;
      if (languages) userData.languages = languages;
      if (specializations) userData.specializations = specializations;
      if (hourlyRate) userData.hourlyRate = hourlyRate;
      if (bio) userData.bio = bio;
      // Set guide-specific approval fields
      userData.isApproved = false;
      userData.approvalStatus = 'pending';
    }

    // Create user
    const user = await User.create(userData);

    // Handle referral
    if (userType === 'tourist' && referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy, userType: 'tourist' });
      if (referrer) {
        referrer.referralCount += 1;
        await referrer.save();
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user type matches (if provided)
    if (userType && user.userType !== userType) {
      return res.status(401).json({
        success: false,
        message: `Please login as ${user.userType}`
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.status(200).json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user data',
      error: error.message
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};
