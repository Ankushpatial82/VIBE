'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Play, Plus, RefreshCw, Bot, User, Loader2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { MOCK_SONGS, MOCK_ARTISTS } from '../../data/mockData';
import { Song, AIMessage } from '../../types/music';

const INITIAL_MESSAGES: AIMessage[] = [
  {
    id: 'ai-1',
    sender: 'ai',
    text: "Hey Ankush! I'm VIBE AI, your personal music discovery assistant. Tell me what you're doing, how you feel, or what style of sound you want to explore.",
    timestamp: 'Just now',
  },
  {
    id: 'ai-2',
    sender: 'user',
    text: 'Make me a late-night deep focus coding playlist.',
    timestamp: 'Just now',
  },
  {
    id: 'ai-3',
    sender: 'ai',
    text: "I curated a high-concentration flow session for you. Combining atmospheric synthwave and lo-fi beats with low cognitive load to keep you locked in.",
    recommendedSongs: [MOCK_SONGS[0], MOCK_SONGS[1], MOCK_SONGS[2], MOCK_SONGS[4]],
    moodDetected: 'Focus',
    timestamp: 'Just now',
  }
];

const SUGGESTION_PROMPTS = [
  "Give me energetic Punjabi bangers 🔥",
  "Top Bollywood romantic hits with Arijit Singh ✨",
  "Global billboard hits by The Weeknd & Dua Lipa 🌍",
  "Create a 180 BPM gym workout mix 💪",
  "Chill acoustic vibes for relaxing ☕"
];

export const AIVibeScreen: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { playSong } = usePlayer();

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsGenerating(true);

    try {
      // Determine vibe query
      const lower = text.toLowerCase();
      let query = text;
      let detectedMood: any = 'Chill';
      let explanation = '';

      if (lower.includes('punjabi') || lower.includes('banger') || lower.includes('desi')) {
        query = 'Top Punjabi Hits Sidhu Moosewala Karan Aujla Diljit Dosanjh';
        explanation = "Crafted an adrenaline-filled Punjabi drill & trap set with heavy 808s to elevate your energy.";
        detectedMood = 'Energy';
      } else if (lower.includes('bollywood') || lower.includes('romantic') || lower.includes('hindi')) {
        query = 'Top Bollywood Romantic Hits Arijit Singh';
        explanation = "Handpicked soul-stirring Bollywood romantic ballads and acoustic melodies.";
        detectedMood = 'Romantic';
      } else if (lower.includes('gym') || lower.includes('workout') || lower.includes('pump')) {
        query = 'Top Workout Gym Anthems High BPM';
        explanation = "High-octane drops and aggressive tempos tuned to smash your workout targets.";
        detectedMood = 'Workout';
      } else if (lower.includes('sad') || lower.includes('down') || lower.includes('cry')) {
        query = 'Melancholy Soft Acoustic Chill';
        explanation = "Here are gentle, bittersweet indie melodies and soft ambient chords to hold space for your thoughts.";
        detectedMood = 'Sad';
      } else {
        query = text;
        explanation = `Analyzed your prompt "${text}" and generated a personalized dynamic flow mix.`;
        detectedMood = 'Chill';
      }

      // Fetch live catalog songs for prompt
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&limit=5`);
      let recommendedSongs: Song[] = [];

      if (res.ok) {
        const data = await res.json();
        if (data.tracks && data.tracks.length > 0) {
          recommendedSongs = data.tracks;
        }
      }

      if (recommendedSongs.length === 0) {
        recommendedSongs = MOCK_SONGS.slice(0, 4);
      }

      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: explanation,
        recommendedSongs,
        moodDetected: detectedMood,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI Vibe generation error:', err);
      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Here is a curated sonic mix matching "${text}".`,
        recommendedSongs: MOCK_SONGS.slice(0, 4),
        moodDetected: 'Chill',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto w-full px-4 sm:px-6 pb-2 select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl vibe-gradient-primary flex items-center justify-center vibe-glow">
            <Sparkles className="w-5 h-5 text-white animate-spin [animation-duration:10s]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>VIBE AI DJ</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Live Music Intelligence
              </span>
            </h2>
            <p className="text-xs text-slate-400">Conversational intent-to-playlist generator with live playback</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 scrollbar-none">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 max-w-2xl ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'vibe-gradient-primary text-white vibe-glow shadow-purple-500/30'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className="flex flex-col gap-3">
              <div
                className={`p-4 rounded-3xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600/30 border border-purple-500/40 text-purple-100 rounded-tr-none'
                    : 'bg-[#11111a] border border-white/10 text-slate-200 rounded-tl-none shadow-xl'
                }`}
              >
                {msg.moodDetected && (
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
                    Vibe detected: #{msg.moodDetected}
                  </span>
                )}
                <p>{msg.text}</p>
              </div>

              {/* Recommended Tracks Pill Grid */}
              {msg.recommendedSongs && msg.recommendedSongs.length > 0 && (
                <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#0e0e16] border border-purple-500/30 shadow-lg">
                  <div className="flex items-center justify-between px-1 pb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                      Curated Live Tracks ({msg.recommendedSongs.length})
                    </span>
                    <button
                      onClick={() => playSong(msg.recommendedSongs![0], msg.recommendedSongs)}
                      className="flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play All</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {msg.recommendedSongs.map((song) => (
                      <div
                        key={song.id}
                        onClick={() => playSong(song, msg.recommendedSongs)}
                        className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-purple-600/20 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={song.coverUrl}
                            alt={song.title}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{song.title}</p>
                            <p className="text-[11px] text-slate-400 truncate">{song.artistName}</p>
                          </div>
                        </div>

                        <Play className="w-4 h-4 text-purple-400 fill-current opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-3 text-xs text-purple-400 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>VIBE AI DJ is querying global catalog and synthesizing track harmonic flows...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
        {SUGGESTION_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium shrink-0 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="relative flex items-center pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask VIBE AI DJ for any artist, movie, language, bpm, or custom vibe..."
          className="w-full bg-[#11111a] border border-white/10 focus:border-purple-500/60 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 outline-none shadow-2xl"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isGenerating}
          className="absolute right-2.5 p-2 rounded-xl vibe-gradient-primary text-white disabled:opacity-40 transition-opacity hover:scale-105"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
