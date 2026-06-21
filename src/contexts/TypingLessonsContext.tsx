"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lesson } from '@/types/lesson';
import { supabase } from '@/utils/supabase';
import { lessons as staticLessons } from '@/data/lessons';

interface TypingLessonsContextType {
  lessons: Lesson[];
  isLoading: boolean;
  error: Error | null;
  reloadLessons: () => Promise<void>;
}

const TypingLessonsContext = createContext<TypingLessonsContextType | undefined>(undefined);

export function TypingLessonsProvider({ children }: { children: ReactNode }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: supabaseError } = await supabase
        .from('lessons')
        .select('id, level, title, description, content, targetWPM:target_wpm, minAccuracy:min_accuracy')
        .order('sort_order', { ascending: true });

      if (supabaseError) throw supabaseError;

      if (data && data.length > 0) {
        const formattedLessons: Lesson[] = data.map((item: any) => ({
          id: item.id,
          level: item.level as 'basic' | 'intermediate' | 'advanced',
          title: item.title,
          description: item.description || '',
          content: item.content,
          targetWPM: item.targetWPM,
          minAccuracy: item.minAccuracy,
        }));
        setLessons(formattedLessons);
      } else {
        console.warn('Không tìm thấy dữ liệu bài học luyện gõ trên database, đang sử dụng dữ liệu tĩnh fallback.');
        setLessons(staticLessons);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài học luyện gõ phím từ database, sử dụng dữ liệu tĩnh fallback:', err);
      setLessons(staticLessons);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return (
    <TypingLessonsContext.Provider value={{ lessons, isLoading, error, reloadLessons: fetchLessons }}>
      {children}
    </TypingLessonsContext.Provider>
  );
}

export function useTypingLessons() {
  const context = useContext(TypingLessonsContext);
  if (context === undefined) {
    throw new Error("useTypingLessons must be used within a TypingLessonsProvider");
  }
  return context;
}
