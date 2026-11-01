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
import styles from './lesson9d.module.scss';

export interface Lesson9DContentProps {
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

export const FALLBACK_ANSWER_KEY_9D: LessonAnswerKey = {
  exercise_1b_conversations: {
    '1': ['C', 'c', 'Photo C', 'photo c'],
    '2': ['A', 'a', 'Photo A', 'photo a'],
    '3': ['B', 'b', 'Photo B', 'photo b'],
  },
  exercise_2a_alternatives: {
    '1': ['music', 'Music', 'music programme', 'music program'],
    '2': ['8.00', '8:00', '8', 'eight'],
    '3': ['Thai', 'thai', 'Thai restaurant', 'thai restaurant'],
  },
  exercise_2b_phrase_sources: {
    phrase_1: ['2'],
    phrase_2: ['2'],
    phrase_3: ['3'],
    phrase_4: ['1'],
    phrase_5: ['1'],
    phrase_6: ['3'],
    phrase_7: ['2'],
    phrase_8: ['3'],
    phrase_9: ['2'],
  },
  exercise_3a_order: {
    a: ['4'],
    b: ['10'],
    c: ['7'],
    d: ['3'],
    e: ['6'],
    f: ['9'],
    g: ['1'],
    h: ['8'],
    i: ['11'],
    j: ['2'],
    k: ['12'],
    l: ['5'],
  },
  check_ex1_prepositions: {
    '1': ['on', 'On'],
    '2': ['above', 'Above'],
    '3': ['behind', 'Behind'],
    '4': ['at', 'At'],
    '5': ['below', 'Below'],
    '6': ['in front of', 'In front of'],
    '7': ['next to', 'Next to'],
    '8': ['between', 'Between'],
    '9': ['in', 'In'],
  },
  check_ex2_pronouns: {
    '1': ['him', 'Him'],
    '2': ['her', 'Her'],
    '3': ['them', 'Them'],
    '4': ['me', 'Me'],
    '5': ['us', 'Us'],
    '6': ['it', 'It'],
  },
  check_ex3a_verbs: {
    '1': ['listen to', 'Listen to'],
    '2': ['read', 'Read'],
    '3': ['do', 'Do'],
    '4': ['watched', 'Watched'],
    '5': ['use', 'Use'],
    '6': ['play', 'Play'],
  },
  check_ex4_verb_forms: {
    '1': ['love reading', 'Love reading'],
    '2': ['hate doing', 'Hate doing'],
    '3_aux': ['do', 'Do'],
    '3_verb': ['enjoy watching', 'Enjoy watching'],
    '4': ['loves listening to', 'Loves listening to'],
    '5': ["doesn't enjoy working", 'does not enjoy working', 'doesnt enjoy working'],
    '6_aux': ['do', 'Do'],
    '6_verb': ['like listening to', 'Like listening to'],
    '7': ["don't like getting up", 'do not like getting up', 'dont like getting up'],
  },
  check_ex5_verbs_box: {
    '1': ['take', 'Take'],
    '2': ['pass', 'Pass'],
    '3': ['fail', 'Fail'],
    '4': ['do', 'Do'],
    '5': ['use', 'Use'],
    '6': ['go to', 'Go to'],
    '7': ['know', 'Know'],
    '8': ['wrote', 'Wrote'],
  },
  check_ex6a_questions: {
    '1': ['Why are you hungry?', 'Why are you hungry'],
    '2': ["Why don't you eat your salad?", "Why don't you eat your salad", "Why do not you eat your salad?"],
    '3': ["Why doesn't Leo know the answer?", "Why doesn't Leo know the answer", "Why does not Leo know the answer?"],
    '4': ["Why didn't you go to work last week?", "Why didn't you go to work last week", "Why did you not go to work last week?"],
    '5': ['Why was Sam late this morning?', 'Why was Sam late this morning'],
    '6': ['Why can Sara speak Portuguese?', 'Why can Sara speak Portuguese'],
    '7': ['Why have we got a new teacher?', 'Why have we got a new teacher'],
  },
  check_ex6b_matching: {
    '1': ['g', 'G'],
    '2': ['c', 'C'],
    '3': ['b', 'B'],
    '4': ['d', 'D'],
    '5': ['f', 'F'],
    '6': ['a', 'A'],
    '7': ['e', 'E'],
  },
};

const getRecord = (val: unknown): Record<string, string> => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, string>;
  }
  return {};
};

const PHOTOS_1A = [
  {
    id: 'A',
    name: 'photo_a_cinema.png',
    title: 'Photo A: Cinema',
    hint: 'Cinema 2-6 entrance with bright illuminated lights',
  },
  {
    id: 'B',
    name: 'photo_b_restaurant.png',
    title: 'Photo B: Restaurant',
    hint: 'Cozy restaurant with dining tables and waiter serving',
  },
  {
    id: 'C',
    name: 'photo_c_living_room.png',
    title: 'Photo C: Living Room',
    hint: 'Spacious living room with sofa, coffee table and TV',
  },
];

const USEFUL_PHRASES_ITEMS = [
  { id: 'phrase_1', category: 'Making suggestions', text: "Let's do something!" },
  { id: 'phrase_2', category: 'Making suggestions', text: 'Shall we go at 7.30?' },
  { id: 'phrase_3', category: 'Saying yes to suggestions', text: "That's a great idea!" },
  { id: 'phrase_4', category: 'Saying yes to suggestions', text: 'Good idea.' },
  { id: 'phrase_5', category: 'Saying no to suggestions', text: "Sorry, I don't like it." },
  { id: 'phrase_6', category: 'Saying no to suggestions', text: 'Hmm. I went there last week.' },
  { id: 'phrase_7', category: 'Making plans', text: 'When shall we go?' },
  { id: 'phrase_8', category: 'Making plans', text: 'Where shall we go?' },
  { id: 'phrase_9', category: 'Making plans', text: 'What shall we watch?' },
];

