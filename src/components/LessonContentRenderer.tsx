'use client';

import React from 'react';
import { useLessonContext } from '@/context/LessonContext';
import LessonContent from './LessonContent';
import Lesson1BContent from './Lesson1BContent';
import Lesson1CContent from './Lesson1CContent';
import Lesson1DContent from './Lesson1DContent';
import Lesson2AContent from './Lesson2AContent';
import Lesson2BContent from './Lesson2BContent';
import Lesson2CContent from './Lesson2CContent';
import Lesson2DContent from './Lesson2DContent';
import Lesson3AContent from './Lesson3AContent';
import Lesson3BContent from './Lesson3BContent';
import Lesson3CContent from './Lesson3CContent';
import Lesson3DContent from './Lesson3DContent';
import Lesson4AContent from './Lesson4AContent';
import Lesson4BContent from './Lesson4BContent';
import Lesson4CContent from './Lesson4CContent';
import Lesson4DContent from './Lesson4DContent';
import Lesson5AContent from './Lesson5AContent';
import Lesson5BContent from './Lesson5BContent';
import Lesson5CContent from './Lesson5CContent';
import Lesson5DContent from './Lesson5DContent';
import Lesson6AContent from './Lesson6AContent';
import Lesson6BContent from './Lesson6BContent';
import Lesson6CContent from './Lesson6CContent';
import Lesson6DContent from './Lesson6DContent';
import Lesson7AContent from './Lesson7AContent';
import Lesson7BContent from './Lesson7BContent';
import Lesson7CContent from './Lesson7CContent';
import Lesson7DContent from './Lesson7DContent';

export interface LessonContentRendererProps {
  user?: Record<string, unknown> | null;
  audioBlob?: Blob | null;
  onAudioBlobChange?: (blob: Blob | null, mimeType: string, exerciseKey?: string) => void;
}

