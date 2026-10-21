'use client';

import React, { useState } from 'react';
import {
  ENCOURAGE,
  GREETINGS,
  INVITES,
  Mascot,
  MASCOT_STATES,
  PRAISE,
  pick,
  useMascot,
} from '@/components/Mascot';
import type { MascotState } from '@/components/Mascot';
import styles from './demo.module.scss';

const STATE_PHRASES: Record<MascotState, string | undefined> = {
  idle: undefined,
  happy: pick(PRAISE),
  sad: pick(ENCOURAGE),
  thinking: 'Hmm... Let me think!',
  talking: "Let's learn English together!",
  wave: pick(GREETINGS),
};

const QUICK_PHRASES = Array.from(
  new Set(['Hello!', 'Great job!', 'Try again!', 'Well done!', ...INVITES]),
);

export default function MascotDemoPage() {
  const { state, react, say, speak, reset } = useMascot();
  const [text, setText] = useState('Good morning!');

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Milo the Kitten (Mascot Demo)</h1>
      <p className={styles.subheading}>
        Interactive learning assistant: test poses, voice pronunciation, and supportive speech bubbles.
      </p>

      <div className={styles.mainGrid}>
        <div className={styles.mascotPreview}>
          <Mascot state={state} size={240} />
          <div className={styles.stateBadge}>
            Current State: <strong>{state}</strong>
          </div>
        </div>

        <div className={styles.controlsColumn}>
          <div>
            <h2 className={styles.sectionTitle}>Emotional States</h2>
            <div className={styles.buttonsRow}>
              {MASCOT_STATES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => (s === 'idle' ? reset() : react(s, STATE_PHRASES[s], 4000))}
                  className={`${styles.stateBtn} ${state === s ? styles.active : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>Voice & Speech Synthesis</h2>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && say(text, 3500)}
                placeholder="Type an English phrase..."
              />
              <button
                type="button"
                className={styles.sayBtn}
                onClick={() => say(text, 3500)}
              >
                Say (Bubble)
              </button>
              <button
                type="button"
                className={styles.speakBtn}
                onClick={() => speak(text)}
              >
                🔊 Pronounce (Voice)
              </button>
            </div>

            <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {QUICK_PHRASES.map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  className={styles.quickPill}
                  onClick={() => setText(phrase)}
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className={styles.sectionTitle}>All Mascot Poses</h2>
        <div className={styles.galleryGrid}>
          {MASCOT_STATES.map((s) => (
            <div key={s} className={styles.galleryCard}>
              <Mascot state={s} size={130} />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
