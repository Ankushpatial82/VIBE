'use client';

import React from 'react';
import { X, Crown, Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PremiumModal: React.FC = () => {
  const { isPremiumModalOpen, setPremiumModalOpen } = useAuth();

  if (!isPremiumModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07070b]/90 backdrop-blur-xl flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#11111a] border border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl shadow-amber-950/80">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

        <button
          onClick={() => setPremiumModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>VIBE UNLIMITED</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Upgrade to VIBE Premium</h2>
          <p className="text-xs text-slate-400 mt-1">Unlock next-generation AI, lossless audio & unlimited rooms.</p>
        </div>

        <div className="flex flex-col gap-2.5 text-xs text-slate-200 bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Unlimited VIBE AI prompt playlists & harmonic generation</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-amber-400 shrink-0" />
            <span>FLAC / 320kbps Master Quality Audio Streaming</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Host private & public Live Listening Rooms (up to 100 listeners)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Ad-free uninterrupted playback with real-time synchronized lyrics</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setPremiumModalOpen(false)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-pink-600 text-white font-bold text-sm shadow-xl shadow-amber-950/60 hover:scale-[1.02] transition-transform"
          >
            Start 1-Month Free Trial
          </button>
          <span className="text-[11px] text-slate-500">Only $9.99/month thereafter. Cancel anytime.</span>
        </div>
      </div>
    </div>
  );
};
