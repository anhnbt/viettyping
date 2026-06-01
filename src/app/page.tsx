'use client';

import React, { useState, useEffect } from 'react';
import { subjects } from '@/data/subjects';
import SubjectSelector from '@/components/SubjectSelector';
import HeroSlideBanner from '@/components/HeroSlideBanner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSound } from '@/contexts/SoundContext';
import { useStudent } from '@/contexts/StudentContext';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Flame, Keyboard, GraduationCap, ArrowRight, Smile } from 'lucide-react';
import { Be_Vietnam_Pro } from 'next/font/google';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900']
});

const titles = [
  'Học Tập Kỳ Thú Cho Bé 🌟',
  'Luyện Gõ Phím Cực Vui! ⌨️',
  'Khám Phá Tri Thức Mới 📚',
  'Trở Thành Siêu Nhân Gõ Phím! ⚡'
];

const BUBBLES_CONFIG = [
  { width: 32, height: 32, left: '8%', duration: 22, delay: 1, xRange: [0, 25, -25, 0] },
  { width: 50, height: 50, left: '23%', duration: 18, delay: 4, xRange: [0, -30, 30, 0] },
  { width: 24, height: 24, left: '38%', duration: 26, delay: 0, xRange: [0, 15, -15, 0] },
  { width: 56, height: 56, left: '52%', duration: 20, delay: 5, xRange: [0, -20, 20, 0] },
  { width: 36, height: 36, left: '67%', duration: 24, delay: 2, xRange: [0, 25, -25, 0] },
  { width: 48, height: 48, left: '81%', duration: 19, delay: 6, xRange: [0, -15, 15, 0] },
  { width: 28, height: 28, left: '92%', duration: 28, delay: 3, xRange: [0, 10, -10, 0] },
  { width: 42, height: 42, left: '16%', duration: 21, delay: 7, xRange: [0, -20, 20, 0] },
];

