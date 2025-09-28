import React from 'react';

// Main Loading Spinner Component
const LoadingSpinner = ({ 
    size = 'medium', 
    color = 'emerald', 
    text, 
    className = '',
    fullScreen = false 
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'h-4 w-4';
            case 'large':
                return 'h-12 w-12';
            case 'xlarge':
                return 'h-16 w-16';
            default: // medium
                return 'h-8 w-8';
        }
    };

    const getColorClasses = () => {
        switch (color) {
            case 'blue':
                return 'border-blue-600';
            case 'red':
                return 'border-red-600';
            case 'amber':
                return 'border-amber-600';
            case 'gray':
                return 'border-gray-600';
            default: // emerald
                return 'border-emerald-600';
        }
    };

    const spinnerClasses = `animate-spin rounded-full border-2 border-gray-200 ${getSizeClasses()} ${getColorClasses()} ${className}`;
    const textClasses = 'text-gray-600 font-medium text-sm sm:text-base';

    const containerClasses = fullScreen 
        ? 'fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50'
        : 'flex flex-col items-center justify-center';

    return (
        <div className={containerClasses}>
            <div className={spinnerClasses} style={{ borderTopColor: 'transparent' }}></div>
            {text && (
                <p className={`mt-4 ${textClasses}`}>
                    {text}
                </p>
            )}
        </div>
    );
};

// Skeleton Loading Component
const SkeletonLoader = ({ 
    type = 'text', // 'text', 'card', 'avatar', 'image', 'table'
    rows = 3, 
    className = '' 
}) => {
    const baseClasses = 'animate-pulse bg-gray-200 rounded';

    const renderSkeleton = () => {
        switch (type) {
            case 'avatar':
                return (
                    <div className={`${baseClasses} rounded-full h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14`} />
                );
            
            case 'image':
                return (
                    <div className={`${baseClasses} h-32 w-full sm:h-40 lg:h-48`} />
                );
            
            case 'card':
                return (
                    <div className={`${baseClasses} p-3 sm:p-4 lg:p-6`}>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="h-10 w-10 bg-gray-300 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <div className="h-4 bg-gray-300 rounded w-3/4" />
                                <div className="h-3 bg-gray-300 rounded w-1/2" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-full" />
                            <div className="h-4 bg-gray-300 rounded w-5/6" />
                            <div className="h-4 bg-gray-300 rounded w-4/6" />
                        </div>
                    </div>
                );
            
            case 'table':
                return (
                    <div className="space-y-3">
                        {/* Table header */}
                        <div className="flex space-x-4">
                            <div className="h-4 bg-gray-300 rounded w-1/4" />
                            <div className="h-4 bg-gray-300 rounded w-1/4" />
                            <div className="h-4 bg-gray-300 rounded w-1/4" />
                            <div className="h-4 bg-gray-300 rounded w-1/4" />
                        </div>
                        {/* Table rows */}
                        {Array.from({ length: rows }).map((_, index) => (
                            <div key={index} className="flex space-x-4">
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                            </div>
                        ))}
                    </div>
                );
            
            default: // text
                return (
                    <div className="space-y-2">
                        {Array.from({ length: rows }).map((_, index) => (
                            <div 
                                key={index} 
                                className={`h-4 ${baseClasses} ${
                                    index === rows - 1 ? 'w-3/4' : 'w-full'
                                }`} 
                            />
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className={className}>
            {renderSkeleton()}
        </div>
    );
};

// Button Loading State
const LoadingButton = ({ 
    loading = false, 
    children, 
    className = '', 
    variant = 'primary',
    ...props 
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'secondary':
                return 'bg-gray-600 hover:bg-gray-700 text-white';
            case 'outline':
                return 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50';
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 text-white';
            default: // primary
                return 'bg-emerald-600 hover:bg-emerald-700 text-white';
        }
    };

    const buttonClasses = `inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-sm lg:px-6 lg:py-3 lg:text-base ${getVariantClasses()} ${className}`;

    return (
        <button 
            className={buttonClasses}
            disabled={loading}
            {...props}
        >
            {loading && (
                <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                >
                    <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                    />
                    <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
};

// Page Loading Component  
const PageLoader = ({ message = 'Loading...' }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="text-center max-w-sm sm:max-w-md lg:max-w-lg">
                <div className="mb-6">
                    <img 
                        src="/Logo (1).png" 
                        alt="AyuTrace" 
                        className="h-16 w-16 mx-auto mb-4 animate-pulse"
                    />
                    <LoadingSpinner size="large" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {message}
                </h2>
                <p className="text-gray-600">
                    Please wait while we prepare your dashboard...
                </p>
            </div>
        </div>
    );
};

// List Loading Component
const ListLoader = ({ items = 3 }) => {
    return (
        <div className="space-y-3">
            {Array.from({ length: items }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
                    <SkeletonLoader type="avatar" />
                    <div className="flex-1">
                        <SkeletonLoader type="text" rows={2} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export { 
    LoadingSpinner, 
    SkeletonLoader, 
    LoadingButton, 
    PageLoader, 
    ListLoader 
};
export default LoadingSpinner;