'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './submission.module.scss';
import LessonContent from '@/components/LessonContent';
import Lesson1BContent from '@/components/Lesson1BContent';
import Lesson1CContent from '@/components/Lesson1CContent';
import Lesson1DContent from '@/components/Lesson1DContent';
import Lesson2AContent from '@/components/Lesson2AContent';

export default function SubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  const [flagAnswers, setFlagAnswers] = useState<Record<number, string>>({});
  const [dialogInputs, setDialogInputs] = useState<Record<string, string>>({});
  const [stressTableInputs, setStressTableInputs] = useState<Record<string, string>>({});
  const [grammarInputs, setGrammarInputs] = useState<Record<string, string>>({});
  const [dialogue7aInputs, setDialogue7aInputs] = useState<Record<string, string>>({});
  const [conferenceCard, setConferenceCard] = useState<{
    name: string;
    city: string;
    country: string;
    roles: string[];
  }>({ name: '', city: '', country: '', roles: [] });

  const [jobsInputs, setJobsInputs] = useState<Record<string, string>>({});
  const [readingInputs, setReadingInputs] = useState<Record<string, string>>({});
  const [page9Profiles, setPage9Profiles] = useState<Record<string, string>>({});
  const [ex4aAnswers, setEx4aAnswers] = useState<Record<string, string>>({});
  const [grammar5aInputs, setGrammar5aInputs] = useState<Record<string, string>>({});
  const [ex6Answers, setEx6Answers] = useState<Record<string, string>>({});
  const [ex7aAnswers, setEx7aAnswers] = useState<Record<string, string>>({});
  const [profilePairs, setProfilePairs] = useState<{
    woman?: { name?: string; job?: string; city?: string; country?: string };
    man?: { name?: string; job?: string; city?: string; country?: string };
  }>({});

  // 1C states
  const [nationalitiesInputs, setNationalitiesInputs] = useState<Record<string, string>>({});
  const [stressInputs, setStressInputs] = useState<Record<string, string>>({});
  const [famousInputs, setFamousInputs] = useState<string>('');
  const [photosInputs, setPhotosInputs] = useState<Record<string, string>>({});
  const [tfInputs, setTfInputs] = useState<Record<string, string>>({});
  const [grammar5aInputs1C, setGrammar5aInputs1C] = useState<Record<string, string>>({});
  const [textsInputs, setTextsInputs] = useState<Record<string, string>>({});
  const [questionsInputs, setQuestionsInputs] = useState<Record<string, string>>({});
  const [speakingNotes, setSpeakingNotes] = useState<string>('');

  // 1D states
  const [ex1Location, setEx1Location] = useState<string>('');
  const [ex2Audio, setEx2Audio] = useState<Record<string, string>>({});
  const [ex3aOrder, setEx3aOrder] = useState<Record<string, string>>({});
  const [ex3bContact, setEx3bContact] = useState<Record<string, string>>({});
  const [ex4aDialogue, setEx4aDialogue] = useState<Record<string, string>>({});
  const [ex5Personal, setEx5Personal] = useState<Record<string, string>>({});
  const [ex6Partner, setEx6Partner] = useState<Record<string, string>>({});

  const [wordsearchFound, setWordsearchFound] = useState<Record<string, string>>({});
  const [ex2aOrder, setEx2aOrder] = useState<Record<string, string>>({});
  const [ex2bShort, setEx2bShort] = useState<Record<string, string>>({});
  const [ex3Be, setEx3Be] = useState<Record<string, string>>({});
  const [ex4Jobs, setEx4Jobs] = useState<Record<string, string>>({});
  const [ex5IsIsnt, setEx5IsIsnt] = useState<Record<string, string>>({});
  const [ex6Corrections, setEx6Corrections] = useState<Record<string, string>>({});
  const [ex7aNationalities, setEx7aNationalities] = useState<Record<string, string>>({});
  const [ex7bPeople, setEx7bPeople] = useState<Record<string, string>>({});
  const [ex8Alternatives, setEx8Alternatives] = useState<Record<string, string>>({});
  const [ex9Text, setEx9Text] = useState<Record<string, string>>({});
  const [reflectScores, setReflectScores] = useState<Record<string, string | number>>({});

  // 2A states
  const [ex1FamilyTree, setEx1FamilyTree] = useState<Record<string, string>>({});
  const [ex2aTable, setEx2aTable] = useState<Record<string, string>>({});
  const [ex3Sentences, setEx3Sentences] = useState<Record<string, string>>({});
  const [ex4aMatch, setEx4aMatch] = useState<Record<string, string>>({});
  const [ex4bListening, setEx4bListening] = useState<Record<string, string>>({});
  const [ex5Grammar, setEx5Grammar] = useState<Record<string, string>>({});
  const [ex7Dialogue, setEx7Dialogue] = useState<Record<string, string>>({});
  const [ex8Notes, setEx8Notes] = useState<string>('');

  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const [grade, setGrade] = useState<number | string>('');
  const [tutorComment, setTutorComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/submissions/${id}`);
        const data = res.data;
        setSubmission(data);
        
        // Initialize interactive state
        const answers = data.reviewedAnswers || data.answers || {};
        setFlagAnswers(answers.flagAnswers || {});
        setDialogInputs(answers.dialogInputs || {});
        setStressTableInputs(answers.stressTableInputs || {});
        setGrammarInputs(answers.grammarInputs || {});
        setDialogue7aInputs(answers.dialogue7aInputs || {});
        setConferenceCard(answers.conferenceCard || { name: '', city: '', country: '', roles: [] });
        setJobsInputs(answers.exercise_1b_jobs || answers.jobsInputs || {});
        setReadingInputs(answers.exercise_3_reading || answers.readingInputs || {});
        setPage9Profiles(answers.exercise_page9_profiles || {});
        setEx4aAnswers(answers.exercise_4a_reading || {});
        setGrammar5aInputs(answers.exercise_5a_grammar || {});
        setEx6Answers(answers.exercise_6_dialogue || {});
        setEx7aAnswers(answers.exercise_7a_qa || {});
        setProfilePairs(answers.exercise_7b_profiles || {});
        setNationalitiesInputs(answers.exercise_1b_nationalities || {});
        setStressInputs(answers.exercise_2c_stress || {});
        setFamousInputs(answers.exercise_3_famous || '');
        setPhotosInputs(answers.exercise_4a_photos || {});
        setTfInputs(answers.exercise_4b_tf || {});
        setGrammar5aInputs1C(answers.exercise_5a_grammar || {});
        setTextsInputs(answers.exercise_6_texts || {});
        setQuestionsInputs(answers.exercise_7a_questions || {});
        setSpeakingNotes(answers.exercise_8b_notes || '');

        // 1D answers restore
        if (answers.exercise_1_location?.['1'] || answers.exercise_1_location) {
          setEx1Location(answers.exercise_1_location?.['1'] || answers.exercise_1_location);
        }
        if (answers.exercise_2_audio) setEx2Audio(answers.exercise_2_audio);
        if (answers.exercise_3a_order) setEx3aOrder(answers.exercise_3a_order);
        if (answers.exercise_3b_contact) setEx3bContact(answers.exercise_3b_contact);
        if (answers.exercise_4a_dialogue) setEx4aDialogue(answers.exercise_4a_dialogue);
        if (answers.exercise_5_personal) setEx5Personal(answers.exercise_5_personal);
        if (answers.exercise_6_partner) setEx6Partner(answers.exercise_6_partner);
        if (answers.exercise_1_wordsearch) setWordsearchFound(answers.exercise_1_wordsearch);
        if (answers.exercise_2a_order) setEx2aOrder(answers.exercise_2a_order);
        if (answers.exercise_2b_short) setEx2bShort(answers.exercise_2b_short);
        if (answers.exercise_3_be) setEx3Be(answers.exercise_3_be);
        if (answers.exercise_4_jobs) setEx4Jobs(answers.exercise_4_jobs);
        if (answers.exercise_5_is_isnt) setEx5IsIsnt(answers.exercise_5_is_isnt);
        if (answers.exercise_6_corrections) setEx6Corrections(answers.exercise_6_corrections);
        if (answers.exercise_7a_nationalities) setEx7aNationalities(answers.exercise_7a_nationalities);
        if (answers.exercise_7b_people) setEx7bPeople(answers.exercise_7b_people);
        if (answers.exercise_8_alternatives) setEx8Alternatives(answers.exercise_8_alternatives);
        if (answers.exercise_9_text) setEx9Text(answers.exercise_9_text);
        if (answers.reflect_scores) setReflectScores(answers.reflect_scores);

        // 2A answers restore
        if (answers.exercise_1_family_tree) setEx1FamilyTree(answers.exercise_1_family_tree);
        if (answers.exercise_2a_table) setEx2aTable(answers.exercise_2a_table);
        if (answers.exercise_3_sentences) setEx3Sentences(answers.exercise_3_sentences);
        if (answers.exercise_4a_match) setEx4aMatch(answers.exercise_4a_match);
        if (answers.exercise_4b_listening) setEx4bListening(answers.exercise_4b_listening);
        if (answers.exercise_5_grammar) setEx5Grammar(answers.exercise_5_grammar);
        if (answers.exercise_7_dialogue) setEx7Dialogue(answers.exercise_7_dialogue);
        if (answers.exercise_8_notes) setEx8Notes(answers.exercise_8_notes);
        
        if (data.grade !== null) setGrade(data.grade);
        if (data.tutorComment) setTutorComment(data.tutorComment);
      } catch (err: any) {
        console.error('Failed to load submission:', err);
        setError(err.response?.data?.message || 'Failed to load submission details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubmission();
    }
  }, [id]);

  const handleFlagChange = (fid: number, value: string) => {
    setFlagAnswers(prev => ({ ...prev, [fid]: value }));
  };

  const handleDialogChange = (did: string, value: string) => {
    setDialogInputs(prev => ({ ...prev, [did]: value }));
  };

  const handleStressChange = (sid: string, value: string) => {
    setStressTableInputs(prev => ({ ...prev, [sid]: value }));
  };

  const handleGrammarChange = (gid: string, value: string) => {
    setGrammarInputs(prev => ({ ...prev, [gid]: value }));
  };

  const handleDialogue7aChange = (did: string, value: string) => {
    setDialogue7aInputs(prev => ({ ...prev, [did]: value }));
  };

  const handleConferenceCardChange = (field: 'name' | 'city' | 'country', value: string) => {
    setConferenceCard(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (role: string) => {
    setConferenceCard(prev => {
      const currentRoles = prev.roles || [];
      const exists = currentRoles.includes(role);
      return {
        ...prev,
        roles: exists ? currentRoles.filter(r => r !== role) : [...currentRoles, role],
      };
    });
  };

  const playAudio = (track: string) => {
    if (playingAudio === track && currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingAudio(null);
      return;
    }
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(`/audio/${track}.mp3`);
    audio.onended = () => {
      setPlayingAudio(null);
      setCurrentAudio(null);
    };
    setPlayingAudio(track);
    setCurrentAudio(audio);
    audio.play().catch(err => {
      console.error('Audio playback failed:', err);
      setPlayingAudio(null);
      setCurrentAudio(null);
    });
  };

  const handleSaveReview = async (targetStatus = 'graded') => {
    try {
      setSaving(true);
      setSuccess('');
      setError('');

      if (targetStatus === 'needs_revision' && !tutorComment.trim()) {
        setError('Please provide a tutor comment explaining what needs to be revised.');
        setSaving(false);
        return;
      }

      const isLesson1B =
        lesson?.order === 2 ||
        lesson?.title?.includes('1B') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

      const isLesson1C =
        lesson?.order === 3 ||
        lesson?.title?.includes('1C') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44';

      const isLesson1D =
        lesson?.order === 4 ||
        lesson?.title?.includes('1D') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55';

      const isLesson2A =
        lesson?.order === 5 ||
        lesson?.title?.includes('2A') ||
        lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66';

      const payloadAnswers = isLesson2A
        ? {
            exercise_1_family_tree: ex1FamilyTree,
            exercise_2a_table: ex2aTable,
            exercise_3_sentences: ex3Sentences,
            exercise_4a_match: ex4aMatch,
            exercise_4b_listening: ex4bListening,
            exercise_5_grammar: ex5Grammar,
            exercise_7_dialogue: ex7Dialogue,
            exercise_8_notes: ex8Notes,
          }
        : isLesson1D
        ? {
            exercise_1_location: { '1': ex1Location },
            exercise_2_audio: ex2Audio,
            exercise_3a_order: ex3aOrder,
            exercise_3b_contact: ex3bContact,
            exercise_4a_dialogue: ex4aDialogue,
            exercise_5_personal: ex5Personal,
            exercise_6_partner: ex6Partner,
            exercise_1_wordsearch: wordsearchFound,
            exercise_2a_order: ex2aOrder,
            exercise_2b_short: ex2bShort,
            exercise_3_be: ex3Be,
            exercise_4_jobs: ex4Jobs,
            exercise_5_is_isnt: ex5IsIsnt,
            exercise_6_corrections: ex6Corrections,
            exercise_7a_nationalities: ex7aNationalities,
            exercise_7b_people: ex7bPeople,
            exercise_8_alternatives: ex8Alternatives,
            exercise_9_text: ex9Text,
            reflect_scores: reflectScores,
          }
        : isLesson1C
        ? {
            exercise_1b_nationalities: nationalitiesInputs,
            exercise_2c_stress: stressInputs,
            exercise_3_famous: famousInputs,
            exercise_4a_photos: photosInputs,
            exercise_4b_tf: tfInputs,
            exercise_5a_grammar: grammar5aInputs1C,
            exercise_6_texts: textsInputs,
            exercise_7a_questions: questionsInputs,
            exercise_8b_notes: speakingNotes,
          }
        : isLesson1B
        ? {
            exercise_1b_jobs: jobsInputs,
            exercise_3_reading: readingInputs,
            exercise_page9_profiles: page9Profiles,
            exercise_4a_reading: ex4aAnswers,
            exercise_5a_grammar: grammar5aInputs,
            exercise_6_dialogue: ex6Answers,
            exercise_7a_qa: ex7aAnswers,
            exercise_7b_profiles: profilePairs,
          }
        : {
            flagAnswers,
            dialogInputs,
            stressTableInputs,
            grammarInputs,
            dialogue7aInputs,
            conferenceCard,
          };

      await api.patch(`/submissions/${id}/review`, {
        answers: payloadAnswers,
        grade: grade !== '' ? Number(grade) : undefined,
        tutorComment,
        status: targetStatus,
      });
      setSuccess(targetStatus === 'needs_revision' ? 'Returned for revision!' : 'Graded successfully!');
      // Refresh data
      const res = await api.get(`/submissions/${id}`);
      setSubmission(res.data);
    } catch (err: unknown) {
      console.error('Failed to save review:', err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to save review.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!submission) return;
    const original = submission.answers || {};
    setFlagAnswers(original.flagAnswers || {});
    setDialogInputs(original.dialogInputs || {});
    setStressTableInputs(original.stressTableInputs || {});
    setGrammarInputs(original.grammarInputs || {});
    setDialogue7aInputs(original.dialogue7aInputs || {});
    setConferenceCard(original.conferenceCard || { name: '', city: '', country: '', roles: [] });
    setJobsInputs(original.exercise_1b_jobs || original.jobsInputs || {});
    setReadingInputs(original.exercise_3_reading || original.readingInputs || {});
    setPage9Profiles(original.exercise_page9_profiles || {});
    setEx4aAnswers(original.exercise_4a_reading || {});
    setGrammar5aInputs(original.exercise_5a_grammar || {});
    setEx6Answers(original.exercise_6_dialogue || {});
    setEx7aAnswers(original.exercise_7a_qa || {});
    setProfilePairs(original.exercise_7b_profiles || {});
    setNationalitiesInputs(original.exercise_1b_nationalities || {});
    setStressInputs(original.exercise_2c_stress || {});
    setFamousInputs(original.exercise_3_famous || '');
    setPhotosInputs(original.exercise_4a_photos || {});
    setTfInputs(original.exercise_4b_tf || {});
    setGrammar5aInputs1C(original.exercise_5a_grammar || {});
    setTextsInputs(original.exercise_6_texts || {});
    setQuestionsInputs(original.exercise_7a_questions || {});
    setSpeakingNotes(original.exercise_8b_notes || '');

    // 1D reset
    if (original.exercise_1_location?.['1'] || original.exercise_1_location) {
      setEx1Location(original.exercise_1_location?.['1'] || original.exercise_1_location);
    }
    setEx2Audio(original.exercise_2_audio || {});
    setEx3aOrder(original.exercise_3a_order || {});
    setEx3bContact(original.exercise_3b_contact || {});
    setEx4aDialogue(original.exercise_4a_dialogue || {});
    setEx5Personal(original.exercise_5_personal || {});
    setEx6Partner(original.exercise_6_partner || {});
    setWordsearchFound(original.exercise_1_wordsearch || {});
    setEx2aOrder(original.exercise_2a_order || {});
    setEx2bShort(original.exercise_2b_short || {});
    setEx3Be(original.exercise_3_be || {});
    setEx4Jobs(original.exercise_4_jobs || {});
    setEx5IsIsnt(original.exercise_5_is_isnt || {});
    setEx6Corrections(original.exercise_6_corrections || {});
    setEx7aNationalities(original.exercise_7a_nationalities || {});
    setEx7bPeople(original.exercise_7b_people || {});
    setEx8Alternatives(original.exercise_8_alternatives || {});
    setEx9Text(original.exercise_9_text || {});
    setReflectScores(original.reflect_scores || {});

    // 2A reset
    setEx1FamilyTree(original.exercise_1_family_tree || {});
    setEx2aTable(original.exercise_2a_table || {});
    setEx3Sentences(original.exercise_3_sentences || {});
    setEx4aMatch(original.exercise_4a_match || {});
    setEx4bListening(original.exercise_4b_listening || {});
    setEx5Grammar(original.exercise_5_grammar || {});
    setEx7Dialogue(original.exercise_7_dialogue || {});
    setEx8Notes(original.exercise_8_notes || '');

    setSuccess('Reset to student answers');
  };

  if (loading) return <div className={styles.loading}>Loading submission details...</div>;
  if (error && !submission) return <div className={styles.error}>{error}</div>;
  if (!submission) return <div className={styles.error}>Submission not found.</div>;

  const isTutor = user?.role?.toUpperCase() !== 'STUDENT';
  const lesson = submission.lesson || submission.assignment?.lesson;
  const assignmentTitle = submission.assignment?.title;
  const isLesson1B =
    lesson?.order === 2 ||
    lesson?.title?.includes('1B') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
  const isLesson1C =
    lesson?.order === 3 ||
    lesson?.title?.includes('1C') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44';
  const isLesson1D =
    lesson?.order === 4 ||
    lesson?.title?.includes('1D') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a55';
  const isLesson2A =
    lesson?.order === 5 ||
    lesson?.title?.includes('2A') ||
    lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a66';
  const isCustomAssignment = Boolean(
    submission.answers?.text || (!lesson && submission.assignment),
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.submissionCard}>
        <button onClick={() => router.push('/teacher/dashboard')} className={styles.backButton}>
          ← Back to Dashboard
        </button>

        <div className={styles.headerSection}>
          <h1 className={styles.title}>Submission Details</h1>
          <div className={styles.infoGrid}>
            <p><span>Student:</span> {submission.student?.email}</p>
            <p><span>Lesson / Task:</span> {lesson?.title || assignmentTitle || 'Custom Assignment'}</p>
            <p><span>Submitted At:</span> {new Date(submission.createdAt).toLocaleString()}</p>
            <p><span>Auto Score:</span> <span className={styles.scoreBadge}>{submission.score ?? 0}%</span></p>
            <p><span>Status:</span> <span className={`${styles.scoreBadge} ${submission.status === 'graded' ? styles.statusGraded : submission.status === 'needs_revision' ? styles.statusRevision : styles.statusPending}`}>{submission.status}</span></p>
          </div>
        </div>

        {isCustomAssignment ? (
          <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ color: '#1b4c5b', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
              Student Response Text:
            </h3>
            <div style={{ whiteSpace: 'pre-wrap', background: 'white', padding: '1.25rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', lineHeight: '1.6' }}>
              {submission.answers?.text || (typeof submission.answers === 'string' ? submission.answers : 'No text content in submission')}
            </div>
            {submission.assignment?.attachmentUrl && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                <strong style={{ color: '#0369a1' }}>📎 Assignment Material: </strong>
                <a
                  href={submission.assignment.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0284c7', textDecoration: 'underline' }}
                >
                  {submission.assignment.attachmentUrl} ↗
                </a>
              </div>
            )}
          </div>
        ) : isLesson1B ? (
          <Lesson1BContent
            lesson={lesson}
            user={submission.student}
            jobsInputs={jobsInputs}
            readingInputs={readingInputs}
            onJobChange={(jid, val) => setJobsInputs((prev) => ({ ...prev, [jid]: val }))}
            onReadingChange={(rid, val) => setReadingInputs((prev) => ({ ...prev, [rid]: val }))}
            page9Profiles={page9Profiles}
            onPage9ProfileChange={(pid, val) => setPage9Profiles((prev) => ({ ...prev, [pid]: val }))}
            ex4aAnswers={ex4aAnswers}
            onEx4aChange={(qid, val) => setEx4aAnswers((prev) => ({ ...prev, [qid]: val }))}
            grammar5aInputs={grammar5aInputs}
            onGrammar5aChange={(gid, val) => setGrammar5aInputs((prev) => ({ ...prev, [gid]: val }))}
            ex6Answers={ex6Answers}
            onEx6Change={(qid, val) => setEx6Answers((prev) => ({ ...prev, [qid]: val }))}
            ex7aAnswers={ex7aAnswers}
            onEx7aChange={(qid, val) => setEx7aAnswers((prev) => ({ ...prev, [qid]: val }))}
            profilePairs={profilePairs}
            onProfilePairChange={(gender, field, val) =>
              setProfilePairs((prev) => ({
                ...prev,
                [gender]: { ...prev[gender], [field]: val },
              }))
            }
            readOnly={!isTutor}
            originalAnswers={submission.answers}
            playAudio={playAudio}
            playingAudio={playingAudio}
          />
        ) : isLesson1C ? (
          <Lesson1CContent
            lesson={lesson}
            user={submission.student}
            nationalitiesInputs={nationalitiesInputs}
            stressInputs={stressInputs}
            famousInputs={famousInputs}
            photosInputs={photosInputs}
            tfInputs={tfInputs}
            grammar5aInputs={grammar5aInputs1C}
            textsInputs={textsInputs}
            questionsInputs={questionsInputs}
            speakingNotes={speakingNotes}
            onNationalitiesChange={(nid, val) => setNationalitiesInputs((prev) => ({ ...prev, [nid]: val }))}
            onStressChange={(sid, val) => setStressInputs((prev) => ({ ...prev, [sid]: val }))}
            onFamousChange={(val) => setFamousInputs(val)}
            onPhotosChange={(pid, val) => setPhotosInputs((prev) => ({ ...prev, [pid]: val }))}
            onTfChange={(tid, val) => setTfInputs((prev) => ({ ...prev, [tid]: val }))}
            onGrammar5aChange={(gid, val) => setGrammar5aInputs1C((prev) => ({ ...prev, [gid]: val }))}
            onTextsChange={(tid, val) => setTextsInputs((prev) => ({ ...prev, [tid]: val }))}
            onQuestionsChange={(qid, val) => setQuestionsInputs((prev) => ({ ...prev, [qid]: val }))}
            onSpeakingNotesChange={(val) => setSpeakingNotes(val)}
            readOnly={!isTutor}
            originalAnswers={submission.answers}
            playAudio={playAudio}
            playingAudio={playingAudio}
          />
        ) : isLesson1D ? (
          <Lesson1DContent
            lesson={lesson}
            user={submission.student}
            readOnly={!isTutor}
            playAudio={playAudio}
            playingAudio={playingAudio}
            ex1Location={ex1Location}
            ex2Audio={ex2Audio}
            ex3aOrder={ex3aOrder}
            ex3bContact={ex3bContact}
            ex4aDialogue={ex4aDialogue}
            ex5Personal={ex5Personal}
            ex6Partner={ex6Partner}
            wordsearchFound={wordsearchFound}
            ex2aOrder={ex2aOrder}
            ex2bShort={ex2bShort}
            ex3Be={ex3Be}
            ex4Jobs={ex4Jobs}
            ex5IsIsnt={ex5IsIsnt}
            ex6Corrections={ex6Corrections}
            ex7aNationalities={ex7aNationalities}
            ex7bPeople={ex7bPeople}
            ex8Alternatives={ex8Alternatives}
            ex9Text={ex9Text}
            reflectScores={reflectScores}
            onEx1LocationChange={(val) => setEx1Location(val)}
            onEx2AudioChange={(fld, val) => setEx2Audio((prev) => ({ ...prev, [fld]: val }))}
            onEx3aOrderChange={(id, val) => setEx3aOrder((prev) => ({ ...prev, [id]: val }))}
            onEx3bContactChange={(id, val) => setEx3bContact((prev) => ({ ...prev, [id]: val }))}
            onEx4aDialogueChange={(id, val) => setEx4aDialogue((prev) => ({ ...prev, [id]: val }))}
            onEx5PersonalChange={(fld, val) => setEx5Personal((prev) => ({ ...prev, [fld]: val }))}
            onEx6PartnerChange={(fld, val) => setEx6Partner((prev) => ({ ...prev, [fld]: val }))}
            onWordsearchChange={(found) => setWordsearchFound(found)}
            onEx2aOrderChange={(id, val) => setEx2aOrder((prev) => ({ ...prev, [id]: val }))}
            onEx2bShortChange={(id, val) => setEx2bShort((prev) => ({ ...prev, [id]: val }))}
            onEx3BeChange={(id, val) => setEx3Be((prev) => ({ ...prev, [id]: val }))}
            onEx4JobsChange={(id, val) => setEx4Jobs((prev) => ({ ...prev, [id]: val }))}
            onEx5IsIsntChange={(id, val) => setEx5IsIsnt((prev) => ({ ...prev, [id]: val }))}
            onEx6CorrectionsChange={(id, val) => setEx6Corrections((prev) => ({ ...prev, [id]: val }))}
            onEx7aNationalitiesChange={(id, val) => setEx7aNationalities((prev) => ({ ...prev, [id]: val }))}
            onEx7bPeopleChange={(fld, val) => setEx7bPeople((prev) => ({ ...prev, [fld]: val }))}
            onEx8AlternativesChange={(id, val) => setEx8Alternatives((prev) => ({ ...prev, [id]: val }))}
            onEx9TextChange={(id, val) => setEx9Text((prev) => ({ ...prev, [id]: val }))}
            onReflectChange={(id, val) => setReflectScores((prev) => ({ ...prev, [id]: val }))}
            originalAnswers={submission.answers}
          />
        ) : isLesson2A ? (
          <Lesson2AContent
            lesson={lesson}
            user={submission.student}
            readOnly={!isTutor}
            playAudio={playAudio}
            playingAudio={playingAudio}
            ex1FamilyTree={ex1FamilyTree}
            ex2aTable={ex2aTable}
            ex3Sentences={ex3Sentences}
            ex4aMatch={ex4aMatch}
            ex4bListening={ex4bListening}
            ex5Grammar={ex5Grammar}
            ex7Dialogue={ex7Dialogue}
            ex8Notes={ex8Notes}
            onEx1FamilyTreeChange={(member, val) =>
              setEx1FamilyTree((prev) => ({ ...prev, [member]: val }))
            }
            onEx2aTableChange={(tid, val) =>
              setEx2aTable((prev) => ({ ...prev, [tid]: val }))
            }
            onEx3SentencesChange={(sid, val) =>
              setEx3Sentences((prev) => ({ ...prev, [sid]: val }))
            }
            onEx4aMatchChange={(speaker, val) =>
              setEx4aMatch((prev) => ({ ...prev, [speaker]: val }))
            }
            onEx4bListeningChange={(lid, val) =>
              setEx4bListening((prev) => ({ ...prev, [lid]: val }))
            }
            onEx5GrammarChange={(gid, val) =>
              setEx5Grammar((prev) => ({ ...prev, [gid]: val }))
            }
            onEx7DialogueChange={(did, val) =>
              setEx7Dialogue((prev) => ({ ...prev, [did]: val }))
            }
            onEx8NotesChange={(val) => setEx8Notes(val)}
            originalAnswers={submission.answers}
          />
        ) : (
          <LessonContent
            lesson={lesson}
            user={submission.student}
            flagAnswers={flagAnswers}
            dialogInputs={dialogInputs}
            stressTableInputs={stressTableInputs}
            grammarInputs={grammarInputs}
            dialogue7aInputs={dialogue7aInputs}
            conferenceCard={conferenceCard}
            onFlagChange={handleFlagChange}
            onDialogChange={handleDialogChange}
            onStressChange={handleStressChange}
            onGrammarChange={handleGrammarChange}
            onDialogue7aChange={handleDialogue7aChange}
            onConferenceCardChange={handleConferenceCardChange}
            onRoleToggle={handleRoleToggle}
            readOnly={!isTutor}
            originalAnswers={submission.answers}
            playAudio={playAudio}
            playingAudio={playingAudio}
          />
        )}

        {isTutor ? (
          <div className={styles.gradingForm}>
            <h2 className={styles.sectionTitle} style={{margin: '0 0 1rem 0', border: 'none', padding: 0}}>Grade Submission</h2>
            <div className={styles.formGroup}>
              <label>Grade (0-100)</label>
              <input 
                type="number" 
                value={grade} 
                onChange={(e) => setGrade(e.target.value)}
                min="0"
                max="100"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Tutor Comment</label>
              <textarea 
                value={tutorComment} 
                onChange={(e) => setTutorComment(e.target.value)}
                placeholder="Write your feedback here..."
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => handleSaveReview('graded')} 
                disabled={saving}
                className={styles.saveBtn}
              >
                {saving ? 'Saving...' : 'Save & Grade'}
              </button>
              <button 
                onClick={() => handleSaveReview('needs_revision')} 
                disabled={saving}
                className={styles.revisionBtn}
              >
                Return for revision
              </button>
              <button 
                onClick={handleReset}
                disabled={saving}
                className={styles.backButton}
                style={{ margin: 0 }}
              >
                Reset to student answers
              </button>
            </div>
            {success && <p className={styles.successMsg}>{success}</p>}
            {error && <p className={styles.errorMsg}>{error}</p>}
          </div>
        ) : (
          (submission.grade !== null || submission.tutorComment) && (
            <div className={styles.tutorFeedback}>
              <h4>Tutor Feedback</h4>
              {submission.grade !== null && <p><span>Grade:</span> {submission.grade}/100</p>}
              {submission.tutorComment && (
                <div>
                  <span>Comment:</span>
                  <p>{submission.tutorComment}</p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
