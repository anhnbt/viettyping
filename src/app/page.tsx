"use client";

import { useState } from "react";
import TypingPractice from "@/components/TypingPractice";
import SplashScreen from "@/components/SplashScreen";
import LevelSelector from "@/components/LevelSelector";
import { lessons } from "@/data/lessons";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<
    null | (typeof lessons)[0]
  >(null);

  const handleLessonComplete = (wpm: number, accuracy: number) => {
    console.log(`Lesson completed! WPM: ${wpm}, Accuracy: ${accuracy}`);
  };

  const getNextLesson = () => {
    if (!selectedLesson) return null;
    const currentIndex = lessons.findIndex((l) => l.id === selectedLesson.id);
    return currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  };

  if (showSplash) {
    return <SplashScreen onStart={() => setShowSplash(false)} />;
  }

  if (!selectedLesson) {
    return (
      <LevelSelector lessons={lessons} onSelectLesson={setSelectedLesson} />
    );
  }

  const nextLesson = getNextLesson();

  return (
    <main className="min-h-screen bg-gray-50 py-12">
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
          {nextLesson && (
            <button
              onClick={() => setSelectedLesson(nextLesson)}
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
      </div>
    </main>
  );
}
