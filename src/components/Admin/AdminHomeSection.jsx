import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AdminHomeSection = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setError(''); // Clear previous errors
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            console.log('Fetching dashboard data...');
            
                                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Dashboard API response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Dashboard data received:', data);
                setDashboardData(data.data);
            } else {
                const errorText = await response.text();
                console.error('Dashboard API error:', response.status, errorText);
                throw new Error(`Failed to fetch dashboard data: ${response.status} ${errorText}`);
            }
        } catch (err) {
            console.error('Fetch dashboard error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">Error loading dashboard: {error}</p>
            </div>
        );
    }

    const statsCards = [
        {
            title: 'Total Users',
            value: dashboardData?.overview.totalUsers || 0,
            icon: '👥',
            color: 'blue',
            change: '+12%'
        },
        {
            title: 'Organizations',
            value: dashboardData?.overview.totalOrganizations || 0,
            icon: '🏢',
            color: 'green',
            change: '+5%'
        },
        {
            title: 'Raw Material Batches',
            value: dashboardData?.overview.totalRawMaterialBatches || 0,
            icon: '📦',
            color: 'yellow',
            change: '+25%'
        },
        {
            title: 'Finished Products',
            value: dashboardData?.overview.totalFinishedGoods || 0,
            icon: '🎯',
            color: 'purple',
            change: '+18%'
        },
        {
            title: 'Lab Tests',
            value: dashboardData?.overview.totalLabTests || 0,
            icon: '🧪',
            color: 'indigo',
            change: '+8%'
        },
        {
            title: 'Certificates',
            value: dashboardData?.overview.totalCertificates || 0,
            icon: '📜',
            color: 'pink',
            change: '+15%'
        },
        {
            title: 'QR Codes',
            value: dashboardData?.overview.totalQRCodes || 0,
            icon: '📱',
            color: 'teal',
            change: '+30%'
        },
        {
            title: 'Active Users',
            value: dashboardData?.overview.activeUsers || 0,
            icon: '🟢',
            color: 'emerald',
            change: '+3%'
        }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    const orgBreakdownData = dashboardData?.orgBreakdown?.map(org => ({
        name: org.type,
        value: org._count.type
    })) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-blue-100">System Overview and Management</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                                    <span className="text-gray-500 text-sm ml-1">vs last month</span>
                                </div>
                            </div>
                            <div className="text-4xl">{stat.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Organization Breakdown */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={orgBreakdownData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {orgBreakdownData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {dashboardData?.recentActivity?.recentUsers?.slice(0, 5).map((user, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 text-sm font-semibold">
                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        {user.organization?.type} • Joined {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Alerts */}
            {dashboardData?.alerts?.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Alerts</h3>
                    <div className="space-y-3">
                        {dashboardData.alerts.slice(0, 5).map((alert, index) => (
                            <div key={index} className={`p-4 rounded-lg border-l-4 ${
                                alert.severity === 'CRITICAL' ? 'bg-red-50 border-red-500' :
                                alert.severity === 'HIGH' ? 'bg-orange-50 border-orange-500' :
                                alert.severity === 'MEDIUM' ? 'bg-yellow-50 border-yellow-500' :
                                'bg-blue-50 border-blue-500'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                                            alert.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                            alert.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {alert.severity}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(alert.createdAt).toLocaleDateString()}
                                        </p>
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

export default AdminHomeSection;