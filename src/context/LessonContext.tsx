'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from 'react';
import {
  type LessonAnswerKey,
  type VerificationResult,
  getExerciseKey,
  verifyAnswer,
} from '@/lib/answerVerification';
import { type SubmissionAudioMeta } from '@/components/AudioAnswerRecorder/SubmissionAudioPlayer';

export type LessonMode = 'student' | 'teacher' | 'preview';

export interface LessonContextModel {
  id: string;
  title?: string;
  order?: number;
  answerKey?: LessonAnswerKey | null;
  [key: string]: unknown;
}

export interface LessonContextValue {
  lesson: LessonContextModel | null;
  mode: LessonMode;
  isTeacher: boolean;
  isReadOnly: boolean;
  answers: Record<string, unknown>;
  answerKey: LessonAnswerKey | null;

  // Управление ответами
  setAnswer: (exerciseKey: string, value: unknown) => void;
  setAnswerField: (exerciseKey: string, fieldKey: string, value: unknown) => void;
  getAnswer: <T = unknown>(exerciseKey: string, defaultValue?: T) => T;

  // Верификация для учителя
  getVerification: (exerciseKey: string, fieldKey?: string) => VerificationResult | null;

  // Аудио
  audios?: SubmissionAudioMeta[];
  submissionId?: string;
  playingAudio: string | null;
  playAudio: (track: string) => void;
}

export const LessonContext = createContext<LessonContextValue | null>(null);

export interface LessonProviderProps {
  children: ReactNode;
  lesson: LessonContextModel | null;
  mode?: LessonMode;
  readOnly?: boolean;
  initialAnswers?: Record<string, unknown> | null;
  answerKey?: LessonAnswerKey | null;
  audios?: SubmissionAudioMeta[];
  submissionId?: string;
  onAnswersChange?: (answers: Record<string, unknown>) => void;
}

export function LessonProvider({
  children,
  lesson,
  mode = 'student',
  readOnly = false,
  initialAnswers = null,
  answerKey = null,
  audios,
  submissionId,
  onAnswersChange,
}: LessonProviderProps) {
  const [answers, setAnswers] = useState<Record<string, unknown>>(() => initialAnswers || {});
  const [prevInitialAnswers, setPrevInitialAnswers] = useState(initialAnswers);

  // Официальный паттерн React 19 для синхронизации состояния из пропсов без каскадных ререндеров в useEffect
  if (initialAnswers !== prevInitialAnswers) {
    setPrevInitialAnswers(initialAnswers);
    if (initialAnswers && Object.keys(initialAnswers).length > 0) {
      setAnswers(initialAnswers);
    }
  }

  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const effectiveAnswerKey = answerKey ?? lesson?.answerKey ?? null;
  const isTeacher = mode === 'teacher';
  const isReadOnly = readOnly || isTeacher;

  const setAnswer = useCallback(
    (exerciseKey: string, value: unknown) => {
      if (isReadOnly) return;
      setAnswers((prev) => {
        const nextVal = typeof value === 'function' ? (value as (prevVal: unknown) => unknown)(prev[exerciseKey]) : value;
        const next = { ...prev, [exerciseKey]: nextVal };
        onAnswersChange?.(next);
        return next;
      });
    },
    [isReadOnly, onAnswersChange],
  );

  const setAnswerField = useCallback(
    (exerciseKey: string, fieldKey: string, value: unknown) => {
      if (isReadOnly) return;
      setAnswers((prev) => {
        const currentExercise = (prev[exerciseKey] as Record<string, unknown>) || {};
        const next = {
          ...prev,
          [exerciseKey]: {
            ...currentExercise,
            [fieldKey]: value,
          },
        };
        onAnswersChange?.(next);
        return next;
      });
    },
    [isReadOnly, onAnswersChange],
  );

  const getAnswer = useCallback(
    <T = unknown,>(exerciseKey: string, defaultValue?: T): T => {
      const val = answers[exerciseKey];
      if (val === undefined || val === null) {
        return defaultValue as T;
      }
      return val as T;
    },
    [answers],
  );

  const getVerification = useCallback(
    (exerciseKey: string, fieldKey?: string): VerificationResult | null => {
      if (!effectiveAnswerKey) return null;
      const exKey = getExerciseKey(effectiveAnswerKey, exerciseKey);
      if (!exKey) return null;

      const studentExercise = answers[exerciseKey];
      if (fieldKey !== undefined) {
        const studentVal =
          studentExercise && typeof studentExercise === 'object'
            ? (studentExercise as Record<string, unknown>)[fieldKey]
            : undefined;
        const expected = exKey[fieldKey];
        return verifyAnswer(studentVal, expected);
      }

      return verifyAnswer(studentExercise, exKey as unknown as string);
    },
    [effectiveAnswerKey, answers],
  );

  const playAudio = useCallback(
    (track: string) => {
      if (playingAudio === track && currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
        setPlayingAudio(null);
        return;
      }

      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const audio = new Audio(track);
      audio.onended = () => {
        setPlayingAudio(null);
        currentAudioRef.current = null;
      };

      setPlayingAudio(track);
      currentAudioRef.current = audio;

      audio.play().catch((err: unknown) => {
        console.error('Audio playback failed:', err);
        setPlayingAudio(null);
        currentAudioRef.current = null;
      });
    },
    [playingAudio],
  );

  const contextValue = useMemo<LessonContextValue>(
    () => ({
      lesson,
      mode,
      isTeacher,
      isReadOnly,
      answers,
      answerKey: effectiveAnswerKey,
      setAnswer,
      setAnswerField,
      getAnswer,
      getVerification,
      audios,
      submissionId,
      playingAudio,
      playAudio,
    }),
    [
      lesson,
      mode,
      isTeacher,
      isReadOnly,
      answers,
      effectiveAnswerKey,
      setAnswer,
      setAnswerField,
      getAnswer,
      getVerification,
      audios,
      submissionId,
      playingAudio,
      playAudio,
    ],
  );

  return <LessonContext.Provider value={contextValue}>{children}</LessonContext.Provider>;
}

