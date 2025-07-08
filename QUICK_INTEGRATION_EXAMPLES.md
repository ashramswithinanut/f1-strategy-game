# 🚀 Quick Integration Examples

## Computer 2 (Voice & AI) - Start Here

### 1. Basic Voice Interface Implementation

```typescript
// src/components/Voice/VoiceInterface.tsx
import React, { useState, useEffect } from 'react';
import { VoiceCommand } from '../../types';

interface VoiceInterfaceProps {
  isListening: boolean;
  onCommand: (command: VoiceCommand) => void;
  onStateChange: (listening: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  isListening, 
  onCommand, 
  onStateChange 
}) => {
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRecognition = new (window as any).webkitSpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      
      speechRecognition.onresult = (event: any) => {
        const currentTranscript = event.results[event.results.length - 1][0].transcript;
        setTranscript(currentTranscript);
        
        if (event.results[event.results.length - 1].isFinal) {
          const command = parseVoiceCommand(currentTranscript);
          if (command) {
            onCommand(command);
          }
        }
      };
      
      setRecognition(speechRecognition);
    }
  }, []);

  const parseVoiceCommand = (text: string): VoiceCommand | null => {
    const lowerText = text.toLowerCase();
    
    // Pit stop commands
    if (lowerText.includes('box') || lowerText.includes('pit')) {
      const target = lowerText.includes('both') ? 'both' : 
                   lowerText.includes('driver 1') ? 'driver1' : 'driver2';
      
      let tyreCompound: any = 'medium';
      if (lowerText.includes('soft')) tyreCompound = 'soft';
      if (lowerText.includes('hard')) tyreCompound = 'hard';
      if (lowerText.includes('intermediate')) tyreCompound = 'intermediate';
      
      return {
        type: 'pit-stop',
        target,
        params: { tyreCompound }
      };
    }
    
    // Push commands
    if (lowerText.includes('push')) {
      const target = lowerText.includes('both') ? 'both' : 
                   lowerText.includes('driver 1') ? 'driver1' : 'driver2';
      return { type: 'push', target };
    }
    
    // Add more command parsing...
    
    return null;
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      onStateChange(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      onStateChange(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-tempesta-red/80 backdrop-blur-sm rounded-lg p-4 min-w-64">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-f1-yellow animate-pulse' : 'bg-f1-silver'}`} />
          <span className="text-sm font-bold">TEAM RADIO</span>
        </div>
        
        {transcript && (
          <div className="text-sm bg-black/20 rounded p-2 mb-2">
            "{transcript}"
          </div>
        )}
        
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-full px-4 py-2 rounded font-bold ${
            isListening 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-f1-yellow text-black hover:bg-f1-yellow/80'
          }`}
        >
          {isListening ? '🔴 STOP' : '🎤 TALK'}
        </button>
      </div>
    </div>
  );
};

export default VoiceInterface;
```

### 2. LLM Commentary Service

```typescript
// src/services/llmService.ts - Enhance existing file
import { RaceState, RaceEvent, Driver, VoiceCommand } from '../types';

export const generateRaceCommentary = async (raceState: RaceState, event: RaceEvent): Promise<string> => {
  const prompt = `You are an F1 race commentator. Current situation:
    - Lap ${raceState.currentLap}/${raceState.totalLaps}
    - Weather: ${raceState.weather}
    - Event: ${event.message}
    
    Provide exciting 1-2 sentence commentary:`;
    
  // Your OpenAI API call here
  const response = await fetch('/api/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  
  return response.text();
};

export const generateDriverResponse = async (command: VoiceCommand, driver: Driver): Promise<string> => {
  const responses = {
    'pit-stop': [`Copy that, boxing this lap!`, `Understood, coming in!`],
    'push': [`Pushing now!`, `Give me everything this car has!`],
    'conserve': [`Understood, managing the tyres`, `Copy, bringing it home`],
  };
  
  const options = responses[command.type] || [`Copy that!`];
  return options[Math.floor(Math.random() * options.length)];
};
```

## Computer 1 (Strategy Feed) - Start Here

### 1. Strategy Feed Component

