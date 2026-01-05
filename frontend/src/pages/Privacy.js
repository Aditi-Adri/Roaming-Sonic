import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Legal.css';

const Privacy = () => {
  return (
    <div className="legal-container">
      <Navbar />
      <div className="legal-header" style={{marginTop: '80px'}}>
        <h1>Privacy Policy</h1>
        <p>Last Updated: December 22, 2025</p>
      </div>

      <div className="legal-content">
        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Roaming Sonic. We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
            use our platform.
          </p>
          <p>
            By using Roaming Sonic, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Information</h3>
          <p>We collect the following personal information when you register:</p>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number (Bangladesh format)</li>
            <li>Date of birth (optional for tourists)</li>
            <li>NID (National ID) number</li>
            <li>Passport number (optional)</li>
            <li>Address information (street, city, district, division, zip code)</li>
          </ul>

          <h3>2.2 Business Information (for Hotel Owners and Guides)</h3>
          <ul>
            <li>Business name and license</li>
            <li>Professional certifications</li>
            <li>Experience and specializations</li>
            <li>Service rates and availability</li>
          </ul>

          <h3>2.3 Payment Information</h3>
          <ul>
            <li>Preferred payment method</li>
            <li>bKash or Nagad mobile numbers</li>
            <li>Transaction history</li>
          </ul>

          <h3>2.4 Usage Data</h3>
          <p>We automatically collect certain information when you use our platform:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent</li>
            <li>Search queries and filters used</li>
            <li>Booking history and preferences</li>
            <li>Device information</li>
          </ul>

          <h3>2.5 Location Data</h3>
          <p>
            With your permission, we may collect location data to provide location-based services such as 
            nearby hotels and attractions.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use collected information for the following purposes:</p>
          <ul>
            <li>To create and manage your account</li>
            <li>To process bookings and payments</li>
            <li>To communicate with you about services, bookings, and updates</li>
            <li>To provide customer support</li>
            <li>To personalize your experience and show relevant content</li>
            <li>To process refunds and handle complaints</li>
            <li>To prevent fraud and ensure platform security</li>
            <li>To analyze usage patterns and improve our services</li>
            <li>To send promotional offers and discounts (with your consent)</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Information Sharing and Disclosure</h2>
          
          <h3>4.1 Service Providers</h3>
          <p>
            We share your information with service providers (hotels, guides, bus operators) only to the extent 
            necessary to fulfill your bookings.
          </p>

          <h3>4.2 Business Partners</h3>
          <p>
            We may share aggregated, anonymized data with partners for analytics and marketing purposes.
          </p>

          <h3>4.3 Legal Requirements</h3>
          <p>We may disclose your information if required to:</p>
          <ul>
            <li>Comply with legal obligations or court orders</li>
            <li>Protect our rights, property, or safety</li>
            <li>Prevent fraud or illegal activities</li>
            <li>Respond to government requests</li>
          </ul>

          <h3>4.4 Business Transfers</h3>
          <p>
            In the event of a merger, acquisition, or sale of assets, your information may be transferred to 
            the acquiring entity.
          </p>

          <h3>4.5 With Your Consent</h3>
          <p>
            We may share your information with third parties when you explicitly consent to such sharing.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information:
          </p>
          <ul>
            <li>Encryption of sensitive data (passwords, payment information)</li>
            <li>Secure HTTPS connections</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
            <li>Employee training on data protection</li>
          </ul>
          <p>
            However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute 
            security of your data.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to:
          </p>
          <ul>
            <li>Provide our services to you</li>
            <li>Comply with legal obligations (minimum 5 years for financial records)</li>
            <li>Resolve disputes and enforce agreements</li>
            <li>Maintain business records</li>
          </ul>
          <p>
            You may request deletion of your account and data at any time, subject to legal retention requirements.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Your Rights</h2>
          <p>You have the following rights regarding your personal data:</p>
          
          <h3>7.1 Access</h3>
          <p>You can access and review your personal information through your account dashboard.</p>

          <h3>7.2 Correction</h3>
          <p>You can update or correct your information at any time through your profile settings.</p>

          <h3>7.3 Deletion</h3>
          <p>
            You can request deletion of your account and data by contacting us. Some information may be retained 
            for legal purposes.
          </p>

          <h3>7.4 Data Portability</h3>
          <p>You can request a copy of your data in a machine-readable format.</p>

          <h3>7.5 Opt-Out</h3>
          <p>
            You can opt-out of marketing communications by clicking the unsubscribe link in emails or updating 
            your preferences.
          </p>

          <h3>7.6 Withdraw Consent</h3>
          <p>
            Where we rely on consent, you can withdraw it at any time without affecting the lawfulness of 
            processing based on consent before withdrawal.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience:
          </p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
            <li><strong>Marketing Cookies:</strong> Used to show relevant advertisements</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Note that disabling cookies may affect 
            platform functionality.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites (social media, payment gateways). We are not 
            responsible for the privacy practices of these sites. We encourage you to read their privacy policies.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under 18 years of age. We do not knowingly collect 
            personal information from children. If you believe we have collected information from a child, please 
            contact us immediately.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than Bangladesh. We ensure 
            appropriate safeguards are in place to protect your data in compliance with applicable laws.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by:
          </p>
          <ul>
            <li>Posting the new Privacy Policy on this page</li>
            <li>Updating the "Last Updated" date</li>
            <li>Sending you an email notification (for significant changes)</li>
          </ul>
          <p>
            Your continued use of the platform after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="legal-section">
          <h2>13. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, 
            please contact us:
          </p>
          <ul>
            <li><strong>Email:</strong> privacy@roamingsonic.com</li>
            <li><strong>Phone:</strong> +880 1712-345678</li>
            <li><strong>Address:</strong> House 23, Road 12, Dhanmondi, Dhaka 1209, Bangladesh</li>
          </ul>
          <p>
            We will respond to your inquiry within 30 days.
          </p>
        </section>

        <section className="legal-section">
          <h2>14. Complaints</h2>
          <p>
            If you believe your privacy rights have been violated, you have the right to file a complaint with 
            the relevant data protection authority in Bangladesh.
          </p>
        </section>
      </div>

      <div className="legal-footer">
        <Link to="/" className="back-button">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Privacy;
