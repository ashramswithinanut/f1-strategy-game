import React from 'react';
import { RaceState, GamePhase, Driver } from '../../types';

interface TrackVisualizationProps {
  raceState: RaceState;
  gamePhase: GamePhase;
}

const TrackVisualization: React.FC<TrackVisualizationProps> = ({ raceState, gamePhase }) => {
  // TODO: Computer 1 - Implement track visualization
  // This should show:
  // - Silverstone track layout (SVG or Canvas)
  // - Driver positions on track
  // - Weather effects
  // - Flag status indicators
  // - Sector times and mini-sectors

  const renderDriverMarker = (driver: Driver) => {
    const isPlayer = driver.isPlayer;
    const teamColor = driver.team === 'tempesta' ? '#DC143C' : 
                     driver.team === 'storm' ? '#1E3A8A' : '#7C3AED';
    
    return (
      <div
        key={driver.id}
        className={`absolute w-3 h-3 rounded-full border-2 ${
          isPlayer ? 'border-f1-yellow' : 'border-f1-silver'
        }`}
        style={{
          backgroundColor: teamColor,
          // TODO: Calculate actual position based on track layout
          left: `${(driver.position * 10) % 80}%`,
          top: `${30 + (driver.position * 5)}%`,
        }}
        title={`${driver.name} - P${driver.position}`}
      />
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Track Info Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className={`flag-indicator ${
            raceState.flags === 'green' ? 'flag-green' :
            raceState.flags === 'yellow' ? 'flag-yellow' :
            raceState.flags === 'red' ? 'flag-red' : 'flag-blue'
          }`}></div>
          <span className="text-sm text-f1-silver">
            {raceState.flags.toUpperCase()} FLAG
          </span>
        </div>
        
        <div className="text-f1-yellow text-sm">
          {raceState.weather.toUpperCase()} | {raceState.trackCondition.toUpperCase()}
        </div>
      </div>

      {/* Track Layout Container */}
      <div className="flex-1 relative bg-track-green/20 rounded-lg border border-f1-silver/20 overflow-hidden">
        {/* TODO: Computer 1 - Replace with actual Silverstone track SVG */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 300"
          className="absolute inset-0"
        >
          {/* Simple track outline placeholder */}
          <path
            d="M 50 150 Q 100 100 200 120 Q 300 140 350 200 Q 320 250 200 240 Q 100 230 50 150 Z"
            fill="none"
            stroke="#666"
            strokeWidth="20"
            className="opacity-30"
          />
          
          {/* Start/Finish line */}
          <line
            x1="50"
            y1="140"
            x2="50"
            y2="160"
            stroke="#fff"
            strokeWidth="2"
          />
          
          {/* Track sectors (placeholder) */}
          <text x="120" y="130" fill="#f1f1f1" fontSize="12">S1</text>
          <text x="280" y="180" fill="#f1f1f1" fontSize="12">S2</text>
          <text x="150" y="250" fill="#f1f1f1" fontSize="12">S3</text>
        </svg>

        {/* Driver Position Markers */}
        {raceState.drivers.map(renderDriverMarker)}

        {/* Weather Overlay */}
        {raceState.weather !== 'sunny' && (
          <div className="absolute inset-0 bg-blue-900/20 animate-pulse">
            <div className="text-center pt-4 text-f1-blue text-sm">
              {raceState.weather === 'light-rain' ? '🌧️' : 
               raceState.weather === 'heavy-rain' ? '⛈️' : '☁️'}
            </div>
          </div>
        )}
      </div>

      {/* Track Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-tempesta-red border border-f1-yellow"></div>
          <span>Your Team</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-storm-blue border border-f1-silver"></div>
          <span>Rivals</span>
        </div>
      </div>
    </div>
  );
};

export default TrackVisualization; 