'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { useSubjects } from '@/contexts/SubjectsContext';
import { IoStatsChart, IoTime, IoWarning, IoCheckmarkCircle } from 'react-icons/io5';
import ReportCardAnalyzer from '@/components/ReportCardAnalyzer';
import { useSound } from '@/contexts/SoundContext';
import { useStudent } from '@/contexts/StudentContext';
import { motion, AnimatePresence } from 'framer-motion';
import SyncStatusIndicator from '@/components/SyncStatusIndicator';
import { 
  Brain, 
  Heart, 
  Sparkles, 
  Lightbulb, 
  Smile, 
  Target, 
  Compass, 
  Gamepad2, 
  Trophy, 
  MessageSquare, 
  Clock, 
  Layers, 
  TrendingUp, 
  Megaphone, 
  BookOpen,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl max-w-lg mx-auto mt-20 shadow-sm">
          <h2 className="text-xl font-bold text-rose-700 mb-2">Đã xảy ra lỗi hiển thị Góc Phụ Huynh</h2>
          <p className="text-sm text-slate-600 mb-4 font-mono bg-white p-3 rounded-lg border border-slate-100 text-left overflow-x-auto">{this.state.error?.message}</p>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }} 
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold shadow hover:bg-rose-700 transition-all"
          >
            Đặt lại dữ liệu & Quay lại trang chủ
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ParentsPage() {
  return (
    <ErrorBoundary>
      <ParentsDashboardContent />
    </ErrorBoundary>
  );
}

