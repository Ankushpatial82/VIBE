'use client';

import React from 'react';
import { Users, Heart, Play, Flame, Sparkles, UserPlus, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import { MOCK_FRIEND_ACTIVITY } from '../../data/mockData';

export const FriendsFeed: React.FC = () => {
  const { startVibeMatch, toggleFollowUser, isFollowingUser } = useAuth();
  const { playSong } = usePlayer();

  return (
    <div className="flex flex-col gap-8 pb-32 pt-2 px-4 sm:px-8 max-w-7xl mx-auto w-full select-none">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>Social Network & Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Friends Activity & Taste Matches
        </h1>
        <p className="text-sm text-slate-400">
          See what your circle is listening to in real-time, compare tastes, and share tracks.
        </p>
      </div>

      {/* Feed Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_FRIEND_ACTIVITY.map((act) => {
          const isFollowing = isFollowingUser(act.userId);

          return (
            <div
              key={act.id}
              className="p-5 rounded-3xl bg-[#11111a]/90 border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between gap-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={act.userAvatar}
                    alt={act.userName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-purple-500/40"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{act.userName}</h3>
                    <p className="text-xs text-slate-400">
                      {act.action === 'listening' && 'Listening to music'}
                      {act.action === 'liked' && 'Liked a track'}
                      {act.action === 'created_playlist' && 'Created a new playlist'}
                      {' • '}
                      <span className="text-purple-400 font-semibold">{act.timeAgo}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startVibeMatch(act.userName, act.userAvatar, 87)}
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 hover:bg-pink-500/30 transition-all"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>87% Match</span>
                  </button>

                  <button
                    onClick={() => toggleFollowUser(act.userId)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      isFollowing
                        ? 'bg-white/10 border-white/15 text-slate-300'
                        : 'bg-purple-600/30 border-purple-500/50 text-purple-200'
                    }`}
                    title={isFollowing ? 'Following' : 'Follow'}
                  >
                    {isFollowing ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {act.song && (
                <div
                  onClick={() => playSong(act.song!)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-purple-600/15 border border-white/5 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={act.song.coverUrl}
                      alt={act.song.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{act.song.title}</p>
                      <p className="text-xs text-slate-400 truncate">{act.song.artistName} • {act.song.genre}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Listen along
                    </span>
                    <button className="w-9 h-9 rounded-full vibe-gradient-primary flex items-center justify-center text-white shadow-md">
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    </button>
                  </div>
                </div>
              )}

              {act.playlistName && (
                <div className="p-3.5 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-xs text-slate-300 font-medium">
                  🎵 New public playlist: <strong className="text-white font-bold">{act.playlistName}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
