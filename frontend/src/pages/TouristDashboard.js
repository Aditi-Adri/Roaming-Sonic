import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const TouristDashboard = () => {
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
          <p className="user-role">Tourist Dashboard</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎫</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Active Bookings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏨</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Hotel Reservations</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚌</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Bus Tickets</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Tour Groups Joined</p>
            </div>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎟️</div>
            <h3>Book Tickets</h3>
            <p>Browse and book bus tickets with seat selection</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏨</div>
            <h3>Find Hotels</h3>
            <p>Search and book hotels/resorts at your destination</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Join Tours</h3>
            <p>Explore and join upcoming group tours</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧭</div>
            <h3>Hire Guide</h3>
            <p>Find and hire experienced tour guides</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Use Coupons</h3>
            <p>Apply discount coupons to your bookings</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📜</div>
            <h3>Booking History</h3>
            <p>View all your past bookings and trips</p>
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
              <p><strong>Role:</strong> Tourist/User</p>
            </div>
          </div>

          <div className="info-card">
            <h3>🆘 Need Help?</h3>
            <p>Contact our support team for any assistance</p>
            <button className="btn-help">Emergency Contact</button>
            <button className="btn-help">File Complaint</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;
