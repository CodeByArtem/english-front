'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { setLoggingOut } from '@/lib/api';
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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTextbook, setExpandedTextbook] = useState<string | null>(null);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, textbooksResponse] = await Promise.all([
          api.get('/auth/profile'),
          api.get('/content/textbooks').catch(() => ({ data: [] })),
        ]);
        setUser(userResponse.data);
        setTextbooks(textbooksResponse.data);

        if (userResponse.data?.role?.toLowerCase() === 'student') {
          try {
            const subRes = await api.get('/submissions/student');
            setSubmissions(subRes.data || []);
          } catch {
            // Ignore if student has no submissions yet
          }
        }
      } catch (err) {
        // Не залогинен: на логин
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const toggleTextbook = (id: string) => {
    setExpandedTextbook(expandedTextbook === id ? null : id);
  };

  const toggleUnit = (id: string) => {
    setExpandedUnit(expandedUnit === id ? null : id);
  };

  const handleLogout = async () => {
    setLoggingOut(true); // подавляет редиректы на /login во время выхода
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      // Полная перезагрузка: сбрасывает стейт и флаг, открывает главную
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <Link href="/" className={styles.logo}>
              English Learning
            </Link>
            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name || user.email}</span>
                <span className={styles.userRole}>{user.role}</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.welcome}>
            <h1 className={styles.welcomeTitle}>
              Welcome back, {user.name || user.email.split('@')[0]}!
            </h1>
            <p className={styles.welcomeSubtitle}>
              Continue your English learning journey
            </p>
            {(user.role === 'teacher' || user.role === 'tutor' || user.role === 'admin') && (
                <div className={styles.teacherActions}>
                  <Link href="/teacher/dashboard" className={styles.teacherLink}>
                    Review Submissions (Проверка заданий)
                  </Link>
                </div>
            )}
          </section>

          {submissions.length > 0 && (
            <section className={styles.submissionsSection}>
              <h2 className={styles.sectionTitle}>My Homework & Progress</h2>
              <div className={styles.submissionGrid}>
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className={`${styles.subCard} ${sub.status === 'needs_revision' ? styles.subCardRevision : ''}`}
                  >
                    <div className={styles.subCardHeader}>
                      <h3 className={styles.subLessonTitle}>
                        {sub.lesson?.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'
                          ? '1B Jobs'
                          : sub.lesson?.title || 'Lesson'}
                      </h3>
                      <span className={`${styles.subStatusBadge} ${
                        sub.status === 'graded'
                          ? styles.badgeGraded
                          : sub.status === 'needs_revision'
                          ? styles.badgeRevision
                          : styles.badgeSubmitted
                      }`}>
                        {sub.status === 'needs_revision'
                          ? '⚠️ Needs Revision'
                          : sub.status === 'graded'
                          ? `Graded (${sub.grade ?? sub.score}%)`
                          : '⏳ Under Review'}
                      </span>
                    </div>
                    {sub.status === 'needs_revision' && sub.tutorComment && (
                      <p className={styles.tutorComment}>
                        <strong>Teacher note:</strong> {sub.tutorComment}
                      </p>
                    )}
                    <div className={styles.subCardFooter}>
                      <span className={styles.subDate}>Submitted: {new Date(sub.createdAt).toLocaleDateString()}</span>
                      {sub.lesson?.id && (
                        <Link
                          href={`/lessons/${sub.lesson.id}`}
                          className={sub.status === 'needs_revision' ? styles.actionBtnRevision : styles.actionBtnView}
                        >
                          {sub.status === 'needs_revision' ? 'Fix & Resubmit →' : 'Open Lesson →'}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={styles.courses}>
            <h2 className={styles.sectionTitle}>Your Textbooks</h2>
            <div className={styles.textbookList}>
              {textbooks.map((textbook) => (
                  <div key={textbook.id} className={styles.textbookItem}>
                    <div
                        className={styles.textbookHeader}
                        onClick={() => toggleTextbook(textbook.id)}
                    >
                      <div className={styles.textbookInfo}>
                        <h3 className={styles.textbookTitle}>{textbook.title}</h3>
                        <span className={styles.level}>{textbook.level}</span>
                      </div>
                      <div className={styles.chevron}>
                        {expandedTextbook === textbook.id ? '▼' : '▶'}
                      </div>
                    </div>

                    {expandedTextbook === textbook.id && (
                        <div className={styles.unitList}>
                          {textbook.units.map((unit) => (
                              <div key={unit.id} className={styles.unitItem}>
                                <div
                                    className={styles.unitHeader}
                                    onClick={() => toggleUnit(unit.id)}
                                >
                                  <h4 className={styles.unitTitle}>{unit.title}</h4>
                                  <div className={styles.chevron}>
                                    {expandedUnit === unit.id ? '▼' : '▶'}
                                  </div>
                                </div>

                                {expandedUnit === unit.id && (
                                    <ul className={styles.lessonList}>
                                      {unit.lessons.map((lesson) => {
                                        const sub = submissions.find((s) => s.lesson?.id === lesson.id);
                                        const lessonTitle =
                                          lesson.order === 2 || lesson.id === 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'
                                            ? '1B Jobs'
                                            : lesson.title;
                                        return (
                                          <li key={lesson.id} className={styles.lessonItem}>
                                            <Link href={`/lessons/${lesson.id}`} className={styles.lessonLink}>
                                              <span className={styles.lessonIcon}>📖</span>
                                              <span>{lessonTitle}</span>
                                              {sub && (
                                                <span className={`${styles.inlineBadge} ${
                                                  sub.status === 'graded'
                                                    ? styles.badgeGraded
                                                    : sub.status === 'needs_revision'
                                                    ? styles.badgeRevision
                                                    : styles.badgeSubmitted
                                                }`}>
                                                  {sub.status === 'needs_revision'
                                                    ? 'Needs Revision'
                                                    : sub.status === 'graded'
                                                    ? `${sub.grade ?? sub.score}%`
                                                    : 'Under Review'}
                                                </span>
                                              )}
                                            </Link>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                )}
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
              ))}
            </div>
          </section>
        </main>
      </div>
  );
}