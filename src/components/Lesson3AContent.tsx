'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './lesson3a.module.scss';
import {
  LessonAnswerKey,
  verifyAnswer,
  getExerciseKey,
} from '@/lib/answerVerification';
import TeacherAnswerBadge from './TeacherAnswerBadge';
import PronounceButton from './PronounceButton';

export interface Lesson3AContentProps {
  lesson?: Record<string, unknown> | null;
  user?: Record<string, unknown> | null;
  readOnly?: boolean;
  isTeacherReview?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio: (track: string) => void;
  playingAudio: string | null;

  // Page 22 states
  ex1aPlaces?: Record<string, string>;
  ex2PairNotes?: string;
  ex3Speakers?: Record<string, string>;
  ex4ListeningChoices?: Record<string, string>;
  ex5GrammarGaps?: Record<string, string>;

  // Page 23 states
  ex7aAlternatives?: Record<string, string>;
  ex7bLists?: Record<string, string>;
  ex8TextGaps?: Record<string, string>;
  ex9Sentences?: Record<string, string>;
  ex11SpeakingNotes?: string;

  // Handlers
  onEx1aPlacesChange?: (id: string, value: string) => void;
  onEx2PairNotesChange?: (value: string) => void;
  onEx3SpeakersChange?: (speakerId: string, value: string) => void;
  onEx4ListeningChoicesChange?: (qId: string, value: string) => void;
  onEx5GrammarGapsChange?: (gapId: string, value: string) => void;

  onEx7aAlternativesChange?: (id: string, value: string) => void;
  onEx7bListsChange?: (id: string, value: string) => void;
  onEx8TextGapsChange?: (gapId: string, value: string) => void;
  onEx9SentencesChange?: (num: string, value: string) => void;
  onEx11SpeakingNotesChange?: (value: string) => void;

  originalAnswers?: Record<string, unknown>;
  submissionId?: string;
}

const PLACES_1A = [
  { id: '1', name: 'a train station', letter: 'B' },
  { id: '2', name: 'a hotel', letter: 'C' },
  { id: '3', name: 'a café', letter: 'A' },
  { id: '4', name: 'a bank', letter: 'J' },
  { id: '5', name: 'a restaurant', letter: 'F' },
  { id: '6', name: 'a supermarket', letter: 'L' },
  { id: '7', name: 'a cinema', letter: 'D' },
  { id: '8', name: 'a park', letter: 'G' },
  { id: '9', name: 'a market', letter: 'I' },
  { id: '10', name: 'a bookshop', letter: 'E' },
  { id: '11', name: 'a house', letter: 'K' },
  { id: '12', name: 'a flat', letter: 'H' },
];

const LETTER_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

const EX4_CHOICES = [
  {
    person: 'Jack',
    items: [
      { id: '1', a: 'There are three restaurants.', b: 'There are three cafés.' },
      { id: '2', a: 'There is a supermarket.', b: 'There is a market.' },
    ],
  },
  {
    person: 'Diana',
    items: [
      { id: '3', a: 'There are three hotels.', b: "There aren't any hotels." },
      { id: '4', a: "There's a supermarket.", b: "There's a market." },
    ],
  },
  {
    person: 'Yuki',
    items: [
      { id: '5', a: "There aren't any shops.", b: 'There are two restaurants.' },
      { id: '6', a: "There isn't a train station.", b: "There isn't a bank." },
    ],
  },
];

const EX7A_ALTERNATIVES = [
  { id: '1', before: 'There', opt1: 'is', opt2: 'are', after: 'two nice cafés.' },
  { id: '2', before: 'There is', opt1: 'a', opt2: 'any', after: 'hotel.' },
  { id: '3', before: 'There', opt1: 'is', opt2: 'are', after: 'a big market.' },
  { id: '4', before: "There aren't", opt1: 'any', opt2: 'a', after: 'supermarkets here.' },
  { id: '5', before: 'There are', opt1: 'no', opt2: 'a', after: 'hotels in the city.' },
  { id: '6', before: 'There are', opt1: 'a bookshop', opt2: 'two bookshops', after: '.' },
  { id: '7', before: '', opt1: "There's", opt2: 'There', after: 'a train station.' },
  { id: '8', before: 'There are', opt1: 'no', opt2: 'any', after: 'banks here.' },
];

export default function Lesson3AContent(props: Lesson3AContentProps) {
  const {
    readOnly = false,
    playAudio,
    playingAudio,

    // Page 22
    ex1aPlaces = {},
    ex2PairNotes = '',
    ex3Speakers = {},
    ex4ListeningChoices = {},
    ex5GrammarGaps = {},

    // Page 23
    ex7aAlternatives = {},
    ex7bLists = {},
    ex8TextGaps = {},
    ex9Sentences = {},
    ex11SpeakingNotes = '',

    // Handlers
    onEx1aPlacesChange,
    onEx2PairNotesChange,
    onEx3SpeakersChange,
    onEx4ListeningChoicesChange,
    onEx5GrammarGapsChange,

    onEx7aAlternativesChange,
    onEx7bListsChange,
    onEx8TextGapsChange,
    onEx9SentencesChange,
    onEx11SpeakingNotesChange,
  } = props;

  const activeAnswerKey: LessonAnswerKey | null =
    props.answerKey || (props.lesson?.answerKey as LessonAnswerKey | undefined) || null;
  const isReview = Boolean(props.isTeacherReview || (activeAnswerKey && readOnly));

  const ex1aPlacesKeys = getExerciseKey(activeAnswerKey, 'exercise_1a_places');
  const ex3SpeakersKeys = getExerciseKey(activeAnswerKey, 'exercise_3_speakers');
  const ex4ChoicesKeys = getExerciseKey(activeAnswerKey, 'exercise_4_choices');
  const ex5GrammarKeys = getExerciseKey(activeAnswerKey, 'exercise_5_grammar');
  const ex7aAlternativesKeys = getExerciseKey(activeAnswerKey, 'exercise_7a_alternatives');
  const ex7bListsKeys = getExerciseKey(activeAnswerKey, 'exercise_7b_lists');
  const ex8TextKeys = getExerciseKey(activeAnswerKey, 'exercise_8_text');

  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <div className={styles.pageContainer}>
      {/* ========================================================================= */}
      {/* ======================= PAGE 22: 3A MY TOWN ============================= */}
      {/* ========================================================================= */}
      <div className={styles.textbookPage22}>
        {/* Header chevron banner */}
        <div className={styles.headerBanner22}>
          <div className={styles.headerContent22}>
            <svg
              className={styles.chevronsSvg}
              viewBox="0 0 430 126"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M 0 0 L 195 0 L 245 63 L 195 126 L 0 126 Z" fill="#d32027" />
              <path d="M 203 0 L 243 0 L 293 63 L 243 126 L 203 126 L 253 63 Z" fill="#e87968" />
              <path d="M 251 0 L 291 0 L 341 63 L 291 126 L 251 126 L 301 63 Z" fill="#f0aba0" />
              <path d="M 299 0 L 339 0 L 389 63 L 339 126 L 299 126 L 349 63 Z" fill="#f8d5cf" />
            </svg>

            <div className={styles.badge3A}>
              <span className={styles.num3}>3</span>
              <span className={styles.letterA}>A</span>
            </div>

            <h1 className={styles.titleHeading22}>My town</h1>
          </div>
        </div>

        {/* Goals banner */}
        <div className={styles.goalsCard}>
          <div className={styles.goalItem}>
            <span>›</span>
            <span><strong>Goal:</strong> say what&apos;s in a town</span>
          </div>
          <div className={styles.goalItem}>
            <span>›</span>
            <span><strong>Grammar:</strong> <em>There is/There are</em>; singular and plural nouns</span>
          </div>
          <div className={styles.goalItem}>
            <span>›</span>
            <span><strong>Vocabulary:</strong> places in town</span>
          </div>
        </div>

        {/* Content grid */}
        <div className={styles.grid22}>
          {/* ================= LEFT COLUMN: VOCABULARY & LISTENING ================= */}
          <div className={styles.column}>
            {/* Vocabulary */}
            <div className={styles.sectionHeader}>Vocabulary</div>

            {/* Ex 1a */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>1</span>
                <span className={styles.exLetter}>a</span>
                <span className={styles.instruction}>
                  Work in pairs. Look at the picture. Match A–L with places 1–12.
                </span>
              </div>
              <div className={styles.placesGrid}>
                {PLACES_1A.map((place) => {
                  const val = ex1aPlaces[place.id] || '';
                  const verification = isReview
                    ? verifyAnswer(val, ex1aPlacesKeys?.[place.id])
                    : null;
                  return (
                    <div key={place.id} className={styles.placeItem}>
                      <span className={styles.placeNum}>{place.id}</span>
                      <span className={styles.placeName}>{place.name}</span>
                      <PronounceButton word={place.name} size="small" />
                      <select
                        value={val}
                        onChange={(e) => onEx1aPlacesChange?.(place.id, e.target.value)}
                        disabled={readOnly}
                        className={`${styles.letterSelect} ${
                          verification?.status === 'correct'
                            ? styles.inputValid
                            : verification?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                        aria-label={`Match for ${place.name}`}
                      >
                        <option value="">–</option>
                        {LETTER_OPTIONS.map((letter) => (
                          <option key={letter} value={letter}>
                            {letter}
                          </option>
                        ))}
                      </select>
                      {verification && <TeacherAnswerBadge result={verification} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ex 1b */}
            <div>
              <div className={styles.subPrompt}>
                <span className={styles.exLetter}>b</span>
                <button
                  type="button"
                  onClick={() => playAudio('3.1')}
                  className={`${styles.audioBtn} ${
                    playingAudio === '3.1' ? styles.audioBtnActive : ''
                  }`}
                  disabled={readOnly}
                  aria-label="Play Audio 3.1"
                >
                  {playingAudio === '3.1' ? (
                    <>
                      <div className={styles.equalizer}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                      </div>
                      <span>Playing...</span>
                    </>
                  ) : (
                    '▶ Audio 3.1'
                  )}
                </button>
                <span>
                  Listen and underline the stressed syllables in the words in Exercise 1a. Listen again and repeat.
                </span>
              </div>
            </div>

            {/* Ex 2 */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>2</span>
                <span className={styles.instruction}>
                  Cover the words in Exercise 1a. Work in pairs and look at the picture. Ask and answer questions about the places.
                </span>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', fontStyle: 'italic', color: '#334155', border: '1px solid #e2e8f0', marginBottom: '6px' }}>
                <div><strong>A:</strong> How do you say this in English?</div>
                <div><strong>B:</strong> That&apos;s a cinema.</div>
                <div><strong>A:</strong> How do you spell that?</div>
                <div><strong>B:</strong> C-I-N-E-M-A.</div>
              </div>
              <textarea
                value={ex2PairNotes}
                onChange={(e) => onEx2PairNotesChange?.(e.target.value)}
                disabled={readOnly}
                placeholder="Partner speaking notes..."
                rows={2}
                style={{
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Listening */}
            <div className={styles.sectionHeader}>Listening</div>

            {/* Ex 3 */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>3</span>
                <button
                  type="button"
                  onClick={() => playAudio('3.2')}
                  className={`${styles.audioBtn} ${
                    playingAudio === '3.2' ? styles.audioBtnActive : ''
                  }`}
                  disabled={readOnly}
                  aria-label="Play Audio 3.2"
                >
                  {playingAudio === '3.2' ? (
                    <>
                      <div className={styles.equalizer}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                      </div>
                      <span>Playing...</span>
                    </>
                  ) : (
                    '▶ Audio 3.2'
                  )}
                </button>
              </div>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#1f2937' }}>
                Listen to three people talking about their town. Match speakers 1–3 with photos A–C.
              </div>

              {/* Photos A-C thumbnails */}
              <div className={styles.listeningPhotosRow}>
                <div
                  className={styles.photoThumb}
                  onClick={() => setModalImage('/images/lesson3a/photo_a.png')}
                >
                  <div className={styles.badgeLetter}>A</div>
                  <Image
                    src="/images/lesson3a/photo_a.png"
                    alt="Photo A: Street fruit market"
                    width={128}
                    height={100}
                  />
                </div>
                <div
                  className={styles.photoThumb}
                  onClick={() => setModalImage('/images/lesson3a/photo_b.png')}
                >
                  <div className={styles.badgeLetter}>B</div>
                  <Image
                    src="/images/lesson3a/photo_b.png"
                    alt="Photo B: Bookshop shelves"
                    width={125}
                    height={100}
                  />
                </div>
                <div
                  className={styles.photoThumb}
                  onClick={() => setModalImage('/images/lesson3a/photo_c.png')}
                >
                  <div className={styles.badgeLetter}>C</div>
                  <Image
                    src="/images/lesson3a/photo_c.png"
                    alt="Photo C: Train station tracks"
                    width={160}
                    height={100}
                  />
                </div>
              </div>

              <div className={styles.speakersMatchRow}>
                {(['1', '2', '3'] as const).map((speakerNum) => {
                  const names: Record<string, string> = { '1': 'Jack', '2': 'Diana', '3': 'Yuki' };
                  const val = ex3Speakers[speakerNum] || '';
                  const verification = isReview
                    ? verifyAnswer(val, ex3SpeakersKeys?.[speakerNum])
                    : null;
                  return (
                    <div key={speakerNum} className={styles.speakerItem}>
                      <strong>
                        {speakerNum} {names[speakerNum]}:
                      </strong>
                      <select
                        value={val}
                        onChange={(e) => onEx3SpeakersChange?.(speakerNum, e.target.value)}
                        disabled={readOnly}
                        className={
                          verification?.status === 'correct'
                            ? styles.inputValid
                            : verification?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }
                      >
                        <option value="">–</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                      {verification && <TeacherAnswerBadge result={verification} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: TOWN PICTURE & GRAMMAR ================= */}
          <div className={styles.column}>
            {/* Town map image on page 22 */}
            <div
              className={styles.townImageWrapper}
              onClick={() => setModalImage('/images/lesson3a/town_p22.png')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setModalImage('/images/lesson3a/town_p22.png');
                }
              }}
              aria-label="Enlarge town map part 1"
            >
              <Image
                src="/images/lesson3a/town_p22.png"
                alt="Town map showing A (Bean café), B (Grand Central train station), G (park), H (flats), road with buses"
                width={450}
                height={350}
                priority
              />
              <div className={styles.zoomHint}>🔍 Click to enlarge map</div>
            </div>

            {/* Ex 4 */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>4</span>
                <span className={styles.instruction}>
                  Listen again. What do the people say? Choose the correct option, a or b.
                </span>
              </div>
              <div className={styles.choiceListEx4}>
                {EX4_CHOICES.map((group) => (
                  <div key={group.person} className={styles.personGroup}>
                    <div className={styles.personName}>{group.person}</div>
                    {group.items.map((item) => {
                      const chosen = ex4ListeningChoices[item.id];
                      const verification = isReview
                        ? verifyAnswer(chosen, ex4ChoicesKeys?.[item.id])
                        : null;
                      return (
                        <div key={item.id} className={styles.choiceQuestion}>
                          <div className={styles.optionsGroup}>
                            <label
                              className={`${
                                chosen === 'a' ? styles.selectedOption : ''
                              } ${
                                verification && chosen === 'a'
                                  ? verification.status === 'correct'
                                    ? styles.choiceValid
                                    : styles.choiceInvalid
                                  : ''
                              }`}
                            >
                              <input
                                type="radio"
                                name={`ex4_${item.id}`}
                                value="a"
                                checked={chosen === 'a'}
                                onChange={() => onEx4ListeningChoicesChange?.(item.id, 'a')}
                                disabled={readOnly}
                              />
                              <span>
                                <strong>a</strong> {item.a}
                              </span>
                            </label>
                            <label
                              className={`${
                                chosen === 'b' ? styles.selectedOption : ''
                              } ${
                                verification && chosen === 'b'
                                  ? verification.status === 'correct'
                                    ? styles.choiceValid
                                    : styles.choiceInvalid
                                  : ''
                              }`}
                            >
                              <input
                                type="radio"
                                name={`ex4_${item.id}`}
                                value="b"
                                checked={chosen === 'b'}
                                onChange={() => onEx4ListeningChoicesChange?.(item.id, 'b')}
                                disabled={readOnly}
                              />
                              <span>
                                <strong>b</strong> {item.b}
                              </span>
                            </label>
                            {verification && <TeacherAnswerBadge result={verification} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Grammar Ex 5 */}
            <div>
              <div className={styles.sectionHeader}>Grammar</div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>5</span>
                <span className={styles.instruction}>
                  Read and complete the grammar box with <em>There is</em> and <em>There are</em>. Use Exercise 4 to help you.
                </span>
              </div>

              <div className={styles.grammarTableWrapper}>
                <div className={styles.tableTitle}>
                  <span>There is/ There are</span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '26px' }}></th>
                      <th style={{ width: '44%' }}>Singular</th>
                      <th>Plural</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={styles.signCol}>+</td>
                      <td>
                        <div className={styles.line}>
                          <strong>There&apos;s a</strong> park.
                        </div>
                        <div className={styles.gapLine}>
                          <span className={styles.supNum}>1</span>
                          {(() => {
                            const val = ex5GrammarGaps['1'] || '';
                            const verification = isReview
                              ? verifyAnswer(val, ex5GrammarKeys?.['1'])
                              : null;
                            return (
                              <>
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => onEx5GrammarGapsChange?.('1', e.target.value)}
                                  disabled={readOnly}
                                  placeholder=""
                                  className={`${styles.grammarInput} ${
                                    verification?.status === 'correct'
                                      ? styles.inputValid
                                      : verification?.status === 'incorrect'
                                      ? styles.inputInvalid
                                      : ''
                                  }`}
                                  aria-label="Gap 1: There is a park"
                                />
                                <span className={styles.gapAfter}>
                                  <strong>a</strong> park.
                                </span>
                                {verification && <TeacherAnswerBadge result={verification} />}
                              </>
                            );
                          })()}
                        </div>
                      </td>
                      <td>
                        <div className={styles.emptyLine} aria-hidden="true">
                          &nbsp;
                        </div>
                        <div className={styles.gapLine}>
                          <span className={styles.supNum}>2</span>
                          {(() => {
                            const val = ex5GrammarGaps['2'] || '';
                            const verification = isReview
                              ? verifyAnswer(val, ex5GrammarKeys?.['2'])
                              : null;
                            return (
                              <>
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => onEx5GrammarGapsChange?.('2', e.target.value)}
                                  disabled={readOnly}
                                  placeholder=""
                                  className={`${styles.grammarInput} ${
                                    verification?.status === 'correct'
                                      ? styles.inputValid
                                      : verification?.status === 'incorrect'
                                      ? styles.inputInvalid
                                      : ''
                                  }`}
                                  aria-label="Gap 2: There are three cafés"
                                />
                                <span className={styles.gapAfter}>
                                  <strong>three</strong> cafés.
                                </span>
                                {verification && <TeacherAnswerBadge result={verification} />}
                              </>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.signCol}>-</td>
                      <td>
                        <div className={styles.line}>
                          <strong>There isn&apos;t a</strong> bank.
                        </div>
                      </td>
                      <td>
                        <div className={styles.line}>
                          <strong>There aren&apos;t any</strong>
                        </div>
                        <div className={styles.line}>supermarkets.</div>
                        <div className={styles.gapLine} style={{ marginTop: '4px' }}>
                          <span className={styles.supNum}>3</span>
                          {(() => {
                            const val = ex5GrammarGaps['3'] || '';
                            const verification = isReview
                              ? verifyAnswer(val, ex5GrammarKeys?.['3'])
                              : null;
                            return (
                              <>
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => onEx5GrammarGapsChange?.('3', e.target.value)}
                                  disabled={readOnly}
                                  placeholder=""
                                  className={`${styles.grammarInput} ${
                                    verification?.status === 'correct'
                                      ? styles.inputValid
                                      : verification?.status === 'incorrect'
                                      ? styles.inputInvalid
                                      : ''
                                  }`}
                                  aria-label="Gap 3: There are no supermarkets"
                                />
                                <span className={styles.gapAfter}>
                                  <strong>no</strong> supermarkets.
                                </span>
                                {verification && <TeacherAnswerBadge result={verification} />}
                              </>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Page 22 badge */}
        <div className={`${styles.pageNumberBadge} ${styles.left}`}>
          <svg width="34" height="34" viewBox="0 0 34 34">
            <circle cx="17" cy="17" r="15" fill="#d32027" />
            <text x="17" y="22" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
              22
            </text>
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ======================= PAGE 23: 3A MY TOWN (PART 2) ==================== */}
      {/* ========================================================================= */}
      <div className={styles.textbookPage23}>
        {/* Panorama image across top of Page 23 */}
        <div
          className={styles.panoramaWrapper}
          onClick={() => setModalImage('/images/lesson3a/town_p23.png')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setModalImage('/images/lesson3a/town_p23.png');
            }
          }}
          aria-label="Enlarge town panorama part 2"
        >
          <Image
            src="/images/lesson3a/town_p23.png"
            alt="Town panorama showing Royal Plaza (C), Roxy cinema (D), Reading Corner (E), restaurant (F), Three Amigos (I), RSB bank (J), house (K), Food Fresh supermarket (L)"
            width={850}
            height={320}
            priority
          />
          <div className={styles.zoomHint}>🔍 Click to enlarge panorama</div>
        </div>

        <div className={styles.grid23}>
          {/* ================= LEFT COLUMN ================= */}
          <div className={styles.column}>
            {/* Ex 6a: Audio 3.3 */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>6</span>
                <span className={styles.exLetter}>a</span>
                <button
                  type="button"
                  onClick={() => playAudio('3.3')}
                  className={`${styles.audioBtn} ${
                    playingAudio === '3.3' ? styles.audioBtnActive : ''
                  }`}
                  disabled={readOnly}
                  aria-label="Play Audio 3.3"
                >
                  {playingAudio === '3.3' ? (
                    <>
                      <div className={styles.equalizer}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                      </div>
                      <span>Playing...</span>
                    </>
                  ) : (
                    '▶ Audio 3.3'
                  )}
                </button>
              </div>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#1f2937' }}>
                Listen to the sentences. Notice the sound of <em>there&apos;s, there isn&apos;t, there are</em> and <em>there aren&apos;t</em>.
              </div>
              <div className={styles.sentencesList6a}>
                <div className={styles.sentenceItem}>
                  <strong>1</strong> <span>There&apos;s a park.</span>
                </div>
                <div className={styles.sentenceItem}>
                  <strong>2</strong> <span>There are three cafés.</span>
                </div>
                <div className={styles.sentenceItem}>
                  <strong>3</strong> <span>There isn&apos;t a bank.</span>
                </div>
                <div className={styles.sentenceItem}>
                  <strong>4</strong> <span>There are no supermarkets.</span>
                </div>
                <div className={styles.sentenceItem}>
                  <strong>5</strong> <span>There aren&apos;t any cinemas.</span>
                </div>
              </div>
            </div>

            {/* Ex 6b */}
            <div>
              <div className={styles.subPrompt}>
                <span className={styles.exLetter}>b</span>
                <span>Listen again and repeat.</span>
              </div>
            </div>

            {/* Ex 7a */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>7</span>
                <span className={styles.exLetter}>a</span>
                <span className={styles.instruction}>Choose the correct alternatives.</span>
              </div>
              <div className={styles.alternativesList7a}>
                {EX7A_ALTERNATIVES.map((alt) => {
                  const val = ex7aAlternatives[alt.id] || '';
                  const verification = isReview
                    ? verifyAnswer(val, ex7aAlternativesKeys?.[alt.id])
                    : null;
                  return (
                    <div key={alt.id} className={styles.altRow}>
                      <span className={styles.altNum}>{alt.id}</span>
                      {alt.before && <span>{alt.before}</span>}
                      <span className={styles.choicePills}>
                        <button
                          type="button"
                          className={`${styles.choiceBtn} ${
                            val === alt.opt1 ? styles.choiceSelected : ''
                          } ${
                            verification && val === alt.opt1
                              ? verification.status === 'correct'
                                ? styles.choiceValid
                                : styles.choiceInvalid
                              : ''
                          }`}
                          onClick={() => !readOnly && onEx7aAlternativesChange?.(alt.id, alt.opt1)}
                          disabled={readOnly}
                        >
                          {alt.opt1}
                        </button>
                        <span>/</span>
                        <button
                          type="button"
                          className={`${styles.choiceBtn} ${
                            val === alt.opt2 ? styles.choiceSelected : ''
                          } ${
                            verification && val === alt.opt2
                              ? verification.status === 'correct'
                                ? styles.choiceValid
                                : styles.choiceInvalid
                              : ''
                          }`}
                          onClick={() => !readOnly && onEx7aAlternativesChange?.(alt.id, alt.opt2)}
                          disabled={readOnly}
                        >
                          {alt.opt2}
                        </button>
                      </span>
                      <span>{alt.after}</span>
                      {verification && <TeacherAnswerBadge result={verification} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ex 7b */}
            <div>
              <div className={styles.subPrompt}>
                <span className={styles.exLetter}>b</span>
                <span>Look at the grammar box again. Complete the lists.</span>
              </div>
              <div className={styles.lists7b}>
                {(() => {
                  const val1 = ex7bLists['1'] || '';
                  const v1 = isReview ? verifyAnswer(val1, ex7bListsKeys?.['1']) : null;
                  return (
                    <div className={styles.listRow}>
                      <span className={styles.rowNum}>1</span>
                      <span>one park; two parks; three</span>
                      <input
                        type="text"
                        value={val1}
                        onChange={(e) => onEx7bListsChange?.('1', e.target.value)}
                        disabled={readOnly}
                        placeholder="..."
                        className={`${styles.underlinedInput} ${
                          v1?.status === 'correct'
                            ? styles.inputValid
                            : v1?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      />
                      {v1 && <TeacherAnswerBadge result={v1} />}
                    </div>
                  );
                })()}
                {(() => {
                  const val2 = ex7bLists['2'] || '';
                  const v2 = isReview ? verifyAnswer(val2, ex7bListsKeys?.['2']) : null;
                  return (
                    <div className={styles.listRow}>
                      <span className={styles.rowNum}>2</span>
                      <span>one</span>
                      <input
                        type="text"
                        value={val2}
                        onChange={(e) => onEx7bListsChange?.('2', e.target.value)}
                        disabled={readOnly}
                        placeholder="..."
                        className={`${styles.underlinedInput} ${
                          v2?.status === 'correct'
                            ? styles.inputValid
                            : v2?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      />
                      <span>; two cafés; three cafés</span>
                      {v2 && <TeacherAnswerBadge result={v2} />}
                    </div>
                  );
                })()}
                {(() => {
                  const val3 = ex7bLists['3'] || '';
                  const v3 = isReview ? verifyAnswer(val3, ex7bListsKeys?.['3']) : null;
                  return (
                    <div className={styles.listRow}>
                      <span className={styles.rowNum}>3</span>
                      <span>one restaurant; two restaurants; three</span>
                      <input
                        type="text"
                        value={val3}
                        onChange={(e) => onEx7bListsChange?.('3', e.target.value)}
                        disabled={readOnly}
                        placeholder="..."
                        className={`${styles.underlinedInput} ${
                          v3?.status === 'correct'
                            ? styles.inputValid
                            : v3?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      />
                      {v3 && <TeacherAnswerBadge result={v3} />}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Ex 8 */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>8</span>
                <span className={styles.instruction}>Complete the text.</span>
              </div>
              <div className={styles.textFillCard}>
                Uvo is a good town. There <span className={styles.gapIndex}>1</span>
                {(() => {
                  const v = isReview
                    ? verifyAnswer(ex8TextGaps['1'] || '', ex8TextKeys?.['1'])
                    : null;
                  return (
                    <>
                      <input
                        type="text"
                        value={ex8TextGaps['1'] || ''}
                        onChange={(e) => onEx8TextGapsChange?.('1', e.target.value)}
                        disabled={readOnly}
                        placeholder="..."
                        className={`${styles.gapInput} ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      />
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                two parks, Thorpe Park and Stanley Park. There are no restaurants, but there&apos;s{' '}
                <span className={styles.gapIndex}>2</span>
                {(() => {
                  const v = isReview
                    ? verifyAnswer(ex8TextGaps['2'] || '', ex8TextKeys?.['2'])
                    : null;
                  return (
                    <>
                      <input
                        type="text"
                        value={ex8TextGaps['2'] || ''}
                        onChange={(e) => onEx8TextGapsChange?.('2', e.target.value)}
                        disabled={readOnly}
                        placeholder="..."
                        className={`${styles.gapInput} ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                        style={{ minWidth: '40px' }}
                      />
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                café – it&apos;s really good! <span className={styles.gapIndex}>3</span>
                {(() => {
                  const v = isReview
                    ? verifyAnswer(ex8TextGaps['3'] || '', ex8TextKeys?.['3'])
                    : null;
                  return (
                    <>
                      <input
                        type="text"
                        value={ex8TextGaps['3'] || ''}
                        onChange={(e) => onEx8TextGapsChange?.('3', e.target.value)}
                        disabled={readOnly}
                        placeholder="..."
                        className={`${styles.gapInput} ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      />
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                a train station and <span className={styles.gapIndex}>4</span>
                {(() => {
                  const v = isReview
                    ? verifyAnswer(ex8TextGaps['4'] || '', ex8TextKeys?.['4'])
                    : null;
                  return (
                    <>
                      <input
                        type="text"
                        value={ex8TextGaps['4'] || ''}
                        onChange={(e) => onEx8TextGapsChange?.('4', e.target.value)}
                        disabled={readOnly}
                        placeholder="..."
                        className={`${styles.gapInput} ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      />
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                are two bookshops. There <span className={styles.gapIndex}>5</span>
                {(() => {
                  const v = isReview
                    ? verifyAnswer(ex8TextGaps['5'] || '', ex8TextKeys?.['5'])
                    : null;
                  return (
                    <>
                      <input
                        type="text"
                        value={ex8TextGaps['5'] || ''}
                        onChange={(e) => onEx8TextGapsChange?.('5', e.target.value)}
                        disabled={readOnly}
                        placeholder="..."
                        className={`${styles.gapInput} ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      />
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                no cinemas, no hotels and <span className={styles.gapIndex}>6</span>
                {(() => {
                  const v = isReview
                    ? verifyAnswer(ex8TextGaps['6'] || '', ex8TextKeys?.['6'])
                    : null;
                  return (
                    <>
                      <input
                        type="text"
                        value={ex8TextGaps['6'] || ''}
                        onChange={(e) => onEx8TextGapsChange?.('6', e.target.value)}
                        disabled={readOnly}
                        placeholder="..."
                        className={`${styles.gapInput} ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                        style={{ minWidth: '40px' }}
                      />
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                banks, but I love my town!
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: WRITING & SPEAKING ================= */}
          <div className={styles.column}>
            {/* Ex 9 */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>9</span>
                <span className={styles.instruction}>
                  Write six sentences about your town. Use <em>there is</em> and <em>there are</em>.
                </span>
              </div>
              <div style={{ fontStyle: 'italic', color: '#0369a1', fontSize: '0.85rem', marginBottom: '0.45rem', paddingLeft: '1.25rem' }}>
                <div>e.g. There&apos;s a train station.</div>
                <div>There aren&apos;t any hotels.</div>
              </div>
              <div className={styles.sentencesWritingGrid}>
                {['1', '2', '3', '4', '5', '6'].map((num) => (
                  <div key={num} className={styles.writeRow}>
                    <span className={styles.num}>{num}</span>
                    <input
                      type="text"
                      value={ex9Sentences[num] || ''}
                      onChange={(e) => onEx9SentencesChange?.(num, e.target.value)}
                      disabled={readOnly}
                      placeholder={`Sentence ${num}...`}
                      className={styles.underlinedInput}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Speaking Section */}
            <div className={styles.sectionHeader}>Speaking</div>

            {/* Prepare */}
            <div>
              <div className={styles.speakingBadgeRow}>
                <span className={styles.stepBadge}>PREPARE</span>
              </div>
              <div className={styles.exerciseHeader} style={{ marginTop: '0.5rem' }}>
                <span className={styles.exNumber}>10</span>
                <span className={styles.instruction}>
                  Work in pairs. Student A: Turn to page 153. Student B: Turn to page 154.
                </span>
              </div>
            </div>

            {/* Speak */}
            <div>
              <div className={styles.speakingBadgeRow}>
                <span className={styles.stepBadge}>SPEAK</span>
              </div>
              <div className={styles.exerciseHeader} style={{ marginTop: '0.5rem' }}>
                <span className={styles.exNumber}>11</span>
                <span className={styles.instruction}>
                  Tell your partner about the town. Find nine differences.
                </span>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', fontStyle: 'italic', color: '#334155', border: '1px solid #e2e8f0', marginBottom: '6px' }}>
                <div><strong>A:</strong> There are two cafés in my town.</div>
                <div><strong>B:</strong> There are three cafés in my town.</div>
                <div><strong>A:</strong> That&apos;s different!</div>
              </div>
              <textarea
                value={ex11SpeakingNotes}
                onChange={(e) => onEx11SpeakingNotesChange?.(e.target.value)}
                disabled={readOnly}
                placeholder="Differences found (e.g. 1. Student A has 2 cafés, Student B has 3 cafés...)..."
                rows={3}
                style={{
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Develop your reading badge */}
            <div className={styles.readingBadge}>
              <strong>Develop your reading</strong>
              <span>page 92</span>
            </div>
          </div>
        </div>

        {/* Page 23 badge */}
        <div className={`${styles.pageNumberBadge} ${styles.right}`}>
          <svg width="34" height="34" viewBox="0 0 34 34">
            <circle cx="17" cy="17" r="15" fill="#d32027" />
            <text x="17" y="22" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
              23
            </text>
          </svg>
        </div>
      </div>

      {/* Shared image zoom modal */}
      {modalImage && (
        <div
          className={styles.imageModalOverlay}
          onClick={() => setModalImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setModalImage(null)}
              aria-label="Close enlarged picture"
            >
              ✕
            </button>
            <Image
              src={modalImage}
              alt="Enlarged town illustration"
              width={1100}
              height={700}
              style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxWidth: '90vw', maxHeight: '85vh' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
