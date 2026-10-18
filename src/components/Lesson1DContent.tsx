'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import styles from './lesson1d.module.scss';

export interface Lesson1DContentProps {
  lesson?: Record<string, unknown> | null;
  user?: Record<string, unknown> | null;
  readOnly?: boolean;
  playAudio: (track: string) => void;
  playingAudio: string | null;

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

  originalAnswers?: Record<string, unknown>;
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
  _lesson,
  readOnly = false,
  playAudio,
  playingAudio,

  // Page 12
  ex1Location = '',
  ex2Audio = {},
  _ex3aOrder = {},
  ex3bContact = {},
  ex4aDialogue = {},
  ex5Personal = {},
  ex6Partner = {},

  // Page 13
  wordsearchFound = { poland: 'Poland' },
  ex2aOrder = {},
  _ex2bShort = {},
  ex3Be = {},
  ex4Jobs = {},
  ex5IsIsnt = {},
  ex6Corrections = {},
  ex7aNationalities = {},
  _ex7bPeople = {},
  ex8Alternatives = {},
  ex9Text = {},
  reflectScores = {},

  // Handlers
  onEx1LocationChange = () => {},
  onEx2AudioChange = () => {},
  _onEx3aOrderChange = () => {},
  onEx3bContactChange = () => {},
  onEx4aDialogueChange = () => {},
  onEx5PersonalChange = () => {},
  onEx6PartnerChange = () => {},

  onWordsearchChange = () => {},
  onEx2aOrderChange = () => {},
  _onEx2bShortChange = () => {},
  onEx3BeChange = () => {},
  onEx4JobsChange = () => {},
  onEx5IsIsntChange = () => {},
  onEx6CorrectionsChange = () => {},
  onEx7aNationalitiesChange = () => {},
  _onEx7bPeopleChange = () => {},
  onEx8AlternativesChange = () => {},
  onEx9TextChange = () => {},
  onReflectChange = () => {},

  _originalAnswers,
}: Lesson1DContentProps & {
  _lesson?: Record<string, unknown> | null;
  _ex3aOrder?: Record<string, string>;
  _ex2bShort?: Record<string, string>;
  _ex7bPeople?: Record<string, string>;
  _onEx3aOrderChange?: (id: string, value: string) => void;
  _onEx2bShortChange?: (id: string, value: string) => void;
  _onEx7bPeopleChange?: (field: string, value: string) => void;
  _originalAnswers?: Record<string, unknown>;
}) {
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
      // Unselect cell
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
        // Success!
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

  return (
    <div className={styles.pageContainer}>
      {/* ========================================================================= */}
      {/* ===================== PAGE 12: 1D ENGLISH IN ACTION ==================== */}
      {/* ========================================================================= */}
      <section className={styles.textbookPage12}>
        {/* Header Ribbon */}
        <header className={styles.headerBanner12}>
          <div className={styles.headerContent12}>
            <svg viewBox="0 0 430 126" className={styles.chevronsSvg} preserveAspectRatio="none">
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
              <div style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                {[
                  { key: 'a', label: 'a at a conference' },
                  { key: 'b', label: 'b in a language school' },
                  { key: 'c', label: 'c in a hotel' },
                ].map((opt) => (
                  <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="ex1Location"
                      value={opt.key}
                      checked={ex1Location === opt.key}
                      onChange={(e) => onEx1LocationChange(e.target.value)}
                      disabled={readOnly}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
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
                >
                  <span className={styles.diamondIcon}>
                    <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                  </span>
                  <span>1.14</span>
                  <span>{playingAudio === '1.14' ? 'Playing...' : 'Audio'}</span>
                </button>
                <span>Listen to the conversation. Who is the student? Where is she from?</span>
              </p>
              <div style={{ paddingLeft: '1.5rem', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>
                  <label style={{ marginRight: '6px', fontWeight: 600 }}>Student:</label>
                  <input
                    type="text"
                    value={ex2Audio.student || ''}
                    onChange={(e) => onEx2AudioChange('student', e.target.value)}
                    disabled={readOnly}
                    placeholder="e.g. Selin"
                    className={styles.textInputLine}
                    style={{ width: '140px' }}
                  />
                </div>
                <div>
                  <label style={{ marginRight: '6px', fontWeight: 600 }}>From:</label>
                  <input
                    type="text"
                    value={ex2Audio.country || ''}
                    onChange={(e) => onEx2AudioChange('country', e.target.value)}
                    disabled={readOnly}
                    placeholder="e.g. Turkey"
                    className={styles.textInputLine}
                    style={{ width: '140px' }}
                  />
                </div>
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
                <p>What&apos;s your first name?</p>
                <p>What&apos;s your family name?</p>
                <p>What&apos;s your phone number?</p>
                <p>What&apos;s your email address?</p>
              </div>

              <div className={styles.group}>
                <strong>Checking information</strong>
                <p>Sorry, can you say that again?</p>
                <p>How do you spell (your first name)?</p>
              </div>

              <div className={styles.group}>
                <strong>Giving information</strong>
                <p>My first name is (Selin).</p>
                <p>My family name is (Atakan).</p>
                <p>My number is (020-555-7645).</p>
                <p>My email address is (selin2000@dmail.com).</p>
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
                      <div className={styles.cardRow}>
                        <sup>1</sup>
                        <input
                          type="text"
                          value={ex3bContact['1'] || ''}
                          onChange={(e) => onEx3bContactChange('1', e.target.value)}
                          disabled={readOnly}
                          placeholder="First name"
                          className={styles.textInputLine}
                          style={{ width: '120px' }}
                        />
                        <span>: Selin</span>
                      </div>
                      <div className={styles.cardRow}>
                        <sup>2</sup>
                        <input
                          type="text"
                          value={ex3bContact['2'] || ''}
                          onChange={(e) => onEx3bContactChange('2', e.target.value)}
                          disabled={readOnly}
                          placeholder="Family name"
                          className={styles.textInputLine}
                          style={{ width: '120px' }}
                        />
                        <span>: Atakan</span>
                      </div>
                      <div className={styles.cardRow}>
                        <sup>3</sup>
                        <input
                          type="text"
                          value={ex3bContact['3'] || ''}
                          onChange={(e) => onEx3bContactChange('3', e.target.value)}
                          disabled={readOnly}
                          placeholder="Phone number"
                          className={styles.textInputLine}
                          style={{ width: '120px' }}
                        />
                        <span>: 020-555-7645</span>
                      </div>
                      <div className={styles.cardRow}>
                        <sup>4</sup>
                        <input
                          type="text"
                          value={ex3bContact['4'] || ''}
                          onChange={(e) => onEx3bContactChange('4', e.target.value)}
                          disabled={readOnly}
                          placeholder="Email address"
                          className={styles.textInputLine}
                          style={{ width: '120px' }}
                        />
                        <span>: selin2000@dmail.com</span>
                      </div>
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
                <div>
                  <strong>A: </strong>
                  <sup>1</sup>
                  <input
                    type="text"
                    value={ex4aDialogue['1'] || ''}
                    onChange={(e) => onEx4aDialogueChange('1', e.target.value)}
                    disabled={readOnly}
                    placeholder="e.g. What's your name"
                    className={styles.textInputLine}
                    style={{ width: '220px' }}
                  />
                  <span>?</span>
                </div>
                <div><strong>B:</strong> Dieter Neumann.</div>

                <div>
                  <strong>A: </strong>
                  <sup>2</sup>
                  <input
                    type="text"
                    value={ex4aDialogue['2'] || ''}
                    onChange={(e) => onEx4aDialogueChange('2', e.target.value)}
                    disabled={readOnly}
                    placeholder="e.g. How do you spell your"
                    className={styles.textInputLine}
                    style={{ width: '200px' }}
                  />
                  <span> first name?</span>
                </div>
                <div><strong>B:</strong> D - I - E - T - E - R.</div>

                <div>
                  <strong>A:</strong> And <sup>3</sup>
                  <input
                    type="text"
                    value={ex4aDialogue['3'] || ''}
                    onChange={(e) => onEx4aDialogueChange('3', e.target.value)}
                    disabled={readOnly}
                    placeholder="e.g. what's your family name"
                    className={styles.textInputLine}
                    style={{ width: '210px' }}
                  />
                  <span> again?</span>
                </div>
                <div><strong>B:</strong> Neumann. That&apos;s N - E - U - M - A - N - N.</div>

                <div>
                  <strong>A: </strong>
                  <sup>4</sup>
                  <input
                    type="text"
                    value={ex4aDialogue['4'] || ''}
                    onChange={(e) => onEx4aDialogueChange('4', e.target.value)}
                    disabled={readOnly}
                    placeholder="e.g. What's your phone number"
                    className={styles.textInputLine}
                    style={{ width: '220px' }}
                  />
                  <span>?</span>
                </div>
                <div><strong>B:</strong> It&apos;s 07700 900617.</div>

                <div>
                  <strong>A:</strong> Sorry, <sup>5</sup>
                  <input
                    type="text"
                    value={ex4aDialogue['5'] || ''}
                    onChange={(e) => onEx4aDialogueChange('5', e.target.value)}
                    disabled={readOnly}
                    placeholder="e.g. can you say that again"
                    className={styles.textInputLine}
                    style={{ width: '210px' }}
                  />
                  <span>?</span>
                </div>
                <div><strong>B:</strong> 07700 900617.</div>

                <div>
                  <strong>A:</strong> And <sup>6</sup>
                  <input
                    type="text"
                    value={ex4aDialogue['6'] || ''}
                    onChange={(e) => onEx4aDialogueChange('6', e.target.value)}
                    disabled={readOnly}
                    placeholder="e.g. what's your email address"
                    className={styles.textInputLine}
                    style={{ width: '220px' }}
                  />
                  <span>?</span>
                </div>
                <div><strong>B:</strong> It&apos;s dietern@intertalk.com.</div>
              </div>

              {/* 4b Audio */}
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={styles.exSub}>b</span>
                <button
                  type="button"
                  onClick={() => playAudio('1.15')}
                  className={`${styles.audioBtn} ${playingAudio === '1.15' ? styles.playing : ''}`}
                  disabled={readOnly}
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
                        <span>First name:</span>
                        <input
                          type="text"
                          value={ex5Personal.firstName || ''}
                          onChange={(e) => onEx5PersonalChange('firstName', e.target.value)}
                          disabled={readOnly}
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className={styles.cardRow}>
                        <span>Family name:</span>
                        <input
                          type="text"
                          value={ex5Personal.familyName || ''}
                          onChange={(e) => onEx5PersonalChange('familyName', e.target.value)}
                          disabled={readOnly}
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className={styles.cardRow}>
                        <span>Phone number:</span>
                        <input
                          type="text"
                          value={ex5Personal.phone || ''}
                          onChange={(e) => onEx5PersonalChange('phone', e.target.value)}
                          disabled={readOnly}
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className={styles.cardRow}>
                        <span>Email address:</span>
                        <input
                          type="text"
                          value={ex5Personal.email || ''}
                          onChange={(e) => onEx5PersonalChange('email', e.target.value)}
                          disabled={readOnly}
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
                        <span>First name:</span>
                        <input
                          type="text"
                          value={ex6Partner.firstName || ''}
                          onChange={(e) => onEx6PartnerChange('firstName', e.target.value)}
                          disabled={readOnly}
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className={styles.cardRow}>
                        <span>Family name:</span>
                        <input
                          type="text"
                          value={ex6Partner.familyName || ''}
                          onChange={(e) => onEx6PartnerChange('familyName', e.target.value)}
                          disabled={readOnly}
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className={styles.cardRow}>
                        <span>Phone number:</span>
                        <input
                          type="text"
                          value={ex6Partner.phone || ''}
                          onChange={(e) => onEx6PartnerChange('phone', e.target.value)}
                          disabled={readOnly}
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <div className={styles.cardRow}>
                        <span>Email address:</span>
                        <input
                          type="text"
                          value={ex6Partner.email || ''}
                          onChange={(e) => onEx6PartnerChange('email', e.target.value)}
                          disabled={readOnly}
                          className={styles.textInputLine}
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
                        >
                          {item.name} {isFound ? '✓' : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Wordsearch Grid */}
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

              {/* Exercise 2a */}
              <div style={{ marginTop: '0.5rem' }}>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>2</span>
                  <span className={styles.exSub}>a</span>
                  <span>Put the words in the correct order to make sentences.</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '1rem', marginTop: '4px' }}>
                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>1.</span>
                    <span>from / I / Brazil / am</span>
                    <p className={styles.exampleBlue} style={{ margin: '2px 0 0 16px' }}>I am from Brazil.</p>
                  </div>

                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>2.</span>
                    <span>am / London / from / not / I</span>
                    <div style={{ marginTop: '2px', paddingLeft: '16px' }}>
                      <input
                        type="text"
                        value={ex2aOrder['2'] || ''}
                        onChange={(e) => onEx2aOrderChange('2', e.target.value)}
                        disabled={readOnly}
                        placeholder="Write the sentence..."
                        className={styles.textInputLine}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>3.</span>
                    <span>you / class / my / in / Are ?</span>
                    <div style={{ marginTop: '2px', paddingLeft: '16px' }}>
                      <input
                        type="text"
                        value={ex2aOrder['3'] || ''}
                        onChange={(e) => onEx2aOrderChange('3', e.target.value)}
                        disabled={readOnly}
                        placeholder="Write the sentence..."
                        className={styles.textInputLine}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>4.</span>
                    <span>are / Where / from / you ?</span>
                    <div style={{ marginTop: '2px', paddingLeft: '16px' }}>
                      <input
                        type="text"
                        value={ex2aOrder['4'] || ''}
                        onChange={(e) => onEx2aOrderChange('4', e.target.value)}
                        disabled={readOnly}
                        placeholder="Write the sentence..."
                        className={styles.textInputLine}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>5.</span>
                    <span>my / you / are / No, / in / class / not</span>
                    <div style={{ marginTop: '2px', paddingLeft: '16px' }}>
                      <input
                        type="text"
                        value={ex2aOrder['5'] || ''}
                        onChange={(e) => onEx2aOrderChange('5', e.target.value)}
                        disabled={readOnly}
                        placeholder="Write the sentence..."
                        className={styles.textInputLine}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercise 3: be forms */}
              <div style={{ marginTop: '0.5rem' }}>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>3</span>
                  <span>Complete the sentences with the correct form of <em style={{ fontStyle: 'italic' }}>be</em>. Use short forms.</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '1rem', marginTop: '4px' }}>
                  {/* 1 */}
                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>1.</span>
                    <span>A: </span>
                    <input
                      type="text"
                      value={ex3Be['1_a'] || ''}
                      onChange={(e) => onEx3BeChange('1_a', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInputLine}
                      style={{ width: '50px' }}
                    />
                    <span> you from Spain? B: No, I </span>
                    <input
                      type="text"
                      value={ex3Be['1_b'] || ''}
                      onChange={(e) => onEx3BeChange('1_b', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInputLine}
                      style={{ width: '50px' }}
                    />
                    <span> from Mexico.</span>
                  </div>

                  {/* 2 */}
                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>2.</span>
                    <span>A: I </span>
                    <input
                      type="text"
                      value={ex3Be['2_a1'] || ''}
                      onChange={(e) => onEx3BeChange('2_a1', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInputLine}
                      style={{ width: '45px' }}
                    />
                    <span> in Class 4. </span>
                    <input
                      type="text"
                      value={ex3Be['2_a2'] || ''}
                      onChange={(e) => onEx3BeChange('2_a2', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInputLine}
                      style={{ width: '45px' }}
                    />
                    <span> you? B: No, I </span>
                    <input
                      type="text"
                      value={ex3Be['2_b1'] || ''}
                      onChange={(e) => onEx3BeChange('2_b1', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInputLine}
                      style={{ width: '60px' }}
                    />
                    <span>. I </span>
                    <input
                      type="text"
                      value={ex3Be['2_b2'] || ''}
                      onChange={(e) => onEx3BeChange('2_b2', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInputLine}
                      style={{ width: '45px' }}
                    />
                    <span> in Class 3.</span>
                  </div>

                  {/* 3 */}
                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>3.</span>
                    <span>A: Hi, I </span>
                    <input
                      type="text"
                      value={ex3Be['3_a1'] || ''}
                      onChange={(e) => onEx3BeChange('3_a1', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInputLine}
                      style={{ width: '45px' }}
                    />
                    <span> Tomoko. I </span>
                    <input
                      type="text"
                      value={ex3Be['3_a2'] || ''}
                      onChange={(e) => onEx3BeChange('3_a2', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInputLine}
                      style={{ width: '45px' }}
                    />
                    <span> from Japan. B: Nice to meet you. I </span>
                    <input
                      type="text"
                      value={ex3Be['3_b'] || ''}
                      onChange={(e) => onEx3BeChange('3_b', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInputLine}
                      style={{ width: '45px' }}
                    />
                    <span> Burak from Turkey.</span>
                  </div>

                  {/* 4 */}
                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>4.</span>
                    <span>A: </span>
                    <input
                      type="text"
                      value={ex3Be['4_a'] || ''}
                      onChange={(e) => onEx3BeChange('4_a', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInputLine}
                      style={{ width: '50px' }}
                    />
                    <span> I late? B: No, you </span>
                    <input
                      type="text"
                      value={ex3Be['4_b'] || ''}
                      onChange={(e) => onEx3BeChange('4_b', e.target.value)}
                      disabled={readOnly}
                      className={styles.textInputLine}
                      style={{ width: '65px' }}
                    />
                    <span> late.</span>
                  </div>
                </div>
              </div>

              {/* Exercise 4: Jobs */}
              <div style={{ marginTop: '0.5rem' }}>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>4</span>
                  <span>Complete the names of the jobs.</span>
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px 12px', paddingLeft: '1rem', marginTop: '4px' }}>
                  <div>
                    <strong>1. </strong>
                    <span className={styles.exampleBlue}>football player</span>
                  </div>
                  <div>
                    <strong>2. </strong>
                    <input
                      type="text"
                      value={ex4Jobs['2'] || ''}
                      onChange={(e) => onEx4JobsChange('2', e.target.value)}
                      disabled={readOnly}
                      placeholder="s_____ t______"
                      className={styles.textInputLine}
                      style={{ width: '120px' }}
                    />
                  </div>
                  <div>
                    <strong>3. </strong>
                    <input
                      type="text"
                      value={ex4Jobs['3'] || ''}
                      onChange={(e) => onEx4JobsChange('3', e.target.value)}
                      disabled={readOnly}
                      placeholder="f____r"
                      className={styles.textInputLine}
                      style={{ width: '120px' }}
                    />
                  </div>
                  <div>
                    <strong>4. </strong>
                    <input
                      type="text"
                      value={ex4Jobs['4'] || ''}
                      onChange={(e) => onEx4JobsChange('4', e.target.value)}
                      disabled={readOnly}
                      placeholder="o_____ w_____"
                      className={styles.textInputLine}
                      style={{ width: '120px' }}
                    />
                  </div>
                  <div>
                    <strong>5. </strong>
                    <input
                      type="text"
                      value={ex4Jobs['5'] || ''}
                      onChange={(e) => onEx4JobsChange('5', e.target.value)}
                      disabled={readOnly}
                      placeholder="p___t"
                      className={styles.textInputLine}
                      style={{ width: '120px' }}
                    />
                  </div>
                  <div>
                    <strong>6. </strong>
                    <input
                      type="text"
                      value={ex4Jobs['6'] || ''}
                      onChange={(e) => onEx4JobsChange('6', e.target.value)}
                      disabled={readOnly}
                      placeholder="d____r"
                      className={styles.textInputLine}
                      style={{ width: '120px' }}
                    />
                  </div>
                  <div>
                    <strong>7. </strong>
                    <input
                      type="text"
                      value={ex4Jobs['7'] || ''}
                      onChange={(e) => onEx4JobsChange('7', e.target.value)}
                      disabled={readOnly}
                      placeholder="t___ d_____"
                      className={styles.textInputLine}
                      style={{ width: '120px' }}
                    />
                  </div>
                  <div>
                    <strong>8. </strong>
                    <input
                      type="text"
                      value={ex4Jobs['8'] || ''}
                      onChange={(e) => onEx4JobsChange('8', e.target.value)}
                      disabled={readOnly}
                      placeholder="n___e"
                      className={styles.textInputLine}
                      style={{ width: '120px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Exercise 5: Add is or isn't */}
              <div style={{ marginTop: '0.5rem' }}>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>5</span>
                  <span>Correct the sentences. Add <em style={{ fontStyle: 'italic' }}>is</em> or <em style={{ fontStyle: 'italic' }}>isn&apos;t</em>.</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '1rem', marginTop: '4px' }}>
                  {[
                    { id: '1', prompt: 'Lionel Messi a football player.' },
                    { id: '2', prompt: 'Marina from Italy?' },
                    { id: '3', prompt: 'Yes, Yoko in Class 5.' },
                    { id: '4', prompt: 'The White House in New York.' },
                    { id: '5', prompt: 'Pete a doctor?' },
                    { id: '6', prompt: 'No, he.' },
                  ].map((item) => (
                    <div key={item.id}>
                      <span style={{ fontWeight: 700, marginRight: '6px' }}>{item.id}.</span>
                      <span>{item.prompt}</span>
                      <div style={{ paddingLeft: '16px', marginTop: '2px' }}>
                        <input
                          type="text"
                          value={ex5IsIsnt[item.id] || ''}
                          onChange={(e) => onEx5IsIsntChange(item.id, e.target.value)}
                          disabled={readOnly}
                          placeholder="Correct sentence..."
                          className={styles.textInputLine}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  ))}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '1rem', marginTop: '4px' }}>
                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>1.</span>
                    <span>Jennifer Lopez is English. (American)</span>
                    <p className={styles.exampleBlue} style={{ margin: '2px 0 0 16px' }}>Jennifer Lopez isn&apos;t English. She&apos;s American.</p>
                  </div>

                  {[
                    { id: '2', prompt: 'Cristiano Ronaldo is a doctor. (football player)' },
                    { id: '3', prompt: 'The students are at a British university. (American)' },
                    { id: '4', prompt: 'Celine Dion is from Spain. (Canada)' },
                    { id: '5', prompt: 'We are from Spain. (all over the world)' },
                  ].map((item) => (
                    <div key={item.id}>
                      <span style={{ fontWeight: 700, marginRight: '6px' }}>{item.id}.</span>
                      <span>{item.prompt}</span>
                      <div style={{ paddingLeft: '16px', marginTop: '2px' }}>
                        <input
                          type="text"
                          value={ex6Corrections[item.id] || ''}
                          onChange={(e) => onEx6CorrectionsChange(item.id, e.target.value)}
                          disabled={readOnly}
                          placeholder="Write correct sentence..."
                          className={styles.textInputLine}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercise 7a: Nationalities */}
              <div>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>7</span>
                  <span className={styles.exSub}>a</span>
                  <span>Complete the sentences with the correct nationalities.</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '1rem', marginTop: '4px' }}>
                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>1.</span>
                    <span>Gemma&apos;s from the UK. Gemma&apos;s </span>
                    <span className={styles.exampleBlue}>British</span>.
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
                  ].map((item) => (
                    <div key={item.id}>
                      <span style={{ fontWeight: 700, marginRight: '6px' }}>{item.id}.</span>
                      <span>{item.prompt} </span>
                      <input
                        type="text"
                        value={ex7aNationalities[item.id] || ''}
                        onChange={(e) => onEx7aNationalitiesChange(item.id, e.target.value)}
                        disabled={readOnly}
                        placeholder="Nationality"
                        className={styles.textInputLine}
                        style={{ width: '110px' }}
                      />
                      <span>.</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercise 8: Alternatives */}
              <div>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>8</span>
                  <span>Choose the correct alternatives.</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '1rem', marginTop: '4px' }}>
                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>1.</span>
                    <span>Ana and Lydia are friends. </span>
                    <select
                      value={ex8Alternatives['1'] || ''}
                      onChange={(e) => onEx8AlternativesChange('1', e.target.value)}
                      disabled={readOnly}
                      style={{ padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="">-- select --</option>
                      <option value="We're">We&apos;re</option>
                      <option value="They're">They&apos;re</option>
                    </select>
                    <span> from Mexico.</span>
                  </div>

                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>2.</span>
                    <span>Hey Luca, </span>
                    <select
                      value={ex8Alternatives['2'] || ''}
                      onChange={(e) => onEx8AlternativesChange('2', e.target.value)}
                      disabled={readOnly}
                      style={{ padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="">-- select --</option>
                      <option value="we are">we are</option>
                      <option value="are we">are we</option>
                    </select>
                    <span> in Classroom 2 today?</span>
                  </div>

                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>3.</span>
                    <span>Mike and Sally are teachers. </span>
                    <select
                      value={ex8Alternatives['3'] || ''}
                      onChange={(e) => onEx8AlternativesChange('3', e.target.value)}
                      disabled={readOnly}
                      style={{ padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="">-- select --</option>
                      <option value="Are they">Are they</option>
                      <option value="They are">They are</option>
                    </select>
                    <span> British.</span>
                  </div>

                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>4.</span>
                    <span>A: Hello Yuki, hello Yumi. </span>
                    <select
                      value={ex8Alternatives['4_a'] || ''}
                      onChange={(e) => onEx8AlternativesChange('4_a', e.target.value)}
                      disabled={readOnly}
                      style={{ padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="">-- select --</option>
                      <option value="Are we">Are we</option>
                      <option value="Are you">Are you</option>
                    </select>
                    <span> from Tokyo? B: </span>
                    <select
                      value={ex8Alternatives['4_b1'] || ''}
                      onChange={(e) => onEx8AlternativesChange('4_b1', e.target.value)}
                      disabled={readOnly}
                      style={{ padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="">-- select --</option>
                      <option value="We aren't">We aren&apos;t</option>
                      <option value="They aren't">They aren&apos;t</option>
                    </select>
                    <span> from Tokyo. </span>
                    <select
                      value={ex8Alternatives['4_b2'] || ''}
                      onChange={(e) => onEx8AlternativesChange('4_b2', e.target.value)}
                      disabled={readOnly}
                      style={{ padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="">-- select --</option>
                      <option value="You're">You&apos;re</option>
                      <option value="We're">We&apos;re</option>
                    </select>
                    <span> from Osaka.</span>
                  </div>

                  <div>
                    <span style={{ fontWeight: 700, marginRight: '6px' }}>5.</span>
                    <span>Hi Jaime, hi Abdul. Don&apos;t worry! </span>
                    <select
                      value={ex8Alternatives['5'] || ''}
                      onChange={(e) => onEx8AlternativesChange('5', e.target.value)}
                      disabled={readOnly}
                      style={{ padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="">-- select --</option>
                      <option value="You aren't">You aren&apos;t</option>
                      <option value="They aren't">They aren&apos;t</option>
                    </select>
                    <span> late.</span>
                  </div>
                </div>
              </div>

              {/* Exercise 9: Fill with 're, are and aren't */}
              <div>
                <p className={styles.exTitle}>
                  <span className={styles.exNum}>9</span>
                  <span>Complete the text with <em style={{ fontStyle: 'italic' }}>&apos;re</em>, <em style={{ fontStyle: 'italic' }}>are</em> and <em style={{ fontStyle: 'italic' }}>aren&apos;t</em>.</span>
                </p>

                <div style={{ paddingLeft: '1rem', marginTop: '4px', lineHeight: 1.6 }}>
                  <span>Nick and Kelly </span>
                  <input
                    type="text"
                    value={ex9Text['1'] || ''}
                    onChange={(e) => onEx9TextChange('1', e.target.value)}
                    disabled={readOnly}
                    className={styles.textInputLine}
                    style={{ width: '55px' }}
                  />
                  <span> my friends in London. I&apos;m from the UK, but Nick and Kelly </span>
                  <input
                    type="text"
                    value={ex9Text['2'] || ''}
                    onChange={(e) => onEx9TextChange('2', e.target.value)}
                    disabled={readOnly}
                    className={styles.textInputLine}
                    style={{ width: '65px' }}
                  />
                  <span> British. They </span>
                  <input
                    type="text"
                    value={ex9Text['3'] || ''}
                    onChange={(e) => onEx9TextChange('3', e.target.value)}
                    disabled={readOnly}
                    className={styles.textInputLine}
                    style={{ width: '55px' }}
                  />
                  <span> from Canada.</span>
                </div>
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
