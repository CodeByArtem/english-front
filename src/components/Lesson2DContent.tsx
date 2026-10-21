'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './lesson2d.module.scss';
import {
  LessonAnswerKey,
  verifyAnswer,
  getExerciseKey,
} from '@/lib/answerVerification';
import TeacherAnswerBadge from './TeacherAnswerBadge';
import PronounceButton from './PronounceButton';

export interface Lesson2DContentProps {
  lesson?: Record<string, unknown> | null;
  user?: Record<string, unknown> | null;
  readOnly?: boolean;
  isTeacherReview?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio: (track: string) => void;
  playingAudio: string | null;

  // Page 20 states
  ex1Objects?: string;
  ex2aBought?: string;
  ex2bPhrases?: Record<string, boolean>;
  ex3aDialogue?: Record<string, string>;
  ex4Notes?: string;

  // Page 21 states
  ex1Family?: Record<string, string>;
  ex2Possessive?: Record<string, string>;
  ex3Alternatives?: Record<string, string>;
  ex4Mistakes?: Record<string, string>;
  ex5Anagrams?: Record<string, string>;
  ex6Demonstratives?: Record<string, string>;
  ex7aMath?: Record<string, string>;
  ex7bAges?: Record<string, string>;
  ex8aQuestions?: Record<string, string>;
  ex8bPairNotes?: string;
  reflectScores?: Record<string, string | number>;

  // Handlers
  onEx1ObjectsChange?: (value: string) => void;
  onEx2aBoughtChange?: (value: string) => void;
  onEx2bPhrasesChange?: (phrase: string, checked: boolean) => void;
  onEx3aDialogueChange?: (gapId: string, value: string) => void;
  onEx4NotesChange?: (value: string) => void;

  onEx1FamilyChange?: (id: string, value: string) => void;
  onEx2PossessiveChange?: (id: string, value: string) => void;
  onEx3AlternativesChange?: (id: string, value: string) => void;
  onEx4MistakesChange?: (id: string, value: string) => void;
  onEx5AnagramsChange?: (id: string, value: string) => void;
  onEx6DemonstrativesChange?: (id: string, value: string) => void;
  onEx7aMathChange?: (id: string, value: string) => void;
  onEx7bAgesChange?: (id: string, value: string) => void;
  onEx8aQuestionsChange?: (id: string, value: string) => void;
  onEx8bPairNotesChange?: (value: string) => void;
  onReflectScoresChange?: (id: string, value: string | number) => void;

  originalAnswers?: Record<string, unknown>;
  submissionId?: string;
}

const USEFUL_PHRASES_CUSTOMER = [
  'How much is this book?',
  'How much are those cups?',
  'How much is this?',
  'How much is that?',
  'Can I pay by card?',
  'Here you are.',
  "Here's my card.",
];

const USEFUL_PHRASES_ASSISTANT = [
  "It's £12 (for four cups).",
  "That's £9.99.",
  "It's £15.99.",
  "That's £27.99, please.",
  'Cash or card?',
  "Here's your change.",
  "Here's your card.",
];

const cleanPhraseForSpeech = (text: string) =>
  text.replace(/[()]/g, '').replace(/£(\d+(?:\.\d+)?)/g, '$1 pounds');

const EX1_FAMILY_ITEMS = [
  { id: '1', text: "Catherine is Michael's wife. Michael is Catherine's", answer: 'husband', isExample: true },
  { id: '2', text: "Jim is Hayley's husband. Hayley is Jim's", placeholder: '' },
  { id: '3', text: "Hector is Joe's father. Joe is Hector's", placeholder: '' },
  { id: '4', text: "Jill is Jane's mother. Jane is Jill's", placeholder: '' },
  { id: '5', text: "Sally is David's sister. David is Sally's", placeholder: '' },
  { id: '6', text: "Sam and Ellie are Martin and Kate's children. Martin and Kate are Sam and Ellie's", placeholder: '' },
  { id: '7', text: "Andrew is Beth's brother. Beth is Andrew's", placeholder: '' },
  { id: '8', text: "Pedro is Paulo's son. Paulo is Pedro's", placeholder: '' },
];

const EX2_POSSESSIVE_ITEMS = [
  { id: '1', prompt: 'the sister of Peter', answer: "Peter's sister", isExample: true },
  { id: '2', prompt: 'the family of Julie', placeholder: '' },
  { id: '3', prompt: 'the parents of Martin', placeholder: '' },
  { id: '4', prompt: 'the dog of my friend', placeholder: '' },
  { id: '5', prompt: 'the pen of my teacher', placeholder: '' },
  { id: '6', prompt: 'the book of my brother', placeholder: '' },
];

const EX3_ALTERNATIVES_ITEMS = [
  { id: '1', before: "We're in Room 211 today.", opt1: 'Our', opt2: 'Their', after: 'teacher is Joanna.' },
  { id: '2', before: 'This is a photo of my sister.', opt1: 'His', opt2: 'Her', after: 'name is Amanda.' },
  { id: '3', before: 'This is my brother with', opt1: 'his', opt2: 'her', after: 'girlfriend, Lucy.' },
  { id: '4', before: "Misha and Roxana aren't here today. They're with", opt1: 'their', opt2: 'its', after: 'mum in London.' },
  { id: '5', before: 'Your dog is nice. What’s', opt1: 'our', opt2: 'its', after: 'name?' },
  { id: '6', before: 'This is a photo of', opt1: 'my', opt2: 'their', mid: 'father.', opt3: 'His', opt4: 'its', after: 'name is Andrea and he’s a doctor.' },
];

const EX4_MISTAKES_ITEMS = [
  { id: '1', wrong: "Is this a photo of you're mum?", placeholder: '' },
  { id: '2', wrong: "They're sisters. They're names are Lulu and Beth.", placeholder: '' },
  { id: '3', wrong: 'Is your fathers name Eric?', placeholder: '' },
  { id: '4', wrong: 'Your from Spain. Your friend is from Mexico.', placeholder: '' },
];

const EX5_ANAGRAMS_ITEMS = [
  { id: '1', scrambled: 'blate', first: 't', answer: 'able', full: 'table', isExample: true },
  { id: '2', scrambled: 'haric', first: 'c', placeholder: '' },
  { id: '3', scrambled: 'nophe', first: 'p', placeholder: '' },
  { id: '4', scrambled: 'enp', first: 'p', placeholder: '' },
  { id: '5', scrambled: 'sked', first: 'd', placeholder: '' },
  { id: '6', scrambled: 'petrumoc', first: 'c', placeholder: '' },
  { id: '7', scrambled: 'yek', first: 'k', placeholder: '' },
  { id: '8', scrambled: 'hotop', first: 'p', placeholder: '' },
  { id: '9', scrambled: 'puc', first: 'c', placeholder: '' },
  { id: '10', scrambled: 'kobo', first: 'b', placeholder: '' },
  { id: '11', scrambled: 'oxb', first: 'b', placeholder: '' },
  { id: '12', scrambled: 'lkocc', first: 'c', placeholder: '' },
];

const EX6_DEMONSTRATIVE_ITEMS = [
  { id: '1', promptBefore: 'Is', opt1: 'this', opt2: 'that', promptAfter: 'our classroom here?' },
  { id: '2', promptBefore: '', opt1: "That's", opt2: 'Those are', promptAfter: "my husband. His name's Hugo." },
  { id: '3', promptBefore: 'Are', opt1: 'this', opt2: 'these', promptAfter: 'your pens on my table?' },
  { id: '4', promptBefore: 'Are', opt1: 'that', opt2: 'those', promptAfter: "your keys on the teacher's desk?" },
];

const EX7A_MATH_ITEMS = [
  { id: '1', equation: '5 x 5 =', answer: 'twenty-five', isExample: true },
  { id: '2', equation: '6 + 7 =', placeholder: '' },
  { id: '3', equation: '3 x 10 =', placeholder: '' },
  { id: '4', equation: '42 + 14 =', placeholder: '' },
  { id: '5', equation: '10 + 3 + 2 =', placeholder: '' },
  { id: '6', equation: '2 x 25 =', placeholder: '' },
  { id: '7', equation: '25 + 17 =', placeholder: '' },
  { id: '8', equation: '8 x 7 =', placeholder: '' },
  { id: '9', equation: '17 + 12 =', placeholder: '' },
  { id: '10', equation: '9 x 9 =', placeholder: '' },
  { id: '11', equation: '15 + 15 + 6 =', placeholder: '' },
  { id: '12', equation: '9 x 7 =', placeholder: '' },
];

const EX7B_AGES_ITEMS = [
  { id: '1', first: "My son's 10.", secondStart: "He's", answer: 'ten years old', secondEnd: '.', isExample: true },
  { id: '2', first: "My mother's 58.", secondStart: "She's", placeholder: '', secondEnd: '.' },
  { id: '3', first: "My sister's 19.", secondStart: "She's", placeholder: '', secondEnd: '.' },
  { id: '4', first: "My mum's brother is 33.", secondStart: "He's", placeholder: '', secondEnd: '.' },
];

const EX8A_QUESTIONS_ITEMS = [
  { id: '1', words: "father's / is / What / your / job ?", placeholder: '' },
  { id: '2', words: 'is / from / Where / teacher / your ?', placeholder: '' },
  { id: '3', words: 'old / phone / How / is / your ?', placeholder: '' },
  { id: '4', words: 'old / How / your / parents / are ?', placeholder: '' },
  { id: '5', words: 'Maradona / are / Messi / Where / from / and ?', placeholder: '' },
];

const REFLECT_STATEMENTS = [
  { id: '1', text: 'I can talk about my family.' },
  { id: '2', text: 'I can talk about everyday objects.' },
  { id: '3', text: 'I can ask questions about other people.' },
  { id: '4', text: 'I can pay for things in a shop.' },
];

export default function Lesson2DContent(props: Lesson2DContentProps) {
  const {
    readOnly = false,
    isTeacherReview = false,
    answerKey = null,
    playAudio,
    playingAudio,

    // Page 20
    ex1Objects = '',
    ex2aBought = '',
    ex2bPhrases = {},
    ex3aDialogue = {},
    ex4Notes = '',

    // Page 21
    ex1Family = {},
    ex2Possessive = {},
    ex3Alternatives = {},
    ex4Mistakes = {},
    ex5Anagrams = {},
    ex6Demonstratives = {},
    ex7aMath = {},
    ex7bAges = {},
    ex8aQuestions = {},
    ex8bPairNotes = '',
    reflectScores = {},

    // Handlers
    onEx1ObjectsChange,
    onEx2aBoughtChange,
    onEx2bPhrasesChange,
    onEx3aDialogueChange,
    onEx4NotesChange,

    onEx1FamilyChange,
    onEx2PossessiveChange,
    onEx3AlternativesChange,
    onEx4MistakesChange,
    onEx5AnagramsChange,
    onEx6DemonstrativesChange,
    onEx7aMathChange,
    onEx7bAgesChange,
    onEx8aQuestionsChange,
    onEx8bPairNotesChange,
    onReflectScoresChange,
  } = props;

  const activeAnswerKey: LessonAnswerKey | null =
    answerKey || (props.lesson?.answerKey as LessonAnswerKey | undefined) || null;
  const isReview = Boolean(isTeacherReview || (activeAnswerKey && readOnly));

  const ex3aDialogueKeys = getExerciseKey(activeAnswerKey, 'exercise_3a_dialogue');
  const ex1FamilyKeys = getExerciseKey(activeAnswerKey, 'exercise_1_family');
  const ex2PossessiveKeys = getExerciseKey(activeAnswerKey, 'exercise_2_possessive');
  const ex3AlternativesKeys = getExerciseKey(activeAnswerKey, 'exercise_3_alternatives');
  const ex5AnagramsKeys = getExerciseKey(activeAnswerKey, 'exercise_5_anagrams');
  const ex6DemonstrativesKeys = getExerciseKey(activeAnswerKey, 'exercise_6_demonstratives');
  const ex7aMathKeys = getExerciseKey(activeAnswerKey, 'exercise_7a_math');
  const ex7bAgesKeys = getExerciseKey(activeAnswerKey, 'exercise_7b_ages');
  const ex8aQuestionsKeys = getExerciseKey(activeAnswerKey, 'exercise_8a_questions');

  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <div className={styles.pageContainer}>
      {/* ========================================================================= */}
      {/* ======================= PAGE 20: 2D ENGLISH IN ACTION =================== */}
      {/* ========================================================================= */}
      <div className={styles.textbookPage20}>
        {/* Header chevron banner */}
        <div className={styles.headerBanner20}>
          <div className={styles.headerContent20}>
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

            <div className={styles.badge2D}>
              <span className={styles.num2}>2</span>
              <span className={styles.letterD}>D</span>
            </div>

            <h1 className={styles.titleHeading20}>English in action</h1>
          </div>
        </div>

        {/* Goal banner */}
        <div className={styles.goalBanner20}>
          <span>›</span>
          <strong>Goal:</strong> pay for things in a shop
        </div>

        {/* Shop illustration */}
        <div
          className={styles.shopIllustrationWrapper}
          onClick={() => setModalImage('/images/lesson2d/shop_user.png')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setModalImage('/images/lesson2d/shop_user.png');
            }
          }}
          aria-label="Enlarge shop picture"
        >
          <Image
            src="/images/lesson2d/shop_user.png"
            alt="Secondhand shop with price tags: books £9.99, cups £2, clock £120, wall clock £19.99, chair £45, telephone £52, laptop £319, yellow boxes £5 and £100, box £14"
            width={817}
            height={457}
            priority
          />
          <div className={styles.zoomHint}>🔍 Click to enlarge picture</div>
        </div>

        {/* Content grid */}
        <div className={styles.grid20}>
          {/* ================= LEFT COLUMN ================= */}
          <div className={styles.column}>
            {/* Ex 1 */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>1</span>
                <span className={styles.instruction}>Look at the picture. What objects can you see?</span>
              </div>
              <textarea
                value={ex1Objects}
                onChange={(e) => onEx1ObjectsChange?.(e.target.value)}
                disabled={readOnly}
                placeholder="List objects you see in the picture..."
                rows={3}
                style={{
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '8px',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Ex 2a: Audio 2.20 */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>2</span>
                <span className={styles.exLetter}>a</span>
                <button
                  type="button"
                  onClick={() => playAudio('2.20')}
                  className={`${styles.audioBtn} ${
                    playingAudio === '2.20' ? styles.audioBtnActive : ''
                  }`}
                  disabled={readOnly}
                  aria-label="Play Audio 2.20"
                >
                  {playingAudio === '2.20' ? (
                    <>
                      <div className={styles.equalizer}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                      </div>
                      <span>Playing...</span>
                    </>
                  ) : (
                    '▶ Audio 2.20'
                  )}
                </button>
              </div>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: '#1f2937' }}>
                Listen to a conversation in a shop. Which objects in the picture does the man buy?
              </div>
              <input
                type="text"
                value={ex2aBought}
                onChange={(e) => onEx2aBoughtChange?.(e.target.value)}
                disabled={readOnly}
                placeholder=""
                className={styles.underlinedInput}
                style={{ width: '100%' }}
              />
            </div>

            {/* Ex 2b: Tick phrases */}
            <div>
              <div className={styles.subPrompt}>
                <span className={styles.exLetter}>b</span>
                <span>Listen again and tick the phrases in the Useful phrases box that you hear.</span>
              </div>

              {/* Useful phrases Box with checkboxes */}
              <div className={styles.usefulPhrasesCard}>
                <div className={styles.cardTitle}>Useful phrases</div>

                <div className={styles.sectionTitle}>Customer&apos;s phrases</div>
                <ul className={styles.phraseList}>
                  {USEFUL_PHRASES_CUSTOMER.map((phrase) => {
                    const isChecked = !!ex2bPhrases[phrase];
                    return (
                      <li key={phrase} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <label className={`${styles.phraseRow} ${isChecked ? styles.checkedPhrase : ''}`} style={{ flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => onEx2bPhrasesChange?.(phrase, e.target.checked)}
                            disabled={readOnly}
                          />
                          <span>{phrase}</span>
                        </label>
                        <PronounceButton word={cleanPhraseForSpeech(phrase)} size="small" />
                      </li>
                    );
                  })}
                </ul>

                <div className={styles.sectionTitle} style={{ marginTop: '0.85rem' }}>
                  Shop assistant&apos;s phrases
                </div>
                <ul className={styles.phraseList}>
                  {USEFUL_PHRASES_ASSISTANT.map((phrase) => {
                    const isChecked = !!ex2bPhrases[phrase];
                    return (
                      <li key={phrase} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <label className={`${styles.phraseRow} ${isChecked ? styles.checkedPhrase : ''}`} style={{ flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => onEx2bPhrasesChange?.(phrase, e.target.checked)}
                            disabled={readOnly}
                          />
                          <span>{phrase}</span>
                        </label>
                        <PronounceButton word={cleanPhraseForSpeech(phrase)} size="small" />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Ex 2c: Audio 2.21 */}
            <div>
              <div className={styles.subPrompt}>
                <span className={styles.exLetter}>c</span>
                <button
                  type="button"
                  onClick={() => playAudio('2.21')}
                  className={`${styles.audioBtn} ${
                    playingAudio === '2.21' ? styles.audioBtnActive : ''
                  }`}
                  disabled={readOnly}
                  aria-label="Play Audio 2.21"
                >
                  {playingAudio === '2.21' ? (
                    <>
                      <div className={styles.equalizer}>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                        <div className={styles.bar}></div>
                      </div>
                      <span>Playing...</span>
                    </>
                  ) : (
                    '▶ Audio 2.21'
                  )}
                </button>
                <span>Listen and repeat the phrases.</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className={styles.column}>
            {/* Ex 3a: Dialogue */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>3</span>
                <span className={styles.exLetter}>a</span>
                <span className={styles.instruction}>
                  Complete the conversation with phrases from the Useful phrases box.
                </span>
              </div>

              <div className={styles.dialogueBox}>
                <div className={styles.line}>
                  <span className={styles.speaker}>Rosa:</span>
                  <span>Excuse me.</span>
                  <span className={styles.gapIndex}>1</span>
                  {(() => {
                    const vRes = isReview && ex3aDialogueKeys ? verifyAnswer(ex3aDialogue['1'], ex3aDialogueKeys['1']) : null;
                    return (
                      <>
                        <input
                          type="text"
                          value={ex3aDialogue['1'] || ''}
                          onChange={(e) => onEx3aDialogueChange?.('1', e.target.value)}
                          disabled={readOnly}
                          placeholder="..."
                          className={`${styles.dialogueInput} ${
                            vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                          }`}
                        />
                        {vRes && <TeacherAnswerBadge result={vRes} />}
                      </>
                    );
                  })()}
                  <span>that chair?</span>
                </div>

                <div className={styles.line}>
                  <span className={styles.speaker}>Assistant:</span>
                  <span className={styles.gapIndex}>2</span>
                  {(() => {
                    const vRes = isReview && ex3aDialogueKeys ? verifyAnswer(ex3aDialogue['2'], ex3aDialogueKeys['2']) : null;
                    return (
                      <>
                        <input
                          type="text"
                          value={ex3aDialogue['2'] || ''}
                          onChange={(e) => onEx3aDialogueChange?.('2', e.target.value)}
                          disabled={readOnly}
                          placeholder="..."
                          className={`${styles.dialogueInput} ${
                            vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                          }`}
                        />
                        {vRes && <TeacherAnswerBadge result={vRes} />}
                      </>
                    );
                  })()}
                  <span>£45.</span>
                </div>

                <div className={styles.line}>
                  <span className={styles.speaker}>Rosa:</span>
                  <span>And</span>
                  <span className={styles.gapIndex}>3</span>
                  {(() => {
                    const vRes = isReview && ex3aDialogueKeys ? verifyAnswer(ex3aDialogue['3'], ex3aDialogueKeys['3']) : null;
                    return (
                      <>
                        <input
                          type="text"
                          value={ex3aDialogue['3'] || ''}
                          onChange={(e) => onEx3aDialogueChange?.('3', e.target.value)}
                          disabled={readOnly}
                          placeholder="..."
                          className={`${styles.dialogueInput} ${
                            vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                          }`}
                        />
                        {vRes && <TeacherAnswerBadge result={vRes} />}
                      </>
                    );
                  })()}
                  <span>this box?</span>
                </div>

                <div className={styles.line}>
                  <span className={styles.speaker}>Assistant:</span>
                  <span>That&apos;s £14.</span>
                </div>

                <div className={styles.line}>
                  <span className={styles.speaker}>Rosa:</span>
                  <span>OK.</span>
                  <span className={styles.gapIndex}>4</span>
                  {(() => {
                    const vRes = isReview && ex3aDialogueKeys ? verifyAnswer(ex3aDialogue['4'], ex3aDialogueKeys['4']) : null;
                    return (
                      <>
                        <input
                          type="text"
                          value={ex3aDialogue['4'] || ''}
                          onChange={(e) => onEx3aDialogueChange?.('4', e.target.value)}
                          disabled={readOnly}
                          placeholder="..."
                          className={`${styles.dialogueInput} ${
                            vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                          }`}
                        />
                        {vRes && <TeacherAnswerBadge result={vRes} />}
                      </>
                    );
                  })()}
                  <span>these cups?</span>
                </div>

                <div className={styles.line}>
                  <span className={styles.speaker}>Assistant:</span>
                  <span>They&apos;re £2.</span>
                </div>

                <div className={styles.line}>
                  <span className={styles.speaker}>Rosa:</span>
                  <span>OK. Three cups, please.</span>
                </div>

                <div className={styles.line}>
                  <span className={styles.speaker}>Assistant:</span>
                  <span className={styles.gapIndex}>5</span>
                  {(() => {
                    const vRes = isReview && ex3aDialogueKeys ? verifyAnswer(ex3aDialogue['5'], ex3aDialogueKeys['5']) : null;
                    return (
                      <>
                        <input
                          type="text"
                          value={ex3aDialogue['5'] || ''}
                          onChange={(e) => onEx3aDialogueChange?.('5', e.target.value)}
                          disabled={readOnly}
                          placeholder="..."
                          className={`${styles.dialogueInput} ${
                            vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                          }`}
                        />
                        {vRes && <TeacherAnswerBadge result={vRes} />}
                      </>
                    );
                  })()}
                  <span>£6, please.</span>
                  <span className={styles.gapIndex}>6</span>
                  {(() => {
                    const vRes = isReview && ex3aDialogueKeys ? verifyAnswer(ex3aDialogue['6'], ex3aDialogueKeys['6']) : null;
                    return (
                      <>
                        <input
                          type="text"
                          value={ex3aDialogue['6'] || ''}
                          onChange={(e) => onEx3aDialogueChange?.('6', e.target.value)}
                          disabled={readOnly}
                          placeholder="..."
                          className={`${styles.dialogueInput} ${
                            vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                          }`}
                        />
                        {vRes && <TeacherAnswerBadge result={vRes} />}
                      </>
                    );
                  })()}
                  <span>?</span>
                </div>

                <div className={styles.line}>
                  <span className={styles.speaker}>Rosa:</span>
                  <span>Card, please.</span>
                  <span className={styles.gapIndex}>7</span>
                  {(() => {
                    const vRes = isReview && ex3aDialogueKeys ? verifyAnswer(ex3aDialogue['7'], ex3aDialogueKeys['7']) : null;
                    return (
                      <>
                        <input
                          type="text"
                          value={ex3aDialogue['7'] || ''}
                          onChange={(e) => onEx3aDialogueChange?.('7', e.target.value)}
                          disabled={readOnly}
                          placeholder="..."
                          className={`${styles.dialogueInput} ${
                            vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                          }`}
                        />
                        {vRes && <TeacherAnswerBadge result={vRes} />}
                      </>
                    );
                  })()}
                  <span>.</span>
                </div>

                <div className={styles.line}>
                  <span className={styles.speaker}>Assistant:</span>
                  <span>Thank you.</span>
                  <span className={styles.gapIndex}>8</span>
                  {(() => {
                    const vRes = isReview && ex3aDialogueKeys ? verifyAnswer(ex3aDialogue['8'], ex3aDialogueKeys['8']) : null;
                    return (
                      <>
                        <input
                          type="text"
                          value={ex3aDialogue['8'] || ''}
                          onChange={(e) => onEx3aDialogueChange?.('8', e.target.value)}
                          disabled={readOnly}
                          placeholder="..."
                          className={`${styles.dialogueInput} ${
                            vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                          }`}
                        />
                        {vRes && <TeacherAnswerBadge result={vRes} />}
                      </>
                    );
                  })()}
                  <span>.</span>
                </div>

                <div className={styles.line}>
                  <span className={styles.speaker}>Rosa:</span>
                  <span>Thank you.</span>
                </div>
              </div>
            </div>

            {/* Ex 3b */}
            <div>
              <div className={styles.subPrompt}>
                <span className={styles.exLetter}>b</span>
                <span>Work in pairs and practise the conversation.</span>
              </div>
            </div>

            {/* Ex 4a & 4b Roleplay */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>4</span>
                <span className={styles.exLetter}>a</span>
                <span className={styles.instruction}>Work in pairs. Roleplay conversations in a shop.</span>
              </div>
              <div className={styles.practiceBox}>
                <div>
                  <strong>Student A:</strong> You are the customer. Ask about the objects in Exercise 1.
                </div>
                <div>
                  <strong>Student B:</strong> You are the shop assistant. Answer the customer&apos;s questions.
                </div>
                <div className={styles.modelDialogue}>
                  <div><strong>A:</strong> Excuse me. How much is the ...?</div>
                  <div><strong>B:</strong> It&apos;s ...</div>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem' }}>
                <div className={styles.subPrompt}>
                  <span className={styles.exLetter}>b</span>
                  <span>Swap roles and repeat. Write your notes or conversation below:</span>
                </div>
                <textarea
                  value={ex4Notes}
                  onChange={(e) => onEx4NotesChange?.(e.target.value)}
                  disabled={readOnly}
                  placeholder="Notes from your conversation (e.g. A: How much is the red phone? B: It's £52.)..."
                  rows={3}
                  style={{
                    width: '100%',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '8px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Video badge */}
            <div className={styles.videoBadge}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
              <span>Go online for the Roadmap video.</span>
            </div>
          </div>
        </div>

        {/* Page 20 badge */}
        <div className={`${styles.pageNumberBadge} ${styles.left}`}>
          <svg width="34" height="34" viewBox="0 0 34 34">
            <circle cx="17" cy="17" r="15" fill="#d32027" />
            <text x="17" y="22" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
              20
            </text>
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ===================== PAGE 21: CHECK AND REFLECT ======================== */}
      {/* ========================================================================= */}
      <div className={styles.textbookPage21}>
        <div className={styles.header21}>
          <h1>Check and reflect</h1>
        </div>

        <div className={styles.grid21}>
          {/* ================= LEFT COLUMN ================= */}
          <div className={styles.column}>
            {/* Ex 1: Family */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>1</span>
                <span className={styles.instruction}>
                  Complete the sentences with the correct family word.
                </span>
              </div>
              <div className={styles.itemsList}>
                {EX1_FAMILY_ITEMS.map((item) => {
                  const vRes = isReview && ex1FamilyKeys ? verifyAnswer(ex1Family[item.id], ex1FamilyKeys[item.id]) : null;
                  return (
                    <div key={item.id} className={styles.itemRow}>
                      <span className={styles.itemIndex}>{item.id}</span>
                      <span>{item.text}</span>
                      {item.isExample ? (
                        <span className={styles.exampleBlue}>{item.answer}.</span>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={ex1Family[item.id] || ''}
                            onChange={(e) => onEx1FamilyChange?.(item.id, e.target.value)}
                            disabled={readOnly}
                            placeholder={item.placeholder}
                            className={`${styles.underlinedInput} ${
                              vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                            }`}
                          />
                          <span>.</span>
                          {vRes && <TeacherAnswerBadge result={vRes} />}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ex 2: Possessive 's */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>2</span>
                <span className={styles.instruction}>Correct the phrases. Use the possessive &apos;s.</span>
              </div>
              <div className={styles.itemsList}>
                {EX2_POSSESSIVE_ITEMS.map((item) => {
                  const vRes = isReview && ex2PossessiveKeys ? verifyAnswer(ex2Possessive[item.id], ex2PossessiveKeys[item.id]) : null;
                  return (
                    <div key={item.id} className={styles.itemRow}>
                      <span className={styles.itemIndex}>{item.id}</span>
                      <span>{item.prompt}</span>
                      <span>→</span>
                      {item.isExample ? (
                        <span className={styles.exampleBlue}>{item.answer}</span>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={ex2Possessive[item.id] || ''}
                            onChange={(e) => onEx2PossessiveChange?.(item.id, e.target.value)}
                            disabled={readOnly}
                            placeholder={item.placeholder}
                            className={`${styles.underlinedInput} ${
                              vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                            }`}
                            style={{ minWidth: '150px' }}
                          />
                          {vRes && <TeacherAnswerBadge result={vRes} />}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ex 3: Choose correct alternatives */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>3</span>
                <span className={styles.instruction}>Choose the correct alternatives.</span>
              </div>
              <div className={styles.itemsList}>
                {EX3_ALTERNATIVES_ITEMS.map((item) => {
                  const vResA = isReview && ex3AlternativesKeys ? verifyAnswer(ex3Alternatives[item.id], ex3AlternativesKeys[item.id]) : null;
                  const vResB = isReview && ex3AlternativesKeys ? verifyAnswer(ex3Alternatives[`${item.id}_b`], ex3AlternativesKeys[`${item.id}_b`]) : null;
                  return (
                    <div key={item.id} className={styles.itemRow}>
                      <span className={styles.itemIndex}>{item.id}</span>
                      <span>{item.before}</span>
                      <span className={styles.choicePills}>
                        <button
                          type="button"
                          className={`${styles.choiceBtn} ${
                            ex3Alternatives[item.id] === item.opt1 ? styles.choiceSelected : ''
                          } ${
                            vResA?.hasKey
                              ? (ex3Alternatives[item.id] === item.opt1
                                  ? (vResA.isCorrect ? styles.choiceValid : styles.choiceInvalid)
                                  : '')
                              : ''
                          }`}
                          onClick={() => !readOnly && onEx3AlternativesChange?.(item.id, item.opt1)}
                          disabled={readOnly}
                        >
                          {item.opt1}
                        </button>
                        <span>/</span>
                        <button
                          type="button"
                          className={`${styles.choiceBtn} ${
                            ex3Alternatives[item.id] === item.opt2 ? styles.choiceSelected : ''
                          } ${
                            vResA?.hasKey
                              ? (ex3Alternatives[item.id] === item.opt2
                                  ? (vResA.isCorrect ? styles.choiceValid : styles.choiceInvalid)
                                  : '')
                              : ''
                          }`}
                          onClick={() => !readOnly && onEx3AlternativesChange?.(item.id, item.opt2)}
                          disabled={readOnly}
                        >
                          {item.opt2}
                        </button>
                      </span>
                      {vResA && <TeacherAnswerBadge result={vResA} />}
                      {item.mid && <span>{item.mid}</span>}
                      {item.opt3 && item.opt4 && (
                        <>
                          <span className={styles.choicePills}>
                            <button
                              type="button"
                              className={`${styles.choiceBtn} ${
                                ex3Alternatives[`${item.id}_b`] === item.opt3 ? styles.choiceSelected : ''
                              } ${
                                vResB?.hasKey
                                  ? (ex3Alternatives[`${item.id}_b`] === item.opt3
                                      ? (vResB.isCorrect ? styles.choiceValid : styles.choiceInvalid)
                                      : '')
                                  : ''
                              }`}
                              onClick={() => !readOnly && onEx3AlternativesChange?.(`${item.id}_b`, item.opt3)}
                              disabled={readOnly}
                            >
                              {item.opt3}
                            </button>
                            <span>/</span>
                            <button
                              type="button"
                              className={`${styles.choiceBtn} ${
                                ex3Alternatives[`${item.id}_b`] === item.opt4 ? styles.choiceSelected : ''
                              } ${
                                vResB?.hasKey
                                  ? (ex3Alternatives[`${item.id}_b`] === item.opt4
                                      ? (vResB.isCorrect ? styles.choiceValid : styles.choiceInvalid)
                                      : '')
                                  : ''
                              }`}
                              onClick={() => !readOnly && onEx3AlternativesChange?.(`${item.id}_b`, item.opt4)}
                              disabled={readOnly}
                            >
                              {item.opt4}
                            </button>
                          </span>
                          {vResB && <TeacherAnswerBadge result={vResB} />}
                        </>
                      )}
                      <span>{item.after}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ex 4: Correct mistakes */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>4</span>
                <span className={styles.instruction}>Correct the mistakes in the sentences.</span>
              </div>
              <div className={styles.itemsList}>
                {EX4_MISTAKES_ITEMS.map((item) => (
                  <div key={item.id} style={{ marginBottom: '0.4rem' }}>
                    <div className={styles.itemRow}>
                      <span className={styles.itemIndex}>{item.id}</span>
                      <span style={{ color: '#475569' }}>{item.wrong}</span>
                    </div>
                    <div style={{ paddingLeft: '18px', marginTop: '3px' }}>
                      <input
                        type="text"
                        value={ex4Mistakes[item.id] || ''}
                        onChange={(e) => onEx4MistakesChange?.(item.id, e.target.value)}
                        disabled={readOnly}
                        placeholder={item.placeholder}
                        className={styles.underlinedInput}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ex 5: Anagrams */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>5</span>
                <span className={styles.instruction}>
                  Put the letters in the correct order to make everyday objects.
                </span>
              </div>
              <div className={styles.anagramGrid}>
                {EX5_ANAGRAMS_ITEMS.map((item) => {
                  const vRes = isReview && ex5AnagramsKeys ? verifyAnswer(ex5Anagrams[item.id], ex5AnagramsKeys[item.id]) : null;
                  return (
                    <div key={item.id} className={styles.anagramRow}>
                      <span className={styles.anagramNum}>{item.id}</span>
                      <span className={styles.scrambled}>{item.scrambled}</span>
                      <span className={styles.firstLetter}>{item.first}</span>
                      {item.isExample ? (
                        <span className={styles.exampleBlue}>{item.answer}</span>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={ex5Anagrams[item.id] || ''}
                            onChange={(e) => onEx5AnagramsChange?.(item.id, e.target.value)}
                            disabled={readOnly}
                            placeholder={item.placeholder}
                            className={`${styles.underlinedInput} ${
                              vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                            }`}
                            style={{ minWidth: '70px' }}
                          />
                          {vRes && <TeacherAnswerBadge result={vRes} />}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className={styles.column}>
            {/* Ex 6: Demonstratives */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>6</span>
                <span className={styles.instruction}>Choose the correct alternatives.</span>
              </div>
              <div className={styles.itemsList}>
                {EX6_DEMONSTRATIVE_ITEMS.map((item) => {
                  const vRes = isReview && ex6DemonstrativesKeys ? verifyAnswer(ex6Demonstratives[item.id], ex6DemonstrativesKeys[item.id]) : null;
                  return (
                    <div key={item.id} className={styles.itemRow}>
                      <span className={styles.itemIndex}>{item.id}</span>
                      {item.promptBefore && <span>{item.promptBefore}</span>}
                      <span className={styles.choicePills}>
                        <button
                          type="button"
                          className={`${styles.choiceBtn} ${
                            ex6Demonstratives[item.id] === item.opt1 ? styles.choiceSelected : ''
                          } ${
                            vRes?.hasKey
                              ? (ex6Demonstratives[item.id] === item.opt1
                                  ? (vRes.isCorrect ? styles.choiceValid : styles.choiceInvalid)
                                  : '')
                              : ''
                          }`}
                          onClick={() => !readOnly && onEx6DemonstrativesChange?.(item.id, item.opt1)}
                          disabled={readOnly}
                        >
                          {item.opt1}
                        </button>
                        <span>/</span>
                        <button
                          type="button"
                          className={`${styles.choiceBtn} ${
                            ex6Demonstratives[item.id] === item.opt2 ? styles.choiceSelected : ''
                          } ${
                            vRes?.hasKey
                              ? (ex6Demonstratives[item.id] === item.opt2
                                  ? (vRes.isCorrect ? styles.choiceValid : styles.choiceInvalid)
                                  : '')
                              : ''
                          }`}
                          onClick={() => !readOnly && onEx6DemonstrativesChange?.(item.id, item.opt2)}
                          disabled={readOnly}
                        >
                          {item.opt2}
                        </button>
                      </span>
                      {vRes && <TeacherAnswerBadge result={vRes} />}
                      <span>{item.promptAfter}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ex 7a: Math words */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>7</span>
                <span className={styles.exLetter}>a</span>
                <span className={styles.instruction}>Work in pairs. Write and say the correct numbers.</span>
              </div>
              <div className={styles.mathGrid}>
                {EX7A_MATH_ITEMS.map((item) => {
                  const vRes = isReview && ex7aMathKeys ? verifyAnswer(ex7aMath[item.id], ex7aMathKeys[item.id]) : null;
                  return (
                    <div key={item.id} className={styles.mathRow}>
                      <span className={styles.mathNum}>{item.id}</span>
                      <span className={styles.equation}>{item.equation}</span>
                      {item.isExample ? (
                        <span className={styles.exampleBlue}>{item.answer}</span>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={ex7aMath[item.id] || ''}
                            onChange={(e) => onEx7aMathChange?.(item.id, e.target.value)}
                            disabled={readOnly}
                            placeholder={item.placeholder}
                            className={`${styles.underlinedInput} ${
                              vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                            }`}
                            style={{ minWidth: '95px' }}
                          />
                          {vRes && <TeacherAnswerBadge result={vRes} />}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ex 7b: Ages */}
            <div>
              <div className={styles.subPrompt}>
                <span className={styles.exLetter}>b</span>
                <span>Read the first sentence. Then complete the second sentence.</span>
              </div>
              <div className={styles.itemsList}>
                {EX7B_AGES_ITEMS.map((item) => {
                  const vRes = isReview && ex7bAgesKeys ? verifyAnswer(ex7bAges[item.id], ex7bAgesKeys[item.id]) : null;
                  return (
                    <div key={item.id} className={styles.itemRow}>
                      <span className={styles.itemIndex}>{item.id}</span>
                      <span>{item.first}</span>
                      <span>{item.secondStart}</span>
                      {item.isExample ? (
                        <span className={styles.exampleBlue}>{item.answer}{item.secondEnd}</span>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={ex7bAges[item.id] || ''}
                            onChange={(e) => onEx7bAgesChange?.(item.id, e.target.value)}
                            disabled={readOnly}
                            placeholder={item.placeholder}
                            className={`${styles.underlinedInput} ${
                              vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                            }`}
                            style={{ minWidth: '130px' }}
                          />
                          <span>{item.secondEnd}</span>
                          {vRes && <TeacherAnswerBadge result={vRes} />}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ex 8a: Word order */}
            <div>
              <div className={styles.exerciseHeader}>
                <span className={styles.exNumber}>8</span>
                <span className={styles.exLetter}>a</span>
                <span className={styles.instruction}>
                  Put the words in the correct order to make questions.
                </span>
              </div>
              <div className={styles.itemsList}>
                {EX8A_QUESTIONS_ITEMS.map((item) => {
                  const vRes = isReview && ex8aQuestionsKeys ? verifyAnswer(ex8aQuestions[item.id], ex8aQuestionsKeys[item.id]) : null;
                  return (
                    <div key={item.id} style={{ marginBottom: '0.45rem' }}>
                      <div className={styles.itemRow}>
                        <span className={styles.itemIndex}>{item.id}</span>
                        <span className={styles.scrambledWords}>{item.words}</span>
                      </div>
                      <div style={{ paddingLeft: '18px', marginTop: '2px' }}>
                        <input
                          type="text"
                          value={ex8aQuestions[item.id] || ''}
                          onChange={(e) => onEx8aQuestionsChange?.(item.id, e.target.value)}
                          disabled={readOnly}
                          placeholder={item.placeholder}
                          className={`${styles.underlinedInput} ${
                            vRes?.hasKey ? (vRes.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
                          }`}
                          style={{ width: '100%' }}
                        />
                        {vRes && <TeacherAnswerBadge result={vRes} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ex 8b */}
            <div>
              <div className={styles.subPrompt}>
                <span className={styles.exLetter}>b</span>
                <span>Work in pairs. Ask and answer the questions in Exercise 8a.</span>
              </div>
              <textarea
                value={ex8bPairNotes}
                onChange={(e) => onEx8bPairNotesChange?.(e.target.value)}
                disabled={readOnly}
                placeholder="Partner's answers and notes..."
                rows={2}
                style={{
                  width: 'calc(100% - 1.25rem)',
                  marginLeft: '1.25rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Reflect */}
            <div className={styles.reflectCard}>
              <h2>Reflect</h2>
              <p>
                How confident do you feel about the statements below? Write 1–5 (1 = not very confident, 5 = very confident).
              </p>
              <ul>
                {REFLECT_STATEMENTS.map((stmt) => (
                  <li key={stmt.id}>
                    <span>• {stmt.text}</span>
                    <select
                      value={reflectScores[stmt.id] || ''}
                      onChange={(e) => onReflectScoresChange?.(stmt.id, e.target.value)}
                      disabled={readOnly}
                      aria-label={`Confidence score for ${stmt.text}`}
                    >
                      <option value="">Score</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </li>
                ))}
              </ul>
            </div>

            {/* Workbook badge */}
            <div className={styles.workbookBadge}>
              <strong>Want more practice?</strong>
              <span>Go to your Workbook or app.</span>
            </div>
          </div>
        </div>

        {/* Page 21 badge */}
        <div className={`${styles.pageNumberBadge} ${styles.right}`}>
          <svg width="34" height="34" viewBox="0 0 34 34">
            <circle cx="17" cy="17" r="15" fill="#d32027" />
            <text x="17" y="22" fill="#ffffff" fontSize="13" fontWeight="800" textAnchor="middle">
              21
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
              alt="Shop illustration enlarged"
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
