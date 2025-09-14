import React from 'react';
import { LeafIcon, SearchIcon, UserIcon } from '../UI/Icons';

const TopNavigation = ({ handleProfileClick, handleLogout }) => {
    return (
        <nav className="bg-white shadow-sm h-14 sm:h-16 flex-shrink-0">
            <div className="w-full h-full">
                <div className="flex justify-between items-center h-full px-3 sm:px-4">
                    <div className="flex px-1 sm:px-2 lg:px-0">
                        <div className="flex items-center">
                            <LeafIcon className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
                            <span className="ml-2 text-lg sm:text-xl font-semibold text-gray-900">AyuTrace</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:ml-4">
                        <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <SearchIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                        </button>
                        <button
                            onClick={handleProfileClick}
                            className="p-1 sm:p-2 focus:outline-none hover:bg-gray-100 rounded-full transition-colors"
                            title="View Profile"
                        >
                            <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-emerald-600 transition-colors" />
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="ml-2 sm:ml-4 text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors px-2 py-1 sm:px-3 sm:py-1 rounded-md hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavigation;