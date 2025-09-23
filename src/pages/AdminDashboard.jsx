import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api';
import { useAuth } from '../contexts/AuthContext';

// Import UI Components
import TopNavigation from '../components/UI/TopNavigation';
import AdminSidebar from '../components/Admin/AdminSidebar';
import MobileNavigation from '../components/UI/MobileNavigation';

// Import Admin Dashboard Sections
import AdminHomeSection from '../components/Admin/AdminHomeSection';
import UserManagementSection from '../components/Admin/UserManagementSection';
import OrganizationManagementSection from '../components/Admin/OrganizationManagementSection';
import SupplyChainMonitoringSection from '../components/Admin/SupplyChainMonitoringSection';
import SystemAlertsSection from '../components/Admin/SystemAlertsSection';
import AdminActionsSection from '../components/Admin/AdminActionsSection';
import AnalyticsSection from '../components/Admin/AnalyticsSection';

// Import Modals
import ProfileModal from '../components/Modals/ProfileModal';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    // Profile modal state for top bar
    const [showProfile, setShowProfile] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [profileData, setProfileData] = useState(null);

    // Profile modal handler for top bar
    const handleProfileClick = async () => {
        setShowProfile(true);
        setProfileLoading(true);
        setProfileError('');
        try {
            const response = await getProfile();
            setProfileData(response);
        } catch (err) {
            setProfileError('Failed to fetch profile: ' + (err.message || 'Unknown error'));
        } finally {
            setProfileLoading(false);
        }
    };
    
    const closeProfile = () => {
        setShowProfile(false);
        setProfileData(null);
        setProfileError('');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return <AdminHomeSection />;
            case 'Users':
                return <UserManagementSection />;
            case 'Organizations':
                return <OrganizationManagementSection />;
            case 'Supply Chain':
                return <SupplyChainMonitoringSection />;
            case 'Alerts':
                return <SystemAlertsSection />;
            case 'Admin Actions':
                return <AdminActionsSection />;
            case 'Analytics':
                return <AnalyticsSection />;
            default:
                return (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center bg-white rounded-xl shadow-sm p-12">
                            <h2 className="text-2xl text-gray-600 mb-4">Select a section from the sidebar</h2>
                            <p className="text-gray-500">Choose an option from the navigation to get started</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            {/* Top Navigation */}
            <TopNavigation 
                handleProfileClick={handleProfileClick}
                handleLogout={logout}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Admin Sidebar */}
                <AdminSidebar 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4 sm:p-6">
                    {renderContent()}
                </main>

                {/* Mobile Navigation */}
                <MobileNavigation 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    type="admin"
                />
            </div>

            {/* Profile Modal */}
            {showProfile && (
                <ProfileModal
                    isOpen={showProfile}
                    onClose={closeProfile}
                    profileData={profileData}
                    loading={profileLoading}
                    error={profileError}
                />
            )}
        </div>
    );
}