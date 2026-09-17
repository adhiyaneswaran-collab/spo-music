'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { SONGS } from '@/lib/mockData';
import { getTopLanguages, getTopGenres, getVibeLabel } from '@/lib/recommendations';
import { SongRow } from '@/components/music/SongCard';

function StatBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--color-surface-3)', borderRadius: 999 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gradient-brand)', borderRadius: 999, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { state, dispatch } = useApp();
  const { preferences, likedSongs, recentlyPlayed, playlists } = state;

  const topLangs = getTopLanguages(preferences);
  const topGenres = getTopGenres(preferences);
  const vibeLabel = getVibeLabel(preferences);
  const totalPlays = preferences.totalPlays;

  const langEntries = Object.entries(preferences.languages) as [string, number][];
  const maxLangScore = Math.max(1, ...langEntries.map(([, v]) => v));

  const genreEntries = Object.entries(preferences.genres) as [string, number][];
  const maxGenreScore = Math.max(1, ...genreEntries.map(([, v]) => v));

  const artistEntries = Object.entries(preferences.artists) as [string, number][];
  const topArtists = artistEntries.sort((a, b) => b[1] - a[1]).slice(0, 5);

  const initial = 'S';

  return (
    <div>
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">{initial}</div>
        <div>
          <h1 className="profile-name">Spovibe Listener</h1>
          <div className="profile-subtitle">Member since {new Date().getFullYear()}</div>
          <div className="vibe-badge">
            <span>✨</span>
            <span>{vibeLabel}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalPlays}</div>
          <div className="stat-label">Songs Played</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{likedSongs.length}</div>
          <div className="stat-label">Liked Songs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{playlists.length}</div>
          <div className="stat-label">Playlists</div>
        </div>
      </div>

      <div style={{ padding: '0 32px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Language breakdown */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: 28, border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Your Languages</h2>
          {langEntries.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Play songs to see your language breakdown.</div>
          ) : (
            langEntries.sort((a, b) => b[1] - a[1]).map(([lang, score]) => (
              <StatBar key={lang} label={lang} value={score} max={maxLangScore} />
            ))
          )}
          {topLangs.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {topLangs.map(l => <span key={l} className="badge badge-gold">{l}</span>)}
            </div>
          )}
        </div>

        {/* Genre breakdown */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: 28, border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Your Genres</h2>
          {genreEntries.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Play songs to see your genre breakdown.</div>
          ) : (
            genreEntries.sort((a, b) => b[1] - a[1]).map(([genre, score]) => (
              <StatBar key={genre} label={genre} value={score} max={maxGenreScore} />
            ))
          )}
          {topGenres.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {topGenres.map(g => <span key={g} className="badge badge-gold">{g}</span>)}
            </div>
          )}
        </div>

        {/* Top Artists */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: 28, border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Top Artists</h2>
          {topArtists.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Play songs to see your top artists.</div>
          ) : (
            topArtists.map(([artist, score], i) => (
              <div key={artist} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: 16, width: 24 }}>#{i + 1}</span>
                <img
                  src={`https://picsum.photos/seed/${110 + i * 10}/48/48`}
                  alt={artist}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                  width={44}
                  height={44}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{artist}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{Math.round(score)} plays</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Your Vibe visualization */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: 28, border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Your Vibe</h2>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Based on {totalPlays} plays</div>

          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              background: 'var(--gradient-brand)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 48, marginBottom: 16,
              boxShadow: 'var(--shadow-gold)',
              animation: totalPlays > 0 ? 'pulseLogo 3s ease infinite' : 'none',
            }}>
              {totalPlays === 0 ? '🎵' : topLangs[0] === 'Tamil' ? '🎼' : topLangs[0] === 'Hindi' ? '🎤' : topLangs[0] === 'Punjabi' ? '🥁' : '🎸'}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-gold)', marginBottom: 8 }}>
              {vibeLabel}
            </div>
            {topLangs.length > 0 && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Loves {topLangs.join(', ')} music
              </div>
            )}
            {totalPlays === 0 && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
                Start playing to unlock your vibe
              </div>
            )}
          </div>

          {/* Mood breakdown pills */}
          {Object.entries(preferences.moods).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              {(Object.entries(preferences.moods) as [string, number][])
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([mood]) => (
                  <span key={mood} className="badge badge-gold">{mood}</span>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Recently liked */}
      {likedSongs.length > 0 && (
        <div style={{ padding: '0 32px 48px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Recently Liked</h2>
          {likedSongs.slice(0, 5).map((song, i) => (
            <SongRow key={song.id} song={song} queue={likedSongs} index={i + 1} showIndex />
          ))}
        </div>
      )}
    </div>
  );
}
