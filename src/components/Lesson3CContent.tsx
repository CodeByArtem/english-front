'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLessonContext, useExerciseAnswer, LessonContextModel } from '@/context/LessonContext';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import PronounceButton from '@/components/PronounceButton';
import { LessonAnswerKey, verifyAnswer, getExerciseKey, VerificationResult } from '@/lib/answerVerification';
import styles from './lesson3c.module.scss';

export interface Lesson3CContentProps {
  lesson?: LessonContextModel | null;
  user?: Record<string, unknown> | null;
  isTeacherReview?: boolean;
  readOnly?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio?: (track: string) => void;
  playingAudio?: string | null;
  originalAnswers?: Record<string, unknown>;
}

// Захардкоженный fallbackAnswerKey для полной автономности и мгновенной проверки
export const FALLBACK_ANSWER_KEY_3C: LessonAnswerKey = {
  exercise_3_opposites: {
    '1': ['bad'],
    '2': ['big', 'large'],
    '3': ['old'],
    '4': ['expensive'],
    '5': ['quiet'],
  },
  exercise_5_places_matching: {
    A: ['1', 'West Runton'],
    B: ['3', 'Cromer'],
    C: ['2', 'Sheringham'],
  },
  exercise_6_true_false: {
    '1': ['F', 'false'],
    '2': ['F', 'false'],
    '3': ['T', 'true'],
    '4': ['T', 'true'],
    '5': ['F', 'false'],
    '6': ['T', 'true'],
  },
  exercise_9_word_order: {
    '1': ['This restaurant is expensive.'],
    '2': ['There is a small park.'],
    '3': ['These hotels are not cheap.', "These hotels aren't cheap."],
    '4': ['This is a busy station.'],
    '5': ['It is not a big supermarket.', "It isn't a big supermarket."],
    '6': ['Is this a new bank?'],
    '7': ['Is there a big station in your town?'],
    '8': ['Are there any good restaurants in your town?'],
  },
};

const VOCAB_WORDS = [
  'busy',
  'quiet',
  'big',
  'small',
  'old',
  'new',
  'cheap',
  'expensive',
  'good',
  'bad',
];

const PLACES_MATCHING_ITEMS = [
  { key: 'A', label: 'Photo A (Railway track & greenery)' },
  { key: 'B', label: 'Photo B (Grand brick hotel & sea)' },
  { key: 'C', label: 'Photo C (Clock tower & town street)' },
];

const TOWNS_OPTIONS = [
  { value: '1', label: '1. West Runton' },
  { value: '2', label: '2. Sheringham' },
  { value: '3', label: '3. Cromer' },
];

const TF_ITEMS = [
  { id: '1', text: '1. Sheringham is a small town.' },
  { id: '2', text: '2. There are six hotels in West Runton.' },
  { id: '3', text: '3. The shops in Cromer are not expensive.' },
  { id: '4', text: '4. There are cheap bookshops in Sheringham.' },
  { id: '5', text: '5. The restaurant in West Runton is bad.' },
  { id: '6', text: '6. The cinema in Cromer isn’t new.' },
];

const STRESSED_ITEMS = [
  { id: '1', text: 'This is a quiet town.', stressed: ['quiet', 'town'] },
  { id: '2', text: 'There are six small shops.', stressed: ['small', 'shops'] },
  { id: '3', text: 'There are no hotels.', stressed: ['no', 'hotels'] },
  { id: '4', text: 'This town is busy.', stressed: ['town', 'busy'] },
  { id: '5', text: 'There’s a small cinema.', stressed: ['small', 'cinema'] },
];

const WORD_ORDER_ITEMS_3C = [
  { id: '1', words: 'expensive / This / restaurant / is' },
  { id: '2', words: 'small / park / is / There / a' },
  { id: '3', words: 'are / hotels / cheap / not / These' },
  { id: '4', words: 'busy / This / station / a / is' },
  { id: '5', words: 'big / not / is / supermarket / It / a' },
  { id: '6', words: 'bank / new / Is / this / a ?' },
  { id: '7', words: 'Is / your / a / station / big / town / in / there ?' },
  { id: '8', words: 'restaurants / good / town / your / there / any / in / Are ?' },
];

