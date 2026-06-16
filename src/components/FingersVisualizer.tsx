import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fingerMap } from './keyboardConstants';

interface Props {
  highlightKey: string | null;
  pressedKey: string | null;
}

const activeFingerColors: Record<string, { fill: string; stroke: string; dot: string }> = {
  'pinky-left': { fill: '#F87171', stroke: '#EF4444', dot: '#FFFFFF' }, // red-400
  'ring-left': { fill: '#FB923C', stroke: '#F97316', dot: '#FFFFFF' }, // orange-400
  'middle-left': { fill: '#FACC15', stroke: '#EAB308', dot: '#FFFFFF' }, // yellow-400
  'index-left': { fill: '#4ADE80', stroke: '#22C55E', dot: '#FFFFFF' }, // green-400
  'thumb': { fill: '#94A3B8', stroke: '#64748B', dot: '#FFFFFF' }, // slate-400
  'index-right': { fill: '#34D399', stroke: '#10B981', dot: '#FFFFFF' }, // emerald-400
  'middle-right': { fill: '#60A5FA', stroke: '#3B82F6', dot: '#FFFFFF' }, // blue-400
  'ring-right': { fill: '#818CF8', stroke: '#6366F1', dot: '#FFFFFF' }, // indigo-400
  'pinky-right': { fill: '#C084FC', stroke: '#A855F7', dot: '#FFFFFF' }, // purple-400
};

// Signature colors for fingertip dots when inactive
const signatureColors: Record<string, string> = {
  'pinky-left': '#EF4444',
  'ring-left': '#F97316',
  'middle-left': '#EAB308',
  'index-left': '#22C55E',
  'thumb': '#64748B',
  'index-right': '#10B981',
  'middle-right': '#3B82F6',
  'ring-right': '#6366F1',
  'pinky-right': '#A855F7',
};

// Colors optimized for text rendering to ensure high contrast on light backgrounds
const fingerTextColors: Record<string, string> = {
  'pinky-left': '#991B1B',   // red-800
  'ring-left': '#9A3412',    // orange-800
  'middle-left': '#854D0E',  // yellow-800
  'index-left': '#166534',   // green-800
  'thumb': '#374151',        // gray-700
  'index-right': '#065F46',  // emerald-800
  'middle-right': '#1E40AF', // blue-800
  'ring-right': '#3730A3',   // indigo-800
  'pinky-right': '#6B21A8',  // purple-800
};

const fingerBgColors: Record<string, string> = {
  'pinky-left': '#FEF2F2',   // red-50
  'ring-left': '#FFF7ED',    // orange-50
  'middle-left': '#FEFCE8',  // yellow-50
  'index-left': '#F0FDF4',   // green-50
  'thumb': '#F9FAFB',        // gray-50
  'index-right': '#ECFDF5',  // emerald-50
  'middle-right': '#EFF6FF', // blue-50
  'ring-right': '#EEF2FF',   // indigo-50
  'pinky-right': '#FAF5FF',  // purple-50
};

const fingerBorderColors: Record<string, string> = {
  'pinky-left': '#FCA5A5',   // red-300
  'ring-left': '#FED7AA',    // orange-300
  'middle-left': '#FEF08A',  // yellow-300
  'index-left': '#BBF7D0',   // green-300
  'thumb': '#E5E7EB',        // gray-200
  'index-right': '#A7F3D0',  // emerald-300
  'middle-right': '#BFDBFE', // blue-300
  'ring-right': '#C7D2FE',   // indigo-300
  'pinky-right': '#E9D5FF',  // purple-300
};

// Skin colors for resting state
const skinFill = '#FFF5F0';
const skinStroke = '#FCA5A5'; // rose-300

const shiftKeyMap: Record<string, string> = {
  '+': '=',
  '_': '-',
  ')': '0',
  '(': '9',
  '*': '8',
  '&': '7',
  '^': '6',
  '%': '5',
  '$': '4',
  '#': '3',
  '@': '2',
  '!': '1',
  '~': '`',
  '{': '[',
  '}': ']',
  '|': '\\',
  ':': ';',
  '"': '\'',
  '<': ',',
  '>': '.',
  '?': '/'
};

