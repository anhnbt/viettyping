import React, { useState, useEffect } from 'react';
import { Topic, Activity, subjects } from '@/data/subjects';
import { IoArrowBack } from 'react-icons/io5';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';
import { hasVietnameseDiacritics } from '@/utils/vietnameseUtils';
import TelexGuide from './TelexGuide';

// Import Adapters
import { 
  QuizActivity, 
  ReadingActivity, 
  DrawingActivity, 
  ListeningActivity, 
  TypingActivity 
} from '@/components/activities';
import { ActivityTelemetry } from '@/types/activity';

interface ActivityViewProps {
  topic: Topic;
  onComplete: (activityId: string, score: number) => void;
}

const ActivityView: React.FC<ActivityViewProps> = ({ topic, onComplete }) => {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const subject = subjects.find(s => s.id === subjectId);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0); // For intra-activity progress bar
  const { isActivityCompleted, saveProgress, isLoaded, getTopicProgress, clearTopicProgress } = useProgress();

  const currentActivity = topic.activities[currentActivityIndex];

  // Reset progress when changing activity
  useEffect(() => {
    setCurrentProgress(0);
  }, [currentActivityIndex]);

  const handleActivityComplete = (telemetry: ActivityTelemetry) => {
    const activityId = currentActivity.id;
    
    // TODO: Send telemetry data to backend/analytics server here
    console.log(`[Telemetry] Activity ${activityId} completed:`, telemetry);

    // Save score progress
    saveProgress(activityId, telemetry.score);
    onComplete(activityId, telemetry.score);

    // Move to next activity
    if (currentActivityIndex < topic.activities.length - 1) {
      setTimeout(() => {
        setCurrentActivityIndex((prev) => prev + 1);
      }, 1000); // Wait 1s before moving next to allow animations to finish
    }
  };

  const handleProgressUpdate = (progress: number) => {
    setCurrentProgress(progress);
  };

  const renderActivity = (activity: Activity) => {
    switch (activity.type) {
      case 'typing':
        return <TypingActivity activity={activity} onComplete={handleActivityComplete} onProgressUpdate={handleProgressUpdate} />;
      case 'quiz':
      case 'math':
        return <QuizActivity activity={activity} onComplete={handleActivityComplete} onProgressUpdate={handleProgressUpdate} />;
      case 'reading':
        return <ReadingActivity activity={activity} onComplete={handleActivityComplete} onProgressUpdate={handleProgressUpdate} />;
      case 'drawing':
        return <DrawingActivity activity={activity} onComplete={handleActivityComplete} onProgressUpdate={handleProgressUpdate} />;
      case 'listening':
        return <ListeningActivity activity={activity} onComplete={handleActivityComplete} onProgressUpdate={handleProgressUpdate} />;
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

  if (!isLoaded) return null;

  const activityIds = topic.activities.map(a => a.id);
  const progress = getTopicProgress(activityIds);
  const isTopicComplete = progress === 100;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Professional Header */}
      <header className="h-14 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <Link
            href={`/subjects/${subjectId}`}
            className="group flex items-center gap-1.5 p-2 -ml-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Quay lại"
          >
            <IoArrowBack className="text-xl group-hover:-translate-x-0.5 transition-transform" />
          </Link>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200" />

          {/* Subject Icon + Title */}
          <div className="flex items-center gap-2.5">
            {subject && (
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center text-white text-sm shrink-0 shadow-sm`}>
                {subject.icon}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate leading-tight">
                {topic.title}
              </h1>
              <p className="text-xs text-gray-500 truncate">
                {currentActivityIndex + 1}/{topic.activities.length} hoạt động
              </p>
            </div>
          </div>
        </div>

        {/* Progress Dots + Badge */}
        <div className="flex items-center gap-3">
          {/* Activity Progress Dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {topic.activities.map((activity, index) => {
              const isCompleted = isActivityCompleted(activity.id);
              const isActive = index === currentActivityIndex;
              return (
                <button
                  key={activity.id}
                  onClick={() => setCurrentActivityIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${isActive
                    ? 'bg-blue-600 scale-125 ring-2 ring-blue-200'
                    : isCompleted
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  title={activity.title}
                />
              );
            })}
          </div>

          {/* Progress Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${progress === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
            {Math.round(progress)}%
          </div>
        </div>

        {/* Intra-activity Progress Bar (Optional) */}
        {currentProgress > 0 && currentProgress < 100 && (
          <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300" style={{ width: `${currentProgress}%` }} />
        )}
      </header>

      {/* 2. Main Content (Split Screen) */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left Panel: Instructions & Avatar */}
        <div className="w-80 md:w-96 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto z-10 hidden lg:flex">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                {currentActivityIndex + 1}
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {currentActivity.title}
              </h2>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl text-gray-700 leading-relaxed border border-blue-100 mb-6">
              {currentActivity.instructions}
            </div>

            {/* TELEX Guide - shown for Vietnamese typing activities */}
            {currentActivity.type === 'typing' && hasVietnameseDiacritics(currentActivity.content) && (
              <TelexGuide />
            )}

            {/* Context/Mascot placeholder - Makes it friendly for kids */}
            <div className="mt-auto pt-8 flex justify-center opacity-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/mascot-placeholder.png" alt="Mascot" className="h-32 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
            </div>
          </div>
        </div>

        {/* Right Panel: Workspace / Activity Area */}
        <div className="flex-1 bg-gray-100/50 flex flex-col relative overflow-hidden">
          {/* Mobile Instruction Toggle (Visible only on small screens) */}
          <div className="lg:hidden p-4 bg-white border-b border-gray-200 shrink-0">
            <h2 className="font-bold text-gray-800 mb-1">{currentActivity.title}</h2>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{currentActivity.instructions}</p>
            {currentActivity.type === 'typing' && hasVietnameseDiacritics(currentActivity.content) && (
              <TelexGuide />
            )}
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
            <div className={`w-full h-full flex items-center justify-center mx-auto ${
              currentActivity.type === 'drawing' ? 'max-w-5xl' : 'max-w-4xl'
            }`}>
              {renderActivity(currentActivity)}
            </div>
          </div>
        </div>

        {/* Completion Overlay */}
        {isTopicComplete && (
          <div className="absolute inset-0 bg-white/90 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
            <div className="text-center p-8 bg-white rounded-3xl shadow-2xl border-4 border-green-100 max-w-lg mx-4">
              <div className="text-8xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-3xl font-bold text-green-800 mb-2">
                Hoàn thành xuất sắc!
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                Con đã hoàn thành toàn bộ chủ đề <span className="font-bold text-blue-600">{topic.title}</span>.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    const activityIds = topic.activities.map(a => a.id);
                    clearTopicProgress(activityIds);
                    setCurrentActivityIndex(0);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Làm lại
                </button>
                <Link href={`/subjects/${subjectId}`} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg hover:shadow-green-200">
                  Bài học tiếp theo
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityView;
