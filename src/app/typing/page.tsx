'use client';

import React, { useState, useEffect } from 'react';
import { lessons, Lesson } from '@/data/lessons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSound } from '@/contexts/SoundContext';
import { Be_Vietnam_Pro } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, BookOpen, Keyboard } from 'lucide-react';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900']
});

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
    <main className={`min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden pb-16 ${beVietnamPro.className}`}>
      
      {/* Các đám mây trôi tự động */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          className="absolute top-12 left-0 w-36 h-12 bg-white/60 rounded-full blur-[1px]"
          animate={{ x: ['-200px', '100vw'] }}
          transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
        />
        <motion.div 
          className="absolute top-48 right-0 w-48 h-16 bg-white/50 rounded-full blur-[1px]"
          animate={{ x: ['100vw', '-300px'] }}
          transition={{ repeat: Infinity, duration: 55, ease: 'linear' }}
        />
        <motion.div 
          className="absolute top-1/3 left-10 w-28 h-10 bg-white/40 rounded-full"
          animate={{ x: ['-150px', '100vw'] }}
          transition={{ repeat: Infinity, duration: 32, ease: 'linear' }}
        />
      </div>

      {/* Bong bóng nổi nhẹ nhàng tạo hiệu ứng hoạt hình */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20 border border-white/30"
            style={{
              width: Math.random() * 40 + 20,
              height: Math.random() * 40 + 20,
              left: `${Math.random() * 90 + 5}%`,
              bottom: '-50px',
            }}
            animate={{
              y: [0, -1000],
              x: [0, Math.random() * 40 - 20, Math.random() * 40 - 20, 0],
              opacity: [0, 0.7, 0.7, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Thanh Điều hướng Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-4">
            <Link
              href="/"
              onClick={() => playSound('click')}
              className="flex items-center gap-2 px-6 py-3.5 bg-white text-indigo-600 rounded-[22px] font-bold border-2 border-indigo-200 shadow-[4px_4px_0px_0px_#c7d2fe] transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <BookOpen className="w-5 h-5 text-indigo-500 animate-bounce" />
              <span>📚 Học các môn</span>
            </Link>
            <button
              disabled
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-[22px] font-bold border-b-4 border-red-600 shadow-[4px_4px_0px_0px_#fca5a5] cursor-default"
            >
              <Keyboard className="w-5 h-5" />
              <span>⌨️ Luyện gõ phím</span>
            </button>
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold text-center text-indigo-800 tracking-wide drop-shadow-sm ${beVietnamPro.className}`}>
            ⌨️ Đảo Gõ Phím Kỳ Thú
          </h1>
        </div>

        {/* Dashboard Thành Tích Sinh Động */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 mb-8 border-2 border-white/40 shadow-[6px_6px_0px_0px_#cbd5e1] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 w-full md:w-auto">
            {/* Card XP */}
            <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-200 px-5 py-3 rounded-2xl shadow-[3px_3px_0px_0px_#fde68a]">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="text-3xl"
              >
                🏆
              </motion.div>
              <div>
                <div className="text-xs text-amber-700 font-bold uppercase tracking-wider">Điểm XP</div>
                <div className={`text-2xl font-black text-amber-500 ${beVietnamPro.className}`}>{xp} XP</div>
              </div>
            </div>

            {/* Card Streak */}
            <div className="flex items-center gap-3 bg-orange-50 border-2 border-orange-200 px-5 py-3 rounded-2xl shadow-[3px_3px_0px_0px_#fed7aa]">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="text-3xl"
              >
                🔥
              </motion.div>
              <div>
                <div className="text-xs text-orange-700 font-bold uppercase tracking-wider">Chuỗi Gõ</div>
                <div className={`text-2xl font-black text-orange-500 ${beVietnamPro.className}`}>{streak} ngày</div>
              </div>
            </div>

            {/* Card Progress */}
            <div className="flex flex-col bg-sky-50 border-2 border-sky-200 px-5 py-3 rounded-2xl shadow-[3px_3px_0px_0px_#bae6fd] min-w-[200px]">
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
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100/80 hover:bg-gray-200 hover:text-red-500 rounded-xl transition-all border border-gray-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Làm lại từ đầu
          </button>
        </div>

        {/* Bộ chọn hòn đảo (Tab Selector) */}
        <div className="grid grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto bg-gray-200/50 backdrop-blur-sm p-2 rounded-3xl border border-gray-100">
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
                    ? `bg-gradient-to-r ${tabInfo.color} text-white shadow-[0_4px_0_0_rgba(0,0,0,0.15)] scale-105` 
                    : 'text-gray-600 hover:bg-white/40'
                }`}
              >
                <span className="text-xl md:text-2xl">{tabInfo.icon}</span>
                <span className={beVietnamPro.className}>{tab === 'basic' ? 'Cơ bản' : tab === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}</span>
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
            className={`rounded-3xl p-6 md:p-8 border-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] ${levelNames[activeTab].bgClass} ${levelNames[activeTab].borderClass}`}
          >
            {/* Banner Đảo */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 text-center sm:text-left border-b-2 border-dashed border-gray-200/60 pb-6">
              <span className="text-5xl md:text-6xl p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                {levelNames[activeTab].icon}
              </span>
              <div>
                <h2 className={`text-2xl md:text-3xl font-black text-gray-800 ${beVietnamPro.className}`}>
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

                let btnBgClass = 'bg-gray-100 text-gray-400 border-gray-300 shadow-[0_5px_0_0_#d1d5db]';
                
                if (isCompleted) {
                  btnBgClass = 'bg-emerald-400 text-white border-emerald-500 shadow-[0_5px_0_0_#10b981] hover:brightness-105 active:shadow-none active:translate-y-[5px]';
                } else if (isNext) {
                  btnBgClass = 'bg-amber-400 text-amber-950 border-amber-500 shadow-[0_5px_0_0_#d97706] hover:brightness-105 active:shadow-none active:translate-y-[5px] ring-4 ring-amber-300/60 ring-offset-2 animate-pulse';
                } else if (!isLocked) {
                  btnBgClass = 'bg-sky-400 text-white border-sky-500 shadow-[0_5px_0_0_#0284c7] hover:brightness-105 active:shadow-none active:translate-y-[5px]';
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
        <div className="bg-white/90 rounded-3xl p-6 mt-8 border-2 border-indigo-100 shadow-[6px_6px_0px_0px_#e0e7ff] flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-indigo-50 rounded-2xl text-4xl shrink-0">
            💡
          </div>
          <div>
            <h3 className={`text-lg md:text-xl font-bold text-indigo-900 ${beVietnamPro.className}`}>
              Bí kíp gõ phím của Siêu Nhân Nhí!
            </h3>
            <p className="text-gray-600 text-sm md:text-base mt-1 leading-relaxed">
              Bé hãy nhớ đặt hai ngón trỏ lên các phím có gờ nổi là <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">F</span> và <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">J</span> nhé! Ngón cái thì dùng để nhấn phím Cách nha. Cố lên bé yêu!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
