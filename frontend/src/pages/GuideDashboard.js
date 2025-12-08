import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const GuideDashboard = () => {
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
          <p className="user-role">Tour Guide Dashboard</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Tours Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Active Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Average Rating</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>$0</h3>
              <p>Earnings</p>
            </div>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Create Profile</h3>
            <p>Build your professional guide profile</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Add Experience</h3>
            <p>Showcase your expertise and certifications</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Set Destinations</h3>
            <p>List locations where you provide services</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💵</div>
            <h3>Set Pricing</h3>
            <p>Define your service rates and packages</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>View Reviews</h3>
            <p>Read customer reviews and feedback</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Manage Tours</h3>
            <p>View and organize your tour schedule</p>
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
              <p><strong>Role:</strong> Tour Guide</p>
              <p><strong>Status:</strong> Pending Admin Approval</p>
            </div>
          </div>

          <div className="info-card">
            <h3>📋 Getting Started</h3>
            <p>Complete your profile to start receiving bookings</p>
            <ul className="guide-checklist">
              <li>✓ Account Created</li>
              <li>⏳ Add profile information</li>
              <li>⏳ Upload certificates</li>
              <li>⏳ Wait for admin approval</li>
              <li>⏳ Start accepting tours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
