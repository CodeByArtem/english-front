'use client';

import React from 'react';
import Image from 'next/image';
import { useLessonContext, LessonContextModel } from '@/context/LessonContext';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import PronounceButton from '@/components/PronounceButton';
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
import styles from './lesson6b.module.scss';

export interface Lesson6BContentProps {
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

export const FALLBACK_ANSWER_KEY_6B: LessonAnswerKey = {
  exercise_1a_matching: {
    '1': ['C', 'c', 'Picture C', 'Photo C'],
    '2': ['A', 'a', 'Picture A', 'Photo A'],
    '3': ['D', 'd', 'Picture D', 'Photo D'],
    '4': ['H', 'h', 'Picture H', 'Photo H'],
    '5': ['B', 'b', 'Picture B', 'Photo B'],
    '6': ['F', 'f', 'Picture F', 'Photo F'],
    '7': ['G', 'g', 'Picture G', 'Photo G'],
    '8': ['E', 'e', 'Picture E', 'Photo E'],
  },
  exercise_3_phrases: {
    '1': ['clean', 'Clean'],
    '2': ['cook', 'Cook'],
    '3': ['feed', 'Feed'],
    '4': ['wash', 'Wash'],
  },
  exercise_4a_listening: {
    cleans_the_bathroom: ['Bella', 'bella'],
    cooks_dinner: ['Bella', 'bella'],
    washes_the_dishes: ['Bella', 'bella'],
    does_the_washing: ['Albert', 'albert'],
    walks_the_dog: ['Albert', 'albert'],
  },
  exercise_4b_questions: {
    '1': ['Do', 'do'],
    '2': ['does', 'Does'],
    '3': ['does', 'Does'],
    '4': ['does', 'Does'],
    '5': ['do', 'Do'],
  },
  exercise_5_grammar: {
    '1': ['Does', 'does'],
    '2': ['does', 'Does'],
    '3': ["doesn't", 'does not', "doesn’t"],
    '4': ['does', 'Does'],
    '5': ['does', 'Does'],
    '6': ['does', 'Does'],
    '7': ['does', 'Does'],
  },
  exercise_7_dialogue: {
    '1': ['Do', 'do'],
    '2': ['walk'],
    '3': ["don't", 'do not', "don’t"],
    '4': ['walks'],
    '5': ['do', 'Do'],
    '6': ['go'],
    '7': ['Does', 'does'],
    '8': ['run'],
    '9': ['does', 'Does'],
    '10': ['plays'],
    '11': ['does', 'Does'],
    '12': ['have'],
    '13': ['Does', 'does'],
    '14': ['feed'],
    '15': ['does', 'Does'],
  },
  exercise_8a_questions: {
    '1': ['Where does your friend live?', 'Where does your friend live'],
    '2': [
      'Does your friend live in a house or a flat?',
      'Does your friend live in a house or a flat',
    ],
    '3': [
      'Who does your friend live with?',
      'Who does your friend live with',
    ],
    '4': ['Where does your friend work?', 'Where does your friend work'],
    '5': ['Does your friend have a dog?', 'Does your friend have a dog'],
    '6': [
      'How often do you talk to your friend?',
      'How often do you talk to your friend',
    ],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const CHORES_PICTURES_6B = [
  { id: 'A', src: '/images/lesson6b/chore_a_cook.png', caption: 'Cook dinner' },
  { id: 'B', src: '/images/lesson6b/chore_b_bed.png', caption: 'Make the beds' },
  { id: 'C', src: '/images/lesson6b/chore_c_bathroom.png', caption: 'Clean the bathroom' },
  { id: 'D', src: '/images/lesson6b/chore_d_feed_dog.png', caption: 'Feed the dog' },
  { id: 'E', src: '/images/lesson6b/chore_e_dishes.png', caption: 'Wash the dishes' },
  { id: 'F', src: '/images/lesson6b/chore_f_walk_dog.png', caption: 'Walk the dog' },
  { id: 'G', src: '/images/lesson6b/chore_g_washing.png', caption: 'Do the washing' },
  { id: 'H', src: '/images/lesson6b/chore_h_supermarket.png', caption: 'Go to the supermarket' },
];

const CHORE_PHRASES_6B = [
  { num: '1', phrase: 'clean the bathroom' },
  { num: '2', phrase: 'cook dinner' },
  { num: '3', phrase: 'feed the dog' },
  { num: '4', phrase: 'go to the supermarket' },
  { num: '5', phrase: 'make the beds' },
  { num: '6', phrase: 'walk the dog' },
  { num: '7', phrase: 'do the washing' },
  { num: '8', phrase: 'wash the dishes' },
];

const CHARACTER_AVATARS_6B = [
  { name: 'Thomas', src: '/images/lesson6b/avatar_thomas.png', chores: 'cleans the bathroom (C) and washes the dishes (E)' },
  { name: 'Masaru', src: '/images/lesson6b/avatar_masaru.png', chores: 'cooks dinner (A) and goes to the supermarket (H)' },
  { name: 'Isabella', src: '/images/lesson6b/avatar_isabella.png', chores: 'makes the beds (B) and does the washing (G)' },
  { name: 'Milada', src: '/images/lesson6b/avatar_milada.png', chores: 'feeds the dog (D) and walks the dog (F)' },
];

const LISTENING_CHORES_6B = [
  { key: 'cleans_the_bathroom', title: 'cleans the bathroom' },
  { key: 'cooks_dinner', title: 'cooks dinner' },
  { key: 'washes_the_dishes', title: 'washes the dishes' },
  { key: 'does_the_washing', title: 'does the washing' },
  { key: 'walks_the_dog', title: 'walks the dog' },
];

export default function Lesson6BContent(props: Lesson6BContentProps) {
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
    FALLBACK_ANSWER_KEY_6B;

  const isReview = Boolean(isTeacherReview || (activeAnswerKey && readOnly));
  const answers = propOriginalAnswers ?? context?.answers ?? {};

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
            className={`${styles.selectInput} ${options?.customClass || ''} ${
              diff ? styles.diffHighlight : ''
            } ${
              v?.status === 'correct'
                ? styles.inputValid
                : v?.status === 'incorrect'
                ? styles.inputInvalid
                : ''
            }`}
          >
            <option value="">-- Choose --</option>
            {optionsList.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
        </div>
        {v && v.status !== 'correct' && (
          <div className={styles.feedbackRow}>
            <TeacherAnswerBadge result={v} />
          </div>
        )}
      </div>
    );
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
            className={`${styles.textInput} ${options?.customClass || ''} ${
              diff ? styles.diffHighlight : ''
            } ${
              v?.status === 'correct'
                ? styles.inputValid
                : v?.status === 'incorrect'
                ? styles.inputInvalid
                : ''
            }`}
          />
          {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
        </div>
        {v && v.status !== 'correct' && (
          <div className={styles.feedbackRow}>
            <TeacherAnswerBadge result={v} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <article className={styles.textbookPage}>
        {/* Header Banner 6B */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge6B}>
              6<span className={styles.letterB}>B</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>Jobs around the house</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: ask and answer about things people often do</span>
                <span className={styles.pillGoal}>Grammar: present simple questions: he / she / it</span>
                <span className={styles.pillGoal}>Vocabulary: jobs around the house</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.contentBody}>
          {/* ==================================================== */}
          {/* SECTION 1: VOCABULARY */}
          {/* ==================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Vocabulary: Jobs around the house</h2>
              <button
                type="button"
                className={`${styles.audioBtn} ${playingAudio === '6.4' ? styles.audioPlaying : ''}`}
                onClick={() => playAudio?.('6.4')}
                aria-label="Play Audio 6.4"
              >
                {playingAudio === '6.4' ? '⏸ Playing 6.4' : '▶ Audio 6.4'}
              </button>
            </div>

            {/* Top Atmospheric Photos */}
            <div className={styles.topPhotosGrid}>
              <div className={styles.topPhotoCard}>
                <div className={styles.topPhotoWrapper}>
                  <Image
                    src="/images/lesson6b/photo_family_meal.png"
                    alt="Family meal with children eating"
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.topPhotoCaption}>Family meal &amp; caring for children</div>
              </div>

              <div className={styles.topPhotoCard}>
                <div className={styles.topPhotoWrapper}>
                  <Image
                    src="/images/lesson6b/photo_cooking_prep.png"
                    alt="Cooking dinner and preparing fresh fish"
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.topPhotoCaption}>Cooking dinner &amp; food preparation</div>
              </div>
            </div>

            {/* Exercise 1a: Gallery of Pictures A-H */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>1a. Match pictures A–H with phrases 1–8</h3>
                <p className={styles.exerciseInstruction}>Look at the illustrations and match the chore phrase with the correct picture letter.</p>
              </div>

              <div className={styles.choresGrid}>
                {CHORES_PICTURES_6B.map((pic) => (
                  <div key={pic.id} className={styles.choreCard}>
                    <div className={styles.choreImageWrapper}>
                      <span className={styles.choreBadge}>{pic.id}</span>
                      <Image
                        src={pic.src}
                        alt={`Picture ${pic.id}: ${pic.caption}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.choreCaption}>{pic.caption}</div>
                  </div>
                ))}
              </div>

              {/* Matching phrases list */}
              <div className={styles.matchingList}>
                {CHORE_PHRASES_6B.map((item) => (
                  <div key={item.num} className={styles.matchingRow}>
                    <div className={styles.matchingLeft}>
                      <span className={styles.numBadge}>{item.num}</span>
                      <span className={styles.matchingSentence}>{item.phrase}</span>
                    </div>
                    <div className={styles.matchingSelectArea}>
                      {renderSelect(
                        'exercise_1a_matching',
                        item.num,
                        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((letter) => ({
                          value: letter,
                          label: `Picture ${letter}`,
                        }))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 1b: Audio and Repeat */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>1b. Listen and repeat the phrases</h3>
                <button
                  type="button"
                  className={`${styles.audioBtn} ${playingAudio === '6.4' ? styles.audioPlaying : ''}`}
                  onClick={() => playAudio?.('6.4')}
                  aria-label="Play Audio 6.4"
                >
                  {playingAudio === '6.4' ? '⏸ Playing 6.4' : '▶ Audio 6.4'}
                </button>
              </div>
              <p className={styles.exerciseInstruction}>Listen and practice pronouncing each household job:</p>
              <div className={styles.wordBankBox}>
                {CHORE_PHRASES_6B.map((item) => (
                  <div key={item.phrase} className={styles.wordBankItem}>
                    <span>{item.phrase}</span>
                    <PronounceButton word={item.phrase} size="small" />
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 2: Character Chores Sentences */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>2. Look at the pictures again. What does each person do?</h3>
                <p className={styles.exerciseInstruction}>
                  Make sentences about the jobs each person does around the house. Example: <em>Thomas cleans the bathroom and washes the dishes.</em>
                </p>
              </div>

              <div className={styles.avatarsRow}>
                {CHARACTER_AVATARS_6B.map((char) => (
                  <div key={char.name} className={styles.avatarCard}>
                    <div className={styles.avatarImageWrapper}>
                      <Image
                        src={char.src}
                        alt={char.name}
                        fill
                        sizes="56px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <span className={styles.avatarName}>{char.name}</span>
                    <span className={styles.avatarChoresText}>{char.chores}</span>
                  </div>
                ))}
              </div>

              <div className={styles.gapFillList}>
                {CHARACTER_AVATARS_6B.map((char) => (
                  <div key={char.name} className={styles.gapFillRow}>
                    <div className={styles.gapFillSentence}>
                      <strong>{char.name}:</strong>
                    </div>
                    {renderInput(
                      'exercise_2_characters',
                      char.name.toLowerCase(),
                      '',
                      { fullWidth: true }
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 3: Complete the phrases */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>3. Complete the phrases. Use verbs from Exercise 1a</h3>
                <p className={styles.exerciseInstruction}>Use <em>clean, cook, feed, wash</em> to complete the collocations.</p>
              </div>

              {/* Photos for Exercise 3 */}
              <div className={styles.topPhotosGrid}>
                <div className={styles.topPhotoCard}>
                  <div className={styles.topPhotoWrapper}>
                    <Image
                      src="/images/lesson6b/photo_car_wash.png"
                      alt="Washing the car"
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.topPhotoCaption}>... the car</div>
                </div>

                <div className={styles.topPhotoCard}>
                  <div className={styles.topPhotoWrapper}>
                    <Image
                      src="/images/lesson6b/photo_window_cleaning.png"
                      alt="Cleaning the windows"
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.topPhotoCaption}>... the house / the windows</div>
                </div>
              </div>

              <div className={styles.gapFillList}>
                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>1.</span>
                    {renderInput('exercise_3_phrases', '1', '', { customClass: styles.inlineInput })}
                    <span>the bath / the toilet / the house</span>
                  </div>
                </div>

                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>2.</span>
                    {renderInput('exercise_3_phrases', '2', '', { customClass: styles.inlineInput })}
                    <span>chicken / fish</span>
                  </div>
                </div>

                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>3.</span>
                    {renderInput('exercise_3_phrases', '3', '', { customClass: styles.inlineInput })}
                    <span>the children</span>
                  </div>
                </div>

                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>4.</span>
                    {renderInput('exercise_3_phrases', '4', '', { customClass: styles.inlineInput })}
                    <span>the car / the cups</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================== */}
          {/* SECTION 2: LISTENING */}
          {/* ==================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Listening: Albert and Bella</h2>
              <button
                type="button"
                className={`${styles.audioBtn} ${playingAudio === '6.5' ? styles.audioPlaying : ''}`}
                onClick={() => playAudio?.('6.5')}
                aria-label="Play Audio 6.5"
              >
                {playingAudio === '6.5' ? '⏸ Playing 6.5' : '▶ Audio 6.5'}
              </button>
            </div>

            {/* Exercise 4a: Listening Table */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>4a. Listen to the conversation. Who does the jobs around the house?</h3>
                <p className={styles.exerciseInstruction}>Tick Albert or Bella for each household job.</p>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.listeningTable}>
                  <thead>
                    <tr>
                      <th>Job around the house</th>
                      <th>Albert</th>
                      <th>Bella</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LISTENING_CHORES_6B.map((c) => {
                      const currVal = (getRecord(answers['exercise_4a_listening']))[c.key] || '';
                      const v = verify('exercise_4a_listening', c.key, currVal);
                      return (
                        <tr key={c.key}>
                          <td>{c.title}</td>
                          <td>
                            <label className={styles.tableRadioLabel}>
                              <input
                                type="radio"
                                name={`chore_${c.key}`}
                                value="Albert"
                                checked={currVal === 'Albert'}
                                onChange={() => handleFieldChange('exercise_4a_listening', c.key, 'Albert')}
                                disabled={readOnly}
                              />
                              <span>Albert</span>
                            </label>
                          </td>
                          <td>
                            <label className={styles.tableRadioLabel}>
                              <input
                                type="radio"
                                name={`chore_${c.key}`}
                                value="Bella"
                                checked={currVal === 'Bella'}
                                onChange={() => handleFieldChange('exercise_4a_listening', c.key, 'Bella')}
                                disabled={readOnly}
                              />
                              <span>Bella</span>
                            </label>
                            {v?.status === 'correct' && <span className={styles.correctBadge}>✓</span>}
                            {v && v.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={v} />
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exercise 4b: Listen again and complete questions */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>4b. Listen again and complete the questions</h3>
                <p className={styles.exerciseInstruction}>Fill in the auxiliary verb <em>Do</em> or <em>does</em>.</p>
              </div>

              <div className={styles.gapFillList}>
                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>1.</span>
                    {renderInput('exercise_4b_questions', '1', '', { customClass: styles.inlineInput })}
                    <span>you live with your family, Bella?</span>
                  </div>
                </div>

                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>2. Well,</span>
                    {renderInput('exercise_4b_questions', '2', '', { customClass: styles.inlineInput })}
                    <span>he cook dinner?</span>
                  </div>
                </div>

                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>3. OK, but</span>
                    {renderInput('exercise_4b_questions', '3', '', { customClass: styles.inlineInput })}
                    <span>he wash the dishes?</span>
                  </div>
                </div>

                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>4. What</span>
                    {renderInput('exercise_4b_questions', '4', '', { customClass: styles.inlineInput })}
                    <span>Albert do?</span>
                  </div>
                </div>

                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>5. Or</span>
                    {renderInput('exercise_4b_questions', '5', '', { customClass: styles.inlineInput })}
                    <span>you wash his clothes?</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================== */}
          {/* SECTION 3: GRAMMAR */}
          {/* ==================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Grammar: Present simple questions (he / she / it)</h2>
            </div>

            {/* Exercise 5: Grammar Box */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>5. Read and complete the grammar box</h3>
                <p className={styles.exerciseInstruction}>Use Exercise 4b to help you complete the question forms and short answers.</p>
              </div>

              <div className={styles.grammarBox}>
                <h4 className={styles.grammarSubheading}>Yes / No Questions</h4>
                <div className={styles.gapFillList}>
                  <div className={styles.gapFillRow}>
                    <div className={styles.gapFillSentence}>
                      <span><strong>?</strong></span>
                      {renderInput('exercise_5_grammar', '1', '', { customClass: styles.inlineInput })}
                      <span>she <strong>clean</strong> the bathroom?</span>
                    </div>
                  </div>

                  <div className={styles.gapFillRow}>
                    <div className={styles.gapFillSentence}>
                      <span><strong>+</strong> Yes, she</span>
                      {renderInput('exercise_5_grammar', '2', '', { customClass: styles.inlineInput })}
                      <span>.</span>
                    </div>
                  </div>

                  <div className={styles.gapFillRow}>
                    <div className={styles.gapFillSentence}>
                      <span><strong>-</strong> No, she</span>
                      {renderInput('exercise_5_grammar', '3', '', { customClass: styles.inlineInput })}
                      <span>.</span>
                    </div>
                  </div>
                </div>

                <h4 className={styles.grammarSubheading}>Wh- Questions</h4>
                <div className={styles.gapFillList}>
                  <div className={styles.gapFillRow}>
                    <div className={styles.gapFillSentence}>
                      <span>What jobs</span>
                      {renderInput('exercise_5_grammar', '4', '', { customClass: styles.inlineInput })}
                      <span>he <strong>do</strong> around the house?</span>
                    </div>
                  </div>

                  <div className={styles.gapFillRow}>
                    <div className={styles.gapFillSentence}>
                      <span>How often</span>
                      {renderInput('exercise_5_grammar', '5', '', { customClass: styles.inlineInput })}
                      <span>he <strong>clean</strong> the kitchen?</span>
                    </div>
                  </div>

                  <div className={styles.gapFillRow}>
                    <div className={styles.gapFillSentence}>
                      <span>Where</span>
                      {renderInput('exercise_5_grammar', '6', '', { customClass: styles.inlineInput })}
                      <span>he <strong>walk</strong> the dog?</span>
                    </div>
                  </div>

                  <div className={styles.gapFillRow}>
                    <div className={styles.gapFillSentence}>
                      <span>When</span>
                      {renderInput('exercise_5_grammar', '7', '', { customClass: styles.inlineInput })}
                      <span>it <strong>open</strong>?</span>
                    </div>
                  </div>

                  <div className={styles.gapFillRow}>
                    <div className={styles.gapFillSentence}>
                      <span>Who <strong>does</strong> Bonnie <strong>live</strong> with?</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 6a & 6b: Pronunciation */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>6. Pronunciation: does in questions and short answers</h3>
                <button
                  type="button"
                  className={`${styles.audioBtn} ${playingAudio === '6.6' ? styles.audioPlaying : ''}`}
                  onClick={() => playAudio?.('6.6')}
                  aria-label="Play Audio 6.6"
                >
                  {playingAudio === '6.6' ? '⏸ Playing 6.6' : '▶ Audio 6.6'}
                </button>
              </div>

              <p className={styles.exerciseInstruction}>
                Notice how <em>does</em> is weak /dəz/ in questions, but stressed /dʌz/ in short answers:
              </p>

              <div className={styles.pronunciationGrid}>
                <div className={styles.pronunciationCard}>
                  <span>1 A: <strong className={styles.stressedWord}>Does</strong> she clean the bathroom?</span>
                  <span>1 B: Yes, she <strong className={styles.stressedWord}>does</strong>.</span>
                </div>

                <div className={styles.pronunciationCard}>
                  <span>2 A: When <strong className={styles.stressedWord}>does</strong> he go to the supermarket?</span>
                  <span>2 B: On Saturdays.</span>
                </div>

                <div className={styles.pronunciationCard}>
                  <span>3 A: What jobs around the house <strong className={styles.stressedWord}>does</strong> he do?</span>
                  <span>3 B: He makes the beds.</span>
                </div>
              </div>
            </div>

            {/* Exercise 7: Dialogue practice Nicholas & Chloe */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>7. Read the conversation and choose the correct alternatives</h3>
                <button
                  type="button"
                  className={`${styles.audioBtn} ${playingAudio === '6.7' ? styles.audioPlaying : ''}`}
                  onClick={() => playAudio?.('6.7')}
                  aria-label="Play Audio 6.7"
                >
                  {playingAudio === '6.7' ? '⏸ Playing 6.7' : '▶ Audio 6.7'}
                </button>
              </div>
              <p className={styles.exerciseInstruction}>Select the correct verb or auxiliary in each option, then listen and check.</p>

              <div className={styles.dialogueBox}>
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerNicholas}>Nicholas:</span>
                  <span>Hi, Chloe. What&apos;s your dog&apos;s name?</span>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerChloe}>Chloe:</span>
                  <span>Ronaldo.</span>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerNicholas}>Nicholas:</span>
                  <span>Good name!</span>
                  {renderSelect('exercise_7_dialogue', '1', [
                    { value: 'Do', label: 'Do' },
                    { value: 'Does', label: 'Does' },
                  ])}
                  <span>you</span>
                  {renderSelect('exercise_7_dialogue', '2', [
                    { value: 'walk', label: 'walk' },
                    { value: 'walks', label: 'walks' },
                  ])}
                  <span>him every day?</span>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerChloe}>Chloe:</span>
                  <span>No, I</span>
                  {renderSelect('exercise_7_dialogue', '3', [
                    { value: "don't", label: "don't" },
                    { value: "doesn't", label: "doesn't" },
                  ])}
                  <span>. My dad usually</span>
                  {renderSelect('exercise_7_dialogue', '4', [
                    { value: 'walk', label: 'walk' },
                    { value: 'walks', label: 'walks' },
                  ])}
                  <span>him.</span>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerNicholas}>Nicholas:</span>
                  <span>Where</span>
                  {renderSelect('exercise_7_dialogue', '5', [
                    { value: 'do', label: 'do' },
                    { value: 'does', label: 'does' },
                  ])}
                  <span>they</span>
                  {renderSelect('exercise_7_dialogue', '6', [
                    { value: 'go', label: 'go' },
                    { value: 'goes', label: 'goes' },
                  ])}
                  <span>?</span>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerChloe}>Chloe:</span>
                  <span>To the park.</span>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerNicholas}>Nicholas:</span>
                  {renderSelect('exercise_7_dialogue', '7', [
                    { value: 'Do', label: 'Do' },
                    { value: 'Does', label: 'Does' },
                  ])}
                  <span>Ronaldo</span>
                  {renderSelect('exercise_7_dialogue', '8', [
                    { value: 'run', label: 'run' },
                    { value: 'runs', label: 'runs' },
                  ])}
                  <span>in the park?</span>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerChloe}>Chloe:</span>
                  <span>Yes, he</span>
                  {renderSelect('exercise_7_dialogue', '9', [
                    { value: 'do', label: 'do' },
                    { value: 'does', label: 'does' },
                  ])}
                  <span>! And he</span>
                  {renderSelect('exercise_7_dialogue', '10', [
                    { value: 'play', label: 'play' },
                    { value: 'plays', label: 'plays' },
                  ])}
                  <span>with his ball.</span>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerNicholas}>Nicholas:</span>
                  <span>What time</span>
                  {renderSelect('exercise_7_dialogue', '11', [
                    { value: 'do', label: 'do' },
                    { value: 'does', label: 'does' },
                  ])}
                  <span>he</span>
                  {renderSelect('exercise_7_dialogue', '12', [
                    { value: 'have', label: 'have' },
                    { value: 'has', label: 'has' },
                  ])}
                  <span>dinner?</span>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerChloe}>Chloe:</span>
                  <span>About seven.</span>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerNicholas}>Nicholas:</span>
                  {renderSelect('exercise_7_dialogue', '13', [
                    { value: 'Do', label: 'Do' },
                    { value: 'Does', label: 'Does' },
                  ])}
                  <span>your dad</span>
                  {renderSelect('exercise_7_dialogue', '14', [
                    { value: 'feed', label: 'feed' },
                    { value: 'feeds', label: 'feeds' },
                  ])}
                  <span>Ronaldo?</span>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerChloe}>Chloe:</span>
                  <span>Yes, he</span>
                  {renderSelect('exercise_7_dialogue', '15', [
                    { value: 'do', label: 'do' },
                    { value: 'does', label: 'does' },
                  ])}
                  <span>.</span>
                </div>
              </div>
            </div>

            {/* Exercise 8a: Make questions using the prompts */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>8a. Make questions using the prompts</h3>
                <p className={styles.exerciseInstruction}>Write complete questions with correct word order and capitalization.</p>
              </div>

              <div className={styles.gapFillList}>
                {[
                  { num: '1', prompt: 'Where / your friend / live?' },
                  { num: '2', prompt: 'your friend / live / in a house or a flat?' },
                  { num: '3', prompt: 'Who / your friend / live with?' },
                  { num: '4', prompt: 'Where / your friend / work?' },
                  { num: '5', prompt: 'your friend / have / a dog?' },
                  { num: '6', prompt: 'How often / you / talk to / your friend?' },
                ].map((item) => (
                  <div key={item.num} className={styles.gapFillRow}>
                    <div className={styles.gapFillSentence}>
                      <span className={styles.numBadge}>{item.num}</span>
                      <span>Prompt: <em>{item.prompt}</em></span>
                    </div>
                    {renderInput('exercise_8a_questions', item.num, '', { fullWidth: true })}
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 8b: Ask and answer about a friend */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>8b. Choose a friend to talk about. Work in pairs</h3>
                <p className={styles.exerciseInstruction}>Ask and answer the questions in Exercise 8a with a partner.</p>
              </div>

              <div className={styles.modelDialogueBox}>
                <div className={styles.modelLine}>
                  <strong>A:</strong> <em>What&apos;s your friend&apos;s name?</em>
                </div>
                <div className={styles.modelLine}>
                  <strong>B:</strong> <em>Jasper.</em>
                </div>
                <div className={styles.modelLine}>
                  <strong>A:</strong> <em>Where does Jasper live?</em>
                </div>
                <div className={styles.modelLine}>
                  <strong>B:</strong> <em>He lives in an apartment in Madrid with two friends.</em>
                </div>
              </div>

              <div className={styles.gapFillList}>
                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>Notes about your friend (Name, city, occupation, habits):</span>
                  </div>
                  <textarea
                    value={(getRecord(answers['exercise_8b_notes']))['notes'] || ''}
                    onChange={(e) => handleFieldChange('exercise_8b_notes', 'notes', e.target.value)}
                    placeholder=""
                    disabled={readOnly}
                    className={styles.reportTextarea}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================== */}
          {/* SECTION 4: SPEAKING */}
          {/* ==================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Speaking: Household chores report</h2>
            </div>

            {/* Exercise 9: PREPARE (Turn to page 157) */}
            <div className={styles.surveyCard}>
              <div className={styles.surveyHeader}>
                <h3 className={styles.exerciseTitle}>9. PREPARE: Household chores survey (Page 157)</h3>
                <span className={styles.surveyBadge}>Communication Bank • Page 157</span>
              </div>
              <p className={styles.exerciseInstruction}>
                Turn to page 157. Prepare questions to ask your partner about who does the household chores and how often.
              </p>

              <div className={styles.partnerInfoRow}>
                <label className={styles.partnerInfoLabel}>Partner&apos;s Name:</label>
                <input
                  type="text"
                  value={(getRecord(answers['exercise_9_prepare']))['partner_name'] || ''}
                  onChange={(e) => handleFieldChange('exercise_9_prepare', 'partner_name', e.target.value)}
                  placeholder=""
                  disabled={readOnly}
                  className={styles.partnerInfoInput}
                />
              </div>
            </div>

            {/* Exercise 10a: SPEAK (Complete the table on page 157) */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>10a. Work in pairs. Ask questions and complete the table</h3>
                <p className={styles.exerciseInstruction}>
                  Ask your partner questions (e.g. <em>&quot;Who cleans the bathroom? How often does your father cook dinner?&quot;</em>) and fill in the survey table.
                </p>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.surveyTable}>
                  <thead>
                    <tr>
                      <th>Job around the house</th>
                      <th>Who does it?</th>
                      <th>How often?</th>
                      <th>Extra notes / details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'clean_bathroom', label: '1. Clean the bathroom' },
                      { key: 'cook_dinner', label: '2. Cook dinner' },
                      { key: 'wash_dishes', label: '3. Wash the dishes' },
                      { key: 'do_washing', label: '4. Do the washing' },
                      { key: 'walk_dog', label: '5. Walk / feed the dog' },
                      { key: 'make_beds', label: '6. Make the beds' },
                      { key: 'supermarket', label: '7. Go to the supermarket' },
                    ].map((row) => {
                      const rowData = getRecord(answers['exercise_10a_table']);
                      return (
                        <tr key={row.key}>
                          <td>{row.label}</td>
                          <td>
                            <select
                              value={rowData[`${row.key}_who`] || ''}
                              onChange={(e) => handleFieldChange('exercise_10a_table', `${row.key}_who`, e.target.value)}
                              disabled={readOnly}
                              className={styles.selectInput}
                            >
                              <option value="">-- Who --</option>
                              <option value="My partner">My partner</option>
                              <option value="Father">Father</option>
                              <option value="Mother">Mother</option>
                              <option value="Brother / Sister">Brother / Sister</option>
                              <option value="Partner & Family">Shared</option>
                              <option value="Nobody">Nobody</option>
                            </select>
                          </td>
                          <td>
                            <select
                              value={rowData[`${row.key}_often`] || ''}
                              onChange={(e) => handleFieldChange('exercise_10a_table', `${row.key}_often`, e.target.value)}
                              disabled={readOnly}
                              className={styles.selectInput}
                            >
                              <option value="">-- Often --</option>
                              <option value="always">always</option>
                              <option value="usually">usually</option>
                              <option value="sometimes">sometimes</option>
                              <option value="never">never</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              value={rowData[`${row.key}_notes`] || ''}
                              onChange={(e) => handleFieldChange('exercise_10a_table', `${row.key}_notes`, e.target.value)}
                              placeholder=""
                              disabled={readOnly}
                              className={styles.textInput}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exercise 10b: SPEAK (Tell your new partner about your old partner) */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>10b. Change partners. Tell your new partner about your old partner</h3>
                <p className={styles.exerciseInstruction}>
                  Summarize what you learned about your partner&apos;s household routines.
                </p>
              </div>

              <div className={styles.exampleBanner}>
                <strong>Example:</strong>
                <em>Diego&apos;s father usually cooks dinner. Diego sometimes cooks dinner.</em>
              </div>

              <div className={styles.gapFillList}>
                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>Write your comparison summary:</span>
                  </div>
                  <textarea
                    value={(getRecord(answers['exercise_10b_summary']))['summary'] || ''}
                    onChange={(e) => handleFieldChange('exercise_10b_summary', 'summary', e.target.value)}
                    placeholder=""
                    disabled={readOnly}
                    className={styles.reportTextarea}
                  />
                </div>
              </div>

              <div className={styles.gapFillSentence}>
                <span>Record your spoken report for teacher review:</span>
              </div>

              <AudioAnswerRecorder
                onAudioChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'lesson6b_speaking_ex10')}
                readOnly={readOnly}
              />
              {submissionId && (
                <SubmissionAudioPlayer
                  submissionId={submissionId}
                  exerciseKey="lesson6b_speaking_ex10"
                  audios={submittedAudios}
                />
              )}
            </div>

            {/* Develop your listening badge */}
            <div className={styles.footerBadge}>
              <span>Develop your listening — page 102</span>
              <span>Go to page 126 or your app for more grammar practice</span>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
