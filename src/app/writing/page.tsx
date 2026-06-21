'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Sparkles, RefreshCw, Eye, Check, ChevronRight, AlertCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

import { WRITING_ALPHABET_DATA, AlphabetWritingData, WritingStroke, Point } from './writingData';
import { useSound } from '@/contexts/SoundContext';
import { useStudent } from '@/contexts/StudentContext';
import DinoMascot from '@/components/DinoMascot';

// Hàm tính khoảng cách từ một điểm P đến một đoạn thẳng AB
function getDistanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (dx === 0 && dy === 0) {
    return Math.hypot(p.x - a.x, p.y - a.y);
  }
  
  // Chiếu điểm P lên đoạn thẳng AB, tìm hệ số hình chiếu t
  const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
  
  if (t < 0) {
    return Math.hypot(p.x - a.x, p.y - a.y); // Gần điểm A nhất
  }
  if (t > 1) {
    return Math.hypot(p.x - b.x, p.y - b.y); // Gần điểm B nhất
  }
  
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;
  return Math.hypot(p.x - projX, p.y - projY);
}

export default function WritingPractice() {
  const router = useRouter();
  const { playSound } = useSound();
  const { queueProgress, xp } = useStudent();

  // Chữ cái đang được chọn để tập viết
  const [currentLetterIdx, setCurrentLetterIdx] = useState(0);
  const currentLetter = WRITING_ALPHABET_DATA[currentLetterIdx];

  // Nét vẽ hiện tại trẻ cần vẽ
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const currentStroke = currentLetter?.strokes[currentStrokeIndex];

  // Lưu trữ các nét vẽ tay tự do của bé
  const [userPathPoints, setUserPathPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Trạng thái vẽ sai nét
  const [isStrokeError, setIsStrokeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hiệu ứng rung lắc bảng vẽ khi vẽ sai
  const [shakeTrigger, setShakeTrigger] = useState(0);

  // Trạng thái Demo tự động viết mẫu
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [demoPoints, setDemoPoints] = useState<Point[]>([]);
  const [demoCursor, setDemoCursor] = useState<Point | null>(null);

  // Danh sách các chữ cái đã hoàn thành luyện viết thành công trong session này
  const [completedLetterIds, setCompletedLetterIds] = useState<string[]>([]);

  // Trạng thái hiển thị chúc mừng hoàn thành chữ cái
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Phát âm chữ cái khi thay đổi chữ cái hoặc bấm nút
  const speakLetter = (letter: string, word: string) => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    
    synth.cancel();
    
    // Theo yêu cầu của bé 6 tuổi, phát âm gọn gàng: ví dụ "a, quả na"
    const textToSpeak = `${letter}, ${word}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'vi-VN';
    
    // Tìm giọng đọc tiếng Việt sinh động
    const voices = synth.getVoices();
    const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VN'));
    if (viVoice) {
      utterance.voice = viVoice;
    }
    utterance.rate = 0.85; // Đọc chậm rãi, rõ ràng cho bé dễ nghe
    
    synth.speak(utterance);
  };

  // Tự động phát âm thanh khi đổi chữ cái
  useEffect(() => {
    if (currentLetter) {
      setCurrentStrokeIndex(0);
      setUserPathPoints([]);
      setIsDrawing(false);
      setIsStrokeError(false);
      setErrorMessage(null);
      
      const timer = setTimeout(() => {
        speakLetter(currentLetter.letter, currentLetter.word);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentLetterIdx]);

  // Load danh sách các chữ cái đã hoàn thành từ LocalStorage khi khởi động
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('viettyping_completed_writing');
      if (saved) {
        try {
          setCompletedLetterIds(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Hàm chuyển đổi danh sách điểm sang định dạng chuỗi SVG Path
  const getMedianPath = (points: Point[]): string => {
    if (points.length === 0) return '';
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  };

  // Hàm nội suy đường cong Bezier bậc 2 để làm mượt nét vẽ phấn tự do của bé
  const getBezierPath = (points: Point[]): string => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y} A 2 2 0 1 1 ${points[0].x} ${points[0].y - 0.1}`;
    if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      d += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
    }
    d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    return d;
  };

  // Demo hoạt họa viết mẫu
  const playDemo = async () => {
    if (isDemoPlaying || !currentLetter) return;
    setIsDemoPlaying(true);
    setUserPathPoints([]);
    setIsStrokeError(false);
    setErrorMessage(null);
    playSound('click');

    // Hàm nội suy mịn tuyến tính giữa các điểm để tạo hoạt ảnh vẽ trơn tru
    const getFinePoints = (points: Point[], segments: number = 6): Point[] => {
      if (points.length < 2) return points;
      const finePoints: Point[] = [];
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        for (let j = 0; j < segments; j++) {
          const t = j / segments;
          finePoints.push({
            x: p1.x + (p2.x - p1.x) * t,
            y: p1.y + (p2.y - p1.y) * t
          });
        }
      }
      finePoints.push(points[points.length - 1]);
      return finePoints;
    };

    // Chạy demo lần lượt từng nét vẽ
    for (let strokeIdx = 0; strokeIdx < currentLetter.strokes.length; strokeIdx++) {
      const stroke = currentLetter.strokes[strokeIdx];
      const fineMedians = getFinePoints(stroke.medians, 6);
      
      setDemoPoints([]);
      
      for (let i = 0; i < fineMedians.length; i++) {
        setDemoCursor(fineMedians[i]);
        setDemoPoints(prev => [...prev, fineMedians[i]]);
        // Chờ 12ms giữa các điểm để nét vẽ di chuyển cực kỳ mượt mà
        await new Promise(resolve => setTimeout(resolve, 12));
      }
      
      // Chờ một khoảng nghỉ ngắn giữa các nét vẽ
      await new Promise(resolve => setTimeout(resolve, 350));
    }

    setDemoPoints([]);
    setDemoCursor(null);
    setIsDemoPlaying(false);
  };

  // Nhận diện tọa độ chuột/tay trên SVG và scale về hệ 500x500
  const getSVGCoords = (e: React.PointerEvent<SVGSVGElement>): Point | null => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 500;
    const y = ((e.clientY - rect.top) / rect.height) * 500;
    return { x, y };
  };

  // Bắt đầu chạm vẽ
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDemoPlaying || showSuccessModal) return;
    
    // Đảm bảo bắt pointer capture để theo dõi di chuyển chuột ra ngoài vùng vẽ
    e.currentTarget.setPointerCapture(e.pointerId);
    
    const coord = getSVGCoords(e);
    if (coord) {
      setIsDrawing(true);
      setUserPathPoints([coord]);
      setIsStrokeError(false);
      setErrorMessage(null);
    }
  };

  // Đang di chuyển vẽ
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawing || isDemoPlaying || showSuccessModal) return;
    
    const coord = getSVGCoords(e);
    if (coord) {
      setUserPathPoints(prev => {
        // Chỉ thêm điểm mới nếu khoảng cách tới điểm cũ đủ xa để tránh lặp điểm thừa
        const last = prev[prev.length - 1];
        if (last && Math.hypot(coord.x - last.x, coord.y - last.y) < 3) {
          return prev;
        }
        return [...prev, coord];
      });
    }
  };

  // Kết thúc nhấc tay vẽ
  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    e.currentTarget.releasePointerCapture(e.pointerId);

    // Kiểm tra nét vẽ có hợp lệ hay không
    if (!currentStroke) return;

    const result = checkStrokeMatch(userPathPoints, currentStroke.medians);

    if (result.success) {
      // Bé vẽ đúng nét!
      playSound('correct');
      
      const nextStrokeIdx = currentStrokeIndex + 1;
      
      if (nextStrokeIdx >= currentLetter.strokes.length) {
        // Hoàn thành xuất sắc toàn bộ chữ cái!
        handleLetterCompletion();
      } else {
        // Vẽ đúng, chuyển sang nét tiếp theo
        setCurrentStrokeIndex(nextStrokeIdx);
        setUserPathPoints([]);
      }
    } else {
      // Bé vẽ sai nét! Rung lắc bảng vẽ, phát âm thanh báo sai
      playSound('wrong');
      setIsStrokeError(true);
      setShakeTrigger(prev => prev + 1);

      // Đưa ra gợi ý thông báo dễ hiểu cho bé
      if (result.reason === 'too_short') {
        setErrorMessage('Bé ơi, hãy vẽ một nét dài hơn nhé!');
      } else if (result.reason === 'wrong_start') {
        setErrorMessage('Hãy đặt bút vào điểm nhấp nháy màu cam nhé!');
      } else if (result.reason === 'wrong_direction') {
        setErrorMessage('Bé đã vẽ sai hướng rồi, hãy vẽ theo chiều mũi tên nhé!');
      } else {
        setErrorMessage('Nét vẽ hơi lệch rồi, bé viết cẩn thận hơn nhé!');
      }

      // Xóa nét vẽ tay lỗi sau 1.5 giây để bé vẽ lại
      setTimeout(() => {
        setUserPathPoints([]);
        setIsStrokeError(false);
      }, 1500);
    }
  };

  // Thuật toán so khớp nét vẽ (Cosine Similarity & Euclidean Distance)
  const checkStrokeMatch = (
    points: Point[],
    medians: Point[]
  ): { success: boolean; reason?: 'too_short' | 'wrong_direction' | 'too_far' | 'wrong_start' | 'wrong_end' } => {
    if (points.length < 2 || medians.length < 2) {
      return { success: false, reason: 'too_short' };
    }

    // 1. Tính tổng độ dài nét vẽ của bé
    let totalLength = 0;
    for (let i = 1; i < points.length; i++) {
      totalLength += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    }
    
    // Nếu bé vẽ quá ngắn (bé chỉ bấm chấm hoặc quẹt nhẹ)
    if (totalLength < 25) {
      return { success: false, reason: 'too_short' };
    }

    // 2. Kiểm tra khoảng cách đặt bút (Start Point) và nhấc bút (End Point)
    // Cho phép khoảng cách lệch tối đa 90 đơn vị trong hệ 500x500
    const startDistance = Math.hypot(points[0].x - medians[0].x, points[0].y - medians[0].y);
    const endDistance = Math.hypot(points[points.length - 1].x - medians[medians.length - 1].x, points[points.length - 1].y - medians[medians.length - 1].y);

    if (startDistance > 90) {
      return { success: false, reason: 'wrong_start' };
    }
    
    // Với một số nét tròn khép kín (như nét cong kín của chữ o, a), điểm kết thúc sẽ quay lại điểm bắt đầu.
    // Nếu nét không khép kín thì cũng cần kiểm tra khoảng cách nhấc bút.
    const isClosedStroke = Math.hypot(medians[0].x - medians[medians.length - 1].x, medians[0].y - medians[medians.length - 1].y) < 20;
    
    if (!isClosedStroke && endDistance > 90) {
      return { success: false, reason: 'wrong_end' };
    }

    // 3. Kiểm tra hướng viết (Cosine Similarity)
    // Tính vector đại diện nét vẽ của bé và nét chuẩn
    const userVector = {
      x: points[points.length - 1].x - points[0].x,
      y: points[points.length - 1].y - points[0].y
    };
    const targetVector = {
      x: medians[medians.length - 1].x - medians[0].x,
      y: medians[medians.length - 1].y - medians[0].y
    };

    const lenUser = Math.hypot(userVector.x, userVector.y);
    const lenTarget = Math.hypot(targetVector.x, targetVector.y);

    // Chỉ kiểm tra hướng đối với các nét có tính định hướng dài rõ ràng (không phải nét quá tròn khép kín)
    if (!isClosedStroke && lenUser > 30 && lenTarget > 30) {
      const dotProduct = userVector.x * targetVector.x + userVector.y * targetVector.y;
      const cosineSimilarity = dotProduct / (lenUser * lenTarget);
      
      // Nếu vẽ ngược hướng hoàn toàn (cosine < 0.65)
      if (cosineSimilarity < 0.65) {
        return { success: false, reason: 'wrong_direction' };
      }
    }

    // 4. Kiểm tra khoảng cách lệch trung bình (Euclidean Distance)
    // Tính khoảng cách trung bình từ từng điểm vẽ tay đến các phân đoạn xương nét chuẩn
    let totalSegmentDist = 0;
    for (const p of points) {
      let minDistance = Infinity;
      for (let j = 0; j < medians.length - 1; j++) {
        const d = getDistanceToSegment(p, medians[j], medians[j + 1]);
        if (d < minDistance) {
          minDistance = d;
        }
      }
      totalSegmentDist += minDistance;
    }
    
    const meanDistance = totalSegmentDist / points.length;

    // Ngưỡng khoảng cách cho phép là 55 đơn vị
    if (meanDistance > 55) {
      return { success: false, reason: 'too_far' };
    }

    return { success: true };
  };

  // Xử lý khi hoàn thành toàn bộ chữ cái
  const handleLetterCompletion = () => {
    // 1. Lưu trạng thái hoàn thành chữ cái
    const nextCompleted = [...completedLetterIds];
    if (!nextCompleted.includes(currentLetter.id)) {
      nextCompleted.push(currentLetter.id);
      setCompletedLetterIds(nextCompleted);
      localStorage.setItem('viettyping_completed_writing', JSON.stringify(nextCompleted));
    }

    // 2. Bắn pháo hoa rực rỡ ăn mừng
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6']
    });

    // 3. Phát âm thanh chiến thắng
    playSound('complete');

    // 4. Cộng 150 XP và đồng bộ tiến trình thông qua StudentContext
    queueProgress(`writing_${currentLetter.id}`, 100, 0, 100);

    // 5. Hiển thị thông báo chúc mừng
    setShowSuccessModal(true);

    // 6. Đọc to từ ngữ minh họa để bé học nhận diện qua tiếng nói
    setTimeout(() => {
      speakLetter(currentLetter.letter, currentLetter.word);
    }, 1200);
  };

  // Chuyển sang chữ cái tiếp theo
  const handleNextLetter = () => {
    setShowSuccessModal(false);
    if (currentLetterIdx < WRITING_ALPHABET_DATA.length - 1) {
      setCurrentLetterIdx(prev => prev + 1);
    } else {
      // Đã viết hết bảng chữ cái, quay lại chữ đầu tiên
      setCurrentLetterIdx(0);
    }
  };

  // Viết lại từ đầu chữ cái hiện tại
  const handleReset = () => {
    playSound('click');
    setCurrentStrokeIndex(0);
    setUserPathPoints([]);
    setIsDrawing(false);
    setIsStrokeError(false);
    setErrorMessage(null);
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[var(--color-surface)] border-b-4 border-[var(--color-foreground)] px-4 md:px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => playSound('click')}
            className="p-2 border-3 border-[var(--color-foreground)] rounded-xl bg-[var(--color-background)] shadow-[2px_2px_0px_0px_var(--color-foreground)] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-lg md:text-xl font-black bg-gradient-to-r from-emerald-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent filter drop-shadow-[0.5px_0.5px_0px_rgba(0,0,0,0.1)] select-none">
            Bảng Viết Chữ Lớp 1 ✏️
          </span>
        </div>

        {/* Gamification Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[var(--color-foreground)] bg-yellow-50 text-yellow-800 text-xs font-black shadow-[1.5px_1.5px_0px_var(--color-foreground)]">
            <Award className="w-4 h-4 text-yellow-600" />
            <span>{xp} XP</span>
          </div>
          <span className="bg-indigo-50 text-indigo-700 border-2 border-[var(--color-foreground)] px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_var(--color-foreground)]">
            TẬP VIẾT CHỮ CÁI
          </span>
        </div>
      </header>

      {/* Main Grid Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* CỘT TRÁI: Bảng đen viết phấn (chiếm 7/12 cột) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center gap-4">
          
          {/* Nhãn gợi ý đặt bút & thông tin nét */}
          <div className="w-full flex items-center justify-between px-2">
            <div className="flex flex-col">
              <span className="text-xs font-black text-[var(--color-foreground)]/65 uppercase tracking-wide">
                Chữ {currentLetter.letter.toUpperCase()} (nét {currentStrokeIndex + 1}/{currentLetter.strokes.length})
              </span>
              <span className="text-sm font-black text-[var(--color-foreground)] mt-0.5">
                {currentStroke ? currentStroke.name : 'Đã hoàn thành!'}
              </span>
            </div>
            
            {/* Hướng dẫn lỗi bằng bong bóng chat */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-1.5 bg-red-50 text-red-650 border-2 border-red-300 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Khung gỗ bảng đen học sinh */}
          <motion.div
            animate={shakeTrigger ? { x: [-10, 10, -10, 10, -5, 5, -2, 2, 0] } : {}}
            transition={{ duration: 0.4 }}
            key={shakeTrigger}
            className="w-full aspect-square max-w-[500px] lg:max-w-full bg-[#0a3821] border-[10px] md:border-[14px] border-amber-800 rounded-3xl p-1 shadow-[0_16px_40px_rgba(0,0,0,0.35)] overflow-hidden relative cursor-crosshair touch-none"
          >
            {/* Lớp bóng đổ bên trong bảng */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none z-10" />

            {/* SVG Render chính */}
            <svg
              ref={svgRef}
              viewBox="0 0 500 500"
              className="w-full h-full select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <defs>
                {/* Lưới ô ly vuông nhỏ màu phấn lục nhạt đặc trưng của tiểu học */}
                <pattern id="smallGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(52, 211, 153, 0.14)" strokeWidth="1" />
                </pattern>
                {/* Lưới ô ly lớn đậm nét */}
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#smallGrid)" />
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(52, 211, 153, 0.35)" strokeWidth="2" />
                </pattern>
                {/* SVG Chalk Filter tạo hiệu ứng phấn viết bảng EdTech chân thực */}
                <filter id="chalk" x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="noise" />
                  <feGaussianBlur stdDeviation="0.8" result="blur" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                  <feMerge>
                    <feMergeNode in="blur" opacity="0.35" />
                    <feMergeNode in="displaced" />
                  </feMerge>
                </filter>
              </defs>

              {/* Phủ nền lưới ô ly */}
              <rect width="500" height="500" fill="url(#grid)" />

              {/* Đường kẻ giới hạn cơ sở màu đỏ phấn (dòng kẻ chuẩn chân chữ) */}
              <line x1="0" y1="350" x2="500" y2="350" stroke="rgba(239, 68, 68, 0.55)" strokeWidth="3" />
              {/* Đường kẻ đỉnh đầu chữ 2 ô ly */}
              <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(52, 211, 153, 0.5)" strokeWidth="2.5" strokeDasharray="6 4" />

              {/* 1. Hiển thị chữ mẫu mờ xám nhạt làm nền cho bé vẽ đè lên */}
              {currentLetter.strokes.map((stroke, idx) => (
                <path
                  key={`bg-stroke-${stroke.id}`}
                  d={stroke.path}
                  fill="rgba(255, 255, 255, 0.08)"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="3"
                />
              ))}

              {/* 2. Hiển thị các nét đã vẽ thành công (tô màu phấn vàng rực rỡ) */}
              {currentLetter.strokes.map((stroke, idx) => {
                if (idx >= currentStrokeIndex) return null;
                return (
                  <path
                    key={`completed-stroke-${stroke.id}`}
                    d={stroke.path}
                    fill="#f59e0b"
                    className="drop-shadow-[0_2px_5px_rgba(245,158,11,0.5)] transition-all duration-300"
                  />
                );
              })}

              {/* 3. Hiển thị nét vẽ xương chỉ dẫn (nét đứt) cho nét ĐANG cần vẽ */}
              {currentStroke && !isDemoPlaying && (
                <path
                  d={getBezierPath(currentStroke.medians)}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              )}

              {/* Mũi tên động chạy dọc nét chữ hướng dẫn chiều vẽ (EdTech sinh động) */}
              {currentStroke && !isDemoPlaying && currentStroke.medians.length > 1 && (
                <g>
                  <path
                    id="arrow-motion-path"
                    d={getBezierPath(currentStroke.medians)}
                    fill="none"
                    stroke="transparent"
                  />
                  <g>
                    {/* Hình dạng mũi tên hướng dẫn sắc nét */}
                    <path
                      d="M -12,-8 L 4,0 L -12,8 L -8,0 Z"
                      fill="#22c55e"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="drop-shadow-md"
                    />
                    <animateMotion
                      dur="2.5s"
                      repeatCount="indefinite"
                      rotate="auto"
                    >
                      <mpath href="#arrow-motion-path" />
                    </animateMotion>
                  </g>
                </g>
              )}

              {/* 4. Hiển thị nét vẽ phấn thực tế của bé (vẽ tự do bằng tay) */}
              {userPathPoints.length > 1 && (
                <path
                  d={getBezierPath(userPathPoints)}
                  fill="none"
                  stroke={isStrokeError ? '#ef4444' : '#ffffff'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#chalk)"
                  className="opacity-95 drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]"
                />
              )}

              {/* 5. Hiển thị hoạt ảnh khi bé bấm Xem Mẫu */}
              {isDemoPlaying && demoPoints.length > 0 && (
                <path
                  d={getBezierPath(demoPoints)}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#chalk)"
                  className="opacity-95 drop-shadow-[0_0_3px_rgba(251,191,36,0.8)]"
                />
              )}

              {/* 6. Vòng tròn điểm bắt đầu "Đặt Bút" nhấp nháy */}
              {currentStroke && !isDemoPlaying && currentStroke.medians.length > 0 && (
                <g>
                  <circle
                    cx={currentStroke.medians[0].x}
                    cy={currentStroke.medians[0].y}
                    r="16"
                    fill="#f97316"
                    className="animate-ping opacity-60"
                  />
                  <circle
                    cx={currentStroke.medians[0].x}
                    cy={currentStroke.medians[0].y}
                    r="9"
                    fill="#f97316"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                  <text
                    x={currentStroke.medians[0].x}
                    y={currentStroke.medians[0].y - 18}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="900"
                    textAnchor="middle"
                    className="select-none pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    đặt bút
                  </text>
                </g>
              )}

              {/* 7. Chiếc bút chì vẽ mẫu chạy tự động */}
              {isDemoPlaying && demoCursor && (
                <text
                  x={demoCursor.x}
                  y={demoCursor.y}
                  fontSize="38"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="pointer-events-none select-none"
                >
                  ✏️
                </text>
              )}
            </svg>
          </motion.div>

          {/* Dàn nút thao tác dưới bảng vẽ */}
          <div className="w-full flex items-center justify-between gap-4 mt-2">
            <button
              onClick={playDemo}
              disabled={isDemoPlaying || showSuccessModal}
              className="tactile-btn bg-sky-500 hover:bg-sky-400 text-white border-2 border-[var(--color-foreground)] font-black px-5 py-3 text-xs md:text-sm rounded-xl shrink-0 cursor-pointer shadow-[3px_3px_0px_0px_var(--color-foreground)] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_var(--color-foreground)] flex items-center gap-1.5 disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              <span>Xem mẫu ✏️</span>
            </button>

            <button
              onClick={handleReset}
              disabled={isDemoPlaying || showSuccessModal}
              className="tactile-btn bg-emerald-500 hover:bg-emerald-400 text-white border-2 border-[var(--color-foreground)] font-black px-5 py-3 text-xs md:text-sm rounded-xl shrink-0 cursor-pointer shadow-[3px_3px_0px_0px_var(--color-foreground)] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_var(--color-foreground)] flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Viết lại 🧹</span>
            </button>

            <button
              onClick={() => speakLetter(currentLetter.letter, currentLetter.word)}
              disabled={isDemoPlaying}
              className="tactile-btn bg-amber-400 hover:bg-amber-350 text-[var(--color-foreground)] border-2 border-[var(--color-foreground)] font-black px-5 py-3 text-xs md:text-sm rounded-xl shrink-0 cursor-pointer shadow-[3px_3px_0px_0px_var(--color-foreground)] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_var(--color-foreground)] flex items-center gap-1.5 disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              <span>Đọc chữ 🔊</span>
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: Bảng chữ cái Selector và mô hình học trực quan (chiếm 5/12 cột) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Card Minh Họa Từ & Hình Ảnh Trực Quan */}
          <div className="bg-[var(--color-surface)] border-3 border-[var(--color-foreground)] p-5 rounded-[24px] shadow-[4px_4px_0px_0px_var(--color-foreground)] flex items-center gap-5 relative overflow-hidden">
            <div className="w-20 h-20 rounded-2xl bg-amber-50 border-2 border-[var(--color-foreground)] flex items-center justify-center text-5xl shrink-0 shadow-[2px_2px_0px_0px_var(--color-foreground)] select-none">
              {currentLetter.emoji}
            </div>
            <div>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                Ví dụ minh họa
              </span>
              <h3 className="text-2xl font-black text-[var(--color-foreground)] mt-1.5">
                {currentLetter.letter.toUpperCase()} {currentLetter.letter}
              </h3>
              <p className="text-sm font-semibold text-[var(--color-foreground)] opacity-75 mt-0.5">
                Gặp trong từ: <strong className="text-[var(--color-primary-depth)] font-black">"{currentLetter.word}"</strong>
              </p>
            </div>
            <div className="absolute right-4 top-4 select-none opacity-20 text-7xl font-black select-none pointer-events-none">
              {currentLetter.uppercase}
            </div>
          </div>

          {/* Grid lựa chọn chữ cái tập viết */}
          <div className="bg-[var(--color-surface)] border-3 border-[var(--color-foreground)] p-5 rounded-[24px] shadow-[4px_4px_0px_0px_var(--color-foreground)] flex-1 flex flex-col">
            <h3 className="text-base font-black text-[var(--color-foreground)] mb-3 flex items-center justify-between">
              <span>Bảng chữ cái tiếng Việt</span>
              <span className="text-xs font-bold text-[var(--color-foreground)]/60">
                Đã viết: {completedLetterIds.length}/{WRITING_ALPHABET_DATA.length} chữ
              </span>
            </h3>
            
            {/* Khung grid cuộn dọc, mượt mà */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto max-h-[350px] lg:max-h-[420px] pr-1.5 scrollbar-thin">
              {WRITING_ALPHABET_DATA.map((item, idx) => {
                const isSelected = idx === currentLetterIdx;
                const isCompleted = completedLetterIds.includes(item.id);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      playSound('click');
                      setCurrentLetterIdx(idx);
                    }}
                    className={`p-3 rounded-2xl border-2 font-black transition-all flex flex-col items-center gap-1.5 relative cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-foreground)] shadow-[2px_2px_0px_var(--color-foreground)] translate-y-[-1px]'
                        : 'bg-[var(--color-background)] text-[var(--color-foreground)] border-[var(--color-foreground)]/15 shadow-[1.5px_1.5px_0px_var(--color-foreground)]/10 hover:border-[var(--color-foreground)]'
                    }`}
                  >
                    {/* Ngôi sao lấp lánh góc nếu đã hoàn thành */}
                    {isCompleted && (
                      <span className="absolute top-1 right-1 text-xs select-none">⭐</span>
                    )}
                    
                    <span className="text-2xl leading-none">{item.letter}</span>
                    <span className={`text-[9px] font-bold tracking-tight truncate max-w-full ${
                      isSelected ? 'text-white/80' : 'text-[var(--color-foreground)]/50'
                    }`}>
                      {item.word}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {/* Banner nhỏ khuyến khích bé học */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-[var(--color-foreground)]/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center shrink-0 text-lg select-none">
                💡
              </div>
              <p className="text-[11px] font-bold text-[var(--color-foreground)]/70 leading-relaxed">
                <strong className="text-emerald-700">Mẹo cho bé:</strong> Đặt bút đúng điểm cam nhấp nháy, viết đúng hướng và nắn nót theo đường đứt quãng xanh dương nhé!
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL CHÚC MỪNG HOÀN THÀNH CHỮ CÁI */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Lớp phủ nền tối mờ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={handleNextLetter}
            />

            {/* Khung modal dạng Neo-brutalism rực rỡ */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-[var(--color-surface)] border-4 border-[var(--color-foreground)] rounded-[32px] p-6 max-w-md w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10 relative overflow-hidden"
            >
              {/* Vệt trang trí rực rỡ phía trên */}
              <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-500" />
              
              <div className="mt-4 mb-3 flex justify-center">
                <div className="relative">
                  <DinoMascot className="w-24 h-24 filter drop-shadow-md" />
                  <span className="absolute -top-2 -right-2 text-4xl animate-bounce">🏆</span>
                </div>
              </div>

              <span className="bg-yellow-100 text-yellow-800 border-2 border-yellow-300 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_var(--color-foreground)]">
                BÉ HOÀN THÀNH XUẤT SẮC!
              </span>

              <h2 className="text-3xl font-black text-[var(--color-foreground)] mt-5 mb-1">
                Chữ "{currentLetter.letter.toUpperCase()} {currentLetter.letter}"
              </h2>
              
              <p className="text-sm font-semibold text-[var(--color-foreground)] opacity-75 mt-1">
                Bé đã viết xong chữ cái và nhận được phần thưởng:
              </p>

              {/* Khung cộng XP thưởng */}
              <div className="my-6 inline-flex items-center gap-2 bg-yellow-50 border-3 border-[var(--color-foreground)] px-6 py-3.5 rounded-2xl shadow-[4px_4px_0px_var(--color-foreground)]">
                <Sparkles className="w-6 h-6 text-yellow-500 animate-spin" />
                <span className="text-2xl font-black text-[var(--color-foreground)]">
                  +150 XP Thưởng!
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <button
                  onClick={handleReset}
                  className="w-full py-4 rounded-2xl font-black border-2 border-[var(--color-foreground)] bg-[var(--color-background)] hover:bg-[var(--color-surface-container)] transition-all cursor-pointer shadow-[3px_3px_0px_var(--color-foreground)] active:translate-y-[2px] active:shadow-[1px_1px_0px_var(--color-foreground)] text-sm flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Viết lại nét chữ</span>
                </button>
                
                <button
                  onClick={handleNextLetter}
                  className="w-full py-4 rounded-2xl font-black border-2 border-[var(--color-foreground)] bg-[var(--color-primary)] text-white hover:opacity-95 transition-all cursor-pointer shadow-[3px_3px_0px_var(--color-foreground)] active:translate-y-[2px] active:shadow-[1px_1px_0px_var(--color-foreground)] text-sm flex items-center justify-center gap-1.5"
                >
                  <span>Chữ tiếp theo</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
