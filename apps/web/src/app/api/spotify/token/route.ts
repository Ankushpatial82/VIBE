import { NextResponse } from 'next/server';

// Default demo Spotify client credentials (or read from process.env)
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'f0fa2d057a6245e396d13054178553bf';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '0c644f0b09654d0092f39ed9fec0e4b8';

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function GET() {
  try {
    const now = Date.now();
    if (cachedToken && now < tokenExpiresAt) {
      return NextResponse.json({ access_token: cachedToken, expires_in: Math.floor((tokenExpiresAt - now) / 1000) });
    }

    // Request new client credentials token from Spotify
    const authHeader = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
    
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Spotify token fetch error:', errorText);
      return NextResponse.json({ error: 'Failed to obtain Spotify token', details: errorText }, { status: res.status });
    }

    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in - 60) * 1000;

    return NextResponse.json({ access_token: cachedToken, expires_in: data.expires_in });
  } catch (error: any) {
    console.error('Spotify token route exception:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
