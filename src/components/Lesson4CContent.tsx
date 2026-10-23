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
import styles from './lesson4c.module.scss';

export interface Lesson4CContentProps {
  lesson?: LessonContextModel | null;
  user?: Record<string, unknown> | null;
  isTeacherReview?: boolean;
  readOnly?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio?: (track: string) => void;
  playingAudio?: string | null;
  originalAnswers?: Record<string, unknown>;
}

export const FALLBACK_ANSWER_KEY_4C: LessonAnswerKey = {
  exercise_2a_messages: {
    '1': ['work trip', 'a work trip', 'work trip to London', 'for work', 'a work trip next week', 'she has a work trip', 'business trip'],
  },
  exercise_2b_collocations: {
    '1': ['try'],
    '2_1': ['go to', 'visit'],
    '2_2': ['visit', 'go to'],
    '3': ['take'],
    '4': ['drink'],
    '5': ['see'],
  },
  exercise_3_photos: {
    '1': ['drink tea', 'drink English tea'],
    '2': ['see a show'],
    '3': ['go to New York', 'visit New York'],
    '4': ['try Japanese food'],
    '5': ['take a train'],
    '6': ['take photos'],
  },
  exercise_4_london_dos: {
    '1': ['no', 'false'],
    '2': ['yes', 'true'],
    '3': ['no', 'false'],
    '4': ['yes', 'true'],
    '5': ['yes', 'true'],
    '6': ['yes', 'true'],
    '7': ['yes', 'true'],
    '8': ['yes', 'true'],
    '9': ['yes', 'true'],
  },
  exercise_5_grammar: {
    '1': ["Don't", "don't"],
    '2': ["Don't", "don't"],
    '3': ['See', 'see'],
  },
  exercise_6a_stress: {
    '1': ["Don't go to Notting Hill"],
    '2': ['Try Polish food'],
    '3': ['Drink coffee in a café'],
    '4': ["Don't take photos"],
  },
  exercise_7_rome: {
    '1': ['Drink coffee.', 'Drink coffee', 'drink coffee.'],
    '2': ['Try Italian food.', 'Try Italian food', 'Try pasta.', 'Try pasta', 'Eat pasta.', 'Eat pasta'],
    '3': ['Visit the Colosseum.', 'Visit the Colosseum', 'Go to the Colosseum.', 'Go to the Colosseum'],
    '4': ['See a show.', 'See a show', 'See a film.', 'See a film'],
    '5': ["Don't take a coat.", "Don't take a coat", 'do not take a coat.'],
    '6': ["Don't take photos.", "Don't take photos", "Don't take a camera.", "Don't take a camera"],
  },
};

const CHAT_MESSAGES = [
  { sender: 'Ben', text: "Don't go to Oxford Street. It's very busy." },
  { sender: 'Carla', text: "Visit The British Museum. It's really interesting." },
  { sender: 'Vitor', text: "Don't take taxis! They're expensive." },
  { sender: 'Jemima', text: 'Go to Greenwich and take photos.' },
  { sender: 'Juana', text: 'Try Indian food. Indian food in the UK is really good.' },
  { sender: 'Alexis', text: "Drink English tea, Lydia. It's cheap x" },
  { sender: 'Theresa', text: 'See a show, Lydia. There are lots of good shows in London.' },
  { sender: 'Toni', text: 'Take a coat!' },
];

