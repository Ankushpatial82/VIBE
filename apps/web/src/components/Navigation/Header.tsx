'use client';

import React from 'react';
import { Sparkles, Bell, Search, Crown, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TabType } from './Sidebar';

interface HeaderProps {
  setActiveTab: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ setActiveTab }) => {
  const { user, setPremiumModalOpen, setWrappedOpen } = useAuth();

  return (
    <header className="sticky top-0 z-20 w-full h-16 bg-[#08080c]/80 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between gap-4">
      {/* Quick Search Shortcut */}
      <div
        onClick={() => setActiveTab('search')}
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/40 text-slate-400 hover:text-slate-200 cursor-pointer transition-all w-72 max-w-full"
      >
        <Search className="w-4 h-4 text-purple-400" />
        <span className="text-xs">Search songs, artists, moods...</span>
      </div>

      {/* Action Badges & User Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('aivibe')}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition-all shadow-sm shadow-purple-900/50"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin [animation-duration:10s]" />
          <span>Ask VIBE AI</span>
        </button>

        <button
          onClick={() => setWrappedOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-500/20 border border-pink-500/40 text-pink-300 hover:bg-pink-500/30 transition-all"
        >
          <Flame className="w-3.5 h-3.5 text-pink-400" />
          <span>Wrapped '26</span>
        </button>

        <button
          onClick={() => setPremiumModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-400/40 text-amber-300 hover:border-amber-300 transition-all"
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">VIBE+</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className="relative p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500" />
        </button>

        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 cursor-pointer group pl-2"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-purple-500/40 group-hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </header>
  );
};
