'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './submission.module.scss';
import LessonContent from '@/components/LessonContent';
import Lesson1BContent from '@/components/Lesson1BContent';
import Lesson1CContent from '@/components/Lesson1CContent';
import Lesson1DContent from '@/components/Lesson1DContent';
import Lesson2AContent from '@/components/Lesson2AContent';
import Lesson2BContent from '@/components/Lesson2BContent';
import { SubmissionAudioMeta } from '@/components/AudioAnswerRecorder/SubmissionAudioPlayer';

interface ProfilePairs {
  woman?: { name?: string; job?: string; city?: string; country?: string };
  man?: { name?: string; job?: string; city?: string; country?: string };
  [key: string]: unknown;
}

interface ConferenceCard {
  name: string;
  city: string;
  country: string;
  roles: string[];
}

type AnswerValue =
  | Record<string, string>
  | Record<number, string>
  | Record<string, string | number>
  | ProfilePairs
  | ConferenceCard
  | string
  | undefined;

interface SubmissionAnswers {
  [key: string]: AnswerValue;
  flagAnswers?: Record<number, string>;
  dialogInputs?: Record<string, string>;
  stressTableInputs?: Record<string, string>;
  grammarInputs?: Record<string, string>;
  dialogue7aInputs?: Record<string, string>;
  conferenceCard?: ConferenceCard;
  profilePairs?: ProfilePairs;
  text?: string;
  // Lesson 1B
  exercise_1b_jobs?: Record<string, string>;
  exercise_3_reading?: Record<string, string>;
  exercise_page9_profiles?: Record<string, string>;
  exercise_4a_reading?: Record<string, string>;
  exercise_5a_grammar?: Record<string, string>;
  exercise_6_dialogue?: Record<string, string>;
  exercise_7a_qa?: Record<string, string>;
  exercise_7b_profiles?: ProfilePairs;
  // Lesson 1C
  exercise_1b_nationalities?: Record<string, string>;
  exercise_2c_stress?: Record<string, string>;
  exercise_3_famous?: string;
  exercise_4a_photos?: Record<string, string>;
  exercise_4b_tf?: Record<string, string>;
  exercise_6_texts?: Record<string, string>;
  exercise_7a_questions?: Record<string, string>;
  exercise_8b_notes?: string;
  // Lesson 2A
  exercise_1_family_tree?: Record<string, string>;
  exercise_2a_table?: Record<string, string>;
  exercise_3_sentences?: Record<string, string>;
  exercise_4a_match?: Record<string, string>;
  exercise_4b_listening?: Record<string, string>;
  exercise_5_grammar?: Record<string, string>;
  exercise_6_pronunciation?: Record<string, string>;
  exercise_7_dialogue?: Record<string, string>;
  exercise_8_notes?: string;
  // Lesson 2B
  exercise_1b_vocab?: Record<string, string>;
  exercise_3_photos?: Record<string, string>;
  exercise_5a_picture?: string;
  exercise_5b_dialogue?: Record<string, string>;
  exercise_6_grammar?: Record<string, string>;
  exercise_7a_choice?: Record<string, string>;
  exercise_8_conversations?: Record<string, string>;
}

interface SubmissionModel {
  id: string;
  score?: number;
  grade?: number;
  status: string;
  tutorComment?: string;
  createdAt: string;
  student?: { id?: string; email?: string; name?: string; role?: string };
  lesson?: { id?: string; title?: string; order?: number };
  assignment?: {
    id?: string;
    title?: string;
    attachmentUrl?: string;
    lesson?: { id?: string; title?: string; order?: number };
  };
  answers?: SubmissionAnswers;
  reviewedAnswers?: SubmissionAnswers;
  audios?: SubmissionAudioMeta[];
  [key: string]: unknown;
}

interface UserModel {
  id: string;
  email: string;
  role: string;
  name?: string;
  [key: string]: unknown;
}

const getMap = (val: AnswerValue): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const getNumMap = (val: AnswerValue): Record<number, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<number, string>;
  }
  return {};
};

const getScoresMap = (val: AnswerValue): Record<string, string | number> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string | number>;
  }
  return {};
};

