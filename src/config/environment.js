// Production environment constants
export const environment = {
  // Current mode detection
  mode: import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  isStaging: import.meta.env.MODE === 'staging',
};

export const ENV_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },

  // App Configuration
  APP: {
    NAME: 'AyuTrace',
    VERSION: '1.0.0',
    DESCRIPTION: 'Ayurvedic Medicine Supply Chain Traceability Platform',
    AUTHOR: 'AyuTrace Team',
    CONTACT: 'support@ayutrace.com'
  },

  // Feature Flags
  FEATURES: {
    BLOCKCHAIN_INTEGRATION: true,
    QR_CODE_GENERATION: true,
    REAL_TIME_TRACKING: true,
    ANALYTICS_DASHBOARD: true,
    MOBILE_APP_SUPPORT: true,
    MULTI_LANGUAGE: false, // For future implementation
    DARK_MODE: true,
    NOTIFICATIONS: true
  },

  // Security Configuration
  SECURITY: {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    PASSWORD_MIN_LENGTH: 8,
    BCRYPT_ROUNDS: 12
  },

  // UI Configuration
  UI: {
    THEME: {
      PRIMARY_COLOR: '#10B981', // Emerald green
      SECONDARY_COLOR: '#3B82F6', // Blue
      ACCENT_COLOR: '#8B5CF6', // Purple
      ERROR_COLOR: '#EF4444', // Red
      WARNING_COLOR: '#F59E0B', // Amber
      SUCCESS_COLOR: '#10B981' // Emerald
    },
    BREAKPOINTS: {
      SM: '640px',
      MD: '768px',
      LG: '1024px',
      XL: '1280px',
      '2XL': '1536px'
    },
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 5000
  },

  // Performance Configuration
  PERFORMANCE: {
    LAZY_LOADING_THRESHOLD: 100,
    PAGINATION_SIZE: 20,
    SEARCH_DEBOUNCE: 300,
    IMAGE_OPTIMIZATION: true,
    CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
  },

  // Monitoring and Analytics
  MONITORING: {
    ERROR_REPORTING: import.meta.env.PROD,
    PERFORMANCE_TRACKING: import.meta.env.PROD,
    USER_ANALYTICS: import.meta.env.PROD,
    DEBUG_MODE: import.meta.env.DEV
  }
};

// Environment-specific settings
export const getEnvironmentConfig = () => {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;

  return {
    ...ENV_CONFIG,
    API: {
      ...ENV_CONFIG.API,
      BASE_URL: isProduction 
        ? 'https://api.ayutrace.com/api' 
        : 'http://localhost:3000/api'
    },
    MONITORING: {
      ...ENV_CONFIG.MONITORING,
      ERROR_REPORTING: isProduction,
      PERFORMANCE_TRACKING: isProduction,
      USER_ANALYTICS: isProduction,
      DEBUG_MODE: isDevelopment
    }
  };
};

export default ENV_CONFIG;