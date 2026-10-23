'use client';

import React from 'react';
import Image from 'next/image';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import PronounceButton from '@/components/PronounceButton';
import { verifyAnswer, getExerciseKey, LessonAnswerKey } from '@/lib/answerVerification';
import styles from './lesson2a.module.scss';

export interface Lesson2AContentProps {
  lesson?: Record<string, unknown> | null;
  user?: Record<string, unknown> | null;
  readOnly?: boolean;
  isTeacherReview?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio: (track: string) => void;
  playingAudio: string | null;

  // Exercise states
  ex1FamilyTree?: Record<string, string>;
  ex2aTable?: Record<string, string>;
  ex3Sentences?: Record<string, string>;
  ex4aMatch?: Record<string, string>;
  ex4bListening?: Record<string, string>;
  ex5Grammar?: Record<string, string>;
  ex6Pronunciation?: Record<string, string>;
  ex7Dialogue?: Record<string, string>;
  ex8Notes?: string;

  // Handlers
  onEx1FamilyTreeChange?: (member: string, value: string) => void;
  onEx2aTableChange?: (id: string, value: string) => void;
  onEx3SentencesChange?: (id: string, value: string) => void;
  onEx4aMatchChange?: (speaker: string, value: string) => void;
  onEx4bListeningChange?: (id: string, value: string) => void;
  onEx5GrammarChange?: (id: string, value: string) => void;
  onEx6PronunciationChange?: (id: string, value: string) => void;
  onEx7DialogueChange?: (id: string, value: string) => void;
  onEx8NotesChange?: (value: string) => void;

  originalAnswers?: {
    exercise_1_family_tree?: Record<string, string>;
    exercise_2a_table?: Record<string, string>;
    exercise_3_sentences?: Record<string, string>;
    exercise_4a_match?: Record<string, string>;
    exercise_4b_listening?: Record<string, string>;
    exercise_5_grammar?: Record<string, string>;
    exercise_6_pronunciation?: Record<string, string>;
    exercise_7_dialogue?: Record<string, string>;
    exercise_8_notes?: string;
    [key: string]: unknown;
  };
}

// Inline Avatar Helpers
const AvatarMale = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="#78c6d0" />
    <path d="M12 55 C14 44, 24 42, 32 42 C40 42, 50 44, 52 55 A30 30 0 0 1 12 55 Z" fill="#1e3a5f" />
    <polygon points="26,42 38,42 32,51" fill="#ffffff" />
    <path d="M27 36 L27 43 L32 47 L37 43 L37 36 Z" fill="#f3d1b0" />
    <path d="M22 22 C22 14, 42 14, 42 22 L41 33 C41 38, 36 41, 32 41 C28 41, 23 38, 23 33 Z" fill="#f7d7b5" />
    <path d="M21 24 C20 15, 25 12, 32 12 C39 12, 44 15, 43 24 C42 20, 39 17, 32 17 C25 17, 22 20, 21 24 Z" fill="#5a4638" />
  </svg>
);

const AvatarFemale = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="#f18999" />
    <path d="M19 22 C17 34, 18 43, 21 46 L43 46 C46 43, 47 34, 45 22 Z" fill="#8c583a" />
    <path d="M13 56 C16 45, 24 43, 32 43 C40 43, 48 45, 51 56 A30 30 0 0 1 13 56 Z" fill="#463730" />
    <path d="M28 36 L28 44 L32 48 L36 44 L36 36 Z" fill="#f7d7b5" />
    <path d="M23 23 C23 15, 41 15, 41 23 L40 33 C40 38, 36 41, 32 41 C28 41, 24 38, 24 33 Z" fill="#f9dcc0" />
    <path d="M21 26 C21 15, 26 12, 32 12 C38 12, 43 15, 43 26 C40 21, 35 19, 29 19 C25 19, 23 22, 21 26 Z" fill="#a06543" />
  </svg>
);

const IconHeart = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <path d="M16 28.5 C16 28.5 3.5 20.2 3.5 11.2 C3.5 6.8 7 3.5 11.2 3.5 C13.7 3.5 15.2 4.8 16 6.2 C16.8 4.8 18.3 3.5 20.8 3.5 C25 3.5 28.5 6.8 28.5 11.2 C28.5 20.2 16 28.5 16 28.5 Z" fill="#e6007e" />
  </svg>
);

