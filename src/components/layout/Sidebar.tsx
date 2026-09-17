'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SpovibeLogo } from '@/components/ui/SpovibeLogo';
import { useLibrary } from '@/lib/store';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/search', label: 'Search', icon: SearchIcon },
  { href: '/library', label: 'Library', icon: LibraryIcon },
  { href: '/discovery', label: 'Discovery', icon: CompassIcon },
  { href: '/profile', label: 'Profile', icon: UserIcon },
];

const LIBRARY_ITEMS = [
  { href: '/library/liked', label: 'Liked Songs', icon: HeartIcon },
  { href: '/library/recent', label: 'Recently Played', icon: ClockIcon },
  { href: '/library/playlists', label: 'Playlists', icon: PlaylistIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { playlists } = useLibrary();

  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebar-logo" style={{ marginBottom: '32px' }}>
        <Link href="/" aria-label="SPOVIBE Home" style={{ textDecoration: 'none' }}>
          {/* 3D Premium UI Element replacing the logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div 
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, rgba(201,168,76,0.4) 0%, rgba(201,168,76,0.1) 100%)',
                borderRadius: '16px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(201,168,76,0.2), inset 0 2px 4px rgba(255,255,255,0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                transformStyle: 'preserve-3d',
                transform: 'perspective(500px) rotateY(15deg) rotateX(10deg)',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'perspective(500px) rotateY(0deg) rotateX(0deg) scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'perspective(500px) rotateY(15deg) rotateX(10deg)'}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--color-gold)',
                boxShadow: '0 0 20px var(--color-gold)',
                animation: 'pulse 2s infinite'
              }} />
            </div>
            <span style={{
              fontFamily: "'Circular', 'Outfit', sans-serif",
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              color: '#ffffff',
              lineHeight: 1,
              background: 'linear-gradient(90deg, #fff, var(--color-gold))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              SPOVIBE
            </span>
          </div>
        </Link>
      </div>

      <div className="sidebar-nav">
        <div className="nav-section-label">Menu</div>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`nav-item ${pathname === href ? 'active' : ''}`}
            aria-current={pathname === href ? 'page' : undefined}
          >
            <Icon className="nav-icon" />
            {label}
          </Link>
        ))}

        <div className="nav-section-label" style={{ marginTop: 16 }}>Your Library</div>
        {LIBRARY_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`nav-item ${pathname === href ? 'active' : ''}`}
          >
            <Icon className="nav-icon" />
            {label}
          </Link>
        ))}

        {playlists.length > 0 && (
          <>
            <div className="nav-section-label" style={{ marginTop: 16 }}>Playlists</div>
            {playlists.slice(0, 5).map(p => (
              <Link key={p.id} href={`/library/playlists`} className="nav-item">
                <PlaylistIcon className="nav-icon" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.name}
                </span>
              </Link>
            ))}
          </>
        )}
      </div>
    </nav>
  );
}

// Icons
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

function LibraryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 10 12a2.5 2.5 0 0 1 2.5-2.5c.57 0 1.08.19 1.5.5V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z"/>
    </svg>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function PlaylistIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  );
}
