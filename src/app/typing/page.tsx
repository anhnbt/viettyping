'use client';

import React, { useState, useEffect } from 'react';
import { lessons, Lesson } from '@/data/lessons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSound } from '@/contexts/SoundContext';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, BookOpen, Keyboard, Sparkles } from 'lucide-react';
import VisualWorldBackground from '@/components/VisualWorldBackground';
import { TactileStarBadge } from '@/components/BadgeElements';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800']
});

const BUBBLES_CONFIG = [
  { width: 30, height: 30, left: '10%', duration: 18, delay: 1, xRange: [0, 20, -20, 0] },
  { width: 52, height: 52, left: '26%', duration: 15, delay: 3, xRange: [0, -25, 25, 0] },
  { width: 25, height: 25, left: '44%', duration: 22, delay: 0, xRange: [0, 15, -15, 0] },
  { width: 44, height: 44, left: '60%', duration: 17, delay: 4, xRange: [0, -20, 20, 0] },
  { width: 35, height: 35, left: '76%', duration: 20, delay: 2, xRange: [0, 25, -25, 0] },
  { width: 48, height: 48, left: '88%', duration: 16, delay: 5, xRange: [0, -15, 15, 0] },
];

const levelNames: Record<string, { name: string; description: string; color: string; icon: string; bgClass: string; borderClass: string; accentColor: string }> = {
  basic: {
    name: 'Đảo Học Việc 🐢',
    description: 'Làm quen các hàng phím cơ bản và dấu tiếng Việt',
    color: 'from-emerald-400 to-teal-500',
    icon: '🐢',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200',
    accentColor: '#10b981',
  },
  intermediate: {
    name: 'Đảo Tăng Tốc 🦁',
    description: 'Thực hành gõ từ ghép vui nhộn và câu văn ngắn',
    color: 'from-amber-400 to-orange-500',
    icon: '🦁',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200',
    accentColor: '#f59e0b',
  },
  advanced: {
    name: 'Đảo Siêu Nhân 🚀',
    description: 'Chinh phục đoạn văn dài để trở thành Siêu Nhân Gõ Phím',
    color: 'from-fuchsia-400 to-purple-500',
    icon: '🚀',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200',
    accentColor: '#d946ef',
  }
};

