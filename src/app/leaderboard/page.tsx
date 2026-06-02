'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Flame, Crown, Sparkles, Medal, Play } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { useStudent } from '@/contexts/StudentContext';
import { weeklyLeaderboard, allTimeLeaderboard, LeaderboardUser } from '@/data/leaderboard';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800']
});

export default function LeaderboardPage() {
  const router = useRouter();
  const { playSound } = useSound();
  const { studentInfo } = useStudent();
  
  const [activeTab, setActiveTab] = useState<'weekly' | 'alltime'>('weekly');
  const [userXp, setUserXp] = useState<number>(0);
  const [userStreak, setUserStreak] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // States tính toán Huy hiệu
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [hasAccuracyBadge, setHasAccuracyBadge] = useState<boolean>(false);
  const [hasSpeedBadge, setHasSpeedBadge] = useState<boolean>(false);
  const [hasTurtleBadge, setHasTurtleBadge] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedXp = parseInt(localStorage.getItem('typing_xp') || '0', 10);
      const savedStreak = parseInt(localStorage.getItem('typing_streak') || '0', 10);
      setUserXp(savedXp);
      setUserStreak(savedStreak);

      const completed = JSON.parse(localStorage.getItem('typing_completed_lessons') || '[]');
      setCompletedCount(completed.length);
      setHasAccuracyBadge(localStorage.getItem('viettyping_badge_accuracy_100') === 'true');
      setHasSpeedBadge(localStorage.getItem('viettyping_badge_speed_20') === 'true');
      setHasTurtleBadge(localStorage.getItem('viettyping_badge_turtle_rescue') === 'true');
    } catch (e) {
      console.error('Failed to load user progress:', e);
    }
  }, []);

  const badges = [
    {
      id: 'explore',
      name: 'Khám Phá',
      emoji: '🦖',
      desc: 'Hoàn thành bài luyện gõ đầu tiên',
      unlocked: completedCount >= 1,
      color: 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-emerald-100'
    },
    {
      id: 'accuracy',
      name: 'Chính Xác',
      emoji: '🎯',
      desc: 'Gõ chuẩn xác 100% trong bài tập',
      unlocked: hasAccuracyBadge,
      color: 'bg-rose-50 border-rose-300 text-rose-800 shadow-rose-100'
    },
    {
      id: 'speed',
      name: 'Siêu Tốc',
      emoji: '⚡',
      desc: 'Gõ phím tốc độ trên 20 WPM',
      unlocked: hasSpeedBadge,
      color: 'bg-purple-50 border-purple-300 text-purple-800 shadow-purple-100'
    },
    {
      id: 'streak',
      name: 'Chăm Chỉ',
      emoji: '🔥',
      desc: 'Chuỗi học tập đạt từ 3 ngày',
      unlocked: userStreak >= 3,
      color: 'bg-orange-50 border-orange-355 text-orange-850 shadow-orange-100'
    },
    {
      id: 'rescue',
      name: 'Hiệp Sĩ Rùa',
      emoji: '🐢',
      desc: 'Giải cứu thành công Rùa con',
      unlocked: hasTurtleBadge,
      color: 'bg-sky-50 border-sky-300 text-sky-800 shadow-sky-100'
    }
  ];

  const handleBack = () => {
    playSound('click');
    router.push('/');
  };

  const handleTabChange = (tab: 'weekly' | 'alltime') => {
    playSound('click');
    setActiveTab(tab);
  };

  if (!isMounted) return null;

  // Lấy dữ liệu bảng xếp hạng hiện tại
  const baseData = activeTab === 'weekly' ? weeklyLeaderboard : allTimeLeaderboard;

  // Ghép người dùng hiện tại vào bảng xếp hạng để hiển thị thứ hạng tương đối
  const currentUserObj: LeaderboardUser = {
    id: 'current-user',
    nickname: (studentInfo?.nickname ? `${studentInfo.nickname} ${studentInfo.avatar || '👤'}` : 'Bé yêu của mẹ 👤'),
    avatar: studentInfo?.avatar || '👤',
    xp: userXp,
    streak: userStreak
  };

  // Sắp xếp danh sách xếp hạng có kèm người dùng hiện tại
  const sortedWithUser = [...baseData, currentUserObj]
    .filter((value, index, self) => self.findIndex(t => t.id === value.id) === index) // Unique
    .sort((a, b) => b.xp - a.xp);

  // Tìm thứ hạng của người dùng hiện tại
  const userRankIndex = sortedWithUser.findIndex(u => u.id === 'current-user');
  const userRank = userRankIndex + 1;

  // Lọc Top 10 để hiển thị trên bảng
  const top10List = sortedWithUser.slice(0, 10).map((user, idx) => ({
    ...user,
    rank: idx + 1
  }));

  // Phân chia Top 3 và các thứ hạng còn lại
  const firstRank = top10List.find(u => u.rank === 1);
  const secondRank = top10List.find(u => u.rank === 2);
  const thirdRank = top10List.find(u => u.rank === 3);
  const restList = top10List.filter(u => u.rank > 3);

  // Xác định khoảng cách XP để lọt vào Top 10
  const rank10User = top10List[9] || top10List[top10List.length - 1];
  const diffXpToTop10 = rank10User ? Math.max(0, rank10User.xp - userXp) : 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-yellow-55 via-amber-50 to-orange-100 relative pb-28 ${plusJakartaSans.className}`}>
      
      {/* Hiệu ứng bong bóng tròn nhẹ nhàng */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/30 border border-white/40"
            style={{
              width: Math.random() * 50 + 30,
              height: Math.random() * 50 + 30,
              left: `${Math.random() * 90}%`,
              bottom: '-80px',
            }}
            animate={{
              y: [0, -1000],
              opacity: [0, 0.7, 0.7, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        
        {/* Header với nút quay lại */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-800 rounded-2xl shadow-[3px_3px_0px_0px_#1e293b] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer text-slate-800 font-black text-sm"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3px]" />
            <span>Quay lại</span>
          </button>
          
          <div className="flex items-center gap-2 bg-white border-2 border-slate-800 px-4 py-2 rounded-2xl shadow-[3px_3px_0px_0px_#1e293b]">
            <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-300 animate-bounce" />
            <span className="text-sm font-black text-slate-800">
              Điểm của bé: <span className="text-indigo-650">{userXp} XP</span>
            </span>
          </div>
        </div>

        {/* Tiêu đề lớn */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 drop-shadow-sm tracking-wide flex items-center justify-center gap-3"
          >
            🏆 Bảng Vàng Cao Thủ
          </motion.h1>
          <p className="text-sm md:text-base text-slate-650 font-bold mt-2">
            Nơi vinh danh các siêu nhân gõ phím chăm chỉ nhất hệ mặt trời! 🌟
          </p>
        </div>

        {/* Switch Tabs (Weekly vs Alltime) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-slate-100 border-4 border-slate-800 rounded-[24px] p-1.5 shadow-[4px_4px_0px_0px_#1e293b]">
            <button
              onClick={() => handleTabChange('weekly')}
              className={`px-6 py-2.5 rounded-[18px] text-sm font-black transition-all cursor-pointer ${
                activeTab === 'weekly'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 border-2 border-slate-800 shadow-[2px_2px_0px_0px_#1e293b]'
                  : 'text-slate-600 hover:text-slate-800 bg-transparent border-2 border-transparent'
              }`}
            >
              📅 Tuần Này
            </button>
            <button
              onClick={() => handleTabChange('alltime')}
              className={`px-6 py-2.5 rounded-[18px] text-sm font-black transition-all cursor-pointer ${
                activeTab === 'alltime'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 border-2 border-slate-800 shadow-[2px_2px_0px_0px_#1e293b]'
                  : 'text-slate-600 hover:text-slate-800 bg-transparent border-2 border-transparent'
              }`}
            >
              👑 Cao Thủ All-Time
            </button>
          </div>
        </div>

        {/* Top 3 Vinh Danh - Bục 3D */}
        <div className="flex justify-center items-end gap-3 md:gap-8 mb-12 px-4 select-none">
          {/* HẠNG 2 (Bên Trái) */}
          {secondRank && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center w-24 md:w-32"
            >
              <div className="text-4xl md:text-5xl animate-bounce mb-2">{secondRank.avatar}</div>
              <div className="text-[10px] md:text-xs font-black text-slate-700 text-center truncate w-full mb-1">
                {secondRank.nickname.split(' ')[0]}
              </div>
              <div className="text-[10px] font-black text-slate-500 bg-slate-100 border-2 border-slate-300 px-2 py-0.5 rounded-full mb-2">
                {secondRank.xp} XP
              </div>
              {/* Cột bục hạng 2 */}
              <div className="w-full bg-slate-200 border-4 border-slate-850 border-b-0 rounded-t-2xl h-24 flex flex-col items-center justify-center shadow-inner relative">
                <Medal className="w-8 h-8 text-slate-400 fill-slate-200" />
                <span className="text-xl md:text-2xl font-black text-slate-700 mt-1">2</span>
              </div>
            </motion.div>
          )}

          {/* HẠNG 1 (Ở Giữa - Cao Nhất) */}
          {firstRank && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center w-28 md:w-36 z-10"
            >
              {/* Vương miện nảy nhẹ trên đầu Hạng 1 */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="mb-1"
              >
                <Crown className="w-8 h-8 text-yellow-500 fill-yellow-300 stroke-[2px]" />
              </motion.div>
              <div className="text-5xl md:text-6xl mb-2">{firstRank.avatar}</div>
              <div className="text-xs md:text-sm font-black text-indigo-950 text-center truncate w-full mb-1">
                {firstRank.nickname.split(' ')[0]}
              </div>
              <div className="text-[11px] font-black text-amber-700 bg-amber-55 border-2 border-amber-300 px-2.5 py-0.5 rounded-full mb-2">
                {firstRank.xp} XP
              </div>
              {/* Cột bục hạng 1 */}
              <div className="w-full bg-gradient-to-b from-yellow-300 to-amber-400 border-4 border-slate-850 border-b-0 rounded-t-2xl h-36 flex flex-col items-center justify-center shadow-[inset_0_4px_0_0_rgba(255,255,255,0.4)] relative">
                <div className="absolute top-2 w-4 h-4 bg-white/30 rounded-full blur-sm animate-ping"></div>
                <span className="text-3xl md:text-4xl font-black text-slate-900">1</span>
              </div>
            </motion.div>
          )}

          {/* HẠNG 3 (Bên Phải) */}
          {thirdRank && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center w-24 md:w-32"
            >
              <div className="text-4xl md:text-5xl animate-bounce mb-2">{thirdRank.avatar}</div>
              <div className="text-[10px] md:text-xs font-black text-slate-700 text-center truncate w-full mb-1">
                {thirdRank.nickname.split(' ')[0]}
              </div>
              <div className="text-[10px] font-black text-slate-500 bg-slate-100 border-2 border-slate-300 px-2 py-0.5 rounded-full mb-2">
                {thirdRank.xp} XP
              </div>
              {/* Cột bục hạng 3 */}
              <div className="w-full bg-amber-75/30 border-4 border-slate-850 border-b-0 rounded-t-2xl h-16 flex flex-col items-center justify-center shadow-inner relative">
                <Medal className="w-8 h-8 text-amber-700 fill-amber-55" />
                <span className="text-lg md:text-xl font-black text-amber-800 mt-1">3</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Danh sách thứ hạng từ 4 đến 10 */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3 bg-white/70 backdrop-blur-md border-4 border-slate-800 rounded-[28px] p-4 md:p-6 shadow-[6px_6px_0px_0px_#1e293b]"
        >
          {restList.map((user) => {
            const isMe = user.id === 'current-user';
            
            return (
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.01, x: 2 }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                  isMe
                    ? 'bg-indigo-50 border-indigo-500 shadow-[3px_3px_0px_0px_#4f46e5]'
                    : 'bg-white border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Số thứ hạng */}
                  <span className={`w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center font-black text-xs shadow-[1.5px_1.5px_0px_0px_#1e293b] ${
                    isMe ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {user.rank}
                  </span>
                  
                  {/* Avatar và Tên */}
                  <span className="text-2xl">{user.avatar}</span>
                  <span className={`text-xs md:text-sm font-black ${isMe ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {isMe ? `${user.nickname} (Con đó!)` : user.nickname}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Streak ngọn lửa */}
                  {user.streak > 0 && (
                    <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200" title="Chuỗi ngày học">
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-100 animate-pulse" />
                      <span className="text-[10px] font-black text-orange-700">{user.streak}d</span>
                    </div>
                  )}
                  {/* Điểm XP */}
                  <div className="flex items-center gap-1 bg-indigo-50/50 px-3 py-1 rounded-full border border-indigo-150">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[11px] font-black text-indigo-950">{user.xp} XP</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section Huy Hiệu của bé */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white/70 backdrop-blur-md border-4 border-slate-800 rounded-[28px] p-5 md:p-6 shadow-[6px_6px_0px_0px_#1e293b]"
        >
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <span>🏅 Huy Hiệu Học Tập Của Bé</span>
            <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-300 animate-pulse" />
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={`border-3 border-slate-850 rounded-2xl p-3.5 flex flex-col items-center justify-between text-center transition-all ${
                  badge.unlocked 
                    ? `${badge.color} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:scale-103` 
                    : 'bg-slate-100/70 border-slate-300 text-slate-400 opacity-60'
                }`}
                title={badge.desc}
              >
                <div className="relative">
                  <span className={`text-4.5xl inline-block mb-2 ${badge.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                    {badge.emoji}
                  </span>
                  {!badge.unlocked && (
                    <div className="absolute -top-1.5 -right-1.5 bg-slate-200 border-2 border-slate-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-slate-500 shadow-sm">
                      🔒
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-black text-xs md:text-sm text-slate-850 leading-tight mb-1">
                    {badge.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 leading-tight leading-relaxed max-w-[110px] mx-auto">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sticky Bottom Card động viên bé */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-4 border-slate-850 p-4 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-300 border-2 border-slate-800 rounded-full flex items-center justify-center text-3xl shadow-sm animate-bounce">
                👑
              </div>
              <div className="text-left">
                <h4 className="text-slate-900 font-black text-sm md:text-base flex items-center gap-1.5">
                  <span>Hạng hiện tại của con: </span>
                  <span className="text-indigo-600 font-extrabold text-base">#{userRank}</span>
                </h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {userRank <= 10 ? (
                    <span className="text-emerald-600 font-bold">🎉 Thật tuyệt vời! Con đang nằm trong Top 10 bảng vàng học tập đó!</span>
                  ) : (
                    <span>Chỉ cần tích lũy thêm <span className="text-amber-600 font-extrabold">{diffXpToTop10} XP</span> nữa là lọt vào Top 10 rồi!</span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleBack()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-650 text-white font-black text-sm px-6 py-3.5 rounded-[18px] border-b-4 border-red-700 shadow-[3px_3px_0px_0px_#1e293b] active:translate-y-0.5 active:border-b-2 active:shadow-none transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-white fill-white" />
              <span>{userRank <= 10 ? 'Học Để Giữ Hạng!' : 'Gõ Phím Đua Top Ngay!'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
