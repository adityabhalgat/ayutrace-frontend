import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';

const MobileNavigation = ({ activeTab, setActiveTab, type = 'distributor' }) => {
    const { isMobile, isTablet } = useResponsive();

    // Dynamic menu items based on dashboard type
    const getMenuItems = () => {
        switch (type) {
            case 'admin':
                return [
                    { key: 'Home', label: '🏠', text: 'Home', ariaLabel: 'Navigate to Home' },
                    { key: 'Users', label: '👥', text: 'Users', ariaLabel: 'Manage Users' },
                    { key: 'Organizations', label: '🏢', text: 'Orgs', ariaLabel: 'Manage Organizations' },
                    { key: 'Supply Chain', label: '🔗', text: 'Chain', ariaLabel: 'Supply Chain Monitoring' },
                    { key: 'Analytics', label: '📊', text: 'Stats', ariaLabel: 'View Analytics' }
                ];
            case 'labs':
                return [
                    { key: 'home', label: '🏠', text: 'Home', ariaLabel: 'Navigate to Home' },
                    { key: 'your-tests', label: '🧪', text: 'Tests', ariaLabel: 'Your Tests' },
                    { key: 'verify', label: '✅', text: 'Verify', ariaLabel: 'Verify Products' },
                    { key: 'add-tests', label: '➕', text: 'Add', ariaLabel: 'Add New Tests' },
                    { key: 'blockchain', label: '⛓️', text: 'Chain', ariaLabel: 'Blockchain View' }
                ];
            case 'manufacturer':
                return [
                    { key: 'Home', label: '🏠', text: 'Home', ariaLabel: 'Navigate to Home' },
                    { key: 'Your Goods', label: '📦', text: 'Goods', ariaLabel: 'Your Products' },
                    { key: 'Verify', label: '✅', text: 'Verify', ariaLabel: 'Verify Products' },
                    { key: 'Add Goods', label: '➕', text: 'Add', ariaLabel: 'Add New Products' },
                    { key: 'Check Blockchain', label: '⛓️', text: 'Chain', ariaLabel: 'Blockchain Verification' }
                ];
            default: // distributor
                return [
                    { key: 'Home', label: '🏠', text: 'Home', ariaLabel: 'Navigate to Home' },
                    { key: 'Your Goods', label: '📦', text: 'Goods', ariaLabel: 'Inventory Management' },
                    { key: 'Verify', label: '✅', text: 'Verify', ariaLabel: 'Product Verification' },
                    { key: 'Add Goods', label: '➕', text: 'Add', ariaLabel: 'Add New Inventory' },
                    { key: 'Check Blockchain', label: '⛓️', text: 'Chain', ariaLabel: 'Blockchain Records' }
                ];
        }
    };

    const menuItems = getMenuItems();

    // Using native Tailwind CSS responsive classes
    const containerClasses = 'bg-white border-t border-gray-200 flex-shrink-0 safe-area-bottom shadow-lg block md:hidden';
    
    const navClasses = 'flex justify-around py-2 md:py-3';
    
    const buttonClasses = (isActive) => `flex-1 text-center transition-all duration-200 min-w-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg mx-1 relative py-2 px-1 md:py-3 md:px-2 ${
        isActive 
            ? 'text-emerald-600 bg-emerald-50 shadow-sm transform scale-105' 
            : 'text-gray-600 hover:text-emerald-500 hover:bg-gray-50'
    }`;
    
    const iconClasses = 'block transition-transform text-lg mb-1 md:text-xl md:mb-1';
    
    const textClasses = 'font-medium truncate transition-colors text-xs md:text-sm';

    // Only show on mobile and small tablets
    if (!isMobile && !isTablet) {
        return null;
    }

    return (
        <nav 
            className={containerClasses}
            role="navigation" 
            aria-label="Mobile navigation"
        >
            <div className={navClasses}>
                {menuItems.map((item, index) => (
                    <button 
                        key={item.key}
                        onClick={() => setActiveTab(item.key)} 
                        className={buttonClasses(activeTab === item.key)}
                        aria-label={item.ariaLabel}
                        aria-current={activeTab === item.key ? 'page' : undefined}
                        title={item.ariaLabel}
                    >
                        <div className="flex flex-col items-center justify-center">
                            <span 
                                className={iconClasses}
                                role="img" 
                                aria-hidden="true"
                            >
                                {item.label}
                            </span>
                            <span className={textClasses}>
                                {item.text}
                            </span>
                        </div>
                        {activeTab === item.key && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-emerald-600 rounded-full" />
                        )}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default MobileNavigation;