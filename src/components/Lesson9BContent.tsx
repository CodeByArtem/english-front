'use client';

import React, { useState, useEffect } from 'react';
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
import styles from './lesson9b.module.scss';

export interface Lesson9BContentProps {
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

export const FALLBACK_ANSWER_KEY_9B: LessonAnswerKey = {
  exercise_1a_matching: {
    '1': ['B', 'b', 'Photo B', 'photo b'],
    '2': ['A', 'a', 'Photo A', 'photo a'],
    '3': ['F', 'f', 'Photo F', 'photo f'],
    '4': ['D', 'd', 'Photo D', 'photo d'],
    '5': ['C', 'c', 'Photo C', 'photo c'],
    '6': ['E', 'e', 'Photo E', 'photo e'],
  },
  exercise_2a_collocations: {
    '1': ['watch', 'Watch'],
    '2': ['watch', 'Watch'],
    '3': ['play', 'Play'],
    '4': ['listen to', 'Listen to'],
    '5': ['read', 'Read'],
    '6_1': ['do', 'Do', 'play', 'Play'],
    '6_2': ['play', 'Play', 'do', 'Do'],
    '7': ['play', 'Play'],
    '8': ['listen to', 'Listen to'],
    '9_1': ['read', 'Read', 'listen to', 'Listen to'],
    '9_2': ['listen to', 'Listen to', 'read', 'Read'],
  },
  exercise_3_sentences: {
    '1': ['read', 'Read'],
    '2': ['listen', 'Listen'],
    '3': ['play', 'Play'],
    '4': ['played', 'Played'],
    '5': ['watched', 'Watched'],
    '6': ['read', 'Read'],
    '7': ['uses', 'Uses'],
    '8': ['watch', 'Watch'],
  },
  exercise_5a_tables: {
    tania_restaurants: ['likes/enjoys', 'enjoys', 'likes'],
    tania_books: ['hates'],
    tania_running: ['loves'],
    kristoff_dog: ['likes/enjoys', 'likes', 'enjoys'],
    kristoff_tv: ["doesn't like", 'does not like', 'doesnt like'],
    kristoff_games: ['hates'],
  },
  exercise_5b_options: {
    '1': ['a', 'A', 'friends'],
    '2': ['b', 'B', 'sports'],
    '3': ['b', 'B', 'running'],
    '4': ['a', 'A', 'in the park'],
    '5': ['a', 'A', 'watching TV'],
    '6': ['b', 'B', 'playing video games'],
  },
  exercise_6_grammar: {
    '1': ['walking', 'Walking'],
    '2': ['watching', 'Watching'],
    '3': ['reading', 'Reading'],
    '4': ['running', 'Running'],
    '5': ['reading', 'Reading'],
    '6': ['doing', 'Doing'],
    '7': ['doing', 'Doing'],
    '8': ['doing', 'Doing'],
  },
  exercise_8_sentences: {
    '1': ['staying', 'Staying'],
    '2': ['making', 'Making'],
    '3': ['studying', 'Studying'],
    '4': ['cleaning', 'Cleaning'],
    '5': ['travelling', 'traveling', 'Travelling', 'Traveling'],
    '6': ['eating', 'Eating'],
  },
};

const HOBBIES_PHOTOS = [
  { id: 'A', name: 'photo_a_music.png', title: 'Photo A', desc: 'Girl on bus with earphones' },
  { id: 'B', name: 'photo_b_exercise.png', title: 'Photo B', desc: 'Girl doing stretching exercise' },
  { id: 'C', name: 'photo_c_reading.png', title: 'Photo C', desc: 'Girl reading a yellow book' },
  { id: 'D', name: 'photo_d_internet.png', title: 'Photo D', desc: 'Man sitting with laptop' },
  { id: 'E', name: 'photo_e_film.png', title: 'Photo E', desc: 'People in cinema watching a film' },
  { id: 'F', name: 'photo_f_cards.png', title: 'Photo F', desc: 'People playing cards at table' },
];

const MATCHING_PHRASES_1A = [
  { id: '1', phrase: 'do exercise' },
  { id: '2', phrase: 'listen to music' },
  { id: '3', phrase: 'play cards' },
  { id: '4', phrase: 'use the internet' },
  { id: '5', phrase: 'read a book' },
  { id: '6', phrase: 'watch a film' },
];

const SENTENCES_EX3 = [
  { id: '1', textPre: '1 I usually ', textPost: ' a book on the train in the morning.' },
  { id: '2', textPre: '2 We usually ', textPost: ' to music at work.' },
  { id: '3', textPre: '3 Can you ', textPost: ' cards?' },
  { id: '4', textPre: '4 I ', textPost: ' video games with my friends last Friday.' },
  { id: '5', textPre: '5 I ', textPost: ' a good programme on TV last night.' },
  { id: '6', textPre: '6 I don’t ', textPost: ' newspapers.' },
  { id: '7', textPre: '7 She ', textPost: ' the internet in the evening.' },
  { id: '8', textPre: '8 They ', textPost: ' plays every week.' },
];

const MULTIPLE_CHOICE_5B = [
  {
    id: '1',
    q: '1 Tania enjoys going to restaurants with her ...',
    options: [
      { key: 'a', label: 'a friends' },
      { key: 'b', label: 'b parents' },
    ],
  },
  {
    id: '2',
    q: '2 Tania likes doing ...',
    options: [
      { key: 'a', label: 'a homework' },
      { key: 'b', label: 'b sports' },
    ],
  },
  {
    id: '3',
    q: '3 Tania’s sister doesn’t like ...',
    options: [
      { key: 'a', label: 'a dancing' },
      { key: 'b', label: 'b running' },
    ],
  },
  {
    id: '4',
    q: '4 Kristoff likes walking the dog ...',
    options: [
      { key: 'a', label: 'a in the park' },
      { key: 'b', label: 'b near the sea' },
    ],
  },
  {
    id: '5',
    q: '5 Kristoff’s sons love ...',
    options: [
      { key: 'a', label: 'a watching TV' },
      { key: 'b', label: 'b listening to music' },
    ],
  },
  {
    id: '6',
    q: '6 Kristoff’s sons like ...',
    options: [
      { key: 'a', label: 'a doing exercise' },
      { key: 'b', label: 'b playing video games' },
    ],
  },
];

const VERB_FORM_ITEMS_8 = [
  { id: '1', prompt: '1 I don’t like', verb: 'stay', post: 'at home at the weekend.' },
  { id: '2', prompt: '2 I enjoy', verb: 'make', post: 'dinner for my friends.' },
  { id: '3', prompt: '3 I hate', verb: 'study', post: 'in the evening.' },
  { id: '4', prompt: '4 I like', verb: 'clean', post: 'my flat on Sundays.' },
  { id: '5', prompt: '5 My children don’t like', verb: 'travel', post: 'by car, so we never go anywhere.' },
  { id: '6', prompt: '6 She loves', verb: 'eat', post: 'food from different countries.' },
];

export default function Lesson9BContent({
  isTeacherReview = false,
  readOnly = false,
  answerKey: propAnswerKey,
  playAudio: propPlayAudio,
  playingAudio: propPlayingAudio,
  originalAnswers = {},
  onAudioBlobChange,
  submissionId,
  submittedAudios = [],
}: Lesson9BContentProps) {
  const {
    answers = {},
    setAnswerField,
    setAnswer,
    playAudio: contextPlayAudio,
    playingAudio: contextPlayingAudio,
  } = useLessonContext();

  const playAudio = propPlayAudio || contextPlayAudio;
  const playingAudio = propPlayingAudio !== undefined ? propPlayingAudio : contextPlayingAudio;

  const isReview = Boolean(isTeacherReview || (propAnswerKey && readOnly));
  const activeAnswerKey = propAnswerKey || (isReview ? FALLBACK_ANSWER_KEY_9B : null);

  const getRecord = (obj: unknown): Record<string, string> => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      return obj as Record<string, string>;
    }
    return {};
  };

  // State answers from context
  const ex1aAnswers = getRecord(answers.exercise_1a_matching);
  const ex2aAnswers = getRecord(answers.exercise_2a_collocations);
  const ex3Answers = getRecord(answers.exercise_3_sentences);
  const ex4Answers = getRecord(answers.exercise_4_personal);
  const ex5aAnswers = getRecord(answers.exercise_5a_tables);
  const ex5bAnswers = getRecord(answers.exercise_5b_options);
  const ex6Answers = getRecord(answers.exercise_6_grammar);
  const ex8Answers = getRecord(answers.exercise_8_sentences);
  const ex10Survey = getRecord(answers.exercise_10_survey);
  const ex11Notes = typeof answers.exercise_11_notes === 'string' ? answers.exercise_11_notes : '';

  // Original answers for diff highlighting
  const origEx1a = getRecord(originalAnswers.exercise_1a_matching);
  const origEx2a = getRecord(originalAnswers.exercise_2a_collocations);
  const origEx3 = getRecord(originalAnswers.exercise_3_sentences);
  const origEx5a = getRecord(originalAnswers.exercise_5a_tables);
  const origEx5b = getRecord(originalAnswers.exercise_5b_options);
  const origEx6 = getRecord(originalAnswers.exercise_6_grammar);
  const origEx8 = getRecord(originalAnswers.exercise_8_sentences);

  // Field verification helper
  const verify = (exerciseName: string, field: string, value: string): VerificationResult | null => {
    if (!isReview) return null;
    const exKey = getExerciseKey(activeAnswerKey, exerciseName);
    return verifyAnswer(value, exKey?.[field]);
  };

  const isDiff = (origVal: string | undefined, currVal: string | undefined): boolean => {
    return Boolean(origVal !== undefined && origVal !== currVal);
  };

  const handleAudioToggle = (track: string) => {
    playAudio?.(track);
  };

  const [modalImage, setModalImage] = useState<{ src: string; alt: string; title: string } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalImage(null);
      }
    };
    if (modalImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalImage]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Header Banner 9B */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge9B}>
              9<span>B</span>
            </div>
            <h1 className={styles.lessonTitle}>Hobbies</h1>
          </div>
          <div className={styles.goalsBox}>
            <div className={styles.goalItem}>
              <strong>Goal:</strong> ask and answer about things you and I like doing
            </div>
            <div className={styles.goalItem}>
              <strong>Grammar:</strong> like / enjoy / love / hate + <em>-ing</em>
            </div>
            <div className={styles.goalItem}>
              <strong>Vocabulary:</strong> hobbies
            </div>
          </div>
        </header>

        <div className={styles.pageBody}>
          {/* ======================================================== */}
          {/* SECTION 1: VOCABULARY - HOBBIES                           */}
          {/* ======================================================== */}
          <section className={styles.lessonSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Vocabulary: Hobbies</h2>
            </div>

            {/* Exercise 1a */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1a</span>
                <p className={styles.exerciseTitle}>
                  Match photos A–F with phrases 1–6.
                </p>
              </div>

              {/* Photos Gallery A-F */}
              <div className={styles.hobbiesGrid}>
                {HOBBIES_PHOTOS.map((photo) => (
                  <div
                    key={photo.id}
                    className={styles.hobbyCard}
                    onClick={() =>
                      setModalImage({
                        src: `/images/lesson9b/${photo.name}`,
                        alt: photo.desc,
                        title: `${photo.title}: ${photo.desc}`,
                      })
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setModalImage({
                          src: `/images/lesson9b/${photo.name}`,
                          alt: photo.desc,
                          title: `${photo.title}: ${photo.desc}`,
                        });
                      }
                    }}
                    title="Click to view full picture"
                  >
                    <div className={styles.hobbyImgWrapper}>
                      <Image
                        src={`/images/lesson9b/${photo.name}`}
                        alt={photo.desc}
                        fill
                        sizes="(max-width: 600px) 50vw, 33vw"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className={styles.hobbyCardFooter}>
                      <span>{photo.title}</span>
                      <span className={styles.zoomHint} title="Click to enlarge">🔍</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Matching Phrases 1-6 */}
              <div className={styles.matchingList}>
                {MATCHING_PHRASES_1A.map((item) => {
                  const val = ex1aAnswers[item.id] || '';
                  const origVal = origEx1a[item.id];
                  const res = verify('exercise_1a_matching', item.id, val);
                  const isFieldDiff = isDiff(origVal, val);

                  return (
                    <div key={item.id} className={styles.matchingRow}>
                      <div className={styles.phraseText}>
                        <span className={styles.exerciseNum}>{item.id}</span> {item.phrase}
                      </div>
                      <div className={styles.matchingControl}>
                        <select
                          className={`${styles.selectInput} ${
                            isFieldDiff ? styles.diffHighlight : ''
                          } ${
                            res ? (res.isCorrect ? styles.fieldCorrect : styles.fieldIncorrect) : ''
                          }`}
                          value={val}
                          disabled={readOnly}
                          onChange={(e) =>
                            setAnswerField('exercise_1a_matching', item.id, e.target.value)
                          }
                        >
                          <option value="">Photo...</option>
                          {['A', 'B', 'C', 'D', 'E', 'F'].map((letter) => (
                            <option key={letter} value={letter}>
                              Photo {letter}
                            </option>
                          ))}
                        </select>
                        {res?.isCorrect && (
                          <span className={styles.correctBadge}>✓ Correct</span>
                        )}
                      </div>
                      {res && !res.isCorrect && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={res} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 1b */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1b</span>
                <p className={styles.exerciseTitle}>
                  Listen and repeat. Practice saying the phrases.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.4')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.4' ? '⏸ Pause Audio 9.4' : '▶ Audio 9.4'}
                </button>
              </div>
            </div>

            {/* Exercise 2a */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2a</span>
                <p className={styles.exerciseTitle}>
                  Complete the phrases with verbs from Exercise 1a (<em>do, listen to, play, use, read, watch</em>). Then listen and check your answers.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.5')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.5' ? '⏸ Pause Audio 9.5' : '▶ Audio 9.5'}
                </button>
              </div>

              <div className={styles.collocationsGrid}>
                {/* 1 a play */}
                <div className={styles.collocationItem}>
                  <div className={styles.collocationRow}>
                    <span>1</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx2a['1'], ex2aAnswers['1']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_2a_collocations', '1', ex2aAnswers['1'] || '')
                          ? verify('exercise_2a_collocations', '1', ex2aAnswers['1'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex2aAnswers['1'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) => setAnswerField('exercise_2a_collocations', '1', e.target.value)}
                    />
                    <span>a play</span>
                    {verify('exercise_2a_collocations', '1', ex2aAnswers['1'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_2a_collocations', '1', ex2aAnswers['1'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 2 a TV programme */}
                <div className={styles.collocationItem}>
                  <div className={styles.collocationRow}>
                    <span>2</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx2a['2'], ex2aAnswers['2']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_2a_collocations', '2', ex2aAnswers['2'] || '')
                          ? verify('exercise_2a_collocations', '2', ex2aAnswers['2'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex2aAnswers['2'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) => setAnswerField('exercise_2a_collocations', '2', e.target.value)}
                    />
                    <span>a TV programme</span>
                    {verify('exercise_2a_collocations', '2', ex2aAnswers['2'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_2a_collocations', '2', ex2aAnswers['2'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 3 a game */}
                <div className={styles.collocationItem}>
                  <div className={styles.collocationRow}>
                    <span>3</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx2a['3'], ex2aAnswers['3']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_2a_collocations', '3', ex2aAnswers['3'] || '')
                          ? verify('exercise_2a_collocations', '3', ex2aAnswers['3'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex2aAnswers['3'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) => setAnswerField('exercise_2a_collocations', '3', e.target.value)}
                    />
                    <span>a game</span>
                    {verify('exercise_2a_collocations', '3', ex2aAnswers['3'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_2a_collocations', '3', ex2aAnswers['3'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 4 the radio */}
                <div className={styles.collocationItem}>
                  <div className={styles.collocationRow}>
                    <span>4</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx2a['4'], ex2aAnswers['4']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_2a_collocations', '4', ex2aAnswers['4'] || '')
                          ? verify('exercise_2a_collocations', '4', ex2aAnswers['4'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex2aAnswers['4'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) => setAnswerField('exercise_2a_collocations', '4', e.target.value)}
                    />
                    <span>the radio</span>
                    {verify('exercise_2a_collocations', '4', ex2aAnswers['4'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_2a_collocations', '4', ex2aAnswers['4'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 5 a newspaper */}
                <div className={styles.collocationItem}>
                  <div className={styles.collocationRow}>
                    <span>5</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx2a['5'], ex2aAnswers['5']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_2a_collocations', '5', ex2aAnswers['5'] || '')
                          ? verify('exercise_2a_collocations', '5', ex2aAnswers['5'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex2aAnswers['5'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) => setAnswerField('exercise_2a_collocations', '5', e.target.value)}
                    />
                    <span>a newspaper</span>
                    {verify('exercise_2a_collocations', '5', ex2aAnswers['5'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_2a_collocations', '5', ex2aAnswers['5'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 6 some sport (do / play) */}
                <div className={styles.collocationItem}>
                  <div className={styles.collocationRow}>
                    <span>6</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx2a['6_1'], ex2aAnswers['6_1']) ? styles.diffHighlight : ''
                      }`}
                      value={ex2aAnswers['6_1'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) => setAnswerField('exercise_2a_collocations', '6_1', e.target.value)}
                    />
                    <span>/</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx2a['6_2'], ex2aAnswers['6_2']) ? styles.diffHighlight : ''
                      }`}
                      value={ex2aAnswers['6_2'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) => setAnswerField('exercise_2a_collocations', '6_2', e.target.value)}
                    />
                    <span>some sport</span>
                    {verify('exercise_2a_collocations', '6_1', ex2aAnswers['6_1'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const r1 = verify('exercise_2a_collocations', '6_1', ex2aAnswers['6_1'] || '');
                    const r2 = verify('exercise_2a_collocations', '6_2', ex2aAnswers['6_2'] || '');
                    const hasErr = (r1 && !r1.isCorrect) || (r2 && !r2.isCorrect);
                    return hasErr ? (
                      <div className={styles.feedbackRow}>
                        {r1 && !r1.isCorrect && <TeacherAnswerBadge result={r1} />}
                        {r2 && !r2.isCorrect && <TeacherAnswerBadge result={r2} />}
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 7 a video game */}
                <div className={styles.collocationItem}>
                  <div className={styles.collocationRow}>
                    <span>7</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx2a['7'], ex2aAnswers['7']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_2a_collocations', '7', ex2aAnswers['7'] || '')
                          ? verify('exercise_2a_collocations', '7', ex2aAnswers['7'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex2aAnswers['7'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) => setAnswerField('exercise_2a_collocations', '7', e.target.value)}
                    />
                    <span>a video game</span>
                    {verify('exercise_2a_collocations', '7', ex2aAnswers['7'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_2a_collocations', '7', ex2aAnswers['7'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 8 a song */}
                <div className={styles.collocationItem}>
                  <div className={styles.collocationRow}>
                    <span>8</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx2a['8'], ex2aAnswers['8']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_2a_collocations', '8', ex2aAnswers['8'] || '')
                          ? verify('exercise_2a_collocations', '8', ex2aAnswers['8'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex2aAnswers['8'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) => setAnswerField('exercise_2a_collocations', '8', e.target.value)}
                    />
                    <span>a song</span>
                    {verify('exercise_2a_collocations', '8', ex2aAnswers['8'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_2a_collocations', '8', ex2aAnswers['8'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 9 a story (read / listen to) */}
                <div className={styles.collocationItem}>
                  <div className={styles.collocationRow}>
                    <span>9</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx2a['9_1'], ex2aAnswers['9_1']) ? styles.diffHighlight : ''
                      }`}
                      value={ex2aAnswers['9_1'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) => setAnswerField('exercise_2a_collocations', '9_1', e.target.value)}
                    />
                    <span>/</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx2a['9_2'], ex2aAnswers['9_2']) ? styles.diffHighlight : ''
                      }`}
                      value={ex2aAnswers['9_2'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) => setAnswerField('exercise_2a_collocations', '9_2', e.target.value)}
                    />
                    <span>a story</span>
                    {verify('exercise_2a_collocations', '9_1', ex2aAnswers['9_1'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const r1 = verify('exercise_2a_collocations', '9_1', ex2aAnswers['9_1'] || '');
                    const r2 = verify('exercise_2a_collocations', '9_2', ex2aAnswers['9_2'] || '');
                    const hasErr = (r1 && !r1.isCorrect) || (r2 && !r2.isCorrect);
                    return hasErr ? (
                      <div className={styles.feedbackRow}>
                        {r1 && !r1.isCorrect && <TeacherAnswerBadge result={r1} />}
                        {r2 && !r2.isCorrect && <TeacherAnswerBadge result={r2} />}
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>

            {/* Exercise 2b */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2b</span>
                <p className={styles.exerciseTitle}>
                  Listen again and repeat. Practice the collocations.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.5')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.5' ? '⏸ Pause Audio 9.5' : '▶ Audio 9.5'}
                </button>
              </div>
            </div>

            {/* Exercise 3 */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>3</span>
                <p className={styles.exerciseTitle}>
                  Complete the sentences with the correct verbs (base form, past simple or present simple).
                </p>
              </div>

              <div className={styles.matchingList}>
                {SENTENCES_EX3.map((item) => {
                  const val = ex3Answers[item.id] || '';
                  const origVal = origEx3[item.id];
                  const res = verify('exercise_3_sentences', item.id, val);
                  const isFieldDiff = isDiff(origVal, val);

                  return (
                    <div key={item.id} className={styles.collocationItem}>
                      <div className={styles.collocationRow}>
                        <span>{item.textPre}</span>
                        <input
                          type="text"
                          className={`${styles.textInput} ${styles.shortInput} ${
                            isFieldDiff ? styles.diffHighlight : ''
                          } ${
                            res ? (res.isCorrect ? styles.fieldCorrect : styles.fieldIncorrect) : ''
                          }`}
                          value={val}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) =>
                            setAnswerField('exercise_3_sentences', item.id, e.target.value)
                          }
                        />
                        <span>{item.textPost}</span>
                        {res?.isCorrect && (
                          <span className={styles.correctBadge}>✓</span>
                        )}
                      </div>
                      {res && !res.isCorrect && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={res} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 4 */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>4</span>
                <p className={styles.exerciseTitle}>
                  Work in pairs. Ask and answer questions using the phrases in Exercise 1a. Write your personal answers:
                </p>
              </div>

              <div className={styles.matchingList}>
                {[
                  { id: '1', q: '1 How often do you ...?' },
                  { id: '2', q: '2 Did you ... last night?' },
                  { id: '3', q: '3 Where do you usually ...?' },
                  { id: '4', q: '4 Do you sometimes ... on the train?' },
                  { id: '5', q: '5 Do you usually ... at dinner time?' },
                ].map((item) => {
                  const val = ex4Answers[item.id] || '';
                  return (
                    <div key={item.id} className={styles.optionCard}>
                      <span className={styles.optionQuestion}>{item.q}</span>
                      <input
                        type="text"
                        className={styles.textInput}
                        value={val}
                        disabled={readOnly}
                        placeholder="Write your answer..."
                        onChange={(e) =>
                          setAnswerField('exercise_4_personal', item.id, e.target.value)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* SECTION 2: LISTENING - TANIA & KRISTOFF                   */}
          {/* ======================================================== */}
          <section className={styles.lessonSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Listening: Weekend interviews</h2>
            </div>

            {/* Exercise 5a */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>5a</span>
                <p className={styles.exerciseTitle}>
                  Listen to two interviews about the weekend. Complete the tables.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.6')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.6' ? '⏸ Pause Audio 9.6' : '▶ Audio 9.6'}
                </button>
              </div>

              <div className={styles.interviewTablesWrapper}>
                {/* Table 1: Tania */}
                <div className={styles.interviewTableCard}>
                  <div className={styles.interviewTableHeader}>
                    <span>1 Tania</span>
                  </div>
                  <table className={styles.prefTable}>
                    <thead>
                      <tr>
                        <th>Activity</th>
                        <th>loves</th>
                        <th>likes/enjoys</th>
                        <th>doesn’t like</th>
                        <th>hates</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: 'tania_restaurants', label: 'going to restaurants' },
                        { key: 'tania_books', label: 'reading books' },
                        { key: 'tania_running', label: 'running in the park' },
                      ].map((row) => {
                        const val = ex5aAnswers[row.key] || '';
                        const origVal = origEx5a[row.key];
                        const res = verify('exercise_5a_tables', row.key, val);
                        const isFieldDiff = isDiff(origVal, val);

                        return (
                          <React.Fragment key={row.key}>
                            <tr>
                              <td>{row.label}</td>
                              {['loves', 'likes/enjoys', "doesn't like", 'hates'].map((col) => (
                                <td key={col}>
                                  <input
                                    type="radio"
                                    name={row.key}
                                    className={`${styles.tickRadio} ${
                                      isFieldDiff ? styles.diffHighlight : ''
                                    }`}
                                    checked={val === col}
                                    disabled={readOnly}
                                    onChange={() => setAnswerField('exercise_5a_tables', row.key, col)}
                                  />
                                </td>
                              ))}
                            </tr>
                            {res && !res.isCorrect && (
                              <tr>
                                <td colSpan={5}>
                                  <div className={styles.feedbackRow}>
                                    <TeacherAnswerBadge result={res} />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table 2: Kristoff */}
                <div className={styles.interviewTableCard}>
                  <div className={styles.interviewTableHeader}>
                    <span>2 Kristoff</span>
                  </div>
                  <table className={styles.prefTable}>
                    <thead>
                      <tr>
                        <th>Activity</th>
                        <th>loves</th>
                        <th>likes/enjoys</th>
                        <th>doesn’t like</th>
                        <th>hates</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: 'kristoff_dog', label: 'walking the dog' },
                        { key: 'kristoff_tv', label: 'watching TV' },
                        { key: 'kristoff_games', label: 'playing video games' },
                      ].map((row) => {
                        const val = ex5aAnswers[row.key] || '';
                        const origVal = origEx5a[row.key];
                        const res = verify('exercise_5a_tables', row.key, val);
                        const isFieldDiff = isDiff(origVal, val);

                        return (
                          <React.Fragment key={row.key}>
                            <tr>
                              <td>{row.label}</td>
                              {['loves', 'likes/enjoys', "doesn't like", 'hates'].map((col) => (
                                <td key={col}>
                                  <input
                                    type="radio"
                                    name={row.key}
                                    className={`${styles.tickRadio} ${
                                      isFieldDiff ? styles.diffHighlight : ''
                                    }`}
                                    checked={val === col}
                                    disabled={readOnly}
                                    onChange={() => setAnswerField('exercise_5a_tables', row.key, col)}
                                  />
                                </td>
                              ))}
                            </tr>
                            {res && !res.isCorrect && (
                              <tr>
                                <td colSpan={5}>
                                  <div className={styles.feedbackRow}>
                                    <TeacherAnswerBadge result={res} />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Exercise 5b */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>5b</span>
                <p className={styles.exerciseTitle}>
                  Listen again. Choose the correct option, a or b.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.6')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.6' ? '⏸ Pause Audio 9.6' : '▶ Audio 9.6'}
                </button>
              </div>

              <div className={styles.optionsGrid}>
                {MULTIPLE_CHOICE_5B.map((item) => {
                  const val = ex5bAnswers[item.id] || '';
                  const origVal = origEx5b[item.id];
                  const res = verify('exercise_5b_options', item.id, val);
                  const isFieldDiff = isDiff(origVal, val);

                  return (
                    <div key={item.id} className={styles.optionCard}>
                      <span className={styles.optionQuestion}>{item.q}</span>
                      <div className={styles.optionChoices}>
                        {item.options.map((opt) => (
                          <button
                            key={opt.key}
                            type="button"
                            className={`${styles.choiceBtn} ${
                              val === opt.key ? styles.activeChoice : ''
                            } ${isFieldDiff ? styles.diffHighlight : ''}`}
                            disabled={readOnly}
                            onClick={() => setAnswerField('exercise_5b_options', item.id, opt.key)}
                          >
                            <span>{opt.label}</span>
                            {val === opt.key && res?.isCorrect && (
                              <span className={styles.correctBadge}>✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                      {res && !res.isCorrect && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={res} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* SECTION 3: GRAMMAR - LIKE / ENJOY / LOVE / HATE + -ING    */}
          {/* ======================================================== */}
          <section className={styles.lessonSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Grammar: like / enjoy / love / hate + -ing</h2>
            </div>

            {/* Exercise 6: Grammar Box */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>6</span>
                <p className={styles.exerciseTitle}>
                  Read and complete the grammar box. Use Exercise 5 to help you.
                </p>
              </div>

              <div className={styles.grammarBox}>
                <h3 className={styles.grammarBoxTitle}>
                  like/enjoy/love/hate + -ing
                </h3>

                {/* Statements */}
                <div className={styles.grammarSubSection}>
                  <h4>Statements</h4>
                  <div className={styles.collocationsGrid}>
                    {/* + I/You/We/They */}
                    <div className={styles.collocationItem}>
                      <div className={styles.collocationRow}>
                        <span>+ I/You/We/They like/enjoy/love/hate</span>
                        <input
                          type="text"
                          className={`${styles.textInput} ${styles.shortInput} ${
                            isDiff(origEx6['1'], ex6Answers['1']) ? styles.diffHighlight : ''
                          }`}
                          value={ex6Answers['1'] || ''}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) => setAnswerField('exercise_6_grammar', '1', e.target.value)}
                        />
                        <span>the dog.</span>
                        {verify('exercise_6_grammar', '1', ex6Answers['1'] || '')?.isCorrect && (
                          <span className={styles.correctBadge}>✓</span>
                        )}
                      </div>
                      {(() => {
                        const res = verify('exercise_6_grammar', '1', ex6Answers['1'] || '');
                        return res && !res.isCorrect ? (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={res} />
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* - I/You/We/They */}
                    <div className={styles.collocationItem}>
                      <div className={styles.collocationRow}>
                        <span>– I/You/We/They don’t like</span>
                        <input
                          type="text"
                          className={`${styles.textInput} ${styles.shortInput} ${
                            isDiff(origEx6['2'], ex6Answers['2']) ? styles.diffHighlight : ''
                          }`}
                          value={ex6Answers['2'] || ''}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) => setAnswerField('exercise_6_grammar', '2', e.target.value)}
                        />
                        <span>TV.</span>
                        {verify('exercise_6_grammar', '2', ex6Answers['2'] || '')?.isCorrect && (
                          <span className={styles.correctBadge}>✓</span>
                        )}
                      </div>
                      {(() => {
                        const res = verify('exercise_6_grammar', '2', ex6Answers['2'] || '');
                        return res && !res.isCorrect ? (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={res} />
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* + He/She/It */}
                    <div className={styles.collocationItem}>
                      <div className={styles.collocationRow}>
                        <span>+ He/She/It likes/enjoys/loves/hates</span>
                        <input
                          type="text"
                          className={`${styles.textInput} ${styles.shortInput} ${
                            isDiff(origEx6['3'], ex6Answers['3']) ? styles.diffHighlight : ''
                          }`}
                          value={ex6Answers['3'] || ''}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) => setAnswerField('exercise_6_grammar', '3', e.target.value)}
                        />
                        <span>books.</span>
                        {verify('exercise_6_grammar', '3', ex6Answers['3'] || '')?.isCorrect && (
                          <span className={styles.correctBadge}>✓</span>
                        )}
                      </div>
                      {(() => {
                        const res = verify('exercise_6_grammar', '3', ex6Answers['3'] || '');
                        return res && !res.isCorrect ? (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={res} />
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* - He/She/It */}
                    <div className={styles.collocationItem}>
                      <div className={styles.collocationRow}>
                        <span>– He/She/It doesn’t like</span>
                        <input
                          type="text"
                          className={`${styles.textInput} ${styles.shortInput} ${
                            isDiff(origEx6['4'], ex6Answers['4']) ? styles.diffHighlight : ''
                          }`}
                          value={ex6Answers['4'] || ''}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) => setAnswerField('exercise_6_grammar', '4', e.target.value)}
                        />
                        <span>in the park.</span>
                        {verify('exercise_6_grammar', '4', ex6Answers['4'] || '')?.isCorrect && (
                          <span className={styles.correctBadge}>✓</span>
                        )}
                      </div>
                      {(() => {
                        const res = verify('exercise_6_grammar', '4', ex6Answers['4'] || '');
                        return res && !res.isCorrect ? (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={res} />
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </div>

                {/* Yes/No & Wh- questions */}
                <div className={styles.grammarSubSection}>
                  <h4>Questions</h4>
                  <div className={styles.collocationsGrid}>
                    {/* Yes/No 1 */}
                    <div className={styles.collocationItem}>
                      <div className={styles.collocationRow}>
                        <span>Do I/you/we/they like</span>
                        <input
                          type="text"
                          className={`${styles.textInput} ${styles.shortInput} ${
                            isDiff(origEx6['5'], ex6Answers['5']) ? styles.diffHighlight : ''
                          }`}
                          value={ex6Answers['5'] || ''}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) => setAnswerField('exercise_6_grammar', '5', e.target.value)}
                        />
                        <span>books?</span>
                        {verify('exercise_6_grammar', '5', ex6Answers['5'] || '')?.isCorrect && (
                          <span className={styles.correctBadge}>✓</span>
                        )}
                      </div>
                      {(() => {
                        const res = verify('exercise_6_grammar', '5', ex6Answers['5'] || '');
                        return res && !res.isCorrect ? (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={res} />
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Yes/No 2 */}
                    <div className={styles.collocationItem}>
                      <div className={styles.collocationRow}>
                        <span>Does he/she/it like</span>
                        <input
                          type="text"
                          className={`${styles.textInput} ${styles.shortInput} ${
                            isDiff(origEx6['6'], ex6Answers['6']) ? styles.diffHighlight : ''
                          }`}
                          value={ex6Answers['6'] || ''}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) => setAnswerField('exercise_6_grammar', '6', e.target.value)}
                        />
                        <span>exercise?</span>
                        {verify('exercise_6_grammar', '6', ex6Answers['6'] || '')?.isCorrect && (
                          <span className={styles.correctBadge}>✓</span>
                        )}
                      </div>
                      {(() => {
                        const res = verify('exercise_6_grammar', '6', ex6Answers['6'] || '');
                        return res && !res.isCorrect ? (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={res} />
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Wh- 1 */}
                    <div className={styles.collocationItem}>
                      <div className={styles.collocationRow}>
                        <span>What do you like</span>
                        <input
                          type="text"
                          className={`${styles.textInput} ${styles.shortInput} ${
                            isDiff(origEx6['7'], ex6Answers['7']) ? styles.diffHighlight : ''
                          }`}
                          value={ex6Answers['7'] || ''}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) => setAnswerField('exercise_6_grammar', '7', e.target.value)}
                        />
                        <span>at the weekend?</span>
                        {verify('exercise_6_grammar', '7', ex6Answers['7'] || '')?.isCorrect && (
                          <span className={styles.correctBadge}>✓</span>
                        )}
                      </div>
                      {(() => {
                        const res = verify('exercise_6_grammar', '7', ex6Answers['7'] || '');
                        return res && !res.isCorrect ? (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={res} />
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Wh- 2 */}
                    <div className={styles.collocationItem}>
                      <div className={styles.collocationRow}>
                        <span>What does she like</span>
                        <input
                          type="text"
                          className={`${styles.textInput} ${styles.shortInput} ${
                            isDiff(origEx6['8'], ex6Answers['8']) ? styles.diffHighlight : ''
                          }`}
                          value={ex6Answers['8'] || ''}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) => setAnswerField('exercise_6_grammar', '8', e.target.value)}
                        />
                        <span>at the weekend?</span>
                        {verify('exercise_6_grammar', '8', ex6Answers['8'] || '')?.isCorrect && (
                          <span className={styles.correctBadge}>✓</span>
                        )}
                      </div>
                      {(() => {
                        const res = verify('exercise_6_grammar', '8', ex6Answers['8'] || '');
                        return res && !res.isCorrect ? (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={res} />
                          </div>
                        ) : null;
                          })()}
                    </div>
                  </div>
                </div>

                {/* -ing form spelling rules */}
                <div className={styles.grammarSubSection}>
                  <h4>-ing form spelling rules</h4>
                  <ul className={styles.grammarRulesList}>
                    <li><strong>verb + -ing:</strong> <em>do &rarr; doing, read &rarr; reading, watch &rarr; watching</em></li>
                    <li><strong>verbs ending in -e:</strong> drop the final -e (<em>make &rarr; making, write &rarr; writing</em>)</li>
                    <li><strong>verbs ending in consonant + vowel + consonant:</strong> double the final consonant (<em>travel &rarr; travelling, swim &rarr; swimming</em>), <strong>BUT</strong> <em>visit &rarr; visiting</em></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Exercise 7a & 7b */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>7a</span>
                <p className={styles.exerciseTitle}>
                  Listen to the sentences. Notice the weak pronunciation of <em>-ing</em> (/ɪŋ/).
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.7')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.7' ? '⏸ Pause Audio 9.7' : '▶ Audio 9.7'}
                </button>
              </div>

              <div className={styles.matchingList}>
                {[
                  '1 I like watching films.',
                  '2 I don’t like reading newspapers.',
                  '3 I hate cleaning the bathroom.',
                  '4 I enjoy taking photos.',
                  '5 Do you like playing football?',
                  '6 What do you like doing at the weekend?',
                ].map((s, idx) => (
                  <div key={idx} className={styles.collocationItem}>
                    <span className={styles.phraseText}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>7b</span>
                <p className={styles.exerciseTitle}>
                  Listen again and repeat. Practice pronouncing the <em>-ing</em> sound softly.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.7')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.7' ? '⏸ Pause Audio 9.7' : '▶ Audio 9.7'}
                </button>
              </div>
            </div>

            {/* Exercise 8 */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>8</span>
                <p className={styles.exerciseTitle}>
                  Complete the sentences with the correct form of the verbs in brackets.
                </p>
              </div>

              <div className={styles.matchingList}>
                {VERB_FORM_ITEMS_8.map((item) => {
                  const val = ex8Answers[item.id] || '';
                  const origVal = origEx8[item.id];
                  const res = verify('exercise_8_sentences', item.id, val);
                  const isFieldDiff = isDiff(origVal, val);

                  return (
                    <div key={item.id} className={styles.collocationItem}>
                      <div className={styles.collocationRow}>
                        <span>{item.prompt}</span>
                        <input
                          type="text"
                          className={`${styles.textInput} ${styles.shortInput} ${
                            isFieldDiff ? styles.diffHighlight : ''
                          } ${
                            res ? (res.isCorrect ? styles.fieldCorrect : styles.fieldIncorrect) : ''
                          }`}
                          value={val}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) =>
                            setAnswerField('exercise_8_sentences', item.id, e.target.value)
                          }
                        />
                        <span>({item.verb}) {item.post}</span>
                        {res?.isCorrect && (
                          <span className={styles.correctBadge}>✓</span>
                        )}
                      </div>
                      {res && !res.isCorrect && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={res} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 9 */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>9</span>
                <p className={styles.exerciseTitle}>
                  Work in pairs. Ask and answer questions with <em>Do you like ...?</em> and the phrases in Exercise 8.
                </p>
              </div>
              <div className={styles.speakPromptBox}>
                <p><strong>Example dialogue:</strong></p>
                <div className={styles.sampleDialogue}>
                  <span><strong>A:</strong> Do you like staying at home at the weekend?</span>
                  <span><strong>B:</strong> No, I don’t. I never stay at home at the weekend. I always go somewhere.</span>
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* SECTION 4: SPEAKING - PREPARE & SPEAK                     */}
          {/* ======================================================== */}
          <section className={styles.lessonSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Speaking: Entertainment survey</h2>
            </div>

            {/* Exercise 10: PREPARE */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>10</span>
                <p className={styles.exerciseTitle}>
                  <strong>PREPARE:</strong> Read questions 1–3 in the entertainment survey. Write six more questions. Use Exercises 1 and 2 to help you.
                </p>
              </div>

              {/* Clipboard Survey */}
              <div className={styles.clipboardWrapper}>
                <div className={styles.clipboardCard}>
                  <div className={styles.clipboardClip} />
                  <h3 className={styles.clipboardTitle}>What do you like doing?</h3>

                  <div className={styles.clipboardFixedList}>
                    <div className={styles.clipboardFixedItem}>1 Do you like reading the newspaper?</div>
                    <div className={styles.clipboardFixedItem}>2 Do you like listening to music?</div>
                    <div className={styles.clipboardFixedItem}>3 Do you like playing cards?</div>
                  </div>

                  <div className={styles.surveyQuestionsInputs}>
                    {[4, 5, 6, 7, 8, 9].map((num) => {
                      const key = `q_${num}`;
                      const val = ex10Survey[key] || '';
                      return (
                        <div key={num} className={styles.collocationRow}>
                          <span>{num}</span>
                          <input
                            type="text"
                            className={styles.textInput}
                            value={val}
                            disabled={readOnly}
                            placeholder="Do you like ...?"
                            onChange={(e) =>
                              setAnswerField('exercise_10_survey', key, e.target.value)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 11a & 11b: SPEAK */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>11a</span>
                <p className={styles.exerciseTitle}>
                  <strong>SPEAK:</strong> Work in pairs. Ask and answer the questions in Exercise 10. Make notes about your partner’s answers:
                </p>
              </div>

              <div className={styles.speakPromptBox}>
                <p><strong>Example conversation:</strong></p>
                <div className={styles.sampleDialogue}>
                  <span><strong>A:</strong> Do you like reading the newspaper?</span>
                  <span><strong>B:</strong> Yes, I do. I often read the newspaper on the train to work.</span>
                </div>
              </div>

              <textarea
                className={styles.textInput}
                style={{ minHeight: '90px', marginTop: '0.5rem', fontFamily: 'inherit' }}
                value={ex11Notes}
                disabled={readOnly}
                placeholder="Write notes about your partner’s likes and dislikes..."
                onChange={(e) => setAnswer('exercise_11_notes', e.target.value)}
              />
            </div>

            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>11b</span>
                <p className={styles.exerciseTitle}>
                  Tell the class about your partner. Record your voice summary for your teacher:
                </p>
              </div>

              <div className={styles.speakPromptBox}>
                <p><strong>Example summary:</strong></p>
                <div className={styles.sampleDialogue}>
                  <span><em>Fernando likes reading the newspaper. He often reads it on the train to work. He also loves watching films with his friends, but he hates doing exercise on Saturdays!</em></span>
                </div>
              </div>

              {/* Audio Answer Recorder for student oral submission */}
              <div style={{ marginTop: '1rem' }}>
                <AudioAnswerRecorder
                  onAudioChange={(blob: Blob | null, mime: string) =>
                    onAudioBlobChange?.(blob, mime, 'speaking_9b_survey')
                  }
                  readOnly={readOnly}
                />

                {submissionId && submittedAudios.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <SubmissionAudioPlayer
                      audios={submittedAudios}
                      submissionId={submissionId}
                      exerciseKey="speaking_9b_survey"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Badge Develop your listening */}
            <div className={styles.developListeningBadge}>
              <div className={styles.badgeImgWrapper}>
                <Image
                  src="/images/lesson9b/badge_develop_listening.png"
                  alt="Develop your listening - page 111"
                  fill
                  sizes="160px"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Lightbox zoom modal */}
      {modalImage && (
        <div
          className={styles.imageModalOverlay}
          onClick={() => setModalImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setModalImage(null)}
              aria-label="Close enlarged photo"
            >
              ✕
            </button>
            <div className={styles.modalImageHeader}>{modalImage.title}</div>
            <Image
              src={modalImage.src}
              alt={modalImage.alt}
              width={800}
              height={600}
              style={{
                objectFit: 'contain',
                width: 'auto',
                height: 'auto',
                maxWidth: '90vw',
                maxHeight: '75vh',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
