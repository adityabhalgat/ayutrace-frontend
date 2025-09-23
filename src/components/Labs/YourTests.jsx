import React, { useState, useEffect } from 'react';
import { getLabTests, deleteLabTest, updateLabTest, getQRCodeImage, generateQRCode, getQRCodeImageUrl, downloadCertificate } from '../../api';
import { useLabsNavigation } from './LabsContext';

const YourTests = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTest, setSelectedTest] = useState(null);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(null);
    
    // Toast state management
    const [toasts, setToasts] = useState([]);
    
    // Test results state
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [selectedTestForResults, setSelectedTestForResults] = useState(null);
    const [testResults, setTestResults] = useState({});
    const [submittingResults, setSubmittingResults] = useState(false);
    
    // Certificate viewing state
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [certificateLoading, setCertificateLoading] = useState(false);

    // Test types configuration for dynamic results entry
    const testTypes = {
        'MICROBIOLOGICAL_TESTING': {
            name: 'Microbiological Testing',
            parameters: [
                { key: 'totalPlateCount', label: 'Total Plate Count', unit: 'CFU/g' },
                { key: 'yeastMold', label: 'Yeast & Mold', unit: 'CFU/g' },
                { key: 'salmonella', label: 'Salmonella', unit: '/25g' },
                { key: 'ecoli', label: 'E. coli', unit: '/g' },
                { key: 'staphylococcus', label: 'Staphylococcus aureus', unit: '/g' }
            ]
        },
        'HEAVY_METALS_ANALYSIS': {
            name: 'Heavy Metals Analysis',
            parameters: [
                { key: 'lead', label: 'Lead (Pb)', unit: 'ppm' },
                { key: 'mercury', label: 'Mercury (Hg)', unit: 'ppm' },
                { key: 'cadmium', label: 'Cadmium (Cd)', unit: 'ppm' },
                { key: 'arsenic', label: 'Arsenic (As)', unit: 'ppm' }
            ]
        },
        'PESTICIDE_RESIDUE_ANALYSIS': {
            name: 'Pesticide Residue Analysis',
            parameters: [
                { key: 'organochlorine', label: 'Organochlorine', unit: 'ppm' },
                { key: 'organophosphorus', label: 'Organophosphorus', unit: 'ppm' },
                { key: 'carbamates', label: 'Carbamates', unit: 'ppm' },
                { key: 'pyrethroids', label: 'Pyrethroids', unit: 'ppm' }
            ]
        },
        'ACTIVE_INGREDIENT_ANALYSIS': {
            name: 'Active Ingredient Analysis',
            parameters: [
                { key: 'primaryCompound', label: 'Primary Active Compound', unit: '%' },
                { key: 'secondaryCompound', label: 'Secondary Compound', unit: '%' },
                { key: 'totalPhenolics', label: 'Total Phenolics', unit: 'mg GAE/g' },
                { key: 'totalFlavonoids', label: 'Total Flavonoids', unit: 'mg QE/g' }
            ]
        },
        'MOISTURE_CONTENT': {
            name: 'Moisture Content Analysis',
            parameters: [
                { key: 'moisture', label: 'Moisture Content', unit: '%' },
                { key: 'ash', label: 'Total Ash', unit: '%' },
                { key: 'acidInsoluble', label: 'Acid Insoluble Ash', unit: '%' },
                { key: 'foreignMatter', label: 'Foreign Matter', unit: '%' }
            ]
        },
        'ADULTERATION_TESTING': {
            name: 'Adulteration Testing',
            parameters: [
                { key: 'artificialColors', label: 'Artificial Colors', unit: 'detected/not detected' },
                { key: 'syntheticCompounds', label: 'Synthetic Compounds', unit: 'detected/not detected' },
                { key: 'foreignSubstances', label: 'Foreign Substances', unit: '%' },
                { key: 'purity', label: 'Purity Level', unit: '%' }
            ]
        },
        'STABILITY_TESTING': {
            name: 'Stability Testing',
            parameters: [
                { key: 'degradation', label: 'Degradation Rate', unit: '%' },
                { key: 'shelfLife', label: 'Predicted Shelf Life', unit: 'months' },
                { key: 'potency', label: 'Potency Retention', unit: '%' },
                { key: 'impurities', label: 'Impurities Formation', unit: '%' }
            ]
        },
        'QUALITY_ASSURANCE': {
            name: 'Quality Assurance Testing',
            parameters: [
                { key: 'moisture', label: 'Moisture Content', unit: '%' },
                { key: 'totalAsh', label: 'Total Ash', unit: '%' },
                { key: 'waterSoluble', label: 'Water Soluble Extractive', unit: '%' },
                { key: 'alcoholSoluble', label: 'Alcohol Soluble Extractive', unit: '%' }
            ]
        }
    };

    // Navigation context
    const { goToAddTests } = useLabsNavigation();

    // Fetch tests from API
    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getLabTests();
            
            if (response.success) {
                setTests(response.data.tests || []);
            } else {
                setError(response.message || 'Failed to fetch tests');
                // Use fallback data on error
                setTests(fallbackTests);
            }
        } catch (err) {
            console.error('Error fetching tests:', err);
            setError('Failed to connect to server');
            // Use fallback data on error
            setTests(fallbackTests);
        } finally {
            setLoading(false);
        }
    };

    // Test Results Functions
    const handleEnterResults = (test) => {
        setSelectedTestForResults(test);
        setTestResults({});
        setShowResultsModal(true);
    };

    const handleResultChange = (key, value) => {
        setTestResults(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSubmitResults = async (e) => {
        e.preventDefault();
        
        if (!selectedTestForResults) return;
        
        try {
            setSubmittingResults(true);
            setError('');

            // Prepare results data according to test type
            const testConfig = testTypes[selectedTestForResults.testType];
            if (!testConfig) {
                throw new Error('Invalid test type');
            }

            // Create results object with all parameters
            const results = {};
            testConfig.parameters.forEach(param => {
                results[param.key] = testResults[param.key] || '';
            });

            // Add overall assessment
            results.overallResult = testResults.overallResult || 'PASS';
            results.methodology = testResults.methodology || '';
            results.equipment = testResults.equipment || '';
            results.technician = testResults.technician || '';

            const updateData = {
                status: 'COMPLETED',
                testDate: new Date().toISOString(),
                completionDate: new Date().toISOString(),
                results: results,
                methodology: testResults.methodology || `Standard ${testConfig.name} procedure`,
                equipment: testResults.equipment || 'Laboratory standard equipment',
                labTechnicianId: testResults.technicianId || undefined
            };

            console.log('Submitting test results:', updateData);

            const response = await updateLabTest(selectedTestForResults.testId || selectedTestForResults.id, updateData);
            
            if (response.success) {
                showSuccess('Test results submitted successfully!');
                setShowResultsModal(false);
                setSelectedTestForResults(null);
                setTestResults({});
                // Refresh the tests list
                fetchTests();
            } else {
                throw new Error(response.message || 'Failed to submit results');
            }
        } catch (err) {
            console.error('Error submitting results:', err);
            setError(err.message || 'Failed to submit test results');
        } finally {
            setSubmittingResults(false);
        }
    };

    const handleDeleteTest = async (testId) => {
        if (!confirm('Are you sure you want to delete this test?')) return;
        
        try {
            setDeleting(testId);
            const response = await deleteLabTest(testId);
            
            if (response.success) {
                setTests(tests.filter(test => test.id !== testId));
                if (selectedTest && selectedTest.id === testId) {
                    setSelectedTest(null);
                }
            } else {
                showError(response.message || 'Failed to delete test');
            }
        } catch (err) {
            console.error('Error deleting test:', err);
            showError('Failed to delete test');
        } finally {
            setDeleting(null);
        }
    };

    // Handler functions for action buttons
    const handleDownloadReport = (test) => {
        showInfo(`Preparing report for test ${test.id}. This feature will be implemented soon.`);
        // TODO: Implement actual report download functionality
        // Could integrate with backend API to generate and download PDF reports
    };

    const handleViewOnBlockchain = (test) => {
        showInfo(`Viewing test ${test.id} on blockchain. This feature will be implemented soon.`);
        // TODO: Implement blockchain viewing functionality
        // Could open a new window/tab with blockchain explorer or dedicated view
    };

    // QR Code state management
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedTestForQR, setSelectedTestForQR] = useState(null);
    const [qrCodeData, setQRCodeData] = useState(null);
    const [qrLoading, setQRLoading] = useState(false);
    const [qrImageUrl, setQrImageUrl] = useState(null);

    // Function to fetch QR image as blob
    const fetchQRImageBlob = async (qrCodeId) => {
        try {
            const response = await fetch(getQRCodeImageUrl(qrCodeId), {
                method: 'GET',
                headers: {
                    'Accept': 'image/png,image/*',
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status}`);
            }
            
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Error fetching QR image blob:', error);
            throw error;
        }
    };

    // Handle QR Code Generation or Display
    const handleViewQRCode = async (test) => {
        console.log('handleViewQRCode called with test:', test);
        console.log('Test supplyChainEventId:', test.supplyChainEventId);
        
        setSelectedTestForQR(test);
        setShowQRModal(true);
        setQRLoading(true);
        setQrImageUrl(null);
        
        if (test.supplyChainEventId) {
            try {
                showInfo('Loading QR code...');
                
                // First, try to get existing QR code (same logic as YourGoodsComponent)
                try {
                    const qrImageResponse = await getQRCodeImage(test.supplyChainEventId);
                    setQRCodeData(qrImageResponse.data);
                    
                    // Fetch the image as blob to avoid CORS issues
                    if (qrImageResponse.data.qrCodeId) {
                        const imageUrl = await fetchQRImageBlob(qrImageResponse.data.qrCodeId);
                        setQrImageUrl(imageUrl);
                    }
                    
                    showSuccess('QR code loaded successfully!');
                } catch (err) {
                    // If no QR code exists, generate a new one
                    const qrData = {
                        entityType: "SUPPLY_CHAIN_EVENT",
                        entityId: test.supplyChainEventId,
                        purpose: "Lab test traceability and authentication",
                        customData: {
                            testInfo: test.sampleName,
                            testType: test.testType,
                            testId: test.testId,
                            status: test.status
                        }
                    };
                    
                    const response = await generateQRCode(qrData);
                    setQRCodeData(response.data);
                    
                    // Fetch the newly generated image as blob
                    if (response.data.qrCodeId) {
                        const imageUrl = await fetchQRImageBlob(response.data.qrCodeId);
                        setQrImageUrl(imageUrl);
                    }
                    
                    showSuccess('QR code generated successfully!');
                }
            } catch (error) {
                console.error('Error handling QR code:', error);
                showError('Failed to handle QR code: ' + error.message);
                setQRCodeData(null);
                setQrImageUrl(null);
            }
        } else {
            showWarning('QR code not yet generated for this test.');
            setQRCodeData(null);
            setQrImageUrl(null);
        }
        
        setQRLoading(false);
    };

    // Close QR Modal
    const closeQRModal = () => {
        setShowQRModal(false);
        setSelectedTestForQR(null);
        setQRCodeData(null);
        
        // Clean up blob URL to prevent memory leaks
        if (qrImageUrl) {
            URL.revokeObjectURL(qrImageUrl);
            setQrImageUrl(null);
        }
    };

    const handleViewCertificate = async (test) => {
        if (test.status === 'COMPLETED') {
            try {
                setCertificateLoading(true);
                
                // Create certificate info for viewing
                const certificateInfo = {
                    testId: test.testId,
                    sampleName: test.sampleName,
                    testType: test.testType,
                    manufacturer: test.manufacturer,
                    submissionDate: test.submissionDate,
                    completionDate: test.completionDate,
                    status: test.status,
                    results: test.results,
                    certificateNumber: test.certificateNumber || `CERT-${test.testId.substring(0, 8)}`,
                    labName: 'AyuTrace Certified Laboratory',
                    generatedAt: new Date().toISOString(),
                    qrCodeData: null,
                    qrImageUrl: null
                };

                // Try to load QR code data for the certificate
                if (test.supplyChainEventId) {
                    try {
                        // First, try to get existing QR code
                        const qrImageResponse = await getQRCodeImage(test.supplyChainEventId);
                        certificateInfo.qrCodeData = qrImageResponse.data;
                        
                        // Fetch the image as blob to avoid CORS issues
                        if (qrImageResponse.data.qrCodeId) {
                            const imageUrl = await fetchQRImageBlob(qrImageResponse.data.qrCodeId);
                            certificateInfo.qrImageUrl = imageUrl;
                        }
                    } catch (err) {
                        // If no QR code exists, generate a new one
                        try {
                            const qrData = {
                                entityType: "SUPPLY_CHAIN_EVENT",
                                entityId: test.supplyChainEventId,
                                purpose: "Lab test traceability and authentication",
                                customData: {
                                    testInfo: test.sampleName,
                                    testType: test.testType,
                                    testId: test.testId,
                                    status: test.status
                                }
                            };
                            
                            const response = await generateQRCode(qrData);
                            certificateInfo.qrCodeData = response.data;
                            
                            // Fetch the newly generated image as blob
                            if (response.data.qrCodeId) {
                                const imageUrl = await fetchQRImageBlob(response.data.qrCodeId);
                                certificateInfo.qrImageUrl = imageUrl;
                            }
                        } catch (genError) {
                            console.warn('Could not generate QR code for certificate:', genError);
                        }
                    }
                }

                setSelectedCertificate(certificateInfo);
                setShowCertificateModal(true);
                showSuccess('Certificate loaded successfully!');
            } catch (error) {
                console.error('Error loading certificate:', error);
                showError('Failed to load certificate. Please try again.');
            } finally {
                setCertificateLoading(false);
            }
        } else {
            showWarning('Certificate is only available for completed tests.');
        }
    };

    const handleDownloadCertificate = async (test) => {
        try {
            if (test.status === 'COMPLETED') {
                showInfo(`Preparing certificate download for test ${test.testId}...`);
                
                // Use the new downloadCertificate API function
                const blob = await downloadCertificate(test.testId);
                
                // Verify the blob is valid
                if (!blob || blob.size === 0) {
                    throw new Error('Received empty certificate file');
                }
                
                // Create download link safely
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `certificate_${test.testId}.pdf`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                
                // Clean up safely
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    // Check if element is still in DOM before removing
                    if (a.parentNode) {
                        a.parentNode.removeChild(a);
                    }
                }, 100);
                
                showSuccess('Certificate downloaded successfully!');
            } else {
                showWarning('Certificate is only available for completed tests.');
            }
        } catch (error) {
            console.error('Error downloading certificate:', error);
            showError(`Failed to download certificate: ${error.message}`);
        }
    };

    // Status update handlers
    const handleStartTest = async (test) => {
        try {
            const updateData = {
                status: 'IN_PROGRESS',
                testDate: new Date().toISOString()
            };
            
            const updatedTest = await updateLabTest(test.testId, updateData);
            if (updatedTest) {
                // Refresh the tests list
                fetchTests();
                showSuccess(`Test ${test.testId} has been started successfully!`);
            }
        } catch (error) {
            console.error('Error starting test:', error);
            showError('Failed to start test. Please try again.');
        }
    };

    const handleViewAllEvents = (test) => {
        // TODO: Implement comprehensive supply chain event viewer
        const eventInfo = `Supply Chain Events for Test ${test.testId}:\n\n`;
        let events = `1. Test Created: ${test.createdAt ? new Date(test.createdAt).toLocaleString() : 'N/A'}\n`;
        
        if (test.testDate) {
            events += `2. Testing Started: ${new Date(test.testDate).toLocaleString()}\n`;
        }
        
        if (test.completionDate) {
            events += `3. Test Completed: ${new Date(test.completionDate).toLocaleString()}\n`;
            events += `4. Certificate Generated: ${new Date(test.completionDate).toLocaleString()}\n`;
            events += `5. QR Code Created: ${new Date(test.completionDate).toLocaleString()}\n`;
        }
        
        if (test.supplyChainEvent) {
            events += `\nSupply Chain Event ID: ${test.supplyChainEvent.eventId}\n`;
            events += `Event Type: ${test.supplyChainEvent.eventType}\n`;
        }
        
        showInfo('Supply chain details will be shown in detailed event viewer (coming soon).');
    };    // Fallback test data for when API is not available or fails
    const fallbackTests = [
        {
            id: 'TEST-001',
            productName: 'Chavanprash Premium',
            manufacturer: 'AyuVeda Industries',
            testType: 'Microbiological Analysis',
            status: 'completed',
            result: 'passed',
            startDate: '2025-09-10',
            completionDate: '2025-09-14',
            priority: 'high',
            batchNumber: 'CH-2025-001',
            testDetails: {
                totalPlateCount: '< 10^3 CFU/g',
                yeastMold: '< 10^2 CFU/g',
                salmonella: 'Absent/25g',
                ecoli: 'Absent/g',
                staphylococcus: 'Absent/g'
            },
            certificationId: 'CERT-001-2025',
            testCost: 2500
        },
        {
            id: 'TEST-002',
            productName: 'Ashwagandha Extract',
            manufacturer: 'Herbal Solutions Ltd',
            testType: 'Heavy Metal Testing',
            status: 'in-progress',
            result: 'pending',
            startDate: '2025-09-13',
            completionDate: null,
            priority: 'medium',
            batchNumber: 'AS-2025-087',
            testDetails: {
                lead: 'Testing in progress',
                mercury: 'Testing in progress',
                cadmium: 'Testing in progress',
                arsenic: 'Testing in progress'
            },
            estimatedCompletion: '2025-09-16',
            testCost: 3200
        },
        {
            id: 'TEST-003',
            productName: 'Triphala Powder',
            manufacturer: 'Natural Remedies Co',
            testType: 'Pesticide Residue',
            status: 'completed',
            result: 'passed',
            startDate: '2025-09-11',
            completionDate: '2025-09-13',
            priority: 'low',
            batchNumber: 'TR-2025-045',
            testDetails: {
                organochlorine: 'Below detection limit',
                organophosphorus: 'Below detection limit',
                carbamates: 'Below detection limit',
                pyrethroids: 'Below detection limit'
            },
            certificationId: 'CERT-003-2025',
            testCost: 1800
        },
        {
            id: 'TEST-004',
            productName: 'Brahmi Oil',
            manufacturer: 'Wellness Corp',
            testType: 'Purity Analysis',
            status: 'pending',
            result: 'pending',
            startDate: '2025-09-12',
            completionDate: null,
            priority: 'high',
            batchNumber: 'BR-2025-023',
            testDetails: {},
            estimatedStart: '2025-09-15',
            testCost: 2200
        },
        {
            id: 'TEST-005',
            productName: 'Arjuna Capsules',
            manufacturer: 'AyuVeda Industries',
            testType: 'Active Compound Analysis',
            status: 'completed',
            result: 'failed',
            startDate: '2025-09-08',
            completionDate: '2025-09-12',
            priority: 'high',
            batchNumber: 'AR-2025-067',
            testDetails: {
                arjunolicAcid: '1.2% (Below required 2.5%)',
                arjunetin: '0.8% (Below required 1.5%)',
                arjunosides: '2.1% (Within range)',
                totalPhenolics: '15.2mg GAE/g'
            },
            certificationId: null,
            testCost: 3500,
            failureReason: 'Active compound concentration below specified limits'
        }
    ];

    const filteredTests = tests.filter(test => {
        const searchString = searchTerm.toLowerCase();
        const matchesSearch = 
            (test.productName || test.sampleId || '').toLowerCase().includes(searchString) ||
            (test.testType || '').toLowerCase().includes(searchString) ||
            (test.batchNumber || '').toLowerCase().includes(searchString);
        
        const testStatus = (test.status || '').toLowerCase();
        const matchesStatus = statusFilter === 'all' || testStatus === statusFilter || 
                             (statusFilter === 'in-progress' && testStatus === 'in_progress');
        
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        const statusLower = (status || '').toLowerCase();
        switch (statusLower) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in_progress':
            case 'in-progress': return 'bg-yellow-100 text-yellow-800';
            case 'pending': return 'bg-orange-100 text-orange-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'cancelled': return 'bg-gray-100 text-gray-800';
            case 'requires_retest': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getResultColor = (result) => {
        const resultLower = (result || '').toLowerCase();
        switch (resultLower) {
            case 'pass':
            case 'passed': return 'bg-green-100 text-green-800';
            case 'fail':
            case 'failed': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        const priorityLower = (priority || '').toLowerCase();
        switch (priorityLower) {
            case 'urgent':
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Progress-related helper functions
    const getProgressPercentage = (test) => {
        const status = (test.status || '').toLowerCase();
        switch (status) {
            case 'pending': return 25;
            case 'in_progress':
            case 'in-progress': return 60;
            case 'completed': return 100;
            case 'rejected':
            case 'cancelled': return 0;
            default: return 10;
        }
    };

    const getProgressColor = (status) => {
        const statusLower = (status || '').toLowerCase();
        switch (statusLower) {
            case 'completed': return 'bg-green-500';
            case 'in_progress':
            case 'in-progress': return 'bg-yellow-500';
            case 'pending': return 'bg-blue-500';
            case 'rejected':
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    // Toast utility functions
    const addToast = (message, type = 'info') => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            message,
            type, // 'success', 'error', 'warning', 'info'
            timestamp: new Date()
        };
        
        setToasts(prev => [...prev, newToast]);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
        
        return id;
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const showSuccess = (message) => addToast(message, 'success');
    const showError = (message) => addToast(message, 'error');
    const showWarning = (message) => addToast(message, 'warning');
    const showInfo = (message) => addToast(message, 'info');

    const getTestTypeDisplay = (testType) => {
        if (!testType) return 'Unknown Test';
        return testType
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const TestModal = ({ test, onClose }) => {
        if (!test) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Test Details - {test.testId || test.id}</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Sample Name</label>
                                    <p className="text-lg font-semibold text-gray-900">{test.sampleName || test.productName || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Sample Type</label>
                                    <p className="text-gray-900">{test.sampleType || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Sample Description</label>
                                    <p className="text-gray-900">{test.sampleDescription || test.notes || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Requester</label>
                                    <p className="text-gray-900">{test.requester ? `${test.requester.firstName} ${test.requester.lastName}` : test.manufacturer || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Batch Number</label>
                                    <p className="text-gray-900 font-mono">{test.batchNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Test Type</label>
                                    <p className="text-gray-900">{getTestTypeDisplay(test.testType) || test.testType || 'N/A'}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Status</label>
                                    <div>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(test.status)}`}>
                                            {(test.status || 'PENDING').replace('-', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Result</label>
                                    <div>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getResultColor(test.result)}`}>
                                            {(test.result || 'PENDING').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Priority</label>
                                    <div>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(test.priority)}`}>
                                            {(test.priority || 'MEDIUM').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Test Cost</label>
                                    <p className="text-gray-900 font-semibold">₹{(test.testCost || test.cost || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Batch/Product Information */}
                        {(test.batch || test.finishedGood || test.supplyChainEvent) && (
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-3 block">Linked Information</label>
                                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                                    {test.batch && (
                                        <div>
                                            <p className="text-sm text-gray-600">Raw Material Batch</p>
                                            <p className="font-semibold text-gray-900">{test.batch.herbName}</p>
                                            <p className="text-sm text-gray-600">Batch ID: {test.batch.batchId}</p>
                                            <p className="text-sm text-gray-600">Quantity: {test.batch.quantity} kg</p>
                                        </div>
                                    )}
                                    {test.finishedGood && (
                                        <div>
                                            <p className="text-sm text-gray-600">Finished Product</p>
                                            <p className="font-semibold text-gray-900">{test.finishedGood.productName}</p>
                                            <p className="text-sm text-gray-600">Product ID: {test.finishedGood.productId}</p>
                                            <p className="text-sm text-gray-600">Quantity: {test.finishedGood.quantity} units</p>
                                        </div>
                                    )}
                                    {test.supplyChainEvent && (
                                        <div>
                                            <p className="text-sm text-gray-600">Supply Chain Event</p>
                                            <p className="font-semibold text-gray-900">{test.supplyChainEvent.eventType}</p>
                                            <p className="text-sm text-gray-600">Event ID: {test.supplyChainEvent.eventId}</p>
                                            <p className="text-sm text-gray-600">Timestamp: {new Date(test.supplyChainEvent.timestamp).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-3 block">Timeline</label>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Collection Date</p>
                                        <p className="font-semibold">{test.collectionDate ? new Date(test.collectionDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Test Date</p>
                                        <p className="font-semibold">{test.testDate ? new Date(test.testDate).toLocaleDateString() : 'Not Started'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Completion Date</p>
                                        <p className="font-semibold">{test.completionDate ? new Date(test.completionDate).toLocaleDateString() : 'In Progress'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Test Results */}
                        {test.results && Object.keys(test.results).length > 0 ? (
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-3 block">Test Results</label>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(test.results).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                </span>
                                                <span className="font-semibold text-gray-900">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : test.testDetails && Object.keys(test.testDetails).length > 0 ? (
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-3 block">Test Results</label>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(test.testDetails).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                </span>
                                                <span className="font-semibold text-gray-900">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {/* Additional Information */}
                        {(test.notes || test.methodology || test.equipment) && (
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-3 block">Additional Information</label>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    {test.notes && (
                                        <div>
                                            <p className="text-sm text-gray-600">Notes</p>
                                            <p className="text-gray-900">{test.notes}</p>
                                        </div>
                                    )}
                                    {test.methodology && (
                                        <div>
                                            <p className="text-sm text-gray-600">Methodology</p>
                                            <p className="text-gray-900">{test.methodology}</p>
                                        </div>
                                    )}
                                    {test.equipment && (
                                        <div>
                                            <p className="text-sm text-gray-600">Equipment Used</p>
                                            <p className="text-gray-900">{test.equipment}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* QR Code Section */}
                        {(test.supplyChainEvent || test.status === 'COMPLETED') && (
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-3 block">QR Code & Traceability</label>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-blue-800">QR Code Generated</p>
                                                <p className="text-sm text-blue-600">
                                                    Supply Chain Event: {test.supplyChainEvent?.eventId || 'Generating...'}
                                                </p>
                                                {test.supplyChainEvent?.timestamp && (
                                                    <p className="text-xs text-blue-500">
                                                        Generated: {new Date(test.supplyChainEvent.timestamp).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => {
                                                    console.log('View QR button clicked for test:', test);
                                                    handleViewQRCode(test);
                                                }}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                                            >
                                                View QR
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Certification */}
                        {(test.certificateNumber || test.certificates?.length > 0 || test.status === 'COMPLETED') && (
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-3 block">Certification</label>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <span className="text-green-600 text-xl">🏆</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-green-800">
                                                    {test.status === 'COMPLETED' ? 'Certificate Available' : 'Certificate Issued'}
                                                </p>
                                                <p className="text-sm text-green-600">
                                                    Certificate Number: {test.certificateNumber || (test.certificates?.[0]?.certificateNumber) || 'Auto-Generated'}
                                                </p>
                                                {test.certificates?.[0]?.certificateType && (
                                                    <p className="text-sm text-green-600">
                                                        Type: {test.certificates[0].certificateType.replace(/_/g, ' ')}
                                                    </p>
                                                )}
                                                {test.status === 'COMPLETED' && (
                                                    <p className="text-xs text-green-500">
                                                        Certificate automatically generated upon completion
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {test.status === 'COMPLETED' && (
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => handleViewCertificate(test)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                                                >
                                                    View
                                                </button>
                                                <button 
                                                    onClick={() => handleDownloadCertificate(test)}
                                                    className="bg-green-100 hover:bg-green-200 text-green-600 px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                                                >
                                                    Download
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Supply Chain Event Timeline */}
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-3 block">Supply Chain Timeline</label>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="space-y-4">
                                    {/* Test Created Event */}
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-gray-900">Test Created</h4>
                                                <span className="text-xs text-gray-500">
                                                    {test.createdAt ? new Date(test.createdAt).toLocaleString() : new Date(test.collectionDate).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">Lab test initiated for {test.sampleName}</p>
                                            {test.supplyChainEvent && (
                                                <p className="text-xs text-blue-600">Event ID: {test.supplyChainEvent.eventId}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Test Started Event */}
                                    {test.testDate && (
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900">Testing Started</h4>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(test.testDate).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">Laboratory testing commenced</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Test Completed Event */}
                                    {test.completionDate && test.status === 'COMPLETED' && (
                                        <div className="flex items-start space-x-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900">Test Completed</h4>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(test.completionDate).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">Testing completed successfully</p>
                                                <div className="mt-1 text-xs text-green-600">
                                                    ✓ Certificate Generated ✓ QR Code Created
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Future Events Placeholder */}
                                    {test.status !== 'COMPLETED' && (
                                        <div className="flex items-start space-x-3 opacity-50">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-400">Awaiting Completion</h4>
                                                <p className="text-sm text-gray-400">Certificate and QR code will be generated upon completion</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* View All Events Link */}
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                    <button 
                                        onClick={() => handleViewAllEvents(test)}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        View All Supply Chain Events →
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Failure Reason */}
                        {test.failureReason && (
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-3 block">Failure Reason</label>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-800">{test.failureReason}</p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => handleDownloadReport(test)}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                Download Report
                            </button>
                            {test.certificationId && (
                                <button 
                                    onClick={() => handleDownloadCertificate(test)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                                >
                                    Download Certificate
                                </button>
                            )}
                            <button 
                                onClick={() => handleViewOnBlockchain(test)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                View on Blockchain
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-lg animate-pulse p-6">
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Your Tests</h2>
                        <p className="text-gray-600 mt-1">Manage and review all laboratory tests</p>
                    </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error loading tests</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={fetchTests}
                                    className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Your Tests</h2>
                    <p className="text-gray-600 mt-1">Manage and review all laboratory tests</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <div>
                        <span className="text-sm text-gray-600">Total Tests: </span>
                        <span className="font-semibold text-cyan-600">{tests.length}</span>
                    </div>
                    <button
                        onClick={goToAddTests}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
                    >
                        ➕ Create New Test
                    </button>
                </div>
            </div>

            {/* Automation Information Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-blue-800 mb-1">Automated Lab Testing Workflow</h3>
                        <p className="text-sm text-blue-700 mb-2">
                            Our system automatically handles the complete testing lifecycle for maximum efficiency and traceability.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-blue-700">Auto Supply Chain Events</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-blue-700">Auto Certificate Generation</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span className="text-blue-700">Auto QR Code Creation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by product name, manufacturer, test type, or batch number..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tests List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6">
                    <div className="space-y-4">
                        {filteredTests.map((test) => (
                            <div key={test.testId || test.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {test.sampleName || test.batch?.herbName || test.finishedGood?.productName || `Sample ${test.testId}`}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                                            {(test.status || 'PENDING').replace(/_/g, ' ').toUpperCase()}
                                        </span>
                                        {test.result && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getResultColor(test.result)}`}>
                                                {test.result.toUpperCase()}
                                            </span>
                                        )}
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(test.priority)}`}>
                                            {(test.priority || 'MEDIUM').toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Test ID</p>
                                        <p className="font-mono text-sm text-gray-900">{test.id}</p>
                                    </div>
                                </div>
                                
                                {/* Progress Indicator */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                        <span>Progress</span>
                                        <span>{getProgressPercentage(test)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(test.status)}`}
                                            style={{ width: `${getProgressPercentage(test)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span className={test.status === 'PENDING' ? 'font-medium text-blue-600' : ''}>Created</span>
                                        <span className={test.status === 'IN_PROGRESS' ? 'font-medium text-yellow-600' : ''}>Testing</span>
                                        <span className={test.status === 'COMPLETED' ? 'font-medium text-green-600' : ''}>Completed</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Test Type</p>
                                        <p className="font-medium text-gray-900">{getTestTypeDisplay(test.testType)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Batch Number</p>
                                        <p className="font-mono text-sm text-gray-900">{test.batchNumber || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            {test.completedAt ? 'Completed' : 'Started'}
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {formatDate(test.completedAt || test.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {test.testCost && (
                                            <span className="text-sm text-gray-600">Cost: ₹{test.testCost.toLocaleString()}</span>
                                        )}
                                        {test.certificationId && (
                                            <span className="text-sm text-green-600 font-medium">✓ Certified</span>
                                        )}
                                        {test.qrCodeData && (
                                            <span className="text-sm text-blue-600 font-medium">🔗 QR Available</span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setSelectedTest(test)}
                                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                        >
                                            View Details
                                        </button>
                                        
                                        {/* Status-specific actions */}
                                        {test.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleStartTest(test)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                                >
                                                    Start Test
                                                </button>
                                                <button
                                                    onClick={() => handleEnterResults(test)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                                >
                                                    Enter Results
                                                </button>
                                            </>
                                        )}
                                        
                                        {test.status === 'IN_PROGRESS' && (
                                            <button
                                                onClick={() => handleEnterResults(test)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                            >
                                                Complete Test
                                            </button>
                                        )}
                                        
                                        {test.status === 'COMPLETED' && (
                                            <>
                                                <button
                                                    onClick={() => handleViewCertificate(test)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                                >
                                                    View Certificate
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        console.log('View QR button clicked (second location) for test:', test);
                                                        handleViewQRCode(test);
                                                    }}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                                >
                                                    View QR
                                                </button>
                                            </>
                                        )}
                                        
                                        <button
                                            onClick={() => handleDeleteTest(test.id)}
                                            disabled={deleting === test.id}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                                        >
                                            {deleting === test.id ? '...' : '🗑️'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Test Detail Modal */}
            {selectedTest && (
                <TestModal test={selectedTest} onClose={() => setSelectedTest(null)} />
            )}

            {/* Test Results Entry Modal */}
            {showResultsModal && selectedTestForResults && (
                <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Enter Test Results
                                </h2>
                                <button
                                    onClick={() => setShowResultsModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold text-blue-800 mb-2">
                                    Test: {testTypes[selectedTestForResults.testType]?.name || selectedTestForResults.testType}
                                </h3>
                                <p className="text-sm text-blue-600">
                                    Sample: {selectedTestForResults.sampleName} | Batch: {selectedTestForResults.batchNumber}
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <p className="text-red-800">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmitResults} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {testTypes[selectedTestForResults.testType]?.parameters.map((param) => (
                                        <div key={param.key}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {param.label} {param.unit && `(${param.unit})`}
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder={`Enter ${param.label.toLowerCase()}`}
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
                                            Overall Result *
                                        </label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            value={testResults.overallResult || 'PASS'}
                                            onChange={(e) => handleResultChange('overallResult', e.target.value)}
                                            required
                                        >
                                            <option value="PASS">PASS</option>
                                            <option value="FAIL">FAIL</option>
                                            <option value="REQUIRES_RETEST">REQUIRES RETEST</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Equipment Used
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="e.g., HPLC, Spectrophotometer"
                                            value={testResults.equipment || ''}
                                            onChange={(e) => handleResultChange('equipment', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Methodology/Comments
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Describe the testing methodology used or add any comments..."
                                        value={testResults.methodology || ''}
                                        onChange={(e) => handleResultChange('methodology', e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setShowResultsModal(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submittingResults}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        {submittingResults ? 'Submitting...' : 'Submit Results'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Certificate Viewing Modal */}
            {showCertificateModal && selectedCertificate && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setShowCertificateModal(false)}
                >
                    <div 
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            width: '90%',
                            maxWidth: '800px',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            margin: '20px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Certificate Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '24px',
                            borderRadius: '12px 12px 0 0',
                            textAlign: 'center'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                                AyuTrace Laboratory Certificate
                            </h2>
                            <p style={{ margin: '8px 0 0 0', fontSize: '16px', opacity: 0.9 }}>
                                Certificate of Analysis
                            </p>
                        </div>

                        {/* Certificate Content */}
                        <div style={{ padding: '32px' }}>
                            {/* Certificate Number and Date */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '24px',
                                paddingBottom: '16px',
                                borderBottom: '2px solid #e2e8f0'
                            }}>
                                <div>
                                    <strong>Certificate Number:</strong>
                                    <div style={{ fontSize: '18px', color: '#4a5568', marginTop: '4px' }}>
                                        {selectedCertificate.certificateNumber}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <strong>Issue Date:</strong>
                                    <div style={{ fontSize: '18px', color: '#4a5568', marginTop: '4px' }}>
                                        {new Date(selectedCertificate.completionDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Test Information */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ 
                                    fontSize: '20px', 
                                    fontWeight: 'bold', 
                                    color: '#2d3748',
                                    marginBottom: '16px',
                                    borderBottom: '1px solid #cbd5e0',
                                    paddingBottom: '8px'
                                }}>
                                    Test Information
                                </h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: '16px'
                                }}>
                                    <div>
                                        <strong>Sample Name:</strong>
                                        <div style={{ marginTop: '4px', color: '#4a5568' }}>
                                            {selectedCertificate.sampleName}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Test Type:</strong>
                                        <div style={{ marginTop: '4px', color: '#4a5568' }}>
                                            {selectedCertificate.testType.replace(/_/g, ' ')}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Manufacturer:</strong>
                                        <div style={{ marginTop: '4px', color: '#4a5568' }}>
                                            {selectedCertificate.manufacturer}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Test ID:</strong>
                                        <div style={{ marginTop: '4px', color: '#4a5568', fontFamily: 'monospace' }}>
                                            {selectedCertificate.testId}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Test Results */}
                            {selectedCertificate.results && (
                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{ 
                                        fontSize: '20px', 
                                        fontWeight: 'bold', 
                                        color: '#2d3748',
                                        marginBottom: '16px',
                                        borderBottom: '1px solid #cbd5e0',
                                        paddingBottom: '8px'
                                    }}>
                                        Test Results
                                    </h3>
                                    <div style={{
                                        backgroundColor: '#f7fafc',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        {Object.entries(selectedCertificate.results).map(([key, value]) => (
                                            <div key={key} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '8px 0',
                                                borderBottom: '1px solid #e2e8f0'
                                            }}>
                                                <span style={{ fontWeight: '500' }}>
                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                                </span>
                                                <span style={{ color: '#4a5568' }}>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Test Timeline */}
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{ 
                                    fontSize: '20px', 
                                    fontWeight: 'bold', 
                                    color: '#2d3748',
                                    marginBottom: '16px',
                                    borderBottom: '1px solid #cbd5e0',
                                    paddingBottom: '8px'
                                }}>
                                    Test Timeline
                                </h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '16px'
                                }}>
                                    <div>
                                        <strong>Submission Date:</strong>
                                        <div style={{ marginTop: '4px', color: '#4a5568' }}>
                                            {new Date(selectedCertificate.submissionDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Completion Date:</strong>
                                        <div style={{ marginTop: '4px', color: '#4a5568' }}>
                                            {new Date(selectedCertificate.completionDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Status:</strong>
                                        <div style={{ 
                                            marginTop: '4px', 
                                            color: selectedCertificate.status === 'COMPLETED' ? '#38a169' : '#4a5568',
                                            fontWeight: '500'
                                        }}>
                                            {selectedCertificate.status}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Laboratory Information */}
                            <div style={{
                                backgroundColor: '#edf2f7',
                                padding: '16px',
                                borderRadius: '8px',
                                textAlign: 'center',
                                marginBottom: '24px'
                            }}>
                                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
                                    {selectedCertificate.labName}
                                </div>
                                <div style={{ color: '#4a5568', fontSize: '14px' }}>
                                    Certified Laboratory • AyuTrace Supply Chain Network
                                </div>
                                <div style={{ color: '#4a5568', fontSize: '12px', marginTop: '4px' }}>
                                    This certificate is digitally verified and blockchain-secured
                                </div>
                            </div>

                            {/* QR Code Section */}
                            <div style={{
                                backgroundColor: '#f0f9ff',
                                padding: '20px',
                                borderRadius: '12px',
                                textAlign: 'center',
                                marginBottom: '24px',
                                border: '2px solid #0ea5e9'
                            }}>
                                <h3 style={{ 
                                    fontSize: '18px', 
                                    fontWeight: 'bold', 
                                    color: '#0c4a6e',
                                    marginBottom: '16px'
                                }}>
                                    Digital Verification
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '24px',
                                    flexWrap: 'wrap'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{
                                            width: '120px',
                                            height: '120px',
                                            backgroundColor: 'white',
                                            border: '2px solid #e2e8f0',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 12px',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            {selectedCertificate.qrImageUrl ? (
                                                <img 
                                                    src={selectedCertificate.qrImageUrl}
                                                    alt="Certificate QR Code" 
                                                    style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    backgroundColor: '#f8fafc',
                                                    border: '1px solid #cbd5e0',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '12px',
                                                    color: '#64748b',
                                                    textAlign: 'center',
                                                    padding: '8px'
                                                }}>
                                                    QR Code Loading...
                                                </div>
                                            )}
                                        </div>
                                        {selectedCertificate.qrCodeData ? (
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => {
                                                        // Find the test object that matches the certificate
                                                        const test = tests.find(t => t.testId === selectedCertificate.testId);
                                                        if (test) {
                                                            setShowCertificateModal(false);
                                                            handleViewQRCode(test);
                                                        } else {
                                                            showError('Test not found for QR code generation');
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '6px 12px',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        backgroundColor: '#0ea5e9',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        fontSize: '11px',
                                                        fontWeight: '500',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = '#0284c7'}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = '#0ea5e9'}
                                                >
                                                    Enlarge
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (selectedCertificate.qrImageUrl) {
                                                            const link = document.createElement('a');
                                                            link.href = selectedCertificate.qrImageUrl;
                                                            link.download = `certificate_qr_${selectedCertificate.testId}.png`;
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            // Safe removal check
                                                            if (link.parentNode) {
                                                                link.parentNode.removeChild(link);
                                                            }
                                                            showSuccess('QR code downloaded successfully!');
                                                        } else {
                                                            showError('QR code image not available for download');
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '6px 12px',
                                                        border: '1px solid #0ea5e9',
                                                        borderRadius: '4px',
                                                        backgroundColor: 'white',
                                                        color: '#0ea5e9',
                                                        cursor: 'pointer',
                                                        fontSize: '11px',
                                                        fontWeight: '500',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.target.style.backgroundColor = '#0ea5e9';
                                                        e.target.style.color = 'white';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.target.style.backgroundColor = 'white';
                                                        e.target.style.color = '#0ea5e9';
                                                    }}
                                                >
                                                    Download QR
                                                </button>
                                            </div>
                                        ) : (
                                            <div style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#fef3c7',
                                                color: '#92400e',
                                                borderRadius: '4px',
                                                fontSize: '11px',
                                                fontWeight: '500'
                                            }}>
                                                QR Unavailable
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: '200px', textAlign: 'left' }}>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: '#0c4a6e',
                                            marginBottom: '8px'
                                        }}>
                                            🔍 Scan on website for detailed information
                                        </div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#64748b',
                                            lineHeight: '1.5',
                                            marginBottom: '12px'
                                        }}>
                                            Use the QR code above to verify this certificate and access complete test details on the AyuTrace verification portal.
                                        </div>
                                        <div style={{
                                            backgroundColor: 'white',
                                            padding: '12px',
                                            borderRadius: '6px',
                                            border: '1px solid #cbd5e0'
                                        }}>
                                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                                Certificate ID:
                                            </div>
                                            <div style={{ 
                                                fontSize: '14px', 
                                                fontFamily: 'monospace', 
                                                color: '#374151',
                                                fontWeight: '500'
                                            }}>
                                                {selectedCertificate.certificateNumber}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    marginTop: '16px',
                                    padding: '12px',
                                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    color: '#0c4a6e'
                                }}>
                                    <strong>🛡️ Blockchain Secured:</strong> This certificate is immutably recorded on blockchain for tamper-proof verification
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '12px',
                                flexWrap: 'wrap'
                            }}>
                                <button
                                    onClick={() => setShowCertificateModal(false)}
                                    style={{
                                        padding: '12px 24px',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '8px',
                                        backgroundColor: 'white',
                                        color: '#4a5568',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        minWidth: '120px'
                                    }}
                                >
                                    Close
                                </button>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => {
                                            const test = { 
                                                testId: selectedCertificate.testId, 
                                                status: selectedCertificate.status 
                                            };
                                            handleDownloadCertificate(test);
                                        }}
                                        style={{
                                            padding: '12px 20px',
                                            border: 'none',
                                            borderRadius: '8px',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            minWidth: '140px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                        </svg>
                                        Download PDF
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Print the certificate
                                            window.print();
                                        }}
                                        style={{
                                            padding: '12px 20px',
                                            border: '2px solid #667eea',
                                            borderRadius: '8px',
                                            backgroundColor: 'white',
                                            color: '#667eea',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            minWidth: '100px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor = '#667eea';
                                            e.target.style.color = 'white';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor = 'white';
                                            e.target.style.color = '#667eea';
                                        }}
                                    >
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                                            <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
                                        </svg>
                                        Print
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Toast Container */}
            <div 
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}
            >
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            backgroundColor: 
                                toast.type === 'success' ? '#10b981' :
                                toast.type === 'error' ? '#ef4444' :
                                toast.type === 'warning' ? '#f59e0b' :
                                '#3b82f6',
                            color: 'white',
                            fontWeight: '500',
                            fontSize: '14px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            minWidth: '300px',
                            maxWidth: '400px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            animation: 'slideIn 0.3s ease-out',
                            position: 'relative'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{toast.message}</span>
                            <button
                                onClick={() => removeToast(toast.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    marginLeft: '10px',
                                    opacity: 0.7,
                                    padding: '0 4px'
                                }}
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>

            {/* QR Code Modal */}
            {showQRModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">QR Code for Test</h3>
                            <button
                                onClick={closeQRModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {selectedTestForQR && (
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">{selectedTestForQR.sampleName}</p>
                                
                                {qrLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                        <span className="ml-3 text-gray-600">Loading QR code...</span>
                                    </div>
                                ) : qrCodeData ? (
                                    <div className="space-y-4">
                                        <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                                            {qrImageUrl ? (
                                                <img 
                                                    src={qrImageUrl}
                                                    alt="QR Code" 
                                                    className="w-48 h-48 mx-auto border border-gray-300 rounded"
                                                />
                                            ) : (
                                                <div className="w-48 h-48 mx-auto border border-gray-300 rounded flex items-center justify-center bg-gray-50">
                                                    <p className="text-gray-500 text-sm">Loading QR image...</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="text-sm text-gray-500 space-y-1">
                                            <p>QR Code ID: {qrCodeData.qrCodeId || qrCodeData.id || 'N/A'}</p>
                                            <p>Created: {qrCodeData.createdAt ? new Date(qrCodeData.createdAt).toLocaleString() : 'N/A'}</p>
                                            <p>Scans: {qrCodeData.scanCount || 0}</p>
                                            {qrCodeData.qrHash && <p>Hash: {qrCodeData.qrHash.substring(0, 16)}...</p>}
                                        </div>
                                        
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => {
                                                    if (qrImageUrl) {
                                                        const link = document.createElement('a');
                                                        link.href = qrImageUrl;
                                                        link.download = `qr_code_${selectedTestForQR.testId}.png`;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        // Safe removal check
                                                        if (link.parentNode) {
                                                            link.parentNode.removeChild(link);
                                                        }
                                                        showSuccess('QR code download started!');
                                                    } else {
                                                        showError('QR code image not available for download');
                                                    }
                                                }}
                                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                            >
                                                Download QR
                                            </button>
                                            <button
                                                onClick={closeQRModal}
                                                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 mb-4">
                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-600">QR code not available for this test</p>
                                        <button
                                            onClick={closeQRModal}
                                            className="mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default YourTests;