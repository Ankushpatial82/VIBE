'use client';

import React from 'react';
import { Home, Compass, Search, Sparkles, Library, Radio, Users, User } from 'lucide-react';
import { TabType } from './Sidebar';

interface MobileNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const items: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
    { id: 'aivibe', label: 'AI Vibe', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'rooms', label: 'Rooms', icon: <Radio className="w-5 h-5" /> },
    { id: 'library', label: 'Library', icon: <Library className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0c0c14]/95 backdrop-blur-xl border-t border-white/10 px-2 flex items-center justify-around z-40">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl transition-all ${
              isActive ? 'text-purple-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
