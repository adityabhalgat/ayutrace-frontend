import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';

const ResponsiveCard = ({ 
    title, 
    subtitle, 
    value, 
    icon, 
    trend, 
    trendValue, 
    onClick, 
    className = '',
    variant = 'default', // 'default', 'success', 'warning', 'error', 'info'
    loading = false,
    children 
}) => {
    const { isMobile, isTablet, isDesktop } = useResponsive();

    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return 'bg-emerald-50 border border-emerald-200 hover:border-emerald-300';
            case 'warning':
                return 'bg-amber-50 border border-amber-200 hover:border-amber-300';
            case 'error':
                return 'bg-red-50 border border-red-200 hover:border-red-300';
            case 'info':
                return 'bg-blue-50 border border-blue-200 hover:border-blue-300';
            default:
                return 'bg-white border border-gray-200 hover:border-gray-300';
        }
    };

    const cardClasses = `rounded-xl shadow-sm transition-all duration-200 hover:shadow-md p-4 md:p-5 lg:p-6 ${getVariantStyles()} ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
    } ${className}`;

    const headerClasses = 'flex items-start justify-between mb-2 md:mb-3 lg:mb-4';

    const iconClasses = `rounded-lg p-2 text-lg md:text-xl lg:text-2xl ${
        variant === 'success' ? 'bg-emerald-100 text-emerald-600' :
        variant === 'warning' ? 'bg-amber-100 text-amber-600' :
        variant === 'error' ? 'bg-red-100 text-red-600' :
        variant === 'info' ? 'bg-blue-100 text-blue-600' :
        'bg-gray-100 text-gray-600'
    }`;

    const titleClasses = 'font-semibold text-gray-900 line-clamp-2 text-sm md:text-base lg:text-lg';

    const subtitleClasses = 'text-gray-500 line-clamp-1 text-xs md:text-sm';

    const valueClasses = 'font-bold text-gray-900 text-xl md:text-2xl lg:text-3xl';

    const trendClasses = `inline-flex items-center px-2 py-1 rounded-full font-medium text-xs lg:text-sm ${
        trend === 'up' ? 'bg-emerald-100 text-emerald-800' :
        trend === 'down' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
    }`;

    if (loading) {
        return (
            <div className={cardClasses}>
                <div className="animate-pulse">
                    <div className={headerClasses}>
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                    {trendValue && (
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div 
            className={cardClasses}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick();
                }
            } : undefined}
        >
            <div className={headerClasses}>
                <div className="flex-1 min-w-0">
                    {title && (
                        <h3 className={titleClasses}>
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <p className={subtitleClasses}>
                            {subtitle}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className={iconClasses}>
                        {typeof icon === 'string' ? (
                            <span role="img" aria-hidden="true">{icon}</span>
                        ) : (
                            icon
                        )}
                    </div>
                )}
            </div>

            {value && (
                <div className={valueClasses}>
                    {value}
                </div>
            )}

            {trendValue && (
                <div className="mt-2">
                    <span className={trendClasses}>
                        {trend === 'up' && (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                        {trend === 'down' && (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                        {trendValue}
                    </span>
                </div>
            )}

            {children && (
                <div className="mt-4">
                    {children}
                </div>
            )}
        </div>
    );
};

const ResponsiveCardGrid = ({ children, className = '' }) => {
    const gridClasses = `grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`;

    return (
        <div className={gridClasses}>
            {children}
        </div>
    );
};

export { ResponsiveCard, ResponsiveCardGrid };
export default ResponsiveCard;