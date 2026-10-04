'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import styles from './assignment-detail.module.scss';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  submission?: {
    id: string;
    content: string;
    fileUrl?: string;
    submittedAt: string;
    grade?: number;
    feedback?: string;
  };
}

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await api.get(`/assignments/${params.id}`);
        setAssignment(response.data);
        if (response.data.submission) {
          setContent(response.data.submission.content);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (file) {
        formData.append('file', file);
      }

      await api.post(`/assignments/${params.id}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push('/assignments');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading assignment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <Link href="/assignments" className={styles.backButton}>
          Back to Assignments
        </Link>
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  const isSubmitted = assignment.status !== 'pending';

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/assignments" className={styles.backLink}>
            ← Back to Assignments
          </Link>
          <h1 className={styles.title}>{assignment.title}</h1>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.details}>
          <div className={styles.detailCard}>
            <h2 className={styles.sectionTitle}>Assignment Details</h2>
            <p className={styles.description}>{assignment.description}</p>
            <div className={styles.meta}>
              <span className={styles.dueDate}>
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
              <span className={`${styles.status} ${assignment.status === 'graded' ? styles.statusGraded : assignment.status === 'submitted' ? styles.statusSubmitted : styles.statusPending}`}>
                {assignment.status}
              </span>
            </div>
          </div>
        </section>

        {isSubmitted && assignment.submission && (
          <section className={styles.submission}>
            <div className={styles.submissionCard}>
              <h2 className={styles.sectionTitle}>Your Submission</h2>
              <div className={styles.submissionContent}>
                <p className={styles.submissionText}>{assignment.submission.content}</p>
                {assignment.submission.fileUrl && (
                  <a href={assignment.submission.fileUrl} className={styles.fileLink} target="_blank" rel="noopener noreferrer">
                    View Attached File
                  </a>
                )}
                <p className={styles.submittedAt}>
                  Submitted: {new Date(assignment.submission.submittedAt).toLocaleString()}
                </p>
              </div>
              {assignment.submission.grade !== undefined && (
                <div className={styles.gradeSection}>
                  <span className={styles.gradeLabel}>Grade:</span>
                  <span className={styles.gradeValue}>{assignment.submission.grade}/100</span>
                </div>
              )}
              {assignment.submission.feedback && (
                <div className={styles.feedbackSection}>
                  <h3 className={styles.feedbackTitle}>Tutor Feedback</h3>
                  <p className={styles.feedbackText}>{assignment.submission.feedback}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {!isSubmitted && (
          <section className={styles.submit}>
            <div className={styles.submitCard}>
              <h2 className={styles.sectionTitle}>Submit Assignment</h2>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="content" className={styles.label}>
                    Your Answer
                  </label>
                  <textarea
                    id="content"
                    className={styles.textarea}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Write your answer here..."
                    rows={8}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="file" className={styles.label}>
                    Attach File (Optional)
                  </label>
                  <input
                    id="file"
                    type="file"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                  />
                  {file && <span className={styles.fileName}>{file.name}</span>}
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button type="submit" className={styles.button} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
