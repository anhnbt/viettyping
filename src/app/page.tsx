'use client';

import { useState } from 'react';
import TypingPractice from '@/components/TypingPractice';
import { lessons } from '@/data/lessons';

export default function Home() {
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);

  const handleLessonComplete = (wpm: number, accuracy: number) => {
    console.log(`Lesson completed! WPM: ${wpm}, Accuracy: ${accuracy}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Luyện Gõ Phím Tiếng Việt
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Chọn bài học:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['basic', 'intermediate', 'advanced'].map((level) => (
              <div key={level} className="space-y-2">
                <h3 className="font-medium capitalize">{level}</h3>
                {lessons
                  .filter((lesson) => lesson.level === level)
                  .map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full p-2 text-left rounded ${
                        selectedLesson.id === lesson.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {lesson.title}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </div>

        <TypingPractice
          lesson={selectedLesson}
          onComplete={handleLessonComplete}
        />
      </div>
    </main>
  );
}
