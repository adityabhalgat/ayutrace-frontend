import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { key: 'Home', label: '🏠 Home' },
        { key: 'Your Goods', label: '📦 Your Goods' },
        { key: 'Verify', label: '✅ Verify' },
        { key: 'Add Goods', label: '➕ Add Goods' },
        { key: 'Check Blockchain', label: '⛓️ Blockchain' }
    ];

    return (
        <aside className="w-full sm:w-64 bg-white border-r border-gray-200 hidden lg:block flex-shrink-0 overflow-y-auto">
            <div className="p-3 sm:p-4">
                <nav>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.key}>
                                <button 
                                    onClick={() => setActiveTab(item.key)} 
                                    className={`w-full text-left px-3 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                                        activeTab === item.key 
                                            ? 'bg-emerald-100 text-emerald-800 font-semibold shadow-sm' 
                                            : 'hover:bg-gray-100 text-gray-700 hover:shadow-sm'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;