// Minimal TypeScript definitions for the YouTube IFrame API used in PlayerContext
// This file helps eliminate `any` usage and satisfies ESLint rules.

declare namespace YT {
  interface Player {
    // Core player methods we use
    loadVideoById(videoId: string, startSeconds?: number): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo?(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    setVolume(volume: number): void; // 0-100
    mute(): void;
    unMute(): void;
    // Event registration (used via constructor options)
    addEventListener?(event: string, listener: (...args: unknown[]) => void): void;
    destroy?(): void;
  }

  interface PlayerEvent {
    data: number; // state code
    target: Player;
  }
}

// Ensure the global `YT` variable is recognized by TypeScript
declare const YT: typeof YT | undefined;

declare global {
  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}
