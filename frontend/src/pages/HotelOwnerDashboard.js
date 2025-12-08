import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const HotelOwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>Roaming Sonic</h2>
        </div>
        <div className="nav-user">
          <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=667eea&color=fff`} alt="User" className="user-avatar" />
          <span>{user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}!</h1>
          <p className="user-role">Hotel Owner Dashboard</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏨</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Total Properties</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Active Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>$0</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">➕</div>
            <h3>Add Hotel/Resort</h3>
            <p>List your new property with details and photos</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✏️</div>
            <h3>Manage Properties</h3>
            <p>Update hotel details, prices, and availability</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>Upload Photos</h3>
            <p>Add attractive images of your properties</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💵</div>
            <h3>Set Pricing</h3>
            <p>Manage room rates and seasonal pricing</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>View Bookings</h3>
            <p>Track all reservations and customer details</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Reviews & Ratings</h3>
            <p>View customer feedback and ratings</p>
            <button className="btn-feature">Coming Soon</button>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>📱 Your Profile</h3>
            <div className="profile-details">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phoneNumber || 'Not provided'}</p>
              <p><strong>Role:</strong> Hotel/Resort Owner</p>
            </div>
          </div>

          <div className="info-card">
            <h3>📈 Quick Stats</h3>
            <p>Your properties are pending approval by admin</p>
            <p>Start by adding your first hotel or resort!</p>
            <button className="btn-help">Get Started Guide</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelOwnerDashboard;