export default function Lesson2AContent(props: Lesson2AContentProps) {
  const {
    readOnly = false,
    isTeacherReview = false,
    answerKey = null,
    playAudio,
    playingAudio,

    // States
    ex1FamilyTree = {},
    ex2aTable = {},
    ex3Sentences = {},
    ex4aMatch = {},
    ex4bListening = {},
    ex5Grammar = {},
    ex6Pronunciation = {},
    ex7Dialogue = {},
    ex8Notes = '',

    // Handlers
    onEx1FamilyTreeChange = () => {},
    onEx2aTableChange = () => {},
    onEx3SentencesChange = () => {},
    onEx4aMatchChange = () => {},
    onEx4bListeningChange = () => {},
    onEx5GrammarChange = () => {},
    onEx6PronunciationChange = () => {},
    onEx7DialogueChange = () => {},
    onEx8NotesChange = () => {},

    originalAnswers,
  } = props;

  const isReview = Boolean(isTeacherReview || (answerKey && readOnly));

  const ex1Key = getExerciseKey(answerKey, 'exercise_1_family_tree');
  const ex2aKey = getExerciseKey(answerKey, 'exercise_2a_table');
  const ex3Key = getExerciseKey(answerKey, 'exercise_3_sentences');
  const ex4bKey = getExerciseKey(answerKey, 'exercise_4b_listening');
  const ex5Key = getExerciseKey(answerKey, 'exercise_5_grammar');
  const ex6Key = getExerciseKey(answerKey, 'exercise_6_pronunciation');
  const ex7Key = getExerciseKey(answerKey, 'exercise_7_dialogue');

  const origTree = originalAnswers?.exercise_1_family_tree;
  const origTable = originalAnswers?.exercise_2a_table;
  const origSentences = originalAnswers?.exercise_3_sentences;
  const origListening = originalAnswers?.exercise_4b_listening;
  const origGrammar = originalAnswers?.exercise_5_grammar;
  const origDialogue = originalAnswers?.exercise_7_dialogue;

  return (
    <div className={styles.pageContainer}>
      {/* ========================================================================= */}
      {/* ===================== PAGE 14: 2A FAMILIES (VOCABULARY) ================ */}
      {/* ========================================================================= */}
      <section className={styles.textbookPage}>
        {/* Top Header Banner */}
        <header className={styles.headerBanner14}>
          <div className={styles.chevronWrap2A}>
            <div className={styles.chevronRed2A}></div>
            <div className={styles.badgeContent2A}>
              <span className={styles.num2}>2</span>
              <span className={styles.letterA}>A</span>
            </div>
          </div>
          <h1 className={styles.titleHeading14}>Families</h1>
        </header>

        {/* Goals & Photos Grid */}
        <div className={styles.topGrid14}>
          <div className={styles.topInfoCol}>
            {/* Goals Box */}
            <div className={styles.goalsBox14}>
              <p><strong>Goal:</strong> talk about your family</p>
              <p><strong>Grammar:</strong> possessive <em>&apos;s</em>, <em>I/my, you/your,</em> etc.</p>
              <p><strong>Vocabulary:</strong> family</p>
            </div>

            {/* Vocabulary Titles */}
            <div>
              <h2 className={styles.sectionHeading}>Vocabulary</h2>
              <div className={styles.exerciseInstruction}>
                <span className={styles.exNum}>1</span>
                <span>Look at the photos and complete the family tree with the correct names.</span>
              </div>
              <div className={styles.exerciseInstruction} style={{ marginTop: '4px' }}>
                <span className={styles.exNum}>2</span>
                <span className={styles.exSub}>a</span>
                <span>Look at the family tree again and complete the table below.</span>
              </div>
            </div>
          </div>

          {/* Authentic 2x2 Photo (img_3.png: Luisa, Maria, Alonzo, José) */}
          <div className={styles.topPhotoCard}>
            <Image
              src="/images/lesson2a/img_3.png"
              alt="Luisa, Maria, Alonzo and José photos"
              width={331}
              height={372}
              className={styles.topPhotoImg}
              priority
            />
          </div>
        </div>

        {/* ================= FAMILY TREE (EXERCISE 1) ================= */}
        <div className={styles.treeWrapper}>
          <div className={styles.treeScrollHint}>↔ Scroll horizontally to view full family tree</div>
          <div className={styles.treeContainer}>
            {/* Generation 1: Umberto & Maria */}
            <div className={styles.treeRow}>
              {/* Umberto */}
              <div className={styles.treeMember}>
                <AvatarMale className={styles.avatarSvg} />
                <p><strong>Umberto:</strong> my father/dad,<br />taxi driver</p>
              </div>

              {/* Heart connector */}
              <div className={styles.heartConnector}>
                <IconHeart className={styles.heartSvg} />
                <div className={styles.verticalStem}></div>
              </div>

              {/* Maria */}
              {(() => {
                const currentVal = ex1FamilyTree.maria || '';
                const origVal = origTree?.maria;
                const isChanged = origVal !== undefined && origVal !== currentVal;
                const vRes = isReview ? verifyAnswer(currentVal, ex1Key?.['maria']) : null;
                const validClass =
                  vRes?.status === 'correct'
                    ? styles.inputValid
                    : vRes?.status === 'incorrect'
                    ? styles.inputInvalid
                    : '';

                return (
                  <div className={styles.treeMember}>
                    <AvatarFemale className={styles.avatarSvg} />
                    <div className={styles.treeInputWrap}>
                      <div className={styles.treeInputRow}>
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => onEx1FamilyTreeChange('maria', e.target.value)}
                          disabled={readOnly}
                          placeholder="name..."
                          aria-label="Mother's name in family tree"
                          className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                          style={{ width: '70px', textAlign: 'center' }}
                        />
                        {vRes?.status === 'correct' && (
                          <span className={styles.correctBadge}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                          </span>
                        )}
                      </div>
                      <p>: my mother/mum,<br />office worker</p>
                      {vRes && vRes.status !== 'correct' && (
                        <div className={styles.treeFeedbackRow}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Branch connecting to Gen 2 */}
            <div className={styles.branchBar} style={{ width: '68%' }}>
              <div className={styles.hLine}></div>
              <div className={styles.leftLeg}></div>
              <div className={styles.rightLeg}></div>
            </div>

            {/* Generation 2: (Cristina & Rafael) and (José & Luisa) */}
            <div className={styles.gen2Grid}>
              {/* Couple 1: Cristina & Rafael */}
              <div className={styles.gen2Couple}>
                <div className={styles.treeRow} style={{ gap: '1rem' }}>
                  <div className={styles.treeMember} style={{ width: '110px' }}>
                    <AvatarFemale className={styles.avatarSvg} />
                    <p><strong>Cristina:</strong> me,<br />doctor</p>
                  </div>
                  <div className={styles.heartConnector}>
                    <IconHeart className={styles.heartSvg} />
                    <div className={styles.verticalStem}></div>
                  </div>
                  <div className={styles.treeMember} style={{ width: '110px' }}>
                    <AvatarMale className={styles.avatarSvg} />
                    <p><strong>Rafael:</strong> my husband,<br />school teacher</p>
                  </div>
                </div>

                {/* Branch down to Alonzo & Sierra */}
                <div className={styles.branchBar} style={{ width: '160px' }}>
                  <div className={styles.hLine}></div>
                  <div className={styles.leftLeg}></div>
                  <div className={styles.rightLeg}></div>
                </div>

                {/* Children: Alonzo & Sierra */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  {(() => {
                    const currentVal = ex1FamilyTree.alonzo || '';
                    const origVal = origTree?.alonzo;
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex1Key?.['alonzo']) : null;
                    const validClass =
                      vRes?.status === 'correct'
                        ? styles.inputValid
                        : vRes?.status === 'incorrect'
                        ? styles.inputInvalid
                        : '';

                    return (
                      <div className={styles.treeMember} style={{ width: '115px' }}>
                        <AvatarMale className={styles.avatarSvg} />
                        <div className={styles.treeInputWrap}>
                          <div className={styles.treeInputRow}>
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => onEx1FamilyTreeChange('alonzo', e.target.value)}
                              disabled={readOnly}
                              placeholder="name..."
                              aria-label="Son's name in family tree"
                              className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                              style={{ width: '65px', textAlign: 'center' }}
                            />
                            {vRes?.status === 'correct' && (
                              <span className={styles.correctBadge}>
                                <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                              </span>
                            )}
                          </div>
                          <p>: my son,<br />student</p>
                          {vRes && vRes.status !== 'correct' && (
                            <div className={styles.treeFeedbackRow}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <div className={styles.treeMember} style={{ width: '115px' }}>
                    <AvatarFemale className={styles.avatarSvg} />
                    <p><strong>Sierra:</strong> my daughter,<br />student</p>
                  </div>
                </div>
              </div>

              {/* Couple 2: José & Luisa */}
              <div className={styles.gen2Couple}>
                <div className={styles.treeRow} style={{ gap: '1rem' }}>
                  {/* José */}
                  {(() => {
                    const currentVal = ex1FamilyTree.jose || '';
                    const origVal = origTree?.jose;
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex1Key?.['jose']) : null;
                    const validClass =
                      vRes?.status === 'correct'
                        ? styles.inputValid
                        : vRes?.status === 'incorrect'
                        ? styles.inputInvalid
                        : '';

                    return (
                      <div className={styles.treeMember} style={{ width: '120px' }}>
                        <AvatarMale className={styles.avatarSvg} />
                        <div className={styles.treeInputWrap}>
                          <div className={styles.treeInputRow}>
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => onEx1FamilyTreeChange('jose', e.target.value)}
                              disabled={readOnly}
                              placeholder="name..."
                              aria-label="Brother's name in family tree"
                              className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                              style={{ width: '65px', textAlign: 'center' }}
                            />
                            {vRes?.status === 'correct' && (
                              <span className={styles.correctBadge}>
                                <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                              </span>
                            )}
                          </div>
                          <p>: my brother,<br />football player</p>
                          {vRes && vRes.status !== 'correct' && (
                            <div className={styles.treeFeedbackRow}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <div className={styles.heartConnector}>
                    <IconHeart className={styles.heartSvg} />
                    <div className={styles.verticalStem}></div>
                  </div>

                  {/* Luisa */}
                  {(() => {
                    const currentVal = ex1FamilyTree.luisa || '';
                    const origVal = origTree?.luisa;
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex1Key?.['luisa']) : null;
                    const validClass =
                      vRes?.status === 'correct'
                        ? styles.inputValid
                        : vRes?.status === 'incorrect'
                        ? styles.inputInvalid
                        : '';

                    return (
                      <div className={styles.treeMember} style={{ width: '120px' }}>
                        <AvatarFemale className={styles.avatarSvg} />
                        <div className={styles.treeInputWrap}>
                          <div className={styles.treeInputRow}>
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => onEx1FamilyTreeChange('luisa', e.target.value)}
                              disabled={readOnly}
                              placeholder="name..."
                              aria-label="Brother's wife name in family tree"
                              className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                              style={{ width: '65px', textAlign: 'center' }}
                            />
                            {vRes?.status === 'correct' && (
                              <span className={styles.correctBadge}>
                                <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                              </span>
                            )}
                          </div>
                          <p>: my brother&apos;s wife,<br />nurse</p>
                          {vRes && vRes.status !== 'correct' && (
                            <div className={styles.treeFeedbackRow}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Branch down to Rosalyn & Esteban */}
                <div className={styles.branchBar} style={{ width: '160px' }}>
                  <div className={styles.hLine}></div>
                  <div className={styles.leftLeg}></div>
                  <div className={styles.rightLeg}></div>
                </div>

                {/* Children: Rosalyn & Esteban */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <div className={styles.treeMember} style={{ width: '115px' }}>
                    <AvatarFemale className={styles.avatarSvg} />
                    <p><strong>Rosalyn:</strong> my brother&apos;s daughter, student</p>
                  </div>

                  <div className={styles.treeMember} style={{ width: '115px' }}>
                    <AvatarMale className={styles.avatarSvg} />
                    <p><strong>Esteban:</strong> my brother&apos;s son, student</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Ex 2a (Table) & Ex 3 (Sentences) */}
        <div className={styles.bottomGrid14}>
          {/* Ex 2a Vocabulary Table */}
          <div>
            <div className={styles.pronounceRow}>
              <span className={styles.pronounceLabel}>Listen with Milo:</span>
              <PronounceButton word="mother" label="mother" size="small" />
              <PronounceButton word="father" label="father" size="small" />
              <PronounceButton word="parents" label="parents" size="small" />
              <PronounceButton word="daughter" label="daughter" size="small" />
              <PronounceButton word="son" label="son" size="small" />
              <PronounceButton word="children" label="children" size="small" />
              <PronounceButton word="sister" label="sister" size="small" />
              <PronounceButton word="brother" label="brother" size="small" />
              <PronounceButton word="wife" label="wife" size="small" />
              <PronounceButton word="husband" label="husband" size="small" />
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.vocabTable}>
                <thead>
                  <tr>
                    <th>
                      <div style={{ width: '30px', margin: '0 auto' }}>
                        <AvatarFemale className={styles.avatarSvg} />
                      </div>
                    </th>
                    <th>
                      <div style={{ width: '30px', margin: '0 auto' }}>
                        <AvatarMale className={styles.avatarSvg} />
                      </div>
                    </th>
                    <th>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                        <div style={{ width: '26px' }}><AvatarFemale className={styles.avatarSvg} /></div>
                        <div style={{ width: '26px' }}><AvatarMale className={styles.avatarSvg} /></div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>mother / <sup>1</sup><span style={{ fontStyle: 'italic', color: '#0369a1' }}>mum</span></td>
                    <td>
                      <sup>2</sup>
                      {(() => {
                        const currentVal = ex2aTable['2'] || '';
                        const origVal = origTable?.['2'];
                        const isChanged = origVal !== undefined && origVal !== currentVal;
                        const vRes = isReview ? verifyAnswer(currentVal, ex2aKey?.['2']) : null;
                        const validClass =
                          vRes?.status === 'correct'
                            ? styles.inputValid
                            : vRes?.status === 'incorrect'
                            ? styles.inputInvalid
                            : '';

                        return (
                          <span>
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => onEx2aTableChange('2', e.target.value)}
                              disabled={readOnly}
                              placeholder="..."
                              aria-label="Table cell 2: father"
                              className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                              style={{ width: '55px' }}
                            />
                            {vRes?.status === 'correct' && (
                              <span className={styles.correctBadge}>
                                <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                              </span>
                            )}
                            {vRes && vRes.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                          </span>
                        );
                      })()}
                      <span> / dad</span>
                    </td>
                    <td>parents</td>
                  </tr>
                  <tr>
                    <td>
                      <sup>3</sup>
                      {(() => {
                        const currentVal = ex2aTable['3'] || '';
                        const origVal = origTable?.['3'];
                        const isChanged = origVal !== undefined && origVal !== currentVal;
                        const vRes = isReview ? verifyAnswer(currentVal, ex2aKey?.['3']) : null;
                        const validClass =
                          vRes?.status === 'correct'
                            ? styles.inputValid
                            : vRes?.status === 'incorrect'
                            ? styles.inputInvalid
                            : '';

                        return (
                          <span>
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => onEx2aTableChange('3', e.target.value)}
                              disabled={readOnly}
                              placeholder="..."
                              aria-label="Table cell 3: daughter"
                              className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                              style={{ width: '65px' }}
                            />
                            {vRes?.status === 'correct' && (
                              <span className={styles.correctBadge}>
                                <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                              </span>
                            )}
                            {vRes && vRes.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                          </span>
                        );
                      })()}
                    </td>
                    <td>son</td>
                    <td>children</td>
                  </tr>
                  <tr>
                    <td>sister</td>
                    <td>
                      <sup>4</sup>
                      {(() => {
                        const currentVal = ex2aTable['4'] || '';
                        const origVal = origTable?.['4'];
                        const isChanged = origVal !== undefined && origVal !== currentVal;
                        const vRes = isReview ? verifyAnswer(currentVal, ex2aKey?.['4']) : null;
                        const validClass =
                          vRes?.status === 'correct'
                            ? styles.inputValid
                            : vRes?.status === 'incorrect'
                            ? styles.inputInvalid
                            : '';

                        return (
                          <span>
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => onEx2aTableChange('4', e.target.value)}
                              disabled={readOnly}
                              placeholder="..."
                              aria-label="Table cell 4: brother"
                              className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                              style={{ width: '65px' }}
                            />
                            {vRes?.status === 'correct' && (
                              <span className={styles.correctBadge}>
                                <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                              </span>
                            )}
                            {vRes && vRes.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                          </span>
                        );
                      })()}
                    </td>
                    <td className={styles.emptyCell}></td>
                  </tr>
                  <tr>
                    <td>
                      <sup>5</sup>
                      {(() => {
                        const currentVal = ex2aTable['5'] || '';
                        const origVal = origTable?.['5'];
                        const isChanged = origVal !== undefined && origVal !== currentVal;
                        const vRes = isReview ? verifyAnswer(currentVal, ex2aKey?.['5']) : null;
                        const validClass =
                          vRes?.status === 'correct'
                            ? styles.inputValid
                            : vRes?.status === 'incorrect'
                            ? styles.inputInvalid
                            : '';

                        return (
                          <span>
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => onEx2aTableChange('5', e.target.value)}
                              disabled={readOnly}
                              placeholder="..."
                              aria-label="Table cell 5: wife"
                              className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                              style={{ width: '65px' }}
                            />
                            {vRes?.status === 'correct' && (
                              <span className={styles.correctBadge}>
                                <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                              </span>
                            )}
                            {vRes && vRes.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                          </span>
                        );
                      })()}
                    </td>
                    <td>husband</td>
                    <td className={styles.emptyCell}></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Audio 2.1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#d32027', fontWeight: 800, fontSize: '12px' }}>b</span>
              <button
                type="button"
                onClick={() => playAudio('2.1')}
                className={`${styles.audioBtn} ${playingAudio === '2.1' ? styles.playing : ''}`}
                disabled={readOnly}
                aria-label="Play audio track 2.1"
              >
                <span className={styles.diamondIcon}>
                  <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                </span>
                <span>2.1</span>
                <span>{playingAudio === '2.1' ? 'Playing...' : 'Audio'}</span>
              </button>
              <span style={{ fontSize: '12px', color: '#475569' }}>Listen, check and repeat.</span>
            </div>
          </div>

          {/* Ex 3 Sentences */}
          <div>
            <div className={styles.exerciseInstruction} style={{ marginBottom: '8px' }}>
              <span className={styles.exNum}>3</span>
              <span>Look at the family tree again. Complete the sentences.</span>
            </div>

            <ol className={styles.sentencesList}>
              {[
                { id: '1', pre: "Cristina is Umberto's", post: '.', width: '70px', label: "Cristina is Umberto's..." },
                { id: '2', pre: "José is Luisa's", post: '.', width: '70px', label: "José is Luisa's..." },
                { id: '3', pre: "Esteban is José's", post: '.', width: '60px', label: "Esteban is José's..." },
                { id: '4', pre: "Alonzo is Sierra's", post: '.', width: '70px', label: "Alonzo is Sierra's..." },
                { id: '5', pre: "Rafael is Alonzo's", post: '.', width: '70px', label: "Rafael is Alonzo's..." },
                { id: '6', pre: "Cristina is Rafael's", post: '.', width: '60px', label: "Cristina is Rafael's..." },
                { id: '7', pre: "Rosalyn and Esteban are José and Luisa's", post: '.', width: '70px', label: "Rosalyn and Esteban are José and Luisa's..." },
                { id: '8', pre: "Umberto and Maria are Cristina and José's", post: '.', width: '70px', label: "Umberto and Maria are Cristina and José's..." },
              ].map((item) => {
                const currentVal = ex3Sentences[item.id] || '';
                const origVal = origSentences?.[item.id];
                const isChanged = origVal !== undefined && origVal !== currentVal;
                const vRes = isReview ? verifyAnswer(currentVal, ex3Key?.[item.id]) : null;
                const validClass =
                  vRes?.status === 'correct'
                    ? styles.inputValid
                    : vRes?.status === 'incorrect'
                    ? styles.inputInvalid
                    : '';

                return (
                  <li key={item.id} className={styles.sentenceItem}>
                    <div className={styles.sentenceTextRow}>
                      <span>{item.pre}</span>
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => onEx3SentencesChange(item.id, e.target.value)}
                        disabled={readOnly}
                        placeholder="..."
                        aria-label={item.label}
                        className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                        style={{ width: item.width }}
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
                        <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Page 14 Pin */}
        <div className={`${styles.pagePin} ${styles.left}`}>
          <div className={styles.pinInner}>14</div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ===================== PAGE 15: 2A FAMILIES (LISTENING & GRAMMAR) ======== */}
      {/* ========================================================================= */}
      <section className={styles.textbookPage15}>
        {/* Right edge tab */}
        <div className={styles.rightEdgeTab15}>
          <div className={styles.tabText}>
            <strong>2A</strong> | Families
          </div>
          <div className={styles.tabStripes}></div>
        </div>

        <div className={styles.grid15}>
          {/* Left Column: Listening 4a/b, Grammar 5, Pronunciation 6 */}
          <div className={styles.leftCol15}>
            {/* Listening Section */}
            <div>
              <h2 className={styles.sectionHeading}>Listening</h2>

              <div className={styles.exerciseInstruction}>
                <span className={styles.exNum}>4</span>
                <span className={styles.exSub}>a</span>
                <button
                  type="button"
                  onClick={() => playAudio('2.2')}
                  className={`${styles.audioBtn} ${playingAudio === '2.2' ? styles.playing : ''}`}
                  disabled={readOnly}
                  aria-label="Play audio track 2.2"
                >
                  <span className={styles.diamondIcon}>
                    <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                  </span>
                  <span>2.2</span>
                  <span>{playingAudio === '2.2' ? 'Playing...' : 'Audio'}</span>
                </button>
                <span>Listen and match speakers 1–4 with photos A–D.</span>
              </div>

              {/* Authentic Photos A-D (img_4.png) */}
              <div className={styles.listeningAuthenticCard}>
                <Image
                  src="/images/lesson2a/img_4.png"
                  alt="Listening Photos A–D"
                  width={294}
                  height={238}
                  className={styles.listeningAuthenticImg}
                />
              </div>

              {/* Speaker matching row */}
              <div className={styles.speakerMatchRow}>
                {['1', '2', '3', '4'].map((spk) => (
                  <div key={spk} className={styles.speakerMatchItem}>
                    <label htmlFor={`spkSelect-${spk}`} style={{ fontWeight: 700 }}>Spk {spk}:</label>
                    <select
                      id={`spkSelect-${spk}`}
                      value={ex4aMatch[spk] || ''}
                      onChange={(e) => onEx4aMatchChange(spk, e.target.value)}
                      disabled={readOnly}
                      className={styles.styledSelect}
                      aria-label={`Match speaker ${spk}`}
                    >
                      <option value="">--</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* 4b Complete sentences */}
              <div>
                <div className={styles.exerciseInstruction} style={{ margin: '8px 0' }}>
                  <span className={styles.exSub}>b</span>
                  <button
                    type="button"
                    onClick={() => playAudio('2.2')}
                    className={`${styles.audioBtn} ${playingAudio === '2.2' ? styles.playing : ''}`}
                    disabled={readOnly}
                    aria-label="Play audio track 2.2 again"
                  >
                    <span className={styles.diamondIcon}>
                      <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                    </span>
                    <span>2.2</span>
                    <span>{playingAudio === '2.2' ? 'Playing...' : 'Audio'}</span>
                  </button>
                  <span>Listen again and complete the sentences:</span>
                </div>

                <ol className={styles.listeningSentencesList}>
                  {/* 1 */}
                  {(() => {
                    const valHusband = ex4bListening['1_husband'] || '';
                    const valSon = ex4bListening['1_son'] || '';
                    const vResH = isReview ? verifyAnswer(valHusband, ex4bKey?.['1_husband']) : null;
                    const vResS = isReview ? verifyAnswer(valSon, ex4bKey?.['1_son']) : null;
                    const isHChanged = origListening?.['1_husband'] !== undefined && origListening?.['1_husband'] !== valHusband;
                    const isSChanged = origListening?.['1_son'] !== undefined && origListening?.['1_son'] !== valSon;

                    return (
                      <li className={styles.sentenceItem}>
                        <div className={styles.sentenceTextRow}>
                          <span>1. This is my family. This is <strong>my</strong></span>
                          <input
                            type="text"
                            value={valHusband}
                            onChange={(e) => onEx4bListeningChange('1_husband', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            aria-label="Speaker 1 husband"
                            className={`${styles.textInputLine} ${vResH?.status === 'correct' ? styles.inputValid : vResH?.status === 'incorrect' ? styles.inputInvalid : ''} ${isHChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '65px' }}
                          />
                          {vResH?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vResH} isTeacherReview={isReview} /></span>}
                          <span>, Jon, and <strong>our</strong></span>
                          <input
                            type="text"
                            value={valSon}
                            onChange={(e) => onEx4bListeningChange('1_son', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            aria-label="Speaker 1 son"
                            className={`${styles.textInputLine} ${vResS?.status === 'correct' ? styles.inputValid : vResS?.status === 'incorrect' ? styles.inputInvalid : ''} ${isSChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '55px' }}
                          />
                          {vResS?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vResS} isTeacherReview={isReview} /></span>}
                          <span>. <strong>His</strong> name is James.</span>
                        </div>
                        {((vResH && vResH.status !== 'correct') || (vResS && vResS.status !== 'correct')) && (
                          <div className={styles.sentenceFeedbackList}>
                            {vResH && vResH.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vResH} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                            {vResS && vResS.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vResS} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })()}

                  {/* 2 */}
                  {(() => {
                    const valChildren = ex4bListening['2_children'] || '';
                    const vRes = isReview ? verifyAnswer(valChildren, ex4bKey?.['2_children']) : null;
                    const isChanged = origListening?.['2_children'] !== undefined && origListening?.['2_children'] !== valChildren;

                    return (
                      <li className={styles.sentenceItem}>
                        <div className={styles.sentenceTextRow}>
                          <span>2. This is a photo of <strong>my</strong></span>
                          <input
                            type="text"
                            value={valChildren}
                            onChange={(e) => onEx4bListeningChange('2_children', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            aria-label="Speaker 2 children"
                            className={`${styles.textInputLine} ${vRes?.status === 'correct' ? styles.inputValid : vRes?.status === 'incorrect' ? styles.inputInvalid : ''} ${isChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '65px' }}
                          />
                          {vRes?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes} isTeacherReview={isReview} /></span>}
                          <span>. <strong>Their</strong> names are Yuriko and Shinya. And this is <strong>our</strong> dog. <strong>Its</strong> name is Aki.</span>
                        </div>
                        {vRes && vRes.status !== 'correct' && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                          </div>
                        )}
                      </li>
                    );
                  })()}

                  {/* 3 */}
                  {(() => {
                    const valSons = ex4bListening['3_sons'] || '';
                    const vRes = isReview ? verifyAnswer(valSons, ex4bKey?.['3_sons']) : null;
                    const isChanged = origListening?.['3_sons'] !== undefined && origListening?.['3_sons'] !== valSons;

                    return (
                      <li className={styles.sentenceItem}>
                        <div className={styles.sentenceTextRow}>
                          <span>3. This is a photo of <strong>my</strong></span>
                          <input
                            type="text"
                            value={valSons}
                            onChange={(e) => onEx4bListeningChange('3_sons', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            aria-label="Speaker 3 sons"
                            className={`${styles.textInputLine} ${vRes?.status === 'correct' ? styles.inputValid : vRes?.status === 'incorrect' ? styles.inputInvalid : ''} ${isChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '55px' }}
                          />
                          {vRes?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes} isTeacherReview={isReview} /></span>}
                          <span>. <strong>Their</strong> names are Jan, Karol and Tomasz.</span>
                        </div>
                        {vRes && vRes.status !== 'correct' && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                          </div>
                        )}
                      </li>
                    );
                  })()}

                  {/* 4 */}
                  {(() => {
                    const valParents = ex4bListening['4_parents'] || '';
                    const valFather = ex4bListening['4_father'] || '';
                    const valMother = ex4bListening['4_mother'] || '';

                    const vResP = isReview ? verifyAnswer(valParents, ex4bKey?.['4_parents']) : null;
                    const vResF = isReview ? verifyAnswer(valFather, ex4bKey?.['4_father']) : null;
                    const vResM = isReview ? verifyAnswer(valMother, ex4bKey?.['4_mother']) : null;

                    const isPChanged = origListening?.['4_parents'] !== undefined && origListening?.['4_parents'] !== valParents;
                    const isFChanged = origListening?.['4_father'] !== undefined && origListening?.['4_father'] !== valFather;
                    const isMChanged = origListening?.['4_mother'] !== undefined && origListening?.['4_mother'] !== valMother;

                    return (
                      <li className={styles.sentenceItem}>
                        <div className={styles.sentenceTextRow}>
                          <span>4. This is a photo of <strong>my</strong></span>
                          <input
                            type="text"
                            value={valParents}
                            onChange={(e) => onEx4bListeningChange('4_parents', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            aria-label="Speaker 4 parents"
                            className={`${styles.textInputLine} ${vResP?.status === 'correct' ? styles.inputValid : vResP?.status === 'incorrect' ? styles.inputInvalid : ''} ${isPChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '65px' }}
                          />
                          {vResP?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vResP} isTeacherReview={isReview} /></span>}
                          <span>. <strong>My</strong></span>
                          <input
                            type="text"
                            value={valFather}
                            onChange={(e) => onEx4bListeningChange('4_father', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            aria-label="Speaker 4 father"
                            className={`${styles.textInputLine} ${vResF?.status === 'correct' ? styles.inputValid : vResF?.status === 'incorrect' ? styles.inputInvalid : ''} ${isFChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '55px' }}
                          />
                          {vResF?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vResF} isTeacherReview={isReview} /></span>}
                          <span>, Tony, is from Canada. <strong>His</strong> family are in Vancouver. <strong>My</strong></span>
                          <input
                            type="text"
                            value={valMother}
                            onChange={(e) => onEx4bListeningChange('4_mother', e.target.value)}
                            disabled={readOnly}
                            placeholder="..."
                            aria-label="Speaker 4 mother"
                            className={`${styles.textInputLine} ${vResM?.status === 'correct' ? styles.inputValid : vResM?.status === 'incorrect' ? styles.inputInvalid : ''} ${isMChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '55px' }}
                          />
                          {vResM?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vResM} isTeacherReview={isReview} /></span>}
                          <span>&apos;s name is Lily.</span>
                        </div>
                        {((vResP && vResP.status !== 'correct') ||
                          (vResF && vResF.status !== 'correct') ||
                          (vResM && vResM.status !== 'correct')) && (
                          <div className={styles.sentenceFeedbackList}>
                            {vResP && vResP.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vResP} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                            {vResF && vResF.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vResF} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                            {vResM && vResM.status !== 'correct' && (
                              <div className={styles.feedbackRow}>
                                <TeacherAnswerBadge result={vResM} isTeacherReview={isReview} className={styles.teacherBadge} />
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })()}
                </ol>
              </div>
            </div>

            {/* Grammar Section */}
            <div className={styles.grammarBox15}>
              <h2 className={styles.sectionHeading}>Grammar</h2>
              <div className={styles.exerciseInstruction} style={{ marginBottom: '6px' }}>
                <span className={styles.exNum}>5</span>
                <span>Complete the grammar box with the words in bold in Exercise 4b.</span>
              </div>

              <h4>Possessive <em>&apos;s</em></h4>
              <p>name + <em>&apos;s</em>: <span style={{ color: '#0369a1', fontStyle: 'italic' }}>Rafael is Cristina<strong>&apos;s</strong> husband.</span></p>
              <p>word + <em>&apos;s</em>: <span style={{ color: '#0369a1', fontStyle: 'italic' }}>My mother<strong>&apos;s</strong> name is Lily.</span></p>

              <h4 style={{ marginTop: '8px' }}>I/my, you/your, <em>etc.</em></h4>
              <table className={styles.grammarTable}>
                <thead>
                  <tr>
                    <th><em>I, you,</em> etc.</th>
                    <th>possessive adjectives</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { prn: 'I', id: '1' },
                    { prn: 'you', val: 'your' },
                    { prn: 'he', id: '2' },
                    { prn: 'she', val: 'her' },
                    { prn: 'it', id: '3' },
                    { prn: 'we', id: '4' },
                    { prn: 'they', id: '5' },
                  ].map((row, idx) => {
                    if (row.val) {
                      return (
                        <tr key={idx}>
                          <td>{row.prn}</td>
                          <td>{row.val}</td>
                        </tr>
                      );
                    }

                    const currentVal = ex5Grammar[row.id!] || '';
                    const origVal = origGrammar?.[row.id!];
                    const isChanged = origVal !== undefined && origVal !== currentVal;
                    const vRes = isReview ? verifyAnswer(currentVal, ex5Key?.[row.id!]) : null;
                    const validClass =
                      vRes?.status === 'correct'
                        ? styles.inputValid
                        : vRes?.status === 'incorrect'
                        ? styles.inputInvalid
                        : '';

                    return (
                      <tr key={idx}>
                        <td>{row.prn}</td>
                        <td>
                          <sup>{row.id}</sup>
                          <input
                            type="text"
                            value={currentVal}
                            onChange={(e) => onEx5GrammarChange(row.id!, e.target.value)}
                            disabled={readOnly}
                            aria-label={`Possessive adjective for ${row.prn}`}
                            className={`${styles.textInputLine} ${validClass} ${isChanged ? styles.diffHighlight : ''}`}
                            style={{ width: '50px' }}
                          />
                          {vRes?.status === 'correct' && (
                            <span className={styles.correctBadge}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                            </span>
                          )}
                          {vRes && vRes.status !== 'correct' && (
                            <div className={styles.feedbackRow}>
                              <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pronunciation 6 */}
            <div style={{ marginTop: '0.75rem' }}>
              <div className={styles.exerciseInstruction}>
                <span className={styles.exNum}>6</span>
                <span className={styles.exSub}>a</span>
                <button
                  type="button"
                  onClick={() => playAudio('2.3')}
                  className={`${styles.audioBtn} ${playingAudio === '2.3' ? styles.playing : ''}`}
                  disabled={readOnly}
                  aria-label="Play audio track 2.3"
                >
                  <span className={styles.diamondIcon}>
                    <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                  </span>
                  <span>2.3</span>
                  <span>{playingAudio === '2.3' ? 'Playing...' : 'Audio'}</span>
                </button>
                <span>Listen to the sentences. Do the words in blue sound the same or different?</span>
              </div>

              <div className={styles.pronunciationBox}>
                {[
                  {
                    id: '1',
                    num: '1',
                    sentA: <span>a <span className={styles.targetWord}>They&apos;re</span> from the UK.</span>,
                    sentB: <span>b <span className={styles.targetWord}>Their</span> mother is English.</span>,
                  },
                  {
                    id: '2',
                    num: '2',
                    sentA: <span>a <span className={styles.targetWord}>He&apos;s</span> an office worker.</span>,
                    sentB: <span>b <span className={styles.targetWord}>His</span> sister is a nurse.</span>,
                  },
                  {
                    id: '3',
                    num: '3',
                    sentA: <span>a <span className={styles.targetWord}>Your</span> family is great.</span>,
                    sentB: <span>b <span className={styles.targetWord}>You&apos;re</span> from a big family.</span>,
                  },
                ].map((item) => {
                  const currentVal = (ex6Pronunciation[item.id] || '').toUpperCase();
                  const vRes = isReview && currentVal ? verifyAnswer(currentVal, ex6Key?.[item.id]) : null;
                  const validClass =
                    vRes?.status === 'correct'
                      ? styles.choiceValid
                      : vRes?.status === 'incorrect'
                      ? styles.choiceInvalid
                      : '';

                  return (
                    <div key={item.id} className={styles.pronPairCard}>
                      <div className={styles.sentences}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>Pair {item.num}:</div>
                        <div>{item.sentA}</div>
                        <div>{item.sentB}</div>
                      </div>

                      <div className={styles.choiceGroup}>
                        <button
                          type="button"
                          disabled={readOnly}
                          onClick={() => onEx6PronunciationChange(item.id, 'S')}
                          className={`${styles.choiceBtn} ${currentVal === 'S' || currentVal === 'SAME' ? (validClass || styles.active) : ''}`}
                          aria-label={`Pair ${item.num} Same`}
                        >
                          [ S ] Same
                        </button>
                        <button
                          type="button"
                          disabled={readOnly}
                          onClick={() => onEx6PronunciationChange(item.id, 'D')}
                          className={`${styles.choiceBtn} ${currentVal === 'D' || currentVal === 'DIFFERENT' ? (validClass || styles.active) : ''}`}
                          aria-label={`Pair ${item.num} Different`}
                        >
                          [ D ] Different
                        </button>
                        {vRes?.status === 'correct' && (
                          <span className={styles.correctBadge}>
                            <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} />
                          </span>
                        )}
                      </div>
                      {vRes && vRes.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes} isTeacherReview={isReview} className={styles.teacherBadge} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 6b Listen again and repeat */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', marginTop: '8px' }}>
                <span style={{ color: '#d32027', fontWeight: 800 }}>b</span>
                <span style={{ color: '#475569', fontWeight: 600 }}>Listen again and repeat.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Exercise 7 (Dialogue) & Speaking */}
          <div className={styles.rightCol15}>
            {/* Exercise 7 */}
            <div>
              <div className={styles.exerciseInstruction} style={{ marginBottom: '6px' }}>
                <span className={styles.exNum}>7</span>
                <button
                  type="button"
                  onClick={() => playAudio('2.4')}
                  className={`${styles.audioBtn} ${playingAudio === '2.4' ? styles.playing : ''}`}
                  disabled={readOnly}
                  aria-label="Play audio track 2.4"
                >
                  <span className={styles.diamondIcon}>
                    <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                  </span>
                  <span>2.4</span>
                  <span>{playingAudio === '2.4' ? 'Playing...' : 'Audio'}</span>
                </button>
                <span>Choose the correct alternatives.</span>
              </div>

              {/* Photo of Yasemin & Tara (img_5.png) */}
              <div className={styles.dialoguePhotoWrap}>
                <Image
                  src="/images/lesson2a/img_5.png"
                  alt="Yasemin and Tara talking"
                  width={315}
                  height={308}
                  className={styles.dialoguePhotoImg}
                />
              </div>

              {/* Dialogue */}
              <div className={styles.dialogue15}>
                {/* Row 1 */}
                {(() => {
                  const val1 = ex7Dialogue['1'] || '';
                  const vRes1 = isReview ? verifyAnswer(val1, ex7Key?.['1']) : null;
                  const is1Changed = origDialogue?.['1'] !== undefined && origDialogue?.['1'] !== val1;

                  return (
                    <div className={styles.dialogueRow}>
                      <div className={styles.speakerRow}>
                        <span className={styles.speaker}>Yasemin:</span>
                        <span>This is a photo of <sup>1</sup></span>
                        <select
                          value={val1}
                          onChange={(e) => onEx7DialogueChange('1', e.target.value)}
                          disabled={readOnly}
                          aria-label="Dialogue gap 1"
                          className={`${styles.styledSelect} ${vRes1?.status === 'correct' ? styles.choiceValid : vRes1?.status === 'incorrect' ? styles.choiceInvalid : ''} ${is1Changed ? styles.diffHighlight : ''}`}
                        >
                          <option value="">--</option>
                          <option value="my">my</option>
                          <option value="you">you</option>
                        </select>
                        {vRes1?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes1} isTeacherReview={isReview} /></span>}
                        <span>family.</span>
                      </div>
                      {vRes1 && vRes1.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes1} isTeacherReview={isReview} className={styles.teacherBadge} />
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Row 2 */}
                {(() => {
                  const val2 = ex7Dialogue['2'] || '';
                  const val3 = ex7Dialogue['3'] || '';
                  const vRes2 = isReview ? verifyAnswer(val2, ex7Key?.['2']) : null;
                  const vRes3 = isReview ? verifyAnswer(val3, ex7Key?.['3']) : null;
                  const is2Changed = origDialogue?.['2'] !== undefined && origDialogue?.['2'] !== val2;
                  const is3Changed = origDialogue?.['3'] !== undefined && origDialogue?.['3'] !== val3;

                  return (
                    <div className={styles.dialogueRow}>
                      <div className={styles.speakerRow}>
                        <span className={styles.speaker}>Tara:</span>
                        <span>Wow! Is this <sup>2</sup></span>
                        <select
                          value={val2}
                          onChange={(e) => onEx7DialogueChange('2', e.target.value)}
                          disabled={readOnly}
                          aria-label="Dialogue gap 2"
                          className={`${styles.styledSelect} ${vRes2?.status === 'correct' ? styles.choiceValid : vRes2?.status === 'incorrect' ? styles.choiceInvalid : ''} ${is2Changed ? styles.diffHighlight : ''}`}
                        >
                          <option value="">--</option>
                          <option value="you">you</option>
                          <option value="your">your</option>
                        </select>
                        {vRes2?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes2} isTeacherReview={isReview} /></span>}
                        <span>mother and father? What are <sup>3</sup></span>
                        <select
                          value={val3}
                          onChange={(e) => onEx7DialogueChange('3', e.target.value)}
                          disabled={readOnly}
                          aria-label="Dialogue gap 3"
                          className={`${styles.styledSelect} ${vRes3?.status === 'correct' ? styles.choiceValid : vRes3?.status === 'incorrect' ? styles.choiceInvalid : ''} ${is3Changed ? styles.diffHighlight : ''}`}
                        >
                          <option value="">--</option>
                          <option value="they're">they&apos;re</option>
                          <option value="their">their</option>
                        </select>
                        {vRes3?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes3} isTeacherReview={isReview} /></span>}
                        <span>names?</span>
                      </div>
                      {((vRes2 && vRes2.status !== 'correct') || (vRes3 && vRes3.status !== 'correct')) && (
                        <div className={styles.sentenceFeedbackList}>
                          {vRes2 && vRes2.status !== 'correct' && (
                            <div className={styles.feedbackRow}>
                              <TeacherAnswerBadge result={vRes2} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                          {vRes3 && vRes3.status !== 'correct' && (
                            <div className={styles.feedbackRow}>
                              <TeacherAnswerBadge result={vRes3} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Row 3 */}
                {(() => {
                  const val4 = ex7Dialogue['4'] || '';
                  const val5 = ex7Dialogue['5'] || '';
                  const val6 = ex7Dialogue['6'] || '';

                  const vRes4 = isReview ? verifyAnswer(val4, ex7Key?.['4']) : null;
                  const vRes5 = isReview ? verifyAnswer(val5, ex7Key?.['5']) : null;
                  const vRes6 = isReview ? verifyAnswer(val6, ex7Key?.['6']) : null;

                  const is4Changed = origDialogue?.['4'] !== undefined && origDialogue?.['4'] !== val4;
                  const is5Changed = origDialogue?.['5'] !== undefined && origDialogue?.['5'] !== val5;
                  const is6Changed = origDialogue?.['6'] !== undefined && origDialogue?.['6'] !== val6;

                  return (
                    <div className={styles.dialogueRow}>
                      <div className={styles.speakerRow}>
                        <span className={styles.speaker}>Yasemin:</span>
                        <span>My <sup>4</sup></span>
                        <select
                          value={val4}
                          onChange={(e) => onEx7DialogueChange('4', e.target.value)}
                          disabled={readOnly}
                          aria-label="Dialogue gap 4"
                          className={`${styles.styledSelect} ${vRes4?.status === 'correct' ? styles.choiceValid : vRes4?.status === 'incorrect' ? styles.choiceInvalid : ''} ${is4Changed ? styles.diffHighlight : ''}`}
                        >
                          <option value="">--</option>
                          <option value="father's">father&apos;s</option>
                          <option value="father is">father is</option>
                        </select>
                        {vRes4?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes4} isTeacherReview={isReview} /></span>}
                        <span>name is Emir. <sup>5</sup></span>
                        <select
                          value={val5}
                          onChange={(e) => onEx7DialogueChange('5', e.target.value)}
                          disabled={readOnly}
                          aria-label="Dialogue gap 5"
                          className={`${styles.styledSelect} ${vRes5?.status === 'correct' ? styles.choiceValid : vRes5?.status === 'incorrect' ? styles.choiceInvalid : ''} ${is5Changed ? styles.diffHighlight : ''}`}
                        >
                          <option value="">--</option>
                          <option value="He's">He&apos;s</option>
                          <option value="His">His</option>
                        </select>
                        {vRes5?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes5} isTeacherReview={isReview} /></span>}
                        <span>from Turkey. My mother&apos;s English. <sup>6</sup></span>
                        <select
                          value={val6}
                          onChange={(e) => onEx7DialogueChange('6', e.target.value)}
                          disabled={readOnly}
                          aria-label="Dialogue gap 6"
                          className={`${styles.styledSelect} ${vRes6?.status === 'correct' ? styles.choiceValid : vRes6?.status === 'incorrect' ? styles.choiceInvalid : ''} ${is6Changed ? styles.diffHighlight : ''}`}
                        >
                          <option value="">--</option>
                          <option value="His">His</option>
                          <option value="Her">Her</option>
                        </select>
                        {vRes6?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes6} isTeacherReview={isReview} /></span>}
                        <span>name&apos;s Linda.</span>
                      </div>
                      {((vRes4 && vRes4.status !== 'correct') ||
                        (vRes5 && vRes5.status !== 'correct') ||
                        (vRes6 && vRes6.status !== 'correct')) && (
                        <div className={styles.sentenceFeedbackList}>
                          {vRes4 && vRes4.status !== 'correct' && (
                            <div className={styles.feedbackRow}>
                              <TeacherAnswerBadge result={vRes4} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                          {vRes5 && vRes5.status !== 'correct' && (
                            <div className={styles.feedbackRow}>
                              <TeacherAnswerBadge result={vRes5} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                          {vRes6 && vRes6.status !== 'correct' && (
                            <div className={styles.feedbackRow}>
                              <TeacherAnswerBadge result={vRes6} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Row 4 */}
                {(() => {
                  const val7 = ex7Dialogue['7'] || '';
                  const vRes7 = isReview ? verifyAnswer(val7, ex7Key?.['7']) : null;
                  const is7Changed = origDialogue?.['7'] !== undefined && origDialogue?.['7'] !== val7;

                  return (
                    <div className={styles.dialogueRow}>
                      <div className={styles.speakerRow}>
                        <span className={styles.speaker}>Tara:</span>
                        <span>OK. So is this <sup>7</sup></span>
                        <select
                          value={val7}
                          onChange={(e) => onEx7DialogueChange('7', e.target.value)}
                          disabled={readOnly}
                          aria-label="Dialogue gap 7"
                          className={`${styles.styledSelect} ${vRes7?.status === 'correct' ? styles.choiceValid : vRes7?.status === 'incorrect' ? styles.choiceInvalid : ''} ${is7Changed ? styles.diffHighlight : ''}`}
                        >
                          <option value="">--</option>
                          <option value="you">you</option>
                          <option value="your">your</option>
                        </select>
                        {vRes7?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes7} isTeacherReview={isReview} /></span>}
                        <span>brother?</span>
                      </div>
                      {vRes7 && vRes7.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes7} isTeacherReview={isReview} className={styles.teacherBadge} />
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Row 5 */}
                {(() => {
                  const val8 = ex7Dialogue['8'] || '';
                  const val9 = ex7Dialogue['9'] || '';
                  const vRes8 = isReview ? verifyAnswer(val8, ex7Key?.['8']) : null;
                  const vRes9 = isReview ? verifyAnswer(val9, ex7Key?.['9']) : null;
                  const is8Changed = origDialogue?.['8'] !== undefined && origDialogue?.['8'] !== val8;
                  const is9Changed = origDialogue?.['9'] !== undefined && origDialogue?.['9'] !== val9;

                  return (
                    <div className={styles.dialogueRow}>
                      <div className={styles.speakerRow}>
                        <span className={styles.speaker}>Yasemin:</span>
                        <span>No, it isn&apos;t. That&apos;s <sup>8</sup></span>
                        <select
                          value={val8}
                          onChange={(e) => onEx7DialogueChange('8', e.target.value)}
                          disabled={readOnly}
                          aria-label="Dialogue gap 8"
                          className={`${styles.styledSelect} ${vRes8?.status === 'correct' ? styles.choiceValid : vRes8?.status === 'incorrect' ? styles.choiceInvalid : ''} ${is8Changed ? styles.diffHighlight : ''}`}
                        >
                          <option value="">--</option>
                          <option value="our">our</option>
                          <option value="we">we</option>
                        </select>
                        {vRes8?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes8} isTeacherReview={isReview} /></span>}
                        <span>friend from Ankara. This is my brother here. <sup>9</sup></span>
                        <select
                          value={val9}
                          onChange={(e) => onEx7DialogueChange('9', e.target.value)}
                          disabled={readOnly}
                          aria-label="Dialogue gap 9"
                          className={`${styles.styledSelect} ${vRes9?.status === 'correct' ? styles.choiceValid : vRes9?.status === 'incorrect' ? styles.choiceInvalid : ''} ${is9Changed ? styles.diffHighlight : ''}`}
                        >
                          <option value="">--</option>
                          <option value="Her">Her</option>
                          <option value="His">His</option>
                        </select>
                        {vRes9?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes9} isTeacherReview={isReview} /></span>}
                        <span>name&apos;s Ali.</span>
                      </div>
                      {((vRes8 && vRes8.status !== 'correct') || (vRes9 && vRes9.status !== 'correct')) && (
                        <div className={styles.sentenceFeedbackList}>
                          {vRes8 && vRes8.status !== 'correct' && (
                            <div className={styles.feedbackRow}>
                              <TeacherAnswerBadge result={vRes8} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                          {vRes9 && vRes9.status !== 'correct' && (
                            <div className={styles.feedbackRow}>
                              <TeacherAnswerBadge result={vRes9} isTeacherReview={isReview} className={styles.teacherBadge} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Row 6 */}
                {(() => {
                  const val10 = ex7Dialogue['10'] || '';
                  const vRes10 = isReview ? verifyAnswer(val10, ex7Key?.['10']) : null;
                  const is10Changed = origDialogue?.['10'] !== undefined && origDialogue?.['10'] !== val10;

                  return (
                    <div className={styles.dialogueRow}>
                      <div className={styles.speakerRow}>
                        <span className={styles.speaker}>Tara:</span>
                        <span>Right. What&apos;s your <sup>10</sup></span>
                        <select
                          value={val10}
                          onChange={(e) => onEx7DialogueChange('10', e.target.value)}
                          disabled={readOnly}
                          aria-label="Dialogue gap 10"
                          className={`${styles.styledSelect} ${vRes10?.status === 'correct' ? styles.choiceValid : vRes10?.status === 'incorrect' ? styles.choiceInvalid : ''} ${is10Changed ? styles.diffHighlight : ''}`}
                        >
                          <option value="">--</option>
                          <option value="friends">friends</option>
                          <option value="friend's">friend&apos;s</option>
                        </select>
                        {vRes10?.status === 'correct' && <span className={styles.correctBadge}><TeacherAnswerBadge result={vRes10} isTeacherReview={isReview} /></span>}
                        <span>name?</span>
                      </div>
                      {vRes10 && vRes10.status !== 'correct' && (
                        <div className={styles.feedbackRow}>
                          <TeacherAnswerBadge result={vRes10} isTeacherReview={isReview} className={styles.teacherBadge} />
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Row 7 */}
                <div className={styles.dialogueRow}>
                  <div className={styles.speakerRow}>
                    <span className={styles.speaker}>Yasemin:</span>
                    <span>Yusuf. He&apos;s a student in the UK.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Speaking Section */}
            <div className={styles.speakingSection}>
              <h2 className={styles.sectionHeading} style={{ marginTop: '4px' }}>Speaking</h2>

              <div>
                <span className={styles.ribbonTag}>PREPARE</span>
                <p style={{ margin: '4px 0', fontSize: '12px', fontWeight: 600 }}>
                  <strong>8</strong> Draw a picture of your family, or find a photo on your phone.
                </p>
              </div>

              <div>
                <span className={styles.ribbonTag}>SPEAK</span>
                <p style={{ margin: '4px 0', fontSize: '12px', fontWeight: 600 }}>
                  <strong>9</strong> Tell your partner / teacher about your family:
                </p>
                <p style={{ fontSize: '11.5px', color: '#0369a1', fontStyle: 'italic', margin: '2px 0 6px 0' }}>
                  e.g. &quot;This is a photo of my family. This is my father. His name is Michael. He&apos;s an office worker.&quot;
                </p>
                <textarea
                  value={ex8Notes}
                  onChange={(e) => onEx8NotesChange(e.target.value)}
                  disabled={readOnly}
                  placeholder="Write your family description here..."
                  aria-label="Notes on family description"
                  className={styles.notesArea}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Page 15 Pin */}
        <div className={`${styles.pagePin} ${styles.right}`}>
          <div className={styles.pinInner}>15</div>
        </div>
      </section>
    </div>
  );
}
