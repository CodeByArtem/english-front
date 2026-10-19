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
import Lesson2CContent from '@/components/Lesson2CContent';
import Lesson2DContent from '@/components/Lesson2DContent';
import Lesson3AContent from '@/components/Lesson3AContent';
import { SubmissionAudioMeta } from '@/components/AudioAnswerRecorder/SubmissionAudioPlayer';
import { LessonAnswerKey } from '@/lib/answerVerification';

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
  // Lesson 2C
  exercise_1a_match?: Record<string, string>;
  exercise_2_choice?: Record<string, string>;
  exercise_3a_sequence?: string;
  exercise_4_profiles?: Record<string, { age?: string; from?: string; job?: string }>;
  exercise_5_grammar_rules?: Record<string, string>;
  exercise_7_questions?: Record<string, string>;
  exercise_8a_family?: Record<string, string>;
  exercise_10_speaking_notes?: string;
}

interface SubmissionModel {
  id: string;
  score?: number;
  grade?: number;
  status: string;
  tutorComment?: string;
  createdAt: string;
  student?: { id?: string; email?: string; name?: string; role?: string };
  lesson?: { id?: string; title?: string; order?: number; answerKey?: LessonAnswerKey | null };
  assignment?: {
    id?: string;
    title?: string;
    attachmentUrl?: string;
    lesson?: { id?: string; title?: string; order?: number; answerKey?: LessonAnswerKey | null };
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
        
        let rawAnswers = data.reviewedAnswers || data.answers || {};
        if (typeof rawAnswers === 'string') {
          try {
            rawAnswers = JSON.parse(rawAnswers);
          } catch {
            rawAnswers = {};
          }
        }
        const answers: SubmissionAnswers = rawAnswers;
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

        // 2C answers restore
        if (answers.exercise_1a_match) setEx1aMatch(getMap(answers.exercise_1a_match));
        if (answers.exercise_2_choice) setEx2Choice(getMap(answers.exercise_2_choice));
        if (answers.exercise_3a_sequence) setEx3aSequence(getStr(answers.exercise_3a_sequence));
        if (answers.exercise_4_profiles) setEx4Profiles(answers.exercise_4_profiles as Record<string, { age?: string; from?: string; job?: string }>);
        if (answers.exercise_5_grammar_rules) setEx5GrammarRules(getMap(answers.exercise_5_grammar_rules));
        if (answers.exercise_7_questions) setEx7Questions(getMap(answers.exercise_7_questions));
        if (answers.exercise_8a_family) setEx8aFamily(getMap(answers.exercise_8a_family));
        if (answers.exercise_8b_notes) setEx8bNotes(getStr(answers.exercise_8b_notes));
        if (answers.exercise_10_speaking_notes) setEx10SpeakingNotes(getStr(answers.exercise_10_speaking_notes));

        // 2D answers restore
        if (answers.exercise_1_objects) setEx1Objects2D(getStr(answers.exercise_1_objects));
        if (answers.exercise_2a_bought) setEx2aBought2D(getStr(answers.exercise_2a_bought));
        if (answers.exercise_2b_phrases && typeof answers.exercise_2b_phrases === 'object') {
          setEx2bPhrases2D(answers.exercise_2b_phrases as Record<string, boolean>);
        }
        if (answers.exercise_3a_dialogue) setEx3aDialogue2D(getMap(answers.exercise_3a_dialogue));
        if (answers.exercise_4_notes) setEx4Notes2D(getStr(answers.exercise_4_notes));
        if (answers.exercise_1_family) setEx1Family2D(getMap(answers.exercise_1_family));
        if (answers.exercise_2_possessive) setEx2Possessive2D(getMap(answers.exercise_2_possessive));
        if (answers.exercise_3_alternatives) setEx3Alternatives2D(getMap(answers.exercise_3_alternatives));
        if (answers.exercise_4_mistakes) setEx4Mistakes2D(getMap(answers.exercise_4_mistakes));
        if (answers.exercise_5_anagrams) setEx5Anagrams2D(getMap(answers.exercise_5_anagrams));
        if (answers.exercise_6_demonstratives) setEx6Demonstratives2D(getMap(answers.exercise_6_demonstratives));
        if (answers.exercise_7a_math) setEx7aMath2D(getMap(answers.exercise_7a_math));
        if (answers.exercise_7b_ages) setEx7bAges2D(getMap(answers.exercise_7b_ages));
        if (answers.exercise_8a_questions) setEx8aQuestions2D(getMap(answers.exercise_8a_questions));
        if (answers.exercise_8b_pair_notes) setEx8bPairNotes2D(getStr(answers.exercise_8b_pair_notes));
        if (answers.reflect_scores) setReflectScores2D(getScoresMap(answers.reflect_scores));

        // 3A answers restore
        if (answers.exercise_1a_places) setEx1aPlaces3A(getMap(answers.exercise_1a_places));
        if (answers.exercise_2_pair_notes) setEx2PairNotes3A(getStr(answers.exercise_2_pair_notes));
        if (answers.exercise_3_speakers) setEx3Speakers3A(getMap(answers.exercise_3_speakers));
        if (answers.exercise_4_choices) setEx4ListeningChoices3A(getMap(answers.exercise_4_choices));
        if (answers.exercise_5_grammar) setEx5GrammarGaps3A(getMap(answers.exercise_5_grammar));
        if (answers.exercise_7a_alternatives) setEx7aAlternatives3A(getMap(answers.exercise_7a_alternatives));
        if (answers.exercise_7b_lists) setEx7bLists3A(getMap(answers.exercise_7b_lists));
        if (answers.exercise_8_text) setEx8TextGaps3A(getMap(answers.exercise_8_text));
        if (answers.exercise_9_sentences) setEx9Sentences3A(getMap(answers.exercise_9_sentences));
        if (answers.exercise_11_speaking_notes) setEx11SpeakingNotes3A(getStr(answers.exercise_11_speaking_notes));
        
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

      const payloadAnswers = isLesson3A
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

    // 2C reset
    setEx1aMatch(getMap(original.exercise_1a_match));
    setEx2Choice(getMap(original.exercise_2_choice));
    setEx3aSequence(getStr(original.exercise_3a_sequence));
    setEx4Profiles((original.exercise_4_profiles as Record<string, { age?: string; from?: string; job?: string }>) || {});
    setEx5GrammarRules(getMap(original.exercise_5_grammar_rules));
    setEx7Questions(getMap(original.exercise_7_questions));
    setEx8aFamily(getMap(original.exercise_8a_family));
    setEx8bNotes(getStr(original.exercise_8b_notes));
    setEx10SpeakingNotes(getStr(original.exercise_10_speaking_notes));

    // 2D reset
    setEx1Objects2D(getStr(original.exercise_1_objects));
    setEx2aBought2D(getStr(original.exercise_2a_bought));
    if (original.exercise_2b_phrases && typeof original.exercise_2b_phrases === 'object') {
      setEx2bPhrases2D(original.exercise_2b_phrases as Record<string, boolean>);
    } else {
      setEx2bPhrases2D({});
    }
    setEx3aDialogue2D(getMap(original.exercise_3a_dialogue));
    setEx4Notes2D(getStr(original.exercise_4_notes));
    setEx1Family2D(getMap(original.exercise_1_family));
    setEx2Possessive2D(getMap(original.exercise_2_possessive));
    setEx3Alternatives2D(getMap(original.exercise_3_alternatives));
    setEx4Mistakes2D(getMap(original.exercise_4_mistakes));
    setEx5Anagrams2D(getMap(original.exercise_5_anagrams));
    setEx6Demonstratives2D(getMap(original.exercise_6_demonstratives));
    setEx7aMath2D(getMap(original.exercise_7a_math));
    setEx7bAges2D(getMap(original.exercise_7b_ages));
    setEx8aQuestions2D(getMap(original.exercise_8a_questions));
    setEx8bPairNotes2D(getStr(original.exercise_8b_pair_notes));
    setReflectScores2D(getScoresMap(original.reflect_scores));

    // 3A reset
    setEx1aPlaces3A(getMap(original.exercise_1a_places));
    setEx2PairNotes3A(getStr(original.exercise_2_pair_notes));
    setEx3Speakers3A(getMap(original.exercise_3_speakers));
    setEx4ListeningChoices3A(getMap(original.exercise_4_choices));
    setEx5GrammarGaps3A(getMap(original.exercise_5_grammar));
    setEx7aAlternatives3A(getMap(original.exercise_7a_alternatives));
    setEx7bLists3A(getMap(original.exercise_7b_lists));
    setEx8TextGaps3A(getMap(original.exercise_8_text));
    setEx9Sentences3A(getMap(original.exercise_9_sentences));
    setEx11SpeakingNotes3A(getStr(original.exercise_11_speaking_notes));

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
            isTeacherReview={isTutor}
            answerKey={lesson?.answerKey}
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
            isTeacherReview={isTutor}
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
            isTeacherReview={isTutor}
            answerKey={lesson?.answerKey}
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
        ) : isLesson3A ? (
          <Lesson3AContent
            lesson={lesson}
            user={submission.student}
            isTeacherReview={isTutor}
            answerKey={lesson?.answerKey}
            readOnly={!isTutor}
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
            originalAnswers={submission.answers}
            submissionId={submission.id}
          />
        ) : isLesson2D ? (
          <Lesson2DContent
            lesson={lesson}
            user={submission.student}
            isTeacherReview={isTutor}
            answerKey={lesson?.answerKey}
            readOnly={!isTutor}
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
            originalAnswers={submission.answers}
            submissionId={submission.id}
          />
        ) : isLesson2C ? (
          <Lesson2CContent
            lesson={lesson}
            user={submission.student}
            isTeacherReview={isTutor}
            answerKey={lesson?.answerKey}
            readOnly={!isTutor}
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
            originalAnswers={submission.answers}
            submissionId={submission.id}
          />
        ) : isLesson2B ? (
          <Lesson2BContent
            lesson={lesson}
            user={submission.student}
            isTeacherReview={isTutor}
            answerKey={lesson?.answerKey}
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
            isTeacherReview={isTutor}
            answerKey={lesson?.answerKey}
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
            isTeacherReview={isTutor}
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
