import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => {
  return (
    <div 
      className={`${className} flex items-center justify-center bg-gradient-to-br from-[#ffe066] to-[#f5a623] border-3 border-[#231a11] rounded-2xl shadow-[3px_3px_0px_0px_#231a11] select-none transform hover:scale-105 active:scale-95 transition-all duration-200`}
    >
      <span className="text-2xl drop-shadow-[1.5px_1.5px_0px_#231a11] translate-y-[-1px]">
        🦖
      </span>
    </div>
  );
};

export default Logo;
