import React, { useState, useEffect } from 'react';
import { RaceState, UIState, GamePhase } from './types';

// Import components from each team (will be implemented by teams)
import TrackVisualization from './components/Track/TrackVisualization';
import StrategyFeed from './components/StrategyFeed/StrategyFeed';
import VoiceInterface from './components/Voice/VoiceInterface';
import RaceEngine from './engine/RaceEngine';

// Mock data for development
import { mockRaceState, mockUIState } from './data/mockData';

function App() {
  const [raceState, setRaceState] = useState<RaceState>(mockRaceState);
  const [uiState, setUIState] = useState<UIState>(mockUIState);
  const [gamePhase, setGamePhase] = useState<GamePhase>({
    phase: 'pre-race',
    timeRemaining: 10,
    canPause: true
  });

  useEffect(() => {
    // Initialize race engine
    const raceEngine = new RaceEngine();
    
    // Start pre-race countdown
    const countdown = setInterval(() => {
      setGamePhase(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(countdown);
          return { ...prev, phase: 'race', timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pit-wall to-track-green text-white font-racing">
      {/* Header */}
      <header className="bg-tempesta-red/20 border-b border-f1-silver/30 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-glow">
              🏁 SCUDERIA TEMPESTA - PIT WALL
            </h1>
            <div className="text-f1-yellow">
              LAP {raceState.currentLap}/{raceState.totalLaps}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flag-indicator flag-green"></div>
            <div className="text-f1-silver">
              SILVERSTONE GP
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Track Visualization */}
        <div className="w-1/2 p-4">
          <div className="panel h-full">
            <h2 className="panel-header">🏎️ TRACK POSITION</h2>
            <TrackVisualization 
              raceState={raceState}
              gamePhase={gamePhase}
            />
          </div>
        </div>

        {/* Right Panel - Strategy Feed */}
        <div className="w-1/2 p-4">
          <div className="panel h-full">
            <h2 className="panel-header">📊 STRATEGY COMMAND</h2>
            <StrategyFeed 
              raceState={raceState}
              uiState={uiState}
            />
          </div>
        </div>
      </main>

      {/* Voice Interface Overlay */}
      <VoiceInterface 
        isListening={uiState.isVoiceListening}
        onCommand={(command) => {
          console.log('Voice command received:', command);
          // This will be handled by the Voice & AI team
        }}
        onStateChange={(listening) => {
          setUIState(prev => ({ ...prev, isVoiceListening: listening }));
        }}
      />

      {/* Pre-race Countdown Overlay */}
      {gamePhase.phase === 'pre-race' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-8xl font-bold text-f1-red mb-4 animate-pulse">
              {gamePhase.timeRemaining || 'GO!'}
            </div>
            <div className="text-2xl text-f1-silver">
              Race starts in...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 