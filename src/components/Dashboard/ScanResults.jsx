import React from 'react';

const ScanResults = ({ scanResult, clearResults }) => {
    const data = scanResult?.data;
    
    // Helper function to check if array is not empty
    const hasData = (arr) => arr && Array.isArray(arr) && arr.length > 0;
    
    // Helper function to format date beautifully
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper function to render arrays beautifully
    const renderArray = (array, title) => {
        if (!array || !Array.isArray(array) || array.length === 0) return null;
        
        return (
            <div className="mt-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">{title}</h5>
                <div className="flex flex-wrap gap-2">
                    {array.map((item, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    // Helper function to render quality metrics beautifully
    const renderQualityMetrics = (qualityNotes) => {
        if (!qualityNotes) return null;
        
        let metrics = {};
        if (typeof qualityNotes === 'string') {
            try {
                metrics = JSON.parse(qualityNotes);
            } catch (e) {
                return (
                    <div className="text-sm text-gray-600">
                        {qualityNotes}
                    </div>
                );
            }
        } else {
            metrics = qualityNotes;
        }

        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-200">
                        <div className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">
                            {key.replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div className="text-sm font-bold text-amber-900">
                            {typeof value === 'number' ? 
                                (key.toLowerCase().includes('moisture') || key.toLowerCase().includes('purity') ? `${value}%` : value) 
                                : String(value)
                            }
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Helper function to get status badge color
    const getStatusColor = (status) => {
        const colors = {
            'CREATED': 'bg-blue-100 text-blue-800 border-blue-300',
            'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'APPROVED': 'bg-green-100 text-green-800 border-green-300',
            'REJECTED': 'bg-red-100 text-red-800 border-red-300',
            'IN_PROGRESS': 'bg-purple-100 text-purple-800 border-purple-300',
            'COMPLETED': 'bg-emerald-100 text-emerald-800 border-emerald-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Helper function to render entity type icon
    const getEntityIcon = (entityType) => {
        const icons = {
            'RAW_MATERIAL_BATCH': '🌿',
            'FINISHED_GOODS': '📦',
            'COLLECTION_EVENT': '🗂️',
            'SUPPLY_CHAIN': '🚚'
        };
        return icons[entityType] || '📋';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 -mx-8 px-8 py-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Hero Header Section */}
                <div className="text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 opacity-10 blur-3xl"></div>
                    <div className="relative">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full mb-6 shadow-2xl">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
                            ✨ Product Verified Successfully
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Complete traceability and transparency for your Ayurvedic product journey
                        </p>
                        <div className="mt-6 inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                            <span className="text-sm font-medium text-gray-700">Authenticated & Verified</span>
                        </div>
                    </div>
                </div>

                {/* QR Code Information - Enhanced */}
                {data?.qrCode && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="text-4xl mr-4">{getEntityIcon(data.qrCode.entityType)}</div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">QR Code Authentication</h2>
                                        <p className="text-emerald-100">Blockchain-verified product information</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white/80 text-sm">Total Scans</div>
                                    <div className="text-3xl font-bold text-white">{data.qrCode.scanCount}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Entity Type</div>
                                            <div className="text-lg font-bold text-blue-900">{data.qrCode.entityType.replace(/_/g, ' ')}</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                                            <div className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Created Date</div>
                                            <div className="text-lg font-bold text-purple-900">{formatDate(data.qrCode.createdAt)}</div>
                                        </div>
                                    </div>
                                    
                                    {/* QR Hash with copy functionality */}
                                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                                        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Unique QR Hash</div>
                                        <div className="flex items-center justify-between">
                                            <code className="text-sm font-mono text-gray-800 bg-white px-3 py-1 rounded border">
                                                {data.qrCode.qrHash}
                                            </code>
                                            <button 
                                                onClick={() => navigator.clipboard.writeText(data.qrCode.qrHash)}
                                                className="ml-3 px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Custom Data Section */}
                                {data.qrCode.customData && (
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                                        <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center">
                                            <span className="text-2xl mr-2">📋</span>
                                            Product Details
                                        </h3>
                                        <div className="space-y-3">
                                            {Object.entries(data.qrCode.customData).map(([key, value]) => (
                                                <div key={key} className="flex flex-col">
                                                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                                                        {key.replace(/([A-Z])/g, ' $1')}
                                                    </span>
                                                    <span className="text-sm font-semibold text-amber-900 mt-1">
                                                        {key.toLowerCase().includes('date') ? formatDate(value) : String(value)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Entity Data - Main Product Information */}
                {data?.entityData && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="text-4xl mr-4">🌿</div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{data.entityData.herbName || data.entityData.productName || 'Product Information'}</h2>
                                        <p className="text-green-100 italic">{data.entityData.scientificName}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(data.entityData.status)}`}>
                                        {data.entityData.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Quantity and Specifications */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        <span className="text-2xl mr-2">⚖️</span>
                                        Specifications
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                                            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Quantity</div>
                                            <div className="text-2xl font-bold text-blue-900">
                                                {data.entityData.quantity} {data.entityData.unit}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                                            <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">Batch ID</div>
                                            <code className="text-sm font-mono text-indigo-900 bg-white px-2 py-1 rounded">
                                                {data.entityData.batchId}
                                            </code>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Description and Notes */}
                                <div className="lg:col-span-2 space-y-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        <span className="text-2xl mr-2">📝</span>
                                        Description & Notes
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                            <h4 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-3">Product Description</h4>
                                            <p className="text-green-900 leading-relaxed">{data.entityData.description}</p>
                                        </div>
                                        {data.entityData.notes && (
                                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
                                                <h4 className="text-sm font-bold text-yellow-700 uppercase tracking-wider mb-3">Additional Notes</h4>
                                                <p className="text-yellow-900 leading-relaxed">{data.entityData.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Timestamps */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-lg">📅</span>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-blue-700 uppercase tracking-wide">Created</div>
                                            <div className="text-sm font-semibold text-gray-900">{formatDate(data.entityData.createdAt)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            <span className="text-lg">🔄</span>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-purple-700 uppercase tracking-wide">Last Updated</div>
                                            <div className="text-sm font-semibold text-gray-900">{formatDate(data.entityData.updatedAt)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Collection Events - Beautiful Cards */}
                {hasData(data?.entityData?.collectionEvents) && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
                            <div className="flex items-center">
                                <div className="text-4xl mr-4">🌾</div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Collection Events</h2>
                                    <p className="text-orange-100">Farmer collection and harvest details</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <div className="space-y-8">
                                {data.entityData.collectionEvents.map((event, index) => (
                                    <div key={event.eventId} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                                        {/* Event Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-orange-900">Collection Event</h3>
                                                    <p className="text-orange-700">{formatDate(event.collectionDate)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-orange-700 text-sm">Quantity Collected</div>
                                                <div className="text-2xl font-bold text-orange-900">{event.quantity} {event.unit}</div>
                                            </div>
                                        </div>

                                        {/* Farmer Information */}
                                        {event.farmer && (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                                <div className="bg-white rounded-xl p-6 border border-orange-200">
                                                    <h4 className="text-lg font-bold text-orange-900 mb-4 flex items-center">
                                                        <span className="text-2xl mr-2">👨‍🌾</span>
                                                        Farmer Details
                                                    </h4>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <div className="text-xs font-bold text-orange-700 uppercase tracking-wide">Name</div>
                                                            <div className="text-lg font-semibold text-orange-900">
                                                                {event.farmer.firstName} {event.farmer.lastName}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-orange-700 uppercase tracking-wide">Phone</div>
                                                            <div className="text-sm font-semibold text-orange-900">{event.farmer.phone}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-orange-700 uppercase tracking-wide">Location</div>
                                                            <div className="text-sm font-semibold text-orange-900">{event.farmer.location}</div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                                            <div className="bg-orange-100 rounded-lg p-3">
                                                                <div className="text-xs font-bold text-orange-700">Latitude</div>
                                                                <div className="text-sm font-mono text-orange-900">{event.farmer.latitude}</div>
                                                            </div>
                                                            <div className="bg-orange-100 rounded-lg p-3">
                                                                <div className="text-xs font-bold text-orange-700">Longitude</div>
                                                                <div className="text-sm font-mono text-orange-900">{event.farmer.longitude}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Herb Species Information */}
                                                {event.herbSpecies && (
                                                    <div className="bg-white rounded-xl p-6 border border-orange-200">
                                                        <h4 className="text-lg font-bold text-orange-900 mb-4 flex items-center">
                                                            <span className="text-2xl mr-2">🌱</span>
                                                            Herb Species
                                                        </h4>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <div className="text-xs font-bold text-orange-700 uppercase tracking-wide">Common Name</div>
                                                                <div className="text-lg font-semibold text-orange-900">{event.herbSpecies.commonName}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-orange-700 uppercase tracking-wide">Scientific Name</div>
                                                                <div className="text-sm font-semibold text-orange-900 italic">{event.herbSpecies.scientificName}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-orange-700 uppercase tracking-wide">Family</div>
                                                                <div className="text-sm font-semibold text-orange-900">{event.herbSpecies.family}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-orange-700 uppercase tracking-wide">Harvesting Season</div>
                                                                <div className="text-sm font-semibold text-orange-900">{event.herbSpecies.harvestingSeason}</div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Conservation Status */}
                                                        <div className="mt-4">
                                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                                                event.herbSpecies.conservationStatus === 'LEAST_CONCERN' ? 'bg-green-100 text-green-800' :
                                                                event.herbSpecies.conservationStatus === 'VULNERABLE' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                                {event.herbSpecies.conservationStatus.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Quality Metrics */}
                                        {event.qualityNotes && (
                                            <div className="bg-white rounded-xl p-6 border border-orange-200">
                                                <h4 className="text-lg font-bold text-orange-900 mb-4 flex items-center">
                                                    <span className="text-2xl mr-2">🔬</span>
                                                    Quality Metrics
                                                </h4>
                                                {renderQualityMetrics(event.qualityNotes)}
                                            </div>
                                        )}

                                        {/* Additional Details */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                                            {/* Medicinal Uses */}
                                            {event.herbSpecies?.medicinalUses && (
                                                <div className="bg-white rounded-xl p-4 border border-orange-200">
                                                    {renderArray(event.herbSpecies.medicinalUses, "Medicinal Uses")}
                                                </div>
                                            )}
                                            
                                            {/* Native Regions */}
                                            {event.herbSpecies?.nativeRegions && (
                                                <div className="bg-white rounded-xl p-4 border border-orange-200">
                                                    {renderArray(event.herbSpecies.nativeRegions, "Native Regions")}
                                                </div>
                                            )}
                                            
                                            {/* Parts Used */}
                                            {event.herbSpecies?.partsUsed && (
                                                <div className="bg-white rounded-xl p-4 border border-orange-200">
                                                    {renderArray(event.herbSpecies.partsUsed, "Parts Used")}
                                                </div>
                                            )}
                                        </div>

                                        {/* Collection Notes */}
                                        {event.notes && (
                                            <div className="bg-white rounded-xl p-6 border border-orange-200 mt-6">
                                                <h4 className="text-lg font-bold text-orange-900 mb-3 flex items-center">
                                                    <span className="text-2xl mr-2">📝</span>
                                                    Collection Notes
                                                </h4>
                                                <p className="text-orange-900 leading-relaxed">{event.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Supply Chain Events */}
                {hasData(data?.entityData?.supplyChainEvents) && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-6">
                            <div className="flex items-center">
                                <div className="text-4xl mr-4">🚚</div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Supply Chain Journey</h2>
                                    <p className="text-purple-100">Track the product's journey through the supply chain</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <div className="space-y-6">
                                {data.entityData.supplyChainEvents.map((event, index) => (
                                    <div key={event.eventId} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-purple-900">{event.eventType}</h3>
                                                    <p className="text-purple-700">{formatDate(event.timestamp)}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </div>
                                        
                                        {event.description && (
                                            <p className="text-purple-900 mb-4">{event.description}</p>
                                        )}
                                        
                                        {event.location && (
                                            <div className="bg-white rounded-lg p-4 border border-purple-200">
                                                <div className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">Location</div>
                                                <div className="text-sm font-semibold text-purple-900">{event.location}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Scan Information */}
                {data?.scanInfo && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-700 to-slate-800 px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="text-4xl mr-4">📊</div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Scan Information</h2>
                                        <p className="text-gray-300">Current scan details and statistics</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-slate-200">
                                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Last Scanned</div>
                                    <div className="text-xl font-bold text-slate-900">{formatDate(data.scanInfo.scannedAt)}</div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                    <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Total Scan Count</div>
                                    <div className="text-xl font-bold text-blue-900">{data.scanInfo.totalScans}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Complete Raw Data Section - Enhanced */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-600 to-zinc-700 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="text-4xl mr-4">🔍</div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Complete Transparency</h2>
                                    <p className="text-slate-300">Full raw data for complete verification</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8">
                        <div className="bg-gradient-to-br from-slate-50 to-zinc-50 rounded-xl p-6 border border-slate-200">
                            <details className="cursor-pointer">
                                <summary className="text-lg font-bold text-slate-700 mb-4 hover:text-slate-900 flex items-center">
                                    <span className="text-2xl mr-2">📋</span>
                                    View Complete Raw Data (JSON Format)
                                    <svg className="w-5 h-5 ml-2 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="mt-4 p-6 bg-slate-900 rounded-xl border border-slate-300 overflow-auto max-h-96">
                                    <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono leading-relaxed">
                                        {JSON.stringify(data, null, 2)}
                                    </pre>
                                </div>
                            </details>
                            
                            <div className="mt-6 text-sm text-slate-600 bg-slate-100 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="text-2xl">🛡️</div>
                                    <div>
                                        <p className="font-semibold mb-2">Complete Transparency Guarantee</p>
                                        <p>This section shows the entire raw data received from our blockchain and database systems. All structured information displayed above is extracted from this complete dataset, ensuring full transparency and verifiability in product authentication.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={clearResults}
                        className="flex-1 py-4 px-8 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <span className="text-xl mr-2">🔄</span>
                        Scan Another QR Code
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <span className="text-xl mr-2">🖨️</span>
                        Print Verification Report
                    </button>
                    <button 
                        onClick={() => {
                            const dataStr = JSON.stringify(data, null, 2);
                            const dataBlob = new Blob([dataStr], {type: 'application/json'});
                            const url = URL.createObjectURL(dataBlob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `product-verification-${data?.qrCode?.qrHash || 'data'}.json`;
                            link.click();
                        }}
                        className="flex-1 py-4 px-8 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <span className="text-xl mr-2">💾</span>
                        Download Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScanResults;