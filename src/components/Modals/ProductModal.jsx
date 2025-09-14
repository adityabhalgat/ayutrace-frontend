import React from 'react';

const ProductModal = ({ showModal, closeModal, modalType, selectedGood, qrLoading, qrCodeData }) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Blurred backdrop */}
            <div 
                className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-all duration-300"
                onClick={closeModal}
            ></div>
            
            {/* Modal content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
                {/* Scrollable content area with custom scrollbar */}
                <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="p-6">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">
                            {modalType === 'qr' ? '🔳 QR Code' : '👁️ Product Details'}
                        </h3>
                        <button
                            onClick={closeModal}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Product Info Header */}
                    {selectedGood && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h4 className="text-lg font-semibold text-gray-900">{selectedGood.productName}</h4>
                            <p className="text-gray-600">{selectedGood.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>Batch: {selectedGood.batchNumber}</span>
                                <span>Type: {selectedGood.productType}</span>
                                <span>Quantity: {selectedGood.quantity} {selectedGood.unit}</span>
                            </div>
                        </div>
                    )}

                    {/* Modal Content */}
                    {modalType === 'qr' && (
                        <div className="space-y-6">
                            {qrLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Processing QR Code...</p>
                                </div>
                            ) : qrCodeData ? (
                                <div className="space-y-6">
                                    {/* QR Code Image */}
                                    <div className="text-center">
                                        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg inline-block mx-auto">
                                            <img 
                                                src={qrCodeData.qrImage} 
                                                alt="QR Code" 
                                                className="w-64 h-64 mx-auto rounded-lg"
                                            />
                                        </div>
                                        <p className="mt-6 text-sm text-gray-600 font-medium">Scan this QR code to verify the product</p>
                                        <div className="mt-4 flex justify-center space-x-4">
                                            <button 
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.download = `qr-code-${selectedGood?.batchNumber}.png`;
                                                    link.href = qrCodeData.qrImage;
                                                    link.click();
                                                }}
                                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                                            >
                                                📥 Download QR Code
                                            </button>
                                            <button 
                                                onClick={() => window.print()}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                            >
                                                🖨️ Print QR Code
                                            </button>
                                        </div>
                                    </div>

                                    {/* QR Code Details */}
                                    <div className="bg-emerald-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-emerald-800 mb-3">QR Code Information</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-emerald-700">QR Hash:</span>
                                                <span className="ml-2 text-gray-700 font-mono">{qrCodeData.qrHash}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-emerald-700">Entity Type:</span>
                                                <span className="ml-2 text-gray-700">{qrCodeData.entityType}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-emerald-700">Scan Count:</span>
                                                <span className="ml-2 text-gray-700">{qrCodeData.scanCount}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-emerald-700">Status:</span>
                                                <span className="ml-2 text-gray-700">{qrCodeData.isActive ? 'Active' : 'Inactive'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = qrCodeData.qrImage;
                                                link.download = `qr-code-${selectedGood.productName}.png`;
                                                link.click();
                                            }}
                                            className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                                        >
                                            📥 Download QR Code
                                        </button>
                                        <button
                                            onClick={() => window.print()}
                                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            🖨️ Print QR Code
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">Failed to load or generate QR code</p>
                                </div>
                            )}
                        </div>
                    )}

                    {modalType === 'details' && selectedGood && (
                        <div className="space-y-6">
                            {/* Product Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Product Name</label>
                                        <p className="text-lg font-semibold text-gray-900">{selectedGood.productName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Product Type</label>
                                        <p className="text-gray-900">{selectedGood.productType}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Quantity</label>
                                        <p className="text-gray-900">{selectedGood.quantity} {selectedGood.unit}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Batch Number</label>
                                        <p className="text-gray-900 font-mono">{selectedGood.batchNumber}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Expiry Date</label>
                                        <p className="text-gray-900">
                                            {selectedGood.expiryDate ? new Date(selectedGood.expiryDate).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Created Date</label>
                                        <p className="text-gray-900">
                                            {selectedGood.createdAt ? new Date(selectedGood.createdAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Product ID</label>
                                        <p className="text-gray-900 font-mono text-sm">{selectedGood.productId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">Description</label>
                                <p className="text-gray-900 mt-2 p-4 bg-gray-50 rounded-lg">{selectedGood.description}</p>
                            </div>

                            {/* Composition */}
                            {selectedGood.composition && selectedGood.composition.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600 mb-3 block">Composition</label>
                                    <div className="space-y-3">
                                        {selectedGood.composition.map((comp, index) => (
                                            <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                                    <div>
                                                        <span className="font-medium text-blue-700">Batch ID:</span>
                                                        <span className="ml-2 text-gray-700 font-mono">{comp.batchId}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-blue-700">Percentage:</span>
                                                        <span className="ml-2 text-gray-700">{comp.percentage}%</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-blue-700">Quantity Used:</span>
                                                        <span className="ml-2 text-gray-700">{comp.quantityUsed} {comp.unit}</span>
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
                </div>
            </div>
        </div>
    );
};

export default ProductModal;