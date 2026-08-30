'use client';

import React, { useState, useEffect } from 'react';
import { Globe2, TrendingUp, Play, Trophy, Loader2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { MOCK_SONGS, MOCK_ARTISTS } from '../../data/mockData';
import { Song } from '../../types/music';

const COUNTRIES = [
  { id: 'global', name: 'Global Charts', flag: '🌍', query: 'Top Global Hits' },
  { id: 'in', name: 'India Trending', flag: '🇮🇳', query: 'Top Indian Hits Sidhu Moosewala Arijit Karan Aujla' },
  { id: 'us', name: 'USA Billboard', flag: '🇺🇸', query: 'Top US Billboard Hits' },
  { id: 'uk', name: 'UK Top 40', flag: '🇬🇧', query: 'Top UK Hits' },
  { id: 'kr', name: 'K-Pop Top', flag: '🇰🇷', query: 'Top K-Pop BTS Blackpink' },
  { id: 'de', name: 'Germany', flag: '🇩🇪', query: 'Top Germany Hits' },
  { id: 'jp', name: 'Japan Top', flag: '🇯🇵', query: 'Top Japan Hits Anime' },
];

export const ExploreScreen: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState('global');
  const [countrySongs, setCountrySongs] = useState<Song[]>(MOCK_SONGS);
  const [isLoading, setIsLoading] = useState(false);

  const { playSong } = usePlayer();
  const { openArtistProfile } = useAuth();

  useEffect(() => {
    const selected = COUNTRIES.find((c) => c.id === selectedCountry);
    if (!selected) return;

    if (selectedCountry === 'global') {
      setCountrySongs(MOCK_SONGS);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/spotify/search?q=${encodeURIComponent(selected.query)}&limit=12`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.tracks && data.tracks.length > 0) {
          setCountrySongs(data.tracks);
        }
      })
      .catch((err) => console.error('Explore songs fetch error:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCountry]);

  return (
    <div className="flex flex-col gap-10 pb-32 pt-2 px-4 sm:px-8 max-w-7xl mx-auto w-full select-none">
      {/* Hero Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider">
          <Globe2 className="w-4 h-4" />
          <span>Global Music Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Explore Sounds of the World
        </h1>
        <p className="text-sm text-slate-400">
          Discover viral charts, regional sensations, and rising indie talent worldwide.
        </p>
      </div>

      {/* Country Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {COUNTRIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCountry(c.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
              selectedCountry === c.id
                ? 'vibe-gradient-primary text-white shadow-lg shadow-purple-900/40 scale-105'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{c.flag}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Top Chart Showcase */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              {COUNTRIES.find((c) => c.id === selectedCountry)?.name || 'Top'} Viral Charts
            </h3>
          </div>
          {isLoading ? (
            <div className="flex items-center gap-1.5 text-xs text-purple-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Updating live...</span>
            </div>
          ) : (
            <span className="text-xs text-purple-400 font-semibold">Live stream ready</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {countrySongs.map((song, idx) => (
            <div
              key={song.id}
              onClick={() => playSong(song, countrySongs)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#11111a]/80 border border-white/5 hover:border-purple-500/30 hover:bg-[#161624] transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className={`text-sm font-black w-6 text-center ${idx < 3 ? 'text-amber-400 text-base' : 'text-slate-500'}`}>
                  #{idx + 1}
                </span>
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{song.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{song.artistName} • {song.genre || 'Global'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">
                  {song.genre || 'Hits'}
                </span>
                <button className="p-2 rounded-xl bg-purple-500/20 text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rising Artists Globally */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">Featured Global Icons</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {MOCK_ARTISTS.map((artist) => (
            <div
              key={artist.id}
              onClick={() => openArtistProfile(artist.id)}
              className="p-4 rounded-2xl bg-[#11111a]/80 border border-white/10 hover:border-purple-500/40 hover:bg-[#161624] transition-all flex flex-col items-center text-center gap-3 cursor-pointer group shadow-lg"
            >
              <img
                src={artist.avatarUrl}
                alt={artist.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/30 group-hover:scale-105 transition-transform shadow-md"
              />
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate w-28">
                  {artist.name}
                </h4>
                <p className="text-[11px] text-purple-400 font-semibold mt-0.5">
                  {(artist.monthlyListeners / 1000000).toFixed(1)}M listeners
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
