'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './lesson.module.scss';
import { LessonProvider } from '@/context/LessonContext';
import LessonContentRenderer from '@/components/LessonContentRenderer';
import { SubmissionAudioMeta } from '@/components/AudioAnswerRecorder/SubmissionAudioPlayer';
import { LessonAnswerKey } from '@/lib/answerVerification';
import { useMascot } from '@/components/Mascot';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar/Navbar';

interface LessonModel {
  id: string;
  title: string;
  order?: number;
  content?: string;
  theory?: string;
  answerKey?: LessonAnswerKey | null;
  [key: string]: unknown;
}

interface SubmissionModel {
  id: string;
  score?: number;
  grade?: number;
  status: string;
  tutorComment?: string;
  answers?: Record<string, unknown>;
  audios?: SubmissionAudioMeta[];
  [key: string]: unknown;
}

const LessonPage = () => {
  const params = useParams();
  const router = useRouter();
  const mascot = useMascot();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<LessonModel | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isTutor: isTeacherReview } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [mySubmission, setMySubmission] = useState<SubmissionModel | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Хранилище текущих ответов из контекста для отправки на бэкенд
  const currentAnswersRef = useRef<Record<string, unknown>>({});

  // Аудиозапись для упражнений устной речи (Lessons 1D, 2B, 3D, 4D)
  const [audioFile, setAudioFile] = useState<{ blob: Blob; mimeType: string; exerciseKey: string } | null>(null);
  const [audioUploadSubmissionId, setAudioUploadSubmissionId] = useState<string | null>(null);
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null);
  const [retryingAudio, setRetryingAudio] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        setLoading(true);

        let targetId = lessonId;

        if (!targetId) {
          const tbRes = await api.get('/content/textbooks');
          if (tbRes.data?.[0]?.units?.[0]?.lessons?.[0]?.id) {
            targetId = tbRes.data[0].units[0].lessons[0].id;
          }
        }

        const res = await api.get(`/content/lessons/${targetId}`);
        setLesson(res.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem('last_active_lesson_id', targetId);
          if (res.data?.unit?.id) {
            localStorage.setItem('last_active_unit_id', res.data.unit.id);
          }
        }

        // Проверяем существующую сдачу дз для текущего студента
        try {
          const subRes = await api.get(`/submissions/lesson/${targetId}/my-submission`);
          if (subRes.data) {
            setMySubmission(subRes.data);
            let ans = subRes.data.answers;
            if (typeof ans === 'string') {
              try {
                ans = JSON.parse(ans);
              } catch {
                ans = {};
              }
            }
            if (ans && typeof ans === 'object') {
              currentAnswersRef.current = ans as Record<string, unknown>;
            }
          }
        } catch {
          // Если не студент или ещё нет сдачи — продолжаем без блокировки
        }
      } catch (err) {
        console.error('Failed to load lesson from backend:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [lessonId]);

  const uploadAudioFile = async (
    submissionId: string,
    audio: { blob: Blob; mimeType: string; exerciseKey?: string },
  ) => {
    const exKey = audio.exerciseKey || 'exercise_8';
    const extension = audio.mimeType.includes('mp4')
      ? 'mp4'
      : audio.mimeType.includes('ogg')
      ? 'ogg'
      : 'webm';
    const file = new File([audio.blob], `${exKey}.${extension}`, {
      type: audio.mimeType,
    });
    const formData = new FormData();
    formData.append('file', file);

    // ВАЖНО: не задаем Content-Type вручную, позволяем Axios и браузеру выставить multipart/form-data с boundary
    await api.post(`/submissions/${submissionId}/audio/${encodeURIComponent(exKey)}`, formData, {
      headers: {
        'Content-Type': undefined,
      },
    });
  };

  const handleRetryAudio = async () => {
    if (!audioUploadSubmissionId || !audioFile) return;
    setRetryingAudio(true);
    setAudioUploadError(null);
    try {
      await uploadAudioFile(audioUploadSubmissionId, audioFile);
      const exKey = audioFile.exerciseKey || 'exercise_8';
      setMySubmission((prev) =>
        prev
          ? {
              ...prev,
              audios: [
                ...(prev.audios?.filter((a) => a.exerciseKey !== exKey) || []),
                {
                  exerciseKey: exKey,
                  mimeType: audioFile.mimeType,
                  sizeBytes: audioFile.blob.size,
                },
              ],
            }
          : null,
      );
      setAudioFile(null);
      setAudioUploadSubmissionId(null);
      setSuccessMessage('Voice answer uploaded successfully!');
    } catch (err) {
      console.error('Retry audio upload failed:', err);
      setAudioUploadError('Failed to upload audio recording. Please try again.');
    } finally {
      setRetryingAudio(false);
    }
  };

  const handleSubmitResults = async () => {
    if (!lesson?.id) {
      setErrorMessage('Lesson is not loaded yet');
      return;
    }

    try {
      setSubmitting(true);
      setSuccessMessage('');
      setErrorMessage('');

      const currentAnswers = currentAnswersRef.current || {};
      let previousAnswers: Record<string, unknown> = {};
      if (mySubmission?.answers) {
        if (typeof mySubmission.answers === 'string') {
          try {
            previousAnswers = JSON.parse(mySubmission.answers);
          } catch {
            previousAnswers = {};
          }
        } else if (typeof mySubmission.answers === 'object') {
          previousAnswers = mySubmission.answers as Record<string, unknown>;
        }
      }

      const answersPayload = {
        ...previousAnswers,
        ...currentAnswers,
      };

      const response = await api.post('/submissions', {
        lessonId: lesson.id,
        answers: answersPayload,
      });

      const { score, id: submissionId } = response.data;
      setMySubmission(response.data);
      currentAnswersRef.current = (response.data.answers as Record<string, unknown>) || answersPayload;

      // Загрузка аудиофайла на созданный submissionId
      if (audioFile && submissionId) {
        setAudioUploadSubmissionId(submissionId);
        try {
          await uploadAudioFile(submissionId, audioFile);
          const exKey = audioFile.exerciseKey || 'exercise_8';
          setMySubmission((prev) =>
            prev
              ? {
                  ...prev,
                  audios: [
                    ...(prev.audios?.filter((a) => a.exerciseKey !== exKey) || []),
                    {
                      exerciseKey: exKey,
                      mimeType: audioFile.mimeType,
                      sizeBytes: audioFile.blob.size,
                    },
                  ],
                }
              : null,
          );
          setAudioFile(null);
          setAudioUploadSubmissionId(null);
          setAudioUploadError(null);
          setSuccessMessage(`Results and audio answer submitted! Score: ${score}%`);
        } catch (audioErr) {
          console.error('Audio upload failed:', audioErr);
          setSuccessMessage(`Results submitted! Score: ${score}%`);
          setAudioUploadError('Text answers saved, but failed to upload audio recording. Please click "Retry Audio Upload".');
        }
      } else {
        setSuccessMessage(`Results submitted! Score: ${score}%`);
      }

      // Эмоциональная реакция маскота Майло на результат сдачи ДЗ
      if (typeof score === 'number') {
        mascot.setIsMinimized(false);
        if (score >= 80) {
          mascot.react('happy', `Awesome job! You scored ${score}%! 🌟`, 5000);
        } else if (score >= 50) {
          mascot.react('talking', `Good progress! Score: ${score}%. Let's review the mistakes!`, 4500);
        } else {
          mascot.react('thinking', `Good effort! Score: ${score}%. Check the rules and try again!`, 4500);
        }
      }
    } catch (err: unknown) {
      console.error('Failed to submit results:', err);
      mascot.react('sad', "Oops, couldn't submit answers. Please try again!", 3500);
      let msg = 'Failed to submit answers. Please try again.';

      const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosError.response) {
        if (axiosError.response.status === 401 || axiosError.response.status === 403) {
          msg = 'Only students can submit';
        } else if (axiosError.response.data?.message) {
          msg = axiosError.response.data.message;
        }
      }

      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading lesson content...</div>;
  }

  const isLocked = mySubmission?.status === 'submitted' || mySubmission?.status === 'graded';

  return (
    <div className={styles.lessonPage}>
      <Navbar user={user} showBackToDashboard={true} />
      <div className={styles.container}>
        <button
          onClick={() => {
            const savedUnit =
              (lesson as { unit?: { id?: string } })?.unit?.id ||
              (typeof window !== 'undefined' ? localStorage.getItem('last_active_unit_id') : null);
            router.push(savedUnit ? `/dashboard?unit=${encodeURIComponent(savedUnit)}` : '/dashboard');
          }}
          className={styles.backButton}
        >
          ← Back to Dashboard
        </button>

        <LessonProvider
          lesson={lesson}
          mode={isTeacherReview ? 'teacher' : 'student'}
          readOnly={isLocked}
          initialAnswers={mySubmission?.answers as Record<string, unknown> | null}
          answerKey={lesson?.answerKey}
          audios={mySubmission?.audios}
          submissionId={mySubmission?.id}
          onAnswersChange={(updatedAnswers) => {
            currentAnswersRef.current = updatedAnswers;
          }}
        >
          <div className={styles.interactivePage}>
            <LessonContentRenderer
              user={user}
              audioBlob={audioFile?.blob}
              onAudioBlobChange={(blob, mimeType, exerciseKey = 'exercise_8') => {
                if (blob) {
                  setAudioFile({ blob, mimeType, exerciseKey });
                } else {
                  setAudioFile(null);
                }
              }}
            />

            <div className={styles.submitSection}>
              {mySubmission?.status === 'needs_revision' && (
                <div className={styles.revisionBox}>
                  <strong>⚠️ Teacher requested revisions:</strong>
                  <p>{mySubmission.tutorComment || 'Please review and improve your answers.'}</p>
                </div>
              )}
              {mySubmission?.status === 'submitted' && (
                <div className={styles.warningBox}>
                  ℹ️ Your homework has been submitted and is currently waiting for teacher review.
                </div>
              )}
              {mySubmission?.status === 'graded' && (
                <div className={styles.successBox}>
                  🎉 This homework is graded! Final score: {mySubmission.grade ?? mySubmission.score}%
                  {mySubmission.tutorComment && (
                    <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                      Teacher feedback: &quot;{mySubmission.tutorComment}&quot;
                    </p>
                  )}
                </div>
              )}
              <button
                onClick={handleSubmitResults}
                disabled={submitting || isLocked}
                className={styles.submitBtn}
              >
                {submitting
                  ? 'Submitting...'
                  : mySubmission?.status === 'submitted'
                  ? 'Already Submitted (Under Review)'
                  : mySubmission?.status === 'graded'
                  ? `Graded (${mySubmission.grade ?? mySubmission.score}%)`
                  : mySubmission?.status === 'needs_revision'
                  ? 'Resubmit Homework'
                  : 'Submit Answers'}
              </button>
              {successMessage && (
                <p className={styles.successText}>{successMessage}</p>
              )}
              {errorMessage && (
                <p className={styles.errorText}>{errorMessage}</p>
              )}
              {audioUploadError && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{audioUploadError}</p>
                  <button
                    type="button"
                    onClick={handleRetryAudio}
                    disabled={retryingAudio}
                    style={{ padding: '0.4rem 0.8rem', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {retryingAudio ? 'Uploading...' : 'Retry Audio Upload'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </LessonProvider>
      </div>
    </div>
  );
};

export default LessonPage;
