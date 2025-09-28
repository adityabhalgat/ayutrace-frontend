import React, { useState, useEffect } from 'react';
import { 
  getDistributorVerifications, 
  createVerification, 
  updateVerification,
  scanDistributorQRCode 
} from '../../../api';

// Icons
const ShieldCheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <polyline points="9,12 12,15 22,5"></polyline>
  </svg>
);

const ScanIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
    <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
    <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
    <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
    <rect x="7" y="7" width="10" height="10" rx="1"></rect>
  </svg>
);

const FileTextIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10,9 9,9 8,9"></polyline>
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const VerificationComponent = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [qrScanResult, setQrScanResult] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    requestNumber: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0
  });

  useEffect(() => {
    fetchVerifications();
  }, [filters, pagination.page]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const response = await getDistributorVerifications({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      setVerifications(response.data.verifications);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }));
    } catch (err) {
      console.error('Error fetching verifications:', err);
      setError('Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVerification = async (verificationData) => {
    try {
      await createVerification(verificationData);
      setShowCreateModal(false);
      fetchVerifications();
    } catch (err) {
      console.error('Error creating verification:', err);
      alert('Failed to create verification request');
    }
  };

  const [showStatusModal, setShowStatusModal] = useState(false);
  
  const handleUpdateStatus = (id, newStatus) => {
    // Update status logic
    setShowStatusModal(false);
  };  const handleQRScan = async (qrCode) => {
    try {
      const response = await scanDistributorQRCode(qrCode);
      setQrScanResult(response.data);
    } catch (err) {
      console.error('Error scanning QR code:', err);
      alert('Failed to scan QR code');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'PRODUCT_AUTHENTICITY': return 'bg-purple-100 text-purple-800';
      case 'BATCH_VERIFICATION': return 'bg-blue-100 text-blue-800';
      case 'ORIGIN_VERIFICATION': return 'bg-green-100 text-green-800';
      case 'QUALITY_CHECK': return 'bg-orange-100 text-orange-800';
      case 'COMPLIANCE_CHECK': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CreateVerificationModal = () => {
    const [formData, setFormData] = useState({
      type: 'PRODUCT_AUTHENTICITY',
      entityType: 'FINISHED_GOODS',
      entityId: '',
      description: '',
      urgency: 'MEDIUM',
      expectedCompletion: '',
      specialInstructions: '',
      labRequirements: []
    });

    const [newRequirement, setNewRequirement] = useState('');

    const addRequirement = () => {
      if (newRequirement.trim()) {
        setFormData(prev => ({
          ...prev,
          labRequirements: [...prev.labRequirements, newRequirement.trim()]
        }));
        setNewRequirement('');
      }
    };

    const removeRequirement = (index) => {
      setFormData(prev => ({
        ...prev,
        labRequirements: prev.labRequirements.filter((_, i) => i !== index)
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleCreateVerification({
        ...formData,
        expectedCompletion: formData.expectedCompletion || null
      });
    };

    return (
      <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Create Verification Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="PRODUCT_AUTHENTICITY">Product Authenticity</option>
                  <option value="BATCH_VERIFICATION">Batch Verification</option>
                  <option value="ORIGIN_VERIFICATION">Origin Verification</option>
                  <option value="QUALITY_CHECK">Quality Check</option>
                  <option value="COMPLIANCE_CHECK">Compliance Check</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                <select
                  value={formData.entityType}
                  onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="RAW_MATERIAL_BATCH">Raw Material Batch</option>
                  <option value="FINISHED_GOODS">Finished Goods</option>
                  <option value="COLLECTION">Collection</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entity ID</label>
                <input
                  type="text"
                  value={formData.entityId}
                  onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ID of item to verify"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Completion</label>
              <input
                type="date"
                value={formData.expectedCompletion}
                onChange={(e) => setFormData({ ...formData, expectedCompletion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Describe what needs to be verified"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lab Requirements</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add specific requirement"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <button
                  type="button"
                  onClick={addRequirement}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.labRequirements.length > 0 && (
                <div className="space-y-1">
                  {formData.labRequirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-900">{req}</span>
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                placeholder="Any special handling or testing instructions"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const QRScanModal = () => {
    const [qrInput, setQrInput] = useState('');

    const handleScan = () => {
      if (qrInput.trim()) {
        handleQRScan(qrInput.trim());
      }
    };

    return (
      <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">QR Code Data</label>
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter QR code data"
              />
            </div>

            {qrScanResult && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Scan Result:</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Type:</span> {qrScanResult.entityType}</p>
                  <p><span className="font-medium">ID:</span> {qrScanResult.entityId}</p>
                  <p><span className="font-medium">Status:</span> {qrScanResult.status}</p>
                  {qrScanResult.additionalInfo && (
                    <div>
                      <span className="font-medium">Additional Info:</span>
                      <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(qrScanResult.additionalInfo, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleScan}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Scan
              </button>
              <button
                onClick={() => {
                  setShowScanModal(false);
                  setQrScanResult(null);
                  setQrInput('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Center</h1>
          <p className="text-gray-600">Manage product verification requests and QR code scanning</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowScanModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <ScanIcon className="h-5 w-5" />
            <span>Scan QR Code</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <ShieldCheckIcon className="h-5 w-5" />
            <span>New Verification</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">
                {verifications.filter(v => v.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-xl font-bold text-gray-900">
                {verifications.filter(v => v.status === 'IN_PROGRESS').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-xl font-bold text-gray-900">
                {verifications.filter(v => v.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <FileTextIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-xl font-bold text-gray-900">{pagination.totalCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="PRODUCT_AUTHENTICITY">Product Authenticity</option>
              <option value="BATCH_VERIFICATION">Batch Verification</option>
              <option value="ORIGIN_VERIFICATION">Origin Verification</option>
              <option value="QUALITY_CHECK">Quality Check</option>
              <option value="COMPLIANCE_CHECK">Compliance Check</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Request Number</label>
            <input
              type="text"
              value={filters.requestNumber}
              onChange={(e) => setFilters({ ...filters, requestNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by request number"
            />
          </div>
        </div>
      </div>

      {/* Verifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Verification Requests ({pagination.totalCount})
          </h2>
        </div>
        
        {verifications.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No verification requests found</h3>
            <p className="text-gray-600 mb-6">Create your first verification request to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Request
            </button>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {verifications.map((verification) => (
              <div key={verification.verificationId} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {verification.requestNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {verification.entityType} - {verification.entityId.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Type</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(verification.type)}`}>
                          {verification.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Urgency</p>
                        <p className="text-sm text-gray-900">{verification.urgency}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Created</p>
                        <p className="text-sm text-gray-900">
                          {new Date(verification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{verification.description}</p>

                    {verification.labRequirements && verification.labRequirements.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Requirements</p>
                        <div className="flex flex-wrap gap-1">
                          {verification.labRequirements.map((req, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(verification.status)}`}>
                      {verification.status.replace('_', ' ')}
                    </span>
                    
                    <button
                      onClick={() => {
                        setSelectedVerification(verification);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && <CreateVerificationModal />}
      {showScanModal && <QRScanModal />}
    </div>
  );
};

export default VerificationComponent;