const DIALOGUE_LINES_3A = [
  { id: 'a', speaker: 'Dylan', text: "Hmm. It's very cold today." },
  { id: 'b', speaker: 'Dylan', text: 'OK. Shall we play a video game?' },
  { id: 'c', speaker: 'Olivia', text: 'The library?' },
  { id: 'd', speaker: 'Olivia', text: 'Shall we walk to the lake?' },
  { id: 'e', speaker: 'Dylan', text: "No, they haven't got any good films today. Let's go to the library." },
  { id: 'f', speaker: 'Olivia', text: "Hmm. I don't like reading." },
  { id: 'g', speaker: 'Olivia', text: "Let's do something.", isGiven: true, givenNumber: '1' },
  { id: 'h', speaker: 'Dylan', text: "Yeah, let's read some books." },
  { id: 'i', speaker: 'Olivia', text: 'Great idea! What shall we play?' },
  { id: 'j', speaker: 'Dylan', text: 'OK. What shall we do?' },
  { id: 'k', speaker: 'Dylan', text: "Let's play this game. You can fly a plane." },
  { id: 'l', speaker: 'Olivia', text: "Yeah, you're right. Shall we go to the cinema?" },
];

const PREPOSITIONS_BOX_EX1 = ['above', 'at', 'behind', 'below', 'between', 'in', 'in front of', 'next to', 'on'];

const PREPOSITION_ITEMS = [
  { id: '1', pre: "1 It's", post: 'the table.', isGiven: true, givenValue: 'on' },
  { id: '2', pre: "2 It's", post: 'the table.' },
  { id: '3', pre: "3 It's", post: 'the door.' },
  { id: '4', pre: "4 He's", post: 'the bus stop.' },
  { id: '5', pre: "5 It's", post: 'the window.' },
  { id: '6', pre: "6 He's", post: 'the TV.' },
  { id: '7', pre: "7 He's", post: 'the window.' },
  { id: '8', pre: "8 It's", post: 'the tables.' },
  { id: '9', pre: "9 It's", post: 'the cup.' },
];

const PRONOUNS_BOX_EX2 = ['her', 'him', 'it', 'me', 'them', 'us'];

const PRONOUN_ITEMS = [
  { id: '1', pre: '1 My grandfather is 82. I speak to', post: 'on the telephone every day.' },
  { id: '2', pre: '2 My mum is great. I visit', post: 'all the time!' },
  { id: '3', pre: '3 Two of my good friends are Irina and Davide. I see', post: 'every weekend.' },
  { id: '4', pre: "4 I didn't like a girl at school. She didn't talk to", post: '.' },
  { id: '5', pre: "5 At school, we didn't like Mr Clarkson. He gave", post: 'difficult homework.' },
  { id: '6', pre: '6 This is a photo of my dog. Do you like', post: '?' },
];

const VERBS_BOX_EX3 = ['do', 'listen to', 'play', 'read', 'use', 'watch'];

const VERB_ITEMS = [
  { id: '1', pre: '1 I often', post: 'music on the bus.' },
  { id: '2', pre: '2 I usually', post: 'a book in the evening.' },
  { id: '3', pre: '3 I', post: 'exercise in the morning.' },
  { id: '4', pre: '4 I', post: 'a good film last night.' },
  { id: '5', pre: '5 I often', post: 'the internet on the train.' },
  { id: '6', pre: '6 I', post: 'video games every day.' },
];

const VERBS_BOX_EX5 = ['do', 'fail', 'go to', 'know', 'pass', 'take', 'use', 'write'];

const VERB_BOX_ITEMS = [
  { id: '1', pre: '1 All the students', post: 'exams in June.', isGiven: true, givenValue: 'take' },
  { id: '2', pre: '2 You look happy. Did you', post: 'the exam?' },
  { id: '3', pre: '3 This exam is really difficult. A lot of students', post: 'it.' },
  { id: '4', pre: '4 Please', post: 'the homework for tomorrow.' },
  { id: '5', pre: '5 You can', post: 'a dictionary for difficult words.' },
  { id: '6', pre: '6 We always', post: 'the library on Friday.' },
  { id: '7', pre: "7 Sorry, I don't", post: 'the answer to Question 6.' },
  { id: '8', pre: '8 The teacher', post: 'jobs on the board yesterday.' },
];

const SCRAMBLED_QUESTIONS_6A = [
  { id: '1', prompt: 'you / are / hungry / Why ?' },
  { id: '2', prompt: 'eat / Why / salad / you / don’t / your ?' },
  { id: '3', prompt: 'doesn’t / the / Leo / answer / Why / know ?' },
  { id: '4', prompt: 'week / last / Why / you / go / didn’t / to work ?' },
  { id: '5', prompt: 'late / morning / was / this / Why / Sam ?' },
  { id: '6', prompt: 'can / Sara / Why / Portuguese / speak ?' },
  { id: '7', prompt: 'new / have / a / teacher / Why / got / we ?' },
];

const MATCHING_ANSWERS_6B = [
  { letter: 'a', text: 'Because she studied it in Brazil.' },
  { letter: 'b', text: "Because he wasn't in the lesson yesterday." },
  { letter: 'c', text: "Because I don't like it." },
  { letter: 'd', text: 'Because I was in Spain.' },
  { letter: 'e', text: 'Because Mrs Lewis is on holiday.' },
  { letter: 'f', text: 'Because his train was late.' },
  { letter: 'g', text: "Because I didn't have breakfast." },
];

