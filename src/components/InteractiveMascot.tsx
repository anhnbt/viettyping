'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { CSSProperties } from 'react';

export const MASCOT_DIRECTIONS = [
  'up-left',
  'up',
  'up-right',
  'left',
  'center',
  'right',
  'down-left',
  'down',
  'down-right',
] as const;

export const MASCOT_REACTIONS = [
  'blink',
  'heart',
  'sparkle',
  'surprised',
  'wink',
  'bashful',
  'sleepy',
  'dizzy',
  'delighted',
] as const;

export type MascotDirection = (typeof MASCOT_DIRECTIONS)[number];
export type MascotReaction = (typeof MASCOT_REACTIONS)[number];

const CLOCKWISE: MascotDirection[] = [
  'right',
  'down-right',
  'down',
  'down-left',
  'left',
  'up-left',
  'up',
  'up-right',
];

const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
const HYSTERESIS = 0.12;
const DEAD_ZONE = 60;

const PAYOFFS: MascotReaction[] = ['heart', 'sparkle', 'delighted', 'wink'];
const BOOP_PAYOFF = 130;
const BOOP_END = 650;
const SQUASH_MS = 420;
const DIZZY_AFTER = 4;
const DIZZY_WINDOW = 1600;
const DIZZY_END = 1200;

const CHEER_MESSAGES = [
  'Bé cố lên nha! ⭐',
  'Bé gõ giỏi quá! 🎉',
  'Tuyệt vời ông mặt trời! ☀️',
  'Chăm chỉ quá đi thôi! 💖',
  'Tớ luôn ủng hộ bé! ✨',
];

const DIZZY_MESSAGES = [
  'Oa tớ hoa mắt rồi hihi! 🌀',
  'Chóng mặt quá bạn ơi! 💫',
];

const SQUASH: Keyframe[] = [
  { transform: 'scale(1, 1)', easing: 'ease-in' },
  { transform: 'scale(1.12, 0.84)', offset: 0.18, easing: 'ease-out' },
  { transform: 'scale(0.94, 1.08)', offset: 0.45, easing: 'ease-in-out' },
  { transform: 'scale(1.03, 0.97)', offset: 0.72, easing: 'ease-in-out' },
  { transform: 'scale(1, 1)' },
];

