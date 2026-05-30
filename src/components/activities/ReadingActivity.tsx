import React, { useState, useEffect } from 'react';
import { ActivityAdapterProps } from '@/types/activity';

export const ReadingActivity: React.FC<ActivityAdapterProps> = ({ activity, onComplete, onProgressUpdate }) => {
  const [startTime, setStartTime] = useState<number>(0);

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
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
        <p className="text-gray-600">{activity.instructions}</p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <p className="text-lg leading-relaxed">{activity.content}</p>
      </div>
      <button
        onClick={handleFinish}
        className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold text-xl shadow-md"
      >
        Hoàn thành đọc
      </button>
    </div>
  );
};
