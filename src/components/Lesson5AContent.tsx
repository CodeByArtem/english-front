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
import styles from './lesson5a.module.scss';

export interface Lesson5AContentProps {
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

export const FALLBACK_ANSWER_KEY_5A: LessonAnswerKey = {
  exercise_1_matching: {
    '1': ['E', 'e', 'Picture E', 'Photo E'],
    '2': ['H', 'h', 'Picture H', 'Photo H'],
    '3': ['F', 'f', 'Picture F', 'Photo F'],
    '4': ['A', 'a', 'Picture A', 'Photo A'],
    '5': ['C', 'c', 'Picture C', 'Photo C'],
    '6': ['G', 'g', 'Picture G', 'Photo G'],
    '7': ['B', 'b', 'Picture B', 'Photo B'],
    '8': ['J', 'j', 'Picture J', 'Photo J'],
    '9': ['I', 'i', 'Picture I', 'Photo I'],
    '10': ['D', 'd', 'Picture D', 'Photo D'],
  },
  exercise_3b_sentences: {
    '1': ['work'],
    '2': ['go to', 'go to the'],
    '3': ['have'],
    '4': ['have'],
    '5': ['study'],
    '6': ['get up'],
    '7': ['watch'],
  },
  exercise_5a_reading: {
    '1': ['nurse', 'a nurse', "She's a nurse", 'She is a nurse', "She's a nurse.", 'She is a nurse.'],
    '2': ['yes', 'Yes', 'Yes, they are', 'Yes, they are.', 'yes, they are'],
  },
  exercise_6_grammar: {
    '1': ['at'],
    '2': ['at'],
    '3': ['on'],
    '4': ['On', 'on'],
  },
  exercise_8_sentences: {
    '1': ['I get up at six on Mondays.', 'On Mondays, I get up at six.', 'I get up at six on Mondays', 'On Mondays I get up at six'],
    '2': ['I have breakfast at seven thirty.', 'At seven thirty, I have breakfast.', 'I have breakfast at seven thirty', 'At seven thirty I have breakfast'],
    '3': ['I go to work at half past eight.', 'At half past eight, I go to work.', 'I go to work at half past eight', 'At half past eight I go to work'],
    '4': ['I work from nine to five.', 'From nine to five, I work.', 'I work from nine to five', 'From nine to five I work'],
    '5': ['I have dinner with my family at seven.', 'At seven, I have dinner with my family.', 'I have dinner with my family at seven', 'At seven I have dinner with my family', 'I have dinner at seven with my family.', 'I have dinner at seven with my family'],
    '6': ["I don't go to bed late.", "I don't go to bed late", 'I do not go to bed late.', 'I do not go to bed late'],
    '7': ["I don't work on Saturdays and Sundays.", "On Saturdays and Sundays, I don't work.", "I don't work on Sundays and Saturdays.", "On Sundays and Saturdays, I don't work.", "I don't work on Saturdays and Sundays", "On Saturdays and Sundays I don't work"],
    '8': ['I watch TV and read books on Saturdays.', 'On Saturdays, I watch TV and read books.', 'I read books and watch TV on Saturdays.', 'On Saturdays, I read books and watch TV.', 'I watch TV and read books on Saturdays', 'On Saturdays I watch TV and read books'],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const VOCAB_PICTURES = [
  { id: 'A', src: '/images/lesson5a/pic_a_work.png', alt: 'Working at laptop' },
  { id: 'B', src: '/images/lesson5a/pic_b_dinner.png', alt: 'Eating pasta dinner' },
  { id: 'C', src: '/images/lesson5a/pic_c_sandwich.png', alt: 'Eating sandwich at cafe' },
  { id: 'D', src: '/images/lesson5a/pic_d_bed1030.png', alt: 'Going to bed 10:30' },
  { id: 'E', src: '/images/lesson5a/pic_e_bed0530.png', alt: 'Getting up 06:30' },
  { id: 'F', src: '/images/lesson5a/pic_f_leave_house.png', alt: 'Leaving house for work' },
  { id: 'G', src: '/images/lesson5a/pic_g_arrive_office.png', alt: 'Going home after work' },
  { id: 'H', src: '/images/lesson5a/pic_h_cereal.png', alt: 'Breakfast with cereal' },
  { id: 'I', src: '/images/lesson5a/pic_i_study.png', alt: 'Studying books at desk' },
  { id: 'J', src: '/images/lesson5a/pic_j_tv.png', alt: 'Watching TV in chair' },
];

const VOCAB_SENTENCES = [
  { num: '1', text: 'I get up at six thirty.' },
  { num: '2', text: "I have breakfast at 7 o'clock." },
  { num: '3', text: 'I go to work at seven forty-five.' },
  { num: '4', text: 'I work from nine to five thirty.' },
  { num: '5', text: 'I have lunch at twelve thirty.' },
  { num: '6', text: 'I go home at half past five.' },
  { num: '7', text: "I have dinner at 7 o'clock." },
  { num: '8', text: 'I watch TV at seven thirty.' },
  { num: '9', text: "I study at 9 o'clock." },
  { num: '10', text: 'I go to bed at half past ten.' },
];

const DAYS_DATA = [
  { day: 'Monday', color: '#db2777', act: 'bookshop' },
  { day: 'Tuesday', color: '#16a34a', act: 'university' },
  { day: 'Wednesday', color: '#ea580c', act: 'lunch with class' },
  { day: 'Thursday', color: '#0284c7', act: "dinner at my mum's house" },
  { day: 'Friday', color: '#e11d48', act: 'English homework' },
  { day: 'Saturday', color: '#4b5563', act: 'sleep until midday!' },
  { day: 'Sunday', color: '#9333ea', act: 'TV' },
];

export default function Lesson5AContent(props: Lesson5AContentProps) {
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
    FALLBACK_ANSWER_KEY_5A;

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
      <div className={styles.inputWrapper} style={{ width: options?.fullWidth ? '100%' : 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <input
            type="text"
            value={currentVal}
            onChange={(e) => handleFieldChange(exerciseName, field, e.target.value)}
            placeholder={placeholder}
            disabled={readOnly}
            className={`${styles.textInput} ${options?.customClass || ''} ${
              v?.status === 'correct'
                ? styles.inputValid
                : v?.status === 'incorrect'
                ? styles.inputInvalid
                : ''
            }`}
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
    optionsList: string[]
  ) => {
    const currentVal = (getRecord(originalAnswers[exerciseName]))[field] || '';
    const v = verify(exerciseName, field, currentVal);

    return (
      <div className={styles.inputWrapper} style={{ display: 'inline-block' }}>
        <select
          value={currentVal}
          onChange={(e) => handleFieldChange(exerciseName, field, e.target.value)}
          disabled={readOnly}
          className={`${styles.selectInput} ${
            v?.status === 'correct'
              ? styles.inputValid
              : v?.status === 'incorrect'
              ? styles.inputInvalid
              : ''
          }`}
        >
          <option value="">--</option>
          {optionsList.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
        {v && v.status !== 'correct' && (
          <div className={styles.feedbackRow}>
            <TeacherAnswerBadge result={v} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <article className={styles.textbookPage}>
        {/* Header Banner 5A */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge5A}>
              5<span className={styles.letterA}>A</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>My week</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: describe part of your week</span>
                <span className={styles.pillGoal}>Grammar: present simple: I/you/we/they</span>
                <span className={styles.pillGoal}>Vocabulary: days of the week, everyday activities</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.contentBody}>
          {/* SECTION 1: Vocabulary */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🗓️</span>
                <span>Vocabulary: Everyday Activities</span>
              </h2>
            </div>

            {/* Exercise 1: Match pictures A-J */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>1</span>
                <strong>Match pictures A–J with sentences 1–10.</strong> Type the corresponding letter in each box.
              </p>

              {/* Picture cards gallery */}
              <div className={styles.photosGrid}>
                {VOCAB_PICTURES.map((pic) => (
                  <div key={pic.id} className={styles.photoCard}>
                    <div className={styles.photoWrapper}>
                      <Image
                        src={pic.src}
                        alt={pic.alt}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <span className={styles.photoLetterBadge}>{pic.id}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Matching sentences list */}
              <div className={styles.matchingList}>
                {VOCAB_SENTENCES.map((item) => (
                  <div key={item.num} className={styles.matchingRow}>
                    <div className={styles.sentenceText}>
                      <span className={styles.numBadge}>{item.num}</span>
                      <span>{item.text}</span>
                      <PronounceButton word={item.text} size="small" />
                    </div>
                    {renderInput('exercise_1_matching', item.num, 'Letter', {
                      customClass: styles.matchInput,
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 2: Write five sentences about your day */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>2</span>
                <strong>Write five sentences about your day.</strong> (e.g. <em>I get up at 7 o&apos;clock.</em>)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['1', '2', '3', '4', '5'].map((n) => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={styles.numBadge}>{n}</span>
                    {renderInput('exercise_2_my_day', n, 'Write a sentence about your day...', {
                      fullWidth: true,
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 3a: Days of the week table + audio */}
            <div className={styles.exerciseCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>3a</span>
                  <strong>Look at the table. Listen and repeat the days of the week.</strong>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('5.1')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '5.1' || playingAudio === '/audio/5.1.mp3' ? '⏸ Playing 5.1' : '▶ Audio 5.1'}
                  </button>
                )}
              </div>

              {/* Days table */}
              <div className={styles.daysTable}>
                {DAYS_DATA.map((d) => (
                  <div key={d.day} className={styles.dayRow}>
                    <div className={styles.dayColName} style={{ background: d.color }}>
                      <span>{d.day}</span>
                      <PronounceButton word={d.day} size="small" />
                    </div>
                    <div className={styles.dayColAct}>
                      <span>{d.act}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 3b & 3c: Fill verbs in bold */}
            <div className={styles.exerciseCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>3b</span>
                  <strong>Look at the table again. Complete the sentences with the verbs in bold in Exercise 1.</strong>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('5.2')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '5.2' || playingAudio === '/audio/5.2.mp3' ? '⏸ Playing 5.2' : '▶ Audio 5.2'}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>1 On Mondays, I</span>
                  {renderInput('exercise_3b_sentences', '1', 'verb')}
                  <span>in a bookshop.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>2 On Tuesdays, I</span>
                  {renderInput('exercise_3b_sentences', '2', 'verb')}
                  <span>university.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>3 On Wednesdays, I</span>
                  {renderInput('exercise_3b_sentences', '3', 'verb')}
                  <span>lunch with my class.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>4 On Thursdays, I</span>
                  {renderInput('exercise_3b_sentences', '4', 'verb')}
                  <span>dinner at my mum&apos;s house.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>5 On Fridays, I</span>
                  {renderInput('exercise_3b_sentences', '5', 'verb')}
                  <span>at home.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>6 On Saturdays, I</span>
                  {renderInput('exercise_3b_sentences', '6', 'verb')}
                  <span>late.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>7 On Sundays, I</span>
                  {renderInput('exercise_3b_sentences', '7', 'verb')}
                  <span>TV.</span>
                </div>
              </div>
            </div>

            {/* Exercise 4: Write three sentences about your week */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>4</span>
                <strong>Write three sentences about your week.</strong> (e.g. <em>On Mondays, I work in a café.</em>)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['1', '2', '3'].map((n) => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={styles.numBadge}>{n}</span>
                    {renderInput('exercise_4_my_week', n, 'On [Day], I...', {
                      fullWidth: true,
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 2: Reading */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📖</span>
                <span>Reading: Mari&apos;s Week</span>
              </h2>
            </div>

            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>5a</span>
                <strong>Read about Mari&apos;s week and answer the questions.</strong>
              </p>

              <div className={styles.readingGrid}>
                <div className={styles.readingCard}>
                  <p>
                    From Monday to Friday, I get up at <span className={styles.readingUnderlined}>7 o&apos;clock</span>. I have breakfast at <span className={styles.readingUnderlined}>seven thirty</span> and I go to <span className={styles.readingUnderlined}>work</span> at <span className={styles.readingUnderlined}>8 o&apos;clock</span> by <span className={styles.readingUnderlined}>bus</span>. I&apos;m a <span className={styles.readingUnderlined}>nurse in the San Juan Hospital</span>. I have lunch at <span className={styles.readingUnderlined}>1 o&apos;clock</span> and I go home at <span className={styles.readingUnderlined}>five forty-five</span>. In the evening, I have dinner at home and <span className={styles.readingUnderlined}>watch TV</span> or <span className={styles.readingUnderlined}>study English</span>. I go to bed at <span className={styles.readingUnderlined}>eleven</span>. At the weekend, I <span className={styles.readingUnderlined}>don&apos;t work</span>. On Saturdays, I get up at <span className={styles.readingUnderlined}>10 o&apos;clock</span>. I have breakfast and <span className={styles.readingUnderlined}>go to my sister&apos;s flat</span>. We <span className={styles.readingUnderlined}>have lunch and talk</span>. Later, I <span className={styles.readingUnderlined}>go to the shops</span>. At 6 or 7 o&apos;clock, I <span className={styles.readingUnderlined}>have dinner with friends at a restaurant</span>. I go to bed at <span className={styles.readingUnderlined}>12</span>. I love the weekend!
                  </p>
                </div>

                <div className={styles.readingPhotoWrap}>
                  <Image
                    src="/images/lesson5a/mari_nurse.png"
                    alt="Mari on the bus"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>

              {/* Questions */}
              <div className={styles.questionsList}>
                <div className={styles.questionItem}>
                  <div className={styles.questionText}>1 What is her job?</div>
                  {renderInput('exercise_5a_reading', '1', 'Her job...')}
                </div>
                <div className={styles.questionItem}>
                  <div className={styles.questionText}>2 Are the week and the weekend very different for her?</div>
                  {renderInput('exercise_5a_reading', '2', 'Yes/No...')}
                </div>
              </div>
            </div>

            {/* Exercise 5b: Change underlined info */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>5b</span>
                <strong>Change the underlined information so it&apos;s true for you.</strong> (e.g. <em>From Monday to Friday, I get up at 6 o&apos;clock.</em>)
              </p>
              {renderInput('exercise_5b_personal', 'my_routine', 'Describe your own routine...', {
                fullWidth: true,
              })}
            </div>
          </section>

          {/* SECTION 3: Grammar */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📐</span>
                <span>Grammar: Present simple: I / you / we / they</span>
              </h2>
            </div>

            {/* Exercise 6: Grammar box alternatives */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>6</span>
                <strong>Read the grammar box and choose the correct alternatives. Use Exercise 5a to help you.</strong>
              </p>

              <div className={styles.grammarBox}>
                <h3 className={styles.grammarTitle}>Present simple: I / you / we / they</h3>
                <p className={styles.grammarRuleText}>Use the present simple to talk about routines.</p>

                <div className={styles.grammarTable}>
                  <div className={styles.grammarRow}>
                    <span className={styles.grammarSign}>+</span>
                    <span className={styles.grammarRuleText}><strong>I / You / We / They</strong> go to work.</span>
                  </div>
                  <div className={styles.grammarRow}>
                    <span className={styles.grammarSign}>-</span>
                    <span className={styles.grammarRuleText}><strong>I / You / We / They</strong> don&apos;t work.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span>Use</span>
                    {renderSelect('exercise_6_grammar', '1', ['on', 'at'])}
                    <span>+ times: I go to work</span>
                    {renderSelect('exercise_6_grammar', '2', ['on', 'at'])}
                    <span>8 o&apos;clock.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span>Use</span>
                    {renderSelect('exercise_6_grammar', '3', ['on', 'at'])}
                    <span>+ days:</span>
                    {renderSelect('exercise_6_grammar', '4', ['On', 'At'])}
                    <span>Saturdays, I get up at 10 o&apos;clock.</span>
                  </div>
                  <p className={styles.grammarRuleText} style={{ margin: 0, fontStyle: 'italic' }}>
                    Use <strong>from ... to ...</strong> for days and times: <em>From Monday to Friday, I get up at 7 o&apos;clock. On Wednesdays, I work from 2 o&apos;clock to 10 o&apos;clock.</em>
                  </p>
                </div>
              </div>
            </div>

            {/* Exercise 7: Pronunciation audio 5.3 */}
            <div className={styles.exerciseCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>7</span>
                  <strong>Pronunciation: Listen and notice the stressed words.</strong>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('5.3')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '5.3' || playingAudio === '/audio/5.3.mp3' ? '⏸ Playing 5.3' : '▶ Audio 5.3'}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#fdf4ff', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>1 On <strong>Fridays</strong>, I have <strong>breakfast</strong> at <strong>ten</strong>.</span>
                  <PronounceButton word="On Fridays, I have breakfast at ten." size="small" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>2 I <strong>go</strong> to <strong>work</strong> at <strong>eight thirty</strong>.</span>
                  <PronounceButton word="I go to work at eight thirty." size="small" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>3 At <strong>twelve o&apos;clock</strong>, I have <strong>lunch</strong>.</span>
                  <PronounceButton word="At twelve o'clock, I have lunch." size="small" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>4 I <strong>watch TV</strong> from <strong>seven thirty</strong> to <strong>eight thirty</strong>.</span>
                  <PronounceButton word="I watch TV from seven thirty to eight thirty." size="small" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>5 From <strong>ten</strong> to <strong>twelve</strong>, I play <strong>football</strong> with my friends.</span>
                  <PronounceButton word="From ten to twelve, I play football with my friends." size="small" />
                </div>
              </div>
            </div>

            {/* Exercise 8: Word order sentences */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>8</span>
                <strong>Put the words in the correct order to make sentences.</strong>
              </p>

              <div className={styles.wordOrderList}>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>1 get up / six / Mondays / I / at / on</span>
                  {renderInput('exercise_8_sentences', '1', 'I get up at six on Mondays.', { fullWidth: true })}
                </div>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>2 breakfast / I / seven thirty / have / at</span>
                  {renderInput('exercise_8_sentences', '2', 'Type sentence...', { fullWidth: true })}
                </div>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>3 work / go to / I / half past eight / at</span>
                  {renderInput('exercise_8_sentences', '3', 'Type sentence...', { fullWidth: true })}
                </div>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>4 work / nine / five / to / from / I</span>
                  {renderInput('exercise_8_sentences', '4', 'Type sentence...', { fullWidth: true })}
                </div>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>5 have / dinner / with / I / at / seven / my family</span>
                  {renderInput('exercise_8_sentences', '5', 'Type sentence...', { fullWidth: true })}
                </div>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>6 bed / late / go / I / don&apos;t / to</span>
                  {renderInput('exercise_8_sentences', '6', 'Type sentence...', { fullWidth: true })}
                </div>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>7 Saturdays / don&apos;t / I / and / Sundays / work / on</span>
                  {renderInput('exercise_8_sentences', '7', 'Type sentence...', { fullWidth: true })}
                </div>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>8 watch TV / on / and read books / I / Saturdays</span>
                  {renderInput('exercise_8_sentences', '8', 'Type sentence...', { fullWidth: true })}
                </div>
              </div>
            </div>

            {/* Exercise 9: True and False sentences */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>9a</span>
                <strong>Write three true and three false sentences about your week.</strong>
              </p>

              <div className={styles.trueFalseGrid}>
                {/* True sentences */}
                <div className={styles.trueCardCol}>
                  <h4 className={styles.colHeaderTitle}>
                    <span style={{ color: '#16a34a' }}>✓</span>
                    <span>True Sentences (3)</span>
                  </h4>
                  {['1', '2', '3'].map((n) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className={styles.numBadge}>{n}</span>
                      {renderInput('exercise_9a_true', n, `True sentence ${n}...`, { fullWidth: true })}
                    </div>
                  ))}
                </div>

                {/* False sentences */}
                <div className={styles.falseCardCol}>
                  <h4 className={styles.colHeaderTitle}>
                    <span style={{ color: '#dc2626' }}>✗</span>
                    <span>False Sentences (3)</span>
                  </h4>
                  {['1', '2', '3'].map((n) => (
                    <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className={styles.numBadge}>{n}</span>
                      {renderInput('exercise_9a_false', n, `False sentence ${n}...`, { fullWidth: true })}
                    </div>
                  ))}
                </div>
              </div>

              {/* 9b Pairwork model dialogue */}
              <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>9b</span>
                  <strong>Work in pairs. Take turns reading your sentences. Guess your partner&apos;s false sentences.</strong>
                </p>

                <div className={styles.modelDialogCard}>
                  <div className={styles.dialogLine}>
                    <span className={styles.speakerTag}>A:</span>
                    <span>I get up at 6 o&apos;clock on Mondays.</span>
                    <PronounceButton word="I get up at 6 o'clock on Mondays." size="small" />
                  </div>
                  <div className={styles.dialogLine}>
                    <span className={styles.speakerTag}>B:</span>
                    <span>That&apos;s not true!</span>
                    <PronounceButton word="That's not true!" size="small" />
                  </div>
                  <div className={styles.dialogLine}>
                    <span className={styles.speakerTag}>A:</span>
                    <span>You&apos;re right. I get up at 7 o&apos;clock on Mondays.</span>
                    <PronounceButton word="You're right. I get up at 7 o'clock on Mondays." size="small" />
                  </div>
                </div>
              </div>

              {/* App Notice */}
              <div className={styles.appNoticeBadge}>
                <span>📱</span>
                <span>Go to page 124 or your app for more information and practice.</span>
              </div>
            </div>
          </section>

          {/* SECTION 4: Speaking & Routine planning */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🎤</span>
                <span>Speaking: Weekend Routines</span>
              </h2>
            </div>

            {/* PREPARE - Exercise 10 */}
            <div className={styles.exerciseCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={styles.ribbonTag}>PREPARE</span>
                <p className={styles.exInstruction} style={{ margin: 0 }}>
                  <span className={styles.exBadge}>10</span>
                  <strong>What do you do on Fridays, Saturdays and Sundays? Make notes.</strong>
                </p>
              </div>

              <div className={styles.scheduleTable}>
                <div className={styles.scheduleCol}>
                  <h4 className={styles.scheduleDayTitle}>Friday (My routine)</h4>
                  <textarea
                    value={(getRecord(originalAnswers.exercise_10_routine))['friday'] || ''}
                    onChange={(e) => handleFieldChange('exercise_10_routine', 'friday', e.target.value)}
                    placeholder="Notes for Friday..."
                    disabled={readOnly}
                    className={styles.textareaInput}
                  />
                </div>
                <div className={styles.scheduleCol}>
                  <h4 className={styles.scheduleDayTitle}>Saturday (My routine)</h4>
                  <textarea
                    value={(getRecord(originalAnswers.exercise_10_routine))['saturday'] || ''}
                    onChange={(e) => handleFieldChange('exercise_10_routine', 'saturday', e.target.value)}
                    placeholder="Notes for Saturday..."
                    disabled={readOnly}
                    className={styles.textareaInput}
                  />
                </div>
                <div className={styles.scheduleCol}>
                  <h4 className={styles.scheduleDayTitle}>Sunday (My routine)</h4>
                  <textarea
                    value={(getRecord(originalAnswers.exercise_10_routine))['sunday'] || ''}
                    onChange={(e) => handleFieldChange('exercise_10_routine', 'sunday', e.target.value)}
                    placeholder="Notes for Sunday..."
                    disabled={readOnly}
                    className={styles.textareaInput}
                  />
                </div>
              </div>
            </div>

            {/* SPEAK - Exercise 11a & 11b */}
            <div className={styles.exerciseCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={styles.ribbonTag}>SPEAK</span>
                <p className={styles.exInstruction} style={{ margin: 0 }}>
                  <span className={styles.exBadge}>11a</span>
                  <strong>Work in pairs. Student A: Describe your routine. Student B: Make notes. Then swap roles and repeat.</strong>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fdf4ff', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                <span style={{ fontStyle: 'italic', color: '#db2777' }}>Starter prompt:</span>
                <span>&ldquo;On Fridays, I get up at...&rdquo;</span>
                <PronounceButton word="On Fridays, I get up at..." size="small" />
              </div>

              {/* Partner's notes table */}
              <div className={styles.scheduleTable}>
                <div className={styles.scheduleCol}>
                  <h4 className={styles.scheduleDayTitle}>Friday (Partner&apos;s routine)</h4>
                  <textarea
                    value={(getRecord(originalAnswers.exercise_11a_partner))['friday'] || ''}
                    onChange={(e) => handleFieldChange('exercise_11a_partner', 'friday', e.target.value)}
                    placeholder="Partner's Friday routine..."
                    disabled={readOnly}
                    className={styles.textareaInput}
                  />
                </div>
                <div className={styles.scheduleCol}>
                  <h4 className={styles.scheduleDayTitle}>Saturday (Partner&apos;s routine)</h4>
                  <textarea
                    value={(getRecord(originalAnswers.exercise_11a_partner))['saturday'] || ''}
                    onChange={(e) => handleFieldChange('exercise_11a_partner', 'saturday', e.target.value)}
                    placeholder="Partner's Saturday routine..."
                    disabled={readOnly}
                    className={styles.textareaInput}
                  />
                </div>
                <div className={styles.scheduleCol}>
                  <h4 className={styles.scheduleDayTitle}>Sunday (Partner&apos;s routine)</h4>
                  <textarea
                    value={(getRecord(originalAnswers.exercise_11a_partner))['sunday'] || ''}
                    onChange={(e) => handleFieldChange('exercise_11a_partner', 'sunday', e.target.value)}
                    placeholder="Partner's Sunday routine..."
                    disabled={readOnly}
                    className={styles.textareaInput}
                  />
                </div>
              </div>

              {/* Exercise 11b: Report back */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>11b</span>
                  <strong>Are your routines the same or different? Report back to the class.</strong>
                </p>

                {/* Model dialogue */}
                <div className={styles.modelDialogCard} style={{ margin: '0.65rem 0' }}>
                  <div className={styles.dialogLine}>
                    <span className={styles.speakerTag}>A:</span>
                    <span>We don&apos;t go to university on Saturdays.</span>
                    <PronounceButton word="We don't go to university on Saturdays." size="small" />
                  </div>
                  <div className={styles.dialogLine}>
                    <span className={styles.speakerTag}>B:</span>
                    <span>You have lunch at home on Saturdays. I have lunch in a café.</span>
                    <PronounceButton word="You have lunch at home on Saturdays. I have lunch in a café." size="small" />
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem' }}>
                  <label htmlFor="routine-comparison-report" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151', display: 'block', marginBottom: '0.35rem' }}>
                    Your summary report (comparison):
                  </label>
                  <textarea
                    id="routine-comparison-report"
                    value={(getRecord(originalAnswers.exercise_11b_report))['comparison'] || ''}
                    onChange={(e) => handleFieldChange('exercise_11b_report', 'comparison', e.target.value)}
                    placeholder="Write how your routines are the same or different (e.g. We don't go to university on Saturdays...)"
                    disabled={readOnly}
                    className={styles.textareaInput}
                    style={{ minHeight: '90px', width: '100%' }}
                  />
                </div>

                {/* Voice recording */}
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed #e5e7eb' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#4b5563', fontWeight: 600 }}>
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

              {/* Develop your reading badge */}
              <div className={styles.developReadingBadge}>
                <span>📖</span>
                <span>Develop your reading — page 98</span>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
