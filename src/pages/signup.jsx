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

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLandingClick = () => {
    navigate('/');
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
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
      else {
        console.log('Unknown role, redirecting to home');
        navigate('/');
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
                  <label className="block responsive-text-sm font-medium text-gray-700 mb-1">Location (Optional)</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Satara District, Maharashtra" className="input-responsive" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block responsive-text-sm font-medium text-gray-700 mb-1">Latitude (Optional)</label>
                  <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="17.6868" className="input-responsive" />
                </div>
                <div>
                  <label className="block responsive-text-sm font-medium text-gray-700 mb-1">Longitude (Optional)</label>
                  <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="74.0183" className="input-responsive" />
                </div>
              </div>
              
              <button type="submit" className="button-responsive w-full bg-emerald-600 text-white font-bold shadow-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
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

