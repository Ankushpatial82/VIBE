// Minimal TypeScript definitions for the YouTube IFrame API used in PlayerContext
// This file helps eliminate `any` usage and satisfies ESLint rules.
// NOTE: This must NOT have any top-level import/export to remain a script (ambient) file,
// so that the `YT` namespace and `Window` augmentation are globally available.

declare namespace YT {
  interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    fs?: 0 | 1;
    iv_load_policy?: 1 | 3;
    modestbranding?: 0 | 1;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
    enablejsapi?: 0 | 1;
    origin?: string;
  }

  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId?: string;
    playerVars?: PlayerVars;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: PlayerEvent) => void;
      onError?: (event: PlayerEvent) => void;
    };
  }

  interface Player {
    loadVideoById(videoId: string, startSeconds?: number): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo?(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    setVolume(volume: number): void;
    mute(): void;
    unMute(): void;
    addEventListener?(event: string, listener: (...args: unknown[]) => void): void;
    destroy?(): void;
  }

  interface PlayerConstructor {
    new (elementId: string, options: PlayerOptions): Player;
  }

  interface PlayerEvent {
    data: number;
    target: Player;
  }
}

interface Window {
  YT?: {
    Player: YT.PlayerConstructor;
  };
  onYouTubeIframeAPIReady?: () => void;
}
