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

    return NextResponse.json({ error: 'No video found' }, { status: 404 });
  } catch (err: any) {
    console.error('YouTube search error:', err);
    return NextResponse.json({ error: 'Search failed', message: err.message }, { status: 500 });
  }
}
