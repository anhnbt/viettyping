'use client';

import React, { useState, useCallback } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useTypingLessons } from '@/contexts/TypingLessonsContext';
import { useStudent } from '@/contexts/StudentContext';
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
  const { queueProgress } = useStudent();
  const { lessons, isLoading } = useTypingLessons();
  const [stats, setStats] = useState<Stats | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const resolvedParams = React.use(params);
  const lesson = lessons.find((l) => l.id === resolvedParams.lessonId);

  const getNextLesson = useCallback(() => {
    if (!lesson) return null;
    const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
    return lessons[currentIndex + 1] || null;
  }, [lesson, lessons]);

  const handleLessonComplete = useCallback((telemetry: TelemetryPayload) => {
    const wpmValue = telemetry.metadata?.wpm || 0;
    const newStats = {
      wpm: wpmValue,
      accuracy: telemetry.score,
      incorrectCount: telemetry.metadata?.incorrectCount || 0,
    };
    setStats(newStats);
    setShowModal(true);

    try {
      // 1. Lưu danh sách bài học đã hoàn thành
      const completedList = JSON.parse(localStorage.getItem('typing_completed_lessons') || '[]');
      if (!completedList.includes(resolvedParams.lessonId)) {
        completedList.push(resolvedParams.lessonId);
        localStorage.setItem('typing_completed_lessons', JSON.stringify(completedList));
      }

      // 2. Đẩy tiến độ học tập vào hàng đợi đồng bộ offline-first
      queueProgress(resolvedParams.lessonId, telemetry.score, wpmValue, telemetry.score);
    } catch (err) {
      console.error('Failed to queue typing progress:', err);
    }
  }, [resolvedParams.lessonId, queueProgress]);

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

  if (isLoading) {
    return (
      <main className={`min-h-screen bg-gradient-to-b from-[var(--color-background)] to-[var(--color-surface)] py-6 flex items-center justify-center ${plusJakartaSans.className}`}>
        <div className="text-center p-8 bg-[var(--color-surface)] border-3 border-[var(--color-foreground)] rounded-3xl shadow-[6px_6px_0px_0px_var(--color-foreground)] max-w-sm">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-foreground)] font-black text-lg">Đang tải bài học...</p>
        </div>
      </main>
    );
  }

  if (!lesson) {
    notFound();
  }

  return (
    <main className={`min-h-screen bg-gradient-to-b from-[var(--color-background)] to-[var(--color-surface)] py-6 ${plusJakartaSans.className}`}>
      <div className="w-full px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/typing')}
              className="keycap-btn-surface px-5 py-3 text-sm"
            >
              <IoArrowBack className="text-xl mr-1" />
              <span>Quay lại đảo</span>
            </button>
          </div>
          <h1 className={`text-3xl md:text-4xl font-black text-[var(--color-foreground)] text-center ${plusJakartaSans.className}`}>
            {lesson.title}
          </h1>
          {getNextLesson() ? (
            <button
              onClick={handleNextLesson}
              className="keycap-btn-primary px-5 py-3 text-sm"
            >
              <span>Tiếp theo</span>
              <IoArrowForward className="text-xl ml-1" />
            </button>
          ) : (
            <div className="w-[120px] hidden md:block"></div>
          )}
        </div>

        <div className="bg-[var(--color-surface)]/80 backdrop-blur-md rounded-3xl p-6 shadow-[6px_6px_0px_0px_var(--color-foreground)] border-3 border-[var(--color-foreground)] mb-8">
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

