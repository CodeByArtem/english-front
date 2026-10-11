'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GradingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/teacher/dashboard');
  }, [router]);

  return null;
}
