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
import styles from './lesson4d.module.scss';

export interface Lesson4DContentProps {
  lesson?: LessonContextModel | null;
  user?: Record<string, unknown> | null;
  isTeacherReview?: boolean;
  readOnly?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio?: (track: string) => void;
  playingAudio?: string | null;
  originalAnswers?: Record<string, unknown>;
}

export const FALLBACK_ANSWER_KEY_4D: LessonAnswerKey = {
  exercise_2_clocks_match: {
    '1': ['E', 'e'],
    '2': ['F', 'f'],
    '3': ['B', 'b'],
    '4': ['C', 'c'],
  },
  exercise_3_conversations: {
    '1': ["It's three", "it's three", 'Three', 'three'],
    '2': ['quarter past six', "it's quarter past six", "It's quarter past six"],
    '3': ['half past eleven', "it's half past eleven"],
    '4': ['quarter to eleven', 'at quarter to eleven', "it's quarter to eleven"],
  },
  exercise_4_useful_phrases: {
    '1': ["It's quarter past four.", "It's quarter past four", 'quarter past four'],
    '2': ["It's five to five.", "It's five to five", 'five to five'],
    '3': ["It's four o'clock.", "It's four o'clock", "four o'clock"],
    '4': ["It's twenty to five.", "It's twenty to five", 'twenty to five'],
    '5': ["It's quarter to five.", "It's quarter to five", 'quarter to five'],
    '6': ["It's half past four.", "It's half past four", 'half past four'],
    '7': ["It's five past four.", "It's five past four", 'five past four'],
  },
  exercise_check_1_wordmap: {
    colours_1: ['blonde'],
    colours_2: ['brown'],
    colours_3: ['grey', 'gray'],
    colours_4: ['red'],
    age_1: ['in her 20s'],
    age_2: ['in his 50s'],
    body_1: ['a beard'],
    body_2: ['eyes'],
    body_3: ['hair'],
  },
  exercise_check_2_sentences: {
    '1': ['blonde'],
    '2': ['in her 20s'],
    '3': ['a beard'],
    '4': ['in his 80s'],
    '5': ['eyes'],
  },
  exercise_check_3_have_got: {
    '1': ["'ve got", 'have got'],
    '2': ["haven't got", 'have not got'],
    '3': ["'s got", 'has got'],
    '4': ["hasn't got", 'has not got'],
    '5': ["hasn't got", 'has not got'],
    '6': ["'ve got", 'have got'],
    '7': ["haven't got", 'have not got'],
    '8': ['has got', "'s got"],
  },
  exercise_check_5a_order: {
    '1': ['Have you got a phone?', 'Have you got a phone'],
    '2': ['Has your teacher got green eyes?', 'Has your teacher got green eyes'],
    '3': ['Have your parents got blonde hair?', 'Have your parents got blonde hair'],
    '4': ['Have you got food in your bag?', 'Have you got food in your bag'],
    '5': ['Has your phone got a good camera?', 'Has your phone got a good camera'],
    '6': ['Have you got a bottle of water?', 'Have you got a bottle of water'],
    '7': ['How many credit cards have you got?', 'How many credit cards have you got'],
  },
  exercise_check_6_alternatives: {
    '1': ['Go to'],
    '2': ['Visit'],
    '3': ['Take'],
    '4': ['Take'],
    '5': ["Don't take"],
    '6': ['Try'],
    '7': ['Drink'],
    '8': ['See'],
  },
  exercise_check_7_uk: {
    '1': ['Take your passport.', 'Take your passport'],
    '2': ["Don't go to Leicester Square.", "Don't go to Leicester Square", 'Do not go to Leicester Square.'],
    '3': ['Try British food.', 'Try British food', 'Eat British food.'],
    '4': ["Don't drink coffee.", "Don't drink coffee", 'Do not drink coffee.'],
    '5': ["Don't take a taxi.", "Don't take a taxi", "Don't take taxis.", "Don't take taxis"],
    '6': ['Go to a market.', 'Go to a market', 'Visit a market.', 'Go to the market.'],
  },
};

