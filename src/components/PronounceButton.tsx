'use client';

import React from 'react';
import { useMascot } from '@/components/Mascot';
import styles from './pronounceButton.module.scss';

export interface PronounceButtonProps {
  /** Слово или фраза на английском для произношения Майло */
  word: string;
  /** Опциональный текст на кнопке */
  label?: string;
  /** Дополнительный CSS класс */
  className?: string;
  /** Размер кнопки */
  size?: 'small' | 'medium';
}

/**
 * Кнопка быстрого произношения слова персонажем-маскотом Майло.
 * При клике разворачивает маскота и озвучивает слово голосом Web Speech API.
 */
export default function PronounceButton({
  word,
  label,
  className = '',
  size = 'small',
}: PronounceButtonProps) {
  const mascot = useMascot();

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    mascot.setIsMinimized(false);
    mascot.speak(word);
  };

  return (
    <button
      type="button"
      onClick={handlePronounce}
      className={`${styles.pronounceBtn} ${size === 'small' ? styles.btnSmall : styles.btnMedium} ${className}`}
      title={`Listen to Milo pronounce "${word}"`}
      aria-label={`Listen to Milo pronounce "${word}"`}
    >
      <span className={styles.icon}>🔊</span>
      {label && <span className={styles.label}>{label}</span>}
    </button>
  );
}
