'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import PronounceButton from '@/components/PronounceButton';
import { verifyAnswer, getExerciseKey, LessonAnswerKey } from '@/lib/answerVerification';
import styles from './lesson2c.module.scss';

export interface Lesson2CContentProps {
  lesson?: Record<string, unknown> | null;
  user?: Record<string, unknown> | null;
  readOnly?: boolean;
  isTeacherReview?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio: (track: string) => void;
  playingAudio: string | null;

  // Page 18 states
  ex1aMatch?: Record<string, string>;
  ex2Choice?: Record<string, string>;
  ex3aSequence?: string;
  ex4Profiles?: Record<string, { age?: string; from?: string; job?: string }>;

  // Page 19 states
  ex5GrammarRules?: Record<string, string>;
  ex7Questions?: Record<string, string>;
  ex8aFamily?: Record<string, string>;
  ex8bNotes?: string;
  ex10SpeakingNotes?: string;

  // Page 18 handlers
  onEx1aMatchChange?: (num: string, value: string) => void;
  onEx2ChoiceChange?: (item: string, value: string) => void;
  onEx3aSequenceChange?: (value: string) => void;
  onEx4ProfilesChange?: (
    profileKey: string,
    field: 'age' | 'from' | 'job',
    value: string,
  ) => void;

  // Page 19 handlers
  onEx5GrammarRulesChange?: (ruleId: string, value: string) => void;
  onEx7QuestionsChange?: (qId: string, value: string) => void;
  onEx8aFamilyChange?: (idx: string, value: string) => void;
  onEx8bNotesChange?: (value: string) => void;
  onEx10SpeakingNotesChange?: (value: string) => void;

  originalAnswers?: Record<string, unknown>;
  submissionId?: string;
}

const WORDS_BOX = [
  { word: 'eight', isExample: false },
  { word: 'five', isExample: false },
  { word: 'four', isExample: false },
  { word: 'nine', isExample: false },
  { word: 'one', isExample: true },
  { word: 'seven', isExample: false },
  { word: 'six', isExample: false },
  { word: 'ten', isExample: false },
  { word: 'three', isExample: false },
  { word: 'two', isExample: true },
];

const TEAL_NUMBERS = [
  { num: 11, word: 'eleven' },
  { num: 12, word: 'twelve' },
  { num: 13, word: 'thirteen' },
  { num: 14, word: 'fourteen' },
  { num: 15, word: 'fifteen' },
  { num: 16, word: 'sixteen' },
  { num: 17, word: 'seventeen' },
  { num: 18, word: 'eighteen' },
  { num: 19, word: 'nineteen' },
];

const MAGENTA_NUMBERS = [
  { num: 20, word: 'twenty' },
  { num: 30, word: 'thirty' },
  { num: 40, word: 'forty' },
  { num: 50, word: 'fifty' },
  { num: 60, word: 'sixty' },
  { num: 70, word: 'seventy' },
  { num: 80, word: 'eighty' },
  { num: 90, word: 'ninety' },
  { num: 100, word: 'a hundred' },
];

const PAIR_CHOICES = [
  { id: '1', opt1: '13', opt2: '30' },
  { id: '2', opt1: '14', opt2: '40' },
  { id: '3', opt1: '15', opt2: '50' },
  { id: '4', opt1: '16', opt2: '60' },
  { id: '5', opt1: '17', opt2: '70' },
  { id: '6', opt1: '18', opt2: '80' },
  { id: '7', opt1: '19', opt2: '90' },
];

const EX6_SENTENCES = [
  { id: 1, textStart: 'What', blueBe: "'s", textEnd: ' her name?' },
  { id: 2, textStart: 'What', blueBe: "'s", textEnd: ' his name?' },
  { id: 3, textStart: 'What', blueBe: "'s", textEnd: ' her job?' },
  { id: 4, textStart: 'What', blueBe: "'s", textEnd: ' his job?' },
  { id: 5, textStart: 'Where', blueBe: "'s", textEnd: ' she from?' },
  { id: 6, textStart: 'Where', blueBe: "'s", textEnd: ' he from?' },
];

const EX7_ITEMS = [
  { id: '1', answer: "He's from Thailand.", placeholder: "e.g. Where's he from" },
  { id: '2', answer: "He's a doctor.", placeholder: "e.g. What's his job" },
  { id: '3', answer: 'Her name is Lidia Nowicki.', placeholder: "e.g. What's her name" },
  { id: '4', answer: "She's from Kraków in Poland.", placeholder: "e.g. Where's she from" },
  { id: '5', answer: "They're from the US.", placeholder: 'e.g. Where are they from' },
];

