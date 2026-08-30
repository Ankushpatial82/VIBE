'use client';

import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { Play, Trash2, ListMusic, Music } from 'lucide-react';
import { Song } from '../../types/music';

export const QueueDrawer: React.FC = () => {
  const { currentSong, queue, playSong, isQueueOpen, setQueueOpen } = usePlayer();

  return (
    <div className="w-full max-w-xl mx-auto h-[420px] flex flex-col bg-[#101018]/90 rounded-2xl border border-white/10 p-5 overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <ListMusic className="w-5 h-5 text-purple-400" />
          <span>Playback Queue</span>
        </div>
        <span className="text-xs text-slate-400">{queue.length + (currentSong ? 1 : 0)} songs</span>
      </div>

      <div className="flex-1 overflow-y-auto pt-4 flex flex-col gap-4">
        {/* Now Playing */}
        {currentSong && (
          <div>
            <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-2">
              Now Playing
            </span>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-600/15 border border-purple-500/30">
              <div className="flex items-center gap-3">
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <h4 className="text-sm font-semibold text-white truncate">{currentSong.title}</h4>
                  <p className="text-xs text-slate-400">{currentSong.artistName}</p>
                </div>
              </div>
              <div className="flex items-end gap-0.5 h-4 px-2">
                <div className="w-1 bg-purple-400 rounded wave-bar-1" />
                <div className="w-1 bg-pink-400 rounded wave-bar-2" />
                <div className="w-1 bg-purple-300 rounded wave-bar-3" />
              </div>
            </div>
          </div>
        )}

        {/* Up Next */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Up Next
          </span>
          {queue.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Queue is empty. Add songs to play next!
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {queue.map((song, idx) => (
                <div
                  key={`${song.id}-${idx}`}
                  onClick={() => playSong(song)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-4">{idx + 1}</span>
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-9 h-9 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                        {song.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">{song.artistName}</p>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition-opacity">
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
