import React, { useState, useEffect } from 'react';
// import { apiRequest } from '../../api';

const CheckBlockchainComponent = () => {
    const [blockchain, setBlockchain] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [animatedCount, setAnimatedCount] = useState(0);

    // Hardcoded blockchain data matching the HomeSection style
    const hardcodedBlockchain = [
        {
            id: 'block_001',
            type: 'Raw Material Added',
            actor: 'Green Valley Farms',
            timestamp: '2024-09-15 10:30:25',
            details: 'Added 500kg of Organic Turmeric to the supply chain. Quality grade: Premium',
            status: 'confirmed',
            icon: '🌱'
        },
        {
            id: 'block_002',
            type: 'Collection Completed',
            actor: 'Swift Transport Co.',
            timestamp: '2024-09-15 14:45:12',
            details: 'Raw materials collected and transported to manufacturing facility. Temperature maintained at 15°C',
            status: 'confirmed',
            icon: '🚛'
        },
        {
            id: 'block_003',
            type: 'Quality Testing',
            actor: 'AyurTest Labs',
            timestamp: '2024-09-16 09:15:30',
            details: 'Conducted comprehensive quality tests. Purity: 98.5%, Heavy metals: Within limits',
            status: 'confirmed',
            icon: '🔬'
        },
        {
            id: 'block_004',
            type: 'Manufacturing Started',
            actor: 'AyuMed Pharmaceuticals',
            timestamp: '2024-09-16 11:20:45',
            details: 'Production batch AYU-2024-001 initiated. Expected completion: 3 days',
            status: 'in-progress',
            icon: '🏭'
        },
        {
            id: 'block_005',
            type: 'QR Code Generated',
            actor: 'AyuMed Pharmaceuticals',
            timestamp: '2024-09-18 16:30:15',
            details: 'Generated 1000 unique QR codes for finished products. Batch: AYU-2024-001',
            status: 'confirmed',
            icon: '📱'
        },
        {
            id: 'block_006',
            type: 'Product Packaged',
            actor: 'AyuMed Pharmaceuticals',
            timestamp: '2024-09-19 08:45:20',
            details: 'Products packaged and ready for distribution. Total units: 1000',
            status: 'confirmed',
            icon: '📦'
        },
        {
            id: 'block_007',
            type: 'Distribution Started',
            actor: 'MediDistribute Network',
            timestamp: '2024-09-19 13:22:10',
            details: 'Products dispatched to 15 retail outlets across the region',
            status: 'in-progress',
            icon: '🚚'
        }
    ];

    useEffect(() => {
        // Simulate loading and set hardcoded data
        const timer = setTimeout(() => {
            setBlockchain(hardcodedBlockchain);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Animate transaction count
        if (!loading && blockchain.length > 0) {
            let current = 0;
            const target = blockchain.length;
            const increment = target / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                setAnimatedCount(Math.floor(current));
            }, 50);
        }
    }, [loading, blockchain]);

    /* Commented out API fetch for now
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
    */

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
                <div className="text-center">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-600 opacity-75 blur-3xl rounded-full transform animate-pulse"></div>
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-b-4 border-blue-600 mx-auto mb-4"></div>
                        </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                        Loading Blockchain
                    </h3>
                    <p className="text-gray-600 animate-pulse">Fetching transaction data...</p>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'from-green-400 to-emerald-600';
            case 'in-progress': return 'from-yellow-400 to-orange-600';
            case 'pending': return 'from-gray-400 to-gray-600';
            default: return 'from-blue-400 to-cyan-600';
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            'confirmed': 'bg-green-100 text-green-800',
            'in-progress': 'bg-yellow-100 text-yellow-800',
            'pending': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-blue-100 text-blue-800';
    };

    return (
        <div className="h-full overflow-hidden p-4 sm:p-6 lg:p-8">
            {/* Animated Header */}
            <div className="relative mb-8 sm:mb-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-600 opacity-75 blur-3xl rounded-full transform animate-pulse"></div>
                <div className="relative">
                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 animate-bounce">⛓️</div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4 animate-fade-in">
                        Blockchain Ledger
                    </h2>
                    <div className="flex items-center justify-center space-x-2 text-base sm:text-lg text-gray-600 animate-slide-up">
                        <span>Immutable</span>
                        <span className="font-semibold text-blue-600 animate-pulse">Supply Chain Records</span>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in">
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📊</div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                        {animatedCount}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Transactions</div>
                </div>
                
                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in" style={{animationDelay: '200ms'}}>
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">✅</div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                        {blockchain.filter(b => b.status === 'confirmed').length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Confirmed Blocks</div>
                </div>
                
                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-200 transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in" style={{animationDelay: '400ms'}}>
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🔄</div>
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-1 sm:mb-2">
                        {blockchain.filter(b => b.status === 'in-progress').length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">In Progress</div>
                </div>
            </div>

            {/* Blockchain Transactions */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
                <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Transaction History</h3>
                    <p className="text-sm sm:text-base text-gray-600">Immutable record of all supply chain events</p>
                </div>

                {error ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-4">❌</div>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transform transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            Retry
                        </button>
                    </div>
                ) : blockchain.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Transactions Found</h3>
                        <p className="text-gray-500">Start your supply chain journey to see blockchain records here.</p>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        {blockchain.map((transaction, index) => (
                            <div 
                                key={transaction.id || index} 
                                className="group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg transform transition-all duration-500 hover:scale-102 hover:shadow-xl animate-fade-in"
                                style={{animationDelay: `${index * 100}ms`}}
                            >
                                {/* Status Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor(transaction.status)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                
                                <div className="relative z-10">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                            <div className="text-2xl sm:text-3xl transform group-hover:scale-110 transition-transform duration-300">
                                                {transaction.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                                    {transaction.type}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    <strong>By:</strong> {transaction.actor}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:items-end">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(transaction.status)} mb-2`}>
                                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                            </span>
                                            <span className="text-xs sm:text-sm text-gray-500 font-mono">
                                                {transaction.timestamp}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="bg-white bg-opacity-50 rounded-lg p-3 sm:p-4 mb-4">
                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            {transaction.details}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-500">
                                        <div className="font-mono mb-1 sm:mb-0">
                                            Block ID: {transaction.id}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span>Verified on Blockchain</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Effect Border */}
                                <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                    opacity: 0;
                }
                .animate-slide-up {
                    animation: slide-up 1s ease-out 0.5s forwards;
                    opacity: 0;
                }
                .hover\\:scale-102:hover {
                    transform: scale(1.02);
                }
            `}</style>
        </div>
    );
};

export default CheckBlockchainComponent;