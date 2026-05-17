"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoStar } from "react-icons/io5";
import lessonData from "@/data/sample_lesson.json";
import { useLesson } from "@/contexts/LessonContext";
import ProgressBar from "@/components/ProgressBar";
import TypingPractice from "@/components/TypingPractice";
import StatsSummary from "@/components/StatsSummary";

export default function TypingController() {
  const { typing_practice, summary_config } = lessonData;
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [overallStats, setOverallStats] = useState({ wpmSum: 0, accuracySum: 0, incorrectTotal: 0 });
  const router = useRouter();

  const { currentXP, progress, addXP, markActivityCompleted } = useLesson();

  const currentTask = typing_practice[currentTaskIndex];

  const handleTaskComplete = (stats: { wpm: number; accuracy: number; incorrectCount: number }) => {
    // Add XP for completing a typing task
    addXP(10); 
    setOverallStats(prev => ({
      wpmSum: prev.wpmSum + stats.wpm,
      accuracySum: prev.accuracySum + stats.accuracy,
      incorrectTotal: prev.incorrectTotal + stats.incorrectCount
    }));

    if (currentTaskIndex < typing_practice.length - 1) {
      // Small delay before moving to next task
      setTimeout(() => {
        setCurrentTaskIndex((prev) => prev + 1);
      }, 1500);
    } else {
      // Completed all typing tasks
      markActivityCompleted("typing_practice");
      // Go to summary or mini games
      setTimeout(() => {
        if (summary_config?.show_typing_summary) {
          setShowSummary(true);
        } else {
          router.push("/lesson/games");
        }
      }, 1500);
    }
  };

  const avgStats = {
    wpm: Math.round(overallStats.wpmSum / typing_practice.length) || 0,
    accuracy: Math.round(overallStats.accuracySum / typing_practice.length) || 0,
    incorrectCount: overallStats.incorrectTotal
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
            Quay lại Flashcards
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
        <AnimatePresence mode="wait">
          {showSummary ? (
            <StatsSummary 
              key="summary"
              stats={avgStats}
              message={summary_config?.celebration_message || "Tuyệt vời!"}
              onContinue={() => router.push("/lesson/games")}
            />
          ) : (
            <motion.div
              key={currentTaskIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-4xl bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 flex flex-col items-center min-h-[500px] justify-center text-center"
            >
              <h2 className="text-3xl font-black text-purple-700 mb-2 capitalize">
                Luyện gõ: {currentTask.type === "word" ? "Từ vựng" : "Câu"}
              </h2>
              <p className="text-lg text-purple-600 mb-6 font-medium bg-purple-100 px-4 py-1 rounded-full">
                {currentTask.description}
              </p>
              
              <div className="w-full flex-1">
                <TypingPractice task={currentTask} onComplete={handleTaskComplete} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Background Decor */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
