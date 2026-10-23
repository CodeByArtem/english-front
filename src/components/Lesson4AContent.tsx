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
import styles from './lesson4a.module.scss';

export interface Lesson4AContentProps {
  lesson?: LessonContextModel | null;
  user?: Record<string, unknown> | null;
  isTeacherReview?: boolean;
  readOnly?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio?: (track: string) => void;
  playingAudio?: string | null;
  originalAnswers?: Record<string, unknown>;
}

export const FALLBACK_ANSWER_KEY_4A: LessonAnswerKey = {
  exercise_1_matching: {
    q1_luca: ['A', 'Photo A', 'photo a', 'a'],
    q2_mehmet: ['B', 'Photo B', 'photo b', 'b'],
  },
  exercise_2_descriptions: {
    '1': ['blonde hair'],
    '2': ['blue eyes'],
    '3': ['in his 20s', 'in 20s', '20s'],
    '4': ['brown hair'],
    '5': ['brown eyes'],
    '6': ['a beard', 'beard'],
    '7': ['in his 30s', 'in 30s', '30s'],
  },
  exercise_3a_photos: {
    '1': ['D', 'd', 'Photo D'],
    '2': ['B', 'b', 'Photo B'],
    '3': ['A', 'a', 'Photo A'],
    '4': ['C', 'c', 'Photo C'],
  },
  exercise_5_grammar: {
    '1': ['have', "'ve", 'have got', "'ve got"],
    '2': ['has', "'s", 'has got', "'s got"],
    '3': ["hasn't", "hasn't got", 'has not got', 'has not'],
  },
  exercise_7_alternatives: {
    '1': ['have'],
    '2': ['has'],
    '3': ['have'],
    '4': ["hasn't"],
    '5': ["haven't"],
    '6': ['has'],
    '7': ["haven't"],
    '8': ['have'],
  },
  exercise_8_sentences: {
    '1': ['Sofia is an office worker.', 'Sofia is an office worker', "Sofia's an office worker."],
    '2': ['She has got a son.', "She's got a son.", 'She has got a son', "She's got a son"],
    '3': [
      'She has got blonde hair and brown eyes.',
      "She's got blonde hair and brown eyes.",
      'She has got blonde hair and brown eyes',
      "She's got blonde hair and brown eyes",
    ],
    '4': ['She is in her 30s.', "She's in her 30s.", 'She is in her 30s', "She's in her 30s"],
    '5': [
      'Her son has got brown hair and blue eyes.',
      "Her son's got brown hair and blue eyes.",
      'Her son has got brown hair and blue eyes',
      "Her son's got brown hair and blue eyes",
    ],
    '6': ['He is eight years old.', "He's eight years old.", 'He is eight years old', "He's eight years old", 'He is eight.', "He's eight."],
    '7': ['They live in Paris.', 'They live in Paris'],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

export default function Lesson4AContent(props: Lesson4AContentProps) {
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
    FALLBACK_ANSWER_KEY_4A;

  const isReview = Boolean(isTeacherReview || (activeAnswerKey && readOnly));

  // Exercise state accessors
  const ex1Answers = getRecord(originalAnswers.exercise_1_matching);
  const ex3aAnswers = getRecord(originalAnswers.exercise_3a_photos);
  const ex4aAnswers = getRecord(originalAnswers.exercise_4a_sentences);
  const ex7Answers = getRecord(originalAnswers.exercise_7_alternatives);
  const ex9Answers = getRecord(originalAnswers.exercise_9_friend);

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
      <div className={styles.inputWrapper} style={{ width: options?.fullWidth ? '100%' : 'auto' }}>
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
        {/* Header Banner Pearson 4A */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge4A}>
              4<span className={styles.letterA}>A</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>You&apos;ve got a friend</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: describe people</span>
                <span className={styles.pillGoal}>Grammar: have / has got</span>
                <span className={styles.pillGoal}>Vocabulary: describing people</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.contentBody}>
          {/* SECTION 1: Reading and vocabulary */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📖</span>
                <span>Reading and vocabulary</span>
              </h2>
            </div>

            {/* Exercise 1: Read the profile and look at the photos */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>1</span>
                <strong>Read the profile</strong> and look at the photos below. Which person is Luca? Which person is Mehmet?
              </p>

              <div className={styles.profilesRow}>
                {/* Photo A: Luca */}
                <div className={styles.personCard}>
                  <div className={styles.personImageWrap}>
                    <span className={styles.photoBadge}>A</span>
                    <Image
                      src="/images/lesson4a/luca_car.png"
                      alt="Luca in car with blonde hair and blue eyes"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  </div>
                  <div className={styles.personInfo}>
                    <p className={styles.personText}>
                      Taxi driver with blonde hair, blue eyes, in car (Rome, Italy).
                    </p>
                  </div>
                </div>

                {/* Photo B: Mehmet */}
                <div className={styles.personCard}>
                  <div className={styles.personImageWrap}>
                    <span className={styles.photoBadge}>B</span>
                    <Image
                      src="/images/lesson4a/mehmet_daughter.png"
                      alt="Mehmet with daughter, brown hair and beard"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  </div>
                  <div className={styles.personInfo}>
                    <p className={styles.personText}>
                      Student with daughter, brown hair, brown eyes, and a beard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Text */}
              <div className={styles.storyBox}>
                <p style={{ margin: 0 }}>
                  &ldquo;OK, so my name is Luca and this is my good friend, Mehmet. I&apos;m from Italy. He&apos;s from Turkey. We live in Rome. I&apos;m a taxi driver and Mehmet&apos;s a student here. He&apos;s got a daughter. I haven&apos;t got any children.
                  <br /><br />
                  I&apos;ve got <strong>blonde hair</strong> and <strong>blue eyes</strong>. He&apos;s got <strong>brown hair</strong>, <strong>brown eyes</strong> and <strong>a beard</strong>. I&apos;m <strong>in my 20s</strong> and Mehmet is <strong>in his 30s</strong>.
                  <br /><br />
                  We&apos;re very different, but we&apos;re good friends!&rdquo;
                </p>
              </div>

              {/* Q1 and Q2 */}
              <div className={styles.questionsGrid}>
                <div className={styles.questionRow}>
                  <div className={styles.questionLabelGroup}>
                    <span className={styles.questionLabel}>Which person is Luca?</span>
                    <select
                      value={ex1Answers['q1_luca'] || ''}
                      onChange={(e) => handleFieldChange('exercise_1_matching', 'q1_luca', e.target.value)}
                      disabled={readOnly}
                      className={styles.selectInput}
                    >
                      <option value="">Select...</option>
                      <option value="A">Photo A</option>
                      <option value="B">Photo B</option>
                    </select>
                  </div>
                  {verify('exercise_1_matching', 'q1_luca', ex1Answers['q1_luca'] || '')?.status === 'correct' && (
                    <span className={styles.correctBadge}>✓ Correct</span>
                  )}
                  {isReview && verify('exercise_1_matching', 'q1_luca', ex1Answers['q1_luca'] || '')?.status === 'incorrect' && (
                    <TeacherAnswerBadge result={verify('exercise_1_matching', 'q1_luca', ex1Answers['q1_luca'] || '')} />
                  )}
                </div>

                <div className={styles.questionRow}>
                  <div className={styles.questionLabelGroup}>
                    <span className={styles.questionLabel}>Which person is Mehmet?</span>
                    <select
                      value={ex1Answers['q2_mehmet'] || ''}
                      onChange={(e) => handleFieldChange('exercise_1_matching', 'q2_mehmet', e.target.value)}
                      disabled={readOnly}
                      className={styles.selectInput}
                    >
                      <option value="">Select...</option>
                      <option value="A">Photo A</option>
                      <option value="B">Photo B</option>
                    </select>
                  </div>
                  {verify('exercise_1_matching', 'q2_mehmet', ex1Answers['q2_mehmet'] || '')?.status === 'correct' && (
                    <span className={styles.correctBadge}>✓ Correct</span>
                  )}
                  {isReview && verify('exercise_1_matching', 'q2_mehmet', ex1Answers['q2_mehmet'] || '')?.status === 'incorrect' && (
                    <TeacherAnswerBadge result={verify('exercise_1_matching', 'q2_mehmet', ex1Answers['q2_mehmet'] || '')} />
                  )}
                </div>
              </div>
            </div>

            {/* Exercise 2: Match 1–7 with the words in the box */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>2</span>
                <strong>Read the profile and look at the photos again.</strong> Match 1–7 with the words in the box:
              </p>

              <div className={styles.wordBox}>
                <span className={styles.wordItem}>a beard</span>
                <span className={styles.wordItem}>blonde hair</span>
                <span className={styles.wordItem}>blue eyes</span>
                <span className={styles.wordItem}>brown eyes</span>
                <span className={styles.wordItem}>brown hair</span>
                <span className={styles.wordItem}>in his 30s</span>
                <span className={styles.wordItem}>in his 20s</span>
              </div>

              <div className={styles.questionsGrid}>
                <div className={styles.questionRow}>
                  <label className={styles.questionLabel}>1. Luca (hair):</label>
                  {renderInput('exercise_2_descriptions', '1', 'Type word from box...')}
                </div>
                <div className={styles.questionRow}>
                  <label className={styles.questionLabel}>2. Luca (eyes):</label>
                  {renderInput('exercise_2_descriptions', '2', 'Type word from box...')}
                </div>
                <div className={styles.questionRow}>
                  <label className={styles.questionLabel}>3. Luca (age):</label>
                  {renderInput('exercise_2_descriptions', '3', 'Type age from box...')}
                </div>
                <div className={styles.questionRow}>
                  <label className={styles.questionLabel}>4. Mehmet (hair):</label>
                  {renderInput('exercise_2_descriptions', '4', 'Type word from box...')}
                </div>
                <div className={styles.questionRow}>
                  <label className={styles.questionLabel}>5. Mehmet (eyes):</label>
                  {renderInput('exercise_2_descriptions', '5', 'Type word from box...')}
                </div>
                <div className={styles.questionRow}>
                  <label className={styles.questionLabel}>6. Mehmet (face):</label>
                  {renderInput('exercise_2_descriptions', '6', 'Type word from box...')}
                </div>
                <div className={styles.questionRow}>
                  <label className={styles.questionLabel}>7. Mehmet (age):</label>
                  {renderInput('exercise_2_descriptions', '7', 'Type age from box...')}
                </div>
              </div>
            </div>

            {/* Exercise 3a: Match descriptions 1–4 with photos A–D */}
            <div className={styles.exerciseCard}>
              <div className={styles.sectionHeader}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>3a</span>
                  <strong>Match descriptions 1–4 with photos A–D.</strong>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('4.1')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '4.1' || playingAudio === '/audio/4.1.mp3' ? '⏸ Playing 4.1' : '▶ Audio 4.1'}
                  </button>
                )}
              </div>

              {/* 4 Photos Gallery */}
              <div className={styles.galleryGrid}>
                <div className={styles.galleryCard}>
                  <div className={styles.galleryImageWrap}>
                    <Image
                      src="/images/lesson4a/photo_a_woman20s.png"
                      alt="Photo A: Woman in 20s with green eyes"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <span className={styles.galleryBadge}>A</span>
                  </div>
                </div>

                <div className={styles.galleryCard}>
                  <div className={styles.galleryImageWrap}>
                    <Image
                      src="/images/lesson4a/photo_b_surfer40s.png"
                      alt="Photo B: Man in 40s with surfboard and red hair"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <span className={styles.galleryBadge}>B</span>
                  </div>
                </div>

                <div className={styles.galleryCard}>
                  <div className={styles.galleryImageWrap}>
                    <Image
                      src="/images/lesson4a/photo_c_grey_beard.png"
                      alt="Photo C: Man with grey hair and beard"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <span className={styles.galleryBadge}>C</span>
                  </div>
                </div>

                <div className={styles.galleryCard}>
                  <div className={styles.galleryImageWrap}>
                    <Image
                      src="/images/lesson4a/photo_d_blonde50s.png"
                      alt="Photo D: Woman in 50s with blonde hair and blue eyes"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <span className={styles.galleryBadge}>D</span>
                  </div>
                </div>
              </div>

              {/* 4 Descriptions */}
              <div className={styles.matchList}>
                {[
                  { id: '1', text: "She's got blonde hair and blue eyes. She's in her 50s." },
                  { id: '2', text: "He's got red hair. He's in his 40s." },
                  { id: '3', text: "She's got brown hair and green eyes. She's in her 20s." },
                  { id: '4', text: "He's got grey hair and a beard." },
                ].map((item) => {
                  const currentVal = ex3aAnswers[item.id] || '';
                  const v = verify('exercise_3a_photos', item.id, currentVal);

                  return (
                    <div key={item.id} className={styles.matchRow}>
                      <div className={styles.matchText}>
                        <strong>{item.id}.</strong> {item.text}
                      </div>
                      <div className={styles.inputWrapper}>
                        <select
                          value={currentVal}
                          onChange={(e) => handleFieldChange('exercise_3a_photos', item.id, e.target.value)}
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
                        {v && v.status !== 'correct' && (
                          <TeacherAnswerBadge result={v} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 3b & 3c: Pronunciation & Word Map */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>3b</span>
                <strong>Vocabulary Pronunciation:</strong> Listen and repeat the key descriptive phrases:
              </p>

              <div className={styles.pronounceList}>
                {[
                  'blonde hair',
                  'blue eyes',
                  'in her 50s',
                  'red hair',
                  'in his 40s',
                  'brown hair',
                  'green eyes',
                  'in her 20s',
                  'grey hair',
                  'a beard',
                ].map((phrase) => (
                  <div key={phrase} className={styles.pronounceItem}>
                    <span>{phrase}</span>
                    <PronounceButton word={phrase} label="Listen" />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1rem' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>3c</span>
                  <strong>Word Map:</strong> Vocabulary clusters for describing people:
                </p>

                <div className={styles.wordMapGrid}>
                  <div className={styles.wordMapCard}>
                    <strong>🎨 Colours</strong>
                    <div className={styles.tagCluster}>
                      {['blue', 'brown', 'green', 'grey', 'red', 'blonde', 'dark', 'fair', 'black'].map((c) => (
                        <span key={c} className={styles.tagPill}>{c}</span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.wordMapCard}>
                    <strong>👤 The body</strong>
                    <div className={styles.tagCluster}>
                      {['hair', 'eyes', 'a beard', 'a moustache', 'glasses', 'face', 'head'].map((b) => (
                        <span key={b} className={styles.tagPill}>{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 4a: Think of another student in the room */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>4a</span>
                <strong>Describe someone you know or a student in the room:</strong>
              </p>

              <div className={styles.sentencesList}>
                <div className={styles.sentenceItem}>
                  <label className={styles.promptText}>1. He/She&apos;s got (hair):</label>
                  <input
                    type="text"
                    placeholder="e.g. short dark hair / long blonde hair"
                    value={ex4aAnswers['1'] || ''}
                    onChange={(e) => handleFieldChange('exercise_4a_sentences', '1', e.target.value)}
                    disabled={readOnly}
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.sentenceItem}>
                  <label className={styles.promptText}>2. He/She&apos;s got (eyes):</label>
                  <input
                    type="text"
                    placeholder="e.g. blue eyes / brown eyes / green eyes"
                    value={ex4aAnswers['2'] || ''}
                    onChange={(e) => handleFieldChange('exercise_4a_sentences', '2', e.target.value)}
                    disabled={readOnly}
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.sentenceItem}>
                  <label className={styles.promptText}>3. He/She is in his/her:</label>
                  <input
                    type="text"
                    placeholder="e.g. 20s / 30s / 40s / 50s"
                    value={ex4aAnswers['3'] || ''}
                    onChange={(e) => handleFieldChange('exercise_4a_sentences', '3', e.target.value)}
                    disabled={readOnly}
                    className={styles.textInput}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Grammar - have/has got */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>✏️</span>
                <span>Grammar: have / has got</span>
              </h2>
            </div>

            {/* Exercise 5: Grammar Box Completion */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>5</span>
                <strong>Read and complete the grammar box:</strong>
              </p>

              <div className={styles.grammarBox}>
                <div className={styles.grammarHeader}>have / has got</div>
                <table className={styles.grammarTable}>
                  <tbody>
                    <tr>
                      <th style={{ width: '40px' }}>+</th>
                      <td>I / You / We / They</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700 }}>1.</span>
                          {renderInput('exercise_5_grammar', '1', '...')}
                          <span>got brown hair.</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th style={{ width: '40px' }}>+</th>
                      <td>He / She / It</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700 }}>2.</span>
                          {renderInput('exercise_5_grammar', '2', '...')}
                          <span>got green eyes.</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th style={{ width: '40px' }}>-</th>
                      <td>I / You / We / They</td>
                      <td>
                        <strong>haven&apos;t got</strong> blue eyes.
                      </td>
                    </tr>
                    <tr>
                      <th style={{ width: '40px' }}>-</th>
                      <td>He / She / It</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700 }}>3.</span>
                          {renderInput('exercise_5_grammar', '3', '...')}
                          <span>got red hair.</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exercise 6: Audio 4.2 Pronunciation */}
            <div className={styles.exerciseCard}>
              <div className={styles.sectionHeader}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>6</span>
                  <strong>Pronunciation of contracted forms &apos;ve got / &apos;s got:</strong>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('4.2')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '4.2' || playingAudio === '/audio/4.2.mp3' ? '⏸ Playing 4.2' : '▶ Audio 4.2'}
                  </button>
                )}
              </div>

              <div className={styles.pronounceList}>
                {[
                  { text: "I've got brown hair.", contracted: "I've got" },
                  { text: "You've got red hair.", contracted: "You've got" },
                  { text: "We've got blue eyes.", contracted: "We've got" },
                  { text: "They've got blue eyes.", contracted: "They've got" },
                  { text: "He's got a beard.", contracted: "He's got" },
                  { text: "She's got grey hair.", contracted: "She's got" },
                ].map((item, idx) => (
                  <div key={idx} className={styles.pronounceItem}>
                    <span>
                      <strong>{idx + 1}.</strong> {item.text}
                    </span>
                    <PronounceButton word={item.text} label="Listen" />
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 7: Choose the correct alternatives */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>7</span>
                <strong>Choose the correct alternatives:</strong>
              </p>

              <div className={styles.matchList}>
                {[
                  { id: '1', left: 'I', opt1: 'has', opt2: 'have', right: 'got red hair.' },
                  { id: '2', left: 'My friend', opt1: 'has', opt2: 'have', right: 'got a son and a daughter.' },
                  { id: '3', left: 'They', opt1: 'has', opt2: 'have', right: 'got two children.' },
                  { id: '4', left: 'She', opt1: "hasn't", opt2: "haven't", right: 'got a dog.' },
                  { id: '5', left: 'We', opt1: "hasn't", opt2: "haven't", right: 'got a car.' },
                  { id: '6', left: 'He', opt1: 'has', opt2: 'have', right: 'got brown hair.' },
                  { id: '7', left: 'I', opt1: "hasn't", opt2: "haven't", right: 'got any children.' },
                  { id: '8', left: 'They', opt1: 'has', opt2: 'have', right: 'got grey hair.' },
                ].map((item) => {
                  const currentVal = ex7Answers[item.id] || '';
                  const v = verify('exercise_7_alternatives', item.id, currentVal);

                  return (
                    <div key={item.id} className={styles.matchRow}>
                      <span className={styles.matchText}>
                        <strong>{item.id}.</strong> {item.left}{' '}
                        <select
                          value={currentVal}
                          onChange={(e) => handleFieldChange('exercise_7_alternatives', item.id, e.target.value)}
                          disabled={readOnly}
                          className={styles.selectInput}
                          style={{ margin: '0 0.35rem' }}
                        >
                          <option value="">...</option>
                          <option value={item.opt1}>{item.opt1}</option>
                          <option value={item.opt2}>{item.opt2}</option>
                        </select>{' '}
                        {item.right}
                      </span>
                      {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
                      {v && v.status !== 'correct' && (
                        <TeacherAnswerBadge result={v} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 8: Sofia & Jules Viewfinder Sentences */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>8</span>
                <strong>Look at the picture and make sentences using the prompts:</strong>
              </p>

              <div className={styles.viewfinderCard}>
                <div className={styles.viewfinderImageWrap}>
                  <Image
                    src="/images/lesson4a/sofia_jules_viewfinder.png"
                    alt="Sofia and Jules in viewfinder at Eiffel Tower"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    style={{ objectFit: 'contain' }}
                  />
                </div>

                <div className={styles.sentencesList}>
                  {[
                    { id: '1', prompt: '1. Sofia / be / an office worker' },
                    { id: '2', prompt: '2. She / have got / a son' },
                    { id: '3', prompt: '3. She / have got / blonde hair / brown eyes' },
                    { id: '4', prompt: '4. She / be / 30s' },
                    { id: '5', prompt: '5. Her son / have got / brown hair / blue eyes' },
                    { id: '6', prompt: '6. He / be / eight years old' },
                    { id: '7', prompt: '7. They / live / in Paris' },
                  ].map((item) => (
                    <div key={item.id} className={styles.sentenceItem}>
                      <span className={styles.promptText}>{item.prompt}</span>
                      {renderInput('exercise_8_sentences', item.id, 'Type full sentence...', { fullWidth: true })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Speaking Section: Exercises 9 & 10 */}
            <div className={styles.exerciseCard}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle} style={{ fontSize: '1.05rem', margin: 0 }}>
                  <span className={styles.sectionIcon}>💬</span>
                  <span>Speaking: Describe a friend</span>
                </h3>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem' }}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>9</span>
                  <span><strong>Think of a friend.</strong> Make notes about their name, job and appearance:</span>
                </p>
              </div>

              <div className={styles.viewfinderCard}>
                <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden' }}>
                  <Image
                    src="/images/lesson4a/friends_phone.png"
                    alt="Two friends in city looking at smartphone"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                <div className={styles.sentencesList}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                    <em>Example: &ldquo;OK, my name is Piotr. My friend&apos;s name is Basia. We&apos;re from Poland. I&apos;m a teacher. I&apos;ve got short hair...&rdquo;</em>
                  </p>

                  <div className={styles.sentenceItem}>
                    <label className={styles.promptText}>Friend&apos;s Name &amp; Job:</label>
                    <input
                      type="text"
                      placeholder="e.g. My friend Marco is an engineer..."
                      value={ex9Answers['friend_info'] || ''}
                      onChange={(e) => handleFieldChange('exercise_9_friend', 'friend_info', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInput}
                    />
                  </div>

                  <div className={styles.sentenceItem}>
                    <label className={styles.promptText}>Appearance (hair, eyes, age):</label>
                    <input
                      type="text"
                      placeholder="e.g. He's got brown hair and green eyes. He's in his 30s..."
                      value={ex9Answers['friend_appearance'] || ''}
                      onChange={(e) => handleFieldChange('exercise_9_friend', 'friend_appearance', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInput}
                    />
                  </div>

                  <div style={{ background: '#f8fafc', borderLeft: '3px solid #e11d48', borderRadius: '8px', padding: '0.75rem', marginTop: '0.5rem' }}>
                    <p className={styles.exInstruction} style={{ margin: 0 }}>
                      <span className={styles.exBadge}>10</span>
                      <span><strong>Work in pairs.</strong> Take turns to describe your friend to your partner:</span>
                    </p>
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
