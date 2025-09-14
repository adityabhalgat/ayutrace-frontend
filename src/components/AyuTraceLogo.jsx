import React from 'react';

// AyuTrace Logo Component
const AyuTraceLogo = ({ size = "medium", className = "", showText = true, onClick = null }) => {
  const sizes = {
    small: { icon: "h-6 w-6", text: "text-lg" },
    medium: { icon: "h-10 w-10", text: "text-3xl" },
    large: { icon: "h-16 w-16", text: "text-4xl" }
  };

  const currentSize = sizes[size] || sizes.medium;

  const LogoIcon = ({ className }) => (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      fill="currentColor"
    >
      {/* Leaf shape with Ayurvedic symbolism */}
      <path 
        d="M50 10 C20 10, 10 30, 10 50 C10 70, 30 90, 50 90 C70 90, 90 70, 90 50 C90 30, 80 10, 50 10 Z" 
        fill="url(#leafGradient)" 
        stroke="#059669" 
        strokeWidth="2"
      />
      {/* Central vein */}
      <path 
        d="M50 20 Q50 40, 50 70" 
        stroke="#065f46" 
        strokeWidth="2" 
        fill="none"
      />
      {/* Side veins */}
      <path 
        d="M30 35 Q40 40, 50 45" 
        stroke="#065f46" 
        strokeWidth="1.5" 
        fill="none"
      />
      <path 
        d="M70 35 Q60 40, 50 45" 
        stroke="#065f46" 
        strokeWidth="1.5" 
        fill="none"
      />
      <path 
        d="M25 50 Q35 55, 50 60" 
        stroke="#065f46" 
        strokeWidth="1.5" 
        fill="none"
      />
      <path 
        d="M75 50 Q65 55, 50 60" 
        stroke="#065f46" 
        strokeWidth="1.5" 
        fill="none"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
          <stop offset="50%" stopColor="#059669" stopOpacity="1" />
          <stop offset="100%" stopColor="#047857" stopOpacity="1" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div 
      className={`flex items-center gap-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <LogoIcon className={`${currentSize.icon} text-emerald-600`} />
      {showText && (
        <span className={`${currentSize.text} font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent`}>
          AyuTrace
        </span>
      )}
    </div>
  );
};

export default AyuTraceLogo;