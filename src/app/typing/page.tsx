'use client';

import React from 'react';
import { lessons } from '@/data/lessons';
import LevelSelector from '@/components/LevelSelector';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TypingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
      </div>

      <LevelSelector
        lessons={lessons}
        onSelectLesson={(lesson) => {
          router.push(`/typing/${lesson.id}`);
        }}
      />
    </main>
  );
}
