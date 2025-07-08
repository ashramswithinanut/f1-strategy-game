import { useEffect, useRef, useState, useCallback } from 'react';
import { RaceEngine } from '../engine/RaceEngine';
import { RaceState, GamePhase } from '../types';
import { mockRaceState } from '../data/mockData';

interface UseRaceEngineProps {
  gamePhase: GamePhase;
  onRaceEnd?: () => void;
}

export const useRaceEngine = ({ gamePhase, onRaceEnd }: UseRaceEngineProps) => {
  const [raceState, setRaceState] = useState<RaceState>(mockRaceState);
  const raceEngineRef = useRef<RaceEngine | null>(null);

  useEffect(() => {
    // Initialize race engine with mock data
    console.log('[useRaceEngine] Initializing race engine with mock data:', mockRaceState);
    raceEngineRef.current = new RaceEngine(mockRaceState);
    
    // Set up race engine event listeners
    raceEngineRef.current.on('raceStateUpdated', (updatedState: RaceState) => {
      console.log('[useRaceEngine] Race state updated:', updatedState.currentLap, '/', updatedState.totalLaps);
      setRaceState(updatedState);
    });
    
    raceEngineRef.current.on('eventTriggered', (event: any) => {
      console.log('[useRaceEngine] Race event triggered:', event);
    });
    
    raceEngineRef.current.on('raceStarted', () => {
      console.log('[useRaceEngine] Race started event received');
    });
    
    raceEngineRef.current.on('raceEnded', () => {
      console.log('[useRaceEngine] Race ended event received');
      if (onRaceEnd) {
        onRaceEnd();
      }
    });
    
    return () => {
      if (raceEngineRef.current) {
        raceEngineRef.current.stop();
      }
    };
  }, []);

  // Start race engine when race phase begins
  useEffect(() => {
    console.log('[useRaceEngine] Game phase changed to:', gamePhase.phase);
    if (gamePhase.phase === 'race' && raceEngineRef.current) {
      console.log('[useRaceEngine] Starting race engine...');
      raceEngineRef.current.start();
    }
  }, [gamePhase.phase]);

  // Update the onRaceEnd callback when it changes
  useEffect(() => {
    if (raceEngineRef.current) {
      raceEngineRef.current.off('raceEnded');
      raceEngineRef.current.on('raceEnded', () => {
        console.log('[useRaceEngine] Race ended event received');
        if (onRaceEnd) {
          onRaceEnd();
        }
      });
    }
  }, [onRaceEnd]);

  const executeCommand = useCallback((command: any) => {
    if (raceEngineRef.current) {
      raceEngineRef.current.executeCommand(command);
    }
  }, []);

  return {
    raceState,
    executeCommand,
    raceEngine: raceEngineRef.current
  };
}; 