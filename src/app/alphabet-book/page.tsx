'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Volume2, Mic, Check, ChevronLeft, ChevronRight, 
  Sparkles, Trophy, RotateCcw, BookOpen, Star
} from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';
import { useStudent } from '@/contexts/StudentContext';
import { useWebSpeech } from '@/hooks/useWebSpeech';
import confetti from 'canvas-confetti';
import VisualWorldBackground from '@/components/VisualWorldBackground';

// Kiểu dữ liệu cho mỗi chữ cái
interface AlphabetLetter {
  id: string;
  letter: string;
  uppercase: string;
  word: string;
  emoji: string;
  spelling: string;
  sentence: string;
  color: string;
  borderColor: string;
}

// 29 chữ cái tiếng Việt cùng hình ảnh và câu ví dụ sinh động
const ALPHABET_DATA: AlphabetLetter[] = [
  { id: 'a', letter: 'a', uppercase: 'A', word: 'quả na', emoji: '🍈', spelling: 'a - n - a - na', sentence: 'Bé ăn quả na chín ngọt.', color: 'from-pink-100 to-pink-200 text-pink-700', borderColor: 'border-pink-300' },
  { id: 'aw', letter: 'ă', uppercase: 'Ă', word: 'con tằm', emoji: '🐛', spelling: 'ă - t - tăm - huyền - tằm', sentence: 'Con tằm ăn lá dâu tơ.', color: 'from-orange-100 to-orange-200 text-orange-700', borderColor: 'border-orange-300' },
  { id: 'aa', letter: 'â', uppercase: 'Â', word: 'cái cân', emoji: '⚖️', spelling: 'â - c - ân - cân', sentence: 'Cái cân dùng đo cân nặng.', color: 'from-amber-100 to-amber-200 text-amber-700', borderColor: 'border-amber-300' },
  { id: 'b', letter: 'b', uppercase: 'B', word: 'quả bơ', emoji: '🥑', spelling: 'bờ - ơ - bơ', sentence: 'Quả bơ sáp béo ngậy thơm ngon.', color: 'from-yellow-100 to-yellow-200 text-yellow-700', borderColor: 'border-yellow-300' },
  { id: 'c', letter: 'c', uppercase: 'C', word: 'con cá', emoji: '🐟', spelling: 'cờ - a - ca - sắc - cá', sentence: 'Con cá bơi lội dưới làn nước.', color: 'from-lime-100 to-lime-200 text-lime-700', borderColor: 'border-lime-300' },
  { id: 'd', letter: 'd', uppercase: 'D', word: 'con dê', emoji: '🐐', spelling: 'dờ - ê - dê', sentence: 'Con dê trắng kêu he he ăn cỏ.', color: 'from-green-100 to-green-200 text-green-700', borderColor: 'border-green-300' },
  { id: 'dd', letter: 'đ', uppercase: 'Đ', word: 'quả đu đủ', emoji: '🥭', spelling: 'đờ - u - đu - dờ - u - du', sentence: 'Quả đu đủ chín vàng ngọt mát.', color: 'from-emerald-100 to-emerald-200 text-emerald-700', borderColor: 'border-emerald-300' },
  { id: 'e', letter: 'e', uppercase: 'E', word: 'em bé', emoji: '👶', spelling: 'e - m - em - bờ - ê - bê - sắc - bé', sentence: 'Em bé cười tươi chào ông bà.', color: 'from-teal-100 to-teal-200 text-teal-700', borderColor: 'border-teal-300' },
  { id: 'ee', letter: 'ê', uppercase: 'Ê', word: 'con ếch', emoji: '🐸', spelling: 'ê - ch - ếch - sắc - ếch', sentence: 'Con ếch nhảy nhót dưới trời mưa.', color: 'from-cyan-100 to-cyan-200 text-cyan-700', borderColor: 'border-cyan-300' },
  { id: 'g', letter: 'g', uppercase: 'G', word: 'con gà', emoji: '🐓', spelling: 'gờ - a - ga - huyền - gà', sentence: 'Con gà trống gáy vang ó ó o.', color: 'from-sky-100 to-sky-200 text-sky-700', borderColor: 'border-sky-300' },
  { id: 'h', letter: 'h', uppercase: 'H', word: 'bông hoa', emoji: '🌸', spelling: 'hờ - oa - hoa', sentence: 'Bông hoa hồng nở rực rỡ.', color: 'from-blue-100 to-blue-200 text-blue-700', borderColor: 'border-blue-300' },
  { id: 'i', letter: 'i', uppercase: 'I', word: 'viên bi', emoji: '🔮', spelling: 'bờ - i - bi', sentence: 'Bé chơi bi ve tròn xoe.', color: 'from-indigo-100 to-indigo-200 text-indigo-700', borderColor: 'border-indigo-300' },
  { id: 'k', letter: 'k', uppercase: 'K', word: 'cây kem', emoji: '🍦', spelling: 'cờ - em - kem', sentence: 'Cây kem dâu tây mát lạnh.', color: 'from-violet-100 to-violet-200 text-violet-700', borderColor: 'border-violet-300' },
  { id: 'l', letter: 'l', uppercase: 'L', word: 'quả lê', emoji: '🍐', spelling: 'lờ - ê - lê', sentence: 'Quả lê ngọt mát mọng nước.', color: 'from-purple-100 to-purple-200 text-purple-700', borderColor: 'border-purple-300' },
  { id: 'm', letter: 'm', uppercase: 'M', word: 'con mèo', emoji: '🐱', spelling: 'mờ - eo - meo - huyền - mèo', sentence: 'Con mèo lười sưởi nắng ấm áp.', color: 'from-fuchsia-100 to-fuchsia-200 text-fuchsia-700', borderColor: 'border-fuchsia-300' },
  { id: 'n', letter: 'n', uppercase: 'N', word: 'quả nho', emoji: '🍇', spelling: 'nhờ - o - nho', sentence: 'Chùm quả nho chín tím mọng.', color: 'from-pink-100 to-pink-200 text-pink-700', borderColor: 'border-pink-300' },
  { id: 'o', letter: 'o', uppercase: 'O', word: 'con ong', emoji: '🐝', spelling: 'o - ng - ong', sentence: 'Con ong vàng chăm chỉ hút mật.', color: 'from-rose-100 to-rose-200 text-rose-700', borderColor: 'border-rose-300' },
  { id: 'oo', letter: 'ô', uppercase: 'Ô', word: 'cái ô', emoji: '🌂', spelling: 'ô', sentence: 'Cái ô đỏ che bóng mát cho bé.', color: 'from-orange-100 to-orange-200 text-orange-700', borderColor: 'border-orange-300' },
  { id: 'ow', letter: 'ơ', uppercase: 'Ơ', word: 'lá cờ', emoji: '🚩', spelling: 'cờ - ơ - cơ - huyền - cờ', sentence: 'Lá cờ đỏ sao vàng bay phất phơ.', color: 'from-amber-100 to-amber-200 text-amber-700', borderColor: 'border-amber-300' },
  { id: 'p', letter: 'p', uppercase: 'P', word: 'đèn pin', emoji: '🔦', spelling: 'đờ - en - đen - huyền - đèn - p - in - pin', sentence: 'Đèn pin chiếu sáng trong đêm tối.', color: 'from-yellow-100 to-yellow-200 text-yellow-700', borderColor: 'border-yellow-300' },
  { id: 'q', letter: 'q', uppercase: 'Q', word: 'quả quýt', emoji: '🍊', spelling: 'quờ - yt - quýt - sắc - quýt', sentence: 'Quả quýt chua ngọt nhiều vitamin.', color: 'from-lime-100 to-lime-200 text-lime-700', borderColor: 'border-lime-300' },
  { id: 'r', letter: 'r', uppercase: 'R', word: 'con rùa', emoji: '🐢', spelling: 'rờ - ua - rua - huyền - rùa', sentence: 'Con rùa con bò chậm chạp.', color: 'from-green-100 to-green-200 text-green-700', borderColor: 'border-green-300' },
  { id: 's', letter: 's', uppercase: 'S', word: 'ngôi sao', emoji: '⭐', spelling: 'sờ - ao - sao', sentence: 'Ngôi sao lấp lánh trên trời cao.', color: 'from-teal-100 to-teal-200 text-teal-700', borderColor: 'border-teal-300' },
  { id: 't', letter: 't', uppercase: 'T', word: 'quả táo', emoji: '🍎', spelling: 'tờ - ao - tao - sắc - táo', sentence: 'Quả táo đỏ giòn ngọt thơm phức.', color: 'from-cyan-100 to-cyan-200 text-cyan-700', borderColor: 'border-cyan-300' },
  { id: 'u', letter: 'u', uppercase: 'U', word: 'cái mũ', emoji: '👒', spelling: 'mờ - u - mu - ngã - mũ', sentence: 'Cái mũ vải bảo vệ đầu bé.', color: 'from-sky-100 to-sky-200 text-sky-700', borderColor: 'border-sky-300' },
  { id: 'uw', letter: 'ư', uppercase: 'Ư', word: 'con hươu', emoji: '🦌', spelling: 'hờ - ươu - hươu', sentence: 'Con hươu sao ăn lá non trong rừng.', color: 'from-blue-100 to-blue-200 text-blue-700', borderColor: 'border-blue-300' },
  { id: 'v', letter: 'v', uppercase: 'V', word: 'con vịt', emoji: '🦆', spelling: 'vờ - yt - vịt - nặng - vịt', sentence: 'Con vịt kêu cạp cạp tìm mồi.', color: 'from-indigo-100 to-indigo-200 text-indigo-700', borderColor: 'border-indigo-300' },
  { id: 'x', letter: 'x', uppercase: 'X', word: 'cái xô', emoji: '🪣', spelling: 'sờ - ô - xô', sentence: 'Cái xô nhựa dùng đựng nước.', color: 'from-violet-100 to-violet-200 text-violet-700', borderColor: 'border-violet-300' },
  { id: 'y', letter: 'y', uppercase: 'Y', word: 'y tá', emoji: '🧑‍⚕️', spelling: 'y - tờ - a - ta - sắc - tá', sentence: 'Cô y tá dịu dàng chăm sóc bé.', color: 'from-purple-100 to-purple-200 text-purple-700', borderColor: 'border-purple-300' }
];

