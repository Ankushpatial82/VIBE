'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Heart, Check, UserPlus, Globe, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import { MOCK_ARTISTS, MOCK_SONGS } from '../../data/mockData';
import { Song } from '../../types/music';

export const ArtistView: React.FC = () => {
  const { selectedArtistId, closeArtistProfile, toggleFollowUser, isFollowingUser } = useAuth();
  const { playSong, isLiked, toggleLike } = usePlayer();

  const [liveArtistSongs, setLiveArtistSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const artist = MOCK_ARTISTS.find((a) => a.id === selectedArtistId) || {
    id: selectedArtistId || 'art-generic',
    name: selectedArtistId?.startsWith('art-') ? selectedArtistId.replace('art-', '') : (selectedArtistId || 'Featured Artist'),
    bio: 'Renowned musical visionary delivering chart-topping anthems worldwide.',
    avatarUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    headerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    monthlyListeners: 14500000,
    followers: 8200000,
    genres: ['Global', 'Pop', 'Hip-Hop'],
    isVerified: true,
    topCountries: [
      { country: 'India', flag: '🇮🇳', listeners: 8200000 },
      { country: 'Canada', flag: '🇨🇦', listeners: 2400000 },
      { country: 'United Kingdom', flag: '🇬🇧', listeners: 1800000 },
      { country: 'United States', flag: '🇺🇸', listeners: 1100000 },
    ],
  };

  const isFollowing = isFollowingUser(artist.id);

  // Fetch live tracks for this artist from global live music catalog
  useEffect(() => {
    if (!artist.name) return;

    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/spotify/search?q=${encodeURIComponent(artist.name)}&limit=15`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.tracks && data.tracks.length > 0) {
          setLiveArtistSongs(data.tracks);
        } else if (isMounted) {
          const fallback = MOCK_SONGS.filter((s) => s.artistId === artist.id || s.artistName.toLowerCase().includes(artist.name.toLowerCase()));
          setLiveArtistSongs(fallback.length > 0 ? fallback : MOCK_SONGS);
        }
      })
      .catch((err) => {
        console.error('Artist songs load error:', err);
        if (isMounted) {
          const fallback = MOCK_SONGS.filter((s) => s.artistId === artist.id || s.artistName.toLowerCase().includes(artist.name.toLowerCase()));
          setLiveArtistSongs(fallback.length > 0 ? fallback : MOCK_SONGS);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [artist.name]);

  const displayedSongs = liveArtistSongs.length > 0 ? liveArtistSongs : MOCK_SONGS;

  return (
    <div className="flex flex-col gap-8 pb-32 pt-2 px-4 sm:px-8 max-w-7xl mx-auto w-full select-none">
      {/* Back Button */}
      <button
        onClick={closeArtistProfile}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold w-fit border border-white/10 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discovery</span>
      </button>

      {/* Hero Banner with Header Photo */}
      <div className="relative overflow-hidden rounded-3xl bg-[#11111a] border border-white/10 h-72 sm:h-96 flex flex-col justify-end p-6 sm:p-10 shadow-2xl">
        <img
          src={artist.headerUrl}
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/60 to-transparent" />

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
              Verified Artist
            </span>
            <span className="text-xs text-slate-300">
              {(artist.monthlyListeners / 1000000).toFixed(1)}M Monthly Listeners
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            {artist.name}
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">{artist.bio}</p>

          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => {
                if (displayedSongs.length > 0) playSong(displayedSongs[0], displayedSongs);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl vibe-gradient-primary text-white text-sm font-bold shadow-lg shadow-purple-900/50 hover:scale-105 transition-transform"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play Popular</span>
            </button>

            <button
              onClick={() => toggleFollowUser(artist.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold border transition-all ${
                isFollowing
                  ? 'bg-white/10 border-white/20 text-slate-200'
                  : 'bg-purple-600/30 border-purple-500/50 text-purple-200 hover:bg-purple-600/40'
              }`}
            >
              {isFollowing ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{isFollowing ? 'Following' : 'Follow'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Popular Tracks */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Popular Releases & Live Catalog</h3>
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-purple-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Loading discography...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {displayedSongs.map((song, idx) => {
            const liked = isLiked(song.id);
            return (
              <div
                key={song.id}
                onClick={() => playSong(song, displayedSongs)}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#11111a]/80 border border-white/5 hover:border-purple-500/30 hover:bg-[#161624] transition-all cursor-pointer group shadow-md"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-xs font-mono text-slate-500 w-4 text-center">{idx + 1}</span>
                  <img src={song.coverUrl} alt={song.title} className="w-11 h-11 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{song.title}</p>
                    <p className="text-xs text-slate-400 truncate">{song.artistName} • {(song.plays / 1000000).toFixed(1)}M plays</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(song.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-pink-400"
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-pink-500 text-pink-500' : ''}`} />
                  </button>
                  <Play className="w-4 h-4 text-purple-400 fill-current opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Countries Where Fans Listen */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-bold text-white">Top Listener Locations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {artist.topCountries.map((c) => (
            <div
              key={c.country}
              className="p-4 rounded-2xl bg-[#11111a]/80 border border-white/10 flex flex-col gap-1"
            >
              <span className="text-2xl">{c.flag}</span>
              <h4 className="text-sm font-bold text-white mt-1">{c.country}</h4>
              <p className="text-xs text-purple-300 font-semibold">
                {(c.listeners / 1000000).toFixed(1)}M listeners
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
