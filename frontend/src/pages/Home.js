import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Roaming Sonic</h1>
        <p>Your Ultimate Travel Companion</p>
        <div className="home-buttons">
          <Link to="/login" className="home-btn">Login</Link>
          <Link to="/register" className="home-btn home-btn-outline">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
