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
import styles from './lesson7b.module.scss';

export interface Lesson7BContentProps {
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

export const FALLBACK_ANSWER_KEY_7B: LessonAnswerKey = {
  exercise_1a_matching: {
    '1': ['E', 'e', 'Photo 1', 'Paragraph E'],
    '2': ['C', 'c', 'Photo 2', 'Paragraph C'],
    '3': ['B', 'b', 'Photo 3', 'Paragraph B'],
    '4': ['D', 'd', 'Photo 4', 'Paragraph D'],
    '5': ['A', 'a', 'Photo 5', 'Paragraph A'],
  },
  exercise_3a_ordinals: {
    a: ['first', '1st'],
    b: ['second', '2nd'],
    c: ['third', '3rd'],
    d: ['fourth', '4th'],
    e: ['fifth', '5th'],
    f: ['eleventh', '11th'],
    g: ['twelfth', '12th'],
    h: ['thirteenth', '13th'],
    i: ['fourteenth', '14th'],
    j: ['fifteenth', '15th'],
    k: ['twentieth', '20th'],
    l: ['twenty-first', 'twenty first', '21st'],
    m: ['twenty-second', 'twenty second', '22nd'],
    n: ['twenty-third', 'twenty third', '23rd'],
    o: ['twenty-fourth', 'twenty fourth', '24th'],
    p: ['thirtieth', '30th'],
    q: ['thirty-first', 'thirty first', '31st'],
  },
  exercise_5a_words: {
    '1': ['Today', 'today'],
    '2': ['Yesterday', 'yesterday'],
    '3': ['Last', 'last'],
    '4': ['weekend', 'Weekend'],
    '5': ['week', 'Week'],
  },
  exercise_6_grammar: {
    '1': ['was', 'Was'],
    '2': ["wasn't", 'was not', 'wasn’t'],
    '3': ['were', 'Were'],
    '4': ["weren't", 'were not', 'weren’t'],
    '5': ['was', 'Was'],
    '6': ["wasn't", 'was not', 'wasn’t'],
    '7': ['were', 'Were'],
    '8': ["weren't", 'were not', 'weren’t'],
  },
  exercise_8_alternatives: {
    '1': ['was', 'Was'],
    '2': ['was', 'Was'],
    '3': ['was', 'Was'],
    '4': ['were', 'Were'],
    '5': ["weren't", 'were not', 'weren’t'],
    '6': ['were', 'Were'],
    '7': ['were', 'Were'],
    '8': ['was', 'Was'],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const MONTHS_LIST = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ORDINALS_LIST = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'eleventh',
  'twelfth',
  'thirteenth',
  'fourteenth',
  'fifteenth',
  'twentieth',
  'twenty-first',
  'twenty-second',
  'twenty-third',
  'twenty-fourth',
  'thirtieth',
  'thirty-first',
];

export default function Lesson7BContent(props: Lesson7BContentProps) {
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
    FALLBACK_ANSWER_KEY_7B;

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

  // Render text input without leaking answers in placeholder
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

  // Render select dropdown
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

  const paragraphOptions = [
    { value: 'A', label: 'Paragraph A (New flat)' },
    { value: 'B', label: 'Paragraph B (Birthday party)' },
    { value: 'C', label: 'Paragraph C (Holiday near lake)' },
    { value: 'D', label: 'Paragraph D (Spanish restaurant)' },
    { value: 'E', label: 'Paragraph E (New job video games)' },
  ];

  const ordinalsOptions = ORDINALS_LIST.map((w) => ({ value: w, label: w }));

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Banner Header 7B */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge7B}>
              <span>7</span>
              <span className={styles.letterB}>B</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>A good day</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: talk about good days</span>
                <span className={styles.pillGoal}>Grammar: was/were, there was/were</span>
                <span className={styles.pillGoal}>Vocabulary: months, dates</span>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.pageBody}>
          {/* ============================================================== */}
          {/* SECTION 1: READING & LISTENING: DAVID'S YEAR                   */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Reading & Listening</span>
              <h2 className={styles.sectionTitle}>David&apos;s Year</h2>
            </div>

            {/* David's Year Article & Photo Matching */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1a</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Read the text. Match photos 1–5 with paragraphs A–E</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '7.4' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('7.4')}
                      aria-label="Play Audio 7.4"
                    >
                      {playingAudio === '7.4' ? '⏸ Playing 7.4' : '▶ Audio 7.4'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Read about David&apos;s five very good days, then match each photograph to its corresponding paragraph.
                  </p>
                </div>
              </div>

              {/* Reading Text Container */}
              <div className={styles.readingCardContainer}>
                <div className={styles.davidYearBanner}>
                  <h3 className={styles.davidYearTitle}>David&apos;s year</h3>
                  <p className={styles.davidYearSubtitle}>These were my five very good days this year:</p>
                </div>

                <div className={styles.paragraphsGrid}>
                  <div className={styles.paragraphCard}>
                    <div className={styles.paragraphHeader}>
                      <span className={styles.paragraphBadge}>A</span>
                      <span className={styles.paragraphDate}>12th February</span>
                    </div>
                    <p className={styles.paragraphText}>
                      <strong>12th February</strong> was the first day in our new flat. It&apos;s great. We&apos;ve got a new table and chairs and a big sofa.
                    </p>
                  </div>

                  <div className={styles.paragraphCard}>
                    <div className={styles.paragraphHeader}>
                      <span className={styles.paragraphBadge}>B</span>
                      <span className={styles.paragraphDate}>5th April</span>
                    </div>
                    <p className={styles.paragraphText}>
                      <strong>5th April</strong> was my birthday. I was 31 this year. There was a party with great music — it was amazing!
                    </p>
                  </div>

                  <div className={styles.paragraphCard}>
                    <div className={styles.paragraphHeader}>
                      <span className={styles.paragraphBadge}>C</span>
                      <span className={styles.paragraphDate}>7th August</span>
                    </div>
                    <p className={styles.paragraphText}>
                      <strong>7th August</strong> was the first day of our holiday. We usually go to a big city, but this year was different. Our hotel was near a lake, and there were mountains and fields. There weren&apos;t any cars or buses. It was really quiet.
                    </p>
                  </div>

                  <div className={styles.paragraphCard}>
                    <div className={styles.paragraphHeader}>
                      <span className={styles.paragraphBadge}>D</span>
                      <span className={styles.paragraphDate}>14th October</span>
                    </div>
                    <p className={styles.paragraphText}>
                      <strong>On 14th October</strong> in the evening we were at the Spanish restaurant near Liverpool Street. Mike, Junko, Wes and Trin were there. The food wasn&apos;t cheap ... but it was really good.
                    </p>
                  </div>

                  <div className={styles.paragraphCard} style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.paragraphHeader}>
                      <span className={styles.paragraphBadge}>E</span>
                      <span className={styles.paragraphDate}>8th December</span>
                    </div>
                    <p className={styles.paragraphText}>
                      <strong>8th December</strong> was my first day at my new job. I work for a video games company in London and I often travel to other countries. It&apos;s a really good job.
                    </p>
                  </div>
                </div>
              </div>

              {/* Photos Gallery 1-5 */}
              <div className={styles.photosMatchGrid}>
                {[
                  { num: '1', name: 'David at desk with laptop', src: '/images/lesson7b/photo_1_david.png' },
                  { num: '2', name: 'Mountains and quiet lake', src: '/images/lesson7b/photo_2_lake.png' },
                  { num: '3', name: 'Rooftop party with DJ', src: '/images/lesson7b/photo_3_party.png' },
                  { num: '4', name: 'Spanish seafood paella', src: '/images/lesson7b/photo_4_paella.png' },
                  { num: '5', name: 'New flat living room', src: '/images/lesson7b/photo_5_flat.png' },
                ].map((item) => (
                  <div key={item.num} className={styles.photoMatchCard}>
                    <div className={styles.photoMatchImageWrapper}>
                      <span className={styles.photoMatchBadge}>Photo {item.num}</span>
                      <Image
                        src={item.src}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.photoMatchForm}>
                      {renderSelect('exercise_1a_matching', item.num, paragraphOptions)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 1b: Audio Differences */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1b</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Listen to David and find 5 things that are different</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '7.4' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('7.4')}
                      aria-label="Play Audio 7.4"
                    >
                      {playingAudio === '7.4' ? '⏸ Playing 7.4' : '▶ Audio 7.4'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    David describes his year with five small differences from the text. Make notes of what he changes.
                  </p>
                </div>
              </div>

              <div className={styles.itemsList}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={styles.itemRow}>
                    <div className={styles.itemLeft}>
                      <span className={styles.numBadge}>{i}</span>
                      <span className={styles.itemSentence}>Difference {i}:</span>
                    </div>
                    <div className={styles.itemAction} style={{ width: '100%', maxWidth: '380px' }}>
                      {renderInput('exercise_1b_differences', String(i), 'Describe the difference...', { fullWidth: true })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 2: VOCABULARY: MONTHS & DATES                          */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Vocabulary</span>
              <h2 className={styles.sectionTitle}>Months, Dates & Ordinal Numbers</h2>
            </div>

            {/* Exercise 2a: Calendar Months */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2a</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Look at the calendar. Listen and repeat</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '7.5' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('7.5')}
                      aria-label="Play Audio 7.5"
                    >
                      {playingAudio === '7.5' ? '⏸ Playing 7.5' : '▶ Audio 7.5'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Practise saying all 12 months in order.
                  </p>
                </div>
              </div>

              <div className={styles.calendarCard}>
                <div className={styles.calendarImageWrapper}>
                  <Image
                    src="/images/lesson7b/calendar_months.png"
                    alt="Calendar tablet with 12 months"
                    fill
                    sizes="250px"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className={styles.calendarInfoArea}>
                  <h4 style={{ margin: 0, color: '#9a3412', fontWeight: 800 }}>Months of the Year</h4>
                  <div className={styles.calendarMonthsPills}>
                    {MONTHS_LIST.map((m) => (
                      <span key={m} className={styles.monthPill}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 2b: True for you sentences */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2b</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Rewrite the sentences so they are true for you</h3>
                  <p className={styles.exerciseInstruction}>
                    Change the months in bold so that the statements reflect your life.
                  </p>
                </div>
              </div>

              <div className={styles.itemsList}>
                {[
                  { num: '1', prompt: 'My birthday is in April.', field: 'birthday' },
                  { num: '2', prompt: "My best friend's birthday is in December.", field: 'friend_birthday' },
                  { num: '3', prompt: "My teacher's birthday is in November.", field: 'teacher_birthday' },
                  { num: '4', prompt: 'The weather is good in my country in May.', field: 'good_weather' },
                  { num: '5', prompt: 'My favourite month is July.', field: 'favourite_month' },
                ].map((item) => (
                  <div key={item.num} className={styles.itemRow}>
                    <div className={styles.itemLeft}>
                      <span className={styles.numBadge}>{item.num}</span>
                      <span className={styles.itemSentence}>
                        Original: <em>{item.prompt}</em>
                      </span>
                    </div>
                    <div className={styles.itemAction} style={{ width: '100%', maxWidth: '350px' }}>
                      {renderInput('exercise_2b_true_sentences', item.field, 'Your true sentence...', { fullWidth: true })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 3a: Ordinal Numbers */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>3a</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Match numbers a–q with the ordinal words</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '7.6' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('7.6')}
                      aria-label="Play Audio 7.6"
                    >
                      {playingAudio === '7.6' ? '⏸ Playing 7.6' : '▶ Audio 7.6'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Choose the correct ordinal word for each number, then listen and check.
                  </p>
                </div>
              </div>

              {/* Word Box */}
              <div className={styles.wordBankBox}>
                <span className={styles.wordBankLabel}>Ordinal words:</span>
                {ORDINALS_LIST.map((w) => (
                  <span key={w} className={styles.wordBankItem}>
                    {w}
                  </span>
                ))}
              </div>

              <div className={styles.ordinalsGrid}>
                {[
                  { key: 'a', num: '1 (1st)' },
                  { key: 'b', num: '2 (2nd)' },
                  { key: 'c', num: '3 (3rd)' },
                  { key: 'd', num: '4 (4th)' },
                  { key: 'e', num: '5 (5th)' },
                  { key: 'f', num: '11 (11th)' },
                  { key: 'g', num: '12 (12th)' },
                  { key: 'h', num: '13 (13th)' },
                  { key: 'i', num: '14 (14th)' },
                  { key: 'j', num: '15 (15th)' },
                  { key: 'k', num: '20 (20th)' },
                  { key: 'l', num: '21 (21st)' },
                  { key: 'm', num: '22 (22nd)' },
                  { key: 'n', num: '23 (23rd)' },
                  { key: 'o', num: '24 (24th)' },
                  { key: 'p', num: '30 (30th)' },
                  { key: 'q', num: '31 (31st)' },
                ].map((item) => (
                  <div key={item.key} className={styles.ordinalCard}>
                    <span className={styles.ordinalNumberBadge}>{item.num}</span>
                    {renderSelect('exercise_3a_ordinals', item.key, ordinalsOptions)}
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 4: Family Birthdays */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>4</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Write sentences about your family&apos;s birthdays</h3>
                  <p className={styles.exerciseInstruction}>
                    Example: <em>My brother&apos;s birthday is on the nineteenth of April.</em>
                  </p>
                </div>
              </div>

              <div className={styles.itemsList}>
                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>1</span>
                    <span className={styles.itemSentence}>Family member 1:</span>
                  </div>
                  <div className={styles.itemAction} style={{ width: '100%', maxWidth: '400px' }}>
                    {renderInput('exercise_4_birthdays', '1', 'e.g. My mother\'s birthday is on the fourth of May...', { fullWidth: true })}
                  </div>
                </div>
                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>2</span>
                    <span className={styles.itemSentence}>Family member 2:</span>
                  </div>
                  <div className={styles.itemAction} style={{ width: '100%', maxWidth: '400px' }}>
                    {renderInput('exercise_4_birthdays', '2', 'Sentence...', { fullWidth: true })}
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 5a-b: Time expressions */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>5a</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Complete sentences with words in the box</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '7.7' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('7.7')}
                      aria-label="Play Audio 7.7"
                    >
                      {playingAudio === '7.7' ? '⏸ Playing 7.7' : '▶ Audio 7.7'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Box words: <strong>last, today, week, weekend, yesterday</strong>.
                  </p>
                </div>
              </div>

              <div className={styles.itemsList}>
                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>1</span>
                    <span className={styles.itemSentence}>
                      {renderSelect('exercise_5a_words', '1', [
                        { value: 'Today', label: 'Today' },
                        { value: 'Yesterday', label: 'Yesterday' },
                        { value: 'Last', label: 'Last' },
                        { value: 'weekend', label: 'weekend' },
                        { value: 'week', label: 'week' },
                      ])}{' '}
                      is Wednesday 14th.
                    </span>
                  </div>
                </div>

                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>2</span>
                    <span className={styles.itemSentence}>
                      {renderSelect('exercise_5a_words', '2', [
                        { value: 'Today', label: 'Today' },
                        { value: 'Yesterday', label: 'Yesterday' },
                        { value: 'Last', label: 'Last' },
                        { value: 'weekend', label: 'weekend' },
                        { value: 'week', label: 'week' },
                      ])}{' '}
                      was Tuesday 13th.
                    </span>
                  </div>
                </div>

                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>3</span>
                    <span className={styles.itemSentence}>
                      {renderSelect('exercise_5a_words', '3', [
                        { value: 'Today', label: 'Today' },
                        { value: 'Yesterday', label: 'Yesterday' },
                        { value: 'Last', label: 'Last' },
                        { value: 'weekend', label: 'weekend' },
                        { value: 'week', label: 'week' },
                      ])}{' '}
                      Friday was the 9th.
                    </span>
                  </div>
                </div>

                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>4</span>
                    <span className={styles.itemSentence}>
                      Last{' '}
                      {renderSelect('exercise_5a_words', '4', [
                        { value: 'Today', label: 'Today' },
                        { value: 'Yesterday', label: 'Yesterday' },
                        { value: 'Last', label: 'Last' },
                        { value: 'weekend', label: 'weekend' },
                        { value: 'week', label: 'week' },
                      ])}{' '}
                      was Saturday 10th and Sunday 11th.
                    </span>
                  </div>
                </div>

                <div className={styles.itemRow}>
                  <div className={styles.itemLeft}>
                    <span className={styles.numBadge}>5</span>
                    <span className={styles.itemSentence}>
                      Last{' '}
                      {renderSelect('exercise_5a_words', '5', [
                        { value: 'Today', label: 'Today' },
                        { value: 'Yesterday', label: 'Yesterday' },
                        { value: 'Last', label: 'Last' },
                        { value: 'weekend', label: 'weekend' },
                        { value: 'week', label: 'week' },
                      ])}{' '}
                      was Monday 5th to Sunday 11th.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 3: GRAMMAR: WAS / WERE & THERE WAS / WERE              */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Grammar</span>
              <h2 className={styles.sectionTitle}>was / were, there was / were</h2>
            </div>

            {/* Exercise 6: Grammar Box Completion */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>6</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Read and complete the grammar box</h3>
                  <p className={styles.exerciseInstruction}>
                    Use Exercise 1a to help you fill in the missing affirmative and negative past forms.
                  </p>
                </div>
              </div>

              <div className={styles.grammarBox}>
                <h4 className={styles.grammarHeader}>was / were</h4>
                <table className={styles.grammarTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>Type</th>
                      <th>Subject</th>
                      <th>Verb Form</th>
                      <th>Complement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.signPositive}>+</td>
                      <td>I / He / She / It</td>
                      <td>{renderInput('exercise_6_grammar', '1', 'verb...')}</td>
                      <td>thirty-one this year.</td>
                    </tr>
                    <tr>
                      <td className={styles.signNegative}>-</td>
                      <td>I / He / She / It</td>
                      <td>{renderInput('exercise_6_grammar', '2', 'verb...')}</td>
                      <td>quiet.</td>
                    </tr>
                    <tr>
                      <td className={styles.signPositive}>+</td>
                      <td>You / We / They</td>
                      <td>{renderInput('exercise_6_grammar', '3', 'verb...')}</td>
                      <td>great.</td>
                    </tr>
                    <tr>
                      <td className={styles.signNegative}>-</td>
                      <td>You / We / They</td>
                      <td>{renderInput('exercise_6_grammar', '4', 'verb...')}</td>
                      <td>there.</td>
                    </tr>
                  </tbody>
                </table>

                <h4 className={styles.grammarSubHeader}>there was / were</h4>
                <table className={styles.grammarTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>Type</th>
                      <th>Subject</th>
                      <th>Verb Form</th>
                      <th>Complement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.signPositive}>+</td>
                      <td>There</td>
                      <td>{renderInput('exercise_6_grammar', '5', 'verb...')}</td>
                      <td>a party.</td>
                    </tr>
                    <tr>
                      <td className={styles.signNegative}>-</td>
                      <td>There</td>
                      <td>{renderInput('exercise_6_grammar', '6', 'verb...')}</td>
                      <td>a lift.</td>
                    </tr>
                    <tr>
                      <td className={styles.signPositive}>+</td>
                      <td>There</td>
                      <td>{renderInput('exercise_6_grammar', '7', 'verb...')}</td>
                      <td>mountains and fields.</td>
                    </tr>
                    <tr>
                      <td className={styles.signNegative}>-</td>
                      <td>There</td>
                      <td>{renderInput('exercise_6_grammar', '8', 'verb...')}</td>
                      <td>any buses or cars.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exercise 7a-b: Pronunciation */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>7a</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Pronunciation of was/wasn&apos;t and were/weren&apos;t</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '7.8' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('7.8')}
                      aria-label="Play Audio 7.8"
                    >
                      {playingAudio === '7.8' ? '⏸ Playing 7.8' : '▶ Audio 7.8'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Listen to the sentences and notice the pronunciation of the highlighted words.
                  </p>
                </div>
              </div>

              <div className={styles.pronunciationGrid}>
                <div className={styles.pronunciationCard}>
                  <span className={styles.pronunciationText}>
                    1. The food <span>wasn&apos;t</span> cheap.
                  </span>
                </div>
                <div className={styles.pronunciationCard}>
                  <span className={styles.pronunciationText}>
                    2. Bill and Jane <span>weren&apos;t</span> there.
                  </span>
                </div>
                <div className={styles.pronunciationCard}>
                  <span className={styles.pronunciationText}>
                    3. There <span>wasn&apos;t</span> a lift.
                  </span>
                </div>
                <div className={styles.pronunciationCard}>
                  <span className={styles.pronunciationText}>
                    4. There <span>weren&apos;t</span> any cars or buses.
                  </span>
                </div>
              </div>
            </div>

            {/* Exercise 8: Choose alternatives */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>8</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Choose the correct alternatives</h3>
                  <p className={styles.exerciseInstruction}>
                    Select was, were, wasn&apos;t, or weren&apos;t to complete each sentence.
                  </p>
                </div>
              </div>

              <div className={styles.itemsList}>
                {[
                  { num: '1', pre: 'My birthday party ', options: ['was', 'were'], post: ' on 12th March.' },
                  { num: '2', pre: 'There ', options: ['was', 'were'], post: ' a big party near the hotel last week.' },
                  { num: '3', pre: 'Our holiday ', options: ['was', 'were'], post: ' from 7th July to 15th July.' },
                  { num: '4', pre: 'There ', options: ['was', 'were'], post: ' six people on the train.' },
                  { num: '5', pre: 'The restaurants ', options: ["wasn't", "weren't"], post: ' busy.' },
                  { num: '6', pre: 'The plane tickets ', options: ['was', 'were'], post: ' really cheap.' },
                  { num: '7', pre: 'Norma and Shelley ', options: ['was', 'were'], post: ' at the party yesterday.' },
                  { num: '8', pre: 'There ', options: ['was', 'were'], post: ' a big cake in the living room.' },
                ].map((item) => (
                  <div key={item.num} className={styles.itemRow}>
                    <div className={styles.itemLeft}>
                      <span className={styles.numBadge}>{item.num}</span>
                      <span className={styles.itemSentence}>
                        {item.pre}
                        {renderSelect(
                          'exercise_8_alternatives',
                          item.num,
                          item.options.map((opt) => ({ value: opt, label: opt }))
                        )}
                        {item.post}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 9a: True for you sentences */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>9a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Complete the sentences so they are true for you</h3>
                  <p className={styles.exerciseInstruction}>
                    Use was, were, wasn&apos;t, or weren&apos;t.
                  </p>
                </div>
              </div>

              <div className={styles.itemsList}>
                {[
                  { num: '1', prompt: 'I _____ on the train at 8 a.m. on Monday.', field: '1' },
                  { num: '2', prompt: 'My bus/train _____ late on Tuesday.', field: '2' },
                  { num: '3', prompt: 'There _____ five people in my office/my class on Wednesday.', field: '3' },
                  { num: '4', prompt: 'Yesterday _____ a good day.', field: '4' },
                  { num: '5', prompt: 'There _____ fish for lunch at work/at school/at university on Friday.', field: '5' },
                  { num: '6', prompt: 'My family _____ at home on Saturday.', field: '6' },
                  { num: '7', prompt: 'My friends and I _____ at the cinema on Sunday evening.', field: '7' },
                ].map((item) => (
                  <div key={item.num} className={styles.itemRow}>
                    <div className={styles.itemLeft}>
                      <span className={styles.numBadge}>{item.num}</span>
                      <span className={styles.itemSentence}>{item.prompt}</span>
                    </div>
                    <div className={styles.itemAction}>
                      {renderSelect('exercise_9a_personal', item.field, [
                        { value: 'was', label: 'was' },
                        { value: "wasn't", label: "wasn't" },
                        { value: 'were', label: 'were' },
                        { value: "weren't", label: "weren't" },
                      ])}
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
              <h2 className={styles.sectionTitle}>Five Good Days</h2>
            </div>

            {/* Prepare Box */}
            <div className={styles.prepareCard}>
              <span className={styles.prepareLabel}>PREPARE (Ex 10)</span>
              <h3 className={styles.exerciseTitle}>
                Think of five very good days from last year. Make notes in the table.
              </h3>

              <div className={styles.goodDaysTableWrapper}>
                <table className={styles.goodDaysTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>When?</th>
                      <th>Where?</th>
                      <th>Who with?</th>
                      <th>What happened?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((row) => (
                      <tr key={row}>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{row}</td>
                        <td>{renderInput('exercise_10_table', `${row}_when`, 'Date/Month...')}</td>
                        <td>{renderInput('exercise_10_table', `${row}_where`, 'City/Place...')}</td>
                        <td>{renderInput('exercise_10_table', `${row}_who`, 'Friends/Family...')}</td>
                        <td>{renderInput('exercise_10_table', `${row}_what`, 'Activities...')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Speak Box & Voice Recorder */}
            <div className={styles.speakCard}>
              <span className={styles.speakLabel}>SPEAK (Ex 11a–b)</span>
              <h3 className={styles.exerciseTitle}>
                Tell your partner or teacher about your good days.
              </h3>
              <div className={styles.modelDialogueBox}>
                <p style={{ margin: 0 }}>
                  <strong>Model:</strong> <em>&ldquo;On 18th June, I was on holiday in Paris with my friend Ulrika. There were lots of great places to visit. It was amazing!&rdquo;</em>
                </p>
              </div>

              <AudioAnswerRecorder
                onAudioChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'speaking_good_days')}
                readOnly={readOnly}
              />

              {submissionId && (
                <div style={{ marginTop: '1rem' }}>
                  <SubmissionAudioPlayer
                    submissionId={submissionId}
                    exerciseKey="speaking_good_days"
                    audios={submittedAudios}
                  />
                </div>
              )}
            </div>

            <div className={styles.developBadge}>
              <span>💡 Develop your listening: Page 105 — Understand a short conversation about events</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
