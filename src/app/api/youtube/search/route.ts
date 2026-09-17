import { NextRequest, NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export interface YouTubeVideo {
  videoId: string;
  title: string;
  channel: string;
  thumbnail: string;
  thumbnailHigh: string;
  duration: string;      // ISO 8601 e.g. "PT3M45S" (fake it or map from seconds)
  durationSec: number;
  viewCount: string;
  publishedAt: string;
  isLive: boolean;
}

function formatDurationISO(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `PT${h > 0 ? h + 'H' : ''}${m > 0 ? m + 'M' : ''}${s}S`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  // We can ignore maxResults because yt-search returns a fixed amount of results (around 20-30)

  if (!q || !q.trim()) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  try {
    // Search YouTube via scraping (no API key required)
    const result = await ytSearch(q);
    const videos: YouTubeVideo[] = result.videos.map((v: any) => ({
      videoId: v.videoId,
      title: v.title,
      channel: v.author.name,
      thumbnail: v.thumbnail,
      thumbnailHigh: v.thumbnail, // yt-search thumbnail is usually good quality
      duration: formatDurationISO(v.duration.seconds),
      durationSec: v.duration.seconds,
      viewCount: v.views.toString(),
      publishedAt: v.ago,
      isLive: false,
    }));

    return NextResponse.json({ videos, total: videos.length });
  } catch (err: any) {
    console.error('YouTube search error:', err);
    return NextResponse.json({ error: 'YouTube search failed: ' + err.message }, { status: 500 });
  }
}
