'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './register.module.scss';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: { email: string; password: string; inviteCode?: string } = {
        email,
        password,
      };
      if (inviteCode.trim()) {
        payload.inviteCode = inviteCode.trim();
      }

      await api.post('/auth/register', payload);
      router.push('/login');
    } catch (err) {
      const errorResponse =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string }; status?: number } }).response
          : undefined;
      const serverMsg = errorResponse?.data?.message;
      if (
        (typeof serverMsg === 'string' && serverMsg.toLowerCase().includes('already exists')) ||
        errorResponse?.status === 401
      ) {
        setError('A user with this email already exists.');
      } else if (
        typeof serverMsg === 'string' &&
        serverMsg.toLowerCase().includes('invite')
      ) {
        setError('Invalid or expired invite code.');
      } else {
        setError(serverMsg || 'Registration failed. Please try again.');
      }
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
            <label htmlFor="inviteCode" className={styles.label}>
              Teacher Invite Code (Optional)
            </label>
            <input
              id="inviteCode"
              type="text"
              className={styles.input}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter invite code if you are a tutor"
            />
            <span className={styles.hint}>Leave blank if you are a student.</span>
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
