import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserManagementSection = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
    const [adminFormData, setAdminFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [adminFormLoading, setAdminFormLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        orgType: '',
        isActive: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    useEffect(() => {
        fetchUsers();
    }, [filters, pagination.page]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(''); // Clear previous errors
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, value]) => value !== '')
                )
            });

            console.log('Fetching users with params:', queryParams.toString());
            
            const response = await fetch(`http://localhost:3000/api/admin/users?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Users API response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Users data received:', data);
                setUsers(data.data.users || []);
                setPagination(prev => ({ ...prev, ...data.data.pagination }));
            } else {
                const errorText = await response.text();
                console.error('Users API error:', response.status, errorText);
                throw new Error(`Failed to fetch users: ${response.status} ${errorText}`);
            }
        } catch (err) {
            console.error('Fetch users error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUserStatus = async (userId, updates) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            
            if (response.ok) {
                // Refresh users list
                fetchUsers();
            } else {
                throw new Error('Failed to update user status');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const getStatusBadge = (isActive, isVerified) => {
        if (!isActive) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Inactive</span>;
        }
        if (!isVerified) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Unverified</span>;
        }
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
    };

    const getOrgTypeColor = (orgType) => {
        const colors = {
            FARMER: 'bg-green-100 text-green-800',
            MANUFACTURER: 'bg-blue-100 text-blue-800',
            LABS: 'bg-purple-100 text-purple-800',
            DISTRIBUTOR: 'bg-orange-100 text-orange-800',
            ADMIN: 'bg-red-100 text-red-800'
        };
        return colors[orgType] || 'bg-gray-100 text-gray-800';
    };

    const createAdminUser = async (e) => {
        e.preventDefault();
        setAdminFormLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/create-admin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(adminFormData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create admin user');
            }

            // Reset form and close modal
            setAdminFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: ''
            });
            setShowCreateAdminModal(false);
            
            // Refresh users list
            fetchUsers();
            
            alert('Admin user created successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setAdminFormLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update user role');
            }

            // Refresh users list
            fetchUsers();
            alert('User role updated successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
                        <p className="text-gray-600">Manage all system users and their permissions</p>
                    </div>
                    {isSuperAdmin && (
                        <button
                            onClick={() => setShowCreateAdminModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Create Admin
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
                        <select
                            value={filters.orgType}
                            onChange={(e) => handleFilterChange('orgType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Types</option>
                            <option value="FARMER">Farmer</option>
                            <option value="MANUFACTURER">Manufacturer</option>
                            <option value="LABS">Labs</option>
                            <option value="DISTRIBUTOR">Distributor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filters.isActive}
                            onChange={(e) => handleFilterChange('isActive', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Users ({pagination.total})</h3>
                </div>
                
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="p-6 text-center text-red-600">
                        Error loading users: {error}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.userId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold">
                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrgTypeColor(user.orgType)}`}>
                                                {user.orgType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isSuperAdmin ? (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => updateUserRole(user.userId, e.target.value)}
                                                    className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                                </select>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(user.isActive, user.isVerified)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {!user.isVerified && (
                                                <button
                                                    onClick={() => updateUserStatus(user.userId, { isVerified: true })}
                                                    className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                                                >
                                                    Verify
                                                </button>
                                            )}
                                            <button
                                                onClick={() => updateUserStatus(user.userId, { isActive: !user.isActive })}
                                                className={`px-3 py-1 rounded-md transition-colors ${
                                                    user.isActive 
                                                        ? 'text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100'
                                                        : 'text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100'
                                                }`}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && users.length > 0 && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-sm text-gray-700">
                                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                    disabled={pagination.page === 1}
                                    className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-md">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Admin Modal */}
            {showCreateAdminModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 backdrop-blur-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Create Admin User</h2>
                            <button
                                onClick={() => setShowCreateAdminModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={createAdminUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={adminFormData.firstName}
                                    onChange={(e) => setAdminFormData({...adminFormData, firstName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={adminFormData.lastName}
                                    onChange={(e) => setAdminFormData({...adminFormData, lastName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={adminFormData.email}
                                    onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={adminFormData.password}
                                    onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateAdminModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={adminFormLoading}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {adminFormLoading ? 'Creating...' : 'Create Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementSection;