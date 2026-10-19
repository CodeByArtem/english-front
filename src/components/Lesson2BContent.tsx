'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import { verifyAnswer, getExerciseKey, LessonAnswerKey } from '@/lib/answerVerification';
import styles from './lesson2b.module.scss';
import AudioAnswerRecorder from './AudioAnswerRecorder/AudioAnswerRecorder';
import SubmissionAudioPlayer, {
  SubmissionAudioMeta,
} from './AudioAnswerRecorder/SubmissionAudioPlayer';

export interface Lesson2BContentProps {
  lesson?: Record<string, unknown> | null;
  user?: Record<string, unknown> | null;
  readOnly?: boolean;
  isTeacherReview?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio: (track: string) => void;
  playingAudio: string | null;

  // Exercise states
  ex1bVocab?: Record<string, string>;
  ex3Photos?: Record<string, string>;
  ex5aPicture?: Record<string, string>;
  ex5bDialogue?: Record<string, string>;
  ex6Grammar?: Record<string, string>;
  ex7aChoice?: Record<string, string>;
  ex8Conversations?: Record<string, string>;
  exRoomObjects?: string;

  // Audio recording & review
  audioBlob?: Blob | null;
  onAudioBlobChange?: (blob: Blob | null, mimeType: string) => void;
  submissionId?: string;
  submittedAudios?: SubmissionAudioMeta[];

  // Handlers
  onEx1bVocabChange?: (id: string, value: string) => void;
  onEx3PhotosChange?: (id: string, value: string) => void;
  onEx5aPictureChange?: (id: string, value: string) => void;
  onEx5bDialogueChange?: (id: string, value: string) => void;
  onEx6GrammarChange?: (id: string, value: string) => void;
  onEx7aChoiceChange?: (id: string, value: string) => void;
  onEx8ConversationsChange?: (id: string, value: string) => void;
  onExRoomObjectsChange?: (value: string) => void;

  originalAnswers?: Record<string, unknown>;
}

const VOCAB_LIST = [
  { letter: 'a', word: 'a book', target: '12', isExample: false },
  { letter: 'b', word: 'a phone', target: '6', isExample: false },
  { letter: 'c', word: 'a desk', target: '10', isExample: false },
  { letter: 'd', word: 'a key', target: '8', isExample: false },
  { letter: 'e', word: 'a table', target: '3', isExample: false },
  { letter: 'f', word: 'a clock (1)', target: '1', isExample: true },
  { letter: 'g', word: 'a photo', target: '7', isExample: false },
  { letter: 'h', word: 'a computer', target: '9', isExample: false },
  { letter: 'i', word: 'a box', target: '11', isExample: false },
  { letter: 'j', word: 'a chair (2)', target: '2', isExample: true },
  { letter: 'k', word: 'a cup (5)', target: '5', isExample: true },
  { letter: 'l', word: 'a pen (4)', target: '4', isExample: true },
];

const THUMBNAIL_PHOTOS = [
  {
    num: 1,
    url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=200&auto=format&fit=crop&q=80',
    alt: 'Pen',
  },
  {
    num: 2,
    url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=200&auto=format&fit=crop&q=80',
    alt: 'Clock',
  },
  {
    num: 3,
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    alt: 'Chair',
  },
  {
    num: 4,
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80',
    alt: 'Book',
  },
  {
    num: 5,
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80',
    alt: 'Cup',
  },
  {
    num: 6,
    url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=200&auto=format&fit=crop&q=80',
    alt: 'Key',
  },
  {
    num: 7,
    url: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=200&auto=format&fit=crop&q=80',
    alt: 'Box',
  },
  {
    num: 8,
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop&q=80',
    alt: 'Phone',
  },
];

