import React, { useState, useEffect } from 'react';
import { IoPlayOutline } from 'react-icons/io5';

interface Props {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: Props) {
  const [text, setText] = useState('');
  const fullText = 'Luyện Gõ Phím Tiếng Việt';
  
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
      <h1 className="text-5xl font-bold mb-12 h-20">
        {text}
        <span className="animate-blink">|</span>
      </h1>
      <button
        onClick={onStart}
        className="mt-8 px-8 py-3 bg-blue-500 text-white rounded-lg text-lg 
          hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-2"
      >
        <IoPlayOutline className="text-2xl" />
        <span>Bắt đầu</span>
      </button>
    </div>
  );
}
