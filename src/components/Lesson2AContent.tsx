'use client';

import React from 'react';
import Image from 'next/image';
import styles from './lesson2a.module.scss';

export interface Lesson2AContentProps {
  lesson?: Record<string, unknown> | null;
  user?: Record<string, unknown> | null;
  readOnly?: boolean;
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

  originalAnswers?: Record<string, unknown>;
}

// Inline Avatar Helpers
const AvatarMale = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" className={className} style={style}>
    <circle cx="32" cy="32" r="30" fill="#78c6d0" />
    <path d="M12 55 C14 44, 24 42, 32 42 C40 42, 50 44, 52 55 A30 30 0 0 1 12 55 Z" fill="#1e3a5f" />
    <polygon points="26,42 38,42 32,51" fill="#ffffff" />
    <path d="M27 36 L27 43 L32 47 L37 43 L37 36 Z" fill="#f3d1b0" />
    <path d="M22 22 C22 14, 42 14, 42 22 L41 33 C41 38, 36 41, 32 41 C28 41, 23 38, 23 33 Z" fill="#f7d7b5" />
    <path d="M21 24 C20 15, 25 12, 32 12 C39 12, 44 15, 43 24 C42 20, 39 17, 32 17 C25 17, 22 20, 21 24 Z" fill="#5a4638" />
  </svg>
);

const AvatarFemale = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" className={className} style={style}>
    <circle cx="32" cy="32" r="30" fill="#f18999" />
    <path d="M19 22 C17 34, 18 43, 21 46 L43 46 C46 43, 47 34, 45 22 Z" fill="#8c583a" />
    <path d="M13 56 C16 45, 24 43, 32 43 C40 43, 48 45, 51 56 A30 30 0 0 1 13 56 Z" fill="#463730" />
    <path d="M28 36 L28 44 L32 48 L36 44 L36 36 Z" fill="#f7d7b5" />
    <path d="M23 23 C23 15, 41 15, 41 23 L40 33 C40 38, 36 41, 32 41 C28 41, 24 38, 24 33 Z" fill="#f9dcc0" />
    <path d="M21 26 C21 15, 26 12, 32 12 C38 12, 43 15, 43 26 C40 21, 35 19, 29 19 C25 19, 23 22, 21 26 Z" fill="#a06543" />
  </svg>
);

const IconHeart = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 32 32" className={className} style={style}>
    <path d="M16 28.5 C16 28.5 3.5 20.2 3.5 11.2 C3.5 6.8 7 3.5 11.2 3.5 C13.7 3.5 15.2 4.8 16 6.2 C16.8 4.8 18.3 3.5 20.8 3.5 C25 3.5 28.5 6.8 28.5 11.2 C28.5 20.2 16 28.5 16 28.5 Z" fill="#e6007e" />
  </svg>
);

