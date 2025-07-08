import { useState, useEffect, useCallback } from 'react';
import { RaceState, VoiceCommand, AudioEvent, LLMResponse, WeatherForecast } from '../types';
import { LLMService } from '../services/llmService';
import { ttsService } from '../services/ttsService';

interface VoiceSystemState {
  lastCommentary: string;
  lastDriverResponse: string;
  lastStrategySuggestion: string;
  audioEvents: AudioEvent[];
  isProcessingCommentary: boolean;
  isProcessingDriverResponse: boolean;
  isProcessingStrategy: boolean;
}

export const useVoiceSystem = (raceState: RaceState) => {
  const [voiceSystemState, setVoiceSystemState] = useState<VoiceSystemState>({
    lastCommentary: '',
    lastDriverResponse: '',
    lastStrategySuggestion: '',
    audioEvents: [],
    isProcessingCommentary: false,
    isProcessingDriverResponse: false,
    isProcessingStrategy: false
  });

  const [llmService] = useState(() => new LLMService());
  const [commentaryTimer, setCommentaryTimer] = useState<number | null>(null);

  // Generate commentary periodically
  useEffect(() => {
    if (!raceState.isActive || raceState.isPaused) return;

    const generatePeriodicCommentary = async () => {
      if (voiceSystemState.isProcessingCommentary) return;

      console.log('[Voice] Generating commentary...');
      setVoiceSystemState(prev => ({ ...prev, isProcessingCommentary: true }));

      try {
        const recentEvents = raceState.events
          .slice(-3)
          .map(event => event.message);

        const commentary = await llmService.generateCommentary(raceState, recentEvents);
        
        if (commentary.content) {
          console.log('[Voice] Commentary generated:', commentary.content);
          setVoiceSystemState(prev => ({
            ...prev,
            lastCommentary: commentary.content,
            audioEvents: [
              ...prev.audioEvents.slice(-10), // Keep last 10 events
              {
                id: `commentary-${Date.now()}`,
                type: 'commentary',
                message: commentary.content,
                speaker: 'commentator',
                priority: 5,
                timestamp: Date.now()
              }
            ]
          }));

          // Speak the commentary
          await ttsService.speakCommentary(commentary.content);
          console.log('[Voice] Commentary spoken successfully');
        }
      } catch (error) {
        console.error('Commentary generation error:', error);
      } finally {
        setVoiceSystemState(prev => ({ ...prev, isProcessingCommentary: false }));
      }
    };

    // Generate commentary every 10-15 seconds
    const timer = window.setInterval(generatePeriodicCommentary, 12000);
    setCommentaryTimer(timer);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [raceState.isActive, raceState.isPaused, raceState.currentLap, llmService, voiceSystemState.isProcessingCommentary]);

  // Generate driver response to voice commands
  const generateDriverResponse = useCallback(async (command: VoiceCommand): Promise<void> => {
    console.log('[Voice] Generating driver response for command:', command);
    
    if (voiceSystemState.isProcessingDriverResponse) {
      console.log('[Voice] Driver response already processing, skipping...');
      return;
    }

    setVoiceSystemState(prev => ({ ...prev, isProcessingDriverResponse: true }));

    try {
      // Get target driver(s)
      const targetDrivers = command.target === 'both' 
        ? raceState.drivers.filter(d => d.isPlayer)
        : raceState.drivers.filter(d => d.id === command.target);

      console.log('[Voice] Target drivers found:', targetDrivers.length);

      if (targetDrivers.length === 0) {
        console.warn('No valid target drivers found for command:', command);
        return;
      }

      // Generate response for each target driver
      for (const driver of targetDrivers) {
        console.log(`[Voice] Generating response for driver: ${driver.name} (${driver.id})`);
        
        const response = await llmService.generateDriverResponse(
          command,
          driver.name,
          driver.morale
        );

        if (response.content) {
          console.log(`[Voice] Driver response generated: "${response.content}"`);
          
          setVoiceSystemState(prev => ({
            ...prev,
            lastDriverResponse: response.content,
            audioEvents: [
              ...prev.audioEvents.slice(-10),
              {
                id: `driver-response-${Date.now()}`,
                type: 'driver-radio',
                message: response.content,
                speaker: driver.id === 'driver-1' ? 'driver1' : 'driver2',
                priority: 8,
                timestamp: Date.now()
              }
            ]
          }));

          // Speak the driver response
          const driverSpeaker = driver.id === 'driver-1' ? 'driver1' : 'driver2';
          console.log(`[Voice] Speaking driver response with ${driverSpeaker}: "${response.content}"`);
          
          try {
            await ttsService.speakDriverResponse(response.content, driverSpeaker);
            console.log(`[Voice] Driver response spoken successfully`);
          } catch (ttsError) {
            console.error('[Voice] TTS error for driver response:', ttsError);
          }
        } else {
          console.warn('[Voice] No response content generated for driver:', driver.name);
        }
      }
    } catch (error) {
      console.error('Driver response generation error:', error);
    } finally {
      setVoiceSystemState(prev => ({ ...prev, isProcessingDriverResponse: false }));
    }
  }, [raceState.drivers, llmService, voiceSystemState.isProcessingDriverResponse]);

  // Generate strategy suggestions
  const generateStrategySuggestion = useCallback(async (): Promise<LLMResponse | null> => {
    if (voiceSystemState.isProcessingStrategy) return null;

    console.log('[Voice] Generating strategy suggestion...');
    setVoiceSystemState(prev => ({ ...prev, isProcessingStrategy: true }));

    try {
      const weatherForecast: WeatherForecast[] = []; // TODO: Add weather forecast data
      const suggestion = await llmService.generateStrategySuggestion(raceState, weatherForecast);

      if (suggestion.content) {
        console.log('[Voice] Strategy suggestion generated:', suggestion.content);
        setVoiceSystemState(prev => ({
          ...prev,
          lastStrategySuggestion: suggestion.content,
          audioEvents: [
            ...prev.audioEvents.slice(-10),
            {
              id: `strategy-${Date.now()}`,
              type: 'engineer',
              message: suggestion.content,
              speaker: 'engineer',
              priority: 6,
              timestamp: Date.now()
            }
          ]
        }));

        // Speak the strategy suggestion
        await ttsService.speakEngineerMessage(suggestion.content);
        console.log('[Voice] Strategy suggestion spoken successfully');
      }

      return suggestion;
    } catch (error) {
      console.error('Strategy suggestion error:', error);
      return null;
    } finally {
      setVoiceSystemState(prev => ({ ...prev, isProcessingStrategy: false }));
    }
  }, [raceState, llmService, voiceSystemState.isProcessingStrategy]);

  // Clear audio events
  const clearAudioEvents = useCallback(() => {
    setVoiceSystemState(prev => ({ ...prev, audioEvents: [] }));
  }, []);

  // Stop all audio
  const stopAllAudio = useCallback(() => {
    ttsService.stopSpeaking();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (commentaryTimer) {
        clearInterval(commentaryTimer);
      }
      stopAllAudio();
    };
  }, [commentaryTimer, stopAllAudio]);

  return {
    voiceSystemState,
    generateDriverResponse,
    generateStrategySuggestion,
    clearAudioEvents,
    stopAllAudio,
    isLLMEnabled: llmService.isAPIEnabled(),
    isTTSSupported: ttsService.isSupported()
  };
}; 