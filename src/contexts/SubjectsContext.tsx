"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Subject } from '@/types/subject';
import { supabase } from '@/utils/supabase';
import { subjects as staticSubjects } from '@/data/subjects';

interface SubjectsContextType {
  subjects: Subject[];
  isLoading: boolean;
}

const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // Query subjects + topics + activities lồng nhau, map camelCase và sắp xếp theo sort_order
        const { data, error } = await supabase
          .from('subjects')
          .select(`
            id, name, description, icon, color, grade, thumbnailUrl:thumbnail_url,
            topics (
              id, title, description, difficulty, estimatedTime:estimated_time, content, sort_order,
              activities (
                id, type, title, content, instructions, targetScore:target_score, timeLimit:time_limit, options, correctAnswer:correct_answer, imageUrl:image_url, data, sort_order
              )
            )
          `)
          .order('id')
          .order('sort_order', { foreignTable: 'topics', ascending: true })
          .order('sort_order', { foreignTable: 'topics.activities', ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          // Map và định dạng chính xác kiểu dữ liệu Subject
          const formattedSubjects: Subject[] = data.map((subj: any) => ({
            id: subj.id,
            name: subj.name,
            description: subj.description || '',
            icon: subj.icon || '',
            color: subj.color || '',
            grade: subj.grade || '',
            thumbnailUrl: subj.thumbnailUrl || '',
            topics: (subj.topics || []).map((topic: any) => ({
              id: topic.id,
              title: topic.title,
              description: topic.description || '',
              difficulty: topic.difficulty || 'easy',
              estimatedTime: topic.estimatedTime || 15,
              content: topic.content || '',
              activities: (topic.activities || []).map((act: any) => ({
                id: act.id,
                type: act.type,
                title: act.title,
                content: act.content || '',
                instructions: act.instructions || '',
                targetScore: act.targetScore || undefined,
                timeLimit: act.timeLimit || undefined,
                options: act.options || undefined,
                correctAnswer: act.correctAnswer || undefined,
                imageUrl: act.imageUrl || undefined,
                data: act.data || undefined
              }))
            }))
          }));
          setSubjects(formattedSubjects);
        } else {
          // Nếu DB chưa có dữ liệu, dùng dữ liệu tĩnh
          setSubjects(staticSubjects);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách môn học từ database, đang sử dụng dữ liệu tĩnh fallback:", error);
        setSubjects(staticSubjects);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <SubjectsContext.Provider value={{ subjects, isLoading }}>
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (context === undefined) {
    throw new Error("useSubjects must be used within a SubjectsProvider");
  }
  return context;
}
