'use client';

import React from 'react';
import Image from 'next/image';
import { useLessonContext, LessonContextModel } from '@/context/LessonContext';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import PronounceButton from '@/components/PronounceButton';
import {
  LessonAnswerKey,
  verifyAnswer,
  getExerciseKey,
  VerificationResult,
} from '@/lib/answerVerification';
import styles from './lesson4b.module.scss';

export interface Lesson4BContentProps {
  lesson?: LessonContextModel | null;
  user?: Record<string, unknown> | null;
  isTeacherReview?: boolean;
  readOnly?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio?: (track: string) => void;
  playingAudio?: string | null;
  originalAnswers?: Record<string, unknown>;
}

export const FALLBACK_ANSWER_KEY_4B: LessonAnswerKey = {
  exercise_1a_objects: {
    '1': ['tickets', 'ticket', 'boarding passes', 'boarding pass'],
    '2': ['passport'],
    '3': ['credit card', 'a credit card'],
    '4': ['coat', 'a coat', 'jacket'],
    '5': ['food'],
    '6': ['bottle of water', 'a bottle of water', 'water bottle'],
    '7': ['camera', 'a camera'],
    '8': ['sunglasses'],
    '9': ['phone', 'a phone', 'mobile phone', 'smartphone'],
    '10': ['money'],
    '11': ['bag', 'a bag'],
    '12': ['keys', 'key'],
  },
  exercise_2a_activities: {
    '1': ['C', 'c', 'Photo C'],
    '2': ['B', 'b', 'Photo B'],
    '3': ['D', 'd', 'Photo D'],
    '4': ['A', 'a', 'Photo A'],
  },
  exercise_3a_destination: {
    '1': ['on holiday', 'holiday', 'on a trip', 'a trip', 'trip'],
  },
  exercise_3b_checklist: {
    phone: ['yes', 'true', 'checked'],
    camera: ['no', 'false'],
    tickets: ['no', 'false'],
  },
  exercise_5_grammar: {
    '1': ['Have', 'have'],
    '2': ['have'],
    '3': ['Has', 'has'],
    '4': ['has'],
    '5': ["hasn't"],
  },
  exercise_7a_questions: {
    '1': ['Have you got food in your bag?', 'Have you got food in your bag'],
    '2': ['Has your sister got a camera?', 'Has sister got a camera?', 'Has your sister got a camera', 'Has sister got a camera'],
    '3': ['Has your friend got a good job?', 'Has friend got a good job?', 'Has your friend got a good job', 'Has friend got a good job'],
    '4': ['Have you got sunglasses?', 'Have you got sunglasses'],
    '5': ['Have you got a big family?', 'Have you got a big family'],
    '6': ['Have you got a new phone?', 'Have you got a new phone'],
  },
  exercise_8_order: {
    '1': ['e'],
    '2': ['a'],
    '3': ['c'],
    '4': ['b'],
    '5': ['f'],
    '6': ['d'],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const EVERYDAY_OBJECTS = [
  { id: '1', name: 'tickets', img: '/images/lesson4b/obj_1_tickets.png', label: '1. Boarding passes / Tickets' },
  { id: '2', name: 'passport', img: '/images/lesson4b/obj_2_passport.png', label: '2. Passport' },
  { id: '3', name: 'credit card', img: '/images/lesson4b/obj_3_credit_card.png', label: '3. Credit card' },
  { id: '4', name: 'coat', img: '/images/lesson4b/obj_4_coat.png', label: '4. Coat' },
  { id: '5', name: 'food', img: '/images/lesson4b/obj_5_food.png', label: '5. Food' },
  { id: '6', name: 'bottle of water', img: '/images/lesson4b/obj_6_bottle_water.png', label: '6. Bottle of water' },
  { id: '7', name: 'camera', img: '/images/lesson4b/obj_7_camera.png', label: '7. Camera' },
  { id: '8', name: 'sunglasses', img: '/images/lesson4b/obj_8_sunglasses.png', label: '8. Sunglasses' },
  { id: '9', name: 'phone', img: '/images/lesson4b/obj_9_phone.png', label: '9. Phone' },
  { id: '10', name: 'money', img: '/images/lesson4b/obj_10_money.png', label: '10. Money' },
  { id: '11', name: 'bag', img: '/images/lesson4b/obj_11_bag.png', label: '11. Bag' },
  { id: '12', name: 'keys', img: '/images/lesson4b/obj_12_keys.png', label: '12. Keys' },
];

export default function Lesson4BContent(props: Lesson4BContentProps) {
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
    FALLBACK_ANSWER_KEY_4B;

  const isReview = Boolean(isTeacherReview || (activeAnswerKey && readOnly));

  // Exercise answers
  const ex2Answers = getRecord(originalAnswers.exercise_2a_activities);
  const ex3bAnswers = getRecord(originalAnswers.exercise_3b_checklist);
  const ex8Answers = getRecord(originalAnswers.exercise_8_order);
  const ex10Answers = getRecord(originalAnswers.exercise_10_speaking);

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
    options?: { fullWidth?: boolean }
  ) => {
    const currentVal = (getRecord(originalAnswers[exerciseName]))[field] || '';
    const v = verify(exerciseName, field, currentVal);

    return (
      <div className={styles.feedbackRow} style={{ width: options?.fullWidth ? '100%' : 'auto', flexDirection: 'column', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
          <input
            type="text"
            value={currentVal}
            onChange={(e) => handleFieldChange(exerciseName, field, e.target.value)}
            placeholder={placeholder}
            disabled={readOnly}
            className={`${styles.textInput} ${
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
          <div style={{ marginTop: '0.25rem' }}>
            <TeacherAnswerBadge result={v} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <article className={styles.textbookPage}>
        {/* Header Banner Pearson 4B */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge4B}>
              4<span className={styles.letterB}>B</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>Have you got it?</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: prepare for a trip</span>
                <span className={styles.pillGoal}>Grammar: have / has got: questions</span>
                <span className={styles.pillGoal}>Vocabulary: everyday objects (2)</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.contentBody}>
          {/* SECTION 1: Vocabulary and listening */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🎒</span>
                <span>Vocabulary and listening</span>
              </h2>
              {playAudio && (
                <button
                  type="button"
                  onClick={() => playAudio('4.3')}
                  className={styles.audioBtn}
                >
                  {playingAudio === '4.3' || playingAudio === '/audio/4.3.mp3' ? '⏸ Playing 4.3' : '▶ Audio 4.3'}
                </button>
              )}
            </div>

            {/* Exercise 1a: Everyday Objects 1–12 */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>1a</span>
                <strong>Match photos 1–12 with the words in the box:</strong>
              </p>

              <div className={styles.wordBox}>
                {[
                  'bag',
                  'bottle of water',
                  'camera',
                  'coat',
                  'credit card',
                  'food',
                  'keys',
                  'money',
                  'passport',
                  'phone',
                  'sunglasses',
                  'tickets',
                ].map((w) => (
                  <span key={w} className={styles.wordItem}>{w}</span>
                ))}
              </div>

              {/* 12 Objects Grid */}
              <div className={styles.objectsGrid}>
                {EVERYDAY_OBJECTS.map((obj) => (
                  <div key={obj.id} className={styles.objectCard}>
                    <div className={styles.objectImageWrap}>
                      <span className={styles.objectNumberBadge}>{obj.id}</span>
                      <Image
                        src={obj.img}
                        alt={obj.label}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        style={{ objectFit: 'contain', padding: '6px' }}
                      />
                    </div>
                    <div className={styles.objectInputWrap}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Item #{obj.id}</span>
                        <PronounceButton word={obj.name} size="small" />
                      </div>
                      {renderInput('exercise_1a_objects', obj.id, 'Type object name...')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 2a: Match photos A–D with activities 1–4 */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>2a</span>
                <strong>Match photos A–D with activities 1–4:</strong>
              </p>

              {/* Photos A–D */}
              <div className={styles.activitiesGrid}>
                <div className={styles.activityPhotoCard}>
                  <div className={styles.activityPhotoWrap}>
                    <span className={styles.photoLetterBadge}>A</span>
                    <Image
                      src="/images/lesson4b/photo_a_beach.png"
                      alt="Photo A: Sunny beach"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>

                <div className={styles.activityPhotoCard}>
                  <div className={styles.activityPhotoWrap}>
                    <span className={styles.photoLetterBadge}>B</span>
                    <Image
                      src="/images/lesson4b/photo_b_snow.png"
                      alt="Photo B: Snowy mountains"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>

                <div className={styles.activityPhotoCard}>
                  <div className={styles.activityPhotoWrap}>
                    <span className={styles.photoLetterBadge}>C</span>
                    <Image
                      src="/images/lesson4b/photo_c_office.png"
                      alt="Photo C: Office with computers"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>

                <div className={styles.activityPhotoCard}>
                  <div className={styles.activityPhotoWrap}>
                    <span className={styles.photoLetterBadge}>D</span>
                    <Image
                      src="/images/lesson4b/photo_d_forest.png"
                      alt="Photo D: Long forest walk"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>

              {/* Activities 1–4 */}
              <div className={styles.matchList}>
                {[
                  { id: '1', title: '1. a day in the office', expected: 'C' },
                  { id: '2', title: '2. a holiday in a cold country', expected: 'B' },
                  { id: '3', title: '3. a long walk', expected: 'D' },
                  { id: '4', title: '4. a holiday in a hot country', expected: 'A' },
                ].map((act) => {
                  const currentVal = ex2Answers[act.id] || '';
                  const v = verify('exercise_2a_activities', act.id, currentVal);

                  return (
                    <div key={act.id} className={styles.matchRow}>
                      <span className={styles.matchText}>
                        <strong>{act.title}</strong>
                      </span>
                      <div className={styles.feedbackRow}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <select
                            value={currentVal}
                            onChange={(e) => handleFieldChange('exercise_2a_activities', act.id, e.target.value)}
                            disabled={readOnly}
                            className={styles.selectInput}
                          >
                            <option value="">Photo...</option>
                            <option value="A">Photo A</option>
                            <option value="B">Photo B</option>
                            <option value="C">Photo C</option>
                            <option value="D">Photo D</option>
                          </select>
                          {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
                        </div>
                        {v && v.status !== 'correct' && (
                          <TeacherAnswerBadge result={v} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Listening Section: Exercises 3a & 3b */}
            <div className={styles.exerciseCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle} style={{ fontSize: '1.05rem', margin: 0 }}>
                  <span className={styles.sectionIcon}>🎧</span>
                  <span>Listening: Sam&apos;s trip preparations</span>
                </h3>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('4.4')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '4.4' || playingAudio === '/audio/4.4.mp3' ? '⏸ Playing 4.4' : '▶ Audio 4.4'}
                  </button>
                )}
              </div>

              {/* 3a: Destination question */}
              <div className={styles.matchRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '220px' }}>
                  <span className={styles.exBadge}>3a</span>
                  <span className={styles.matchText}>
                    Listen to the conversation. <strong>Where is Sam going?</strong>
                  </span>
                </div>
                <div style={{ minWidth: '220px' }}>
                  {renderInput('exercise_3a_destination', '1', 'Type destination...')}
                </div>
              </div>

              {/* 3b: Notepad checklist */}
              <div className={styles.notepadBox}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span className={styles.exBadge}>3b</span>
                  <h3 className={styles.notepadTitle} style={{ margin: 0 }}>
                    📋 What has Sam got? (Tick the things Sam has got in his bag)
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  {[
                    { key: 'passport', label: 'Passport' },
                    { key: 'money', label: 'Money' },
                    { key: 'camera', label: 'Camera' },
                    { key: 'phone', label: 'Phone' },
                    { key: 'tickets', label: 'Tickets' },
                  ].map((item) => {
                    const isChecked = ex3bAnswers[item.key] === 'yes' || ex3bAnswers[item.key] === 'true';

                    return (
                      <label key={item.key} className={styles.checkItem}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleFieldChange(
                              'exercise_3b_checklist',
                              item.key,
                              e.target.checked ? 'yes' : 'no'
                            )
                          }
                          disabled={readOnly}
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Grammar - have/has got questions */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>❓</span>
                <span>Grammar: have / has got: questions</span>
              </h2>
            </div>

            {/* Exercise 4: Conversation Transcript */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>4</span>
                <strong>Read part of the conversation from Exercise 3a. Notice the questions:</strong>
              </p>

              <div className={styles.dialogueBox}>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  <strong>Zara:</strong> &ldquo;OK ... <u>Have you got your camera?</u>&rdquo;
                </p>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  <strong>Sam:</strong> &ldquo;No, I haven&apos;t &ndash; but I&apos;ve got my phone. And Fifi has got a good camera.&rdquo;
                </p>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  <strong>Zara:</strong> &ldquo;OK. You&apos;re ready. Oh, <u>have you got your tickets?</u>&rdquo;
                </p>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  <strong>Sam:</strong> &ldquo;Tickets, tickets ...&rdquo;
                </p>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  <strong>Zara:</strong> &ldquo;<u>Has Fifi got your tickets?</u>&rdquo;
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Sam:</strong> &ldquo;Oh, yes, she has! Phew!&rdquo;
                </p>
              </div>
            </div>

            {/* Exercise 5: Grammar Box Completion */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>5</span>
                <strong>Read and complete the grammar box. Use Exercise 4 to help you:</strong>
              </p>

              <div className={styles.grammarBox}>
                <div className={styles.grammarHeader}>have / has got: questions &amp; short answers</div>
                <table className={styles.grammarTable}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Question</th>
                      <th style={{ textAlign: 'left' }}>Short answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700 }}>1.</span>
                          {renderInput('exercise_5_grammar', '1', '...')}
                          <span>I / we / you / they <strong>got</strong> a ticket?</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>+ Yes, I / we / you / they</span>
                            <span style={{ fontWeight: 700 }}>2.</span>
                            {renderInput('exercise_5_grammar', '2', '...')}
                          </div>
                          <div>&ndash; No, I / we / you / they <strong>haven&apos;t</strong>.</div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 700 }}>3.</span>
                          {renderInput('exercise_5_grammar', '3', '...')}
                          <span>he / she / it <strong>got</strong> a phone?</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>+ Yes, he / she / it</span>
                            <span style={{ fontWeight: 700 }}>4.</span>
                            {renderInput('exercise_5_grammar', '4', '...')}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>&ndash; No, he / she / it</span>
                            <span style={{ fontWeight: 700 }}>5.</span>
                            {renderInput('exercise_5_grammar', '5', '...')}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exercise 6: Audio 4.5 Pronunciation */}
            <div className={styles.exerciseCard}>
              <div className={styles.sectionHeader}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>6</span>
                  <strong>Pronunciation: Question intonation &amp; short answers:</strong>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('4.5')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '4.5' || playingAudio === '/audio/4.5.mp3' ? '⏸ Playing 4.5' : '▶ Audio 4.5'}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <span><strong>1.</strong> A: <em>Have you got your ticket?</em> &mdash; B: <em>Yes, I have.</em></span>
                  <PronounceButton word="Have you got your ticket? Yes, I have." label="Listen" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <span><strong>2.</strong> A: <em>Has it got a restaurant?</em> &mdash; B: <em>Yes, it has.</em></span>
                  <PronounceButton word="Has it got a restaurant? Yes, it has." label="Listen" />
                </div>
              </div>
            </div>

            {/* Exercise 7a: Make questions using the prompts */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>7a</span>
                <strong>Make questions using the prompts:</strong>
              </p>

              <div className={styles.matchList}>
                {[
                  { id: '1', prompt: '1. you / food / in your bag', example: 'Have you got food in your bag?', placeholder: 'Have you got food in your bag?' },
                  { id: '2', prompt: '2. sister / a camera', placeholder: 'Write question...' },
                  { id: '3', prompt: '3. friend / a good job', placeholder: 'Write question...' },
                  { id: '4', prompt: '4. you / sunglasses', placeholder: 'Write question...' },
                  { id: '5', prompt: '5. you / a big family', placeholder: 'Write question...' },
                  { id: '6', prompt: '6. you / a new phone', placeholder: 'Write question...' },
                ].map((item) => (
                  <div key={item.id} className={styles.matchRow} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={styles.matchText}><strong>{item.prompt}</strong></span>
                      {item.example && <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>Example: {item.example}</span>}
                    </div>
                    {renderInput('exercise_7a_questions', item.id, item.placeholder || item.example || '', { fullWidth: true })}
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 8: Put conversation in the correct order */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>8</span>
                <strong>Put the conversation in the correct order (1–6):</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { letter: 'e', text: "Rose's mum: Hi Rose. Are you and your brother ready for your trip?", defaultOrder: '1' },
                  { letter: 'a', text: 'Rose: Yes, we are.', defaultOrder: '2' },
                  { letter: 'c', text: "Rose's mum: Have you got your tickets?", defaultOrder: '3' },
                  { letter: 'b', text: "Rose: Tickets ... Yes, I've got them.", defaultOrder: '4' },
                  { letter: 'f', text: "Rose's mum: And your money?", defaultOrder: '5' },
                  { letter: 'd', text: "Rose: Yes, we've got money.", defaultOrder: '6' },
                ].map((row, idx) => {
                  const stepNum = String(idx + 1);
                  const currentVal = ex8Answers[stepNum] || '';
                  const v = verify('exercise_8_order', stepNum, currentVal);

                  return (
                    <div key={row.letter} className={styles.orderRow}>
                      <span className={styles.orderNumBadge}>{stepNum}</span>
                      <span style={{ flex: 1, fontSize: '0.9rem', color: '#1e293b' }}>
                        <strong>({row.letter})</strong> {row.text}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <select
                          value={currentVal}
                          onChange={(e) => handleFieldChange('exercise_8_order', stepNum, e.target.value)}
                          disabled={readOnly}
                          className={styles.selectInput}
                          style={{ minWidth: '75px' }}
                        >
                          <option value="">Order...</option>
                          <option value="a">a</option>
                          <option value="b">b</option>
                          <option value="c">c</option>
                          <option value="d">d</option>
                          <option value="e">e</option>
                          <option value="f">f</option>
                        </select>
                        {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
                        {v && v.status !== 'correct' && (
                          <TeacherAnswerBadge result={v} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Speaking Section: Exercises 9 & 10 */}
            <div className={styles.exerciseCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle} style={{ fontSize: '1.05rem', margin: 0 }}>
                  <span className={styles.sectionIcon}>💬</span>
                  <span>Speaking: What&apos;s in your partner&apos;s bag?</span>
                </h3>
              </div>

              {/* 9: Preparation */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>9</span>
                  <span><strong>Choose five things</strong> from Exercise 1a to put in your bag for one of the activities in Exercise 2a (e.g. passport, tickets, camera...).</span>
                </p>
              </div>

              {/* 10: Pairwork & Dialogue */}
              <div className={styles.backpackCard}>
                <p className={styles.exInstruction} style={{ marginBottom: '0.5rem' }}>
                  <span className={styles.exBadge}>10</span>
                  <span><strong>Work in pairs.</strong> Take turns to ask questions and guess your partner&apos;s activity:</span>
                </p>

                <div className={styles.backpackImageWrap}>
                  <Image
                    src="/images/lesson4b/backpack_girl.png"
                    alt="Girl with orange backpack preparing for a trip"
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                <div>
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #be123c', marginBottom: '0.75rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
                      <em>Dialogue model:</em><br />
                      <strong>A:</strong> &ldquo;OK, this is my bag for Canada.&rdquo;<br />
                      <strong>B:</strong> &ldquo;OK. Have you got your passport?&rdquo;<br />
                      <strong>A:</strong> &ldquo;Yes, I have.&rdquo;
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                      Notes on partner&apos;s luggage &amp; trip destination:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. My partner has got tickets and a passport, but hasn't got sunglasses..."
                      value={ex10Answers['notes'] || ''}
                      onChange={(e) => handleFieldChange('exercise_10_speaking', 'notes', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInput}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
