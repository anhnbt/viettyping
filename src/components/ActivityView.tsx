import React, { useState } from 'react';
import { Topic, Activity } from '@/data/subjects';
import { IoArrowBack, IoCheckmark, IoPlay } from 'react-icons/io5';
import TypingPractice from './TypingPractice';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ActivityViewProps {
  topic: Topic;
  onComplete: (activityId: string, score: number) => void;
}

const ActivityView: React.FC<ActivityViewProps> = ({ topic, onComplete }) => {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(
    new Set()
  );
  const [showTypingPractice, setShowTypingPractice] = useState(false);

  const currentActivity = topic.activities[currentActivityIndex];

  const handleActivityComplete = (score: number) => {
    const activityId = currentActivity.id;
    setCompletedActivities((prev) => new Set([...prev, activityId]));
    onComplete(activityId, score);

    // Chuyển sang hoạt động tiếp theo
    if (currentActivityIndex < topic.activities.length - 1) {
      setCurrentActivityIndex((prev) => prev + 1);
    }
  };

  const handleTypingComplete = (stats: {
    wpm: number;
    accuracy: number;
    incorrectCount: number;
  }) => {
    const accuracy = stats.accuracy;
    setShowTypingPractice(false);
    handleActivityComplete(accuracy);
  };

  const renderActivity = (activity: Activity) => {
    switch (activity.type) {
      case 'typing':
        if (showTypingPractice) {
          // Chuyển đổi activity thành lesson format
          const lesson = {
            id: activity.id,
            level: 'basic' as const,
            title: activity.title,
            description: activity.instructions,
            content: activity.content,
            targetWPM: 20,
            minAccuracy: 85,
          };

          return (
            <div>
              <button
                onClick={() => setShowTypingPractice(false)}
                className="mb-4 flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <IoArrowBack className="text-xl" />
                <span>Quay lại</span>
              </button>
              <TypingPractice
                lesson={lesson}
                onComplete={handleTypingComplete}
              />
            </div>
          );
        }

        return (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
              <p className="text-gray-600">{activity.instructions}</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <p className="text-lg font-mono">{activity.content}</p>
            </div>
            <button
              onClick={() => setShowTypingPractice(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <IoPlay />
              Bắt đầu luyện tập
            </button>
          </div>
        );

      case 'quiz':
        return (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
              <p className="text-gray-600">{activity.instructions}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <p className="text-lg">{activity.content}</p>
            </div>
            <div className="space-y-3">
              <button className="block w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                A. Bố mẹ
              </button>
              <button className="block w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                B. Bạn bè
              </button>
              <button className="block w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                C. Thầy cô
              </button>
            </div>
          </div>
        );

      case 'reading':
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
              onClick={() => handleActivityComplete(100)}
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Hoàn thành đọc
            </button>
          </div>
        );

      case 'math':
        return (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
              <p className="text-gray-600">{activity.instructions}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="text-3xl font-bold mb-4">2 + 3 = ?</div>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {[4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleActivityComplete(num === 5 ? 100 : 0)}
                    className="p-4 bg-white border border-gray-300 rounded-lg hover:bg-blue-100 transition-colors text-xl font-bold"
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'drawing':
        return (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
              <p className="text-gray-600">{activity.instructions}</p>
            </div>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 mb-6">
              <div className="w-full h-64 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Khu vực vẽ (Demo)</p>
              </div>
            </div>
            <button
              onClick={() => handleActivityComplete(100)}
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Hoàn thành vẽ
            </button>
          </div>
        );

      case 'listening':
        return (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
              <p className="text-gray-600">{activity.instructions}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoPlay className="text-white text-3xl" />
              </div>
              <p className="text-lg">Nhấn để nghe âm thanh</p>
            </div>
            <button
              onClick={() => handleActivityComplete(100)}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Đã nghe xong
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <p className="text-gray-500">
              Loại hoạt động này đang được phát triển...
            </p>
          </div>
        );
    }
  };

  const progress = (completedActivities.size / topic.activities.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href={`/subjects/${subjectId}`}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <IoArrowBack className="text-xl" />
          <span>Quay lại</span>
        </Link>

        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {topic.title}
          </h1>
          <p className="text-gray-600">{topic.description}</p>
        </div>

        <div className="w-20"></div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Tiến độ</span>
          <span className="text-sm font-medium text-gray-700">
            {completedActivities.size}/{topic.activities.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Activity Navigation */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {topic.activities.map((activity, index) => (
          <button
            key={activity.id}
            onClick={() => setCurrentActivityIndex(index)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              index === currentActivityIndex
                ? 'bg-blue-500 text-white'
                : completedActivities.has(activity.id)
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {completedActivities.has(activity.id) ? <IoCheckmark /> : index + 1}
          </button>
        ))}
      </div>

      {/* Current Activity */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {renderActivity(currentActivity)}
      </div>

      {/* Completion Message */}
      {completedActivities.size === topic.activities.length && (
        <div className="mt-8 p-6 bg-green-100 rounded-lg text-center">
          <div className="text-green-600 text-4xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">
            Chúc mừng! Bạn đã hoàn thành chủ đề này!
          </h3>
          <p className="text-green-700">
            Hãy tiếp tục với các chủ đề khác để học thêm nhiều kiến thức mới.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityView;
