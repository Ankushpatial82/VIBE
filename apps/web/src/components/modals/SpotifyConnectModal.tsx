'use client';

import React from 'react';
import { useSpotify } from '../../context/SpotifyContext';
import { X, Music2, CheckCircle2, LogOut, ShieldCheck, Zap } from 'lucide-react';

export const SpotifyConnectModal: React.FC = () => {
  const { isModalOpen, setModalOpen, isSpotifyConnected, spotifyUser, connectSpotify, disconnectSpotify } = useSpotify();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#12121c] to-[#0a0a10] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Music2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Connect Spotify</h2>
            <p className="text-xs text-zinc-400">Unlock millions of tracks & live SDK sync</p>
          </div>
        </div>

        {isSpotifyConnected && spotifyUser ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
              <div className="relative">
                <img
                  src={spotifyUser.images?.[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={spotifyUser.display_name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500"
                />
                <CheckCircle2 className="w-5 h-5 text-emerald-400 bg-black rounded-full absolute -bottom-1 -right-1" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white truncate text-base">{spotifyUser.display_name}</h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black">
                    {spotifyUser.product || 'CONNECTED'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{spotifyUser.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Live playback enabled via Spotify Web SDK</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Unlimited search across global catalog</span>
              </div>
            </div>

            <button
              onClick={disconnectSpotify}
              className="w-full py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium text-sm flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Disconnect Account
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-white">Full Catalog Access</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Search & stream any Hindi, Punjabi, English, or international song live.</p>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-white">Direct Spotify Web SDK Integration</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Control Spotify playback seamlessly inside VIBE’s futuristic UI.</p>
                </div>
              </div>
            </div>

            <button
              onClick={connectSpotify}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Music2 className="w-5 h-5 fill-current" />
              Log in with Spotify
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
