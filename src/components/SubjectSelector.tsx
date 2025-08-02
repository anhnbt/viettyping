import React from 'react';
import { Subject } from '@/data/subjects';

interface SubjectSelectorProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({ subjects, onSelectSubject }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Hệ thống học tập cho bé
        </h1>
        <p className="text-xl text-gray-600">
          Chọn môn học để bắt đầu hành trình khám phá kiến thức
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => onSelectSubject(subject)}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${subject.color} p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
          >
            <div className="relative z-10">
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {subject.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{subject.name}</h3>
              <p className="text-sm opacity-90 mb-3">{subject.description}</p>
              {subject.grade && (
                <div className="inline-block bg-white bg-opacity-20 rounded-full px-3 py-1 text-xs font-medium">
                  {subject.grade}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm opacity-80">
                  {subject.topics.length} chủ đề
                </span>
                <div className="bg-white bg-opacity-20 rounded-full p-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Hiệu ứng background */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-6 py-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-blue-700 font-medium">
            Tất cả môn học đều có hoạt động tương tác và thú vị!
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;
