"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Play, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameAdapterProps, TelemetryPayload, Flashcard, SpinWheelItem } from "@/types/lesson";
import { useStudent } from "@/contexts/StudentContext";
import { useSound } from "@/contexts/SoundContext";
import { useWebSpeech } from "@/hooks/useWebSpeech";
import DinoMascot from '@/components/DinoMascot';

export type SpinWheelGameConfig = SpinWheelItem;

const isEmoji = (url: string) => {
  if (!url) return false;
  return !url.includes('/') && !url.includes('.') && url.length < 10;
};

// Bảng chữ cái tiếng Việt cơ bản
const VIETNAMESE_BASE_LETTERS = [
  'a', 'ă', 'â', 'b', 'c', 'd', 'đ', 'e', 'ê', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'ô', 'ơ', 'p', 'q', 'r', 's', 't', 'u', 'ư', 'v', 'x', 'y'
];

// Map ánh xạ các ký tự có dấu về ký tự cơ sở tiếng Việt tương ứng
const VIETNAMESE_TONE_MAP: { [key: string]: string } = {
  'a': 'a', 'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'ă', 'ắ': 'ă', 'ằ': 'ă', 'ẳ': 'ă', 'ẵ': 'ă', 'ặ': 'ă',
  'â': 'â', 'ấ': 'â', 'ầ': 'â', 'ẩ': 'â', 'ẫ': 'â', 'ậ': 'â',
  'e': 'e', 'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'ê', 'ế': 'ê', 'ề': 'ê', 'ể': 'ê', 'ễ': 'ê', 'ệ': 'ê',
  'i': 'i', 'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'o': 'o', 'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'ô', 'ố': 'ô', 'ồ': 'ô', 'ổ': 'ô', 'ỗ': 'ô', 'ộ': 'ô',
  'ơ': 'ơ', 'ớ': 'ơ', 'ờ': 'ơ', 'ở': 'ơ', 'ỡ': 'ơ', 'ợ': 'ơ',
  'u': 'u', 'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'ư', 'ứ': 'ư', 'ừ': 'ư', 'ử': 'ư', 'ữ': 'ư', 'ự': 'ư',
  'y': 'y', 'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  'd': 'd',
  'đ': 'đ'
};

// Hàm tự động tìm chữ cái chủ đề (xuất hiện trong đa số từ)
function findTopicLetter(items: string[]): string | null {
  if (!items || items.length === 0) return null;
  
  const letterCounts: { [key: string]: number } = {};
  VIETNAMESE_BASE_LETTERS.forEach(l => {
    letterCounts[l] = 0;
  });

  items.forEach(item => {
    const lowercaseItem = item.toLowerCase();
    const uniqueBaseLettersInWord = new Set<string>();
    
    for (let i = 0; i < lowercaseItem.length; i++) {
      const char = lowercaseItem[i];
      const baseChar = VIETNAMESE_TONE_MAP[char] || char;
      if (VIETNAMESE_BASE_LETTERS.includes(baseChar)) {
        uniqueBaseLettersInWord.add(baseChar);
      }
    }
    
    uniqueBaseLettersInWord.forEach(l => {
      letterCounts[l] = (letterCounts[l] || 0) + 1;
    });
  });

  let bestLetter: string | null = null;
  let maxCount = 0;

  VIETNAMESE_BASE_LETTERS.forEach(l => {
    const count = letterCounts[l] || 0;
    if (count > maxCount) {
      maxCount = count;
      bestLetter = l;
    }
  });

  // Nếu chữ cái xuất hiện ở ít nhất 60% số từ thì xem như chữ cái chủ đề ôn tập
  if (maxCount >= items.length * 0.6) {
    return bestLetter;
  }

  return null;
}

// Hàm render từ vựng và bôi đỏ chữ cái chủ đề
function renderWordWithHighlight(word: string, topicLetter: string | null): React.ReactNode {
  if (!topicLetter) return <span>{word}</span>;
  
  const chars = word.split('');
  return (
    <>
      {chars.map((char, index) => {
        const lowercaseChar = char.toLowerCase();
        const baseChar = VIETNAMESE_TONE_MAP[lowercaseChar] || lowercaseChar;
        const isHighlight = baseChar === topicLetter.toLowerCase();
        
        return (
          <span 
            key={index} 
            className={isHighlight ? "text-red-500 font-extrabold" : ""}
          >
            {char}
          </span>
        );
      })}
    </>
  );
}

