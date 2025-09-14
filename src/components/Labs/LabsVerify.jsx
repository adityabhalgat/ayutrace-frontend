import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { scanQRCode, getLabCertificates } from '../../api';
import { readQRCodeFromImage } from '../../utils/qrReader';
import ScanResults from '../Dashboard/ScanResults';

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

const LabsVerify = () => {
    // State management
    const [activeMethod, setActiveMethod] = useState('camera');
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [manualInput, setManualInput] = useState('');
    const [certificates, setCertificates] = useState([]);
    const [loadingCertificates, setLoadingCertificates] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);

    // Refs
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const intervalRef = useRef(null);
    const fileInputRef = useRef(null);

    // Load certificates on component mount
    useEffect(() => {
        loadCertificates();
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const loadCertificates = async () => {
        try {
            setLoadingCertificates(true);
            const response = await getLabCertificates();
            if (response.success) {
                setCertificates(response.data || []);
            }
        } catch (err) {
            console.error('Error loading certificates:', err);
        } finally {
            setLoadingCertificates(false);
        }
    };

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
                data: response.data,
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
                data: response.data,
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
            setError('Please enter a QR code hash or certificate ID');
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
                data: response.data,
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

    const clearResults = () => {
        setScanResult(null);
        setError(null);
        setUploadedFile(null);
        setManualInput('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const renderMethodButtons = () => (
        <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center items-center max-w-4xl mx-auto">
            <button
                onClick={() => setActiveMethod('camera')}
                className={`flex-1 sm:max-w-xs flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeMethod === 'camera'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
                <CameraIcon className="h-5 w-5" />
                Camera Scan
            </button>
            
            <button
                onClick={() => setActiveMethod('upload')}
                className={`flex-1 sm:max-w-xs flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeMethod === 'upload'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
                <DocumentPlusIcon className="h-5 w-5" />
                Upload Image
            </button>
            
            <button
                onClick={() => setActiveMethod('manual')}
                className={`flex-1 sm:max-w-xs flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeMethod === 'manual'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
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
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
                        <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CameraIcon className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Lab Verification Scanner</h3>
                        <p className="text-gray-600 mb-6">Position QR codes within camera view for lab test verification</p>
                        <button
                            onClick={startCamera}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg transform hover:scale-105"
                        >
                            🔬 Start Lab Verification Scan
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Scanning for QR Code</h3>
                    <div className="relative inline-block mb-4">
                        <video
                            ref={videoRef}
                            className="w-80 h-80 object-cover rounded-xl border-4 border-cyan-300"
                            autoPlay
                            muted
                            playsInline
                        />
                        <div className="absolute inset-0 border-4 border-cyan-500 rounded-xl animate-pulse"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-cyan-400 rounded-lg pointer-events-none">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500"></div>
                        </div>
                    </div>
                    <p className="text-gray-600 mb-4">Position the QR code within the scanning frame</p>
                    <button
                        onClick={stopCamera}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                        Stop Scanning
                    </button>
                </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );

    const renderFileUpload = () => (
        <div className="space-y-4">
            <div className="text-center">
                <div 
                    className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-dashed transition-colors cursor-pointer ${
                        uploadLoading 
                            ? 'border-gray-300 cursor-not-allowed' 
                            : 'border-blue-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100'
                    }`}
                    onClick={() => !uploadLoading && fileInputRef.current?.click()}
                >
                    {uploadLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-blue-600 font-semibold mb-2">Processing QR code...</p>
                            <p className="text-sm text-gray-500">Analyzing uploaded image</p>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <DocumentPlusIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload QR Code Image</h3>
                            <p className="text-gray-600 mb-2">Upload images from testing machines or equipment</p>
                            <p className="text-sm text-gray-500">Supports PNG, JPG, JPEG formats</p>
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
                {uploadedFile && !uploadLoading && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 mb-2">Selected: {uploadedFile.name}</p>
                        <button
                            onClick={() => {
                                setUploadedFile(null);
                                fileInputRef.current.value = '';
                            }}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                            Remove file
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const renderManualEntry = () => (
        <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <PencilIcon className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Manual Verification</h3>
                    <p className="text-gray-600">Enter QR code data or certificate ID manually</p>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            QR Code Data or Certificate ID
                        </label>
                        <textarea
                            value={manualInput}
                            onChange={(e) => setManualInput(e.target.value)}
                            placeholder="Enter QR code data, hash, or certificate ID..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-32 resize-none"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleManualVerify();
                                }
                            }}
                        />
                    </div>
                    <button
                        onClick={handleManualVerify}
                        disabled={!manualInput.trim() || loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Verifying...
                            </div>
                        ) : (
                            'Verify Lab Certificate'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    // Show results if scan is completed
    if (scanResult) {
        return <ScanResults scanResult={scanResult} clearResults={clearResults} />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <QrCodeIcon className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    Lab Verification System
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Verify product authenticity and view comprehensive lab test results using QR codes
                </p>
            </div>

            {/* Main Verification Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                {renderMethodButtons()}

                {/* Error Display */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-red-800 font-semibold">Verification Error</h4>
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-400 hover:text-red-600 p-1"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {(loading || uploadLoading) && (
                    <div className="text-center py-8 mb-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">
                            {loading ? 'Verifying QR code with lab database...' : 'Processing uploaded image...'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Please wait while we authenticate the lab certificate</p>
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

            {/* Lab Certificates Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Recent Lab Certificates</h3>
                        <p className="text-gray-600">Certificates issued by your testing laboratory</p>
                    </div>
                    <button
                        onClick={loadCertificates}
                        disabled={loadingCertificates}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingCertificates ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Loading...
                            </div>
                        ) : (
                            'Refresh'
                        )}
                    </button>
                </div>

                {loadingCertificates ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : certificates.length > 0 ? (
                    <div className="space-y-4">
                        {certificates.slice(0, 5).map((cert) => (
                            <div key={cert.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 hover:from-gray-100 hover:to-blue-100 transition-all duration-200 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                <CheckCircleIcon className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">
                                                    {cert.certificateNumber || cert.id}
                                                </h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    cert.certificateType === 'TEST_COMPLETION' ? 'bg-green-100 text-green-800' :
                                                    cert.certificateType === 'COMPLIANCE' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {(cert.certificateType || 'UNKNOWN').replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <p className="text-gray-600">
                                                <span className="font-medium">Test Type:</span> {cert.labTest?.testType?.replace(/_/g, ' ') || 'N/A'}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">Sample ID:</span> {cert.labTest?.sampleId || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 mb-1">
                                            {cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                        {cert.qrCodeData && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                                                <QrCodeIcon className="h-3 w-3 mr-1" />
                                                QR Available
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {certificates.length > 5 && (
                            <div className="text-center py-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Showing 5 of {certificates.length} certificates
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">🏆</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates found</h3>
                        <p className="text-gray-600">No lab certificates have been issued yet. Complete tests to generate certificates.</p>
                    </div>
                )}
            </div>

            {/* Lab Features Section */}
            <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-xl p-8 border border-cyan-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Lab Verification Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center group">
                        <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                            <span className="text-3xl">🧪</span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Comprehensive Test Results</h4>
                        <p className="text-gray-600">View detailed laboratory test results, analysis reports, and quality certifications</p>
                    </div>
                    <div className="text-center group">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                            <span className="text-3xl">🏆</span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Certificate Validation</h4>
                        <p className="text-gray-600">Validate lab certificates and verify compliance with industry standards</p>
                    </div>
                    <div className="text-center group">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                            <span className="text-3xl">⛓️</span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Blockchain Verification</h4>
                        <p className="text-gray-600">Immutable blockchain records ensure test authenticity and prevent tampering</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default LabsVerify;
