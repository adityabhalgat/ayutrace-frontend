import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDistributorDashboard } from '../../../api';
import SpoilageAlerts from './SpoilageAlerts';

// Chart component placeholder (would need chart library like Chart.js or Recharts)
const QuickChart = ({ data, type, color }) => (
  <div className={`h-20 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
    <div className="text-white text-center">
      <div className="text-2xl font-bold">{data?.value || '0'}</div>
      <div className="text-xs opacity-80">{data?.label || 'Chart'}</div>
    </div>
  </div>
);

export default function ModernHomeSection({ theme, onSectionChange }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDistributorDashboard();
      console.log('Dashboard API Response:', response);
      setDashboardData(response.data || response);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message);
      // Mock data for development
      setDashboardData({
        totalInventoryItems: 1250,
        pendingShipments: 45,
        verificationsPerformed: 12,
        totalShipments: 189,
        completedShipments: 144,
        recentShipments: []
      });
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    {
      id: 'inventory',
      title: 'Total Inventory',
      value: dashboardData?.totalInventoryItems || 0,
      change: '+12%',
      changeType: 'positive',
      icon: 'CubeIcon',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Items in stock'
    },
    {
      id: 'shipments',
      title: 'Pending Shipments',
      value: dashboardData?.pendingShipments || 0,
      change: '+8%',
      changeType: 'positive',
      icon: 'TruckIcon',
      gradient: 'from-emerald-500 to-teal-500',
      description: 'Awaiting dispatch'
    },
    {
      id: 'verifications',
      title: 'Verifications Performed',
      value: dashboardData?.verificationsPerformed || 0,
      change: '+5%',
      changeType: 'positive',
      icon: 'ShieldIcon',
      gradient: 'from-orange-500 to-red-500',
      description: 'Quality checks'
    },
    {
      id: 'completedShipments',
      title: 'Completed Shipments',
      value: dashboardData?.completedShipments || 0,
      change: '+15%',
      changeType: 'positive',
      icon: 'ChartIcon',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Successfully delivered'
    }
  ];

  const quickActions = [
    {
      title: 'Add Inventory',
      description: 'Add new items to stock',
      icon: '📦',
      color: 'from-blue-500 to-cyan-500',
      action: () => {
        showNotification('Navigating to Inventory...', 'success');
        if (onSectionChange) {
          setTimeout(() => onSectionChange('inventory'), 500);
        }
      }
    },
    {
      title: 'Create Shipment',
      description: 'Ship items to customers',
      icon: '🚚',
      color: 'from-emerald-500 to-teal-500',
      action: () => {
        showNotification('Navigating to Shipments...', 'success');
        if (onSectionChange) {
          setTimeout(() => onSectionChange('shipments'), 500);
        }
      }
    },
    {
      title: 'Scan QR Code',
      description: 'Verify product authenticity',
      icon: '📱',
      color: 'from-purple-500 to-pink-500',
      action: () => {
        showNotification('Navigating to Verification...', 'success');
        if (onSectionChange) {
          setTimeout(() => onSectionChange('verification'), 500);
        }
      }
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: '📊',
      color: 'from-orange-500 to-red-500',
      action: () => {
        showNotification('Navigating to Analytics...', 'success');
        if (onSectionChange) {
          setTimeout(() => onSectionChange('analytics'), 500);
        }
      }
    }
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <div className={`p-4 rounded-lg shadow-lg border ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                  'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'error' ? 'bg-red-500' :
                      'bg-blue-500'
                  }`}></div>
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back! 👋</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your distribution network</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`${theme.colors.card} rounded-2xl p-6 ${theme.shadows.soft} border border-gray-200/50 cursor-pointer`}
            onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.gradient} flex items-center justify-center`}>
                <span className="text-2xl">
                  {metric.icon === 'CubeIcon' ? '📦' :
                    metric.icon === 'TruckIcon' ? '🚚' :
                      metric.icon === 'ShieldIcon' ? '🛡️' : '📊'}
                </span>
              </div>
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${metric.changeType === 'positive'
                  ? 'text-green-600 bg-green-50'
                  : 'text-red-600 bg-red-50'
                }`}>
                {metric.change}
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              <p className="text-gray-600 text-sm font-medium">{metric.title}</p>
              <p className="text-gray-500 text-xs">{metric.description}</p>
            </div>

            <AnimatePresence>
              {selectedMetric === metric.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <QuickChart
                    data={{ value: metric.value, label: 'Trend' }}
                    color={metric.gradient}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* IoT Sensor Alerts - Prominent placement */}
      <SpoilageAlerts theme={theme} />

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${theme.colors.card} rounded-2xl p-6 ${theme.shadows.soft} border border-gray-200/50`}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                type="button"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:col-span-2 ${theme.colors.card} rounded-2xl p-6 ${theme.shadows.soft} border border-gray-200/50`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {(dashboardData?.recentShipments || []).slice(0, 5).map((shipment, index) => (
              <motion.div
                key={shipment.shipmentId || index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full ${shipment.status === 'DELIVERED' ? 'bg-green-500' :
                    shipment.status === 'PENDING' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Shipment #{shipment.shipmentNumber} to {shipment.recipientName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(shipment.createdAt).toLocaleDateString()} - {shipment.status}
                  </p>
                </div>
                <div className="text-2xl">🚚</div>
              </motion.div>
            ))}
            {(!dashboardData?.recentShipments || dashboardData.recentShipments.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                <div className="text-4xl mb-2">📦</div>
                <p>No recent shipments</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${theme.colors.card} rounded-2xl p-6 ${theme.shadows.soft} border border-gray-200/50`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {dashboardData?.totalShipments || 0}
            </div>
            <div className="text-sm text-gray-600">
              Total Shipments
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {dashboardData?.shipmentsThisMonth || 0}
            </div>
            <div className="text-sm text-gray-600">
              This Month
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {dashboardData?.lowStockItems || 0}
            </div>
            <div className="text-sm text-gray-600">
              Low Stock Items
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {dashboardData?.expiringSoonItems || 0}
            </div>
            <div className="text-sm text-gray-600">
              Expiring Soon
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}