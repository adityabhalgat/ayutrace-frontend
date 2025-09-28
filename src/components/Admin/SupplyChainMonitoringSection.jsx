import React, { useState, useEffect } from 'react';

const SupplyChainMonitoringSection = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSupplyChainEvents();
    }, []);

    const fetchSupplyChainEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/supply-chain`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setEvents(data.data.events);
            } else {
                throw new Error('Failed to fetch supply chain events');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getEventTypeColor = (eventType) => {
        return eventType === 'TESTING' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800';
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Supply Chain Monitoring</h1>
                <p className="text-gray-600">Monitor all supply chain events and transactions</p>
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
                        <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {events.map((event) => (
                            <div key={event.eventId} className="p-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.eventType)}`}>
                                            {event.eventType}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {event.handler.firstName} {event.handler.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {event.fromLocation.type} → {event.toLocation.type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-900">
                                            {new Date(event.timestamp).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(event.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                {event.notes && (
                                    <p className="mt-2 text-sm text-gray-600">{event.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplyChainMonitoringSection;