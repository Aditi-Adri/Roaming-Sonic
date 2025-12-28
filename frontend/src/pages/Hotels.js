import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Hotels.css';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Hotels = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 1,
    roomType: 'standard'
  });
  const [wishlist, setWishlist] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    division: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    wifi: false,
    parking: false,
    restaurant: false,
    gym: false,
    spa: false,
    swimmingPool: false
  });

  const divisions = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'];
  const categories = ['hotel', 'resort', 'guest-house', 'hostel', 'apartment'];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.division) queryParams.append('division', filters.division);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.minRating) queryParams.append('minRating', filters.minRating);
      
      const facilitiesArray = [];
      if (filters.wifi) facilitiesArray.push('wifi');
      if (filters.parking) facilitiesArray.push('parking');
      if (filters.restaurant) facilitiesArray.push('restaurant');
      if (filters.gym) facilitiesArray.push('gym');
      if (filters.spa) facilitiesArray.push('spa');
      if (filters.swimmingPool) facilitiesArray.push('swimmingPool');
      
      if (facilitiesArray.length > 0) {
        queryParams.append('facilities', facilitiesArray.join(','));
      }

      const response = await axios.get(`http://localhost:5000/api/hotels?${queryParams.toString()}`);
      setHotels(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHotels();
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      division: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      wifi: false,
      parking: false,
      restaurant: false,
      gym: false,
      spa: false,
      swimmingPool: false
    });
    setTimeout(() => fetchHotels(), 100);
  };

  const getMinPrice = (hotel) => {
    if (hotel.rooms && hotel.rooms.length > 0) {
      return Math.min(...hotel.rooms.map(room => room.pricePerNight));
    }
    return 0;
  };

  const handleBookNow = (hotel) => {
    if (!user) {
      alert('Please login to book a hotel');
      return;
    }
    setSelectedHotel(hotel);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        {
          bookingType: 'hotel',
          hotel: selectedHotel._id,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          guests: bookingData.guests,
          roomType: bookingData.roomType,
          totalAmount: calculateTotalAmount(),
          paymentStatus: 'paid',
          status: 'confirmed'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Hotel booked successfully! Check your dashboard for booking details.');
      setShowBookingModal(false);
      setBookingData({ checkInDate: '', checkOutDate: '', guests: 1, roomType: 'standard' });
    } catch (error) {
      console.error('Error booking hotel:', error);
      alert('Failed to book hotel: ' + (error.response?.data?.message || error.message));
    }
  };

  const calculateTotalAmount = () => {
    if (!selectedHotel || !bookingData.checkInDate || !bookingData.checkOutDate) return 0;
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const roomPrice = getMinPrice(selectedHotel);
    return nights * roomPrice * bookingData.guests;
  };

  const toggleWishlist = async (hotelId) => {
    if (!user) {
      alert('Please login to add to wishlist');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const isInWishlist = wishlist.includes(hotelId);
      
      if (isInWishlist) {
        await axios.delete(
          `http://localhost:5000/api/users/wishlist/${hotelId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist(wishlist.filter(id => id !== hotelId));
        alert('Removed from wishlist');
      } else {
        await axios.post(
          `http://localhost:5000/api/users/wishlist/${hotelId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist([...wishlist, hotelId]);
        alert('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist');
    }
  };

  return (
    <div className="hotels-page">
      <div className="hotels-header">
        <div className="container">
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
              style={{position: 'relative', right: 'auto', top: 'auto', marginLeft: '10px'}}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
          <h1>🏨 Find Your Perfect Stay in Bangladesh</h1>
          <p>Discover the best hotels, resorts, and guest houses across the country</p>
        </div>
      </div>

      <div className="hotels-content container">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>🔍 Filter Hotels</h3>
          </div>

          <form onSubmit={handleSearch} className="filters-form">
            <div className="filter-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Enter city name"
              />
            </div>

            <div className="filter-group">
              <label>Division</label>
              <select name="division" value={filters.division} onChange={handleFilterChange}>
                <option value="">All Divisions</option>
                {divisions.map(div => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace('-', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range (BDT/night)</label>
              <div className="price-range">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
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

            <div className="filter-group">
              <label>Facilities</label>
              <div className="checkbox-group">
                <label>
                  <input type="checkbox" name="wifi" checked={filters.wifi} onChange={handleFilterChange} />
                  WiFi
                </label>
                <label>
                  <input type="checkbox" name="parking" checked={filters.parking} onChange={handleFilterChange} />
                  Parking
                </label>
                <label>
                  <input type="checkbox" name="restaurant" checked={filters.restaurant} onChange={handleFilterChange} />
                  Restaurant
                </label>
                <label>
                  <input type="checkbox" name="gym" checked={filters.gym} onChange={handleFilterChange} />
                  Gym
                </label>
                <label>
                  <input type="checkbox" name="spa" checked={filters.spa} onChange={handleFilterChange} />
                  Spa
                </label>
                <label>
                  <input type="checkbox" name="swimmingPool" checked={filters.swimmingPool} onChange={handleFilterChange} />
                  Swimming Pool
                </label>
              </div>
            </div>

            <button type="submit" className="search-btn">Search Hotels</button>
            <button type="button" onClick={resetFilters} className="reset-btn-small">Reset Filters</button>
          </form>
        </aside>

        <main className="hotels-list">
          {loading ? (
            <div className="loading">Loading hotels...</div>
          ) : hotels.length === 0 ? (
            <div className="no-results">
              <h3>No hotels found</h3>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="hotels-grid">
              {hotels.map(hotel => (
                <div key={hotel._id} className="hotel-card">
                  <div className="hotel-image">
                    <img src="https://via.placeholder.com/400x250?text=Hotel" alt={hotel.name} />
                    <span className="hotel-category">{hotel.category.replace('-', ' ')}</span>
                    {hotel.rating > 0 && (
                      <span className="hotel-rating">⭐ {hotel.rating.toFixed(1)}</span>
                    )}
                  </div>
                  
                  <div className="hotel-info">
                    <h3>{hotel.name}</h3>
                    <p className="hotel-location">📍 {hotel.address.city}, {hotel.address.division}</p>
                    <p className="hotel-description">{hotel.description.substring(0, 120)}...</p>
                    
                    <div className="hotel-facilities">
                      {hotel.facilities.wifi && <span>📶 WiFi</span>}
                      {hotel.facilities.parking && <span>🅿️ Parking</span>}
                      {hotel.facilities.restaurant && <span>🍴 Restaurant</span>}
                      {hotel.facilities.swimmingPool && <span>🏊 Pool</span>}
                    </div>

                    <div className="hotel-footer">
                      <div className="hotel-price">
                        <span className="price-label">Starting from</span>
                        <span className="price-value">৳{getMinPrice(hotel).toLocaleString()}</span>
                        <span className="price-unit">/night</span>
                      </div>
                      
                      <div className="hotel-actions">
                        <button 
                          className="wishlist-btn"
                          onClick={() => toggleWishlist(hotel._id)}
                          title={wishlist.includes(hotel._id) ? "Remove from wishlist" : "Add to wishlist"}
                          style={{marginRight: '10px'}}
                        >
                          {wishlist.includes(hotel._id) ? '❤️' : '🤍'}
                        </button>
                        {user ? (
                          user.userType === 'tourist' ? (
                            <button className="view-btn" onClick={() => handleBookNow(hotel)}>Book Now</button>
                          ) : (
                            <button className="view-btn" disabled style={{opacity: 0.5, cursor: 'not-allowed'}} title="Only tourists can book hotels">
                              Tourist Only
                            </button>
                          )
                        ) : (
                          <Link to="/login" className="view-btn">Login to Book</Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedHotel && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '500px'}}>
            <button className="modal-close" onClick={() => setShowBookingModal(false)}>×</button>
            <h2>Book {selectedHotel.name}</h2>
            
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>Check-in Date *</label>
                <input
                  type="date"
                  value={bookingData.checkInDate}
                  onChange={(e) => setBookingData({...bookingData, checkInDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Check-out Date *</label>
                <input
                  type="date"
                  value={bookingData.checkOutDate}
                  onChange={(e) => setBookingData({...bookingData, checkOutDate: e.target.value})}
                  min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Number of Guests *</label>
                <input
                  type="number"
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                  min="1"
                  max="10"
                  required
                />
              </div>

              <div className="form-group">
                <label>Room Type *</label>
                <select
                  value={bookingData.roomType}
                  onChange={(e) => setBookingData({...bookingData, roomType: e.target.value})}
                  required
                >
                  {selectedHotel.rooms?.map(room => (
                    <option key={room.type} value={room.type}>
                      {room.name} - ৳{room.pricePerNight}/night
                    </option>
                  ))}
                </select>
              </div>

              <div className="booking-summary">
                <h4>Booking Summary</h4>
                <p>Price per night: ৳{getMinPrice(selectedHotel)}</p>
                {bookingData.checkInDate && bookingData.checkOutDate && (
                  <>
                    <p>Number of nights: {Math.ceil((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24))}</p>
                    <p><strong>Total Amount: ৳{calculateTotalAmount().toLocaleString()}</strong></p>
                  </>
                )}
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">Confirm Booking</button>
                <button type="button" className="btn-secondary" onClick={() => setShowBookingModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotels;
