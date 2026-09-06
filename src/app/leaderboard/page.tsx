'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Flame, Crown, Sparkles, Medal, Play, Calendar, Zap, Heart, Lock, Volume2 } from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { useStudent } from '@/contexts/StudentContext';
import { LeaderboardUser } from '@/data/leaderboard';
import { ANIMAL_SPEED_BADGES, ACHIEVEMENT_BADGES } from '@/data/badges';
import { supabase } from '@/utils/supabase';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800']
});

export default function LeaderboardPage() {
  const router = useRouter();
  const { playSound, playAudio } = useSound();
  const { studentInfo } = useStudent();
  
  const [activeTab, setActiveTab] = useState<'weekly' | 'alltime'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userXp, setUserXp] = useState<number>(0);
  const [userStreak, setUserStreak] = useState<number>(0);
  const [userWpm, setUserWpm] = useState<number>(0);
  const [userAccuracy, setUserAccuracy] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // States tính toán Huy hiệu
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [hasAccuracyBadge, setHasAccuracyBadge] = useState<boolean>(false);
  const [hasTurtleBadge, setHasTurtleBadge] = useState<boolean>(false);
  const [unlockedMap, setUnlockedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedXp = parseInt(localStorage.getItem('typing_xp') || '0', 10);
      const savedStreak = parseInt(localStorage.getItem('typing_streak') || '0', 10);
      const savedWpm = parseInt(localStorage.getItem('typing_avg_wpm') || '0', 10);
      const savedAcc = parseInt(localStorage.getItem('typing_avg_accuracy') || '0', 10);
      setUserXp(savedXp);
      setUserStreak(savedStreak);
      setUserWpm(savedWpm);
      setUserAccuracy(savedAcc);

      const completed = JSON.parse(localStorage.getItem('typing_completed_lessons') || '[]');
      setCompletedCount(completed.length);
      setHasAccuracyBadge(localStorage.getItem('viettyping_badge_accuracy_100') === 'true');
      setHasTurtleBadge(localStorage.getItem('viettyping_badge_turtle_rescue') === 'true');
      
      // Load tất cả các cờ huy hiệu
      const keys = [
        'speed_turtle', 'speed_bunny', 'speed_leopard',
        'speed_10', 'speed_20', 'speed_30', 'speed_40', 'speed_50',
        'first_lesson', 'accuracy_100', 'streak_3', 'turtle_rescue',
        'game_matching', 'game_bubble', 'practice_master'
      ];
      const map: Record<string, boolean> = {};
      keys.forEach((k) => {
        map[k] = localStorage.getItem(`viettyping_badge_${k}`) === 'true';
      });
      setUnlockedMap(map);

      // Check user session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setCurrentUserId(session.user.id);
        }
      });
    } catch (e) {
      console.error('Failed to load user progress:', e);
    }
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('student_profiles')
          .select('id, nickname, avatar, xp, streak');

        if (activeTab === 'weekly') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          query = query.gte('updated_at', sevenDaysAgo.toISOString());
        }

        const { data, error } = await query
          .order('xp', { ascending: false })
          .limit(20);

        if (error) throw error;

        if (data && data.length > 0) {
          const mappedUsers: LeaderboardUser[] = data.map((u, index) => ({
            id: u.id,
            nickname: u.nickname || 'Bạn Nhỏ',
            avatar: u.avatar || '🦁',
            xp: u.xp || 0,
            streak: u.streak || 0,
            rank: index + 1
          }));
          setLeaderboardData(mappedUsers);
        } else {
          setLeaderboardData([]);
        }
      } catch (err) {
        console.error('Lỗi khi tải bảng xếp hạng:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isMounted) {
      fetchLeaderboard();
    }
  }, [activeTab, isMounted]);
  const speedBadges = ANIMAL_SPEED_BADGES.map((badge) => {
    let unlocked = unlockedMap[badge.id] || false;
    if (badge.id === 'speed_turtle') {
      unlocked = unlocked || userWpm > 0;
    } else if (badge.id === 'speed_bunny') {
      unlocked = unlocked || userWpm >= 10 || unlockedMap['speed_10'] || unlockedMap['speed_20'];
    } else if (badge.id === 'speed_leopard') {
      unlocked = unlocked || userWpm >= 25 || unlockedMap['speed_30'] || unlockedMap['speed_40'] || unlockedMap['speed_50'];
    }
    return { ...badge, unlocked };
  });

  const achievementBadges = ACHIEVEMENT_BADGES.map((badge) => {
    let unlocked = unlockedMap[badge.id] || false;
    if (badge.id === 'first_lesson') {
      unlocked = unlocked || completedCount >= 1;
    } else if (badge.id === 'accuracy_100') {
      unlocked = unlocked || hasAccuracyBadge || userAccuracy === 100;
    } else if (badge.id === 'streak_3') {
      unlocked = unlocked || userStreak >= 3;
    } else if (badge.id === 'turtle_rescue') {
      unlocked = unlocked || hasTurtleBadge;
    }
    return { ...badge, unlocked };
  });

  const handleBack = () => {
    playSound('click');
    router.push('/');
  };

  const handleTabChange = (tab: 'weekly' | 'alltime') => {
    playSound('click');
    setActiveTab(tab);
  };

  if (!isMounted) return null;

  // Lấy dữ liệu bảng xếp hạng hiện tại và lọc bỏ tài khoản thật của chính mình (nếu có) để tránh lặp
  const baseData = leaderboardData.filter(u => u.id !== currentUserId);

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
    <div className={`canvas-bg bg-background text-foreground transition-colors min-h-screen relative pb-28 ${plusJakartaSans.className}`}>
      
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
        
        {/* Header với nút quay lại và thông số của bé */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <button
            onClick={handleBack}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-surface)] border-2 border-[var(--color-foreground)] rounded-2xl shadow-[3px_3px_0px_0px_var(--color-foreground)] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer text-[var(--color-foreground)] font-black text-sm"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3px]" />
            <span>Quay lại trang chủ</span>
          </button>
          
          {/* Cụm thông số gõ phím của bé */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Tốc độ */}
            <div className="flex items-center gap-1.5 bg-[var(--color-surface)] border-2 border-[var(--color-foreground)] px-3.5 py-2 rounded-2xl shadow-[3px_3px_0px_0px_var(--color-foreground)] text-[var(--color-foreground)]">
              <span className="text-base select-none">⚡</span>
              <span className="text-xs font-black">
                Tốc độ: <span className="text-amber-600 font-extrabold">{userWpm || 0} WPM</span>
              </span>
            </div>
            
            {/* Độ chính xác */}
            <div className="flex items-center gap-1.5 bg-[var(--color-surface)] border-2 border-[var(--color-foreground)] px-3.5 py-2 rounded-2xl shadow-[3px_3px_0px_0px_var(--color-foreground)] text-[var(--color-foreground)]">
              <span className="text-base select-none">🎯</span>
              <span className="text-xs font-black">
                Chính xác: <span className="text-emerald-600 font-extrabold">{userAccuracy || 0}%</span>
              </span>
            </div>

            {/* Điểm số */}
            <div className="flex items-center gap-1.5 bg-[var(--color-surface)] border-2 border-[var(--color-foreground)] px-3.5 py-2 rounded-2xl shadow-[3px_3px_0px_0px_var(--color-foreground)] text-[var(--color-foreground)]">
              <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-300 animate-bounce" />
              <span className="text-xs font-black">
                Điểm số: <span className="text-[var(--color-primary-depth)]">{userXp} XP</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tiêu đề lớn */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 drop-shadow-sm tracking-wide flex items-center justify-center gap-3"
          >
            <Trophy className="w-10 h-10 text-yellow-500 fill-yellow-300 animate-bounce" /> Bảng Vàng Cao Thủ
          </motion.h1>
          <p className="text-sm md:text-base text-slate-650 font-bold mt-2">
            Nơi vinh danh các siêu nhân gõ phím chăm chỉ nhất hệ mặt trời!
          </p>
        </div>

        {/* Switch Tabs (Weekly vs Alltime) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-[var(--color-surface-container)] border-4 border-[var(--color-foreground)] rounded-[24px] p-1.5 shadow-[4px_4px_0px_0px_var(--color-foreground)]">
            <button
              onClick={() => handleTabChange('weekly')}
              className={`px-6 py-2.5 rounded-[18px] text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'weekly'
                  ? 'bg-[var(--color-primary)] text-white border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)]'
                  : 'text-[var(--color-foreground)] opacity-70 hover:opacity-100 bg-transparent border-2 border-transparent'
              }`}
            >
              <Calendar className="w-4 h-4" /> Tuần Này
            </button>
            <button
              onClick={() => handleTabChange('alltime')}
              className={`px-6 py-2.5 rounded-[18px] text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alltime'
                  ? 'bg-[var(--color-primary)] text-white border-2 border-[var(--color-foreground)] shadow-[2px_2px_0px_0px_var(--color-foreground)]'
                  : 'text-[var(--color-foreground)] opacity-70 hover:opacity-100 bg-transparent border-2 border-transparent'
              }`}
            >
              <Crown className="w-4 h-4 text-yellow-500 fill-yellow-300" /> Cao Thủ All-Time
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 bg-[var(--color-surface)] border-4 border-[var(--color-foreground)] rounded-[28px] shadow-[6px_6px_0px_0px_var(--color-foreground)]">
            <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-black text-slate-500 mt-4">Đang tải bảng vàng cao thủ...</p>
          </div>
        ) : (
          <>
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
                  <div className="w-full bg-slate-200 border-4 border-[var(--color-foreground)] border-b-0 rounded-t-2xl h-24 flex flex-col items-center justify-center shadow-inner relative">
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
                  <div className="w-full bg-gradient-to-b from-yellow-300 to-amber-400 border-4 border-[var(--color-foreground)] border-b-0 rounded-t-2xl h-36 flex flex-col items-center justify-center shadow-[inset_0_4px_0_0_rgba(255,255,255,0.4)] relative">
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
                  <div className="w-full bg-amber-75/30 border-4 border-[var(--color-foreground)] border-b-0 rounded-t-2xl h-16 flex flex-col items-center justify-center shadow-inner relative">
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
              className="space-y-3 bg-[var(--color-surface)] border-4 border-[var(--color-foreground)] rounded-[28px] p-4 md:p-6 shadow-[6px_6px_0px_0px_var(--color-foreground)] transition-colors"
            >
              {restList.map((user) => {
                const isMe = user.id === 'current-user';
                
                return (
                  <motion.div
                    key={user.id}
                    whileHover={{ scale: 1.01, x: 2 }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                      isMe
                        ? 'bg-[var(--color-primary-container)] border-[var(--color-primary)] shadow-[3px_3px_0px_0px_var(--color-primary-depth)] text-[var(--color-on-primary-container)]'
                        : 'bg-[var(--color-surface)] border-[var(--color-outline-variant)] hover:border-slate-400 text-[var(--color-foreground)]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Số thứ hạng */}
                      <span className={`w-8 h-8 rounded-full border-2 border-[var(--color-foreground)] flex items-center justify-center font-black text-xs shadow-[1.5px_1.5px_0px_0px_var(--color-foreground)] ${
                        isMe ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface-container)] text-[var(--color-foreground)]'
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
                      <div className="flex items-center gap-1 bg-[var(--color-surface-container)] px-3 py-1 rounded-full border border-[var(--color-outline-variant)]">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-[11px] font-black text-[var(--color-foreground)]">{user.xp} XP</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}

        {/* Section Huy Hiệu của bé */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-[var(--color-surface)] border-4 border-[var(--color-foreground)] rounded-[28px] p-5 md:p-6 shadow-[6px_6px_0px_0px_var(--color-foreground)] transition-colors space-y-8"
        >
          {/* Nhóm 1: Hành Trình Tốc Độ WPM */}
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-250 animate-pulse" />
              <span>Hành Trình Tốc Độ (WPM)</span>
              <span className="text-[10px] md:text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200 font-extrabold uppercase tracking-wider">Bé gõ càng nhanh, huy hiệu càng xịn!</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {speedBadges.map((badge) => (
                <div 
                  key={badge.id}
                  onClick={() => {
                    if (badge.unlocked && badge.audioFile) {
                      playSound('click');
                      playAudio(badge.audioFile);
                    }
                  }}
                  className={`border-3 border-slate-850 rounded-2xl p-4 flex flex-col items-center justify-between text-center transition-all min-h-[170px] select-none ${
                    badge.unlocked 
                      ? `${badge.color} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:scale-102 active:translate-y-1 cursor-pointer` 
                      : 'bg-slate-100/70 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                  title={badge.desc}
                >
                  {/* Thumbnail Huy hiệu tròn chứa số WPM to ở chính giữa */}
                  <div className="relative w-18 h-18 md:w-20 md:h-20 flex flex-col items-center justify-center rounded-full border-4 border-slate-850 bg-white shadow-inner mb-2">
                    {/* Số WPM to chính giữa */}
                    <span className={`text-2xl md:text-3xl font-black leading-none ${badge.unlocked ? 'text-slate-900' : 'text-slate-400 grayscale'}`}>
                      {badge.wpmRequirement}
                    </span>
                    <span className={`text-[8px] font-black tracking-wider uppercase leading-none mt-0.5 ${badge.unlocked ? 'text-indigo-600' : 'text-slate-400'}`}>
                      WPM
                    </span>
                    
                    {/* Con vật nhỏ đính kèm góc dưới bên phải */}
                    <span className={`absolute -bottom-1 -right-1 text-2xl md:text-3xl select-none transition-transform ${badge.unlocked ? 'animate-bounce' : 'grayscale opacity-60'}`}>
                      {badge.emoji}
                    </span>
                    
                    {/* Khoá 🔒 nếu chưa mở */}
                    {!badge.unlocked && (
                      <div className="absolute -top-1 -right-1 bg-slate-200 border-2 border-slate-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-slate-500 shadow-sm select-none">
                        <Lock className="w-2.5 h-2.5 text-slate-500" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-black text-sm text-slate-850 leading-tight mb-1">
                      {badge.name}
                    </h4>
                    <p className="text-[11px] font-bold text-slate-500 leading-tight max-w-[180px] mx-auto">
                      {badge.desc}
                    </p>
                    {badge.unlocked && badge.audioFile && (
                      <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-black text-indigo-700 bg-white/90 px-2.5 py-0.5 rounded-full border border-indigo-200 shadow-xs">
                        <Volume2 className="w-3 h-3 text-indigo-600 animate-pulse" />
                        <span>Chạm để nghe cô khen 🔊</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nhóm 2: Kỷ Niệm Đáng Yêu */}
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 mb-5 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-250 animate-pulse" />
              <span>Kỷ Niệm Đáng Yêu (Học tập & Trò chơi)</span>
              <span className="text-[10px] md:text-xs bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full border border-pink-200 font-extrabold uppercase tracking-wider">Hoàn thành thử thách để nhận quà!</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {achievementBadges.map((badge) => (
                <div 
                  key={badge.id}
                  onClick={() => {
                    if (badge.unlocked && badge.audioFile) {
                      playSound('click');
                      playAudio(badge.audioFile);
                    }
                  }}
                  className={`border-3 border-slate-850 rounded-2xl p-3.5 flex flex-col items-center justify-between text-center transition-all min-h-[150px] select-none ${
                    badge.unlocked 
                      ? `${badge.color} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] hover:scale-102 active:translate-y-1 cursor-pointer` 
                      : 'bg-slate-100/70 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed'
                  }`}
                  title={badge.desc}
                >
                  <div className="relative">
                    <span className={`text-4xl inline-block mb-1 ${badge.unlocked ? 'animate-bounce' : 'grayscale'}`}>
                      {badge.emoji}
                    </span>
                    {!badge.unlocked && (
                      <div className="absolute -top-1.5 -right-1.5 bg-slate-200 border-2 border-slate-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-slate-500 shadow-sm">
                        <Lock className="w-2.5 h-2.5 text-slate-500" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-black text-xs text-slate-850 leading-tight mb-1">
                      {badge.name}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 leading-tight max-w-[120px] mx-auto">
                      {badge.desc}
                    </p>
                    {badge.unlocked && badge.audioFile && (
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-black text-pink-700 bg-white/90 px-2 py-0.5 rounded-full border border-pink-200 shadow-xs">
                        <Volume2 className="w-2.5 h-2.5 text-pink-600" />
                        <span>Nghe cô khen</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sticky Bottom Card động viên bé */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-surface)] border-t-4 border-[var(--color-foreground)] p-4 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] transition-colors">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-300 border-2 border-slate-800 rounded-full flex items-center justify-center shadow-sm animate-bounce">
                <Crown className="w-6 h-6 text-yellow-600 fill-yellow-250" />
              </div>
              <div className="text-left">
                <h4 className="text-slate-900 font-black text-sm md:text-base flex items-center gap-1.5">
                  <span>Hạng hiện tại của con: </span>
                  <span className="text-indigo-600 font-extrabold text-base">#{userRank}</span>
                </h4>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {userRank <= 10 ? (
                    <span className="text-emerald-600 font-bold">Thật tuyệt vời! Con đang nằm trong Top 10 bảng vàng học tập đó!</span>
                  ) : (
                    <span>Chỉ cần tích lũy thêm <span className="text-amber-600 font-extrabold">{diffXpToTop10} XP</span> nữa là lọt vào Top 10 rồi!</span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleBack()}
              className="keycap-btn-secondary w-full sm:w-auto px-6 py-3.5 text-sm"
            >
              <Play className="w-4 h-4 text-white fill-white mr-1" />
              <span>{userRank <= 10 ? 'Học Để Giữ Hạng!' : 'Gõ Phím Đua Top Ngay!'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
