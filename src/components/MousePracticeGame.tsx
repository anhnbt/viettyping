"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/contexts/SoundContext';
import { useWebSpeech } from '@/hooks/useWebSpeech';
import { 
  Monitor, 
  Laptop, 
  MousePointer, 
  Award, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  Mouse,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MousePracticeGameProps {
  onComplete: (telemetry: { score: number; durationSeconds: number; rawPayload?: any }) => void;
}

type StepType = 'welcome' | 'devices' | 'move' | 'click' | 'right_click' | 'double_click' | 'drag_drop' | 'finish';

interface DeviceQuestion {
  id: string; // 'screen' | 'cpu' | 'keyboard' | 'mouse' | 'laptop'
  name: string;
  description: string;
  imageUrl: string;
  num?: number;
  mode: 'desktop_part' | 'laptop';
  // Vị trí hotspot (nếu là desktop_part)
  hotspot?: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
  labelPos?: {
    top: string;
    left: string;
  };
}

export default function MousePracticeGame({ onComplete }: MousePracticeGameProps) {
  const [step, setStep] = useState<StepType>('welcome');
  const { playSound, playAudio } = useSound();
  const { speak: speakTts, stopSpeaking } = useWebSpeech({ lang: 'vi-VN' });
  
  // Telemetry
  const startTimeRef = useRef<number>(Date.now());
  const [errorsCount, setErrorsCount] = useState(0);

  // Màn 1: Nhận diện thiết bị
  const devices: DeviceQuestion[] = [
    { 
      id: 'screen', 
      name: 'Màn hình máy tính', 
      description: 'Màn hình trông giống như ti vi. Màn hình là nơi hiển thị kết quả làm việc của máy tính.', 
      imageUrl: '/assets/devices/screen.png',
      num: 1,
      mode: 'desktop_part',
      hotspot: { top: '7%', left: '5%', width: '58%', height: '62%' },
      labelPos: { top: '15%', left: '10%' }
    },
    { 
      id: 'cpu', 
      name: 'Thân máy tính', 
      description: 'Thân máy là bộ phận quan trọng nhất của máy tính. Trong thân máy có bộ xử lý, nó giống như bộ não điều khiển mọi hoạt động của máy tính.', 
      imageUrl: '/assets/devices/cpu.png',
      num: 2,
      mode: 'desktop_part',
      hotspot: { top: '38%', left: '67%', width: '31%', height: '42%' },
      labelPos: { top: '15%', left: '90%' }
    },
    { 
      id: 'keyboard', 
      name: 'Bàn phím máy tính', 
      description: 'Bàn phím gồm nhiều phím. Khi gõ các phím, em gửi tín hiệu vào máy tính.', 
      imageUrl: '/assets/devices/keyboard.png',
      num: 3,
      mode: 'desktop_part',
      hotspot: { top: '74%', left: '23%', width: '44%', height: '16%' },
      labelPos: { top: '85%', left: '10%' }
    },
    { 
      id: 'mouse', 
      name: 'Chuột máy tính', 
      description: 'Chuột máy tính giúp em điều khiển máy tính thuận tiện hơn.', 
      imageUrl: '/assets/devices/mouse.png',
      num: 4,
      mode: 'desktop_part',
      hotspot: { top: '74%', left: '67%', width: '13%', height: '9%' },
      labelPos: { top: '85%', left: '90%' }
    },
    { 
      id: 'laptop', 
      name: 'Máy tính xách tay (Laptop)', 
      description: 'Laptop gập mở tiện lợi, gộp chung màn hình, bàn phím và chuột làm một để bé dễ dàng mang đi học, đi chơi khắp nơi.', 
      imageUrl: '/assets/devices/laptop.png',
      mode: 'laptop'
    }
  ];
  
  const [deviceQuestionIndex, setDeviceQuestionIndex] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [deviceFeedback, setDeviceFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [activeHoveredPart, setActiveHoveredPart] = useState<string | null>(null);
  
  // Màn 2: Rê chuột vỡ bóng
  const [bubbles, setBubbles] = useState<Array<{ id: number; color: string; size: number; x: number; y: number; popped: boolean }>>([]);
  const [poppedBubblesCount, setPoppedBubblesCount] = useState(0);
  
  // Màn 3: Nháy chuột đánh thức thú cưng
  const [animals, setAnimals] = useState([
    { id: 1, sleepingEmoji: '😴🦁', awakeEmoji: '🦁🦁', name: 'Sư tử', awake: false, color: 'bg-amber-100 border-amber-400' },
    { id: 2, sleepingEmoji: '😴🐼', awakeEmoji: '🐼🐼', name: 'Gấu trúc', awake: false, color: 'bg-slate-100 border-slate-400' },
    { id: 3, sleepingEmoji: '😴🦖', awakeEmoji: '🦖🦖', name: 'Khủng long', awake: false, color: 'bg-emerald-100 border-emerald-400' }
  ]);
  
  // Màn 4: Nháy đúp mở rương báu
  const [chestState, setChestState] = useState<'locked' | 'opening' | 'opened'>('locked');

  // Màn 5: Nháy phải tưới cây
  const [plantState, setPlantState] = useState<'seed' | 'watering' | 'growing' | 'flowered'>('seed');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const seedRef = useRef<HTMLDivElement>(null);
  
  // Màn 6: Kéo thả thức ăn cho Dino
  const [applePosition, setApplePosition] = useState({ x: 0, y: 0 });
  const [isAppleEaten, setIsAppleEaten] = useState(false);
  const dinoRef = useRef<HTMLDivElement>(null);
  const deviceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Phát âm tiếng Việt sử dụng Web Speech API và Google Cloud TTS
  const speakVietnamese = (text: string) => {
    speakTts(text);
  };

  // Phát âm khi câu hỏi thiết bị thay đổi
  useEffect(() => {
    if (step === 'devices') {
      const currentQuestion = devices[deviceQuestionIndex];
      if (currentQuestion) {
        if (currentQuestion.mode === 'desktop_part') {
          speakVietnamese(`Bé hãy tìm và chọn: ${currentQuestion.name}`);
        } else {
          speakVietnamese(`Bé hãy bấm chọn: ${currentQuestion.name}`);
        }
      }
    }
  }, [step, deviceQuestionIndex]);

  const handlePartHover = (partId: string) => {
    if (activeHoveredPart !== partId && !deviceFeedback) {
      setActiveHoveredPart(partId);
      const targetPart = devices.find(d => d.id === partId);
      if (targetPart) {
        speakVietnamese(targetPart.name);
      }
    }
  };

  const handlePartLeave = () => {
    setActiveHoveredPart(null);
  };

  // Initialize bubbles for Màn 2
  const initBubbles = () => {
    const bubbleColors = [
      'bg-red-400', 'bg-blue-400', 'bg-green-400', 
      'bg-yellow-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400'
    ];
    const newBubbles = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      color: bubbleColors[i % bubbleColors.length],
      size: 60 + Math.random() * 40,
      x: 10 + Math.random() * 80, // % width
      y: 10 + Math.random() * 70, // % height
      popped: false
    }));
    setBubbles(newBubbles);
    setPoppedBubblesCount(0);
  };

  useEffect(() => {
    startTimeRef.current = Date.now();
    return () => {
      if (deviceTimeoutRef.current) {
        clearTimeout(deviceTimeoutRef.current);
      }
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // Phát âm thanh chúc mừng khi hoàn thành tất cả bài luyện tập chuột
  useEffect(() => {
    if (step === 'finish') {
      playAudio('/audio/tuyet-voi-ong-mat-troi-be-da-hoan-thanh-xuat-sac-tat-ca-cac-bai-luyen-tap-roi-do.wav');
    }
  }, [step, playAudio]);

  // Xử lý khi bắt đầu học
  const startLearning = () => {
    playSound('click');
    setStep('devices');
    setDeviceQuestionIndex(0);
    setSelectedDevice(null);
    setDeviceFeedback(null);
    setActiveHoveredPart(null);
  };

  // Hàm chuyển sang câu hỏi thiết bị tiếp theo hoặc màn tiếp theo
  const goToNextDeviceQuestion = () => {
    if (deviceTimeoutRef.current) {
      clearTimeout(deviceTimeoutRef.current);
      deviceTimeoutRef.current = null;
    }

    if (deviceQuestionIndex < devices.length - 1) {
      setDeviceQuestionIndex(prev => prev + 1);
      setSelectedDevice(null);
      setDeviceFeedback(null);
      setActiveHoveredPart(null);
    } else {
      stopSpeaking();
      playSound('complete');
      initBubbles();
      setStep('move');
    }
  };

  // MÀN 1: Chọn Thiết Bị
  const handleDeviceSelect = (deviceId: string) => {
    if (deviceFeedback === 'correct') return;

    if (deviceTimeoutRef.current) {
      clearTimeout(deviceTimeoutRef.current);
      deviceTimeoutRef.current = null;
    }

    setSelectedDevice(deviceId);
    const currentQuestion = devices[deviceQuestionIndex];
    
    if (deviceId === currentQuestion.id) {
      playSound('coin');
      setDeviceFeedback('correct');
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.75 }
      });
      
      speakVietnamese(`Đúng rồi! ${currentQuestion.name}. ${currentQuestion.description}`);
      
      deviceTimeoutRef.current = setTimeout(() => {
        goToNextDeviceQuestion();
      }, 9500); // 9.5 giây đủ cho bé nghe xong đoạn mô tả chi tiết của SGK
    } else {
      playSound('wrong');
      setDeviceFeedback('wrong');
      setErrorsCount(prev => prev + 1);
      
      speakVietnamese(`Chưa đúng rồi! Bé hãy tìm ${currentQuestion.name} nhé!`);
      
      deviceTimeoutRef.current = setTimeout(() => {
        setDeviceFeedback(null);
        setSelectedDevice(null);
      }, 3000);
    }
  };

  // MÀN 2: Rê chuột vỡ bóng
  const handleBubbleHover = (bubbleId: number) => {
    setBubbles(prev => 
      prev.map(b => {
        if (b.id === bubbleId && !b.popped) {
          playAudio('/audio/pop_7e9Is8L.mp3');
          setPoppedBubblesCount(c => {
            const newCount = c + 1;
            if (newCount >= bubbles.length) {
              // Phát âm thanh giọng chúc mừng hoàn thành bong bóng
              playAudio('/audio/tuyet-voi-be-da-lam-vo-toan-bo-bong-bong-roi.wav');
              setTimeout(() => {
                playSound('complete');
                setStep('click');
              }, 1000);
            }
            return newCount;
          });
          return { ...b, popped: true };
        }
        return b;
      })
    );
  };

  // MÀN 3: Nháy chuột đánh thức thú bông
  const handleAnimalClick = (animalId: number) => {
    setAnimals(prev => 
      prev.map(a => {
        if (a.id === animalId && !a.awake) {
          playAudio('/audio/comedy_pop_finger_in_mouth_001.mp3');
          confetti({
            particleCount: 15,
            spread: 20,
            colors: ['#f59e0b', '#fbbf24']
          });
          
          const updated = { ...a, awake: true };
          
          // Kiểm tra xem tất cả các bạn đã thức dậy chưa
          const allAwake = prev.every(x => x.id === animalId ? true : x.awake);
          if (allAwake) {
            setTimeout(() => {
              playSound('complete');
              setStep('double_click');
            }, 1200);
          }
          return updated;
        }
        return a;
      })
    );
  };

  // MÀN 4: Nháy đúp mở rương báu
  const handleChestDoubleClick = () => {
    if (chestState !== 'locked') return;
    
    playSound('complete');
    setChestState('opening');
    
    // Tạo pháo hoa tung tóe
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      setChestState('opened');
      setTimeout(() => {
        setStep('right_click');
      }, 2000);
    }, 1200);
  };

  // MÀN 5: Nháy phải tưới hạt mầm
  const handleSeedContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (plantState !== 'seed') return;

    playSound('click');
    // Tính toán tọa độ tương đối với khung
    const container = e.currentTarget.getBoundingClientRect();
    setMenuPos({
      x: e.clientX - container.left,
      y: e.clientY - container.top
    });
    setShowContextMenu(true);
  };

  const handleContextAction = (action: string) => {
    setShowContextMenu(false);
    
    if (action === 'water') {
      playSound('coin');
      setPlantState('watering');
      
      setTimeout(() => {
        setPlantState('growing');
        playSound('complete');
        
        setTimeout(() => {
          setPlantState('flowered');
          confetti({
            particleCount: 50,
            spread: 50,
            colors: ['#ec4899', '#f472b6', '#3b82f6']
          });
          
          setTimeout(() => {
            setStep('drag_drop');
          }, 2500);
        }, 1500);
      }, 1500);
    } else {
      playSound('wrong');
      // Báo sai nhưng cho bé chọn lại
      alert(action === 'weed' ? "Nhổ cỏ nhầm mầm cây mất rồi bé ơi! Hãy click phải chọn Tưới nước nhé!" : "Bón phân lúc này hạt mầm chưa hấp thụ được đâu! Hãy tưới nước nhé!");
    }
  };

  // MÀN 6: Kéo thả quả táo cho khủng long Dino
  const handleAppleDragEnd = (event: any, info: any) => {
    if (!dinoRef.current) return;
    
    const dinoRect = dinoRef.current.getBoundingClientRect();
    const appleX = info.point.x;
    const appleY = info.point.y;
    
    // Kiểm tra xem tọa độ nhả chuột của táo có nằm trong khu vực của khủng long không
    if (
      appleX >= dinoRect.left - 20 && 
      appleX <= dinoRect.right + 20 && 
      appleY >= dinoRect.top - 20 && 
      appleY <= dinoRect.bottom + 20
    ) {
      playSound('complete');
      setIsAppleEaten(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        // Hoàn thành toàn bộ game
        setStep('finish');
      }, 2500);
    } else {
      playSound('boing');
      // Reset vị trí táo
      setApplePosition({ x: 0, y: 0 });
    }
  };

  const handleFinish = () => {
    playSound('tada');
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const score = Math.max(70, 100 - (errorsCount * 5)); // Bị trừ điểm nếu click sai thiết bị, tối thiểu 70%

    onComplete({
      score,
      durationSeconds,
      rawPayload: {
        errorsCount,
        finishedAt: new Date().toISOString()
      }
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 relative select-none">
      
      {/* 1. MÀN HÌNH CHÀO MỪNG */}
      {step === 'welcome' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-xl bg-white border-4 border-slate-800 rounded-3xl p-8 shadow-[6px_6px_0px_0px_#1e293b] relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 text-4xl animate-bounce">🦖</div>
          
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-wide leading-normal">
            Bé Tập Sử Dụng Chuột & Máy Tính 💻
          </h2>
          
          <p className="text-slate-600 font-bold text-base md:text-lg mb-8 leading-relaxed">
            Chào mừng bé yêu! Hôm nay chúng mình sẽ cùng học cách nhận diện các bộ phận của máy tính và luyện tập 5 tuyệt chiêu di chuyển, nhấp chuột thật khéo léo cùng bạn Khủng Long Dino nhé!
          </p>

          <button
            onClick={startLearning}
            className="tactile-btn tactile-btn-primary px-10 py-5 text-xl rounded-2xl flex items-center justify-center gap-2 mx-auto"
          >
            <span>Bắt đầu khám phá</span>
            <ArrowRight className="w-6 h-6 animate-pulse" />
          </button>
        </motion.div>
      )}

      {/* 2. MÀN HỌC THIẾT BỊ (MÀN 1) */}
      {step === 'devices' && (
        <div className="w-full max-w-4xl flex flex-col items-center">
          {/* Header câu hỏi */}
          <div className="bg-amber-100 border-2 border-slate-800 rounded-2xl py-3.5 px-6 mb-6 text-center shadow-[3px_3px_0px_0px_#1e293b] w-full max-w-2xl">
            <h3 className="text-xl md:text-2xl font-black text-amber-800 leading-normal">
              Thử thách 1: Bé hãy chỉ ra <span className="underline decoration-wavy decoration-rose-500 font-extrabold text-rose-600">{devices[deviceQuestionIndex].name}</span> nhé!
            </h3>
          </div>

          <div className="w-full flex flex-col items-center justify-center">
            {devices[deviceQuestionIndex].mode === 'desktop_part' ? (
              /* CHẾ ĐỘ 1: Tương tác bộ phận trên ảnh Máy tính để bàn */
              <div className="relative w-full max-w-[540px] aspect-square border-4 border-slate-800 rounded-[36px] overflow-hidden shadow-[8px_8px_0px_0px_#1e293b] bg-white">
                {/* Ảnh bộ máy tính chính */}
                <img 
                  src="/assets/devices/desktop.png" 
                  alt="Máy tính để bàn hoàn chỉnh" 
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {/* SVG Overlay vẽ các đường line nối giống Sách Giáo Khoa */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 pointer-events-none w-full h-full z-15">
                  {devices.filter(d => d.mode === 'desktop_part').map((part) => {
                    if (!part.hotspot || !part.labelPos) return null;
                    
                    const x1 = parseFloat(part.labelPos.left);
                    const y1 = parseFloat(part.labelPos.top);
                    const x2 = parseFloat(part.hotspot.left) + parseFloat(part.hotspot.width) / 2;
                    const y2 = parseFloat(part.hotspot.top) + parseFloat(part.hotspot.height) / 2;
                    
                    const isHovered = activeHoveredPart === part.id;
                    const isCurrent = devices[deviceQuestionIndex].id === part.id;
                    const isCorrect = selectedDevice === part.id && deviceFeedback === 'correct';
                    const isHighlighted = isHovered || isCurrent || isCorrect;

                    return (
                      <g key={`line-${part.id}`}>
                        <line
                          x1={`${x1}%`}
                          y1={`${y1}%`}
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke={isCorrect ? "#22c55e" : isHighlighted ? "#6366f1" : "#cbd5e1"}
                          strokeWidth={isHighlighted ? "1.2" : "0.6"}
                          strokeDasharray={isHighlighted ? "none" : "2 2"}
                          className="transition-all duration-300"
                        />
                        {/* Điểm neo nhỏ tại tâm thiết bị */}
                        <circle
                          cx={`${x2}%`}
                          cy={`${y2}%`}
                          r={isHighlighted ? "1.5" : "0.8"}
                          fill={isCorrect ? "#22c55e" : isHighlighted ? "#6366f1" : "#94a3b8"}
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Nút tròn số chỉ dẫn ngoài rìa */}
                {devices.filter(d => d.mode === 'desktop_part').map((part) => {
                  if (!part.labelPos) return null;
                  const isHovered = activeHoveredPart === part.id;
                  const isCurrent = devices[deviceQuestionIndex].id === part.id;
                  const isCorrect = selectedDevice === part.id && deviceFeedback === 'correct';
                  const isWrong = selectedDevice === part.id && deviceFeedback === 'wrong';

                  return (
                    <div
                      key={`label-container-${part.id}`}
                      style={{
                        position: 'absolute',
                        top: part.labelPos.top,
                        left: part.labelPos.left,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="z-25 flex flex-col items-center pointer-events-auto"
                    >
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeviceSelect(part.id)}
                        onMouseEnter={() => handlePartHover(part.id)}
                        onMouseLeave={handlePartLeave}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base border-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)] transition-all ${
                          isCorrect
                            ? 'bg-green-500 border-green-700 text-white'
                            : isWrong
                            ? 'bg-red-500 border-red-700 text-white animate-shake'
                            : isCurrent
                            ? 'bg-amber-400 border-slate-800 text-slate-800 animate-pulse'
                            : isHovered
                            ? 'bg-indigo-500 border-indigo-700 text-white scale-110'
                            : 'bg-white border-slate-800 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        {part.num}
                      </motion.button>

                      {/* Tooltip nhỏ xinh hiển thị tên thiết bị khi hover hoặc khi tìm đúng */}
                      <AnimatePresence>
                        {(isHovered || isCorrect) && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            className="absolute top-12 whitespace-nowrap bg-slate-800 text-white font-bold text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 shadow-md"
                          >
                            {part.name}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Các vùng hotspot trong suốt nằm đè lên ảnh thiết bị */}
                {devices.filter(d => d.mode === 'desktop_part').map((part) => {
                  if (!part.hotspot) return null;
                  const isHovered = activeHoveredPart === part.id;
                  const isCorrect = selectedDevice === part.id && deviceFeedback === 'correct';

                  return (
                    <div
                      key={`hotspot-${part.id}`}
                      onMouseEnter={() => handlePartHover(part.id)}
                      onMouseLeave={handlePartLeave}
                      onClick={() => handleDeviceSelect(part.id)}
                      style={{
                        position: 'absolute',
                        top: part.hotspot.top,
                        left: part.hotspot.left,
                        width: part.hotspot.width,
                        height: part.hotspot.height,
                      }}
                      className={`rounded-[24px] cursor-pointer transition-all duration-300 z-20 ${
                        isHovered 
                          ? 'border-4 border-dashed border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                          : isCorrect
                          ? 'border-4 border-solid border-green-500 bg-green-500/5'
                          : 'border-0 border-transparent'
                      }`}
                    />
                  );
                })}
              </div>
            ) : (
              /* CHẾ ĐỘ 2: Click giới thiệu chiếc Laptop xách tay */
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md bg-white border-4 border-slate-800 rounded-[36px] p-6 shadow-[8px_8px_0px_0px_#1e293b] text-center flex flex-col items-center"
              >
                <div 
                  onClick={() => handleDeviceSelect('laptop')}
                  className="w-full h-56 md:h-64 bg-slate-50 border-2 border-slate-800 rounded-2xl flex items-center justify-center p-3 mb-6 overflow-hidden shadow-[2px_2px_0px_0px_#1e293b] cursor-pointer hover:bg-slate-100 transition-all group"
                >
                  <img 
                    src="/assets/devices/laptop.png" 
                    alt="Máy tính xách tay Laptop" 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-2xl font-black text-slate-850 mb-2">Máy tính xách tay (Laptop)</h4>
                <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-xs mb-4">
                  Một chiếc máy tính vô cùng gọn nhẹ, tích hợp màn hình, bàn phím và chuột làm một để bé dễ dàng mang đi học, đi chơi khắp nơi!
                </p>
                <button
                  onClick={() => handleDeviceSelect('laptop')}
                  className="tactile-btn tactile-btn-primary px-6 py-2.5 text-sm rounded-xl font-bold"
                >
                  Nhấn để tìm hiểu!
                </button>
              </motion.div>
            )}
          </div>

          {/* Pop-up giải thích chi tiết kèm ảnh phóng to khi trả lời đúng */}
          <AnimatePresence>
            {deviceFeedback === 'correct' && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="bg-[#fffdfa] border-4 border-slate-800 rounded-[40px] p-6 md:p-8 max-w-2xl w-full shadow-[8px_8px_0px_0px_#1e293b] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
                >
                  {/* Decorative background shape */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 pointer-events-none z-0" />
                  
                  {/* Cột 1: Ảnh phóng to thiết bị */}
                  <div className="w-full md:w-2/5 flex flex-col items-center z-10 shrink-0">
                    <div className="w-40 h-40 md:w-48 md:h-48 bg-white border-4 border-slate-800 rounded-[32px] overflow-hidden shadow-[4px_4px_0px_0px_#1e293b] p-3 flex items-center justify-center">
                      <img
                        src={devices[deviceQuestionIndex].imageUrl}
                        alt={devices[deviceQuestionIndex].name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="mt-3.5 bg-indigo-100 text-indigo-700 text-xs md:text-sm font-black px-4 py-1.5 rounded-full border-2 border-indigo-200">
                      {devices[deviceQuestionIndex].name}
                    </span>
                  </div>

                  {/* Cột 2: Lời giải thích chuẩn SGK */}
                  <div className="w-full md:w-3/5 text-left flex flex-col z-10">
                    <span className="text-2xl md:text-3xl font-black text-green-600 mb-2 block flex items-center gap-1.5">
                      🎉 Bé giỏi quá!
                    </span>
                    
                    {/* Đoạn giải thích chi tiết */}
                    <div className="text-slate-700 text-sm md:text-base font-bold leading-relaxed mb-6">
                      {(() => {
                        const desc = devices[deviceQuestionIndex].description;
                        if (devices[deviceQuestionIndex].id === 'screen') {
                          return (
                            <p>
                              Màn hình <span className="underline decoration-wavy decoration-indigo-400 font-black text-indigo-650">trông giống như ti vi</span>. Màn hình là nơi <span className="text-indigo-650 font-black">hiển thị kết quả làm việc</span> của máy tính.
                            </p>
                          );
                        } else if (devices[deviceQuestionIndex].id === 'cpu') {
                          return (
                            <p>
                              Thân máy là <span className="text-indigo-650 font-black">bộ phận quan trọng nhất</span> của máy tính. Trong thân máy có <span className="underline decoration-wavy decoration-indigo-400 font-black text-indigo-650">bộ xử lý</span>, nó giống như <span className="text-rose-500 font-black">bộ não</span> điều khiển mọi hoạt động của máy tính.
                            </p>
                          );
                        } else if (devices[deviceQuestionIndex].id === 'keyboard') {
                          return (
                            <p>
                              Bàn phím <span className="text-indigo-650 font-black">gồm nhiều phím</span>. Khi gõ các phím, em <span className="underline decoration-wavy decoration-indigo-400 font-black text-indigo-650">gửi tín hiệu</span> vào máy tính.
                            </p>
                          );
                        } else if (devices[deviceQuestionIndex].id === 'mouse') {
                          return (
                            <p>
                              Chuột máy tính giúp em <span className="text-indigo-650 font-black">điều khiển máy tính thuận tiện hơn</span>.
                            </p>
                          );
                        }
                        return <p>{desc}</p>;
                      })()}
                    </div>

                    {/* Nút bấm chuyển câu tiếp theo */}
                    <button
                      onClick={goToNextDeviceQuestion}
                      className="tactile-btn tactile-btn-primary px-6 py-3 rounded-2xl flex items-center justify-center gap-2 self-start text-sm"
                    >
                      <span>Tiếp tục học</span>
                      <ArrowRight className="w-4 h-4 animate-pulse" />
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Feedback khi trả lời sai (Không hiện modal lớn để bé dễ chọn lại) */}
          <AnimatePresence>
            {deviceFeedback === 'wrong' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="mt-6 font-bold text-base px-6 py-3.5 rounded-2xl border-3 border-slate-800 shadow-[3px_3px_0px_0px_#1e293b] text-center bg-red-100 text-red-800 max-w-md w-full"
              >
                <span className="text-lg font-black block mb-0.5">😢 Chưa đúng rồi bé ơi!</span>
                <span className="text-xs md:text-sm font-semibold">Bé hãy thử chỉ ra {devices[deviceQuestionIndex].name} trên hình máy tính nhé!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 3. MÀN LUYỆN DI CHUYỂN CHUỘT (MÀN 2) */}
      {step === 'move' && (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="bg-sky-100 border-2 border-slate-800 rounded-2xl py-3 px-6 mb-4 text-center shadow-[3px_3px_0px_0px_#1e293b]">
            <h3 className="text-xl md:text-2xl font-black text-sky-850 leading-normal">
              Thử thách 2: Rê chuột 🖱️ chạm vào tất cả các bong bóng để làm vỡ nhé! ({poppedBubblesCount}/{bubbles.length})
            </h3>
          </div>

          <div className="w-full h-[400px] border-4 border-slate-800 bg-sky-50 rounded-3xl relative overflow-hidden shadow-[6px_6px_0px_0px_#1e293b]">
            {/* Background clouds */}
            <div className="absolute top-8 left-8 text-5xl opacity-25">☁️</div>
            <div className="absolute top-20 right-16 text-6xl opacity-20">☁️</div>
            <div className="absolute bottom-12 left-1/3 text-4xl opacity-15">☁️</div>

            <AnimatePresence>
              {bubbles.map((bubble) => {
                if (bubble.popped) return null;
                return (
                  <motion.div
                    key={bubble.id}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: 1,
                      x: [0, bubble.id % 2 === 0 ? 20 : -20, 0],
                      y: [0, -30, 0],
                    }}
                    exit={{ scale: 1.4, opacity: 0, transition: { duration: 0.15 } }}
                    transition={{
                      x: { duration: 4 + bubble.id, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 3 + bubble.id, repeat: Infinity, ease: "easeInOut" },
                      scale: { duration: 0.3 }
                    }}
                    onMouseEnter={() => handleBubbleHover(bubble.id)}
                    style={{
                      position: 'absolute',
                      width: bubble.size,
                      height: bubble.size,
                      left: `${bubble.x}%`,
                      top: `${bubble.y}%`,
                    }}
                    className={`rounded-full ${bubble.color} border-3 border-slate-800 flex items-center justify-center cursor-pointer shadow-[inset_-6px_-6px_0px_rgba(0,0,0,0.15)] filter drop-shadow-md`}
                  >
                    {/* Bong bóng lấp lánh */}
                    <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-2 left-3 opacity-70"></div>
                    <span className="text-lg select-none">🎈</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {poppedBubblesCount === bubbles.length && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center p-4"
              >
                <div className="text-6xl animate-bounce">🎈💥</div>
                <h4 className="text-2xl font-black text-slate-800 mt-4">Tuyệt vời! Bé đã làm vỡ toàn bộ bong bóng rồi!</h4>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* 4. MÀN LUYỆN NHÁY CHUỘT (MÀN 3) */}
      {step === 'click' && (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="bg-emerald-100 border-2 border-slate-800 rounded-2xl py-3 px-6 mb-6 text-center shadow-[3px_3px_0px_0px_#1e293b]">
            <h3 className="text-xl md:text-2xl font-black text-emerald-850 leading-normal">
              Thử thách 3: Bé hãy NHÁY CHUỘT TRÁI (click) vào 3 chú thú cưng đang ngủ để đánh thức các bạn ấy nhé!
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-2xl justify-center items-center py-6">
            {animals.map((animal) => (
              <motion.button
                key={animal.id}
                whileHover={{ scale: animal.awake ? 1 : 1.05 }}
                whileTap={{ scale: animal.awake ? 1 : 0.95 }}
                onClick={() => handleAnimalClick(animal.id)}
                disabled={animal.awake}
                className={`p-6 rounded-[32px] border-4 border-slate-800 flex flex-col items-center justify-center cursor-pointer min-h-[200px] shadow-[5px_5px_0px_0px_#1e293b] transition-all ${
                  animal.awake 
                    ? 'bg-amber-50 shadow-[2px_2px_0px_0px_#1e293b] translate-y-1' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="text-7xl mb-4 select-none filter drop-shadow-md">
                  {animal.awake ? animal.awakeEmoji : animal.sleepingEmoji}
                </div>
                <h4 className="text-lg font-black text-slate-850">
                  {animal.name}
                </h4>
                <span className={`mt-2.5 px-3 py-1 rounded-full text-xs font-black border-2 border-slate-800 ${
                  animal.awake ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-650'
                }`}>
                  {animal.awake ? 'Đã dậy! 😍' : 'Đang ngủ 😴'}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* 5. MÀN LUYỆN NHÁY ĐÚP (MÀN 4) */}
      {step === 'double_click' && (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="bg-purple-100 border-2 border-slate-800 rounded-2xl py-3 px-6 mb-8 text-center shadow-[3px_3px_0px_0px_#1e293b]">
            <h3 className="text-xl md:text-2xl font-black text-purple-850 leading-normal">
              Thử thách 4: Nháy đúp chuột (Bấm chuột trái NHANH 2 lần liên tục) vào rương để xem kho báu bên trong là gì nhé!
            </h3>
          </div>

          <div className="w-full h-80 flex items-center justify-center bg-purple-50 rounded-3xl border-4 border-slate-800 shadow-[6px_6px_0px_0px_#1e293b] relative overflow-hidden">
            {/* Sparkle effects */}
            <div className="absolute top-10 left-12 text-3xl opacity-30 animate-pulse">✨</div>
            <div className="absolute bottom-16 right-16 text-4xl opacity-35 animate-bounce">✨</div>
            
            <motion.div
              onDoubleClick={handleChestDoubleClick}
              whileHover={{ scale: chestState === 'locked' ? 1.08 : 1 }}
              whileTap={{ scale: chestState === 'locked' ? 0.95 : 1 }}
              className="flex flex-col items-center cursor-pointer select-none relative group"
            >
              {chestState === 'locked' && (
                <div className="text-9xl filter drop-shadow-xl hover:rotate-2 transition-transform select-none">
                  📦
                </div>
              )}
              {chestState === 'opening' && (
                <motion.div 
                  animate={{ rotate: [-5, 5, -5, 5, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                  className="text-9xl filter drop-shadow-xl select-none"
                >
                  🔓
                </motion.div>
              )}
              {chestState === 'opened' && (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-9xl filter drop-shadow-2xl relative select-none"
                >
                  💎
                  {/* Floating elements inside chest */}
                  <motion.span 
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: -60, x: -30, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute text-3xl top-0 left-0"
                  >
                    🪙
                  </motion.span>
                  <motion.span 
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: -70, x: 30, opacity: 0 }}
                    transition={{ duration: 1.3, repeat: Infinity, delay: 0.3 }}
                    className="absolute text-4xl top-0 right-0"
                  >
                    ✨
                  </motion.span>
                </motion.div>
              )}

              <div className="mt-6 px-6 py-2.5 bg-white border-2 border-slate-800 rounded-full font-black text-slate-800 shadow-[3px_3px_0px_0px_#1e293b]">
                {chestState === 'locked' && 'Bấm nhanh 2 lần để mở! 🔒'}
                {chestState === 'opening' && 'Đang mở khóa... 💫'}
                {chestState === 'opened' && 'Oa! Kho báu kim cương lấp lánh! 💎'}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* 6. MÀN LUYỆN NHÁY PHẢI (MÀN 5) */}
      {step === 'right_click' && (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="bg-amber-100 border-2 border-slate-800 rounded-2xl py-3 px-6 mb-6 text-center shadow-[3px_3px_0px_0px_#1e293b]">
            <h3 className="text-xl md:text-2xl font-black text-amber-850 leading-normal">
              Thử thách 5: Bé hãy click CHUỘT PHẢI vào hạt mầm đất 🌱 rồi chọn "Tưới nước 💦" để trồng hoa nhé!
            </h3>
          </div>

          <div 
            onClick={() => setShowContextMenu(false)}
            className="w-full h-80 flex items-center justify-center bg-amber-50 rounded-3xl border-4 border-slate-800 shadow-[6px_6px_0px_0px_#1e293b] relative overflow-hidden"
          >
            {/* Pot & seed area */}
            <div 
              ref={seedRef}
              onContextMenu={handleSeedContextMenu}
              className="flex flex-col items-center cursor-pointer"
            >
              {plantState === 'seed' && (
                <div className="flex flex-col items-center">
                  <span className="text-6xl animate-pulse filter drop-shadow-md">🌱</span>
                  <p className="text-sm font-bold text-slate-500 mt-2">Hạt mầm đất</p>
                </div>
              )}
              {plantState === 'watering' && (
                <div className="flex flex-col items-center">
                  <span className="text-7xl animate-bounce filter drop-shadow-md">💦</span>
                  <span className="text-5xl mt-2 filter drop-shadow-sm">🌱</span>
                  <p className="text-sm font-bold text-blue-500 mt-2 animate-pulse">Đang tưới nước...</p>
                </div>
              )}
              {plantState === 'growing' && (
                <div className="flex flex-col items-center">
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1.1] }}
                    className="text-7xl filter drop-shadow-md"
                  >
                    🌿
                  </motion.span>
                  <p className="text-sm font-bold text-emerald-500 mt-2">Cây đang lớn nhanh!</p>
                </div>
              )}
              {plantState === 'flowered' && (
                <div className="flex flex-col items-center">
                  <motion.span 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="text-8xl filter drop-shadow-lg"
                  >
                    🌸
                  </motion.span>
                  <p className="text-base font-black text-rose-500 mt-3 animate-bounce">Oa! Đóa hoa nở tuyệt đẹp! 🌸</p>
                </div>
              )}
              
              {/* Pot */}
              <div className="text-7xl mt-1 select-none filter drop-shadow-sm">🏺</div>
            </div>

            {/* Custom Context Menu */}
            <AnimatePresence>
              {showContextMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{ 
                    position: 'absolute',
                    left: menuPos.x,
                    top: menuPos.y,
                  }}
                  className="bg-white border-3 border-slate-800 rounded-2xl shadow-[4px_4px_0px_0px_#1e293b] p-2 flex flex-col z-30 min-w-[140px]"
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleContextAction('water'); }}
                    className="px-4 py-2 hover:bg-blue-50 text-left font-black text-slate-800 text-sm rounded-lg flex items-center gap-2 cursor-pointer border-b border-dashed border-slate-100"
                  >
                    <span>💦</span> Tưới nước
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleContextAction('fertilize'); }}
                    className="px-4 py-2 hover:bg-amber-50 text-left font-bold text-slate-500 text-sm rounded-lg flex items-center gap-2 cursor-pointer border-b border-dashed border-slate-100"
                  >
                    <span>💩</span> Bón phân
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleContextAction('weed'); }}
                    className="px-4 py-2 hover:bg-emerald-50 text-left font-bold text-slate-500 text-sm rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span>🌿</span> Nhổ cỏ
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 7. MÀN LUYỆN KÉO THẢ CHUỘT (MÀN 6) */}
      {step === 'drag_drop' && (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="bg-sky-100 border-2 border-slate-800 rounded-2xl py-3 px-6 mb-8 text-center shadow-[3px_3px_0px_0px_#1e293b]">
            <h3 className="text-xl md:text-2xl font-black text-sky-850 leading-normal">
              Thử thách cuối cùng: Bé hãy KÉO QUẢ TÁO 🍎 thả vào miệng bạn KHỦNG LONG 🦖 đang đói nhé!
            </h3>
          </div>

          <div className="w-full h-96 flex items-center justify-between px-10 bg-emerald-50 rounded-3xl border-4 border-slate-800 shadow-[6px_6px_0px_0px_#1e293b] relative overflow-hidden">
            {/* Background grass details */}
            <div className="absolute bottom-4 left-10 text-3xl opacity-20">🌱</div>
            <div className="absolute bottom-8 right-1/3 text-4xl opacity-20">🌱</div>
            
            {/* Draggable Apple */}
            <div className="relative z-10">
              {!isAppleEaten ? (
                <motion.div
                  drag
                  dragElastic={0.2}
                  dragMomentum={false}
                  onDragEnd={handleAppleDragEnd}
                  animate={applePosition}
                  whileDrag={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
                  className="w-24 h-24 flex items-center justify-center text-7xl cursor-grab active:cursor-grabbing select-none filter drop-shadow-lg"
                >
                  🍎
                  <div className="absolute -bottom-6 px-3 py-1 bg-white border-2 border-slate-800 rounded-full font-black text-xs shadow-sm">
                    Kéo bé đi!
                  </div>
                </motion.div>
              ) : (
                <div className="w-24 h-24"></div>
              )}
            </div>

            {/* Target Dino mascot */}
            <div 
              ref={dinoRef}
              className="flex flex-col items-center p-4 rounded-3xl border-3 border-dashed border-emerald-400 bg-white/45 min-w-[200px]"
            >
              {isAppleEaten ? (
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
                  className="text-8xl filter drop-shadow-xl"
                >
                  🦖😋
                </motion.div>
              ) : (
                <div className="text-8xl animate-pulse filter drop-shadow-lg">
                  🦖😮
                </div>
              )}
              
              <div className="mt-4 px-4 py-1.5 bg-white border-2 border-slate-800 rounded-full text-xs font-black text-slate-800 shadow-[2px_2px_0px_0px_#1e293b]">
                {isAppleEaten ? 'Chăm bé ngoan quá! măm măm... 😋' : 'Dino đang đói bụng quá! 😮'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. MÀN HOÀN THÀNH TOÀN BỘ */}
      {step === 'finish' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg bg-white border-4 border-slate-800 rounded-[36px] p-8 shadow-[8px_8px_0px_0px_#1e293b] flex flex-col items-center"
        >
          <div className="w-28 h-28 bg-yellow-100 rounded-full border-4 border-slate-800 flex items-center justify-center text-6xl mb-6 shadow-[3px_3px_0px_0px_#1e293b] animate-bounce">
            🏆
          </div>

          <h2 className="text-3xl font-black text-slate-800 mb-2">
            Bé là Siêu Nhân Dùng Chuột!
          </h2>
          
          <p className="text-slate-500 font-bold text-base mb-6 leading-relaxed">
            Tuyệt vời ông mặt trời! Bé đã hoàn thành xuất sắc tất cả 5 bài luyện tập dùng chuột và biết được các thành phần chính của máy tính rồi đó!
          </p>

          <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-100 border-2 border-slate-800 rounded-2xl shadow-[3px_3px_0px_0px_#1e293b] mb-8 font-black text-amber-800 text-lg">
            <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
            <span>Phần thưởng: +100 XP học tập</span>
          </div>

          <button
            onClick={handleFinish}
            className="tactile-btn tactile-btn-primary px-8 py-4 text-lg rounded-2xl flex items-center justify-center gap-2"
          >
            <span>Nhận quà & Hoàn thành</span>
            <Award className="w-5 h-5 animate-pulse" />
          </button>
        </motion.div>
      )}

    </div>
  );
}
