'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { subjects } from '@/data/subjects';
import { IoArrowBack, IoStatsChart, IoTime, IoWarning, IoCheckmarkCircle } from 'react-icons/io5';
import ReportCardAnalyzer from '@/components/ReportCardAnalyzer';
import { useSound } from '@/contexts/SoundContext';
import { useStudent } from '@/contexts/StudentContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ParentsPage() {
  const { progress, isLoaded } = useProgress();
  const { playSound } = useSound();
  const { studentInfo, setIsOpenConfig } = useStudent();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analyzer'>('dashboard');

  const stats = useMemo(() => {
    if (!isLoaded) return null;

    let totalActivities = 0;
    let completedActivities = 0;
    let totalScore = 0;

    const subjectStats = subjects.map(subject => {
      let subjectTotalActivities = 0;
      let subjectCompletedActivities = 0;
      let subjectScore = 0;

      subject.topics.forEach(topic => {
        topic.activities.forEach(activity => {
          subjectTotalActivities++;
          const activityProgress = progress[activity.id];
          if (activityProgress) {
            subjectCompletedActivities++;
            subjectScore += activityProgress.score;
          }
        });
      });

      totalActivities += subjectTotalActivities;
      completedActivities += subjectCompletedActivities;
      totalScore += subjectScore;

      return {
        ...subject,
        progress: subjectTotalActivities === 0 ? 0 : Math.round((subjectCompletedActivities / subjectTotalActivities) * 100),
        averageScore: subjectCompletedActivities === 0 ? 0 : Math.round(subjectScore / subjectCompletedActivities),
        completedCount: subjectCompletedActivities,
        totalCount: subjectTotalActivities
      };
    });

    const overallProgress = totalActivities === 0 ? 0 : Math.round((completedActivities / totalActivities) * 100);
    const averageScore = completedActivities === 0 ? 0 : Math.round(totalScore / completedActivities);

    // Get recent activities
    const recentActivities = Object.entries(progress)
      .map(([id, data]) => {
        // Find activity info
        let activityInfo: { title: string; subjectName: string } | null = null;
        for (const s of subjects) {
          for (const t of s.topics) {
            const act = t.activities.find(a => a.id === id);
            if (act) {
              activityInfo = { title: act.title, subjectName: s.name };
              break;
            }
          }
          if (activityInfo) break;
        }
        return {
          id,
          ...data,
          ...activityInfo
        };
      })
      .filter(item => item.title) // Filter out unknown activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);

    return {
      overallProgress,
      averageScore,
      subjectStats,
      recentActivities
    };
  }, [progress, isLoaded]);

  if (!isLoaded) {
    return <div className="p-8 text-center font-bold text-slate-500">Đang tải dữ liệu học tập...</div>;
  }

  if (!stats) return null;

  return (
    <main className="min-h-screen canvas-bg pb-16 text-[var(--color-foreground)] transition-colors">
      {/* Sticky Header Xe Lửa: Hành Trình Năm Học Của Con */}
      <header className="sticky top-0 z-50 w-full bg-[var(--color-surface)] border-b-4 border-[var(--color-foreground)] shadow-[0_4px_0_0_rgba(0,0,0,0.1)] rounded-b-[24px] mb-8 transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Chunky Keycap Back Button */}
            <Link
              href="/"
              onClick={() => playSound('click')}
              className="keycap-btn-surface w-12 h-12 flex items-center justify-center shrink-0"
              title="Quay lại trang chủ"
            >
              <IoArrowBack className="text-xl" />
            </Link>
            
            {/* Train & Journey Title */}
            <div className="flex items-center gap-3 text-center sm:text-left">
              <span className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🚂</span>
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-wider text-[var(--color-foreground)] uppercase">
                  HÀNH TRÌNH NĂM HỌC CỦA CON
                </h1>
                {studentInfo ? (
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1 text-sm text-[var(--color-foreground)] opacity-90">
                    <span className="bg-[var(--color-background)] px-2 py-0.5 rounded-lg border border-[var(--color-foreground)] font-bold">
                      Con: <strong>{studentInfo.name || studentInfo.nickname}</strong>
                    </span>
                    <span className="bg-[var(--color-background)] px-2 py-0.5 rounded-lg border border-[var(--color-foreground)] font-bold">
                      Lớp: <strong>{studentInfo.grade}</strong>
                    </span>
                    <span className="bg-[var(--color-background)] px-2 py-0.5 rounded-lg border border-[var(--color-foreground)] font-bold">
                      Năm học: <strong>2025 - 2026</strong>
                    </span>
                    <button
                      onClick={() => {
                        playSound('click');
                        setIsOpenConfig(true);
                      }}
                      className="text-xs text-[var(--color-primary-depth)] hover:underline font-black ml-1 flex items-center gap-0.5 cursor-pointer"
                    >
                      {studentInfo.avatar} Đổi
                    </button>
                  </div>
                ) : (
                  <p className="text-xs font-semibold opacity-75">Theo dõi hành trình học tập đầy niềm vui của bé</p>
                )}
              </div>
            </div>
          </div>

          {/* Tab Selector Buttons - Brutalist design */}
          <div className="flex bg-[var(--color-background)] p-1.5 rounded-[20px] border-3 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)] w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('dashboard');
              }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-[14px] text-xs md:text-sm font-black transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[var(--color-primary)] text-white border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)] translate-y-[-2px]'
                  : 'text-[var(--color-foreground)] opacity-70 hover:opacity-100'
              }`}
            >
              <IoStatsChart className="text-lg" />
              <span>Tiến Độ Của Bé</span>
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('analyzer');
              }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-[14px] text-xs md:text-sm font-black transition-all cursor-pointer ${
                activeTab === 'analyzer'
                  ? 'bg-[var(--color-primary)] text-white border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)] translate-y-[-2px]'
                  : 'text-[var(--color-foreground)] opacity-70 hover:opacity-100'
              }`}
            >
              <span>Phân Tích Học Bạ</span>
              <span className="bg-[var(--color-accent)] text-[var(--color-foreground)] border border-[var(--color-foreground)] text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase animate-pulse">Mới</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4">
        {/* Tab Content rendering */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Overall Progress */}
                <div className="bg-[var(--color-surface)] p-6 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--color-foreground)] flex flex-col justify-between transition-colors">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] rounded-2xl border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                      <IoCheckmarkCircle className="text-2xl" />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--color-foreground)] opacity-70 font-bold uppercase tracking-wider">Tiến độ tổng thể</div>
                      <div className="text-3xl font-black text-[var(--color-foreground)]">{stats.overallProgress}%</div>
                    </div>
                  </div>
                  {/* Brutalist Progress Bar */}
                  <div className="w-full bg-[var(--color-background)] border-2 border-[var(--color-foreground)] rounded-full h-5 p-0.5 overflow-hidden mt-3">
                    <div
                      className="bg-[var(--color-primary)] h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.overallProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* 2. Average Score */}
                <div className="bg-[var(--color-surface)] p-6 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--color-foreground)] flex flex-col justify-between transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[var(--color-accent)] text-[var(--color-foreground)] rounded-2xl border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                      <IoStatsChart className="text-2xl" />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--color-foreground)] opacity-70 font-bold uppercase tracking-wider">Điểm trung bình</div>
                      <div className="text-3xl font-black text-[var(--color-foreground)]">{stats.averageScore}/100</div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-[var(--color-foreground)] opacity-50 mt-4">Tính trên các bài luyện tập đã hoàn thành</p>
                </div>

                {/* 3. Last Activity */}
                <div className="bg-[var(--color-surface)] p-6 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--color-foreground)] flex flex-col justify-between transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[var(--color-secondary)] text-[var(--color-foreground)] rounded-2xl border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                      <IoTime className="text-2xl" />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--color-foreground)] opacity-70 font-bold uppercase tracking-wider">Hoạt động gần nhất</div>
                      <div className="text-xl font-black text-[var(--color-foreground)]">
                        {stats.recentActivities.length > 0
                          ? new Date(stats.recentActivities[0].timestamp).toLocaleDateString('vi-VN')
                          : 'Chưa có'}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-black text-[var(--color-secondary-depth)] truncate mt-4">
                    {stats.recentActivities.length > 0 ? stats.recentActivities[0].title : 'Hãy bắt đầu hành trình ngay!'}
                  </p>
                </div>
              </div>

              {/* Subject Progress & Activity Log */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tiến độ môn học */}
                <div className="bg-[var(--color-surface)] p-6 md:p-8 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[6px_6px_0px_0px_var(--color-foreground)] transition-colors">
                  <h2 className="text-2xl font-black text-[var(--color-foreground)] mb-6 flex items-center gap-2">
                    <span>Tiến Độ Theo Môn Học</span>
                    <span>📈</span>
                  </h2>
                  <div className="space-y-6">
                    {stats.subjectStats.map(subject => (
                      <div key={subject.id}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl bg-[var(--color-background)] p-2 rounded-xl border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)]">{subject.icon}</span>
                            <span className="font-black text-[var(--color-foreground)] text-sm md:text-base">{subject.name}</span>
                          </div>
                          <span className="text-sm font-black text-[var(--color-foreground)]">{subject.progress}%</span>
                        </div>
                        {/* Custom Brutalist bar with subject original color inside */}
                        <div className="w-full bg-[var(--color-background)] border-2 border-[var(--color-foreground)] rounded-full h-5 p-0.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${subject.color}`}
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hoạt động gần đây */}
                <div className="bg-[var(--color-surface)] p-6 md:p-8 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[6px_6px_0px_0px_var(--color-foreground)] transition-colors">
                  <h2 className="text-2xl font-black text-[var(--color-foreground)] mb-6 flex items-center gap-2">
                    <span>Hoạt Động Gần Đây</span>
                    <span>✨</span>
                  </h2>
                  {stats.recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentActivities.map((activity, idx) => (
                        <div 
                          key={activity.id + idx} 
                          className="flex items-center justify-between p-4 bg-[var(--color-background)] hover:bg-[var(--color-surface)] rounded-2xl border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_var(--color-foreground)] transition-all"
                        >
                          <div>
                            <div className="font-black text-[var(--color-foreground)] text-sm md:text-base">{activity.title}</div>
                            <div className="text-xs text-[var(--color-foreground)] opacity-70 font-bold uppercase tracking-wider mt-0.5">{activity.subjectName}</div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1">
                            <span className="bg-[var(--color-surface)] border-2 border-[var(--color-foreground)] px-2.5 py-0.5 rounded-xl text-xs md:text-sm font-black shadow-[1px_1px_0px_0px_var(--color-foreground)]">
                              {activity.score} điểm
                            </span>
                            <div className="text-[10px] text-[var(--color-foreground)] opacity-60 font-semibold">
                              {new Date(activity.timestamp).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400 flex flex-col items-center justify-center">
                      <IoWarning className="text-5xl mb-3 opacity-30 text-[var(--color-primary)]" />
                      <p className="font-bold text-[var(--color-foreground)]">Chưa có hoạt động học tập nào của bé</p>
                      <p className="text-xs text-[var(--color-foreground)] opacity-75 mt-1 max-w-xs">Hãy để bé chơi thử một bài tập hoặc môn học ở trang chủ trước nhé!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Banner */}
              <div className="bg-[var(--color-surface-container)] border-4 border-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--color-foreground)] p-6 rounded-[24px] text-center relative overflow-hidden transition-colors">
                <div className="absolute top-1/2 left-6 -translate-y-1/2 text-4xl opacity-20 pointer-events-none">💡</div>
                <div className="absolute top-1/2 right-6 -translate-y-1/2 text-4xl opacity-20 pointer-events-none">✨</div>
                <h3 className="font-black text-[var(--color-foreground)] mb-1.5 text-lg">
                  Đồng Hành Học Tập Cùng {studentInfo ? studentInfo.nickname : 'Con'}
                </h3>
                <p className="text-[var(--color-foreground)] opacity-95 text-sm max-w-xl mx-auto font-semibold leading-relaxed">
                  Ba mẹ ơi, hãy chuyển sang tab <span className="underline font-black text-[var(--color-primary-depth)] cursor-pointer" onClick={() => setActiveTab('analyzer')}>Phân Tích Học Bạ</span> ở góc trên để dán nhận xét học tập ở trường của bé {studentInfo ? studentInfo.nickname : 'con'}. Hệ thống sẽ đề xuất một lộ trình cải thiện kỹ năng tức thì cho bé nhé!
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ReportCardAnalyzer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

