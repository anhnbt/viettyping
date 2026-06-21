'use client';

import React from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useSubjects } from '@/contexts/SubjectsContext';
import TopicSelector from '@/components/TopicSelector';

interface Props {
  params: Promise<{
    subjectId: string;
  }>;
}

export default function SubjectPage({ params }: Props) {
  const router = useRouter();
  const { subjects, isLoading } = useSubjects();
  const resolvedParams = React.use(params);
  const subject = subjects.find((s) => s.id === resolvedParams.subjectId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-cream">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!subject) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <TopicSelector
        subject={subject}
        onSelectTopic={(topic) => {
          router.push(`/subjects/${subject.id}/topics/${topic.id}`);
        }}
      />
    </main>
  );
}
