'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const name = useUserStore((state) => state.name);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!name && pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [name, pathname, mounted, router]);

  // Don't render until Zustand is hydrated on client
  if (!mounted) return null;

  return <>{children}</>;
}