// Định nghĩa các trang của cuốn sách: 6 item trên 1 tờ giấy (trang) - Grid 2x3 cực kỳ thoáng và cân đối
const SPREADS = [
  { 
    left: [ALPHABET_DATA[0], ALPHABET_DATA[1], ALPHABET_DATA[2], ALPHABET_DATA[3], ALPHABET_DATA[4], ALPHABET_DATA[5]], // a ă â b c d
    right: [ALPHABET_DATA[6], ALPHABET_DATA[7], ALPHABET_DATA[8], ALPHABET_DATA[9], ALPHABET_DATA[10], ALPHABET_DATA[11]] // đ e ê g h i
  },
  { 
    left: [ALPHABET_DATA[12], ALPHABET_DATA[13], ALPHABET_DATA[14], ALPHABET_DATA[15], ALPHABET_DATA[16], ALPHABET_DATA[17]], // k l m n o ô
    right: [ALPHABET_DATA[18], ALPHABET_DATA[19], ALPHABET_DATA[20], ALPHABET_DATA[21], ALPHABET_DATA[22], ALPHABET_DATA[23]] // ơ p q r s t
  },
  { 
    left: [ALPHABET_DATA[24], ALPHABET_DATA[25], ALPHABET_DATA[26]], // u ư v
    right: [ALPHABET_DATA[27], ALPHABET_DATA[28]] // x y
  }
];

