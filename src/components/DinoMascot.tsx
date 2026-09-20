'use client';

import React from 'react';
import { useStudent } from '@/contexts/StudentContext';
import { InteractiveMascot, MascotReaction } from './InteractiveMascot';

export interface DinoMascotProps {
  className?: string;
  variant?: 'cheer' | 'victory';
  reactionOverride?: MascotReaction | null;
  speechText?: string | null;
  showBubbleOnBoop?: boolean;
  onBoop?: () => void;
}

// Bảng ánh xạ Theme của học sinh sang Sprite Sheets tương ứng
export const MASCOT_SHEETS: Record<
  string,
  { directions: string; reactions: string; label: string }
> = {
  dino: {
    directions: '/mascots/dino-directions.webp',
    reactions: '/mascots/dino-reactions.webp',
    label: 'Khủng long xanh Dino',
  },
  bunny: {
    directions: '/mascots/bunny-directions.webp',
    reactions: '/mascots/bunny-reactions.webp',
    label: 'Thỏ trắng Bunny',
  },
  panda: {
    directions: '/mascots/panda-directions.webp',
    reactions: '/mascots/panda-reactions.webp',
    label: 'Gấu trúc Panda',
  },
  leopard: {
    directions: '/mascots/tiger-directions.webp',
    reactions: '/mascots/tiger-reactions.webp',
    label: 'Hổ dũng mãnh Tiger',
  },
  turtle: {
    directions: '/mascots/frog-directions.webp',
    reactions: '/mascots/frog-reactions.webp',
    label: 'Ếch xanh Frog',
  },
  penguin: {
    directions: '/mascots/penguin-directions.webp',
    reactions: '/mascots/penguin-reactions.webp',
    label: 'Cánh cụt Penguin',
  },
  cat: {
    directions: '/mascots/cat-directions.webp',
    reactions: '/mascots/cat-reactions.webp',
    label: 'Mèo con Kitty',
  },
  bear: {
    directions: '/mascots/bear-directions.webp',
    reactions: '/mascots/bear-reactions.webp',
    label: 'Gấu nâu Bear',
  },
  fox: {
    directions: '/mascots/fox-directions.webp',
    reactions: '/mascots/fox-reactions.webp',
    label: 'Cáo cam Fox',
  },
};

export const DinoMascot: React.FC<DinoMascotProps> = ({
  className = 'w-32 h-32',
  variant = 'cheer',
  reactionOverride = null,
  speechText = null,
  showBubbleOnBoop = true,
  onBoop,
}) => {
  const { studentInfo } = useStudent();
  const theme = studentInfo?.theme || 'dino';

  const sheetConfig = MASCOT_SHEETS[theme] || MASCOT_SHEETS['dino'];

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <InteractiveMascot
        directions={sheetConfig.directions}
        reactions={sheetConfig.reactions}
        label={sheetConfig.label}
        size="100%"
        variant={variant}
        reactionOverride={reactionOverride}
        speechText={speechText}
        showBubbleOnBoop={showBubbleOnBoop}
        onBoop={onBoop}
      />
    </div>
  );
};

export default DinoMascot;
