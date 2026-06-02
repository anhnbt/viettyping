import React, { useState, useEffect } from 'react';
import { ActivityAdapterProps } from '@/types/activity';
import { useSubjectTheme } from '@/hooks/useSubjectTheme';

export const ReadingActivity: React.FC<ActivityAdapterProps> = ({ activity, onComplete, onProgressUpdate }) => {
  const [startTime, setStartTime] = useState<number>(0);
  const theme = useSubjectTheme();

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const handleFinish = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    if (onProgressUpdate) onProgressUpdate(100);
    
    onComplete({
      score: 100, // Đọc xong mặc định 100 điểm
      duration,
      rawPayload: {
        action: 'completed_reading'
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="mb-6 text-center">
        <h3 className="text-3xl font-black text-slate-800 mb-2">{activity.title}</h3>
        <p className="text-slate-500 font-bold text-sm">{activity.instructions}</p>
      </div>

      <div className={`w-full border-4 border-slate-800 rounded-3xl p-8 shadow-[6px_6px_0px_0px_#1e293b] mb-6 bg-white/70 ${theme.bgLight10}`}>
        <p className="text-xl leading-relaxed font-bold text-slate-800">{activity.content}</p>
      </div>

      <button
        onClick={handleFinish}
        className={`tactile-btn ${theme.tactileBtn} text-lg px-8 py-3.5 w-full`}
      >
        Hoàn thành đọc
      </button>
    </div>
  );
};
