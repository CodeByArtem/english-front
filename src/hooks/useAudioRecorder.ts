'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export type AudioRecorderStatus = 'idle' | 'requesting' | 'recording' | 'recorded';

export interface UseAudioRecorderReturn {
  status: AudioRecorderStatus;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  mimeType: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
}

const MAX_DURATION_SECONDS = 60;
const MAX_FILE_SIZE_BYTES = 1.5 * 1024 * 1024; // 1.5 МБ

/**
 * Выбор поддерживаемого формата по приоритету:
 * 1. audio/webm;codecs=opus (Chrome, Edge, Firefox)
 * 2. audio/mp4 (Safari на iOS / macOS)
 * 3. audio/ogg;codecs=opus (Firefox)
 */
export function getSupportedAudioMimeType(): string {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return '';
  }
  const candidateTypes = [
    'audio/webm;codecs=opus',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  for (const type of candidateTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  if (MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm';
  if (MediaRecorder.isTypeSupported('audio/ogg')) return 'audio/ogg';
  return '';
}

export function useAudioRecorder(
  onAudioChange?: (blob: Blob | null, mimeType: string) => void,
): UseAudioRecorderReturn {
  const [status, setStatus] = useState<AudioRecorderStatus>('idle');
  const [duration, setDuration] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeBlobUrlRef = useRef<string | null>(null);

  // Очистка таймера
  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Освобождение медиапотока (микрофона)
  const releaseMediaStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Освобождение Blob URL
  const revokeActiveBlobUrl = useCallback(() => {
    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
  }, []);

  // Полная остановка записи
  const stopRecording = useCallback(() => {
    clearTimer();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ошибки при остановке игнорируются, данные обрабатываются в onstop
      }
    }
    releaseMediaStream();
  }, [clearTimer, releaseMediaStream]);

  // Сброс и перезапись
  const resetRecording = useCallback(() => {
    stopRecording();
    revokeActiveBlobUrl();
    chunksRef.current = [];
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setError(null);
    setStatus('idle');
    if (onAudioChange) {
      onAudioChange(null, '');
    }
  }, [stopRecording, revokeActiveBlobUrl, onAudioChange]);

  // Остановка и освобождение ресурсов при pagehide и анмаунте
  useEffect(() => {
    const handlePageHide = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
      releaseMediaStream();
    };

    window.addEventListener('pagehide', handlePageHide);
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      clearTimer();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
      releaseMediaStream();
      revokeActiveBlobUrl();
    };
  }, [clearTimer, releaseMediaStream, revokeActiveBlobUrl]);

  // Запуск записи
  const startRecording = useCallback(async () => {
    setError(null);
    revokeActiveBlobUrl();
    chunksRef.current = [];
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError('Your browser does not support audio recording.');
      setStatus('idle');
      return;
    }

    const chosenMimeType = getSupportedAudioMimeType();
    if (!chosenMimeType) {
      setError('Your browser does not support compatible audio recording formats.');
      setStatus('idle');
      return;
    }

    setMimeType(chosenMimeType);
    setStatus('requesting');

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
    } catch (err: unknown) {
      setStatus('idle');
      const errorObj = err as { name?: string };
      if (errorObj?.name === 'NotAllowedError' || errorObj?.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (errorObj?.name === 'NotFoundError' || errorObj?.name === 'DevicesNotFoundError') {
        setError('Microphone not detected. Please connect a microphone.');
      } else {
        setError('Could not connect to microphone. Please try again.');
      }
      return;
    }

    try {
      const recorder = new MediaRecorder(stream, {
        mimeType: chosenMimeType,
      });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearTimer();
        releaseMediaStream();

        const recordedBlob = new Blob(chunksRef.current, { type: chosenMimeType });

        // Check 1.5 MB limit
        if (recordedBlob.size > MAX_FILE_SIZE_BYTES) {
          setError('Recording size exceeds 1.5 MB. Please record a shorter answer.');
          setStatus('idle');
          setAudioBlob(null);
          setAudioUrl(null);
          if (onAudioChange) onAudioChange(null, '');
          return;
        }

        const newUrl = URL.createObjectURL(recordedBlob);
        activeBlobUrlRef.current = newUrl;
        setAudioBlob(recordedBlob);
        setAudioUrl(newUrl);
        setStatus('recorded');

        if (onAudioChange) {
          onAudioChange(recordedBlob, chosenMimeType);
        }
      };

      // Запуск MediaRecorder с получением чанков каждые 250 мс
      recorder.start(250);
      startTimeRef.current = Date.now();
      setStatus('recording');

      // Точный расчет времени по Date.now() с автостопом на 60 секундах
      clearTimer();
      timerIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (elapsed >= MAX_DURATION_SECONDS) {
          setDuration(MAX_DURATION_SECONDS);
          stopRecording();
        } else {
          setDuration(elapsed);
        }
      }, 200);
    } catch {
      releaseMediaStream();
      setStatus('idle');
      setError('Не удалось инициализировать диктофон. Попробуйте снова.');
    }
  }, [clearTimer, onAudioChange, releaseMediaStream, revokeActiveBlobUrl, stopRecording]);

  return {
    status,
    duration,
    audioBlob,
    audioUrl,
    mimeType,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
