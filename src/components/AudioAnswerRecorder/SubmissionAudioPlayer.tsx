'use client';

import React, { useState, useRef } from 'react';
import { API_URL } from '@/lib/api';
import styles from './SubmissionAudioPlayer.module.scss';

export interface SubmissionAudioMeta {
  exerciseKey: string;
  mimeType: string;
  sizeBytes: number;
}

export interface SubmissionAudioPlayerProps {
  submissionId: string;
  exerciseKey: string;
  audios?: SubmissionAudioMeta[];
  className?: string;
}

export const SubmissionAudioPlayer: React.FC<SubmissionAudioPlayerProps> = ({
  submissionId,
  exerciseKey,
  audios,
  className,
}) => {
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Требование 3: Если записи нет, ничего не показываем
  const hasAudio = audios?.some((a) => a.exerciseKey === exerciseKey);
  if (!hasAudio || !submissionId) {
    return null;
  }

  const encodedId = encodeURIComponent(submissionId);
  const encodedKey = encodeURIComponent(exerciseKey);
  const audioSrc = `${API_URL}/submissions/${encodedId}/audio/${encodedKey}${retryKey > 0 ? `?r=${retryKey}` : ''}`;

  const handleRetry = () => {
    setLoadError(false);
    setRetryKey((prev) => prev + 1);
    if (audioRef.current) {
      audioRef.current.load();
    }
  };

  return (
    <div className={`${styles.playerContainer} ${className || ''}`}>
      <div className={styles.playerLabelRow}>
        <span className={styles.playerBadge}>Voice Answer</span>
      </div>

      {loadError ? (
        <div className={styles.errorBox} role="alert">
          <span className={styles.errorText}>Failed to load recording</span>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={handleRetry}
          >
            Try again
          </button>
        </div>
      ) : (
        <audio
          key={retryKey}
          ref={audioRef}
          controls
          preload="none"
          crossOrigin="use-credentials"
          src={audioSrc}
          onError={() => setLoadError(true)}
          className={styles.audioElement}
        >
          <track kind="captions" />
          Your browser does not support audio playback.
        </audio>
      )}
    </div>
  );
};

export default SubmissionAudioPlayer;
