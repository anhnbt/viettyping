'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { subjects } from '@/data/subjects';
import ActivityView from '@/components/ActivityView';
import Link from 'next/link';

interface Props {
  params: Promise<{
    subjectId: string;
    topicId: string;
  }>;
}

export default function TopicPage({ params }: Props) {
  const resolvedParams = React.use(params);
  const subject = subjects.find((s) => s.id === resolvedParams.subjectId);
  const topic = subject?.topics.find((t) => t.id === resolvedParams.topicId);

  if (!subject || !topic) {
    notFound();
  }

  const handleActivityComplete = (activityId: string, score: number) => {
    console.log(`Activity ${activityId} completed with score: ${score}`);
    // Có thể lưu progress vào localStorage hoặc database
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-gray-50">
      <ActivityView topic={topic} onComplete={handleActivityComplete} />
    </main>
  );
}
