'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './mascot.module.scss';

interface SpeechBubbleProps {
  phrase: string | null;
  onSpeak?: (text: string) => void;
}

/** Всплывающее облачко реплики над персонажем */
export function SpeechBubble({ phrase, onSpeak }: SpeechBubbleProps) {
  return (
    <div className={styles.bubbleWrapper} role="status" aria-live="polite">
      <AnimatePresence mode="wait">
        {phrase ? (
          <motion.div
            key={phrase}
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className={styles.speechBubble}
            style={{ transformOrigin: '85% 100%' }}
          >
            <p className={styles.bubbleText}>{phrase}</p>
            {onSpeak && (
              <button
                type="button"
                className={styles.speakBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(phrase);
                }}
                title="Pronounce with audio"
              >
                🔊 Listen
              </button>
            )}
            <span aria-hidden className={styles.bubbleTail} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
