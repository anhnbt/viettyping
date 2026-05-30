"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoColorPaletteOutline, IoTrashOutline, IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5";
import { GameAdapterProps, TelemetryPayload, ColoringCanvasItem } from "@/types/lesson";

const SHAPES: Record<string, { path: string; stroke: string; width: number; height: number; viewBox: string }> = {
  heart: {
    path: "M250,90 C200,30 110,30 110,110 C110,190 200,250 250,330 C300,250 390,190 390,110 C390,30 300,30 250,90 Z",
    stroke: "#000000",
    width: 500,
    height: 400,
    viewBox: "0 0 500 400"
  },
  star: {
    path: "M250,50 L310,170 L440,190 L340,280 L370,410 L250,340 L130,410 L160,280 L60,190 L190,170 Z",
    stroke: "#000000",
    width: 500,
    height: 450,
    viewBox: "0 0 500 450"
  },
  tree: {
    path: "M250,40 L130,190 L180,190 L100,310 L220,310 L220,390 L280,390 L280,310 L400,310 L320,190 L370,190 Z",
    stroke: "#000000",
    width: 500,
    height: 450,
    viewBox: "0 0 500 450"
  }
};

const COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#14b8a6", // Teal
];

export default function ColoringCanvas({ gameConfig, onComplete }: GameAdapterProps<ColoringCanvasItem>) {
  const { id: gameId, items } = gameConfig;
  const currentItem = items[0] || { outlineSvgName: "heart", title: "Tô màu hình Trái tim", targetCoveragePercent: 70 };
  const shapeKey = currentItem.outlineSvgName in SHAPES ? currentItem.outlineSvgName : "heart";
  const shape = SHAPES[shapeKey];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[6]); // Mặc định màu hồng
  const [brushSize, setBrushSize] = useState(16);
  const [isClient, setIsClient] = useState(false);
  
  // Realtime stats
  const [coveragePercent, setCoveragePercent] = useState(0);
  const [bleedPercent, setBleedPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Telemetry references
  const startTimeRef = useRef<number>(Date.now());
  const drawingStrokesRef = useRef<number>(0);

  useEffect(() => {
    setIsClient(true);
    startTimeRef.current = Date.now();
    drawingStrokesRef.current = 0;
    
    // Draw outline once canvas is mounted
    setTimeout(drawOutline, 100);
  }, [gameId, shapeKey]);

  const drawOutline = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the shape outline path
    ctx.save();
    ctx.strokeStyle = "#475569"; // Slate gray border
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    const p = new Path2D(shape.path);
    ctx.stroke(p);
    ctx.restore();

    setCoveragePercent(0);
    setBleedPercent(0);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    drawingStrokesRef.current += 1;
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
      }
    }
    // Calculate coverage and bleed in real-time on draw end
    calculateCoverageAndBleed();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.save();
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = selectedColor;
    ctx.globalCompositeOperation = "destination-over"; // Vẽ đằng sau nét viền đen của outline

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.restore();

    // Redraw black outline on top just in case paint went over it
    ctx.save();
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 4;
    const p = new Path2D(shape.path);
    ctx.globalCompositeOperation = "source-over"; // Vẽ nét viền đè lên trên màu tô
    ctx.stroke(p);
    ctx.restore();
  };

  const calculateCoverageAndBleed = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Path definition
    const path = new Path2D(shape.path);

    // Sample points in a grid
    const step = 8; // Kích thước lưới lấy mẫu
    let insideTotal = 0;
    let insidePainted = 0;
    let outsidePainted = 0;

    for (let x = step; x < width; x += step) {
      for (let y = step; y < height; y += step) {
        const isInside = ctx.isPointInPath(path, x, y);
        
        // Check pixel paint (alpha channel)
        const imgData = ctx.getImageData(x, y, 1, 1).data;
        const isPainted = imgData[3] > 30; // check alpha value

        if (isInside) {
          insideTotal++;
          if (isPainted) {
            // make sure we don't count the initial gray outline color (it is painted)
            // check if it is not just grey outline color
            const r = imgData[0];
            const g = imgData[1];
            const b = imgData[2];
            const isGrayOutline = r === 0x47 && g === 0x55 && b === 0x69;
            if (!isGrayOutline) {
              insidePainted++;
            }
          }
        } else {
          if (isPainted) {
            outsidePainted++;
          }
        }
      }
    }

    const coverage = Math.round((insidePainted / Math.max(insideTotal, 1)) * 100);
    const bleed = Math.round((outsidePainted / Math.max(insideTotal, 1)) * 100);

    setCoveragePercent(coverage);
    setBleedPercent(Math.min(100, bleed));
  };

  const handleClear = () => {
    drawOutline();
    setErrorMessage(null);
  };

  const handleFinish = () => {
    const target = currentItem.targetCoveragePercent || 70;
    
    if (coveragePercent < 30) {
      setErrorMessage("Bé ơi, hãy tô màu thêm một chút nữa trước khi hoàn thành nhé!");
      return;
    }

    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    // Tính điểm: Độ phủ trừ đi một phần độ lem
    const score = Math.max(10, Math.min(100, coveragePercent - Math.round(bleedPercent * 0.5)));

    onComplete({
      score,
      durationSeconds,
      metadata: {
        colorCoveragePercent: coveragePercent,
        colorBleedPercent: bleedPercent,
      }
    });
  };

  if (!isClient) return null;

  return (
    <div className="w-full flex flex-col items-center gap-6">
      
      {/* Title block */}
      <div className="w-full max-w-xl bg-pink-50 border border-pink-100 rounded-3xl p-5 shadow-sm">
        <h4 className="text-xl md:text-2xl font-black text-pink-700 mb-1 leading-snug">
          {currentItem.title}
        </h4>
        <p className="text-xs text-slate-500 font-bold">
          Nhiệm vụ: Chọn các màu sắc yêu thích và di cọ vẽ để tô kín bên trong hình nhé!
        </p>
      </div>

      {/* Workspace */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full py-2">
        
        {/* Colors Palette & Tooling */}
        <div className="flex flex-row lg:flex-col gap-3 p-4 bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-sm w-full lg:w-auto justify-center flex-wrap">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 hidden lg:block text-center flex-1">
            Màu vẽ
          </div>
          {COLORS.map((c) => (
            <motion.button
              key={c}
              onClick={() => setSelectedColor(c)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 rounded-full border-4 shadow-inner transition-all ${
                selectedColor === c ? "border-slate-700 scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="h-px bg-slate-100 my-1 hidden lg:block" />
          
          {/* Brush size settings */}
          <div className="flex items-center gap-2 lg:flex-col mt-1">
            <button
              onClick={() => setBrushSize(10)}
              className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-colors border ${
                brushSize === 10 ? "bg-slate-700 text-white border-slate-700" : "bg-slate-50 text-slate-500 border-slate-200"
              }`}
            >
              Cọ Nhỏ
            </button>
            <button
              onClick={() => setBrushSize(20)}
              className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-colors border ${
                brushSize === 20 ? "bg-slate-700 text-white border-slate-700" : "bg-slate-50 text-slate-500 border-slate-200"
              }`}
            >
              Cọ To
            </button>
          </div>
        </div>

        {/* Canvas painting area */}
        <div className="bg-gradient-to-tr from-pink-50/30 to-purple-50/30 border border-slate-200/50 rounded-[36px] p-5 shadow-sm relative w-full max-w-lg">
          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            className="bg-white border-2 border-dashed border-slate-200 rounded-[28px] cursor-crosshair touch-none w-full shadow-inner"
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
          />
        </div>

        {/* Real-time statistics display for Parents/Educators */}
        <div className="flex flex-col gap-3 p-5 bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-sm w-full max-w-xs text-sm">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1 text-center">
            Chỉ số đánh giá độ khéo
          </div>
          <div className="flex justify-between items-center text-slate-600 font-bold">
            <span>Độ phủ màu (Coverage):</span>
            <span className="text-base font-black text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
              {coveragePercent}%
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-600 font-bold">
            <span>Độ lem ngoài (Bleed):</span>
            <span className={`text-base font-black px-3 py-1 rounded-full ${
              bleedPercent > 15 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
            }`}>
              {bleedPercent}%
            </span>
          </div>
          <div className="text-[10px] text-slate-400 leading-normal border-t border-slate-100 pt-2 italic mt-1">
            * Mẹo: Bé hãy tô kín hình vẽ bên trong và chú ý không vẽ chệch ra ngoài đường viền đen nhé!
          </div>
        </div>

      </div>

      {/* Error alert message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1.5 text-red-500 bg-red-50 px-4 py-2 rounded-xl font-bold border border-red-200"
          >
            <IoAlertCircle className="text-lg" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between w-full max-w-xl bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0">
        <button
          onClick={handleClear}
          className="flex items-center gap-1 px-5 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors shadow-sm text-sm"
        >
          <IoTrashOutline className="text-base" />
          Tô lại
        </button>
        <button
          onClick={handleFinish}
          className="flex items-center gap-1.5 px-8 py-3 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-50 hover:to-pink-600 text-white font-black text-lg rounded-2xl shadow-[0_4px_0_0_#db2777] hover:shadow-[0_2px_0_0_#db2777] transition-all hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]"
        >
          <IoCheckmarkCircle size={20} />
          Hoàn thành
        </button>
      </div>

    </div>
  );
}
