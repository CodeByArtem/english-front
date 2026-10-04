'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './register.module.scss';

type Role = 'student' | 'tutor';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', { email, password, role });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Sign up to get started with your learning journey.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
              minLength={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Role</label>
            <div className={styles.roleSelector}>
              <button
                type="button"
                className={`${styles.roleButton} ${role === 'student' ? styles.roleButtonActive : ''}`}
                onClick={() => setRole('student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`${styles.roleButton} ${role === 'tutor' ? styles.roleButtonActive : ''}`}
                onClick={() => setRole('tutor')}
              >
                Tutor
              </button>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <a href="/login" className={styles.link}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
