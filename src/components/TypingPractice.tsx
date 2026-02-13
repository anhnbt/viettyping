import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lesson } from '@/data/lessons';
import { IoTimeOutline, IoRefreshOutline, IoStar, IoStarOutline } from 'react-icons/io5';
import { useTypingSound } from '@/hooks/useTypingSound';
import confetti from 'canvas-confetti';
import VirtualKeyboard from './VirtualKeyboard';

interface Props {
  lesson: Lesson;
  onComplete: (stats: { wpm: number; accuracy: number; incorrectCount: number }) => void;
}

const TIME_OPTIONS = [15, 30, 60, 120];

export default function TypingPractice({ lesson, onComplete }: Props) {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedTime, setSelectedTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { playCorrectSound, playWrongSound } = useTypingSound();

  const calculateStats = (currentInput = input, currentStartTime = startTime) => {
    if (!currentStartTime) return { wpm: 0, accuracy: 0, incorrectCount: 0 };

    const timeInMinutes = (Date.now() - currentStartTime) / 60000;
    const words = currentInput.trim().split(' ').length;
    const wpm = Math.round(words / timeInMinutes);

    const typedChars = currentInput.split('');
    const correctChars = typedChars.filter((char, i) => char === lesson.content[i]).length;
    const incorrectCount = Math.min(typedChars.length - correctChars, typedChars.length);
    const accuracy = Math.round((correctChars / typedChars.length) * 100) || 0;

    return { wpm, accuracy, incorrectCount };
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    if (!startTime) {
      setStartTime(Date.now());
      startTimer();
    }

    // Play sound based on the last character typed
    if (newInput.length > input.length) {
      const lastCharIndex = newInput.length - 1;
      const isCorrect = newInput[lastCharIndex] === lesson.content[lastCharIndex];
      if (isCorrect) {
        playCorrectSound();
      } else {
        playWrongSound();
      }
    }

    setInput(newInput);

    if (newInput.length >= lesson.content.length) {
      const stats = calculateStats(newInput);
      completeLesson(stats);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const stats = calculateStats();
          completeLesson(stats);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fireConfetti = useCallback(() => {
    const duration = 2500;
    const end = Date.now() + duration;

    const colors = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd',
      '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6'];

    // Side cannons
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Big center burst
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors,
      startVelocity: 35,
      gravity: 0.8,
      scalar: 1.2,
      ticks: 100,
    });

    // Delayed star-shaped burst
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 360,
        origin: { x: 0.5, y: 0.4 },
        colors,
        startVelocity: 25,
        gravity: 0.6,
        shapes: ['circle', 'square'],
        scalar: 1.5,
        ticks: 80,
      });
    }, 600);
  }, []);

  const completeLesson = (stats: { wpm: number; accuracy: number; incorrectCount: number }) => {
    setIsComplete(true);
    clearInterval(timerRef.current);
    fireConfetti();
    onComplete(stats);
  };

  const handleRestart = useCallback(() => {
    setInput('');
    setStartTime(null);
    setIsComplete(false);
    setTimeLeft(selectedTime);
    clearInterval(timerRef.current);
    inputRef.current?.focus();
  }, [selectedTime]);

  const handleTimeChange = useCallback((newTime: number) => {
    if (!startTime) {
      setSelectedTime(newTime);
      setTimeLeft(newTime);
    }
  }, [startTime]);

  useEffect(() => {
    inputRef.current?.focus();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    handleRestart();
  }, [lesson, handleRestart]);

  useEffect(() => {
    setTimeLeft(selectedTime);
    setInput('');
    setStartTime(null);
    setIsComplete(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [lesson, selectedTime]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKey(e.key.toLowerCase());
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const { wpm, accuracy, incorrectCount } = calculateStats();

  const calculateStars = (acc: number) => {
    if (acc >= 90) return 3;
    if (acc >= 70) return 2;
    if (acc >= 50) return 1;
    return 0;
  };

  const stars = calculateStars(accuracy);

  return (
    <div className="w-full h-full flex flex-col">
      <style jsx>{`
        @keyframes blink {
          0%, 100% { background-color: rgb(96 165 250); }
          50% { background-color: transparent; }
        }
        .cursor-blink {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>

      {/* Compact Stats Bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-2 bg-white/80 rounded-xl border border-gray-100 mb-3 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono font-bold text-blue-600 text-sm">
            <IoTimeOutline className="text-base" />
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-xs text-gray-500">Tốc độ: <span className="font-bold text-green-600">{wpm}</span> WPM</span>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-xs text-gray-500">Chính xác: <span className="font-bold text-blue-600">{accuracy}%</span></span>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (input.length / lesson.content.length) * 100)}%` }}
              ></div>
            </div>
            <span className="text-xs font-bold text-gray-500">{Math.round((input.length / lesson.content.length) * 100)}%</span>
          </div>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors font-medium"
          >
            <IoRefreshOutline className="text-sm" />
            Làm lại
          </button>
        </div>
      </div>

      {/* Typing Display Area */}
      <div className="relative mb-3 p-6 bg-blue-50 rounded-2xl text-3xl font-mono leading-relaxed tracking-wide shadow-inner border-2 border-blue-100 min-h-[100px] flex flex-wrap content-center items-center justify-center text-center flex-1 min-h-0 overflow-y-auto">
        {/* Hidden input for focus */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          disabled={isComplete}
          className="absolute inset-0 opacity-0 cursor-default z-10"
          autoFocus
        />
        {lesson.content.split('').map((char, i) => (
          <span
            key={i}
            className={`${i < input.length
              ? input[i] === char
                ? 'text-green-600 font-bold'
                : 'text-red-500 font-bold bg-red-100 rounded'
              : i === input.length
                ? 'cursor-blink border-b-4 border-blue-500'
                : 'text-gray-400'
              } relative transition-all duration-200`}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      {/* Keyboard */}
      <div className="shrink-0">
        <VirtualKeyboard
          pressedKey={pressedKey}
          highlightKey={lesson.content[input.length]?.toLowerCase() ?? null}
        />
      </div>

      {isComplete && (
        <div className="mt-8 p-8 bg-gradient-to-b from-yellow-50 to-orange-50 rounded-2xl border-4 border-yellow-200 text-center shadow-xl animate-bounce-in">
          <div className="flex justify-center gap-4 mb-6">
            {[1, 2, 3].map(star => (
              <span key={star} className="text-6xl filter drop-shadow-md transition-all hover:scale-110 transform">
                {star <= stars ? <IoStar className="text-yellow-400" /> : <IoStarOutline className="text-gray-300" />}
              </span>
            ))}
          </div>

          <h3 className="text-3xl font-bold text-yellow-800 mb-4">
            {stars === 3 ? 'Tuyệt vời! Con làm tốt lắm! 🎉' :
              stars === 2 ? 'Rất tốt! Cố gắng thêm chút nữa nhé! 🌟' :
                'Cố lên! Con làm được mà! 💪'}
          </h3>

          <div className="text-gray-600 text-lg flex justify-center gap-8 mt-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-yellow-100">
              Tốc độ: <span className="font-bold text-green-600">{wpm} WPM</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-yellow-100">
              Chính xác: <span className="font-bold text-blue-600">{accuracy}%</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-yellow-100">
              Lỗi: <span className="font-bold text-red-500">{incorrectCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
