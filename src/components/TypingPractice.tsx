import React, { useState, useEffect, useRef, useCallback } from 'react';

import { IoTimeOutline, IoRefreshOutline, IoWarning } from 'react-icons/io5';
import { useTypingSound } from '@/hooks/useTypingSound';
import VirtualKeyboard from './VirtualKeyboard';

export interface TypingTask {
  content: string;
  type: string;
  description: string;
  time_limit_seconds: number;
}

interface Props {
  task: TypingTask;
  onComplete: (stats: { wpm: number; accuracy: number; incorrectCount: number }) => void;
}


export default function TypingPractice({ task, onComplete }: Props) {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(task.time_limit_seconds || 60);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const wrongSoundTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { playCorrectSound, playWrongSound } = useTypingSound();

  const calculateStats = (currentInput = input, currentStartTime = startTime) => {
    if (!currentStartTime) return { wpm: 0, accuracy: 0, incorrectCount: 0 };

    const timeInMinutes = (Date.now() - currentStartTime) / 60000;
    const words = currentInput.trim().split(' ').length;
    const wpm = Math.round(words / timeInMinutes);

    const typedChars = currentInput.split('');
    const correctChars = typedChars.filter((char, i) => char === task.content[i]).length;
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

    if (wrongSoundTimeoutRef.current) {
      clearTimeout(wrongSoundTimeoutRef.current);
      wrongSoundTimeoutRef.current = undefined;
    }

    const isNowCorrect = task.content.startsWith(newInput);
    const wasCorrect = task.content.startsWith(input);

    if (newInput.length > 0) {
      if (isNowCorrect && ((!wasCorrect && newInput.length >= input.length) || newInput.length > input.length)) {
        playCorrectSound();
      } else if (!isNowCorrect && newInput.length >= input.length) {
        wrongSoundTimeoutRef.current = setTimeout(() => {
          playWrongSound();
        }, 500);
      }
    }

    setInput(newInput);

    if (newInput === task.content) {
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



  const completeLesson = (stats: { wpm: number; accuracy: number; incorrectCount: number }) => {
    setIsComplete(true);
    clearInterval(timerRef.current);
    onComplete(stats);
  };

  const handleRestart = useCallback(() => {
    setInput('');
    setStartTime(null);
    setIsComplete(false);
    setTimeLeft(task.time_limit_seconds || 60);
    clearInterval(timerRef.current);
    inputRef.current?.focus();
  }, [task.time_limit_seconds]);

  useEffect(() => {
    inputRef.current?.focus();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    handleRestart();
  }, [task, handleRestart]);

  useEffect(() => {
    setTimeLeft(task.time_limit_seconds || 60);
    setInput('');
    setStartTime(null);
    setIsComplete(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [task]);

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

  const { wpm, accuracy } = calculateStats();

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

      {/* Mobile Blocker */}
      <div className="md:hidden flex flex-col items-center justify-center h-full p-8 text-center bg-white/90 rounded-3xl shadow-lg border border-red-100">
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <IoWarning size={48} />
        </div>
        <h2 className="text-2xl font-black text-red-600 mb-4">
          Cần bàn phím vật lý!
        </h2>
        <p className="text-gray-600 text-lg">
          Bài tập luyện gõ phím 10 ngón được thiết kế tối ưu nhất khi sử dụng máy tính (Desktop/Laptop). 
          <br/><br/>
          Bé hoặc phụ huynh hãy mở trên thiết bị có bàn phím vật lý để thực hành nhé!
        </p>
      </div>

      {/* Desktop/Tablet Content */}
      <div className="hidden md:flex flex-col w-full h-full min-h-0">
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
                  style={{ width: `${Math.min(100, (input.length / task.content.length) * 100)}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-gray-500">{Math.round((input.length / task.content.length) * 100)}%</span>
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
        <div className="relative mb-3 p-6 bg-blue-50 rounded-2xl text-3xl font-mono leading-relaxed tracking-wide shadow-inner border-2 border-blue-100 flex flex-wrap content-center items-center justify-center text-center flex-1 min-h-0 overflow-y-auto">
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
          {task.content.split('').map((char, i) => (
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
            highlightKey={task.content[input.length]?.toLowerCase() ?? null}
          />
        </div>
      </div>
    </div>
  );
}
