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
import Lesson2CContent from '@/components/Lesson2CContent';
import Lesson2DContent from '@/components/Lesson2DContent';
import Lesson3AContent from '@/components/Lesson3AContent';
import { SubmissionAudioMeta } from '@/components/AudioAnswerRecorder/SubmissionAudioPlayer';
import { LessonAnswerKey } from '@/lib/answerVerification';

interface LessonModel {
  id: string;
  title: string;
  order?: number;
  content?: string;
  theory?: string;
  answerKey?: LessonAnswerKey | null;
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

  // 2C states
  const [ex1aMatch, setEx1aMatch] = useState<Record<string, string>>({});
  const [ex2Choice, setEx2Choice] = useState<Record<string, string>>({});
  const [ex3aSequence, setEx3aSequence] = useState<string>('');
  const [ex4Profiles, setEx4Profiles] = useState<
    Record<string, { age?: string; from?: string; job?: string }>
  >({});
  const [ex5GrammarRules, setEx5GrammarRules] = useState<Record<string, string>>({});
  const [ex7Questions, setEx7Questions] = useState<Record<string, string>>({});
  const [ex8aFamily, setEx8aFamily] = useState<Record<string, string>>({});
  const [ex8bNotes, setEx8bNotes] = useState<string>('');
  const [ex10SpeakingNotes, setEx10SpeakingNotes] = useState<string>('');

  // 2D states
  const [ex1Objects2D, setEx1Objects2D] = useState<string>('');
  const [ex2aBought2D, setEx2aBought2D] = useState<string>('');
  const [ex2bPhrases2D, setEx2bPhrases2D] = useState<Record<string, boolean>>({});
  const [ex3aDialogue2D, setEx3aDialogue2D] = useState<Record<string, string>>({});
  const [ex4Notes2D, setEx4Notes2D] = useState<string>('');

  const [ex1Family2D, setEx1Family2D] = useState<Record<string, string>>({});
  const [ex2Possessive2D, setEx2Possessive2D] = useState<Record<string, string>>({});
  const [ex3Alternatives2D, setEx3Alternatives2D] = useState<Record<string, string>>({});
  const [ex4Mistakes2D, setEx4Mistakes2D] = useState<Record<string, string>>({});
  const [ex5Anagrams2D, setEx5Anagrams2D] = useState<Record<string, string>>({});
  const [ex6Demonstratives2D, setEx6Demonstratives2D] = useState<Record<string, string>>({});
  const [ex7aMath2D, setEx7aMath2D] = useState<Record<string, string>>({});
  const [ex7bAges2D, setEx7bAges2D] = useState<Record<string, string>>({});
  const [ex8aQuestions2D, setEx8aQuestions2D] = useState<Record<string, string>>({});
  const [ex8bPairNotes2D, setEx8bPairNotes2D] = useState<string>('');
  const [reflectScores2D, setReflectScores2D] = useState<Record<string, string | number>>({});

  // 3A states
  const [ex1aPlaces3A, setEx1aPlaces3A] = useState<Record<string, string>>({});
  const [ex2PairNotes3A, setEx2PairNotes3A] = useState<string>('');
  const [ex3Speakers3A, setEx3Speakers3A] = useState<Record<string, string>>({});
  const [ex4ListeningChoices3A, setEx4ListeningChoices3A] = useState<Record<string, string>>({});
  const [ex5GrammarGaps3A, setEx5GrammarGaps3A] = useState<Record<string, string>>({});
  const [ex7aAlternatives3A, setEx7aAlternatives3A] = useState<Record<string, string>>({});
  const [ex7bLists3A, setEx7bLists3A] = useState<Record<string, string>>({});
  const [ex8TextGaps3A, setEx8TextGaps3A] = useState<Record<string, string>>({});
  const [ex9Sentences3A, setEx9Sentences3A] = useState<Record<string, string>>({});
  const [ex11SpeakingNotes3A, setEx11SpeakingNotes3A] = useState<string>('');

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

            // 2C answers restore
            if (ans.exercise_1a_match) setEx1aMatch(ans.exercise_1a_match as Record<string, string>);
            if (ans.exercise_2_choice) setEx2Choice(ans.exercise_2_choice as Record<string, string>);
            if (ans.exercise_3a_sequence) setEx3aSequence(ans.exercise_3a_sequence as string);
            if (ans.exercise_4_profiles) setEx4Profiles(ans.exercise_4_profiles as Record<string, { age?: string; from?: string; job?: string }>);
            if (ans.exercise_5_grammar_rules) setEx5GrammarRules(ans.exercise_5_grammar_rules as Record<string, string>);
            if (ans.exercise_7_questions) setEx7Questions(ans.exercise_7_questions as Record<string, string>);
            if (ans.exercise_8a_family) setEx8aFamily(ans.exercise_8a_family as Record<string, string>);
            if (ans.exercise_8b_notes) setEx8bNotes(ans.exercise_8b_notes as string);
            if (ans.exercise_10_speaking_notes) setEx10SpeakingNotes(ans.exercise_10_speaking_notes as string);

            // 2D answers restore
            if (ans.exercise_1_objects) setEx1Objects2D(ans.exercise_1_objects as string);
            if (ans.exercise_2a_bought) setEx2aBought2D(ans.exercise_2a_bought as string);
            if (ans.exercise_2b_phrases) setEx2bPhrases2D(ans.exercise_2b_phrases as Record<string, boolean>);
            if (ans.exercise_3a_dialogue) setEx3aDialogue2D(ans.exercise_3a_dialogue as Record<string, string>);
            if (ans.exercise_4_notes) setEx4Notes2D(ans.exercise_4_notes as string);
            if (ans.exercise_1_family) setEx1Family2D(ans.exercise_1_family as Record<string, string>);
            if (ans.exercise_2_possessive) setEx2Possessive2D(ans.exercise_2_possessive as Record<string, string>);
            if (ans.exercise_3_alternatives) setEx3Alternatives2D(ans.exercise_3_alternatives as Record<string, string>);
            if (ans.exercise_4_mistakes) setEx4Mistakes2D(ans.exercise_4_mistakes as Record<string, string>);
            if (ans.exercise_5_anagrams) setEx5Anagrams2D(ans.exercise_5_anagrams as Record<string, string>);
            if (ans.exercise_6_demonstratives) setEx6Demonstratives2D(ans.exercise_6_demonstratives as Record<string, string>);
            if (ans.exercise_7a_math) setEx7aMath2D(ans.exercise_7a_math as Record<string, string>);
            if (ans.exercise_7b_ages) setEx7bAges2D(ans.exercise_7b_ages as Record<string, string>);
            if (ans.exercise_8a_questions) setEx8aQuestions2D(ans.exercise_8a_questions as Record<string, string>);
            if (ans.exercise_8b_pair_notes) setEx8bPairNotes2D(ans.exercise_8b_pair_notes as string);
            if (ans.reflect_scores) setReflectScores2D(ans.reflect_scores as Record<string, string | number>);

            // 3A answers restore
            if (ans.exercise_1a_places) setEx1aPlaces3A(ans.exercise_1a_places as Record<string, string>);
            if (ans.exercise_2_pair_notes) setEx2PairNotes3A(ans.exercise_2_pair_notes as string);
            if (ans.exercise_3_speakers) setEx3Speakers3A(ans.exercise_3_speakers as Record<string, string>);
            if (ans.exercise_4_choices) setEx4ListeningChoices3A(ans.exercise_4_choices as Record<string, string>);
            if (ans.exercise_5_grammar) setEx5GrammarGaps3A(ans.exercise_5_grammar as Record<string, string>);
            if (ans.exercise_7a_alternatives) setEx7aAlternatives3A(ans.exercise_7a_alternatives as Record<string, string>);
            if (ans.exercise_7b_lists) setEx7bLists3A(ans.exercise_7b_lists as Record<string, string>);
            if (ans.exercise_8_text) setEx8TextGaps3A(ans.exercise_8_text as Record<string, string>);
            if (ans.exercise_9_sentences) setEx9Sentences3A(ans.exercise_9_sentences as Record<string, string>);
            if (ans.exercise_11_speaking_notes) setEx11SpeakingNotes3A(ans.exercise_11_speaking_notes as string);
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

      const isLesson2C =
        lesson?.order === 7 ||
        lesson?.title?.includes('2C') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a88';

      const isLesson2D =
        lesson?.order === 8 ||
        lesson?.title?.includes('2D') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99';

      const isLesson3A =
        lesson?.order === 9 ||
        lesson?.title?.includes('3A') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b01';

      const answersPayload = isLesson3A
        ? {
            exercise_1a_places: ex1aPlaces3A,
            exercise_2_pair_notes: ex2PairNotes3A,
            exercise_3_speakers: ex3Speakers3A,
            exercise_4_choices: ex4ListeningChoices3A,
            exercise_5_grammar: ex5GrammarGaps3A,
            exercise_7a_alternatives: ex7aAlternatives3A,
            exercise_7b_lists: ex7bLists3A,
            exercise_8_text: ex8TextGaps3A,
            exercise_9_sentences: ex9Sentences3A,
            exercise_11_speaking_notes: ex11SpeakingNotes3A,
          }
        : isLesson2D
        ? {
            exercise_1_objects: ex1Objects2D,
            exercise_2a_bought: ex2aBought2D,
            exercise_2b_phrases: ex2bPhrases2D,
            exercise_3a_dialogue: ex3aDialogue2D,
            exercise_4_notes: ex4Notes2D,
            exercise_1_family: ex1Family2D,
            exercise_2_possessive: ex2Possessive2D,
            exercise_3_alternatives: ex3Alternatives2D,
            exercise_4_mistakes: ex4Mistakes2D,
            exercise_5_anagrams: ex5Anagrams2D,
            exercise_6_demonstratives: ex6Demonstratives2D,
            exercise_7a_math: ex7aMath2D,
            exercise_7b_ages: ex7bAges2D,
            exercise_8a_questions: ex8aQuestions2D,
            exercise_8b_pair_notes: ex8bPairNotes2D,
            reflect_scores: reflectScores2D,
          }
        : isLesson2C
        ? {
            exercise_1a_match: ex1aMatch,
            exercise_2_choice: ex2Choice,
            exercise_3a_sequence: ex3aSequence,
            exercise_4_profiles: ex4Profiles,
            exercise_5_grammar_rules: ex5GrammarRules,
            exercise_7_questions: ex7Questions,
            exercise_8a_family: ex8aFamily,
            exercise_8b_notes: ex8bNotes,
            exercise_10_speaking_notes: ex10SpeakingNotes,
          }
        : isLesson2B
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
  const isLesson2C =
    lesson?.order === 7 ||
    lesson?.title?.includes('2C') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a88';
  const isLesson2D =
    lesson?.order === 8 ||
    lesson?.title?.includes('2D') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99';
  const isLesson3A =
    lesson?.order === 9 ||
    lesson?.title?.includes('3A') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b01';

  const isTeacherReview = user?.role === 'teacher' || user?.role === 'admin';

