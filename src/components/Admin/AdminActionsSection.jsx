import React, { useState, useEffect } from 'react';

const AdminActionsSection = () => {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAdminActions();
    }, []);

    const fetchAdminActions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/admin/actions', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setActions(data.data.actions);
            } else {
                throw new Error('Failed to fetch admin actions');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getActionTypeColor = (actionType) => {
        if (actionType.includes('CREATE')) return 'bg-green-100 text-green-800';
        if (actionType.includes('UPDATE') || actionType.includes('VERIFY')) return 'bg-blue-100 text-blue-800';
        if (actionType.includes('DELETE') || actionType.includes('DEACTIVATE')) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getActionIcon = (actionType) => {
        if (actionType.includes('CREATE')) return '➕';
        if (actionType.includes('UPDATE') || actionType.includes('VERIFY')) return '✏️';
        if (actionType.includes('DELETE')) return '🗑️';
        if (actionType.includes('DEACTIVATE')) return '🚫';
        if (actionType.includes('ACTIVATE')) return '✅';
        return '📝';
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Action Logs</h1>
                <p className="text-gray-600">View all administrative actions and changes made to the system</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">Error: {error}</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Actions</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {actions.map((action) => (
                            <div key={action.actionId} className="p-6 hover:bg-gray-50">
                                <div className="flex items-start space-x-4">
                                    <div className="text-2xl">{getActionIcon(action.actionType)}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionTypeColor(action.actionType)}`}>
                                                {action.actionType.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                by {action.adminUser.firstName} {action.adminUser.lastName}
                                            </span>
                                        </div>
                                        <p className="text-gray-900 mb-2">{action.description}</p>
                                        <div className="text-sm text-gray-500">
                                            <p>Date: {new Date(action.createdAt).toLocaleString()}</p>
                                            {action.targetUser && (
                                                <p>Target User: {action.targetUser.firstName} {action.targetUser.lastName}</p>
                                            )}
                                            {action.targetOrganization && (
                                                <p>Target Organization: {action.targetOrganization.type}</p>
                                            )}
                                            {action.ipAddress && (
                                                <p>IP Address: {action.ipAddress}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminActionsSection;