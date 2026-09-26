import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import NotificationToast from './components/common/NotificationToast';
import CrisisSyncDashboard from './components/dashboard/CrisisSyncDashboard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HospitalDashboard from './pages/HospitalDashboard';
import AmbulanceDashboard from './pages/AmbulanceDashboard';
import CommandCenterDashboard from './pages/CommandCenterDashboard';

import { useAuth } from './context/AuthContext';
import AccessDenied from './components/common/AccessDenied';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#030712] flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-cyan-600 dark:text-cyan-300 font-medium">Verifying healthcare clearance...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = user.role;
  const isSuperAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(role);
  const isHospital = ['HOSPITAL', 'HOSPITAL_ADMIN'].includes(role);
  const isParamedic = ['PARAMEDIC', 'HOSPITAL_STAFF'].includes(role);
  const isUser = ['USER', 'CITIZEN'].includes(role);

  const hasAccess =
    isSuperAdmin ||
    allowedRoles.includes(role) ||
    (allowedRoles.includes('HOSPITAL') && isHospital) ||
    (allowedRoles.includes('PARAMEDIC') && isParamedic) ||
    (allowedRoles.includes('USER') && isUser);

  if (!hasAccess) {
    return <AccessDenied user={user} requiredRoles={allowedRoles} />;
  }

  return children;
};

function App() {
  const location = useLocation();
  const isRootDashboard =
    location.pathname === '/' ||
    location.pathname === '/overview' ||
    location.pathname === '/analytics';

  return (
    <div className="min-h-screen flex flex-col relative bg-slate-100 dark:bg-[#030712] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {!isRootDashboard && <Navbar />}
      <div className="flex-1">
        <Routes>
          {/* Public Citizen Emergency Telemetry Portal */}
          <Route path="/" element={<CrisisSyncDashboard defaultTab="Overview" />} />
          <Route path="/overview" element={<CrisisSyncDashboard defaultTab="Overview" />} />
          <Route path="/analytics" element={<CrisisSyncDashboard defaultTab="Analytics" />} />

          {/* Dedicated Hospital Management (Restricted to Hospital Clearance & Admin) */}
          <Route
            path="/hospital"
            element={
              <ProtectedRoute allowedRoles={['HOSPITAL']}>
                <HospitalDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dedicated Ambulance Dispatch & Navigation (Restricted to Paramedic Clearance & Admin) */}
          <Route
            path="/ambulance"
            element={
              <ProtectedRoute allowedRoles={['PARAMEDIC']}>
                <AmbulanceDashboard />
              </ProtectedRoute>
            }
          />

          {/* Metropolitan Central Command (Restricted to Admin / Super Admin Clearance) */}
          <Route
            path="/command"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <CommandCenterDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isRootDashboard && <Footer />}
      <NotificationToast />
    </div>
  );
}

export default App;
