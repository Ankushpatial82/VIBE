'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Share } from 'lucide-react';

export const InstallPwaPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Check iOS Safari
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show banner on mobile if not dismissed
    const dismissed = localStorage.getItem('vibe_pwa_dismissed');
    if (!dismissed && (isIosDevice || window.innerWidth < 768)) {
      setShowPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      alert('To install VIBE on iPhone/iPad:\n1. Tap the Share button at the bottom of Safari\n2. Scroll down & tap "Add to Home Screen" 📲');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('vibe_pwa_dismissed', 'true');
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-in slide-in-from-bottom-5 duration-300 select-none">
      <div className="relative overflow-hidden rounded-2xl bg-[#12121e]/95 backdrop-blur-2xl border border-purple-500/40 p-4 shadow-2xl shadow-purple-950/80 flex items-center justify-between gap-3">
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-600/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl vibe-gradient-primary flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/50">
            <Smartphone className="w-5 h-5 text-white" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white tracking-tight">Install VIBE App</h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {isIOS ? 'Tap Share ➔ Add to Home Screen' : 'Install on phone for fullscreen app & offline mode'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl vibe-gradient-primary text-white text-xs font-bold shadow-md shadow-purple-900/40 hover:scale-105 active:scale-95 transition-transform"
          >
            {isIOS ? <Share className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isIOS ? 'How to' : 'Install'}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
