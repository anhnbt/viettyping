import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export interface ActivityProgress {
  score: number;
  timestamp: number;
}

export interface UserProgress {
  [activityId: string]: ActivityProgress;
}

const STORAGE_KEY = 'kids_learning_progress';

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      // 1. Load progress from localStorage on mount first for speed
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      let localProgress: UserProgress = {};
      if (savedProgress) {
        try {
          localProgress = JSON.parse(savedProgress);
          setProgress(localProgress);
        } catch (error) {
          console.error('Failed to parse progress from localStorage:', error);
        }
      }

      try {
        // 2. Load progress from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userId = session.user.id;
          const { data: dbProgress, error } = await supabase
            .from('student_progress')
            .select('activity_id, score, completed_at')
            .eq('student_id', userId);

          if (error) throw error;

          if (dbProgress && dbProgress.length > 0) {
            const merged: UserProgress = { ...localProgress };
            dbProgress.forEach((item) => {
              merged[item.activity_id] = {
                score: item.score,
                timestamp: new Date(item.completed_at).getTime(),
              };
            });
            setProgress(merged);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } else if (Object.keys(localProgress).length > 0) {
            // Đồng bộ dữ liệu local lên DB nếu DB trống
            const insertData = Object.entries(localProgress).map(([activityId, val]) => ({
              student_id: userId,
              activity_id: activityId,
              score: val.score,
              completed_at: new Date(val.timestamp).toISOString(),
            }));

            const { error: insertError } = await supabase
              .from('student_progress')
              .insert(insertData);
            
            if (insertError) {
              console.error('Lỗi khi đồng bộ tiến trình học tập lên DB:', insertError);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load progress from Supabase:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadProgress();
  }, []);

  const saveProgress = async (activityId: string, score: number) => {
    // 1. Cập nhật local state và localStorage
    const timestamp = Date.now();
    setProgress((prev) => {
      const newProgress = {
        ...prev,
        [activityId]: {
          score,
          timestamp,
        },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      return newProgress;
    });

    // 2. Đồng bộ lên database
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase
          .from('student_progress')
          .upsert({
            student_id: session.user.id,
            activity_id: activityId,
            score,
            completed_at: new Date(timestamp).toISOString(),
          }, {
            onConflict: 'student_id,activity_id'
          });
        
        if (error) {
          console.error('Failed to sync progress to Supabase:', error);
        }
      }
    } catch (err) {
      console.error('Error saving progress to Supabase:', err);
    }
  };

  const getProgress = (activityId: string): ActivityProgress | undefined => {
    return progress[activityId];
  };

  const isActivityCompleted = (activityId: string): boolean => {
    return !!progress[activityId];
  };

  const getTopicProgress = (activityIds: string[]): number => {
    if (activityIds.length === 0) return 0;
    const completedCount = activityIds.filter((id) => !!progress[id]).length;
    return Math.round((completedCount / activityIds.length) * 100);
  };

  const clearTopicProgress = async (activityIds: string[]) => {
    setProgress((prev) => {
      const newProgress = { ...prev };
      activityIds.forEach((id) => delete newProgress[id]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      return newProgress;
    });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase
          .from('student_progress')
          .delete()
          .eq('student_id', session.user.id)
          .in('activity_id', activityIds);
        
        if (error) {
          console.error('Failed to clear progress on Supabase:', error);
        }
      }
    } catch (err) {
      console.error('Error clearing progress on Supabase:', err);
    }
  };

  return {
    progress,
    isLoaded,
    saveProgress,
    getProgress,
    isActivityCompleted,
    getTopicProgress,
    clearTopicProgress,
  };
};
