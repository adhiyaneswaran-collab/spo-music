'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useApp } from '@/lib/store';
import { formatDuration } from '@/lib/mockData';
import { YouTubePlayer, type YouTubePlayerHandle } from '@/components/player/YouTubePlayer';
import type { Song } from '@/types';

export function MusicPlayer() {
  const { state, dispatch } = useApp();
  const { player } = state;
  const progressRef = useRef<HTMLDivElement>(null);
  const expandedProgressRef = useRef<HTMLDivElement>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [localDuration, setLocalDuration] = useState(0);
  const historyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ytPlayerRef = useRef<YouTubePlayerHandle | null>(null);

  // For local/simulated songs (no YouTube ID) — simulate progress
  const simulationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const song = player.currentSong;
  const isLiked = song ? state.likedSongs.some(s => s.id === song.id) : false;
  const isYouTubeSong = Boolean(song?.youtubeVideoId);

  // ─── LocalStorage Tracking removed since ADD_TO_HISTORY tracks this ───

  // Simulate progress for non-YouTube tracks
  useEffect(() => {
    if (!song) return;
    setLocalProgress(0);
    setLocalDuration(song.duration || 0);

    // Clear old simulation
    if (simulationRef.current) { clearInterval(simulationRef.current); simulationRef.current = null; }

    // For non-YouTube songs: simulate progress
    if (!song.youtubeVideoId) {
      dispatch({ type: 'SET_DURATION', payload: song.duration });

      if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
      historyTimerRef.current = setTimeout(() => {
        dispatch({
          type: 'ADD_TO_HISTORY',
          payload: { song, timestamp: Date.now(), durationPlayed: 10, completed: false, skipped: false, replayed: false },
        });
      }, 800);
    }

    return () => {
      if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [song?.id]);

  // Simulate progress for local songs
  useEffect(() => {
    if (!song || isYouTubeSong) return;
    if (!player.isPlaying) {
      if (simulationRef.current) { clearInterval(simulationRef.current); simulationRef.current = null; }
      return;
    }
    simulationRef.current = setInterval(() => {
      setLocalProgress(prev => {
        const next = prev + 1;
        if (next >= (song.duration || 240)) {
          dispatch({ type: 'NEXT' });
          dispatch({
            type: 'ADD_TO_HISTORY',
            payload: { song, timestamp: Date.now(), durationPlayed: song.duration, completed: true, skipped: false, replayed: false },
          });
          return 0;
        }
        dispatch({ type: 'SET_PROGRESS', payload: next });
        return next;
      });
    }, 1000);

    return () => { if (simulationRef.current) clearInterval(simulationRef.current); };
  }, [player.isPlaying, song?.id, isYouTubeSong]);

  // ─── YouTube callbacks ───────────────────────────────────────────────────────
  const handleYTReady = useCallback((dur: number) => {
    setLocalDuration(dur);
    dispatch({ type: 'SET_DURATION', payload: dur });
    if (song) {
      dispatch({
        type: 'ADD_TO_HISTORY',
        payload: { song, timestamp: Date.now(), durationPlayed: 5, completed: false, skipped: false, replayed: false },
      });
    }
  }, [song, dispatch]);

  const handleYTProgress = useCallback((cur: number, dur: number) => {
    setLocalProgress(cur);
    if (dur > 0) setLocalDuration(dur);
    dispatch({ type: 'SET_PROGRESS', payload: Math.floor(cur) });
  }, [dispatch]);

  const handleYTEnded = useCallback(() => {
    dispatch({ type: 'NEXT' });
    if (song) {
      dispatch({
        type: 'ADD_TO_HISTORY',
        payload: { song, timestamp: Date.now(), durationPlayed: localDuration, completed: true, skipped: false, replayed: false },
      });
    }
  }, [dispatch, song, localDuration]);

  const handleYTError = useCallback(() => {
    dispatch({ type: 'NEXT' });
  }, [dispatch]);

  // ─── Progress bar click ──────────────────────────────────────────────────────
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newProgress = ratio * localDuration;
    setLocalProgress(newProgress);
    dispatch({ type: 'SET_PROGRESS', payload: Math.floor(newProgress) });
    if (isYouTubeSong && ytPlayerRef.current) ytPlayerRef.current.seek(newProgress);
  }, [localDuration, isYouTubeSong, dispatch]);

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    dispatch({ type: 'SET_VOLUME', payload: ratio });
    if (isYouTubeSong && ytPlayerRef.current) ytPlayerRef.current.setVolume(ratio);
  };

  if (!song) return null;

  const progressPct = localDuration > 0 ? Math.min(100, (localProgress / localDuration) * 100) : 0;

  return (
    <>
      {/* Hidden YouTube IFrame player */}
      {isYouTubeSong && (
        <YouTubePlayer
          videoId={song.youtubeVideoId!}
          isPlaying={player.isPlaying}
          volume={player.volume}
          onReady={handleYTReady}
          onProgress={handleYTProgress}
          onEnded={handleYTEnded}
          onError={handleYTError}
          playerRef={ytPlayerRef}
        />
      )}

      {/* ── Mini Player Bar ── */}
      <div id="mini-player" className="player" role="region" aria-label="Music player">
        {/* Song info */}
        <div className="player-song-info">
          <div style={{ position: 'relative' }}>
            <img
              src={song.coverUrl}
              alt={`${song.title} cover`}
              className="player-art"
              onClick={() => dispatch({ type: 'TOGGLE_EXPANDED' })}
              width={52} height={52}
            />
            {player.isPlaying && (
              <div style={{ position: 'absolute', bottom: 2, right: 2 }}>
                <Waveform small />
              </div>
            )}
            {song.source === 'youtube' && (
              <div style={{ position: 'absolute', top: 2, right: 2 }}>
                <span style={{ background: '#FF0000', borderRadius: 3, padding: '1px 4px', fontSize: 8, fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>YT</span>
              </div>
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="player-song-name">{song.title}</div>
            <div className="player-artist-name">{song.artist}</div>
          </div>
          <button
            className={`icon-btn ${isLiked ? 'liked' : ''}`}
            onClick={() => song && dispatch({ type: 'TOGGLE_LIKE', payload: song })}
            aria-label={isLiked ? 'Unlike song' : 'Like song'}
            id="player-like-btn"
          >
            <HeartIcon filled={isLiked} />
          </button>
        </div>

        {/* Center controls */}
        <div className="player-center">
          <div className="player-controls">
            <button className={`player-btn ${player.isShuffled ? 'active' : ''}`} onClick={() => dispatch({ type: 'TOGGLE_SHUFFLE' })} aria-label="Toggle shuffle" id="player-shuffle-btn"><ShuffleIcon /></button>
            <button className="player-btn" onClick={() => { dispatch({ type: 'PREVIOUS' }); setLocalProgress(0); }} aria-label="Previous" id="player-prev-btn"><PrevIcon /></button>
            <button className="player-btn-play" onClick={() => dispatch({ type: player.isPlaying ? 'PAUSE' : 'RESUME' })} aria-label={player.isPlaying ? 'Pause' : 'Play'} id="player-play-btn">
              {player.isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="player-btn" onClick={() => { dispatch({ type: 'NEXT' }); setLocalProgress(0); }} aria-label="Next" id="player-next-btn"><NextIcon /></button>
            <button className={`player-btn ${player.repeatMode !== 'none' ? 'active' : ''}`} onClick={() => dispatch({ type: 'CYCLE_REPEAT' })} aria-label="Repeat" id="player-repeat-btn"><RepeatIcon one={player.repeatMode === 'one'} /></button>
          </div>
          <div className="player-progress">
            <span className="player-time">{formatDuration(Math.floor(localProgress))}</span>
            <div ref={progressRef} className="progress-bar" onClick={e => handleProgressClick(e, progressRef)} role="progressbar" aria-valuenow={Math.floor(localProgress)} aria-valuemin={0} aria-valuemax={Math.floor(localDuration)}>
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="player-time" style={{ textAlign: 'right' }}>{formatDuration(Math.floor(localDuration))}</span>
          </div>
        </div>

        {/* Right controls */}
        <div className="player-right">
          <button className="player-btn" onClick={() => dispatch({ type: 'TOGGLE_EXPANDED' })} aria-label="Expand player" id="player-expand-btn"><ExpandIcon /></button>
          <div className="volume-control">
            <button className="player-btn" aria-label="Volume"><VolumeIcon volume={player.volume} /></button>
            <div className="volume-slider" onClick={handleVolumeClick} role="slider" aria-valuenow={player.volume} aria-valuemin={0} aria-valuemax={1} aria-label="Volume">
              <div className="volume-fill" style={{ width: `${player.volume * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Expanded Player ── */}
      {player.isExpanded && (
        <ExpandedPlayer
          song={song}
          isPlaying={player.isPlaying}
          progress={localProgress}
          duration={localDuration}
          isLiked={isLiked}
          isShuffled={player.isShuffled}
          repeatMode={player.repeatMode}
          onClose={() => dispatch({ type: 'TOGGLE_EXPANDED' })}
          onPlayPause={() => dispatch({ type: player.isPlaying ? 'PAUSE' : 'RESUME' })}
          onNext={() => { dispatch({ type: 'NEXT' }); setLocalProgress(0); }}
          onPrev={() => { dispatch({ type: 'PREVIOUS' }); setLocalProgress(0); }}
          onLike={() => song && dispatch({ type: 'TOGGLE_LIKE', payload: song })}
          onProgressClick={e => handleProgressClick(e, expandedProgressRef)}
          progressRef={expandedProgressRef}
        />
      )}
    </>
  );
}

/* ── Expanded Player component ───────────────────────────────────────────────── */
interface ExpandedProps {
  song: Song; isPlaying: boolean; progress: number; duration: number;
  isLiked: boolean; isShuffled: boolean; repeatMode: 'none' | 'one' | 'all';
  onClose: () => void; onPlayPause: () => void; onNext: () => void; onPrev: () => void;
  onLike: () => void; onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  progressRef: React.RefObject<HTMLDivElement | null>;
}

function ExpandedPlayer({ song, isPlaying, progress, duration, isLiked, isShuffled, repeatMode, onClose, onPlayPause, onNext, onPrev, onLike, onProgressClick, progressRef }: ExpandedProps) {
  const pct = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;

  return (
    <div className="expanded-player" role="dialog" aria-label="Now playing">
      <div className="expanded-player-bg" style={{ backgroundImage: `url(${song.coverUrl})` }} />
      <div className="expanded-player-header">
        <button className="player-btn" onClick={onClose} aria-label="Collapse player" id="player-collapse-btn"><ChevronDownIcon /></button>
        <span className="expanded-player-label">Now Playing{song.source === 'youtube' ? ' · YouTube' : ''}</span>
        <button className="player-btn" aria-label="More options"><DotsIcon /></button>
      </div>
      <div className="expanded-player-body">
        <div className="expanded-art-wrap">
          <img src={song.coverUrl} alt={song.title} className="expanded-art" width={320} height={320} />
        </div>
        <div className="expanded-info">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <div className="expanded-song-title">{song.title}</div>
              <div className="expanded-artist">{song.artist}</div>
            </div>
            <button className={`icon-btn ${isLiked ? 'liked' : ''}`} onClick={onLike} style={{ width: 44, height: 44 }} aria-label={isLiked ? 'Unlike' : 'Like'}>
              <HeartIcon filled={isLiked} size={20} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
            <span className="badge badge-gold">{song.language}</span>
            <span className="badge badge-gold">{song.genre}</span>
            {song.source === 'youtube' && <span style={{ background: '#FF0000', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 800, color: '#fff' }}>YouTube</span>}
          </div>
          {isPlaying && <div style={{ marginBottom: 20 }}><Waveform /></div>}
          <div className="expanded-controls">
            <div className="player-progress">
              <span className="player-time">{formatDuration(Math.floor(progress))}</span>
              <div ref={progressRef} className="progress-bar" onClick={onProgressClick} role="progressbar" aria-valuenow={Math.floor(progress)} aria-valuemax={Math.floor(duration)}>
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="player-time" style={{ textAlign: 'right' }}>{formatDuration(Math.floor(duration))}</span>
            </div>
            <div className="expanded-buttons">
              <button className="player-btn" onClick={onPrev} aria-label="Previous"><PrevIcon size={28} /></button>
              <button className="expanded-btn-play" onClick={onPlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? <PauseIcon size={28} /> : <PlayIcon size={28} />}</button>
              <button className="player-btn" onClick={onNext} aria-label="Next"><NextIcon size={28} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Waveform ─────────────────────────────────────────────────────────────────── */
function Waveform({ small = false }: { small?: boolean }) {
  return (
    <div className="waveform" style={small ? { height: 12, gap: 2 } : undefined}>
      {Array.from({ length: small ? 4 : 8 }).map((_, i) => (
        <div key={i} className="waveform-bar" style={small ? { width: 2 } : undefined} />
      ))}
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────────────────────── */
function HeartIcon({ filled = false, size = 16 }: { filled?: boolean; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function PlayIcon({ size = 18 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>; }
function PauseIcon({ size = 18 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>; }
function PrevIcon({ size = 18 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2"/></svg>; }
function NextIcon({ size = 18 }: { size?: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2"/></svg>; }
function ShuffleIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>; }
function RepeatIcon({ one = false }: { one?: boolean }) { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>{one && <text x="10" y="16" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">1</text>}</svg>; }
function ExpandIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>; }
function ChevronDownIcon() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>; }
function DotsIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>; }
function VolumeIcon({ volume }: { volume: number }) {
  return volume === 0
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>{volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>}<path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>;
}
