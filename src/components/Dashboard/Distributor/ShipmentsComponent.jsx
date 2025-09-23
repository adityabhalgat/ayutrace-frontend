import React, { useState, useEffect } from 'react';
import { getDistributorShipments, createShipment, updateShipmentStatus } from '../../../api';

// Icons
const TruckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16,3 19,7 19,13 16,13"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EditIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const ShipmentsComponent = ({ setActiveTab }) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    recipientType: '',
    trackingNumber: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0
  });

  useEffect(() => {
    fetchShipments();
  }, [filters, pagination.page]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await getDistributorShipments({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      setShipments(response.data.shipments);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }));
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async (shipmentData) => {
    try {
      await createShipment(shipmentData);
      setShowCreateModal(false);
      fetchShipments();
    } catch (err) {
      console.error('Error creating shipment:', err);
      alert('Failed to create shipment');
    }
  };

  const handleUpdateStatus = async (statusData) => {
    try {
      await updateShipmentStatus(selectedShipment.shipmentId, statusData);
      setShowStatusModal(false);
      setSelectedShipment(null);
      fetchShipments();
    } catch (err) {
      console.error('Error updating shipment status:', err);
      alert('Failed to update shipment status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PREPARING': return 'bg-yellow-100 text-yellow-800';
      case 'DISPATCHED': return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT': return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'DELAYED': return 'bg-orange-100 text-orange-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'RETURNED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CreateShipmentModal = () => {
    const [formData, setFormData] = useState({
      recipientType: 'CUSTOMER',
      recipientId: '',
      recipientName: '',
      recipientAddress: '',
      recipientPhone: '',
      expectedDelivery: '',
      trackingNumber: '',
      shippingCost: '',
      totalValue: '',
      notes: '',
      specialInstructions: '',
      items: []
    });

    const [newItem, setNewItem] = useState({
      productType: 'RAW_MATERIAL_BATCH',
      entityId: '',
      productName: '',
      quantity: '',
      unit: 'KG',
      unitPrice: '',
      batchNumber: '',
      expiryDate: ''
    });

    const addItem = () => {
      if (newItem.entityId && newItem.productName && newItem.quantity) {
        setFormData(prev => ({
          ...prev,
          items: [...prev.items, { ...newItem, quantity: parseFloat(newItem.quantity) }]
        }));
        setNewItem({
          productType: 'RAW_MATERIAL_BATCH',
          entityId: '',
          productName: '',
          quantity: '',
          unit: 'KG',
          unitPrice: '',
          batchNumber: '',
          expiryDate: ''
        });
      }
    };

    const removeItem = (index) => {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleCreateShipment({
        ...formData,
        shippingCost: formData.shippingCost ? parseFloat(formData.shippingCost) : null,
        totalValue: formData.totalValue ? parseFloat(formData.totalValue) : null,
        expectedDelivery: formData.expectedDelivery || null
      });
    };

    return (
      <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Create New Shipment</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Type</label>
                <select
                  value={formData.recipientType}
                  onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="MANUFACTURER">Manufacturer</option>
                  <option value="DISTRIBUTOR">Distributor</option>
                  <option value="RETAILER">Retailer</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="LAB">Laboratory</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient ID</label>
                <input
                  type="text"
                  value={formData.recipientId}
                  onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="User ID of recipient"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full name or company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.recipientPhone}
                  onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contact number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
              <textarea
                value={formData.recipientAddress}
                onChange={(e) => setFormData({ ...formData, recipientAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Complete delivery address"
                required
              />
            </div>

            {/* Shipment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery</label>
                <input
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                <input
                  type="text"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional tracking number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.shippingCost}
                  onChange={(e) => setFormData({ ...formData, shippingCost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Value</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.totalValue}
                  onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Items Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Shipment Items</h3>
              
              {/* Add Item Form */}
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <input
                      type="text"
                      value={newItem.entityId}
                      onChange={(e) => setNewItem({ ...newItem, entityId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Entity ID"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newItem.productName}
                      onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Product Name"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Quantity"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={addItem}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} {item.unit} - ID: {item.entityId.slice(0, 8)}...
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Additional notes or instructions"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Shipment
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

  const StatusUpdateModal = () => {
    const [statusData, setStatusData] = useState({
      status: selectedShipment?.status || 'PREPARING',
      trackingNumber: selectedShipment?.trackingNumber || '',
      notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleUpdateStatus(statusData);
    };

    return (
      <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Update Shipment Status</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusData.status}
                onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="PREPARING">Preparing</option>
                <option value="DISPATCHED">Dispatched</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="DELAYED">Delayed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="RETURNED">Returned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
              <input
                type="text"
                value={statusData.trackingNumber}
                onChange={(e) => setStatusData({ ...statusData, trackingNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Update tracking number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={statusData.notes}
                onChange={(e) => setStatusData({ ...statusData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Status update notes"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Status
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedShipment(null);
                }}
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
          <h1 className="text-2xl font-bold text-gray-900">Shipment Management</h1>
          <p className="text-gray-600">Track and manage your shipments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Create Shipment</span>
        </button>
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
              <option value="PREPARING">Preparing</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="DELAYED">Delayed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="RETURNED">Returned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Type</label>
            <select
              value={filters.recipientType}
              onChange={(e) => setFilters({ ...filters, recipientType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="MANUFACTURER">Manufacturer</option>
              <option value="DISTRIBUTOR">Distributor</option>
              <option value="RETAILER">Retailer</option>
              <option value="CUSTOMER">Customer</option>
              <option value="LAB">Laboratory</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
            <input
              type="text"
              value={filters.trackingNumber}
              onChange={(e) => setFilters({ ...filters, trackingNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by tracking number"
            />
          </div>
        </div>
      </div>

      {/* Shipments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Shipments ({pagination.totalCount})
          </h2>
        </div>
        
        {shipments.length === 0 ? (
          <div className="p-12 text-center">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shipments found</h3>
            <p className="text-gray-600 mb-6">Start by creating your first shipment</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Shipment
            </button>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {shipments.map((shipment) => (
              <div key={shipment.shipmentId} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <TruckIcon className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {shipment.shipmentNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          To: {shipment.recipient?.firstName} {shipment.recipient?.lastName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Recipient Type</p>
                        <p className="text-sm text-gray-900">{shipment.recipientType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Expected Delivery</p>
                        <p className="text-sm text-gray-900">
                          {shipment.expectedDelivery 
                            ? new Date(shipment.expectedDelivery).toLocaleDateString()
                            : 'Not set'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Total Value</p>
                        <p className="text-sm text-gray-900">
                          {shipment.totalValue ? `$${shipment.totalValue}` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {shipment.trackingNumber && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                        <p className="text-sm text-gray-900 font-mono">{shipment.trackingNumber}</p>
                      </div>
                    )}

                    {shipment.items && shipment.items.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Items ({shipment.items.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {shipment.items.slice(0, 3).map((item, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.productName} ({item.quantity} {item.unit})
                            </span>
                          ))}
                          {shipment.items.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{shipment.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status)}`}>
                      {shipment.status.replace('_', ' ')}
                    </span>
                    
                    <button
                      onClick={() => {
                        setSelectedShipment(shipment);
                        setShowStatusModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1"
                    >
                      <EditIcon className="h-4 w-4" />
                      <span className="text-sm">Update Status</span>
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
      {showCreateModal && <CreateShipmentModal />}
      {showStatusModal && <StatusUpdateModal />}
    </div>
  );
};

export default ShipmentsComponent;