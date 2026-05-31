import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  animal?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, animal }) => {
  return (
    <div className="w-full bg-white/50 backdrop-blur-sm rounded-full h-6 border-2 border-slate-800 shadow-inner relative overflow-visible flex items-center">
      <motion.div
        className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      {animal && (
        <>
          {/* Cờ đích */}
          <span className="absolute right-2 text-sm select-none z-10">🏁</span>
          
          {/* Con thú chạy */}
          <motion.div
            className="absolute text-2xl select-none filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] z-20"
            animate={{ left: `calc(${progress}% - 22px)` }}
            transition={{ type: 'spring', stiffness: 50, damping: 14 }}
            style={{ left: 0, top: '-7px' }}
          >
            {animal}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ProgressBar;
