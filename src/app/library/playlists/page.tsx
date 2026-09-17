'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useLibrary, useApp } from '@/lib/store';
import { SONGS } from '@/lib/mockData';
import { SongRow } from '@/components/music/SongCard';
import type { Playlist, Song } from '@/types';

export default function PlaylistsPage() {
  const { playlists, dispatch } = useLibrary();
  const { dispatch: appDispatch } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isAddingSongs, setIsAddingSongs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ytResults, setYtResults] = useState<any[]>([]);
  const [ytLoading, setYtLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchYouTube = useCallback(async (q: string) => {
    if (!q.trim()) { setYtResults([]); return; }
    setYtLoading(true);
    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(q)}&maxResults=10`);
      const data = await res.json();
      if (res.ok) setYtResults(data.videos ?? []);
      else setYtResults([]);
    } catch (err) {
      setYtResults([]);
    } finally {
      setYtLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) { setYtResults([]); setYtLoading(false); return; }
    debounceRef.current = setTimeout(() => {
      searchYouTube(searchQuery);
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery, searchYouTube]);

  const toSong = (r: any): Song => ({
    id: `yt-${r.videoId}`,
    title: r.title,
    artist: r.channel,
    album: 'YouTube',
    duration: r.durationSec || 0,
    coverUrl: r.thumbnailHigh || r.thumbnail,
    audioUrl: '',
    language: 'English',
    genre: 'Pop',
    mood: [],
    year: new Date().getFullYear(),
    plays: parseInt(r.viewCount ?? '0', 10),
    youtubeVideoId: r.videoId,
    source: 'youtube',
    viewCount: r.viewCount,
  });

  const handleCreate = () => {
    if (!name.trim()) return;
    dispatch({
      type: 'CREATE_PLAYLIST',
      payload: {
        name: name.trim(),
        description: '',
        coverUrl: SONGS[Math.floor(Math.random() * SONGS.length)].coverUrl,
        songs: [],
      },
    });
    setName('');
    setShowCreate(false);
  };

  if (selectedPlaylist) {
    const pl = playlists.find(p => p.id === selectedPlaylist.id) ?? selectedPlaylist;
    return (
      <div style={{ padding: 32 }}>
        <button onClick={() => setSelectedPlaylist(null)} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Back to Playlists
        </button>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 40 }}>
          <img src={pl.coverUrl} alt={pl.name} style={{ width: 160, height: 160, borderRadius: 'var(--radius-lg)', objectFit: 'cover' }} width={160} height={160} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Playlist</div>
            <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>{pl.name}</h1>
            <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>{pl.songs.length} songs</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {pl.songs.length > 0 && (
                <button className="btn-primary" onClick={() => appDispatch({ type: 'PLAY_SONG', payload: { song: pl.songs[0], queue: pl.songs } })}>▶ Play All</button>
              )}
            </div>
          </div>
        </div>

        {pl.songs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <div className="empty-title">This playlist is empty.</div>
            <div className="empty-subtitle">Search below to add some music.</div>
          </div>
        ) : (
          pl.songs.map((song, i) => (
            <SongRow key={song.id + i} song={song} queue={pl.songs} index={i + 1} showIndex />
          ))
        )}

        {/* Always Visible Search to Add Songs */}
        <div style={{ marginTop: 40, padding: 32, background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Find more songs</h3>
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <svg 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search for a song to add..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '16px 16px 16px 48px',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {ytLoading && searchQuery.trim().length > 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: 16 }}>Searching YouTube...</div>
            )}
            {!ytLoading && searchQuery.trim().length > 0 && ytResults.length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: 16 }}>No results found</div>
            )}
            
            {(searchQuery.trim().length > 0
              ? ytResults.map(toSong)
              : SONGS.slice(0, 5)
            ).map((song: Song) => (
              <div key={song.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img src={song.coverUrl} alt={song.title} style={{ width: 48, height: 48, borderRadius: '4px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{song.title}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{song.artist}</div>
                  </div>
                </div>
                <button 
                  style={{ 
                    fontSize: '12px', padding: '8px 16px', border: '1px solid rgba(255,255,255,0.3)', 
                    borderRadius: '99px', background: 'transparent', color: '#fff', cursor: 'pointer',
                    fontWeight: 700
                  }}
                  onClick={() => {
                    dispatch({ type: 'ADD_TO_PLAYLIST', payload: { playlistId: pl.id, song } });
                    setSearchQuery('');
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                >
                  Add to playlist
                </button>
              </div>
            ))}
          </div>
        </div>

        {pl.songs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <div className="empty-title">This playlist is empty.</div>
            <div className="empty-subtitle">Click "Add Songs" above to find some music.</div>
          </div>
        ) : (
          pl.songs.map((song, i) => (
            <SongRow key={song.id + i} song={song} queue={pl.songs} index={i + 1} showIndex />
          ))
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <Link href="/library" style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>← Back to Library</Link>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Playlists</h1>
        <button className="btn-primary" onClick={() => setShowCreate(true)} id="playlists-create-btn">+ New Playlist</button>
      </div>

      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => e.target === e.currentTarget && setShowCreate(false)} role="dialog" aria-modal="true">
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: 32, width: '100%', maxWidth: 400, border: '1px solid var(--color-border-2)' }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Create Playlist</h2>
            <input type="text" className="search-input" style={{ width: '100%', marginBottom: 16, borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 16 }}
              placeholder="My Playlist..." value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} autoFocus />
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleCreate}>Create</button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {playlists.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎼</div>
          <div className="empty-title">Create your first vibe.</div>
          <div className="empty-subtitle">Organize your music into playlists.</div>
          <button className="empty-action" onClick={() => setShowCreate(true)}>Create Playlist</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {playlists.map(pl => (
            <div key={pl.id} className="playlist-card" onClick={() => setSelectedPlaylist(pl)} role="button" tabIndex={0} aria-label={pl.name} onKeyDown={e => e.key === 'Enter' && setSelectedPlaylist(pl)}>
              <img src={pl.coverUrl} alt={pl.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 12 }} width={180} height={180} />
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 12 }}>{pl.songs.length} songs</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" style={{ flex: 1, padding: '8px 12px', fontSize: 12 }}
                  onClick={e => { e.stopPropagation(); if (pl.songs.length > 0) appDispatch({ type: 'PLAY_SONG', payload: { song: pl.songs[0], queue: pl.songs } }); }}>▶ Play</button>
                <button className="btn-ghost" style={{ padding: '8px 12px', fontSize: 12 }}
                  onClick={e => { e.stopPropagation(); dispatch({ type: 'DELETE_PLAYLIST', payload: pl.id }); }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