const getStr = (val: AnswerValue): string => {
  if (typeof val === 'string') return val;
  return '';
};

export default function SubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [submission, setSubmission] = useState<SubmissionModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const [grade, setGrade] = useState<number | string>('');
  const [tutorComment, setTutorComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);

        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              // ignore
            }
          }
        }

        const res = await api.get(`/submissions/${id}`);
        const data = res.data;
        setSubmission(data);
        
        const answers: SubmissionAnswers = data.reviewedAnswers || data.answers || {};
        setFlagAnswers(getNumMap(answers.flagAnswers));
        setDialogInputs(getMap(answers.dialogInputs));
        setStressTableInputs(getMap(answers.stressTableInputs));
        setGrammarInputs(getMap(answers.grammarInputs));
        setDialogue7aInputs(getMap(answers.dialogue7aInputs));
        setConferenceCard((answers.conferenceCard as ConferenceCard) || { name: '', city: '', country: '', roles: [] });
        setJobsInputs(getMap(answers.exercise_1b_jobs || answers.jobsInputs));
        setReadingInputs(getMap(answers.exercise_3_reading || answers.readingInputs));
        setPage9Profiles(getMap(answers.exercise_page9_profiles));
        setEx4aAnswers(getMap(answers.exercise_4a_reading));
        setGrammar5aInputs(getMap(answers.exercise_5a_grammar));
        setEx6Answers(getMap(answers.exercise_6_dialogue));
        setEx7aAnswers(getMap(answers.exercise_7a_qa));
        setProfilePairs((answers.exercise_7b_profiles as ProfilePairs) || {});
        setNationalitiesInputs(getMap(answers.exercise_1b_nationalities));
        setStressInputs(getMap(answers.exercise_2c_stress));
        setFamousInputs(getStr(answers.exercise_3_famous));
        setPhotosInputs(getMap(answers.exercise_4a_photos));
        setTfInputs(getMap(answers.exercise_4b_tf));
        setGrammar5aInputs1C(getMap(answers.exercise_5a_grammar));
        setTextsInputs(getMap(answers.exercise_6_texts));
        setQuestionsInputs(getMap(answers.exercise_7a_questions));
        setSpeakingNotes(getStr(answers.exercise_8b_notes));

        // 1D answers restore
        const loc = answers.exercise_1_location;
        if (loc && typeof loc === 'object' && '1' in loc) {
          setEx1Location(String((loc as Record<string, string>)['1']));
        } else if (typeof loc === 'string') {
          setEx1Location(loc);
        }
        if (answers.exercise_2_audio) setEx2Audio(getMap(answers.exercise_2_audio));
        if (answers.exercise_3a_order) setEx3aOrder(getMap(answers.exercise_3a_order));
        if (answers.exercise_3b_contact) setEx3bContact(getMap(answers.exercise_3b_contact));
        if (answers.exercise_4a_dialogue) setEx4aDialogue(getMap(answers.exercise_4a_dialogue));
        if (answers.exercise_5_personal) setEx5Personal(getMap(answers.exercise_5_personal));
        if (answers.exercise_6_partner) setEx6Partner(getMap(answers.exercise_6_partner));
        if (answers.exercise_1_wordsearch) setWordsearchFound(getMap(answers.exercise_1_wordsearch));
        if (answers.exercise_2a_order) setEx2aOrder(getMap(answers.exercise_2a_order));
        if (answers.exercise_2b_short) setEx2bShort(getMap(answers.exercise_2b_short));
        if (answers.exercise_3_be) setEx3Be(getMap(answers.exercise_3_be));
        if (answers.exercise_4_jobs) setEx4Jobs(getMap(answers.exercise_4_jobs));
        if (answers.exercise_5_is_isnt) setEx5IsIsnt(getMap(answers.exercise_5_is_isnt));
        if (answers.exercise_6_corrections) setEx6Corrections(getMap(answers.exercise_6_corrections));
        if (answers.exercise_7a_nationalities) setEx7aNationalities(getMap(answers.exercise_7a_nationalities));
        if (answers.exercise_7b_people) setEx7bPeople(getMap(answers.exercise_7b_people));
        if (answers.exercise_8_alternatives) setEx8Alternatives(getMap(answers.exercise_8_alternatives));
        if (answers.exercise_9_text) setEx9Text(getMap(answers.exercise_9_text));
        if (answers.reflect_scores) setReflectScores(getScoresMap(answers.reflect_scores));

        // 2A answers restore
        if (answers.exercise_1_family_tree) setEx1FamilyTree(getMap(answers.exercise_1_family_tree));
        if (answers.exercise_2a_table) setEx2aTable(getMap(answers.exercise_2a_table));
        if (answers.exercise_3_sentences) setEx3Sentences(getMap(answers.exercise_3_sentences));
        if (answers.exercise_4a_match) setEx4aMatch(getMap(answers.exercise_4a_match));
        if (answers.exercise_4b_listening) setEx4bListening(getMap(answers.exercise_4b_listening));
        if (answers.exercise_5_grammar) setEx5Grammar(getMap(answers.exercise_5_grammar));
        if (answers.exercise_6_pronunciation) setEx6Pronunciation(getMap(answers.exercise_6_pronunciation));
        if (answers.exercise_7_dialogue) setEx7Dialogue(getMap(answers.exercise_7_dialogue));
        if (answers.exercise_8_notes) setEx8Notes(getStr(answers.exercise_8_notes));

        // 2B answers restore
        if (answers.exercise_1b_vocab) setEx1bVocab(getMap(answers.exercise_1b_vocab));
        if (answers.exercise_3_photos) setEx3Photos(getMap(answers.exercise_3_photos));
        if (answers.exercise_5a_picture) setEx5aPicture(getMap(answers.exercise_5a_picture));
        if (answers.exercise_5b_dialogue) setEx5bDialogue(getMap(answers.exercise_5b_dialogue));
        if (answers.exercise_6_grammar) setEx6Grammar(getMap(answers.exercise_6_grammar));
        if (answers.exercise_7a_choice) setEx7aChoice(getMap(answers.exercise_7a_choice));
        if (answers.exercise_8_conversations) setEx8Conversations(getMap(answers.exercise_8_conversations));
        if (answers.exercise_room_objects) setExRoomObjects(getStr(answers.exercise_room_objects));
        
        if (data.grade !== null) setGrade(data.grade);
        if (data.tutorComment) setTutorComment(data.tutorComment);
      } catch (err: unknown) {
        console.error('Failed to load submission:', err);
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Failed to load submission details.');
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

      const payloadAnswers = isLesson2B
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

      await api.patch(`/submissions/${id}/review`, {
        answers: payloadAnswers,
        grade: grade !== '' ? Number(grade) : undefined,
        tutorComment,
        status: targetStatus,
      });
      setSuccess(targetStatus === 'needs_revision' ? 'Returned for revision!' : 'Graded successfully!');
      // Refresh data
      const res = await api.get(`/submissions/${id}`);
      setSubmission((prev) => ({
        ...res.data,
        audios: res.data.audios ?? prev?.audios ?? [],
      }));
    } catch (err: unknown) {
      console.error('Failed to save review:', err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to save review.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!submission) return;
    const original: SubmissionAnswers = submission.answers || {};
    setFlagAnswers(getNumMap(original.flagAnswers));
    setDialogInputs(getMap(original.dialogInputs));
    setStressTableInputs(getMap(original.stressTableInputs));
    setGrammarInputs(getMap(original.grammarInputs));
    setDialogue7aInputs(getMap(original.dialogue7aInputs));
    setConferenceCard((original.conferenceCard as ConferenceCard) || { name: '', city: '', country: '', roles: [] });
    setJobsInputs(getMap(original.exercise_1b_jobs || original.jobsInputs));
    setReadingInputs(getMap(original.exercise_3_reading || original.readingInputs));
    setPage9Profiles(getMap(original.exercise_page9_profiles));
    setEx4aAnswers(getMap(original.exercise_4a_reading));
    setGrammar5aInputs(getMap(original.exercise_5a_grammar));
    setEx6Answers(getMap(original.exercise_6_dialogue));
    setEx7aAnswers(getMap(original.exercise_7a_qa));
    setProfilePairs((original.exercise_7b_profiles as ProfilePairs) || {});
    setNationalitiesInputs(getMap(original.exercise_1b_nationalities));
    setStressInputs(getMap(original.exercise_2c_stress));
    setFamousInputs(getStr(original.exercise_3_famous));
    setPhotosInputs(getMap(original.exercise_4a_photos));
    setTfInputs(getMap(original.exercise_4b_tf));
    setGrammar5aInputs1C(getMap(original.exercise_5a_grammar));
    setTextsInputs(getMap(original.exercise_6_texts));
    setQuestionsInputs(getMap(original.exercise_7a_questions));
    setSpeakingNotes(getStr(original.exercise_8b_notes));

    // 1D reset
    const loc = original.exercise_1_location;
    if (loc && typeof loc === 'object' && '1' in loc) {
      setEx1Location(String((loc as Record<string, string>)['1']));
    } else if (typeof loc === 'string') {
      setEx1Location(loc);
    }
    setEx2Audio(getMap(original.exercise_2_audio));
    setEx3aOrder(getMap(original.exercise_3a_order));
    setEx3bContact(getMap(original.exercise_3b_contact));
    setEx4aDialogue(getMap(original.exercise_4a_dialogue));
    setEx5Personal(getMap(original.exercise_5_personal));
    setEx6Partner(getMap(original.exercise_6_partner));
    setWordsearchFound(getMap(original.exercise_1_wordsearch));
    setEx2aOrder(getMap(original.exercise_2a_order));
    setEx2bShort(getMap(original.exercise_2b_short));
    setEx3Be(getMap(original.exercise_3_be));
    setEx4Jobs(getMap(original.exercise_4_jobs));
    setEx5IsIsnt(getMap(original.exercise_5_is_isnt));
    setEx6Corrections(getMap(original.exercise_6_corrections));
    setEx7aNationalities(getMap(original.exercise_7a_nationalities));
    setEx7bPeople(getMap(original.exercise_7b_people));
    setEx8Alternatives(getMap(original.exercise_8_alternatives));
    setEx9Text(getMap(original.exercise_9_text));
    setReflectScores(getScoresMap(original.reflect_scores));

    // 2A reset
    setEx1FamilyTree(getMap(original.exercise_1_family_tree));
    setEx2aTable(getMap(original.exercise_2a_table));
    setEx3Sentences(getMap(original.exercise_3_sentences));
    setEx4aMatch(getMap(original.exercise_4a_match));
    setEx4bListening(getMap(original.exercise_4b_listening));
    setEx5Grammar(getMap(original.exercise_5_grammar));
    setEx6Pronunciation(getMap(original.exercise_6_pronunciation));
    setEx7Dialogue(getMap(original.exercise_7_dialogue));
    setEx8Notes(getStr(original.exercise_8_notes));

    // 2B reset
    setEx1bVocab(getMap(original.exercise_1b_vocab));
    setEx3Photos(getMap(original.exercise_3_photos));
    setEx5aPicture(getMap(original.exercise_5a_picture));
    setEx5bDialogue(getMap(original.exercise_5b_dialogue));
    setEx6Grammar(getMap(original.exercise_6_grammar));
    setEx7aChoice(getMap(original.exercise_7a_choice));
    setEx8Conversations(getMap(original.exercise_8_conversations));
    setExRoomObjects(getStr(original.exercise_room_objects));

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
            <p><span>Status:</span> <span className={`${styles.scoreBadge} ${submission.status === 'graded' ? styles.statusGraded : submission.status === 'needs_revision' ? styles.statusRevision : styles.statusPending}`}>{submission.status}</span></p>
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
                  rel="noopener noreferrer"
                  style={{ color: '#0284c7', textDecoration: 'underline' }}
                >
                  {submission.assignment.attachmentUrl} ↗
                </a>
              </div>
            )}
          </div>
        ) : isLesson1B ? (
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
        ) : isLesson1C ? (
          <Lesson1CContent
            lesson={lesson}
            user={submission.student}
            nationalitiesInputs={nationalitiesInputs}
            stressInputs={stressInputs}
            famousInputs={famousInputs}
            photosInputs={photosInputs}
            tfInputs={tfInputs}
            grammar5aInputs={grammar5aInputs1C}
            textsInputs={textsInputs}
            questionsInputs={questionsInputs}
            speakingNotes={speakingNotes}
            onNationalitiesChange={(nid, val) => setNationalitiesInputs((prev) => ({ ...prev, [nid]: val }))}
            onStressChange={(sid, val) => setStressInputs((prev) => ({ ...prev, [sid]: val }))}
            onFamousChange={(val) => setFamousInputs(val)}
            onPhotosChange={(pid, val) => setPhotosInputs((prev) => ({ ...prev, [pid]: val }))}
            onTfChange={(tid, val) => setTfInputs((prev) => ({ ...prev, [tid]: val }))}
            onGrammar5aChange={(gid, val) => setGrammar5aInputs1C((prev) => ({ ...prev, [gid]: val }))}
            onTextsChange={(tid, val) => setTextsInputs((prev) => ({ ...prev, [tid]: val }))}
            onQuestionsChange={(qid, val) => setQuestionsInputs((prev) => ({ ...prev, [qid]: val }))}
            onSpeakingNotesChange={(val) => setSpeakingNotes(val)}
            readOnly={!isTutor}
            originalAnswers={submission.answers}
            playAudio={playAudio}
            playingAudio={playingAudio}
          />
        ) : isLesson1D ? (
          <Lesson1DContent
            lesson={lesson}
            user={submission.student}
            readOnly={!isTutor}
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
            originalAnswers={submission.answers}
          />
        ) : isLesson2B ? (
          <Lesson2BContent
            lesson={lesson}
            user={submission.student}
            readOnly={!isTutor}
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
            onEx1bVocabChange={(vid, val) =>
              setEx1bVocab((prev) => ({ ...prev, [vid]: val }))
            }
            onEx3PhotosChange={(pid, val) =>
              setEx3Photos((prev) => ({ ...prev, [pid]: val }))
            }
            onEx5aPictureChange={(aid, val) =>
              setEx5aPicture((prev) => ({ ...prev, [aid]: val }))
            }
            onEx5bDialogueChange={(did, val) =>
              setEx5bDialogue((prev) => ({ ...prev, [did]: val }))
            }
            onEx6GrammarChange={(gid, val) =>
              setEx6Grammar((prev) => ({ ...prev, [gid]: val }))
            }
            onEx7aChoiceChange={(cid, val) =>
              setEx7aChoice((prev) => ({ ...prev, [cid]: val }))
            }
            onEx8ConversationsChange={(cid, val) =>
              setEx8Conversations((prev) => ({ ...prev, [cid]: val }))
            }
            onExRoomObjectsChange={(val) => setExRoomObjects(val)}
            originalAnswers={submission.answers}
            submissionId={submission.id}
            submittedAudios={submission.audios}
          />
        ) : isLesson2A ? (
          <Lesson2AContent
            lesson={lesson}
            user={submission.student}
            readOnly={!isTutor}
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
            onEx2aTableChange={(tid, val) =>
              setEx2aTable((prev) => ({ ...prev, [tid]: val }))
            }
            onEx3SentencesChange={(sid, val) =>
              setEx3Sentences((prev) => ({ ...prev, [sid]: val }))
            }
            onEx4aMatchChange={(speaker, val) =>
              setEx4aMatch((prev) => ({ ...prev, [speaker]: val }))
            }
            onEx4bListeningChange={(lid, val) =>
              setEx4bListening((prev) => ({ ...prev, [lid]: val }))
            }
            onEx5GrammarChange={(gid, val) =>
              setEx5Grammar((prev) => ({ ...prev, [gid]: val }))
            }
            onEx6PronunciationChange={(pid, val) =>
              setEx6Pronunciation((prev) => ({ ...prev, [pid]: val }))
            }
            onEx7DialogueChange={(did, val) =>
              setEx7Dialogue((prev) => ({ ...prev, [did]: val }))
            }
            onEx8NotesChange={(val) => setEx8Notes(val)}
            originalAnswers={submission.answers}
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
