'use client';

import React, { useState } from 'react';
import { X, Flame, Sparkles, Trophy, Disc3, Share2, ArrowRight, Music2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_WRAPPED_2026 } from '../../data/mockData';

export const VibeWrappedModal: React.FC = () => {
  const { isWrappedOpen, setWrappedOpen } = useAuth();
  const [slide, setSlide] = useState(1);
  const data = MOCK_WRAPPED_2026;

  if (!isWrappedOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07070b]/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1c122c] via-[#100d1c] to-[#0a0812] border border-purple-500/50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-[560px] shadow-2xl shadow-purple-950/90 text-center">
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-600/10 via-purple-600/20 to-transparent rounded-3xl pointer-events-none" />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-pink-400" />
            <span>VIBE Wrapped 2026</span>
          </div>

          <button
            onClick={() => setWrappedOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slides */}
        <div className="relative z-10 my-auto flex flex-col items-center">
          {slide === 1 && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full vibe-gradient-primary flex items-center justify-center vibe-glow shadow-purple-500/50">
                <Music2 className="w-10 h-10 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-purple-300">You lived in sound</span>
                <h3 className="text-5xl font-black text-white mt-1">48,920</h3>
                <p className="text-sm text-slate-300 mt-1">Total minutes listened in 2026</p>
              </div>
              <p className="text-xs text-purple-300/80 bg-purple-500/20 px-3 py-1.5 rounded-full border border-purple-500/30">
                Top 3% of all global listeners ⚡
              </p>
            </div>
          )}

          {slide === 2 && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-purple-400 shadow-2xl">
                <img src={data.topSong.coverUrl} alt={data.topSong.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-pink-400">#1 Top Song</span>
                <h3 className="text-2xl font-black text-white mt-1">{data.topSong.title}</h3>
                <p className="text-sm text-purple-300 font-semibold">{data.topSong.artistName}</p>
              </div>
              <p className="text-xs text-slate-400">Played 342 times with 100% vibe retention</p>
            </div>
          )}

          {slide === 3 && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-amber-300">Your Sonic Personality</span>
                <h3 className="text-2xl font-black text-white mt-1">{data.musicPersonality}</h3>
              </div>
              <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                {data.personalityDescription}
              </p>
            </div>
          )}
        </div>

        {/* Bottom actions & pagination dots */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  slide === s ? 'w-6 bg-pink-500' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          {slide < 3 ? (
            <button
              onClick={() => setSlide((s) => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl vibe-gradient-primary text-white text-xs font-bold"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setWrappedOpen(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl vibe-gradient-primary text-white text-xs font-bold"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Story</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
