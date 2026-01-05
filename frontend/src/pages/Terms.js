import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Legal.css';

const Terms = () => {
  return (
    <div className="legal-container">
      <Navbar />
      <div className="legal-header" style={{marginTop: '80px'}}>
        <h1>Terms & Conditions</h1>
        <p>Last Updated: December 22, 2025</p>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Roaming Sonic ("the Platform"), you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to these Terms and Conditions, please do not use 
            our services.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. User Registration</h2>
          <p>
            To access certain features of the Platform, you must register for an account. You agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password and accept all risks of unauthorized access</li>
            <li>Immediately notify us of any unauthorized use of your account</li>
          </ul>
          <p>
            You are responsible for all activities that occur under your account. We reserve the right to 
            suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. User Types and Responsibilities</h2>
          <h3>3.1 Tourists</h3>
          <ul>
            <li>Must provide accurate booking information</li>
            <li>Are responsible for timely payment of services</li>
            <li>Must respect cancellation policies</li>
            <li>Should provide honest reviews and ratings</li>
          </ul>

          <h3>3.2 Hotel/Resort Owners</h3>
          <ul>
            <li>Must provide accurate hotel information and availability</li>
            <li>Required to maintain valid business licenses</li>
            <li>Must honor confirmed bookings</li>
            <li>Are responsible for the quality of services advertised</li>
          </ul>

          <h3>3.3 Tour Guides</h3>
          <ul>
            <li>Must possess valid certifications and licenses</li>
            <li>Are required to provide accurate information about their services</li>
            <li>Must maintain professional conduct during tours</li>
            <li>Are responsible for tourist safety during guided tours</li>
          </ul>

          <h3>3.4 Administrators</h3>
          <ul>
            <li>Have the authority to moderate content and user accounts</li>
            <li>May remove content that violates platform policies</li>
            <li>Can suspend or terminate accounts for policy violations</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Booking and Payment</h2>
          <p>
            All bookings made through the Platform are subject to availability and confirmation. Payment terms:
          </p>
          <ul>
            <li>Payments must be made through approved payment methods (bKash, Nagad, Cash)</li>
            <li>All prices are in Bangladeshi Taka (BDT) unless otherwise stated</li>
            <li>Payment confirms acceptance of the service provider's terms</li>
            <li>Booking confirmations will be sent via email</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Cancellation and Refund Policy</h2>
          <p>
            Cancellation policies vary by service provider. General guidelines:
          </p>
          <ul>
            <li>Cancellations made 48+ hours before service date may be eligible for full refund</li>
            <li>Cancellations within 24-48 hours may incur a 50% cancellation fee</li>
            <li>Cancellations within 24 hours are generally non-refundable</li>
            <li>Refunds are processed within 7-14 business days</li>
            <li>Final refund decisions are made by platform administrators</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Reviews and Ratings</h2>
          <p>
            Users may submit reviews and ratings. By submitting a review, you agree that:
          </p>
          <ul>
            <li>Your review is based on your own experience and opinion</li>
            <li>Your review does not contain offensive, defamatory, or illegal content</li>
            <li>We may moderate, edit, or remove reviews that violate our guidelines</li>
            <li>Reviews cannot be used for promotional purposes or contain spam</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>7. Intellectual Property</h2>
          <p>
            All content on the Platform, including text, graphics, logos, and software, is the property of 
            Roaming Sonic or its content suppliers and is protected by intellectual property laws. You may not:
          </p>
          <ul>
            <li>Copy, modify, or distribute Platform content without permission</li>
            <li>Use the Platform's name, logo, or trademarks without authorization</li>
            <li>Reverse engineer or attempt to extract source code</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>8. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Platform for any illegal purpose</li>
            <li>Impersonate any person or entity</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Upload viruses or malicious code</li>
            <li>Attempt to gain unauthorized access to the Platform</li>
            <li>Scrape or collect user data without permission</li>
            <li>Post false or misleading information</li>
            <li>Engage in fraudulent activities</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>9. Limitation of Liability</h2>
          <p>
            Roaming Sonic acts as a platform connecting service providers and customers. We are not responsible for:
          </p>
          <ul>
            <li>The quality of services provided by hotels, guides, or transport services</li>
            <li>Disputes between users and service providers</li>
            <li>Loss, injury, or damage during travel</li>
            <li>Delays, cancellations, or changes by service providers</li>
            <li>Force majeure events including natural disasters, political unrest, or pandemics</li>
          </ul>
          <p>
            Our total liability shall not exceed the amount paid by you for the specific service in question.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold Roaming Sonic harmless from any claims, damages, or expenses arising 
            from your use of the Platform, violation of these Terms, or infringement of any rights of another party.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
            posting to the Platform. Your continued use of the Platform after changes constitutes acceptance of 
            the modified Terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Platform immediately, without prior notice, 
            for any reason, including breach of these Terms. Upon termination:
          </p>
          <ul>
            <li>Your right to use the Platform will immediately cease</li>
            <li>We may delete your account and data</li>
            <li>You remain liable for all obligations incurred prior to termination</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Bangladesh. Any disputes 
            shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
          </p>
        </section>

        <section className="legal-section">
          <h2>14. Contact Information</h2>
          <p>
            For questions about these Terms and Conditions, please contact us at:
          </p>
          <ul>
            <li>Email: legal@roamingsonic.com</li>
            <li>Phone: +880 1712-345678</li>
            <li>Address: House 23, Road 12, Dhanmondi, Dhaka 1209, Bangladesh</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>15. Entire Agreement</h2>
          <p>
            These Terms constitute the entire agreement between you and Roaming Sonic regarding the use of the 
            Platform and supersede all prior agreements and understandings.
          </p>
        </section>
      </div>

      <div className="legal-footer">
        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Terms;
