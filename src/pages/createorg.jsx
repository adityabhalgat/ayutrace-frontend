import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrganization } from '../api';

const LeafIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.61,3.47A8.75,8.75,0,0,0,12,2a8.75,8.75,0,0,0-5.61,1.47,8.75,8.75,0,0,0-3.32,12.46l.16.27.17.27,1.6,2.57.17.26.16.25a8.74,8.74,0,0,0,13.34,0l.16-.25.17-.26,1.6-2.57.17-.27.16-.27A8.75,8.75,0,0,0,17.61,3.47ZM12,20.42a6.76,6.76,0,0,1-5.18-2.3l-.15-.24-.15-.24L5,15.07l-.15-.24-.14-.24a6.75,6.75,0,0,1,2.56-9.58,6.75,6.75,0,0,1,9.56,0,6.75,6.75,0,0,1,2.56,9.58l-.14.24-.15.24L19,15.07l-.15.24-.15.24A6.76,6.76,0,0,1,12,20.42Z" />
    <path d="M12,4.11a6.83,6.83,0,0,0-4,1.62,6.7,6.7,0,0,0,4,11.62,6.7,6.7,0,0,0,4-11.62A6.83,6.83,0,0,0,12,4.11Z" />
  </svg>
);

export default function CreateOrganization() {
  const navigate = useNavigate();
  const [orgType, setOrgType] = useState('FARMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const result = await createOrganization({ type: orgType });
      setSuccess(`Organization created successfully! ID: ${result.organization.organizationId}`);
      console.log('Organization created:', result);
    } catch (err) {
      setError(err.message || 'Failed to create organization');
      console.error('Organization creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md sm:max-w-lg">
        <div className="card-responsive">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <LeafIcon className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600" />
              <span className="text-2xl sm:text-3xl font-bold text-gray-800">AyuTrace</span>
            </div>
          </div>
          
          <h2 className="responsive-text-xl font-bold text-center text-gray-800 mb-1">Create Organization</h2>
          <p className="text-center text-gray-500 mb-6 sm:mb-8 responsive-text-sm">Set up a new organization.</p>
          
          <form className="space-y-4" onSubmit={handleCreateOrg}>
            <div>
              <label className="block responsive-text-sm font-medium text-gray-700 mb-1">Organization Type</label>
              <select 
                value={orgType} 
                onChange={(e) => setOrgType(e.target.value)} 
                className="input-responsive bg-white"
                required
              >
                <option value="FARMER">Farmer</option>
                <option value="CHECKER">Checker</option>
                <option value="ADMIN">Admin</option>
                <option value="MANUFACTURER">Manufacturer</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="button-responsive w-full bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105" 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </form>

          {loading && <div className="mt-4 text-center text-gray-600 responsive-text-sm">Creating organization...</div>}
          {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded responsive-text-sm">{error}</div>}
          {success && <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded responsive-text-sm">{success}</div>}

          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/signup')} 
              className="font-semibold text-indigo-600 hover:underline mr-4"
            >
              Go to Signup
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="font-semibold text-indigo-600 hover:underline"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}