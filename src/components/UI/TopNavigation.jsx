import React from 'react';
import { SearchIcon, UserIcon } from '../UI/Icons';
import { useResponsive } from '../../hooks/useResponsive';

const TopNavigation = ({ handleProfileClick, handleLogout }) => {
    const { isMobile } = useResponsive();

    // Using native Tailwind CSS responsive classes instead of getResponsiveClasses
    const navClasses = 'bg-white shadow-sm flex-shrink-0 border-b border-gray-100 h-14 md:h-16';
    
    const containerClasses = 'w-full h-full px-3 md:px-4 lg:px-6';
    
    const logoClasses = 'object-contain transition-transform hover:scale-105 h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20';
    
    const titleClasses = 'ml-2 font-semibold text-gray-900 transition-colors text-lg md:text-xl';
    
    const buttonGroupClasses = 'flex items-center space-x-2 md:space-x-3 lg:space-x-4';
    
    const iconButtonClasses = 'hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 p-1.5 md:p-2';
    
    const iconClasses = 'text-gray-400 hover:text-emerald-600 transition-colors h-5 w-5 lg:h-6 lg:w-6';
    
    const logoutButtonClasses = 'text-gray-700 hover:text-red-600 transition-all duration-200 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium text-xs px-2 py-1 ml-1 md:text-sm md:px-3 md:py-1.5 md:ml-2 lg:px-4 lg:py-2 lg:ml-3';

    return (
        <nav className={navClasses} role="navigation" aria-label="Main navigation">
            <div className={containerClasses}>
                <div className="flex justify-between items-center h-full">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <button 
                            className="flex items-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg p-1"
                            aria-label="Home"
                        >
                            <img 
                                src="/Logo (1).png" 
                                alt="Logo" 
                                className={logoClasses}
                            />
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className={buttonGroupClasses}>
                        {!isMobile && (
                            <button 
                                className={iconButtonClasses}
                                aria-label="Search"
                                title="Search"
                            >
                                <SearchIcon className={iconClasses} />
                            </button>
                        )}
                        
                        <button
                            onClick={handleProfileClick}
                            className={iconButtonClasses}
                            title="View Profile"
                            aria-label="User Profile"
                        >
                            <UserIcon className={`${iconClasses} hover:text-emerald-600`} />
                        </button>
                        
                        <button 
                            onClick={handleLogout}
                            className={logoutButtonClasses}
                            aria-label="Logout"
                        >
                            {isMobile ? 'Exit' : 'Logout'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavigation;