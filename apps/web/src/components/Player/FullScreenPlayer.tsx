'use client';

import React, { useState } from 'react';
import { Minimize2, Play, Pause, SkipBack, SkipForward, Heart, Shuffle, Repeat, Volume2, Mic2, ListMusic, Share2, Sparkles } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { LyricsView } from './LyricsView';
import { QueueDrawer } from './QueueDrawer';

export const FullScreenPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    isFullScreenPlayer,
    setFullScreenPlayer,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'queue'>('player');

  if (!isFullScreenPlayer || !currentSong) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = isLiked(currentSong.id);

  return (
    <div className="fixed inset-0 z-50 bg-[#06060a] flex flex-col justify-between p-6 md:p-10 select-none overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Background Ambient Glow */}
      <div
        className="absolute inset-0 opacity-25 blur-3xl scale-125 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url(${currentSong.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06060a] via-[#06060a]/80 to-transparent pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <button
          onClick={() => setFullScreenPlayer(false)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
        >
          <Minimize2 className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <button
            onClick={() => setActiveTab('player')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
              activeTab === 'player' ? 'bg-purple-600/40 text-purple-200' : 'text-slate-400 hover:text-white'
            }`}
          >
            Player
          </button>
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
              activeTab === 'lyrics' ? 'bg-purple-600/40 text-purple-200' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lyrics
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
              activeTab === 'queue' ? 'bg-purple-600/40 text-purple-200' : 'text-slate-400 hover:text-white'
            }`}
          >
            Queue
          </button>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-6 max-w-4xl mx-auto w-full">
        {activeTab === 'player' && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 w-full">
            {/* Large Artwork with 3D Float Shadow */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/80 border border-white/15 group">
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Song Meta & Badges */}
            <div className="flex flex-col gap-4 max-w-md w-full text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 uppercase tracking-wider">
                  {currentSong.genre}
                </span>
                {currentSong.moods.map((m) => (
                  <span key={m} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    #{m}
                  </span>
                ))}
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {currentSong.title}
                </h2>
                <p className="text-lg text-purple-300/80 font-medium mt-1">
                  {currentSong.artistName}
                </p>
                {currentSong.albumTitle && (
                  <p className="text-xs text-slate-400 mt-0.5">Album: {currentSong.albumTitle}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                <button
                  onClick={() => toggleLike(currentSong.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    liked
                      ? 'bg-pink-600/20 border-pink-500/50 text-pink-300'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-pink-500 text-pink-500' : ''}`} />
                  <span>{liked ? 'Liked' : 'Like'}</span>
                </button>

                <button
                  onClick={() => setActiveTab('lyrics')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-purple-500/40 transition-all"
                >
                  <Mic2 className="w-4 h-4 text-purple-400" />
                  <span>Live Lyrics</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lyrics' && <LyricsView />}
        {activeTab === 'queue' && <QueueDrawer />}
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 max-w-2xl mx-auto w-full flex flex-col gap-4">
        {/* Seeker Bar */}
        <div className="flex flex-col gap-1.5">
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              seek(ratio * duration);
            }}
            className="relative w-full h-2 bg-white/15 rounded-full cursor-pointer group"
          >
            <div
              className="absolute left-0 top-0 bottom-0 vibe-gradient-primary rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
              style={{ left: `calc(${progressPercent}% - 8px)` }}
            />
          </div>

          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={toggleShuffle}
            className={`p-2 transition-colors ${isShuffle ? 'text-purple-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={prevTrack}
            className="p-2 text-slate-200 hover:text-white hover:scale-110 transition-transform"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full vibe-gradient-primary flex items-center justify-center text-white vibe-glow shadow-purple-500/40 hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-2 text-slate-200 hover:text-white hover:scale-110 transition-transform"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 transition-colors ${repeatMode !== 'off' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
