'use client';

import React from 'react';
import Image from 'next/image';
import { useLessonContext, LessonContextModel } from '@/context/LessonContext';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import PronounceButton from '@/components/PronounceButton';
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
import styles from './lesson5c.module.scss';

export interface Lesson5CContentProps {
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

export const FALLBACK_ANSWER_KEY_5C: LessonAnswerKey = {
  exercise_1a_matching: {
    '1': ['tea', 'Tea', 'cup of tea', 'a cup of tea'],
    '2': ['milk', 'Milk', 'bottle of milk', 'a bottle of milk'],
    '3': ['cakes', 'Cakes', 'cake', 'cupcakes'],
    '4': ['sugar', 'Sugar'],
    '5': ['sandwiches', 'Sandwiches', 'sandwich'],
    '6': ['salad', 'Salad'],
    '7': ['fish', 'Fish', 'salmon'],
    '8': ['bread', 'Bread'],
    '9': ['eggs', 'Eggs', 'egg'],
    '10': ['cheese', 'Cheese'],
    '11': ['meat', 'Meat', 'steaks', 'steak'],
    '12': ['chicken', 'Chicken'],
    '13': ['chocolate', 'Chocolate'],
    '14': ['coffee', 'Coffee', 'cup of coffee'],
  },
  exercise_1c_categories: {
    meat: ['chicken, meat', 'meat, chicken', 'chicken and meat', 'meat and chicken', 'chicken', 'meat'],
    drinks: ['tea, milk, coffee', 'tea, coffee, milk', 'coffee, tea, milk', 'milk, tea, coffee', 'tea', 'milk', 'coffee'],
    sweet_food: ['cakes, sugar, chocolate', 'cakes, chocolate, sugar', 'chocolate, cakes, sugar', 'cakes', 'sugar', 'chocolate'],
  },
  exercise_2_sounds: {
    '1': ['different', 'Different', 'D', 'd'],
    '2': ['same', 'Same', 'S', 's'],
    '3': ['same', 'Same', 'S', 's'],
    '4': ['same', 'Same', 'S', 's'],
    '5': ['same', 'Same', 'S', 's'],
    '6': ['different', 'Different', 'D', 'd'],
    '7': ['same', 'Same', 'S', 's'],
  },
  exercise_4a_tick: {
    tea: ['true', 'checked', 'yes'],
    coffee: ['true', 'checked', 'yes'],
    cakes: ['true', 'checked', 'yes'],
    chocolate: ['true', 'checked', 'yes'],
    fish: ['true', 'checked', 'yes'],
    salad: ['true', 'checked', 'yes'],
    meat: ['true', 'checked', 'yes'],
  },
  exercise_5_diagram: {
    '1': ['never', 'Never'],
    '2': ['sometimes', 'Sometimes'],
    '3': ['always', 'Always'],
  },
  exercise_6_grammar: {
    '1': ['before', 'Before'],
    '2': ['How often', 'how often', 'How often / How many'],
  },
  exercise_7a_stress: {
    '1': ['ne', 'never', 'ne-ver'],
    '2': ['some', 'sometimes', 'some-times'],
    '3': ['of', 'often', 'of-ten'],
    '4': ['u', 'usually', 'u-sually'],
    '5': ['al', 'always', 'al-ways'],
  },
  exercise_8a_adverbs: {
    '1': ['always', 'usually', 'often', 'sometimes', 'never'],
    '2': ['always', 'usually', 'often', 'sometimes', 'never'],
    '3': ['always', 'usually', 'often', 'sometimes', 'never'],
    '4': ['always', 'usually', 'often', 'sometimes', 'never'],
    '5': ['always', 'usually', 'often', 'sometimes', 'never'],
    '6': ['always', 'usually', 'often', 'sometimes', 'never'],
    '7': ['always', 'usually', 'often', 'sometimes', 'never'],
    '8': ['always', 'usually', 'often', 'sometimes', 'never'],
  },
  exercise_9a_questions: {
    '1': ['How often do you have breakfast at work?', 'How often do you have breakfast at work'],
    '2': ['How often do you have eggs for breakfast?', 'How often do you have eggs for breakfast'],
    '3': ['How often do you buy sandwiches for lunch?', 'How often do you buy sandwiches for lunch'],
    '4': [
      'How often do you drink coffee or tea?',
      'How often do you drink coffee or tea',
      'How often do you drink tea or coffee?',
      'How often do you drink tea or coffee',
    ],
    '5': ['How often do you have dinner at home?', 'How often do you have dinner at home'],
    '6': ['How often do you eat sweet food?', 'How often do you eat sweet food'],
  },
};

const FOOD_ITEMS = [
  { id: '1', name: 'tea', src: '/images/lesson5c/food_1_tea.png', alt: 'A cup of tea with saucer' },
  { id: '2', name: 'milk', src: '/images/lesson5c/food_2_milk_v2.png', alt: 'A bottle and glass of milk' },
  { id: '3', name: 'cakes', src: '/images/lesson5c/food_3_cakes.png', alt: 'Decorated cupcakes' },
  { id: '4', name: 'sugar', src: '/images/lesson5c/food_4_sugar_v2.png', alt: 'Bowl of white sugar' },
  { id: '5', name: 'sandwiches', src: '/images/lesson5c/food_5_sandwiches_v2.png', alt: 'Triangular sandwiches' },
  { id: '6', name: 'salad', src: '/images/lesson5c/food_6_salad.png', alt: 'Fresh vegetable green salad' },
  { id: '7', name: 'fish', src: '/images/lesson5c/food_7_fish.png', alt: 'Grilled salmon fish fillet' },
  { id: '8', name: 'bread', src: '/images/lesson5c/food_8_bread.png', alt: 'Loaf of sliced brown bread' },
  { id: '9', name: 'eggs', src: '/images/lesson5c/food_9_eggs.png', alt: 'Brown chicken eggs' },
  { id: '10', name: 'cheese', src: '/images/lesson5c/food_10_cheese.png', alt: 'A block of yellow cheese' },
  { id: '11', name: 'meat', src: '/images/lesson5c/food_11_meat.png', alt: 'Raw red meat steaks' },
  { id: '12', name: 'chicken', src: '/images/lesson5c/food_12_chicken_v2.png', alt: 'Roast chicken portions' },
  { id: '13', name: 'chocolate', src: '/images/lesson5c/food_13_chocolate_v2.png', alt: 'Dark chocolate bar squares' },
  { id: '14', name: 'coffee', src: '/images/lesson5c/food_14_coffee_v2.png', alt: 'A cup of hot black coffee' },
];

const FOOD_WORDS_LIST = [
  'bread', 'cakes', 'cheese', 'chicken', 'chocolate', 'coffee',
  'eggs', 'fish', 'meat', 'milk', 'salad', 'sandwiches', 'sugar', 'tea',
];

const SOUND_PAIRS = [
  { num: '1', pair: 'bread / tea', expected: 'different' },
  { num: '2', pair: 'cakes / make', expected: 'same' },
  { num: '3', pair: 'cheese / tea', expected: 'same' },
  { num: '4', pair: 'chicken / milk', expected: 'same' },
  { num: '5', pair: 'coffee / chocolate', expected: 'same' },
  { num: '6', pair: 'eat / bread', expected: 'different' },
  { num: '7', pair: 'fish / drink', expected: 'same' },
];

const STRESS_EXERCISE_ITEMS = [
  {
    num: '1',
    before: 'I',
    word: 'never',
    after: 'drink tea.',
    full: 'I never drink tea.',
    options: [
      { label: 'NE-ver', value: 'ne' },
      { label: 'ne-VER', value: 'ver' },
    ],
  },
  {
    num: '2',
    before: "I'm",
    word: 'sometimes',
    after: 'late home for dinner.',
    full: "I'm sometimes late home for dinner.",
    options: [
      { label: 'SOME-times', value: 'some' },
      { label: 'some-TIMES', value: 'times' },
    ],
  },
  {
    num: '3',
    before: 'I',
    word: 'often',
    after: 'eat sandwiches for lunch.',
    full: 'I often eat sandwiches for lunch.',
    options: [
      { label: 'OF-ten', value: 'of' },
      { label: 'of-TEN', value: 'ten' },
    ],
  },
  {
    num: '4',
    before: 'I',
    word: 'usually',
    after: 'have lunch in a café.',
    full: 'I usually have lunch in a café.',
    options: [
      { label: 'U-sually', value: 'u' },
      { label: 'u-SUAL-ly', value: 'sual' },
    ],
  },
  {
    num: '5',
    before: 'I',
    word: 'always',
    after: 'have milk and sugar in my coffee.',
    full: 'I always have milk and sugar in my coffee.',
    options: [
      { label: 'AL-ways', value: 'al' },
      { label: 'al-WAYS', value: 'ways' },
    ],
  },
];

const RADIO_FOODS = [
  { key: 'tea', label: 'tea' },
  { key: 'coffee', label: 'coffee' },
  { key: 'cakes', label: 'cakes' },
  { key: 'chocolate', label: 'chocolate' },
  { key: 'fish', label: 'fish' },
  { key: 'salad', label: 'salad' },
  { key: 'meat', label: 'meat' },
  { key: 'cheese', label: 'cheese' },
  { key: 'eggs', label: 'eggs' },
  { key: 'bread', label: 'bread' },
];

const EX_8A_SENTENCES = [
  { id: '1', before: '1 I', after: 'eat meat.' },
  { id: '2', before: '2 I', after: 'have chocolate at work.' },
  { id: '3', before: '3 I', after: 'drink milk.' },
  { id: '4', before: '4 I', after: 'have sugar in my coffee or tea.' },
  { id: '5', before: '5 I', after: 'have cakes for breakfast.' },
  { id: '6', before: '6 I', after: 'have fish for dinner.' },
  { id: '7', before: '7 I', after: 'eat cheese and bread.' },
  { id: '8', before: '8 I', after: 'eat sandwiches for dinner.' },
];

const ADVERB_OPTIONS = [
  { label: 'always', value: 'always' },
  { label: 'usually', value: 'usually' },
  { label: 'often', value: 'often' },
  { label: 'sometimes', value: 'sometimes' },
  { label: 'never', value: 'never' },
];

const SURVEY_QUESTIONS = [
  {
    num: '1',
    prompt: 'have / How often / breakfast at work / do you / ?',
    fullQuestion: 'How often do you have breakfast at work?',
  },
  {
    num: '2',
    prompt: 'eggs / for breakfast / How often / you / do / have / ?',
    fullQuestion: 'How often do you have eggs for breakfast?',
  },
  {
    num: '3',
    prompt: 'How often / you / do / buy / for lunch / sandwiches / ?',
    fullQuestion: 'How often do you buy sandwiches for lunch?',
  },
  {
    num: '4',
    prompt: 'coffee / drink / How often / do / or tea / you / ?',
    fullQuestion: 'How often do you drink coffee or tea?',
  },
  {
    num: '5',
    prompt: 'have dinner / at home / you / How often / do / ?',
    fullQuestion: 'How often do you have dinner at home?',
  },
  {
    num: '6',
    prompt: 'How often / sweet food / do / eat / you / ?',
    fullQuestion: 'How often do you eat sweet food?',
  },
];

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

export default function Lesson5CContent(props: Lesson5CContentProps) {
  const context = useLessonContext();

  const isTeacherReview = props.isTeacherReview ?? context.isTeacher ?? false;
  const readOnly = props.readOnly ?? context.isReadOnly ?? false;
  const playAudio = props.playAudio ?? context.playAudio;
  const playingAudio = props.playingAudio ?? context.playingAudio;
  const originalAnswers = props.originalAnswers ?? context.answers ?? {};

  const activeAnswerKey: LessonAnswerKey =
    props.answerKey ||
    (context.answerKey as LessonAnswerKey) ||
    (context.lesson?.answerKey as LessonAnswerKey) ||
    FALLBACK_ANSWER_KEY_5C;

  const isReview = Boolean(isTeacherReview || (activeAnswerKey && readOnly));

  const handleFieldChange = (exerciseName: string, field: string, val: string) => {
    if (context?.setAnswerField) {
      context.setAnswerField(exerciseName, field, val);
    }
  };

  const verify = (exerciseName: string, field: string, val: string): VerificationResult | null => {
    if (!isReview) return null;
    const exerciseKey = getExerciseKey(activeAnswerKey, exerciseName);
    return verifyAnswer(val, exerciseKey?.[field]);
  };

  const renderInput = (
    exerciseName: string,
    field: string,
    placeholder: string,
    options?: { fullWidth?: boolean; customClass?: string }
  ) => {
    const currentVal = (getRecord(originalAnswers[exerciseName]))[field] || '';
    const v = verify(exerciseName, field, currentVal);

    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.2rem', width: options?.fullWidth ? '100%' : 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
          <input
            type="text"
            value={currentVal}
            onChange={(e) => handleFieldChange(exerciseName, field, e.target.value)}
            placeholder={placeholder}
            disabled={readOnly}
            className={`${styles.inlineInput} ${options?.customClass || ''} ${
              v?.status === 'correct'
                ? styles.diffHighlight
                : v?.status === 'incorrect'
                ? styles.diffHighlight
                : ''
            }`}
            style={{ width: options?.fullWidth ? '100%' : 'auto' }}
          />
          {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
        </div>
        {v && v.status !== 'correct' && (
          <div className={styles.feedbackRow}>
            <TeacherAnswerBadge result={v} />
          </div>
        )}
      </div>
    );
  };

  const renderSelect = (
    exerciseName: string,
    field: string,
    optionsList: { label: string; value: string }[]
  ) => {
    const currentVal = (getRecord(originalAnswers[exerciseName]))[field] || '';
    const v = verify(exerciseName, field, currentVal);

    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <select
            value={currentVal}
            onChange={(e) => handleFieldChange(exerciseName, field, e.target.value)}
            disabled={readOnly}
            className={styles.inlineInput}
          >
            <option value="">-- select --</option>
            {optionsList.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
        </div>
        {v && v.status !== 'correct' && (
          <div className={styles.feedbackRow}>
            <TeacherAnswerBadge result={v} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.lessonContainer}>
      {/* Header Banner 5C */}
      <header className={styles.lessonHeader}>
        <div>
          <div className={styles.lessonMeta}>
            <span className={styles.unitBadge}>5C</span>
          </div>
          <h1 className={styles.lessonTitle}>
            <span className={styles.titleIcon}>🥗</span>
            <span>Food and drink</span>
          </h1>
        </div>
      </header>

      {/* Goals Banner */}
      <div className={styles.goalsBanner}>
        <div><strong>Goal:</strong> take part in a survey about being healthy</div>
        <div><strong>Grammar:</strong> present simple with frequency adverbs</div>
        <div><strong>Vocabulary:</strong> food and drink</div>
      </div>

      <div className={styles.contentBody}>
        {/* SECTION 1: Vocabulary: Food and drink (p. 42) */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🥐</span>
              <span>Vocabulary: Food and drink</span>
            </h2>
          </div>

          {/* Exercise 1a: Match words with photos */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>1a</span>
              <strong>Match the words with photos 1–14.</strong>
            </p>

            {/* Word bank */}
            <div className={styles.wordBox}>
              <strong>Words:</strong> {FOOD_WORDS_LIST.join(' • ')}
            </div>

            {/* Food Grid */}
            <div className={styles.foodGrid}>
              {FOOD_ITEMS.map((item) => (
                <div key={item.id} className={styles.foodCard}>
                  <div className={styles.foodWrapper}>
                    <span className={styles.foodBadge}>{item.id}</span>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      unoptimized
                      className={styles.foodImage}
                      sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className={styles.foodFooter}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                        #{item.id}
                      </span>
                      <PronounceButton word={item.name} size="small" />
                    </div>
                    {renderInput('exercise_1a_matching', item.id, 'Food word...', { fullWidth: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise 1b & 1c: Categories */}
          <div className={styles.exerciseCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>1b</span>
                <strong>Listen and repeat the words in Exercise 1a.</strong>
              </p>
              {playAudio && (
                <button
                  type="button"
                  onClick={() => playAudio('5.10')}
                  className={styles.audioBtn}
                >
                  {playingAudio === '5.10' || playingAudio === '/audio/5.10.mp3' ? '⏸ Playing 5.10' : '▶ Audio 5.10'}
                </button>
              )}
            </div>

            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>1c</span>
                <strong>Which words in Exercise 1a are:</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ minWidth: '130px', fontWeight: 600 }}>1 meat?</span>
                  {renderInput('exercise_1c_categories', 'meat', 'e.g. chicken, meat', { fullWidth: true })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ minWidth: '130px', fontWeight: 600 }}>2 drinks?</span>
                  {renderInput('exercise_1c_categories', 'drinks', 'e.g. tea, milk, coffee', { fullWidth: true })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ minWidth: '130px', fontWeight: 600 }}>3 sweet food?</span>
                  {renderInput('exercise_1c_categories', 'sweet_food', 'e.g. cakes, sugar, chocolate', { fullWidth: true })}
                </div>
              </div>
            </div>
          </div>

          {/* Exercise 2: Pronunciation Vowel Sounds */}
          <div className={styles.exerciseCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>2</span>
                <strong>Listen to the vowel sounds in each pair. Are the sounds the same (S) or different (D)?</strong>
              </p>
              {playAudio && (
                <button
                  type="button"
                  onClick={() => playAudio('5.11')}
                  className={styles.audioBtn}
                >
                  {playingAudio === '5.11' || playingAudio === '/audio/5.11.mp3' ? '⏸ Playing 5.11' : '▶ Audio 5.11'}
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              {SOUND_PAIRS.map((pairItem) => (
                <div
                  key={pairItem.num}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#f8fafc',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{pairItem.num}</span>
                    <span>{pairItem.pair}</span>
                    <PronounceButton word={pairItem.pair} size="small" />
                  </div>
                  {renderSelect('exercise_2_sounds', pairItem.num, [
                    { label: 'Same (S)', value: 'same' },
                    { label: 'Different (D)', value: 'different' },
                  ])}
                </div>
              ))}
            </div>
          </div>

          {/* Exercise 3: Pairwork Likes / Dislikes */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>3</span>
              <strong>Work in pairs. Which food and drink in Exercise 1a do you like? Which don&apos;t you like? Tell your partner.</strong>
            </p>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', color: '#166534' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong>A:</strong> I like coffee, but I don&apos;t like tea.
                <PronounceButton word="I like coffee, but I don't like tea." size="small" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <strong>B:</strong> Really? I love tea!
                <PronounceButton word="Really? I love tea!" size="small" />
              </div>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <label htmlFor="ex3-personal-food" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', color: '#334155' }}>
                Write your food likes and dislikes:
              </label>
              {renderInput('exercise_3_likes', 'my_likes', 'e.g. I like chicken and salad, but I never eat fish...', { fullWidth: true })}
            </div>
          </div>
        </section>

        {/* SECTION 2: Reading & Grammar: Frequency adverbs (p. 43) */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📊</span>
              <span>Reading & Grammar: Frequency adverbs</span>
            </h2>
          </div>

          {/* Exercise 4a: Radio programme tick list */}
          <div className={styles.exerciseCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>4a</span>
                <strong>Listen to a radio programme. Tick (✓) the food and drink that people talk about.</strong>
              </p>
              {playAudio && (
                <button
                  type="button"
                  onClick={() => playAudio('5.12')}
                  className={styles.audioBtn}
                >
                  {playingAudio === '5.12' || playingAudio === '/audio/5.12.mp3' ? '⏸ Playing 5.12' : '▶ Audio 5.12'}
                </button>
              )}
            </div>

            <div className={styles.tickList}>
              {RADIO_FOODS.map((item) => {
                const isChecked = (getRecord(originalAnswers.exercise_4a_tick))[item.key] === 'true';
                return (
                  <label
                    key={item.key}
                    className={`${styles.tickCard} ${isChecked ? styles.tickSelected : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_4a_tick', item.key, e.target.checked ? 'true' : '')
                      }
                    />
                    <span style={{ fontWeight: isChecked ? 600 : 400, textTransform: 'capitalize' }}>
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Exercise 5: Frequency scale diagram */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>5</span>
              <strong>Look at the scale and complete 1–3 with the adverbs: <em>always</em>, <em>never</em>, <em>sometimes</em>.</strong>
            </p>

            <div className={styles.frequencyDiagram}>
              <div className={styles.scaleTrack}>
                <div className={styles.scaleStep}>
                  <span className={styles.percentTag}>0%</span>
                  <span>1</span>
                  {renderSelect('exercise_5_diagram', '1', [
                    { label: 'never', value: 'never' },
                    { label: 'sometimes', value: 'sometimes' },
                    { label: 'always', value: 'always' },
                  ])}
                </div>
                <div className={styles.scaleStep}>
                  <span className={styles.percentTag}>~30%</span>
                  <span>2</span>
                  {renderSelect('exercise_5_diagram', '2', [
                    { label: 'never', value: 'never' },
                    { label: 'sometimes', value: 'sometimes' },
                    { label: 'always', value: 'always' },
                  ])}
                </div>
                <div className={styles.scaleStep}>
                  <span className={styles.percentTag}>~60%</span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>often</span>
                </div>
                <div className={styles.scaleStep}>
                  <span className={styles.percentTag}>~80%</span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>usually</span>
                </div>
                <div className={styles.scaleStep}>
                  <span className={styles.percentTag}>100%</span>
                  <span>3</span>
                  {renderSelect('exercise_5_diagram', '3', [
                    { label: 'never', value: 'never' },
                    { label: 'sometimes', value: 'sometimes' },
                    { label: 'always', value: 'always' },
                  ])}
                </div>
              </div>
            </div>
          </div>

          {/* Exercise 6: Grammar Rules & Reference */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>6</span>
              <strong>Choose the correct alternatives to complete the grammar rules.</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span>1 Frequency adverbs usually go</span>
                {renderSelect('exercise_6_grammar', '1', [
                  { label: 'before', value: 'before' },
                  { label: 'after', value: 'after' },
                ])}
                <span>the main verb. (e.g. <em>I usually eat chocolate at work.</em>)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span>2 We use</span>
                {renderSelect('exercise_6_grammar', '2', [
                  { label: 'How often', value: 'How often' },
                  { label: 'How many', value: 'How many' },
                ])}
                <span>to ask questions about frequency. (e.g. <em>How often do you drink coffee?</em>)</span>
              </div>
            </div>

            {/* Grammar Box */}
            <div className={styles.grammarBox}>
              <h4>Grammar reference: Frequency adverbs</h4>
              <p>
                • Before most verbs: <em>I <strong>always</strong> have breakfast.</em> / <em>They <strong>never</strong> eat meat.</em>
              </p>
              <p>
                • After the verb <em>to be</em>: <em>I am <strong>never</strong> hungry in the morning.</em> / <em>She is <strong>usually</strong> happy.</em>
              </p>
              <p>
                • Questions: <em><strong>How often</strong> do you eat fish? — Once a week. / I <strong>sometimes</strong> eat fish.</em>
              </p>
            </div>
          </div>

          {/* Exercise 7a & 7b: Pronunciation Syllable Stress */}
          <div className={styles.exerciseCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>7a</span>
                <strong>Listen to the sentences. Identify the stressed syllable in each frequency adverb.</strong>
              </p>
              {playAudio && (
                <button
                  type="button"
                  onClick={() => playAudio('5.13')}
                  className={styles.audioBtn}
                >
                  {playingAudio === '5.13' || playingAudio === '/audio/5.13.mp3' ? '⏸ Playing 5.13' : '▶ Audio 5.13'}
                </button>
              )}
            </div>

            {/* Pronunciation tip */}
            <div className={styles.stressTipBox}>
              <span className={styles.tipIcon}>💡</span>
              <div>
                <strong>Stress rule:</strong> In English, these frequency adverbs are stressed on the <strong>first</strong> syllable (e.g. <strong>NE</strong>-ver, <strong>AL</strong>-ways). Listen to the audio and select the stressed syllable.
              </div>
            </div>

            {/* Sentences List */}
            <div className={styles.stressList}>
              {STRESS_EXERCISE_ITEMS.map((item) => {
                const currentVal = (getRecord(originalAnswers.exercise_7a_stress))[item.num] || '';
                const v = verify('exercise_7a_stress', item.num, currentVal);

                return (
                  <div key={item.num} className={styles.stressSentenceCard}>
                    <div className={styles.stressSentenceHeader}>
                      <span className={styles.stressNumBadge}>{item.num}</span>
                      <div className={styles.stressSentenceText}>
                        <span>{item.before} </span>
                        <span className={styles.stressWordHighlight}>{item.word}</span>
                        <span> {item.after}</span>
                      </div>
                      <PronounceButton word={item.full} size="small" />
                    </div>

                    <div className={styles.stressPillsWrap}>
                      <span className={styles.stressSyllablePrompt}>Stress:</span>
                      <div className={styles.stressPillsContainer} role="radiogroup" aria-label={`Stressed syllable for ${item.word}`}>
                        {item.options.map((opt) => {
                          const isSelected = currentVal === opt.value;
                          let pillClass = styles.stressPillBtn;
                          if (isSelected) {
                            if (v) {
                              pillClass += v.isCorrect ? ` ${styles.pillCorrect}` : ` ${styles.pillIncorrect}`;
                            } else {
                              pillClass += ` ${styles.pillActive}`;
                            }
                          } else if (v && !v.isCorrect && v.expectedDisplay?.toLowerCase().includes(opt.value)) {
                            pillClass += ` ${styles.pillExpected}`;
                          }

                          return (
                            <button
                              key={opt.value}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              disabled={readOnly}
                              onClick={() => handleFieldChange('exercise_7a_stress', item.num, opt.value)}
                              className={pillClass}
                            >
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {v && (
                        <div className={styles.stressValidationWrap}>
                          <span>{v.isCorrect ? '✅' : '❌'}</span>
                          {!v.isCorrect && (
                            <TeacherAnswerBadge result={v} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Exercise 7b: Repeat */}
            <div className={styles.repeatSection}>
              <div>
                <p className={styles.exInstruction} style={{ margin: 0 }}>
                  <span className={styles.exBadge}>7b</span>
                  <strong>Listen again and repeat the sentences with the correct stress.</strong>
                </p>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#64748b' }}>
                  Make the stressed syllable louder and slightly higher in pitch.
                </p>
              </div>
              {playAudio && (
                <button
                  type="button"
                  onClick={() => playAudio('5.13')}
                  className={styles.audioBtn}
                >
                  {playingAudio === '5.13' || playingAudio === '/audio/5.13.mp3' ? '⏸ Playing 5.13' : '▶ Audio 5.13'}
                </button>
              )}
            </div>
          </div>

          {/* Exercise 8a & 8b: Complete sentences with frequency adverbs true for you */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>8a</span>
              <strong>Complete the sentences with frequency adverbs so they are true for you.</strong>
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', background: '#f0fdf4', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
              <span>Frequency adverbs:</span>
              <span>always (100%)</span>
              <span>usually (~80%)</span>
              <span>often (~60%)</span>
              <span>sometimes (~30%)</span>
              <span>never (0%)</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              {EX_8A_SENTENCES.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#ffffff',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.9rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.before}</span>
                  {renderSelect('exercise_8a_adverbs', item.id, ADVERB_OPTIONS)}
                  <span style={{ color: '#334155' }}>{item.after}</span>
                </div>
              ))}
            </div>

            {/* Exercise 8b: Pairwork comparing answers */}
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>8b</span>
                <strong>Work in pairs and compare your answers.</strong>
              </p>

              <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong>A:</strong> I sometimes have cakes for breakfast.
                  <PronounceButton word="I sometimes have cakes for breakfast." size="small" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <strong>B:</strong> Really? I never have cakes for breakfast!
                  <PronounceButton word="Really? I never have cakes for breakfast!" size="small" />
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <label htmlFor="ex8b-compare" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                  Write your comparison sentence with a partner:
                </label>
                {renderInput('exercise_8b_compare', 'text', 'e.g. I usually drink coffee, but Maria always drinks tea...', { fullWidth: true })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Speaking: Healthy lifestyle survey (p. 43) */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🤾‍♀️</span>
              <span>Speaking: Healthy lifestyle survey</span>
            </h2>
          </div>

          <div className={styles.speakingGrid}>
            {/* Left: Survey exercises 9, 10, 11 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Exercise 9a: Put words in order to make questions */}
              <div className={styles.exerciseCard}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>9a</span>
                  <strong>Put the words in the correct order to make questions.</strong>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {SURVEY_QUESTIONS.map((q) => (
                    <div key={q.num}>
                      <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                        <strong>{q.num}</strong> {q.prompt}
                      </span>
                      {renderInput('exercise_9a_questions', q.num, 'How often do you...', { fullWidth: true })}
                    </div>
                  ))}
                </div>

                {/* Exercise 9b: Pairwork asking & answering 9a questions */}
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                  <p className={styles.exInstruction}>
                    <span className={styles.exBadge}>9b</span>
                    <strong>Work in pairs. Take turns asking and answering the questions in Exercise 9a.</strong>
                  </p>

                  <div style={{ background: '#f0fdf4', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #bbf7d0', marginTop: '0.5rem', fontSize: '0.9rem', color: '#166534' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong>A:</strong> How often do you have breakfast at work?
                      <PronounceButton word="How often do you have breakfast at work?" size="small" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <strong>B:</strong> I never have breakfast at work. I always have breakfast at home.
                      <PronounceButton word="I never have breakfast at work. I always have breakfast at home." size="small" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercise 10: PREPARE (Turn to page 154) */}
              <div className={styles.exerciseCard}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>10</span>
                  <strong>PREPARE: Complete the healthy lifestyle questionnaire with your answers (Page 154).</strong>
                </p>

                <div className={styles.surveyTableWrap}>
                  <table className={styles.surveyTable}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Survey Question</th>
                        <th>My Answer (Exercise 10)</th>
                        <th>Partner&apos;s Answer (Exercise 11a)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SURVEY_QUESTIONS.map((q) => (
                        <tr key={q.num}>
                          <td style={{ fontWeight: 700 }}>{q.num}</td>
                          <td>{q.fullQuestion}</td>
                          <td>
                            {renderSelect('exercise_10_prepare', `my_${q.num}`, ADVERB_OPTIONS)}
                          </td>
                          <td>
                            {renderSelect('exercise_11a_partner', `partner_${q.num}`, ADVERB_OPTIONS)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Exercise 11a & 11b: SPEAK */}
              <div className={styles.exerciseCard}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>11a & 11b</span>
                  <strong>SPEAK: Work in pairs. Ask your partner the questions, compare your answers, and report back. Who is healthier?</strong>
                </p>

                <div style={{ marginTop: '0.5rem' }}>
                  <label htmlFor="healthy-conclusion" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                    Summary report (e.g. <em>My partner eats salad every day and never drinks sweet drinks, so she is healthier than me...</em>):
                  </label>
                  <textarea
                    id="healthy-conclusion"
                    value={(getRecord(originalAnswers.exercise_11b_summary))['text'] || ''}
                    onChange={(e) => handleFieldChange('exercise_11b_summary', 'text', e.target.value)}
                    placeholder="Write what you discovered from your partner's answers..."
                    disabled={readOnly}
                    className={styles.inlineInput}
                    style={{ minHeight: '80px', width: '100%', resize: 'vertical' }}
                  />
                </div>

                {/* Audio voice recording for spoken report */}
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #cbd5e1' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>
                    🎙️ Record your spoken report for your teacher:
                  </p>
                  {!readOnly && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <AudioAnswerRecorder
                        onAudioChange={props.onAudioBlobChange}
                        readOnly={readOnly}
                      />
                    </div>
                  )}
                  {props.submissionId && (
                    <SubmissionAudioPlayer
                      submissionId={props.submissionId}
                      exerciseKey="exercise_11_speaking"
                      audios={props.submittedAudios}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right: Netball photo and Develop writing badge */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.netballPhotoWrap}>
                <Image
                  src="/images/lesson5c/speaking_netball.png"
                  alt="Women playing netball on outdoor court"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 350px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className={styles.developWritingBadge}>
                <span>✍️</span>
                <span>Develop your writing — page 100</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
