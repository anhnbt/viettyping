import { useCallback } from 'react';
import { useSound } from '@/contexts/SoundContext';

export function useTypingSound() {
  const { playSound } = useSound();

  const playCorrectSound = useCallback(() => {
    playSound('keystroke');
  }, [playSound]);

  const playWrongSound = useCallback(() => {
    playSound('boing');
  }, [playSound]);

  return { playCorrectSound, playWrongSound };
}
