'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLibrary, useApp } from '@/lib/store';
import { SONGS } from '@/lib/mockData';
import { SongRow } from '@/components/music/SongCard';
import type { Playlist } from '@/types';

type Tab = 'liked' | 'recent' | 'playlists' | 'albums' | 'artists';

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('liked');
  const { likedSongs, recentlyPlayed, playlists, dispatch } = useLibrary();
  const { dispatch: appDispatch } = useApp();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    dispatch({
      type: 'CREATE_PLAYLIST',
      payload: {
        name: newPlaylistName.trim(),
        description: '',
        coverUrl: SONGS[Math.floor(Math.random() * SONGS.length)].coverUrl,
        songs: [],
      },
    });
    setNewPlaylistName('');
    setShowCreatePlaylist(false);
    setActiveTab('playlists');
  };

  return (
    <div className="library-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Your Library</h1>
        <button
          className="btn-primary"
          onClick={() => setShowCreatePlaylist(true)}
          id="create-playlist-btn"
        >
          + New Playlist
        </button>
      </div>

      {/* Create playlist modal */}
      {showCreatePlaylist && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 500,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={(e) => e.target === e.currentTarget && setShowCreatePlaylist(false)}
          role="dialog"
          aria-label="Create playlist"
          aria-modal="true"
        >
          <div style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
            padding: 32, width: '100%', maxWidth: 400,
            border: '1px solid var(--color-border-2)', boxShadow: 'var(--shadow-lg)',
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Create Playlist</h2>
            <input
              id="playlist-name-input"
              type="text"
              className="search-input"
              style={{ width: '100%', marginBottom: 16, borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 16 }}
              placeholder="Playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleCreatePlaylist}>
                Create
              </button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowCreatePlaylist(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="library-tab-bar">
        {[
          { id: 'liked', label: '❤️ Liked Songs', count: likedSongs.length },
          { id: 'recent', label: '🕐 Recently Played', count: recentlyPlayed.length },
          { id: 'playlists', label: '🎵 Playlists', count: playlists.length },
          { id: 'albums', label: '💿 Albums', count: 4 },
          { id: 'artists', label: '🎤 Artists', count: 8 },
        ].map(tab => (
          <button
            key={tab.id}
            className={`library-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as Tab)}
            id={`library-tab-${tab.id}`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                marginLeft: 6, background: 'rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '1px 6px', fontSize: 11,
              }}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Liked Songs */}
      {activeTab === 'liked' && (
        <div>
          {likedSongs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💛</div>
              <div className="empty-title">Your favorites are waiting.</div>
              <div className="empty-subtitle">Hit the heart icon on any song to save it here.</div>
              <button
                className="empty-action"
                onClick={() => window.location.href = '/'}
              >
                Discover Music
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{
                  width: 120, height: 120, borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, var(--color-coffee), var(--color-gold))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 48, flexShrink: 0,
                }}>
                  ❤️
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Playlist</div>
                  <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>Liked Songs</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{likedSongs.length} songs</div>
                  <button
                    className="btn-primary"
                    style={{ marginTop: 12 }}
                    onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      const shuffled = [...likedSongs].sort(() => Math.random() - 0.5);
                      appDispatch({ type: 'PLAY_SONG', payload: { song: shuffled[0], queue: shuffled } });
                    }}
                    id="liked-play-all-btn"
                  >
                    ▶ Play All
                  </button>
                </div>
              </div>
              <div>
                {likedSongs.map((song, i) => (
                  <SongRow key={song.id} song={song} queue={likedSongs} index={i + 1} showIndex />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recently Played */}
      {activeTab === 'recent' && (
        <div>
          {recentlyPlayed.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎵</div>
              <div className="empty-title">Start listening and we'll build your vibe.</div>
              <div className="empty-subtitle">Your listening history will appear here.</div>
              <button className="empty-action" onClick={() => window.location.href = '/'}>
                Start Listening
              </button>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Today</h2>
              {recentlyPlayed.slice(0, 20).map((entry, i) => (
                <SongRow
                  key={`${entry.song.id}-${i}`}
                  song={entry.song}
                  queue={recentlyPlayed.map(e => e.song)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Playlists */}
      {activeTab === 'playlists' && (
        <div>
          {playlists.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎼</div>
              <div className="empty-title">Create your first vibe.</div>
              <div className="empty-subtitle">Organize your music into playlists.</div>
              <button className="empty-action" onClick={() => setShowCreatePlaylist(true)}>
                Create Playlist
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {playlists.map(playlist => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onPlay={() => {
                    if (playlist.songs.length > 0) {
                      appDispatch({ type: 'PLAY_SONG', payload: { song: playlist.songs[0], queue: playlist.songs } });
                    }
                  }}
                  onDelete={() => dispatch({ type: 'DELETE_PLAYLIST', payload: playlist.id })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Albums */}
      {activeTab === 'albums' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { title: 'Neon Drift', artist: 'Luna Waves', cover: 'https://picsum.photos/seed/200/300/300', songs: 8 },
              { title: 'Pyaar Ka Safar', artist: 'Arijit Groove', cover: 'https://picsum.photos/seed/201/300/300', songs: 12 },
              { title: 'Idhayam', artist: 'Anirudh Nova', cover: 'https://picsum.photos/seed/202/300/300', songs: 10 },
              { title: 'Beats & Vibes', artist: 'Badshah Wave', cover: 'https://picsum.photos/seed/203/300/300', songs: 9 },
            ].map(album => (
              <div key={album.title} className="playlist-card">
                <img src={album.cover} alt={album.title} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 12 }} width={180} height={180} />
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{album.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{album.artist} · {album.songs} songs</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Artists */}
      {activeTab === 'artists' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 20 }}>
          {[
            'https://picsum.photos/seed/110/300/300', 'https://picsum.photos/seed/120/300/300',
            'https://picsum.photos/seed/130/300/300', 'https://picsum.photos/seed/140/300/300',
            'https://picsum.photos/seed/150/300/300', 'https://picsum.photos/seed/160/300/300',
            'https://picsum.photos/seed/170/300/300', 'https://picsum.photos/seed/180/300/300',
          ].map((url, i) => {
            const artists = ['Luna Waves', 'A.R. Vibe', 'Arijit Groove', 'AP Dhillon Echo', 'Anirudh Nova', 'Badshah Wave', 'Vineeth Vibes', 'DSP Remix'];
            return (
              <div key={i} className="artist-card">
                <img src={url} alt={artists[i]} className="artist-avatar" width={140} height={140} />
                <div className="artist-name">{artists[i]}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PlaylistCard({ playlist, onPlay, onDelete }: { playlist: Playlist; onPlay: () => void; onDelete: () => void }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="playlist-card" style={{ position: 'relative' }}>
      {playlist.coverUrl ? (
        <img
          src={playlist.coverUrl}
          alt={playlist.name}
          style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 12 }}
          width={180}
          height={180}
        />
      ) : (
        <div className="playlist-cover">🎵</div>
      )}
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {playlist.name}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 12 }}>
        {playlist.songs.length} songs
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn-primary"
          style={{ flex: 1, padding: '8px 12px', fontSize: 12 }}
          onClick={onPlay}
          aria-label={`Play ${playlist.name}`}
        >
          ▶ Play
        </button>
        <button
          className="btn-ghost"
          style={{ padding: '8px 12px', fontSize: 12 }}
          onClick={onDelete}
          aria-label={`Delete ${playlist.name}`}
        >
          🗑
        </button>
      </div>
    </div>
  );
}
