import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AnalyticsSection = () => {
    // Mock data for charts
    const monthlyUserGrowth = [
        { month: 'Jan', users: 45 },
        { month: 'Feb', users: 52 },
        { month: 'Mar', users: 48 },
        { month: 'Apr', users: 61 },
        { month: 'May', users: 55 },
        { month: 'Jun', users: 67 }
    ];

    const orgTypeDistribution = [
        { name: 'Farmers', value: 45, color: '#10B981' },
        { name: 'Manufacturers', value: 25, color: '#3B82F6' },
        { name: 'Labs', value: 20, color: '#8B5CF6' },
        { name: 'Distributors', value: 10, color: '#F59E0B' }
    ];

    const weeklyActivity = [
        { day: 'Mon', tests: 12, certs: 8 },
        { day: 'Tue', tests: 19, certs: 15 },
        { day: 'Wed', tests: 15, certs: 11 },
        { day: 'Thu', tests: 22, certs: 18 },
        { day: 'Fri', tests: 18, certs: 14 },
        { day: 'Sat', tests: 8, certs: 6 },
        { day: 'Sun', tests: 5, certs: 3 }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
                <p className="text-gray-600">System insights and performance metrics</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Growth Rate</p>
                            <p className="text-2xl font-bold text-green-600">+23%</p>
                        </div>
                        <div className="text-3xl">📈</div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">System Uptime</p>
                            <p className="text-2xl font-bold text-green-600">99.9%</p>
                        </div>
                        <div className="text-3xl">⚡</div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Avg Response</p>
                            <p className="text-2xl font-bold text-blue-600">1.2s</p>
                        </div>
                        <div className="text-3xl">⏱️</div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Satisfaction</p>
                            <p className="text-2xl font-bold text-purple-600">4.8/5</p>
                        </div>
                        <div className="text-3xl">⭐</div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyUserGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={orgTypeDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {orgTypeDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyActivity}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="tests" fill="#8B5CF6" name="Lab Tests" />
                            <Bar dataKey="certs" fill="#10B981" name="Certificates" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Database Performance</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-green-600">95%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">API Response Time</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-blue-600">88%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Storage Usage</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-yellow-600">67%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Memory Usage</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '73%' }}></div>
                                </div>
                                <span className="text-sm font-medium text-purple-600">73%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-gray-900 mb-2">Monthly User Report</h4>
                        <p className="text-sm text-gray-600 mb-3">Comprehensive user activity and growth analysis</p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Download PDF
                        </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-gray-900 mb-2">Supply Chain Analytics</h4>
                        <p className="text-sm text-gray-600 mb-3">Detailed supply chain performance metrics</p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Download PDF
                        </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-gray-900 mb-2">Quality Assurance Report</h4>
                        <p className="text-sm text-gray-600 mb-3">Lab testing and certification summary</p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;