export default function Lesson2BContent(props: Lesson2BContentProps) {
  const {
    readOnly = false,
    isTeacherReview = false,
    answerKey = null,
    playAudio,
    playingAudio,

    // States
    ex1bVocab = {},
    ex3Photos = {},
    ex5aPicture = {},
    ex5bDialogue = {},
    ex6Grammar = {},
    ex7aChoice = {},
    ex8Conversations = {},
    exRoomObjects = '',

    // Handlers
    onEx1bVocabChange = () => {},
    onEx3PhotosChange = () => {},
    onEx5aPictureChange = () => {},
    onEx5bDialogueChange = () => {},
    onEx6GrammarChange = () => {},
    onEx7aChoiceChange = () => {},
    onEx8ConversationsChange = () => {},
    onExRoomObjectsChange = () => {},
    onAudioBlobChange,
    submissionId,
    submittedAudios,
  } = props;

  const ex1bKey = getExerciseKey(answerKey, 'exercise_1b_vocab');
  const ex3Key = getExerciseKey(answerKey, 'exercise_3_photos');
  const ex5aKey = getExerciseKey(answerKey, 'exercise_5a_picture');
  const ex5bKey = getExerciseKey(answerKey, 'exercise_5b_dialogue');
  const ex6Key = getExerciseKey(answerKey, 'exercise_6_grammar');
  const ex7aKey = getExerciseKey(answerKey, 'exercise_7a_choice');
  const ex8Key = getExerciseKey(answerKey, 'exercise_8_conversations');

  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string } | null>(null);

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

  // Two-way hover mapping between list items and photo markers
  const isHighlighted = (key: string): boolean => {
    if (!hoveredMarker) return false;
    if (hoveredMarker === key) return true;

    const groupMap: Record<string, string[]> = {
      // 1–6 (Picture A: Meeting Room)
      '1': ['1', 'f', 'clock'],
      '2': ['2', 'j', 'chair'],
      '3': ['3', 'e', 'c', 'table', 'desk'],
      '4': ['4', 'l', 'pen'],
      '5': ['5', 'k', 'cup'],
      '6': ['6', 'b', 'phone'],

      // 7–12 (Picture B: Main Office)
      '7': ['7', 'g', 'photo'],
      '8': ['8', 'd', 'key'],
      '9': ['9', 'h', 'computer'],
      '10': ['10', 'c', 'desk'],
      '11': ['11', 'i', 'box'],
      '12': ['12', 'a', 'book'],

      // Letters a–l
      a: ['a', '12', 'book'],
      b: ['b', '6', 'phone'],
      c: ['c', '10', '3', 'desk', 'table'],
      d: ['d', '8', 'key'],
      e: ['e', '3', 'table'],
      f: ['f', '1', 'clock'],
      g: ['g', '7', 'photo'],
      h: ['h', '9', 'computer'],
      i: ['i', '11', 'box'],
      j: ['j', '2', 'chair'],
      k: ['k', '5', 'cup'],
      l: ['l', '4', 'pen'],

      // Object names
      book: ['book', 'a', '12'],
      phone: ['phone', 'b', '6'],
      desk: ['desk', 'c', '10', '3'],
      key: ['key', 'd', '8'],
      table: ['table', 'e', '3', 'c'],
      clock: ['clock', 'f', '1'],
      photo: ['photo', 'g', '7'],
      computer: ['computer', 'h', '9'],
      box: ['box', 'i', '11'],
      chair: ['chair', 'j', '2'],
      cup: ['cup', 'k', '5'],
      pen: ['pen', 'l', '4'],
    };

    return Boolean(
      groupMap[hoveredMarker]?.includes(key) || groupMap[key]?.includes(hoveredMarker)
    );
  };

  return (
    <div className={styles.pageContainer}>
      {/* ========================================================================= */}
      {/* ===================== PAGE 16: VOCABULARY & LISTENING =================== */}
      {/* ========================================================================= */}
      <section className={styles.textbookPage}>
        {/* Header section with unit title & goal box */}
        <div className={styles.headerRow2B}>
          <div className={styles.headerLeft}>
            <div className={styles.unitBadge2B}>
              2<span className={styles.unitLetterB}>B</span>
            </div>
            <h1 className={styles.titleHeading2B}>Everyday things</h1>
          </div>

          <div className={styles.goalsBox2B}>
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
                <strong>Goal:</strong> talk about everyday objects
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
                <strong>Grammar:</strong> <em>this, that, these</em> and <em>those</em>
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
                <strong>Vocabulary:</strong> everyday objects (1)
              </span>
            </div>
          </div>
        </div>

        {/* Two-column layout: Left (Vocabulary 1-4) & Right (Picture A Corridor) */}
        <div className={styles.pageGrid2B}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Vocabulary Heading & Exercise 1 */}
            <div>
              <h2 className={styles.sectionTitleTeal}>Vocabulary</h2>

              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>1</strong>
                <strong className={styles.letterBold}>a</strong>
                <span>Work in pairs. Look at pictures A and B. Where are the people?</span>
              </div>

              <div className={styles.promptRow} style={{ paddingLeft: '1.25rem' }}>
                <strong className={styles.letterBold}>b</strong>
                <span>
                  Match <strong>1–12</strong> in the pictures with <strong>a–l</strong>.{' '}
                  <span className={styles.subHint}>
                    (Hover list items below to highlight objects on picture)
                  </span>
                </span>
              </div>

              {/* Vocabulary List Grid (a-l) */}
              <div className={styles.vocabListGrid}>
                {VOCAB_LIST.map((item) => {
                  const highlighted = isHighlighted(item.target) || isHighlighted(item.letter);
                  return (
                    <div
                      key={item.letter}
                      data-target={item.target}
                      onMouseEnter={() => setHoveredMarker(item.target)}
                      onMouseLeave={() => setHoveredMarker(null)}
                      className={`${styles.vocabItem} ${
                        highlighted ? styles.itemHighlight : ''
                      } ${item.isExample ? styles.itemExample : ''}`}
                    >
                      <strong className={styles.vocabLetter}>{item.letter}</strong>
                      <span className={styles.vocabWord}>{item.word}</span>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Matching Selector 1–12 */}
              <div className={styles.matchingWrap}>
                <div className={styles.matchingTitle}>Select matching letters (a–l) for 1–12:</div>
                <div className={styles.matchingGrid}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                    const val = ex1bVocab[String(num)] || '';
                    const vRes = isTeacherReview ? verifyAnswer(val, ex1bKey?.[String(num)]) : null;
                    const valClass =
                      vRes?.status === 'correct'
                        ? styles.inputValid
                        : vRes?.status === 'incorrect'
                        ? styles.inputInvalid
                        : '';
                    return (
                      <div
                        key={num}
                        className={styles.matchingItem}
                        onMouseEnter={() => setHoveredMarker(String(num))}
                        onMouseLeave={() => setHoveredMarker(null)}
                      >
                        <span className={styles.badgeNum}>{num}</span>
                        <select
                          value={val}
                          onChange={(e) => onEx1bVocabChange(String(num), e.target.value)}
                          disabled={readOnly}
                          aria-label={`Match item ${num}`}
                          className={valClass}
                        >
                          <option value="">--</option>
                          {VOCAB_LIST.map((opt) => (
                            <option key={opt.letter} value={opt.letter}>
                              {opt.letter}) {opt.word.replace(/\s*\(\d+\)/, '')}
                            </option>
                          ))}
                        </select>
                        {isTeacherReview && <TeacherAnswerBadge result={vRes} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Exercise 2: Audio 2.5 Listen & Repeat */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '0.25rem', flexWrap: 'wrap' }}>
              <strong className={styles.numberBold}>2</strong>
              <button
                type="button"
                onClick={() => playAudio('2.5')}
                className={`${styles.audioBtn} ${playingAudio === '2.5' ? styles.playing : ''}`}
                disabled={readOnly}
                aria-label="Play Audio 2.5"
              >
                <span className={styles.diamondIcon}>
                  <svg viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                </span>
                <span>2.5</span>
                <span>{playingAudio === '2.5' ? 'Playing...' : 'Audio'}</span>
              </button>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>
                Listen and repeat the words in Exercise 1b.
              </span>
            </div>

            {/* Exercise 3: Speaking Practice & 8 Photo Thumbnails */}
            <div>
              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>3</strong>
                <span>
                  Work in pairs. Ask and answer questions about photos <strong>1–8</strong>.
                </span>
              </div>

              {/* Model Dialogue */}
              <div className={styles.dialogueModelBox}>
                <div className={styles.modelRow}>
                  <strong>A:</strong> <em>What&apos;s number 1?</em>
                </div>
                <div className={styles.modelRow}>
                  <strong>B:</strong> <em>It&apos;s a pen.</em>
                </div>
              </div>

              {/* 8 Photo Thumbnails Grid */}
              <div className={styles.thumbnailsGrid}>
                {THUMBNAIL_PHOTOS.map((photo) => {
                  const val = ex3Photos[String(photo.num)] || '';
                  const vRes = isTeacherReview ? verifyAnswer(val, ex3Key?.[String(photo.num)]) : null;
                  const valClass =
                    vRes?.status === 'correct'
                      ? styles.inputValid
                      : vRes?.status === 'incorrect'
                      ? styles.inputInvalid
                      : '';
                  return (
                    <div key={photo.num} className={styles.thumbCard}>
                      <div className={styles.thumbImgFrame}>
                        <span className={styles.thumbBadge}>{photo.num}</span>
                        <Image
                          src={photo.url}
                          alt={photo.alt}
                          fill
                          sizes="(max-width: 768px) 25vw, 120px"
                          style={{ objectFit: 'cover' }}
                          unoptimized
                        />
                      </div>
                      <div className={styles.thumbSelectWrap}>
                        <select
                          value={val}
                          onChange={(e) => onEx3PhotosChange(String(photo.num), e.target.value)}
                          disabled={readOnly}
                          aria-label={`Identify photo ${photo.num}`}
                          className={valClass}
                        >
                          <option value="">-- choose --</option>
                          <option value="pen">pen</option>
                          <option value="clock">clock</option>
                          <option value="chair">chair</option>
                          <option value="book">book</option>
                          <option value="cup">cup</option>
                          <option value="key">key</option>
                          <option value="box">box</option>
                          <option value="phone">phone</option>
                        </select>
                        {isTeacherReview && <TeacherAnswerBadge result={vRes} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 4: Room Objects */}
            <div>
              <div className={styles.promptRow}>
                <strong className={styles.numberBold}>4</strong>
                <span>Say the names of things in your room.</span>
              </div>
              <div className={styles.roomBox}>
                <div className={styles.roomPrompt}>It&apos;s a clock. It&apos;s a chair.</div>
                <input
                  type="text"
                  value={exRoomObjects}
                  onChange={(e) => onExRoomObjectsChange(e.target.value)}
                  disabled={readOnly}
                  placeholder="Type objects in your room (e.g. It's a desk. It's a phone)..."
                  className={styles.roomInput}
                  aria-label="Names of things in your room"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Textbook Illustration (picres.png) */}
          <div className={styles.rightColumn}>
            <div className={styles.pictureTitleRow}>
              <span className={styles.picTitle}>Picture A: Meeting Room</span>
              <button
                type="button"
                onClick={() => setZoomedImage({ src: '/images/lesson2b/picres.png', title: 'Picture A: Meeting Room' })}
                className={styles.zoomActionBtn}
                aria-label="Enlarge Picture A"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                <span>Zoom</span>
              </button>
            </div>

            <div
              className={styles.corridorFrame}
              onClick={() => setZoomedImage({ src: '/images/lesson2b/picres.png', title: 'Picture A: Meeting Room' })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setZoomedImage({ src: '/images/lesson2b/picres.png', title: 'Picture A: Meeting Room' });
                }
              }}
              aria-label="Click to enlarge Picture A"
            >
              {/* Textbook Illustration picres.png */}
              <Image
                src="/images/lesson2b/picres.png"
                alt="Picture A meeting room illustration from textbook"
                width={464}
                height={736}
                className={styles.corridorImg}
                priority
              />

              {/* 1: Clock (top right) */}
              <div
                id="marker-1"
                style={{ left: '76.5%', top: '19%' }}
                className={`${styles.numberBadge} ${isHighlighted('1') ? styles.markerHighlight : ''}`}
                onMouseEnter={() => setHoveredMarker('1')}
                onMouseLeave={() => setHoveredMarker(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredMarker(hoveredMarker === '1' ? null : '1');
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    setHoveredMarker(hoveredMarker === '1' ? null : '1');
                  }
                }}
                title="1 — clock"
                aria-label="Item 1 clock"
              >
                1
              </div>

              {/* 2: Chair (middle left) */}
              <div
                id="marker-2"
                style={{ left: '4.7%', top: '63.2%' }}
                className={`${styles.numberBadge} ${isHighlighted('2') ? styles.markerHighlight : ''}`}
                onMouseEnter={() => setHoveredMarker('2')}
                onMouseLeave={() => setHoveredMarker(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredMarker(hoveredMarker === '2' ? null : '2');
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    setHoveredMarker(hoveredMarker === '2' ? null : '2');
                  }
                }}
                title="2 — chair"
                aria-label="Item 2 chair"
              >
                2
              </div>

              {/* 3: Desk / Table (center left) */}
              <div
                id="marker-3"
                style={{ left: '27.6%', top: '66.7%' }}
                className={`${styles.numberBadge} ${isHighlighted('3') ? styles.markerHighlight : ''}`}
                onMouseEnter={() => setHoveredMarker('3')}
                onMouseLeave={() => setHoveredMarker(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredMarker(hoveredMarker === '3' ? null : '3');
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    setHoveredMarker(hoveredMarker === '3' ? null : '3');
                  }
                }}
                title="3 — table"
                aria-label="Item 3 table"
              >
                3
              </div>

              {/* 4: Pen (table top center) */}
              <div
                id="marker-4"
                style={{ left: '46.1%', top: '67.4%' }}
                className={`${styles.numberBadge} ${isHighlighted('4') ? styles.markerHighlight : ''}`}
                onMouseEnter={() => setHoveredMarker('4')}
                onMouseLeave={() => setHoveredMarker(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredMarker(hoveredMarker === '4' ? null : '4');
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    setHoveredMarker(hoveredMarker === '4' ? null : '4');
                  }
                }}
                title="4 — pen"
                aria-label="Item 4 pen"
              >
                4
              </div>

              {/* 5: Cup (table right) */}
              <div
                id="marker-5"
                style={{ left: '72%', top: '80.4%' }}
                className={`${styles.numberBadge} ${isHighlighted('5') ? styles.markerHighlight : ''}`}
                onMouseEnter={() => setHoveredMarker('5')}
                onMouseLeave={() => setHoveredMarker(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredMarker(hoveredMarker === '5' ? null : '5');
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    setHoveredMarker(hoveredMarker === '5' ? null : '5');
                  }
                }}
                title="5 — cup"
                aria-label="Item 5 cup"
              >
                5
              </div>

              {/* 6: Phone (table lower center) */}
              <div
                id="marker-6"
                style={{ left: '46.3%', top: '86.4%' }}
                className={`${styles.numberBadge} ${isHighlighted('6') ? styles.markerHighlight : ''}`}
                onMouseEnter={() => setHoveredMarker('6')}
                onMouseLeave={() => setHoveredMarker(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setHoveredMarker(hoveredMarker === '6' ? null : '6');
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    setHoveredMarker(hoveredMarker === '6' ? null : '6');
                  }
                }}
                title="6 — phone"
                aria-label="Item 6 phone"
              >
                6
              </div>
            </div>

            <p className={styles.picSubCaption}>
              Hover or tap items 1–6 to highlight • Click picture to zoom
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className={styles.sectionDivider} />

        {/* Listening Section */}
        <div className={styles.listeningSection}>
          <div>
            <h2 className={styles.sectionTitleTeal}>Listening</h2>

            {/* Exercise 5a */}
            <div className={styles.ex5aRow}>
              <strong className={styles.ex5aNum}>5</strong>
              <strong className={styles.ex5aLetter}>a</strong>
              <button
                type="button"
                onClick={() => playAudio('2.6')}
                className={`${styles.audioBtn} ${playingAudio === '2.6' ? styles.playing : ''}`}
                disabled={readOnly}
                aria-label="Play Audio 2.6"
              >
                <span className={styles.diamondIcon}>
                  <svg viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                </span>
                <span>2.6</span>
                <span>{playingAudio === '2.6' ? 'Playing...' : 'Audio'}</span>
              </button>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>
                Listen and choose the correct picture in Exercise 1, A or B.
              </span>
            </div>

            {/* Radio choices for 5a */}
            <div className={styles.ex5aChoices}>
              {(() => {
                const val = ex5aPicture.choice || '';
                const vRes = isTeacherReview ? verifyAnswer(val, ex5aKey?.choice) : null;
                const getClass = (choiceOpt: string) => {
                  if (!isTeacherReview) return '';
                  if (val === choiceOpt) {
                    return vRes?.status === 'correct' ? styles.choiceValid : styles.choiceInvalid;
                  }
                  return '';
                };
                return (
                  <>
                    <label className={getClass('A')}>
                      <input
                        type="radio"
                        name="ex5a_picture_choice"
                        value="A"
                        checked={val === 'A'}
                        onChange={(e) => onEx5aPictureChange('choice', e.target.value)}
                        disabled={readOnly}
                      />
                      <span>Picture A</span>
                    </label>
                    <label className={getClass('B')}>
                      <input
                        type="radio"
                        name="ex5a_picture_choice"
                        value="B"
                        checked={val === 'B'}
                        onChange={(e) => onEx5aPictureChange('choice', e.target.value)}
                        disabled={readOnly}
                      />
                      <span>Picture B</span>
                    </label>
                    {isTeacherReview && <TeacherAnswerBadge result={vRes} />}
                  </>
                );
              })()}
            </div>

            {/* Exercise 5b instruction */}
            <div className={styles.promptRow} style={{ paddingLeft: '1.25rem', marginTop: '0.75rem' }}>
              <strong className={styles.letterBold}>b</strong>
              <span>Listen again and complete the conversation.</span>
            </div>
          </div>

          {/* Max & Carla Dialogue Completion Box */}
          <div className={styles.dialogueBox}>
            {/* Line 1 */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerMax}>Max:</div>
              <div className={styles.speechText}>Hi. Are you Carla?</div>
            </div>

            {/* Line 2 */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerCarla}>Carla:</div>
              <div className={styles.speechText}>Yes, I am.</div>
            </div>

            {/* Line 3 */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerMax}>Max:</div>
              <div className={styles.speechText}>I&apos;m Max. Nice to meet you.</div>
            </div>

            {/* Line 4 */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerCarla}>Carla:</div>
              <div className={styles.speechText}>Nice to meet you, too.</div>
            </div>

            {/* Line 5 (Gap 1) */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerMax}>Max:</div>
              <div className={styles.speechText}>
                <span>Welcome to the company. This is our office. And this is your</span>
                <span className={styles.gapInline}>
                  <span className={styles.gapNum}>1</span>
                  <input
                    type="text"
                    value={ex5bDialogue['1'] || ''}
                    onChange={(e) => onEx5bDialogueChange('1', e.target.value)}
                    disabled={readOnly}
                    placeholder="________"
                    className={`${styles.gapInput} ${
                      isTeacherReview
                        ? verifyAnswer(ex5bDialogue['1'], ex5bKey?.['1']).status === 'correct'
                          ? styles.inputValid
                          : verifyAnswer(ex5bDialogue['1'], ex5bKey?.['1']).status === 'incorrect'
                          ? styles.inputInvalid
                          : ''
                        : ''
                    }`}
                    aria-label="Gap 1"
                  />
                  {isTeacherReview && (
                    <TeacherAnswerBadge result={verifyAnswer(ex5bDialogue['1'], ex5bKey?.['1'])} />
                  )}
                </span>
                <span>.</span>
              </div>
            </div>

            {/* Line 6 */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerCarla}>Carla:</div>
              <div className={styles.speechText}>OK.</div>
            </div>

            {/* Line 7 (Gap 2) */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerMax}>Max:</div>
              <div className={styles.speechText}>
                <span>These are your</span>
                <span className={styles.gapInline}>
                  <span className={styles.gapNum}>2</span>
                  <input
                    type="text"
                    value={ex5bDialogue['2'] || ''}
                    onChange={(e) => onEx5bDialogueChange('2', e.target.value)}
                    disabled={readOnly}
                    placeholder="________"
                    className={`${styles.gapInput} ${
                      isTeacherReview
                        ? verifyAnswer(ex5bDialogue['2'], ex5bKey?.['2']).status === 'correct'
                          ? styles.inputValid
                          : verifyAnswer(ex5bDialogue['2'], ex5bKey?.['2']).status === 'incorrect'
                          ? styles.inputInvalid
                          : ''
                        : ''
                    }`}
                    aria-label="Gap 2"
                  />
                  {isTeacherReview && (
                    <TeacherAnswerBadge result={verifyAnswer(ex5bDialogue['2'], ex5bKey?.['2'])} />
                  )}
                </span>
                <span>for the office.</span>
              </div>
            </div>

            {/* Line 8 */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerCarla}>Carla:</div>
              <div className={styles.speechText}>OK.</div>
            </div>

            {/* Line 9 (Gap 3) */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerMax}>Max:</div>
              <div className={styles.speechText}>
                <span>This is your</span>
                <span className={styles.gapInline}>
                  <span className={styles.gapNum}>3</span>
                  <input
                    type="text"
                    value={ex5bDialogue['3'] || ''}
                    onChange={(e) => onEx5bDialogueChange('3', e.target.value)}
                    disabled={readOnly}
                    placeholder="________"
                    className={`${styles.gapInput} ${
                      isTeacherReview
                        ? verifyAnswer(ex5bDialogue['3'], ex5bKey?.['3']).status === 'correct'
                          ? styles.inputValid
                          : verifyAnswer(ex5bDialogue['3'], ex5bKey?.['3']).status === 'incorrect'
                          ? styles.inputInvalid
                          : ''
                        : ''
                    }`}
                    aria-label="Gap 3"
                  />
                  {isTeacherReview && (
                    <TeacherAnswerBadge result={verifyAnswer(ex5bDialogue['3'], ex5bKey?.['3'])} />
                  )}
                </span>
                <span>and this is the password.</span>
              </div>
            </div>

            {/* Line 10 */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerCarla}>Carla:</div>
              <div className={styles.speechText}>Great.</div>
            </div>

            {/* Line 11 (Gap 4) */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerMax}>Max:</div>
              <div className={styles.speechText}>
                <span>And that is my</span>
                <span className={styles.gapInline}>
                  <span className={styles.gapNum}>4</span>
                  <input
                    type="text"
                    value={ex5bDialogue['4'] || ''}
                    onChange={(e) => onEx5bDialogueChange('4', e.target.value)}
                    disabled={readOnly}
                    placeholder="________"
                    className={`${styles.gapInput} ${
                      isTeacherReview
                        ? verifyAnswer(ex5bDialogue['4'], ex5bKey?.['4']).status === 'correct'
                          ? styles.inputValid
                          : verifyAnswer(ex5bDialogue['4'], ex5bKey?.['4']).status === 'incorrect'
                          ? styles.inputInvalid
                          : ''
                        : ''
                    }`}
                    aria-label="Gap 4"
                  />
                  {isTeacherReview && (
                    <TeacherAnswerBadge result={verifyAnswer(ex5bDialogue['4'], ex5bKey?.['4'])} />
                  )}
                </span>
                <span>. Please ask me for help.</span>
              </div>
            </div>

            {/* Line 12 (Gap 5) */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerCarla}>Carla:</div>
              <div className={styles.speechText}>
                <span>Thank you. Are those</span>
                <span className={styles.gapInline}>
                  <span className={styles.gapNum}>5</span>
                  <input
                    type="text"
                    value={ex5bDialogue['5'] || ''}
                    onChange={(e) => onEx5bDialogueChange('5', e.target.value)}
                    disabled={readOnly}
                    placeholder="________"
                    className={`${styles.gapInput} ${
                      isTeacherReview
                        ? verifyAnswer(ex5bDialogue['5'], ex5bKey?.['5']).status === 'correct'
                          ? styles.inputValid
                          : verifyAnswer(ex5bDialogue['5'], ex5bKey?.['5']).status === 'incorrect'
                          ? styles.inputInvalid
                          : ''
                        : ''
                    }`}
                    aria-label="Gap 5"
                  />
                  {isTeacherReview && (
                    <TeacherAnswerBadge result={verifyAnswer(ex5bDialogue['5'], ex5bKey?.['5'])} />
                  )}
                </span>
                <span>of your family?</span>
              </div>
            </div>

            {/* Line 13 */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerMax}>Max:</div>
              <div className={styles.speechText}>Yes. That&apos;s my son and that&apos;s my daughter.</div>
            </div>

            {/* Line 14 */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerCarla}>Carla:</div>
              <div className={styles.speechText}>Very nice.</div>
            </div>

            {/* Line 15 */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerMax}>Max:</div>
              <div className={styles.speechText}>Thank you. OK. Any questions?</div>
            </div>

            {/* Line 16 (Gap 6) */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerCarla}>Carla:</div>
              <div className={styles.speechText}>
                <span>Yes, where&apos;s my</span>
                <span className={styles.gapInline}>
                  <span className={styles.gapNum}>6</span>
                  <input
                    type="text"
                    value={ex5bDialogue['6'] || ''}
                    onChange={(e) => onEx5bDialogueChange('6', e.target.value)}
                    disabled={readOnly}
                    placeholder="________"
                    className={`${styles.gapInput} ${
                      isTeacherReview
                        ? verifyAnswer(ex5bDialogue['6'], ex5bKey?.['6']).status === 'correct'
                          ? styles.inputValid
                          : verifyAnswer(ex5bDialogue['6'], ex5bKey?.['6']).status === 'incorrect'
                          ? styles.inputInvalid
                          : ''
                        : ''
                    }`}
                    aria-label="Gap 6"
                  />
                  {isTeacherReview && (
                    <TeacherAnswerBadge result={verifyAnswer(ex5bDialogue['6'], ex5bKey?.['6'])} />
                  )}
                </span>
                <span>?</span>
              </div>
            </div>

            {/* Line 17 */}
            <div className={styles.dialogueRow}>
              <div className={styles.speakerMax}>Max:</div>
              <div className={styles.speechText}>Oh. Sorry. It&apos;s in the meeting room!</div>
            </div>
          </div>
        </div>

        {/* Footer Page Number indicator */}
        <div className={styles.pageFooter16}>
          <div className={styles.footerPinBadge}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
            <span>16</span>
          </div>
          <div className={styles.footerAppNote}>
            <span className={styles.phoneIconCircle}>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </span>
            <span>Go to page 137 or your app for more vocabulary and practice.</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ===================== PAGE 17: GRAMMAR & SPEAKING ======================= */}
      {/* ========================================================================= */}
      <section className={styles.textbookPage}>
        <div className={styles.page17Grid}>
          {/* LEFT COLUMN: Office Illustration & Grammar & Listening */}
          <div className={styles.leftColumn17}>
            {/* Office Illustration: Picture B (bigpic.png) */}
            <div className={styles.officePicCard17}>
              <div className={styles.officePicTopBar}>
                <div className={styles.officePicBadge}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  <span>Picture B: Main Office</span>
                </div>
                <button
                  type="button"
                  onClick={() => setZoomedImage({ src: '/images/lesson2b/bigpic.png', title: 'Picture B: Main Office' })}
                  className={styles.zoomActionBtn}
                  aria-label="Enlarge Picture B"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>Zoom</span>
                </button>
              </div>

              <div
                className={styles.officePicFrame}
                onClick={() => setZoomedImage({ src: '/images/lesson2b/bigpic.png', title: 'Picture B: Main Office' })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setZoomedImage({ src: '/images/lesson2b/bigpic.png', title: 'Picture B: Main Office' });
                  }
                }}
                aria-label="Click to enlarge Picture B"
              >
                <Image
                  src="/images/lesson2b/bigpic.png"
                  alt="Picture B: Main Office illustration from textbook"
                  width={399}
                  height={650}
                  className={styles.corridorImg}
                  priority
                />

                {/* 7: Photo (desk top left) */}
                <div
                  id="marker-7"
                  style={{ left: '17%', top: '37%' }}
                  className={`${styles.numberBadge} ${isHighlighted('7') ? styles.markerHighlight : ''}`}
                  onMouseEnter={() => setHoveredMarker('7')}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHoveredMarker(hoveredMarker === '7' ? null : '7');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setHoveredMarker(hoveredMarker === '7' ? null : '7');
                    }
                  }}
                  title="7 — photo"
                  aria-label="Item 7 photo"
                >
                  7
                </div>

                {/* 8: Key (desk middle left) */}
                <div
                  id="marker-8"
                  style={{ left: '33.8%', top: '50.5%' }}
                  className={`${styles.numberBadge} ${isHighlighted('8') ? styles.markerHighlight : ''}`}
                  onMouseEnter={() => setHoveredMarker('8')}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHoveredMarker(hoveredMarker === '8' ? null : '8');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setHoveredMarker(hoveredMarker === '8' ? null : '8');
                    }
                  }}
                  title="8 — key"
                  aria-label="Item 8 key"
                >
                  8
                </div>

                {/* 9: Computer (desk center) */}
                <div
                  id="marker-9"
                  style={{ left: '56.7%', top: '59.7%' }}
                  className={`${styles.numberBadge} ${isHighlighted('9') ? styles.markerHighlight : ''}`}
                  onMouseEnter={() => setHoveredMarker('9')}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHoveredMarker(hoveredMarker === '9' ? null : '9');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setHoveredMarker(hoveredMarker === '9' ? null : '9');
                    }
                  }}
                  title="9 — computer"
                  aria-label="Item 9 computer"
                >
                  9
                </div>

                {/* 10: Desk (under desk / drawers) */}
                <div
                  id="marker-10"
                  style={{ left: '38.7%', top: '63.9%' }}
                  className={`${styles.numberBadge} ${isHighlighted('10') ? styles.markerHighlight : ''}`}
                  onMouseEnter={() => setHoveredMarker('10')}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHoveredMarker(hoveredMarker === '10' ? null : '10');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setHoveredMarker(hoveredMarker === '10' ? null : '10');
                    }
                  }}
                  title="10 — desk"
                  aria-label="Item 10 desk"
                >
                  10
                </div>

                {/* 11: Box (desk side organizer) */}
                <div
                  id="marker-11"
                  style={{ left: '69%', top: '68.8%' }}
                  className={`${styles.numberBadge} ${isHighlighted('11') ? styles.markerHighlight : ''}`}
                  onMouseEnter={() => setHoveredMarker('11')}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHoveredMarker(hoveredMarker === '11' ? null : '11');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setHoveredMarker(hoveredMarker === '11' ? null : '11');
                    }
                  }}
                  title="11 — box"
                  aria-label="Item 11 box"
                >
                  11
                </div>

                {/* 12: Book (bottom left desk) */}
                <div
                  id="marker-12"
                  style={{ left: '17.7%', top: '94.5%' }}
                  className={`${styles.numberBadge} ${isHighlighted('12') ? styles.markerHighlight : ''}`}
                  onMouseEnter={() => setHoveredMarker('12')}
                  onMouseLeave={() => setHoveredMarker(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setHoveredMarker(hoveredMarker === '12' ? null : '12');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      setHoveredMarker(hoveredMarker === '12' ? null : '12');
                    }
                  }}
                  title="12 — book"
                  aria-label="Item 12 book"
                >
                  12
                </div>

                {/* Letter B Badge */}
                <div className={styles.letterABadge} style={{ left: 'auto', right: '0.75rem' }}>
                  B
                </div>
              </div>

              <p className={styles.officePicCaption}>
                Hover or tap items 7–12 to highlight • Click picture to zoom
              </p>
            </div>

            {/* Grammar Section: Exercise 6 */}
            <div>
              <div className={styles.exerciseHeaderRow}>
                <span className={styles.exerciseBadgeRed}>6</span>
                <span>
                  Complete the phrases with <em>this, that, these</em> and <em>those</em>. Use Exercise 5b to help you.
                </span>
              </div>

              <div className={styles.grammarBox17}>
                <div className={styles.grammarPillBadge}>this, that, these and those</div>

                <div className={styles.handsGrid17}>
                  {/* Item 1: key1.png */}
                  <div className={styles.handCard17}>
                    <div className={styles.handMediaWrap}>
                      <div className={styles.keyThumbBox}>
                        <Image
                          src="/images/lesson2b/key1.png"
                          alt="hand pointing close to key"
                          width={76}
                          height={48}
                          unoptimized
                        />
                      </div>
                      <span className={styles.cardNumber}>1</span>
                    </div>
                    <div className={styles.handInputWrap}>
                      <input
                        type="text"
                        value={ex6Grammar['1'] || ''}
                        onChange={(e) => onEx6GrammarChange('1', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inputBlank} ${
                          isTeacherReview
                            ? verifyAnswer(ex6Grammar['1'], ex6Key?.['1']).status === 'correct'
                              ? styles.inputValid
                              : verifyAnswer(ex6Grammar['1'], ex6Key?.['1']).status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                            : ''
                        }`}
                        placeholder="..."
                        aria-label="Grammar phrase 1"
                      />
                      <span>key</span>
                      {isTeacherReview && (
                        <TeacherAnswerBadge result={verifyAnswer(ex6Grammar['1'], ex6Key?.['1'])} />
                      )}
                    </div>
                  </div>

                  {/* Item 2: key2.png */}
                  <div className={styles.handCard17}>
                    <div className={styles.handMediaWrap}>
                      <div className={styles.keyThumbBox}>
                        <Image
                          src="/images/lesson2b/key2.png"
                          alt="hand pointing far to key"
                          width={76}
                          height={48}
                          unoptimized
                        />
                      </div>
                      <span className={styles.cardNumber}>2</span>
                    </div>
                    <div className={styles.handInputWrap}>
                      <input
                        type="text"
                        value={ex6Grammar['2'] || ''}
                        onChange={(e) => onEx6GrammarChange('2', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inputBlank} ${
                          isTeacherReview
                            ? verifyAnswer(ex6Grammar['2'], ex6Key?.['2']).status === 'correct'
                              ? styles.inputValid
                              : verifyAnswer(ex6Grammar['2'], ex6Key?.['2']).status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                            : ''
                        }`}
                        placeholder="..."
                        aria-label="Grammar phrase 2"
                      />
                      <span>key</span>
                      {isTeacherReview && (
                        <TeacherAnswerBadge result={verifyAnswer(ex6Grammar['2'], ex6Key?.['2'])} />
                      )}
                    </div>
                  </div>

                  {/* Item 3: key3.png */}
                  <div className={styles.handCard17}>
                    <div className={styles.handMediaWrap}>
                      <div className={styles.keyThumbBox}>
                        <Image
                          src="/images/lesson2b/key3.png"
                          alt="hand pointing close to keys"
                          width={76}
                          height={48}
                          unoptimized
                        />
                      </div>
                      <span className={styles.cardNumber}>3</span>
                    </div>
                    <div className={styles.handInputWrap}>
                      <input
                        type="text"
                        value={ex6Grammar['3'] || ''}
                        onChange={(e) => onEx6GrammarChange('3', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inputBlank} ${
                          isTeacherReview
                            ? verifyAnswer(ex6Grammar['3'], ex6Key?.['3']).status === 'correct'
                              ? styles.inputValid
                              : verifyAnswer(ex6Grammar['3'], ex6Key?.['3']).status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                            : ''
                        }`}
                        placeholder="..."
                        aria-label="Grammar phrase 3"
                      />
                      <span>keys</span>
                      {isTeacherReview && (
                        <TeacherAnswerBadge result={verifyAnswer(ex6Grammar['3'], ex6Key?.['3'])} />
                      )}
                    </div>
                  </div>

                  {/* Item 4: key4.png */}
                  <div className={styles.handCard17}>
                    <div className={styles.handMediaWrap}>
                      <div className={styles.keyThumbBox}>
                        <Image
                          src="/images/lesson2b/key4.png"
                          alt="hand pointing far to keys"
                          width={76}
                          height={48}
                          unoptimized
                        />
                      </div>
                      <span className={styles.cardNumber}>4</span>
                    </div>
                    <div className={styles.handInputWrap}>
                      <input
                        type="text"
                        value={ex6Grammar['4'] || ''}
                        onChange={(e) => onEx6GrammarChange('4', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inputBlank} ${
                          isTeacherReview
                            ? verifyAnswer(ex6Grammar['4'], ex6Key?.['4']).status === 'correct'
                              ? styles.inputValid
                              : verifyAnswer(ex6Grammar['4'], ex6Key?.['4']).status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                            : ''
                        }`}
                        placeholder="..."
                        aria-label="Grammar phrase 4"
                      />
                      <span>keys</span>
                      {isTeacherReview && (
                        <TeacherAnswerBadge result={verifyAnswer(ex6Grammar['4'], ex6Key?.['4'])} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 7: Listening & Pronunciation */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span className={styles.exerciseBadgeRed}>7</span>
                <button
                  type="button"
                  onClick={() => playAudio('2.7')}
                  className={`${styles.audioBtn} ${playingAudio === '2.7' ? styles.playing : ''}`}
                  disabled={readOnly}
                  aria-label="Play Audio 2.7"
                >
                  <span className={styles.diamondIcon}>
                    <svg viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                  </span>
                  <span>2.7</span>
                  <span>{playingAudio === '2.7' ? 'Playing...' : 'Audio'}</span>
                </button>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>
                  Listen and tick the sentence you hear first, <strong>a</strong> or <strong>b</strong>.
                </span>
              </div>

              <div className={styles.ex7SentenceList}>
                {[
                  {
                    id: '1',
                    optA: 'a This is my key.',
                    optB: 'b These are my keys.',
                  },
                  {
                    id: '2',
                    optA: 'a These are my books.',
                    optB: 'b This is my book.',
                  },
                  {
                    id: '3',
                    optA: "a What's in this box?",
                    optB: "b What's in these boxes?",
                  },
                ].map(({ id, optA, optB }) => {
                  const val = ex7aChoice[id] || '';
                  const vRes = isTeacherReview ? verifyAnswer(val, ex7aKey?.[id]) : null;
                  const getClass = (choiceOpt: string) => {
                    if (!isTeacherReview) return '';
                    if (val === choiceOpt) {
                      return vRes?.status === 'correct' ? styles.choiceValid : styles.choiceInvalid;
                    }
                    return '';
                  };
                  return (
                    <div key={id} className={styles.ex7SentenceRow}>
                      <span className={styles.sentenceNum}>{id}</span>
                      <label className={getClass('a')}>
                        <input
                          type="radio"
                          name={`ex7a_${id}`}
                          value="a"
                          checked={val === 'a'}
                          onChange={(e) => onEx7aChoiceChange(id, e.target.value)}
                          disabled={readOnly}
                        />
                        <span>{optA}</span>
                      </label>
                      <label className={getClass('b')}>
                        <input
                          type="radio"
                          name={`ex7a_${id}`}
                          value="b"
                          checked={val === 'b'}
                          onChange={(e) => onEx7aChoiceChange(id, e.target.value)}
                          disabled={readOnly}
                        />
                        <span>{optB}</span>
                      </label>
                      {isTeacherReview && <TeacherAnswerBadge result={vRes} />}
                    </div>
                  );
                })}
              </div>

              <div className={styles.ex7RepeatText}>
                <strong>b</strong> Listen again and repeat.
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Dialogs, Speaking & Banner */}
          <div className={styles.rightColumn17}>
            {/* Exercise 8: Conversations & 4 Mini Pictures */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <span className={styles.exerciseBadgeRed}>8</span>
                <button
                  type="button"
                  onClick={() => playAudio('2.8')}
                  className={`${styles.audioBtn} ${playingAudio === '2.8' ? styles.playing : ''}`}
                  disabled={readOnly}
                  aria-label="Play Audio 2.8"
                >
                  <span className={styles.diamondIcon}>
                    <svg viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                  </span>
                  <span>2.8</span>
                  <span>{playingAudio === '2.8' ? 'Playing...' : 'Audio'}</span>
                </button>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>
                  Look at pictures 1–4 and complete the conversations with <em>this, that, these</em> or{' '}
                  <em>those</em>. Then listen and check your answers.
                </span>
              </div>

              {/* 4 Mini Pictures: van.png, tow.png, thri.png, fo.png */}
              <div className={styles.ex8MiniGrid}>
                <div className={styles.ex8MiniCard}>
                  <span className={styles.miniCardBadge}>1</span>
                  <Image
                    src="/images/lesson2b/van.png"
                    alt="Conversation 1: cup on desk"
                    fill
                    sizes="(max-width: 768px) 50vw, 160px"
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </div>
                <div className={styles.ex8MiniCard}>
                  <span className={styles.miniCardBadge}>2</span>
                  <Image
                    src="/images/lesson2b/tow.png"
                    alt="Conversation 2: books on table"
                    fill
                    sizes="(max-width: 768px) 50vw, 160px"
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </div>
                <div className={styles.ex8MiniCard}>
                  <span className={styles.miniCardBadge}>3</span>
                  <Image
                    src="/images/lesson2b/thri.png"
                    alt="Conversation 3: box with clock"
                    fill
                    sizes="(max-width: 768px) 50vw, 160px"
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </div>
                <div className={styles.ex8MiniCard}>
                  <span className={styles.miniCardBadge}>4</span>
                  <Image
                    src="/images/lesson2b/fo.png"
                    alt="Conversation 4: pens in pot"
                    fill
                    sizes="(max-width: 768px) 50vw, 160px"
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </div>
              </div>

              {/* Conversations Form */}
              <div className={styles.conversationsBox17}>
                {/* Dialog 1 */}
                <div className={styles.conversationUnit}>
                  <div className={styles.dialogLine}>
                    <span className={styles.dialogSubNum}>1</span>
                    <span className={styles.dialogSpeaker}>Monica:</span>
                    <span className={styles.dialogText}>
                      Is{' '}
                      <input
                        type="text"
                        value={ex8Conversations['1'] || ''}
                        onChange={(e) => onEx8ConversationsChange('1', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inputBlank} ${
                          isTeacherReview
                            ? verifyAnswer(ex8Conversations['1'], ex8Key?.['1']).status === 'correct'
                              ? styles.inputValid
                              : verifyAnswer(ex8Conversations['1'], ex8Key?.['1']).status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                            : ''
                        }`}
                        placeholder="..."
                        aria-label="Dialog 1 gap"
                      />{' '}
                      your cup?
                      {isTeacherReview && (
                        <TeacherAnswerBadge result={verifyAnswer(ex8Conversations['1'], ex8Key?.['1'])} />
                      )}
                    </span>
                  </div>
                  <div className={styles.dialogLine} style={{ paddingLeft: '22px' }}>
                    <span className={styles.dialogSpeaker}>Davide:</span>
                    <span className={styles.dialogText}>Yes, it is.</span>
                  </div>
                </div>

                {/* Dialog 2 */}
                <div className={styles.conversationUnit}>
                  <div className={styles.dialogLine}>
                    <span className={styles.dialogSubNum}>2</span>
                    <span className={styles.dialogSpeaker}>Raquel:</span>
                    <span className={styles.dialogText}>
                      Are{' '}
                      <input
                        type="text"
                        value={ex8Conversations['2'] || ''}
                        onChange={(e) => onEx8ConversationsChange('2', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inputBlank} ${
                          isTeacherReview
                            ? verifyAnswer(ex8Conversations['2'], ex8Key?.['2']).status === 'correct'
                              ? styles.inputValid
                              : verifyAnswer(ex8Conversations['2'], ex8Key?.['2']).status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                            : ''
                        }`}
                        placeholder="..."
                        aria-label="Dialog 2 gap"
                      />{' '}
                      your books?
                      {isTeacherReview && (
                        <TeacherAnswerBadge result={verifyAnswer(ex8Conversations['2'], ex8Key?.['2'])} />
                      )}
                    </span>
                  </div>
                  <div className={styles.dialogLine} style={{ paddingLeft: '22px' }}>
                    <span className={styles.dialogSpeaker}>Mario:</span>
                    <span className={styles.dialogText}>Yes, they are.</span>
                  </div>
                </div>

                {/* Dialog 3 */}
                <div className={styles.conversationUnit}>
                  <div className={styles.dialogLine}>
                    <span className={styles.dialogSubNum}>3</span>
                    <span className={styles.dialogSpeaker}>Nina:</span>
                    <span className={styles.dialogText}>
                      What&apos;s in{' '}
                      <input
                        type="text"
                        value={ex8Conversations['3_1'] || ''}
                        onChange={(e) => onEx8ConversationsChange('3_1', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inputBlank} ${
                          isTeacherReview
                            ? verifyAnswer(ex8Conversations['3_1'], ex8Key?.['3_1']).status === 'correct'
                              ? styles.inputValid
                              : verifyAnswer(ex8Conversations['3_1'], ex8Key?.['3_1']).status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                            : ''
                        }`}
                        placeholder="..."
                        aria-label="Dialog 3 gap 1"
                      />{' '}
                      box?
                      {isTeacherReview && (
                        <TeacherAnswerBadge result={verifyAnswer(ex8Conversations['3_1'], ex8Key?.['3_1'])} />
                      )}
                    </span>
                  </div>
                  <div className={styles.dialogLine} style={{ paddingLeft: '22px' }}>
                    <span className={styles.dialogSpeaker}>Paula:</span>
                    <span className={styles.dialogText}>
                      <input
                        type="text"
                        value={ex8Conversations['3_2'] || ''}
                        onChange={(e) => onEx8ConversationsChange('3_2', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inputBlank} ${
                          isTeacherReview
                            ? verifyAnswer(ex8Conversations['3_2'], ex8Key?.['3_2']).status === 'correct'
                              ? styles.inputValid
                              : verifyAnswer(ex8Conversations['3_2'], ex8Key?.['3_2']).status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                            : ''
                        }`}
                        placeholder="..."
                        aria-label="Dialog 3 gap 2"
                      />
                      &apos;s my new clock.
                      {isTeacherReview && (
                        <TeacherAnswerBadge result={verifyAnswer(ex8Conversations['3_2'], ex8Key?.['3_2'])} />
                      )}
                    </span>
                  </div>
                </div>

                {/* Dialog 4 */}
                <div className={styles.conversationUnit}>
                  <div className={styles.dialogLine}>
                    <span className={styles.dialogSubNum}>4</span>
                    <span className={styles.dialogSpeaker}>Erik:</span>
                    <span className={styles.dialogText}>
                      Are{' '}
                      <input
                        type="text"
                        value={ex8Conversations['4_1'] || ''}
                        onChange={(e) => onEx8ConversationsChange('4_1', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inputBlank} ${
                          isTeacherReview
                            ? verifyAnswer(ex8Conversations['4_1'], ex8Key?.['4_1']).status === 'correct'
                              ? styles.inputValid
                              : verifyAnswer(ex8Conversations['4_1'], ex8Key?.['4_1']).status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                            : ''
                        }`}
                        placeholder="..."
                        aria-label="Dialog 4 gap 1"
                      />{' '}
                      my pens?
                      {isTeacherReview && (
                        <TeacherAnswerBadge result={verifyAnswer(ex8Conversations['4_1'], ex8Key?.['4_1'])} />
                      )}
                    </span>
                  </div>
                  <div className={styles.dialogLine} style={{ paddingLeft: '22px' }}>
                    <span className={styles.dialogSpeaker}>Sara:</span>
                    <span className={styles.dialogText}>
                      No,{' '}
                      <input
                        type="text"
                        value={ex8Conversations['4_2'] || ''}
                        onChange={(e) => onEx8ConversationsChange('4_2', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inputBlank} ${
                          isTeacherReview
                            ? verifyAnswer(ex8Conversations['4_2'], ex8Key?.['4_2']).status === 'correct'
                              ? styles.inputValid
                              : verifyAnswer(ex8Conversations['4_2'], ex8Key?.['4_2']).status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                            : ''
                        }`}
                        placeholder="..."
                        aria-label="Dialog 4 gap 2"
                      />{' '}
                      are Jack&apos;s pens.
                      {isTeacherReview && (
                        <TeacherAnswerBadge result={verifyAnswer(ex8Conversations['4_2'], ex8Key?.['4_2'])} />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Устное задание к упражнению 8: запись голосового ответа */}
              {!readOnly && (
                <AudioAnswerRecorder
                  onAudioChange={onAudioBlobChange}
                  readOnly={readOnly}
                />
              )}

              {/* Прослушивание отправленной аудиозаписи (для учителя или ученика в режиме просмотра) */}
              {submissionId && (
                <SubmissionAudioPlayer
                  submissionId={submissionId}
                  exerciseKey="exercise_8"
                  audios={submittedAudios}
                />
              )}
            </div>

            {/* Exercise 9 */}
            <div className={styles.ex9Container}>
              <p style={{ margin: 0 }}>
                <span className={styles.exerciseBadgeRed}>9a</span> Work in pairs.{' '}
                <strong>Student A:</strong> Look at picture A in Exercise 1.{' '}
                <strong>Student B:</strong> Look at picture B. Find the English words for other objects in the pictures. Use your dictionary to help you. Write a list.
              </p>
              <p className={styles.subPrompt}>
                <strong style={{ color: '#d32f2f' }}>b</strong> Ask and answer questions about the other objects in the pictures. Make notes.
              </p>

              <div className={styles.ex9ExampleBox}>
                <p><strong>A:</strong> <em>What&apos;s that?</em></p>
                <p><strong>B:</strong> <em>It&apos;s a light.</em></p>
                <p><strong>A:</strong> <em>What are those?</em></p>
                <p><strong>B:</strong> <em>They&apos;re plants.</em></p>
              </div>

              <textarea
                value={exRoomObjects}
                onChange={(e) => onExRoomObjectsChange(e.target.value)}
                disabled={readOnly}
                placeholder="Write your notes or object names here (e.g. whiteboard, marker, plant, light)..."
                className={styles.notesTextarea17}
                aria-label="Exercise 9 notes"
              />
            </div>

            {/* App notice banner */}
            <div className={styles.appNoticeBanner17}>
              <div className={styles.appNoticeIconBox}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <span>Go to page 118 or your app for more information and practice.</span>
            </div>

            {/* Speaking Section */}
            <div className={styles.speakingSection17}>
              <h3 className={styles.speakingTitle}>Speaking</h3>
              <div className={styles.speakingBox17}>
                <span className={styles.stepPillBadge}>Prepare</span>
                <p className={styles.stepPrompt}>
                  <span className={styles.stepNumBadge}>10</span>
                  Work in pairs. Look at picture A in Exercise 1.{' '}
                  <strong>Student A:</strong> Prepare to give a new worker a tour of the meeting room.{' '}
                  <strong>Student B:</strong> Ask questions. Use Exercise 5b to help you.
                </p>

                <span className={styles.stepPillBadge} style={{ marginTop: '4px' }}>Speak</span>
                <p className={styles.stepPrompt}>
                  <span className={styles.stepNumBadge}>11</span>
                  Roleplay the tour of the meeting room.
                </p>
              </div>
            </div>

            {/* Develop writing banner */}
            <div className={styles.developWritingBanner}>
              <div className={styles.writingPill}>
                <div className={styles.writingText}>
                  <div className={styles.writingTitle}>Develop your writing</div>
                  <div className={styles.writingPage}>page 90</div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Page 17 Pin */}
        <div className={styles.pageFooter17}>
          <div className={styles.pagePin17}>17</div>
        </div>
      </section>

      {/* Lightbox Modal for enlarged textbook images */}
      {zoomedImage && (
        <div
          className={styles.imageLightboxOverlay}
          onClick={() => setZoomedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={zoomedImage.title}
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <div className={styles.lightboxHeader}>
              <span>{zoomedImage.title}</span>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setZoomedImage(null)}
                aria-label="Close enlarged picture modal"
              >
                ✕
              </button>
            </div>
            <Image
              src={zoomedImage.src}
              alt={zoomedImage.title}
              width={900}
              height={1200}
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}
