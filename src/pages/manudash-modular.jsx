import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api';

// Import UI Components
import TopNavigation from '../components/UI/TopNavigation';
import Sidebar from '../components/UI/Sidebar';
import MobileNavigation from '../components/UI/MobileNavigation';

// Import Dashboard Sections
import HomeSection from '../components/Dashboard/HomeSection';
import YourGoodsComponent from '../components/Dashboard/YourGoodsComponent';
import VerifyComponent from '../components/Dashboard/VerifyComponent';
import AddGoodsComponent from '../components/Dashboard/AddGoodsComponent';
import CheckBlockchainComponent from '../components/Dashboard/CheckBlockchainComponent';

// Import Modals
import ProfileModal from '../components/Modals/ProfileModal';

// Main ManufacturerDashboard Component
export default function ManufacturerDashboard() {
    const [activeTab, setActiveTab] = useState('Home');
    const navigate = useNavigate();
    
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
            console.log('Profile API Response:', response); // Debug log
            console.log('Profile data:', response.data); // Debug log
            // The response is directly the data, not wrapped in a data property
            setProfileData(response);
        } catch (err) {
            console.error('Profile fetch error:', err); // Debug log
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

    const handleLogout = () => {
        localStorage.removeItem('sessionEmail');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Home':
                return <HomeSection />;
            case 'Your Goods':
                return <YourGoodsComponent setActiveTab={setActiveTab} />;
            case 'Verify':
                return <VerifyComponent />;
            case 'Add Goods':
                return <AddGoodsComponent />;
            case 'Check Blockchain':
                return <CheckBlockchainComponent />;
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

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            {/* Top Navigation */}
            <TopNavigation 
                handleProfileClick={handleProfileClick}
                handleLogout={handleLogout}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto"> 
                    <div className="h-full px-3 sm:px-4 lg:px-6">
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* Profile Modal (Top Bar) */}
            <ProfileModal
                showProfile={showProfile}
                closeProfile={closeProfile}
                profileLoading={profileLoading}
                profileError={profileError}
                profileData={profileData}
            />

            {/* Mobile Navigation */}
            <MobileNavigation 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </div>
    );
}