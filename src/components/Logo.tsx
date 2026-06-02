import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-12 h-12' }) => {
  return (
    <svg
      viewBox="11 9 78 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 hover:scale-105 active:scale-95`}
    >
      {/* 1. Gai lưng (Back Spikes) & Sừng trên đầu nằm ở lớp dưới cùng */}
      {/* Gai 0: Đỉnh đầu */}
      <circle
        cx="26"
        cy="17"
        r="4.5"
        fill="var(--color-secondary, #ff5e5e)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
      />
      {/* Gai 1: Nối giữa đầu và thân */}
      <circle
        cx="31"
        cy="30"
        r="5.5"
        fill="var(--color-secondary, #ff5e5e)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
      />
      {/* Gai 2: Lưng trên */}
      <circle
        cx="32"
        cy="46"
        r="6"
        fill="var(--color-secondary, #ff5e5e)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
      />
      {/* Gai 3: Lưng dưới */}
      <circle
        cx="32"
        cy="62"
        r="6"
        fill="var(--color-secondary, #ff5e5e)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
      />

      {/* 2. Đuôi và Chân khủng long nằm ở lớp dưới thân */}
      {/* Đuôi khủng long */}
      <path
        d="M 70 70 C 82 72, 90 65, 88 52 C 84 48, 80 52, 78 57 C 76 61, 74 64, 72 66 Z"
        fill="var(--color-primary, #2ecc71)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      
      {/* Chân trái */}
      <circle
        cx="45"
        cy="78"
        r="6.5"
        fill="var(--color-primary, #2ecc71)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
      />
      {/* Chân phải */}
      <circle
        cx="67"
        cy="78"
        r="6.5"
        fill="var(--color-primary, #2ecc71)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
      />

      {/* 3. Lớp đổ bóng 3D của thân + đầu (3D Depth Shadow) */}
      <path
        d="M 50 35 H 67 A 10 10 0 0 1 77 45 V 67 A 10 10 0 0 1 67 77 H 45 A 10 10 0 0 1 35 67 V 52 C 25 50, 16 46, 14 38 C 12 28, 18 22, 26 22 C 33 22, 38 29, 45 35 Z"
        fill="var(--color-primary-depth, #1b8a44)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
        strokeLinejoin="round"
        transform="translate(0, 4.5)"
      />

      {/* 4. Khối thân chính + đầu (Main Body & Head) */}
      <path
        d="M 50 35 H 67 A 10 10 0 0 1 77 45 V 67 A 10 10 0 0 1 67 77 H 45 A 10 10 0 0 1 35 67 V 52 C 25 50, 16 46, 14 38 C 12 28, 18 22, 26 22 C 33 22, 38 29, 45 35 Z"
        fill="var(--color-primary, #2ecc71)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* 5. Chi tiết khuôn mặt trên đầu */}
      {/* Mắt */}
      <circle
        cx="21"
        cy="30"
        r="2.2"
        fill="var(--color-foreground, #231a11)"
      />
      {/* Má hồng */}
      <circle
        cx="26"
        cy="34"
        r="3"
        fill="#ff8787"
        opacity="0.8"
      />
      {/* Nụ cười */}
      <path
        d="M 16.5 33.5 Q 18.5 36 20.5 33.5"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* 6. Mặt phím bấm (Keycap Top Face) */}
      <rect
        x="43"
        y="41"
        width="28"
        height="28"
        rx="7"
        fill="var(--color-primary-container, #a2f2b7)"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="2.5"
      />

      {/* 7. Chữ V cách điệu và dấu ă trên mặt phím */}
      {/* Chữ V */}
      <path
        d="M 50 50 L 57 60 L 64 50"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Dấu ă */}
      <path
        d="M 53.5 45 C 55 47, 59 47, 60.5 45"
        stroke="var(--color-foreground, #231a11)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default Logo;
