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
import styles from './lesson5d.module.scss';

export interface Lesson5DContentProps {
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

export const FALLBACK_ANSWER_KEY_5D: LessonAnswerKey = {
  exercise_2_menu_tick: {
    chicken_sandwich: ['true', 'checked', 'yes'],
    coffee: ['true', 'checked', 'yes'],
    chocolate_cupcake: ['true', 'checked', 'yes'],
  },
  exercise_3_conversation: {
    '1': ['chicken', 'a chicken', 'Chicken'],
    '2': ['bread', 'Bread'],
    '3': ['White', 'white'],
    '4': ['black coffee', 'coffee', 'Black coffee'],
    '5': ['sugar', 'Sugar'],
    '6': ['£6.45', '6.45', '£4.00', '4.00', '£7.45', '7.45'],
  },
  exercise_4a_phrases: {
    '1': ['a', 'A'],
    '2': ['d', 'D'],
    '3': ['c', 'C'],
    '4': ['b', 'B'],
    '5': ['e', 'E'],
  },
  exercise_5a_order: {
    '1': ['g', 'G'],
    '2': ['c', 'C'],
    '3': ['e', 'E'],
    '4': ['b', 'B'],
    '5': ['f', 'F'],
    '6': ['i', 'I'],
    '7': ['a', 'A'],
    '8': ['d', 'D'],
    '9': ['h', 'H'],
  },
  exercise_1_reflect_days: {
    '1': ['Monday', 'monday', 'onday'],
    '2': ['Tuesday', 'tuesday', 'uesday'],
    '3': ['Wednesday', 'wednesday', 'ednesday'],
    '4': ['Thursday', 'thursday', 'ursday'],
    '5': ['Friday', 'friday', 'riday'],
    '6': ['Saturday', 'saturday', 'aturday'],
    '7': ['Sunday', 'sunday', 'unday'],
  },
  exercise_2_reflect_match: {
    '1': ['f', 'F'],
    '2': ['c', 'C'],
    '3': ['d', 'D'],
    '4': ['b', 'B'],
    '5': ['e', 'E'],
    '6': ['a', 'A'],
  },
  exercise_3_reflect_order: {
    '1': ['I get up late on Sundays.', 'I get up late on Sundays'],
    '2': ['We have breakfast at 7 o\'clock.', 'We have breakfast at 7 o\'clock', 'We have breakfast at 7:00.', 'We have breakfast at 7:00'],
    '3': ['They don\'t work every day.', 'They don\'t work every day', 'They do not work every day.'],
    '4': ['You don\'t study on Saturdays.', 'You don\'t study on Saturdays', 'You do not study on Saturdays.'],
    '5': [
      'We watch TV on Saturdays and Sundays.',
      'We watch TV on Saturdays and Sundays',
      'We watch TV on Sundays and Saturdays.',
      'We watch TV on Sundays and Saturdays',
    ],
    '6': ['They go home at 5 o\'clock.', 'They go home at 5 o\'clock', 'They go home at 5:00.', 'They go home at 5:00'],
  },
  exercise_4_reflect_negative: {
    '1': ['They don\'t play football on Sundays.', 'They don\'t play football on Sundays', 'They do not play football on Sundays.'],
    '2': ['We don\'t have lunch at one thirty.', 'We don\'t have lunch at one thirty', 'We do not have lunch at one thirty.'],
    '3': ['They don\'t go to bed at 10 o\'clock.', 'They don\'t go to bed at 10 o\'clock', 'They do not go to bed at 10 o\'clock.'],
    '4': ['I don\'t work from Monday to Friday.', 'I don\'t work from Monday to Friday', 'I do not work from Monday to Friday.'],
    '5': ['They don\'t study at home on Wednesdays.', 'They don\'t study at home on Wednesdays', 'They do not study at home on Wednesdays.'],
    '6': ['I don\'t get up late on Mondays.', 'I don\'t get up late on Mondays', 'I do not get up late on Mondays.'],
  },
  exercise_5_reflect_crossword: {
    '1': ['drive', 'Drive', 'take', 'Take'],
    '2': ['cycle', 'Cycle', 'drive', 'Drive'],
    '3': ['car', 'Car', 'arrive', 'Arrive'],
    '4': ['boat', 'Boat', 'leave', 'Leave'],
    '5': ['travel', 'Travel', 'cycle', 'Cycle'],
    '5_down': ['taxi', 'Taxi', 'cycle', 'Cycle'],
    '6': ['train', 'Train', 'walk', 'Walk'],
    '7': ['taxi', 'Taxi'],
    secret: ['travel', 'Travel'],
    // Backward compatibility
    '1_down': ['drive', 'Drive', 'take', 'Take'],
    '2_down': ['cycle', 'Cycle', 'drive', 'Drive'],
    '3_across': ['car', 'Car', 'arrive', 'Arrive'],
    '4_down': ['boat', 'Boat', 'leave', 'Leave'],
    '5_across': ['travel', 'Travel', 'cycle', 'Cycle'],
    '6_across': ['train', 'Train', 'walk', 'Walk'],
  },
  exercise_6_reflect_verbs: {
    '1': ['cycle', 'Cycle'],
    '2': ['drive', 'Drive'],
    '3': ['take', 'Take'],
    '4_leave': ['leave', 'Leave'],
    '4_arrive': ['arrive', 'Arrive'],
    '5': ['walk', 'Walk'],
    '6': ['travel', 'Travel'],
  },
  exercise_7a_reflect_mistakes: {
    '2': [
      'What time do you arrive at your office?',
      'What time do you arrive at your office',
    ],
    '3': [
      'Do you have a big breakfast every day?',
      'Do you have a big breakfast every day',
    ],
    '5': [
      'Do Simon and Lucy get up early?',
      'Do Simon and Lucy get up early',
    ],
    '6': [
      'What time do you leave the house in the morning?',
      'What time do you leave the house in the morning',
    ],
    '8': [
      'How do your friends travel to university?',
      'How do your friends travel to university',
    ],
  },
  exercise_8a_reflect_anagrams: {
    '1': ['fish', 'Fish'],
    '2': ['cheese', 'Cheese'],
    '3': ['sugar', 'Sugar'],
    '4': ['chocolate', 'Chocolate'],
    '5': ['sandwiches', 'Sandwiches'],
    '6': ['salad', 'Salad'],
    '7': ['chicken', 'Chicken'],
  },
  exercise_8b_reflect_cross: {
    '1': ['sugar cake', 'Sugar cake'],
    '2': ['a cup of meat', 'cup of meat', 'meat'],
    '3': ['a milk sandwich', 'milk sandwich'],
    '4': ['bread salad', 'Bread salad'],
  },
  exercise_9a_reflect_order: {
    '1': [
      'We usually have dinner at 8.30 in the evening.',
      'We usually have dinner at 8.30 in the evening',
      'We usually have dinner at 8:30 in the evening.',
      'We usually have dinner at 8:30 in the evening',
    ],
    '2': [
      'I am never hungry in the morning.',
      'I am never hungry in the morning',
      'I\'m never hungry in the morning.',
      'I\'m never hungry in the morning',
    ],
    '3': [
      'I always have meat or fish for lunch.',
      'I always have meat or fish for lunch',
      'I always have fish or meat for lunch.',
      'I always have fish or meat for lunch',
    ],
    '4': [
      'They are sometimes tired on Friday.',
      'They are sometimes tired on Friday',
      'They\'re sometimes tired on Friday.',
      'They\'re sometimes tired on Friday',
    ],
    '5': [
      'She often drinks coffee at work.',
      'She often drinks coffee at work',
    ],
  },
};

const MENU_TICK_ITEMS = [
  { key: 'cheese_sandwich', label: 'Cheese sandwich (£3.80)' },
  { key: 'egg_sandwich', label: 'Egg sandwich (£3.50)' },
  { key: 'chicken_sandwich', label: 'Chicken sandwich (£4.00)' },
  { key: 'tuna_sandwich', label: 'Tuna sandwich (£4.20)' },
  { key: 'tea', label: 'Tea (£2.20)' },
  { key: 'coffee', label: 'Coffee (black/white) (£2.45)' },
  { key: 'fruit_juice', label: 'Fruit juice (£2.80)' },
  { key: 'mineral_water', label: 'Mineral water (£1.90)' },
  { key: 'chocolate_cupcake', label: 'Chocolate cupcake (£2.20)' },
  { key: 'carrot_cake', label: 'Carrot cake (£2.60)' },
];

const ORDER_LINES_5A = [
  { id: '1', key: '1', prompt: 'First sentence', speaker: 'Café worker' },
  { id: '2', key: '2', prompt: 'Second sentence', speaker: 'Customer' },
  { id: '3', key: '3', prompt: 'Third sentence', speaker: 'Café worker' },
  { id: '4', key: '4', prompt: 'Fourth sentence', speaker: 'Customer' },
  { id: '5', key: '5', prompt: 'Fifth sentence', speaker: 'Café worker' },
  { id: '6', key: '6', prompt: 'Sixth sentence', speaker: 'Customer' },
  { id: '7', key: '7', prompt: 'Seventh sentence', speaker: 'Customer' },
  { id: '8', key: '8', prompt: 'Eighth sentence', speaker: 'Café worker' },
  { id: '9', key: '9', prompt: 'Ninth sentence', speaker: 'Customer' },
];

const ORDER_CHOICES_POOL = [
  { letter: 'a', text: 'No, thank you. How much is that?' },
  { letter: 'b', text: 'White bread, please.' },
  { letter: 'c', text: "I'd like a chicken sandwich, please." },
  { letter: 'd', text: "That's £6.45, please." },
  { letter: 'e', text: 'White bread or brown bread?' },
  { letter: 'f', text: 'Would you like a drink?' },
  { letter: 'g', text: 'What would you like?' },
  { letter: 'h', text: 'Here you are. / Thank you.' },
  { letter: 'i', text: "Yes, please. I'd like a cup of black coffee." },
];

const USEFUL_PHRASES_MATCHING = [
  {
    num: '1',
    worker: 'What would you like?',
    customerLetter: 'a',
    customer: "I'd like (a chicken sandwich), please.",
  },
  {
    num: '2',
    worker: 'Would you like (black coffee) or (white coffee)?',
    customerLetter: 'd',
    customer: '(Black), please.',
  },
  {
    num: '3',
    worker: 'Would you like (a drink)?',
    customerLetter: 'c',
    customer: "Yes, please. I'd like (a bottle of water).",
  },
  {
    num: '4',
    worker: 'Would you like (sugar)?',
    customerLetter: 'b',
    customer: 'No, thank you.',
  },
  {
    num: '5',
    worker: "That's (£5.50), please.",
    customerLetter: 'e',
    customer: 'How much is that?',
  },
];

const CUSTOMER_PHRASES = [
  { letter: 'a', text: "I'd like (a chicken sandwich), please." },
  { letter: 'b', text: 'No, thank you.' },
  { letter: 'c', text: "Yes, please. I'd like (a bottle of water)." },
  { letter: 'd', text: '(Black), please.' },
  { letter: 'e', text: 'How much is that?' },
];

const DAYS_OF_WEEK_EXERCISE = [
  { num: '1', prompt: 'M________', prefix: 'M', expected: 'Monday', isWeekend: false },
  { num: '2', prompt: 'T________', prefix: 'T', expected: 'Tuesday', isWeekend: false },
  { num: '3', prompt: 'W________', prefix: 'W', expected: 'Wednesday', isWeekend: false },
  { num: '4', prompt: 'Th_______', prefix: 'Th', expected: 'Thursday', isWeekend: false },
  { num: '5', prompt: 'F________', prefix: 'F', expected: 'Friday', isWeekend: false },
  { num: '6', prompt: 'Sa_______', prefix: 'Sa', expected: 'Saturday', isWeekend: true },
  { num: '7', prompt: 'Su_______', prefix: 'Su', expected: 'Sunday', isWeekend: true },
];

const CROSSWORD_ITEMS = [
  {
    num: '3',
    direction: 'Across',
    label: '3 Across',
    clue: 'A four-wheeled road vehicle. (3 letters, _ _ R)',
    word: 'car',
    field: '3',
  },
  {
    num: '5',
    direction: 'Across',
    label: '5 Across',
    clue: 'Go from one place to another. (6 letters, T _ _ V _ _)',
    word: 'travel',
    field: '5',
  },
  {
    num: '6',
    direction: 'Across',
    label: '6 Across',
    clue: 'Commuter railway transport. (5 letters, T _ _ _ _)',
    word: 'train',
    field: '6',
  },
  {
    num: '1',
    direction: 'Down',
    label: '1 Down',
    clue: 'You ___ a car. (5 letters, D _ _ _ _)',
    word: 'drive',
    field: '1',
  },
  {
    num: '2',
    direction: 'Down',
    label: '2 Down',
    clue: 'You ride or ___ a bike. (5 letters, _ Y _ _ _)',
    word: 'cycle',
    field: '2',
  },
  {
    num: '4',
    direction: 'Down',
    label: '4 Down',
    clue: 'Travel on water. (4 letters, B _ _ _)',
    word: 'boat',
    field: '4',
  },
  {
    num: '5_down',
    direction: 'Down',
    label: '5 Down',
    clue: 'City car with driver you pay for a journey. (4 letters, T _ _ _)',
    word: 'taxi',
    field: '5_down',
  },
];

const ANAGRAMS_LIST = [
  { num: '1', jumble: 'h f i s', expected: 'fish' },
  { num: '2', jumble: 's e h e e c', expected: 'cheese' },
  { num: '3', jumble: 'g u r a s', expected: 'sugar' },
  { num: '4', jumble: 'l a c o c t h e o', expected: 'chocolate' },
  { num: '5', jumble: 'c h e s s a n d w i', expected: 'sandwiches' },
  { num: '6', jumble: 'd a s l a', expected: 'salad' },
  { num: '7', jumble: 'k n e c c h i', expected: 'chicken' },
];

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

export default function Lesson5DContent(props: Lesson5DContentProps) {
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
    FALLBACK_ANSWER_KEY_5D;

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
            <option value="">--</option>
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

  const renderStarRating = (categoryKey: string) => {
    const currentVal = parseInt((getRecord(originalAnswers.self_reflection_stars))[categoryKey] || '0', 10);

    return (
      <div className={styles.starsRow}>
        {[1, 2, 3].map((starNum) => (
          <button
            key={starNum}
            type="button"
            disabled={readOnly}
            onClick={() => handleFieldChange('self_reflection_stars', categoryKey, String(starNum))}
            className={`${styles.starBtn} ${currentVal >= starNum ? styles.starActive : ''}`}
            aria-label={`${starNum} stars`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  // Crossword letter helpers
  const crosswordAnswers = getRecord(originalAnswers.exercise_5_reflect_crossword);
  const allCrosswordDone = CROSSWORD_ITEMS.every((item) => {
    const val = (crosswordAnswers[item.field] || '').trim().toLowerCase();
    return val === item.word;
  });

  return (
    <div className={styles.lessonContainer}>
      {/* Header Banner 5D */}
      <header className={styles.lessonHeader}>
        <div>
          <div className={styles.lessonMeta}>
            <span className={styles.unitBadge}>5D</span>
          </div>
          <h1 className={styles.lessonTitle}>
            <span className={styles.titleIcon}>☕</span>
            <span>English in action & Check and reflect</span>
          </h1>
        </div>
      </header>

      {/* Goals Banner */}
      <div className={styles.goalsBanner}>
        <div><strong>Goal:</strong> order food and a drink in a café</div>
        <div><strong>Review:</strong> daily routines, transport vocabulary, present simple, and frequency adverbs</div>
      </div>

      <div className={styles.contentBody}>
        {/* SECTION 1: English in action — In a café (p. 44) */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🥪</span>
              <span>English in action: In a café</span>
            </h2>
          </div>

          {/* Exercise 1: Dedicated clean layout with Menu and Model Dialogue */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>1</span>
              <strong>Look at the menu. What food and drinks has the café got? Tell your partner.</strong>
            </p>

            <div className={styles.ex1Layout}>
              {/* Left: Authentic Textbook Menu Board */}
              <div className={styles.menuImgCard}>
                <Image
                  src="/images/lesson5d/cafe_menu_v2.png"
                  alt="The Corner Café Menu Board"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 320px"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              {/* Right: Friends Graphic + Model Dialogue */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className={styles.cafeFriendsWrap}>
                  <Image
                    src="/images/lesson5d/cafe_friends_v2.png"
                    alt="Friends ordering at café table"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 450px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#9f1239' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>A:</strong> What food and drinks has the café got?
                    <PronounceButton word="What food and drinks has the café got?" size="small" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                    <strong>B:</strong> It&apos;s got egg, cheese, chicken, and salmon sandwiches, cupcakes, tea, coffee, and water.
                    <PronounceButton word="It's got egg, cheese, chicken, and salmon sandwiches, cupcakes, tea, coffee, and water." size="small" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                    <strong>A:</strong> And it&apos;s got chocolate and coffee cupcakes for £2.50!
                    <PronounceButton word="And it's got chocolate and coffee cupcakes for £2.50!" size="small" />
                  </div>
                </div>

                <div>
                  <label htmlFor="menu-pref" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.25rem' }}>
                    What would you like to order from the menu?
                  </label>
                  {renderInput('exercise_1_menu_talk', 'text', 'e.g. I would like a chicken sandwich and a cup of tea...', { fullWidth: true })}
                </div>
              </div>
            </div>
          </div>

          {/* Exercise 2: Listen and tick what the customer orders */}
          <div className={styles.exerciseCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>2</span>
                <strong>Listen to a woman in the café. Tick (✓) the food and drink she orders.</strong>
              </p>
              {playAudio && (
                <button
                  type="button"
                  onClick={() => playAudio('5.14')}
                  className={styles.audioBtn}
                >
                  {playingAudio === '5.14' || playingAudio === '/audio/5.14.mp3' ? '⏸ Playing 5.14' : '▶ Audio 5.14'}
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
              {MENU_TICK_ITEMS.map((item) => {
                const isChecked = (getRecord(originalAnswers.exercise_2_menu_tick))[item.key] === 'true';
                return (
                  <label
                    key={item.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: isChecked ? '#fff1f2' : '#ffffff',
                      border: `1.5px solid ${isChecked ? '#be123c' : '#e2e8f0'}`,
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_2_menu_tick', item.key, e.target.checked ? 'true' : '')
                      }
                    />
                    <span style={{ fontWeight: isChecked ? 700 : 400, color: isChecked ? '#9f1239' : '#334155' }}>
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Exercise 3: Complete conversation */}
          <div className={styles.exerciseCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>3</span>
                <strong>Listen again. Complete the conversation.</strong>
              </p>
              {playAudio && (
                <button
                  type="button"
                  onClick={() => playAudio('5.14')}
                  className={styles.audioBtn}
                >
                  {playingAudio === '5.14' || playingAudio === '/audio/5.14.mp3' ? '⏸ Playing 5.14' : '▶ Audio 5.14'}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div className={styles.dialogueRow}>
                <strong>Café worker:</strong>
                <span>What would you like?</span>
              </div>
              <div className={styles.dialogueRow}>
                <strong>Customer:</strong>
                <span>I&apos;d like a <strong>1</strong></span>
                {renderInput('exercise_3_conversation', '1', 'food...')}
                <span>sandwich, please.</span>
              </div>
              <div className={styles.dialogueRow}>
                <strong>Café worker:</strong>
                <span>White <strong>2</strong></span>
                {renderInput('exercise_3_conversation', '2', 'item...')}
                <span>or brown bread?</span>
              </div>
              <div className={styles.dialogueRow}>
                <strong>Customer:</strong>
                <span><strong>3</strong></span>
                {renderInput('exercise_3_conversation', '3', 'colour...')}
                <span>bread, please.</span>
              </div>
              <div className={styles.dialogueRow}>
                <strong>Café worker:</strong>
                <span>Would you like a drink?</span>
              </div>
              <div className={styles.dialogueRow}>
                <strong>Customer:</strong>
                <span>Yes, please. I&apos;d like a cup of <strong>4</strong></span>
                {renderInput('exercise_3_conversation', '4', 'drink...')}
                <span>.</span>
              </div>
              <div className={styles.dialogueRow}>
                <strong>Café worker:</strong>
                <span>Would you like <strong>5</strong></span>
                {renderInput('exercise_3_conversation', '5', 'item...')}
                <span>?</span>
              </div>
              <div className={styles.dialogueRow}>
                <strong>Customer:</strong>
                <span>No, thank you. How much is that?</span>
              </div>
              <div className={styles.dialogueRow}>
                <strong>Café worker:</strong>
                <span>That&apos;s <strong>6</strong></span>
                {renderInput('exercise_3_conversation', '6', 'price...')}
                <span>, please.</span>
              </div>
              <div className={styles.dialogueRow}>
                <strong>Customer:</strong>
                <span>Here you are.</span>
              </div>
              <div className={styles.dialogueRow}>
                <strong>Café worker:</strong>
                <span>Thank you.</span>
              </div>
            </div>
          </div>

          {/* Exercise 4a: Useful phrases matching */}
          <div className={styles.exerciseCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>4a</span>
                <strong>Match phrases 1–5 with responses a–e in the Useful phrases box. Then listen and check your answers.</strong>
              </p>
              {playAudio && (
                <button
                  type="button"
                  onClick={() => playAudio('5.15')}
                  className={styles.audioBtn}
                >
                  {playingAudio === '5.15' || playingAudio === '/audio/5.15.mp3' ? '⏸ Playing 5.15' : '▶ Audio 5.15'}
                </button>
              )}
            </div>

            {/* Useful Phrases Matching Board */}
            <div className={styles.usefulMatchBoard}>
              {/* Left Column: Café Worker */}
              <div className={styles.workerCol}>
                <div className={styles.colHeaderBadge}>
                  <span>☕ Café worker (1–5)</span>
                </div>
                <div className={styles.matchingList}>
                  {USEFUL_PHRASES_MATCHING.map((item) => (
                    <div key={item.num} className={styles.matchRowCard}>
                      <div className={styles.phraseTextWrap}>
                        <span className={styles.phraseNumBadge}>{item.num}</span>
                        <span className={styles.phraseMainText}>{item.worker}</span>
                        <PronounceButton word={item.worker} size="small" />
                      </div>
                      <div className={styles.matchSelectWrap}>
                        <span className={styles.matchArrow}>➔</span>
                        {renderSelect('exercise_4a_phrases', item.num, [
                          { label: "a: I'd like (a chicken sandwich), please.", value: 'a' },
                          { label: 'b: No, thank you.', value: 'b' },
                          { label: "c: Yes, please. I'd like (a bottle of water).", value: 'c' },
                          { label: 'd: (Black), please.', value: 'd' },
                          { label: 'e: How much is that?', value: 'e' },
                        ])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Customer */}
              <div className={styles.customerCol}>
                <div className={styles.colHeaderBadge}>
                  <span>🙋 Customer (a–e)</span>
                </div>
                <div className={styles.customerList}>
                  {CUSTOMER_PHRASES.map((item) => (
                    <div key={item.letter} className={styles.customerPhraseCard}>
                      <span className={styles.customerLetterBadge}>{item.letter}</span>
                      <span className={styles.customerPhraseText}>{item.text}</span>
                      <PronounceButton word={item.text} size="small" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Exercise 4b: Listen again and repeat */}
            <div className={styles.repeatSection}>
              <div>
                <p className={styles.exInstruction} style={{ margin: 0 }}>
                  <span className={styles.exBadge}>4b</span>
                  <strong>Listen again and repeat the Useful phrases.</strong>
                </p>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#64748b' }}>
                  Practise both roles: asking polite questions and ordering food and drink.
                </p>
              </div>
              {playAudio && (
                <button
                  type="button"
                  onClick={() => playAudio('5.15')}
                  className={styles.audioBtn}
                >
                  {playingAudio === '5.15' || playingAudio === '/audio/5.15.mp3' ? '⏸ Playing 5.15' : '▶ Audio 5.15'}
                </button>
              )}
            </div>
          </div>

          {/* Exercise 5a, 5b, 5c: Conversation order & Roleplay */}
          <div className={styles.exerciseCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>5a & 5b</span>
                <strong>Put the conversation in order (1–9). Then listen and check.</strong>
              </p>
              {playAudio && (
                <button
                  type="button"
                  onClick={() => playAudio('5.16')}
                  className={styles.audioBtn}
                >
                  {playingAudio === '5.16' || playingAudio === '/audio/5.16.mp3' ? '⏸ Playing 5.16' : '▶ Audio 5.16'}
                </button>
              )}
            </div>

            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem' }}>
              {ORDER_CHOICES_POOL.map((c) => (
                <div key={c.letter}>
                  <strong>{c.letter}</strong> {c.text}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
              {ORDER_LINES_5A.map((line) => (
                <div
                  key={line.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#ffffff',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ fontSize: '0.85rem' }}>
                    <strong>Step {line.key}</strong> ({line.speaker}):
                  </span>
                  {renderSelect(
                    'exercise_5a_order',
                    line.key,
                    ORDER_CHOICES_POOL.map((c) => ({ label: `${c.letter.toUpperCase()}`, value: c.letter }))
                  )}
                </div>
              ))}
            </div>

            {/* Exercise 5c: Pairwork Roleplay Audio Recorder */}
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #e2e8f0' }}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>5c</span>
                <strong>Work in pairs. Practise ordering food and drinks in a café. Swap roles and repeat.</strong>
              </p>

              <div style={{ marginTop: '0.75rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
                  🎙️ Record your café dialogue for your teacher:
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
                    exerciseKey="exercise_5c_cafe_speaking"
                    audios={props.submittedAudios}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Check & Reflect (p. 45) */}
        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🔍</span>
              <span>Check & Reflect (Review of Unit 5)</span>
            </h2>
          </div>

          {/* Exercise 1: Days of the week */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>1</span>
              <strong>Complete the days of the week in order (1–7).</strong>
            </p>

            <div className={styles.daysGrid}>
              {DAYS_OF_WEEK_EXERCISE.map((item) => (
                <div
                  key={item.num}
                  className={`${styles.dayCard} ${item.isWeekend ? styles.dayCardWeekend : ''}`}
                >
                  <div className={styles.dayCardHeader}>
                    <span className={styles.dayNumBadge}>{item.num}</span>
                    {item.isWeekend ? (
                      <span className={styles.weekendTag}>Weekend</span>
                    ) : (
                      <span className={styles.weekdayTag}>Weekday</span>
                    )}
                  </div>
                  <div className={styles.dayPromptWrap}>
                    <span className={styles.dayPrefixHint}>{item.prompt}</span>
                    {isReview && <PronounceButton word={item.expected} size="small" />}
                  </div>
                  <div className={styles.dayInputWrap}>
                    {renderInput('exercise_1_reflect_days', item.num, 'Day...', { fullWidth: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise 2: Daily routine verb phrases */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>2</span>
              <strong>Match verbs 1–6 with phrases a–f.</strong>
            </p>

            <div className={styles.matchOptionsWrap}>
              <span><strong>a</strong> TV</span>
              <span><strong>b</strong> English</span>
              <span><strong>c</strong> to bed</span>
              <span><strong>d</strong> up early</span>
              <span><strong>e</strong> football</span>
              <span><strong>f</strong> breakfast</span>
            </div>

            <div className={styles.matchGrid} style={{ marginTop: '0.5rem' }}>
              {[
                { num: '1', verb: 'have' },
                { num: '2', verb: 'go' },
                { num: '3', verb: 'get' },
                { num: '4', verb: 'study' },
                { num: '5', verb: 'play' },
                { num: '6', verb: 'watch' },
              ].map((item) => (
                <div key={item.num} className={styles.matchCard}>
                  <span><strong>{item.num}</strong> {item.verb}</span>
                  {renderSelect('exercise_2_reflect_match', item.num, [
                    { label: 'a', value: 'a' },
                    { label: 'b', value: 'b' },
                    { label: 'c', value: 'c' },
                    { label: 'd', value: 'd' },
                    { label: 'e', value: 'e' },
                    { label: 'f', value: 'f' },
                  ])}
                </div>
              ))}
            </div>
          </div>

          {/* Exercise 3: Present simple word order */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>3</span>
              <strong>Put the words in order to make sentences.</strong>
            </p>

            <div className={styles.exerciseListCol}>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  1 get up / on Sundays / late / I
                </span>
                {renderInput('exercise_3_reflect_order', '1', 'Sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  2 at 7 o&apos;clock / have breakfast / We
                </span>
                {renderInput('exercise_3_reflect_order', '2', 'Sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  3 every day / They / don&apos;t work
                </span>
                {renderInput('exercise_3_reflect_order', '3', 'Sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  4 on Saturdays / You / don&apos;t study
                </span>
                {renderInput('exercise_3_reflect_order', '4', 'Sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  5 on Saturdays and Sundays / We / watch TV
                </span>
                {renderInput('exercise_3_reflect_order', '5', 'Sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  6 go home / at 5 o&apos;clock / They
                </span>
                {renderInput('exercise_3_reflect_order', '6', 'Sentence...', { fullWidth: true })}
              </div>
            </div>
          </div>

          {/* Exercise 4: Negative sentences */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>4</span>
              <strong>Make the sentences negative.</strong>
            </p>

            <div className={styles.exerciseListCol}>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  1 They play football on Sundays.
                </span>
                {renderInput('exercise_4_reflect_negative', '1', 'Negative sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  2 We have lunch at one thirty.
                </span>
                {renderInput('exercise_4_reflect_negative', '2', 'Negative sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  3 They go to bed at 10 o&apos;clock.
                </span>
                {renderInput('exercise_4_reflect_negative', '3', 'Negative sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  4 I work from Monday to Friday.
                </span>
                {renderInput('exercise_4_reflect_negative', '4', 'Negative sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  5 They study at home on Wednesdays.
                </span>
                {renderInput('exercise_4_reflect_negative', '5', 'Negative sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  6 I get up late on Mondays.
                </span>
                {renderInput('exercise_4_reflect_negative', '6', 'Negative sentence...', { fullWidth: true })}
              </div>
            </div>
          </div>

          {/* Exercise 5: Interactive Transport Crossword */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>5</span>
              <strong>Complete the crossword with seven travel and transport words.</strong>
            </p>

            <div className={styles.crosswordLayout}>
              {/* Left Column: Authentic Diagram */}
              <div className={styles.crosswordDiagramWrap}>
                <div className={styles.crosswordDiagramCard}>
                  <Image
                    src="/images/lesson5d/crossword_diagram.png"
                    alt="Authentic Crossword Puzzle from Textbook"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 320px"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <span className={styles.crosswordDiagramCaption}>
                  Textbook Puzzle (Pre-filled letters: R, Y, B, T, V, T)
                </span>
              </div>

              {/* Right Column: 7 Clues & Inputs */}
              <div className={styles.crosswordCluesWrap}>
                {/* Across Section */}
                <div className={styles.cluesGroup}>
                  <h4 className={styles.cluesGroupTitle}>➔ Across (По горизонтали)</h4>
                  <div className={styles.cluesList}>
                    {CROSSWORD_ITEMS.filter((i) => i.direction === 'Across').map((item) => (
                      <div key={item.field} className={styles.clueCard}>
                        <div className={styles.clueHeader}>
                          <span className={styles.clueBadge}>{item.label}</span>
                          <span className={styles.clueText}>{item.clue}</span>
                          {isReview && <PronounceButton word={item.word} size="small" />}
                        </div>
                        <div className={styles.clueInputRow}>
                          {renderInput('exercise_5_reflect_crossword', item.field, 'Word...')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Down Section */}
                <div className={styles.cluesGroup}>
                  <h4 className={styles.cluesGroupTitle}>⬇ Down (По вертикали)</h4>
                  <div className={styles.cluesList}>
                    {CROSSWORD_ITEMS.filter((i) => i.direction === 'Down').map((item) => (
                      <div key={item.field} className={styles.clueCard}>
                        <div className={styles.clueHeader}>
                          <span className={styles.clueBadge}>{item.label}</span>
                          <span className={styles.clueText}>{item.clue}</span>
                          {isReview && <PronounceButton word={item.word} size="small" />}
                        </div>
                        <div className={styles.clueInputRow}>
                          {renderInput('exercise_5_reflect_crossword', item.field, 'Word...')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Solved Banner */}
                {allCrosswordDone && (
                  <div className={styles.crosswordSolvedBanner}>
                    <span>🎉 7/7 Travel and transport words completed!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Exercise 6: Verbs of transport */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>6</span>
              <strong>Complete the sentences with verbs of transport.</strong>
            </p>

            <div className={styles.exerciseListCol}>
              <div className={styles.sentenceInlineRow}>
                <span>1 I</span>
                {renderInput('exercise_6_reflect_verbs', '1', 'verb...')}
                <span>to work on my bike.</span>
              </div>
              <div className={styles.sentenceInlineRow}>
                <span>2 We</span>
                {renderInput('exercise_6_reflect_verbs', '2', 'verb...')}
                <span>to our friends&apos; house in our new car.</span>
              </div>
              <div className={styles.sentenceInlineRow}>
                <span>3 They</span>
                {renderInput('exercise_6_reflect_verbs', '3', 'verb...')}
                <span>a bus to university.</span>
              </div>
              <div className={styles.sentenceInlineRow}>
                <span>4 I</span>
                {renderInput('exercise_6_reflect_verbs', '4_leave', 'verb...')}
                <span>home at 7.30 and</span>
                {renderInput('exercise_6_reflect_verbs', '4_arrive', 'verb...')}
                <span>at work at 8.15.</span>
              </div>
              <div className={styles.sentenceInlineRow}>
                <span>5 We</span>
                {renderInput('exercise_6_reflect_verbs', '5', 'verb...')}
                <span>to the shops because they are near our house.</span>
              </div>
              <div className={styles.sentenceInlineRow}>
                <span>6 How do you</span>
                {renderInput('exercise_6_reflect_verbs', '6', 'verb...')}
                <span>to work?</span>
              </div>
            </div>
          </div>

          {/* Exercise 7a: Error Correction */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>7a</span>
              <strong>Five of the questions have a mistake. Find and correct the mistakes.</strong>
            </p>

            <div className={styles.exerciseListCol}>
              <div className={styles.correctClueBanner}>
                1 Do you like tea? — <em>(Correct ✓)</em>
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  2 What time you arrive at your office?
                </span>
                {renderInput('exercise_7a_reflect_mistakes', '2', 'Corrected question...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  3 You have a big breakfast every day?
                </span>
                {renderInput('exercise_7a_reflect_mistakes', '3', 'Corrected question...', { fullWidth: true })}
              </div>
              <div className={styles.correctClueBanner}>
                4 How do you travel to work? — <em>(Correct ✓)</em>
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  5 Do Simon and Lucy gets up early?
                </span>
                {renderInput('exercise_7a_reflect_mistakes', '5', 'Corrected question...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  6 What time leave you the house in the morning?
                </span>
                {renderInput('exercise_7a_reflect_mistakes', '6', 'Corrected question...', { fullWidth: true })}
              </div>
              <div className={styles.correctClueBanner}>
                7 Do they study in the evening? — <em>(Correct ✓)</em>
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  8 How travel your friends to university?
                </span>
                {renderInput('exercise_7a_reflect_mistakes', '8', 'Corrected question...', { fullWidth: true })}
              </div>
            </div>
          </div>

          {/* Exercise 8a & 8b: Food anagrams & collocations */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>8a</span>
              <strong>Unscramble the letters to make food words.</strong>
            </p>

            <div className={styles.anagramGrid}>
              {ANAGRAMS_LIST.map((item) => (
                <div key={item.num} className={styles.anagramCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: '#be123c' }}>{item.num}</span>
                    <span className={styles.anagramPill}>{item.jumble}</span>
                    <span>➔</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, justifyContent: 'flex-end' }}>
                    {renderInput('exercise_8a_reflect_anagrams', item.num, 'food word...')}
                    {isReview && <PronounceButton word={item.expected} size="small" />}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.subExerciseDivider}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>8b</span>
                <strong>Cross out the phrase that is NOT possible.</strong>
              </p>

              <div className={styles.collocationGrid}>
                <div className={styles.collocationCard}>
                  <span>1 sugar cake / a cup of tea</span>
                  {renderSelect('exercise_8b_reflect_cross', '1', [
                    { label: 'sugar cake', value: 'sugar cake' },
                    { label: 'a cup of tea', value: 'a cup of tea' },
                  ])}
                </div>
                <div className={styles.collocationCard}>
                  <span>2 a cup of coffee / a cup of meat</span>
                  {renderSelect('exercise_8b_reflect_cross', '2', [
                    { label: 'a cup of coffee', value: 'a cup of coffee' },
                    { label: 'a cup of meat', value: 'a cup of meat' },
                  ])}
                </div>
                <div className={styles.collocationCard}>
                  <span>3 a cheese sandwich / a milk sandwich</span>
                  {renderSelect('exercise_8b_reflect_cross', '3', [
                    { label: 'a cheese sandwich', value: 'a cheese sandwich' },
                    { label: 'a milk sandwich', value: 'a milk sandwich' },
                  ])}
                </div>
                <div className={styles.collocationCard}>
                  <span>4 green salad / bread salad</span>
                  {renderSelect('exercise_8b_reflect_cross', '4', [
                    { label: 'green salad', value: 'green salad' },
                    { label: 'bread salad', value: 'bread salad' },
                  ])}
                </div>
              </div>
            </div>
          </div>

          {/* Exercise 9a: Frequency adverbs word order */}
          <div className={styles.exerciseCard}>
            <p className={styles.exInstruction}>
              <span className={styles.exBadge}>9a</span>
              <strong>Put the words in order to make sentences with frequency adverbs.</strong>
            </p>

            <div className={styles.exerciseListCol}>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  1 dinner / at 8.30 / usually / have / in the evening / We
                </span>
                {renderInput('exercise_9a_reflect_order', '1', 'Sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  2 hungry / in the morning / never / am / I
                </span>
                {renderInput('exercise_9a_reflect_order', '2', 'Sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  3 have / meat or fish / always / for lunch / I
                </span>
                {renderInput('exercise_9a_reflect_order', '3', 'Sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  4 tired / are / on Friday / sometimes / They
                </span>
                {renderInput('exercise_9a_reflect_order', '4', 'Sentence...', { fullWidth: true })}
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.sentenceClue}>
                  5 coffee / at work / drinks / often / She
                </span>
                {renderInput('exercise_9a_reflect_order', '5', 'Sentence...', { fullWidth: true })}
              </div>
            </div>
          </div>

          {/* Self-Reflection Stars Block */}
          <div className={styles.reflectBlock}>
            <div className={styles.reflectHeader}>
              <span>⭐</span>
              <span>Self-reflection: How did you do in Unit 5?</span>
            </div>

            <div className={styles.exerciseListCol}>
              <div className={styles.reflectItem}>
                <span>I can talk about days and daily routines</span>
                {renderStarRating('routines')}
              </div>
              <div className={styles.reflectItem}>
                <span>I can talk about how I travel to work/university</span>
                {renderStarRating('transport')}
              </div>
              <div className={styles.reflectItem}>
                <span>I can talk about food, drinks, and healthy habits</span>
                {renderStarRating('food_drink')}
              </div>
              <div className={styles.reflectItem}>
                <span>I can order food and drinks in a café</span>
                {renderStarRating('cafe_order')}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
