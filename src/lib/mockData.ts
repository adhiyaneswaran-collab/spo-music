import type { Song, Artist, Album, Genre, Language, Mood } from '@/types';

// Cover art using picsum with consistent seeds for determinism
const cover = (seed: number) => `https://picsum.photos/seed/${seed}/300/300`;

export const SONGS: Song[] = [
  // English
  {
    id: 'e1', title: 'Midnight Echoes', artist: 'Luna Waves', album: 'Neon Drift',
    duration: 214, coverUrl: cover(10), audioUrl: '', language: 'English', genre: 'Indie',
    mood: ['Chill', 'Romantic'], year: 2024, plays: 4200000, trending: true,
  },
  {
    id: 'e2', title: 'Golden Hour', artist: 'Solar Fray', album: 'Daybreak',
    duration: 198, coverUrl: cover(11), audioUrl: '', language: 'English', genre: 'Pop',
    mood: ['Happy', 'Travel'], year: 2024, plays: 6100000,
  },
  {
    id: 'e3', title: 'Neon Rain', artist: 'Cyber Bloom', album: 'Digital Dreams',
    duration: 241, coverUrl: cover(12), audioUrl: '', language: 'English', genre: 'Electronic',
    mood: ['Energetic', 'Party'], year: 2023, plays: 2900000, trending: true,
  },
  {
    id: 'e4', title: 'Velvet Skies', artist: 'The Dusk', album: 'Afterglow',
    duration: 227, coverUrl: cover(13), audioUrl: '', language: 'English', genre: 'R&B',
    mood: ['Romantic', 'Sad'], year: 2024, plays: 3800000, new: true,
  },
  {
    id: 'e5', title: 'Open Roads', artist: 'Dusty Horizon', album: 'Plains',
    duration: 232, coverUrl: cover(14), audioUrl: '', language: 'English', genre: 'Indie',
    mood: ['Travel', 'Happy'], year: 2023, plays: 5100000,
  },
  {
    id: 'e6', title: 'Phantom Lines', artist: 'Cipher Echo', album: 'Ghost Protocol',
    duration: 195, coverUrl: cover(15), audioUrl: '', language: 'English', genre: 'Electronic',
    mood: ['Focus', 'Energetic'], year: 2024, plays: 1700000, new: true,
  },
  {
    id: 'e7', title: 'Firefly Dream', artist: 'Ember Cole', album: 'Warmth',
    duration: 219, coverUrl: cover(16), audioUrl: '', language: 'English', genre: 'Folk',
    mood: ['Chill', 'Sleep'], year: 2023, plays: 4400000,
  },
  {
    id: 'e8', title: 'Storm Season', artist: 'Tempest & Rain', album: 'Weather Vol.2',
    duration: 238, coverUrl: cover(17), audioUrl: '', language: 'English', genre: 'Rock',
    mood: ['Energetic', 'Workout'], year: 2024, plays: 3300000, trending: true,
  },

  // Tamil
  {
    id: 't1', title: 'Nila Kaigal', artist: 'A.R. Vibe', album: 'Mazhai Paadal',
    duration: 245, coverUrl: cover(20), audioUrl: '', language: 'Tamil', genre: 'Film',
    mood: ['Romantic', 'Sad'], year: 2024, plays: 8900000, trending: true,
  },
  {
    id: 't2', title: 'Konjam Konjam', artist: 'Sid Sriram Lite', album: 'Vaanam',
    duration: 218, coverUrl: cover(21), audioUrl: '', language: 'Tamil', genre: 'Folk',
    mood: ['Happy', 'Romantic'], year: 2024, plays: 7200000,
  },
  {
    id: 't3', title: 'Paadal Ondru', artist: 'Yuvan Beat', album: 'Kaathal',
    duration: 233, coverUrl: cover(22), audioUrl: '', language: 'Tamil', genre: 'Pop',
    mood: ['Chill', 'Sad'], year: 2023, plays: 5600000, new: true,
  },
  {
    id: 't4', title: 'Veyil Mazhai', artist: 'GV Prakash Jr.', album: 'Summer',
    duration: 209, coverUrl: cover(23), audioUrl: '', language: 'Tamil', genre: 'Film',
    mood: ['Happy', 'Travel'], year: 2024, plays: 6400000, trending: true,
  },
  {
    id: 't5', title: 'Iravu Paadal', artist: 'Anirudh Nova', album: 'Idhayam',
    duration: 251, coverUrl: cover(24), audioUrl: '', language: 'Tamil', genre: 'Film',
    mood: ['Romantic', 'Sleep'], year: 2023, plays: 9100000,
  },
  {
    id: 't6', title: 'Mella Thiranthathu', artist: 'Harrish Jayaraj Jr.', album: 'Klassic',
    duration: 264, coverUrl: cover(25), audioUrl: '', language: 'Tamil', genre: 'Classical',
    mood: ['Chill', 'Focus'], year: 2024, plays: 3200000, new: true,
  },

  // Hindi
  {
    id: 'h1', title: 'Tum Ho Paas', artist: 'Arijit Groove', album: 'Pyaar Ka Safar',
    duration: 237, coverUrl: cover(30), audioUrl: '', language: 'Hindi', genre: 'Film',
    mood: ['Romantic', 'Sad'], year: 2024, plays: 12000000, trending: true,
  },
  {
    id: 'h2', title: 'Dil Dhadke', artist: 'Badshah Wave', album: 'Beats & Vibes',
    duration: 203, coverUrl: cover(31), audioUrl: '', language: 'Hindi', genre: 'Hip-Hop',
    mood: ['Party', 'Energetic'], year: 2024, plays: 9500000,
  },
  {
    id: 'h3', title: 'Raat Ka Taara', artist: 'Jubin Nova', album: 'Sitaron Ki Raat',
    duration: 228, coverUrl: cover(32), audioUrl: '', language: 'Hindi', genre: 'Pop',
    mood: ['Romantic', 'Sleep'], year: 2023, plays: 7800000, new: true,
  },
  {
    id: 'h4', title: 'Ek Awaaz', artist: 'KK Echo', album: 'Teri Yaad',
    duration: 215, coverUrl: cover(33), audioUrl: '', language: 'Hindi', genre: 'Film',
    mood: ['Sad', 'Chill'], year: 2024, plays: 6200000,
  },

  // Malayalam
  {
    id: 'm1', title: 'Kaadal Kaattu', artist: 'Vineeth Vibes', album: 'Kaattu',
    duration: 231, coverUrl: cover(40), audioUrl: '', language: 'Malayalam', genre: 'Film',
    mood: ['Romantic', 'Happy'], year: 2024, plays: 5400000, trending: true,
  },
  {
    id: 'm2', title: 'Pournami', artist: 'Shaan Nova', album: 'Nila',
    duration: 247, coverUrl: cover(41), audioUrl: '', language: 'Malayalam', genre: 'Folk',
    mood: ['Chill', 'Sleep'], year: 2023, plays: 4100000, new: true,
  },

  // Telugu
  {
    id: 'te1', title: 'Nuvvu Leka', artist: 'DSP Remix', album: 'Prema Kavita',
    duration: 229, coverUrl: cover(50), audioUrl: '', language: 'Telugu', genre: 'Film',
    mood: ['Romantic', 'Sad'], year: 2024, plays: 7300000, trending: true,
  },
  {
    id: 'te2', title: 'Pillalu Bommalu', artist: 'Sid Srihari', album: 'Bala Bala',
    duration: 198, coverUrl: cover(51), audioUrl: '', language: 'Telugu', genre: 'Folk',
    mood: ['Happy', 'Party'], year: 2023, plays: 4600000,
  },

  // Kannada
  {
    id: 'k1', title: 'Preethina Haadu', artist: 'Arjun Janya Flow', album: 'Preethi',
    duration: 222, coverUrl: cover(60), audioUrl: '', language: 'Kannada', genre: 'Film',
    mood: ['Romantic', 'Happy'], year: 2024, plays: 3900000, new: true,
  },

  // Punjabi
  {
    id: 'p1', title: 'Dildarian', artist: 'AP Dhillon Echo', album: 'Supernova',
    duration: 213, coverUrl: cover(70), audioUrl: '', language: 'Punjabi', genre: 'Pop',
    mood: ['Party', 'Happy'], year: 2024, plays: 8200000, trending: true,
  },
  {
    id: 'p2', title: 'Tenu Pyaar', artist: 'Shubh Beat', album: 'Still Rolling',
    duration: 235, coverUrl: cover(71), audioUrl: '', language: 'Punjabi', genre: 'Hip-Hop',
    mood: ['Romantic', 'Chill'], year: 2023, plays: 6700000,
  },

  // Bengali
  {
    id: 'b1', title: 'Amar Sonar Bangla', artist: 'Rupankar Remix', album: 'Bhalobasha',
    duration: 244, coverUrl: cover(80), audioUrl: '', language: 'Bengali', genre: 'Folk',
    mood: ['Sad', 'Chill'], year: 2024, plays: 2800000, new: true,
  },
];