export default function Lesson4CContent({
  lesson: propLesson,
  isTeacherReview = false,
  readOnly = false,
  answerKey: propAnswerKey,
  playAudio,
  playingAudio,
  originalAnswers,
}: Lesson4CContentProps) {
  const context = useLessonContext();
  const effectiveLesson = propLesson || context.lesson;
  const effectiveAnswers = context.answers;

  const currentAnswerKey = propAnswerKey || effectiveLesson?.answerKey || FALLBACK_ANSWER_KEY_4C;
  const isReview = Boolean(isTeacherReview || (currentAnswerKey && readOnly));

  const answers = (effectiveAnswers || {}) as Record<string, unknown>;

  const handleFieldChange = (exercise: string, field: string, value: string) => {
    if (readOnly) return;
    if (context?.setAnswerField) {
      context.setAnswerField(exercise, field, value);
    }
  };

  const getFieldValue = (exercise: string, field: string): string => {
    const ex = answers[exercise] as Record<string, string> | undefined;
    return ex?.[field] || '';
  };

  const verify = (exerciseName: string, field: string, value: string): VerificationResult | null => {
    if (!isReview) return null;
    const exerciseKey = getExerciseKey(currentAnswerKey, exerciseName);
    return verifyAnswer(value, exerciseKey?.[field]);
  };

  const ex1Answers = (answers['exercise_1_london_places'] as Record<string, string>) || {};
  const ex4Answers = (answers['exercise_4_london_dos'] as Record<string, string>) || {};
  const ex6aAnswers = (answers['exercise_6a_stress'] as Record<string, string>) || {};
  const ex8Answers = (answers['exercise_8_dos_donts'] as Record<string, string>) || {};
  const ex9Answers = (answers['exercise_9_partner_city'] as Record<string, string>) || {};

  const renderInput = (
    exerciseName: string,
    field: string,
    placeholder: string = 'Type here...'
  ) => {
    const currentVal = getFieldValue(exerciseName, field);
    const origEx = (originalAnswers?.[exerciseName] as Record<string, string>) || {};
    const origVal = origEx[field];
    const isDifferent = originalAnswers && origVal !== undefined && origVal !== currentVal;
    const v = verify(exerciseName, field, currentVal);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
            } ${isDifferent ? styles.diffHighlight : ''}`}
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

  return (
    <div className={styles.pageContainer}>
      <article className={styles.textbookPage}>
        {/* Header Banner Pearson 4C */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge4C}>
              4<span className={styles.letterC}>C</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>Dos and don&apos;ts</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: give advice</span>
                <span className={styles.pillGoal}>Grammar: imperatives</span>
                <span className={styles.pillGoal}>Vocabulary: common verbs</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Banner: London Eye img_7.png */}
        <div className={styles.heroBannerImage}>
          <div className={styles.heroImageWrap}>
            <Image
              src="/images/lesson4c/img_7.png"
              alt="London Eye on river Thames"
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        <div className={styles.contentBody}>
          {/* SECTION 1: Reading and vocabulary */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📖</span>
                <span>Reading and vocabulary</span>
              </h2>
            </div>

            {/* Exercise 1: Warm-up London places */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>1</span>
                <span><strong>Work in pairs.</strong> What places in London do you know? <em>(e.g. Notting Hill, Buckingham Palace...)</em></span>
              </p>
              <div style={{ maxWidth: '600px' }}>
                <input
                  type="text"
                  placeholder="e.g. Big Ben, Tower Bridge, Hyde Park..."
                  value={ex1Answers['places'] || ''}
                  onChange={(e) => handleFieldChange('exercise_1_london_places', 'places', e.target.value)}
                  disabled={readOnly}
                  className={styles.textInput}
                />
              </div>
            </div>

            {/* Exercise 2a: Text messages thread */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>2a</span>
                <span><strong>Read the text messages.</strong> Why is Lydia going to London?</span>
              </p>

              {/* Chat Thread */}
              <div className={styles.chatContainer}>
                {/* Lydia's original post */}
                <div className={styles.lydiaMessageCard}>
                  <div className={styles.lydiaAvatarWrap}>
                    <Image
                      src="/images/lesson4c/img_6.png"
                      alt="Lydia smiling"
                      fill
                      sizes="56px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0369a1' }}>LYDIA</span>
                    <p className={styles.lydiaText}>
                      &ldquo;I have a work trip to London next week! Have you got any <em>dos</em> and <em>don&apos;ts</em> for London? Lydia xx&rdquo;
                    </p>
                  </div>
                </div>

                {/* Friends' replies grid */}
                <div className={styles.messagesGrid}>
                  {CHAT_MESSAGES.map((msg) => (
                    <div key={msg.sender} className={styles.messageBubble}>
                      <span className={styles.senderName}>{msg.sender}</span>
                      <span>{msg.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question 2a Input */}
              <div style={{ marginTop: '0.5rem', maxWidth: '400px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem', display: 'block' }}>
                  Why is Lydia going to London?
                </label>
                {renderInput('exercise_2a_messages', '1', 'Type reason...')}
              </div>
            </div>

            {/* Exercise 2b: Collocations with verbs in bold */}
            <div className={styles.exerciseCard}>
              <div className={styles.sectionHeader}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>2b</span>
                  <span><strong>Read the text messages again.</strong> Complete 1–5 with the verbs in bold:</span>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('4.9')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '4.9' || playingAudio === '/audio/4.9.mp3' ? '⏸ Playing 4.9' : '▶ Audio 4.9'}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div className={styles.collocationRow}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>1. Japanese food, British food</span>
                  <div style={{ width: '180px' }}>
                    {renderInput('exercise_2b_collocations', '1', 'Type verb...')}
                  </div>
                </div>

                <div className={styles.collocationRow}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>2. New York, Rome, The British Museum</span>
                  <div style={{ display: 'flex', gap: '0.5rem', width: '280px' }}>
                    {renderInput('exercise_2b_collocations', '2_1', 'Verb 1...')}
                    {renderInput('exercise_2b_collocations', '2_2', 'Verb 2...')}
                  </div>
                </div>

                <div className={styles.collocationRow}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>3. a taxi, a bus, a train, photos, a coat</span>
                  <div style={{ width: '180px' }}>
                    {renderInput('exercise_2b_collocations', '3', 'Type verb...')}
                  </div>
                </div>

                <div className={styles.collocationRow}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>4. tea, coffee</span>
                  <div style={{ width: '180px' }}>
                    {renderInput('exercise_2b_collocations', '4', 'Type verb...')}
                  </div>
                </div>

                <div className={styles.collocationRow}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>5. a film, a show</span>
                  <div style={{ width: '180px' }}>
                    {renderInput('exercise_2b_collocations', '5', 'Type verb...')}
                  </div>
                </div>
              </div>

              {/* 2c Pronunciation audio */}
              <div className={styles.pronounceBox}>
                <div className={styles.pronounceHeader}>
                  <p className={styles.exInstruction}>
                    <span className={styles.exBadge}>2c</span>
                    <span><strong>Listen and repeat</strong> the verbs in Exercise 2b:</span>
                  </p>
                  {playAudio && (
                    <button
                      type="button"
                      onClick={() => playAudio('4.9')}
                      className={styles.audioBtn}
                    >
                      {playingAudio === '4.9' || playingAudio === '/audio/4.9.mp3' ? '⏸ Playing 4.9' : '▶ Audio 4.9'}
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {['try', 'go to', 'visit', 'take', 'drink', 'see'].map((verb) => (
                    <PronounceButton key={verb} word={verb} size="small" />
                  ))}
                </div>
              </div>

              {/* Illustration after Exercise 2c (Big Ben / Houses of Parliament img_8.png) */}
              <div className={styles.exerciseImageWrap}>
                <div className={styles.londonLandscapeWrap}>
                  <Image
                    src="/images/lesson4c/img_8.png"
                    alt="Houses of Parliament and Big Ben on the River Thames"
                    width={310}
                    height={393}
                    style={{ borderRadius: '8px', objectFit: 'cover', maxWidth: '100%', height: 'auto' }}
                  />
                  <span className={styles.imageCaption}>
                    Houses of Parliament and Big Ben, London
                  </span>
                </div>
              </div>
            </div>

            {/* Exercise 3: Complete 1–6 with phrases from Exercise 2b */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>3</span>
                <span><strong>Complete 1–6 with phrases from Exercise 2b:</strong></span>
              </p>

              <div className={styles.phrasesExerciseLayout}>
                <div className={styles.phrasesImageContainer}>
                  <div className={styles.phrasesSingleImageWrap}>
                    <Image
                      src="/images/lesson4c/img_5.png"
                      alt="Photos 1 to 6 with phrases from Exercise 2b"
                      fill
                      sizes="(max-width: 768px) 100vw, 280px"
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  </div>
                </div>

                <div className={styles.phrasesInputsList}>
                  <div className={styles.collocationRow}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '24px' }}>1.</span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic', flex: 1 }}>
                      drink tea <em>(example)</em>
                    </span>
                  </div>

                  {[
                    { id: '2', label: '2.' },
                    { id: '3', label: '3.' },
                    { id: '4', label: '4.' },
                    { id: '5', label: '5.' },
                    { id: '6', label: '6.' },
                  ].map((item) => (
                    <div key={item.id} className={styles.collocationRow}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '24px' }}>{item.label}</span>
                      <div style={{ flex: 1 }}>
                        {renderInput('exercise_3_photos', item.id, 'Type phrase...')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Grammar - Imperatives */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>⚡</span>
                <span>Grammar: Imperatives</span>
              </h2>
            </div>

            {/* Exercise 4: Good things to do in London */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>4</span>
                <span><strong>Read the messages in Exercise 2a again.</strong> Tick the things that are good to do in London:</span>
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
                {[
                  { id: '1', label: '1. go to Oxford Street' },
                  { id: '2', label: '2. visit The British Museum' },
                  { id: '3', label: '3. take taxis' },
                  { id: '4', label: '4. go to Greenwich' },
                  { id: '5', label: '5. take photos' },
                  { id: '6', label: '6. try Indian food' },
                  { id: '7', label: '7. drink tea' },
                  { id: '8', label: '8. see a show' },
                  { id: '9', label: '9. take a coat' },
                ].map((item) => {
                  const currentVal = ex4Answers[item.id] || '';
                  const isChecked = currentVal === 'yes' || currentVal === 'true';
                  const v = verify('exercise_4_london_dos', item.id, currentVal);

                  return (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label className={styles.checkItem} style={{ flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleFieldChange(
                              'exercise_4_london_dos',
                              item.id,
                              e.target.checked ? 'yes' : 'no'
                            )
                          }
                          disabled={readOnly}
                        />
                        <span>{item.label}</span>
                      </label>
                      {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
                      {v && v.status !== 'correct' && (
                        <TeacherAnswerBadge result={v} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 5: Grammar Box (Imperatives) */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>5</span>
                <span><strong>Read and complete the grammar box.</strong> Use Exercise 2a to help you:</span>
              </p>

              <div className={styles.grammarBox}>
                <div className={styles.grammarHeader}>Imperatives</div>
                <table className={styles.grammarTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '50%' }}>+ (Positive)</th>
                      <th style={{ width: '50%' }}>- (Negative)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Visit Greenwich.</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <div style={{ width: '110px' }}>
                            {renderInput('exercise_5_grammar', '1', '...')}
                          </div>
                          <span>visit Greenwich.</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Take photos.</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <div style={{ width: '110px' }}>
                            {renderInput('exercise_5_grammar', '2', '...')}
                          </div>
                          <span>take photos.</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <div style={{ width: '110px' }}>
                            {renderInput('exercise_5_grammar', '3', '...')}
                          </div>
                          <span>a show.</span>
                        </div>
                      </td>
                      <td>Don&apos;t see a show.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exercise 6a & 6b: Pronunciation stress pattern */}
            <div className={styles.exerciseCard}>
              <div className={styles.sectionHeader}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>6a</span>
                  <span><strong>Pronunciation:</strong> Listen and choose the correct stress pattern:</span>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('4.10')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '4.10' || playingAudio === '/audio/4.10.mp3' ? '⏸ Playing 4.10' : '▶ Audio 4.10'}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  {
                    id: '1',
                    optA: "Don't go to Notting Hill",
                    optB: "Don't go to Notting Hill.",
                    labelA: "DON'T go to Notting Hill",
                    labelB: "Don't GO to Notting Hill",
                  },
                  {
                    id: '2',
                    optA: 'Try Polish food',
                    optB: 'Try Polish FOOD',
                    labelA: 'TRY Polish food',
                    labelB: 'Try Polish FOOD',
                  },
                  {
                    id: '3',
                    optA: 'Drink coffee in a café',
                    optB: 'Drink COFFEE in a café',
                    labelA: 'DRINK coffee in a café',
                    labelB: 'Drink COFFEE in a café',
                  },
                  {
                    id: '4',
                    optA: "Don't take photos",
                    optB: "Don't TAKE photos",
                    labelA: "DON'T take photos",
                    labelB: "Don't TAKE photos",
                  },
                ].map((item) => {
                  const currentVal = ex6aAnswers[item.id] || '';
                  const v = verify('exercise_6a_stress', item.id, currentVal);

                  return (
                    <div key={item.id} className={styles.collocationRow}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.id}. Choose stress pattern:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('exercise_6a_stress', item.id, item.optA)}
                          disabled={readOnly}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: currentVal === item.optA ? '#be123c' : '#ffffff',
                            color: currentVal === item.optA ? '#ffffff' : '#334155',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                          }}
                        >
                          {item.labelA}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('exercise_6a_stress', item.id, item.optB)}
                          disabled={readOnly}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: currentVal === item.optB ? '#be123c' : '#ffffff',
                            color: currentVal === item.optB ? '#ffffff' : '#334155',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                          }}
                        >
                          {item.labelB}
                        </button>
                        {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
                        {v && v.status !== 'correct' && (
                          <TeacherAnswerBadge result={v} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '8px', borderLeft: '3px solid #be123c' }}>
                <p className={styles.exInstruction} style={{ margin: 0 }}>
                  <span className={styles.exBadge}>6b</span>
                  <span><strong>Listen again and repeat.</strong> Practice the strong stress on the verb or <em>Don&apos;t</em>.</span>
                </p>
              </div>
            </div>

            {/* Exercise 7: Sentences about Rome */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>7</span>
                <span><strong>Look at the pictures and the symbols.</strong> Make sentences about a trip to Rome:</span>
              </p>

              <div className={styles.romeExerciseLayout}>
                <div className={styles.romeImageContainer}>
                  <div className={styles.romeSingleImageWrap}>
                    <Image
                      src="/images/lesson4c/img_4.png"
                      alt="Trip to Rome: pictures and symbols 1 to 6"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  </div>
                </div>

                <div className={styles.romeInputsList}>
                  <div className={styles.collocationRow}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '24px' }}>1.</span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic', flex: 1 }}>
                      Drink coffee. <em>(example)</em>
                    </span>
                  </div>

                  {[
                    { id: '2', label: '2.' },
                    { id: '3', label: '3.' },
                    { id: '4', label: '4.' },
                    { id: '5', label: '5.' },
                    { id: '6', label: '6.' },
                  ].map((item) => (
                    <div key={item.id} className={styles.collocationRow}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '24px' }}>{item.label}</span>
                      <div style={{ flex: 1 }}>
                        {renderInput('exercise_7_rome', item.id, 'Write sentence...')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Speaking - Dos and don'ts */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>💬</span>
                <span>Speaking: Dos and don&apos;ts</span>
              </h2>
            </div>

            {/* Exercise 8: Prepare your city table */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>8</span>
                <span><strong>Prepare:</strong> Your friend wants to visit your city. Complete the table of dos and don&apos;ts:</span>
              </p>

              <table className={styles.dosDontsTable}>
                <tbody>
                  <tr>
                    <td className={styles.dosCol}>
                      <div className={styles.dosHeader}>✓ Dos</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {[1, 2, 3, 4].map((i) => (
                          <input
                            key={`dos_${i}`}
                            type="text"
                            placeholder={`Do #${i} (e.g. Visit the old town...)`}
                            value={ex8Answers[`do_${i}`] || ''}
                            onChange={(e) => handleFieldChange('exercise_8_dos_donts', `do_${i}`, e.target.value)}
                            disabled={readOnly}
                            className={styles.textInput}
                          />
                        ))}
                      </div>
                    </td>
                    <td className={styles.dontsCol}>
                      <div className={styles.dontsHeader}>✗ Don&apos;ts</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {[1, 2, 3, 4].map((i) => (
                          <input
                            key={`donts_${i}`}
                            type="text"
                            placeholder={`Don't #${i} (e.g. Don't take expensive taxis...)`}
                            value={ex8Answers[`dont_${i}`] || ''}
                            onChange={(e) => handleFieldChange('exercise_8_dos_donts', `dont_${i}`, e.target.value)}
                            disabled={readOnly}
                            className={styles.textInput}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Exercise 9: Speak with partner */}
            <div className={styles.exerciseCard}>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #be123c', marginBottom: '0.75rem' }}>
                <p className={styles.exInstruction} style={{ margin: '0 0 0.4rem 0' }}>
                  <span className={styles.exBadge}>9a</span>
                  <span><strong>Work in pairs.</strong> Tell your partner your dos and don&apos;ts for your city. Then complete the table with your partner&apos;s recommendations:</span>
                </p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', fontStyle: 'italic' }}>
                  Example: &ldquo;Go to the Eiffel Tower. Take photos. Don&apos;t have coffee there. It&apos;s expensive!&rdquo;
                </p>
              </div>

              <table className={styles.dosDontsTable}>
                <tbody>
                  <tr>
                    <td className={styles.dosCol}>
                      <div className={styles.dosHeader}>✓ Partner&apos;s Dos</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {[1, 2, 3, 4].map((i) => (
                          <input
                            key={`partner_do_${i}`}
                            type="text"
                            placeholder={`Partner's Do #${i}...`}
                            value={ex9Answers[`partner_do_${i}`] || ''}
                            onChange={(e) => handleFieldChange('exercise_9_partner_city', `partner_do_${i}`, e.target.value)}
                            disabled={readOnly}
                            className={styles.textInput}
                          />
                        ))}
                      </div>
                    </td>
                    <td className={styles.dontsCol}>
                      <div className={styles.dontsHeader}>✗ Partner&apos;s Don&apos;ts</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {[1, 2, 3, 4].map((i) => (
                          <input
                            key={`partner_dont_${i}`}
                            type="text"
                            placeholder={`Partner's Don't #${i}...`}
                            value={ex9Answers[`partner_dont_${i}`] || ''}
                            onChange={(e) => handleFieldChange('exercise_9_partner_city', `partner_dont_${i}`, e.target.value)}
                            disabled={readOnly}
                            className={styles.textInput}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '0.75rem', background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p className={styles.exInstruction} style={{ marginBottom: '0.5rem' }}>
                  <span className={styles.exBadge}>9b</span>
                  <span><strong>Has your partner&apos;s city got more dos or more don&apos;ts?</strong></span>
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label className={styles.checkItem}>
                    <input
                      type="radio"
                      name="city_balance"
                      checked={ex9Answers['balance'] === 'more_dos'}
                      onChange={() => handleFieldChange('exercise_9_partner_city', 'balance', 'more_dos')}
                      disabled={readOnly}
                    />
                    <span>More dos</span>
                  </label>
                  <label className={styles.checkItem}>
                    <input
                      type="radio"
                      name="city_balance"
                      checked={ex9Answers['balance'] === 'more_donts'}
                      onChange={() => handleFieldChange('exercise_9_partner_city', 'balance', 'more_donts')}
                      disabled={readOnly}
                    />
                    <span>More don&apos;ts</span>
                  </label>
                  <label className={styles.checkItem}>
                    <input
                      type="radio"
                      name="city_balance"
                      checked={ex9Answers['balance'] === 'equal'}
                      onChange={() => handleFieldChange('exercise_9_partner_city', 'balance', 'equal')}
                      disabled={readOnly}
                    />
                    <span>Equal</span>
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}