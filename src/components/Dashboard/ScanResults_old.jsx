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
            'CREATED': 'bg-blue-100 text-blue-800',
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'APPROVED': 'bg-green-100 text-green-800',
            'REJECTED': 'bg-red-100 text-red-800',
            'IN_PROGRESS': 'bg-purple-100 text-purple-800',
            'COMPLETED': 'bg-emerald-100 text-emerald-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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
        <div className="mt-10 -mx-8 px-8">
            <div className="space-y-8">
                {/* Header Section */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">QR Code Verified Successfully</h3>
                    <p className="text-gray-600 text-lg">Complete product information and traceability data</p>
                </div>

                {/* QR Code Basic Info */}
                {data?.qrCode && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M12 16h.01M8 12h.01" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-emerald-800">QR Code Information</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-emerald-100">
                                <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">QR Hash</div>
                                <div className="text-sm font-mono text-gray-900 break-all">{data.qrCode.qrHash}</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-emerald-100">
                                <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">Entity Type</div>
                                <div className="text-sm font-semibold text-gray-900">{data.qrCode.entityType.replace(/_/g, ' ')}</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-emerald-100">
                                <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">Scan Count</div>
                                <div className="text-lg font-bold text-gray-900">{data.qrCode.scanCount}</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-emerald-100">
                                <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">Created</div>
                                <div className="text-sm font-semibold text-gray-900">{formatDate(data.qrCode.createdAt)}</div>
                            </div>
                        </div>
                        
                        {/* Custom Data */}
                        {data.qrCode.customData && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-emerald-100">
                                {renderJsonData(data.qrCode.customData, "Custom Data")}
                            </div>
                        )}
                    </div>
                )}

                {/* Entity Data */}
                {data?.entityData && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                {data.qrCode.entityType === 'FINISHED_GOOD' ? (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                )}
                            </div>
                            <h4 className="text-xl font-bold text-blue-800">
                                {data.qrCode.entityType === 'RAW_MATERIAL_BATCH' ? 'Raw Material Details' : 
                                 data.qrCode.entityType === 'FINISHED_GOOD' ? 'Finished Product Details' : 
                                 'Entity Details'}
                            </h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {/* Finished Good Fields */}
                            {data.entityData.batchNumber && (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Batch Number</div>
                                    <div className="text-sm font-mono text-gray-900 break-all">{data.entityData.batchNumber}</div>
                                </div>
                            )}
                            {data.entityData.productName && (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Product Name</div>
                                    <div className="text-base font-semibold text-gray-900">{data.entityData.productName}</div>
                                </div>
                            )}
                            {data.entityData.productType && (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Product Type</div>
                                    <div className="text-sm font-semibold text-gray-900">{data.entityData.productType}</div>
                                </div>
                            )}
                            {data.entityData.quantity && (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Quantity</div>
                                    <div className="text-base font-semibold text-gray-900">{data.entityData.quantity} {data.entityData.unit}</div>
                                </div>
                            )}
                            {data.entityData.expiryDate && (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Expiry Date</div>
                                    <div className="text-sm text-gray-900">{formatDate(data.entityData.expiryDate)}</div>
                                </div>
                            )}
                            {data.entityData.manufacturer && (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Manufacturer</div>
                                    <div className="text-sm font-semibold text-gray-900">
                                        {data.entityData.manufacturer.firstName} {data.entityData.manufacturer.lastName}
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">{data.entityData.manufacturer.orgType}</div>
                                </div>
                            )}
                            
                            {/* Raw Material Fields */}
                            {data.entityData.batchId && (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Batch ID</div>
                                    <div className="text-sm font-mono text-gray-900">{data.entityData.batchId}</div>
                                </div>
                            )}
                            {data.entityData.herbName && (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Herb Name</div>
                                    <div className="text-base font-semibold text-gray-900">{data.entityData.herbName}</div>
                                </div>
                            )}
                            {data.entityData.scientificName && (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Scientific Name</div>
                                    <div className="text-sm italic text-gray-700">{data.entityData.scientificName}</div>
                                </div>
                            )}
                            
                            {/* Common Fields */}
                            {data.entityData.status && (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Status</div>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                        data.entityData.status === 'CREATED' ? 'bg-green-100 text-green-800' :
                                        data.entityData.status === 'IN_PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                                        data.entityData.status === 'PROCESSED' ? 'bg-blue-100 text-blue-800' :
                                        data.entityData.status === 'QUARANTINED' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {data.entityData.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            )}
                            {data.entityData.createdAt && (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Created Date</div>
                                    <div className="text-sm text-gray-900">{formatDate(data.entityData.createdAt)}</div>
                                </div>
                            )}
                            {data.entityData.updatedAt && (
                                <div className="bg-white rounded-lg p-4 border border-blue-100">
                                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Last Updated</div>
                                    <div className="text-sm text-gray-900">{formatDate(data.entityData.updatedAt)}</div>
                                </div>
                            )}
                        </div>
                        
                        {/* Composition */}
                        {hasData(data.entityData.composition) && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-blue-100">
                                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-3">Product Composition</div>
                                <div className="space-y-2">
                                    {data.entityData.composition.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                                            <span className="text-sm font-medium text-gray-900">{item.name || item.ingredient || item.herbName || 'Ingredient'}</span>
                                            <span className="text-sm text-blue-600 font-semibold">
                                                {item.percentage ? `${item.percentage}%` : item.quantity ? `${item.quantity} ${item.unit || ''}` : 'N/A'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {data.entityData.description && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-blue-100">
                                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Description</div>
                                <p className="text-sm text-gray-700 leading-relaxed">{data.entityData.description}</p>
                            </div>
                        )}
                        
                        {data.entityData.notes && (
                            <div className="mt-4 bg-white rounded-lg p-4 border border-blue-100">
                                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Additional Notes</div>
                                <p className="text-sm text-gray-700 leading-relaxed">{data.entityData.notes}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Collection Events */}
                {hasData(data?.entityData?.collectionEvents) && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-green-800">Collection Events ({data.entityData.collectionEvents.length})</h4>
                        </div>
                        
                        <div className="space-y-6">
                            {data.entityData.collectionEvents.map((event, index) => (
                                <div key={event.eventId} className="bg-white rounded-lg p-6 border border-green-100 shadow-sm">
                                    <div className="flex items-center mb-4">
                                        <span className="bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full mr-3">
                                            Event {index + 1}
                                        </span>
                                        <span className="text-sm text-gray-600">{formatDate(event.collectionDate)}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                                        {event.location && (
                                            <div>
                                                <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Location</div>
                                                <div className="text-sm text-gray-900">{event.location}</div>
                                            </div>
                                        )}
                                        {event.latitude && event.longitude && (
                                            <div>
                                                <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Coordinates</div>
                                                <div className="text-sm text-gray-900">{event.latitude}, {event.longitude}</div>
                                            </div>
                                        )}
                                        {event.quantity && (
                                            <div>
                                                <div className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">Quantity Collected</div>
                                                <div className="text-sm font-semibold text-gray-900">{event.quantity} {event.unit}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Farmer Information */}
                                    {event.farmer && (
                                        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-100">
                                            <div className="text-sm font-medium text-green-700 mb-2">👨‍🌾 Farmer Information</div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <span className="text-xs text-green-600 font-medium">Name: </span>
                                                    <span className="text-sm text-gray-900">{event.farmer.firstName} {event.farmer.lastName}</span>
                                                </div>
                                                {event.farmer.phone && (
                                                    <div>
                                                        <span className="text-xs text-green-600 font-medium">Phone: </span>
                                                        <span className="text-sm text-gray-900">{event.farmer.phone}</span>
                                                    </div>
                                                )}
                                                {event.farmer.location && (
                                                    <div className="md:col-span-2">
                                                        <span className="text-xs text-green-600 font-medium">Location: </span>
                                                        <span className="text-sm text-gray-900">{event.farmer.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Herb Species Information */}
                                    {event.herbSpecies && (
                                        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="text-sm font-medium text-blue-700 mb-2">🌿 Herb Species Information</div>
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-xs text-blue-600 font-medium">Common Name: </span>
                                                    <span className="text-sm text-gray-900">{event.herbSpecies.commonName}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-blue-600 font-medium">Scientific Name: </span>
                                                    <span className="text-sm italic text-gray-900">{event.herbSpecies.scientificName}</span>
                                                </div>
                                                {event.herbSpecies.family && (
                                                    <div>
                                                        <span className="text-xs text-blue-600 font-medium">Family: </span>
                                                        <span className="text-sm text-gray-900">{event.herbSpecies.family}</span>
                                                    </div>
                                                )}
                                                {event.herbSpecies.description && (
                                                    <div>
                                                        <span className="text-xs text-blue-600 font-medium">Description: </span>
                                                        <span className="text-sm text-gray-700">{event.herbSpecies.description}</span>
                                                    </div>
                                                )}
                                                {hasData(event.herbSpecies.medicinalUses) && (
                                                    <div>
                                                        <span className="text-xs text-blue-600 font-medium">Medicinal Uses: </span>
                                                        <span className="text-sm text-gray-900">{event.herbSpecies.medicinalUses.join(', ')}</span>
                                                    </div>
                                                )}
                                                {hasData(event.herbSpecies.partsUsed) && (
                                                    <div>
                                                        <span className="text-xs text-blue-600 font-medium">Parts Used: </span>
                                                        <span className="text-sm text-gray-900">{event.herbSpecies.partsUsed.join(', ')}</span>
                                                    </div>
                                                )}
                                                {event.herbSpecies.harvestingSeason && (
                                                    <div>
                                                        <span className="text-xs text-blue-600 font-medium">Harvesting Season: </span>
                                                        <span className="text-sm text-gray-900">{event.herbSpecies.harvestingSeason}</span>
                                                    </div>
                                                )}
                                                {event.herbSpecies.conservationStatus && (
                                                    <div>
                                                        <span className="text-xs text-blue-600 font-medium">Conservation Status: </span>
                                                        <span className={`text-sm font-medium ${
                                                            event.herbSpecies.conservationStatus === 'LEAST_CONCERN' ? 'text-green-600' :
                                                            event.herbSpecies.conservationStatus === 'VULNERABLE' ? 'text-yellow-600' :
                                                            event.herbSpecies.conservationStatus === 'ENDANGERED' ? 'text-red-600' :
                                                            'text-gray-600'
                                                        }`}>
                                                            {event.herbSpecies.conservationStatus.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Quality Notes */}
                                    {event.qualityNotes && (
                                        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                            <div className="text-sm font-medium text-yellow-700 mb-2">🔬 Quality Assessment</div>
                                            {renderJsonData(event.qualityNotes, "Quality Metrics")}
                                        </div>
                                    )}

                                    {/* Event Notes */}
                                    {event.notes && (
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Event Notes</div>
                                            <p className="text-sm text-gray-700">{event.notes}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Supply Chain Events */}
                {hasData(data?.entityData?.supplyChainEvents) && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-purple-800">Supply Chain Events ({data.entityData.supplyChainEvents.length})</h4>
                        </div>
                        
                        <div className="space-y-4">
                            {data.entityData.supplyChainEvents.map((event, index) => (
                                <div key={event.eventId} className="bg-white rounded-lg p-6 border border-purple-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <span className="bg-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full mr-3">
                                                {event.eventType.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-sm text-gray-600">{formatDate(event.timestamp)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {event.fromLocation && (
                                            <div>
                                                <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">From</div>
                                                <div className="text-sm text-gray-900">{event.fromLocation}</div>
                                            </div>
                                        )}
                                        {event.toLocation && (
                                            <div>
                                                <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">To</div>
                                                <div className="text-sm text-gray-900">{event.toLocation}</div>
                                            </div>
                                        )}
                                        {event.handler && (
                                            <div>
                                                <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Handler</div>
                                                <div className="text-sm text-gray-900">{event.handler.firstName} {event.handler.lastName}</div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {event.notes && (
                                        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">Notes</div>
                                            <p className="text-sm text-gray-700">{event.notes}</p>
                                        </div>
                                    )}
                                    
                                    {event.custody && (
                                        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            {renderJsonData(event.custody, "Custody Information")}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Traceability Data */}
                {data?.traceabilityData && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-orange-800">Complete Traceability Chain</h4>
                        </div>
                        
                        {/* Raw Material Batches */}
                        {hasData(data.traceabilityData.rawMaterialBatches) && (
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <h5 className="text-lg font-bold text-green-800">Raw Material Batches Used</h5>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.traceabilityData.rawMaterialBatches.map((batch, index) => (
                                        <div key={index} className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-xs font-medium text-green-600 uppercase tracking-wide">Herb Name</div>
                                                        <div className="text-base font-semibold text-gray-900">{batch.herbName}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs font-medium text-green-600 uppercase tracking-wide">Percentage</div>
                                                        <div className="text-lg font-bold text-green-700">{batch.percentage}%</div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-green-600 font-medium">Batch ID: </span>
                                                        <span className="text-gray-900 font-mono text-xs break-all">{batch.batchId}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-green-600 font-medium">Quantity Used: </span>
                                                        <span className="text-gray-900 font-semibold">{batch.quantityUsed} units</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Source Farmers */}
                        {hasData(data.traceabilityData.sourceFarmers) && (
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h5 className="text-lg font-bold text-blue-800">Source Farmers ({data.traceabilityData.sourceFarmers.length})</h5>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.traceabilityData.sourceFarmers.map((farmer, index) => (
                                        <div key={index} className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 font-bold text-lg">👨‍🌾</span>
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-semibold text-gray-900">
                                                            {farmer.firstName} {farmer.lastName}
                                                        </div>
                                                        <div className="text-sm text-blue-600">{farmer.phone}</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <span className="text-blue-600 font-medium">Location: </span>
                                                        <span className="text-gray-700">{farmer.location}</span>
                                                    </div>
                                                    {farmer.email && (
                                                        <div>
                                                            <span className="text-blue-600 font-medium">Email: </span>
                                                            <span className="text-gray-700">{farmer.email}</span>
                                                        </div>
                                                    )}
                                                    {farmer.farmSize && (
                                                        <div>
                                                            <span className="text-blue-600 font-medium">Farm Size: </span>
                                                            <span className="text-gray-700">{farmer.farmSize}</span>
                                                        </div>
                                                    )}
                                                    {farmer.certifications && hasData(farmer.certifications) && (
                                                        <div>
                                                            <span className="text-blue-600 font-medium">Certifications: </span>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {farmer.certifications.map((cert, certIndex) => (
                                                                    <span key={certIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                        {cert}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Source Herbs */}
                        {hasData(data.traceabilityData.sourceHerbs) && (
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h5 className="text-lg font-bold text-emerald-800">Source Herbs ({data.traceabilityData.sourceHerbs.length})</h5>
                                </div>
                                <div className="space-y-4">
                                    {data.traceabilityData.sourceHerbs.map((herb, index) => (
                                        <div key={index} className="bg-white rounded-lg p-6 border border-emerald-200 shadow-sm">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <div>
                                                        <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">Common Name</div>
                                                        <div className="text-lg font-semibold text-gray-900">{herb.commonName}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">Scientific Name</div>
                                                        <div className="text-sm italic text-gray-700">{herb.scientificName}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">Family</div>
                                                        <div className="text-sm text-gray-900">{herb.family}</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    {herb.conservationStatus && (
                                                        <div>
                                                            <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">Conservation Status</div>
                                                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                                                herb.conservationStatus === 'LEAST_CONCERN' ? 'bg-green-100 text-green-800' :
                                                                herb.conservationStatus === 'VULNERABLE' ? 'bg-yellow-100 text-yellow-800' :
                                                                herb.conservationStatus === 'ENDANGERED' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {herb.conservationStatus.replace(/_/g, ' ')}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {herb.harvestingSeason && (
                                                        <div>
                                                            <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">Harvesting Season</div>
                                                            <div className="text-sm text-gray-900">{herb.harvestingSeason}</div>
                                                        </div>
                                                    )}
                                                    {hasData(herb.medicinalUses) && (
                                                        <div>
                                                            <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">Medicinal Uses</div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {herb.medicinalUses.map((use, useIndex) => (
                                                                    <span key={useIndex} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                                                                        {use}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {herb.description && (
                                                <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                                    <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">Description</div>
                                                    <p className="text-sm text-gray-700 leading-relaxed">{herb.description}</p>
                                                </div>
                                            )}
                                            
                                            {hasData(herb.partsUsed) && (
                                                <div className="mt-4">
                                                    <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-2">Parts Used</div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {herb.partsUsed.map((part, partIndex) => (
                                                            <span key={partIndex} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                                {part}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* General Traceability Data (fallback) */}
                        {!data.traceabilityData.rawMaterialBatches && !data.traceabilityData.sourceFarmers && !data.traceabilityData.sourceHerbs && (
                            <div className="bg-white rounded-lg p-6 border border-orange-100">
                                {renderJsonData(data.traceabilityData, "Traceability Information")}
                            </div>
                        )}
                    </div>
                )}

                {/* Scan Information */}
                {data?.scanInfo && (
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800">Scan Information</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Scanned At</div>
                                <div className="text-sm font-semibold text-gray-900">{formatDate(data.scanInfo.scannedAt)}</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Total Scans</div>
                                <div className="text-lg font-bold text-gray-900">{data.scanInfo.totalScans}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Raw Data Section - Shows ALL remaining data for complete transparency */}
                <div className="bg-gradient-to-r from-slate-50 to-zinc-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h4 className="text-xl font-bold text-slate-800">Complete Raw Data</h4>
                        <span className="ml-2 text-sm text-slate-600">(Full Transparency)</span>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-slate-100">
                        <details className="cursor-pointer">
                            <summary className="text-sm font-medium text-slate-700 mb-3 hover:text-slate-900">
                                🔍 Click to view complete scan result data (JSON format)
                            </summary>
                            <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200 overflow-auto">
                                <pre className="text-xs text-slate-800 whitespace-pre-wrap font-mono leading-relaxed">
                                    {JSON.stringify(data, null, 2)}
                                </pre>
                            </div>
                        </details>
                    </div>
                    
                    <div className="mt-4 text-xs text-slate-600 bg-slate-100 rounded-lg p-3">
                        <p><strong>Complete Transparency:</strong> This section shows the entire raw data received from the blockchain and database to ensure full transparency in product verification. All structured data above is extracted from this complete dataset.</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                    <button 
                        onClick={clearResults}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-sm"
                    >
                        🔄 Scan Another QR Code
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
                    >
                        🖨️ Print Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScanResults;