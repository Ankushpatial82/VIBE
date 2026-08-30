'use client';

import React from 'react';
import { Home, Compass, Search, Sparkles, Library, Radio, Users, User, Flame, Disc3, Settings, Crown, BarChart3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type TabType = 'home' | 'explore' | 'search' | 'aivibe' | 'library' | 'rooms' | 'friends' | 'profile';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, setWrappedOpen, setPremiumModalOpen, setArtistStudioOpen, setSettingsOpen } = useAuth();

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
    { id: 'aivibe', label: 'AI VIBE', icon: <Sparkles className="w-5 h-5 text-purple-400" />, badge: 'AI' },
    { id: 'library', label: 'Library', icon: <Library className="w-5 h-5" /> },
    { id: 'rooms', label: 'Rooms', icon: <Radio className="w-5 h-5 text-pink-400 animate-pulse" />, badge: 'LIVE' },
    { id: 'friends', label: 'Social Feed', icon: <Users className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-[#0a0a10]/95 border-r border-white/10 p-4 shrink-0 select-none z-30 justify-between">
      <div className="flex flex-col gap-6">
        {/* VIBE Brand Logo */}
        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer group" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl vibe-gradient-primary flex items-center justify-center vibe-glow shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Disc3 className="w-6 h-6 text-white animate-spin [animation-duration:8s]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wider vibe-gradient-text">VIBE</h1>
            <p className="text-[10px] text-purple-300/70 font-medium tracking-widest uppercase">Sound • Social • AI</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-950/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-purple-400' : ''}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                    item.badge === 'LIVE'
                      ? 'bg-pink-500/30 text-pink-300 border border-pink-500/40'
                      : 'bg-purple-500/30 text-purple-300 border border-purple-500/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* VIBE Wrapped 2026 Promo Banner */}
        <div
          onClick={() => setWrappedOpen(true)}
          className="relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-black border border-purple-500/30 cursor-pointer group hover:border-purple-400/60 transition-all shadow-lg"
        >
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-pink-400 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider text-pink-300">VIBE Wrapped</span>
          </div>
          <p className="text-xs text-slate-300 font-semibold">Your 2026 Year in Sound</p>
          <p className="text-[11px] text-purple-300/80 mt-0.5 group-hover:text-white transition-colors">Click to explore story →</p>
        </div>
      </div>

      {/* Bottom Profile & Studio Shortcuts */}
      <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
        <button
          onClick={() => setArtistStudioOpen(true)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>Artist Studio & Analytics</span>
        </button>

        <button
          onClick={() => setPremiumModalOpen(true)}
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/30 text-amber-300 hover:border-amber-400 transition-all"
        >
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>VIBE Premium</span>
          </div>
          <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200">Active</span>
        </button>

        <div className="flex items-center justify-between pt-1 px-2">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => setActiveTab('profile')}
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-purple-500/40 group-hover:border-purple-400"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate max-w-[90px]">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-500 truncate max-w-[90px]">@{user.username}</span>
            </div>
          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
