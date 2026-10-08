'use client';

import React from 'react';
import styles from '@/app/lessons/[id]/lesson.module.scss';

const countriesList = [
    "Argentina", "Brazil", "Canada", "Italy", "Japan",
    "Mexico", "Poland", "Spain", "Thailand", "the UK", "the US", "Turkey"
];

const flagsData = [
    {id: 1, country: "Canada", flagUrl: "https://flagcdn.com/w160/ca.png"},
    {id: 2, country: "the UK", flagUrl: "https://flagcdn.com/w160/gb.png"},
    {id: 3, country: "the US", flagUrl: "https://flagcdn.com/w160/us.png"},
    {id: 4, country: "Spain", flagUrl: "https://flagcdn.com/w160/es.png"},
    {id: 5, country: "Poland", flagUrl: "https://flagcdn.com/w160/pl.png"},
    {id: 6, country: "Turkey", flagUrl: "https://flagcdn.com/w160/tr.png"},
    {id: 7, country: "Japan", flagUrl: "https://flagcdn.com/w160/jp.png"},
    {id: 8, country: "Thailand", flagUrl: "https://flagcdn.com/w160/th.png"},
    {id: 9, country: "Argentina", flagUrl: "https://flagcdn.com/w160/ar.png"},
    {id: 10, country: "Mexico", flagUrl: "https://flagcdn.com/w160/mx.png"},
    {id: 11, country: "Brazil", flagUrl: "https://flagcdn.com/w160/br.png"},
    {id: 12, country: "Italy", flagUrl: "https://flagcdn.com/w160/it.png"},
];

interface LessonContentProps {
    lesson: any;
    user?: any;
    flagAnswers: Record<number, string>;
    dialogInputs: Record<string, string>;
    stressTableInputs: Record<string, string>;
    grammarInputs?: Record<string, string>;
    dialogue7aInputs?: Record<string, string>;
    conferenceCard?: {
        name: string;
        city: string;
        country: string;
        roles: string[];
    };
    onFlagChange: (id: number, value: string) => void;
    onDialogChange: (id: string, value: string) => void;
    onStressChange: (id: string, value: string) => void;
    onGrammarChange?: (id: string, value: string) => void;
    onDialogue7aChange?: (id: string, value: string) => void;
    onConferenceCardChange?: (field: 'name' | 'city' | 'country', value: string) => void;
    onRoleToggle?: (role: string) => void;
    readOnly?: boolean;
    originalAnswers?: {
        flagAnswers?: Record<number, string>;
        dialogInputs?: Record<string, string>;
        stressTableInputs?: Record<string, string>;
        grammarInputs?: Record<string, string>;
        dialogue7aInputs?: Record<string, string>;
        conferenceCard?: {
            name: string;
            city: string;
            country: string;
            roles: string[];
        };
    };
    playAudio: (track: string) => void;
    playingAudio: string | null;
}