export default function AlphabetBookPage() {
  const router = useRouter();
  const { playSound, playAudio } = useSound();
  const { studentInfo, queueProgress, xp } = useStudent();
  
  // States quản lý sách và hiệu ứng lật trang 3D Flipbook
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [targetSpreadIndex, setTargetSpreadIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);

  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [exploredLetters, setExploredLetters] = useState<Record<string, boolean>>({});
  const [activeListeningId, setActiveListeningId] = useState<string | null>(null);
  const [isBookCompleted, setIsBookCompleted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [speakSuccessId, setSpeakSuccessId] = useState<string | null>(null);
  const [speakErrorId, setSpeakErrorId] = useState<string | null>(null);

  // Khởi động Web Speech
  const {
    isSpeechSupported,
    isListening,
    transcript,
    error: speechError,
    speak,
    stopSpeaking,
    startListening,
    stopListening
  } = useWebSpeech({ lang: 'vi-VN', rate: 0.82, pitch: 1.15 });

  // Tải danh sách chữ cái bé đã từng tương tác ở local
  useEffect(() => {
    try {
      const savedExplored = localStorage.getItem('viettyping_explored_letters');
      if (savedExplored) {
        setExploredLetters(JSON.parse(savedExplored));
      }
      
      const savedBookComplete = localStorage.getItem('viettyping_alphabet_book_completed');
      if (savedBookComplete === 'true') {
        setIsBookCompleted(true);
      }
    } catch (e) {
      console.error('Lỗi đọc tiến trình sách:', e);
    }
  }, []);

  // Xử lý Speech Recognition khi bé luyện đọc
  useEffect(() => {
    if (!transcript || !activeListeningId) return;

    const currentLetter = ALPHABET_DATA.find(item => item.id === activeListeningId);
    if (!currentLetter) return;

    const cleanString = (str: string) => {
      return str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };

    const targetSentence = currentLetter.sentence;
    const cleanTranscript = cleanString(transcript);
    const cleanTarget = cleanString(targetSentence);

    // Kiểm tra độ tương đồng
    const targetWords = cleanTarget.split(' ');
    const spokenWords = cleanTranscript.split(' ');
    
    let matchCount = 0;
    targetWords.forEach(w => {
      if (spokenWords.includes(w)) matchCount++;
    });

    const isMatch = (matchCount / targetWords.length) >= 0.65 || cleanTranscript.includes(cleanString(currentLetter.word));

    if (isMatch) {
      setSpeakSuccessId(activeListeningId);
      playSound('correct');
      
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.75 }
      });

      markLetterAsExplored(currentLetter.id);

      setTimeout(() => {
        setSpeakSuccessId(null);
        setTimeout(() => {
          setFlippedCards(prev => ({ ...prev, [activeListeningId]: false }));
        }, 1000);
        setActiveListeningId(null);
      }, 2500);
    } else {
      setSpeakErrorId(activeListeningId);
      playSound('wrong');
      
      setTimeout(() => {
        setSpeakErrorId(null);
      }, 2500);
    }
  }, [transcript, activeListeningId]);

  // Đánh dấu chữ cái bé đã học
  const markLetterAsExplored = (id: string) => {
    setExploredLetters(prev => {
      const updated = { ...prev, [id]: true };
      localStorage.setItem('viettyping_explored_letters', JSON.stringify(updated));
      
      // Kiểm tra xem đã học hết 29 chữ cái chưa
      const allExplored = ALPHABET_DATA.every(item => updated[item.id]);
      if (allExplored && !isBookCompleted) {
        setIsBookCompleted(true);
        localStorage.setItem('viettyping_alphabet_book_completed', 'true');
        setTimeout(() => {
          playSound('tada');
          setShowCompletionModal(true);
        }, 1500);
      }
      
      return updated;
    });
  };

  // Phát âm chữ cái ngắn gọn: "A - quả na"
  const handlePlayAudio = (e: React.MouseEvent, letter: AlphabetLetter) => {
    e.stopPropagation();
    stopSpeaking();
    stopListening();
    setActiveListeningId(null);
    
    const textToSpeak = `${letter.uppercase}, ${letter.word}.`;
    speak(textToSpeak, 'vi-VN');
    markLetterAsExplored(letter.id);
  };

  // Phát âm câu ví dụ
  const handlePlaySentence = (e: React.MouseEvent, letter: AlphabetLetter) => {
    e.stopPropagation();
    stopSpeaking();
    speak(letter.sentence, 'vi-VN');
  };

  // Kích hoạt Micro luyện đọc
  const handleStartMic = (e: React.MouseEvent, letter: AlphabetLetter) => {
    e.stopPropagation();
    if (activeListeningId === letter.id && isListening) {
      stopListening();
      setActiveListeningId(null);
      playSound('click');
    } else {
      playSound('click');
      setActiveListeningId(letter.id);
      startListening('vi-VN');
    }
  };

  // Lật card 3D
  const handleCardFlip = (id: string) => {
    if (activeListeningId) {
      stopListening();
      setActiveListeningId(null);
    }
    playSound('pop');
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Kích hoạt hiệu ứng lật trang 3D Flipbook
  const changeSpread = (direction: 'next' | 'prev') => {
    if (isFlipping) return;

    stopSpeaking();
    stopListening();
    setActiveListeningId(null);

    const nextIndex = direction === 'next' ? currentSpreadIndex + 1 : currentSpreadIndex - 1;
    if (nextIndex < 0 || nextIndex >= SPREADS.length) return;

    playSound('click');
    
    setFlipDirection(direction);
    setIsFlipping(true);
    setTargetSpreadIndex(nextIndex);

    setTimeout(() => {
      setCurrentSpreadIndex(nextIndex);
    }, 300);

    setTimeout(() => {
      setIsFlipping(false);
      setFlipDirection(null);
    }, 600);
  };

  // Hoàn thành cuốn sách, nhận thưởng 200 XP
  const handleClaimReward = () => {
    playSound('coin');
    queueProgress('viettyping_alphabet_book', 100, 20, 100);
    setShowCompletionModal(false);
    router.push('/');
  };

  // Học lại từ đầu
  const handleResetProgress = () => {
    if (confirm('Bé có muốn học lại Cuốn Sách Chữ Cái từ đầu không?')) {
      playSound('click');
      setExploredLetters({});
      setFlippedCards({});
      setIsBookCompleted(false);
      localStorage.removeItem('viettyping_explored_letters');
      localStorage.removeItem('viettyping_alphabet_book_completed');
      setCurrentSpreadIndex(0);
      setTargetSpreadIndex(0);
    }
  };

  // Số lượng chữ cái đã khám phá
  const exploredCount = ALPHABET_DATA.filter(item => exploredLetters[item.id]).length;
  const progressPercent = Math.round((exploredCount / ALPHABET_DATA.length) * 100);

  // Render các chữ cái trên một trang (Lưới 2x3 rộng rãi thoải mái)
  const renderPageSide = (letters: AlphabetLetter[], pageNum: number, isRightPage: boolean) => {
    return (
      <div className={`flex flex-col justify-between h-full p-5 md:p-7 bg-amber-50/20 rounded-2xl relative select-none ${isRightPage ? 'border-l border-stone-200' : ''}`}>
        
        {/* Lưới 6 chữ cái trong trang sách - Grid 2x3 cực thoáng */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 flex-1 items-stretch py-2">
          {letters.map((item) => {
            const isFlipped = !!flippedCards[item.id];
            const isExplored = !!exploredLetters[item.id];
            const isListeningThis = activeListeningId === item.id;
            const isSuccess = speakSuccessId === item.id;
            const isError = speakErrorId === item.id;

            return (
              <div 
                key={item.id}
                className="h-full w-full perspective-1000 cursor-pointer"
                onClick={() => handleCardFlip(item.id)}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d transition-transform duration-500"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  
                  {/* MẶT TRƯỚC: Grid chứa chữ cái, hình ảnh, từ vựng và câu ví dụ hiển thị rõ ràng */}
                  <div
                    className={`absolute inset-0 backface-hidden rounded-3xl p-3 md:p-4 flex flex-col items-center justify-between border-3 bg-gradient-to-b ${item.color} ${item.borderColor} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]`}
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {/* Badge đã học */}
                    {isExplored && (
                      <span className="absolute top-2 right-2 text-emerald-500 bg-white border border-emerald-300 rounded-full p-0.5 shadow-sm text-xs" title="Bé đã học xong">
                        <Check size={11} className="stroke-[3]" />
                      </span>
                    )}

                    {/* Chữ cái in hoa + in thường */}
                    <div className="text-center">
                      <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wide drop-shadow-sm select-none">
                        {item.uppercase} {item.letter}
                      </span>
                    </div>

                    {/* Hình ảnh Emoji lớn rõ nét */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/80 rounded-full border border-white/60 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl shadow-inner transform hover:scale-105 transition-transform select-none">
                      {item.emoji}
                    </div>

                    {/* Từ khóa + Nút phát âm */}
                    <div className="w-full flex items-center justify-between px-1 shrink-0">
                      <span className="text-xs sm:text-sm md:text-base font-black text-slate-800 tracking-wide capitalize truncate max-w-[80%]">
                        {item.word}
                      </span>
                      <motion.button
                        onClick={(e) => handlePlayAudio(e, item)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 bg-white rounded-full text-slate-700 border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 cursor-pointer"
                        title="Nghe phát âm"
                      >
                        <Volume2 size={12} className="stroke-[2.5]" />
                      </motion.button>
                    </div>

                    {/* Câu ví dụ hiển thị to rõ nét ở mặt trước */}
                    <div className="w-full bg-white/40 border border-white/50 rounded-xl px-2 py-1 text-center shrink-0 min-h-[36px] md:min-h-[42px] flex items-center justify-center">
                      <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug line-clamp-2">
                        {item.sentence}
                      </p>
                    </div>
                  </div>

                  {/* MẶT SAU: Đánh vần chi tiết và luyện đọc giọng nói */}
                  <div
                    className="absolute inset-0 backface-hidden rounded-3xl p-3 md:p-4 flex flex-col justify-between border-3 bg-white border-indigo-200 shadow-[3px_3px_0px_0px_rgba(99,102,241,0.1)]"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)' 
                    }}
                  >
                    {/* Đánh vần */}
                    <div className="text-center bg-indigo-50 border border-indigo-100 rounded-xl py-1.5 px-3 shrink-0">
                      <p className="text-[10px] sm:text-xs font-black text-indigo-700 tracking-wide">
                        Đánh vần: {item.spelling}
                      </p>
                    </div>

                    {/* Câu ví dụ */}
                    <div className="flex-1 flex flex-col items-center justify-center my-1.5 overflow-hidden">
                      <p className="text-xs sm:text-sm md:text-base font-black text-slate-800 text-center leading-relaxed px-1">
                        {item.sentence}
                      </p>
                    </div>

                    {/* Bộ điều khiển tương tác */}
                    <div className="flex items-center justify-center gap-3 shrink-0">
                      {/* Nút nghe lại câu */}
                      <button
                        onClick={(e) => handlePlaySentence(e, item)}
                        className="w-8 h-8 sm:w-9 h-9 rounded-full border-2 border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center shadow-sm hover:bg-slate-100 active:scale-95 cursor-pointer"
                        title="Nghe câu mẫu"
                      >
                        <Volume2 size={13} />
                      </button>

                      {/* Nút Micro luyện nói */}
                      {isSpeechSupported && (
                        <button
                          onClick={(e) => handleStartMic(e, item)}
                          className={`w-9 h-9 sm:w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-all cursor-pointer ${
                            isListeningThis
                              ? 'bg-rose-500 ring-4 ring-rose-200 animate-pulse'
                              : isSuccess
                                ? 'bg-emerald-500'
                                : isError
                                  ? 'bg-amber-500'
                                  : 'bg-indigo-600 hover:bg-indigo-700'
                          }`}
                          title="🎤 Bấm và đọc to câu mẫu!"
                        >
                          {isSuccess ? <Check size={16} className="stroke-[3]" /> : <Mic size={16} />}
                        </button>
                      )}
                    </div>

                    {/* Trạng thái bé đọc giọng nói */}
                    <div className="text-center leading-none mt-1 h-3">
                      {isListeningThis && (
                        <span className="text-[9px] text-red-500 font-extrabold animate-pulse">⚡ Bé hãy nói câu mẫu...</span>
                      )}
                      {isSuccess && (
                        <span className="text-[9px] text-emerald-600 font-black animate-bounce block">✨ Bé phát âm giỏi quá!</span>
                      )}
                      {isError && (
                        <span className="text-[9px] text-amber-600 font-bold block">😅 Bé hãy đọc lại nhé!</span>
                      )}
                    </div>
                  </div>

                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Số trang sách */}
        <div className={`text-[10px] font-bold text-slate-400 absolute bottom-2 ${isRightPage ? 'right-6' : 'left-6'}`}>
          Trang {pageNum}
        </div>
      </div>
    );
  };

  const currentSpread = SPREADS[currentSpreadIndex];
  const targetSpread = SPREADS[targetSpreadIndex];

  return (
    <VisualWorldBackground>
      <div className="min-h-screen text-[var(--color-foreground)] flex flex-col pb-6 relative z-10">
        
        {/* Navigation Sticky Header - Gom toàn bộ thông tin chỉ số và hướng dẫn học lên đây */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-4 border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSound('click');
                router.push('/');
              }}
              className="w-10 h-10 rounded-xl border-2 border-slate-800 bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              title="Quay lại trang chủ"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-xs md:text-sm font-black uppercase tracking-wide text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>SÁCH CHỮ CÁI KỲ THÚ</span>
              </h1>
              {/* Dòng hướng dẫn chạy phụ nhỏ */}
              <p className="hidden md:block text-[9px] font-bold text-slate-500 mt-0.5 leading-none">
                Bé bấm chữ nghe Dino đọc mẫu (ví dụ: <strong className="text-amber-600">"A, quả na"</strong>). Lật card để luyện nói!
              </p>
            </div>
          </div>

          {/* Khối Tiến trình học của bé tích hợp ngay trung tâm Header */}
          <div className="hidden lg:flex flex-col items-center gap-1.5 flex-1 max-w-sm px-6">
            <div className="flex justify-between w-full text-[10px] font-black text-slate-700 leading-none">
              <span>🎒 Bé đã học: <strong className="text-indigo-660">{exploredCount} / 29</strong> chữ cái</span>
              <span className="text-indigo-600">{progressPercent}%</span>
            </div>
            {/* Progress Bar tinh xảo nằm gọn trong Header */}
            <div className="w-full bg-slate-100 border-2 border-slate-800 rounded-full h-3 p-0.5 overflow-hidden shadow-inner relative">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
              {progressPercent > 0 && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -mt-0.5 text-[10px] transition-all duration-300 select-none pointer-events-none animate-bounce"
                  style={{ left: `calc(${progressPercent}% - 6px)` }}
                >
                  ⭐
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Điểm XP */}
            <span className="text-xs font-black bg-yellow-100 border-2 border-slate-800 px-2.5 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span>{xp} XP</span>
            </span>

            {/* Học lại */}
            <button
              onClick={handleResetProgress}
              className="px-2.5 py-1.5 border-2 border-slate-800 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs flex items-center gap-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none cursor-pointer"
              title="Học lại từ đầu"
            >
              <RotateCcw size={11} />
              <span className="hidden sm:inline">Học lại</span>
            </button>
          </div>
        </header>

        {/* Nội dung chính: Thiết kế FLUID khổng lồ, để quyển sách nổi bật nhất chiếm trọn trung tâm */}
        <main className="flex-1 w-full max-w-[95vw] lg:max-w-[90vw] mx-auto px-1 md:px-4 pt-4 pb-2 flex flex-col justify-center items-center relative">
          
          {/* Lớp hiển thị tiến độ trên mobile (nếu màn hình nhỏ hơn lg) */}
          <div className="lg:hidden flex items-center justify-between w-full max-w-xl bg-white/70 backdrop-blur-sm border-2 border-slate-800 rounded-xl px-3 py-1.5 mb-3 text-[10px] font-black text-slate-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <span>🎒 Bé học: <strong className="text-indigo-600">{exploredCount}/29</strong> chữ</span>
            <div className="w-24 bg-slate-100 border border-slate-800 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <span>{progressPercent}%</span>
          </div>

          {/* QUYỂN SÁCH MỞ ĐÔI FLUID KHỔNG LỒ */}
          <div className="w-full flex items-stretch h-[calc(100vh-160px)] min-h-[500px] max-h-[800px] relative">
            
            {/* Nút lật trang trái absolute ở rìa trái sách */}
            <div className="absolute left-1 md:-left-6 top-1/2 -translate-y-1/2 z-30">
              <motion.button
                whileHover={{ scale: currentSpreadIndex > 0 ? 1.08 : 1 }}
                whileTap={{ scale: currentSpreadIndex > 0 ? 0.92 : 1 }}
                onClick={() => changeSpread('prev')}
                disabled={currentSpreadIndex === 0 || isFlipping}
                className={`w-11 h-11 sm:w-14 sm:h-14 bg-white border-3 border-slate-800 rounded-full flex items-center justify-center text-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none hover:bg-indigo-50 transition-all cursor-pointer ${
                  currentSpreadIndex === 0 || isFlipping ? 'opacity-30 cursor-not-allowed shadow-none border-slate-300 text-slate-300 bg-slate-50' : ''
                }`}
                title="Trang trước"
              >
                <ChevronLeft size={24} className="stroke-[3]" />
              </motion.button>
            </div>

            {/* Vỏ bìa sách giả lập gỗ dày dặn */}
            <div className="bg-[#783e16] p-2 md:p-3 rounded-[30px] shadow-[0_24px_56px_rgba(0,0,0,0.3)] border-4 border-amber-950/80 w-full h-full flex relative overflow-hidden z-10">
              
              {/* Trang ruột sách giấy cổ điển mở đôi */}
              <div className="bg-[#fdf9f4] border-4 border-amber-900 rounded-[20px] w-full h-full flex flex-col md:flex-row overflow-hidden relative shadow-inner">
                
                {/* TRANG TRÁI TĨNH */}
                <div className="flex-1 h-full md:block">
                  <div className="md:hidden w-full h-full">
                    {renderPageSide(currentSpread.left, currentSpreadIndex * 2 + 1, false)}
                  </div>
                  <div className="hidden md:block w-full h-full">
                    {renderPageSide(currentSpread.left, currentSpreadIndex * 2 + 1, false)}
                  </div>
                </div>

                {/* GÁY SÁCH Ở GIỮA */}
                <div className="hidden md:flex w-7.5 bg-gradient-to-r from-stone-200 via-stone-400 to-stone-200 border-l border-r border-stone-300/80 flex-col items-center justify-between py-8 shrink-0 relative z-30">
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-amber-900/20 border-dashed border-r border-amber-900/10" />
                  <div className="w-2.5 h-2.5 bg-slate-500/80 rounded-full border border-slate-650 shadow-md" />
                  <div className="w-2.5 h-2.5 bg-slate-500/80 rounded-full border border-slate-650 shadow-md" />
                  <div className="w-2.5 h-2.5 bg-slate-500/80 rounded-full border border-slate-650 shadow-md" />
                  <div className="w-2.5 h-2.5 bg-slate-500/80 rounded-full border border-slate-650 shadow-md" />
                  <div className="w-2.5 h-2.5 bg-slate-500/80 rounded-full border border-slate-650 shadow-md" />
                </div>

                {/* TRANG PHẢI TĨNH */}
                <div className="flex-1 h-full hidden md:block">
                  {currentSpread.right ? renderPageSide(currentSpread.right, currentSpreadIndex * 2 + 2, true) : null}
                </div>

                {/* TRANG GIẤY LẬT 3D GIẢ LẬP (FLIPPING PAGE) */}
                <AnimatePresence>
                  {isFlipping && flipDirection && (
                    <motion.div
                      className="absolute top-0 bottom-0 z-20 pointer-events-none hidden md:block"
                      style={{
                        left: '50%',
                        width: '50%',
                        transformStyle: 'preserve-3d',
                        originX: 0,
                      }}
                      initial={{ rotateY: flipDirection === 'next' ? 0 : -180 }}
                      animate={{ rotateY: flipDirection === 'next' ? -180 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                      {/* Mặt trước của trang lật */}
                      <div 
                        className="absolute inset-0 bg-[#fdf9f4] rounded-r-[20px] border-r-4 border-amber-900 backface-hidden"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {flipDirection === 'next' 
                          ? (SPREADS[targetSpreadIndex - 1].right ? renderPageSide(SPREADS[targetSpreadIndex - 1].right, (targetSpreadIndex - 1) * 2 + 2, true) : null)
                          : renderPageSide(SPREADS[targetSpreadIndex].left, targetSpreadIndex * 2 + 1, false)
                        }
                      </div>

                      {/* Mặt sau của trang lật */}
                      <div 
                        className="absolute inset-0 bg-[#fdf9f4] rounded-l-[20px] border-l-4 border-amber-900 backface-hidden"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg) scaleX(-1)',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {flipDirection === 'next'
                          ? renderPageSide(SPREADS[targetSpreadIndex].left, targetSpreadIndex * 2 + 1, false)
                          : (SPREADS[targetSpreadIndex + 1]?.right ? renderPageSide(SPREADS[targetSpreadIndex + 1].right, (targetSpreadIndex + 1) * 2 + 2, true) : null)
                        }
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* Nút lật trang phải absolute ở rìa phải sách */}
            <div className="absolute right-1 md:-right-6 top-1/2 -translate-y-1/2 z-30">
              <motion.button
                whileHover={{ scale: currentSpreadIndex < SPREADS.length - 1 ? 1.08 : 1 }}
                whileTap={{ scale: currentSpreadIndex < SPREADS.length - 1 ? 0.92 : 1 }}
                onClick={() => changeSpread('next')}
                disabled={currentSpreadIndex === SPREADS.length - 1 || isFlipping}
                className={`w-11 h-11 sm:w-14 sm:h-14 bg-white border-3 border-slate-800 rounded-full flex items-center justify-center text-slate-800 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none hover:bg-indigo-50 transition-all cursor-pointer ${
                  currentSpreadIndex === SPREADS.length - 1 || isFlipping ? 'opacity-30 cursor-not-allowed shadow-none border-slate-300 text-slate-300 bg-slate-50' : ''
                }`}
                title="Trang tiếp"
              >
                <ChevronRight size={24} className="stroke-[3]" />
              </motion.button>
            </div>

          </div>

        </main>

        {/* MODAL HOÀN THÀNH HỌC TẬP (Claim 200 XP) */}
        <AnimatePresence>
          {showCompletionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="relative w-full max-w-md bg-amber-50 border-4 border-slate-800 rounded-[32px] p-6 text-center shadow-[0_24px_48px_rgba(0,0,0,0.2)] overflow-hidden z-10"
              >
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-yellow-200/50 to-transparent pointer-events-none" />

                <div className="relative mx-auto w-24 h-24 bg-gradient-to-tr from-yellow-400 via-orange-400 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-250 animate-bounce">
                  <Trophy className="text-white w-12 h-12" />
                </div>

                <h3 className="text-2xl font-black text-slate-800 mb-2">
                  Tuyệt Vời Ông Mặt Trời!
                </h3>
                
                <p className="text-sm font-extrabold text-slate-500 leading-relaxed mb-6 px-2">
                  Chào {studentInfo?.nickname || 'Dũng Sĩ'}! Bé đã hoàn thành đọc và luyện nói toàn bộ 29 chữ cái Tiếng Việt một cách xuất sắc rồi đó!
                </p>

                <div className="bg-yellow-100 border-2 border-dashed border-yellow-400 rounded-2xl p-4 flex items-center justify-center gap-3 mb-6 shadow-inner">
                  <span className="text-3xl">🎁</span>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-yellow-600 uppercase tracking-wider">Phần thưởng của bé</p>
                    <p className="text-lg font-black text-slate-800">+200 Điểm Kinh Nghiệm (XP)</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClaimReward}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 border-2 border-slate-800 text-white font-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} className="animate-spin" />
                  <span>Nhận thưởng thôi! 🚀</span>
                </motion.button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </VisualWorldBackground>
  );
}
