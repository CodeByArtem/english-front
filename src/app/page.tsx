'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Navbar from '@/components/Navbar/Navbar';
import styles from './page.module.scss';

interface Lesson {
  id: string;
  title: string;
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

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Зачистка устаревших токенов из localStorage, если они попали туда от старых версий кода
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    const fetchData = async () => {
      try {
        // allSettled: если profile вернул 401 (гость), textbooks всё равно обработается
        const [userResult, textbooksResult] = await Promise.allSettled([
          api.get('/auth/profile'),
          api.get('/content/textbooks'),
        ]);

        if (userResult.status === 'fulfilled') {
          setUser(userResult.value.data);
        }
        if (textbooksResult.status === 'fulfilled') {
          setTextbooks(textbooksResult.value.data);
        }
      } finally {
        setLoading(false); // экран никогда не зависнет на Loading...
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      // Браузер сам отправит cookie через withCredentials — тело запроса не нужно
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      // Удаляем все возможные данные из localStorage (токены + UI-данные)
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      setUser(null); // мы уже на главной, остаёмся здесь как гость
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar user={user} onLogout={handleLogout} />

      <main className={styles.main}>
        <div className={styles.hero}>
          <h2 className={styles.heroTitle}>Learn English at Your Own Pace</h2>
          <p className={styles.heroSubtitle}>
            Interactive lessons, structured roadmaps, and personalized learning paths.
          </p>
          {!user && (
            <Link
              href="/register"
              className={styles.heroButton}
              style={{
                display: 'inline-block',
                marginTop: '1.5rem',
                padding: '0.75rem 2rem',
                background: '#0070f3',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Start for Free
            </Link>
          )}
        </div>

        <section className={styles.courses}>
          <h3 className={styles.sectionTitle}>Available Textbooks</h3>
          <div className={styles.grid}>
            {textbooks.map((textbook) => (
              <div key={textbook.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.level}>{textbook.level}</span>
                </div>
                <h4 className={styles.cardTitle}>{textbook.title}</h4>
                <p className={styles.cardDescription}>{textbook.description}</p>
                <Link href={user ? '/dashboard' : '/login'} className={styles.cardButton}>
                  {user ? 'View Content' : 'Get Started'}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
