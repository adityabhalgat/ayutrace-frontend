import React, { useState } from 'react';

const LabsBlockchain = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // Dummy blockchain data for lab transactions
    const blockchainData = [
        {
            id: 'BLK-001',
            blockNumber: 15847,
            transactionHash: '0x8f7a9b2c1d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
            timestamp: '2025-09-14T10:30:00.000Z',
            transactionType: 'TEST_RESULT_SUBMISSION',
            testId: 'TEST-001',
            productName: 'Chavanprash Premium',
            batchNumber: 'CH-2025-001',
            labName: 'AyuTrace Testing Center',
            testType: 'Microbiological Analysis',
            result: 'passed',
            certificationId: 'CERT-LAB-001-2025',
            gasUsed: 245670,
            gasPrice: '20 gwei',
            status: 'confirmed',
            confirmations: 1247
        },
        {
            id: 'BLK-002',
            blockNumber: 15846,
            transactionHash: '0x7e6d9a8b0c1f2e3d4c5b6a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9',
            timestamp: '2025-09-13T15:45:00.000Z',
            transactionType: 'TEST_CERTIFICATION',
            testId: 'TEST-002',
            productName: 'Ashwagandha Extract',
            batchNumber: 'AS-2025-087',
            labName: 'AyuTrace Testing Center',
            testType: 'Heavy Metal Testing',
            result: 'passed',
            certificationId: 'CERT-LAB-002-2025',
            gasUsed: 198340,
            gasPrice: '18 gwei',
            status: 'confirmed',
            confirmations: 2156
        },
        {
            id: 'BLK-003',
            blockNumber: 15845,
            transactionHash: '0x6d5c8b7a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6',
            timestamp: '2025-09-12T11:20:00.000Z',
            transactionType: 'TEST_FAILURE_REPORT',
            testId: 'TEST-005',
            productName: 'Arjuna Capsules',
            batchNumber: 'AR-2025-067',
            labName: 'AyuTrace Testing Center',
            testType: 'Active Compound Analysis',
            result: 'failed',
            certificationId: null,
            gasUsed: 156780,
            gasPrice: '22 gwei',
            status: 'confirmed',
            confirmations: 3102
        },
        {
            id: 'BLK-004',
            blockNumber: 15844,
            transactionHash: '0x5c4b7a6f9e0d1c2b3a4f5e6d7c8b9a0f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6',
            timestamp: '2025-09-11T09:15:00.000Z',
            transactionType: 'SAMPLE_RECEIVED',
            testId: 'TEST-003',
            productName: 'Triphala Powder',
            batchNumber: 'TR-2025-045',
            labName: 'AyuTrace Testing Center',
            testType: 'Pesticide Residue Analysis',
            result: 'pending',
            certificationId: null,
            gasUsed: 89450,
            gasPrice: '19 gwei',
            status: 'confirmed',
            confirmations: 4567
        },
        {
            id: 'BLK-005',
            blockNumber: 15843,
            transactionHash: '0x4b3a6f5e8d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6',
            timestamp: '2025-09-10T14:00:00.000Z',
            transactionType: 'LAB_ACCREDITATION',
            testId: null,
            productName: null,
            batchNumber: null,
            labName: 'AyuTrace Testing Center',
            testType: 'Lab Certification',
            result: 'verified',
            certificationId: 'LAB-CERT-2025-001',
            gasUsed: 234890,
            gasPrice: '21 gwei',
            status: 'confirmed',
            confirmations: 5634
        }
    ];

    const filteredTransactions = blockchainData.filter(transaction => {
        const searchLower = searchTerm.toLowerCase();
        return (
            transaction.transactionHash.toLowerCase().includes(searchLower) ||
            transaction.testId?.toLowerCase().includes(searchLower) ||
            transaction.productName?.toLowerCase().includes(searchLower) ||
            transaction.batchNumber?.toLowerCase().includes(searchLower) ||
            transaction.transactionType.toLowerCase().includes(searchLower)
        );
    });

    const getTransactionTypeColor = (type) => {
        switch (type) {
            case 'TEST_RESULT_SUBMISSION': return 'bg-blue-100 text-blue-800';
            case 'TEST_CERTIFICATION': return 'bg-green-100 text-green-800';
            case 'TEST_FAILURE_REPORT': return 'bg-red-100 text-red-800';
            case 'SAMPLE_RECEIVED': return 'bg-yellow-100 text-yellow-800';
            case 'LAB_ACCREDITATION': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getResultColor = (result) => {
        switch (result) {
            case 'passed': return 'bg-green-100 text-green-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'verified': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const TransactionModal = ({ transaction, onClose }) => {
        if (!transaction) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Blockchain Transaction Details</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Transaction Info */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                            <h3 className="text-lg font-bold text-indigo-800 mb-4">Transaction Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-indigo-600">Transaction Hash</label>
                                    <p className="text-sm font-mono text-gray-900 break-all bg-white p-2 rounded border">
                                        {transaction.transactionHash}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-indigo-600">Block Number</label>
                                    <p className="text-lg font-bold text-gray-900">{transaction.blockNumber.toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-indigo-600">Timestamp</label>
                                    <p className="text-sm text-gray-900">{formatDate(transaction.timestamp)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-indigo-600">Confirmations</label>
                                    <p className="text-lg font-bold text-green-600">{transaction.confirmations.toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-indigo-600">Gas Used</label>
                                    <p className="text-sm text-gray-900">{transaction.gasUsed.toLocaleString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-indigo-600">Gas Price</label>
                                    <p className="text-sm text-gray-900">{transaction.gasPrice}</p>
                                </div>
                            </div>
                        </div>

                        {/* Test Details */}
                        {transaction.testId && (
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                                <h3 className="text-lg font-bold text-blue-800 mb-4">Test Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-blue-600">Test ID</label>
                                        <p className="text-sm font-mono text-gray-900">{transaction.testId}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-blue-600">Test Type</label>
                                        <p className="text-sm text-gray-900">{transaction.testType}</p>
                                    </div>
                                    {transaction.productName && (
                                        <div>
                                            <label className="text-sm font-medium text-blue-600">Product Name</label>
                                            <p className="text-sm font-semibold text-gray-900">{transaction.productName}</p>
                                        </div>
                                    )}
                                    {transaction.batchNumber && (
                                        <div>
                                            <label className="text-sm font-medium text-blue-600">Batch Number</label>
                                            <p className="text-sm font-mono text-gray-900">{transaction.batchNumber}</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm font-medium text-blue-600">Lab Name</label>
                                        <p className="text-sm text-gray-900">{transaction.labName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-blue-600">Result</label>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getResultColor(transaction.result)}`}>
                                            {transaction.result.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                
                                {transaction.certificationId && (
                                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-green-600 text-xl">🏆</span>
                                            <div>
                                                <p className="font-semibold text-green-800">Certificate Issued</p>
                                                <p className="text-sm text-green-600">Certificate ID: {transaction.certificationId}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Transaction Type */}
                        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Transaction Type</h3>
                            <div className="flex items-center space-x-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTransactionTypeColor(transaction.transactionType)}`}>
                                    {transaction.transactionType.replace(/_/g, ' ')}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    transaction.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {transaction.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-4">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                                View on Explorer
                            </button>
                            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                                Download Proof
                            </button>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                                Verify Transaction
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Blockchain Lab Records</h2>
                <p className="text-gray-600 text-lg">
                    Immutable laboratory test records stored on blockchain
                </p>
            </div>

            {/* Blockchain Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-indigo-200 text-sm">Total Transactions</p>
                            <p className="text-3xl font-bold">{blockchainData.length}</p>
                        </div>
                        <span className="text-4xl opacity-80">⛓️</span>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-200 text-sm">Certificates Issued</p>
                            <p className="text-3xl font-bold">
                                {blockchainData.filter(t => t.certificationId).length}
                            </p>
                        </div>
                        <span className="text-4xl opacity-80">🏆</span>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-200 text-sm">Tests Passed</p>
                            <p className="text-3xl font-bold">
                                {blockchainData.filter(t => t.result === 'passed').length}
                            </p>
                        </div>
                        <span className="text-4xl opacity-80">✅</span>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-200 text-sm">Gas Used</p>
                            <p className="text-2xl font-bold">
                                {blockchainData.reduce((sum, t) => sum + t.gasUsed, 0).toLocaleString()}
                            </p>
                        </div>
                        <span className="text-4xl opacity-80">⛽</span>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by transaction hash, test ID, product name, or batch number..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                        🔍 Search Blockchain
                    </button>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">Recent Blockchain Transactions</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {filteredTransactions.map((transaction) => (
                            <div 
                                key={transaction.id} 
                                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                onClick={() => setSelectedTransaction(transaction)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTransactionTypeColor(transaction.transactionType)}`}>
                                            {transaction.transactionType.replace(/_/g, ' ')}
                                        </span>
                                        {transaction.result && (
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getResultColor(transaction.result)}`}>
                                                {transaction.result.toUpperCase()}
                                            </span>
                                        )}
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            {transaction.confirmations.toLocaleString()} confirmations
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Block #{transaction.blockNumber.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Transaction Hash</p>
                                        <p className="font-mono text-sm text-gray-900 truncate">
                                            {transaction.transactionHash}
                                        </p>
                                    </div>
                                    {transaction.testId && (
                                        <div>
                                            <p className="text-sm text-gray-600">Test ID</p>
                                            <p className="font-medium text-gray-900">{transaction.testId}</p>
                                        </div>
                                    )}
                                    {transaction.productName && (
                                        <div>
                                            <p className="text-sm text-gray-600">Product</p>
                                            <p className="font-medium text-gray-900">{transaction.productName}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-600">Gas Used</p>
                                        <p className="font-medium text-gray-900">{transaction.gasUsed.toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-600">Lab: {transaction.labName}</span>
                                        {transaction.certificationId && (
                                            <span className="text-sm text-green-600 font-medium">✓ Certified</span>
                                        )}
                                    </div>
                                    <div className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                                        View Details →
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transaction Modal */}
            <TransactionModal 
                transaction={selectedTransaction} 
                onClose={() => setSelectedTransaction(null)} 
            />

            {/* Blockchain Info */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Blockchain Security Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🔒</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Immutable Records</h4>
                        <p className="text-sm text-gray-600">All test results are permanently stored and cannot be altered</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Verified Authenticity</h4>
                        <p className="text-sm text-gray-600">Every transaction is cryptographically verified</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🌐</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Global Transparency</h4>
                        <p className="text-sm text-gray-600">Anyone can verify the authenticity of test results</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabsBlockchain;