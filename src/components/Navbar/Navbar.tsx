'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api, { setLoggingOut } from '@/lib/api';
import styles from './Navbar.module.scss';

export interface NavbarUser {
  id?: string;
  email: string;
  name?: string;
  role: string;
}

export interface NavbarProps {
  user?: NavbarUser | null;
  onLogout?: () => void;
  showBackToDashboard?: boolean;
}

function getInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return 'U';
}

export default function Navbar({
  user,
  onLogout,
  showBackToDashboard = false,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Официальный паттерн React 19 для сброса состояния при смене маршрута без каскадных ререндеров
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }

  const isTeacher =
    user?.role?.toLowerCase() === 'teacher' ||
    user?.role?.toLowerCase() === 'tutor' ||
    user?.role?.toLowerCase() === 'admin';

  // Закрываем мобильное меню при клике вне или по нажатию клавиши Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleDefaultLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }

    setLoggingOut(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      router.push('/');
    }
  };

  const initials = getInitials(user?.name, user?.email);
  const homeHref = user ? '/dashboard' : '/';

  return (
    <header className={styles.header} ref={menuRef}>
      <div className={styles.container}>
        {/* Логотип */}
        <Link href={homeHref} className={styles.logo} aria-label="English Learning Homepage">
          <span className={styles.logoBadge} aria-hidden="true">EN</span>
          <span className={styles.logoText}>English Learning</span>
        </Link>

        {/* Десктопная навигация */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          {user ? (
            <>
              {showBackToDashboard && (
                <Link
                  href="/dashboard"
                  className={`${styles.navLink} ${pathname === '/dashboard' ? styles.navLinkActive : ''}`}
                >
                  Dashboard
                </Link>
              )}

              {isTeacher && (
                <Link
                  href="/teacher/dashboard"
                  className={`${styles.navLink} ${pathname.startsWith('/teacher') ? styles.navLinkActive : ''}`}
                >
                  <span className={styles.teacherBadge} aria-hidden="true">👨‍🏫</span>
                  Teacher Panel
                </Link>
              )}

              <div className={styles.userProfile}>
                <div className={styles.avatar} aria-hidden="true">
                  {initials}
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.userName}>{user.name || user.email.split('@')[0]}</span>
                  <span className={styles.userRole} data-role={user.role.toLowerCase()}>
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDefaultLogout}
                className={styles.logoutBtn}
                title="Sign Out"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginBtn}>
                Sign In
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Кнопка мобильного меню (Гамбургер на Framer Motion) */}
        <button
          type="button"
          className={styles.hamburgerBtn}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <motion.span
            className={styles.hamburgerLine}
            animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className={styles.hamburgerLine}
            animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className={styles.hamburgerLine}
            animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* Мобильная выпадающая шторка меню */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={styles.mobileDrawer}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
          >
            <div className={styles.mobileDrawerContent}>
              {user ? (
                <>
                  <div className={styles.mobileProfile}>
                    <div className={styles.avatarLarge} aria-hidden="true">
                      {initials}
                    </div>
                    <div className={styles.mobileProfileText}>
                      <span className={styles.mobileUserName}>{user.name || user.email}</span>
                      <span className={styles.userRole} data-role={user.role.toLowerCase()}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <nav className={styles.mobileNavLinks} aria-label="Mobile Navigation Links">
                    <Link
                      href="/dashboard"
                      className={`${styles.mobileNavLink} ${pathname === '/dashboard' ? styles.mobileNavLinkActive : ''}`}
                    >
                      <span className={styles.mobileNavIcon} aria-hidden="true">🏠</span>
                      Dashboard
                    </Link>

                    {isTeacher && (
                      <Link
                        href="/teacher/dashboard"
                        className={`${styles.mobileNavLink} ${pathname.startsWith('/teacher') ? styles.mobileNavLinkActive : ''}`}
                      >
                        <span className={styles.mobileNavIcon} aria-hidden="true">👨‍🏫</span>
                        Teacher Panel
                      </Link>
                    )}
                  </nav>

                  <div className={styles.mobileDrawerFooter}>
                    <button
                      type="button"
                      onClick={handleDefaultLogout}
                      className={styles.mobileLogoutBtn}
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.mobileAuthButtons}>
                  <Link href="/login" className={styles.mobileLoginBtn}>
                    Sign In
                  </Link>
                  <Link href="/register" className={styles.mobileRegisterBtn}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
