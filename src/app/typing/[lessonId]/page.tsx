'use client';

import React, { useState, useCallback } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { lessons } from '@/data/lessons';
import TypingPractice, { TypingTask } from '@/components/TypingPractice';
import CompletionModal from '@/components/CompletionModal';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { TelemetryPayload } from '@/types/lesson';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800']
});

interface Props {
  params: Promise<{
    lessonId: string;
  }>;
}

interface Stats {
  wpm: number;
  accuracy: number;
  incorrectCount: number;
}

export default function LessonPage({ params }: Props) {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const resolvedParams = React.use(params);
  const lesson = lessons.find((l) => l.id === resolvedParams.lessonId);

  if (!lesson) {
    notFound();
  }

  const handleLessonComplete = useCallback((telemetry: TelemetryPayload) => {
    const newStats = {
      wpm: telemetry.metadata?.wpm || 0,
      accuracy: telemetry.score,
      incorrectCount: telemetry.metadata?.incorrectCount || 0,
    };
    setStats(newStats);
    setShowModal(true);

    // Lưu tiến trình thực tế vào localStorage để đồng bộ với danh sách bài học
    try {
      // 1. Lưu danh sách bài học đã hoàn thành
      const completedList = JSON.parse(localStorage.getItem('typing_completed_lessons') || '[]');
      if (!completedList.includes(resolvedParams.lessonId)) {
        completedList.push(resolvedParams.lessonId);
        localStorage.setItem('typing_completed_lessons', JSON.stringify(completedList));
      }

      // 2. Tính toán & Cộng thêm XP (ví dụ: gõ tốt được 100 XP, gõ xuất sắc 3 sao được 150 XP)
      const earnedXP = telemetry.score >= 90 ? 150 : 100;
      const currentXP = parseInt(localStorage.getItem('typing_xp') || '0', 10);
      localStorage.setItem('typing_xp', String(currentXP + earnedXP));

      // 3. Cập nhật Streak
      const currentStreak = parseInt(localStorage.getItem('typing_streak') || '0', 10);
      localStorage.setItem('typing_streak', String(currentStreak + 1));

      // 4. Lưu cờ Huy hiệu (Badges) dựa trên thành tích
      if (telemetry.score === 100) {
        localStorage.setItem('viettyping_badge_accuracy_100', 'true');
      }
      if ((telemetry.metadata?.wpm || 0) > 20) {
        localStorage.setItem('viettyping_badge_speed_20', 'true');
      }
    } catch (err) {
      console.error('Failed to save typing progress to localStorage:', err);
    }
  }, [resolvedParams.lessonId]);

  const getNextLesson = useCallback(() => {
    const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
    return lessons[currentIndex + 1] || null;
  }, [lesson.id]);

  const handleNextLesson = useCallback(() => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      router.push(`/typing/${nextLesson.id}`);
    }
  }, [getNextLesson, router]);

  const handleRestart = useCallback(() => {
    setShowModal(false);
    setStats(null);
    setResetKey((prev) => prev + 1);
  }, []);

  const handleContinue = useCallback(() => {
    setShowModal(false);
    setStats(null);
    const nextLesson = getNextLesson();
    if (nextLesson) {
      router.push(`/typing/${nextLesson.id}`);
    } else {
      router.push('/typing');
    }
  }, [getNextLesson, router]);

  return (
    <main className={`min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white py-6 ${plusJakartaSans.className}`}>
      <div className="w-full px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/typing')}
              className="flex items-center gap-2 px-5 py-3 bg-white text-blue-500 rounded-2xl font-bold border-2 border-blue-200 shadow-[4px_4px_0px_0px_#bfdbfe] transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <IoArrowBack className="text-xl" />
              <span>Quay lại đảo</span>
            </button>
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold text-blue-800 text-center ${plusJakartaSans.className}`}>
            {lesson.title}
          </h1>
          {getNextLesson() ? (
            <button
              onClick={handleNextLesson}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-2xl font-bold shadow-[4px_4px_0px_0px_#047857] transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <span>Tiếp theo</span>
              <IoArrowForward className="text-xl" />
            </button>
          ) : (
            <div className="w-[120px] hidden md:block"></div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-[6px_6px_0px_0px_#cbd5e1] border-2 border-gray-100 mb-8">
          <TypingPractice
            key={`${lesson.id}-${resetKey}`}
            task={lesson as unknown as TypingTask}
            onComplete={handleLessonComplete}
          />
        </div>

        {stats && (
          <CompletionModal
            isOpen={showModal}
            stats={stats}
            onRestart={handleRestart}
            onContinue={handleContinue}
            continueLabel={getNextLesson() ? 'Bài tiếp theo' : 'Quay lại danh sách'}
          />
        )}
      </div>
    </main>
  );
}

