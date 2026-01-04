import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Buses.css';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import PaymentForm from '../components/PaymentForm';

const Buses = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    numberOfSeats: 1,
    travelDate: '',
    passengerName: '',
    passengerPhone: '',
    passengerEmail: '',
    boardingPoint: '',
    seatNumbers: []
  });
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    date: '',
    busType: '',
    minFare: '',
    maxFare: '',
    minRating: ''
  });

  const cities = ['Dhaka', 'Chittagong', 'Cox\'s Bazar', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur'];
  const busTypes = ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper', 'Luxury'];

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.from) queryParams.append('from', filters.from);
      if (filters.to) queryParams.append('to', filters.to);
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.busType) queryParams.append('busType', filters.busType);
      if (filters.minFare) queryParams.append('minFare', filters.minFare);
      if (filters.maxFare) queryParams.append('maxFare', filters.maxFare);
      if (filters.minRating) queryParams.append('minRating', filters.minRating);

      const response = await axios.get(`http://localhost:5000/api/buses?${queryParams.toString()}`);
      setBuses(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching buses:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBuses();
  };

  const resetFilters = () => {
    setFilters({
      from: '',
      to: '',
      date: '',
      busType: '',
      minFare: '',
      maxFare: '',
      minRating: ''
    });
    setTimeout(() => fetchBuses(), 100);
  };

  const getBusTypeIcon = (type) => {
    switch (type) {
      case 'Luxury': return '👑';
      case 'AC': return '❄️';
      case 'Sleeper': return '🛏️';
      case 'Semi-Sleeper': return '🪑';
      default: return '🚌';
    }
  };

  const openBookingModal = (bus) => {
    setSelectedBus(bus);
    setBookingData({
      numberOfSeats: 1,
      travelDate: '',
      passengerName: user?.name || '',
      passengerPhone: user?.phone || '',
      passengerEmail: user?.email || '',
      boardingPoint: bus.from,
      seatNumbers: []
    });
    setShowBookingModal(true);
  };

  const openReviewModal = (bus) => {
    setSelectedBus(bus);
    setReviewData({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!bookingData.travelDate) {
      alert('Please select a travel date');
      return;
    }
    
    if (!bookingData.passengerName || !bookingData.passengerPhone) {
      alert('Please fill in passenger name and phone number');
      return;
    }

    // Move to payment step
    setShowBookingModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to book tickets');
        return;
      }

      const totalAmount = selectedBus.fare * bookingData.numberOfSeats;
      
      const bookingPayload = {
        bookingType: 'bus',
        bus: selectedBus._id,
        travelDate: bookingData.travelDate,
        numberOfSeats: parseInt(bookingData.numberOfSeats),
        passengerName: bookingData.passengerName,
        passengerPhone: bookingData.passengerPhone,
        passengerEmail: bookingData.passengerEmail || '',
        boardingPoint: bookingData.boardingPoint || selectedBus.from,
        seatNumbers: bookingData.seatNumbers || [],
        totalAmount: totalAmount,
        ...paymentData
      };

      console.log('Booking payload:', bookingPayload);
      
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        bookingPayload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('✅ Bus ticket booked successfully! Check your dashboard to download the ticket.');
      setShowPaymentModal(false);
      setSelectedBus(null);
      fetchBuses(); // Refresh to update available seats
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Booking failed. Please try again.';
      
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        if (error.response.data.errors) {
          errorMessage += '\n' + error.response.data.errors.join('\n');
        }
        if (error.response.data.error) {
          errorMessage += '\n' + error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert('❌ Error creating booking\n\n' + errorMessage);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/buses/${selectedBus._id}/review`,
        reviewData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Review submitted successfully!');
      setShowReviewModal(false);
      fetchBuses(); // Refresh to show new review
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review.');
    }
  };

  return (
    <div className="buses-page">
      <Navbar />
      <div className="buses-header" style={{marginTop: '80px'}}>
        <div className="container">
          <h1>🚌 Book Your Bus Tickets</h1>
          <p>Travel across Bangladesh with comfort and safety</p>
        </div>
      </div>

      <div className="buses-content container">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>🔍 Search Buses</h3>
          </div>

          <form onSubmit={handleSearch} className="filters-form">
            <div className="filter-group">
              <label>From</label>
              <select name="from" value={filters.from} onChange={handleFilterChange}>
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>To</label>
              <select name="to" value={filters.to} onChange={handleFilterChange}>
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Journey Date</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="filter-group">
              <label>Bus Type</label>
              <select name="busType" value={filters.busType} onChange={handleFilterChange}>
                <option value="">All Types</option>
                {busTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Fare Range (BDT)</label>
              <div className="price-range">
                <input
                  type="number"
                  name="minFare"
                  value={filters.minFare}
                  onChange={handleFilterChange}
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  name="maxFare"
                  value={filters.maxFare}
                  onChange={handleFilterChange}
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Minimum Rating</label>
              <select name="minRating" value={filters.minRating} onChange={handleFilterChange}>
                <option value="">Any Rating</option>
                <option value="3">3+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="4.5">4.5+ ⭐</option>
              </select>
            </div>

            <button type="submit" className="search-btn">Search Buses</button>
            <button type="button" onClick={resetFilters} className="reset-btn-small">Reset Filters</button>
          </form>
        </aside>

        <main className="buses-list">
          {loading ? (
            <div className="loading">Loading buses...</div>
          ) : buses.length === 0 ? (
            <div className="no-results">
              <h3>No buses found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="buses-grid">
              {buses.map(bus => (
                <div key={bus._id} className="bus-card">
                  <div className="bus-header">
                    <div className="bus-company">
                      <h3>{bus.name}</h3>
                      <span className="bus-number">{bus.busNumber}</span>
                    </div>
                    <div className="bus-type-badge">
                      {getBusTypeIcon(bus.busType)} {bus.busType}
                    </div>
                  </div>

                  <div className="bus-route">
                    <div className="route-point">
                      <div className="route-icon">🔵</div>
                      <div className="route-details">
                        <span className="city">{bus.from}</span>
                        <span className="time">{bus.departureTime}</span>
                      </div>
                    </div>
                    
                    <div className="route-line">
                      <div className="route-duration">{bus.duration}</div>
                    </div>

                    <div className="route-point">
                      <div className="route-icon">🔴</div>
                      <div className="route-details">
                        <span className="city">{bus.to}</span>
                        <span className="time">{bus.arrivalTime}</span>
                      </div>
                    </div>
                  </div>

                  {bus.amenities && bus.amenities.length > 0 && (
                    <div className="bus-amenities">
                      {bus.amenities.slice(0, 4).map((amenity, idx) => (
                        <span key={idx} className="amenity-tag">{amenity}</span>
                      ))}
                    </div>
                  )}

                  <div className="bus-footer">
                    <div className="bus-info">
                      <div className="seats-info">
                        <span className="icon">💺</span>
                        <span>{bus.availableSeats} seats available</span>
                      </div>
                      {bus.rating > 0 && (
                        <div className="bus-rating">
                          ⭐ {bus.rating?.toFixed(1) || '0.0'} ({bus.totalReviews || 0} reviews)
                        </div>
                      )}
                    </div>

                    <div className="bus-booking">
                      <div className="bus-fare">
                        <span className="fare-label">Fare:</span>
                        <span className="fare-value">৳{bus.fare}</span>
                      </div>
                      
                      {user ? (
                        user.userType === 'tourist' ? (
                          <div className="bus-actions">
                            <button className="book-btn" onClick={() => openBookingModal(bus)}>Book Now</button>
                            <button className="review-btn" onClick={() => openReviewModal(bus)}>Write Review</button>
                          </div>
                        ) : (
                          <div className="bus-actions">
                            <button className="book-btn" disabled style={{opacity: 0.5, cursor: 'not-allowed'}} title="Only tourists can book">
                              Book Now (Tourist Only)
                            </button>
                          </div>
                        )
                      ) : (
                        <Link to="/login" className="book-btn">Login to Book</Link>
                      )}
                    </div>
                  </div>

                  {/* Display Reviews */}
                  {bus.reviews && bus.reviews.length > 0 && (
                    <div className="bus-reviews-section">
                      <h4>Recent Reviews:</h4>
                      <div className="reviews-list">
                        {bus.reviews.slice(0, 2).map((review, idx) => (
                          <div key={idx} className="review-item">
                            <div className="review-header">
                              <span className="reviewer-name">{review.user?.name || 'Anonymous'}</span>
                              <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedBus && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book Bus Ticket</h2>
              <button className="close-btn" onClick={() => setShowBookingModal(false)}>×</button>
            </div>
            
            <div className="booking-summary">
              <h3>{selectedBus.name}</h3>
              <p>{selectedBus.from} → {selectedBus.to}</p>
              <p>Departure: {selectedBus.departureTime} | {selectedBus.busType}</p>
            </div>

            <form onSubmit={handleBooking} className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Travel Date *</label>
                  <input
                    type="date"
                    name="travelDate"
                    value={bookingData.travelDate}
                    onChange={handleBookingChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Number of Seats *</label>
                  <input
                    type="number"
                    name="numberOfSeats"
                    value={bookingData.numberOfSeats}
                    onChange={handleBookingChange}
                    min="1"
                    max={selectedBus.availableSeats}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Passenger Name *</label>
                  <input
                    type="text"
                    name="passengerName"
                    value={bookingData.passengerName}
                    onChange={handleBookingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="passengerPhone"
                    value={bookingData.passengerPhone}
                    onChange={handleBookingChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="passengerEmail"
                  value={bookingData.passengerEmail}
                  onChange={handleBookingChange}
                />
              </div>

              <div className="form-group">
                <label>Boarding Point</label>
                <input
                  type="text"
                  name="boardingPoint"
                  value={bookingData.boardingPoint}
                  onChange={handleBookingChange}
                />
              </div>

              <div className="booking-total">
                <h3>Total Amount: ৳{(selectedBus.fare * bookingData.numberOfSeats).toFixed(2)}</h3>
                <p className="refund-policy">🔄 70% refund available on cancellation</p>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowBookingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="confirm-btn">
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedBus && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content payment-modal-large" onClick={(e) => e.stopPropagation()} style={{maxWidth: '700px'}}>
            <div className="modal-header">
              <h2>Complete Payment</h2>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <PaymentForm
              totalAmount={selectedBus.fare * bookingData.numberOfSeats}
              onPaymentSubmit={handlePaymentSubmit}
              onCancel={() => setShowPaymentModal(false)}
            />
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBus && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Write a Review</h2>
              <button className="close-btn" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            
            <div className="review-bus-info">
              <h3>{selectedBus.name}</h3>
              <p>{selectedBus.from} → {selectedBus.to}</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group">
                <label>Rating *</label>
                <select
                  name="rating"
                  value={reviewData.rating}
                  onChange={handleReviewChange}
                  required
                >
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Good</option>
                  <option value="3">⭐⭐⭐ Average</option>
                  <option value="2">⭐⭐ Poor</option>
                  <option value="1">⭐ Very Poor</option>
                </select>
              </div>

              <div className="form-group">
                <label>Your Review *</label>
                <textarea
                  name="comment"
                  value={reviewData.comment}
                  onChange={handleReviewChange}
                  rows="5"
                  placeholder="Share your experience with this bus service..."
                  required
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="confirm-btn">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buses;
