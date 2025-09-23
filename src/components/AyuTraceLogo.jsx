import React from 'react';

// AyuTrace Logo Component
const AyuTraceLogo = ({ size = "medium", className = "", showText = true, onClick = null }) => {
  const sizes = {
    small: { icon: "h-8 w-8", text: "text-xl" },
    medium: { icon: "h-14 w-14", text: "text-4xl" },
    large: { icon: "h-20 w-20", text: "text-5xl" }
  };

  const currentSize = sizes[size] || sizes.medium;

  const LogoIcon = ({ className }) => (
    <img 
      src="/Logo (1).png" 
      alt="AyuTrace Logo" 
      className={className.replace('text-emerald-600', '') + ' object-contain'}
    />
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