"use client";

import React from "react";
import Link from "next/link";
import { IoChevronBack, IoStar } from "react-icons/io5";
import confetti from "canvas-confetti";
import lessonDataJson from "@/data/sample_lesson.json";
import { LessonConfig } from "@/types/lesson";
import { useLesson } from "@/contexts/LessonContext";
import { useSound } from "@/contexts/SoundContext";
import { useStudent } from "@/contexts/StudentContext";
import LessonCoordinator from "@/components/lesson/LessonCoordinator";

// Cast JSON to our validated type
const lessonData = lessonDataJson as LessonConfig;

export default function LessonPage() {
  const { currentXP, addXP, markActivityCompleted, unlockBadge } = useLesson();
  const { studentInfo } = useStudent();
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
    <div className="canvas-bg bg-background text-foreground transition-colors min-h-screen font-sans overflow-y-auto flex flex-col pb-12">
      {/* Main Content với LessonCoordinator */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 relative z-10 w-full max-w-none mx-auto px-4 md:px-8">
        <LessonCoordinator
          config={lessonData}
          studentNickname={studentInfo?.nickname}
          currentXP={currentXP}
          onAllActivitiesComplete={handleAllActivitiesComplete}
        />
      </main>
    </div>
  );
}
