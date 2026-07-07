import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseWebSpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
}

export function useWebSpeech(options: UseWebSpeechOptions = {}) {
  const { lang = 'vi-VN', rate = 0.8, pitch = 1.15 } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isSpeechSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Khởi tạo SpeechRecognition
  useEffect(() => {
    if (typeof window === 'undefined' || !isSpeechSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSpeechSupported]);

  // Hàm thực sự chạy native SpeechSynthesis (dành cho fallback)
  const fallbackToNativeTts = useCallback((cleanText: string, customLang?: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = customLang || lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    window.speechSynthesis.speak(utterance);
  }, [lang, rate, pitch]);

  // Hàm thực sự chạy TTS (thử API trước, nếu lỗi hoặc bị hủy thì fallback)
  const playTts = useCallback(async (text: string, customLang?: string) => {
    if (typeof window === 'undefined') return;

    const cleanText = text.replace(/[_]/g, '').trim();
    if (!cleanText) return;

    // Hủy request cũ đang chạy nếu có
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // 1. Thử gọi API proxy Google Cloud TTS
      const response = await fetch('/api/v1/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('API TTS error');

      const data = await response.json();
      if (!data.audioContent) throw new Error('No audio content returned');

      // Tạo Audio object và gán vào audioRef để quản lý dừng phát
      const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      if (!controller.signal.aborted) {
        await audio.play();
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Hủy yêu cầu do bấm nút khác, không thực hiện fallback
        return;
      }
      console.warn('Google TTS failed, falling back to browser SpeechSynthesis:', err);
      fallbackToNativeTts(cleanText, customLang);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [fallbackToNativeTts]);

  // Hàm phát âm thanh (Text-To-Speech hoặc audioUrl)
  const speak = useCallback((text: string, customLang?: string, audioUrl?: string) => {
    if (typeof window === 'undefined') return;

    // Dừng tất cả âm thanh đang phát trước đó
    stopSpeaking();

    // Nếu có audioUrl tĩnh, ưu tiên phát file tĩnh đó
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play().catch((err) => {
          console.warn('Failed to play static audio, falling back to TTS:', err);
          playTts(text, customLang);
        });
        return;
      } catch (err) {
        console.warn('Failed to create Audio object, falling back to TTS:', err);
      }
    }

    // Phát bằng TTS
    playTts(text, customLang);
  }, [playTts]);

  // Dừng phát âm thanh
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    }
  }, []);

  // Bắt đầu nhận diện giọng nói
  const startListening = useCallback((customLang?: string) => {
    if (!isSpeechSupported || !recognitionRef.current) {
      setError('Browser does not support Speech Recognition.');
      return;
    }

    try {
      stopSpeaking(); // Dừng đọc trước khi bắt đầu nghe
      recognitionRef.current.lang = customLang || lang;
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError('Gặp lỗi khi kích hoạt Micro.');
    }
  }, [isSpeechSupported, lang, stopSpeaking]);

  // Dừng nhận diện giọng nói
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    isSpeechSupported,
    isListening,
    transcript,
    error,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
  };
}
