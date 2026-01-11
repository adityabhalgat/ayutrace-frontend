import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsQR from 'jsqr';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TruckIcon,
  CalendarIcon,
  MapPinIcon,
  QrCodeIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon,
  CameraIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { 
  getDistributorShipments, 
  createShipment, 
  updateShipmentStatus
} from '../../../api';

const ModernShipmentsSection = () => {
  // State management
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRecipientType, setFilterRecipientType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // QR Scanner refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Form state
  const [newShipment, setNewShipment] = useState({
    recipientType: 'RETAILER',
    recipientId: '',
    recipientName: '',
    recipientAddress: '',
    recipientPhone: '',
    expectedDelivery: '',
    notes: '',
    finishedGoodIds: []
  });

  // Status options with modern styling
  const statusOptions = [
    { value: 'PREPARING', label: 'Preparing', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: '📋' },
    { value: 'DISPATCHED', label: 'Dispatched', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🚚' },
    { value: 'IN_TRANSIT', label: 'In Transit', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: '🛣️' },
    { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' },
    { value: 'DELAYED', label: 'Delayed', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: '⏰' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' },
    { value: 'RETURNED', label: 'Returned', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '↩️' }
  ];

  const recipientTypes = [
    { value: 'MANUFACTURER', label: 'Manufacturer', icon: '' },
    { value: 'DISTRIBUTOR', label: 'Distributor', icon: '' },
    { value: 'RETAILER', label: 'Retailer', icon: '' },
    { value: 'CUSTOMER', label: 'Customer', icon: '' },
    { value: 'LAB', label: 'Laboratory', icon: '' }
  ];

  // Fetch shipments with error handling
  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      if (filterRecipientType !== 'all') filters.recipientType = filterRecipientType;
      if (searchTerm) filters.search = searchTerm;

      const response = await getDistributorShipments(filters);
      
      if (response?.success && response?.data) {
        setShipments(response.data.shipments || response.data || []);
      } else {
        setShipments([]);
        if (!response?.success) {
          setError('Failed to fetch shipments. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError('Failed to load shipments. Please check your connection.');
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new shipment
  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      
      if (!newShipment.recipientId || !newShipment.recipientAddress) {
        setError('Please fill in all required fields (Recipient ID and Address)');
        return;
      }

      const shipmentData = {
        ...newShipment,
        finishedGoodIds: newShipment.finishedGoodIds.filter(id => id.trim() !== '')
      };
      
      const response = await createShipment(shipmentData);
      
      if (response?.success) {
        setSuccess('Shipment created successfully!');
        setShipments(prev => [response.data, ...prev]);
        setShowCreateModal(false);
        resetNewShipmentForm();
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(response?.message || 'Failed to create shipment');
      }
    } catch (err) {
      console.error('Error creating shipment:', err);
      setError('Failed to create shipment: ' + (err.message || 'Unknown error'));
    }
  };

  // Update shipment status
  const handleUpdateStatus = async (shipmentId, newStatus) => {
    try {
      setError(null);
      const response = await updateShipmentStatus(shipmentId, { status: newStatus });
      
      if (response?.success) {
        setShipments(prev => 
          prev.map(shipment => 
            shipment.shipmentId === shipmentId 
              ? { ...shipment, status: newStatus }
              : shipment
          )
        );
        setSuccess('Shipment status updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to update shipment status');
      }
    } catch (err) {
      console.error('Error updating shipment status:', err);
      setError('Failed to update status: ' + (err.message || 'Unknown error'));
    }
  };



  // QR Scanner functionality
  const startQRScanner = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        scanIntervalRef.current = setInterval(() => {
          scanQRCode();
        }, 500);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        handleQRScan(code.data);
        stopQRScanner();
      }
    }
  };

  const stopQRScanner = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
    setShowQRScanner(false);
  };

  const handleQRScan = (scannedData) => {
    try {
      let recipientData;
      
      // Try to parse as JSON first
      try {
        recipientData = JSON.parse(scannedData);
      } catch {
        // If not JSON, treat as recipient ID
        recipientData = { id: scannedData };
      }
      
      // Auto-populate form fields
      setNewShipment(prev => ({
        ...prev,
        recipientId: recipientData.id || recipientData.recipientId || scannedData,
        recipientName: recipientData.name || recipientData.recipientName || prev.recipientName,
        recipientAddress: recipientData.address || recipientData.recipientAddress || prev.recipientAddress,
        recipientPhone: recipientData.phone || recipientData.recipientPhone || prev.recipientPhone,
        recipientType: recipientData.type || recipientData.recipientType || prev.recipientType
      }));
      
      setSuccess('QR code scanned successfully! Form fields updated.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error processing QR code:', err);
      setError('Failed to process QR code data.');
    }
  };

  // Helper functions
  const resetNewShipmentForm = () => {
    setNewShipment({
      recipientType: 'RETAILER',
      recipientId: '',
      recipientName: '',
      recipientAddress: '',
      recipientPhone: '',
      expectedDelivery: '',
      notes: '',
      finishedGoodIds: []
    });
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(opt => opt.value === status) || 
           { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '❓' };
  };

  const getRecipientTypeIcon = (type) => {
    return recipientTypes.find(rt => rt.value === type)?.icon || '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = 
      shipment.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.recipientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.shipmentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatusFilter = filterStatus === 'all' || shipment.status === filterStatus;
    const matchesTypeFilter = filterRecipientType === 'all' || shipment.recipientType === filterRecipientType;
    
    return matchesSearch && matchesStatusFilter && matchesTypeFilter;
  });

  // Effects
  useEffect(() => {
    fetchShipments();
  }, [filterStatus, filterRecipientType, searchTerm]);

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <ArrowPathIcon className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading shipments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Shipment Management
          </h1>
          <p className="text-gray-600 text-lg">Manage and track your shipments with real-time updates</p>
        </motion.div>

        {/* Alert Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg"
            >
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg"
            >
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
              <span>{success}</span>
              <button 
                onClick={() => setSuccess(null)}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4 flex-1">
              {/* Search */}
              <div className="relative min-w-64">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-40"
                >
                  <option value="all">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.icon} {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipient Type Filter */}
              <select
                value={filterRecipientType}
                onChange={(e) => setFilterRecipientType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white min-w-40"
              >
                <option value="all">All Recipients</option>
                {recipientTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Create Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3"
            >
              <PlusIcon className="h-5 w-5" />
              Create Shipment
            </motion.button>
          </div>
        </motion.div>

        {/* Shipments Grid */}
        {filteredShipments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl"
          >
            <TruckIcon className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">No shipments found</h3>
            <p className="text-gray-500 mb-8 text-lg">
              {searchTerm || filterStatus !== 'all' || filterRecipientType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first shipment to get started'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create Your First Shipment
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredShipments.map((shipment, index) => {
                const statusInfo = getStatusInfo(shipment.status);
                const typeIcon = getRecipientTypeIcon(shipment.recipientType);
                
                return (
                  <motion.div
                    key={shipment.shipmentId || shipment.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{typeIcon}</div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            #{shipment.shipmentNumber || shipment.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {shipment.recipientName || 'Unknown Recipient'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TruckIcon className="h-4 w-4 text-green-500" />
                        <span className="font-medium">ID:</span>
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                          {shipment.recipientId}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 text-blue-500" />
                        <span className="truncate">{shipment.recipientAddress}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon className="h-4 w-4 text-orange-500" />
                        <span>Created: {formatDate(shipment.createdAt)}</span>
                      </div>
                      
                      {shipment.expectedDelivery && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ClockIcon className="h-4 w-4 text-purple-500" />
                          <span>Expected: {formatDate(shipment.expectedDelivery)}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500 font-medium">
                        {shipment.recipientType}
                      </span>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedShipment(shipment);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Shipment"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Create Shipment Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Shipment</h2>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateShipment} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Recipient Type *
                        </label>
                        <select
                          value={newShipment.recipientType}
                          onChange={(e) => setNewShipment(prev => ({ ...prev, recipientType: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        >
                          {recipientTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Recipient ID *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newShipment.recipientId}
                            onChange={(e) => setNewShipment(prev => ({ ...prev, recipientId: e.target.value }))}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter recipient UUID"
                            required
                          />
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowQRScanner(true)}
                            className="px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
                            title="Scan QR Code"
                          >
                            <QrCodeIcon className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        value={newShipment.recipientName}
                        onChange={(e) => setNewShipment(prev => ({ ...prev, recipientName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter recipient name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Recipient Address *
                      </label>
                      <textarea
                        value={newShipment.recipientAddress}
                        onChange={(e) => setNewShipment(prev => ({ ...prev, recipientAddress: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows="3"
                        placeholder="Enter complete address"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={newShipment.recipientPhone}
                          onChange={(e) => setNewShipment(prev => ({ ...prev, recipientPhone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expected Delivery
                        </label>
                        <input
                          type="datetime-local"
                          value={newShipment.expectedDelivery}
                          onChange={(e) => setNewShipment(prev => ({ ...prev, expectedDelivery: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={newShipment.notes}
                        onChange={(e) => setNewShipment(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows="3"
                        placeholder="Additional notes or instructions"
                      />
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCreateModal(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg"
                      >
                        Create Shipment
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QR Scanner Modal */}
        <AnimatePresence>
          {showQRScanner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => {
                stopQRScanner();
                setShowQRScanner(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Scan QR Code</h3>
                    <button
                      onClick={() => {
                        stopQRScanner();
                        setShowQRScanner(false);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="text-center">
                    {!isScanning ? (
                      <div className="space-y-4">
                        <CameraIcon className="h-16 w-16 text-gray-400 mx-auto" />
                        <p className="text-gray-600">Position the QR code within the camera view</p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={startQRScanner}
                          className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-semibold"
                        >
                          Start Camera
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          <video
                            ref={videoRef}
                            className="w-full h-64 object-cover rounded-xl bg-gray-100"
                            playsInline
                            muted
                          />
                          <div className="absolute inset-0 border-2 border-green-400 rounded-xl"></div>
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                            Scanning...
                          </div>
                        </div>
                        <canvas ref={canvasRef} className="hidden" />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            stopQRScanner();
                            setShowQRScanner(false);
                          }}
                          className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                        >
                          Stop Scanning
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernShipmentsSection;
