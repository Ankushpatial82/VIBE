'use client';

import React, { useState } from 'react';
import { Radio, Users, Plus, Play, Sparkles, MessageSquare, Volume2, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import { ActiveRoomView } from './ActiveRoomView';
import { ListeningRoom } from '../../types/music';
import { MOCK_SONGS } from '../../data/mockData';

export const RoomsScreen: React.FC = () => {
  const { rooms, activeRoom, joinRoom, user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');

  if (activeRoom) {
    return <ActiveRoomView />;
  }

  return (
    <div className="flex flex-col gap-8 pb-32 pt-2 px-4 sm:px-8 max-w-7xl mx-auto w-full select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>VIBE Live Listening Rooms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Listen Together in Real-Time
          </h1>
          <p className="text-sm text-slate-400">
            Join synchronized music rooms, chat with friends, and discover new tracks as a community.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl vibe-gradient-primary text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-900/50 hover:scale-105 transition-transform self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Room</span>
        </button>
      </div>

      {/* Public Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => joinRoom(room.id)}
            className="p-5 rounded-3xl bg-[#11111a]/80 border border-white/10 hover:border-purple-500/40 hover:bg-[#161624] transition-all cursor-pointer group flex flex-col justify-between gap-4 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md">
                  <img src={room.coverUrl} alt={room.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Radio className="w-6 h-6 text-pink-400 animate-pulse" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Host: {room.hostName}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>{room.listenersCount}</span>
              </div>
            </div>

            {/* Currently Playing in Room */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={room.currentSong.coverUrl}
                  alt={room.currentSong.title}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{room.currentSong.title}</p>
                  <p className="text-[11px] text-slate-400 truncate">{room.currentSong.artistName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-purple-400 font-semibold uppercase tracking-wider">
                  Syncing
                </span>
                <Play className="w-4 h-4 text-purple-400 fill-current" />
              </div>
            </div>

            {/* Active listener avatars */}
            <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
              <div className="flex items-center -space-x-2">
                {room.activeListeners.map((l) => (
                  <img
                    key={l.id}
                    src={l.avatar}
                    alt={l.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-[#11111a]"
                    title={l.name}
                  />
                ))}
              </div>
              <span className="text-xs text-purple-400 font-semibold group-hover:text-white transition-colors">
                Join Room →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#12121c] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Create a VIBE Room</h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. Late Night Synthwave Lounge"
                  className="w-full bg-[#181826] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-purple-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Description</label>
                <input
                  type="text"
                  value={roomDesc}
                  onChange={(e) => setRoomDesc(e.target.value)}
                  placeholder="What's the vibe of this room?"
                  className="w-full bg-[#181826] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  joinRoom('room-1');
                  setIsCreateOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl vibe-gradient-primary text-white text-xs font-bold"
              >
                Start Listening
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
