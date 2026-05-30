"use client";

import React from "react";
import Link from "next/link";
import { IoChevronBack, IoStar } from "react-icons/io5";
import confetti from "canvas-confetti";
import lessonDataJson from "@/data/sample_lesson.json";
import { LessonConfig } from "@/types/lesson";
import { useLesson } from "@/contexts/LessonContext";
import { useSound } from "@/contexts/SoundContext";
import LessonCoordinator from "@/components/lesson/LessonCoordinator";

// Cast JSON to our validated type
const lessonData = lessonDataJson as LessonConfig;

export default function LessonPage() {
  const { currentXP, addXP, markActivityCompleted, unlockBadge } = useLesson();
  const { playSound } = useSound();

  const handleAllActivitiesComplete = () => {
    const rewards = lessonData.base_rewards;
    
    // 1. Cập nhật Context API
    if (rewards) {
      addXP(rewards.completion_xp);
      unlockBadge(rewards.badge_unlock_id);
    }
    markActivityCompleted("lesson_completed");

    // 2. Kích hoạt hiệu ứng pháo hoa confetti
    if (rewards?.celebration_type === "fireworks") {
      // Bắn pháo hoa rực rỡ từ nhiều phía
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Bắn từ bên trái
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#ff0055", "#00ffcc", "#ffcc00", "#9900ff"]
        });
        // Bắn từ bên phải
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#ff0055", "#00ffcc", "#ffcc00", "#9900ff"]
        });
      }, 250);
    } else {
      // Confetti đơn giản
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#ff0055", "#00ffcc", "#ffcc00", "#9900ff"]
      });
    }

    // 3. Kích hoạt âm thanh tada chúc mừng
    try {
      playSound("tada");
    } catch (e) {
      console.warn("Lỗi phát âm thanh chúc mừng:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 font-sans overflow-y-auto flex flex-col pb-12">
      {/* Header */}
      <header className="p-4 md:p-6 flex items-center justify-between relative z-10 w-full max-w-4xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl text-purple-700 font-bold hover:bg-white/90 transition-all shadow-sm border border-white/20"
        >
          <IoChevronBack size={24} />
          Quay lại
        </Link>
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/20">
          <IoStar className="text-yellow-400 text-2xl animate-pulse" />
          <span className="font-black text-purple-700 text-xl">{currentXP} XP</span>
        </div>
      </header>

      {/* Main Content với LessonCoordinator */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full max-w-4xl mx-auto">
        <LessonCoordinator
          config={lessonData}
          onAllActivitiesComplete={handleAllActivitiesComplete}
        />
      </main>

      {/* Background Decor */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
