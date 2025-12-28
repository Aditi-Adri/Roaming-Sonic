import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const TouristDashboard = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [guideRequests, setGuideRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showTourReviewModal, setShowTourReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [tourReviewData, setTourReviewData] = useState({
    rating: 5,
    comment: ''
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Group Tour State
  const [myGroupTours, setMyGroupTours] = useState([]);
  const [joinedGroupTours, setJoinedGroupTours] = useState([]);
  const [showGroupTourModal, setShowGroupTourModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [tourPackages, setTourPackages] = useState([]);
  const [groupTourForm, setGroupTourForm] = useState({
    title: '',
    description: '',
    tourDate: '',
    endDate: '',
    destination: '',
    meetingPoint: '',
    meetingTime: '',
    maxMembers: 5,
    costPerPerson: '',
    includes: '',
    notes: ''
  });
  const [selectedGroupTour, setSelectedGroupTour] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('tab') || params.get('section') || 'overview';
    setActiveSection(section);
  }, [location.search]);

  useEffect(() => {
    fetchProfile();
    fetchBookings(); // Fetch bookings on mount for stats
    if (activeSection === 'guides') {
      fetchGuideRequests();
    }
    if (activeSection === 'bookings') {
      fetchBookings();
    }
    if (activeSection === 'group-tours') {
      fetchMyGroupTours();
      fetchJoinedGroupTours();
    }
  }, [activeSection]);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuideRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/guide-requests/tourist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGuideRequests(response.data.data);
    } catch (error) {
      console.error('Error fetching guide requests:', error);
    }
  };

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? You will receive 70% refund.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5000/api/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message || 'Booking cancelled successfully!');
      fetchBookings(); // Refresh the list
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error cancelling booking';
      alert('❌ ' + errorMsg);
    }
  };

  const handleDownloadTicket = async (bookingId, downloadPDF = false) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('❌ Please login again to download ticket');
        return;
      }
      
      const url = `http://localhost:5000/api/bookings/${bookingId}/ticket`;
      
      console.log('Fetching ticket from:', url);
      
      // Fetch the ticket HTML with authorization
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response content-type:', response.headers.get('content-type'));

      if (!response.ok) {
        // Try to parse error as JSON first, then as text
        let errorMessage = 'Failed to generate ticket';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Get the HTML content
      const html = await response.text();
      
      console.log('Received HTML length:', html.length);
      
      if (!html || html.trim().length === 0) {
        throw new Error('Received empty ticket data');
      }
      
      if (downloadPDF) {
        try {
          console.log('Creating PDF container...');
          
          // Create iframe approach for better rendering
          const iframe = document.createElement('iframe');
          iframe.style.cssText = 'position:absolute;width:210mm;height:297mm;top:0;left:0;border:none;';
          document.body.appendChild(iframe);
          
          const iframeDoc = iframe.contentWindow.document;
          iframeDoc.open();
          iframeDoc.write(html);
          iframeDoc.close();
          
          console.log('Iframe created, waiting for content to render...');
          
          // Wait for iframe content to fully render
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          console.log('Starting PDF generation...');
          
          const element = iframeDoc.body;
          
          // Configure PDF options - simplified for better compatibility
          const opt = {
            margin: 10,
            filename: `ticket-${bookingId}.pdf`,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: { 
              scale: 2,
              useCORS: true,
              logging: true,
              backgroundColor: '#ffffff',
              scrollY: 0,
              scrollX: 0,
              windowHeight: iframeDoc.body.scrollHeight
            },
            jsPDF: { 
              unit: 'mm', 
              format: 'a4', 
              orientation: 'portrait'
            },
            pagebreak: { mode: 'avoid-all' }
          };
          
          // Generate PDF
          await html2pdf()
            .set(opt)
            .from(element)
            .save();
          
          // Clean up
          document.body.removeChild(iframe);
          
          console.log('PDF generated and downloaded successfully');
          alert('✅ Ticket downloaded successfully!');
          
        } catch (pdfError) {
          console.error('PDF generation failed:', pdfError);
          alert('❌ Failed to generate PDF: ' + pdfError.message + '. Try "View Ticket" instead and use browser print (Ctrl+P) to save as PDF.');
        }
      } else {
        // Open in new window and write content with print support
        const ticketWindow = window.open('', '_blank', 'width=800,height=900');
        if (ticketWindow) {
          // Add print button and styling to the HTML
          const htmlWithPrint = html.replace('</body>', `
            <div style="text-align: center; margin: 20px; padding: 20px; border-top: 2px dashed #ccc;">
              <button onclick="window.print()" style="
                background: #2c5aa0;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                margin-right: 10px;
              ">🖨️ Print Ticket</button>
              <button onclick="window.close()" style="
                background: #666;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
              ">❌ Close</button>
              <p style="margin-top: 10px; color: #666; font-size: 12px;">
                Tip: Use Ctrl+P to print or save as PDF
              </p>
            </div>
            <style>
              @media print {
                button { display: none !important; }
                .print-hide { display: none !important; }
              }
            </style>
          </body>`);
          
          ticketWindow.document.write(htmlWithPrint);
          ticketWindow.document.close();
          console.log('Ticket opened in new window');
        } else {
          alert('❌ Please allow pop-ups to view the ticket');
        }
      }
    } catch (error) {
      console.error('Error loading ticket:', error);
      console.error('Error stack:', error.stack);
      alert('❌ ' + (error.message || 'Failed to load ticket. Please try again.'));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'confirmed': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'cancelled': return 'badge-danger';
      case 'completed': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const getBookingTypeName = (type, booking) => {
    if (type === 'hotel' && booking.hotel) return booking.hotel.name;
    if (type === 'bus' && booking.bus) return booking.bus.name;
    if (type === 'tour' && booking.tour) return booking.tour.title;
    return type;
  };

  const openTourReviewModal = (booking) => {
    setSelectedBooking(booking);
    setTourReviewData({ rating: 5, comment: '' });
    setShowTourReviewModal(true);
  };

  const closeTourReviewModal = () => {
    setShowTourReviewModal(false);
    setSelectedBooking(null);
    setTourReviewData({ rating: 5, comment: '' });
  };

  const handleTourReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/tours/${selectedBooking.tour._id}/review`,
        tourReviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Review submitted successfully!');
      closeTourReviewModal();
      fetchBookings(); // Refresh bookings
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error submitting review';
      alert('❌ ' + errorMsg);
    }
  };

  const openReviewModal = (request) => {
    setSelectedRequest(request);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedRequest(null);
    setReviewData({ rating: 5, comment: '' });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/guide-requests/${selectedRequest._id}/review`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Review submitted successfully!');
      closeReviewModal();
      fetchGuideRequests();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this guide request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/guide-requests/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Request cancelled successfully!');
      fetchGuideRequests();
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert(error.response?.data?.message || 'Failed to cancel request');
    }
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

  // Group Tour Functions
  const fetchMyGroupTours = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/group-tours/my/tours', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyGroupTours(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching my group tours:', error);
    }
  };

  const fetchJoinedGroupTours = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/group-tours/my/joined', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tours = response.data.data || response.data;
      console.log('Joined group tours:', tours);
      // Log each tour's membership status
      tours.forEach(tour => {
        console.log(`Tour ${tour._id}: myMembershipStatus = ${tour.myMembershipStatus}`);
      });
      setJoinedGroupTours(tours);
    } catch (error) {
      console.error('Error fetching joined group tours:', error);
    }
  };

  const fetchTourPackages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tours');
      setTourPackages(response.data);
    } catch (error) {
      console.error('Error fetching tour packages:', error);
    }
  };

  const openGroupTourModal = () => {
    fetchTourPackages();
    setShowGroupTourModal(true);
  };

  const closeGroupTourModal = () => {
    setShowGroupTourModal(false);
    setGroupTourForm({
      title: '',
      description: '',
      tourDate: '',
      endDate: '',
      destination: '',
      meetingPoint: '',
      meetingTime: '',
      maxMembers: 5,
      costPerPerson: '',
      includes: '',
      notes: ''
    });
  };

  const handleGroupTourSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Submitting group tour data:', groupTourForm);
      const response = await axios.post('http://localhost:5000/api/group-tours', groupTourForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Group tour created:', response.data);
      alert('Group tour request submitted successfully! Awaiting admin approval.');
      closeGroupTourModal();
      fetchMyGroupTours();
    } catch (error) {
      console.error('Error creating group tour:', error);
      console.error('Error response:', error.response);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create group tour';
      alert('Error: ' + errorMsg);
    }
  };

  const viewGroupTourMembers = async (groupTourId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/group-tours/${groupTourId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Group tour details:', response.data);
      const tourData = response.data.data || response.data;
      console.log('Tour members:', tourData.members);
      setSelectedGroupTour(tourData);
      setShowMembersModal(true);
    } catch (error) {
      console.error('Error fetching group tour details:', error);
      alert('Failed to load group tour details');
    }
  };

  const handleApproveMember = async (groupTourId, userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/group-tours/${groupTourId}/members/${userId}`,
        { status: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Member approved successfully!');
      viewGroupTourMembers(groupTourId);
      fetchMyGroupTours();
    } catch (error) {
      console.error('Error approving member:', error);
      alert(error.response?.data?.message || 'Failed to approve member');
    }
  };

  const handleRejectMember = async (groupTourId, userId) => {
    if (!window.confirm('Are you sure you want to reject this member request?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/group-tours/${groupTourId}/members/${userId}`,
        { status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Member request rejected');
      viewGroupTourMembers(groupTourId);
      fetchMyGroupTours();
    } catch (error) {
      console.error('Error rejecting member:', error);
      alert(error.response?.data?.message || 'Failed to reject member');
    }
  };

  const handleCancelGroupTour = async (groupTourId) => {
    if (!window.confirm('Are you sure you want to cancel this group tour?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/group-tours/${groupTourId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Group tour cancelled successfully');
      fetchMyGroupTours();
    } catch (error) {
      console.error('Error cancelling group tour:', error);
      alert(error.response?.data?.message || 'Failed to cancel group tour');
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleCompleteGroupTour = async (groupTourId) => {
    if (!window.confirm('Mark this group tour as completed?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/group-tours/${groupTourId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Group tour marked as completed');
      fetchMyGroupTours();
    } catch (error) {
      console.error('Error completing group tour:', error);
      alert(error.response?.data?.message || 'Failed to complete group tour');
    }
  };

  const handleLeaveGroupTour = async (groupTourId) => {
    // Find the tour to get its details for confirmation message
    const tour = joinedGroupTours.find(t => t._id === groupTourId);
    const isPending = tour?.myMembershipStatus === 'pending';
    
    const confirmMessage = isPending 
      ? 'Are you sure you want to cancel your request to join this group tour?'
      : 'Are you sure you want to leave this group tour? You may not be able to rejoin if it\'s full.';
    
    if (!window.confirm(confirmMessage)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/group-tours/${groupTourId}/leave`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const successMessage = isPending 
        ? 'Your join request has been cancelled successfully'
        : 'You have left the group tour';
      alert(successMessage);
      fetchJoinedGroupTours();
    } catch (error) {
      console.error('Error leaving group tour:', error);
      alert(error.response?.data?.message || 'Failed to process your request');
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
      {/* Navigation Tabs */}
      <div className="section-tabs">
        <button 
          className={activeSection === 'overview' ? 'active' : ''}
          onClick={() => { setActiveSection('overview'); window.history.pushState({}, '', '/dashboard'); }}
        >
          📊 Overview
        </button>
        <button 
          className={activeSection === 'bookings' ? 'active' : ''}
          onClick={() => { setActiveSection('bookings'); window.history.pushState({}, '', '/dashboard?tab=bookings'); }}
        >
          🎫 Bookings
        </button>
        <button 
          className={activeSection === 'guides' ? 'active' : ''}
          onClick={() => { setActiveSection('guides'); window.history.pushState({}, '', '/dashboard?tab=guides'); }}
        >
          🧭 Guides
        </button>
        <button 
          className={activeSection === 'group-tours' ? 'active' : ''}
          onClick={() => { setActiveSection('group-tours'); window.history.pushState({}, '', '/dashboard?tab=group-tours'); }}
        >
          👥 Group Tours
        </button>
        <button 
          className={activeSection === 'wishlist' ? 'active' : ''}
          onClick={() => { setActiveSection('wishlist'); window.history.pushState({}, '', '/dashboard?tab=wishlist'); }}
        >
          ❤️ Wishlist
        </button>
      </div>

      {activeSection === 'overview' && (
        <>
          <div className="dashboard-header">
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Explore Bangladesh with Roaming Sonic</p>
          </div>

          {/* Profile Photo Section */}
          <div className="content-card" style={{marginBottom: '20px'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{
                width: '120px',
                height: '120px',
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
                    fontSize: '50px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    {profile?.name?.charAt(0) || 'U'}
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
                <label htmlFor="photoUpload" className="btn-primary" style={{cursor: 'pointer'}}>
                  {uploadingPhoto ? '⏳ Uploading...' : '📷 Upload Photo'}
                </label>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎫</div>
              <div className="stat-details">
                <h3>Total Bookings</h3>
                <p className="stat-value">{bookings.length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <div className="stat-details">
                <h3>Wishlist</h3>
                <p className="stat-value">{profile?.wishlist?.length || 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎁</div>
              <div className="stat-details">
                <h3>Referrals</h3>
                <p className="stat-value">{profile?.referralCount || 0}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-details">
                <h3>Referral Code</h3>
                <p className="stat-value" style={{fontSize: '20px'}}>{profile?.referralCode || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="content-card">
            <h2>Recent Bookings</h2>
            {profile?.bookings && profile.bookings.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.bookings.slice(0, 5).map((booking) => (
                    <tr key={booking._id}>
                      <td>#{booking._id?.substring(0, 8)}</td>
                      <td>{booking.type || 'Hotel'}</td>
                      <td>{new Date(booking.date).toLocaleDateString()}</td>
                      <td>
                        <span className="badge badge-success">Confirmed</span>
                      </td>
                      <td>৳{booking.amount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
                No bookings yet. Start exploring! 🌏
              </p>
            )}
          </div>

          <div className="content-card">
            <h2>Your Wishlist</h2>
            {profile?.wishlist && profile.wishlist.length > 0 ? (
              <div className="wishlist-grid">
                {profile.wishlist.slice(0, 4).map((item) => (
                  <div key={item._id} className="wishlist-item">
                    <h4>{item.name}</h4>
                    <p>{item.location}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
                Your wishlist is empty. Add some hotels! ❤️
              </p>
            )}
          </div>
        </>
      )}

      {activeSection === 'bookings' && (
        <div className="content-card">
          <h2>My Bookings 🎫</h2>
          
          {bookingsLoading ? (
            <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
              Loading bookings...
            </p>
          ) : bookings.length === 0 ? (
            <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
              No bookings yet. Start exploring! 🌏
            </p>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <div>
                      <h3>{getBookingTypeName(booking.bookingType, booking)}</h3>
                      <p className="booking-id">Booking ID: #{booking._id.substring(0, 8).toUpperCase()}</p>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="booking-details">
                    <div className="booking-info-grid">
                      <div className="info-item">
                        <span className="label">Type:</span>
                        <span className="value">{booking.bookingType.toUpperCase()}</span>
                      </div>

                      {booking.bookingType === 'tour' && booking.numberOfMembers && (
                        <div className="info-item">
                          <span className="label">Members:</span>
                          <span className="value">{booking.numberOfMembers} person(s)</span>
                        </div>
                      )}

                      {booking.travelDate && (
                        <div className="info-item">
                          <span className="label">Travel Date:</span>
                          <span className="value">{new Date(booking.travelDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      {booking.checkInDate && (
                        <div className="info-item">
                          <span className="label">Check In:</span>
                          <span className="value">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      {booking.checkOutDate && (
                        <div className="info-item">
                          <span className="label">Check Out:</span>
                          <span className="value">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      <div className="info-item">
                        <span className="label">Booked On:</span>
                        <span className="value">{new Date(booking.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="info-item">
                        <span className="label">Total Amount:</span>
                        <span className="value amount">৳{booking.totalAmount.toLocaleString()}</span>
                      </div>

                      <div className="info-item">
                        <span className="label">Payment Status:</span>
                        <span className={`value ${booking.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}`}>
                          {booking.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="special-requests">
                        <strong>Special Requests:</strong>
                        <p>{booking.specialRequests}</p>
                      </div>
                    )}

                    {booking.adminNotes && (
                      <div className="admin-notes">
                        <strong>Admin Notes:</strong>
                        <p>{booking.adminNotes}</p>
                      </div>
                    )}

                    {booking.tour && (
                      <div className="tour-details">
                        <strong>Tour Details:</strong>
                        <p>📍 {booking.tour.destination} | ⏱️ {booking.tour.duration.days}D/{booking.tour.duration.nights}N</p>
                      </div>
                    )}

                    {booking.bus && (
                      <div className="bus-details">
                        <strong>Bus Details:</strong>
                        <p>🚌 {booking.bus.from} → {booking.bus.to}</p>
                        <p>🕐 Departure: {booking.bus.departureTime} | Seats: {booking.numberOfSeats || 1}</p>
                        {booking.passengerName && <p>👤 Passenger: {booking.passengerName}</p>}
                      </div>
                    )}

                    {booking.status === 'cancelled' && booking.refundAmount > 0 && (
                      <div className="refund-info">
                        <strong>Refund Amount:</strong>
                        <span className="refund-amount">৳{booking.refundAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="booking-actions">
                    {booking.bookingType === 'bus' && booking.status === 'confirmed' && (
                      <>
                        <button 
                          className="btn-success"
                          onClick={() => handleDownloadTicket(booking._id, true)}
                          title="Download ticket as PDF file"
                        >
                          📥 Download PDF
                        </button>
                        <button 
                          className="btn-primary"
                          onClick={() => handleDownloadTicket(booking._id, false)}
                          title="View and print ticket in browser"
                          style={{ marginLeft: '10px' }}
                        >
                          👁️ View & Print
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'pending' || booking.status === 'confirmed' ? (
                      <button 
                        className="btn-danger"
                        onClick={() => handleCancelBooking(booking._id)}
                        title="70% refund on cancellation"
                      >
                        Cancel Booking
                      </button>
                    ) : booking.status === 'cancelled' ? (
                      <span className="cancelled-text">✓ Cancelled (Refund: 70%)</span>
                    ) : booking.status === 'completed' && booking.bookingType === 'tour' && !booking.userReview ? (
                      <button 
                        className="btn-primary"
                        onClick={() => openTourReviewModal(booking)}
                      >
                        ⭐ Rate Tour
                      </button>
                    ) : booking.status === 'completed' && booking.userReview ? (
                      <div className="user-review-display">
                        <span className="review-label">Your Rating:</span>
                        <span className="review-stars">
                          {'⭐'.repeat(booking.userReview.rating)}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Guide Requests Section */}
      {activeSection === 'guides' && (
        <div className="content-card">
          <h2>My Guide Requests 🧭</h2>
          {guideRequests.length === 0 ? (
            <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
              No guide requests yet. Browse guides and send connection requests!
            </p>
          ) : (
            <div className="requests-list">
              {guideRequests.map(request => (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <div>
                      <h3>{request.guide?.name || 'Guide Not Available'}</h3>
                      <p style={{color: '#666', fontSize: '14px'}}>{request.guide?.email || 'N/A'}</p>
                      {request.guide && (
                        <div className="guide-rating">
                          ⭐ {request.guide.rating?.toFixed(1) || '0.0'} ({request.guide.totalReviews || 0} reviews)
                        </div>
                      )}
                    </div>
                    <span className={`badge badge-${request.status === 'pending' ? 'warning' : request.status === 'approved' ? 'success' : request.status === 'completed' ? 'info' : 'danger'}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="request-details">
                    <p><strong>Destination:</strong> {request.destination}</p>
                    <p><strong>Tour Date:</strong> {new Date(request.tourDate).toLocaleDateString()}</p>
                    <p><strong>Duration:</strong> {request.duration} hours</p>
                    <p><strong>People:</strong> {request.numberOfPeople}</p>
                    <p><strong>Total Cost:</strong> ৳{request.totalCost}</p>
                    {request.message && <p><strong>Your Message:</strong> {request.message}</p>}
                    {request.responseMessage && (
                      <div className="response-message">
                        <strong>Guide's Response:</strong> {request.responseMessage}
                      </div>
                    )}
                  </div>
                  <div className="request-actions">
                    {request.status === 'completed' && (
                      <button 
                        className="btn-primary"
                        onClick={() => openReviewModal(request)}
                      >
                        ⭐ Add Review & Rating
                      </button>
                    )}
                    {(request.status === 'pending' || request.status === 'approved') && (
                      <button 
                        className="btn-secondary"
                        onClick={() => handleCancelRequest(request._id)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          marginLeft: '10px'
                        }}
                      >
                        ❌ Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'wishlist' && (
        <div className="content-card">
          <h2>Your Wishlist</h2>
          {profile?.wishlist && profile.wishlist.length > 0 ? (
            <div className="wishlist-grid">
              {profile.wishlist.map((item) => (
                <div key={item._id} className="wishlist-item">
                  <h4>{item.name}</h4>
                  <p>{item.location}</p>
                  <button className="btn-primary">Book Now</button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
              Your wishlist is empty. Add some hotels! ❤️
            </p>
          )}
        </div>
      )}

      {/* Group Tours Section */}
      {activeSection === 'group-tours' && (
        <>
          <div className="dashboard-header">
            <h1>My Group Tours 👥</h1>
            <button className="btn-primary" onClick={openGroupTourModal}>
              ➕ Create Group Tour
            </button>
          </div>

          {/* My Organized Group Tours */}
          <div className="content-card" style={{marginBottom: '20px'}}>
            <h2>Group Tours I'm Organizing</h2>
            {myGroupTours.length === 0 ? (
              <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
                You haven't created any group tours yet. Create one to get started!
              </p>
            ) : (
              <div className="requests-list">
                {myGroupTours.map(tour => (
                  <div key={tour._id} className="request-card">
                    <div className="request-header">
                      <div>
                        <h3>{tour.tourPackage?.name || 'Tour Package'}</h3>
                        <p style={{color: '#666', fontSize: '14px'}}>{tour.destination}</p>
                      </div>
                      <span className={`badge badge-${
                        tour.status === 'pending' ? 'warning' : 
                        tour.status === 'active' ? 'success' : 
                        tour.status === 'full' ? 'info' : 
                        tour.status === 'approved' ? 'success' : 
                        'danger'
                      }`}>
                        {tour.status}
                      </span>
                    </div>
                    <div className="request-details">
                      <p><strong>Tour Date:</strong> {new Date(tour.tourDate).toLocaleDateString()}</p>
                      {tour.endDate && <p><strong>End Date:</strong> {new Date(tour.endDate).toLocaleDateString()}</p>}
                      <p><strong>Cost per Person:</strong> ৳{tour.cost}</p>
                      <p><strong>Members:</strong> {tour.currentMembers} / {tour.maxMembers}</p>
                      <p><strong>Available Slots:</strong> {tour.maxMembers - tour.currentMembers}</p>
                      {tour.notes && <p><strong>Notes:</strong> {tour.notes}</p>}
                      {tour.adminNotes && (
                        <div className="response-message">
                          <strong>Admin Notes:</strong> {tour.adminNotes}
                        </div>
                      )}
                      <p><strong>Pending Requests:</strong> {tour.members?.filter(m => m.status === 'pending').length || 0}</p>
                    </div>
                    <div className="request-actions">
                      <button 
                        className="btn-primary"
                        onClick={() => viewGroupTourMembers(tour._id)}
                      >
                        👥 Manage Members ({tour.members?.length || 0})
                      </button>
                      {(tour.status === 'pending' || tour.status === 'active' || tour.status === 'approved') && (
                        <button 
                          className="btn-secondary"
                          onClick={() => handleCancelGroupTour(tour._id)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            marginLeft: '10px'
                          }}
                        >
                          ❌ Cancel Tour
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Group Tours I've Joined */}
          <div className="content-card">
            <h2>Group Tours I've Joined</h2>
            {joinedGroupTours.length === 0 ? (
              <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
                You haven't joined any group tours yet. Check tour packages to find groups!
              </p>
            ) : (
              <div className="requests-list">
                {joinedGroupTours.map(tour => (
                  <div key={tour._id} className="request-card">
                    <div className="request-header">
                      <div>
                        <h3>{tour.tourPackage?.name || 'Tour Package'}</h3>
                        <p style={{color: '#666', fontSize: '14px'}}>
                          Organized by: {tour.organizer?.name || 'Organizer'}
                        </p>
                        <p style={{color: '#666', fontSize: '14px'}}>{tour.destination}</p>
                      </div>
                      <span className={`badge badge-${
                        tour.myMembershipStatus === 'pending' ? 'warning' : 
                        tour.myMembershipStatus === 'approved' ? 'success' : 
                        'danger'
                      }`} style={{
                        fontSize: '14px',
                        padding: '8px 16px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {tour.myMembershipStatus === 'pending' && '⏳ '}
                        {tour.myMembershipStatus === 'approved' && '✅ '}
                        {tour.myMembershipStatus === 'rejected' && '❌ '}
                        {tour.myMembershipStatus}
                      </span>
                    </div>
                    <div className="request-details">
                      <p><strong>Tour Date:</strong> {new Date(tour.tourDate).toLocaleDateString()}</p>
                      {tour.endDate && <p><strong>End Date:</strong> {new Date(tour.endDate).toLocaleDateString()}</p>}
                      <p><strong>Cost per Person:</strong> ৳{tour.cost}</p>
                      <p><strong>Members:</strong> {tour.currentMembers} / {tour.maxMembers}</p>
                      <p><strong>Group Status:</strong> {tour.status}</p>
                      {tour.notes && <p><strong>Notes:</strong> {tour.notes}</p>}
                    </div>
                    <div className="request-actions" style={{display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', marginTop: '15px'}}>
                      <div style={{flex: 1}}>
                        {tour.myMembershipStatus === 'pending' && (
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span style={{fontSize: '24px'}}>⏳</span>
                            <div>
                              <p style={{color: '#856404', fontWeight: '600', margin: 0, fontSize: '15px'}}>
                                Pending Approval
                              </p>
                              <p style={{color: '#666', margin: '2px 0 0 0', fontSize: '13px'}}>
                                Waiting for host to approve your request
                              </p>
                            </div>
                          </div>
                        )}
                        {tour.myMembershipStatus === 'approved' && (
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span style={{fontSize: '24px'}}>✅</span>
                            <div>
                              <p style={{color: '#155724', fontWeight: '600', margin: 0, fontSize: '15px'}}>
                                Confirmed Member
                              </p>
                              <p style={{color: '#666', margin: '2px 0 0 0', fontSize: '13px'}}>
                                You're all set for this tour!
                              </p>
                            </div>
                          </div>
                        )}
                        {tour.myMembershipStatus === 'rejected' && (
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span style={{fontSize: '24px'}}>❌</span>
                            <div>
                              <p style={{color: '#721c24', fontWeight: '600', margin: 0, fontSize: '15px'}}>
                                Request Rejected
                              </p>
                              <p style={{color: '#666', margin: '2px 0 0 0', fontSize: '13px'}}>
                                The host has declined your request
                              </p>
                            </div>
                          </div>
                        )}
                        {!tour.myMembershipStatus && (
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span style={{fontSize: '24px'}}>❓</span>
                            <div>
                              <p style={{color: '#666', fontWeight: '600', margin: 0, fontSize: '15px'}}>
                                Status Unknown
                              </p>
                              <p style={{color: '#999', margin: '2px 0 0 0', fontSize: '13px'}}>
                                Checking your membership status...
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Show cancel/leave button for pending, approved, or unknown status (not for rejected) */}
                      {tour.myMembershipStatus !== 'rejected' && (
                        <button 
                          className="btn-secondary"
                          onClick={() => handleLeaveGroupTour(tour._id)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 4px rgba(220, 53, 69, 0.2)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#c82333';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.3)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#dc3545';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 4px rgba(220, 53, 69, 0.2)';
                          }}
                        >
                          {tour.myMembershipStatus === 'pending' ? (
                            <>
                              <span>🚫</span>
                              <span>Cancel Request</span>
                            </>
                          ) : tour.myMembershipStatus === 'approved' ? (
                            <>
                              <span>🚪</span>
                              <span>Leave Group</span>
                            </>
                          ) : (
                            <>
                              <span>🚫</span>
                              <span>Cancel/Leave</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <div className="modal-overlay" onClick={closeReviewModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeReviewModal}>×</button>
            <h2>Review Guide</h2>
            <div className="modal-guide-info">
              <h3>{selectedRequest.guide?.name || 'Guide'}</h3>
              <p>Tour to {selectedRequest.destination}</p>
            </div>
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group">
                <label>Rating *</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star ${reviewData.rating >= star ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setReviewData({...reviewData, rating: star});
                      }}
                      style={{cursor: 'pointer'}}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <p style={{fontSize: '14px', color: '#666', marginTop: '5px'}}>
                  Selected: {reviewData.rating} star{reviewData.rating !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                  rows="4"
                  placeholder="Share your experience with this guide..."
                  maxLength="500"
                />
              </div>

              <button type="submit" className="btn-primary">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Group Tour Modal */}
      {showGroupTourModal && (
        <div className="modal-overlay" onClick={closeGroupTourModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px'}}>
            <button className="modal-close" onClick={closeGroupTourModal}>×</button>
            <h2>Create Group Tour</h2>
            <form onSubmit={handleGroupTourSubmit} className="review-form">
              <div className="form-group">
                <label>Tour Title *</label>
                <input
                  type="text"
                  value={groupTourForm.title}
                  onChange={(e) => setGroupTourForm({...groupTourForm, title: e.target.value})}
                  placeholder="e.g., Cox's Bazar Beach Tour"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={groupTourForm.description}
                  onChange={(e) => setGroupTourForm({...groupTourForm, description: e.target.value})}
                  rows="3"
                  placeholder="Describe your tour plan..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Destination *</label>
                <input
                  type="text"
                  value={groupTourForm.destination}
                  onChange={(e) => setGroupTourForm({...groupTourForm, destination: e.target.value})}
                  placeholder="e.g., Cox's Bazar, Sylhet"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tour Start Date *</label>
                  <input
                    type="date"
                    value={groupTourForm.tourDate}
                    onChange={(e) => setGroupTourForm({...groupTourForm, tourDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tour End Date *</label>
                  <input
                    type="date"
                    value={groupTourForm.endDate}
                    onChange={(e) => setGroupTourForm({...groupTourForm, endDate: e.target.value})}
                    min={groupTourForm.tourDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Meeting Point *</label>
                  <input
                    type="text"
                    value={groupTourForm.meetingPoint}
                    onChange={(e) => setGroupTourForm({...groupTourForm, meetingPoint: e.target.value})}
                    placeholder="e.g., Kamalapur Railway Station"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Meeting Time *</label>
                  <input
                    type="time"
                    value={groupTourForm.meetingTime}
                    onChange={(e) => setGroupTourForm({...groupTourForm, meetingTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Maximum Members *</label>
                  <input
                    type="number"
                    value={groupTourForm.maxMembers}
                    onChange={(e) => setGroupTourForm({...groupTourForm, maxMembers: parseInt(e.target.value)})}
                    min="2"
                    max="50"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cost per Person (৳) *</label>
                  <input
                    type="number"
                    value={groupTourForm.costPerPerson}
                    onChange={(e) => setGroupTourForm({...groupTourForm, costPerPerson: e.target.value})}
                    placeholder="Enter cost in BDT"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>What's Included</label>
                <textarea
                  value={groupTourForm.includes}
                  onChange={(e) => setGroupTourForm({...groupTourForm, includes: e.target.value})}
                  rows="2"
                  placeholder="e.g., Transport, Meals, Accommodation..."
                />
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  value={groupTourForm.notes}
                  onChange={(e) => setGroupTourForm({...groupTourForm, notes: e.target.value})}
                  rows="3"
                  placeholder="Any special instructions, preferences, or details..."
                />
              </div>

              <button type="submit" className="btn-primary">
                Submit for Admin Approval
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Manage Members Modal */}
      {showMembersModal && selectedGroupTour && (
        <div className="modal-overlay" onClick={() => setShowMembersModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '700px'}}>
            <button className="modal-close" onClick={() => setShowMembersModal(false)}>×</button>
            <h2>Manage Group Members</h2>
            <div className="modal-guide-info">
              <h3>{selectedGroupTour.tourPackage?.name || 'Tour Package'}</h3>
              <p>Destination: {selectedGroupTour.destination}</p>
              <p>Members: {selectedGroupTour.currentMembers} / {selectedGroupTour.maxMembers}</p>
              <p>Available Slots: {selectedGroupTour.maxMembers - selectedGroupTour.currentMembers}</p>
            </div>

            {selectedGroupTour.members && selectedGroupTour.members.length > 0 ? (
              <div>
                {/* Pending Requests Section */}
                {selectedGroupTour.members.filter(m => m.status === 'pending').length > 0 && (
                  <div style={{marginBottom: '30px'}}>
                    <h3 style={{color: '#856404', fontSize: '18px', marginBottom: '15px', borderBottom: '2px solid #ffc107', paddingBottom: '8px'}}>
                      ⏳ Pending Requests ({selectedGroupTour.members.filter(m => m.status === 'pending').length})
                    </h3>
                    <div className="members-list">
                      {selectedGroupTour.members.filter(m => m.status === 'pending').map(member => (
                        <div key={member.user._id} className="member-card" style={{
                          padding: '15px',
                          border: '2px solid #ffc107',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          backgroundColor: '#fff9e6',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <h4 style={{margin: '0 0 5px 0'}}>{member.user.name}</h4>
                            <p style={{margin: '0', fontSize: '14px', color: '#666'}}>{member.user.email}</p>
                            {member.user.phone && (
                              <p style={{margin: '0', fontSize: '14px', color: '#666'}}>📞 {member.user.phone}</p>
                            )}
                            <p style={{margin: '5px 0 0 0', fontSize: '13px', color: '#999'}}>
                              Requested: {new Date(member.requestDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                            <button 
                              className="btn-primary"
                              onClick={() => handleApproveMember(selectedGroupTour._id, member.user._id)}
                              disabled={selectedGroupTour.currentMembers >= selectedGroupTour.maxMembers}
                              style={{
                                fontSize: '14px',
                                padding: '8px 20px',
                                backgroundColor: selectedGroupTour.currentMembers >= selectedGroupTour.maxMembers ? '#ccc' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: selectedGroupTour.currentMembers >= selectedGroupTour.maxMembers ? 'not-allowed' : 'pointer',
                                fontWeight: '500'
                              }}
                            >
                              ✅ Approve
                            </button>
                            <button 
                              className="btn-secondary"
                              onClick={() => handleRejectMember(selectedGroupTour._id, member.user._id)}
                              style={{
                                fontSize: '14px',
                                padding: '8px 20px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500'
                              }}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedGroupTour.currentMembers >= selectedGroupTour.maxMembers && (
                      <p style={{color: '#dc3545', fontSize: '14px', fontStyle: 'italic', marginTop: '10px'}}>
                        ⚠️ Tour is full - cannot approve more members
                      </p>
                    )}
                  </div>
                )}

                {/* Approved Members Section */}
                {selectedGroupTour.members.filter(m => m.status === 'approved').length > 0 && (
                  <div style={{marginBottom: '30px'}}>
                    <h3 style={{color: '#155724', fontSize: '18px', marginBottom: '15px', borderBottom: '2px solid #28a745', paddingBottom: '8px'}}>
                      ✅ Approved Members ({selectedGroupTour.members.filter(m => m.status === 'approved').length})
                    </h3>
                    <div className="members-list">
                      {selectedGroupTour.members.filter(m => m.status === 'approved').map(member => (
                        <div key={member.user._id} className="member-card" style={{
                          padding: '15px',
                          border: '2px solid #28a745',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          backgroundColor: '#f0f9f4',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <h4 style={{margin: '0 0 5px 0'}}>{member.user.name}</h4>
                            <p style={{margin: '0', fontSize: '14px', color: '#666'}}>{member.user.email}</p>
                            {member.user.phone && (
                              <p style={{margin: '0', fontSize: '14px', color: '#666'}}>📞 {member.user.phone}</p>
                            )}
                            <p style={{margin: '5px 0 0 0', fontSize: '13px', color: '#999'}}>
                              Approved: {new Date(member.approvedDate || member.requestDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span style={{
                            fontSize: '14px',
                            padding: '6px 12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            borderRadius: '20px',
                            fontWeight: '500'
                          }}>
                            ✅ Confirmed
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejected Members Section */}
                {selectedGroupTour.members.filter(m => m.status === 'rejected').length > 0 && (
                  <div>
                    <h3 style={{color: '#721c24', fontSize: '18px', marginBottom: '15px', borderBottom: '2px solid #dc3545', paddingBottom: '8px'}}>
                      ❌ Rejected Requests ({selectedGroupTour.members.filter(m => m.status === 'rejected').length})
                    </h3>
                    <div className="members-list">
                      {selectedGroupTour.members.filter(m => m.status === 'rejected').map(member => (
                        <div key={member.user._id} className="member-card" style={{
                          padding: '15px',
                          border: '2px solid #dc3545',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          backgroundColor: '#f8e6e6',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <h4 style={{margin: '0 0 5px 0'}}>{member.user.name}</h4>
                            <p style={{margin: '0', fontSize: '14px', color: '#666'}}>{member.user.email}</p>
                            <p style={{margin: '5px 0 0 0', fontSize: '13px', color: '#999'}}>
                              Rejected: {new Date(member.requestDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span style={{
                            fontSize: '14px',
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            borderRadius: '20px',
                            fontWeight: '500'
                          }}>
                            ❌ Rejected
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedGroupTour.members.length === 0 && (
                  <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
                    No member requests yet
                  </p>
                )}
              </div>
            ) : (
              <p style={{textAlign: 'center', color: '#666', padding: '30px 0'}}>
                No member requests yet
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tour Review Modal */}
      {showTourReviewModal && selectedBooking && (
        <div className="modal-overlay" onClick={closeTourReviewModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '500px'}}>
            <button className="modal-close" onClick={closeTourReviewModal}>×</button>
            <h2>Rate Your Tour Experience</h2>
            
            <div className="modal-guide-info">
              <h3>{selectedBooking.tour?.title}</h3>
              <p>📍 {selectedBooking.tour?.destination}</p>
            </div>

            <form onSubmit={handleTourReviewSubmit}>
              <div className="form-group">
                <label>Rating *</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star ${tourReviewData.rating >= star ? 'active' : ''}`}
                      onClick={() => setTourReviewData({...tourReviewData, rating: star})}
                      style={{
                        fontSize: '2.5rem',
                        cursor: 'pointer',
                        color: tourReviewData.rating >= star ? '#ffc107' : '#ddd',
                        transition: 'color 0.2s'
                      }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <p style={{textAlign: 'center', margin: '10px 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#667eea'}}>
                  {tourReviewData.rating} {tourReviewData.rating === 1 ? 'Star' : 'Stars'}
                </p>
              </div>

              <div className="form-group">
                <label>Your Review *</label>
                <textarea
                  value={tourReviewData.comment}
                  onChange={(e) => setTourReviewData({...tourReviewData, comment: e.target.value})}
                  required
                  rows="4"
                  placeholder="Share your experience with this tour..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{width: '100%'}}>
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TouristDashboard;
