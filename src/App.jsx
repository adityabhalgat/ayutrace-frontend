import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/landing';
import Login from './pages/login';
import Signup from './pages/signup';
import CreateOrganization from './pages/createorg';
import ManufacturerDashboard from './pages/manudash-modular';
import CheckerDash from './pages/checkdash';
import DistributorDash from './pages/distributordash';
import LabsDashboard from './components/Labs/LabsDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VerifyPage from './pages/verify';
import './App.css';

// Dashboard redirect based on user role
function DashboardRedirect() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Redirect based on organization type
  switch (user.orgType) {
    case 'MANUFACTURER':
      return <Navigate to="/manudash" />;
    case 'LABS':
      return <Navigate to="/labs-dashboard" />;
    case 'DISTRIBUTOR':
      return <Navigate to="/distributordash" />;
    case 'CHECKER':
      return <Navigate to="/checkdash" />;
    case 'ADMIN':
      return <Navigate to="/admin-dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/create-organization" element={<CreateOrganization />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route 
              path="/manudash" 
              element={
                <ProtectedRoute>
                  <ManufacturerDashboard />
                </ProtectedRoute>
              } 
            />


            {/* this is for the labs */}
            <Route 
              path="/checkdash" 
              element={
                <ProtectedRoute>
                  <CheckerDash />
                </ProtectedRoute>
              } 
            />
            {/* this is for the labs dashboard */}
            <Route 
              path="/labs-dashboard" 
              element={
                <ProtectedRoute>
                  <LabsDashboard />
                </ProtectedRoute>
              } 
            />
            {/* this is for the distributors */}
            <Route 
              path="/distributordash" 
              element={
                <ProtectedRoute>
                  <DistributorDash />
                </ProtectedRoute>
              } 
            />
            {/* Placeholder for admin dashboard */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
