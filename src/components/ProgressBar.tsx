import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-white/50 backdrop-blur-sm rounded-full h-6 border-4 border-white/60 shadow-inner overflow-hidden relative">
      <motion.div
        className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

export default ProgressBar;
