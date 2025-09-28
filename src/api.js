// Central API utility for backend requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

let token = null;
if (typeof window !== 'undefined') {
  token = localStorage.getItem('token');
}

export async function apiRequest(endpoint, options = {}) {
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('Making API request to:', url);
  console.log('Request options:', options);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Auth APIs
export function loginUser(data) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function signupUser(data) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Get current user profile
export function getProfile() {
  return apiRequest('/api/auth/me', { method: 'GET' });
}

// Example for other modules
export function fetchCollections() {
  return apiRequest('/api/collection', { method: 'GET' });
}

// Simple organization creation utility
export function createOrganization(data) {
  return apiRequest('/api/organization', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Get organization by type
export function getOrganizationByType(type) {
  return apiRequest(`/api/organization/by-type/${type}`, { method: 'GET' });
}

// QR Code Management
export function generateQRCode(qrData) {
  return apiRequest('/api/qr-codes', {
    method: 'POST',
    body: JSON.stringify(qrData),
  });
}

export function getQRCodes(params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 10,
    ...(params.entityType && { entityType: params.entityType })
  });
  return apiRequest(`/api/qr-codes?${queryParams.toString()}`, { method: 'GET' });
}

export function getQRCodeById(id) {
  return apiRequest(`/api/qr-codes/${id}`, { method: 'GET' });
}

// Finished Goods Management
export function fetchFinishedGoodsByUser() {
  return apiRequest('/api/finished-goods/by-user', { method: 'GET' });
}

export function createFinishedGood(data) {
  return apiRequest('/api/finished-goods', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// QR Code Scanning
export async function scanQRCode(qrHash) {
  console.log('scanQRCode called with hash:', qrHash);
  try {
    const result = await apiRequest(`/api/qr-codes/scan/${qrHash}`, { method: 'GET' });
    console.log('scanQRCode result:', result);
    return result;
  } catch (error) {
    console.error('scanQRCode error:', error);
    throw error;
  }
}

// Get QR Code Image by Entity ID (for manufacturer dashboard)
export function getQRCodeImage(entityId) {
  return apiRequest(`/api/qr-codes/image/${entityId}`, { method: 'GET' });
}

// Get all QR codes (for debugging)
export function getAllQRCodes() {
  return apiRequest('/api/qr-codes', { method: 'GET' });
}

// Document Management
export function uploadDocument(file, documentType, entityType, entityId) {
  token = localStorage.getItem('token');
  const url = `${API_BASE_URL}/api/documents`;
  
  // Create FormData and append the required fields
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);
  formData.append('entityType', entityType);
  formData.append('entityId', entityId);
  
  return fetch(url, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Don't set Content-Type for FormData, let browser set it with boundary
    },
    body: formData,
  }).then(async response => {
    console.log('Document upload response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Document upload error:', errorText);
      throw new Error(errorText);
    }
    
    const data = await response.json();
    console.log('Document upload response:', data);
    return data;
  });
}

// Labs API Functions

// Get lab dashboard metrics
export function getLabDashboard() {
  return apiRequest('/api/labs/dashboard', { method: 'GET' });
}

// Lab Tests Management
export function getLabTests(params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 10,
    ...(params.status && { status: params.status }),
    ...(params.testType && { testType: params.testType }),
    ...(params.priority && { priority: params.priority })
  });
  return apiRequest(`/api/labs/tests?${queryParams.toString()}`, { method: 'GET' });
}

export function getLabTestById(testId) {
  return apiRequest(`/api/labs/tests/${testId}`, { method: 'GET' });
}

export function createLabTest(testData) {
  return apiRequest('/api/labs/tests', {
    method: 'POST',
    body: JSON.stringify(testData),
  });
}