function getCellPosition(index: number): CSSProperties {
  return {
    backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`,
  };
}

function wrapAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

const spriteLayer: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundSize: '300% 300%',
  backgroundRepeat: 'no-repeat',
};

export interface InteractiveMascotProps {
  directions: string;
  reactions: string;
  size?: number | string;
  className?: string;
  label?: string;
  variant?: 'cheer' | 'victory';
  reactionOverride?: MascotReaction | null;
  speechText?: string | null;
  showBubbleOnBoop?: boolean;
  onBoop?: () => void;
}

export const InteractiveMascot: React.FC<InteractiveMascotProps> = ({
  directions,
  reactions,
  size = 130,
  className = '',
  label = 'Linh vật VietTyping',
  variant = 'cheer',
  reactionOverride = null,
  speechText = null,
  showBubbleOnBoop = true,
  onBoop,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const squashRef = useRef<HTMLSpanElement>(null);
  const timersRef = useRef<number[]>([]);
  const boopsRef = useRef({ count: 0, at: 0 });

  const [direction, setDirection] = useState<MascotDirection>('center');
  const [internalReaction, setInternalReaction] = useState<MascotReaction | null>(null);
  const [bubbleMessage, setBubbleMessage] = useState<string | null>(speechText || null);
  const [showBubble, setShowBubble] = useState<boolean>(Boolean(speechText));

  // Sync external speechText
  useEffect(() => {
    if (speechText) {
      setBubbleMessage(speechText);
      setShowBubble(true);
    } else if (!internalReaction) {
      setShowBubble(false);
    }
  }, [speechText, internalReaction]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // Tracking cursor
  useEffect(() => {
    // Chỉ tracking trên thiết bị có chuột/hover tốt
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    let sector = -1;
    let pointer: { x: number; y: number } | null = null;

    const aim = () => {
      const container = containerRef.current;
      if (!container || !pointer) return;

      const box = container.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);

      // Dead zone: Khi chuột ở gần giữa mặt, nhìn thẳng
      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        sector = -1;
        setDirection('center');
        return;
      }

      const angle = Math.atan2(dy, dx);
      if (sector !== -1 && Math.abs(wrapAngle(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS) {
        return;
      }

      sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
      setDirection(CLOCKWISE[sector]);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      aim();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', aim, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', aim);
    };
  }, []);

  // Xử lý chạm/click vào linh vật ("Boop")
  const handleBoop = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];

    const later = (ms: number, fn: () => void) => {
      timersRef.current.push(window.setTimeout(fn, ms));
    };

    const now = Date.now();
    const boops = boopsRef.current;
    boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
    boops.at = now;

    if (boops.count >= DIZZY_AFTER) {
      boops.count = 0;
      setInternalReaction('dizzy');
      if (showBubbleOnBoop) {
        setBubbleMessage(DIZZY_MESSAGES[Math.floor(Math.random() * DIZZY_MESSAGES.length)]);
        setShowBubble(true);
      }
      later(DIZZY_END, () => {
        setInternalReaction(null);
        setShowBubble(false);
      });
    } else {
      setInternalReaction('blink');
      const payoffReaction = PAYOFFS[(boops.count - 1) % PAYOFFS.length];
      later(BOOP_PAYOFF, () => {
        setInternalReaction(payoffReaction);
      });
      if (showBubbleOnBoop) {
        setBubbleMessage(CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)]);
        setShowBubble(true);
      }
      later(BOOP_END, () => {
        setInternalReaction(null);
        setShowBubble(false);
      });
    }

    // Web Animations API: Squash & Stretch bounce
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && squashRef.current) {
      squashRef.current.animate(SQUASH, { duration: SQUASH_MS, easing: 'linear' });
    }

    onBoop?.();
  }, [showBubbleOnBoop, onBoop]);

  // Xác định biểu cảm hiện tại (ưu tiên override từ trò chơi hoặc victory)
  const activeReaction: MascotReaction | null =
    variant === 'victory'
      ? 'delighted'
      : reactionOverride || internalReaction;

  const currentSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      ref={containerRef}
      className={`relative select-none flex flex-col items-center justify-center ${className}`}
      style={{ width: currentSize, height: currentSize }}
    >
      <style jsx global>{`
        @keyframes mascot-victory-jump {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-16px) rotate(6deg) scale(1.05); }
          75% { transform: translateY(-16px) rotate(-6deg) scale(1.05); }
        }
        @keyframes bubble-pop {
          0% { opacity: 0; transform: translateY(8px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0px) scale(1); }
        }
        .animate-mascot-victory {
          animation: mascot-victory-jump 0.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          transform-origin: bottom center;
        }
        .animate-bubble-pop {
          animation: bubble-pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* Bong bóng thoại vui vẻ khi tương tác */}
      {showBubble && bubbleMessage && (
        <div
          className="absolute -top-12 z-20 whitespace-nowrap bg-white/95 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-amber-200 animate-bubble-pop flex items-center gap-1 pointer-events-none"
        >
          <span>{bubbleMessage}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 border-b-2 border-r-2 border-amber-200 rotate-45" />
        </div>
      )}

      {/* Nút bấm Mascot (Hỗ trợ click/chạm "Boop") */}
      <button
        type="button"
        onClick={handleBoop}
        aria-label={`Chạm vào ${label}`}
        className="w-full h-full p-0 m-0 border-0 bg-transparent cursor-pointer relative block outline-none transition-transform active:scale-95"
        style={{ userSelect: 'none' }}
      >
        <span
          ref={squashRef}
          className={`relative block w-full h-full ${
            variant === 'victory' ? 'animate-mascot-victory' : ''
          }`}
          style={{ transformOrigin: '50% 80%' }}
        >
          {/* Layer 1: Hướng nhìn (Directions 3x3) */}
          <span
            style={{
              ...spriteLayer,
              backgroundImage: `url(${directions})`,
              ...getCellPosition(MASCOT_DIRECTIONS.indexOf(direction)),
              opacity: activeReaction ? 0 : 1,
              transition: 'opacity 0.08s ease',
            }}
          />

          {/* Layer 2: Biểu cảm phản ứng (Reactions 3x3) - Luôn mount để preload */}
          <span
            style={{
              ...spriteLayer,
              backgroundImage: `url(${reactions})`,
              ...getCellPosition(
                MASCOT_REACTIONS.indexOf(activeReaction || 'blink')
              ),
              opacity: activeReaction ? 1 : 0,
              transition: 'opacity 0.08s ease',
            }}
          />
        </span>
      </button>
    </div>
  );
};

export default InteractiveMascot;
