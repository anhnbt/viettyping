import React, { useState, useEffect } from 'react';
import { ActivityAdapterProps } from '@/types/activity';
import { useSubjectTheme } from '@/hooks/useSubjectTheme';
import { useSound } from '@/contexts/SoundContext';

export const QuizActivity: React.FC<ActivityAdapterProps> = ({ activity, onComplete, onProgressUpdate }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const theme = useSubjectTheme();
  const { playSound } = useSound();

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const checkAnswer = (answer: string) => {
    setSelectedOption(answer);
    if (answer === activity.correctAnswer) {
      setFeedback('correct');
      playSound('coin');
      const duration = Math.round((Date.now() - startTime) / 1000);
      
      // Calculate score based on wrong answers (simple logic: -10% for each wrong answer, min 50%)
      const score = Math.max(50, 100 - (wrongAnswers.length * 10));

      if (onProgressUpdate) onProgressUpdate(100);

      // Delay a bit before finishing to show success state
      setTimeout(() => {
        onComplete({
          score,
          duration,
          rawPayload: {
            wrongAnswers,
            attempts: wrongAnswers.length + 1
          }
        });
      }, 1500);
    } else {
      setFeedback('incorrect');
      playSound('boing'); // Tiếng Roblox oof hài hước giảm áp lực
      if (!wrongAnswers.includes(answer)) {
        setWrongAnswers(prev => [...prev, answer]);
      }
    }
  };

  return (
    <div className="text-center w-full max-w-3xl mx-auto flex flex-col items-center">
      <div className="mb-6">
        <h3 className="text-3xl font-black text-slate-800 mb-2">{activity.title}</h3>
        <p className="text-slate-500 font-bold text-sm">{activity.instructions}</p>
      </div>

      <div className={`w-full border-4 border-slate-800 rounded-3xl p-8 shadow-[6px_6px_0px_0px_#1e293b] mb-8 bg-white/70 ${theme.bgLight10} flex flex-col items-center`}>
        {activity.imageUrl && (
          <div className="mb-6 max-w-sm w-full overflow-hidden rounded-2xl border-4 border-slate-800 shadow-[4px_4px_0px_0px_#1e293b]">
            <img 
              src={activity.imageUrl} 
              alt={activity.title || "Hình minh họa"} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        <div className="text-3xl font-black text-slate-800 mb-6 leading-snug">{activity.content}</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-2xl mx-auto">
          {activity.options?.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrect = feedback === 'correct';
            
            let btnStyle = `bg-white border-3 border-slate-800 text-slate-800 shadow-[4px_4px_0px_0px_#1e293b] hover:${theme.bgLight50}`;
            
            if (isSelected) {
              if (isCorrect) {
                btnStyle = "bg-green-500 text-white border-3 border-slate-800 shadow-[2px_2px_0px_0px_#1e293b] translate-y-[2px]";
              } else {
                btnStyle = "bg-red-500 text-white border-3 border-slate-800 shadow-[2px_2px_0px_0px_#1e293b] translate-y-[2px]";
              }
            }

            return (
              <button
                key={index}
                onClick={() => checkAnswer(option)}
                disabled={feedback === 'correct'}
                className={`p-4 rounded-2xl text-xl font-extrabold transition-all transform active:translate-y-1 active:shadow-[1px_1px_0px_0px_#1e293b] cursor-pointer select-none ${btnStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {feedback === 'correct' && (
          <div className="mt-6 text-green-600 font-black text-2xl animate-bounce">
            Chính xác! Làm tốt lắm! 🎉
          </div>
        )}
        {feedback === 'incorrect' && (
          <div className="mt-6 text-red-500 font-black text-2xl">
            Chưa đúng rồi, thử lại nhé! 🤔
          </div>
        )}
      </div>
    </div>
  );
};
