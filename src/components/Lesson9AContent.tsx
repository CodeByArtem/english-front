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
import styles from './lesson9a.module.scss';

export interface Lesson9AContentProps {
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

export const FALLBACK_ANSWER_KEY_9A: LessonAnswerKey = {
  exercise_1b_prepositions: {
    '1': ['C', 'c', 'Photo C', 'photo c'],
    '2': ['F', 'f', 'Photo F', 'photo f'],
    '3': ['B', 'b', 'Photo B', 'photo b'],
    '4': ['D', 'd', 'Photo D', 'photo d'],
    '5': ['H', 'h', 'Photo H', 'photo h'],
    '6': ['A', 'a', 'Photo A', 'photo a'],
    '7': ['E', 'e', 'Photo E', 'photo e'],
    '8': ['G', 'g', 'Photo G', 'photo g'],
    '9': ['I', 'i', 'Photo I', 'photo i'],
  },
  exercise_3a_labels: {
    '1': ['Tony', 'tony'],
    '2': ['Carol', 'carol'],
    '3': ['Agnes', 'agnes'],
    '4': ['Pat', 'pat'],
  },
  exercise_3b_speakers: {
    a: ['T', 't', 'Tony', 'tony'],
    b: ['C', 'c', 'Camilla', 'camilla'],
    c: ['T', 't', 'Tony', 'tony'],
    d: ['C', 'c', 'Camilla', 'camilla'],
    e: ['T', 't', 'Tony', 'tony'],
  },
  exercise_3c_referents: {
    '1': ['Tony', 'tony'],
    '2': ['Tony', 'tony'],
    '3': [
      'Tony and Carol',
      'Tony and his wife',
      'Tony and his wife Carol',
      'Tony, Carol',
      'Carol and Tony',
    ],
    '4': ["Tony's sister", 'his sister', 'sister', 'Tony sister'],
    '5': [
      "Tony's sister's family",
      'his sister and her family',
      "Tony's sister and her family",
      'sister and her family',
      'his sister family',
    ],
    '6': ['Pat', 'pat', "Tony's brother-in-law", "sister's husband"],
  },
  exercise_4_rules: {
    rule_1: ['before', 'Before'],
    rule_2: ['after', 'After'],
  },
  exercise_4_pronouns_table: {
    pronoun_i: ['me'],
    pronoun_you: ['you'],
    pronoun_he: ['him'],
    pronoun_she: ['her'],
    pronoun_it: ['it'],
    pronoun_we: ['us'],
    pronoun_they: ['them'],
  },
  exercise_5a_stress: {
    '1': ['unstressed', 'Unstressed'],
    '2': ['unstressed', 'Unstressed'],
    '3': ['unstressed', 'Unstressed'],
  },
  exercise_6_alternatives: {
    '1': ['They', 'they'],
    '2': ['them', 'Them'],
    '3': ['I', 'i'],
    '4': ['I', 'i'],
    '5': ['her', 'Her'],
    '6': ['him', 'Him'],
    '7': ['us', 'Us'],
    '8': ['him', 'Him'],
    '9': ['She', 'she'],
    '10': ['She', 'she'],
    '11': ['me', 'Me'],
    '12': ['we', 'We'],
  },
};

const PREPOSITION_ITEMS = [
  { id: '1', sentence: 'The man is at the hotel.', prep: 'at' },
  { id: '2', sentence: 'The table is below the picture.', prep: 'below' },
  { id: '3', sentence: 'The flowers are in the bag.', prep: 'in' },
  { id: '4', sentence: 'The bag is next to the chair.', prep: 'next to' },
  { id: '5', sentence: 'The cup is in front of the cake.', prep: 'in front of' },
  { id: '6', sentence: 'The bag is on the table.', prep: 'on' },
  { id: '7', sentence: 'The picture is above the table.', prep: 'above' },
  { id: '8', sentence: 'The clock is between the computer and the books.', prep: 'between' },
  { id: '9', sentence: 'The cake is behind the cup.', prep: 'behind' },
];

const PREPOSITION_CARDS = [
  { id: 'A', name: 'prep_a.png', title: 'Card A', desc: 'Bag on table' },
  { id: 'B', name: 'prep_b.png', title: 'Card B', desc: 'Flowers in bag' },
  { id: 'C', name: 'prep_c.png', title: 'Card C', desc: 'Man at hotel' },
  { id: 'D', name: 'prep_d.png', title: 'Card D', desc: 'Bag next to chair' },
  { id: 'E', name: 'prep_e.png', title: 'Card E', desc: 'Picture above table' },
  { id: 'F', name: 'prep_f.png', title: 'Card F', desc: 'Table below picture' },
  { id: 'G', name: 'prep_g.png', title: 'Card G', desc: 'Clock between computer & books' },
  { id: 'H', name: 'prep_h.png', title: 'Card H', desc: 'Cup in front of cake' },
  { id: 'I', name: 'prep_i.png', title: 'Card I', desc: 'Cake behind cup' },
];

const DIALOGUE_3B = [
  { id: 'a', line: 'Well, that’s ¹me behind the chair, next to my wife, Carol.' },
  { id: 'b', line: 'Yeah, I know that’s ²you!' },
  { id: 'c', line: 'And, in front of ³us, that’s my sister and her family.' },
  { id: 'd', line: 'Wow, how often do you see ⁴her?' },
  { id: 'e', line: 'We visit ⁵them once a year, but Pat comes to the UK for work sometimes, so we see ⁶him three times a year, maybe.' },
];

const REFERENTS_3C = [
  { id: '1', word: 'me', context: '1 me', expected: 'Tony' },
  { id: '2', word: 'you', context: '2 you', expected: 'Tony' },
  { id: '3', word: 'us', context: '3 us', expected: 'Tony and Carol' },
  { id: '4', word: 'her', context: '4 her', expected: "Tony's sister" },
  { id: '5', word: 'them', context: '5 them', expected: "Tony's sister's family" },
  { id: '6', word: 'him', context: '6 him', expected: 'Pat' },
];

const PRONOUNS_TABLE_DATA = [
  { subject: 'I', key: 'pronoun_i' },
  { subject: 'you', key: 'pronoun_you' },
  { subject: 'he', key: 'pronoun_he' },
  { subject: 'she', key: 'pronoun_she' },
  { subject: 'it', key: 'pronoun_it' },
  { subject: 'we', key: 'pronoun_we' },
  { subject: 'they', key: 'pronoun_they' },
];

const STRESS_5A_ITEMS = [
  { id: '1', sentence: 'Do you often visit them?', word: 'them' },
  { id: '2', sentence: 'Who’s next to him?', word: 'him' },
  { id: '3', sentence: 'He works with her.', word: 'her' },
];

const QUESTIONS_7 = [
  {
    id: '1',
    q: '1 Do you often talk to your parents?',
    example: 'Yes, I usually talk to them every week. I call them after my English class.',
  },
  { id: '2', q: '2 Do you often send emails to your family?' },
  { id: '3', q: '3 Do you like family parties?' },
  { id: '4', q: '4 How often do you visit your grandmother?' },
  { id: '5', q: '5 Do you always meet your friends at the weekend?' },
  { id: '6', q: '6 Who always calls you at the weekend?' },
];

export default function Lesson9AContent({
  isTeacherReview = false,
  readOnly = false,
  answerKey: propAnswerKey,
  playAudio: propPlayAudio,
  playingAudio: propPlayingAudio,
  originalAnswers = {},
  onAudioBlobChange,
  submissionId,
  submittedAudios = [],
}: Lesson9AContentProps) {
  const {
    answers = {},
    setAnswerField,
    setAnswer,
    playAudio: contextPlayAudio,
    playingAudio: contextPlayingAudio,
  } = useLessonContext();

  const playAudio = propPlayAudio || contextPlayAudio;
  const playingAudio = propPlayingAudio !== undefined ? propPlayingAudio : contextPlayingAudio;

  const isReview = Boolean(isTeacherReview || (propAnswerKey && readOnly));
  const activeAnswerKey = propAnswerKey || (isReview ? FALLBACK_ANSWER_KEY_9A : null);

  const getRecord = (obj: unknown): Record<string, string> => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      return obj as Record<string, string>;
    }
    return {};
  };

  // State answers from context
  const ex1bAnswers = getRecord(answers.exercise_1b_prepositions);
  const ex2aAnswers = getRecord(answers.exercise_2a_classroom);
  const ex3aAnswers = getRecord(answers.exercise_3a_labels);
  const ex3bAnswers = getRecord(answers.exercise_3b_speakers);
  const ex3cAnswers = getRecord(answers.exercise_3c_referents);
  const ex4RulesAnswers = getRecord(answers.exercise_4_rules);
  const ex4TableAnswers = getRecord(answers.exercise_4_pronouns_table);
  const ex5aAnswers = getRecord(answers.exercise_5a_stress);
  const ex6Answers = getRecord(answers.exercise_6_alternatives);
  const ex7Answers = getRecord(answers.exercise_7_questions);
  const ex8Notes = typeof answers.exercise_8_notes === 'string' ? answers.exercise_8_notes : '';
  const ex8Photo = typeof answers.exercise_8_photo === 'string' ? answers.exercise_8_photo : 'park';

  // Original answers for diff highlighting
  const origEx1b = getRecord(originalAnswers.exercise_1b_prepositions);
  const origEx3a = getRecord(originalAnswers.exercise_3a_labels);
  const origEx3b = getRecord(originalAnswers.exercise_3b_speakers);
  const origEx3c = getRecord(originalAnswers.exercise_3c_referents);
  const origEx4Rules = getRecord(originalAnswers.exercise_4_rules);
  const origEx4Table = getRecord(originalAnswers.exercise_4_pronouns_table);
  const origEx5a = getRecord(originalAnswers.exercise_5a_stress);
  const origEx6 = getRecord(originalAnswers.exercise_6_alternatives);

  // Field verification helper
  const verify = (exerciseName: string, field: string, value: string): VerificationResult | null => {
    if (!isReview) return null;
    const exKey = getExerciseKey(activeAnswerKey, exerciseName);
    return verifyAnswer(value, exKey?.[field]);
  };

  const isDiff = (origVal: string | undefined, currVal: string | undefined): boolean => {
    return Boolean(origVal !== undefined && origVal !== currVal);
  };

  const handleAudioToggle = (track: string) => {
    playAudio?.(track);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Header Banner 9A */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge9A}>
              9<span>A</span>
            </div>
            <h1 className={styles.lessonTitle}>Family photos</h1>
          </div>
          <div className={styles.goalsBox}>
            <div className={styles.goalItem}>
              <strong>Goal:</strong> talk about the people in a photo
            </div>
            <div className={styles.goalItem}>
              <strong>Grammar:</strong> object pronouns (<em>me, him, her, etc.</em>)
            </div>
            <div className={styles.goalItem}>
              <strong>Vocabulary:</strong> prepositions of place
            </div>
          </div>
        </header>

        <div className={styles.pageBody}>
          {/* ======================================================== */}
          {/* SECTION 1: VOCABULARY - PREPOSITIONS OF PLACE             */}
          {/* ======================================================== */}
          <section className={styles.lessonSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Vocabulary: Prepositions of place</h2>
            </div>

            {/* Exercise 1a */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1a</span>
                <p className={styles.exerciseTitle}>
                  Look at the pictures. What can you see?
                </p>
              </div>

              {/* Grid of Prepositions Cards A-I */}
              <div className={styles.prepositionsGrid}>
                {PREPOSITION_CARDS.map((card) => (
                  <div key={card.id} className={styles.prepCard}>
                    <div className={styles.prepImgWrapper}>
                      <Image
                        src={`/images/lesson9a/${card.name}`}
                        alt={card.desc}
                        fill
                        sizes="(max-width: 600px) 50vw, 33vw"
                      />
                    </div>
                    <div className={styles.prepCardLabel}>
                      <span>{card.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 1b */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1b</span>
                <p className={styles.exerciseTitle}>
                  Where are the red things? Match sentences 1–9 with pictures A–I in Exercise 1a. Then listen and check your answers.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.1')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.1' ? '⏸ Pause Audio 9.1' : '▶ Audio 9.1'}
                </button>
              </div>

              <div className={styles.matchingList}>
                {PREPOSITION_ITEMS.map((item) => {
                  const val = ex1bAnswers[item.id] || '';
                  const origVal = origEx1b[item.id];
                  const res = verify('exercise_1b_prepositions', item.id, val);
                  const isFieldDiff = isDiff(origVal, val);

                  return (
                    <div key={item.id} className={styles.matchingItem}>
                      <div className={styles.matchingSentence}>
                        <strong>{item.id}</strong> {item.sentence}
                      </div>
                      <div className={styles.matchingControl}>
                        <select
                          className={`${styles.selectInput} ${
                            isFieldDiff ? styles.diffHighlight : ''
                          } ${
                            res ? (res.isCorrect ? styles.fieldCorrect : styles.fieldIncorrect) : ''
                          }`}
                          value={val}
                          disabled={readOnly}
                          onChange={(e) =>
                            setAnswerField('exercise_1b_prepositions', item.id, e.target.value)
                          }
                        >
                          <option value="">Picture...</option>
                          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map((letter) => (
                            <option key={letter} value={letter}>
                              Picture {letter}
                            </option>
                          ))}
                        </select>
                        {res?.isCorrect && (
                          <span className={styles.correctBadge}>✓ Correct</span>
                        )}
                      </div>
                      {res && !res.isCorrect && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={res} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 1c */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1c</span>
                <p className={styles.exerciseTitle}>
                  Listen again and repeat. Practice saying the prepositions clearly.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.1')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.1' ? '⏸ Pause Audio 9.1' : '▶ Audio 9.1'}
                </button>
              </div>
            </div>

            {/* Exercise 2a & 2b */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2a</span>
                <p className={styles.exerciseTitle}>
                  Write sentences about objects in your classroom or home. Don’t write the name of the object. Use <em>it</em>.
                </p>
              </div>
              <div className={styles.questionsList}>
                {[1, 2, 3].map((num) => {
                  const key = `sentence_${num}`;
                  const val = ex2aAnswers[key] || '';
                  return (
                    <div key={num} className={styles.labelRow}>
                      <span className={styles.markerBadge}>{num}</span>
                      <input
                        type="text"
                        className={styles.textInput}
                        value={val}
                        disabled={readOnly}
                        placeholder={num === 1 ? 'e.g. It’s on the table.' : 'Write a sentence...'}
                        onChange={(e) =>
                          setAnswerField('exercise_2a_classroom', key, e.target.value)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2b</span>
                <p className={styles.exerciseTitle}>
                  Work in pairs. Read your sentences and guess your partner’s objects.
                </p>
              </div>
              <div className={styles.speakPromptBox}>
                <p><strong>Example dialogue:</strong></p>
                <div className={styles.sampleDialogue}>
                  <span><strong>A:</strong> It’s on the table.</span>
                  <span><strong>B:</strong> Is it a book?</span>
                  <span><strong>A:</strong> Yes, it is! / No, it isn’t.</span>
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* SECTION 2: LISTENING - TONY & CAMILLA                     */}
          {/* ======================================================== */}
          <section className={styles.lessonSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Listening: Family photo</h2>
            </div>

            <div className={styles.familyPortraitContainer}>
              {/* Family Photo Card */}
              <div className={styles.familyPhotoCard}>
                <div className={styles.familyPhotoImg}>
                  <Image
                    src="/images/lesson9a/family_portrait.png"
                    alt="Tony's family photo"
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </div>
                <div className={styles.familyPhotoLegend}>
                  <span><span className={styles.numberMarker}>1</span> Person 1</span>
                  <span><span className={styles.numberMarker}>2</span> Person 2</span>
                  <span><span className={styles.numberMarker}>3</span> Person 3</span>
                  <span><span className={styles.numberMarker}>4</span> Person 4</span>
                </div>
              </div>

              {/* Exercise 3a */}
              <div className={styles.exerciseSection}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exerciseNum}>3a</span>
                  <p className={styles.exerciseTitle}>
                    Look at the photo and listen to Tony and Camilla. Label 1–4: <em>Tony, Agnes, Carol and Pat</em>.
                  </p>
                  <button
                    type="button"
                    className={styles.audioBtn}
                    onClick={() => handleAudioToggle('9.2')}
                    disabled={!playAudio}
                  >
                    {playingAudio === '9.2' ? '⏸ Pause Audio 9.2' : '▶ Audio 9.2'}
                  </button>
                </div>

                <div className={styles.labelsList}>
                  {['1', '2', '3', '4'].map((num) => {
                    const val = ex3aAnswers[num] || '';
                    const origVal = origEx3a[num];
                    const res = verify('exercise_3a_labels', num, val);
                    const isFieldDiff = isDiff(origVal, val);

                    return (
                      <div key={num} className={styles.labelRow}>
                        <span className={styles.markerBadge}>{num}</span>
                        <select
                          className={`${styles.selectInput} ${
                            isFieldDiff ? styles.diffHighlight : ''
                          } ${
                            res ? (res.isCorrect ? styles.fieldCorrect : styles.fieldIncorrect) : ''
                          }`}
                          value={val}
                          disabled={readOnly}
                          onChange={(e) =>
                            setAnswerField('exercise_3a_labels', num, e.target.value)
                          }
                        >
                          <option value="">Select name...</option>
                          {['Tony', 'Agnes', 'Carol', 'Pat'].map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                        {res?.isCorrect && (
                          <span className={styles.correctBadge}>✓ Correct</span>
                        )}
                        {res && !res.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={res} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Exercise 3b */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>3b</span>
                <p className={styles.exerciseTitle}>
                  Listen again. Who says a–e, Tony (T) or Camilla (C)?
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.2')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.2' ? '⏸ Pause Audio 9.2' : '▶ Audio 9.2'}
                </button>
              </div>

              <div className={styles.dialogueSpeakersList}>
                {DIALOGUE_3B.map((item) => {
                  const val = ex3bAnswers[item.id] || '';
                  const origVal = origEx3b[item.id];
                  const res = verify('exercise_3b_speakers', item.id, val);
                  const isFieldDiff = isDiff(origVal, val);

                  return (
                    <div key={item.id} className={styles.dialogueSpeakerRow}>
                      <div className={styles.dialogueText}>
                        <strong>{item.id}</strong> {item.line}
                      </div>
                      <div className={styles.speakerRadioGroup}>
                        {['T', 'C'].map((speaker) => (
                          <button
                            key={speaker}
                            type="button"
                            className={`${styles.speakerLabel} ${
                              val === speaker ? styles.activeSpeaker : ''
                            } ${isFieldDiff ? styles.diffHighlight : ''}`}
                            disabled={readOnly}
                            onClick={() =>
                              setAnswerField('exercise_3b_speakers', item.id, speaker)
                            }
                          >
                            {speaker === 'T' ? 'Tony (T)' : 'Camilla (C)'}
                          </button>
                        ))}
                        {res?.isCorrect && (
                          <span className={styles.correctBadge}>✓</span>
                        )}
                      </div>
                      {res && !res.isCorrect && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={res} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 3c */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>3c</span>
                <p className={styles.exerciseTitle}>
                  Look at the words in bold in Exercise 3b. Which people are they?
                </p>
              </div>

              <div className={styles.referentsGrid}>
                {REFERENTS_3C.map((ref) => {
                  const val = ex3cAnswers[ref.id] || '';
                  const origVal = origEx3c[ref.id];
                  const res = verify('exercise_3c_referents', ref.id, val);
                  const isFieldDiff = isDiff(origVal, val);

                  return (
                    <div key={ref.id} className={styles.referentItem}>
                      <div className={styles.referentPrompt}>
                        <span>{ref.context}</span> &rarr; Who is it?
                      </div>
                      <input
                        type="text"
                        className={`${styles.textInput} ${
                          isFieldDiff ? styles.diffHighlight : ''
                        } ${
                          res ? (res.isCorrect ? styles.fieldCorrect : styles.fieldIncorrect) : ''
                        }`}
                        value={val}
                        disabled={readOnly}
                        placeholder=""
                        onChange={(e) =>
                          setAnswerField('exercise_3c_referents', ref.id, e.target.value)
                        }
                      />
                      {res?.isCorrect && (
                        <span className={styles.correctBadge}>✓ Correct</span>
                      )}
                      {res && !res.isCorrect && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={res} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* SECTION 3: GRAMMAR - OBJECT PRONOUNS                      */}
          {/* ======================================================== */}
          <section className={styles.lessonSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Grammar: Object pronouns</h2>
            </div>

            {/* Exercise 4: Grammar Box */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>4</span>
                <p className={styles.exerciseTitle}>
                  Read the grammar box and choose the correct alternatives.
                </p>
              </div>

              <div className={styles.grammarBox}>
                <h3 className={styles.grammarBoxTitle}>
                  Object pronouns (<em>me, him, her, etc.</em>)
                </h3>

                <div className={styles.grammarRules}>
                  {(() => {
                    const rule1Res = verify('exercise_4_rules', 'rule_1', ex4RulesAnswers.rule_1 || '');
                    const rule2Res = verify('exercise_4_rules', 'rule_2', ex4RulesAnswers.rule_2 || '');

                    return (
                      <>
                        <div className={styles.grammarRuleRow}>
                          <span>• Use subject pronouns:</span>
                          <button
                            type="button"
                            className={`${styles.choiceBtn} ${
                              ex4RulesAnswers.rule_1 === 'before' ? styles.activeChoice : ''
                            } ${isDiff(origEx4Rules.rule_1, ex4RulesAnswers.rule_1) ? styles.diffHighlight : ''}`}
                            disabled={readOnly}
                            onClick={() => setAnswerField('exercise_4_rules', 'rule_1', 'before')}
                          >
                            before
                          </button>
                          <span>/</span>
                          <button
                            type="button"
                            className={`${styles.choiceBtn} ${
                              ex4RulesAnswers.rule_1 === 'after' ? styles.activeChoice : ''
                            } ${isDiff(origEx4Rules.rule_1, ex4RulesAnswers.rule_1) ? styles.diffHighlight : ''}`}
                            disabled={readOnly}
                            onClick={() => setAnswerField('exercise_4_rules', 'rule_1', 'after')}
                          >
                            after
                          </button>
                          <span>the verb: <em>I live in London.</em></span>
                          {rule1Res?.isCorrect && (
                            <span className={styles.correctBadge}>✓</span>
                          )}
                        </div>
                        {rule1Res && !rule1Res.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={rule1Res} />
                          </div>
                        )}

                        <div className={styles.grammarRuleRow}>
                          <span>• Use object pronouns:</span>
                          <button
                            type="button"
                            className={`${styles.choiceBtn} ${
                              ex4RulesAnswers.rule_2 === 'before' ? styles.activeChoice : ''
                            } ${isDiff(origEx4Rules.rule_2, ex4RulesAnswers.rule_2) ? styles.diffHighlight : ''}`}
                            disabled={readOnly}
                            onClick={() => setAnswerField('exercise_4_rules', 'rule_2', 'before')}
                          >
                            before
                          </button>
                          <span>/</span>
                          <button
                            type="button"
                            className={`${styles.choiceBtn} ${
                              ex4RulesAnswers.rule_2 === 'after' ? styles.activeChoice : ''
                            } ${isDiff(origEx4Rules.rule_2, ex4RulesAnswers.rule_2) ? styles.diffHighlight : ''}`}
                            disabled={readOnly}
                            onClick={() => setAnswerField('exercise_4_rules', 'rule_2', 'after')}
                          >
                            after
                          </button>
                          <span>the verb: <em>My parents visit me at the weekend.</em></span>
                          {rule2Res?.isCorrect && (
                            <span className={styles.correctBadge}>✓</span>
                          )}
                        </div>
                        {rule2Res && !rule2Res.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={rule2Res} />
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                <table className={styles.grammarTable}>
                  <thead>
                    <tr>
                      <th>Subject pronouns</th>
                      <th>Object pronouns</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRONOUNS_TABLE_DATA.map((row) => {
                      const val = ex4TableAnswers[row.key] || '';
                      const origVal = origEx4Table[row.key];
                      const res = verify('exercise_4_pronouns_table', row.key, val);
                      const isFieldDiff = isDiff(origVal, val);

                      return (
                        <tr key={row.key}>
                          <td>{row.subject}</td>
                          <td>
                            <input
                              type="text"
                              className={`${styles.textInput} ${
                                isFieldDiff ? styles.diffHighlight : ''
                              } ${
                                res ? (res.isCorrect ? styles.fieldCorrect : styles.fieldIncorrect) : ''
                              }`}
                              value={val}
                              disabled={readOnly}
                              placeholder=""
                              onChange={(e) =>
                                setAnswerField('exercise_4_pronouns_table', row.key, e.target.value)
                              }
                            />
                            {res?.isCorrect && (
                              <span className={styles.correctBadge}>✓</span>
                            )}
                            {res && !res.isCorrect && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={res} />
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

            {/* Exercise 5a & 5b: Pronunciation */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>5a</span>
                <p className={styles.exerciseTitle}>
                  Listen to the sentences. Are the pronouns in blue <strong>stressed</strong> or <strong>unstressed</strong>?
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.3')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.3' ? '⏸ Pause Audio 9.3' : '▶ Audio 9.3'}
                </button>
              </div>

              <div className={styles.matchingList}>
                {STRESS_5A_ITEMS.map((item) => {
                  const val = ex5aAnswers[item.id] || '';
                  const origVal = origEx5a[item.id];
                  const res = verify('exercise_5a_stress', item.id, val);
                  const isFieldDiff = isDiff(origVal, val);

                  return (
                    <div key={item.id} className={styles.matchingItem}>
                      <div className={styles.matchingSentence}>
                        <strong>{item.id}</strong> {item.sentence}
                      </div>
                      <div className={styles.matchingControl}>
                        {['stressed', 'unstressed'].map((choice) => (
                          <button
                            key={choice}
                            type="button"
                            className={`${styles.choiceBtn} ${
                              val === choice ? styles.activeChoice : ''
                            } ${isFieldDiff ? styles.diffHighlight : ''}`}
                            disabled={readOnly}
                            onClick={() =>
                              setAnswerField('exercise_5a_stress', item.id, choice)
                            }
                          >
                            {choice}
                          </button>
                        ))}
                        {res?.isCorrect && (
                          <span className={styles.correctBadge}>✓</span>
                        )}
                      </div>
                      {res && !res.isCorrect && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={res} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>5b</span>
                <p className={styles.exerciseTitle}>
                  Listen again and repeat. Practice the unstressed weak forms of <em>them, him, her</em>.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.3')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.3' ? '⏸ Pause Audio 9.3' : '▶ Audio 9.3'}
                </button>
              </div>
            </div>

            {/* Exercise 6: Dialogue Alternatives */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>6</span>
                <p className={styles.exerciseTitle}>
                  Choose the correct alternatives to complete the dialogue.
                </p>
              </div>

              <div className={styles.dialogueBox}>
                {/* Line 1 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.dialogueSpeakerName}>Jenna:</span>
                  <div className={styles.dialogueContent}>
                    Where does your family live, Miguel?
                  </div>
                </div>

                {/* Line 2 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.dialogueSpeakerName}>Miguel:</span>
                  <div className={styles.dialogueContent}>
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['1'] === 'They' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['1'], ex6Answers['1']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '1', 'They')}
                    >
                      ¹They
                    </button>
                    /
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['1'] === 'Them' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['1'], ex6Answers['1']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '1', 'Them')}
                    >
                      Them
                    </button>
                    {verify('exercise_6_alternatives', '1', ex6Answers['1'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                    {' '}live in Acapulco in Mexico.
                  </div>
                </div>
                {(() => {
                  const res = verify('exercise_6_alternatives', '1', ex6Answers['1'] || '');
                  return res && !res.isCorrect ? (
                    <div className={styles.feedbackRow}>
                      <TeacherAnswerBadge result={res} />
                    </div>
                  ) : null;
                })()}

                {/* Line 3 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.dialogueSpeakerName}>Jenna:</span>
                  <div className={styles.dialogueContent}>
                    Wow! Do you often talk to{' '}
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['2'] === 'they' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['2'], ex6Answers['2']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '2', 'they')}
                    >
                      ²they
                    </button>
                    /
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['2'] === 'them' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['2'], ex6Answers['2']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '2', 'them')}
                    >
                      them
                    </button>
                    {verify('exercise_6_alternatives', '2', ex6Answers['2'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                    ?
                  </div>
                </div>
                {(() => {
                  const res = verify('exercise_6_alternatives', '2', ex6Answers['2'] || '');
                  return res && !res.isCorrect ? (
                    <div className={styles.feedbackRow}>
                      <TeacherAnswerBadge result={res} />
                    </div>
                  ) : null;
                })()}

                {/* Line 4 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.dialogueSpeakerName}>Miguel:</span>
                  <div className={styles.dialogueContent}>
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['3'] === 'I' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['3'], ex6Answers['3']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '3', 'I')}
                    >
                      ³I
                    </button>
                    /
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['3'] === 'Me' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['3'], ex6Answers['3']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '3', 'Me')}
                    >
                      Me
                    </button>
                    {verify('exercise_6_alternatives', '3', ex6Answers['3'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                    {' '}often talk to my mum.{' '}
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['4'] === 'I' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['4'], ex6Answers['4']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '4', 'I')}
                    >
                      ⁴I
                    </button>
                    /
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['4'] === 'Me' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['4'], ex6Answers['4']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '4', 'Me')}
                    >
                      Me
                    </button>
                    {verify('exercise_6_alternatives', '4', ex6Answers['4'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                    {' '}talk to{' '}
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['5'] === 'she' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['5'], ex6Answers['5']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '5', 'she')}
                    >
                      ⁵she
                    </button>
                    /
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['5'] === 'her' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['5'], ex6Answers['5']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '5', 'her')}
                    >
                      her
                    </button>
                    {verify('exercise_6_alternatives', '5', ex6Answers['5'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                    {' '}on my computer every weekend. My dad doesn’t like computers, so I don’t often talk to{' '}
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['6'] === 'he' ? styles.activeChoice : ''
                      }`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '6', 'he')}
                    >
                      ⁶he
                    </button>
                    /
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['6'] === 'him' ? styles.activeChoice : ''
                      }`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '6', 'him')}
                    >
                      him
                    </button>
                    {verify('exercise_6_alternatives', '6', ex6Answers['6'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                    .
                  </div>
                </div>
                {(() => {
                  const r3 = verify('exercise_6_alternatives', '3', ex6Answers['3'] || '');
                  const r4 = verify('exercise_6_alternatives', '4', ex6Answers['4'] || '');
                  const r5 = verify('exercise_6_alternatives', '5', ex6Answers['5'] || '');
                  const r6 = verify('exercise_6_alternatives', '6', ex6Answers['6'] || '');

                  const hasError = (r3 && !r3.isCorrect) || (r4 && !r4.isCorrect) || (r5 && !r5.isCorrect) || (r6 && !r6.isCorrect);
                  if (!hasError) return null;

                  return (
                    <div className={styles.feedbackRow}>
                      {r3 && !r3.isCorrect && <TeacherAnswerBadge result={r3} />}
                      {r4 && !r4.isCorrect && <TeacherAnswerBadge result={r4} />}
                      {r5 && !r5.isCorrect && <TeacherAnswerBadge result={r5} />}
                      {r6 && !r6.isCorrect && <TeacherAnswerBadge result={r6} />}
                    </div>
                  );
                })()}

                {/* Line 5 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.dialogueSpeakerName}>Jenna:</span>
                  <div className={styles.dialogueContent}>
                    Have you got a photograph of your family?
                  </div>
                </div>

                {/* Line 6 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.dialogueSpeakerName}>Miguel:</span>
                  <div className={styles.dialogueContent}>
                    Yeah, I’ve got a photo of{' '}
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['7'] === 'we' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['7'], ex6Answers['7']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '7', 'we')}
                    >
                      ⁷we
                    </button>
                    /
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['7'] === 'us' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['7'], ex6Answers['7']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '7', 'us')}
                    >
                      us
                    </button>
                    {verify('exercise_6_alternatives', '7', ex6Answers['7'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                    {' '}on my phone.
                  </div>
                </div>
                {(() => {
                  const res = verify('exercise_6_alternatives', '7', ex6Answers['7'] || '');
                  return res && !res.isCorrect ? (
                    <div className={styles.feedbackRow}>
                      <TeacherAnswerBadge result={res} />
                    </div>
                  ) : null;
                })()}

                {/* Line 7 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.dialogueSpeakerName}>Jenna:</span>
                  <div className={styles.dialogueContent}>
                    Oh yeah. Is this your dad?
                  </div>
                </div>

                {/* Line 8 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.dialogueSpeakerName}>Miguel:</span>
                  <div className={styles.dialogueContent}>
                    Yeah.
                  </div>
                </div>

                {/* Line 9 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.dialogueSpeakerName}>Jenna:</span>
                  <div className={styles.dialogueContent}>
                    Who’s this in front of{' '}
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['8'] === 'him' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['8'], ex6Answers['8']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '8', 'him')}
                    >
                      ⁸him
                    </button>
                    /
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['8'] === 'he' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['8'], ex6Answers['8']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '8', 'he')}
                    >
                      he
                    </button>
                    {verify('exercise_6_alternatives', '8', ex6Answers['8'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                    ?
                  </div>
                </div>
                {(() => {
                  const res = verify('exercise_6_alternatives', '8', ex6Answers['8'] || '');
                  return res && !res.isCorrect ? (
                    <div className={styles.feedbackRow}>
                      <TeacherAnswerBadge result={res} />
                    </div>
                  ) : null;
                })()}

                {/* Line 10 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.dialogueSpeakerName}>Miguel:</span>
                  <div className={styles.dialogueContent}>
                    That’s my sister.{' '}
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['9'] === 'She' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['9'], ex6Answers['9']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '9', 'She')}
                    >
                      ⁹She
                    </button>
                    /
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['9'] === 'Her' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['9'], ex6Answers['9']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '9', 'Her')}
                    >
                      Her
                    </button>
                    {verify('exercise_6_alternatives', '9', ex6Answers['9'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                    {' '}is a teacher.{' '}
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['10'] === 'She' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['10'], ex6Answers['10']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '10', 'She')}
                    >
                      ¹⁰She
                    </button>
                    /
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['10'] === 'Her' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['10'], ex6Answers['10']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '10', 'Her')}
                    >
                      Her
                    </button>
                    {verify('exercise_6_alternatives', '10', ex6Answers['10'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                    {' '}sometimes calls{' '}
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['11'] === 'me' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['11'], ex6Answers['11']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '11', 'me')}
                    >
                      ¹¹me
                    </button>
                    /
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['11'] === 'I' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['11'], ex6Answers['11']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '11', 'I')}
                    >
                      I
                    </button>
                    {verify('exercise_6_alternatives', '11', ex6Answers['11'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                    , but{' '}
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['12'] === 'we' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['12'], ex6Answers['12']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '12', 'we')}
                    >
                      ¹²we
                    </button>
                    /
                    <button
                      type="button"
                      className={`${styles.choiceBtn} ${
                        ex6Answers['12'] === 'us' ? styles.activeChoice : ''
                      } ${isDiff(origEx6['12'], ex6Answers['12']) ? styles.diffHighlight : ''}`}
                      disabled={readOnly}
                      onClick={() => setAnswerField('exercise_6_alternatives', '12', 'us')}
                    >
                      us
                    </button>
                    {verify('exercise_6_alternatives', '12', ex6Answers['12'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                    {' '}usually just send emails.
                  </div>
                </div>
                {(() => {
                  const r9 = verify('exercise_6_alternatives', '9', ex6Answers['9'] || '');
                  const r10 = verify('exercise_6_alternatives', '10', ex6Answers['10'] || '');
                  const r11 = verify('exercise_6_alternatives', '11', ex6Answers['11'] || '');
                  const r12 = verify('exercise_6_alternatives', '12', ex6Answers['12'] || '');

                  const hasError = (r9 && !r9.isCorrect) || (r10 && !r10.isCorrect) || (r11 && !r11.isCorrect) || (r12 && !r12.isCorrect);
                  if (!hasError) return null;

                  return (
                    <div className={styles.feedbackRow}>
                      {r9 && !r9.isCorrect && <TeacherAnswerBadge result={r9} />}
                      {r10 && !r10.isCorrect && <TeacherAnswerBadge result={r10} />}
                      {r11 && !r11.isCorrect && <TeacherAnswerBadge result={r11} />}
                      {r12 && !r12.isCorrect && <TeacherAnswerBadge result={r12} />}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Exercise 7 */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>7</span>
                <p className={styles.exerciseTitle}>
                  Work in pairs. Ask and answer the questions. Use object pronouns in your answers.
                </p>
              </div>

              <div className={styles.questionsList}>
                {QUESTIONS_7.map((item) => {
                  const val = ex7Answers[item.id] || '';
                  return (
                    <div key={item.id} className={styles.questionCard}>
                      <div className={styles.questionText}>{item.q}</div>
                      {item.example && (
                        <div className={styles.speakPromptBox}>
                          <p><em>Example: {item.example}</em></p>
                        </div>
                      )}
                      <input
                        type="text"
                        className={styles.textInput}
                        value={val}
                        disabled={readOnly}
                        placeholder=""
                        onChange={(e) =>
                          setAnswerField('exercise_7_questions', item.id, e.target.value)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* SECTION 4: SPEAKING - PREPARE & SPEAK                     */}
          {/* ======================================================== */}
          <section className={styles.lessonSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Speaking: People in a photo</h2>
            </div>

            {/* Exercise 8: PREPARE */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>8</span>
                <p className={styles.exerciseTitle}>
                  <strong>PREPARE:</strong> Find a photo of your family or friends, or choose one of these photos. Prepare to talk about the people in the photo.
                </p>
              </div>

              <div className={styles.speakingGallery}>
                <div
                  className={`${styles.speakingCard} ${
                    ex8Photo === 'park' ? styles.selectedSpeakingCard : ''
                  }`}
                  onClick={() => !readOnly && setAnswer('exercise_8_photo', 'park')}
                >
                  <div className={styles.speakingPhotoImg}>
                    <Image
                      src="/images/lesson9a/speaking_park.png"
                      alt="Family in the park"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className={styles.speakingCardInfo}>
                    <span>Photo 1: Family outdoors in the park</span>
                    {ex8Photo === 'park' && <span className={styles.correctBadge}>Selected</span>}
                  </div>
                </div>

                <div
                  className={`${styles.speakingCard} ${
                    ex8Photo === 'cafe' ? styles.selectedSpeakingCard : ''
                  }`}
                  onClick={() => !readOnly && setAnswer('exercise_8_photo', 'cafe')}
                >
                  <div className={styles.speakingPhotoImg}>
                    <Image
                      src="/images/lesson9a/speaking_cafe.png"
                      alt="Family in the cafe"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className={styles.speakingCardInfo}>
                    <span>Photo 2: Family gathering at a cafe</span>
                    {ex8Photo === 'cafe' && <span className={styles.correctBadge}>Selected</span>}
                  </div>
                </div>
              </div>

              <div className={styles.exerciseSection}>
                <p className={styles.exerciseTitle}>
                  Write notes about the people in your selected photo (Who are they? Where are they? How often do you see them?):
                </p>
                <textarea
                  className={styles.notesArea}
                  value={ex8Notes}
                  disabled={readOnly}
                  placeholder=""
                  onChange={(e) => setAnswer('exercise_8_notes', e.target.value)}
                />
              </div>
            </div>

            {/* Exercise 9: SPEAK */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>9</span>
                <p className={styles.exerciseTitle}>
                  <strong>SPEAK:</strong> Work in pairs. Take turns talking about your photo. Ask questions about your partner’s photo. Record your spoken talk for your teacher.
                </p>
              </div>

              <div className={styles.speakPromptBox}>
                <p><strong>Useful dialogue prompts:</strong></p>
                <div className={styles.sampleDialogue}>
                  <span><strong>A:</strong> This is my father.</span>
                  <span><strong>B:</strong> What’s his name?</span>
                  <span><strong>A:</strong> Ivan.</span>
                  <span><strong>B:</strong> How often do you see him?</span>
                  <span><strong>A:</strong> We visit him once a month.</span>
                </div>
              </div>

              {/* Audio Answer Recorder for student oral submission */}
              <div style={{ marginTop: '1rem' }}>
                <AudioAnswerRecorder
                  onAudioChange={(blob: Blob | null, mime: string) =>
                    onAudioBlobChange?.(blob, mime, 'speaking_9a_family')
                  }
                  readOnly={readOnly}
                />

                {submissionId && submittedAudios.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <SubmissionAudioPlayer
                      audios={submittedAudios}
                      submissionId={submissionId}
                      exerciseKey="speaking_9a_family"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Badge Develop your reading */}
            <div className={styles.developReadingBadge}>
              <div className={styles.badgeImgWrapper}>
                <Image
                  src="/images/lesson9a/badge_develop_reading.png"
                  alt="Develop your reading - page 110"
                  fill
                  sizes="160px"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
