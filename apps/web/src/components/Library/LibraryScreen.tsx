'use client';

import React, { useState } from 'react';
import { Plus, Heart, Music, Disc3, Clock, Play, Users, Trash2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { MOCK_PLAYLISTS, MOCK_SONGS, MOCK_ARTISTS } from '../../data/mockData';
import { Playlist, Song } from '../../types/music';

export const LibraryScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'playlists' | 'liked' | 'artists' | 'recent'>('playlists');
  const [playlists, setPlaylists] = useState<Playlist[]>(MOCK_PLAYLISTS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isCollab, setIsCollab] = useState(false);

  const { playSong, likedSongIds, history } = usePlayer();
  const { openArtistProfile } = useAuth();

  const likedSongs = MOCK_SONGS.filter((s) => likedSongIds.has(s.id));

  const handleCreatePlaylist = () => {
    if (!newTitle.trim()) return;
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'Created with VIBE',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      creatorId: 'user-ankush',
      creatorName: 'Ankush Patial',
      isPublic: true,
      isCollaborative: isCollab,
      likes: 1,
      tracks: [MOCK_SONGS[0]],
      collaborators: isCollab
        ? [{ id: 'user-rahul', name: 'Rahul', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' }]
        : undefined,
    };

    setPlaylists([newPl, ...playlists]);
    setNewTitle('');
    setNewDesc('');
    setIsCreateOpen(false);
  };

  return (
    <div className="flex flex-col gap-8 pb-32 pt-2 px-4 sm:px-8 max-w-7xl mx-auto w-full select-none">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Your Library</h1>
          <p className="text-sm text-slate-400">Playlists, liked tracks, favorite artists and history.</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl vibe-gradient-primary text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-900/50 hover:scale-105 transition-transform self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        {(['playlists', 'liked', 'artists', 'recent'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs sm:text-sm font-bold capitalize transition-colors ${
              activeTab === tab
                ? 'text-purple-400 border-b-2 border-purple-400 pb-3 -mb-3'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'liked' ? `Liked Songs (${likedSongs.length})` : tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'playlists' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Liked Songs Special Tile */}
          <div
            onClick={() => setActiveTab('liked')}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-800 to-pink-900 border border-purple-500/40 hover:scale-[1.02] transition-all cursor-pointer shadow-xl flex flex-col justify-between aspect-square"
          >
            <Heart className="w-8 h-8 text-white fill-white" />
            <div>
              <h4 className="text-base font-bold text-white">Liked Songs</h4>
              <p className="text-xs text-purple-200 font-medium">{likedSongs.length} tracks</p>
            </div>
          </div>

          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => {
                if (pl.tracks.length > 0) playSong(pl.tracks[0], pl.tracks);
              }}
              className="p-3.5 rounded-2xl bg-[#11111a]/80 border border-white/10 hover:border-purple-500/40 hover:bg-[#161624] transition-all cursor-pointer group flex flex-col gap-2"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                <img
                  src={pl.coverUrl}
                  alt={pl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {pl.isCollaborative && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-purple-300 border border-purple-500/40">
                    <Users className="w-3 h-3" /> Collab
                  </span>
                )}
                <button className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full vibe-gradient-primary flex items-center justify-center text-white opacity-0 group-hover:opacity-100 shadow-xl transition-all">
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white truncate">{pl.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">{pl.tracks.length} songs • By {pl.creatorName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'liked' && (
        <div className="flex flex-col gap-2.5">
          {likedSongs.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No liked songs yet. Tap the heart on any song!
            </div>
          ) : (
            likedSongs.map((song, idx) => (
              <div
                key={song.id}
                onClick={() => playSong(song, likedSongs)}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#11111a]/80 border border-white/5 hover:border-purple-500/30 hover:bg-[#161624] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-xs font-mono text-slate-500 w-4 text-center">{idx + 1}</span>
                  <img src={song.coverUrl} alt={song.title} className="w-11 h-11 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{song.title}</h4>
                    <p className="text-xs text-slate-400 truncate">{song.artistName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                  <Play className="w-4 h-4 text-purple-400 fill-current opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'artists' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {MOCK_ARTISTS.map((artist) => (
            <div
              key={artist.id}
              onClick={() => openArtistProfile(artist.id)}
              className="p-4 rounded-2xl bg-[#11111a]/80 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer flex flex-col items-center text-center gap-3"
            >
              <img
                src={artist.avatarUrl}
                alt={artist.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-purple-500/30"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{artist.name}</h4>
                <p className="text-xs text-slate-400">{(artist.monthlyListeners / 1000000).toFixed(1)}M listeners</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'recent' && (
        <div className="flex flex-col gap-2.5">
          {history.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No recent listening history yet.
            </div>
          ) : (
            history.map((song, idx) => (
              <div
                key={`${song.id}-${idx}`}
                onClick={() => playSong(song)}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#11111a]/80 border border-white/5 hover:border-purple-500/30 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{song.title}</h4>
                    <p className="text-xs text-slate-400">{song.artistName}</p>
                  </div>
                </div>
                <Play className="w-4 h-4 text-purple-400 fill-current" />
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Playlist Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#12121c] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Create New Playlist</h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Playlist Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Midnight Cyberpunk Session"
                  className="w-full bg-[#181826] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-purple-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Give your playlist a story..."
                  className="w-full bg-[#181826] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Collaborative Playlist</span>
                  <span className="text-[11px] text-slate-400">Allow friends to add & vote on tracks</span>
                </div>
                <input
                  type="checkbox"
                  checked={isCollab}
                  onChange={(e) => setIsCollab(e.target.checked)}
                  className="w-4 h-4 accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlaylist}
                disabled={!newTitle.trim()}
                className="px-5 py-2.5 rounded-xl vibe-gradient-primary text-white text-xs font-bold disabled:opacity-40"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
