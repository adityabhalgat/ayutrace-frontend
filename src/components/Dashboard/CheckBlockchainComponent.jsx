import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api';

const CheckBlockchainComponent = () => {
    const [blockchain, setBlockchain] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlockchainData = async () => {
            try {
                setLoading(true);
                const data = await apiRequest('/api/blockchain/logs');
                setBlockchain(data.logs || data || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch blockchain data');
            } finally {
                setLoading(false);
            }
        };

        fetchBlockchainData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading blockchain data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Check Blockchain</h2>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">Blockchain Transaction Log</h3>
                    <p className="text-sm text-gray-500 mt-1">Track all blockchain transactions and supply chain events</p>
                </div>

                {error ? (
                    <div className="text-center py-8">
                        <p className="text-red-600">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : blockchain.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No blockchain transactions found.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {blockchain.map((transaction, index) => (
                            <div key={transaction.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-gray-800">
                                        {transaction.type || 'Transaction'}
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                        {transaction.timestamp || transaction.at || new Date().toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                    <strong>Actor:</strong> {transaction.actor || 'Unknown'}
                                </p>
                                <p className="text-sm text-gray-700">
                                    {transaction.details || transaction.description || 'No details available'}
                                </p>
                                {transaction.id && (
                                    <p className="text-xs text-gray-400 mt-2">
                                        ID: {transaction.id}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckBlockchainComponent;