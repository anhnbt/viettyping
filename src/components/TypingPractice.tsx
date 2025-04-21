import React, { useState, useEffect, useRef } from 'react';
import { Lesson } from '@/data/lessons';

interface Props {
  lesson: Lesson;
  onComplete: (wpm: number, accuracy: number) => void;
}

export default function TypingPractice({ lesson, onComplete }: Props) {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const calculateStats = () => {
    if (!startTime) return { wpm: 0, accuracy: 0 };
    
    const timeInMinutes = (Date.now() - startTime) / 60000;
    const words = input.trim().split(' ').length;
    const wpm = Math.round(words / timeInMinutes);
    
    const correctChars = input.split('').filter((char, i) => char === lesson.content[i]).length;
    const accuracy = Math.round((correctChars / lesson.content.length) * 100);
    
    return { wpm, accuracy };
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    if (!startTime) setStartTime(Date.now());
    setInput(newInput);

    if (newInput.length >= lesson.content.length) {
      const stats = calculateStats();
      setIsComplete(true);
      onComplete(stats.wpm, stats.accuracy);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { wpm, accuracy } = calculateStats();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
        <p className="text-gray-600 mb-4">{lesson.description}</p>
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

      <div className="mt-4 flex justify-between text-sm">
        <div>Tốc độ: {wpm} WPM</div>
        <div>Độ chính xác: {accuracy}%</div>
      </div>

      {isComplete && (
        <div className="mt-6 p-4 bg-green-100 rounded">
          <h3 className="font-bold text-green-800">Hoàn thành!</h3>
          <p>
            Tốc độ gõ: {wpm} WPM | Độ chính xác: {accuracy}%
            {wpm >= lesson.targetWPM && accuracy >= lesson.minAccuracy
              ? ' - Xuất sắc! 🎉'
              : ' - Hãy thử lại để đạt kết quả tốt hơn'}
          </p>
        </div>
      )}
    </div>
  );
}
