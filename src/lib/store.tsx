'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import type { AppState, AppAction, Song, PlayerState, UserPreference } from '@/types';
import { updatePreferencesFromPlay } from './recommendations';

const initialPreferences: UserPreference = {
  languages: {},
  genres: {},
  moods: {},
  artists: {},
  totalPlays: 0,
};

const initialPlayerState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  queue: [],
  queueIndex: -1,
  isExpanded: false,
  isShuffled: false,
  repeatMode: 'none',
};

const initialState: AppState = {
  player: initialPlayerState,
  likedSongs: [],
  recentlyPlayed: [],
  playlists: [],
  preferences: initialPreferences,
  searchHistory: [],
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'PLAY_SONG': {
      const queue = action.payload.queue ?? [action.payload.song];
      const queueIndex = queue.findIndex(s => s.id === action.payload.song.id);
      return {
        ...state,
        player: {
          ...state.player,
          currentSong: action.payload.song,
          isPlaying: true,
          progress: 0,
          queue,
          queueIndex: queueIndex >= 0 ? queueIndex : 0,
        },
      };
    }
    case 'PAUSE':
      return { ...state, player: { ...state.player, isPlaying: false } };
    case 'RESUME':
      return { ...state, player: { ...state.player, isPlaying: true } };
    case 'NEXT': {
      const { queue, queueIndex, repeatMode, isShuffled } = state.player;
      if (!queue.length) return state;
      let nextIndex: number;
      if (isShuffled) {
        nextIndex = Math.floor(Math.random() * queue.length);
      } else if (queueIndex < queue.length - 1) {
        nextIndex = queueIndex + 1;
      } else if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return { ...state, player: { ...state.player, isPlaying: false } };
      }
      return {
        ...state,
        player: { ...state.player, currentSong: queue[nextIndex], queueIndex: nextIndex, progress: 0 },
      };
    }
    case 'PREVIOUS': {
      const { queue, queueIndex } = state.player;
      if (!queue.length) return state;
      const prevIndex = queueIndex > 0 ? queueIndex - 1 : 0;
      return {
        ...state,
        player: { ...state.player, currentSong: queue[prevIndex], queueIndex: prevIndex, progress: 0 },
      };
    }
    case 'SET_VOLUME':
      return { ...state, player: { ...state.player, volume: action.payload } };
    case 'SET_PROGRESS':
      return { ...state, player: { ...state.player, progress: action.payload } };
    case 'SET_DURATION':
      return { ...state, player: { ...state.player, duration: action.payload } };
    case 'TOGGLE_EXPANDED':
      return { ...state, player: { ...state.player, isExpanded: !state.player.isExpanded } };
    case 'TOGGLE_SHUFFLE':
      return { ...state, player: { ...state.player, isShuffled: !state.player.isShuffled } };
    case 'CYCLE_REPEAT': {
      const modes: PlayerState['repeatMode'][] = ['none', 'all', 'one'];
      const cur = modes.indexOf(state.player.repeatMode);
      return { ...state, player: { ...state.player, repeatMode: modes[(cur + 1) % 3] } };
    }
    case 'TOGGLE_LIKE': {
      const song = action.payload;
      const isLiked = state.likedSongs.some(s => s.id === song.id);
      return {
        ...state,
        likedSongs: isLiked
          ? state.likedSongs.filter(s => s.id !== song.id)
          : [song, ...state.likedSongs],
      };
    }
    case 'ADD_TO_HISTORY': {
      const entry = action.payload;
      const newHistory = [entry, ...state.recentlyPlayed.filter(e => e.song.id !== entry.song.id)].slice(0, 100);
      const newPrefs = updatePreferencesFromPlay(state.preferences, entry.song, entry.completed, entry.skipped);
      return { ...state, recentlyPlayed: newHistory, preferences: newPrefs };
    }
    case 'CREATE_PLAYLIST': {
      const pl = {
        ...action.payload,
        id: `pl-${Date.now()}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return { ...state, playlists: [pl, ...state.playlists] };
    }
    case 'DELETE_PLAYLIST':
      return { ...state, playlists: state.playlists.filter(p => p.id !== action.payload) };
    case 'ADD_TO_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.map(p =>
          p.id === action.payload.playlistId
            ? { ...p, songs: [...p.songs, action.payload.song], updatedAt: Date.now() }
            : p
        ),
      };
    case 'REMOVE_FROM_PLAYLIST':
      return {
        ...state,
        playlists: state.playlists.map(p =>
          p.id === action.payload.playlistId
            ? { ...p, songs: p.songs.filter(s => s.id !== action.payload.songId), updatedAt: Date.now() }
            : p
        ),
      };
    case 'UPDATE_PREFERENCES':
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
    case 'ADD_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [action.payload, ...state.searchHistory.filter(q => q !== action.payload)].slice(0, 10),
      };
    case '_HYDRATE_LIKED':     return { ...state, likedSongs: action.payload };
    case '_HYDRATE_RECENT':    return { ...state, recentlyPlayed: action.payload };
    case '_HYDRATE_PLAYLISTS': return { ...state, playlists: action.payload };
    case '_HYDRATE_PREFS':     return { ...state, preferences: action.payload };
    case '_HYDRATE_SEARCH':    return { ...state, searchHistory: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  hydrated: boolean;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Always start with initialState (server + first client render must match)
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // Phase 2: load persisted state from localStorage AFTER first paint
  useEffect(() => {
    try {
      const saved = localStorage.getItem('spovibe-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Restore non-player state only
        if (parsed.likedSongs)    dispatch({ type: '_HYDRATE_LIKED',    payload: parsed.likedSongs });
        if (parsed.recentlyPlayed) dispatch({ type: '_HYDRATE_RECENT',  payload: parsed.recentlyPlayed });
        if (parsed.playlists)     dispatch({ type: '_HYDRATE_PLAYLISTS', payload: parsed.playlists });
        if (parsed.preferences)   dispatch({ type: '_HYDRATE_PREFS',   payload: parsed.preferences });
        if (parsed.searchHistory) dispatch({ type: '_HYDRATE_SEARCH',  payload: parsed.searchHistory });
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Persist to localStorage after hydration only
  useEffect(() => {
    if (!hydrated) return;
    const toSave = {
      likedSongs: state.likedSongs,
      recentlyPlayed: state.recentlyPlayed,
      playlists: state.playlists,
      preferences: state.preferences,
      searchHistory: state.searchHistory,
    };
    localStorage.setItem('spovibe-state', JSON.stringify(toSave));
  }, [hydrated, state.likedSongs, state.recentlyPlayed, state.playlists, state.preferences, state.searchHistory]);

  return (
    <AppContext.Provider value={{ state, dispatch, hydrated }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function usePlayer() {
  const { state, dispatch } = useApp();
  return { player: state.player, dispatch };
}

export function useLibrary() {
  const { state, dispatch } = useApp();
  return {
    likedSongs: state.likedSongs,
    recentlyPlayed: state.recentlyPlayed,
    playlists: state.playlists,
    dispatch,
  };
}
