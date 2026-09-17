'use client';

import React, { useEffect, useState } from 'react';
import { AppProvider } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { MusicPlayer } from '@/components/player/MusicPlayer';
import { SpovibeLogo } from '@/components/ui/SpovibeLogo';

function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  if (done || !mounted) return null;

  return (
    <div className="loading-screen" aria-label="Loading SPOVIBE" role="status">
      <div className="loading-logo">
        <SpovibeLogo size="lg" />
      </div>
      <div className="loading-bar">
        <div className="loading-fill" />
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
        TUNING YOUR VIBE...
      </p>
    </div>
  );
}

import { usePathname } from 'next/navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthOrSplash = pathname === '/login' || pathname === '/splash';

  if (isAuthOrSplash) {
    return (
      <AppProvider>
        {children}
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <LoadingScreen />
      <div className="app-shell">
        <Sidebar />
        <main className="main-content" id="main-content" tabIndex={-1}>
          {children}
          <RefreshButton />
        </main>
        <MusicPlayer />
        <MobileNav />
      </div>
    </AppProvider>
  );
}

function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Refresh after a short delay so the animation can be seen
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <>
      {/* The top-right refresh button */}
      <button
        onClick={handleRefresh}
        aria-label="Refresh page"
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 50,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.27l5.58 2.7" />
        </svg>
      </button>

      {/* The full-screen center rotating overlay */}
      {isRefreshing && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease-out forwards',
        }}>
          {/* Centered rotating music disc/symbol */}
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '3px solid rgba(201,168,76, 0.2)',
            borderTopColor: '#C9A84C',
            borderRightColor: '#C9A84C',
            animation: 'spin 1s linear infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#C9A84C',
            }} />
          </div>
          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          `}</style>
        </div>
      )}
    </>
  );
}
