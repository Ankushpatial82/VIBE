'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import { Settings, Share2, Sparkles, Heart, Play, Crown, Flame, Edit3, Music2, Clock, Check, Radio } from 'lucide-react';
import { MOCK_SONGS, MOCK_ARTISTS, MOCK_PLAYLISTS } from '../../data/mockData';

export const UserProfileView: React.FC = () => {
  const { user, setSettingsOpen, setWrappedOpen, openArtistProfile, setEditProfileOpen } = useAuth();
  const { playSong, likedSongIds, history, currentSong } = usePlayer();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin + `/@${user.username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const recentTracks = history.length > 0 ? history : MOCK_SONGS.slice(0, 5);

  return (
    <div className="flex flex-col gap-10 pb-32 pt-2 px-4 sm:px-8 max-w-7xl mx-auto w-full select-none">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#11111a] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-2xl">
        {/* Banner Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/30 via-indigo-950/20 to-black pointer-events-none" />

        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-purple-500/40 shrink-0 shadow-xl shadow-purple-950/60 group">
          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <button
            onClick={() => setEditProfileOpen(true)}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1"
          >
            <Edit3 className="w-4 h-4" />
            <span>Change</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-3 relative z-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{user.name}</h1>
            {user.isPremium && (
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>PREMIUM</span>
              </span>
            )}
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              {user.musicPersonality}
            </span>
          </div>

          <p className="text-xs text-purple-400 font-mono">@{user.username}</p>
          <p className="text-sm text-slate-300 max-w-xl">{user.bio}</p>

          {/* Dynamic Live Stats */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-slate-300 pt-1">
            <span><strong className="text-white text-sm">{user.followersCount.toLocaleString()}</strong> Followers</span>
            <span><strong className="text-white text-sm">{user.followingCount}</strong> Following</span>
            <span><strong className="text-white text-sm">{likedSongIds.size}</strong> Liked Tracks</span>
            <span><strong className="text-white text-sm">68,920</strong> Minutes Listened</span>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center gap-3 pt-3">
            <button
              onClick={() => setEditProfileOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold vibe-gradient-primary text-white shadow-md shadow-purple-900/40 hover:scale-105 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share Profile'}</span>
            </button>

            <button
              onClick={() => setWrappedOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-pink-500/20 border border-pink-500/40 text-pink-300 hover:bg-pink-500/30 transition-all"
            >
              <Flame className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">Wrapped 2026</span>
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Recently Played Real Live Tracks */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Recently Played on VIBE</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Live audio sync</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentTracks.map((song, idx) => (
            <div
              key={`${song.id}-${idx}`}
              onClick={() => playSong(song, recentTracks)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#11111a]/80 border border-white/5 hover:border-purple-500/30 hover:bg-[#161624] transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{song.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{song.artistName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">
                  {song.genre || 'Popular'}
                </span>
                <button className="p-2 rounded-xl bg-purple-500/20 text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Artists Followed */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Favorite Artists</h3>
          <span className="text-xs text-purple-400 font-semibold">{MOCK_ARTISTS.length} artists</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {MOCK_ARTISTS.map((artist) => (
            <div
              key={artist.id}
              onClick={() => openArtistProfile(artist.id)}
              className="p-4 rounded-2xl bg-[#11111a]/80 border border-white/10 hover:border-purple-500/40 hover:bg-[#161624] transition-all cursor-pointer flex flex-col items-center text-center gap-3 group shadow-md"
            >
              <img
                src={artist.avatarUrl}
                alt={artist.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/30 group-hover:scale-105 transition-transform"
              />
              <div className="w-full">
                <h4 className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                  {artist.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {(artist.monthlyListeners / 1000000).toFixed(1)}M listeners
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Public Playlists */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-white">Your Public Playlists</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {MOCK_PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              onClick={() => {
                if (pl.tracks.length > 0) playSong(pl.tracks[0], pl.tracks);
              }}
              className="p-3.5 rounded-2xl bg-[#11111a]/80 border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer group flex flex-col gap-2 shadow-lg"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                <img
                  src={pl.coverUrl}
                  alt={pl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute bottom-2 right-2 w-9 h-9 rounded-full vibe-gradient-primary flex items-center justify-center text-white opacity-0 group-hover:opacity-100 shadow-xl transition-all hover:scale-110">
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                </button>
              </div>
              <h4 className="text-sm font-bold text-white truncate">{pl.title}</h4>
              <p className="text-xs text-slate-400">{pl.tracks.length} live tracks</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
