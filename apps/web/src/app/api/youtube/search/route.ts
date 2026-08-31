import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function searchInnerTube(query: string) {
  const res = await fetch('https://www.youtube.com/youtubei/v1/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
    body: JSON.stringify({
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: '2.20240101.00.00',
          hl: 'en',
          gl: 'IN',
        },
      },
      query,
    }),
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const data = await res.json();
  const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;

  if (contents && Array.isArray(contents)) {
    for (const section of contents) {
      const items = section?.itemSectionRenderer?.contents;
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const v = item?.videoRenderer;
          if (v && v.videoId) {
            const title = v.title?.runs?.[0]?.text || '';
            const lengthText = v.lengthText?.simpleText || '';
            let duration = 210;
            if (lengthText) {
              const parts = lengthText.split(':').map(Number);
              if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                duration = parts[0] * 60 + parts[1];
              } else if (parts.length === 3) {
                duration = parts[0] * 3600 + parts[1] * 60 + parts[2];
              }
            }
            return {
              videoId: v.videoId,
              title,
              duration,
              author: v.ownerText?.runs?.[0]?.text || v.shortBylineText?.runs?.[0]?.text || '',
              thumbnail: v.thumbnail?.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
            };
          }
        }
      }
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter q required' }, { status: 400 });
    }

    // 1. Try direct search query
    let result = await searchInnerTube(query);

    // 2. If not found, try appending "audio"
    if (!result && !query.toLowerCase().includes('audio')) {
      result = await searchInnerTube(`${query} audio`);
    }

    // 3. If still not found, try appending "song"
    if (!result && !query.toLowerCase().includes('song')) {
      result = await searchInnerTube(`${query} song`);
    }

    if (result) {
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'No video found' }, { status: 404 });
  } catch (err: any) {
    console.error('YouTube search error:', err);
    return NextResponse.json({ error: 'Search failed', message: err.message }, { status: 500 });
  }
}

