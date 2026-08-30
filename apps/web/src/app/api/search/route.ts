import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'arijit singh';
  const limit = parseInt(searchParams.get('limit') || '20');
  const lang = searchParams.get('lang') || '';

  try {
    const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&q=${encodeURIComponent(query)}&p=1&n=${limit}&_format=json&_marker=0`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': 'https://www.jiosaavn.com/',
      },
      ...({ next: { revalidate: 300 } } as any)
    });

    if (!response.ok) {
      throw new Error(`JioSaavn API error: ${response.status}`);
    }

    const data = await response.json();
    const rawSongs = data.results || [];

    const filteredSongs = lang 
      ? rawSongs.filter((s: any) => s.language?.toLowerCase() === lang.toLowerCase())
      : rawSongs;

    const songs = filteredSongs.slice(0, limit).map((s: any) => {
      const imageUrl = (s.image || '')
        .replace('150x150', '500x500')
        .replace('http://', 'https://');

      const previewUrl = (s.media_preview_url || '').replace('http://', 'https://');
      const vlink = (s.vlink || '').replace('http://', 'https://');

      return {
        id: s.id,
        title: s.song || s.title || '',
        artistName: s.primary_artists || s.singers || s.music || '',
        artistImage: imageUrl,
        coverUrl: imageUrl,
        audioUrl: vlink || previewUrl,
        previewUrl: previewUrl,
        duration: parseInt(s.duration || '180'),
        genre: s.language === 'hindi' ? 'Bollywood' : s.language === 'punjabi' ? 'Punjabi' : 'Pop',
        language: s.language === 'hindi' ? 'Hindi' : s.language === 'punjabi' ? 'Punjabi' : 'English',
        country: (s.language === 'hindi' || s.language === 'punjabi') ? 'India' : 'USA',
        year: parseInt(s.year || '2024'),
        plays: parseInt(s.play_count || '0'),
        likes: Math.floor(parseInt(s.play_count || '0') * 0.08),
        albumTitle: s.album || '',
        moods: [],
        isFromAPI: true,
      };
    });

    return NextResponse.json({ songs, total: songs.length, query });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ songs: [], total: 0, query, error: String(error) }, { status: 500 });
  }
}
