import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';

const GuideDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [formData, setFormData] = useState({
    experience: '',
    hourlyRate: '',
    languages: '',
    specializations: '',
    availability: true
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab') || 'overview';
    setActiveSection(tab);
  }, [location.search]);

  useEffect(() {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data.user);
      setFormData({
        experience: response.data.user.experience || '',
        hourlyRate: response.data.user.hourlyRate || '',
        languages: response.data.user.languages?.join(', ') || '',
        specializations: response.data.user.specializations?.join(', ') || '',
        availability: response.data.user.availability !== false
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...formData,
        languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      await userService.updateProfile(updateData);
      alert('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Guide Dashboard 🎯</h1>
        <p>Manage your guide profile and bookings</p>
      </div>

      {activeSection === 'overview' && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-details">
                <h3>Rating</h3>
                <p className="stat-value">{profile?.rating?.toFixed(1) || '0.0'}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-details">
                <h3>Total Reviews</h3>
                <p className="stat-value">{profile?.totalReviews || 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-details">
                <h3>Hourly Rate</h3>
                <p className="stat-value">৳{profile?.hourlyRate || 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-details">
                <h3>Availability</h3>
                <p className="stat-value" style={{fontSize: '16px'}}>
                  <span className={`badge ${profile?.availability ? 'badge-success' : 'badge-danger'}`}>
                    {profile?.availability ? 'Available' : 'Unavailable'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {(activeSection === 'overview' || activeSection === 'profile') && (
        <div className="content-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2>Guide Profile</h2>
            <button 
              className="btn-primary" 
              onClick={() => setEditing(!editing)}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="dashboard-form">
            <div className="form-row">
              <div className="form-group">
                <label>Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Hourly Rate (৳)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Languages (comma separated)</label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g., Bengali, English, Hindi"
              />
            </div>

            <div className="form-group">
              <label>Specializations (comma separated)</label>
              <input
                type="text"
                name="specializations"
                value={formData.specializations}
                onChange={handleChange}
                placeholder="e.g., Historical Tours, Adventure Tours"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleChange}
                  style={{width: 'auto', marginRight: '10px'}}
                />
                Available for bookings
              </label>
            </div>

            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <strong>Experience:</strong> {profile?.experience || 0} years
            </div>
            <div className="info-row">
              <strong>Hourly Rate:</strong> ৳{profile?.hourlyRate || 0}
            </div>
            <div className="info-row">
              <strong>Languages:</strong> {profile?.languages?.join(', ') || 'Not specified'}
            </div>
            <div className="info-row">
              <strong>Specializations:</strong> {profile?.specializations?.join(', ') || 'Not specified'}
            </div>
            <div className="info-row">
              <strong>NID Number:</strong> {profile?.nidNumber || 'Not provided'}
            </div>
            <div className="info-row">
              <strong>Passport Number:</strong> {profile?.passportNumber || 'Not provided'}
            </div>
          </div>
        )}
        </div>
      )}

      {activeSection === 'bookings' && (
        <div className="content-card">
          <h2>My Bookings 📅</h2>
          <p>Your booking history will appear here.</p>
        </div>
      )}

      {activeSection === 'reviews' && (
        <div className="content-card">
          <h2>Reviews & Ratings ⭐</h2>
          {profile?.reviews && profile.reviews.length > 0 ? (
            <div className="reviews-list">
              {profile.reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-rating">
                    {'⭐'.repeat(review.rating)}
                  </div>
                  <p>{review.comment}</p>
                  <small>{new Date(review.date).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default GuideDashboard;
