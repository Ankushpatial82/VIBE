import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import ytSearch from 'yt-search';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter q required' }, { status: 400 });
    }

    // Try ytSearch first
    try {
      const r = await ytSearch(query);
      if (r && r.videos && r.videos.length > 0) {
        const video = r.videos[0];
        return NextResponse.json({
          videoId: video.videoId,
          title: video.title,
          duration: video.seconds,
          author: video.author?.name,
          thumbnail: video.thumbnail,
        });
      }
    } catch (err) {
      console.warn('ytSearch failed, falling back to alternatives...', err);
    }

    // Fallback 1: Piped API
    try {
      const res = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=all`);
      if (res.ok) {
        const data = await res.json();
        const video = data.items?.find((item: any) => item.type === 'stream');
        if (video) {
          return NextResponse.json({
            videoId: video.url.split('?v=')[1] || video.url.split('/watch?v=')[1],
            title: video.title,
            duration: video.duration,
            author: video.uploaderName,
            thumbnail: video.thumbnail,
          });
        }
      }
    } catch (err) {
      console.warn('Piped API fallback failed...', err);
    }

    // Fallback 2: Invidious API
    try {
      const res = await fetch(`https://invidious.nerdvpn.de/api/v1/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        const video = data.find((item: any) => item.type === 'video');
        if (video) {
          return NextResponse.json({
            videoId: video.videoId,
            title: video.title,
            duration: video.lengthSeconds,
            author: video.author,
            thumbnail: video.videoThumbnails?.[0]?.url,
          });
        }
      }
    } catch (err) {
      console.warn('Invidious API fallback failed...', err);
    }

    return NextResponse.json({ error: 'No video found across all providers' }, { status: 404 });
  } catch (err: any) {
    console.error('YouTube search error:', err);
    return NextResponse.json({ error: 'Search failed', message: err.message }, { status: 500 });
  }
}

