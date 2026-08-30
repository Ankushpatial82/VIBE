'use client';

import { useEffect } from 'react';

export default function SpotifyCallbackPage() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const token = params.get('access_token');
      if (token && window.opener) {
        window.opener.postMessage({ type: 'SPOTIFY_AUTH_SUCCESS', token }, '*');
        window.close();
      }
    }
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#08080c', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Connecting to Spotify...</h2>
        <p style={{ color: '#a1a1aa' }}>Authenticating your session with VIBE.</p>
      </div>
    </div>
  );
}
