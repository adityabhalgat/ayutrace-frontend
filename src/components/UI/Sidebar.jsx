import React, { useState } from 'react';
import { useResponsive } from '../../hooks/useResponsive';

const Sidebar = ({ activeTab, setActiveTab, sidebarItems, type = 'distributor', collapsed = false }) => {
    const { isMobile, isTablet, isDesktop } = useResponsive();
    const [isCollapsed, setIsCollapsed] = useState(collapsed);

    // Default menu items if none provided via props
    const getDefaultMenuItems = () => {
        switch (type) {
            case 'admin':
                return [
                    { key: 'Home', icon: '🏠', label: 'Home', description: 'Dashboard overview' },
                    { key: 'Users', icon: '👥', label: 'User Management', description: 'Manage system users' },
                    { key: 'Organizations', icon: '�', label: 'Organizations', description: 'Manage organizations' },
                    { key: 'Supply Chain', icon: '🔗', label: 'Supply Chain', description: 'Monitor supply chain' },
                    { key: 'System Alerts', icon: '🚨', label: 'System Alerts', description: 'View system alerts' },
                    { key: 'Analytics', icon: '📊', label: 'Analytics', description: 'View analytics and reports' }
                ];
            case 'labs':
                return [
                    { key: 'home', icon: '�🏠', label: 'Home', description: 'Dashboard overview' },
                    { key: 'your-tests', icon: '🧪', label: 'Your Tests', description: 'Manage lab tests' },
                    { key: 'verify', icon: '✅', label: 'Verify', description: 'Verify products' },
                    { key: 'add-tests', icon: '➕', label: 'Add Tests', description: 'Add new tests' },
                    { key: 'blockchain', icon: '⛓️', label: 'Blockchain', description: 'Blockchain records' }
                ];
            case 'manufacturer':
                return [
                    { key: 'Home', icon: '🏠', label: 'Home', description: 'Dashboard overview' },
                    { key: 'Your Goods', icon: '📦', label: 'Your Goods', description: 'Manage products' },
                    { key: 'Verify', icon: '✅', label: 'Verify', description: 'Product verification' },
                    { key: 'Add Goods', icon: '➕', label: 'Add Goods', description: 'Add new products' },
                    { key: 'Check Blockchain', icon: '⛓️', label: 'Blockchain', description: 'Blockchain verification' }
                ];
            default: // distributor
                return [
                    { key: 'Home', icon: '🏠', label: 'Home', description: 'Dashboard overview' },
                    { key: 'Your Goods', icon: '📦', label: 'Your Goods', description: 'Inventory management' },
                    { key: 'Verify', icon: '✅', label: 'Verify', description: 'Product verification' },
                    { key: 'Add Goods', icon: '➕', label: 'Add Goods', description: 'Add inventory' },
                    { key: 'Check Blockchain', icon: '⛓️', label: 'Blockchain', description: 'Blockchain records' }
                ];
        }
    };

    const menuItems = sidebarItems || getDefaultMenuItems();

    const sidebarClasses = `bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto transition-all duration-300 ease-in-out hidden md:block ${
        isCollapsed ? 'w-16' : 'w-64'
    }`;

    const navClasses = 'h-full p-2 md:p-3 lg:p-4';

    const buttonClasses = (isActive) => `w-full text-left rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 text-sm lg:text-base ${
        isActive 
            ? 'bg-emerald-100 text-emerald-800 shadow-sm ring-1 ring-emerald-200' 
            : 'hover:bg-gray-100 text-gray-700 hover:shadow-sm'
    } ${isCollapsed ? 'px-2 py-3' : 'px-3 py-3'}`;

    const iconClasses = `transition-transform group-hover:scale-110 text-base md:text-lg ${isCollapsed ? 'text-xl' : 'text-lg'}`;

    const textClasses = `font-medium transition-all duration-200 text-sm lg:text-base ${isCollapsed ? 'hidden' : 'block'}`;

    const descriptionClasses = `text-xs text-gray-500 mt-0.5 transition-all duration-200 hidden md:block ${isCollapsed ? 'hidden' : 'block'}`;

    // Don't render on mobile - use MobileNavigation instead
    if (isMobile) {
        return null;
    }

    return (
        <aside 
            className={sidebarClasses}
            role="navigation"
            aria-label="Main navigation"
        >
            <div className={navClasses}>
                {/* Collapse Toggle Button */}
                {isDesktop && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <span className="text-lg">
                                {isCollapsed ? '▶️' : '◀️'}
                            </span>
                        </button>
                    </div>
                )}

                <nav>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.key}>
                                <button 
                                    onClick={() => setActiveTab(item.key)} 
                                    className={buttonClasses(activeTab === item.key)}
                                    aria-current={activeTab === item.key ? 'page' : undefined}
                                    title={isCollapsed ? item.label : item.description}
                                >
                                    <div className="flex items-center">
                                        <span 
                                            className={iconClasses}
                                            role="img"
                                            aria-hidden="true"
                                        >
                                            {item.icon}
                                        </span>
                                        <div className={`ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>
                                            <div className={textClasses}>
                                                {item.label}
                                            </div>
                                            {item.description && (
                                                <div className={descriptionClasses}>
                                                    {item.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {activeTab === item.key && !isCollapsed && (
                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-emerald-600 rounded-r-full" />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Version Info */}
                {!isCollapsed && (
                    <div className="mt-auto pt-4 border-t border-gray-200">
                        <div className="px-3 py-2 text-xs text-gray-500">
                            <div className="font-medium">v2.0</div>
                            <div>Production Ready</div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;