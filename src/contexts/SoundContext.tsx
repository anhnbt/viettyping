"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type SoundType = 'correct' | 'wrong' | 'click' | 'complete';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const savedMute = localStorage.getItem('sound_muted');
    if (savedMute) {
      setIsMuted(savedMute === 'true');
    }

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      setAudioContext(new AudioContextClass());
    }
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newState = !prev;
      localStorage.setItem('sound_muted', String(newState));
      return newState;
    });
  };

  const playSound = useCallback((type: SoundType) => {
    if (isMuted || !audioContext) return;

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const now = audioContext.currentTime;

    switch (type) {
      case 'correct': {
        // High pitch "ding"
        const osc = audioContext.createOscillator();
        const gn = audioContext.createGain();
        osc.connect(gn);
        gn.connect(audioContext.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);

        gn.gain.setValueAtTime(0.3, now);
        gn.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }

      case 'wrong': {
        // Low pitch "buzz"
        const osc = audioContext.createOscillator();
        const gn = audioContext.createGain();
        osc.connect(gn);
        gn.connect(audioContext.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);

        gn.gain.setValueAtTime(0.3, now);
        gn.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }

      case 'click': {
        // Short "tick"
        const osc = audioContext.createOscillator();
        const gn = audioContext.createGain();
        osc.connect(gn);
        gn.connect(audioContext.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);

        gn.gain.setValueAtTime(0.1, now);
        gn.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'complete': {
        // Simple fanfare
        const playNote = (freq: number, startTime: number, duration: number) => {
          const osc = audioContext.createOscillator();
          const gn = audioContext.createGain();
          osc.connect(gn);
          gn.connect(audioContext.destination);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gn.gain.setValueAtTime(0.3, startTime);
          gn.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

          osc.start(startTime);
          osc.stop(startTime + duration);
        };

        playNote(523.25, now, 0.2); // C5
        playNote(659.25, now + 0.2, 0.2); // E5
        playNote(783.99, now + 0.4, 0.4); // G5
        break;
      }
    }
  }, [isMuted, audioContext]);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
