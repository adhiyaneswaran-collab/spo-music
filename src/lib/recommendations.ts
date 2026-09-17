import type { UserPreference, Song, Language, Genre, Mood } from '@/types';
import { SONGS } from './mockData';

const DEFAULT_BLEND = { personalized: 0.6, similar: 0.2, trending: 0.1, discovery: 0.1 };

export function computeRecommendations(
  preferences: UserPreference,
  likedSongs: Song[],
  recentSongs: Song[],
  allSongs: Song[] = SONGS,
  limit = 20,
): Song[] {
  const likedIds = new Set(likedSongs.map(s => s.id));
  const recentIds = new Set(recentSongs.map(s => s.id));

  // Score every song
  const scored = allSongs.map(song => {
    let score = 0;

    // Language preference
    const langScore = preferences.languages[song.language] ?? 0;
    score += langScore * 2;

    // Genre preference
    const genreScore = preferences.genres[song.genre] ?? 0;
    score += genreScore * 1.5;

    // Mood preference
    const moodScore = song.mood.reduce((sum, m) => sum + (preferences.moods[m] ?? 0), 0);
    score += moodScore;

    // Artist preference
    const artistScore = preferences.artists[song.artist] ?? 0;
    score += artistScore * 3;

    // Trending boost
    if (song.trending) score += 5;

    // New release boost
    if (song.new) score += 3;

    // Play count as popularity signal
    score += Math.log10(song.plays + 1) * 0.5;

    // Penalize already liked (we have those) — show different songs
    if (likedIds.has(song.id)) score -= 2;

    // Penalize very recently played
    if (recentIds.has(song.id)) score -= 1;

    return { song, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.song);
}

export function getSimilarSongs(song: Song, allSongs: Song[] = SONGS, limit = 6): Song[] {
  return allSongs
    .filter(s => s.id !== song.id)
    .map(s => {
      let similarity = 0;
      if (s.language === song.language) similarity += 3;
      if (s.genre === song.genre) similarity += 2;
      if (s.artist === song.artist) similarity += 5;
      const moodOverlap = s.mood.filter(m => song.mood.includes(m)).length;
      similarity += moodOverlap;
      return { song: s, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(s => s.song);
}

export function updatePreferencesFromPlay(
  prefs: UserPreference,
  song: Song,
  completed: boolean,
  skipped: boolean,
): UserPreference {
  const weight = skipped ? -0.5 : completed ? 1.5 : 1;

  return {
    ...prefs,
    totalPlays: prefs.totalPlays + 1,
    languages: {
      ...prefs.languages,
      [song.language]: (prefs.languages[song.language] ?? 0) + weight,
    },
    genres: {
      ...prefs.genres,
      [song.genre]: (prefs.genres[song.genre] ?? 0) + weight,
    },
    moods: {
      ...prefs.moods,
      ...Object.fromEntries(song.mood.map(m => [m, (prefs.moods[m] ?? 0) + weight])),
    },
    artists: {
      ...prefs.artists,
      [song.artist]: (prefs.artists[song.artist] ?? 0) + weight,
    },
  };
}

export function getTopLanguages(prefs: UserPreference): Language[] {
  return (Object.entries(prefs.languages) as [Language, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang);
}

export function getTopGenres(prefs: UserPreference): Genre[] {
  return (Object.entries(prefs.genres) as [Genre, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([g]) => g);
}

export function getVibeLabel(prefs: UserPreference): string {
  const topMoods = (Object.entries(prefs.moods) as [Mood, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([m]) => m);

  if (topMoods.includes('Romantic') && topMoods.includes('Sad')) return 'The Dreamer';
  if (topMoods.includes('Energetic') && topMoods.includes('Party')) return 'The Party Starter';
  if (topMoods.includes('Chill') && topMoods.includes('Focus')) return 'The Deep Thinker';
  if (topMoods.includes('Happy') && topMoods.includes('Travel')) return 'The Wanderer';
  if (topMoods.includes('Workout')) return 'The Grinder';
  return 'The Explorer';
}
