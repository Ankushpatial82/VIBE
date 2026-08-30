'use client';

import React, { useState } from 'react';
import { ArrowLeft, Users, Send, Radio, Play, Pause, Heart, Smile, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';

const EMOJI_REACTIONS = ['🔥', '❤️', '🚀', '⚡', '👏', '✨'];

export const ActiveRoomView: React.FC = () => {
  const { activeRoom, leaveRoom, sendRoomMessage, user } = useAuth();
  const { isPlaying, togglePlay } = usePlayer();
  const [chatInput, setChatInput] = useState('');

  if (!activeRoom) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;
    sendRoomMessage(text);
    if (!textToSend) setChatInput('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-32 pt-2 px-4 sm:px-8 max-w-7xl mx-auto w-full h-[calc(100vh-10rem)] select-none">
      {/* Left Area: Room Stage & Synced Playback */}
      <div className="flex-1 flex flex-col justify-between bg-[#11111a] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-20 blur-3xl scale-125 pointer-events-none"
          style={{
            backgroundImage: `url(${activeRoom.currentSong.coverUrl})`,
            backgroundSize: 'cover',
          }}
        />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={leaveRoom}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Leave Room</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>LIVE SYNC • {activeRoom.listenersCount} In Room</span>
          </div>
        </div>

        {/* Center: Large Artwork & Currently Playing */}
        <div className="relative z-10 flex flex-col items-center text-center my-6">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/80 border border-white/15 mb-6 group">
            <img
              src={activeRoom.currentSong.coverUrl}
              alt={activeRoom.currentSong.title}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute bottom-3 right-3 flex items-end gap-1 bg-black/70 px-2 py-1 rounded-lg">
                <div className="w-1 bg-purple-400 rounded wave-bar-1 h-4" />
                <div className="w-1 bg-pink-400 rounded wave-bar-2 h-4" />
                <div className="w-1 bg-purple-300 rounded wave-bar-3 h-4" />
              </div>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {activeRoom.currentSong.title}
          </h2>
          <p className="text-sm text-purple-300 font-medium mt-1">
            {activeRoom.currentSong.artistName}
          </p>

          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
            <span>Hosted by <strong className="text-white">{activeRoom.hostName}</strong></span>
          </div>
        </div>

        {/* Active Listeners Presence Grid */}
        <div className="relative z-10 flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pr-2">
              Listeners:
            </span>
            {activeRoom.activeListeners.map((l) => (
              <div key={l.id} className="relative group">
                <img
                  src={l.avatar}
                  alt={l.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/40"
                  title={l.name}
                />
                {l.isHost && (
                  <span className="absolute -top-1 -right-1 text-[8px] bg-pink-500 text-white font-bold px-1 rounded-full">
                    H
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full vibe-gradient-primary flex items-center justify-center text-white shrink-0 hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </button>
        </div>
      </div>

      {/* Right Area: Real-Time Chat & Live Reactions */}
      <div className="w-full lg:w-96 flex flex-col justify-between bg-[#11111a] border border-white/10 rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Room Chat</span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
              Live
            </span>
          </h3>
          <span className="text-xs text-slate-400">Moderated</span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3 scrollbar-none">
          {activeRoom.messages.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              Say hello or send a reaction!
            </div>
          ) : (
            activeRoom.messages.map((m) => (
              <div key={m.id} className="flex items-start gap-2.5 text-xs">
                <img
                  src={m.userAvatar}
                  alt={m.userName}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="flex flex-col min-w-0 bg-white/5 rounded-2xl px-3 py-2 border border-white/5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-purple-300">{m.userName}</span>
                    <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                  </div>
                  <p className="text-slate-200 mt-0.5 break-words">{m.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reaction Quick Bar */}
        <div className="flex items-center justify-between py-2 border-t border-white/10 gap-1">
          {EMOJI_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSend(emoji)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-base transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="relative flex items-center pt-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Type a message..."
            className="w-full bg-[#181826] border border-white/10 focus:border-purple-500/50 rounded-2xl py-2.5 pl-3.5 pr-10 text-xs text-white placeholder:text-slate-500 outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!chatInput.trim()}
            className="absolute right-2 p-1.5 rounded-xl vibe-gradient-primary text-white disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
