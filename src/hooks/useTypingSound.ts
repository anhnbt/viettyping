import { useCallback, useEffect, useRef } from 'react';

export function useTypingSound() {
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctAudioRef.current = new Audio('/sounds/correct.wav');
    wrongAudioRef.current = new Audio('/sounds/correct.wav');

    // Set volume
    if (correctAudioRef.current) correctAudioRef.current.volume = 0.2;
    if (wrongAudioRef.current) wrongAudioRef.current.volume = 0.2;

    return () => {
      correctAudioRef.current = null;
      wrongAudioRef.current = null;
    };
  }, []);

  const playCorrectSound = useCallback(() => {
    if (correctAudioRef.current) {
      correctAudioRef.current.currentTime = 0;
      correctAudioRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, []);

  const playWrongSound = useCallback(() => {
    if (wrongAudioRef.current) {
      wrongAudioRef.current.currentTime = 0;
      wrongAudioRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, []);

  return { playCorrectSound, playWrongSound };
}
