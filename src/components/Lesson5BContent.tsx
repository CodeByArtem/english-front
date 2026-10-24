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
import styles from './lesson5b.module.scss';

export interface Lesson5BContentProps {
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

export const FALLBACK_ANSWER_KEY_5B: LessonAnswerKey = {
  exercise_1a_matching: {
    '1': ['A', 'a', 'Photo A', 'photo a'],
    '2': ['F', 'f', 'Photo F', 'photo f'],
    '3': ['D', 'd', 'Photo D', 'photo d'],
    '4': ['B', 'b', 'Photo B', 'photo b'],
    '5': ['C', 'c', 'Photo C', 'photo c'],
    '6': ['E', 'e', 'Photo E', 'photo e'],
    '7': ['G', 'g', 'Photo G', 'photo g'],
  },
  exercise_2a_phrases: {
    '1': ['b', 'go/travel', 'travel/go', 'go', 'travel'],
    '2': ['c', 'take'],
    '3': ['a', 'cycle/drive/walk', 'cycle', 'drive', 'walk'],
  },
  exercise_2b_sentences: {
    '1': ['to'],
    '2': ['by'],
    '3': ['take'],
    '4': ['go', 'travel'],
    '5': ['to'],
  },
  exercise_2c_opposite: {
    '1': ['arrive', 'arrive at', 'Arrive', 'to arrive'],
  },
  exercise_3a_table: {
    tim_transport: ['train', 'by train', 'the train'],
    tim_leaves: ['6.45', '6:45', 'six forty-five', 'quarter to seven', 'at 6.45', 'at 6:45'],
    tim_arrives: ['8.00', '8:00', "8 o'clock", "eight o'clock", '8', 'eight', 'at 8.00', 'at 8:00'],
    donna_transport: ['car', 'by car'],
    donna_leaves: ['7.30', '7:30', 'seven thirty', 'half past seven', 'at 7.30', 'at 7:30'],
  },
  exercise_3b_questions: {
    '1': ['true', 'checked', 'yes'],
    '3': ['true', 'checked', 'yes'],
    '4': ['true', 'checked', 'yes'],
    '5': ['true', 'checked', 'yes'],
  },
  exercise_4_grammar: {
    '1': ['Do', 'do'],
    '2': ['do'],
    '3': ["don't", 'do not'],
    '4': ['do'],
    '5': ['do'],
    '6': ['do'],
  },
  exercise_5_pronunciation: {
    '1': ['different', 'Different'],
  },
  exercise_6_alternatives: {
    '1': ['do you travel'],
    '2': ['cycle'],
    '3': ['Do you go'],
    '4': ["we don't"],
    '5': ['do you leave'],
    '6': ['I walk'],
    '7': ['I take'],
    '8': ['do you arrive'],
    '9': ['do your children travel'],
    '10': ['They go'],
    '11': ['leave'],
    '12': ['do they arrive'],
  },
  exercise_7a_order: {
    '1': ['What time do you leave home?', 'What time do you leave home'],
    '2': ['Do you travel to work by bus?', 'Do you travel to work by bus'],
    '3': ['What time do you have lunch in your office?', 'What time do you have lunch in your office'],
    '4': ['How do you travel home?', 'How do you travel home'],
    '5': ['Do people at your office drive to work?', 'Do people at your office drive to work'],
    '6': [
      'Do you cycle on Saturdays and Sundays?',
      'Do you cycle on Saturdays and Sundays',
      'Do you cycle on Sundays and Saturdays?',
      'Do you cycle on Sundays and Saturdays',
    ],
  },
  exercise_8b_questions: {
    '2': ["Do you leave home at 8 o'clock?", "Do you leave home at 8 o'clock", "Do you leave home at 8:00?", "Do you leave home at 8:00"],
    '3': [
      'Have you got a long journey to work/university?',
      'Have you got a long journey to work/university',
      'Do you have a long journey to work/university?',
      'Do you have a long journey to work/university',
      'Have you got a long journey to work?',
      'Do you have a long journey to work?',
    ],
    '4': [
      'Do you take two different forms of transport?',
      'Do you take two different forms of transport',
    ],
    '5': [
      'Have you got a short journey to work/university?',
      'Have you got a short journey to work/university',
      'Do you have a short journey to work/university?',
      'Do you have a short journey to work/university',
      'Have you got a short journey to work?',
      'Do you have a short journey to work?',
    ],
  },
};

const TICK_QUESTIONS_3B = [
  { num: '1', text: 'Do you drive to work?' },
  { num: '2', text: 'Do you cycle to work every day?' },
  { num: '3', text: 'What time do you arrive at work?' },
  { num: '4', text: 'What time do you leave home?' },
  { num: '5', text: 'How do you travel to work?' },
];

const SURVEY_QUESTIONS_8A = [
  { num: '1', text: 'How many people in the class drive to work/university?' },
  { num: '2', text: "How many people in the class leave home at 8 o'clock?" },
  { num: '3', text: 'How many people have got a long journey to work/university?' },
  { num: '4', text: 'How many people take two different forms of transport?' },
  { num: '5', text: 'How many people have got a short journey to work/university?' },
];

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const TRANSPORT_PHOTOS = [
  { id: 'A', src: '/images/lesson5b/photo_a_bus.png', alt: 'London double-decker buses' },
  { id: 'B', src: '/images/lesson5b/photo_b_cars.png', alt: 'Cars in traffic jam' },
  { id: 'C', src: '/images/lesson5b/photo_c_taxi.png', alt: 'Black London taxis' },
  { id: 'D', src: '/images/lesson5b/photo_d_bike.png', alt: 'Commuter on bicycle' },
  { id: 'E', src: '/images/lesson5b/photo_e_train.png', alt: 'Commuter train on platform' },
  { id: 'F', src: '/images/lesson5b/photo_f_boat.png', alt: 'Ferry boat on water' },
  { id: 'G', src: '/images/lesson5b/photo_g_walk.png', alt: 'Woman walking in city' },
];

const TRANSPORT_SENTENCES = [
  { num: '1', text: 'I go to work by bus.' },
  { num: '2', text: 'I take a boat to work.' },
  { num: '3', text: 'I cycle to work. I love my bike!' },
  { num: '4', text: "I drive to my parents' house." },
  { num: '5', text: 'I travel to work by taxi.' },
  { num: '6', text: 'I go to the office by train.' },
  { num: '7', text: 'I walk home.' },
];

export default function Lesson5BContent(props: Lesson5BContentProps) {
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
    FALLBACK_ANSWER_KEY_5B;

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
        {/* Header Banner 5B */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge5B}>
              5<span className={styles.letterB}>B</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>A long journey</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: talk about how you travel to work/university</span>
                <span className={styles.pillGoal}>Grammar: present simple questions: I/you/we/they</span>
                <span className={styles.pillGoal}>Vocabulary: travel and transport</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.contentBody}>
          {/* SECTION 1: Vocabulary & Listening */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🚌</span>
                <span>Vocabulary & Listening: Transport</span>
              </h2>
            </div>

            {/* Exercise 1a: Match photos A-G */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>1a</span>
                <strong>Match photos A–G with sentences 1–7.</strong>
              </p>

              {/* Photos Gallery */}
              <div className={styles.photosGrid}>
                {TRANSPORT_PHOTOS.map((p) => (
                  <div key={p.id} className={styles.photoCard}>
                    <div className={styles.photoWrapper}>
                      <Image
                        src={p.src}
                        alt={p.alt}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <span className={styles.photoLetterBadge}>{p.id}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Matching sentences list */}
              <div className={styles.matchingList}>
                {TRANSPORT_SENTENCES.map((item) => (
                  <div key={item.num} className={styles.matchingRow}>
                    <div className={styles.sentenceText}>
                      <span className={styles.numBadge}>{item.num}</span>
                      <span>{item.text}</span>
                      <PronounceButton word={item.text} size="small" />
                    </div>
                    {renderInput('exercise_1a_matching', item.num, 'Letter', {
                      customClass: styles.matchInput,
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 1b: Listen and repeat */}
            <div className={styles.exerciseCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>1b</span>
                  <strong>Listen and repeat the sentences.</strong>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('5.4')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '5.4' || playingAudio === '/audio/5.4.mp3' ? '⏸ Playing 5.4' : '▶ Audio 5.4'}
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
                {TRANSPORT_SENTENCES.map((item) => (
                  <div
                    key={item.num}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f8fafc',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span><strong>{item.num}.</strong> {item.text}</span>
                    <PronounceButton word={item.text} size="small" />
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 1c: True for you */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>1c</span>
                <strong>Work in pairs. Which sentences in Exercise 1a are true for you? Tell your partner.</strong>
              </p>

              <div className={styles.trueCheckboxList}>
                {TRANSPORT_SENTENCES.map((item) => {
                  const isChecked = (getRecord(originalAnswers.exercise_1c_true))[item.num] === 'true';
                  return (
                    <label key={item.num} className={styles.trueCheckboxItem}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleFieldChange('exercise_1c_true', item.num, e.target.checked ? 'true' : '')
                        }
                      />
                      <span style={{ fontWeight: isChecked ? 600 : 400 }}>
                        {item.num}. {item.text}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                  Write your own sentence about how you travel:
                </span>
                {renderInput('exercise_1c_true', 'custom_sentence', 'e.g. I drive to work or I walk to university...', {
                  fullWidth: true,
                })}
              </div>

              {/* Model Pairwork Dialogue */}
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '0.35rem' }}>
                  Model dialogue:
                </span>
                <div className={styles.modelDialogCard}>
                  <div className={styles.dialogLine}>
                    <span className={styles.speakerTag}>A:</span>
                    <span>I cycle to work. I love my bike!</span>
                    <PronounceButton word="I cycle to work. I love my bike!" size="small" />
                  </div>
                  <div className={styles.dialogLine}>
                    <span className={styles.speakerTag}>B:</span>
                    <span>I go to work by bus.</span>
                    <PronounceButton word="I go to work by bus." size="small" />
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 2a: Transport phrases with verbs */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>2a</span>
                <strong>Complete transport phrases 1–3 with verbs a–c. Use Exercise 1a to help you.</strong>
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: '#eff6ff', padding: '0.75rem', borderRadius: '8px' }}>
                <span><strong>a</strong> cycle / drive / walk</span>
                <span><strong>b</strong> go / travel</span>
                <span><strong>c</strong> take</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>1</span>
                  {renderSelect('exercise_2a_phrases', '1', ['a', 'b', 'c'])}
                  <span>to work by bike / car / boat / taxi / train / bus</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>2</span>
                  {renderSelect('exercise_2a_phrases', '2', ['a', 'b', 'c'])}
                  <span>a boat / a train / a taxi / a bus to my house</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>3</span>
                  {renderSelect('exercise_2a_phrases', '3', ['a', 'b', 'c'])}
                  <span>to work / my parents&apos; house / the café</span>
                </div>
              </div>
            </div>

            {/* Exercise 2b & 2c: Sentences completion & opposite of leave */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>2b</span>
                <strong>Complete the sentences.</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>1 I go</span>
                  {renderInput('exercise_2b_sentences', '1', 'prep')}
                  <span>work by bus. I leave home at about 6.30.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>2 I go to work</span>
                  {renderInput('exercise_2b_sentences', '2', 'prep')}
                  <span>bus and train. I arrive at work at 8.00.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>3 I live in Hong Kong. I</span>
                  {renderInput('exercise_2b_sentences', '3', 'verb')}
                  <span>a boat to work. I leave the house at 7.00 and arrive at work at 8.00.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>4 I</span>
                  {renderInput('exercise_2b_sentences', '4', 'verb')}
                  <span>to work by bus. I leave home at 6.30.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>5 I drive</span>
                  {renderInput('exercise_2b_sentences', '5', 'prep')}
                  <span>work on Mondays and Tuesdays.</span>
                </div>
              </div>

              {/* 2c Opposite */}
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>2c</span>
                  <strong>Read the sentences in Exercise 2b again. What is the opposite of <em>leave</em>?</strong>
                </p>
                <div style={{ marginTop: '0.35rem' }}>
                  {renderInput('exercise_2c_opposite', '1', 'Opposite of leave...')}
                </div>
              </div>
            </div>

            {/* Exercise 3a: Tim & Donna commute table */}
            <div className={styles.exerciseCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>3a</span>
                  <strong>Listen to Tim and Donna and complete the table.</strong>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('5.5')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '5.5' || playingAudio === '/audio/5.5.mp3' ? '⏸ Playing 5.5' : '▶ Audio 5.5'}
                  </button>
                )}
              </div>

              {/* Two-column layout for Tim and Donna matching Pearson textbook */}
              <div className={styles.commuteGrid}>
                {/* Tim */}
                <div className={styles.personCommuteCard}>
                  <h4 className={styles.personCommuteHeader}>Tim</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span>travels to work by <strong>1</strong></span>
                    {renderInput('exercise_3a_table', 'tim_transport', 'transport')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span>leaves home at <strong>2</strong></span>
                    {renderInput('exercise_3a_table', 'tim_leaves', 'time')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span>arrives at work at <strong>3</strong></span>
                    {renderInput('exercise_3a_table', 'tim_arrives', 'time')}
                  </div>
                </div>

                {/* Donna */}
                <div className={styles.personCommuteCard}>
                  <h4 className={styles.personCommuteHeader}>Donna</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span>travels to work by <strong>4</strong></span>
                    {renderInput('exercise_3a_table', 'donna_transport', 'transport')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span>leaves home at <strong>5</strong></span>
                    {renderInput('exercise_3a_table', 'donna_leaves', 'time')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', color: '#6b7280' }}>
                    <span>arrives at work at:</span>
                    <strong style={{ color: '#1e40af' }}>8.30</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 3b: Tick questions heard */}
            <div className={styles.exerciseCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>3b</span>
                  <strong>Listen again. Tick the questions you hear.</strong>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('5.5')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '5.5' || playingAudio === '/audio/5.5.mp3' ? '⏸ Playing 5.5' : '▶ Audio 5.5'}
                  </button>
                )}
              </div>

              <div className={styles.trueCheckboxList}>
                {TICK_QUESTIONS_3B.map((q) => {
                  const isChecked = (getRecord(originalAnswers.exercise_3b_questions))[q.num] === 'true';
                  const v = verify('exercise_3b_questions', q.num, isChecked ? 'true' : '');
                  return (
                    <label key={q.num} className={styles.trueCheckboxItem}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleFieldChange('exercise_3b_questions', q.num, e.target.checked ? 'true' : '')
                        }
                      />
                      <span style={{ fontWeight: isChecked ? 600 : 400, flex: 1 }}>
                        {q.num}. {q.text}
                      </span>
                      {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
                      {v && v.status !== 'correct' && (
                        <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>✗</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION 2: Grammar */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📐</span>
                <span>Grammar: Present simple questions: I / you / we / they</span>
              </h2>
            </div>

            {/* Exercise 4: Grammar box */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>4</span>
                <strong>Read and complete the grammar box. Use Exercise 3b to help you.</strong>
              </p>

              <div className={styles.grammarBox}>
                <h3 className={styles.grammarTitle}>Present simple questions: I / you / we / they</h3>

                <div className={styles.grammarSubgrid}>
                  <div className={styles.grammarCardCol}>
                    <h4 className={styles.grammarColTitle}>Questions & Short Answers</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {renderSelect('exercise_4_grammar', '1', ['Do', 'Are', 'Have'])}
                      <span>I / you / we / they drive to work?</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span>+ Yes, I / you / we / they</span>
                      {renderSelect('exercise_4_grammar', '2', ['do', 'drive', 'am'])}
                      <span>.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span>- No, I / you / we / they</span>
                      {renderSelect('exercise_4_grammar', '3', ["don't", "aren't", "haven't"])}
                      <span>.</span>
                    </div>
                  </div>

                  <div className={styles.grammarCardCol}>
                    <h4 className={styles.grammarColTitle}>With Question Words</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span>How</span>
                      {renderSelect('exercise_4_grammar', '4', ['do', 'are', 'have'])}
                      <span>you travel to work?</span>
                      <em style={{ color: '#6b7280' }}>I cycle.</em>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span>What time</span>
                      {renderSelect('exercise_4_grammar', '5', ['do', 'are', 'is'])}
                      <span>you leave home?</span>
                      <em style={{ color: '#6b7280' }}>At 6.00.</em>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span>What time</span>
                      {renderSelect('exercise_4_grammar', '6', ['do', 'are', 'is'])}
                      <span>you arrive at work?</span>
                      <em style={{ color: '#6b7280' }}>At 8.00.</em>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 5: Pronunciation 5.6 */}
            <div className={styles.exerciseCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>5</span>
                  <strong>Listen to the conversations. Do the words in bold sound the same or different?</strong>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('5.6')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '5.6' || playingAudio === '/audio/5.6.mp3' ? '⏸ Playing 5.6' : '▶ Audio 5.6'}
                  </button>
                )}
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <p style={{ margin: 0 }}><strong>1 A:</strong> <em>Do</em> you go to work by bus? <strong>B:</strong> Yes, I <em>do</em>.</p>
                <p style={{ margin: 0 }}><strong>2 A:</strong> <em>Do</em> they walk to work? <strong>B:</strong> Yes, they <em>do</em>.</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span>Answer:</span>
                {renderSelect('exercise_5_pronunciation', '1', ['different', 'same'])}
              </div>
            </div>

            {/* Exercise 6: Dialogue alternatives */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>6</span>
                <strong>Choose the correct alternatives.</strong>
              </p>

              <div className={styles.conversationCard}>
                {/* Dialogue 1 */}
                <div className={styles.dialogueRow}>
                  <div>
                    <span className={styles.speakerLabel}>1 A:</span>
                    <span>How</span>{' '}
                    {renderSelect('exercise_6_alternatives', '1', ['you travel', 'do you travel'])}{' '}
                    <span>to work?</span>
                  </div>
                  <div>
                    <span className={styles.speakerLabel}>B:</span>
                    <span>I</span>{' '}
                    {renderSelect('exercise_6_alternatives', '2', ['cycle', 'do cycle'])}{' '}
                    <span>.</span>{' '}
                    {renderSelect('exercise_6_alternatives', '3', ['Do you go', 'Do you'])}{' '}
                    <span>by bike?</span>
                  </div>
                  <div>
                    <span className={styles.speakerLabel}>A:</span>
                    <span>No,</span>{' '}
                    {renderSelect('exercise_6_alternatives', '4', ["we don't", "we aren't"])}{' '}
                    <span>. We walk to work.</span>
                  </div>
                </div>

                {/* Dialogue 2 */}
                <div className={styles.dialogueRow}>
                  <div>
                    <span className={styles.speakerLabel}>2 A:</span>
                    <span>What time</span>{' '}
                    {renderSelect('exercise_6_alternatives', '5', ['leave', 'do you leave'])}{' '}
                    <span>home?</span>
                  </div>
                  <div>
                    <span className={styles.speakerLabel}>B:</span>
                    <span>At about eight o&apos;clock.</span>{' '}
                    {renderSelect('exercise_6_alternatives', '6', ['I walk', 'I am walk'])}{' '}
                    <span>to the station and</span>{' '}
                    {renderSelect('exercise_6_alternatives', '7', ['I take', 'I do take'])}{' '}
                    <span>the train to work.</span>
                  </div>
                  <div>
                    <span className={styles.speakerLabel}>A:</span>
                    <span>What time</span>{' '}
                    {renderSelect('exercise_6_alternatives', '8', ['you do', 'do you arrive'])}{' '}
                    <span>?</span>
                  </div>
                  <div>
                    <span className={styles.speakerLabel}>B:</span>
                    <span>At 8.30.</span>
                  </div>
                </div>

                {/* Dialogue 3 */}
                <div className={styles.dialogueRow}>
                  <div>
                    <span className={styles.speakerLabel}>3 A:</span>
                    <span>How</span>{' '}
                    {renderSelect('exercise_6_alternatives', '9', [
                      'your children travel',
                      'do your children travel',
                    ])}{' '}
                    <span>to school?</span>
                  </div>
                  <div>
                    <span className={styles.speakerLabel}>B:</span>
                    {renderSelect('exercise_6_alternatives', '10', ['Go', 'They go'])}{' '}
                    <span>by bus. They</span>{' '}
                    {renderSelect('exercise_6_alternatives', '11', ['leave', 'are leave'])}{' '}
                    <span>home at eight.</span>
                  </div>
                  <div>
                    <span className={styles.speakerLabel}>A:</span>
                    <span>What time</span>{' '}
                    {renderSelect('exercise_6_alternatives', '12', ['they arrive', 'do they arrive'])}{' '}
                    <span>?</span>
                  </div>
                  <div>
                    <span className={styles.speakerLabel}>B:</span>
                    <span>At 8.45.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 7a: Scrambled questions */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>7a</span>
                <strong>Put the words in the correct order to make questions.</strong>
              </p>

              <div className={styles.wordOrderList}>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>1 do / leave home / you / What time ?</span>
                  {renderInput('exercise_7a_order', '1', 'What time do you leave home?', { fullWidth: true })}
                </div>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>2 travel to work / you / by bus / Do ?</span>
                  {renderInput('exercise_7a_order', '2', 'Type question...', { fullWidth: true })}
                </div>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>3 you / do / in your office / have lunch / What time ?</span>
                  {renderInput('exercise_7a_order', '3', 'Type question...', { fullWidth: true })}
                </div>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>4 travel / home / you / do / How ?</span>
                  {renderInput('exercise_7a_order', '4', 'Type question...', { fullWidth: true })}
                </div>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>5 people / at your office / to work / drive / Do ?</span>
                  {renderInput('exercise_7a_order', '5', 'Type question...', { fullWidth: true })}
                </div>
                <div className={styles.wordOrderItem}>
                  <span className={styles.promptTokens}>6 cycle / on Saturdays / you / and Sundays / Do ?</span>
                  {renderInput('exercise_7a_order', '6', 'Type question...', { fullWidth: true })}
                </div>
              </div>
            </div>

            {/* Exercise 7b: Ask and answer questions in pairs */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>7b</span>
                <strong>Work in pairs. Ask and answer the questions in Exercise 7a.</strong>
              </p>

              <div className={styles.modelDialogCard}>
                <div className={styles.dialogLine}>
                  <span className={styles.speakerTag}>A:</span>
                  <span>What time do you leave home?</span>
                  <PronounceButton word="What time do you leave home?" size="small" />
                </div>
                <div className={styles.dialogLine}>
                  <span className={styles.speakerTag}>B:</span>
                  <span>I leave home at 8.00 from Monday to Friday.</span>
                  <PronounceButton word="I leave home at 8.00 from Monday to Friday." size="small" />
                </div>
              </div>

              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                  Write your personal answers to the questions:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={styles.numBadge}>1</span>
                    {renderInput('exercise_7b_answers', '1', 'Your answer (leave home time)...', { fullWidth: true })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={styles.numBadge}>2</span>
                    {renderInput('exercise_7b_answers', '2', 'Your answer (travel by bus)...', { fullWidth: true })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={styles.numBadge}>3</span>
                    {renderInput('exercise_7b_answers', '3', 'Your answer (lunch time)...', { fullWidth: true })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={styles.numBadge}>4</span>
                    {renderInput('exercise_7b_answers', '4', 'Your answer (travel home)...', { fullWidth: true })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={styles.numBadge}>5</span>
                    {renderInput('exercise_7b_answers', '5', 'Your answer (people driving)...', { fullWidth: true })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={styles.numBadge}>6</span>
                    {renderInput('exercise_7b_answers', '6', 'Your answer (weekend cycling)...', { fullWidth: true })}
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

          {/* SECTION 3: Speaking */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🎤</span>
                <span>Speaking: Commute Survey</span>
              </h2>
            </div>

            {/* PREPARE - Exercise 8a & 8b */}
            <div className={styles.exerciseCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={styles.ribbonTag}>PREPARE</span>
                <p className={styles.exInstruction} style={{ margin: 0 }}>
                  <span className={styles.exBadge}>8a</span>
                  <strong>Read the questions and guess the answers for your class.</strong>
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
                {SURVEY_QUESTIONS_8A.map((q) => (
                  <div key={q.num} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.95rem', color: '#1f2937', flex: 1, minWidth: '220px' }}>
                      <strong>{q.num}.</strong> {q.text}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Guess:</span>
                      {renderInput('exercise_8a_guesses', q.num, 'Number', { customClass: styles.matchInput })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Exercise 8b: Formulate the questions */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>8b</span>
                  <strong>How can you find the answers to the questions in Exercise 8a? Write questions.</strong>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
                  <div style={{ background: '#eff6ff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                    <span style={{ color: '#1d4ed8', fontWeight: 600 }}>1 (Example): </span>
                    <em>Do you drive to work/university?</em>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 600 }}>2 (leave home at 8 o&apos;clock):</span>
                    {renderInput('exercise_8b_questions', '2', "Do you leave home at 8 o'clock?", { fullWidth: true })}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 600 }}>3 (long journey):</span>
                    {renderInput('exercise_8b_questions', '3', 'Have you got a long journey to work/university?', { fullWidth: true })}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 600 }}>4 (two different forms of transport):</span>
                    {renderInput('exercise_8b_questions', '4', 'Do you take two different forms of transport?', { fullWidth: true })}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 600 }}>5 (short journey):</span>
                    {renderInput('exercise_8b_questions', '5', 'Have you got a short journey to work/university?', { fullWidth: true })}
                  </div>
                </div>
              </div>
            </div>

            {/* SPEAK - Exercise 9a & 9b */}
            <div className={styles.exerciseCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className={styles.ribbonTag}>SPEAK</span>
                <p className={styles.exInstruction} style={{ margin: 0 }}>
                  <span className={styles.exBadge}>9a</span>
                  <strong>Ask other students your questions from Exercise 8b. Make notes about their answers.</strong>
                </p>
              </div>

              {/* Classmate interview survey table */}
              <div className={styles.surveyTableWrap}>
                <table className={styles.surveyTable}>
                  <thead>
                    <tr>
                      <th>Classmate</th>
                      <th>1. Drive?</th>
                      <th>2. Leave at 8.00?</th>
                      <th>3. Long journey?</th>
                      <th>4. 2 forms transport?</th>
                      <th>5. Short journey?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['1', '2', '3'].map((idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            value={(getRecord(originalAnswers[`exercise_9a_survey_${idx}`]))['name'] || ''}
                            onChange={(e) => handleFieldChange(`exercise_9a_survey_${idx}`, 'name', e.target.value)}
                            placeholder={`Student ${idx}`}
                            disabled={readOnly}
                            className={styles.textInput}
                            style={{ width: '110px' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={(getRecord(originalAnswers[`exercise_9a_survey_${idx}`]))['q1'] || ''}
                            onChange={(e) => handleFieldChange(`exercise_9a_survey_${idx}`, 'q1', e.target.value)}
                            placeholder="Yes/No"
                            disabled={readOnly}
                            className={styles.textInput}
                            style={{ width: '65px', textAlign: 'center' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={(getRecord(originalAnswers[`exercise_9a_survey_${idx}`]))['q2'] || ''}
                            onChange={(e) => handleFieldChange(`exercise_9a_survey_${idx}`, 'q2', e.target.value)}
                            placeholder="Yes/No"
                            disabled={readOnly}
                            className={styles.textInput}
                            style={{ width: '65px', textAlign: 'center' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={(getRecord(originalAnswers[`exercise_9a_survey_${idx}`]))['q3'] || ''}
                            onChange={(e) => handleFieldChange(`exercise_9a_survey_${idx}`, 'q3', e.target.value)}
                            placeholder="Yes/No"
                            disabled={readOnly}
                            className={styles.textInput}
                            style={{ width: '65px', textAlign: 'center' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={(getRecord(originalAnswers[`exercise_9a_survey_${idx}`]))['q4'] || ''}
                            onChange={(e) => handleFieldChange(`exercise_9a_survey_${idx}`, 'q4', e.target.value)}
                            placeholder="Yes/No"
                            disabled={readOnly}
                            className={styles.textInput}
                            style={{ width: '65px', textAlign: 'center' }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={(getRecord(originalAnswers[`exercise_9a_survey_${idx}`]))['q5'] || ''}
                            onChange={(e) => handleFieldChange(`exercise_9a_survey_${idx}`, 'q5', e.target.value)}
                            placeholder="Yes/No"
                            disabled={readOnly}
                            className={styles.textInput}
                            style={{ width: '65px', textAlign: 'center' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Exercise 9b: Report what you learnt */}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>9b</span>
                  <strong>Work in pairs. Tell your partner what you learnt in Exercise 9a.</strong>
                </p>

                <div style={{ marginTop: '0.65rem' }}>
                  <label htmlFor="commute-summary-report" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151', display: 'block', marginBottom: '0.35rem' }}>
                    Summary report (e.g. <em>Three people in my class drive to work. Two people leave home at 8 o&apos;clock...</em>):
                  </label>
                  <textarea
                    id="commute-summary-report"
                    value={(getRecord(originalAnswers.exercise_9b_report))['summary'] || ''}
                    onChange={(e) => handleFieldChange('exercise_9b_report', 'summary', e.target.value)}
                    placeholder="Write what you discovered from your classmates' answers..."
                    disabled={readOnly}
                    className={styles.textareaInput}
                    style={{ minHeight: '80px', width: '100%' }}
                  />
                </div>

                {/* Spoken report voice recording */}
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
                      exerciseKey="exercise_9_speaking"
                      audios={props.submittedAudios}
                    />
                  )}
                </div>
              </div>

              {/* Develop your listening badge */}
              <div className={styles.developListeningBadge}>
                <span>🎧</span>
                <span>Develop your listening — page 99</span>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
