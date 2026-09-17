'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface YouTubePlayerHandle {
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  getDuration: () => number;
  getCurrentTime: () => number;
}

interface Props {
  videoId: string | null;
  isPlaying: boolean;
  volume: number;             // 0–1
  onReady: (duration: number) => void;
  onProgress: (currentTime: number, duration: number) => void;
  onEnded: () => void;
  onError: () => void;
  playerRef: React.RefObject<YouTubePlayerHandle | null>;
}

let apiLoaded = false;
let apiReady = false;
const readyCallbacks: (() => void)[] = [];

function loadYouTubeAPI(onReady: () => void) {
  if (apiReady) { onReady(); return; }
  readyCallbacks.push(onReady);
  if (apiLoaded) return;
  apiLoaded = true;

  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api';
  script.async = true;
  document.head.appendChild(script);

  window.onYouTubeIframeAPIReady = () => {
    apiReady = true;
    readyCallbacks.forEach(cb => cb());
    readyCallbacks.length = 0;
  };
}

export function YouTubePlayer({ videoId, isPlaying, volume, onReady, onProgress, onEnded, onError, playerRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [ytReady, setYtReady] = useState(false);

  // Load YouTube IFrame API once
  useEffect(() => {
    loadYouTubeAPI(() => setYtReady(true));
  }, []);

  // Create player when API is ready and videoId changes
  useEffect(() => {
    if (!ytReady || !videoId || !containerRef.current) return;

    // Destroy old player
    if (ytPlayerRef.current) {
      ytPlayerRef.current.destroy();
      ytPlayerRef.current = null;
    }

    ytPlayerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (e: any) => {
          const dur = e.target.getDuration() || 0;
          e.target.setVolume(Math.round(volume * 100));
          onReady(dur);
          if (isPlaying) e.target.playVideo();
        },
        onStateChange: (e: any) => {
          if (e.data === window.YT.PlayerState.ENDED) {
            onEnded();
            if (progressInterval.current) clearInterval(progressInterval.current);
          }
          if (e.data === window.YT.PlayerState.PLAYING) {
            progressInterval.current = setInterval(() => {
              if (!ytPlayerRef.current) return;
              const cur = ytPlayerRef.current.getCurrentTime?.() ?? 0;
              const dur = ytPlayerRef.current.getDuration?.() ?? 0;
              onProgress(cur, dur);
            }, 500);
          } else {
            if (progressInterval.current) {
              clearInterval(progressInterval.current);
              progressInterval.current = null;
            }
          }
        },
        onError: () => onError(),
      },
    });

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [ytReady, videoId]);

  // Sync play/pause
  useEffect(() => {
    if (!ytPlayerRef.current?.playVideo) return;
    if (isPlaying) {
      ytPlayerRef.current.playVideo();
    } else {
      ytPlayerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (!ytPlayerRef.current?.setVolume) return;
    ytPlayerRef.current.setVolume(Math.round(volume * 100));
  }, [volume]);

  // Expose imperative handle
  useEffect(() => {
    if (!playerRef) return;
    (playerRef as React.MutableRefObject<YouTubePlayerHandle>).current = {
      play: () => ytPlayerRef.current?.playVideo?.(),
      pause: () => ytPlayerRef.current?.pauseVideo?.(),
      seek: (s: number) => ytPlayerRef.current?.seekTo?.(s, true),
      setVolume: (v: number) => ytPlayerRef.current?.setVolume?.(Math.round(v * 100)),
      getDuration: () => ytPlayerRef.current?.getDuration?.() ?? 0,
      getCurrentTime: () => ytPlayerRef.current?.getCurrentTime?.() ?? 0,
    };
  }, [ytReady, playerRef]);

  return (
    <div style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
      <div ref={containerRef} />
    </div>
  );
}
