'use client';

import React from 'react';
import Image from 'next/image';
import WordsearchGrid, { WordsearchTarget } from './WordsearchGrid/WordsearchGrid';
import { useLessonContext, LessonContextModel } from '@/context/LessonContext';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import AudioAnswerRecorder from './AudioAnswerRecorder/AudioAnswerRecorder';
import SubmissionAudioPlayer, {
  SubmissionAudioMeta,
} from './AudioAnswerRecorder/SubmissionAudioPlayer';
import {
  LessonAnswerKey,
  verifyAnswer,
  getExerciseKey,
  VerificationResult,
} from '@/lib/answerVerification';
import styles from './lesson8d.module.scss';

export interface Lesson8DContentProps {
  lesson?: LessonContextModel | null;
  user?: Record<string, unknown> | null;
  isTeacherReview?: boolean;
  readOnly?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio?: (track: string) => void;
  playingAudio?: string | null;
  originalAnswers?: Record<string, unknown>;
  audioBlob?: Blob | null;
  onAudioBlobChange?: (blob: Blob | null, mimeType: string, exerciseKey?: string) => void;
  submissionId?: string;
  submittedAudios?: SubmissionAudioMeta[];
}

export const FALLBACK_ANSWER_KEY_8D: LessonAnswerKey = {
  exercise_1b_conversations: {
    conv_1: ['A', 'a', 'Photo A', 'photo a'],
    conv_2: ['B', 'b', 'Photo B', 'photo b'],
  },
  exercise_1c_activities: {
    sara: ['stayed at home', 'stayed at home and watched TV', 'watched TV', 'stayed at home, watched TV'],
    mike: ['visited parents', 'had lunch with parents', 'had lunch with his parents'],
    erica: ['visited a friend', 'visited friend'],
    duncan: ['cleaned flat', 'cleaned his flat', 'cleaned his apartment'],
  },
  exercise_3a_conversations: {
    '1': ['Good morning', 'good morning', 'Hello', 'hello', 'Hi', 'hi'],
    '2': ['Not bad, thanks', 'not bad, thanks', 'Not bad, thank you', "I'm fine, thanks", 'Fine, thanks', 'Great, thanks'],
    '3': ['Goodbye', 'goodbye', 'Bye', 'bye', 'See you', 'see you', 'See you later', 'see you later'],
    '4': ['Hi', 'hi', 'Hello', 'hello'],
    '5': ["I'm fine, thanks", 'fine, thanks', "I'm OK, thanks", 'Good, thanks', 'Very well, thank you', 'Great, thanks'],
    '6': ['See you later', 'see you later', 'See you', 'see you', 'Bye', 'bye', 'Goodbye', 'goodbye'],
  },
  check_ex1a_verbs: {
    '1': ['live', 'Live'],
    '2': ['play', 'Play'],
    '3': ['talk', 'Talk'],
    '4': ['watch', 'Watch'],
    '5': ['travel', 'Travel'],
  },
  check_ex2_past_regular: {
    '2': ['travelled', 'traveled', 'Travelled', 'Traveled'],
    '3': ['cycled', 'Cycled'],
    '4': ['arrived', 'Arrived'],
    '5': ['started', 'Started'],
    '6': ['studied', 'Studied'],
    '7': ['played', 'Played'],
    '8': ['liked', 'Liked'],
    '9': ["didn't like", 'did not like', 'didnt like'],
    '10': ['finished', 'Finished'],
  },
  check_ex3_wordsearch: {
    ate: ['true'],
    broke: ['true'],
    felt: ['true'],
    forgot: ['true'],
    got_up: ['true'],
    had: ['true'],
    lost: ['true'],
    met: ['true'],
    ran: ['true'],
    spoke: ['true'],
    took: ['true'],
    went: ['true'],
  },
  check_ex4_sentences: {
    '1': ['forgot', 'Forgot'],
    '2': ['spoke', 'Spoke'],
    '3': ['bought', 'Bought'],
    '4': ['got up', 'Got up'],
    '5': ['met', 'Met'],
    '6': ['broke', 'Broke'],
  },
  check_ex5a_sentences: {
    '2': ['had', 'Had'],
    '3': ['made', 'Made'],
    '4': ['ate', 'Ate'],
    '5': ['drank', 'Drank'],
    '6': ['bought', 'Bought'],
    '7': ['read', 'Read'],
    '8': ['took', 'Took'],
  },
  check_ex6_infinitives: {
    '1': ['swim', 'Swim'],
    '2': ['visit', 'Visit'],
    '3': ['go', 'Go'],
    '4': ['have', 'Have'],
    '5': ['stay', 'Stay'],
  },
  check_ex7a_questions: {
    '2': ['Did you have', 'did you have'],
    '3': ['did you travel', 'did you get', 'did you go'],
    '4': ['Did you watch', 'did you watch'],
    '5': ['Did you speak', 'did you speak', 'Did you talk', 'did you talk'],
    '6': ['did you have', 'did you eat'],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const WORDSEARCH_GRID = [
  ['X', 'F', 'A', 'T', 'E', 'K', 'R', 'A', 'N', 'M'],
  ['Q', 'O', 'S', 'H', 'K', 'S', 'P', 'O', 'K', 'E'],
  ['R', 'R', 'W', 'K', 'W', 'L', 'J', 'G', 'J', 'T'],
  ['B', 'G', 'P', 'G', 'E', 'I', 'T', 'O', 'O', 'K'],
  ['R', 'O', 'J', 'O', 'N', 'H', 'K', 'K', 'L', 'F'],
  ['O', 'T', 'N', 'T', 'T', 'A', 'O', 'B', 'O', 'E'],
  ['K', 'L', 'M', 'U', 'H', 'D', 'D', 'F', 'S', 'L'],
  ['E', 'O', 'U', 'P', 'H', 'T', 'E', 'K', 'T', 'T'],
];

const WORDSEARCH_TARGETS: WordsearchTarget[] = [
  { key: 'ate', label: 'ate', cells: [[0, 2], [0, 3], [0, 4]] },
  { key: 'broke', label: 'broke', cells: [[3, 0], [4, 0], [5, 0], [6, 0], [7, 0]] },
  { key: 'felt', label: 'felt', cells: [[4, 9], [5, 9], [6, 9], [7, 9]] },
  { key: 'forgot', label: 'forgot', cells: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]] },
  { key: 'got_up', label: 'got up', cells: [[3, 3], [4, 3], [5, 3], [6, 3], [7, 3]] },
  { key: 'had', label: 'had', cells: [[4, 5], [5, 5], [6, 5]] },
  { key: 'lost', label: 'lost', cells: [[4, 8], [5, 8], [6, 8], [7, 8]] },
  { key: 'met', label: 'met', cells: [[0, 9], [1, 9], [2, 9]] },
  { key: 'ran', label: 'ran', cells: [[0, 6], [0, 7], [0, 8]] },
  { key: 'spoke', label: 'spoke', cells: [[1, 5], [1, 6], [1, 7], [1, 8], [1, 9]] },
  { key: 'took', label: 'took', cells: [[3, 6], [3, 7], [3, 8], [3, 9]] },
  { key: 'went', label: 'went', cells: [[2, 4], [3, 4], [4, 4], [5, 4]] },
];

export default function Lesson8DContent(props: Lesson8DContentProps) {
  const context = useLessonContext();
  const {
    isTeacherReview = false,
    readOnly = false,
    answerKey: propAnswerKey,
    originalAnswers: propOriginalAnswers,
    submissionId,
    submittedAudios = [],
    onAudioBlobChange,
  } = props;

  const playAudio = props.playAudio ?? context?.playAudio;
  const playingAudio = props.playingAudio ?? context?.playingAudio;
  const activeAnswerKey =
    propAnswerKey ||
    (context?.answerKey as LessonAnswerKey) ||
    (context?.lesson?.answerKey as LessonAnswerKey) ||
    FALLBACK_ANSWER_KEY_8D;

  const isReview = Boolean(isTeacherReview || (activeAnswerKey && readOnly));
  const answers = (context?.answers || {}) as Record<string, unknown>;

  const handleFieldChange = (exerciseName: string, field: string, val: string) => {
    if (readOnly) return;
    if (context?.setAnswerField) {
      context.setAnswerField(exerciseName, field, val);
    }
  };

  const verify = (exerciseName: string, field: string, value: string): VerificationResult | null => {
    if (!isReview) return null;
    const exKey = getExerciseKey(activeAnswerKey, exerciseName);
    return verifyAnswer(value, exKey?.[field]);
  };

  const isDiff = (exerciseName: string, field: string): boolean => {
    if (!propOriginalAnswers || !context?.answers) return false;
    const origEx = getRecord(propOriginalAnswers[exerciseName]);
    const currEx = getRecord(context.answers[exerciseName]);
    return origEx[field] !== undefined && origEx[field] !== currEx[field];
  };

  const renderInput = (
    exerciseName: string,
    field: string,
    placeholder: string,
    options?: { fullWidth?: boolean; customClass?: string }
  ) => {
    const currAnswers = getRecord(answers[exerciseName]);
    const currentVal = currAnswers[field] || '';
    const v = verify(exerciseName, field, currentVal);
    const diff = isDiff(exerciseName, field);

    return (
      <div className={options?.fullWidth ? styles.inputWrapperFull : styles.inputWrapper}>
        <div className={styles.inputRow}>
          <input
            type="text"
            value={currentVal}
            onChange={(e) => handleFieldChange(exerciseName, field, e.target.value)}
            placeholder={placeholder}
            disabled={readOnly}
            className={`${styles.textInput} ${
              v ? (v.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
            } ${diff ? styles.diffHighlight : ''} ${options?.customClass || ''}`}
          />
          {v?.isCorrect && <span className={styles.correctBadge}>✓</span>}
        </div>
        {v && !v.isCorrect && (
          <div className={styles.feedbackRow}>
            <TeacherAnswerBadge result={v} />
          </div>
        )}
      </div>
    );
  };

  const renderSelect = (
    exerciseName: string,
    field: string,
    optionsList: { value: string; label: string }[],
    options?: { customClass?: string }
  ) => {
    const currAnswers = getRecord(answers[exerciseName]);
    const currentVal = currAnswers[field] || '';
    const v = verify(exerciseName, field, currentVal);
    const diff = isDiff(exerciseName, field);

    return (
      <div className={styles.inputWrapper}>
        <div className={styles.inputRow}>
          <select
            value={currentVal}
            onChange={(e) => handleFieldChange(exerciseName, field, e.target.value)}
            disabled={readOnly}
            className={`${styles.selectInput} ${
              v ? (v.isCorrect ? styles.inputValid : styles.inputInvalid) : ''
            } ${diff ? styles.diffHighlight : ''} ${options?.customClass || ''}`}
          >
            <option value="">-- Choose --</option>
            {optionsList.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {v?.isCorrect && <span className={styles.correctBadge}>✓</span>}
        </div>
        {v && !v.isCorrect && (
          <div className={styles.feedbackRow}>
            <TeacherAnswerBadge result={v} />
          </div>
        )}
      </div>
    );
  };

  const renderTickBox = (
    exerciseName: string,
    field: string,
    label: string
  ) => {
    const currAnswers = getRecord(answers[exerciseName]);
    const isChecked = currAnswers[field] === 'true';

    const toggle = () => {
      if (readOnly) return;
      handleFieldChange(exerciseName, field, isChecked ? 'false' : 'true');
    };

    let tickClass = styles.tickBox;
    if (isChecked) {
      tickClass += ` ${styles.tickBoxChecked}`;
    }

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={isChecked}
        aria-label={label}
        onClick={toggle}
        disabled={readOnly}
        className={tickClass}
      >
        {isChecked ? '✓' : ''}
      </button>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Banner Header 8D */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge8D}>
              <span>8</span>
              <span className={styles.letterD}>D</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>English in action</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: greet people</span>
                <span className={styles.pillGoal}>Speaking: weekend catch-up</span>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.pageBody}>
          {/* ============================================================== */}
          {/* SECTION 1: PHOTOS & CONVERSATIONS                              */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Greetings</span>
              <h2 className={styles.sectionTitle}>Conversations in Daily Life</h2>
            </div>

            {/* Exercise 1a: Photos Gallery */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Look at the photos. Where are the people? How do you think they know each other?
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Example: friends, colleagues, university students, etc.
                  </p>
                </div>
              </div>

              <div className={styles.photosGrid}>
                {/* Photo A */}
                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8d/photo_a_station.png"
                      alt="Photo A: Colleagues walking and talking on a train station platform"
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo A</span>
                    <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>Train station platform: business colleagues</span>
                  </div>
                </div>

                {/* Photo B */}
                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8d/photo_b_friends.png"
                      alt="Photo B: Young friends holding coffee cups outside college"
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo B</span>
                    <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>Outside university building: friends having coffee</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 1b: Audio 8.15 Matching */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1b</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>
                      Listen and match conversations 1 and 2 with photos A and B.
                    </h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '8.15' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('8.15')}
                      aria-label="Play Audio 8.15"
                    >
                      {playingAudio === '8.15' ? '⏸ Playing 8.15' : '▶ Audio 8.15'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Listen to Audio 8.15 and match each conversation to its photo:
                  </p>
                </div>
              </div>

              <div className={styles.sentenceList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>Conversation 1:</span>
                  {renderSelect('exercise_1b_conversations', 'conv_1', [
                    { value: 'A', label: 'Photo A (station platform)' },
                    { value: 'B', label: 'Photo B (outside building)' },
                  ])}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>Conversation 2:</span>
                  {renderSelect('exercise_1b_conversations', 'conv_2', [
                    { value: 'A', label: 'Photo A (station platform)' },
                    { value: 'B', label: 'Photo B (outside building)' },
                  ])}
                </div>
              </div>
            </div>

            {/* Exercise 1c: Weekend activities */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1c</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Listen again. What did the people do at the weekend?
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Write a brief summary of what each person did:
                  </p>
                </div>
              </div>

              <div className={styles.sentenceList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>1. Sara:</span>
                  {renderInput('exercise_1c_activities', 'sara', 'Sara did...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>Mike:</span>
                  {renderInput('exercise_1c_activities', 'mike', 'Mike did...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>2. Erica:</span>
                  {renderInput('exercise_1c_activities', 'erica', 'Erica did...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>Duncan:</span>
                  {renderInput('exercise_1c_activities', 'duncan', 'Duncan did...', { fullWidth: true })}
                </div>
              </div>
            </div>

            {/* Useful Phrases Box & Exercise 2a, 2b */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Useful phrases: Greet people</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '8.16' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('8.16')}
                      aria-label="Play Audio 8.16"
                    >
                      {playingAudio === '8.16' ? '⏸ Playing 8.16' : '▶ Audio 8.16'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Listen to Audio 8.16 and repeat. Notice the intonation in natural greetings.
                  </p>
                </div>
              </div>

              <div className={styles.usefulPhrasesGrid}>
                <div className={styles.usefulCategory}>
                  <h4>Starting a conversation</h4>
                  <ul>
                    <li>Hello / Hi, (Mike).</li>
                    <li>Good morning / afternoon / evening, (Erica).</li>
                  </ul>
                </div>

                <div className={styles.usefulCategory}>
                  <h4>Questions for greetings</h4>
                  <ul>
                    <li>How are you?</li>
                    <li>How are things?</li>
                    <li>Are you OK?</li>
                  </ul>
                </div>

                <div className={styles.usefulCategory}>
                  <h4>Answers for greetings</h4>
                  <ul>
                    <li>(I&apos;m) OK, thank you. (And you?)</li>
                    <li>(I&apos;m) not bad, thanks. (And you?)</li>
                    <li>(I&apos;m) great, thanks. (And you?)</li>
                    <li>(I&apos;m) very well, thank you. (And you?)</li>
                    <li>(I&apos;m) fine, thanks. (And you?)</li>
                    <li>(I&apos;m) good, thank you. (And you?)</li>
                  </ul>
                </div>

                <div className={styles.usefulCategory}>
                  <h4>Ending a conversation</h4>
                  <ul>
                    <li>Goodbye / Bye.</li>
                    <li>See you / See you later.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Exercise 3a: Complete conversations */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>3a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Complete the conversations with phrases from the Useful phrases box.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Fill in the missing greeting phrases in each conversation:
                  </p>
                </div>
              </div>

              {/* Conversation 1 */}
              <div className={styles.dialogueBox}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#be123c', fontSize: '0.95rem' }}>Conversation 1</h4>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Simon:</span>
                  <span>Good morning, Magda.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Magda:</span>
                  <span>1.</span>
                  {renderInput('exercise_3a_conversations', '1', 'Greeting phrase...')}
                  <span>, Simon.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Simon:</span>
                  <span>How are things?</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Magda:</span>
                  <span>2.</span>
                  {renderInput('exercise_3a_conversations', '2', 'Answer greeting...')}
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Simon:</span>
                  <span>I&apos;m great, thank you. Did you have a good weekend?</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Magda:</span>
                  <span>Yes, thanks. I had lunch with my parents on Saturday. How about you?</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Simon:</span>
                  <span>I stayed at home all weekend and watched TV.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Magda:</span>
                  <span>Sounds good!</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Simon:</span>
                  <span>Yeah, it was. Well, bye, Magda.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Magda:</span>
                  <span>3.</span>
                  {renderInput('exercise_3a_conversations', '3', 'Farewell phrase...')}
                  <span>.</span>
                </div>
              </div>

              {/* Conversation 2 */}
              <div className={styles.dialogueBox} style={{ marginTop: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#be123c', fontSize: '0.95rem' }}>Conversation 2</h4>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Cassie:</span>
                  <span>Hi, Jun.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Jun:</span>
                  <span>4.</span>
                  {renderInput('exercise_3a_conversations', '4', 'Greeting phrase...')}
                  <span>, Cassie.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Cassie:</span>
                  <span>How are you?</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Jun:</span>
                  <span>5.</span>
                  {renderInput('exercise_3a_conversations', '5', 'Answer greeting...')}
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Cassie:</span>
                  <span>Good, thanks. How was your weekend?</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Jun:</span>
                  <span>It was OK. I cleaned my flat. How about you?</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Cassie:</span>
                  <span>I visited a friend.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Jun:</span>
                  <span>Sounds good!</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Cassie:</span>
                  <span>It was! OK, see you later.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Jun:</span>
                  <span>6.</span>
                  {renderInput('exercise_3a_conversations', '6', 'Farewell phrase...')}
                  <span>.</span>
                </div>
              </div>
            </div>

            {/* Exercise 4: Roleplay with AudioAnswerRecorder */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>4</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Practise greeting classmates and ask about their weekend.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Example: <em>Hello, Haruka. How are you?</em> Record your greeting and weekend dialogue with AudioAnswerRecorder:
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem' }}>
                {submissionId && (
                  <div className={styles.feedbackRow} style={{ marginBottom: '0.75rem' }}>
                    <SubmissionAudioPlayer
                      submissionId={submissionId}
                      exerciseKey="speaking_8d_greeting"
                      audios={submittedAudios}
                    />
                  </div>
                )}
                <AudioAnswerRecorder
                  onAudioChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'speaking_8d_greeting')}
                  readOnly={readOnly}
                />
              </div>
            </div>

            {/* Banner: Roadmap Video */}
            <div className={styles.bottomBanner}>
              <div className={styles.bannerImageWrapper}>
                <Image
                  src="/images/lesson8d/banner_roadmap_video.png"
                  alt="Go online for the Roadmap video"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 2: CHECK AND REFLECT (UNIT 8 REVIEW)                    */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Review</span>
              <h2 className={styles.sectionTitle}>Check and Reflect</h2>
            </div>

            {/* Check Ex 1a & 1b: Verb Collocations */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    1a. Complete the sentences with the correct verbs. 1b. Tick (✓) the ones true for you.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Fill in the missing verb in each sentence (live, play, talk, watch, travel) and tick if it is true for you:
                  </p>
                </div>
              </div>

              <div className={styles.sentenceList}>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex1b_true', '1', 'Sentence 1 true for you')}
                  <span className={styles.itemLabel}>1.</span>
                  <span>I</span>
                  {renderInput('check_ex1a_verbs', '1', 'verb...')}
                  <span>in a village / in a town / in a city.</span>
                </div>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex1b_true', '2', 'Sentence 2 true for you')}
                  <span className={styles.itemLabel}>2.</span>
                  <span>I</span>
                  {renderInput('check_ex1a_verbs', '2', 'verb...')}
                  <span>tennis / video games with friends / football.</span>
                </div>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex1b_true', '3', 'Sentence 3 true for you')}
                  <span className={styles.itemLabel}>3.</span>
                  <span>I</span>
                  {renderInput('check_ex1a_verbs', '3', 'verb...')}
                  <span>to my parents every day / to my neighbour about the weather / my friends every week.</span>
                </div>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex1b_true', '4', 'Sentence 4 true for you')}
                  <span className={styles.itemLabel}>4.</span>
                  <span>I</span>
                  {renderInput('check_ex1a_verbs', '4', 'verb...')}
                  <span>a film once or twice a week / TV every day.</span>
                </div>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex1b_true', '5', 'Sentence 5 true for you')}
                  <span className={styles.itemLabel}>5.</span>
                  <span>I</span>
                  {renderInput('check_ex1a_verbs', '5', 'verb...')}
                  <span>to work / by bus / to my parents&apos; house every weekend.</span>
                </div>
              </div>
            </div>

            {/* Check Ex 2: Past Simple Regular Verbs in Text */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Complete the text with the past simple form of the verbs in brackets.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Read the text about school days and write the past simple forms:
                  </p>
                </div>
              </div>

              <div className={styles.storyBox}>
                <div className={styles.storyText}>
                  My school was near my house. I 1 <strong>walked</strong> (walk) to school but my friends 2{' '}
                  {renderInput('check_ex2_past_regular', '2', 'verb-ed...')} (travel) by bus. One or two children 3{' '}
                  {renderInput('check_ex2_past_regular', '3', 'verb-ed...')} (cycle) to school. I usually 4{' '}
                  {renderInput('check_ex2_past_regular', '4', 'verb-ed...')} (arrive) at 8.45 and lessons 5{' '}
                  {renderInput('check_ex2_past_regular', '5', 'verb-ed...')} (start) at 9 o&apos;clock. We 6{' '}
                  {renderInput('check_ex2_past_regular', '6', 'verb-ed...')} (study) all day and 7{' '}
                  {renderInput('check_ex2_past_regular', '7', 'verb-ed...')} (play) sports on Wednesday afternoon. I 8{' '}
                  {renderInput('check_ex2_past_regular', '8', 'verb-ed...')} (like) my lessons but I 9{' '}
                  {renderInput('check_ex2_past_regular', '9', 'negative form...')} (not like) the sports. Lessons 10{' '}
                  {renderInput('check_ex2_past_regular', '10', 'verb-ed...')} (finish) at 3.45.
                </div>
              </div>
            </div>

            {/* Check Ex 3: Wordsearch Puzzle 10x8 */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>3</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Find the twelve irregular verbs in the wordsearch.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Find all 12 irregular verbs: <em>ate, broke, felt, forgot, got up, had, lost, met, ran, spoke, took, went</em>. Click letters in the grid to select each word, or click words to mark them as found:
                  </p>
                </div>
              </div>

              <WordsearchGrid
                grid={WORDSEARCH_GRID}
                targets={WORDSEARCH_TARGETS}
                foundMap={getRecord(answers.check_ex3_wordsearch)}
                onToggleWord={(key, nextFound) =>
                  handleFieldChange('check_ex3_wordsearch', key, nextFound ? 'true' : 'false')
                }
                readOnly={readOnly}
                victoryMessage="🎉 Excellent! All 12 irregular verbs found!"
              />
            </div>

            {/* Check Ex 4: Complete sentences with verbs in box */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>4</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Complete the sentences with the verbs in the box.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Verbs: <strong>broke, bought, forgot, got up, met, spoke</strong>
                  </p>
                </div>
              </div>

              <div className={styles.wordBox}>
                <span className={styles.wordChip}>broke</span>
                <span className={styles.wordChip}>bought</span>
                <span className={styles.wordChip}>forgot</span>
                <span className={styles.wordChip}>got up</span>
                <span className={styles.wordChip}>met</span>
                <span className={styles.wordChip}>spoke</span>
              </div>

              <div className={styles.sentenceList} style={{ marginTop: '0.75rem' }}>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>1.</span>
                  <span>Yesterday, I</span>
                  {renderInput('check_ex4_sentences', '1', 'verb...')}
                  <span>my sandwiches. I wasn&apos;t happy!</span>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>2.</span>
                  <span>I</span>
                  {renderInput('check_ex4_sentences', '2', 'verb...')}
                  <span>to my parents on the phone last night.</span>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>3.</span>
                  <span>They</span>
                  {renderInput('check_ex4_sentences', '3', 'verb...')}
                  <span>a big house in the mountains.</span>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>4.</span>
                  <span>He</span>
                  {renderInput('check_ex4_sentences', '4', 'verb...')}
                  <span>at 11.00 a.m. today!</span>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>5.</span>
                  <span>My wife and I</span>
                  {renderInput('check_ex4_sentences', '5', 'verb...')}
                  <span>at university.</span>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>6.</span>
                  <span>She</span>
                  {renderInput('check_ex4_sentences', '6', 'verb...')}
                  <span>another cup last night.</span>
                </div>
              </div>
            </div>

            {/* Check Ex 5a & 5b: This morning... */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>5</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    5a. Complete with past simple form. 5b. Tick (✓) the ones true for you.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    &ldquo;This morning ...&rdquo; Write the irregular past simple form and tick if true for you:
                  </p>
                </div>
              </div>

              <div className={styles.sentenceList}>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex5b_true', '1', 'Sentence 1 true for you')}
                  <span className={styles.itemLabel}>1.</span>
                  <span>I <strong>got up</strong> (get up) at 7.30. (example)</span>
                </div>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex5b_true', '2', 'Sentence 2 true for you')}
                  <span className={styles.itemLabel}>2.</span>
                  <span>I</span>
                  {renderInput('check_ex5a_sentences', '2', 'past form...')}
                  <span>(have) a shower.</span>
                </div>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex5b_true', '3', 'Sentence 3 true for you')}
                  <span className={styles.itemLabel}>3.</span>
                  <span>I</span>
                  {renderInput('check_ex5a_sentences', '3', 'past form...')}
                  <span>(make) my breakfast.</span>
                </div>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex5b_true', '4', 'Sentence 4 true for you')}
                  <span className={styles.itemLabel}>4.</span>
                  <span>I</span>
                  {renderInput('check_ex5a_sentences', '4', 'past form...')}
                  <span>(eat) breakfast.</span>
                </div>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex5b_true', '5', 'Sentence 5 true for you')}
                  <span className={styles.itemLabel}>5.</span>
                  <span>I</span>
                  {renderInput('check_ex5a_sentences', '5', 'past form...')}
                  <span>(drink) two cups of tea with my breakfast.</span>
                </div>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex5b_true', '6', 'Sentence 6 true for you')}
                  <span className={styles.itemLabel}>6.</span>
                  <span>I</span>
                  {renderInput('check_ex5a_sentences', '6', 'past form...')}
                  <span>(buy) coffee in a coffee shop.</span>
                </div>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex5b_true', '7', 'Sentence 7 true for you')}
                  <span className={styles.itemLabel}>7.</span>
                  <span>I</span>
                  {renderInput('check_ex5a_sentences', '7', 'past form...')}
                  <span>(read) a book.</span>
                </div>
                <div className={styles.sentenceItem}>
                  {renderTickBox('check_ex5b_true', '8', 'Sentence 8 true for you')}
                  <span className={styles.itemLabel}>8.</span>
                  <span>I</span>
                  {renderInput('check_ex5a_sentences', '8', 'past form...')}
                  <span>(take) a bus to work.</span>
                </div>
              </div>
            </div>

            {/* Check Ex 6: Infinitives */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>6</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Complete the phrases with infinitive verbs.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Write the base form of the verb for each holiday activity:
                  </p>
                </div>
              </div>

              <div className={styles.sentenceList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>1.</span>
                  {renderInput('check_ex6_infinitives', '1', 'infinitive...')}
                  <span>in the sea</span>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>2.</span>
                  {renderInput('check_ex6_infinitives', '2', 'infinitive...')}
                  <span>a museum</span>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>3.</span>
                  {renderInput('check_ex6_infinitives', '3', 'infinitive...')}
                  <span>for a walk / shopping / to restaurants</span>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>4.</span>
                  {renderInput('check_ex6_infinitives', '4', 'infinitive...')}
                  <span>a good time</span>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>5.</span>
                  {renderInput('check_ex6_infinitives', '5', 'infinitive...')}
                  <span>in a hotel</span>
                </div>
              </div>
            </div>

            {/* Check Ex 7a: Complete the questions */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>7a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Read the answers and complete the questions.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Example: <strong>What time did you get up this morning?</strong> &rarr; <em>A: I got up at 7.30.</em>
                  </p>
                </div>
              </div>

              <div className={styles.sentenceList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>1.</span>
                  <span className={styles.itemText}>
                    Q: What time <strong>did you get up</strong> this morning?<br />
                    A: <em>I got up at 7.30.</em> (example)
                  </span>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>2.</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                    <div>
                      Q: {renderInput('check_ex7a_questions', '2', 'Did you have...')} a shower this morning?
                    </div>
                    <div style={{ color: '#4b5563', fontStyle: 'italic' }}>
                      A: No, I didn&apos;t. I had a shower last night.
                    </div>
                  </div>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>3.</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                    <div>
                      Q: How {renderInput('check_ex7a_questions', '3', 'did you travel...')} to work?
                    </div>
                    <div style={{ color: '#4b5563', fontStyle: 'italic' }}>
                      A: I travelled by bus.
                    </div>
                  </div>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>4.</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                    <div>
                      Q: {renderInput('check_ex7a_questions', '4', 'Did you watch...')} TV last night?
                    </div>
                    <div style={{ color: '#4b5563', fontStyle: 'italic' }}>
                      A: No, I didn&apos;t. I read a book.
                    </div>
                  </div>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>5.</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                    <div>
                      Q: {renderInput('check_ex7a_questions', '5', 'Did you speak...')} to anyone on the phone?
                    </div>
                    <div style={{ color: '#4b5563', fontStyle: 'italic' }}>
                      A: Yes, I did. I spoke to my friend.
                    </div>
                  </div>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>6.</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                    <div>
                      Q: Where {renderInput('check_ex7a_questions', '6', 'did you have...')} dinner?
                    </div>
                    <div style={{ color: '#4b5563', fontStyle: 'italic' }}>
                      A: I ate dinner at home.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reflect: Self-assessment 1-5 */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>★</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Reflect: How confident do you feel?</h3>
                  <p className={styles.exerciseInstruction}>
                    Write 1–5 (1 = not very confident, 5 = very confident):
                  </p>
                </div>
              </div>

              <div className={styles.reflectGrid}>
                {[
                  { key: 'goal_1', label: 'I can give a talk about when I was young.' },
                  { key: 'goal_2', label: 'I can talk about a bad day.' },
                  { key: 'goal_3', label: 'I can talk about a holiday.' },
                  { key: 'goal_4', label: 'I can greet people.' },
                ].map((item) => {
                  const currVal = getRecord(answers.reflect_scores)[item.key] || '';
                  return (
                    <div key={item.key} className={styles.reflectCard}>
                      <span className={styles.reflectText}>{item.label}</span>
                      <div className={styles.reflectRatingGroup}>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => {
                              if (readOnly) return;
                              handleFieldChange('reflect_scores', item.key, String(num));
                            }}
                            className={`${styles.ratingBtn} ${currVal === String(num) ? styles.ratingBtnActive : ''}`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Banner: Want more practice? */}
            <div className={styles.bottomBanner}>
              <div className={styles.bannerImageWrapper}>
                <Image
                  src="/images/lesson8d/banner_more_practice.png"
                  alt="Want more practice? Go to your Workbook or app."
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
