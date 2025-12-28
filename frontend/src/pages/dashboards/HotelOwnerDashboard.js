import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const HotelOwnerDashboard = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [profile, setProfile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [groupTours, setGroupTours] = useState([]);
  const [activeTab, setActiveTab] = useState('hotels');
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
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    fetchHotels();
    fetchProfile();
    fetchMyGroupTours();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchMyGroupTours = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/group-tours/my/tours', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroupTours(response.data.data);
    } catch (error) {
      console.error('Error fetching group tours:', error);
    }
  };

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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('photo', file);

    try {
      setUploadingPhoto(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/users/upload-photo',
        formDataUpload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      alert('Photo uploaded successfully!');
      fetchProfile();
      const updatedPhoto = response.data?.data?.photo || response.data?.data?.user?.photo || response.data?.user?.photo;
      if (updatedPhoto) {
        updateUser({ photo: updatedPhoto });
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
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

      alert('Hotel added successfully! Pending admin approval.');
      setShowAddForm(false);
      fetchHotels();
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
      alert('Failed to add hotel');
    }
  };

  const handleDelete = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/hotels/${hotelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Hotel deleted successfully');
      fetchHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      alert('Failed to delete hotel');
    }
  };

  const handleMemberApproval = async (tourId, memberId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/group-tours/${tourId}/members/${memberId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert(`Member ${status} successfully!`);
      fetchMyGroupTours();
    } catch (error) {
      console.error('Error updating member status:', error);
      alert('Failed to update member status');
    }
  };

  const handleCancelTour = async (tourId) => {
    if (!window.confirm('Are you sure you want to cancel this group tour?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/group-tours/${tourId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Group tour cancelled successfully');
      fetchMyGroupTours();
    } catch (error) {
      console.error('Error cancelling tour:', error);
      alert('Failed to cancel tour');
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
        <h1>Hotel Owner Dashboard 🏨</h1>
        <p>Manage your hotels and group tours</p>
      </div>

      {/* Profile Photo Section */}
      <div className="content-card" style={{marginBottom: '20px', padding: '20px'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            margin: '0 auto 15px',
            overflow: 'hidden',
            border: '3px solid #667eea',
            background: '#f0f0f0'
          }}>
            {profile?.photo && profile.photo !== 'default-avatar.png' ? (
              <img 
                src={`http://localhost:5000${profile.photo}`} 
                alt={profile.name}
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                {profile?.name?.charAt(0) || 'H'}
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              id="photoUpload"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{display: 'none'}}
            />
            <label htmlFor="photoUpload" className="btn-primary" style={{cursor: 'pointer', padding: '8px 16px', fontSize: '14px'}}>
              {uploadingPhoto ? '⏳ Uploading...' : '📷 Upload Photo'}
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="section-tabs">
        <button
          className={activeTab === 'hotels' ? 'active' : ''}
          onClick={() => setActiveTab('hotels')}
        >
          🏨 My Hotels
        </button>
        <button
          className={activeTab === 'groupTours' ? 'active' : ''}
          onClick={() => setActiveTab('groupTours')}
        >
          👥 My Group Tours
        </button>
      </div>

      {/* Hotels Tab */}
      {activeTab === 'hotels' && (
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
            <h3>Approved</h3>
            <p className="stat-value">
              {hotels.filter(h => h.verificationStatus === 'approved').length}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-details">
            <h3>Pending</h3>
            <p className="stat-value">
              {hotels.filter(h => h.verificationStatus === 'pending').length}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-details">
            <h3>Total Bookings</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h2>My Hotels</h2>
          <button 
            className="btn-primary" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add New Hotel'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="dashboard-form" style={{marginBottom: '30px'}}>
            <div className="form-row">
              <div className="form-group">
                <label>Hotel Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="hotel">Hotel</option>
                  <option value="resort">Resort</option>
                  <option value="guest_house">Guest House</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
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
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
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
                  <option value="Chattogram">Chattogram</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barishal">Barishal</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Facilities</label>
              <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                <label>
                  <input
                    type="checkbox"
                    name="facilities.wifi"
                    checked={formData['facilities.wifi']}
                    onChange={handleChange}
                    style={{width: 'auto', marginRight: '5px'}}
                  />
                  WiFi
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="facilities.parking"
                    checked={formData['facilities.parking']}
                    onChange={handleChange}
                    style={{width: 'auto', marginRight: '5px'}}
                  />
                  Parking
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="facilities.restaurant"
                    checked={formData['facilities.restaurant']}
                    onChange={handleChange}
                    style={{width: 'auto', marginRight: '5px'}}
                  />
                  Restaurant
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="facilities.swimmingPool"
                    checked={formData['facilities.swimmingPool']}
                    onChange={handleChange}
                    style={{width: 'auto', marginRight: '5px'}}
                  />
                  Swimming Pool
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="facilities.gym"
                    checked={formData['facilities.gym']}
                    onChange={handleChange}
                    style={{width: 'auto', marginRight: '5px'}}
                  />
                  Gym
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Add Hotel
            </button>
          </form>
        )}

        {hotels.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel._id}>
                  <td>{hotel.name}</td>
                  <td>{hotel.category}</td>
                  <td>{hotel.address?.city}, {hotel.address?.division}</td>
                  <td>
                    <span className={`badge badge-${hotel.verificationStatus === 'approved' ? 'success' : 'warning'}`}>
                      {hotel.verificationStatus}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-danger btn-sm"
                      onClick={() => handleDelete(hotel._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
            No hotels added yet. Click "Add New Hotel" to get started!
          </p>
        )}
      </div>
      </>
      )}

      {/* Group Tours Tab */}
      {activeTab === 'groupTours' && (
        <div className="content-card">
          <h2>My Group Tours</h2>
          
          {groupTours.length > 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              {groupTours.map((tour) => (
                <div key={tour._id} style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '20px',
                  background: '#fff'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px'}}>
                    <div>
                      <h3 style={{margin: '0 0 10px'}}>{tour.title}</h3>
                      <p style={{margin: '5px 0', color: '#666'}}>
                        <strong>Destination:</strong> {tour.destination}
                      </p>
                      <p style={{margin: '5px 0', color: '#666'}}>
                        <strong>Date:</strong> {new Date(tour.tourDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
                      </p>
                      <p style={{margin: '5px 0', color: '#666'}}>
                        <strong>Members:</strong> {tour.currentMembers} / {tour.maxMembers}
                      </p>
                      <div style={{marginTop: '10px'}}>
                        <span className={`badge badge-${
                          tour.adminApprovalStatus === 'approved' ? 'success' : 
                          tour.adminApprovalStatus === 'rejected' ? 'danger' : 'warning'
                        }`}>
                          Admin: {tour.adminApprovalStatus}
                        </span>
                        <span className={`badge badge-${
                          tour.status === 'active' ? 'success' : 
                          tour.status === 'cancelled' ? 'danger' : 'warning'
                        }`} style={{marginLeft: '10px'}}>
                          Status: {tour.status}
                        </span>
                      </div>
                    </div>
                    {tour.status !== 'cancelled' && tour.status !== 'completed' && (
                      <button
                        onClick={() => handleCancelTour(tour._id)}
                        className="btn-danger btn-sm"
                      >
                        Cancel Tour
                      </button>
                    )}
                  </div>

                  {/* Member Requests */}
                  {tour.members && tour.members.length > 0 && (
                    <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0'}}>
                      <h4 style={{marginBottom: '15px'}}>Member Requests:</h4>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Request Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tour.members.map((member) => (
                            <tr key={member._id}>
                              <td>{member.user?.name || 'N/A'}</td>
                              <td>{member.user?.email || 'N/A'}</td>
                              <td>{member.user?.phone || 'N/A'}</td>
                              <td>
                                <span className={`badge badge-${
                                  member.status === 'approved' ? 'success' : 
                                  member.status === 'rejected' ? 'danger' : 'warning'
                                }`}>
                                  {member.status}
                                </span>
                              </td>
                              <td>{new Date(member.requestDate).toLocaleDateString()}</td>
                              <td>
                                {member.status === 'pending' && (
                                  <div style={{display: 'flex', gap: '5px'}}>
                                    <button
                                      onClick={() => handleMemberApproval(tour._id, member.user._id, 'approved')}
                                      className="btn-success btn-sm"
                                      style={{padding: '5px 10px', fontSize: '12px'}}
                                    >
                                      ✓ Approve
                                    </button>
                                    <button
                                      onClick={() => handleMemberApproval(tour._id, member.user._id, 'rejected')}
                                      className="btn-danger btn-sm"
                                      style={{padding: '5px 10px', fontSize: '12px'}}
                                    >
                                      ✗ Reject
                                    </button>
                                  </div>
                                )}
                                {member.status !== 'pending' && (
                                  <span style={{color: '#999'}}>-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
              You haven't created any group tours yet.
            </p>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default HotelOwnerDashboard;
