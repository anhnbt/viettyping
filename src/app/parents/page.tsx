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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-pink-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              onClick={() => playSound('click')}
              className="flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm text-slate-600 hover:text-indigo-600 border border-slate-100 transition-all hover:scale-105"
            >
              <IoArrowBack className="text-xl" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-wide">Góc Phụ Huynh 👨‍👩‍👧‍👦</h1>
              {studentInfo ? (
                <div className="flex items-center gap-1.5 mt-1 bg-white/50 px-3 py-1 rounded-xl border border-slate-205/40 shadow-sm w-fit">
                  <span className="text-lg">{studentInfo.avatar}</span>
                  <p className="text-slate-600 text-xs md:text-sm font-semibold">
                    Đang xem tiến độ: <span className="font-black text-indigo-700">{studentInfo.name || studentInfo.nickname}</span> ({studentInfo.nickname}) • <span className="text-slate-500 font-bold">{studentInfo.grade}</span>
                  </p>
                  <button
                    onClick={() => {
                      playSound('click');
                      setIsOpenConfig(true);
                    }}
                    className="text-xs text-indigo-650 hover:text-indigo-850 underline font-black ml-2 cursor-pointer"
                  >
                    Đổi
                  </button>
                </div>
              ) : (
                <p className="text-slate-500 text-sm font-semibold">Theo dõi tiến trình và xây dựng lộ trình học tập cho con</p>
              )}
            </div>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex bg-slate-200/60 p-1.5 rounded-[22px] border border-slate-200/40 w-full sm:w-auto shrink-0 shadow-inner">
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('dashboard');
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-[18px] text-sm font-black transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                  : 'text-slate-600 hover:text-slate-900'
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
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-[18px] text-sm font-black transition-all cursor-pointer ${
                activeTab === 'analyzer'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Phân Tích Học Bạ</span>
              <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase animate-pulse">Mới</span>
            </button>
          </div>
        </div>

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
                <div className="bg-white p-6 rounded-3xl shadow-[5px_5px_0px_0px_#e2e8f0] border-2 border-slate-100">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                      <IoCheckmarkCircle className="text-2xl" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tiến độ tổng thể</div>
                      <div className="text-3xl font-black text-slate-800">{stats.overallProgress}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 mt-3 overflow-hidden">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stats.overallProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-[5px_5px_0px_0px_#e2e8f0] border-2 border-slate-100 flex flex-col justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                      <IoStatsChart className="text-2xl" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Điểm trung bình</div>
                      <div className="text-3xl font-black text-slate-800">{stats.averageScore}/100</div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 mt-3">Tính trên các hoạt động đã làm</p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-[5px_5px_0px_0px_#e2e8f0] border-2 border-slate-100 flex flex-col justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                      <IoTime className="text-2xl" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Hoạt động gần nhất</div>
                      <div className="text-xl font-black text-slate-800">
                        {stats.recentActivities.length > 0
                          ? new Date(stats.recentActivities[0].timestamp).toLocaleDateString('vi-VN')
                          : 'Chưa có'}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-purple-500 truncate mt-3">
                    {stats.recentActivities.length > 0 ? stats.recentActivities[0].title : ''}
                  </p>
                </div>
              </div>

              {/* Subject Progress & Activity Log */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tiến độ môn học */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[5px_5px_0px_0px_#e2e8f0] border-2 border-slate-100">
                  <h2 className="text-2xl font-black text-slate-850 mb-6">Tiến Độ Theo Môn Học</h2>
                  <div className="space-y-6">
                    {stats.subjectStats.map(subject => (
                      <div key={subject.id}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl bg-slate-50 p-1.5 rounded-xl border border-slate-100 shadow-sm">{subject.icon}</span>
                            <span className="font-black text-slate-700 text-sm md:text-base">{subject.name}</span>
                          </div>
                          <span className="text-sm font-black text-slate-500">{subject.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full bg-gradient-to-r ${subject.color}`}
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hoạt động gần đây */}
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[5px_5px_0px_0px_#e2e8f0] border-2 border-slate-100">
                  <h2 className="text-2xl font-black text-slate-850 mb-6">Hoạt Động Gần Đây</h2>
                  {stats.recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentActivities.map((activity, idx) => (
                        <div key={activity.id + idx} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
                          <div>
                            <div className="font-black text-slate-800 text-sm md:text-base">{activity.title}</div>
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">{activity.subjectName}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-black text-sm md:text-base ${activity.score >= 80 ? 'text-green-600' : activity.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                              {activity.score} điểm
                            </div>
                            <div className="text-xs text-slate-400 font-semibold mt-0.5">
                              {new Date(activity.timestamp).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400 flex flex-col items-center justify-center">
                      <IoWarning className="text-5xl mb-3 opacity-30 text-indigo-500" />
                      <p className="font-bold">Chưa có hoạt động học tập nào của bé</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">Hãy để bé chơi thử một bài tập hoặc môn học ở trang chủ trước nhé!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Banner */}
              <div className="bg-indigo-50 border-2 border-indigo-100 p-6 rounded-3xl text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-6 -translate-y-1/2 text-4xl opacity-20 pointer-events-none">💡</div>
                <div className="absolute top-1/2 right-6 -translate-y-1/2 text-4xl opacity-20 pointer-events-none">✨</div>
                <h3 className="font-black text-indigo-900 mb-1.5 text-lg">Đồng Hành Học Tập Cùng {studentInfo ? studentInfo.nickname : 'Con'}</h3>
                <p className="text-indigo-600 text-sm max-w-xl mx-auto font-semibold leading-relaxed">
                  Ba mẹ ơi, hãy chuyển sang tab <span className="underline font-bold">Phân Tích Học Bạ</span> ở góc trên để dán nhận xét học tập ở trường của bé {studentInfo ? studentInfo.nickname : 'con'}. Hệ thống sẽ đề xuất một lộ trình cải thiện kỹ năng tức thì cho bé nhé!
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
