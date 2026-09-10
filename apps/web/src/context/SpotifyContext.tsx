'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  product: 'premium' | 'free' | string;
  images: { url: string }[];
}

interface SpotifyContextType {
  isSpotifyConnected: boolean;
  spotifyUser: SpotifyUser | null;
  spotifyToken: string | null;
  connectSpotify: () => void;
  disconnectSpotify: () => void;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  playSpotifyUri: (uri: string) => Promise<boolean>;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'f0fa2d057a6245e396d13054178553bf';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/spotify-callback` : 'http://localhost:3000/spotify-callback';

export const SpotifyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // Initialise Spotify token and user lazily from localStorage
  const [spotifyToken, setSpotifyToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('vibe_spotify_token');
    }
    return null;
  });
  const [spotifyUser, setSpotifyUser] = useState<SpotifyUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vibe_spotify_user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const connectSpotify = () => {
    const scopes = [
      'streaming',
      'user-read-email',
      'user-read-private',
      'user-modify-playback-state',
      'user-read-playback-state',
      'user-read-currently-playing',
      'playlist-read-private',
      'user-library-read',
    ].join(' ');

    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    
    // Open OAuth popup
    const width = 450;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authUrl,
      'Spotify Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SPOTIFY_AUTH_SUCCESS') {
        const token = event.data.token;
        setSpotifyToken(token);
        localStorage.setItem('vibe_spotify_token', token);
        fetchSpotifyProfile(token);
        setModalOpen(false);
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
  };

  const fetchSpotifyProfile = async (token: string) => {
    try {
      const res = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSpotifyUser(data);
        localStorage.setItem('vibe_spotify_user', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Failed to fetch Spotify user profile:', err);
    }
  };

  const disconnectSpotify = () => {
    setSpotifyToken(null);
    setSpotifyUser(null);
    localStorage.removeItem('vibe_spotify_token');
    localStorage.removeItem('vibe_spotify_user');
  };

  const playSpotifyUri = async (uri: string): Promise<boolean> => {
    if (!spotifyToken) return false;
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: [uri] }),
      });
      return res.ok;
    } catch (err) {
      console.error('Error playing Spotify URI:', err);
      return false;
    }
  };

  return (
    <SpotifyContext.Provider
      value={{
        isSpotifyConnected: !!spotifyToken,
        spotifyUser,
        spotifyToken,
        connectSpotify,
        disconnectSpotify,
        isModalOpen,
        setModalOpen,
        playSpotifyUri,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};
