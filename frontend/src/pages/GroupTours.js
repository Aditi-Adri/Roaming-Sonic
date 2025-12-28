import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './GroupTours.css';

const GroupTours = () => {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [groupTours, setGroupTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroupTours();
  }, []);

  const fetchGroupTours = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/group-tours');
      console.log('Group tours response:', response.data);
      setGroupTours(response.data.data || []);
    } catch (error) {
      console.error('Error fetching group tours:', error);
      console.error('Error response:', error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (tourId) => {
    if (!isAuthenticated) {
      alert('Please login to join a group tour');
      navigate('/login');
      return;
    }

    if (user.userType !== 'tourist') {
      alert('Only tourists can join group tours');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/group-tours/${tourId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Join request sent successfully! Awaiting host approval.');
      fetchGroupTours();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error sending join request';
      alert('❌ ' + errorMsg);
    }
  };

  const isUserInTour = (tour) => {
    if (!user) return false;
    if (tour.host._id === user._id) return 'host';
    const member = tour.members.find(m => m.user._id === user._id);
    return member ? member.status : false;
  };

  return (
    <div className="group-tours-page">
      <div className="group-tours-header">
        <div className="header-nav">
          <Link to="/" className="home-btn">🏠 Home</Link>
          {user ? (
            <Link to="/dashboard" className="home-btn">📊 Dashboard</Link>
          ) : (
            <Link to="/login" className="home-btn">🔐 Login</Link>
          )}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <h1>Group Tours</h1>
        <p>Join fellow travelers and explore Bangladesh together</p>
      </div>

      <div className="group-tours-container">
        {loading ? (
          <div className="loading">Loading group tours...</div>
        ) : groupTours.length === 0 ? (
          <div className="no-results">
            <p>No group tours available at the moment</p>
            {user && user.userType === 'tourist' && (
              <Link to="/dashboard?section=group-tours" className="btn-primary">
                Create Your Own Group Tour
              </Link>
            )}
          </div>
        ) : (
          <div className="group-tours-grid">
            {groupTours.map((tour) => {
              const userStatus = isUserInTour(tour);
              
              return (
                <div key={tour._id} className="group-tour-card">
                  {tour.isFull && <div className="full-badge">Full</div>}
                  {tour.status === 'completed' && <div className="completed-badge">Completed</div>}
                  {tour.status === 'cancelled' && <div className="cancelled-badge">Cancelled</div>}
                  
                  <div className="tour-header">
                    <h3>{tour.title}</h3>
                    <div className="host-info">
                      <span className="host-label">Hosted by:</span>
                      <span className="host-name">{tour.host?.name || 'Unknown'}</span>
                    </div>
                  </div>

                  <div className="tour-details">
                    <div className="detail-item">
                      <span className="icon">📍</span>
                      <span>{tour.destination}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">📅</span>
                      <span>{new Date(tour.tourDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">⏰</span>
                      <span>{tour.meetingTime} at {tour.meetingPoint}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">💰</span>
                      <span>৳{tour.costPerPerson?.toLocaleString() || 0} per person</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">👥</span>
                      <span>{tour.currentMembers || 0}/{tour.maxMembers || 0} members</span>
                    </div>
                  </div>

                  <p className="tour-description">{tour.description}</p>

                  {tour.includes && (
                    <div className="tour-includes">
                      <strong>What's Included:</strong>
                      <p>{tour.includes}</p>
                    </div>
                  )}

                  <div className="tour-footer">
                    {userStatus === 'host' ? (
                      <span className="host-badge">You are the host</span>
                    ) : userStatus === 'pending' ? (
                      <span className="pending-badge">Request Pending</span>
                    ) : userStatus === 'approved' ? (
                      <span className="approved-badge">You're Joined ✅</span>
                    ) : userStatus === 'rejected' ? (
                      <span className="rejected-badge">Request Rejected</span>
                    ) : (
                      <button 
                        className="join-btn"
                        onClick={() => handleJoinRequest(tour._id)}
                        disabled={tour.isFull || tour.status !== 'active' || (user && user.userType !== 'tourist')}
                      >
                        {tour.isFull ? 'Full' : tour.status === 'completed' ? 'Completed' : tour.status === 'cancelled' ? 'Cancelled' : (user && user.userType !== 'tourist') ? 'Tourist Only' : 'Request to Join'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupTours;
