'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import PronounceButton from '@/components/PronounceButton';
import { verifyAnswer, getExerciseKey, LessonAnswerKey } from '@/lib/answerVerification';
import AudioAnswerRecorder from './AudioAnswerRecorder/AudioAnswerRecorder';
import SubmissionAudioPlayer, {
  SubmissionAudioMeta,
} from './AudioAnswerRecorder/SubmissionAudioPlayer';
import styles from './lesson1d.module.scss';

export interface Lesson1DContentProps {
  lesson?: Record<string, unknown> | null;
  user?: Record<string, unknown> | null;
  readOnly?: boolean;
  isTeacherReview?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio: (track: string) => void;
  playingAudio: string | null;

  // Audio recording & review
  audioBlob?: Blob | null;
  onAudioBlobChange?: (blob: Blob | null, mimeType: string) => void;
  submissionId?: string;
  submittedAudios?: SubmissionAudioMeta[];

  // Page 12 states
  ex1Location?: string;
  ex2Audio?: Record<string, string>;
  ex3aOrder?: Record<string, string>;
  ex3bContact?: Record<string, string>;
  ex4aDialogue?: Record<string, string>;
  ex5Personal?: Record<string, string>;
  ex6Partner?: Record<string, string>;

  // Page 13 states
  wordsearchFound?: Record<string, string>;
  ex2aOrder?: Record<string, string>;
  ex2bShort?: Record<string, string>;
  ex3Be?: Record<string, string>;
  ex4Jobs?: Record<string, string>;
  ex5IsIsnt?: Record<string, string>;
  ex6Corrections?: Record<string, string>;
  ex7aNationalities?: Record<string, string>;
  ex7bPeople?: Record<string, string>;
  ex8Alternatives?: Record<string, string>;
  ex9Text?: Record<string, string>;
  reflectScores?: Record<string, string | number>;

  // Handlers
  onEx1LocationChange?: (value: string) => void;
  onEx2AudioChange?: (field: string, value: string) => void;
  onEx3aOrderChange?: (id: string, value: string) => void;
  onEx3bContactChange?: (id: string, value: string) => void;
  onEx4aDialogueChange?: (id: string, value: string) => void;
  onEx5PersonalChange?: (field: string, value: string) => void;
  onEx6PartnerChange?: (field: string, value: string) => void;

  onWordsearchChange?: (found: Record<string, string>) => void;
  onEx2aOrderChange?: (id: string, value: string) => void;
  onEx2bShortChange?: (id: string, value: string) => void;
  onEx3BeChange?: (id: string, value: string) => void;
  onEx4JobsChange?: (id: string, value: string) => void;
  onEx5IsIsntChange?: (id: string, value: string) => void;
  onEx6CorrectionsChange?: (id: string, value: string) => void;
  onEx7aNationalitiesChange?: (id: string, value: string) => void;
  onEx7bPeopleChange?: (field: string, value: string) => void;
  onEx8AlternativesChange?: (id: string, value: string) => void;
  onEx9TextChange?: (id: string, value: string) => void;
  onReflectChange?: (id: string, value: string | number) => void;

  originalAnswers?: {
    exercise_1_location?: unknown;
    exercise_2_audio?: Record<string, string>;
    exercise_3b_contact?: Record<string, string>;
    exercise_4a_dialogue?: Record<string, string>;
    exercise_1_wordsearch?: Record<string, string>;
    exercise_2a_order?: Record<string, string>;
    exercise_3_be?: Record<string, string>;
    exercise_4_jobs?: Record<string, string>;
    exercise_5_is_isnt?: Record<string, string>;
    exercise_6_corrections?: Record<string, string>;
    exercise_7a_nationalities?: Record<string, string>;
    exercise_8_alternatives?: Record<string, string>;
    exercise_9_text?: Record<string, string>;
    [key: string]: unknown;
  };
}

// 10x10 Wordsearch definition
const WORDSEARCH_MATRIX = [
  ['P', 'L', 'B', 'R', 'A', 'Z', 'I', 'L', 'L', 'M'],
  ['O', 'T', 'U', 'X', 'O', 'P', 'R', 'N', 'N', 'E'],
  ['L', 'U', 'R', 'I', 'T', 'A', 'L', 'Y', 'K', 'X'],
  ['A', 'R', 'G', 'E', 'N', 'T', 'I', 'N', 'A', 'I'],
  ['N', 'K', 'J', 'A', 'P', 'A', 'N', 'S', 'F', 'C'],
  ['D', 'E', 'K', 'Z', 'Z', 'O', 'N', 'B', 'T', 'O'],
  ['B', 'Y', 'U', 'S', 'P', 'A', 'I', 'N', 'K', 'C'],
  ['T', 'H', 'A', 'I', 'L', 'A', 'N', 'D', 'R', 'S'],
  ['U', 'K', 'V', 'S', 'J', 'J', 'K', 'P', 'K', 'N'],
  ['C', 'A', 'N', 'A', 'D', 'A', 'I', 'B', 'B', 'E'],
];

// Target 10 countries and their cell coordinates [row, col]
const TARGET_WORDS: Record<string, { name: string; cells: [number, number][] }> = {
  poland: {
    name: 'Poland',
    cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]],
  },
  turkey: {
    name: 'Turkey',
    cells: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
  },
  mexico: {
    name: 'Mexico',
    cells: [[0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9]],
  },
  brazil: {
    name: 'Brazil',
    cells: [[0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
  },
  italy: {
    name: 'Italy',
    cells: [[2, 3], [2, 4], [2, 5], [2, 6], [2, 7]],
  },
  argentina: {
    name: 'Argentina',
    cells: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8]],
  },
  japan: {
    name: 'Japan',
    cells: [[4, 2], [4, 3], [4, 4], [4, 5], [4, 6]],
  },
  spain: {
    name: 'Spain',
    cells: [[6, 3], [6, 4], [6, 5], [6, 6], [6, 7]],
  },
  thailand: {
    name: 'Thailand',
    cells: [[7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7]],
  },
  canada: {
    name: 'Canada',
    cells: [[9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5]],
  },
};

export default function Lesson1DContent({
  readOnly = false,
  isTeacherReview = false,
  answerKey = null,
  playAudio,
  playingAudio,
  submissionId,
  submittedAudios,
  onAudioBlobChange,

  // Page 12
  ex1Location = '',
  ex2Audio = {},
  ex3bContact = {},
  ex4aDialogue = {},
  ex5Personal = {},
  ex6Partner = {},

  // Page 13
  wordsearchFound = { poland: 'Poland' },
  ex2aOrder = {},
  ex3Be = {},
  ex4Jobs = {},
  ex5IsIsnt = {},
  ex6Corrections = {},
  ex7aNationalities = {},
  ex8Alternatives = {},
  ex9Text = {},
  reflectScores = {},

  // Handlers
  onEx1LocationChange = () => {},
  onEx2AudioChange = () => {},
  onEx3bContactChange = () => {},
  onEx4aDialogueChange = () => {},
  onEx5PersonalChange = () => {},
  onEx6PartnerChange = () => {},

  onWordsearchChange = () => {},
  onEx2aOrderChange = () => {},
  onEx3BeChange = () => {},
  onEx4JobsChange = () => {},
  onEx5IsIsntChange = () => {},
  onEx6CorrectionsChange = () => {},
  onEx7aNationalitiesChange = () => {},
  onEx8AlternativesChange = () => {},
  onEx9TextChange = () => {},
  onReflectChange = () => {},

  originalAnswers,
}: Lesson1DContentProps) {
  const isReview = Boolean(isTeacherReview || (answerKey && readOnly));

  const ex1Key = getExerciseKey(answerKey, 'exercise_1_location');
  const ex2Key = getExerciseKey(answerKey, 'exercise_2_audio');
  const ex3bKey = getExerciseKey(answerKey, 'exercise_3b_contact');
  const ex4aKey = getExerciseKey(answerKey, 'exercise_4a_dialogue');
  const ex2aKey = getExerciseKey(answerKey, 'exercise_2a_order');
  const ex3BeKey = getExerciseKey(answerKey, 'exercise_3_be');
  const ex4JobsKey = getExerciseKey(answerKey, 'exercise_4_jobs');
  const ex5IsIsntKey = getExerciseKey(answerKey, 'exercise_5_is_isnt');
  const ex6Key = getExerciseKey(answerKey, 'exercise_6_corrections');
  const ex7aKey = getExerciseKey(answerKey, 'exercise_7a_nationalities');
  const ex8Key = getExerciseKey(answerKey, 'exercise_8_alternatives');
  const ex9Key = getExerciseKey(answerKey, 'exercise_9_text');

  // Wordsearch selection state: array of [row, col]
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [lastMessage, setLastMessage] = useState<string>('');

  // Compute all cells that are currently marked as found
  const foundCellSet = useMemo(() => {
    const set = new Set<string>();
    for (const [key] of Object.entries(wordsearchFound)) {
      const lowerKey = key.toLowerCase();
      if (TARGET_WORDS[lowerKey]) {
        for (const [r, c] of TARGET_WORDS[lowerKey].cells) {
          set.add(`${r},${c}`);
        }
      }
    }
    return set;
  }, [wordsearchFound]);

  // Handle cell click on wordsearch
  const handleCellClick = (r: number, c: number) => {
    if (readOnly) return;

    // Check if cell is already selected
    const existingIndex = selectedCells.findIndex(([sr, sc]) => sr === r && sc === c);
    let nextCells: [number, number][];

    if (existingIndex >= 0) {
      nextCells = selectedCells.filter((_, idx) => idx !== existingIndex);
    } else {
      nextCells = [...selectedCells, [r, c]];
    }

    setSelectedCells(nextCells);

    // Form selected letters
    const letters = nextCells.map(([cr, cc]) => WORDSEARCH_MATRIX[cr][cc]).join('');
    const lettersRev = letters.split('').reverse().join('');

    // Check if letters match any target country
    for (const [key, wordInfo] of Object.entries(TARGET_WORDS)) {
      if (wordsearchFound[key]) continue;

      const targetUpper = wordInfo.name.toUpperCase();
      if (letters.toUpperCase() === targetUpper || lettersRev.toUpperCase() === targetUpper) {
        const updated = { ...wordsearchFound, [key]: wordInfo.name };
        onWordsearchChange(updated);
        setSelectedCells([]);
        setLastMessage(`🎉 Found: ${wordInfo.name}!`);
        setTimeout(() => setLastMessage(''), 2500);
        return;
      }
    }
  };

  const clearSelection = () => {
    setSelectedCells([]);
  };

  const isCellSelected = (r: number, c: number) => {
    return selectedCells.some(([sr, sc]) => sr === r && sc === c);
  };

  const isCellInFoundWords = (r: number, c: number) => {
    return foundCellSet.has(`${r},${c}`);
  };

  // Original answer extraction for revisions diff
  const origLocation = originalAnswers?.exercise_1_location;
  const origAudio = originalAnswers?.exercise_2_audio;
  const origContact = originalAnswers?.exercise_3b_contact;
  const origDialogue = originalAnswers?.exercise_4a_dialogue;
  const origOrder = originalAnswers?.exercise_2a_order;
  const origBe = originalAnswers?.exercise_3_be;
  const origJobs = originalAnswers?.exercise_4_jobs;
  const origIsIsnt = originalAnswers?.exercise_5_is_isnt;
  const origCorrections = originalAnswers?.exercise_6_corrections;
  const origNationalities = originalAnswers?.exercise_7a_nationalities;
  const origAlternatives = originalAnswers?.exercise_8_alternatives;
  const origText = originalAnswers?.exercise_9_text;

  // Ex 1 verification
  const ex1Verified = isReview
    ? verifyAnswer(
        ex1Location,
        ex1Key?.['1'] || ex1Key?.['location'] || (typeof ex1Key === 'string' || Array.isArray(ex1Key) ? ex1Key : undefined)
      )
    : null;
  const origLocVal =
    origLocation && typeof origLocation === 'object' && '1' in origLocation
      ? String((origLocation as Record<string, string>)['1'])
      : typeof origLocation === 'string'
      ? origLocation
      : undefined;
  const isEx1Changed = origLocVal !== undefined && origLocVal !== ex1Location;

  return (
    <div className={styles.pageContainer}>
      {/* ========================================================================= */}
      {/* ===================== PAGE 12: 1D ENGLISH IN ACTION ==================== */}
      {/* ========================================================================= */}
      <section className={styles.textbookPage12}>
        {/* Header Ribbon */}
        <header className={styles.headerBanner12}>
          <div className={styles.headerContent12}>
            <svg viewBox="0 0 430 126" className={styles.chevronsSvg} preserveAspectRatio="none" aria-hidden="true">
              <polygon points="28,22 146,22 184,74 146,126 28,126 66,74" fill="#d3232a" />
              <polygon points="160,22 190,22 228,74 190,126 160,126 198,74" fill="#e06a59" />
              <polygon points="204,22 234,22 272,74 234,126 204,126 242,74" fill="#ea9384" />
              <polygon points="248,22 278,22 316,74 278,126 248,126 286,74" fill="#f3bcb1" />
            </svg>

            <div className={styles.badge1D}>
              <span className={styles.num1}>1</span>
              <span className={styles.letterD}>D</span>
            </div>

            <h1 className={styles.titleHeading12}>English in action</h1>
          </div>
        </header>

        {/* Goal Banner */}
        <div className={styles.goalBanner12}>
          <strong style={{ fontWeight: 800 }}>Goal:</strong>
          <span>ask for and give contact information</span>
        </div>

        {/* Two-Column Grid */}
        <div className={styles.grid12}>
          {/* Left Column: Exercises 1, 2, 3, 4 */}
          <div className={styles.leftCol12}>
            {/* Exercise 1 */}
            <div>
              <p className={styles.exTitle}>
                <span className={styles.exNum}>1</span>
                <span>Look at the photo. Work in pairs. Where are the people?</span>
              </p>
              <div className={styles.choiceList}>
                {[
                  { key: 'a', label: 'a at a conference' },
                  { key: 'b', label: 'b in a language school' },
                  { key: 'c', label: 'c in a hotel' },
                ].map((opt) => {
                  const isChecked = ex1Location === opt.key;
                  const vRes = isReview && isChecked ? ex1Verified : null;
                  const validClass =
                    vRes?.status === 'correct'
                      ? styles.choiceValid
                      : vRes?.status === 'incorrect'
                      ? styles.choiceInvalid
                      : '';

                  return (
                    <label
                      key={opt.key}
                      className={`${styles.choiceCard} ${validClass} ${isEx1Changed && isChecked ? styles.diffHighlight : ''}`}
                    >
                      <input
                        type="radio"
                        name="ex1Location"
                        value={opt.key}
                        checked={isChecked}
                        onChange={(e) => onEx1LocationChange(e.target.value)}
                        disabled={readOnly}
                      />
                      <span>{opt.label}</span>
                      {isChecked && vRes?.status === 'correct' && (
                        <span className={styles.correctBadge} style={{ marginLeft: 'auto' }}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {ex1Verified && ex1Verified.status !== 'correct' && (
                <div className={styles.feedbackRow}>
                  <TeacherAnswerBadge result={ex1Verified} isTeacherReview={isReview} className={styles.teacherBadge} />
                </div>
              )}
            </div>

            {/* Exercise 2 */}
            <div>
              <p className={styles.exTitle}>
                <span className={styles.exNum}>2</span>
                <button
                  type="button"
                  onClick={() => playAudio('1.14')}
                  className={`${styles.audioBtn} ${playingAudio === '1.14' ? styles.playing : ''}`}
                  disabled={readOnly}
                  aria-label="Play audio track 1.14"
                >
                  <span className={styles.diamondIcon}>
                    <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                  </span>
                  <span>1.14</span>
                  <span>{playingAudio === '1.14' ? 'Playing...' : 'Audio'}</span>
                </button>
                <span>Listen to the conversation. Who is the student? Where is she from?</span>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {/* 2. Student */}
                {(() => {
                  const currentVal = ex2Audio.student || '';
                  const origVal = origAudio?.student;
                  const isChanged = origVal !== undefined && origVal !== currentVal;
                  const vRes = isReview ? verifyAnswer(currentVal, ex2Key?.['student']) : null;
                  const validClass =
                    vRes?.status === 'correct'
                      ? styles.inputValid
                      : vRes?.status === 'incorrect'
                      ? styles.inputInvalid
                      : '';

                  return (
                    <div className={styles.orderCard}>
                      <div className={styles.orderInputRow}>
                        <label style={{ fontWeight: 700, minWidth: '70px', color: '#1e293b' }}>Student:</label>
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => onEx2AudioChange('student', e.target.value)}
                          disabled={readOnly}
                          placeholder="e.g. Selin"
                          className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                          style={{ flex: 1 }}
                        />
                        {vRes?.status === 'correct' && (
                          <span className={styles.correctBadge}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                          </span>
                        )}
                      </div>
                      {vRes && vRes.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 2. From */}
                {(() => {
                  const currentVal = ex2Audio.country || '';
                  const origVal = origAudio?.country;
                  const isChanged = origVal !== undefined && origVal !== currentVal;
                  const vRes = isReview ? verifyAnswer(currentVal, ex2Key?.['country']) : null;
                  const validClass =
                    vRes?.status === 'correct'
                      ? styles.inputValid
                      : vRes?.status === 'incorrect'
                      ? styles.inputInvalid
                      : '';

                  return (
                    <div className={styles.orderCard}>
                      <div className={styles.orderInputRow}>
                        <label style={{ fontWeight: 700, minWidth: '70px', color: '#1e293b' }}>From:</label>
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => onEx2AudioChange('country', e.target.value)}
                          disabled={readOnly}
                          placeholder="e.g. Turkey"
                          className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                          style={{ flex: 1 }}
                        />
                        {vRes?.status === 'correct' && (
                          <span className={styles.correctBadge}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                          </span>
                        )}
                      </div>
                      {vRes && vRes.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Exercise 3a */}
            <div>
              <p className={styles.exTitle}>
                <span className={styles.exNum}>3</span>
                <span className={styles.exSub}>a</span>
                <span>Read the Useful phrases box. Listen to the conversation again and number the phrases in the order that you hear them.</span>
              </p>
            </div>

            {/* Useful Phrases Box */}
            <div className={styles.usefulPhrasesBox}>
              <h3>Useful phrases</h3>

              <div className={styles.group}>
                <strong>Asking for information</strong>
                <p>What&apos;s your first name? <PronounceButton word="What's your first name?" size="small" /></p>
                <p>What&apos;s your family name? <PronounceButton word="What's your family name?" size="small" /></p>
                <p>What&apos;s your phone number? <PronounceButton word="What's your phone number?" size="small" /></p>
                <p>What&apos;s your email address? <PronounceButton word="What's your email address?" size="small" /></p>
              </div>

              <div className={styles.group}>
                <strong>Checking information</strong>
                <p>Sorry, can you say that again? <PronounceButton word="Sorry, can you say that again?" size="small" /></p>
                <p>How do you spell (your first name)? <PronounceButton word="How do you spell your first name?" size="small" /></p>
              </div>

              <div className={styles.group}>
                <strong>Giving information</strong>
                <p>My first name is (Selin). <PronounceButton word="My first name is Selin." size="small" /></p>
                <p>My family name is (Atakan). <PronounceButton word="My family name is Atakan." size="small" /></p>
                <p>My number is (020-555-7645). <PronounceButton word="My number is 0 2 0, 5 5 5, 7 6 4 5" size="small" /></p>
                <p>My email address is (selin2000@dmail.com). <PronounceButton word="My email address is selin 2000 at d mail dot com" size="small" /></p>
              </div>
            </div>

            {/* Exercise 3b */}
            <div>
              <p className={styles.exTitle}>
                <span className={styles.exSub}>b</span>
                <span>Listen again and complete the form.</span>
              </p>
              <div style={{ marginTop: '8px' }}>
                <div className={styles.contactCardFrame}>
                  <div className={styles.contactCardInner}>
                    <div className={styles.cardHeader}>NEW CONTACT</div>
                    <div className={styles.cardRows}>
                      {[
                        { id: '1', placeholder: 'First name', sample: ': Selin' },
                        { id: '2', placeholder: 'Family name', sample: ': Atakan' },
                        { id: '3', placeholder: 'Phone number', sample: ': 020-555-7645' },
                        { id: '4', placeholder: 'Email address', sample: ': selin2000@dmail.com' },
                      ].map((field) => {
                        const currentVal = ex3bContact[field.id] || '';
                        const origVal = origContact?.[field.id];
                        const isChanged = origVal !== undefined && origVal !== currentVal;
                        const vRes = isReview ? verifyAnswer(currentVal, ex3bKey?.[field.id]) : null;
                        const validClass =
                          vRes?.status === 'correct'
                            ? styles.inputValid
                            : vRes?.status === 'incorrect'
                            ? styles.inputInvalid
                            : '';

                        return (
                          <div key={field.id} className={styles.contactItem}>
                            <div className={styles.cardRow}>
                              <span className={styles.fieldIndex}>{field.id}.</span>
                              <input
                                type="text"
                                value={currentVal}
                                onChange={(e) => onEx3bContactChange(field.id, e.target.value)}
                                disabled={readOnly}
                                placeholder={field.placeholder}
                                className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                                style={{ minWidth: '130px', flex: 1 }}
                              />
                              <span className={styles.contactValue}>{field.sample}</span>
                              {vRes?.status === 'correct' && (
                                <span className={styles.correctBadge}>
                                  <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                                </span>
                              )}
                            </div>
                            {vRes && vRes.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 4a */}
            <div>
              <p className={styles.exTitle}>
                <span className={styles.exNum}>4</span>
                <span className={styles.exSub}>a</span>
                <span>Complete the conversation with the correct questions. Use the Useful phrases to help you.</span>
              </p>

              <div className={styles.dialogueBox}>
                {[
                  {
                    id: '1',
                    prefix: 'A: ',
                    suffix: '?',
                    bText: 'Dieter Neumann.',
                    placeholder: "e.g. What's your name",
                  },
                  {
                    id: '2',
                    prefix: 'A: ',
                    suffix: ' first name?',
                    bText: 'D - I - E - T - E - R.',
                    placeholder: 'e.g. How do you spell your',
                  },
                  {
                    id: '3',
                    prefix: 'A: And ',
                    suffix: ' again?',
                    bText: "Neumann. That's N - E - U - M - A - N - N.",
                    placeholder: "e.g. what's your family name",
                  },
                  {
                    id: '4',
                    prefix: 'A: ',
                    suffix: '?',
                    bText: "It's 07700 900617.",
                    placeholder: "e.g. What's your phone number",
                  },
                  {
                    id: '5',
                    prefix: 'A: Sorry, ',
                    suffix: '?',
                    bText: '07700 900617.',
                    placeholder: 'e.g. can you say that again',
                  },
                  {
                    id: '6',
                    prefix: 'A: And ',
                    suffix: '?',
                    bText: "It's dietern@intertalk.com.",
                    placeholder: "e.g. what's your email address",
                  },
                ].map((turn) => {
                  const currentVal = ex4aDialogue[turn.id] || '';
                  const origVal = origDialogue?.[turn.id];
                  const isChanged = origVal !== undefined && origVal !== currentVal;
                  const vRes = isReview ? verifyAnswer(currentVal, ex4aKey?.[turn.id]) : null;
                  const validClass =
                    vRes?.status === 'correct'
                      ? styles.inputValid
                      : vRes?.status === 'incorrect'
                      ? styles.inputInvalid
                      : '';

                  return (
                    <div key={turn.id} className={styles.dialogueTurn}>
                      <div className={styles.dialoguePromptRow}>
                        <strong>{turn.prefix}</strong>
                        <span className={styles.fieldIndex}><sup>{turn.id}</sup></span>
                        <div className={styles.dialogueInputWrap}>
                          <input
                            type="text"
                            value={currentVal}
                            onChange={(e) => onEx4aDialogueChange(turn.id, e.target.value)}
                            disabled={readOnly}
                            placeholder={turn.placeholder}
                            className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                            style={{ flex: 1, minWidth: '150px' }}
                          />
                          <span>{turn.suffix}</span>
                          {vRes?.status === 'correct' && (
                            <span className={styles.correctBadge}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={styles.dialogueAnswer}>
                        <strong>B: </strong> {turn.bText}
                      </div>
                      {vRes && vRes.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 4b Audio */}
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className={styles.exSub}>b</span>
                <button
                  type="button"
                  onClick={() => playAudio('1.15')}
                  className={`${styles.audioBtn} ${playingAudio === '1.15' ? styles.playing : ''}`}
                  disabled={readOnly}
                  aria-label="Play audio track 1.15"
                >
                  <span className={styles.diamondIcon}>
                    <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                  </span>
                  <span>1.15</span>
                  <span>{playingAudio === '1.15' ? 'Playing...' : 'Audio'}</span>
                </button>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Listen, check and repeat.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Photo, Exercise 5 & 6 */}
          <div className={styles.rightCol12}>
            {/* Top Photo */}
            <div className={styles.photoWrapper}>
              <Image
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80"
                alt="Two people talking in a language school"
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            </div>

            {/* Exercise 5 */}
            <div>
              <p className={styles.exTitle}>
                <span className={styles.exNum}>5</span>
                <span>Complete the form with your information.</span>
              </p>

              <div style={{ marginTop: '8px' }}>
                <div className={styles.contactCardFrame}>
                  <div className={styles.contactCardInner}>
                    <div className={styles.cardHeader}>NEW CONTACT (YOUR INFO)</div>
                    <div className={styles.cardRows}>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>First name:</span>
                        <input
                          type="text"
                          value={ex5Personal.firstName || ''}
                          onChange={(e) => onEx5PersonalChange('firstName', e.target.value)}
                          disabled={readOnly}
                          placeholder="Your first name"
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>Family name:</span>
                        <input
                          type="text"
                          value={ex5Personal.familyName || ''}
                          onChange={(e) => onEx5PersonalChange('familyName', e.target.value)}
                          disabled={readOnly}
                          placeholder="Your family name"
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>Phone number:</span>
                        <input
                          type="text"
                          value={ex5Personal.phone || ''}
                          onChange={(e) => onEx5PersonalChange('phone', e.target.value)}
                          disabled={readOnly}
                          placeholder="Your phone number"
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>Email address:</span>
                        <input
                          type="text"
                          value={ex5Personal.email || ''}
                          onChange={(e) => onEx5PersonalChange('email', e.target.value)}
                          disabled={readOnly}
                          placeholder="Your email address"
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 6 */}
            <div>
              <p className={styles.exTitle}>
                <span className={styles.exNum}>6</span>
                <span>Work in pairs. Ask and answer questions to complete the form with your partner&apos;s information.</span>
              </p>

              <div style={{ marginTop: '8px' }}>
                <div className={styles.contactCardFrame}>
                  <div className={styles.contactCardInner}>
                    <div className={styles.cardHeader}>NEW CONTACT (PARTNER&apos;S INFO)</div>
                    <div className={styles.cardRows}>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>First name:</span>
                        <input
                          type="text"
                          value={ex6Partner.firstName || ''}
                          onChange={(e) => onEx6PartnerChange('firstName', e.target.value)}
                          disabled={readOnly}
                          placeholder="Partner's first name"
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>Family name:</span>
                        <input
                          type="text"
                          value={ex6Partner.familyName || ''}
                          onChange={(e) => onEx6PartnerChange('familyName', e.target.value)}
                          disabled={readOnly}
                          placeholder="Partner's family name"
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>Phone number:</span>
                        <input
                          type="text"
                          value={ex6Partner.phone || ''}
                          onChange={(e) => onEx6PartnerChange('phone', e.target.value)}
                          disabled={readOnly}
                          placeholder="Partner's phone number"
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className={styles.cardRow}>
                        <span className={styles.cardLabel}>Email address:</span>
                        <input
                          type="text"
                          value={ex6Partner.email || ''}
                          onChange={(e) => onEx6PartnerChange('email', e.target.value)}
                          disabled={readOnly}
                          placeholder="Partner's email address"
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Устное задание к упражнению 6: запись диалога в парах */}
                {!readOnly && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <AudioAnswerRecorder
                      onAudioChange={onAudioBlobChange}
                      readOnly={readOnly}
                    />
                  </div>
                )}

                {/* Прослушивание отправленной аудиозаписи */}
                {submissionId && (
                  <SubmissionAudioPlayer
                    submissionId={submissionId}
                    exerciseKey="exercise_6"
                    audios={submittedAudios}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page 12 Pin */}
        <div className={`${styles.pageNumberBadge} ${styles.left}`}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#d3232a', background: '#fee2e2', padding: '2px 8px', borderRadius: '4px' }}>
            Page 12
          </span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* =================== PAGE 13: CHECK AND REFLECT ========================= */}
      {/* ========================================================================= */}
      <section className={styles.textbookPage13}>
        {/* Striped Top Bar */}
        <div className={styles.stripedTopBar}></div>
        <div className={styles.stripedRightBar}></div>

        <div className={styles.contentWrap13}>
          <h1 className={styles.titleHeading13}>Check and reflect</h1>

          <div className={styles.grid13}>
            {/* Left Column: Exercises 1 - 5 */}
            <div className={styles.leftCol13}>
              {/* Exercise 1: INTERACTIVE WORDSEARCH */}
              <div className={styles.wordsearchContainer}>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>1</span>
                  <span>Find the ten countries in the wordsearch.</span>
                </p>

                {/* Countries Word Bank */}
                <div className={styles.wordBank}>
                  <div className={styles.wordBankGrid}>
                    {Object.entries(TARGET_WORDS).map(([key, item]) => {
                      const isFound = Boolean(wordsearchFound[key]);
                      return (
                        <span
                          key={key}
                          className={`${styles.bankWord} ${isFound ? styles.found : ''}`}
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '4px' }}
                        >
                          <span>{item.name} {isFound ? '✓' : ''}</span>
                          <PronounceButton word={item.name} size="small" />
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Wordsearch Grid with touch scroll */}
                <div className={styles.wordsearchWrapper}>
                  <table className={styles.wordsearchTable}>
                    <tbody>
                      {WORDSEARCH_MATRIX.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((letter, cIdx) => {
                            const isSelected = isCellSelected(rIdx, cIdx);
                            const isFound = isCellInFoundWords(rIdx, cIdx);

                            return (
                              <td
                                key={cIdx}
                                onClick={() => handleCellClick(rIdx, cIdx)}
                                className={`${isSelected ? styles.selected : ''} ${isFound ? styles.foundCell : ''}`}
                                title={`Row ${rIdx + 1}, Col ${cIdx + 1}: ${letter}`}
                              >
                                {letter}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Wordsearch status & clear action */}
                <div className={styles.wordsearchStatus}>
                  <div>
                    <span>Found: </span>
                    <span className={styles.countBadge}>
                      {Object.keys(wordsearchFound).length} / 10
                    </span>
                    {lastMessage && <span style={{ marginLeft: '8px', color: '#16a34a', fontWeight: 700 }}>{lastMessage}</span>}
                  </div>
                  {selectedCells.length > 0 && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className={styles.clearBtn}
                    >
                      Clear selection ({selectedCells.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Exercise 2a: Word order */}
              <div style={{ marginTop: '0.5rem' }}>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>2</span>
                  <span className={styles.exSub}>a</span>
                  <span>Put the words in the correct order to make sentences.</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <div className={styles.orderCard}>
                    <div className={styles.orderPromptRow}>
                      <span className={styles.orderPromptText}>
                        <strong style={{ marginRight: '6px' }}>1.</strong>
                        <span>from / I / Brazil / am</span>
                      </span>
                    </div>
                    <p className={styles.exampleBlue} style={{ margin: 0, paddingLeft: '18px' }}>I am from Brazil.</p>
                  </div>

                  {[
                    { id: '2', prompt: 'am / London / from / not / I' },
                    { id: '3', prompt: 'you / class / my / in / Are ?' },
                    { id: '4', prompt: 'are / Where / from / you ?' },
                    { id: '5', prompt: 'my / you / are / No, / in / class / not' },
                  ].map((item) => {
                    const currentVal = ex2aOrder[item.id] || '';
                    const origVal = origOrder?.[item.id];
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex2aKey?.[item.id]) : null;
                    const validClass =
                      vRes?.status === 'correct'
                        ? styles.inputValid
                        : vRes?.status === 'incorrect'
                        ? styles.inputInvalid
                        : '';

                    return (
                      <div key={item.id} className={styles.orderCard}>
                        <div className={styles.orderPromptRow}>
                          <span className={styles.orderPromptText}>
                            <strong style={{ marginRight: '6px' }}>{item.id}.</strong>
                            <span>{item.prompt}</span>
                          </span>
                          {vRes?.status === 'correct' && (
                            <span className={styles.correctBadge}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                            </span>
                          )}
                        </div>
                        <div className={styles.orderInputRow}>
                          <input
                            type="text"
                            value={currentVal}
                            onChange={(e) => onEx2aOrderChange(item.id, e.target.value)}
                            disabled={readOnly}
                            placeholder="Write the sentence..."
                            className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '100%' }}
                          />
                        </div>
                        {vRes && vRes.status !== 'correct' && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exercise 3: be forms */}
              <div style={{ marginTop: '0.5rem' }}>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>3</span>
                  <span>Complete the sentences with the correct form of <em style={{ fontStyle: 'italic' }}>be</em>. Use short forms.</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                  {/* Dialogue 1 */}
                  {(() => {
                    const val1a = ex3Be['1_a'] || '';
                    const val1b = ex3Be['1_b'] || '';
                    const vRes1a = isReview ? verifyAnswer(val1a, ex3BeKey?.['1_a']) : null;
                    const vRes1b = isReview ? verifyAnswer(val1b, ex3BeKey?.['1_b']) : null;
                    const is1aChanged = origBe?.['1_a'] !== undefined && origBe?.['1_a'] !== val1a;
                    const is1bChanged = origBe?.['1_b'] !== undefined && origBe?.['1_b'] !== val1b;

                    return (
                      <div className={styles.beSentenceCard}>
                        <div className={styles.beDialogueText}>
                          <strong>1. </strong>
                          <span>A: </span>
                          <input
                            type="text"
                            value={val1a}
                            onChange={(e) => onEx3BeChange('1_a', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            className={`${styles.gapInput} ${vRes1a?.status === 'correct' ? styles.inputValid : vRes1a?.status === 'incorrect' ? styles.inputInvalid : ''} ${is1aChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '55px' }}
                          />
                          {vRes1a?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes1a} isTeacherReview={isReview} /></span>}
                          <span> you from Spain? B: No, I </span>
                          <input
                            type="text"
                            value={val1b}
                            onChange={(e) => onEx3BeChange('1_b', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            className={`${styles.gapInput} ${vRes1b?.status === 'correct' ? styles.inputValid : vRes1b?.status === 'incorrect' ? styles.inputInvalid : ''} ${is1bChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '55px' }}
                          />
                          {vRes1b?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes1b} isTeacherReview={isReview} /></span>}
                          <span> from Mexico.</span>
                        </div>
                        {((vRes1a && vRes1a.status !== 'correct') || (vRes1b && vRes1b.status !== 'correct')) && (
                          <div className={styles.sentenceFeedbackList}>
                            {vRes1a && vRes1a.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes1a} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                            {vRes1b && vRes1b.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes1b} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Dialogue 2 */}
                  {(() => {
                    const val2a1 = ex3Be['2_a1'] || '';
                    const val2a2 = ex3Be['2_a2'] || '';
                    const val2b1 = ex3Be['2_b1'] || '';
                    const val2b2 = ex3Be['2_b2'] || '';

                    const vRes2a1 = isReview ? verifyAnswer(val2a1, ex3BeKey?.['2_a1']) : null;
                    const vRes2a2 = isReview ? verifyAnswer(val2a2, ex3BeKey?.['2_a2']) : null;
                    const vRes2b1 = isReview ? verifyAnswer(val2b1, ex3BeKey?.['2_b1']) : null;
                    const vRes2b2 = isReview ? verifyAnswer(val2b2, ex3BeKey?.['2_b2']) : null;

                    const is2a1Changed = origBe?.['2_a1'] !== undefined && origBe?.['2_a1'] !== val2a1;
                    const is2a2Changed = origBe?.['2_a2'] !== undefined && origBe?.['2_a2'] !== val2a2;
                    const is2b1Changed = origBe?.['2_b1'] !== undefined && origBe?.['2_b1'] !== val2b1;
                    const is2b2Changed = origBe?.['2_b2'] !== undefined && origBe?.['2_b2'] !== val2b2;

                    return (
                      <div className={styles.beSentenceCard}>
                        <div className={styles.beDialogueText}>
                          <strong>2. </strong>
                          <span>A: I </span>
                          <input
                            type="text"
                            value={val2a1}
                            onChange={(e) => onEx3BeChange('2_a1', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            className={`${styles.gapInput} ${vRes2a1?.status === 'correct' ? styles.inputValid : vRes2a1?.status === 'incorrect' ? styles.inputInvalid : ''} ${is2a1Changed ? styles.diffHighlight : ''}`}
                            style={{ width: '50px' }}
                          />
                          {vRes2a1?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes2a1} isTeacherReview={isReview} /></span>}
                          <span> in Class 4. </span>
                          <input
                            type="text"
                            value={val2a2}
                            onChange={(e) => onEx3BeChange('2_a2', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            className={`${styles.gapInput} ${vRes2a2?.status === 'correct' ? styles.inputValid : vRes2a2?.status === 'incorrect' ? styles.inputInvalid : ''} ${is2a2Changed ? styles.diffHighlight : ''}`}
                            style={{ width: '50px' }}
                          />
                          {vRes2a2?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes2a2} isTeacherReview={isReview} /></span>}
                          <span> you? B: No, I </span>
                          <input
                            type="text"
                            value={val2b1}
                            onChange={(e) => onEx3BeChange('2_b1', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            className={`${styles.gapInput} ${vRes2b1?.status === 'correct' ? styles.inputValid : vRes2b1?.status === 'incorrect' ? styles.inputInvalid : ''} ${is2b1Changed ? styles.diffHighlight : ''}`}
                            style={{ width: '68px' }}
                          />
                          {vRes2b1?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes2b1} isTeacherReview={isReview} /></span>}
                          <span>. I </span>
                          <input
                            type="text"
                            value={val2b2}
                            onChange={(e) => onEx3BeChange('2_b2', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            className={`${styles.gapInput} ${vRes2b2?.status === 'correct' ? styles.inputValid : vRes2b2?.status === 'incorrect' ? styles.inputInvalid : ''} ${is2b2Changed ? styles.diffHighlight : ''}`}
                            style={{ width: '50px' }}
                          />
                          {vRes2b2?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes2b2} isTeacherReview={isReview} /></span>}
                          <span> in Class 3.</span>
                        </div>
                        {((vRes2a1 && vRes2a1.status !== 'correct') ||
                          (vRes2a2 && vRes2a2.status !== 'correct') ||
                          (vRes2b1 && vRes2b1.status !== 'correct') ||
                          (vRes2b2 && vRes2b2.status !== 'correct')) && (
                          <div className={styles.sentenceFeedbackList}>
                            {vRes2a1 && vRes2a1.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes2a1} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                            {vRes2a2 && vRes2a2.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes2a2} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                            {vRes2b1 && vRes2b1.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes2b1} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                            {vRes2b2 && vRes2b2.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes2b2} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Dialogue 3 */}
                  {(() => {
                    const val3a1 = ex3Be['3_a1'] || '';
                    const val3a2 = ex3Be['3_a2'] || '';
                    const val3b = ex3Be['3_b'] || '';

                    const vRes3a1 = isReview ? verifyAnswer(val3a1, ex3BeKey?.['3_a1']) : null;
                    const vRes3a2 = isReview ? verifyAnswer(val3a2, ex3BeKey?.['3_a2']) : null;
                    const vRes3b = isReview ? verifyAnswer(val3b, ex3BeKey?.['3_b']) : null;

                    const is3a1Changed = origBe?.['3_a1'] !== undefined && origBe?.['3_a1'] !== val3a1;
                    const is3a2Changed = origBe?.['3_a2'] !== undefined && origBe?.['3_a2'] !== val3a2;
                    const is3bChanged = origBe?.['3_b'] !== undefined && origBe?.['3_b'] !== val3b;

                    return (
                      <div className={styles.beSentenceCard}>
                        <div className={styles.beDialogueText}>
                          <strong>3. </strong>
                          <span>A: Hi, I </span>
                          <input
                            type="text"
                            value={val3a1}
                            onChange={(e) => onEx3BeChange('3_a1', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            className={`${styles.gapInput} ${vRes3a1?.status === 'correct' ? styles.inputValid : vRes3a1?.status === 'incorrect' ? styles.inputInvalid : ''} ${is3a1Changed ? styles.diffHighlight : ''}`}
                            style={{ width: '50px' }}
                          />
                          {vRes3a1?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes3a1} isTeacherReview={isReview} /></span>}
                          <span> Tomoko. I </span>
                          <input
                            type="text"
                            value={val3a2}
                            onChange={(e) => onEx3BeChange('3_a2', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            className={`${styles.gapInput} ${vRes3a2?.status === 'correct' ? styles.inputValid : vRes3a2?.status === 'incorrect' ? styles.inputInvalid : ''} ${is3a2Changed ? styles.diffHighlight : ''}`}
                            style={{ width: '50px' }}
                          />
                          {vRes3a2?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes3a2} isTeacherReview={isReview} /></span>}
                          <span> from Japan. B: Nice to meet you. I </span>
                          <input
                            type="text"
                            value={val3b}
                            onChange={(e) => onEx3BeChange('3_b', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            className={`${styles.gapInput} ${vRes3b?.status === 'correct' ? styles.inputValid : vRes3b?.status === 'incorrect' ? styles.inputInvalid : ''} ${is3bChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '50px' }}
                          />
                          {vRes3b?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes3b} isTeacherReview={isReview} /></span>}
                          <span> Burak from Turkey.</span>
                        </div>
                        {((vRes3a1 && vRes3a1.status !== 'correct') ||
                          (vRes3a2 && vRes3a2.status !== 'correct') ||
                          (vRes3b && vRes3b.status !== 'correct')) && (
                          <div className={styles.sentenceFeedbackList}>
                            {vRes3a1 && vRes3a1.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes3a1} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                            {vRes3a2 && vRes3a2.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes3a2} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                            {vRes3b && vRes3b.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes3b} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Dialogue 4 */}
                  {(() => {
                    const val4a = ex3Be['4_a'] || '';
                    const val4b = ex3Be['4_b'] || '';
                    const vRes4a = isReview ? verifyAnswer(val4a, ex3BeKey?.['4_a']) : null;
                    const vRes4b = isReview ? verifyAnswer(val4b, ex3BeKey?.['4_b']) : null;
                    const is4aChanged = origBe?.['4_a'] !== undefined && origBe?.['4_a'] !== val4a;
                    const is4bChanged = origBe?.['4_b'] !== undefined && origBe?.['4_b'] !== val4b;

                    return (
                      <div className={styles.beSentenceCard}>
                        <div className={styles.beDialogueText}>
                          <strong>4. </strong>
                          <span>A: </span>
                          <input
                            type="text"
                            value={val4a}
                            onChange={(e) => onEx3BeChange('4_a', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            className={`${styles.gapInput} ${vRes4a?.status === 'correct' ? styles.inputValid : vRes4a?.status === 'incorrect' ? styles.inputInvalid : ''} ${is4aChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '55px' }}
                          />
                          {vRes4a?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes4a} isTeacherReview={isReview} /></span>}
                          <span> I late? B: No, you </span>
                          <input
                            type="text"
                            value={val4b}
                            onChange={(e) => onEx3BeChange('4_b', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            className={`${styles.gapInput} ${vRes4b?.status === 'correct' ? styles.inputValid : vRes4b?.status === 'incorrect' ? styles.inputInvalid : ''} ${is4bChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '70px' }}
                          />
                          {vRes4b?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes4b} isTeacherReview={isReview} /></span>}
                          <span> late.</span>
                        </div>
                        {((vRes4a && vRes4a.status !== 'correct') || (vRes4b && vRes4b.status !== 'correct')) && (
                          <div className={styles.sentenceFeedbackList}>
                            {vRes4a && vRes4a.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes4a} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                            {vRes4b && vRes4b.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes4b} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Exercise 4: Jobs */}
              <div style={{ marginTop: '0.5rem' }}>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>4</span>
                  <span>Complete the names of the jobs.</span>
                </p>

                <div className={styles.jobsGrid}>
                  <div className={styles.jobCard}>
                    <div className={styles.jobInputRow}>
                      <strong style={{ minWidth: '22px' }}>1. </strong>
                      <span className={styles.exampleBlue}>football player</span>
                    </div>
                  </div>

                  {[
                    { id: '2', placeholder: 's_____ t______' },
                    { id: '3', placeholder: 'f____r' },
                    { id: '4', placeholder: 'o_____ w_____' },
                    { id: '5', placeholder: 'p___t' },
                    { id: '6', placeholder: 'd____r' },
                    { id: '7', placeholder: 't___ d_____' },
                    { id: '8', placeholder: 'n___e' },
                  ].map((job) => {
                    const currentVal = ex4Jobs[job.id] || '';
                    const origVal = origJobs?.[job.id];
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex4JobsKey?.[job.id]) : null;
                    const validClass =
                      vRes?.status === 'correct'
                        ? styles.inputValid
                        : vRes?.status === 'incorrect'
                        ? styles.inputInvalid
                        : '';

                    return (
                      <div key={job.id} className={styles.jobCard}>
                        <div className={styles.jobInputRow}>
                          <strong style={{ minWidth: '22px' }}>{job.id}. </strong>
                          <input
                            type="text"
                            value={currentVal}
                            onChange={(e) => onEx4JobsChange(job.id, e.target.value)}
                            disabled={readOnly}
                            placeholder={job.placeholder}
                            className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                            style={{ flex: 1, minWidth: '100px' }}
                          />
                          {vRes?.status === 'correct' && (
                            <span className={styles.correctBadge}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                            </span>
                          )}
                        </div>
                        {vRes && vRes.status !== 'correct' && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exercise 5: Add is or isn't */}
              <div style={{ marginTop: '0.5rem' }}>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>5</span>
                  <span>Correct the sentences. Add <em style={{ fontStyle: 'italic' }}>is</em> or <em style={{ fontStyle: 'italic' }}>isn&apos;t</em>.</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  {[
                    { id: '1', prompt: 'Lionel Messi a football player.' },
                    { id: '2', prompt: 'Marina from Italy?' },
                    { id: '3', prompt: 'Yes, Yoko in Class 5.' },
                    { id: '4', prompt: 'The White House in New York.' },
                    { id: '5', prompt: 'Pete a doctor?' },
                    { id: '6', prompt: 'No, he.' },
                  ].map((item) => {
                    const currentVal = ex5IsIsnt[item.id] || '';
                    const origVal = origIsIsnt?.[item.id];
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex5IsIsntKey?.[item.id]) : null;
                    const validClass =
                      vRes?.status === 'correct'
                        ? styles.inputValid
                        : vRes?.status === 'incorrect'
                        ? styles.inputInvalid
                        : '';

                    return (
                      <div key={item.id} className={styles.orderCard}>
                        <div className={styles.orderPromptRow}>
                          <span className={styles.orderPromptText}>
                            <strong style={{ marginRight: '6px' }}>{item.id}.</strong>
                            <span>{item.prompt}</span>
                          </span>
                          {vRes?.status === 'correct' && (
                            <span className={styles.correctBadge}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                            </span>
                          )}
                        </div>
                        <div className={styles.orderInputRow}>
                          <input
                            type="text"
                            value={currentVal}
                            onChange={(e) => onEx5IsIsntChange(item.id, e.target.value)}
                            disabled={readOnly}
                            placeholder="Correct sentence..."
                            className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '100%' }}
                          />
                        </div>
                        {vRes && vRes.status !== 'correct' && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Exercises 6 - 9 & Reflect */}
            <div className={styles.rightCol13}>
              {/* Exercise 6: Corrections */}
              <div>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>6</span>
                  <span>Correct the sentences. Use the information in brackets.</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <div className={styles.orderCard}>
                    <div className={styles.orderPromptRow}>
                      <span className={styles.orderPromptText}>
                        <strong style={{ marginRight: '6px' }}>1.</strong>
                        <span>Jennifer Lopez is English. (American)</span>
                      </span>
                    </div>
                    <p className={styles.exampleBlue} style={{ margin: 0, paddingLeft: '18px' }}>
                      Jennifer Lopez isn&apos;t English. She&apos;s American.
                    </p>
                  </div>

                  {[
                    { id: '2', prompt: 'Cristiano Ronaldo is a doctor. (football player)' },
                    { id: '3', prompt: 'The students are at a British university. (American)' },
                    { id: '4', prompt: 'Celine Dion is from Spain. (Canada)' },
                    { id: '5', prompt: 'We are from Spain. (all over the world)' },
                  ].map((item) => {
                    const currentVal = ex6Corrections[item.id] || '';
                    const origVal = origCorrections?.[item.id];
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex6Key?.[item.id]) : null;
                    const validClass =
                      vRes?.status === 'correct'
                        ? styles.inputValid
                        : vRes?.status === 'incorrect'
                        ? styles.inputInvalid
                        : '';

                    return (
                      <div key={item.id} className={styles.orderCard}>
                        <div className={styles.orderPromptRow}>
                          <span className={styles.orderPromptText}>
                            <strong style={{ marginRight: '6px' }}>{item.id}.</strong>
                            <span>{item.prompt}</span>
                          </span>
                          {vRes?.status === 'correct' && (
                            <span className={styles.correctBadge}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                            </span>
                          )}
                        </div>
                        <div className={styles.orderInputRow}>
                          <input
                            type="text"
                            value={currentVal}
                            onChange={(e) => onEx6CorrectionsChange(item.id, e.target.value)}
                            disabled={readOnly}
                            placeholder="Write correct sentence..."
                            className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '100%' }}
                          />
                        </div>
                        {vRes && vRes.status !== 'correct' && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exercise 7a: Nationalities */}
              <div>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>7</span>
                  <span className={styles.exSub}>a</span>
                  <span>Complete the sentences with the correct nationalities.</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <div className={styles.natCard}>
                    <div className={styles.natMainRow}>
                      <strong style={{ minWidth: '22px' }}>1.</strong>
                      <span>Gemma&apos;s from the UK. Gemma&apos;s </span>
                      <span className={styles.exampleBlue}>British</span>.
                    </div>
                  </div>

                  {[
                    { id: '2', prompt: "Murat's from Turkey. Murat's" },
                    { id: '3', prompt: "Sonoko's from Japan. Sonoko's" },
                    { id: '4', prompt: "Jake's from Canada. Jake's" },
                    { id: '5', prompt: "Felipe's from Brazil. Felipe's" },
                    { id: '6', prompt: "Manolo's from Spain. Manolo's" },
                    { id: '7', prompt: "Maria's from Argentina. Maria's" },
                    { id: '8', prompt: "Sergio's from Mexico. Sergio's" },
                    { id: '9', prompt: "Agnieszka's from Poland. Agnieszka's" },
                    { id: '10', prompt: "Anurak's from Thailand. Anurak's" },
                  ].map((item) => {
                    const currentVal = ex7aNationalities[item.id] || '';
                    const origVal = origNationalities?.[item.id];
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex7aKey?.[item.id]) : null;
                    const validClass =
                      vRes?.status === 'correct'
                        ? styles.inputValid
                        : vRes?.status === 'incorrect'
                        ? styles.inputInvalid
                        : '';

                    return (
                      <div key={item.id} className={styles.natCard}>
                        <div className={styles.natMainRow}>
                          <strong style={{ minWidth: '22px' }}>{item.id}.</strong>
                          <span>{item.prompt} </span>
                          <input
                            type="text"
                            value={currentVal}
                            onChange={(e) => onEx7aNationalitiesChange(item.id, e.target.value)}
                            disabled={readOnly}
                            placeholder="Nationality"
                            className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '130px', flex: '0 1 140px' }}
                          />
                          <span>.</span>
                          {vRes?.status === 'correct' && (
                            <span className={styles.correctBadge}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                            </span>
                          )}
                        </div>
                        {vRes && vRes.status !== 'correct' && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exercise 8: Alternatives */}
              <div>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>8</span>
                  <span>Choose the correct alternatives.</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  {/* 1 */}
                  {(() => {
                    const currentVal = ex8Alternatives['1'] || '';
                    const origVal = origAlternatives?.['1'];
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex8Key?.['1']) : null;

                    return (
                      <div className={styles.orderCard}>
                        <div className={styles.natMainRow}>
                          <strong style={{ minWidth: '22px' }}>1.</strong>
                          <span>Ana and Lydia are friends. </span>
                          <select
                            value={currentVal}
                            onChange={(e) => onEx8AlternativesChange('1', e.target.value)}
                            disabled={readOnly}
                            className={`${styles.styledSelect} ${vRes?.status === 'correct' ? styles.choiceValid : vRes?.status === 'incorrect' ? styles.choiceInvalid : ''} ${isChanged ? styles.diffHighlight : ''}`}
                          >
                            <option value="">-- select --</option>
                            <option value="We're">We&apos;re</option>
                            <option value="They're">They&apos;re</option>
                          </select>
                          <span> from Mexico.</span>
                          {vRes?.status === 'correct' && (
                            <span className={styles.correctBadge}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                            </span>
                          )}
                        </div>
                        {vRes && vRes.status !== 'correct' && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* 2 */}
                  {(() => {
                    const currentVal = ex8Alternatives['2'] || '';
                    const origVal = origAlternatives?.['2'];
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex8Key?.['2']) : null;

                    return (
                      <div className={styles.orderCard}>
                        <div className={styles.natMainRow}>
                          <strong style={{ minWidth: '22px' }}>2.</strong>
                          <span>Hey Luca, </span>
                          <select
                            value={currentVal}
                            onChange={(e) => onEx8AlternativesChange('2', e.target.value)}
                            disabled={readOnly}
                            className={`${styles.styledSelect} ${vRes?.status === 'correct' ? styles.choiceValid : vRes?.status === 'incorrect' ? styles.choiceInvalid : ''} ${isChanged ? styles.diffHighlight : ''}`}
                          >
                            <option value="">-- select --</option>
                            <option value="we are">we are</option>
                            <option value="are we">are we</option>
                          </select>
                          <span> in Classroom 2 today?</span>
                          {vRes?.status === 'correct' && (
                            <span className={styles.correctBadge}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                            </span>
                          )}
                        </div>
                        {vRes && vRes.status !== 'correct' && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* 3 */}
                  {(() => {
                    const currentVal = ex8Alternatives['3'] || '';
                    const origVal = origAlternatives?.['3'];
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex8Key?.['3']) : null;

                    return (
                      <div className={styles.orderCard}>
                        <div className={styles.natMainRow}>
                          <strong style={{ minWidth: '22px' }}>3.</strong>
                          <span>Mike and Sally are teachers. </span>
                          <select
                            value={currentVal}
                            onChange={(e) => onEx8AlternativesChange('3', e.target.value)}
                            disabled={readOnly}
                            className={`${styles.styledSelect} ${vRes?.status === 'correct' ? styles.choiceValid : vRes?.status === 'incorrect' ? styles.choiceInvalid : ''} ${isChanged ? styles.diffHighlight : ''}`}
                          >
                            <option value="">-- select --</option>
                            <option value="Are they">Are they</option>
                            <option value="They are">They are</option>
                          </select>
                          <span> British.</span>
                          {vRes?.status === 'correct' && (
                            <span className={styles.correctBadge}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                            </span>
                          )}
                        </div>
                        {vRes && vRes.status !== 'correct' && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* 4 */}
                  {(() => {
                    const currentValA = ex8Alternatives['4_a'] || '';
                    const currentValB1 = ex8Alternatives['4_b1'] || '';
                    const currentValB2 = ex8Alternatives['4_b2'] || '';

                    const vResA = isReview ? verifyAnswer(currentValA, ex8Key?.['4_a']) : null;
                    const vResB1 = isReview ? verifyAnswer(currentValB1, ex8Key?.['4_b1']) : null;
                    const vResB2 = isReview ? verifyAnswer(currentValB2, ex8Key?.['4_b2']) : null;

                    const isAChanged = origAlternatives?.['4_a'] !== undefined && origAlternatives?.['4_a'] !== currentValA;
                    const isB1Changed = origAlternatives?.['4_b1'] !== undefined && origAlternatives?.['4_b1'] !== currentValB1;
                    const isB2Changed = origAlternatives?.['4_b2'] !== undefined && origAlternatives?.['4_b2'] !== currentValB2;

                    return (
                      <div className={styles.orderCard}>
                        <div className={styles.natMainRow}>
                          <strong style={{ minWidth: '22px' }}>4.</strong>
                          <span>A: Hello Yuki, hello Yumi. </span>
                          <select
                            value={currentValA}
                            onChange={(e) => onEx8AlternativesChange('4_a', e.target.value)}
                            disabled={readOnly}
                            className={`${styles.styledSelect} ${vResA?.status === 'correct' ? styles.choiceValid : vResA?.status === 'incorrect' ? styles.choiceInvalid : ''} ${isAChanged ? styles.diffHighlight : ''}`}
                          >
                            <option value="">-- select --</option>
                            <option value="Are we">Are we</option>
                            <option value="Are you">Are you</option>
                          </select>
                          {vResA?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vResA} isTeacherReview={isReview} /></span>}
                          <span> from Tokyo? B: </span>
                          <select
                            value={currentValB1}
                            onChange={(e) => onEx8AlternativesChange('4_b1', e.target.value)}
                            disabled={readOnly}
                            className={`${styles.styledSelect} ${vResB1?.status === 'correct' ? styles.choiceValid : vResB1?.status === 'incorrect' ? styles.choiceInvalid : ''} ${isB1Changed ? styles.diffHighlight : ''}`}
                          >
                            <option value="">-- select --</option>
                            <option value="We aren't">We aren&apos;t</option>
                            <option value="They aren't">They aren&apos;t</option>
                          </select>
                          {vResB1?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vResB1} isTeacherReview={isReview} /></span>}
                          <span> from Tokyo. </span>
                          <select
                            value={currentValB2}
                            onChange={(e) => onEx8AlternativesChange('4_b2', e.target.value)}
                            disabled={readOnly}
                            className={`${styles.styledSelect} ${vResB2?.status === 'correct' ? styles.choiceValid : vResB2?.status === 'incorrect' ? styles.choiceInvalid : ''} ${isB2Changed ? styles.diffHighlight : ''}`}
                          >
                            <option value="">-- select --</option>
                            <option value="You're">You&apos;re</option>
                            <option value="We're">We&apos;re</option>
                          </select>
                          {vResB2?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vResB2} isTeacherReview={isReview} /></span>}
                          <span> from Osaka.</span>
                        </div>
                        {((vResA && vResA.status !== 'correct') ||
                          (vResB1 && vResB1.status !== 'correct') ||
                          (vResB2 && vResB2.status !== 'correct')) && (
                          <div className={styles.sentenceFeedbackList}>
                            {vResA && vResA.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vResA} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                            {vResB1 && vResB1.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vResB1} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                            {vResB2 && vResB2.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vResB2} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* 5 */}
                  {(() => {
                    const currentVal = ex8Alternatives['5'] || '';
                    const origVal = origAlternatives?.['5'];
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex8Key?.['5']) : null;

                    return (
                      <div className={styles.orderCard}>
                        <div className={styles.natMainRow}>
                          <strong style={{ minWidth: '22px' }}>5.</strong>
                          <span>Hi Jaime, hi Abdul. Don&apos;t worry! </span>
                          <select
                            value={currentVal}
                            onChange={(e) => onEx8AlternativesChange('5', e.target.value)}
                            disabled={readOnly}
                            className={`${styles.styledSelect} ${vRes?.status === 'correct' ? styles.choiceValid : vRes?.status === 'incorrect' ? styles.choiceInvalid : ''} ${isChanged ? styles.diffHighlight : ''}`}
                          >
                            <option value="">-- select --</option>
                            <option value="You aren't">You aren&apos;t</option>
                            <option value="They aren't">They aren&apos;t</option>
                          </select>
                          <span> late.</span>
                          {vRes?.status === 'correct' && (
                            <span className={styles.correctBadge}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                            </span>
                          )}
                        </div>
                        {vRes && vRes.status !== 'correct' && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Exercise 9: Fill with 're, are and aren't */}
              <div>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>9</span>
                  <span>Complete the text with <em style={{ fontStyle: 'italic' }}>&apos;re</em>, <em style={{ fontStyle: 'italic' }}>are</em> and <em style={{ fontStyle: 'italic' }}>aren&apos;t</em>.</span>
                </p>

                {(() => {
                  const val1 = ex9Text['1'] || '';
                  const val2 = ex9Text['2'] || '';
                  const val3 = ex9Text['3'] || '';

                  const vRes1 = isReview ? verifyAnswer(val1, ex9Key?.['1']) : null;
                  const vRes2 = isReview ? verifyAnswer(val2, ex9Key?.['2']) : null;
                  const vRes3 = isReview ? verifyAnswer(val3, ex9Key?.['3']) : null;

                  const is1Changed = origText?.['1'] !== undefined && origText?.['1'] !== val1;
                  const is2Changed = origText?.['2'] !== undefined && origText?.['2'] !== val2;
                  const is3Changed = origText?.['3'] !== undefined && origText?.['3'] !== val3;

                  return (
                    <div className={styles.beSentenceCard}>
                      <div className={styles.beDialogueText}>
                        <span>Nick and Kelly </span>
                        <input
                          type="text"
                          value={val1}
                          onChange={(e) => onEx9TextChange('1', e.target.value)}
                          disabled={readOnly}
                          placeholder="..."
                          className={`${styles.gapInput} ${vRes1?.status === 'correct' ? styles.inputValid : vRes1?.status === 'incorrect' ? styles.inputInvalid : ''} ${is1Changed ? styles.diffHighlight : ''}`}
                          style={{ width: '60px' }}
                        />
                        {vRes1?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes1} isTeacherReview={isReview} /></span>}
                        <span> my friends in London. I&apos;m from the UK, but Nick and Kelly </span>
                        <input
                          type="text"
                          value={val2}
                          onChange={(e) => onEx9TextChange('2', e.target.value)}
                          disabled={readOnly}
                          placeholder="..."
                          className={`${styles.gapInput} ${vRes2?.status === 'correct' ? styles.inputValid : vRes2?.status === 'incorrect' ? styles.inputInvalid : ''} ${is2Changed ? styles.diffHighlight : ''}`}
                          style={{ width: '70px' }}
                        />
                        {vRes2?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes2} isTeacherReview={isReview} /></span>}
                        <span> British. They </span>
                        <input
                          type="text"
                          value={val3}
                          onChange={(e) => onEx9TextChange('3', e.target.value)}
                          disabled={readOnly}
                          placeholder="..."
                          className={`${styles.gapInput} ${vRes3?.status === 'correct' ? styles.inputValid : vRes3?.status === 'incorrect' ? styles.inputInvalid : ''} ${is3Changed ? styles.diffHighlight : ''}`}
                          style={{ width: '60px' }}
                        />
                        {vRes3?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes3} isTeacherReview={isReview} /></span>}
                        <span> from Canada.</span>
                      </div>

                      {((vRes1 && vRes1.status !== 'correct') ||
                        (vRes2 && vRes2.status !== 'correct') ||
                        (vRes3 && vRes3.status !== 'correct')) && (
                        <div className={styles.sentenceFeedbackList}>
                          {vRes1 && vRes1.status !== 'correct' && (
                            <div className={styles.feedbackRow}>
                              <TeacherAnswerBadge result={vRes1} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                          {vRes2 && vRes2.status !== 'correct' && (
                            <div className={styles.feedbackRow}>
                              <TeacherAnswerBadge result={vRes2} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                          {vRes3 && vRes3.status !== 'correct' && (
                            <div className={styles.feedbackRow}>
                              <TeacherAnswerBadge result={vRes3} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Reflect Box */}
              <div className={styles.reflectBox}>
                <h2>Reflect</h2>
                <p>How confident do you feel about the statements below? Write 1–5 (1 = not very confident, 5 = very confident).</p>
                <ul>
                  {[
                    { id: '1', text: 'I can introduce myself to other students.' },
                    { id: '2', text: 'I can ask and answer about jobs.' },
                    { id: '3', text: 'I can talk about different nationalities.' },
                    { id: '4', text: 'I can ask for and give contact information.' },
                  ].map((st) => (
                    <li key={st.id}>
                      <span>• {st.text}</span>
                      <select
                        value={reflectScores[st.id] || 5}
                        onChange={(e) => onReflectChange(st.id, e.target.value)}
                        disabled={readOnly}
                        aria-label={`Confidence score for: ${st.text}`}
                      >
                        {[1, 2, 3, 4, 5].map((val) => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Page 13 Pin */}
        <div className={`${styles.pageNumberBadge} ${styles.right}`}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#d3232a', background: '#fee2e2', padding: '2px 8px', borderRadius: '4px' }}>
            Page 13
          </span>
        </div>
      </section>
    </div>
  );
}
