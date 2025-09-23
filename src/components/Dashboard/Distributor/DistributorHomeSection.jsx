import React, { useState, useEffect } from 'react';
import { getDistributorDashboard } from '../../../api';

// Icons for the dashboard
const TruckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16,3 19,7 19,13 16,13"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const PackageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const ShieldCheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

const AlertTriangleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

const BarChartIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const DistributorHomeSection = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDistributorDashboard();
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 text-lg font-medium">Error</h3>
        <p className="text-red-600 mt-1">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Distributor Dashboard</h1>
        <p className="text-blue-100">Manage inventory, shipments, and quality verification</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Inventory Items */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Inventory</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.totalInventoryItems || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Items</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <PackageIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Shipments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.totalShipments || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TruckIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Pending Shipments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Shipments</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.pendingShipments || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">In progress</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Verifications Performed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Verifications</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.verificationsPerformed || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Completed</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangleIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-1">Low Stock Items</h3>
              <p className="text-2xl font-bold text-orange-600 mb-2">
                {dashboardData?.lowStockItems || 0}
              </p>
              <p className="text-sm text-gray-600">Items need restocking</p>
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ClockIcon className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-1">Expiring Soon</h3>
              <p className="text-2xl font-bold text-red-600 mb-2">
                {dashboardData?.expiringSoonItems || 0}
              </p>
              <p className="text-sm text-gray-600">Within 30 days</p>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChartIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-1">Completion Rate</h3>
              <p className="text-2xl font-bold text-green-600 mb-2">
                {dashboardData?.totalShipments > 0 
                  ? Math.round((dashboardData.completedShipments / dashboardData.totalShipments) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-gray-600">This month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      {dashboardData?.recentShipments && dashboardData.recentShipments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Shipments</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.recentShipments.slice(0, 5).map((shipment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TruckIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{shipment.shipmentNumber}</p>
                      <p className="text-sm text-gray-600">
                        To: {shipment.recipient?.firstName} {shipment.recipient?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      shipment.status === 'DELIVERED' 
                        ? 'bg-green-100 text-green-800'
                        : shipment.status === 'IN_TRANSIT'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {shipment.status.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {shipment.items?.length || 0} items
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
            <PackageIcon className="h-6 w-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Add Inventory</p>
            <p className="text-sm text-gray-600">Add new items to inventory</p>
          </button>
          
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
            <TruckIcon className="h-6 w-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">Create Shipment</p>
            <p className="text-sm text-gray-600">Start a new shipment</p>
          </button>
          
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
            <ShieldCheckIcon className="h-6 w-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">Verify Items</p>
            <p className="text-sm text-gray-600">Quality verification</p>
          </button>
          
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
            <BarChartIcon className="h-6 w-6 text-orange-600 mb-2" />
            <p className="font-medium text-gray-900">View Analytics</p>
            <p className="text-sm text-gray-600">Performance insights</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributorHomeSection;