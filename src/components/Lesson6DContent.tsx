'use client';

import React, { useState } from 'react';
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
import styles from './lesson6d.module.scss';

export interface Lesson6DContentProps {
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

export const FALLBACK_ANSWER_KEY_6D: LessonAnswerKey = {
  exercise_1_jobs: {
    A: ['wash the dishes', 'wash dishes', 'do the washing up', 'washing up'],
    B: ['go to the supermarket', 'buy food', 'supermarket'],
    C: ['walk the dog', 'feed the dog'],
    D: ['do the washing', 'wash clothes'],
    E: ['clean the bathroom'],
    F: ['make the bed', 'make the beds'],
  },
  exercise_2_matching: {
    '1': ['C', 'c', 'Picture C'],
    '2': ['E', 'e', 'Picture E'],
    '3': ['D', 'd', 'Picture D'],
    '4': ['B', 'b', 'Picture B'],
    '5': ['F', 'f', 'Picture F'],
    '6': ['A', 'a', 'Picture A'],
  },
  exercise_3_who: {
    '1': ['T', 't', 'Tom'],
    '2': ['T', 't', 'Tom'],
    '3': ['T', 't', 'Tom'],
    '4': ['A', 'a', 'Ana'],
    '5': ['A', 'a', 'Ana'],
    '6': ['A', 'a', 'Ana'],
  },
  exercise_4a_requests: {
    count: ['8', 'eight'],
  },
  exercise_5a_dialogue: {
    '1a': ['Can you'],
    '1b': ['Sure', 'Yes, I can', 'No problem'],
    '2a': ['Can I'],
    '2b': ['Yes, you can', 'Sure', 'No problem'],
    '3a': ['Can I'],
    '3b': ["I'm sorry, you can't", "I'm sorry, I can't"],
    '4a': ['Can you'],
    '4b': ["I'm sorry, I can't"],
  },
  check_1_time_phrases: {
    '1': ['c', 'C'],
    '2': ['e', 'E'],
    '3': ['d', 'D'],
    '4': ['a', 'A'],
    '5': ['b', 'B'],
    '6': ['f', 'F'],
  },
  check_2_text: {
    '1': ['in the morning'],
    '2': ['in the afternoon'],
    '3': ['In the evening', 'in the evening'],
    '4': ['at the weekend'],
  },
  check_3_verbs: {
    '1': ['works'],
    '2': ['gets up'],
    '3': ['travels'],
    '4': ["doesn't talk", 'does not talk'],
    '5': ['draws'],
    '6': ['reads'],
    '7': ["doesn't have", 'does not have'],
    '8': ['buys'],
    '9': ['eats'],
    '10': ['has'],
    '11': ['watches'],
    '12': ['goes'],
  },
  check_4_negatives: {
    '1': [
      "Julio doesn't study French.",
      "Julio doesn't study French",
      'Julio does not study French.',
    ],
    '2': [
      "She doesn't work in an office.",
      "She doesn't work in an office",
      'She does not work in an office.',
    ],
    '3': [
      "Aleksi doesn't listen to music on the train.",
      "Aleksi doesn't listen to music on the train",
      'Aleksi does not listen to music on the train.',
    ],
    '4': [
      "Linda doesn't teach at the university.",
      "Linda doesn't teach at the university",
      'Linda does not teach at the university.',
    ],
    '5': [
      "Amy doesn't take the bus to work.",
      "Amy doesn't take the bus to work",
      'Amy does not take the bus to work.',
    ],
    '6': [
      "Juan doesn't work in the evening.",
      "Juan doesn't work in the evening",
      'Juan does not work in the evening.',
    ],
    '7': [
      "Lizzie doesn't study in the evening.",
      "Lizzie doesn't study in the evening",
      'Lizzie does not study in the evening.',
    ],
    '8': [
      "Luke doesn't work in the morning.",
      "Luke doesn't work in the morning",
      'Luke does not work in the morning.',
    ],
    '9': [
      "Jane doesn't have lunch at home.",
      "Jane doesn't have lunch at home",
      'Jane does not have lunch at home.',
    ],
    '10': [
      "Danny doesn't watch a lot of TV.",
      "Danny doesn't watch a lot of TV",
      'Danny does not watch a lot of TV.',
    ],
  },
  check_5_match: {
    '1': ['d', 'D'],
    '2': ['c', 'C'],
    '3': ['a', 'A'],
    '4': ['b', 'B'],
    '5': ['f', 'F'],
    '6': ['g', 'G'],
    '7': ['e', 'E'],
  },
  check_6a_questions: {
    '1_aux': ['do', 'Do'],
    '1_match': ['f', 'F'],
    '2_aux': ['do', 'Do'],
    '2_match': ['d', 'D'],
    '3_aux': ['does', 'Does'],
    '3_match': ['a', 'A'],
    '4_aux': ['does', 'Does'],
    '4_match': ['e', 'E'],
    '5_aux': ['does', 'Does'],
    '5_match': ['b', 'B'],
    '6_aux': ['do', 'Do'],
    '6_match': ['c', 'C'],
  },
  check_7a_verbs: {
    '1': ['sing', 'Sing'],
    '2': ['cook', 'Cook'],
    '3': ['play', 'Play'],
    '4': ['speak', 'Speak'],
    '5': ['fly', 'Fly'],
    '6': ['build', 'Build'],
    '7': ['ride', 'Ride'],
    '8': ['use', 'Use'],
    '9': ['draw', 'Draw'],
    '10': ['sleep', 'Sleep'],
  },
  check_8a_animals: {
    '1': ['can', 'Can'],
    '2': ["can't", "can’t", 'cannot'],
    '3': ['can', 'Can'],
    '4': ["can't", "can’t", 'cannot'],
    '5': ['can', 'Can'],
    '6': ["can't", "can’t", 'cannot'],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const FLAT_PHOTOS = [
  { id: 'A', src: '/images/lesson6d/flat_a_dishes.png', defaultJob: 'wash the dishes' },
  { id: 'B', src: '/images/lesson6d/flat_b_fridge.png', defaultJob: 'go to the supermarket' },
  { id: 'C', src: '/images/lesson6d/flat_c_dog.png', defaultJob: 'walk the dog' },
  { id: 'D', src: '/images/lesson6d/flat_d_laundry.png', defaultJob: 'do the washing' },
  { id: 'E', src: '/images/lesson6d/flat_e_bathroom.png', defaultJob: 'clean the bathroom' },
  { id: 'F', src: '/images/lesson6d/flat_f_bed.png', defaultJob: 'make the bed' },
];

export default function Lesson6DContent({
  isTeacherReview = false,
  readOnly = false,
  answerKey: propAnswerKey,
  playAudio: parentPlayAudio,
  playingAudio: parentPlayingAudio,
  originalAnswers = {},
  onAudioBlobChange,
  submissionId,
  submittedAudios,
}: Lesson6DContentProps) {
  const context = useLessonContext();
  const [localAnswers, setLocalAnswers] = useState<Record<string, unknown>>({});
  const [internalPlayingAudio, setInternalPlayingAudio] = useState<string | null>(null);

  const activeAnswerKey =
    propAnswerKey ||
    (context?.answerKey as LessonAnswerKey) ||
    (context?.lesson?.answerKey as LessonAnswerKey) ||
    FALLBACK_ANSWER_KEY_6D;

  const effectiveAnswers = context?.answers || localAnswers;
  const isReview = Boolean(isTeacherReview || (activeAnswerKey && readOnly));

  const effectivePlayAudio = parentPlayAudio || context?.playAudio || ((track: string) => {
    setInternalPlayingAudio((prev) => (prev === track ? null : track));
  });
  const currentPlayingAudio =
    parentPlayingAudio !== undefined ? parentPlayingAudio : (context?.playingAudio ?? internalPlayingAudio);

  const handleAudioToggle = (track: string) => {
    effectivePlayAudio(track);
  };

  const getFieldValue = (exerciseKey: string, field: string): string => {
    const exData = getRecord(effectiveAnswers[exerciseKey]);
    return exData[field] || '';
  };

  const handleFieldChange = (exerciseKey: string, field: string, value: string) => {
    if (readOnly) return;
    if (context?.setAnswerField) {
      context.setAnswerField(exerciseKey, field, value);
    } else {
      setLocalAnswers((prev: Record<string, unknown>) => {
        const exData = getRecord(prev[exerciseKey]);
        return {
          ...prev,
          [exerciseKey]: {
            ...exData,
            [field]: value,
          },
        };
      });
    }
  };

  const renderVerification = (
    exKey: string,
    field: string,
    currentVal: string
  ) => {
    if (!isReview) return null;
    const keyData = getExerciseKey(activeAnswerKey, exKey);
    const result: VerificationResult = verifyAnswer(currentVal, keyData?.[field]);
    const origVal = (getRecord(originalAnswers[exKey]) || {})[field];
    const isDiff = Boolean(origVal !== undefined && origVal !== currentVal);

    return (
      <div className={styles.feedbackRow}>
        {result.status === 'correct' ? (
          <span className={styles.correctBadge}>✓ Correct</span>
        ) : (
          <TeacherAnswerBadge result={result} />
        )}
        {isDiff && origVal && (
          <span className={styles.diffHighlight}>Originally: {origVal}</span>
        )}
      </div>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Header Banner 6D */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <span className={styles.badge6D}>6D</span>
            <h1 className={styles.headerTitle}>English in action &amp; Check and reflect</h1>
          </div>
          <div className={styles.goalsCard}>
            <div className={styles.goalItem}>
              <strong>Goal:</strong> make requests
            </div>
            <div className={styles.goalItem}>
              <strong>Check &amp; Reflect:</strong> comprehensive review of Unit 6
            </div>
          </div>
        </header>

        <div className={styles.pageBody}>
          {/* Section: Tom and Ana's Flat */}
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Jobs in Tom and Ana&apos;s Flat</h2>
              <button
                type="button"
                className={styles.audioBtn}
                onClick={() => handleAudioToggle('6.17')}
              >
                {currentPlayingAudio === '6.17' ? '⏸ Playing 6.17' : '▶ Audio 6.17'}
              </button>
            </div>

            {/* Flat Pictures Grid A-F (Ex 1) */}
            <div className={styles.flatGrid}>
              {FLAT_PHOTOS.map((pic) => {
                const val = getFieldValue('exercise_1_jobs', pic.id);
                return (
                  <div key={pic.id} className={styles.flatCard}>
                    <div className={styles.flatImageWrapper}>
                      <Image
                        src={pic.src}
                        alt={`Picture ${pic.id}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className={styles.flatImage}
                      />
                      <span className={styles.flatBadge}>{pic.id}</span>
                    </div>
                    <div className={styles.flatCaption}>
                      <input
                        type="text"
                        className={styles.textInput}
                        placeholder="Name household job..."
                        value={val}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleFieldChange('exercise_1_jobs', pic.id, e.target.value)
                        }
                      />
                      {renderVerification('exercise_1_jobs', pic.id, val)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Exercise 2: Audio 6.17 Match conversations with pictures */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>2</span>
                <p className={styles.exercisePrompt}>
                  Listen and match conversations 1–6 with pictures A–F in Exercise 1.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('6.17')}
                >
                  {currentPlayingAudio === '6.17' ? '⏸ Playing 6.17' : '▶ Audio 6.17'}
                </button>
              </div>

              <div className={styles.matchingList}>
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const numStr = String(num);
                  const matchVal = getFieldValue('exercise_2_matching', numStr);
                  return (
                    <div key={num} className={styles.matchingRow}>
                      <span className={styles.matchingNum}>Convo {num}:</span>
                      <span className={styles.matchingText}>Picture:</span>
                      <select
                        className={styles.letterSelect}
                        value={matchVal}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleFieldChange('exercise_2_matching', numStr, e.target.value)
                        }
                      >
                        <option value="">Picture...</option>
                        {['A', 'B', 'C', 'D', 'E', 'F'].map((l) => (
                          <option key={l} value={l}>
                            Picture {l}
                          </option>
                        ))}
                      </select>
                      {renderVerification(
                        'exercise_2_matching',
                        numStr,
                        matchVal
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 3: Who agrees to do the jobs */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>3</span>
                <p className={styles.exercisePrompt}>
                  Listen again. Who agrees to do the jobs in Exercise 1, Tom or Ana? Write <em>T</em> or <em>A</em>.
                </p>
              </div>

              <div className={styles.matchingList}>
                {[
                  { num: '1', task: 'Convo 1 (walk dog):' },
                  { num: '2', task: 'Convo 2 (clean bathroom):' },
                  { num: '3', task: 'Convo 3 (do washing):' },
                  { num: '4', task: 'Convo 4 (go to supermarket):' },
                  { num: '5', task: 'Convo 5 (make bed):' },
                  { num: '6', task: 'Convo 6 (wash dishes):' },
                ].map((item) => {
                  const whoVal = getFieldValue('exercise_3_who', item.num);
                  return (
                    <div key={item.num} className={styles.matchingRow}>
                      <span className={styles.matchingNum}>{item.num}</span>
                      <span className={styles.matchingText}>{item.task}</span>
                      <select
                        className={styles.letterSelect}
                        value={whoVal}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleFieldChange('exercise_3_who', item.num, e.target.value)
                        }
                      >
                        <option value="">Who agrees?</option>
                        <option value="T">Tom (T)</option>
                        <option value="A">Ana (A)</option>
                      </select>
                      {renderVerification('exercise_3_who', item.num, whoVal)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 4: Useful Phrases */}
            <div className={styles.usefulPhrasesBox}>
              <div className={styles.exerciseTitleRow}>
                <h3 className={styles.usefulTitle}>Useful Phrases: Making Requests</h3>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('6.18')}
                >
                  {currentPlayingAudio === '6.18' ? '⏸ Playing 6.18' : '▶ Audio 6.18'}
                </button>
              </div>

              <div className={styles.usefulGroup}>
                <h5>Making requests:</h5>
                <p>• Can I (use your bike), (please)?</p>
                <p>• Can you (walk the dog), (please)?</p>
              </div>

              <div className={styles.usefulGroup}>
                <h5>Saying yes to requests:</h5>
                <p>• Yes, you can. / Yes, I can. / Sure. / No problem.</p>
              </div>

              <div className={styles.usefulGroup}>
                <h5>Saying no to requests:</h5>
                <p>• I&apos;m sorry, I can&apos;t. / I&apos;m sorry, you can&apos;t.</p>
              </div>

              {/* 4a Count input */}
              <div className={styles.matchingRow} style={{ marginTop: '0.5rem' }}>
                <span className={styles.matchingText}>
                  <strong>4a.</strong> How many requests do the speakers make in 6.17?
                </span>
                <input
                  type="text"
                  className={styles.inlineInput}
                  placeholder="Number..."
                  value={getFieldValue('exercise_4a_requests', 'count')}
                  disabled={readOnly}
                  onChange={(e) =>
                    handleFieldChange('exercise_4a_requests', 'count', e.target.value)
                  }
                />
                {renderVerification(
                  'exercise_4a_requests',
                  'count',
                  getFieldValue('exercise_4a_requests', 'count')
                )}
              </div>
            </div>

            {/* Exercise 5a: Complete conversations */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>5a</span>
                <p className={styles.exercisePrompt}>
                  Complete the conversations with phrases from the Useful phrases box.
                </p>
              </div>

              <div className={styles.dialogueBlock}>
                {/* Convo 1 */}
                <div className={styles.conversationItem}>
                  <div className={styles.dialogueLine}>
                    <span className={styles.speakerLabel}>1 A:</span>
                    <input
                      type="text"
                      className={styles.inlineInput}
                      placeholder="Request phrase..."
                      value={getFieldValue('exercise_5a_dialogue', '1a')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5a_dialogue', '1a', e.target.value)
                      }
                    />{' '}
                    clean the living room, please?
                    {renderVerification(
                      'exercise_5a_dialogue',
                      '1a',
                      getFieldValue('exercise_5a_dialogue', '1a')
                    )}
                  </div>
                  <div className={styles.dialogueLine}>
                    <span className={styles.speakerLabel}>B:</span>
                    <input
                      type="text"
                      className={styles.inlineInput}
                      placeholder="Response phrase..."
                      value={getFieldValue('exercise_5a_dialogue', '1b')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5a_dialogue', '1b', e.target.value)
                      }
                    />{' '}
                    . I can do it now.
                    {renderVerification(
                      'exercise_5a_dialogue',
                      '1b',
                      getFieldValue('exercise_5a_dialogue', '1b')
                    )}
                  </div>
                </div>

                {/* Convo 2 */}
                <div className={styles.conversationItem}>
                  <div className={styles.dialogueLine}>
                    <span className={styles.speakerLabel}>2 A:</span>
                    <input
                      type="text"
                      className={styles.inlineInput}
                      placeholder="Request phrase..."
                      value={getFieldValue('exercise_5a_dialogue', '2a')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5a_dialogue', '2a', e.target.value)
                      }
                    />{' '}
                    use your computer, please?
                    {renderVerification(
                      'exercise_5a_dialogue',
                      '2a',
                      getFieldValue('exercise_5a_dialogue', '2a')
                    )}
                  </div>
                  <div className={styles.dialogueLine}>
                    <span className={styles.speakerLabel}>B:</span>
                    <input
                      type="text"
                      className={styles.inlineInput}
                      placeholder="Response phrase..."
                      value={getFieldValue('exercise_5a_dialogue', '2b')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5a_dialogue', '2b', e.target.value)
                      }
                    />{' '}
                    . It&apos;s on my desk.
                    {renderVerification(
                      'exercise_5a_dialogue',
                      '2b',
                      getFieldValue('exercise_5a_dialogue', '2b')
                    )}
                  </div>
                </div>

                {/* Convo 3 */}
                <div className={styles.conversationItem}>
                  <div className={styles.dialogueLine}>
                    <span className={styles.speakerLabel}>3 A:</span>
                    <input
                      type="text"
                      className={styles.inlineInput}
                      placeholder="Request phrase..."
                      value={getFieldValue('exercise_5a_dialogue', '3a')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5a_dialogue', '3a', e.target.value)
                      }
                    />{' '}
                    watch TV at 8 o&apos;clock?
                    {renderVerification(
                      'exercise_5a_dialogue',
                      '3a',
                      getFieldValue('exercise_5a_dialogue', '3a')
                    )}
                  </div>
                  <div className={styles.dialogueLine}>
                    <span className={styles.speakerLabel}>B:</span>
                    <input
                      type="text"
                      className={styles.inlineInput}
                      placeholder="Response phrase..."
                      value={getFieldValue('exercise_5a_dialogue', '3b')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5a_dialogue', '3b', e.target.value)
                      }
                    />{' '}
                    . I study in the living room from seven to nine.
                    {renderVerification(
                      'exercise_5a_dialogue',
                      '3b',
                      getFieldValue('exercise_5a_dialogue', '3b')
                    )}
                  </div>
                </div>

                {/* Convo 4 */}
                <div className={styles.conversationItem}>
                  <div className={styles.dialogueLine}>
                    <span className={styles.speakerLabel}>4 A:</span>
                    <input
                      type="text"
                      className={styles.inlineInput}
                      placeholder="Request phrase..."
                      value={getFieldValue('exercise_5a_dialogue', '4a')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5a_dialogue', '4a', e.target.value)
                      }
                    />{' '}
                    cook dinner on Monday, please? I can&apos;t do it.
                    {renderVerification(
                      'exercise_5a_dialogue',
                      '4a',
                      getFieldValue('exercise_5a_dialogue', '4a')
                    )}
                  </div>
                  <div className={styles.dialogueLine}>
                    <span className={styles.speakerLabel}>B:</span>
                    <input
                      type="text"
                      className={styles.inlineInput}
                      placeholder="Response phrase..."
                      value={getFieldValue('exercise_5a_dialogue', '4b')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5a_dialogue', '4b', e.target.value)
                      }
                    />{' '}
                    . I play football on Monday evening.
                    {renderVerification(
                      'exercise_5a_dialogue',
                      '4b',
                      getFieldValue('exercise_5a_dialogue', '4b')
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 6a: Situations Requests */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>6a</span>
                <p className={styles.exercisePrompt}>
                  Think of some requests for these situations.
                </p>
              </div>

              <div className={styles.matchingList}>
                {[
                  { id: '1', title: 'A teacher and a student', hint: 'e.g. Can you open the window, please?' },
                  { id: '2', title: 'A customer and a café worker', hint: 'e.g. Can I have a coffee, please?' },
                  { id: '3', title: 'A customer and a shop assistant', hint: 'e.g. Can you help me, please?' },
                  { id: '4', title: 'Two friends in their flat', hint: 'e.g. Can you cook dinner tonight?' },
                  { id: '5', title: 'An office worker and a manager', hint: 'e.g. Can I leave early today, please?' },
                ].map((sit) => (
                  <div key={sit.id} className={styles.matchingRow}>
                    <span className={styles.matchingText}>
                      <strong>{sit.title}:</strong>
                    </span>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder={sit.hint}
                      value={getFieldValue('exercise_6a_situations', sit.id)}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_6a_situations', sit.id, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise 6b: Roleplay Voice Recording */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>6b</span>
                <p className={styles.exercisePrompt}>
                  Work in pairs. Roleplay conversations for the situations in Exercise 6a and record your dialogue.
                </p>
              </div>

              <div className={styles.recordingSection}>
                <span style={{ fontWeight: 800, color: '#be185d' }}>
                  🎙️ Voice Recording: Roleplay one situation
                </span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                  Record a brief dialogue asking and answering a request for one of the situations
                  above.
                </p>
                <AudioAnswerRecorder
                  readOnly={readOnly}
                  onAudioChange={(blob, mime) =>
                    onAudioBlobChange?.(blob, mime, 'exercise_6b_audio')
                  }
                />
                {submissionId && (
                  <SubmissionAudioPlayer
                    submissionId={submissionId}
                    exerciseKey="exercise_6b_audio"
                    audios={submittedAudios}
                  />
                )}
              </div>
            </div>
          </section>

          {/* Section: Check and reflect */}
          <section>
            <div className={styles.checkBanner}>
              <div>
                <h2 className={styles.checkTitle}>Check and reflect: Unit 6</h2>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
                  Consolidate your grammar, vocabulary, and ability phrases from Unit 6.
                </p>
              </div>
            </div>

            {/* Check 1: Time Phrases */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>1</span>
                <p className={styles.exercisePrompt}>Match time phrases 1–6 with a–f.</p>
              </div>

              <div className={styles.matchingList}>
                {[
                  { num: '1', phrase: 'in the morning' },
                  { num: '2', phrase: 'in the afternoon' },
                  { num: '3', phrase: 'in the evening' },
                  { num: '4', phrase: 'at night' },
                  { num: '5', phrase: 'at the weekend' },
                  { num: '6', phrase: 'every day' },
                ].map((item) => {
                  const val = getFieldValue('check_1_time_phrases', item.num);
                  return (
                    <div key={item.num} className={styles.matchingRow}>
                      <span className={styles.matchingNum}>{item.num}</span>
                      <span className={styles.matchingText}>{item.phrase}</span>
                      <select
                        className={styles.letterSelect}
                        value={val}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleFieldChange('check_1_time_phrases', item.num, e.target.value)
                        }
                      >
                        <option value="">choose...</option>
                        <option value="a">a from 11.00 p.m. to 5.00 a.m.</option>
                        <option value="b">b on Saturdays and Sundays</option>
                        <option value="c">c from 6.00 a.m. to 12.00 p.m.</option>
                        <option value="d">d from 6.00 p.m. to 9.00 p.m.</option>
                        <option value="e">e from 12.00 p.m. to 5.00 p.m.</option>
                        <option value="f">f from Monday to Sunday</option>
                      </select>
                      {renderVerification(
                        'check_1_time_phrases',
                        item.num,
                        val
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Check 2: Text fill */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>2</span>
                <p className={styles.exercisePrompt}>Complete the text with the phrases in the box.</p>
              </div>

              <div className={styles.wordBox}>
                <span>at the weekend</span>
                <span>in the afternoon</span>
                <span>in the evening</span>
                <span>in the morning</span>
              </div>

              <div className={styles.storyCard}>
                I get up at 6 or 7 o&apos;clock{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="1..."
                    value={getFieldValue('check_2_text', '1')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_2_text', '1', e.target.value)}
                  />
                  {renderVerification('check_2_text', '1', getFieldValue('check_2_text', '1'))}
                </span>
                , then I go to work. I finish work at 4 o&apos;clock{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="2..."
                    value={getFieldValue('check_2_text', '2')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_2_text', '2', e.target.value)}
                  />
                  {renderVerification('check_2_text', '2', getFieldValue('check_2_text', '2'))}
                </span>
                .{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="3..."
                    value={getFieldValue('check_2_text', '3')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_2_text', '3', e.target.value)}
                  />
                  {renderVerification('check_2_text', '3', getFieldValue('check_2_text', '3'))}
                </span>{' '}
                I have dinner with my family, usually at 8 o&apos;clock. I don&apos;t work{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="4..."
                    value={getFieldValue('check_2_text', '4')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_2_text', '4', e.target.value)}
                  />
                  {renderVerification('check_2_text', '4', getFieldValue('check_2_text', '4'))}
                </span>
                .
              </div>
            </div>

            {/* Check 3: Verb forms */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>3</span>
                <p className={styles.exercisePrompt}>
                  Complete the text with the correct form of the verbs in brackets.
                </p>
              </div>

              <div className={styles.storyCard}>
                My brother <strong>works</strong> (work) in London. He{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="2 (get up)..."
                    value={getFieldValue('check_3_verbs', '2')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_3_verbs', '2', e.target.value)}
                  />
                  {renderVerification('check_3_verbs', '2', getFieldValue('check_3_verbs', '2'))}
                </span>{' '}
                very early and{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="3 (travel)..."
                    value={getFieldValue('check_3_verbs', '3')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_3_verbs', '3', e.target.value)}
                  />
                  {renderVerification('check_3_verbs', '3', getFieldValue('check_3_verbs', '3'))}
                </span>{' '}
                to work by train. He{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="4 (not talk)..."
                    value={getFieldValue('check_3_verbs', '4')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_3_verbs', '4', e.target.value)}
                  />
                  {renderVerification('check_3_verbs', '4', getFieldValue('check_3_verbs', '4'))}
                </span>{' '}
                to people on the train - he{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="5 (draw)..."
                    value={getFieldValue('check_3_verbs', '5')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_3_verbs', '5', e.target.value)}
                  />
                  {renderVerification('check_3_verbs', '5', getFieldValue('check_3_verbs', '5'))}
                </span>{' '}
                or{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="6 (read)..."
                    value={getFieldValue('check_3_verbs', '6')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_3_verbs', '6', e.target.value)}
                  />
                  {renderVerification('check_3_verbs', '6', getFieldValue('check_3_verbs', '6'))}
                </span>{' '}
                the newspaper. He{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="7 (not have)..."
                    value={getFieldValue('check_3_verbs', '7')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_3_verbs', '7', e.target.value)}
                  />
                  {renderVerification('check_3_verbs', '7', getFieldValue('check_3_verbs', '7'))}
                </span>{' '}
                lunch in a café - he{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="8 (buy)..."
                    value={getFieldValue('check_3_verbs', '8')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_3_verbs', '8', e.target.value)}
                  />
                  {renderVerification('check_3_verbs', '8', getFieldValue('check_3_verbs', '8'))}
                </span>{' '}
                a sandwich from a shop and{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="9 (eat)..."
                    value={getFieldValue('check_3_verbs', '9')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_3_verbs', '9', e.target.value)}
                  />
                  {renderVerification('check_3_verbs', '9', getFieldValue('check_3_verbs', '9'))}
                </span>{' '}
                it in the park. In the evening, he{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="10 (have)..."
                    value={getFieldValue('check_3_verbs', '10')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_3_verbs', '10', e.target.value)}
                  />
                  {renderVerification('check_3_verbs', '10', getFieldValue('check_3_verbs', '10'))}
                </span>{' '}
                dinner at home and{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="11 (watch)..."
                    value={getFieldValue('check_3_verbs', '11')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_3_verbs', '11', e.target.value)}
                  />
                  {renderVerification('check_3_verbs', '11', getFieldValue('check_3_verbs', '11'))}
                </span>{' '}
                TV. He{' '}
                <span className={styles.inlineStoryInput}>
                  <input
                    type="text"
                    placeholder="12 (go)..."
                    value={getFieldValue('check_3_verbs', '12')}
                    disabled={readOnly}
                    onChange={(e) => handleFieldChange('check_3_verbs', '12', e.target.value)}
                  />
                  {renderVerification('check_3_verbs', '12', getFieldValue('check_3_verbs', '12'))}
                </span>{' '}
                to bed at 11.00 p.m.
              </div>
            </div>

            {/* Check 4: Negatives */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>4</span>
                <p className={styles.exercisePrompt}>Make the sentences negative.</p>
              </div>

              <div className={styles.sentencesList}>
                {[
                  {
                    num: '1',
                    orig: 'Julio studies French.',
                    example: "Julio doesn't study French.",
                  },
                  { num: '2', orig: 'She works in an office.' },
                  { num: '3', orig: 'Aleksi listens to music on the train.' },
                  { num: '4', orig: 'Linda teaches at the university.' },
                  { num: '5', orig: 'Amy takes the bus to work.' },
                  { num: '6', orig: 'Juan works in the evening.' },
                  { num: '7', orig: 'Lizzie studies in the evening.' },
                  { num: '8', orig: 'Luke works in the morning.' },
                  { num: '9', orig: 'Jane has lunch at home.' },
                  { num: '10', orig: 'Danny watches a lot of TV.' },
                ].map((item) => {
                  if (item.example) {
                    return (
                      <div key={item.num} className={styles.sentenceCard}>
                        <span className={styles.sourceSentence}>
                          1 {item.orig} &rarr; <em>{item.example} (example)</em>
                        </span>
                      </div>
                    );
                  }
                  const val = getFieldValue('check_4_negatives', item.num);
                  return (
                    <div key={item.num} className={styles.sentenceCard}>
                      <span className={styles.sourceSentence}>
                        {item.num} {item.orig}
                      </span>
                      <input
                        type="text"
                        className={styles.textInput}
                        placeholder="Write negative sentence..."
                        value={val}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleFieldChange('check_4_negatives', item.num, e.target.value)
                        }
                      />
                      {renderVerification(
                        'check_4_negatives',
                        item.num,
                        val
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Check 5: Verb collocations */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>5</span>
                <p className={styles.exercisePrompt}>Match verbs 1–7 with a–g.</p>
              </div>

              <div className={styles.matchingList}>
                {[
                  { num: '1', verb: 'clean' },
                  { num: '2', verb: 'feed' },
                  { num: '3', verb: 'cook' },
                  { num: '4', verb: 'wash' },
                  { num: '5', verb: 'do' },
                  { num: '6', verb: 'make' },
                  { num: '7', verb: 'go to' },
                ].map((item) => {
                  const val = getFieldValue('check_5_match', item.num);
                  return (
                    <div key={item.num} className={styles.matchingRow}>
                      <span className={styles.matchingNum}>{item.num}</span>
                      <span className={styles.matchingText}>{item.verb}</span>
                      <select
                        className={styles.letterSelect}
                        value={val}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleFieldChange('check_5_match', item.num, e.target.value)
                        }
                      >
                        <option value="">choose collocation...</option>
                        <option value="a">a breakfast / lunch / dinner</option>
                        <option value="b">b the dishes / the car</option>
                        <option value="c">c the dog / the children</option>
                        <option value="d">d the kitchen / your bedroom</option>
                        <option value="e">e the supermarket / the shops</option>
                        <option value="f">f the washing</option>
                        <option value="g">g the beds</option>
                      </select>
                      {renderVerification(
                        'check_5_match',
                        item.num,
                        val
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Check 6a: do or does questions */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>6a</span>
                <p className={styles.exercisePrompt}>
                  Complete 1–6 with <em>do</em> or <em>does</em>. Then match the sentence halves.
                </p>
              </div>

              <div className={styles.matchingList}>
                {[
                  { num: '1', start: 'Where', subject: 'you' },
                  { num: '2', start: 'How', subject: 'your classmates' },
                  { num: '3', start: 'What time', subject: 'your mother' },
                  { num: '4', start: 'Who', subject: 'your best friend' },
                  { num: '5', start: 'What sports', subject: 'your father' },
                  { num: '6', start: 'How often', subject: 'your parents' },
                ].map((item) => {
                  const auxVal = getFieldValue('check_6a_questions', `${item.num}_aux`);
                  const matchVal = getFieldValue('check_6a_questions', `${item.num}_match`);
                  return (
                    <div key={item.num} className={styles.matchingRow}>
                      <span className={styles.matchingNum}>{item.num}</span>
                      <span className={styles.matchingText}>
                        {item.start}{' '}
                        <select
                          className={styles.letterSelect}
                          value={auxVal}
                          disabled={readOnly}
                          onChange={(e) =>
                            handleFieldChange(
                              'check_6a_questions',
                              `${item.num}_aux`,
                              e.target.value
                            )
                          }
                        >
                          <option value="">do/does</option>
                          <option value="do">do</option>
                          <option value="does">does</option>
                        </select>{' '}
                        {item.subject} ...
                      </span>
                      {renderVerification(
                        'check_6a_questions',
                        `${item.num}_aux`,
                        auxVal
                      )}

                      <select
                        className={styles.letterSelect}
                        value={matchVal}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleFieldChange(
                            'check_6a_questions',
                            `${item.num}_match`,
                            e.target.value
                          )
                        }
                      >
                        <option value="">match half...</option>
                        <option value="a">a go to work?</option>
                        <option value="b">b watch?</option>
                        <option value="c">c go to a restaurant?</option>
                        <option value="d">d travel to school?</option>
                        <option value="e">e live with?</option>
                        <option value="f">f do your homework?</option>
                      </select>
                      {renderVerification(
                        'check_6a_questions',
                        `${item.num}_match`,
                        matchVal
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Check 7a: Verbs box */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>7a</span>
                <p className={styles.exercisePrompt}>
                  Complete the questions with the verbs in the box.
                </p>
              </div>

              <div className={styles.wordBox}>
                <span>build</span>
                <span>cook</span>
                <span>draw</span>
                <span>fly</span>
                <span>play</span>
                <span>ride</span>
                <span>sing</span>
                <span>sleep</span>
                <span>speak</span>
                <span>use</span>
              </div>

              <div className={styles.matchingList}>
                {[
                  { num: '1', prompt: 'Do you sing in the shower? (example)' },
                  { num: '2', pre: 'Do you', post: 'dinner every evening?' },
                  { num: '3', pre: 'Do you', post: 'video games at the weekend?' },
                  { num: '4', pre: 'Can you', post: 'three languages?' },
                  { num: '5', pre: 'Can you', post: 'a plane?' },
                  { num: '6', pre: 'Can you', post: 'a website?' },
                  { num: '7', pre: 'Can you', post: 'a horse?' },
                  { num: '8', pre: 'Do you', post: 'a computer every day?' },
                  { num: '9', pre: 'Do you sometimes', post: 'pictures in your classes?' },
                  { num: '10', pre: 'Do you sometimes', post: 'on the train?' },
                ].map((item) => {
                  if (item.prompt) {
                    return (
                      <div key={item.num} className={styles.matchingRow}>
                        <span className={styles.matchingNum}>1</span>
                        <span className={styles.matchingText}>
                          <em>{item.prompt}</em>
                        </span>
                      </div>
                    );
                  }
                  const val = getFieldValue('check_7a_verbs', item.num);
                  return (
                    <div key={item.num} className={styles.matchingRow}>
                      <span className={styles.matchingNum}>{item.num}</span>
                      <span className={styles.matchingText}>
                        {item.pre}{' '}
                        <input
                          type="text"
                          className={styles.inlineInput}
                          placeholder="verb..."
                          value={val}
                          disabled={readOnly}
                          onChange={(e) =>
                            handleFieldChange('check_7a_verbs', item.num, e.target.value)
                          }
                        />{' '}
                        {item.post}
                      </span>
                      {renderVerification('check_7a_verbs', item.num, val)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Check 8a: Can / Can't Alternatives */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>8a</span>
                <p className={styles.exercisePrompt}>Choose the correct alternatives.</p>
              </div>

              <div className={styles.matchingList}>
                {[
                  { num: '1', subject: 'Dogs', action: 'swim' },
                  { num: '2', subject: 'A fish', action: 'walk' },
                  { num: '3', subject: 'Horses', action: 'run' },
                  { num: '4', subject: 'Children', action: 'drive' },
                  { num: '5', subject: 'Children', action: 'sing' },
                  { num: '6', subject: 'A dog', action: 'fly' },
                ].map((item) => {
                  const val = getFieldValue('check_8a_animals', item.num);
                  return (
                    <div key={item.num} className={styles.matchingRow}>
                      <span className={styles.matchingNum}>{item.num}</span>
                      <span className={styles.matchingText}>
                        {item.subject}{' '}
                        <select
                          className={styles.letterSelect}
                          value={val}
                          disabled={readOnly}
                          onChange={(e) =>
                            handleFieldChange('check_8a_animals', item.num, e.target.value)
                          }
                        >
                          <option value="">can / can&apos;t</option>
                          <option value="can">can</option>
                          <option value="can't">can&apos;t</option>
                        </select>{' '}
                        {item.action}.
                      </span>
                      {renderVerification(
                        'check_8a_animals',
                        item.num,
                        val
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reflect Card: 1-5 rating */}
            <div className={styles.reflectCard}>
              <h3 className={styles.reflectTitle}>Reflect: Self-Assessment</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#701a75' }}>
                How confident do you feel about the statements below? (1 = not very confident, 5 =
                very confident):
              </p>

              <div className={styles.sentencesList}>
                {[
                  {
                    id: 'habits',
                    statement: 'I can talk about another person&apos;s habits.',
                  },
                  {
                    id: 'often',
                    statement: 'I can ask and answer about things people often do.',
                  },
                  {
                    id: 'ability',
                    statement: 'I can ask and answer about things another person can do.',
                  },
                  {
                    id: 'requests',
                    statement: 'I can make requests.',
                  },
                ].map((stmt) => {
                  const rating = getFieldValue('reflect_ratings', stmt.id);
                  return (
                    <div key={stmt.id} className={styles.ratingRow}>
                      <span
                        className={styles.ratingText}
                        dangerouslySetInnerHTML={{ __html: stmt.statement }}
                      />
                      <div className={styles.ratingButtons}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`${styles.ratingBtn} ${
                              rating === String(star) ? styles.activeRating : ''
                            }`}
                            disabled={readOnly}
                            onClick={() =>
                              handleFieldChange('reflect_ratings', stmt.id, String(star))
                            }
                          >
                            {star}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
