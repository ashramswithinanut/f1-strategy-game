import { RaceState, UIState, Driver, Team } from '../types';

// Mock Drivers
export const mockDrivers: Driver[] = [
  {
    id: 'driver-1',
    name: 'Marco Rossi',
    team: 'volley',
    position: 3,
    lapTime: 87.234,
    bestLap: 86.891,
    tyreCompound: 'medium',
    tyreAge: 12,
    fuel: 68,
    morale: 85,
    aggression: 75,
    isPlayer: true,
    status: 'racing',
    speed: 245
  },
  {
    id: 'driver-2', 
    name: 'Alex Thunder',
    team: 'volley',
    position: 5,
    lapTime: 87.891,
    bestLap: 87.234,
    tyreCompound: 'medium',
    tyreAge: 12,
    fuel: 72,
    morale: 78,
    aggression: 82,
    isPlayer: true,
    status: 'racing',
    speed: 242
  },
  {
    id: 'driver-3',
    name: 'Storm Driver 1',
    team: 'storm',
    position: 1,
    lapTime: 86.234,
    bestLap: 85.891,
    tyreCompound: 'soft',
    tyreAge: 8,
    fuel: 65,
    morale: 92,
    aggression: 88,
    isPlayer: false,
    status: 'racing',
    speed: 248
  },
  {
    id: 'driver-4',
    name: 'Valkyrie Driver 1',
    team: 'valkyrie',
    position: 2,
    lapTime: 86.891,
    bestLap: 86.234,
    tyreCompound: 'soft',
    tyreAge: 9,
    fuel: 67,
    morale: 89,
    aggression: 85,
    isPlayer: false,
    status: 'racing',
    speed: 246
  }
];

// Mock Teams
export const mockTeams: Team[] = [
  {
    id: 'volley',
    name: 'Scuderia Volley',
    color: '#FFD700',
    drivers: ['driver-1', 'driver-2'],
    constructorPoints: 145,
    strategy: {
      tyreStrategy: [
        { compound: 'medium', expectedLaps: 20, performance: 0.95, degradation: 0.02 },
        { compound: 'hard', expectedLaps: 30, performance: 0.92, degradation: 0.015 }
      ],
      fuelStrategy: 70,
      targetPosition: 3,
      riskLevel: 'balanced'
    }
  },
  {
    id: 'storm',
    name: 'Storm Racing',
    color: '#1E3A8A',
    drivers: ['driver-3'],
    constructorPoints: 198,
    strategy: {
      tyreStrategy: [
        { compound: 'soft', expectedLaps: 15, performance: 1.0, degradation: 0.025 }
      ],
      fuelStrategy: 65,
      targetPosition: 1,
      riskLevel: 'aggressive'
    }
  },
  {
    id: 'valkyrie',
    name: 'Valkyrie GP',
    color: '#7C3AED',
    drivers: ['driver-4'],
    constructorPoints: 167,
    strategy: {
      tyreStrategy: [
        { compound: 'soft', expectedLaps: 16, performance: 0.98, degradation: 0.023 }
      ],
      fuelStrategy: 67,
      targetPosition: 2,
      riskLevel: 'balanced'
    }
  }
];

// Mock Race State
export const mockRaceState: RaceState = {
  currentLap: 1,
  totalLaps: 10,
  raceTime: 0, // seconds
  weather: 'cloudy',
  trackCondition: 'dry',
  flags: 'green',
  drivers: mockDrivers,
  teams: mockTeams,
  events: [
    {
      id: 'event-1',
      type: 'pit-stop',
      lap: 1,
      message: 'Race is starting...',
      severity: 'info',
      timestamp: Date.now() - 180000
    },
    {
      id: 'event-2',
      type: 'weather',
      lap: 1,
      message: 'Weather looks good for racing',
      severity: 'info',
      timestamp: Date.now() - 120000
    }
  ],
  isActive: false,
  isPaused: false
};

// Mock UI State
export const mockUIState: UIState = {
  activePanel: 'track',
  isVoiceListening: false,
  lastCommand: null,
  notifications: [
    {
      id: 'notif-1',
      type: 'info',
      message: 'Voice system initialized',
      timestamp: Date.now() - 30000,
      duration: 3000
    }
  ],
  settings: {
    volume: 0.8,
    voiceEnabled: true,
    difficulty: 'medium',
    language: 'en',
    theme: 'dark'
  }
};

// Mock Weather Forecast
export const mockWeatherForecast = [
  { condition: 'cloudy' as const, probability: 0.8, lapStart: 1, lapEnd: 20 },
  { condition: 'light-rain' as const, probability: 0.6, lapStart: 21, lapEnd: 35 },
  { condition: 'heavy-rain' as const, probability: 0.4, lapStart: 36, lapEnd: 45 },
  { condition: 'cloudy' as const, probability: 0.7, lapStart: 46, lapEnd: 52 }
];

// Utility functions for mock data
export const getDriverByPosition = (position: number) => 
  mockDrivers.find(d => d.position === position);

export const getPlayerDrivers = () => 
  mockDrivers.filter(d => d.isPlayer);

export const getTeamByName = (name: string) => 
  mockTeams.find(t => t.name === name);

export const updateDriverPosition = (driverId: string, newPosition: number) => {
  const driver = mockDrivers.find(d => d.id === driverId);
  if (driver) {
    driver.position = newPosition;
  }
};

export const simulateLapTime = (baseTime: number, variation: number = 0.5) => {
  return baseTime + (Math.random() - 0.5) * variation;
}; 