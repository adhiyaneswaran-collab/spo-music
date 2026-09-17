'use client';

import React, { useMemo } from 'react';
import { SectionRow } from '@/components/home/SectionRow';
import { SongCard } from '@/components/music/SongCard';
import PullToRefresh from '@/components/ui/PullToRefresh';
import { useApp } from '@/lib/store';
import { useUserStore } from '@/store/userStore';
import {
  SONGS, ARTISTS, MOOD_PLAYLISTS, LANGUAGE_SECTIONS,
  getTrendingSongs, getNewReleases, getSongsByLanguage, formatPlays
} from '@/lib/mockData';
import { computeRecommendations, getTopLanguages } from '@/lib/recommendations';
import type { Song } from '@/types';

export default function HomePage() {
  const { state, dispatch, hydrated } = useApp();
  const { name } = useUserStore();
  const { preferences, likedSongs, recentlyPlayed, playlists } = state;

  // Fetch LocalStorage preferences removed; relying strictly on useApp state.

  const recentSongs = hydrated ? recentlyPlayed.map(e => e.song) : [];
  const hasPlayed = recentSongs.length > 0;

  // Generate recommendation list
  const forYou = useMemo(() => {
    if (!hasPlayed) return []; // Don't guess if they haven't played anything
    return computeRecommendations(preferences, likedSongs, recentSongs, SONGS, 12);
  }, [preferences, likedSongs, recentSongs, hasPlayed]);

  const topLangs = getTopLanguages(preferences);
  const trending = getTrendingSongs();
  
  // Find top artist from preferences directly
  let topArtist: string | null = null;
  let maxArtistCount = 0;
  for (const [artist, count] of Object.entries(preferences.artists)) {
    if (count > maxArtistCount) {
      maxArtistCount = count;
      topArtist = artist;
    }
  }

  // Enforce 50 song threshold for personalization
  const hasPlayed50 = recentSongs.length >= 50;

  // Primary language section strictly based on history (only if 50+ songs played)
  const primaryLangSongs = hasPlayed50 && topLangs.length > 0
    ? getSongsByLanguage(topLangs[0]).slice(0, 10)
    : [];

  // Personalized Artist Section (only if 50+ songs played)
  const artistSongs = hasPlayed50 && topArtist 
    ? SONGS.filter(s => s.artist.includes(topArtist!)).slice(0, 10)
    : [];

  const handleRefresh = async () => {
    // We simulate a network refresh here, fetching data from Firestore could happen here
    await new Promise(resolve => setTimeout(resolve, 1500));
    window.location.reload();
  };

  return (
      <div className="homepage-container" style={{ paddingBottom: 48 }}>
        {/* User Greeting Header & Search */}
        <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          {name && (
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              HELLO ! <span style={{ color: 'var(--color-gold)' }}>{name}</span>
            </h2>
          )}
          
          <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
            <svg 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              type="text" 
              placeholder="What do you want to listen to?"
              onClick={() => window.location.href = '/search'}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 16px 12px 48px',
                borderRadius: '99px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.borderColor = 'var(--color-gold)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.05)';
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            />
          </div>
        </div>

        {/* Hero Banner (Dribbble Spotify Style) */}
        <section 
          className="dribbble-hero" 
          aria-label="Hero"
          style={{
            position: 'relative',
            width: 'calc(100% - 48px)',
            height: '360px',
            margin: '24px 24px 48px',
            borderRadius: '32px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Background image & gradient overlay */}
          <div 
            style={{ 
              position: 'absolute', inset: 0,
              backgroundImage: `url(${likedSongs.length > 0 ? likedSongs[0].coverUrl : (hasPlayed50 && primaryLangSongs[0] ? primaryLangSongs[0].coverUrl : 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?auto=format&fit=crop&w=1200&q=80')})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'blur(20px) brightness(0.6)',
              transform: 'scale(1.1)', // prevent blurred edges
            }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)' }} />
          
          <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px', zIndex: 10 }}>
            <span style={{ 
              display: 'inline-block', padding: '4px 12px', marginBottom: '16px', borderRadius: '99px',
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)',
              fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fff', width: 'fit-content'
            }}>
              {likedSongs.length > 0 ? 'Your Favorites' : (hasPlayed50 && topLangs.length > 0 ? `Your Top Language: ${topLangs[0]}` : 'Featured Playlist')}
            </span>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em', textShadow: '0 4px 20px rgba(0,0,0,0.5)', lineHeight: 1.1 }}>
              {likedSongs.length > 0 ? 'Liked Songs' : (hasPlayed50 && topLangs.length > 0 ? `Best of ${topLangs[0]}` : 'Discover New Music')}
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', maxWidth: '500px', fontWeight: 500 }}>
              {likedSongs.length > 0
                ? 'Jump right back into the songs you love the most.'
                : (hasPlayed50 && topLangs.length > 0 ? `You've unlocked personalized recommendations! Explore the biggest hits in ${topLangs[0]} based on what you heard.` : `Listen to ${Math.max(50 - recentSongs.length, 0)} more songs to unlock your personalized homepage.`)}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                className="dribbble-play-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--color-gold)', color: '#000',
                  borderRadius: '99px', padding: '16px 32px', fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em',
                  boxShadow: 'var(--shadow-gold)', transition: 'transform 0.2s', cursor: 'pointer', border: 'none'
                }}
                onClick={() => {
                  let queueToPlay = likedSongs.length > 0 ? likedSongs : (hasPlayed50 && primaryLangSongs.length > 0 ? primaryLangSongs : SONGS);
                  if (likedSongs.length > 0) {
                    queueToPlay = [...likedSongs].sort(() => Math.random() - 0.5);
                  }
                  dispatch({ type: 'PLAY_SONG', payload: { song: queueToPlay[0], queue: queueToPlay } });
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                PLAY NOW
              </button>
              
              <button 
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.1)', color: '#fff',
                  borderRadius: '99px', padding: '16px 32px', fontSize: '14px', fontWeight: 800, letterSpacing: '0.05em',
                  backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'background 0.2s', cursor: 'pointer'
                }}
                onClick={() => window.location.href = '/search'}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                SEARCH
              </button>
            </div>
          </div>
        </section>

      {/* 1. Primary language (Top X Hits based on their algorithm) */}
      {primaryLangSongs.length > 0 && (
        <SectionRow
          title={`Top ${topLangs[0]} Hits`}
          songs={primaryLangSongs}
          id="language-hits"
        />
      )}

      {/* 2. Personalized Artist Section */}
      {artistSongs.length > 0 && topArtist && (
        <SectionRow
          title={`More from ${topArtist}`}
          songs={artistSongs}
          id="personal-artist-songs"
          onSeeAll={() => {}}
        />
      )}

      {/* 3. One row full of artist (Featured Artists) */}
      <div className="section-row" id="artists-you-may-like">
        <div className="section-header">
          <h2 className="section-title">Featured Artists</h2>
        </div>
        <div className="horizontal-scroll">
          {ARTISTS.map(artist => (
            <div key={artist.id} className="artist-card">
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="artist-avatar"
                width={140}
                height={140}
              />
              <div className="artist-name">{artist.name}</div>
              <div className="artist-listeners">{formatPlays(artist.monthlyListeners)} monthly listeners</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Languages section removed as per user request */}

      {/* User Playlists */}
      {playlists.length > 0 && (
        <div className="section-row" id="your-playlists">
          <div className="section-header">
            <h2 className="section-title">Your Playlists</h2>
          </div>
          <div className="horizontal-scroll">
            {playlists.map(pl => (
              <div 
                key={pl.id} 
                className="artist-card" 
                style={{ cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: 12, background: 'rgba(255,255,255,0.02)' }}
                onClick={() => window.location.href = '/library/playlists'}
              >
                <img
                  src={pl.coverUrl}
                  alt={pl.name}
                  style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 12 }}
                />
                <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{pl.songs.length} songs</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Trending Songs */}
      <SectionRow
        title="🔥 Trending Now"
        songs={trending}
        id="trending-now"
        onSeeAll={() => {}}
      />

      {/* 5. Top Hits (Made For You / General Top Hits) */}
      <SectionRow
        title="Top Hits For You"
        songs={forYou}
        id="top-hits"
        onSeeAll={() => {}}
      />

      {/* 6. Vibe (Mood Sections) */}
      <div className="section-row" id="moods">
        <div className="section-header">
          <h2 className="section-title">Your Vibe</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
          {MOOD_PLAYLISTS.map(mood => (
            <div
              key={mood.id}
              className="mood-card"
              style={{ background: `linear-gradient(135deg, ${mood.color} 0%, rgba(10,10,10,0.8) 100%)` }}
              onClick={() => {
                if (mood.songs.length > 0) {
                  dispatch({ type: 'PLAY_SONG', payload: { song: mood.songs[0], queue: mood.songs } });
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="mood-card-emoji">{mood.emoji}</div>
              <div>
                <div className="mood-card-name">{mood.name}</div>
                <div className="mood-card-count">{mood.songs.length} songs</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickPickCard({ song, allSongs }: { song: Song; allSongs: Song[] }) {
  const { state, dispatch } = useApp();
  const isPlaying = state.player.currentSong?.id === song.id && state.player.isPlaying;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        padding: '12px',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        border: '1px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="quick-pick-card"
      onClick={() => {
        if (isPlaying) {
          dispatch({ type: 'PAUSE' });
        } else if (state.player.currentSong?.id === song.id) {
          dispatch({ type: 'RESUME' });
        } else {
          dispatch({ type: 'PLAY_SONG', payload: { song, queue: allSongs } });
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Play ${song.title}`}
      onKeyDown={(e) => e.key === 'Enter' && dispatch({ type: 'PLAY_SONG', payload: { song } })}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'var(--color-surface-2)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-gold-dim)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'var(--color-surface)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
      }}
    >
      <img
        src={song.coverUrl}
        alt={song.title}
        style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
        width={52}
        height={52}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {song.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {song.artist}
        </div>
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: isPlaying ? 'var(--gradient-brand)' : 'rgba(201,168,76,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.2s ease',
        color: isPlaying ? 'var(--color-bg)' : 'var(--color-gold)',
      }}>
        {isPlaying
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        }
      </div>
    </div>
  );
}
