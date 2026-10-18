'use client';

import React from 'react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import styles from './AudioAnswerRecorder.module.scss';

export interface AudioAnswerRecorderProps {
  onAudioChange?: (blob: Blob | null, mimeType: string) => void;
  readOnly?: boolean;
}

export const AudioAnswerRecorder: React.FC<AudioAnswerRecorderProps> = ({
  onAudioChange,
  readOnly = false,
}) => {
  const {
    status,
    duration,
    audioUrl,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder(onAudioChange);

  // В readOnly-режиме диктофон для записи не отображается
  if (readOnly) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.recorderContainer}>
      <div className={styles.headerRow}>
        <h4 className={styles.recorderTitle}>Voice Answer</h4>
        <p className={styles.privacyNotice}>
          Only your teacher will hear your voice recording.
        </p>
      </div>

      {error && (
        <div className={styles.errorBox} role="alert">
          <span>{error}</span>
          <button
            type="button"
            className={styles.retryErrorBtn}
            onClick={resetRecording}
          >
            Try again
          </button>
        </div>
      )}

      <div className={styles.controlsRow}>
        {status === 'idle' && (
          <button
            type="button"
            className={styles.recordBtn}
            onClick={startRecording}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
            Record answer
          </button>
        )}

        {status === 'requesting' && (
          <button
            type="button"
            className={styles.recordBtn}
            disabled
          >
            Requesting microphone...
          </button>
        )}

        {status === 'recording' && (
          <div className={styles.recordingStateBox}>
            <div className={styles.pulseIndicator} aria-hidden="true" />
            <span className={styles.timerText} aria-live="polite">
              {formatTime(duration)} / 01:00
            </span>
            <button
              type="button"
              className={styles.stopBtn}
              onClick={stopRecording}
            >
              Stop
            </button>
          </div>
        )}

        {status === 'recorded' && audioUrl && (
          <div className={styles.recordedBox}>
            <div className={styles.audioPlayerRow}>
              {/* HTML5 audio player for self-check */}
              <audio controls src={audioUrl} className={styles.audioPlayer}>
                <track kind="captions" />
                Your browser does not support audio playback.
              </audio>
              <button
                type="button"
                className={styles.reRecordBtn}
                onClick={resetRecording}
              >
                Re-record
              </button>
            </div>
            <p className={styles.memoryNotice}>
              Recording saved in browser memory. Be sure to click &quot;Submit Answers&quot; at the bottom of the page before leaving.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioAnswerRecorder;
