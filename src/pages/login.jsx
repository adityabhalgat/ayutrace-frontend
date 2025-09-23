import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AyuTraceLogo from '../components/AyuTraceLogo';

// --- SVG Icon ---
const LeafIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.61,3.47A8.75,8.75,0,0,0,12,2a8.75,8.75,0,0,0-5.61,1.47,8.75,8.75,0,0,0-3.32,12.46l.16.27.17.27,1.6,2.57.17.26.16.25a8.74,8.74,0,0,0,13.34,0l.16-.25.17-.26,1.6-2.57.17-.27.16-.27A8.75,8.75,0,0,0,17.61,3.47ZM12,20.42a6.76,6.76,0,0,1-5.18-2.3l-.15-.24-.15-.24L5,15.07l-.15-.24-.14-.24a6.75,6.75,0,0,1,2.56-9.58,6.75,6.75,0,0,1,9.56,0,6.75,6.75,0,0,1,2.56,9.58l-.14.24-.15.24L19,15.07l-.15.24-.15.24A6.76,6.76,0,0,1,12,20.42Z" />
    <path d="M12,4.11a6.83,6.83,0,0,0-4,1.62,6.7,6.7,0,0,0,4,11.62,6.7,6.7,0,0,0,4-11.62A6.83,6.83,0,0,0,12,4.11Z" />
  </svg>
);

// --- Login Page Component ---
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Get the auth context
  const authContext = useAuth();
  const { login } = authContext || {};
  
  // Debug log to check if login function exists
  console.log('Auth context:', authContext);
  console.log('Login function:', login);

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLandingClick = () => {
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', { email });
      const res = await loginUser({ 
        email, 
        password 
      });
      
      console.log('Login response:', res);
      
      // Check if login function exists before calling it
      if (typeof login !== 'function') {
        throw new Error('Login function is not available from AuthContext');
      }
      
      // Check response structure
      if (!res.data || !res.data.user || !res.data.token) {
        throw new Error('Invalid response structure from login API');
      }
      
      // Use AuthContext login method
      login(res.data.user, res.data.token);
      
      // Extract role from response: res.data.user.orgType
      const userRole = res.data.user.orgType;
      console.log('Login successful, user role:', userRole);
      console.log('Full user object:', res.data.user);
      
      // Redirect to dashboard which will handle role-based routing
      console.log('Navigating to /dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error details:', err);
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md sm:max-w-lg">
          <div className="card-responsive">
            {/* Go Back Button */}
            <div className="flex justify-start mb-4">
              <button 
                onClick={handleLandingClick}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm">Back to Home</span>
              </button>
            </div>
            
            <div className="flex justify-center mb-6">
              <AyuTraceLogo size="medium" onClick={handleLandingClick} />
            </div>
            <h2 className="responsive-text-xl font-bold text-center text-gray-800 mb-1">Welcome Back!</h2>
            <p className="text-center text-gray-500 mb-6 sm:mb-8 responsive-text-sm">Login to your AyuTrace platform account.</p>
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block responsive-text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-responsive"
                />
              </div>
              <div>
                <label className="block responsive-text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-responsive"
                />
              </div>
              <button 
                type="submit" 
                className="button-responsive w-full bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              {loading && <div className="text-center text-gray-500 responsive-text-sm">Loading...</div>}
              {error && <div className="text-center text-red-600 bg-red-50 p-3 rounded-lg responsive-text-sm">{error}</div>}
            </form>
            <p className="text-center responsive-text-sm text-gray-600 mt-4 sm:mt-6">
              Don't have an account?{' '}
              <button onClick={handleSignUpClick} className="font-semibold text-emerald-600 hover:underline">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

