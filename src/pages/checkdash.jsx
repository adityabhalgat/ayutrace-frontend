import React, { useEffect, useState, useRef } from "react";
import { apiRequest, generateQRCode, getQRCodeImage, getQRCodes, scanQRCode } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ScanResults from '../components/Dashboard/ScanResults';
import { readQRCodeFromImage } from '../utils/qrReader';

// Assuming you have react-router-dom installed for the Link component
// import { Link } from 'react-router-dom'; 

// --- ICON COMPONENTS (No changes needed here, assuming they exist) ---
const LeafIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.61,3.47A8.75,8.75,0,0,0,12,2a8.75,8.75,0,0,0-5.61,1.47,8.75,8.75,0,0,0-3.32,12.46l.16.27.17.27,1.6,2.57.17.26.16.25a8.74,8.74,0,0,0,13.34,0l.16-.25.17-.26,1.6-2.57.17-.27.16-.27A8.75,8.75,0,0,0,17.61,3.47ZM12,20.42a6.76,6.76,0,0,1-5.18-2.3l-.15-.24-.15-.24L5,15.07l-.15-.24-.14-.24a6.75,6.75,0,0,1,2.56-9.58,6.75,6.75,0,0,1,9.56,0,6.75,6.75,0,0,1,2.56,9.58l-.14.24-.15.24L19,15.07l-.15.24-.15.24A6.76,6.76,0,0,1,12,20.42Z" /><path d="M12,4.11a6.83,6.83,0,0,0-4,1.62,6.7,6.7,0,0,0,4,11.62,6.7,6.7,0,0,0,4-11.62A6.83,6.83,0,0,0,12,4.11Z" /></svg>
);
const SearchIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const UserIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const batches = [
  {id: "AYU-2023-001", herb: "Ashwagandha", quantity: "50 kg", date: "2023-10-26", source: "F-101 (28.7N, 77.2E)", status: "Pending"},
  {id: "AYU-2023-002", herb: "Turmeric", quantity: "120 kg", date: "2023-10-27", source: "F-105 (29.1N, 78.5E)", status: "In Progress"},
  {id: "AYU-2023-003", herb: "Brahmi", quantity: "75 kg", date: "2023-10-28", source: "F-102 (30.0N, 78.0E)", status: "Completed"},
];

