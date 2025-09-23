import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductHistoryModal = ({ productData, isOpen, onClose }) => {
  if (!isOpen || !productData) return null;

  const { qrCode, entityData, traceabilityData } = productData;

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

  const renderEntityInfo = () => {
    switch (qrCode.entityType) {
      case 'RAW_MATERIAL_BATCH':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Raw Material Batch</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Batch ID:</span>
                  <p className="text-gray-800">{entityData.batchId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Herb Name:</span>
                  <p className="text-gray-800">{entityData.herbName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Scientific Name:</span>
                  <p className="text-gray-800">{entityData.scientificName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Quantity:</span>
                  <p className="text-gray-800">{entityData.quantity} {entityData.unit}</p>
                </div>
              </div>
              {entityData.description && (
                <div className="mt-3">
                  <span className="font-medium text-gray-600">Description:</span>
                  <p className="text-gray-800 text-sm mt-1">{entityData.description}</p>
                </div>
              )}
            </div>

            {/* Collection Events */}
            {entityData.collectionEvents && entityData.collectionEvents.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Collection History</h4>
                <div className="space-y-3">
                  {entityData.collectionEvents.map((event, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Farmer:</span>
                          <p className="text-gray-800">{event.farmer?.firstName} {event.farmer?.lastName}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Location:</span>
                          <p className="text-gray-800">{event.farmer?.location}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Collector:</span>
                          <p className="text-gray-800">{event.collector?.firstName} {event.collector?.lastName}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Species:</span>
                          <p className="text-gray-800">{event.herbSpecies?.commonName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'FINISHED_GOOD':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Finished Product</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Product ID:</span>
                  <p className="text-gray-800">{entityData.productId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Product Name:</span>
                  <p className="text-gray-800">{entityData.productName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Type:</span>
                  <p className="text-gray-800">{entityData.productType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Manufacturer:</span>
                  <p className="text-gray-800">{entityData.manufacturer?.firstName} {entityData.manufacturer?.lastName}</p>
                </div>
              </div>
            </div>

            {/* Traceability Data for Finished Goods */}
            {traceabilityData && (
              <div className="space-y-4">
                {/* Source Farmers */}
                {traceabilityData.sourceFarmers && traceabilityData.sourceFarmers.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">Source Farmers</h4>
                    <div className="grid gap-3">
                      {traceabilityData.sourceFarmers.map((farmer, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Name:</span>
                              <p className="text-gray-800">{farmer.firstName} {farmer.lastName}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Location:</span>
                              <p className="text-gray-800">{farmer.location}</p>
                            </div>
                            {farmer.phone && (
                              <div>
                                <span className="font-medium text-gray-600">Phone:</span>
                                <p className="text-gray-800">{farmer.phone}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Raw Material Composition */}
                {traceabilityData.rawMaterialBatches && traceabilityData.rawMaterialBatches.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-3">Raw Material Composition</h4>
                    <div className="space-y-2">
                      {traceabilityData.rawMaterialBatches.map((batch, index) => (
                        <div key={index} className="bg-white p-3 rounded border">
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Herb:</span>
                              <p className="text-gray-800">{batch.herbName}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Percentage:</span>
                              <p className="text-gray-800">{batch.percentage}%</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Quantity Used:</span>
                              <p className="text-gray-800">{batch.quantityUsed}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'LAB_TEST':
        return (
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-indigo-800 mb-2">Lab Test</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Test ID:</span>
                <p className="text-gray-800">{entityData.testId}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <p className="text-gray-800">{entityData.status}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Requester:</span>
                <p className="text-gray-800">{entityData.requester?.firstName} {entityData.requester?.lastName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Lab Technician:</span>
                <p className="text-gray-800">{entityData.labTechnician?.firstName} {entityData.labTechnician?.lastName}</p>
              </div>
            </div>
            {entityData.batch && (
              <div className="mt-3 pt-3 border-t border-indigo-200">
                <span className="font-medium text-gray-600">Tested Batch:</span>
                <p className="text-gray-800">{entityData.batch.herbName} (ID: {entityData.batch.batchId})</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Unknown Entity Type</h4>
            <p className="text-gray-600">Entity type: {qrCode.entityType}</p>
          </div>
        );
    }
  };

  const renderSupplyChainEvents = () => {
    const events = entityData.supplyChainEvents;
    if (!events || events.length === 0) return null;

    return (
      <div className="bg-orange-50 p-4 rounded-lg">
        <h4 className="font-semibold text-orange-800 mb-3">Supply Chain Journey</h4>
        <div className="space-y-3">
          {events.map((event, index) => (
            <div key={index} className="bg-white p-3 rounded border">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Handler:</span>
                  <p className="text-gray-800">{event.handler?.firstName} {event.handler?.lastName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Date:</span>
                  <p className="text-gray-800">{formatDate(event.timestamp)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">From:</span>
                  <p className="text-gray-800">{event.fromLocation?.name || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">To:</span>
                  <p className="text-gray-800">{event.toLocation?.name || 'N/A'}</p>
                </div>
              </div>
              {event.notes && (
                <div className="mt-2">
                  <span className="font-medium text-gray-600">Notes:</span>
                  <p className="text-gray-800 text-sm">{event.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Product Traceability</h3>
                <p className="text-emerald-100 mt-1">QR Hash: {qrCode.qrHash}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* QR Code Info */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-emerald-200">Generated By:</span>
                <p className="text-white font-medium">{qrCode.generatedByUser?.firstName} {qrCode.generatedByUser?.lastName}</p>
              </div>
              <div>
                <span className="text-emerald-200">Scan Count:</span>
                <p className="text-white font-medium">{qrCode.scanCount || 0}</p>
              </div>
              <div>
                <span className="text-emerald-200">Last Scanned:</span>
                <p className="text-white font-medium">{formatDate(qrCode.lastScannedAt)}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Scanned QR Data (if available) */}
            {productData.scannedData && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">QR Code Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Entity Type:</span>
                    <p className="text-gray-800">{productData.scannedData.entityType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Entity ID:</span>
                    <p className="text-gray-800 font-mono text-xs">{productData.scannedData.entityId}</p>
                  </div>
                </div>
                
                {/* Custom Data from QR */}
                {productData.scannedData.customData && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <span className="font-medium text-gray-600">Additional Information:</span>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {Object.entries(productData.scannedData.customData).map(([key, value]) => (
                        <div key={key} className="bg-white p-2 rounded border">
                          <span className="font-medium text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <span className="ml-2 text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {productData.scannedData.qrHash && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <span className="font-medium text-gray-600">QR Hash:</span>
                    <p className="text-gray-800 font-mono text-xs mt-1">{productData.scannedData.qrHash}</p>
                  </div>
                )}
              </div>
            )}

            {/* Entity Information */}
            {renderEntityInfo()}

            {/* Supply Chain Events */}
            {renderSupplyChainEvents()}

            {/* QR Code Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">QR Code Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Entity Type:</span>
                  <p className="text-gray-800">{qrCode.entityType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Entity ID:</span>
                  <p className="text-gray-800">{qrCode.entityId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Created:</span>
                  <p className="text-gray-800">{formatDate(qrCode.createdAt)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <p className="text-gray-800">{qrCode.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-2xl">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductHistoryModal;