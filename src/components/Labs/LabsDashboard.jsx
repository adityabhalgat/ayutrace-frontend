import React, { useState } from 'react';
import { LabsProvider } from './LabsContext';
import { useAuth } from '../../contexts/AuthContext';
import AyuTraceLogo from '../AyuTraceLogo';
import LabsHome from './LabsHome';
import YourTests from './YourTests';
import AddTests from './AddTests';
import LabsVerify from './LabsVerify';
import LabsBlockchain from './LabsBlockchain';

const LabsDashboard = () => {
    const [activeTab, setActiveTab] = useState('home');
    const { user, logout } = useAuth();

    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'your-tests', label: 'Your Tests', icon: '🧪' },
        { id: 'verify', label: 'Verify', icon: '✅' },
        { id: 'add-tests', label: 'Add Tests', icon: '➕' },
        { id: 'blockchain', label: 'Blockchain', icon: '⛓️' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <LabsHome />;
            case 'your-tests':
                return <YourTests />;
            case 'verify':
                return <LabsVerify />;
            case 'add-tests':
                return <AddTests />;
            case 'blockchain':
                return <LabsBlockchain />;
            default:
                return <LabsHome />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-lg border-b border-cyan-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <AyuTraceLogo size="small" showText={false} />
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                    AyuTrace Labs Platform
                                </h1>
                                <p className="text-gray-600 text-sm">Quality Testing & Verification Dashboard</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">
                                    {user?.organization?.type || 'Registered Testing Lab'}
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {user?.organization?.name || 'Partner Testing Lab'}
                                </p>
                            </div>
                            
                            {/* User Profile Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {user?.firstName?.[0]?.toUpperCase() || '🔬'}
                                        </span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                </button>
                                
                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="py-2">
                                        <button 
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            🚪 Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8 py-4">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    activeTab === item.id
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105'
                                        : 'text-gray-600 hover:text-cyan-600 hover:bg-cyan-50'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <LabsProvider activeTab={activeTab} setActiveTab={setActiveTab}>
                    {renderContent()}
                </LabsProvider>
            </div>
        </div>
    );
};

export default LabsDashboard;