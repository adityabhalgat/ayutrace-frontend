import React, { useState, useEffect } from 'react';

const OrganizationManagementSection = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [filters, setFilters] = useState({
        type: '',
        isActive: ''
    });

    useEffect(() => {
        fetchOrganizations();
    }, [filters]);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            setError(''); // Clear previous errors
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            const filteredParams = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== '')
            );
            const queryParams = new URLSearchParams(filteredParams);
            
            console.log('Fetching organizations with params:', queryParams.toString());
            
            const response = await fetch(`http://localhost:3000/api/admin/organizations?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Organizations API response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Organizations data received:', data);
                setOrganizations(data.data || []);
            } else {
                const errorText = await response.text();
                console.error('Organizations API error:', response.status, errorText);
                throw new Error(`Failed to fetch organizations: ${response.status} ${errorText}`);
            }
        } catch (err) {
            console.error('Fetch organizations error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createOrganization = async (type) => {
        try {
            setCreateLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:3000/api/admin/organizations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type })
            });
            
            if (response.ok) {
                setShowCreateForm(false);
                fetchOrganizations();
            } else {
                throw new Error('Failed to create organization');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setCreateLoading(false);
        }
    };

    const updateOrganizationStatus = async (organizationId, isActive) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:3000/api/admin/organizations/${organizationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isActive })
            });
            
            if (response.ok) {
                fetchOrganizations();
            } else {
                throw new Error('Failed to update organization');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteOrganization = async (organizationId) => {
        if (!window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:3000/api/admin/organizations/${organizationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                fetchOrganizations();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete organization');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const getOrgTypeColor = (type) => {
        const colors = {
            FARMER: 'bg-green-100 text-green-800 border-green-200',
            MANUFACTURER: 'bg-blue-100 text-blue-800 border-blue-200',
            LABS: 'bg-purple-100 text-purple-800 border-purple-200',
            DISTRIBUTOR: 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getOrgTypeIcon = (type) => {
        const icons = {
            FARMER: '🌱',
            MANUFACTURER: '🏭',
            LABS: '🧪',
            DISTRIBUTOR: '🚚'
        };
        return icons[type] || '🏢';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Organization Management</h1>
                        <p className="text-gray-600">Manage the four core organization types in the system</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        + Add Organization
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Types</option>
                            <option value="FARMER">Farmer</option>
                            <option value="MANUFACTURER">Manufacturer</option>
                            <option value="LABS">Labs</option>
                            <option value="DISTRIBUTOR">Distributor</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filters.isActive}
                            onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {/* Organizations Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations.map((org) => (
                        <div key={org.organizationId} className={`bg-white rounded-xl shadow-lg border-2 ${getOrgTypeColor(org.type)} hover:shadow-xl transition-shadow`}>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-3xl">{getOrgTypeIcon(org.type)}</div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{org.type}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                org.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {org.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Users:</span>
                                        <span className="font-semibold text-gray-900">{org._count.users}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Lab Tests:</span>
                                        <span className="font-semibold text-gray-900">{org._count.labTests}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Certificates:</span>
                                        <span className="font-semibold text-gray-900">{org._count.certificates}</span>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => updateOrganizationStatus(org.organizationId, !org.isActive)}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            org.isActive 
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                    >
                                        {org.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => deleteOrganization(org.organizationId)}
                                        disabled={org._count.users > 0}
                                        className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                        title={org._count.users > 0 ? 'Cannot delete organization with users' : 'Delete organization'}
                                    >
                                        Delete
                                    </button>
                                </div>

                                {/* User List Preview */}
                                {org.users.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Users</h4>
                                        <div className="space-y-2">
                                            {org.users.slice(0, 3).map((user) => (
                                                <div key={user.userId} className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-xs text-blue-600 font-semibold">
                                                            {user.firstName.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-600 truncate">
                                                        {user.firstName} {user.lastName}
                                                    </span>
                                                    <span className={`px-1 py-0.5 rounded text-xs ${
                                                        user.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                    }`}>
                                                        {user.isActive ? '●' : '○'}
                                                    </span>
                                                </div>
                                            ))}
                                            {org.users.length > 3 && (
                                                <p className="text-xs text-gray-500">+{org.users.length - 3} more users</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Organization Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Organization</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['FARMER', 'MANUFACTURER', 'LABS', 'DISTRIBUTOR'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => createOrganization(type)}
                                            disabled={createLoading}
                                            className={`p-4 border-2 rounded-lg text-center hover:border-blue-500 transition-colors ${getOrgTypeColor(type)} disabled:opacity-50`}
                                        >
                                            <div className="text-2xl mb-1">{getOrgTypeIcon(type)}</div>
                                            <div className="text-sm font-medium">{type}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => setShowCreateForm(false)}
                                disabled={createLoading}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                        {createLoading && (
                            <div className="flex items-center justify-center mt-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-sm text-gray-600">Creating organization...</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationManagementSection;