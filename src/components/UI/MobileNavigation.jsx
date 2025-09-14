import React from 'react';

const MobileNavigation = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { key: 'Home', label: '🏠', text: 'Home' },
        { key: 'Your Goods', label: '📦', text: 'Goods' },
        { key: 'Verify', label: '✅', text: 'Verify' },
        { key: 'Add Goods', label: '➕', text: 'Add' },
        { key: 'Check Blockchain', label: '⛓️', text: 'Chain' }
    ];

    return (
        <div className="lg:hidden bg-white border-t border-gray-200 flex-shrink-0 safe-area-bottom">
            <div className="flex justify-around py-2 sm:py-3">
                {menuItems.map((item) => (
                    <button 
                        key={item.key}
                        onClick={() => setActiveTab(item.key)} 
                        className={`flex-1 text-center py-1 sm:py-2 transition-colors min-w-0 ${
                            activeTab === item.key ? 'text-emerald-600 font-semibold' : 'text-gray-600'
                        }`}
                    >
                        <div className="text-lg sm:text-xl leading-tight">{item.label}</div>
                        <div className="text-xs leading-tight mt-0.5">{item.text}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileNavigation;