import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQRCode, getQRCodeImage, getQRCodes } from '../api';
import { useAuth } from '../contexts/AuthContext';

// --- SVG Icons ---
const LeafIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.61,3.47A8.75,8.75,0,0,0,12,2a8.75,8.75,0,0,0-5.61,1.47,8.75,8.75,0,0,0-3.32,12.46l.16.27.17.27,1.6,2.57.17.26.16.25a8.74,8.74,0,0,0,13.34,0l.16-.25.17-.26,1.6-2.57.17-.27.16-.27A8.75,8.75,0,0,0,17.61,3.47ZM12,20.42a6.76,6.76,0,0,1-5.18-2.3l-.15-.24-.15-.24L5,15.07l-.15-.24-.14-.24a6.75,6.75,0,0,1,2.56-9.58,6.75,6.75,0,0,1,9.56,0,6.75,6.75,0,0,1,2.56,9.58l-.14.24-.15.24L19,15.07l-.15.24-.15.24A6.76,6.76,0,0,1,12,20.42Z" />
    <path d="M12,4.11a6.83,6.83,0,0,0-4,1.62,6.7,6.7,0,0,0,4,11.62,6.7,6.7,0,0,0,4-11.62A6.83,6.83,0,0,0,12,4.11Z" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const TruckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16,3 19,7 19,13 16,13"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const PackageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const QrCodeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
    <line x1="14" y1="14" x2="14.01" y2="14"></line>
    <line x1="17.5" y1="14" x2="17.51" y2="14"></line>
  </svg>
);

const ShieldCheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="M9 12l2 2 4-4"></path>
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

  const DistributorDashboard = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Home');
  const [user, setUser] = useState(null);
  const [existingQRCodes, setExistingQRCodes] = useState([]);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Fetch existing QR codes when component mounts
    fetchExistingQRCodes();
  }, []);

  const fetchExistingQRCodes = async () => {
    setQrLoading(true);
    try {
      const response = await getQRCodes({
        page: 1,
        limit: 20,
        entityType: 'RAW_MATERIAL_BATCH'
      });
      setExistingQRCodes(response.data || response.qrCodes || []);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setQrLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleTrackShipment = (shipment) => {
    alert(`Tracking shipment ${shipment.id}. This feature will show real-time location and status updates.`);
    // TODO: Implement real shipment tracking functionality
    // Could open a tracking modal or navigate to a dedicated tracking page
  };

  // Mock data for demonstration
  const shipments = [
    {
      id: 'SH001',
      batchId: 'BT-ASH-2024-001',
      product: 'Ashwagandha Powder',
      origin: 'Rajasthan Farm Co-op',
      destination: 'Mumbai Retail Hub',
      status: 'In Transit',
      gpsLocation: '19.0760° N, 72.8777° E',
      estimatedDelivery: '2024-01-15',
      temperature: '25°C',
      humidity: '45%'
    },
    {
      id: 'SH002',
      batchId: 'BT-TUL-2024-003',
      product: 'Turmeric Extract',
      origin: 'Kerala Processing Unit',
      destination: 'Delhi Distribution Center',
      status: 'Delivered',
      gpsLocation: '28.7041° N, 77.1025° E',
      deliveredDate: '2024-01-12',
      temperature: '22°C',
      humidity: '40%'
    },
    {
      id: 'SH003',
      batchId: 'BT-NIM-2024-002',
      product: 'Neem Capsules',
      origin: 'Gujarat Manufacturer',
      destination: 'Bangalore Pharmacy Chain',
      status: 'Pending Pickup',
      gpsLocation: '23.0225° N, 72.5714° E',
      scheduledPickup: '2024-01-16',
      temperature: 'N/A',
      humidity: 'N/A'
    }
  ];

  const qualityAlerts = [
    {
      id: 'QA001',
      batchId: 'BT-ASH-2024-001',
      alert: 'Temperature variance detected',
      severity: 'Medium',
      timestamp: '2024-01-14 10:30 AM',
      action: 'Temperature logs reviewed - within acceptable range'
    },
    {
      id: 'QA002',
      batchId: 'BT-TUL-2024-003',
      alert: 'GPS tracking gap',
      severity: 'Low',
      timestamp: '2024-01-12 02:15 PM',
      action: 'Signal restored after tunnel passage'
    }
  ];

  const complianceMetrics = {
    totalShipments: 156,
    onTimeDelivery: 94.2,
    temperatureCompliance: 98.7,
    gpsTrackingUptime: 99.1,
    sustainabilityScore: 92.5
  };

  const renderHomeContent = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-700">
        Welcome Distributor
      </h2>
    </div>
  );

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <div className="flex items-center">
            <TruckIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-700">Active Shipments</p>
              <p className="text-2xl font-bold text-blue-900">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-700">On-Time Delivery</p>
              <p className="text-2xl font-bold text-green-900">{complianceMetrics.onTimeDelivery}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-700">Pending Pickups</p>
              <p className="text-2xl font-bold text-yellow-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
          <div className="flex items-center">
            <PackageIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-700">Total Deliveries</p>
              <p className="text-2xl font-bold text-purple-900">{complianceMetrics.totalShipments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Shipments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shipment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shipment.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.origin} → {shipment.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleTrackShipment(shipment)}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderShipmentTracking = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Shipment Tracking</h3>
        <div className="space-y-4">
          {shipments.map((shipment) => (
            <div key={shipment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{shipment.product}</h4>
                  <p className="text-sm text-gray-600">Batch: {shipment.batchId}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                  shipment.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {shipment.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{shipment.gpsLocation}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600">Temp: {shipment.temperature}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600">Humidity: {shipment.humidity}</span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Route:</span> {shipment.origin} → {shipment.destination}
                </p>
                {shipment.estimatedDelivery && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">ETA:</span> {shipment.estimatedDelivery}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQualityCompliance = () => (
    <div className="space-y-6">
      {/* Compliance Metrics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Compliance Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{complianceMetrics.temperatureCompliance}%</div>
            <div className="text-sm text-gray-600">Temperature Compliance</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{complianceMetrics.gpsTrackingUptime}%</div>
            <div className="text-sm text-gray-600">GPS Tracking Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{complianceMetrics.sustainabilityScore}%</div>
            <div className="text-sm text-gray-600">Sustainability Score</div>
          </div>
        </div>
      </div>

      {/* Quality Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Alerts</h3>
        <div className="space-y-3">
          {qualityAlerts.map((alert) => (
            <div key={alert.id} className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-yellow-800">{alert.alert}</p>
                  <p className="text-sm text-yellow-700">Batch: {alert.batchId}</p>
                  <p className="text-xs text-yellow-600">{alert.timestamp}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  alert.severity === 'High' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {alert.severity}
                </span>
              </div>
              <p className="mt-2 text-sm text-yellow-700">{alert.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQRManagement = () => {
    const [qrFile, setQrFile] = useState(null);
    const [password, setPassword] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [error, setError] = useState('');
    const [generatedQRId, setGeneratedQRId] = useState(null);
    const [qrImageUrl, setQrImageUrl] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleUnlockBatch = (e) => {
      e.preventDefault();
      setError('');
      
      // In a real app, you'd validate the QR content and password against a server/blockchain
      if (password === 'dist123' && qrFile) {
        // Find the batch that matches the uploaded QR
        const batch = shipments.find(s => s.id === 'SH001'); // Mock selection
        setSelectedBatch(batch);
        setIsUnlocked(true);
      } else {
        setError('Invalid QR file or password. Please try again.');
      }
    };

    const handleGenerateQR = async (shipment) => {
      setIsGenerating(true);
      setError('');
      
      try {
        const qrData = {
          entityType: "RAW_MATERIAL_BATCH",
          entityId: shipment.batchId || "e1f2g3h4-i5j6-7890-1234-567890abcdef",
          purpose: "Product traceability and authentication",
          customData: {
            batchInfo: shipment.product,
            harvestDate: "2025-08-15",
            origin: shipment.origin,
            destination: shipment.destination,
            gpsLocation: shipment.gpsLocation,
            temperature: shipment.temperature,
            humidity: shipment.humidity,
            distributionComplete: true,
            consumerReady: true
          }
        };

        const response = await generateQRCode(qrData);
        setGeneratedQRId(response.qrCodeId);
        
        // Get the QR code image
        try {
          const imageResponse = await getQRCodeImage(response.qrCodeId);
          setQrImageUrl(`data:image/png;base64,${imageResponse}`);
        } catch (imgError) {
          console.error('Error fetching QR image:', imgError);
        }
        
        // Refresh the existing QR codes list
        await fetchExistingQRCodes();
        
        alert(`QR Code generated successfully for ${shipment.product}! QR ID: ${response.qrCodeId}`);
      } catch (err) {
        setError(`Failed to generate QR code: ${err.message}`);
        console.error('QR generation error:', err);
      } finally {
        setIsGenerating(false);
      }
    };

    if (!isUnlocked) {
      // QR Upload and Verification Section
      return (
        <div className="space-y-6">
          <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Batch QR Code</h2>
            <p className="text-gray-500 mb-6">Upload batch QR code to verify chain of custody and generate consumer QR.</p>
            
            <form onSubmit={handleUnlockBatch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch QR Code
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setQrFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distributor Access Key
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter distributor access key"
                  required
                />
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                Verify Chain of Custody
              </button>
            </form>
          </div>

          {/* Available Batches for QR Generation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Ready for Consumer QR Generation</h3>
              <button 
                onClick={fetchExistingQRCodes}
                disabled={qrLoading}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {qrLoading ? 'Loading...' : 'Refresh QR Codes'}
              </button>
            </div>
            
            {/* Existing QR Codes from API */}
            {existingQRCodes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 mb-3">Existing QR Codes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {existingQRCodes.slice(0, 4).map((qr) => (
                    <div key={qr.qrCodeId} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm text-gray-800">QR ID: {qr.qrCodeId.slice(0, 8)}...</p>
                          <p className="text-xs text-gray-600">Entity: {qr.entityId?.slice(0, 15)}...</p>
                          <p className="text-xs text-gray-600">Type: {qr.entityType}</p>
                          <p className="text-xs text-gray-500">Created: {new Date(qr.createdAt).toLocaleDateString()}</p>
                        </div>
                        <QrCodeIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
                {existingQRCodes.length > 4 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing 4 of {existingQRCodes.length} QR codes. Click refresh to see all.
                  </p>
                )}
              </div>
            )}

            {/* New QR Generation */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-700">Generate New QR Codes</h4>
              {shipments.filter(s => s.status === 'Delivered').map((shipment) => (
                <div key={shipment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800">{shipment.product}</h4>
                      <p className="text-sm text-gray-600">Batch: {shipment.batchId}</p>
                      <p className="text-sm text-gray-600">Status: Chain of custody complete</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <QrCodeIcon className="h-8 w-8 text-gray-400" />
                      <button 
                        onClick={() => handleGenerateQR(shipment)}
                        disabled={isGenerating}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {isGenerating ? 'Generating...' : 'Generate Consumer QR'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Unlocked view showing batch details and QR generation
    return (
      <div className="space-y-6">
        {/* Verified Batch Details */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-emerald-800">✅ Verified Batch Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 mb-6">
            <div><p className="font-semibold">Product:</p> <p>{selectedBatch?.product}</p></div>
            <div><p className="font-semibold">Batch ID:</p> <p>{selectedBatch?.batchId}</p></div>
            <div><p className="font-semibold">Status:</p> <p>{selectedBatch?.status}</p></div>
            <div><p className="font-semibold">Origin:</p> <p>{selectedBatch?.origin}</p></div>
            <div><p className="font-semibold">Destination:</p> <p>{selectedBatch?.destination}</p></div>
            <div><p className="font-semibold">GPS Location:</p> <p>{selectedBatch?.gpsLocation}</p></div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Chain of Custody Verification:</h4>
            <div className="space-y-2">
              <div className="flex items-center text-green-600">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">Farm collection verified</span>
              </div>
              <div className="flex items-center text-green-600">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">Processing steps validated</span>
              </div>
              <div className="flex items-center text-green-600">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">Quality tests passed</span>
              </div>
              <div className="flex items-center text-green-600">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                <span className="text-sm">Distribution tracking complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Generation Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-emerald-800">🎯 Generate Consumer QR Code</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">QR Code Preview</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {qrImageUrl ? (
                  <div>
                    <img src={qrImageUrl} alt="Generated QR Code" className="mx-auto mb-4 max-w-full h-auto" />
                    <p className="text-green-600 font-semibold">QR Code Generated Successfully!</p>
                    {generatedQRId && <p className="text-sm text-gray-500">QR ID: {generatedQRId}</p>}
                  </div>
                ) : (
                  <div>
                    <QrCodeIcon className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Consumer QR Code will appear here</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">QR Code Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                <p><strong>Entity Type:</strong> RAW_MATERIAL_BATCH</p>
                <p><strong>Purpose:</strong> Product traceability and authentication</p>
                <p><strong>Contains:</strong> Full provenance chain</p>
                <p><strong>Farm Details:</strong> GPS coordinates, harvest date</p>
                <p><strong>Processing:</strong> All manufacturing steps</p>
                <p><strong>Quality Tests:</strong> Lab certificates</p>
                <p><strong>Distribution:</strong> Complete supply chain</p>
                <p><strong>Compliance:</strong> Sustainability verification</p>
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              
              <button 
                onClick={() => handleGenerateQR(selectedBatch)}
                disabled={isGenerating}
                className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generating QR Code...' : 'Generate Final Consumer QR Code'}
              </button>
              
              <button 
                onClick={() => {
                  setIsUnlocked(false); 
                  setSelectedBatch(null); 
                  setQrFile(null); 
                  setPassword(''); 
                  setError('');
                  setGeneratedQRId(null);
                  setQrImageUrl(null);
                }}
                className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                Verify Another Batch
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex px-2 lg:px-0">
              <div className="flex items-center">
                <LeafIcon className="h-8 w-8 text-emerald-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">AyuTrace</span>
              </div>
            </div>
            <div className="flex items-center lg:ml-4">
              <SearchIcon className="h-6 w-6 text-gray-400 mx-2" />
              <UserIcon className="h-6 w-6 text-gray-400 mx-2" />
              <button
                onClick={handleLogout}
                className="ml-4 text-sm text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4">
          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('Home')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'Home' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('Dashboard')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'Dashboard' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('Tracking')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'Tracking' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Shipment Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('Compliance')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'Compliance' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Quality & Compliance
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('QR')}
                  className={`w-full text-left px-3 py-2 rounded-md ${
                    activeTab === 'QR' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  QR Management
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'Home' ? (
            renderHomeContent()
          ) : activeTab === 'Dashboard' ? (
            renderDashboardContent()
          ) : activeTab === 'Tracking' ? (
            renderShipmentTracking()
          ) : activeTab === 'Compliance' ? (
            renderQualityCompliance()
          ) : activeTab === 'QR' ? (
            renderQRManagement()
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default DistributorDashboard;