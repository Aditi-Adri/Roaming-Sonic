import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Legal.css';

const Contact = () => {
  return (
    <div className="legal-container">
      <Navbar />
      <div className="legal-header" style={{marginTop: '80px'}}>
        <h1>Contact Support</h1>
        <p>We’re here to help with bookings, payments, and account issues.</p>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2>Support Channels</h2>
          <ul>
            <li>Email: support@roamingsonic.com</li>
            <li>Phone: +880-1234-567890</li>
            <li>Support Hours: 24/7</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Tips</h2>
          <ul>
            <li>For ticket issues, try viewing the ticket first, then use Ctrl+P to save as PDF.</li>
            <li>For login issues, try logging out and logging in again.</li>
            <li>Include your booking ID when contacting support.</li>
          </ul>
        </section>
      </div>

      <div className="legal-footer">
        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Contact;
