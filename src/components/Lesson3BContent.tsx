'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLessonContext, useExerciseAnswer } from '@/context/LessonContext';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import PronounceButton from '@/components/PronounceButton';
import { LessonAnswerKey, verifyAnswer, getExerciseKey, VerificationResult } from '@/lib/answerVerification';
import styles from './lesson3b.module.scss';

export interface Lesson3BContentProps {
  playAudio?: (track: string) => void;
  playingAudio?: string | null;
}

// Захардкоженный fallbackAnswerKey для полной автономности и мгновенной проверки
export const FALLBACK_ANSWER_KEY_3B: LessonAnswerKey = {
  exercise_2a_matching: {
    A: ['living room'],
    B: ['kitchen'],
    C: ['bedroom'],
    D: ['bathroom'],
    E: ['toilet'],
    F: ['shower'],
    G: ['beds', 'bed'],
    H: ['oven'],
    I: ['lift'],
    J: ['TV', 'tv', 'television'],
    K: ['wifi', 'wi-fi'],
  },
  exercise_5a_flat: {
    answer: ['Flat 3', 'flat 3', '3'],
  },
  exercise_5b_ticks: {
    '1': ['true'],
    '2': ['true'],
    '3': ['true'],
    '4': ['true'],
    '5': ['true'],
    '6': ['true'],
    '8': ['true'],
  },
  exercise_5c_articles: {
    '1': ['a'],
    '2': ['a'],
    '3': ['a'],
    '4': ['an'],
  },
  exercise_6_grammar: {
    '1': ['Is', 'is'],
    '2': ['Are', 'are'],
    '3': ['is'],
    '4': ["isn't", 'is not', 'isnt'],
    '5': ["aren't", 'are not', 'arent'],
    '6': ['are'],
    '7': ['is'],
    '8': ['are'],
  },
  exercise_7a_intonation: {
    '1': ['up', '↑'],
    '2': ['down', '↓'],
    '3': ['up', '↑'],
    '4': ['down', '↓'],
    '5': ['down', '↓'],
    '6': ['down', '↓'],
  },
  exercise_8_conversation: {
    '1': ['are there', 'Are there'],
    '2': ['There are', 'there are'],
    '3': ['Is there', 'is there'],
    '4': ['there is'],
    '5': ['Is there', 'is there'],
    '6': ['there is'],
    '7': ['Are there', 'are there'],
    '8': ["there aren't", 'there are not'],
    '9': ['There is', 'there is'],
    '10': ['Is there', 'is there'],
    '11': ["there isn't", 'there is not'],
  },
  exercise_9a_word_order: {
    '1': ['Where is your house or flat?', 'Where is your flat or house?'],
    '2': ['How many rooms are there?'],
    '3': ['Is there a shower?'],
    '4': ['How many TVs are there?'],
    '5': ['Is there wifi?', 'Is there wi-fi?'],
  },
};

const VOCAB_WORDS = [
  'living room',
  'kitchen',
  'bedroom',
  'bathroom',
  'beds',
  'lift',
  'oven',
  'shower',
  'toilet',
  'TV',
  'wifi',
];

const MATCHING_ITEMS = [
  { key: 'A', label: 'Photo A', type: 'room' },
  { key: 'B', label: 'Photo B', type: 'room' },
  { key: 'C', label: 'Photo C', type: 'room' },
  { key: 'D', label: 'Photo D', type: 'room' },
  { key: 'E', label: 'Icon E', type: 'thing' },
  { key: 'F', label: 'Icon F', type: 'thing' },
  { key: 'G', label: 'Icon G', type: 'thing' },
  { key: 'H', label: 'Icon H', type: 'thing' },
  { key: 'I', label: 'Icon I', type: 'thing' },
  { key: 'J', label: 'Icon J', type: 'thing' },
  { key: 'K', label: 'Icon K', type: 'thing' },
];

const FLATS_DATA = [
  {
    id: 'Flat 1',
    title: 'Flat 1',
    features: ['rooms: two bedrooms, kitchen, living room, bathroom', 'shower', 'oven', 'no wifi'],
  },
  {
    id: 'Flat 2',
    title: 'Flat 2',
    features: ['rooms: bedroom, bathroom', 'two beds', 'TV', 'wifi', 'no shower'],
  },
  {
    id: 'Flat 3',
    title: 'Flat 3 (Correct)',
    features: ['rooms: bedroom, bathroom', 'two beds', 'shower', 'TV', 'no wifi'],
  },
];

