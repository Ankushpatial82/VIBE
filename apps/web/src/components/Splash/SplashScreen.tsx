'use client';

import React, { useEffect, useState } from 'react';
import { Disc3, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  const onFinishRef = React.useRef(onFinish);
  onFinishRef.current = onFinish;

  const dismiss = () => {
    setFade(true);
    setTimeout(() => onFinishRef.current(), 150);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      dismiss();
    }, 450);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={dismiss}
      role="button"
      tabIndex={0}
      className={`fixed inset-0 z-50 bg-[#07070b] flex flex-col items-center justify-center transition-opacity duration-300 cursor-pointer ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Glow Aura */}
        <div className="absolute -inset-10 bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-3xl rounded-full animate-pulse" />

        {/* Rotating Icon */}
        <div className="relative w-20 h-20 rounded-2xl vibe-gradient-primary flex items-center justify-center vibe-glow shadow-purple-500/50">
          <Disc3 className="w-12 h-12 text-white animate-spin [animation-duration:4s]" />
        </div>

        {/* Branding Title */}
        <div className="text-center relative">
          <h1 className="text-5xl font-black tracking-wider vibe-gradient-text drop-shadow-2xl">
            VIBE
          </h1>
          <p className="text-sm text-purple-300 font-medium tracking-widest uppercase mt-2">
            Discover your sound. Share your vibe.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-bounce" />
          <span>AI-Powered Music Discovery</span>
        </div>
      </div>
    </div>
  );
};
