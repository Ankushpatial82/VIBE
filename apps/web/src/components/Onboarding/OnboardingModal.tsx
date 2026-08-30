'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const GENRES = ['Pop', 'Hip-Hop', 'Punjabi', 'Bollywood', 'Rock', 'R&B', 'Electronic', 'Classical', 'K-Pop', 'Latin', 'Jazz', 'Lo-Fi'];
const MOODS = ['Chill', 'Happy', 'Sad', 'Energetic', 'Romantic', 'Workout', 'Focus', 'Party', 'Night'];
const LANGUAGES = ['English', 'Punjabi', 'Hindi', 'Korean', 'Spanish', 'Japanese'];

export const OnboardingModal: React.FC = () => {
  const { hasCompletedOnboarding, completeOnboarding } = useAuth();
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Electronic', 'Punjabi', 'Lo-Fi']);
  const [selectedMoods, setSelectedMoods] = useState<string[]>(['Night', 'Focus', 'Energy']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English', 'Punjabi']);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  if (hasCompletedOnboarding) return null;

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleFinish = () => {
    completeOnboarding(selectedGenres, selectedMoods, selectedLanguages);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07070b]/95 backdrop-blur-xl flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-xl bg-[#101018] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/80 flex flex-col gap-6">
        {/* Glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Taste Profile Setup • Step {step} of 3</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {step === 1 && "What kind of music do you love?"}
            {step === 2 && "What vibes match your daily routine?"}
            {step === 3 && "Which languages do you listen to?"}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            VIBE AI uses your taste to initialize personalized recommendations & rooms.
          </p>
        </div>

        {/* Step 1: Genres */}
        {step === 1 && (
          <div className="flex flex-wrap gap-2.5 justify-center py-2 max-h-60 overflow-y-auto">
            {GENRES.map((genre) => {
              const active = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    active
                      ? 'vibe-gradient-primary text-white shadow-lg shadow-purple-900/50 scale-105'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>{genre}</span>
                  {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Moods */}
        {step === 2 && (
          <div className="flex flex-wrap gap-2.5 justify-center py-2 max-h-60 overflow-y-auto">
            {MOODS.map((mood) => {
              const active = selectedMoods.includes(mood);
              return (
                <button
                  key={mood}
                  onClick={() => toggleMood(mood)}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    active
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-900/50 scale-105'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>#{mood}</span>
                  {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Step 3: Languages */}
        {step === 3 && (
          <div className="flex flex-wrap gap-2.5 justify-center py-2 max-h-60 overflow-y-auto">
            {LANGUAGES.map((lang) => {
              const active = selectedLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/50 scale-105'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>{lang}</span>
                  {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as 1 | 2)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as 2 | 3)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl vibe-gradient-primary text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-900/50 hover:scale-105 transition-transform"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl vibe-gradient-primary text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-900/50 hover:scale-105 transition-transform"
            >
              <span>Enter VIBE</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
