'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ListeningRoom, RoomMessage, Song, MoodType } from '../types/music';
import { MOCK_CURRENT_USER, MOCK_ROOMS } from '../data/mockData';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  selectedMood: MoodType | null;
  activeRoom: ListeningRoom | null;
  rooms: ListeningRoom[];
  isWrappedOpen: boolean;
  isSettingsOpen: boolean;
  isPremiumModalOpen: boolean;
  isArtistStudioOpen: boolean;
  isEditProfileOpen: boolean;
  selectedArtistId: string | null;
  selectedUserId: string | null;
  vibeMatchTargetUser: { name: string; avatar: string; score: number } | null;
  setSelectedMood: (mood: MoodType | null) => void;
  completeOnboarding: (genres: string[], moods: string[], languages: string[]) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendRoomMessage: (text: string) => void;
  toggleFollowUser: (userId: string) => void;
  isFollowingUser: (userId: string) => boolean;
  setWrappedOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setPremiumModalOpen: (open: boolean) => void;
  setArtistStudioOpen: (open: boolean) => void;
  setEditProfileOpen: (open: boolean) => void;
  openArtistProfile: (artistId: string) => void;
  closeArtistProfile: () => void;
  openUserProfile: (userId: string) => void;
  closeUserProfile: () => void;
  startVibeMatch: (userName: string, userAvatar: string, score: number) => void;
  closeVibeMatch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vibe_user_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return MOCK_CURRENT_USER;
  });

  const [isAuthenticated] = useState<boolean>(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [rooms, setRooms] = useState<ListeningRoom[]>(MOCK_ROOMS);
  const [activeRoom, setActiveRoom] = useState<ListeningRoom | null>(null);
  const [followingUserIds, setFollowingUserIds] = useState<Set<string>>(new Set(['art-sidhu', 'art-karan', 'art-arijit']));
  
  // Modals & Sub-views
  const [isWrappedOpen, setWrappedOpen] = useState<boolean>(false);
  const [isSettingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [isPremiumModalOpen, setPremiumModalOpen] = useState<boolean>(false);
  const [isArtistStudioOpen, setArtistStudioOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setEditProfileOpen] = useState<boolean>(false);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [vibeMatchTargetUser, setVibeMatchTargetUser] = useState<{ name: string; avatar: string; score: number } | null>(null);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updated };
      if (typeof window !== 'undefined') {
        localStorage.setItem('vibe_user_profile', JSON.stringify(nextUser));
      }
      return nextUser;
    });
  };

  const completeOnboarding = (genres: string[], moods: string[], languages: string[]) => {
    setHasCompletedOnboarding(true);
    updateProfile({
      topGenres: genres.length > 0 ? genres : user.topGenres,
    });
  };

  const joinRoom = (roomId: string) => {
    const target = rooms.find((r) => r.id === roomId);
    if (target) {
      setActiveRoom(target);
    }
  };

  const leaveRoom = () => {
    setActiveRoom(null);
  };

  const sendRoomMessage = (text: string) => {
    if (!activeRoom) return;
    const newMessage: RoomMessage = {
      id: `msg-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatarUrl,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveRoom((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, newMessage],
      };
    });

    setRooms((prev) =>
      prev.map((r) => (r.id === activeRoom.id ? { ...r, messages: [...r.messages, newMessage] } : r))
    );
  };

  const toggleFollowUser = (userId: string) => {
    setFollowingUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const isFollowingUser = (userId: string) => followingUserIds.has(userId);

  const openArtistProfile = (artistId: string) => setSelectedArtistId(artistId);
  const closeArtistProfile = () => setSelectedArtistId(null);
  const openUserProfile = (userId: string) => setSelectedUserId(userId);
  const closeUserProfile = () => setSelectedUserId(null);

  const startVibeMatch = (name: string, avatar: string, score: number) => {
    setVibeMatchTargetUser({ name, avatar, score });
  };
  const closeVibeMatch = () => setVibeMatchTargetUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        hasCompletedOnboarding,
        selectedMood,
        activeRoom,
        rooms,
        isWrappedOpen,
        isSettingsOpen,
        isPremiumModalOpen,
        isArtistStudioOpen,
        isEditProfileOpen,
        selectedArtistId,
        selectedUserId,
        vibeMatchTargetUser,
        setSelectedMood,
        completeOnboarding,
        updateProfile,
        joinRoom,
        leaveRoom,
        sendRoomMessage,
        toggleFollowUser,
        isFollowingUser,
        setWrappedOpen,
        setSettingsOpen,
        setPremiumModalOpen,
        setArtistStudioOpen,
        setEditProfileOpen,
        openArtistProfile,
        closeArtistProfile,
        openUserProfile,
        closeUserProfile,
        startVibeMatch,
        closeVibeMatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
