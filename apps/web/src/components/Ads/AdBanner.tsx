'use client';

import React, { useEffect, useRef } from 'react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔑 REPLACE THIS WITH YOUR REAL ADSENSE PUBLISHER ID
//    Get it from: https://adsense.google.com
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ADSENSE_CLIENT_ID = 'ca-pub-9635350634165581';

type AdFormat = 'banner' | 'sidebar' | 'inline' | 'sticky-bottom';

interface AdBannerProps {
  format?: AdFormat;
  adSlot?: string;
  className?: string;
}

const AD_STYLES: Record<AdFormat, { width: string; height: string; label: string }> = {
  'banner': { width: '100%', height: '90px', label: 'Advertisement' },
  'sidebar': { width: '300px', height: '250px', label: 'Sponsored' },
  'inline': { width: '100%', height: '120px', label: 'Ad' },
  'sticky-bottom': { width: '100%', height: '60px', label: 'Ad' },
};

export const AdBanner: React.FC<AdBannerProps> = ({ 
  format = 'banner', 
  adSlot = '1234567890',
  className = '' 
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    
    try {
      // Only push ads if the AdSense script is loaded and client ID is set
      if (
        ADSENSE_CLIENT_ID !== 'ca-pub-XXXXXXXXXXXXXXXXXX' && 
        typeof window !== 'undefined' && 
        (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle
      ) {
        ((window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (e) {
      console.warn('AdSense push error:', e);
    }
  }, []);

  const style = AD_STYLES[format];
  const isPlaceholder = ADSENSE_CLIENT_ID === 'ca-pub-XXXXXXXXXXXXXXXXXX';

  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{ minHeight: style.height }}
    >
      {/* Subtle label */}
      <div className="absolute top-1 right-2 z-10">
        <span className="text-[9px] font-medium text-slate-600 uppercase tracking-widest">
          {style.label}
        </span>
      </div>

      {isPlaceholder ? (
        /* Beautiful placeholder shown until real AdSense ID is added */
        <div
          className="w-full flex items-center justify-center border border-white/5 bg-gradient-to-r from-purple-900/10 via-slate-900/20 to-pink-900/10 rounded-2xl backdrop-blur-sm"
          style={{ height: style.height }}
        >
          <div className="flex flex-col items-center gap-1 opacity-40">
            <span className="text-xs text-slate-500">Ad Space</span>
            <span className="text-[10px] text-slate-600">Connect AdSense to earn</span>
          </div>
        </div>
      ) : (
        /* Real AdSense ad unit */
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: style.width,
            height: style.height,
          }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
};
