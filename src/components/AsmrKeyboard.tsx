'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fingerMap } from './keyboardConstants';

interface Props {
  activeKeys: Set<string>; // Bộ các phím hiện đang được gõ xuống thật
  keyboardType: 'mechanical' | 'membrane';
  switchType: 'blue' | 'red' | 'brown';
  is3d: boolean;
  ledMode: 'rgb' | 'warm' | 'cool' | 'off';
  highlightKey: string | null;
}

const keyboardLayout = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '⌫'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', ' ', 'Alt', 'Win', 'Menu', 'Ctrl']
];

// Định nghĩa màu ngón tay theo phong cách LED Neon cho ASMR
const ledColors: Record<string, { shadow: string; border: string; bg: string; text: string }> = {
  'pinky-left': { shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.7)]', border: 'border-red-500/60', bg: 'bg-red-500/10', text: 'text-red-400' },
  'ring-left': { shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.7)]', border: 'border-orange-500/60', bg: 'bg-orange-500/10', text: 'text-orange-400' },
  'middle-left': { shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.7)]', border: 'border-yellow-500/60', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  'index-left': { shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.7)]', border: 'border-green-500/60', bg: 'bg-green-500/10', text: 'text-green-400' },
  'thumb': { shadow: 'shadow-[0_0_15px_rgba(148,163,184,0.7)]', border: 'border-slate-400/60', bg: 'bg-slate-400/10', text: 'text-slate-400' },
  'index-right': { shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.7)]', border: 'border-emerald-500/60', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  'middle-right': { shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.7)]', border: 'border-blue-500/60', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'ring-right': { shadow: 'shadow-[0_0_15px_rgba(99,102,241,0.7)]', border: 'border-indigo-500/60', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  'pinky-right': { shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.7)]', border: 'border-purple-500/60', bg: 'bg-purple-500/10', text: 'text-purple-400' },
};

const shiftKeyMap: Record<string, string> = {
  '+': '=', '_': '-', ')': '0', '(': '9', '*': '8', '&': '7', '^': '6',
  '%': '5', '$': '4', '#': '3', '@': '2', '!': '1', '~': '`', '{': '[',
  '}': ']', '|': '\\', ':': ';', '"': '\'', '<': ',', '>': '.', '?': '/'
};

