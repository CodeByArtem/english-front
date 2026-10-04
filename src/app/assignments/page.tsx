'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import styles from './assignments.module.scss';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: number;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get('/assignments');
        setAssignments(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'submitted':
        return styles.statusSubmitted;
      case 'graded':
        return styles.statusGraded;
      default:
        return styles.statusPending;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading assignments...</div>
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
          <h1 className={styles.title}>Assignments</h1>
          <Link href="/" className={styles.backLink}>
            Back to Courses
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        {assignments.length === 0 ? (
          <div className={styles.empty}>
            <p>No assignments available yet.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {assignments.map((assignment) => (
              <div key={assignment.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{assignment.title}</h3>
                  <span className={`${styles.status} ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>
                <p className={styles.description}>{assignment.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.dueDate}>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  {assignment.grade && (
                    <span className={styles.grade}>Grade: {assignment.grade}/100</span>
                  )}
                </div>
                <Link href={`/assignments/${assignment.id}`} className={styles.button}>
                  {assignment.status === 'pending' ? 'Submit Assignment' : 'View Details'}
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
