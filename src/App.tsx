import React, { useState, useEffect, useCallback } from 'react';
import { UIState, GamePhase, VoiceCommand } from './types';

// Import components from each team (will be implemented by teams)
import TrackVisualization from './components/Track/TrackVisualization';
import StrategyFeed from './components/StrategyFeed/StrategyFeed';
import VoiceInterface from './components/Voice/VoiceInterface';
import { useRaceEngine } from './hooks/useRaceEngine';
import { useVoiceSystem } from './hooks/useVoiceSystem';

// Mock data for development
import { mockUIState } from './data/mockData';

function App() {
  const [uiState, setUIState] = useState<UIState>(mockUIState);
  const [gamePhase, setGamePhase] = useState<GamePhase>({
    phase: 'pre-race',
    timeRemaining: 10,
    canPause: true
  });
  
  // Handle race end event - memoized to prevent infinite re-renders
  const handleRaceEnd = useCallback(() => {
    setGamePhase(prev => ({ ...prev, phase: 'post-race' }));
  }, []);
  
  // Use the race engine hook
  const { raceState, executeCommand, pauseRace, resumeRace, resetRace, startRace } = useRaceEngine({ 
    gamePhase, 
    onRaceEnd: handleRaceEnd 
  });

  // Use the voice system hook
  const { 
    voiceSystemState, 
    generateDriverResponse, 
    generateStrategySuggestion,
    stopAllAudio,
    isLLMEnabled,
    isTTSSupported
  } = useVoiceSystem(raceState);

  useEffect(() => {
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

    return () => {
      clearInterval(countdown);
    };
  }, []);

  // Handle voice commands by passing them to the race engine and generating responses
  const handleVoiceCommand = useCallback(async (command: VoiceCommand) => {
    console.log('Voice command received:', command);
    
    // Execute the command in the race engine
    executeCommand(command);
    
    // Generate driver response through voice system
    await generateDriverResponse(command);
    
    // Update UI state to show last command
    setUIState(prev => ({ ...prev, lastCommand: command }));
  }, [executeCommand, generateDriverResponse]);

  // Handle pause/resume
  const handlePauseToggle = useCallback(() => {
    if (gamePhase.phase === 'race') {
      if (raceState.isPaused) {
        resumeRace();
      } else {
        pauseRace();
      }
      if (!raceState.isPaused) {
        stopAllAudio();
      }
    }
  }, [raceState.isPaused, pauseRace, resumeRace, stopAllAudio]);

  // Handle reset
  const handleReset = useCallback(() => {
    resetRace();
    setGamePhase(prev => ({ ...prev, phase: 'pre-race', timeRemaining: 10 }));
    stopAllAudio();
  }, [resetRace, stopAllAudio]);

  // Handle strategy suggestion request
  const handleRequestStrategy = useCallback(async () => {
    await generateStrategySuggestion();
  }, [generateStrategySuggestion]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pit-wall to-track-green text-white font-racing">
      {/* Header */}
      <header className="bg-volley-yellow/20 border-b border-f1-silver/30 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-glow">
              🏁 SCUDERIA VOLLEY - PIT WALL
            </h1>
            <div className="text-f1-yellow">
              LAP {raceState.currentLap}/{raceState.totalLaps}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flag-indicator ${
              raceState.flags === 'green' ? 'flag-green' :
              raceState.flags === 'yellow' ? 'flag-yellow' :
              raceState.flags === 'red' ? 'flag-red' : 'flag-blue'
            }`}></div>
            <div className="text-f1-silver">
              SILVERSTONE GP | {raceState.weather.toUpperCase()}
            </div>
            
            {/* Voice System Status */}
            <div className="flex items-center gap-2">
              {isLLMEnabled && (
                <div className="w-3 h-3 bg-f1-green rounded-full" title="LLM Enabled"></div>
              )}
              {isTTSSupported && (
                <div className="w-3 h-3 bg-f1-blue rounded-full" title="TTS Supported"></div>
              )}
              {(voiceSystemState.isProcessingCommentary || voiceSystemState.isProcessingDriverResponse || voiceSystemState.isProcessingStrategy) && (
                <div className="w-3 h-3 bg-f1-yellow rounded-full animate-pulse" title="AI Processing"></div>
              )}
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="panel-header">📊 STRATEGY COMMAND</h2>
              <button
                onClick={handleRequestStrategy}
                className="btn-secondary text-sm"
                disabled={voiceSystemState.isProcessingStrategy}
              >
                Request Strategy
              </button>
            </div>
            <StrategyFeed 
              raceState={raceState}
              uiState={uiState}
              voiceSystemState={voiceSystemState}
            />
          </div>
        </div>
      </main>

      {/* Voice Interface Overlay */}
      <VoiceInterface 
        isListening={uiState.isVoiceListening}
        onCommand={handleVoiceCommand}
        onStateChange={(listening) => {
          setUIState(prev => ({ ...prev, isVoiceListening: listening }));
        }}
      />

      {/* Game Controls */}
      {gamePhase.phase === 'race' && (
        <div className="fixed bottom-4 left-4 z-30 flex gap-2">
          <button
            onClick={handlePauseToggle}
            className="btn-secondary"
          >
            {raceState.isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button
            onClick={handleReset}
            className="btn-secondary"
          >
            🔄 Reset
          </button>
        </div>
      )}

      {/* Pre-race Controls */}
      {gamePhase.phase === 'pre-race' && (
        <div className="fixed bottom-4 left-4 z-30 flex gap-2">
          <button
            onClick={startRace}
            className="btn-secondary"
          >
            🏁 Start Race
          </button>
          <button
            onClick={handleReset}
            className="btn-secondary"
          >
            🔄 Reset
          </button>
        </div>
      )}

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
      
      {/* Post-race Results Overlay */}
      {gamePhase.phase === 'post-race' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-6xl font-bold text-f1-yellow mb-4">
              🏁 RACE FINISHED!
            </div>
            <div className="text-2xl text-f1-silver mb-4">
              Final Results
            </div>
            <div className="space-y-2">
              {raceState.drivers
                .sort((a, b) => a.position - b.position)
                .slice(0, 3)
                .map((driver, index) => (
                  <div key={driver.id} className="text-xl">
                    {index + 1}. {driver.name} - {driver.team}
                  </div>
                ))}
            </div>
            <div className="mt-4 text-f1-silver">
              Last Commentary: "{voiceSystemState.lastCommentary}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 