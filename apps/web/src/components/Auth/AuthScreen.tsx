'use client';

import React, { useState } from 'react';
import { Music2, Eye, EyeOff, User, Mail, Lock, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: { name: string; email: string; avatarUrl: string }) => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const getAccounts = (): Record<string, { name: string; email: string; password: string; avatarUrl: string }> => {
    try { return JSON.parse(localStorage.getItem('vibe_accounts') || '{}'); } catch { return {}; }
  };

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const accounts = getAccounts();
    const account = accounts[email.toLowerCase()];
    if (!account) { setError('Account not found. Please sign up first.'); setIsLoading(false); return; }
    if (account.password !== password) { setError('Incorrect password. Please try again.'); setIsLoading(false); return; }
    localStorage.setItem('vibe_logged_in', JSON.stringify({ email: account.email, name: account.name, avatarUrl: account.avatarUrl }));
    onLogin({ name: account.name, email: account.email, avatarUrl: account.avatarUrl });
    setIsLoading(false);
  };

  const handleSignupStep1 = () => {
    setError('');
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    const accounts = getAccounts();
    if (accounts[email.toLowerCase()]) { setError('This email is already registered. Please log in.'); return; }
    setStep(2);
  };

  const handleSignupFinish = async () => {
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const accounts = getAccounts();
    const newAccount = { name: name.trim(), email: email.toLowerCase(), password, avatarUrl: selectedAvatar };
    accounts[email.toLowerCase()] = newAccount;
    localStorage.setItem('vibe_accounts', JSON.stringify(accounts));
    localStorage.setItem('vibe_logged_in', JSON.stringify({ email: newAccount.email, name: newAccount.name, avatarUrl: newAccount.avatarUrl }));
    onLogin({ name: newAccount.name, email: newAccount.email, avatarUrl: newAccount.avatarUrl });
    setIsLoading(false);
  };

  const resetForm = () => {
    setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
    setError(''); setStep(1); setSelectedAvatar(AVATAR_OPTIONS[0]);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#05050a]">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-700/15 blur-[100px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-indigo-600/10 blur-[80px] animate-pulse [animation-delay:4s]" />
      </div>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(30px);} to { opacity:1; transform:translateY(0);} }
        .slide-up { animation: slideUp 0.5s ease forwards; }
      `}</style>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8 slide-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-900/50 mb-4">
            <Music2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">VIBE</h1>
          <p className="text-slate-400 text-sm mt-1">Discover your sound. Share your vibe.</p>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/50 slide-up">
          <div className="flex items-center bg-white/5 rounded-2xl p-1 mb-7">
            <button onClick={() => { setMode('login'); resetForm(); }} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === 'login' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-slate-400 hover:text-white'}`}>Login</button>
            <button onClick={() => { setMode('signup'); resetForm(); }} className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-slate-400 hover:text-white'}`}>Sign Up</button>
          </div>

          {error && <div className="mb-4 px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium">⚠️ {error}</div>}

          {mode === 'login' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="your@email.com" className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/60 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="••••••••" className="w-full pl-10 pr-11 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/60 transition-all" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <button onClick={handleLogin} disabled={isLoading} className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 mt-2 disabled:opacity-60">
                {isLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Logging in...</> : <><Sparkles className="w-4 h-4" /> Enter VIBE <ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-center text-slate-500 text-xs">Don't have an account? <button onClick={() => { setMode('signup'); resetForm(); }} className="text-purple-400 hover:text-purple-300 font-semibold">Sign Up Now</button></p>
            </div>
          )}

          {mode === 'signup' && step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ankush Patial" className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/60 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/60 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" className="w-full pl-10 pr-11 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/60 transition-all" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-11 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/60 transition-all" />
                  <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <button onClick={handleSignupStep1} className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 mt-2">Next Step <ChevronRight className="w-4 h-4" /></button>
              <p className="text-center text-slate-500 text-xs">Already have an account? <button onClick={() => { setMode('login'); resetForm(); }} className="text-purple-400 hover:text-purple-300 font-semibold">Log In</button></p>
            </div>
          )}

          {mode === 'signup' && step === 2 && (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-white font-bold text-lg">Choose Your Photo</p>
                <p className="text-slate-400 text-sm mt-1">Your VIBE profile avatar</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_OPTIONS.map((avatar, idx) => (
                  <button key={idx} onClick={() => setSelectedAvatar(avatar)} className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all ${selectedAvatar === avatar ? 'border-purple-500 scale-105 shadow-lg shadow-purple-900/50' : 'border-white/10 hover:border-white/30'}`}>
                    <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                    {selectedAvatar === avatar && <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center"><div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div></div>}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                <img src={selectedAvatar} alt="Preview" className="w-12 h-12 rounded-xl object-cover" />
                <div><p className="text-white font-bold text-sm">{name}</p><p className="text-slate-400 text-xs">{email}</p></div>
                <div className="ml-auto"><span className="text-[10px] font-bold px-2 py-1 rounded-full bg-purple-600/30 border border-purple-500/30 text-purple-300">New Viber</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 bg-white/5 border border-white/10 text-slate-300 font-semibold rounded-xl hover:bg-white/10 transition-all text-sm">← Back</button>
                <button onClick={handleSignupFinish} disabled={isLoading} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 disabled:opacity-60 text-sm">
                  {isLoading ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating...</> : <><Sparkles className="w-4 h-4" /> Join VIBE!</>}
                </button>
              </div>
            </div>
          )}
        </div>
        <p className="text-center text-slate-600 text-xs mt-6">By joining, you agree to feel good music vibes 🎧</p>
      </div>
    </div>
  );
};
