import React, { useState } from 'react';
import { RaceState, UIState, Driver, RaceEvent } from '../../types';

interface VoiceSystemState {
  lastCommentary: string;
  lastDriverResponse: string;
  lastStrategySuggestion: string;
  audioEvents: any[];
  isProcessingCommentary: boolean;
  isProcessingDriverResponse: boolean;
  isProcessingStrategy: boolean;
}

interface StrategyFeedProps {
  raceState: RaceState;
  uiState: UIState;
  voiceSystemState: VoiceSystemState;
}

const StrategyFeed: React.FC<StrategyFeedProps> = ({ raceState, uiState, voiceSystemState }) => {
  const [activeTab, setActiveTab] = useState<'timing' | 'events' | 'strategy' | 'voice'>('timing');
  
  // TODO: Computer 1 - Implement strategy feed panels
  // This should show:
  // - Live timing data
  // - Race events feed
  // - Strategy recommendations
  // - Tyre compound indicators
  // - Fuel levels
  // - Driver morale

  const renderTimingData = () => {
    const playerDrivers = raceState.drivers.filter(d => d.isPlayer);
    
    return (
      <div className="space-y-2">
        <div className="panel-header text-sm">🏁 LIVE TIMING</div>
        {playerDrivers.map(driver => (
          <div key={driver.id} className="data-row">
            <div className="flex items-center gap-2">
              <div className="text-f1-yellow font-bold">P{driver.position}</div>
              <div className="text-f1-silver">{driver.name}</div>
              {driver.status === 'pitting' && (
                <div className="text-volley-yellow text-xs animate-pulse">🔧 PITTING</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className={`tyre-indicator tyre-${driver.tyreCompound}`}>
                {driver.tyreCompound[0].toUpperCase()}
              </div>
              <div className="text-f1-green text-sm">{driver.lapTime.toFixed(3)}</div>
              <div className="text-f1-blue text-xs">{driver.speed}km/h</div>
            </div>
            
            {/* Driver Morale Bar */}
            <div className="mt-1 flex items-center gap-2">
              <div className="text-xs text-f1-silver">Morale:</div>
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    driver.morale >= 80 ? 'bg-f1-green' :
                    driver.morale >= 60 ? 'bg-f1-yellow' :
                    driver.morale >= 40 ? 'bg-orange-500' : 'bg-f1-red'
                  }`}
                  style={{ width: `${driver.morale}%` }}
                />
              </div>
              <div className={`text-xs font-bold ${
                driver.morale >= 80 ? 'text-f1-green' :
                driver.morale >= 60 ? 'text-f1-yellow' :
                driver.morale >= 40 ? 'text-orange-500' : 'text-f1-red'
              }`}>
                {Math.round(driver.morale)}%
              </div>
              <div className="text-xs">
                {driver.morale >= 80 ? '😊' :
                 driver.morale >= 60 ? '😐' :
                 driver.morale >= 40 ? '😟' : '😤'}
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-4 space-y-1">
          <div className="data-row">
            <span className="data-label">Best Lap</span>
            <span className="data-value">1:26.891</span>
          </div>
          <div className="data-row">
            <span className="data-label">Gap to Leader</span>
            <span className="data-value">+12.3s</span>
          </div>
          <div className="data-row">
            <span className="data-label">Constructor Position</span>
            <span className="data-value">P3</span>
          </div>
          <div className="data-row">
            <span className="data-label">Avg Speed</span>
            <span className="data-value">
              {Math.round(playerDrivers.reduce((sum, d) => sum + d.speed, 0) / playerDrivers.length)}km/h
            </span>
          </div>
          
          {/* Team Morale Summary */}
          <div className="data-row">
            <span className="data-label">Team Morale</span>
            <span className={`data-value font-bold ${
              playerDrivers.reduce((sum, d) => sum + d.morale, 0) / playerDrivers.length >= 70 ? 'text-f1-green' :
              playerDrivers.reduce((sum, d) => sum + d.morale, 0) / playerDrivers.length >= 50 ? 'text-f1-yellow' : 'text-f1-red'
            }`}>
              {Math.round(playerDrivers.reduce((sum, d) => sum + d.morale, 0) / playerDrivers.length)}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderEventsFeed = () => {
    const recentEvents = raceState.events.slice(-10).reverse();
    
    return (
      <div className="space-y-2">
        <div className="panel-header text-sm">📢 RACE EVENTS</div>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {recentEvents.length === 0 ? (
            <div className="text-center text-f1-silver/50 py-4">
              <div className="text-xs">No race events yet</div>
              <div className="text-xs mt-1">Events will appear as the race progresses</div>
            </div>
          ) : (
            recentEvents.map((event, index) => (
              <div key={event.id || `event-${index}`} className="data-row">
                <div className="flex items-center gap-2">
                  <div className="text-f1-yellow text-xs font-bold">L{event.lap}</div>
                  <div className={`w-2 h-2 rounded-full ${
                    event.severity === 'critical' ? 'bg-f1-red' :
                    event.severity === 'warning' ? 'bg-f1-yellow' : 'bg-f1-green'
                  }`}></div>
                  <div className="text-f1-silver/70 text-xs">
                    {event.type.toUpperCase()}
                  </div>
                </div>
                <div className="text-f1-silver text-sm">{event.message}</div>
              </div>
            ))
          )}
        </div>
        
        {/* Event Stats */}
        <div className="mt-3 pt-2 border-t border-f1-silver/20">
          <div className="flex justify-between text-xs text-f1-silver/70">
            <span>Total Events: {raceState.events.length}</span>
            <span>Current Lap: {raceState.currentLap}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderStrategyPanel = () => {
    const playerTeam = raceState.teams.find(t => t.name === 'Scuderia Volley');
    const playerDrivers = raceState.drivers.filter(d => d.isPlayer);
    const podiumDrivers = playerDrivers.filter(d => d.position <= 3);
    const topTenDrivers = playerDrivers.filter(d => d.position <= 10);
    
    return (
      <div className="space-y-2">
        <div className="panel-header text-sm">🎯 STRATEGY</div>
        
        {/* Race Goals */}
        <div className="bg-volley-yellow/20 border border-volley-yellow/50 rounded p-2">
          <div className="text-xs text-volley-yellow font-bold mb-2">🏆 RACE OBJECTIVES</div>
          
          <div className="space-y-1">
            {/* Podium Goal */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-f1-silver">At least one driver on podium</div>
              <div className={`text-xs font-bold ${
                podiumDrivers.length > 0 ? 'text-f1-green' : 'text-f1-red'
              }`}>
                {podiumDrivers.length > 0 ? '✅' : '❌'} {podiumDrivers.length}/1
              </div>
            </div>
            
            {/* Top 10 Goal */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-f1-silver">Both drivers finish in top 10</div>
              <div className={`text-xs font-bold ${
                topTenDrivers.length === 2 ? 'text-f1-green' : 'text-f1-yellow'
              }`}>
                {topTenDrivers.length === 2 ? '✅' : '⚠️'} {topTenDrivers.length}/2
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="mt-2 pt-1 border-t border-volley-yellow/30">
              <div className="text-xs text-f1-silver mb-1">Overall Progress:</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      podiumDrivers.length > 0 && topTenDrivers.length === 2 ? 'bg-f1-green' :
                      podiumDrivers.length > 0 || topTenDrivers.length === 2 ? 'bg-f1-yellow' : 'bg-f1-red'
                    }`}
                    style={{ 
                      width: `${((podiumDrivers.length > 0 ? 50 : 0) + (topTenDrivers.length === 2 ? 50 : topTenDrivers.length * 25))}%` 
                    }}
                  />
                </div>
                <div className="text-xs font-bold text-volley-yellow">
                  {Math.round(((podiumDrivers.length > 0 ? 50 : 0) + (topTenDrivers.length === 2 ? 50 : topTenDrivers.length * 25)))}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Strategy Suggestion */}
        {voiceSystemState.lastStrategySuggestion && (
          <div className="bg-f1-green/20 border border-f1-green/50 rounded p-2">
            <div className="text-xs text-f1-green mb-1">AI Strategy Suggestion</div>
            <div className="text-f1-silver text-sm">
              {voiceSystemState.lastStrategySuggestion}
            </div>
          </div>
        )}

        {/* Weather Forecast */}
        <div className="bg-pit-wall/50 rounded p-2">
          <div className="text-xs text-f1-silver mb-1">Weather Forecast</div>
          <div className="text-f1-yellow text-sm">
            {raceState.weather === 'cloudy' ? '☁️ Cloudy' : 
             raceState.weather === 'light-rain' ? '🌧️ Light Rain' : '☀️ Sunny'}
          </div>
        </div>

        {/* Tyre Strategy */}
        <div className="bg-pit-wall/50 rounded p-2">
          <div className="text-xs text-f1-silver mb-1">Tyre Strategy</div>
          <div className="flex gap-2">
            {['soft', 'medium', 'hard'].map(compound => (
              <div key={compound} className={`tyre-indicator tyre-${compound}`}>
                {compound[0].toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Pit Window */}
        <div className="bg-pit-wall/50 rounded p-2">
          <div className="text-xs text-f1-silver mb-1">Pit Window</div>
          <div className="text-f1-green text-sm">Lap 18-22 (Optimal)</div>
        </div>

        {/* Quick Commands */}
        <div className="mt-4">
          <div className="text-xs text-f1-silver mb-2">Quick Commands</div>
          <div className="grid grid-cols-2 gap-2">
            <button className="racing-button secondary text-xs py-1">
              Box Both
            </button>
            <button className="racing-button secondary text-xs py-1">
              Push Now
            </button>
            <button className="racing-button secondary text-xs py-1">
              Swap Positions
            </button>
            <button className="racing-button secondary text-xs py-1">
              Fuel Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderVoicePanel = () => {
    return (
      <div className="space-y-2">
        <div className="panel-header text-sm">🎤 VOICE SYSTEM</div>
        
        {/* Last Commentary */}
        {voiceSystemState.lastCommentary && (
          <div className="bg-f1-blue/20 border border-f1-blue/50 rounded p-2">
            <div className="text-xs text-f1-blue mb-1">Latest Commentary</div>
            <div className="text-f1-silver text-sm">
              "{voiceSystemState.lastCommentary}"
            </div>
          </div>
        )}

        {/* Last Driver Response */}
        {voiceSystemState.lastDriverResponse && (
          <div className="bg-f1-yellow/20 border border-f1-yellow/50 rounded p-2">
            <div className="text-xs text-f1-yellow mb-1">Driver Response</div>
            <div className="text-f1-silver text-sm">
              "{voiceSystemState.lastDriverResponse}"
            </div>
          </div>
        )}

        {/* Audio Events */}
        <div className="bg-pit-wall/50 rounded p-2">
          <div className="text-xs text-f1-silver mb-1">Recent Audio Events</div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {voiceSystemState.audioEvents.slice(-5).map(event => (
              <div key={event.id} className="text-xs">
                <span className="text-f1-yellow">{event.speaker}:</span>
                <span className="text-f1-silver ml-1">{event.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Status */}
        {(voiceSystemState.isProcessingCommentary || voiceSystemState.isProcessingDriverResponse || voiceSystemState.isProcessingStrategy) && (
          <div className="bg-f1-red/20 border border-f1-red/50 rounded p-2">
            <div className="text-xs text-f1-red flex items-center gap-2">
              <div className="animate-spin">⚙️</div>
              AI Processing...
              {voiceSystemState.isProcessingCommentary && " (Commentary)"}
              {voiceSystemState.isProcessingDriverResponse && " (Driver Response)"}
              {voiceSystemState.isProcessingStrategy && " (Strategy)"}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-4">
        {[
          { id: 'timing', label: '⏱️ Timing' },
          { id: 'events', label: '📢 Events' },
          { id: 'strategy', label: '🎯 Strategy' },
          { id: 'voice', label: '🎤 Voice' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1 text-sm rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-f1-red text-white'
                : 'bg-f1-silver/20 text-f1-silver hover:bg-f1-silver/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'timing' && renderTimingData()}
        {activeTab === 'events' && renderEventsFeed()}
        {activeTab === 'strategy' && renderStrategyPanel()}
        {activeTab === 'voice' && renderVoicePanel()}
      </div>

      {/* Voice Command Status */}
      <div className="mt-4 p-2 bg-pit-wall/50 rounded">
        <div className="flex items-center gap-2">
          <div className={`voice-indicator ${
            uiState.isVoiceListening ? 'listening' : ''
          }`}></div>
          <div className="text-xs text-f1-silver">
            {uiState.isVoiceListening ? 'Listening...' : 'Voice Ready'}
          </div>
        </div>
        {uiState.lastCommand && (
          <div className="mt-1 text-xs text-f1-yellow">
            Last: "{uiState.lastCommand.type}"
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyFeed; 