function ParentsDashboardContent() {
  const { progress, isLoaded } = useProgress();
  const { playSound } = useSound();
  const { studentInfo, setIsOpenConfig } = useStudent();
  const { subjects, isLoading: isSubjectsLoading } = useSubjects();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analyzer' | 'psychology'>('dashboard');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    if (!isLoaded || isSubjectsLoading) return null;

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
  }, [progress, isLoaded, subjects]);

  if (!mounted || !isLoaded || isSubjectsLoading) {
    return <div className="p-8 text-center font-bold text-slate-500 text-sm">Đang tải dữ liệu học tập...</div>;
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
              <ArrowLeft className="w-6 h-6" />
            </Link>
            
            {/* Train & Journey Title */}
            <div className="flex items-center gap-3 text-center sm:text-left">
              <Brain className="w-8 h-8 text-[var(--color-primary)] animate-pulse" />
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-wider text-[var(--color-foreground)] uppercase">
                  HÀNH TRÌNH NĂM HỌC CỦA CON
                </h1>
                {studentInfo ? (
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1 text-sm text-[var(--color-foreground)] opacity-90">
                    <span className="bg-[var(--color-background)] px-2 py-0.5 rounded-lg border border-[var(--color-foreground)] font-bold text-sm">
                      Con: <strong>{studentInfo.name || studentInfo.nickname}</strong>
                    </span>
                    <span className="bg-[var(--color-background)] px-2 py-0.5 rounded-lg border border-[var(--color-foreground)] font-bold text-sm">
                      Lớp: <strong>{studentInfo.grade}</strong>
                    </span>
                    <span className="bg-[var(--color-background)] px-2 py-0.5 rounded-lg border border-[var(--color-foreground)] font-bold text-sm">
                      Năm học: <strong>2025 - 2026</strong>
                    </span>
                    <button
                      onClick={() => {
                        playSound('click');
                        setIsOpenConfig(true);
                      }}
                      className="text-sm text-[var(--color-primary-depth)] hover:underline font-black ml-1 flex items-center gap-0.5 cursor-pointer"
                    >
                      {studentInfo.avatar} Đổi
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-semibold opacity-75">Theo dõi hành trình học tập đầy niềm vui của bé</p>
                )}
              </div>
            </div>
          </div>

          {/* Trạng thái đồng bộ đám mây */}
          <div className="flex items-center gap-3">
            <SyncStatusIndicator />
          </div>

          {/* Tab Selector Buttons - Brutalist design */}
          <div className="flex flex-wrap md:flex-nowrap bg-[var(--color-background)] p-1.5 rounded-[20px] border-3 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)] w-full md:w-auto shrink-0 gap-1 md:gap-0">
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('dashboard');
              }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-black transition-all cursor-pointer ${
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
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-black transition-all cursor-pointer ${
                activeTab === 'analyzer'
                  ? 'bg-[var(--color-primary)] text-white border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)] translate-y-[-2px]'
                  : 'text-[var(--color-foreground)] opacity-70 hover:opacity-100'
              }`}
            >
              <span>Phân Tích Học Bạ</span>
              <span className="bg-[var(--color-accent)] text-[var(--color-foreground)] border border-[var(--color-foreground)] text-sm font-extrabold px-1.5 py-0.5 rounded-full uppercase animate-pulse">Mới</span>
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('psychology');
              }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-black transition-all cursor-pointer ${
                activeTab === 'psychology'
                  ? 'bg-[var(--color-primary)] text-white border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)] translate-y-[-2px]'
                  : 'text-[var(--color-foreground)] opacity-70 hover:opacity-100'
              }`}
            >
              <Brain className="w-5 h-5" />
              <span>Cẩm Nang Tâm Lý</span>
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
                      <div className="text-sm text-[var(--color-foreground)] opacity-70 font-bold uppercase tracking-wider">Tiến độ tổng thể</div>
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
                      <div className="text-sm text-[var(--color-foreground)] opacity-70 font-bold uppercase tracking-wider">Điểm trung bình</div>
                      <div className="text-3xl font-black text-[var(--color-foreground)]">{stats.averageScore}/100</div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-foreground)] opacity-50 mt-4">Tính trên các bài luyện tập đã hoàn thành</p>
                </div>
 
                {/* 3. Last Activity */}
                <div className="bg-[var(--color-surface)] p-6 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--color-foreground)] flex flex-col justify-between transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[var(--color-secondary)] text-[var(--color-foreground)] rounded-2xl border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                      <IoTime className="text-2xl" />
                    </div>
                    <div>
                      <div className="text-sm text-[var(--color-foreground)] opacity-70 font-bold uppercase tracking-wider">Hoạt động gần nhất</div>
                      <div className="text-xl font-black text-[var(--color-foreground)]">
                        {stats.recentActivities.length > 0
                          ? new Date(stats.recentActivities[0].timestamp).toLocaleDateString('vi-VN')
                          : 'Chưa có'}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-black text-[var(--color-secondary-depth)] truncate mt-4">
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
                    <TrendingUp className="w-6 h-6 text-[var(--color-primary-depth)]" />
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
                    <Sparkles className="w-6 h-6 text-[var(--color-accent)] animate-pulse" />
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
                            <div className="text-sm text-[var(--color-foreground)] opacity-70 font-bold uppercase tracking-wider mt-0.5">{activity.subjectName}</div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1">
                            <span className="bg-[var(--color-surface)] border-2 border-[var(--color-foreground)] px-2.5 py-0.5 rounded-xl text-sm font-black shadow-[1px_1px_0px_0px_var(--color-foreground)]">
                              {activity.score} điểm
                            </span>
                            <div className="text-sm text-[var(--color-foreground)] opacity-60 font-semibold">
                              {new Date(activity.timestamp).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400 flex flex-col items-center justify-center">
                      <IoWarning className="text-5xl mb-3 opacity-30 text-[var(--color-primary)]" />
                      <p className="font-bold text-[var(--color-foreground)]">Bé con chưa có hoạt động học tập nào</p>
                      <p className="text-sm text-[var(--color-foreground)] opacity-75 mt-1 max-w-xs">Ba mẹ ơi, hãy để bé trải nghiệm thử một trò chơi gõ phím ở trang chủ trước nha!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Banner */}
              <div className="bg-[var(--color-surface-container)] border-4 border-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--color-foreground)] p-6 rounded-[24px] text-center relative overflow-hidden transition-colors">
                <Lightbulb className="absolute top-1/2 left-6 -translate-y-1/2 w-10 h-10 opacity-20 pointer-events-none text-[var(--color-foreground)]" />
                <Sparkles className="absolute top-1/2 right-6 -translate-y-1/2 w-10 h-10 opacity-20 pointer-events-none text-[var(--color-foreground)]" />
                <h3 className="font-black text-[var(--color-foreground)] mb-1.5 text-lg">
                  Đồng hành cùng {studentInfo ? studentInfo.nickname : 'con yêu'}
                </h3>
                <p className="text-[var(--color-foreground)] opacity-95 text-sm max-w-xl mx-auto font-semibold leading-relaxed">
                  Ba mẹ ơi, hãy thử chuyển sang tab <span className="underline font-black text-[var(--color-primary-depth)] cursor-pointer" onClick={() => setActiveTab('analyzer')}>Phân Tích Học Bạ</span> ở trên để dán nhận xét của cô giáo ở lớp nha. Hệ thống sẽ tự động đề xuất một lộ trình cải thiện kỹ năng phù hợp nhất cho bé yêu nhà mình nè!
                </p>
              </div>
            </motion.div>
          ) : activeTab === 'analyzer' ? (
            <motion.div
              key="analyzer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ReportCardAnalyzer />
            </motion.div>
          ) : (
            <motion.div
              key="psychology"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Nội dung Cẩm nang tâm lý trẻ em */}
              <div className="flex flex-col md:flex-row items-center gap-6 bg-[var(--color-surface)] p-6 md:p-8 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[6px_6px_0px_0px_var(--color-foreground)] transition-colors">
                <img 
                  src="/assets/thumbnails/parents_thumbnail.png" 
                  alt="Đồng hành cùng bé" 
                  className="w-full md:w-56 h-auto object-contain rounded-2xl border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)] bg-white shrink-0" 
                />
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-[var(--color-foreground)] mb-3 flex items-center gap-2">
                    <span>Bí Kíp Đồng Hành & Thấu Hiểu Bé Yêu Lớp 1</span>
                    <Sparkles className="w-6 h-6 text-[var(--color-accent)] animate-spin" style={{ animationDuration: '8s' }} />
                  </h2>
                  <p className="text-[var(--color-foreground)] opacity-90 text-sm md:text-base font-semibold leading-relaxed max-w-2xl">
                    Ba mẹ ơi! Bé con 6 tuổi bước vào Lớp 1 là một cột mốc siêu lớn của cả nhà mình đúng không ạ? Ở độ tuổi này, con đang có những bước chuyển mình rất lớn về cả nhận thức lẫn cảm xúc. Để cùng con đi qua năm học thật nhiều niềm vui và nuôi dưỡng sự tự tin bền vững cho bé, VietTyping đã tổng hợp những mẹo nhỏ cực kỳ khoa học từ tâm lý học trẻ em giúp ba mẹ đồng hành cùng con thật nhẹ nhàng nha!
                  </p>
                </div>
              </div>

              {/* 3 Trụ cột Tâm lý học */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Trụ cột 1: Thuyết Tự Quyết (SDT) */}
                <div className="bg-[var(--color-surface)] p-6 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--color-foreground)] flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)] mb-4">
                      <Target className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-black text-[var(--color-foreground)] mb-2 uppercase tracking-wide">
                      Để con tự giác học tập tự nhiên
                    </h3>
                    <p className="text-sm font-semibold text-slate-600 leading-relaxed mb-4">
                      Bé con sẽ mê học nhất khi con cảm thấy tự nguyện và thích thú từ bên trong, chứ không phải vì bị ép buộc hay để nhận quà ba mẹ nhé.
                    </p>
                    <ul className="space-y-3 text-sm font-bold text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <Gamepad2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <span><strong>Tôn trọng sự tự chủ:</strong> Hãy để con tự chọn bài học và thay đổi hình đại diện (avatar) hoạt hình dễ thương theo ý thích. Khi được tự quyết, con sẽ có trách nhiệm hơn hẳn đó!</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <span><strong>Khích lệ sự tự tin:</strong> Khen ngợi mỗi lần con gõ nhanh hơn một chút, đạt thêm XP hoặc Huy hiệu. Những bước tiến nhỏ xíu chính là động lực lớn của con.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Heart className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <span><strong>Nuôi dưỡng sự gắn kết:</strong> Ngồi cùng con, chơi game gõ chữ chung. Sự hiện diện ấm áp của ba mẹ chính là điểm tựa tinh thần tốt nhất cho con.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Trụ cột 2: Tư duy phát triển */}
                <div className="bg-[var(--color-surface)] p-6 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--color-foreground)] flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)] mb-4">
                      <Heart className="w-6 h-6 text-rose-600" />
                    </div>
                    <h3 className="text-lg font-black text-[var(--color-foreground)] mb-2 uppercase tracking-wide">
                      Gieo mầm tư duy phát triển
                    </h3>
                    <p className="text-sm font-semibold text-slate-600 leading-relaxed mb-4">
                      Mỗi lời khen, tiếng động viên của ba mẹ hôm nay sẽ định hình cách con đối mặt với những thử thách trong tương lai.
                    </p>
                    <ul className="space-y-3 text-sm font-bold text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <MessageSquare className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <span><strong>Khen nỗ lực thay vì khen thông minh:</strong> Thay vì nói &quot;Con giỏi quá/thông minh quá&quot;, ba mẹ hãy khen cụ thể quá trình: &quot;Mẹ thấy hôm nay con rất kiên trì gõ hết các từ tiếng Anh dài nha!&quot;</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Layers className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <span><strong>Yêu thương những lỗi sai:</strong> Khi con gõ sai hay chọn nhầm, ba mẹ đừng sốt ruột nhé. Hãy mỉm cười nhẹ nhàng: &quot;Không sao đâu con yêu, gõ sai là để bộ não mình học cách sửa và thông minh hơn đó!&quot;</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Sparkles className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <span><strong>Không so sánh con:</strong> Mỗi bé là một bông hoa có thời gian nở khác nhau. Hãy chỉ so sánh con với chính con của ngày hôm qua để tiếp thêm tự tin cho bé.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Trụ cột 3: Giai đoạn Piaget */}
                <div className="bg-[var(--color-surface)] p-6 rounded-[24px] border-4 border-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--color-foreground)] flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)] mb-4">
                      <Compass className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-black text-[var(--color-foreground)] mb-2 uppercase tracking-wide">
                      Thấu hiểu cách bé tư duy trực quan
                    </h3>
                    <p className="text-sm font-semibold text-slate-600 leading-relaxed mb-4">
                      Lên 6 tuổi, tư duy của con vẫn rất trực quan, bé chưa thể hiểu những lý thuyết khô khan mà cần học qua hình ảnh và trải nghiệm thực tế.
                    </p>
                    <ul className="space-y-3 text-sm font-bold text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <Megaphone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Học bằng mọi giác quan:</strong> Hãy để bé gõ phím kết hợp nghe âm thanh ASMR vui tai, chơi game kéo thả rực rỡ và nhìn bong bóng Telex gợi ý động.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <BookOpen className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Biến học hành thành trò chơi:</strong> Tích hợp bài học Toán, Tiếng Việt vào mini-game gõ chữ giúp bé ôn tập tự nhiên, nhẹ nhàng mà cực kỳ hiệu quả.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Clock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span><strong>Không bắt con ngồi lâu:</strong> Bé 6 tuổi chỉ có thể tập trung tối đa 10-15 phút. Hãy cho con nghỉ ngơi, vận động nhẹ tay chân giữa các bài học nha ba mẹ.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Lời khuyên vàng cho Phụ huynh */}
              <div className="bg-[var(--color-surface-container)] border-4 border-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--color-foreground)] p-6 md:p-8 rounded-[24px] relative overflow-hidden transition-colors">
                <h3 className="text-xl font-black text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-amber-500 animate-pulse" />
                  <span>3 chiếc &quot;Bí kíp vàng&quot; đồng hành cùng con yêu</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-bold text-[var(--color-foreground)]">
                  <div className="p-4 bg-[var(--color-background)] border-2 border-[var(--color-foreground)] rounded-xl shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                    <span className="text-xl mb-2 block">1. 15 phút chất lượng mỗi ngày</span>
                    <p className="text-sm text-slate-600 font-semibold leading-relaxed mt-1">
                      Mỗi ngày ba mẹ chỉ cần dành 10-15 phút đồng hành cùng con học tập là đủ rồi nè. Quan trọng là sự đều đặn và không khí vui vẻ, thoải mái nha!
                    </p>
                  </div>
                  <div className="p-4 bg-[var(--color-background)] border-2 border-[var(--color-foreground)] rounded-xl shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                    <span className="text-xl mb-2 block">2. Để con tự mò mẫm, không gõ hộ</span>
                    <p className="text-sm text-slate-600 font-semibold leading-relaxed mt-1">
                      Hãy kiên nhẫn để con tự khám phá bàn phím. Ba mẹ chỉ là người hướng dẫn, cổ vũ bên cạnh thôi nhé, đừng sốt ruột mà gõ hộ con nha.
                    </p>
                  </div>
                  <div className="p-4 bg-[var(--color-background)] border-2 border-[var(--color-foreground)] rounded-xl shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                    <span className="text-xl mb-2 block">3. Trò chuyện về cảm xúc sau khi học</span>
                    <p className="text-sm text-slate-600 font-semibold leading-relaxed mt-1">
                      Sau mỗi buổi học, ba mẹ hãy hỏi con hôm nay chơi game nào vui nhất. Cảm xúc tích cực và sự quan tâm từ ba mẹ giúp con ghi nhớ bài lâu cực kỳ luôn.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

