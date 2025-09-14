import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { scanQRCode } from '../../api';
import { QrCodeIcon, CameraIcon, DocumentPlusIcon, PencilIcon } from '../UI/Icons';
import { readQRCodeFromImage } from '../../utils/qrReader';
import ScanResults from './ScanResults';

const VerifyComponent = () => {
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [manualInput, setManualInput] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [activeMethod, setActiveMethod] = useState('camera'); // camera, upload, manual
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const intervalRef = useRef(null);
    const fileInputRef = useRef(null);

    const startScanning = async () => {
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
                    scanQRCodeFromCamera();
                }, 100);
            }
        } catch (err) {
            setError('Camera access denied or not available');
            setIsScanning(false);
        }
    };

    const stopScanning = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        
        setIsScanning(false);
    };

    const scanQRCodeFromCamera = () => {
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
                stopScanning();
                handleQRCodeDetected(code.data);
            }
        }
    };

    const handleQRCodeDetected = async (qrData) => {
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

    const handleManualVerification = async () => {
        if (!manualInput.trim()) {
            setError('Please enter a QR code or product ID');
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
            stopScanning();
        };
    }, []);

    if (scanResult) {
        return <ScanResults scanResult={scanResult} clearResults={clearResults} />;
    }

    return (
        <div className="w-full h-full max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Verify Products</h2>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full">
                <div className="text-center mb-10">
                    <QrCodeIcon className="h-24 w-24 text-emerald-600 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">QR Code Verification</h3>
                    <p className="text-gray-600 text-lg">Scan with camera, upload images, or manually enter data to verify product authenticity</p>
                </div>

                {/* Method Selection Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setActiveMethod('camera')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                activeMethod === 'camera'
                                    ? 'bg-emerald-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <CameraIcon className="h-5 w-5 inline mr-2" />
                            Camera Scan
                        </button>
                        <button
                            onClick={() => setActiveMethod('upload')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                activeMethod === 'upload'
                                    ? 'bg-emerald-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <DocumentPlusIcon className="h-5 w-5 inline mr-2" />
                            Upload Image
                        </button>
                        <button
                            onClick={() => setActiveMethod('manual')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${
                                activeMethod === 'manual'
                                    ? 'bg-emerald-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <PencilIcon className="h-5 w-5 inline mr-2" />
                            Manual Entry
                        </button>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto">
                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <h4 className="font-semibold">Error:</h4>
                            <p className="text-sm">{error}</p>
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

                    {/* Camera Scanning */}
                    {activeMethod === 'camera' && !loading && (
                        <div className="space-y-4">
                            {!isScanning ? (
                                <div className="text-center">
                                    <div className="bg-gray-100 rounded-lg p-8 mb-4">
                                        <CameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">Position QR code within camera view</p>
                                        <button
                                            onClick={startScanning}
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
                                        onClick={stopScanning}
                                        className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700"
                                    >
                                        Stop Camera
                                    </button>
                                </div>
                            )}
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                    )}

                    {/* File Upload */}
                    {activeMethod === 'upload' && !loading && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload QR Code Image
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Supported formats: JPG, PNG, GIF
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Manual Entry */}
                    {activeMethod === 'manual' && !loading && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    QR Code Data or Product ID
                                </label>
                                <textarea
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    placeholder="Enter QR code data, hash, or product ID..."
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 h-32 resize-none"
                                />
                            </div>
                            <button
                                onClick={handleManualVerification}
                                disabled={!manualInput.trim()}
                                className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Verify Product
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Choose your preferred verification method above to get detailed product information.</p>
                    <p>Make sure QR codes are clear and well-lit for best results.</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyComponent;