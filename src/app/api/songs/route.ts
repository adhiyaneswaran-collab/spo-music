import { NextRequest, NextResponse } from 'next/server';
import { SONGS, getTrendingSongs, getNewReleases } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') ?? 'all';
  const lang = searchParams.get('language');

  let songs = SONGS;
  if (type === 'trending') songs = getTrendingSongs();
  else if (type === 'new') songs = getNewReleases();
  if (lang) songs = songs.filter(s => s.language === lang);

  return NextResponse.json({ songs });
}
