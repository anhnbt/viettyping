"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import {
  SyncItem,
  SyncResponse,
  getSyncQueue,
  addToSyncQueue,
  removeFromSyncQueue,
} from "@/utils/syncQueue";

export interface StudentInfo {
  name: string;      // Tên đầy đủ trên lớp
  nickname: string;  // Biệt danh / Tên gọi yêu thích
  grade: string;     // Lớp học (ví dụ: Lớp 1, Lớp 2...)
  avatar: string;    // Emoji avatar (ví dụ: 🦁)
  theme?: 'dino' | 'turtle' | 'bunny' | 'panda' | 'leopard'; // Theme giao diện của bé
}

interface StudentContextType {
  studentInfo: StudentInfo | null;
  isConfigured: boolean;
  isOpenConfig: boolean;
  isLoaded: boolean;
  
  // Trạng thái Gamification reactive để các trang tự động cập nhật
  xp: number;
  streak: number;
  avgWpm: number;
  avgAccuracy: number;

  // Trạng thái đồng bộ đám mây
  isSyncing: boolean;
  syncError: string | null;
  lastSyncedAt: string | null;
  queueLength: number;

  updateStudentInfo: (info: StudentInfo) => Promise<void>;
  setIsOpenConfig: (isOpen: boolean) => void;
  clearStudentInfo: () => void;
  updateStats: (stats: { xp?: number; streak?: number; avgWpm?: number; avgAccuracy?: number }) => Promise<void>;
  unlockBadge: (badgeId: string) => Promise<void>;
  
  // Các phương thức đồng bộ mới
  queueProgress: (lessonId: string, score: number, wpm: number, accuracy: number) => Promise<void>;
  syncQueueLocally: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const STORAGE_KEY = "viettyping_student_profile";

export function StudentProvider({ children }: { children: ReactNode }) {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [isOpenConfig, setIsOpenConfig] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // States Gamification
  const [xp, setXp] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [avgWpm, setAvgWpm] = useState<number>(0);
  const [avgAccuracy, setAvgAccuracy] = useState<number>(0);

  // States Đồng bộ
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [queueLength, setQueueLength] = useState(0);

  // Phương thức đồng bộ hàng đợi cục bộ lên máy chủ
  const syncQueueLocally = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.onLine || isSyncing) return;

    const queue = getSyncQueue();
    if (queue.length === 0) {
      setQueueLength(0);
      return;
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // Nếu không có session (chưa đăng nhập ẩn danh thành công hoặc đang chạy offline),
        // giữ dữ liệu ở local storage và không gửi request đồng bộ lên server.
        setIsSyncing(false);
        return;
      }
      const studentId = session.user.id;
      const token = session.access_token;

