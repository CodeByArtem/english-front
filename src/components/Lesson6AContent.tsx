'use client';

import React, { useState } from 'react';
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
import styles from './lesson6a.module.scss';

export interface Lesson6AContentProps {
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

export const FALLBACK_ANSWER_KEY_6A: LessonAnswerKey = {
  exercise_1a_matching: {
    '1': ['F', 'f', 'Picture F', 'Photo F'],
    '2': ['C', 'c', 'Picture C', 'Photo C'],
    '3': ['A', 'a', 'Picture A', 'Photo A'],
    '4': ['D', 'd', 'Picture D', 'Photo D'],
    '5': ['G', 'g', 'Picture G', 'Photo G'],
    '6': ['B', 'b', 'Picture B', 'Photo B'],
    '7': ['E', 'e', 'Picture E', 'Photo E'],
  },
  exercise_4a_reading: {
    '1': ['B', 'b', 'Photo B', 'Picture B'],
    '2': ['A', 'a', 'Photo A', 'Picture A'],
  },
  exercise_4b_habit: {
    '1': ['a', 'A', 'something people often do'],
  },
  exercise_5_sentences: {
    '1': [
      "She doesn't take the bus.",
      "She doesn't take the bus",
      "she doesn't take the bus.",
      "she doesn't take the bus",
      "She does not take the bus.",
      "She does not take the bus",
    ],
    '2': [
      "She doesn't eat chocolate or cakes.",
      "She doesn't eat chocolate or cakes",
      "she doesn't eat chocolate or cakes.",
      "she doesn't eat chocolate or cakes",
      "She does not eat chocolate or cakes.",
      "She does not eat chocolate or cakes",
    ],
    '3': [
      'She goes to the gym.',
      'She goes to the gym',
      'she goes to the gym.',
      'she goes to the gym',
    ],
    '4': [
      'She watches TV.',
      'She watches TV',
      'she watches TV.',
      'she watches TV',
    ],
    '5': [
      'She never studies.',
      'She never studies',
      'she never studies.',
      'she never studies',
    ],
  },
  exercise_6_grammar: {
    '1': ['-s', 's', 'S', '-S'],
    '2': ['-ies', 'ies', 'IES', '-IES'],
    '3': ['-es', 'es', 'ES', '-ES'],
  },
  exercise_7a_pronunciation: {
    s_sound: ['puts', 'starts', 'walks'],
    z_sound: ['arrives', 'goes', 'studies', 'wears'],
    iz_sound: ['finishes', 'uses', 'watches'],
  },
  exercise_8_sentences: {
    '1_1': ["doesn't cycle", 'does not cycle', 'doesn’t cycle'],
    '1_2': ['takes'],
    '2_1': ["doesn't eat", 'does not eat', 'doesn’t eat'],
    '2_2': ['has'],
    '3_1': ['works'],
    '3_2': ["doesn't work", 'does not work', 'doesn’t work'],
    '4_1': ["doesn't study", 'does not study', 'doesn’t study'],
    '4_2': ['teaches'],
    '5_1': ["doesn't read", 'does not read', 'doesn’t read'],
    '5_2': ['studies'],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const PICTURES_6A = [
  { id: 'A', src: '/images/lesson6a/pic_a_watch_tv.png', caption: 'Watch TV (evening)' },
  { id: 'B', src: '/images/lesson6a/pic_b_study.png', caption: 'Study (11 p.m.)' },
  { id: 'C', src: '/images/lesson6a/pic_c_coffee.png', caption: 'Have coffee (every day)' },
  { id: 'D', src: '/images/lesson6a/pic_d_car.png', caption: 'Drive to park (weekend)' },
  { id: 'E', src: '/images/lesson6a/pic_e_gym.png', caption: 'Gym calendar (every week)' },
  { id: 'F', src: '/images/lesson6a/pic_f_bookshop.png', caption: 'Start work (8:30 a.m.)' },
  { id: 'G', src: '/images/lesson6a/pic_g_bus.png', caption: 'Take bus (3:30 p.m.)' },
];

const VOCAB_SENTENCES_6A = [
  { num: '1', text: 'I start work in the morning.', bold: 'in the morning' },
  { num: '2', text: 'I have coffee every day.', bold: 'every day' },
  { num: '3', text: 'I watch TV in the evening.', bold: 'in the evening' },
  { num: '4', text: 'I drive to the park at the weekend.', bold: 'at the weekend' },
  { num: '5', text: 'I take the bus in the afternoon.', bold: 'in the afternoon' },
  { num: '6', text: 'I study at night.', bold: 'at night' },
  { num: '7', text: 'I go to the gym every week.', bold: 'every week' },
];

const TIME_PHRASES_BOX = [
  'in the morning',
  'in the afternoon',
  'in the evening',
  'at night',
  'at the weekend',
  'every day',
  'every week',
];

const VERBS_PRONUNCIATION = [
  { word: 'arrives', category: 'z' },
  { word: 'finishes', category: 'iz' },
  { word: 'goes', category: 'z' },
  { word: 'puts', category: 's' },
  { word: 'starts', category: 's' },
  { word: 'studies', category: 'z' },
  { word: 'uses', category: 'iz' },
  { word: 'walks', category: 's' },
  { word: 'watches', category: 'iz' },
  { word: 'wears', category: 'z' },
];

export default function Lesson6AContent(props: Lesson6AContentProps) {
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
    FALLBACK_ANSWER_KEY_6A;

  const isReview = Boolean(isTeacherReview || (activeAnswerKey && readOnly));
  const answers = propOriginalAnswers ?? context?.answers ?? {};

  // State for interactive checklists
  const [trueForYou, setTrueForYou] = useState<Record<string, boolean>>({});

  const toggleTrueForYou = (key: string) => {
    if (readOnly) return;
    setTrueForYou((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  // Render neutral select without spoilers
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

  // Render text input without spoiler placeholder
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
        {/* Header Banner 6A */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge6A}>
              6<span className={styles.letterA}>A</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>Good and bad habits</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: talk about another person&apos;s habits</span>
                <span className={styles.pillGoal}>Grammar: present simple: he / she / it</span>
                <span className={styles.pillGoal}>Vocabulary: time expressions</span>
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
              <h2 className={styles.sectionTitle}>Vocabulary: Time expressions</h2>
              <button
                type="button"
                className={`${styles.audioBtn} ${playingAudio === '6.1' ? styles.audioPlaying : ''}`}
                onClick={() => playAudio?.('6.1')}
                aria-label="Play Audio 6.1"
              >
                {playingAudio === '6.1' ? '⏸ Playing 6.1' : '▶ Audio 6.1'}
              </button>
            </div>

            {/* Exercise 1a: Gallery of Pictures A-G */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>1a. Match pictures A–G with sentences 1–7</h3>
                <p className={styles.exerciseInstruction}>Look at the illustrations and select the correct picture letter for each sentence.</p>
              </div>

              <div className={styles.galleryGrid}>
                {PICTURES_6A.map((pic) => (
                  <div key={pic.id} className={styles.galleryCard}>
                    <div className={styles.galleryImageWrapper}>
                      <span className={styles.galleryCardBadge}>{pic.id}</span>
                      <Image
                        src={pic.src}
                        alt={`Picture ${pic.id}: ${pic.caption}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.galleryCardCaption}>{pic.caption}</div>
                  </div>
                ))}
              </div>

              {/* Matching sentences list */}
              <div className={styles.matchingList}>
                {VOCAB_SENTENCES_6A.map((item) => (
                  <div key={item.num} className={styles.matchingRow}>
                    <div className={styles.matchingLeft}>
                      <span className={styles.numBadge}>{item.num}</span>
                      <span className={styles.matchingSentence}>
                        {item.text.replace(item.bold, '')}
                        <strong>{item.bold}</strong>
                      </span>
                    </div>
                    <div className={styles.matchingSelectArea}>
                      {renderSelect(
                        'exercise_1a_matching',
                        item.num,
                        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter) => ({
                          value: letter,
                          label: `Picture ${letter}`,
                        }))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 1b: Audio & Pronunciation */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>1b. Listen and repeat the phrases in bold</h3>
                <button
                  type="button"
                  className={`${styles.audioBtn} ${playingAudio === '6.1' ? styles.audioPlaying : ''}`}
                  onClick={() => playAudio?.('6.1')}
                  aria-label="Play Audio 6.1"
                >
                  {playingAudio === '6.1' ? '⏸ Playing 6.1' : '▶ Audio 6.1'}
                </button>
              </div>
              <p className={styles.exerciseInstruction}>Listen to the audio track and practice repeating the time expressions:</p>
              <div className={styles.wordBankBox}>
                {TIME_PHRASES_BOX.map((phrase) => (
                  <div key={phrase} className={styles.wordBankItem}>
                    <span>{phrase}</span>
                    <PronounceButton word={phrase} size="small" />
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 2: Work in pairs (True for you) */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>2. Which sentences in Exercise 1a are true for you?</h3>
                <p className={styles.exerciseInstruction}>Select which sentences are true for your routine. Example: <em>Number 3 is true. I watch TV in the evening.</em></p>
              </div>

              <div className={styles.matchingList}>
                {VOCAB_SENTENCES_6A.map((item) => (
                  <label
                    key={item.num}
                    className={styles.matchingRow}
                    onClick={() => toggleTrueForYou(item.num)}
                  >
                    <div className={styles.matchingLeft}>
                      <input
                        type="checkbox"
                        checked={Boolean(trueForYou[item.num])}
                        onChange={() => toggleTrueForYou(item.num)}
                        disabled={readOnly}
                      />
                      <span className={styles.numBadge}>{item.num}</span>
                      <span className={styles.matchingSentence}>{item.text}</span>
                    </div>
                    <span className={styles.pillGoal}>
                      {trueForYou[item.num] ? '✓ True for me' : 'Not true'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Exercise 3a: Complete the sentences so they are true for you */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>3a. Complete the sentences so they are true for you</h3>
                <p className={styles.exerciseInstruction}>Use the phrases in the box to complete the sentences about your routine.</p>
              </div>

              <div className={styles.wordBankBox}>
                {TIME_PHRASES_BOX.map((phrase) => (
                  <span key={phrase} className={styles.wordBankItem}>{phrase}</span>
                ))}
              </div>

              <div className={styles.gapFillList}>
                {[
                  { id: '1', start: '1. I don&apos;t go to work' },
                  { id: '2', start: '2. I sometimes have dinner' },
                  { id: '3', start: '3. I never study English' },
                  { id: '4', start: '4. I usually see my family' },
                ].map((s) => (
                  <div key={s.id} className={styles.gapFillRow}>
                    <div className={styles.gapFillSentence}>
                      <span dangerouslySetInnerHTML={{ __html: s.start }} />
                      {renderSelect(
                        'exercise_3a_personal',
                        s.id,
                        TIME_PHRASES_BOX.map((p) => ({ value: p, label: p }))
                      )}
                      <span>.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 3b: Speaking submission */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>3b. Speak &amp; Compare: Record your answers</h3>
                <p className={styles.exerciseInstruction}>Compare your answers with a partner or record them for teacher feedback.</p>
              </div>
              <AudioAnswerRecorder
                onAudioChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'lesson6a_speaking_ex3b')}
                readOnly={readOnly}
              />
              {submissionId && (
                <SubmissionAudioPlayer
                  submissionId={submissionId}
                  exerciseKey="lesson6a_speaking_ex3b"
                  audios={submittedAudios}
                />
              )}
            </div>
          </section>

          {/* ==================================================== */}
          {/* SECTION 2: READING */}
          {/* ==================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Reading: Habits</h2>
            </div>

            {/* Exercise 4a: Text Cards & Photos */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>4a. Read the texts and match Erica and Tina with photos A and B</h3>
                <p className={styles.exerciseInstruction}>Read about Erica and Tina, then match them to their respective photos below.</p>
              </div>

              <div className={styles.readingCardsGrid}>
                {/* Erica Text */}
                <div className={`${styles.readingCard} ${styles.goodHabitsCard}`}>
                  <h4 className={styles.readingCardTitle}>My friend Erica has lots of good habits:</h4>
                  <p className={styles.readingCardText}>
                    She doesn&apos;t take the bus or the train to work in the morning, she walks or cycles.<br />
                    She doesn&apos;t drink tea or coffee, she drinks water.<br />
                    She doesn&apos;t eat chocolate or cakes and often has salad for lunch.<br />
                    She goes to the gym every day.<br />
                    She always sees a show at the weekend or meets friends for dinner.
                  </p>
                </div>

                {/* Tina Text */}
                <div className={`${styles.readingCard} ${styles.badHabitsCard}`}>
                  <h4 className={styles.readingCardTitle}>My friend Tina has lots of bad habits:</h4>
                  <p className={styles.readingCardText}>
                    She eats chocolate every day and drinks a lot of coffee.<br />
                    She even drinks coffee at night!<br />
                    She always watches TV in the evening and goes to bed at 1 o&apos;clock in the morning.<br />
                    She always takes the bus. She doesn&apos;t walk or cycle.<br />
                    She&apos;s at university, but she never studies.
                  </p>
                </div>
              </div>

              {/* Photos A & B */}
              <div className={styles.photosRow}>
                <div className={styles.photoCard}>
                  <div className={styles.photoWrapper}>
                    <span className={styles.photoBadge}>Photo A</span>
                    <Image
                      src="/images/lesson6a/photo_a_tina.png"
                      alt="Photo A: Woman on couch eating snacks and watching TV"
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.photoActionArea}>
                    <span>Who is this?</span>
                    {renderSelect(
                      'exercise_4a_reading',
                      '2',
                      [
                        { value: 'A', label: 'Tina (Photo A)' },
                        { value: 'B', label: 'Erica (Photo B)' },
                      ]
                    )}
                  </div>
                </div>

                <div className={styles.photoCard}>
                  <div className={styles.photoWrapper}>
                    <span className={styles.photoBadge}>Photo B</span>
                    <Image
                      src="/images/lesson6a/photo_b_erica.png"
                      alt="Photo B: Woman in helmet cycling to work in the city"
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.photoActionArea}>
                    <span>Who is this?</span>
                    {renderSelect(
                      'exercise_4a_reading',
                      '1',
                      [
                        { value: 'A', label: 'Tina (Photo A)' },
                        { value: 'B', label: 'Erica (Photo B)' },
                      ]
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 4b: Meaning of Habit */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>4b. What is a habit? Choose the correct option, a or b</h3>
              </div>
              <div className={styles.matchingList}>
                {[
                  { val: 'a', text: 'a) something people often do' },
                  { val: 'b', text: 'b) something people never do' },
                ].map((opt) => (
                  <label key={opt.val} className={styles.matchingRow}>
                    <div className={styles.matchingLeft}>
                      <input
                        type="radio"
                        name="ex_4b_habit"
                        value={opt.val}
                        checked={(getRecord(answers['exercise_4b_habit']))['1'] === opt.val}
                        onChange={() => handleFieldChange('exercise_4b_habit', '1', opt.val)}
                        disabled={readOnly}
                      />
                      <span className={styles.matchingSentence}>{opt.text}</span>
                    </div>
                  </label>
                ))}
              </div>
              {renderSelect('exercise_4b_habit', '1', [
                { value: 'a', label: 'Option a: something people often do' },
                { value: 'b', label: 'Option b: something people never do' },
              ])}
            </div>

            {/* Exercise 5: Rewrite with 'she' */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>5. Rewrite the sentences using &apos;she&apos;</h3>
                <p className={styles.exerciseInstruction}>Use the texts in Exercise 4a to help you change the subject from I to she.</p>
              </div>

              <div className={styles.gapFillList}>
                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>1. I don&apos;t take the bus. &rarr; <em>She doesn&apos;t take the bus.</em> (Example)</span>
                  </div>
                </div>

                {[
                  { num: '2', orig: '2. I don&apos;t eat chocolate or cakes.' },
                  { num: '3', orig: '3. I go to the gym.' },
                  { num: '4', orig: '4. I watch TV.' },
                  { num: '5', orig: '5. I never study.' },
                ].map((item) => (
                  <div key={item.num} className={styles.gapFillRow}>
                    <div className={styles.gapFillSentence}>
                      <span dangerouslySetInnerHTML={{ __html: item.orig }} />
                    </div>
                    {renderInput('exercise_5_sentences', item.num, '', { fullWidth: true })}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ==================================================== */}
          {/* SECTION 3: GRAMMAR */}
          {/* ==================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Grammar: Present simple (he / she / it)</h2>
            </div>

            {/* Exercise 6: Grammar Box */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>6. Read and complete the grammar box</h3>
                <p className={styles.exerciseInstruction}>Use Exercises 4a and 5 to help you complete the spelling rules.</p>
              </div>

              <div className={styles.grammarBox}>
                <table className={styles.grammarTable}>
                  <thead>
                    <tr>
                      <th>Form</th>
                      <th>Subject</th>
                      <th>Verb</th>
                      <th>Complement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td rowSpan={3}><strong>+ Affirmative</strong></td>
                      <td>He</td>
                      <td><strong>gets up</strong></td>
                      <td>early.</td>
                    </tr>
                    <tr>
                      <td>She</td>
                      <td><strong>works</strong></td>
                      <td>at home.</td>
                    </tr>
                    <tr>
                      <td>It</td>
                      <td><strong>starts</strong></td>
                      <td>at nine.</td>
                    </tr>
                    <tr>
                      <td rowSpan={3}><strong>- Negative</strong></td>
                      <td>He</td>
                      <td><strong>doesn&apos;t have</strong></td>
                      <td>dinner at home.</td>
                    </tr>
                    <tr>
                      <td>She</td>
                      <td><strong>doesn&apos;t work</strong></td>
                      <td>every day.</td>
                    </tr>
                    <tr>
                      <td>It</td>
                      <td><strong>doesn&apos;t leave</strong></td>
                      <td>at 6 o&apos;clock.</td>
                    </tr>
                  </tbody>
                </table>

                {/* Rules to complete */}
                <div className={styles.grammarRulesList}>
                  <div className={styles.grammarRuleRow}>
                    <span className={styles.grammarRuleText}>
                      For most verbs, + <strong>1</strong>
                    </span>
                    {renderSelect('exercise_6_grammar', '1', [
                      { value: '-s', label: '+ -s (He arrives home late)' },
                      { value: '-ies', label: '+ -ies' },
                      { value: '-es', label: '+ -es' },
                    ])}
                    <span className={styles.grammarRuleText}><em>Example: He arrives home late.</em></span>
                  </div>

                  <div className={styles.grammarRuleRow}>
                    <span className={styles.grammarRuleText}>
                      For verbs ending in consonant + <em>-y</em>, change <em>y</em> to + <strong>2</strong>
                    </span>
                    {renderSelect('exercise_6_grammar', '2', [
                      { value: '-s', label: '+ -s' },
                      { value: '-ies', label: '+ -ies (She studies Spanish)' },
                      { value: '-es', label: '+ -es' },
                    ])}
                    <span className={styles.grammarRuleText}><em>Example: She studies Spanish.</em></span>
                  </div>

                  <div className={styles.grammarRuleRow}>
                    <span className={styles.grammarRuleText}>
                      For verbs ending in <em>-ch, -o, -s, -sh, -x</em>, + <strong>3</strong>
                    </span>
                    {renderSelect('exercise_6_grammar', '3', [
                      { value: '-s', label: '+ -s' },
                      { value: '-ies', label: '+ -ies' },
                      { value: '-es', label: '+ -es (She watches TV)' },
                    ])}
                    <span className={styles.grammarRuleText}><em>Example: She watches TV.</em></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 7a & 7b: Pronunciation /s/, /z/, /ɪz/ */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>7a. Listen to the endings of the verbs in the box</h3>
                <div className={styles.matchingSelectArea}>
                  <button
                    type="button"
                    className={`${styles.audioBtn} ${playingAudio === '6.2' ? styles.audioPlaying : ''}`}
                    onClick={() => playAudio?.('6.2')}
                    aria-label="Play Audio 6.2"
                  >
                    {playingAudio === '6.2' ? '⏸ Playing 6.2' : '▶ Audio 6.2'}
                  </button>
                  <button
                    type="button"
                    className={`${styles.audioBtn} ${playingAudio === '6.3' ? styles.audioPlaying : ''}`}
                    onClick={() => playAudio?.('6.3')}
                    aria-label="Play Audio 6.3"
                  >
                    {playingAudio === '6.3' ? '⏸ Playing 6.3' : '▶ Audio 6.3'}
                  </button>
                </div>
              </div>

              <p className={styles.exerciseInstruction}>
                Categorize each verb according to the sound of its ending: <strong>/s/</strong>, <strong>/z/</strong>, or <strong>/ɪz/</strong>.
              </p>

              <div className={styles.wordBankBox}>
                {VERBS_PRONUNCIATION.map((item) => (
                  <div key={item.word} className={styles.wordBankItem}>
                    <span>{item.word}</span>
                    {isReview && <PronounceButton word={item.word} size="small" />}
                  </div>
                ))}
              </div>

              <div className={styles.matchingList}>
                {VERBS_PRONUNCIATION.map((item) => (
                  <div key={item.word} className={styles.matchingRow}>
                    <div className={styles.matchingLeft}>
                      <span className={styles.numBadge}>•</span>
                      <span className={styles.matchingSentence}><strong>{item.word}</strong></span>
                    </div>
                    <div className={styles.matchingSelectArea}>
                      {renderSelect(
                        'exercise_7a_categories',
                        item.word,
                        [
                          { value: 's', label: '/s/ sound' },
                          { value: 'z', label: '/z/ sound' },
                          { value: 'iz', label: '/ɪz/ sound' },
                        ]
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 8: Complete with correct form */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>8. Complete the sentences with the correct form of the verbs in brackets</h3>
                <p className={styles.exerciseInstruction}>Fill in the blanks with the affirmative or negative 3rd person singular form.</p>
              </div>

              <div className={styles.gapFillList}>
                {/* 1 */}
                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>1. Carla</span>
                    {renderInput('exercise_8_sentences', '1_1', '', { customClass: styles.inlineInput })}
                    <span>(not cycle) to work every day. She sometimes</span>
                    {renderInput('exercise_8_sentences', '1_2', '', { customClass: styles.inlineInput })}
                    <span>(take) the bus.</span>
                  </div>
                </div>

                {/* 2 */}
                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>2. Ethan</span>
                    {renderInput('exercise_8_sentences', '2_1', '', { customClass: styles.inlineInput })}
                    <span>(not eat) sandwiches for lunch. He often</span>
                    {renderInput('exercise_8_sentences', '2_2', '', { customClass: styles.inlineInput })}
                    <span>(have) salad.</span>
                  </div>
                </div>

                {/* 3 */}
                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>3. Ahmed</span>
                    {renderInput('exercise_8_sentences', '3_1', '', { customClass: styles.inlineInput })}
                    <span>(work) at the weekend. He</span>
                    {renderInput('exercise_8_sentences', '3_2', '', { customClass: styles.inlineInput })}
                    <span>(not work) on Monday and Tuesday.</span>
                  </div>
                </div>

                {/* 4 */}
                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>4. Yuriko</span>
                    {renderInput('exercise_8_sentences', '4_1', '', { customClass: styles.inlineInput })}
                    <span>(not study) English on Sunday. She</span>
                    {renderInput('exercise_8_sentences', '4_2', '', { customClass: styles.inlineInput })}
                    <span>(teach) Japanese classes.</span>
                  </div>
                </div>

                {/* 5 */}
                <div className={styles.gapFillRow}>
                  <div className={styles.gapFillSentence}>
                    <span>5. Claudia</span>
                    {renderInput('exercise_8_sentences', '5_1', '', { customClass: styles.inlineInput })}
                    <span>(not read) the newspaper on the train. She</span>
                    {renderInput('exercise_8_sentences', '5_2', '', { customClass: styles.inlineInput })}
                    <span>(study) English.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================== */}
          {/* SECTION 4: SPEAKING */}
          {/* ==================================================== */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Speaking: Habits of friends and family</h2>
            </div>

            {/* Exercise 9: Prepare Notes */}
            <div className={styles.notesCard}>
              <h3 className={styles.notesCardTitle}>9. PREPARE: Notes about a friend or family member</h3>
              <p className={styles.exerciseInstruction}>Choose a person and write down notes about his or her good and bad habits.</p>

              <div className={styles.notesGrid}>
                <div className={styles.noteField}>
                  <label className={styles.noteLabel}>Person&apos;s Name &amp; Relationship</label>
                  <input
                    type="text"
                    value={(getRecord(answers['exercise_9_notes']))['person'] || ''}
                    onChange={(e) => handleFieldChange('exercise_9_notes', 'person', e.target.value)}
                    placeholder=""
                    disabled={readOnly}
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.noteField}>
                  <label className={styles.noteLabel}>Occupation / Activity</label>
                  <input
                    type="text"
                    value={(getRecord(answers['exercise_9_notes']))['activity'] || ''}
                    onChange={(e) => handleFieldChange('exercise_9_notes', 'activity', e.target.value)}
                    placeholder=""
                    disabled={readOnly}
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.noteField}>
                  <label className={styles.noteLabel}>Good Habits</label>
                  <textarea
                    value={(getRecord(answers['exercise_9_notes']))['good_habits'] || ''}
                    onChange={(e) => handleFieldChange('exercise_9_notes', 'good_habits', e.target.value)}
                    placeholder=""
                    disabled={readOnly}
                    className={styles.noteTextarea}
                  />
                </div>

                <div className={styles.noteField}>
                  <label className={styles.noteLabel}>Bad Habits</label>
                  <textarea
                    value={(getRecord(answers['exercise_9_notes']))['bad_habits'] || ''}
                    onChange={(e) => handleFieldChange('exercise_9_notes', 'bad_habits', e.target.value)}
                    placeholder=""
                    disabled={readOnly}
                    className={styles.noteTextarea}
                  />
                </div>
              </div>
            </div>

            {/* Exercise 10: Speak & Record Voice */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.exerciseTitle}>10. SPEAK: Tell your partner or teacher</h3>
                <p className={styles.exerciseInstruction}>
                  Take turns telling your partner about your friend or family member. Record your spoken response below for teacher evaluation.
                </p>
              </div>

              <AudioAnswerRecorder
                onAudioChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'lesson6a_speaking_ex10')}
                readOnly={readOnly}
              />
              {submissionId && (
                <SubmissionAudioPlayer
                  submissionId={submissionId}
                  exerciseKey="lesson6a_speaking_ex10"
                  audios={submittedAudios}
                />
              )}
            </div>

            {/* Develop your writing badge */}
            <div className={styles.footerBadge}>
              <span>Develop your writing — page 101</span>
              <span>Go to page 126 or your app for more grammar practice</span>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
