import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AyuTraceLogo from '../components/AyuTraceLogo';

// Demo users with their credentials
const demoUsers = [
  {
    id: 'manufacturer',
    role: 'MANUFACTURER',
    name: 'Priya Manufacturer',
    email: 'manufacturer@demo.com',
    password: 'demo123',
    avatar: '🏭',
    description: 'Food products processor'
  },
  {
    id: 'lab',
    role: 'LABS',
    name: 'Dr. Amit LabTech',
    email: 'lab@demo.com',
    password: 'demo123',
    avatar: '🔬',
    description: 'Quality testing laboratory technician'
  },
  {
    id: 'distributor',
    role: 'DISTRIBUTOR',
    name: 'Sanjay Distributor',
    email: 'distributor@demo.com',
    password: 'demo123',
    avatar: '📦',
    description: 'Fresh produce distributor'
  },
  {
    id: 'admin',
    role: 'ADMIN',
    name: 'Super Admin',
    email: 'admin@demo.com',
    password: 'demo123',
    avatar: '👤',
    description: 'System administrator'
  }
];

// Farmer App Download Modal Component
function FarmerAppModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const downloadLinks = {
    android: 'https://play.google.com/store/apps', // Replace with actual link
    ios: 'https://apps.apple.com/app', // Replace with actual link
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🌾</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Farmer!</h2>
          <p className="text-gray-600 mb-2">
            We have a dedicated mobile app designed specifically for farmers with enhanced features.
          </p>
          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <span className="mr-1">✨</span>
            Recommended for farmers
          </div>
        </div>

        {/* App Features */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Farmer App Features:</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Crop management & tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Real-time weather updates</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Supply chain integration</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Offline capability</span>
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="space-y-3">
          <a
            href={downloadLinks.android}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4482-.9993-.9993s.4482-.9993.9993-.9993.9993.4482.9993.9993-.4482.9993-.9993.9993zm-11.046 0c-.5511 0-.9993-.4482-.9993-.9993s.4482-.9993.9993-.9993.9993.4482.9993.9993-.4482.9993-.9993.9993zm11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.5038C15.5207 8.2434 13.8128 7.8 12 7.8s-3.5207.4434-5.1857 1.1506L4.7917 5.2468a.4161.4161 0 00-.5972-.1518.4161.4161 0 00-.1518.5972l1.9973 3.4592C2.61 10.59.8 13.09.8 16v.8A1.6 1.6 0 002.4 18.4h19.2a1.6 1.6 0 001.6-1.6V16c0-2.91-1.81-5.41-5.2355-6.6586z" />
            </svg>
            <span>Download for Android</span>
          </a>

          <a
            href={downloadLinks.ios}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.13997 6.91 8.85997 6.88C10.15 6.86 11.38 7.75 12.1 7.75C12.81 7.75 14.28 6.65 15.87 6.83C16.5 6.85 18.27 7.15 19.35 8.83C19.27 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
            </svg>
            <span>Download for iOS</span>
          </a>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            📱 Skip for Now - Continue to Home
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Download the app for the best farming experience, or continue to explore our platform.
          </p>
        </div>
      </div>
    </div>
  );
}

// User Selection Card Component
function UserSelectionCard({ selectedUser, onUserSelect, onCloseCard }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Demo User Selection</h3>
        <button
          onClick={onCloseCard}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Choose a demo user to auto-populate the login form, or close this card to enter credentials manually.
      </p>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {demoUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => onUserSelect(user)}
            className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${selectedUser?.id === user.id
                ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
              }`}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{user.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{user.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                      user.role === 'LABS' ? 'bg-blue-100 text-blue-700' :
                        user.role === 'MANUFACTURER' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'DISTRIBUTOR' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                    }`}>
                    {user.role}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{user.description}</p>
                <p className="text-xs text-gray-500 mt-1">{user.email}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p><strong>All demo accounts use password:</strong> demo123</p>
        </div>
      </div>
    </div>
  );
}

// --- Login Page Component ---
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFarmerModal, setShowFarmerModal] = useState(false);
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

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setEmail(user.email);
    setPassword(user.password);
  };

  const handleCloseUserSelection = () => {
    setShowUserSelection(false);
    setSelectedUser(null);
  };

  const handleShowUserSelection = () => {
    setShowUserSelection(true);
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

      // Check if user is a farmer and show app download modal
      if (userRole === 'FARMER') {
        console.log('Farmer detected! Showing app download modal...');
        setShowFarmerModal(true);
        return; // Don't navigate yet, let user choose
      }

      // Redirect to dashboard for other roles
      console.log('Navigating to /dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error details:', err);
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleManualLogin = () => {
    setSelectedUser(null);
    setEmail('');
    setPassword('');
    setShowUserSelection(false);
  };

  const handleFarmerModalClose = () => {
    console.log('Farmer modal closing, redirecting to home page...');
    setShowFarmerModal(false);
    // Redirect farmer to home page after showing app download modal
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

            {/* Demo User Selection Card */}
            <div className="w-full lg:w-2/5">
              {showUserSelection ? (
                <UserSelectionCard
                  selectedUser={selectedUser}
                  onUserSelect={handleUserSelect}
                  onCloseCard={handleCloseUserSelection}
                />
              ) : (
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">For Judges & Evaluators</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Quick access to demo accounts for testing different user roles and functionalities.
                  </p>
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">🌾</span>
                      <p className="text-xs text-green-700">
                        <strong>Note:</strong> Farmers should use our dedicated mobile app for the best experience.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleShowUserSelection}
                      className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      🎯 Choose Demo User
                    </button>

                    <button
                      onClick={handleManualLogin}
                      className="w-full bg-white text-gray-700 px-4 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      ✏️ Manual Entry
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-emerald-200">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {demoUsers.slice(0, 4).map((user) => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <span>{user.avatar}</span>
                          <span className="text-gray-600">{user.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Login Form */}
            <div className="w-full lg:w-3/5">
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
                  <AyuTraceLogo size="medium" showText={false} onClick={handleLandingClick} />
                </div>

                <h2 className="responsive-text-xl font-bold text-center text-gray-800 mb-1">Welcome Back!</h2>
                <p className="text-center text-gray-500 mb-6 sm:mb-8 responsive-text-sm">Login to your platform account.</p>

                {/* Selected User Display */}
                {selectedUser && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{selectedUser.avatar}</div>
                        <div>
                          <p className="font-medium text-emerald-800">{selectedUser.name}</p>
                          <p className="text-sm text-emerald-600">{selectedUser.role}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="text-emerald-600 hover:text-emerald-800 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

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
      </div>

      {/* Farmer App Download Modal */}
      <FarmerAppModal
        isOpen={showFarmerModal}
        onClose={handleFarmerModalClose}
      />
    </div>
  );
}

