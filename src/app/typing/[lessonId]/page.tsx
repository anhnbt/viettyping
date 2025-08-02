'use client';

import React, { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { lessons } from '@/data/lessons';
import TypingPractice from '@/components/TypingPractice';
import Link from 'next/link';
import { IoArrowBack, IoArrowForward } from 'react-icons/io5';

interface Props {
  params: {
    lessonId: string;
  };
}

interface Stats {
  wpm: number;
  accuracy: number;
  incorrectCount: number;
}

export default function LessonPage({ params }: Props) {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [showStats, setShowStats] = useState(false);

  const lesson = lessons.find((l) => l.id === params.lessonId);

  if (!lesson) {
    notFound();
  }

  const handleLessonComplete = (newStats: Stats) => {
    setStats(newStats);
    setShowStats(true);
  };

  const getNextLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
    return lessons[currentIndex + 1] || null;
  };

  const handleNextLesson = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      router.push(`/typing/${nextLesson.id}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-medium transition-colors bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
          >
            📚 Học các môn
          </Link>
          <Link
            href="/typing"
            className="px-6 py-3 rounded-lg font-medium transition-colors bg-blue-500 text-white"
          >
            ⌨️ Luyện gõ phím
          </Link>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/typing')}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              <IoArrowBack className="text-xl" />
              <span>Quay lại</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold">{lesson.title}</h1>
          {getNextLesson() && (
            <button
              onClick={handleNextLesson}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              <span>Tiếp theo</span>
              <IoArrowForward className="text-xl" />
            </button>
          )}
        </div>

        <TypingPractice lesson={lesson} onComplete={handleLessonComplete} />

        {showStats && stats && (
          <div className="mt-8 p-6 bg-green-100 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Kết quả</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Tốc độ</p>
                <p className="text-2xl font-bold">{stats.wpm} WPM</p>
              </div>
              <div>
                <p className="text-gray-600">Độ chính xác</p>
                <p className="text-2xl font-bold">{stats.accuracy}%</p>
              </div>
              <div>
                <p className="text-gray-600">Số lỗi</p>
                <p className="text-2xl font-bold text-red-500">
                  {stats.incorrectCount}
                </p>
              </div>
            </div>

            {getNextLesson() && (
              <button
                onClick={handleNextLesson}
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Bài tiếp theo
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
