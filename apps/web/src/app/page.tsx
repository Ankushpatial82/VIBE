'use client';

import React, { useState } from 'react';
import { PlayerProvider } from '../context/PlayerContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SpotifyProvider } from '../context/SpotifyContext';
import { Sidebar, TabType } from '../components/Navigation/Sidebar';
import { MobileNav } from '../components/Navigation/MobileNav';
import { Header } from '../components/Navigation/Header';
import { BottomPlayer } from '../components/Player/BottomPlayer';
import { FullScreenPlayer } from '../components/Player/FullScreenPlayer';
import { SplashScreen } from '../components/Splash/SplashScreen';
import { OnboardingModal } from '../components/Onboarding/OnboardingModal';
import { HomeScreen } from '../components/Home/HomeScreen';
import { SearchScreen } from '../components/Search/SearchScreen';
import { ExploreScreen } from '../components/Explore/ExploreScreen';
import { AIVibeScreen } from '../components/AIVibe/AIVibeScreen';
import { LibraryScreen } from '../components/Library/LibraryScreen';
import { RoomsScreen } from '../components/Rooms/RoomsScreen';
import { FriendsFeed } from '../components/Social/FriendsFeed';
import { UserProfileView } from '../components/Social/UserProfileView';
import { ArtistView } from '../components/Artist/ArtistView';
import { ArtistStudioModal } from '../components/Artist/ArtistStudioModal';
import { VibeWrappedModal } from '../components/Wrapped/VibeWrappedModal';
import { TasteMatchModal } from '../components/Social/TasteMatchModal';
import { SettingsModal } from '../components/Settings/SettingsModal';
import { PremiumModal } from '../components/Premium/PremiumModal';
import { EditProfileModal } from '../components/Social/EditProfileModal';
import { InstallPwaPrompt } from '../components/Navigation/InstallPwaPrompt';

function VibeApp() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showSplash, setShowSplash] = useState(true);
  const { selectedArtistId } = useAuth();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08080c] text-white">
      {/* Animated Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Onboarding Wizard */}
      <OnboardingModal />

      {/* Desktop Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto pt-6 scrollbar-none">
          {selectedArtistId ? (
            <ArtistView />
          ) : (
            <>
              {activeTab === 'home' && <HomeScreen />}
              {activeTab === 'explore' && <ExploreScreen />}
              {activeTab === 'search' && <SearchScreen />}
              {activeTab === 'aivibe' && <AIVibeScreen />}
              {activeTab === 'library' && <LibraryScreen />}
              {activeTab === 'rooms' && <RoomsScreen />}
              {activeTab === 'friends' && <FriendsFeed />}
              {activeTab === 'profile' && <UserProfileView />}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Persistent Bottom Music Player */}
      <BottomPlayer />

      {/* Full-Screen Music Player Modal */}
      <FullScreenPlayer />

      {/* Global Modals */}
      <VibeWrappedModal />
      <TasteMatchModal />
      <ArtistStudioModal />
      <SettingsModal />
      <PremiumModal />
      <EditProfileModal />
      <InstallPwaPrompt />
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <SpotifyProvider>
        <PlayerProvider>
          <VibeApp />
        </PlayerProvider>
      </SpotifyProvider>
    </AuthProvider>
  );
}
