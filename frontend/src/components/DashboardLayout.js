import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Dashboard.css';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const commonItems = user?.userType === 'admin' ? [
      { path: '/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/dashboard/change-password', icon: '🔐', label: 'Change Password' }
    ] : user?.userType === 'guide' ? [
      { path: '/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/dashboard/change-password', icon: '🔐', label: 'Change Password' }
    ] : user?.userType === 'hotel_owner' ? [
      { path: '/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/dashboard/change-password', icon: '🔐', label: 'Change Password' }
    ] : [
      { path: '/dashboard', icon: '📊', label: 'Dashboard' },
      { path: '/dashboard/profile', icon: '👤', label: 'Profile' },
      { path: '/dashboard/change-password', icon: '🔐', label: 'Change Password' }
    ];

    let roleItems = [];

    if (user?.userType === 'tourist') {
      roleItems = [
        { path: '/dashboard?tab=bookings', icon: '🎫', label: 'My Bookings' },
        { path: '/dashboard?tab=guides', icon: '🧭', label: 'My Guides' },
        { path: '/dashboard?tab=group-tours', icon: '👥', label: 'Group Tours' },
        { path: '/dashboard?tab=wishlist', icon: '❤️', label: 'Wishlist' }
      ];
    } else if (user?.userType === 'guide') {
      roleItems = [
        { path: '/dashboard?tab=bookings', icon: '📅', label: 'My Bookings' },
        { path: '/dashboard?tab=profile', icon: '👤', label: 'Edit Profile' }
      ];
    } else if (user?.userType === 'hotel_owner') {
      roleItems = [
        { path: '/dashboard/hotels', icon: '🏨', label: 'Manage Hotels' }
      ];
    } else if (user?.userType === 'admin') {
      roleItems = [
        { path: '/dashboard?tab=users', icon: '👥', label: 'Manage Users' },
        { path: '/dashboard?tab=hotels', icon: '🏨', label: 'Manage Hotels' },
        { path: '/dashboard?tab=guides', icon: '🎯', label: 'Manage Guides' },
        { path: '/dashboard?tab=bookings', icon: '📋', label: 'All Bookings' },
        { path: '/dashboard?tab=tours', icon: '🗺️', label: 'Tour Packages' },
        { path: '/dashboard?tab=buses', icon: '🚌', label: 'Manage Buses' }
      ];
    }

    return [...commonItems, ...roleItems];
  };

  return (
    <div className="dashboard-container">
      {/* External Toggle Button (always visible) */}
      {!sidebarOpen && (
        <button 
          className="sidebar-toggle-external"
          onClick={() => setSidebarOpen(true)}
          title="Open Sidebar"
        >
          ☰
        </button>
      )}
      
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <h2>
              🧳
              {sidebarOpen && <span className="logo-text"> Roaming Sonic</span>}
            </h2>
          </Link>
          {sidebarOpen && (
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ◀
            </button>
          )}
        </div>

        <div className="user-info">
          <div className="user-avatar">
            {user?.photo && user.photo !== 'default-avatar.png' ? (
              <img src={`http://localhost:5000${user.photo}`} alt={user?.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            ) : (
              <div className="avatar-placeholder">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {sidebarOpen && (
            <div className="user-details">
              <h3>{user?.name}</h3>
              <span className="user-role">{user?.userType?.replace('_', ' ')}</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {getMenuItems().map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="nav-item"
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="nav-item theme-toggle">
            <span className="nav-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            {sidebarOpen && <span className="nav-label">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
          </button>
          <Link to="/" className="nav-item">
            <span className="nav-icon">🏠</span>
            {sidebarOpen && <span className="nav-label">Home</span>}
          </Link>
          <button onClick={handleLogout} className="nav-item logout-btn">
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`dashboard-main ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
