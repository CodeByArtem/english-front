'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './submission.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { LessonProvider } from '@/context/LessonContext';
import LessonContentRenderer from '@/components/LessonContentRenderer';
import { SubmissionAudioMeta } from '@/components/AudioAnswerRecorder/SubmissionAudioPlayer';
import { LessonAnswerKey } from '@/lib/answerVerification';

interface SubmissionModel {
  id: string;
  score?: number;
  grade?: number;
  status: string;
  tutorComment?: string;
  answers?: Record<string, unknown>;
  reviewedAnswers?: Record<string, unknown>;
  audios?: SubmissionAudioMeta[];
  createdAt: string;
  student?: {
    id: string;
    email: string;
    name?: string;
  };
  lesson?: {
    id: string;
    title: string;
    order?: number;
    answerKey?: LessonAnswerKey | null;
    [key: string]: unknown;
  };
  assignment?: {
    id: string;
    title: string;
    attachmentUrl?: string | null;
    lesson?: {
      id: string;
      title: string;
      order?: number;
      answerKey?: LessonAnswerKey | null;
      [key: string]: unknown;
    };
  };
  [key: string]: unknown;
}

export default function SubmissionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [submission, setSubmission] = useState<SubmissionModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [grade, setGrade] = useState<string>('');
  const [tutorComment, setTutorComment] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { isTutor } = useAuth();

  // Состояние ответов для контекста (может сбрасываться кнопкой "Reset to student answers")
  const [answersState, setAnswersState] = useState<Record<string, unknown>>({});
  const currentAnswersRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/submissions/${id}`);
        const data = res.data as SubmissionModel;
        setSubmission(data);

        let studentAnswers: Record<string, unknown> = {};
        if (data.answers) {
          if (typeof data.answers === 'string') {
            try {
              studentAnswers = JSON.parse(data.answers);
            } catch {
              studentAnswers = {};
            }
          } else if (typeof data.answers === 'object') {
            studentAnswers = data.answers as Record<string, unknown>;
          }
        }

        let reviewedAnswers: Record<string, unknown> | null = null;
        if (data.reviewedAnswers) {
          if (typeof data.reviewedAnswers === 'string') {
            try {
              reviewedAnswers = JSON.parse(data.reviewedAnswers);
            } catch {
              reviewedAnswers = null;
            }
          } else if (typeof data.reviewedAnswers === 'object') {
            reviewedAnswers = data.reviewedAnswers as Record<string, unknown>;
          }
        }

        // Если домашнее задание только что прислано учеником (статус 'submitted')
        // или если reviewedAnswers отсутствуют/пусты — ВСЕГДА показываем свежие ответы ученика
        const rawAnswers =
          data.status === 'submitted' || !reviewedAnswers || Object.keys(reviewedAnswers).length === 0
            ? studentAnswers
            : reviewedAnswers;

        setAnswersState(rawAnswers);
        currentAnswersRef.current = rawAnswers;

        if (data.status === 'submitted') {
          // При свежей сдаче подставляем автоматически вычисленный процент, а комментарий сбрасываем
          setGrade(data.score !== null && data.score !== undefined ? String(data.score) : '');
          setTutorComment('');
        } else {
          if (data.grade !== null && data.grade !== undefined) {
            setGrade(String(data.grade));
          } else if (data.score !== null && data.score !== undefined) {
            setGrade(String(data.score));
          }

          if (data.tutorComment) {
            setTutorComment(data.tutorComment);
          }
        }
      } catch (err: unknown) {
        console.error('Failed to load submission:', err);
        setError('Failed to load submission details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubmission();
    }
  }, [id]);

  const handleSaveReview = async (targetStatus = 'graded') => {
    try {
      setSaving(true);
      setSuccess('');
      setError('');

      if (targetStatus === 'needs_revision' && !tutorComment.trim()) {
        setError('Please provide a tutor comment explaining what needs to be revised.');
        setSaving(false);
        return;
      }

      const gradeNum = grade === '' ? null : Number(grade);
      if (gradeNum !== null && (Number.isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100)) {
        setError('Grade must be a number between 0 and 100.');
        setSaving(false);
        return;
      }

      const payloadAnswers = currentAnswersRef.current;

      const payload: {
        status: string;
        tutorComment?: string | null;
        grade?: number;
        answers: Record<string, unknown>;
        reviewedAnswers: Record<string, unknown>;
      } = {
        status: targetStatus,
        answers: payloadAnswers,
        reviewedAnswers: payloadAnswers,
      };

      if (tutorComment.trim()) {
        payload.tutorComment = tutorComment.trim();
      }

      if (gradeNum !== null) {
        payload.grade = gradeNum;
      }

      const res = await api.patch(`/submissions/${id}/review`, payload);
      setSubmission(res.data);
      setSuccess(targetStatus === 'graded' ? 'Grade saved successfully!' : 'Returned for revision!');
    } catch (err: unknown) {
      console.error('Failed to save review:', err);
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || 'Failed to save review.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!submission?.answers) return;
    let original = submission.answers;
    if (typeof original === 'string') {
      try {
        original = JSON.parse(original);
      } catch {
        original = {};
      }
    }
    setAnswersState({ ...original });
    currentAnswersRef.current = { ...original };
    setSuccess('Reset to student answers');
  };

  if (loading) return <div className={styles.loading}>Loading submission details...</div>;
  if (error && !submission) return <div className={styles.error}>{error}</div>;
  if (!submission) return <div className={styles.error}>Submission not found.</div>;

  const lesson = submission.lesson || submission.assignment?.lesson;
  const assignmentTitle = submission.assignment?.title;
  const isCustomAssignment = Boolean(
    submission.answers?.text || (!lesson && submission.assignment),
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.submissionCard}>
        <button onClick={() => router.push('/teacher/dashboard')} className={styles.backButton}>
          ← Back to Dashboard
        </button>

        <div className={styles.headerSection}>
          <h1 className={styles.title}>Submission Details</h1>
          <div className={styles.infoGrid}>
            <p><span>Student:</span> {submission.student?.email}</p>
            <p><span>Lesson / Task:</span> {lesson?.title || assignmentTitle || 'Custom Assignment'}</p>
            <p><span>Submitted At:</span> {new Date(submission.createdAt).toLocaleString()}</p>
            <p><span>Auto Score:</span> <span className={styles.scoreBadge}>{submission.score ?? 0}%</span></p>
            <p>
              <span>Status:</span>{' '}
              <span
                className={`${styles.scoreBadge} ${
                  submission.status === 'graded'
                    ? styles.statusGraded
                    : submission.status === 'needs_revision'
                    ? styles.statusRevision
                    : styles.statusPending
                }`}
              >
                {submission.status}
              </span>
            </p>
          </div>
        </div>

        {isCustomAssignment ? (
          <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#1b4c5b', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
              Student Response Text:
            </h3>
            <div style={{ whiteSpace: 'pre-wrap', background: 'white', padding: '1.25rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', lineHeight: '1.6' }}>
              {String(submission.answers?.text || (typeof submission.answers === 'string' ? submission.answers : 'No text content in submission'))}
            </div>
            {submission.assignment?.attachmentUrl && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                <strong style={{ color: '#0369a1' }}>📎 Assignment Material: </strong>
                <a
                  href={submission.assignment.attachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#0284c7', textDecoration: 'underline' }}
                >
                  View Attachment
                </a>
              </div>
            )}
          </div>
        ) : lesson ? (
          <LessonProvider
            lesson={lesson}
            mode="teacher"
            readOnly={false}
            initialAnswers={answersState}
            answerKey={lesson.answerKey}
            audios={submission.audios}
            submissionId={submission.id}
            onAnswersChange={(updated) => {
              currentAnswersRef.current = updated;
            }}
          >
            <LessonContentRenderer user={submission.student} />
          </LessonProvider>
        ) : (
          <div className={styles.placeholderContainer}>
            <p>Lesson content not found</p>
          </div>
        )}

        {isTutor ? (
          <div className={styles.gradingForm}>
            <h2 className={styles.sectionTitle} style={{ margin: '0 0 1rem 0', border: 'none', padding: 0 }}>
              Grade Submission
            </h2>
            <div className={styles.formGroup}>
              <label>Grade (0-100)</label>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                min="0"
                max="100"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Tutor Comment</label>
              <textarea
                value={tutorComment}
                onChange={(e) => setTutorComment(e.target.value)}
                placeholder="Write your feedback here..."
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleSaveReview('graded')}
                disabled={saving}
                className={styles.saveBtn}
              >
                {saving ? 'Saving...' : 'Save & Grade'}
              </button>
              <button
                onClick={() => handleSaveReview('needs_revision')}
                disabled={saving}
                className={styles.revisionBtn}
              >
                Return for revision
              </button>
              <button
                onClick={handleReset}
                disabled={saving}
                className={styles.backButton}
                style={{ margin: 0 }}
              >
                Reset to student answers
              </button>
            </div>
            {success && <p className={styles.successMsg}>{success}</p>}
            {error && <p className={styles.errorMsg}>{error}</p>}
          </div>
        ) : (
          (submission.grade !== null || submission.tutorComment) && (
            <div className={styles.tutorFeedback}>
              <h4>Tutor Feedback</h4>
              {submission.grade !== null && <p><span>Grade:</span> {submission.grade}/100</p>}
              {submission.tutorComment && (
                <div>
                  <span>Comment:</span>
                  <p>{submission.tutorComment}</p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
