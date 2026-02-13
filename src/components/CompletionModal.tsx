'use client';

import React from 'react';
import { IoStar, IoStarOutline, IoRefreshOutline, IoArrowForward } from 'react-icons/io5';

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

export default function CompletionModal({
    isOpen,
    stats,
    onRestart,
    onContinue,
    continueLabel = 'Tiếp tục',
}: CompletionModalProps) {
    if (!isOpen) return null;

    const calculateStars = (acc: number) => {
        if (acc >= 90) return 3;
        if (acc >= 70) return 2;
        if (acc >= 50) return 1;
        return 0;
    };

    const stars = calculateStars(stats.accuracy);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 transform animate-bounce-in">
                {/* Stars */}
                <div className="flex justify-center gap-3 mb-6">
                    {[1, 2, 3].map((star) => (
                        <span
                            key={star}
                            className="text-5xl filter drop-shadow-md transition-all hover:scale-110 transform"
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
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {stars === 3
                        ? 'Tuyệt vời! Con làm tốt lắm! 🎉'
                        : stars === 2
                            ? 'Rất tốt! Cố gắng thêm chút nữa nhé! 🌟'
                            : 'Cố lên! Con làm được mà! 💪'}
                </h3>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="bg-green-50 border border-green-100 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Tốc độ</p>
                        <p className="text-xl font-bold text-green-600">{stats.wpm}</p>
                        <p className="text-xs text-gray-400">WPM</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Chính xác</p>
                        <p className="text-xl font-bold text-blue-600">{stats.accuracy}%</p>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Số lỗi</p>
                        <p className="text-xl font-bold text-red-500">{stats.incorrectCount}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
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
