import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getDistributorInventory,
  addInventoryItem,
  updateInventoryItem,
  scanDistributorQRCode
} from '../../../api';
import QRScanner from '../../Common/QRScanner';

// Modern Table Component
const ModernTable = ({ data, columns, onEdit, onDelete, loading }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => requestSort(column.key)}
                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {sortConfig.key === column.key && (
                    <span className="text-blue-500">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((item, index) => (
            <motion.tr
              key={item.inventoryId || item.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50 transition-colors"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                  {column.render ? column.render(item[column.key], item) : item[column.key]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Modern Modal Component
const ModernModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
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
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function ModernInventorySection({ theme }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrScanTarget, setQrScanTarget] = useState(''); // 'add' or 'search'
  const [newItem, setNewItem] = useState({
    productType: 'RAW_MATERIAL_BATCH',
    entityId: '',
    quantity: '',
    unit: 'KG',
    location: '',
    warehouseSection: '',
    status: 'IN_STOCK',
    expiryDate: '',
    qualityNotes: '',
    storageConditions: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getDistributorInventory();
      console.log('Inventory API Response:', response);

      // Handle the correct backend response structure
      if (response && response.success && response.data) {
        const inventoryData = response.data.inventory || [];
        setInventory(inventoryData);
        console.log('Inventory items loaded:', inventoryData.length);
      } else {
        console.warn('Unexpected inventory API response structure:', response);
        setInventory([]);
      }
    } catch (err) {
      console.error('Inventory fetch error:', err);
      setError(err.message);
      // Mock data for development when API fails
      setInventory([
        {
          inventoryId: 1,
          productType: 'RAW_MATERIAL_BATCH',
          entityId: 'batch-001',
          quantity: 150,
          unit: 'KG',
          location: 'Cold Storage A-1',
          status: 'IN_STOCK',
          receivedDate: new Date().toISOString(),
          expiryDate: '2025-06-15',
          supplierInfo: { name: 'Fresh Farms Cooperative' },
          qualityNotes: 'Premium quality - Fresh harvest',
          storageConditions: 'Refrigerated (2-8°C)'
        },
        {
          inventoryId: 2,
          productType: 'FINISHED_GOOD',
          entityId: 'product-002',
          quantity: 75,
          unit: 'BOXES',
          location: 'Warehouse B-2',
          status: 'LOW_STOCK',
          receivedDate: new Date().toISOString(),
          expiryDate: '2025-08-20',
          supplierInfo: { name: 'Organic Produce Co.' },
          qualityNotes: 'Quality inspected - Grade A',
          storageConditions: 'Cool, dry place (15-25°C)'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      // Validate required fields
      if (!newItem.entityId.trim()) {
        alert('Entity ID is required');
        return;
      }

      // Validate UUID format for entityId
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(newItem.entityId)) {
        alert('Entity ID must be a valid UUID format. Please scan a valid QR code or enter a proper UUID.');
        return;
      }

      if (!newItem.quantity || newItem.quantity <= 0) {
        alert('Quantity must be greater than 0');
        return;
      }

      if (!newItem.location.trim()) {
        alert('Location is required');
        return;
      }

      console.log('Sending inventory item data:', newItem);

      const response = await addInventoryItem(newItem);
      setInventory(prev => [...prev, response.data || response]);
      setShowAddModal(false);
      setNewItem({
        productType: 'RAW_MATERIAL_BATCH',
        entityId: '',
        quantity: '',
        unit: 'KG',
        location: '',
        warehouseSection: '',
        status: 'IN_STOCK',
        expiryDate: '',
        qualityNotes: '',
        storageConditions: ''
      });
    } catch (err) {
      console.error('Add item error:', err);

      // Extract more detailed error message if available
      let errorMessage = 'Failed to add item';
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          const fieldErrors = err.response.data.errors.map(error =>
            `${error.field}: ${error.message}`
          ).join('\n');
          errorMessage += '\n\nField errors:\n' + fieldErrors;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      alert(errorMessage);
    }
  };

  const handleEditItem = async () => {
    try {
      // Only send fields that are allowed to be updated
      const updateData = {
        quantity: editingItem.quantity,
        location: editingItem.location,
        warehouseSection: editingItem.warehouseSection,
        status: editingItem.status,
        expiryDate: editingItem.expiryDate,
        qualityNotes: editingItem.qualityNotes,
        storageConditions: editingItem.storageConditions
      };

      console.log('Sending update data:', updateData);

      const response = await updateInventoryItem(editingItem.inventoryId, updateData);
      setInventory(prev => prev.map(item =>
        item.inventoryId === editingItem.inventoryId ? { ...item, ...updateData } : item
      ));
      setEditingItem(null);
    } catch (err) {
      console.error('Update item error:', err);
      alert('Failed to update item: ' + err.message);
    }
  };

  // QR Code scanning functions
  const handleQRScan = (qrCode) => {
    console.log('QR Code scanned:', qrCode);
    setShowQRScanner(false);

    if (qrScanTarget === 'add') {
      // Use scanned QR code as entity ID for new item
      setNewItem(prev => ({ ...prev, entityId: qrCode }));
    } else if (qrScanTarget === 'search') {
      // Search for items with this entity ID
      setSearchTerm(qrCode);
    }

    setQrScanTarget('');
  };

  const startQRScan = (target) => {
    setQrScanTarget(target);
    setShowQRScanner(true);
  };

  const filteredInventory = (Array.isArray(inventory) ? inventory : []).filter(item => {
    const matchesSearch = item.entityId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      key: 'entityId',
      label: 'Product',
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900">{item.productType}</div>
          <div className="text-sm text-gray-500">{value}</div>
        </div>
      )
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (value, item) => (
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${value === 0 ? 'text-red-600' :
              value < 100 ? 'text-yellow-600' : 'text-green-600'
            }`}>
            {value}
          </span>
          <span className="text-sm text-gray-500">{item.unit}</span>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (value, item) => (
        <div>
          <span className="text-sm font-medium text-gray-900">{value}</span>
          {item.warehouseSection && (
            <div className="text-xs text-gray-500">{item.warehouseSection}</div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${value === 'IN_STOCK' ? 'bg-green-100 text-green-800' :
            value === 'LOW_STOCK' ? 'bg-yellow-100 text-yellow-800' :
              value === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-800' :
                value === 'RESERVED' ? 'bg-blue-100 text-blue-800' :
                  value === 'DAMAGED' ? 'bg-orange-100 text-orange-800' :
                    value === 'EXPIRED' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
          }`}>
          {value.replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'expiryDate',
      label: 'Expiry Date',
      render: (value) => (
        <span className="text-sm text-gray-900">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
      )
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'IN_STOCK', label: 'In Stock' },
    { value: 'LOW_STOCK', label: 'Low Stock' },
    { value: 'OUT_OF_STOCK', label: 'Out of Stock' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your product inventory</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          {/* QR Scan for Search */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startQRScan('search')}
            className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span>Scan to Search</span>
          </motion.button>

          {/* Add Item Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Item</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search products, batches, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
          <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <button
          onClick={fetchInventory}
          className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </motion.div>

      {/* Inventory Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Items', value: Array.isArray(inventory) ? inventory.length : 0, color: 'from-blue-500 to-cyan-500' },
          { label: 'In Stock', value: Array.isArray(inventory) ? inventory.filter(i => i.status === 'IN_STOCK').length : 0, color: 'from-green-500 to-emerald-500' },
          { label: 'Low Stock', value: Array.isArray(inventory) ? inventory.filter(i => i.status === 'LOW_STOCK').length : 0, color: 'from-yellow-500 to-orange-500' },
          { label: 'Out of Stock', value: Array.isArray(inventory) ? inventory.filter(i => i.status === 'OUT_OF_STOCK').length : 0, color: 'from-red-500 to-pink-500' }
        ].map((stat, index) => (
          <div key={index} className={`${theme.colors.card} rounded-xl p-4 ${theme.shadows.soft} border border-gray-200/50`}>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-2`}>
              <span className="text-white text-sm font-bold">{stat.value}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Inventory Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`${theme.colors.card} rounded-2xl ${theme.shadows.soft} border border-gray-200/50 overflow-hidden`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Inventory Items ({filteredInventory.length})
            </h2>
            <div className="text-sm text-gray-500">
              Showing {filteredInventory.length} of {inventory.length} items
            </div>
          </div>
        </div>

        <ModernTable
          data={filteredInventory}
          columns={columns}
          onEdit={setEditingItem}
          onDelete={(item) => console.log('Delete:', item)}
          loading={loading}
        />
      </motion.div>

      {/* Add Item Modal */}
      <ModernModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Inventory Item"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
            <select
              value={newItem.productType}
              onChange={(e) => setNewItem(prev => ({ ...prev, productType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="RAW_MATERIAL_BATCH">Raw Material Batch</option>
              <option value="FINISHED_GOOD">Finished Good</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Entity ID</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newItem.entityId}
                onChange={(e) => setNewItem(prev => ({ ...prev, entityId: e.target.value }))}
                placeholder="Enter or scan QR code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <button
                type="button"
                onClick={() => startQRScan('add')}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>Scan</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="KG">Kilograms</option>
                <option value="TONNES">Tonnes</option>
                <option value="GRAMS">Grams</option>
                <option value="POUNDS">Pounds</option>
                <option value="PIECES">Pieces</option>
                <option value="BOTTLES">Bottles</option>
                <option value="BOXES">Boxes</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={newItem.location}
                onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Warehouse Section</label>
              <input
                type="text"
                value={newItem.warehouseSection}
                onChange={(e) => setNewItem(prev => ({ ...prev, warehouseSection: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="date"
              value={newItem.expiryDate}
              onChange={(e) => setNewItem(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Quality Notes Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality Notes <span className="text-red-500">*</span></label>
            <select
              value={newItem.qualityNotes}
              onChange={(e) => setNewItem(prev => ({ ...prev, qualityNotes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 mb-2"
            >
              <option value="">Select quality notes</option>
              <option value="Premium quality - Laboratory tested">Premium quality - Laboratory tested</option>
              <option value="Good quality - Visually inspected">Good quality - Visually inspected</option>
              <option value="Standard quality - Basic inspection">Standard quality - Basic inspection</option>
              <option value="High grade - Certified organic">High grade - Certified organic</option>
              <option value="Export quality - International standards">Export quality - International standards</option>
            </select>
            <textarea
              value={newItem.qualityNotes}
              onChange={(e) => setNewItem(prev => ({ ...prev, qualityNotes: e.target.value }))}
              placeholder="Or enter custom quality notes..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
            />
          </div>

          {/* Storage Conditions Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Storage Conditions <span className="text-red-500">*</span></label>
            <select
              value={newItem.storageConditions}
              onChange={(e) => setNewItem(prev => ({ ...prev, storageConditions: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 mb-2"
            >
              <option value="">Select storage conditions</option>
              <option value="Cool, dry place (15-25°C)">Cool, dry place (15-25°C)</option>
              <option value="Room temperature (20-25°C)">Room temperature (20-25°C)</option>
              <option value="Refrigerated (2-8°C)">Refrigerated (2-8°C)</option>
              <option value="Frozen storage (-18°C)">Frozen storage (-18°C)</option>
              <option value="Climate controlled environment">Climate controlled environment</option>
              <option value="Away from direct sunlight">Away from direct sunlight</option>
            </select>
            <textarea
              value={newItem.storageConditions}
              onChange={(e) => setNewItem(prev => ({ ...prev, storageConditions: e.target.value }))}
              placeholder="Or enter custom storage conditions..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddItem}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Add Item
            </button>
          </div>
        </div>
      </ModernModal>

      {/* Edit Item Modal */}
      <ModernModal
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        title="Edit Inventory Item"
      >
        {editingItem && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={editingItem.quantity}
                onChange={(e) => setEditingItem(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={editingItem.location}
                onChange={(e) => setEditingItem(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={editingItem.status}
                onChange={(e) => setEditingItem(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>

            {/* Quality Notes Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality Notes</label>
              <textarea
                value={editingItem.qualityNotes || ''}
                onChange={(e) => setEditingItem(prev => ({ ...prev, qualityNotes: e.target.value }))}
                placeholder="Enter quality notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
              />
            </div>

            {/* Storage Conditions Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Storage Conditions</label>
              <textarea
                value={editingItem.storageConditions || ''}
                onChange={(e) => setEditingItem(prev => ({ ...prev, storageConditions: e.target.value }))}
                placeholder="Enter storage conditions"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditItem}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Update Item
              </button>
            </div>
          </div>
        )}
      </ModernModal>

      {/* QR Scanner */}
      <QRScanner
        isOpen={showQRScanner}
        onScan={handleQRScan}
        onClose={() => setShowQRScanner(false)}
      />
    </div>
  );
}