      const response = await fetch(`/api/v1/students/${studentId}/sync-progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(queue),
      });

      if (!response.ok) {
        throw new Error(`Đồng bộ thất bại: Mã lỗi ${response.status}`);
      }

      const result: SyncResponse = await response.json();
      
      // Đồng bộ thành công -> Cập nhật các giá trị trả về vào LocalStorage và State
      if (result) {
        localStorage.setItem("typing_xp", String(result.xp));
        localStorage.setItem("typing_streak", String(result.streak));
        localStorage.setItem("typing_avg_wpm", String(result.avgWpm));
        localStorage.setItem("typing_avg_accuracy", String(result.avgAccuracy));
        
        setXp(result.xp);
        setStreak(result.streak);
        setAvgWpm(result.avgWpm);
        setAvgAccuracy(result.avgAccuracy);

        if (result.badges) {
          result.badges.forEach((badgeId) => {
            localStorage.setItem(`viettyping_badge_${badgeId}`, "true");
          });
        }

        // Xóa các gói đã đồng bộ thành công khỏi hàng đợi
        const syncedIds = queue.map((item) => item.id);
        removeFromSyncQueue(syncedIds);
        setQueueLength(getSyncQueue().length);
        setLastSyncedAt(new Date().toISOString());
      }
    } catch (err: any) {
      console.error("Lỗi đồng bộ hàng đợi:", err);
      setSyncError(err.message || "Lỗi mạng hoặc máy chủ không phản hồi");
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  // Khởi tạo Auth ẩn danh và đồng bộ hóa profile
  useEffect(() => {
    const initSessionAndProfile = async () => {
      try {
        // 1. Đọc profile local trước cho phản hồi nhanh
        const savedProfile = localStorage.getItem(STORAGE_KEY);
        let localProfile: StudentInfo | null = null;
        if (savedProfile) {
          localProfile = JSON.parse(savedProfile) as StudentInfo;
          setStudentInfo(localProfile);
          document.documentElement.setAttribute('data-theme', localProfile.theme || 'dino');
        } else {
          document.documentElement.setAttribute('data-theme', 'dino');
        }

        // Đọc các chỉ số cục bộ
        const localXp = parseInt(localStorage.getItem('typing_xp') || '0', 10);
        const localStreak = parseInt(localStorage.getItem('typing_streak') || '0', 10);
        const localWpm = parseInt(localStorage.getItem('typing_avg_wpm') || '0', 10);
        const localAcc = parseInt(localStorage.getItem('typing_avg_accuracy') || '0', 10);
        setXp(localXp);
        setStreak(localStreak);
        setAvgWpm(localWpm);
        setAvgAccuracy(localAcc);
        setQueueLength(getSyncQueue().length);

        // 2. Đăng nhập ẩn danh Supabase Auth
        let currentSession = null;
        try {
          const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.warn("Không thể lấy session Supabase hiện tại:", sessionError.message);
          }
          currentSession = existingSession;

          if (!currentSession) {
            const { data, error } = await supabase.auth.signInAnonymously();
            if (error) {
              console.warn(
                "Supabase Anonymous Sign-in đang bị tắt hoặc gặp lỗi. Ứng dụng sẽ hoạt động ở chế độ Offline-First (Local Storage):", 
                error.message
              );
            } else {
              currentSession = data.session;
            }
          }
        } catch (authError: any) {
          console.warn("Lỗi trong quá trình xác thực với Supabase (hoạt động chế độ offline):", authError?.message || authError);
        }

        if (currentSession?.user) {
          const userId = currentSession.user.id;
          const token = currentSession.access_token;

          // 3. Tải profile và tiến trình từ Server
          const response = await fetch(`/api/v1/students/${userId}/progress`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });

          if (response.ok) {
            const data = await response.json();
            
            if (data.profile) {
              const mergedProfile: StudentInfo = {
                name: data.profile.name || '',
                nickname: data.profile.nickname,
                grade: data.profile.grade || '',
                avatar: data.profile.avatar || '🦁',
                theme: (data.profile.theme as any) || 'dino',
              };
              setStudentInfo(mergedProfile);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedProfile));
              document.documentElement.setAttribute('data-theme', mergedProfile.theme || 'dino');
            }

            // Cập nhật State & LocalStorage
            setXp(data.xp);
            setStreak(data.streak);
            setAvgWpm(data.avgWpm);
            setAvgAccuracy(data.avgAccuracy);

            localStorage.setItem('typing_xp', String(data.xp));
            localStorage.setItem('typing_streak', String(data.streak));
            localStorage.setItem('typing_avg_wpm', String(data.avgWpm));
            localStorage.setItem('typing_avg_accuracy', String(data.avgAccuracy));
            localStorage.setItem('typing_total_lessons', String(data.totalLessons));

            if (data.completedLessons) {
              localStorage.setItem('typing_completed_lessons', JSON.stringify(data.completedLessons));
            }
            if (data.badges) {
              data.badges.forEach((badgeId: string) => {
                localStorage.setItem(`viettyping_badge_${badgeId}`, 'true');
              });
            }
            if (data.progressMap) {
              localStorage.setItem('kids_learning_progress', JSON.stringify(data.progressMap));
            }
            setLastSyncedAt(new Date().toISOString());

            // Sau khi khôi phục dữ liệu xong, thử đồng bộ bất kỳ gói tin local nào còn sót
            setTimeout(() => {
              syncQueueLocally();
            }, 1000);
          } else {
            // Fallback: Tải trực tiếp từ Supabase Database nếu API route bị lỗi
            const { data: dbProfile } = await supabase
              .from('student_profiles')
              .select('*')
              .eq('id', userId)
              .single();

            if (dbProfile) {
              const mergedProfile: StudentInfo = {
                name: dbProfile.name || '',
                nickname: dbProfile.nickname,
                grade: dbProfile.grade || '',
                avatar: dbProfile.avatar || '🦁',
                theme: (dbProfile.theme as any) || 'dino',
              };
              setStudentInfo(mergedProfile);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedProfile));
              document.documentElement.setAttribute('data-theme', mergedProfile.theme || 'dino');

              if (dbProfile.xp !== null) {
                setXp(dbProfile.xp);
                localStorage.setItem('typing_xp', String(dbProfile.xp));
              }
              if (dbProfile.streak !== null) {
                setStreak(dbProfile.streak);
                localStorage.setItem('typing_streak', String(dbProfile.streak));
              }
              if (dbProfile.avg_wpm !== null) {
                setAvgWpm(dbProfile.avg_wpm);
                localStorage.setItem('typing_avg_wpm', String(dbProfile.avg_wpm));
              }
              if (dbProfile.avg_accuracy !== null) {
                setAvgAccuracy(dbProfile.avg_accuracy);
                localStorage.setItem('typing_avg_accuracy', String(dbProfile.avg_accuracy));
              }
            } else if (localProfile) {
              // Đẩy local lên database
              await supabase
                .from('student_profiles')
                .insert({
                  id: userId,
                  name: localProfile.name,
                  nickname: localProfile.nickname,
                  grade: localProfile.grade,
                  avatar: localProfile.avatar,
                  theme: localProfile.theme || 'dino',
                  xp: localXp,
                  streak: localStreak,
                  avg_wpm: localWpm,
                  avg_accuracy: localAcc
                });
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khởi tạo session và dữ liệu Supabase:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    initSessionAndProfile();
  }, []);

  // Lắng nghe sự kiện Online để tự động đồng bộ hàng đợi còn sót
  useEffect(() => {
    const handleOnline = () => {
      syncQueueLocally();
    };
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [syncQueueLocally]);

  const updateStudentInfo = useCallback(async (info: StudentInfo) => {
    const infoWithTheme: StudentInfo = {
      ...info,
      theme: info.theme || 'dino'
    };
    setStudentInfo(infoWithTheme);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(infoWithTheme));
      if (infoWithTheme.theme) {
        document.documentElement.setAttribute('data-theme', infoWithTheme.theme);
      }

      // Đồng bộ thông tin profile lên database
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase
          .from('student_profiles')
          .upsert({
            id: session.user.id,
            name: infoWithTheme.name,
            nickname: infoWithTheme.nickname,
            grade: infoWithTheme.grade,
            avatar: infoWithTheme.avatar,
            theme: infoWithTheme.theme,
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          console.error("Lỗi lưu thông tin profile lên database:", error);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin học sinh vào localStorage:", error);
    }
  }, []);

  const clearStudentInfo = useCallback(() => {
    setStudentInfo(null);
    setXp(0);
    setStreak(0);
    setAvgWpm(0);
    setAvgAccuracy(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('typing_xp');
      localStorage.removeItem('typing_streak');
      localStorage.removeItem('typing_avg_wpm');
      localStorage.removeItem('typing_avg_accuracy');
      localStorage.removeItem('typing_total_lessons');
      localStorage.removeItem('typing_completed_lessons');
      localStorage.removeItem('kids_learning_progress');
      localStorage.removeItem('viettyping_sync_queue');
      document.documentElement.setAttribute('data-theme', 'dino');
      setQueueLength(0);
    } catch (error) {
      console.error("Lỗi khi xóa thông tin học sinh:", error);
    }
  }, []);

  const updateStats = useCallback(async (stats: { xp?: number; streak?: number; avgWpm?: number; avgAccuracy?: number }) => {
    try {
      // 1. Cập nhật local storage & state
      if (stats.xp !== undefined) {
        localStorage.setItem('typing_xp', String(stats.xp));
        setXp(stats.xp);
      }
      if (stats.streak !== undefined) {
        localStorage.setItem('typing_streak', String(stats.streak));
        setStreak(stats.streak);
      }
      if (stats.avgWpm !== undefined) {
        localStorage.setItem('typing_avg_wpm', String(stats.avgWpm));
        setAvgWpm(stats.avgWpm);
      }
      if (stats.avgAccuracy !== undefined) {
        localStorage.setItem('typing_avg_accuracy', String(stats.avgAccuracy));
        setAvgAccuracy(stats.avgAccuracy);
      }

      // 2. Đồng bộ lên database trực tiếp (fallback)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const updates: any = {
          id: session.user.id,
          updated_at: new Date().toISOString()
        };
        if (stats.xp !== undefined) updates.xp = stats.xp;
        if (stats.streak !== undefined) updates.streak = stats.streak;
        if (stats.avgWpm !== undefined) updates.avg_wpm = stats.avgWpm;
        if (stats.avgAccuracy !== undefined) updates.avg_accuracy = stats.avgAccuracy;

        const { error } = await supabase
          .from('student_profiles')
          .upsert(updates);
        
        if (error) {
          console.error("Lỗi đồng bộ các chỉ số stats lên database:", error);
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật các chỉ số stats:", error);
    }
  }, []);

  const unlockBadge = useCallback(async (badgeId: string) => {
    try {
      localStorage.setItem(`viettyping_badge_${badgeId}`, 'true');
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase
          .from('student_badges')
          .upsert({
            student_id: session.user.id,
            badge_id: badgeId,
            unlocked_at: new Date().toISOString()
          }, {
            onConflict: 'student_id,badge_id'
          });
        
        if (error) {
          console.error("Lỗi đồng bộ huy hiệu lên database:", error);
        }
      }
    } catch (error) {
      console.error("Lỗi cập nhật huy hiệu:", error);
    }
  }, []);

  // Thêm tiến trình bài học mới vào hàng đợi đồng bộ và kích hoạt đồng bộ hóa ngầm
  const queueProgress = useCallback(async (lessonId: string, score: number, wpm: number, accuracy: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const studentId = session?.user?.id || "local-student";

      // 1. Thêm vào hàng đợi LocalStorage
      addToSyncQueue(studentId, lessonId, score, wpm, accuracy);
      const queue = getSyncQueue();
      setQueueLength(queue.length);

      // 2. Cập nhật cục bộ lập tức (Optimistic Update)
      const earnedXP = lessonId === "turtle_rescue" ? 300 : (score >= 90 ? 150 : 100);
      const currentXP = parseInt(localStorage.getItem("typing_xp") || "0", 10);
      const newXP = currentXP + earnedXP;
      localStorage.setItem("typing_xp", String(newXP));
      setXp(newXP);

      const savedStreak = parseInt(localStorage.getItem("typing_streak") || "0", 10);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh";
      const lastActiveDateStr = localStorage.getItem("typing_last_active_date");
      const currentDateStr = new Date().toLocaleDateString("en-CA", { timeZone: timezone });
      let newStreak = savedStreak;
      
      if (lastActiveDateStr !== currentDateStr) {
        newStreak = savedStreak === 0 ? 1 : savedStreak + 1;
        // Kiểm tra xem có bị ngắt chuỗi học lâu không để reset (tính nháp ở client)
        if (lastActiveDateStr) {
          const [ly, lm, ld] = lastActiveDateStr.split("-").map(Number);
          const lastActiveMidnight = new Date(Date.UTC(ly, lm - 1, ld));
          const [cy, cm, cd] = currentDateStr.split("-").map(Number);
          const currentMidnight = new Date(Date.UTC(cy, cm - 1, cd));
          const diffTime = currentMidnight.getTime() - lastActiveMidnight.getTime();
          const daysDiff = Math.round(diffTime / (1000 * 60 * 60 * 24));
          if (daysDiff >= 2) {
            newStreak = 1;
          }
        }
        localStorage.setItem("typing_streak", String(newStreak));
        localStorage.setItem("typing_last_active_date", currentDateStr);
        setStreak(newStreak);
      }

      // Cập nhật trung bình wpm/accuracy cục bộ
      const totalLessons = parseInt(localStorage.getItem("typing_total_lessons") || "0", 10) + 1;
      localStorage.setItem("typing_total_lessons", String(totalLessons));

      const savedWpm = parseFloat(localStorage.getItem("typing_avg_wpm") || "0");
      const savedAcc = parseFloat(localStorage.getItem("typing_avg_accuracy") || "0");
      const newAvgWpm = wpm > 0 ? Math.round((savedWpm * (totalLessons - 1) + wpm) / totalLessons) : savedWpm;
      const newAvgAcc = Math.round((savedAcc * (totalLessons - 1) + accuracy) / totalLessons);
      
      localStorage.setItem("typing_avg_wpm", String(newAvgWpm));
      localStorage.setItem("typing_avg_accuracy", String(newAvgAcc));
      setAvgWpm(newAvgWpm);
      setAvgAccuracy(newAvgAcc);

      // Mở khóa các Badge cục bộ
      if (score === 100) localStorage.setItem("viettyping_badge_accuracy_100", "true");
      if (wpm >= 10) localStorage.setItem("viettyping_badge_speed_10", "true");
      if (wpm >= 20) localStorage.setItem("viettyping_badge_speed_20", "true");
      if (wpm >= 30) localStorage.setItem("viettyping_badge_speed_30", "true");
      if (wpm >= 40) localStorage.setItem("viettyping_badge_speed_40", "true");
      if (wpm >= 50) localStorage.setItem("viettyping_badge_speed_50", "true");
      if (lessonId === "turtle_rescue") localStorage.setItem("viettyping_badge_turtle_rescue", "true");

      // 3. Kích hoạt đồng bộ hóa ngầm
      setTimeout(() => {
        syncQueueLocally();
      }, 300);

    } catch (e) {
      console.error("Lỗi khi thêm bài học vào hàng đợi:", e);
    }
  }, [syncQueueLocally]);

  const isConfigured = studentInfo !== null && studentInfo.nickname.trim() !== "";

  return (
    <StudentContext.Provider
      value={{
        studentInfo,
        isConfigured,
        isOpenConfig,
        isLoaded,
        xp,
        streak,
        avgWpm,
        avgAccuracy,
        isSyncing,
        syncError,
        lastSyncedAt,
        queueLength,
        updateStudentInfo,
        setIsOpenConfig,
        clearStudentInfo,
        updateStats,
        unlockBadge,
        queueProgress,
        syncQueueLocally
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
