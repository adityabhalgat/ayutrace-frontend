import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import API functions
import { getProfile } from '../api';
import { useAuth } from '../contexts/AuthContext';

// Import New Modern Components
import ModernSidebar from '../components/Distributor/Modern/ModernSidebar';
import ModernTopbar from '../components/Distributor/Modern/ModernTopbar';
import ModernHomeSection from '../components/Distributor/Modern/ModernHomeSection';
import ModernInventorySection from '../components/Distributor/Modern/ModernInventorySection';
import ModernShipmentsSection from '../components/Distributor/Modern/ModernShipmentsSection';
import ModernAnalyticsSection from '../components/Distributor/Modern/ModernAnalyticsSection';
import ModernVerificationSection from '../components/Distributor/Modern/ModernVerificationSection';
import ProfileModal from '../components/Modals/ProfileModal';

// Modern Theme Configuration
const theme = {
  colors: {
    primary: 'from-blue-600 to-purple-600',
    secondary: 'from-emerald-500 to-teal-600',
    accent: 'from-orange-500 to-red-500',
    neutral: 'from-gray-700 to-gray-900',
    background: 'bg-gradient-to-br from-slate-50 to-blue-50',
    sidebar: 'bg-white/95 backdrop-blur-sm',
    card: 'bg-white/80 backdrop-blur-sm',
  },
  shadows: {
    soft: 'shadow-lg shadow-blue-100/50',
    medium: 'shadow-xl shadow-blue-200/25',
    strong: 'shadow-2xl shadow-blue-300/30',
  },
  animations: {
    fadeIn: { opacity: [0, 1], duration: 0.5 },
    slideIn: { x: [-20, 0], opacity: [0, 1], duration: 0.6 },
    scaleIn: { scale: [0.95, 1], opacity: [0, 1], duration: 0.4 },
  }
};

// Navigation Items with Modern Icons
const navigationItems = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: 'HomeIcon',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: 'CubeIcon',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'shipments',
    label: 'Shipments',
    icon: 'TruckIcon',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'ChartIcon',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'verification',
    label: 'Verification',
    icon: 'ShieldIcon',
    gradient: 'from-indigo-500 to-blue-600'
  }
];

export default function ModernDistributorDashboard() {
  // State Management
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        // Add initialization logic here
        console.log('Modern Distributor Dashboard initializing...');
        
        // Simulate initialization (remove timeout in production)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Modern Distributor Dashboard initialized successfully');
        setIsLoading(false);
      } catch (error) {
        console.error('Dashboard initialization error:', error);
        setIsLoading(false);
      }
    };
    
    initializeDashboard();
  }, []);

  // Profile handler
  const handleProfileClick = async () => {
    setShowProfile(true);
    setProfileLoading(true);
    setProfileError('');
    
    try {
      const response = await getProfile();
      setProfileData(response);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setProfileError('Failed to fetch profile: ' + (err.message || 'Unknown error'));
    } finally {
      setProfileLoading(false);
    }
  };

  // Render active section content
  const renderActiveSection = () => {
    const sectionProps = {
      theme,
      isLoading: false,
      onSectionChange: setActiveSection
    };

    try {
      switch (activeSection) {
        case 'home':
          return <ModernHomeSection {...sectionProps} />;
        case 'inventory':
          return <ModernInventorySection {...sectionProps} />;
        case 'shipments':
          return <ModernShipmentsSection {...sectionProps} />;
        case 'analytics':
          return <ModernAnalyticsSection {...sectionProps} />;
        case 'verification':
          return <ModernVerificationSection {...sectionProps} />;
        default:
          return <ModernHomeSection {...sectionProps} />;
      }
    } catch (error) {
      console.error('Error rendering section:', activeSection, error);
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Component Error</h3>
            <p className="text-gray-600 mb-4">Failed to load {activeSection} section</p>
            <button 
              onClick={() => setActiveSection('home')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme.colors.background} flex items-center justify-center`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-20"></div>
              <div className="relative w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Loading Dashboard
            </h3>
            <p className="text-gray-600 mt-2">Preparing your distributor experience...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.colors.background} flex relative`}>
      {/* Modern Sidebar - Hidden on mobile by default */}
      <div className={`${sidebarCollapsed ? 'hidden lg:block' : 'block'} lg:relative fixed inset-y-0 left-0 z-50`}>
        <ModernSidebar
          navigationItems={navigationItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          theme={theme}
        />
      </div>

      {/* Main Content Area - Full width on mobile */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } ml-0`}>
        {/* Modern Top Bar */}
        <ModernTopbar
          onProfileClick={handleProfileClick}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
          activeSection={activeSection}
          theme={theme}
        />

        {/* Dynamic Content Area - Responsive padding */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderActiveSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <ProfileModal
            show={showProfile}
            onClose={() => setShowProfile(false)}
            profileData={profileData}
            loading={profileLoading}
            error={profileError}
          />
        )}
      </AnimatePresence>

      {/* Mobile Overlay - Show when sidebar is open on mobile */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
}