export default function TypingPage() {
  const router = useRouter();
  const { playSound } = useSound();
  
  // States cho gamification
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [hoveredLessonId, setHoveredLessonId] = useState<string | null>(null);

  // Đọc dữ liệu từ localStorage sau khi component mount (để tránh lỗi hydration Next.js)
  useEffect(() => {
    try {
      const completed = JSON.parse(localStorage.getItem('typing_completed_lessons') || '[]');
      const savedXp = parseInt(localStorage.getItem('typing_xp') || '0', 10);
      const savedStreak = parseInt(localStorage.getItem('typing_streak') || '0', 10);
      
      setCompletedLessons(completed);
      setXp(savedXp);
      setStreak(savedStreak);
    } catch (e) {
      console.error('Failed to load typing progress:', e);
    }
  }, []);

  const getLessonsForLevel = (level: string) => {
    return lessons.filter(lesson => lesson.level === level);
  };

  const handleResetProgress = () => {
    if (confirm('Bố mẹ có muốn xóa hết tiến trình của bé để bé học lại từ đầu không?')) {
      try {
        localStorage.removeItem('typing_completed_lessons');
        localStorage.setItem('typing_xp', '0');
        localStorage.setItem('typing_streak', '0');
        
        setCompletedLessons([]);
        setXp(0);
        setStreak(0);
        playSound('tada');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Xác định bài học tiếp theo (bài đầu tiên chưa hoàn thành)
  const getNextLessonId = () => {
    const allLevels = ['basic', 'intermediate', 'advanced'];
    for (const lvl of allLevels) {
      const lvlLessons = getLessonsForLevel(lvl);
      for (const les of lvlLessons) {
        if (!completedLessons.includes(les.id)) {
          return les.id;
        }
      }
    }
    return lessons[0]?.id; // Mặc định là bài đầu tiên nếu đã hoàn thành hết
  };

  const nextLessonId = getNextLessonId();

  // Tính phần trăm tiến trình tổng thể
  const totalLessonsCount = lessons.length;
  const completedCount = completedLessons.length;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

  const handleLessonClick = (lesson: Lesson) => {
    playSound('click');
    router.push(`/typing/${lesson.id}`);
  };

  return (
    <VisualWorldBackground>
    <main className={`min-h-screen relative overflow-hidden pb-16 z-10 ${plusJakartaSans.className}`}>

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Thanh Điều hướng Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 w-full">
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start z-20">
            <Link
              href="/lesson"
              onClick={() => playSound('click')}
              className="tactile-btn bg-[var(--color-surface)] border-3 border-[var(--color-foreground)] shadow-[3px_3px_0px_0px_var(--color-foreground)] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-none text-[var(--color-foreground)] font-black text-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-[var(--color-primary-depth)] animate-bounce" />
              <span>📚 Bài học của bé</span>
            </Link>
            <button
              disabled
              className="tactile-btn bg-[var(--color-secondary-container)] border-3 border-[var(--color-foreground)] shadow-[3px_3px_0px_0px_var(--color-foreground)] text-[var(--color-on-secondary-container)] font-black text-sm cursor-default opacity-90"
            >
              <Keyboard className="w-4 h-4" />
              <span>⌨️ Luyện gõ phím</span>
            </button>
            <Link
              href="/typing/asmr"
              onClick={() => playSound('click')}
              className="tactile-btn bg-[var(--color-tertiary)] border-3 border-[var(--color-foreground)] shadow-[3px_3px_0px_0px_var(--color-foreground)] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-none text-white font-black text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 animate-pulse text-yellow-200" />
              <span>✨ ASMR Thư giãn</span>
            </Link>
          </div>

          <div className="bg-[var(--color-surface-container)] border-4 border-[var(--color-foreground)] px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_var(--color-foreground)] text-center lg:text-right min-w-[280px]">
            <h1 className={`text-2xl md:text-3xl font-black text-[var(--color-foreground)] tracking-wide ${plusJakartaSans.className}`}>
              ⌨️ Đảo Gõ Phím Kỳ Thú
            </h1>
          </div>
        </div>
 
        {/* Dashboard Thành Tích Sinh Động */}
        <div className="bg-[var(--color-surface)] rounded-[24px] p-6 mb-8 border-3 border-[var(--color-foreground)] shadow-[6px_6px_0px_0px_var(--color-foreground)] flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 w-full md:w-auto">
            {/* Card XP */}
            <TactileStarBadge color="yellow" value={`${xp} XP`} className="scale-110" />
 
            {/* Card Streak */}
            <TactileStarBadge color="orange" value={`${streak} ngày`} className="scale-110" />

            {/* Card Progress */}
            <div className="flex flex-col bg-[var(--color-surface-container)] border-2 border-[var(--color-foreground)] px-5 py-3 rounded-2xl shadow-[3px_3px_0px_0px_var(--color-outline-variant)] min-w-[200px] transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-sky-700 font-bold uppercase tracking-wider">Tiến trình</span>
                <span className="text-sm font-black text-sky-600">{completedCount}/{totalLessonsCount} bài</span>
              </div>
              <div className="w-full bg-sky-200 h-4 rounded-full overflow-hidden border border-sky-300">
                <motion.div 
                  className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleResetProgress}
            className="tactile-btn tactile-btn-gray py-2.5 px-4 text-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Làm lại từ đầu
          </button>
        </div>

        {/* Bộ chọn hòn đảo (Tab Selector) */}
        <div className="grid grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto bg-[var(--color-surface-container)] p-2 rounded-3xl border-3 border-[var(--color-foreground)] shadow-[4px_4px_0px_0px_var(--color-foreground)] transition-colors">
          {(['basic', 'intermediate', 'advanced'] as const).map((tab) => {
            const isSelected = activeTab === tab;
            const tabInfo = levelNames[tab];
            
            return (
              <button
                key={tab}
                onClick={() => {
                  playSound('click');
                  setActiveTab(tab);
                }}
                className={`relative px-4 py-4 rounded-2xl font-black text-sm md:text-base flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isSelected 
                    ? `bg-gradient-to-r ${tabInfo.color} text-white border-2 border-[var(--color-foreground)] shadow-[3px_3px_0px_0px_var(--color-foreground)] scale-105` 
                    : 'text-[var(--color-foreground)] opacity-75 hover:opacity-100 hover:bg-[var(--color-background)]/60'
                }`}
              >
                <span className="text-xl md:text-2xl">{tabInfo.icon}</span>
                <span className={plusJakartaSans.className}>{tab === 'basic' ? 'Cơ bản' : tab === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}</span>
              </button>
            );
          })}
        </div>

        {/* Nội dung Hòn đảo đã chọn */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className={`rounded-3xl p-6 md:p-8 border-3 border-[var(--color-foreground)] shadow-[6px_6px_0px_0px_var(--color-foreground)] ${levelNames[activeTab].bgClass} ${levelNames[activeTab].borderClass} transition-all`}
          >
            {/* Banner Đảo */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 text-center sm:text-left border-b-2 border-dashed border-gray-200/60 pb-6">
              <span className="text-5xl md:text-6xl p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                {levelNames[activeTab].icon}
              </span>
              <div>
                <h2 className={`text-2xl md:text-3xl font-black text-gray-800 ${plusJakartaSans.className}`}>
                  {levelNames[activeTab].name}
                </h2>
                <p className="text-gray-600 text-sm md:text-base mt-1">
                  {levelNames[activeTab].description}
                </p>
              </div>
            </div>

            {/* Grid các bài học */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {getLessonsForLevel(activeTab).map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isNext = lesson.id === nextLessonId;
                const isLocked = !isCompleted && !isNext && completedLessons.length < lessons.findIndex(l => l.id === lesson.id);

                let btnBgClass = 'bg-[var(--color-surface-container)] text-slate-450 border-3 border-[var(--color-outline-variant)] shadow-[0_5px_0_0_var(--color-outline-variant)]';
                
                if (isCompleted) {
                  btnBgClass = 'bg-[var(--color-primary)] text-white border-3 border-slate-900 shadow-[0_5px_0_0_#0f172a] hover:brightness-105 active:shadow-none active:translate-y-[5px]';
                } else if (isNext) {
                  btnBgClass = 'bg-[var(--color-accent)] text-slate-900 border-3 border-slate-900 shadow-[0_5px_0_0_#0f172a] hover:brightness-105 active:shadow-none active:translate-y-[5px] ring-4 ring-[var(--color-accent)]/60 ring-offset-2 animate-pulse';
                } else if (!isLocked) {
                  btnBgClass = 'bg-[var(--color-tertiary)] text-white border-3 border-slate-900 shadow-[0_5px_0_0_#0f172a] hover:brightness-105 active:shadow-none active:translate-y-[5px]';
                }

                return (
                  <div key={lesson.id} className="relative flex flex-col items-center">
                    {/* Nút bài học 3D Chunky */}
                    <button
                      onClick={() => !isLocked && handleLessonClick(lesson)}
                      onMouseEnter={() => {
                        setHoveredLessonId(lesson.id);
                        if (!isLocked) playSound('click');
                      }}
                      onMouseLeave={() => setHoveredLessonId(null)}
                      disabled={isLocked}
                      className={`w-20 h-20 rounded-[24px] border-b-4 flex items-center justify-center text-3xl font-black font-sans transition-all relative z-10 cursor-pointer ${btnBgClass} ${
                        isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                      }`}
                    >
                      {isCompleted ? (
                        <div className="relative">
                          <span>{index + 1}</span>
                          <span className="absolute -bottom-1.5 -right-1.5 bg-white text-emerald-500 rounded-full p-0.5 border border-emerald-400 text-xs shadow-sm">
                            <Check className="w-3 h-3 stroke-[4px]" />
                          </span>
                        </div>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </button>

                    {/* Tiêu đề ngắn gọn bên dưới nút */}
                    <span className="text-xs font-bold text-gray-700 mt-3 text-center line-clamp-1 max-w-[110px]">
                      {lesson.title.replace('Luyện gõ ', '')}
                    </span>

                    {/* Tooltip thông tin học tập */}
                    <AnimatePresence>
                      {hoveredLessonId === lesson.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-full mb-3 z-50 bg-slate-800 text-white p-3 rounded-2xl shadow-xl w-48 text-center text-xs pointer-events-none"
                        >
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1.5 border-4 border-transparent border-t-slate-800" />
                          <h4 className="font-bold text-amber-300 text-sm mb-1">{lesson.title}</h4>
                          <p className="text-slate-300 mb-2">{lesson.description}</p>
                          <div className="flex justify-around bg-slate-700/60 p-1.5 rounded-lg border border-slate-700">
                            <div>
                              <div className="text-slate-400">Tốc độ</div>
                              <div className="font-bold text-emerald-400">🎯 {lesson.targetWPM} WPM</div>
                            </div>
                            <div className="w-[1px] bg-slate-700" />
                            <div>
                              <div className="text-slate-400">Độ chuẩn</div>
                              <div className="font-bold text-sky-400">⭐ {lesson.minAccuracy}%</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Hướng dẫn Đặt Ngón Tay & Luyện tập */}
        <div className="bg-[var(--color-surface)] rounded-3xl p-6 mt-8 border-3 border-[var(--color-foreground)] shadow-[6px_6px_0px_0px_var(--color-foreground)] flex flex-col md:flex-row items-center gap-6 transition-colors">
          <div className="p-4 bg-indigo-50 rounded-2xl text-4xl shrink-0">
            💡
          </div>
          <div>
            <h3 className={`text-lg md:text-xl font-bold text-indigo-900 ${plusJakartaSans.className}`}>
              Bí kíp gõ phím của Siêu Nhân Nhí!
            </h3>
            <p className="text-gray-600 text-sm md:text-base mt-1 leading-relaxed">
              Bé hãy nhớ đặt hai ngón trỏ lên các phím có gờ nổi là <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">F</span> và <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">J</span> nhé! Ngón cái thì dùng để nhấn phím Cách nha. Cố lên bé yêu!
            </p>
          </div>
        </div>
      </div>
    </main>
    </VisualWorldBackground>
  );
}
