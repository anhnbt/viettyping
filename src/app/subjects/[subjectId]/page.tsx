'use client';

import React from 'react';
import { notFound, useRouter } from 'next/navigation';
import { subjects } from '@/data/subjects';
import TopicSelector from '@/components/TopicSelector';

interface Props {
  params: Promise<{
    subjectId: string;
  }>;
}

export default function SubjectPage({ params }: Props) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const subject = subjects.find((s) => s.id === resolvedParams.subjectId);

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
