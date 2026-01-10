import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSpoilageAlerts, dismissSpoilageAlert } from '../../../api';

/**
 * SpoilageAlerts Component
 * Displays active spoilage risk alerts from IoT sensors
 */
export default function SpoilageAlerts({ theme, onRefresh }) {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch alerts on mount and set up polling
    useEffect(() => {
        fetchAlerts();

        // Poll for new alerts every 15 seconds
        const pollInterval = setInterval(fetchAlerts, 15000);

        return () => clearInterval(pollInterval);
    }, []);

    const fetchAlerts = async () => {
        try {
            const response = await getSpoilageAlerts();
            if (response?.success && response?.data?.alerts) {
                setAlerts(response.data.alerts);
            } else {
                setAlerts([]);
            }
            setError(null);
        } catch (err) {
            console.error('Failed to fetch spoilage alerts:', err);
            // Don't show error for non-critical polling
            if (!alerts.length) {
                setError('Unable to fetch alerts');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = async (alertId) => {
        try {
            await dismissSpoilageAlert(alertId);
            setAlerts(prev => prev.filter(a => a.alertId !== alertId));
        } catch (err) {
            console.error('Failed to dismiss alert:', err);
        }
    };

    const getSeverityStyles = (severity) => {
        switch (severity) {
            case 'CRITICAL':
                return {
                    bg: 'bg-red-50 border-red-300',
                    icon: '🔴',
                    badge: 'bg-red-100 text-red-800 border-red-200',
                    text: 'text-red-800'
                };
            case 'HIGH':
                return {
                    bg: 'bg-orange-50 border-orange-300',
                    icon: '🟠',
                    badge: 'bg-orange-100 text-orange-800 border-orange-200',
                    text: 'text-orange-800'
                };
            case 'MEDIUM':
                return {
                    bg: 'bg-yellow-50 border-yellow-300',
                    icon: '🟡',
                    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    text: 'text-yellow-800'
                };
            default:
                return {
                    bg: 'bg-blue-50 border-blue-300',
                    icon: '🔵',
                    badge: 'bg-blue-100 text-blue-800 border-blue-200',
                    text: 'text-blue-800'
                };
        }
    };

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${theme?.colors?.card || 'bg-white'} rounded-2xl p-6 border border-gray-200/50`}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🌡️</span>
                        <h3 className="text-lg font-semibold text-gray-800">IoT Sensor Alerts</h3>
                    </div>
                </div>
                <div className="animate-pulse space-y-3">
                    <div className="h-16 bg-gray-100 rounded-xl"></div>
                    <div className="h-16 bg-gray-100 rounded-xl"></div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${theme?.colors?.card || 'bg-white'} rounded-2xl p-6 ${theme?.shadows?.soft || 'shadow-lg'} border border-gray-200/50`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🌡️</span>
                    <h3 className="text-lg font-semibold text-gray-800">IoT Sensor Alerts</h3>
                    {alerts.length > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            {alerts.length}
                        </span>
                    )}
                </div>
                <button
                    onClick={fetchAlerts}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Refresh alerts"
                >
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            {/* Alert List */}
            <AnimatePresence>
                {alerts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                    >
                        <div className="text-4xl mb-3">✅</div>
                        <p className="text-gray-600 font-medium">No Spoilage Alerts</p>
                        <p className="text-sm text-gray-500">All batches are within safe temperature and humidity ranges.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {alerts.map((alert, index) => {
                            const styles = getSeverityStyles(alert.severity);

                            return (
                                <motion.div
                                    key={alert.alertId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`${styles.bg} rounded-xl p-4 border-2 relative overflow-hidden`}
                                >
                                    {/* Severity badge pulse for critical */}
                                    {alert.severity === 'CRITICAL' && (
                                        <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 bg-red-400 rounded-full opacity-20 animate-ping"></div>
                                    )}

                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xl">{styles.icon}</span>
                                                <span className={`${styles.badge} px-2 py-0.5 rounded-full text-xs font-bold border`}>
                                                    {alert.severity}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>

                                            <h4 className={`font-semibold ${styles.text} mb-1`}>
                                                ⚠️ {alert.message}
                                            </h4>

                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <span>🌡️</span>
                                                    <span className="font-medium">{alert.temperature}°C</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span>💧</span>
                                                    <span className="font-medium">{alert.humidity}%</span>
                                                </span>
                                                <span className="flex items-center gap-1 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                                                    Batch: {alert.batchId?.substring(0, 8)}...
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDismiss(alert.alertId)}
                                            className="ml-2 p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                                            title="Dismiss alert"
                                        >
                                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>

            {/* Threshold Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                    Alerts trigger when: Temperature &gt; 25°C or Humidity &gt; 80%
                </p>
            </div>
        </motion.div>
    );
}
