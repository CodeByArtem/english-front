'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './submission.module.scss';
import LessonContent from '@/components/LessonContent';
import Lesson1BContent from '@/components/Lesson1BContent';

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
  const [grammarInputs, setGrammarInputs] = useState<Record<string, string>>({});
  const [dialogue7aInputs, setDialogue7aInputs] = useState<Record<string, string>>({});
  const [conferenceCard, setConferenceCard] = useState<{
    name: string;
    city: string;
    country: string;
    roles: string[];
  }>({ name: '', city: '', country: '', roles: [] });

  const [jobsInputs, setJobsInputs] = useState<Record<string, string>>({});
  const [readingInputs, setReadingInputs] = useState<Record<string, string>>({});
  const [page9Profiles, setPage9Profiles] = useState<Record<string, string>>({});
  const [ex4aAnswers, setEx4aAnswers] = useState<Record<string, string>>({});
  const [grammar5aInputs, setGrammar5aInputs] = useState<Record<string, string>>({});
  const [ex6Answers, setEx6Answers] = useState<Record<string, string>>({});
  const [ex7aAnswers, setEx7aAnswers] = useState<Record<string, string>>({});
  const [profilePairs, setProfilePairs] = useState<{
    woman?: { name?: string; job?: string; city?: string; country?: string };
    man?: { name?: string; job?: string; city?: string; country?: string };
  }>({});

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
        setGrammarInputs(answers.grammarInputs || {});
        setDialogue7aInputs(answers.dialogue7aInputs || {});
        setConferenceCard(answers.conferenceCard || { name: '', city: '', country: '', roles: [] });
        setJobsInputs(answers.exercise_1b_jobs || answers.jobsInputs || {});
        setReadingInputs(answers.exercise_3_reading || answers.readingInputs || {});
        setPage9Profiles(answers.exercise_page9_profiles || {});
        setEx4aAnswers(answers.exercise_4a_reading || {});
        setGrammar5aInputs(answers.exercise_5a_grammar || {});
        setEx6Answers(answers.exercise_6_dialogue || {});
        setEx7aAnswers(answers.exercise_7a_qa || {});
        setProfilePairs(answers.exercise_7b_profiles || {});
        
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

  const handleGrammarChange = (gid: string, value: string) => {
    setGrammarInputs(prev => ({ ...prev, [gid]: value }));
  };

  const handleDialogue7aChange = (did: string, value: string) => {
    setDialogue7aInputs(prev => ({ ...prev, [did]: value }));
  };

  const handleConferenceCardChange = (field: 'name' | 'city' | 'country', value: string) => {
    setConferenceCard(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (role: string) => {
    setConferenceCard(prev => {
      const currentRoles = prev.roles || [];
      const exists = currentRoles.includes(role);
      return {
        ...prev,
        roles: exists ? currentRoles.filter(r => r !== role) : [...currentRoles, role],
      };
    });
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

      const isLesson1B =
        lesson?.order === 2 ||
        lesson?.title?.includes('1B') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

      const payloadAnswers = isLesson1B
        ? {
            exercise_1b_jobs: jobsInputs,
            exercise_3_reading: readingInputs,
            exercise_page9_profiles: page9Profiles,
            exercise_4a_reading: ex4aAnswers,
            exercise_5a_grammar: grammar5aInputs,
            exercise_6_dialogue: ex6Answers,
            exercise_7a_qa: ex7aAnswers,
            exercise_7b_profiles: profilePairs,
          }
        : {
            flagAnswers,
            dialogInputs,
            stressTableInputs,
            grammarInputs,
            dialogue7aInputs,
            conferenceCard,
          };

      await api.patch(`/submissions/${id}/review`, {
        answers: payloadAnswers,
        grade: grade !== '' ? Number(grade) : undefined,
        tutorComment,
        status: targetStatus,
      });
      setSuccess(targetStatus === 'needs_revision' ? 'Returned for revision!' : 'Graded successfully!');
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
    setGrammarInputs(original.grammarInputs || {});
    setDialogue7aInputs(original.dialogue7aInputs || {});
    setConferenceCard(original.conferenceCard || { name: '', city: '', country: '', roles: [] });
    setJobsInputs(original.exercise_1b_jobs || original.jobsInputs || {});
    setReadingInputs(original.exercise_3_reading || original.readingInputs || {});
    setPage9Profiles(original.exercise_page9_profiles || {});
    setEx4aAnswers(original.exercise_4a_reading || {});
    setGrammar5aInputs(original.exercise_5a_grammar || {});
    setEx6Answers(original.exercise_6_dialogue || {});
    setEx7aAnswers(original.exercise_7a_qa || {});
    setProfilePairs(original.exercise_7b_profiles || {});
    setSuccess('Reset to student answers');
  };

  if (loading) return <div className={styles.loading}>Loading submission details...</div>;
  if (error && !submission) return <div className={styles.error}>{error}</div>;
  if (!submission) return <div className={styles.error}>Submission not found.</div>;

  const isTutor = user?.role?.toUpperCase() !== 'STUDENT';
  const lesson = submission.lesson || submission.assignment?.lesson;
  const assignmentTitle = submission.assignment?.title;
  const isLesson1B =
    lesson?.order === 2 ||
    lesson?.title?.includes('1B') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

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
            <p><span>Status:</span> <span className={`${styles.scoreBadge} ${submission.status === 'graded' ? styles.statusGraded : submission.status === 'needs_revision' ? styles.statusRevision : styles.statusPending}`}>{submission.status}</span></p>
          </div>
        </div>

        {isLesson1B ? (
          <Lesson1BContent
            lesson={lesson}
            user={submission.student}
            jobsInputs={jobsInputs}
            readingInputs={readingInputs}
            onJobChange={(jid, val) => setJobsInputs((prev) => ({ ...prev, [jid]: val }))}
            onReadingChange={(rid, val) => setReadingInputs((prev) => ({ ...prev, [rid]: val }))}
            page9Profiles={page9Profiles}
            onPage9ProfileChange={(pid, val) => setPage9Profiles((prev) => ({ ...prev, [pid]: val }))}
            ex4aAnswers={ex4aAnswers}
            onEx4aChange={(qid, val) => setEx4aAnswers((prev) => ({ ...prev, [qid]: val }))}
            grammar5aInputs={grammar5aInputs}
            onGrammar5aChange={(gid, val) => setGrammar5aInputs((prev) => ({ ...prev, [gid]: val }))}
            ex6Answers={ex6Answers}
            onEx6Change={(qid, val) => setEx6Answers((prev) => ({ ...prev, [qid]: val }))}
            ex7aAnswers={ex7aAnswers}
            onEx7aChange={(qid, val) => setEx7aAnswers((prev) => ({ ...prev, [qid]: val }))}
            profilePairs={profilePairs}
            onProfilePairChange={(gender, field, val) =>
              setProfilePairs((prev) => ({
                ...prev,
                [gender]: { ...prev[gender], [field]: val },
              }))
            }
            readOnly={!isTutor}
            originalAnswers={submission.answers}
            playAudio={playAudio}
            playingAudio={playingAudio}
          />
        ) : (
          <LessonContent
            lesson={lesson}
            user={submission.student}
            flagAnswers={flagAnswers}
            dialogInputs={dialogInputs}
            stressTableInputs={stressTableInputs}
            grammarInputs={grammarInputs}
            dialogue7aInputs={dialogue7aInputs}
            conferenceCard={conferenceCard}
            onFlagChange={handleFlagChange}
            onDialogChange={handleDialogChange}
            onStressChange={handleStressChange}
            onGrammarChange={handleGrammarChange}
            onDialogue7aChange={handleDialogue7aChange}
            onConferenceCardChange={handleConferenceCardChange}
            onRoleToggle={handleRoleToggle}
            readOnly={!isTutor}
            originalAnswers={submission.answers}
            playAudio={playAudio}
            playingAudio={playingAudio}
          />
        )}

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
