'use client';

import React, { useState, useEffect } from 'react';
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
import styles from './lesson9c.module.scss';

export interface Lesson9CContentProps {
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

export const FALLBACK_ANSWER_KEY_9C: LessonAnswerKey = {
  exercise_1a_matching: {
    '1': ['D', 'd', 'Photo D', 'photo d'],
    '2': ['G', 'g', 'Photo G', 'photo g'],
    '3': ['J', 'j', 'Photo J', 'photo j'],
    '4': ['B', 'b', 'Photo B', 'photo b'],
    '5': ['L', 'l', 'Photo L', 'photo l'],
    '6': ['A', 'a', 'Photo A', 'photo a'],
    '7': ['H', 'h', 'Photo H', 'photo h'],
    '8': ['K', 'k', 'Photo K', 'photo k'],
    '9': ['F', 'f', 'Photo F', 'photo f'],
    '10': ['C', 'c', 'Photo C', 'photo c'],
    '11': ['E', 'e', 'Photo E', 'photo e'],
    '12': ['I', 'i', 'Photo I', 'photo i'],
  },
  exercise_2_vocabulary: {
    '1': ['dictionary', 'Dictionary'],
    '2': ['remember', 'Remember', "can't remember", 'cant remember'],
    '3': ['course', 'Course'],
    '4': ['board', 'Board'],
    '5': ['library', 'Library'],
    '6': ['failed', 'Failed'],
    '7': ['exam', 'Exam'],
    '8': ['passed', 'Passed'],
  },
  exercise_4a_matching: {
    '1': ['E', 'e'],
    '2': ['D', 'd'],
    '3': ['B', 'b'],
    '4': ['C', 'c'],
    '5': ['A', 'a'],
  },
  exercise_4b_answers: {
    '1': [
      'she often talks to people from other countries',
      'she uses it for her work',
      'she talks to people from other countries',
      'Because she uses it for her work',
      'she talks to people from different countries',
    ],
    '2': [
      'there is an English exam',
      'she has an English exam',
      'there is an exam on Saturday',
      'she has an exam on Saturday',
      'there is an English exam on Saturday',
    ],
    '3': [
      'he is very good and knows about her exam',
      'he is very good',
      'the teacher is very good',
      'he knows about her exam',
      'the teacher is very good and knows about her exam',
    ],
  },
  exercise_5_grammar_box: {
    '1': ['do you study English', 'do you study English?'],
    '2': [
      "didn't you study English at school",
      "didn't you study English at school?",
      'did you study English at school',
      'did you study English at school?',
    ],
    '3': ['do you study here', 'do you study here?'],
    '4': ['have you got four lessons this week', 'have you got four lessons this week?'],
  },
  exercise_7a_conversation: {
    '1': ['do you', 'Do you'],
    '2': ['Because', 'because'],
    '3': ['I', 'i'],
    '4': ['Where', 'where'],
    '5': ['Why', 'why'],
    '6': ["it's", "It's", 'it is', 'It is'],
    '7': ['Do', 'do'],
    '8': ['because', 'Because'],
    '9': ['Why', 'why'],
    '10': ['because', 'Because'],
  },
};

const STUDY_PICTURES = [
  { id: 'A', name: 'pic_a_library.png', title: 'Picture A', desc: 'Go to the library' },
  { id: 'B', name: 'pic_b_exam.png', title: 'Picture B', desc: 'Take an exam' },
  { id: 'C', name: 'pic_c_fail.png', title: 'Picture C', desc: 'Fail an exam' },
  { id: 'D', name: 'pic_d_board.png', title: 'Picture D', desc: 'Write on the board' },
  { id: 'E', name: 'pic_e_answer.png', title: 'Picture E', desc: 'Know the answer' },
  { id: 'F', name: 'pic_f_pass.png', title: 'Picture F', desc: 'Pass an exam' },
  { id: 'G', name: 'pic_g_course.png', title: 'Picture G', desc: 'Take a course' },
  { id: 'H', name: 'pic_h_notes.png', title: 'Picture H', desc: 'Make notes' },
  { id: 'I', name: 'pic_i_remember.png', title: 'Picture I', desc: "Can't remember a word" },
  { id: 'J', name: 'pic_j_dictionary.png', title: 'Picture J', desc: 'Use a dictionary' },
  { id: 'K', name: 'pic_k_online.png', title: 'Picture K', desc: 'Do online practice' },
  { id: 'L', name: 'pic_l_homework.png', title: 'Picture L', desc: 'Do my homework' },
];

const MATCHING_PHRASES_1A = [
  { id: '1', phrase: 'write on the board' },
  { id: '2', phrase: 'take a course' },
  { id: '3', phrase: 'use a dictionary' },
  { id: '4', phrase: 'take an exam' },
  { id: '5', phrase: 'do my homework' },
  { id: '6', phrase: 'go to the library' },
  { id: '7', phrase: 'make notes' },
  { id: '8', phrase: 'do online practice' },
  { id: '9', phrase: 'pass an exam' },
  { id: '10', phrase: 'fail an exam' },
  { id: '11', phrase: 'know the answer' },
  { id: '12', phrase: "can't remember a word" },
];

const SENTENCES_EX2 = [
  { id: '1', textPre: '1 I haven’t got a ', textPost: '. I use a website on my phone.' },
  { id: '2', textPre: '2 What does important mean? I can’t ', textPost: '!' },
  { id: '3', textPre: '3 The ', textPost: ' is 12 weeks long.' },
  { id: '4', textPre: '4 Our teacher often writes on the ', textPost: '.' },
  { id: '5', textPre: '5 The ', textPost: ' in our town is very good.' },
  { id: '6', textPre: '6 He didn’t study, so he ', textPost: ' the exam.' },
  { id: '7', textPre: '7 I took an English ', textPost: ' last week. It was very difficult.' },
  { id: '8', textPre: '8 She got 90 percent, so she ', textPost: ' the exam.' },
];

const QUESTIONS_4A = [
  { id: '1', text: '1 Why do you study English?' },
  { id: '2', text: '2 Why is English difficult for you?' },
  { id: '3', text: '3 Why didn’t you study English at school?' },
  { id: '4', text: '4 Why have you got four lessons this week?' },
  { id: '5', text: '5 Why do you study here?' },
];

const ANSWERS_4A = [
  { id: 'A', text: 'Because the teacher is very good. He knows about my exam.' },
  { id: 'B', text: 'Because I didn’t like my English teacher!' },
  { id: 'C', text: 'Because there is an English exam on Saturday.' },
  { id: 'D', text: 'Because I can’t remember all the new words. And I didn’t study English at school.' },
  { id: 'E', text: 'Because I use it for my work. I often talk to people from other countries.' },
];

const QUESTIONS_4B = [
  {
    id: '1',
    q: '1 Q: Why does Bianca use English for work?',
    hint: 'A: Because ',
  },
  {
    id: '2',
    q: '2 Q: Why is Bianca busy on Saturday?',
    hint: 'A: Because ',
  },
  {
    id: '3',
    q: '3 Q: Why does Bianca like her English teacher?',
    hint: 'A: Because ',
  },
];

export default function Lesson9CContent({
  isTeacherReview = false,
  readOnly = false,
  answerKey: propAnswerKey,
  playAudio: propPlayAudio,
  playingAudio: propPlayingAudio,
  originalAnswers = {},
  onAudioBlobChange,
  submissionId,
  submittedAudios = [],
}: Lesson9CContentProps) {
  const {
    answers = {},
    setAnswerField,
    playAudio: contextPlayAudio,
    playingAudio: contextPlayingAudio,
  } = useLessonContext();

  const playAudio = propPlayAudio || contextPlayAudio;
  const playingAudio = propPlayingAudio !== undefined ? propPlayingAudio : contextPlayingAudio;

  const isReview = Boolean(isTeacherReview || (propAnswerKey && readOnly));
  const activeAnswerKey = propAnswerKey || (isReview ? FALLBACK_ANSWER_KEY_9C : null);

  const getRecord = (obj: unknown): Record<string, string> => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      return obj as Record<string, string>;
    }
    return {};
  };

  // State answers from context
  const ex1aAnswers = getRecord(answers.exercise_1a_matching);
  const ex2Answers = getRecord(answers.exercise_2_vocabulary);
  const ex4aAnswers = getRecord(answers.exercise_4a_matching);
  const ex4bAnswers = getRecord(answers.exercise_4b_answers);
  const ex5Answers = getRecord(answers.exercise_5_grammar_box);
  const ex7aAnswers = getRecord(answers.exercise_7a_conversation);
  const ex8Questions = getRecord(answers.exercise_8_questions);

  // Original answers for diff highlighting
  const origEx1a = getRecord(originalAnswers.exercise_1a_matching);
  const origEx2 = getRecord(originalAnswers.exercise_2_vocabulary);
  const origEx4a = getRecord(originalAnswers.exercise_4a_matching);
  const origEx4b = getRecord(originalAnswers.exercise_4b_answers);
  const origEx5 = getRecord(originalAnswers.exercise_5_grammar_box);
  const origEx7a = getRecord(originalAnswers.exercise_7a_conversation);

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

  const [modalImage, setModalImage] = useState<{ src: string; alt: string; title: string } | null>(
    null
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalImage(null);
      }
    };
    if (modalImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalImage]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Header Banner 9C */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge9C}>
              9<span>C</span>
            </div>
            <h1 className={styles.lessonTitle}>Study habits</h1>
          </div>
          <div className={styles.goalsBox}>
            <div className={styles.goalItem}>
              <strong>Goal:</strong>
              <span>ask and answer about study habits</span>
            </div>
            <div className={styles.goalItem}>
              <strong>Grammar:</strong>
              <span>
                <em>why</em> and <em>because</em>
              </span>
            </div>
            <div className={styles.goalItem}>
              <strong>Vocabulary:</strong>
              <span>learning a language</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className={styles.contentBody}>
          {/* SECTION 1: VOCABULARY */}
          <section className={styles.lessonSection}>
            <h2 className={styles.sectionHeading}>Vocabulary: learning a language</h2>

            {/* Exercise 1a */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1a</span>
                <p className={styles.exerciseTitle}>Match pictures A–L with phrases 1–12.</p>
              </div>

              {/* Pictures Grid A-L */}
              <div className={styles.picturesGrid}>
                {STUDY_PICTURES.map((pic) => (
                  <div
                    key={pic.id}
                    className={styles.pictureCard}
                    onClick={() =>
                      setModalImage({
                        src: `/images/lesson9c/${pic.name}`,
                        alt: pic.desc,
                        title: `${pic.title}: ${pic.desc}`,
                      })
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setModalImage({
                          src: `/images/lesson9c/${pic.name}`,
                          alt: pic.desc,
                          title: `${pic.title}: ${pic.desc}`,
                        });
                      }
                    }}
                    title="Click to view full picture"
                  >
                    <div className={styles.pictureImgWrapper}>
                      <Image
                        src={`/images/lesson9c/${pic.name}`}
                        alt={pic.desc}
                        fill
                        sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div className={styles.pictureCardFooter}>
                      <span>{pic.title}</span>
                      <span className={styles.zoomHint} title="Click to enlarge">
                        🔍
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Matching Phrases 1-12 */}
              <div className={styles.matchingList}>
                {MATCHING_PHRASES_1A.map((item) => {
                  const val = ex1aAnswers[item.id] || '';
                  const origVal = origEx1a[item.id];
                  const res = verify('exercise_1a_matching', item.id, val);
                  const isFieldDiff = isDiff(origVal, val);

                  return (
                    <div key={item.id} className={styles.matchingRow}>
                      <div className={styles.phraseText}>
                        <span className={styles.exerciseNum}>{item.id}</span> {item.phrase}
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
                            setAnswerField('exercise_1a_matching', item.id, e.target.value)
                          }
                        >
                          <option value="">Picture...</option>
                          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].map(
                            (letter) => (
                              <option key={letter} value={letter}>
                                Picture {letter}
                              </option>
                            )
                          )}
                        </select>
                        {res?.isCorrect && <span className={styles.correctBadge}>✓ Correct</span>}
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

            {/* Exercise 1b */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>1b</span>
                <p className={styles.exerciseTitle}>
                  Listen and repeat. Practice saying the study phrases.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.12')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.12' ? '⏸ Pause Audio 9.12' : '▶ Audio 9.12'}
                </button>
              </div>
            </div>

            {/* Exercise 2 */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>2</span>
                <p className={styles.exerciseTitle}>
                  Complete the sentences with the correct form of the words in Exercise 1.
                </p>
              </div>

              <div className={styles.sentencesList}>
                {SENTENCES_EX2.map((item) => {
                  const val = ex2Answers[item.id] || '';
                  const origVal = origEx2[item.id];
                  const res = verify('exercise_2_vocabulary', item.id, val);
                  const isFieldDiff = isDiff(origVal, val);

                  return (
                    <div key={item.id} className={styles.sentenceCard}>
                      <div className={styles.sentenceTextRow}>
                        <span>{item.textPre}</span>
                        <input
                          type="text"
                          className={`${styles.textInput} ${styles.shortInput} ${
                            isFieldDiff ? styles.diffHighlight : ''
                          } ${
                            res ? (res.isCorrect ? styles.fieldCorrect : styles.fieldIncorrect) : ''
                          }`}
                          value={val}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) =>
                            setAnswerField('exercise_2_vocabulary', item.id, e.target.value)
                          }
                        />
                        <span>{item.textPost}</span>
                        {res?.isCorrect && <span className={styles.correctBadge}>✓</span>}
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

            {/* Exercise 3 Pairwork Info */}
            <div className={styles.exerciseSection}>
              <div className={styles.pairworkCard}>
                <div className={styles.pairworkHeader}>
                  <span className={styles.exerciseNum}>3</span>
                  <span>Work in pairs: Student A (page 153) &amp; Student B (page 158)</span>
                </div>
                <p className={styles.pairworkDesc}>
                  Ask and answer questions about your study habits with a partner:
                  <em> Where do you study? When do you do your homework? How do you remember new words?</em>
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2: READING */}
          <section className={styles.lessonSection}>
            <h2 className={styles.sectionHeading}>Reading: Because ...</h2>

            {/* Article Container */}
            <div className={styles.articleContainer}>
              <div className={styles.articleHeader}>
                <div className={styles.articleTitleBadge}>Because ...</div>
                <p className={styles.articleSubtitle}>
                  Every week we ask a student about their reasons for studying English. This week we
                  talked to <strong>Bianca Costa</strong>.
                </p>
              </div>

              <div className={styles.interviewGrid}>
                {/* Questions Column */}
                <div className={styles.interviewColumn}>
                  <h3 className={styles.interviewColHeading}>Questions</h3>
                  {QUESTIONS_4A.map((q) => (
                    <div key={q.id} className={styles.questionItem}>
                      <span className={styles.qBadge}>{q.id}</span>
                      <span>{q.text.replace(/^[0-9]+\s*/, '')}</span>
                    </div>
                  ))}
                </div>

                {/* Answers Column */}
                <div className={styles.interviewColumn}>
                  <h3 className={styles.interviewColHeading}>Answers (A–E)</h3>
                  {ANSWERS_4A.map((ans) => (
                    <div key={ans.id} className={styles.answerItem}>
                      <span className={styles.aBadge}>{ans.id}</span>
                      <span>{ans.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Exercise 4a */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>4a</span>
                <p className={styles.exerciseTitle}>
                  Read the text. Match questions 1–5 with answers A–E. Then listen and check your
                  answers.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.13')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.13' ? '⏸ Pause Audio 9.13' : '▶ Audio 9.13'}
                </button>
              </div>

              <div className={styles.matchingTable}>
                {QUESTIONS_4A.map((q) => {
                  const val = ex4aAnswers[q.id] || '';
                  const origVal = origEx4a[q.id];
                  const res = verify('exercise_4a_matching', q.id, val);
                  const isFieldDiff = isDiff(origVal, val);

                  return (
                    <div key={q.id} className={styles.matchingRow}>
                      <div className={styles.phraseText}>
                        <span className={styles.exerciseNum}>{q.id}</span> {q.text}
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
                            setAnswerField('exercise_4a_matching', q.id, e.target.value)
                          }
                        >
                          <option value="">Answer...</option>
                          {['A', 'B', 'C', 'D', 'E'].map((letter) => (
                            <option key={letter} value={letter}>
                              Answer {letter}
                            </option>
                          ))}
                        </select>
                        {res?.isCorrect && <span className={styles.correctBadge}>✓ Correct</span>}
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

            {/* Exercise 4b */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>4b</span>
                <p className={styles.exerciseTitle}>
                  Read the text again and complete the answers with full reasons.
                </p>
              </div>

              <div className={styles.sentencesList}>
                {QUESTIONS_4B.map((item) => {
                  const val = ex4bAnswers[item.id] || '';
                  const origVal = origEx4b[item.id];
                  const res = verify('exercise_4b_answers', item.id, val);
                  const isFieldDiff = isDiff(origVal, val);

                  return (
                    <div key={item.id} className={styles.sentenceCard}>
                      <div className={styles.sentenceTextRow}>
                        <strong>{item.q}</strong>
                      </div>
                      <div className={styles.sentenceTextRow}>
                        <span>{item.hint}</span>
                        <input
                          type="text"
                          className={`${styles.textInput} ${
                            isFieldDiff ? styles.diffHighlight : ''
                          } ${
                            res ? (res.isCorrect ? styles.fieldCorrect : styles.fieldIncorrect) : ''
                          }`}
                          style={{ flex: 1, minWidth: '220px' }}
                          value={val}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) =>
                            setAnswerField('exercise_4b_answers', item.id, e.target.value)
                          }
                        />
                        {res?.isCorrect && <span className={styles.correctBadge}>✓</span>}
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
          </section>

          {/* SECTION 3: GRAMMAR */}
          <section className={styles.lessonSection}>
            <h2 className={styles.sectionHeading}>Grammar: why and because</h2>

            {/* Exercise 5 & Grammar Box */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>5</span>
                <p className={styles.exerciseTitle}>
                  Read and complete the grammar box. Use Exercise 4a to help you.
                </p>
              </div>

              <div className={styles.grammarBox}>
                <h3 className={styles.grammarBoxTitle}>Grammar box: why and because</h3>

                <div className={styles.grammarGrid}>
                  {/* Panel 1: Ask for reasons with why */}
                  <div className={styles.grammarPanel}>
                    <h4 className={styles.grammarSubhead}>Ask for reasons with why</h4>
                    <table className={styles.grammarTable}>
                      <thead>
                        <tr>
                          <th>Question</th>
                          <th>Example</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong>Why + be</strong>
                          </td>
                          <td>
                            <em>Why is English difficult for you?</em>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Why + do/did + subject + verb</strong>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                                <span>Why 1</span>
                                <input
                                  type="text"
                                  className={`${styles.textInput} ${
                                    isDiff(origEx5['1'], ex5Answers['1']) ? styles.diffHighlight : ''
                                  } ${
                                    verify('exercise_5_grammar_box', '1', ex5Answers['1'] || '')
                                      ? verify('exercise_5_grammar_box', '1', ex5Answers['1'] || '')?.isCorrect
                                        ? styles.fieldCorrect
                                        : styles.fieldIncorrect
                                      : ''
                                  }`}
                                  value={ex5Answers['1'] || ''}
                                  disabled={readOnly}
                                  placeholder=""
                                  onChange={(e) =>
                                    setAnswerField('exercise_5_grammar_box', '1', e.target.value)
                                  }
                                />
                                <span>?</span>
                              </div>
                              {(() => {
                                const res = verify('exercise_5_grammar_box', '1', ex5Answers['1'] || '');
                                return res && !res.isCorrect ? (
                                  <div className={styles.feedbackRow}>
                                    <TeacherAnswerBadge result={res} />
                                  </div>
                                ) : null;
                              })()}

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                                <span>Why 2</span>
                                <input
                                  type="text"
                                  className={`${styles.textInput} ${
                                    isDiff(origEx5['2'], ex5Answers['2']) ? styles.diffHighlight : ''
                                  } ${
                                    verify('exercise_5_grammar_box', '2', ex5Answers['2'] || '')
                                      ? verify('exercise_5_grammar_box', '2', ex5Answers['2'] || '')?.isCorrect
                                        ? styles.fieldCorrect
                                        : styles.fieldIncorrect
                                      : ''
                                  }`}
                                  value={ex5Answers['2'] || ''}
                                  disabled={readOnly}
                                  placeholder=""
                                  onChange={(e) =>
                                    setAnswerField('exercise_5_grammar_box', '2', e.target.value)
                                  }
                                />
                                <span>?</span>
                              </div>
                              {(() => {
                                const res = verify('exercise_5_grammar_box', '2', ex5Answers['2'] || '');
                                return res && !res.isCorrect ? (
                                  <div className={styles.feedbackRow}>
                                    <TeacherAnswerBadge result={res} />
                                  </div>
                                ) : null;
                              })()}

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                                <span>Why 3</span>
                                <input
                                  type="text"
                                  className={`${styles.textInput} ${
                                    isDiff(origEx5['3'], ex5Answers['3']) ? styles.diffHighlight : ''
                                  } ${
                                    verify('exercise_5_grammar_box', '3', ex5Answers['3'] || '')
                                      ? verify('exercise_5_grammar_box', '3', ex5Answers['3'] || '')?.isCorrect
                                        ? styles.fieldCorrect
                                        : styles.fieldIncorrect
                                      : ''
                                  }`}
                                  value={ex5Answers['3'] || ''}
                                  disabled={readOnly}
                                  placeholder=""
                                  onChange={(e) =>
                                    setAnswerField('exercise_5_grammar_box', '3', e.target.value)
                                  }
                                />
                                <span>?</span>
                              </div>
                              {(() => {
                                const res = verify('exercise_5_grammar_box', '3', ex5Answers['3'] || '');
                                return res && !res.isCorrect ? (
                                  <div className={styles.feedbackRow}>
                                    <TeacherAnswerBadge result={res} />
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Why + have + subject + got</strong>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                              <span>Why 4</span>
                              <input
                                type="text"
                                className={`${styles.textInput} ${
                                  isDiff(origEx5['4'], ex5Answers['4']) ? styles.diffHighlight : ''
                                } ${
                                  verify('exercise_5_grammar_box', '4', ex5Answers['4'] || '')
                                    ? verify('exercise_5_grammar_box', '4', ex5Answers['4'] || '')?.isCorrect
                                      ? styles.fieldCorrect
                                      : styles.fieldIncorrect
                                    : ''
                                }`}
                                value={ex5Answers['4'] || ''}
                                disabled={readOnly}
                                placeholder=""
                                onChange={(e) =>
                                  setAnswerField('exercise_5_grammar_box', '4', e.target.value)
                                }
                              />
                              <span>?</span>
                            </div>
                            {(() => {
                              const res = verify('exercise_5_grammar_box', '4', ex5Answers['4'] || '');
                              return res && !res.isCorrect ? (
                                <div className={styles.feedbackRow}>
                                  <TeacherAnswerBadge result={res} />
                                </div>
                              ) : null;
                            })()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Panel 2: Give reasons with because */}
                  <div className={styles.grammarPanel}>
                    <h4 className={styles.grammarSubhead}>Give reasons with because</h4>
                    <p className={styles.ruleExample}>
                      <strong>Statement + because + reason</strong>
                    </p>
                    <p className={styles.ruleExample}>
                      Bianca studies English <em>because</em> she uses it for her work.
                    </p>
                    <p className={styles.ruleExample}>
                      English is difficult for Bianca <em>because</em> she can’t remember all the new
                      words.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise 6a & 6b Pronunciation */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>6a</span>
                <p className={styles.exerciseTitle}>
                  Listen to the sentences. Notice the pronunciation of the words in blue.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.14')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.14' ? '⏸ Pause Audio 9.14' : '▶ Audio 9.14'}
                </button>
              </div>

              <div className={styles.pronunciationBox}>
                <div className={styles.pronSentence}>
                  1 I study English <span className={styles.highlightBlue}>because</span> I need it
                  for my job.
                </div>
                <div className={styles.pronSentence}>
                  2 I study English <span className={styles.highlightBlue}>because</span> I want to
                  travel.
                </div>
                <div className={styles.pronSentence}>
                  3 I study English <span className={styles.highlightBlue}>because</span> I’d like to
                  take an exam.
                </div>
              </div>

              <div className={styles.exerciseHeader} style={{ marginTop: '0.5rem' }}>
                <span className={styles.exerciseNum}>6b</span>
                <p className={styles.exerciseTitle}>Listen again and repeat.</p>
              </div>
            </div>

            {/* Exercise 7a & 7b Conversation */}
            <div className={styles.exerciseSection}>
              <div className={styles.exerciseHeader}>
                <span className={styles.exerciseNum}>7a</span>
                <p className={styles.exerciseTitle}>
                  Complete the conversation with the words in the box. Then listen and check your
                  answers.
                </p>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => handleAudioToggle('9.15')}
                  disabled={!playAudio}
                >
                  {playingAudio === '9.15' ? '⏸ Pause Audio 9.15' : '▶ Audio 9.15'}
                </button>
              </div>

              {/* Word Bank Pool */}
              <div className={styles.wordBank}>
                <span className={styles.wordBankLabel}>Word box:</span>
                {['because (x3)', 'do', 'do you', 'I', "it's", 'where', 'why (x2)'].map((w, idx) => (
                  <span key={idx} className={styles.wordBankChip}>
                    {w}
                  </span>
                ))}
              </div>

              {/* Dialogue Script */}
              <div className={styles.dialogueContainer}>
                {/* 1 */}
                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Esma:</strong>
                    <span>Why 1</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx7a['1'], ex7aAnswers['1']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_7a_conversation', '1', ex7aAnswers['1'] || '')
                          ? verify('exercise_7a_conversation', '1', ex7aAnswers['1'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex7aAnswers['1'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) =>
                        setAnswerField('exercise_7a_conversation', '1', e.target.value)
                      }
                    />
                    <span>study English, Pierre?</span>
                    {verify('exercise_7a_conversation', '1', ex7aAnswers['1'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_7a_conversation', '1', ex7aAnswers['1'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 2 */}
                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Pierre:</strong>
                    <span>2</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx7a['2'], ex7aAnswers['2']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_7a_conversation', '2', ex7aAnswers['2'] || '')
                          ? verify('exercise_7a_conversation', '2', ex7aAnswers['2'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex7aAnswers['2'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) =>
                        setAnswerField('exercise_7a_conversation', '2', e.target.value)
                      }
                    />
                    <span>I like watching films in English. How about you?</span>
                    {verify('exercise_7a_conversation', '2', ex7aAnswers['2'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_7a_conversation', '2', ex7aAnswers['2'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 3 */}
                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Esma:</strong>
                    <span>I study because 3</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx7a['3'], ex7aAnswers['3']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_7a_conversation', '3', ex7aAnswers['3'] || '')
                          ? verify('exercise_7a_conversation', '3', ex7aAnswers['3'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex7aAnswers['3'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) =>
                        setAnswerField('exercise_7a_conversation', '3', e.target.value)
                      }
                    />
                    <span>like travelling and I can use English in lots of countries.</span>
                    {verify('exercise_7a_conversation', '3', ex7aAnswers['3'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_7a_conversation', '3', ex7aAnswers['3'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 4 */}
                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Pierre:</strong>
                    <span>4</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx7a['4'], ex7aAnswers['4']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_7a_conversation', '4', ex7aAnswers['4'] || '')
                          ? verify('exercise_7a_conversation', '4', ex7aAnswers['4'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex7aAnswers['4'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) =>
                        setAnswerField('exercise_7a_conversation', '4', e.target.value)
                      }
                    />
                    <span>do you study?</span>
                    {verify('exercise_7a_conversation', '4', ex7aAnswers['4'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_7a_conversation', '4', ex7aAnswers['4'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 5 */}
                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Esma:</strong>
                    <span>I take a course at the university.</span>
                  </div>
                </div>

                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Pierre:</strong>
                    <span>5</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx7a['5'], ex7aAnswers['5']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_7a_conversation', '5', ex7aAnswers['5'] || '')
                          ? verify('exercise_7a_conversation', '5', ex7aAnswers['5'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex7aAnswers['5'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) =>
                        setAnswerField('exercise_7a_conversation', '5', e.target.value)
                      }
                    />
                    <span>do you study there?</span>
                    {verify('exercise_7a_conversation', '5', ex7aAnswers['5'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_7a_conversation', '5', ex7aAnswers['5'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 6 & 7 */}
                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Esma:</strong>
                    <span>Because 6</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx7a['6'], ex7aAnswers['6']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_7a_conversation', '6', ex7aAnswers['6'] || '')
                          ? verify('exercise_7a_conversation', '6', ex7aAnswers['6'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex7aAnswers['6'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) =>
                        setAnswerField('exercise_7a_conversation', '6', e.target.value)
                      }
                    />
                    <span>near my house. 7</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx7a['7'], ex7aAnswers['7']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_7a_conversation', '7', ex7aAnswers['7'] || '')
                          ? verify('exercise_7a_conversation', '7', ex7aAnswers['7'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex7aAnswers['7'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) =>
                        setAnswerField('exercise_7a_conversation', '7', e.target.value)
                      }
                    />
                    <span>you go to a class?</span>
                    {verify('exercise_7a_conversation', '6', ex7aAnswers['6'] || '')?.isCorrect &&
                      verify('exercise_7a_conversation', '7', ex7aAnswers['7'] || '')?.isCorrect && (
                        <span className={styles.correctBadge}>✓</span>
                      )}
                  </div>
                  {(() => {
                    const res6 = verify('exercise_7a_conversation', '6', ex7aAnswers['6'] || '');
                    const res7 = verify('exercise_7a_conversation', '7', ex7aAnswers['7'] || '');
                    return (res6 && !res6.isCorrect) || (res7 && !res7.isCorrect) ? (
                      <div className={styles.feedbackRow}>
                        {res6 && !res6.isCorrect && (
                          <span>
                            <strong>6:</strong> <TeacherAnswerBadge result={res6} />
                          </span>
                        )}
                        {res7 && !res7.isCorrect && (
                          <span>
                            <strong>7:</strong> <TeacherAnswerBadge result={res7} />
                          </span>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 8 */}
                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Pierre:</strong>
                    <span>No, 8</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx7a['8'], ex7aAnswers['8']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_7a_conversation', '8', ex7aAnswers['8'] || '')
                          ? verify('exercise_7a_conversation', '8', ex7aAnswers['8'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex7aAnswers['8'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) =>
                        setAnswerField('exercise_7a_conversation', '8', e.target.value)
                      }
                    />
                    <span>I’m very busy at work.</span>
                    {verify('exercise_7a_conversation', '8', ex7aAnswers['8'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_7a_conversation', '8', ex7aAnswers['8'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* Pierre & Esma middle */}
                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Esma:</strong>
                    <span>How do you study?</span>
                  </div>
                </div>

                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Pierre:</strong>
                    <span>
                      I often play games in English on my phone. Do you know any good games?
                    </span>
                  </div>
                </div>

                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Esma:</strong>
                    <span>Yes, I often play ‘Language Crab’.</span>
                  </div>
                </div>

                {/* 9 */}
                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Pierre:</strong>
                    <span>9</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx7a['9'], ex7aAnswers['9']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_7a_conversation', '9', ex7aAnswers['9'] || '')
                          ? verify('exercise_7a_conversation', '9', ex7aAnswers['9'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex7aAnswers['9'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) =>
                        setAnswerField('exercise_7a_conversation', '9', e.target.value)
                      }
                    />
                    <span>do you like that game?</span>
                    {verify('exercise_7a_conversation', '9', ex7aAnswers['9'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_7a_conversation', '9', ex7aAnswers['9'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* 10 */}
                <div className={styles.dialogueLine}>
                  <div className={styles.dialogueText}>
                    <strong>Esma:</strong>
                    <span>I like it 10</span>
                    <input
                      type="text"
                      className={`${styles.textInput} ${styles.shortInput} ${
                        isDiff(origEx7a['10'], ex7aAnswers['10']) ? styles.diffHighlight : ''
                      } ${
                        verify('exercise_7a_conversation', '10', ex7aAnswers['10'] || '')
                          ? verify('exercise_7a_conversation', '10', ex7aAnswers['10'] || '')?.isCorrect
                            ? styles.fieldCorrect
                            : styles.fieldIncorrect
                          : ''
                      }`}
                      value={ex7aAnswers['10'] || ''}
                      disabled={readOnly}
                      placeholder=""
                      onChange={(e) =>
                        setAnswerField('exercise_7a_conversation', '10', e.target.value)
                      }
                    />
                    <span>it helps me with my vocabulary.</span>
                    {verify('exercise_7a_conversation', '10', ex7aAnswers['10'] || '')?.isCorrect && (
                      <span className={styles.correctBadge}>✓</span>
                    )}
                  </div>
                  {(() => {
                    const res = verify('exercise_7a_conversation', '10', ex7aAnswers['10'] || '');
                    return res && !res.isCorrect ? (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={res} />
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>

              <div className={styles.exerciseHeader} style={{ marginTop: '0.75rem' }}>
                <span className={styles.exerciseNum}>7b</span>
                <p className={styles.exerciseTitle}>
                  Work in pairs. Practise reading the conversation with a partner.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4: SPEAKING */}
          <section className={styles.lessonSection}>
            <h2 className={styles.sectionHeading}>Speaking: Study Habits</h2>

            {/* PREPARE - Exercise 8 */}
            <div className={styles.exerciseSection}>
              <div className={styles.speakingCard}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exerciseNum}>8</span>
                  <p className={styles.exerciseTitle}>
                    <strong>PREPARE:</strong> Work in pairs. Write five questions about study habits.
                  </p>
                </div>

                <p style={{ margin: 0, fontSize: '0.92rem', color: '#0f766e', fontStyle: 'italic' }}>
                  Examples: <em>When do you study? Do you study at home? Where do you study? Why do you study English? How do you remember new words?</em>
                </p>

                <div className={styles.promptList}>
                  {['1', '2', '3', '4', '5'].map((num) => (
                    <div key={num} className={styles.promptItem}>
                      <div className={styles.promptRow}>
                        <span>Question {num}:</span>
                        <input
                          type="text"
                          className={styles.textInput}
                          style={{ flex: 1, minWidth: '220px' }}
                          value={ex8Questions[num] || ''}
                          disabled={readOnly}
                          placeholder=""
                          onChange={(e) => setAnswerField('exercise_8_questions', num, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SPEAK - Exercise 9 */}
            <div className={styles.exerciseSection}>
              <div className={styles.speakingCard}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exerciseNum}>9</span>
                  <p className={styles.exerciseTitle}>
                    <strong>SPEAK:</strong> Change partners. Ask your questions from Exercise 8.
                    Answer your partner’s questions. Use <em>because</em>.
                  </p>
                </div>

                <div className={styles.pronunciationBox} style={{ background: '#ffffff' }}>
                  <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5 }}>
                    <strong>A:</strong> <em>When do you study?</em><br />
                    <strong>B:</strong> <em>I study at the weekend.</em><br />
                    <strong>A:</strong> <em>Why do you study at the weekend?</em><br />
                    <strong>B:</strong> <em>Because I’ve got a busy job and I’m tired in the evening.</em>
                  </p>
                </div>

                {/* Audio Answer Recorder for oral submission */}
                <div style={{ marginTop: '0.75rem' }}>
                  <AudioAnswerRecorder
                    onAudioChange={(blob: Blob | null, mime: string) =>
                      onAudioBlobChange?.(blob, mime, 'speaking_9c_habits')
                    }
                    readOnly={readOnly}
                  />

                  {submissionId && submittedAudios.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <SubmissionAudioPlayer
                        audios={submittedAudios}
                        submissionId={submissionId}
                        exerciseKey="speaking_9c_habits"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Badge Develop your writing */}
            <div className={styles.developWritingBadge}>
              <div className={styles.badgeImgWrapper}>
                <Image
                  src="/images/lesson9c/badge_develop_writing.png"
                  alt="Develop your writing - page 112"
                  fill
                  sizes="220px"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Lightbox zoom modal */}
      {modalImage && (
        <div
          className={styles.imageModalOverlay}
          onClick={() => setModalImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setModalImage(null)}
              aria-label="Close enlarged picture"
            >
              ✕
            </button>
            <div className={styles.modalImageHeader}>{modalImage.title}</div>
            <Image
              src={modalImage.src}
              alt={modalImage.alt}
              width={700}
              height={700}
              style={{
                objectFit: 'contain',
                width: 'auto',
                height: 'auto',
                maxWidth: '90vw',
                maxHeight: '75vh',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
