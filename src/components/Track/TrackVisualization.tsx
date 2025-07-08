import React, { useEffect, useState } from 'react';
import { RaceState } from '../../types';

interface TrackVisualizationProps {
  raceState: RaceState;
  gamePhase: 'pre-race' | 'race' | 'post-race';
}

const TrackVisualization: React.FC<TrackVisualizationProps> = ({ raceState, gamePhase }) => {
  const [positionSwapAnimating, setPositionSwapAnimating] = useState<string[]>([]);
  const [lastPositions, setLastPositions] = useState<{[key: string]: number}>({});

  // Track position changes for swap animation
  useEffect(() => {
    const currentPositions: {[key: string]: number} = {};
    raceState.drivers.forEach(driver => {
      currentPositions[driver.id] = driver.position;
    });

    // Check for position swaps
    const swappedDrivers: string[] = [];
    Object.keys(currentPositions).forEach(driverId => {
      if (lastPositions[driverId] && lastPositions[driverId] !== currentPositions[driverId]) {
        swappedDrivers.push(driverId);
      }
    });

    if (swappedDrivers.length > 0) {
      setPositionSwapAnimating(swappedDrivers);
      setTimeout(() => setPositionSwapAnimating([]), 2000);
    }

    setLastPositions(currentPositions);
  }, [raceState.drivers, lastPositions]);

  // TODO: Computer 1 - Implement track visualization
  // This should show:
  // - Top-down view of Silverstone circuit
  // - Driver positions as moving dots
  // - Pit lane and pit stops
  // - Weather indicators
  // - Flag status
  // - Lap progress
  
  const silverStoneTrackPath = "M 50 150 Q 100 100 200 120 Q 300 140 350 200 Q 380 250 360 300 Q 340 350 280 380 Q 200 400 120 380 Q 80 360 60 320 Q 40 280 50 240 Q 60 200 50 150 Z";
  
  // Pit lane path (parallel to main straight)
  const pitLanePath = "M 50 170 L 200 170 L 200 180 L 50 180 Z";
  
  // Calculate driver positions on track
  const getDriverPosition = (driver: any, index: number) => {
    const basePositions = [
      { x: 50, y: 150 },   // P1
      { x: 70, y: 155 },   // P2
      { x: 90, y: 160 },   // P3
      { x: 110, y: 165 },  // P4
      { x: 130, y: 170 },  // P5
    ];
    
    const pos = basePositions[driver.position - 1] || basePositions[4];
    
    // If driver is pitting, show them in pit lane
    if (driver.status === 'pitting') {
      return { x: 75 + (index * 20), y: 175 };
    }
    
    return pos;
  };

  const renderDriverCar = (driver: any, index: number) => {
    const position = getDriverPosition(driver, index);
    const isSwapping = positionSwapAnimating.includes(driver.id);
    
    return (
      <g key={driver.id}>
        {/* Position swap animation effect */}
        {isSwapping && (
          <circle
            cx={position.x}
            cy={position.y}
            r="25"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            className="animate-ping"
          />
        )}
        
        {/* Driver car */}
        <circle
          cx={position.x}
          cy={position.y}
          r="8"
          fill={driver.isPlayer ? '#FFD700' : '#DC143C'}
          stroke="#ffffff"
          strokeWidth="2"
          className={`transition-all duration-500 ${isSwapping ? 'animate-pulse' : ''}`}
        />
        
        {/* Pit stop indicator */}
        {driver.status === 'pitting' && (
          <g>
            <circle
              cx={position.x}
              cy={position.y}
              r="15"
              fill="none"
              stroke="#FFD700"
              strokeWidth="2"
              className="animate-spin"
            />
            <text
              x={position.x}
              y={position.y - 25}
              textAnchor="middle"
              className="text-xs font-bold fill-volley-yellow animate-bounce"
            >
              PIT
            </text>
          </g>
        )}
        
        {/* Speed display */}
        <text
          x={position.x}
          y={position.y + 25}
          textAnchor="middle"
          className="text-xs font-bold fill-white"
        >
          {driver.speed}km/h
        </text>
        
        {/* Driver name */}
        <text
          x={position.x}
          y={position.y + 35}
          textAnchor="middle"
          className="text-xs fill-f1-silver"
        >
          {driver.name.split(' ')[0]}
        </text>
      </g>
    );
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-lg overflow-hidden">
      {/* Track Layout */}
      <svg
        viewBox="0 0 400 450"
        className="w-full h-full"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' }}
      >
        {/* Main Track */}
        <path
          d={silverStoneTrackPath}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeDasharray="5,5"
          className="opacity-60"
        />
        
        {/* Pit Lane */}
        <path
          d={pitLanePath}
          fill="rgba(255, 215, 0, 0.2)"
          stroke="#FFD700"
          strokeWidth="2"
          strokeDasharray="3,3"
        />
        
        {/* Start/Finish Line */}
        <line
          x1="45"
          y1="140"
          x2="45"
          y2="160"
          stroke="#ffffff"
          strokeWidth="4"
        />
        
        {/* Track Sections Labels */}
        <text x="200" y="100" textAnchor="middle" className="text-xs fill-white opacity-60">
          Maggotts
        </text>
        <text x="350" y="200" textAnchor="middle" className="text-xs fill-white opacity-60">
          Copse
        </text>
        <text x="300" y="380" textAnchor="middle" className="text-xs fill-white opacity-60">
          Club
        </text>
        <text x="80" y="360" textAnchor="middle" className="text-xs fill-white opacity-60">
          Vale
        </text>
        
        {/* Pit Lane Label */}
        <text x="125" y="165" textAnchor="middle" className="text-xs fill-volley-yellow font-bold">
          PIT LANE
        </text>
        
        {/* Render all drivers */}
        {raceState.drivers.map((driver, index) => renderDriverCar(driver, index))}
      </svg>

      {/* Race Information Overlay */}
      <div className="absolute top-4 left-4 bg-black/50 rounded p-2">
        <div className="text-volley-yellow font-bold text-sm">
          Silverstone Circuit
        </div>
        <div className="text-f1-silver text-xs">
          5.891 km • {raceState.totalLaps} laps
        </div>
      </div>
      
      {/* Lap Counter */}
      <div className="absolute top-4 right-4 bg-black/50 rounded p-2">
        <div className="text-volley-yellow font-bold text-sm">
          LAP {raceState.currentLap}/{raceState.totalLaps}
        </div>
        <div className="text-f1-silver text-xs">
          {Math.round((raceState.currentLap / raceState.totalLaps) * 100)}% Complete
        </div>
      </div>

      {/* Weather Status */}
      <div className="absolute bottom-4 left-4 bg-black/50 rounded p-2">
        <div className="text-f1-silver text-xs">Weather:</div>
        <div className="text-volley-yellow font-bold text-sm">
          {raceState.weather === 'cloudy' ? '☁️ Cloudy' : 
           raceState.weather === 'light-rain' ? '🌧️ Light Rain' : 
           raceState.weather === 'heavy-rain' ? '🌧️ Heavy Rain' : 
           raceState.weather === 'storm' ? '⛈️ Storm' : '☀️ Sunny'}
        </div>
      </div>

      {/* Flag Status */}
      <div className="absolute bottom-4 right-4 bg-black/50 rounded p-2">
        <div className="text-f1-silver text-xs">Flag:</div>
        <div className={`font-bold text-sm ${
          raceState.flags === 'green' ? 'text-f1-green' :
          raceState.flags === 'yellow' ? 'text-f1-yellow' :
          raceState.flags === 'red' ? 'text-f1-red' : 'text-white'
        }`}>
          {raceState.flags.toUpperCase()}
        </div>
      </div>
      
      {/* Position Swap Notification */}
      {positionSwapAnimating.length > 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-volley-yellow/90 text-black font-bold px-4 py-2 rounded animate-bounce">
          🔄 POSITION SWAP!
        </div>
      )}
    </div>
  );
};

export default TrackVisualization; 