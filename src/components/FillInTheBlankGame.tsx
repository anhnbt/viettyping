"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export interface FillInTheBlankItem {
  full_word: string;
  missing_char: string;
  sentence: string;
}

interface FillInTheBlankGameProps {
  items: FillInTheBlankItem[];
  onComplete: () => void;
}

const VIETNAMESE_CHARS = "aăâeêioôơuưyáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵbcdđghklmnpqrstvx".split("");

export default function FillInTheBlankGame({ items, onComplete }: FillInTheBlankGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"none" | "correct" | "incorrect">("none");

  const currentItem = items[currentIndex];

  const keyboardOptions = useMemo(() => {
    if (!currentItem) return [];
    
    // Generate distractors
    const missing = currentItem.missing_char.toLowerCase();
    const pool = VIETNAMESE_CHARS.filter((c) => c !== missing);
    
    // Shuffle pool and pick 3
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const distractors = shuffledPool.slice(0, 3);
    
    // Combine with correct answer and shuffle
    const options = [missing, ...distractors].sort(() => 0.5 - Math.random());
    
    // If the original missing char was uppercase, make all options uppercase
    if (currentItem.missing_char === currentItem.missing_char.toUpperCase()) {
      return options.map((c) => c.toUpperCase());
    }
    return options;
  }, [currentItem]);

  // Handle Text to Speech
  const speakWord = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "vi-VN";
      utterance.rate = 0.8; // Speak slightly slower for kids
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleKeyPress = (char: string) => {
    if (feedback !== "none") return;

    setSelectedChar(char);

    if (char.toLowerCase() === currentItem.missing_char.toLowerCase()) {
      setFeedback("correct");
      
      // Play correct sound
      try {
        const audio = new Audio("/correct.mp3");
        audio.volume = 0.5;
        audio.play().catch((e) => console.warn("Audio play failed:", e));
      } catch (error) {
        console.warn("Audio not supported", error);
      }

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#10b981", "#34d399", "#fbbf24", "#f472b6"],
      });

      // TTS
      setTimeout(() => speakWord(currentItem.full_word), 500);

      setTimeout(() => {
        if (currentIndex < items.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedChar(null);
          setFeedback("none");
        } else {
          onComplete();
        }
      }, 2500); // Wait longer so the kid can hear the word
    } else {
      setFeedback("incorrect");
      
      // Play incorrect sound
      try {
        const audio = new Audio("/incorrect.mp3");
        audio.volume = 0.5;
        audio.play().catch((e) => console.warn("Audio play failed:", e));
      } catch (error) {
        console.warn("Audio not supported", error);
      }

      setTimeout(() => {
        setFeedback("none");
        setSelectedChar(null);
      }, 1000);
    }
  };

  if (!currentItem) return null;

  // Replace '_' with the selected char or a blank space component
  const sentenceParts = currentItem.sentence.split("_");

  return (
    <div className="w-full flex flex-col items-center">
      {/* Display sentence */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="bg-white px-8 py-10 md:px-12 md:py-16 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-b-8 border-purple-200 mb-12 w-full max-w-2xl text-center"
        >
          <div className="text-4xl md:text-5xl lg:text-6xl font-black text-purple-700 leading-relaxed flex flex-wrap justify-center items-center gap-2">
            {sentenceParts.map((part, index) => (
              <React.Fragment key={index}>
                <span>{part}</span>
                {index < sentenceParts.length - 1 && (
                  <motion.div
                    animate={
                      feedback === "incorrect"
                        ? { x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } }
                        : {}
                    }
                    className={`inline-flex items-center justify-center min-w-[60px] md:min-w-[80px] h-[60px] md:h-[80px] border-b-4 mx-2 rounded-2xl ${
                      feedback === "correct"
                        ? "border-green-500 bg-green-100 text-green-600"
                        : feedback === "incorrect"
                        ? "border-red-500 bg-red-100 text-red-600"
                        : "border-purple-400 bg-purple-50 text-purple-500"
                    }`}
                  >
                    {feedback === "correct" ? currentItem.missing_char : selectedChar || ""}
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Virtual Keyboard */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 md:gap-6 w-full max-w-lg"
      >
        {keyboardOptions.map((char, index) => {
          const isSelected = selectedChar === char;
          const isCorrect = feedback === "correct" && isSelected;
          const isWrong = feedback === "incorrect" && isSelected;

          return (
            <motion.button
              key={`${currentIndex}-${index}`}
              whileHover={{ scale: feedback === "none" ? 1.1 : 1 }}
              whileTap={{ scale: feedback === "none" ? 0.95 : 1 }}
              animate={
                isCorrect
                  ? { scale: [1, 1.15, 1], transition: { duration: 0.5, times: [0, 0.5, 1], ease: "easeInOut" } }
                  : isWrong
                  ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
                  : {}
              }
              onClick={() => handleKeyPress(char)}
              disabled={feedback !== "none"}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl font-black text-4xl shadow-[0_6px_0_0_rgba(0,0,0,0.1)] flex items-center justify-center transition-all disabled:cursor-not-allowed ${
                isCorrect
                  ? "bg-green-500 text-white shadow-[0_0px_0_0_#166534] translate-y-1.5"
                  : isWrong
                  ? "bg-red-500 text-white shadow-[0_0px_0_0_#991b1b] translate-y-1.5"
                  : "bg-white text-purple-600 hover:bg-purple-50 hover:text-purple-700 active:shadow-none active:translate-y-1.5 border-2 border-purple-100"
              }`}
            >
              {char}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