const LessonContent: React.FC<LessonContentProps> = ({
                                                         lesson,
                                                         user,
                                                         flagAnswers,
                                                         dialogInputs,
                                                         stressTableInputs,
                                                         grammarInputs = {},
                                                         dialogue7aInputs = {},
                                                         conferenceCard = { name: '', city: '', country: '', roles: [] },
                                                         onFlagChange,
                                                         onDialogChange,
                                                         onStressChange,
                                                         onGrammarChange,
                                                         onDialogue7aChange,
                                                         onConferenceCardChange,
                                                         onRoleToggle,
                                                         readOnly = false,
                                                         originalAnswers,
                                                         playAudio,
                                                         playingAudio
                                                     }) => {
    const isDiff = (
        type: 'flags' | 'dialogs' | 'stress' | 'grammar' | 'dialogue7a' | 'confField' | 'roles',
        id: string | number,
        value: string | string[]
    ) => {
        if (!originalAnswers) return false;
        if (type === 'flags') return (originalAnswers.flagAnswers?.[Number(id)] || '') !== value;
        if (type === 'dialogs') return (originalAnswers.dialogInputs?.[id] || '') !== value;
        if (type === 'stress') return (originalAnswers.stressTableInputs?.[id] || '') !== value;
        if (type === 'grammar') return (originalAnswers.grammarInputs?.[id] || '') !== value;
        if (type === 'dialogue7a') return (originalAnswers.dialogue7aInputs?.[id] || '') !== value;
        if (type === 'confField') return (originalAnswers.conferenceCard?.[id as 'name' | 'city' | 'country'] || '') !== value;
        if (type === 'roles') {
            const origRoles = originalAnswers.conferenceCard?.roles || [];
            const currRoles = (value as string[]) || [];
            return JSON.stringify([...origRoles].sort()) !== JSON.stringify([...currRoles].sort());
        }
        return false;
    };

    return (
        <>
            {/* Top Header with Photos A, B, C */}
            <div className={styles.topHeaderGrid}>
                <div className={styles.titleArea}>
                    {user && (
                        <div className={styles.studentGreeting}>
                            Hello, <span>{user.name || user.email}</span>!
                        </div>
                    )}
                    <div className={styles.badgeBox}>
                        <h1 className={styles.badgeTitle}>1<span>A</span></h1>
                    </div>
                    <h2 className={styles.lessonTitle}>{lesson?.title || 'Hello'}</h2>

                    <div className={styles.goalsBox}>
                        <p><span>› Goal:</span> introduce yourself to other students</p>
                        <p><span>› Grammar:</span> be: <i>I</i> and <i>you</i></p>
                        <p><span>› Vocabulary:</span> countries</p>
                    </div>
                </div>

                <div className={styles.photosArea}>
                    <div className={styles.photoRow}>
                        <div className={styles.photoCard}>
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
                                 alt="John Miller"/>
                            <span className={styles.photoTag}><b>A</b> John Miller, the UK</span>
                        </div>
                        <div className={styles.photoCard}>
                            <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop"
                                 alt="Maria Fernandez"/>
                            <span className={styles.photoTag}><b>B</b> Maria Fernandez, Spain</span>
                        </div>
                        <div className={styles.photoCard}>
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop"
                                 alt="Ela Atan"/>
                            <span className={styles.photoTag}><b>C</b> Ela Atan, Turkey</span>
                        </div>
                    </div>
                    <div className={styles.photoRow}>
                        <div className={styles.photoCard}>
                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop"
                                 alt="David Lee"/>
                            <span className={styles.photoTag}><b>D</b> David Lee, the US</span>
                        </div>
                        <div className={styles.photoCard}>
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop"
                                 alt="Anna Novak"/>
                            <span className={styles.photoTag}><b>E</b> Anna Novak, Poland</span>
                        </div>
                        <div className={styles.photoCard}>
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop"
                                 alt="Marco Rossi"/>
                            <span className={styles.photoTag}><b>F</b> Marco Rossi, Italy</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.contentLayout}>
                {/* Left Column: Vocabulary & Ex 2, 3 */}
                <div className={styles.leftColumn}>
                    <h3 className={styles.sectionHeading}>Vocabulary</h3>

                    <div className={styles.exerciseBlock}>
                        <p className={styles.taskText}>
                            <span className={styles.taskNum}>1 a</span> Match flags 1–12 with the countries in the box.
                        </p>

                        <div className={styles.countriesBox}>
                            {countriesList.map((country, i) => (
                                <span key={i} className={styles.countryTag}>{country}</span>
                            ))}
                        </div>
                        <p className={styles.exampleText}>1 Canada</p>

                        <div className={styles.flagsGrid}>
                            {flagsData.map((f) => (
                                <div key={f.id} className={styles.flagCard}>
                                    <div className={styles.flagImageWrap}>
                                        <span className={styles.flagId}>{f.id}</span>
                                        <img src={f.flagUrl} alt={f.country} className={styles.flagImg}/>
                                    </div>
                                    <select
                                        value={flagAnswers[f.id] || ""}
                                        onChange={(e) => onFlagChange(f.id, e.target.value)}
                                        disabled={readOnly}
                                        className={`${styles.flagSelect} ${isDiff('flags', f.id, flagAnswers[f.id] || '') ? styles.diffHighlight : ''}`}
                                    >
                                        <option value="">- select -</option>
                                        {countriesList.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.audioRow}>
                        <span className={styles.taskNum}>1 b</span>
                        <button
                            onClick={() => playAudio('1.1')}
                            className={`${styles.audioBtn} ${playingAudio === '1.1' ? styles.audioBtnActive : ''}`}
                        >
                            {playingAudio === '1.1' ? (
                                <>
                                    <div className={styles.equalizer}>
                                        <div className={styles.bar}></div>
                                        <div className={styles.bar}></div>
                                        <div className={styles.bar}></div>
                                    </div>
                                    <span>Playing...</span>
                                </>
                            ) : (
                                '▶ Track 1.1'
                            )}
                        </button>
                        <span>Listen and check your answers. Then listen again and repeat.</span>
                    </div>

                    {/* Exercise 2: Stress Table */}
                    <div className={styles.exerciseBlock} style={{marginTop: '2rem'}}>
                        <div className={styles.audioRow}>
                            <span className={styles.taskNum}>2 a</span>
                            <button
                                onClick={() => playAudio('1.2')}
                                className={`${styles.audioBtn} ${playingAudio === '1.2' ? styles.audioBtnActive : ''}`}
                            >
                                {playingAudio === '1.2' ? (
                                    <>
                                        <div className={styles.equalizer}>
                                            <div className={styles.bar}></div>
                                            <div className={styles.bar}></div>
                                            <div className={styles.bar}></div>
                                        </div>
                                        <span>Playing...</span>
                                    </>
                                ) : (
                                    '▶ Track 1.2'
                                )}
                            </button>
                            <span>Listen and complete the table.</span>
                        </div>

                        {/* Плашка со странами перед таблицей (как в учебнике) */}
                        <div className={styles.countriesBox} style={{ margin: '1rem 0' }}>
                            {countriesList.map((country, i) => (
                                <span key={`2a-${i}`} className={styles.countryTag}>{country}</span>
                            ))}
                        </div>

                        <table className={styles.stressTable}>
                            <thead>
                            <tr>
                                <th>o</th>
                                <th>Oo</th>
                                <th>oO</th>
                                <th>Ooo</th>
                                <th>ooOo</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* Строка 1 */}
                            <tr>
                                <td>
                                    <input type="text" value={stressTableInputs['o_1'] || ''} onChange={e => onStressChange('o_1', e.target.value)} disabled={readOnly} className={isDiff('stress', 'o_1', stressTableInputs['o_1'] || '') ? styles.diffHighlight : ''} />
                                </td>
                                <td style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>Poland</td>
                                <td style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>Japan</td>
                                <td>
                                    <input type="text" value={stressTableInputs['Ooo_1'] || ''} onChange={e => onStressChange('Ooo_1', e.target.value)} disabled={readOnly} className={isDiff('stress', 'Ooo_1', stressTableInputs['Ooo_1'] || '') ? styles.diffHighlight : ''} />
                                </td>
                                <td>
                                    <input type="text" value={stressTableInputs['ooOo_1'] || ''} onChange={e => onStressChange('ooOo_1', e.target.value)} disabled={readOnly} className={isDiff('stress', 'ooOo_1', stressTableInputs['ooOo_1'] || '') ? styles.diffHighlight : ''} />
                                </td>
                            </tr>
                            {/* Строка 2 */}
                            <tr>
                                <td>
                                    <input type="text" value={stressTableInputs['o_2'] || ''} onChange={e => onStressChange('o_2', e.target.value)} disabled={readOnly} className={isDiff('stress', 'o_2', stressTableInputs['o_2'] || '') ? styles.diffHighlight : ''} />
                                </td>
                                <td>
                                    <input type="text" value={stressTableInputs['Oo_2'] || ''} onChange={e => onStressChange('Oo_2', e.target.value)} disabled={readOnly} className={isDiff('stress', 'Oo_2', stressTableInputs['Oo_2'] || '') ? styles.diffHighlight : ''} />
                                </td>
                                <td>
                                    <input type="text" value={stressTableInputs['oO_2'] || ''} onChange={e => onStressChange('oO_2', e.target.value)} disabled={readOnly} className={isDiff('stress', 'oO_2', stressTableInputs['oO_2'] || '') ? styles.diffHighlight : ''} />
                                </td>
                                <td>
                                    <input type="text" value={stressTableInputs['Ooo_2'] || ''} onChange={e => onStressChange('Ooo_2', e.target.value)} disabled={readOnly} className={isDiff('stress', 'Ooo_2', stressTableInputs['Ooo_2'] || '') ? styles.diffHighlight : ''} />
                                </td>
                                <td>
                                    <input type="text" value={stressTableInputs['ooOo_2'] || ''} onChange={e => onStressChange('ooOo_2', e.target.value)} disabled={readOnly} className={isDiff('stress', 'ooOo_2', stressTableInputs['ooOo_2'] || '') ? styles.diffHighlight : ''} />
                                </td>
                            </tr>
                            {/* Строка 3 */}
                            <tr>
                                <td></td>
                                <td>
                                    <input type="text" value={stressTableInputs['Oo_3'] || ''} onChange={e => onStressChange('Oo_3', e.target.value)} disabled={readOnly} className={isDiff('stress', 'Oo_3', stressTableInputs['Oo_3'] || '') ? styles.diffHighlight : ''} />
                                </td>
                                <td>
                                    <input type="text" value={stressTableInputs['oO_3'] || ''} onChange={e => onStressChange('oO_3', e.target.value)} disabled={readOnly} className={isDiff('stress', 'oO_3', stressTableInputs['oO_3'] || '') ? styles.diffHighlight : ''} />
                                </td>
                                <td>
                                    <input type="text" value={stressTableInputs['Ooo_3'] || ''} onChange={e => onStressChange('Ooo_3', e.target.value)} disabled={readOnly} className={isDiff('stress', 'Ooo_3', stressTableInputs['Ooo_3'] || '') ? styles.diffHighlight : ''} />
                                </td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Exercise 2b & 2c */}
                    <div className={styles.audioRow} style={{marginTop: '1.5rem'}}>
                        <span className={styles.taskNum}>2 b</span>
                        <span>Listen again and repeat.</span>
                    </div>

                    <div className={styles.exerciseBlock} style={{marginTop: '1rem'}}>
                        <p className={styles.taskText}>
                            <span className={styles.taskNum}>2 c</span> How do you say your country in English? Underline the stressed syllable.
                        </p>
                        <p style={{ color: '#008b9c', fontStyle: 'italic', marginBottom: '0.8rem', fontSize: '0.95rem' }}>
                            Brazil, Italy
                        </p>
                        <input
                            type="text"
                            placeholder="Type your country here..."
                            value={stressTableInputs['my_country'] || ''}
                            onChange={e => onStressChange('my_country', e.target.value)}
                            disabled={readOnly}
                            className={`${styles.lineInput} ${isDiff('stress', 'my_country', stressTableInputs['my_country'] || '') ? styles.diffHighlight : ''}`}
                            style={{ width: '100%', maxWidth: '280px', borderBottom: '1px solid #ccc' }}
                        />
                    </div>

                    {/* Exercise 3: Roleplay */}
                    <div className={styles.exerciseBlock} style={{marginTop: '2rem'}}>
                        <p className={styles.taskText}>
                            <span className={styles.taskNum}>3</span> Work in pairs. Look at photos A–F and roleplay
                            conversations.
                        </p>
                        <div className={styles.dialogueBox}>
                            <p><b>A:</b> Hello, I&apos;m Maria.</p>
                            <p><b>B:</b> Hi, Maria. I&apos;m John.</p>
                            <p><b>A:</b> Where are you from?</p>
                            <p><b>B:</b> I&apos;m from the UK. Where are you from?</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Reading and Listening */}
                <div className={styles.rightColumn}>
                    <h3 className={styles.sectionHeading}>Reading and listening</h3>
                    <div className={styles.audioRow} style={{marginBottom: '1rem'}}>
                        <span className={styles.taskNum}>4 a</span>
                        <button
                            onClick={() => playAudio('1.3')}
                            className={`${styles.audioBtn} ${playingAudio === '1.3' ? styles.audioBtnActive : ''}`}
                        >
                            {playingAudio === '1.3' ? (
                                <>
                                    <div className={styles.equalizer}>
                                        <div className={styles.bar}></div>
                                        <div className={styles.bar}></div>
                                        <div className={styles.bar}></div>
                                    </div>
                                    <span>Playing...</span>
                                </>
                            ) : (
                                '▶ Track 1.3'
                            )}
                        </button>
                        <span style={{fontSize: '0.9rem'}}>Listen to two conversations at a language conference. Complete them with the correct countries.</span>
                    </div>

                    <div className={styles.confImageWrap}>
                        <img src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800"
                             alt="Conference"/>
                    </div>

                    {/* Conversation 1 */}
                    <div className={styles.dialogueContainer}>
                        <h4 className={styles.dialogueTitle}>Conversation 1</h4>
                        <p><b>A:</b> Hello, I&apos;m Juan. Nice to meet you.</p>
                        <p><b>B:</b> Nice to meet you, too. I&apos;m Akiko.</p>
                        <p><b>A:</b> Hi. Are you here for the conference?</p>
                        <p><b>B:</b> Yes, I am. Are you a teacher?</p>
                        <p><b>A:</b> No, I&apos;m not. I&apos;m the manager of a language school.</p>
                        <p><b>B:</b> Where are you from?</p>
                        <p className={styles.lineWithInput}>
                            <b>A:</b> I&apos;m from <span className={styles.supNum}>1</span>
                            <input
                                type="text"
                                value={dialogInputs['c1_1'] || ''}
                                onChange={(e) => onDialogChange('c1_1', e.target.value)}
                                disabled={readOnly}
                                className={`${styles.lineInput} ${isDiff('dialogs', 'c1_1', dialogInputs['c1_1'] || '') ? styles.diffHighlight : ''}`}
                            />. How about you?
                        </p>
                        <p className={styles.lineWithInput}>
                            <b>B:</b> I&apos;m from <span className={styles.supNum}>2</span>
                            <input
                                type="text"
                                value={dialogInputs['c1_2'] || ''}
                                onChange={(e) => onDialogChange('c1_2', e.target.value)}
                                disabled={readOnly}
                                className={`${styles.lineInput} ${isDiff('dialogs', 'c1_2', dialogInputs['c1_2'] || '') ? styles.diffHighlight : ''}`}
                            />. I&apos;m a university teacher.
                        </p>
                    </div>

                    {/* Conversation 2 */}
                    <div className={styles.dialogueContainer} style={{marginTop: '1.5rem'}}>
                        <h4 className={styles.dialogueTitle}>Conversation 2</h4>
                        <p><b>A:</b> Hi, are you Lucy?</p>
                        <p><b>B:</b> Yes, I am. Barbara?</p>
                        <p><b>A:</b> Yes, I&apos;m Barbara. Nice to meet you. Sorry, am I late?</p>
                        <p><b>B:</b> No, you aren&apos;t.</p>
                        <p><b>A:</b> Great. So where are you from, Lucy?</p>
                        <p className={styles.lineWithInput}>
                            <b>B:</b> I&apos;m from <span className={styles.supNum}>3</span>
                            <input
                                type="text"
                                value={dialogInputs['c2_1'] || ''}
                                onChange={(e) => onDialogChange('c2_1', e.target.value)}
                                disabled={readOnly}
                                className={`${styles.lineInput} ${isDiff('dialogs', 'c2_1', dialogInputs['c2_1'] || '') ? styles.diffHighlight : ''}`}
                            />. Are you from Spain?
                        </p>
                        <p className={styles.lineWithInput}>
                            <b>A:</b> No, I&apos;m not. I&apos;m from <span className={styles.supNum}>4</span>
                            <input
                                type="text"
                                value={dialogInputs['c2_2'] || ''}
                                onChange={(e) => onDialogChange('c2_2', e.target.value)}
                                disabled={readOnly}
                                className={`${styles.lineInput} ${isDiff('dialogs', 'c2_2', dialogInputs['c2_2'] || '') ? styles.diffHighlight : ''}`}
                            />.
                        </p>
                    </div>

                    {/* Exercise 4b & 4c */}
                    <div className={styles.exerciseBlock} style={{marginTop: '2rem'}}>
                        <div className={styles.audioRow} style={{marginBottom: '0.8rem'}}>
                            <span className={styles.taskNum} style={{ color: '#2c3e50', fontWeight: 'bold' }}>b</span>
                            <span>Listen again and repeat.</span>
                        </div>
                        <p className={styles.taskText}>
                            <span className={styles.taskNum} style={{ color: '#2c3e50', fontWeight: 'bold' }}>c</span> Work in pairs. Practise the conversations.
                        </p>
                    </div>

                </div>
            </div>

            {/* Continuation of Lesson 1: Exercises 5–10 */}
            <div className={`${styles.contentLayout} ${styles.continuationLayout}`}>
                {/* Left Column: Grammar (Ex 5), Pronunciation (Ex 6), Dialogue with be (Ex 7) */}
                <div className={styles.leftColumn}>
                    <h3 className={styles.sectionHeading}>Grammar</h3>

                    {/* Exercise 5 */}
                    <div className={styles.exerciseBlock}>
                        <p className={styles.taskText}>
                            <span className={styles.taskNum}>5</span> Read and complete the grammar box.
                        </p>

                        <div className={styles.grammarBox}>
                            <h4 className={styles.grammarBoxTitle}>be: <i>I</i> and <i>you</i></h4>

                            <div className={styles.tablesContainer}>
                                {/* Table 1 */}
                                <div className={styles.grammarRow}>
                                    <div className={styles.grammarSign}>+</div>
                                    <div className={styles.grammarCell}>
                                        <p><strong>I&apos;m</strong> Juan.</p>
                                        <p>I&apos;m a university teacher.</p>
                                        <p><strong>You&apos;re</strong> on time.</p>
                                    </div>
                                </div>

                                {/* Table 2 */}
                                <div className={styles.grammarRow}>
                                    <div className={styles.grammarSign}>?</div>
                                    <div className={styles.grammarCell} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span><strong>Am I</strong> late?</span>
                                    </div>
                                    <div className={styles.grammarColRight}>
                                        <div className={styles.grammarMiniRow}>
                                            <span className={styles.grammarSign}>+</span>
                                            <span>Yes, <strong>you are</strong>.</span>
                                        </div>
                                        <div className={styles.grammarMiniRow}>
                                            <span className={styles.grammarSign}>-</span>
                                            <span>No, <strong>you aren&apos;t</strong>.</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Table 3 */}
                                <div className={styles.grammarRow}>
                                    <div className={styles.grammarSign}>?</div>
                                    <div className={styles.grammarCell} style={{ display: 'flex', alignItems: 'center' }}>
                                        <span><strong>Are you</strong> a teacher?</span>
                                    </div>
                                    <div className={styles.grammarColRight}>
                                        <div className={styles.grammarMiniRow}>
                                            <span className={styles.grammarSign}>+</span>
                                            <span>Yes, <strong>I am</strong>.</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Table 4 */}
                                <div className={styles.grammarRow}>
                                    <div className={styles.grammarCell} style={{ background: '#b8c7d6', fontWeight: 'bold', color: '#1e3a5f' }}>
                                        Are you <span style={{ fontWeight: 'normal', color: '#4b5563' }}>from Spain?</span>
                                    </div>
                                    <div className={styles.grammarColRight} style={{ margin: 0 }}>
                                        <div className={styles.grammarMiniRow} style={{ height: '100%' }}>
                                            <span className={styles.grammarSign}>-</span>
                                            <span>No, <strong>I&apos;m not</strong>.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* with where */}
                            <div className={styles.whereBox}>
                                <p>with <i>where</i></p>
                                <div className={styles.whereRow}>
                                    <span>Where are <span>you from?</span></span>
                                    <span>I&apos;m <span>from Mexico.</span></span>
                                </div>
                            </div>

                            {/* Short forms */}
                            <div className={styles.shortFormsBox}>
                                <h5>Short forms</h5>
                                <div className={styles.shortFormsList}>
                                    <div className={styles.shortFormItem}>
                                        <span className={styles.supNum}>1</span>
                                        <input
                                            type="text"
                                            value={grammarInputs['1'] || ''}
                                            onChange={(e) => onGrammarChange?.('1', e.target.value)}
                                            disabled={readOnly}
                                            className={`${styles.lineInput} ${isDiff('grammar', '1', grammarInputs['1'] || '') ? styles.diffHighlight : ''}`}
                                            aria-label="Short form for I am"
                                        /> = I am
                                    </div>
                                    <div className={styles.shortFormItem}>
                                        <span className={styles.supNum}>2</span>
                                        <input
                                            type="text"
                                            value={grammarInputs['2'] || ''}
                                            onChange={(e) => onGrammarChange?.('2', e.target.value)}
                                            disabled={readOnly}
                                            className={`${styles.lineInput} ${isDiff('grammar', '2', grammarInputs['2'] || '') ? styles.diffHighlight : ''}`}
                                            aria-label="Short form for you are"
                                        /> = you are
                                    </div>
                                    <div className={styles.shortFormItem}>
                                        <span className={styles.supNum}>3</span>
                                        <input
                                            type="text"
                                            value={grammarInputs['3'] || ''}
                                            onChange={(e) => onGrammarChange?.('3', e.target.value)}
                                            disabled={readOnly}
                                            className={`${styles.lineInput} ${isDiff('grammar', '3', grammarInputs['3'] || '') ? styles.diffHighlight : ''}`}
                                            aria-label="Short form for are not"
                                        /> = are not
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Exercise 6 */}
                    <div className={styles.exerciseBlock}>
                        <div className={styles.staticAudioRow}>
                            <span className={styles.taskNum}>6 a</span>
                            <span className={styles.staticAudioBadge}>
                                <svg viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
                                1.4
                            </span>
                            <span>Listen to the sentences. Notice the pronunciation of the short forms in <span className={styles.blueHighlight}>blue</span>.</span>
                        </div>
                        <div className={styles.pronounceList}>
                            <p><strong>1</strong> <span className={styles.blueHighlight}>I&apos;m</span> from Mexico.</p>
                            <p><strong>2</strong> <span className={styles.blueHighlight}>I&apos;m</span> not a teacher.</p>
                            <p><strong>3</strong> <span className={styles.blueHighlight}>You&apos;re</span> on time.</p>
                            <p><strong>4</strong> <span className={styles.blueHighlight}>You aren&apos;t</span> late.</p>
                        </div>
                        <div className={styles.staticAudioRow}>
                            <span className={styles.taskNum} style={{ color: '#2c3e50', fontWeight: 'bold' }}>b</span>
                            <span>Listen again and repeat.</span>
                        </div>
                    </div>

                    {/* Exercise 7 */}
                    <div className={styles.exerciseBlock}>
                        <p className={styles.taskText}>
                            <span className={styles.taskNum}>7 a</span> Complete the conversation with the correct form of <i>be</i>.
                        </p>
                        <div className={styles.dialogue7aBlock}>
                            <p><strong>A:</strong> Hello. <span className={styles.supNum}>1</span>
                                <input
                                    type="text"
                                    value={dialogue7aInputs['1'] || ''}
                                    onChange={(e) => onDialogue7aChange?.('1', e.target.value)}
                                    disabled={readOnly}
                                    className={`${styles.lineInput} ${isDiff('dialogue7a', '1', dialogue7aInputs['1'] || '') ? styles.diffHighlight : ''}`}
                                /> you here for the conference?
                            </p>
                            <p><strong>B:</strong> Yes, I <span className={styles.supNum}>2</span>
                                <input
                                    type="text"
                                    value={dialogue7aInputs['2'] || ''}
                                    onChange={(e) => onDialogue7aChange?.('2', e.target.value)}
                                    disabled={readOnly}
                                    className={`${styles.lineInput} ${isDiff('dialogue7a', '2', dialogue7aInputs['2'] || '') ? styles.diffHighlight : ''}`}
                                />. I <span className={styles.supNum}>3</span>
                                <input
                                    type="text"
                                    value={dialogue7aInputs['3'] || ''}
                                    onChange={(e) => onDialogue7aChange?.('3', e.target.value)}
                                    disabled={readOnly}
                                    className={`${styles.lineInput} ${isDiff('dialogue7a', '3', dialogue7aInputs['3'] || '') ? styles.diffHighlight : ''}`}
                                /> Laura.
                            </p>
                            <p><strong>A:</strong> I <span className={styles.supNum}>4</span>
                                <input
                                    type="text"
                                    value={dialogue7aInputs['4'] || ''}
                                    onChange={(e) => onDialogue7aChange?.('4', e.target.value)}
                                    disabled={readOnly}
                                    className={`${styles.lineInput} ${isDiff('dialogue7a', '4', dialogue7aInputs['4'] || '') ? styles.diffHighlight : ''}`}
                                /> Elif.
                            </p>
                            <p><strong>B:</strong> Nice to meet you.</p>
                            <p><strong>A:</strong> Nice to meet you, too. <span className={styles.supNum}>5</span>
                                <input
                                    type="text"
                                    value={dialogue7aInputs['5'] || ''}
                                    onChange={(e) => onDialogue7aChange?.('5', e.target.value)}
                                    disabled={readOnly}
                                    className={`${styles.lineInput} ${isDiff('dialogue7a', '5', dialogue7aInputs['5'] || '') ? styles.diffHighlight : ''}`}
                                /> you from the US?
                            </p>
                            <p><strong>B:</strong> No, I <span className={styles.supNum}>6</span>
                                <input
                                    type="text"
                                    value={dialogue7aInputs['6'] || ''}
                                    onChange={(e) => onDialogue7aChange?.('6', e.target.value)}
                                    disabled={readOnly}
                                    className={`${styles.lineInput} ${isDiff('dialogue7a', '6', dialogue7aInputs['6'] || '') ? styles.diffHighlight : ''}`}
                                /> not. I&apos;m from Toronto in Canada. Where <span className={styles.supNum}>7</span>
                                <input
                                    type="text"
                                    value={dialogue7aInputs['7'] || ''}
                                    onChange={(e) => onDialogue7aChange?.('7', e.target.value)}
                                    disabled={readOnly}
                                    className={`${styles.lineInput} ${isDiff('dialogue7a', '7', dialogue7aInputs['7'] || '') ? styles.diffHighlight : ''}`}
                                /> you from?
                            </p>
                            <p><strong>A:</strong> I <span className={styles.supNum}>8</span>
                                <input
                                    type="text"
                                    value={dialogue7aInputs['8'] || ''}
                                    onChange={(e) => onDialogue7aChange?.('8', e.target.value)}
                                    disabled={readOnly}
                                    className={`${styles.lineInput} ${isDiff('dialogue7a', '8', dialogue7aInputs['8'] || '') ? styles.diffHighlight : ''}`}
                                /> from Ankara in Turkey.
                            </p>
                        </div>
                        <div className={styles.staticAudioRow}>
                            <span className={styles.taskNum} style={{ color: '#2c3e50', fontWeight: 'bold' }}>b</span>
                            <span className={styles.staticAudioBadge}>
                                <svg viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
                                1.5
                            </span>
                            <span>Listen and check your answers.</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Speaking (Ex 8, 9, 10) */}
                <div className={styles.rightColumn}>
                    {/* Exercise 8 */}
                    <div className={styles.exerciseBlock}>
                        <p className={styles.taskText}>
                            <span className={styles.taskNum}>8</span> Work in pairs. Roleplay conversations with the information below. Use Exercise 7a to help you.
                        </p>

                        <div className={styles.roleplayGrid}>
                            <div className={styles.roleplayHeader}>Conversation 1</div>
                            <div className={styles.roleplayHeader}>Conversation 2</div>

                            {/* Card 1 */}
                            <div className={styles.roleplayCard}>
                                <p><span>Name:</span> Diego Castillo</p>
                                <p><span>City:</span> Buenos Aires</p>
                                <p><span>Country:</span> Argentina</p>
                                <div className={styles.flagBadge}>
                                    <span style={{ fontSize: '1.1rem' }}>🇦🇷</span>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className={styles.roleplayCard}>
                                <p><span>Name:</span> Ana Santos</p>
                                <p><span>City:</span> São Paulo</p>
                                <p><span>Country:</span> Brazil</p>
                                <div className={styles.flagBadge}>
                                    <span style={{ fontSize: '1.1rem' }}>🇧🇷</span>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className={styles.roleplayCard}>
                                <p><span>Name:</span> Sofia Romano</p>
                                <p><span>City:</span> Milan</p>
                                <p><span>Country:</span> Italy</p>
                                <div className={styles.flagBadge}>
                                    <span style={{ fontSize: '1.1rem' }}>🇮🇹</span>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className={styles.roleplayCard}>
                                <p><span>Name:</span> Aleksander Nowicki</p>
                                <p><span>City:</span> Warsaw</p>
                                <p><span>Country:</span> Poland</p>
                                <div className={styles.flagBadge}>
                                    <span style={{ fontSize: '1.1rem' }}>🇵🇱</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.appInfoLink}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            <span>Go to page 116 or your app for more information and practice.</span>
                        </div>
                    </div>

                    {/* Speaking Section */}
                    <div>
                        <h3 className={styles.sectionHeading}>Speaking</h3>
                        <div className={styles.ribbon}>PREPARE</div>

                        {/* Exercise 9 */}
                        <div className={styles.exerciseBlock}>
                            <p className={styles.taskText}>
                                <span className={styles.taskNum}>9</span> Complete the conference card with your information.
                            </p>

                            <div className={`${styles.conferenceCard} ${isDiff('roles', 'card', conferenceCard.roles) ? styles.diffHighlight : ''}`}>
                                <div className={styles.confHeader}>
                                    10th International Language Conference
                                </div>
                                <div className={styles.confBody}>
                                    <div className={styles.confField}>
                                        <label>Name:</label>
                                        <input
                                            type="text"
                                            value={conferenceCard.name || ''}
                                            onChange={(e) => onConferenceCardChange?.('name', e.target.value)}
                                            disabled={readOnly}
                                            className={isDiff('confField', 'name', conferenceCard.name || '') ? styles.diffHighlight : ''}
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div className={styles.confField}>
                                        <label>City:</label>
                                        <input
                                            type="text"
                                            value={conferenceCard.city || ''}
                                            onChange={(e) => onConferenceCardChange?.('city', e.target.value)}
                                            disabled={readOnly}
                                            className={isDiff('confField', 'city', conferenceCard.city || '') ? styles.diffHighlight : ''}
                                            placeholder="Your city"
                                        />
                                    </div>
                                    <div className={styles.confField}>
                                        <label>Country:</label>
                                        <input
                                            type="text"
                                            value={conferenceCard.country || ''}
                                            onChange={(e) => onConferenceCardChange?.('country', e.target.value)}
                                            disabled={readOnly}
                                            className={isDiff('confField', 'country', conferenceCard.country || '') ? styles.diffHighlight : ''}
                                            placeholder="Your country"
                                        />
                                    </div>

                                    {/* Role Checkboxes */}
                                    <div className={styles.confRoles}>
                                        {[
                                            'student',
                                            'school teacher',
                                            'university teacher',
                                            'language school teacher',
                                            'manager'
                                        ].map((role) => (
                                            <label key={role} className={styles.confCheckboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={(conferenceCard.roles || []).includes(role)}
                                                    onChange={() => onRoleToggle?.(role)}
                                                    disabled={readOnly}
                                                />
                                                {role}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.confFooter}></div>
                            </div>
                        </div>

                        <div className={styles.ribbon}>SPEAK</div>

                        {/* Exercise 10 */}
                        <div className={styles.exerciseBlock}>
                            <p className={styles.taskText}>
                                <span className={styles.taskNum}>10</span> Work in groups. You are at the language conference. Introduce yourself to the other students.
                            </p>
                            <div className={styles.dialogueBox} style={{ fontStyle: 'normal' }}>
                                <p><b>A:</b> <span style={{ color: '#0284c7', fontStyle: 'italic' }}>Hi. I&apos;m Mehmet Osman.</span></p>
                                <p><b>B:</b> <span style={{ color: '#0284c7', fontStyle: 'italic' }}>Hello. I&apos;m Lana Cruz. Nice to meet you.</span></p>
                                <p><b>A:</b> <span style={{ color: '#0284c7', fontStyle: 'italic' }}>Nice to meet you, too. Where are you from?</span></p>
                            </div>
                        </div>

                        {/* Bottom decorative develop element */}
                        <div className={styles.developBadge}>
                            <div className={styles.developBox}>Develop</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LessonContent;