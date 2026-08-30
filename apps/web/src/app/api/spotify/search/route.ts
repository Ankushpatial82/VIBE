import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '15', 10);

    if (!query || query.trim() === '') {
      return NextResponse.json({ tracks: [], artists: [], total: 0 });
    }

    // Try Spotify Web API first if credentials configured
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (clientId && clientSecret) {
      try {
        const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Authorization': `Basic ${authHeader}`, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ grant_type: 'client_credentials' }),
          cache: 'no-store',
        });

        if (tokenRes.ok) {
          const { access_token } = await tokenRes.json();
          const searchRes = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist&limit=${limit}&market=IN`,
            { headers: { 'Authorization': `Bearer ${access_token}` }, cache: 'no-store' }
          );

          if (searchRes.ok) {
            const data = await searchRes.json();
            const tracks = (data.tracks?.items || []).map((item: any) => {
              const artists = item.artists.map((a: any) => a.name).join(', ');
              const coverUrl = item.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80';
              return {
                id: `spotify-${item.id}`,
                title: item.name,
                artistName: artists,
                artistImage: coverUrl,
                albumTitle: item.album?.name || '',
                coverUrl,
                audioUrl: item.preview_url || `/api/audio?search=${encodeURIComponent(`${item.name} ${artists}`)}`,
                duration: Math.round(item.duration_ms / 1000),
                genre: 'Popular', language: 'Global',
                year: item.album?.release_date ? parseInt(item.album.release_date.split('-')[0]) : 2026,
                plays: Math.floor(Math.random() * 50000000) + 1000000,
                likes: Math.floor(Math.random() * 5000000) + 100000,
              };
            });
            return NextResponse.json({ tracks, total: tracks.length });
          }
        }
      } catch (err) {
        console.warn('Spotify API fallback:', err);
      }
    }

    // iTunes Search API — free, no API key, works on Vercel, returns 30s preview URLs
    const itunesRes = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}`,
      { cache: 'no-store' }
    );

    if (itunesRes.ok) {
      const itunesData = await itunesRes.json();
      if (itunesData.results?.length > 0) {
        const tracks = itunesData.results.map((item: any) => {
          const cover = item.artworkUrl100?.replace('100x100bb', '600x600bb') || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80';
          return {
            id: `track-${item.trackId}`,
            title: item.trackName,
            artistId: `art-${item.artistId || 'generic'}`,
            artistName: item.artistName,
            artistImage: cover,
            albumTitle: item.collectionName || '',
            coverUrl: cover,
            audioUrl: item.previewUrl || `/api/audio?search=${encodeURIComponent(`${item.trackName} ${item.artistName}`)}`,
            duration: Math.round(item.trackTimeMillis / 1000),
            genre: item.primaryGenreName || 'Pop',
            language: item.country === 'IND' ? 'Hindi/Punjabi' : 'English',
            country: item.country || 'Global',
            year: item.releaseDate ? parseInt(item.releaseDate.split('-')[0]) : 2026,
            plays: Math.floor(Math.random() * 80000000) + 5000000,
            likes: Math.floor(Math.random() * 8000000) + 400000,
          };
        });
        return NextResponse.json({ tracks, total: tracks.length });
      }
    }

    return NextResponse.json({ tracks: [], total: 0 });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed', message: error.message }, { status: 500 });
  }
}
