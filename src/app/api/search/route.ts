import { NextRequest, NextResponse } from 'next/server';
import { SONGS } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() ?? '';
  const lang = searchParams.get('language');
  const genre = searchParams.get('genre');
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);

  let results = SONGS;
  if (q) results = results.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.artist.toLowerCase().includes(q) ||
    s.album.toLowerCase().includes(q)
  );
  if (lang) results = results.filter(s => s.language === lang);
  if (genre) results = results.filter(s => s.genre === genre);

  return NextResponse.json({ songs: results.slice(0, limit), total: results.length });
}
