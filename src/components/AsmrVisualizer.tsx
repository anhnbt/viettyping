'use client';

import React, { useRef, useEffect } from 'react';

interface Props {
  triggerSignal: number; // Tín hiệu thay đổi tăng dần khi có phím bấm để kích hoạt xung sóng
  ledMode: 'rgb' | 'warm' | 'cool' | 'off';
}

export default function AsmrVisualizer({ triggerSignal, ledMode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const pulseRef = useRef(0);

  // Kích hoạt xung sóng khi triggerSignal thay đổi
  useEffect(() => {
    if (triggerSignal > 0) {
      pulseRef.current = 1.0; // Đặt xung sóng lên mức cao nhất
    }
  }, [triggerSignal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    
    // Tự động điều chỉnh kích thước Canvas theo thẻ cha
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = (rect?.width || 600) * window.devicePixelRatio;
      canvas.height = (rect?.height || 100) * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Xác định màu sắc sóng dựa trên chế độ LED
    const getWaveColor = (alpha: number) => {
      if (ledMode === 'rgb') {
        return `rgba(79, 70, 229, ${alpha})`; // Indigo đậm đà tươi sáng
      } else if (ledMode === 'warm') {
        return `rgba(217, 119, 6, ${alpha})`; // Hổ phách sáng
      } else if (ledMode === 'cool') {
        return `rgba(8, 145, 178, ${alpha})`; // Cyan sáng
      }
      return `rgba(100, 116, 139, ${alpha})`; // Slate
    };

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      
      ctx.clearRect(0, 0, w, h);
      
      // Giảm dần xung sóng theo thời gian
      pulseRef.current *= 0.95;
      if (pulseRef.current < 0.01) pulseRef.current = 0;

      phaseRef.current += 0.015; // Tốc độ trôi của sóng
      
      // Vẽ 3 đường sóng chồng lên nhau với độ lệch pha khác nhau để tạo cảm giác trôi mềm mại
      const drawWave = (amplitudeMultiplier: number, frequency: number, phaseOffset: number, opacity: number, lineWidth: number) => {
        ctx.beginPath();
        ctx.strokeStyle = getWaveColor(opacity);
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        
        const centerY = h / 2;
        const maxAmplitude = h * 0.35; // Biên độ tối đa chiếm 35% chiều cao

        for (let x = 0; x < w; x++) {
          // Tạo hiệu ứng thu nhỏ biên độ ở hai đầu (fade-out edges)
          const edgeDecay = Math.sin((x / w) * Math.PI);
          
          // Tính biên độ sóng tại điểm x
          const ambientWave = Math.sin(x * frequency + phaseRef.current + phaseOffset) * 8;
          const keystrokePulse = Math.sin(x * (frequency * 2.5) + phaseRef.current * 3 + phaseOffset) * maxAmplitude * pulseRef.current;
          
          const y = centerY + (ambientWave + keystrokePulse) * amplitudeMultiplier * edgeDecay;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      };

      // Vẽ sóng nền (mỏng và mờ)
      drawWave(0.6, 0.008, 0, 0.15, 1.5);
      drawWave(0.8, 0.012, Math.PI / 3, 0.25, 1);
      // Vẽ sóng tương tác chính (nổi bật lên khi gõ)
      drawWave(1.2, 0.005, -Math.PI / 4, 0.45 + pulseRef.current * 0.3, 2 + pulseRef.current * 1.5);
      
      // Thêm các hạt ánh sáng (particles) nhỏ bay quanh sóng khi có phím bấm
      if (pulseRef.current > 0.05) {
        const particleCount = Math.floor(pulseRef.current * 8);
        for (let i = 0; i < particleCount; i++) {
          const px = (phaseRef.current * 80 + i * (w / 8)) % w;
          const py = h / 2 + Math.sin(px * 0.01 + phaseRef.current) * 15 + (Math.sin(i + phaseRef.current) * 10);
          ctx.beginPath();
          ctx.arc(px, py, 1.5 + pulseRef.current * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = getWaveColor(pulseRef.current * 0.4);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [ledMode]);

  return (
    <div className="w-full h-16 relative flex items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-surface-container)] border-2 border-[var(--color-foreground)] p-1 shadow-inner">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-container)]/80 via-transparent to-[var(--color-surface-container)]/80 pointer-events-none" />
    </div>
  );
}