const TICK_SENTENCES = [
  { id: '1', text: '1. Are there any flats in Berlin for us?' },
  { id: '2', text: '2. How many beds are there?' },
  { id: '3', text: '3. There are two beds.' },
  { id: '4', text: "4. No, there aren't." },
  { id: '5', text: '5. Is there a bathroom?' },
  { id: '6', text: '6. Yes, there is.' },
  { id: '7', text: "7. No, there isn't." },
  { id: '8', text: "8. There isn't an oven." },
];

const INTONATION_SENTENCES = [
  { id: '1', text: '1. Is there a bathroom?' },
  { id: '2', text: '2. Yes, there is.' },
  { id: '3', text: '3. Are there two beds?' },
  { id: '4', text: '4. Yes, there are.' },
  { id: '5', text: '5. How many rooms are there?' },
  { id: '6', text: '6. There are four rooms.' },
];

const SPEAKING_TABLE_ROWS = [
  'Price per night',
  'Number of rooms',
  'Number of bedrooms',
  'Number of beds',
  'Bathroom (Y/N)',
  'Shower/toilet (Y/N)',
  'Living room (Y/N)',
  'TV (Y/N)',
  'Wifi (Y/N)',
  'Kitchen (Y/N)',
  'Oven (Y/N)',
  'Lift (Y/N)',
];

const WORD_ORDER_ITEMS = [
  { id: '1', words: 'your house or flat / is / Where ?' },
  { id: '2', words: 'are / many / How / there / rooms ?' },
  { id: '3', words: 'a / Is / shower / there ?' },
  { id: '4', words: 'there / are / TVs / many / How ?' },
  { id: '5', words: 'wifi / there / Is ?' },
];

