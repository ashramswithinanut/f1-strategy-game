# 🏁 F1 Strategy Game - Multi-Computer Development Setup

A voice-controlled F1 strategy game where you play as Team Principal of **Scuderia Tempesta**. This project is designed to be developed across 3 different computers working in parallel.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 👥 Team Assignments

### 🖥️ Computer 1: UI & Visualization Lead
**Focus**: Frontend components, layouts, and track visualization

#### Your Responsibilities:
- **Track Visualization** (`src/components/Track/`)
  - Implement Silverstone circuit SVG/Canvas
  - Driver position markers and animations
  - Weather effects and flag indicators
  - Sector timing displays

- **Strategy Feed** (`src/components/StrategyFeed/`)
  - Live timing data panels
  - Race events feed
  - Strategy recommendations UI
  - Tyre compound indicators

- **UI Components** (`src/components/UI/`)
  - Responsive design and layouts
  - Racing-themed component library
  - Animations and transitions
  - Pixel-art aesthetic implementation

#### Key Files:
```
src/
├── components/
│   ├── Track/TrackVisualization.tsx ✅
│   ├── StrategyFeed/StrategyFeed.tsx ✅
│   └── UI/
├── styles/
└── assets/
```

#### Your Milestones:
- ✅ Milestone 1: Setup & Scaffolding
- ✅ Milestone 6: Polish & Presentation

---

### 🎙️ Computer 2: Voice & AI Integration Lead
**Focus**: Speech processing and LLM interactions

#### Your Responsibilities:
- **Voice Recognition** (`src/services/speechAPI.ts`)
  - Web Speech API integration
  - Natural language command parsing
  - Voice confidence handling
  - Multi-language support

- **AI Services** (`src/services/llmService.ts`)
  - OpenAI GPT-4o integration
  - Dynamic race commentary
  - Driver radio responses
  - Strategic suggestions

- **TTS System** (`src/services/ttsEngine.ts`)
  - Text-to-speech integration
  - Voice character system
  - Audio queue management
  - Voice mixing and effects

#### Key Files:
```
src/
├── services/
│   ├── speechAPI.ts ✅
│   ├── llmService.ts ✅
│   └── ttsEngine.ts
├── components/Voice/
│   └── VoiceInterface.tsx ✅
└── hooks/
    ├── useVoiceInput.ts
    └── useTTS.ts
```

#### Your Milestones:
- ✅ Milestone 2: Voice Interaction
- ✅ Milestone 3: TTS + Commentary Engine

---

### 🏎️ Computer 3: Game Logic & Simulation Lead
**Focus**: Race mechanics and AI behavior

#### Your Responsibilities:
- **Race Engine** (`src/engine/RaceEngine.ts`)
  - Race simulation loop
  - Driver performance calculations
  - Tyre degradation modeling
  - Weather effects system

- **AI Systems** (`src/engine/rivalAI.ts`)
  - Rival team behavior
  - Strategic decision making
  - Adaptive difficulty
  - Race event triggers

- **Game Logic** (`src/engine/`)
  - Driver morale/aggression systems
  - Pit stop mechanics
  - Fuel consumption
  - Position management

#### Key Files:
```
src/
├── engine/
│   ├── RaceEngine.ts ✅
│   ├── rivalAI.ts
│   ├── driverSystem.ts
│   └── eventTriggers.ts
├── models/
│   ├── Driver.ts
│   ├── Team.ts
│   └── RaceState.ts
└── utils/gameLogic.ts
```

#### Your Milestones:
- ✅ Milestone 4: Race Simulation Engine
- ✅ Milestone 5: Game Logic & Feedback

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- OpenAI API key (for Computer 2)

### Environment Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd f1-strategy-game
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables** (Computer 2 only)
```bash
# Create .env file
echo "OPENAI_API_KEY=your_openai_key_here" > .env
```

4. **Start development server**
```bash
npm run dev
```

### Git Workflow

1. **Create feature branch**
```bash
git checkout -b feature/computer-1/track-visualization
git checkout -b feature/computer-2/voice-integration
git checkout -b feature/computer-3/race-engine
```

