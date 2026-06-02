"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import confetti from "canvas-confetti";
import { GameAdapterProps, TelemetryPayload } from "@/types/lesson";
import { useSound } from "@/contexts/SoundContext";

export interface MappedTrueFalseItem {
  correct_word: string;
  distractor_word: string;
  image_url: string;
}

const isEmoji = (url: string) => {
  if (!url) return false;
  return !url.includes('/') && !url.includes('.') && url.length < 10;
};

export interface TrueFalseGameConfig {
  id: string;
  items: MappedTrueFalseItem[];
}

export default function TrueFalseGame({ gameConfig, onComplete }: GameAdapterProps<TrueFalseGameConfig>) {
  const { id: gameId, items } = gameConfig;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedWord, setDisplayedWord] = useState("");
  const [isCorrectWordShown, setIsCorrectWordShown] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<"none" | "correct" | "incorrect">("none");

  const { playSound } = useSound();

  // Telemetry state
  const startTimeRef = useRef<number>(Date.now());
  const failedAttemptsRef = useRef<Set<number>>(new Set());
  const errorsRef = useRef<Array<{ questionId: string; userAnswer: string; correctAnswer: string }>>([]);

  const currentItem = items[currentIndex];

  useEffect(() => {
    // Reset timer when game starts (mount)
    startTimeRef.current = Date.now();
    failedAttemptsRef.current = new Set();
    errorsRef.current = [];
  }, [gameId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (currentItem) {
      // Randomly decide whether to show the correct word or the distractor word
      const showCorrect = Math.random() > 0.5;
      setIsCorrectWordShown(showCorrect);
      setDisplayedWord(showCorrect ? currentItem.correct_word : currentItem.distractor_word);
      setSelectedChoice(null);
      setFeedback("none");
    }
  }, [currentIndex, gameId]);

  const handleChoice = (isChoosingCorrect: boolean) => {
    if (feedback !== "none") return; // Prevent multiple clicks

    setSelectedChoice(isChoosingCorrect);
    const isCorrect = isChoosingCorrect === isCorrectWordShown;

    if (isCorrect) {
      setFeedback("correct");
      playSound('coin');
      
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.6 },
        colors: ["#10b981", "#34d399"] // green confetti
      });

      setTimeout(() => {
        if (currentIndex < items.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          // Calculate telemetry on final completion
          const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
          const totalQuestions = items.length;
          const correctFirstTry = totalQuestions - failedAttemptsRef.current.size;
          const score = Math.round((correctFirstTry / totalQuestions) * 100);

          const telemetry: TelemetryPayload = {
            score,
            durationSeconds,
            errors: errorsRef.current.length > 0 ? errorsRef.current : undefined,
          };

          onComplete(telemetry);
        }
      }, 1500);
    } else {
      setFeedback("incorrect");
      
      // Record failed attempt for telemetry
      if (!failedAttemptsRef.current.has(currentIndex)) {
        failedAttemptsRef.current.add(currentIndex);
        errorsRef.current.push({
          questionId: `${gameId}_q${currentIndex}`,
          userAnswer: isChoosingCorrect ? "Đúng" : "Sai",
          correctAnswer: isCorrectWordShown ? "Đúng" : "Sai",
        });
      }

      playSound('boing');

      // Shake animation effect for incorrect will be handled by feedback state
      setTimeout(() => {
        setFeedback("none");
        setSelectedChoice(null);
      }, 1000);
    }
  };

  if (!currentItem) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 bg-white/50 rounded-3xl p-4 shadow-inner border-2 border-dashed border-purple-200">
        {isEmoji(currentItem.image_url) ? (
          <motion.div
            key={currentItem.image_url}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex items-center justify-center text-7xl md:text-8xl select-none"
          >
            {currentItem.image_url}
          </motion.div>
        ) : (
          <motion.img
            key={currentItem.image_url}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full object-contain drop-shadow-xl"
            src={currentItem.image_url}
            alt="Game image"
          />
        )}
        
        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback === "correct" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-3xl backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.2 }}
                transition={{ type: "spring", bounce: 0.6 }}
              >
                <Check className="text-green-500 w-24 h-24 drop-shadow-lg" strokeWidth={3} />
              </motion.div>
            </motion.div>
          )}
          {feedback === "incorrect" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-3xl backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [-10, 10, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                <X className="text-red-500 w-24 h-24 drop-shadow-lg" strokeWidth={3} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={displayedWord}
          initial={{ y: 20, opacity: 0 }}
          animate={
            feedback === "incorrect" 
              ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } } 
              : { y: 0, opacity: 1, x: 0 }
          }
          exit={{ y: -20, opacity: 0 }}
          className="bg-white px-12 py-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-b-8 border-purple-200 mb-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-purple-50" />
          <h3 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 relative z-10 tracking-wide leading-normal pb-2">
            {displayedWord}
          </h3>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-6 w-full max-w-md">
        <motion.button
          whileHover={{ scale: feedback === "none" ? 1.05 : 1 }}
          whileTap={{ scale: feedback === "none" ? 0.95 : 1 }}
          animate={
            feedback === "correct" && selectedChoice === true
              ? { scale: [1, 1.1, 1], transition: { duration: 0.5, times: [0, 0.5, 1], ease: "easeInOut" } }
              : feedback === "incorrect" && selectedChoice === true
              ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
              : {}
          }
          onClick={() => { playSound('pop'); handleChoice(true); }}
          disabled={feedback !== "none"}
          className={`flex-1 bg-gradient-to-b from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 text-white font-black text-3xl py-6 rounded-3xl shadow-[0_8px_0_0_#166534] hover:shadow-[0_4px_0_0_#166534] hover:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
            feedback === "none" ? "active:shadow-none active:translate-y-2" : ""
          } ${feedback !== "none" && selectedChoice === true ? "opacity-100 z-10" : feedback !== "none" ? "opacity-50" : ""}`}
        >
          <Check size={40} strokeWidth={4} />
          Đúng
        </motion.button>
        
        <motion.button
          whileHover={{ scale: feedback === "none" ? 1.05 : 1 }}
          whileTap={{ scale: feedback === "none" ? 0.95 : 1 }}
          animate={
            feedback === "correct" && selectedChoice === false
              ? { scale: [1, 1.1, 1], transition: { duration: 0.5, times: [0, 0.5, 1], ease: "easeInOut" } }
              : feedback === "incorrect" && selectedChoice === false
              ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
              : {}
          }
          onClick={() => { playSound('pop'); handleChoice(false); }}
          disabled={feedback !== "none"}
          className={`flex-1 bg-gradient-to-b from-red-400 to-red-500 hover:from-red-300 hover:to-red-400 text-white font-black text-3xl py-6 rounded-3xl shadow-[0_8px_0_0_#991b1b] hover:shadow-[0_4px_0_0_#991b1b] hover:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
            feedback === "none" ? "active:shadow-none active:translate-y-2" : ""
          } ${feedback !== "none" && selectedChoice === false ? "opacity-100 z-10" : feedback !== "none" ? "opacity-50" : ""}`}
        >
          <X size={40} strokeWidth={4} />
          Sai
        </motion.button>
      </div>
    </div>
  );
}

