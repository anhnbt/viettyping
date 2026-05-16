"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Play, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpinWheelGameProps {
  items: string[];
  onComplete: () => void;
}

export default function SpinWheelGame({ items, onComplete }: SpinWheelGameProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // Audio refs
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);
  const tadaAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Setup audio
    tickAudioRef.current = new Audio('/tick.mp3');
    tadaAudioRef.current = new Audio('/tada.mp3');
    
    // Preload
    if (tickAudioRef.current) tickAudioRef.current.load();
    if (tadaAudioRef.current) tadaAudioRef.current.load();
  }, []);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedItem(null);
    setShowPopup(false);

    // Play tick sound continuously or just once
    if (tickAudioRef.current) {
      tickAudioRef.current.currentTime = 0;
      tickAudioRef.current.loop = true;
      tickAudioRef.current.play().catch(() => console.warn("Audio play blocked"));
    }

    const spinDuration = 3000; // 3 seconds
    const spinSpins = 5; // 5 full rotations
    const sliceAngle = 360 / items.length;
    
    // Pick a random winner
    const winnerIndex = Math.floor(Math.random() * items.length);
    const winnerAngle = winnerIndex * sliceAngle;
    
    // Calculate final rotation
    // We want the winner slice to be at the top (or pointing to a pointer). 
    // Usually pointer is at the top (0 degrees).
    // If the wheel rotates clockwise, the winner slice needs to stop at 360 - winnerAngle
    // to be at the top. Let's add a random offset within the slice to make it look natural.
    const randomOffset = Math.random() * (sliceAngle * 0.8) - (sliceAngle * 0.4);
    
    const targetRotation = rotation + (spinSpins * 360) + (360 - winnerAngle) - (rotation % 360) + randomOffset;

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedItem(items[winnerIndex]);
      setShowPopup(true);
      
      if (tickAudioRef.current) {
        tickAudioRef.current.pause();
      }
      
      if (tadaAudioRef.current) {
        tadaAudioRef.current.currentTime = 0;
        tadaAudioRef.current.play().catch(() => console.warn("Audio play blocked"));
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      });

    }, spinDuration);
  };

  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.8; // Slower for kids
      window.speechSynthesis.speak(utterance);
    }
  };

  // When popup opens, auto play TTS
  useEffect(() => {
    if (showPopup && selectedItem) {
      playTTS(selectedItem);
    }
  }, [showPopup, selectedItem]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-8">
      
      {/* Spin Wheel Container */}
      <div className="relative w-72 h-72 md:w-96 md:h-96 mb-12">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-8 text-yellow-500 drop-shadow-xl flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 rotate-180">
            <path d="M12 2L22 20H2L12 2Z" />
          </svg>
        </div>

        {/* The Wheel */}
        <motion.div 
          className="w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden relative"
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: "circOut" }}
          style={{ 
            transformOrigin: "center center",
            background: `conic-gradient(${items.map((_, i) => {
              const angle = 360 / items.length;
              const colors = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93', '#F15BB5', '#00BBF9', '#00F5D4'];
              return `${colors[i % colors.length]} ${i * angle}deg ${(i + 1) * angle}deg`;
            }).join(', ')})`
          }}
        >
          {items.map((item, index) => {
            const angle = 360 / items.length;
            // The text should be placed in the middle of each slice
            // Slice starts at index * angle, ends at (index + 1) * angle
            // Middle is (index * angle) + (angle / 2)
            // But 0 degrees in conic gradient is at the top (12 o'clock).
            // To point text from center to edge, we rotate the text container
            const textAngle = (index * angle) + (angle / 2);
            
            return (
              <div 
                key={index} 
                className="absolute top-0 left-0 w-full h-full flex items-start justify-center pt-4"
                style={{
                  transform: `rotate(${textAngle}deg)`,
                }}
              >
                <span className="text-white font-black text-2xl md:text-3xl drop-shadow-md">
                  {item}
                </span>
              </div>
            );
          })}
          
          {/* Wheel Center Peg */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-inner z-10 border-4 border-gray-200" />
        </motion.div>
      </div>

      {/* Spin Button */}
      <motion.button
        whileHover={!isSpinning ? { scale: 1.05 } : {}}
        whileTap={!isSpinning ? { scale: 0.95 } : {}}
        onClick={spinWheel}
        disabled={isSpinning}
        className={`bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-black text-2xl px-12 py-4 rounded-full shadow-[0_6px_0_0_#be185d] hover:shadow-[0_3px_0_0_#be185d] transition-all flex items-center gap-3 ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''} ${!isSpinning ? 'hover:translate-y-1 active:shadow-none active:translate-y-2' : ''}`}
      >
        <Play fill="currentColor" size={28} />
        {isSpinning ? 'Đang quay...' : 'Quay Ngay!'}
      </motion.button>

      {/* Result Popup */}
      <AnimatePresence>
        {showPopup && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-400 relative overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Bạn quay được chữ:</h2>
              
              <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-pink-500 mb-8 py-4">
                {selectedItem}
              </div>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => playTTS(selectedItem)}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-bold text-lg px-6 py-4 rounded-2xl shadow-[0_6px_0_0_#1e3a8a] hover:shadow-[0_3px_0_0_#1e3a8a] transition-all flex items-center gap-2 hover:translate-y-1 active:shadow-none active:translate-y-2"
                >
                  <Volume2 size={24} />
                  Nghe lại
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onComplete}
                  className="bg-green-500 hover:bg-green-400 text-white font-bold text-lg px-6 py-4 rounded-2xl shadow-[0_6px_0_0_#14532d] hover:shadow-[0_3px_0_0_#14532d] transition-all flex items-center gap-2 hover:translate-y-1 active:shadow-none active:translate-y-2"
                >
                  <Check size={24} />
                  Tiếp tục
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
