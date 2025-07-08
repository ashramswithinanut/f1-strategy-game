// =======================
// SHARED TYPES FOR ALL TEAMS
// =======================

// Race State & Core Game Types
export interface RaceState {
  currentLap: number;
  totalLaps: number;
  raceTime: number; // in seconds
  weather: WeatherCondition;
  trackCondition: TrackCondition;
  flags: FlagStatus;
  drivers: Driver[];
  teams: Team[];
  events: RaceEvent[];
  isActive: boolean;
  isPaused: boolean;
}

export interface Driver {
  id: string;
  name: string;
  team: string;
  position: number;
  lapTime: number;
  bestLap: number;
  tyreCompound: TyreCompound;
  tyreAge: number;
  fuel: number;
  morale: number;
  aggression: number;
  isPlayer: boolean;
  status: DriverStatus;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  drivers: string[]; // driver IDs
  constructorPoints: number;
  strategy: TeamStrategy;
}

// Weather & Track Conditions
export type WeatherCondition = 'sunny' | 'cloudy' | 'light-rain' | 'heavy-rain' | 'storm';
export type TrackCondition = 'dry' | 'damp' | 'wet' | 'flooded';

export interface WeatherForecast {
  condition: WeatherCondition;
  probability: number;
  lapStart: number;
  lapEnd: number;
}

// Tyre System
export type TyreCompound = 'soft' | 'medium' | 'hard' | 'intermediate' | 'wet';

export interface TyreStrategy {
  compound: TyreCompound;
  expectedLaps: number;
  performance: number;
  degradation: number;
}

// Flags & Events
export type FlagStatus = 'green' | 'yellow' | 'red' | 'blue' | 'checkered' | 'safety-car' | 'vsc';

export interface RaceEvent {
  id: string;
  type: EventType;
  lap: number;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: number;
}

export type EventType = 'crash' | 'mechanical' | 'weather' | 'flag' | 'pit-stop' | 'penalty' | 'drs';

export type DriverStatus = 'racing' | 'pitting' | 'retired' | 'dnf' | 'disqualified';

// Strategy & Commands
export interface TeamStrategy {
  tyreStrategy: TyreStrategy[];
  fuelStrategy: number;
  targetPosition: number;
  riskLevel: 'conservative' | 'balanced' | 'aggressive';
}

// Voice Command System
export interface VoiceCommand {
  id: string;
  type: CommandType;
  target: string; // driver ID or "both"
  params: CommandParams;
  timestamp: number;
  confidence: number;
}

export type CommandType = 
  | 'pit-stop'
  | 'push'
  | 'conserve'
  | 'swap-positions'
  | 'defend'
  | 'attack'
  | 'tyre-change'
  | 'fuel-save'
  | 'radio-check';

export interface CommandParams {
  tyreCompound?: TyreCompound;
  targetDriver?: string;
  intensity?: 'light' | 'medium' | 'maximum';
  duration?: number;
  [key: string]: any;
}

// Audio & Commentary
export interface AudioEvent {
  id: string;
  type: AudioType;
  message: string;
  speaker: AudioSpeaker;
  priority: number;
  timestamp: number;
}

export type AudioType = 'commentary' | 'driver-radio' | 'engineer' | 'pit-crew' | 'announcement';
export type AudioSpeaker = 'commentator' | 'driver1' | 'driver2' | 'engineer' | 'pit-crew' | 'race-director';

// UI State Management
export interface UIState {
  activePanel: 'track' | 'strategy' | 'radio' | 'settings';
  isVoiceListening: boolean;
  lastCommand: VoiceCommand | null;
  notifications: Notification[];
  settings: GameSettings;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
  duration: number;
}

export interface GameSettings {
  volume: number;
  voiceEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  theme: 'dark' | 'light';
}

// API Response Types
export interface LLMResponse {
  content: string;
  confidence: number;
  suggestions?: string[];
  context?: any;
}

export interface TTSRequest {
  text: string;
  voice: AudioSpeaker;
  priority: number;
}

// Game Flow
export interface GamePhase {
  phase: 'pre-race' | 'race' | 'post-race';
  timeRemaining: number;
  canPause: boolean;
}

export interface GameResult {
  finalPositions: Driver[];
  constructorPoints: number;
  raceTime: number;
  events: RaceEvent[];
  performance: PerformanceMetrics;
}

export interface PerformanceMetrics {
  commandsIssued: number;
  strategicDecisions: number;
  responseTime: number;
  accuracy: number;
}

// Mock Data Helpers (for development)
export interface MockDataConfig {
  useRealData: boolean;
  raceSpeed: number;
  eventFrequency: number;
  weatherChangeChance: number;
} 