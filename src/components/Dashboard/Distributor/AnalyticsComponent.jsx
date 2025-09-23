import React, { useState, useEffect } from 'react';
import { generateDistributorAnalytics } from '../../../api';

// Icons
const TrendingUpIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
    <polyline points="17,6 23,6 23,12"></polyline>
  </svg>
);

const BarChartIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const DollarSignIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const PackageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const AnalyticsComponent = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0] // today
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await generateDistributorAnalytics('INVENTORY_SUMMARY');
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Simple chart component for shipment trends
  const ShipmentTrendChart = ({ data }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.shipments));
    const chartHeight = 200;
    const chartWidth = 400;
    const barWidth = chartWidth / data.length - 10;

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Daily Shipments Trend</h4>
        <div className="flex items-end justify-between" style={{ height: chartHeight }}>
          {data.map((item, index) => {
            const height = (item.shipments / maxValue) * (chartHeight - 40);
            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600"
                  style={{
                    width: barWidth,
                    height: Math.max(height, 5),
                    marginBottom: '5px'
                  }}
                ></div>
                <span className="text-xs text-gray-600 transform -rotate-45 origin-left">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-xs font-medium text-gray-900 mt-1">{item.shipments}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Status distribution pie chart representation
  const StatusDistribution = ({ data }) => {
    if (!data) return null;

    const statusColors = {
      PREPARING: '#f59e0b',
      DISPATCHED: '#3b82f6',
      IN_TRANSIT: '#6366f1',
      DELIVERED: '#10b981',
      DELAYED: '#f97316',
      CANCELLED: '#ef4444',
      RETURNED: '#8b5cf6'
    };

    const total = Object.values(data).reduce((sum, count) => sum + count, 0);

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Shipment Status Distribution</h4>
        <div className="space-y-2">
          {Object.entries(data).map(([status, count]) => {
            const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
            return (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: statusColors[status] }}
                  ></div>
                  <span className="text-sm text-gray-700">{status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                  <span className="text-xs text-gray-500">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Top products table
  const TopProductsTable = ({ data }) => {
    if (!data || data.length === 0) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Top Products Shipped</h4>
        <div className="space-y-2">
          {data.slice(0, 5).map((product, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                <p className="text-xs text-gray-600">{product.productType.replace('_', ' ')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{product.totalQuantity}</p>
                <p className="text-xs text-gray-600">{product.shipmentCount} shipments</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <BarChartIcon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load analytics</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
        <p className="text-gray-600">Analytics will appear once you have shipments and inventory activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Track your distribution performance and insights</p>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PackageIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalShipments}</p>
              {analytics.shipmentGrowth !== undefined && (
                <p className={`text-sm ${analytics.shipmentGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.shipmentGrowth >= 0 ? '+' : ''}{analytics.shipmentGrowth.toFixed(1)}% from last period
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSignIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${analytics.totalRevenue ? analytics.totalRevenue.toLocaleString() : '0'}
              </p>
              {analytics.revenueGrowth !== undefined && (
                <p className={`text-sm ${analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.revenueGrowth >= 0 ? '+' : ''}{analytics.revenueGrowth.toFixed(1)}% from last period
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUpIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.deliveryRate ? `${analytics.deliveryRate.toFixed(1)}%` : '0%'}
              </p>
              <p className="text-sm text-gray-600">On-time deliveries</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChartIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Inventory</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.activeInventoryCount}</p>
              <p className="text-sm text-gray-600">Items in stock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Trends</h3>
          <ShipmentTrendChart data={analytics.shipmentTrends} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <StatusDistribution data={analytics.statusDistribution} />
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <TopProductsTable data={analytics.topProducts} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Average Shipment Value</span>
              <span className="text-sm font-bold text-gray-900">
                ${analytics.averageShipmentValue ? analytics.averageShipmentValue.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Average Processing Time</span>
              <span className="text-sm font-bold text-gray-900">
                {analytics.averageProcessingTime ? `${analytics.averageProcessingTime.toFixed(1)} hours` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
              <span className="text-sm font-bold text-gray-900">
                {analytics.customerSatisfaction ? `${analytics.customerSatisfaction.toFixed(1)}/5.0` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-gray-700">Return Rate</span>
              <span className="text-sm font-bold text-gray-900">
                {analytics.returnRate ? `${analytics.returnRate.toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {analytics.recentActivity && analytics.recentActivity.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity.slice(0, 10).map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 py-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsComponent;