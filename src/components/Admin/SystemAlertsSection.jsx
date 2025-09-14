import React, { useState, useEffect } from 'react';

const SystemAlertsSection = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/admin/alerts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setAlerts(data.data.alerts);
            } else {
                throw new Error('Failed to fetch alerts');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resolveAlert = async (alertId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/admin/alerts/${alertId}/resolve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                fetchAlerts();
            } else {
                throw new Error('Failed to resolve alert');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const getSeverityColor = (severity) => {
        const colors = {
            CRITICAL: 'bg-red-100 text-red-800 border-red-200',
            HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
            MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            LOW: 'bg-blue-100 text-blue-800 border-blue-200'
        };
        return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getSeverityIcon = (severity) => {
        const icons = {
            CRITICAL: '🚨',
            HIGH: '⚠️',
            MEDIUM: '⚡',
            LOW: 'ℹ️'
        };
        return icons[severity] || '📢';
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">System Alerts</h1>
                <p className="text-gray-600">Monitor and resolve system alerts and notifications</p>
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
                <div className="space-y-4">
                    {alerts.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <div className="text-6xl mb-4">✅</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Alerts</h3>
                            <p className="text-gray-600">All systems are running smoothly!</p>
                        </div>
                    ) : (
                        alerts.map((alert) => (
                            <div key={alert.alertId} className={`bg-white rounded-xl shadow-lg border-l-4 p-6 ${getSeverityColor(alert.severity)}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <div className="text-3xl">{getSeverityIcon(alert.severity)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                                                    {alert.severity}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    alert.isResolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {alert.isResolved ? 'Resolved' : 'Active'}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-3">{alert.message}</p>
                                            <div className="text-sm text-gray-500">
                                                <p>Alert Type: {alert.alertType}</p>
                                                <p>Created: {new Date(alert.createdAt).toLocaleString()}</p>
                                                {alert.resolvedAt && (
                                                    <p>Resolved: {new Date(alert.resolvedAt).toLocaleString()}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        {!alert.isResolved && (
                                            <button
                                                onClick={() => resolveAlert(alert.alertId)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SystemAlertsSection;