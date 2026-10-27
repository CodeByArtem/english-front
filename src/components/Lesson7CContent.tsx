'use client';

import React from 'react';
import Image from 'next/image';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import { verifyAnswer, getExerciseKey, LessonAnswerKey } from '@/lib/answerVerification';
import { useLessonContext } from '@/context/LessonContext';
import AudioAnswerRecorder from './AudioAnswerRecorder/AudioAnswerRecorder';
import SubmissionAudioPlayer, {
  SubmissionAudioMeta,
} from './AudioAnswerRecorder/SubmissionAudioPlayer';
import styles from './lesson7c.module.scss';

export interface Lesson7CContentProps {
  lesson?: Record<string, unknown> | null;
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

export default function Lesson7CContent(props: Lesson7CContentProps) {
  const context = useLessonContext();

  const {
    isTeacherReview = false,
    readOnly = false,
    answerKey: propAnswerKey,
    playAudio: propPlayAudio,
    playingAudio: propPlayingAudio,
    originalAnswers: propOriginalAnswers,
    submissionId: propSubmissionId,
    submittedAudios: propSubmittedAudios,
    onAudioBlobChange,
  } = props;

  const playAudio = propPlayAudio ?? context?.playAudio;
  const playingAudio = propPlayingAudio ?? context?.playingAudio;
  const activeAnswerKey =
    propAnswerKey ||
    (context?.answerKey as LessonAnswerKey) ||
    (context?.lesson?.answerKey as LessonAnswerKey) ||
    null;
  const isReview = Boolean(isTeacherReview || (activeAnswerKey && readOnly));
  const effectiveReadOnly = readOnly || isTeacherReview;

  const answers = (context?.answers as Record<string, unknown>) || {};
  const originalAnswers = propOriginalAnswers || answers;
  const submissionId = propSubmissionId ?? context?.submissionId;
  const submittedAudios = propSubmittedAudios ?? context?.audios;

  // Answer Keys
  const ex1Key = getExerciseKey(activeAnswerKey, 'exercise_1_opposites');
  const ex3Key = getExerciseKey(activeAnswerKey, 'exercise_3_sentences');
  const ex5aKey = getExerciseKey(activeAnswerKey, 'exercise_5a_matching');
  const ex5bKey = getExerciseKey(activeAnswerKey, 'exercise_5b_alternatives');
  const ex6Key = getExerciseKey(activeAnswerKey, 'exercise_6_grammar');
  const ex8Key = getExerciseKey(activeAnswerKey, 'exercise_8_alternatives');
  const ex9aKey = getExerciseKey(activeAnswerKey, 'exercise_9a_questions');

  // Stored state
  const ex1Answers = (answers.exercise_1_opposites as Record<string, string>) || {};
  const origEx1 = (originalAnswers.exercise_1_opposites as Record<string, string>) || {};

  const ex3Answers = (answers.exercise_3_sentences as Record<string, string>) || {};
  const origEx3 = (originalAnswers.exercise_3_sentences as Record<string, string>) || {};

  const ex4Answer = (answers.exercise_4_personal as string) || '';

  const ex5aAnswers = (answers.exercise_5a_matching as Record<string, string>) || {};
  const origEx5a = (originalAnswers.exercise_5a_matching as Record<string, string>) || {};

  const ex5bAnswers = (answers.exercise_5b_alternatives as Record<string, string>) || {};
  const origEx5b = (originalAnswers.exercise_5b_alternatives as Record<string, string>) || {};

  const ex6Answers = (answers.exercise_6_grammar as Record<string, string>) || {};

  const ex8Answers = (answers.exercise_8_alternatives as Record<string, string>) || {};

  const ex9aAnswers = (answers.exercise_9a_questions as Record<string, string>) || {};
  const origEx9a = (originalAnswers.exercise_9a_questions as Record<string, string>) || {};

  const ex10Notes = (answers.exercise_10_notes as Record<string, Record<string, string>>) || {};

  const handleEx1Change = (id: string, val: string) => {
    context?.setAnswerField('exercise_1_opposites', id, val);
  };

  const handleEx3Change = (id: string, val: string) => {
    context?.setAnswerField('exercise_3_sentences', id, val);
  };

  const handleEx5aChange = (id: string, val: string) => {
    context?.setAnswerField('exercise_5a_matching', id, val);
  };

  const handleEx5bChange = (id: string, val: string) => {
    context?.setAnswerField('exercise_5b_alternatives', id, val);
  };

  const handleEx6Change = (id: string, val: string) => {
    context?.setAnswerField('exercise_6_grammar', id, val);
  };

  const handleEx8Change = (id: string, val: string) => {
    context?.setAnswerField('exercise_8_alternatives', id, val);
  };

  const handleEx9aChange = (id: string, val: string) => {
    context?.setAnswerField('exercise_9a_questions', id, val);
  };

  const handleEx10Change = (col: string, row: string, val: string) => {
    const current = ex10Notes[col] || {};
    context?.setAnswerField('exercise_10_notes', col, { ...current, [row]: val });
  };

  // Opposite adjective options
  const oppositePairs = [
    { num: '1', word: 'cold', options: [{ letter: 'c', text: 'hot' }, { letter: 'b', text: 'sad' }, { letter: 'd', text: 'young' }] },
    { num: '2', word: 'dark', options: [{ letter: 'h', text: 'light' }, { letter: 'e', text: 'short' }, { letter: 'f', text: 'slow' }] },
    { num: '3', word: 'difficult', options: [{ letter: 'a', text: 'easy' }, { letter: 'c', text: 'hot' }, { letter: 'g', text: 'low' }] },
    { num: '4', word: 'fast', options: [{ letter: 'f', text: 'slow' }, { letter: 'a', text: 'easy' }, { letter: 'h', text: 'light' }] },
    { num: '5', word: 'happy', options: [{ letter: 'b', text: 'sad' }, { letter: 'd', text: 'young' }, { letter: 'g', text: 'low' }] },
    { num: '6', word: 'high', options: [{ letter: 'g', text: 'low' }, { letter: 'e', text: 'short' }, { letter: 'f', text: 'slow' }] },
    { num: '7', word: 'long', options: [{ letter: 'e', text: 'short' }, { letter: 'a', text: 'easy' }, { letter: 'h', text: 'light' }] },
    { num: '8', word: 'old', options: [{ letter: 'd', text: 'young' }, { letter: 'b', text: 'sad' }, { letter: 'c', text: 'hot' }] },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Header Banner */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <span className={styles.badge7C}>7C</span>
            <h1 className={styles.headerTitle}>How was it?</h1>
          </div>

          <div className={styles.goalsList}>
            <div className={styles.goalItem}>
              <strong>Goal:</strong>
              <span>ask and answer about past events</span>
            </div>
            <div className={styles.goalItem}>
              <strong>Grammar:</strong>
              <span>was/were (questions), there was/were (questions)</span>
            </div>
            <div className={styles.goalItem}>
              <strong>Vocabulary:</strong>
              <span>adjectives &amp; opposite pairs</span>
            </div>
          </div>

          {/* Visual Gallery Collage */}
          <div className={styles.collageGrid}>
            <div className={styles.collageCard}>
              <Image
                src="/images/lesson7c/header_fire.png"
                alt="Fire - hot"
                width={240}
                height={130}
              />
              <span className={styles.collageLabel}>hot</span>
            </div>
            <div className={styles.collageCard}>
              <Image
                src="/images/lesson7c/header_bubbles.png"
                alt="Girl with bubbles - young"
                width={140}
                height={140}
              />
              <span className={styles.collageLabel}>young</span>
            </div>
            <div className={styles.collageCard}>
              <Image
                src="/images/lesson7c/header_train.png"
                alt="Fast train - fast"
                width={220}
                height={140}
              />
              <span className={styles.collageLabel}>fast</span>
            </div>
            <div className={styles.collageCard}>
              <Image
                src="/images/lesson7c/header_man.png"
                alt="Old man - old"
                width={160}
                height={140}
              />
              <span className={styles.collageLabel}>old</span>
            </div>
            <div className={styles.collageCard}>
              <Image
                src="/images/lesson7c/header_turtle.png"
                alt="Turtle - slow"
                width={190}
                height={140}
              />
              <span className={styles.collageLabel}>slow</span>
            </div>
          </div>
        </header>

        <div className={styles.pageContent}>
          {/* SECTION: VOCABULARY */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Vocabulary: Adjectives</h2>
            </div>

            {/* Exercise 1 & 2 */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>1</span>
                <p className={styles.exerciseText}>
                  Match adjectives 1–8 with their opposites, a–h.
                </p>
                <button
                  type="button"
                  className={`${styles.audioBtn} ${playingAudio === '7.12' ? styles.audioPlaying : ''}`}
                  onClick={() => playAudio?.('7.12')}
                  aria-label="Play Audio 7.12"
                >
                  {playingAudio === '7.12' ? '⏸ Playing 7.12' : '▶ Audio 7.12'}
                </button>
              </div>

              <div className={styles.oppositesGrid}>
                {oppositePairs.map((pair) => {
                  const val = ex1Answers[pair.num] || '';
                  const origVal = origEx1[pair.num];
                  const isChanged = origVal !== undefined && origVal !== val;
                  const vRes = isReview ? verifyAnswer(val, ex1Key?.[pair.num]) : null;

                  return (
                    <div key={pair.num} className={styles.oppositeCard}>
                      <span className={styles.oppositeLeft}>
                        {pair.num}. {pair.word}
                      </span>
                      <span>&harr;</span>
                      <select
                        value={val}
                        onChange={(e) => handleEx1Change(pair.num, e.target.value)}
                        disabled={effectiveReadOnly}
                        className={`${styles.oppositeSelect} ${isChanged ? styles.diffHighlight : ''}`}
                        aria-label={`Opposite for ${pair.word}`}
                      >
                        <option value="">Select opposite...</option>
                        <option value="a">a easy</option>
                        <option value="b">b sad</option>
                        <option value="c">c hot</option>
                        <option value="d">d young</option>
                        <option value="e">e short</option>
                        <option value="f">f slow</option>
                        <option value="g">g low</option>
                        <option value="h">h light</option>
                      </select>
                      {vRes?.status === 'correct' && (
                        <span className={styles.correctBadge}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                        </span>
                      )}
                      {vRes && vRes.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 3 & 4 with Winter Context Banner */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>3</span>
                <p className={styles.exerciseText}>
                  Complete the sentences with words from Exercise 1.
                </p>
              </div>

              {/* Winter Context Banner */}
              <div className={styles.winterContextBanner}>
                <div className={styles.winterImgWrap}>
                  <Image
                    src="/images/lesson7c/photo_winter_cold.png"
                    alt="Park in winter - cold"
                    width={220}
                    height={195}
                  />
                </div>
                <div className={styles.winterTextWrap}>
                  <span className={styles.winterTag}>Photo context: Sentence 1</span>
                  <p className={styles.winterQuote}>
                    &ldquo;In December, I don&apos;t have lunch in the park. It&apos;s <strong>cold</strong>.&rdquo;
                  </p>
                  <p className={styles.winterHint}>
                    Look at the snowy park above and complete all 8 sentences using the opposite adjectives from Exercise 1.
                  </p>
                </div>
              </div>

              <div className={styles.sentencesList} style={{ marginTop: '0.5rem' }}>
                {[
                  { id: '1', pre: 'In December, I don\'t have lunch in the park. It\'s', post: '.' },
                  { id: '2', pre: 'A: Has that building got a lift? B: Yes! The building is very', post: '.' },
                  { id: '3', pre: 'It\'s her ninety-seventh birthday today. She\'s', post: '.' },
                  { id: '4', pre: 'Don\'t take the bus. It\'s', post: '. It arrives at 9. Take the train. It arrives at 8.30.' },
                  { id: '5', pre: 'This book is', post: '. The words are long.' },
                  { id: '6', pre: 'There aren\'t any lights here. It\'s really', post: 'at night.' },
                  { id: '7', pre: 'My daughter hasn\'t got homework this week. She\'s really', post: '.' },
                  { id: '8', pre: 'It\'s a', post: 'film. It\'s only an hour!' },
                ].map((item) => {
                  const val = ex3Answers[item.id] || '';
                  const origVal = origEx3[item.id];
                  const isChanged = origVal !== undefined && origVal !== val;
                  const vRes = isReview ? verifyAnswer(val, ex3Key?.[item.id]) : null;

                  return (
                    <div key={item.id} className={styles.sentenceItem}>
                      <div className={styles.sentenceRow}>
                        <span><strong>{item.id}</strong> {item.pre}</span>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleEx3Change(item.id, e.target.value)}
                          disabled={effectiveReadOnly}
                          placeholder=""
                          className={`${styles.inputField} ${
                            vRes?.status === 'correct'
                              ? styles.inputValid
                              : vRes?.status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                          } ${isChanged ? styles.diffHighlight : ''}`}
                          aria-label={`Sentence ${item.id} adjective`}
                        />
                        <span>{item.post}</span>
                        {vRes?.status === 'correct' && (
                          <span className={styles.correctBadge}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                          </span>
                        )}
                      </div>
                      {vRes && vRes.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Exercise 4 */}
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem' }}>
                <div className={styles.exerciseTitleRow}>
                  <span className={styles.exerciseNum}>4</span>
                  <p className={styles.exerciseText}>
                    Make similar sentences with the other words from Exercise 1 (e.g. <em>In August, I have lunch in the park. It&apos;s hot.</em>).
                  </p>
                </div>
                <textarea
                  rows={3}
                  value={ex4Answer}
                  onChange={(e) => context?.setAnswer('exercise_4_personal', e.target.value)}
                  disabled={effectiveReadOnly}
                  placeholder="Write your sentences here..."
                  className={styles.inputField}
                  style={{ width: '100%', boxSizing: 'border-box', marginTop: '0.5rem', resize: 'vertical' }}
                />
              </div>
            </div>
          </section>

          {/* SECTION: LISTENING */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Listening: Past Events</h2>
              <button
                type="button"
                className={`${styles.audioBtn} ${playingAudio === '7.13' ? styles.audioPlaying : ''}`}
                onClick={() => playAudio?.('7.13')}
                aria-label="Play Audio 7.13"
              >
                {playingAudio === '7.13' ? '⏸ Playing 7.13' : '▶ Audio 7.13'}
              </button>
            </div>

            {/* Exercise 5a */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>5</span>
                <span className={styles.exerciseSubNum}>a</span>
                <p className={styles.exerciseText}>
                  Listen and match conversations 1–3 with photos A–C.
                </p>
              </div>

              <div className={styles.listeningGrid}>
                <div className={styles.listeningCard}>
                  <Image
                    src="/images/lesson7c/listening_a_mountain.png"
                    alt="Mountain hike"
                    width={240}
                    height={160}
                  />
                  <div className={styles.listeningCardInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={styles.badgePhotoLetter}>A</span>
                      <strong>Mountain hike</strong>
                    </div>
                  </div>
                </div>

                <div className={styles.listeningCard}>
                  <Image
                    src="/images/lesson7c/listening_b_meeting.png"
                    alt="Business meeting"
                    width={240}
                    height={160}
                  />
                  <div className={styles.listeningCardInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={styles.badgePhotoLetter}>B</span>
                      <strong>Office meeting</strong>
                    </div>
                  </div>
                </div>

                <div className={styles.listeningCard}>
                  <Image
                    src="/images/lesson7c/listening_c_train.png"
                    alt="Crowded train"
                    width={240}
                    height={160}
                  />
                  <div className={styles.listeningCardInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={styles.badgePhotoLetter}>C</span>
                      <strong>Busy train</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Selectors */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                {['1', '2', '3'].map((convNum) => {
                  const val = ex5aAnswers[convNum] || '';
                  const origVal = origEx5a[convNum];
                  const isChanged = origVal !== undefined && origVal !== val;
                  const vRes = isReview ? verifyAnswer(val, ex5aKey?.[convNum]) : null;

                  return (
                    <div key={convNum} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong>Conversation {convNum}:</strong>
                      <select
                        value={val}
                        onChange={(e) => handleEx5aChange(convNum, e.target.value)}
                        disabled={effectiveReadOnly}
                        className={`${styles.oppositeSelect} ${isChanged ? styles.diffHighlight : ''}`}
                        aria-label={`Match conversation ${convNum}`}
                      >
                        <option value="">Select photo...</option>
                        <option value="A">Photo A (Mountain)</option>
                        <option value="B">Photo B (Meeting)</option>
                        <option value="C">Photo C (Train)</option>
                      </select>
                      {vRes?.status === 'correct' && (
                        <span className={styles.correctBadge}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                        </span>
                      )}
                      {vRes && vRes.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 5b: Alternatives */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>5</span>
                <span className={styles.exerciseSubNum}>b</span>
                <p className={styles.exerciseText}>
                  Listen again and choose the correct alternatives.
                </p>
              </div>

              <div className={styles.sentencesList}>
                {[
                  {
                    id: '1a',
                    label: '1 a. The meeting today was about new',
                    options: ['computers', 'phones'],
                  },
                  {
                    id: '1b',
                    label: '1 b. It was a',
                    post: 'meeting.',
                    options: ['difficult', 'long'],
                  },
                  {
                    id: '2a',
                    label: '2 a. The mountain was really',
                    options: ['high', 'short'],
                  },
                  {
                    id: '2b',
                    label: '2 b. They were',
                    options: ['slow', 'cold'],
                  },
                  {
                    id: '3a',
                    label: '3 a. The train was',
                    options: ['dark', 'busy'],
                  },
                  {
                    id: '3b',
                    label: '3 b. It was really slow and',
                    options: ['hot', 'old'],
                  },
                ].map((item) => {
                  const val = ex5bAnswers[item.id] || '';
                  const origVal = origEx5b[item.id];
                  const isChanged = origVal !== undefined && origVal !== val;
                  const vRes = isReview ? verifyAnswer(val, ex5bKey?.[item.id]) : null;

                  return (
                    <div key={item.id} className={styles.sentenceItem}>
                      <div className={styles.sentenceRow}>
                        <span>{item.label}</span>
                        <div className={styles.chipsRow}>
                          {item.options.map((opt) => {
                            const isSelected = val.toLowerCase() === opt.toLowerCase();
                            let chipStatus = '';
                            if (isSelected) {
                              if (vRes?.status === 'correct') chipStatus = styles.chipValid;
                              else if (vRes?.status === 'incorrect') chipStatus = styles.chipInvalid;
                              else chipStatus = styles.chipSelected;
                            }

                            return (
                              <button
                                key={opt}
                                type="button"
                                disabled={effectiveReadOnly}
                                onClick={() => handleEx5bChange(item.id, opt)}
                                className={`${styles.chipBtn} ${chipStatus} ${isChanged && isSelected ? styles.diffHighlight : ''}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {item.post && <span>{item.post}</span>}
                        {vRes?.status === 'correct' && (
                          <span className={styles.correctBadge}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                          </span>
                        )}
                      </div>
                      {vRes && vRes.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION: GRAMMAR (was/were) */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Grammar: was/were (questions)</h2>
            </div>

            {/* Exercise 6: Grammar Box */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>6</span>
                <p className={styles.exerciseText}>
                  Read the grammar box and choose the correct alternatives.
                </p>
              </div>

              <table className={styles.grammarTable}>
                <thead>
                  <tr>
                    <th colSpan={4}>was / were (questions)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>?</td>
                    <td>
                      <select
                        value={ex6Answers['1'] || ''}
                        onChange={(e) => handleEx6Change('1', e.target.value)}
                        disabled={effectiveReadOnly}
                        className={styles.oppositeSelect}
                      >
                        <option value="">1 Was / Were</option>
                        <option value="Was">Was</option>
                        <option value="Were">Were</option>
                      </select>
                      &nbsp;he/she/it OK?
                    </td>
                    <td>+</td>
                    <td>Yes, he/she/it was.</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>-</td>
                    <td>No, he/she/it wasn&apos;t.</td>
                  </tr>
                  <tr>
                    <td>?</td>
                    <td>Were you cold?</td>
                    <td>+</td>
                    <td>Yes, I was.</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>-</td>
                    <td>
                      No, I&nbsp;
                      <select
                        value={ex6Answers['2'] || ''}
                        onChange={(e) => handleEx6Change('2', e.target.value)}
                        disabled={effectiveReadOnly}
                        className={styles.oppositeSelect}
                      >
                        <option value="">2 weren&apos;t / wasn&apos;t</option>
                        <option value="wasn't">wasn&apos;t</option>
                        <option value="weren't">weren&apos;t</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>?</td>
                    <td>Where&nbsp;
                      <select
                        value={ex6Answers['3'] || ''}
                        onChange={(e) => handleEx6Change('3', e.target.value)}
                        disabled={effectiveReadOnly}
                        className={styles.oppositeSelect}
                      >
                        <option value="">3 was / were</option>
                        <option value="was">was</option>
                        <option value="were">were</option>
                      </select>
                      &nbsp;they?
                    </td>
                    <td colSpan={2}>How much&nbsp;
                      <select
                        value={ex6Answers['4'] || ''}
                        onChange={(e) => handleEx6Change('4', e.target.value)}
                        disabled={effectiveReadOnly}
                        className={styles.oppositeSelect}
                      >
                        <option value="">4 was / were</option>
                        <option value="was">was</option>
                        <option value="were">were</option>
                      </select>
                      &nbsp;it?
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={4}>there was / were (questions)</th>
                  </tr>
                  <tr>
                    <td>?</td>
                    <td>Was there a meeting?</td>
                    <td>+</td>
                    <td>
                      Yes, there&nbsp;
                      <select
                        value={ex6Answers['5'] || ''}
                        onChange={(e) => handleEx6Change('5', e.target.value)}
                        disabled={effectiveReadOnly}
                        className={styles.oppositeSelect}
                      >
                        <option value="">5 was / wasn&apos;t</option>
                        <option value="was">was</option>
                        <option value="wasn't">wasn&apos;t</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>?</td>
                    <td>
                      <select
                        value={ex6Answers['6'] || ''}
                        onChange={(e) => handleEx6Change('6', e.target.value)}
                        disabled={effectiveReadOnly}
                        className={styles.oppositeSelect}
                      >
                        <option value="">6 Was / Were</option>
                        <option value="Was">Was</option>
                        <option value="Were">Were</option>
                      </select>
                      &nbsp;there a lot of people?
                    </td>
                    <td>+</td>
                    <td>Yes, there were.</td>
                  </tr>
                </tbody>
              </table>

              {isReview && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {['1', '2', '3', '4', '5', '6'].map((k) => {
                    const vRes = verifyAnswer(ex6Answers[k] || '', ex6Key?.[k]);
                    return vRes && vRes.status !== 'correct' ? (
                      <div key={k} className={styles.feedbackRow}>
                        <strong>Item {k}:</strong>
                        <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Exercise 7: Audio 7.14 */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>7</span>
                <p className={styles.exerciseText}>
                  Listen to four conversations. Notice the pronunciation of the words in blue (<em>was</em> /wəz/, <em>were</em> /wə/).
                </p>
                <button
                  type="button"
                  className={`${styles.audioBtn} ${playingAudio === '7.14' ? styles.audioPlaying : ''}`}
                  onClick={() => playAudio?.('7.14')}
                  aria-label="Play Audio 7.14"
                >
                  {playingAudio === '7.14' ? '⏸ Playing 7.14' : '▶ Audio 7.14'}
                </button>
              </div>

              <div className={styles.dialogueBox}>
                <div className={styles.dialogueLine}>
                  <strong>1 A:</strong>
                  <span><strong>Was</strong> the hotel good? <strong>B:</strong> Yes, it <strong>was</strong>. It <strong>was</strong> great.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <strong>2 A:</strong>
                  <span><strong>Were</strong> they expensive? <strong>B:</strong> Yes, they <strong>were</strong>. They <strong>were</strong> about £50.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <strong>3 A:</strong>
                  <span><strong>Were</strong> there drinks? <strong>B:</strong> Yes, there <strong>were</strong>. There <strong>were</strong> cups of tea and coffee.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <strong>4 A:</strong>
                  <span><strong>Was</strong> there a restaurant? <strong>B:</strong> Yes, there <strong>was</strong>. It <strong>was</strong> really good.</span>
                </div>
              </div>
            </div>

            {/* Exercise 8: Dialogue Alternatives */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>8</span>
                <p className={styles.exerciseText}>
                  Choose the correct alternatives in the dialogue.
                </p>
              </div>

              <div className={styles.dialogueBox}>
                <div className={styles.dialogueLine}>
                  <strong>Hank:</strong>
                  <span>How&nbsp;
                    <select
                      value={ex8Answers['1'] || ''}
                      onChange={(e) => handleEx8Change('1', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.oppositeSelect}
                    >
                      <option value="">1 was / were</option>
                      <option value="was">was</option>
                      <option value="were">were</option>
                    </select>
                    &nbsp;your weekend?
                  </span>
                </div>

                <div className={styles.dialogueLine}>
                  <strong>Donna:</strong>
                  <span>Great. It&nbsp;
                    <select
                      value={ex8Answers['2'] || ''}
                      onChange={(e) => handleEx8Change('2', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.oppositeSelect}
                    >
                      <option value="">2 was / were</option>
                      <option value="was">was</option>
                      <option value="were">were</option>
                    </select>
                    &nbsp;my dad&apos;s sixtieth birthday party on Saturday night.
                  </span>
                </div>

                <div className={styles.dialogueLine}>
                  <strong>Hank:</strong>
                  <span>
                    <select
                      value={ex8Answers['3'] || ''}
                      onChange={(e) => handleEx8Change('3', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.oppositeSelect}
                    >
                      <option value="">3 Was / Were</option>
                      <option value="Was">Was</option>
                      <option value="Were">Were</option>
                    </select>
                    &nbsp;it good?
                  </span>
                </div>

                <div className={styles.dialogueLine}>
                  <strong>Donna:</strong>
                  <span>Yes, it was.</span>
                </div>

                <div className={styles.dialogueLine}>
                  <strong>Hank:</strong>
                  <span>Where&nbsp;
                    <select
                      value={ex8Answers['4'] || ''}
                      onChange={(e) => handleEx8Change('4', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.oppositeSelect}
                    >
                      <option value="">4 was / were</option>
                      <option value="was">was</option>
                      <option value="were">were</option>
                    </select>
                    &nbsp;the party?
                  </span>
                </div>

                <div className={styles.dialogueLine}>
                  <strong>Donna:</strong>
                  <span>It&nbsp;
                    <select
                      value={ex8Answers['5'] || ''}
                      onChange={(e) => handleEx8Change('5', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.oppositeSelect}
                    >
                      <option value="">5 was / were</option>
                      <option value="was">was</option>
                      <option value="were">were</option>
                    </select>
                    &nbsp;in the restaurant near the park.
                  </span>
                </div>

                <div className={styles.dialogueLine}>
                  <strong>Hank:</strong>
                  <span>How many people&nbsp;
                    <select
                      value={ex8Answers['6'] || ''}
                      onChange={(e) => handleEx8Change('6', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.oppositeSelect}
                    >
                      <option value="">6 was / were</option>
                      <option value="was">was</option>
                      <option value="were">were</option>
                    </select>
                    &nbsp;there?
                  </span>
                </div>

                <div className={styles.dialogueLine}>
                  <strong>Donna:</strong>
                  <span>About 50.</span>
                </div>

                <div className={styles.dialogueLine}>
                  <strong>Hank:</strong>
                  <span>Wow!&nbsp;
                    <select
                      value={ex8Answers['7'] || ''}
                      onChange={(e) => handleEx8Change('7', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.oppositeSelect}
                    >
                      <option value="">7 Was / Were</option>
                      <option value="Was">Was</option>
                      <option value="Were">Were</option>
                    </select>
                    &nbsp;there a cake?
                  </span>
                </div>

                <div className={styles.dialogueLine}>
                  <strong>Donna:</strong>
                  <span>No, there&nbsp;
                    <select
                      value={ex8Answers['8'] || ''}
                      onChange={(e) => handleEx8Change('8', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.oppositeSelect}
                    >
                      <option value="">8 wasn&apos;t / weren&apos;t</option>
                      <option value="wasn't">wasn&apos;t</option>
                      <option value="weren't">weren&apos;t</option>
                    </select>
                    . Dad doesn&apos;t like it!
                  </span>
                </div>
              </div>

              {isReview && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {['1', '2', '3', '4', '5', '6', '7', '8'].map((k) => {
                    const vRes = verifyAnswer(ex8Answers[k] || '', ex8Key?.[k]);
                    return vRes && vRes.status !== 'correct' ? (
                      <div key={k} className={styles.feedbackRow}>
                        <strong>Item {k}:</strong>
                        <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            {/* Exercise 9a: Make Questions */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>9</span>
                <span className={styles.exerciseSubNum}>a</span>
                <p className={styles.exerciseText}>
                  Make questions using the prompts.
                </p>
              </div>

              <div className={styles.sentencesList}>
                {[
                  { id: '1', prompt: 'your last test / easy or difficult?' },
                  { id: '2', prompt: 'you / at home / on Saturday night?' },
                  { id: '3', prompt: 'you / at 10.00 p.m. last night?' },
                  { id: '4', prompt: 'there a swimming pool / at your school?' },
                  { id: '5', prompt: 'it cold / this morning?' },
                  { id: '6', prompt: 'your favourite / class at school?' },
                ].map((item) => {
                  const val = ex9aAnswers[item.id] || '';
                  const origVal = origEx9a[item.id];
                  const isChanged = origVal !== undefined && origVal !== val;
                  const vRes = isReview ? verifyAnswer(val, ex9aKey?.[item.id]) : null;

                  return (
                    <div key={item.id} className={styles.sentenceItem}>
                      <div className={styles.sentenceRow}>
                        <span><strong>{item.id}.</strong> {item.prompt}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleEx9aChange(item.id, e.target.value)}
                          disabled={effectiveReadOnly}
                          placeholder=""
                          className={`${styles.inputField} ${
                            vRes?.status === 'correct'
                              ? styles.inputValid
                              : vRes?.status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                          } ${isChanged ? styles.diffHighlight : ''}`}
                          style={{ flex: 1 }}
                          aria-label={`Question ${item.id}`}
                        />
                        {vRes?.status === 'correct' && (
                          <span className={styles.correctBadge}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                          </span>
                        )}
                      </div>
                      {vRes && vRes.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* SECTION: SPEAKING & HOLIDAY PHOTO */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Speaking: Past Events &amp; Holidays</h2>
            </div>

            {/* PREPARE 10a */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>10</span>
                <span className={styles.exerciseSubNum}>a</span>
                <p className={styles.exerciseText}>
                  <strong>PREPARE:</strong> Make notes about past events in the table.
                </p>
              </div>

              <table className={styles.grammarTable}>
                <thead>
                  <tr>
                    <th></th>
                    <th>your day</th>
                    <th>your weekend</th>
                    <th>your holiday</th>
                  </tr>
                </thead>
                <tbody>
                  {['good or bad?', 'where?', 'who with?'].map((rowLabel) => (
                    <tr key={rowLabel}>
                      <td><strong>{rowLabel}</strong></td>
                      {['day', 'weekend', 'holiday'].map((col) => (
                        <td key={col}>
                          <input
                            type="text"
                            value={ex10Notes[col]?.[rowLabel] || ''}
                            onChange={(e) => handleEx10Change(col, rowLabel, e.target.value)}
                            disabled={effectiveReadOnly}
                            placeholder=""
                            className={styles.inputField}
                            style={{ width: '100%', boxSizing: 'border-box' }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SPEAK 11 */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>11</span>
                <p className={styles.exerciseText}>
                  <strong>SPEAK:</strong> Work in pairs. Ask and answer about your day, weekend, or holiday. Record your voice summary for your teacher!
                </p>
              </div>

              {/* Authentic Beach Photo Banner */}
              <div className={styles.beachBanner}>
                <Image
                  src="/images/lesson7c/photo_beach_holiday.png"
                  alt="Sunny beach in Spain"
                  width={640}
                  height={320}
                />
              </div>

              <div className={styles.dialogueBox}>
                <div className={styles.dialogueLine}>
                  <strong>A:</strong>
                  <span>How was your holiday?</span>
                </div>
                <div className={styles.dialogueLine}>
                  <strong>B:</strong>
                  <span>It was great. I was in Spain.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <strong>A:</strong>
                  <span>Was it hot?</span>
                </div>
                <div className={styles.dialogueLine}>
                  <strong>B:</strong>
                  <span>Yes, it was.</span>
                </div>
                <div className={styles.dialogueLine}>
                  <strong>A:</strong>
                  <span>Was it expensive?</span>
                </div>
                <div className={styles.dialogueLine}>
                  <strong>B:</strong>
                  <span>No, it wasn&apos;t. It was cheap.</span>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <AudioAnswerRecorder
                  onAudioChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'exercise_11')}
                  readOnly={effectiveReadOnly}
                />

                {submissionId && (
                  <SubmissionAudioPlayer
                    submissionId={submissionId}
                    exerciseKey="exercise_11"
                    audios={submittedAudios}
                  />
                )}
              </div>

              <div className={styles.badgeDevelop}>
                <span>📖 Develop your reading — page 106</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
