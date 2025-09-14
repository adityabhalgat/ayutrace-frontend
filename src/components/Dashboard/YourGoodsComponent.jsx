import React, { useState, useEffect } from 'react';
import { fetchFinishedGoodsByUser, generateQRCode, getQRCodeImage } from '../../api';
import { LeafIcon, UserIcon } from '../UI/Icons';
import ProductModal from '../Modals/ProductModal';

const YourGoodsComponent = ({ setActiveTab }) => {
    const [finishedGoods, setFinishedGoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedGood, setSelectedGood] = useState(null);
    const [modalType, setModalType] = useState(''); // 'qr' or 'details'
    const [qrCodeData, setQRCodeData] = useState(null);
    const [qrLoading, setQRLoading] = useState(false);

    useEffect(() => {
        const fetchGoods = async () => {
            try {
                setLoading(true);
                const response = await fetchFinishedGoodsByUser();
                // Handle the new API response structure
                setFinishedGoods(response.data?.products || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch finished goods');
            } finally {
                setLoading(false);
            }
        };
        
        fetchGoods();
    }, []);

    // Handle QR Code Generation or Display
    const handleQRAction = async (good) => {
        setSelectedGood(good);
        setModalType('qr');
        setShowModal(true);
        setQRLoading(true);
        
        try {
            // First, try to get existing QR code
            try {
                const qrImageResponse = await getQRCodeImage(good.productId);
                setQRCodeData(qrImageResponse.data);
            } catch (err) {
                // If no QR code exists, generate a new one
                const qrData = {
                    entityType: "FINISHED_GOOD",
                    entityId: good.productId,
                    purpose: "Product traceability and authentication",
                    customData: {
                        productInfo: good.productName,
                        batchNumber: good.batchNumber,
                        productType: good.productType
                    }
                };
                
                const response = await generateQRCode(qrData);
                setQRCodeData(response.data);
            }
        } catch (err) {
            setError('Failed to handle QR code: ' + err.message);
        } finally {
            setQRLoading(false);
        }
    };

    // Handle View Full Details
    const handleViewDetails = (good) => {
        setSelectedGood(good);
        setModalType('details');
        setShowModal(true);
    };

    // Close Modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedGood(null);
        setQRCodeData(null);
        setModalType('');
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your finished goods...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg">Error: {error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Finished Goods</h2>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                        Total Products: {finishedGoods.length}
                    </div>
                </div>
            </div>

            {finishedGoods.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center w-full">
                    <LeafIcon className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">No Finished Goods Yet</h3>
                    <p className="text-gray-500 mb-6">You haven't created any finished goods yet. Start by adding your first product!</p>
                    <button 
                        onClick={() => setActiveTab('Add Goods')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                        Add Your First Product
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden w-full">
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {finishedGoods.map((good, index) => (
                                    <tr key={good.productId || index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{good.productName}</div>
                                                <div className="text-sm text-gray-500">{good.description}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {good.productType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {good.quantity} {good.unit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {good.batchNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {good.expiryDate ? new Date(good.expiryDate).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button 
                                                onClick={() => handleQRAction(good)}
                                                className="text-emerald-600 hover:text-emerald-900 mr-4 transition-colors font-medium"
                                            >
                                                🔳 QR Code
                                            </button>
                                            <button 
                                                onClick={() => handleViewDetails(good)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors font-medium"
                                            >
                                                👁️ Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Product Modal */}
            <ProductModal
                showModal={showModal}
                closeModal={closeModal}
                modalType={modalType}
                selectedGood={selectedGood}
                qrLoading={qrLoading}
                qrCodeData={qrCodeData}
            />
        </div>
    );
};

export default YourGoodsComponent;