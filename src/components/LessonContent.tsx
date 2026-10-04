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
    onFlagChange: (id: number, value: string) => void;
    onDialogChange: (id: string, value: string) => void;
    onStressChange: (id: string, value: string) => void;
    readOnly?: boolean;
    originalAnswers?: {
        flagAnswers?: Record<number, string>;
        dialogInputs?: Record<string, string>;
        stressTableInputs?: Record<string, string>;
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
                                                         onFlagChange,
                                                         onDialogChange,
                                                         onStressChange,
                                                         readOnly = false,
                                                         originalAnswers,
                                                         playAudio,
                                                         playingAudio
                                                     }) => {
    const isDiff = (type: 'flags' | 'dialogs' | 'stress', id: string | number, value: string) => {
        if (!originalAnswers) return false;
        let originalValue = '';
        if (type === 'flags') originalValue = originalAnswers.flagAnswers?.[Number(id)] || '';
        if (type === 'dialogs') originalValue = originalAnswers.dialogInputs?.[id] || '';
        if (type === 'stress') originalValue = originalAnswers.stressTableInputs?.[id] || '';
        return originalValue !== value;
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
                        <span className={styles.taskNum}>1b</span>
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
                        <span>Listen and check your answers.</span>
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
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        value={stressTableInputs['1_1'] || ''}
                                        onChange={e => onStressChange('1_1', e.target.value)}
                                        disabled={readOnly}
                                        className={isDiff('stress', '1_1', stressTableInputs['1_1'] || '') ? styles.diffHighlight : ''}
                                    />
                                </td>
                                <td>Poland</td>
                                <td>Japan</td>
                                <td>
                                    <input
                                        type="text"
                                        value={stressTableInputs['1_3'] || ''}
                                        onChange={e => onStressChange('1_3', e.target.value)}
                                        disabled={readOnly}
                                        className={isDiff('stress', '1_3', stressTableInputs['1_3'] || '') ? styles.diffHighlight : ''}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={stressTableInputs['1_4'] || ''}
                                        onChange={e => onStressChange('1_4', e.target.value)}
                                        disabled={readOnly}
                                        className={isDiff('stress', '1_4', stressTableInputs['1_4'] || '') ? styles.diffHighlight : ''}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
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
                        <span style={{fontSize: '0.9rem'}}>Listen to conversations. Complete with countries.</span>
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
                </div>
            </div>
        </>
    );
};

export default LessonContent;
