'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { useSubjects } from '@/contexts/SubjectsContext';
import { useProgress } from '@/hooks/useProgress';
import { useStudent } from '@/contexts/StudentContext';
import LessonCoordinator from '@/components/lesson/LessonCoordinator';

interface Props {
  params: Promise<{
    subjectId: string;
    topicId: string;
  }>;
}

export default function TopicPage({ params }: Props) {
  const resolvedParams = React.use(params);
  const { subjects, isLoading } = useSubjects();
  const { saveProgress } = useProgress();
  const { studentInfo, xp, queueProgress, unlockBadge } = useStudent();
  
  const subject = subjects.find((s) => s.id === resolvedParams.subjectId);
  const topic = subject?.topics.find((t) => t.id === resolvedParams.topicId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-cream">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!subject || !topic) {
    notFound();
  }

  const handleActivityComplete = (activityId: string, telemetry: any) => {
    console.log(`Activity ${activityId} completed:`, telemetry);
    // Lưu tiến độ hoạt động lên local và Supabase
    saveProgress(activityId, telemetry.score);
  };

  const handleAllActivitiesComplete = (summary: any) => {
    console.log('All activities complete! Summary:', summary);
    
    // Tính toán độ chính xác và WPM trung bình
    const typingResults = summary.activityResults.filter((r: any) => r.type === 'typing_practice');
    const totalAccuracy = summary.activityResults.reduce((acc: number, r: any) => acc + r.score, 0);
    const avgAccuracy = Math.round(totalAccuracy / summary.activityResults.length);
    
    let totalWpm = 0;
    let typingCount = 0;
    typingResults.forEach((r: any) => {
      if (r.errors?.wpm) {
        totalWpm += r.errors.wpm;
        typingCount++;
      }
    });
    
    const avgWpm = typingCount > 0 ? Math.round(totalWpm / typingCount) : 12; // fallback wpm mặc định cho bé

    // Đẩy tiến độ học tập vào hàng đợi đồng bộ offline-first & gamification
    queueProgress(topic.id, avgAccuracy, avgWpm, avgAccuracy);

    // Mở khóa huy hiệu nếu có cấu hình phần thưởng
    const badgeUnlockId = `badge_${topic.id}`;
    unlockBadge(badgeUnlockId);
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-soft-cream">
      <LessonCoordinator
        topicConfig={topic}
        studentNickname={studentInfo?.nickname || "Bé"}
        currentXP={xp}
        onActivityComplete={handleActivityComplete}
        onAllActivitiesComplete={handleAllActivitiesComplete}
        backUrl={`/subjects/${subject.id}`}
      />
    </main>
  );
}
