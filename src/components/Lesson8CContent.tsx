'use client';

import React from 'react';
import Image from 'next/image';
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
import styles from './lesson8c.module.scss';

export interface Lesson8CContentProps {
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

export const FALLBACK_ANSWER_KEY_8C: LessonAnswerKey = {
  exercise_1a_photos: {
    photo_a: ['have a good time', 'Have a good time'],
    photo_b: ['relax', 'Relax'],
    photo_c: ['go shopping', 'Go shopping'],
    photo_d: ['visit a museum', 'Visit a museum'],
    photo_e: ['stay in a hotel', 'Stay in a hotel'],
    photo_f: ['go for a walk', 'Go for a walk'],
    photo_g: ['go to restaurants', 'Go to restaurants'],
    photo_h: ['swim in the sea', 'Swim in the sea'],
  },
  exercise_2a_present_tense: {
    relaxed: ['relax', 'Relax'],
    swam: ['swim', 'Swim'],
    visited: ['visit', 'Visit'],
    went: ['go', 'Go'],
    stayed: ['stay', 'Stay'],
  },
  exercise_2b_irregular: {
    had: ['irregular', 'true'],
    relaxed: ['regular', 'false'],
    swam: ['irregular', 'true'],
    visited: ['regular', 'false'],
    went: ['irregular', 'true'],
    stayed: ['regular', 'false'],
  },
  exercise_3a_topic: {
    topic: ['her holiday', 'holiday', 'holiday in Greece', 'Her holiday'],
  },
  exercise_3b_tick_questions: {
    '1': ['true'],
    '2': ['true'],
    '3': ['false'],
    '4': ['true'],
    '5': ['true'],
    '6': ['false'],
  },
  exercise_4_grammar_box: {
    '1': ['Did', 'did'],
    '2': ['Did', 'did'],
    '3': ['did', 'Did'],
    '4': ['did', 'Did'],
    '5': ['did', 'Did'],
    '6': ['did', 'Did'],
  },
  exercise_6a_make_questions: {
    '2': ['What time did you get up on Saturday?', 'What time did you get up on Saturday'],
    '3': ['Where did you go?', 'Where did you go'],
    '4': ['Who did you go with?', 'Who did you go with'],
    '5': ['Where did you have lunch on Sunday?', 'Where did you have lunch on Sunday'],
    '6': ['What did you eat?', 'What did you eat'],
    '7': ['What did you do in the evening?', 'What did you do in the evening'],
    '8': ['Did you study English?', 'Did you study English'],
    '9': ['Did your best friend text you?', 'Did your best friend text you'],
  },
  exercise_7a_prepare_questions: {
    where: ['Where did you go?', 'Where did you go'],
    when: ['When did you go?', 'When did you go'],
    how: ['How did you get there?', 'How did you get there'],
    who: ['Who did you go with?', 'Who did you go with'],
    food: ['What food did you eat?', 'What food did you eat'],
    what: ['What did you do?', 'What did you do'],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const PHOTO_OPTIONS = [
  { value: 'go for a walk', label: 'go for a walk' },
  { value: 'go shopping', label: 'go shopping' },
  { value: 'go to restaurants', label: 'go to restaurants' },
  { value: 'have a good time', label: 'have a good time' },
  { value: 'relax', label: 'relax' },
  { value: 'stay in a hotel', label: 'stay in a hotel' },
  { value: 'swim in the sea', label: 'swim in the sea' },
  { value: 'visit a museum', label: 'visit a museum' },
];

export default function Lesson8CContent(props: Lesson8CContentProps) {
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
    FALLBACK_ANSWER_KEY_8C;

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
            <option value="">-- Choose activity --</option>
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
    expected: boolean,
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

    if (isReview) {
      if (isChecked && expected) {
        tickClass += ` ${styles.tickBoxValid}`;
      } else if (isChecked && !expected) {
        tickClass += ` ${styles.tickBoxInvalid}`;
      } else if (!isChecked && expected) {
        tickClass += ` ${styles.tickBoxMissing}`;
      }
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
        {isChecked ? '✓' : isReview && expected ? '✓' : ''}
      </button>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Banner Header 8C */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge8C}>
              <span>8</span>
              <span className={styles.letterC}>C</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>Good places</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: talk about a holiday</span>
                <span className={styles.pillGoal}>Grammar: past simple (questions)</span>
                <span className={styles.pillGoal}>Vocabulary: holiday activities</span>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.pageBody}>
          {/* ============================================================== */}
          {/* SECTION 1: VOCABULARY & PHOTOS                                 */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Vocabulary</span>
              <h2 className={styles.sectionTitle}>Holiday Activities</h2>
            </div>

            {/* Exercise 1a: Photos Gallery */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1a</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>
                      Match photos A–H with the words and phrases in the box.
                    </h3>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Look at each holiday photo and choose the matching phrase from the box.
                  </p>
                </div>
              </div>

              {/* Word Box */}
              <div className={styles.wordBox}>
                <span className={styles.wordChip}>go for a walk</span>
                <span className={styles.wordChip}>go shopping</span>
                <span className={styles.wordChip}>go to restaurants</span>
                <span className={styles.wordChip}>have a good time</span>
                <span className={styles.wordChip}>relax</span>
                <span className={styles.wordChip}>stay in a hotel</span>
                <span className={styles.wordChip}>swim in the sea</span>
                <span className={styles.wordChip}>visit a museum</span>
              </div>

              {/* Photos Grid A–H */}
              <div className={styles.photosGrid}>
                {/* Photo A */}
                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8c/photo_a_concert.png"
                      alt="Photo A: Young people having a good time at music festival"
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo A</span>
                    {renderSelect('exercise_1a_photos', 'photo_a', PHOTO_OPTIONS)}
                  </div>
                </div>

                {/* Photo B */}
                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8c/photo_b_hammock.png"
                      alt="Photo B: Man relaxing in a hammock on tropical beach"
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo B</span>
                    {renderSelect('exercise_1a_photos', 'photo_b', PHOTO_OPTIONS)}
                  </div>
                </div>

                {/* Photo C */}
                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8c/photo_c_shopping.png"
                      alt="Photo C: Woman clothes shopping in a stylish store"
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo C</span>
                    {renderSelect('exercise_1a_photos', 'photo_c', PHOTO_OPTIONS)}
                  </div>
                </div>

                {/* Photo D */}
                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8c/photo_d_museum.png"
                      alt="Photo D: Tourist taking photograph of Egyptian statue in museum"
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo D</span>
                    {renderSelect('exercise_1a_photos', 'photo_d', PHOTO_OPTIONS)}
                  </div>
                </div>

                {/* Photo E */}
                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8c/photo_e_hotel.png"
                      alt="Photo E: Guest checking in at hotel reception desk"
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo E</span>
                    {renderSelect('exercise_1a_photos', 'photo_e', PHOTO_OPTIONS)}
                  </div>
                </div>

                {/* Photo F */}
                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8c/photo_f_hiking.png"
                      alt="Photo F: Hiker boots walking on scenic coastal mountain trail"
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo F</span>
                    {renderSelect('exercise_1a_photos', 'photo_f', PHOTO_OPTIONS)}
                  </div>
                </div>

                {/* Photo G */}
                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8c/photo_g_cafe.png"
                      alt="Photo G: Friends looking at menu at an outdoor restaurant terrace"
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo G</span>
                    {renderSelect('exercise_1a_photos', 'photo_g', PHOTO_OPTIONS)}
                  </div>
                </div>

                {/* Photo H */}
                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8c/photo_h_swimming.png"
                      alt="Photo H: Smiling boy swimming in clear sea water"
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo H</span>
                    {renderSelect('exercise_1a_photos', 'photo_h', PHOTO_OPTIONS)}
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 1b: Audio 8.8 */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1b</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Listen and repeat</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '8.8' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('8.8')}
                      aria-label="Play Audio 8.8"
                    >
                      {playingAudio === '8.8' ? '⏸ Playing 8.8' : '▶ Audio 8.8'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Listen to Audio 8.8 and repeat the holiday phrases to practise natural pronunciation and stress.
                  </p>
                </div>
              </div>
            </div>

            {/* Exercise 1c: Personal activities */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1c</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Which things do you usually do on holiday?</h3>
                  <p className={styles.exerciseInstruction}>
                    Example: <em>I often go to restaurants.</em> Write two or three sentences about what you usually do.
                  </p>
                </div>
              </div>
              <div className={styles.sentenceItem}>
                <span className={styles.itemLabel}>Your habits:</span>
                {renderInput('exercise_1c_personal', 'habits', 'e.g. I usually swim in the sea and relax...', { fullWidth: true })}
              </div>
            </div>

            {/* Exercise 2a: Text & Verbs */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Read the text. What is the present tense of the verbs in bold?
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Example: <strong>had</strong> &rarr; <em>have</em>. Write the present tense (base form) of each verb.
                  </p>
                </div>
              </div>

              <div className={styles.storyBox}>
                <p>
                  &ldquo;We <strong>had</strong> a good time in Greece last month. Sometimes we{' '}
                  <strong>relaxed</strong> at the beach and <strong>swam</strong> in the sea. Some days we were very
                  busy – we <strong>visited</strong> museums, we <strong>went</strong> to a restaurant for lunch or
                  dinner or we went shopping. One day we went for a nice walk outside the city. It was very hot! We{' '}
                  <strong>stayed</strong> in a good hotel – it was called &apos;The Lux&apos;.&rdquo;
                </p>
              </div>

              <div className={styles.sentenceList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>1.</span>
                  <span className={styles.itemText}><strong>had</strong> &rarr; <em>have</em> (example)</span>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>2.</span>
                  <span className={styles.itemText}><strong>relaxed</strong> &rarr;</span>
                  {renderInput('exercise_2a_present_tense', 'relaxed', 'present tense...')}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>3.</span>
                  <span className={styles.itemText}><strong>swam</strong> &rarr;</span>
                  {renderInput('exercise_2a_present_tense', 'swam', 'present tense...')}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>4.</span>
                  <span className={styles.itemText}><strong>visited</strong> &rarr;</span>
                  {renderInput('exercise_2a_present_tense', 'visited', 'present tense...')}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>5.</span>
                  <span className={styles.itemText}><strong>went</strong> &rarr;</span>
                  {renderInput('exercise_2a_present_tense', 'went', 'present tense...')}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>6.</span>
                  <span className={styles.itemText}><strong>stayed</strong> &rarr;</span>
                  {renderInput('exercise_2a_present_tense', 'stayed', 'present tense...')}
                </div>
              </div>
            </div>

            {/* Exercise 2b: Regular or Irregular */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2b</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Which verbs in bold are irregular?</h3>
                  <p className={styles.exerciseInstruction}>Choose whether each verb is regular or irregular:</p>
                </div>
              </div>
              <div className={styles.sentenceList}>
                  <div className={styles.sentenceItem}>
                    <span className={styles.itemLabel}>had:</span>
                    {renderSelect('exercise_2b_irregular', 'had', [
                      { value: 'regular', label: 'regular' },
                      { value: 'irregular', label: 'irregular' },
                    ])}
                  </div>
                  <div className={styles.sentenceItem}>
                    <span className={styles.itemLabel}>relaxed:</span>
                    {renderSelect('exercise_2b_irregular', 'relaxed', [
                      { value: 'regular', label: 'regular' },
                      { value: 'irregular', label: 'irregular' },
                    ])}
                  </div>
                  <div className={styles.sentenceItem}>
                    <span className={styles.itemLabel}>swam:</span>
                    {renderSelect('exercise_2b_irregular', 'swam', [
                      { value: 'regular', label: 'regular' },
                      { value: 'irregular', label: 'irregular' },
                    ])}
                  </div>
                  <div className={styles.sentenceItem}>
                    <span className={styles.itemLabel}>visited:</span>
                    {renderSelect('exercise_2b_irregular', 'visited', [
                      { value: 'regular', label: 'regular' },
                      { value: 'irregular', label: 'irregular' },
                    ])}
                  </div>
                  <div className={styles.sentenceItem}>
                    <span className={styles.itemLabel}>went:</span>
                    {renderSelect('exercise_2b_irregular', 'went', [
                      { value: 'regular', label: 'regular' },
                      { value: 'irregular', label: 'irregular' },
                    ])}
                  </div>
                  <div className={styles.sentenceItem}>
                    <span className={styles.itemLabel}>stayed:</span>
                    {renderSelect('exercise_2b_irregular', 'stayed', [
                      { value: 'regular', label: 'regular' },
                      { value: 'irregular', label: 'irregular' },
                    ])}
                  </div>
                </div>
              </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 2: LISTENING & GRAMMAR                                 */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Listening</span>
              <h2 className={styles.sectionTitle}>Megan&apos;s Holiday</h2>
            </div>

            {/* Exercise 3a: Audio 8.9 Conversation Topic */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>3a</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Listen to a conversation</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '8.9' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('8.9')}
                      aria-label="Play Audio 8.9"
                    >
                      {playingAudio === '8.9' ? '⏸ Playing 8.9' : '▶ Audio 8.9'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    What does Megan talk about – a party, her holiday or the weekend?
                  </p>
                </div>
              </div>

              <div className={styles.sentenceItem}>
                <span className={styles.itemLabel}>Topic:</span>
                {renderSelect('exercise_3a_topic', 'topic', [
                  { value: 'a party', label: 'a party' },
                  { value: 'her holiday', label: 'her holiday' },
                  { value: 'the weekend', label: 'the weekend' },
                ])}
              </div>
            </div>

            {/* Exercise 3b: Tick questions heard */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>3b</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Listen again. Tick (✓) the questions you hear.</h3>
                  <p className={styles.exerciseInstruction}>
                    Tick only the questions that Megan&apos;s friend asks in Audio 8.9:
                  </p>
                </div>
              </div>

              <div className={styles.tickList}>
                <div className={styles.tickItem}>
                  {renderTickBox('exercise_3b_tick_questions', '1', true, 'Question 1: Did you have a nice holiday, Megan?')}
                  <span className={styles.itemText}>1. Did you have a nice holiday, Megan?</span>
                </div>
                <div className={styles.tickItem}>
                  {renderTickBox('exercise_3b_tick_questions', '2', true, 'Question 2: Did you relax?')}
                  <span className={styles.itemText}>2. Did you relax?</span>
                </div>
                <div className={styles.tickItem}>
                  {renderTickBox('exercise_3b_tick_questions', '3', false, 'Question 3: How did you get there?')}
                  <span className={styles.itemText}>3. How did you get there?</span>
                </div>
                <div className={styles.tickItem}>
                  {renderTickBox('exercise_3b_tick_questions', '4', true, 'Question 4: What did you do there?')}
                  <span className={styles.itemText}>4. What did you do there?</span>
                </div>
                <div className={styles.tickItem}>
                  {renderTickBox('exercise_3b_tick_questions', '5', true, 'Question 5: Where did you stay?')}
                  <span className={styles.itemText}>5. Where did you stay?</span>
                </div>
                <div className={styles.tickItem}>
                  {renderTickBox('exercise_3b_tick_questions', '6', false, 'Question 6: When did Josh arrive?')}
                  <span className={styles.itemText}>6. When did Josh arrive?</span>
                </div>
              </div>
            </div>

            {/* Exercise 4: Grammar Box */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>4</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Read and complete the grammar box. Use Exercise 3b to help you.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Fill in the missing auxiliary verb in each question:
                  </p>
                </div>
              </div>

              <div className={styles.grammarTableWrapper}>
                <table className={styles.grammarTable}>
                  <thead>
                    <tr>
                      <th colSpan={3} className={styles.tableSectionHeader}>Past simple (questions)</th>
                    </tr>
                    <tr>
                      <th>Question</th>
                      <th>Short answer (+)</th>
                      <th>Short answer (&minus;)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        1.{' '}
                        {renderInput('exercise_4_grammar_box', '1', 'auxiliary verb...')}
                        {' '}you <strong>have</strong> a good weekend?
                      </td>
                      <td>Yes, I <strong>did</strong>.</td>
                      <td>No, I <strong>didn&apos;t</strong>.</td>
                    </tr>
                    <tr>
                      <td>
                        2.{' '}
                        {renderInput('exercise_4_grammar_box', '2', 'auxiliary verb...')}
                        {' '}they have fun?
                      </td>
                      <td>Yes, they <strong>did</strong>.</td>
                      <td>No, they <strong>didn&apos;t</strong>.</td>
                    </tr>
                    <tr>
                      <th colSpan={3} className={styles.tableSectionHeader}>Wh- questions</th>
                    </tr>
                    <tr>
                      <td>
                        Where 3.{' '}
                        {renderInput('exercise_4_grammar_box', '3', 'auxiliary verb...')}
                        {' '}Emily <strong>go</strong>?
                      </td>
                      <td colSpan={2}>She went to Greece.</td>
                    </tr>
                    <tr>
                      <td>
                        When 4.{' '}
                        {renderInput('exercise_4_grammar_box', '4', 'auxiliary verb...')}
                        {' '}she <strong>visit</strong> Tokyo?
                      </td>
                      <td colSpan={2}>Last year.</td>
                    </tr>
                    <tr>
                      <td>
                        How 5.{' '}
                        {renderInput('exercise_4_grammar_box', '5', 'auxiliary verb...')}
                        {' '}you <strong>get</strong> there?
                      </td>
                      <td colSpan={2}>By plane.</td>
                    </tr>
                    <tr>
                      <td>
                        What 6.{' '}
                        {renderInput('exercise_4_grammar_box', '6', 'auxiliary verb...')}
                        {' '}you <strong>do</strong>?
                      </td>
                      <td colSpan={2}>We swam and relaxed.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 3: PRONUNCIATION & PRACTICE                            */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Pronunciation</span>
              <h2 className={styles.sectionTitle}>Connected Speech: Linking</h2>
            </div>

            {/* Exercise 5a & 5b: Audio 8.10 */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>5a</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>
                      Listen to the sentences. Notice how the two words join together.
                    </h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '8.10' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('8.10')}
                      aria-label="Play Audio 8.10"
                    >
                      {playingAudio === '8.10' ? '⏸ Playing 8.10' : '▶ Audio 8.10'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Notice how <em>Did</em> and <em>you</em> link into /dɪdʒu/ in natural speech:
                  </p>
                </div>
              </div>

              <div className={styles.linkingBox}>
                <div className={styles.linkingSentence}>
                  1. <span className={styles.linked}>Did you</span> have a good holiday?
                </div>
                <div className={styles.linkingSentence}>
                  2. Where <span className={styles.linked}>did you</span> go?
                </div>
                <div className={styles.linkingSentence}>
                  3. What <span className={styles.linked}>did you</span> do?
                </div>
                <div className={styles.linkingSentence}>
                  4. Who <span className={styles.linked}>did you</span> go with?
                </div>
                <div className={styles.linkingSentence}>
                  5. <span className={styles.linked}>Did you</span> have lunch there?
                </div>
                <div className={styles.linkingSentence}>
                  6. When <span className={styles.linked}>did you</span> leave?
                </div>
              </div>
            </div>

            {/* Exercise 6a: Make questions using prompts */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>6a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Make questions using the prompts.</h3>
                  <p className={styles.exerciseInstruction}>
                    Example: <em>you / have a good weekend?</em> &rarr; <strong>Did you have a good weekend?</strong>
                  </p>
                </div>
              </div>

              <div className={styles.sentenceList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>1.</span>
                  <span className={styles.itemText}>you / have a good weekend? &rarr; <em>Did you have a good weekend?</em> (example)</span>
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>2.</span>
                  <span className={styles.itemText}>what time / you get up / on Saturday?</span>
                  {renderInput('exercise_6a_make_questions', '2', 'Write question...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>3.</span>
                  <span className={styles.itemText}>where / you go?</span>
                  {renderInput('exercise_6a_make_questions', '3', 'Write question...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>4.</span>
                  <span className={styles.itemText}>who / you go with?</span>
                  {renderInput('exercise_6a_make_questions', '4', 'Write question...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>5.</span>
                  <span className={styles.itemText}>where / you have lunch / on Sunday?</span>
                  {renderInput('exercise_6a_make_questions', '5', 'Write question...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>6.</span>
                  <span className={styles.itemText}>what / you eat?</span>
                  {renderInput('exercise_6a_make_questions', '6', 'Write question...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>7.</span>
                  <span className={styles.itemText}>what / you do / in the evening?</span>
                  {renderInput('exercise_6a_make_questions', '7', 'Write question...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>8.</span>
                  <span className={styles.itemText}>you / study English?</span>
                  {renderInput('exercise_6a_make_questions', '8', 'Write question...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.itemLabel}>9.</span>
                  <span className={styles.itemText}>your best friend / text you?</span>
                  {renderInput('exercise_6a_make_questions', '9', 'Write question...', { fullWidth: true })}
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 4: SPEAKING (PREPARE & SPEAK)                          */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Speaking</span>
              <h2 className={styles.sectionTitle}>Talk About a Holiday</h2>
            </div>

            {/* PREPARE Ex 7a & 7b */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>7</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    PREPARE: Make past simple questions and notes about your favourite holiday.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Form the question for each prompt, then write your personal notes in the right column:
                  </p>
                </div>
              </div>

              <div className={styles.grammarTableWrapper}>
                <table className={styles.prepareTable}>
                  <thead>
                    <tr>
                      <th style={{ width: '25%' }}>Prompt</th>
                      <th style={{ width: '45%' }}>Question (Ex 7a)</th>
                      <th style={{ width: '30%' }}>Your Notes (Ex 7b)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Where?</strong></td>
                      <td>{renderInput('exercise_7a_prepare_questions', 'where', 'Question...')}</td>
                      <td>{renderInput('exercise_7b_holiday_notes', 'where', 'e.g. Bergen, Norway')}</td>
                    </tr>
                    <tr>
                      <td><strong>When?</strong></td>
                      <td>{renderInput('exercise_7a_prepare_questions', 'when', 'Question...')}</td>
                      <td>{renderInput('exercise_7b_holiday_notes', 'when', 'e.g. last summer / in July')}</td>
                    </tr>
                    <tr>
                      <td><strong>How / get there?</strong></td>
                      <td>{renderInput('exercise_7a_prepare_questions', 'how', 'Question...')}</td>
                      <td>{renderInput('exercise_7b_holiday_notes', 'how', 'e.g. by plane / by car')}</td>
                    </tr>
                    <tr>
                      <td><strong>Who / go with?</strong></td>
                      <td>{renderInput('exercise_7a_prepare_questions', 'who', 'Question...')}</td>
                      <td>{renderInput('exercise_7b_holiday_notes', 'who', 'e.g. with my family / friends')}</td>
                    </tr>
                    <tr>
                      <td><strong>What food / eat?</strong></td>
                      <td>{renderInput('exercise_7a_prepare_questions', 'food', 'Question...')}</td>
                      <td>{renderInput('exercise_7b_holiday_notes', 'food', 'e.g. fish, pizza, seafood')}</td>
                    </tr>
                    <tr>
                      <td><strong>What / do?</strong></td>
                      <td>{renderInput('exercise_7a_prepare_questions', 'what', 'Question...')}</td>
                      <td>{renderInput('exercise_7b_holiday_notes', 'what', 'e.g. went hiking, swam in sea')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SPEAK Ex 8a & 8b with AudioAnswerRecorder */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>8</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    SPEAK: Tell the teacher about the holiday.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Model: <em>&ldquo;Mikael went to Bergen in Norway. He went there last month with his family. He ate fish every day. It was really good.&rdquo;</em>
                  </p>
                </div>
              </div>

              {/* Audio recording for Teacher Review */}
              <div style={{ marginTop: '0.75rem' }}>
                {submissionId && (
                  <div className={styles.feedbackRow} style={{ marginBottom: '0.75rem' }}>
                    <SubmissionAudioPlayer
                      submissionId={submissionId}
                      exerciseKey="speaking_8c_holiday"
                      audios={submittedAudios}
                    />
                  </div>
                )}
                <AudioAnswerRecorder
                  onAudioChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'speaking_8c_holiday')}
                  readOnly={readOnly}
                />
              </div>
            </div>

            {/* Bottom Badge: Develop your listening */}
            <div className={styles.bottomBadge}>
              <div className={styles.badgeImageWrapper}>
                <Image
                  src="/images/lesson8c/badge_develop_listening.png"
                  alt="Develop your listening - page 109"
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
