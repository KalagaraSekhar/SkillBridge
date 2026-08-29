import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { InternshipProvider, useInternships } from './context/InternshipContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import LiveChatDrawer from './components/LiveChatDrawer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import OtpVerifyPage from './pages/OtpVerifyPage';
import StudentLogin from './pages/StudentLogin';
import CompanyLogin from './pages/CompanyLogin';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import InternshipListingPage from './pages/InternshipListingPage';
import InternshipDetailPage from './pages/InternshipDetailPage';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';

// Global Chat Wrapper component
const GlobalChatDrawer = () => {
  const { liveChatOpen, closeLiveChat, activeChatThreadId } = useInternships();
  return (
    <LiveChatDrawer
      isOpen={liveChatOpen}
      onClose={closeLiveChat}
      initialThreadId={activeChatThreadId}
    />
  );
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <InternshipProvider>
            <div className="flex flex-col min-h-screen bg-surface">
              {/* Sticky Navigation with Real-Time Telemetry */}
              <Navbar />

              {/* Main Content View with Role-Based Route Guards */}
              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/verify-otp" element={<Navigate to="/student/dashboard" replace />} />
                  <Route path="/login" element={<Navigate to="/login/student" replace />} />
                  <Route path="/login/student" element={<StudentLogin />} />
                  <Route path="/login/company" element={<CompanyLogin />} />
                  <Route path="/login/admin" element={<AdminLogin />} />
                  <Route path="/internships" element={<InternshipListingPage />} />
                  <Route path="/internships/:id" element={<InternshipDetailPage />} />

                  {/* Role-guarded Student routes */}
                  <Route
                    path="/student/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['STUDENT']}>
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['STUDENT']}>
                        <Navigate to="/student/dashboard" replace />
                      </ProtectedRoute>
                    }
                  />

                  {/* Role-guarded Company / Employer routes */}
                  <Route
                    path="/company/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['COMPANY']}>
                        <CompanyDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Role-guarded Admin routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Role-guarded Profile & Settings */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute allowedRoles={['STUDENT', 'COMPANY', 'ADMIN']}>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Real-Time Live Recruiter Chat Drawer */}
              <GlobalChatDrawer />

              {/* Toast feedback system */}
              <Toast />

              {/* Global Footer */}
              <Footer />
            </div>
          </InternshipProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
