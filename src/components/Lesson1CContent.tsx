'use client';

import React from 'react';
import Image from 'next/image';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import { verifyAnswer, getExerciseKey, LessonAnswerKey } from '@/lib/answerVerification';
import styles from './lesson1c.module.scss';

export const countriesData = [
  { id: '1', name: 'Spain', key: 'd', label: 'Spanish' },
  { id: '2', name: 'Canada', key: 'j', label: 'Canadian' },
  { id: '3', name: 'Japan', key: 'g', label: 'Japanese' },
  { id: '4', name: 'the US', key: 'i', label: 'American' },
  { id: '5', name: 'Poland', key: 'c', label: 'Polish' },
  { id: '6', name: 'Argentina', key: 'l', label: 'Argentinian' },
  { id: '7', name: 'Thailand', key: 'a', label: 'Thai' },
  { id: '8', name: 'the UK', key: 'b', label: 'British' },
  { id: '9', name: 'Turkey', key: 'e', label: 'Turkish' },
  { id: '10', name: 'Mexico', key: 'f', label: 'Mexican' },
  { id: '11', name: 'Brazil', key: 'k', label: 'Brazilian' },
  { id: '12', name: 'Italy', key: 'h', label: 'Italian' },
];

export const nationalitiesList = [
  { key: 'a', label: 'Thai' },
  { key: 'b', label: 'British' },
  { key: 'c', label: 'Polish' },
  { key: 'd', label: 'Spanish' },
  { key: 'e', label: 'Turkish' },
  { key: 'f', label: 'Mexican' },
  { key: 'g', label: 'Japanese' },
  { key: 'h', label: 'Italian' },
  { key: 'i', label: 'American' },
  { key: 'j', label: 'Canadian' },
  { key: 'k', label: 'Brazilian' },
  { key: 'l', label: 'Argentinian' },
];

export interface Lesson1CContentProps {
  lesson?: Record<string, unknown> | null;
  user?: Record<string, unknown> | null;
  nationalitiesInputs: Record<string, string>;
  stressInputs: Record<string, string>;
  famousInputs?: string;
  photosInputs: Record<string, string>;
  tfInputs: Record<string, string>;
  grammar5aInputs: Record<string, string>;
  textsInputs: Record<string, string>;
  questionsInputs: Record<string, string>;
  speakingNotes?: string;
  onNationalitiesChange: (id: string, value: string) => void;
  onStressChange: (id: string, value: string) => void;
  onFamousChange?: (value: string) => void;
  onPhotosChange: (id: string, value: string) => void;
  onTfChange: (id: string, value: string) => void;
  onGrammar5aChange: (id: string, value: string) => void;
  onTextsChange: (id: string, value: string) => void;
  onQuestionsChange: (id: string, value: string) => void;
  onSpeakingNotesChange?: (value: string) => void;
  readOnly?: boolean;
  isTeacherReview?: boolean;
  answerKey?: LessonAnswerKey | null;
  originalAnswers?: {
    exercise_1b_nationalities?: Record<string, string>;
    exercise_2c_stress?: Record<string, string>;
    exercise_3_famous?: string;
    exercise_4a_photos?: Record<string, string>;
    exercise_4b_tf?: Record<string, string>;
    exercise_5a_grammar?: Record<string, string>;
    exercise_6_texts?: Record<string, string>;
    exercise_7a_questions?: Record<string, string>;
    exercise_8b_notes?: string;
  };
  playAudio: (track: string) => void;
  playingAudio: string | null;
}

