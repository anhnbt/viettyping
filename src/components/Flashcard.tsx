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
    <div className="w-80 h-96 perspective-1000 cursor-pointer" onClick={handleFlip}>
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full backface-hidden rounded-3xl p-6 flex flex-col items-center justify-between shadow-xl border-4 border-white"
          style={{
            background: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)",
            backfaceVisibility: "hidden"
          }}
        >
          <div className="w-full h-40 bg-white/50 rounded-2xl flex items-center justify-center p-2 border-2 border-dashed border-white/80 overflow-hidden relative">
            {imageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={wordUppercase} className="w-full h-full object-contain rounded-xl" />
              </>
            ) : (
              <span className="text-center text-sm font-semibold text-pink-600">
                [Image Placeholder]<br />
                <span className="text-xs font-normal opacity-70 line-clamp-3 mt-1">{imagePrompt}</span>
              </span>
            )}
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <h1 className="text-6xl font-black text-white drop-shadow-md tracking-wider">
              {wordUppercase}
            </h1>
          </div>

          <button
            onClick={playSound}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-pink-500"
          >
            <Volume2 size={28} />
          </button>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full backface-hidden rounded-3xl p-6 flex flex-col items-center justify-center shadow-xl border-4 border-white"
          style={{
            background: "linear-gradient(135deg, #84FAB0 0%, #8FD3F4 100%)",
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden"
          }}
        >
          <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-md">
            {word}
          </h2>
          <div className="bg-white/40 px-6 py-3 rounded-2xl mb-6 backdrop-blur-sm">
            <p className="text-xl font-medium text-teal-800 text-center">
              {spellingGuide}
            </p>
          </div>
          <p className="text-2xl font-bold text-center text-white leading-relaxed drop-shadow-sm">
            {exampleSentence}
          </p>
          <button
            onClick={playSound}
            className="mt-8 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-teal-500"
          >
            <Volume2 size={28} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
