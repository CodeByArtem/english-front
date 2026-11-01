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
import styles from './lesson8b.module.scss';

export interface Lesson8BContentProps {
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

export const FALLBACK_ANSWER_KEY_8B: LessonAnswerKey = {
  exercise_1a_mood: {
    day_type: ['a bad day', 'bad day', 'bad', 'A bad day'],
  },
  exercise_1b_order: {
    '1': ['C', 'c'],
    '2': ['A', 'a', 'B', 'b'],
    '3': ['B', 'b', 'A', 'a'],
    '4': ['F', 'f', 'J', 'j'],
    '5': ['J', 'j', 'F', 'f', 'G', 'g'],
    '6': ['G', 'g', 'H', 'h'],
    '7': ['H', 'h', 'E', 'e'],
    '8': ['E', 'e', 'K', 'k'],
    '9': ['K', 'k', 'L', 'l'],
    '10': ['L', 'l', 'I', 'i'],
    '11': ['I', 'i', 'D', 'd'],
    '12': ['D', 'd'],
  },
  exercise_2a_matching: {
    break: ['broke', 'Broke'],
    take: ['took', 'Took'],
    buy: ['bought', 'Bought'],
    meet: ['met', 'Met'],
    lose: ['lost', 'Lost'],
    feel: ['felt', 'Felt'],
    speak: ['spoke', 'Spoke'],
    have: ['had', 'Had'],
    go: ['went', 'Went'],
    run: ['ran', 'Ran'],
    eat: ['ate', 'Ate'],
    forget: ['forgot', 'Forgot'],
    see: ['saw', 'Saw'],
  },
  exercise_2b_sentences: {
    '1': ['saw', 'Saw'],
    '2': ['felt', 'Felt'],
    '3': ['took', 'Took'],
    '4': ['went', 'Went'],
    '5': ['ate', 'Ate'],
    '6': ['met', 'Met'],
    '7': ['forgot', 'Forgot'],
    '8': ['lost', 'Lost'],
    '9': ['spoke', 'Spoke'],
    '10': ['bought', 'Bought'],
  },
  exercise_3a_carla_photo: {
    match: ['B', 'b', 'Photo B', 'photo b'],
  },
  exercise_3b_carla_actions: {
    '1': ["didn't have time for breakfast", "didn't have breakfast", 'did not have time for breakfast', "didn't have time"],
    '2': ["didn't speak to colleagues", "didn't speak to my colleagues", "didn't speak"],
    '3': ["didn't buy lunch", 'did not buy lunch'],
    '4': ["didn't eat anything", 'did not eat anything'],
    '5': ['worked', 'worked and worked and worked', 'Worked'],
    '6': ["didn't walk home", 'did not walk home'],
    '7': ['took the train', 'Took the train'],
    '8': ['ate chips', 'Ate chips'],
    '9': ['watched TV', 'Watched TV'],
    '10': ["forgot mum's birthday", "forgot her mum's birthday", 'forgot mums birthday', "didn't remember mum's birthday"],
  },
  exercise_4_grammar: {
    '1': ['-ed', 'ed'],
    '2': ["didn't", 'did not', 'didnt'],
  },
  exercise_5a_pronunciation: {
    silent_letter: ['t', 'T', 'the letter t', 'letter t'],
  },
  exercise_6_text_completion: {
    '2': ['had', 'Had'],
    '3': ['felt', 'Felt'],
    '4': ['met', 'Met'],
    '5': ['went', 'Went'],
    '6': ['ran', 'Ran'],
    '7': ['had', 'Had'],
    '8': ['spoke', 'Spoke'],
    '9': ["didn't take", 'did not take', 'didnt take'],
    '10': ["didn't go", 'did not go', 'didnt go'],
    '11': ["didn't see", 'did not see', 'didnt see'],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const COMIC_PANELS = [
  { key: 'A', name: 'Panel A', src: '/images/lesson8b/comic_a_taxi.png', caption: 'I took a taxi to work. It was expensive.' },
  { key: 'B', name: 'Panel B', src: '/images/lesson8b/comic_b_run.png', caption: 'I arrived at work. I was late for a meeting with my boss. I ran!' },
  { key: 'C', name: 'Panel C', src: '/images/lesson8b/comic_c_wake.png', caption: 'Yesterday, I got up at eight. I was late for work!' },
  { key: 'D', name: 'Panel D', src: '/images/lesson8b/comic_d_cinema.png', caption: 'After work I met my friend at the cinema but it was closed. I had a bad, bad day!' },
  { key: 'E', name: 'Panel E', src: '/images/lesson8b/comic_e_sandwich.png', caption: 'I ate the sandwich at my desk. It was really bad.' },
  { key: 'F', name: 'Panel F', src: '/images/lesson8b/comic_f_meeting.png', caption: 'and I forgot an important meeting.' },
  { key: 'G', name: 'Panel G', src: '/images/lesson8b/comic_g_restaurant.png', caption: 'I went to a restaurant for lunch, but I saw lots of people there.' },
  { key: 'H', name: 'Panel H', src: '/images/lesson8b/comic_h_buy.png', caption: "I didn't have lunch at the restaurant. I bought a sandwich." },
  { key: 'I', name: 'Panel I', src: '/images/lesson8b/comic_i_boss_unhappy.png', caption: "He wasn't happy. I felt bad." },
  { key: 'J', name: 'Panel J', src: '/images/lesson8b/comic_j_computer_broke.png', caption: '... my computer broke ...' },
  { key: 'K', name: 'Panel K', src: '/images/lesson8b/comic_k_lost_phone.png', caption: 'In the afternoon, there were more bad things: I lost my phone,' },
  { key: 'L', name: 'Panel L', src: '/images/lesson8b/comic_l_spoke_boss.png', caption: 'My boss spoke to me about my work.' },
];

export default function Lesson8BContent(props: Lesson8BContentProps) {
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
    FALLBACK_ANSWER_KEY_8B;

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

  const panelOptions = COMIC_PANELS.map((p) => ({
    value: p.key,
    label: `${p.key} (${p.caption.slice(0, 24)}...)`,
  }));

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Banner Header 8B */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge8B}>
              <span>8</span>
              <span className={styles.letterB}>B</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>You had a bad day</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: talk about a bad day</span>
                <span className={styles.pillGoal}>Grammar: past simple (irregular verbs)</span>
                <span className={styles.pillGoal}>Vocabulary: irregular verbs</span>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.pageBody}>
          {/* ============================================================== */}
          {/* SECTION 1: VOCABULARY & READING: COMIC STORY                   */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Vocabulary & Reading</span>
              <h2 className={styles.sectionTitle}>A Really Bad Day (Panels A–L)</h2>
            </div>

            {/* Exercise 1a: Good Day or Bad Day */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Look at the pictures. Are they about a good day or a bad day?</h3>
                </div>
              </div>

              <div className={styles.sentenceItem}>
                <span>These pictures are about:</span>
                {renderSelect('exercise_1a_mood', 'day_type', [
                  { value: 'a good day', label: 'a good day' },
                  { value: 'a bad day', label: 'a bad day' },
                ])}
              </div>
            </div>

            {/* Exercise 1b: Comic Gallery & Chronological Ordering */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1b</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Look at the pictures again and read the captions. Put the pictures in the correct order (1–12).
                  </h3>
                  <p className={styles.exerciseInstruction}>
                    Panel C is number 1: <em>&ldquo;Yesterday, I got up at eight. I was late for work!&rdquo;</em>
                  </p>
                </div>
              </div>

              {/* Gallery of 12 Comic Panels */}
              <div className={styles.comicGalleryGrid}>
                {COMIC_PANELS.map((panel) => (
                  <div key={panel.key} className={styles.comicCard}>
                    <div className={styles.comicImageWrapper}>
                      <Image
                        src={panel.src}
                        alt={`Comic panel ${panel.key}: ${panel.caption}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 220px"
                      />
                    </div>
                    <div className={styles.comicOrderBar}>
                      <span className={styles.comicLetterBadge}>{panel.key}</span>
                      <span className={styles.comicOrderLabel}>{panel.caption}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order selector 1–12 */}
              <div className={styles.tableResponsive}>
                <table className={styles.interactiveTable}>
                  <thead>
                    <tr>
                      <th>Order Step</th>
                      <th>Panel Selection (A–L)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1 (First)</td>
                      <td>
                        <strong>Panel C</strong> (Yesterday, I got up at eight...)
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>{renderSelect('exercise_1b_order', '2', panelOptions)}</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>{renderSelect('exercise_1b_order', '3', panelOptions)}</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>{renderSelect('exercise_1b_order', '4', panelOptions)}</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>{renderSelect('exercise_1b_order', '5', panelOptions)}</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>{renderSelect('exercise_1b_order', '6', panelOptions)}</td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td>{renderSelect('exercise_1b_order', '7', panelOptions)}</td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>{renderSelect('exercise_1b_order', '8', panelOptions)}</td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td>{renderSelect('exercise_1b_order', '9', panelOptions)}</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>{renderSelect('exercise_1b_order', '10', panelOptions)}</td>
                    </tr>
                    <tr>
                      <td>11</td>
                      <td>{renderSelect('exercise_1b_order', '11', panelOptions)}</td>
                    </tr>
                    <tr>
                      <td>12 (Last)</td>
                      <td>{renderSelect('exercise_1b_order', '12', panelOptions)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exercise 1c & 2a: Audio 8.5 & Verbs Matching */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1c</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Listen and repeat the irregular verbs</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '8.5' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('8.5')}
                      aria-label="Play Audio 8.5"
                    >
                      {playingAudio === '8.5' ? '⏸ Playing 8.5' : '▶ Audio 8.5'}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.wordBankBox}>
                <span className={styles.wordBankTitle}>Irregular Past Forms:</span>
                <span className={styles.wordChip}>ate</span>
                <span className={styles.wordChip}>bought</span>
                <span className={styles.wordChip}>broke</span>
                <span className={styles.wordChip}>felt</span>
                <span className={styles.wordChip}>forgot</span>
                <span className={styles.wordChip}>got up</span>
                <span className={styles.wordChip}>had</span>
                <span className={styles.wordChip}>lost</span>
                <span className={styles.wordChip}>met</span>
                <span className={styles.wordChip}>ran</span>
                <span className={styles.wordChip}>saw</span>
                <span className={styles.wordChip}>spoke</span>
                <span className={styles.wordChip}>took</span>
                <span className={styles.wordChip}>went</span>
              </div>
            </div>

            {/* Exercise 2a: Match Infinitives 1–14 with Past Forms */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Match infinitives 1–14 with the past simple verbs in bold in the captions
                  </h3>
                </div>
              </div>

              <div className={styles.tableResponsive}>
                <table className={styles.interactiveTable}>
                  <thead>
                    <tr>
                      <th>Infinitive (Base Form)</th>
                      <th>Past Simple Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1 get up</td>
                      <td><strong>got up</strong> (example)</td>
                    </tr>
                    <tr>
                      <td>2 break</td>
                      <td>{renderInput('exercise_2a_matching', 'break', 'past form...')}</td>
                    </tr>
                    <tr>
                      <td>3 take</td>
                      <td>{renderInput('exercise_2a_matching', 'take', 'past form...')}</td>
                    </tr>
                    <tr>
                      <td>4 buy</td>
                      <td>{renderInput('exercise_2a_matching', 'buy', 'past form...')}</td>
                    </tr>
                    <tr>
                      <td>5 meet</td>
                      <td>{renderInput('exercise_2a_matching', 'meet', 'past form...')}</td>
                    </tr>
                    <tr>
                      <td>6 lose</td>
                      <td>{renderInput('exercise_2a_matching', 'lose', 'past form...')}</td>
                    </tr>
                    <tr>
                      <td>7 feel</td>
                      <td>{renderInput('exercise_2a_matching', 'feel', 'past form...')}</td>
                    </tr>
                    <tr>
                      <td>8 speak</td>
                      <td>{renderInput('exercise_2a_matching', 'speak', 'past form...')}</td>
                    </tr>
                    <tr>
                      <td>9 have</td>
                      <td>{renderInput('exercise_2a_matching', 'have', 'past form...')}</td>
                    </tr>
                    <tr>
                      <td>10 go</td>
                      <td>{renderInput('exercise_2a_matching', 'go', 'past form...')}</td>
                    </tr>
                    <tr>
                      <td>11 run</td>
                      <td>{renderInput('exercise_2a_matching', 'run', 'past form...')}</td>
                    </tr>
                    <tr>
                      <td>12 eat</td>
                      <td>{renderInput('exercise_2a_matching', 'eat', 'past form...')}</td>
                    </tr>
                    <tr>
                      <td>13 forget</td>
                      <td>{renderInput('exercise_2a_matching', 'forget', 'past form...')}</td>
                    </tr>
                    <tr>
                      <td>14 see</td>
                      <td>{renderInput('exercise_2a_matching', 'see', 'past form...')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exercise 2b: Complete Sentences with Past Forms */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2b</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Complete the sentences with verbs from Exercise 1c</h3>
                </div>
              </div>

              <div className={styles.sentencesList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>1</span>
                  <span>I</span>
                  {renderInput('exercise_2b_sentences', '1', 'verb...')}
                  <span>an advert for one online.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>2</span>
                  <span>I</span>
                  {renderInput('exercise_2b_sentences', '2', 'verb...')}
                  <span>really bad because I was late.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>3</span>
                  <span>We</span>
                  {renderInput('exercise_2b_sentences', '3', 'verb...')}
                  <span>the train back home in the evening.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>4</span>
                  <span>She</span>
                  {renderInput('exercise_2b_sentences', '4', 'verb...')}
                  <span>to Tokyo last summer.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>5</span>
                  <span>You</span>
                  {renderInput('exercise_2b_sentences', '5', 'verb...')}
                  <span>a lot of food at the party!</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>6</span>
                  <span>I</span>
                  {renderInput('exercise_2b_sentences', '6', 'verb...')}
                  <span>my wife at a work party.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>7</span>
                  <span>I</span>
                  {renderInput('exercise_2b_sentences', '7', 'verb...')}
                  <span>my dad&apos;s birthday again!</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>8</span>
                  <span>I</span>
                  {renderInput('exercise_2b_sentences', '8', 'verb...')}
                  <span>my keys on the way to work.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>9</span>
                  <span>She</span>
                  {renderInput('exercise_2b_sentences', '9', 'verb...')}
                  <span>to her teacher about it yesterday.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>10</span>
                  <span>He</span>
                  {renderInput('exercise_2b_sentences', '10', 'verb...')}
                  <span>me a cup of coffee from the café next door.</span>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 2: READING: CARLA'S DAY                                */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Reading</span>
              <h2 className={styles.sectionTitle}>Carla&apos;s Day</h2>
            </div>

            <div className={styles.carlaDayLayout}>
              {/* Photos A, B, C */}
              <div className={styles.carlaPhotosCol}>
                <div className={styles.carlaPhotoCard}>
                  <Image
                    src="/images/lesson8b/carla_a_car.png"
                    alt="Carla photo A: car broken down"
                    fill
                    sizes="240px"
                  />
                  <span className={styles.carlaPhotoBadge}>A</span>
                </div>

                <div className={styles.carlaPhotoCard}>
                  <Image
                    src="/images/lesson8b/carla_b_office.png"
                    alt="Carla photo B: office headache"
                    fill
                    sizes="240px"
                  />
                  <span className={styles.carlaPhotoBadge}>B</span>
                </div>

                <div className={styles.carlaPhotoCard}>
                  <Image
                    src="/images/lesson8b/carla_c_bag.png"
                    alt="Carla photo C: searching through bag"
                    fill
                    sizes="240px"
                  />
                  <span className={styles.carlaPhotoBadge}>C</span>
                </div>
              </div>

              {/* Story text */}
              <div className={styles.carlaTextBox}>
                <p>
                  &ldquo;Yesterday I was busy. I didn&apos;t have time for breakfast. I didn&apos;t speak to my
                  colleagues about football or the weekend. I didn&apos;t buy lunch. I didn&apos;t eat anything! I
                  worked and worked and worked.
                </p>
                <p>
                  I usually walk home from work, but yesterday I felt very tired and I took the train. I arrived home.
                  It was nine o&apos;clock. I ate chips and I watched TV. The really bad thing? I forgot my mum&apos;s
                  birthday.&rdquo;
                </p>
              </div>
            </div>

            {/* Exercise 3a: Match text to photo */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>3a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Read the text about Carla&apos;s day and match with the correct photo, A–C.
                  </h3>
                </div>
              </div>

              <div className={styles.sentenceItem}>
                <span>Carla&apos;s day text matches:</span>
                {renderSelect('exercise_3a_carla_photo', 'match', [
                  { value: 'A', label: 'Photo A (car breakdown)' },
                  { value: 'B', label: 'Photo B (tired at office laptop)' },
                  { value: 'C', label: 'Photo C (searching handbag)' },
                ])}
              </div>
            </div>

            {/* Exercise 3b: Which things did Carla do? Which didn't she do? */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>3b</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Which things did Carla do? Which things didn&apos;t she do?</h3>
                  <p className={styles.exerciseInstruction}>
                    Examples: <em>She worked.</em> / <em>She didn&apos;t have time for breakfast.</em>
                  </p>
                </div>
              </div>

              <div className={styles.sentencesList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>1</span>
                  <span>have time for breakfast &rarr; She</span>
                  {renderInput('exercise_3b_carla_actions', '1', "didn't have time...")}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>2</span>
                  <span>speak to colleagues &rarr; She</span>
                  {renderInput('exercise_3b_carla_actions', '2', "didn't speak...")}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>3</span>
                  <span>buy lunch &rarr; She</span>
                  {renderInput('exercise_3b_carla_actions', '3', "didn't buy...")}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>4</span>
                  <span>eat anything &rarr; She</span>
                  {renderInput('exercise_3b_carla_actions', '4', "didn't eat...")}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>5</span>
                  <span>work all day &rarr; She</span>
                  {renderInput('exercise_3b_carla_actions', '5', 'worked...')}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>6</span>
                  <span>walk home &rarr; She</span>
                  {renderInput('exercise_3b_carla_actions', '6', "didn't walk...")}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>7</span>
                  <span>take the train &rarr; She</span>
                  {renderInput('exercise_3b_carla_actions', '7', 'took the train...')}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>8</span>
                  <span>eat chips &rarr; She</span>
                  {renderInput('exercise_3b_carla_actions', '8', 'ate chips...')}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>9</span>
                  <span>watch TV &rarr; She</span>
                  {renderInput('exercise_3b_carla_actions', '9', 'watched TV...')}
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>10</span>
                  <span>remember mum&apos;s birthday &rarr; She</span>
                  {renderInput('exercise_3b_carla_actions', '10', "forgot mum's birthday...")}
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 3: GRAMMAR: PAST SIMPLE (IRREGULAR VERBS)             */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Grammar</span>
              <h2 className={styles.sectionTitle}>Past Simple (Irregular Verbs) & Negatives</h2>
            </div>

            {/* Exercise 4: Grammar Rules Alternatives */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>4</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>
                    Read the grammar box and choose the correct alternatives
                  </h3>
                </div>
              </div>

              <div className={styles.grammarRuleBox}>
                <h4 className={styles.grammarRuleTitle}>Past simple (irregular verbs)</h4>
                <div className={styles.sentencesList}>
                  <div className={styles.sentenceItem}>
                    <span>1 Regular past simple verbs usually end in:</span>
                    {renderSelect('exercise_4_grammar', '1', [
                      { value: '-ed', label: '-ed (e.g. watched, walked)' },
                      { value: '-ing', label: '-ing' },
                    ])}
                  </div>
                  <div className={styles.sentenceItem}>
                    <span>Irregular past simple verbs have different forms: <em>feel &rarr; felt, go &rarr; went, lose &rarr; lost</em>.</span>
                  </div>
                  <div className={styles.sentenceItem}>
                    <span>2 The negative of past simple verbs is:</span>
                    {renderSelect('exercise_4_grammar', '2', [
                      { value: "didn't", label: "didn't + base verb (didn't go)" },
                      { value: "don't", label: "don't + base verb" },
                    ])}
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 5a, 5b: Audio 8.6 Silent /t/ */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>5</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Pronunciation: The silent sound in didn&apos;t</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '8.6' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('8.6')}
                      aria-label="Play Audio 8.6"
                    >
                      {playingAudio === '8.6' ? '⏸ Playing 8.6' : '▶ Audio 8.6'}
                    </button>
                  </div>
                  <p className={styles.exerciseInstruction}>
                    Listen to Audio 8.6. Notice: <em>1 I didn&apos;t buy lunch.</em> / <em>2 I didn&apos;t take the train.</em> /{' '}
                    <em>3 I didn&apos;t go to work today.</em> / <em>4 I didn&apos;t feel good.</em>
                  </p>
                </div>
              </div>

              <div className={styles.sentenceItem}>
                <span>Which letter in <strong>didn&apos;t</strong> is not pronounced?</span>
                {renderInput('exercise_5a_pronunciation', 'silent_letter', 'letter...')}
              </div>
            </div>

            {/* Exercise 6: Audio 8.7 Complete the text */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>6</span>
                <div className={styles.exerciseTitleArea}>
                  <div className={styles.exerciseTitleRow}>
                    <h3 className={styles.exerciseTitle}>Complete the text with the correct form of the verbs</h3>
                    <button
                      type="button"
                      className={`${styles.audioBtn} ${playingAudio === '8.7' ? styles.audioPlaying : ''}`}
                      onClick={() => playAudio?.('8.7')}
                      aria-label="Play Audio 8.7"
                    >
                      {playingAudio === '8.7' ? '⏸ Playing 8.7' : '▶ Audio 8.7'}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.sentencesList}>
                <div className={styles.sentenceItem}>
                  I <strong>didn&apos;t get up</strong> (1 not get up) at 7 o&apos;clock today. I stayed in bed. I{' '}
                  {renderInput('exercise_6_text_completion', '2', 'verb...')} (2 have) a cup of coffee and I{' '}
                  {renderInput('exercise_6_text_completion', '3', 'verb...')} (3 feel) really good. I left my house at 12
                  o&apos;clock and {renderInput('exercise_6_text_completion', '4', 'verb...')} (4 meet) a friend. We{' '}
                  {renderInput('exercise_6_text_completion', '5', 'verb...')} (5 go) to the park and we{' '}
                  {renderInput('exercise_6_text_completion', '6', 'verb...')} (6 run) for half an hour. Then we{' '}
                  {renderInput('exercise_6_text_completion', '7', 'verb...')} (7 have) lunch and we{' '}
                  {renderInput('exercise_6_text_completion', '8', 'verb...')} (8 speak) about our holidays. I{' '}
                  {renderInput('exercise_6_text_completion', '9', 'verb...')} (9 not take) the bus. I{' '}
                  {renderInput('exercise_6_text_completion', '10', 'verb...')} (10 not go) to work. I{' '}
                  {renderInput('exercise_6_text_completion', '11', 'verb...')} (11 not see) my boss. It was a nice
                  Saturday!
                </div>
              </div>
            </div>

            {/* Exercise 7a: True for you sentences */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>7a</span>
                <div className={styles.exerciseTitleArea}>
                  <h3 className={styles.exerciseTitle}>Complete the sentences so they are true for you</h3>
                </div>
              </div>

              <div className={styles.sentencesList}>
                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>1</span>
                  {renderInput('exercise_7a_true', 'sent_1', 'What you did / didn’t do...', { fullWidth: true })}
                  <span>yesterday.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>2</span>
                  {renderInput('exercise_7a_true', 'sent_2', 'What you did / didn’t do...', { fullWidth: true })}
                  <span>last night.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>3</span>
                  {renderInput('exercise_7a_true', 'sent_3', 'What you did / didn’t do...', { fullWidth: true })}
                  <span>last week.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>4</span>
                  {renderInput('exercise_7a_true', 'sent_4', 'What you did / didn’t do...', { fullWidth: true })}
                  <span>last Saturday.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>5</span>
                  {renderInput('exercise_7a_true', 'sent_5', 'What you did / didn’t do...', { fullWidth: true })}
                  <span>last month.</span>
                </div>

                <div className={styles.sentenceItem}>
                  <span className={styles.sentenceNum}>6</span>
                  {renderInput('exercise_7a_true', 'sent_6', 'What you did / didn’t do...', { fullWidth: true })}
                  <span>last year.</span>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 4: SPEAKING: PREPARE & SPEAK                           */}
          {/* ============================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeaderRow}>
              <span className={styles.sectionBadge}>Speaking</span>
              <h2 className={styles.sectionTitle}>A Bad Day Story</h2>
            </div>

            <div className={styles.speakingLayout}>
              {/* Exercise 8: PREPARE */}
              <div className={styles.exerciseSection}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exerciseNum}>8</span>
                  <div className={styles.exerciseTitleArea}>
                    <h3 className={styles.exerciseTitle}>
                      PREPARE: Think of a bad day you had. Make notes in the table.
                    </h3>
                  </div>
                </div>

                <div className={styles.tableResponsive}>
                  <table className={styles.interactiveTable}>
                    <tbody>
                      <tr>
                        <td><strong>When?</strong></td>
                        <td>{renderInput('exercise_8_notes', 'when', 'e.g. last Monday, two weeks ago...', { fullWidth: true })}</td>
                      </tr>
                      <tr>
                        <td><strong>Where?</strong></td>
                        <td>{renderInput('exercise_8_notes', 'where', 'e.g. at work, on the train, at home...', { fullWidth: true })}</td>
                      </tr>
                      <tr>
                        <td><strong>What?</strong></td>
                        <td>{renderInput('exercise_8_notes', 'what', 'e.g. I got up late, lost keys, missed meeting...', { fullWidth: true })}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Exercise 9: SPEAK & AudioAnswerRecorder */}
              <div className={styles.exerciseSection}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exerciseNum}>9</span>
                  <div className={styles.exerciseTitleArea}>
                    <h3 className={styles.exerciseTitle}>SPEAK: Tell your group about your bad day</h3>
                    <p className={styles.exerciseInstruction}>
                      Model: <em>&ldquo;I had a bad day last week. I went to a café with my friend...&rdquo;</em>
                    </p>
                  </div>
                </div>

                {/* Submission Audio Player for tutor */}
                {submissionId && (
                  <div className={styles.feedbackRow}>
                    <SubmissionAudioPlayer
                      submissionId={submissionId}
                      exerciseKey="speaking_8b_bad_day"
                      audios={submittedAudios}
                    />
                  </div>
                )}

                {/* Audio recorder for student */}
                <AudioAnswerRecorder
                  onAudioChange={(blob, mime) =>
                    onAudioBlobChange?.(blob, mime, 'speaking_8b_bad_day')
                  }
                  readOnly={readOnly}
                />

                {/* Develop your writing badge */}
                <div className={styles.badgeDevelopWrapper}>
                  <Image
                    src="/images/lesson8b/badge_develop_writing.png"
                    alt="Develop your writing page 108"
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
