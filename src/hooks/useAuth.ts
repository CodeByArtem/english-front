'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  [key: string]: unknown;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore parsing error
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data);
      setError(null);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      return res.data as AuthUser;
    } catch {
      setError('Failed to fetch auth profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    api
      .get('/auth/profile')
      .then((res) => {
        if (!isMounted) return;
        setUser(res.data);
        setError(null);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Failed to fetch auth profile');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const role = user?.role?.toUpperCase();
  const isTutor = role === 'TUTOR' || role === 'TEACHER' || role === 'ADMIN';
  const isStudent = role === 'STUDENT';

  return {
    user,
    role,
    isTutor,
    isStudent,
    loading,
    error,
    setUser,
    refreshProfile,
  };
}
