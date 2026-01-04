import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Hotels from './pages/Hotels';
import Guides from './pages/Guides';
import Buses from './pages/Buses';
import Tours from './pages/Tours';
import GroupTours from './pages/GroupTours';
import TouristDashboard from './pages/dashboards/TouristDashboard';
import GuideDashboard from './pages/dashboards/GuideDashboard';
import HotelOwnerDashboard from './pages/dashboards/HotelOwnerDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ChangePassword from './pages/ChangePassword';
import ChatBot from './components/ChatBot';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Dashboard Router Component
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.userType) {
    case 'tourist':
      return <TouristDashboard />;
    case 'guide':
      return <GuideDashboard />;
    case 'hotel_owner':
      return <HotelOwnerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/" />;
  }
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/buses" element={<Buses />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/group-tours" element={<GroupTours />} />
              
              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard/change-password" element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              } />

              <Route path="/dashboard/profile" element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } />

              <Route path="/dashboard/hotels" element={
                <ProtectedRoute allowedRoles={['hotel_owner', 'admin']}>
                  <HotelOwnerDashboard />
                </ProtectedRoute>
              } />

              <Route path="/dashboard/guide-profile" element={
                <ProtectedRoute allowedRoles={['guide']}>
                  <GuideDashboard />
                </ProtectedRoute>
              } />

              <Route path="/dashboard/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
            
            {/* AI ChatBot - Available on all pages */}
            <ChatBot />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
