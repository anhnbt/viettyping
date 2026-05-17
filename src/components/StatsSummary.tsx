"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { IoSpeedometerOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoPlayForwardOutline } from "react-icons/io5";

interface StatsSummaryProps {
  stats: {
    wpm: number;
    accuracy: number;
    incorrectCount: number;
  };
  message: string;
  onContinue: () => void;
}

export default function StatsSummary({ stats, message, onContinue }: StatsSummaryProps) {
  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-2xl w-full flex flex-col items-center border-4 border-yellow-300 relative overflow-hidden"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="text-6xl mb-4"
      >
        🏆
      </motion.div>
      
      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-2 text-center">
        Tuyệt Vời!
      </h2>
      <p className="text-2xl font-bold text-purple-600 mb-8 text-center">{message}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 rounded-2xl p-6 flex flex-col items-center shadow-inner border border-blue-100"
        >
          <IoSpeedometerOutline className="text-4xl text-blue-500 mb-2" />
          <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">Tốc Độ</span>
          <div className="text-3xl font-black text-blue-600">{stats.wpm} <span className="text-lg">WPM</span></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-green-50 rounded-2xl p-6 flex flex-col items-center shadow-inner border border-green-100"
        >
          <IoCheckmarkCircleOutline className="text-4xl text-green-500 mb-2" />
          <span className="text-sm font-bold text-green-400 uppercase tracking-wider">Chính Xác</span>
          <div className="text-3xl font-black text-green-600">{stats.accuracy}%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-red-50 rounded-2xl p-6 flex flex-col items-center shadow-inner border border-red-100"
        >
          <IoCloseCircleOutline className="text-4xl text-red-500 mb-2" />
          <span className="text-sm font-bold text-red-400 uppercase tracking-wider">Gõ Sai</span>
          <div className="text-3xl font-black text-red-600">{stats.incorrectCount}</div>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-2xl font-black shadow-[0_8px_0_0_#a855f7] hover:translate-y-1 hover:shadow-[0_4px_0_0_#a855f7] transition-all z-10"
      >
        Tiếp Tục Học!
        <IoPlayForwardOutline size={28} />
      </motion.button>
      
      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl" />
    </motion.div>
  );
}
