# 🎧 VIBE — Discover Your Sound. Share Your Vibe.

<div align="center">

![VIBE Banner](https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80)

**A Next-Generation Social Music Discovery, Live Karaoke Synced Lyrics & Streaming Web Platform.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-7c3aed?style=for-the-badge&logo=vercel&logoColor=white)](https://web-gilt-three-60.vercel.app)
[![Framework](https://img.shields.io/badge/Next.js_16-Turbopack-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Language](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Styling](https://img.shields.io/badge/Tailwind_CSS-Modern_Dark_UI-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA_Ready-Mobile_&_Desktop-FF5722?style=for-the-badge&logo=pwa&logoColor=white)](https://web-gilt-three-60.vercel.app)

</div>

---

## 🌟 Live Deployment URL
👉 **Production URL**: **[https://web-gilt-three-60.vercel.app](https://web-gilt-three-60.vercel.app)**

---

## 🚀 Key Features

- 🎵 **Full-Length Audio Playback Engine**: Zero 30-second limitations. Full songs play seamlessly from start to end with background audio support.
- 🎤 **Real-Time Synced Karaoke Lyrics**: Dynamic line-by-line synced lyrics (Apple Music / Spotify style) with active line glow, smooth auto-scrolling, and interactive tap-to-seek.
- 📱 **Universal Device Responsiveness**: 
  - **Laptop / Desktop**: Full-featured sidebar, expansive hero banners, interactive queues, and waveform players.
  - **Mobile (iOS / Android)**: Bottom navigation bar, floating compact player bar, and Progressive Web App (PWA) install capability.
- 🔍 **Instant Smart Search**: Search any song across Punjabi, Bollywood, Hindi, and Global English catalogs.
- 🎨 **Glassmorphism & Cyberpunk Dark Aesthetic**: Deep velvet dark backgrounds, glowing neon purple-pink gradients, and micro-animations.
- 📻 **Live Listening Rooms & Social Feed**: Collaborative listening sessions, friends activity feed, and user profiles.
- 📊 **VIBE Wrapped 2026**: Interactive year-in-review music analytics and personality cards.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [Next.js 16.3.3](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphism UI tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Engine**: Headless YouTube IFrame API & CDN streaming
- **Lyrics Engine**: [LrcLib](https://lrclib.net/) Real-Time Synced Lyrics Parser
- **Deployment Platform**: [Vercel](https://vercel.com/) (Edge Network, Automated CI/CD)

---

## 📁 Repository Structure

```
VIBE/
├── apps/
│   ├── web/                     # Next.js Frontend & Serverless API Routes
│   │   ├── src/
│   │   │   ├── app/             # App Router pages & API endpoints
│   │   │   │   ├── api/audio/   # Audio stream resolver
│   │   │   │   ├── api/lyrics/  # Real-time synced lyrics API
│   │   │   │   ├── api/youtube/ # YouTube query resolver
│   │   │   │   └── api/spotify/ # Spotify catalog search
│   │   │   ├── components/      # UI components (Player, Home, Search, Rooms, etc.)
│   │   │   ├── context/         # React Context (PlayerContext, AuthContext)
│   │   │   └── data/            # Mock catalog, playlists, and user state
│   │   ├── public/              # Static assets, icons, manifest.json, sw.js
│   │   └── package.json
│   └── api/                     # Backend API services
└── README.md                    # Documentation & Setup Guide
```

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
cd VIBE
```

### 2. Install dependencies
```bash
cd apps/web
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment Instructions

### Deploy to Vercel (Recommended)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete VIBE music streaming and synced lyrics platform"
   git push origin main
   ```

2. Open [Vercel Dashboard](https://vercel.com/), click **Add New Project**, and import this GitHub repository.
3. Set **Root Directory** to `apps/web`.
4. Click **Deploy**. Vercel will automatically build and deploy the application on global edge servers.

---

## 📱 How to Install as App on Phone (PWA)

- **Android (Chrome)**: Open the URL -> Tap three dots (⋮) -> Select **"Add to Home screen"** or **"Install App"**.
- **iPhone (Safari)**: Open the URL -> Tap the Share button (⬆️) -> Tap **"Add to Home Screen"**.

---

<div align="center">

Built with ❤️ by Ankush Patial for the future of music streaming.

</div>
