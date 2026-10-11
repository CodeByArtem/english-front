'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './teacher.module.scss';

interface TeacherStatItem {
  id: string;
  student?: {
    id?: string;
    email?: string;
  };
  lesson?: {
    id?: string;
    title?: string;
  };
  assignment?: {
    id?: string;
    title?: string;
    lesson?: {
      title?: string;
    };
  };
  score: number;
  status?: string;
  grade?: number;
  tutorComment?: string;
  createdAt?: string;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<TeacherStatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'submitted' | 'needs_revision' | 'graded'>('all');

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteExpiresAt, setInviteExpiresAt] = useState<string | null>(null);
  const [generatingInvite, setGeneratingInvite] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState('');
  const [inviteError, setInviteError] = useState('');

  const handleGenerateInvite = async () => {
    try {
      setGeneratingInvite(true);
      setInviteError('');
      setInviteSuccessMsg('');
      const res = await api.post('/invites');
      setInviteCode(res.data.inviteCode);
      setInviteExpiresAt(res.data.expiresAt);
    } catch (err) {
      const errorResponse =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response
          : undefined;
      setInviteError(errorResponse?.data?.message || 'Failed to generate invite code');
    } finally {
      setGeneratingInvite(false);
    }
  };

  const handleCopyCode = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setInviteSuccessMsg('Invite code copied to clipboard!');
      setTimeout(() => setInviteSuccessMsg(''), 3000);
    } catch {
      setInviteSuccessMsg('Failed to copy. Please copy manually.');
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) {
      return;
    }
    try {
      await api.delete(`/submissions/${id}`);
      setStats((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete submission:', err);
      alert('Failed to delete submission. Please try again.');
    }
  };

  useEffect(() => {
    const fetchTeacherStats = async () => {
      try {
        setLoading(true);
        // Запрос к бэкенду за статистикой отправок учеников
        const res = await api.get('/submissions/teacher-stats');
        setStats(res.data || []);
      } catch (err) {
        console.error('Failed to load teacher stats:', err);
        setError('Failed to load students submissions. Please check backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherStats();
  }, []);

  const counts = {
    all: stats.length,
    submitted: stats.filter((s) => s.status === 'submitted').length,
    needs_revision: stats.filter((s) => s.status === 'needs_revision').length,
    graded: stats.filter((s) => s.status === 'graded').length,
  };

  const filteredStats = stats.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  if (loading) {
    return <div className={styles.loading}>Loading teacher dashboard...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.dashboardCard}>
        
        {/* Навигация */}
        <button 
          onClick={() => router.push('/dashboard')} 
          className={styles.backButton}
        >
          ← Back to Main Dashboard
        </button>

        <div className={styles.headerSection}>
          <h1 className={styles.title}>Teacher Dashboard</h1>
          <p className={styles.subtitle}>Track your students&apos; homework submissions and performance for Roadmap A1.</p>
        </div>

        {/* Invite Colleague Section */}
        <div className={styles.inviteSection}>
          <div className={styles.inviteHeader}>
            <div>
              <h2 className={styles.inviteTitle}>Invite Colleague (Tutor)</h2>
              <p className={styles.inviteDesc}>
                Generate a secure, single-use invite code valid for 7 days to register a new teacher.
              </p>
            </div>
            <button
              onClick={handleGenerateInvite}
              disabled={generatingInvite}
              className={styles.inviteButton}
            >
              {generatingInvite ? 'Generating...' : '+ Generate Invite Code'}
            </button>
          </div>

          {inviteError && <div className={styles.errorBox}>{inviteError}</div>}

          {inviteCode && (
            <div className={styles.inviteCard}>
              <div className={styles.inviteRow}>
                <span className={styles.inviteLabel}>One-time Invite Code:</span>
                <code className={styles.inviteCode}>{inviteCode}</code>
                <button onClick={handleCopyCode} className={styles.copyBtn}>
                  Copy Code
                </button>
              </div>
              {inviteExpiresAt && (
                <div className={styles.inviteExpiry}>
                  Expires on: {new Date(inviteExpiresAt).toLocaleString()}
                </div>
              )}
              {inviteSuccessMsg && (
                <div className={styles.inviteSuccess}>{inviteSuccessMsg}</div>
              )}
            </div>
          )}
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {/* Таблица результатов учеников */}
        <div className={styles.tabBar}>
          <button
            className={filter === 'all' ? styles.tabActive : styles.tab}
            onClick={() => setFilter('all')}
          >
            All ({counts.all})
          </button>
          <button
            className={filter === 'submitted' ? styles.tabActive : styles.tab}
            onClick={() => setFilter('submitted')}
          >
            Waiting for Review ({counts.submitted})
          </button>
          <button
            className={filter === 'needs_revision' ? styles.tabActive : styles.tab}
            onClick={() => setFilter('needs_revision')}
          >
            Needs Revision ({counts.needs_revision})
          </button>
          <button
            className={filter === 'graded' ? styles.tabActive : styles.tab}
            onClick={() => setFilter('graded')}
          >
            Graded ({counts.graded})
          </button>
        </div>

        <div className={styles.tableContainer}>
          {filteredStats.length === 0 ? (
            <div className={styles.emptyState}>
              {stats.length === 0
                ? 'No student submissions found yet. Once students submit their homework, results will appear here.'
                : 'No submissions found for the selected filter.'}
            </div>
          ) : (
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Lesson</th>
                  <th>Status</th>
                  <th>Score (%)</th>
                  <th>Submitted At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStats.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className={styles.studentName}>{item.student?.email || 'Student'}</td>
                    <td>{item.lesson?.title || item.assignment?.lesson?.title || '1A Hello'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${
                        item.status === 'graded'
                          ? styles.statusGraded
                          : item.status === 'needs_revision'
                          ? styles.statusRevision
                          : styles.statusSubmitted
                      }`}>
                        {item.status === 'needs_revision'
                          ? 'Needs Revision'
                          : item.status === 'graded'
                          ? 'Graded'
                          : 'Pending Review'}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.scoreBadge} ${item.score >= 80 ? styles.highScore : styles.lowScore}`}>
                        {item.score}%
                      </span>
                    </td>
                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className={styles.actionCell}>
                      <button 
                        onClick={() => router.push(`/submissions/${item.id}`)}
                        className={styles.gradeBtn}
                      >
                        View / Grade
                      </button>
                      <button 
                        onClick={() => handleDeleteSubmission(item.id)}
                        className={styles.deleteBtn}
                        title="Delete submission"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