export default function Home() {
  const router = useRouter();
  const { playSound } = useSound();
  const { studentInfo, setIsOpenConfig } = useStudent();
  
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [typedText, setTypedText] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [isMounted, setIsMounted] = useState(false);


  // Đọc dữ liệu gamification từ localStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedXp = parseInt(localStorage.getItem('typing_xp') || '0', 10);
      const savedStreak = parseInt(localStorage.getItem('typing_streak') || '0', 10);
      setXp(savedXp);
      setStreak(savedStreak);
    } catch (e) {
      console.error('Failed to load learning progress:', e);
    }
  }, []);

  // Xử lý hiệu ứng chữ chạy tự động thay đổi
  useEffect(() => {
    const currentFullText = titles[titleIndex];
    
    const handleTyping = () => {
      if (!isDeleting) {
        // Đang gõ chữ vào
        setTypedText(currentFullText.slice(0, typedText.length + 1));
        
        if (typedText === currentFullText) {
          // Gõ xong câu, dừng lại một lát rồi bắt đầu xóa
          setTypingSpeed(2000); // Đợi 2 giây
          setIsDeleting(true);
        } else {
          setTypingSpeed(80);
        }
      } else {
        // Đang xóa chữ
        setTypedText(currentFullText.slice(0, typedText.length - 1));
        
        if (typedText === '') {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
          setTypingSpeed(300);
        } else {
          setTypingSpeed(45);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, titleIndex, typingSpeed]);

  const handleStartSampleLesson = () => {
    playSound('tada');
    router.push('/lesson');
  };

  const handleNavClick = (path: string) => {
    playSound('click');
    router.push(path);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden pb-16 ${beVietnamPro.className}`}>
      
      {/* Các đám mây trôi tự động */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          className="absolute top-16 left-0 w-40 h-14 bg-white/60 rounded-full blur-[1px]"
          animate={{ x: ['-200px', '100vw'] }}
          transition={{ repeat: Infinity, duration: 45, ease: 'linear' }}
        />
        <motion.div 
          className="absolute top-64 right-0 w-52 h-16 bg-white/50 rounded-full blur-[1px]"
          animate={{ x: ['100vw', '-300px'] }}
          transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
        />
        <motion.div 
          className="absolute top-1/4 left-1/4 w-32 h-11 bg-white/40 rounded-full"
          animate={{ x: ['-150px', '100vw'] }}
          transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
        />
      </div>

      {/* Bong bóng nổi nhẹ nhàng tạo hiệu ứng hoạt hình sinh động */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {isMounted && BUBBLES_CONFIG.map((bubble, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20 border border-white/30"
            style={{
              width: bubble.width,
              height: bubble.height,
              left: bubble.left,
              bottom: '-55px',
            }}
            animate={{
              y: [0, -1200],
              x: bubble.xRange,
              opacity: [0, 0.8, 0.8, 0]
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Sticky Header Glassmorphism */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b-2 border-indigo-100 shadow-sm px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => playSound('click')}
            className="flex items-center gap-2.5 group"
          >
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl text-white shadow-md transform group-hover:rotate-12 transition-transform duration-300">
              <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-xl md:text-2xl font-black text-indigo-900 tracking-wide hidden sm:block">VietTyping</span>
          </Link>

          {/* Gamification Stats & Navigation */}
          <div className="flex items-center gap-2 md:gap-5">
            {/* Student Profile Bubble */}
            <button
              onClick={() => {
                playSound('click');
                setIsOpenConfig(true);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 md:px-3.5 md:py-1.5 bg-white border-2 border-slate-800 rounded-full shadow-[2px_2px_0px_0px_#1e293b] hover:bg-amber-105/40 transition-all active:translate-y-[1px] active:shadow-none cursor-pointer"
              title="Cấu hình hồ sơ của bé"
            >
              <span className="text-xl animate-pulse">{studentInfo ? studentInfo.avatar : '👤'}</span>
              <span className="hidden sm:block text-xs font-black text-slate-750 max-w-[120px] truncate">
                {studentInfo ? studentInfo.nickname : 'Bé là ai thế?'}
              </span>
            </button>

            {/* XP Display */}
            {xp > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-full shadow-sm">
                <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />
                <span className="text-xs font-black text-amber-700">{xp} XP</span>
              </div>
            )}

            {/* Streak Display */}
            {streak > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-orange-50 border-2 border-orange-200 px-3 py-1.5 rounded-full shadow-sm">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                <span className="text-xs font-black text-orange-700">{streak} ngày</span>
              </div>
            )}

            {/* Leaderboard CTA Button */}
            <button
              onClick={() => handleNavClick('/leaderboard')}
              className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 bg-yellow-50 border-2 border-yellow-400 text-yellow-850 rounded-full shadow-sm hover:bg-yellow-100 transition-all cursor-pointer"
              title="Xem bảng xếp hạng"
            >
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-300 animate-pulse" />
              <span className="hidden md:inline text-xs font-black">Xếp Hạng</span>
            </button>
 
            {/* Main CTA: Luyện gõ phím */}
            <button
              onClick={() => handleNavClick('/typing')}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-[20px] text-xs md:text-sm font-black border-b-4 border-indigo-700 shadow-[3px_3px_0px_0px_#c7d2fe] transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none active:border-b-0 cursor-pointer"
            >
              <Keyboard className="w-4 h-4 text-indigo-100 hidden sm:block" />
              <span>Luyện gõ phím</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-4 text-center">
        
        {/* Lời chào cá nhân hóa cho bé */}
        {studentInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border-2 border-slate-800 rounded-2xl shadow-[4px_4px_0px_0px_#1e293b]"
          >
            <span className="text-2xl animate-bounce">{studentInfo.avatar}</span>
            <span className="text-slate-800 font-black text-sm md:text-base">
              Chào mừng <span className="text-indigo-600 font-black">{studentInfo.nickname}</span> ({studentInfo.grade}) đã đến với đảo học tập! 🌟
            </span>
          </motion.div>
        )}

        {/* Typing Animated Hero Title */}
        <h1 className="text-3xl md:text-6xl font-black text-indigo-900 mb-4 min-h-[60px] md:min-h-[80px] drop-shadow-sm tracking-wide">
          {typedText}
          <span className="animate-blink text-indigo-500 font-normal">|</span>
        </h1>

        <p className="text-gray-700 text-sm md:text-lg max-w-2xl mx-auto mb-6 font-semibold leading-relaxed">
          Nơi bé vừa chơi vừa học các môn học thú vị: Đạo đức, Toán, Tiếng Việt, Tiếng Anh... và rèn luyện kỹ năng gõ 10 ngón thật điêu luyện!
        </p>

        {/* Slide Banner giới thiệu các môn học */}
        <HeroSlideBanner />

        {/* Nút hành động 3D Chunky chính */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartSampleLesson}
          className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-400 to-pink-500 text-white font-black text-lg md:text-xl w-full md:w-auto px-6 md:px-10 py-4 md:py-5 rounded-[26px] border-b-[6px] border-red-600 shadow-[0_8px_0_0_#fca5a5] hover:shadow-[0_4px_0_0_#fca5a5] transition-[background-color,border-color,color,box-shadow] duration-200 mb-10 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
          <span>Học Bài Mẫu Ngay!</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Feature Badges */}
        {/* Feature Badges - Gọn gàng trên 1 dòng */}
        <div className="flex flex-row flex-nowrap justify-start md:justify-center items-center gap-2.5 md:gap-3 max-w-4xl mx-auto overflow-x-auto whitespace-nowrap pb-3 md:pb-0 scrollbar-none select-none">
          {[
            { icon: '📚', label: '8 Môn Học Thú Vị', color: 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-100' },
            { icon: '🎯', label: 'Bài Tập Tương Tác', color: 'bg-amber-50 border-amber-200 text-amber-700 shadow-amber-100' },
            { icon: '⌨️', label: 'Gõ Phím 10 Ngón', color: 'bg-sky-50 border-sky-200 text-sky-700 shadow-sky-100' },
            { icon: '🎮', label: 'Trò Chơi Trí Tuệ', color: 'bg-pink-50 border-pink-200 text-pink-700 shadow-pink-100' },
          ].map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-1.5 border-2 px-4 py-2 rounded-[16px] text-xs md:text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] shrink-0 ${f.color}`}
            >
              <span className="text-lg">{f.icon}</span>
              <span>{f.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Grid Danh sách môn học */}
      <div className="relative z-10 mt-8">
        <SubjectSelector
          subjects={subjects}
          onSelectSubject={(subject) => {
            playSound('click');
            router.push(`/subjects/${subject.id}`);
          }}
        />
      </div>

      {/* Góc Phụ Huynh / Thông tin phụ */}
      <div className="max-w-4xl mx-auto px-6 mt-12 text-center relative z-10">
        <div className="inline-flex flex-col md:flex-row items-center gap-4 bg-white/70 backdrop-blur-md border-2 border-indigo-100 p-6 rounded-3xl shadow-[5px_5px_0px_0px_#e0e7ff]">
          <div className="p-3.5 bg-indigo-50 rounded-2xl text-3xl shrink-0">
            👨‍👩‍👧‍👦
          </div>
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h4 className="text-indigo-950 font-black text-lg flex items-center justify-center md:justify-start gap-1.5">
              <span>Bố mẹ ơi!</span>
              <Smile className="w-5 h-5 text-indigo-500" />
            </h4>
            <p className="text-gray-600 text-sm md:text-base mt-1 font-medium leading-relaxed">
              Hãy ghé thăm <Link href="/parents" onClick={() => playSound('click')} className="text-indigo-600 font-bold underline hover:text-indigo-800">Góc phụ huynh</Link> để theo dõi tiến trình học tập của bé, xem bảng điểm, thống kê WPM và chuỗi ngày học để động viên bé kịp thời nhé!
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 text-sm font-bold text-gray-500 relative z-10">
        <div className="flex justify-center gap-6 mb-3">
          <Link href="/parents" onClick={() => playSound('click')} className="hover:text-indigo-600 transition-colors">Góc phụ huynh</Link>
          <span>•</span>
          <Link href="/typing" onClick={() => playSound('click')} className="hover:text-indigo-600 transition-colors">Đảo Gõ Phím</Link>
        </div>
        <div>Thiết kế đặc biệt dành cho học sinh Lớp 1 - Lớp 5 ❤️ VietTyping</div>
      </footer>
    </div>
  );
}

