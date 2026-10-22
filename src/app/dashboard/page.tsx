'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api, { setLoggingOut } from '@/lib/api';
import LessonCard from '@/components/Dashboard/LessonCard';
import HomeworkCard from '@/components/Dashboard/HomeworkCard';
import Navbar from '@/components/Navbar/Navbar';
import styles from './page.module.scss';

interface Lesson {
  id: string;
  title: string;
  order?: number;
}

interface Unit {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Textbook {
  id: string;
  title: string;
  description: string;
  level: string;
  units: Unit[];
}

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface SubmissionItem {
  id: string;
  score?: number;
  grade?: number;
  status: string;
  tutorComment?: string;
  createdAt: string;
  lesson?: { id: string; title: string };
}

interface TeacherAssignmentItem {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  attachmentUrl?: string;
  status: 'pending' | 'submitted' | 'graded' | 'needs_revision';
  grade?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<TeacherAssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expandedTextbook, setExpandedTextbook] = useState<string | null>(null);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  useEffect(() => {
    // Зачистка устаревших токенов из localStorage, если они попали туда от старых версий кода
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    const fetchData = async () => {
      setLoadError(null);
      try {
        const [userResponse, textbooksResponse] = await Promise.all([
          api.get('/auth/profile'),
          api.get('/content/textbooks').catch(() => ({ data: [] })),
        ]);
        setUser(userResponse.data);
        const tbData: Textbook[] = textbooksResponse.data || [];
        setTextbooks(tbData);

        // По умолчанию раскрываем первый учебник и его первый юнит для мгновенного доступа к урокам
        if (tbData.length > 0) {
          setExpandedTextbook(tbData[0].id);
          if (tbData[0].units && tbData[0].units.length > 0) {
            setExpandedUnit(tbData[0].units[0].id);
          }
        }

        if (userResponse.data?.role?.toLowerCase() === 'student') {
          try {
            const [subRes, assignRes] = await Promise.all([
              api.get('/submissions/student').catch(() => ({ data: [] })),
              api.get('/assignments').catch(() => ({ data: [] })),
            ]);
            setSubmissions(subRes.data || []);
            setTeacherAssignments(assignRes.data || []);
          } catch {
            // Игнорируем, если у ученика пока нет сданных заданий
          }
        }
      } catch {
        // Не залогинен: перенаправляем на логин
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const toggleTextbook = (id: string) => {
    setExpandedTextbook((prev) => (prev === id ? null : id));
  };

  const toggleUnit = (id: string) => {
    setExpandedUnit((prev) => (prev === id ? null : id));
  };

  const handleLogout = async () => {
    setLoggingOut(true); // подавляет редиректы на /login во время выхода
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingWrapper} role="status" aria-live="polite">
          <div className={styles.spinner} aria-hidden="true" />
          <p className={styles.loadingText}>Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorWrapper} role="alert">
          <span className={styles.errorIcon} aria-hidden="true">⚠️</span>
          <h2>Unable to load dashboard</h2>
          <p>{loadError}</p>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Navbar user={user} onLogout={handleLogout} />

      <main className={styles.main}>
        {/* Welcome Section */}
        <motion.section
          className={styles.welcome}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <h1 className={styles.welcomeTitle}>
            Welcome back, {user.name || user.email.split('@')[0]}!
          </h1>
          <p className={styles.welcomeSubtitle}>
            Continue your English learning journey at your own pace
          </p>

          {(user.role === 'teacher' || user.role === 'tutor' || user.role === 'admin') && (
            <div className={styles.teacherActions}>
              <Link href="/teacher/dashboard" className={styles.teacherLink}>
                <span>Review Submissions (Проверка заданий)</span>
                <span className={styles.teacherArrow} aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </motion.section>

        {/* Assignments from Teacher */}
        {teacherAssignments.length > 0 && (
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Assignments from Teacher
                <span className={styles.sectionBadge}>{teacherAssignments.length}</span>
              </h2>
            </div>
            <div className={styles.submissionGrid}>
              {teacherAssignments.map((assign, idx) => (
                <HomeworkCard
                  key={assign.id}
                  id={assign.id}
                  title={assign.title}
                  status={assign.status}
                  grade={assign.grade}
                  description={assign.description}
                  dateLabel={assign.dueDate ? `Due: ${new Date(assign.dueDate).toLocaleDateString()}` : 'No deadline'}
                  actionHref={`/assignments/${assign.id}`}
                  actionLabel={assign.status === 'pending' ? 'Open & Submit' : 'View Submission'}
                  index={idx}
                />
              ))}
            </div>
          </section>
        )}

        {/* My Homework & Progress */}
        {submissions.length > 0 && (
          <section className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                My Homework & Progress
                <span className={styles.sectionBadge}>{submissions.length}</span>
              </h2>
            </div>
            <div className={styles.submissionGrid}>
              {submissions.map((sub, idx) => {
                const lessonTitle =
                  sub.lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'
                    ? '1B Jobs'
                    : sub.lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'
                    ? '1C Nationalities'
                    : sub.lesson?.title || 'Lesson';

                return (
                  <HomeworkCard
                    key={sub.id}
                    id={sub.id}
                    title={lessonTitle}
                    status={sub.status}
                    grade={sub.grade}
                    score={sub.score}
                    tutorComment={sub.tutorComment}
                    dateLabel={`Submitted: ${new Date(sub.createdAt).toLocaleDateString()}`}
                    actionHref={sub.lesson?.id ? `/lessons/${sub.lesson.id}` : '#'}
                    actionLabel={sub.status === 'needs_revision' ? 'Fix & Resubmit' : 'Open Lesson'}
                    index={idx}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Textbooks & Interactive Lessons */}
        <section className={styles.courses}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Textbooks</h2>
          </div>

          {textbooks.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon} aria-hidden="true">📚</span>
              <p className={styles.emptyText}>No textbooks assigned yet.</p>
            </div>
          ) : (
            <div className={styles.textbookList}>
              {textbooks.map((textbook) => {
                const isTbExpanded = expandedTextbook === textbook.id;
                return (
                  <div key={textbook.id} className={styles.textbookItem}>
                    <button
                      type="button"
                      className={styles.textbookHeader}
                      onClick={() => toggleTextbook(textbook.id)}
                      aria-expanded={isTbExpanded}
                    >
                      <div className={styles.textbookInfo}>
                        <span className={styles.levelBadge}>{textbook.level}</span>
                        <div>
                          <h3 className={styles.textbookTitle}>{textbook.title}</h3>
                          {textbook.description && (
                            <p className={styles.textbookDesc}>{textbook.description}</p>
                          )}
                        </div>
                      </div>
                      <motion.div
                        className={styles.chevronWrap}
                        animate={{ rotate: isTbExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className={styles.chevron} aria-hidden="true">▼</span>
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isTbExpanded && (
                        <motion.div
                          key="unit-list"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className={styles.unitListWrapper}
                        >
                          <div className={styles.unitList}>
                            {textbook.units.map((unit) => {
                              const isUnitExpanded = expandedUnit === unit.id;
                              return (
                                <div key={unit.id} className={styles.unitItem}>
                                  <button
                                    type="button"
                                    className={styles.unitHeader}
                                    onClick={() => toggleUnit(unit.id)}
                                    aria-expanded={isUnitExpanded}
                                  >
                                    <div className={styles.unitInfo}>
                                      <span className={styles.unitIcon} aria-hidden="true">📁</span>
                                      <h4 className={styles.unitTitle}>{unit.title}</h4>
                                      <span className={styles.unitCount}>
                                        {unit.lessons.length} {unit.lessons.length === 1 ? 'lesson' : 'lessons'}
                                      </span>
                                    </div>
                                    <motion.div
                                      className={styles.chevronWrap}
                                      animate={{ rotate: isUnitExpanded ? 180 : 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <span className={styles.chevronSmall} aria-hidden="true">▼</span>
                                    </motion.div>
                                  </button>

                                  <AnimatePresence initial={false}>
                                    {isUnitExpanded && (
                                      <motion.div
                                        key="lesson-grid"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                                        className={styles.lessonGridWrapper}
                                      >
                                        <div className={styles.lessonGrid}>
                                          {unit.lessons.map((lesson, lIdx) => {
                                            const sub = submissions.find((s) => s.lesson?.id === lesson.id);
                                            return (
                                              <LessonCard
                                                key={lesson.id}
                                                lesson={lesson}
                                                submission={sub}
                                                index={lIdx}
                                                unitTitle={unit.title}
                                              />
                                            );
                                          })}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
