'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './lesson.module.scss';
import LessonContent from '@/components/LessonContent';

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
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
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

      const response = await api.post('/submissions', {
        lessonId: lesson.id,
        answers: { flagAnswers, dialogInputs, stressTableInputs },
      });

      const { score } = response.data;
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

  return (
      <div className={styles.pageContainer}>
        <div className={styles.bookCard}>

          <button
              onClick={() => router.push('/dashboard')}
              className={styles.backButton}
          >
            ← Back to Dashboard
          </button>

          <LessonContent
            lesson={lesson}
            user={user}
            flagAnswers={flagAnswers}
            dialogInputs={dialogInputs}
            stressTableInputs={stressTableInputs}
            onFlagChange={handleFlagChange}
            onDialogChange={handleDialogChange}
            onStressChange={handleStressChange}
            playAudio={playAudio}
            playingAudio={playingAudio}
          />

          <div className={styles.submitSection}>
            <button
                onClick={handleSubmitResults}
                disabled={submitting}
                className={styles.submitBtn}
            >
              {submitting ? 'Submitting...' : 'Submit Answers'}
            </button>
            {successMessage && (
                <p className={styles.successText}>{successMessage}</p>
            )}
            {errorMessage && (
                <p className={styles.errorText}>{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
  );
};

export default LessonPage;