export default function Lesson1CContent({
  nationalitiesInputs = {},
  stressInputs = {},
  famousInputs = '',
  photosInputs = {},
  tfInputs = {},
  grammar5aInputs = {},
  textsInputs = {},
  questionsInputs = {},
  speakingNotes = '',
  onNationalitiesChange,
  onStressChange,
  onFamousChange = () => {},
  onPhotosChange,
  onTfChange,
  onGrammar5aChange,
  onTextsChange,
  onQuestionsChange,
  onSpeakingNotesChange = () => {},
  readOnly = false,
  isTeacherReview = false,
  answerKey = null,
  originalAnswers,
  playAudio,
  playingAudio,
}: Lesson1CContentProps) {
  const ex1bKey = getExerciseKey(answerKey, 'exercise_1b_nationalities');
  const ex2cKey = getExerciseKey(answerKey, 'exercise_2c_stress');
  const ex4aKey = getExerciseKey(answerKey, 'exercise_4a_photos');
  const ex4bKey = getExerciseKey(answerKey, 'exercise_4b_tf');
  const ex5aKey = getExerciseKey(answerKey, 'exercise_5a_grammar');
  const ex6Key = getExerciseKey(answerKey, 'exercise_6_texts');
  const ex7aKey = getExerciseKey(answerKey, 'exercise_7a_questions');

  return (
    <div className={styles.pageContainer}>
      {/* ================= TEXTBOOK PAGE 10 ================= */}
      <div className={styles.textbookPage}>
        {/* Header Grid: Banner + Photo 3 */}
        <div className={styles.headerGrid}>
          <div className={styles.headerBanner}>
            <div className={styles.badgeChevron}>
              1<span>C</span>
            </div>
            <div className={styles.titleArea}>
              <h1>Nationalities</h1>
            </div>
          </div>
          <div className={styles.headerPhotoWrap}>
            <Image
              src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
              alt="Photo 3"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              style={{ objectFit: 'cover' }}
              unoptimized
            />
            <div className={styles.photoBadge} style={{ bottom: 0, left: 0 }}>3</div>
          </div>
        </div>

        {/* Goals Box */}
        <div className={styles.goalsBox}>
          <p><strong>Goal:</strong> <span>talk about different nationalities</span></p>
          <p><strong>Grammar:</strong> <span>be: you/we/they</span></p>
          <p><strong>Vocabulary:</strong> <span>nationalities</span></p>
        </div>

        {/* Page 10 Two Columns */}
        <div className={styles.twoColumnGrid}>
          {/* Left Column: Vocabulary (Photos 1 & 2 + Ex 1b, 2, 3) */}
          <div className={styles.column}>
            <h2 className={styles.sectionHeading}>Vocabulary</h2>

            {/* Photos 1 & 2 Preview */}
            <div className={styles.photosGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className={styles.photoCard} style={{ height: '140px' }}>
                <Image
                  src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80"
                  alt="Photo 1"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
                <div className={styles.photoBadge} style={{ bottom: 0, left: 0 }}>1</div>
              </div>
              <div className={styles.photoCard} style={{ height: '140px' }}>
                <Image
                  src="https://images.unsplash.com/photo-1507783548227-544c3b8fc065?auto=format&fit=crop&w=600&q=80"
                  alt="Photo 2"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
                <div className={styles.photoBadge} style={{ bottom: 0, left: 0 }}>2</div>
              </div>
            </div>

            {/* Exercise 1a Note */}
            <p className={styles.exerciseTitle}>
              <span className={styles.exNum}>1</span>
              <span className={styles.exSub}>a</span>
              <span>Work in pairs. Look at photos 1–6 and name the countries.</span>
            </p>

            {/* Exercise 1b: Match countries 1–12 with nationalities a–l */}
            <div className={styles.exerciseBlock}>
              <p className={styles.exerciseTitle}>
                <span className={styles.exSub}>b</span>
                <span>Match countries 1–12 with nationalities a–l.</span>
              </p>

              <div className={styles.matchingGrid}>
                {countriesData.map((c) => {
                  const currentVal = nationalitiesInputs[c.id] || '';
                  const origVal = originalAnswers?.exercise_1b_nationalities?.[c.id];
                  const isChanged = origVal !== undefined && origVal !== currentVal;
                  const vRes = isTeacherReview ? verifyAnswer(currentVal, ex1bKey?.[c.id]) : null;
                  const validClass = vRes?.status === 'correct' ? styles.choiceValid : vRes?.status === 'incorrect' ? styles.choiceInvalid : '';

                  return (
                    <div key={c.id} className={styles.matchRow}>
                      <span className={styles.countryLabel}>
                        <strong>{c.id}.</strong> {c.name}
                      </span>
                      <select
                        value={currentVal}
                        onChange={(e) => onNationalitiesChange(c.id, e.target.value)}
                        disabled={readOnly}
                        className={`${styles.matchSelect} ${validClass} ${isChanged ? 'border-amber-500' : ''}`}
                      >
                        <option value="">-- select --</option>
                        {nationalitiesList.map((nat) => (
                          <option key={nat.key} value={nat.key}>
                            {nat.key}) {nat.label}
                          </option>
                        ))}
                      </select>
                      <TeacherAnswerBadge result={vRes} isTeacherReview={isTeacherReview} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 2: Audio & Stress */}
            <div className={styles.exerciseBlock}>
              <p className={styles.exerciseTitle}>
                <span className={styles.exNum}>2</span>
                <span className={styles.exSub}>a</span>
                <span>Listen and underline the stressed syllables.</span>
              </p>
              <button
                type="button"
                onClick={() => playAudio('1.11')}
                className={styles.audioButton}
              >
                <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                {playingAudio === '1.11' ? 'Playing 1.11...' : 'Audio 1.11'}
              </button>

              <div style={{ marginTop: '0.5rem' }}>
                <p className={styles.exerciseTitle}>
                  <span className={styles.exSub}>c</span>
                  <span>Is the stress on the same (S) or different (D) syllables?</span>
                </p>
                <button
                  type="button"
                  onClick={() => playAudio('1.12')}
                  className={styles.audioButton}
                  style={{ margin: '0.4rem 0 0.75rem 0' }}
                >
                  <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                  {playingAudio === '1.12' ? 'Playing 1.12...' : 'Audio 1.12'}
                </button>

                <div className={styles.stressList}>
                  <div className={styles.stressRow}>
                    <span>1. Argentina / Argentinian</span>
                    <span className={styles.exampleText}>[ S ] (Example)</span>
                  </div>

                  {[
                    { id: '2', text: '2. Canada / Canadian' },
                    { id: '3', text: '3. Japan / Japanese' },
                    { id: '4', text: '4. Mexico / Mexican' },
                    { id: '5', text: '5. Poland / Polish' },
                  ].map((item) => {
                    const currentVal = stressInputs[item.id] || '';
                    const vRes = isTeacherReview ? verifyAnswer(currentVal, ex2cKey?.[item.id]) : null;
                    const validClass = vRes?.status === 'correct' ? styles.choiceValid : vRes?.status === 'incorrect' ? styles.choiceInvalid : '';

                    return (
                      <div key={item.id} className={styles.stressRow}>
                        <span>{item.text}</span>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <select
                            value={currentVal}
                            onChange={(e) => onStressChange(item.id, e.target.value)}
                            disabled={readOnly}
                            className={`${styles.stressSelect} ${validClass}`}
                          >
                            <option value="">--</option>
                            <option value="S">S (Same)</option>
                            <option value="D">D (Different)</option>
                          </select>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isTeacherReview} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Exercise 3: Famous People */}
            <div className={styles.exerciseBlock}>
              <p className={styles.exerciseTitle}>
                <span className={styles.exNum}>3</span>
                <span>Write sentences about the nationalities of some famous people.</span>
              </p>
              <p className={styles.exampleText}>Example: Tom Cruise is American.</p>
              <textarea
                value={famousInputs}
                onChange={(e) => onFamousChange(e.target.value)}
                placeholder="Write 2–3 sentences here..."
                disabled={readOnly}
                className={styles.notesTextarea}
                rows={2}
              />
            </div>
          </div>

          {/* Right Column: Reading (Photos A–E + Blog + 4b True/False) */}
          <div className={styles.column}>
            <h2 className={styles.sectionHeading}>Reading</h2>

            {/* Photos A–E Collage */}
            <div className={styles.photosGrid}>
              {[
                { id: 'A', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80' },
                { id: 'B', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80' },
                { id: 'C', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80' },
                { id: 'D', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
                { id: 'E', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
              ].map((p) => (
                <div key={p.id} className={styles.photoCard}>
                  <Image
                    src={p.url}
                    alt={`Photo ${p.id}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 200px"
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  <div className={styles.photoBadge} style={{ top: 0, left: 0 }}>{p.id}</div>
                </div>
              ))}
            </div>

            {/* Exercise 4a: Blog Matching */}
            <div className={styles.blogBox}>
              <div className={styles.blogHeader}>Me and my friends</div>
              <div className={styles.blogContent}>
                {[
                  {
                    id: '1',
                    text: "Hi! I'm Nina. I'm from London. I'm a university student and an office worker.",
                  },
                  {
                    id: '2',
                    text: "Tessa and Julia are my friends from university. Tessa is Turkish and Julia is Polish. They're student nurses.",
                  },
                  {
                    id: '3',
                    text: "This is my office. We aren't all British. We're from all over the world. Diego is from Spain, Carlos is from Argentina and the manager is from Thailand. We're a good team.",
                  },
                  {
                    id: '4',
                    text: "Tim, Annie and Dan are my friends from school. They aren't in the UK now. They're at an American university.",
                  },
                  {
                    id: '5',
                    text: "And this is my friend Marvin. He's from London, but he's in Vancouver in Canada now.",
                  },
                ].map((item) => {
                  const currentVal = photosInputs[item.id] || '';
                  const vRes = isTeacherReview ? verifyAnswer(currentVal, ex4aKey?.[item.id]) : null;
                  const validClass = vRes?.status === 'correct' ? styles.choiceValid : vRes?.status === 'incorrect' ? styles.choiceInvalid : '';

                  return (
                    <div key={item.id} className={styles.blogParagraph}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <select
                          value={currentVal}
                          onChange={(e) => onPhotosChange(item.id, e.target.value)}
                          disabled={readOnly}
                          className={`${styles.paraMatchSelect} ${validClass}`}
                          title={`Match photo for paragraph ${item.id}`}
                        >
                          <option value="">?</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                        </select>
                        <TeacherAnswerBadge result={vRes} isTeacherReview={isTeacherReview} />
                      </div>
                      <p>
                        <strong>{item.id}.</strong> {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 4b: True or False */}
            <div className={styles.exerciseBlock}>
              <p className={styles.exerciseTitle}>
                <span className={styles.exSub}>b</span>
                <span>Are the sentences true (T) or false (F)?</span>
              </p>
              <div className={styles.tfList}>
                <div className={styles.tfRow}>
                  <span>1. Nina is from the US.</span>
                  <span className={styles.exampleText}>[ F ] (from the UK)</span>
                </div>

                {[
                  { id: '2', text: '2. Tessa and Julia are from Turkey.' },
                  { id: '3', text: '3. The office manager is Thai.' },
                  { id: '4', text: '4. Tim, Annie and Dan are in the UK now.' },
                  { id: '5', text: '5. Marvin is from Vancouver.' },
                ].map((item) => {
                  const currentVal = tfInputs[item.id] || '';
                  const vRes = isTeacherReview ? verifyAnswer(currentVal, ex4bKey?.[item.id]) : null;
                  const validClass = vRes?.status === 'correct' ? styles.choiceValid : vRes?.status === 'incorrect' ? styles.choiceInvalid : '';

                  return (
                    <div key={item.id} className={styles.tfRow}>
                      <span>{item.text}</span>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select
                          value={currentVal}
                          onChange={(e) => onTfChange(item.id, e.target.value)}
                          disabled={readOnly}
                          className={`${styles.tfSelect} ${validClass}`}
                        >
                          <option value="">--</option>
                          <option value="T">T (True)</option>
                          <option value="F">F (False)</option>
                        </select>
                        <TeacherAnswerBadge result={vRes} isTeacherReview={isTeacherReview} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TEXTBOOK PAGE 11 ================= */}
      <div className={styles.textbookPage}>
        {/* Page 11 Photos Collage 4, 5, 6 */}
        <div className={styles.photosGrid} style={{ padding: '1rem 1.5rem 0' }}>
          <div className={styles.photoCard} style={{ height: '140px' }}>
            <Image
              src="https://images.unsplash.com/photo-1543716091-a840c05249ec?auto=format&fit=crop&w=600&q=80"
              alt="Photo 4: Statue of Liberty"
              fill
              sizes="(max-width: 768px) 33vw, 300px"
              style={{ objectFit: 'cover' }}
              unoptimized
            />
            <div className={styles.photoBadge} style={{ bottom: 0, right: 0 }}>4</div>
          </div>
          <div className={styles.photoCard} style={{ height: '140px' }}>
            <Image
              src="https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=600&q=80"
              alt="Photo 5: Mount Fuji"
              fill
              sizes="(max-width: 768px) 33vw, 300px"
              style={{ objectFit: 'cover' }}
              unoptimized
            />
            <div className={styles.photoBadge} style={{ bottom: 0, right: 0 }}>5</div>
          </div>
          <div className={styles.photoCard} style={{ height: '140px' }}>
            <Image
              src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80"
              alt="Photo 6: Thailand"
              fill
              sizes="(max-width: 768px) 33vw, 300px"
              style={{ objectFit: 'cover' }}
              unoptimized
            />
            <div className={styles.photoBadge} style={{ bottom: 0, right: 0 }}>6</div>
          </div>
        </div>

        {/* Page 11 Two Columns */}
        <div className={styles.twoColumnGrid}>
          {/* Left Column: Grammar (5a, 5b, 6) */}
          <div className={styles.column}>
            <h2 className={styles.sectionHeading}>Grammar: be: you/we/they</h2>

            {/* Exercise 5a: Grammar Table */}
            <div className={styles.exerciseBlock}>
              <p className={styles.exerciseTitle}>
                <span className={styles.exNum}>5</span>
                <span className={styles.exSub}>a</span>
                <span>Complete the grammar box with <i>are</i> and <i>aren&apos;t</i>.</span>
              </p>

              <div className={styles.grammarTableWrap}>
                <table className={styles.grammarTable}>
                  <thead>
                    <tr>
                      <th>+</th>
                      <th colSpan={2}>-</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>You&apos;re</strong> British.</td>
                      <td colSpan={2}><strong>You aren&apos;t</strong> American.</td>
                    </tr>
                    <tr>
                      <td><strong>We&apos;re</strong> office workers.</td>
                      <td colSpan={2}>
                        <strong>We</strong>{' '}
                        <input
                          type="text"
                          value={grammar5aInputs['1'] || ''}
                          onChange={(e) => onGrammar5aChange('1', e.target.value)}
                          placeholder="1"
                          disabled={readOnly}
                          className={`${styles.tableInput} ${isTeacherReview ? (verifyAnswer(grammar5aInputs['1'], ex5aKey?.['1']).status === 'correct' ? styles.inputValid : verifyAnswer(grammar5aInputs['1'], ex5aKey?.['1']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                        />
                        <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(grammar5aInputs['1'], ex5aKey?.['1']) : null} isTeacherReview={isTeacherReview} />{' '}
                        football players.
                      </td>
                    </tr>
                    <tr>
                      <td><strong>They&apos;re</strong> nurses.</td>
                      <td colSpan={2}><strong>They aren&apos;t</strong> doctors.</td>
                    </tr>
                    <tr>
                      <th>?</th>
                      <th>+</th>
                      <th>-</th>
                    </tr>
                    <tr>
                      <td><strong>Are you</strong> British?</td>
                      <td>
                        Yes, <strong>we</strong>{' '}
                        <input
                          type="text"
                          value={grammar5aInputs['2'] || ''}
                          onChange={(e) => onGrammar5aChange('2', e.target.value)}
                          placeholder="2"
                          disabled={readOnly}
                          className={`${styles.tableInput} ${isTeacherReview ? (verifyAnswer(grammar5aInputs['2'], ex5aKey?.['2']).status === 'correct' ? styles.inputValid : verifyAnswer(grammar5aInputs['2'], ex5aKey?.['2']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                        />
                        <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(grammar5aInputs['2'], ex5aKey?.['2']) : null} isTeacherReview={isTeacherReview} />.
                      </td>
                      <td>No, <strong>we aren&apos;t.</strong></td>
                    </tr>
                    <tr>
                      <td><strong>Are we</strong> a good team?</td>
                      <td>Yes, <strong>you are.</strong></td>
                      <td>No, <strong>you aren&apos;t.</strong></td>
                    </tr>
                    <tr>
                      <td>
                        <input
                          type="text"
                          value={grammar5aInputs['3'] || ''}
                          onChange={(e) => onGrammar5aChange('3', e.target.value)}
                          placeholder="3"
                          disabled={readOnly}
                          className={`${styles.tableInput} ${isTeacherReview ? (verifyAnswer(grammar5aInputs['3'], ex5aKey?.['3']).status === 'correct' ? styles.inputValid : verifyAnswer(grammar5aInputs['3'], ex5aKey?.['3']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                        />
                        <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(grammar5aInputs['3'], ex5aKey?.['3']) : null} isTeacherReview={isTeacherReview} />{' '}
                        <strong>they</strong> in the UK?
                      </td>
                      <td>Yes, <strong>they are.</strong></td>
                      <td>
                        No, <strong>they</strong>{' '}
                        <input
                          type="text"
                          value={grammar5aInputs['4'] || ''}
                          onChange={(e) => onGrammar5aChange('4', e.target.value)}
                          placeholder="4"
                          disabled={readOnly}
                          className={`${styles.tableInput} ${isTeacherReview ? (verifyAnswer(grammar5aInputs['4'], ex5aKey?.['4']).status === 'correct' ? styles.inputValid : verifyAnswer(grammar5aInputs['4'], ex5aKey?.['4']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                        />
                        <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(grammar5aInputs['4'], ex5aKey?.['4']) : null} isTeacherReview={isTeacherReview} />.
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ marginTop: '0.75rem', fontSize: '0.88rem' }}>
                  <strong>with <i>who</i>:</strong>{' '}
                  Who{' '}
                  <input
                    type="text"
                    value={grammar5aInputs['5'] || ''}
                    onChange={(e) => onGrammar5aChange('5', e.target.value)}
                    placeholder="5"
                    disabled={readOnly}
                    className={`${styles.tableInput} ${isTeacherReview ? (verifyAnswer(grammar5aInputs['5'], ex5aKey?.['5']).status === 'correct' ? styles.inputValid : verifyAnswer(grammar5aInputs['5'], ex5aKey?.['5']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                  />
                  <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(grammar5aInputs['5'], ex5aKey?.['5']) : null} isTeacherReview={isTeacherReview} />{' '}
                  they? – <strong>They&apos;re</strong> my friends.
                </div>
              </div>
            </div>

            {/* Exercise 5b: Audio 1.13 */}
            <div className={styles.exerciseBlock}>
              <p className={styles.exerciseTitle}>
                <span className={styles.exSub}>b</span>
                <span>Pronunciation of short forms</span>
              </p>
              <button
                type="button"
                onClick={() => playAudio('1.13')}
                className={styles.audioButton}
              >
                <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                {playingAudio === '1.13' ? 'Playing 1.13...' : 'Audio 1.13'}
              </button>
            </div>

            {/* Exercise 6: Complete the texts with word box */}
            <div className={styles.exerciseBlock}>
              <p className={styles.exerciseTitle}>
                <span className={styles.exNum}>6</span>
                <span>Complete the texts with the words in the box.</span>
              </p>

              {/* Box 1 */}
              <div className={styles.wordBox}>
                <span>&apos;re</span>
                <span>are</span>
                <span>&apos;re</span>
                <span>aren&apos;t</span>
                <span>&apos;re</span>
              </div>
              <div className={styles.speechBox}>
                Lidia and Wiktor <span className={styles.exampleText}>are (1)</span> my friends. We{' '}
                <input
                  type="text"
                  value={textsInputs['2'] || ''}
                  onChange={(e) => onTextsChange('2', e.target.value)}
                  placeholder="2"
                  disabled={readOnly}
                  className={`${styles.gapInput} ${isTeacherReview ? (verifyAnswer(textsInputs['2'], ex6Key?.['2']).status === 'correct' ? styles.inputValid : verifyAnswer(textsInputs['2'], ex6Key?.['2']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                />
                <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(textsInputs['2'], ex6Key?.['2']) : null} isTeacherReview={isTeacherReview} />{' '}
                from Poland but Lidia and Wiktor{' '}
                <input
                  type="text"
                  value={textsInputs['3'] || ''}
                  onChange={(e) => onTextsChange('3', e.target.value)}
                  placeholder="3"
                  disabled={readOnly}
                  className={`${styles.gapInput} ${isTeacherReview ? (verifyAnswer(textsInputs['3'], ex6Key?.['3']).status === 'correct' ? styles.inputValid : verifyAnswer(textsInputs['3'], ex6Key?.['3']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                />
                <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(textsInputs['3'], ex6Key?.['3']) : null} isTeacherReview={isTeacherReview} />{' '}
                in Kraków at the moment. They{' '}
                <input
                  type="text"
                  value={textsInputs['4'] || ''}
                  onChange={(e) => onTextsChange('4', e.target.value)}
                  placeholder="4"
                  disabled={readOnly}
                  className={`${styles.gapInput} ${isTeacherReview ? (verifyAnswer(textsInputs['4'], ex6Key?.['4']).status === 'correct' ? styles.inputValid : verifyAnswer(textsInputs['4'], ex6Key?.['4']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                />
                <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(textsInputs['4'], ex6Key?.['4']) : null} isTeacherReview={isTeacherReview} />{' '}
                at university in the UK and they{' '}
                <input
                  type="text"
                  value={textsInputs['5'] || ''}
                  onChange={(e) => onTextsChange('5', e.target.value)}
                  placeholder="5"
                  disabled={readOnly}
                  className={`${styles.gapInput} ${isTeacherReview ? (verifyAnswer(textsInputs['5'], ex6Key?.['5']).status === 'correct' ? styles.inputValid : verifyAnswer(textsInputs['5'], ex6Key?.['5']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                />
                <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(textsInputs['5'], ex6Key?.['5']) : null} isTeacherReview={isTeacherReview} />{' '}
                very happy there.
              </div>

              {/* Box 2 */}
              <div className={styles.wordBox} style={{ marginTop: '0.75rem' }}>
                <span>are</span>
                <span>aren&apos;t</span>
                <span>are</span>
                <span>&apos;re</span>
                <span>are</span>
              </div>
              <div className={styles.speechBox}>
                My office is in Chicago. My manager and I <span className={styles.exampleText}>are (6)</span> from Chicago, but some people{' '}
                <input
                  type="text"
                  value={textsInputs['7'] || ''}
                  onChange={(e) => onTextsChange('7', e.target.value)}
                  placeholder="7"
                  disabled={readOnly}
                  className={`${styles.gapInput} ${isTeacherReview ? (verifyAnswer(textsInputs['7'], ex6Key?.['7']).status === 'correct' ? styles.inputValid : verifyAnswer(textsInputs['7'], ex6Key?.['7']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                />
                <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(textsInputs['7'], ex6Key?.['7']) : null} isTeacherReview={isTeacherReview} />{' '}
                American. They{' '}
                <input
                  type="text"
                  value={textsInputs['8'] || ''}
                  onChange={(e) => onTextsChange('8', e.target.value)}
                  placeholder="8"
                  disabled={readOnly}
                  className={`${styles.gapInput} ${isTeacherReview ? (verifyAnswer(textsInputs['8'], ex6Key?.['8']).status === 'correct' ? styles.inputValid : verifyAnswer(textsInputs['8'], ex6Key?.['8']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                />
                <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(textsInputs['8'], ex6Key?.['8']) : null} isTeacherReview={isTeacherReview} />{' '}
                from different countries. Sally and Tim{' '}
                <input
                  type="text"
                  value={textsInputs['9'] || ''}
                  onChange={(e) => onTextsChange('9', e.target.value)}
                  placeholder="9"
                  disabled={readOnly}
                  className={`${styles.gapInput} ${isTeacherReview ? (verifyAnswer(textsInputs['9'], ex6Key?.['9']).status === 'correct' ? styles.inputValid : verifyAnswer(textsInputs['9'], ex6Key?.['9']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                />
                <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(textsInputs['9'], ex6Key?.['9']) : null} isTeacherReview={isTeacherReview} />{' '}
                British. Hana and Kaito{' '}
                <input
                  type="text"
                  value={textsInputs['10'] || ''}
                  onChange={(e) => onTextsChange('10', e.target.value)}
                  placeholder="10"
                  disabled={readOnly}
                  className={`${styles.gapInput} ${isTeacherReview ? (verifyAnswer(textsInputs['10'], ex6Key?.['10']).status === 'correct' ? styles.inputValid : verifyAnswer(textsInputs['10'], ex6Key?.['10']).status === 'incorrect' ? styles.inputInvalid : '') : ''}`}
                />
                <TeacherAnswerBadge result={isTeacherReview ? verifyAnswer(textsInputs['10'], ex6Key?.['10']) : null} isTeacherReview={isTeacherReview} />{' '}
                Japanese.
              </div>
            </div>
          </div>

          {/* Right Column: Speaking & Questions (7a, 7b, 8, 9) */}
          <div className={styles.column}>
            <h2 className={styles.sectionHeading}>Speaking & Questions</h2>

            {/* Exercise 7a: Make questions */}
            <div className={styles.exerciseBlock}>
              <p className={styles.exerciseTitle}>
                <span className={styles.exNum}>7</span>
                <span className={styles.exSub}>a</span>
                <span>Make questions using the prompts.</span>
              </p>

              <div className={styles.questionsList}>
                <div className={styles.questionItem}>
                  <span className={styles.promptText}>1. you and your friends / at university?</span>
                  <span className={styles.exampleText}>Example: Are you and your friends at university?</span>
                </div>

                {[
                  { id: '2', prompt: '2. the teachers at your school / American?' },
                  { id: '3', prompt: '3. your classmates / from different countries?' },
                  { id: '4', prompt: '4. where / you and your classmates / now?' },
                  { id: '5', prompt: '5. who / your teachers?' },
                  { id: '6', prompt: '6. where / your teachers / from?' },
                ].map((q) => {
                  const currentVal = questionsInputs[q.id] || '';
                  const vRes = isTeacherReview ? verifyAnswer(currentVal, ex7aKey?.[q.id]) : null;
                  const validClass = vRes?.status === 'correct' ? styles.inputValid : vRes?.status === 'incorrect' ? styles.inputInvalid : '';

                  return (
                    <div key={q.id} className={styles.questionItem}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label htmlFor={`q7a_${q.id}`} className={styles.promptText}>{q.prompt}</label>
                        <TeacherAnswerBadge result={vRes} isTeacherReview={isTeacherReview} />
                      </div>
                      <input
                        id={`q7a_${q.id}`}
                        type="text"
                        value={currentVal}
                        onChange={(e) => onQuestionsChange(q.id, e.target.value)}
                        placeholder="Write your question..."
                        disabled={readOnly}
                        className={`${styles.questionInput} ${validClass}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exercise 8: Speaking & Notes */}
            <div className={styles.exerciseBlock}>
              <span className={styles.ribbon}>PREPARE</span>
              <p className={styles.exerciseTitle} style={{ marginTop: '0.5rem' }}>
                <span className={styles.exNum}>8</span>
                <span className={styles.exSub}>b</span>
                <span>Make notes about the people in your photo (names, nationalities, jobs).</span>
              </p>
              <p className={styles.exampleText}>Example: photo 2: Monika, the UK, student</p>

              <div className={styles.photosGrid} style={{ gridTemplateColumns: '1fr 1fr', margin: '0.5rem 0' }}>
                <div className={styles.photoCard}>
                  <Image
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80"
                    alt="Speaking Photo 1"
                    fill
                    sizes="(max-width: 768px) 50vw, 200px"
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  <div className={styles.photoBadge} style={{ bottom: 0, left: 0 }}>1</div>
                </div>
                <div className={styles.photoCard}>
                  <Image
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80"
                    alt="Speaking Photo 2"
                    fill
                    sizes="(max-width: 768px) 50vw, 200px"
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                  <div className={styles.photoBadge} style={{ bottom: 0, left: 0 }}>2</div>
                </div>
              </div>

              <textarea
                value={speakingNotes}
                onChange={(e) => onSpeakingNotesChange(e.target.value)}
                placeholder="Write your notes here..."
                disabled={readOnly}
                className={styles.notesTextarea}
                rows={3}
              />
            </div>

            {/* Exercise 9: Discussion */}
            <div className={styles.exerciseBlock}>
              <span className={styles.ribbon}>SPEAK</span>
              <p className={styles.exerciseTitle} style={{ marginTop: '0.5rem' }}>
                <span className={styles.exNum}>9</span>
                <span>Ask and answer questions about the people in the photographs.</span>
              </p>
              <div className={styles.exampleText} style={{ lineHeight: '1.6' }}>
                <p><strong>A:</strong> Who are they?</p>
                <p><strong>B:</strong> They&apos;re my friends.</p>
                <p><strong>A:</strong> Who is she?</p>
                <p><strong>B:</strong> She&apos;s Monika.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
