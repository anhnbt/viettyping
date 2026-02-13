'use client';

import React from 'react';
import { Subject, Topic } from '@/data/subjects';
import { IoArrowBack, IoTime, IoTrophy, IoCheckmarkCircle, IoLibrary, IoRocket } from 'react-icons/io5';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { motion } from 'framer-motion';

interface TopicSelectorProps {
  subject: Subject;
  onSelectTopic: (topic: Topic) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  subject,
  onSelectTopic,
}) => {
  const { getTopicProgress, isLoaded } = useProgress();

  if (!isLoaded) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  // Calculate overall progress
  const totalActivities = subject.topics.reduce((acc, t) => acc + t.activities.length, 0);
  const completedTopics = subject.topics.filter(t => {
    const ids = t.activities.map(a => a.id);
    return getTopicProgress(ids) === 100;
  }).length;

  return (
    <div className="min-h-screen">
      {/* Professional Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Back Button */}
            <Link
              href="/"
              className="group flex items-center gap-2 px-3 py-2 -ml-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <IoArrowBack className="text-xl group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-medium hidden sm:inline">Trang chủ</span>
            </Link>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200" />

            {/* Title Area */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-white text-lg shrink-0 shadow-sm`}>
                {subject.icon}
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold text-gray-900 truncate">{subject.name}</h1>
                <p className="text-xs text-gray-500 truncate hidden sm:block">{subject.description}</p>
              </div>
            </div>

            {/* Progress Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <IoLibrary className="text-blue-500" />
                  {subject.topics.length} chủ đề
                </span>
                <span className="flex items-center gap-1">
                  <IoRocket className="text-purple-500" />
                  {totalActivities} hoạt động
                </span>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${completedTopics === subject.topics.length ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {completedTopics}/{subject.topics.length} ✓
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className={`bg-gradient-to-r ${subject.color} py-8 px-4`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 text-white">
            <div className="text-5xl">{subject.icon}</div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">{subject.name}</h2>
              <p className="text-white/80 text-sm md:text-base">{subject.description}</p>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-white/80 mb-1.5">
              <span>Tiến độ tổng thể</span>
              <span className="font-bold text-white">{completedTopics}/{subject.topics.length} chủ đề</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 backdrop-blur-sm">
              <div
                className="bg-white h-2.5 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${subject.topics.length > 0 ? (completedTopics / subject.topics.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subject.topics.map((topic, index) => {
            const activityIds = topic.activities.map(a => a.id);
            const progress = getTopicProgress(activityIds);
            const isComplete = progress === 100;

            return (
              <motion.div
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border-2 ${isComplete ? 'border-green-200' : 'border-transparent hover:border-blue-100'} overflow-hidden`}
              >
                {/* Card Top Accent */}
                <div className={`h-1 bg-gradient-to-r ${subject.color}`} />

                <div className="p-5">
                  {/* Topic number badge + difficulty */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-xl bg-gradient-to-br ${subject.color} text-white flex items-center justify-center text-sm font-bold shadow-sm`}
                      >
                        {index + 1}
                      </div>
                      {isComplete && <IoCheckmarkCircle className="text-green-500 text-xl" />}
                    </div>
                    <div
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(topic.difficulty)}`}
                    >
                      {getDifficultyText(topic.difficulty)}
                    </div>
                  </div>

                  {/* Topic content */}
                  <h3 className="text-base font-bold text-gray-800 mb-1.5">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>

                  {/* Topic meta */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <IoTime className="text-blue-400" />
                      <span>{topic.estimatedTime} phút</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IoTrophy className="text-amber-400" />
                      <span>{topic.activities.length} hoạt động</span>
                    </div>
                  </div>

                  {/* Activity types */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {[
                      ...new Set(topic.activities.map((activity) => activity.type)),
                    ].map((type) => (
                      <span
                        key={type}
                        className="inline-block px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-md font-medium"
                      >
                        {getActivityTypeText(type)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="px-5 pb-4">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <div className="text-xs text-gray-400">
                      {progress === 0 ? 'Chưa bắt đầu' : progress === 100 ? '✓ Hoàn thành' : 'Đang học'}
                    </div>
                    <div className={`text-xs font-bold ${isComplete ? 'text-green-600' : 'text-blue-600'}`}>{progress}%</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const getActivityTypeText = (type: string) => {
  switch (type) {
    case 'typing':
      return '⌨️ Gõ phím';
    case 'quiz':
      return '📝 Trắc nghiệm';
    case 'drawing':
      return '🎨 Vẽ';
    case 'listening':
      return '🎵 Nghe';
    case 'reading':
      return '📖 Đọc';
    case 'math':
      return '🔢 Toán';
    case 'game':
      return '🎮 Trò chơi';
    default:
      return type;
  }
};

export default TopicSelector;
