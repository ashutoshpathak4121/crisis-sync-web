import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import NotificationToast from './components/common/NotificationToast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HospitalDashboard from './pages/HospitalDashboard';
import AmbulanceDashboard from './pages/AmbulanceDashboard';
import CommandCenterDashboard from './pages/CommandCenterDashboard';
import { useAuth } from './context/AuthContext';

// Role-protected route wrapper (optional for hackathon demo flexibility)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Will show spinner from context
  }

  // Allow guests to view all dashboards during hackathon demo if desired, or require login
  // We can let them view or guide them to login
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/hospital"
            element={
              <ProtectedRoute allowedRoles={['HOSPITAL', 'ADMIN']}>
                <HospitalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ambulance"
            element={
              <ProtectedRoute allowedRoles={['PARAMEDIC', 'ADMIN']}>
                <AmbulanceDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/command"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <CommandCenterDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
      <NotificationToast />
    </div>
  );
}

export default App;
