import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsQR from 'jsqr';
import { readQRCodeFromImage } from '../../utils/qrReader';
import { scanQRCode } from '../../api';
import ProductHistoryModal from './ProductHistoryModal';

const QRScanner = ({ onScan, onClose, isOpen }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [activeMethod, setActiveMethod] = useState('camera');
  const [manualInput, setManualInput] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [productHistory, setProductHistory] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [showActionButtons, setShowActionButtons] = useState(false);

  // Refs for camera scanning
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cleanup on unmount or when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      resetScanState();
    }
    
    return () => {
      stopCamera();
      resetScanState();
    };
  }, [isOpen]);

  const resetScanState = () => {
    setScannedResult(null);
    setShowActionButtons(false);
    setProductHistory(null);
    setShowHistory(false);
    setError('');
    setLoadingHistory(false);
  };

  const startCamera = async () => {
    try {
      setError('');
      setIsScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        intervalRef.current = setInterval(() => {
          scanFromCamera();
        }, 100);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied or not available');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  const scanFromCamera = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        stopCamera();
        handleQRDetected(code.data);
      }
    }
  };

  const handleQRDetected = async (qrData) => {
    console.log('QR Code detected:', qrData);
    setLoadingHistory(true);
    setError('');
    
    try {
      // Extract QR hash from the scanned data
      let qrHash = qrData;
      let parsedData = null;
      
      // Try to parse as JSON first
      try {
        parsedData = JSON.parse(qrData);
        console.log('Parsed QR JSON data:', parsedData);
        
        // Extract qrHash from JSON if available
        if (parsedData.qrHash) {
          qrHash = parsedData.qrHash;
        } else if (parsedData.entityId) {
          // Fallback to entityId if qrHash not present
          qrHash = parsedData.entityId;
        }
      } catch (jsonError) {
        // Not JSON, continue with original logic
        console.log('QR data is not JSON, treating as string:', qrData);
        
        // If it's a URL, extract the hash from it
        if (qrData.includes('/')) {
          const parts = qrData.split('/');
          qrHash = parts[parts.length - 1];
        }
      }
      
      console.log('Using qrHash for lookup:', qrHash);
      
      // Determine what to pass to onScan callback based on context
      let entityIdForCallback = qrHash; // Default to qrHash
      
      // If we have parsed JSON data, prefer entityId for form fields
      if (parsedData && parsedData.entityId) {
        entityIdForCallback = parsedData.entityId;
      }
      
      // Call the backend to get product history
      const response = await scanQRCode(qrHash);
      
      if (response && response.success && response.data) {
        // If we have parsed JSON data, merge it with the response for richer display
        const enrichedData = {
          ...response.data,
          scannedData: parsedData // Include the original scanned JSON data
        };
        
        // Store the scan result and show action buttons
        setScannedResult({
          qrData,
          entityIdForCallback,
          productHistory: enrichedData,
          parsedData
        });
        setShowActionButtons(true);
        
        // Call onScan with the appropriate entity ID for forms
        onScan(entityIdForCallback);
      } else {
        setError('No product information found for this QR code');
        // Still call onScan for fallback behavior with entity ID
        onScan(entityIdForCallback);
      }
    } catch (err) {
      console.error('Error fetching product history:', err);
      setError('Failed to fetch product information. This might be a basic QR code.');
      // Call onScan for fallback behavior with original data
      onScan(qrData);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleTrackTraceability = () => {
    if (scannedResult && scannedResult.productHistory) {
      setProductHistory(scannedResult.productHistory);
      setShowHistory(true);
      setShowActionButtons(false);
    }
  };

  const handleScanNewQR = () => {
    resetScanState();
    setActiveMethod('camera');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, etc.)');
      return;
    }

    setUploadLoading(true);
    setError('');

    try {
      // Read and decode the QR code from the image file
      const qrCodeData = await readQRCodeFromImage(file);
      console.log('Decoded QR code data:', qrCodeData);
      await handleQRDetected(qrCodeData);
    } catch (err) {
      console.error('QR scan error:', err);
      setError('Failed to scan QR code from uploaded image');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleManualEntry = async () => {
    if (!manualInput.trim()) {
      setError('Please enter a QR code value');
      return;
    }
    
    await handleQRDetected(manualInput.trim());
    setManualInput('');
  };

  if (!isOpen) return null;

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
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Scan QR Code</h3>
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
            <p className="text-blue-100 mt-2">Scan QR codes for inventory verification</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Method Selection */}
            <div className="flex space-x-2 mb-6">
              <button
                type="button"
                onClick={() => setActiveMethod('camera')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeMethod === 'camera'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Camera
              </button>
              <button
                type="button"
                onClick={() => setActiveMethod('upload')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeMethod === 'upload'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setActiveMethod('manual')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeMethod === 'manual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Manual
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Camera Scanner */}
            {activeMethod === 'camera' && (
              <div className="space-y-4">
                {!isScanning ? (
                  <div className="text-center">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-gray-600 mb-4">Ready to scan QR codes</p>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Camera
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <video
                        ref={videoRef}
                        className="w-full h-64 object-cover rounded-lg border"
                        autoPlay
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg animate-pulse"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-blue-400 rounded-lg">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">Position QR code within the frame</p>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Stop Camera
                    </button>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            {/* File Upload */}
            {activeMethod === 'upload' && (
              <div className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    uploadLoading 
                      ? 'border-gray-300 cursor-not-allowed' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onClick={() => !uploadLoading && fileInputRef.current?.click()}
                >
                  {uploadLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-blue-600 font-medium">Processing...</p>
                    </>
                  ) : (
                    <>
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600">Upload QR Code Image</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG formats supported</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadLoading}
                />
              </div>
            )}

            {/* Manual Entry */}
            {activeMethod === 'manual' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter QR Code Data
                  </label>
                  <textarea
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Enter QR code data manually (supports JSON format)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                  />
                </div>
                
                {/* Test JSON Button */}
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setManualInput('{"entityType":"RAW_MATERIAL_BATCH","entityId":"09bdfa99-1cc7-48c9-ac08-1c18400f8c4e","customData":{"batchInfo":"Premium Ashwagandha","harvestDate":"2025-08-15"},"qrHash":"4e98a08e1809b7b3f4f068eb51d13399"}')}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Test JSON Format
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualInput('4e98a08e1809b7b3f4f068eb51d13399')}
                    className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Test Hash Only
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={handleManualEntry}
                  disabled={!manualInput.trim()}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Code
                </button>
              </div>
            )}

            {/* Loading State */}
            {loadingHistory && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-blue-600 font-medium">Loading product information...</p>
              </div>
            )}

            {/* Action Buttons after successful scan */}
            {showActionButtons && scannedResult && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-1">QR Code Scanned Successfully!</h3>
                  <p className="text-green-700 text-sm mb-4">
                    {scannedResult.parsedData 
                      ? `${scannedResult.parsedData.entityType} detected`
                      : 'Product information retrieved'
                    }
                  </p>
                  
                  {/* Display basic scan info */}
                  {scannedResult.parsedData && (
                    <div className="bg-white p-3 rounded-lg mb-4 text-left">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Type:</span>
                          <p className="text-gray-800">{scannedResult.parsedData.entityType}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">ID:</span>
                          <p className="text-gray-800 font-mono text-xs">{scannedResult.parsedData.entityId?.substring(0, 8)}...</p>
                        </div>
                      </div>
                      {scannedResult.parsedData.customData && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          {Object.entries(scannedResult.parsedData.customData).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="font-medium text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                              </span>
                              <span className="ml-2 text-gray-800">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleTrackTraceability}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Track Traceability</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleScanNewQR}
                    className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Scan New QR</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Product History Modal */}
      <ProductHistoryModal
        productData={productHistory}
        isOpen={showHistory}
        onClose={() => {
          setShowHistory(false);
          setProductHistory(null);
          // Show action buttons again instead of closing main modal
          if (scannedResult) {
            setShowActionButtons(true);
          } else {
            onClose(); // Close the main scanner modal if no scan result
          }
        }}
      />
    </AnimatePresence>
  );
};

export default QRScanner;