export function updateLabTest(testId, updateData) {
  return apiRequest(`/api/labs/tests/${testId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
}

export function deleteLabTest(testId) {
  return apiRequest(`/api/labs/tests/${testId}`, { method: 'DELETE' });
}

// Lab Certificates Management
export function getLabCertificates(params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 10,
    ...(params.certificateType && { certificateType: params.certificateType }),
    ...(params.isValid !== undefined && { isValid: params.isValid })
  });
  return apiRequest(`/api/labs/certificates?${queryParams.toString()}`, { method: 'GET' });
}

export function createCertificate(certificateData) {
  return apiRequest('/api/labs/certificates', {
    method: 'POST',
    body: JSON.stringify(certificateData),
  });
}

// Get labs by type
export function getLabsByType(type = 'LABS') {
  return apiRequest(`/api/labs?type=${type}`, { method: 'GET' });
}

// QR Code Upload and Scan
export function uploadAndScanQR(file) {
  token = localStorage.getItem('token');
  const url = `${API_BASE_URL}/api/qr-codes/upload-scan`;
  
  const formData = new FormData();
  formData.append('qrImage', file);
  
  return fetch(url, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  }).then(async response => {
    console.log('QR upload and scan response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('QR upload and scan error:', errorText);
      throw new Error(errorText);
    }
    
    const data = await response.json();
    console.log('QR upload and scan response:', data);
    return data;
  });
}

// QR Code API Functions
export function getQRCodeByTestId(testId) {
  return apiRequest(`/api/qr-codes?entityType=LAB_TEST&entityId=${testId}`, { method: 'GET' });
}

export function getQRCodeImageUrl(qrCodeId) {
  return `${API_BASE_URL}/api/qr-codes/${qrCodeId}/image`;
}

export function getQRCodeBySupplyChainEvent(eventId) {
  return apiRequest(`/api/qr-codes?entityType=SUPPLY_CHAIN_EVENT&entityId=${eventId}`, { method: 'GET' });
}

// Certificate API Functions
export async function downloadCertificate(testId) {
  token = localStorage.getItem('token');
  const url = `${API_BASE_URL}/api/labs/tests/${testId}/certificate/download`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to download certificate';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (error) {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    // Check if the response is actually a PDF
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/pdf')) {
      throw new Error('Invalid response format. Expected PDF file.');
    }
    
    return response.blob();
  } catch (error) {
    console.error('Certificate download error:', error);
    throw error;
  }
}

// Distributor API Functions
export function getDistributorDashboard() {
  return apiRequest('/api/distributor/dashboard', { method: 'GET' });
}

export function getDistributorInventory(params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 100,  // Get more items by default
    ...(params.status && { status: params.status }),
    ...(params.productType && { productType: params.productType }),
    ...(params.location && { location: params.location })
  });
  return apiRequest(`/api/distributor/inventory?${queryParams.toString()}`, { method: 'GET' });
}

export function addInventoryItem(itemData) {
  return apiRequest('/api/distributor/inventory', {
    method: 'POST',
    body: JSON.stringify(itemData),
  });
}

export function updateInventoryItem(inventoryId, updateData) {
  return apiRequest(`/api/distributor/inventory/${inventoryId}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
}

export function getDistributorShipments(params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 10,
    ...(params.status && { status: params.status }),
    ...(params.recipientType && { recipientType: params.recipientType }),
    ...(params.trackingNumber && { trackingNumber: params.trackingNumber })
  });
  return apiRequest(`/api/distributor/shipments?${queryParams.toString()}`, { method: 'GET' });
}

export function createShipment(shipmentData) {
  return apiRequest('/api/distributor/shipments', {
    method: 'POST',
    body: JSON.stringify(shipmentData),
  });
}

export function updateShipmentStatus(shipmentId, statusData) {
  return apiRequest(`/api/distributor/shipments/${shipmentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(statusData),
  });
}

export function getDistributorVerifications(params = {}) {
  const queryParams = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 10,
    ...(params.status && { status: params.status }),
    ...(params.verificationType && { verificationType: params.verificationType }),
    ...(params.entityType && { entityType: params.entityType })
  });
  return apiRequest(`/api/distributor/verifications?${queryParams.toString()}`, { method: 'GET' });
}

export function createVerification(verificationData) {
  return apiRequest('/api/distributor/verifications', {
    method: 'POST',
    body: JSON.stringify(verificationData),
  });
}

export function updateVerification(verificationId, updateData) {
  return apiRequest(`/api/distributor/verifications/${verificationId}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
}

export function generateDistributorAnalytics(reportType = 'INVENTORY_SUMMARY') {
  return apiRequest(`/api/distributor/analytics?reportType=${reportType}`, { method: 'GET' });
}

export function scanDistributorQRCode(qrCode) {
  return apiRequest('/api/distributor/scan-qr', {
    method: 'POST',
    body: JSON.stringify({ qrCode })
  });
}
