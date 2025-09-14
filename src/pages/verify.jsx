import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { uploadAndScanQR, scanQRCode } from '../api';
import ScanResults from '../components/Dashboard/ScanResults';
import { readQRCodeFromImage } from '../utils/qrReader';

// Custom SVG Icons
const QrCodeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
  </svg>
);

const CameraIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);

const DocumentPlusIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const PencilIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const ExclamationTriangleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function VerifyPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  // State management
  const [activeMethod, setActiveMethod] = useState('camera'); // camera, upload, manual
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);
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
      setError('Camera access denied or not available');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
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
    setLoading(true);
    setError(null);
    
    try {
      let qrHash;
      
      try {
        // Try to parse as JSON first (if QR contains JSON data)
        const jsonData = JSON.parse(qrData);
        console.log('QR contains JSON data:', jsonData);
        
        // Extract qrHash from JSON data
        qrHash = jsonData.qrHash;
        
        if (!qrHash) {
          throw new Error('qrHash field not found in QR code JSON data');
        }
      } catch (parseError) {
        // If not JSON, treat the entire content as the hash
        console.log('QR data is not JSON, treating as direct hash:', qrData);
        qrHash = qrData.trim();
        
        if (!qrHash) {
          throw new Error('QR code appears to be empty');
        }
      }
      
      console.log('Extracted qrHash:', qrHash);
      console.log('Making API call with qrHash:', qrHash);
      
      const response = await scanQRCode(qrHash);
      console.log('API response:', response);
      
      setScanResult({
        success: true,
        message: 'QR code verified successfully',
        data: response,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error verifying QR code:', err);
      setError('Failed to verify QR code: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, etc.)');
      return;
    }

    setUploadedFile(file);
    setUploadLoading(true);
    setError(null);

    try {
      // Read and decode the QR code from the image file
      const qrCodeData = await readQRCodeFromImage(file);
      console.log('Decoded QR code data:', qrCodeData);
      
      let qrHash;
      
      try {
        // Try to parse as JSON first (if QR contains JSON data)
        const jsonData = JSON.parse(qrCodeData);
        console.log('QR contains JSON data:', jsonData);
        
        // Extract qrHash from JSON data
        qrHash = jsonData.qrHash;
        
        if (!qrHash) {
          throw new Error('qrHash field not found in QR code JSON data');
        }
      } catch (parseError) {
        // If not JSON, treat the entire content as the hash
        console.log('QR data is not JSON, treating as direct hash:', qrCodeData);
        qrHash = qrCodeData.trim();
        
        if (!qrHash) {
          throw new Error('QR code appears to be empty');
        }
      }
      
      console.log('Extracted qrHash:', qrHash);
      console.log('Making API call with qrHash:', qrHash);
      
      const response = await scanQRCode(qrHash);
      console.log('API response:', response);
      
      setScanResult({
        success: true,
        message: 'QR code from uploaded image verified successfully',
        data: response,
        timestamp: new Date().toISOString(),
        uploadedImage: URL.createObjectURL(file)
      });
      setUploadedFile(null);
    } catch (err) {
      console.error('QR scan error:', err);
      setError('Failed to scan QR code: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadLoading(false);
    }
  };

  const handleManualVerify = async () => {
    if (!manualInput.trim()) {
      setError('Please enter a QR code hash or product ID');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let qrData;
      
      try {
        // Try to parse as JSON first
        qrData = JSON.parse(manualInput.trim());
      } catch (parseError) {
        // If not JSON, treat as plain text (might be just the hash)
        qrData = { qrHash: manualInput.trim() };
      }
      
      // Extract qrHash from the data
      const qrHash = qrData.qrHash || qrData;
      
      if (!qrHash) {
        throw new Error('QR hash not found in the input data');
      }
      
      console.log('Making API call with qrHash:', qrHash);
      const response = await scanQRCode(qrHash);
      console.log('API response:', response);
      
      setScanResult({
        success: true,
        message: 'Manual verification successful',
        data: response,
        timestamp: new Date().toISOString()
      });
      setManualInput('');
    } catch (err) {
      console.error('Error with manual verification:', err);
      setError('Failed to verify input: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const renderMethodButtons = () => (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <button
        onClick={() => setActiveMethod('camera')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
          activeMethod === 'camera'
            ? 'bg-emerald-600 text-white shadow-lg'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <CameraIcon className="h-5 w-5" />
        Camera Scan
      </button>
      
      <button
        onClick={() => setActiveMethod('upload')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
          activeMethod === 'upload'
            ? 'bg-emerald-600 text-white shadow-lg'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <DocumentPlusIcon className="h-5 w-5" />
        Upload Image
      </button>
      
      <button
        onClick={() => setActiveMethod('manual')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
          activeMethod === 'manual'
            ? 'bg-emerald-600 text-white shadow-lg'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <PencilIcon className="h-5 w-5" />
        Manual Entry
      </button>
    </div>
  );

  const renderCameraScanner = () => (
    <div className="space-y-4">
      {!isScanning ? (
        <div className="text-center">
          <div className="bg-gray-100 rounded-lg p-8 mb-4">
            <CameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Position QR code within camera view</p>
            <button
              onClick={startCamera}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700"
            >
              Start Camera
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="relative inline-block">
            <video
              ref={videoRef}
              className="max-w-full h-64 bg-black rounded-lg"
              playsInline
              muted
            />
            <div className="absolute inset-0 border-2 border-emerald-400 rounded-lg pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-emerald-400 rounded-lg"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">Position QR code within the frame</p>
          <button
            onClick={stopCamera}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700"
          >
            Stop Camera
          </button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );

  const renderFileUpload = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div 
          className="bg-gray-100 rounded-lg p-8 border-2 border-dashed border-gray-300 hover:border-emerald-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <DocumentPlusIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Click to upload QR code image</p>
          <p className="text-sm text-gray-500">Supports PNG, JPG, JPEG files</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );

  const renderManualEntry = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          QR Code Data or Product ID
        </label>
        <textarea
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder="Enter QR code data, hash, or product ID..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 h-32 resize-none"
        />
      </div>
      <button
        onClick={handleManualVerify}
        disabled={!manualInput.trim() || loading}
        className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Verify Product
      </button>
    </div>
  );

  const clearResults = () => {
    setScanResult(null);
    setError(null);
    setUploadedFile(null);
    setManualInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (scanResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="text-emerald-600 hover:text-emerald-800 font-medium mb-4"
            >
              ← Back to Home
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Verification Results</h1>
          </div>
          <ScanResults scanResult={scanResult} clearResults={clearResults} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-emerald-600 hover:text-emerald-800 font-medium mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Product Authenticity</h1>
          <p className="text-gray-600">Scan, upload, or manually enter product information for verification</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {renderMethodButtons()}

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {(loading || uploadLoading) && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {loading ? 'Verifying QR code...' : 'Processing uploaded image...'}
              </p>
            </div>
          )}

          {/* Method Content */}
          {!loading && !uploadLoading && (
            <>
              {activeMethod === 'camera' && renderCameraScanner()}
              {activeMethod === 'upload' && renderFileUpload()}
              {activeMethod === 'manual' && renderManualEntry()}
            </>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Having trouble? Try a different verification method above.</p>
        </div>
      </div>
    </div>
  );
}