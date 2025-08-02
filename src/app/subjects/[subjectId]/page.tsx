'use client';

import React from 'react';
import { notFound, useRouter } from 'next/navigation';
import { subjects } from '@/data/subjects';
import TopicSelector from '@/components/TopicSelector';
import Link from 'next/link';

interface Props {
  params: {
    subjectId: string;
  };
}

export default function SubjectPage({ params }: Props) {
  const router = useRouter();
  const subject = subjects.find((s) => s.id === params.subjectId);

  if (!subject) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-medium transition-colors bg-blue-500 text-white"
          >
            📚 Học các môn
          </Link>
          <Link
            href="/typing"
            className="px-6 py-3 rounded-lg font-medium transition-colors bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
          >
            ⌨️ Luyện gõ phím
          </Link>
        </div>
      </div>

      <TopicSelector
        subject={subject}
        onSelectTopic={(topic) => {
          router.push(`/subjects/${subject.id}/topics/${topic.id}`);
        }}
      />
    </main>
  );
}
