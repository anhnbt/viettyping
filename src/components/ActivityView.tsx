import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Topic, Activity, subjects } from '@/data/subjects';
import { IoArrowBack, IoCheckmark, IoPlay, IoRefresh, IoMusicalNotes, IoClose } from 'react-icons/io5';
import TypingPractice from './TypingPractice';
import CompletionModal from './CompletionModal';
import TelexGuide from './TelexGuide';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';
import { hasVietnameseDiacritics } from '@/utils/vietnameseUtils';

interface ActivityViewProps {
  topic: Topic;
  onComplete: (activityId: string, score: number) => void;
}

const ActivityView: React.FC<ActivityViewProps> = ({ topic, onComplete }) => {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const subject = subjects.find(s => s.id === subjectId);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [showTypingModal, setShowTypingModal] = useState(false);
  const [typingStats, setTypingStats] = useState<{ wpm: number; accuracy: number; incorrectCount: number } | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { isActivityCompleted, saveProgress, isLoaded, getTopicProgress, clearTopicProgress } = useProgress();

  const currentActivity = topic.activities[currentActivityIndex];

  // Reset state when changing activity
  useEffect(() => {
    setSelectedOption(null);
    setFeedback(null);
    setIsDrawing(false);

    // Clear canvas if it exists
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [currentActivityIndex]);

  const handleActivityComplete = (score: number) => {
    const activityId = currentActivity.id;
    saveProgress(activityId, score);
    onComplete(activityId, score);

    // Chuyển sang hoạt động tiếp theo
    if (currentActivityIndex < topic.activities.length - 1) {
      setTimeout(() => {
        setCurrentActivityIndex((prev) => prev + 1);
      }, 1000); // Wait 1s before moving next
    }
  };

  const handleTypingComplete = useCallback((stats: { wpm: number; accuracy: number; incorrectCount: number }) => {
    setTypingStats(stats);
    setShowCompletionModal(true);
  }, []);

  const handleTypingRestart = useCallback(() => {
    setShowCompletionModal(false);
    setTypingStats(null);
    setShowTypingModal(false);
    // Re-open the modal to restart
    setTimeout(() => setShowTypingModal(true), 100);
  }, []);

  const handleTypingContinue = useCallback(() => {
    setShowCompletionModal(false);
    setShowTypingModal(false);
    if (typingStats) {
      handleActivityComplete(typingStats.accuracy);
    }
    setTypingStats(null);
  }, [typingStats]);



  const checkAnswer = (answer: string) => {
    setSelectedOption(answer);
    if (answer === currentActivity.correctAnswer) {
      setFeedback('correct');
      handleActivityComplete(100);
    } else {
      setFeedback('incorrect');
    }
  };

  const playNote = (frequency: number) => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);
  };

  // Drawing Logic
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.beginPath(); // Start new path to avoid connecting lines
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ec4899'; // Pink color

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // Need to handle mouse up outside canvas to verify completion
  // For simplicity, we add a button to finish drawing

  const renderActivity = (activity: Activity) => {
    switch (activity.type) {
      case 'typing':
        return (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
              <p className="text-gray-600">{activity.instructions}</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <p className="text-lg font-mono">{activity.content}</p>
            </div>
            <button
              onClick={() => setShowTypingModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <IoPlay />
              Bắt đầu luyện tập
            </button>
          </div>
        );

      case 'quiz':
      case 'math':
        return (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
              <p className="text-gray-600">{activity.instructions}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="text-3xl font-bold mb-4">{activity.content}</div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {activity.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => checkAnswer(option)}
                    disabled={feedback === 'correct'}
                    className={`p-4 border-2 rounded-xl text-xl font-bold transition-all transform hover:scale-105 ${selectedOption === option
                      ? feedback === 'correct'
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-white border-gray-200 hover:border-blue-400'
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {feedback === 'correct' && (
                <div className="mt-6 text-green-600 font-bold text-xl animate-bounce">
                  Chính xác! Làm tốt lắm! 🎉
                </div>
              )}
              {feedback === 'incorrect' && (
                <div className="mt-6 text-red-500 font-bold text-xl">
                  Chưa đúng rồi, thử lại nhé! 🤔
                </div>
              )}
            </div>
          </div>
        );

      case 'reading':
        return (
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
              <p className="text-gray-600">{activity.instructions}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="text-lg leading-relaxed">{activity.content}</p>
            </div>
            <button
              onClick={() => handleActivityComplete(100)}
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Hoàn thành đọc
            </button>
          </div>
        );

      case 'drawing':
        return (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
              <p className="text-gray-600">{activity.instructions}</p>
            </div>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6 inline-block">
              <canvas
                ref={canvasRef}
                width={500}
                height={300}
                className="bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  const ctx = canvasRef.current?.getContext('2d');
                  if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <IoRefresh /> Xóa
              </button>
              <button
                onClick={() => handleActivityComplete(100)}
                className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Hoàn thành vẽ
              </button>
            </div>
          </div>
        );

      case 'listening':
        return (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
              <p className="text-gray-600">{activity.instructions}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              {activity.data?.notes ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {activity.data.notes.map((note: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => playNote(note.frequency)}
                      className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all text-purple-600"
                    >
                      <IoMusicalNotes className="text-3xl mb-2" />
                      <span className="font-bold">{note.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform" onClick={() => playNote(440)}>
                  <IoPlay className="text-white text-3xl" />
                </div>
              )}
            </div>

            {!activity.data?.notes && (
              <button
                onClick={() => handleActivityComplete(100)}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Đã nghe xong
              </button>
            )}

            {activity.data?.notes && (
              <button
                onClick={() => handleActivityComplete(100)}
                className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Hoàn thành bài nghe
              </button>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center">
            <p className="text-gray-500">
              Loại hoạt động này đang được phát triển...
            </p>
          </div>
        );
    }
  };

  if (!isLoaded) return null;

  const activityIds = topic.activities.map(a => a.id);
  const progress = getTopicProgress(activityIds);
  const isTopicComplete = progress === 100;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Professional Header */}
      <header className="h-14 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <Link
            href={`/subjects/${subjectId}`}
            className="group flex items-center gap-1.5 p-2 -ml-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Quay lại"
          >
            <IoArrowBack className="text-xl group-hover:-translate-x-0.5 transition-transform" />
          </Link>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200" />

          {/* Subject Icon + Title */}
          <div className="flex items-center gap-2.5">
            {subject && (
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center text-white text-sm shrink-0 shadow-sm`}>
                {subject.icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate leading-tight">
                {topic.title}
              </h1>
              <p className="text-xs text-gray-500 truncate">
                {currentActivityIndex + 1}/{topic.activities.length} hoạt động
              </p>
            </div>
          </div>
        </div>

        {/* Progress Dots + Badge */}
        <div className="flex items-center gap-3">
          {/* Activity Progress Dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {topic.activities.map((activity, index) => {
              const isCompleted = isActivityCompleted(activity.id);
              const isActive = index === currentActivityIndex;
              return (
                <button
                  key={activity.id}
                  onClick={() => setCurrentActivityIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${isActive
                    ? 'bg-blue-600 scale-125 ring-2 ring-blue-200'
                    : isCompleted
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  title={activity.title}
                />
              );
            })}
          </div>

          {/* Progress Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${progress === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
            {Math.round(progress)}%
          </div>
        </div>
      </header>

      {/* 2. Main Content (Split Screen) */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left Panel: Instructions & Avatar */}
        <div className="w-80 md:w-96 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto z-10 hidden lg:flex">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                {currentActivityIndex + 1}
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {currentActivity.title}
              </h2>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl text-gray-700 leading-relaxed border border-blue-100 mb-6">
              {currentActivity.instructions}
            </div>

            {/* TELEX Guide - shown for Vietnamese typing activities */}
            {currentActivity.type === 'typing' && hasVietnameseDiacritics(currentActivity.content) && (
              <TelexGuide />
            )}

            {/* Context/Mascot placeholder - Makes it friendly for kids */}
            <div className="mt-auto pt-8 flex justify-center opacity-80">
              <img src="/mascot-placeholder.png" alt="Mascot" className="h-32 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
          </div>
        </div>

        {/* Right Panel: Workspace / Activity Area */}
        <div className="flex-1 bg-gray-100/50 flex flex-col relative overflow-hidden">
          {/* Mobile Instruction Toggle (Visible only on small screens) */}
          <div className="lg:hidden p-4 bg-white border-b border-gray-200 shrink-0">
            <h2 className="font-bold text-gray-800 mb-1">{currentActivity.title}</h2>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{currentActivity.instructions}</p>
            {currentActivity.type === 'typing' && hasVietnameseDiacritics(currentActivity.content) && (
              <TelexGuide />
            )}
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 flex items-start justify-center">
            <div className="w-full h-full">
              {renderActivity(currentActivity)}
            </div>
          </div>
        </div>

        {/* Completion Overlay */}
        {isTopicComplete && (
          <div className="absolute inset-0 bg-white/90 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
            <div className="text-center p-8 bg-white rounded-3xl shadow-2xl border-4 border-green-100 max-w-lg mx-4">
              <div className="text-8xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-3xl font-bold text-green-800 mb-2">
                Hoàn thành xuất sắc!
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                Con đã hoàn thành toàn bộ chủ đề <span className="font-bold text-blue-600">{topic.title}</span>.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    const activityIds = topic.activities.map(a => a.id);
                    clearTopicProgress(activityIds);
                    setCurrentActivityIndex(0);
                    setSelectedOption(null);
                    setFeedback(null);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Làm lại
                </button>
                <Link href={`/subjects/${subjectId}`} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg hover:shadow-green-200">
                  Bài học tiếp theo
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Typing Practice Modal */}
      {showTypingModal && currentActivity.type === 'typing' && (
        <div className="fixed inset-0 z-40 bg-gray-50 flex flex-col">
          {/* Modal Header */}
          <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowTypingModal(false);
                  setTypingStats(null);
                  setShowCompletionModal(false);
                }}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Đóng"
              >
                <IoClose className="text-xl" />
              </button>
              <div>
                <h1 className="text-sm font-bold text-gray-800 leading-tight">
                  {currentActivity.title}
                </h1>
                <p className="text-xs text-gray-500">{topic.title}</p>
              </div>
            </div>
          </header>

          {/* Practice Area */}
          <div className="flex-1 overflow-hidden p-4">
            <div className="w-full h-full">
              <TypingPractice
                key={showTypingModal ? 'open' : 'closed'}
                lesson={{
                  id: currentActivity.id,
                  level: 'basic' as const,
                  title: currentActivity.title,
                  description: currentActivity.instructions,
                  content: currentActivity.content,
                  targetWPM: 20,
                  minAccuracy: 85,
                }}
                onComplete={handleTypingComplete}
              />
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {typingStats && (
        <CompletionModal
          isOpen={showCompletionModal}
          stats={typingStats}
          onRestart={handleTypingRestart}
          onContinue={handleTypingContinue}
          continueLabel="Tiếp tục"
        />
      )}
    </div>
  );
};

export default ActivityView;
