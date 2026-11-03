# 💀 Screen Roast (The AI Screen-Time & Brain-Rot Mirror)

> Turn shameful screen time habits into brutal, shareable 9:16 Instagram Story & TikTok cards. Zero heavy framework overhead, completely self-contained.

![License](https://img.shields.io/badge/License-MIT-emerald.svg)
![Stack](https://img.shields.io/badge/Stack-Vite%20%7C%20Vanilla%20TS%20%7C%20HTML5%20Canvas-black?logo=typescript)
![Mobile First](https://img.shields.io/badge/Viewport-Mobile--First%209:16-purple)

---

## ⚡ Overview

**Screen Roast** is an uncompromising, modern brutalist web application that acts as a cognitive mirror for chronic doomscrollers. By parsing daily screen hours—either through quick preset sliders or simulated screenshot OCR—it computes user archetypes, existential dopamine deficits, and exact decades of conscious life surrendered to glowing glass.

The app features a client-side **1080×1920 HTML5 Canvas Renderer** designed for instant vertical story exports (Instagram Stories, TikTok, Snapchat), a **Web Audio API 8-bit sound synthesizer**, and a **15-second mocked rewarded video ad with Server-Side Verification (SSV)** to unlock uncensored forensic diagnoses.

---

## 🚀 Features

### 1. Dual-Mode Tactile Input
- **Heuristic Screenshot OCR**: Upload an iOS or Android Screen Time screenshot. The client-side image analyzer inspects color histograms and telemetry patterns to auto-populate daily usage.
- **Interactive Preset Sliders**: Tactile sliders for top dopamine sources:
  - 🎵 **TikTok** (*Short-Form Rot, 1.5× multiplier*)
  - 📸 **Instagram / Reels** (*Aesthetic Envy, 1.4× multiplier*)
  - 🤖 **Reddit** (*Pseudointellectual Void, 1.15× multiplier*)
  - ▶️ **YouTube** (*Rabbit Hole Paralysis, 1.2× multiplier*)
  - ⚡ **X (Twitter)** (*High-Velocity Outrage, 1.35× multiplier*)
  - 🔥 **Dating Apps** (*Desperation Carousel, 1.45× multiplier*)
  - 🎮 **Mobile Games** (*Synthetic Dopamine Slot, 1.3× multiplier*)
- **Actuarial Life Expectancy Slider**: User age calibration (14–70) to project squandered conscious years against standard actuarial tables.

### 2. Retro CRT Terminal Loading State
- Real-time diagnostic terminal sequence with sound ticks:
  - `>> INITIATING BIOMETRIC & TELEMETRY HANDSHAKE...`
  - `>> PARSING SHORT-FORM DOPAMINE LOOPS (REELS / TIKTOK)...`
  - `>> CALCULATING DOPAMINE DEFICIT COEFFICIENT: CRITICAL...`
  - `>> ESTIMATING SQUANDERED WAKING DAYS (75-YR LIFESPAN)...`
  - `>> SYNTHESIZING UNFILTERED LETHALITY ROAST PAYLOAD...`

### 3. High-Performance 1080×1920 HTML5 Canvas Renderer
- Generates pixel-perfect 9:16 vertical cards (1080 × 1920 px) ready for mobile social stories.
- **Visual Design**: Dark brutalist carbon background, neon hazardous borders (`#22c55e` / `#eab308`), app usage breakdown progress bars, archetype classifications, and barcode telemetry.
- **Export Formats**: Direct PNG Blob download (`canvas.toBlob()`) and native `navigator.share` integration for mobile sharing.

### 4. Monetization & Attention Hooks (Mock Ad Unit)
- **Standard Card**: Displays app watermark and diagnostic dossier badge.
- **Unlock Deep Unfiltered Roast**: Triggers a 15-second mocked rewarded video ad ("Brainrot Slapper 3D" interactive mini-playable).
- **Server-Side Verification (SSV)**: Emulates cryptographic signature callbacks (`ECDSA_P256`, `tx_hash`, `timestamp`). Once verified, it removes the watermark and unlocks the savage uncensored forensic autopsy.

### 5. Web Audio API Synthesizer
- Zero external audio assets or MP3 bloat.
- Synthesizes retro terminal key clicks, glitch zaps, warning buzzers, and victory jingles entirely via Web Audio oscillators.

---

## 🧮 Mathematical Formulas

### Lifetime Waking Consciousness Lost
Calculated based on a 75-year reference life expectancy and standard 16-hour daily waking consciousness:

$$\text{Remaining Years} = \max(5, 75 - \text{Age})$$

$$\text{Lifetime Days Staring at Glass} = \text{round}\left( \frac{\text{Daily Hours} \times 365.25 \times \text{Remaining Years}}{24} \right)$$

$$\text{Years of Conscious Waking Life Lost} = \frac{\text{Daily Hours}}{16} \times \text{Remaining Years}$$

$$\text{Percent of Waking Life Lost} = \min\left(99, \text{round}\left(\frac{\text{Daily Hours}}{16} \times 100\right)\right)$$

### Brain-Rot Index (0–100)
Weighted dopamine deficit based on app-specific rot coefficients:

$$\text{Weighted Hours} = \sum (\text{Hours}_i \times \text{RotMultiplier}_i)$$

$$\text{Brain-Rot Index} = \text{clamp}\left(28, 99, \text{round}\left(\frac{\text{Weighted Hours}}{10} \times 100\right)\right)$$

---

## 🛠️ Project Structure

```
screen-roast/
├── index.html                   # HTML5 mobile-first shell & fonts
├── package.json                 # Scripts and minimal devDependencies
├── tsconfig.json                # TypeScript compiler config
├── vite.config.ts               # Vite configuration (port 5173, host: true)
├── .gitignore                   # Ignores node_modules, dist, .env
├── README.md                    # Project documentation
└── src/
    ├── main.ts                  # App lifecycle & state machine
    ├── style.css                # Brutalist theme, CRT scanlines, neon glows
    ├── types.ts                 # Type definitions & interfaces
    ├── audio.ts                 # Web Audio API sound synthesizer
    ├── vite-env.d.ts            # Vite client types
    ├── engines/
    │   ├── roastEngine.ts       # Archetypes, lifetime math & roasts
    │   ├── ocrAnalyzer.ts       # Screenshot heuristics & image analyzer
    │   └── canvasRenderer.ts    # 1080x1920 9:16 HTML5 Canvas Story generator
    └── components/
        ├── inputScreen.ts       # Tactile sliders & screenshot dropzone
        ├── terminalScreen.ts    # Retro CRT terminal diagnostic sequence
        ├── roastScreen.ts       # Reveal card, export triggers, and share hooks
        └── mockAdModal.ts       # 15s rewarded video ad with SSV callback
```

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended, v24+ supported)
- npm or pnpm

### Installation

```bash
# Clone and enter directory
cd screen-roast

# Install dependencies
npm install
```

### Development Server

```bash
# Start local Vite server with network access for mobile testing
npm run dev
```

Open your browser at `http://localhost:5173` (or scan your terminal's network IP on mobile).

### Production Build

```bash
# Compile TypeScript and bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## 🔒 Privacy & Client-Side Guarantee

Screen Roast executes 100% in-browser on the client device. Screenshots and telemetry data are processed using in-memory Canvas APIs; no personal screen data, images, or files are ever transmitted to remote servers.

---

## 📄 License
MIT © Screen Roast Authors.