export default function Lesson3CContent({
  isTeacherReview,
  readOnly: propReadOnly,
  answerKey: propAnswerKey,
  playAudio: propPlayAudio,
  playingAudio: propPlayingAudio,
  originalAnswers,
}: Lesson3CContentProps) {
  const context = useLessonContext();
  const playAudio = propPlayAudio || context.playAudio;
  const playingAudio = propPlayingAudio ?? context.playingAudio;
  const isTeacher = isTeacherReview ?? context.isTeacher;
  const isReadOnly = propReadOnly ?? context.isReadOnly;
  const effectiveAnswerKey = propAnswerKey ?? context.answerKey ?? FALLBACK_ANSWER_KEY_3C;
  const isReview = Boolean(isTeacher || (effectiveAnswerKey && isReadOnly));
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  const orig = originalAnswers ?? (context.answers as Record<string, unknown> | undefined);
  const isDiff = (origVal: unknown, currentVal: unknown) =>
    orig !== undefined && origVal !== undefined && origVal !== currentVal;

  // Упражнения через контекст
  const ex3 = useExerciseAnswer<Record<string, string>>('exercise_3_opposites', {});
  const ex4 = useExerciseAnswer<string>('exercise_4_sentences', '');
  const ex5 = useExerciseAnswer<Record<string, string>>('exercise_5_places_matching', {});
  const ex6 = useExerciseAnswer<Record<string, string>>('exercise_6_true_false', {});
  const ex9 = useExerciseAnswer<Record<string, string>>('exercise_9_word_order', {});
  const ex10 = useExerciseAnswer<Record<string, string>>('exercise_10_town_questions', {});
  const ex11 = useExerciseAnswer<string>('exercise_11_speaking_notes', '');

  const getFieldVerify = (exerciseKey: string, fieldKey: string): VerificationResult | null => {
    const fromCtx = context.getVerification(exerciseKey, fieldKey);
    if (fromCtx) return fromCtx;

    const exKey = getExerciseKey(effectiveAnswerKey, exerciseKey);
    if (!exKey) return null;

    const studentEx = context.getAnswer(exerciseKey);
    const studentVal =
      studentEx && typeof studentEx === 'object'
        ? (studentEx as Record<string, unknown>)[fieldKey]
        : undefined;
    const expected = exKey[fieldKey];
    return verifyAnswer(studentVal, expected);
  };

  const getInputClass = (ver?: VerificationResult | null) => {
    if (!isReview || !ver || !ver.hasKey) return '';
    return ver.isCorrect ? styles.inputValid : styles.inputInvalid;
  };

  const origEx3 = (orig?.exercise_3_opposites as Record<string, string> | undefined) || {};
  const origEx4 = typeof orig?.exercise_4_sentences === 'string' ? orig.exercise_4_sentences : undefined;
  const origEx5 = (orig?.exercise_5_places_matching as Record<string, string> | undefined) || {};
  const origEx6 = (orig?.exercise_6_true_false as Record<string, string> | undefined) || {};
  const origEx9 = (orig?.exercise_9_word_order as Record<string, string> | undefined) || {};
  const origEx10 = (orig?.exercise_10_town_questions as Record<string, string> | undefined) || {};
  const origEx11 = typeof orig?.exercise_11_speaking_notes === 'string' ? orig.exercise_11_speaking_notes : undefined;

  return (
    <div className={styles.pageContainer}>
      <motion.article
        className={styles.textbookPage}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Banner 3C */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge3C} aria-label="Unit 3, Lesson C">
              <span>3</span>
              <span className={styles.letterC}>C</span>
            </div>
            <div className={styles.titleArea}>
              <span className={styles.unitTag}>Unit 3 • Lesson 3C</span>
              <h1 className={styles.titleHeading}>It&apos;s expensive!</h1>
            </div>
          </div>

          <div className={styles.goalsCard}>
            <p>› <strong>Goal:</strong> describe a town or a city</p>
            <p>› <strong>Grammar:</strong> position of adjectives (<em>be + adjective</em> / <em>adjective + noun</em>)</p>
            <p>› <strong>Vocabulary:</strong> describing places (<em>busy, quiet, big, small, old, new, cheap, expensive, good, bad</em>)</p>
          </div>
        </header>

        <div className={styles.contentBody}>
          {/* ================= PART 1: VOCABULARY & READING ================= */}
          <div className={styles.twoColLayout}>
            {/* ================= LEFT COLUMN: VOCABULARY ================= */}
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>Vocabulary</h2>

              {/* Ex 1: Describing Places */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>1</span>
                  <span className={styles.instruction}>
                    Work in pairs. Look at the pictures. What places can you see?
                  </span>
                </div>

                <div
                  className={styles.imageWrap}
                  onClick={() =>
                    setPreviewImage({
                      src: '/images/lesson3c/places_grid.png',
                      alt: '10 places illustrations: busy/quiet café, big/small hotel, old/new cinema, cheap/expensive restaurant, good/bad park',
                    })
                  }
                  style={{ cursor: 'pointer', position: 'relative' }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    setPreviewImage({
                      src: '/images/lesson3c/places_grid.png',
                      alt: '10 places illustrations: busy/quiet café, big/small hotel, old/new cinema, cheap/expensive restaurant, good/bad park',
                    })
                  }
                  aria-label="Enlarge 10 places pictures"
                >
                  <Image
                    src="/images/lesson3c/places_grid.png"
                    alt="Illustrations of 10 places: busy/quiet café, big/small hotel, old/new cinema, cheap/expensive restaurant, good/bad park"
                    width={480}
                    height={380}
                    unoptimized
                  />
                  <div className={styles.zoomOverlay}>🔍 Click to zoom</div>
                </div>

                {/* Ex 2: Audio 3.12 */}
                <div className={styles.audioActionRow}>
                  <button
                    type="button"
                    onClick={() => playAudio?.('3.12')}
                    className={`${styles.audioBtn} ${playingAudio === '3.12' ? styles.audioBtnActive : ''}`}
                    aria-label="Play Audio 3.12"
                  >
                    {playingAudio === '3.12' ? (
                      <>
                        <div className={styles.equalizer}>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                        </div>
                        <span>Playing 3.12</span>
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        <span>Audio 3.12</span>
                      </>
                    )}
                  </button>
                  <span className={styles.audioHint}>Listen and repeat the sentences in Exercise 1</span>
                </div>

                {/* Vocabulary Chips with Milo PronounceButton */}
                <div className={styles.chipsGrid}>
                  {VOCAB_WORDS.map((w) => (
                    <div key={w} className={styles.wordChip}>
                      <span>{w}</span>
                      <PronounceButton word={w} size="small" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Ex 3: Opposites */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>3</span>
                  <span className={styles.instruction}>
                    Complete the sentences with opposite adjectives.
                  </span>
                </div>

                <div className={styles.fillList}>
                  {[
                    { id: '1', prompt: "1. This supermarket isn't good. It's", placeholder: 'bad', w: '5.5rem' },
                    { id: '2', prompt: "2. This bank isn't small. It's", placeholder: 'big', w: '5.5rem' },
                    { id: '3', prompt: "3. This park isn't new. It's", placeholder: 'old', w: '5.5rem' },
                    { id: '4', prompt: "4. This hotel isn't cheap. It's", placeholder: 'expensive', w: '7rem' },
                    { id: '5', prompt: "5. This café isn't busy. It's", placeholder: 'quiet', w: '5.5rem' },
                  ].map((item) => {
                    const ver = getFieldVerify('exercise_3_opposites', item.id);
                    const currentVal = ex3.value[item.id] || '';
                    const isItemDiff = isDiff(origEx3[item.id], currentVal);
                    return (
                      <div key={item.id} className={styles.fillItem}>
                        <span>{item.prompt}</span>
                        <input
                          type="text"
                          placeholder={item.placeholder}
                          value={currentVal}
                          onChange={(e) => ex3.setField(item.id, e.target.value)}
                          disabled={isReadOnly}
                          className={`${styles.inlineInput} ${getInputClass(ver)} ${isItemDiff ? styles.diffHighlight : ''}`}
                          style={{ width: item.w }}
                        />.
                        {isReview && ver?.hasKey && ver.isCorrect && (
                          <span className={styles.correctBadge} title="Correct">✓</span>
                        )}
                        {isReview && ver && !ver.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={ver} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ex 4: Make sentences */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>4</span>
                  <span className={styles.instruction}>
                    Make sentences about places you know.
                  </span>
                </div>
                <div style={{ fontStyle: 'italic', color: '#0369a1', fontSize: '0.85rem' }}>
                  Examples: <em>There&apos;s a big train station in my city.</em> • <em>The café in my town is expensive.</em>
                </div>
                <textarea
                  className={`${styles.notesTextarea} ${isDiff(origEx4, ex4.value) ? styles.diffHighlight : ''}`}
                  placeholder="Write your sentences here..."
                  value={ex4.value}
                  onChange={(e) => ex4.setValue(e.target.value)}
                  disabled={isReadOnly}
                  rows={3}
                />
              </div>
            </div>

            {/* ================= RIGHT COLUMN: READING ================= */}
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>Reading</h2>

              {/* Ex 5: Welcome to North Norfolk */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>5</span>
                  <span className={styles.instruction}>
                    Read the text and match places 1–3 with photos A–C. Click images to zoom.
                  </span>
                </div>

                {/* Authentic Textbook Reading Material */}
                <div
                  className={styles.readingCardWrap}
                  onClick={() =>
                    setPreviewImage({
                      src: '/images/lesson3c/north_norfolk.png',
                      alt: 'Welcome to North Norfolk travel guide brochure',
                    })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    setPreviewImage({
                      src: '/images/lesson3c/north_norfolk.png',
                      alt: 'Welcome to North Norfolk travel guide brochure',
                    })
                  }
                  aria-label="Enlarge North Norfolk Guide"
                >
                  <div className={styles.cardTopLabel}>
                    <span>Welcome to North Norfolk!</span>
                    <span style={{ fontSize: '0.7rem' }}>Text &amp; Map 🔍</span>
                  </div>
                  <Image
                    src="/images/lesson3c/north_norfolk.png"
                    alt="Welcome to North Norfolk brochure with map and texts for 1 West Runton, 2 Sheringham, and 3 Cromer"
                    width={480}
                    height={740}
                    unoptimized
                    priority
                  />
                  <div className={styles.zoomOverlay}>🔍 Click to zoom</div>
                </div>

                {/* Accessible text transcript */}
                <details className={styles.norfolkCard} style={{ marginTop: '0.5rem' }}>
                  <summary className={styles.norfolkHeader} style={{ cursor: 'pointer' }}>
                    <span>📖 Text transcript (1 West Runton, 2 Sheringham, 3 Cromer)</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'normal' }}>Click to view text</span>
                  </summary>
                  <div className={styles.townsList}>
                    <div className={styles.townItem}>
                      <h4>1 West Runton</h4>
                      <p>This is a quiet town. There is a café, a good restaurant and six small shops. There are no hotels. There is a small train station.</p>
                    </div>

                    <div className={styles.townItem}>
                      <h4>2 Sheringham</h4>
                      <p>This town is busy. It&apos;s big! There is a good market on Saturdays, and there are coffee shops, cheap bookshops and more small shops. There are hotels, restaurants and cafés. There is also a park.</p>
                    </div>

                    <div className={styles.townItem}>
                      <h4>3 Cromer</h4>
                      <p>This town is good for holidays. It isn&apos;t expensive. There are cheap shops and restaurants here. There is an old cinema and there is a big hotel in the centre.</p>
                    </div>
                  </div>
                </details>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    Match places 1–3 to Photos A–C:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewImage({
                        src: '/images/lesson3c/cromer_photos.png',
                        alt: 'Photos A (railway station), B (hotel), C (clock tower)',
                      })
                    }
                    className={styles.tfBtn}
                    style={{ fontSize: '0.775rem', padding: '0.25rem 0.6rem', color: '#0369a1', borderColor: '#7dd3fc' }}
                  >
                    🖼️ View Photos A, B, C
                  </button>
                </div>

                {/* Matching selectors */}
                <div className={styles.matchGrid}>
                  {PLACES_MATCHING_ITEMS.map((item) => {
                    const ver = getFieldVerify('exercise_5_places_matching', item.key);
                    const currentVal = ex5.value[item.key] || '';
                    const isFieldDiff = isDiff(origEx5[item.key], currentVal);
                    return (
                      <div key={item.key} className={styles.matchRow}>
                        <span style={{ fontWeight: 800, color: '#0369a1' }}>{item.key}:</span>
                        <select
                          value={currentVal}
                          onChange={(e) => ex5.setField(item.key, e.target.value)}
                          disabled={isReadOnly}
                          className={`${styles.selectInput} ${getInputClass(ver)} ${isFieldDiff ? styles.diffHighlight : ''}`}
                        >
                          <option value="">– match place –</option>
                          {TOWNS_OPTIONS.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        {isReview && ver?.hasKey && ver.isCorrect && (
                          <span className={styles.correctBadge} title="Correct">✓</span>
                        )}
                        {isReview && ver && !ver.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={ver} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Divider between Vocabulary/Reading and Grammar/Speaking */}
          <div className={styles.partDivider} role="separator" aria-label="Grammar & Speaking section">
            <div className={styles.partDividerLine} />
            <span className={styles.partDividerBadge}>Grammar &amp; Speaking</span>
            <div className={styles.partDividerLine} />
          </div>

          {/* ================= PART 2: GRAMMAR & SPEAKING ================= */}
          <div className={styles.twoColLayout}>
            {/* ================= LEFT COLUMN: GRAMMAR ================= */}
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>Grammar</h2>

              {/* Ex 6: True / False */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>6</span>
                  <span className={styles.instruction}>
                    Read the text again. Are the sentences true (T) or false (F)?
                  </span>
                </div>

                <div className={styles.tfList}>
                  {TF_ITEMS.map((item) => {
                    const val = ex6.value[item.id] || '';
                    const ver = getFieldVerify('exercise_6_true_false', item.id);
                    const isItemDiff = isDiff(origEx6[item.id], val);
                    return (
                      <div key={item.id} className={styles.tfItem}>
                        <span className={styles.tfSentence}>{item.text}</span>
                        <div className={styles.tfButtons}>
                          <button
                            type="button"
                            onClick={() => !isReadOnly && ex6.setField(item.id, 'T')}
                            className={`${styles.tfBtn} ${val === 'T' ? styles.tfBtnSelected : ''} ${
                              isItemDiff && val === 'T' ? styles.diffHighlight : ''
                            }`}
                          >
                            T
                          </button>
                          <button
                            type="button"
                            onClick={() => !isReadOnly && ex6.setField(item.id, 'F')}
                            className={`${styles.tfBtn} ${val === 'F' ? styles.tfBtnSelected : ''} ${
                              isItemDiff && val === 'F' ? styles.diffHighlight : ''
                            }`}
                          >
                            F
                          </button>
                          {isReview && val && ver?.hasKey && ver.isCorrect && (
                            <span className={styles.correctBadge} title="Correct">✓</span>
                          )}
                        </div>
                        {isReview && val && ver && !ver.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={ver} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ex 7: Grammar Box */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>7</span>
                  <span className={styles.instruction}>
                    Position of adjectives
                  </span>
                </div>

                <div className={styles.grammarBox}>
                  <h4>Position of adjectives</h4>

                  <div className={styles.grammarExampleGroup}>
                    <strong>be + adjective:</strong>
                    <p>It&apos;s <strong>big</strong>.</p>
                    <p>It isn&apos;t <strong>expensive</strong>.</p>
                    <p>This town is <strong>busy</strong>.</p>
                  </div>

                  <div className={styles.grammarExampleGroup}>
                    <strong>adjective + noun:</strong>
                    <p>This is a <strong>quiet</strong> town.</p>
                    <p>There&apos;s an <strong>old</strong> cinema.</p>
                    <p>There are <strong>cheap</strong> shops and restaurants.</p>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#166534', background: '#dcfce7', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
                    💡 <em>Remember:</em> Adjectives go before nouns and don&apos;t change in the plural (<em>cheap shops</em>, not <em>cheaps shops</em>).
                  </div>
                </div>

                {/* Photos A, B, C from textbook Page 27 */}
                <div
                  className={styles.readingCardWrap}
                  onClick={() =>
                    setPreviewImage({
                      src: '/images/lesson3c/cromer_photos.png',
                      alt: 'Photos A (railway station), B (hotel), C (clock tower)',
                    })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    setPreviewImage({
                      src: '/images/lesson3c/cromer_photos.png',
                      alt: 'Photos A (railway station), B (hotel), C (clock tower)',
                    })
                  }
                  aria-label="Enlarge Photos A, B, C"
                  style={{ marginTop: '0.65rem' }}
                >
                  <div className={styles.photosTopLabel}>
                    <span>Photos A, B, C (West Runton, Cromer, Sheringham)</span>
                    <span style={{ fontSize: '0.7rem' }}>🔍 Zoom</span>
                  </div>
                  <Image
                    src="/images/lesson3c/cromer_photos.png"
                    alt="Photos A (railway station), B (hotel building), C (clock tower street)"
                    width={425}
                    height={652}
                    unoptimized
                  />
                  <div className={styles.zoomOverlay}>🔍 Click to zoom</div>
                </div>
              </div>

              {/* Ex 8: Pronunciation (Audio 3.13) */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>8</span>
                  <span className={styles.exLetter}>a</span>
                  <span className={styles.instruction}>
                    Listen and notice the stressed words. Listen again and repeat.
                  </span>
                </div>

                <div className={styles.audioActionRow}>
                  <button
                    type="button"
                    onClick={() => playAudio?.('3.13')}
                    className={`${styles.audioBtn} ${playingAudio === '3.13' ? styles.audioBtnActive : ''}`}
                    aria-label="Play Audio 3.13"
                  >
                    {playingAudio === '3.13' ? (
                      <>
                        <div className={styles.equalizer}>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                        </div>
                        <span>Playing 3.13</span>
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        <span>Audio 3.13</span>
                      </>
                    )}
                  </button>
                  <span className={styles.audioHint}>Listen and underline the stressed words</span>
                </div>

                <div className={styles.stressList}>
                  {STRESSED_ITEMS.map((item) => (
                    <div key={item.id} className={styles.stressItem}>
                      <span>
                        {item.id}.{' '}
                        {item.text.split(' ').map((word, wIdx) => {
                          const cleanWord = word.replace(/[.,]/g, '');
                          const isStressed = item.stressed.includes(cleanWord);
                          return isStressed ? (
                            <strong key={wIdx}>{word} </strong>
                          ) : (
                            <span key={wIdx}>{word} </span>
                          );
                        })}
                      </span>
                      <PronounceButton word={item.text} size="small" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: SPEAKING ================= */}
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>Speaking &amp; Writing</h2>

              {/* Ex 9: Word Order */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>9</span>
                  <span className={styles.instruction}>
                    Put the words in the correct order to make sentences.
                  </span>
                </div>

                <div className={styles.orderList}>
                  {WORD_ORDER_ITEMS_3C.map((item) => {
                    const ver = getFieldVerify('exercise_9_word_order', item.id);
                    const currentVal = ex9.value[item.id] || '';
                    const isItemDiff = isDiff(origEx9[item.id], currentVal);
                    return (
                      <div key={item.id} className={styles.orderItem}>
                        <span className={styles.scrambledWords}>{item.id}. {item.words}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                          <input
                            type="text"
                            placeholder="Type the correct sentence..."
                            value={currentVal}
                            onChange={(e) => ex9.setField(item.id, e.target.value)}
                            disabled={isReadOnly}
                            className={`${styles.orderInput} ${getInputClass(ver)} ${
                              isItemDiff ? styles.diffHighlight : ''
                            }`}
                          />
                          {isReview && ver?.hasKey && ver.isCorrect && (
                            <span className={styles.correctBadge} title="Correct">✓</span>
                          )}
                        </div>
                        {isReview && ver && !ver.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={ver} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ex 10: Questions about your town */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>10</span>
                  <span className={styles.instruction}>
                    Complete the questions about places in your town. Use adjectives.
                  </span>
                </div>

                <div className={styles.fillList}>
                  {[
                    { id: '1', pre: '1. Is there a', ph: 'e.g. big park', post: '?', w: '9rem' },
                    { id: '2', pre: '2. Is the', ph: 'e.g. train station busy', post: '?', w: '11rem' },
                    { id: '3', pre: '3. Is there a', ph: 'e.g. good cinema', post: '?', w: '9rem' },
                    { id: '4', pre: '4. Are there any', ph: 'e.g. cheap restaurants', post: ' in your town?', w: '11rem' },
                    { id: '5', pre: "5. Is your town's", ph: 'e.g. centre old', post: '?', w: '9rem' },
                  ].map((f) => (
                    <div key={f.id} className={styles.fillItem}>
                      <span>{f.pre}</span>
                      <input
                        type="text"
                        placeholder={f.ph}
                        value={ex10.value[f.id] || ''}
                        onChange={(e) => ex10.setField(f.id, e.target.value)}
                        disabled={isReadOnly}
                        className={`${styles.inlineInput} ${isDiff(origEx10[f.id], ex10.value[f.id]) ? styles.diffHighlight : ''}`}
                        style={{ width: f.w }}
                      />
                      <span>{f.post}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ex 11 & 12: Speaking preparation */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>11</span>
                  <span className={styles.instruction}>
                    Choose three towns or cities and make notes about shops, restaurants, parks, hotels, cinemas and markets.
                  </span>
                </div>

                <textarea
                  className={`${styles.notesTextarea} ${isDiff(origEx11, ex11.value) ? styles.diffHighlight : ''}`}
                  placeholder="e.g. Town 1: London - busy, big, good museums, expensive hotels..."
                  value={ex11.value}
                  onChange={(e) => ex11.setValue(e.target.value)}
                  disabled={isReadOnly}
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Modal полноэкранного просмотра картинок */}
      {previewImage && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setPreviewImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setPreviewImage(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <Image
              src={previewImage.src}
              alt={previewImage.alt}
              width={900}
              height={800}
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}