2. **Regular commits**
```bash
git add .
git commit -m "feat: implement track visualization"
git push origin feature/computer-1/track-visualization
```

3. **Integration merges**
```bash
# Merge to develop branch weekly
git checkout develop
git merge feature/computer-1/track-visualization
```

## 🔧 Technical Stack

- **Frontend**: React 18, TypeScript, TailwindCSS
- **Build Tool**: Vite
- **Voice**: Web Speech API
- **AI**: OpenAI GPT-4o
- **State Management**: React hooks
- **Styling**: TailwindCSS with custom F1 theme

## 📁 Project Structure

```
f1-strategy-game/
├── src/
│   ├── components/           # UI Components (Computer 1)
│   │   ├── Track/
│   │   ├── StrategyFeed/
│   │   ├── Voice/
│   │   └── UI/
│   ├── services/             # API Services (Computer 2)
│   │   ├── speechAPI.ts
│   │   ├── llmService.ts
│   │   └── ttsEngine.ts
│   ├── engine/               # Game Logic (Computer 3)
│   │   ├── RaceEngine.ts
│   │   ├── rivalAI.ts
│   │   └── driverSystem.ts
│   ├── types/                # Shared Types
│   │   └── index.ts
│   ├── data/                 # Mock Data
│   │   └── mockData.ts
│   └── hooks/                # React Hooks
├── public/                   # Static Assets
├── docs/                     # Documentation
└── tests/                    # Test Files
```

## 🎮 Game Features

### Core Gameplay
- **5-minute races** compressed from 2.5-hour Grand Prix
- **Voice-controlled** team management
- **Dynamic weather** and track conditions
- **Real-time strategy** decisions
- **AI-powered** commentary and driver responses

### Voice Commands
- `"Box driver 1 for soft tyres"`
- `"Tell both drivers to push"`
- `"Swap positions"`
- `"Conserve fuel"`
- `"Defend position"`

### Racing Elements
- **Tyre Strategy**: Soft, Medium, Hard, Intermediate, Wet
- **Weather System**: Sunny, Cloudy, Light Rain, Heavy Rain, Storm
- **Driver Psychology**: Morale and aggression systems
- **Race Events**: Crashes, safety cars, mechanical failures

## 🧪 Testing Strategy

### Mock Data Development
Each computer should use mock data for dependencies:

- **Computer 1**: Mock race state and voice commands
- **Computer 2**: Mock game state and UI callbacks  
- **Computer 3**: Mock voice input and UI updates

### Integration Testing
- Weekly integration sessions
- Cross-computer component testing
- End-to-end voice-to-engine testing

## 🚦 Development Phases

### Phase 1: Foundation (Week 1)
- Setup development environments
- Implement basic component structure
- Create mock data interfaces

### Phase 2: Core Features (Week 2)
- Build primary functionality
- Implement basic integrations
- Test individual components

### Phase 3: Integration (Week 3)
- Connect all systems
- Resolve integration issues
- Performance optimization

### Phase 4: Polish (Week 4)
- Bug fixes and refinements
- UI/UX improvements
- Final testing

## 🎯 Success Criteria

- [ ] Player can complete race using only voice commands
- [ ] Dynamic commentary adapts to race events
- [ ] Weather changes affect race strategy
- [ ] Rival team AI provides competitive challenge
- [ ] 5-minute race duration achieved
- [ ] Retro pixel-art aesthetic implemented

## 🔗 Resources

- [F1 Strategy Game PRD](./F1_Strategy_Game_PRD.md)
- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🆘 Support

Each computer team has specific responsibilities, but help each other when needed:

- **Cross-team code reviews**
- **Daily sync meetings** (optional)
- **Shared documentation** in `/docs`
- **Integration support** during merges

## 📋 Next Steps

1. **Set up your development environment**
2. **Review your team's specific files**
3. **Create your feature branch**
4. **Start implementing your assigned components**
5. **Test with mock data**
6. **Prepare for integration**

---

**Ready to build the ultimate F1 strategy game? Let's race! 🏁** 