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
      {/* 1. Gai lưng phía sau (Back Spikes) */}
      {/* Gai 1 (Cạnh trái dưới) */}
      <circle
        cx="33"
        cy="55"
        r="6.5"
        fill="var(--color-secondary, #f87171)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
      />
      {/* Gai 2 (Cạnh trái trên) */}
      <circle
        cx="37"
        cy="39"
        r="8"
        fill="var(--color-secondary, #f87171)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
      />
      {/* Gai 3 (Cạnh trên trái) */}
      <circle
        cx="51"
        cy="28"
        r="9"
        fill="var(--color-secondary, #f87171)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
      />
      {/* Gai 4 (Cạnh trên phải) */}
      <circle
        cx="68"
        cy="27"
        r="7.5"
        fill="var(--color-secondary, #f87171)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
      />

      {/* 2. Lớp Đáy (3D Depth Shadow) cho cả thân phím và đuôi */}
      <path
        d="M 50 38 H 76 A 12 12 0 0 1 88 50 V 76 A 12 12 0 0 1 76 88 H 56 C 44 88, 30 85, 22 78 C 14 71, 14 62, 18 56 C 21 51, 26 55, 27 61 C 28 68, 30 74, 38 76 V 50 A 12 12 0 0 1 50 38 Z"
        fill="var(--color-primary-depth, #15803d)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
        strokeLinejoin="round"
        transform="translate(0, 4.5)"
      />

      {/* 3. Lớp Mặt Chính (Base Body) cho cả thân phím và đuôi */}
      <path
        d="M 50 38 H 76 A 12 12 0 0 1 88 50 V 76 A 12 12 0 0 1 76 88 H 56 C 44 88, 30 85, 22 78 C 14 71, 14 62, 18 56 C 21 51, 26 55, 27 61 C 28 68, 30 74, 38 76 V 50 A 12 12 0 0 1 50 38 Z"
        fill="var(--color-primary, #22c55e)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* 4. Gai Đuôi Nhỏ ở trong lòng đuôi */}
      <circle
        cx="21.5"
        cy="66"
        r="3"
        fill="var(--color-secondary, #f87171)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="2"
      />
      <circle
        cx="27"
        cy="71"
        r="3"
        fill="var(--color-secondary, #f87171)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="2"
      />
      <circle
        cx="33.5"
        cy="74"
        r="3"
        fill="var(--color-secondary, #f87171)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="2"
      />

      {/* 5. Mặt Phím Bấm (Keycap Top Face) */}
      <rect
        x="45"
        y="42"
        width="38"
        height="38"
        rx="9.5"
        fill="var(--color-primary-container, #86efac)"
      />

      {/* 6. Dải sáng highlight tinh tế trên mặt phím */}
      <path
        d="M 49 46 A 6 6 0 0 1 55 44 H 74"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.6"
        fill="none"
      />

      {/* 7. Chữ V và Dấu Phụ */}
      <path
        d="M 54.5 53.5 L 64 67.5 L 73.5 53.5"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 60 46 C 61 48.5, 67 48.5, 68 46"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default Logo;