export default function SpinWheelGame({ gameConfig, flashcards = [], onComplete }: GameAdapterProps<SpinWheelItem>) {
  const { id: gameId, items } = gameConfig;
  const { studentInfo } = useStudent();
  const { speak: speakTts, stopSpeaking } = useWebSpeech({ lang: 'vi-VN', rate: 0.8 });
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [pendingWinnerIndex, setPendingWinnerIndex] = useState<number | null>(null);

  const matchedFlashcard = selectedItem
    ? flashcards.find((f) => f.word.toLowerCase() === selectedItem.toLowerCase())
    : null;

  // Xác định chữ cái ôn tập trọng tâm
  const topicLetter = findTopicLetter(items);

  // Số lượng bóng đèn LED trên viền carnival
  const lightsCount = 16;
  const lights = Array.from({ length: lightsCount });

  // Telemetry state
  const startTimeRef = useRef<number>(Date.now());

  const { playSound } = useSound();

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [gameId]);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedItem(null);
    setShowPopup(false);

    // Phát tiếng tick quay bánh xe liên tục và chậm dần bằng Web Audio API
    let tickInterval = 60; // ban đầu quay nhanh
    let elapsed = 0;
    const maxDuration = 2800; // Quay trong khoảng 2.8s
    
    const playTickLoop = () => {
      if (elapsed >= maxDuration) return;
      playSound('tick');
      
      elapsed += tickInterval;
      // Chậm dần đều
      tickInterval = 60 + (elapsed / maxDuration) * 320;
      
      setTimeout(playTickLoop, tickInterval);
    };
    playTickLoop();

    const spinSpins = 5; // 5 full rotations
    const sliceAngle = 360 / items.length;
    
    // Pick a random winner
    const winnerIndex = Math.floor(Math.random() * items.length);
    const winnerTextAngle = (winnerIndex * sliceAngle) + (sliceAngle / 2);
    
    // Calculate final rotation
    const randomOffset = Math.random() * (sliceAngle * 0.6) - (sliceAngle * 0.3);
    
    const targetRotation = rotation + (spinSpins * 360) + (360 - winnerTextAngle) - (rotation % 360) + randomOffset;

    setRotation(targetRotation);
    setPendingWinnerIndex(winnerIndex);
  };

  const playTTS = (text: string) => {
    speakTts(text);
  };

  // When popup opens, auto play TTS
  useEffect(() => {
    if (showPopup && selectedItem) {
      playTTS(selectedItem);
    }
    return () => {
      stopSpeaking();
    };
  }, [showPopup, selectedItem, stopSpeaking]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-4">
      {/* Keyframe CSS cho bóng đèn nhấp nháy và Pointer lắc lư */}
      <style jsx global>{`
        @keyframes carnivalLightEven {
          0%, 100% { background-color: #fbbf24; box-shadow: 0 0 6px #fbbf24, 0 0 12px #f59e0b; }
          50% { background-color: #ec4899; box-shadow: 0 0 2px #ec4899; }
        }
        @keyframes carnivalLightOdd {
          0%, 100% { background-color: #ec4899; box-shadow: 0 0 2px #ec4899; }
          50% { background-color: #fbbf24; box-shadow: 0 0 6px #fbbf24, 0 0 12px #f59e0b; }
        }
        @keyframes pointerWobble {
          0%, 100% { transform: translate(-50%, 0) rotate(0deg); }
          12.5% { transform: translate(-50%, 0) rotate(15deg); }
          37.5% { transform: translate(-50%, 0) rotate(-15deg); }
          62.5% { transform: translate(-50%, 0) rotate(10deg); }
          87.5% { transform: translate(-50%, 0) rotate(-10deg); }
        }
      `}</style>
      
      {/* Carnival Style Outer Wrapper - Kích thước cố định 340px bảo đảm đồng tâm */}
      <div className="relative w-[340px] h-[340px] rounded-full bg-gradient-to-b from-amber-700 to-amber-900 border-4 border-amber-950 shadow-[0_12px_28px_rgba(0,0,0,0.35)] flex items-center justify-center mb-10 select-none shrink-0">
        
        {/* Neon Light Bulb Ring (Viền kim loại chứa bóng đèn LED) */}
        <div className="absolute inset-0 rounded-full border-[12px] border-amber-500 shadow-inner pointer-events-none" />
        
        {/* Lights (Bóng đèn Carnival nhấp nháy đuổi nhau đồng tâm hoàn hảo) */}
        {lights.map((_, i) => {
          const angle = i * (360 / lightsCount);
          const isEven = i % 2 === 0;
          return (
            <div
              key={`light-${i}`}
              className="absolute top-1/2 left-1/2 w-3.5 h-3.5 rounded-full border border-white/50 shadow-sm z-20"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-155px)`,
                animation: isEven ? 'carnivalLightEven 1.2s infinite ease-in-out' : 'carnivalLightOdd 1.2s infinite ease-in-out',
              }}
            />
          );
        })}
        
        {/* Pointer (Kim chỉ lắc lư khi quay bánh xe bằng CSS) */}
        <div 
          className="absolute -top-5 left-1/2 z-30 w-12 h-12 text-rose-500 drop-shadow-[0_4px_5px_rgba(0,0,0,0.35)] flex items-center justify-center pointer-events-none"
          style={{ 
            transformOrigin: "top center", 
            transform: "translateX(-50%) rotate(0deg)",
            animation: isSpinning ? 'pointerWobble 0.18s infinite linear' : 'none'
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 rotate-180 drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
            <path d="M12 2L22 18H2L12 2Z" />
          </svg>
        </div>

        {/* Spin Wheel Canvas - Kích thước cố định 280px */}
        <div className="relative w-[280px] h-[280px] rounded-full overflow-hidden">
          <motion.div 
            className="w-full h-full rounded-full border-4 border-white shadow-2xl relative"
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: "circOut" }}
            onAnimationComplete={() => {
              if (isSpinning && pendingWinnerIndex !== null) {
                setIsSpinning(false);
                setSelectedItem(items[pendingWinnerIndex]);
                setShowPopup(true);
                
                playSound('tada');

                confetti({
                  particleCount: 120,
                  spread: 75,
                  origin: { y: 0.6 },
                  colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff7849']
                });
                
                setPendingWinnerIndex(null);
              }
            }}
            style={{ 
              transformOrigin: "center center",
              background: `conic-gradient(${items.map((_, i) => {
                const angle = 360 / items.length;
                const colors = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5', '#00BBF9', '#00F5D4'];
                return `${colors[i % colors.length]} ${i * angle}deg ${(i + 1) * angle}deg`;
              }).join(', ')})`
            }}
          >
            {/* Phân cực lát cắt mờ màu trắng */}
            {items.map((_, index) => {
              const angle = 360 / items.length;
              const lineAngle = index * angle;
              return (
                <div
                  key={`divider-${index}`}
                  className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-white/20 origin-bottom -translate-x-1/2"
                  style={{
                    transform: `translateX(-50%) rotate(${lineAngle}deg)`,
                  }}
                />
              );
            })}

            {/* Render các lát cắt chữ và hình ảnh sử dụng tọa độ lượng giác hướng tâm */}
            {items.map((item, index) => {
              const angle = 360 / items.length;
              const textAngle = (index * angle) + (angle / 2); // 0 độ ở hướng 12 giờ
              
              // Chuyển đổi góc từ SVG sang lượng giác học (0 độ ở hướng 3 giờ, ngược chiều kim đồng hồ)
              const angleRad = (textAngle - 90) * Math.PI / 180;
              
              const R_wheel = 140; // Bán kính bánh xe 280px
              const d_radial = 82; // Khoảng cách từ tâm đến cụm hiển thị
              
              // Tọa độ absolute từ tâm (140, 140)
              const x = R_wheel + d_radial * Math.cos(angleRad);
              const y = R_wheel + d_radial * Math.sin(angleRad);
              
              // Góc xoay của nội dung để đầu luôn hướng lên trên (chữ viết không bị lật ngược)
              const isBottomHalf = textAngle > 90 && textAngle < 270;
              const contentRotation = isBottomHalf ? (textAngle + 180) % 360 : textAngle;
              
              // Tìm flashcard và lấy hình ảnh
              const matchedFc = flashcards.find((f) => f.word.toLowerCase() === item.toLowerCase());
              
              return (
                <div 
                  key={index} 
                  className="absolute flex flex-col items-center justify-center z-10"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: `translate(-50%, -50%) rotate(${contentRotation}deg)`,
                    width: '78px',
                  }}
                >
                  {/* Ảnh tròn hoặc Emoji của từ */}
                  {matchedFc?.image_url && (
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-md bg-white flex items-center justify-center overflow-hidden mb-1 shrink-0 select-none">
                      {isEmoji(matchedFc.image_url) ? (
                        <span className="text-xl">{matchedFc.image_url}</span>
                      ) : (
                        <img
                          src={matchedFc.image_url}
                          alt=""
                          aria-hidden="true"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}
                  
                  {/* Chữ hiển thị có highlight chữ ôn tập */}
                  <span className="text-slate-800 font-extrabold text-[10px] md:text-[11px] bg-white/95 px-1.5 py-0.5 rounded-full shadow-sm border border-slate-200 select-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[76px] text-center">
                    <span className="sr-only">{item}</span>
                    <span aria-hidden="true">
                      {renderWordWithHighlight(item, topicLetter)}
                    </span>
                  </span>
                </div>
              );
            })}
            
            {/* Bánh xe chốt giữa (Peg) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-md z-20 border-4 border-amber-400 flex items-center justify-center">
              <span className="text-xs select-none">⭐</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Spin Button (Đậm chất EdTech 3D tactile) */}
      <motion.button
        whileHover={!isSpinning ? { scale: 1.05 } : {}}
        whileTap={!isSpinning ? { scale: 0.95 } : {}}
        onClick={() => { playSound('pop'); spinWheel(); }}
        disabled={isSpinning}
        className={`bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-350 hover:to-amber-450 text-white font-black text-2xl px-12 py-4 rounded-3xl border-4 border-slate-800 shadow-[4px_4px_0px_0px_#1e293b] transition-all flex items-center gap-3 ${
          isSpinning ? "opacity-60 cursor-not-allowed" : "active:translate-y-[4px] active:shadow-none"
        }`}
      >
        <Play fill="currentColor" size={28} />
        {isSpinning ? 'Đang quay...' : 'Quay Ngay!'}
      </motion.button>

      {/* Result Popup */}
      <AnimatePresence>
        {showPopup && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              transition={{ type: "spring", bounce: 0.45 }}
              className="bg-[#fffdfa] rounded-3xl p-6 md:p-8 max-w-sm w-full text-center border-4 border-slate-800 shadow-[8px_8px_0px_0px_#1e293b] relative overflow-hidden flex flex-col items-center"
            >
              {/* Mascot cổ vũ bé phía trên cùng */}
              <div className="relative mb-2 flex items-center justify-center gap-3">
                <DinoMascot className="w-24 h-24" variant="victory" />
                <div className="bg-indigo-50 border-2 border-slate-800 px-3 py-1.5 rounded-2xl text-left relative before:content-[''] before:absolute before:top-1/2 before:-left-2.5 before:-translate-y-1/2 before:w-0 before:h-0 before:border-y-6 before:border-y-transparent before:border-r-8 before:border-r-slate-800 shadow-sm max-w-[180px]">
                  <p className="text-xs font-black text-indigo-700 leading-tight">
                    Tuyệt vời! Bé đã quay trúng rồi đấy!
                  </p>
                </div>
              </div>

              <h2 className="text-lg md:text-xl font-black text-gray-600 mb-3 mt-1">
                {studentInfo ? `${studentInfo.nickname} quay được:` : "Bé quay được chữ:"}
              </h2>
              
              {/* Chữ/Từ vựng lớn và nổi bật */}
              <div className="text-4xl md:text-5xl font-black text-slate-800 mb-4 py-1.5 px-6 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300">
                <span className="sr-only">{selectedItem}</span>
                <span aria-hidden="true">
                  {renderWordWithHighlight(selectedItem, topicLetter)}
                </span>
              </div>

              {/* Hình ảnh phóng to của từ */}
              {matchedFlashcard?.image_url && (
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.1 }}
                  className="w-36 h-36 mx-auto mb-6 relative rounded-3xl overflow-hidden border-4 border-slate-800 p-1 shadow-[4px_4px_0px_0px_#1e293b] bg-white flex items-center justify-center"
                >
                  {isEmoji(matchedFlashcard.image_url) ? (
                    <span className="text-6xl md:text-7xl select-none">{matchedFlashcard.image_url}</span>
                  ) : (
                    <img
                      src={matchedFlashcard.image_url}
                      alt={selectedItem}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  )}
                </motion.div>
              )}

              {/* Nút hành động */}
              <div className="flex gap-3 justify-center w-full mt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { playSound('pop'); playTTS(selectedItem); }}
                  className="flex-1 bg-sky-400 hover:bg-sky-350 text-white border-3 border-slate-800 font-black text-sm md:text-base px-4 py-3 rounded-2xl shadow-[3px_3px_0px_0px_#1e293b] transition-all flex items-center justify-center gap-1.5 active:translate-y-[3px] active:shadow-none whitespace-nowrap"
                >
                  <Volume2 size={18} className="shrink-0" />
                  <span>Nghe lại</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playSound('pop');
                    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
                    onComplete({
                      score: 100,
                      durationSeconds,
                    });
                  }}
                  className="flex-1 bg-emerald-400 hover:bg-emerald-350 text-white border-3 border-slate-800 font-black text-sm md:text-base px-4 py-3 rounded-2xl shadow-[3px_3px_0px_0px_#1e293b] transition-all flex items-center justify-center gap-1.5 active:translate-y-[3px] active:shadow-none whitespace-nowrap"
                >
                  <Check size={18} className="shrink-0" />
                  <span>Tiếp tục</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

