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
import styles from './lesson7d.module.scss';

export interface Lesson7DContentProps {
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

export default function Lesson7DContent(props: Lesson7DContentProps) {
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
  const ex2aKey = getExerciseKey(activeAnswerKey, 'exercise_2a_train');
  const ex2bKey = getExerciseKey(activeAnswerKey, 'exercise_2b_ticket');
  const ex1aKey = getExerciseKey(activeAnswerKey, 'exercise_1a_compass');
  const ex1cKey = getExerciseKey(activeAnswerKey, 'exercise_1c_words');
  const ex2aRevKey = getExerciseKey(activeAnswerKey, 'exercise_2a_questions');
  const ex2bRevKey = getExerciseKey(activeAnswerKey, 'exercise_2b_matching');
  const ex3aKey = getExerciseKey(activeAnswerKey, 'exercise_3a_months');
  const ex3bKey = getExerciseKey(activeAnswerKey, 'exercise_3b_dates');
  const ex5Key = getExerciseKey(activeAnswerKey, 'exercise_5_alternatives');
  const ex6aKey = getExerciseKey(activeAnswerKey, 'exercise_6a_order');

  // Stored state
  const ex1Text = (answers.exercise_1_board as string) || '';

  const ex2aAnswer = (answers.exercise_2a_train as Record<string, string>)?.['1'] || '';
  const origEx2a = (originalAnswers.exercise_2a_train as Record<string, string>)?.['1'];

  const ex2bAnswer = (answers.exercise_2b_ticket as Record<string, string>)?.['1'] || '';

  const ex4aHelena = (answers.exercise_4a_helena as Record<string, string>) || {};

  // Check and reflect states
  const ex1aCompass = (answers.exercise_1a_compass as Record<string, string>) || {};
  const origEx1a = (originalAnswers.exercise_1a_compass as Record<string, string>) || {};

  const ex1bAnswers = (answers.exercise_1b_alternatives as Record<string, string>) || {};

  const ex1cAnswers = (answers.exercise_1c_words as Record<string, string>) || {};
  const origEx1c = (originalAnswers.exercise_1c_words as Record<string, string>) || {};

  const ex2aQuestions = (answers.exercise_2a_questions as Record<string, string>) || {};
  const origEx2aQ = (originalAnswers.exercise_2a_questions as Record<string, string>) || {};

  const ex2bMatches = (answers.exercise_2b_matching as Record<string, string>) || {};

  const ex3aMonths = (answers.exercise_3a_months as Record<string, string>) || {};
  const origEx3a = (originalAnswers.exercise_3a_months as Record<string, string>) || {};

  const ex3bDates = (answers.exercise_3b_dates as Record<string, string>) || {};
  const origEx3b = (originalAnswers.exercise_3b_dates as Record<string, string>) || {};

  const ex4WasWere = (answers.exercise_4_was_were as Record<string, string>) || {};

  const ex5Alts = (answers.exercise_5_alternatives as Record<string, string>) || {};
  const origEx5 = (originalAnswers.exercise_5_alternatives as Record<string, string>) || {};

  const ex6aOrder = (answers.exercise_6a_order as Record<string, string>) || {};
  const origEx6a = (originalAnswers.exercise_6a_order as Record<string, string>) || {};

  const reflectScores = (answers.reflect_scores as Record<string, number>) || {};

  // Handlers
  const handleEx2aChange = (val: string) => {
    context?.setAnswerField('exercise_2a_train', '1', val);
  };

  const handleEx2bTicket = (ticketLetter: string) => {
    if (effectiveReadOnly) return;
    context?.setAnswerField('exercise_2b_ticket', '1', ticketLetter);
  };

  const handleCompassChange = (dir: string, val: string) => {
    context?.setAnswerField('exercise_1a_compass', dir, val);
  };

  const handleEx1bChange = (id: string, val: string) => {
    context?.setAnswerField('exercise_1b_alternatives', id, val);
  };

  const handleEx1cChange = (id: string, val: string) => {
    context?.setAnswerField('exercise_1c_words', id, val);
  };

  const handleEx2aQChange = (id: string, val: string) => {
    context?.setAnswerField('exercise_2a_questions', id, val);
  };

  const handleEx2bMChange = (id: string, val: string) => {
    context?.setAnswerField('exercise_2b_matching', id, val);
  };

  const handleEx3aChange = (id: string, val: string) => {
    context?.setAnswerField('exercise_3a_months', id, val);
  };

  const handleEx3bChange = (id: string, val: string) => {
    context?.setAnswerField('exercise_3b_dates', id, val);
  };

  const handleEx4Change = (id: string, val: string) => {
    context?.setAnswerField('exercise_4_was_were', id, val);
  };

  const handleEx5Change = (id: string, val: string) => {
    context?.setAnswerField('exercise_5_alternatives', id, val);
  };

  const handleEx6aChange = (id: string, val: string) => {
    context?.setAnswerField('exercise_6a_order', id, val);
  };

  const handleReflectChange = (itemKey: string, rating: number) => {
    if (effectiveReadOnly) return;
    context?.setAnswerField('reflect_scores', itemKey, rating);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Header Banner */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.headerLeft}>
              <span className={styles.badge7D}>7D</span>
              <h1 className={styles.headerTitle}>English in action</h1>
            </div>
            <div className={styles.stationPhotoWrapper}>
              <Image
                src="/images/lesson7d/paddington_station.png"
                alt="Paddington Station London"
                width={204}
                height={104}
              />
            </div>
          </div>

          <div className={styles.goalPill}>
            <strong>Goal:</strong>
            <span>buy travel tickets</span>
          </div>
        </header>

        <div className={styles.pageContent}>
          {/* SECTION: BUYING TRAVEL TICKETS */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Welcome to Paddington Station</h2>
            </div>

            {/* Information Board Image */}
            <div className={styles.boardContainer}>
              <Image
                src="/images/lesson7d/station_board.png"
                alt="Paddington Station Departure Board"
                width={541}
                height={98}
              />
            </div>

            {/* Exercise 1 */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>1</span>
                <p className={styles.exerciseText}>
                  Look at the information board above. What information can you see?
                </p>
              </div>
              <textarea
                rows={2}
                value={ex1Text}
                onChange={(e) => context?.setAnswer('exercise_1_board', e.target.value)}
                disabled={effectiveReadOnly}
                placeholder="e.g. Departure times, platforms, destinations, arrival times..."
                className={styles.inputField}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {/* Exercise 2a: Which train does Jeff take? */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>2</span>
                <span className={styles.exerciseSubNum}>a</span>
                <p className={styles.exerciseText}>
                  Listen to Jeff buy a train ticket. Which train from Exercise 1 does he take?
                </p>
                <button
                  type="button"
                  className={`${styles.audioBtn} ${playingAudio === '7.15' ? styles.audioPlaying : ''}`}
                  onClick={() => playAudio?.('7.15')}
                  aria-label="Play Audio 7.15"
                >
                  {playingAudio === '7.15' ? '⏸ Playing 7.15' : '▶ Audio 7.15'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <label style={{ fontWeight: 700, color: '#4b5563' }}>Select train:</label>
                <select
                  value={ex2aAnswer}
                  onChange={(e) => handleEx2aChange(e.target.value)}
                  disabled={effectiveReadOnly}
                  className={`${styles.selectField} ${origEx2a !== undefined && origEx2a !== ex2aAnswer ? styles.diffHighlight : ''}`}
                >
                  <option value="">Select train number...</option>
                  <option value="1">Train 1: Cardiff (9.13, platform 3)</option>
                  <option value="2">Train 2: Oxford (9.17, platform 2)</option>
                  <option value="3">Train 3: Bath (9.20, platform 7)</option>
                  <option value="4">Train 4: Heathrow (9.25, platform 5)</option>
                  <option value="5">Train 5: Bath (9.30, platform 7)</option>
                  <option value="6">Train 6: Swansea (9.45, platform 1)</option>
                  <option value="7">Train 7: Heathrow (9.53, platform 5)</option>
                </select>

                {(() => {
                  const vRes = isReview ? verifyAnswer(ex2aAnswer, ex2aKey?.['1']) : null;
                  return (
                    <>
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
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Exercise 2b: Choose the correct ticket A-D */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>2</span>
                <span className={styles.exerciseSubNum}>b</span>
                <p className={styles.exerciseText}>
                  Listen again and choose the correct ticket A–D.
                </p>
              </div>

              <div className={styles.ticketsGrid}>
                {[
                  { letter: 'A', src: '/images/lesson7d/ticket_a.png', title: 'Return £68.20' },
                  { letter: 'B', src: '/images/lesson7d/ticket_b.png', title: 'Single £16.80' },
                  { letter: 'C', src: '/images/lesson7d/ticket_c.png', title: 'Return £107.00' },
                  { letter: 'D', src: '/images/lesson7d/ticket_d.png', title: 'Single £15' },
                ].map((ticket) => {
                  const isSelected = ex2bAnswer.toUpperCase() === ticket.letter;
                  const vRes = isReview ? verifyAnswer(ex2bAnswer, ex2bKey?.['1']) : null;
                  let ticketClass = '';
                  if (isSelected) {
                    if (vRes?.status === 'correct') ticketClass = styles.ticketValid;
                    else if (vRes?.status === 'incorrect') ticketClass = styles.ticketInvalid;
                    else ticketClass = styles.ticketSelected;
                  }

                  return (
                    <button
                      key={ticket.letter}
                      type="button"
                      disabled={effectiveReadOnly}
                      onClick={() => handleEx2bTicket(ticket.letter)}
                      className={`${styles.ticketCard} ${ticketClass}`}
                      aria-label={`Ticket ${ticket.letter} ${ticket.title}`}
                    >
                      <span className={styles.ticketLetter}>{ticket.letter}</span>
                      <Image
                        src={ticket.src}
                        alt={`Ticket ${ticket.letter} ${ticket.title}`}
                        width={119}
                        height={78}
                        className={styles.ticketImage}
                      />
                    </button>
                  );
                })}
              </div>

              {(() => {
                const vRes = isReview ? verifyAnswer(ex2bAnswer, ex2bKey?.['1']) : null;
                return (
                  vRes && (
                    <div className={styles.feedbackRow} style={{ marginTop: '0.5rem' }}>
                      <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                    </div>
                  )
                );
              })()}
            </div>

            {/* Useful Phrases Box */}
            <div className={styles.usefulPhrasesBox}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, color: '#6d28d9', fontSize: '1.15rem', fontWeight: 800 }}>
                  Useful phrases: Buying travel tickets
                </h3>
                <button
                  type="button"
                  className={`${styles.audioBtn} ${playingAudio === '7.16' ? styles.audioPlaying : ''}`}
                  onClick={() => playAudio?.('7.16')}
                  aria-label="Play Audio 7.16"
                >
                  {playingAudio === '7.16' ? '⏸ Playing 7.16' : '▶ Audio 7.16'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div className={styles.phrasesGroup}>
                  <h4>Customer</h4>
                  <ul>
                    <li>A ticket (for the fast train) to (Bath), please.</li>
                    <li>What time is the next train to (Bath), please?</li>
                    <li>What time does it arrive in (Bath)?</li>
                    <li>Which platform is the (fast) train to (Bath), please?</li>
                    <li>How much is a ticket to (Bath), please?</li>
                  </ul>
                </div>

                <div className={styles.phrasesGroup}>
                  <h4>Ticket Assistant</h4>
                  <ul>
                    <li>Is that a single or a return?</li>
                    <li>The next train leaves at (9.20).</li>
                    <li>It arrives at (12.15).</li>
                    <li>It leaves from platform (7).</li>
                    <li>That&apos;s (£68.20), please.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Exercise 4a: Helena's conversation & Heathrow Poster */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>4</span>
                <span className={styles.exerciseSubNum}>a</span>
                <p className={styles.exerciseText}>
                  Read the prompts and make a conversation. Helena&apos;s train is to Heathrow. Then listen and check your answers.
                </p>
                <button
                  type="button"
                  className={`${styles.audioBtn} ${playingAudio === '7.17' ? styles.audioPlaying : ''}`}
                  onClick={() => playAudio?.('7.17')}
                  aria-label="Play Audio 7.17"
                >
                  {playingAudio === '7.17' ? '⏸ Playing 7.17' : '▶ Audio 7.17'}
                </button>
              </div>

              <div className={styles.heathrowContentLayout}>
                {/* Dialogue column */}
                <div className={styles.heathrowDialogueCol}>
                  <div className={styles.sentencesList}>
                    {[
                      { id: '1', speaker: 'Helena', prompt: '(next train time?)', sample: 'What time is the next train to Heathrow, please?' },
                      { id: '2', speaker: 'Assistant', prompt: '(answer)', sample: 'The next train leaves at 9.25.' },
                      { id: '3', speaker: 'Helena', prompt: '(when arrive at Heathrow?)', sample: 'What time does it arrive in Heathrow?' },
                      { id: '4', speaker: 'Assistant', prompt: '(answer, give information about fast train)', sample: 'It arrives at 10.25. But there\'s a fast train at 9.53. It arrives at 10.15.' },
                      { id: '5', speaker: 'Helena', prompt: '(ask for ticket)', sample: 'A ticket for the fast train, please.' },
                      { id: '6', speaker: 'Assistant', prompt: '(single or return?)', sample: 'Is that a single or a return?' },
                      { id: '7', speaker: 'Helena', prompt: '(single)', sample: 'A single, please.' },
                      { id: '8', speaker: 'Assistant', prompt: '(say the price)', sample: 'That\'s £15, please.' },
                      { id: '9', speaker: 'Helena', prompt: '(say thank you; platform for fast train?)', sample: 'Thank you. Which platform is the fast train, please?' },
                      { id: '10', speaker: 'Assistant', prompt: '(answer)', sample: 'It leaves from platform 5.' },
                    ].map((line) => (
                      <div key={line.id} className={styles.sentenceItem}>
                        <div className={styles.sentenceRow}>
                          <strong style={{ color: line.speaker === 'Helena' ? '#7c3aed' : '#be123c' }}>
                            {line.speaker}:
                          </strong>
                          <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{line.prompt}</span>
                        </div>
                        <input
                          type="text"
                          value={ex4aHelena[line.id] || ''}
                          onChange={(e) => context?.setAnswerField('exercise_4a_helena', line.id, e.target.value)}
                          disabled={effectiveReadOnly}
                          placeholder=""
                          className={styles.inputField}
                          style={{ width: '100%', boxSizing: 'border-box', marginTop: '0.25rem' }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Roleplay Record */}
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ fontWeight: 700, margin: '0 0 0.5rem 0', color: '#4b5563' }}>
                      Practice the ticket conversation and record your roleplay:
                    </p>
                    <AudioAnswerRecorder
                      onAudioChange={(blob, mime) => onAudioBlobChange?.(blob, mime, 'exercise_5')}
                      readOnly={effectiveReadOnly}
                    />

                    {submissionId && (
                      <SubmissionAudioPlayer
                        submissionId={submissionId}
                        exerciseKey="exercise_5"
                        audios={submittedAudios}
                      />
                    )}
                  </div>
                </div>

                {/* Heathrow Poster */}
                <aside className={styles.heathrowPosterAside}>
                  <div className={styles.posterHeathrowCard}>
                    <div className={styles.posterHeader}>
                      <span className={styles.posterBadge}>Information</span>
                      <span className={styles.posterTitle}>Trains to Heathrow</span>
                    </div>
                    <div className={styles.posterImageWrap}>
                      <Image
                        src="/images/lesson7d/poster_heathrow.png"
                        alt="Trains to Heathrow Poster: Single £15, Return £27.50"
                        width={255}
                        height={201}
                        className={styles.posterImage}
                      />
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          {/* SECTION: CHECK AND REFLECT (Page 61) */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Check and reflect</h2>
            </div>

            {/* Exercise 1a: Compass */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>1</span>
                <span className={styles.exerciseSubNum}>a</span>
                <p className={styles.exerciseText}>
                  Look at the compass and complete the words.
                </p>
              </div>

              {(() => {
                const vResN = isReview ? verifyAnswer(ex1aCompass.n || '', ex1aKey?.['n']) : null;
                const vResS = isReview ? verifyAnswer(ex1aCompass.s || '', ex1aKey?.['s']) : null;
                const vResW = isReview ? verifyAnswer(ex1aCompass.w || '', ex1aKey?.['w']) : null;
                const vResE = isReview ? verifyAnswer(ex1aCompass.e || '', ex1aKey?.['e']) : null;

                return (
                  <div className={styles.compassWrapper}>
                    <div className={styles.compassGrid}>
                      {/* Top row: North */}
                      <div className={styles.compassCellNorth}>
                        <div className={styles.compassInputRow}>
                          <span className={styles.compassPrefix}>n</span>
                          <input
                            type="text"
                            value={ex1aCompass.n || ''}
                            onChange={(e) => handleCompassChange('n', e.target.value)}
                            disabled={effectiveReadOnly}
                            placeholder=""
                            aria-label="Direction North"
                            className={`${styles.inputField} ${styles.compassInput} ${
                              vResN?.status === 'correct'
                                ? styles.inputValid
                                : vResN?.status === 'incorrect'
                                ? styles.inputInvalid
                                : ''
                            } ${origEx1a.n !== undefined && origEx1a.n !== ex1aCompass.n ? styles.diffHighlight : ''}`}
                          />
                        </div>
                        {vResN && (
                          <div className={styles.compassFeedback}>
                            <TeacherAnswerBadge result={vResN} isTeacherReview={isReview} />
                          </div>
                        )}
                      </div>

                      {/* Middle row: West */}
                      <div className={styles.compassCellWest}>
                        <div className={styles.compassInputRow}>
                          <span className={styles.compassPrefix}>w</span>
                          <input
                            type="text"
                            value={ex1aCompass.w || ''}
                            onChange={(e) => handleCompassChange('w', e.target.value)}
                            disabled={effectiveReadOnly}
                            placeholder=""
                            aria-label="Direction West"
                            className={`${styles.inputField} ${styles.compassInput} ${
                              vResW?.status === 'correct'
                                ? styles.inputValid
                                : vResW?.status === 'incorrect'
                                ? styles.inputInvalid
                                : ''
                            } ${origEx1a.w !== undefined && origEx1a.w !== ex1aCompass.w ? styles.diffHighlight : ''}`}
                          />
                        </div>
                        {vResW && (
                          <div className={styles.compassFeedback}>
                            <TeacherAnswerBadge result={vResW} isTeacherReview={isReview} />
                          </div>
                        )}
                      </div>

                      {/* Center: Compass Rose */}
                      <div className={styles.compassCellCenter}>
                        <Image
                          src="/images/lesson7d/compass_rose.png"
                          alt="Compass Rose"
                          width={74}
                          height={77}
                          className={styles.compassImage}
                        />
                      </div>

                      {/* Middle row: East */}
                      <div className={styles.compassCellEast}>
                        <div className={styles.compassInputRow}>
                          <span className={styles.compassPrefix}>e</span>
                          <input
                            type="text"
                            value={ex1aCompass.e || ''}
                            onChange={(e) => handleCompassChange('e', e.target.value)}
                            disabled={effectiveReadOnly}
                            placeholder=""
                            aria-label="Direction East"
                            className={`${styles.inputField} ${styles.compassInput} ${
                              vResE?.status === 'correct'
                                ? styles.inputValid
                                : vResE?.status === 'incorrect'
                                ? styles.inputInvalid
                                : ''
                            } ${origEx1a.e !== undefined && origEx1a.e !== ex1aCompass.e ? styles.diffHighlight : ''}`}
                          />
                        </div>
                        {vResE && (
                          <div className={styles.compassFeedback}>
                            <TeacherAnswerBadge result={vResE} isTeacherReview={isReview} />
                          </div>
                        )}
                      </div>

                      {/* Bottom row: South */}
                      <div className={styles.compassCellSouth}>
                        <div className={styles.compassInputRow}>
                          <span className={styles.compassPrefix}>s</span>
                          <input
                            type="text"
                            value={ex1aCompass.s || ''}
                            onChange={(e) => handleCompassChange('s', e.target.value)}
                            disabled={effectiveReadOnly}
                            placeholder=""
                            aria-label="Direction South"
                            className={`${styles.inputField} ${styles.compassInput} ${
                              vResS?.status === 'correct'
                                ? styles.inputValid
                                : vResS?.status === 'incorrect'
                                ? styles.inputInvalid
                                : ''
                            } ${origEx1a.s !== undefined && origEx1a.s !== ex1aCompass.s ? styles.diffHighlight : ''}`}
                          />
                        </div>
                        {vResS && (
                          <div className={styles.compassFeedback}>
                            <TeacherAnswerBadge result={vResS} isTeacherReview={isReview} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Exercise 1b: Alternatives */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>1</span>
                <span className={styles.exerciseSubNum}>b</span>
                <p className={styles.exerciseText}>
                  Choose the correct alternatives.
                </p>
              </div>

              <div className={styles.sentencesList}>
                <div className={styles.sentenceItem}>
                  <div className={styles.sentenceRow}>
                    <span>1 It&apos;s a nice day. There isn&apos;t a</span>
                    <select
                      value={ex1bAnswers['1_1'] || ''}
                      onChange={(e) => handleEx1bChange('1_1', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.selectField}
                    >
                      <option value="">Select...</option>
                      <option value="sky">sky</option>
                      <option value="cloud">cloud</option>
                    </select>
                    <span>in the</span>
                    <select
                      value={ex1bAnswers['1_2'] || ''}
                      onChange={(e) => handleEx1bChange('1_2', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.selectField}
                    >
                      <option value="">Select...</option>
                      <option value="sky">sky</option>
                      <option value="cloud">cloud</option>
                    </select>
                    <span>.</span>
                  </div>
                </div>

                <div className={styles.sentenceItem}>
                  <div className={styles.sentenceRow}>
                    <span>2 We swim in the</span>
                    <select
                      value={ex1bAnswers['2_1'] || ''}
                      onChange={(e) => handleEx1bChange('2_1', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.selectField}
                    >
                      <option value="">Select...</option>
                      <option value="lake">lake</option>
                      <option value="fields">fields</option>
                    </select>
                    <span>and walk in the</span>
                    <select
                      value={ex1bAnswers['2_2'] || ''}
                      onChange={(e) => handleEx1bChange('2_2', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.selectField}
                    >
                      <option value="">Select...</option>
                      <option value="lake">lake</option>
                      <option value="fields">fields</option>
                    </select>
                    <span>.</span>
                  </div>
                </div>

                <div className={styles.sentenceItem}>
                  <div className={styles.sentenceRow}>
                    <span>3 There&apos;s</span>
                    <select
                      value={ex1bAnswers['3_1'] || ''}
                      onChange={(e) => handleEx1bChange('3_1', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.selectField}
                    >
                      <option value="">Select...</option>
                      <option value="an island">an island</option>
                      <option value="a hill">a hill</option>
                    </select>
                    <span>in</span>
                    <select
                      value={ex1bAnswers['3_2'] || ''}
                      onChange={(e) => handleEx1bChange('3_2', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.selectField}
                    >
                      <option value="">Select...</option>
                      <option value="the sea">the sea</option>
                      <option value="the mountain">the mountain</option>
                    </select>
                    <span>. You can go there by boat.</span>
                  </div>
                </div>

                <div className={styles.sentenceItem}>
                  <div className={styles.sentenceRow}>
                    <span>4 You can see the high</span>
                    <select
                      value={ex1bAnswers['4'] || ''}
                      onChange={(e) => handleEx1bChange('4', e.target.value)}
                      disabled={effectiveReadOnly}
                      className={styles.selectField}
                    >
                      <option value="">Select...</option>
                      <option value="mountains">mountains</option>
                      <option value="flowers">flowers</option>
                    </select>
                    <span>in the north.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 1c: Words in box (last, today, weekend, yesterday) */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>1</span>
                <span className={styles.exerciseSubNum}>c</span>
                <p className={styles.exerciseText}>
                  Complete the sentences with the words in the box (<strong>last, today, weekend, yesterday</strong>).
                </p>
              </div>

              <div className={styles.sentencesList}>
                {[
                  { id: '1', pre: '1 There was a big party in our office', post: '.' },
                  { id: '2', pre: '2 It was my birthday', post: 'Tuesday. It was my 21st!' },
                  { id: '3', pre: '3 Is there a train to Brussels', post: '?' },
                  { id: '4', pre: '4 There was a Ryan Gosling film at the cinema last', post: '. It was great!' },
                ].map((item) => {
                  const val = ex1cAnswers[item.id] || '';
                  const origVal = origEx1c[item.id];
                  const isChanged = origVal !== undefined && origVal !== val;
                  const vRes = isReview ? verifyAnswer(val, ex1cKey?.[item.id]) : null;

                  return (
                    <div key={item.id} className={styles.sentenceItem}>
                      <div className={styles.sentenceRow}>
                        <span>{item.pre}</span>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleEx1cChange(item.id, e.target.value)}
                          disabled={effectiveReadOnly}
                          placeholder=""
                          className={`${styles.inputField} ${
                            vRes?.status === 'correct'
                              ? styles.inputValid
                              : vRes?.status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                          } ${isChanged ? styles.diffHighlight : ''}`}
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
            </div>

            {/* Exercise 2a: Questions order & 2b: Matching */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>2</span>
                <span className={styles.exerciseSubNum}>a</span>
                <p className={styles.exerciseText}>
                  Put the words in the correct order to make questions.
                </p>
              </div>

              <div className={styles.sentencesList}>
                {[
                  { id: '1', prompt: 'does / What / do / a taxi driver ?', answerKeyOption: 'e (He/She drives a car.)' },
                  { id: '2', prompt: 'is / the / White House / Where ?', answerKeyOption: 'c (It\'s in Washington DC.)' },
                  { id: '3', prompt: 'was / Pelé / Who ?', answerKeyOption: 'f (a footballer)' },
                  { id: '4', prompt: 'is / Valentine\'s Day / When ?', answerKeyOption: 'd (14th February)' },
                  { id: '5', prompt: 'in August / many / How / days / are / there ?', answerKeyOption: 'b (31)' },
                  { id: '6', prompt: 'got / How / rooms / the Taj Mahal / many / has ?', answerKeyOption: 'a (120)' },
                ].map((item) => {
                  const val = ex2aQuestions[item.id] || '';
                  const origVal = origEx2aQ[item.id];
                  const isChanged = origVal !== undefined && origVal !== val;
                  const vRes = isReview ? verifyAnswer(val, ex2aRevKey?.[item.id]) : null;

                  const matchVal = ex2bMatches[item.id] || '';
                  const vMatchRes = isReview ? verifyAnswer(matchVal, ex2bRevKey?.[item.id]) : null;

                  return (
                    <div key={item.id} className={styles.sentenceItem}>
                      <div className={styles.sentenceRow}>
                        <span><strong>{item.id}.</strong> {item.prompt}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleEx2aQChange(item.id, e.target.value)}
                          disabled={effectiveReadOnly}
                          placeholder=""
                          className={`${styles.inputField} ${
                            vRes?.status === 'correct'
                              ? styles.inputValid
                              : vRes?.status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                          } ${isChanged ? styles.diffHighlight : ''}`}
                          style={{ flex: 1, minWidth: '220px' }}
                        />
                        {vRes?.status === 'correct' && (
                          <span className={styles.correctBadge}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                          </span>
                        )}

                        {/* Match answer selector (2b) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>2b Answer:</span>
                          <select
                            value={matchVal}
                            onChange={(e) => handleEx2bMChange(item.id, e.target.value)}
                            disabled={effectiveReadOnly}
                            className={styles.selectField}
                          >
                            <option value="">Match...</option>
                            <option value="a">a 120</option>
                            <option value="b">b 31</option>
                            <option value="c">c It&apos;s in Washington DC.</option>
                            <option value="d">d 14th February</option>
                            <option value="e">e He/She drives a car.</option>
                            <option value="f">f a footballer</option>
                          </select>
                          {vMatchRes?.status === 'correct' && (
                            <span className={styles.correctBadge}>
                              <TeacherAnswerBadge result={vMatchRes} isTeacherReview={isReview} />
                            </span>
                          )}
                        </div>
                      </div>
                      {vRes && vRes.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                        </div>
                      )}
                      {vMatchRes && vMatchRes.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vMatchRes} isTeacherReview={isReview} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 3a: Months of the year */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>3</span>
                <span className={styles.exerciseSubNum}>a</span>
                <p className={styles.exerciseText}>
                  Complete the words with the months of the year in the correct order.
                </p>
              </div>

              {(() => {
                const monthsCol1 = [
                  { id: '1', letter: 'J' },
                  { id: '2', letter: 'F' },
                  { id: '3', letter: 'M' },
                  { id: '4', letter: 'A' },
                  { id: '5', letter: 'M' },
                  { id: '6', letter: 'J' },
                ];
                const monthsCol2 = [
                  { id: '7', letter: 'J' },
                  { id: '8', letter: 'A' },
                  { id: '9', letter: 'S' },
                  { id: '10', letter: 'O' },
                  { id: '11', letter: 'N' },
                  { id: '12', letter: 'D' },
                ];

                return (
                  <div className={styles.monthsTwoCols}>
                    {[monthsCol1, monthsCol2].map((col, colIdx) => (
                      <div key={colIdx} className={styles.monthsColumn}>
                        {col.map((m) => {
                          const val = ex3aMonths[m.id] || '';
                          const origVal = origEx3a[m.id];
                          const isChanged = origVal !== undefined && origVal !== val;
                          const vRes = isReview ? verifyAnswer(val, ex3aKey?.[m.id]) : null;

                          return (
                            <div key={m.id} className={styles.monthCard}>
                              <div className={styles.monthCardMain}>
                                <span className={styles.monthIndex}>{m.id}.</span>
                                <span className={styles.monthLetter}>{m.letter}</span>
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => handleEx3aChange(m.id, e.target.value)}
                                  disabled={effectiveReadOnly}
                                  placeholder=""
                                  aria-label={`Month ${m.id}`}
                                  className={`${styles.inputField} ${styles.monthInput} ${
                                    vRes?.status === 'correct'
                                      ? styles.inputValid
                                      : vRes?.status === 'incorrect'
                                      ? styles.inputInvalid
                                      : ''
                                  } ${isChanged ? styles.diffHighlight : ''}`}
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
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Exercise 3b: Rewrite dates as words */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>3</span>
                <span className={styles.exerciseSubNum}>b</span>
                <p className={styles.exerciseText}>
                  Rewrite the dates as words (e.g. <em>1 2nd &rarr; second</em>).
                </p>
              </div>

              <div className={styles.sentencesList}>
                {[
                  { id: '2', date: '11th' },
                  { id: '3', date: '23rd' },
                  { id: '4', date: '19th' },
                  { id: '5', date: '30th' },
                  { id: '6', date: '12th' },
                  { id: '7', date: '8th' },
                  { id: '8', date: '27th' },
                  { id: '9', date: '5th' },
                  { id: '10', date: '31st' },
                ].map((d) => {
                  const val = ex3bDates[d.id] || '';
                  const origVal = origEx3b[d.id];
                  const isChanged = origVal !== undefined && origVal !== val;
                  const vRes = isReview ? verifyAnswer(val, ex3bKey?.[d.id]) : null;

                  return (
                    <div key={d.id} className={styles.sentenceItem}>
                      <div className={styles.sentenceRow}>
                        <strong style={{ minWidth: '55px' }}>{d.id}. {d.date}</strong>
                        <span>&rarr;</span>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleEx3bChange(d.id, e.target.value)}
                          disabled={effectiveReadOnly}
                          placeholder=""
                          className={`${styles.inputField} ${
                            vRes?.status === 'correct'
                              ? styles.inputValid
                              : vRes?.status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                          } ${isChanged ? styles.diffHighlight : ''}`}
                          style={{ minWidth: '150px' }}
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

            {/* Exercise 4: Text with was, were, wasn't, weren't */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>4</span>
                <p className={styles.exerciseText}>
                  Complete the text with <em>was, were, wasn&apos;t</em> or <em>weren&apos;t</em>.
                </p>
              </div>

              <div style={{ lineHeight: '2.2', fontSize: '0.98rem', color: '#1f2937', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                I <strong>1 was</strong> on holiday last week with my friend Kate. We <strong>2</strong>&nbsp;
                <select
                  value={ex4WasWere['2'] || ''}
                  onChange={(e) => handleEx4Change('2', e.target.value)}
                  disabled={effectiveReadOnly}
                  className={styles.selectField}
                >
                  <option value="">Select...</option>
                  <option value="was">was</option>
                  <option value="were">were</option>
                  <option value="wasn't">wasn&apos;t</option>
                  <option value="weren't">weren&apos;t</option>
                </select>
                &nbsp;in Spain and our hotel <strong>3</strong>&nbsp;
                <select
                  value={ex4WasWere['3'] || ''}
                  onChange={(e) => handleEx4Change('3', e.target.value)}
                  disabled={effectiveReadOnly}
                  className={styles.selectField}
                >
                  <option value="">Select...</option>
                  <option value="was">was</option>
                  <option value="were">were</option>
                  <option value="wasn't">wasn&apos;t</option>
                  <option value="weren't">weren&apos;t</option>
                </select>
                &nbsp;really good. There <strong>4</strong>&nbsp;
                <select
                  value={ex4WasWere['4'] || ''}
                  onChange={(e) => handleEx4Change('4', e.target.value)}
                  disabled={effectiveReadOnly}
                  className={styles.selectField}
                >
                  <option value="">Select...</option>
                  <option value="was">was</option>
                  <option value="were">were</option>
                  <option value="wasn't">wasn&apos;t</option>
                  <option value="weren't">weren&apos;t</option>
                </select>
                &nbsp;a lot of people at the hotel &ndash; six or seven &ndash; and it <strong>5</strong>&nbsp;
                <select
                  value={ex4WasWere['5'] || ''}
                  onChange={(e) => handleEx4Change('5', e.target.value)}
                  disabled={effectiveReadOnly}
                  className={styles.selectField}
                >
                  <option value="">Select...</option>
                  <option value="was">was</option>
                  <option value="were">were</option>
                  <option value="wasn't">wasn&apos;t</option>
                  <option value="weren't">weren&apos;t</option>
                </select>
                &nbsp;quiet. There <strong>6</strong>&nbsp;
                <select
                  value={ex4WasWere['6'] || ''}
                  onChange={(e) => handleEx4Change('6', e.target.value)}
                  disabled={effectiveReadOnly}
                  className={styles.selectField}
                >
                  <option value="">Select...</option>
                  <option value="was">was</option>
                  <option value="were">were</option>
                  <option value="wasn't">wasn&apos;t</option>
                  <option value="weren't">weren&apos;t</option>
                </select>
                &nbsp;a restaurant at the hotel but there <strong>7</strong>&nbsp;
                <select
                  value={ex4WasWere['7'] || ''}
                  onChange={(e) => handleEx4Change('7', e.target.value)}
                  disabled={effectiveReadOnly}
                  className={styles.selectField}
                >
                  <option value="">Select...</option>
                  <option value="was">was</option>
                  <option value="were">were</option>
                  <option value="wasn't">wasn&apos;t</option>
                  <option value="weren't">weren&apos;t</option>
                </select>
                &nbsp;really good restaurants in the town centre. The town <strong>8</strong>&nbsp;
                <select
                  value={ex4WasWere['8'] || ''}
                  onChange={(e) => handleEx4Change('8', e.target.value)}
                  disabled={effectiveReadOnly}
                  className={styles.selectField}
                >
                  <option value="">Select...</option>
                  <option value="was">was</option>
                  <option value="were">were</option>
                  <option value="wasn't">wasn&apos;t</option>
                  <option value="weren't">weren&apos;t</option>
                </select>
                &nbsp;never quiet. It <strong>9</strong>&nbsp;
                <select
                  value={ex4WasWere['9'] || ''}
                  onChange={(e) => handleEx4Change('9', e.target.value)}
                  disabled={effectiveReadOnly}
                  className={styles.selectField}
                >
                  <option value="">Select...</option>
                  <option value="was">was</option>
                  <option value="were">were</option>
                  <option value="wasn't">wasn&apos;t</option>
                  <option value="weren't">weren&apos;t</option>
                </select>
                &nbsp;always busy.
              </div>
            </div>

            {/* Exercise 5: Choose the correct alternatives */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>5</span>
                <p className={styles.exerciseText}>
                  Choose the correct alternatives.
                </p>
              </div>

              <div className={styles.sentencesList}>
                {[
                  { id: '1', pre: '1 My friend has got a new car. It\'s really', options: ['fast', 'slow'], post: '!' },
                  { id: '2', pre: '2 My father is 89. He\'s', options: ['a young', 'an old'], post: 'man.' },
                  { id: '3', pre: '3 The homework wasn\'t', options: ['easy', 'difficult'], post: ', but it was OK.' },
                  { id: '4', pre: '4 In Canada, it\'s really', options: ['hot', 'cold'], post: 'in January and February.' },
                  { id: '5', pre: '5 It was a really', options: ['short', 'long'], post: 'meeting! We were there for nine hours!' },
                  { id: '6', pre: '6 Mount Everest is 8,848 metres. It\'s a', options: ['high', 'low'], post: 'mountain.' },
                  { id: '7', pre: '7 It was late at night and it was', options: ['light', 'dark'], post: '.' },
                  { id: '8', pre: '8 We\'ve got', options: ['hot', 'cold'], post: 'drinks; tea and coffee.' },
                  { id: '9', pre: '9 The dog\'s', options: ['happy', 'sad'], post: '. It\'s got a ball.' },
                ].map((item) => {
                  const val = ex5Alts[item.id] || '';
                  const origVal = origEx5[item.id];
                  const isChanged = origVal !== undefined && origVal !== val;
                  const vRes = isReview ? verifyAnswer(val, ex5Key?.[item.id]) : null;

                  return (
                    <div key={item.id} className={styles.sentenceItem}>
                      <div className={styles.sentenceRow}>
                        <span>{item.pre}</span>
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
                                onClick={() => handleEx5Change(item.id, opt)}
                                className={`${styles.chipBtn} ${chipStatus} ${isChanged && isSelected ? styles.diffHighlight : ''}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
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
            </div>

            {/* Exercise 6a: Put words in correct order to make questions */}
            <div className={styles.exerciseBlock}>
              <div className={styles.exerciseTitleRow}>
                <span className={styles.exerciseNum}>6</span>
                <span className={styles.exerciseSubNum}>a</span>
                <p className={styles.exerciseText}>
                  Put the words in the correct order to make questions (e.g. <em>1 Were you at home last night?</em>).
                </p>
              </div>

              <div className={styles.sentencesList}>
                {[
                  { id: '2', prompt: 'name / your / was / What / first teacher\'s ?' },
                  { id: '3', prompt: 'expensive / Was / your / phone ?' },
                  { id: '4', prompt: 'were / Where / you / 8.00 a.m. / at ?' },
                  { id: '5', prompt: 'there / a / difficult / Was / question / in class ?' },
                  { id: '6', prompt: 'students / there / last week / were / How / in class / many ?' },
                ].map((item) => {
                  const val = ex6aOrder[item.id] || '';
                  const origVal = origEx6a[item.id];
                  const isChanged = origVal !== undefined && origVal !== val;
                  const vRes = isReview ? verifyAnswer(val, ex6aKey?.[item.id]) : null;

                  return (
                    <div key={item.id} className={styles.sentenceItem}>
                      <div className={styles.sentenceRow}>
                        <span><strong>{item.id}.</strong> {item.prompt}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleEx6aChange(item.id, e.target.value)}
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

            {/* Reflect */}
            <div className={styles.exerciseBlock}>
              <h3 style={{ margin: 0, color: '#6d28d9', fontSize: '1.15rem', fontWeight: 800 }}>
                Reflect: Unit 7 Progress
              </h3>
              <p style={{ margin: '0.25rem 0 0.75rem 0', color: '#4b5563', fontSize: '0.9rem' }}>
                How confident do you feel about the statements below? Rate 1–5 (1 = not very confident, 5 = very confident).
              </p>

              <table className={styles.reflectTable}>
                <thead>
                  <tr>
                    <th>Can-do Statement</th>
                    <th style={{ width: '140px', textAlign: 'center' }}>Rating (1–5)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'place', text: 'I can ask and answer about a place.' },
                    { key: 'good_days', text: 'I can talk about good days.' },
                    { key: 'past_events', text: 'I can ask and answer about past events.' },
                    { key: 'travel_tickets', text: 'I can buy travel tickets.' },
                  ].map((row) => {
                    const currentRating = reflectScores[row.key] || 0;
                    return (
                      <tr key={row.key}>
                        <td>{row.text}</td>
                        <td style={{ textAlign: 'center' }}>
                          <div className={styles.starRating}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                disabled={effectiveReadOnly}
                                onClick={() => handleReflectChange(row.key, star)}
                                className={`${styles.starBtn} ${star <= currentRating ? styles.starActive : ''}`}
                                aria-label={`Rate ${star} star`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
