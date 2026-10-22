'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './HomeworkCard.module.scss';

export interface HomeworkCardProps {
  id: string;
  title: string;
  status: string;
  grade?: number;
  score?: number;
  tutorComment?: string;
  description?: string;
  dateLabel: string;
  actionHref: string;
  actionLabel: string;
  index?: number;
  badgeLabel?: string;
}

export default function HomeworkCard({
  title,
  status,
  grade,
  score,
  tutorComment,
  description,
  dateLabel,
  actionHref,
  actionLabel,
  index = 0,
  badgeLabel,
}: HomeworkCardProps) {
  const isRevision = status === 'needs_revision';
  const isGraded = status === 'graded';
  const isSubmitted = status === 'submitted';

  const finalScore = grade ?? score;
  const statusDisplay =
    badgeLabel ||
    (isRevision
      ? '⚠️ Needs Revision'
      : isGraded
      ? `Graded (${finalScore ?? ''}%)`
      : isSubmitted
      ? '⏳ Under Review'
      : '📝 To Do');

  const variant = isRevision ? 'revision' : isGraded ? 'graded' : isSubmitted ? 'submitted' : 'pending';

  return (
    <motion.article
      className={styles.card}
      data-variant={variant}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.05, 0.25),
        ease: 'easeOut',
      }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.badge} data-variant={variant}>
          {statusDisplay}
        </span>
      </div>

      {description && !tutorComment && (
        <p className={styles.description}>{description}</p>
      )}

      {tutorComment && (
        <div className={styles.tutorNote}>
          <span className={styles.tutorIcon} aria-hidden="true">💬</span>
          <div className={styles.tutorContent}>
            <span className={styles.tutorLabel}>Teacher Note</span>
            <p className={styles.tutorText}>{tutorComment}</p>
          </div>
        </div>
      )}

      <div className={styles.cardFooter}>
        <span className={styles.date}>{dateLabel}</span>
        <Link
          href={actionHref}
          className={styles.actionBtn}
          data-variant={variant}
        >
          <span>{actionLabel}</span>
          <span className={styles.arrow} aria-hidden="true">→</span>
        </Link>
      </div>
    </motion.article>
  );
}
