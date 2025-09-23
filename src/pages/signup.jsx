import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser, getOrganizationByType } from '../api';
import { useAuth } from '../contexts/AuthContext';
import AyuTraceLogo from '../components/AyuTraceLogo';

// --- SVG Icon ---
const LeafIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.61,3.47A8.75,8.75,0,0,0,12,2a8.75,8.75,0,0,0-5.61,1.47,8.75,8.75,0,0,0-3.32,12.46l.16.27.17.27,1.6,2.57.17.26.16.25a8.74,8.74,0,0,0,13.34,0l.16-.25.17-.26,1.6-2.57.17-.27.16-.27A8.75,8.75,0,0,0,17.61,3.47ZM12,20.42a6.76,6.76,0,0,1-5.18-2.3l-.15-.24-.15-.24L5,15.07l-.15-.24-.14-.24a6.75,6.75,0,0,1,2.56-9.58,6.75,6.75,0,0,1,9.56,0,6.75,6.75,0,0,1,2.56,9.58l-.14.24-.15.24L19,15.07l-.15.24-.15.24A6.76,6.76,0,0,1,12,20.42Z" />
    <path d="M12,4.11a6.83,6.83,0,0,0-4,1.62,6.7,6.7,0,0,0,4,11.62,6.7,6.7,0,0,0,4-11.62A6.83,6.83,0,0,0,12,4.11Z" />
  </svg>
);