const REFLECT_STATEMENTS = [
  { id: 'item_1', text: 'I can talk about the people in a photo.' },
  { id: 'item_2', text: 'I can ask and answer about things you and I like to do.' },
  { id: 'item_3', text: 'I can ask and answer about study habits.' },
  { id: 'item_4', text: 'I can make and respond to suggestions.' },
];

export default function Lesson9DContent(props: Lesson9DContentProps) {
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
    FALLBACK_ANSWER_KEY_9D;

  const isReview = Boolean(isTeacherReview || (activeAnswerKey && readOnly));
  const answers = (context?.answers || {}) as Record<string, unknown>;

  const [activeZoomImage, setActiveZoomImage] = useState<{ src: string; alt: string; title: string } | null>(null);

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

  const renderAudioButton = (track: string, label: string) => {
    const isPlaying = playingAudio === track;
    return (
      <button
        type="button"
        className={`${styles.audioTrackBtn} ${isPlaying ? styles.playing : ''}`}
        onClick={() => playAudio?.(track)}
        aria-label={`Play ${label}`}
      >
        <span>{isPlaying ? '⏸' : '▶'}</span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className={styles.pageContainer}>
      {/* ==================================================== */}
      {/* PAGE 76: ENGLISH IN ACTION                           */}
      {/* ==================================================== */}
      <div className={styles.textbookPage}>
        {/* Header Banner */}
        <div className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge9D}>
              9<span className={styles.letterD}>D</span>
            </div>
            <div className={styles.titleArea}>
              <h1 className={styles.titleHeading}>English in action</h1>
              <div className={styles.lessonMeta}>
                <span className={styles.pillGoal}>Goal: make and respond to suggestions, make plans</span>
                <span className={styles.pillLevel}>A1 • Unit 9</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.pageBody}>
          {/* 1a & 1b: Photo matching & discussion */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBadge}>1a &amp; 1b</span>
                <span>Places &amp; Conversations</span>
              </h2>
              {renderAudioButton('9.16', 'Audio 9.16')}
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              <strong>1a</strong> Look at photos A–C. What can you do there? Click any photo to zoom in.
            </p>

            <div className={styles.photosGrid}>
              {PHOTOS_1A.map((photo) => (
                <div key={photo.id} className={styles.photoCard}>
                  <div
                    className={styles.photoWrap}
                    onClick={() =>
                      setActiveZoomImage({
                        src: `/images/lesson9d/${photo.name}`,
                        alt: photo.title,
                        title: photo.title,
                      })
                    }
                  >
                    <div className={styles.photoBadge}>{photo.id}</div>
                    <Image
                      src={`/images/lesson9d/${photo.name}`}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                    <button
                      type="button"
                      className={styles.photoZoomBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveZoomImage({
                          src: `/images/lesson9d/${photo.name}`,
                          alt: photo.title,
                          title: photo.title,
                        });
                      }}
                    >
                      🔍 Zoom
                    </button>
                  </div>
                  <div className={styles.photoCardContent}>
                    <div className={styles.photoLabel}>{photo.title}</div>
                    <div className={styles.photoHint}>{photo.hint}</div>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>
              <strong>1b</strong> Listen to three conversations and match them with photos A–C.
            </p>

            <div className={styles.sentencesGrid}>
              {[
                { conv: '1', text: 'Conversation 1 (Watching TV in the living room):' },
                { conv: '2', text: 'Conversation 2 (Planning to go to the cinema):' },
                { conv: '3', text: 'Conversation 3 (Deciding where to have dinner):' },
              ].map((item) => {
                const currAnswers = getRecord(answers.exercise_1b_conversations);
                const val = currAnswers[item.conv] || '';
                const v = verify('exercise_1b_conversations', item.conv, val);
                const diff = isDiff('exercise_1b_conversations', item.conv);

                return (
                  <div key={item.conv} className={styles.sentenceRow}>
                    <span className={styles.sentenceIndex}>{item.conv}</span>
                    <span style={{ flex: 1, minWidth: 200 }}>{item.text}</span>
                    <select
                      value={val}
                      onChange={(e) => handleFieldChange('exercise_1b_conversations', item.conv, e.target.value)}
                      disabled={readOnly}
                      className={`${styles.inlineSelect} ${
                        v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diff ? styles.diffHighlight : ''}`}
                    >
                      <option value="">Choose photo...</option>
                      <option value="A">Photo A (Cinema)</option>
                      <option value="B">Photo B (Restaurant)</option>
                      <option value="C">Photo C (Living Room)</option>
                    </select>
                    {isReview && v && (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={v} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2a: Choose the correct alternatives */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBadge}>2a</span>
                <span>Choose the Correct Alternatives</span>
              </h2>
              {renderAudioButton('9.16', 'Audio 9.16')}
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              Listen again and choose the correct alternatives.
            </p>

            <div className={styles.sentencesGrid}>
              {[
                {
                  id: '1',
                  pre: '1 They choose to watch a',
                  options: ['football', 'music'],
                  post: 'programme.',
                },
                {
                  id: '2',
                  pre: '2 The film starts at',
                  options: ['7.30', '8.00'],
                  post: '.',
                },
                {
                  id: '3',
                  pre: '3 They choose to go to a',
                  options: ['Spanish', 'Thai'],
                  post: 'restaurant.',
                },
              ].map((item) => {
                const currAnswers = getRecord(answers.exercise_2a_alternatives);
                const val = currAnswers[item.id] || '';
                const v = verify('exercise_2a_alternatives', item.id, val);
                const diff = isDiff('exercise_2a_alternatives', item.id);

                return (
                  <div key={item.id} className={styles.sentenceRow}>
                    <span>{item.pre}</span>
                    <select
                      value={val}
                      onChange={(e) => handleFieldChange('exercise_2a_alternatives', item.id, e.target.value)}
                      disabled={readOnly}
                      className={`${styles.inlineSelect} ${
                        v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diff ? styles.diffHighlight : ''}`}
                    >
                      <option value="">Select option...</option>
                      {item.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <span>{item.post}</span>
                    {isReview && v && (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={v} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2b & 2c: Useful Phrases & Audio 9.17 */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBadge}>2b &amp; 2c</span>
                <span>Useful Phrases: Make &amp; Respond to Suggestions</span>
              </h2>
              {renderAudioButton('9.17', 'Audio 9.17')}
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              <strong>2b</strong> Listen again. Which conversation (1, 2 or 3) do the phrases in the Useful phrases box come from?
            </p>

            <div className={styles.phrasesBox}>
              <div className={styles.phrasesHeader}>
                <h3 className={styles.phrasesTitle}>Useful phrases</h3>
                <span style={{ fontSize: '0.8rem', color: '#be123c', fontWeight: 600 }}>
                  Listen &amp; match each phrase with Conversation 1, 2, or 3
                </span>
              </div>

              <div className={styles.phrasesGrid}>
                {['Making suggestions', 'Saying yes to suggestions', 'Saying no to suggestions', 'Making plans'].map(
                  (cat) => {
                    const items = USEFUL_PHRASES_ITEMS.filter((p) => p.category === cat);
                    return (
                      <div key={cat} className={styles.phraseCategoryCard}>
                        <h4 className={styles.phraseCatTitle}>{cat}</h4>
                        <ul className={styles.phraseList}>
                          {items.map((item) => {
                            const currAnswers = getRecord(answers.exercise_2b_phrase_sources);
                            const val = currAnswers[item.id] || '';
                            const v = verify('exercise_2b_phrase_sources', item.id, val);
                            const diff = isDiff('exercise_2b_phrase_sources', item.id);

                            return (
                              <li key={item.id} className={styles.phraseItem}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span>{item.text}</span>
                                  {isReview && v && (
                                    <div className={styles.feedbackRow}>
                                      <TeacherAnswerBadge result={v} />
                                    </div>
                                  )}
                                </div>
                                <select
                                  value={val}
                                  onChange={(e) =>
                                    handleFieldChange('exercise_2b_phrase_sources', item.id, e.target.value)
                                  }
                                  disabled={readOnly}
                                  className={`${styles.inlineSelect} ${
                                    v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                                  } ${diff ? styles.diffHighlight : ''}`}
                                  style={{ minWidth: '70px', padding: '2px 4px' }}
                                >
                                  <option value="">Conv...</option>
                                  <option value="1">Conv 1</option>
                                  <option value="2">Conv 2</option>
                                  <option value="3">Conv 3</option>
                                </select>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              <strong>2c</strong> Click <strong>Audio 9.17</strong> above to listen and repeat each phrase to practice natural intonation.
            </p>
          </section>

          {/* 3a & 3b: Dialogue Ordering */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBadge}>3a &amp; 3b</span>
                <span>Dialogue Ordering: Making Weekend Plans</span>
              </h2>
              {renderAudioButton('9.18', 'Audio 9.18')}
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              <strong>3a</strong> Put the conversation between Dylan and Olivia in the correct order (1–12). Line <strong>g</strong> is already done (1). Then listen to Audio 9.18 and check your answers.
            </p>

            <div className={styles.dialogueOrderingList}>
              {DIALOGUE_LINES_3A.map((line) => {
                const currAnswers = getRecord(answers.exercise_3a_order);
                const val = line.isGiven ? line.givenNumber : currAnswers[line.id] || '';
                const v = line.isGiven ? null : verify('exercise_3a_order', line.id, val);
                const diff = line.isGiven ? false : isDiff('exercise_3a_order', line.id);

                return (
                  <div key={line.id} className={styles.dialogueOrderRow}>
                    <span className={styles.lineLetter}>{line.id}</span>
                    <span className={styles.lineSpeaker}>{line.speaker}:</span>
                    <span className={styles.lineText}>{line.text}</span>
                    <div className={styles.orderInputWrap}>
                      {line.isGiven ? (
                        <div className={styles.orderGivenBadge}>{line.givenNumber}</div>
                      ) : (
                        <input
                          type="text"
                          maxLength={2}
                          value={val}
                          onChange={(e) => handleFieldChange('exercise_3a_order', line.id, e.target.value.trim())}
                          disabled={readOnly}
                          placeholder=""
                          className={`${styles.orderInput} ${
                            v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                          } ${diff ? styles.diffHighlight : ''}`}
                        />
                      )}
                      {isReview && v && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={v} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>
              <strong>3b</strong> Practise the conversation aloud. Record your dialogue with a partner below for teacher review:
            </p>

            <AudioAnswerRecorder
              onAudioChange={(blob: Blob | null, mime: string) =>
                onAudioBlobChange?.(blob, mime, 'speaking_9d_dialogue')
              }
              readOnly={readOnly}
            />
            {submissionId && submittedAudios.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <SubmissionAudioPlayer
                  audios={submittedAudios}
                  submissionId={submissionId}
                  exerciseKey="speaking_9d_dialogue"
                />
              </div>
            )}
          </section>

          {/* 4: Weekend Planner Table & Roleplay */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.sectionBadge}>4</span>
                <span>Weekend Planner &amp; Speaking</span>
              </h2>
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              Work in pairs or groups. Decide on six activities to do together at the weekend. Decide where and when to do them. Complete your planner table:
            </p>

            <div className={styles.plannerTableWrap}>
              <table className={styles.plannerTable}>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Morning</th>
                    <th>Afternoon</th>
                    <th>Evening</th>
                  </tr>
                </thead>
                <tbody>
                  {['Saturday', 'Sunday'].map((day) => {
                    const currPlanner = getRecord(answers.planner_weekend);
                    const dayKey = day.toLowerCase();

                    return (
                      <tr key={day}>
                        <td className={styles.dayHeader}>{day}</td>
                        {['morning', 'afternoon', 'evening'].map((time) => {
                          const field = `${dayKey}_${time}`;
                          const val = currPlanner[field] || '';

                          return (
                            <td key={time}>
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => handleFieldChange('planner_weekend', field, e.target.value)}
                                disabled={readOnly}
                                placeholder=""
                                className={styles.plannerInput}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={styles.roleplayDialoguePrompt}>
              <strong>Model conversation:</strong>
              <p className={styles.modelLine}>A: Let’s go to the library on Saturday morning.</p>
              <p className={styles.modelLine}>B: That’s a great idea.</p>
              <p className={styles.modelLine}>C: Hmm. I don’t like the library. Shall we go to the park?</p>
              <p className={styles.modelLine}>A: OK, that’s a good idea.</p>
            </div>

            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>
              Record your weekend suggestion roleplay:
            </p>

            <AudioAnswerRecorder
              onAudioChange={(blob: Blob | null, mime: string) =>
                onAudioBlobChange?.(blob, mime, 'speaking_9d_weekend')
              }
              readOnly={readOnly}
            />
            {submissionId && submittedAudios.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <SubmissionAudioPlayer
                  audios={submittedAudios}
                  submissionId={submissionId}
                  exerciseKey="speaking_9d_weekend"
                />
              </div>
            )}
          </section>

          {/* Banner Roadmap Video */}
          <div className={styles.bannerWrap}>
            <Image
              src="/images/lesson9d/banner_roadmap_video.png"
              alt="Go online for the Roadmap video"
              width={390}
              height={150}
            />
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* PAGE 77: CHECK AND REFLECT (UNIT 9 REVIEW)           */}
      {/* ==================================================== */}
      <div className={styles.textbookPage}>
        {/* Check & Reflect Header */}
        <div className={styles.checkHeaderBanner}>
          <h2 className={styles.checkTitle}>Check and reflect</h2>
          <p className={styles.checkSubtitle}>
            Review prepositions, pronouns, hobbies, verbs with -ing, study habits, and why/because questions.
          </p>
        </div>

        <div className={styles.pageBody}>
          {/* Ex 1: Prepositions of Place */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionBadge}>1</span>
                <span>Prepositions of Place</span>
              </h3>
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              Look at the pictures. Then complete the sentences with the prepositions in the box. Click the illustration to enlarge.
            </p>

            <div className={styles.prepositionsCard}>
              <div
                className={styles.prepositionsImageWrap}
                onClick={() =>
                  setActiveZoomImage({
                    src: '/images/lesson9d/prepositions_grid.png',
                    alt: 'Prepositions of Place (1 to 9)',
                    title: 'Prepositions Grid (1 to 9)',
                  })
                }
              >
                <Image
                  src="/images/lesson9d/prepositions_grid.png"
                  alt="Prepositions of Place Grid"
                  width={480}
                  height={428}
                />
              </div>

              <div className={styles.wordBox}>
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#64748b', marginRight: '4px' }}>
                  Word Box:
                </span>
                {PREPOSITIONS_BOX_EX1.map((prep) => (
                  <span key={prep} className={styles.wordBoxItem}>
                    {prep}
                  </span>
                ))}
              </div>

              <div className={styles.sentencesGrid}>
                {PREPOSITION_ITEMS.map((item) => {
                  const currAnswers = getRecord(answers.check_ex1_prepositions);
                  const val = item.isGiven ? item.givenValue : currAnswers[item.id] || '';
                  const v = item.isGiven ? null : verify('check_ex1_prepositions', item.id, val);
                  const diff = item.isGiven ? false : isDiff('check_ex1_prepositions', item.id);

                  return (
                    <div key={item.id} className={styles.sentenceRow}>
                      <span className={styles.sentenceIndex}>{item.id}</span>
                      <span>{item.pre}</span>
                      {item.isGiven ? (
                        <span style={{ fontWeight: 800, textDecoration: 'underline', color: '#be123c' }}>
                          {item.givenValue}
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleFieldChange('check_ex1_prepositions', item.id, e.target.value)}
                          disabled={readOnly}
                          placeholder=""
                          className={`${styles.inlineInput} ${
                            v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                          } ${diff ? styles.diffHighlight : ''}`}
                        />
                      )}
                      <span>{item.post}</span>
                      {isReview && v && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={v} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Ex 2: Object Pronouns */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionBadge}>2</span>
                <span>Object Pronouns</span>
              </h3>
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              Complete the sentences with the words in the box:
            </p>

            <div className={styles.wordBox}>
              <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#64748b', marginRight: '4px' }}>
                Pronouns Box:
              </span>
              {PRONOUNS_BOX_EX2.map((p) => (
                <span key={p} className={styles.wordBoxItem}>
                  {p}
                </span>
              ))}
            </div>

            <div className={styles.sentencesGrid}>
              {PRONOUN_ITEMS.map((item) => {
                const currAnswers = getRecord(answers.check_ex2_pronouns);
                const val = currAnswers[item.id] || '';
                const v = verify('check_ex2_pronouns', item.id, val);
                const diff = isDiff('check_ex2_pronouns', item.id);

                return (
                  <div key={item.id} className={styles.sentenceRow}>
                    <span className={styles.sentenceIndex}>{item.id}</span>
                    <span>{item.pre}</span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleFieldChange('check_ex2_pronouns', item.id, e.target.value)}
                      disabled={readOnly}
                      placeholder=""
                      style={{ maxWidth: '100px' }}
                      className={`${styles.inlineInput} ${
                        v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diff ? styles.diffHighlight : ''}`}
                    />
                    <span>{item.post}</span>
                    {isReview && v && (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={v} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Ex 3a & 3b: Verb Collocations & Checkboxes */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionBadge}>3a &amp; 3b</span>
                <span>Hobbies &amp; Activities Collocations</span>
              </h3>
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              <strong>3a</strong> Complete the sentences with the correct form of the verbs in the box.
            </p>

            <div className={styles.wordBox}>
              <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#64748b', marginRight: '4px' }}>
                Verbs Box:
              </span>
              {VERBS_BOX_EX3.map((v) => (
                <span key={v} className={styles.wordBoxItem}>
                  {v}
                </span>
              ))}
            </div>

            <div className={styles.sentencesGrid}>
              {VERB_ITEMS.map((item) => {
                const currAnswers = getRecord(answers.check_ex3a_verbs);
                const val = currAnswers[item.id] || '';
                const v = verify('check_ex3a_verbs', item.id, val);
                const diff = isDiff('check_ex3a_verbs', item.id);

                return (
                  <div key={item.id} className={styles.sentenceRow}>
                    <span className={styles.sentenceIndex}>{item.id}</span>
                    <span>{item.pre}</span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleFieldChange('check_ex3a_verbs', item.id, e.target.value)}
                      disabled={readOnly}
                      placeholder=""
                      style={{ maxWidth: '130px' }}
                      className={`${styles.inlineInput} ${
                        v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diff ? styles.diffHighlight : ''}`}
                    />
                    <span>{item.post}</span>
                    {isReview && v && (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={v} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>
              <strong>3b</strong> Tick the sentences that are true for you:
            </p>

            <div className={styles.sentencesGrid}>
              {VERB_ITEMS.map((item) => {
                const currTicks = getRecord(answers.check_ex3b_ticks);
                const isChecked = currTicks[item.id] === 'true';

                return (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      cursor: readOnly ? 'default' : 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        handleFieldChange('check_ex3b_ticks', item.id, e.target.checked ? 'true' : 'false')
                      }
                      disabled={readOnly}
                      style={{ width: '18px', height: '18px', accentColor: '#be123c' }}
                    />
                    <span>
                      Sentence {item.id}: {item.pre} [...] {item.post}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Ex 4: Verbs + -ing */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionBadge}>4</span>
                <span>like / enjoy / love / hate + -ing</span>
              </h3>
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              Complete the sentences with the correct form of the verbs in brackets.
            </p>

            <div className={styles.sentencesGrid}>
              {/* Item 1 (Example) */}
              <div className={styles.sentenceRow}>
                <span className={styles.sentenceIndex}>1</span>
                <span>1 I</span>
                <span style={{ fontWeight: 800, textDecoration: 'underline', color: '#be123c' }}>love reading</span>
                <span>(love/read) books at the weekend.</span>
              </div>

              {/* Item 2 */}
              {(() => {
                const currAnswers = getRecord(answers.check_ex4_verb_forms);
                const val = currAnswers['2'] || '';
                const v = verify('check_ex4_verb_forms', '2', val);
                const diff = isDiff('check_ex4_verb_forms', '2');
                return (
                  <div className={styles.sentenceRow}>
                    <span className={styles.sentenceIndex}>2</span>
                    <span>2 I</span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleFieldChange('check_ex4_verb_forms', '2', e.target.value)}
                      disabled={readOnly}
                      placeholder=""
                      style={{ maxWidth: '150px' }}
                      className={`${styles.inlineInput} ${
                        v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diff ? styles.diffHighlight : ''}`}
                    />
                    <span>(hate/do) exercise on Sundays.</span>
                    {isReview && v && (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={v} />
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Item 3 */}
              {(() => {
                const currAnswers = getRecord(answers.check_ex4_verb_forms);
                const valAux = currAnswers['3_aux'] || '';
                const valVerb = currAnswers['3_verb'] || '';
                const vAux = verify('check_ex4_verb_forms', '3_aux', valAux);
                const vVerb = verify('check_ex4_verb_forms', '3_verb', valVerb);
                const diffAux = isDiff('check_ex4_verb_forms', '3_aux');
                const diffVerb = isDiff('check_ex4_verb_forms', '3_verb');

                return (
                  <div className={styles.sentenceRow}>
                    <span className={styles.sentenceIndex}>3</span>
                    <span>3 What sports</span>
                    <input
                      type="text"
                      value={valAux}
                      onChange={(e) => handleFieldChange('check_ex4_verb_forms', '3_aux', e.target.value)}
                      disabled={readOnly}
                      placeholder=""
                      style={{ maxWidth: '70px' }}
                      className={`${styles.inlineInput} ${
                        vAux ? (vAux.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diffAux ? styles.diffHighlight : ''}`}
                    />
                    <span>you</span>
                    <input
                      type="text"
                      value={valVerb}
                      onChange={(e) => handleFieldChange('check_ex4_verb_forms', '3_verb', e.target.value)}
                      disabled={readOnly}
                      placeholder=""
                      style={{ maxWidth: '170px' }}
                      className={`${styles.inlineInput} ${
                        vVerb ? (vVerb.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diffVerb ? styles.diffHighlight : ''}`}
                    />
                    <span>? (enjoy/watch)</span>
                    {isReview && (vAux || vVerb) && (
                      <div className={styles.feedbackRow}>
                        {vAux && <TeacherAnswerBadge result={vAux} />}
                        {vVerb && <TeacherAnswerBadge result={vVerb} />}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Item 4 */}
              {(() => {
                const currAnswers = getRecord(answers.check_ex4_verb_forms);
                const val = currAnswers['4'] || '';
                const v = verify('check_ex4_verb_forms', '4', val);
                const diff = isDiff('check_ex4_verb_forms', '4');
                return (
                  <div className={styles.sentenceRow}>
                    <span className={styles.sentenceIndex}>4</span>
                    <span>4 Jason</span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleFieldChange('check_ex4_verb_forms', '4', e.target.value)}
                      disabled={readOnly}
                      placeholder=""
                      style={{ maxWidth: '200px' }}
                      className={`${styles.inlineInput} ${
                        v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diff ? styles.diffHighlight : ''}`}
                    />
                    <span>(love/listen to) music.</span>
                    {isReview && v && (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={v} />
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Item 5 */}
              {(() => {
                const currAnswers = getRecord(answers.check_ex4_verb_forms);
                const val = currAnswers['5'] || '';
                const v = verify('check_ex4_verb_forms', '5', val);
                const diff = isDiff('check_ex4_verb_forms', '5');
                return (
                  <div className={styles.sentenceRow}>
                    <span className={styles.sentenceIndex}>5</span>
                    <span>5 Sally</span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleFieldChange('check_ex4_verb_forms', '5', e.target.value)}
                      disabled={readOnly}
                      placeholder=""
                      style={{ maxWidth: '210px' }}
                      className={`${styles.inlineInput} ${
                        v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diff ? styles.diffHighlight : ''}`}
                    />
                    <span>(not enjoy/work) at the weekend.</span>
                    {isReview && v && (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={v} />
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Item 6 */}
              {(() => {
                const currAnswers = getRecord(answers.check_ex4_verb_forms);
                const valAux = currAnswers['6_aux'] || '';
                const valVerb = currAnswers['6_verb'] || '';
                const vAux = verify('check_ex4_verb_forms', '6_aux', valAux);
                const vVerb = verify('check_ex4_verb_forms', '6_verb', valVerb);
                const diffAux = isDiff('check_ex4_verb_forms', '6_aux');
                const diffVerb = isDiff('check_ex4_verb_forms', '6_verb');

                return (
                  <div className={styles.sentenceRow}>
                    <span className={styles.sentenceIndex}>6</span>
                    <span>6 What radio programmes</span>
                    <input
                      type="text"
                      value={valAux}
                      onChange={(e) => handleFieldChange('check_ex4_verb_forms', '6_aux', e.target.value)}
                      disabled={readOnly}
                      placeholder=""
                      style={{ maxWidth: '70px' }}
                      className={`${styles.inlineInput} ${
                        vAux ? (vAux.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diffAux ? styles.diffHighlight : ''}`}
                    />
                    <span>you</span>
                    <input
                      type="text"
                      value={valVerb}
                      onChange={(e) => handleFieldChange('check_ex4_verb_forms', '6_verb', e.target.value)}
                      disabled={readOnly}
                      placeholder=""
                      style={{ maxWidth: '180px' }}
                      className={`${styles.inlineInput} ${
                        vVerb ? (vVerb.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diffVerb ? styles.diffHighlight : ''}`}
                    />
                    <span>? (like/listen to)</span>
                    {isReview && (vAux || vVerb) && (
                      <div className={styles.feedbackRow}>
                        {vAux && <TeacherAnswerBadge result={vAux} />}
                        {vVerb && <TeacherAnswerBadge result={vVerb} />}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Item 7 */}
              {(() => {
                const currAnswers = getRecord(answers.check_ex4_verb_forms);
                const val = currAnswers['7'] || '';
                const v = verify('check_ex4_verb_forms', '7', val);
                const diff = isDiff('check_ex4_verb_forms', '7');
                return (
                  <div className={styles.sentenceRow}>
                    <span className={styles.sentenceIndex}>7</span>
                    <span>7 My children</span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleFieldChange('check_ex4_verb_forms', '7', e.target.value)}
                      disabled={readOnly}
                      placeholder=""
                      style={{ maxWidth: '210px' }}
                      className={`${styles.inlineInput} ${
                        v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diff ? styles.diffHighlight : ''}`}
                    />
                    <span>(not like/get up) early for school.</span>
                    {isReview && v && (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={v} />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </section>

          {/* Ex 5: Study habits verbs */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionBadge}>5</span>
                <span>Language Learning &amp; Study Verbs</span>
              </h3>
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              Complete the sentences with the correct form of the verbs in the box.
            </p>

            <div className={styles.wordBox}>
              <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#64748b', marginRight: '4px' }}>
                Verbs Box:
              </span>
              {VERBS_BOX_EX5.map((vb) => (
                <span key={vb} className={styles.wordBoxItem}>
                  {vb}
                </span>
              ))}
            </div>

            <div className={styles.sentencesGrid}>
              {VERB_BOX_ITEMS.map((item) => {
                const currAnswers = getRecord(answers.check_ex5_verbs_box);
                const val = item.isGiven ? item.givenValue : currAnswers[item.id] || '';
                const v = item.isGiven ? null : verify('check_ex5_verbs_box', item.id, val);
                const diff = item.isGiven ? false : isDiff('check_ex5_verbs_box', item.id);

                return (
                  <div key={item.id} className={styles.sentenceRow}>
                    <span className={styles.sentenceIndex}>{item.id}</span>
                    <span>{item.pre}</span>
                    {item.isGiven ? (
                      <span style={{ fontWeight: 800, textDecoration: 'underline', color: '#be123c' }}>
                        {item.givenValue}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleFieldChange('check_ex5_verbs_box', item.id, e.target.value)}
                        disabled={readOnly}
                        placeholder=""
                        style={{ maxWidth: '120px' }}
                        className={`${styles.inlineInput} ${
                          v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                        } ${diff ? styles.diffHighlight : ''}`}
                      />
                    )}
                    <span>{item.post}</span>
                    {isReview && v && (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={v} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Ex 6a & 6b: Why and Because questions & matching */}
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionBadge}>6a &amp; 6b</span>
                <span>Why and Because Questions &amp; Answers</span>
              </h3>
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              <strong>6a</strong> Put the words in the correct order to make questions.
            </p>

            <div className={styles.sentencesGrid}>
              {SCRAMBLED_QUESTIONS_6A.map((item) => {
                const currAnswers = getRecord(answers.check_ex6a_questions);
                const val = currAnswers[item.id] || '';
                const v = verify('check_ex6a_questions', item.id, val);
                const diff = isDiff('check_ex6a_questions', item.id);

                return (
                  <div key={item.id} className={styles.unscrambleCard}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={styles.sentenceIndex}>{item.id}</span>
                      <div className={styles.scrambledChipsRow}>
                        {item.prompt.split(' / ').map((chunk, idx) => (
                          <span key={idx} className={styles.scrambledChip}>
                            {chunk}
                          </span>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleFieldChange('check_ex6a_questions', item.id, e.target.value)}
                      disabled={readOnly}
                      placeholder="Type the full question..."
                      className={`${styles.unscrambleInput} ${
                        v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                      } ${diff ? styles.diffHighlight : ''}`}
                    />
                    {isReview && v && (
                      <div className={styles.feedbackRow}>
                        <TeacherAnswerBadge result={v} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p style={{ margin: '1rem 0 0 0', fontSize: '0.9rem', color: '#475569' }}>
              <strong>6b</strong> Match answers <strong>a–g</strong> with questions <strong>1–7</strong> in Exercise 6a:
            </p>

            <div className={styles.matchingSection}>
              <div className={styles.matchingQuestionsList}>
                {SCRAMBLED_QUESTIONS_6A.map((item) => {
                  const currAnswers = getRecord(answers.check_ex6b_matching);
                  const val = currAnswers[item.id] || '';
                  const v = verify('check_ex6b_matching', item.id, val);
                  const diff = isDiff('check_ex6b_matching', item.id);

                  return (
                    <div key={item.id} className={styles.matchingQuestionRow}>
                      <span style={{ fontWeight: 600 }}>Question {item.id}</span>
                      <select
                        value={val}
                        onChange={(e) => handleFieldChange('check_ex6b_matching', item.id, e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inlineSelect} ${
                          v ? (v.isCorrect ? styles.correct : styles.incorrect) : ''
                        } ${diff ? styles.diffHighlight : ''}`}
                      >
                        <option value="">Match answer...</option>
                        {MATCHING_ANSWERS_6B.map((ans) => (
                          <option key={ans.letter} value={ans.letter}>
                            Answer {ans.letter}
                          </option>
                        ))}
                      </select>
                      {isReview && v && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={v} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className={styles.matchingAnswersBox}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#0369a1', textTransform: 'uppercase' }}>
                  Answers a–g:
                </h4>
                {MATCHING_ANSWERS_6B.map((ans) => (
                  <div key={ans.letter} className={styles.matchingAnswerItem}>
                    <span className={styles.matchingLetterBadge}>{ans.letter}</span>
                    <span>{ans.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Reflect Block */}
          <section className={styles.reflectBox}>
            <div>
              <h3 className={styles.reflectTitle}>Reflect</h3>
              <p className={styles.reflectSubtitle}>
                How confident do you feel about the statements below? Write or select 1–5 (1 = not very confident, 5 = very confident).
              </p>
            </div>

            <div className={styles.reflectList}>
              {REFLECT_STATEMENTS.map((stmt) => {
                const currRatings = getRecord(answers.check_reflect);
                const currentRating = currRatings[stmt.id] || '';

                return (
                  <div key={stmt.id} className={styles.reflectItem}>
                    <span className={styles.reflectStatement}>• {stmt.text}</span>
                    <div className={styles.reflectRatingGroup}>
                      {['1', '2', '3', '4', '5'].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`${styles.reflectRatingBtn} ${currentRating === star ? styles.active : ''}`}
                          onClick={() => handleFieldChange('check_reflect', stmt.id, star)}
                          disabled={readOnly}
                          aria-label={`Rating ${star} for: ${stmt.text}`}
                        >
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Banner More Practice */}
          <div className={styles.bannerWrap}>
            <Image
              src="/images/lesson9d/banner_more_practice.png"
              alt="Want more practice? Go to your Workbook or app"
              width={430}
              height={170}
            />
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeZoomImage && (
        <div className={styles.lightboxModal} onClick={() => setActiveZoomImage(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lightboxHeader}>
              <h4>{activeZoomImage.title}</h4>
              <button
                type="button"
                className={styles.lightboxCloseBtn}
                onClick={() => setActiveZoomImage(null)}
                aria-label="Close image modal"
              >
                ✕
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%', minHeight: '350px', padding: '1rem' }}>
              <Image
                src={activeZoomImage.src}
                alt={activeZoomImage.alt}
                width={800}
                height={600}
                style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
