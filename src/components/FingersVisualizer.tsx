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

// Skin colors for resting state
const skinFill = '#FFF5F0';
const skinStroke = '#FCA5A5'; // rose-300

export default function FingersVisualizer({ highlightKey, pressedKey }: Props) {
  const getFingerName = (key: string | null): string | null => {
    if (!key) return null;
    const lowerKey = key.toLowerCase();
    if (lowerKey === ' ') return 'thumb';
    return fingerMap[lowerKey] || fingerMap[key] || null;
  };

  const activeFingers = React.useMemo(() => {
    if (!highlightKey) return [];
    
    const lowerChar = highlightKey.toLowerCase();
    
    // Kiểm tra xem có phải chữ viết hoa tiếng Việt
    const isCapital = highlightKey.length === 1 && 
      highlightKey !== highlightKey.toLowerCase() && 
      /[A-ZÀ-ỸĐ]/.test(highlightKey);

    if (isCapital) {
      const charFinger = fingerMap[lowerChar];
      if (!charFinger) return [];
      
      const isLeftHand = charFinger.includes('left');
      const shiftFinger = isLeftHand ? 'pinky-right' : 'pinky-left';
      
      return [charFinger, shiftFinger];
    }
    
    if (lowerChar === ' ') return ['thumb'];
    const finger = fingerMap[lowerChar] || fingerMap[highlightKey] || null;
    return finger ? [finger] : [];
  }, [highlightKey]);

  const pressedFinger = getFingerName(pressedKey);

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

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-100 shadow-inner mt-4">
      <div className="text-xs font-black text-slate-500 mb-2 tracking-wide uppercase flex items-center gap-1.5">
        👋 Hướng dẫn đặt ngón tay
      </div>
      
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
            className="mt-2 text-xs font-bold text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/50 flex items-center gap-1.5"
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shadow-sm animate-pulse"
              style={{ backgroundColor: highlightKey === '⌫' ? signatureColors['pinky-right'] : signatureColors[activeFingers[0]] }}
            />
            {highlightKey === '⌫' ? (
              <span>
                Bé hãy nhấn phím <span className="font-extrabold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">Xóa (⌫)</span> bằng{' '}
                <span className="font-extrabold" style={{ color: signatureColors['pinky-right'] }}>ngón út tay phải</span> để sửa chữ viết sai nhé! 💜
              </span>
            ) : activeFingers.length === 2 ? (
              <span>
                Giữ phím <span className="font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">Shift</span> bằng{' '}
                <span className="font-extrabold" style={{ color: signatureColors[activeFingers[1]] }}>
                  {activeFingers[1] === 'pinky-left' && 'ngón út tay trái'}
                  {activeFingers[1] === 'pinky-right' && 'ngón út tay phải'}
                </span>
                {' '}và gõ chữ bằng{' '}
                <span className="font-extrabold" style={{ color: signatureColors[activeFingers[0]] }}>
                  {activeFingers[0] === 'pinky-left' && 'ngón út tay trái'}
                  {activeFingers[0] === 'ring-left' && 'ngón áp út tay trái'}
                  {activeFingers[0] === 'middle-left' && 'ngón giữa tay trái'}
                  {activeFingers[0] === 'index-left' && 'ngón trỏ tay trái'}
                  {activeFingers[0] === 'thumb' && 'ngón cái'}
                  {activeFingers[0] === 'index-right' && 'ngón trỏ tay phải'}
                  {activeFingers[0] === 'middle-right' && 'ngón giữa tay phải'}
                  {activeFingers[0] === 'ring-right' && 'ngón áp út tay phải'}
                  {activeFingers[0] === 'pinky-right' && 'ngón út tay phải'}
                </span>
              </span>
            ) : (
              <span>
                Dùng{' '}
                <span className="font-extrabold" style={{ color: signatureColors[activeFingers[0]] }}>
                  {activeFingers[0] === 'pinky-left' && 'ngón út tay trái'}
                  {activeFingers[0] === 'ring-left' && 'ngón áp út tay trái'}
                  {activeFingers[0] === 'middle-left' && 'ngón giữa tay trái'}
                  {activeFingers[0] === 'index-left' && 'ngón trỏ tay trái'}
                  {activeFingers[0] === 'thumb' && 'ngón cái'}
                  {activeFingers[0] === 'index-right' && 'ngón trỏ tay phải'}
                  {activeFingers[0] === 'middle-right' && 'ngón giữa tay phải'}
                  {activeFingers[0] === 'ring-right' && 'ngón áp út tay phải'}
                  {activeFingers[0] === 'pinky-right' && 'ngón út tay phải'}
                </span>{' '}
                để gõ phím nhé!
              </span>
            )}
          </motion.div>
        ) : (
          <div className="mt-2 text-xs font-medium text-slate-400">
            Đặt các ngón tay lên hàng phím cơ sở (A S D F - J K L ;)
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