export default function AsmrKeyboard({
  activeKeys,
  keyboardType,
  switchType,
  is3d,
  ledMode,
  highlightKey
}: Props) {
  const [ripples, setRipples] = useState<{ id: string; x: number; y: number; color: string }[]>([]);

  // Lắng nghe sự kiện để tạo hiệu ứng gợn sóng khi activeKeys thay đổi
  useEffect(() => {
    if (activeKeys.size === 0) return;
    
    const lastPressedKey = Array.from(activeKeys)[activeKeys.size - 1];
    const keyElement = document.getElementById(`asmr-key-${lastPressedKey}`);
    
    if (keyElement) {
      const rect = keyElement.getBoundingClientRect();
      const parentRect = keyElement.parentElement?.parentElement?.getBoundingClientRect();
      if (parentRect) {
        const x = rect.left - parentRect.left + rect.width / 2;
        const y = rect.top - parentRect.top + rect.height / 2;
        
        let color = 'rgba(99, 102, 241, 0.4)';
        if (ledMode === 'rgb') {
          const finger = fingerMap[lastPressedKey.toLowerCase()] || 'thumb';
          color = finger === 'pinky-left' ? 'rgba(239, 68, 68, 0.5)' :
                  finger === 'ring-left' ? 'rgba(249, 115, 22, 0.5)' :
                  finger === 'middle-left' ? 'rgba(234, 179, 8, 0.5)' :
                  finger === 'index-left' ? 'rgba(34, 197, 94, 0.5)' :
                  finger === 'index-right' ? 'rgba(16, 185, 129, 0.5)' :
                  finger === 'middle-right' ? 'rgba(59, 130, 246, 0.5)' :
                  finger === 'ring-right' ? 'rgba(99, 102, 241, 0.5)' :
                  finger === 'pinky-right' ? 'rgba(168, 85, 247, 0.5)' : 'rgba(148, 163, 184, 0.5)';
        } else if (ledMode === 'warm') {
          color = 'rgba(245, 158, 11, 0.4)';
        } else if (ledMode === 'cool') {
          color = 'rgba(6, 182, 212, 0.4)';
        }

        const newRipple = {
          id: `${Date.now()}-${Math.random()}`,
          x,
          y,
          color
        };
        setRipples((prev) => [...prev.slice(-15), newRipple]);
      }
    }
  }, [activeKeys, ledMode]);

  const getKeyDisplay = (key: string) => {
    switch (key) {
      case ' ': return 'Space';
      case '⌫': return 'Delete';
      default: return key.toUpperCase();
    }
  };

  // Hàm trả về Class cho LED nền phím (kể cả lúc rảnh và lúc nhấn)
  const getFingerStyle = (key: string, isPressed: boolean, highlight: boolean) => {
    const finger = fingerMap[key.toLowerCase()] || fingerMap[key];
    
    // Nếu tắt LED
    if (!finger || ledMode === 'off') {
      if (isPressed) return 'bg-slate-700 text-white border-slate-500 shadow-none';
      if (highlight) return 'bg-slate-800 text-indigo-400 border-indigo-500/80 animate-pulse-fast';
      return 'bg-slate-900/40 border-slate-850 text-slate-400 hover:bg-slate-800/30';
    }

    // 1. CHẾ ĐỘ LED ĐA SẮC (RGB)
    if (ledMode === 'rgb') {
      const styles = ledColors[finger];
      if (isPressed) {
        // Bùng sáng rực rỡ, đổi bg rõ rệt
        return `${styles.bg.replace('10', '40')} ${styles.border.replace('60', '100')} text-white ${styles.shadow}`;
      }
      if (highlight) {
        // Nhấp nháy màu ngón tay tương ứng
        return `${styles.bg.replace('10', '25')} ${styles.border.replace('60', '90')} ${styles.text} ${styles.shadow} animate-pulse-fast`;
      }
      // Trạng thái chờ: sáng mờ dịu mắt, đổi viền nhẹ
      return `${styles.bg.replace('10', '6')} ${styles.border.replace('60', '20')} ${styles.text} hover:${styles.bg.replace('10', '20')} hover:${styles.border.replace('60', '50')} transition-all`;
    }

    // 2. CHẾ ĐỘ LED ĐƠN SẮC WARM / COOL
    const isWarm = ledMode === 'warm';
    const bgIdle = isWarm ? 'bg-amber-500/5' : 'bg-cyan-500/5';
    const bgActive = isWarm ? 'bg-amber-500/25' : 'bg-cyan-500/25';
    const borderIdle = isWarm ? 'border-amber-500/15' : 'border-cyan-500/15';
    const borderActive = isWarm ? 'border-amber-500/80' : 'border-cyan-500/80';
    const textIdle = isWarm ? 'text-amber-300/60' : 'text-cyan-300/60';
    const textActive = isWarm ? 'text-white' : 'text-white';
    const shadowActive = isWarm ? 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'shadow-[0_0_15px_rgba(6,182,212,0.5)]';

    if (isPressed) {
      return `${bgActive} ${borderActive} ${textActive} ${shadowActive}`;
    }
    if (highlight) {
      return `${isWarm ? 'bg-amber-500/15' : 'bg-cyan-500/15'} ${borderActive} ${isWarm ? 'text-amber-300' : 'text-cyan-300'} ${shadowActive} animate-pulse-fast`;
    }
    return `${bgIdle} ${borderIdle} ${textIdle} hover:${isWarm ? 'bg-amber-500/10 border-amber-500/30' : 'bg-cyan-500/10 border-cyan-500/30'}`;
  };

  const isHighlighted = (key: string) => {
    if (!highlightKey) return false;
    
    const highlightLower = highlightKey.toLowerCase();
    const keyLower = key.toLowerCase();

    if (key === ' ') {
      return highlightLower === ' ' || highlightLower === 'space';
    }

    const isShiftRequired = /[A-ZÀ-ỸĐ]/.test(highlightKey) || highlightKey in shiftKeyMap;
    if (isShiftRequired && key === 'Shift') {
      const baseChar = /[A-ZÀ-ỸĐ]/.test(highlightKey) ? highlightKey.toLowerCase() : shiftKeyMap[highlightKey];
      const finger = fingerMap[baseChar];
      const isLeftHand = finger && finger.includes('left');
      return !!isLeftHand;
    }

    const baseChar = shiftKeyMap[highlightKey] || highlightLower;
    return keyLower === baseChar.toLowerCase();
  };

  // Xác định LED gầm (Underglow) của vỏ bàn phím cơ
  let underglowClass = "";
  let underglowStyle = {};

  if (ledMode === 'rgb') {
    underglowClass = "rgb-keyboard-underglow";
  } else if (ledMode === 'warm') {
    underglowStyle = {
      boxShadow: '0 15px 50px -10px rgba(245, 158, 11, 0.25), 0 0 25px -5px rgba(245, 158, 11, 0.15)',
      borderColor: 'rgba(245, 158, 11, 0.25)'
    };
  } else if (ledMode === 'cool') {
    underglowStyle = {
      boxShadow: '0 15px 50px -10px rgba(6, 182, 212, 0.25), 0 0 25px -5px rgba(6, 182, 212, 0.15)',
      borderColor: 'rgba(6, 182, 212, 0.25)'
    };
  } else {
    underglowStyle = {
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      borderColor: 'rgba(51, 65, 85, 0.2)'
    };
  }

  return (
    <div
      className={`w-full max-w-5xl mx-auto p-6 rounded-[32px] bg-slate-950/80 border backdrop-blur-2xl transition-all duration-700 relative overflow-hidden ${underglowClass}`}
      style={{
        ...underglowStyle,
        ...(is3d ? {
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        } : {})
      }}
    >
      {/* Thẻ Style nhúng CSS Animations chạy LED gầm và nhấp nháy phím */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-fast {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.4); }
        }
        .animate-pulse-fast {
          animation: pulse-fast 0.8s infinite ease-in-out;
        }
        @keyframes rgb-underglow {
          0% { box-shadow: 0 15px 50px -10px rgba(239, 68, 68, 0.3), 0 0 25px -5px rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.25); }
          20% { box-shadow: 0 15px 50px -10px rgba(249, 115, 22, 0.3), 0 0 25px -5px rgba(249, 115, 22, 0.15); border-color: rgba(249, 115, 22, 0.25); }
          40% { box-shadow: 0 15px 50px -10px rgba(16, 185, 129, 0.3), 0 0 25px -5px rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.25); }
          60% { box-shadow: 0 15px 50px -10px rgba(59, 130, 246, 0.3), 0 0 25px -5px rgba(59, 130, 246, 0.15); border-color: rgba(59, 130, 246, 0.25); }
          80% { box-shadow: 0 15px 50px -10px rgba(168, 85, 247, 0.3), 0 0 25px -5px rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.25); }
          100% { box-shadow: 0 15px 50px -10px rgba(239, 68, 68, 0.3), 0 0 25px -5px rgba(239, 68, 68, 0.15); border-color: rgba(239, 68, 68, 0.25); }
        }
        .rgb-keyboard-underglow {
          animation: rgb-underglow 12s infinite ease-in-out;
        }
      `}} />

      {/* Ripple Waves Visual Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute rounded-full border border-dashed"
              style={{
                left: ripple.x,
                top: ripple.y,
                transform: 'translate(-50%, -50%)',
                borderColor: ripple.color,
                boxShadow: `0 0 20px ${ripple.color}`,
              }}
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: 120, height: 120, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Grid Bàn phím ảo */}
      <div
        className="relative z-10 flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-900/40 shadow-inner"
        style={is3d ? {
          transform: 'rotateX(20deg) scale(0.96)',
          transformOrigin: 'top center',
        } : undefined}
      >
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5 w-full">
            {row.map((key, keyIndex) => {
              const displayKey = getKeyDisplay(key);
              
              let isPressed = false;
              if (key === ' ') {
                isPressed = activeKeys.has(' ') || activeKeys.has('space');
              } else if (key === '⌫') {
                isPressed = activeKeys.has('backspace');
              } else if (key === 'Shift') {
                isPressed = activeKeys.has('shift') || 
                            (keyIndex === 0 && activeKeys.has('shiftleft')) || 
                            (keyIndex === 11 && activeKeys.has('shiftright'));
              } else {
                isPressed = activeKeys.has(key.toLowerCase());
              }

              const highlight = isHighlighted(key);
              const fingerColorClass = getFingerStyle(key, isPressed, highlight);

              const widthClass =
                key === ' ' ? 'w-[420px]' :
                key === '⌫' ? 'w-[75px]' :
                key === 'Tab' ? 'w-[68px]' :
                key === 'Caps' ? 'w-[78px]' :
                key === 'Enter' ? 'w-[88px]' :
                key === 'Shift' ? (keyIndex === 0 ? 'w-[98px]' : 'w-[108px]') :
                key === 'Ctrl' ? 'w-[55px]' :
                key === 'Win' ? 'w-[50px]' :
                key === 'Alt' ? 'w-[50px]' :
                'w-[48px] h-[48px]';

              const depthOffset = keyboardType === 'mechanical' ? 'translate-y-[4px]' : 'translate-y-[2px]';
              
              // Shadow độ dày keycap đổi màu theo Switch
              let shadowHeight = 'shadow-[0_4px_0_#1e293b]';
              if (keyboardType === 'mechanical') {
                if (switchType === 'blue') shadowHeight = 'shadow-[0_5px_0_#0f172a]';
                else if (switchType === 'red') shadowHeight = 'shadow-[0_5px_0_#450a0a]';
                else shadowHeight = 'shadow-[0_5px_0_#422006]';
              } else {
                shadowHeight = 'shadow-[0_2px_0_#0f172a]';
              }

              const activeShadow = 'shadow-none';

              return (
                <div
                  key={keyIndex}
                  id={`asmr-key-${key === ' ' ? 'space' : key === '⌫' ? 'backspace' : key === 'Shift' ? (keyIndex === 0 ? 'shiftleft' : 'shiftright') : key.toLowerCase()}`}
                  className={`${widthClass} h-[48px] rounded-xl flex items-center justify-center font-bold text-xs select-none transition-all duration-75 border border-slate-900/60
                    ${fingerColorClass} 
                    ${is3d ? (isPressed ? `${depthOffset} ${activeShadow}` : `${shadowHeight}`) : (isPressed ? 'translate-y-[2px]' : '')}
                    relative`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <span className="relative z-10">{displayKey}</span>

                  {is3d && keyboardType === 'mechanical' && !isPressed && (
                    <div 
                      className={`absolute bottom-[-5px] left-[10%] right-[10%] h-[5px] rounded-b-md z-0 opacity-80`}
                      style={{
                        backgroundColor: switchType === 'blue' ? '#3b82f6' : switchType === 'red' ? '#ef4444' : '#a16207'
                      }}
                    />
                  )}

                  {is3d && keyboardType === 'membrane' && !isPressed && (
                    <div className="absolute bottom-[-2px] left-[15%] right-[15%] h-[2px] bg-slate-700/40 rounded-b-md z-0" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-3 text-[10px] text-slate-500 font-mono pr-4">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${activeKeys.has('capslock') ? 'bg-indigo-500 shadow-[0_0_6px_#6366f1]' : 'bg-slate-800'}`} />
          <span>CAPS LOCK</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${keyboardType === 'mechanical' ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' : 'bg-slate-800'}`} />
          <span>MECHANICAL</span>
        </div>
      </div>
    </div>
  );
}
