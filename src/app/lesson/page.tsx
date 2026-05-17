"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoStar, IoGameController } from "react-icons/io5";
import Flashcard from "@/components/Flashcard";
import lessonData from "@/data/sample_lesson.json";
import { useLesson } from "@/contexts/LessonContext";
import ProgressBar from "@/components/ProgressBar";

export default function LessonPage() {
  const { lesson_title, topic, flashcards, mini_games } = lessonData;
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const { currentXP, progress, setTotalActivities, markActivityCompleted } = useLesson();

  // Initialize total activities on mount: 1 for flashcards + 1 for typing + number of mini games
  useEffect(() => {
    const gamesCount = Object.keys(mini_games).length;
    setTotalActivities(1 + 1 + gamesCount); // flashcards + typing + games
  }, [mini_games, setTotalActivities]);

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  const handleStartGames = () => {
    markActivityCompleted("flashcards");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6 flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl text-purple-700 font-bold hover:bg-white/90 transition-all shadow-sm"
          >
            <IoChevronBack size={24} />
            Quay lại
          </Link>
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm">
            <IoStar className="text-yellow-400 text-2xl" />
            <span className="font-black text-purple-700 text-xl">{currentXP} XP</span>
          </div>
        </div>
        <ProgressBar progress={progress} />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 drop-shadow-sm mb-3">
            {lesson_title}
          </h1>
          <p className="text-lg md:text-xl font-bold text-purple-800/70 bg-white/40 inline-block px-6 py-2 rounded-full backdrop-blur-sm">
            Chủ đề: {topic}
          </p>
        </motion.div>

        {/* Flashcard Area */}
        <div className="w-full max-w-4xl flex items-center justify-center gap-4 md:gap-8 relative">
          {/* Left Button */}
          <motion.button
            whileHover={currentCardIndex !== 0 ? { scale: 1.1 } : {}}
            whileTap={currentCardIndex !== 0 ? { scale: 0.9 } : {}}
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
              currentCardIndex === 0
                ? "bg-white/40 text-gray-400 cursor-not-allowed"
                : "bg-white text-purple-600 hover:bg-purple-50"
            }`}
          >
            <IoChevronBack size={32} />
          </motion.button>

          {/* Card Container */}
          <div className="w-full max-w-xs sm:w-80 h-96 relative perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCardIndex}
                initial={{ opacity: 0, x: 50, rotateY: -20 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -50, rotateY: 20 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                className="absolute w-full h-full"
              >
                <Flashcard
                  word={flashcards[currentCardIndex].word}
                  wordUppercase={flashcards[currentCardIndex].word_uppercase}
                  spellingGuide={flashcards[currentCardIndex].spelling_guide}
                  exampleSentence={flashcards[currentCardIndex].example_sentence}
                  imagePrompt={flashcards[currentCardIndex].image_prompt}
                  imageUrl={flashcards[currentCardIndex].image_url}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Button */}
          <motion.button
            whileHover={currentCardIndex !== flashcards.length - 1 ? { scale: 1.1 } : {}}
            whileTap={currentCardIndex !== flashcards.length - 1 ? { scale: 0.9 } : {}}
            onClick={nextCard}
            disabled={currentCardIndex === flashcards.length - 1}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
              currentCardIndex === flashcards.length - 1
                ? "bg-white/40 text-gray-400 cursor-not-allowed"
                : "bg-white text-pink-600 hover:bg-pink-50"
            }`}
          >
            <IoChevronBack size={32} className="rotate-180" />
          </motion.button>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-3 mt-8">
          {flashcards.map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentCardIndex
                  ? "bg-pink-500 scale-125 shadow-md"
                  : "bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* Action Button to Games */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/lesson/typing"
                onClick={handleStartGames}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-black text-white text-xl rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 shadow-[0_10px_0_0_#9333ea] hover:shadow-[0_5px_0_0_#9333ea] hover:translate-y-1 transition-all"
              >
                <IoGameController size={28} className="group-hover:animate-bounce" />
                Luyện Gõ Phím!
              </Link>
            </motion.div>
        </motion.div>
      </main>

      {/* Background Decor */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
