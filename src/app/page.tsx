'use client';

import React, { useState, useEffect } from 'react';
import { subjects } from '@/data/subjects';
import SubjectSelector from '@/components/SubjectSelector';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoKeypad } from 'react-icons/io5';

export default function Home() {
  const router = useRouter();
  const [typedText, setTypedText] = useState('');
  const fullText = 'Hệ Thống Học Tập Cho Bé';

  // Typing animation for hero title
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎓</span>
              <span className="text-base font-bold text-gray-800">VietTyping</span>
            </div>
            <Link
              href="/typing"
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
            >
              <IoKeypad className="text-lg" />
              Luyện gõ phím
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-6xl mb-5">🎓</div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 h-14 md:h-16">
            {typedText}
            <span className="animate-pulse text-blue-200">|</span>
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Học các môn Đạo đức, Âm nhạc, Toán, Tiếng Việt, Hoạt động trải nghiệm,
            Tiếng Anh, Tự nhiên và xã hội, Mỹ thuật một cách thú vị
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {[
              { icon: '📚', label: '8 môn học' },
              { icon: '🎯', label: 'Hoạt động tương tác' },
              { icon: '⌨️', label: 'Luyện gõ phím' },
              { icon: '🎮', label: 'Trò chơi học tập' },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Grid — directly visible, no button click needed */}
      <SubjectSelector
        subjects={subjects}
        onSelectSubject={(subject) => {
          router.push(`/subjects/${subject.id}`);
        }}
      />

      {/* Footer */}
      <div className="text-center py-8 text-sm text-gray-400">
        Dành cho học sinh lớp 1-5 • VietTyping
      </div>
    </div>
  );
}
