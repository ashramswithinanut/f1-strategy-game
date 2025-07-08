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

    // Check for position swaps only if we have previous positions
    if (Object.keys(lastPositions).length > 0) {
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
    }

    setLastPositions(currentPositions);
  }, [raceState.drivers.map(d => `${d.id}-${d.position}`).join(',')]); // Fix dependency array

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
    // Silverstone track path points (simplified circuit)
    const trackPath = [
      { x: 65, y: 140 },   // Start/Finish straight
      { x: 70, y: 120 },   // Turn 1 approach
      { x: 85, y: 90 },    // Turn 1-2 complex
      { x: 110, y: 75 },   // Turn 3-4
      { x: 140, y: 80 },   // Turn 5-6
      { x: 170, y: 95 },   // Turn 7-8
      { x: 195, y: 110 },  // Turn 9-10
      { x: 220, y: 130 },  // Turn 11-12
      { x: 240, y: 150 },  // Turn 13
      { x: 260, y: 165 },  // Turn 14-15
      { x: 280, y: 175 },  // Turn 16-17
      { x: 295, y: 185 },  // Turn 18
      { x: 285, y: 195 },  // Back straight
      { x: 250, y: 190 },  // Sector 3
      { x: 200, y: 185 },  // Sector 3 continued
      { x: 150, y: 175 },  // Approaching finish
      { x: 100, y: 165 },  // Final sector
      { x: 75, y: 155 },   // Almost finish
    ];
    
    // If driver is pitting, show them in pit lane
    if (driver.status === 'pitting') {
      return { x: 70 + (driver.position * 15), y: 175 };
    }
    
    // Get current race time and calculate smooth progress
    const raceTime = raceState.raceTime || 0;
    const lapDuration = 10; // 10 seconds per lap
    
    // Calculate base lap progress (0 to 1) - this should be smooth
    const rawLapProgress = (raceTime / lapDuration) % 1;
    
    // Add driver-specific variations for realistic racing
    const positionOffset = (driver.position - 1) * 0.02; // Small spread based on position
    const performanceOffset = (87 - driver.lapTime) * 0.005; // Faster drivers slightly ahead
    
    // Calculate final smooth lap progress
    let lapProgress = rawLapProgress + performanceOffset - positionOffset;
    
    // Ensure lapProgress stays in bounds and wraps around smoothly
    lapProgress = ((lapProgress % 1) + 1) % 1; // Handle negative values properly
    
    // Calculate smooth position along track path
    const totalPathLength = trackPath.length - 1;
    const smoothTrackPosition = lapProgress * totalPathLength;
    
    // Get the two points to interpolate between
    const baseIndex = Math.floor(smoothTrackPosition);
    const nextIndex = (baseIndex + 1) % trackPath.length;
    const interpolationFactor = smoothTrackPosition - baseIndex;
    
    // Get the current and next points
    const currentPoint = trackPath[baseIndex];
    const nextPoint = trackPath[nextIndex];
    
    // Smooth interpolation between points
    const baseX = currentPoint.x + (nextPoint.x - currentPoint.x) * interpolationFactor;
    const baseY = currentPoint.y + (nextPoint.y - currentPoint.y) * interpolationFactor;
    
    // Add slight side-to-side offset for different positions
    const sideOffset = (driver.position - 3) * 2; // Smaller offset for cleaner look
    
    // Calculate perpendicular direction for side offset
    const deltaX = nextPoint.x - currentPoint.x;
    const deltaY = nextPoint.y - currentPoint.y;
    const pathLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    let finalX = baseX;
    let finalY = baseY;
    
    // Apply side offset perpendicular to track direction
    if (pathLength > 0) {
      const perpX = -deltaY / pathLength;
      const perpY = deltaX / pathLength;
      finalX += perpX * sideOffset;
      finalY += perpY * sideOffset;
    }
    
    return { x: finalX, y: finalY };
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
          SILVERSTONE GP | {raceState.weather.toUpperCase()}
        </div>
      </div>

      {/* Silverstone Circuit Layout */}
      <div className="flex-1 relative bg-track-green/20 rounded-lg border border-f1-silver/20 overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 350 220"
          className="absolute inset-0"
        >
          {/* Track Surface */}
          <defs>
            <linearGradient id="trackGray" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2a2a2a" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>
            <linearGradient id="sector1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF1E1E" />
              <stop offset="100%" stopColor="#CC1818" />
            </linearGradient>
            <linearGradient id="sector2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0070F3" />
              <stop offset="100%" stopColor="#0056CC" />
            </linearGradient>
            <linearGradient id="sector3" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#CCAA00" />
            </linearGradient>
          </defs>
          
          {/* Track Sections - All Gray */}
          
          {/* Track Section 1 */}
          <path
            d="M 60 140 L 60 80 L 80 70 L 100 70 L 120 75 L 140 80 L 160 85 L 180 95 L 200 105"
            fill="none"
            stroke="url(#trackGray)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Track Section 2 */}
          <path
            d="M 200 105 L 220 120 L 240 140 L 260 150 L 280 160 L 300 170 L 310 180 L 300 190"
            fill="none"
            stroke="url(#trackGray)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Track Section 3 */}
          <path
            d="M 300 190 L 280 195 L 260 190 L 240 185 L 220 180 L 200 175 L 180 170 L 160 165 L 140 160 L 120 155 L 100 150 L 80 145 L 60 140"
            fill="none"
            stroke="url(#trackGray)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sector Center Lines - Color Coded */}
          
          {/* Sector 1 Center Line */}
          <path
            d="M 60 140 
               L 60 80 
               L 80 70 
               L 100 70 
               L 120 75 
               L 140 80
               L 160 85 
               L 180 95 
               L 200 105"
            fill="none"
            stroke="url(#sector1)"
            strokeWidth="2"
            opacity="0.8"
          />
          
          {/* Sector 2 Center Line */}
          <path
            d="M 200 105 
               L 220 120 
               L 240 140
               L 260 150 
               L 280 160 
               L 300 170 
               L 310 180 
               L 300 190"
            fill="none"
            stroke="url(#sector2)"
            strokeWidth="2"
            opacity="0.8"
          />
          
          {/* Sector 3 Center Line */}
          <path
            d="M 300 190
               L 280 195 
               L 260 190 
               L 240 185 
               L 220 180 
               L 200 175
               L 180 170 
               L 160 165 
               L 140 160 
               L 120 155 
               L 100 150 
               L 80 145 
               L 60 140"
            fill="none"
            stroke="url(#sector3)"
            strokeWidth="2"
            opacity="0.8"
          />

          {/* Track Barriers */}
          <path
            d="M 60 140 
               L 60 80 
               L 80 70 
               L 100 70 
               L 120 75 
               L 140 80
               L 160 85 
               L 180 95 
               L 200 105 
               L 220 120 
               L 240 140
               L 260 150 
               L 280 160 
               L 300 170 
               L 310 180 
               L 300 190
               L 280 195 
               L 260 190 
               L 240 185 
               L 220 180 
               L 200 175
               L 180 170 
               L 160 165 
               L 140 160 
               L 120 155 
               L 100 150 
               L 80 145 
               L 60 140"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            opacity="0.4"
          />
          
          {/* Start/Finish Line */}
          <line
            x1="58"
            y1="135"
            x2="62"
            y2="145"
            stroke="#fff"
            strokeWidth="6"
          />
          <text x="35" y="142" fill="#fff" fontSize="8" fontWeight="bold">
            🏁 START
          </text>

          {/* Corner Numbers - Clean positioning */}
          <g fill="#fff" fontSize="8" fontWeight="bold">
            {/* Turn 1 */}
            <circle cx="65" cy="85" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="65" y="88" textAnchor="middle">1</text>
            
            {/* Turn 2 */}
            <circle cx="85" cy="72" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="85" y="75" textAnchor="middle">2</text>
            
            {/* Turn 3 */}
            <circle cx="110" cy="72" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="110" y="75" textAnchor="middle">3</text>
            
            {/* Turn 4 */}
            <circle cx="135" cy="77" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="135" y="80" textAnchor="middle">4</text>
            
            {/* Turn 5 */}
            <circle cx="155" cy="87" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="155" y="90" textAnchor="middle">5</text>
            
            {/* Turn 6 */}
            <circle cx="175" cy="97" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="175" y="100" textAnchor="middle">6</text>
            
            {/* Turn 7 */}
            <circle cx="195" cy="107" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="195" y="110" textAnchor="middle">7</text>
            
            {/* Turn 8 */}
            <circle cx="215" cy="122" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="215" y="125" textAnchor="middle">8</text>
            
            {/* Turn 9 */}
            <circle cx="235" cy="142" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="235" y="145" textAnchor="middle">9</text>
            
            {/* Turn 10 */}
            <circle cx="255" cy="152" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="255" y="155" textAnchor="middle">10</text>
            
            {/* Turn 11 */}
            <circle cx="275" cy="162" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="275" y="165" textAnchor="middle">11</text>
            
            {/* Turn 12 */}
            <circle cx="295" cy="172" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="295" y="175" textAnchor="middle">12</text>
            
            {/* Turn 13 */}
            <circle cx="305" cy="185" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="305" y="188" textAnchor="middle">13</text>
            
            {/* Turn 14 */}
            <circle cx="285" cy="192" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="285" y="195" textAnchor="middle">14</text>
            
            {/* Turn 15 */}
            <circle cx="265" cy="187" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="265" y="190" textAnchor="middle">15</text>
            
            {/* Turn 16 */}
            <circle cx="245" cy="182" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="245" y="185" textAnchor="middle">16</text>
            
            {/* Turn 17 */}
            <circle cx="225" cy="177" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="225" y="180" textAnchor="middle">17</text>
            
            {/* Turn 18 */}
            <circle cx="205" cy="172" r="6" fill="#333" stroke="#FFD700" strokeWidth="1"/>
            <text x="205" y="175" textAnchor="middle">18</text>
          </g>

          {/* DRS Detection Zones - Callout Style */}
          <g>
            {/* DRS Zone 1 Indicator */}
            <circle cx="120" cy="73" r="3" fill="#00FF41" stroke="#00CC33" strokeWidth="1"/>
            
            {/* DRS Zone 1 Callout */}
            <line x1="120" y1="73" x2="150" y2="50" stroke="#00FF41" strokeWidth="2"/>
            <rect x="130" y="40" width="80" height="20" fill="#00FF41" rx="3"/>
            <text x="170" y="47" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">DRS</text>
            <text x="170" y="56" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">DETECTION</text>
            
            {/* DRS Zone 2 Indicator */}
            <circle cx="270" cy="175" r="3" fill="#00FF41" stroke="#00CC33" strokeWidth="1"/>
            
            {/* DRS Zone 2 Callout */}
            <line x1="270" y1="175" x2="200" y2="195" stroke="#00FF41" strokeWidth="2"/>
            <rect x="120" y="185" width="80" height="20" fill="#00FF41" rx="3"/>
            <text x="160" y="192" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">DRS</text>
            <text x="160" y="201" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">DETECTION</text>
          </g>

          {/* Speed Trap - Callout Style */}
          <g>
            {/* Speed Trap Indicator */}
            <circle cx="290" cy="167" r="3" fill="#FF1E9E" stroke="#CC1A7A" strokeWidth="1"/>
            
            {/* Speed Trap Callout */}
            <line x1="290" y1="167" x2="320" y2="140" stroke="#FF1E9E" strokeWidth="2"/>
            <rect x="280" y="130" width="50" height="20" fill="#FF1E9E" rx="3"/>
            <text x="305" y="137" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">SPEED</text>
            <text x="305" y="146" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">TRAP</text>
          </g>

          {/* Pit Lane - Clean line */}
          <path
            d="M 70 150 L 90 155 L 110 160 L 130 165 L 150 170 L 170 175 L 190 180 L 210 185"
            fill="none"
            stroke="#FFFF00"
            strokeWidth="3"
            strokeDasharray="4,4"
            opacity="0.8"
          />
          
          {/* Pit Lane Label */}
          <text x="140" y="165" textAnchor="middle" className="text-xs fill-volley-yellow font-bold">
            PIT LANE
          </text>

          {/* Driver Position Markers with Enhanced Pit Lane Logic */}
          {raceState.drivers.map((driver, index) => {
            const isPlayer = driver.isPlayer;
            const teamColor = driver.team === 'volley' ? '#FFD700' : 
                             driver.team === 'storm' ? '#1E3A8A' : '#7C3AED';
            
            // Use the animated position system
            const position = getDriverPosition(driver, index);
            
            const isSwapping = positionSwapAnimating.includes(driver.id);
            const isPitting = driver.status === 'pitting';
            
            // Add pulsing animation for player drivers and different animation for pitting cars
            const pulseAnimation = isPlayer ? 'animate-pulse' : '';
            const pittingAnimation = isPitting ? 'animate-bounce' : '';
            
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
                
                {/* Pit stop indicator */}
                {isPitting && (
                  <g>
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r="8"
                      fill="none"
                      stroke="#FFD700"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      className="animate-spin"
                    />
                    <text
                      x={position.x}
                      y={position.y - 12}
                      textAnchor="middle"
                      fontSize="6"
                      fill="#FFD700"
                      fontWeight="bold"
                    >
                      PIT
                    </text>
                  </g>
                )}
                
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="6"
                  fill={teamColor}
                  stroke={isPlayer ? '#FFD700' : '#C0C0C0'}
                  strokeWidth="2"
                  className={`transition-all duration-500 ${pulseAnimation} ${pittingAnimation} ${isSwapping ? 'animate-pulse' : ''}`}
                />
                <text
                  x={position.x}
                  y={position.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8"
                  fill="white"
                  fontWeight="bold"
                  className="transition-all duration-500"
                >
                  {driver.position}
                </text>
                
                {/* Speed indicator trail */}
                <circle
                  cx={position.x - 3}
                  cy={position.y}
                  r="1.5"
                  fill={teamColor}
                  opacity="0.6"
                  className="transition-all duration-700"
                />
                <circle
                  cx={position.x - 6}
                  cy={position.y}
                  r="1"
                  fill={teamColor}
                  opacity="0.3"
                  className="transition-all duration-1000"
                />
                
                {/* Speed display */}
                <text
                  x={position.x + 12}
                  y={position.y - 2}
                  fontSize="7"
                  fill="#00FF41"
                  fontWeight="bold"
                  className="transition-all duration-500"
                >
                  {driver.speed}
                </text>
                <text
                  x={position.x + 12}
                  y={position.y + 6}
                  fontSize="5"
                  fill="#00FF41"
                  className="transition-all duration-500"
                >
                  km/h
                </text>
              </g>
            );
          })}
        </svg>
        
        {/* Position Swap Notification */}
        {positionSwapAnimating.length > 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-volley-yellow/90 text-black font-bold px-4 py-2 rounded animate-bounce">
            🔄 POSITION SWAP!
          </div>
        )}
      </div>
      
      {/* Clean Track Legend */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-volley-yellow border border-f1-yellow"></div>
            <span>Scuderia Volley</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-storm-blue border border-f1-silver"></div>
            <span>Storm Racing</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-valkyrie-purple border border-f1-silver"></div>
            <span>Valkyrie GP</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-f1-red rounded-sm"></div>
            <span>Sector 1</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-f1-blue rounded-sm"></div>
            <span>Sector 2</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-f1-yellow rounded-sm"></div>
            <span>Sector 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackVisualization; 