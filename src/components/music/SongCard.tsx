'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import { formatDuration } from '@/lib/mockData';
import type { Song } from '@/types';

interface SongCardProps {
  song: Song;
  queue?: Song[];
}

export function SongCard({ song, queue }: SongCardProps) {
  const { state, dispatch } = useApp();
  const isPlaying = state.player.currentSong?.id === song.id && state.player.isPlaying;
  const isLiked = state.likedSongs.some(s => s.id === song.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (state.player.currentSong?.id === song.id) {
      dispatch({ type: state.player.isPlaying ? 'PAUSE' : 'RESUME' });
    } else {
      dispatch({ type: 'PLAY_SONG', payload: { song, queue } });
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_LIKE', payload: song });
  };

  return (
    <div
      className="song-card"
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      aria-label={`Play ${song.title} by ${song.artist}`}
      onKeyDown={(e) => e.key === 'Enter' && handlePlay(e as any)}
    >
      <div className="song-card-art-wrap">
        <img
          src={song.coverUrl}
          alt={`${song.title} album art`}
          className="song-card-art"
          width={160}
          height={160}
        />
        <div className="song-card-overlay">
          <button
            className="song-card-play-btn"
            onClick={handlePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying
              ? <PauseIcon />
              : <PlayIcon />
            }
          </button>
        </div>
        <div className="song-card-actions">
          <button
            className={`icon-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <HeartIcon filled={isLiked} />
          </button>
        </div>
        {song.trending && (
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <span className="badge badge-gold">🔥 Hot</span>
          </div>
        )}
        {song.new && (
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <span className="badge badge-new">New</span>
          </div>
        )}
      </div>
      <div className="song-card-title">{song.title}</div>
      <div className="song-card-artist">{song.artist}</div>
    </div>
  );
}

interface SongRowProps {
  song: Song;
  queue?: Song[];
  index?: number;
  showIndex?: boolean;
}

export function SongRow({ song, queue, index, showIndex = false }: SongRowProps) {
  const { state, dispatch } = useApp();
  const isPlaying = state.player.currentSong?.id === song.id && state.player.isPlaying;
  const isActive = state.player.currentSong?.id === song.id;
  const isLiked = state.likedSongs.some(s => s.id === song.id);

  const handlePlay = () => {
    if (isActive) {
      dispatch({ type: state.player.isPlaying ? 'PAUSE' : 'RESUME' });
    } else {
      dispatch({ type: 'PLAY_SONG', payload: { song, queue } });
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_LIKE', payload: song });
  };

  return (
    <div
      className={`song-row ${isActive ? 'playing' : ''}`}
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      aria-label={`${isPlaying ? 'Pause' : 'Play'} ${song.title}`}
      onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
    >
      {showIndex && (
        <span style={{ width: 24, textAlign: 'center', color: isActive ? 'var(--color-gold)' : 'var(--text-muted)', fontSize: 13, flexShrink: 0 }}>
          {isPlaying ? <WaveformMini /> : index}
        </span>
      )}
      <img
        src={song.coverUrl}
        alt={song.title}
        className="song-row-art"
        width={48}
        height={48}
      />
      <div className="song-row-info">
        <div className="song-row-title">{song.title}</div>
        <div className="song-row-artist">
          {song.artist}
          <span style={{ marginLeft: 8, fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
            {song.language}
          </span>
        </div>
      </div>
      <div className="song-row-actions">
        <button
          className={`icon-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <HeartIcon filled={isLiked} />
        </button>
      </div>
      <span className="song-row-duration">{formatDuration(song.duration)}</span>
    </div>
  );
}

function WaveformMini() {
  return (
    <span style={{ display: 'inline-flex', gap: 1, alignItems: 'center', height: 12 }}>
      {[1, 2, 3].map(i => (
        <span
          key={i}
          style={{
            display: 'inline-block', width: 2, background: 'var(--color-gold)',
            borderRadius: 1, height: `${30 + i * 20}%`,
            animation: `waveform-bounce 1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
