"use client";

import React from 'react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useSound } from '@/contexts/SoundContext';

const SoundToggle: React.FC = () => {
  const { isMuted, toggleMute } = useSound();

  return (
    <button
      onClick={toggleMute}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
      title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
    >
      {isMuted ? (
        <FaVolumeMute className="w-6 h-6 text-gray-500" />
      ) : (
        <FaVolumeUp className="w-6 h-6 text-blue-500" />
      )}
    </button>
  );
};

export default SoundToggle;
