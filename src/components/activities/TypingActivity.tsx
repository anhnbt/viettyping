import React, { useState, useCallback, useEffect } from 'react';
import { ActivityAdapterProps } from '@/types/activity';
import { IoPlay, IoClose } from 'react-icons/io5';
import TypingPractice from '@/components/TypingPractice';
import CompletionModal from '@/components/CompletionModal';

export const TypingActivity: React.FC<ActivityAdapterProps> = ({ activity, onComplete, onProgressUpdate }) => {
  const [showTypingModal, setShowTypingModal] = useState(false);
  const [typingStats, setTypingStats] = useState<{ wpm: number; accuracy: number; incorrectCount: number } | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleTypingComplete = useCallback((stats: { wpm: number; accuracy: number; incorrectCount: number }) => {
    setTypingStats(stats);
    setShowCompletionModal(true);
    if (onProgressUpdate) onProgressUpdate(100);
  }, [onProgressUpdate]);

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
    
    const duration = Math.round((Date.now() - startTime) / 1000);

    if (typingStats) {
      onComplete({
        score: typingStats.accuracy,
        duration,
        rawPayload: {
          action: 'completed_typing',
          wpm: typingStats.wpm,
          accuracy: typingStats.accuracy,
          incorrectCount: typingStats.incorrectCount
        }
      });
    }
    setTypingStats(null);
  }, [typingStats, startTime, onComplete]);

  return (
    <div className="text-center w-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
        <p className="text-gray-600">{activity.instructions}</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <p className="text-2xl font-mono text-gray-800 tracking-wider">{activity.content}</p>
      </div>
      <button
        onClick={() => setShowTypingModal(true)}
        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-bold text-xl shadow-lg hover:shadow-blue-300"
      >
        <IoPlay className="text-2xl" />
        Bắt đầu gõ
      </button>

      {/* Typing Practice Modal */}
      {showTypingModal && (
        <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col">
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
                  {activity.title}
                </h1>
                <p className="text-xs text-gray-500">Luyện gõ</p>
              </div>
            </div>
          </header>

          {/* Practice Area */}
          <div className="flex-1 overflow-hidden p-4">
            <div className="w-full h-full">
              <TypingPractice
                key={showTypingModal ? 'open' : 'closed'}
                task={{
                  content: activity.content,
                  type: 'word',
                  description: activity.instructions,
                  time_limit_seconds: 60,
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
          continueLabel="Hoàn thành & Tiếp tục"
        />
      )}
    </div>
  );
};
