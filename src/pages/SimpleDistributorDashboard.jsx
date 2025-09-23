import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function SimpleDistributorDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header with logout */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🎉 Modern Distributor Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome {user?.name || 'Distributor'}! The dashboard is loading successfully.
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Inventory</h3>
              <p className="text-3xl font-bold">1,250</p>
              <p className="text-sm opacity-80">Items in stock</p>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Shipments</h3>
              <p className="text-3xl font-bold">45</p>
              <p className="text-sm opacity-80">Active shipments</p>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Verifications</h3>
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm opacity-80">Pending verification</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Revenue</h3>
              <p className="text-3xl font-bold">₹89K</p>
              <p className="text-sm opacity-80">This month</p>
            </div>
          </div>
          
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 What's New?</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✨ Modern, animated interface</li>
              <li>📱 Responsive design for all devices</li>
              <li>🔍 Enhanced search and filtering</li>
              <li>📊 Advanced analytics dashboard</li>
              <li>🎨 Beautiful gradient design system</li>
            </ul>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-500">
              The full modern interface is loading. If you see this page, routing is working correctly! 🎯
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}