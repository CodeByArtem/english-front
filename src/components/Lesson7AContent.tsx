'use client';

import React from 'react';
import Image from 'next/image';
import { useLessonContext, LessonContextModel } from '@/context/LessonContext';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import AudioAnswerRecorder from './AudioAnswerRecorder/AudioAnswerRecorder';
import SubmissionAudioPlayer, {
  SubmissionAudioMeta,
} from './AudioAnswerRecorder/SubmissionAudioPlayer';
import {
  LessonAnswerKey,
  verifyAnswer,
  getExerciseKey,
  VerificationResult,
} from '@/lib/answerVerification';
import styles from './lesson7a.module.scss';

export interface Lesson7AContentProps {
  lesson?: LessonContextModel | null;
  user?: Record<string, unknown> | null;
  isTeacherReview?: boolean;
  readOnly?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio?: (track: string) => void;
  playingAudio?: string | null;
  originalAnswers?: Record<string, unknown>;
  audioBlob?: Blob | null;
  onAudioBlobChange?: (blob: Blob | null, mimeType: string, exerciseKey?: string) => void;
  submissionId?: string;
  submittedAudios?: SubmissionAudioMeta[];
}

export const FALLBACK_ANSWER_KEY_7A: LessonAnswerKey = {
  exercise_1a_matching: {
    A: ['the sea', 'sea', 'The sea', 'Sea'],
    B: ['north', 'North'],
    C: ['west', 'West'],
    D: ['east', 'East'],
    E: ['south', 'South'],
    F: ['a mountain', 'mountain', 'A mountain', 'Mountain'],
    G: ['an island', 'island', 'An island', 'Island'],
    H: ['a lake', 'lake', 'A lake', 'Lake'],
    I: ['a hill', 'hill', 'A hill', 'Hill'],
    J: ['a river', 'river', 'A river', 'River'],
    K: ['a field', 'field', 'A field', 'Field'],
    L: ['the sky', 'sky', 'The sky', 'Sky'],
    M: ['clouds', 'Clouds'],
    N: ['trees', 'Trees'],
    O: ['flowers', 'Flowers'],
  },
  exercise_2_table: {
    water_1: ['a lake', 'lake', 'the lake'],
    water_2: ['a river', 'river', 'the river'],
    water_3: ['the sea', 'sea', 'a sea'],
    land_1: ['a field', 'field'],
    land_2: ['a hill', 'hill'],
    land_3: ['an island', 'island'],
    land_4: ['a mountain', 'mountain'],
    plants_1: ['flowers', 'Flowers'],
    plants_2: ['trees', 'Trees'],
    air_1: ['clouds', 'Clouds'],
    air_2: ['the sky', 'sky', 'Sky'],
    directions_1: ['east', 'East'],
    directions_2: ['north', 'North'],
    directions_3: ['south', 'South'],
    directions_4: ['west', 'West'],
  },
  exercise_3_alternatives: {
    '1_1': ['clouds', 'Clouds'],
    '1_2': ['sky', 'Sky'],
    '2': ['south', 'South'],
    '3_1': ['river', 'River'],
    '3_2': ['lake', 'Lake'],
    '4_1': ['flowers', 'Flowers'],
    '4_2': ['mountains', 'Mountains'],
    '5': ['hill', 'Hill'],
    '6': ['north', 'North'],
  },
  exercise_5a_location: {
    '1': ['The Lake District', 'the lake district', 'Lake District', 'lake district'],
  },
  exercise_5b_matching: {
    '1': ['d', 'D'],
    '2': ['c', 'C'],
    '3': ['b', 'B'],
    '4': ['f', 'F'],
    '5': ['h', 'H'],
    '6': ['a', 'A'],
    '7': ['e', 'E'],
    '8': ['g', 'G'],
  },
  exercise_6_grammar: {
    '1': ['things', 'Things'],
    '2': ['way', 'Way', 'way you do something'],
    '3': ['days, months and times', 'days months and times', 'days months times'],
    '4': ['people', 'People'],
    '5': ['places', 'Places'],
    '6': ['prices', 'Prices'],
    '7': ['the number of things', 'number of things'],
  },
  exercise_8a_prompts: {
    '1': [
      'What is the name of the place?',
      "What's the name of the place?",
      'What is the name of the place',
      "What's the name of the place",
    ],
    '2': ['Where is it?', 'Where is it'],
    '3': ['When do you usually go there?', 'When do you usually go there'],
    '4': ['What do you usually do there?', 'What do you usually do there'],
    '5': [
      'How much is a train ticket from here?',
      'How much is a train ticket from here',
    ],
    '6': [
      'How many cafés are there?',
      'How many cafes are there?',
      'How many cafés are there',
      'How many cafes are there',
    ],
    '7': ['Is it a quiet place?', 'Is it a quiet place'],
  },
  exercise_9_questions: {
    '1': ['Where are your parents from?', 'Where are your parents from'],
    '2': ['Who do you go with?', 'Who do you go with'],
    '3': ['Where is it?', 'Where is it'],
    '4': ['When do you visit?', 'When do you visit'],
    '5': ['How many lakes are there?', 'How many lakes are there'],
    '6': ['How much is a ticket?', 'How much is a ticket'],
    '7': [
      'How do you spell it?',
      'How do you spell it',
      'How do you spell that?',
      'How do you spell that',
    ],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const VOCAB_WORDS_7A = [
  'clouds',
  'east',
  'a field',
  'flowers',
  'a hill',
  'an island',
  'a lake',
  'a mountain',
  'north',
  'a river',
  'the sea',
  'the sky',
  'south',
  'trees',
  'west',
];

const PHOTOS_7A = [
  { key: 'A', name: 'Photo A', src: '/images/lesson7a/photo_a_sea.png' },
  { key: 'F', name: 'Photo F', src: '/images/lesson7a/photo_f_mountain.png' },
  { key: 'G', name: 'Photo G', src: '/images/lesson7a/photo_g_island.png' },
  { key: 'H', name: 'Photo H', src: '/images/lesson7a/photo_h_lake.png' },
  { key: 'I', name: 'Photo I', src: '/images/lesson7a/photo_i_hill.png' },
  { key: 'J', name: 'Photo J', src: '/images/lesson7a/photo_j_river.png' },
  { key: 'K', name: 'Photo K', src: '/images/lesson7a/photo_k_field.png' },
  { key: 'L', name: 'Photo L', src: '/images/lesson7a/photo_l_sky.png' },
  { key: 'M', name: 'Photo M', src: '/images/lesson7a/photo_m_clouds.png' },
  { key: 'N', name: 'Photo N', src: '/images/lesson7a/photo_n_trees.png' },
  { key: 'O', name: 'Photo O', src: '/images/lesson7a/photo_o_flowers.png' },
];

export default function Lesson7AContent(props: Lesson7AContentProps) {
  const context = useLessonContext();
  const {
    isTeacherReview = false,
    readOnly = false,
    answerKey: propAnswerKey,
    originalAnswers: propOriginalAnswers,
    submissionId,
    submittedAudios = [],
    onAudioBlobChange,
  } = props;

  const playAudio = props.playAudio ?? context?.playAudio;
  const playingAudio = props.playingAudio ?? context?.playingAudio;
  const activeAnswerKey =
    propAnswerKey ||
    (context?.answerKey as LessonAnswerKey) ||
    (context?.lesson?.answerKey as LessonAnswerKey) ||
    FALLBACK_ANSWER_KEY_7A;

  const isReview = Boolean(isTeacherReview || (activeAnswerKey && readOnly));
  const answers = (context?.answers || {}) as Record<string, unknown>;

  const handleFieldChange = (exerciseName: string, field: string, val: string) => {
    if (readOnly) return;
    if (context?.setAnswerField) {
      context.setAnswerField(exerciseName, field, val);
    }
  };

  const verify = (exerciseName: string, field: string, value: string): VerificationResult | null => {
    if (!isReview) return null;
    const exKey = getExerciseKey(activeAnswerKey, exerciseName);
    return verifyAnswer(value, exKey?.[field]);
  };

  const isDiff = (exerciseName: string, field: string): boolean => {
    if (!propOriginalAnswers || !context?.answers) return false;
    const origEx = getRecord(propOriginalAnswers[exerciseName]);
    const currEx = getRecord(context.answers[exerciseName]);
    return origEx[field] !== undefined && origEx[field] !== currEx[field];
  };

  // Render input without answer leaking in placeholder
  const renderInput = (
    exerciseName: string,
    field: string,
    placeholder: string,
    options?: { fullWidth?: boolean; customClass?: string }
  ) => {
    const currAnswers = getRecord(answers[exerciseName]);
    const currentVal = currAnswers[field] || '';
    const v = verify(exerciseName, field, currentVal);
    const diff = isDiff(exerciseName, field);

    return (
      <div className={options?.fullWidth ? styles.inputWrapperFull : styles.inputWrapper}>
        <div className={styles.inputRow}>
          <input
            type="text"
            value={currentVal}
            onChange={(e) => handleFieldChange(exerciseName, field, e.target.value)}
            placeholder={placeholder}
            disabled={readOnly}
            className={`${styles.textInput} ${
              v ? (v.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
            } ${diff ? styles.diffHighlight : ''} ${options?.customClass || ''}`}
          />
          {v?.isCorrect && <span className={styles.correctBadge}>✓</span>}
        </div>
        {v && !v.isCorrect && (
          <div className={styles.feedbackRow}>
            <TeacherAnswerBadge result={v} />
          </div>
        )}
      </div>
    );
  };

  // Render dropdown without leaking in placeholder
  const renderSelect = (
    exerciseName: string,
    field: string,
    optionsList: { value: string; label: string }[],
    options?: { customClass?: string }
  ) => {
    const currAnswers = getRecord(answers[exerciseName]);
    const currentVal = currAnswers[field] || '';
    const v = verify(exerciseName, field, currentVal);
    const diff = isDiff(exerciseName, field);

    return (
      <div className={styles.inputWrapper}>
        <div className={styles.inputRow}>
          <select
            value={currentVal}
            onChange={(e) => handleFieldChange(exerciseName, field, e.target.value)}
            disabled={readOnly}
            className={`${styles.selectInput} ${
              v ? (v.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
            } ${diff ? styles.diffHighlight : ''} ${options?.customClass || ''}`}
          >
            <option value="">-- Choose --</option>
            {optionsList.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {v?.isCorrect && <span className={styles.correctBadge}>✓</span>}
        </div>
        {v && !v.isCorrect && (
          <div className={styles.feedbackRow}>
            <TeacherAnswerBadge result={v} />
          </div>
        )}
      </div>
    );
  };

  const vocabOptions = VOCAB_WORDS_7A.map((w) => ({ value: w, label: w }));

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Banner Header 7A */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge7A}>
              <span>7</span>
              <span className={styles.letterA}>A</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>Questions</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: ask and answer about a place</span>
                <span className={styles.pillGoal}>Grammar: wh- questions</span>
                <span className={styles.pillGoal}>Vocabulary: places</span>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.pageBody}>
          {/* ============================================================== */}
          {/* SECTION 1: VOCABULARY: PLACES                                  */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Vocabulary</span>
              <h2 className={styles.sectionTitle}>Places and Geography</h2>
            </div>

            {/* Exercise 1a: Photos Matching */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1a</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Match photos A–O with the words in the box</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '7.1' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('7.1')}
                      aria-label="Play Audio 7.1"
                    >
                      {playingAudio === '7.1' ? '⏸ Playing 7.1' : '▶ Audio 7.1'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Select the matching word for each picture from the box.
                  </p>
                </div>
              </div>

              {/* Word Bank */}
              <div className={styles.wordBankBox}>
                <span className={styles.wordBankLabel}>Word box:</span>
                {VOCAB_WORDS_7A.map((word) => (
                  <span key={word} className={styles.wordBankItem}>
                    {word}
                  </span>
                ))}
              </div>

              {/* Special Compass Rose (B, C, D, E) */}
              <div className={styles.compassCard}>
                <div className={styles.compassImageWrapper}>
                  <Image
                    src="/images/lesson7a/compass.png"
                    alt="Compass Rose with directions B, C, D, E"
                    fill
                    sizes="170px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.compassDirectionsGrid}>
                  <div className={styles.compassDirectionItem}>
                    <span className={styles.compassDirectionBadge}>Point B (Top)</span>
                    {renderSelect('exercise_1a_matching', 'B', vocabOptions)}
                  </div>
                  <div className={styles.compassDirectionItem}>
                    <span className={styles.compassDirectionBadge}>Point C (Left)</span>
                    {renderSelect('exercise_1a_matching', 'C', vocabOptions)}
                  </div>
                  <div className={styles.compassDirectionItem}>
                    <span className={styles.compassDirectionBadge}>Point D (Right)</span>
                    {renderSelect('exercise_1a_matching', 'D', vocabOptions)}
                  </div>
                  <div className={styles.compassDirectionItem}>
                    <span className={styles.compassDirectionBadge}>Point E (Bottom)</span>
                    {renderSelect('exercise_1a_matching', 'E', vocabOptions)}
                  </div>
                </div>
              </div>

              {/* Landscape & Nature Photos Gallery */}
              <div className={styles.galleryGrid}>
                {PHOTOS_7A.map((photo) => (
                  <div key={photo.key} className={styles.galleryCard}>
                    <div className={styles.galleryImageWrapper}>
                      <span className={styles.galleryCardBadge}>{photo.key}</span>
                      <Image
                        src={photo.src}
                        alt={photo.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.galleryCardForm}>
                      {renderSelect('exercise_1a_matching', photo.key, vocabOptions)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 1b: Audio Repeat */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1b</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Listen and repeat</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '7.1' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('7.1')}
                      aria-label="Play Audio 7.1"
                    >
                      {playingAudio === '7.1' ? '⏸ Playing 7.1' : '▶ Audio 7.1'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Listen carefully to the pronunciation of each landscape and direction word.
                  </p>
                </div>
              </div>
            </div>

            {/* Exercise 2: Categorization Table */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Complete the table with words from Exercise 1a</h3>
                  <p className={styles.exerciseInstruction}>
                    Sort all words into the five categories: water, land, plants, air, directions.
                  </p>
                </div>
              </div>

              <div className={styles.categoriesGrid}>
                {/* Water Column */}
                <div className={styles.categoryColumn}>
                  <h4 className={styles.categoryHeader}>💧 Water</h4>
                  <div className={styles.categorySlots}>
                    {renderInput('exercise_2_table', 'water_1', 'Word 1...')}
                    {renderInput('exercise_2_table', 'water_2', 'Word 2...')}
                    {renderInput('exercise_2_table', 'water_3', 'Word 3...')}
                  </div>
                </div>

                {/* Land Column */}
                <div className={styles.categoryColumn}>
                  <h4 className={styles.categoryHeader}>⛰️ Land</h4>
                  <div className={styles.categorySlots}>
                    {renderInput('exercise_2_table', 'land_1', 'Word 1...')}
                    {renderInput('exercise_2_table', 'land_2', 'Word 2...')}
                    {renderInput('exercise_2_table', 'land_3', 'Word 3...')}
                    {renderInput('exercise_2_table', 'land_4', 'Word 4...')}
                  </div>
                </div>

                {/* Plants Column */}
                <div className={styles.categoryColumn}>
                  <h4 className={styles.categoryHeader}>🌿 Plants</h4>
                  <div className={styles.categorySlots}>
                    {renderInput('exercise_2_table', 'plants_1', 'Word 1...')}
                    {renderInput('exercise_2_table', 'plants_2', 'Word 2...')}
                  </div>
                </div>

                {/* Air Column */}
                <div className={styles.categoryColumn}>
                  <h4 className={styles.categoryHeader}>☁️ Air</h4>
                  <div className={styles.categorySlots}>
                    {renderInput('exercise_2_table', 'air_1', 'Word 1...')}
                    {renderInput('exercise_2_table', 'air_2', 'Word 2...')}
                  </div>
                </div>

                {/* Directions Column */}
                <div className={styles.categoryColumn}>
                  <h4 className={styles.categoryHeader}>🧭 Directions</h4>
                  <div className={styles.categorySlots}>
                    {renderInput('exercise_2_table', 'directions_1', 'Direction 1...')}
                    {renderInput('exercise_2_table', 'directions_2', 'Direction 2...')}
                    {renderInput('exercise_2_table', 'directions_3', 'Direction 3...')}
                    {renderInput('exercise_2_table', 'directions_4', 'Direction 4...')}
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 3: Choose correct alternatives */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>3</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Choose the correct alternatives</h3>
                  <p className={styles.exerciseInstruction}>
                    Select the word that best fits each sentence.
                  </p>
                </div>
              </div>

              <div className={styles.itemsList}>
                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>1</span>
                    <span className={styles.itemSentence}>
                      There are three black{' '}
                      {renderSelect('exercise_3_alternatives', '1_1', [
                        { value: 'clouds', label: 'clouds' },
                        { value: 'sky', label: 'sky' },
                      ])}{' '}
                      in the{' '}
                      {renderSelect('exercise_3_alternatives', '1_2', [
                        { value: 'clouds', label: 'clouds' },
                        { value: 'sky', label: 'sky' },
                      ])}
                      .
                    </span>
                  </div>
                </div>

                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>2</span>
                    <span className={styles.itemSentence}>
                      I live in the{' '}
                      {renderSelect('exercise_3_alternatives', '2', [
                        { value: 'south', label: 'south' },
                        { value: 'flowers', label: 'flowers' },
                      ])}{' '}
                      of my country.
                    </span>
                  </div>
                </div>

                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>3</span>
                    <span className={styles.itemSentence}>
                      We have a{' '}
                      {renderSelect('exercise_3_alternatives', '3_1', [
                        { value: 'river', label: 'river' },
                        { value: 'hill', label: 'hill' },
                      ])}{' '}
                      and a{' '}
                      {renderSelect('exercise_3_alternatives', '3_2', [
                        { value: 'lake', label: 'lake' },
                        { value: 'mountain', label: 'mountain' },
                      ])}{' '}
                      near my house. We swim a lot.
                    </span>
                  </div>
                </div>

                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>4</span>
                    <span className={styles.itemSentence}>
                      People take photos of the red{' '}
                      {renderSelect('exercise_3_alternatives', '4_1', [
                        { value: 'flowers', label: 'flowers' },
                        { value: 'trees', label: 'trees' },
                      ])}{' '}
                      and the high{' '}
                      {renderSelect('exercise_3_alternatives', '4_2', [
                        { value: 'fields', label: 'fields' },
                        { value: 'mountains', label: 'mountains' },
                      ])}
                      .
                    </span>
                  </div>
                </div>

                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>5</span>
                    <span className={styles.itemSentence}>
                      People sit on the{' '}
                      {renderSelect('exercise_3_alternatives', '5', [
                        { value: 'river', label: 'river' },
                        { value: 'hill', label: 'hill' },
                      ])}{' '}
                      and eat lunch.
                    </span>
                  </div>
                </div>

                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>6</span>
                    <span className={styles.itemSentence}>
                      Milan is in the{' '}
                      {renderSelect('exercise_3_alternatives', '6', [
                        { value: 'north', label: 'north' },
                        { value: 'hill', label: 'hill' },
                      ])}{' '}
                      of Italy.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 4: About your town */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>4</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Complete sentences about your town or city</h3>
                  <p className={styles.exerciseInstruction}>
                    Use the words in Exercise 2 to help you describe your town. (Example: <em>My town is in the south of my country.</em>)
                  </p>
                </div>
              </div>

              <div className={styles.itemsList}>
                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>1</span>
                    <span className={styles.itemSentence}>
                      My city/town is in the {renderInput('exercise_4_town', '1', 'direction...')} of my country.
                    </span>
                  </div>
                </div>
                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>2</span>
                    <span className={styles.itemSentence}>
                      There are beautiful {renderInput('exercise_4_town', '2', 'features...')} there.
                    </span>
                  </div>
                </div>
                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>3</span>
                    <span className={styles.itemSentence}>
                      There aren&apos;t any {renderInput('exercise_4_town', '3', 'things...')} there.
                    </span>
                  </div>
                </div>
                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>4</span>
                    <span className={styles.itemSentence}>
                      There is a famous {renderInput('exercise_4_town', '4_item', 'place...')} — its name is{' '}
                      {renderInput('exercise_4_town', '4_name', 'name...')}.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 2: LISTENING: THE LAKE DISTRICT                       */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Listening</span>
              <h2 className={styles.sectionTitle}>Fatma and Dan: A Beautiful Place</h2>
            </div>

            {/* Exercise 5a: Location Identification */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>5a</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Listen to Fatma and Dan</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '7.2' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('7.2')}
                      aria-label="Play Audio 7.2"
                    >
                      {playingAudio === '7.2' ? '⏸ Playing 7.2' : '▶ Audio 7.2'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Where is the place that Dan talks about?
                  </p>
                </div>
              </div>

              <div className={styles.itemRow}>
                <div className={styles.itemLeft}>
                  <span className={styles.itemSentence}>The name of the place is:</span>
                  {renderInput('exercise_5a_location', '1', 'Place name...')}
                </div>
              </div>
            </div>

            {/* Exercise 5b: Match questions 1-8 with answers a-h */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>5b</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Match questions 1–8 with answers a–h</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '7.2' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('7.2')}
                      aria-label="Play Audio 7.2"
                    >
                      {playingAudio === '7.2' ? '⏸ Playing 7.2' : '▶ Audio 7.2'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Listen again and select the matching answer option for each question.
                  </p>
                </div>
              </div>

              {/* Answers Reference Box */}
              <div className={styles.wordBankBox}>
                <span className={styles.wordBankLabel}>Answers (a–h):</span>
                <span className={styles.wordBankItem}>a: In June or July.</span>
                <span className={styles.wordBankItem}>b: In the north of England.</span>
                <span className={styles.wordBankItem}>c: L-A-K-E D-I-S-T-R-I-C-T</span>
                <span className={styles.wordBankItem}>d: The Lake District.</span>
                <span className={styles.wordBankItem}>e: Sometimes with my friends, sometimes with my wife.</span>
                <span className={styles.wordBankItem}>f: There are mountains and lakes. It&apos;s very beautiful.</span>
                <span className={styles.wordBankItem}>g: Ah, quite expensive!</span>
                <span className={styles.wordBankItem}>h: Um, sixteen, I think.</span>
              </div>

              <div className={styles.itemsList}>
                {[
                  { num: '1', q: "What's the name of the place?" },
                  { num: '2', q: 'How do you spell that?' },
                  { num: '3', q: 'Where is it?' },
                  { num: '4', q: 'What do you like about it?' },
                  { num: '5', q: 'How many lakes are there?' },
                  { num: '6', q: 'When do you usually go there?' },
                  { num: '7', q: 'Who do you go with?' },
                  { num: '8', q: 'How much is a train ticket from London?' },
                ].map((item) => (
                  <div key={item.num} className={styles.itemRow}>
                    <div className={styles.itemLeft}>
                      <span className={styles.numBadge}>{item.num}</span>
                      <span className={styles.itemSentence}>{item.q}</span>
                    </div>
                    <div className={styles.itemAction}>
                      {renderSelect('exercise_5b_matching', item.num, [
                        { value: 'a', label: 'a' },
                        { value: 'b', label: 'b' },
                        { value: 'c', label: 'c' },
                        { value: 'd', label: 'd' },
                        { value: 'e', label: 'e' },
                        { value: 'f', label: 'f' },
                        { value: 'g', label: 'g' },
                        { value: 'h', label: 'h' },
                      ])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 3: GRAMMAR: WH- QUESTIONS                             */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Grammar</span>
              <h2 className={styles.sectionTitle}>Wh- Questions</h2>
            </div>

            {/* Exercise 6: Grammar Box Alternatives */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>6</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Choose the correct alternatives in the grammar box</h3>
                  <p className={styles.exerciseInstruction}>
                    Use Exercise 5b to help you identify which question word is used for what purpose.
                  </p>
                </div>
              </div>

              <div className={styles.grammarBox}>
                <h4 className={styles.grammarHeader}>Wh- questions</h4>
                <table className={styles.grammarTable}>
                  <thead>
                    <tr>
                      <th>Wh- question word</th>
                      <th>Function</th>
                      <th>Example from conversation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>what</strong></td>
                      <td>
                        Use <strong>what</strong> for{' '}
                        {renderSelect('exercise_6_grammar', '1', [
                          { value: 'things', label: 'things' },
                          { value: 'people', label: 'people' },
                        ])}
                      </td>
                      <td className={styles.grammarRowExample}>
                        <em>What&apos;s the name of the place?</em>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>how</strong></td>
                      <td>
                        Use <strong>how</strong> for the{' '}
                        {renderSelect('exercise_6_grammar', '2', [
                          { value: 'way', label: 'way' },
                          { value: 'time you do something', label: 'time you do something' },
                        ])}{' '}
                        you do something
                      </td>
                      <td className={styles.grammarRowExample}>
                        <em>How do you spell that?</em>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>when</strong></td>
                      <td>
                        Use <strong>when</strong> for{' '}
                        {renderSelect('exercise_6_grammar', '3', [
                          { value: 'places', label: 'places' },
                          { value: 'days, months and times', label: 'days, months and times' },
                        ])}
                      </td>
                      <td className={styles.grammarRowExample}>
                        <em>When do you usually go there?</em>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>who</strong></td>
                      <td>
                        Use <strong>who</strong> for{' '}
                        {renderSelect('exercise_6_grammar', '4', [
                          { value: 'prices', label: 'prices' },
                          { value: 'people', label: 'people' },
                        ])}
                      </td>
                      <td className={styles.grammarRowExample}>
                        <em>Who do you go with?</em>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>where</strong></td>
                      <td>
                        Use <strong>where</strong> for{' '}
                        {renderSelect('exercise_6_grammar', '5', [
                          { value: 'places', label: 'places' },
                          { value: 'times', label: 'times' },
                        ])}
                      </td>
                      <td className={styles.grammarRowExample}>
                        <em>Where is it?</em>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>how much</strong></td>
                      <td>
                        Use <strong>how much</strong> for{' '}
                        {renderSelect('exercise_6_grammar', '6', [
                          { value: 'prices', label: 'prices' },
                          { value: 'people', label: 'people' },
                        ])}
                      </td>
                      <td className={styles.grammarRowExample}>
                        <em>How much is a ticket?</em>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>how many</strong></td>
                      <td>
                        Use <strong>how many</strong> for{' '}
                        {renderSelect('exercise_6_grammar', '7', [
                          { value: 'prices', label: 'prices' },
                          { value: 'the number of things', label: 'the number of things' },
                        ])}
                      </td>
                      <td className={styles.grammarRowExample}>
                        <em>How many lakes are there?</em>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exercise 7a-b: Pronunciation Intonation */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>7a</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Notice question intonation</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '7.3' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('7.3')}
                      aria-label="Play Audio 7.3"
                    >
                      {playingAudio === '7.3' ? '⏸ Playing 7.3' : '▶ Audio 7.3'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Listen to the questions. Notice when the speaker&apos;s voice goes up ↗ and down ↘.
                  </p>
                </div>
              </div>

              <div className={styles.intonationGrid}>
                <div className={styles.intonationCard}>
                  <span className={styles.intonationText}>1. When do you go there?</span>
                  <span className={styles.intonationBadgeDown}>Wh- question: Down ↘</span>
                </div>
                <div className={styles.intonationCard}>
                  <span className={styles.intonationText}>2. Do you go there in June?</span>
                  <span className={styles.intonationBadgeUp}>Yes/No question: Up ↗</span>
                </div>
                <div className={styles.intonationCard}>
                  <span className={styles.intonationText}>3. How much is it?</span>
                  <span className={styles.intonationBadgeDown}>Wh- question: Down ↘</span>
                </div>
                <div className={styles.intonationCard}>
                  <span className={styles.intonationText}>4. Is it £10?</span>
                  <span className={styles.intonationBadgeUp}>Yes/No question: Up ↗</span>
                </div>
                <div className={styles.intonationCard}>
                  <span className={styles.intonationText}>5. Is it old?</span>
                  <span className={styles.intonationBadgeUp}>Yes/No question: Up ↗</span>
                </div>
              </div>
            </div>

            {/* Exercise 8a: Make questions using prompts */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>8a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Make questions using the prompts</h3>
                  <p className={styles.exerciseInstruction}>
                    Write full questions with correct grammar, punctuation, and question marks.
                  </p>
                </div>
              </div>

              <div className={styles.itemsList}>
                {[
                  { num: '1', prompt: 'What / name of the place?', example: "What is / What's the name of the place?" },
                  { num: '2', prompt: 'Where / it?' },
                  { num: '3', prompt: 'When / you / usually / go there?' },
                  { num: '4', prompt: 'What / you / usually / do / there?' },
                  { num: '5', prompt: 'How much / a train ticket / from here?' },
                  { num: '6', prompt: 'How many / cafés / there?' },
                  { num: '7', prompt: 'it / a quiet place?' },
                ].map((item) => (
                  <div key={item.num} className={styles.itemRow}>
                    <div className={styles.itemLeft}>
                      <span className={styles.numBadge}>{item.num}</span>
                      <span className={styles.itemSentence}>
                        <strong>{item.prompt}</strong>
                        {item.example && <span style={{ display: 'block', color: '#0284c7', fontSize: '13px' }}>Example: {item.example}</span>}
                      </span>
                    </div>
                    <div className={styles.itemAction} style={{ width: '100%', maxWidth: '380px' }}>
                      {renderInput('exercise_8a_prompts', item.num, 'Write your question...', { fullWidth: true })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 9: Questions for underlined answers */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>9</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Make questions for the underlined answers</h3>
                  <p className={styles.exerciseInstruction}>
                    Ask the appropriate question for each statement.
                  </p>
                </div>
              </div>

              <div className={styles.itemsList}>
                {[
                  { num: '1', statement: 'My parents are from Izmir, in Turkey.', target: 'Izmir, in Turkey', example: 'Where are your parents from?' },
                  { num: '2', statement: 'I go with Tina.', target: 'with Tina' },
                  { num: '3', statement: "It's in the east.", target: 'in the east' },
                  { num: '4', statement: 'I visit in January or February.', target: 'January or February' },
                  { num: '5', statement: 'There are five lakes there.', target: 'five lakes' },
                  { num: '6', statement: 'A ticket is £10.50.', target: '£10.50' },
                  { num: '7', statement: "It's R-O-M-E.", target: 'R-O-M-E' },
                ].map((item) => (
                  <div key={item.num} className={styles.itemRow}>
                    <div className={styles.itemLeft}>
                      <span className={styles.numBadge}>{item.num}</span>
                      <span className={styles.itemSentence}>
                        {item.statement}{' '}
                        <em>(Target: {item.target})</em>
                        {item.example && <span style={{ display: 'block', color: '#0284c7', fontSize: '13px' }}>Example: {item.example}</span>}
                      </span>
                    </div>
                    <div className={styles.itemAction} style={{ width: '100%', maxWidth: '380px' }}>
                      {renderInput('exercise_9_questions', item.num, 'Type your question...', { fullWidth: true })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 4: SPEAKING                                            */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Speaking</span>
              <h2 className={styles.sectionTitle}>Describing a Place to Visit</h2>
            </div>

            {/* Prepare Box */}
            <div className={styles.prepareCard}>
              <span className={styles.prepareLabel}>PREPARE (Ex 10a–b)</span>
              <h3 className={styles.exerciseTitle}>
                Think of another nice place to visit in your country. Make notes about it.
              </h3>
              <p className={styles.exerciseInstruction}>
                Notes ideas: <em>flowers, mountains, beautiful, visit with parents, lake, sea, cheap/expensive</em>.
              </p>
              {renderInput('speaking_notes', 'place_notes', 'Type your notes here...', { fullWidth: true })}
            </div>

            {/* Speak Box & Voice Recorder */}
            <div className={styles.speakCard}>
              <span className={styles.speakLabel}>SPEAK (Ex 11)</span>
              <h3 className={styles.exerciseTitle}>
                Tell your group or teacher about your place.
              </h3>
              <p className={styles.exerciseInstruction}>
                Record your voice answering: What is the name of the place? Where is it? When do you usually go there? Who do you go with? What is special about it?
              </p>

              <AudioAnswerRecorder
                onAudioChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'speaking_place_description')}
                readOnly={readOnly}
              />

              {submissionId && (
                <div style={{ marginTop: '1rem' }}>
                  <SubmissionAudioPlayer
                    submissionId={submissionId}
                    exerciseKey="speaking_place_description"
                    audios={submittedAudios}
                  />
                </div>
              )}
            </div>

            <div className={styles.developBadge}>
              <span>💡 Develop your writing: Page 104 — Write directions using sequence adverbs</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
