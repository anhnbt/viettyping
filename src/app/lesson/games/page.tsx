"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoStar, IoRibbon } from "react-icons/io5";
import confetti from "canvas-confetti";
import lessonDataJson from "@/data/sample_lesson.json";
import { LessonConfig } from "@/types/lesson";
import { useLesson } from "@/contexts/LessonContext";
import ProgressBar from "@/components/ProgressBar";
import LessonRunner from "@/components/lesson/LessonRunner";

// Cast JSON to our validated type
const lessonData = lessonDataJson as LessonConfig;

export default function GameControllerPage() {
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const router = useRouter();
  const { currentXP, progress, addXP, markActivityCompleted, unlockBadge } = useLesson();

  const handleGameComplete = (gameId: string, score: number, duration: number) => {
    // Record intermediate progress if desired
    console.log(`Completed game ${gameId} with score ${score} in ${duration}s`);
  };

  const handleAllGamesComplete = (summary: { totalScore: number; totalDuration: number }) => {
    // 1. Phân bổ tổng XP
    addXP(lessonData.base_rewards.completion_xp);
    // Lưu lại trạng thái hoàn thành activity (hoặc lesson)
    markActivityCompleted("all_games");

    // 2. Confetti
    if (lessonData.base_rewards.celebration_type === "fireworks") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      });
    }

    // 3. Play Cheer Sound
    try {
      const cheerAudio = new Audio('/cheer.mp3');
      cheerAudio.volume = 0.5;
      cheerAudio.play().catch(e => console.warn("Audio play failed:", e));
    } catch (error) {
      console.warn("Audio not supported", error);
    }

    // 4. Unlock Badge
    unlockBadge(lessonData.base_rewards.badge_unlock_id);

    // 5. Show Popup
    setShowCompletionPopup(true);
  };

  const handleFinishLesson = () => {
    setShowCompletionPopup(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 font-sans overflow-hidden flex flex-col">
      {/* Header with Progress Bar */}
      <header className="p-4 md:p-6 flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <Link
            href="/lesson"
            className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl text-purple-700 font-bold hover:bg-white/90 transition-all shadow-sm"
          >
            <IoChevronBack size={24} />
            Quay lại
          </Link>
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm">
            <IoStar className="text-yellow-400 text-2xl" />
            <span className="font-black text-purple-700 text-xl">{currentXP} XP</span>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar progress={progress} />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <LessonRunner 
          config={lessonData} 
          onGameComplete={handleGameComplete}
          onAllGamesComplete={handleAllGamesComplete} 
        />
      </main>
      
      {/* Background Decor */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Completion Popup */}
      <AnimatePresence>
        {showCompletionPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-400 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-200/50 to-transparent pointer-events-none" />
              
              <motion.div 
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-400/40"
              >
                <IoRibbon className="text-white text-5xl" />
              </motion.div>

              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-2">
                Hoàn thành xuất sắc!
              </h2>
              
              <p className="text-gray-600 mb-6 font-medium">
                Bạn nhận được Huy hiệu:<br/>
                <span className="text-xl font-bold text-purple-600 block mt-2">
                  {lessonData.base_rewards.badge_name_vi}
                </span>
              </p>

              <div className="bg-purple-50 rounded-2xl p-4 mb-6">
                <div className="text-sm text-purple-600 font-bold mb-1">Phần thưởng XP</div>
                <div className="text-3xl font-black text-purple-700">+{lessonData.base_rewards.completion_xp} XP</div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFinishLesson}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black text-xl px-8 py-4 rounded-2xl shadow-[0_6px_0_0_#065f46] hover:shadow-[0_3px_0_0_#065f46] transition-all hover:translate-y-1 active:shadow-none active:translate-y-2"
              >
                Tuyệt vời!
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
