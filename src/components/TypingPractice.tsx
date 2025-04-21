import React, { useState, useEffect, useRef } from 'react';
import { Lesson } from '@/data/lessons';
import { IoTimeOutline, IoRefreshOutline } from 'react-icons/io5';

interface Props {
  lesson: Lesson;
  onComplete: (wpm: number, accuracy: number) => void;
}

export default function TypingPractice({ lesson, onComplete }: Props) {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const calculateStats = (currentInput = input, currentStartTime = startTime) => {
    if (!currentStartTime) return { wpm: 0, accuracy: 0, incorrectCount: 0 };
    
    const timeInMinutes = (Date.now() - currentStartTime) / 60000;
    const words = currentInput.trim().split(' ').length;
    const wpm = Math.round(words / timeInMinutes);
    
    const typedChars = currentInput.split('');
    const correctChars = typedChars.filter((char, i) => char === lesson.content[i]).length;
    const incorrectCount = Math.min(typedChars.length - correctChars, typedChars.length);
    const accuracy = Math.round((correctChars / lesson.content.length) * 100);
    
    return { wpm, accuracy, incorrectCount };
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    if (!startTime) {
      setStartTime(Date.now());
      startTimer();
    }
    setInput(newInput);

    if (newInput.length >= lesson.content.length) {
      const stats = calculateStats();
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
    onComplete(stats.wpm, stats.accuracy);
  };

  const handleRestart = () => {
    setInput('');
    setStartTime(null);
    setIsComplete(false);
    setTimeLeft(60);
    clearInterval(timerRef.current);
    inputRef.current?.focus();
  };

  useEffect(() => {
    inputRef.current?.focus();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    handleRestart();
  }, [lesson]);

  const { wpm, accuracy, incorrectCount } = calculateStats();

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
        <p className="text-gray-600 mb-4">{lesson.description}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-xl font-mono">
          <IoTimeOutline className="text-gray-600" />
          {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
          {String(timeLeft % 60).padStart(2, '0')}
        </div>
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
                : 'text-gray-800'
            }`}
          >
            {char}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInput}
        disabled={isComplete}
        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
