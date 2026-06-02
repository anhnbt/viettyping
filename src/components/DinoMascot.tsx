'use client';

import React from 'react';
import { useStudent } from '@/contexts/StudentContext';

interface DinoMascotProps {
  className?: string;
  variant?: 'cheer' | 'victory';
}

const MASCOT_IMAGES = {
  turtle: "/assets/turtle-3d.png",
  bunny: "/assets/bunny-3d.png",
  panda: "/assets/panda-3d.png",
  leopard: "/assets/leopard-3d.png"
};

export const DinoMascot: React.FC<DinoMascotProps> = ({ 
  className = 'w-32 h-32', 
  variant = 'cheer' 
}) => {
  const { studentInfo } = useStudent();
  const theme = studentInfo?.theme || 'dino';

  if (theme !== 'dino') {
    const imgUrl = MASCOT_IMAGES[theme as keyof typeof MASCOT_IMAGES];
    if (imgUrl) {
      return (
        <div className={`relative select-none flex items-center justify-center ${className}`}>
          <style jsx global>{`
            @keyframes dino-breathing {
              0%, 100% { transform: translateY(0px) scaleY(1); }
              50% { transform: translateY(-4px) scaleY(1.02); }
            }
            @keyframes victory-jump {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              25% { transform: translateY(-12px) rotate(5deg); }
              75% { transform: translateY(-12px) rotate(-5deg); }
            }
            .animate-dino-body {
              animation: dino-breathing 3s ease-in-out infinite;
              transform-origin: bottom center;
            }
            .animate-dino-victory {
              animation: victory-jump 0.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
              transform-origin: bottom center;
            }
          `}</style>
          <img
            src={imgUrl}
            alt={`${theme} mascot`}
            className={`w-full h-full object-contain ${
              variant === 'victory' ? 'animate-dino-victory' : 'animate-dino-body'
            }`}
          />
        </div>
      );
    }
  }

  return (
    <div className={`relative select-none flex items-center justify-center ${className}`}>
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes dino-breathing {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(-4px) scaleY(1.02); }
        }
        @keyframes victory-jump {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(5deg); }
          75% { transform: translateY(-12px) rotate(-5deg); }
        }
        .animate-dino-body {
          animation: dino-breathing 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .animate-dino-victory {
          animation: victory-jump 0.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          transform-origin: bottom center;
        }
      `}</style>
      <img
        src="/assets/dino-3d.png"
        alt="dino mascot"
        className={`w-full h-full object-contain ${
          variant === 'victory' ? 'animate-dino-victory' : 'animate-dino-body'
        }`}
      />
    </div>
  );
};

export default DinoMascot;