export default function CheckDash() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard'); // Default to Dashboard
  const [qrFile, setQrFile] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  // --- State for the lab test form ---
  const [labAnalyst, setLabAnalyst] = useState('');
  const [testStatus, setTestStatus] = useState('Passed');
  const [testResults, setTestResults] = useState('');
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [testSubmissionError, setTestSubmissionError] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const fileInputRef = useRef(null);
  
  // --- Enhanced dummy data to reflect the detailed journey ---
  const [batchHistory, setBatchHistory] = useState(null);
  
  const dummyHistory = {
    batchId: 'AYU-2025-09-001',
    plantationDetails: {
      farmer: 'Unknown Farmer',
      location: 'Karnataka, IN',
      coordinates: '12.9716° N, 77.5946° E',
      collectionDate: '2025-09-02',
      herb: 'Ashwagandha',
    },
    manufacturingProcess: [
      {
        stage: 'Aggregation',
        date: '2025-09-03',
        operator: 'Aggregator A1',
        details: 'Collected from farm and transported to processing unit.'
      },
      {
        stage: 'Cleaning & Sorting',
        date: '2025-09-03',
        operator: 'Processor P1',
        details: 'Roots cleaned with purified water and sorted by size.'
      },
      {
        stage: 'Drying',
        date: '2025-09-04',
        operator: 'Processor P1',
        details: 'Sun-dried under controlled hygienic conditions.'
      }
    ],
    labTests: [
      // Initially empty, will be populated by the lab checker
    ]
  };

  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [existingQRCodes, setExistingQRCodes] = useState([]);
  const [qrLoading, setQrLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    apiRequest('/api/finishedGoods')
      .then(data => setChecks(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
      
    // Fetch existing QR codes
    fetchLabQRCodes();
  }, []);

  const fetchLabQRCodes = async () => {
    setQrLoading(true);
    try {
      const response = await getQRCodes({
        page: 1,
        limit: 15,
        entityType: 'RAW_MATERIAL_BATCH'
      });
      
      // Handle different response structures
      const qrCodes = response.data || response.qrCodes || [];
      setExistingQRCodes(qrCodes);
      
      if (qrCodes.length === 0) {
        console.log('No QR codes found for RAW_MATERIAL_BATCH');
      }
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      setExistingQRCodes([]);
      // Optionally show user-friendly error message
      // alert('Failed to fetch QR codes. Please try again.');
    } finally {
      setQrLoading(false);
    }
  };

  const handleUnlockDetails = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!qrFile) {
      setError('Please select a QR code file');
      return;
    }

    try {
      setLoading(true);
      
      // Read and decode the QR code from the image file
      const qrCodeData = await readQRCodeFromImage(qrFile);
      console.log('Decoded QR code data:', qrCodeData);
      
      let qrHash;
      
      try {
        // Try to parse as JSON first (if QR contains JSON data)
        const jsonData = JSON.parse(qrCodeData);
        qrHash = jsonData.qrHash;
        
        if (!qrHash) {
          throw new Error('qrHash field not found in QR code JSON data');
        }
      } catch (parseError) {
        // If not JSON, treat the entire content as the hash
        qrHash = qrCodeData.trim();
        
        if (!qrHash) {
          throw new Error('QR code appears to be empty');
        }
      }
      
      // Scan the QR code using the API
      const response = await scanQRCode(qrHash);
      setScanResult(response);
      setIsUnlocked(true);
      
    } catch (err) {
      console.error('QR scan error:', err);
      setError('Failed to scan QR code: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const clearScanResults = () => {
    setScanResult(null);
    setIsUnlocked(false);
    setQrFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleTestSubmit = async (e) => {
    e.preventDefault();
    setTestSubmissionError('');
    
    if (!labAnalyst || !testResults) {
        setTestSubmissionError("Please fill in all test fields.");
        return;
    }

    setIsSubmittingTest(true);

    try {
      const newTest = {
          analyst: labAnalyst,
          status: testStatus,
          results: testResults,
          date: new Date().toISOString().split('T')[0]
      };

      // Create a new history object with the updated tests
      const updatedHistory = {
          ...batchHistory,
          labTests: [...batchHistory.labTests, newTest]
      };

      setBatchHistory(updatedHistory);

      // Generate QR code after successful test submission
      const qrData = {
        entityType: "RAW_MATERIAL_BATCH",
        entityId: batchHistory.batchId,
        purpose: "Laboratory testing verification and quality certification",
        customData: {
          batchInfo: batchHistory.plantationDetails.herb,
          testingDate: newTest.date,
          labAnalyst: labAnalyst,
          testStatus: testStatus,
          testResults: testResults,
          labCertification: {
            analyst: labAnalyst,
            status: testStatus,
            completedTests: updatedHistory.labTests.length,
            qualityVerified: testStatus === 'Passed'
          },
          plantationDetails: batchHistory.plantationDetails,
          manufacturingProcess: batchHistory.manufacturingProcess,
          labTestsComplete: true,
          readyForDistribution: testStatus === 'Passed'
        }
      };

      const response = await generateQRCode(qrData);
      
      // Check if response has the expected structure
      if (response && (response.qrCodeId || response.data?.qrCodeId)) {
        const qrId = response.qrCodeId || response.data?.qrCodeId;
        alert(`Lab test results submitted successfully and QR code generated! QR ID: ${qrId}`);
      } else {
        alert("Lab test results submitted and QR code generated successfully!");
      }
      
      // Refresh QR codes list
      await fetchLabQRCodes();

      // Clear form for next entry
      setLabAnalyst('');
      setTestStatus('Passed');
      setTestResults('');
      
    } catch (err) {
      console.error('Error in test submission or QR code generation:', err);
      setTestSubmissionError(
        err.message || "Failed to submit test results or generate QR code. Please try again."
      );
    } finally {
      setIsSubmittingTest(false);
    }
  };

  // --- Main rendering logic for the Dashboard tab ---
  const renderDashboardContent = () => {
    if (!isUnlocked) {
      // --- LOCKED VIEW ---
      return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload QR and Authenticate</h2>
          <p className="text-gray-500 mb-6">Unlock the batch history to add lab test results.</p>
          <form onSubmit={handleUnlockDetails} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Batch QR Code Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setQrFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload an image containing a QR code to verify and unlock batch details
              </p>
            </div>
            
            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Scanning QR code...</p>
              </div>
            )}
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !qrFile}
              className="w-full bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Scanning...' : 'Scan QR Code & Verify Batch'}
            </button>
          </form>
        </div>
      );
    }

    // --- UNLOCKED VIEW (Show scan results) ---
    if (scanResult) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Batch Verification Results</h2>
            <button
              onClick={clearScanResults}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Scan Another Batch
            </button>
          </div>
          <ScanResults scanResult={scanResult} clearResults={clearScanResults} />
        </div>
      );
    }

    // --- UNLOCKED VIEW (Dummy data fallback) ---
    return (
      <div className="space-y-8">
        {/* Note: This section is kept for backward compatibility but won't be reached with real QR scanning */}
        <div className="text-center text-gray-500 mb-8">
          <p>QR scan completed but no detailed data available. Using fallback view.</p>
          <button
            onClick={clearScanResults}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 mt-2"
          >
            Scan Another QR Code
          </button>
        </div>
        
        {/* --- Section 1: Plantation & Manufacturing Details --- */}
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Batch Provenance: {batchHistory.batchId}</h2>
            {/* Plantation Details Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-emerald-800">🌱 Plantation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                    <div><p className="font-semibold">Herb:</p> <p>{batchHistory.plantationDetails.herb}</p></div>
                    <div><p className="font-semibold">Location:</p> <p>{batchHistory.plantationDetails.location} ({batchHistory.plantationDetails.coordinates})</p></div>
                    <div><p className="font-semibold">Collection Date:</p> <p>{batchHistory.plantationDetails.collectionDate}</p></div>
                </div>
            </div>
            {/* Manufacturing Process Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-emerald-800">🏭 Manufacturing Process</h3>
                <div className="space-y-4">
                    {batchHistory.manufacturingProcess.map((step, index) => (
                    <div key={index} className="border-l-4 border-emerald-500 pl-4 py-2">
                        <p className="font-bold">{step.stage}</p>
                        <p className="text-sm text-gray-600">Date: {step.date} | Operator: {step.operator}</p>
                        <p className="text-sm mt-1">{step.details}</p>
                    </div>
                    ))}
                </div>
            </div>
        </div>

        {/* --- Section 2: Lab Test Submission Form --- */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-emerald-800">🧪 Perform Laboratory Test</h3>
          
          {testSubmissionError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{testSubmissionError}</p>
            </div>
          )}
          
          <form onSubmit={handleTestSubmit} className="space-y-4">
            <div>
              <label htmlFor="analyst" className="block text-sm font-medium text-gray-700 mb-1">
                Analyst Name
              </label>
              <input
                type="text"
                id="analyst"
                value={labAnalyst}
                onChange={(e) => setLabAnalyst(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., Priya Sharma"
                required
                disabled={isSubmittingTest}
              />
            </div>
            <div>
              <label htmlFor="testStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Test Status
              </label>
              <select
                id="testStatus"
                value={testStatus}
                onChange={(e) => setTestStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                disabled={isSubmittingTest}
              >
                <option>Passed</option>
                <option>Failed</option>
              </select>
            </div>
            <div>
              <label htmlFor="testResults" className="block text-sm font-medium text-gray-700 mb-1">
                Test Results & Observations
              </label>
              <textarea
                id="testResults"
                value={testResults}
                onChange={(e) => setTestResults(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Enter heavy metal analysis, microbial content, DNA-barcode verification, etc."
                required
                disabled={isSubmittingTest}
              ></textarea>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Submitting test results will automatically generate a QR code with lab certification data for supply chain tracking.
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmittingTest}
              className={`w-full font-bold py-2 px-4 rounded-md transition-colors ${
                isSubmittingTest
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isSubmittingTest ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Test & Generating QR Code...
                </span>
              ) : (
                'Submit Test Results & Generate QR Code'
              )}
            </button>
          </form>
        </div>

        {/* --- Section 3: Submitted Lab Reports --- */}
        {batchHistory.labTests.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-emerald-800">📋 Submitted Lab Reports</h3>
                <div className="space-y-4">
                    {batchHistory.labTests.map((test, index) => (
                        <div key={index} className={`border-l-4 p-4 ${test.status === 'Passed' ? 'border-green-500' : 'border-red-500'}`}>
                            <p className="font-bold">Status: <span className={test.status === 'Passed' ? 'text-green-600' : 'text-red-600'}>{test.status}</span></p>
                            <p className="text-sm text-gray-600">Date: {test.date} | Analyst: {test.analyst}</p>
                            <p className="text-sm mt-2 whitespace-pre-wrap">{test.results}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Navbar - Fixed */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex px-2 lg:px-0">
              <div className="flex items-center">
                <LeafIcon className="h-8 w-8 text-emerald-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">AyuTrace</span>
              </div>
            </div>
            <div className="flex items-center lg:ml-4">
              <SearchIcon className="h-6 w-6 text-gray-400 mx-2 hidden sm:block" />
              <UserIcon className="h-6 w-6 text-gray-400 mx-2 hidden sm:block" />
              <button
                onClick={logout}
                className="ml-4 text-sm text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar - Responsive */}
        <aside className="hidden lg:block lg:w-64 bg-white shadow-md p-4 fixed h-full overflow-y-auto">
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('Home')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'Home' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('Dashboard')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'Dashboard' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('Batches')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'Batches' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Batches
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex justify-around py-2">
            <button
              onClick={() => setActiveTab('Home')}
              className={`flex flex-col items-center px-3 py-2 rounded-md transition-colors ${
                activeTab === 'Home' ? 'text-emerald-800' : 'text-gray-700'
              }`}
            >
              <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('Dashboard')}
              className={`flex flex-col items-center px-3 py-2 rounded-md transition-colors ${
                activeTab === 'Dashboard' ? 'text-emerald-800' : 'text-gray-700'
              }`}
            >
              <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs">Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('Batches')}
              className={`flex flex-col items-center px-3 py-2 rounded-md transition-colors ${
                activeTab === 'Batches' ? 'text-emerald-800' : 'text-gray-700'
              }`}
            >
              <svg className="h-6 w-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-xs">Batches</span>
            </button>
          </div>
        </div>

        {/* Main Content - Responsive */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 pb-20 lg:pb-6 overflow-y-auto">
        {activeTab === 'Home' ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-emerald-700 text-center">
              Welcome Lab Checker
            </h2>
          </div>
        ) : activeTab === 'Dashboard' ? (
          renderDashboardContent()
        ) : activeTab === 'Batches' ? (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Incoming Batches for Testing</h2>
            
            {/* Existing QR Codes Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Generated Lab QR Codes</h3>
                <button 
                  onClick={fetchLabQRCodes}
                  disabled={qrLoading}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {qrLoading ? 'Loading...' : 'Refresh QR Codes'}
                </button>
              </div>
              
              {existingQRCodes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {existingQRCodes.slice(0, 6).map((qr) => (
                    <div key={qr.qrCodeId} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm text-gray-800">QR ID: {qr.qrCodeId.slice(0, 8)}...</p>
                          <p className="text-xs text-gray-600">Entity: {qr.entityId?.slice(0, 15)}...</p>
                          <p className="text-xs text-gray-500">Created: {new Date(qr.createdAt).toLocaleDateString()}</p>
                          {qr.customData?.labAnalyst && (
                            <p className="text-xs text-emerald-600 font-medium">
                              Analyst: {qr.customData.labAnalyst}
                            </p>
                          )}
                        </div>
                        <QrCodeIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No lab QR codes generated yet</p>
                </div>
              )}
            </div>

            {/* Batches Table */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Herb Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {batches.map((batch) => (
                      <tr key={batch.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.herb}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.source}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${batch.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              batch.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {batch.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button 
                            onClick={() => setActiveTab('Dashboard')}
                            className="text-emerald-600 hover:text-emerald-900 font-medium"
                          >
                            Perform Test
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {batches.map((batch) => (
                  <div key={batch.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{batch.id}</h4>
                        <p className="text-sm text-gray-600">{batch.herb}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${batch.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          batch.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {batch.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">Quantity:</span>
                        <p className="text-gray-900">{batch.quantity}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Date:</span>
                        <p className="text-gray-900">{batch.date}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-500 text-sm">Source:</span>
                      <p className="text-gray-900 text-sm">{batch.source}</p>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100">
                      <button 
                        onClick={() => setActiveTab('Dashboard')}
                        className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Perform Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        </main>
      </div>
    </div>
  );
}