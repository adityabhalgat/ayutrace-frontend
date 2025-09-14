import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { createLabTest, scanQRCode } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { readQRCodeFromImage } from '../../utils/qrReader';

const AddTests = () => {
    const [testForm, setTestForm] = useState({
        sampleName: '',
        sampleType: 'RAW_MATERIAL', // Default sample type
        manufacturer: '',
        batchNumber: '',
        sourceType: 'RAW_MATERIAL', // New field for batch/product linking
        testType: '',
        priority: 'MEDIUM',
        estimatedDuration: '',
        testCost: '',
        collectionDate: '',
        notes: ''
    });

    const [testResults, setTestResults] = useState({});
    const [showResultsForm, setShowResultsForm] = useState(false);
    const [selectedTestType, setSelectedTestType] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // QR Scanning states
    const [isScanning, setIsScanning] = useState(false);
    const [scanLoading, setScanLoading] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const intervalRef = useRef(null);
    const fileInputRef = useRef(null);
    
    // User context for authentication
    const { user } = useAuth();

    // Test types and their parameters - matching backend enums
    const testTypes = {
        'MICROBIOLOGICAL_TESTING': {
            name: 'Microbiological Testing',
            parameters: [
                { key: 'totalPlateCount', label: 'Total Plate Count (CFU/g)', unit: 'CFU/g' },
                { key: 'yeastMold', label: 'Yeast & Mold (CFU/g)', unit: 'CFU/g' },
                { key: 'salmonella', label: 'Salmonella', unit: '/25g' },
                { key: 'ecoli', label: 'E. coli', unit: '/g' },
                { key: 'staphylococcus', label: 'Staphylococcus aureus', unit: '/g' }
            ],
            duration: '3-5 days',
            cost: 2500
        },
        'HEAVY_METALS_ANALYSIS': {
            name: 'Heavy Metals Analysis',
            parameters: [
                { key: 'lead', label: 'Lead (Pb)', unit: 'ppm' },
                { key: 'mercury', label: 'Mercury (Hg)', unit: 'ppm' },
                { key: 'cadmium', label: 'Cadmium (Cd)', unit: 'ppm' },
                { key: 'arsenic', label: 'Arsenic (As)', unit: 'ppm' }
            ],
            duration: '5-7 days',
            cost: 3200
        },
        'PESTICIDE_RESIDUE_ANALYSIS': {
            name: 'Pesticide Residue Analysis',
            parameters: [
                { key: 'organochlorine', label: 'Organochlorine', unit: 'ppm' },
                { key: 'organophosphorus', label: 'Organophosphorus', unit: 'ppm' },
                { key: 'carbamates', label: 'Carbamates', unit: 'ppm' },
                { key: 'pyrethroids', label: 'Pyrethroids', unit: 'ppm' }
            ],
            duration: '4-6 days',
            cost: 1800
        },
        'ACTIVE_INGREDIENT_ANALYSIS': {
            name: 'Active Ingredient Analysis',
            parameters: [
                { key: 'primaryCompound', label: 'Primary Active Compound', unit: '%' },
                { key: 'secondaryCompound', label: 'Secondary Compound', unit: '%' },
                { key: 'totalPhenolics', label: 'Total Phenolics', unit: 'mg GAE/g' },
                { key: 'totalFlavonoids', label: 'Total Flavonoids', unit: 'mg QE/g' }
            ],
            duration: '7-10 days',
            cost: 3500
        },
        'MOISTURE_CONTENT': {
            name: 'Moisture Content Analysis',
            parameters: [
                { key: 'moisture', label: 'Moisture Content', unit: '%' },
                { key: 'ash', label: 'Total Ash', unit: '%' },
                { key: 'acidInsoluble', label: 'Acid Insoluble Ash', unit: '%' },
                { key: 'foreignMatter', label: 'Foreign Matter', unit: '%' }
            ],
            duration: '2-3 days',
            cost: 2200
        },
        'ADULTERATION_TESTING': {
            name: 'Adulteration Testing',
            parameters: [
                { key: 'authenticityMarkers', label: 'Authenticity Markers', unit: '%' },
                { key: 'foreignSubstances', label: 'Foreign Substances', unit: '%' },
                { key: 'substitution', label: 'Substitution Analysis', unit: '%' },
                { key: 'dilution', label: 'Dilution Assessment', unit: '%' }
            ],
            duration: '4-6 days',
            cost: 2800
        },
        'STABILITY_TESTING': {
            name: 'Stability Testing',
            parameters: [
                { key: 'temperature', label: 'Temperature Stability', unit: '°C' },
                { key: 'humidity', label: 'Humidity Resistance', unit: '%RH' },
                { key: 'lightExposure', label: 'Light Exposure', unit: 'lux·h' },
                { key: 'shelfLife', label: 'Shelf Life', unit: 'months' }
            ],
            duration: '10-14 days',
            cost: 4500
        },
        'STERILITY_TESTING': {
            name: 'Sterility Testing',
            parameters: [
                { key: 'bacterialCount', label: 'Bacterial Count', unit: 'CFU/g' },
                { key: 'fungalCount', label: 'Fungal Count', unit: 'CFU/g' },
                { key: 'pathogenScreen', label: 'Pathogen Screening', unit: 'detected/not detected' },
                { key: 'endotoxin', label: 'Endotoxin Level', unit: 'EU/ml' }
            ],
            duration: '5-7 days',
            cost: 3000
        },
        'CONTAMINATION_TESTING': {
            name: 'Contamination Testing',
            parameters: [
                { key: 'chemicalContaminants', label: 'Chemical Contaminants', unit: 'ppm' },
                { key: 'biologicalContaminants', label: 'Biological Contaminants', unit: 'CFU/g' },
                { key: 'radioactivity', label: 'Radioactivity', unit: 'Bq/kg' },
                { key: 'aflatoxins', label: 'Aflatoxins', unit: 'ppb' }
            ],
            duration: '6-8 days',
            cost: 3800
        },
        'QUALITY_ASSURANCE': {
            name: 'Quality Assurance Testing',
            parameters: [
                { key: 'moisture', label: 'Moisture Content', unit: '%' },
                { key: 'totalAsh', label: 'Total Ash', unit: '%' },
                { key: 'waterSoluble', label: 'Water Soluble Extractive', unit: '%' },
                { key: 'alcoholSoluble', label: 'Alcohol Soluble Extractive', unit: '%' }
            ],
            duration: '4-6 days',
            cost: 2800
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTestForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-fill duration and cost when test type is selected
        if (name === 'testType' && testTypes[value]) {
            setTestForm(prev => ({
                ...prev,
                estimatedDuration: testTypes[value].duration,
                testCost: testTypes[value].cost
            }));
        }
    };

    const handleSubmitTest = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            // Validate required fields
            if (!testForm.sampleName || !testForm.testType || !testForm.sampleType || !testForm.collectionDate) {
                setError('Sample name, test type, sample type, and collection date are required');
                return;
            }

            // Prepare test data for API - matching backend validation schema
            const testData = {
                sampleName: testForm.sampleName,
                sampleType: testForm.sampleType,
                sampleDescription: testForm.notes || `${testForm.sampleType} sample for ${testForm.testType} testing`,
                testType: testForm.testType,
                priority: testForm.priority,
                collectionDate: testForm.collectionDate,
                notes: testForm.notes || '',
                batchNumber: testForm.batchNumber,
                // Try to link to raw material batch if batch number is provided
                ...(testForm.batchNumber && { batchId: testForm.batchNumber })
            };

            console.log('Submitting test data:', testData); // Debug log

            const response = await createLabTest(testData);
            
            if (response.success) {
                setSuccess(`Test ${response.data.id} has been successfully created!`);
                
                // Reset form
                setTestForm({
                    sampleName: '',
                    sampleType: 'RAW_MATERIAL',
                    manufacturer: '',
                    batchNumber: '',
                    sourceType: 'RAW_MATERIAL',
                    testType: '',
                    priority: 'MEDIUM',
                    estimatedDuration: '',
                    testCost: '',
                    collectionDate: '',
                    notes: ''
                });

                // Clear success message after 5 seconds
                setTimeout(() => setSuccess(''), 5000);
            } else {
                setError(response.message || 'Failed to create test');
            }
        } catch (err) {
            console.error('Error creating test:', err);
            setError('Failed to create test. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResultsSubmit = (e) => {
        e.preventDefault();
        // Results entry is now handled in YourTests component
        alert('Test results should be entered from the "Your Tests" section where you can select the specific test.');
        setShowResultsForm(false);
        setTestResults({});
        setSelectedTestType('');
    };

    // QR Scanning Functions
    const startQRScanning = async () => {
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
                    scanForQR();
                }, 100);
            }
        } catch (err) {
            setError('Camera access denied or not available');
            setIsScanning(false);
        }
    };

    const stopQRScanning = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        
        setIsScanning(false);
    };

    const scanForQR = () => {
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
                stopQRScanning();
                handleQRDetected(code.data);
            }
        }
    };

    const handleQRDetected = async (qrData) => {
        setScanLoading(true);
        setError('');
        
        try {
            let qrHash;
            
            try {
                // Try to parse as JSON first (if QR contains JSON data)
                const jsonData = JSON.parse(qrData);
                qrHash = jsonData.qrHash;
                
                if (!qrHash) {
                    throw new Error('qrHash field not found in QR code JSON data');
                }
            } catch (parseError) {
                // If not JSON, treat the entire content as the hash
                qrHash = qrData.trim();
                
                if (!qrHash) {
                    throw new Error('QR code appears to be empty');
                }
            }
            
            console.log('Scanning QR for manufacturer data:', qrHash);
            
            const response = await scanQRCode(qrHash);
            console.log('Manufacturer QR response:', response);
            
            // Extract manufacturer information from the response
            if (response.success && response.data) {
                const data = response.data;
                
                // Auto-fill manufacturer field from various possible sources
                let manufacturerName = '';
                let batchNumber = '';
                
                // Try to get manufacturer from entityData
                if (data.entityData) {
                    manufacturerName = data.entityData.manufacturerName || 
                                     data.entityData.companyName || 
                                     data.entityData.organizationName || '';
                    batchNumber = data.entityData.batchNumber || 
                                 data.entityData.batchId || '';
                }
                
                // Try to get from custom data
                if (!manufacturerName && data.qrCode?.customData) {
                    manufacturerName = data.qrCode.customData.manufacturer || 
                                     data.qrCode.customData.company || 
                                     data.qrCode.customData.organizationName || '';
                }
                
                // Try to get from collection events (farmer/collector info)
                if (!manufacturerName && data.entityData?.collectionEvents?.[0]) {
                    const event = data.entityData.collectionEvents[0];
                    if (event.farmer) {
                        manufacturerName = `${event.farmer.firstName} ${event.farmer.lastName}`.trim();
                    }
                }
                
                // Update the form with extracted data
                setTestForm(prev => ({
                    ...prev,
                    manufacturer: manufacturerName || 'QR Data Retrieved - Please verify',
                    batchNumber: batchNumber || prev.batchNumber,
                    sampleName: manufacturerName ? `${manufacturerName} - ${batchNumber || 'Sample'}` : prev.sampleName
                }));
                
                setSuccess(`QR code scanned successfully! ${manufacturerName ? 'Manufacturer' : 'Data'} auto-filled.`);
                setShowQRModal(false);
                
                // Clear success message after 5 seconds
                setTimeout(() => setSuccess(''), 5000);
            } else {
                setError('No manufacturer data found in QR code');
            }
        } catch (err) {
            console.error('Error processing QR code:', err);
            setError('Failed to process QR code: ' + (err.response?.data?.error || err.message));
        } finally {
            setScanLoading(false);
        }
    };

    const handleFileQRScan = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file (PNG, JPG, etc.)');
            return;
        }

        setScanLoading(true);
        setError('');

        try {
            // Read and decode the QR code from the image file
            const qrCodeData = await readQRCodeFromImage(file);
            console.log('Decoded QR code data:', qrCodeData);
            
            await handleQRDetected(qrCodeData);
        } catch (err) {
            console.error('QR scan error:', err);
            setError('Failed to scan QR code from image: ' + err.message);
        } finally {
            setScanLoading(false);
        }
    };

    const closeQRModal = () => {
        stopQRScanning();
        setShowQRModal(false);
        setIsScanning(false);
    };

    const handleResultChange = (key, value) => {
        setTestResults(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Add Tests</h2>
                <p className="text-gray-600 mt-1">Create new test requests and submit test results</p>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-4">
                <button
                    onClick={() => setShowResultsForm(false)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        !showResultsForm 
                            ? 'bg-cyan-600 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    🧪 New Test Request
                </button>
                <button
                    onClick={() => setShowResultsForm(true)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        showResultsForm 
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    📊 Submit Test Results
                </button>
            </div>

            {!showResultsForm ? (
                /* New Test Request Form */
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">New Test Request</h3>
                        <p className="text-gray-600">Create a new test request for quality analysis</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <button
                                        onClick={() => setError('')}
                                        className="inline-flex text-red-400 hover:text-red-600"
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-800">{success}</p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <button
                                        onClick={() => setSuccess('')}
                                        className="inline-flex text-green-400 hover:text-green-600"
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmitTest} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sample Name *
                                </label>
                                <input
                                    type="text"
                                    name="sampleName"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    placeholder="Enter sample name"
                                    value={testForm.sampleName}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sample Type *
                                </label>
                                <select
                                    name="sampleType"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    value={testForm.sampleType}
                                    onChange={handleInputChange}
                                >
                                    <option value="RAW_MATERIAL">Raw Material</option>
                                    <option value="FINISHED_PRODUCT">Finished Product</option>
                                    <option value="INTERMEDIATE">Intermediate Product</option>
                                    <option value="BULK_POWDER">Bulk Powder</option>
                                    <option value="EXTRACT">Extract</option>
                                    <option value="OIL">Oil</option>
                                    <option value="TABLET">Tablet</option>
                                    <option value="CAPSULE">Capsule</option>
                                    <option value="LIQUID">Liquid</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Manufacturer *
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        name="manufacturer"
                                        required
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        placeholder="Enter manufacturer name or scan QR code"
                                        value={testForm.manufacturer}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowQRModal(true)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                        title="Scan QR Code for Manufacturer Info"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 16h.01M8 12h.01" />
                                        </svg>
                                        <span>QR</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Batch Number *
                                </label>
                                <input
                                    type="text"
                                    name="batchNumber"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    placeholder="Enter batch number"
                                    value={testForm.batchNumber}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sample Source
                                </label>
                                <select
                                    name="sourceType"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    value={testForm.sourceType || 'RAW_MATERIAL'}
                                    onChange={handleInputChange}
                                >
                                    <option value="RAW_MATERIAL">Raw Material Batch</option>
                                    <option value="FINISHED_GOOD">Finished Product</option>
                                    <option value="IN_PROCESS">In-Process Sample</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Select whether this sample is from raw materials, finished products, or in-process materials</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Test Type *
                                </label>
                                <select
                                    name="testType"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    value={testForm.testType}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select test type</option>
                                    {Object.entries(testTypes).map(([key, type]) => (
                                        <option key={key} value={key}>{type.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority *
                                </label>
                                <select
                                    name="priority"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    value={testForm.priority}
                                    onChange={handleInputChange}
                                >
                                    <option value="LOW">Low Priority</option>
                                    <option value="MEDIUM">Medium Priority</option>
                                    <option value="HIGH">High Priority</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Collection Date *
                                </label>
                                <input
                                    type="date"
                                    name="collectionDate"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    value={testForm.collectionDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estimated Duration
                                </label>
                                <input
                                    type="text"
                                    name="estimatedDuration"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    placeholder="e.g., 3-5 days"
                                    value={testForm.estimatedDuration}
                                    onChange={handleInputChange}
                                    readOnly={testForm.testType !== ''}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Test Cost (₹)
                                </label>
                                <input
                                    type="number"
                                    name="testCost"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    placeholder="Enter cost"
                                    value={testForm.testCost}
                                    onChange={handleInputChange}
                                    readOnly={testForm.testType !== ''}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                placeholder="Enter any additional notes or special requirements"
                                value={testForm.notes}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => setTestForm({
                                    productName: '',
                                    manufacturer: '',
                                    batchNumber: '',
                                    testType: '',
                                    priority: 'medium',
                                    estimatedDuration: '',
                                    testCost: '',
                                    sampleReceiveDate: '',
                                    notes: ''
                                })}
                            >
                                Clear Form
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Test...
                                    </div>
                                ) : (
                                    'Create Test Request'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                /* Test Results Form */
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Submit Test Results</h3>
                        <p className="text-gray-600">Enter test results and generate certification</p>
                    </div>

                    {!selectedTestType ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Test Type *
                                </label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={selectedTestType}
                                    onChange={(e) => setSelectedTestType(e.target.value)}
                                    required
                                >
                                    <option value="">Choose test type to enter results</option>
                                    {Object.entries(testTypes).map(([key, type]) => (
                                        <option key={key} value={key}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleResultsSubmit} className="space-y-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-green-800 mb-2">
                                    {testTypes[selectedTestType].name} Results
                                </h4>
                                <p className="text-sm text-green-600">
                                    Enter the test results for all parameters below
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {testTypes[selectedTestType].parameters.map((param) => (
                                    <div key={param.key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {param.label} {param.unit && `(${param.unit})`}
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder={`Enter ${param.label.toLowerCase()} value`}
                                            value={testResults[param.key] || ''}
                                            onChange={(e) => handleResultChange(param.key, e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Test Result *
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        value={testResults.overallResult || ''}
                                        onChange={(e) => handleResultChange('overallResult', e.target.value)}
                                        required
                                    >
                                        <option value="">Select overall result</option>
                                        <option value="passed">Passed ✅</option>
                                        <option value="failed">Failed ❌</option>
                                        <option value="conditional">Conditional Pass ⚠️</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Certification ID
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Auto-generated if passed"
                                        value={testResults.certificationId || ''}
                                        onChange={(e) => handleResultChange('certificationId', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comments/Observations
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter any observations, comments, or recommendations"
                                    value={testResults.comments || ''}
                                    onChange={(e) => handleResultChange('comments', e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                                    onClick={() => {
                                        setSelectedTestType('');
                                        setTestResults({});
                                    }}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                                >
                                    Submit Results & Generate Certificate
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <span className="text-green-600 text-xl">✅</span>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Test results submitted for Chavanprash Premium</p>
                            <p className="text-xs text-gray-600">Certificate CERT-001-2025 generated • 2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-600 text-xl">🧪</span>
                        <div>
                            <p className="text-sm font-medium text-gray-900">New test request created for Ashwagandha Extract</p>
                            <p className="text-xs text-gray-600">Heavy metal testing scheduled • 5 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                        <span className="text-yellow-600 text-xl">⚠️</span>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Test failed for Arjuna Capsules</p>
                            <p className="text-xs text-gray-600">Active compound below threshold • 1 day ago</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* QR Scanning Modal */}
            {showQRModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Scan QR Code for Manufacturer Info</h3>
                            <button
                                onClick={closeQRModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {scanLoading && (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Processing QR code...</p>
                            </div>
                        )}

                        {!scanLoading && (
                            <div className="space-y-6">
                                {/* Camera Scanning */}
                                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                    <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                        <span className="text-2xl mr-2">📷</span>
                                        Camera Scanning
                                    </h4>
                                    
                                    {!isScanning ? (
                                        <button
                                            onClick={startQRScanning}
                                            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Start Camera Scanning
                                        </button>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="relative bg-black rounded-lg overflow-hidden">
                                                <video
                                                    ref={videoRef}
                                                    className="w-full h-64 object-cover"
                                                    autoPlay
                                                    playsInline
                                                />
                                                <canvas
                                                    ref={canvasRef}
                                                    className="hidden"
                                                />
                                                <div className="absolute inset-0 border-4 border-blue-500 border-dashed rounded-lg pointer-events-none">
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                                                        <div className="text-6xl mb-2">📱</div>
                                                        <p>Position QR code in frame</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={stopQRScanning}
                                                className="w-full py-3 px-6 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                Stop Scanning
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* File Upload */}
                                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                    <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                                        <span className="text-2xl mr-2">📁</span>
                                        Upload QR Code Image
                                    </h4>
                                    
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileQRScan}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Choose Image File
                                    </button>
                                </div>

                                {/* Instructions */}
                                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                                    <h4 className="text-lg font-bold text-yellow-900 mb-4 flex items-center">
                                        <span className="text-2xl mr-2">💡</span>
                                        Instructions
                                    </h4>
                                    <ul className="text-yellow-900 space-y-2 text-sm">
                                        <li>• Scan the manufacturer's QR code from their product packaging</li>
                                        <li>• The system will automatically extract manufacturer information</li>
                                        <li>• Ensure good lighting and stable positioning for camera scanning</li>
                                        <li>• For file upload, use clear images of QR codes</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddTests;