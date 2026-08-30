'use client';

import React, { useState, useEffect } from 'react';
import { Play, Heart, Sparkles, Flame, Radio, Compass, Loader2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { MOCK_SONGS, MOCK_PLAYLISTS, MOCK_ARTISTS } from '../../data/mockData';
import { MoodType, Song } from '../../types/music';

const QUICK_MOODS: { mood: MoodType; emoji: string; color: string; query: string }[] = [
  { mood: 'Chill', emoji: '☕', color: 'from-blue-600/30 to-indigo-600/30', query: 'Top Chill Lo-Fi Acoustic' },
  { mood: 'Energy', emoji: '⚡', color: 'from-amber-600/30 to-red-600/30', query: 'Top Punjabi Energy Bangers Sidhu Moosewala Karan Aujla' },
  { mood: 'Night', emoji: '🌙', color: 'from-purple-900/40 to-indigo-900/40', query: 'Late Night Synthwave The Weeknd' },
  { mood: 'Focus', emoji: '🎧', color: 'from-emerald-600/30 to-teal-600/30', query: 'Deep Focus Coding Ambient' },
  { mood: 'Workout', emoji: '🔥', color: 'from-orange-600/30 to-rose-600/30', query: 'Gym Workout High BPM Trap' },
  { mood: 'Sad', emoji: '🌧️', color: 'from-slate-700/40 to-blue-900/40', query: 'Melancholy Soft Acoustic Ballad' },
  { mood: 'Romantic', emoji: '💖', color: 'from-pink-600/30 to-purple-600/30', query: 'Top Bollywood Romantic Hits Arijit Singh' },
  { mood: 'Party', emoji: '🎉', color: 'from-fuchsia-600/30 to-pink-600/30', query: 'Top Party Dance Pop Hits Dua Lipa' },
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80';

export const HomeScreen: React.FC = () => {
  const { playSong, currentSong, isPlaying, toggleLike, isLiked } = usePlayer();
  const { user, selectedMood, setSelectedMood, openArtistProfile } = useAuth();
  
  const [liveTrendingSongs, setLiveTrendingSongs] = useState<Song[]>(MOCK_SONGS);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);

  // Dynamic live songs query based on selected mood
  useEffect(() => {
    if (!selectedMood) {
      setLiveTrendingSongs(MOCK_SONGS);
      return;
    }

    const moodObj = QUICK_MOODS.find((m) => m.mood === selectedMood);
    if (!moodObj) return;

    let isMounted = true;
    setIsLoadingTrending(true);

    fetch(`/api/spotify/search?q=${encodeURIComponent(moodObj.query)}&limit=16`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.tracks && data.tracks.length > 0) {
          setLiveTrendingSongs(data.tracks);
        } else if (isMounted) {
          setLiveTrendingSongs(MOCK_SONGS.filter((s) => s.moods.includes(selectedMood)));
        }
      })
      .catch((err) => {
        console.error('Trending fetch error:', err);
        if (isMounted) {
          setLiveTrendingSongs(MOCK_SONGS.filter((s) => s.moods.includes(selectedMood)));
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingTrending(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedMood]);

  // Greeting based on hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const spotlightSong = MOCK_SONGS[0];

  return (
    <div className="flex flex-col gap-10 pb-32 pt-2 px-4 sm:px-8 max-w-7xl mx-auto w-full select-none">
      {/* Top Hero Banner & Dynamic Greeting */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Welcome back
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {getGreeting()}, <span className="vibe-gradient-text">{user.name.split(' ')[0]}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Taste Profile:</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {user.musicPersonality}
            </span>
          </div>
        </div>

        {/* Quick Mood Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedMood(null)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              selectedMood === null
                ? 'vibe-gradient-primary text-white shadow-md shadow-purple-900/40'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            All Vibes
          </button>
          {QUICK_MOODS.map((item) => {
            const active = selectedMood === item.mood;
            return (
              <button
                key={item.mood}
                onClick={() => setSelectedMood(active ? null : item.mood)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                  active
                    ? 'vibe-gradient-primary text-white shadow-md shadow-purple-900/40 scale-105'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.mood}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Release Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-black border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="relative z-10 flex flex-col gap-3 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider w-fit">
            <Flame className="w-3.5 h-3.5 text-pink-400" />
            <span>Featured Spotlight</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {spotlightSong.title}
          </h2>
          <p className="text-sm text-slate-300">
            By <span className="font-semibold text-purple-300">{spotlightSong.artistName}</span> • Chart-topping anthem streaming full length live on VIBE.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => playSong(spotlightSong, MOCK_SONGS)}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl vibe-gradient-primary text-white text-sm font-bold shadow-lg shadow-purple-900/50 hover:scale-105 active:scale-95 transition-transform"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Listen Now</span>
            </button>

            <button
              onClick={() => openArtistProfile(spotlightSong.artistId)}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
            >
              View Artist
            </button>
          </div>
        </div>

        <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl shadow-purple-950/80 border border-white/15 shrink-0 group">
          <img
            src={spotlightSong.coverUrl}
            alt={spotlightSong.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Made For You (Curated Playlists) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">Made For You</h3>
          </div>
          <span className="text-xs text-slate-400">Curated daily</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_PLAYLISTS.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => {
                if (playlist.tracks.length > 0) playSong(playlist.tracks[0], playlist.tracks);
              }}
              className="p-3.5 rounded-2xl bg-[#11111a]/80 border border-white/10 hover:border-purple-500/40 hover:bg-[#161624] transition-all cursor-pointer group flex flex-col gap-3 shadow-lg"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full vibe-gradient-primary flex items-center justify-center text-white opacity-0 group-hover:opacity-100 shadow-xl transition-all hover:scale-110">
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white truncate">{playlist.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{playlist.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Worldwide Real-Time Tracks */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              {selectedMood ? `${selectedMood} Vibes` : 'Trending Worldwide'}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold">
            {isLoadingTrending ? (
              <div className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Loading real-time hits...</span>
              </div>
            ) : (
              <span>{liveTrendingSongs.length} tracks</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {liveTrendingSongs.map((song, idx) => {
            const isCurrent = currentSong?.id === song.id;
            const liked = isLiked(song.id);

            return (
              <div
                key={`${song.id}-${idx}`}
                className={`flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer group shadow-sm ${
                  isCurrent
                    ? 'bg-purple-600/20 border border-purple-500/40 shadow-lg shadow-purple-950/30'
                    : 'bg-[#11111a]/80 border border-white/5 hover:bg-[#161624] hover:border-purple-500/30'
                }`}
              >
                <div
                  onClick={() => playSong(song, liveTrendingSongs)}
                  className="flex items-center gap-3 min-w-0 flex-1"
                >
                  <span className="text-xs font-mono text-slate-500 w-4 text-center">
                    {idx + 1}
                  </span>
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                    {isCurrent && isPlaying && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="flex items-end gap-0.5 h-3">
                          <div className="w-0.5 bg-purple-400 rounded wave-bar-1" />
                          <div className="w-0.5 bg-pink-400 rounded wave-bar-2" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{song.title}</span>
                    <span className="text-xs text-slate-400 truncate">{song.artistName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                    {(song.plays / 1000000).toFixed(1)}M
                  </span>

                  <button
                    onClick={() => toggleLike(song.id)}
                    className="p-2 text-slate-400 hover:text-pink-400 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-pink-500 text-pink-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => playSong(song, liveTrendingSongs)}
                    className="p-2 rounded-xl bg-purple-500/20 text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Verified Artists */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">Recommended Artists</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {MOCK_ARTISTS.map((artist) => (
            <div
              key={artist.id}
              onClick={() => openArtistProfile(artist.id)}
              className="p-4 rounded-2xl bg-[#11111a]/80 border border-white/10 hover:border-purple-500/40 hover:bg-[#161624] transition-all cursor-pointer group flex flex-col items-center text-center gap-3 shadow-md"
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500/30 group-hover:border-purple-400 group-hover:scale-105 transition-all shadow-lg">
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="text-sm font-bold text-white truncate w-28 group-hover:text-purple-300 transition-colors">
                  {artist.name}
                </h4>
                <p className="text-[11px] text-purple-300/80 mt-0.5">
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
