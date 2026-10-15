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

interface TeacherAssignment {
  id: string;
  title: string;
  description?: string;
  attachmentUrl?: string;
  assignedStudent?: { id: string; email: string } | null;
  dueDate?: string;
  submissionsCount?: number;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<TeacherStatItem[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [students, setStudents] = useState<{ id: string; email: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'submissions' | 'assignments'>('submissions');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'submitted' | 'needs_revision' | 'graded'>('all');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingAssignment, setCreatingAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    attachmentUrl: '',
    studentId: '',
    dueDate: '',
  });

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

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title.trim()) {
      alert('Please enter an assignment title');
      return;
    }
    try {
      setCreatingAssignment(true);
      const res = await api.post('/assignments', {
        title: newAssignment.title.trim(),
        description: newAssignment.description.trim() || undefined,
        attachmentUrl: newAssignment.attachmentUrl.trim() || undefined,
        studentId: newAssignment.studentId || undefined,
        dueDate: newAssignment.dueDate ? new Date(newAssignment.dueDate).toISOString() : undefined,
      });
      setAssignments((prev) => [res.data, ...prev]);
      setShowCreateModal(false);
      setNewAssignment({
        title: '',
        description: '',
        attachmentUrl: '',
        studentId: '',
        dueDate: '',
      });
      alert('Assignment created successfully!');
    } catch (err: unknown) {
      console.error('Failed to create assignment:', err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || 'Failed to create assignment');
    } finally {
      setCreatingAssignment(false);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }
    try {
      await api.delete(`/assignments/${id}`);
      setAssignments((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete assignment:', err);
      alert('Failed to delete assignment');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, assignmentsRes, studentsRes] = await Promise.all([
          api.get('/submissions/teacher-stats').catch(() => ({ data: [] })),
          api.get('/assignments').catch(() => ({ data: [] })),
          api.get('/assignments/students').catch(() => ({ data: [] })),
        ]);
        setStats(statsRes.data || []);
        setAssignments(assignmentsRes.data || []);
        setStudents(studentsRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard data. Please check backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

        {/* Главная панель вкладок и кнопка создания ДЗ */}
        <div className={styles.topBarRow}>
          <div className={styles.mainTabs} style={{ margin: 0, border: 'none', padding: 0 }}>
            <button
              className={`${styles.mainTabBtn} ${activeTab === 'submissions' ? styles.mainTabActive : ''}`}
              onClick={() => setActiveTab('submissions')}
            >
              Student Submissions ({stats.length})
            </button>
            <button
              className={`${styles.mainTabBtn} ${activeTab === 'assignments' ? styles.mainTabActive : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              Assigned Tasks ({assignments.length})
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className={styles.createAssignmentBtn}
          >
            + Assign Task
          </button>
        </div>

        {/* Modal: Create Custom Assignment */}
        {showCreateModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
              <h2 className={styles.modalTitle}>New Assignment</h2>
              <form onSubmit={handleCreateAssignment}>
                <div className={styles.formField}>
                  <label>Assignment Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Essay about weekend plans"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  />
                </div>

                <div className={styles.formField}>
                  <label>Instructions / Task Details</label>
                  <textarea
                    rows={4}
                    placeholder="Describe what the student needs to do (words, grammar, questions)..."
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  />
                </div>

                <div className={styles.formField}>
                  <label>Resource Link (Google Drive, YouTube, article)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newAssignment.attachmentUrl}
                    onChange={(e) => setNewAssignment({ ...newAssignment, attachmentUrl: e.target.value })}
                  />
                </div>

                <div className={styles.formField}>
                  <label>Assign To</label>
                  <select
                    value={newAssignment.studentId}
                    onChange={(e) => setNewAssignment({ ...newAssignment, studentId: e.target.value })}
                  >
                    <option value="">All Students</option>
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formField}>
                  <label>Due Date (Deadline)</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingAssignment}
                    className={styles.submitModalBtn}
                  >
                    {creatingAssignment ? 'Creating...' : 'Assign Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Вкладка 1: Проверка сданных работ */}
        {activeTab === 'submissions' && (
          <>
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
                      <th>Lesson / Assignment</th>
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
                        <td>{item.lesson?.title || item.assignment?.title || item.assignment?.lesson?.title || 'Assignment'}</td>
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
          </>
        )}

        {/* Вкладка 2: Выданные задания */}
        {activeTab === 'assignments' && (
          <div className={styles.tableContainer}>
            {assignments.length === 0 ? (
              <div className={styles.emptyState}>
                No assigned tasks yet. Click &quot;+ Assign Task&quot; to create homework for students.
              </div>
            ) : (
              <table className={styles.statsTable}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Instructions</th>
                    <th>Resource</th>
                    <th>Assigned To</th>
                    <th>Due Date</th>
                    <th>Submissions</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((item) => (
                    <tr key={item.id}>
                      <td className={styles.studentName}>{item.title}</td>
                      <td>{item.description || '—'}</td>
                      <td>
                        {item.attachmentUrl ? (
                          <a
                            href={item.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.materialLink}
                          >
                            Open Resource ↗
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>{item.assignedStudent ? item.assignedStudent.email : 'All Students'}</td>
                      <td>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No Deadline'}</td>
                      <td>{item.submissionsCount ?? 0}</td>
                      <td className={styles.actionCell}>
                        <button
                          onClick={() => handleDeleteAssignment(item.id)}
                          className={styles.deleteBtn}
                          title="Delete assignment"
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
        )}

      </div>
    </div>
  );
}
