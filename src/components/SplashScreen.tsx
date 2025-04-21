import React, { useState, useEffect } from 'react';

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
        className="px-8 py-4 bg-blue-500 text-white text-xl rounded-lg
                 shadow-lg hover:bg-blue-600 transform hover:scale-105
                 transition-all duration-200 ease-in-out"
      >
        Bắt đầu
      </button>
    </div>
  );
}
