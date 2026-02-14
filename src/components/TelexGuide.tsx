'use client';

import React, { useState } from 'react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

const TONE_MARKS = [
    { key: 's', mark: 'Sắc', example: 'as → á' },
    { key: 'f', mark: 'Huyền', example: 'af → à' },
    { key: 'r', mark: 'Hỏi', example: 'ar → ả' },
    { key: 'x', mark: 'Ngã', example: 'ax → ã' },
    { key: 'j', mark: 'Nặng', example: 'aj → ạ' },
    { key: 'z', mark: 'Xoá dấu', example: 'ás + z → as' },
];

const SPECIAL_CHARS = [
    { key: 'aa', result: 'â' },
    { key: 'aw', result: 'ă' },
    { key: 'ee', result: 'ê' },
    { key: 'oo', result: 'ô' },
    { key: 'ow', result: 'ơ' },
    { key: 'uw', result: 'ư' },
    { key: 'dd', result: 'đ' },
    { key: 'w', result: 'ư (đơn lẻ)' },
];

export default function TelexGuide() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden transition-all duration-300">
            {/* Toggle Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-amber-100/60 transition-colors"
            >
                <span className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                    <span className="text-base">⌨️</span>
                    Hướng dẫn gõ TELEX
                </span>
                {isOpen ? (
                    <IoChevronUp className="text-amber-600 text-sm" />
                ) : (
                    <IoChevronDown className="text-amber-600 text-sm" />
                )}
            </button>

            {/* Collapsible Content */}
            {isOpen && (
                <div className="px-4 pb-4 space-y-3 animate-fade-in">
                    {/* Tone Marks Table */}
                    <div>
                        <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">
                            Dấu thanh
                        </h4>
                        <div className="grid grid-cols-1 gap-1">
                            {TONE_MARKS.map(({ key, mark, example }) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-2 text-xs bg-white/70 rounded-lg px-3 py-1.5"
                                >
                                    <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-gray-100 border border-gray-300 rounded text-[11px] font-mono font-bold text-gray-700 shadow-sm">
                                        {key}
                                    </kbd>
                                    <span className="text-gray-700 font-medium">{mark}</span>
                                    <span className="text-gray-400 ml-auto font-mono text-[11px]">{example}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Special Characters Table */}
                    <div>
                        <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1.5">
                            Chữ đặc biệt
                        </h4>
                        <div className="grid grid-cols-2 gap-1">
                            {SPECIAL_CHARS.map(({ key, result }) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-2 text-xs bg-white/70 rounded-lg px-3 py-1.5"
                                >
                                    <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-gray-100 border border-gray-300 rounded text-[11px] font-mono font-bold text-gray-700 shadow-sm">
                                        {key}
                                    </kbd>
                                    <span className="text-gray-600">→</span>
                                    <span className="text-gray-700 font-bold">{result}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Source Link */}
                    <p className="text-[10px] text-amber-600/70 text-right">
                        Nguồn:{' '}
                        <a
                            href="https://www.unikey.org/support/ukmanual.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-amber-700"
                        >
                            unikey.org
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}
