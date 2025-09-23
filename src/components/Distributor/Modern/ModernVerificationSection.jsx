import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getDistributorVerifications, 
  createVerification, 
  updateVerification,
  scanDistributorQRCode 
} from '../../../api';
import QRScanner from '../../Common/QRScanner';

// Verification Card Component
const VerificationCard = ({ verification, onUpdateStatus, onViewDetails }) => {
  const statusColors = {
    PENDING: 'from-yellow-500 to-orange-500',
    IN_PROGRESS: 'from-blue-500 to-indigo-500',
    COMPLETED: 'from-green-500 to-emerald-500',
    FAILED: 'from-red-500 to-pink-500'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'IN_PROGRESS': return '🔄';
      case 'COMPLETED': return '✅';
      case 'FAILED': return '❌';
      default: return '📋';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">#{verification.verificationNumber}</h3>
          <p className="text-sm text-gray-500">
            {new Date(verification.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${statusColors[verification.status]} flex items-center space-x-1`}>
          <span>{getStatusIcon(verification.status)}</span>
          <span>{verification.status.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">
            📦
          </div>
          <div>
            <p className="font-medium text-gray-900">{verification.productName || 'Product Name'}</p>
            <p className="text-sm text-gray-500">Batch: {verification.batchNumber || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Verification Type */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600">Type:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            verification.verificationType === 'QUALITY_CHECK' 
              ? 'bg-blue-100 text-blue-800'
              : verification.verificationType === 'AUTHENTICITY' 
                ? 'bg-purple-100 text-purple-800'
                : 'bg-gray-100 text-gray-800'
          }`}>
            {verification.verificationType?.replace('_', ' ') || 'General'}
          </span>
        </div>
      </div>

      {/* QR Code Info */}
      {verification.qrCodeData && (
        <div className="mb-4 p-2 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 text-lg">🔗</span>
            <span className="text-sm text-blue-700 font-medium">QR Code Linked</span>
          </div>
        </div>
      )}

      {/* Results */}
      {verification.results && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Results:</p>
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {verification.results}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={() => onViewDetails(verification)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
        >
          <span>View Details</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {verification.status !== 'COMPLETED' && verification.status !== 'FAILED' && (
          <select
            onChange={(e) => onUpdateStatus(verification.id, e.target.value)}
            value={verification.status}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
        )}
      </div>
    </motion.div>
  );
};

export default function ModernVerificationSection({ theme }) {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrScanTarget, setQrScanTarget] = useState(''); // 'create' or 'search'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create verification form state
  const [createFormData, setCreateFormData] = useState({
    productName: '',
    batchNumber: '',
    verificationType: 'QUALITY_CHECK',
    notes: ''
  });
  const [createFormLoading, setCreateFormLoading] = useState(false);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getDistributorVerifications();
      console.log('Verifications API Response:', response);
      
      // Handle the correct backend response structure
      if (response && response.success && response.data) {
        const verificationsData = response.data.verifications || [];
        setVerifications(verificationsData);
        console.log('Verifications loaded:', verificationsData.length);
      } else {
        console.warn('Unexpected verifications API response structure:', response);
        setVerifications([]);
      }
    } catch (err) {
      console.error('Verifications fetch error:', err);
      setError(err.message);
      // Mock data for development when API fails
      setVerifications([
        {
          id: 1,
          verificationNumber: 'VER-2024-001',
          productName: 'Ashwagandha Extract',
          batchNumber: 'AWG-2024-001',
          status: 'COMPLETED',
          verificationType: 'QUALITY_CHECK',
          createdAt: new Date().toISOString(),
          results: 'All quality parameters within acceptable limits. Product verified as authentic.',
          qrCodeData: 'QR_DATA_SAMPLE_001'
        },
        {
          id: 2,
          verificationNumber: 'VER-2024-002',
          productName: 'Turmeric Powder',
          batchNumber: 'TUR-2024-005',
          status: 'IN_PROGRESS',
          verificationType: 'AUTHENTICITY',
          createdAt: new Date().toISOString(),
          results: null,
          qrCodeData: null
        },
        {
          id: 3,
          verificationNumber: 'VER-2024-003',
          productName: 'Neem Oil',
          batchNumber: 'NEM-2024-003',
          status: 'PENDING',
          verificationType: 'QUALITY_CHECK',
          createdAt: new Date().toISOString(),
          results: null,
          qrCodeData: 'QR_DATA_SAMPLE_003'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // QR Code scanning functions
  const handleQRScan = (qrCode) => {
    console.log('QR Code scanned:', qrCode);
    setShowQRScanner(false);
    
    if (qrScanTarget === 'create') {
      // Use scanned QR code to create new verification
      setShowCreateModal(true);
      // You can pass the QR data to the create modal
    } else if (qrScanTarget === 'search') {
      // Search for verifications with this QR data
      setSearchTerm(qrCode);
    }
    
    setQrScanTarget('');
  };

  const startQRScan = (target) => {
    setQrScanTarget(target);
    setShowQRScanner(true);
  };

  const handleCreateVerification = async (e) => {
    e.preventDefault();
    try {
      setCreateFormLoading(true);
      
      // Basic validation
      if (!createFormData.productName.trim()) {
        alert('Product name is required');
        return;
      }
      if (!createFormData.batchNumber.trim()) {
        alert('Batch number is required');
        return;
      }

      const verificationData = {
        productName: createFormData.productName,
        batchNumber: createFormData.batchNumber,
        verificationType: createFormData.verificationType,
        notes: createFormData.notes
      };

      await createVerification(verificationData);
      
      // Reset form and close modal
      setCreateFormData({
        productName: '',
        batchNumber: '',
        verificationType: 'QUALITY_CHECK',
        notes: ''
      });
      setShowCreateModal(false);
      
      // Refresh verifications list
      fetchVerifications();
      
      alert('Verification created successfully!');
    } catch (err) {
      console.error('Create verification error:', err);
      alert('Failed to create verification: ' + err.message);
    } finally {
      setCreateFormLoading(false);
    }
  };

  const handleStatusUpdate = async (verificationId, newStatus) => {
    try {
      await updateVerification(verificationId, { status: newStatus });
      setVerifications(prev => prev.map(verification => 
        verification.id === verificationId 
          ? { ...verification, status: newStatus }
          : verification
      ));
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status: ' + err.message);
    }
  };

  const filteredVerifications = (Array.isArray(verifications) ? verifications : []).filter(verification => {
    const matchesSearch = verification.verificationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         verification.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || verification.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: Array.isArray(verifications) ? verifications.length : 0,
    PENDING: Array.isArray(verifications) ? verifications.filter(v => v.status === 'PENDING').length : 0,
    IN_PROGRESS: Array.isArray(verifications) ? verifications.filter(v => v.status === 'IN_PROGRESS').length : 0,
    COMPLETED: Array.isArray(verifications) ? verifications.filter(v => v.status === 'COMPLETED').length : 0,
    FAILED: Array.isArray(verifications) ? verifications.filter(v => v.status === 'FAILED').length : 0
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading verifications...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Quality Verification</h1>
          <p className="text-gray-600 mt-1">Verify product authenticity and quality standards</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startQRScan('create')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <span className="text-lg">📱</span>
            <span>Scan QR Code</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Verification</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search verifications, products, or batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
          <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            onClick={() => startQRScan('search')}
            className="absolute right-3 top-3 p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Scan QR Code"
          >
            📱
          </button>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
        >
          <option value="all">All Status ({statusCounts.all})</option>
          <option value="PENDING">Pending ({statusCounts.PENDING})</option>
          <option value="IN_PROGRESS">In Progress ({statusCounts.IN_PROGRESS})</option>
          <option value="COMPLETED">Completed ({statusCounts.COMPLETED})</option>
          <option value="FAILED">Failed ({statusCounts.FAILED})</option>
        </select>
      </motion.div>

      {/* Verification Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {[
          { label: 'Total', count: statusCounts.all, color: 'from-gray-500 to-gray-600', icon: '📊' },
          { label: 'Pending', count: statusCounts.PENDING, color: 'from-yellow-500 to-orange-500', icon: '⏳' },
          { label: 'In Progress', count: statusCounts.IN_PROGRESS, color: 'from-blue-500 to-indigo-500', icon: '🔄' },
          { label: 'Completed', count: statusCounts.COMPLETED, color: 'from-green-500 to-emerald-500', icon: '✅' },
          { label: 'Failed', count: statusCounts.FAILED, color: 'from-red-500 to-pink-500', icon: '❌' }
        ].map((stat, index) => (
          <div key={index} className={`${theme.colors.card} rounded-xl p-4 ${theme.shadows.soft} border border-gray-200/50 text-center`}>
            <div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-xl`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Verifications Grid */}
      {filteredVerifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No verifications found</h3>
          <p className="text-gray-600 mb-6">Start by creating a new verification or scanning a QR code</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowQRScanner(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              Scan QR Code
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              New Verification
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredVerifications.map((verification, index) => (
            <VerificationCard
              key={verification.id}
              verification={verification}
              onUpdateStatus={handleStatusUpdate}
              onViewDetails={setSelectedVerification}
            />
          ))}
        </motion.div>
      )}

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowQRScanner(false)}
          />
        )}
      </AnimatePresence>

      {/* Detailed Modal would go here */}
      <AnimatePresence>
        {selectedVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVerification(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Verification #{selectedVerification.verificationNumber}
                  </h2>
                  <button
                    onClick={() => setSelectedVerification(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Product Information</h3>
                    <p className="text-gray-600">Product: {selectedVerification.productName}</p>
                    <p className="text-gray-600">Batch: {selectedVerification.batchNumber}</p>
                    <p className="text-gray-600">Type: {selectedVerification.verificationType}</p>
                  </div>
                  {selectedVerification.results && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Verification Results</h3>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedVerification.results}</p>
                    </div>
                  )}
                  {selectedVerification.qrCodeData && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">QR Code Data</h3>
                      <p className="text-gray-600 bg-blue-50 p-3 rounded-lg font-mono text-sm">{selectedVerification.qrCodeData}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Verification Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Create New Verification</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                <form onSubmit={handleCreateVerification} className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={createFormData.productName}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, productName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  {/* Batch Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batch Number *
                    </label>
                    <input
                      type="text"
                      value={createFormData.batchNumber}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Enter batch number"
                      required
                    />
                  </div>

                  {/* Verification Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Type
                    </label>
                    <select
                      value={createFormData.verificationType}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, verificationType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                      <option value="QUALITY_CHECK">Quality Check</option>
                      <option value="AUTHENTICITY">Authenticity</option>
                      <option value="PURITY_TEST">Purity Test</option>
                      <option value="COMPLIANCE">Compliance</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={createFormData.notes}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      placeholder="Enter verification notes"
                      rows={3}
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={createFormLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={createFormLoading}
                    >
                      {createFormLoading ? 'Creating...' : 'Create Verification'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Scanner */}
      {showQRScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => {
            setShowQRScanner(false);
            setQrScanTarget('');
          }}
        />
      )}
    </div>
  );
}