export const ARTISTS: Artist[] = [
  { id: 'a1', name: 'Luna Waves', imageUrl: cover(110), genre: 'Indie', language: 'English', monthlyListeners: 4200000 },
  { id: 'a2', name: 'A.R. Vibe', imageUrl: cover(120), genre: 'Film', language: 'Tamil', monthlyListeners: 8900000 },
  { id: 'a3', name: 'Arijit Groove', imageUrl: cover(130), genre: 'Film', language: 'Hindi', monthlyListeners: 12000000 },
  { id: 'a4', name: 'AP Dhillon Echo', imageUrl: cover(140), genre: 'Pop', language: 'Punjabi', monthlyListeners: 8200000 },
  { id: 'a5', name: 'Anirudh Nova', imageUrl: cover(150), genre: 'Film', language: 'Tamil', monthlyListeners: 9100000 },
  { id: 'a6', name: 'Badshah Wave', imageUrl: cover(160), genre: 'Hip-Hop', language: 'Hindi', monthlyListeners: 9500000 },
  { id: 'a7', name: 'Vineeth Vibes', imageUrl: cover(170), genre: 'Film', language: 'Malayalam', monthlyListeners: 5400000 },
  { id: 'a8', name: 'DSP Remix', imageUrl: cover(180), genre: 'Film', language: 'Telugu', monthlyListeners: 7300000 },
];

