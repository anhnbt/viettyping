import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lesson } from '@/data/lessons';
import { IoTimeOutline, IoRefreshOutline } from 'react-icons/io5';
import { useTypingSound } from '@/hooks/useTypingSound';
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
  const timerRef = useRef<NodeJS.Timeout>();
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

  const completeLesson = (stats: { wpm: number; accuracy: number; incorrectCount: number }) => {
    setIsComplete(true);
    clearInterval(timerRef.current);
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <style jsx>{`
        @keyframes blink {
          0%, 100% { background-color: rgb(96 165 250); }
          50% { background-color: transparent; }
        }
        .cursor-blink {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
        <p className="text-gray-600 mb-4">{lesson.description}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4 text-xl font-mono">
          <div className="flex items-center gap-2">
            <IoTimeOutline className="text-gray-600" />
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
            {String(timeLeft % 60).padStart(2, '0')}
          </div>
          <select
            value={selectedTime}
            onChange={(e) => handleTimeChange(Number(e.target.value))}
            disabled={!!startTime}
            className="ml-2 p-1 text-base bg-white border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 cursor-pointer"
          >
            {TIME_OPTIONS.map(time => (
              <option key={time} value={time}>
                {time}s
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <IoRefreshOutline className="text-xl" />
          <span>Làm lại</span>
        </button>
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded text-lg font-mono">
        {lesson.content.split('').map((char, i) => (
          <span
            key={i}
            className={`${
              i < input.length
                ? input[i] === char
                  ? 'text-green-600'
                  : 'text-red-600'
                : i === input.length
                ? 'cursor-blink'
                : ''
            } relative`}
          >
            {char}
          </span>
        ))}
      </div>

      <VirtualKeyboard 
        pressedKey={pressedKey} 
        highlightKey={lesson.content[input.length]?.toLowerCase() ?? null} 
      />

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInput}
        disabled={isComplete}
        className="w-full mt-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Bắt đầu gõ tại đây..."
      />

      <div className="mt-4 flex justify-between items-center text-sm">
        <div className="flex items-center gap-6">
          <div>Tốc độ: {wpm} WPM</div>
          <div>Độ chính xác: {accuracy}%</div>
        </div>
        {incorrectCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
              {incorrectCount} lỗi
            </span>
          </div>
        )}
      </div>

      {isComplete && (
        <div className="mt-6 p-4 bg-green-100 rounded">
          <h3 className="font-bold text-green-800">Hoàn thành!</h3>
          <p className="mb-2">
            Tốc độ gõ: {wpm} WPM | Độ chính xác: {accuracy}%
            {wpm >= lesson.targetWPM && accuracy >= lesson.minAccuracy
              ? ' - Xuất sắc! 🎉'
              : ' - Hãy thử lại để đạt kết quả tốt hơn'}
          </p>
          <p className="text-sm text-gray-600">
            Số lỗi gõ sai: <span className="font-medium text-red-600">{incorrectCount}</span>
          </p>
        </div>
      )}
    </div>
  );
}
