'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { Mascot } from './Mascot';
import { GREETINGS, INVITES, PRAISE, STUDY_TIPS, pick } from './phrases';
import { SpeechBubble } from './SpeechBubble';
import type { MascotState } from './types';
import styles from './mascot.module.scss';

const DEFAULT_DURATION_MS = 3200;

export interface MascotContextValue {
  state: MascotState;
  phrase: string | null;
  isMinimized: boolean;
  setIsMinimized: (val: boolean) => void;
  /** Проиграть эмоцию с опциональной фразой и вернуться в idle */
  react: (state: MascotState, phrase?: string, durationMs?: number) => void;
  /** Озвучить реплику в облачке и анимировать речь */
  say: (phrase: string, durationMs?: number) => void;
  /** Озвучить текст через Web Speech API (en-US) с шевелением рта */
  speak: (text: string) => void;
  /** Сбросить состояние в idle */
  reset: () => void;
}

const MascotContext = createContext<MascotContextValue | null>(null);

export function useMascot(): MascotContextValue {
  const ctx = useContext(MascotContext);
  if (!ctx) {
    throw new Error('useMascot must be used inside <MascotProvider>.');
  }
  return ctx;
}

export interface MascotProviderProps {
  children: ReactNode;
  /** Показывать ли плавающего персонажа в углу. По умолчанию: true */
  widget?: boolean;
  /** Маршруты, где персонаж скрывается (например, ['/login', '/register']) */
  hideOn?: string[];
  /** Поприветствовать один раз за сессию при первом открытии */
  greetOnLoad?: boolean;
}

export function MascotProvider({
  children,
  widget = true,
  hideOn = [],
  greetOnLoad = true,
}: MascotProviderProps) {
  const [state, setState] = useState<MascotState>('idle');
  const [phrase, setPhrase] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    stopSpeech();
    setState('idle');
    setPhrase(null);
  }, [clearTimer, stopSpeech]);

  const react = useCallback(
    (next: MascotState, text?: string, durationMs = DEFAULT_DURATION_MS) => {
      clearTimer();
      setState(next);
      setPhrase(text ?? null);
      if (next !== 'idle') {
        timer.current = setTimeout(() => {
          setState('idle');
          setPhrase(null);
          timer.current = null;
        }, durationMs);
      }
    },
    [clearTimer],
  );

  const say = useCallback(
    (text: string, durationMs = DEFAULT_DURATION_MS) => react('talking', text, durationMs),
    [react],
  );

  const speak = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const canSpeak =
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        typeof SpeechSynthesisUtterance !== 'undefined';

      if (!canSpeak) {
        say(trimmed, Math.max(DEFAULT_DURATION_MS, trimmed.length * 90));
        return;
      }

      clearTimer();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(trimmed);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;

      const finish = () => {
        setState('idle');
        setPhrase(null);
      };

      utterance.onstart = () => {
        setState('talking');
        setPhrase(trimmed);
      };
      utterance.onend = finish;
      utterance.onerror = finish;

      setState('talking');
      setPhrase(trimmed);
      window.speechSynthesis.speak(utterance);
    },
    [clearTimer, say],
  );

  useEffect(() => {
    return () => {
      clearTimer();
      stopSpeech();
    };
  }, [clearTimer, stopSpeech]);

  const value = useMemo<MascotContextValue>(
    () => ({
      state,
      phrase,
      isMinimized,
      setIsMinimized,
      react,
      say,
      speak,
      reset,
    }),
    [state, phrase, isMinimized, setIsMinimized, react, say, speak, reset],
  );

  return (
    <MascotContext.Provider value={value}>
      {children}
      {widget ? <MascotWidget hideOn={hideOn} greetOnLoad={greetOnLoad} /> : null}
    </MascotContext.Provider>
  );
}

function MascotWidget({ hideOn, greetOnLoad }: { hideOn: string[]; greetOnLoad: boolean }) {
  const pathname = usePathname();
  const { state, phrase, isMinimized, setIsMinimized, react, speak } = useMascot();
  const hidden = pathname ? hideOn.some((route) => pathname.startsWith(route)) : false;

  useEffect(() => {
    if (!greetOnLoad || hidden) return;
    const t = setTimeout(() => {
      try {
        if (sessionStorage.getItem('milo-greeted')) return;
        sessionStorage.setItem('milo-greeted', '1');
      } catch {
        /* storage blocked */
      }
      react('wave', pick(GREETINGS), 3600);
    }, 900);
    return () => clearTimeout(t);
  }, [greetOnLoad, hidden, react]);

  if (hidden) return null;

  const onClick = () => {
    const roll = Math.random();
    if (roll < 0.35) {
      react('happy', pick(PRAISE), 3200);
    } else if (roll < 0.7) {
      react('wave', pick(GREETINGS), 3200);
    } else {
      react('thinking', pick([...INVITES, ...STUDY_TIPS]), 3500);
    }
  };

  if (isMinimized) {
    return (
      <div className={styles.widgetContainer}>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className={styles.minimizedBadge}
          title="Click to show Milo (Mascot)"
          aria-label="Expand Milo the kitten mascot"
        >
          <span className={styles.pawIcon}>🐱</span>
          <span>Milo</span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.widgetContainer}>
      <SpeechBubble phrase={phrase} onSpeak={speak} />
      <div className={styles.characterArea}>
        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          className={styles.minimizeBtn}
          title="Minimize mascot so it doesn't disturb you"
          aria-label="Minimize mascot"
        >
          ✕
        </button>
        <button
          type="button"
          onClick={onClick}
          aria-label="Milo the kitten. Click to say hi or hear advice."
          className={styles.mascotBtn}
        >
          <Mascot state={state} className={styles.characterSvg} size={110} />
        </button>
      </div>
    </div>
  );
}
