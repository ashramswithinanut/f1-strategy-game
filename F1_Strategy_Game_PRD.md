# 🏁 F1 Strategy Game Prototype – Product Requirements Document (PRD)

## 📌 Elevator Pitch

A fast-paced, voice-controlled F1 strategy game where the **player is the Team Principal** of a legendary-but-underperforming team. The prototype simulates a single race (Silverstone), with dynamic weather, rival team logic, and real-time decisions powered by LLMs. The experience compresses a full 2.5-hour Grand Prix into ~5 minutes of tightly paced, high-stakes gameplay with a retro pixel-art aesthetic.

---

## 🔍 Problem Statement

Most F1 games focus on reflexes and driving mechanics, leaving out the strategic tension of the pit wall. Fans of tactical sports games (e.g., Football Manager, Motorsport Manager) lack a fast, immersive alternative with real-time voice control and narrative richness. This game aims to solve that by putting the player in charge of strategy, team orders, and race management — using LLMs for dynamic interaction and drama.

---

## 👤 Target Users

### 🎯 Primary Personas

- **Immersed Strategist** (28–45): F1 fans, Football Manager players. Wants challenge, depth, and storylines.
- **Casual Gamer** (20–35): Enjoys voice games and party games. Needs smooth onboarding and easy control.

---

## 🧩 Core Features

### 1. 🎮 Gameplay Loop (Single Race)
- Race: ~5 min real-time Silverstone simulation
- Dynamic weather and track events (e.g. VSC, safety car)
- Player issues team commands via voice
- Drivers respond based on morale and context
- Scoring based on race result (Constructor’s points)

### 2. 🧠 LLM Integrations (GPT-4o)
- Real-time race commentary
- Driver radio responses
- Race suggestions/hints (e.g., "Rain expected in 2 laps, consider pitting")
- Command clarification (fuzzy matching voice commands)

### 3. 🗣️ Voice Input + TTS Output
- Use Web Speech API for voice input
- Player gives orders like:
  - “Box Driver 1 for inters”
  - “Swap positions”
  - “Tell Driver 2 to push”
- Text-to-speech (TTS) for:
  - Driver responses
  - Race commentary
  - Engineer acknowledgements

### 4. 📺 UI Design (Vroom-inspired)
- Left panel: strategy feed (tyres, lap times, weather, prompts)
- Right panel: top-down pixel-art track view (Silverstone)
- HUD overlays for flags, rain, tyre icons, team radio waveforms

### 5. 🎭 Narrative & Drama
- Team: *Scuderia Tempesta*, a fictional Ferrari-like team
- Drivers:
  - **Veteran Driver**: ex-champion, exiled from a top team
  - **Rookie Driver**: fast, inconsistent, eager
- Rivals:
  - **Storm Racing** and **Valkyrie GP**: basic logic + position tracking
  - Other teams exist in commentary only

### 6. ⚙️ Simulation Engine
- Driver morale + aggression system
- Basic tyre degradation modeling
- AI logic for rival pit stops & positioning
- Dynamic race events triggered contextually:
  - VSC, safety cars, rain, crashes

---

## ✨ User Stories

### 🎙️ As the Player (Team Principal), I can:
- Speak commands naturally to manage the race
- Hear drivers respond to my decisions
- See real-time updates on the track and data feed
- React to dynamic race events that affect my strategy
- Compete against AI rivals for points
- View a final scoreboard to know if I met my goal

### 📺 As a Viewer (TTS/Commentary), I can:
- Hear authentic commentary and radio
- Understand the strategic tension without clicking anything
- Experience the race like a live broadcast

---

## 🚧 Out of Scope (For This Prototype)
- Multiplayer or online interactions
- Persistent save/load system
- Season or multi-race campaign
- Full driver upgrade systems or press/media simulation
- Full voice cloning or real-world driver IP

---

## 🧱 Technical Stack

- **Frontend**: React, TailwindCSS, Vite
- **Voice Input**: Web Speech API
- **TTS Output**: Web Speech API or compatible browser engine
- **LLM**: GPT-4o (via OpenAI API)
- **Image/Track Rendering**: SVG or Canvas (Silverstone map mocked)
- **AI Logic**: JavaScript objects for rival team logic

---

## 🎯 Milestones

### ✅ Milestone 1: Setup & Scaffolding
- [ ] Create React app with Vite + Tailwind
- [ ] Layout dual-panel UI (track + strategy)
- [ ] Setup Silverstone mock circuit

### ✅ Milestone 2: Voice Interaction
- [ ] Integrate Web Speech API
- [ ] Parse natural language to command intent
- [ ] Display/visualize spoken commands

### ✅ Milestone 3: TTS + Commentary Engine
- [ ] Integrate TTS engine
- [ ] Add dynamic commentary + driver voice lines (mocked)

### ✅ Milestone 4: Race Simulation Engine
- [ ] Simulate lap timing, tyre wear, morale
- [ ] Add triggers for weather, crashes, flags
- [ ] Create rival logic for Storm Racing & Valkyrie GP

### ✅ Milestone 5: Game Logic & Feedback
- [ ] Score screen with Constructor’s points
- [ ] Victory/Failure messages based on outcome
- [ ] Driver morale displayed in feed

### ✅ Milestone 6: Polish & Presentation
- [ ] Add pixel-art overlays, SFX, and music
- [ ] Final tuning of pacing (target 5-minute gameplay)
- [ ] Add tooltips and onboarding hints

---

## ✅ Acceptance Criteria

- Player can complete a race using only voice commands
- Dynamic commentary and driver reactions adapt to player strategy
- Race includes weather changes, flags, and at least one dramatic event
- Rival team logic reflects in final standings
- Pixel-art UI matches retro aesthetic, inspired by Vroom

---

## 🔚 End of Document
