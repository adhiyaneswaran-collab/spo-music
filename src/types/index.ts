export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  coverUrl: string;
  audioUrl: string;
  language: Language;
  genre: Genre;
  mood: Mood[];
  year: number;
  plays: number;
  trending?: boolean;
  new?: boolean;
  // YouTube integration
  youtubeVideoId?: string;
  source?: 'local' | 'youtube';
  viewCount?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genre: Genre;
  language: Language;
  monthlyListeners: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year: number;
  songs: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: Song[];
  createdAt: number;
  updatedAt: number;
}

export interface ListeningHistoryEntry {
  song: Song;
  timestamp: number;
  durationPlayed: number;
  completed: boolean;
  skipped: boolean;
  replayed: boolean;
}

export interface UserPreference {
  languages: Partial<Record<Language, number>>;
  genres: Partial<Record<Genre, number>>;
  moods: Partial<Record<Mood, number>>;
  artists: Record<string, number>;
  totalPlays: number;
}

export type Language =
  | 'English'
  | 'Tamil'
  | 'Hindi'
  | 'Malayalam'
  | 'Telugu'
  | 'Kannada'
  | 'Bengali'
  | 'Punjabi'
  | 'Other';

export type Genre =
  | 'Pop'
  | 'Rock'
  | 'Hip-Hop'
  | 'R&B'
  | 'Electronic'
  | 'Classical'
  | 'Jazz'
  | 'Folk'
  | 'Film'
  | 'Indie'
  | 'Metal'
  | 'Devotional';

export type Mood =
  | 'Happy'
  | 'Sad'
  | 'Chill'
  | 'Energetic'
  | 'Romantic'
  | 'Focus'
  | 'Party'
  | 'Sleep'
  | 'Workout'
  | 'Travel';

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Song[];
  queueIndex: number;
  isExpanded: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
}

export interface AppState {
  player: PlayerState;
  likedSongs: Song[];
  recentlyPlayed: ListeningHistoryEntry[];
  playlists: Playlist[];
  preferences: UserPreference;
  searchHistory: string[];
}

export type AppAction =
  | { type: 'PLAY_SONG'; payload: { song: Song; queue?: Song[] } }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'NEXT' }
  | { type: 'PREVIOUS' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'TOGGLE_LIKE'; payload: Song }
  | { type: 'ADD_TO_HISTORY'; payload: ListeningHistoryEntry }
  | { type: 'CREATE_PLAYLIST'; payload: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'DELETE_PLAYLIST'; payload: string }
  | { type: 'ADD_TO_PLAYLIST'; payload: { playlistId: string; song: Song } }
  | { type: 'REMOVE_FROM_PLAYLIST'; payload: { playlistId: string; songId: string } }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreference> }
  | { type: 'ADD_SEARCH_HISTORY'; payload: string }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'CYCLE_REPEAT' }
  // Internal hydration actions (localStorage → state after mount)
  | { type: '_HYDRATE_LIKED'; payload: Song[] }
  | { type: '_HYDRATE_RECENT'; payload: ListeningHistoryEntry[] }
  | { type: '_HYDRATE_PLAYLISTS'; payload: Playlist[] }
  | { type: '_HYDRATE_PREFS'; payload: UserPreference }
  | { type: '_HYDRATE_SEARCH'; payload: string[] };