  return (
      <div className={styles.pageContainer}>
        <div className={styles.bookCard}>

          <button
              onClick={() => router.push('/dashboard')}
              className={styles.backButton}
          >
            ← Back to Dashboard
          </button>

          {isLesson1A || isLesson1B || isLesson1C || isLesson1D || isLesson2A || isLesson2B || isLesson2C || isLesson2D || isLesson3A ? (
            <>
              {isLesson1A && (
                <LessonContent
                  lesson={lesson}
                  user={user}
                  isTeacherReview={isTeacherReview}
                  answerKey={lesson?.answerKey}
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
                  isTeacherReview={isTeacherReview}
                  answerKey={lesson?.answerKey}
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
                  isTeacherReview={isTeacherReview}
                  answerKey={lesson?.answerKey}
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
                  isTeacherReview={isTeacherReview}
                  answerKey={lesson?.answerKey}
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
                  isTeacherReview={isTeacherReview}
                  answerKey={lesson?.answerKey}
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
                  onEx7DialogueChange={(did, val) =>
                    setEx7Dialogue((prev) => ({ ...prev, [did]: val }))
                  }
                  onEx8NotesChange={(val) => setEx8Notes(val)}
                  originalAnswers={mySubmission?.answers}
                />
              )}

              {isLesson2B && (
                <Lesson2BContent
                  lesson={lesson}
                  user={user}
                  isTeacherReview={isTeacherReview}
                  answerKey={lesson?.answerKey}
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

              {isLesson2C && (
                <Lesson2CContent
                  lesson={lesson}
                  user={user}
                  isTeacherReview={isTeacherReview}
                  answerKey={lesson?.answerKey}
                  readOnly={isLocked}
                  playAudio={playAudio}
                  playingAudio={playingAudio}
                  ex1aMatch={ex1aMatch}
                  ex2Choice={ex2Choice}
                  ex3aSequence={ex3aSequence}
                  ex4Profiles={ex4Profiles}
                  ex5GrammarRules={ex5GrammarRules}
                  ex7Questions={ex7Questions}
                  ex8aFamily={ex8aFamily}
                  ex8bNotes={ex8bNotes}
                  ex10SpeakingNotes={ex10SpeakingNotes}
                  onEx1aMatchChange={(num, val) =>
                    setEx1aMatch((prev) => ({ ...prev, [num]: val }))
                  }
                  onEx2ChoiceChange={(item, val) =>
                    setEx2Choice((prev) => ({ ...prev, [item]: val }))
                  }
                  onEx3aSequenceChange={(val) => setEx3aSequence(val)}
                  onEx4ProfilesChange={(pkey, fld, val) =>
                    setEx4Profiles((prev) => ({
                      ...prev,
                      [pkey]: {
                        ...prev[pkey],
                        [fld]: val,
                      },
                    }))
                  }
                  onEx5GrammarRulesChange={(ruleId, val) =>
                    setEx5GrammarRules((prev) => ({ ...prev, [ruleId]: val }))
                  }
                  onEx7QuestionsChange={(qId, val) =>
                    setEx7Questions((prev) => ({ ...prev, [qId]: val }))
                  }
                  onEx8aFamilyChange={(idx, val) =>
                    setEx8aFamily((prev) => ({ ...prev, [idx]: val }))
                  }
                  onEx8bNotesChange={(val) => setEx8bNotes(val)}
                  onEx10SpeakingNotesChange={(val) => setEx10SpeakingNotes(val)}
                  originalAnswers={mySubmission?.answers}
                  submissionId={mySubmission?.id}
                />
              )}

              {isLesson2D && (
                <Lesson2DContent
                  lesson={lesson}
                  user={user}
                  isTeacherReview={isTeacherReview}
                  answerKey={lesson?.answerKey}
                  readOnly={isLocked}
                  playAudio={playAudio}
                  playingAudio={playingAudio}
                  ex1Objects={ex1Objects2D}
                  ex2aBought={ex2aBought2D}
                  ex2bPhrases={ex2bPhrases2D}
                  ex3aDialogue={ex3aDialogue2D}
                  ex4Notes={ex4Notes2D}
                  ex1Family={ex1Family2D}
                  ex2Possessive={ex2Possessive2D}
                  ex3Alternatives={ex3Alternatives2D}
                  ex4Mistakes={ex4Mistakes2D}
                  ex5Anagrams={ex5Anagrams2D}
                  ex6Demonstratives={ex6Demonstratives2D}
                  ex7aMath={ex7aMath2D}
                  ex7bAges={ex7bAges2D}
                  ex8aQuestions={ex8aQuestions2D}
                  ex8bPairNotes={ex8bPairNotes2D}
                  reflectScores={reflectScores2D}
                  onEx1ObjectsChange={(val) => setEx1Objects2D(val)}
                  onEx2aBoughtChange={(val) => setEx2aBought2D(val)}
                  onEx2bPhrasesChange={(phrase, checked) =>
                    setEx2bPhrases2D((prev) => ({ ...prev, [phrase]: checked }))
                  }
                  onEx3aDialogueChange={(gapId, val) =>
                    setEx3aDialogue2D((prev) => ({ ...prev, [gapId]: val }))
                  }
                  onEx4NotesChange={(val) => setEx4Notes2D(val)}
                  onEx1FamilyChange={(id, val) =>
                    setEx1Family2D((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx2PossessiveChange={(id, val) =>
                    setEx2Possessive2D((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx3AlternativesChange={(id, val) =>
                    setEx3Alternatives2D((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx4MistakesChange={(id, val) =>
                    setEx4Mistakes2D((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx5AnagramsChange={(id, val) =>
                    setEx5Anagrams2D((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx6DemonstrativesChange={(id, val) =>
                    setEx6Demonstratives2D((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx7aMathChange={(id, val) =>
                    setEx7aMath2D((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx7bAgesChange={(id, val) =>
                    setEx7bAges2D((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx8aQuestionsChange={(id, val) =>
                    setEx8aQuestions2D((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx8bPairNotesChange={(val) => setEx8bPairNotes2D(val)}
                  onReflectScoresChange={(id, val) =>
                    setReflectScores2D((prev) => ({ ...prev, [id]: val }))
                  }
                  originalAnswers={mySubmission?.answers}
                  submissionId={mySubmission?.id}
                />
              )}

              {isLesson3A && (
                <Lesson3AContent
                  lesson={lesson}
                  user={user}
                  isTeacherReview={isTeacherReview}
                  answerKey={lesson?.answerKey}
                  readOnly={isLocked}
                  playAudio={playAudio}
                  playingAudio={playingAudio}
                  ex1aPlaces={ex1aPlaces3A}
                  ex2PairNotes={ex2PairNotes3A}
                  ex3Speakers={ex3Speakers3A}
                  ex4ListeningChoices={ex4ListeningChoices3A}
                  ex5GrammarGaps={ex5GrammarGaps3A}
                  ex7aAlternatives={ex7aAlternatives3A}
                  ex7bLists={ex7bLists3A}
                  ex8TextGaps={ex8TextGaps3A}
                  ex9Sentences={ex9Sentences3A}
                  ex11SpeakingNotes={ex11SpeakingNotes3A}
                  onEx1aPlacesChange={(id, val) =>
                    setEx1aPlaces3A((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx2PairNotesChange={(val) => setEx2PairNotes3A(val)}
                  onEx3SpeakersChange={(sid, val) =>
                    setEx3Speakers3A((prev) => ({ ...prev, [sid]: val }))
                  }
                  onEx4ListeningChoicesChange={(qid, val) =>
                    setEx4ListeningChoices3A((prev) => ({ ...prev, [qid]: val }))
                  }
                  onEx5GrammarGapsChange={(gid, val) =>
                    setEx5GrammarGaps3A((prev) => ({ ...prev, [gid]: val }))
                  }
                  onEx7aAlternativesChange={(id, val) =>
                    setEx7aAlternatives3A((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx7bListsChange={(id, val) =>
                    setEx7bLists3A((prev) => ({ ...prev, [id]: val }))
                  }
                  onEx8TextGapsChange={(gid, val) =>
                    setEx8TextGaps3A((prev) => ({ ...prev, [gid]: val }))
                  }
                  onEx9SentencesChange={(num, val) =>
                    setEx9Sentences3A((prev) => ({ ...prev, [num]: val }))
                  }
                  onEx11SpeakingNotesChange={(val) => setEx11SpeakingNotes3A(val)}
                  originalAnswers={mySubmission?.answers}
                  submissionId={mySubmission?.id}
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