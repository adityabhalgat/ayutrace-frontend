import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from "../api";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await getProfile();
            if (response.success) {
                setUser(response.data);
            } else {
                // Invalid token, remove it
                localStorage.removeItem('token');
                setError('Authentication failed');
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
            setError('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        setUser(null);
        window.location.href = '/login';
    };

    const login = (userData, token) => {
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userRole', userData.orgType);
        
        // Update state
        setUser(userData);
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser: checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};