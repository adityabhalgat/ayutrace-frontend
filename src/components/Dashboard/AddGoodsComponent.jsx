import React, { useState, useEffect, useRef } from 'react';
import { createFinishedGood, scanQRCode, uploadDocument } from '../../api';
import { getCurrentUser } from '../../utils/jwt';
import { readQRCodeFromImage } from '../../utils/qrReader';

const AddGoodsComponent = () => {
  const [finishedGoodData, setFinishedGoodData] = useState({
    name: '',
    description: '',
    batchNumber: '',
    quantity: '',
    unitOfMeasurement: 'KG',
    expirationDate: '',
    storageConditions: '',
    rawMaterialBatchIds: []
  });
  const [formData, setFormData] = useState({
    productName: '',
    productType: 'POWDER',
    description: '',
    quantity: '',
    unit: 'KG',
    batchNumber: '',
    expiryDate: '',
    manufacturerId: '',
    composition: []
  });
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [documentError, setDocumentError] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [selectedRawMaterials, setSelectedRawMaterials] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [scannedMaterial, setScannedMaterial] = useState(null);
    const [compositionData, setCompositionData] = useState({
        percentage: '',
        quantityUsed: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // Auto-populate manufacturer ID from JWT token on component load
    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.userId) {
            setFormData(prev => ({
                ...prev,
                manufacturerId: currentUser.userId
            }));
        } else {
            setError('Unable to get manufacturer ID from session. Please login again.');
        }
    }, []);

    // Auto-populate batch number when QR code is scanned
    useEffect(() => {
        if (scannedMaterial && scannedMaterial.batchId) {
            setFormData(prev => ({
                ...prev,
                batchNumber: scannedMaterial.batchId
            }));
        }
    }, [scannedMaterial]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.composition.length === 0) {
            setError('Please add at least one composition item');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            // Get current user and ensure manufacturerId is set
            const currentUser = getCurrentUser();
            if (!currentUser || !currentUser.userId) {
                setError('User not authenticated. Please log in again.');
                setLoading(false);
                return;
            }
            
            // Prepare data with correct types
            const submitData = {
                ...formData,
                manufacturerId: currentUser.userId, // Explicitly set from JWT
                quantity: parseFloat(formData.quantity), // Convert to number
                expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
                composition: formData.composition.map(comp => ({
                    ...comp,
                    percentage: parseFloat(comp.percentage), // Ensure percentage is number
                    quantityUsed: parseFloat(comp.quantityUsed) // Ensure quantityUsed is number
                }))
            };
            
            console.log('Submitting data:', submitData); // Debug log
            
            const response = await createFinishedGood(submitData);
            console.log('Finished good created successfully:', response); // Debug log
            
            // Ensure the response has a productId for document linking
            const finishedGoodId = response?.data?.productId;
            if (!finishedGoodId) {
                throw new Error('Finished good creation response missing productId');
            }

            // Upload documents if any
            if (documents.length > 0) {
                setUploading(true);
                for (const doc of documents) {
                    try {
                        console.log('Uploading document:', doc.file.name, 'for finished good ID:', finishedGoodId);
                        await uploadDocument(doc.file, doc.type, 'FINISHED_GOOD', finishedGoodId);
                    } catch (docError) {
                        console.error('Document upload failed:', docError);
                        setDocumentError(`Failed to upload ${doc.file.name}: ${docError.message}`);
                    }
                }
                setUploading(false);
            }
            
            alert('Product added successfully!');
            setFormData({
                productName: '',
                productType: 'POWDER',
                description: '',
                quantity: '',
                unit: 'KG',
                batchNumber: '',
                expiryDate: '',
                manufacturerId: '',
                composition: []
            });
            setDocuments([]);
            setDocumentError('');
        } catch (err) {
            console.error('Submit error:', err); // Debug log
            setError(err.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleQRUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setQrFile(file);
        
        try {
            // Read and decode the QR code from the image file
            const qrCodeData = await readQRCodeFromImage(file);
            console.log('Decoded QR code data for composition:', qrCodeData); // Debug log
            
            let qrHash;
            
            try {
                // Try to parse as JSON first (if QR contains JSON data)
                const jsonData = JSON.parse(qrCodeData);
                console.log('QR contains JSON data:', jsonData); // Debug log
                
                // Extract qrHash from JSON data
                qrHash = jsonData.qrHash;
                
                if (!qrHash) {
                    throw new Error('qrHash field not found in QR code JSON data');
                }
            } catch (parseError) {
                // If not JSON, treat the entire content as the hash
                console.log('QR data is not JSON, treating as direct hash:', qrCodeData); // Debug log
                qrHash = qrCodeData.trim();
                
                if (!qrHash) {
                    throw new Error('QR code appears to be empty');
                }
            }
            
            const response = await scanQRCode(qrHash);
            console.log('QR scan response for composition:', response); // Debug log
            
            // Extract the actual raw material batch data from the response
            const materialData = response.data?.entityData || response.data;
            
            if (materialData && materialData.batchId) {
                // Set the scanned material data with batch ID for composition
                setScannedMaterial({
                    ...materialData,
                    qrHash: qrHash, // Store the QR hash as well
                    batchId: materialData.batchId // Ensure batch ID is available
                });
                setShowQRScanner(true);
                setError(''); // Clear any previous errors
                console.log('Material data set with batch ID:', materialData.batchId); // Debug log
            } else {
                throw new Error('No batch ID found in the scanned QR code data');
            }
        } catch (err) {
            setError('Failed to scan QR code: ' + err.message);
            console.error('QR scan error:', err); // Debug log
        }
    };

    const addComposition = () => {
        if (!scannedMaterial || !compositionData.percentage || !compositionData.quantityUsed) {
            setError('Please scan QR code and fill in composition details');
            return;
        }

        const newComposition = {
            rawMaterialBatchId: scannedMaterial.batchId || scannedMaterial.entityId,
            percentage: parseFloat(compositionData.percentage),
            quantityUsed: parseFloat(compositionData.quantityUsed),
            materialName: scannedMaterial.herbName || scannedMaterial.name || 'Unknown Material'
        };

        setFormData({
            ...formData,
            composition: [...formData.composition, newComposition]
        });

        // Reset composition form
        setCompositionData({ percentage: '', quantityUsed: '' });
        setScannedMaterial(null);
        setShowQRScanner(false);
        setQrFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setError(''); // Clear any errors
    };

    const removeComposition = (index) => {
        setFormData({
            ...formData,
            composition: formData.composition.filter((_, i) => i !== index)
        });
    };

    // Document handling functions
    const handleDocumentAdd = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    setDocumentError('File size must be less than 5MB');
                    return;
                }
                
                setDocuments([...documents, {
                    file,
                    type: 'REPORT', // Default type
                    id: Date.now() // Temporary ID
                }]);
                setDocumentError('');
            }
        };
        fileInput.click();
    };

    const handleDocumentTypeChange = (docId, newType) => {
        setDocuments(documents.map(doc => 
            doc.id === docId ? { ...doc, type: newType } : doc
        ));
    };

    const removeDocument = (docId) => {
        setDocuments(documents.filter(doc => doc.id !== docId));
    };

    return (
        <div className="w-full h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Finished Good</h2>
            
            <div className="bg-white rounded-xl shadow-sm p-6 w-full">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Type *
                            </label>
                            <select
                                name="productType"
                                value={formData.productType}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            >
                                <option value="POWDER">Powder</option>
                                <option value="CAPSULE">Capsule</option>
                                <option value="TABLET">Tablet</option>
                                <option value="SYRUP">Syrup</option>
                                <option value="OIL">Oil</option>
                                <option value="CREAM">Cream</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Enter product description"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity *
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="Enter quantity"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unit *
                            </label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            >
                                <option value="KG">KG</option>
                                <option value="TONNES">Tonnes</option>
                                <option value="GRAMS">Grams</option>
                                <option value="POUNDS">Pounds</option>
                                <option value="PIECES">Pieces</option>
                                <option value="BOTTLES">Bottles</option>
                                <option value="BOXES">Boxes</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Batch Number *
                                <span className="text-xs text-blue-600 ml-2">(Auto-populated from QR scan)</span>
                            </label>
                            <input
                                type="text"
                                name="batchNumber"
                                value={formData.batchNumber}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                                placeholder="Scan QR code to auto-populate batch number"
                                readOnly
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This field will be automatically filled when you scan a QR code below
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry Date
                            </label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Manufacturer ID *
                                <span className="text-xs text-blue-600 ml-2">(Auto-populated from session)</span>
                            </label>
                            <input
                                type="text"
                                name="manufacturerId"
                                value={formData.manufacturerId}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
                                placeholder="Auto-populated from your session"
                                readOnly
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                This is automatically filled based on your login session
                            </p>
                        </div>
                    </div>

                    {/* Composition Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Product Composition</h3>
                        
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <h4 className="font-medium text-gray-700 mb-4">Add Raw Material</h4>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Raw Material QR Code
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleQRUpload}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Upload QR code image of the raw material batch to include in this product
                                    </p>
                                </div>

                                {scannedMaterial && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <h5 className="font-medium text-green-800 mb-2">✅ Scanned Material</h5>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <span className="font-medium text-green-700">Material:</span>
                                                <span className="ml-1 text-green-600">
                                                    {scannedMaterial.herbName || scannedMaterial.name}
                                                    {scannedMaterial.scientificName && ` (${scannedMaterial.scientificName})`}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-green-700">Batch ID:</span>
                                                <span className="ml-1 text-green-600 font-mono">
                                                    {scannedMaterial.batchId || 'N/A'}
                                                </span>
                                            </div>
                                            {scannedMaterial.quantity && (
                                                <div>
                                                    <span className="font-medium text-green-700">Available Quantity:</span>
                                                    <span className="ml-1 text-green-600">
                                                        {scannedMaterial.quantity} {scannedMaterial.unit}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Percentage (%)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={compositionData.percentage}
                                            onChange={(e) => setCompositionData({...compositionData, percentage: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Enter percentage"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity Used
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={compositionData.quantityUsed}
                                            onChange={(e) => setCompositionData({...compositionData, quantityUsed: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="Enter quantity used"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={addComposition}
                                    disabled={!scannedMaterial}
                                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                                >
                                    Add to Composition
                                </button>
                            </div>
                        </div>

                        {/* Display added compositions */}
                        {formData.composition.length > 0 && (
                            <div>
                                <h4 className="font-medium text-gray-700 mb-3">Added Compositions:</h4>
                                <div className="space-y-2">
                                    {formData.composition.map((comp, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{comp.materialName}</div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    <span className="font-medium">Batch ID:</span> 
                                                    <span className="font-mono ml-1">{comp.rawMaterialBatchId}</span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-medium">Usage:</span> 
                                                    <span className="ml-1">{comp.percentage}% ({comp.quantityUsed} units)</span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeComposition(index)}
                                                className="ml-4 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Document Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-700">Documents</h3>
                            <button
                                type="button"
                                onClick={handleDocumentAdd}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Document
                            </button>
                        </div>

                        {documentError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                {documentError}
                            </div>
                        )}

                        {documents.length > 0 && (
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-md">
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-700">{doc.file.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                                            </div>
                                        </div>
                                        <select
                                            value={doc.type}
                                            onChange={(e) => handleDocumentTypeChange(doc.id, e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="REPORT">Report</option>
                                            <option value="CERTIFICATE">Certificate</option>
                                            <option value="TEST_RESULT">Test Result</option>
                                            <option value="COMPLIANCE_DOC">Compliance Document</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => removeDocument(doc.id)}
                                            className="text-red-600 hover:text-red-800 p-1"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {uploading && (
                            <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-md">
                                Uploading documents...
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-emerald-600 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
                        >
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    productName: '',
                                    productType: 'POWDER',
                                    description: '',
                                    quantity: '',
                                    unit: 'KG',
                                    batchNumber: '',
                                    expiryDate: '',
                                    manufacturerId: '',
                                    composition: []
                                });
                                setDocuments([]);
                                setDocumentError('');
                                setError('');
                            }}
                            className="flex-1 bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-md hover:bg-gray-400 transition"
                        >
                            Clear Form
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGoodsComponent;