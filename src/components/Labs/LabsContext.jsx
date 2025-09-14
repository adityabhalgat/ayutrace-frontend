import React, { createContext, useContext } from 'react';

const LabsContext = createContext();

export const useLabsNavigation = () => {
    const context = useContext(LabsContext);
    if (!context) {
        throw new Error('useLabsNavigation must be used within a LabsProvider');
    }
    return context;
};

export const LabsProvider = ({ children, activeTab, setActiveTab }) => {
    const navigateTo = (tabId) => {
        setActiveTab(tabId);
    };

    const value = {
        activeTab,
        navigateTo,
        // Helper functions for common navigation actions
        goToHome: () => navigateTo('home'),
        goToYourTests: () => navigateTo('your-tests'),
        goToAddTests: () => navigateTo('add-tests'),
        goToVerify: () => navigateTo('verify'),
        goToBlockchain: () => navigateTo('blockchain')
    };

    return (
        <LabsContext.Provider value={value}>
            {children}
        </LabsContext.Provider>
    );
};