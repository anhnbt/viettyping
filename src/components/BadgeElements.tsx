'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface StarBadgeProps {
  value: string | number;
  color?: 'orange' | 'blue' | 'yellow';
  className?: string;
  iconType?: 'star' | 'flame';
}

export const TactileStarBadge: React.FC<StarBadgeProps> = ({
  value,
  color = 'yellow',
  className = '',
  iconType
}) => {
  const getThemeClasses = () => {
    switch (color) {
      case 'orange':
        return {
          bg: 'var(--color-secondary)',
          shadow: 'var(--color-secondary-depth)',
          starColor: 'var(--color-accent)'
        };
      case 'blue':
        return {
          bg: 'var(--color-tertiary)',
          shadow: 'var(--color-tertiary-depth)',
          starColor: 'var(--color-primary)'
        };
      default:
        return {
          bg: 'var(--color-accent)',
          shadow: 'var(--color-accent-depth)',
          starColor: 'var(--color-accent)'
        };
    }
  };

  const colors = getThemeClasses();
  
  // Xác định icon hiển thị: nếu color là orange thì mặc định là flame, hoặc dùng iconType truyền vào
  const finalIconType = iconType || (color === 'orange' ? 'flame' : 'star');

  return (
    <div 
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border-[2.5px] border-slate-900 font-sans font-black text-xs select-none text-slate-900 shadow-[2px_2px_0px_0px_#0f172a] ${className}`}
      style={{ backgroundColor: colors.bg }}
    >
      {finalIconType === 'flame' ? (
        <svg 
          className="w-4 h-4 text-white filter drop-shadow-[1px_1px_0px_rgba(0,0,0,0.8)] animate-pulse" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          stroke="#0f172a" 
          strokeWidth="1.5"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
        </svg>
      ) : (
        <svg 
          className="w-4 h-4 text-white filter drop-shadow-[1px_1px_0px_rgba(0,0,0,0.8)] animate-pulse" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          stroke="#0f172a" 
          strokeWidth="1.5"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z"/>
        </svg>
      )}
      <span>{value}</span>
    </div>
  );
};

interface StatusIconProps {
  status: 'success' | 'fail';
  className?: string;
}

export const TactileStatusIcon: React.FC<StatusIconProps> = ({
  status,
  className = ''
}) => {
  const isSuccess = status === 'success';

  return (
    <div 
      className={`w-9 h-9 rounded-xl border-2.5 border-slate-900 flex items-center justify-center font-black shadow-[2.5px_2.5px_0px_0px_#0f172a] select-none ${
        isSuccess ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-secondary)] text-white'
      } ${className}`}
    >
      {isSuccess ? (
        <Check className="w-5 h-5 stroke-[4.5px]" />
      ) : (
        <X className="w-5 h-5 stroke-[4.5px]" />
      )}
    </div>
  );
};

interface RibbonBadgeProps {
  label?: string;
  color?: 'gold' | 'red';
  className?: string;
}

export const TactileRibbonBadge: React.FC<RibbonBadgeProps> = ({
  label,
  color = 'gold',
  className = ''
}) => {
  const isGold = color === 'gold';

  return (
    <div className={`relative flex flex-col items-center justify-center w-14 h-20 select-none ${className}`}>
      {/* 2 Ruy băng treo ở dưới */}
      <svg className="absolute bottom-1 w-11 h-8 text-red-500 z-0" viewBox="0 0 100 80" fill="currentColor">
        {/* Ruy băng trái */}
        <path d="M25,0 L35,60 L15,80 L5,60 Z" fill={isGold ? 'var(--color-secondary)' : 'var(--color-accent)'} stroke="#0f172a" strokeWidth="6" strokeLinejoin="round" />
        {/* Ruy băng phải */}
        <path d="M75,0 L65,60 L85,80 L95,60 Z" fill={isGold ? 'var(--color-secondary)' : 'var(--color-accent)'} stroke="#0f172a" strokeWidth="6" strokeLinejoin="round" />
      </svg>

      {/* Huy chương hình tròn viền đen ở trên */}
      <div 
        className={`w-12 h-12 rounded-full border-3 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a] z-10 ${
          isGold ? 'bg-[var(--color-accent)] text-[var(--color-accent-depth)]' : 'bg-[var(--color-secondary)] text-white'
        }`}
      >
        {isGold ? (
          <svg className="w-6 h-6 text-white filter drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5.173l2.335 4.817 5.3 1.008-3.75 3.87 1.026 5.4-4.91-2.97-4.91 2.97 1.026-5.4-3.75-3.87 5.3-1.008z"/>
          </svg>
        ) : (
          <span className="font-extrabold text-sm text-white">✓</span>
        )}
      </div>

      {label && (
        <span className="absolute -bottom-4 bg-slate-900 text-white border border-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded-full z-20 whitespace-nowrap shadow-sm">
          {label}
        </span>
      )}
    </div>
  );
};
export default TactileStarBadge;
