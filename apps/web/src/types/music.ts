export type MoodType = 'Chill' | 'Energy' | 'Sad' | 'Workout' | 'Focus' | 'Night' | 'Romantic' | 'Party' | 'Happy';

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  artistImage: string;
  albumId?: string;
  albumTitle?: string;
  coverUrl: string;
  audioUrl: string;
  duration: number; // in seconds
  genre: string;
  moods: MoodType[];
  language: string;
  country: string;
  year: number;
  plays: number;
  likes: number;
  lyrics?: LyricLine[];
  isExplicit?: boolean;
  youtubeId?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  headerUrl: string;
  monthlyListeners: number;
  followers: number;
  genres: string[];
  topCountries: { country: string; flag: string; listeners: number }[];
  isVerified: boolean;
  socials?: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
  };
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverUrl: string;
  releaseYear: number;
  genre: string;
  tracks: Song[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  isPublic: boolean;
  isCollaborative: boolean;
  likes: number;
  tracks: Song[];
  collaborators?: { id: string; name: string; avatar: string }[];
}

export interface FriendActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: 'listening' | 'liked' | 'created_playlist';
  song?: Song;
  playlistName?: string;
  timeAgo: string;
  isPlaying?: boolean;
}

export interface RoomMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  reaction?: string;
}

export interface ListeningRoom {
  id: string;
  name: string;
  description: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  coverUrl: string;
  currentSong: Song;
  progressSeconds: number;
  isPlaying: boolean;
  listenersCount: number;
  isPrivate: boolean;
  activeListeners: { id: string; name: string; avatar: string; isHost?: boolean }[];
  messages: RoomMessage[];
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  headerUrl: string;
  isPremium: boolean;
  followersCount: number;
  followingCount: number;
  musicPersonality: string;
  topGenres: string[];
  topArtists: Artist[];
  publicPlaylists: Playlist[];
  recentlyPlayed: Song[];
}

export interface WrappedData {
  year: number;
  totalMinutes: number;
  topSong: Song;
  topArtist: Artist;
  topGenre: string;
  songsPlayedCount: number;
  favoriteMonth: string;
  musicPersonality: string;
  personalityDescription: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendedSongs?: Song[];
  recommendedPlaylist?: Playlist;
  moodDetected?: MoodType;
  timestamp: string;
}
