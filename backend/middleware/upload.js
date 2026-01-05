const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directories exist
const uploadDirs = {
  profiles: path.join(__dirname, '../uploads/profiles'),
  tours: path.join(__dirname, '../uploads/tours'),
  hotels: path.join(__dirname, '../uploads/hotels')
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on fieldname
    if (file.fieldname === 'tourImages') {
      cb(null, uploadDirs.tours);
    } else if (file.fieldname === 'hotelPhotos') {
      cb(null, uploadDirs.hotels);
    } else {
      cb(null, uploadDirs.profiles);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let prefix = 'profile-';
    if (file.fieldname === 'tourImages') prefix = 'tour-';
    else if (file.fieldname === 'hotelPhotos') prefix = 'hotel-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
