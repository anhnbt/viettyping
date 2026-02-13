'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { IoStar, IoStarOutline, IoRefreshOutline, IoArrowForward, IoTrophy } from 'react-icons/io5';
import { useSound } from '@/contexts/SoundContext';
import confetti from 'canvas-confetti';

interface CompletionModalProps {
    isOpen: boolean;
    stats: {
        wpm: number;
        accuracy: number;
        incorrectCount: number;
    };
    onRestart: () => void;
    onContinue: () => void;
    continueLabel?: string;
}

function calculateScore(wpm: number, accuracy: number, incorrectCount: number): number {
    // Score formula: base = wpm * accuracy factor, scaled to 1000-9999 range
    const accuracyFactor = accuracy / 100;
    const base = wpm * accuracyFactor * 100;
    const errorPenalty = incorrectCount * 50;
    const raw = Math.round(base - errorPenalty);
    return Math.max(1000, Math.min(9999, raw + 1000));
}

export default function CompletionModal({
    isOpen,
    stats,
    onRestart,
    onContinue,
    continueLabel = 'Tiếp tục',
}: CompletionModalProps) {
    const { playSound } = useSound();
    const [displayScore, setDisplayScore] = useState(0);
    const [isCountingDone, setIsCountingDone] = useState(false);
    const [showStars, setShowStars] = useState(false);
    const animFrameRef = useRef<number>(0);
    const hasPlayedTada = useRef(false);

    const finalScore = calculateScore(stats.wpm, stats.accuracy, stats.incorrectCount);

    const calculateStars = (acc: number) => {
        if (acc >= 90) return 3;
        if (acc >= 70) return 2;
        if (acc >= 50) return 1;
        return 0;
    };

    const stars = calculateStars(stats.accuracy);

    // Fire confetti
    const fireConfetti = useCallback(() => {
        const colors = ['#ff0a54', '#ff477e', '#ff7096', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];

        // Side cannons
        const duration = 2000;
        const end = Date.now() + duration;
        const frame = () => {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();

        // Big burst
        confetti({
            particleCount: 100, spread: 100, origin: { y: 0.6 }, colors,
            startVelocity: 35, gravity: 0.8, scalar: 1.2, ticks: 100,
        });
    }, []);

    // Counter animation
    useEffect(() => {
        if (!isOpen) {
            setDisplayScore(0);
            setIsCountingDone(false);
            setShowStars(false);
            hasPlayedTada.current = false;
            return;
        }

        const startTime = Date.now();
        const duration = 1800; // 1.8 seconds count-up
        let lastTickAt = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for decelerating effect
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentScore = Math.round(eased * finalScore);

            setDisplayScore(currentScore);

            // Play tick sound every 80ms
            if (elapsed - lastTickAt > 80 && progress < 1) {
                playSound('tick');
                lastTickAt = elapsed;
            }

            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayScore(finalScore);
                setIsCountingDone(true);

                // Tada + confetti when counter finishes
                if (!hasPlayedTada.current) {
                    hasPlayedTada.current = true;
                    playSound('tada');
                    fireConfetti();
                }

                // Show stars after a short delay
                setTimeout(() => setShowStars(true), 400);
            }
        };

        // Small delay before starting counter
        const timer = setTimeout(() => {
            animFrameRef.current = requestAnimationFrame(animate);
        }, 500);

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [isOpen, finalScore, playSound, fireConfetti]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-bounce-in">

                {/* Score Counter */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <IoTrophy className={`text-3xl transition-colors duration-500 ${isCountingDone ? 'text-yellow-500' : 'text-gray-300'}`} />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Điểm số</span>
                    </div>
                    <div className={`text-6xl font-black font-mono tabular-nums transition-all duration-300 ${isCountingDone ? 'text-amber-500 scale-110' : 'text-gray-700'}`}>
                        {displayScore.toLocaleString()}
                    </div>
                </div>

                {/* Stars - appear after counter */}
                <div className={`flex justify-center gap-3 mb-5 transition-all duration-500 ${showStars ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {[1, 2, 3].map((star) => (
                        <span
                            key={star}
                            className="text-5xl filter drop-shadow-md"
                            style={{
                                transitionDelay: `${star * 150}ms`,
                                transform: showStars ? 'scale(1)' : 'scale(0)',
                                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                        >
                            {star <= stars ? (
                                <IoStar className="text-yellow-400" />
                            ) : (
                                <IoStarOutline className="text-gray-300" />
                            )}
                        </span>
                    ))}
                </div>

                {/* Message */}
                <h3 className={`text-xl font-bold text-center mb-5 text-gray-800 transition-all duration-500 ${showStars ? 'opacity-100' : 'opacity-0'}`}>
                    {stars === 3
                        ? 'Tuyệt vời! Con làm tốt lắm! 🎉'
                        : stars === 2
                            ? 'Rất tốt! Cố gắng thêm chút nữa nhé! 🌟'
                            : 'Cố lên! Con làm được mà! 💪'}
                </h3>

                {/* Stats */}
                <div className={`grid grid-cols-3 gap-3 mb-6 transition-all duration-500 ${showStars ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-green-50 border border-green-100 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Tốc độ</p>
                        <p className="text-lg font-bold text-green-600">{stats.wpm}</p>
                        <p className="text-xs text-gray-400">WPM</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Chính xác</p>
                        <p className="text-lg font-bold text-blue-600">{stats.accuracy}%</p>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Số lỗi</p>
                        <p className="text-lg font-bold text-red-500">{stats.incorrectCount}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className={`flex gap-3 transition-all duration-500 ${showStars ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={onRestart}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                        <IoRefreshOutline className="text-lg" />
                        Làm lại
                    </button>
                    <button
                        onClick={onContinue}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                    >
                        {continueLabel}
                        <IoArrowForward className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
}