export function getLessonType(lesson?: { order?: number; title?: string; id?: string } | null): string {
  if (!lesson) return '1A';
  if (lesson.order === 2 || lesson.title?.includes('1B') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33') return '1B';
  if (lesson.order === 3 || lesson.title?.includes('1C') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44') return '1C';
  if (lesson.order === 4 || lesson.title?.includes('1D') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55') return '1D';
  if (lesson.order === 5 || lesson.title?.includes('2A') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66') return '2A';
  if (lesson.order === 6 || lesson.title?.includes('2B') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77') return '2B';
  if (lesson.order === 7 || lesson.title?.includes('2C') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a88') return '2C';
  if (lesson.order === 8 || lesson.title?.includes('2D') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a99') return '2D';
  if (lesson.order === 9 || lesson.title?.includes('3A') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a00') return '3A';
  if (lesson.order === 10 || lesson.title?.includes('3B') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b02') return '3B';
  if (lesson.order === 11 || lesson.title?.includes('3C') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b03') return '3C';
  if (lesson.order === 12 || lesson.title?.includes('3D') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b04') return '3D';
  if (lesson.order === 13 || lesson.title?.includes('4A') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380c01') return '4A';
  if (lesson.order === 14 || lesson.title?.includes('4B') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380c02') return '4B';
  if (lesson.order === 15 || lesson.title?.includes('4C') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380c03') return '4C';
  if (lesson.order === 16 || lesson.title?.includes('4D') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380c04') return '4D';
  if (lesson.order === 17 || lesson.title?.includes('5A') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380e01') return '5A';
  if (lesson.order === 18 || lesson.title?.includes('5B') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380e02') return '5B';
  if (lesson.order === 19 || lesson.title?.includes('5C') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380e03') return '5C';
  if (lesson.order === 20 || lesson.title?.includes('5D') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380e04') return '5D';
  if (lesson.order === 21 || lesson.title?.includes('6A') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380f01') return '6A';
  if (lesson.order === 22 || lesson.title?.includes('6B') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380f02') return '6B';
  if (lesson.order === 23 || lesson.title?.includes('6C') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380f03') return '6C';
  if (lesson.order === 24 || lesson.title?.includes('6D') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380f04') return '6D';
  if (lesson.order === 25 || lesson.title?.includes('7A') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380701') return '7A';
  if (lesson.order === 26 || lesson.title?.includes('7B') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380702') return '7B';
  if (lesson.order === 27 || lesson.title?.includes('7C') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380703') return '7C';
  if (lesson.order === 28 || lesson.title?.includes('7D') || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380704') return '7D';
  return '1A';
}

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const getNumRecord = (val: unknown): Record<number, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    const res: Record<number, string> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      const num = Number(k);
      if (!Number.isNaN(num) && typeof v === 'string') {
        res[num] = v;
      }
    }
    return res;
  }
  return {};
};

const getString = (val: unknown): string => {
  if (typeof val === 'string') return val;
  return '';
};

export default function LessonContentRenderer({
  user,
  audioBlob,
  onAudioBlobChange,
}: LessonContentRendererProps) {
  const {
    lesson,
    isTeacher,
    isReadOnly,
    answers,
    answerKey,
    setAnswer,
    setAnswerField,
    playAudio,
    playingAudio,
    submissionId,
    audios,
  } = useLessonContext();

  const lessonType = getLessonType(lesson);

  switch (lessonType) {
    case '1B': {
      const jobsInputs = getRecord(answers.exercise_1b_jobs || answers.jobsInputs);
      const readingInputs = getRecord(answers.exercise_3_reading || answers.readingInputs);
      const page9Profiles = getRecord(answers.exercise_page9_profiles);
      const ex4aAnswers = getRecord(answers.exercise_4a_reading);
      const grammar5aInputs = getRecord(answers.exercise_5a_grammar);
      const ex6Answers = getRecord(answers.exercise_6_dialogue);
      const ex7aAnswers = getRecord(answers.exercise_7a_qa);
      const profilePairs = (answers.exercise_7b_profiles as {
        woman?: { name?: string; job?: string; city?: string; country?: string };
        man?: { name?: string; job?: string; city?: string; country?: string };
      }) || {};

      return (
        <Lesson1BContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          jobsInputs={jobsInputs}
          readingInputs={readingInputs}
          onJobChange={(id: string, val: string) => setAnswerField('exercise_1b_jobs', id, val)}
          onReadingChange={(id: string, val: string) => setAnswerField('exercise_3_reading', id, val)}
          page9Profiles={page9Profiles}
          onPage9ProfileChange={(id: string, val: string) => setAnswerField('exercise_page9_profiles', id, val)}
          ex4aAnswers={ex4aAnswers}
          onEx4aChange={(id: string, val: string) => setAnswerField('exercise_4a_reading', id, val)}
          grammar5aInputs={grammar5aInputs}
          onGrammar5aChange={(id: string, val: string) => setAnswerField('exercise_5a_grammar', id, val)}
          ex6Answers={ex6Answers}
          onEx6Change={(id: string, val: string) => setAnswerField('exercise_6_dialogue', id, val)}
          ex7aAnswers={ex7aAnswers}
          onEx7aChange={(id: string, val: string) => setAnswerField('exercise_7a_qa', id, val)}
          profilePairs={profilePairs}
          onProfilePairChange={(gender: 'woman' | 'man', field: string, val: string) => {
            const currentPairs = profilePairs;
            const updatedGender = { ...(currentPairs[gender] || {}), [field]: val };
            setAnswer('exercise_7b_profiles', { ...currentPairs, [gender]: updatedGender });
          }}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
        />
      );
    }

    case '1C': {
      return (
        <Lesson1CContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          nationalitiesInputs={getRecord(answers.exercise_1b_nationalities)}
          stressInputs={getRecord(answers.exercise_2c_stress)}
          famousInputs={getString(answers.exercise_3_famous)}
          photosInputs={getRecord(answers.exercise_4a_photos)}
          tfInputs={getRecord(answers.exercise_4b_tf)}
          grammar5aInputs={getRecord(answers.exercise_5a_grammar)}
          textsInputs={getRecord(answers.exercise_6_texts)}
          questionsInputs={getRecord(answers.exercise_7a_questions)}
          speakingNotes={getString(answers.exercise_8b_notes)}
          onNationalitiesChange={(id: string, val: string) => setAnswerField('exercise_1b_nationalities', id, val)}
          onStressChange={(country: string, val: string) => setAnswerField('exercise_2c_stress', country, val)}
          onFamousChange={(val: string) => setAnswer('exercise_3_famous', val)}
          onPhotosChange={(id: string, val: string) => setAnswerField('exercise_4a_photos', id, val)}
          onTfChange={(id: string, val: string) => setAnswerField('exercise_4b_tf', id, val)}
          onGrammar5aChange={(id: string, val: string) => setAnswerField('exercise_5a_grammar', id, val)}
          onTextsChange={(id: string, val: string) => setAnswerField('exercise_6_texts', id, val)}
          onQuestionsChange={(id: string, val: string) => setAnswerField('exercise_7a_questions', id, val)}
          onSpeakingNotesChange={(val: string) => setAnswer('exercise_8b_notes', val)}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
        />
      );
    }

    case '1D': {
      const loc = answers.exercise_1_location;
      const ex1Location =
        loc && typeof loc === 'object' && '1' in loc
          ? String((loc as Record<string, string>)['1'])
          : getString(loc);

      return (
        <Lesson1DContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          ex1Location={ex1Location}
          ex2Audio={getRecord(answers.exercise_2_audio)}
          ex3aOrder={getRecord(answers.exercise_3a_order)}
          ex3bContact={getRecord(answers.exercise_3b_contact)}
          ex4aDialogue={getRecord(answers.exercise_4a_dialogue)}
          ex5Personal={getRecord(answers.exercise_5_personal)}
          ex6Partner={getRecord(answers.exercise_6_partner)}
          wordsearchFound={getRecord(answers.exercise_1_wordsearch)}
          ex2aOrder={getRecord(answers.exercise_2a_order)}
          ex2bShort={getRecord(answers.exercise_2b_short)}
          ex3Be={getRecord(answers.exercise_3_be)}
          ex4Jobs={getRecord(answers.exercise_4_jobs)}
          ex5IsIsnt={getRecord(answers.exercise_5_is_isnt)}
          ex6Corrections={getRecord(answers.exercise_6_corrections)}
          ex7aNationalities={getRecord(answers.exercise_7a_nationalities)}
          ex7bPeople={getRecord(answers.exercise_7b_people)}
          ex8Alternatives={getRecord(answers.exercise_8_alternatives)}
          ex9Text={getRecord(answers.exercise_9_text)}
          reflectScores={getRecord(answers.reflect_scores)}
          onEx1LocationChange={(val: string) => setAnswer('exercise_1_location', { '1': val })}
          onEx2AudioChange={(id: string, val: string) => setAnswerField('exercise_2_audio', id, val)}
          onEx3bContactChange={(id: string, val: string) => setAnswerField('exercise_3b_contact', id, val)}
          onEx4aDialogueChange={(id: string, val: string) => setAnswerField('exercise_4a_dialogue', id, val)}
          onEx5PersonalChange={(id: string, val: string) => setAnswerField('exercise_5_personal', id, val)}
          onEx6PartnerChange={(id: string, val: string) => setAnswerField('exercise_6_partner', id, val)}
          onWordsearchChange={(found: Record<string, string>) => setAnswer('exercise_1_wordsearch', found)}
          onEx2aOrderChange={(id: string, val: string) => setAnswerField('exercise_2a_order', id, val)}
          onEx3BeChange={(id: string, val: string) => setAnswerField('exercise_3_be', id, val)}
          onEx4JobsChange={(id: string, val: string) => setAnswerField('exercise_4_jobs', id, val)}
          onEx5IsIsntChange={(id: string, val: string) => setAnswerField('exercise_5_is_isnt', id, val)}
          onEx6CorrectionsChange={(id: string, val: string) => setAnswerField('exercise_6_corrections', id, val)}
          onEx7aNationalitiesChange={(id: string, val: string) => setAnswerField('exercise_7a_nationalities', id, val)}
          onEx8AlternativesChange={(id: string, val: string) => setAnswerField('exercise_8_alternatives', id, val)}
          onEx9TextChange={(id: string, val: string) => setAnswerField('exercise_9_text', id, val)}
          onReflectChange={(id: string, score: string | number) => setAnswerField('reflect_scores', id, String(score))}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'exercise_6')}
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '2A': {
      return (
        <Lesson2AContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          ex1FamilyTree={getRecord(answers.exercise_1_family_tree)}
          ex2aTable={getRecord(answers.exercise_2a_table)}
          ex3Sentences={getRecord(answers.exercise_3_sentences)}
          ex4aMatch={getRecord(answers.exercise_4a_match)}
          ex4bListening={getRecord(answers.exercise_4b_listening)}
          ex5Grammar={getRecord(answers.exercise_5_grammar)}
          ex6Pronunciation={getRecord(answers.exercise_6_pronunciation)}
          ex7Dialogue={getRecord(answers.exercise_7_dialogue)}
          ex8Notes={getString(answers.exercise_8_notes)}
          onEx1FamilyTreeChange={(member: string, val: string) => setAnswerField('exercise_1_family_tree', member, val)}
          onEx2aTableChange={(id: string, val: string) => setAnswerField('exercise_2a_table', id, val)}
          onEx3SentencesChange={(id: string, val: string) => setAnswerField('exercise_3_sentences', id, val)}
          onEx4aMatchChange={(speaker: string, val: string) => setAnswerField('exercise_4a_match', speaker, val)}
          onEx4bListeningChange={(id: string, val: string) => setAnswerField('exercise_4b_listening', id, val)}
          onEx5GrammarChange={(id: string, val: string) => setAnswerField('exercise_5_grammar', id, val)}
          onEx6PronunciationChange={(id: string, val: string) => setAnswerField('exercise_6_pronunciation', id, val)}
          onEx7DialogueChange={(id: string, val: string) => setAnswerField('exercise_7_dialogue', id, val)}
          onEx8NotesChange={(val: string) => setAnswer('exercise_8_notes', val)}
        />
      );
    }

    case '2B': {
      return (
        <Lesson2BContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          ex1bVocab={getRecord(answers.exercise_1b_vocab)}
          ex3Photos={getRecord(answers.exercise_3_photos)}
          ex5aPicture={getRecord(answers.exercise_5a_picture)}
          ex5bDialogue={getRecord(answers.exercise_5b_dialogue)}
          ex6Grammar={getRecord(answers.exercise_6_grammar)}
          ex7aChoice={getRecord(answers.exercise_7a_choice)}
          ex8Conversations={getRecord(answers.exercise_8_conversations)}
          exRoomObjects={getString(answers.exercise_room_objects)}
          onEx1bVocabChange={(id: string, val: string) => setAnswerField('exercise_1b_vocab', id, val)}
          onEx3PhotosChange={(id: string, val: string) => setAnswerField('exercise_3_photos', id, val)}
          onEx5aPictureChange={(id: string, val: string) => setAnswerField('exercise_5a_picture', id, val)}
          onEx5bDialogueChange={(id: string, val: string) => setAnswerField('exercise_5b_dialogue', id, val)}
          onEx6GrammarChange={(id: string, val: string) => setAnswerField('exercise_6_grammar', id, val)}
          onEx7aChoiceChange={(id: string, val: string) => setAnswerField('exercise_7a_choice', id, val)}
          onEx8ConversationsChange={(id: string, val: string) => setAnswerField('exercise_8_conversations', id, val)}
          onExRoomObjectsChange={(val: string) => setAnswer('exercise_room_objects', val)}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'exercise_8')}
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '2C': {
      return (
        <Lesson2CContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          ex1aMatch={getRecord(answers.exercise_1a_match)}
          ex2Choice={getRecord(answers.exercise_2_choice)}
          ex3aSequence={getString(answers.exercise_3a_sequence)}
          ex4Profiles={(answers.exercise_4_profiles as Record<string, { age?: string; from?: string; job?: string }>) || {}}
          ex5GrammarRules={getRecord(answers.exercise_5_grammar_rules)}
          ex7Questions={getRecord(answers.exercise_7_questions)}
          ex8aFamily={getRecord(answers.exercise_8a_family)}
          ex8bNotes={getString(answers.exercise_8b_notes)}
          ex10SpeakingNotes={getString(answers.exercise_10_speaking_notes)}
          onEx1aMatchChange={(id: string, val: string) => setAnswerField('exercise_1a_match', id, val)}
          onEx2ChoiceChange={(id: string, val: string) => setAnswerField('exercise_2_choice', id, val)}
          onEx3aSequenceChange={(val: string) => setAnswer('exercise_3a_sequence', val)}
          onEx4ProfilesChange={(profileKey: string, field: 'age' | 'from' | 'job', val: string) => {
            const current = (answers.exercise_4_profiles as Record<string, Record<string, string>>) || {};
            const item = current[profileKey] || {};
            setAnswer('exercise_4_profiles', {
              ...current,
              [profileKey]: { ...item, [field]: val },
            });
          }}
          onEx5GrammarRulesChange={(id: string, val: string) => setAnswerField('exercise_5_grammar_rules', id, val)}
          onEx7QuestionsChange={(id: string, val: string) => setAnswerField('exercise_7_questions', id, val)}
          onEx8aFamilyChange={(id: string, val: string) => setAnswerField('exercise_8a_family', id, val)}
          onEx8bNotesChange={(val: string) => setAnswer('exercise_8b_notes', val)}
          onEx10SpeakingNotesChange={(val: string) => setAnswer('exercise_10_speaking_notes', val)}
        />
      );
    }

    case '2D': {
      return (
        <Lesson2DContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          ex1Objects={getString(answers.exercise_1_objects)}
          ex2aBought={getString(answers.exercise_2a_bought)}
          ex2bPhrases={(answers.exercise_2b_phrases as Record<string, boolean>) || {}}
          ex3aDialogue={getRecord(answers.exercise_3a_dialogue)}
          ex4Notes={getString(answers.exercise_4_notes)}
          ex1Family={getRecord(answers.exercise_1_family)}
          ex2Possessive={getRecord(answers.exercise_2_possessive)}
          ex3Alternatives={getRecord(answers.exercise_3_alternatives)}
          ex4Mistakes={getRecord(answers.exercise_4_mistakes)}
          ex5Anagrams={getRecord(answers.exercise_5_anagrams)}
          ex6Demonstratives={getRecord(answers.exercise_6_demonstratives)}
          ex7aMath={getRecord(answers.exercise_7a_math)}
          ex7bAges={getRecord(answers.exercise_7b_ages)}
          ex8aQuestions={getRecord(answers.exercise_8a_questions)}
          ex8bPairNotes={getString(answers.exercise_8b_pair_notes)}
          reflectScores={getRecord(answers.reflect_scores)}
          onEx1ObjectsChange={(val: string) => setAnswer('exercise_1_objects', val)}
          onEx2aBoughtChange={(val: string) => setAnswer('exercise_2a_bought', val)}
          onEx2bPhrasesChange={(key: string, val: boolean) => setAnswerField('exercise_2b_phrases', key, val)}
          onEx3aDialogueChange={(key: string, val: string) => setAnswerField('exercise_3a_dialogue', key, val)}
          onEx4NotesChange={(val: string) => setAnswer('exercise_4_notes', val)}
          onEx1FamilyChange={(key: string, val: string) => setAnswerField('exercise_1_family', key, val)}
          onEx2PossessiveChange={(key: string, val: string) => setAnswerField('exercise_2_possessive', key, val)}
          onEx3AlternativesChange={(key: string, val: string) => setAnswerField('exercise_3_alternatives', key, val)}
          onEx4MistakesChange={(key: string, val: string) => setAnswerField('exercise_4_mistakes', key, val)}
          onEx5AnagramsChange={(key: string, val: string) => setAnswerField('exercise_5_anagrams', key, val)}
          onEx6DemonstrativesChange={(key: string, val: string) => setAnswerField('exercise_6_demonstratives', key, val)}
          onEx7aMathChange={(key: string, val: string) => setAnswerField('exercise_7a_math', key, val)}
          onEx7bAgesChange={(key: string, val: string) => setAnswerField('exercise_7b_ages', key, val)}
          onEx8aQuestionsChange={(key: string, val: string) => setAnswerField('exercise_8a_questions', key, val)}
          onEx8bPairNotesChange={(val: string) => setAnswer('exercise_8b_pair_notes', val)}
          onReflectScoresChange={(key: string, val: string | number) => setAnswerField('reflect_scores', key, val)}
        />
      );
    }

    case '3A': {
      return (
        <Lesson3AContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          ex1aPlaces={getRecord(answers.exercise_1a_places)}
          ex2PairNotes={getString(answers.exercise_2_pair_notes)}
          ex3Speakers={getRecord(answers.exercise_3_speakers)}
          ex4ListeningChoices={getRecord(answers.exercise_4_listening_choices)}
          ex5GrammarGaps={getRecord(answers.exercise_5_grammar_gaps)}
          ex7aAlternatives={getRecord(answers.exercise_7a_alternatives)}
          ex7bLists={getRecord(answers.exercise_7b_lists)}
          ex8TextGaps={getRecord(answers.exercise_8_text_gaps)}
          ex9Sentences={getRecord(answers.exercise_9_sentences)}
          ex11SpeakingNotes={getString(answers.exercise_11_speaking_notes)}
          onEx1aPlacesChange={(key: string, val: string) => setAnswerField('exercise_1a_places', key, val)}
          onEx2PairNotesChange={(val: string) => setAnswer('exercise_2_pair_notes', val)}
          onEx3SpeakersChange={(key: string, val: string) => setAnswerField('exercise_3_speakers', key, val)}
          onEx4ListeningChoicesChange={(key: string, val: string) => setAnswerField('exercise_4_listening_choices', key, val)}
          onEx5GrammarGapsChange={(key: string, val: string) => setAnswerField('exercise_5_grammar_gaps', key, val)}
          onEx7aAlternativesChange={(key: string, val: string) => setAnswerField('exercise_7a_alternatives', key, val)}
          onEx7bListsChange={(key: string, val: string) => setAnswerField('exercise_7b_lists', key, val)}
          onEx8TextGapsChange={(key: string, val: string) => setAnswerField('exercise_8_text_gaps', key, val)}
          onEx9SentencesChange={(key: string, val: string) => setAnswerField('exercise_9_sentences', key, val)}
          onEx11SpeakingNotesChange={(val: string) => setAnswer('exercise_11_speaking_notes', val)}
        />
      );
    }

    case '3B': {
      return (
        <Lesson3BContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
        />
      );
    }

    case '3C': {
      return (
        <Lesson3CContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
        />
      );
    }

    case '3D': {
      return (
        <Lesson3DContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'exercise_4b')}
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '4A': {
      return (
        <Lesson4AContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
        />
      );
    }

    case '4B': {
      return (
        <Lesson4BContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
        />
      );
    }

    case '4C': {
      return (
        <Lesson4CContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
        />
      );
    }

    case '4D': {
      return (
        <Lesson4DContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'exercise_5')}
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '5A': {
      return (
        <Lesson5AContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'exercise_11_speaking')}
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '5B': {
      return (
        <Lesson5BContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'exercise_9_speaking')}
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '5C': {
      return (
        <Lesson5CContent
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'exercise_11_speaking')}
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '5D': {
      return (
        <Lesson5DContent
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'exercise_6_cafe_roleplay')}
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '6A': {
      return (
        <Lesson6AContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'lesson6a_speaking_ex10')}
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '6B': {
      return (
        <Lesson6BContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'lesson6b_speaking_ex10')}
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '6C': {
      return (
        <Lesson6CContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime, exKey) =>
            onAudioBlobChange?.(blob, mime, exKey || 'exercise_8_audio')
          }
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '6D': {
      return (
        <Lesson6DContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime, exKey) =>
            onAudioBlobChange?.(blob, mime, exKey || 'exercise_6b_audio')
          }
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '7A': {
      return (
        <Lesson7AContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime, exKey) =>
            onAudioBlobChange?.(blob, mime, exKey || 'speaking_place_description')
          }
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '7B': {
      return (
        <Lesson7BContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime, exKey) =>
            onAudioBlobChange?.(blob, mime, exKey || 'speaking_good_days')
          }
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '7C': {
      return (
        <Lesson7CContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime, exKey) =>
            onAudioBlobChange?.(blob, mime, exKey || 'exercise_11')
          }
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    case '7D': {
      return (
        <Lesson7DContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
          audioBlob={audioBlob}
          onAudioBlobChange={(blob, mime, exKey) =>
            onAudioBlobChange?.(blob, mime, exKey || 'exercise_5')
          }
          submissionId={submissionId}
          submittedAudios={audios}
        />
      );
    }

    default: {
      // 1A Hello
      const flagAnswers = getNumRecord(answers.flagAnswers);
      const dialogInputs = getRecord(answers.dialogInputs);
      const stressTableInputs = getRecord(answers.stressTableInputs);
      const grammarInputs = getRecord(answers.grammarInputs);
      const dialogue7aInputs = getRecord(answers.dialogue7aInputs);
      const conferenceCard = (answers.conferenceCard as {
        name: string;
        city: string;
        country: string;
        roles: string[];
      }) || { name: '', city: '', country: '', roles: [] };

      return (
        <LessonContent
          lesson={lesson}
          user={user}
          isTeacherReview={isTeacher}
          readOnly={isReadOnly}
          answerKey={answerKey}
          flagAnswers={flagAnswers}
          dialogInputs={dialogInputs}
          stressTableInputs={stressTableInputs}
          grammarInputs={grammarInputs}
          dialogue7aInputs={dialogue7aInputs}
          conferenceCard={conferenceCard}
          onFlagChange={(id: number, val: string) => setAnswerField('flagAnswers', String(id), val)}
          onDialogChange={(id: string, val: string) => setAnswerField('dialogInputs', id, val)}
          onStressChange={(id: string, val: string) => setAnswerField('stressTableInputs', id, val)}
          onGrammarChange={(id: string, val: string) => setAnswerField('grammarInputs', id, val)}
          onDialogue7aChange={(id: string, val: string) => setAnswerField('dialogue7aInputs', id, val)}
          onConferenceCardChange={(field: 'name' | 'city' | 'country', val: string) => {
            setAnswer('conferenceCard', { ...conferenceCard, [field]: val });
          }}
          onRoleToggle={(role: string) => {
            const roles = conferenceCard.roles || [];
            const updated = roles.includes(role)
              ? roles.filter((r) => r !== role)
              : [...roles, role];
            setAnswer('conferenceCard', { ...conferenceCard, roles: updated });
          }}
          playAudio={playAudio}
          playingAudio={playingAudio}
          originalAnswers={answers}
        />
      );
    }
  }
}
