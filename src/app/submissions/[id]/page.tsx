'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './submission.module.scss';
import LessonContent from '@/components/LessonContent';

export default function SubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  const [flagAnswers, setFlagAnswers] = useState<Record<number, string>>({});
  const [dialogInputs, setDialogInputs] = useState<Record<string, string>>({});
  const [stressTableInputs, setStressTableInputs] = useState<Record<string, string>>({});
  
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const [grade, setGrade] = useState<number | string>('');
  const [tutorComment, setTutorComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/submissions/${id}`);
        const data = res.data;
        setSubmission(data);
        
        // Initialize interactive state
        const answers = data.reviewedAnswers || data.answers || {};
        setFlagAnswers(answers.flagAnswers || {});
        setDialogInputs(answers.dialogInputs || {});
        setStressTableInputs(answers.stressTableInputs || {});
        
        if (data.grade !== null) setGrade(data.grade);
        if (data.tutorComment) setTutorComment(data.tutorComment);
      } catch (err: any) {
        console.error('Failed to load submission:', err);
        setError(err.response?.data?.message || 'Failed to load submission details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubmission();
    }
  }, [id]);

  const handleFlagChange = (fid: number, value: string) => {
    setFlagAnswers(prev => ({ ...prev, [fid]: value }));
  };

  const handleDialogChange = (did: string, value: string) => {
    setDialogInputs(prev => ({ ...prev, [did]: value }));
  };

  const handleStressChange = (sid: string, value: string) => {
    setStressTableInputs(prev => ({ ...prev, [sid]: value }));
  };

  const playAudio = (track: string) => {
    if (playingAudio === track && currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingAudio(null);
      return;
    }
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(`/audio/${track}.mp3`);
    audio.onended = () => {
      setPlayingAudio(null);
      setCurrentAudio(null);
    };
    setPlayingAudio(track);
    setCurrentAudio(audio);
    audio.play().catch(err => {
      console.error('Audio playback failed:', err);
      setPlayingAudio(null);
      setCurrentAudio(null);
    });
  };

  const handleSaveReview = async () => {
    try {
      setSaving(true);
      setSuccess('');
      setError('');
      await api.patch(`/submissions/${id}/review`, {
        answers: { flagAnswers, dialogInputs, stressTableInputs },
        grade: Number(grade),
        tutorComment
      });
      setSuccess('Review saved successfully!');
      // Refresh data
      const res = await api.get(`/submissions/${id}`);
      setSubmission(res.data);
    } catch (err: any) {
      console.error('Failed to save review:', err);
      setError(err.response?.data?.message || 'Failed to save review.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!submission) return;
    const original = submission.answers || {};
    setFlagAnswers(original.flagAnswers || {});
    setDialogInputs(original.dialogInputs || {});
    setStressTableInputs(original.stressTableInputs || {});
    setSuccess('Reset to student answers');
  };

  if (loading) return <div className={styles.loading}>Loading submission details...</div>;
  if (error && !submission) return <div className={styles.error}>{error}</div>;
  if (!submission) return <div className={styles.error}>Submission not found.</div>;

  const isTutor = user?.role?.toUpperCase() !== 'STUDENT';
  const lesson = submission.lesson || submission.assignment?.lesson;
  const assignmentTitle = submission.assignment?.title;

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
            <p><span>Lesson:</span> {lesson?.title} {assignmentTitle ? `(${assignmentTitle})` : ''}</p>
            <p><span>Submitted At:</span> {new Date(submission.createdAt).toLocaleString()}</p>
            <p><span>Auto Score:</span> <span className={styles.scoreBadge}>{submission.score}%</span></p>
            <p><span>Status:</span> <span className={`${styles.scoreBadge} ${submission.status === 'graded' ? styles.statusGraded : styles.statusPending}`}>{submission.status}</span></p>
          </div>
        </div>

        <LessonContent
          lesson={lesson}
          user={submission.student}
          flagAnswers={flagAnswers}
          dialogInputs={dialogInputs}
          stressTableInputs={stressTableInputs}
          onFlagChange={handleFlagChange}
          onDialogChange={handleDialogChange}
          onStressChange={handleStressChange}
          readOnly={!isTutor}
          originalAnswers={submission.answers}
          playAudio={playAudio}
          playingAudio={playingAudio}
        />

        {isTutor ? (
          <div className={styles.gradingForm}>
            <h2 className={styles.sectionTitle} style={{margin: '0 0 1rem 0', border: 'none', padding: 0}}>Grade Submission</h2>
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
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleSaveReview} 
                disabled={saving}
                className={styles.saveBtn}
              >
                {saving ? 'Saving...' : 'Save corrections'}
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
