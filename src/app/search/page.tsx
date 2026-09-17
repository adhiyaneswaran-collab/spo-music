'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import { SONGS, MOOD_PLAYLISTS, LANGUAGE_SECTIONS, formatDuration, formatPlays } from '@/lib/mockData';
import { SongRow } from '@/components/music/SongCard';
import type { Song } from '@/types';

interface YouTubeResult {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  thumbnailHigh: string;
  durationSec: number;
  viewCount: string;
}

function viewsLabel(v: string) {
  const n = parseInt(v, 10);
  if (isNaN(n)) return '';
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B views`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K views`;
  return `${n} views`;
}

export default function SearchPage() {
  const { state, dispatch, hydrated } = useApp();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'youtube' | 'local'>('youtube');
  const [ytResults, setYtResults] = useState<YouTubeResult[]>([]);
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Search YouTube via our secure backend API ────────────────────────────────
  const searchYouTube = useCallback(async (q: string) => {
    if (!q.trim()) { setYtResults([]); return; }
    setYtLoading(true);
    setYtError(null);

    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(q)}&maxResults=25`);
      const data = await res.json();

      if (!res.ok) {
        setYtError(data.error ?? 'Search failed');
        setYtResults([]);
        return;
      }
      setYtResults(data.videos ?? []);
    } catch (err: any) {
      setYtError('Network error. Check your connection.');
      setYtResults([]);
    } finally {
      setYtLoading(false);
    }
  }, []);

  // ── Debounced search ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setYtResults([]); setYtLoading(false); return; }
    debounceRef.current = setTimeout(() => {
      searchYouTube(query);
      if (!state.searchHistory.includes(query.trim())) {
        dispatch({ type: 'ADD_SEARCH_HISTORY', payload: query.trim() });
      }
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // ── Local song fallback search ────────────────────────────────────────────────
  const localResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SONGS.filter(s =>
      s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) ||
      s.language.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q)
    );
  }, [query]);

  // ── Helper to convert YouTube result to standard Song ──────────────────────
  const toSong = useCallback((r: YouTubeResult): Song => ({
    id: `yt-${r.videoId}`,
    title: r.title,
    artist: r.channel,
    album: 'YouTube',
    duration: r.durationSec,
    coverUrl: r.thumbnailHigh || r.thumbnail,
    audioUrl: '',
    language: 'English',
    genre: 'Film',
    mood: [],
    year: new Date().getFullYear(),
    plays: parseInt(r.viewCount ?? '0', 10),
    youtubeVideoId: r.videoId,
    source: 'youtube',
    viewCount: r.viewCount,
  }), []);

  // ── Play a YouTube result ─────────────────────────────────────────────────────
  const playYouTubeVideo = useCallback((result: YouTubeResult, queue: YouTubeResult[]) => {
    dispatch({
      type: 'PLAY_SONG',
      payload: { song: toSong(result), queue: queue.map(toSong) },
    });
  }, [dispatch, toSong]);

  return (
    <div className="search-page">
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>Search</h1>

      {/* ── Big search bar ── */}
      <div className="search-bar-large" style={{ marginBottom: 20 }}>
        <svg className="search-icon-large" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          id="search-input"
          type="search"
          className="search-input-large"
          placeholder="Search any song, artist, album on YouTube..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck="false"
          aria-label="Search music on YouTube"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setYtResults([]); }}
            style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}
            aria-label="Clear search"
          >✕</button>
        )}
      </div>

      {/* ── Recent searches — only shown after client hydration ── */}
      {hydrated && !query && state.searchHistory.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Recent Searches</div>
          <div className="recent-searches">
            {state.searchHistory.map((q, i) => (
              <button key={i} className="recent-chip" onClick={() => setQuery(q)} aria-label={`Search again: ${q}`}>🕐 {q}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter tabs (only when there's a query) ── */}
      {query && (
        <div className="library-tab-bar" style={{ marginBottom: 20 }}>
          <button className={`library-tab ${activeFilter === 'youtube' ? 'active' : ''}`} onClick={() => setActiveFilter('youtube')}>
            📺 YouTube {ytResults.length > 0 && <span style={{ marginLeft: 6, background: 'rgba(255,0,0,0.15)', color: '#FF6B6B', borderRadius: 10, padding: '1px 7px', fontSize: 11 }}>{ytResults.length}</span>}
          </button>
          <button className={`library-tab ${activeFilter === 'local' ? 'active' : ''}`} onClick={() => setActiveFilter('local')}>
            🎵 Library {localResults.length > 0 && <span style={{ marginLeft: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '1px 7px', fontSize: 11 }}>{localResults.length}</span>}
          </button>
        </div>
      )}

      {/* ── YouTube results ── */}
      {query && activeFilter === 'youtube' && (
        <div>
          {ytLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          )}

          {!ytLoading && ytError && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-danger)' }}>
              ⚠️ {ytError}
            </div>
          )}

          {!ytLoading && !ytError && ytResults.length === 0 && query && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No results for "{query}"</div>
              <div className="empty-subtitle">Try a different search term.</div>
            </div>
          )}

          {!ytLoading && ytResults.length > 0 && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: '#FF0000', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 800, color: '#fff' }}>YouTube</span>
                {ytResults.length} results for "{query}"
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {ytResults.map((result, i) => (
                  <YouTubeResultRow
                    key={result.videoId}
                    result={result}
                    index={i + 1}
                    isPlaying={state.player.currentSong?.youtubeVideoId === result.videoId && state.player.isPlaying}
                    isActive={state.player.currentSong?.youtubeVideoId === result.videoId}
                    isLiked={state.likedSongs.some(s => s.id === `yt-${result.videoId}`)}
                    onPlay={() => playYouTubeVideo(result, ytResults)}
                    onPlayPause={() => dispatch({ type: state.player.isPlaying ? 'PAUSE' : 'RESUME' })}
                    onLike={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'TOGGLE_LIKE', payload: toSong(result) });
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Local library results ── */}
      {query && activeFilter === 'local' && (
        <div>
          {localResults.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎵</div>
              <div className="empty-title">Nothing in library for "{query}"</div>
              <div className="empty-subtitle">Try the YouTube tab to search online.</div>
              <button className="empty-action" onClick={() => setActiveFilter('youtube')}>Search YouTube</button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{localResults.length} songs in your library</div>
              {localResults.map((song, i) => (
                <SongRow key={song.id} song={song} queue={localResults} index={i + 1} showIndex />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Browse categories when no query ── */}
      {!query && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Browse Categories</h2>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>By Mood</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
              {MOOD_PLAYLISTS.map(mood => (
                <div
                  key={mood.id}
                  className="mood-card"
                  style={{ background: `linear-gradient(135deg, ${mood.color} 0%, rgba(10,10,10,0.8) 100%)` }}
                  onClick={() => { setQuery(mood.name); setActiveFilter('youtube'); }}
                  role="button" tabIndex={0} aria-label={`Search ${mood.name} music`}
                  onKeyDown={e => e.key === 'Enter' && setQuery(mood.name)}
                >
                  <div className="mood-card-emoji">{mood.emoji}</div>
                  <div>
                    <div className="mood-card-name">{mood.name}</div>
                    <div className="mood-card-count">Search on YouTube</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>By Language</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {LANGUAGE_SECTIONS.map(({ language, emoji, color }) => (
                <div
                  key={language}
                  className="mood-card"
                  style={{ background: `linear-gradient(135deg, ${color} 0%, rgba(10,10,10,0.7) 120%)`, minHeight: 80 }}
                  onClick={() => { setQuery(`${language} songs`); setActiveFilter('youtube'); }}
                  role="button" tabIndex={0} aria-label={`Search ${language} music on YouTube`}
                  onKeyDown={e => e.key === 'Enter' && setQuery(`${language} songs`)}
                >
                  <div className="mood-card-emoji" style={{ fontSize: 24 }}>{emoji}</div>
                  <div className="mood-card-name">{language}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── YouTube Result Row ──────────────────────────────────────────────────────── */
function YouTubeResultRow({
  result, index, isPlaying, isActive, isLiked, onPlay, onPlayPause, onLike
}: {
  result: YouTubeResult;
  index: number;
  isPlaying: boolean;
  isActive: boolean;
  isLiked: boolean;
  onPlay: () => void;
  onPlayPause: () => void;
  onLike: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className={`song-row ${isActive ? 'playing' : ''}`}
      onClick={isActive ? onPlayPause : onPlay}
      role="button"
      tabIndex={0}
      aria-label={`${isPlaying ? 'Pause' : 'Play'} ${result.title}`}
      onKeyDown={e => e.key === 'Enter' && (isActive ? onPlayPause() : onPlay())}
      style={{ gap: 14, padding: '10px 12px' }}
    >
      {/* Index / playing indicator */}
      <span style={{ width: 28, textAlign: 'center', color: isActive ? 'var(--color-gold)' : 'var(--text-muted)', fontSize: 13, flexShrink: 0 }}>
        {isPlaying ? <WaveformMini /> : index}
      </span>

      {/* Thumbnail */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={result.thumbnail}
          alt={result.title}
          style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover', display: 'block' }}
          width={56} height={56}
        />
        {/* YouTube badge */}
        <div style={{ position: 'absolute', bottom: 3, right: 3, background: '#FF0000', borderRadius: 3, padding: '1px 4px', fontSize: 8, fontWeight: 800, color: '#fff', lineHeight: 1.4 }}>YT</div>
      </div>

      {/* Info */}
      <div className="song-row-info">
        <div className="song-row-title" style={{ color: isActive ? 'var(--color-gold)' : undefined }}>{result.title}</div>
        <div className="song-row-artist">
          {result.channel}
          {result.viewCount && (
            <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>· {viewsLabel(result.viewCount)}</span>
          )}
        </div>
      </div>

      {/* Duration */}
      <span className="song-row-duration">{result.durationSec > 0 ? formatDuration(result.durationSec) : '—'}</span>

      {/* Actions (Like + Play) */}
      <div className="song-row-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className={`icon-btn ${isLiked ? 'liked' : ''}`}
          onClick={onLike}
          aria-label={isLiked ? 'Unlike' : 'Like'}
          style={{ width: 36, height: 36 }}
        >
          <HeartIcon filled={isLiked} />
        </button>
        <button
          className="song-card-play-btn"
          style={{ width: 36, height: 36, flexShrink: 0, opacity: isActive ? 1 : undefined }}
          onClick={e => { e.stopPropagation(); isActive ? onPlayPause() : onPlay(); }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          }
        </button>
      </div>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function WaveformMini() {
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center', height: 14 }}>
      {[1, 2, 3].map(i => (
        <span key={i} style={{
          display: 'inline-block', width: 2.5, background: 'var(--color-gold)',
          borderRadius: 1, height: `${30 + i * 20}%`,
          animation: `waveform-bounce 1s ease-in-out ${i * 0.15}s infinite`,
        }} />
      ))}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', borderRadius: 12 }}>
      <div style={{ width: 28, height: 14, background: 'var(--color-surface-2)', borderRadius: 4, flexShrink: 0 }} />
      <div style={{ width: 56, height: 56, background: 'var(--color-surface-2)', borderRadius: 8, flexShrink: 0, animation: 'pulse 1.5s ease infinite' }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 14, background: 'var(--color-surface-2)', borderRadius: 4, marginBottom: 8, width: '70%', animation: 'pulse 1.5s ease 0.1s infinite' }} />
        <div style={{ height: 11, background: 'var(--color-surface-2)', borderRadius: 4, width: '40%', animation: 'pulse 1.5s ease 0.2s infinite' }} />
      </div>
      <div style={{ width: 40, height: 12, background: 'var(--color-surface-2)', borderRadius: 4, animation: 'pulse 1.5s ease 0.3s infinite' }} />
    </div>
  );
}
