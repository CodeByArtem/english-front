'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './lesson.module.scss';
import LessonContent from '@/components/LessonContent';
import Lesson1BContent from '@/components/Lesson1BContent';

const LessonPage = () => {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
  const [submitting, setSubmitting] = useState(false);
  const [mySubmission, setMySubmission] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        setLoading(true);

        // Получение данных пользователя из localStorage
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }

        let targetId = lessonId;

        if (!targetId) {
          const tbRes = await api.get('/content/textbooks');
          if (tbRes.data?.[0]?.units?.[0]?.lessons?.[0]?.id) {
            targetId = tbRes.data[0].units[0].lessons[0].id;
          }
        }

        const res = await api.get(`/content/lessons/${targetId}`);
        setLesson(res.data);

        // Проверяем существующую сдачу дз для текущего студента
        try {
          const subRes = await api.get(`/submissions/lesson/${targetId}/my-submission`);
          if (subRes.data) {
            setMySubmission(subRes.data);
            const ans = subRes.data.answers || {};
            if (ans.flagAnswers) setFlagAnswers(ans.flagAnswers);
            if (ans.dialogInputs) setDialogInputs(ans.dialogInputs);
            if (ans.stressTableInputs) setStressTableInputs(ans.stressTableInputs);
            if (ans.grammarInputs) setGrammarInputs(ans.grammarInputs);
            if (ans.dialogue7aInputs) setDialogue7aInputs(ans.dialogue7aInputs);
            if (ans.conferenceCard) setConferenceCard(ans.conferenceCard);
            if (ans.exercise_1b_jobs) setJobsInputs(ans.exercise_1b_jobs);
            if (ans.exercise_3_reading) setReadingInputs(ans.exercise_3_reading);
            if (ans.exercise_page9_profiles) setPage9Profiles(ans.exercise_page9_profiles);
            if (ans.exercise_4a_reading) setEx4aAnswers(ans.exercise_4a_reading);
            if (ans.exercise_5a_grammar) setGrammar5aInputs(ans.exercise_5a_grammar);
            if (ans.exercise_6_dialogue) setEx6Answers(ans.exercise_6_dialogue);
            if (ans.exercise_7a_qa) setEx7aAnswers(ans.exercise_7a_qa);
            if (ans.exercise_7b_profiles) setProfilePairs(ans.exercise_7b_profiles);
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

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  const handleFlagChange = (id: number, value: string) => {
    setFlagAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleDialogChange = (id: string, value: string) => {
    setDialogInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleStressChange = (id: string, value: string) => {
    setStressTableInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleGrammarChange = (id: string, value: string) => {
    setGrammarInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleDialogue7aChange = (id: string, value: string) => {
    setDialogue7aInputs(prev => ({ ...prev, [id]: value }));
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
    // If the same track is playing, stop it
    if (playingAudio === track && currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingAudio(null);
      return;
    }

    // If another track is playing, stop it
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

  const handleSubmitResults = async () => {
    if (!lesson?.id) {
      setErrorMessage("Lesson is not loaded yet");
      return;
    }

    try {
      setSubmitting(true);
      setSuccessMessage('');
      setErrorMessage('');

      const isLesson1B =
        lesson?.order === 2 ||
        lesson?.title?.includes('1B') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

      const answersPayload = isLesson1B
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

      const response = await api.post('/submissions', {
        lessonId: lesson.id,
        answers: answersPayload,
      });

      const { score } = response.data;
      setMySubmission(response.data);
      setSuccessMessage(`Results submitted! Score: ${score}%`);
    } catch (err: any) {
      console.error('Failed to submit results:', err);
      let msg = 'Failed to submit answers. Please try again.';
      
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          msg = "Only students can submit";
        } else if (err.response.data?.message) {
          msg = err.response.data.message;
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
  const isLesson1A = lesson?.order === 1 || lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
  const isLesson1B =
    lesson?.order === 2 ||
    lesson?.title?.includes('1B') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

  return (
      <div className={styles.pageContainer}>
        <div className={styles.bookCard}>

          <button
              onClick={() => router.push('/dashboard')}
              className={styles.backButton}
          >
            ← Back to Dashboard
          </button>

          {isLesson1A || isLesson1B ? (
            <>
              {isLesson1A && (
                <LessonContent
                  lesson={lesson}
                  user={user}
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
                  readOnly={isLocked}
                  playAudio={playAudio}
                  playingAudio={playingAudio}
                />
              )}

              {isLesson1B && (
                <Lesson1BContent
                  lesson={lesson}
                  user={user}
                  jobsInputs={jobsInputs}
                  readingInputs={readingInputs}
                  onJobChange={(id, val) => setJobsInputs((prev) => ({ ...prev, [id]: val }))}
                  onReadingChange={(id, val) => setReadingInputs((prev) => ({ ...prev, [id]: val }))}
                  page9Profiles={page9Profiles}
                  onPage9ProfileChange={(id, val) => setPage9Profiles((prev) => ({ ...prev, [id]: val }))}
                  ex4aAnswers={ex4aAnswers}
                  onEx4aChange={(qId, val) => setEx4aAnswers((prev) => ({ ...prev, [qId]: val }))}
                  grammar5aInputs={grammar5aInputs}
                  onGrammar5aChange={(id, val) => setGrammar5aInputs((prev) => ({ ...prev, [id]: val }))}
                  ex6Answers={ex6Answers}
                  onEx6Change={(qId, val) => setEx6Answers((prev) => ({ ...prev, [qId]: val }))}
                  ex7aAnswers={ex7aAnswers}
                  onEx7aChange={(qId, val) => setEx7aAnswers((prev) => ({ ...prev, [qId]: val }))}
                  profilePairs={profilePairs}
                  onProfilePairChange={(gender, field, val) =>
                    setProfilePairs((prev) => ({
                      ...prev,
                      [gender]: { ...prev[gender], [field]: val },
                    }))
                  }
                  readOnly={isLocked}
                  originalAnswers={mySubmission?.answers}
                  playAudio={playAudio}
                  playingAudio={playingAudio}
                />
              )}

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
              </div>
            </>
          ) : (
            <div className={styles.placeholderContainer}>
              <h2 className={styles.placeholderTitle}>{lesson?.title || 'Lesson'}</h2>
              <div className={styles.placeholderCard}>
                <div className={styles.placeholderIcon}>⏳</div>
                <p className={styles.placeholderText}>Урок ещё готовится</p>
                <p className={styles.placeholderSubtext}>
                  Материалы и интерактивные задания для этого урока находятся в разработке.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default LessonPage;