'use client';

import React from 'react';
import { useLessonContext, useExerciseAnswer } from '@/context/LessonContext';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import PronounceButton from '@/components/PronounceButton';
import styles from './lesson4a.module.scss';

export interface Lesson4AContentProps {
  playAudio?: (url: string) => void;
  playingAudio?: string | null;
}

export default function Lesson4AContent({ playAudio, playingAudio }: Lesson4AContentProps) {
  const { isReadOnly } = useLessonContext();

  const ex1 = useExerciseAnswer<Record<string, string>>('exercise_1_appearance', {});
  const ex2 = useExerciseAnswer<Record<string, string>>('exercise_2_have_got', {});
  const ex3 = useExerciseAnswer<Record<string, string>>('exercise_3_reading', {});
  const ex4 = useExerciseAnswer<Record<string, string>>('exercise_4_descriptions', {});

  const getInputClass = (status?: string) => {
    if (status === 'correct') return `${styles.textInput} ${styles.inputValid}`;
    if (status === 'incorrect') return `${styles.textInput} ${styles.inputInvalid}`;
    return styles.textInput;
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.textbookPage}>
        {/* Header */}
        <div className={styles.headerBanner}>
          <div className={styles.headerContent}>
            <div className={styles.badge4A}>
              <span className={styles.num4}>4</span>
              <span className={styles.letterA}>A</span>
            </div>
            <div className={styles.titleArea}>
              <h2 className={styles.titleHeading}>You&apos;ve got a friend</h2>
              <p className={styles.goalText}>Goal: Describe people, appearance and friends</p>
            </div>
          </div>
        </div>

        <div className={styles.contentBody}>
          {/* Grammar box */}
          <div className={styles.grammarReference}>
            <h4>Grammar: have / has got</h4>
            <ul>
              <li><strong>I / You / We / They:</strong> <em>&apos;ve got (have got)</em> / <em>haven&apos;t got</em></li>
              <li><strong>He / She / It:</strong> <em>&apos;s got (has got)</em> / <em>hasn&apos;t got</em></li>
            </ul>
          </div>

          {/* Exercise 1: Appearance Vocabulary */}
          <div className={styles.exerciseBlock}>
            <div className={styles.exerciseHeader}>
              <span className={styles.exNumber}>1</span>
              <span className={styles.instruction}>Vocabulary: Match the opposite or correct appearance word.</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>
                Listen with Milo:
              </span>
              <PronounceButton word="tall" label="tall" />
              <PronounceButton word="short" label="short" />
              <PronounceButton word="long hair" label="long hair" />
              <PronounceButton word="short hair" label="short hair" />
              <PronounceButton word="dark hair" label="dark hair" />
              <PronounceButton word="fair hair" label="fair hair" />
              <PronounceButton word="glasses" label="glasses" />
              <PronounceButton word="beard" label="beard" />
            </div>

            <div className={styles.grid2Col}>
              {/* Example */}
              <div className={styles.exampleCard}>
                <span className={styles.exampleBadge}>Example</span>
                <span className={styles.exampleText}>
                  Eyes: blue eyes <PronounceButton word="blue eyes" />
                </span>
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>1. Opposite of short (height):</label>
                <input
                  type="text"
                  placeholder="e.g. tall"
                  value={ex1.value['1'] || ''}
                  onChange={(e) => ex1.setField('1', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex1.getFieldVerification('1')?.status)}
                />
                {ex1.isReview && <TeacherAnswerBadge result={ex1.getFieldVerification('1')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>2. Opposite of tall:</label>
                <input
                  type="text"
                  placeholder="e.g. short"
                  value={ex1.value['2'] || ''}
                  onChange={(e) => ex1.setField('2', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex1.getFieldVerification('2')?.status)}
                />
                {ex1.isReview && <TeacherAnswerBadge result={ex1.getFieldVerification('2')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>3. Hair that reaches past the shoulders:</label>
                <input
                  type="text"
                  placeholder="e.g. long hair"
                  value={ex1.value['3'] || ''}
                  onChange={(e) => ex1.setField('3', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex1.getFieldVerification('3')?.status)}
                />
                {ex1.isReview && <TeacherAnswerBadge result={ex1.getFieldVerification('3')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>4. Hair that does not reach the shoulders:</label>
                <input
                  type="text"
                  placeholder="e.g. short hair"
                  value={ex1.value['4'] || ''}
                  onChange={(e) => ex1.setField('4', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex1.getFieldVerification('4')?.status)}
                />
                {ex1.isReview && <TeacherAnswerBadge result={ex1.getFieldVerification('4')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>5. Black or brown hair color:</label>
                <input
                  type="text"
                  placeholder="e.g. dark hair"
                  value={ex1.value['5'] || ''}
                  onChange={(e) => ex1.setField('5', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex1.getFieldVerification('5')?.status)}
                />
                {ex1.isReview && <TeacherAnswerBadge result={ex1.getFieldVerification('5')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>6. Blonde or light hair color:</label>
                <input
                  type="text"
                  placeholder="e.g. fair hair"
                  value={ex1.value['6'] || ''}
                  onChange={(e) => ex1.setField('6', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex1.getFieldVerification('6')?.status)}
                />
                {ex1.isReview && <TeacherAnswerBadge result={ex1.getFieldVerification('6')} />}
              </div>
            </div>
          </div>

          {/* Exercise 2: Grammar have got */}
          <div className={styles.exerciseBlock}>
            <div className={styles.exerciseHeader}>
              <span className={styles.exNumber}>2</span>
              <span className={styles.instruction}>
                Grammar: Complete sentences with <em>&apos;ve got / have got</em>, <em>&apos;s got / has got</em>, <em>haven&apos;t got</em>, or <em>hasn&apos;t got</em>.
              </span>
            </div>

            {playAudio && (
              <div>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => playAudio('4.1')}
                >
                  {playingAudio === '4.1' || playingAudio === '/audio/4.1.mp3' ? '⏸ Playing' : '▶ Audio 4.1'}
                </button>
              </div>
            )}

            <div className={styles.questionsList}>
              <div className={styles.exampleCard}>
                <span className={styles.exampleBadge}>Example</span>
                <span className={styles.exampleText}>
                  My sister <strong>has got</strong> brown eyes.
                </span>
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>1.</span>
                <span>My brother</span>
                <input
                  type="text"
                  placeholder="'s got / has got"
                  value={ex2.value['1'] || ''}
                  onChange={(e) => ex2.setField('1', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex2.getFieldVerification('1')?.status)}
                />
                <span>short dark hair (+).</span>
                {ex2.isReview && <TeacherAnswerBadge result={ex2.getFieldVerification('1')} />}
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>2.</span>
                <span>They</span>
                <input
                  type="text"
                  placeholder="'ve got / have got"
                  value={ex2.value['2'] || ''}
                  onChange={(e) => ex2.setField('2', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex2.getFieldVerification('2')?.status)}
                />
                <span>a big family with four children (+).</span>
                {ex2.isReview && <TeacherAnswerBadge result={ex2.getFieldVerification('2')} />}
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>3.</span>
                <span>She</span>
                <input
                  type="text"
                  placeholder="hasn't got"
                  value={ex2.value['3'] || ''}
                  onChange={(e) => ex2.setField('3', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex2.getFieldVerification('3')?.status)}
                />
                <span>glasses, but she wears contact lenses (-).</span>
                {ex2.isReview && <TeacherAnswerBadge result={ex2.getFieldVerification('3')} />}
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>4.</span>
                <span>We</span>
                <input
                  type="text"
                  placeholder="haven't got"
                  value={ex2.value['4'] || ''}
                  onChange={(e) => ex2.setField('4', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex2.getFieldVerification('4')?.status)}
                />
                <span>a car, so we walk everywhere (-).</span>
                {ex2.isReview && <TeacherAnswerBadge result={ex2.getFieldVerification('4')} />}
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>5.</span>
                <span>I</span>
                <input
                  type="text"
                  placeholder="'ve got / have got"
                  value={ex2.value['5'] || ''}
                  onChange={(e) => ex2.setField('5', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex2.getFieldVerification('5')?.status)}
                />
                <span>two best friends from university (+).</span>
                {ex2.isReview && <TeacherAnswerBadge result={ex2.getFieldVerification('5')} />}
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>6.</span>
                <span>He</span>
                <input
                  type="text"
                  placeholder="'s got / has got"
                  value={ex2.value['6'] || ''}
                  onChange={(e) => ex2.setField('6', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex2.getFieldVerification('6')?.status)}
                />
                <span>a beard and moustache (+).</span>
                {ex2.isReview && <TeacherAnswerBadge result={ex2.getFieldVerification('6')} />}
              </div>
            </div>
          </div>

          {/* Exercise 3: Reading */}
          <div className={styles.exerciseBlock}>
            <div className={styles.exerciseHeader}>
              <span className={styles.exNumber}>3</span>
              <span className={styles.instruction}>Reading: Read the profiles and identify the person.</span>
            </div>

            <div className={styles.profilesList}>
              <div className={styles.profileCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <h5 style={{ margin: 0 }}>Sophie</h5>
                  <PronounceButton word="Sophie is 24. She is tall with long fair hair and green eyes." label="Listen" />
                </div>
                <p>Sophie is 24. She is tall with long fair hair and green eyes. She hasn&apos;t got glasses.</p>
              </div>
              <div className={styles.profileCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <h5 style={{ margin: 0 }}>Leo</h5>
                  <PronounceButton word="Leo is 28. He is short with short dark hair and a beard." label="Listen" />
                </div>
                <p>Leo is 28. He is short with short dark hair and a beard. He&apos;s got glasses.</p>
              </div>
              <div className={styles.profileCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <h5 style={{ margin: 0 }}>Marco</h5>
                  <PronounceButton word="Marco is 26. He is tall with short brown hair and brown eyes." label="Listen" />
                </div>
                <p>Marco is 26. He is tall with short brown hair and brown eyes. He hasn&apos;t got a beard.</p>
              </div>
            </div>

            <div className={styles.questionsList}>
              <div className={styles.questionItem}>
                <span className={styles.qNum}>1.</span>
                <span>Who has got long fair hair and green eyes?</span>
                <input
                  type="text"
                  placeholder="Name"
                  value={ex3.value['1'] || ''}
                  onChange={(e) => ex3.setField('1', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex3.getFieldVerification('1')?.status)}
                />
                {ex3.isReview && <TeacherAnswerBadge result={ex3.getFieldVerification('1')} />}
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>2.</span>
                <span>Who is short and has got glasses and a beard?</span>
                <input
                  type="text"
                  placeholder="Name"
                  value={ex3.value['2'] || ''}
                  onChange={(e) => ex3.setField('2', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex3.getFieldVerification('2')?.status)}
                />
                {ex3.isReview && <TeacherAnswerBadge result={ex3.getFieldVerification('2')} />}
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>3.</span>
                <span>Who is tall with short brown hair and brown eyes?</span>
                <input
                  type="text"
                  placeholder="Name"
                  value={ex3.value['3'] || ''}
                  onChange={(e) => ex3.setField('3', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex3.getFieldVerification('3')?.status)}
                />
                {ex3.isReview && <TeacherAnswerBadge result={ex3.getFieldVerification('3')} />}
              </div>
            </div>
          </div>

          {/* Exercise 4: Descriptions */}
          <div className={styles.exerciseBlock}>
            <div className={styles.exerciseHeader}>
              <span className={styles.exNumber}>4</span>
              <span className={styles.instruction}>Complete the text about your friend.</span>
            </div>

            <div className={styles.questionsList}>
              <div className={styles.questionItem}>
                <span>1. My friend Anna</span>
                <input
                  type="text"
                  placeholder="'s got / has got"
                  value={ex4.value['1'] || ''}
                  onChange={(e) => ex4.setField('1', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex4.getFieldVerification('1')?.status)}
                />
                <span>short dark hair.</span>
                {ex4.isReview && <TeacherAnswerBadge result={ex4.getFieldVerification('1')} />}
              </div>

              <div className={styles.questionItem}>
                <span>2. She has got</span>
                <input
                  type="text"
                  placeholder="color"
                  value={ex4.value['2'] || ''}
                  onChange={(e) => ex4.setField('2', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex4.getFieldVerification('2')?.status)}
                />
                <span>eyes like the sea.</span>
                {ex4.isReview && <TeacherAnswerBadge result={ex4.getFieldVerification('2')} />}
              </div>

              <div className={styles.questionItem}>
                <span>3. She</span>
                <input
                  type="text"
                  placeholder="hasn't got"
                  value={ex4.value['3'] || ''}
                  onChange={(e) => ex4.setField('3', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex4.getFieldVerification('3')?.status)}
                />
                <span>a dog (-), but she loves animals.</span>
                {ex4.isReview && <TeacherAnswerBadge result={ex4.getFieldVerification('3')} />}
              </div>

              <div className={styles.questionItem}>
                <span>4. She wears</span>
                <input
                  type="text"
                  placeholder="item"
                  value={ex4.value['4'] || ''}
                  onChange={(e) => ex4.setField('4', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex4.getFieldVerification('4')?.status)}
                />
                <span>when she reads books.</span>
                {ex4.isReview && <TeacherAnswerBadge result={ex4.getFieldVerification('4')} />}
              </div>

              <div className={styles.questionItem}>
                <span>5. We</span>
                <input
                  type="text"
                  placeholder="'ve got / have got"
                  value={ex4.value['5'] || ''}
                  onChange={(e) => ex4.setField('5', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex4.getFieldVerification('5')?.status)}
                />
                <span>a lot of fun together.</span>
                {ex4.isReview && <TeacherAnswerBadge result={ex4.getFieldVerification('5')} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