export default function Lesson2AContent(props: Lesson2AContentProps) {
  const {
    readOnly = false,
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Goals Box */}
            <div className={styles.goalsBox14}>
              <p><strong>Goal:</strong> talk about your family</p>
              <p><strong>Grammar:</strong> possessive <em>&apos;s</em>, <em>I/my, you/your,</em> etc.</p>
              <p><strong>Vocabulary:</strong> family</p>
            </div>


            {/* Vocabulary Titles */}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#214354', margin: '0 0 6px 0' }}>Vocabulary</h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', fontSize: '12.5px', fontWeight: 600 }}>
                <span style={{ color: '#d32027', fontWeight: 800 }}>1</span>
                <span>Look at the photos and complete the family tree with the correct names.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', fontSize: '12.5px', fontWeight: 600, marginTop: '4px' }}>
                <span style={{ color: '#d32027', fontWeight: 800 }}>2 a</span>
                <span>Look at the family tree again and complete the table below.</span>
              </div>
            </div>
          </div>

          {/* 2x2 Photo Grid */}
          <div className={styles.photoGrid14}>
            {/* Luisa */}
            <div className={styles.photoCard}>
              <div className={styles.photoFrame}>
                <Image
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80"
                  alt="Luisa"
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
              <div className={styles.photoLabel}>Luisa</div>
            </div>

            {/* Maria */}
            <div className={styles.photoCard}>
              <div className={styles.photoFrame}>
                <Image
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80"
                  alt="Maria"
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
              <div className={styles.photoLabel}>Maria</div>
            </div>

            {/* Alonzo */}
            <div className={styles.photoCard}>
              <div className={styles.photoFrame}>
                <Image
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
                  alt="Alonzo"
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
              <div className={styles.photoLabel}>Alonzo</div>
            </div>

            {/* José */}
            <div className={styles.photoCard}>
              <div className={styles.photoFrame}>
                <Image
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
                  alt="José"
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
              <div className={styles.photoLabel}>José</div>
            </div>
          </div>
        </div>

        {/* ================= FAMILY TREE (EXERCISE 1) ================= */}
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
            <div className={styles.treeMember}>
              <AvatarFemale className={styles.avatarSvg} />
              <div style={{ marginTop: '4px' }}>
                <input
                  type="text"
                  value={ex1FamilyTree.maria || ''}
                  onChange={(e) => onEx1FamilyTreeChange('maria', e.target.value)}
                  disabled={readOnly}
                  placeholder="name..."
                  className={styles.textInputLine}
                  style={{ width: '65px' }}
                />
                <p style={{ margin: '2px 0 0 0' }}>: my mother/mum,<br />office worker</p>
              </div>
            </div>
          </div>

          {/* Branch connecting to Gen 2 */}
          <div className={styles.branchBar} style={{ width: '68%' }}>
            <div className={styles.hLine}></div>
            <div className={styles.leftLeg}></div>
            <div className={styles.rightLeg}></div>
          </div>

          {/* Generation 2: (Cristina & Rafael) and (José & Luisa) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '6px' }}>
            {/* Couple 1: Cristina & Rafael */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                <div className={styles.treeMember} style={{ width: '110px' }}>
                  <AvatarMale className={styles.avatarSvg} />
                  <div style={{ marginTop: '3px' }}>
                    <input
                      type="text"
                      value={ex1FamilyTree.alonzo || ''}
                      onChange={(e) => onEx1FamilyTreeChange('alonzo', e.target.value)}
                      disabled={readOnly}
                      placeholder="name..."
                      className={styles.textInputLine}
                      style={{ width: '60px' }}
                    />
                    <p style={{ margin: '2px 0 0 0' }}>: my son,<br />student</p>
                  </div>
                </div>

                <div className={styles.treeMember} style={{ width: '110px' }}>
                  <AvatarFemale className={styles.avatarSvg} />
                  <p><strong>Sierra:</strong> my daughter,<br />student</p>
                </div>
              </div>
            </div>

            {/* Couple 2: José & Luisa */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className={styles.treeRow} style={{ gap: '1rem' }}>
                <div className={styles.treeMember} style={{ width: '120px' }}>
                  <AvatarMale className={styles.avatarSvg} />
                  <div style={{ marginTop: '3px' }}>
                    <input
                      type="text"
                      value={ex1FamilyTree.jose || ''}
                      onChange={(e) => onEx1FamilyTreeChange('jose', e.target.value)}
                      disabled={readOnly}
                      placeholder="name..."
                      className={styles.textInputLine}
                      style={{ width: '60px' }}
                    />
                    <p style={{ margin: '2px 0 0 0' }}>: my brother,<br />football player</p>
                  </div>
                </div>

                <div className={styles.heartConnector}>
                  <IconHeart className={styles.heartSvg} />
                  <div className={styles.verticalStem}></div>
                </div>

                <div className={styles.treeMember} style={{ width: '120px' }}>
                  <AvatarFemale className={styles.avatarSvg} />
                  <div style={{ marginTop: '3px' }}>
                    <input
                      type="text"
                      value={ex1FamilyTree.luisa || ''}
                      onChange={(e) => onEx1FamilyTreeChange('luisa', e.target.value)}
                      disabled={readOnly}
                      placeholder="name..."
                      className={styles.textInputLine}
                      style={{ width: '60px' }}
                    />
                    <p style={{ margin: '2px 0 0 0' }}>: my brother&apos;s wife,<br />nurse</p>
                  </div>
                </div>
              </div>

              {/* Branch down to Rosalyn & Esteban */}
              <div className={styles.branchBar} style={{ width: '160px' }}>
                <div className={styles.hLine}></div>
                <div className={styles.leftLeg}></div>
                <div className={styles.rightLeg}></div>
              </div>

              {/* Children: Rosalyn & Esteban */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <div className={styles.treeMember} style={{ width: '110px' }}>
                  <AvatarFemale className={styles.avatarSvg} />
                  <p><strong>Rosalyn:</strong> my brother&apos;s daughter, student</p>
                </div>

                <div className={styles.treeMember} style={{ width: '110px' }}>
                  <AvatarMale className={styles.avatarSvg} />
                  <p><strong>Esteban:</strong> my brother&apos;s son, student</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Ex 2a (Table) & Ex 3 (Sentences) */}
        <div className={styles.bottomGrid14}>
          {/* Ex 2a Vocabulary Table */}
          <div>
            <table className={styles.vocabTable}>
              <thead>
                <tr>
                  <th><AvatarFemale style={{ width: '32px', height: '32px', margin: '0 auto' }} /></th>
                  <th><AvatarMale style={{ width: '32px', height: '32px', margin: '0 auto' }} /></th>
                  <th>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                      <AvatarFemale style={{ width: '28px', height: '28px' }} />
                      <AvatarMale style={{ width: '28px', height: '28px' }} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>mother / <sup>1</sup><span style={{ fontStyle: 'italic', color: '#0369a1' }}>mum</span></td>
                  <td>
                    <sup>2</sup>
                    <input
                      type="text"
                      value={ex2aTable['2'] || ''}
                      onChange={(e) => onEx2aTableChange('2', e.target.value)}
                      disabled={readOnly}
                      placeholder="..."
                      className={styles.textInputLine}
                      style={{ width: '50px' }}
                    />
                    <span> / dad</span>
                  </td>
                  <td>parents</td>
                </tr>
                <tr>
                  <td>
                    <sup>3</sup>
                    <input
                      type="text"
                      value={ex2aTable['3'] || ''}
                      onChange={(e) => onEx2aTableChange('3', e.target.value)}
                      disabled={readOnly}
                      placeholder="..."
                      className={styles.textInputLine}
                      style={{ width: '65px' }}
                    />
                  </td>
                  <td>son</td>
                  <td>children</td>
                </tr>
                <tr>
                  <td>sister</td>
                  <td>
                    <sup>4</sup>
                    <input
                      type="text"
                      value={ex2aTable['4'] || ''}
                      onChange={(e) => onEx2aTableChange('4', e.target.value)}
                      disabled={readOnly}
                      placeholder="..."
                      className={styles.textInputLine}
                      style={{ width: '65px' }}
                    />
                  </td>
                  <td className={styles.emptyCell}></td>
                </tr>
                <tr>
                  <td>
                    <sup>5</sup>
                    <input
                      type="text"
                      value={ex2aTable['5'] || ''}
                      onChange={(e) => onEx2aTableChange('5', e.target.value)}
                      disabled={readOnly}
                      placeholder="..."
                      className={styles.textInputLine}
                      style={{ width: '65px' }}
                    />
                  </td>
                  <td>husband</td>
                  <td className={styles.emptyCell}></td>
                </tr>
              </tbody>
            </table>

            {/* Audio 2.1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <span style={{ color: '#d32027', fontWeight: 800, fontSize: '12px' }}>b</span>
              <button
                type="button"
                onClick={() => playAudio('2.1')}
                className={`${styles.audioBtn} ${playingAudio === '2.1' ? styles.playing : ''}`}
                disabled={readOnly}
              >
                <span className={styles.diamondIcon}>
                  <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                </span>
                <span>2.1</span>
                <span>{playingAudio === '2.1' ? 'Playing...' : 'Audio'}</span>
              </button>
              <span style={{ fontSize: '11.5px', color: '#475569' }}>Listen, check and repeat.</span>
            </div>
          </div>

          {/* Ex 3 Sentences */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
              <span style={{ color: '#d32027', fontWeight: 800 }}>3</span>
              <span>Look at the family tree again. Complete the sentences.</span>
            </div>

            <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11.5px' }}>
              <li>
                Cristina is Umberto&apos;s{' '}
                <input
                  type="text"
                  value={ex3Sentences['1'] || ''}
                  onChange={(e) => onEx3SentencesChange('1', e.target.value)}
                  disabled={readOnly}
                  className={styles.textInputLine}
                  style={{ width: '70px' }}
                />.
              </li>
              <li>
                José is Luisa&apos;s{' '}
                <input
                  type="text"
                  value={ex3Sentences['2'] || ''}
                  onChange={(e) => onEx3SentencesChange('2', e.target.value)}
                  disabled={readOnly}
                  className={styles.textInputLine}
                  style={{ width: '70px' }}
                />.
              </li>
              <li>
                Esteban is José&apos;s{' '}
                <input
                  type="text"
                  value={ex3Sentences['3'] || ''}
                  onChange={(e) => onEx3SentencesChange('3', e.target.value)}
                  disabled={readOnly}
                  className={styles.textInputLine}
                  style={{ width: '60px' }}
                />.
              </li>
              <li>
                Alonzo is Sierra&apos;s{' '}
                <input
                  type="text"
                  value={ex3Sentences['4'] || ''}
                  onChange={(e) => onEx3SentencesChange('4', e.target.value)}
                  disabled={readOnly}
                  className={styles.textInputLine}
                  style={{ width: '70px' }}
                />.
              </li>
              <li>
                Rafael is Alonzo&apos;s{' '}
                <input
                  type="text"
                  value={ex3Sentences['5'] || ''}
                  onChange={(e) => onEx3SentencesChange('5', e.target.value)}
                  disabled={readOnly}
                  className={styles.textInputLine}
                  style={{ width: '70px' }}
                />.
              </li>
              <li>
                Cristina is Rafael&apos;s{' '}
                <input
                  type="text"
                  value={ex3Sentences['6'] || ''}
                  onChange={(e) => onEx3SentencesChange('6', e.target.value)}
                  disabled={readOnly}
                  className={styles.textInputLine}
                  style={{ width: '60px' }}
                />.
              </li>
              <li>
                Rosalyn and Esteban are José and Luisa&apos;s{' '}
                <input
                  type="text"
                  value={ex3Sentences['7'] || ''}
                  onChange={(e) => onEx3SentencesChange('7', e.target.value)}
                  disabled={readOnly}
                  className={styles.textInputLine}
                  style={{ width: '70px' }}
                />.
              </li>
              <li>
                Umberto and Maria are Cristina and José&apos;s{' '}
                <input
                  type="text"
                  value={ex3Sentences['8'] || ''}
                  onChange={(e) => onEx3SentencesChange('8', e.target.value)}
                  disabled={readOnly}
                  className={styles.textInputLine}
                  style={{ width: '70px' }}
                />.
              </li>
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
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#214354', margin: '0 0 6px 0' }}>Listening</h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
                <span style={{ color: '#d32027', fontWeight: 800 }}>4 a</span>
                <button
                  type="button"
                  onClick={() => playAudio('2.2')}
                  className={`${styles.audioBtn} ${playingAudio === '2.2' ? styles.playing : ''}`}
                  disabled={readOnly}
                >
                  <span className={styles.diamondIcon}>
                    <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                  </span>
                  <span>2.2</span>
                  <span>{playingAudio === '2.2' ? 'Playing...' : 'Audio'}</span>
                </button>
                <span>Listen and match speakers 1–4 with photos A–D.</span>
              </div>

              {/* Photos A-D */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', margin: '8px 0' }}>
                {[
                  { id: 'A', url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80' },
                  { id: 'B', url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80' },
                  { id: 'C', url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=400&q=80' },
                  { id: 'D', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80' },
                ].map((ph) => (
                  <div key={ph.id} style={{ position: 'relative', height: '90px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <Image src={ph.url} alt={`Photo ${ph.id}`} fill sizes="200px" style={{ objectFit: 'cover' }} unoptimized />
                    <span style={{ position: 'absolute', top: '4px', left: '4px', background: '#78b7cd', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '1px 5px', borderRadius: '2px' }}>
                      {ph.id}
                    </span>
                  </div>
                ))}
              </div>

              {/* Speaker matching row */}
              <div style={{ display: 'flex', gap: '12px', fontSize: '11.5px', marginBottom: '8px' }}>
                {['1', '2', '3', '4'].map((spk) => (
                  <div key={spk} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <strong>Spk {spk}:</strong>
                    <select
                      value={ex4aMatch[spk] || ''}
                      onChange={(e) => onEx4aMatchChange(spk, e.target.value)}
                      disabled={readOnly}
                      style={{ border: '1px solid #cbd5e1', borderRadius: '3px', padding: '1px 3px', fontSize: '11px' }}
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
              <div style={{ fontSize: '11.5px', lineHeight: 1.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                  <span style={{ fontWeight: 700 }}>b</span>
                  <button
                    type="button"
                    onClick={() => playAudio('2.2')}
                    className={`${styles.audioBtn} ${playingAudio === '2.2' ? styles.playing : ''}`}
                    disabled={readOnly}
                  >
                    <span className={styles.diamondIcon}>
                      <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                    </span>
                    <span>2.2</span>
                    <span>{playingAudio === '2.2' ? 'Playing...' : 'Audio'}</span>
                  </button>
                  <span style={{ fontWeight: 700 }}>Listen again and complete the sentences:</span>
                </div>
                <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>
                    1. This is my family. This is <strong>my</strong>{' '}
                    <input
                      type="text"
                      value={ex4bListening['1_husband'] || ''}
                      onChange={(e) => onEx4bListeningChange('1_husband', e.target.value)}
                      disabled={readOnly}
                      placeholder="..."
                      className={styles.textInputLine}
                      style={{ width: '65px' }}
                    />, Jon, and <strong>our</strong>{' '}
                    <input
                      type="text"
                      value={ex4bListening['1_son'] || ''}
                      onChange={(e) => onEx4bListeningChange('1_son', e.target.value)}
                      disabled={readOnly}
                      placeholder="..."
                      className={styles.textInputLine}
                      style={{ width: '55px' }}
                    />. <strong>His</strong> name is James.
                  </li>
                  <li>
                    2. This is a photo of <strong>my</strong>{' '}
                    <input
                      type="text"
                      value={ex4bListening['2_children'] || ''}
                      onChange={(e) => onEx4bListeningChange('2_children', e.target.value)}
                      disabled={readOnly}
                      placeholder="..."
                      className={styles.textInputLine}
                      style={{ width: '65px' }}
                    />. <strong>Their</strong> names are Yuriko and Shinya. And this is <strong>our</strong> dog. <strong>Its</strong> name is Aki.
                  </li>
                  <li>
                    3. This is a photo of <strong>my</strong>{' '}
                    <input
                      type="text"
                      value={ex4bListening['3_sons'] || ''}
                      onChange={(e) => onEx4bListeningChange('3_sons', e.target.value)}
                      disabled={readOnly}
                      placeholder="..."
                      className={styles.textInputLine}
                      style={{ width: '55px' }}
                    />. <strong>Their</strong> names are Jan, Karol and Tomasz.
                  </li>
                  <li>
                    4. This is a photo of <strong>my</strong>{' '}
                    <input
                      type="text"
                      value={ex4bListening['4_parents'] || ''}
                      onChange={(e) => onEx4bListeningChange('4_parents', e.target.value)}
                      disabled={readOnly}
                      placeholder="..."
                      className={styles.textInputLine}
                      style={{ width: '65px' }}
                    />. <strong>My</strong>{' '}
                    <input
                      type="text"
                      value={ex4bListening['4_father'] || ''}
                      onChange={(e) => onEx4bListeningChange('4_father', e.target.value)}
                      disabled={readOnly}
                      placeholder="..."
                      className={styles.textInputLine}
                      style={{ width: '55px' }}
                    />, Tony, is from Canada. <strong>His</strong> family are in Vancouver. <strong>My</strong>{' '}
                    <input
                      type="text"
                      value={ex4bListening['4_mother'] || ''}
                      onChange={(e) => onEx4bListeningChange('4_mother', e.target.value)}
                      disabled={readOnly}
                      placeholder="..."
                      className={styles.textInputLine}
                      style={{ width: '55px' }}
                    />&apos;s name is Lily.
                  </li>
                </ol>
              </div>
            </div>

            {/* Grammar Section */}
            <div className={styles.grammarBox15}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#214354', margin: '0 0 6px 0' }}>Grammar</h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                <span style={{ color: '#d32027', fontWeight: 800 }}>5</span>
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
                  <tr>
                    <td>I</td>
                    <td>
                      <sup>1</sup>
                      <input
                        type="text"
                        value={ex5Grammar['1'] || ''}
                        onChange={(e) => onEx5GrammarChange('1', e.target.value)}
                        disabled={readOnly}
                        className={styles.textInputLine}
                        style={{ width: '50px' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>you</td>
                    <td>your</td>
                  </tr>
                  <tr>
                    <td>he</td>
                    <td>
                      <sup>2</sup>
                      <input
                        type="text"
                        value={ex5Grammar['2'] || ''}
                        onChange={(e) => onEx5GrammarChange('2', e.target.value)}
                        disabled={readOnly}
                        className={styles.textInputLine}
                        style={{ width: '50px' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>she</td>
                    <td>her</td>
                  </tr>
                  <tr>
                    <td>it</td>
                    <td>
                      <sup>3</sup>
                      <input
                        type="text"
                        value={ex5Grammar['3'] || ''}
                        onChange={(e) => onEx5GrammarChange('3', e.target.value)}
                        disabled={readOnly}
                        className={styles.textInputLine}
                        style={{ width: '50px' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>we</td>
                    <td>
                      <sup>4</sup>
                      <input
                        type="text"
                        value={ex5Grammar['4'] || ''}
                        onChange={(e) => onEx5GrammarChange('4', e.target.value)}
                        disabled={readOnly}
                        className={styles.textInputLine}
                        style={{ width: '50px' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>they</td>
                    <td>
                      <sup>5</sup>
                      <input
                        type="text"
                        value={ex5Grammar['5'] || ''}
                        onChange={(e) => onEx5GrammarChange('5', e.target.value)}
                        disabled={readOnly}
                        className={styles.textInputLine}
                        style={{ width: '50px' }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pronunciation 6 */}
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <span style={{ color: '#d32027', fontWeight: 800 }}>6 a</span>
                <button
                  type="button"
                  onClick={() => playAudio('2.3')}
                  className={`${styles.audioBtn} ${playingAudio === '2.3' ? styles.playing : ''}`}
                  disabled={readOnly}
                >
                  <span className={styles.diamondIcon}>
                    <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                  </span>
                  <span>2.3</span>
                  <span>{playingAudio === '2.3' ? 'Playing...' : 'Audio'}</span>
                </button>
                <span style={{ color: '#475569', fontWeight: 600 }}>
                  Listen to the sentences. Do the words in blue sound the same or different?
                </span>
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
                  const origVal = (
                    (originalAnswers?.exercise_6_pronunciation as Record<string, string> | undefined)?.[item.id] || ''
                  ).toUpperCase();
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
                          className={`${styles.choiceBtn} ${currentVal === 'S' || currentVal === 'SAME' ? styles.active : ''}`}
                          aria-label={`Pair ${item.num} Same`}
                        >
                          [ S ] Same
                        </button>
                        <button
                          type="button"
                          disabled={readOnly}
                          onClick={() => onEx6PronunciationChange(item.id, 'D')}
                          className={`${styles.choiceBtn} ${currentVal === 'D' || currentVal === 'DIFFERENT' ? styles.active : ''}`}
                          aria-label={`Pair ${item.num} Different`}
                        >
                          [ D ] Different
                        </button>

                        {readOnly && origVal && (
                          <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>
                            (Student: <strong>{origVal}</strong>)
                          </span>
                        )}
                      </div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                <span style={{ color: '#d32027', fontWeight: 800 }}>7</span>
                <button
                  type="button"
                  onClick={() => playAudio('2.4')}
                  className={`${styles.audioBtn} ${playingAudio === '2.4' ? styles.playing : ''}`}
                  disabled={readOnly}
                >
                  <span className={styles.diamondIcon}>
                    <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                  </span>
                  <span>2.4</span>
                  <span>{playingAudio === '2.4' ? 'Playing...' : 'Audio'}</span>
                </button>
                <span>Choose the correct alternatives.</span>
              </div>

              {/* Photo of Yasemin & Tara */}
              <div style={{ position: 'relative', height: '170px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <Image
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80"
                  alt="Yasemin and Tara"
                  fill
                  sizes="350px"
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>

              {/* Dialogue */}
              <div className={styles.dialogue15}>
                <div className={styles.dialogueRow}>
                  <span className={styles.speaker}>Yasemin:</span>
                  <p>
                    This is a photo of <sup>1</sup>
                    <select
                      value={ex7Dialogue['1'] || ''}
                      onChange={(e) => onEx7DialogueChange('1', e.target.value)}
                      disabled={readOnly}
                      className={styles.altSelect}
                    >
                      <option value="">--</option>
                      <option value="my">my</option>
                      <option value="you">you</option>
                    </select>{' '}
                    family.
                  </p>
                </div>

                <div className={styles.dialogueRow}>
                  <span className={styles.speaker}>Tara:</span>
                  <p>
                    Wow! Is this <sup>2</sup>
                    <select
                      value={ex7Dialogue['2'] || ''}
                      onChange={(e) => onEx7DialogueChange('2', e.target.value)}
                      disabled={readOnly}
                      className={styles.altSelect}
                    >
                      <option value="">--</option>
                      <option value="you">you</option>
                      <option value="your">your</option>
                    </select>{' '}
                    mother and father? What are <sup>3</sup>
                    <select
                      value={ex7Dialogue['3'] || ''}
                      onChange={(e) => onEx7DialogueChange('3', e.target.value)}
                      disabled={readOnly}
                      className={styles.altSelect}
                    >
                      <option value="">--</option>
                      <option value="they're">they&apos;re</option>
                      <option value="their">their</option>
                    </select>{' '}
                    names?
                  </p>
                </div>

                <div className={styles.dialogueRow}>
                  <span className={styles.speaker}>Yasemin:</span>
                  <p>
                    My <sup>4</sup>
                    <select
                      value={ex7Dialogue['4'] || ''}
                      onChange={(e) => onEx7DialogueChange('4', e.target.value)}
                      disabled={readOnly}
                      className={styles.altSelect}
                    >
                      <option value="">--</option>
                      <option value="father's">father&apos;s</option>
                      <option value="father is">father is</option>
                    </select>{' '}
                    name is Emir. <sup>5</sup>
                    <select
                      value={ex7Dialogue['5'] || ''}
                      onChange={(e) => onEx7DialogueChange('5', e.target.value)}
                      disabled={readOnly}
                      className={styles.altSelect}
                    >
                      <option value="">--</option>
                      <option value="He's">He&apos;s</option>
                      <option value="His">His</option>
                    </select>{' '}
                    from Turkey. My mother&apos;s English. <sup>6</sup>
                    <select
                      value={ex7Dialogue['6'] || ''}
                      onChange={(e) => onEx7DialogueChange('6', e.target.value)}
                      disabled={readOnly}
                      className={styles.altSelect}
                    >
                      <option value="">--</option>
                      <option value="His">His</option>
                      <option value="Her">Her</option>
                    </select>{' '}
                    name&apos;s Linda.
                  </p>
                </div>

                <div className={styles.dialogueRow}>
                  <span className={styles.speaker}>Tara:</span>
                  <p>
                    OK. So is this <sup>7</sup>
                    <select
                      value={ex7Dialogue['7'] || ''}
                      onChange={(e) => onEx7DialogueChange('7', e.target.value)}
                      disabled={readOnly}
                      className={styles.altSelect}
                    >
                      <option value="">--</option>
                      <option value="you">you</option>
                      <option value="your">your</option>
                    </select>{' '}
                    brother?
                  </p>
                </div>

                <div className={styles.dialogueRow}>
                  <span className={styles.speaker}>Yasemin:</span>
                  <p>
                    No, it isn&apos;t. That&apos;s <sup>8</sup>
                    <select
                      value={ex7Dialogue['8'] || ''}
                      onChange={(e) => onEx7DialogueChange('8', e.target.value)}
                      disabled={readOnly}
                      className={styles.altSelect}
                    >
                      <option value="">--</option>
                      <option value="our">our</option>
                      <option value="we">we</option>
                    </select>{' '}
                    friend from Ankara. This is my brother here. <sup>9</sup>
                    <select
                      value={ex7Dialogue['9'] || ''}
                      onChange={(e) => onEx7DialogueChange('9', e.target.value)}
                      disabled={readOnly}
                      className={styles.altSelect}
                    >
                      <option value="">--</option>
                      <option value="Her">Her</option>
                      <option value="His">His</option>
                    </select>{' '}
                    name&apos;s Ali.
                  </p>
                </div>

                <div className={styles.dialogueRow}>
                  <span className={styles.speaker}>Tara:</span>
                  <p>
                    Right. What&apos;s your <sup>10</sup>
                    <select
                      value={ex7Dialogue['10'] || ''}
                      onChange={(e) => onEx7DialogueChange('10', e.target.value)}
                      disabled={readOnly}
                      className={styles.altSelect}
                    >
                      <option value="">--</option>
                      <option value="friends">friends</option>
                      <option value="friend's">friend&apos;s</option>
                    </select>{' '}
                    name?
                  </p>
                </div>

                <div className={styles.dialogueRow}>
                  <span className={styles.speaker}>Yasemin:</span>
                  <p>Yusuf. He&apos;s a student in the UK.</p>
                </div>
              </div>
            </div>

            {/* Speaking Section */}
            <div className={styles.speakingSection}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#214354', margin: '4px 0 0 0' }}>Speaking</h2>

              <div>
                <span className={styles.ribbonTag}>PREPARE</span>
                <p style={{ margin: '4px 0', fontSize: '11.5px', fontWeight: 600 }}>
                  <strong>8</strong> Draw a picture of your family, or find a photo on your phone.
                </p>
              </div>

              <div>
                <span className={styles.ribbonTag}>SPEAK</span>
                <p style={{ margin: '4px 0', fontSize: '11.5px', fontWeight: 600 }}>
                  <strong>9</strong> Tell your partner / teacher about your family:
                </p>
                <p style={{ fontSize: '11px', color: '#0369a1', fontStyle: 'italic', margin: '2px 0 6px 0' }}>
                  e.g. &quot;This is a photo of my family. This is my father. His name is Michael. He&apos;s an office worker.&quot;
                </p>
                <textarea
                  value={ex8Notes}
                  onChange={(e) => onEx8NotesChange(e.target.value)}
                  disabled={readOnly}
                  placeholder="Write your family description here..."
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
