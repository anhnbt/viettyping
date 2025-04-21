import React, { useState } from 'react';
import { Lesson } from '@/data/lessons';

interface Props {
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
}

export default function LevelSelector({ lessons, onSelectLesson }: Props) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const levels = ['basic', 'intermediate', 'advanced'];

  const getLessonsForLevel = (level: string) => {
    return lessons.filter(lesson => lesson.level === level);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Chọn cấp độ luyện tập
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {levels.map(level => (
            <div 
              key={level}
              className={`p-6 rounded-lg shadow-lg ${
                selectedLevel === level 
                ? 'bg-blue-100 ring-2 ring-blue-500' 
                : 'bg-white hover:bg-gray-50'
              } transition-all duration-200`}
            >
              <h2 className="text-2xl font-semibold capitalize mb-6">{level}</h2>
              
              <div className="grid grid-cols-5 gap-4 max-h-110 overflow-y-auto pr-2 scrollbar-thin">
                {getLessonsForLevel(level).map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setSelectedLevel(level);
                      onSelectLesson(lesson);
                    }}
                    className="relative group"
                  >
                    <div className="w-full aspect-square rounded-lg bg-gray-100 
                                  flex items-center justify-center text-2xl font-bold
                                  hover:bg-blue-500 hover:text-white transition-colors">
                      {index + 1}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                                  px-4 py-2 bg-gray-800 text-white text-sm rounded-lg 
                                  opacity-0 group-hover:opacity-100 transition-opacity
                                  whitespace-nowrap pointer-events-none">
                      {lesson.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
