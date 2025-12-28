import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const HotelOwnerDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'hotel',
    phone: '',
    email: '',
    'address.city': '',
    'address.district': '',
    'address.division': 'Dhaka',
    'facilities.wifi': false,
    'facilities.parking': false,
    'facilities.restaurant': false,
    'facilities.swimmingPool': false,
    'facilities.gym': false
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab') || 'overview';
    setActiveSection(tab);
    setShowAddForm(tab === 'add-hotel');
  }, [location.search]);

  useEffect(() {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/hotels/my/hotels', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHotels(response.data.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Convert flat form data to nested structure
      const hotelData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        phone: formData.phone,
        email: formData.email,
        address: {
          city: formData['address.city'],
          district: formData['address.district'],
          division: formData['address.division']
        },
        facilities: {
          wifi: formData['facilities.wifi'],
          parking: formData['facilities.parking'],
          restaurant: formData['facilities.restaurant'],
          swimmingPool: formData['facilities.swimmingPool'],
          gym: formData['facilities.gym']
        }
      };

      await axios.post('http://localhost:5000/api/hotels', hotelData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Hotel added successfully!');
      setShowAddForm(false);
      fetchHotels();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'hotel',
        phone: '',
        email: '',
        'address.city': '',
        'address.district': '',
        'address.division': 'Dhaka',
        'facilities.wifi': false,
        'facilities.parking': false,
        'facilities.restaurant': false,
        'facilities.swimmingPool': false,
        'facilities.gym': false
      });
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert(error.response?.data?.message || 'Failed to add hotel');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/hotels/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Hotel deleted successfully!');
      fetchHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      alert('Failed to delete hotel');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Hotel Management 🏨</h1>
        <p>Manage your properties</p>
      </div>

      {(activeSection === 'overview' || activeSection === 'hotels') && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏨</div>
              <div className="stat-details">
                <h3>Total Hotels</h3>
                <p className="stat-value">{hotels.length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-details">
                <h3>Verified</h3>
                <p className="stat-value">{hotels.filter(h => h.isVerified).length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-details">
                <h3>Pending</h3>
                <p className="stat-value">{hotels.filter(h => h.verificationStatus === 'pending').length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-details">
                <h3>Avg Rating</h3>
                <p className="stat-value">
                  {hotels.length > 0 
                    ? (hotels.reduce((acc, h) => acc + (h.rating || 0), 0) / hotels.length).toFixed(1)
                    : '0.0'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {(activeSection === 'overview' || activeSection === 'hotels') && !showAddForm && (
        <div className="content-card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2>My Hotels</h2>
          </div>

          {hotels.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel._id}>
                  <td>{hotel.name}</td>
                  <td style={{textTransform: 'capitalize'}}>{hotel.category?.replace('-', ' ')}</td>
                  <td>{hotel.address?.city}, {hotel.address?.division}</td>
                  <td>⭐ {hotel.rating?.toFixed(1) || '0.0'}</td>
                  <td>
                    <span className={`badge badge-${hotel.verificationStatus === 'approved' ? 'success' : hotel.verificationStatus === 'pending' ? 'warning' : 'danger'}`}>
                      {hotel.verificationStatus}
                    </span>
                  </td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(hotel._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
            No hotels added yet. Click "Add New Hotel" to get started! 🏨
          </p>
        )}
      </div>
      )}

      {activeSection === 'add-hotel' && showAddForm && (
        <div className="content-card">
          <h2>Add New Hotel</h2>
          <form onSubmit={handleSubmit} className="dashboard-form">
            <div className="form-row">
              <div className="form-group">
                <label>Hotel Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter hotel name"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="hotel">Hotel</option>
                  <option value="resort">Resort</option>
                  <option value="guest-house">Guest House</option>
                  <option value="hostel">Hostel</option>
                  <option value="apartment">Apartment</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe your hotel"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Contact number"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Contact email"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData['address.city']}
                  onChange={handleChange}
                  required
                  placeholder="City name"
                />
              </div>

              <div className="form-group">
                <label>District *</label>
                <input
                  type="text"
                  name="address.district"
                  value={formData['address.district']}
                  onChange={handleChange}
                  required
                  placeholder="District name"
                />
              </div>

              <div className="form-group">
                <label>Division *</label>
                <select
                  name="address.division"
                  value={formData['address.division']}
                  onChange={handleChange}
                  required
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Facilities</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="facilities.wifi"
                    checked={formData['facilities.wifi']}
                    onChange={handleChange}
                  />
                  WiFi
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="facilities.parking"
                    checked={formData['facilities.parking']}
                    onChange={handleChange}
                  />
                  Parking
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="facilities.restaurant"
                    checked={formData['facilities.restaurant']}
                    onChange={handleChange}
                  />
                  Restaurant
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="facilities.swimmingPool"
                    checked={formData['facilities.swimmingPool']}
                    onChange={handleChange}
                  />
                  Swimming Pool
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="facilities.gym"
                    checked={formData['facilities.gym']}
                    onChange={handleChange}
                  />
                  Gym
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              ➕ Add Hotel
            </button>
          </form>
        </div>
      )}

      {activeSection === 'bookings' && (
        <div className="content-card">
          <h2>Hotel Bookings 📋</h2>
          <p>Your hotel bookings will appear here.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HotelOwnerDashboard;