export const ALBUMS: Album[] = [
  { id: 'al1', title: 'Neon Drift', artist: 'Luna Waves', coverUrl: cover(200), year: 2024, songs: SONGS.filter(s => s.album === 'Neon Drift') },
  { id: 'al2', title: 'Pyaar Ka Safar', artist: 'Arijit Groove', coverUrl: cover(201), year: 2024, songs: SONGS.filter(s => s.album === 'Pyaar Ka Safar') },
  { id: 'al3', title: 'Idhayam', artist: 'Anirudh Nova', coverUrl: cover(202), year: 2023, songs: SONGS.filter(s => s.album === 'Idhayam') },
  { id: 'al4', title: 'Beats & Vibes', artist: 'Badshah Wave', coverUrl: cover(203), year: 2024, songs: SONGS.filter(s => s.album === 'Beats & Vibes') },
];

export const MOOD_PLAYLISTS = [
  { id: 'mood-chill', name: 'Chill Vibes', emoji: '🌙', color: '#2D4A5A', songs: SONGS.filter(s => s.mood.includes('Chill')) },
  { id: 'mood-workout', name: 'Workout', emoji: '💪', color: '#5A2D2D', songs: SONGS.filter(s => s.mood.includes('Workout')) },
  { id: 'mood-focus', name: 'Focus', emoji: '🎯', color: '#2D5A3D', songs: SONGS.filter(s => s.mood.includes('Focus')) },
  { id: 'mood-party', name: 'Party', emoji: '🎉', color: '#5A3A2D', songs: SONGS.filter(s => s.mood.includes('Party')) },
  { id: 'mood-romantic', name: 'Romantic', emoji: '❤️', color: '#5A2D4A', songs: SONGS.filter(s => s.mood.includes('Romantic')) },
  { id: 'mood-travel', name: 'Travel', emoji: '✈️', color: '#3A2D5A', songs: SONGS.filter(s => s.mood.includes('Travel')) },
  { id: 'mood-sleep', name: 'Sleep', emoji: '🌛', color: '#2D3A5A', songs: SONGS.filter(s => s.mood.includes('Sleep')) },
  { id: 'mood-happy', name: 'Happy', emoji: '😊', color: '#5A4A2D', songs: SONGS.filter(s => s.mood.includes('Happy')) },
];

export const LANGUAGE_SECTIONS = [
  { language: 'Tamil' as Language, emoji: '🎵', color: '#8B4513' },
  { language: 'English' as Language, emoji: '🎸', color: '#2C3E50' },
  { language: 'Hindi' as Language, emoji: '🎤', color: '#922B21' },
  { language: 'Malayalam' as Language, emoji: '🎶', color: '#1A5276' },
  { language: 'Telugu' as Language, emoji: '🎼', color: '#7D6608' },
  { language: 'Kannada' as Language, emoji: '🎹', color: '#1E8449' },
  { language: 'Punjabi' as Language, emoji: '🥁', color: '#6C3483' },
  { language: 'Bengali' as Language, emoji: '🎻', color: '#117A65' },
];

export function getSongsByLanguage(lang: Language): Song[] {
  return SONGS.filter(s => s.language === lang);
}

export function getTrendingSongs(): Song[] {
  return SONGS.filter(s => s.trending).sort((a, b) => b.plays - a.plays);
}

export function getNewReleases(): Song[] {
  return SONGS.filter(s => s.new).sort((a, b) => b.year - a.year);
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatPlays(plays: number): string {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
  if (plays >= 1000) return `${(plays / 1000).toFixed(0)}K`;
  return plays.toString();
}
