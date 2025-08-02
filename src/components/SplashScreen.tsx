import React, { useState, useEffect } from 'react';
import { IoPlayOutline } from 'react-icons/io5';

interface Props {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: Props) {
  const [text, setText] = useState('');
  const fullText = 'Hệ Thống Học Tập Cho Bé';

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      {/* Logo và tiêu đề */}
      <div className="text-center mb-12">
        <div className="text-8xl mb-6">🎓</div>
        <h1 className="text-5xl font-bold mb-4 h-20 text-gray-800">
          {text}
          <span className="animate-blink text-blue-500">|</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Học các môn Đạo đức, Âm nhạc, Toán, Tiếng Việt, Hoạt động trải nghiệm,
          Tiếng Anh, Tự nhiên và xã hội, Mỹ thuật một cách thú vị
        </p>
      </div>

      {/* Các tính năng nổi bật */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl">
        <div className="text-center p-4">
          <div className="text-3xl mb-2">📚</div>
          <p className="text-sm text-gray-600">8 môn học</p>
        </div>
        <div className="text-center p-4">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-sm text-gray-600">Hoạt động tương tác</p>
        </div>
        <div className="text-center p-4">
          <div className="text-3xl mb-2">⌨️</div>
          <p className="text-sm text-gray-600">Luyện gõ phím</p>
        </div>
        <div className="text-center p-4">
          <div className="text-3xl mb-2">🎮</div>
          <p className="text-sm text-gray-600">Trò chơi học tập</p>
        </div>
      </div>

      {/* Nút bắt đầu */}
      <button
        onClick={onStart}
        className="mt-8 px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xl font-bold
          hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 
          shadow-lg cursor-pointer flex items-center gap-3"
      >
        <IoPlayOutline className="text-2xl" />
        <span>Bắt đầu học ngay!</span>
      </button>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-gray-500">
        <p className="text-sm">Dành cho học sinh lớp 1-5</p>
      </div>
    </div>
  );
}
