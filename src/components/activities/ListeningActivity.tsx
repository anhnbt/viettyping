import React, { useState, useEffect } from 'react';
import { ActivityAdapterProps } from '@/types/activity';
import { IoPlay, IoMusicalNotes } from 'react-icons/io5';

export const ListeningActivity: React.FC<ActivityAdapterProps> = ({ activity, onComplete, onProgressUpdate }) => {
  const [startTime, setStartTime] = useState<number>(0);
  const [playCount, setPlayCount] = useState<number>(0);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const playNote = (frequency: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    
    setPlayCount(prev => prev + 1);
    
    if (onProgressUpdate) {
      onProgressUpdate(Math.min(100, (playCount + 1) * 20)); // Fake progress based on interactions
    }
  };

  const handleFinish = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    if (onProgressUpdate) onProgressUpdate(100);

    onComplete({
      score: 100, // Hoàn thành nghe là 100 điểm
      duration,
      rawPayload: {
        action: 'completed_listening',
        times_played: playCount
      }
    });
  };

  const hasNotes = activity.data?.notes && Array.isArray(activity.data.notes);

  return (
    <div className="text-center w-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
        <p className="text-gray-600">{activity.instructions}</p>
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
        {hasNotes ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {activity.data.notes.map((note: { name: string; frequency: number }, idx: number) => (
              <button
                key={idx}
                onClick={() => playNote(note.frequency)}
                className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all text-purple-600 border-2 border-transparent hover:border-purple-300"
              >
                <IoMusicalNotes className="text-3xl mb-2" />
                <span className="font-bold">{note.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <button 
            className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform shadow-lg hover:shadow-purple-300 border-4 border-white" 
            onClick={() => playNote(440)}
            aria-label="Play Note"
          >
            <IoPlay className="text-white text-4xl ml-2" />
          </button>
        )}
      </div>

      <button
        onClick={handleFinish}
        className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-bold shadow-md text-lg"
      >
        {hasNotes ? 'Hoàn thành bài nghe' : 'Đã nghe xong'}
      </button>
    </div>
  );
};