export default function Lesson3BContent({
  playAudio: propPlayAudio,
  playingAudio: propPlayingAudio,
}: Lesson3BContentProps) {
  const context = useLessonContext();
  const playAudio = propPlayAudio || context.playAudio;
  const playingAudio = propPlayingAudio ?? context.playingAudio;
  const isReadOnly = context.isReadOnly;

  // Упражнения через централизованный хук
  const ex1 = useExerciseAnswer<string>('exercise_1_objects', '');
  const ex2a = useExerciseAnswer<Record<string, string>>('exercise_2a_matching', {});
  const ex3 = useExerciseAnswer<Record<string, string>>('exercise_3_questions', {});
  const ex4 = useExerciseAnswer<string>('exercise_4_sentences', '');
  const ex5a = useExerciseAnswer<string>('exercise_5a_flat', '');
  const ex5b = useExerciseAnswer<Record<string, boolean>>('exercise_5b_ticks', {});
  const ex5c = useExerciseAnswer<Record<string, string>>('exercise_5c_articles', {});

  const ex6 = useExerciseAnswer<Record<string, string>>('exercise_6_grammar', {});
  const ex7a = useExerciseAnswer<Record<string, string>>('exercise_7a_intonation', {});
  const ex8 = useExerciseAnswer<Record<string, string>>('exercise_8_conversation', {});
  const ex9a = useExerciseAnswer<Record<string, string>>('exercise_9a_word_order', {});
  const ex10 = useExerciseAnswer<Record<string, { flat1?: string; flat2?: string }>>('exercise_10_holiday_flats', {});

  const getInputClass = (status?: string) => {
    if (status === 'correct') return styles.inputValid;
    if (status === 'incorrect') return styles.inputInvalid;
    return '';
  };

  // Гарантированная верификация: берем ключи из контекста или локального FALLBACK_ANSWER_KEY_3B
  const getFieldVerify = (exerciseKey: string, fieldKey: string): VerificationResult | null => {
    const fromCtx = context.getVerification(exerciseKey, fieldKey);
    if (fromCtx) return fromCtx;

    const exKey = getExerciseKey(FALLBACK_ANSWER_KEY_3B, exerciseKey);
    if (!exKey) return null;

    const studentEx = context.getAnswer(exerciseKey);
    const studentVal =
      studentEx && typeof studentEx === 'object'
        ? (studentEx as Record<string, unknown>)[fieldKey]
        : undefined;
    const expected = exKey[fieldKey];
    return verifyAnswer(studentVal, expected);
  };

  return (
    <div className={styles.pageContainer}>
      <motion.article
        className={styles.textbookPage}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Banner 3B */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge3B} aria-label="Unit 3, Lesson B">
              <span>3</span>
              <span className={styles.letterB}>B</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>Is there wifi?</h1>
            </div>
          </div>

          <div className={styles.goalsCard}>
            <p>› <strong>Goal:</strong> talk about a flat</p>
            <p>› <strong>Grammar:</strong> <em>Is there a/an ...? / Are there any ...?</em> | <em>There is a table.</em></p>
            <p>› <strong>Vocabulary:</strong> rooms and things in a home</p>
          </div>
        </header>

        <div className={styles.contentBody}>
          {/* ================= PART 1: VOCABULARY & LISTENING ================= */}
          <div className={styles.twoColLayout}>
            {/* ================= LEFT COLUMN: VOCABULARY ================= */}
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>Vocabulary</h2>

              {/* Ex 1 */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>1</span>
                  <span className={styles.instruction}>
                    Look at photos A–D. What objects can you see?
                  </span>
                </div>
                <div style={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>
                  Example: <em>There is a table.</em>
                </div>
                <textarea
                  className={styles.notesTextarea}
                  placeholder="e.g. There is a table. There is a sofa. There are lamps..."
                  value={ex1.value}
                  onChange={(e) => ex1.setValue(e.target.value)}
                  disabled={isReadOnly}
                  rows={2}
                />
              </div>

              {/* Ex 2a: Matching */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>2</span>
                  <span className={styles.exLetter}>a</span>
                  <span className={styles.instruction}>
                    Match A–K with the words in the box.
                  </span>
                </div>

                {/* Word Box */}
                <div className={styles.wordBox}>
                  <div className={styles.wordBoxGroup}>
                    <strong>Rooms:</strong> bathroom • bedroom • kitchen • living room
                  </div>
                  <div className={styles.wordBoxGroup}>
                    <strong>Things:</strong> beds • lift • oven • shower • toilet • TV • wifi
                  </div>
                </div>

                {/* Ex 2b: Audio 3.4 */}
                <div className={styles.audioActionRow}>
                  <button
                    type="button"
                    onClick={() => playAudio?.('3.4')}
                    className={`${styles.audioBtn} ${playingAudio === '3.4' ? styles.audioBtnActive : ''}`}
                    aria-label="Play Audio 3.4"
                  >
                    {playingAudio === '3.4' ? (
                      <>
                        <div className={styles.equalizer}>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                        </div>
                        <span>Playing 3.4</span>
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        <span>Audio 3.4</span>
                      </>
                    )}
                  </button>
                  <span className={styles.audioHint}>Listen &amp; repeat vocabulary</span>
                </div>

                {/* Pronounce Chips */}
                <div className={styles.pronounceChipGrid}>
                  {VOCAB_WORDS.map((word) => (
                    <div key={word} className={styles.pronounceChip}>
                      <span>{word}</span>
                      <PronounceButton word={word} size="small" />
                    </div>
                  ))}
                </div>

                {/* CITY FLAT, BRIGHTON CARD */}
                <div className={styles.flatCardBrighton}>
                  <div className={styles.flatCardBrightonHeader}>
                    <div className={styles.flatTitle}>CITY FLAT, BRIGHTON ★★★★</div>
                    <div className={styles.flatPrice}>£80 per night</div>
                  </div>

                  {/* Cut graphic from textbook */}
                  <div className={styles.flatImageWrap}>
                    <Image
                      src="/images/lesson3b/flat_block.png"
                      alt="City Flat Brighton: photos A-D (living room, kitchen, bedroom, bathroom) and icons E-K (toilet, shower, bed, oven, lift, TV, wifi)"
                      width={480}
                      height={400}
                      unoptimized
                    />
                  </div>

                  {/* Matching inputs A-K */}
                  <div className={styles.matchingGrid}>
                    {MATCHING_ITEMS.map((item) => {
                      const ver = getFieldVerify('exercise_2a_matching', item.key);
                      return (
                        <div key={item.key} className={styles.matchRow}>
                          <span className={styles.matchKey}>{item.key}</span>
                          <span className={styles.matchLabel}>{item.label}:</span>
                          <select
                            value={ex2a.value[item.key] || ''}
                            onChange={(e) => ex2a.setField(item.key, e.target.value)}
                            disabled={isReadOnly}
                            className={`${styles.selectInput} ${getInputClass(ver?.status)}`}
                          >
                            <option value="">– choose –</option>
                            {VOCAB_WORDS.map((w) => (
                              <option key={w} value={w}>
                                {w}
                              </option>
                            ))}
                          </select>
                          {ex2a.isReview && <TeacherAnswerBadge result={ver} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Ex 3: Pair work */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>3</span>
                  <span className={styles.instruction}>
                    Work in pairs. Ask and answer the questions about the flat in Exercise 1.
                  </span>
                </div>
                <div className={styles.qaList}>
                  <div className={styles.qaItem}>
                    <div className={styles.qaQuestion}>
                      1. Where is the clock?
                      <PronounceButton word="Where is the clock?" size="small" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. It is in the kitchen on the wall."
                      value={ex3.value['1'] || ''}
                      onChange={(e) => ex3.setField('1', e.target.value)}
                      disabled={isReadOnly}
                      className={styles.textInput}
                    />
                  </div>
                  <div className={styles.qaItem}>
                    <div className={styles.qaQuestion}>
                      2. What is in the bathroom?
                      <PronounceButton word="What is in the bathroom?" size="small" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. There is a shower and a toilet."
                      value={ex3.value['2'] || ''}
                      onChange={(e) => ex3.setField('2', e.target.value)}
                      disabled={isReadOnly}
                      className={styles.textInput}
                    />
                  </div>
                  <div className={styles.qaItem}>
                    <div className={styles.qaQuestion}>
                      3. Where is the oven?
                      <PronounceButton word="Where is the oven?" size="small" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. It is in the kitchen."
                      value={ex3.value['3'] || ''}
                      onChange={(e) => ex3.setField('3', e.target.value)}
                      disabled={isReadOnly}
                      className={styles.textInput}
                    />
                  </div>
                  <div className={styles.qaItem}>
                    <div className={styles.qaQuestion}>
                      4. What is in the living room?
                      <PronounceButton word="What is in the living room?" size="small" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. There is a lamp, a table, and a TV."
                      value={ex3.value['4'] || ''}
                      onChange={(e) => ex3.setField('4', e.target.value)}
                      disabled={isReadOnly}
                      className={styles.textInput}
                    />
                  </div>
                  <div className={styles.qaItem}>
                    <div className={styles.qaQuestion}>
                      5. What is in the bedroom?
                      <PronounceButton word="What is in the bedroom?" size="small" />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. There are two beds."
                      value={ex3.value['5'] || ''}
                      onChange={(e) => ex3.setField('5', e.target.value)}
                      disabled={isReadOnly}
                      className={styles.textInput}
                    />
                  </div>
                </div>
              </div>

              {/* Ex 4: Memory check */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>4</span>
                  <span className={styles.instruction}>
                    Close your book and make sentences about the flat.
                  </span>
                </div>
                <div style={{ fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>
                  Example: <em>There are two beds in the bedroom.</em>
                </div>
                <textarea
                  className={styles.notesTextarea}
                  placeholder="Type your sentences from memory..."
                  value={ex4.value}
                  onChange={(e) => ex4.setValue(e.target.value)}
                  disabled={isReadOnly}
                  rows={2}
                />
              </div>
            </div>

            {/* ================= RIGHT COLUMN: LISTENING ================= */}
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>Listening</h2>

              {/* Ex 5a: Audio 3.5 & Flat 1-3 */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>5</span>
                  <span className={styles.exLetter}>a</span>
                  <span className={styles.instruction}>
                    Listen to a conversation between two friends, Jakub and William. Choose the correct flat.
                  </span>
                </div>

                <div className={styles.audioActionRow}>
                  <button
                    type="button"
                    onClick={() => playAudio?.('3.5')}
                    className={`${styles.audioBtn} ${playingAudio === '3.5' ? styles.audioBtnActive : ''}`}
                    aria-label="Play Audio 3.5"
                  >
                    {playingAudio === '3.5' ? (
                      <>
                        <div className={styles.equalizer}>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                        </div>
                        <span>Playing 3.5</span>
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        <span>Audio 3.5</span>
                      </>
                    )}
                  </button>
                  <span className={styles.audioHint}>Listen to Jakub &amp; William</span>
                </div>

                <div className={styles.flatsList}>
                  {FLATS_DATA.map((flat) => {
                    const isSelected = ex5a.value === flat.id;
                    return (
                      <div
                        key={flat.id}
                        onClick={() => !isReadOnly && ex5a.setValue(flat.id)}
                        className={`${styles.flatCard} ${isSelected ? styles.flatCardSelected : ''}`}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                      >
                        <div className={styles.flatCardHeader}>{flat.title}</div>
                        <div className={styles.flatCardBody}>
                          {flat.features.map((f, i) => (
                            <p key={i}>• {f}</p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ex 5b: Tick sentences */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>5</span>
                  <span className={styles.exLetter}>b</span>
                  <span className={styles.instruction}>
                    Listen again. Tick the sentences you hear.
                  </span>
                </div>

                <div className={styles.audioActionRow}>
                  <button
                    type="button"
                    onClick={() => playAudio?.('3.5')}
                    className={`${styles.audioBtn} ${playingAudio === '3.5' ? styles.audioBtnActive : ''}`}
                    aria-label="Re-play Audio 3.5"
                  >
                    {playingAudio === '3.5' ? (
                      <>
                        <div className={styles.equalizer}>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                        </div>
                        <span>Playing 3.5</span>
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        <span>Audio 3.5 (Listen again)</span>
                      </>
                    )}
                  </button>
                  <span className={styles.audioHint}>Re-listen to tick the sentences</span>
                </div>

                <div className={styles.checkboxList}>
                  {TICK_SENTENCES.map((item) => {
                    const checked = !!ex5b.value[item.id];
                    return (
                      <label key={item.id} className={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (isReadOnly) return;
                            ex5b.setField(item.id, e.target.checked);
                          }}
                          disabled={isReadOnly}
                        />
                        <span>{item.text}</span>
                        <PronounceButton word={item.text.replace(/^\d+\.\s*/, '')} size="small" />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Ex 5c: a and an */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>5</span>
                  <span className={styles.exLetter}>c</span>
                  <span className={styles.instruction}>
                    Look at Exercises 5a and 5b again. Complete the sentences with <em>a</em> and <em>an</em>.
                  </span>
                </div>

                <div className={styles.fillSentencesBox}>
                  <p>
                    There is{' '}
                    <input
                      type="text"
                      value={ex5c.value['1'] || ''}
                      onChange={(e) => ex5c.setField('1', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_5c_articles', '1')?.status)}`}
                      placeholder="a/an"
                    />{' '}
                    bathroom,{' '}
                    <input
                      type="text"
                      value={ex5c.value['2'] || ''}
                      onChange={(e) => ex5c.setField('2', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_5c_articles', '2')?.status)}`}
                      placeholder="a/an"
                    />{' '}
                    shower and{' '}
                    <input
                      type="text"
                      value={ex5c.value['3'] || ''}
                      onChange={(e) => ex5c.setField('3', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_5c_articles', '3')?.status)}`}
                      placeholder="a/an"
                    />{' '}
                    TV. There isn&apos;t{' '}
                    <input
                      type="text"
                      value={ex5c.value['4'] || ''}
                      onChange={(e) => ex5c.setField('4', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_5c_articles', '4')?.status)}`}
                      placeholder="a/an"
                    />{' '}
                    oven.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Divider between parts */}
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

              {/* Ex 6: Grammar box */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>6</span>
                  <span className={styles.instruction}>
                    Read and complete the grammar box. Use Exercises 5b and 5c to help you.
                  </span>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.grammarTable}>
                    <thead>
                      <tr>
                        <th className={styles.typeCol}>Type</th>
                        <th>Singular</th>
                        <th>Plural</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={styles.typeCol}>?</td>
                        <td>
                          <strong>1.</strong>{' '}
                          <input
                            type="text"
                            value={ex6.value['1'] || ''}
                            onChange={(e) => ex6.setField('1', e.target.value)}
                            disabled={isReadOnly}
                            className={`${styles.tableInput} ${getInputClass(getFieldVerify('exercise_6_grammar', '1')?.status)}`}
                            placeholder="Is"
                          />{' '}
                          there a shower?
                        </td>
                        <td>
                          <strong>2.</strong>{' '}
                          <input
                            type="text"
                            value={ex6.value['2'] || ''}
                            onChange={(e) => ex6.setField('2', e.target.value)}
                            disabled={isReadOnly}
                            className={`${styles.tableInput} ${getInputClass(getFieldVerify('exercise_6_grammar', '2')?.status)}`}
                            placeholder="Are"
                          />{' '}
                          there any flats?
                        </td>
                      </tr>
                      <tr>
                        <td className={styles.typeCol}>+</td>
                        <td>
                          Yes, there <strong>3.</strong>{' '}
                          <input
                            type="text"
                            value={ex6.value['3'] || ''}
                            onChange={(e) => ex6.setField('3', e.target.value)}
                            disabled={isReadOnly}
                            className={`${styles.tableInput} ${getInputClass(getFieldVerify('exercise_6_grammar', '3')?.status)}`}
                            placeholder="is"
                          />.
                        </td>
                        <td>Yes, there are.</td>
                      </tr>
                      <tr>
                        <td className={styles.typeCol}>-</td>
                        <td>
                          No, there <strong>4.</strong>{' '}
                          <input
                            type="text"
                            value={ex6.value['4'] || ''}
                            onChange={(e) => ex6.setField('4', e.target.value)}
                            disabled={isReadOnly}
                            className={`${styles.tableInput} ${getInputClass(getFieldVerify('exercise_6_grammar', '4')?.status)}`}
                            placeholder="isn't"
                          />.<br />
                          <small style={{ color: '#64748b' }}>(= No, there is not.)</small>
                        </td>
                        <td>
                          No, there <strong>5.</strong>{' '}
                          <input
                            type="text"
                            value={ex6.value['5'] || ''}
                            onChange={(e) => ex6.setField('5', e.target.value)}
                            disabled={isReadOnly}
                            className={`${styles.tableInput} ${getInputClass(getFieldVerify('exercise_6_grammar', '5')?.status)}`}
                            placeholder="aren't"
                          />.<br />
                          <small style={{ color: '#64748b' }}>(= No, there are not.)</small>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* BUT note */}
                <div style={{ background: '#f1f5f9', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                  <strong>BUT:</strong> <em>Is there wifi?</em> (uncountable noun)
                </div>

                {/* with How many */}
                <div style={{ background: '#f0fdf4', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #bbf7d0', fontSize: '0.875rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#166534' }}>with How many:</div>
                  <p style={{ margin: '0 0 0.35rem 0' }}>
                    How many bedrooms <strong>6.</strong>{' '}
                    <input
                      type="text"
                      value={ex6.value['6'] || ''}
                      onChange={(e) => ex6.setField('6', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_6_grammar', '6')?.status)}`}
                      placeholder="are"
                      style={{ width: '4rem' }}
                    />{' '}
                    there?
                  </p>
                  <p style={{ margin: '0 0 0.35rem 0' }}>
                    There <strong>7.</strong>{' '}
                    <input
                      type="text"
                      value={ex6.value['7'] || ''}
                      onChange={(e) => ex6.setField('7', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_6_grammar', '7')?.status)}`}
                      placeholder="is"
                      style={{ width: '3.5rem' }}
                    />{' '}
                    one.
                  </p>
                  <p style={{ margin: 0 }}>
                    There <strong>8.</strong>{' '}
                    <input
                      type="text"
                      value={ex6.value['8'] || ''}
                      onChange={(e) => ex6.setField('8', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_6_grammar', '8')?.status)}`}
                      placeholder="are"
                      style={{ width: '3.5rem' }}
                    />{' '}
                    two.
                  </p>
                </div>
              </div>

              {/* Ex 7a: Intonation (up / down) */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>7</span>
                  <span className={styles.exLetter}>a</span>
                  <span className={styles.instruction}>
                    Listen to the sentences. Does the speaker&apos;s voice go up (↑) or down (↓) at the end? Choose the correct alternative.
                  </span>
                </div>

                <div className={styles.audioActionRow}>
                  <button
                    type="button"
                    onClick={() => playAudio?.('3.6')}
                    className={`${styles.audioBtn} ${playingAudio === '3.6' ? styles.audioBtnActive : ''}`}
                    aria-label="Play Audio 3.6"
                  >
                    {playingAudio === '3.6' ? (
                      <>
                        <div className={styles.equalizer}>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                        </div>
                        <span>Playing 3.6</span>
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        <span>Audio 3.6</span>
                      </>
                    )}
                  </button>
                  <span className={styles.audioHint}>Listen and check intonation</span>
                </div>

                <div className={styles.intonationList}>
                  {INTONATION_SENTENCES.map((item) => {
                    const selected = ex7a.value[item.id] || '';
                    const ver = getFieldVerify('exercise_7a_intonation', item.id);
                    return (
                      <div key={item.id} className={styles.intonationItem}>
                        <span className={styles.intonationText}>{item.text}</span>
                        <div className={styles.intonationButtons}>
                          <button
                            type="button"
                            onClick={() => !isReadOnly && ex7a.setField(item.id, 'up')}
                            className={`${styles.chipBtn} ${selected === 'up' ? styles.chipBtnSelected : ''}`}
                            title="Voice goes up ↑"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => !isReadOnly && ex7a.setField(item.id, 'down')}
                            className={`${styles.chipBtn} ${selected === 'down' ? styles.chipBtnSelected : ''}`}
                            title="Voice goes down ↓"
                          >
                            ↓
                          </button>
                          {ex7a.isReview && <TeacherAnswerBadge result={ver} />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Ex 7b: Listen and repeat */}
                <div className={styles.exerciseHeader} style={{ marginTop: '1.25rem' }}>
                  <span className={styles.exLetter}>b</span>
                  <span className={styles.instruction}>
                    Listen again and repeat.
                  </span>
                </div>

                <div className={styles.audioActionRow}>
                  <button
                    type="button"
                    onClick={() => playAudio?.('3.7')}
                    className={`${styles.audioBtn} ${playingAudio === '3.7' ? styles.audioBtnActive : ''}`}
                    aria-label="Play Audio 3.7"
                  >
                    {playingAudio === '3.7' ? (
                      <>
                        <div className={styles.equalizer}>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                        </div>
                        <span>Playing 3.7</span>
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        <span>Audio 3.7 (Listen & Repeat)</span>
                      </>
                    )}
                  </button>
                  <span className={styles.audioHint}>Listen and repeat with intonation</span>
                </div>
              </div>

              {/* Ex 8: Conversation */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>8</span>
                  <span className={styles.instruction}>
                    Complete the conversation. Listen and check.
                  </span>
                </div>

                <div className={styles.audioActionRow}>
                  <button
                    type="button"
                    onClick={() => playAudio?.('3.8')}
                    className={`${styles.audioBtn} ${playingAudio === '3.8' ? styles.audioBtnActive : ''}`}
                    aria-label="Play Audio 3.8"
                  >
                    {playingAudio === '3.8' ? (
                      <>
                        <div className={styles.equalizer}>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                        </div>
                        <span>Playing 3.8</span>
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        <span>Audio 3.8 (Listen & Check)</span>
                      </>
                    )}
                  </button>
                  <span className={styles.audioHint}>Check your answers with the recording</span>
                </div>

                <div className={styles.dialogueBox}>
                  <div className={styles.speakerLine}>
                    <strong>William:</strong> Look. This flat is £60 per night!
                  </div>
                  <div className={styles.speakerLine}>
                    <strong>Jakub:</strong> Great! How many rooms <strong>1.</strong>{' '}
                    <input
                      type="text"
                      value={ex8.value['1'] || ''}
                      onChange={(e) => ex8.setField('1', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_8_conversation', '1')?.status)}`}
                      placeholder="are there"
                      style={{ width: '6.5rem' }}
                    />?
                  </div>
                  <div className={styles.speakerLine}>
                    <strong>William:</strong> <strong>2.</strong>{' '}
                    <input
                      type="text"
                      value={ex8.value['2'] || ''}
                      onChange={(e) => ex8.setField('2', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_8_conversation', '2')?.status)}`}
                      placeholder="There are"
                      style={{ width: '6.5rem' }}
                    />{' '}
                    five rooms: two bedrooms, a living room, a kitchen and a bathroom.
                  </div>
                  <div className={styles.speakerLine}>
                    <strong>Jakub:</strong> Wow! <strong>3.</strong>{' '}
                    <input
                      type="text"
                      value={ex8.value['3'] || ''}
                      onChange={(e) => ex8.setField('3', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_8_conversation', '3')?.status)}`}
                      placeholder="Is there"
                      style={{ width: '5.5rem' }}
                    />{' '}
                    a shower?
                  </div>
                  <div className={styles.speakerLine}>
                    <strong>William:</strong> Yes, <strong>4.</strong>{' '}
                    <input
                      type="text"
                      value={ex8.value['4'] || ''}
                      onChange={(e) => ex8.setField('4', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_8_conversation', '4')?.status)}`}
                      placeholder="there is"
                      style={{ width: '5.5rem' }}
                    />.
                  </div>
                  <div className={styles.speakerLine}>
                    <strong>Jakub:</strong> <strong>5.</strong>{' '}
                    <input
                      type="text"
                      value={ex8.value['5'] || ''}
                      onChange={(e) => ex8.setField('5', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_8_conversation', '5')?.status)}`}
                      placeholder="Is there"
                      style={{ width: '5.5rem' }}
                    />{' '}
                    wifi?
                  </div>
                  <div className={styles.speakerLine}>
                    <strong>William:</strong> Yes, <strong>6.</strong>{' '}
                    <input
                      type="text"
                      value={ex8.value['6'] || ''}
                      onChange={(e) => ex8.setField('6', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_8_conversation', '6')?.status)}`}
                      placeholder="there is"
                      style={{ width: '5.5rem' }}
                    />.
                  </div>
                  <div className={styles.speakerLine}>
                    <strong>Jakub:</strong> <strong>7.</strong>{' '}
                    <input
                      type="text"
                      value={ex8.value['7'] || ''}
                      onChange={(e) => ex8.setField('7', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_8_conversation', '7')?.status)}`}
                      placeholder="Are there"
                      style={{ width: '6rem' }}
                    />{' '}
                    TVs in the bedrooms?
                  </div>
                  <div className={styles.speakerLine}>
                    <strong>William:</strong> No, <strong>8.</strong>{' '}
                    <input
                      type="text"
                      value={ex8.value['8'] || ''}
                      onChange={(e) => ex8.setField('8', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_8_conversation', '8')?.status)}`}
                      placeholder="there aren't"
                      style={{ width: '7rem' }}
                    />. <strong>9.</strong>{' '}
                    <input
                      type="text"
                      value={ex8.value['9'] || ''}
                      onChange={(e) => ex8.setField('9', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_8_conversation', '9')?.status)}`}
                      placeholder="There is"
                      style={{ width: '5.5rem' }}
                    />{' '}
                    a TV in the living room.
                  </div>
                  <div className={styles.speakerLine}>
                    <strong>Jakub:</strong> <strong>10.</strong>{' '}
                    <input
                      type="text"
                      value={ex8.value['10'] || ''}
                      onChange={(e) => ex8.setField('10', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_8_conversation', '10')?.status)}`}
                      placeholder="Is there"
                      style={{ width: '5.5rem' }}
                    />{' '}
                    a lift?
                  </div>
                  <div className={styles.speakerLine}>
                    <strong>William:</strong> No, <strong>11.</strong>{' '}
                    <input
                      type="text"
                      value={ex8.value['11'] || ''}
                      onChange={(e) => ex8.setField('11', e.target.value)}
                      disabled={isReadOnly}
                      className={`${styles.inlineInput} ${getInputClass(getFieldVerify('exercise_8_conversation', '11')?.status)}`}
                      placeholder="there isn't"
                      style={{ width: '6.5rem' }}
                    />.
                  </div>
                  <div className={styles.speakerLine}>
                    <strong>Jakub:</strong> Oh.
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: SPEAKING ================= */}
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>Speaking</h2>

              {/* Ex 9a: Word order */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>9</span>
                  <span className={styles.exLetter}>a</span>
                  <span className={styles.instruction}>
                    Put the words in the correct order to make questions.
                  </span>
                </div>

                <div className={styles.orderList}>
                  {WORD_ORDER_ITEMS.map((item) => {
                    const ver = getFieldVerify('exercise_9a_word_order', item.id);
                    return (
                      <div key={item.id} className={styles.orderItem}>
                        <span className={styles.scrambledWords}>{item.words}</span>
                        <input
                          type="text"
                          placeholder="Type the question..."
                          value={ex9a.value[item.id] || ''}
                          onChange={(e) => ex9a.setField(item.id, e.target.value)}
                          disabled={isReadOnly}
                          className={`${styles.orderInput} ${getInputClass(ver?.status)}`}
                        />
                        {ex9a.isReview && <TeacherAnswerBadge result={ver} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ex 10: Holiday Flats Table */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>10</span>
                  <span className={styles.instruction}>
                    Look at the table about two holiday flats. Write questions about the flats.
                  </span>
                </div>

                <div style={{ fontStyle: 'italic', color: '#0369a1', fontSize: '0.85rem' }}>
                  Example question: <em>How many beds are there?</em>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.speakingTable}>
                    <thead>
                      <tr>
                        <th>Feature</th>
                        <th>Flat 1</th>
                        <th>Flat 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SPEAKING_TABLE_ROWS.map((rowName) => {
                        const rowKey = rowName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                        const rowVal = ex10.value[rowKey] || {};
                        return (
                          <tr key={rowName}>
                            <td className={styles.labelCell}>{rowName}</td>
                            <td>
                              <input
                                type="text"
                                placeholder="Flat 1 info..."
                                value={rowVal.flat1 || ''}
                                onChange={(e) => {
                                  if (isReadOnly) return;
                                  ex10.setField(rowKey, { ...rowVal, flat1: e.target.value });
                                }}
                                disabled={isReadOnly}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                placeholder="Flat 2 info..."
                                value={rowVal.flat2 || ''}
                                onChange={(e) => {
                                  if (isReadOnly) return;
                                  ex10.setField(rowKey, { ...rowVal, flat2: e.target.value });
                                }}
                                disabled={isReadOnly}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ex 11: Holiday choice & photo */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>11</span>
                  <span className={styles.instruction}>
                    Ask and answer questions with a partner. Choose a flat for your holiday.
                  </span>
                </div>

                <div className={styles.speakingFooter}>
                  <div style={{ flex: 1, fontSize: '0.875rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong>A:</strong> <em>How many beds are there?</em><br />
                      <strong>B:</strong> <em>There are two beds.</em>
                    </p>
                    <p style={{ margin: 0, color: '#64748b' }}>
                      Which flat is better for your holiday in the city? Why?
                    </p>
                  </div>

                  <div className={styles.fujiWrap}>
                    <Image
                      src="/images/lesson3b/city_fuji.png"
                      alt="City view with Mount Fuji in background"
                      width={240}
                      height={192}
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
