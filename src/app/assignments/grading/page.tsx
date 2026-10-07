'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import styles from './grading.module.scss';

interface TeacherStatItem {
  id: string;
  assignment?: { id?: string; title?: string; lesson?: { title?: string } };
  lesson?: { id?: string; title?: string };
  student?: { id?: string; email?: string };
  answers?: Record<string, unknown>;
  createdAt: string;
  grade?: number | null;
  tutorComment?: string | null;
  status?: string;
}

interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentName: string;
  studentId: string;
  content: string;
  fileUrl?: string;
  submittedAt: string;
  grade?: number;
  tutorComment?: string;
  status: 'pending' | 'graded';
}

export default function GradingPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState('');
  const [tutorComment, setTutorComment] = useState('');
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get('/submissions/teacher-stats');
        const mapped: Submission[] = (response.data || []).map((item: TeacherStatItem) => ({
          id: item.id,
          assignmentId: item.assignment?.id || item.lesson?.id || '',
          assignmentTitle: item.lesson?.title || item.assignment?.lesson?.title || item.assignment?.title || 'Lesson',
          studentName: item.student?.email || 'Student',
          studentId: item.student?.id || '',
          content: item.answers ? JSON.stringify(item.answers, null, 2) : '',
          submittedAt: item.createdAt,
          grade: item.grade ?? undefined,
          tutorComment: item.tutorComment || '',
          status: item.grade !== null && item.grade !== undefined ? 'graded' : 'pending',
        }));
        setSubmissions(mapped);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setGrading(true);

    try {
      await api.patch(`/submissions/${selectedSubmission.id}/grade`, {
        grade: parseInt(grade),
        tutorComment,
      });

      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedSubmission.id
            ? { ...sub, grade: parseInt(grade), tutorComment, status: 'graded' as const }
            : sub
        )
      );

      setSelectedSubmission(null);
      setGrade('');
      setTutorComment('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  const selectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade?.toString() || '');
    setTutorComment(submission.tutorComment || '');
  };

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const gradedSubmissions = submissions.filter((s) => s.status === 'graded');

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading submissions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Grade Assignments</h1>
          <Link href="/teacher/dashboard" className={styles.backLink}>
            Back to Teacher Dashboard
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        {selectedSubmission ? (
          <section className={styles.gradingPanel}>
            <div className={styles.gradingCard}>
              <div className={styles.gradingHeader}>
                <button className={styles.backButton} onClick={() => setSelectedSubmission(null)}>
                  ← Back to List
                </button>
                <h2 className={styles.gradingTitle}>Grade Submission</h2>
              </div>

              <div className={styles.submissionInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Student:</span>
                  <span className={styles.infoValue}>{selectedSubmission.studentName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Assignment:</span>
                  <span className={styles.infoValue}>{selectedSubmission.assignmentTitle}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Submitted:</span>
                  <span className={styles.infoValue}>
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className={styles.submissionContent}>
                <h3 className={styles.contentTitle}>Student's Answer</h3>
                <p className={styles.contentText}>{selectedSubmission.content}</p>
                {selectedSubmission.fileUrl && (
                  <a href={selectedSubmission.fileUrl} className={styles.fileLink} target="_blank" rel="noopener noreferrer">
                    View Attached File
                  </a>
                )}
              </div>

              <form className={styles.gradingForm} onSubmit={handleGradeSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="grade" className={styles.label}>
                    Grade (0-100)
                  </label>
                  <input
                    id="grade"
                    type="number"
                    min="0"
                    max="100"
                    className={styles.input}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="tutorComment" className={styles.label}>
                    Feedback
                  </label>
                  <textarea
                    id="tutorComment"
                    className={styles.textarea}
                    value={tutorComment}
                    onChange={(e) => setTutorComment(e.target.value)}
                    placeholder="Provide feedback to the student..."
                    rows={6}
                  />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.formActions}>
                  <button type="button" className={styles.buttonSecondary} onClick={() => setSelectedSubmission(null)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.buttonPrimary} disabled={grading}>
                    {grading ? 'Submitting...' : 'Submit Grade'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        ) : (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Pending Submissions ({pendingSubmissions.length})</h2>
              {pendingSubmissions.length === 0 ? (
                <p className={styles.empty}>No pending submissions.</p>
              ) : (
                <div className={styles.list}>
                  {pendingSubmissions.map((submission) => (
                    <div key={submission.id} className={styles.listItem}>
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemTitle}>{submission.assignmentTitle}</h3>
                        <p className={styles.itemStudent}>{submission.studentName}</p>
                        <p className={styles.itemDate}>
                          Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button className={styles.button} onClick={() => selectSubmission(submission)}>
                        Grade
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Graded Submissions ({gradedSubmissions.length})</h2>
              {gradedSubmissions.length === 0 ? (
                <p className={styles.empty}>No graded submissions yet.</p>
              ) : (
                <div className={styles.list}>
                  {gradedSubmissions.map((submission) => (
                    <div key={submission.id} className={styles.listItem}>
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemTitle}>{submission.assignmentTitle}</h3>
                        <p className={styles.itemStudent}>{submission.studentName}</p>
                        <div className={styles.itemMeta}>
                          <span className={styles.gradeBadge}>Grade: {submission.grade}/100</span>
                          <span className={styles.itemDate}>
                            Graded: {new Date(submission.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button className={styles.buttonSecondary} onClick={() => selectSubmission(submission)}>
                        Review
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
