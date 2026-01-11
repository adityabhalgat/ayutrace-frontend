import React, { useState, useEffect } from 'react';
import { getLabDashboard } from '../../api';
import { useLabsNavigation } from './LabsContext';

const LabsHome = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Navigation context
    const { goToAddTests, goToYourTests, goToVerify, goToBlockchain } = useLabsNavigation();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getLabDashboard();
            if (response.success) {
                setDashboardData(response.data);
            } else {
                throw new Error(response.message || 'Failed to fetch dashboard data');
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message || 'Failed to load dashboard data');
            // Fallback to dummy data if API fails
            setDashboardData({
                totalTests: 0,
                pendingTests: 0,
                completedTests: 0,
                rejectedTests: 0,
                certificatesIssued: 0,
                testsThisMonth: 0,
                pendingVerifications: 0,
                recentTests: []
            });
        } finally {
            setLoading(false);
        }
    };

    // Dummy data for fallback
    const fallbackRecentTests = [
        {
            testId: 'TEST-001',
            sampleName: 'Chavanprash Premium',
            testType: 'MICROBIOLOGICAL_TESTING',
            status: 'COMPLETED',
            priority: 'HIGH',
            createdAt: '2025-09-14T10:00:00Z',
            requester: { firstName: 'John', lastName: 'Doe' }
        },
        {
            testId: 'TEST-002',
            sampleName: 'Ashwagandha Extract',
            testType: 'CHEMICAL_TESTING',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            createdAt: '2025-09-13T14:30:00Z',
            requester: { firstName: 'Jane', lastName: 'Smith' }
        },
        {
            testId: 'TEST-003',
            sampleName: 'Triphala Powder',
            testType: 'PHYSICAL_TESTING',
            status: 'PENDING',
            priority: 'LOW',
            createdAt: '2025-09-12T09:15:00Z',
            requester: { firstName: 'Mike', lastName: 'Johnson' }
        }
    ];

    const fallbackPendingVerifications = [
        {
            testId: 'VERIFY-001',
            sampleName: 'Brahmi Tablets',
            testType: 'AYURVEDIC_COMPLIANCE',
            requester: { firstName: 'Dr. Rajesh', lastName: 'Sharma' },
            submittedAt: '2025-09-10T16:45:00Z'
        },
        {
            testId: 'VERIFY-002',
            sampleName: 'Giloy Capsules',
            testType: 'MICROBIOLOGICAL_TESTING',
            requester: { firstName: 'Priya', lastName: 'Patel' },
            submittedAt: '2025-09-09T11:20:00Z'
        }
    ];

    // Utility functions
    const getStatusBadgeColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityBadgeColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Use real data or fallback
    const recentTests = dashboardData?.recentTests || fallbackRecentTests;
    const pendingVerifications = fallbackPendingVerifications; // Use fallback for now

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
                <div className="text-center">
                    <div className="text-red-500 text-lg font-semibold mb-4">Error</div>
                    <p className="text-lg text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchDashboardData}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to AyuTrace Platform</h1>
                    <p className="text-lg text-gray-600">Your testing lab's dashboard for Ayurvedic medicine testing and certification</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Tests</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardData?.totalTests || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Tests</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardData?.pendingTests || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed Tests</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardData?.completedTests || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Certificates Issued</p>
                                <p className="text-3xl font-bold text-gray-900">{dashboardData?.certificatesIssued || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={goToAddTests}
                                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                            >
                                <span className="font-medium">Add Test</span>
                            </button>
                            <button 
                                onClick={goToYourTests}
                                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg"
                            >
                                <span className="font-medium">View Tests</span>
                            </button>
                            <button 
                                onClick={goToVerify}
                                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg"
                            >
                                <span className="font-medium">Verify</span>
                            </button>
                            <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg">
                                <span className="font-medium">Reports</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            Monthly Overview
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <span className="font-medium text-gray-700">Tests This Month</span>
                                <span className="text-2xl font-bold text-blue-600">{dashboardData?.testsThisMonth || 0}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                <span className="font-medium text-gray-700">Pending Verifications</span>
                                <span className="text-2xl font-bold text-yellow-600">{dashboardData?.pendingVerifications || 0}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <span className="font-medium text-gray-700">Avg. Processing Time</span>
                                <span className="text-2xl font-bold text-green-600">3.2 days</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Tests & Pending Verifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Tests */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            Recent Tests
                        </h2>
                        <div className="space-y-4">
                            {recentTests.slice(0, 5).map((test, index) => (
                                <div key={index} className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-800">{test.sampleName}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(test.status)}`}>
                                            {test.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">ID: {test.testId}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">{formatDate(test.createdAt)}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(test.priority)}`}>
                                            {test.priority}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {recentTests.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No recent tests found</p>
                            )}
                        </div>
                    </div>

                    {/* Pending Verifications */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            Pending Verifications
                        </h2>
                        <div className="space-y-4">
                            {pendingVerifications.slice(0, 5).map((item, index) => (
                                <div key={index} className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-800">{item.sampleName}</h3>
                                        <button className="text-yellow-600 hover:text-yellow-800 font-medium text-sm">
                                            Review
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">ID: {item.testId}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            {item.requester.firstName} {item.requester.lastName}
                                        </span>
                                        <span className="text-sm text-gray-500">{formatDate(item.submittedAt)}</span>
                                    </div>
                                </div>
                            ))}
                            {pendingVerifications.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No pending verifications</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Quick Actions */}
                <div className="mt-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            Additional Tools
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button 
                                onClick={goToYourTests}
                                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                            >
                                <span className="font-medium">Generate Report</span>
                            </button>
                            <button 
                                onClick={goToBlockchain}
                                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 shadow-lg"
                            >
                                <span className="font-medium">Blockchain</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabsHome;