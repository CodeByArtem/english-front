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
import styles from './lesson8a.module.scss';

export interface Lesson8AContentProps {
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

export const FALLBACK_ANSWER_KEY_8A: LessonAnswerKey = {
  exercise_1b_photo_match: {
    match: ['B', 'b', 'Photo B', 'photo b'],
  },
  exercise_2a_word_map: {
    travel_1: ['to school', 'to school by bus', 'school'],
    watch_1: ['a game on the computer', 'game on the computer', 'a game', 'games'],
    live_1: ['in a village', 'village', 'a village', 'in a village in Norway'],
    play_1: ['football', 'Football', 'football every day'],
    talk_1: ['to my friends', 'friends', 'to friends'],
    talk_2: ['about football', 'football'],
  },
  exercise_3a_word_map: {
    live_1: ['in a town', 'a town', 'town'],
    live_2: ['with my family', 'my family', 'family'],
    live_3: ['in a house', 'a house', 'house'],
    talk_1: ['to my teacher', 'my teacher', 'teacher'],
    talk_2: ['about my weekend', 'my weekend', 'weekend'],
    watch_1: ['a film', 'film', 'films'],
    play_1: ['tennis', 'Tennis'],
    travel_1: ["to my grandparents' house", 'to my grandparents house', "grandparents' house", 'grandparents house'],
    travel_2: ['by car', 'car'],
  },
  exercise_5_table: {
    '1_nanami': ['false'],
    '1_michal': ['false'],
    '1_lucy': ['true'],
    '2_nanami': ['true'],
    '2_michal': ['false'],
    '2_lucy': ['false'],
    '3_nanami': ['false'],
    '3_michal': ['true'],
    '3_lucy': ['false'],
    '4_nanami': ['true'],
    '4_michal': ['true'],
    '4_lucy': ['false'],
    '5_nanami': ['false'],
    '5_michal': ['true'],
    '5_lucy': ['false'],
  },
  exercise_5_reading_table: {
    liked_school: ['Lucy', 'lucy'],
    travelled_every_year: ['Nanami', 'nanami'],
    went_to_new_country: ['Michal', 'michal'],
    lived_in_small_place: ['Nanami and Michal', 'Nanami, Michal', 'Nanami & Michal', 'Michal and Nanami', 'Nanami', 'Michal'],
    doesnt_talk_about_games: ['Michal', 'michal'],
  },
  exercise_6_grammar: {
    '1': ['walked', 'Walked'],
    '2': ['liked', 'Liked'],
    '3': ['studied', 'Studied'],
    '4': ['travelled', 'traveled', 'Travelled', 'Traveled'],
  },
  exercise_7c_pronunciation: {
    '1': ['c', 'C', '/ɪd/', 'id', '/id/'],
    '2': ['b', 'B', '/d/', 'd'],
    '3': ['a', 'A', '/t/', 't'],
    '4': ['a', 'A', '/t/', 't'],
    '5': ['c', 'C', '/ɪd/', 'id', '/id/'],
  },
  exercise_8a_sentences: {
    '1': ['started', 'Started'],
    '2': ['travelled', 'traveled', 'Travelled', 'Traveled'],
    '3': ['cleaned', 'Cleaned'],
    '4': ["didn't like", 'did not like', 'didnt like'],
    '5': ['played', 'Played'],
    '6': ['studied', 'Studied'],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

export default function Lesson8AContent(props: Lesson8AContentProps) {
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
    FALLBACK_ANSWER_KEY_8A;

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

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Banner Header 8A */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge8A}>
              <span>8</span>
              <span className={styles.letterA}>A</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>When I was young</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: give a talk about when you were young</span>
                <span className={styles.pillGoal}>Grammar: past simple (regular verbs)</span>
                <span className={styles.pillGoal}>Vocabulary: verb phrases</span>
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
              <h2 className={styles.sectionTitle}>Childhood Memories & Photos</h2>
            </div>

            {/* Exercise 1a: Photos Gallery */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Work in pairs. Look at the photos. What can you see?</h3>
                  <p className={styles.exerciseInstruction}>
                    Example: <em>In this photo, there&apos;s a girl on a bike.</em>
                  </p>
                </div>
              </div>

              <div className={styles.photosGrid}>
                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8a/photo_a_bike.png"
                      alt="Photo A: Girl with helmet on bicycle"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo A</span>
                    <span className={styles.photoDesc}>Girl on a bike</span>
                  </div>
                </div>

                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8a/photo_b_bus.png"
                      alt="Photo B: Boy looking back on school bus"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo B</span>
                    <span className={styles.photoDesc}>Boy travelling on school bus</span>
                  </div>
                </div>

                <div className={styles.photoCard}>
                  <div className={styles.photoImageWrapper}>
                    <Image
                      src="/images/lesson8a/photo_c_starfish.png"
                      alt="Photo C: Boy by the water holding a red starfish"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                  <div className={styles.photoCaption}>
                    <span className={styles.photoBadge}>Photo C</span>
                    <span className={styles.photoDesc}>Boy with flat cap and starfish</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 1b: Story & Photo Matching */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1b</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Read the text and look at the photos again. Match the text with the correct photo, A–C.
                  </h3>
                </div>
              </div>

              <div className={styles.storyBox}>
                <p>
                  &ldquo;When I was young, I lived in a village in Norway - its name was Nostrum. I travelled to school by
                  bus every day. The school bus was old, but I liked it. On the bus I talked to my friends about
                  football. Every week I watched a game on the computer. I loved Manchester United and I wanted to play
                  for them! I played football every day with my friends after school. I was happy then.&rdquo;
                </p>
              </div>

              <div className={styles.sentenceItem}>
                <span>This story matches:</span>
                {renderSelect('exercise_1b_photo_match', 'match', [
                  { value: 'A', label: 'Photo A (girl on bike)' },
                  { value: 'B', label: 'Photo B (boy on bus)' },
                  { value: 'C', label: 'Photo C (boy with starfish)' },
                ])}
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 2: WORD MAP & VERB PHRASES                             */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Word Map</span>
              <h2 className={styles.sectionTitle}>Verb Phrases Collocations</h2>
            </div>

            {/* Exercise 2a: Word Map from Text 1b */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Look at the word map. Then read the text in Exercise 1b again. Add more words to the word map.
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Find the verb phrases from the story in Exercise 1b and complete the branches.
                  </p>
                </div>
              </div>

              <div className={styles.wordMapGrid}>
                {/* 1. Travel */}
                <div className={styles.wordMapCard}>
                  <div className={styles.wordMapHeader}>
                    <span className={styles.wordMapVerbBubble}>1 travel</span>
                  </div>
                  <div className={styles.wordMapBranches}>
                    <div className={styles.wordMapBranch}>to work</div>
                    <div className={styles.wordMapBranch}>by bus</div>
                    <div className={styles.wordMapBranch}>
                      <span>from story:</span>
                      {renderInput('exercise_2a_word_map', 'travel_1', 'phrase from story...')}
                    </div>
                  </div>
                </div>

                {/* 2. Watch */}
                <div className={styles.wordMapCard}>
                  <div className={styles.wordMapHeader}>
                    <span className={styles.wordMapVerbBubble}>2 watch</span>
                  </div>
                  <div className={styles.wordMapBranches}>
                    <div className={styles.wordMapBranch}>TV</div>
                    <div className={styles.wordMapBranch}>
                      <span>from story:</span>
                      {renderInput('exercise_2a_word_map', 'watch_1', 'phrase from story...')}
                    </div>
                  </div>
                </div>

                {/* 3. Live */}
                <div className={styles.wordMapCard}>
                  <div className={styles.wordMapHeader}>
                    <span className={styles.wordMapVerbBubble}>3 live</span>
                  </div>
                  <div className={styles.wordMapBranches}>
                    <div className={styles.wordMapBranch}>with my parents</div>
                    <div className={styles.wordMapBranch}>in a city</div>
                    <div className={styles.wordMapBranch}>
                      <span>from story:</span>
                      {renderInput('exercise_2a_word_map', 'live_1', 'phrase from story...')}
                    </div>
                  </div>
                </div>

                {/* 4. Play */}
                <div className={styles.wordMapCard}>
                  <div className={styles.wordMapHeader}>
                    <span className={styles.wordMapVerbBubble}>4 play</span>
                  </div>
                  <div className={styles.wordMapBranches}>
                    <div className={styles.wordMapBranch}>games</div>
                    <div className={styles.wordMapBranch}>with friends</div>
                    <div className={styles.wordMapBranch}>
                      <span>from story:</span>
                      {renderInput('exercise_2a_word_map', 'play_1', 'phrase from story...')}
                    </div>
                  </div>
                </div>

                {/* 5. Talk */}
                <div className={styles.wordMapCard}>
                  <div className={styles.wordMapHeader}>
                    <span className={styles.wordMapVerbBubble}>5 talk</span>
                  </div>
                  <div className={styles.wordMapBranches}>
                    <div className={styles.wordMapBranch}>about the weather</div>
                    <div className={styles.wordMapBranch}>to my parents</div>
                    <div className={styles.wordMapBranch}>
                      <span>from story:</span>
                      {renderInput('exercise_2a_word_map', 'talk_1', 'phrase from story...')}
                    </div>
                    <div className={styles.wordMapBranch}>
                      <span>from story:</span>
                      {renderInput('exercise_2a_word_map', 'talk_2', 'phrase from story...')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 2b: Listen, check and repeat */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2b</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Listen, check and repeat</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '8.1' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('8.1')}
                      aria-label="Play Audio 8.1"
                    >
                      {playingAudio === '8.1' ? '⏸ Playing 8.1' : '▶ Audio 8.1'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Listen to Audio 8.1 to check the phrases you added to the word map in Exercise 2a and repeat them.
                  </p>
                </div>
              </div>
            </div>

            {/* Exercise 3a: Box of Phrases */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>3a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Add the words/phrases in the box to the word map categories</h3>
                </div>
              </div>

              <div className={styles.wordBankBox}>
                <span className={styles.wordBankTitle}>Word Box:</span>
                <span className={styles.wordChip}>in a town</span>
                <span className={styles.wordChip}>to my teacher</span>
                <span className={styles.wordChip}>a film</span>
                <span className={styles.wordChip}>tennis</span>
                <span className={styles.wordChip}>to my grandparents&apos; house</span>
                <span className={styles.wordChip}>by car</span>
                <span className={styles.wordChip}>about my weekend</span>
                <span className={styles.wordChip}>with my family</span>
                <span className={styles.wordChip}>in a house</span>
              </div>

              <div className={styles.sentencesList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>•</span>
                  <span><strong>live:</strong></span>
                  {renderInput('exercise_3a_word_map', 'live_1', 'phrase...')}
                  <span>,</span>
                  {renderInput('exercise_3a_word_map', 'live_2', 'phrase...')}
                  <span>,</span>
                  {renderInput('exercise_3a_word_map', 'live_3', 'phrase...')}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>•</span>
                  <span><strong>talk:</strong></span>
                  {renderInput('exercise_3a_word_map', 'talk_1', 'phrase...')}
                  <span>,</span>
                  {renderInput('exercise_3a_word_map', 'talk_2', 'phrase...')}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>•</span>
                  <span><strong>watch:</strong></span>
                  {renderInput('exercise_3a_word_map', 'watch_1', 'phrase...')}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>•</span>
                  <span><strong>play:</strong></span>
                  {renderInput('exercise_3a_word_map', 'play_1', 'phrase...')}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>•</span>
                  <span><strong>travel:</strong></span>
                  {renderInput('exercise_3a_word_map', 'travel_1', 'phrase...')}
                  <span>,</span>
                  {renderInput('exercise_3a_word_map', 'travel_2', 'phrase...')}
                </div>
              </div>
            </div>

            {/* Exercise 4a: Personal Sentences */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>4a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Make sentences about yourself using the phrases</h3>
                  <p className={styles.exerciseInstruction}>
                    Example: <em>I often play football.</em> / <em>I live with my family.</em>
                  </p>
                </div>
              </div>

              <div className={styles.sentencesList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>1</span>
                  {renderInput('exercise_4a_personal', 'sent_1', 'Your sentence...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>2</span>
                  {renderInput('exercise_4a_personal', 'sent_2', 'Your sentence...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>3</span>
                  {renderInput('exercise_4a_personal', 'sent_3', 'Your sentence...', { fullWidth: true })}
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 3: READING: SCHOOL DAYS                                */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Reading</span>
              <h2 className={styles.sectionTitle}>School Days in Different Places</h2>
            </div>

            {/* Reading Cards */}
            <div className={styles.readingCardsGrid}>
              {/* Nanami */}
              <div className={styles.readingCard}>
                <div className={styles.readingCardHeader}>
                  <h3 className={styles.readingCardName}>Nanami (Japan)</h3>
                </div>
                <div className={styles.readingCardContent}>
                  <div className={styles.portraitWrapper}>
                    <Image
                      src="/images/lesson8a/portrait_nanami.png"
                      alt="Portrait of Nanami"
                      fill
                      sizes="75px"
                    />
                  </div>
                  <p className={styles.readingText}>
                    &ldquo;When I was young, I lived in a small town. I walked to school every day with my friends, and
                    we usually talked about the other girls in our class. We studied every day. I didn&apos;t like my
                    school, but I liked my friends. We lived in Hokkaido, in the north, but every year my family
                    travelled to Fukuoka in the south. We played games on the beach there. It was a happy time.&rdquo;
                  </p>
                </div>
              </div>

              {/* Michal */}
              <div className={styles.readingCard}>
                <div className={styles.readingCardHeader}>
                  <h3 className={styles.readingCardName}>Michal (Poland & UK)</h3>
                </div>
                <div className={styles.readingCardContent}>
                  <div className={styles.portraitWrapper}>
                    <Image
                      src="/images/lesson8a/portrait_michal.png"
                      alt="Portrait of Michal"
                      fill
                      sizes="75px"
                    />
                  </div>
                  <p className={styles.readingText}>
                    &ldquo;My first school was in Poland – my parents are Polish. I lived in Poland for six years in a
                    village. Later, we lived in a big city in the UK because of my dad&apos;s job. In Poland I walked to
                    school, but in England I travelled to school by bus. My English was not good, and I didn&apos;t
                    understand British children. School was very difficult, too. I didn&apos;t like it.&rdquo;
                  </p>
                </div>
              </div>

              {/* Lucy */}
              <div className={styles.readingCard}>
                <div className={styles.readingCardHeader}>
                  <h3 className={styles.readingCardName}>Lucy (Uxbridge, UK)</h3>
                </div>
                <div className={styles.readingCardContent}>
                  <div className={styles.portraitWrapper}>
                    <Image
                      src="/images/lesson8a/portrait_lucy.png"
                      alt="Portrait of Lucy"
                      fill
                      sizes="75px"
                    />
                  </div>
                  <p className={styles.readingText}>
                    &ldquo;I lived in a town called Uxbridge when I was young. I travelled to school by train every day
                    with my best friend, Josh. School was great. My teacher was called Mrs Harrison. She played games with
                    us, but she also helped us a lot. I lived with my parents and my sister. At night we watched TV
                    together.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Exercise 5: Comprehension Table */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>5</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Read the text and complete the table. Who does each sentence refer to? Tick Nanami, Michal or Lucy (more than one person may apply).
                  </h3>
                </div>
              </div>

              <div className={styles.tableResponsive}>
                <table className={styles.interactiveTable}>
                  <thead>
                    <tr>
                      <th>Who ...</th>
                      <th className={styles.tableHeaderCol}>Nanami</th>
                      <th className={styles.tableHeaderCol}>Michal</th>
                      <th className={styles.tableHeaderCol}>Lucy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1 liked school?</td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '1_nanami', false, 'Nanami liked school')}
                      </td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '1_michal', false, 'Michal liked school')}
                      </td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '1_lucy', true, 'Lucy liked school')}
                      </td>
                    </tr>
                    <tr>
                      <td>2 travelled every year?</td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '2_nanami', true, 'Nanami travelled every year')}
                      </td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '2_michal', false, 'Michal travelled every year')}
                      </td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '2_lucy', false, 'Lucy travelled every year')}
                      </td>
                    </tr>
                    <tr>
                      <td>3 went to a new country?</td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '3_nanami', false, 'Nanami went to a new country')}
                      </td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '3_michal', true, 'Michal went to a new country')}
                      </td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '3_lucy', false, 'Lucy went to a new country')}
                      </td>
                    </tr>
                    <tr>
                      <td>4 lived in a small place?</td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '4_nanami', true, 'Nanami lived in a small place')}
                      </td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '4_michal', true, 'Michal lived in a small place')}
                      </td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '4_lucy', false, 'Lucy lived in a small place')}
                      </td>
                    </tr>
                    <tr>
                      <td>5 doesn&apos;t talk about games?</td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '5_nanami', false, "Nanami doesn't talk about games")}
                      </td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '5_michal', true, "Michal doesn't talk about games")}
                      </td>
                      <td className={styles.tableCheckCell}>
                        {renderTickBox('exercise_5_table', '5_lucy', false, "Lucy doesn't talk about games")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 4: GRAMMAR: PAST SIMPLE (REGULAR VERBS)               */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Grammar</span>
              <h2 className={styles.sectionTitle}>Past Simple (Regular Verbs) & Spelling</h2>
            </div>

            {/* Exercise 6: Grammar & Spelling Table */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>6</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Read and complete the grammar box. Use the text in Exercise 5 to help you.
                  </h3>
                </div>
              </div>

              <div className={styles.grammarRuleBox}>
                <h4 className={styles.grammarRuleTitle}>Past simple (regular verbs)</h4>
                <div className={styles.sentencesList}>
                  <div className={styles.sentenceItem}>
                    <strong>+ Positive:</strong>
                    <span>I / You / He / She / It / We / They <em>lived</em> in a village.</span>
                  </div>
                  <div className={styles.sentenceItem}>
                    <strong>&minus; Negative:</strong>
                    <span>I / You / He / She / It / We / They <em>didn&apos;t live</em> in a city.</span>
                  </div>
                </div>
              </div>

              <div className={styles.tableResponsive}>
                <table className={styles.interactiveTable}>
                  <thead>
                    <tr>
                      <th>Rule</th>
                      <th>Spelling Change</th>
                      <th>Base Verb &rarr; Past Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>most verbs</td>
                      <td>+ <em>-ed</em></td>
                      <td>
                        <span>walk &rarr;</span>
                        {renderInput('exercise_6_grammar', '1', 'past form...')}
                      </td>
                    </tr>
                    <tr>
                      <td>verbs ending in <em>-e</em></td>
                      <td>+ <em>-d</em></td>
                      <td>
                        <span>like &rarr;</span>
                        {renderInput('exercise_6_grammar', '2', 'past form...')}
                      </td>
                    </tr>
                    <tr>
                      <td>verbs ending in consonant + <em>-y</em></td>
                      <td>change <em>y</em> &rarr; <em>-ied</em></td>
                      <td>
                        <span>study &rarr;</span>
                        {renderInput('exercise_6_grammar', '3', 'past form...')}
                      </td>
                    </tr>
                    <tr>
                      <td>verbs ending in consonant + vowel + consonant</td>
                      <td>double final consonant + <em>-ed</em></td>
                      <td>
                        <span>travel &rarr;</span>
                        {renderInput('exercise_6_grammar', '4', 'past form...')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exercise 7a, 7b, 7c: Pronunciation of -ed */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>7</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Pronunciation of -ed endings (/t/, /d/, /ɪd/)</h3>
                    <div className={styles.sectionHeaderRow}>
                      <button
                        type="button"
                        className={`${styles.audioBtn} ${playingAudio === '8.2' ? styles.audioPlaying : ''}`}
                        onClick={() => playAudio?.('8.2')}
                        aria-label="Play Audio 8.2"
                      >
                        {playingAudio === '8.2' ? '⏸ Playing 8.2' : '▶ Audio 8.2'}
                      </button>
                      <button
                        type="button"
                        className={`${styles.audioBtn} ${playingAudio === '8.3' ? styles.audioPlaying : ''}`}
                        onClick={() => playAudio?.('8.3')}
                        aria-label="Play Audio 8.3"
                      >
                        {playingAudio === '8.3' ? '⏸ Playing 8.3' : '▶ Audio 8.3'}
                      </button>
                    </div>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Audio 8.2 teaches the 3 sounds: <strong>1 worked</strong> (/t/), <strong>2 stayed</strong> (/d/),{' '}
                    <strong>3 started</strong> (/ɪd/). In Exercise 7c, listen to Audio 8.3 and select the correct
                    ending sound for each word.
                  </p>
                </div>
              </div>

              <div className={styles.sentencesList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>1</span>
                  <span><strong>visited</strong>:</span>
                  {renderSelect('exercise_7c_pronunciation', '1', [
                    { value: 'a', label: 'a (/t/ - worked)' },
                    { value: 'b', label: 'b (/d/ - stayed)' },
                    { value: 'c', label: 'c (/ɪd/ - started)' },
                  ])}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>2</span>
                  <span><strong>played</strong>:</span>
                  {renderSelect('exercise_7c_pronunciation', '2', [
                    { value: 'a', label: 'a (/t/ - worked)' },
                    { value: 'b', label: 'b (/d/ - stayed)' },
                    { value: 'c', label: 'c (/ɪd/ - started)' },
                  ])}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>3</span>
                  <span><strong>watched</strong>:</span>
                  {renderSelect('exercise_7c_pronunciation', '3', [
                    { value: 'a', label: 'a (/t/ - worked)' },
                    { value: 'b', label: 'b (/d/ - stayed)' },
                    { value: 'c', label: 'c (/ɪd/ - started)' },
                  ])}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>4</span>
                  <span><strong>cooked</strong>:</span>
                  {renderSelect('exercise_7c_pronunciation', '4', [
                    { value: 'a', label: 'a (/t/ - worked)' },
                    { value: 'b', label: 'b (/d/ - stayed)' },
                    { value: 'c', label: 'c (/ɪd/ - started)' },
                  ])}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>5</span>
                  <span><strong>wanted</strong>:</span>
                  {renderSelect('exercise_7c_pronunciation', '5', [
                    { value: 'a', label: 'a (/t/ - worked)' },
                    { value: 'b', label: 'b (/d/ - stayed)' },
                    { value: 'c', label: 'c (/ɪd/ - started)' },
                  ])}
                </div>
              </div>
            </div>

            {/* Exercise 8a: Complete Sentences with Past Form */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>8a</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Complete the sentences with the correct form of the verbs in brackets</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '8.4' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('8.4')}
                      aria-label="Play Audio 8.4"
                    >
                      {playingAudio === '8.4' ? '⏸ Playing 8.4' : '▶ Audio 8.4'}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.sentencesList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>1</span>
                  <span>At school my lessons</span>
                  {renderInput('exercise_8a_sentences', '1', 'verb...')}
                  <span>(start) at 9 o&apos;clock in the morning.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>2</span>
                  <span>I</span>
                  {renderInput('exercise_8a_sentences', '2', 'verb...')}
                  <span>(travel) to school by train.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>3</span>
                  <span>I</span>
                  {renderInput('exercise_8a_sentences', '3', 'verb...')}
                  <span>(clean) my dad&apos;s car every weekend.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>4</span>
                  <span>I</span>
                  {renderInput('exercise_8a_sentences', '4', 'verb...')}
                  <span>(not like) my English teacher at school.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>5</span>
                  <span>At school I</span>
                  {renderInput('exercise_8a_sentences', '5', 'verb...')}
                  <span>(play) sports every day.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>6</span>
                  <span>I often</span>
                  {renderInput('exercise_8a_sentences', '6', 'verb...')}
                  <span>(study) in a café after school.</span>
                </div>
              </div>
            </div>

            {/* Exercise 9a: True and False Sentences */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>9a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Write two true and two false sentences about when you were a child
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Example: <em>I watched Pokémon on TV every day.</em>
                  </p>
                </div>
              </div>

              <div className={styles.wordBankBox}>
                <span className={styles.wordBankTitle}>Use these verbs:</span>
                <span className={styles.wordChip}>arrive</span>
                <span className={styles.wordChip}>clean</span>
                <span className={styles.wordChip}>cycle</span>
                <span className={styles.wordChip}>finish</span>
                <span className={styles.wordChip}>listen to</span>
                <span className={styles.wordChip}>like</span>
                <span className={styles.wordChip}>live</span>
                <span className={styles.wordChip}>love</span>
                <span className={styles.wordChip}>play</span>
                <span className={styles.wordChip}>study</span>
                <span className={styles.wordChip}>talk to</span>
                <span className={styles.wordChip}>travel</span>
                <span className={styles.wordChip}>use</span>
                <span className={styles.wordChip}>visit</span>
                <span className={styles.wordChip}>walk</span>
                <span className={styles.wordChip}>watch</span>
                <span className={styles.wordChip}>work</span>
              </div>

              <div className={styles.sentencesList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>1</span>
                  {renderInput('exercise_9a_sentences', 'sent_1', 'True or false sentence...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>2</span>
                  {renderInput('exercise_9a_sentences', 'sent_2', 'True or false sentence...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>3</span>
                  {renderInput('exercise_9a_sentences', 'sent_3', 'True or false sentence...', { fullWidth: true })}
                </div>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>4</span>
                  {renderInput('exercise_9a_sentences', 'sent_4', 'True or false sentence...', { fullWidth: true })}
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 5: SPEAKING: PREPARE & SPEAK                           */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Speaking</span>
              <h2 className={styles.sectionTitle}>When You Were Young: Short Talk</h2>
            </div>

            <div className={styles.speakingLayout}>
              <div className={styles.speakingContent}>
                {/* Exercise 10: PREPARE */}
                <div className={styles.exerciseSection}>
                  <div className={styles.exerciseHeader}>
                    <span className={styles.exerciseNum}>10</span>
                    <div className={styles.exerciseTitleArea}>
                      <h3 className={styles.exerciseTitle}>PREPARE: Make notes about when you were young</h3>
                      <p className={styles.exerciseInstruction}>
                        Make notes about: village, town or city? big or small school? travelled by bus, train or walked?
                        liked school/teacher? TV/games/travel? friends?
                      </p>
                    </div>
                  </div>

                  <div className={styles.sentencesList}>
                    <div className={styles.sentenceItem}>
                      <span className={styles.sentenceNum}>•</span>
                      <span><strong>Hometown:</strong></span>
                      {renderInput('exercise_10_notes', 'hometown', 'Notes about your town/village...', { fullWidth: true })}
                    </div>
                    <div className={styles.sentenceItem}>
                      <span className={styles.sentenceNum}>•</span>
                      <span><strong>School & travel:</strong></span>
                      {renderInput('exercise_10_notes', 'school_travel', 'Notes about school and transport...', { fullWidth: true })}
                    </div>
                    <div className={styles.sentenceItem}>
                      <span className={styles.sentenceNum}>•</span>
                      <span><strong>Free time & hobbies:</strong></span>
                      {renderInput('exercise_10_notes', 'free_time', 'Notes about games, TV, friends...', { fullWidth: true })}
                    </div>
                  </div>
                </div>

                {/* Exercise 11: SPEAK & AudioAnswerRecorder */}
                <div className={styles.exerciseSection}>
                  <div className={styles.exerciseHeader}>
                    <span className={styles.exerciseNum}>11</span>
                    <div className={styles.exerciseTitleArea}>
                      <h3 className={styles.exerciseTitle}>SPEAK: Tell your classmates about when you were young</h3>
                      <p className={styles.exerciseInstruction}>
                        Model: <em>&ldquo;When I was young, I lived in a small town. I walked to school with my friends...&rdquo;</em>
                      </p>
                    </div>
                  </div>

                  {/* Submission Audio Player for tutor */}
                  {submissionId && (
                    <div className={styles.feedbackRow}>
                      <SubmissionAudioPlayer
                        submissionId={submissionId}
                        exerciseKey="speaking_8a_childhood"
                        audios={submittedAudios}
                      />
                    </div>
                  )}

                  {/* Audio recorder for student */}
                  <AudioAnswerRecorder
                    onAudioChange={(blob, mime) =>
                      onAudioBlobChange?.(blob, mime, 'speaking_8a_childhood')
                    }
                    readOnly={readOnly}
                  />
                </div>
              </div>

              {/* Side Photo & Badge */}
              <div className={styles.speakingSidePhoto}>
                <div className={styles.speakingPhotoCard}>
                  <Image
                    src="/images/lesson8a/photo_speaking_school.png"
                    alt="School days writing at desk"
                    fill
                    sizes="280px"
                  />
                </div>

                <div className={styles.badgeDevelopWrapper}>
                  <Image
                    src="/images/lesson8a/badge_develop_reading.png"
                    alt="Develop your reading page 107"
                    fill
                    sizes="240px"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
