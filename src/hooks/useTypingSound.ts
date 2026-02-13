import { useCallback } from 'react';
import { useSound } from '@/contexts/SoundContext';

export function useTypingSound() {
  const { playSound } = useSound();

  const playCorrectSound = useCallback(() => {
    playSound('correct');
  }, [playSound]);

  const playWrongSound = useCallback(() => {
    playSound('wrong');
  }, [playSound]);

  return { playCorrectSound, playWrongSound };
}
