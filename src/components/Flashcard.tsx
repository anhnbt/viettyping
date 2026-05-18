"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";

interface FlashcardProps {
  word: string;
  wordUppercase: string;
  spellingGuide: string;
  exampleSentence: string;
  imagePrompt: string; // Placeholder for image
  imageUrl?: string;
}

export default function Flashcard({
  word,
  wordUppercase,
  spellingGuide,
  exampleSentence,
  imagePrompt,
  imageUrl,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const playSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate playing sound
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "vi-VN";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      className="w-full h-full perspective-1000 cursor-pointer" 
      onClick={handleFlip}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full backface-hidden rounded-3xl p-6 flex flex-col items-center justify-between shadow-2xl shadow-pink-200/50 border-4 border-white backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, rgba(255,154,158,0.9) 0%, rgba(254,207,239,0.9) 100%)",
            backfaceVisibility: "hidden"
          }}
        >
          <div className="w-full h-32 md:h-40 bg-white/60 rounded-2xl flex items-center justify-center p-2 border-2 border-dashed border-white overflow-hidden relative shadow-inner">
            {imageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={wordUppercase} className="w-full h-full object-contain rounded-xl drop-shadow-sm" />
              </>
            ) : (
              <span className="text-center text-sm font-semibold text-pink-600">
                [Image Placeholder]<br />
                <span className="text-xs font-normal opacity-70 line-clamp-3 mt-1">{imagePrompt}</span>
              </span>
            )}
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg tracking-wider">
              {wordUppercase}
            </h1>
          </div>

          <motion.button
            onClick={playSound}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-pink-500 hover:text-pink-600 transition-colors"
          >
            <Volume2 size={28} />
          </motion.button>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full backface-hidden rounded-3xl p-6 flex flex-col items-center justify-center shadow-2xl shadow-teal-200/50 border-4 border-white backdrop-blur-sm"
          style={{
            background: "linear-gradient(135deg, rgba(132,250,176,0.9) 0%, rgba(143,211,244,0.9) 100%)",
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden"
          }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 md:mb-6 drop-shadow-lg">
            {word}
          </h2>
          <div className="bg-white/50 px-4 py-2 md:px-6 md:py-3 rounded-2xl mb-4 md:mb-6 backdrop-blur-md shadow-sm border border-white/50">
            <p className="text-lg md:text-xl font-bold text-teal-800 text-center tracking-wide">
              {spellingGuide}
            </p>
          </div>
          <p className="text-xl md:text-2xl font-bold text-center text-white leading-relaxed drop-shadow-md">
            {exampleSentence}
          </p>
          <motion.button
            onClick={playSound}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="mt-6 md:mt-8 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-teal-500 hover:text-teal-600 transition-colors"
          >
            <Volume2 size={28} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
