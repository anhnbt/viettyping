import React, { useRef, useState, useEffect } from 'react';
import { ActivityAdapterProps } from '@/types/activity';
import { IoRefresh } from 'react-icons/io5';

export const DrawingActivity: React.FC<ActivityAdapterProps> = ({ activity, onComplete, onProgressUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [strokesCount, setStrokesCount] = useState<number>(0);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setStrokesCount((prev) => prev + 1);
    
    // Simulate some progress based on interaction
    if (onProgressUpdate) {
      onProgressUpdate(Math.min(100, strokesCount * 10)); 
    }
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.beginPath(); // Start new path to avoid connecting lines
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ec4899'; // Pink color

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleClear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setStrokesCount(0);
      if (onProgressUpdate) onProgressUpdate(0);
    }
  };

  const handleFinish = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    
    if (onProgressUpdate) onProgressUpdate(100);

    onComplete({
      score: 100,
      duration,
      rawPayload: {
        action: 'completed_drawing',
        strokes: strokesCount
      }
    });
  };

  return (
    <div className="text-center w-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
        <p className="text-gray-600">{activity.instructions}</p>
      </div>
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6 inline-block w-full max-w-lg">
        <canvas
          ref={canvasRef}
          width={500}
          height={300}
          className="bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair touch-none w-full"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleClear}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 font-bold shadow-md"
        >
          <IoRefresh /> Xóa
        </button>
        <button
          onClick={handleFinish}
          className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-bold shadow-md"
        >
          Hoàn thành vẽ
        </button>
      </div>
    </div>
  );
};
