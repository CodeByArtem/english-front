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
import styles from './lesson6c.module.scss';

export interface Lesson6CContentProps {
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

export const FALLBACK_ANSWER_KEY_6C: LessonAnswerKey = {
  exercise_1a_matching: {
    '1': ['H', 'h', 'Photo H', 'Picture H'],
    '2': ['L', 'l', 'Photo L', 'Picture L'],
    '3': ['A', 'a', 'Photo A', 'Picture A'],
    '4': ['D', 'd', 'Photo D', 'Picture D'],
    '5': ['I', 'i', 'Photo I', 'Picture I'],
    '6': ['F', 'f', 'Photo F', 'Picture F'],
    '7': ['E', 'e', 'Photo E', 'Picture E'],
    '8': ['J', 'j', 'Photo J', 'Picture J'],
    '9': ['G', 'g', 'Photo G', 'Picture G'],
    '10': ['B', 'b', 'Photo B', 'Picture B'],
    '11': ['C', 'c', 'Photo C', 'Picture C'],
    '12': ['K', 'k', 'Photo K', 'Picture K'],
  },
  exercise_1c_audio: {
    '1': ['play football', 'play football.', 'football'],
    '2': ['ride a horse', 'ride a horse.', 'horse'],
    '3': ['swim', 'swim.'],
    '4': ['sing', 'sing.'],
    '5': ['fly a plane', 'fly a plane.', 'plane'],
    '6': ['dance', 'dance.'],
  },
  exercise_2b_job: {
    '1': ['teacher', 'Teacher', 'a teacher', 'A teacher'],
  },
  exercise_2c_skills: {
    computer: ['true', 'yes'],
    website: ['false', 'no'],
    languages: ['true', 'yes'],
    drive: ['false', 'no'],
    cook: ['true', 'yes'],
    draw: ['true', 'yes'],
    sing: ['true', 'yes'],
    dance: ['true', 'yes'],
  },
  exercise_3_grammar: {
    '1': ['sing', 'Sing'],
    '2': ['drive', 'Drive'],
    '3': ['use', 'Use'],
    '4': ['play', 'Play'],
    '5': ['cook', 'Cook'],
    '6': ['speak', 'Speak'],
  },
  exercise_4a_sounds: {
    '1': ['different', 'Different'],
    '2': ['different', 'Different'],
    '3': ['different', 'Different'],
  },
  exercise_5_dialogue: {
    '1': ['Can you'],
    '2': ['I can'],
    '3': ['Can you'],
    '4': ['I can'],
    '5': ['Can you'],
    '6': ['I can'],
    '7': ['can you'],
    '8': ['can'],
    '9': ['Can you'],
    '10': ['can'],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const PHOTOS_6C = [
  { id: 'A', src: '/images/lesson6c/photo_a_draw.png', label: 'A: draw pictures' },
  { id: 'B', src: '/images/lesson6c/photo_b_sleep_train.png', label: 'B: sleep on a train' },
  { id: 'C', src: '/images/lesson6c/photo_c_languages_v2.png', label: 'C: speak two languages' },
  { id: 'D', src: '/images/lesson6c/photo_d_plane.png', label: 'D: fly a plane' },
  { id: 'E', src: '/images/lesson6c/photo_e_football_v2.png', label: 'E: play football' },
  { id: 'F', src: '/images/lesson6c/photo_f_clothes_v2.png', label: 'F: make clothes' },
  { id: 'G', src: '/images/lesson6c/photo_g_sing.png', label: 'G: sing' },
  { id: 'H', src: '/images/lesson6c/photo_h_website.png', label: 'H: build a website' },
  { id: 'I', src: '/images/lesson6c/photo_i_cake.png', label: 'I: make a cake' },
  { id: 'J', src: '/images/lesson6c/photo_j_horse.png', label: 'J: ride a horse' },
  { id: 'K', src: '/images/lesson6c/photo_k_swim.png', label: 'K: swim' },
  { id: 'L', src: '/images/lesson6c/photo_l_dance.png', label: 'L: dance' },
];

const SKILLS_LIST = [
  { id: '1', phrase: 'build a website' },
  { id: '2', phrase: 'dance' },
  { id: '3', phrase: 'draw pictures' },
  { id: '4', phrase: 'fly a plane' },
  { id: '5', phrase: 'make a cake' },
  { id: '6', phrase: 'make clothes' },
  { id: '7', phrase: 'play football' },
  { id: '8', phrase: 'ride a horse' },
  { id: '9', phrase: 'sing' },
  { id: '10', phrase: 'sleep on a train' },
  { id: '11', phrase: 'speak two languages' },
  { id: '12', phrase: 'swim' },
];

export default function Lesson6CContent({
  isTeacherReview = false,
  readOnly = false,
  answerKey: propAnswerKey,
  playAudio: parentPlayAudio,
  playingAudio: parentPlayingAudio,
  originalAnswers = {},
  onAudioBlobChange,
  submissionId,
  submittedAudios,
}: Lesson6CContentProps) {
  const context = useLessonContext();
  const [localAnswers, setLocalAnswers] = useState<Record<string, unknown>>({});
  const [internalPlayingAudio, setInternalPlayingAudio] = useState<string | null>(null);

  const activeAnswerKey =
    propAnswerKey ||
    (context?.answerKey as LessonAnswerKey) ||
    (context?.lesson?.answerKey as LessonAnswerKey) ||
    FALLBACK_ANSWER_KEY_6C;

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

  const handleCheckboxToggle = (exerciseKey: string, field: string) => {
    if (readOnly) return;
    const current = getFieldValue(exerciseKey, field);
    const nextVal = current === 'true' ? 'false' : 'true';
    handleFieldChange(exerciseKey, field, nextVal);
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
        {/* Header Banner 6C */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <span className={styles.badge6C}>6C</span>
            <h1 className={styles.headerTitle}>Skills</h1>
          </div>
          <div className={styles.goalsCard}>
            <div className={styles.goalItem}>
              <strong>Goal:</strong> ask and answer about things you can and can&apos;t do
            </div>
            <div className={styles.goalItem}>
              <strong>Grammar:</strong> can / can&apos;t for ability
            </div>
            <div className={styles.goalItem}>
              <strong>Vocabulary:</strong> skills
            </div>
          </div>
        </header>

        <div className={styles.pageBody}>
          {/* Section: Vocabulary */}
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Vocabulary: Skills</h2>
              <button
                type="button"
                className={styles.audioBtn}
                onClick={() => handleAudioToggle('6.13')}
              >
                {currentPlayingAudio === '6.13' ? '⏸ Playing 6.13' : '▶ Audio 6.13'}
              </button>
            </div>

            {/* Photos Grid A-L */}
            <div className={styles.skillsGrid}>
              {PHOTOS_6C.map((photo) => (
                <div key={photo.id} className={styles.skillItem}>
                  <div className={styles.skillImageWrapper}>
                    <Image
                      src={photo.src}
                      alt={photo.label}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className={styles.skillImage}
                    />
                    <span className={styles.skillBadge}>{photo.id}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Exercise 1a */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>1a</span>
                <p className={styles.exercisePrompt}>
                  Match photos A–L with skills 1–12.
                </p>
              </div>

              <div className={styles.matchingList}>
                {SKILLS_LIST.map((item) => {
                  const val = getFieldValue('exercise_1a_matching', item.id);
                  return (
                    <div key={item.id} className={styles.matchingRow}>
                      <span className={styles.matchingNum}>{item.id}</span>
                      <span className={styles.matchingText}>{item.phrase}</span>
                      <select
                        className={styles.letterSelect}
                        value={val}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleFieldChange('exercise_1a_matching', item.id, e.target.value)
                        }
                      >
                        <option value="">Choose photo...</option>
                        {PHOTOS_6C.map((p) => (
                          <option key={p.id} value={p.id}>
                            Photo {p.id}
                          </option>
                        ))}
                      </select>
                      {renderVerification(
                        'exercise_1a_matching',
                        item.id,
                        val
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 1c */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>1c</span>
                <p className={styles.exercisePrompt}>
                  Listen to the audio. Which of the activities in Exercise 1a do you hear?
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('6.14')}
                >
                  {currentPlayingAudio === '6.14' ? '⏸ Playing 6.14' : '▶ Audio 6.14'}
                </button>
              </div>

              <div className={styles.matchingList}>
                {[
                  { num: '1', example: 'play football' },
                  { num: '2', prompt: 'Sound 2:' },
                  { num: '3', prompt: 'Sound 3:' },
                  { num: '4', prompt: 'Sound 4:' },
                  { num: '5', prompt: 'Sound 5:' },
                  { num: '6', prompt: 'Sound 6:' },
                ].map((item) => {
                  if (item.example) {
                    return (
                      <div key={item.num} className={styles.matchingRow}>
                        <span className={styles.matchingNum}>{item.num}</span>
                        <span className={styles.matchingText}>
                          <em>{item.example} (example)</em>
                        </span>
                      </div>
                    );
                  }
                  const val = getFieldValue('exercise_1c_audio', item.num);
                  return (
                    <div key={item.num} className={styles.matchingRow}>
                      <span className={styles.matchingNum}>{item.num}</span>
                      <input
                        type="text"
                        className={styles.textInput}
                        placeholder="Type activity..."
                        value={val}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleFieldChange('exercise_1c_audio', item.num, e.target.value)
                        }
                      />
                      {renderVerification(
                        'exercise_1c_audio',
                        item.num,
                        val
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section: Reading and listening */}
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Reading and Listening</h2>
            </div>

            {/* ChooseYourJob Showcase Banner (2a) */}
            <div className={styles.chooseJobBannerWrapper}>
              <div className={styles.chooseJobImageWrapper}>
                <Image
                  src="/images/lesson6c/banner_choose_job.png"
                  alt="ChooseYourJob.com website"
                  fill
                  className={styles.skillImage}
                />
              </div>
              <p style={{ margin: 0, fontWeight: 600, color: '#0f766e', textAlign: 'center' }}>
                Look at the website banner. What does it do?
              </p>
            </div>

            {/* Exercise 2b */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>2b</span>
                <p className={styles.exercisePrompt}>
                  Listen to Yusuf and Gloria. Which job does the website think is right for Gloria?
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('6.15')}
                >
                  {currentPlayingAudio === '6.15' ? '⏸ Playing 6.15' : '▶ Audio 6.15'}
                </button>
              </div>

              <div className={styles.matchingRow}>
                <span className={styles.matchingText}>Recommended job:</span>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="Job title..."
                  value={getFieldValue('exercise_2b_job', '1')}
                  disabled={readOnly}
                  onChange={(e) =>
                    handleFieldChange('exercise_2b_job', '1', e.target.value)
                  }
                />
                {renderVerification(
                  'exercise_2b_job',
                  '1',
                  getFieldValue('exercise_2b_job', '1')
                )}
              </div>
            </div>

            {/* Exercise 2c (Tick table) */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>2c</span>
                <p className={styles.exercisePrompt}>
                  Listen again and tick (✓) the things Gloria can do.
                </p>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.abilitiesTable}>
                  <thead>
                    <tr>
                      <th>Ability</th>
                      <th className={styles.checkboxCell}>Can do?</th>
                      {isReview && <th>Teacher Review</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { key: 'computer', label: 'use a computer', example: true },
                      { key: 'website', label: 'build a website' },
                      { key: 'languages', label: 'speak two languages' },
                      { key: 'drive', label: 'drive' },
                      { key: 'cook', label: 'cook' },
                      { key: 'draw', label: 'draw' },
                      { key: 'sing', label: 'sing' },
                      { key: 'dance', label: 'dance' },
                    ].map((row) => {
                      const val = getFieldValue('exercise_2c_skills', row.key);
                      const isChecked = val === 'true' || (row.example && val !== 'false');
                      return (
                        <tr key={row.key}>
                          <td>
                            {row.label} {row.example && <em>(example ✓)</em>}
                          </td>
                          <td className={styles.checkboxCell}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={readOnly || row.example}
                              onChange={() =>
                                handleCheckboxToggle('exercise_2c_skills', row.key)
                              }
                            />
                          </td>
                          {isReview && !row.example && (
                            <td>
                              {renderVerification(
                                'exercise_2c_skills',
                                row.key,
                                val
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section: Grammar */}
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Grammar: can / can&apos;t for ability</h2>
            </div>

            {/* Exercise 3 */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>3</span>
                <p className={styles.exercisePrompt}>
                  Read the grammar box and choose the correct alternatives.
                </p>
              </div>

              <div className={styles.grammarBox}>
                <h4 className={styles.grammarSectionTitle}>can / can&apos;t for ability</h4>

                {/* + statement */}
                <div className={styles.grammarRow}>
                  <strong>+</strong> I / You / He / She / It / We / They <strong>can</strong>
                  <select
                    className={styles.inlineSelect}
                    value={getFieldValue('exercise_3_grammar', '1')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_3_grammar', '1', e.target.value)
                    }
                  >
                    <option value="">choose...</option>
                    <option value="sing">sing</option>
                    <option value="sings">sings</option>
                  </select>
                  .
                  {renderVerification(
                    'exercise_3_grammar',
                    '1',
                    getFieldValue('exercise_3_grammar', '1')
                  )}
                </div>

                {/* - statement */}
                <div className={styles.grammarRow}>
                  <strong>-</strong> I / You / He / She / It / We / They <strong>can&apos;t</strong>
                  <select
                    className={styles.inlineSelect}
                    value={getFieldValue('exercise_3_grammar', '2')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_3_grammar', '2', e.target.value)
                    }
                  >
                    <option value="">choose...</option>
                    <option value="drive">drive</option>
                    <option value="drives">drives</option>
                  </select>
                  .
                  {renderVerification(
                    'exercise_3_grammar',
                    '2',
                    getFieldValue('exercise_3_grammar', '2')
                  )}
                </div>

                <h4 className={styles.grammarSectionTitle}>Yes / No questions</h4>
                <div className={styles.grammarRow}>
                  Can you
                  <select
                    className={styles.inlineSelect}
                    value={getFieldValue('exercise_3_grammar', '3')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_3_grammar', '3', e.target.value)
                    }
                  >
                    <option value="">choose...</option>
                    <option value="use">use</option>
                    <option value="uses">uses</option>
                  </select>
                  a computer? <em>(+ Yes, I can. / - No, I can&apos;t.)</em>
                  {renderVerification(
                    'exercise_3_grammar',
                    '3',
                    getFieldValue('exercise_3_grammar', '3')
                  )}
                </div>

                <div className={styles.grammarRow}>
                  Can he
                  <select
                    className={styles.inlineSelect}
                    value={getFieldValue('exercise_3_grammar', '4')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_3_grammar', '4', e.target.value)
                    }
                  >
                    <option value="">choose...</option>
                    <option value="play">play</option>
                    <option value="plays">plays</option>
                  </select>
                  football? <em>(+ Yes, he can. / - No, he can&apos;t.)</em>
                  {renderVerification(
                    'exercise_3_grammar',
                    '4',
                    getFieldValue('exercise_3_grammar', '4')
                  )}
                </div>

                <h4 className={styles.grammarSectionTitle}>With question words</h4>
                <div className={styles.grammarRow}>
                  What can you
                  <select
                    className={styles.inlineSelect}
                    value={getFieldValue('exercise_3_grammar', '5')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_3_grammar', '5', e.target.value)
                    }
                  >
                    <option value="">choose...</option>
                    <option value="cook">cook</option>
                    <option value="cooks">cooks</option>
                  </select>
                  ? <em>(I can cook fish.)</em>
                  {renderVerification(
                    'exercise_3_grammar',
                    '5',
                    getFieldValue('exercise_3_grammar', '5')
                  )}
                </div>

                <div className={styles.grammarRow}>
                  How many languages can you
                  <select
                    className={styles.inlineSelect}
                    value={getFieldValue('exercise_3_grammar', '6')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_3_grammar', '6', e.target.value)
                    }
                  >
                    <option value="">choose...</option>
                    <option value="speak">speak</option>
                    <option value="speaks">speaks</option>
                  </select>
                  ? <em>(Two. English and Spanish.)</em>
                  {renderVerification(
                    'exercise_3_grammar',
                    '6',
                    getFieldValue('exercise_3_grammar', '6')
                  )}
                </div>
              </div>
            </div>

            {/* Exercise 4a & 4b (Pronunciation) */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>4a</span>
                <p className={styles.exercisePrompt}>
                  Listen to the conversations. Do the words in blue sound the same or different?
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('6.16')}
                >
                  {currentPlayingAudio === '6.16' ? '⏸ Playing 6.16' : '▶ Audio 6.16'}
                </button>
              </div>

              <div className={styles.matchingList}>
                {[
                  {
                    id: '1',
                    text: '1 A: I can’t speak Spanish, can you? / B: No, I can’t.',
                  },
                  {
                    id: '2',
                    text: '2 A: Can you drive? / B: Yes, I can.',
                  },
                  {
                    id: '3',
                    text: '3 A: Can he swim? / B: Yes, he can.',
                  },
                ].map((item) => {
                  const val = getFieldValue('exercise_4a_sounds', item.id);
                  return (
                    <div key={item.id} className={styles.matchingRow}>
                      <span className={styles.matchingText}>{item.text}</span>
                      <select
                        className={styles.letterSelect}
                        value={val}
                        disabled={readOnly}
                        onChange={(e) =>
                          handleFieldChange('exercise_4a_sounds', item.id, e.target.value)
                        }
                      >
                        <option value="">Sound is...</option>
                        <option value="same">same</option>
                        <option value="different">different</option>
                      </select>
                      {renderVerification(
                        'exercise_4a_sounds',
                        item.id,
                        val
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 5: Interview */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>5</span>
                <p className={styles.exercisePrompt}>
                  Read the interview for a computer club teacher and choose the correct alternatives.
                </p>
              </div>

              <div className={styles.dialogueBlock}>
                {/* 1 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Sara:</span>
                  <div className={styles.speakerText}>
                    <select
                      className={styles.inlineSelect}
                      value={getFieldValue('exercise_5_dialogue', '1')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5_dialogue', '1', e.target.value)
                      }
                    >
                      <option value="">choose...</option>
                      <option value="Can you">Can you</option>
                      <option value="You can">You can</option>
                    </select>{' '}
                    use a computer?
                    {renderVerification(
                      'exercise_5_dialogue',
                      '1',
                      getFieldValue('exercise_5_dialogue', '1')
                    )}
                  </div>
                </div>

                {/* 2 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Rodrigo:</span>
                  <div className={styles.speakerText}>
                    Yes,{' '}
                    <select
                      className={styles.inlineSelect}
                      value={getFieldValue('exercise_5_dialogue', '2')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5_dialogue', '2', e.target.value)
                      }
                    >
                      <option value="">choose...</option>
                      <option value="can">can</option>
                      <option value="I can">I can</option>
                    </select>
                    . I use my computer every day.
                    {renderVerification(
                      'exercise_5_dialogue',
                      '2',
                      getFieldValue('exercise_5_dialogue', '2')
                    )}
                  </div>
                </div>

                {/* 3 & 4 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Sara:</span>
                  <div className={styles.speakerText}>
                    <select
                      className={styles.inlineSelect}
                      value={getFieldValue('exercise_5_dialogue', '3')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5_dialogue', '3', e.target.value)
                      }
                    >
                      <option value="">choose...</option>
                      <option value="You can">You can</option>
                      <option value="Can you">Can you</option>
                    </select>{' '}
                    build a website?
                    {renderVerification(
                      'exercise_5_dialogue',
                      '3',
                      getFieldValue('exercise_5_dialogue', '3')
                    )}
                  </div>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Rodrigo:</span>
                  <div className={styles.speakerText}>
                    Yes,{' '}
                    <select
                      className={styles.inlineSelect}
                      value={getFieldValue('exercise_5_dialogue', '4')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5_dialogue', '4', e.target.value)
                      }
                    >
                      <option value="">choose...</option>
                      <option value="I can">I can</option>
                      <option value="I can build">I can build</option>
                    </select>
                    .
                    {renderVerification(
                      'exercise_5_dialogue',
                      '4',
                      getFieldValue('exercise_5_dialogue', '4')
                    )}
                  </div>
                </div>

                {/* 5 & 6 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Sara:</span>
                  <div className={styles.speakerText}>
                    <select
                      className={styles.inlineSelect}
                      value={getFieldValue('exercise_5_dialogue', '5')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5_dialogue', '5', e.target.value)
                      }
                    >
                      <option value="">choose...</option>
                      <option value="You can">You can</option>
                      <option value="Can you">Can you</option>
                    </select>{' '}
                    speak two languages?
                    {renderVerification(
                      'exercise_5_dialogue',
                      '5',
                      getFieldValue('exercise_5_dialogue', '5')
                    )}
                  </div>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Rodrigo:</span>
                  <div className={styles.speakerText}>
                    <select
                      className={styles.inlineSelect}
                      value={getFieldValue('exercise_5_dialogue', '6')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5_dialogue', '6', e.target.value)
                      }
                    >
                      <option value="">choose...</option>
                      <option value="Can I">Can I</option>
                      <option value="I can">I can</option>
                    </select>{' '}
                    speak three languages.
                    {renderVerification(
                      'exercise_5_dialogue',
                      '6',
                      getFieldValue('exercise_5_dialogue', '6')
                    )}
                  </div>
                </div>

                {/* 7 & 8 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Sara:</span>
                  <div className={styles.speakerText}>
                    What languages{' '}
                    <select
                      className={styles.inlineSelect}
                      value={getFieldValue('exercise_5_dialogue', '7')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5_dialogue', '7', e.target.value)
                      }
                    >
                      <option value="">choose...</option>
                      <option value="can you">can you</option>
                      <option value="you can">you can</option>
                    </select>{' '}
                    speak?
                    {renderVerification(
                      'exercise_5_dialogue',
                      '7',
                      getFieldValue('exercise_5_dialogue', '7')
                    )}
                  </div>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Rodrigo:</span>
                  <div className={styles.speakerText}>
                    I{' '}
                    <select
                      className={styles.inlineSelect}
                      value={getFieldValue('exercise_5_dialogue', '8')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5_dialogue', '8', e.target.value)
                      }
                    >
                      <option value="">choose...</option>
                      <option value="am">am</option>
                      <option value="can">can</option>
                    </select>{' '}
                    speak English, Spanish and Japanese.
                    {renderVerification(
                      'exercise_5_dialogue',
                      '8',
                      getFieldValue('exercise_5_dialogue', '8')
                    )}
                  </div>
                </div>

                {/* 9 & 10 */}
                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Sara:</span>
                  <div className={styles.speakerText}>
                    <select
                      className={styles.inlineSelect}
                      value={getFieldValue('exercise_5_dialogue', '9')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5_dialogue', '9', e.target.value)
                      }
                    >
                      <option value="">choose...</option>
                      <option value="Can you">Can you</option>
                      <option value="Can">Can</option>
                    </select>{' '}
                    work at the weekend?
                    {renderVerification(
                      'exercise_5_dialogue',
                      '9',
                      getFieldValue('exercise_5_dialogue', '9')
                    )}
                  </div>
                </div>

                <div className={styles.dialogueLine}>
                  <span className={styles.speakerName}>Rodrigo:</span>
                  <div className={styles.speakerText}>
                    Yes, I{' '}
                    <select
                      className={styles.inlineSelect}
                      value={getFieldValue('exercise_5_dialogue', '10')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_5_dialogue', '10', e.target.value)
                      }
                    >
                      <option value="">choose...</option>
                      <option value="can">can</option>
                      <option value="can work">can work</option>
                    </select>
                    .
                    {renderVerification(
                      'exercise_5_dialogue',
                      '10',
                      getFieldValue('exercise_5_dialogue', '10')
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Speaking & Interaction */}
          <section>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Speaking: Job Interview & Club Teachers</h2>
            </div>

            {/* Exercise 6a */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>6a</span>
                <p className={styles.exercisePrompt}>
                  Write three questions with <em>can</em> for each of the jobs.
                </p>
              </div>

              <div className={styles.matchingList}>
                <div className={styles.clubSection}>
                  <span className={styles.clubHeader}>1 Taxi driver</span>
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="e.g. Can you drive?"
                    value={getFieldValue('exercise_6a_taxi', '1')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_6a_taxi', '1', e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="Question 2..."
                    value={getFieldValue('exercise_6a_taxi', '2')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_6a_taxi', '2', e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="Question 3..."
                    value={getFieldValue('exercise_6a_taxi', '3')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_6a_taxi', '3', e.target.value)
                    }
                  />
                </div>

                <div className={styles.clubSection}>
                  <span className={styles.clubHeader}>2 Office worker</span>
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="Question 1 (e.g. Can you use a computer?)..."
                    value={getFieldValue('exercise_6a_office', '1')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_6a_office', '1', e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="Question 2..."
                    value={getFieldValue('exercise_6a_office', '2')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_6a_office', '2', e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="Question 3..."
                    value={getFieldValue('exercise_6a_office', '3')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_6a_office', '3', e.target.value)
                    }
                  />
                </div>

                <div className={styles.clubSection}>
                  <span className={styles.clubHeader}>3 Hotel worker</span>
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="Question 1 (e.g. Can you speak English?)..."
                    value={getFieldValue('exercise_6a_hotel', '1')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_6a_hotel', '1', e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="Question 2..."
                    value={getFieldValue('exercise_6a_hotel', '2')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_6a_hotel', '2', e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className={styles.textInput}
                    placeholder="Question 3..."
                    value={getFieldValue('exercise_6a_hotel', '3')}
                    disabled={readOnly}
                    onChange={(e) =>
                      handleFieldChange('exercise_6a_hotel', '3', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Exercise 6b */}
            <div className={styles.exerciseCard}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>6b</span>
                <p className={styles.exercisePrompt}>
                  Work in pairs. Ask and answer the questions in Exercise 6a. What is a good job for your partner?
                </p>
              </div>

              <div className={styles.matchingRow}>
                <span className={styles.matchingText}>
                  <strong>Recommended job for your partner:</strong>
                </span>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="e.g. Taxi driver / Office worker / Hotel worker..."
                  value={getFieldValue('exercise_6b_partner', 'job')}
                  disabled={readOnly}
                  onChange={(e) =>
                    handleFieldChange('exercise_6b_partner', 'job', e.target.value)
                  }
                />
              </div>
            </div>

            {/* Exercise 7 (PREPARE) */}
            <div className={styles.exerciseCard}>
              <div className={styles.tagRibbon}>PREPARE</div>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>7</span>
                <p className={styles.exercisePrompt}>
                  Work in pairs. Read the information. Write questions for the club teachers.
                </p>
              </div>

              <div className={styles.notepadCard}>
                <h4 className={styles.notepadTitle}>Questions for club teachers</h4>
                <p className={styles.notepadSubtitle}>
                  Ask these questions to choose good teachers:
                </p>

                <div className={styles.matchingList}>
                  <div className={styles.clubSection}>
                    <span className={styles.clubHeader}>⚽ Sports club</span>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="1. Can you run? (example)"
                      value={getFieldValue('exercise_7_prepare', 'sports_1')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_7_prepare', 'sports_1', e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="2. Question for sports teacher..."
                      value={getFieldValue('exercise_7_prepare', 'sports_2')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_7_prepare', 'sports_2', e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="3. Question for sports teacher..."
                      value={getFieldValue('exercise_7_prepare', 'sports_3')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_7_prepare', 'sports_3', e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.clubSection}>
                    <span className={styles.clubHeader}>🍰 Food club</span>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="1. Question for food teacher (e.g. Can you make cakes?)..."
                      value={getFieldValue('exercise_7_prepare', 'food_1')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_7_prepare', 'food_1', e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="2. Question for food teacher..."
                      value={getFieldValue('exercise_7_prepare', 'food_2')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_7_prepare', 'food_2', e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="3. Question for food teacher..."
                      value={getFieldValue('exercise_7_prepare', 'food_3')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_7_prepare', 'food_3', e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.clubSection}>
                    <span className={styles.clubHeader}>✈️ Travel club</span>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="1. Question for travel teacher (e.g. Can you speak two languages?)..."
                      value={getFieldValue('exercise_7_prepare', 'travel_1')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_7_prepare', 'travel_1', e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="2. Question for travel teacher..."
                      value={getFieldValue('exercise_7_prepare', 'travel_2')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_7_prepare', 'travel_2', e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="3. Question for travel teacher..."
                      value={getFieldValue('exercise_7_prepare', 'travel_3')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_7_prepare', 'travel_3', e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.clubSection}>
                    <span className={styles.clubHeader}>💻 Computer club</span>
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="1. Question for computer teacher (e.g. Can you build a website?)..."
                      value={getFieldValue('exercise_7_prepare', 'comp_1')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_7_prepare', 'comp_1', e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="2. Question for computer teacher..."
                      value={getFieldValue('exercise_7_prepare', 'comp_2')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_7_prepare', 'comp_2', e.target.value)
                      }
                    />
                    <input
                      type="text"
                      className={styles.textInput}
                      placeholder="3. Question for computer teacher..."
                      value={getFieldValue('exercise_7_prepare', 'comp_3')}
                      disabled={readOnly}
                      onChange={(e) =>
                        handleFieldChange('exercise_7_prepare', 'comp_3', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 8 (SPEAK) */}
            <div className={styles.exerciseCard}>
              <div className={styles.tagRibbon}>SPEAK</div>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>8</span>
                <p className={styles.exercisePrompt}>
                  Work with another pair. Ask and answer the questions in Exercise 7. Who is a good
                  teacher for the clubs?
                </p>
              </div>

              {/* Model Dialogue */}
              <div className={styles.modelDialogue}>
                <p>
                  <strong>A:</strong> Can you run?
                </p>
                <p>
                  <strong>B:</strong> Yes, I can.
                </p>
              </div>

              {/* Notes Section */}
              <div className={styles.clubSection}>
                <span className={styles.clubHeader}>
                  📝 Your Notes: Who is a good teacher for the clubs?
                </span>
                <textarea
                  className={styles.reportTextarea}
                  placeholder="e.g. Maria is a good sports teacher because she can run and swim. Alex can teach the food club..."
                  value={getFieldValue('exercise_8_speak', 'notes')}
                  disabled={readOnly}
                  onChange={(e) =>
                    handleFieldChange('exercise_8_speak', 'notes', e.target.value)
                  }
                />
              </div>

              {/* Voice Recording Section */}
              <div className={styles.recordingSection}>
                <span className={styles.clubHeader}>
                  🎙️ Voice Recording: Present your club teacher candidate
                </span>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
                  Record yourself explaining who is a good teacher for the clubs and what they
                  can do.
                </p>
                <AudioAnswerRecorder
                  readOnly={readOnly}
                  onAudioChange={(blob, mime) =>
                    onAudioBlobChange?.(blob, mime, 'exercise_8_audio')
                  }
                />
                {submissionId && (
                  <SubmissionAudioPlayer
                    submissionId={submissionId}
                    exerciseKey="exercise_8_audio"
                    audios={submittedAudios}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