export function useLessonContext(): LessonContextValue {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLessonContext must be used within a LessonProvider');
  }
  return context;
}

export function useOptionalLessonContext(): LessonContextValue | null {
  return useContext(LessonContext);
}

export interface UseExerciseAnswerReturn<T> {
  value: T;
  setValue: (val: T | ((prev: T) => T)) => void;
  setField: (fieldKey: string, fieldVal: unknown) => void;
  isTeacher: boolean;
  isReview: boolean;
  isReadOnly: boolean;
  getVerification: (fieldKey?: string) => VerificationResult | null;
  getFieldVerification: (fieldKey: string) => VerificationResult | null;
}

export function useExerciseAnswer<T = unknown>(
  exerciseKey: string,
  defaultValue?: T,
): UseExerciseAnswerReturn<T> {
  const ctx = useLessonContext();
  const value = ctx.getAnswer<T>(exerciseKey, defaultValue);

  const setValue = useCallback(
    (val: T | ((prev: T) => T)) => {
      ctx.setAnswer(exerciseKey, val);
    },
    [ctx, exerciseKey],
  );

  const setField = useCallback(
    (fieldKey: string, fieldVal: unknown) => {
      ctx.setAnswerField(exerciseKey, fieldKey, fieldVal);
    },
    [ctx, exerciseKey],
  );

  const getVerification = useCallback(
    (fieldKey?: string) => {
      return ctx.getVerification(exerciseKey, fieldKey);
    },
    [ctx, exerciseKey],
  );

  const getFieldVerification = useCallback(
    (fieldKey: string) => {
      return getVerification(fieldKey);
    },
    [getVerification],
  );

  return {
    value,
    setValue,
    setField,
    isTeacher: ctx.isTeacher,
    isReview: ctx.isTeacher,
    isReadOnly: ctx.isReadOnly,
    getVerification,
    getFieldVerification,
  };
}
