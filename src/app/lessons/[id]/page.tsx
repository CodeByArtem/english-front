'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './lesson.module.scss';
import LessonContent from '@/components/LessonContent';
import Lesson1BContent from '@/components/Lesson1BContent';
import Lesson1CContent from '@/components/Lesson1CContent';
import Lesson1DContent from '@/components/Lesson1DContent';
import Lesson2AContent from '@/components/Lesson2AContent';
import Lesson2BContent from '@/components/Lesson2BContent';
import { SubmissionAudioMeta } from '@/components/AudioAnswerRecorder/SubmissionAudioPlayer';

interface LessonModel {
  id: string;
  title: string;
  order?: number;
  content?: string;
  theory?: string;
  answerKey?: Record<string, unknown>;
  [key: string]: unknown;
}

interface UserModel {
  id: string;
  email: string;
  role: string;
  name?: string;
  [key: string]: unknown;
}

interface SubmissionModel {
  id: string;
  score?: number;
  grade?: number;
  status: string;
  tutorComment?: string;
  answers?: Record<string, Record<string, string> | string>;
  audios?: SubmissionAudioMeta[];
  [key: string]: unknown;
}

const LessonPage = () => {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;

  const [lesson, setLesson] = useState<LessonModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserModel | null>(null);

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

  // 1C states
  const [nationalitiesInputs, setNationalitiesInputs] = useState<Record<string, string>>({});
  const [stressInputs, setStressInputs] = useState<Record<string, string>>({});
  const [famousInputs, setFamousInputs] = useState<string>('');
  const [photosInputs, setPhotosInputs] = useState<Record<string, string>>({});
  const [tfInputs, setTfInputs] = useState<Record<string, string>>({});
  const [grammar5aInputs1C, setGrammar5aInputs1C] = useState<Record<string, string>>({});
  const [textsInputs, setTextsInputs] = useState<Record<string, string>>({});
  const [questionsInputs, setQuestionsInputs] = useState<Record<string, string>>({});
  const [speakingNotes, setSpeakingNotes] = useState<string>('');
  
  // 1D states
  const [ex1Location, setEx1Location] = useState<string>('');
  const [ex2Audio, setEx2Audio] = useState<Record<string, string>>({});
  const [ex3aOrder, setEx3aOrder] = useState<Record<string, string>>({});
  const [ex3bContact, setEx3bContact] = useState<Record<string, string>>({});
  const [ex4aDialogue, setEx4aDialogue] = useState<Record<string, string>>({});
  const [ex5Personal, setEx5Personal] = useState<Record<string, string>>({});
  const [ex6Partner, setEx6Partner] = useState<Record<string, string>>({});

  const [wordsearchFound, setWordsearchFound] = useState<Record<string, string>>({});
  const [ex2aOrder, setEx2aOrder] = useState<Record<string, string>>({});
  const [ex2bShort, setEx2bShort] = useState<Record<string, string>>({});
  const [ex3Be, setEx3Be] = useState<Record<string, string>>({});
  const [ex4Jobs, setEx4Jobs] = useState<Record<string, string>>({});
  const [ex5IsIsnt, setEx5IsIsnt] = useState<Record<string, string>>({});
  const [ex6Corrections, setEx6Corrections] = useState<Record<string, string>>({});
  const [ex7aNationalities, setEx7aNationalities] = useState<Record<string, string>>({});
  const [ex7bPeople, setEx7bPeople] = useState<Record<string, string>>({});
  const [ex8Alternatives, setEx8Alternatives] = useState<Record<string, string>>({});
  const [ex9Text, setEx9Text] = useState<Record<string, string>>({});
  const [reflectScores, setReflectScores] = useState<Record<string, string | number>>({});

  // 2A states
  const [ex1FamilyTree, setEx1FamilyTree] = useState<Record<string, string>>({});
  const [ex2aTable, setEx2aTable] = useState<Record<string, string>>({});
  const [ex3Sentences, setEx3Sentences] = useState<Record<string, string>>({});
  const [ex4aMatch, setEx4aMatch] = useState<Record<string, string>>({});
  const [ex4bListening, setEx4bListening] = useState<Record<string, string>>({});
  const [ex5Grammar, setEx5Grammar] = useState<Record<string, string>>({});
  const [ex6Pronunciation, setEx6Pronunciation] = useState<Record<string, string>>({});
  const [ex7Dialogue, setEx7Dialogue] = useState<Record<string, string>>({});
  const [ex8Notes, setEx8Notes] = useState<string>('');
  
  // 2B states
  const [ex1bVocab, setEx1bVocab] = useState<Record<string, string>>({});
  const [ex3Photos, setEx3Photos] = useState<Record<string, string>>({});
  const [ex5aPicture, setEx5aPicture] = useState<Record<string, string>>({});
  const [ex5bDialogue, setEx5bDialogue] = useState<Record<string, string>>({});
  const [ex6Grammar, setEx6Grammar] = useState<Record<string, string>>({});
  const [ex7aChoice, setEx7aChoice] = useState<Record<string, string>>({});
  const [ex8Conversations, setEx8Conversations] = useState<Record<string, string>>({});
  const [exRoomObjects, setExRoomObjects] = useState<string>('');

  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mySubmission, setMySubmission] = useState<SubmissionModel | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Audio recording states for Lesson 2B
  const [audioFile, setAudioFile] = useState<{ blob: Blob; mimeType: string } | null>(null);
  const [audioUploadSubmissionId, setAudioUploadSubmissionId] = useState<string | null>(null);
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null);
  const [retryingAudio, setRetryingAudio] = useState(false);

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
            if (ans.exercise_1b_nationalities) setNationalitiesInputs(ans.exercise_1b_nationalities);
            if (ans.exercise_2c_stress) setStressInputs(ans.exercise_2c_stress);
            if (ans.exercise_3_famous) setFamousInputs(ans.exercise_3_famous);
            if (ans.exercise_4a_photos) setPhotosInputs(ans.exercise_4a_photos);
            if (ans.exercise_4b_tf) setTfInputs(ans.exercise_4b_tf);
            if (ans.exercise_5a_grammar) setGrammar5aInputs1C(ans.exercise_5a_grammar);
            if (ans.exercise_6_texts) setTextsInputs(ans.exercise_6_texts);
            if (ans.exercise_7a_questions) setQuestionsInputs(ans.exercise_7a_questions);
            if (ans.exercise_8b_notes) setSpeakingNotes(ans.exercise_8b_notes);

            // 1D answers restore
            if (ans.exercise_1_location?.['1'] || ans.exercise_1_location) {
              setEx1Location(ans.exercise_1_location?.['1'] || ans.exercise_1_location);
            }
            if (ans.exercise_2_audio) setEx2Audio(ans.exercise_2_audio);
            if (ans.exercise_3a_order) setEx3aOrder(ans.exercise_3a_order);
            if (ans.exercise_3b_contact) setEx3bContact(ans.exercise_3b_contact);
            if (ans.exercise_4a_dialogue) setEx4aDialogue(ans.exercise_4a_dialogue);
            if (ans.exercise_5_personal) setEx5Personal(ans.exercise_5_personal);
            if (ans.exercise_6_partner) setEx6Partner(ans.exercise_6_partner);
            if (ans.exercise_1_wordsearch) setWordsearchFound(ans.exercise_1_wordsearch);
            if (ans.exercise_2a_order) setEx2aOrder(ans.exercise_2a_order);
            if (ans.exercise_2b_short) setEx2bShort(ans.exercise_2b_short);
            if (ans.exercise_3_be) setEx3Be(ans.exercise_3_be);
            if (ans.exercise_4_jobs) setEx4Jobs(ans.exercise_4_jobs);
            if (ans.exercise_5_is_isnt) setEx5IsIsnt(ans.exercise_5_is_isnt);
            if (ans.exercise_6_corrections) setEx6Corrections(ans.exercise_6_corrections);
            if (ans.exercise_7a_nationalities) setEx7aNationalities(ans.exercise_7a_nationalities);
            if (ans.exercise_7b_people) setEx7bPeople(ans.exercise_7b_people);
            if (ans.exercise_8_alternatives) setEx8Alternatives(ans.exercise_8_alternatives);
            if (ans.exercise_9_text) setEx9Text(ans.exercise_9_text);
            if (ans.reflect_scores) setReflectScores(ans.reflect_scores);

            // 2A answers restore
            if (ans.exercise_1_family_tree) setEx1FamilyTree(ans.exercise_1_family_tree);
            if (ans.exercise_2a_table) setEx2aTable(ans.exercise_2a_table);
            if (ans.exercise_3_sentences) setEx3Sentences(ans.exercise_3_sentences);
            if (ans.exercise_4a_match) setEx4aMatch(ans.exercise_4a_match);
            if (ans.exercise_4b_listening) setEx4bListening(ans.exercise_4b_listening);
            if (ans.exercise_5_grammar) setEx5Grammar(ans.exercise_5_grammar);
            if (ans.exercise_6_pronunciation) setEx6Pronunciation(ans.exercise_6_pronunciation);
            if (ans.exercise_7_dialogue) setEx7Dialogue(ans.exercise_7_dialogue);
            if (ans.exercise_8_notes) setEx8Notes(ans.exercise_8_notes);

            // 2B answers restore
            if (ans.exercise_1b_vocab) setEx1bVocab(ans.exercise_1b_vocab);
            if (ans.exercise_3_photos) setEx3Photos(ans.exercise_3_photos);
            if (ans.exercise_5a_picture) setEx5aPicture(ans.exercise_5a_picture);
            if (ans.exercise_5b_dialogue) setEx5bDialogue(ans.exercise_5b_dialogue);
            if (ans.exercise_6_grammar) setEx6Grammar(ans.exercise_6_grammar);
            if (ans.exercise_7a_choice) setEx7aChoice(ans.exercise_7a_choice);
            if (ans.exercise_8_conversations) setEx8Conversations(ans.exercise_8_conversations);
            if (ans.exercise_room_objects) setExRoomObjects(ans.exercise_room_objects);
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

  const uploadAudioFile = async (
    submissionId: string,
    audio: { blob: Blob; mimeType: string },
  ) => {
    const extension = audio.mimeType.includes('mp4')
      ? 'mp4'
      : audio.mimeType.includes('ogg')
      ? 'ogg'
      : 'webm';
    const file = new File([audio.blob], `exercise_8.${extension}`, {
      type: audio.mimeType,
    });
    const formData = new FormData();
    formData.append('file', file);

    // ВАЖНО: не задаем Content-Type вручную, позволяем Axios и браузеру выставить multipart/form-data с boundary
    await api.post(`/submissions/${submissionId}/audio/exercise_8`, formData, {
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
      setMySubmission((prev) =>
        prev
          ? {
              ...prev,
              audios: [
                ...(prev.audios?.filter((a) => a.exerciseKey !== 'exercise_8') || []),
                {
                  exerciseKey: 'exercise_8',
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

      const isLesson1C =
        lesson?.order === 3 ||
        lesson?.title?.includes('1C') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44';

      const isLesson1D =
        lesson?.order === 4 ||
        lesson?.title?.includes('1D') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55';

      const isLesson2A =
        lesson?.order === 5 ||
        lesson?.title?.includes('2A') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66';

      const isLesson2B =
        lesson?.order === 6 ||
        lesson?.title?.includes('2B') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77';

      const answersPayload = isLesson2B
        ? {
            exercise_1b_vocab: ex1bVocab,
            exercise_3_photos: ex3Photos,
            exercise_5a_picture: ex5aPicture,
            exercise_5b_dialogue: ex5bDialogue,
            exercise_6_grammar: ex6Grammar,
            exercise_7a_choice: ex7aChoice,
            exercise_8_conversations: ex8Conversations,
            exercise_room_objects: exRoomObjects,
          }
        : isLesson2A
        ? {
            exercise_1_family_tree: ex1FamilyTree,
            exercise_2a_table: ex2aTable,
            exercise_3_sentences: ex3Sentences,
            exercise_4a_match: ex4aMatch,
            exercise_4b_listening: ex4bListening,
            exercise_5_grammar: ex5Grammar,
            exercise_6_pronunciation: ex6Pronunciation,
            exercise_7_dialogue: ex7Dialogue,
            exercise_8_notes: ex8Notes,
          }
        : isLesson1D
        ? {
            exercise_1_location: { '1': ex1Location },
            exercise_2_audio: ex2Audio,
            exercise_3a_order: ex3aOrder,
            exercise_3b_contact: ex3bContact,
            exercise_4a_dialogue: ex4aDialogue,
            exercise_5_personal: ex5Personal,
            exercise_6_partner: ex6Partner,
            exercise_1_wordsearch: wordsearchFound,
            exercise_2a_order: ex2aOrder,
            exercise_2b_short: ex2bShort,
            exercise_3_be: ex3Be,
            exercise_4_jobs: ex4Jobs,
            exercise_5_is_isnt: ex5IsIsnt,
            exercise_6_corrections: ex6Corrections,
            exercise_7a_nationalities: ex7aNationalities,
            exercise_7b_people: ex7bPeople,
            exercise_8_alternatives: ex8Alternatives,
            exercise_9_text: ex9Text,
            reflect_scores: reflectScores,
          }
        : isLesson1C
        ? {
            exercise_1b_nationalities: nationalitiesInputs,
            exercise_2c_stress: stressInputs,
            exercise_3_famous: famousInputs,
            exercise_4a_photos: photosInputs,
            exercise_4b_tf: tfInputs,
            exercise_5a_grammar: grammar5aInputs1C,
            exercise_6_texts: textsInputs,
            exercise_7a_questions: questionsInputs,
            exercise_8b_notes: speakingNotes,
          }
        : isLesson1B
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

      const { score, id: submissionId } = response.data;
      setMySubmission(response.data);

      // Загрузка аудиофайла на созданный submissionId
      if (audioFile && submissionId) {
        setAudioUploadSubmissionId(submissionId);
        try {
          await uploadAudioFile(submissionId, audioFile);
          setMySubmission((prev) =>
            prev
              ? {
                  ...prev,
                  audios: [
                    ...(prev.audios?.filter((a) => a.exerciseKey !== 'exercise_8') || []),
                    {
                      exerciseKey: 'exercise_8',
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
    } catch (err: unknown) {
      console.error('Failed to submit results:', err);
      let msg = 'Failed to submit answers. Please try again.';
      
      const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosError.response) {
        if (axiosError.response.status === 401 || axiosError.response.status === 403) {
          msg = "Only students can submit";
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
  const isLesson1A = lesson?.order === 1 || lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
  const isLesson1B =
    lesson?.order === 2 ||
    lesson?.title?.includes('1B') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
  const isLesson1C =
    lesson?.order === 3 ||
    lesson?.title?.includes('1C') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44';
  const isLesson1D =
    lesson?.order === 4 ||
    lesson?.title?.includes('1D') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55';
  const isLesson2A =
    lesson?.order === 5 ||
    lesson?.title?.includes('2A') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66';
  const isLesson2B =
    lesson?.order === 6 ||
    lesson?.title?.includes('2B') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77';

  return (
      <div className={styles.pageContainer}>
        <div className={styles.bookCard}>

          <button
              onClick={() => router.push('/dashboard')}
              className={styles.backButton}
          >
            ← Back to Dashboard
          </button>

          {isLesson1A || isLesson1B || isLesson1C || isLesson1D || isLesson2A || isLesson2B ? (
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

              {isLesson1C && (
                <Lesson1CContent
                  lesson={lesson}
                  user={user}
                  nationalitiesInputs={nationalitiesInputs}
                  stressInputs={stressInputs}
                  famousInputs={famousInputs}
                  photosInputs={photosInputs}
                  tfInputs={tfInputs}
                  grammar5aInputs={grammar5aInputs1C}
                  textsInputs={textsInputs}
                  questionsInputs={questionsInputs}
                  speakingNotes={speakingNotes}
                  onNationalitiesChange={(id, val) => setNationalitiesInputs((prev) => ({ ...prev, [id]: val }))}
                  onStressChange={(id, val) => setStressInputs((prev) => ({ ...prev, [id]: val }))}
                  onFamousChange={(val) => setFamousInputs(val)}
                  onPhotosChange={(id, val) => setPhotosInputs((prev) => ({ ...prev, [id]: val }))}
                  onTfChange={(id, val) => setTfInputs((prev) => ({ ...prev, [id]: val }))}
                  onGrammar5aChange={(id, val) => setGrammar5aInputs1C((prev) => ({ ...prev, [id]: val }))}
                  onTextsChange={(id, val) => setTextsInputs((prev) => ({ ...prev, [id]: val }))}
                  onQuestionsChange={(id, val) => setQuestionsInputs((prev) => ({ ...prev, [id]: val }))}
                  onSpeakingNotesChange={(val) => setSpeakingNotes(val)}
                  readOnly={isLocked}
                  originalAnswers={mySubmission?.answers}
                  playAudio={playAudio}
                  playingAudio={playingAudio}
                />
              )}

              {isLesson1D && (
                <Lesson1DContent
                  lesson={lesson}
                  user={user}
                  readOnly={isLocked}
                  playAudio={playAudio}
                  playingAudio={playingAudio}
                  ex1Location={ex1Location}
                  ex2Audio={ex2Audio}
                  ex3aOrder={ex3aOrder}
                  ex3bContact={ex3bContact}
                  ex4aDialogue={ex4aDialogue}
                  ex5Personal={ex5Personal}
                  ex6Partner={ex6Partner}
                  wordsearchFound={wordsearchFound}
                  ex2aOrder={ex2aOrder}
                  ex2bShort={ex2bShort}
                  ex3Be={ex3Be}
                  ex4Jobs={ex4Jobs}
                  ex5IsIsnt={ex5IsIsnt}
                  ex6Corrections={ex6Corrections}
                  ex7aNationalities={ex7aNationalities}
                  ex7bPeople={ex7bPeople}
                  ex8Alternatives={ex8Alternatives}
                  ex9Text={ex9Text}
                  reflectScores={reflectScores}
                  onEx1LocationChange={(val) => setEx1Location(val)}
                  onEx2AudioChange={(fld, val) => setEx2Audio((prev) => ({ ...prev, [fld]: val }))}
                  onEx3aOrderChange={(id, val) => setEx3aOrder((prev) => ({ ...prev, [id]: val }))}
                  onEx3bContactChange={(id, val) => setEx3bContact((prev) => ({ ...prev, [id]: val }))}
                  onEx4aDialogueChange={(id, val) => setEx4aDialogue((prev) => ({ ...prev, [id]: val }))}
                  onEx5PersonalChange={(fld, val) => setEx5Personal((prev) => ({ ...prev, [fld]: val }))}
                  onEx6PartnerChange={(fld, val) => setEx6Partner((prev) => ({ ...prev, [fld]: val }))}
                  onWordsearchChange={(found) => setWordsearchFound(found)}
                  onEx2aOrderChange={(id, val) => setEx2aOrder((prev) => ({ ...prev, [id]: val }))}
                  onEx2bShortChange={(id, val) => setEx2bShort((prev) => ({ ...prev, [id]: val }))}
                  onEx3BeChange={(id, val) => setEx3Be((prev) => ({ ...prev, [id]: val }))}
                  onEx4JobsChange={(id, val) => setEx4Jobs((prev) => ({ ...prev, [id]: val }))}
                  onEx5IsIsntChange={(id, val) => setEx5IsIsnt((prev) => ({ ...prev, [id]: val }))}
                  onEx6CorrectionsChange={(id, val) => setEx6Corrections((prev) => ({ ...prev, [id]: val }))}
                  onEx7aNationalitiesChange={(id, val) => setEx7aNationalities((prev) => ({ ...prev, [id]: val }))}
                  onEx7bPeopleChange={(fld, val) => setEx7bPeople((prev) => ({ ...prev, [fld]: val }))}
                  onEx8AlternativesChange={(id, val) => setEx8Alternatives((prev) => ({ ...prev, [id]: val }))}
                  onEx9TextChange={(id, val) => setEx9Text((prev) => ({ ...prev, [id]: val }))}
                  onReflectChange={(id, val) => setReflectScores((prev) => ({ ...prev, [id]: val }))}
                  originalAnswers={mySubmission?.answers}
                />
              )}

              {isLesson2A && (
                <Lesson2AContent
                  lesson={lesson}
                  user={user}
                  readOnly={isLocked}
                  playAudio={playAudio}
                  playingAudio={playingAudio}
                  ex1FamilyTree={ex1FamilyTree}
                  ex2aTable={ex2aTable}
                  ex3Sentences={ex3Sentences}
                  ex4aMatch={ex4aMatch}
                  ex4bListening={ex4bListening}
                  ex5Grammar={ex5Grammar}
                  ex6Pronunciation={ex6Pronunciation}
                  ex7Dialogue={ex7Dialogue}
                  ex8Notes={ex8Notes}
                  onEx1FamilyTreeChange={(member, val) =>
                    setEx1FamilyTree((prev) => ({ ...prev, [member]: val }))
                  }
                  onEx2aTableChange={(id, val) =>
                    setEx2aTable((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx3SentencesChange={(id, val) =>
                    setEx3Sentences((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx4aMatchChange={(speaker, val) =>
                    setEx4aMatch((prev) => ({ ...prev, [speaker]: val }))
                  }
                  onEx4bListeningChange={(id, val) =>
                    setEx4bListening((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx5GrammarChange={(id, val) =>
                    setEx5Grammar((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx6PronunciationChange={(id, val) =>
                    setEx6Pronunciation((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx7DialogueChange={(id, val) =>
                    setEx7Dialogue((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx8NotesChange={(val) => setEx8Notes(val)}
                  originalAnswers={mySubmission?.answers}
                />
              )}

              {isLesson2B && (
                <Lesson2BContent
                  lesson={lesson}
                  user={user}
                  readOnly={isLocked}
                  playAudio={playAudio}
                  playingAudio={playingAudio}
                  ex1bVocab={ex1bVocab}
                  ex3Photos={ex3Photos}
                  ex5aPicture={ex5aPicture}
                  ex5bDialogue={ex5bDialogue}
                  ex6Grammar={ex6Grammar}
                  ex7aChoice={ex7aChoice}
                  ex8Conversations={ex8Conversations}
                  exRoomObjects={exRoomObjects}
                  onEx1bVocabChange={(id, val) =>
                    setEx1bVocab((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx3PhotosChange={(id, val) =>
                    setEx3Photos((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx5aPictureChange={(id, val) =>
                    setEx5aPicture((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx5bDialogueChange={(id, val) =>
                    setEx5bDialogue((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx6GrammarChange={(id, val) =>
                    setEx6Grammar((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx7aChoiceChange={(id, val) =>
                    setEx7aChoice((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx8ConversationsChange={(id, val) =>
                    setEx8Conversations((prev) => ({ ...prev, [id]: val }))
                  }
                  onExRoomObjectsChange={(val) => setExRoomObjects(val)}
                  onAudioBlobChange={(blob, mimeType) =>
                    setAudioFile(blob ? { blob, mimeType } : null)
                  }
                  originalAnswers={mySubmission?.answers}
                  submissionId={mySubmission?.id}
                  submittedAudios={mySubmission?.audios}
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