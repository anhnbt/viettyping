import React from 'react';
import { Subject, Topic } from '@/data/subjects';
import { IoArrowBack, IoTime, IoTrophy } from 'react-icons/io5';

interface TopicSelectorProps {
  subject: Subject;
  onSelectTopic: (topic: Topic) => void;
  onBack: () => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  subject,
  onSelectTopic,
  onBack,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Dễ';
      case 'medium':
        return 'Trung bình';
      case 'hard':
        return 'Khó';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <IoArrowBack className="text-xl" />
          <span>Quay lại</span>
        </button>
        <div className="text-center flex-1">
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${subject.color} text-white mb-2`}
          >
            <span className="text-2xl">{subject.icon}</span>
            <h1 className="text-2xl font-bold">{subject.name}</h1>
          </div>
          <p className="text-gray-600">{subject.description}</p>
        </div>
        <div className="w-20"></div> {/* Spacer for balance */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {subject.topics.length}
          </div>
          <div className="text-sm text-blue-800">Chủ đề</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {subject.topics.reduce(
              (acc, topic) => acc + topic.activities.length,
              0
            )}
          </div>
          <div className="text-sm text-green-800">Hoạt động</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(
              subject.topics.reduce(
                (acc, topic) => acc + topic.estimatedTime,
                0
              ) / subject.topics.length
            )}
          </div>
          <div className="text-sm text-purple-800">Phút/chủ đề</div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subject.topics.map((topic, index) => (
          <div
            key={topic.id}
            onClick={() => onSelectTopic(topic)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100"
          >
            <div className="p-6">
              {/* Topic number badge */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${subject.color} text-white flex items-center justify-center text-sm font-bold`}
                >
                  {index + 1}
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    topic.difficulty
                  )}`}
                >
                  {getDifficultyText(topic.difficulty)}
                </div>
              </div>

              {/* Topic content */}
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {topic.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {topic.description}
              </p>

              {/* Topic stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <IoTime className="text-blue-500" />
                  <span>{topic.estimatedTime} phút</span>
                </div>
                <div className="flex items-center gap-1">
                  <IoTrophy className="text-yellow-500" />
                  <span>{topic.activities.length} hoạt động</span>
                </div>
              </div>

              {/* Activity types */}
              <div className="mt-4 flex flex-wrap gap-1">
                {[
                  ...new Set(topic.activities.map((activity) => activity.type)),
                ].map((type) => (
                  <span
                    key={type}
                    className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {getActivityTypeText(type)}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress bar placeholder */}
            <div className="px-6 pb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: '0%' }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Chưa bắt đầu</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getActivityTypeText = (type: string) => {
  switch (type) {
    case 'typing':
      return 'Gõ phím';
    case 'quiz':
      return 'Trắc nghiệm';
    case 'drawing':
      return 'Vẽ';
    case 'listening':
      return 'Nghe';
    case 'reading':
      return 'Đọc';
    case 'math':
      return 'Toán';
    case 'game':
      return 'Trò chơi';
    default:
      return type;
  }
};

export default TopicSelector;
