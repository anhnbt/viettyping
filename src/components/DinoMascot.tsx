import React from 'react';
import { useStudent } from '@/contexts/StudentContext';

interface DinoMascotProps {
  className?: string;
  variant?: 'cheer' | 'victory';
}

const MASCOT_IMAGES = {
  turtle: "https://lh3.googleusercontent.com/aida/ADBb0ujKzOv1Gfnk7V0Hg2Xw-oGB35KqunPyykSPt02wU5_NQT29AZTYRZCIF5nNJSModwaKW_Y8-2rLRnSE9sfL0jN6TGSCEgF46KEgcBSYLBkwJQgOWvgcCwvup3wIJbNPu8LWQX0vyOT_5SqRXJiZ9BrAJ5Ze8wLAXtv-s8EwfjLlyQ5x6D4pOUHLzmMBR0POACvACLBjThdbGM5VRwEZ3ZprFLg43Y0Ys__vdRoHSWXORzHKRdnXrmuP2cA",
  bunny: "https://lh3.googleusercontent.com/aida/ADBb0uiccFaLr883SRghZuRfNoBoqOH659tF15YYtMeTb0kVjlVoRgvsV2QX90JKuFisj42VE23v7dpEIceDGKdreK12VNZi1Fi1SWUmcfgWr-93nxn6dJcICrv_mYUyari8BDXpdIBQVOE1MkvAlULAtYyF4EGIis7k8nsn3FoIqCepslojd-d8U6O8SiPYyOx6KYUWtBeiGDff7oqAQ9aElyDV1_znfHFhbSJ_lBTEyF2nIX7QjutpcpjxAaE0",
  pig: "https://lh3.googleusercontent.com/aida/ADBb0ug0TuuXRulCzGueSZIjS6G90yWDUXxNedTwx2pz4aO_4i13vhO_JoUk6t0sIJKDemzFX-aKYe2efkg-pZI6wHFbRSVDWCNXN7qe74nrplxW4nDHThwE9KPUmU2nJo_jahgx4ErMp9afwTLyFzphVFvwyugKt2_1b8b7jntTHp6SHX3pYwSqr4zsEztrMUzdaQ6h9cvEhtWChvIPT4dYV0KgCnue-tKAx1N4a9dpTORjjHMLxNCNhoV4yJoy",
  leopard: "https://lh3.googleusercontent.com/aida/ADBb0uiNbpkX0J0Sz5jD3UUlwL6rwBenYBtjB6c8rEMXE0VCjQHbVpwYSgq-D-vnxTW6F0oyUwsf2NtJKV1gx5FnY1rBt8-HQnz8B5Rw29PDlUii1ibAPd8wCEz8JBNPHPUdQqeIjbuCd2lrAel-7qlXdcot49gy8_WPz6nwgiiCM_Z4YBX6H39Kw20oa35Kro9vLUr51NgXmjVvfox8BHcdNKnTfbnWIbMoCa9JU9DarmjWqQ0KqQ17brWlfpPs"
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
        @keyframes tail-wagging {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes arm-waving {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
        }
        @keyframes eye-blinking {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes victory-jump {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(5deg); }
          75% { transform: translateY(-12px) rotate(-5deg); }
        }
        @keyframes sparkle-glow {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-dino-body {
          animation: dino-breathing 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .animate-dino-victory {
          animation: victory-jump 0.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          transform-origin: bottom center;
        }
        .animate-tail {
          animation: tail-wagging 1.5s ease-in-out infinite;
          transform-origin: 28px 75px;
        }
        .animate-arm-left {
          animation: arm-waving 1.8s ease-in-out infinite;
          transform-origin: 40px 60px;
        }
        .animate-arm-right {
          animation: arm-waving 1.2s ease-in-out infinite;
          transform-origin: 65px 60px;
        }
        .animate-eye {
          animation: eye-blinking 4s infinite;
          transform-origin: center;
        }
        .animate-sparkle {
          animation: sparkle-glow 1.5s infinite;
        }
      `}</style>

      {/* Mascot SVG Canvas */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Victory Sparkles */}
        {variant === 'victory' && (
          <g className="animate-sparkle">
            {/* Sparkle 1 */}
            <path d="M 15 35 L 20 20 L 25 35 L 40 40 L 25 45 L 20 60 L 15 45 L 0 40 Z" fill="#FBBF24" opacity="0.8"/>
            {/* Sparkle 2 */}
            <path d="M 95 25 L 98 15 L 102 25 L 112 28 L 102 31 L 98 41 L 95 31 L 85 28 Z" fill="#FBBF24" opacity="0.8"/>
            {/* Tiny stars */}
            <circle cx="30" cy="15" r="2" fill="#F87171" />
            <circle cx="85" cy="55" r="3" fill="#60A5FA" />
          </g>
        )}

        {/* Dino Mascot Group wrapper */}
        <g className={variant === 'victory' ? 'animate-dino-victory' : 'animate-dino-body'}>
          
          {/* Dino Tail */}
          <path
            d="M 32 72 Q 12 75, 16 55 Q 18 45, 8 48 Q 4 58, 12 78 Q 22 84, 34 82 Z"
            fill="#4ADE80"
            stroke="#1E293B"
            strokeWidth="4"
            className="animate-tail"
          />
          {/* Spikes on Tail */}
          <path d="M 14 53 L 8 46 L 16 43 Z" fill="#F87171" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M 8 62 L 0 58 L 6 52 Z" fill="#F87171" stroke="#1E293B" strokeWidth="2.5" />

          {/* Dino Legs */}
          {/* Left Foot */}
          <rect x="42" y="86" width="12" height="14" rx="6" fill="#22C55E" stroke="#1E293B" strokeWidth="4" />
          <path d="M 44 96 H 52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right Foot */}
          <rect x="62" y="86" width="12" height="14" rx="6" fill="#22C55E" stroke="#1E293B" strokeWidth="4" />
          <path d="M 64 96 H 72" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

          {/* Dino Body */}
          <path
            d="M 32 78 C 32 50, 42 40, 58 40 C 74 40, 84 50, 84 78 C 84 94, 76 96, 58 96 C 40 96, 32 94, 32 78 Z"
            fill="#4ADE80"
            stroke="#1E293B"
            strokeWidth="4.5"
          />

          {/* Dino Belly (Pale Green) */}
          <path
            d="M 42 74 C 42 56, 48 50, 58 50 C 68 50, 74 56, 74 74 C 74 88, 68 90, 58 90 C 48 90, 42 88, 42 74 Z"
            fill="#86EFAC"
          />

          {/* Dino Spikes on Back */}
          <path d="M 40 44 L 35 34 L 46 38 Z" fill="#F87171" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M 50 40 L 50 28 L 58 38 Z" fill="#F87171" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M 62 40 L 67 28 L 70 38 Z" fill="#F87171" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M 74 44 L 81 35 L 78 45 Z" fill="#F87171" stroke="#1E293B" strokeWidth="2.5" />

          {/* Dino Left Hand / Arm */}
          <path
            d="M 40 64 C 32 64, 28 55, 34 52 C 40 49, 42 58, 42 64 Z"
            fill="#22C55E"
            stroke="#1E293B"
            strokeWidth="4"
            className="animate-arm-left"
          />

          {/* Dino Right Hand / Arm */}
          <path
            d="M 76 64 C 84 64, 88 55, 82 52 C 76 49, 74 58, 74 64 Z"
            fill="#22C55E"
            stroke="#1E293B"
            strokeWidth="4"
            className="animate-arm-right"
          />

          {/* Eyes (Animated Blinking) */}
          {/* Left Eye */}
          <g className="animate-eye">
            <circle cx="48" cy="56" r="8" fill="white" stroke="#1E293B" strokeWidth="3" />
            <circle cx="49" cy="55" r="4.5" fill="#1E293B" />
            <circle cx="47" cy="53" r="1.5" fill="white" />
          </g>
          {/* Right Eye */}
          <g className="animate-eye">
            <circle cx="68" cy="56" r="8" fill="white" stroke="#1E293B" strokeWidth="3" />
            <circle cx="67" cy="55" r="4.5" fill="#1E293B" />
            <circle cx="65" cy="53" r="1.5" fill="white" />
          </g>

          {/* Dino Rosy Cheeks */}
          <circle cx="39" cy="64" r="4" fill="#F87171" opacity="0.6" />
          <circle cx="77" cy="64" r="4" fill="#F87171" opacity="0.6" />

          {/* Cute Mouth / Smile */}
          <path
            d="M 52 66 Q 58 72, 64 66"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cute Teeth */}
          <path d="M 54 66 L 56 69 L 58 66 Z" fill="white" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M 58 66 L 60 69 L 62 66 Z" fill="white" stroke="#1E293B" strokeWidth="1.5" />

          {/* Party Hat (Only in Victory variant) */}
          {variant === 'victory' && (
            <g>
              {/* Cone Hat */}
              <path d="M 50 38 L 58 10 L 66 38 Z" fill="#F87171" stroke="#1E293B" strokeWidth="3" />
              {/* Stripes on Hat */}
              <path d="M 53 28 L 63 28" stroke="#FBBF24" strokeWidth="3" />
              <path d="M 55 20 L 61 20" stroke="#60A5FA" strokeWidth="3" />
              {/* Pom pom at top */}
              <circle cx="58" cy="9" r="4.5" fill="#FBBF24" stroke="#1E293B" strokeWidth="2.5" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export default DinoMascot;
