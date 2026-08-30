'use client';

import React, { useState } from 'react';
import { X, Check, Camera, Image, Sparkles, User, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AVATAR_PRESETS = [
  { id: '1', name: 'Studio Vibes', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80' },
  { id: '2', name: 'Neon Producer', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80' },
  { id: '3', name: 'Acoustic Soul', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80' },
  { id: '4', name: 'Cyber Beats', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80' },
  { id: '5', name: 'Midnight Lo-Fi', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80' },
];

const HEADER_PRESETS = [
  { id: 'h1', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80', name: 'Neon Concert' },
  { id: 'h2', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80', name: 'Festival Stage' },
  { id: 'h3', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80', name: 'Analog Audio' },
];

const PERSONALITY_OPTIONS = [
  'THE SOUND ARCHITECT',
  'THE NIGHT EXPLORER',
  'PUNJABI 808s CONNOISSEUR',
  'BOLLYWOOD ROMANTIC',
  'GLOBAL HIT HUNTER',
  'LO-FI CHILL MASTER'
];

const AVAILABLE_GENRES = ['Punjabi', 'Bollywood', 'Pop', 'Hip-Hop', 'Electronic', 'Lo-Fi', 'R&B', 'Rock', 'Indie'];

export const EditProfileModal: React.FC = () => {
  const { user, updateProfile, isEditProfileOpen, setEditProfileOpen } = useAuth();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [headerUrl, setHeaderUrl] = useState(user.headerUrl || HEADER_PRESETS[0].url);
  const [musicPersonality, setMusicPersonality] = useState(user.musicPersonality);
  const [topGenres, setTopGenres] = useState<string[]>(user.topGenres);

  if (!isEditProfileOpen) return null;

  const handleSave = () => {
    updateProfile({
      name,
      username: username.replace(/^@/, ''),
      bio,
      avatarUrl,
      headerUrl,
      musicPersonality,
      topGenres,
    });
    setEditProfileOpen(false);
  };

  const toggleGenre = (genre: string) => {
    if (topGenres.includes(genre)) {
      if (topGenres.length > 1) {
        setTopGenres(topGenres.filter((g) => g !== genre));
      }
    } else {
      setTopGenres([...topGenres, genre]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07070b]/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="relative w-full max-w-xl bg-[#11111a] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto scrollbar-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Edit Your VIBE Profile</h2>
          </div>
          <button
            onClick={() => setEditProfileOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Picture & Banner Preview */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Photo</label>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500 shadow-xl shrink-0">
              <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <span className="text-xs text-slate-300">Choose an authentic avatar preset:</span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setAvatarUrl(preset.url)}
                    className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 shrink-0 ${
                      avatarUrl === preset.url ? 'border-purple-400 scale-110' : 'border-white/20'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Or paste custom image URL..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-purple-500/60"
          />
        </div>

        {/* Name and Username */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none focus:border-purple-500/60"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell the world about your musical vibe..."
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500/60 resize-none"
          />
        </div>

        {/* Music Personality Badge */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-300">Music Personality Badge</label>
          <div className="flex flex-wrap gap-2">
            {PERSONALITY_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setMusicPersonality(opt)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  musicPersonality === opt
                    ? 'vibe-gradient-primary text-white border-transparent shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Favorite Genres */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-300">Top Favorite Genres</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_GENRES.map((g) => {
              const selected = topGenres.includes(g);
              return (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selected
                      ? 'bg-purple-600/30 border-purple-500/50 text-purple-200'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {selected && <Check className="inline-block w-3 h-3 mr-1" />}
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => setEditProfileOpen(false)}
            className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl vibe-gradient-primary text-white text-xs font-bold shadow-lg shadow-purple-900/50 hover:scale-105 transition-transform"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
