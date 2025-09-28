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
        let isComponentMounted = true;
        
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    if (isComponentMounted) {
                        setLoading(false);
                    }
                    return;
                }

                const response = await getProfile();
                if (response.success && isComponentMounted) {
                    setUser(response.data);
                } else if (isComponentMounted) {
                    // Invalid token, remove it
                    localStorage.removeItem('token');
                    setError('Authentication failed');
                }
            } catch (err) {
                console.error('Auth check failed:', err);
                if (isComponentMounted) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('userRole');
                    setError('Authentication failed');
                }
            } finally {
                if (isComponentMounted) {
                    setLoading(false);
                }
            }
        };

        checkAuth();
        
        return () => {
            isComponentMounted = false;
        };
    }, []);

    const logout = () => {
        console.log('Logout function called - clearing localStorage and user state');
        
        // Clear all auth-related data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        
        // Update auth state
        setUser(null);
        setError('');
        
        // Use window.location.replace for a more forceful redirect
        window.location.replace('/');
    };

    const login = (userData, token) => {
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userRole', userData.orgType);
        
        // Update state
        setUser(userData);
    };

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            const response = await getProfile();
            if (response.success) {
                setUser(response.data);
            } else {
                localStorage.removeItem('token');
                setError('Authentication failed');
            }
        } catch (err) {
            console.error('Auth refresh failed:', err);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
            setError('Authentication failed');
        }
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};