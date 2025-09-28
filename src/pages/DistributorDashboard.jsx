import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useResponsive } from '../hooks/useResponsive';

// Import UI Components
import TopNavigation from '../components/UI/TopNavigation';
import Sidebar from '../components/UI/Sidebar';
import MobileNavigation from '../components/UI/MobileNavigation';
import { PageLoader } from '../components/UI/Loading';

// Import Dashboard Sections
import DistributorHomeSection from '../components/Dashboard/Distributor/DistributorHomeSection';
import InventoryComponent from '../components/Dashboard/Distributor/InventoryComponent';
import ModernShipmentsSection from '../components/Distributor/Modern/ModernShipmentsSection';
import AnalyticsComponent from '../components/Dashboard/Distributor/AnalyticsComponent';
import VerificationComponent from '../components/Dashboard/Distributor/VerificationComponent';
import VerifyComponent from '../components/Dashboard/VerifyComponent';

// Import Modals
import ProfileModal from '../components/Modals/ProfileModal';

// Main DistributorDashboard Component
export default function DistributorDashboard() {
    const [activeTab, setActiveTab] = useState('Home');
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
            console.log('Profile API Response:', response);
            setProfileData(response);
        } catch (err) {
            console.error('Profile fetch error:', err);
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

    // Distributor-specific sidebar items
    const sidebarItems = [
        'Home',
        'Inventory',
        'Shipments',
        'Verify',
        'Analytics',
        'Verifications'
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Home':
                return <DistributorHomeSection />;
            case 'Inventory':
                return <InventoryComponent setActiveTab={setActiveTab} />;
            case 'Shipments':
                return <ModernShipmentsSection />;
            case 'Verify':
                return <VerifyComponent />;
            case 'Analytics':
                return <AnalyticsComponent />;
            case 'Verifications':
                return <VerificationComponent />;
            default:
                return (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center bg-white rounded-xl shadow-sm p-12">
                            <h2 className="text-2xl text-gray-600 mb-4">Select a tab from the sidebar</h2>
                            <p className="text-gray-500">Choose an option from the navigation to get started</p>
                        </div>
                    </div>
                );
        }
    };

    const { isMobile, isTablet, isDesktop } = useResponsive();

    const mainContainerClasses = 'flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans';

    const contentAreaClasses = 'flex flex-1 overflow-hidden flex-col md:flex-row';

    const mainContentClasses = 'flex-1 overflow-auto';

    const contentPaddingClasses = 'h-full p-3 md:p-4 lg:p-6';

    // Show loading screen for authenticated users
    if (!user) {
        return <PageLoader message="Loading your distributor dashboard..." />;
    }

    return (
        <div className={mainContainerClasses}>
            <a href="#main-content" className="skip-to-main">
                Skip to main content
            </a>
            
            {/* Top Navigation */}
            <TopNavigation 
                handleProfileClick={handleProfileClick}
                handleLogout={logout}
            />

            <div className={contentAreaClasses}>
                {/* Sidebar */}
                <Sidebar 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    sidebarItems={sidebarItems}
                    type="distributor"
                />

                {/* Main Content */}
                <main 
                    id="main-content"
                    className={mainContentClasses}
                    role="main"
                    aria-label="Distributor dashboard content"
                >
                    <div className={contentPaddingClasses}>
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* Mobile Navigation */}
            <MobileNavigation 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                type="distributor"
            />

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