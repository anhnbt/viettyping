"use client";

import React, { useState } from 'react';
import { lessons, Lesson } from '@/data/lessons';
import { subjects, Subject, Topic } from '@/data/subjects';
import LevelSelector from '@/components/LevelSelector';
import TypingPractice from '@/components/TypingPractice';
import SplashScreen from '@/components/SplashScreen';
import SubjectSelector from '@/components/SubjectSelector';
import TopicSelector from '@/components/TopicSelector';
import ActivityView from '@/components/ActivityView';
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

interface Stats {
  wpm: number;
  accuracy: number;
  incorrectCount: number;
}

type ViewType = 'splash' | 'subjects' | 'typing-lessons' | 'topics' | 'activities' | 'typing-practice';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('splash');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showStats, setShowStats] = useState(false);

  const handleLessonComplete = (newStats: Stats) => {
    setStats(newStats);
    setShowStats(true);
  };

  const handleActivityComplete = (activityId: string, score: number) => {
    console.log(`Activity ${activityId} completed with score: ${score}`);
  };

  const getNextLesson = () => {
    if (!selectedLesson) return null;
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
    return lessons[currentIndex + 1] || null;
  };

  const handleNextLesson = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      setSelectedLesson(nextLesson);
      setShowStats(false);
    }
  };

  // Splash Screen
  if (currentView === 'splash') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <SplashScreen onStart={() => setCurrentView('subjects')} />
      </main>
    );
  }

  // Subject Selection
  if (currentView === 'subjects') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setCurrentView('subjects')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentView === 'subjects'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
              }`}
            >
              📚 Học các môn
            </button>
            <button
              onClick={() => setCurrentView('typing-lessons')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentView === 'typing-lessons'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
              }`}
            >
              ⌨️ Luyện gõ phím
            </button>
          </div>
        </div>
        
        <SubjectSelector
          subjects={subjects}
          onSelectSubject={(subject) => {
            setSelectedSubject(subject);
            setCurrentView('topics');
          }}
        />
      </main>
    );
  }

  // Typing Lessons Selection
  if (currentView === 'typing-lessons') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setCurrentView('subjects')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentView === 'subjects'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
              }`}
            >
              📚 Học các môn
            </button>
            <button
              onClick={() => setCurrentView('typing-lessons')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentView === 'typing-lessons'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
              }`}
            >
              ⌨️ Luyện gõ phím
            </button>
          </div>
        </div>

        <LevelSelector
          lessons={lessons}
          onSelectLesson={(lesson) => {
            setSelectedLesson(lesson);
            setCurrentView('typing-practice');
          }}
        />
      </main>
    );
  }

  // Topic Selection within a Subject
  if (currentView === 'topics' && selectedSubject) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <TopicSelector
          subject={selectedSubject}
          onSelectTopic={(topic) => {
            setSelectedTopic(topic);
            setCurrentView('activities');
          }}
          onBack={() => {
            setSelectedSubject(null);
            setCurrentView('subjects');
          }}
        />
      </main>
    );
  }

  // Activity View within a Topic
  if (currentView === 'activities' && selectedTopic) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <ActivityView
          topic={selectedTopic}
          onBack={() => {
            setSelectedTopic(null);
            setCurrentView('topics');
          }}
          onComplete={handleActivityComplete}
        />
      </main>
    );
  }

  // Typing Practice
  if (currentView === 'typing-practice' && selectedLesson) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setSelectedLesson(null);
                  setCurrentView('typing-lessons');
                }}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
              >
                <IoArrowBack className="text-xl" />
                <span>Quay lại</span>
              </button>
            </div>
            <h1 className="text-4xl font-bold">{selectedLesson.title}</h1>
            {getNextLesson() && (
              <button
                onClick={handleNextLesson}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
              >
                <span>Tiếp theo</span>
                <IoArrowForward className="text-xl" />
              </button>
            )}
          </div>

          <TypingPractice
            lesson={selectedLesson}
            onComplete={handleLessonComplete}
          />

          {showStats && stats && (
            <div className="mt-8 p-6 bg-green-100 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Kết quả</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600">Tốc độ</p>
                  <p className="text-2xl font-bold">{stats.wpm} WPM</p>
                </div>
                <div>
                  <p className="text-gray-600">Độ chính xác</p>
                  <p className="text-2xl font-bold">{stats.accuracy}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Số lỗi</p>
                  <p className="text-2xl font-bold text-red-500">{stats.incorrectCount}</p>
                </div>
              </div>

              {getNextLesson() && (
                <button
                  onClick={handleNextLesson}
                  className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Bài tiếp theo
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  // Fallback
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Có lỗi xảy ra...</p>
          <button
            onClick={() => setCurrentView('subjects')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </main>
  );
}
