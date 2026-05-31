import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { IoTimeOutline, IoRefreshOutline, IoWarning, IoSpeedometerOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { useTypingSound } from '@/hooks/useTypingSound';
import VirtualKeyboard from './VirtualKeyboard';
import { TelemetryPayload } from '@/types/lesson';
import { stringToTelexKeys, buildCharMappings, validateInput, getNextHighlightKey, getCharColorStates } from '@/utils/telex';

export interface TypingTask {
  content: string;
  type: string;
  description: string;
  time_limit_seconds: number;
}

interface Props {
  task: TypingTask;
  onComplete: (telemetry: TelemetryPayload) => void;
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

  const targetTelexKeys = useMemo(() => stringToTelexKeys(task.content), [task.content]);
  const charMappings = useMemo(() => buildCharMappings(task.content), [task.content]);

  const validationResult = useMemo(() => validateInput(task.content, input), [task.content, input]);
  const firstErrorIndex = validationResult.firstErrorTelexIndex;
  const currentProgressIndex = validationResult.currentProgressIndex;
  const charStates = useMemo(() => getCharColorStates(task.content, input), [task.content, input]);

  const calculateStats = (currentInput = input, currentStartTime = startTime) => {
    if (!currentStartTime) return { wpm: 0, accuracy: 0, incorrectCount: 0 };

    const timeInSeconds = (Date.now() - currentStartTime) / 1000;
    const timeInMinutes = Math.max(timeInSeconds, 3) / 60; // Giới hạn tối thiểu 3s để tránh nổ số WPM ban đầu

    const validation = validateInput(task.content, currentInput);
    const correctKeysCount = validation.currentProgressIndex;
    const currentTelexKeysLength = stringToTelexKeys(currentInput).length;
    const incorrectKeysCount = Math.max(0, currentTelexKeysLength - correctKeysCount);

    const words = correctKeysCount / 5; // Standard WPM: 1 word = 5 keystrokes
    const wpm = Math.round(words / timeInMinutes);
    const accuracy = Math.round((correctKeysCount / Math.max(currentTelexKeysLength, 1)) * 100) || 0;

    return { wpm, accuracy, incorrectCount: incorrectKeysCount };
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;

    const oldValidation = validateInput(task.content, input);
    const oldFirstErrorIndex = oldValidation.firstErrorTelexIndex;

    // Nếu đang có lỗi và người dùng gõ thêm (chiều dài tăng)
    if (oldFirstErrorIndex !== -1 && newInput.length > input.length) {
      playWrongSound();
      return;
    }

    let currentStartTime = startTime;
    if (!startTime) {
      const now = Date.now();
      setStartTime(now);
      currentStartTime = now;
      startTimer();
    }

    if (wrongSoundTimeoutRef.current) {
      clearTimeout(wrongSoundTimeoutRef.current);
      wrongSoundTimeoutRef.current = undefined;
    }

    const newValidation = validateInput(task.content, newInput);
    const newFirstErrorIndex = newValidation.firstErrorTelexIndex;

    const isNewCorrect = newValidation.isValid;
    const isOldCorrect = oldFirstErrorIndex === -1;

    const oldInputTelexKeysLength = stringToTelexKeys(input).length;
    const newInputTelexKeysLength = stringToTelexKeys(newInput).length;

    if (newInputTelexKeysLength > 0) {
      if (isNewCorrect && ((!isOldCorrect && newInputTelexKeysLength >= oldInputTelexKeysLength) || newInputTelexKeysLength > oldInputTelexKeysLength)) {
        playCorrectSound();
      } else if (!isNewCorrect && newInputTelexKeysLength >= oldInputTelexKeysLength) {
        wrongSoundTimeoutRef.current = setTimeout(() => {
          playWrongSound();
        }, 500);
      }
    }

    setInput(newInput);

    if (newInput === task.content || (isNewCorrect && newInputTelexKeysLength === targetTelexKeys.length)) {
      const stats = calculateStats(newInput, currentStartTime);
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
    
    const durationSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    
    onComplete({
      score: stats.accuracy,
      durationSeconds,
      metadata: {
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        incorrectCount: stats.incorrectCount,
      },
    });
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
  const totalTimeLimit = task.time_limit_seconds || 60;
  const timeLeftPercent = (timeLeft / totalTimeLimit) * 100;

  const getTimerColor = () => {
    if (timeLeftPercent > 50) return 'text-blue-600 bg-blue-50 border-blue-100/50';
    if (timeLeftPercent > 20) return 'text-yellow-600 bg-yellow-50 border-yellow-100/50';
    return 'text-red-600 bg-red-50 border-red-100/50 animate-pulse';
  };

  const getAnimal = () => {
    if (wpm === 0) return '🐢';
    if (wpm < 10) return '🐢';
    if (wpm < 25) return '🐰';
    return '🐆';
  };

  const getSpeedLabel = () => {
    if (wpm === 0) return 'Đang đợi bé gõ phím...';
    if (wpm < 10) return 'Chậm rãi như Rùa 🐢';
    if (wpm < 25) return 'Nhịp nhàng như Thỏ 🐰';
    return 'Siêu tốc như Báo 🐆';
  };

  const getSpeedColor = () => {
    if (wpm === 0) return 'text-slate-400';
    if (wpm < 10) return 'text-orange-500';
    if (wpm < 25) return 'text-green-500';
    return 'text-amber-500 font-extrabold drop-shadow-sm';
  };

  const progressPercent = Math.min(100, Math.round((currentProgressIndex / targetTelexKeys.length) * 100));

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
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-white/80 rounded-2xl border border-gray-100 mb-3 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 font-mono font-black text-sm px-3 py-1.5 rounded-xl border ${getTimerColor()}`}>
              <IoTimeOutline className="text-base" />
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <IoSpeedometerOutline className="text-base text-green-500" />
              <span>Tốc độ: <span className="font-extrabold text-green-600 text-sm">{wpm}</span> WPM <span className={`ml-1 font-bold ${getSpeedColor()}`}>{wpm > 0 ? `(${getSpeedLabel()})` : ''}</span></span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <IoCheckmarkCircleOutline className="text-base text-blue-500" />
              <span>Chính xác: <span className="font-extrabold text-blue-600 text-sm">{accuracy}%</span></span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1 px-4 py-1.5 text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors font-bold shadow-sm cursor-pointer"
            >
              <IoRefreshOutline className="text-sm" />
              Làm lại
            </button>
          </div>
        </div>

        {/* Dynamic Animal Progress Meter */}
        <div className="w-full bg-amber-50/50 rounded-3xl p-2 border-2 border-slate-800 shadow-[4px_4px_0px_0px_#1e293b] mb-3 relative overflow-visible flex items-center shrink-0 h-12">
          <div className="relative w-full h-4 bg-emerald-50 rounded-full border-2 border-slate-800 flex items-center px-1 overflow-visible">
            <span className="absolute right-1.5 text-base select-none z-0">🏁</span>
            
            {/* Running Animal */}
            <motion.div
              className="absolute text-3xl select-none filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] z-10"
              animate={{ left: `calc(${progressPercent}% - 24px)` }}
              transition={{ type: 'spring', stiffness: 50, damping: 14 }}
              style={{ left: 0, top: '-11px' }}
            >
              {getAnimal()}
            </motion.div>
          </div>
        </div>

        {/* Typing Display Area */}
        <div className="relative mb-3 p-6 bg-gradient-to-b from-blue-50/50 to-blue-50 rounded-3xl text-3xl font-mono leading-relaxed tracking-wide shadow-inner border-2 border-blue-100 flex flex-wrap content-center items-center justify-center text-center flex-1 min-h-0 overflow-y-auto">
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
          {charMappings.map((mapping, i) => {
            const state = charStates[i] || 'none';
            const isCorrect = state === 'correct';
            const isIncorrect = state === 'incorrect';
            const isCurrent = state === 'current';
              
            let colorClass = 'text-gray-400';
            let borderClass = '';
            
            if (isCorrect) {
              colorClass = 'text-green-600 font-extrabold drop-shadow-sm';
            } else if (isIncorrect) {
              return (
                <motion.span
                  key={i}
                  animate={{ x: [0, -3, 3, -3, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, repeatDelay: 1 }}
                  className="text-red-500 font-extrabold bg-red-100 rounded-md px-1.5 shadow-sm relative inline-block mx-0.5"
                >
                  {mapping.char === ' ' ? '\u00A0' : mapping.char}
                </motion.span>
              );
            } else if (isCurrent) {
              borderClass = 'cursor-blink border-b-4 border-blue-500 font-bold';
            }
            
            return (
              <span
                key={i}
                className={`${colorClass} ${borderClass} relative transition-all duration-150`}
              >
                {mapping.char === ' ' ? '\u00A0' : mapping.char}
              </span>
            );
          })}
        </div>

        {/* Alert Bar cố định hiển thị cảnh báo gõ sai */}
        {firstErrorIndex !== -1 && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-3 p-3.5 bg-red-50 border-2 border-dashed border-red-200 rounded-2xl text-center text-sm font-bold text-red-500 flex items-center justify-center gap-2 shadow-sm relative z-20"
          >
            <span className="text-lg animate-bounce">⚠️</span>
            <span>Bé gõ chưa đúng rồi! Hãy nhấn phím <b>Xóa (⌫)</b> màu tím để sửa lại nhé!</span>
          </motion.div>
        )}

        {/* Keyboard */}
        <div className="shrink-0">
          <VirtualKeyboard
            pressedKey={pressedKey}
            highlightKey={getNextHighlightKey(task.content, input)}
          />
        </div>
      </div>
    </div>
  );
}
