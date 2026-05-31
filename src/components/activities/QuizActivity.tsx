import React, { useState, useEffect } from 'react';
import { ActivityAdapterProps } from '@/types/activity';

export const QuizActivity: React.FC<ActivityAdapterProps> = ({ activity, onComplete, onProgressUpdate }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const checkAnswer = (answer: string) => {
    setSelectedOption(answer);
    if (answer === activity.correctAnswer) {
      setFeedback('correct');
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
      if (!wrongAnswers.includes(answer)) {
        setWrongAnswers(prev => [...prev, answer]);
      }
    }
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
        <p className="text-gray-600">{activity.instructions}</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 flex flex-col items-center">
        {activity.imageUrl && (
          <div className="mb-6 max-w-sm w-full overflow-hidden rounded-2xl border-4 border-white shadow-md">
            <img 
              src={activity.imageUrl} 
              alt={activity.title || "Hình minh họa"} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        <div className="text-3xl font-bold mb-4">{activity.content}</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mx-auto">
          {activity.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => checkAnswer(option)}
              disabled={feedback === 'correct'}
              className={`p-4 border-2 rounded-xl text-xl font-bold transition-all transform hover:scale-105 ${
                selectedOption === option
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
};
