import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  animal?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, animal }) => {
  return (
    <div className="w-full bg-[#e2e8f0] rounded-full h-8 border-3 border-slate-800 shadow-[inset_0_4px_6px_rgba(0,0,0,0.1)] relative overflow-visible flex items-center px-0.5">
      {/* Vạch kẻ đường nét đứt chạy dọc đường đua */}
      <div className="absolute inset-x-4 border-t-2 border-dashed border-white/40 top-1/2 -translate-y-1/2 pointer-events-none" />

      <motion.div
        className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      {animal && (
        <>
          {/* Cờ đích */}
          <span className="absolute right-2 text-xl select-none z-10 animate-pulse">🏁</span>
          
          {/* Con thú chạy nhún nhảy */}
          <motion.div
            className="absolute text-3xl select-none filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.2)] z-20 cursor-default"
            animate={{ 
              left: `calc(${progress}% - 24px)`,
              y: [-3, 3, -3]
            }}
            transition={{ 
              left: { type: 'spring', stiffness: 60, damping: 12 },
              y: { repeat: Infinity, duration: 0.5, ease: "easeInOut" }
            }}
            style={{ left: 0, top: '-6px' }}
          >
            {animal}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ProgressBar;
