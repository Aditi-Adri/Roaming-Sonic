import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const AdminDashboard = () => {
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
          <h2>Roaming Sonic - Admin</h2>
        </div>
        <div className="nav-user">
          <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=667eea&color=fff`} alt="User" className="user-avatar" />
          <span>{user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Admin Control Panel</h1>
          <p className="user-role">System Administrator</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏨</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Hotels Listed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚌</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Buses Active</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🧭</div>
            <div className="stat-info">
              <h3>0</h3>
              <p>Active Guides</p>
            </div>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card admin-card">
            <div className="feature-icon">👤</div>
            <h3>User Management</h3>
            <p>View, manage, and moderate all user accounts</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card admin-card">
            <div className="feature-icon">🏨</div>
            <h3>Hotel Management</h3>
            <p>Add, approve, or remove hotels and resorts</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card admin-card">
            <div className="feature-icon">🚌</div>
            <h3>Bus Management</h3>
            <p>Add buses, routes, and ticket pricing</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card admin-card">
            <div className="feature-icon">✅</div>
            <h3>Approve Guides</h3>
            <p>Review and approve guide profile applications</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card admin-card">
            <div className="feature-icon">🌍</div>
            <h3>Manage Tours</h3>
            <p>Organize and permit group tour packages</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card admin-card">
            <div className="feature-icon">📋</div>
            <h3>Handle Complaints</h3>
            <p>Review and resolve user complaints</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card admin-card">
            <div className="feature-icon">💰</div>
            <h3>Refund Management</h3>
            <p>Process and approve refund requests</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card admin-card">
            <div className="feature-icon">🗑️</div>
            <h3>Remove Content</h3>
            <p>Remove inappropriate profiles or listings</p>
            <button className="btn-feature">Coming Soon</button>
          </div>

          <div className="feature-card admin-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>View platform statistics and reports</p>
            <button className="btn-feature">Coming Soon</button>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>🔐 Admin Profile</h3>
            <div className="profile-details">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phoneNumber || 'Not provided'}</p>
              <p><strong>Role:</strong> System Administrator</p>
              <p><strong>Access Level:</strong> Full Control</p>
            </div>
          </div>

          <div className="info-card">
            <h3>⚠️ Recent Activity</h3>
            <p>No recent admin activities</p>
            <p>System is running smoothly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