export default function FingersVisualizer({ highlightKey, pressedKey }: Props) {
  // Chuẩn hóa props thành string | null để tránh lỗi crash khi truyền kiểu số (number) hoặc đối tượng khác
  const highlightKeyStr = highlightKey !== null && highlightKey !== undefined ? String(highlightKey) : null;
  const pressedKeyStr = pressedKey !== null && pressedKey !== undefined ? String(pressedKey) : null;

  const getFingerName = (key: string | null): string | null => {
    if (!key) return null;
    const lowerKey = key.toLowerCase();
    if (lowerKey === ' ') return 'thumb';
    return fingerMap[lowerKey] || fingerMap[key] || null;
  };

  const activeFingers = React.useMemo(() => {
    if (!highlightKeyStr) return [];

    // Kiểm tra xem highlightKeyStr có phải là chữ viết hoa hoặc ký tự cần Shift
    const isShiftRequired = /[A-ZÀ-ỸĐ]/.test(highlightKeyStr) || highlightKeyStr in shiftKeyMap;

    if (isShiftRequired) {
      const baseChar = /[A-ZÀ-ỸĐ]/.test(highlightKeyStr)
        ? highlightKeyStr.toLowerCase()
        : shiftKeyMap[highlightKeyStr];

      const charFinger = fingerMap[baseChar];
      if (!charFinger) return [];

      const isLeftHand = charFinger.includes('left');
      const shiftFinger = isLeftHand ? 'pinky-right' : 'pinky-left';

      return [charFinger, shiftFinger];
    }

    const lowerChar = highlightKeyStr.toLowerCase();
    if (lowerChar === ' ') return ['thumb'];
    const finger = fingerMap[lowerChar] || fingerMap[highlightKeyStr] || null;
    return finger ? [finger] : [];
  }, [highlightKeyStr]);

  const pressedFinger = getFingerName(pressedKeyStr);

  const renderFinger = (
    fingerId: string,
    x: number,
    y: number,
    width: number,
    height: number,
    rx: number,
    transform?: string
  ) => {
    const isActive = activeFingers.includes(fingerId);
    const isPressed = pressedFinger === fingerId;

    // Determine styles
    const fill = isActive || isPressed ? activeFingerColors[fingerId].fill : skinFill;
    const stroke = isActive || isPressed ? activeFingerColors[fingerId].stroke : skinStroke;
    const dotColor = isActive || isPressed ? '#FFFFFF' : signatureColors[fingerId];

    const tipX = x + width / 2;
    const tipY = y + rx;

    return (
      <g key={fingerId} transform={transform}>
        <motion.g
          className="transition-all duration-300"
          animate={isPressed ? {
            y: 4,
            scale: 0.96,
          } : isActive ? {
            y: [0, -8, 0],
            scale: [1, 1.03, 1],
          } : {
            y: 0,
            scale: 1,
          }}
          transition={isPressed ? { duration: 0.05 } : isActive ? {
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          } : { duration: 0.2 }}
          style={{ transformOrigin: `${x + width / 2}px ${y + height}px` }}
        >
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={rx}
            fill={fill}
            stroke={stroke}
            strokeWidth={isActive ? 2.5 : 1.5}
          />
          {/* Pulsing ring on active fingertip */}
          <AnimatePresence>
            {isActive && (
              <motion.circle
                cx={tipX}
                cy={tipY}
                r={12}
                fill="none"
                stroke={activeFingerColors[fingerId].stroke}
                strokeWidth={2}
                initial={{ scale: 0.6, opacity: 1 }}
                animate={{ scale: 1.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
          {/* Fingertip contact dot */}
          <circle
            cx={tipX}
            cy={tipY}
            r={isActive ? 5.5 : 4}
            fill={dotColor}
            className="transition-colors duration-300 shadow-sm"
          />
        </motion.g>
      </g>
    );
  };

  const renderFingerBadge = (fingerId: string) => {
    const nameMap: Record<string, string> = {
      'pinky-left': 'ngón út tay trái',
      'ring-left': 'ngón áp út tay trái',
      'middle-left': 'ngón giữa tay trái',
      'index-left': 'ngón trỏ tay trái',
      'thumb': 'ngón cái',
      'index-right': 'ngón trỏ tay phải',
      'middle-right': 'ngón giữa tay phải',
      'ring-right': 'ngón áp út tay phải',
      'pinky-right': 'ngón út tay phải',
    };

    return (
      <span
        className="font-extrabold px-1.5 py-0.5 mx-0.5 rounded border text-[11px] inline-block shadow-sm transition-all"
        style={{
          backgroundColor: fingerBgColors[fingerId] || '#F9FAFB',
          borderColor: fingerBorderColors[fingerId] || '#E5E7EB',
          color: fingerTextColors[fingerId] || '#374151',
        }}
      >
        {nameMap[fingerId]}
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-0 bg-transparent mt-2">

      <div className="w-full max-w-[420px] aspect-[2.1/1]">
        <svg viewBox="0 0 420 200" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="hand-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#FCA5A5" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Left Hand Group */}
          <g id="left-hand" filter="url(#hand-shadow)">
            {/* Palm */}
            <path
              d="M 35,145 C 35,120 115,120 115,130 C 115,145 115,160 110,180 C 105,190 100,195 90,195 C 55,195 35,175 35,145 Z"
              fill={skinFill}
              stroke={skinStroke}
              strokeWidth="2"
              className="transition-all duration-300"
            />
            {/* Fingers Left Hand (Pinky, Ring, Middle, Index, Thumb) */}
            {renderFinger('pinky-left', 35, 95, 18, 55, 9)}
            {renderFinger('ring-left', 57, 75, 19, 75, 9.5)}
            {renderFinger('middle-left', 80, 65, 20, 85, 10)}
            {renderFinger('index-left', 103, 72, 20, 78, 10)}
            {renderFinger('thumb', 120, 130, 18, 45, 9, 'rotate(50 122 165)')}
          </g>

          {/* Right Hand Group */}
          <g id="right-hand" filter="url(#hand-shadow)">
            {/* Palm */}
            <path
              d="M 385,145 C 385,120 305,120 305,130 C 305,145 305,160 310,180 C 315,190 320,195 330,195 C 365,195 385,175 385,145 Z"
              fill={skinFill}
              stroke={skinStroke}
              strokeWidth="2"
              className="transition-all duration-300"
            />
            {/* Fingers Right Hand (Thumb, Index, Middle, Ring, Pinky) */}
            {renderFinger('thumb', 282, 130, 18, 45, 9, 'rotate(-50 298 165)')}
            {renderFinger('index-right', 297, 72, 20, 78, 10)}
            {renderFinger('middle-right', 320, 65, 20, 85, 10)}
            {renderFinger('ring-right', 344, 75, 19, 75, 9.5)}
            {renderFinger('pinky-right', 367, 95, 18, 55, 9)}
          </g>
        </svg>
      </div>

      {/* Helper Guidance Text */}
      <AnimatePresence mode="wait">
        {activeFingers.length > 0 ? (
          <motion.div
            key={activeFingers.join(',')}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-3 text-xs font-bold text-slate-700 bg-white/95 px-4 py-2.5 rounded-2xl border-2 border-slate-200/90 shadow-sm flex items-center justify-center gap-1.5"
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shadow-sm animate-pulse shrink-0"
              style={{ backgroundColor: highlightKey === '⌫' ? signatureColors['pinky-right'] : signatureColors[activeFingers[0]] }}
            />
            {highlightKey === '⌫' ? (
              <span>
                Bé hãy nhấn phím <span className="font-extrabold text-red-650 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">Xóa (⌫)</span> bằng{' '}
                {renderFingerBadge('pinky-right')} để sửa chữ viết sai nhé! 💜
              </span>
            ) : activeFingers.length === 2 ? (
              <span>
                Giữ phím <span className="font-extrabold text-blue-650 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">Shift</span> bằng{' '}
                {renderFingerBadge(activeFingers[1])}
                {' '}và gõ chữ bằng{' '}
                {renderFingerBadge(activeFingers[0])}
              </span>
            ) : (
              <span>
                Dùng{' '}
                {renderFingerBadge(activeFingers[0])}{' '}
                để gõ phím nhé!
              </span>
            )}
          </motion.div>
        ) : (
          <div className="mt-3 text-xs font-bold text-slate-500 bg-slate-100/60 px-4 py-2.5 rounded-2xl border-2 border-dashed border-slate-200">
            Đặt các ngón tay lên hàng phím cơ sở (A S D F - J K L ;)
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
