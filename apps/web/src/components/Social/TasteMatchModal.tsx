'use client';

import React from 'react';
import { X, Flame, Sparkles, Heart, Disc3, Play } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import { MOCK_SONGS, MOCK_ARTISTS } from '../../data/mockData';

export const TasteMatchModal: React.FC = () => {
  const { vibeMatchTargetUser, closeVibeMatch, user } = useAuth();
  const { playSong } = usePlayer();

  if (!vibeMatchTargetUser) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07070b]/90 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-lg bg-[#11111a] border border-purple-500/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl shadow-purple-950/80">
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-pink-600/30 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeVibeMatch}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4 text-pink-400" />
            <span>VIBE Match DNA</span>
          </div>
          <h2 className="text-2xl font-black text-white">Taste Compatibility</h2>
        </div>

        {/* Avatars & Match Percentage */}
        <div className="flex items-center justify-center gap-6 my-2">
          <div className="flex flex-col items-center gap-2">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-purple-500 shadow-lg"
            />
            <span className="text-xs font-bold text-white">{user.name.split(' ')[0]}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-900/50">
              <Heart className="w-7 h-7 text-white fill-white animate-pulse" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-pink-300 mt-2">
              {vibeMatchTargetUser.score}%
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <img
              src={vibeMatchTargetUser.avatar}
              alt={vibeMatchTargetUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-pink-500 shadow-lg"
            />
            <span className="text-xs font-bold text-white">{vibeMatchTargetUser.name.split(' ')[0]}</span>
          </div>
        </div>

        {/* Compatibility Breakdown */}
        <div className="flex flex-col gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-semibold">Shared Top Genres:</span>
            <span className="text-purple-300 font-bold">Electronic, Punjabi, Lo-Fi</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-semibold">Shared Top Artists:</span>
            <span className="text-purple-300 font-bold">AURA, Karan Dhillon</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-semibold">Peak Listening Sync:</span>
            <span className="text-pink-300 font-bold">11:00 PM – 2:00 AM</span>
          </div>
        </div>

        {/* Blend Action */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              playSong(MOCK_SONGS[0], MOCK_SONGS);
              closeVibeMatch();
            }}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl vibe-gradient-primary text-white font-bold text-sm shadow-xl shadow-purple-900/50 hover:scale-[1.02] transition-transform"
          >
            <Disc3 className="w-4 h-4" />
            <span>Play VIBE Blend Mix</span>
          </button>
        </div>
      </div>
    </div>
  );
};
