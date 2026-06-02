'use client';

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
          50% { transform: translateY(-3px) scaleY(1.02); }
        }
        @keyframes tail-wagging {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }
        @keyframes arm-waving-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-12deg); }
        }
        @keyframes arm-waving-right {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes victory-jump {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(3deg); }
          75% { transform: translateY(-12px) rotate(-3deg); }
        }
        @keyframes sparkle-glow {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
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
          animation: tail-wagging 1.6s ease-in-out infinite;
          transform-origin: 80px 91px;
        }
        .animate-arm-left {
          animation: arm-waving-left 1.4s ease-in-out infinite;
          transform-origin: 53px 72px;
        }
        .animate-arm-right {
          animation: arm-waving-right 1.2s ease-in-out infinite;
          transform-origin: 65px 74px;
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
        <defs>
          {/* Gradients và Filters tạo màu sắc hoạt hình dễ thương */}
          <linearGradient id="dinoSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ece7e" /> {/* Green-400 sáng vẽ hoạt hình */}
            <stop offset="100%" stopColor="#30b361" /> {/* Shadow nhẹ màu xanh lá cây */}
          </linearGradient>

          <linearGradient id="dinoSkinDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#30b361" />
            <stop offset="100%" stopColor="#22964e" /> {/* Xanh đậm hơn cho chân sau */}
          </linearGradient>

          <linearGradient id="dinoBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffebb3" /> {/* Màu kem sữa sáng */}
            <stop offset="100%" stopColor="#ffe082" /> {/* Màu vàng kem hơi đậm dưới bụng */}
          </linearGradient>

          <linearGradient id="dinoSpikeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff8787" /> {/* Màu đỏ hồng nhạt */}
            <stop offset="100%" stopColor="#f87171" /> {/* Màu đỏ coral ngọt ngào */}
          </linearGradient>

          <linearGradient id="hatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff7675" />
            <stop offset="100%" stopColor="#fd79a8" />
          </linearGradient>

          {/* Filter tạo má hồng mờ ảo dễ thương */}
          <filter id="rosyCheekFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>

          {/* Bóng đổ nhẹ dưới chân */}
          <radialGradient id="footShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(15, 23, 42, 0.25)" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
          </radialGradient>
        </defs>

        {/* Foot Shadow */}
        <ellipse cx="68" cy="108" rx="26" ry="5" fill="url(#footShadow)" />

        {/* Victory Sparkles */}
        {variant === 'victory' && (
          <g className="animate-sparkle">
            <path d="M 15 35 L 20 20 L 25 35 L 40 40 L 25 45 L 20 60 L 15 45 L 0 40 Z" fill="#FBBF24" opacity="0.9"/>
            <path d="M 95 25 L 98 15 L 102 25 L 112 28 L 102 31 L 98 41 L 95 31 L 85 28 Z" fill="#FBBF24" opacity="0.9"/>
            <circle cx="30" cy="15" r="2" fill="#FF8787" />
            <circle cx="85" cy="55" r="3" fill="#60A5FA" />
          </g>
        )}

        {/* Dino Mascot Group */}
        <g className={variant === 'victory' ? 'animate-dino-victory' : 'animate-dino-body'}>
          
          {/* 1. Các gai lưng (Spikes) chạy dọc lưng và cổ (nằm dưới thân) */}
          <circle cx="81" cy="46" r="6" fill="url(#dinoSpikeGrad)" stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="88" cy="56" r="6.5" fill="url(#dinoSpikeGrad)" stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="91" cy="68" r="7" fill="url(#dinoSpikeGrad)" stroke="#1e293b" strokeWidth="2.5" />
          <circle cx="90" cy="80" r="7" fill="url(#dinoSpikeGrad)" stroke="#1e293b" strokeWidth="2.5" />

          {/* 2. Chân sau (chân phải) - nằm dưới thân */}
          <rect x="74" y="90" width="12" height="17" rx="6" fill="url(#dinoSkinDark)" stroke="#1e293b" strokeWidth="3" />

          {/* 3. Đuôi (Tail) & các gai đuôi - nhóm lại để vẫy cùng nhau sinh động */}
          <g className="animate-tail">
            <circle cx="94" cy="91" r="6" fill="url(#dinoSpikeGrad)" stroke="#1e293b" strokeWidth="2.5" />
            <circle cx="102" cy="95" r="5" fill="url(#dinoSpikeGrad)" stroke="#1e293b" strokeWidth="2.5" />
            <path
              d="M 80 82 C 95 80, 105 85, 105 95 C 105 101, 94 102, 78 91 Z"
              fill="url(#dinoSkinGrad)"
              stroke="#1e293b"
              strokeWidth="3.2"
              strokeLinejoin="round"
            />
          </g>

          {/* 4. Chân trước (chân trái) - nằm trên chân sau */}
          <rect x="58" y="92" width="13" height="17" rx="6.5" fill="url(#dinoSkinGrad)" stroke="#1e293b" strokeWidth="3.2" />

          {/* 5. Thân & Đầu (Body & Head) */}
          {/* Khối chính màu xanh lá */}
          <path
            d="M 80 55 C 85 70, 86 85, 83 95 C 80 100, 65 102, 58 100 C 48 95, 48 80, 50 70 C 46 62, 40 58, 42 50 C 44 42, 55 38, 70 40 C 78 41, 80 48, 80 55 Z"
            fill="url(#dinoSkinGrad)"
          />

          {/* Bụng màu kem tròn trịa đè lên thân */}
          <path
            d="M 50 72 C 48 80, 48 92, 58 99 C 64 99, 70 92, 69 72 C 63 68, 54 68, 50 72 Z"
            fill="url(#dinoBellyGrad)"
          />

          {/* Nét viền đen (stroke) cho thân đầu để bao bọc sạch sẽ rìa bụng kem */}
          <path
            d="M 80 55 C 85 70, 86 85, 83 95 C 80 100, 65 102, 58 100 C 48 95, 48 80, 50 70 C 46 62, 40 58, 42 50 C 44 42, 55 38, 70 40 C 78 41, 80 48, 80 55 Z"
            fill="none"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* 6. Chi tiết Mặt (Face details) */}
          {/* Mắt tròn đen nhỏ dễ thương kiểu hạt đậu */}
          <circle cx="49" cy="48" r="2.5" fill="#1e293b" />
          <circle cx="48.2" cy="47.2" r="0.7" fill="white" /> {/* Điểm sáng nhỏ phản chiếu */}

          {/* Miệng cười mở to đáng yêu */}
          <path
            d="M 42 54 C 44 54, 51 52, 52 57 C 52 62, 46 64, 42 59 C 41 58, 42 55, 42 54 Z"
            fill="#be123c" /* Đỏ sậm bên trong miệng */
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Chiếc lưỡi hồng hào xinh xắn */}
          <path
            d="M 44 59 C 47 57, 50 58, 50 61 C 49 63, 46 63, 44 59 Z"
            fill="#ff8b94"
          />

          {/* Má hồng tròn xoe mờ ảo */}
          <circle cx="53" cy="59" r="3.5" fill="#ffa8a8" filter="url(#rosyCheekFilter)" />

          {/* 7. Hai cánh tay (Arms) - Đặt lên trên thân để đè viền */}
          {/* Cánh tay trái */}
          <g className="animate-arm-left">
            <path
              d="M 52 74 C 47 74, 43 71, 46 68 C 49 65, 53 70, 53 74 Z"
              fill="url(#dinoSkinGrad)"
              stroke="#1e293b"
              strokeWidth="2.8"
            />
          </g>

          {/* Cánh tay phải */}
          <g className="animate-arm-right">
            <path
              d="M 64 76 C 59 76, 55 73, 58 70 C 61 67, 65 72, 65 76 Z"
              fill="url(#dinoSkinGrad)"
              stroke="#1e293b"
              strokeWidth="2.8"
            />
          </g>

          {/* 8. Mũ sinh nhật chiến thắng (Party Hat) */}
          {variant === 'victory' && (
            <g>
              <path d="M 62 38 L 68 14 L 76 38 Z" fill="url(#hatGrad)" stroke="#1e293b" strokeWidth="2.8" />
              <path d="M 64 30 L 74 30" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 66 22 L 72 22" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="68" cy="13" r="3" fill="#ffd43b" stroke="#1e293b" strokeWidth="2" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export default DinoMascot;
