import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Unauthorized = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Unauthorized Access</h1>
        <p>You don't have permission to access this page</p>
        <div className="home-buttons">
          <Link to="/" className="home-btn">Go Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