const CLOCKS_EX1 = [
  { id: 'A', time: '6:45', words: 'Six forty-five (quarter to seven)' },
  { id: 'B', time: '11:30', words: 'Eleven thirty (half past eleven)' },
  { id: 'C', time: '10:45', words: 'Ten forty-five (quarter to eleven)' },
  { id: 'D', time: '12:05', words: 'Twelve oh five (five past twelve)' },
  { id: 'E', time: '3:00', words: "Three o'clock" },
  { id: 'F', time: '6:15', words: 'Six fifteen (quarter past six)' },
  { id: 'G', time: '7:10', words: 'Seven ten (ten past seven)' },
  { id: 'H', time: '11:15', words: 'Eleven fifteen (quarter past eleven)' },
];

export default function Lesson4DContent({
  lesson: propLesson,
  isTeacherReview = false,
  readOnly = false,
  answerKey: propAnswerKey,
  playAudio,
  playingAudio,
  originalAnswers,
}: Lesson4DContentProps) {
  const context = useLessonContext();
  const effectiveLesson = propLesson || context.lesson;
  const effectiveAnswers = context.answers;

  const currentAnswerKey = propAnswerKey || effectiveLesson?.answerKey || FALLBACK_ANSWER_KEY_4D;
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

  const ex2Answers = (answers['exercise_2_clocks_match'] as Record<string, string>) || {};
  const exCheck4Answers = (answers['exercise_check_4_about_you'] as Record<string, string>) || {};
  const exCheck6Answers = (answers['exercise_check_6_alternatives'] as Record<string, string>) || {};
  const reflectAnswers = (answers['exercise_reflect_ratings'] as Record<string, string>) || {};

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
        {/* Header Banner Pearson 4D */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge4D}>
              4<span className={styles.letterD}>D</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>English in action</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: tell the time</span>
                <span className={styles.pillGoal}>Unit 4 Check &amp; reflect</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Clocks Banner with authentic img_1.png */}
        <div className={styles.clocksHero}>
          <div className={styles.clockImageWrap}>
            <Image
              src="/images/lesson4d/img_1.png"
              alt="Clocks: Big Ben and Kremlin clock tower"
              fill
              sizes="(max-width: 768px) 100vw, 260px"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        <div className={styles.contentBody}>
          {/* SECTION 1: Telling the time */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>🕒</span>
                <span>English in action: Telling the time</span>
              </h2>
            </div>

            {/* Exercise 1: Read digital clocks A–H */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>1</span>
                <span><strong>Read the times on the clocks:</strong></span>
              </p>

              <div className={styles.clocksGrid}>
                {CLOCKS_EX1.map((c) => (
                  <div key={c.id} className={styles.clockCard}>
                    <span className={styles.clockLetterBadge}>{c.id}</span>
                    <div className={styles.digitalDisplay}>{c.time}</div>
                    <div className={styles.clockWords}>{c.words}</div>
                    <div style={{ marginTop: '0.4rem' }}>
                      <PronounceButton word={c.words} size="small" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 2: Listen and match conversations 1–4 */}
            <div className={styles.exerciseCard}>
              <div className={styles.sectionHeader}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>2</span>
                  <span><strong>Listen and match</strong> conversations 1–4 with the correct clocks from Exercise 1:</span>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('4.11')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '4.11' || playingAudio === '/audio/4.11.mp3' ? '⏸ Playing 4.11' : '▶ Audio 4.11'}
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {[
                  { id: '1', title: 'Conversation 1' },
                  { id: '2', title: 'Conversation 2' },
                  { id: '3', title: 'Conversation 3' },
                  { id: '4', title: 'Conversation 4' },
                ].map((item) => {
                  const currentVal = ex2Answers[item.id] || '';
                  const v = verify('exercise_2_clocks_match', item.id, currentVal);

                  return (
                    <div key={item.id} className={styles.matchRow}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <select
                          value={currentVal}
                          onChange={(e) => handleFieldChange('exercise_2_clocks_match', item.id, e.target.value)}
                          disabled={readOnly}
                          className={styles.selectInput}
                        >
                          <option value="">Clock...</option>
                          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((clk) => (
                            <option key={clk} value={clk}>Clock {clk}</option>
                          ))}
                        </select>
                        {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
                      </div>
                      {v && v.status !== 'correct' && (
                        <div style={{ width: '100%', marginTop: '0.25rem' }}>
                          <TeacherAnswerBadge result={v} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 3: Complete conversations */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>3</span>
                <span><strong>Listen again and complete the conversations:</strong></span>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* 1 */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                  <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.9rem' }}>
                    <strong>1 A:</strong> Excuse me. What time is it?
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.9rem' }}>B:</strong>
                    <div style={{ width: '160px' }}>
                      {renderInput('exercise_3_conversations', '1', 'Type words...')}
                    </div>
                    <span style={{ fontSize: '0.9rem' }}>o&apos;clock.</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                    <strong>A:</strong> Thank you.
                  </p>
                </div>

                {/* 2 */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                  <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.9rem' }}>
                    <strong>2 A:</strong> What time is it?<br />
                    <strong>B:</strong> It&apos;s quarter past six.<br />
                    <strong>A:</strong> Quarter to six?
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.9rem' }}>B:</strong> No,
                    <div style={{ width: '200px' }}>
                      {renderInput('exercise_3_conversations', '2', 'Type words...')}
                    </div>
                    <span>.</span>
                  </div>
                </div>

                {/* 3 */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                  <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.9rem' }}>
                    <strong>3 A:</strong> What time is it, Alex?<br />
                    <strong>B:</strong> Er, it&apos;s half past eleven.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.9rem' }}>A:</strong> Sorry,
                    <div style={{ width: '200px' }}>
                      {renderInput('exercise_3_conversations', '3', 'Type words...')}
                    </div>
                    <span>?</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                    <strong>B:</strong> Yeah.<br />
                    <strong>A:</strong> Oh no! I&apos;m late.
                  </p>
                </div>

                {/* 4 */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem' }}>
                  <p style={{ margin: '0 0 0.35rem 0', fontSize: '0.9rem' }}>
                    <strong>4 A:</strong> What time is our train?<br />
                    <strong>B:</strong> It&apos;s at quarter to eleven.<br />
                    <strong>A:</strong> Quarter past eleven?
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.9rem' }}>B:</strong> No,
                    <div style={{ width: '200px' }}>
                      {renderInput('exercise_3_conversations', '4', 'Type words...')}
                    </div>
                    <span>.</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                    <strong>A:</strong> Oh OK.
                  </p>
                </div>
              </div>
            </div>

            {/* Exercise 4: Useful phrases & Matching */}
            <div className={styles.exerciseCard}>
              <div className={styles.sectionHeader}>
                <p className={styles.exInstruction}>
                  <span className={styles.exBadge}>4</span>
                  <span><strong>Find times 1–7 in the Useful phrases box.</strong> Listen and repeat:</span>
                </p>
                {playAudio && (
                  <button
                    type="button"
                    onClick={() => playAudio('4.12')}
                    className={styles.audioBtn}
                  >
                    {playingAudio === '4.12' || playingAudio === '/audio/4.12.mp3' ? '⏸ Playing 4.12' : '▶ Audio 4.12'}
                  </button>
                )}
              </div>

              {/* Useful Phrases Box */}
              <div className={styles.usefulPhrasesBox}>
                <div className={styles.phrasesHeader}>💡 Useful phrases</div>

                <div className={styles.phraseCategory}>
                  <h4>Asking for the time</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={styles.phrasePill}>
                      What time is it? <PronounceButton word="What time is it?" size="small" />
                    </span>
                  </div>
                </div>

                <div className={styles.phraseCategory}>
                  <h4>Saying the time</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[
                      "It's four o'clock.",
                      "It's five past four.",
                      "It's quarter past four.",
                      "It's half past four.",
                      "It's twenty to five.",
                      "It's quarter to five.",
                      "It's five to five.",
                    ].map((ph) => (
                      <span key={ph} className={styles.phrasePill}>
                        {ph} <PronounceButton word={ph} size="small" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.phraseCategory}>
                  <h4>Asking &amp; saying the time of things</h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={styles.phrasePill}>
                      What time is the (train to London)? <PronounceButton word="What time is the train to London?" size="small" />
                    </span>
                    <span className={styles.phrasePill}>
                      It&apos;s at (seven forty-five). <PronounceButton word="It's at seven forty-five." size="small" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Match times 1–7 to Useful phrases */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.65rem' }}>
                {[
                  { id: '1', time: '1.  4.15' },
                  { id: '2', time: '2.  4.55' },
                  { id: '3', time: '3.  4.00' },
                  { id: '4', time: '4.  4.40' },
                  { id: '5', time: '5.  4.45' },
                  { id: '6', time: '6.  4.30' },
                  { id: '7', time: '7.  4.05' },
                ].map((item) => (
                  <div key={item.id} className={styles.matchRow}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', minWidth: '80px' }}>{item.time}</span>
                    <div style={{ flex: 1 }}>
                      {renderInput('exercise_4_useful_phrases', item.id, 'Write time phrase...')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 5: Speaking Practice */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>5</span>
                <span><strong>Work in pairs.</strong> Ask and answer questions about the clocks in Exercise 1:</span>
              </p>

              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', borderLeft: '3px solid #be123c' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
                  <em>Dialogue model:</em><br />
                  <strong>A:</strong> &ldquo;What time is it?&rdquo;<br />
                  <strong>B:</strong> &ldquo;It&apos;s quarter to seven.&rdquo; <em>(for clock A)</em>
                </p>
              </div>
            </div>

            {/* Exercise 6: Communication Pairwork */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>6</span>
                <span><strong>Work in pairs.</strong> Student A: Turn to page 156. Student B: Turn to page 155.</span>
              </p>

              <div className={styles.pairworkGrid}>
                <div className={`${styles.pairRoleCard} ${styles.roleA}`}>
                  <div className={styles.roleHeader}>
                    <span className={styles.roleBadgeA}>Student A</span>
                    <span className={styles.rolePage}>Turn to page 156</span>
                  </div>
                  <p className={styles.roleDesc}>
                    Look at your world clocks. Ask Student B what time it is in the missing cities (e.g. <em>&ldquo;What time is it in Tokyo?&rdquo;</em>) and note down the answers.
                  </p>
                  <div className={styles.pairworkNotes}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                      Student A notes (times in cities):
                    </label>
                    <input
                      type="text"
                      placeholder="Type your notes here..."
                      value={getFieldValue('exercise_6_pairwork', 'notes_a')}
                      onChange={(e) => handleFieldChange('exercise_6_pairwork', 'notes_a', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInput}
                    />
                  </div>
                </div>

                <div className={`${styles.pairRoleCard} ${styles.roleB}`}>
                  <div className={styles.roleHeader}>
                    <span className={styles.roleBadgeB}>Student B</span>
                    <span className={styles.rolePage}>Turn to page 155</span>
                  </div>
                  <p className={styles.roleDesc}>
                    Look at your world clocks. Answer Student A&apos;s questions about the times in your cities, then ask Student A about the remaining cities.
                  </p>
                  <div className={styles.pairworkNotes}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                      Student B notes (times in cities):
                    </label>
                    <input
                      type="text"
                      placeholder="Type your notes here..."
                      value={getFieldValue('exercise_6_pairwork', 'notes_b')}
                      onChange={(e) => handleFieldChange('exercise_6_pairwork', 'notes_b', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Check and reflect */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>✅</span>
                <span>Check and reflect: Unit 4 Review</span>
              </h2>
            </div>

            {/* Check Ex 1: Word map */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>1</span>
                <span><strong>Complete the word map with the words in the box:</strong></span>
              </p>

              <div style={{ background: '#f1f5f9', padding: '0.65rem 1rem', borderRadius: '8px', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['a beard', 'blonde', 'brown', 'eyes', 'grey', 'hair', 'in her 20s', 'in his 50s', 'red'].map((w) => (
                  <span key={w} style={{ background: '#ffffff', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #cbd5e1' }}>
                    {w}
                  </span>
                ))}
              </div>

              <div className={styles.wordMapClusters}>
                {/* Colours */}
                <div className={styles.clusterCard}>
                  <div className={styles.clusterCircle}>colours</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                    {renderInput('exercise_check_1_wordmap', 'colours_1', 'Colour 1...')}
                    {renderInput('exercise_check_1_wordmap', 'colours_2', 'Colour 2...')}
                    {renderInput('exercise_check_1_wordmap', 'colours_3', 'Colour 3...')}
                    {renderInput('exercise_check_1_wordmap', 'colours_4', 'Colour 4...')}
                  </div>
                </div>

                {/* Age */}
                <div className={styles.clusterCard}>
                  <div className={styles.clusterCircle}>age</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                    {renderInput('exercise_check_1_wordmap', 'age_1', 'Age 1...')}
                    {renderInput('exercise_check_1_wordmap', 'age_2', 'Age 2...')}
                  </div>
                </div>

                {/* The body */}
                <div className={styles.clusterCard}>
                  <div className={styles.clusterCircle}>the body</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                    {renderInput('exercise_check_1_wordmap', 'body_1', 'Body part 1...')}
                    {renderInput('exercise_check_1_wordmap', 'body_2', 'Body part 2...')}
                    {renderInput('exercise_check_1_wordmap', 'body_3', 'Body part 3...')}
                  </div>
                </div>
              </div>
            </div>

            {/* Check Ex 2: Complete sentences */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>2</span>
                <span><strong>Complete the sentences with the words in the box:</strong></span>
              </p>

              <div style={{ background: '#f1f5f9', padding: '0.5rem 0.85rem', borderRadius: '6px', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['a beard', 'blonde', 'eyes', 'in his 80s', 'in her 20s'].map((w) => (
                  <span key={w} style={{ background: '#ffffff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #cbd5e1' }}>
                    {w}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div className={styles.matchRow}>
                  <span>1. No, her hair isn&apos;t red. It&apos;s</span>
                  <div style={{ width: '160px' }}>
                    {renderInput('exercise_check_2_sentences', '1', '...')}
                  </div>
                  <span>.</span>
                </div>
                <div className={styles.matchRow}>
                  <span>2. I&apos;m in my 30s, and my wife is</span>
                  <div style={{ width: '160px' }}>
                    {renderInput('exercise_check_2_sentences', '2', '...')}
                  </div>
                  <span>.</span>
                </div>
                <div className={styles.matchRow}>
                  <span>3. My brother&apos;s got blonde hair and</span>
                  <div style={{ width: '160px' }}>
                    {renderInput('exercise_check_2_sentences', '3', '...')}
                  </div>
                  <span>.</span>
                </div>
                <div className={styles.matchRow}>
                  <span>4. My father is</span>
                  <div style={{ width: '160px' }}>
                    {renderInput('exercise_check_2_sentences', '4', '...')}
                  </div>
                  <span>.</span>
                </div>
                <div className={styles.matchRow}>
                  <span>5. My sister&apos;s got green</span>
                  <div style={{ width: '160px' }}>
                    {renderInput('exercise_check_2_sentences', '5', '...')}
                  </div>
                  <span>.</span>
                </div>
              </div>
            </div>

            {/* Check Ex 3: have got positive / negative */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>3</span>
                <span><strong>Complete the sentences with the positive (+) or negative (-) form of <em>have got</em>:</strong></span>
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.65rem' }}>
                {[
                  { id: '1', prompt: "1. I ______ a beard. (+)" },
                  { id: '2', prompt: "2. We ______ a big house. (-)" },
                  { id: '3', prompt: "3. John ______ two sisters. (+)" },
                  { id: '4', prompt: "4. Sarah ______ blue eyes. (-)" },
                  { id: '5', prompt: "5. Our flat ______ a big kitchen. (-)" },
                  { id: '6', prompt: "6. They ______ three children. (+)" },
                  { id: '7', prompt: "7. You ______ grey hair! (-)" },
                  { id: '8', prompt: "8. Our town ______ two restaurants. (+)" },
                ].map((item) => (
                  <div key={item.id} className={styles.matchRow}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.prompt}</span>
                    <div style={{ width: '140px' }}>
                      {renderInput('exercise_check_3_have_got', item.id, "'ve / hasn't got...")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Check Ex 4: About you */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>4</span>
                <span><strong>Complete the sentences so they are true for you:</strong></span>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { id: '1', prompt: "1. I've got..." },
                  { id: '2', prompt: "2. My friend hasn't got..." },
                  { id: '3', prompt: "3. My house/flat has got..." },
                  { id: '4', prompt: "4. My parents have got..." },
                  { id: '5', prompt: "5. My teacher has got..." },
                  { id: '6', prompt: "6. My town has got..." },
                ].map((item) => (
                  <div key={item.id} className={styles.matchRow}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '180px' }}>{item.prompt}</span>
                    <input
                      type="text"
                      placeholder="Write your sentence..."
                      value={exCheck4Answers[item.id] || ''}
                      onChange={(e) => handleFieldChange('exercise_check_4_about_you', item.id, e.target.value)}
                      disabled={readOnly}
                      className={styles.textInput}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Check Ex 5: Unscramble question order */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>5a</span>
                <span><strong>Put the words in the correct order to make questions:</strong></span>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: '1', prompt: '1. you / got / a / Have / phone ?' },
                  { id: '2', prompt: '2. Has / your / green / teacher / eyes / got ?' },
                  { id: '3', prompt: '3. Have / blonde / your / hair / parents / got ?' },
                  { id: '4', prompt: '4. you / food / your / bag / in / Have / got ?' },
                  { id: '5', prompt: '5. camera / good / your / phone / Has / a / got ?' },
                  { id: '6', prompt: '6. bottle / of / Have / a / got / water / you ?' },
                  { id: '7', prompt: '7. How / credit cards / you / many / got / have ?' },
                ].map((item) => (
                  <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>{item.prompt}</span>
                    {renderInput('exercise_check_5a_order', item.id, 'Write question...')}
                  </div>
                ))}
              </div>

              <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '8px', borderLeft: '3px solid #be123c', marginTop: '0.5rem' }}>
                <p className={styles.exInstruction} style={{ margin: 0 }}>
                  <span className={styles.exBadge}>5b</span>
                  <span><strong>Work in pairs.</strong> Ask and answer the questions in Exercise 5a.</span>
                </p>
              </div>
            </div>

            {/* Check Ex 6: Choose correct alternatives */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>6</span>
                <span><strong>Choose the correct alternatives:</strong></span>
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.65rem' }}>
                {[
                  { id: '1', optA: 'Go to', optB: 'Take', rest: "Spain – it's very nice." },
                  { id: '2', optA: 'Take', optB: 'Visit', rest: "Tokyo. It's amazing!" },
                  { id: '3', optA: 'Go to', optB: 'Take', rest: 'some photos of the park.' },
                  { id: '4', optA: 'Try', optB: 'Take', rest: "a coat. It's cold." },
                  { id: '5', optA: "Don't take", optB: "Don't go", rest: 'to the bus. It’s slow.' },
                  { id: '6', optA: 'Drink', optB: 'Try', rest: 'French food.' },
                  { id: '7', optA: 'Drink', optB: 'Take', rest: "coffee from Brazil, it's very good." },
                  { id: '8', optA: 'See', optB: 'Take', rest: 'the new Star Wars film.' },
                ].map((item) => {
                  const currentVal = exCheck6Answers[item.id] || '';
                  const v = verify('exercise_check_6_alternatives', item.id, currentVal);

                  return (
                    <div key={item.id} className={styles.matchRow}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.id}.</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('exercise_check_6_alternatives', item.id, item.optA)}
                          disabled={readOnly}
                          style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            background: currentVal === item.optA ? '#be123c' : '#ffffff',
                            color: currentVal === item.optA ? '#ffffff' : '#334155',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {item.optA}
                        </button>
                        <span>/</span>
                        <button
                          type="button"
                          onClick={() => handleFieldChange('exercise_check_6_alternatives', item.id, item.optB)}
                          disabled={readOnly}
                          style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            background: currentVal === item.optB ? '#be123c' : '#ffffff',
                            color: currentVal === item.optB ? '#ffffff' : '#334155',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {item.optB}
                        </button>
                        {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#475569' }}>{item.rest}</span>
                      {v && v.status !== 'correct' && (
                        <div style={{ width: '100%', marginTop: '0.25rem' }}>
                          <TeacherAnswerBadge result={v} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Check Ex 7: UK trip photos sentences */}
            <div className={styles.exerciseCard}>
              <p className={styles.exInstruction}>
                <span className={styles.exBadge}>7</span>
                <span><strong>Look at the photos and the symbols. Write sentences.</strong> On your holiday to the UK:</span>
              </p>

              <div className={styles.ukExerciseLayout}>
                <div className={styles.ukImageContainer}>
                  <div className={styles.ukSingleImageWrap}>
                    <Image
                      src="/images/lesson4d/img.png"
                      alt="On your holiday to the UK: photos and symbols 1 to 6"
                      fill
                      sizes="(max-width: 768px) 100vw, 280px"
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  </div>
                </div>

                <div className={styles.ukInputsList}>
                  {[
                    { id: '1', label: '1.' },
                    { id: '2', label: '2.' },
                    { id: '3', label: '3.' },
                    { id: '4', label: '4.' },
                    { id: '5', label: '5.' },
                    { id: '6', label: '6.' },
                  ].map((item) => (
                    <div key={item.id} className={styles.ukInputRow}>
                      <span className={styles.ukItemNumber}>{item.label}</span>
                      <div style={{ flex: 1 }}>
                        {renderInput('exercise_check_7_uk', item.id, 'Write sentence...')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reflect Box */}
            <div className={styles.reflectBox}>
              <h3 className={styles.reflectTitle}>🌟 Reflect</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#7c2d12' }}>
                How confident do you feel about the statements below? Rate 1–5 (1 = not very confident, 5 = very confident):
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { id: 'describe_people', label: 'I can describe people.' },
                  { id: 'prepare_trip', label: 'I can prepare for a trip.' },
                  { id: 'give_advice', label: 'I can give advice.' },
                  { id: 'tell_time', label: 'I can tell the time.' },
                ].map((item) => (
                  <div key={item.id} className={styles.reflectRow}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.label}</span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handleFieldChange('exercise_reflect_ratings', item.id, String(score))}
                          disabled={readOnly}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '1px solid #fdba74',
                            background: reflectAnswers[item.id] === String(score) ? '#ea580c' : '#ffffff',
                            color: reflectAnswers[item.id] === String(score) ? '#ffffff' : '#9a3412',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}