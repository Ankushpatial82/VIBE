import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Public Invidious instances — free YouTube audio proxy, full songs, no yt-dlp needed
const INVIDIOUS_INSTANCES = [
  'https://invidious.privacydev.net',
  'https://yt.cdaut.de',
  'https://inv.tux.pizza',
  'https://invidious.nerdvpn.de',
];

async function getYouTubeAudioUrl(query: string): Promise<string | null> {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      // Step 1: Search for the video
      const searchRes = await fetch(
        `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video&fields=videoId,title,lengthSeconds&limit=3`,
        { signal: AbortSignal.timeout(5000), cache: 'no-store' }
      );
      if (!searchRes.ok) continue;

      const results = await searchRes.json();
      if (!results || results.length === 0) continue;

      const videoId = results[0]?.videoId;
      if (!videoId) continue;

      // Step 2: Get audio stream URL (itag=140 = m4a 128kbps full quality)
      const streamUrl = `${instance}/latest_version?id=${videoId}&itag=140`;

      // Verify it's accessible
      const checkRes = await fetch(streamUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(4000),
        redirect: 'follow',
      });

      if (checkRes.ok || checkRes.status === 206) {
        return streamUrl;
      }
    } catch {
      // Try next instance
      continue;
    }
  }
  return null;
}

async function getItunesPreview(query: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5&media=music`,
      { cache: 'no-store', signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const track = (data.results || []).find((r: any) => r.previewUrl);
    return track?.previewUrl || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const searchQuery = searchParams.get('search');

  if (!url && !searchQuery) {
    return NextResponse.json({ error: 'url or search parameter required' }, { status: 400 });
  }

  // Direct URL passed
  if (url) {
    return NextResponse.redirect(url, 307);
  }

  // Try Invidious first (full songs)
  const youtubeUrl = await getYouTubeAudioUrl(searchQuery!);
  if (youtubeUrl) {
    return NextResponse.redirect(youtubeUrl, 307);
  }

  // Fallback: iTunes 30s preview
  const itunesUrl = await getItunesPreview(searchQuery!);
  if (itunesUrl) {
    return NextResponse.redirect(itunesUrl, 307);
  }

  return NextResponse.json({ error: 'No audio found' }, { status: 404 });
}
