'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Song } from '../types/music';
import { MOCK_SONGS } from '../data/mockData';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: Song[];
  history: Song[];
  likedSongIds: Set<string>;
  isFullScreenPlayer: boolean;
  isLyricsOpen: boolean;
  isQueueOpen: boolean;
  playSong: (song: Song, playlistContext?: Song[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (songId: string) => void;
  isLiked: (songId: string) => boolean;
  addToQueue: (song: Song) => void;
  setFullScreenPlayer: (open: boolean) => void;
  setLyricsOpen: (open: boolean) => void;
  setQueueOpen: (open: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(MOCK_SONGS[0]); // 295 - Sidhu Moosewala
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(204);
  const [volume, setVolumeState] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [queue, setQueue] = useState<Song[]>(MOCK_SONGS.filter((s) => s.id !== 'song-p1'));
  const [history, setHistory] = useState<Song[]>([]);
  const [likedSongIds, setLikedSongIds] = useState<Set<string>>(new Set(['song-h1', 'song-p3', 'song-e1']));
  const [isFullScreenPlayer, setFullScreenPlayer] = useState<boolean>(false);
  const [isLyricsOpen, setLyricsOpen] = useState<boolean>(false);
  const [isQueueOpen, setQueueOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const [isYtReady, setIsYtReady] = useState(false);
  const activeEngineRef = useRef<'youtube' | 'audio'>('youtube');

  // Load YouTube IFrame API script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initYT = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        try {
          ytPlayerRef.current = new (window as any).YT.Player('vibe-yt-player', {
            height: '1',
            width: '1',
            videoId: currentSong?.youtubeId || 'QYvfY4MtLAI',
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              playsinline: 1,
              rel: 0,
              origin: typeof window !== 'undefined' ? window.location.origin : '',
            },
            events: {
              onReady: (event: any) => {
                setIsYtReady(true);
                event.target.setVolume(Math.round(volume * 100));
              },
              onStateChange: (event: any) => {
                const state = event.data;
                // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
                if (state === 1) {
                  setIsPlaying(true);
                  activeEngineRef.current = 'youtube';
                  const d = event.target.getDuration();
                  if (d && !isNaN(d)) setDuration(d);
                } else if (state === 2) {
                  setIsPlaying(false);
                } else if (state === 0) {
                  handleTrackEnd();
                }
              },
              onError: (err: any) => {
                console.warn('YouTube playback error, switching to HTML5 audio fallback:', err);
                if (currentSong && audioRef.current) {
                  activeEngineRef.current = 'audio';
                  audioRef.current.src = currentSong.audioUrl;
                  audioRef.current.play().catch(() => {});
                }
              },
            },
          });
        } catch (e) {
          console.warn('YT init error:', e);
        }
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initYT();
    } else {
      (window as any).onYouTubeIframeAPIReady = initYT;
    }

    return () => {
      if (ytPlayerRef.current && ytPlayerRef.current.destroy) {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
      }
    };
  }, []);

  // Poll current time from active engine
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeEngineRef.current === 'youtube' && ytPlayerRef.current && isPlaying) {
        try {
          if (typeof ytPlayerRef.current.getCurrentTime === 'function') {
            const cur = ytPlayerRef.current.getCurrentTime();
            const dur = ytPlayerRef.current.getDuration();
            if (cur !== undefined && !isNaN(cur)) setCurrentTime(cur);
            if (dur !== undefined && !isNaN(dur) && dur > 0) setDuration(dur);
          }
        } catch {}
      } else if (activeEngineRef.current === 'audio' && audioRef.current && isPlaying) {
        if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
          setCurrentTime(audioRef.current.currentTime);
          setDuration(audioRef.current.duration);
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Initialize HTML5 Audio Element as Fallback
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;
    audio.preload = 'auto';

    const handleTimeUpdate = () => {
      if (activeEngineRef.current === 'audio' && audio.duration && !isNaN(audio.duration)) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (activeEngineRef.current === 'audio') {
        handleTrackEnd();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      seek(0);
      resume();
      return;
    }
    nextTrack();
  };

  const playSong = async (song: Song, playlistContext?: Song[]) => {
    if (currentSong) {
      setHistory((prev) => [currentSong, ...prev.slice(0, 19)]);
    }
    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(song.duration || 240);
    setIsPlaying(true);

    if (playlistContext) {
      const idx = playlistContext.findIndex((s) => s.id === song.id);
      if (idx !== -1) {
        setQueue(playlistContext.slice(idx + 1));
      }
    }

    // Stop HTML5 audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    let targetYtId = song.youtubeId;

    if (!targetYtId) {
      try {
        const query = `${song.title} ${song.artistName}`;
        const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.videoId) {
            targetYtId = data.videoId;
            song.youtubeId = data.videoId;
            if (data.duration) setDuration(data.duration);
          }
        }
      } catch (err) {
        console.warn('YouTube search fallback error:', err);
      }
    }

    if (targetYtId && ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        activeEngineRef.current = 'youtube';
        ytPlayerRef.current.loadVideoById(targetYtId, 0);
        ytPlayerRef.current.playVideo();
        return;
      } catch (e) {
        console.warn('Error loading YT video:', e);
      }
    }

    // Fallback to HTML5 audio if YouTube unavailable
    if (audioRef.current && song.audioUrl) {
      activeEngineRef.current = 'audio';
      audioRef.current.src = song.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.log('Autoplay warning:', err));
    }
  };

  const togglePlay = () => {
    if (!currentSong && MOCK_SONGS.length > 0) {
      playSong(MOCK_SONGS[0]);
      return;
    }
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const pause = () => {
    setIsPlaying(false);
    if (activeEngineRef.current === 'youtube' && ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
      try {
        ytPlayerRef.current.pauseVideo();
      } catch {}
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resume = () => {
    setIsPlaying(true);
    if (activeEngineRef.current === 'youtube' && ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
      try {
        ytPlayerRef.current.playVideo();
      } catch {}
    } else if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const nextTrack = () => {
    if (queue.length > 0) {
      const next = queue[0];
      setQueue((prev) => prev.slice(1));
      playSong(next);
    } else if (repeatMode === 'all') {
      playSong(MOCK_SONGS[0], MOCK_SONGS);
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const prevTrack = () => {
    if (currentTime > 3) {
      seek(0);
      return;
    }
    if (history.length > 0) {
      const prev = history[0];
      setHistory((h) => h.slice(1));
      if (currentSong) {
        setQueue((q) => [currentSong, ...q]);
      }
      playSong(prev);
    } else {
      seek(0);
    }
  };

  const seek = (seconds: number) => {
    setCurrentTime(seconds);
    if (activeEngineRef.current === 'youtube' && ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      try {
        ytPlayerRef.current.seekTo(seconds, true);
      } catch {}
    }
    if (audioRef.current && !isNaN(seconds)) {
      audioRef.current.currentTime = seconds;
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    setIsMuted(clamped === 0);
    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      try {
        ytPlayerRef.current.setVolume(Math.round(clamped * 100));
      } catch {}
    }
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      const targetVol = volume > 0 ? volume : 0.8;
      if (ytPlayerRef.current && typeof ytPlayerRef.current.unMute === 'function') {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(Math.round(targetVol * 100));
        } catch {}
      }
      if (audioRef.current) audioRef.current.volume = targetVol;
    } else {
      setIsMuted(true);
      if (ytPlayerRef.current && typeof ytPlayerRef.current.mute === 'function') {
        try {
          ytPlayerRef.current.mute();
        } catch {}
      }
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle && queue.length > 1) {
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
    }
  };

  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const toggleLike = (songId: string) => {
    setLikedSongIds((prev) => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });
  };

  const isLiked = (songId: string) => likedSongIds.has(songId);

  const addToQueue = (song: Song) => {
    setQueue((prev) => [...prev, song]);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        history,
        likedSongIds,
        isFullScreenPlayer,
        isLyricsOpen,
        isQueueOpen,
        playSong,
        togglePlay,
        pause,
        resume,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        isLiked,
        addToQueue,
        setFullScreenPlayer,
        setLyricsOpen,
        setQueueOpen,
      }}
    >
      <div
        id="vibe-yt-player"
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
