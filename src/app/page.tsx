"use client";

import React, { useState } from 'react';
import { lessons, Lesson } from '@/data/lessons';
import LevelSelector from '@/components/LevelSelector';
import TypingPractice from '@/components/TypingPractice';
import SplashScreen from '@/components/SplashScreen';
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

interface Stats {
  wpm: number;
  accuracy: number;
  incorrectCount: number;
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showStats, setShowStats] = useState(false);

  const handleLessonComplete = (newStats: Stats) => {
    setStats(newStats);
    setShowStats(true);
  };

  const getNextLesson = () => {
    if (!selectedLesson) return null;
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    return lessons[currentIndex + 1] || null;
  };

  const handleNextLesson = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      setSelectedLesson(nextLesson);
      setShowStats(false);
    }
  };

  if (showSplash) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <SplashScreen onStart={() => setShowSplash(false)} />
      </main>
    );
  }

  if (!selectedLesson) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <LevelSelector
          lessons={lessons}
          onSelectLesson={setSelectedLesson}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <IoArrowBack className="text-xl" />
              <span>Quay lại</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold">{selectedLesson.title}</h1>
          {getNextLesson() && (
            <button
              onClick={handleNextLesson}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span>Tiếp theo</span>
              <IoArrowForward className="text-xl" />
            </button>
          )}
        </div>

        <TypingPractice
          lesson={selectedLesson}
          onComplete={handleLessonComplete}
        />

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
                <p className="text-2xl font-bold text-red-500">{stats.incorrectCount}</p>
              </div>
            </div>

            {getNextLesson() && (
              <button
                onClick={handleNextLesson}
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
