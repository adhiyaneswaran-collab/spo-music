'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { SONGS, MOOD_PLAYLISTS, LANGUAGE_SECTIONS, getTrendingSongs, getNewReleases } from '@/lib/mockData';

const DISCOVERY_SECTIONS = [
  { id: 'daily', label: 'Daily Mix', emoji: '☀️', color: '#5C3A1E', songs: SONGS.filter((_, i) => i % 2 === 0).slice(0, 8) },
  { id: 'trending', label: 'Trending', emoji: '🔥', color: '#5C1A1A', songs: getTrendingSongs() },
  { id: 'new', label: 'New Music', emoji: '✨', color: '#1A3A5C', songs: getNewReleases() },
];

export default function DiscoveryPage() {
  const { dispatch } = useApp();

  const play = (songs: import('@/types').Song[]) => {
    if (songs.length > 0) dispatch({ type: 'PLAY_SONG', payload: { song: songs[0], queue: songs } });
  };

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Discovery</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 36 }}>Explore new sounds and fresh picks.</p>

      {/* Featured discovery cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 48 }}>
        {DISCOVERY_SECTIONS.map(s => (
          <div
            key={s.id}
            style={{
              background: `linear-gradient(135deg, ${s.color} 0%, rgba(10,10,10,0.9) 100%)`,
              borderRadius: 'var(--radius-xl)', padding: 28, cursor: 'pointer',
              transition: 'all var(--transition-spring)', minHeight: 160,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            onClick={() => play(s.songs)}
            role="button" tabIndex={0}
            aria-label={`Play ${s.label}`}
            onKeyDown={e => e.key === 'Enter' && play(s.songs)}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
          >
            <div style={{ fontSize: 40 }}>{s.emoji}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.songs.length} songs</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mood Playlists */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>By Mood</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 48 }}>
        {MOOD_PLAYLISTS.map(mood => (
          <div
            key={mood.id}
            className="mood-card"
            style={{ background: `linear-gradient(135deg, ${mood.color} 0%, rgba(10,10,10,0.8) 100%)` }}
            onClick={() => play(mood.songs)}
            role="button" tabIndex={0} aria-label={`Play ${mood.name}`}
            onKeyDown={e => e.key === 'Enter' && play(mood.songs)}
          >
            <div className="mood-card-emoji">{mood.emoji}</div>
            <div>
              <div className="mood-card-name">{mood.name}</div>
              <div className="mood-card-count">{mood.songs.length} songs</div>
            </div>
          </div>
        ))}
      </div>

      {/* Language Sections */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>By Language</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
        {LANGUAGE_SECTIONS.map(({ language, emoji, color }) => {
          const songs = SONGS.filter(s => s.language === language);
          return (
            <div
              key={language}
              className="mood-card"
              style={{ background: `linear-gradient(135deg, ${color} 0%, rgba(10,10,10,0.7) 120%)`, minHeight: 100 }}
              onClick={() => play(songs)}
              role="button" tabIndex={0} aria-label={`Play ${language} music`}
              onKeyDown={e => e.key === 'Enter' && play(songs)}
            >
              <div className="mood-card-emoji">{emoji}</div>
              <div>
                <div className="mood-card-name">{language}</div>
                <div className="mood-card-count">{songs.length} songs</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