// --- Sign Up Page Component ---
export default function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('FARMER'); // default role
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [blockchainIdentity, setBlockchainIdentity] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orgLoading, setOrgLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [locationRequired, setLocationRequired] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  // Fetch organizationId when role changes
  useEffect(() => {
    async function fetchOrgId() {
      setOrgLoading(true);
      setOrganizationId('');
      try {
        const res = await getOrganizationByType(role);
        setOrganizationId(res.organizationId);
      } catch (err) {
        setError('Failed to fetch organization ID');
        setOrganizationId('');
      } finally {
        setOrgLoading(false);
      }
    }
    if (role) fetchOrgId();
  }, [role]);

  // Auto-request location when component mounts
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLandingClick = () => {
    navigate('/');
  };

  // Geolocation function
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setLocationError('');
    setHasLocationPermission(false);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser. Please use a modern browser to continue.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setLatitude(lat);
        setLongitude(lng);
        setHasLocationPermission(true);
        setLocationLoading(false);
        setLocationError('');
        
        // Optional: Reverse geocoding to get location name
        reverseGeocode(lat, lng);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Location access is required to proceed with registration.';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please allow location access and refresh the page to continue registration.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your device settings and try again.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please refresh the page and try again.';
            break;
        }
        
        setLocationError(errorMessage);
        setHasLocationPermission(false);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Reverse geocoding to get location name from coordinates
  const reverseGeocode = async (lat, lng) => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          // Extract city, state, country from the response
          const address = data.address;
          let locationName = '';
          
          if (address.city || address.town || address.village) {
            locationName += address.city || address.town || address.village;
          }
          if (address.state) {
            locationName += locationName ? `, ${address.state}` : address.state;
          }
          if (address.country) {
            locationName += locationName ? `, ${address.country}` : address.country;
          }
          
          if (locationName) {
            setLocation(locationName);
          }
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Don't show error for reverse geocoding failure, lat/lng are still filled
    }
  };  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Check if location permission is granted
    if (!hasLocationPermission || !latitude || !longitude) {
      setError('Location access is required to complete registration. Please allow location access and try again.');
      setLoading(false);
      return;
    }
    
    try {
      if (!organizationId) {
        setError('Organization ID not found for selected role.');
        setLoading(false);
        return;
      }
      const res = await signupUser({ 
        email, 
        password, 
        firstName, 
        lastName, 
        orgType: role,
        organizationId,
        blockchainIdentity: blockchainIdentity || `user-${Date.now()}@cooperative.prakritichain.com`, 
        phone: phone || '', 
        location: location || '', 
        latitude: parseFloat(latitude) || 0, 
        longitude: parseFloat(longitude) || 0 
      });
      
      // Use AuthContext login method
      login(res.data.user, res.data.token);
      
      // Extract role from response: res.data.user.orgType
      const userRole = res.data.user.orgType;
      console.log('Signup successful, user role:', userRole);
      
      if (userRole === 'MANUFACTURER') navigate('/manudash');
      else if (userRole === 'LABS') navigate('/labs-dashboard');
      else if (userRole === 'DISTRIBUTOR') navigate('/distributordash');
      else if (userRole === 'FARMER') navigate('/'); // Redirect farmers to landing page
      else {
        console.log('Unknown role, redirecting to dashboard redirect');
        navigate('/dashboard'); // Let DashboardRedirect handle it
      }
    } catch (err) {
      setError(err.message || 'Signup failed');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg sm:max-w-2xl">
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
            <h2 className="responsive-text-xl font-bold text-center text-gray-800 mb-1">Create Your Account</h2>
            <p className="text-center text-gray-500 mb-6 sm:mb-8 responsive-text-sm">Join the AyuTrace platform for transparent supply chain management.</p>
            
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSignup}>
              {orgLoading && <div className="text-xs text-gray-500">Fetching organization ID...</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block responsive-text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" className="input-responsive" required />
                </div>
                <div>
                  <label className="block responsive-text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" className="input-responsive" />
                </div>
              </div>
              
              <div>
                <label className="block responsive-text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-responsive" required />
              </div>
              
              <div>
                <label className="block responsive-text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-responsive" required />
              </div>
              
              <div>
                <label className="block responsive-text-sm font-medium text-gray-700 mb-1">Organization Type</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="input-responsive bg-white appearance-none">
                  <option value="FARMER">Farmer/Grower</option>
                  <option value="MANUFACTURER">Manufacturing Partner</option>
                  <option value="LABS">Testing Laboratory</option>
                  <option value="DISTRIBUTOR">Distribution Partner</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Register your organization with the AyuTrace platform.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block responsive-text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+919876543210" className="input-responsive" />
                </div>
                <div>
                  <label className="block responsive-text-sm font-medium text-gray-700 mb-1">
                    Location (Required) {locationLoading && <span className="text-blue-500">(Auto-detecting...)</span>}
                  </label>
                  <input 
                    type="text" 
                    value={location} 
                    readOnly
                    placeholder="Auto-detected location will appear here" 
                    className="input-responsive bg-gray-50 cursor-not-allowed" 
                    title="Location is automatically detected and cannot be edited"
                  />
                  {locationError && (
                    <p className="text-xs text-red-500 mt-1">{locationError}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block responsive-text-sm font-medium text-gray-700 mb-1">
                    Latitude {locationLoading && <span className="text-blue-500">(Auto-detecting...)</span>}
                  </label>
                  <input 
                    type="number" 
                    step="any" 
                    value={latitude} 
                    readOnly
                    placeholder="Auto-detected" 
                    className="input-responsive bg-gray-50 cursor-not-allowed" 
                    title="Latitude is automatically detected from your location"
                  />
                </div>
                <div>
                  <label className="block responsive-text-sm font-medium text-gray-700 mb-1">
                    Longitude {locationLoading && <span className="text-blue-500">(Auto-detecting...)</span>}
                  </label>
                  <input 
                    type="number" 
                    step="any" 
                    value={longitude} 
                    readOnly
                    placeholder="Auto-detected" 
                    className="input-responsive bg-gray-50 cursor-not-allowed" 
                    title="Longitude is automatically detected from your location"
                  />
                </div>
              </div>
              
              {(latitude && longitude) && hasLocationPermission && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-green-700">
                      Location detected: {parseFloat(latitude).toFixed(4)}, {parseFloat(longitude).toFixed(4)}
                    </span>
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                className={`button-responsive w-full font-bold shadow-lg transition-all duration-300 transform ${
                  hasLocationPermission && !loading 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105' 
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
                disabled={loading || !hasLocationPermission}
              >
                {loading ? 'Signing Up...' : hasLocationPermission ? 'Sign Up' : 'Location Access Required'}
              </button>
              
              {!hasLocationPermission && !locationLoading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-red-800">Location Access Required</h4>
                      <p className="text-sm text-red-600 mt-1">
                        Please allow location access in your browser and refresh the page to continue with registration.
                      </p>
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-2 text-sm text-red-700 underline hover:text-red-800"
                      >
                        Refresh Page
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>

          {loading && <div className="text-center text-gray-500 responsive-text-sm">Loading...</div>}
          {error && <div className="text-center text-red-600 bg-red-50 p-3 rounded-lg responsive-text-sm">{error}</div>}

           <p className="text-center responsive-text-sm text-gray-600 mt-4 sm:mt-6">
            Already have an account?{' '}
            <button onClick={handleLoginClick} className="font-semibold text-emerald-600 hover:underline">
              Login
            </button>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}

