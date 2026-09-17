'use client';

import React from 'react';
import Link from 'next/link';
import { useLibrary, useApp } from '@/lib/store';
import { SongRow } from '@/components/music/SongCard';

function groupByDay(entries: { song: import('@/types').Song; timestamp: number }[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: Record<string, typeof entries> = {};
  entries.forEach(e => {
    const d = new Date(e.timestamp);
    d.setHours(0, 0, 0, 0);
    let label: string;
    if (d.getTime() === today.getTime()) label = 'Today';
    else if (d.getTime() === yesterday.getTime()) label = 'Yesterday';
    else label = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    if (!groups[label]) groups[label] = [];
    groups[label].push(e);
  });
  return groups;
}

export default function RecentPage() {
  const { recentlyPlayed } = useLibrary();
  const { dispatch } = useApp();

  const grouped = groupByDay(recentlyPlayed);
  const allSongs = recentlyPlayed.map(e => e.song);

  return (
    <div style={{ padding: 32 }}>
      <Link href="/library" style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
        ← Back to Library
      </Link>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Recently Played</h1>

      {recentlyPlayed.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎵</div>
          <div className="empty-title">Start listening and we'll build your vibe.</div>
          <div className="empty-subtitle">Your listening history will appear here once you start playing songs.</div>
          <button className="empty-action" onClick={() => (window.location.href = '/')}>
            Discover Music
          </button>
        </div>
      ) : (
        Object.entries(grouped).map(([label, entries]) => (
          <div key={label} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.05em' }}>
              {label}
            </h2>
            {entries.map((entry, i) => (
              <SongRow
                key={`${entry.song.id}-${i}`}
                song={entry.song}
                queue={allSongs}
                index={i + 1}
                showIndex
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
