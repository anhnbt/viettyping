import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 hover:scale-105 active:scale-95`}
    >
      {/* Background/Shadow of Dino */}
      <path
        d="M 12 56 C 8 68, 12 78, 25 80 C 38 82, 52 80, 66 80 C 80 80, 85 70, 85 58 C 85 45, 75 35, 60 35 C 50 35, 45 42, 38 42 C 30 42, 18 38, 12 56 Z"
        fill="#1E293B"
      />

      {/* Dino Body Shape (Green #4ADE80) */}
      <path
        d="M 12 52 C 8 64, 12 74, 25 76 C 38 78, 52 76, 66 76 C 80 76, 85 66, 85 54 C 85 41, 75 31, 60 31 C 50 31, 45 38, 38 38 C 30 38, 18 34, 12 52 Z"
        fill="#4ADE80"
        stroke="#1E293B"
        strokeWidth="4.5"
      />
      
      {/* Dino Spikes (Coral Orange #F87171) */}
      <path d="M 28 32 L 23 20 L 33 27 Z" fill="#F87171" stroke="#1E293B" strokeWidth="3.5" />
      <path d="M 40 29 L 36 17 L 46 25 Z" fill="#F87171" stroke="#1E293B" strokeWidth="3.5" />
      <path d="M 52 30 L 53 18 L 59 29 Z" fill="#F87171" stroke="#1E293B" strokeWidth="3.5" />

      {/* Dino Tail (curving on the left) */}
      <path
        d="M 12 52 C 4 48, -2 58, 2 68 C 5 72, 12 72, 12 52"
        fill="#4ADE80"
        stroke="#1E293B"
        strokeWidth="4.5"
      />
      
      {/* Embedded Keycap (Cream #FDFBF7) */}
      <rect x="30" y="44" width="30" height="26" rx="8" fill="#FDFBF7" stroke="#1E293B" strokeWidth="4" />
      
      {/* Checkmark / 'v' inside Keycap (Green #22C55E) */}
      <path d="M 38 56 L 44 62 L 53 50" stroke="#22C55E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Dino Eye (on the right) */}
      <circle cx="72" cy="46" r="5" fill="white" stroke="#1E293B" strokeWidth="3" />
      <circle cx="72" cy="46" r="2.2" fill="black" />
      <circle cx="70.5" cy="44.5" r="0.9" fill="white" />
      
      {/* Dino Rosy Cheek */}
      <circle cx="80" cy="53" r="3" fill="#F87171" opacity="0.8" />

      {/* Dino Smile */}
      <path d="M 70 55 Q 73 58, 77 54" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
};

export default Logo;
