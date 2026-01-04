import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    alert('Logged out successfully!');
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🧳</span>
          <span className="logo-text">Roaming Sonic</span>
        </Link>

        <div className="navbar-links">
          <Link to="/hotels" className="nav-link">
            <span className="nav-icon">🏨</span>
            Hotels
          </Link>
          <Link to="/guides" className="nav-link">
            <span className="nav-icon">🧭</span>
            Guides
          </Link>
          <Link to="/buses" className="nav-link">
            <span className="nav-icon">🚌</span>
            Buses
          </Link>
          <Link to="/tours" className="nav-link">
            <span className="nav-icon">🎒</span>
            Tours
          </Link>
          <Link to="/group-tours" className="nav-link">
            <span className="nav-icon">👥</span>
            Group Tours
          </Link>
        </div>

        <div className="navbar-actions">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn-nav"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-btn nav-btn-dashboard">
                <span className="btn-icon">📊</span>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="nav-btn nav-btn-logout">
                <span className="btn-icon">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-login">
                <span className="btn-icon">🔐</span>
                Login
              </Link>
              <Link to="/register" className="nav-btn nav-btn-register">
                <span className="btn-icon">✨</span>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
