'use client';

import React from 'react';
import { X, BarChart3, TrendingUp, Users, DollarSign, Globe, Play, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_SONGS } from '../../data/mockData';

export const ArtistStudioModal: React.FC = () => {
  const { isArtistStudioOpen, setArtistStudioOpen, user } = useAuth();

  if (!isArtistStudioOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07070b]/95 backdrop-blur-xl flex items-center justify-center p-4 select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#101018] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl shadow-purple-950/80 my-8">
        {/* Glow */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setArtistStudioOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span>VIBE Artist Studio</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PRO VERIFIED
              </span>
            </h2>
            <p className="text-xs text-slate-400">Real-time telemetry, fan demographics & stream analytics</p>
          </div>
        </div>

        {/* Key Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-medium">Monthly Listeners</span>
            <span className="text-2xl font-black text-white">3,842,910</span>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18.4% this month
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-medium">Total Streams</span>
            <span className="text-2xl font-black text-purple-300">14,208,400</span>
            <span className="text-[11px] text-purple-400 font-bold">+2.4M new</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-medium">Active Followers</span>
            <span className="text-2xl font-black text-pink-300">624,800</span>
            <span className="text-[11px] text-pink-400 font-bold">+12.1k today</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-medium">Est. Royalties</span>
            <span className="text-2xl font-black text-emerald-400">$38,420</span>
            <span className="text-[11px] text-slate-400">Direct instant payout</span>
          </div>
        </div>

        {/* Weekly Stream Analytics Simulated Graph */}
        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Stream Performance (Last 7 Days)</h3>
            <span className="text-xs text-purple-400 font-bold">Peak: Friday Night</span>
          </div>

          <div className="flex items-end gap-3 h-36 pt-4 px-2">
            {[45, 62, 58, 80, 95, 110, 90].map((val, i) => {
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div
                    className="w-full vibe-gradient-primary rounded-xl group-hover:scale-105 transition-all shadow-md"
                    style={{ height: `${(val / 110) * 100}%` }}
                  />
                  <span className="text-[11px] text-slate-400 font-mono">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Track Breakdown */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-white">Top Monetized Releases</h3>
          <div className="flex flex-col gap-2">
            {MOCK_SONGS.slice(0, 3).map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{song.title}</h4>
                    <p className="text-[11px] text-slate-400">{song.genre} • {song.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <span className="font-mono text-purple-300 font-bold">
                    {(song.plays / 1000000).toFixed(1)}M Streams
                  </span>
                  <span className="font-mono text-pink-300 font-bold">
                    {(song.likes / 1000).toFixed(0)}k Saves
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
