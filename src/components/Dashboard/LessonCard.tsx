'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './LessonCard.module.scss';

export interface DashboardLessonItem {
  id: string;
  title: string;
  order?: number;
}

export interface DashboardSubmissionStatus {
  status: string;
  score?: number;
  grade?: number;
  tutorComment?: string;
}

export interface LessonCardProps {
  lesson: DashboardLessonItem;
  submission?: DashboardSubmissionStatus | null;
  index?: number;
  unitTitle?: string;
  unitId?: string;
}

interface StatusMeta {
  label: string;
  variant: 'graded' | 'revision' | 'submitted' | 'available';
  actionText: string;
}

function getStatusMeta(submission?: DashboardSubmissionStatus | null): StatusMeta {
  if (!submission) {
    return {
      label: 'Available',
      variant: 'available',
      actionText: 'Start Lesson',
    };
  }

  if (submission.status === 'graded') {
    const finalScore = submission.grade ?? submission.score;
    return {
      label: finalScore !== undefined ? `Graded (${finalScore}%)` : 'Graded',
      variant: 'graded',
      actionText: 'Review Lesson',
    };
  }

  if (submission.status === 'needs_revision') {
    return {
      label: 'Needs Revision',
      variant: 'revision',
      actionText: 'Fix Homework',
    };
  }

  if (submission.status === 'submitted') {
    return {
      label: 'Under Review',
      variant: 'submitted',
      actionText: 'View Answers',
    };
  }

  return {
    label: 'In Progress',
    variant: 'available',
    actionText: 'Continue',
  };
}

export default function LessonCard({
  lesson,
  submission,
  index = 0,
  unitTitle,
  unitId,
}: LessonCardProps) {
  const statusMeta = getStatusMeta(submission);

  // Дружелюбное отображение названия урока для известных модулей
  const displayTitle =
    lesson.order === 2 || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'
      ? '1B Jobs'
      : lesson.order === 3 || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'
      ? '1C Nationalities'
      : lesson.title;

  const handleLessonNavigate = () => {
    if (typeof window !== 'undefined') {
      if (unitId) {
        localStorage.setItem('last_active_unit_id', unitId);
      }
      localStorage.setItem('last_active_lesson_id', lesson.id);
    }
  };

  return (
    <motion.article
      className={styles.card}
      data-variant={statusMeta.variant}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        delay: Math.min(index * 0.04, 0.28),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap}>
          <span className={styles.icon} aria-hidden="true">
            {statusMeta.variant === 'graded' ? '✨' : '📖'}
          </span>
        </div>
        <span className={styles.statusBadge} data-variant={statusMeta.variant}>
          <span className={styles.statusDot} aria-hidden="true" />
          {statusMeta.label}
        </span>
      </div>

      <div className={styles.cardBody}>
        {unitTitle && <p className={styles.unitMeta}>{unitTitle}</p>}
        <h4 className={styles.lessonTitle}>{displayTitle}</h4>
      </div>

      <div className={styles.cardFooter}>
        <Link
          href={`/lessons/${lesson.id}`}
          onClick={handleLessonNavigate}
          className={styles.actionBtn}
          data-variant={statusMeta.variant}
          aria-label={`${statusMeta.actionText}: ${displayTitle}`}
        >
          <span>{statusMeta.actionText}</span>
          <span className={styles.arrow} aria-hidden="true">→</span>
        </Link>
      </div>
    </motion.article>
  );
}
