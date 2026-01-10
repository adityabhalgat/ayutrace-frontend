import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateDistributorAnalytics } from '../../../api';

// Mock Chart Components (would use real chart library like Chart.js or Recharts)
const LineChart = ({ data, title, color }) => (
  <div className={`h-40 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
    <div className="text-white text-center">
      <div className="text-3xl font-bold">{data?.value || '0'}</div>
      <div className="text-sm opacity-80">{title}</div>
    </div>
  </div>
);

const DonutChart = ({ data, title }) => (
  <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
    <div className="text-white text-center">
      <div className="text-3xl font-bold">{data?.percentage || '0'}%</div>
      <div className="text-sm opacity-80">{title}</div>
    </div>
  </div>
);

const BarChart = ({ data, title, color }) => (
  <div className={`h-40 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
    <div className="text-white text-center">
      <div className="text-3xl font-bold">{data?.count || '0'}</div>
      <div className="text-sm opacity-80">{title}</div>
    </div>
  </div>
);

export default function ModernAnalyticsSection({ theme }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('THIS_MONTH');
  const [selectedMetric, setSelectedMetric] = useState('INVENTORY_SUMMARY');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, selectedMetric]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await generateDistributorAnalytics(selectedMetric);
      setAnalyticsData(response.data || response);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err.message);
      // Mock data for development
      setAnalyticsData({
        inventorySummary: {
          totalValue: 450000,
          totalItems: 1250,
          lowStockItems: 15,
          outOfStockItems: 3,
          turnoverRate: 12.3
        },
        shipmentPerformance: {
          totalShipments: 189,
          onTimeDeliveries: 182,
          delayedShipments: 7,
          averageDeliveryTime: 3.2,
          deliveryRate: 96.3
        },
        verificationMetrics: {
          totalVerifications: 45,
          passedVerifications: 42,
          failedVerifications: 3,
          pendingVerifications: 12,
          successRate: 93.3
        },
        monthlyTrends: [
          { month: 'Jan', shipments: 45, revenue: 78000 },
          { month: 'Feb', shipments: 52, revenue: 89000 },
          { month: 'Mar', shipments: 48, revenue: 85000 },
          { month: 'Apr', shipments: 61, revenue: 95000 },
          { month: 'May', shipments: 58, revenue: 92000 },
          { month: 'Jun', shipments: 67, revenue: 105000 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const metricOptions = [
    { value: 'INVENTORY_SUMMARY', label: 'Inventory Overview' },
    { value: 'SHIPMENT_PERFORMANCE', label: 'Shipment Performance' },
    { value: 'VERIFICATION_METRICS', label: 'Verification Metrics' },
    { value: 'MONTHLY_TRENDS', label: 'Monthly Trends' }
  ];

  const timeRangeOptions = [
    { value: 'THIS_WEEK', label: 'This Week' },
    { value: 'THIS_MONTH', label: 'This Month' },
    { value: 'LAST_3_MONTHS', label: 'Last 3 Months' },
    { value: 'THIS_YEAR', label: 'This Year' }
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading analytics...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your distribution performance</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          >
            {metricOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Key Metrics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: 'Total Revenue',
            value: '₹4.5L',
            change: '+12%',
            changeType: 'positive',
            icon: '💰',
            gradient: 'from-green-500 to-emerald-500'
          },
          {
            title: 'Active Shipments',
            value: analyticsData?.shipmentPerformance?.totalShipments || '0',
            change: '+8%',
            changeType: 'positive',
            icon: '🚚',
            gradient: 'from-blue-500 to-cyan-500'
          },
          {
            title: 'Delivery Rate',
            value: `${analyticsData?.shipmentPerformance?.deliveryRate || 0}%`,
            change: '+2%',
            changeType: 'positive',
            icon: '✅',
            gradient: 'from-purple-500 to-pink-500'
          },
          {
            title: 'Inventory Value',
            value: `₹${((analyticsData?.inventorySummary?.totalValue || 0) / 100000).toFixed(1)}L`,
            change: '+5%',
            changeType: 'positive',
            icon: '📦',
            gradient: 'from-orange-500 to-red-500'
          }
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`${theme.colors.card} rounded-2xl p-6 ${theme.shadows.soft} border border-gray-200/50`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.gradient} flex items-center justify-center text-2xl`}>
                {metric.icon}
              </div>
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${metric.changeType === 'positive'
                  ? 'text-green-600 bg-green-50'
                  : 'text-red-600 bg-red-50'
                }`}>
                {metric.change}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.colors.card} rounded-2xl p-6 ${theme.shadows.soft} border border-gray-200/50`}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Inventory Analysis</h2>
          <LineChart
            data={{ value: analyticsData?.inventorySummary?.totalItems }}
            title="Total Items"
            color="from-blue-500 to-cyan-500"
          />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {(analyticsData?.inventorySummary?.totalItems || 0) - (analyticsData?.inventorySummary?.lowStockItems || 0) - (analyticsData?.inventorySummary?.outOfStockItems || 0)}
              </div>
              <div className="text-xs text-gray-600">In Stock</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{analyticsData?.inventorySummary?.lowStockItems}</div>
              <div className="text-xs text-gray-600">Low Stock</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{analyticsData?.inventorySummary?.outOfStockItems}</div>
              <div className="text-xs text-gray-600">Out of Stock</div>
            </div>
          </div>
        </motion.div>

        {/* Shipment Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`${theme.colors.card} rounded-2xl p-6 ${theme.shadows.soft} border border-gray-200/50`}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipment Performance</h2>
          <DonutChart
            data={{ percentage: analyticsData?.shipmentPerformance?.deliveryRate }}
            title="On-time Delivery Rate"
          />
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Shipments</span>
              <span className="font-medium">{analyticsData?.shipmentPerformance?.totalShipments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">On-time Deliveries</span>
              <span className="font-medium text-green-600">{analyticsData?.shipmentPerformance?.onTimeDeliveries}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Delayed Shipments</span>
              <span className="font-medium text-red-600">{analyticsData?.shipmentPerformance?.delayedShipments}</span>
            </div>
          </div>
        </motion.div>

        {/* Verification Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`${theme.colors.card} rounded-2xl p-6 ${theme.shadows.soft} border border-gray-200/50`}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quality Verification</h2>
          <BarChart
            data={{ count: analyticsData?.verificationMetrics?.totalVerifications }}
            title="Total Verifications"
            color="from-emerald-500 to-teal-500"
          />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{analyticsData?.verificationMetrics?.successRate}%</div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{analyticsData?.verificationMetrics?.pendingVerifications}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
          </div>
        </motion.div>

        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`${theme.colors.card} rounded-2xl p-6 ${theme.shadows.soft} border border-gray-200/50`}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Trends</h2>
          <BarChart
            data={{ count: analyticsData?.monthlyTrends?.length || 0 }}
            title="Months of Data"
            color="from-purple-500 to-pink-500"
          />
          <div className="mt-4 space-y-2">
            {(analyticsData?.monthlyTrends || []).slice(-3).map((trend, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{trend.month}</span>
                <div className="flex space-x-4">
                  <span className="text-blue-600">{trend.shipments} shipments</span>
                  <span className="text-green-600">₹{(trend.revenue / 1000).toFixed(0)}K</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`${theme.colors.card} rounded-2xl p-6 ${theme.shadows.soft} border border-gray-200/50`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
              📈
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Growth Rate</h3>
            <p className="text-2xl font-bold text-green-600">+15%</p>
            <p className="text-sm text-gray-600">vs last month</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Avg. Processing Time</h3>
            <p className="text-2xl font-bold text-blue-600">{analyticsData?.shipmentPerformance?.averageDeliveryTime || 0} days</p>
            <p className="text-sm text-gray-600">per shipment</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-2xl">
              🔄
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Inventory Turnover</h3>
            <p className="text-2xl font-bold text-purple-600">{analyticsData?.inventorySummary?.turnoverRate || 0}x</p>
            <p className="text-sm text-gray-600">per year</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}