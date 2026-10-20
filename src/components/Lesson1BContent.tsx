'use client';

import React from 'react';
import Image from 'next/image';
import styles from './lesson1b.module.scss';
import {
  LessonAnswerKey,
  verifyAnswer,
  getExerciseKey,
} from '@/lib/answerVerification';
import TeacherAnswerBadge from './TeacherAnswerBadge';

export interface ProfileItem {
  id: number;
  name: string;
  city: string;
  country: string;
  imageUrl: string;
  objectPosition?: string;
}

export const profilesData: ProfileItem[] = [
  {
    id: 1,
    name: 'Josh King',
    city: 'Chicago',
    country: 'the US',
    imageUrl: 'https://images.unsplash.com/photo-1600320254374-ce2d293c324e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    name: 'Amy Gardner',
    city: 'Norwich',
    country: 'the UK',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    name: 'Yolanda Alvarez',
    city: 'Guadalajara',
    country: 'Mexico',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    objectPosition: 'center 20%',
  },
  {
    id: 4,
    name: 'Santiago Castillo',
    city: 'Mendoza',
    country: 'Argentina',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    name: 'Emilio Garcia',
    city: 'Valencia',
    country: 'Spain',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    objectPosition: 'center top',
  },
  {
    id: 6,
    name: 'Mali Arak',
    city: 'Chiang Mai',
    country: 'Thailand',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
  },
];

export const vocabularyJobs = [
  { key: 'a', label: 'football player' },
  { key: 'e', label: 'farmer' },
  { key: 'b', label: 'doctor' },
  { key: 'f', label: 'nurse' },
  { key: 'c', label: 'school teacher' },
  { key: 'g', label: 'taxi driver' },
  { key: 'd', label: 'pilot' },
  { key: 'h', label: 'office worker' },
];

export interface Lesson1BContentProps {
  lesson?: Record<string, unknown> | null;
  user?: Record<string, unknown> | null;
  isTeacherReview?: boolean;
  answerKey?: LessonAnswerKey | null;
  jobsInputs: Record<string, string>;
  readingInputs: Record<string, string>;
  onJobChange: (id: string, value: string) => void;
  onReadingChange: (id: string, value: string) => void;
  page9Profiles?: Record<string, string>;
  onPage9ProfileChange?: (id: string, value: string) => void;
  ex4aAnswers?: Record<string, string>;
  onEx4aChange?: (qId: string, value: string) => void;
  grammar5aInputs?: Record<string, string>;
  onGrammar5aChange?: (id: string, value: string) => void;
  ex6Answers?: Record<string, string>;
  onEx6Change?: (qId: string, value: string) => void;
  ex7aAnswers?: Record<string, string>;
  onEx7aChange?: (qId: string, value: string) => void;
  profilePairs?: {
    woman?: { name?: string; job?: string; city?: string; country?: string };
    man?: { name?: string; job?: string; city?: string; country?: string };
  };
  onProfilePairChange?: (gender: 'woman' | 'man', field: string, value: string) => void;
  readOnly?: boolean;
  originalAnswers?: {
    exercise_1b_jobs?: Record<string, string>;
    exercise_3_reading?: Record<string, string>;
    exercise_page9_profiles?: Record<string, string>;
    exercise_4a_reading?: Record<string, string>;
    exercise_5a_grammar?: Record<string, string>;
    exercise_6_dialogue?: Record<string, string>;
    exercise_7a_qa?: Record<string, string>;
    exercise_7b_profiles?: Record<string, unknown>;
  };
  playAudio: (track: string) => void;
  playingAudio: string | null;
}

export default function Lesson1BContent(props: Lesson1BContentProps) {
  const {
    jobsInputs = {},
    readingInputs = {},
    onJobChange,
    onReadingChange,
    page9Profiles = {},
    onPage9ProfileChange = () => {},
    ex4aAnswers = {},
    onEx4aChange = () => {},
    grammar5aInputs = {},
    onGrammar5aChange = () => {},
    ex6Answers = {},
    onEx6Change = () => {},
    ex7aAnswers = {},
    onEx7aChange = () => {},
    profilePairs = {},
    onProfilePairChange = () => {},
    readOnly = false,
    originalAnswers,
    playAudio,
    playingAudio,
    isTeacherReview,
    answerKey,
  } = props;

  const activeAnswerKey: LessonAnswerKey | null =
    answerKey || (props.lesson?.answerKey as LessonAnswerKey | undefined) || null;
  const isReview = Boolean(isTeacherReview || (activeAnswerKey && readOnly));

  const ex1bJobsKeys = getExerciseKey(activeAnswerKey, 'exercise_1b_jobs');
  const ex3ReadingKeys = getExerciseKey(activeAnswerKey, 'exercise_3_reading');
  const exPage9Keys = getExerciseKey(activeAnswerKey, 'exercise_page9_profiles');
  const ex4aReadingKeys = getExerciseKey(activeAnswerKey, 'exercise_4a_reading');
  const ex5aGrammarKeys = getExerciseKey(activeAnswerKey, 'exercise_5a_grammar');
  const ex6DialogueKeys = getExerciseKey(activeAnswerKey, 'exercise_6_dialogue');
  const ex7aQaKeys = getExerciseKey(activeAnswerKey, 'exercise_7a_qa');
  return (
    <div className={styles.pageContainer}>
      {/* Lesson Header */}
      <header className={styles.headerSection}>
        <div className={styles.titleArea}>
          <div className={styles.badgeBox}>
            <span>1</span>B
          </div>
          <div>
            <h1 className={styles.lessonTitle}>1B Jobs</h1>
            <p className={styles.lessonSubtitle}>Interactive Student&apos;s Book Page (p. 8)</p>
          </div>
        </div>

        <div className={styles.goalsCard}>
          <p>🎯 <strong>Goal:</strong> ask and answer about jobs</p>
          <p>📖 <strong>Grammar:</strong> be (he/she/it)</p>
          <p>🎓 <strong>Vocabulary:</strong> jobs</p>
        </div>
      </header>

      {/* Exercise 1: Profiles & World Map */}
      <section className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              <span className={styles.stepNum}>1</span>
              <span><strong>a</strong> Look at the map and the profiles. Where are the people from?</span>
            </h2>
            <p className={styles.sectionSubtext}>
              <strong>b</strong> Complete 1–6 in the profiles with jobs a–h from the vocabulary list.
            </p>
          </div>
        </div>

        <div className={styles.worldMapGrid}>
          {profilesData.map((profile) => {
            const currentVal = jobsInputs[String(profile.id)] || '';
            const origVal = originalAnswers?.exercise_1b_jobs?.[String(profile.id)];
            const isChanged = origVal !== undefined && origVal !== currentVal;
            const verification = isReview
              ? verifyAnswer(currentVal, ex1bJobsKeys?.[String(profile.id)])
              : null;

            return (
              <div key={profile.id} className={styles.profileCard}>
                <div className={styles.profileImageWrap}>
                  <Image
                    src={profile.imageUrl}
                    alt={profile.name}
                    fill
                    priority={profile.id <= 3}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{
                      objectFit: 'cover',
                      objectPosition: profile.objectPosition || 'center',
                    }}
                    unoptimized
                  />
                  <span className={styles.profileNumber}>{profile.id}</span>
                </div>
                <div className={styles.profileContent}>
                  <p className={styles.profileName}>Name: {profile.name}</p>
                  <p><strong>City:</strong> {profile.city}</p>
                  <p><strong>Country:</strong> {profile.country}</p>
                  <div className={styles.jobField}>
                    <strong>Job:</strong>
                    <span className={styles.jobBadgeNum}>{profile.id}</span>
                    <input
                      type="text"
                      list="vocabulary-jobs-list"
                      value={currentVal}
                      onChange={(e) => onJobChange(String(profile.id), e.target.value)}
                      placeholder="select or enter job..."
                      disabled={readOnly}
                      className={`${styles.jobInput} ${isChanged ? styles.diffHighlight : ''} ${
                        verification?.status === 'correct'
                          ? styles.inputValid
                          : verification?.status === 'incorrect'
                          ? styles.inputInvalid
                          : ''
                      }`}
                    />
                    {verification && <TeacherAnswerBadge result={verification} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <datalist id="vocabulary-jobs-list">
          {vocabularyJobs.map((item) => (
            <option key={item.key} value={item.label} />
          ))}
        </datalist>
      </section>

      {/* Two Columns: Vocabulary/Audio & Reading/Hospital */}
      <div className={styles.twoColLayout}>
        {/* Left Column: Vocabulary, Audio 1.6 & Pair work */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.stepNum}>1</span>
              <span>Vocabulary &amp; Pronunciation</span>
            </h2>
          </div>

          <div className={styles.vocabBox}>
            <p className={styles.vocabTitle}>Match 1–8 in the profiles with jobs a–h:</p>
            <div className={styles.vocabGrid}>
              {vocabularyJobs.map((item) => (
                <div key={item.key}>
                  <span>{item.key}</span> {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Audio 1.6 */}
          <div className={`${styles.audioRow} ${playingAudio === '1.6' ? styles.audioRowActive : ''}`}>
            <div className={styles.audioInfo}>
              <span className={styles.audioBadge}>1.6</span>
              <p>
                Listen and underline the stressed syllables in the jobs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => playAudio('1.6')}
              className={`${styles.audioBtn} ${playingAudio === '1.6' ? styles.audioBtnActive : ''}`}
              title={playingAudio === '1.6' ? 'Pause Audio' : 'Play Audio 1.6'}
            >
              {playingAudio === '1.6' ? (
                <>
                  <div className={styles.equalizer}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                  </div>
                  <span>Playing 1.6</span>
                </>
              ) : (
                '▶ Audio 1.6'
              )}
            </button>
          </div>

          {/* Syllable Stress Reference Box */}
          <div className={styles.stressBox}>
            <h4>Syllable stress in jobs:</h4>
            <div className={styles.stressList}>
              <span>• <strong>foot</strong>-ball <strong>play</strong>-er</span>
              <span>• <strong>doc</strong>-tor</span>
              <span>• <strong>school</strong> <strong>teach</strong>-er</span>
              <span>• <strong>pi</strong>-lot</span>
              <span>• <strong>farm</strong>-er</span>
              <span>• <strong>nurse</strong></span>
              <span>• <strong>tax</strong>-i <strong>driv</strong>-er</span>
              <span>• <strong>of</strong>-fice <strong>work</strong>-er</span>
            </div>
          </div>

          {/* Exercise 2: Pair Work Speaking Dialogue */}
          <div className={styles.pairworkCard}>
            <h4><strong>2</strong> Work in pairs. Choose a person from Exercise 1a:</h4>
            <div className={styles.dialogueBox}>
              <p><span className={styles.speakerA}>A:</span> Are you from Poland?</p>
              <p><span className={styles.speakerB}>B:</span> No, I&apos;m not.</p>
              <p><span className={styles.speakerA}>A:</span> Are you a football player?</p>
              <p><span className={styles.speakerB}>B:</span> Yes, I am. I&apos;m Santiago.</p>
            </div>
          </div>
        </section>

        {/* Right Column: Reading (Exercise 3) & Green Cross Hospital */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.stepNum}>3</span>
              <span>Reading &amp; Matching</span>
            </h2>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>
            Read the web page below. Match people 1–3 with jobs a–c:
          </p>

          <div className={styles.matchingContainer}>
            <div className={styles.matchingQuestions}>
              {[
                { id: '1', name: '1. Lucy' },
                { id: '2', name: '2. Paul' },
                { id: '3', name: '3. Mila' },
              ].map((person) => {
                const currentVal = readingInputs[person.id] || '';
                const origVal = originalAnswers?.exercise_3_reading?.[person.id];
                const isChanged = origVal !== undefined && origVal !== currentVal;
                const verification = isReview
                  ? verifyAnswer(currentVal, ex3ReadingKeys?.[person.id])
                  : null;

                return (
                  <div key={person.id} className={styles.matchingRow}>
                    <span>{person.name}</span>
                    <select
                      value={currentVal}
                      onChange={(e) => onReadingChange(person.id, e.target.value)}
                      disabled={readOnly}
                      className={`${styles.matchingSelect} ${isChanged ? styles.diffHighlight : ''} ${
                        verification?.status === 'correct'
                          ? styles.inputValid
                          : verification?.status === 'incorrect'
                          ? styles.inputInvalid
                          : ''
                      }`}
                    >
                      <option value="">- select -</option>
                      <option value="a">a (office worker)</option>
                      <option value="b">b (doctor)</option>
                      <option value="c">c (nurse)</option>
                    </select>
                    {verification && <TeacherAnswerBadge result={verification} />}
                  </div>
                );
              })}
            </div>


            <div className={styles.matchingOptions}>
              <p><strong>a</strong> office worker</p>
              <p><strong>b</strong> doctor</p>
              <p><strong>c</strong> nurse</p>
            </div>
          </div>

          {/* Hospital Web Simulator */}
          <div className={styles.hospitalCard}>
            <div className={styles.hospitalHeader}>
              🏥 Green Cross Hospital
            </div>
            <div className={styles.hospitalSubHeader}>
              About us
            </div>
            <div className={styles.hospitalBody}>
              <p>Green Cross Hospital is a small hospital. It&apos;s in Manchester in the UK.</p>
              <span className={styles.staffSectionTitle}>Hospital staff</span>
              <ul>
                <li>
                  <strong>Lucy Brown</strong>
                  <br />
                  Lucy is from London. She&apos;s a doctor.
                </li>
                <li>
                  <strong>Paul Turner</strong>
                  <br />
                  Paul is from Manchester. He&apos;s a nurse.
                </li>
                <li>
                  <strong>Mila Kowalski</strong>
                  <br />
                  Mila is from Toronto. She&apos;s an office worker at the hospital.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* PAGE 9: GRAMMAR & PRACTICE */}
      <div className={styles.pageDivider}>
        <span className={styles.pageTag}>PAGE 9</span>
        <h3>Jobs &amp; Grammar Practice</h3>
      </div>

      <div className={styles.twoColLayout}>
        {/* Left Column: Profiles, Exercise 4a, 4b, Grammar 5a, Audio 5b/c */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Profiles: Lidia Nowak & Sakura Sato */}
          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>★</span>
                <span>Profiles: Lidia &amp; Sakura</span>
              </h2>
            </div>

            <div className={styles.page9ProfilesGrid}>
              {/* Lidia Nowak */}
              {(() => {
                const currentVal = page9Profiles['lidia'] || '';
                const origVal = originalAnswers?.exercise_page9_profiles?.['lidia'];
                const isChanged = origVal !== undefined && origVal !== currentVal;
                const v = isReview ? verifyAnswer(currentVal, exPage9Keys?.['lidia']) : null;
                return (
                  <div className={styles.miniProfileCard}>
                    <div className={styles.miniPhotoWrap}>
                      <Image
                        src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=300&q=80"
                        alt="Lidia Nowak"
                        fill
                        sizes="(max-width: 768px) 50vw, 200px"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                      <span className={styles.photoLabel}>Pilot</span>
                    </div>
                    <div className={styles.nameBadge}>Name: Lidia Nowak</div>
                    <div className={styles.details}>
                      <p>
                        <strong>Job:</strong>{' '}
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => onPage9ProfileChange('lidia', e.target.value)}
                          placeholder="e.g. pilot..."
                          disabled={readOnly}
                          className={`${styles.miniInput} ${isChanged ? styles.diffHighlight : ''} ${
                            v?.status === 'correct'
                              ? styles.inputValid
                              : v?.status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                          }`}
                        />
                        {v && <TeacherAnswerBadge result={v} />}
                      </p>
                      <p><strong>City:</strong> Toruń</p>
                      <p><strong>Country:</strong> Poland</p>
                    </div>
                  </div>
                );
              })()}

              {/* Sakura Sato */}
              {(() => {
                const currentVal = page9Profiles['sakura'] || '';
                const origVal = originalAnswers?.exercise_page9_profiles?.['sakura'];
                const isChanged = origVal !== undefined && origVal !== currentVal;
                const v = isReview ? verifyAnswer(currentVal, exPage9Keys?.['sakura']) : null;
                return (
                  <div className={styles.miniProfileCard}>
                    <div className={styles.miniPhotoWrap}>
                      <Image
                        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80"
                        alt="Sakura Sato"
                        fill
                        sizes="(max-width: 768px) 50vw, 200px"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                      <span className={styles.photoLabel}>Architect</span>
                    </div>
                    <div className={styles.nameBadge}>Name: Sakura Sato</div>
                    <div className={styles.details}>
                      <p>
                        <strong>Job:</strong>{' '}
                        <input
                          type="text"
                          value={currentVal}
                          onChange={(e) => onPage9ProfileChange('sakura', e.target.value)}
                          placeholder="e.g. architect..."
                          disabled={readOnly}
                          className={`${styles.miniInput} ${isChanged ? styles.diffHighlight : ''} ${
                            v?.status === 'correct'
                              ? styles.inputValid
                              : v?.status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                          }`}
                        />
                        {v && <TeacherAnswerBadge result={v} />}
                      </p>
                      <p><strong>City:</strong> Nagoya</p>
                      <p><strong>Country:</strong> Japan</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>

          {/* Exercise 4a */}
          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>4a</span>
                <span>Read the web page again. Choose the correct option (a or b):</span>
              </h2>
            </div>

            <div className={styles.ex4aContainer}>
              {[
                {
                  id: '1',
                  q: '1. Is the hospital in London?',
                  options: [
                    { val: 'a', text: 'Yes, it is.' },
                    { val: 'b', text: "No, it isn't." },
                  ],
                },
                {
                  id: '2',
                  q: '2. Is Paul from the UK?',
                  options: [
                    { val: 'a', text: 'Yes, he is.' },
                    { val: 'b', text: "No, he isn't." },
                  ],
                },
                {
                  id: '3',
                  q: '3. Is Mila a doctor?',
                  options: [
                    { val: 'a', text: "No, she isn't a doctor. She's a nurse." },
                    { val: 'b', text: "No, she isn't a doctor. She's an office worker." },
                  ],
                },
              ].map((item) => {
                const currentVal = ex4aAnswers[item.id] || '';
                const origVal = originalAnswers?.exercise_4a_reading?.[item.id];
                const isChanged = origVal !== undefined && origVal !== currentVal;
                const verification = isReview
                  ? verifyAnswer(currentVal, ex4aReadingKeys?.[item.id])
                  : null;

                return (
                  <div key={item.id} className={styles.ex4aItem}>
                    <p>{item.q}</p>
                    <div className={styles.radioGroup}>
                      {item.options.map((opt) => (
                        <label
                          key={opt.val}
                          className={
                            verification && currentVal === opt.val
                              ? verification.status === 'correct'
                                ? styles.choiceValid
                                : styles.choiceInvalid
                              : ''
                          }
                        >
                          <input
                            type="radio"
                            name={`ex4a_${item.id}`}
                            value={opt.val}
                            checked={currentVal === opt.val}
                            onChange={() => onEx4aChange(item.id, opt.val)}
                            disabled={readOnly}
                            className={isChanged ? styles.diffHighlight : ''}
                          />
                          <span className={styles.optionLetter}>{opt.val}</span>
                          <span>{opt.text}</span>
                        </label>
                      ))}
                      {verification && <TeacherAnswerBadge result={verification} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>


          {/* Exercise 4b */}
          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>4b</span>
                <span>Notice the verb forms:</span>
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
              Underline all the examples of <strong style={{ color: '#dc2626' }}>&apos;s</strong>,{' '}
              <strong style={{ color: '#dc2626' }}>is</strong> and{' '}
              <strong style={{ color: '#dc2626' }}>isn&apos;t</strong> in Exercises 3 and 4a.
            </p>
          </section>

          {/* Grammar Section 5a */}
          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>5a</span>
                <span>Grammar: be (he/she/it)</span>
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>
              Read and complete the grammar box with <strong style={{ color: '#dc2626' }}>&apos;s</strong> and{' '}
              <strong style={{ color: '#dc2626' }}>isn&apos;t</strong>:
            </p>

            <div className={styles.grammarBox}>
              <span className={styles.grammarSubheader}>be: he/she/it</span>

              <table className={styles.grammarTable}>
                <thead>
                  <tr>
                    <th style={{ width: '50%' }}>+ (positive)</th>
                    <th style={{ width: '50%' }}>- (negative)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>He<strong>&apos;s</strong> a nurse.</td>
                    <td>He <strong>isn&apos;t</strong> from the UK.</td>
                  </tr>
                  <tr>
                    <td>
                      She{' '}
                      {(() => {
                        const val = grammar5aInputs['1'] || '';
                        const v = isReview ? verifyAnswer(val, ex5aGrammarKeys?.['1']) : null;
                        return (
                          <>
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => onGrammar5aChange('1', e.target.value)}
                              placeholder="?"
                              disabled={readOnly}
                              className={`${styles.grammarInput} ${
                                originalAnswers?.exercise_5a_grammar?.['1'] !== undefined &&
                                originalAnswers?.exercise_5a_grammar?.['1'] !== val
                                  ? styles.diffHighlight
                                  : ''
                              } ${
                                v?.status === 'correct'
                                  ? styles.inputValid
                                  : v?.status === 'incorrect'
                                  ? styles.inputInvalid
                                  : ''
                              }`}
                            />
                            {v && <TeacherAnswerBadge result={v} />}
                          </>
                        );
                      })()}{' '}
                      a doctor.
                    </td>
                    <td>She <strong>isn&apos;t</strong> from Canada.</td>
                  </tr>
                  <tr>
                    <td>
                      It{' '}
                      {(() => {
                        const val = grammar5aInputs['2'] || '';
                        const v = isReview ? verifyAnswer(val, ex5aGrammarKeys?.['2']) : null;
                        return (
                          <>
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => onGrammar5aChange('2', e.target.value)}
                              placeholder="?"
                              disabled={readOnly}
                              className={`${styles.grammarInput} ${
                                originalAnswers?.exercise_5a_grammar?.['2'] !== undefined &&
                                originalAnswers?.exercise_5a_grammar?.['2'] !== val
                                  ? styles.diffHighlight
                                  : ''
                              } ${
                                v?.status === 'correct'
                                  ? styles.inputValid
                                  : v?.status === 'incorrect'
                                  ? styles.inputInvalid
                                  : ''
                              }`}
                            />
                            {v && <TeacherAnswerBadge result={v} />}
                          </>
                        );
                      })()}{' '}
                      a small hospital.
                    </td>
                    <td>
                      It{' '}
                      {(() => {
                        const val = grammar5aInputs['3'] || '';
                        const v = isReview ? verifyAnswer(val, ex5aGrammarKeys?.['3']) : null;
                        return (
                          <>
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => onGrammar5aChange('3', e.target.value)}
                              placeholder="?"
                              disabled={readOnly}
                              className={`${styles.grammarInput} ${
                                originalAnswers?.exercise_5a_grammar?.['3'] !== undefined &&
                                originalAnswers?.exercise_5a_grammar?.['3'] !== val
                                  ? styles.diffHighlight
                                  : ''
                              } ${
                                v?.status === 'correct'
                                  ? styles.inputValid
                                  : v?.status === 'incorrect'
                                  ? styles.inputInvalid
                                  : ''
                              }`}
                            />
                            {v && <TeacherAnswerBadge result={v} />}
                          </>
                        );
                      })()}{' '}
                      a big hospital.
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className={styles.grammarTable}>
                <thead>
                  <tr>
                    <th style={{ width: '34%' }}>? (questions)</th>
                    <th style={{ width: '33%' }}>+ (short answers)</th>
                    <th style={{ width: '33%' }}>- (short answers)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Is he</strong> from the UK?</td>
                    <td>Yes, <strong>he is</strong>.</td>
                    <td>No, <strong>he isn&apos;t</strong>.</td>
                  </tr>
                  <tr>
                    <td><strong>Is she</strong> a doctor?</td>
                    <td>Yes, <strong>she is</strong>.</td>
                    <td>No, <strong>she isn&apos;t</strong>.</td>
                  </tr>
                  <tr>
                    <td><strong>Is it</strong> in London?</td>
                    <td>Yes, <strong>it is</strong>.</td>
                    <td>No, <strong>it isn&apos;t</strong>.</td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.whereBox}>
                <div>
                  <strong>with where</strong><br />
                  <span style={{ fontStyle: 'italic' }}><strong>Where</strong>&apos;s she from?</span>
                </div>
                <div>
                  <strong>Answer:</strong> She{' '}
                  {(() => {
                    const val = grammar5aInputs['4'] || '';
                    const v = isReview ? verifyAnswer(val, ex5aGrammarKeys?.['4']) : null;
                    return (
                      <>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => onGrammar5aChange('4', e.target.value)}
                          placeholder="?"
                          disabled={readOnly}
                          className={`${styles.grammarInput} ${
                            originalAnswers?.exercise_5a_grammar?.['4'] !== undefined &&
                            originalAnswers?.exercise_5a_grammar?.['4'] !== val
                              ? styles.diffHighlight
                              : ''
                          } ${
                            v?.status === 'correct'
                              ? styles.inputValid
                              : v?.status === 'incorrect'
                              ? styles.inputInvalid
                              : ''
                          }`}
                        />
                        {v && <TeacherAnswerBadge result={v} />}
                      </>
                    );
                  })()}{' '}
                  from Spain.
                </div>
              </div>
            </div>

          </section>

          {/* Audio 5b & 5c */}
          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>5b</span>
                <span>Pronunciation: Short forms</span>
              </h2>
            </div>

            <div className={`${styles.audioRow} ${playingAudio === '1.7' ? styles.audioRowActive : ''}`}>
              <div className={styles.audioInfo}>
                <span className={styles.audioBadge}>1.7</span>
                <p>Listen to the sentences. Notice the pronunciation of the short forms in blue. Listen again and repeat (5c).</p>
              </div>
              <button
                type="button"
                onClick={() => playAudio('1.7')}
                className={`${styles.audioBtn} ${playingAudio === '1.7' ? styles.audioBtnActive : ''}`}
                title={playingAudio === '1.7' ? 'Pause Audio' : 'Play Audio 1.7'}
              >
                {playingAudio === '1.7' ? (
                  <>
                    <div className={styles.equalizer}>
                      <div className={styles.bar}></div>
                      <div className={styles.bar}></div>
                      <div className={styles.bar}></div>
                    </div>
                    <span>Playing 1.7</span>
                  </>
                ) : (
                  '▶ Audio 1.7'
                )}
              </button>
            </div>

            <ol className={styles.shortFormsList}>
              <li>1. She<span className={styles.shortFormHighlight}>&apos;s</span> a doctor.</li>
              <li>2. He<span className={styles.shortFormHighlight}>&apos;s</span> a nurse.</li>
              <li>3. It<span className={styles.shortFormHighlight}>&apos;s</span> a small hospital.</li>
              <li>4. Where<span className={styles.shortFormHighlight}>&apos;s</span> she from?</li>
              <li>5. She <span className={styles.shortFormHighlight}>isn&apos;t</span> a doctor.</li>
              <li>6. Mila<span className={styles.shortFormHighlight}>&apos;s</span> an office worker.</li>
            </ol>
          </section>
        </div>

        {/* Right Column: Exercise 6, 7a, 7b, Speaking 8 & 9 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Exercise 6: Dialogue with alternatives */}
          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>6</span>
                <span>Choose the correct alternatives:</span>
              </h2>
            </div>

            <div
              className={`${styles.audioRow} ${playingAudio === '1.8' ? styles.audioRowActive : ''}`}
              style={{ marginBottom: '1rem' }}
            >
              <div className={styles.audioInfo}>
                <span className={styles.audioBadge}>1.8</span>
                <p>Listen and check your answers.</p>
              </div>
              <button
                type="button"
                onClick={() => playAudio('1.8')}
                className={`${styles.audioBtn} ${playingAudio === '1.8' ? styles.audioBtnActive : ''}`}
                title={playingAudio === '1.8' ? 'Pause Audio' : 'Play Audio 1.8'}
              >
                {playingAudio === '1.8' ? (
                  <>
                    <div className={styles.equalizer}>
                      <div className={styles.bar}></div>
                      <div className={styles.bar}></div>
                      <div className={styles.bar}></div>
                    </div>
                    <span>Playing 1.8</span>
                  </>
                ) : (
                  '▶ Audio 1.8'
                )}
              </button>
            </div>

            <div className={styles.dialogue6Box}>
              <p>
                <span className={styles.speakerA}>A:</span> So, Patrick are you a football player?
              </p>
              <p>
                <span className={styles.speakerB}>B:</span> Yes,{' '}
                {(() => {
                  const val = ex6Answers['1'] || '';
                  const v = isReview ? verifyAnswer(val, ex6DialogueKeys?.['1']) : null;
                  return (
                    <>
                      <select
                        value={val}
                        onChange={(e) => onEx6Change('1', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inlineSelect} ${
                          originalAnswers?.exercise_6_dialogue?.['1'] !== undefined &&
                          originalAnswers?.exercise_6_dialogue?.['1'] !== val
                            ? styles.diffHighlight
                            : ''
                        } ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      >
                        <option value="">- select -</option>
                        <option value="'m">&apos;m</option>
                        <option value="it is">it is</option>
                      </select>
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                a football player in the UK.
              </p>
              <p>
                <span className={styles.speakerA}>A:</span>{' '}
                {(() => {
                  const val = ex6Answers['2'] || '';
                  const v = isReview ? verifyAnswer(val, ex6DialogueKeys?.['2']) : null;
                  return (
                    <>
                      <select
                        value={val}
                        onChange={(e) => onEx6Change('2', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inlineSelect} ${
                          originalAnswers?.exercise_6_dialogue?.['2'] !== undefined &&
                          originalAnswers?.exercise_6_dialogue?.['2'] !== val
                            ? styles.diffHighlight
                            : ''
                        } ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      >
                        <option value="">- select -</option>
                        <option value="It is">It is</option>
                        <option value="Is it">Is it</option>
                      </select>
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                a good team?
              </p>
              <p>
                <span className={styles.speakerB}>B:</span> Yes,{' '}
                {(() => {
                  const val = ex6Answers['3'] || '';
                  const v = isReview ? verifyAnswer(val, ex6DialogueKeys?.['3']) : null;
                  return (
                    <>
                      <select
                        value={val}
                        onChange={(e) => onEx6Change('3', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inlineSelect} ${
                          originalAnswers?.exercise_6_dialogue?.['3'] !== undefined &&
                          originalAnswers?.exercise_6_dialogue?.['3'] !== val
                            ? styles.diffHighlight
                            : ''
                        } ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      >
                        <option value="">- select -</option>
                        <option value="it is">it is</option>
                        <option value="it's">it&apos;s</option>
                      </select>
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}
                .
              </p>
              <p>
                <span className={styles.speakerA}>A:</span>{' '}
                {(() => {
                  const val = ex6Answers['4'] || '';
                  const v = isReview ? verifyAnswer(val, ex6DialogueKeys?.['4']) : null;
                  return (
                    <>
                      <select
                        value={val}
                        onChange={(e) => onEx6Change('4', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inlineSelect} ${
                          originalAnswers?.exercise_6_dialogue?.['4'] !== undefined &&
                          originalAnswers?.exercise_6_dialogue?.['4'] !== val
                            ? styles.diffHighlight
                            : ''
                        } ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      >
                        <option value="">- select -</option>
                        <option value="Is the manager">Is the manager</option>
                        <option value="The manager is">The manager is</option>
                      </select>
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                nice?
              </p>
              <p>
                <span className={styles.speakerB}>B:</span> Yes,{' '}
                {(() => {
                  const val = ex6Answers['5'] || '';
                  const v = isReview ? verifyAnswer(val, ex6DialogueKeys?.['5']) : null;
                  return (
                    <>
                      <select
                        value={val}
                        onChange={(e) => onEx6Change('5', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inlineSelect} ${
                          originalAnswers?.exercise_6_dialogue?.['5'] !== undefined &&
                          originalAnswers?.exercise_6_dialogue?.['5'] !== val
                            ? styles.diffHighlight
                            : ''
                        } ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      >
                        <option value="">- select -</option>
                        <option value="he's">he&apos;s</option>
                        <option value="is he">is he</option>
                      </select>
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                OK.
              </p>
              <p>
                <span className={styles.speakerA}>A:</span>{' '}
                {(() => {
                  const val = ex6Answers['6'] || '';
                  const v = isReview ? verifyAnswer(val, ex6DialogueKeys?.['6']) : null;
                  return (
                    <>
                      <select
                        value={val}
                        onChange={(e) => onEx6Change('6', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inlineSelect} ${
                          originalAnswers?.exercise_6_dialogue?.['6'] !== undefined &&
                          originalAnswers?.exercise_6_dialogue?.['6'] !== val
                            ? styles.diffHighlight
                            : ''
                        } ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      >
                        <option value="">- select -</option>
                        <option value="He's">He&apos;s</option>
                        <option value="Is he">Is he</option>
                      </select>
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                from the UK?
              </p>
              <p>
                <span className={styles.speakerB}>B:</span> No,{' '}
                {(() => {
                  const val = ex6Answers['7'] || '';
                  const v = isReview ? verifyAnswer(val, ex6DialogueKeys?.['7']) : null;
                  return (
                    <>
                      <select
                        value={val}
                        onChange={(e) => onEx6Change('7', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inlineSelect} ${
                          originalAnswers?.exercise_6_dialogue?.['7'] !== undefined &&
                          originalAnswers?.exercise_6_dialogue?.['7'] !== val
                            ? styles.diffHighlight
                            : ''
                        } ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      >
                        <option value="">- select -</option>
                        <option value="he isn't">he isn&apos;t</option>
                        <option value="not">not</option>
                      </select>
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}
                .
              </p>
              <p>
                <span className={styles.speakerA}>A:</span> Where{' '}
                {(() => {
                  const val = ex6Answers['8'] || '';
                  const v = isReview ? verifyAnswer(val, ex6DialogueKeys?.['8']) : null;
                  return (
                    <>
                      <select
                        value={val}
                        onChange={(e) => onEx6Change('8', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inlineSelect} ${
                          originalAnswers?.exercise_6_dialogue?.['8'] !== undefined &&
                          originalAnswers?.exercise_6_dialogue?.['8'] !== val
                            ? styles.diffHighlight
                            : ''
                        } ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      >
                        <option value="">- select -</option>
                        <option value="'s he">&apos;s he</option>
                        <option value="he">he</option>
                      </select>
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                from?
              </p>
              <p>
                <span className={styles.speakerB}>B:</span>{' '}
                {(() => {
                  const val = ex6Answers['9'] || '';
                  const v = isReview ? verifyAnswer(val, ex6DialogueKeys?.['9']) : null;
                  return (
                    <>
                      <select
                        value={val}
                        onChange={(e) => onEx6Change('9', e.target.value)}
                        disabled={readOnly}
                        className={`${styles.inlineSelect} ${
                          originalAnswers?.exercise_6_dialogue?.['9'] !== undefined &&
                          originalAnswers?.exercise_6_dialogue?.['9'] !== val
                            ? styles.diffHighlight
                            : ''
                        } ${
                          v?.status === 'correct'
                            ? styles.inputValid
                            : v?.status === 'incorrect'
                            ? styles.inputInvalid
                            : ''
                        }`}
                      >
                        <option value="">- select -</option>
                        <option value="He's">He&apos;s</option>
                        <option value="is from">is from</option>
                      </select>
                      {v && <TeacherAnswerBadge result={v} />}
                    </>
                  );
                })()}{' '}
                Argentina.
              </p>
            </div>
          </section>

          {/* Exercise 7a & 7b */}
          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>7a</span>
                <span>Answer the questions about profiles:</span>
              </h2>
            </div>

            <ol className={styles.qaList}>
              <li>
                1. Is Mali from Japan?
                <span className={styles.exampleAnswer}>No, she isn&apos;t. She&apos;s from Thailand.</span>
              </li>
              {[
                { id: '2', q: '2. Is Santiago a pilot?' },
                { id: '3', q: '3. Is Sakura a farmer?' },
                { id: '4', q: '4. Is Emilio a doctor?' },
                { id: '5', q: '5. Is Josh a school teacher?' },
                { id: '6', q: '6. Is Yolanda a doctor?' },
              ].map((item) => {
                const currentVal = ex7aAnswers[item.id] || '';
                const origVal = originalAnswers?.exercise_7a_qa?.[item.id];
                const isChanged = origVal !== undefined && origVal !== currentVal;
                const v = isReview ? verifyAnswer(currentVal, ex7aQaKeys?.[item.id]) : null;

                return (
                  <li key={item.id}>
                    {item.q}
                    <input
                      type="text"
                      value={currentVal}
                      onChange={(e) => onEx7aChange(item.id, e.target.value)}
                      placeholder="Type answer..."
                      disabled={readOnly}
                      className={`${styles.qaInput} ${isChanged ? styles.diffHighlight : ''} ${
                        v?.status === 'correct'
                          ? styles.inputValid
                          : v?.status === 'incorrect'
                          ? styles.inputInvalid
                          : ''
                      }`}
                    />
                    {v && <TeacherAnswerBadge result={v} />}
                  </li>
                );
              })}
            </ol>


            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.stepNum}>7b</span>
                <span>Complete the profiles for two people (pair work):</span>
              </h2>

              <div className={styles.partnerProfilesGrid}>
                {/* Pink Card: Woman */}
                <div className={`${styles.partnerCard} ${styles.pinkCard}`}>
                  <div className={styles.partnerInputs}>
                    <p>
                      <strong>Name:</strong>{' '}
                      <input
                        type="text"
                        value={profilePairs?.woman?.name || ''}
                        onChange={(e) => onProfilePairChange('woman', 'name', e.target.value)}
                        placeholder="e.g. Maria"
                        disabled={readOnly}
                      />
                    </p>
                    <p>
                      <strong>Job:</strong>{' '}
                      <input
                        type="text"
                        value={profilePairs?.woman?.job || ''}
                        onChange={(e) => onProfilePairChange('woman', 'job', e.target.value)}
                        placeholder="e.g. architect"
                        disabled={readOnly}
                      />
                    </p>
                    <p>
                      <strong>City:</strong>{' '}
                      <input
                        type="text"
                        value={profilePairs?.woman?.city || ''}
                        onChange={(e) => onProfilePairChange('woman', 'city', e.target.value)}
                        placeholder="e.g. Madrid"
                        disabled={readOnly}
                      />
                    </p>
                    <p>
                      <strong>Country:</strong>{' '}
                      <input
                        type="text"
                        value={profilePairs?.woman?.country || ''}
                        onChange={(e) => onProfilePairChange('woman', 'country', e.target.value)}
                        placeholder="e.g. Spain"
                        disabled={readOnly}
                      />
                    </p>
                  </div>
                  <div className={styles.partnerAvatar}>
                    <Image
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                      alt="Woman Profile"
                      width={70}
                      height={70}
                      unoptimized
                    />
                  </div>
                </div>

                {/* Sky Blue Card: Man */}
                <div className={`${styles.partnerCard} ${styles.skyCard}`}>
                  <div className={styles.partnerInputs}>
                    <p>
                      <strong>Name:</strong>{' '}
                      <input
                        type="text"
                        value={profilePairs?.man?.name || ''}
                        onChange={(e) => onProfilePairChange('man', 'name', e.target.value)}
                        placeholder="e.g. Diego"
                        disabled={readOnly}
                      />
                    </p>
                    <p>
                      <strong>Job:</strong>{' '}
                      <input
                        type="text"
                        value={profilePairs?.man?.job || ''}
                        onChange={(e) => onProfilePairChange('man', 'job', e.target.value)}
                        placeholder="e.g. teacher"
                        disabled={readOnly}
                      />
                    </p>
                    <p>
                      <strong>City:</strong>{' '}
                      <input
                        type="text"
                        value={profilePairs?.man?.city || ''}
                        onChange={(e) => onProfilePairChange('man', 'city', e.target.value)}
                        placeholder="e.g. Córdoba"
                        disabled={readOnly}
                      />
                    </p>
                    <p>
                      <strong>Country:</strong>{' '}
                      <input
                        type="text"
                        value={profilePairs?.man?.country || ''}
                        onChange={(e) => onProfilePairChange('man', 'country', e.target.value)}
                        placeholder="e.g. Argentina"
                        disabled={readOnly}
                      />
                    </p>
                  </div>
                  <div className={styles.partnerAvatar}>
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                      alt="Man Profile"
                      width={70}
                      height={70}
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modelDialogueBox}>
                <strong>A:</strong> This is Diego. He&apos;s a teacher. He&apos;s from Córdoba in Argentina...
              </div>
            </div>
          </section>

          {/* Speaking Section (8 & 9) */}
          <div className={styles.speakingCard}>
            <span className={styles.speakingStepBadge}>Speaking: Prepare &amp; Speak</span>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e293b' }}>
              <strong>8</strong> Work in pairs. Student A: Turn to page 151. Student B: Turn to page 152.
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e293b' }}>
              <strong>9</strong> Ask and answer the questions and complete the profiles on pages 151/152.
            </p>
            <div className={styles.modelDialogueBox}>
              <p style={{ margin: 0 }}><strong>A:</strong> Is Julia a doctor?</p>
              <p style={{ margin: 0 }}><strong>B:</strong> No, she isn&apos;t. She&apos;s a nurse...</p>
            </div>
          </div>

          {/* Develop your listening banner */}
          <div className={styles.listeningBanner}>
            <div>
              <h4>Develop your listening</h4>
              <p>page 87</p>
            </div>
            <div className={styles.bannerCircle}>9</div>
          </div>
        </div>
      </div>
    </div>
  );
}
