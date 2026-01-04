import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'tourist',
    // Tourist specific
    dateOfBirth: '',
    referredBy: '',
    // Hotel owner specific
    businessName: '',
    businessLicense: '',
    // Guide specific
    photo: '',
    bio: '',
    experience: '',
    hourlyRate: '',
    // NID/Passport (for all user types)
    nidNumber: '',
    passportNumber: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Phone validation for Bangladesh
    const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid Bangladesh phone number (e.g., 01712345678)');
      return;
    }

    if (formData.userType === 'hotel_owner' && !formData.businessName) {
      setError('Business name is required for hotel owners');
      return;
    }

    if (formData.userType === 'hotel_owner' && !formData.nidNumber) {
      setError('NID number is required for hotel owners');
      return;
    }

    if (formData.userType === 'guide' && !formData.nidNumber) {
      setError('NID number is required for guides');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      
      // Convert empty strings to undefined for optional fields
      Object.keys(registerData).forEach(key => {
        if (registerData[key] === '') {
          delete registerData[key];
        }
      });

      await register(registerData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button 
        onClick={toggleTheme} 
        className="theme-toggle-btn"
        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>Join Roaming Sonic</h2>
          <p>Create your account to explore Bangladesh</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* User Type Selection */}
          <div className="form-group">
            <label htmlFor="userType">Register As</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="tourist">Tourist</option>
              <option value="hotel_owner">Hotel/Resort Owner</option>
              <option value="guide">Tour Guide</option>
            </select>
          </div>

          {/* Common Fields */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01712345678"
              required
            />
            <small>Bangladesh phone number (e.g., 01712345678)</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              minLength="6"
            />
          </div>

          {/* Tourist Specific Fields */}
          {formData.userType === 'tourist' && (
            <>
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth (Optional)</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="referredBy">Referral Code (Optional)</label>
                <input
                  type="text"
                  id="referredBy"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  placeholder="Enter referral code if you have one"
                />
                <small>Get 10% discount when your referrer has 5 signups!</small>
              </div>
            </>
          )}

          {/* Hotel Owner Specific Fields */}
          {formData.userType === 'hotel_owner' && (
            <>
              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nidNumber">NID Number (Required)</label>
                <input
                  type="text"
                  id="nidNumber"
                  name="nidNumber"
                  value={formData.nidNumber}
                  onChange={handleChange}
                  placeholder="Enter your NID number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="passportNumber">Passport Number (Optional)</label>
                <input
                  type="text"
                  id="passportNumber"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  placeholder="Enter passport number if available"
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessLicense">Business License (Optional)</label>
                <input
                  type="text"
                  id="businessLicense"
                  name="businessLicense"
                  value={formData.businessLicense}
                  onChange={handleChange}
                  placeholder="Enter your business license number"
                />
              </div>
            </>
          )}

          {/* Guide Specific Fields */}
          {formData.userType === 'guide' && (
            <>
              <div className="form-group">
                <label htmlFor="nidNumber">NID Number (Required)</label>
                <input
                  type="text"
                  id="nidNumber"
                  name="nidNumber"
                  value={formData.nidNumber}
                  onChange={handleChange}
                  placeholder="Enter your NID number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="passportNumber">Passport Number (Optional)</label>
                <input
                  type="text"
                  id="passportNumber"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  placeholder="Enter passport number if available"
                />
              </div>

              <div className="form-group">
                <label htmlFor="photo">Profile Photo URL (Optional)</label>
                <input
                  type="url"
                  id="photo"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  placeholder="https://example.com/your-photo.jpg"
                />
                <small>Provide a URL to your profile photo</small>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio/Description</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell tourists about yourself, your experience, and what makes you a great guide..."
                  rows="3"
                  maxLength="500"
                />
                <small style={{color: '#666', fontSize: '12px'}}>
                  {formData.bio?.length || 0}/500 characters
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="experience">Years of Experience</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hourlyRate">Hourly Rate (BDT)</label>
                <input
                  type="number"
                  id="hourlyRate"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="500"
                  min="0"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
