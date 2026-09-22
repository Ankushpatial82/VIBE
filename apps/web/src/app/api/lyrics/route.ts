import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface LyricLine {
  time: number;
  text: string;
}

function parseLrc(lrc: string): LyricLine[] {
  const lines = lrc.split('\n');
  const result: LyricLine[] = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    const match = trimmed.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const millis = parseInt(match[3].padEnd(3, '0').slice(0, 3), 10);
      const timeInSec = minutes * 60 + seconds + millis / 1000;
      const text = match[4].trim();

      if (text) {
        result.push({ time: Math.round(timeInSec * 10) / 10, text });
      }
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || '';
    const artist = searchParams.get('artist') || '';

    if (!title) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 });
    }

    // Clean title and artist
    const cleanTitle = title.replace(/\(.*?\)|\[.*?\]|Official|Video|Audio|Music/gi, '').trim();
    const cleanArtist = artist.split(',')[0].split('&')[0].trim();

    // 1. Direct match
    let url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTitle)}&artist_name=${encodeURIComponent(cleanArtist)}`;
    let res = await fetch(url, {
      headers: { 'User-Agent': 'VIBE-Music-App (https://vibe.app)' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(({ next: { revalidate: 3600 } }) as any),
    } as RequestInit);

    if (res.ok) {
      const data = await res.json();
      if (data.syncedLyrics) {
        const parsed = parseLrc(data.syncedLyrics);
        if (parsed.length > 0) {
          return NextResponse.json({ lyrics: parsed, source: 'lrclib' });
        }
      }
    }

    // 2. Search fallback
    const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(`${cleanTitle} ${cleanArtist}`)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'VIBE-Music-App (https://vibe.app)' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(({ next: { revalidate: 3600 } }) as any),
    } as RequestInit);

    if (searchRes.ok) {
      const results = await searchRes.json();
      if (Array.isArray(results) && results.length > 0) {
        const match = results.find((r: any) => r.syncedLyrics);
        if (match?.syncedLyrics) {
          const parsed = parseLrc(match.syncedLyrics);
          if (parsed.length > 0) {
            return NextResponse.json({ lyrics: parsed, source: 'lrclib_search' });
          }
        }
      }
    }

    return NextResponse.json({ lyrics: [], message: 'No synced lyrics found' });
  } catch (err: any) {
    console.error('Lyrics fetch exception:', err);
    return NextResponse.json({ lyrics: [], error: err.message }, { status: 500 });
  }
}
