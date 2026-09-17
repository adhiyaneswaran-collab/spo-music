'use client';

import React from 'react';
import Link from 'next/link';
import { useLibrary, useApp } from '@/lib/store';
import { SongRow } from '@/components/music/SongCard';

export default function LikedPage() {
  const { likedSongs } = useLibrary();
  const { dispatch } = useApp();

  return (
    <div style={{ padding: 32 }}>
      <Link href="/library" style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
        ← Back to Library
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
        <div style={{
          width: 180, height: 180, borderRadius: 'var(--radius-xl)', flexShrink: 0,
          background: 'linear-gradient(135deg, #5C2A14 0%, #C9A84C 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72,
          boxShadow: 'var(--shadow-gold)',
        }}>
          ❤️
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Playlist</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 8 }}>Liked Songs</h1>
          <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
            {likedSongs.length} songs
          </div>
          {likedSongs.length > 0 && (
            <button
              className="btn-primary"
              onClick={() => {
                const shuffled = [...likedSongs].sort(() => Math.random() - 0.5);
                dispatch({ type: 'PLAY_SONG', payload: { song: shuffled[0], queue: shuffled } });
              }}
            >
              ▶ Play All
            </button>
          )}
        </div>
      </div>

      {likedSongs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💛</div>
          <div className="empty-title">Your favorites are waiting.</div>
          <div className="empty-subtitle">Hit the heart icon on any song to save it here.</div>
        </div>
      ) : (
        <div>
          {likedSongs.map((song, i) => (
            <SongRow key={song.id} song={song} queue={likedSongs} index={i + 1} showIndex />
          ))}
        </div>
      )}
    </div>
  );
}
