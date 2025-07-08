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
  const isInitializedRef = useRef(false);
  const onRaceEndRef = useRef(onRaceEnd);

  // Update the onRaceEnd ref when it changes
  useEffect(() => {
    onRaceEndRef.current = onRaceEnd;
  }, [onRaceEnd]);

  // Initialize race engine only once - never cleanup unless component unmounts
  useEffect(() => {
    if (!isInitializedRef.current) {
      console.log('[useRaceEngine] ONE-TIME INITIALIZATION - Creating race engine');
      
      const engine = new RaceEngine(mockRaceState);
      raceEngineRef.current = engine;
      isInitializedRef.current = true;
      
      // Set up event listeners
      engine.on('raceStateUpdated', (updatedState: RaceState) => {
        console.log('[useRaceEngine] Race state updated:', updatedState.currentLap, '/', updatedState.totalLaps);
        setRaceState(updatedState);
      });
      
      engine.on('eventTriggered', (event: any) => {
        console.log('[useRaceEngine] Race event triggered:', event);
      });
      
      engine.on('raceStarted', () => {
        console.log('[useRaceEngine] Race started event received');
      });
      
      engine.on('raceEnded', () => {
        console.log('[useRaceEngine] Race ended event received');
        if (onRaceEndRef.current) {
          onRaceEndRef.current();
        }
      });
      
      engine.on('raceReset', (resetState: RaceState) => {
        console.log('[useRaceEngine] Race reset event received');
        setRaceState(resetState);
      });

      console.log('[useRaceEngine] Race engine initialized successfully');
    }

    // Only cleanup on component unmount (empty dependency array ensures this)
    return () => {
      console.log('[useRaceEngine] COMPONENT UNMOUNTING - Cleaning up race engine');
      if (raceEngineRef.current && isInitializedRef.current) {
        raceEngineRef.current.stop();
        raceEngineRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []); // Empty dependency array - only run once

  // Handle game phase changes
  useEffect(() => {
    if (!raceEngineRef.current) return;
    
    console.log('[useRaceEngine] Game phase changed to:', gamePhase.phase);
    
    if (gamePhase.phase === 'race') {
      console.log('[useRaceEngine] Starting race engine...');
      raceEngineRef.current.start();
    }
  }, [gamePhase.phase]);

  const executeCommand = useCallback((command: any) => {
    if (raceEngineRef.current) {
      raceEngineRef.current.executeCommand(command);
    }
  }, []);

  const pauseRace = useCallback(() => {
    if (raceEngineRef.current) {
      raceEngineRef.current.pause();
    }
  }, []);

  const resumeRace = useCallback(() => {
    if (raceEngineRef.current) {
      raceEngineRef.current.resume();
    }
  }, []);

  const resetRace = useCallback(() => {
    if (raceEngineRef.current) {
      console.log('[useRaceEngine] Manual reset requested');
      raceEngineRef.current.reset();
    }
  }, []);

  const startRace = useCallback(() => {
    if (raceEngineRef.current) {
      console.log('[useRaceEngine] Manual start requested');
      raceEngineRef.current.start();
    }
  }, []);

  return {
    raceState,
    executeCommand,
    pauseRace,
    resumeRace,
    resetRace,
    startRace,
    raceEngine: raceEngineRef.current
  };
}; 