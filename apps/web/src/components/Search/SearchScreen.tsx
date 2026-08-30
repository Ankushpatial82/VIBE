'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search as SearchIcon, Play, Heart, Sparkles, X, Loader2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { MOCK_SONGS, MOCK_ARTISTS, MOCK_PLAYLISTS } from '../../data/mockData';
import { Song } from '../../types/music';

const GENRE_TAGS = ['All', 'Punjabi', 'Hindi', 'Bollywood', 'Pop', 'Electronic', 'Lo-Fi', 'Hip-Hop'];

export const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'songs' | 'artists' | 'playlists'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [liveSongs, setLiveSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { playSong, isLiked, toggleLike } = usePlayer();
  const { openArtistProfile } = useAuth();

  // Fetch Live Global Catalog results on query change
  useEffect(() => {
    if (!query.trim()) {
      setLiveSongs([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&limit=20`);
        if (res.ok) {
          const data = await res.json();
          if (data.tracks) {
            setLiveSongs(data.tracks);
          }
        }
      } catch (err) {
        console.error('Live search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Combine Mock Songs with Live Search results
  const displayedSongs = useMemo(() => {
    if (query.trim()) {
      return liveSongs;
    }
    return MOCK_SONGS.filter((s) => {
      const matchesGenre = selectedGenre === 'All' || s.genre.toLowerCase() === selectedGenre.toLowerCase() || s.language.toLowerCase() === selectedGenre.toLowerCase();
      return matchesGenre;
    });
  }, [query, liveSongs, selectedGenre]);

  const filteredArtists = useMemo(() => {
    return MOCK_ARTISTS.filter(
      (a) =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.genres.some((g) => g.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  const filteredPlaylists = useMemo(() => {
    return MOCK_PLAYLISTS.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-6 pb-32 pt-2 px-4 sm:px-8 max-w-7xl mx-auto w-full select-none">
      {/* Native Search Header Input */}
      <div className="relative w-full">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-4 w-5 h-5 text-purple-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ANY song, artist, Sidhu Moosewala, Arijit Singh, Ed Sheeran, Punjabi, Hindi..."
            className="w-full bg-[#11111a] border border-white/10 focus:border-purple-500/60 rounded-2xl py-3.5 pl-12 pr-10 text-white placeholder:text-slate-500 text-sm md:text-base outline-none shadow-xl transition-all"
            autoFocus
          />
          {isLoading ? (
            <Loader2 className="absolute right-3.5 w-5 h-5 text-purple-400 animate-spin" />
          ) : query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {GENRE_TAGS.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedGenre === genre
                ? 'vibe-gradient-primary text-white shadow-md'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Result Tabs */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-3">
        {(['all', 'songs', 'artists', 'playlists'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveType(tab)}
            className={`text-xs sm:text-sm font-bold capitalize transition-colors ${
              activeType === tab
                ? 'text-purple-400 border-b-2 border-purple-400 pb-3 -mb-3'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Results */}
      <div className="flex flex-col gap-8">
        {/* Songs List */}
        {(activeType === 'all' || activeType === 'songs') && displayedSongs.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {query ? 'Search Results' : 'Popular Tracks'} ({displayedSongs.length})
              </h3>
              {query && (
                <span className="text-xs text-purple-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> VIBE Global Catalog
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {displayedSongs.map((song) => {
                const liked = isLiked(song.id);
                return (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#11111a]/80 border border-white/5 hover:border-purple-500/30 hover:bg-[#161624] transition-all group"
                  >
                    <div
                      onClick={() => playSong(song, displayedSongs)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white truncate">{song.title}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {song.artistName} • {song.albumTitle || song.genre}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLike(song.id)}
                        className="p-2 text-slate-400 hover:text-pink-400"
                      >
                        <Heart className={`w-4 h-4 ${liked ? 'fill-pink-500 text-pink-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => playSong(song, displayedSongs)}
                        className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-500 hover:text-white"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Artists List */}
        {(activeType === 'all' || activeType === 'artists') && filteredArtists.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-white">Artists ({filteredArtists.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {filteredArtists.map((artist) => (
                <div
                  key={artist.id}
                  onClick={() => openArtistProfile(artist.id)}
                  className="p-4 rounded-2xl bg-[#11111a]/80 border border-white/10 hover:border-purple-500/30 hover:bg-[#161624] transition-all cursor-pointer group flex flex-col items-center text-center gap-3"
                >
                  <img
                    src={artist.avatarUrl}
                    alt={artist.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/30 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{artist.name}</h4>
                    <p className="text-xs text-purple-300">
                      {(artist.monthlyListeners / 1000000).toFixed(1)}M monthly listeners
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Playlists List */}
        {(activeType === 'all' || activeType === 'playlists') && filteredPlaylists.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-white">Playlists ({filteredPlaylists.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredPlaylists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => {
                    if (pl.tracks.length > 0) playSong(pl.tracks[0], pl.tracks);
                  }}
                  className="p-3.5 rounded-2xl bg-[#11111a]/80 border border-white/10 hover:border-purple-500/40 hover:bg-[#161624] transition-all cursor-pointer group flex flex-col gap-2"
                >
                  <img
                    src={pl.coverUrl}
                    alt={pl.title}
                    className="w-full aspect-square rounded-xl object-cover group-hover:scale-105 transition-transform"
                  />
                  <h4 className="text-sm font-bold text-white truncate">{pl.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{pl.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && displayedSongs.length === 0 && filteredArtists.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <SearchIcon className="w-12 h-12 text-slate-600" />
            <h4 className="text-lg font-bold text-slate-300">No results found</h4>
            <p className="text-sm text-slate-500 max-w-sm">
              Try searching for another artist, song, genre or mood tag.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
