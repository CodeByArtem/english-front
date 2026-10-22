'use client';

import React from 'react';
import { useLessonContext, useExerciseAnswer } from '@/context/LessonContext';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import PronounceButton from '@/components/PronounceButton';
import styles from './lesson3b.module.scss';

export interface Lesson3BContentProps {
  playAudio?: (url: string) => void;
  playingAudio?: string | null;
}

export default function Lesson3BContent({ playAudio, playingAudio }: Lesson3BContentProps) {
  const { isReadOnly } = useLessonContext();

  const ex1 = useExerciseAnswer<Record<string, string>>('exercise_1_rooms', {});
  const ex2 = useExerciseAnswer<Record<string, string>>('exercise_2_furniture', {});
  const ex3 = useExerciseAnswer<Record<string, string>>('exercise_3_questions', {});
  const ex4 = useExerciseAnswer<Record<string, string>>('exercise_4_description', {});

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
            <div className={styles.badge3B}>
              <span className={styles.num3}>3</span>
              <span className={styles.letterB}>B</span>
            </div>
            <div className={styles.titleArea}>
              <h2 className={styles.titleHeading}>Flat to rent</h2>
              <p className={styles.goalText}>Goal: Talk about a flat and rooms in a home</p>
            </div>
          </div>
        </div>

        <div className={styles.contentBody}>
          {/* Grammar box */}
          <div className={styles.grammarReference}>
            <h4>Grammar: Is there a...? / Are there any...?</h4>
            <ul>
              <li><strong>Singular:</strong> <em>Is there a shower?</em> → <em>Yes, there is. / No, there isn&apos;t.</em></li>
              <li><strong>Plural:</strong> <em>Are there any chairs?</em> → <em>Yes, there are. / No, there aren&apos;t.</em></li>
            </ul>
          </div>

          {/* Exercise 1: Rooms */}
          <div className={styles.exerciseBlock}>
            <div className={styles.exerciseHeader}>
              <span className={styles.exNumber}>1</span>
              <span className={styles.instruction}>Vocabulary: Label the rooms in the flat.</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>
                Listen with Milo:
              </span>
              <PronounceButton word="living room" label="living room" />
              <PronounceButton word="bedroom" label="bedroom" />
              <PronounceButton word="kitchen" label="kitchen" />
              <PronounceButton word="bathroom" label="bathroom" />
              <PronounceButton word="balcony" label="balcony" />
            </div>

            <div className={styles.roomsGrid}>
              {/* Example */}
              <div className={styles.exampleCard}>
                <span className={styles.exampleBadge}>Example</span>
                <span className={styles.exampleText}>
                  Living room <PronounceButton word="Living room" />
                </span>
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>1. Place where you sleep:</label>
                <input
                  type="text"
                  placeholder="Type room name..."
                  value={ex1.value['1'] || ''}
                  onChange={(e) => ex1.setField('1', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex1.getFieldVerification('1')?.status)}
                />
                {ex1.isReview && <TeacherAnswerBadge result={ex1.getFieldVerification('1')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>2. Room where you cook food:</label>
                <input
                  type="text"
                  placeholder="Type room name..."
                  value={ex1.value['2'] || ''}
                  onChange={(e) => ex1.setField('2', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex1.getFieldVerification('2')?.status)}
                />
                {ex1.isReview && <TeacherAnswerBadge result={ex1.getFieldVerification('2')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>3. Room with a shower or bath:</label>
                <input
                  type="text"
                  placeholder="Type room name..."
                  value={ex1.value['3'] || ''}
                  onChange={(e) => ex1.setField('3', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex1.getFieldVerification('3')?.status)}
                />
                {ex1.isReview && <TeacherAnswerBadge result={ex1.getFieldVerification('3')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>4. Outside platform on an upper floor:</label>
                <input
                  type="text"
                  placeholder="Type room name..."
                  value={ex1.value['4'] || ''}
                  onChange={(e) => ex1.setField('4', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex1.getFieldVerification('4')?.status)}
                />
                {ex1.isReview && <TeacherAnswerBadge result={ex1.getFieldVerification('4')} />}
              </div>
            </div>
          </div>

          {/* Exercise 2: Furniture */}
          <div className={styles.exerciseBlock}>
            <div className={styles.exerciseHeader}>
              <span className={styles.exNumber}>2</span>
              <span className={styles.instruction}>Things in a home: Write the correct furniture word.</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>
                Listen with Milo:
              </span>
              <PronounceButton word="bed" label="bed" />
              <PronounceButton word="sofa" label="sofa" />
              <PronounceButton word="fridge" label="fridge" />
              <PronounceButton word="shower" label="shower" />
              <PronounceButton word="table" label="table" />
              <PronounceButton word="cooker" label="cooker" />
            </div>

            <div className={styles.roomsGrid}>
              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>1. You sleep on it:</label>
                <input
                  type="text"
                  placeholder="e.g. bed"
                  value={ex2.value['1'] || ''}
                  onChange={(e) => ex2.setField('1', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex2.getFieldVerification('1')?.status)}
                />
                {ex2.isReview && <TeacherAnswerBadge result={ex2.getFieldVerification('1')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>2. Soft seat for two or three people:</label>
                <input
                  type="text"
                  placeholder="e.g. sofa"
                  value={ex2.value['2'] || ''}
                  onChange={(e) => ex2.setField('2', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex2.getFieldVerification('2')?.status)}
                />
                {ex2.isReview && <TeacherAnswerBadge result={ex2.getFieldVerification('2')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>3. Keeps food cold and fresh:</label>
                <input
                  type="text"
                  placeholder="e.g. fridge"
                  value={ex2.value['3'] || ''}
                  onChange={(e) => ex2.setField('3', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex2.getFieldVerification('3')?.status)}
                />
                {ex2.isReview && <TeacherAnswerBadge result={ex2.getFieldVerification('3')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>4. Wash yourself standing under water:</label>
                <input
                  type="text"
                  placeholder="e.g. shower"
                  value={ex2.value['4'] || ''}
                  onChange={(e) => ex2.setField('4', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex2.getFieldVerification('4')?.status)}
                />
                {ex2.isReview && <TeacherAnswerBadge result={ex2.getFieldVerification('4')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>5. Furniture with flat top and legs:</label>
                <input
                  type="text"
                  placeholder="e.g. table"
                  value={ex2.value['5'] || ''}
                  onChange={(e) => ex2.setField('5', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex2.getFieldVerification('5')?.status)}
                />
                {ex2.isReview && <TeacherAnswerBadge result={ex2.getFieldVerification('5')} />}
              </div>

              <div className={styles.itemCard}>
                <label className={styles.itemLabel}>6. Used for cooking hot food:</label>
                <input
                  type="text"
                  placeholder="e.g. cooker"
                  value={ex2.value['6'] || ''}
                  onChange={(e) => ex2.setField('6', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex2.getFieldVerification('6')?.status)}
                />
                {ex2.isReview && <TeacherAnswerBadge result={ex2.getFieldVerification('6')} />}
              </div>
            </div>
          </div>

          {/* Exercise 3: Questions & Short Answers */}
          <div className={styles.exerciseBlock}>
            <div className={styles.exerciseHeader}>
              <span className={styles.exNumber}>3</span>
              <span className={styles.instruction}>
                Grammar: Complete questions and short answers with <em>Is there a</em>, <em>Are there any</em>, <em>Yes, there is</em>, <em>No, there aren&apos;t</em>.
              </span>
            </div>

            {playAudio && (
              <div>
                <button
                  type="button"
                  className={styles.audioBtn}
                  onClick={() => playAudio('3.4')}
                >
                  {playingAudio === '3.4' || playingAudio === '/audio/3.4.mp3' ? '⏸ Playing' : '▶ Audio 3.4'}
                </button>
              </div>
            )}

            <div className={styles.questionsList}>
              {/* Example */}
              <div className={styles.exampleCard}>
                <span className={styles.exampleBadge}>Example</span>
                <span className={styles.exampleText}>
                  A: <strong>Is there a</strong> garden? — B: Yes, there is.{' '}
                  <PronounceButton word="Is there a garden? Yes, there is." label="Listen" />
                </span>
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>1.</span>
                <span>A:</span>
                <input
                  type="text"
                  placeholder="Is there a / Are there any"
                  value={ex3.value['1'] || ''}
                  onChange={(e) => ex3.setField('1', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex3.getFieldVerification('1')?.status)}
                />
                <span>balcony in the flat?</span>
                {ex3.isReview && <TeacherAnswerBadge result={ex3.getFieldVerification('1')} />}
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>2.</span>
                <span>B:</span>
                <input
                  type="text"
                  placeholder="Short answer (+)"
                  value={ex3.value['2'] || ''}
                  onChange={(e) => ex3.setField('2', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex3.getFieldVerification('2')?.status)}
                />
                <span>. It has a great view.</span>
                {ex3.isReview && <TeacherAnswerBadge result={ex3.getFieldVerification('2')} />}
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>3.</span>
                <span>A:</span>
                <input
                  type="text"
                  placeholder="Is there a / Are there any"
                  value={ex3.value['3'] || ''}
                  onChange={(e) => ex3.setField('3', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex3.getFieldVerification('3')?.status)}
                />
                <span>plants in the living room?</span>
                {ex3.isReview && <TeacherAnswerBadge result={ex3.getFieldVerification('3')} />}
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>4.</span>
                <span>B:</span>
                <input
                  type="text"
                  placeholder="Short answer (-)"
                  value={ex3.value['4'] || ''}
                  onChange={(e) => ex3.setField('4', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex3.getFieldVerification('4')?.status)}
                />
                <span>, but you can buy some.</span>
                {ex3.isReview && <TeacherAnswerBadge result={ex3.getFieldVerification('4')} />}
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>5.</span>
                <span>A:</span>
                <input
                  type="text"
                  placeholder="Is there a / Are there any"
                  value={ex3.value['5'] || ''}
                  onChange={(e) => ex3.setField('5', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex3.getFieldVerification('5')?.status)}
                />
                <span>lift in the building?</span>
                {ex3.isReview && <TeacherAnswerBadge result={ex3.getFieldVerification('5')} />}
              </div>

              <div className={styles.questionItem}>
                <span className={styles.qNum}>6.</span>
                <span>B:</span>
                <input
                  type="text"
                  placeholder="Short answer (-)"
                  value={ex3.value['6'] || ''}
                  onChange={(e) => ex3.setField('6', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex3.getFieldVerification('6')?.status)}
                />
                <span>. It is on the first floor.</span>
                {ex3.isReview && <TeacherAnswerBadge result={ex3.getFieldVerification('6')} />}
              </div>
            </div>
          </div>

          {/* Exercise 4: Description Adjectives */}
          <div className={styles.exerciseBlock}>
            <div className={styles.exerciseHeader}>
              <span className={styles.exNumber}>4</span>
              <span className={styles.instruction}>
                Complete the flat description with adjectives: <em>modern</em>, <em>big</em>, <em>quiet</em>, <em>comfortable</em>.
              </span>
            </div>

            <div className={styles.questionsList}>
              <div className={styles.questionItem}>
                <span>1. The kitchen is very new and</span>
                <input
                  type="text"
                  placeholder="adjective"
                  value={ex4.value['1'] || ''}
                  onChange={(e) => ex4.setField('1', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex4.getFieldVerification('1')?.status)}
                />
                <span>with new appliances.</span>
                {ex4.isReview && <TeacherAnswerBadge result={ex4.getFieldVerification('1')} />}
              </div>

              <div className={styles.questionItem}>
                <span>2. There is a</span>
                <input
                  type="text"
                  placeholder="adjective"
                  value={ex4.value['2'] || ''}
                  onChange={(e) => ex4.setField('2', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex4.getFieldVerification('2')?.status)}
                />
                <span>living room with plenty of space.</span>
                {ex4.isReview && <TeacherAnswerBadge result={ex4.getFieldVerification('2')} />}
              </div>

              <div className={styles.questionItem}>
                <span>3. The street is not noisy, it is very</span>
                <input
                  type="text"
                  placeholder="adjective"
                  value={ex4.value['3'] || ''}
                  onChange={(e) => ex4.setField('3', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex4.getFieldVerification('3')?.status)}
                />
                <span>at night.</span>
                {ex4.isReview && <TeacherAnswerBadge result={ex4.getFieldVerification('3')} />}
              </div>

              <div className={styles.questionItem}>
                <span>4. The sofa and chairs are soft and</span>
                <input
                  type="text"
                  placeholder="adjective"
                  value={ex4.value['4'] || ''}
                  onChange={(e) => ex4.setField('4', e.target.value)}
                  disabled={isReadOnly}
                  className={getInputClass(ex4.getFieldVerification('4')?.status)}
                />
                <span>to sit on.</span>
                {ex4.isReview && <TeacherAnswerBadge result={ex4.getFieldVerification('4')} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
