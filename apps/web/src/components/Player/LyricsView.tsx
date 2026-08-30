'use client';

import React, { useRef, useEffect, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { Sparkles, Music, Loader2 } from 'lucide-react';
import { LyricLine } from '../../types/music';

export const LyricsView: React.FC = () => {
  const { currentSong, currentTime, seek } = usePlayer();
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Fetch real-time synced lyrics whenever currentSong changes
  useEffect(() => {
    if (!currentSong) return;

    // If song already has detailed lyrics with > 10 lines, use them
    if (currentSong.lyrics && currentSong.lyrics.length > 10) {
      setLyrics(currentSong.lyrics);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/lyrics?title=${encodeURIComponent(currentSong.title)}&artist=${encodeURIComponent(currentSong.artistName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.lyrics && data.lyrics.length > 0) {
          setLyrics(data.lyrics);
          currentSong.lyrics = data.lyrics; // cache
        } else if (currentSong.lyrics && currentSong.lyrics.length > 0) {
          setLyrics(currentSong.lyrics);
        } else {
          // Dynamic poetic fallback if no external LRC exists
          setLyrics([
            { time: 0, text: `♪ ${currentSong.title} ♪` },
            { time: 5, text: `Performing artist: ${currentSong.artistName}` },
            { time: 15, text: "Feel the vibration, let the rhythm flow" },
            { time: 30, text: "The beats surround you in this audio glow" },
            { time: 60, text: "VIBE gives life to the soundscapes we chase" },
            { time: 100, text: "Discover your sound, find your space" },
            { time: 150, text: "Melodies in motion across the night" },
            { time: 200, text: "Sing along with the music in the light" },
          ]);
        }
      })
      .catch((err) => {
        console.warn('Lyrics fetch error:', err);
        if (isMounted && currentSong.lyrics) {
          setLyrics(currentSong.lyrics);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentSong?.id, currentSong?.title]);

  // Find active line index based on current playback time
  let activeIndex = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    }
  }

  // Smooth scroll active line to center
  useEffect(() => {
    if (activeLineRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeEl = activeLineRef.current;
      const targetScrollTop = activeEl.offsetTop - container.clientHeight / 2 + activeEl.clientHeight / 2;
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col h-[440px] max-w-2xl w-full mx-auto overflow-y-auto px-4 py-8 scrollbar-none text-center relative select-none"
    >
      <div className="sticky top-0 z-20 flex items-center justify-center gap-2 mb-6 pb-2 backdrop-blur-md bg-[#0a0a14]/60 rounded-full w-fit mx-auto px-4 py-1 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin [animation-duration:10s]" />
        <span>VIBE Real-Time Synced Karaoke Lyrics</span>
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-400" />}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <p className="text-sm font-medium">Syncing live lyrics with audio stream...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-7 py-20">
          {lyrics.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPassed = idx < activeIndex;

            return (
              <div
                key={`${idx}-${line.time}`}
                ref={isActive ? activeLineRef : null}
                onClick={() => seek(line.time)}
                className={`cursor-pointer transition-all duration-300 transform px-4 py-1.5 rounded-2xl ${
                  isActive
                    ? 'text-white text-2xl md:text-3xl font-black scale-105 vibe-gradient-text drop-shadow-[0_4px_20px_rgba(168,85,247,0.6)]'
                    : isPassed
                    ? 'text-slate-400/80 text-lg md:text-xl font-semibold hover:text-slate-200 hover:scale-102'
                    : 'text-slate-600 text-lg md:text-xl font-medium hover:text-slate-400 hover:scale-102'
                }`}
                title={`Click to jump to ${Math.floor(line.time / 60)}:${Math.floor(line.time % 60).toString().padStart(2, '0')}`}
              >
                {line.text}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

