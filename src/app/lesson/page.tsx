'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';
import { useSubjects } from '@/contexts/SubjectsContext';
import { useSound } from '@/contexts/SoundContext';
import { useStudent } from '@/contexts/StudentContext';
import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, ChevronRight } from 'lucide-react';
import VisualWorldBackground from '@/components/VisualWorldBackground';

export default function LessonPage() {
  const router = useRouter();
  const { playSound } = useSound();
  const { studentInfo } = useStudent();
  const { progress, isLoaded } = useProgress();
  const { subjects } = useSubjects();

  // Tính toán tiến trình học tập của từng môn học
  const subjectProgresses = useMemo(() => {
    if (!isLoaded) return {};
    
    const progresses: Record<string, { percent: number; completed: number; total: number }> = {};
    
    subjects.forEach((subject) => {
      let totalActivities = 0;
      let completedActivities = 0;
      
      subject.topics.forEach((topic) => {
        topic.activities.forEach((activity) => {
          totalActivities++;
          if (progress[activity.id]) {
            completedActivities++;
          }
        });
      });
      
      progresses[subject.id] = {
        percent: totalActivities === 0 ? 0 : Math.round((completedActivities / totalActivities) * 100),
        completed: completedActivities,
        total: totalActivities
      };
    });
    
    return progresses;
  }, [progress, isLoaded]);

  const handleSubjectClick = (subjectId: string) => {
    playSound('click');
    router.push(`/subjects/${subjectId}`);
  };

  return (
    <VisualWorldBackground>
      <div className="min-h-screen text-[var(--color-foreground)] flex flex-col pb-16 relative z-10">
        
        {/* Thanh Điều hướng Header tối giản */}
        <header className="sticky top-0 z-30 bg-[var(--color-surface)] border-b-4 border-[var(--color-foreground)] px-4 md:px-6 py-4 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => playSound('click')}
              className="w-10 h-10 rounded-xl border-2 border-[var(--color-foreground)] bg-[var(--color-surface)] flex items-center justify-center shadow-[2px_2px_0px_0px_var(--color-foreground)] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              title="Quay lại trang chủ"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg md:text-xl font-black uppercase tracking-wide">
              LỚP HỌC KỲ THÚ CỦA BÉ
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-black bg-[var(--color-accent)] border border-[var(--color-foreground)] px-3 py-1.5 rounded-xl shadow-[1.5px_1.5px_0px_0px_var(--color-foreground)]">
              Con: <span className="text-[var(--color-primary-depth)] font-extrabold">{studentInfo ? studentInfo.nickname : 'Khoai Tây'}</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full space-y-8 overflow-y-auto">
          {/* Banner Chào Mừng */}
          <div className="bg-[var(--color-surface)] border-2 border-[var(--color-foreground)] rounded-[24px] shadow-[4px_4px_0px_0px_var(--color-foreground)] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-amber-100 text-amber-700 border-2 border-[var(--color-foreground)] px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_var(--color-foreground)]">
                LỰA CHỌN MÔN HỌC
              </span>
              <h2 className="text-2xl md:text-3xl font-black mt-2">
                Hôm nay bé muốn học môn gì nào?
              </h2>
              <p className="text-sm font-semibold opacity-85 leading-relaxed max-w-xl">
                Mỗi môn học là một hòn đảo kỳ diệu đang chờ bé khám phá. Vừa học gõ phím nhanh vừa làm quen với nhiều bài học bổ ích nhé!
              </p>
            </div>
            <div className="text-6xl animate-bounce shrink-0 hidden md:block" style={{ animationDuration: '4s' }}>
              🎒
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="space-y-4">
            <h3 className="text-xl font-black flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[var(--color-primary-depth)]" />
              <span>Chọn Môn Học</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjects.map((subject, index) => {
                const prog = subjectProgresses[subject.id] || { percent: 0, completed: 0, total: 0 };
                
                return (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSubjectClick(subject.id)}
                    className="bg-[var(--color-surface)] border-3 border-[var(--color-foreground)] rounded-[24px] p-6 shadow-[4px_4px_0px_0px_var(--color-foreground)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--color-foreground)] transition-all cursor-pointer flex flex-col justify-between h-[180px]"
                  >
                    <div className="flex justify-between items-start gap-4">
                      {/* Icon & Name */}
                      <div className="flex items-center gap-3">
                        <span className="text-3xl bg-[var(--color-background)] p-3 rounded-2xl border-2 border-[var(--color-foreground)] shadow-[2.5px_2.5px_0px_0px_var(--color-foreground)]">
                          {subject.icon}
                        </span>
                        <div>
                          <h4 className="font-black text-lg text-[var(--color-foreground)]">
                            {subject.name}
                          </h4>
                          <span className="text-[10px] font-black text-slate-500 uppercase">
                            {subject.grade || 'Lớp 1-5'}
                          </span>
                        </div>
                      </div>

                      {/* Progress Badge */}
                      <span className="bg-yellow-50 text-yellow-800 border border-[var(--color-foreground)] text-[9px] font-black px-2 py-0.5 rounded-full shadow-[1px_1px_0px_0px_var(--color-foreground)]">
                        {prog.percent}% hoàn thành
                      </span>
                    </div>

                    {/* Progress Bar & CTA */}
                    <div className="space-y-3 mt-4">
                      <div className="w-full bg-[var(--color-background)] border-2 border-[var(--color-foreground)] rounded-full h-4 p-0.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${subject.color}`}
                          style={{ width: `${prog.percent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-xs font-black">
                        <span className="text-slate-500">
                          {prog.completed}/{prog.total} bài tập
                        </span>
                        <span className="text-[var(--color-primary-depth)] flex items-center gap-0.5 hover:underline">
                          Học ngay <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </VisualWorldBackground>
  );
}
