import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Landing from './pages/landing';
import Login from './pages/login';
import Signup from './pages/signup';
import CreateOrganization from './pages/createorg';
import ManufacturerDashboard from './pages/manudash-modular';
import CheckerDash from './pages/checkdash';
import DistributorDashboard from './pages/DistributorDashboard';
import SimpleDistributorDashboard from './pages/SimpleDistributorDashboard';
import SimpleDistributorTest from './pages/SimpleDistributorTest';
import ModernDistributorDashboard from './pages/ModernDistributorDashboard';
import LabsDashboard from './components/Labs/LabsDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VerifyPage from './pages/verify';
import './App.css';

// Dashboard redirect based on user role
function DashboardRedirect() {
  const { user } = useAuth();
  
  console.log('DashboardRedirect - User object:', user);
  
  if (!user) {
    console.log('DashboardRedirect - No user, redirecting to landing');
    return <Navigate to="/" />;
  }
  
  console.log('DashboardRedirect - User orgType:', user.orgType);
  
  // Redirect based on organization type
  switch (user.orgType) {
    case 'MANUFACTURER':
      console.log('Redirecting to manufacturer dashboard');
      return <Navigate to="/manudash" />;
    case 'LABS':
      console.log('Redirecting to labs dashboard');
      return <Navigate to="/labs-dashboard" />;
    case 'DISTRIBUTOR':
      console.log('Redirecting to distributor dashboard');
      return <Navigate to="/distributordash" />;
    case 'CHECKER':
      console.log('Redirecting to checker dashboard');
      return <Navigate to="/checkdash" />;
    case 'ADMIN':
      console.log('Redirecting to admin dashboard');
      return <Navigate to="/admin-dashboard" />;
    case 'FARMER':
      console.log('Redirecting farmer to landing page');
      return <Navigate to="/" />;
    default:
      console.log('Unknown orgType, redirecting to landing');
      return <Navigate to="/" />;
  }
}

// Landing page wrapper that redirects authenticated users to dashboard
function LandingWrapper() {
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
  
  // If user is authenticated, redirect to their dashboard
  if (user) {
    return <DashboardRedirect />;
  }
  
  // If not authenticated, show landing page
  return <Landing />;
}

// Login page wrapper that redirects authenticated users to dashboard
function LoginWrapper() {
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
  
  // If user is authenticated, redirect to their dashboard
  if (user) {
    return <DashboardRedirect />;
  }
  
  // If not authenticated, show login page
  return <Login />;
}
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  console.log('ProtectedRoute - Loading:', loading, 'User:', user);
  
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
  
  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to landing');
    return <Navigate to="/" />;
  }
  
  console.log('ProtectedRoute - User authenticated, rendering children');
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingWrapper />} />
            <Route path="/login" element={<LoginWrapper />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/create-organization" element={<CreateOrganization />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route 
              path="/manudash" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <ManufacturerDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />


            {/* this is for the labs */}
            <Route 
              path="/checkdash" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <CheckerDash />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            {/* this is for the labs dashboard */}
            <Route 
              path="/labs-dashboard" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <LabsDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            {/* this is for the distributors - Modern Full Featured Version */}
            <Route 
              path="/distributordash" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <ModernDistributorDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            {/* Test simple component */}
            <Route 
              path="/distributordash-test" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <SimpleDistributorTest />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            {/* Simple distributor dashboard */}
            <Route 
              path="/distributordash-simple" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <SimpleDistributorDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            {/* Modern distributor dashboard */}
            <Route 
              path="/distributordash-modern" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <ModernDistributorDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            {/* Test modern without protection (for debugging) */}
            <Route 
              path="/test-modern" 
              element={
                <ErrorBoundary>
                  <ModernDistributorDashboard />
                </ErrorBoundary>
              } 
            />
            {/* Legacy distributor dashboard */}
            <Route 
              path="/distributordash-legacy" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <DistributorDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
              } 
            />
            {/* Placeholder for admin dashboard */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ErrorBoundary>
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                </ErrorBoundary>
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
