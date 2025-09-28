import { useState, useEffect } from 'react';

// Breakpoint definitions matching Tailwind CSS
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Custom hook for responsive design
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });

      // Determine current breakpoint
      if (width >= BREAKPOINTS['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= BREAKPOINTS.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= BREAKPOINTS.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= BREAKPOINTS.md) {
        setCurrentBreakpoint('md');
      } else if (width >= BREAKPOINTS.sm) {
        setCurrentBreakpoint('sm');
      } else {
        setCurrentBreakpoint('xs');
      }
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...screenSize,
    currentBreakpoint,
    isMobile: screenSize.width < BREAKPOINTS.md,
    isTablet: screenSize.width >= BREAKPOINTS.md && screenSize.width < BREAKPOINTS.lg,
    isDesktop: screenSize.width >= BREAKPOINTS.lg,
    isSmallScreen: screenSize.width < BREAKPOINTS.sm,
    isMediumScreen: screenSize.width >= BREAKPOINTS.sm && screenSize.width < BREAKPOINTS.lg,
    isLargeScreen: screenSize.width >= BREAKPOINTS.lg,
  };
};

// Hook for detecting mobile device
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(userAgent) || window.innerWidth < BREAKPOINTS.md);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// Hook for detecting touch device
export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouchDevice;
};

// Responsive class generator
export const getResponsiveClasses = (config) => {
  const classes = [];
  
  Object.entries(config).forEach(([breakpoint, value]) => {
    if (breakpoint === 'base' || breakpoint === 'default') {
      classes.push(value);
    } else {
      classes.push(`${breakpoint}:${value}`);
    }
  });
  
  return classes.join(' ');
};

// Container size utilities
export const getContainerClasses = (size = 'default') => {
  const containerClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md', 
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
    default: 'max-w-7xl'
  };

  return `w-full ${containerClasses[size] || containerClasses.default} mx-auto px-4 sm:px-6 lg:px-8`;
};

// Responsive grid utilities
export const getGridClasses = (columns) => {
  if (typeof columns === 'number') {
    return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4 sm:gap-6`;
  }
  
  if (typeof columns === 'object') {
    return getResponsiveClasses({
      base: 'grid grid-cols-1 gap-4',
      sm: `sm:grid-cols-${columns.sm || 2} sm:gap-6`,
      md: `md:grid-cols-${columns.md || columns.sm || 2}`,
      lg: `lg:grid-cols-${columns.lg || columns.md || columns.sm || 3}`,
      xl: `xl:grid-cols-${columns.xl || columns.lg || columns.md || 4}`
    });
  }
  
  return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6';
};

// Responsive text utilities
export const getTextClasses = (size) => {
  const textClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl'
  };
  
  return textClasses[size] || textClasses.base;
};

// Responsive spacing utilities
export const getSpacingClasses = (type, size) => {
  const spacingMap = {
    xs: { padding: 'p-2 sm:p-3', margin: 'm-2 sm:m-3' },
    sm: { padding: 'p-3 sm:p-4', margin: 'm-3 sm:m-4' },
    md: { padding: 'p-4 sm:p-6', margin: 'm-4 sm:m-6' },
    lg: { padding: 'p-6 sm:p-8', margin: 'm-6 sm:m-8' },
    xl: { padding: 'p-8 sm:p-12', margin: 'm-8 sm:m-12' }
  };
  
  return spacingMap[size]?.[type] || spacingMap.md[type];
};

// Responsive card utilities
export const getCardClasses = (variant = 'default') => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 shadow-sm';
  
  const variants = {
    default: `${baseClasses} p-4 sm:p-6`,
    elevated: `${baseClasses} p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow`,
    interactive: `${baseClasses} p-4 sm:p-6 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer`,
    compact: `${baseClasses} p-3 sm:p-4`
  };
  
  return variants[variant] || variants.default;
};

export default {
  useResponsive,
  useIsMobile,
  useIsTouchDevice,
  getResponsiveClasses,
  getContainerClasses,
  getGridClasses,
  getTextClasses,
  getSpacingClasses,
  getCardClasses,
  BREAKPOINTS
};