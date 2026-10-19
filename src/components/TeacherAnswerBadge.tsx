'use client';

import React from 'react';
import { VerificationResult } from '@/lib/answerVerification';
import styles from './teacherAnswerBadge.module.scss';

export interface TeacherAnswerBadgeProps {
  result?: VerificationResult | null;
  className?: string;
  hideIfCorrect?: boolean;
  isTeacherReview?: boolean;
}

/**
 * Бейдж проверки ответа ученика для экрана проверки преподавателя.
 * Показывает галочку правильности или красную подсветку с эталонным ответом.
 */
export default function TeacherAnswerBadge({
  result,
  className = '',
  hideIfCorrect = false,
  isTeacherReview = true,
}: TeacherAnswerBadgeProps) {
  if (isTeacherReview === false || !result || !result.hasKey) {
    return null;
  }

  if (result.isCorrect) {
    if (hideIfCorrect) return null;
    return (
      <span className={`${styles.badgeCorrect} ${className}`} title="Answer is correct">
        ✓
      </span>
    );
  }

  if (!result.hasAnswer) {
    return (
      <span className={`${styles.badgeEmpty} ${className}`}>
        ⚪ <em>No answer</em> (Key: <strong>{result.expectedDisplay}</strong>)
      </span>
    );
  }

  return (
    <span className={`${styles.badgeIncorrect} ${className}`}>
      ✗ <strong>Key: {result.expectedDisplay}</strong>
    </span>
  );
}