export default function Lesson2CContent(props: Lesson2CContentProps) {
  const {
    readOnly = false,
    isTeacherReview = false,
    answerKey = null,
    playAudio,
    playingAudio,

    // Page 18 states
    ex1aMatch = {},
    ex2Choice = {},
    ex3aSequence = '',
    ex4Profiles = {},

    // Page 19 states
    ex5GrammarRules = {},
    ex7Questions = {},
    ex8aFamily = {},
    ex8bNotes = '',
    ex10SpeakingNotes = '',

    // Page 18 handlers
    onEx1aMatchChange = () => {},
    onEx2ChoiceChange = () => {},
    onEx3aSequenceChange = () => {},
    onEx4ProfilesChange = () => {},

    // Page 19 handlers
    onEx5GrammarRulesChange = () => {},
    onEx7QuestionsChange = () => {},
    onEx8aFamilyChange = () => {},
    onEx8bNotesChange = () => {},
    onEx10SpeakingNotesChange = () => {},
  } = props;

  const ex1aKey = getExerciseKey(answerKey, 'exercise_1a_match');
  const ex2Key = getExerciseKey(answerKey, 'exercise_2_choice');
  const ex3aKey = getExerciseKey(answerKey, 'exercise_3a_sequence');
  const ex4Key = getExerciseKey(answerKey, 'exercise_4_profiles');
  const ex5Key = getExerciseKey(answerKey, 'exercise_5_grammar_rules');
  const ex7Key = getExerciseKey(answerKey, 'exercise_7_questions');

  const [zoomedImage, setZoomedImage] = useState<{
    src: string;
    title: string;
  } | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!zoomedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomedImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomedImage]);

  return (
    <div className={styles.pageContainer}>
      {/* ========================================================================= */}
      {/* ===================== PAGE 18: VOCABULARY & LISTENING =================== */}
      {/* ========================================================================= */}
      <section className={styles.textbookPage}>
        {/* Top Section with Title, Goals & 6 Photo Collage */}
        <div className={styles.topSection}>
          <div className={styles.topGrid}>
            {/* Column 1: Header + Goals + Photo 1 */}
            <div className={styles.col1}>
              <div className={styles.headerRow}>
                <div className={styles.unitBadgeWrap}>
                  <div className={styles.unitBadgePolygon} />
                  <div className={styles.badgeContent}>
                    <span className={styles.num2}>2</span>
                    <span className={styles.letterC}>C</span>
                  </div>
                </div>
                <h1 className={styles.titleHeading}>Numbers</h1>
              </div>

              <div className={styles.goalsBox}>
                <div className={styles.goalItem}>
                  <svg
                    className={styles.chevronIcon}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span>
                    <strong>Goal:</strong> ask questions about other people
                  </span>
                </div>
                <div className={styles.goalItem}>
                  <svg
                    className={styles.chevronIcon}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span>
                    <strong>Grammar:</strong> question words with <em>be</em>
                  </span>
                </div>
                <div className={styles.goalItem}>
                  <svg
                    className={styles.chevronIcon}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  <span>
                    <strong>Vocabulary:</strong> numbers 1–100
                  </span>
                </div>
              </div>

              {/* Photo 1: Running track */}
              <div
                className={`${styles.photoCard} ${styles.photoCard1}`}
                onClick={() =>
                  setZoomedImage({
                    src: '/images/lesson2c/photo1.png',
                    title: 'Photo 1: Running Track (1)',
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomedImage({
                      src: '/images/lesson2c/photo1.png',
                      title: 'Photo 1: Running Track (1)',
                    });
                  }
                }}
                aria-label="Enlarge Photo 1: Running Track"
              >
                <div className={styles.photoBadge}>1</div>
                <Image
                  src="/images/lesson2c/photo1.png"
                  alt="Photo 1: Running track number 1"
                  width={200}
                  height={215}
                  priority
                />
              </div>
            </div>

            {/* Column 2: Photo 3 (Top) & Photo 2 (Bottom) */}
            <div className={styles.col2}>
              {/* Photo 3: Playing card 3 of Hearts */}
              <div
                className={`${styles.photoCard} ${styles.photoCard3}`}
                onClick={() =>
                  setZoomedImage({
                    src: '/images/lesson2c/photo3.png',
                    title: 'Photo 3: 3 of Hearts Card (3)',
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomedImage({
                      src: '/images/lesson2c/photo3.png',
                      title: 'Photo 3: 3 of Hearts Card (3)',
                    });
                  }
                }}
                aria-label="Enlarge Photo 3: 3 of Hearts"
              >
                <div className={styles.photoBadge}>3</div>
                <Image
                  src="/images/lesson2c/photo3.png"
                  alt="Photo 3: Playing card 3 of hearts"
                  width={150}
                  height={185}
                  priority
                />
              </div>

              {/* Photo 2: Vintage Racecar */}
              <div
                className={`${styles.photoCard} ${styles.photoCard2}`}
                onClick={() =>
                  setZoomedImage({
                    src: '/images/lesson2c/photo2.png',
                    title: 'Photo 2: Vintage Racecar (2)',
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomedImage({
                      src: '/images/lesson2c/photo2.png',
                      title: 'Photo 2: Vintage Racecar (2)',
                    });
                  }
                }}
                aria-label="Enlarge Photo 2: Racecar"
              >
                <div className={styles.photoBadge}>2</div>
                <Image
                  src="/images/lesson2c/photo2.png"
                  alt="Photo 2: Silver racecar with number 2"
                  width={180}
                  height={250}
                  priority
                />
              </div>
            </div>

            {/* Column 3: Photo 4 (Top) & Photo 5 (Middle) & Photo 6 (Bottom) */}
            <div className={styles.col3}>
              {/* Photo 4: Billiard ball 4 */}
              <div
                className={`${styles.photoCard} ${styles.photoCard4}`}
                onClick={() =>
                  setZoomedImage({
                    src: '/images/lesson2c/photo4.png',
                    title: 'Photo 4: Billiard 4 Ball (4)',
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomedImage({
                      src: '/images/lesson2c/photo4.png',
                      title: 'Photo 4: Billiard 4 Ball (4)',
                    });
                  }
                }}
                aria-label="Enlarge Photo 4: Billiard 4 ball"
              >
                <div className={styles.photoBadge}>4</div>
                <Image
                  src="/images/lesson2c/photo4.png"
                  alt="Photo 4: Purple billiard ball 4"
                  width={180}
                  height={185}
                  priority
                />
              </div>

              {/* Photo 5: Hangar wall with big 5 */}
              <div
                className={`${styles.photoCard} ${styles.photoCard5}`}
                onClick={() =>
                  setZoomedImage({
                    src: '/images/lesson2c/photo5.png',
                    title: 'Photo 5: Hangar Door 5 (5)',
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomedImage({
                      src: '/images/lesson2c/photo5.png',
                      title: 'Photo 5: Hangar Door 5 (5)',
                    });
                  }
                }}
                aria-label="Enlarge Photo 5: Hangar wall 5"
              >
                <div className={styles.photoBadge}>5</div>
                <Image
                  src="/images/lesson2c/photo5.png"
                  alt="Photo 5: Orange hangar wall with number 5"
                  width={180}
                  height={135}
                />
              </div>

              {/* Photo 6: Railway sign 6 */}
              <div
                className={`${styles.photoCard} ${styles.photoCard6}`}
                onClick={() =>
                  setZoomedImage({
                    src: '/images/lesson2c/photo6.png',
                    title: 'Photo 6: Railway Sign 6 (6)',
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomedImage({
                      src: '/images/lesson2c/photo6.png',
                      title: 'Photo 6: Railway Sign 6 (6)',
                    });
                  }
                }}
                aria-label="Enlarge Photo 6: Railway sign 6"
              >
                <div className={styles.photoBadge}>6</div>
                <Image
                  src="/images/lesson2c/photo6.png"
                  alt="Photo 6: Railway sign with number 6"
                  width={180}
                  height={120}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ===================== TWO-COLUMN CONTENT GRID =========================== */}
        {/* ========================================================================= */}
        <div className={styles.pageGrid}>
          {/* ================= LEFT COLUMN: VOCABULARY ================= */}
          <div className={styles.leftColumn}>
            <div>
              <h2 className={styles.sectionTitleTeal}>Vocabulary</h2>

              {/* Exercise 1a */}
              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>1</strong>
                <strong className={styles.letterBold}>a</strong>
                <span>
                  Match the numbers in the photos with the words in the box.
                </span>
              </div>

              <div className={styles.exampleNote}>
                <em>1 one, 2 two</em>
              </div>

              {/* Word Box */}
              <div className={styles.wordBox}>
                {WORDS_BOX.map((item) => (
                  <span
                    key={item.word}
                    className={`${styles.wordChip} ${
                      item.isExample ? styles.struck : ''
                    }`}
                  >
                    <span>{item.word}</span>
                    <PronounceButton word={item.word} size="small" />
                  </span>
                ))}
              </div>

              {/* Match inputs 1 to 6 */}
              <div className={styles.matchGrid}>
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const numStr = String(num);
                  const isDefaultExample = num === 1 || num === 2;
                  const currentVal =
                    ex1aMatch[numStr] ??
                    (num === 1 ? 'one' : num === 2 ? 'two' : '');
                  const vRes =
                    isTeacherReview && !isDefaultExample
                      ? verifyAnswer(currentVal, ex1aKey?.[numStr])
                      : null;
                  const valClass =
                    vRes?.status === 'correct'
                      ? styles.inputValid
                      : vRes?.status === 'incorrect'
                      ? styles.inputInvalid
                      : '';

                  return (
                    <div key={num} className={styles.matchItem}>
                      <span className={styles.matchNum}>{num}</span>
                      <select
                        className={`${styles.matchSelect} ${valClass}`}
                        value={currentVal}
                        onChange={(e) =>
                          onEx1aMatchChange(numStr, e.target.value)
                        }
                        disabled={readOnly || isDefaultExample}
                        aria-label={`Match word for photo number ${num}`}
                      >
                        <option value="">— select —</option>
                        {WORDS_BOX.map((wb) => (
                          <option key={wb.word} value={wb.word}>
                            {wb.word}
                          </option>
                        ))}
                      </select>
                      {isTeacherReview && !isDefaultExample && (
                        <TeacherAnswerBadge result={vRes} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 1b: Audio 2.9 (11-19) */}
            <div>
              <div className={styles.promptRow}>
                <strong className={styles.letterBold}>b</strong>
                <button
                  type="button"
                  onClick={() => playAudio('2.9')}
                  className={`${styles.audioBtn} ${
                    playingAudio === '2.9' ? styles.audioBtnActive : ''
                  }`}
                  disabled={readOnly}
                  aria-label="Play Audio 2.9"
                >
                  {playingAudio === '2.9' ? (
                    <>
                      <div className={styles.equalizer}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                      </div>
                      <span>Playing...</span>
                    </>
                  ) : (
                    '▶ Audio 2.9'
                  )}
                </button>
                <span>Listen and repeat numbers 11–19.</span>
              </div>

              <div className={styles.pillsGridTeal}>
                {TEAL_NUMBERS.map((item) => (
                  <div key={item.num} className={styles.pillBadgeTeal}>
                    <span>{item.num} {item.word}</span>
                    <PronounceButton word={item.word} size="small" />
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 1c: Audio 2.10 (20-100) */}
            <div>
              <div className={styles.promptRow}>
                <strong className={styles.letterBold}>c</strong>
                <button
                  type="button"
                  onClick={() => playAudio('2.10')}
                  className={`${styles.audioBtn} ${
                    playingAudio === '2.10' ? styles.audioBtnActive : ''
                  }`}
                  disabled={readOnly}
                  aria-label="Play Audio 2.10"
                >
                  {playingAudio === '2.10' ? (
                    <>
                      <div className={styles.equalizer}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                      </div>
                      <span>Playing...</span>
                    </>
                  ) : (
                    '▶ Audio 2.10'
                  )}
                </button>
                <span>Listen and repeat the numbers below.</span>
              </div>

              <div className={styles.pillsGridMagenta}>
                {MAGENTA_NUMBERS.map((item) => (
                  <div
                    key={item.num}
                    className={`${styles.pillBadgeMagenta} ${
                      item.num === 100 ? styles.fullWidthPill : ''
                    }`}
                  >
                    <span>{item.num} {item.word}</span>
                    <PronounceButton word={item.word} size="small" />
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 2: Audio 2.11 Listen & Choose */}
            <div>
              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>2</strong>
                <button
                  type="button"
                  onClick={() => playAudio('2.11')}
                  className={`${styles.audioBtn} ${
                    playingAudio === '2.11' ? styles.audioBtnActive : ''
                  }`}
                  disabled={readOnly}
                  aria-label="Play Audio 2.11"
                >
                  {playingAudio === '2.11' ? (
                    <>
                      <div className={styles.equalizer}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                      </div>
                      <span>Playing...</span>
                    </>
                  ) : (
                    '▶ Audio 2.11'
                  )}
                </button>
                <span>Listen and choose the numbers that you hear.</span>
              </div>

              <div className={styles.choicePairsGrid}>
                {PAIR_CHOICES.map((pair) => {
                  const selectedVal = ex2Choice[pair.id];
                  const vRes = isTeacherReview
                    ? verifyAnswer(selectedVal, ex2Key?.[pair.id])
                    : null;
                  const getBtnClass = (btnVal: string) => {
                    if (selectedVal !== btnVal) return '';
                    if (!isTeacherReview) return styles.selected;
                    return vRes?.status === 'correct'
                      ? styles.choiceValid
                      : styles.choiceInvalid;
                  };

                  return (
                    <div key={pair.id} className={styles.pairRow}>
                      <span className={styles.pairIndex}>{pair.id}</span>
                      <div className={styles.choiceButtons}>
                        <button
                          type="button"
                          className={`${styles.choiceBtn} ${getBtnClass(pair.opt1)}`}
                          onClick={() => onEx2ChoiceChange(pair.id, pair.opt1)}
                          disabled={readOnly}
                        >
                          {pair.opt1}
                        </button>
                        <button
                          type="button"
                          className={`${styles.choiceBtn} ${getBtnClass(pair.opt2)}`}
                          onClick={() => onEx2ChoiceChange(pair.id, pair.opt2)}
                          disabled={readOnly}
                        >
                          {pair.opt2}
                        </button>
                        {isTeacherReview && <TeacherAnswerBadge result={vRes} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: EXERCISE 3 & LISTENING ================= */}
          <div className={styles.rightColumn}>
            {/* Exercise 3a: Read numbers */}
            <div>
              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>3</strong>
                <strong className={styles.letterBold}>a</strong>
                <span>Read the numbers. What numbers come next?</span>
              </div>

              <div className={styles.sequenceWrap}>
                <div className={styles.sequenceHint}>
                  twenty-one, twenty-two,{' '}
                  <span className={styles.completedWord}>
                    twenty-three, ...
                  </span>
                </div>
                <input
                  type="text"
                  className={`${styles.sequenceInput} ${
                    isTeacherReview
                      ? verifyAnswer(ex3aSequence, ex3aKey?.text).status === 'correct'
                        ? styles.inputValid
                        : verifyAnswer(ex3aSequence, ex3aKey?.text).status === 'incorrect'
                        ? styles.inputInvalid
                        : ''
                      : ''
                  }`}
                  placeholder="Continue: twenty-four, twenty-five..."
                  value={ex3aSequence}
                  onChange={(e) => onEx3aSequenceChange(e.target.value)}
                  disabled={readOnly}
                  aria-label="Continue the number sequence"
                />
                {isTeacherReview && (
                  <TeacherAnswerBadge
                    result={verifyAnswer(ex3aSequence, ex3aKey?.text)}
                  />
                )}
              </div>
            </div>

            {/* Exercise 3b: Audio 2.12 Check & Repeat */}
            <div>
              <div className={styles.promptRow}>
                <strong className={styles.letterBold}>b</strong>
                <button
                  type="button"
                  onClick={() => playAudio('2.12')}
                  className={`${styles.audioBtn} ${
                    playingAudio === '2.12' ? styles.audioBtnActive : ''
                  }`}
                  disabled={readOnly}
                  aria-label="Play Audio 2.12"
                >
                  {playingAudio === '2.12' ? (
                    <>
                      <div className={styles.equalizer}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                      </div>
                      <span>Playing...</span>
                    </>
                  ) : (
                    '▶ Audio 2.12'
                  )}
                </button>
                <span>Listen, check and repeat.</span>
              </div>

              <div className={styles.appBanner}>
                <svg
                  className={styles.phoneIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <span>Go to your app for more practice.</span>
              </div>
            </div>

            {/* Listening Section Heading */}
            <div>
              <h2 className={styles.sectionTitleTeal}>Listening</h2>

              {/* Exercise 4a: Audio 2.13 */}
              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>4</strong>
                <strong className={styles.letterBold}>a</strong>
                <button
                  type="button"
                  onClick={() => playAudio('2.13')}
                  className={`${styles.audioBtn} ${
                    playingAudio === '2.13' ? styles.audioBtnActive : ''
                  }`}
                  disabled={readOnly}
                  aria-label="Play Audio 2.13"
                >
                  {playingAudio === '2.13' ? (
                    <>
                      <div className={styles.equalizer}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                      </div>
                      <span>Playing...</span>
                    </>
                  ) : (
                    '▶ Audio 2.13'
                  )}
                </button>
                <span>
                  Listen to a conversation. How old are the people in the
                  profiles?
                </span>
              </div>

              {/* Exercise 4b: Complete profiles */}
              <div className={styles.promptRow}>
                <strong className={styles.letterBold}>b</strong>
                <span>Listen again and complete the rest of the profiles.</span>
              </div>

              {/* Profiles Card */}
              <div className={styles.profilesCard}>
                {/* Profile 1: Anna Chubb */}
                <div className={styles.profileSection}>
                  <div className={styles.profileField}>
                    <span className={styles.fieldLabel}>What&apos;s her name?</span>
                    <span className={styles.fieldNameValue}>Anna Chubb</span>
                  </div>
                  <div className={styles.profileField}>
                    <label htmlFor="anna-age" className={styles.fieldLabel}>
                      How old is she?
                    </label>
                    <input
                      id="anna-age"
                      type="text"
                      className={`${styles.fieldInput} ${
                        isTeacherReview
                          ? verifyAnswer(ex4Profiles.anna?.age, ex4Key?.anna_age).status === 'correct'
                            ? styles.inputValid
                            : verifyAnswer(ex4Profiles.anna?.age, ex4Key?.anna_age).status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                          : ''
                      }`}
                      value={ex4Profiles.anna?.age ?? ''}
                      onChange={(e) =>
                        onEx4ProfilesChange('anna', 'age', e.target.value)
                      }
                      placeholder="e.g. 26"
                      disabled={readOnly}
                    />
                    {isTeacherReview && (
                      <TeacherAnswerBadge
                        result={verifyAnswer(ex4Profiles.anna?.age, ex4Key?.anna_age)}
                      />
                    )}
                  </div>
                  <div className={styles.profileField}>
                    <label htmlFor="anna-from" className={styles.fieldLabel}>
                      Where is she from?
                    </label>
                    <input
                      id="anna-from"
                      type="text"
                      className={`${styles.fieldInput} ${
                        isTeacherReview
                          ? verifyAnswer(ex4Profiles.anna?.from, ex4Key?.anna_from).status === 'correct'
                            ? styles.inputValid
                            : verifyAnswer(ex4Profiles.anna?.from, ex4Key?.anna_from).status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                          : ''
                      }`}
                      value={ex4Profiles.anna?.from ?? ''}
                      onChange={(e) =>
                        onEx4ProfilesChange('anna', 'from', e.target.value)
                      }
                      placeholder="e.g. the UK"
                      disabled={readOnly}
                    />
                    {isTeacherReview && (
                      <TeacherAnswerBadge
                        result={verifyAnswer(ex4Profiles.anna?.from, ex4Key?.anna_from)}
                      />
                    )}
                  </div>
                  <div className={styles.profileField}>
                    <label htmlFor="anna-job" className={styles.fieldLabel}>
                      What&apos;s her job?
                    </label>
                    <input
                      id="anna-job"
                      type="text"
                      className={`${styles.fieldInput} ${
                        isTeacherReview
                          ? verifyAnswer(ex4Profiles.anna?.job, ex4Key?.anna_job).status === 'correct'
                            ? styles.inputValid
                            : verifyAnswer(ex4Profiles.anna?.job, ex4Key?.anna_job).status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                          : ''
                      }`}
                      value={ex4Profiles.anna?.job ?? ''}
                      onChange={(e) =>
                        onEx4ProfilesChange('anna', 'job', e.target.value)
                      }
                      placeholder="e.g. receptionist"
                      disabled={readOnly}
                    />
                    {isTeacherReview && (
                      <TeacherAnswerBadge
                        result={verifyAnswer(ex4Profiles.anna?.job, ex4Key?.anna_job)}
                      />
                    )}
                  </div>
                </div>

                {/* Profile 2: Bill Gooch */}
                <div className={styles.profileSection}>
                  <div className={styles.profileField}>
                    <span className={styles.fieldLabel}>What&apos;s his name?</span>
                    <span className={styles.fieldNameValue}>Bill Gooch</span>
                  </div>
                  <div className={styles.profileField}>
                    <label htmlFor="bill-age" className={styles.fieldLabel}>
                      How old is he?
                    </label>
                    <input
                      id="bill-age"
                      type="text"
                      className={`${styles.fieldInput} ${
                        isTeacherReview
                          ? verifyAnswer(ex4Profiles.bill?.age, ex4Key?.bill_age).status === 'correct'
                            ? styles.inputValid
                            : verifyAnswer(ex4Profiles.bill?.age, ex4Key?.bill_age).status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                          : ''
                      }`}
                      value={ex4Profiles.bill?.age ?? ''}
                      onChange={(e) =>
                        onEx4ProfilesChange('bill', 'age', e.target.value)
                      }
                      placeholder="e.g. 42"
                      disabled={readOnly}
                    />
                    {isTeacherReview && (
                      <TeacherAnswerBadge
                        result={verifyAnswer(ex4Profiles.bill?.age, ex4Key?.bill_age)}
                      />
                    )}
                  </div>
                  <div className={styles.profileField}>
                    <label htmlFor="bill-from" className={styles.fieldLabel}>
                      Where is he from?
                    </label>
                    <input
                      id="bill-from"
                      type="text"
                      className={`${styles.fieldInput} ${
                        isTeacherReview
                          ? verifyAnswer(ex4Profiles.bill?.from, ex4Key?.bill_from).status === 'correct'
                            ? styles.inputValid
                            : verifyAnswer(ex4Profiles.bill?.from, ex4Key?.bill_from).status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                          : ''
                      }`}
                      value={ex4Profiles.bill?.from ?? ''}
                      onChange={(e) =>
                        onEx4ProfilesChange('bill', 'from', e.target.value)
                      }
                      placeholder="e.g. the USA"
                      disabled={readOnly}
                    />
                    {isTeacherReview && (
                      <TeacherAnswerBadge
                        result={verifyAnswer(ex4Profiles.bill?.from, ex4Key?.bill_from)}
                      />
                    )}
                  </div>
                  <div className={styles.profileField}>
                    <label htmlFor="bill-job" className={styles.fieldLabel}>
                      What&apos;s his job?
                    </label>
                    <input
                      id="bill-job"
                      type="text"
                      className={`${styles.fieldInput} ${
                        isTeacherReview
                          ? verifyAnswer(ex4Profiles.bill?.job, ex4Key?.bill_job).status === 'correct'
                            ? styles.inputValid
                            : verifyAnswer(ex4Profiles.bill?.job, ex4Key?.bill_job).status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                          : ''
                      }`}
                      value={ex4Profiles.bill?.job ?? ''}
                      onChange={(e) =>
                        onEx4ProfilesChange('bill', 'job', e.target.value)
                      }
                      placeholder="e.g. doctor"
                      disabled={readOnly}
                    />
                    {isTeacherReview && (
                      <TeacherAnswerBadge
                        result={verifyAnswer(ex4Profiles.bill?.job, ex4Key?.bill_job)}
                      />
                    )}
                  </div>
                </div>

                {/* Profile 3: Satoru Goto */}
                <div className={styles.profileSection}>
                  <div className={styles.profileField}>
                    <span className={styles.fieldLabel}>What&apos;s his name?</span>
                    <span className={styles.fieldNameValue}>Satoru Goto</span>
                  </div>
                  <div className={styles.profileField}>
                    <label htmlFor="satoru-age" className={styles.fieldLabel}>
                      How old is he?
                    </label>
                    <input
                      id="satoru-age"
                      type="text"
                      className={`${styles.fieldInput} ${
                        isTeacherReview
                          ? verifyAnswer(ex4Profiles.satoru?.age, ex4Key?.satoru_age).status === 'correct'
                            ? styles.inputValid
                            : verifyAnswer(ex4Profiles.satoru?.age, ex4Key?.satoru_age).status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                          : ''
                      }`}
                      value={ex4Profiles.satoru?.age ?? ''}
                      onChange={(e) =>
                        onEx4ProfilesChange('satoru', 'age', e.target.value)
                      }
                      placeholder="e.g. 31"
                      disabled={readOnly}
                    />
                    {isTeacherReview && (
                      <TeacherAnswerBadge
                        result={verifyAnswer(ex4Profiles.satoru?.age, ex4Key?.satoru_age)}
                      />
                    )}
                  </div>
                  <div className={styles.profileField}>
                    <label htmlFor="satoru-from" className={styles.fieldLabel}>
                      Where is he from?
                    </label>
                    <input
                      id="satoru-from"
                      type="text"
                      className={`${styles.fieldInput} ${
                        isTeacherReview
                          ? verifyAnswer(ex4Profiles.satoru?.from, ex4Key?.satoru_from).status === 'correct'
                            ? styles.inputValid
                            : verifyAnswer(ex4Profiles.satoru?.from, ex4Key?.satoru_from).status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                          : ''
                      }`}
                      value={ex4Profiles.satoru?.from ?? ''}
                      onChange={(e) =>
                        onEx4ProfilesChange('satoru', 'from', e.target.value)
                      }
                      placeholder="e.g. Japan"
                      disabled={readOnly}
                    />
                    {isTeacherReview && (
                      <TeacherAnswerBadge
                        result={verifyAnswer(ex4Profiles.satoru?.from, ex4Key?.satoru_from)}
                      />
                    )}
                  </div>
                  <div className={styles.profileField}>
                    <label htmlFor="satoru-job" className={styles.fieldLabel}>
                      What&apos;s his job?
                    </label>
                    <input
                      id="satoru-job"
                      type="text"
                      className={`${styles.fieldInput} ${
                        isTeacherReview
                          ? verifyAnswer(ex4Profiles.satoru?.job, ex4Key?.satoru_job).status === 'correct'
                            ? styles.inputValid
                            : verifyAnswer(ex4Profiles.satoru?.job, ex4Key?.satoru_job).status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                          : ''
                      }`}
                      value={ex4Profiles.satoru?.job ?? ''}
                      onChange={(e) =>
                        onEx4ProfilesChange('satoru', 'job', e.target.value)
                      }
                      placeholder="e.g. engineer"
                      disabled={readOnly}
                    />
                    {isTeacherReview && (
                      <TeacherAnswerBadge
                        result={verifyAnswer(ex4Profiles.satoru?.job, ex4Key?.satoru_job)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 18 Bottom Pin Marker */}
        <div className={styles.pageFooter}>
          <div className={styles.pagePin18}>
            <span>18</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ===================== PAGE 19: GRAMMAR & SPEAKING ======================= */}
      {/* ========================================================================= */}
      <section className={styles.textbookPage}>
        {/* Top Section with Photos 7-10 and Side Ribbon */}
        <div className={styles.topGrid19Wrap}>
          <div className={styles.topGrid19}>
            {/* Column 1: Photo 7 (Footballer 7) */}
            <div className={styles.col19_1}>
              <div
                className={`${styles.photoCard} ${styles.photoCard7}`}
                onClick={() =>
                  setZoomedImage({
                    src: '/images/lesson2c/photo7.png',
                    title: 'Photo 7: Footballer with number 7',
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomedImage({
                      src: '/images/lesson2c/photo7.png',
                      title: 'Photo 7: Footballer with number 7',
                    });
                  }
                }}
                aria-label="Enlarge Photo 7: Footballer"
              >
                <div className={styles.photoBadge}>7</div>
                <Image
                  src="/images/lesson2c/photo7.png"
                  alt="Photo 7: Footballer with number 7"
                  width={180}
                  height={230}
                  priority
                />
              </div>
            </div>

            {/* Column 2: Photo 8 (Gate 8) & Photo 9 (Ruler 9) */}
            <div className={styles.col19_2}>
              <div
                className={`${styles.photoCard} ${styles.photoCard8}`}
                onClick={() =>
                  setZoomedImage({
                    src: '/images/lesson2c/photo8.png',
                    title: 'Photo 8: Gate with number 8',
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomedImage({
                      src: '/images/lesson2c/photo8.png',
                      title: 'Photo 8: Gate with number 8',
                    });
                  }
                }}
                aria-label="Enlarge Photo 8: Gate"
              >
                <div className={styles.photoBadge}>8</div>
                <Image
                  src="/images/lesson2c/photo8.png"
                  alt="Photo 8: Gate with number 8"
                  width={180}
                  height={112}
                  priority
                />
              </div>

              <div
                className={`${styles.photoCard} ${styles.photoCard9}`}
                onClick={() =>
                  setZoomedImage({
                    src: '/images/lesson2c/photo9.png',
                    title: 'Photo 9: Ruler with number 9',
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomedImage({
                      src: '/images/lesson2c/photo9.png',
                      title: 'Photo 9: Ruler with number 9',
                    });
                  }
                }}
                aria-label="Enlarge Photo 9: Ruler"
              >
                <div className={styles.photoBadge}>9</div>
                <Image
                  src="/images/lesson2c/photo9.png"
                  alt="Photo 9: Ruler with number 9"
                  width={180}
                  height={114}
                  priority
                />
              </div>
            </div>

            {/* Column 3: Photo 10 (10 Downing Street) */}
            <div className={styles.col19_3}>
              <div
                className={`${styles.photoCard} ${styles.photoCard10}`}
                onClick={() =>
                  setZoomedImage({
                    src: '/images/lesson2c/photo10.png',
                    title: 'Photo 10: 10 Downing Street door',
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomedImage({
                      src: '/images/lesson2c/photo10.png',
                      title: 'Photo 10: 10 Downing Street door',
                    });
                  }
                }}
                aria-label="Enlarge Photo 10: 10 Downing Street"
              >
                <div className={styles.photoBadge}>10</div>
                <Image
                  src="/images/lesson2c/photo10.png"
                  alt="Photo 10: 10 Downing Street door"
                  width={200}
                  height={230}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Side Ribbon Tab */}
          <div className={styles.sideRibbonTab}>2C | Numbers</div>
        </div>

        {/* ================= Two-Column Layout for Page 19 ================= */}
        <div className={styles.pageGrid}>
          {/* ================= LEFT COLUMN: GRAMMAR ================= */}
          <div className={styles.leftColumn}>
            <div>
              <h2 className={styles.sectionTitleTeal}>Grammar</h2>

              {/* Exercise 5: Read grammar box and choose alternatives */}
              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>5</strong>
                <span>
                  Read the grammar box and choose the correct alternatives. Use
                  the examples and Exercise 4 to help you.
                </span>
              </div>

              {/* Grammar Box */}
              <div className={styles.grammarBox19}>
                <div className={styles.grammarHeader}>
                  Question words with <em>be</em>
                </div>

                {/* Rule 1 */}
                <div className={styles.grammarRuleRow}>
                  <span>
                    Question words (e.g. <em>Who, How, What, Where, When</em>,
                    etc.) come
                  </span>
                  <div className={styles.choiceToggleGroup}>
                    {(() => {
                      const vRes1 = isTeacherReview
                        ? verifyAnswer(ex5GrammarRules['1'], ex5Key?.['1'])
                        : null;
                      const getBtn1Class = (btnVal: string) => {
                        if (ex5GrammarRules['1'] !== btnVal) return '';
                        if (!isTeacherReview) return styles.selected;
                        return vRes1?.status === 'correct'
                          ? styles.choiceValid
                          : styles.choiceInvalid;
                      };
                      return (
                        <>
                          <button
                            type="button"
                            className={`${styles.toggleBtn} ${getBtn1Class('before')}`}
                            onClick={() => onEx5GrammarRulesChange('1', 'before')}
                            disabled={readOnly}
                          >
                            ¹before
                          </button>
                          <button
                            type="button"
                            className={`${styles.toggleBtn} ${getBtn1Class('after')}`}
                            onClick={() => onEx5GrammarRulesChange('1', 'after')}
                            disabled={readOnly}
                          >
                            after
                          </button>
                          {isTeacherReview && <TeacherAnswerBadge result={vRes1} />}
                        </>
                      );
                    })()}
                  </div>
                  <span>
                    the verb <em>be</em>.
                  </span>
                </div>

                {/* Rule 2 */}
                <div className={styles.grammarRuleRow}>
                  <span>
                    The verb <em>be</em> comes
                  </span>
                  <div className={styles.choiceToggleGroup}>
                    {(() => {
                      const vRes2 = isTeacherReview
                        ? verifyAnswer(ex5GrammarRules['2'], ex5Key?.['2'])
                        : null;
                      const getBtn2Class = (btnVal: string) => {
                        if (ex5GrammarRules['2'] !== btnVal) return '';
                        if (!isTeacherReview) return styles.selected;
                        return vRes2?.status === 'correct'
                          ? styles.choiceValid
                          : styles.choiceInvalid;
                      };
                      return (
                        <>
                          <button
                            type="button"
                            className={`${styles.toggleBtn} ${getBtn2Class('before')}`}
                            onClick={() => onEx5GrammarRulesChange('2', 'before')}
                            disabled={readOnly}
                          >
                            ²before
                          </button>
                          <button
                            type="button"
                            className={`${styles.toggleBtn} ${getBtn2Class('after')}`}
                            onClick={() => onEx5GrammarRulesChange('2', 'after')}
                            disabled={readOnly}
                          >
                            after
                          </button>
                          {isTeacherReview && <TeacherAnswerBadge result={vRes2} />}
                        </>
                      );
                    })()}
                  </div>
                  <span>
                    the subject (e.g. <em>she, they, their names</em>, etc.)
                  </span>
                </div>

                {/* Table */}
                <div className={styles.grammarTableWrap}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Who are</strong> you?
                        </td>
                        <td>I&apos;m your new teacher.</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>How old is</strong> he?
                        </td>
                        <td>He&apos;s 99 years old!</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>What is</strong> her name?
                        </td>
                        <td>Her name is Anna Chubb.</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Where are</strong> they from?
                        </td>
                        <td>They&apos;re from Canada.</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>When is</strong> your class?
                        </td>
                        <td>At 9.30 a.m.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Exercise 6: Pronunciation (Audio 2.14) */}
            <div>
              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>6</strong>
                <strong className={styles.letterBold}>a</strong>
                <button
                  type="button"
                  onClick={() => playAudio('2.14')}
                  className={`${styles.audioBtn} ${
                    playingAudio === '2.14' ? styles.audioBtnActive : ''
                  }`}
                  disabled={readOnly}
                  aria-label="Play Audio 2.14"
                >
                  {playingAudio === '2.14' ? (
                    <>
                      <div className={styles.equalizer}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                      </div>
                      <span>Playing...</span>
                    </>
                  ) : (
                    '▶ Audio 2.14'
                  )}
                </button>
                <span>
                  Listen to the sentences. Notice the pronunciation of the forms
                  of <em>be</em> in{' '}
                  <span style={{ color: '#0288d1', fontWeight: 700 }}>blue</span>.
                </span>
              </div>

              <div className={styles.pronunciationList}>
                {EX6_SENTENCES.map((item) => (
                  <div key={item.id} className={styles.pronunciationItem}>
                    <span className={styles.itemIndex}>{item.id}</span>
                    <span>
                      {item.textStart}
                      <span className={styles.blueBe}>{item.blueBe}</span>
                      {item.textEnd}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.promptRow} style={{ marginTop: '0.6rem' }}>
                <strong className={styles.letterBold}>b</strong>
                <span>Listen again and repeat.</span>
              </div>
            </div>

            {/* Exercise 7: Write questions for answers 1–5 */}
            <div>
              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>7</strong>
                <span>Write questions for answers 1–5.</span>
              </div>

              <div className={styles.questionsList}>
                {EX7_ITEMS.map((item) => {
                  const val = ex7Questions[item.id] ?? '';
                  const vRes = isTeacherReview
                    ? verifyAnswer(val, ex7Key?.[item.id])
                    : null;
                  const valClass =
                    vRes?.status === 'correct'
                      ? styles.inputValid
                      : vRes?.status === 'incorrect'
                      ? styles.inputInvalid
                      : '';
                  return (
                    <div key={item.id} className={styles.questionItem}>
                      <div className={styles.questionInputRow}>
                        <span className={styles.qNum}>{item.id}</span>
                        <input
                          type="text"
                          className={`${styles.qInput} ${valClass}`}
                          placeholder={item.placeholder}
                          value={val}
                          onChange={(e) =>
                            onEx7QuestionsChange(item.id, e.target.value)
                          }
                          disabled={readOnly}
                          aria-label={`Question ${item.id}`}
                        />
                        <span className={styles.qMark}>?</span>
                        {isTeacherReview && <TeacherAnswerBadge result={vRes} />}
                      </div>
                      <div className={styles.answerTarget}>{item.answer}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: EXERCISE 8 & SPEAKING ================= */}
          <div className={styles.rightColumn}>
            {/* Exercise 8: Family names and questions */}
            <div>
              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>8</strong>
                <strong className={styles.letterBold}>a</strong>
                <span>Write the names of three people in your family.</span>
              </div>

              <div className={styles.familyInputsRow}>
                {(['1', '2', '3'] as const).map((num) => (
                  <div key={num} className={styles.familyItem}>
                    <span className={styles.familyNum}>{num}</span>
                    <input
                      id={`family-person-${num}`}
                      type="text"
                      className={styles.familyInput}
                      placeholder={`Person ${num}`}
                      value={ex8aFamily[num] ?? ''}
                      onChange={(e) => onEx8aFamilyChange(num, e.target.value)}
                      disabled={readOnly}
                      aria-label={`Family member ${num}`}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.promptRow} style={{ marginTop: '0.65rem' }}>
                <strong className={styles.letterBold}>b</strong>
                <span>
                  Work in pairs. Give the names to your partner. Ask and answer
                  questions about the people&apos;s ages and jobs.
                </span>
              </div>

              <div className={styles.dialogueModelBox}>
                <div className={styles.modelLine}>
                  <strong>A:</strong>
                  <em>Who&apos;s Felipe?</em>
                </div>
                <div className={styles.modelLine}>
                  <strong>B:</strong>
                  <em>He&apos;s my brother.</em>
                </div>
                <div className={styles.modelLine}>
                  <strong>A:</strong>
                  <em>How old is he?</em>
                </div>
                <div className={styles.modelLine}>
                  <strong>B:</strong>
                  <em>He&apos;s 19.</em>
                </div>
                <div className={styles.modelLine}>
                  <strong>A:</strong>
                  <em>What&apos;s his job?</em>
                </div>
                <div className={styles.modelLine}>
                  <strong>B:</strong>
                  <em>He&apos;s a student.</em>
                </div>
              </div>

              {/* Notes input for 8b */}
              <div className={styles.dialogueNotesWrap}>
                <input
                  type="text"
                  className={styles.dialogueNotesInput}
                  placeholder="Notes: Felipe - 19 - student..."
                  value={ex8bNotes}
                  onChange={(e) => onEx8bNotesChange(e.target.value)}
                  disabled={readOnly}
                  aria-label="Notes for exercise 8b"
                />
              </div>

              <div className={styles.appBanner} style={{ marginTop: '0.75rem' }}>
                <svg
                  className={styles.phoneIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <span>
                  Go to page 118 or your app for more information and practice.
                </span>
              </div>
            </div>

            {/* Speaking Section */}
            <div>
              <h2 className={styles.sectionTitleTeal}>Speaking</h2>

              {/* Ribbon: PREPARE */}
              <div className={styles.ribbonTag}>PREPARE</div>

              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>9</strong>
                <span>
                  Work in pairs. Student A: Turn to page 151. Student B: Turn to
                  page 152.
                </span>
              </div>

              {/* Ribbon: SPEAK */}
              <div className={styles.ribbonTag}>SPEAK</div>

              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>10</strong>
                <span>
                  Ask and answer the questions and complete the information on
                  pages 151/152.
                </span>
              </div>

              <div className={styles.dialogueModelBox}>
                <div className={styles.modelLine}>
                  <strong>A:</strong>
                  <em>What&apos;s Lena&apos;s job?</em>
                </div>
                <div className={styles.modelLine}>
                  <strong>B:</strong>
                  <em>She&apos;s a farmer.</em>
                </div>
              </div>

              {/* Field Photo Card */}
              <div
                className={styles.fieldPhotoCard}
                onClick={() =>
                  setZoomedImage({
                    src: '/images/lesson2c/field.png',
                    title: 'Lena the farmer field landscape',
                  })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomedImage({
                      src: '/images/lesson2c/field.png',
                      title: 'Lena the farmer field landscape',
                    });
                  }
                }}
                aria-label="Enlarge Field photo"
              >
                <Image
                  src="/images/lesson2c/field.png"
                  alt="Rural field with hay bale"
                  width={400}
                  height={160}
                />
              </div>

              {/* Speaking notes input */}
              <div className={styles.dialogueNotesWrap}>
                <input
                  type="text"
                  className={styles.dialogueNotesInput}
                  placeholder="Speaking notes / answers from pages 151-152..."
                  value={ex10SpeakingNotes}
                  onChange={(e) => onEx10SpeakingNotesChange(e.target.value)}
                  disabled={readOnly}
                  aria-label="Notes for exercise 10"
                />
              </div>

              {/* Develop your listening banner */}
              <div className={styles.developBanner}>
                <div className={styles.bannerChevron}>
                  <span>Develop your listening page 91</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 19 Bottom Pin Marker (Right side) */}
        <div className={styles.pageFooterRight}>
          <div className={styles.pagePin19}>
            <span>19</span>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for enlarged photos */}
      {zoomedImage && (
        <div
          className={styles.imageLightboxOverlay}
          onClick={() => setZoomedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={zoomedImage.title}
        >
          <div
            className={styles.lightboxDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.lightboxHeader}>
              <span>{zoomedImage.title}</span>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setZoomedImage(null)}
                aria-label="Close enlarged picture modal"
              >
                &times;
              </button>
            </div>
            <div className={styles.lightboxBody}>
              <Image
                src={zoomedImage.src}
                alt={zoomedImage.title}
                width={800}
                height={800}
                style={{ width: 'auto', height: 'auto', maxHeight: '75vh' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