```typescript
// src/components/StrategyFeed/StrategyFeed.tsx
import React from 'react';
import { RaceState, UIState } from '../../types';

interface StrategyFeedProps {
  raceState: RaceState;
  uiState: UIState;
}

const StrategyFeed: React.FC<StrategyFeedProps> = ({ raceState, uiState }) => {
  const playerDrivers = raceState.drivers.filter(d => d.isPlayer);
  const recentEvents = raceState.events.slice(-5).reverse();

  return (
    <div className="h-full flex flex-col space-y-4">
      
      {/* Live Timing */}
      <div className="bg-f1-black/50 rounded-lg p-4">
        <h3 className="text-f1-yellow font-bold mb-2">📊 LIVE TIMING</h3>
        <div className="space-y-2">
          {playerDrivers.map(driver => (
            <div key={driver.id} className="flex justify-between items-center">
              <span className="font-bold">P{driver.position} {driver.name}</span>
              <div className="text-right">
                <div className="text-f1-yellow">{driver.lapTime.toFixed(3)}s</div>
                <div className="text-xs text-f1-silver">Best: {driver.bestLap.toFixed(3)}s</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tyre Strategy */}
      <div className="bg-f1-black/50 rounded-lg p-4">
        <h3 className="text-f1-yellow font-bold mb-2">🏎️ TYRE STRATEGY</h3>
        <div className="space-y-2">
          {playerDrivers.map(driver => (
            <div key={driver.id} className="flex justify-between items-center">
              <span>{driver.name}</span>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${
                  driver.tyreCompound === 'soft' ? 'bg-red-500' :
                  driver.tyreCompound === 'medium' ? 'bg-yellow-500' :
                  driver.tyreCompound === 'hard' ? 'bg-gray-300' : 'bg-blue-500'
                }`} />
                <span className="text-sm">{driver.tyreAge} laps</span>
                <span className="text-xs text-f1-silver">{driver.fuel}% fuel</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Forecast */}
      <div className="bg-f1-black/50 rounded-lg p-4">
        <h3 className="text-f1-yellow font-bold mb-2">🌦️ WEATHER</h3>
        <div className="text-center">
          <div className="text-2xl mb-1">
            {raceState.weather === 'sunny' ? '☀️' :
             raceState.weather === 'cloudy' ? '☁️' :
             raceState.weather === 'light-rain' ? '🌧️' : '⛈️'}
          </div>
          <div className="text-sm capitalize">{raceState.weather.replace('-', ' ')}</div>
          <div className="text-xs text-f1-silver mt-1">Track: {raceState.trackCondition}</div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-f1-black/50 rounded-lg p-4 flex-1">
        <h3 className="text-f1-yellow font-bold mb-2">📡 RACE EVENTS</h3>
        <div className="space-y-1 text-sm">
          {recentEvents.map(event => (
            <div key={event.id} className="flex justify-between">
              <span className="text-f1-silver">L{event.lap}</span>
              <span className={`${
                event.severity === 'critical' ? 'text-red-400' :
                event.severity === 'warning' ? 'text-yellow-400' : 'text-f1-silver'
              }`}>
                {event.message}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Recommendations */}
      <div className="bg-tempesta-red/20 rounded-lg p-4">
        <h3 className="text-f1-yellow font-bold mb-2">💡 STRATEGY</h3>
        <div className="text-sm space-y-1">
          {getStrategyRecommendations(raceState).map((rec, index) => (
            <div key={index} className="text-f1-silver">• {rec}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Strategy recommendation logic
const getStrategyRecommendations = (raceState: RaceState): string[] => {
  const recommendations = [];
  
  // Tyre age recommendations
  raceState.drivers.filter(d => d.isPlayer).forEach(driver => {
    if (driver.tyreAge > 15) {
      recommendations.push(`${driver.name}: Consider pit stop - tyres aging`);
    }
    if (driver.fuel < 20) {
      recommendations.push(`${driver.name}: Low fuel - pit soon`);
    }
  });
  
  // Weather recommendations
  if (raceState.weather.includes('rain') && 
      raceState.drivers.some(d => d.isPlayer && !d.tyreCompound.includes('wet'))) {
    recommendations.push('Rain detected - switch to wet tyres');
  }
  
  return recommendations.length ? recommendations : ['No immediate strategy changes needed'];
};

export default StrategyFeed;
```

## 🔗 Integration Checklist

### Computer 2 Tasks:
- [ ] Implement voice recognition in `VoiceInterface.tsx`
- [ ] Create command parsing logic
- [ ] Add LLM integration for commentary
- [ ] Test voice commands execute properly

### Computer 1 Tasks:
- [ ] Implement strategy feed layout
- [ ] Add real-time data display
- [ ] Create strategy recommendation engine
- [ ] Add weather forecast integration

## 🚀 Quick Start

1. **Copy these examples into your files**
2. **Install any additional dependencies you need**
3. **Test with the existing race engine**
4. **Enhance with your specific features**

The race engine is already running and will provide real-time data to your components! Just plug in your implementations and they'll work immediately.

## 🆘 Quick Help

**Voice Commands Format:**
```typescript
{ type: 'pit-stop', target: 'driver1', params: { tyreCompound: 'soft' } }
{ type: 'push', target: 'both' }
```

**Race Data Access:**
```typescript
raceState.currentLap        // Current lap number
raceState.drivers[0]        // First driver data
raceState.events           // Recent race events
raceState.weather          // Current weather
```

Start with these examples and build from here! 🏁 