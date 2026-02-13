'use client';

import React, { useState, useCallback } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { subjects } from '@/data/subjects';
import TypingPractice from '@/components/TypingPractice';
import CompletionModal from '@/components/CompletionModal';
import { IoArrowBack } from 'react-icons/io5';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';

interface Props {
    params: Promise<{
        subjectId: string;
        topicId: string;
    }>;
}

interface Stats {
    wpm: number;
    accuracy: number;
    incorrectCount: number;
}

export default function PracticePage({ params }: Props) {
    const router = useRouter();
    const resolvedParams = React.use(params);
    const { subjectId, topicId } = resolvedParams;

    const subject = subjects.find((s) => s.id === subjectId);
    const topic = subject?.topics.find((t) => t.id === topicId);

    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [stats, setStats] = useState<Stats | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { saveProgress } = useProgress();

    if (!subject || !topic) {
        notFound();
    }

    // Filter only typing activities
    const typingActivities = topic.activities.filter((a) => a.type === 'typing');
    const currentActivity = typingActivities[currentActivityIndex];

    if (!currentActivity) {
        notFound();
    }

    const lesson = {
        id: currentActivity.id,
        level: 'basic' as const,
        title: currentActivity.title,
        description: currentActivity.instructions,
        content: currentActivity.content,
        targetWPM: 20,
        minAccuracy: 85,
    };

    const handleComplete = useCallback((newStats: Stats) => {
        setStats(newStats);
        setShowModal(true);
        saveProgress(currentActivity.id, newStats.accuracy);
    }, [currentActivity.id, saveProgress]);

    const handleRestart = useCallback(() => {
        setShowModal(false);
        setStats(null);
        // Force re-render by toggling index
        setCurrentActivityIndex((prev) => prev);
    }, []);

    const handleContinue = useCallback(() => {
        setShowModal(false);
        setStats(null);
        if (currentActivityIndex < typingActivities.length - 1) {
            setCurrentActivityIndex((prev) => prev + 1);
        } else {
            // All typing activities done, go back to topic
            router.push(`/subjects/${subjectId}/topics/${topicId}`);
        }
    }, [currentActivityIndex, typingActivities.length, router, subjectId, topicId]);

    const topicUrl = `/subjects/${subjectId}/topics/${topicId}`;

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
            {/* Header */}
            <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <Link
                        href={topicUrl}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Quay lại"
                    >
                        <IoArrowBack className="text-xl" />
                    </Link>
                    <div>
                        <h1 className="text-sm font-bold text-gray-800 leading-tight">
                            {currentActivity.title}
                        </h1>
                        <p className="text-xs text-gray-500">
                            {topic.title} • {currentActivityIndex + 1}/{typingActivities.length}
                        </p>
                    </div>
                </div>
            </header>

            {/* Practice Area */}
            <div className="flex-1 overflow-hidden p-4">
                <div className="w-full h-full">
                    <TypingPractice
                        key={currentActivityIndex}
                        lesson={lesson}
                        onComplete={handleComplete}
                    />
                </div>
            </div>

            {/* Completion Modal */}
            {stats && (
                <CompletionModal
                    isOpen={showModal}
                    stats={stats}
                    onRestart={handleRestart}
                    onContinue={handleContinue}
                    continueLabel={
                        currentActivityIndex < typingActivities.length - 1
                            ? 'Bài tiếp theo'
                            : 'Quay lại chủ đề'
                    }
                />
            )}
        </div>
    );
}
