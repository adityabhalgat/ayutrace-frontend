import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Simple test version to verify routing is working
export default function SimpleDistributorTest() {
  const [activeTab, setActiveTab] = useState('home');
  const { user, logout } = useAuth();

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'shipments', label: 'Shipments', icon: '🚚' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'verification', label: 'Verification', icon: '🔍' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Total Inventory</h3>
                <p className="text-2xl font-bold text-blue-600">1,250</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Active Shipments</h3>
                <p className="text-2xl font-bold text-green-600">45</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900">Pending Verifications</h3>
                <p className="text-2xl font-bold text-yellow-600">12</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Monthly Revenue</h3>
                <p className="text-2xl font-bold text-purple-600">₹89K</p>
              </div>
            </div>
          </div>
        );
      case 'inventory':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Inventory Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Ashwagandha Extract</td>
                    <td className="border border-gray-300 px-4 py-2">150</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">In Stock</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">Warehouse A-1</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Turmeric Powder</td>
                    <td className="border border-gray-300 px-4 py-2">89</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Low Stock</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">Warehouse B-2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'shipments':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipment Tracking</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">#SH-2024-001</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">In Transit</span>
                </div>
                <p className="text-gray-600">To: Green Valley Pharmacy, Mumbai</p>
                <p className="text-sm text-gray-500">Expected: Dec 18, 2024</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">#SH-2024-002</h3>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Processing</span>
                </div>
                <p className="text-gray-600">To: Natural Health Store, Delhi</p>
                <p className="text-sm text-gray-500">Expected: Dec 20, 2024</p>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Monthly Performance</h3>
                <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Chart Placeholder</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Key Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Delivery Rate:</span>
                    <span className="font-semibold text-green-600">96.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Transit Time:</span>
                    <span className="font-semibold">3.2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Satisfaction:</span>
                    <span className="font-semibold text-green-600">4.8/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'verification':
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quality Verification</h2>
            <div className="flex gap-4 mb-6">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                📱 Scan QR Code
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                ➕ New Verification
              </button>
            </div>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">#VER-2024-001</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">✅ Completed</span>
                </div>
                <p className="text-gray-600">Product: Ashwagandha Extract</p>
                <p className="text-sm text-gray-500">Batch: AWG-2024-001</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">#VER-2024-002</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">🔄 In Progress</span>
                </div>
                <p className="text-gray-600">Product: Turmeric Powder</p>
                <p className="text-sm text-gray-500">Batch: TUR-2024-005</p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/Logo (1).png" alt="Logo" className="h-16 w-16 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Distributor</h1>
                <p className="text-gray-600">Welcome {user?.name || 'Distributor'}! Dashboard Working!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Online</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}