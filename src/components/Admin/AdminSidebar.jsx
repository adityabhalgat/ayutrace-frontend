import React from 'react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { key: 'Dashboard', label: '📊 Dashboard', description: 'System overview and statistics' },
        { key: 'Users', label: '👥 User Management', description: 'Manage all system users' },
        { key: 'Organizations', label: '🏢 Organizations', description: 'CRUD operations for organizations' },
        { key: 'Supply Chain', label: '🔗 Supply Chain', description: 'Monitor supply chain events' },
        { key: 'Alerts', label: '🚨 System Alerts', description: 'View and resolve system alerts' },
        { key: 'Admin Actions', label: '📋 Admin Actions', description: 'View admin activity logs' },
        { key: 'Analytics', label: '📈 Analytics', description: 'Reports and insights' }
    ];

    return (
        <aside className="w-full sm:w-72 bg-white border-r border-gray-200 hidden lg:block flex-shrink-0 overflow-y-auto">
            <div className="p-4">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Admin Panel</h2>
                    <p className="text-sm text-gray-500">System Administration</p>
                </div>
                <nav>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.key}>
                                <button 
                                    onClick={() => setActiveTab(item.key)} 
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                                        activeTab === item.key 
                                            ? 'bg-blue-100 text-blue-800 font-semibold shadow-sm border-l-4 border-blue-600' 
                                            : 'hover:bg-gray-100 text-gray-700 hover:shadow-sm'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{item.label}</span>
                                        <span className="text-xs text-gray-500 mt-1">{item.description}</span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default AdminSidebar;