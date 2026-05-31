'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSound } from '@/contexts/SoundContext';

interface SlideItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  color: string;
  borderColor: string;
  path: string;
  badge: string;
}

const slides: SlideItem[] = [
  {
    id: 'luyen-go',
    title: 'Siêu Nhân Gõ Phím ⌨️',
    description: 'Bé tập đặt tay đúng cách và luyện gõ phím 10 ngón siêu tốc độ cùng chú Khủng long đáng yêu!',
    imageUrl: '/assets/thumbnails/luyen_go.png',
    color: 'from-cyan-400/20 via-cyan-100/50 to-blue-300/20',
    borderColor: 'border-cyan-400',
    path: '/subjects/luyen-go-10-ngon',
    badge: '🚀 Mới Lạ & Cực Vui'
  },
  {
    id: 'toan-hoc',
    title: 'Đảo Toán Học Kỳ Thú 🔢',
    description: 'Học đếm, làm phép cộng trừ thực tế và nhận Huy hiệu cùng Gấu trúc và Mèo con tài ba!',
    imageUrl: '/assets/thumbnails/toan_hoc.png',
    color: 'from-orange-400/20 via-orange-100/50 to-amber-300/20',
    borderColor: 'border-amber-400',
    path: '/subjects/toan',
    badge: '⭐ Thần Đồng Toán Học'
  },
  {
    id: 'tieng-viet',
    title: 'Tiếng Việt Vui Nhộn 📚',
    description: 'Luyện gõ chữ cái Tiếng Việt, ghép vần và khám phá những câu chuyện cổ tích hấp dẫn!',
    imageUrl: '/assets/thumbnails/tieng_viet.png',
    color: 'from-emerald-400/20 via-emerald-100/50 to-green-300/20',
    borderColor: 'border-green-400',
    path: '/subjects/tieng-viet',
    badge: '✨ Giỏi Tiếng Việt'
  },
  {
    id: 'tieng-anh',
    title: 'Học Tiếng Anh Dễ Thương 🌍',
    description: 'Làm quen bảng chữ cái tiếng Anh và các từ vựng chào hỏi cơ bản siêu dễ thương!',
    imageUrl: '/assets/thumbnails/tieng_anh.png',
    color: 'from-indigo-400/20 via-indigo-100/50 to-purple-300/20',
    borderColor: 'border-indigo-400',
    path: '/subjects/tieng-anh',
    badge: '🇬🇧 English is Fun!'
  }
];

export default function HeroSlideBanner() {
  const router = useRouter();
  const { playSound } = useSound();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1: left, 1: right

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext(true); // Tự động chạy
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = (isAuto = false) => {
    if (!isAuto) playSound('click');
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    playSound('click');
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSlideClick = (path: string) => {
    playSound('tada');
    router.push(path);
  };

  // Biến thể cho framer-motion chuyển slide trượt
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 25 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 25 },
        opacity: { duration: 0.2 }
      }
    })
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4 relative">
      <div className={`relative overflow-hidden rounded-[32px] border-4 border-slate-800 bg-gradient-to-br ${currentSlide.color} p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-[8px_8px_0px_0px_#1e293b] transition-all duration-500`}>
        
        {/* Nút điều hướng Trái - 3D Chunky */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-15 bg-white border-2 border-slate-800 text-slate-850 p-2.5 rounded-2xl shadow-[2px_2px_0px_0px_#1e293b] active:translate-y-[-48%] active:shadow-none transition-all hover:bg-slate-50 cursor-pointer hidden sm:flex"
        >
          <ChevronLeft className="w-5 h-5 stroke-[3px]" />
        </button>

        {/* Nút điều hướng Phải - 3D Chunky */}
        <button
          onClick={() => handleNext(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-15 bg-white border-2 border-slate-800 text-slate-850 p-2.5 rounded-2xl shadow-[2px_2px_0px_0px_#1e293b] active:translate-y-[-48%] active:shadow-none transition-all hover:bg-slate-50 cursor-pointer hidden sm:flex"
        >
          <ChevronRight className="w-5 h-5 stroke-[3px]" />
        </button>

        {/* Nội dung Banner chứa AnimatePresence để trượt mượt mà */}
        <div className="w-full flex flex-col md:flex-row items-center gap-6 md:gap-8 min-h-[300px] md:min-h-[220px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex flex-col md:flex-row items-center gap-6 md:gap-8"
            >
              {/* Hình ảnh bên Trái - Đã tăng height và dùng aspect-square để tránh bị crop chữ */}
              <div className="w-full md:w-1/2 flex justify-center shrink-0">
                <motion.div
                  whileHover={{ scale: 1.03, rotate: [0, -1, 1, 0] }}
                  className="w-full max-w-[200px] md:max-w-[280px] aspect-square h-48 md:h-68 relative rounded-[24px] border-4 border-slate-800 overflow-hidden shadow-[4px_4px_0px_0px_#1e293b] bg-white cursor-pointer p-2 flex items-center justify-center"
                  onClick={() => handleSlideClick(currentSlide.path)}
                >
                  <img
                    src={currentSlide.imageUrl}
                    alt={currentSlide.title}
                    className="max-w-full max-h-full object-contain rounded-[16px]"
                  />
                  <div className="absolute top-2 left-2 bg-yellow-300 border-2 border-slate-800 text-[10px] font-black tracking-wide px-2 py-0.5 rounded-full shadow-sm z-10">
                    {currentSlide.badge}
                  </div>
                </motion.div>
              </div>

              {/* Thông tin bên Phải */}
              <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center items-center md:items-start">
                <span className="inline-block self-center md:self-start mb-2 px-3 py-1 bg-white border-2 border-slate-800 text-slate-800 text-[10px] font-black rounded-full shadow-sm uppercase tracking-wider">
                  Khóa Học Nổi Bật
                </span>
                
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-wide leading-tight">
                  {currentSlide.title}
                </h2>
                
                <p className="text-sm md:text-base text-slate-700 font-bold leading-relaxed mb-6">
                  {currentSlide.description}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <button
                    onClick={() => handleSlideClick(currentSlide.path)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-450 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-black text-sm px-5 py-3 rounded-[18px] border-b-4 border-rose-700 shadow-[3px_3px_0px_0px_#1e293b] hover:shadow-[2px_2px_0px_0px_#1e293b] active:translate-y-0.5 active:border-b-2 active:shadow-none transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 text-white fill-white animate-pulse" />
                    <span>Học Ngay Thôi!</span>
                  </button>

                  <div className="flex items-center gap-1.5 px-3 py-2 bg-white/60 border-2 border-slate-800 rounded-[16px] text-xs font-black text-slate-800">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>Học và Nhận +50 XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Chỉ báo Dots bên dưới */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              playSound('click');
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3.5 h-3.5 rounded-full border-2 border-slate-800 transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-yellow-400 w-8 shadow-[2px_2px_0px_0px_#1e293b]' 
                : 'bg-white hover:bg-slate-100'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
