'use client';

import React, { useState } from 'react';
import { X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setSettingsOpen, user, logout } = useAuth();
  const [crossfade, setCrossfade] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [activityVisible, setActivityVisible] = useState(true);

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07070b]/90 backdrop-blur-xl flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-lg bg-[#11111a] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">App & Audio Settings</h2>
          <button onClick={() => setSettingsOpen(false)} className="p-2 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-xs">
          {/* Audio Quality */}
          <div className="p-4 rounded-2xl bg-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm">Lossless Hi-Res Audio (320kbps)</span>
              <span className="text-slate-400">Stream master quality audio fidelity</span>
            </div>
            <input
              type="checkbox"
              checked={highQuality}
              onChange={(e) => setHighQuality(e.target.checked)}
              className="w-4 h-4 accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Crossfade */}
          <div className="p-4 rounded-2xl bg-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm">Seamless Crossfade (4s)</span>
              <span className="text-slate-400">Smooth transitions between songs</span>
            </div>
            <input
              type="checkbox"
              checked={crossfade}
              onChange={(e) => setCrossfade(e.target.checked)}
              className="w-4 h-4 accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Social Privacy */}
          <div className="p-4 rounded-2xl bg-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm">Publish Listening Activity</span>
              <span className="text-slate-400">Allow friends to see what you play in real-time</span>
            </div>
            <input
              type="checkbox"
              checked={activityVisible}
              onChange={(e) => setActivityVisible(e.target.checked)}
              className="w-4 h-4 accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={() => setSettingsOpen(false)}
          className="w-full py-3 rounded-2xl vibe-gradient-primary text-white font-bold text-xs"
        >
          Save Preferences
        </button>

        {/* Logout Button */}
        <button
          onClick={() => { setSettingsOpen(false); logout(); }}
          className="w-full py-3 rounded-2xl bg-red-600/15 border border-red-500/30 text-red-400 hover:bg-red-600/25 font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out ({user.name})
        </button>
      </div>
    </div>
  );
};
