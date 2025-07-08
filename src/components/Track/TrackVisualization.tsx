import React, { useState, useEffect } from 'react';
import { RaceState, GamePhase, Driver } from '../../types';

interface TrackVisualizationProps {
  raceState: RaceState;
  gamePhase: GamePhase;
}

const TrackVisualization: React.FC<TrackVisualizationProps> = ({ raceState, gamePhase }) => {
  const [driverAnimations, setDriverAnimations] = useState<{[key: string]: {x: number, y: number, lapProgress: number}}>({});

  // Define the complete track path with many coordinate points for smooth animation
  const trackPath = [
    // Start/Finish straight
    { x: 60, y: 140 }, { x: 60, y: 135 }, { x: 60, y: 130 }, { x: 60, y: 125 }, { x: 60, y: 120 },
    { x: 60, y: 115 }, { x: 60, y: 110 }, { x: 60, y: 105 }, { x: 60, y: 100 }, { x: 60, y: 95 },
    { x: 60, y: 90 }, { x: 60, y: 85 }, { x: 60, y: 80 },
    // Turn 1-2 complex
    { x: 65, y: 75 }, { x: 70, y: 72 }, { x: 75, y: 70 }, { x: 80, y: 70 }, { x: 85, y: 70 },
    { x: 90, y: 70 }, { x: 95, y: 70 }, { x: 100, y: 70 }, { x: 105, y: 70 }, { x: 110, y: 70 },
    { x: 115, y: 72 }, { x: 120, y: 75 }, { x: 125, y: 77 }, { x: 130, y: 78 }, { x: 135, y: 80 },
    // Turn 3-5 complex
    { x: 140, y: 82 }, { x: 145, y: 84 }, { x: 150, y: 86 }, { x: 155, y: 88 }, { x: 160, y: 90 },
    { x: 165, y: 92 }, { x: 170, y: 94 }, { x: 175, y: 96 }, { x: 180, y: 98 }, { x: 185, y: 100 },
    { x: 190, y: 102 }, { x: 195, y: 104 }, { x: 200, y: 106 },
    // Turn 6-8 complex
    { x: 205, y: 110 }, { x: 210, y: 115 }, { x: 215, y: 120 }, { x: 220, y: 125 }, { x: 225, y: 130 },
    { x: 230, y: 135 }, { x: 235, y: 140 }, { x: 240, y: 142 },
    // Turn 9-11 complex  
    { x: 245, y: 145 }, { x: 250, y: 148 }, { x: 255, y: 150 }, { x: 260, y: 152 }, { x: 265, y: 155 },
    { x: 270, y: 158 }, { x: 275, y: 160 }, { x: 280, y: 162 }, { x: 285, y: 165 }, { x: 290, y: 168 },
    { x: 295, y: 170 }, { x: 300, y: 172 }, { x: 305, y: 175 }, { x: 310, y: 178 }, { x: 312, y: 180 },
    // Turn 12-13 complex
    { x: 310, y: 183 }, { x: 308, y: 186 }, { x: 305, y: 188 }, { x: 302, y: 190 }, { x: 300, y: 192 },
    // Turn 14-16 complex
    { x: 295, y: 194 }, { x: 290, y: 195 }, { x: 285, y: 194 }, { x: 280, y: 193 }, { x: 275, y: 192 },
    { x: 270, y: 191 }, { x: 265, y: 190 }, { x: 260, y: 189 }, { x: 255, y: 188 }, { x: 250, y: 187 },
    { x: 245, y: 186 }, { x: 240, y: 185 }, { x: 235, y: 184 }, { x: 230, y: 183 }, { x: 225, y: 182 },
    { x: 220, y: 181 }, { x: 215, y: 180 }, { x: 210, y: 179 }, { x: 205, y: 178 }, { x: 200, y: 177 },
    // Turn 17-18 and return to start
    { x: 195, y: 175 }, { x: 190, y: 173 }, { x: 185, y: 172 }, { x: 180, y: 170 }, { x: 175, y: 168 },
    { x: 170, y: 167 }, { x: 165, y: 166 }, { x: 160, y: 165 }, { x: 155, y: 164 }, { x: 150, y: 163 },
    { x: 145, y: 162 }, { x: 140, y: 161 }, { x: 135, y: 160 }, { x: 130, y: 158 }, { x: 125, y: 157 },
    { x: 120, y: 156 }, { x: 115, y: 155 }, { x: 110, y: 154 }, { x: 105, y: 153 }, { x: 100, y: 152 },
    { x: 95, y: 151 }, { x: 90, y: 150 }, { x: 85, y: 149 }, { x: 80, y: 148 }, { x: 75, y: 147 },
    { x: 70, y: 146 }, { x: 65, y: 145 }, { x: 60, y: 144 }, { x: 60, y: 142 }, { x: 60, y: 140 }
  ];

  // Calculate driver position based on lap progress and track path
  const getDriverPosition = (driver: Driver) => {
    // Get current animation state - if it exists, use it directly
    const currentAnimation = driverAnimations[driver.id];
    if (currentAnimation) {
      return { x: currentAnimation.x, y: currentAnimation.y };
    }
    
    // Fallback to start position if no animation data yet
    return { x: 60, y: 140 };
  };

  // Animation loop
  useEffect(() => {
    if (gamePhase.phase !== 'race') return;

    const animationInterval = setInterval(() => {
      setDriverAnimations(prev => {
        const newAnimations = { ...prev };
        
        raceState.drivers.forEach(driver => {
          const current = newAnimations[driver.id] || { x: 60, y: 140, lapProgress: 0 };
          
          // Calculate speed based on driver performance and race conditions
          let speed = 0.001; // Base speed
          
          // Adjust speed based on position (leaders go faster)
          if (driver.position <= 3) speed *= 1.2;
          else if (driver.position <= 6) speed *= 1.1;
          else if (driver.position >= 15) speed *= 0.9;
          
          // Adjust speed based on tire condition
          if (driver.tyreCompound === 'soft') speed *= 1.15;
          else if (driver.tyreCompound === 'medium') speed *= 1.0;
          else if (driver.tyreCompound === 'hard') speed *= 0.9;
          
          // Adjust speed based on fuel load (heavier = slower)
          const fuelWeight = driver.fuel / 100;
          speed *= (1 - fuelWeight * 0.1);
          
          // Slow down in bad weather
          if (raceState.weather === 'heavy-rain') speed *= 0.7;
          else if (raceState.weather === 'light-rain') speed *= 0.85;
          
          // Slow down under yellow flag
          if (raceState.flags === 'yellow') speed *= 0.6;
          else if (raceState.flags === 'red') speed *= 0;
          
          // Update lap progress
          const newLapProgress = (current.lapProgress + speed) % 1;
          
          // Calculate new position on track path
          const pathIndex = Math.floor(newLapProgress * (trackPath.length - 1));
          const nextIndex = (pathIndex + 1) % trackPath.length;
          const t = (newLapProgress * (trackPath.length - 1)) - pathIndex;
          
          // Interpolate between current and next track point
          const currentPoint = trackPath[pathIndex];
          const nextPoint = trackPath[nextIndex];
          
          const newX = currentPoint.x + (nextPoint.x - currentPoint.x) * t;
          const newY = currentPoint.y + (nextPoint.y - currentPoint.y) * t;
          
          newAnimations[driver.id] = {
            lapProgress: newLapProgress,
            x: newX,
            y: newY
          };
        });
        
        return newAnimations;
      });
    }, 16); // ~60 FPS

    return () => clearInterval(animationInterval);
  }, [gamePhase.phase, raceState.drivers, raceState.weather, raceState.flags]);

  const renderDriverMarker = (driver: Driver) => {
    const isPlayer = driver.isPlayer;
    const teamColor = driver.team === 'volley' ? '#FFD700' : 
                     driver.team === 'storm' ? '#1E3A8A' : '#7C3AED';
    const position = getDriverPosition(driver);
    const isPitting = driver.status === 'pitting';
    
    // Add pulsing animation for player drivers and different animation for pitting cars
    const pulseAnimation = isPlayer ? 'animate-pulse' : '';
    const pittingAnimation = isPitting ? 'animate-bounce' : '';
    
    return (
      <g key={driver.id}>
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
          r="4"
          fill={teamColor}
          stroke={isPlayer ? '#FFD700' : '#C0C0C0'}
          strokeWidth="1"
          className={`transition-all duration-100 ${pulseAnimation} ${pittingAnimation}`}
        />
        <text
          x={position.x}
          y={position.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="6"
          fill="white"
          fontWeight="bold"
          className="transition-all duration-100"
        >
          {driver.position}
        </text>
        
        {/* Speed indicator trail */}
        <circle
          cx={position.x - 2}
          cy={position.y}
          r="1"
          fill={teamColor}
          opacity="0.6"
          className="transition-all duration-200"
        />
        <circle
          cx={position.x - 4}
          cy={position.y}
          r="0.5"
          fill={teamColor}
          opacity="0.3"
          className="transition-all duration-300"
        />
        
        {/* Speed display */}
        <text
          x={position.x + 8}
          y={position.y - 2}
          fontSize="6"
          fill="#00FF41"
          fontWeight="bold"
          className="transition-all duration-100"
        >
          {driver.speed}
        </text>
        <text
          x={position.x + 8}
          y={position.y + 4}
          fontSize="4"
          fill="#00FF41"
          className="transition-all duration-100"
        >
          km/h
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

          {/* Enhanced Weather Overlay */}
          {raceState.weather !== 'sunny' && (
            <g>
              {/* Base weather overlay */}
              <rect x="0" y="0" width="350" height="220" fill="rgba(100,149,237,0.15)"/>
              
              {/* Weather-specific effects */}
              {raceState.weather === 'light-rain' && (
                <g>
                  {/* Light rain drops */}
                  {Array.from({ length: 25 }).map((_, i) => (
                    <g key={i}>
                      <line
                        x1={20 + (i * 13) % 320}
                        y1={10 + (i * 7) % 200}
                        x2={22 + (i * 13) % 320}
                        y2={16 + (i * 7) % 200}
                        stroke="#4169E1"
                        strokeWidth="1"
                        opacity="0.6"
                        className="animate-pulse"
                      />
                    </g>
                  ))}
                  <text x="175" y="20" textAnchor="middle" fill="#4169E1" fontSize="12" fontWeight="bold">
                    🌧️ LIGHT RAIN
                  </text>
                </g>
              )}
              
              {raceState.weather === 'heavy-rain' && (
                <g>
                  {/* Heavy rain drops */}
                  {Array.from({ length: 50 }).map((_, i) => (
                    <g key={i}>
                      <line
                        x1={10 + (i * 7) % 340}
                        y1={5 + (i * 4) % 210}
                        x2={13 + (i * 7) % 340}
                        y2={12 + (i * 4) % 210}
                        stroke="#1E3A8A"
                        strokeWidth="1.5"
                        opacity="0.8"
                        className="animate-pulse"
                      />
                    </g>
                  ))}
                  <text x="175" y="20" textAnchor="middle" fill="#1E3A8A" fontSize="12" fontWeight="bold">
                    ⛈️ HEAVY RAIN
                  </text>
                </g>
              )}
              
              {raceState.weather === 'storm' && (
                <g>
                  {/* Storm effects */}
                  {Array.from({ length: 75 }).map((_, i) => (
                    <g key={i}>
                      <line
                        x1={5 + (i * 5) % 345}
                        y1={2 + (i * 3) % 215}
                        x2={9 + (i * 5) % 345}
                        y2={11 + (i * 3) % 215}
                        stroke="#0F1419"
                        strokeWidth="2"
                        opacity="0.9"
                        className="animate-pulse"
                      />
                    </g>
                  ))}
                  <text x="175" y="20" textAnchor="middle" fill="#0F1419" fontSize="12" fontWeight="bold">
                    🌩️ STORM
                  </text>
                </g>
              )}
              
              {raceState.weather === 'cloudy' && (
                <g>
                  {/* Cloudy overlay */}
                  <circle cx="50" cy="40" r="20" fill="rgba(180,180,180,0.3)" />
                  <circle cx="80" cy="35" r="25" fill="rgba(180,180,180,0.3)" />
                  <circle cx="270" cy="45" r="18" fill="rgba(180,180,180,0.3)" />
                  <circle cx="300" cy="40" r="22" fill="rgba(180,180,180,0.3)" />
                  <text x="175" y="20" textAnchor="middle" fill="#4169E1" fontSize="12" fontWeight="bold">
                    ☁️ CLOUDY
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Driver Position Markers */}
          {raceState.drivers.map(renderDriverMarker)}
        </svg>
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