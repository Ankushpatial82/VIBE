'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Shuffle, Repeat, Maximize2, Mic2, ListMusic, Share2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export const BottomPlayer: React.FC = () => {
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
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
    isLyricsOpen,
    setLyricsOpen,
    isQueueOpen,
    setQueueOpen,
    setFullScreenPlayer,
  } = usePlayer();

  if (!currentSong) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const liked = isLiked(currentSong.id);

  return (
    <div className="fixed bottom-16 md:bottom-0 left-2 right-2 md:left-0 md:right-0 h-16 md:h-22 bg-[#12121e]/95 backdrop-blur-2xl border border-white/10 md:border-t md:border-x-0 md:border-b-0 rounded-2xl md:rounded-none px-3 md:px-6 flex items-center justify-between z-40 select-none shadow-2xl shadow-purple-950/80">
      {/* Track Info */}
      <div className="flex items-center gap-3.5 min-w-0 w-1/4">
        <div
          onClick={() => setFullScreenPlayer(true)}
          className="relative group w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden cursor-pointer shrink-0 border border-white/10"
        >
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 className="w-4 h-4 text-white" />
          </div>

          {/* Equalizer frequency animation when playing */}
          {isPlaying && (
            <div className="absolute bottom-1 right-1 flex items-end gap-0.5 h-3 bg-black/60 px-1 py-0.5 rounded">
              <div className="w-0.5 bg-purple-400 rounded wave-bar-1" />
              <div className="w-0.5 bg-pink-400 rounded wave-bar-2" />
              <div className="w-0.5 bg-purple-300 rounded wave-bar-3" />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span
              onClick={() => setFullScreenPlayer(true)}
              className="text-sm font-semibold text-white truncate cursor-pointer hover:text-purple-300 transition-colors"
            >
              {currentSong.title}
            </span>
          </div>
          <span className="text-xs text-slate-400 truncate hover:text-slate-200 cursor-pointer">
            {currentSong.artistName}
          </span>
        </div>

        <button
          onClick={() => toggleLike(currentSong.id)}
          className="p-1.5 rounded-full text-slate-400 hover:text-pink-400 transition-colors shrink-0"
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-pink-500 text-pink-500' : ''}`} />
        </button>
      </div>

      {/* Central Controls & Progress Bar */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full text-xs transition-colors hidden sm:block ${
              isShuffle ? 'text-purple-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={prevTrack}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:scale-110 transition-all"
            title="Previous"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full vibe-gradient-primary flex items-center justify-center text-white vibe-glow shadow-purple-500/25 hover:scale-105 active:scale-95 transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:scale-110 transition-all"
            title="Next"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-1.5 rounded-full text-xs transition-colors hidden sm:block ${
              repeatMode !== 'off' ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full flex items-center gap-2.5">
          <span className="text-[11px] text-slate-400 font-mono w-8 text-right">
            {formatTime(currentTime)}
          </span>

          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              seek(ratio * duration);
            }}
            className="relative flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer group hover:h-2 transition-all"
          >
            <div
              className="absolute left-0 top-0 bottom-0 vibe-gradient-primary rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-opacity"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          </div>

          <span className="text-[11px] text-slate-400 font-mono w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right Controls (Lyrics, Queue, Volume, Fullscreen) */}
      <div className="flex items-center justify-end gap-3 w-1/4">
        <button
          onClick={() => setLyricsOpen(!isLyricsOpen)}
          className={`p-2 rounded-xl transition-colors hidden lg:block ${
            isLyricsOpen ? 'bg-purple-600/30 text-purple-300' : 'text-slate-400 hover:text-white'
          }`}
          title="Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setQueueOpen(!isQueueOpen)}
          className={`p-2 rounded-xl transition-colors hidden sm:block ${
            isQueueOpen ? 'bg-purple-600/30 text-purple-300' : 'text-slate-400 hover:text-white'
          }`}
          title="Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Volume Slider */}
        <div className="hidden md:flex items-center gap-2 w-28">
          <button onClick={toggleMute} className="text-slate-400 hover:text-white">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>

        <button
          onClick={() => setFullScreenPlayer(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Expand View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
